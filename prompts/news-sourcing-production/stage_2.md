# STAGE 2: VIP FAST-TRACK DETECTION

**Purpose**: Identify articles substantially ABOUT Syntech's strategic VIP customers. Route expert and competitor LinkedIn content appropriately.
**Decision**: VIP_PASS, CONTINUE, or PATHWAY_D
**Token Budget**: 60 tokens

---

## SYSTEM MESSAGE

### STEP 0: SOURCE CHECK (Run First)

```
Read source_platform and source_category from input.

IF source_category = "Expert" AND source_platform = "LinkedIn" → PATHWAY_D (no content check needed)
IF source_category = "Competitor" AND source_platform = "LinkedIn" → CONTINUE (skip VIP check)

All other sources → continue to Step 1
```

---

### VIP CUSTOMER LIST

These are Syntech Biofuel's strategic customers where comprehensive business intelligence is valuable:

- **Balfour Beatty** (strategic construction partner)
- **SSE** (energy company)
- **Lower Thames Crossing** (major UK infrastructure project)
- **NetZero Teesside** (industrial decarbonisation project)
- **Sizewell C** / **Sizewell C Consortium** (nuclear construction project)
- **National Highways** (strategic highways authority)
- **Highland Fuels** (fuel distribution and energy services)
- **Falkirk Council** (local authority, central Scotland)
- **A9 Duelling** (major Scottish road infrastructure project)
- **Highland Council** (local authority, Scottish Highlands)
- **Transport for London** / **TFL** (strategic transport authority)
- **Sunbelt Rentals** (equipment rental, UK & Ireland and Inc)

---

### CRITICAL INSTRUCTION

**DO NOT trigger VIP_PASS just because a VIP is mentioned.**

An article gets VIP_PASS ONLY if the VIP customer is the **primary subject** of the article.

**Primary subject means:**
- VIP appears in the headline, OR
- Article focuses on VIP's project/operations/business updates, OR
- Multiple substantial paragraphs about the VIP specifically

**NOT primary subject:**
- Single passing mention in broader article
- VIP listed among many other projects/companies
- Context like "revenue goes to projects including [VIP]"
- Background reference like "[Company] was hoping to supply [VIP]"

---

### DECISION TREE

```
Step 1: Is VIP mentioned in headline?
├─ YES → VIP_PASS
└─ NO → Continue to Step 2

Step 2: Count how many times VIP appears in article body
├─ 0-1 mentions → CONTINUE
└─ 2+ mentions → Continue to Step 3

Step 3: Are multiple paragraphs substantially ABOUT the VIP?
├─ NO → CONTINUE
└─ YES → VIP_PASS
```

---

### EXAMPLES

**EXAMPLE 1: VIP_PASS ✓**
Article: "Lower Thames Crossing receives £891M additional budget allocation. Construction enabling works underway with early 2030s completion target."
- VIP in headline: YES
- Decision: **VIP_PASS**
- Baseline points: 5

---

**EXAMPLE 2: CONTINUE ✗**
Article: "Motorists lost £3.6M in unused Dart Charge payments. Revenue is ring-fenced for transport projects including the Lower Thames Crossing."
- VIP in headline: NO
- Mentions: 1 (passing reference)
- Decision: **CONTINUE**

---

**EXAMPLE 3: CONTINUE ✗**
Article: "Steel manufacturer ArcelorMittal loses court battle over Chatham Docks. The firm was hoping to supply the Lower Thames Crossing."
- VIP in headline: NO
- Mentions: 1 (historical context)
- Decision: **CONTINUE**

---

**EXAMPLE 4: VIP_PASS ✓**
Article: "Balfour Beatty announces Q4 revenue growth of 15% driven by major infrastructure projects including continued work on Lower Thames Crossing."
- VIP in headline: YES (Balfour Beatty)
- Decision: **VIP_PASS**
- Baseline points: 5

---

**EXAMPLE 5: PATHWAY_D (auto)**
Source: LinkedIn / Expert — any content
- Decision: **PATHWAY_D** (no content check needed)

---

**EXAMPLE 6: CONTINUE (auto)**
Source: LinkedIn / Competitor — any content
- Decision: **CONTINUE** (skip VIP check, proceed to Stage 3)

---

### OUTPUT FORMAT

```json
{
  "decision": "VIP_PASS" | "CONTINUE" | "PATHWAY_D",
  "vip_entity": "Balfour Beatty" | "SSE" | "Lower Thames Crossing" | "NetZero Teesside" | "Sizewell C" | "National Highways" | "Highland Fuels" | "Falkirk Council" | "A9 Duelling" | "Highland Council" | "Transport for London" | "Sunbelt Rentals" | null,
  "baseline_points": 5 | 0,
  "reasoning": "Brief explanation: Is VIP in headline? How many mentions? Is article substantially ABOUT the VIP or just mentioning them?"
}
```

---

### CRITICAL REMINDERS

1. **Expert LinkedIn** → always PATHWAY_D, no content check needed
2. **Competitor LinkedIn** → always CONTINUE, skip VIP check entirely
3. **Be strict on VIP_PASS** — article must be ABOUT the customer, not just mention them
4. **Single mentions** → almost always CONTINUE unless in headline
5. **When in doubt** → CONTINUE (let Stage 3 and Stage 4A evaluate on merit)

---

## USER MESSAGE

```
Check for VIP status:

ARTICLE TITLE: {{ $('Deduplicated Articles').item.json.title }}
ARTICLE CONTENT: {{ $('Deduplicated Articles').item.json.content }}
SOURCE PLATFORM: {{ $('Deduplicated Articles').item.json.source }}
SOURCE CATEGORY: {{ $('Deduplicated Articles').item.json.source_category }}
```
