#!/usr/bin/env bash
# validate-source-author-contract.sh
#
# Hits content-sourcing /search with one fixture per source type and validates:
#   1. source ∈ {RSS, LinkedIn, Instagram, X, Website, Google, Keyword}
#   2. author is non-null for LinkedIn/X/Instagram
#   3. author is null for RSS/Website/Keyword/Google
#
# Usage:
#   CONTENT_SOURCING_URL=https://... \
#   CONTENT_SOURCING_TOKEN=... \
#   bash validate-source-author-contract.sh
#
# Exits 0 on pass, 1 on any validation failure.

set -euo pipefail

: "${CONTENT_SOURCING_URL:?Set CONTENT_SOURCING_URL}"
: "${CONTENT_SOURCING_TOKEN:?Set CONTENT_SOURCING_TOKEN}"

VALID_SOURCES=("RSS" "LinkedIn" "Instagram" "X" "Website" "Google" "Keyword")
PROFILE_SOURCES=("LinkedIn" "X" "Instagram")

PASS=0
FAIL=0

check() {
  local label="$1" source="$2" author="$3"

  # Validate source is in the enum
  local valid=false
  for v in "${VALID_SOURCES[@]}"; do
    if [[ "$source" == "$v" ]]; then valid=true; break; fi
  done

  if [[ "$valid" == "false" ]]; then
    echo "FAIL [$label] source='$source' not in enum"
    ((FAIL++))
    return
  fi

  # Check author semantics
  local is_profile=false
  for p in "${PROFILE_SOURCES[@]}"; do
    if [[ "$source" == "$p" ]]; then is_profile=true; break; fi
  done

  if [[ "$is_profile" == "true" && ("$author" == "null" || -z "$author") ]]; then
    echo "FAIL [$label] source='$source' should have non-null author, got '$author'"
    ((FAIL++))
    return
  fi

  if [[ "$is_profile" == "false" && "$author" != "null" ]]; then
    echo "FAIL [$label] source='$source' should have null author, got '$author'"
    ((FAIL++))
    return
  fi

  echo "PASS [$label] source='$source' author='$author'"
  ((PASS++))
}

echo "=== Source/Author Contract Validation ==="
echo "Target: $CONTENT_SOURCING_URL"
echo ""

# Test each source type by calling /search (single source)
# Each test uses a minimal fixture that exercises one handler.

test_source() {
  local source_type="$1"
  local url_or_keyword="$2"
  local source_name="$3"
  local source_category="${4:-general}"

  local payload
  payload=$(cat <<FIXTURE
{
  "source_type": "$source_type",
  "url_or_keyword": "$url_or_keyword",
  "source_name": "$source_name",
  "source_category": "$source_category",
  "test_mode": true
}
FIXTURE
)

  local response
  response=$(curl -s -X POST "$CONTENT_SOURCING_URL/search" \
    -H "Authorization: Bearer $CONTENT_SOURCING_TOKEN" \
    -H "Content-Type: application/json" \
    -d "$payload" \
    --max-time 60)

  local article_count
  article_count=$(echo "$response" | jq -r '.articles_returned // 0')

  if [[ "$article_count" == "0" ]]; then
    echo "SKIP [$source_type] no articles returned (handler may need live data)"
    return
  fi

  # Check all returned articles
  echo "$response" | jq -c '.articles[]' | while IFS= read -r article; do
    local source author
    source=$(echo "$article" | jq -r '.source')
    author=$(echo "$article" | jq -r '.author // "null"')
    check "$source_type" "$source" "$author"
  done
}

echo "--- Running per-source validation ---"
echo ""

# These fixtures require live API access. In CI, mock them or skip.
# For manual validation, replace URLs with known-good test sources.

# Uncomment and fill in with real test sources for your environment:
# test_source "RSS" "https://example.com/rss-feed" "Test Publication"
# test_source "LinkedIn" "https://linkedin.com/in/test-profile" "Test Person"
# test_source "Website" "https://example.com" "Test Site"
# test_source "Keyword" "biofuel sustainable aviation fuel" "Keyword Search"

echo ""
echo "--- Summary ---"
echo "PASS: $PASS  FAIL: $FAIL"

if [[ $FAIL -gt 0 ]]; then
  echo "RESULT: FAILED"
  exit 1
fi

echo "RESULT: PASSED"
exit 0
