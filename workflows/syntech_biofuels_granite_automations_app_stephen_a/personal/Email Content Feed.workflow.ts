import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : Email Content Feed
// Nodes   : 18  |  Connections: 16
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// WhenClickingExecuteWorkflow        manualTrigger
// GetNewIdeas                        notion                     [creds]
// SetData                            set
// OpenaiChatModel                    lmChatOpenAi               [creds] [ai_languageModel]
// Limit                              limit
// Markdown                           markdown
// Aggregate                          aggregate
// SendEmailUpdate                    gmail                      [creds]
// UpdateADatabasePage                notion                     [creds] [retry]
// CreateDigestableSummarySocialMediaSelection chainLlm                   [AI]
// LoopOverItems                      splitInBatches
// GroupContentByQuery                code
// StructureMessage                   set
// GetFrom24hAgo                      filter
// GroupSimilarArticles               code
// Limit2                             limit
// StickyNote1                        stickyNote
// RunHourly                          scheduleTrigger
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// WhenClickingExecuteWorkflow
//    → GetNewIdeas
//      → GetFrom24hAgo
//        → GroupContentByQuery
//          → Limit2
//            → LoopOverItems
//             .out(1) → GroupSimilarArticles
//                → SetData
//                  → Limit
//                    → CreateDigestableSummarySocialMediaSelection
//                      → Markdown
//                        → StructureMessage
//                          → Aggregate
//                            → SendEmailUpdate
//                              → LoopOverItems (↩ loop)
//                          → UpdateADatabasePage
// RunHourly
//    → GetNewIdeas (↩ loop)
//
// AI CONNECTIONS
// CreateDigestableSummarySocialMediaSelection.uses({ ai_languageModel: OpenaiChatModel })
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'QJa8YNLn4vHITmwY',
    name: 'Email Content Feed',
    active: true,
    isArchived: false,
    projectId: 'U9sMeJya1DaokkjK',
    tags: ['NEWS+'],
    settings: {
        executionOrder: 'v1',
        callerPolicy: 'workflowsFromSameOwner',
        availableInMCP: false,
        timeSavedMode: 'fixed',
        errorWorkflow: 'o41mt2JfV10VTV65',
        binaryMode: 'separate',
        timeSavedPerExecution: 30,
        timezone: 'Europe/London',
    },
})
export class EmailContentFeedWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'ce333462-d582-4abd-bf86-cfd57adf2354',
        name: 'When clicking ‘Execute workflow’',
        type: 'n8n-nodes-base.manualTrigger',
        version: 1,
        position: [-16, 64],
    })
    WhenClickingExecuteWorkflow = {};

    @node({
        id: 'dd45242a-4030-4b99-931c-db79b75bea9e',
        name: 'Get New Ideas',
        type: 'n8n-nodes-base.notion',
        version: 2.2,
        position: [208, 160],
        credentials: { notionApi: { id: 'k0ZwGrqySi9Wayf7', name: 'Stephen Notion account' } },
    })
    GetNewIdeas = {
        resource: 'databasePage',
        operation: 'getAll',
        databaseId: {
            __rl: true,
            value: '27c785c0-cfab-8137-800f-dcf3e01a3e97',
            mode: 'list',
            cachedResultName: 'Syntech Content Ideas',
            cachedResultUrl: 'https://www.notion.so/27c785c0cfab8137800fdcf3e01a3e97',
        },
        limit: 100,
        filterType: 'manual',
        filters: {
            conditions: [
                {
                    key: 'Sent To Team?|checkbox',
                    condition: 'does_not_equal',
                    checkboxValue: true,
                },
            ],
        },
        options: {
            sort: {
                sortValue: [
                    {
                        key: 'Created Date|created_time',
                        direction: 'descending',
                    },
                ],
            },
        },
    };

    @node({
        id: 'fa5da733-ecee-4279-9956-2df4206e424b',
        name: 'Set Data',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [1552, 32],
    })
    SetData = {
        assignments: {
            assignments: [
                {
                    id: 'b8255347-e690-466a-926b-1f5fefa6a2f7',
                    name: 'article_name',
                    value: '={{ $json.primary.title }}',
                    type: 'string',
                },
                {
                    id: 'b65e0c95-91ea-4461-9c15-8a2affabaa5e',
                    name: 'article_published_date',
                    value: '={{ $json.primary.publication_date }}',
                    type: 'string',
                },
                {
                    id: '8bd034bb-ac5c-4edd-8f0a-22be06c56e1e',
                    name: 'status',
                    value: '={{ $json.story_status }}',
                    type: 'string',
                },
                {
                    id: '30605d4d-f4e8-4b1b-b27b-e69848f23a59',
                    name: 'article_url',
                    value: '={{ $json.primary.source_url }}',
                    type: 'string',
                },
                {
                    id: '31ea6911-2183-42ec-9fde-3a63bec97efd',
                    name: 'story_size',
                    value: '={{ $json.story_size }}',
                    type: 'number',
                },
                {
                    id: 'b1d776bd-2658-4213-84cf-5dd3d9366782',
                    name: 'source_urls',
                    value: '={{ $json.supporting_sources?.length ? $json.supporting_sources : [$json.primary.source_url] }}',
                    type: 'array',
                },
                {
                    id: '37e36fa6-e6a2-4613-aefc-7fdd5c103d08',
                    name: 'primary_source',
                    value: '={{ $json.primary.source_name }}',
                    type: 'string',
                },
                {
                    id: '8830988a-6a30-4b00-a6b1-b83348d3a867',
                    name: 'fact_fingerprint',
                    value: '={{ $json.primary.fact_fingerprint }}',
                    type: 'string',
                },
                {
                    id: 'c5316bad-dd12-4f76-99d8-935408b0b9f7',
                    name: 'article_summary',
                    value: '={{ $json.primary.summary }}',
                    type: 'string',
                },
                {
                    id: '3328a698-6d07-40fc-b02b-78238b9a8af4',
                    name: 'notion_url',
                    value: '={{ $json.primary.notion_url }}',
                    type: 'string',
                },
                {
                    id: '03d59240-f5a0-47a3-a438-b5139de8fe17',
                    name: 'article_notion_urls',
                    value: `={{
  [
    $json.primary.notion_url,
    ...($json.articles || []).map(a => a.notion_url)
  ].filter(Boolean)
}}`,
                    type: 'array',
                },
            ],
        },
        options: {},
    };

    @node({
        id: 'a1302c11-f8c4-41e4-ab0c-91fbb343110d',
        name: 'OpenAI Chat Model',
        type: '@n8n/n8n-nodes-langchain.lmChatOpenAi',
        version: 1.3,
        position: [2080, 256],
        credentials: { openAiApi: { id: 'NoEKitspBJb0zQrp', name: 'Syntech GM OpenAi account' } },
    })
    OpenaiChatModel = {
        model: {
            __rl: true,
            mode: 'list',
            value: 'gpt-4.1-mini',
        },
        builtInTools: {},
        options: {
            temperature: 0,
        },
    };

    @node({
        id: 'cc70c663-898c-4a18-a80f-5383b2c7af43',
        name: 'Limit',
        type: 'n8n-nodes-base.limit',
        version: 1,
        position: [1776, 32],
    })
    Limit = {
        maxItems: 100,
    };

    @node({
        id: 'd1dcc470-6f59-47b7-9e40-d3393ba1e421',
        name: 'Markdown',
        type: 'n8n-nodes-base.markdown',
        version: 1,
        position: [2352, 32],
    })
    Markdown = {
        mode: 'markdownToHtml',
        markdown: '={{ $json.text }}',
        options: {
            customizedHeaderId: false,
            noHeaderId: true,
        },
    };

    @node({
        id: 'fb352711-8ed2-4502-ad07-00418e53975a',
        name: 'Aggregate',
        type: 'n8n-nodes-base.aggregate',
        version: 1,
        position: [2800, -64],
    })
    Aggregate = {
        fieldsToAggregate: {
            fieldToAggregate: [
                {
                    fieldToAggregate: 'data',
                },
                {},
            ],
        },
        options: {},
    };

    @node({
        id: '74f39d87-5b22-4373-979e-343884ea7b8f',
        webhookId: 'd93ecd81-f8b1-4168-8beb-c0af7c197837',
        name: 'Send Email Update',
        type: 'n8n-nodes-base.gmail',
        version: 2.1,
        position: [3024, 160],
        credentials: { gmailOAuth2: { id: 'rekuwr4XpMXhMquv', name: 'Stephen Gmail account' } },
    })
    SendEmailUpdate = {
        sendTo: 'stephen@granitemarketing.co.uk, tim@syntechbiofuel.com, justin@syntechbiofuel.com, sue@syntechbiofuel.com',
        subject: "=💡 NEWS+ | {{ $('Loop Over Items').first().json.display_query }} | {{ $now.format('DD') }}",
        message: `=Good Morning! 

Here are the ideas from today:
{{
  $json.data
    .sort((a, b) => {
      const order = { new: 0, update: 1, duplicate: 2 };
      return order[a.status] - order[b.status];
    })
    .map(item => item)
    .join('<br><hr>')
}}
<br>
NEWS+ Bot 🤖`,
        options: {
            appendAttribution: false,
            senderName: 'NEWS+ Content Engine 🤖',
        },
    };

    @node({
        id: 'e8b4c309-ae5c-47bd-abc6-b25848296037',
        name: 'Update a database page',
        type: 'n8n-nodes-base.notion',
        version: 2.2,
        position: [2800, 128],
        credentials: { notionApi: { id: 'k0ZwGrqySi9Wayf7', name: 'Stephen Notion account' } },
        retryOnFail: true,
        waitBetweenTries: 5000,
    })
    UpdateADatabasePage = {
        resource: 'databasePage',
        operation: 'update',
        pageId: {
            __rl: true,
            mode: 'id',
            value: "={{ $('Set Data').item.json.notion_url.split('-').last() }}",
            __regex: '^([0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12})',
        },
        propertiesUi: {
            propertyValues: [
                {
                    key: 'Sent To Team?|checkbox',
                    checkboxValue: true,
                },
            ],
        },
        options: {},
    };

    @node({
        id: '2b7f6ea1-8bd1-4102-a92b-d0f919e4db0c',
        name: 'Create Digestable Summary - Social Media Selection',
        type: '@n8n/n8n-nodes-langchain.chainLlm',
        version: 1.7,
        position: [2000, 32],
    })
    CreateDigestableSummarySocialMediaSelection = {
        promptType: 'define',
        text: "={{ $('Group Similar Articles').item.json.toJsonString() }}",
        messages: {
            messageValues: [
                {
                    message: `=You are an expert content analyst.

Your task is to read the provided JSON, which represents a **single news story cluster**.
A story cluster may contain:
- one unique article, OR
- multiple articles reporting the same underlying event.

Your job is to produce an ultra-compressed, RSS-style factual micro-summary suitable for senior decision makers scanning multiple items quickly.

Use the **primary article** as the factual anchor.
If multiple articles exist, treat them as corroborating coverage of the same event.

Your output must be **EXTREMELY short**, formatted **ONLY using bullet points**, and must NOT contain interpretation, commentary, or full lists.

You must follow this micro-structure **EXACTLY**, including bullet points, emojis, and formatting:

---

### 🔍 Core Topic  
- One bullet containing a single sentence capturing the main factual subject of the story.

### ⭐ Key Highlights  
- One bullet.  
- Second bullet.  
- Third bullet.  
(Up to **3 bullets total**, only the most material factual events or numbers.)

### 🚗 Fuels & Policy  
- One bullet summarising fuels mentioned (one short line).  
- One bullet summarising policies or regulations mentioned (one short line).

### 🌍 Locations / Entities  
- One bullet listing the most relevant locations (short comma-separated list).  
- One bullet listing the key companies or organisations (short comma-separated list).

### 🔗 Sources  
- One bullet listing **up to 3 source URLs** **ONLY IF** the story cluster contains multiple articles.
- If the story contains only one article, **omit this section entirely**.

---

### **STRICT FORMATTING RULES**
- Use **bullet points ONLY** (“- ”). No paragraphs.
- Follow the exact number of bullets per section.
- Maximum **9 bullets total** (8 normally, +1 only when Sources is present).
- No long lists, no exhaustive enumerations.
- Include only the most material facts.
- No opinions, interpretation, analysis, or relevance scoring.
- Output **only** the structured micro-summary. Nothing else.

The user will supply a JSON object representing a single story cluster.`,
                },
            ],
        },
        batching: {
            batchSize: 10,
        },
    };

    @node({
        id: '2e181dfe-35e3-47e7-9166-f6c53f5c4c1e',
        name: 'Loop Over Items',
        type: 'n8n-nodes-base.splitInBatches',
        version: 3,
        position: [1104, 160],
    })
    LoopOverItems = {
        options: {},
    };

    @node({
        id: '64913ad7-7621-419b-92ee-58bc90bc849e',
        name: 'Group Content By Query',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [656, 160],
    })
    GroupContentByQuery = {
        jsCode: `const articles = $input.all();

function normaliseQuery(value) {
  if (!value) return "unknown";
  return value
    .toLowerCase()
    .trim()
    .replace(/\\s+/g, " ");
}

function groupBySearchQuery(data) {
  return data.reduce((groups, itemRaw) => {
    const item = itemRaw.json;

    const rawQuery = item.property_source_name || "Unknown";
    const normalisedQuery = normaliseQuery(rawQuery);

    if (!groups[normalisedQuery]) {
      groups[normalisedQuery] = {
        original_query: (rawQuery || "Unknown").toString().trim(),
        content: []
      };
    }

    // Push the ENTIRE item (all fields), plus helpful derived keys
    groups[normalisedQuery].content.push({
      ...item,
      raw_search_query: rawQuery,
      normalised_search_query: normalisedQuery,
    });

    return groups;
  }, {});
}

const groupedContent = groupBySearchQuery(articles);

// Output one n8n item per group
const outputLists = Object.entries(groupedContent).map(([normalisedQuery, group]) => ({
  json: {
    search_query: normalisedQuery,          // normalised grouping key
    display_query: group.original_query,    // original (first-seen) label
    content: group.content                  // FULL items
  }
}));

return outputLists;`,
    };

    @node({
        id: '3a1dfdfc-e4b6-4ad0-a891-a7b2e114f1a8',
        name: 'Structure Message',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [2576, 32],
    })
    StructureMessage = {
        assignments: {
            assignments: [
                {
                    id: 'f4dbc790-fb04-4b34-b9ed-c82a91830347',
                    name: 'data',
                    value: `=<h3>
📝 Title: {{ $('Set Data').item.json.article_name }} ({{ $('Set Data').item.json.status === 'update' && 'UPDATE 🟠' || $('Set Data').item.json.status === 'duplicate' && 'DUPLICATE 🔴' || $('Set Data').item.json.status === 'new' && 'NEW 🟢' }})  
</h3>

<p>📅 Published Date: <strong>{{ $('Set Data').item.json.article_published_date.toDateTime().format('DD') }}</strong></p>

<ul>
  <li>Primary source: <a href="{{ $('Set Data').item.json.article_url }}">External</a></li>
  <li>View in Notion: <a href="{{ $('Set Data').item.json.notion_url }}">Notion</a></li>
</ul>

{{ $json.data }}


<p>🔗 Sources Websites:</p>
<ul>
{{
  (() => {
    const title = $('Set Data').item.json.article_name;
    const primary = $('Set Data').item.json.article_url;
    const urls = $('Set Data').item.json.source_urls || [];

    const unique = Array.from(new Set(urls)).filter(Boolean);
    const also = unique.filter(u => u !== primary);

    return [
      \`<li>Primary: <a href="\${primary}" target="_blank"><strong>View "\${title}" on website</strong></a></li>\`,
      ...also.map(
        u => \`<li>Also: <a href="\${u}" target="_blank">View on website</a></li>\`
      )
    ].join('\\n');
  })()
}}
</ul>

<p>🔗 Sources (Notion):</p>
<ul>
{{
  (() => {
    const title = $('Set Data').item.json.article_name;
    const urls = $('Set Data').item.json.article_notion_urls || [];

    const unique = Array.from(new Set(urls)).filter(Boolean);
    if (!unique.length) return '';

    const primary = unique[0];
    const also = unique.slice(1);

    return [
      \`<li>Primary: <a href="\${primary}" target="_blank"><strong>View "\${title}" in Notion</strong></a></li>\`,
      ...also.map(
        u => \`<li>Also: <a href="\${u}" target="_blank">View in Notion</a></li>\`
      )
    ].join('\\n');
  })()
}}
</ul>
<br>`,
                    type: 'string',
                },
            ],
        },
        options: {},
    };

    @node({
        id: '8c16c8ac-b476-416b-b40f-8898a0bc130c',
        name: 'Get From 24h Ago',
        type: 'n8n-nodes-base.filter',
        version: 2.3,
        position: [432, 160],
    })
    GetFrom24hAgo = {
        conditions: {
            options: {
                caseSensitive: true,
                leftValue: '',
                typeValidation: 'strict',
                version: 3,
            },
            conditions: [
                {
                    id: '6a768bda-8b2f-4080-9e87-0df5964d4212',
                    leftValue: '={{ $json.property_created_date }}',
                    rightValue: "={{ $now.minus(5, 'days') }}",
                    operator: {
                        type: 'dateTime',
                        operation: 'after',
                    },
                },
            ],
            combinator: 'and',
        },
        options: {},
    };

    @node({
        id: '54b4bd77-dd19-4d02-b528-720f2a9f3f00',
        name: 'Group Similar Articles',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [1328, 32],
    })
    GroupSimilarArticles = {
        jsCode: `// Input: one item = one TOPIC bucket { search_query, display_query, content:[...] }
// Output: many items = story clusters within that topic

function safeJsonParse(str) { try { return JSON.parse(str); } catch { return null; } }

function norm(v) {
  return String(v || "").toLowerCase().trim();
}
function toSet(arr) {
  if (!Array.isArray(arr)) return new Set();
  return new Set(arr.map(norm).filter(Boolean));
}
function jaccard(a, b) {
  if (!a.size && !b.size) return 0;
  let inter = 0;
  for (const v of a) if (b.has(v)) inter++;
  const union = a.size + b.size - inter;
  return union ? inter / union : 0;
}

function fingerprintSets(article) {
  const fp = safeJsonParse(article.property_fact_fingerprint || "");
  const entities = toSet(fp?.entities);
  const actions  = toSet(fp?.actions);
  const dates    = toSet(fp?.dates);
  const numbers  = toSet(fp?.numerical_values);
  return { entities, actions, dates, numbers };
}

function similarity(a, b) {
  const e = jaccard(a.entities, b.entities);
  const ac = jaccard(a.actions, b.actions);
  const d = jaccard(a.dates, b.dates);
  const n = jaccard(a.numbers, b.numbers);

  // Actions are the biggest distinguisher between “different things within same topic”
  return (0.35 * e) + (0.45 * ac) + (0.15 * d) + (0.05 * n);
}

function scorePrimary(article) {
  const s = Number(article.property_total_score ?? 0);
  const d = article.property_publication_date?.start
    ? Date.parse(article.property_publication_date.start)
    : 0;
  return (s * 1_000_000) + d;
}

const THRESHOLD = 0.58; // slightly higher to avoid over-merging within a topic

const topic = $input.all()[0].json;
const items = Array.isArray(topic.content) ? topic.content : [];

const enriched = items.map(a => ({ ...a, __fp: fingerprintSets(a) }));

const clusters = [];

for (const art of enriched) {
  let bestIdx = -1;
  let bestSim = 0;

  // Find best matching existing cluster (if any)
  for (let i = 0; i < clusters.length; i++) {
    const rep = clusters[i].__rep;
    const sim = similarity(art.__fp, rep.__fp);
    if (sim > bestSim) { bestSim = sim; bestIdx = i; }
  }

  if (bestSim >= THRESHOLD) {
    const c = clusters[bestIdx];
    c.articles.push(art);

    // Update primary + representative to strongest (helps stability)
    const best = c.articles.reduce((acc, cur) =>
      scorePrimary(cur) > scorePrimary(acc) ? cur : acc
    , c.__primary);

    c.__primary = best;
    c.__rep = best;
  } else {
    clusters.push({ __primary: art, __rep: art, articles: [art] });
  }
}

function normStatus(s) {
  s = String(s || "").toLowerCase().trim();
  if (s === "new" || s === "update" || s === "duplicate") return s;
  return "new"; // safe default if missing
}

function storyStatusFromArticles(articles) {
  const statuses = articles.map(a => normStatus(a.property_update_status));
  if (statuses.includes("new")) return "new";
  if (statuses.includes("update")) return "update";
  return "duplicate";
}

// One output item per STORY within the topic
return clusters
  .sort((a, b) => scorePrimary(b.__primary) - scorePrimary(a.__primary))
  .map((c, idx) => {
    const primary = c.__primary;

    // ✅ Compute story status from Notion's per-article semantic status
    const story_status = storyStatusFromArticles(c.articles);

    // (Optional but useful) status breakdown for UI/debug
    const status_counts = c.articles.reduce((acc, a) => {
      const s = normStatus(a.property_update_status);
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    }, {});

    const urls = c.articles
      .map(a => a.property_source_url || a.url)
      .filter(Boolean);

    const seen = new Set();
    const supporting_sources = urls.filter(u => (seen.has(u) ? false : (seen.add(u), true)));

    return {
      json: {
        topic_key: topic.search_query,
        topic_label: topic.display_query,
        story_id: \`\${topic.search_query}__story_\${idx + 1}\`,
        story_size: c.articles.length,

        // ✅ story-level semantic status (new/update/duplicate) from Notion flags
        story_status,
        status_counts, // optional

        // Primary drives the summary
        primary: {
          title: primary.property_article_name || primary.name,
          publication_date: primary.property_publication_date?.start || null,
          summary: primary.property_summary || null,
        
          update_status: primary.property_update_status || null,
          fact_fingerprint: primary.property_fact_fingerprint || null,
        
          source_name: primary.property_source_name || null,
        
          // ✅ Explicit URLs
          source_url: primary.property_source_url || null, // external
          notion_url: primary.url || null                  // Notion page
        },

        // Supporting sources (deduped)
        supporting_sources: supporting_sources.slice(0, 10),

        // Per-article metadata retained
        articles: c.articles.map(a => ({
          title: a.property_article_name || a.name,
          source: a.property_source_name || null,
        
          // ✅ Explicit URLs
          source_url: a.property_source_url || null, // external
          notion_url: a.url || null,                  // Notion page
        
          score: a.property_total_score ?? null,
          date: a.property_publication_date?.start || null,
          update_status: a.property_update_status || null,
          fact_fingerprint: a.property_fact_fingerprint || null
        })),
      }
    };
  });`,
    };

    @node({
        id: 'db16beba-de07-479e-9255-1094f8e1386a',
        name: 'Limit2',
        type: 'n8n-nodes-base.limit',
        version: 1,
        position: [880, 160],
    })
    Limit2 = {
        maxItems: 100,
    };

    @node({
        id: '9353ccfa-4257-491d-9a93-b497002794e9',
        name: 'Sticky Note1',
        type: 'n8n-nodes-base.stickyNote',
        version: 1,
        position: [2992, -80],
    })
    StickyNote1 = {
        content: `## Fix
Sort order not working - because the HTML is already structured - we need to sort upstream`,
    };

    @node({
        id: '0c64c7ed-2576-42e7-9883-f082ddb8ea78',
        name: 'Run Hourly',
        type: 'n8n-nodes-base.scheduleTrigger',
        version: 1.3,
        position: [-16, 256],
    })
    RunHourly = {
        rule: {
            interval: [
                {
                    field: 'hours',
                },
            ],
        },
    };

    // =====================================================================
    // ROUTAGE ET CONNEXIONS
    // =====================================================================

    @links()
    defineRouting() {
        this.WhenClickingExecuteWorkflow.out(0).to(this.GetNewIdeas.in(0));
        this.GetNewIdeas.out(0).to(this.GetFrom24hAgo.in(0));
        this.SetData.out(0).to(this.Limit.in(0));
        this.Limit.out(0).to(this.CreateDigestableSummarySocialMediaSelection.in(0));
        this.Markdown.out(0).to(this.StructureMessage.in(0));
        this.Aggregate.out(0).to(this.SendEmailUpdate.in(0));
        this.SendEmailUpdate.out(0).to(this.LoopOverItems.in(0));
        this.CreateDigestableSummarySocialMediaSelection.out(0).to(this.Markdown.in(0));
        this.LoopOverItems.out(1).to(this.GroupSimilarArticles.in(0));
        this.GroupContentByQuery.out(0).to(this.Limit2.in(0));
        this.StructureMessage.out(0).to(this.Aggregate.in(0));
        this.StructureMessage.out(0).to(this.UpdateADatabasePage.in(0));
        this.GetFrom24hAgo.out(0).to(this.GroupContentByQuery.in(0));
        this.GroupSimilarArticles.out(0).to(this.SetData.in(0));
        this.Limit2.out(0).to(this.LoopOverItems.in(0));
        this.RunHourly.out(0).to(this.GetNewIdeas.in(0));

        this.CreateDigestableSummarySocialMediaSelection.uses({
            ai_languageModel: this.OpenaiChatModel.output,
        });
    }
}
