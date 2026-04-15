---
date: 2026-04-15
category: deployment-issues
tags: [railway, python, fastapi, ipv6, healthcheck, cold-start]
module: infrastructure
symptom: "First Railway Python microservice deployment — uvicorn not reachable internally, or healthchecks failing, or cold starts timing out"
root_cause: "Railway private networking is IPv6-only; lifespan model-load can exceed default healthcheckTimeout; pgbouncer transaction mode breaks prepared statements"
---

# Deploying a Python Service to Railway

> **Use this when** deploying a Python + FastAPI microservice to Railway for the first time in this org.
>
> Written from the biofuel-relevance-classifier deploy (first Python service on Railway for Syntech). Complements the sibling article-classifier conventions.

## 1. Bind IPv6 or internal networking breaks

Railway's **private network is IPv6-only.** If your FastAPI service binds `0.0.0.0`, other Railway services trying to reach it by private DNS (`servicename.railway.internal`) get connection refused.

Fix in the Dockerfile `CMD` or `railway.toml` `startCommand`:

```
uvicorn app.main:app --host :: --port $PORT --proxy-headers --forwarded-allow-ips=*
```

`--host ::` binds IPv6 (which also serves IPv4 via dual-stack on most kernels). `--proxy-headers` makes `request.client.host` reflect the real caller through Railway's edge. `--forwarded-allow-ips=*` trusts `X-Forwarded-For` from the edge.

## 2. Use `/readyz` for healthcheck, not `/healthz`

Two separate endpoints for two jobs:

- `/healthz` — liveness. Always returns 200 once the process is up. Used by orchestration to decide if the process is alive.
- `/readyz` — readiness. Returns 200 only after lifespan completes and all critical dependencies are reachable (DB pool open, config loaded, API keys present). Used to decide if the instance should receive traffic.

Railway config:

```toml
[deploy]
healthcheckPath = "/readyz"
healthcheckTimeout = 180
```

180s is generous for cold boot (image pull + lifespan). Tighten only after measuring p99 cold-start time.

## 3. Cold start budgets

For this service, lifespan loads config YAML, validates it via Pydantic, constructs the auth token sets, and opens the Neon connection pool. Under 2s warm; ~5-15s cold depending on image-pull latency.

Phase 2 additions (SetFit + LightGBM + bge-reranker) will push cold start to 30-60s because of PyTorch + model weight loading. When that lands, revisit `healthcheckTimeout` and consider **min-replicas = 1** on Railway so the service never scales to zero (which otherwise makes every first-request-after-idle pay the cold-start tax).

## 4. pgbouncer transaction mode + psycopg3

Neon's pooler endpoint (`-pooler.neon.tech:6432`) runs **pgbouncer in transaction mode**, which doesn't support server-side prepared statements. Default psycopg3 behaviour is to prepare statements after a threshold — this breaks against pgbouncer with cryptic errors.

Fix in `app/db.py`:

```python
AsyncConnectionPool(
    conninfo=url,
    min_size=2, max_size=10,
    kwargs={"prepare_threshold": None},  # disables server-side prepares
    open=False,
)
```

**Migrations must use the direct endpoint**, not the pooler. DDL via pgbouncer transaction mode is unreliable. Set two env vars:

- `DATABASE_URL` → pooler endpoint (for the service's runtime pool)
- `DATABASE_URL_DIRECT` → direct endpoint (for alembic migrations, run in Railway release phase or out-of-band)

## 5. Per-service Postgres schema when sharing a Neon project

When two services share a Neon project (common when one project holds all of a product's data), give each service its own Postgres schema:

```python
# migrations/env.py
context.configure(
    ...,
    version_table="alembic_version",
    version_table_schema="classifier_relevance",  # service-specific
    include_schemas=True,
)
```

`CREATE SCHEMA IF NOT EXISTS classifier_relevance` runs in env.py before alembic reads its version table. Now `classifier_relevance.alembic_version` and the sibling's `classifier_article.alembic_version` live side by side without collisions.

## 6. Fire-and-forget decision logging

Classification traffic should never block on DB writes. Pattern:

```python
class DecisionLogger:
    def submit(self, record):
        try:
            self._queue.put_nowait(record)
        except asyncio.QueueFull:
            logger.warning("decision_log_dropped_queue_full")
```

Bounded queue with drop-on-full keeps the classifier's SLO intact when Neon has a slow patch. Telemetry is best-effort; the classifier's answer is load-bearing.

## 7. Split bearer tokens: classifier vs admin

One bearer token for `/classify` (held by n8n) and a separate one for `/admin/*` (held only by ops / active-learning tools). If the n8n workflow token leaks, the admin surface — which writes to the training set — is still protected.

Each token supports comma-split rotation:

```bash
RELEVANCE_CLASSIFIER_TOKEN=old-token,new-token  # both valid during overlap
```

Rotation runbook: add new, rotate n8n credential, verify via fingerprint logs, remove old. Startup logs emit `sha256(token)[:8]` fingerprints (never raw values) so you can confirm what's active without grepping env.

## 8. Structlog + uvicorn sharing one JSON stream

Uvicorn's access log and structlog emit on different paths by default. Bridge via `structlog.stdlib.ProcessorFormatter` so everything ends up as one JSON-per-line stream to stdout (Railway's log sink).

```python
logging.basicConfig(format="%(message)s", stream=sys.stdout, level=level)
structlog.configure(
    processors=[
        structlog.contextvars.merge_contextvars,
        structlog.processors.add_log_level,
        structlog.processors.TimeStamper(fmt="iso"),
        _redact,  # mask known-sensitive keys
        structlog.processors.JSONRenderer(),
    ],
    ...
)
```

A `BaseHTTPMiddleware` binds `request_id` at request entry and calls `clear_contextvars()` at exit so context never bleeds across requests under concurrency.

## 9. Dockerfile, not Nixpacks/Railpack, for Python-with-ML

Railway's auto-detected builders (Nixpacks, Railpack) work fine for simple Python services but rebuild slowly when you have heavy native wheels (torch, sentence-transformers, FlagEmbedding). Writing a hand-tuned Dockerfile cuts build time by 5-10× once the service grows ML deps. Use multi-stage builds for further speedup when that matters.

## 10. Common mistakes to avoid

- **Binding `0.0.0.0` only.** Internal Railway calls fail silently. Always `--host ::`.
- **Reading `DATABASE_URL` for migrations.** Use `DATABASE_URL_DIRECT` so DDL doesn't go through pgbouncer.
- **Gating `/healthz` on DB connectivity.** That flaps the whole service on transient DB blips. Keep `/healthz` dumb; make `/readyz` smart.
- **Forgetting `prepare_threshold=None` in psycopg3 pool config.** Breaks under pgbouncer with a misleading "prepared statement already exists" error.
- **Using a single token for classify + admin.** Widens blast radius of any credential leak.
- **Crash-looping on one bad model artifact.** Boot in degraded mode, expose via `/readyz.checks`, alert via structlog; don't take the whole service down.
