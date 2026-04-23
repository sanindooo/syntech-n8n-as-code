import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : Search Google Syntech
// Nodes   : 67  |  Connections: 43
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// WhenExecutedByAnotherWorkflow      executeWorkflowTrigger
// EitherUrlOrKeyword5                set
// LoopOverItems6                     splitInBatches
// OpenaiChatModel2                   lmChatOpenAi               [creds] [ai_languageModel]
// StructuredOutputParser3            outputParserStructured     [ai_outputParser]
// CreateSummaryAndTitle8             chainLlm                   [AI] [retry]
// OpenaiChatModel13                  lmChatOpenAi               [creds] [retry]
// StructuredOutputParser15           outputParserStructured     [AI] [ai_outputParser]
// Filter5                            filter
// CreateLongtailKeyword5             chainLlm                   [AI] [retry]
// RagWebKeywordSearch1               set
// StickyNote                         stickyNote
// Merge                              merge                      [alwaysOutput]
// ExtractContent                     httpRequest                [onError→out(1)]
// Markdown1                          markdown
// ExtractDate1                       code
// StructuredOutputParser5            outputParserStructured     [AI] [retry] [ai_outputParser]
// Deepseek32                         lmChatOpenRouter           [creds]
// SplitOut                           splitOut
// Deepseek3                          lmChatOpenRouter           [creds]
// CreateLongtailKeyword              chainLlm                   [retry]
// CreateLongtailKeyword6ClaudeOptimised chainLlm                   [AI] [retry]
// CreateLongtailKeyword6ClaudeOptimised1 chainLlm                   [retry]
// IfNotError                         if
// StructuredOutputParser2            outputParserStructured     [AI] [ai_outputParser]
// Merge9                             merge
// Deepseek31                         lmChatOpenRouter           [creds]
// RagWebKeywordSearch                set
// If_                                if
// HasDataApiExample                  code
// SerpapiApiExample                  code
// SerapiGoogleNews                   httpRequest                [onError→out(1)]
// Limit                              limit
// SplitOutNewsArticles               splitOut
// RemoveDuplicates                   removeDuplicates           [alwaysOutput]
// ScrapeAUrlAndGetItsContent2        firecrawl                  [onError→regular] [creds]
// Limit15Items                       limit
// IsLessThan3WeeksOld                filter                     [alwaysOutput]
// GetManyRows1                       supabase                   [creds] [executeOnce]
// GetManyRowsSb                      supabase                   [creds] [executeOnce]
// CreateARowSb                       supabase                   [creds]
// CreateARowSb1                      supabase                   [creds]
// CreateARow                         dataTable                  [executeOnce]
// CreateARow1                        dataTable
// CreateARow2                        dataTable
// Markdown                           markdown
// EditFields1                        set
// CodeInJavascript                   code
// OpenaiChatModel3                   lmChatOpenAi               [creds] [ai_languageModel]
// RagWebKeywordSearch2               set
// EditFields2                        set
// CreateSummaryAndTitle10            chainLlm                   [AI] [retry]
// OpenaiChatModel4                   lmChatOpenAi               [creds] [ai_languageModel]
// WhenClickingExecuteWorkflow        manualTrigger
// ExtractingCleanArticle             chainLlm                   [AI] [retry]
// AnthropicChatModel                 lmChatAnthropic            [creds] [ai_languageModel]
// AnthropicChatModel1                lmChatAnthropic            [creds] [ai_languageModel]
// SetArticleContent                  set
// Wait                               wait
// AnthropicChatModel3                lmChatAnthropic            [creds]
// AnthropicChatModel4                lmChatAnthropic            [creds]
// AnthropicChatModel5                lmChatAnthropic            [creds]
// SwapOpenAiWithClaude               chainLlm                   [AI] [retry]
// AnthropicChatModel6                lmChatAnthropic            [creds] [ai_languageModel]
// OpenaiChatModel1                   lmChatOpenAi               [creds] [ai_languageModel]
// OpenaiChatModel                    lmChatOpenAi               [creds] [ai_languageModel]
// OpenaiChatModel5                   lmChatOpenAi               [creds] [ai_languageModel]
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// WhenExecutedByAnotherWorkflow
//    → Limit15Items
//      → LoopOverItems6
//       .out(1) → EitherUrlOrKeyword5
//          → Filter5
//            → CreateLongtailKeyword6ClaudeOptimised
//              → SplitOut
//                → Limit
//                  → SerapiGoogleNews
//                    → SplitOutNewsArticles
//                      → Merge
//                        → IsLessThan3WeeksOld
//                          → If_
//                            → RemoveDuplicates
//                              → ExtractContent
//                                → ExtractDate1
//                                  → Markdown1
//                                    → CreateSummaryAndTitle8
//                                      → CreateARow1
//                                        → SetArticleContent
//                                          → ExtractingCleanArticle
//                                            → RagWebKeywordSearch1
//                                              → Merge9.in(1)
//                                                → Wait
//                                                  → LoopOverItems6 (↩ loop)
//                               .out(1) → ScrapeAUrlAndGetItsContent2
//                                  → IfNotError
//                                    → SwapOpenAiWithClaude
//                                      → CreateARow2
//                                        → RagWebKeywordSearch
//                                          → Merge9 (↩ loop)
//                                   .out(1) → LoopOverItems6 (↩ loop)
//                           .out(1) → LoopOverItems6 (↩ loop)
//                      → CreateARow
//                        → Merge.in(1) (↩ loop)
//                   .out(1) → LoopOverItems6 (↩ loop)
// HasDataApiExample
//    → GetManyRowsSb
//      → CreateARowSb
//        → CreateARowSb1
//          → Markdown
//            → EditFields1
// WhenClickingExecuteWorkflow
//    → EditFields2
//      → CreateSummaryAndTitle10
//        → RagWebKeywordSearch2
//
// AI CONNECTIONS
// CreateSummaryAndTitle8.uses({ ai_outputParser: StructuredOutputParser15, ai_languageModel: OpenaiChatModel1 })
// StructuredOutputParser15.uses({ ai_languageModel: AnthropicChatModel })
// CreateLongtailKeyword5.uses({ ai_languageModel: OpenaiChatModel2, ai_outputParser: StructuredOutputParser3 })
// StructuredOutputParser5.uses({ ai_languageModel: AnthropicChatModel6 })
// CreateLongtailKeyword6ClaudeOptimised.uses({ ai_outputParser: StructuredOutputParser5, ai_languageModel: OpenaiChatModel5 })
// StructuredOutputParser2.uses({ ai_languageModel: AnthropicChatModel1 })
// CreateSummaryAndTitle10.uses({ ai_languageModel: OpenaiChatModel4 })
// ExtractingCleanArticle.uses({ ai_languageModel: OpenaiChatModel3 })
// SwapOpenAiWithClaude.uses({ ai_outputParser: StructuredOutputParser2, ai_languageModel: OpenaiChatModel })
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'LD5_Lrj2Q4hN9kpTCWyxC',
    name: 'Search Google Syntech',
    active: true,
    isArchived: false,
    projectId: 'U9sMeJya1DaokkjK',
    tags: ['NEWS+'],
    settings: {
        executionOrder: 'v1',
        availableInMCP: false,
        timeSavedMode: 'fixed',
        errorWorkflow: 'o41mt2JfV10VTV65',
        callerPolicy: 'workflowsFromSameOwner',
        binaryMode: 'separate',
        timeSavedPerExecution: 5,
    },
})
export class SearchGoogleSyntechWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: '61afd98d-b229-4471-8340-fc5bb08dc923',
        name: 'When Executed by Another Workflow',
        type: 'n8n-nodes-base.executeWorkflowTrigger',
        version: 1.1,
        position: [-112, 1344],
    })
    WhenExecutedByAnotherWorkflow = {
        workflowInputs: {
            values: [
                {
                    name: 'id',
                    type: 'any',
                },
                {
                    name: 'name',
                    type: 'any',
                },
                {
                    name: 'url',
                    type: 'any',
                },
                {
                    name: 'property_keyword_category',
                    type: 'any',
                },
                {
                    name: 'property_priority',
                    type: 'any',
                },
                {
                    name: 'property_rss_feed',
                    type: 'any',
                },
                {
                    name: 'property_source',
                    type: 'any',
                },
                {
                    name: 'property_category',
                    type: 'any',
                },
                {
                    name: 'property_url',
                    type: 'any',
                },
                {
                    name: 'property_status',
                    type: 'any',
                },
                {
                    name: 'property_name',
                    type: 'any',
                },
                {
                    name: 'prompt',
                    type: 'any',
                },
                {
                    name: 'url_or_keyword',
                    type: 'any',
                },
                {
                    name: 'source',
                    type: 'any',
                },
                {
                    name: 'additional_formats',
                    type: 'any',
                },
                {
                    name: 'process_mode',
                    type: 'any',
                },
                {
                    name: 'bypass_filter',
                    type: 'any',
                },
            ],
        },
    };

    @node({
        id: '994b004d-0e96-4705-8628-b6d7ce81c593',
        name: 'Either Url or Keyword5',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [560, 592],
    })
    EitherUrlOrKeyword5 = {
        assignments: {
            assignments: [
                {
                    id: '8efead37-57d8-4101-9010-c855f2525db6',
                    name: 'url_or_keyword',
                    value: '={{ $json.url_or_keyword || $json.name }}',
                    type: 'string',
                },
                {
                    id: '7ca00974-25ef-4c7a-ac32-42d318e2efaa',
                    name: 'prompt',
                    value: '={{ $json.prompt }}',
                    type: 'string',
                },
                {
                    id: '2a3d10ea-9972-4e63-a289-f79cfec66ac6',
                    name: 'additional_formats',
                    value: '={{ $json.additional_formats }}',
                    type: 'string',
                },
                {
                    id: '6a2fd07b-f95c-4804-a41e-d48f46e72843',
                    name: 'set_source_name',
                    value: "={{ $('When Executed by Another Workflow').item.json.property_name }}",
                    type: 'string',
                },
            ],
        },
        options: {},
    };

    @node({
        id: '2745dfc5-066f-4224-82ee-b1113928e5a3',
        name: 'Loop Over Items6',
        type: 'n8n-nodes-base.splitInBatches',
        version: 3,
        position: [336, 1344],
        executeOnce: false,
    })
    LoopOverItems6 = {
        options: {},
    };

    @node({
        id: '1c29e3f3-7248-4484-92b2-3b0a3e5fa86e',
        name: 'OpenAI Chat Model2',
        type: '@n8n/n8n-nodes-langchain.lmChatOpenAi',
        version: 1.2,
        position: [-112, 2688],
        credentials: { openAiApi: { id: 'NoEKitspBJb0zQrp', name: 'Syntech GM OpenAi account' } },
    })
    OpenaiChatModel2 = {
        model: {
            __rl: true,
            value: 'gpt-4.1-nano',
            mode: 'list',
            cachedResultName: 'gpt-4.1-nano',
        },
        options: {},
    };

    @node({
        id: 'ea9780d2-10af-47d5-b33f-5c3a6e4305fa',
        name: 'Structured Output Parser3',
        type: '@n8n/n8n-nodes-langchain.outputParserStructured',
        version: 1.3,
        position: [32, 2688],
    })
    StructuredOutputParser3 = {
        schemaType: 'manual',
        inputSchema: `{
  "type": "object",
  "properties": {
    "keyword_variant": {
      "type": "string",
      "description": "SEO keyword variant"
    }
  },
  "required": ["keyword_variant"]
}`,
    };

    @node({
        id: '00eb2811-f423-4d7f-913f-5bfaf8dcfd19',
        name: 'Create summary and title8',
        type: '@n8n/n8n-nodes-langchain.chainLlm',
        version: 1.7,
        position: [4384, 896],
        retryOnFail: true,
        waitBetweenTries: 5000,
    })
    CreateSummaryAndTitle8 = {
        promptType: 'define',
        text: `=<content>
{{ (function () {

  const mdNode = $('Markdown1').item.json;
  const hasLinebreak =
    mdNode.linebreak && mdNode.linebreak.length > 0;

  //  CASE 1: linebreak present → use directly
  if (hasLinebreak) {
    return mdNode.linebreak;
  }

  //  CASE 2: no linebreak → use extract content + step 2 & 3
  let rawData = $('extract content').item.json.data || '';

  // 2️ Extract Metadata Description
  let metaMatch =
    rawData.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']*)["']/i) ||
    rawData.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i);

  let metaDescription = metaMatch ? metaMatch[1] : '';

  // 3️ Clean HTML body
  let cleanedPage = rawData
    .replace(/<script[\\s\\S]*?>[\\s\\S]*?<\\/script>/gi, '')
    .replace(/<style[\\s\\S]*?>[\\s\\S]*?<\\/style>/gi, '')
    .replace(/<nav[\\s\\S]*?>[\\s\\S]*?<\\/nav>/gi, '')
    .replace(/<footer[\\s\\S]*?>[\\s\\S]*?<\\/footer>/gi, '')
    .replace(/<header[\\s\\S]*?>[\\s\\S]*?<\\/header>/gi, '')
    .removeTags()
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/^(home|categories|guidelines|terms of service|privacy policy|powered by.*)$/gmi, '')
    .replace(/^\\s+$/gm, '')
    .replace(/[ \\t]+/g, ' ')
    .replace(/\\n{3,}/g, '\\n\\n')
    .trim();

  return (metaDescription + "\\n\\n" + cleanedPage).trim() || "No content found";

})() }}

</content>`,
        hasOutputParser: true,
        needsFallback: true,
        messages: {
            messageValues: [
                {
                    message: `=<prompt>
  <task>
    Your primary tasks are to analyze the provided content and generate a JSON object containing two key-value pairs:
    1. **title:** A clear, descriptive, news-style title that reflects the core information or event in the content.
    2. **summary:** A concise and informative summary of the key details in the content.
  </task>

  <steps>
    1. Review the content thoroughly.
    2. Identify the primary news, announcement, or action being reported.
    3. Write a summary that distills the essential information, adhering to the word count limit.
    4. Write a title in the style of a news or trade publication headline. Focus on describing what happened or is happening — not selling a benefit.
    5. Format the final output as a single JSON object.
  </steps>

  <restrictions>
    - **Summary Word Count:** Max 50 words.
    - **Title Style:** Use objective, publication-style phrasing — not benefit-driven or marketing-style.
    - **Clarity:** Avoid jargon; prioritize informative clarity.
    - **JSON Formatting:** Final output must be a single, valid JSON object enclosed in a markdown code block. No text before or after the JSON.
  </restrictions>

  <output_rules>
    - **Format:** Raw JSON object.
    - **Keys:** Must contain exactly two keys: \`title\` and \`summary\`.
    - **Values:** Both values must be strings.
    - **Tone:** Professional, factual, and informative.
  </output_rules>

  <examples>
    ### Example 1
    **Input Content:** A press release detailing the launch of Syntech ASB and its ISCC certification.
    **Output:**
    [Start of JSON Output]
    {
      "title": "Syntech Launches UK-Made ISCC-Certified Biofuel from Used Cooking Oil",
      "summary": "Syntech ASB is a new ISCC-certified biofuel made entirely from used cooking oil. It is a drop-in replacement for diesel, allowing businesses to reduce carbon emissions by up to 90% without engine modifications or new equipment investments."
    }
    [End of JSON Output]
  </examples>
</prompt>`,
                },
            ],
        },
        batching: {
            batchSize: 20,
        },
    };

    @node({
        id: 'd7e4c9bc-b8fc-4fdf-a0bb-6eedf2a18cad',
        name: 'OpenAI Chat Model13',
        type: '@n8n/n8n-nodes-langchain.lmChatOpenAi',
        version: 1.2,
        position: [-112, -128],
        credentials: { openAiApi: { id: 'NoEKitspBJb0zQrp', name: 'Syntech GM OpenAi account' } },
        retryOnFail: true,
        maxTries: 2,
        waitBetweenTries: 500,
    })
    OpenaiChatModel13 = {
        model: {
            __rl: true,
            value: 'gpt-4.1-nano',
            mode: 'list',
            cachedResultName: 'gpt-4.1-nano',
        },
        options: {
            temperature: 0.1,
        },
    };

    @node({
        id: '0f6e93cd-fd0b-4cf1-8283-c80cdc84a52b',
        name: 'Structured Output Parser15',
        type: '@n8n/n8n-nodes-langchain.outputParserStructured',
        version: 1.3,
        position: [4576, 1120],
    })
    StructuredOutputParser15 = {
        schemaType: 'manual',
        inputSchema: `{
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "description": "A compelling, benefit-driven title"
    },
    "summary": {
      "type": "string",
      "description": "A concise summary (max 50 words)"
    }
  },
  "required": ["title", "summary"]
}`,
        autoFix: true,
    };

    @node({
        id: 'c1d0e57d-378e-4221-8f31-952876a18f29',
        name: 'Filter5',
        type: 'n8n-nodes-base.filter',
        version: 2.2,
        position: [784, 592],
    })
    Filter5 = {
        conditions: {
            options: {
                caseSensitive: true,
                leftValue: '',
                typeValidation: 'strict',
                version: 2,
            },
            conditions: [
                {
                    id: 'e6382e72-d90b-4631-98ac-b4d6cfe0801c',
                    leftValue: '={{ $json.url_or_keyword }}',
                    rightValue: '.',
                    operator: {
                        type: 'string',
                        operation: 'notEmpty',
                        singleValue: true,
                    },
                },
            ],
            combinator: 'or',
        },
        options: {},
    };

    @node({
        id: 'cb0de23d-9c32-40f9-9c19-1b2e2402d55b',
        name: 'create longtail keyword5',
        type: '@n8n/n8n-nodes-langchain.chainLlm',
        version: 1.7,
        position: [-112, 2464],
        retryOnFail: true,
        waitBetweenTries: 5000,
    })
    CreateLongtailKeyword5 = {
        promptType: 'define',
        text: `=<content>
{{ $json.url_or_keyword }}
</content>`,
        hasOutputParser: true,
        messages: {
            messageValues: [
                {
                    message: `=Act as a Google search query generator.

You will receive a single keyword related to sustainable biofuels (e.g., “B20 FAME”, “used cooking oil”, etc.).

Your task is to generate a **concise, Google-optimized search phrase** that includes the keyword exactly as provided. The goal is to surface the **latest news, regulatory updates, market trends, or scientific/technical advancements**, with a **primary focus on the UK**, and **secondarily on the EU**.

---

**Rules:**
- Always include the input keyword exactly as provided.
- Use natural language optimized for Google search (e.g., “latest news on…”).
- Keep it short (max 10–12 words).
- Emphasize **recency** and **location** (e.g., "2025", "UK", "EU").
- You may include words like: \`latest\`, \`2025\`, \`news\`, \`update\`, \`policy\`, \`UK\`, \`EU\`, \`biofuel market\`, etc.

---

**Input format:** A single keyword (string)  
**Output format:** One concise Google search phrase

---

**Examples:**
- Input: \`used cooking oil\` → Output: \`latest UK news on used cooking oil biofuels 2025\`
- Input: \`B20 FAME\` → Output: \`B20 FAME UK EU biofuel regulation update 2025\`
- Input: \`waste-derived biodiesel\` → Output: \`waste-derived biodiesel market forecast UK 2025\``,
                },
            ],
        },
        batching: {},
    };

    @node({
        id: '308630f8-64eb-4a12-ad50-e4647ceaf761',
        name: 'RAG Web - Keyword Search1',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [5744, 896],
    })
    RagWebKeywordSearch1 = {
        assignments: {
            assignments: [
                {
                    id: '1d34aa6b-dce8-4761-9a9a-a663f61a86ac',
                    name: 'title',
                    value: "={{ $('Merge').item.json.title || $('Create summary and title8').item.json.output.title }}",
                    type: 'string',
                },
                {
                    id: 'ab5c9158-a33a-4f8f-b6d0-a6787df0f0d5',
                    name: 'content',
                    value: '={{ $json.text }}',
                    type: 'string',
                },
                {
                    id: 'f0c15fc7-071d-406d-8200-abecbf458836',
                    name: 'url',
                    value: `={{
  decodeURIComponent(
    ($('Merge').item.json.link || '')
      .replace(/^https?:\\/\\/www\\.google\\.com\\/url\\?.*?url=/, '')
      .split('&')[0]
  )
}}`,
                    type: 'string',
                },
                {
                    id: '81fb049e-bbc7-49f8-b932-9f2d3ae0305d',
                    name: 'summary',
                    value: "={{ $('Create summary and title8').item.json.output.summary }}",
                    type: 'string',
                },
                {
                    id: '39872c24-4acc-4513-b7fb-7689cd511afb',
                    name: 'search_query',
                    value: "={{ $('Either Url or Keyword5').first().json.url_or_keyword }}",
                    type: 'string',
                },
                {
                    id: '42852696-c7af-4ce4-a273-e61970ef2e8f',
                    name: 'publication_date',
                    value: "={{ $('Merge').item.json.date.toDateTime() || $('extract date1').item.json.publishedDate }}",
                    type: 'string',
                },
                {
                    id: '6bd73285-c360-4b10-8567-8ae66ecba2bd',
                    name: 'prompt',
                    value: "={{ $('When Executed by Another Workflow').first().json.prompt }}",
                    type: 'string',
                },
                {
                    id: '101c6d7f-6e56-4362-9238-0b3e4fd7f14d',
                    name: 'additional_formats',
                    value: "={{ $('When Executed by Another Workflow').first().json.additional_formats }}",
                    type: 'string',
                },
                {
                    id: 'a0b9d46b-67d2-4152-b1fa-2306fa5751e4',
                    name: 'source',
                    value: 'Website',
                    type: 'string',
                },
                {
                    id: '9fa24bce-6aa0-4d13-a106-54727cd4ee0b',
                    name: 'source_name',
                    value: "={{ $('Either Url or Keyword5').first().json.set_source_name }}",
                    type: 'string',
                },
                {
                    id: '16c4619b-e07a-4e2a-9c5f-b3fd59da9956',
                    name: 'source_category',
                    value: "={{ $('When Executed by Another Workflow').item.json.property_keyword_category }}",
                    type: 'string',
                },
                {
                    id: '9aea88f6-a629-4f42-ba37-8608bb631772',
                    name: 'mode',
                    value: "={{ $('When Executed by Another Workflow').first().json.process_mode }}",
                    type: 'string',
                },
            ],
        },
        options: {},
    };

    @node({
        id: '765fdb89-6486-4a92-aa31-dbf8ea97503f',
        name: 'Sticky Note',
        type: 'n8n-nodes-base.stickyNote',
        version: 1,
        position: [-192, 16],
    })
    StickyNote = {
        content: '## News Scrap through keyword',
        height: 1488,
        width: 6624,
    };

    @node({
        id: '7632a17b-4b2a-4d1c-b620-8d4a2474f135',
        name: 'Merge',
        type: 'n8n-nodes-base.merge',
        version: 3.2,
        position: [2752, 592],
        alwaysOutputData: true,
    })
    Merge = {
        mode: 'combine',
        advanced: true,
        mergeByFields: {
            values: [
                {
                    field1: 'link',
                    field2: 'url',
                },
            ],
        },
        joinMode: 'keepNonMatches',
        outputDataFrom: 'input1',
        options: {},
    };

    @node({
        id: '8400c198-0db0-4b0b-86d1-543fa385912f',
        name: 'extract content',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.2,
        position: [3648, 592],
        onError: 'continueErrorOutput',
    })
    ExtractContent = {
        url: "={{ $('Merge').item.json.link }}",
        sendHeaders: true,
        headerParameters: {
            parameters: [
                {
                    name: 'accept',
                    value: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                },
                {
                    name: 'accept-language',
                    value: 'en-GB,en-US;q=0.9,en;q=0.8',
                },
                {
                    name: 'cache-control',
                    value: 'no-cache',
                },
                {
                    name: 'pragma',
                    value: 'no-cache',
                },
                {
                    name: 'priority',
                    value: 'u=0, i',
                },
                {
                    name: 'sec-ch-ua',
                    value: '"Google Chrome";v="143", "Chromium";v="143", "Not A(Brand";v="24"',
                },
                {
                    name: 'sec-ch-ua-mobile',
                    value: '?0',
                },
                {
                    name: 'sec-ch-ua-platform',
                    value: '"macOS"',
                },
                {
                    name: 'sec-fetch-dest',
                    value: 'document',
                },
                {
                    name: 'sec-fetch-mode',
                    value: 'navigate',
                },
                {
                    name: 'sec-fetch-site',
                    value: 'same-origin',
                },
                {
                    name: 'sec-fetch-user',
                    value: '?1',
                },
                {
                    name: 'upgrade-insecure-requests',
                    value: '1',
                },
                {
                    name: 'user-agent',
                    value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',
                },
            ],
        },
        options: {},
    };

    @node({
        id: '27e31fbf-cb0e-45ec-8e5a-93b50807656d',
        name: 'Markdown1',
        type: 'n8n-nodes-base.markdown',
        version: 1,
        position: [4096, 896],
    })
    Markdown1 = {
        html: "={{ $('extract content').item.json.data || '' }}",
        destinationKey: 'linebreak',
        options: {},
    };

    @node({
        id: 'e902ccc6-6218-4913-ae6d-f3935cf6498f',
        name: 'extract date1',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [3872, 896],
    })
    ExtractDate1 = {
        mode: 'runOnceForEachItem',
        jsCode: `const htmlContent = $json.data;

// Function to extract published date from various HTML patterns
const extractPublishedDate = (html) => {
    if (!html) return null;
    
    // 1. Open Graph meta tags (most common)
    let match = html.match(/<meta[^>]*property=["']article:published_time["'][^>]*content=["']([^"']+)["'][^>]*>/i);
    if (match?.[1]) return match[1];
    
    match = html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']article:published_time["'][^>]*>/i);
    if (match?.[1]) return match[1];
    
    // 2. Schema.org meta tags
    match = html.match(/<meta[^>]*itemprop=["']datePublished["'][^>]*content=["']([^"']+)["'][^>]*>/i);
    if (match?.[1]) return match[1];
    
    match = html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*itemprop=["']datePublished["'][^>]*>/i);
    if (match?.[1]) return match[1];
    
    // 3. Standard meta name tags
    const metaNames = [
        'publishdate', 'publication-date', 'date', 'pubdate', 'publish_date',
        'published-date', 'article.published', 'article:published',
        'datePublished', 'dc.date', 'DC.date', 'dc.date.issued',
        'sailthru.date', 'article.created', 'last-modified', 'created'
    ];
    
    for (const name of metaNames) {
        match = html.match(new RegExp(\`<meta[^>]*name=["']\${name}["'][^>]*content=["']([^"']+)["'][^>]*>\`, 'i'));
        if (match?.[1]) return match[1];
        
        match = html.match(new RegExp(\`<meta[^>]*content=["']([^"']+)["'][^>]*name=["']\${name}["'][^>]*>\`, 'i'));
        if (match?.[1]) return match[1];
    }
    
    // 4. JSON-LD structured data
    const jsonLdMatch = html.match(/<script[^>]*type=["']application\\/ld\\+json["'][^>]*>([\\s\\S]*?)<\\/script>/gi);
    if (jsonLdMatch) {
        for (const jsonBlock of jsonLdMatch) {
            try {
                const jsonContent = jsonBlock.replace(/<script[^>]*>|<\\/script>/gi, '').trim();
                const data = JSON.parse(jsonContent);
                
                // Handle both single objects and arrays
                const items = Array.isArray(data) ? data : [data];
                
                for (const item of items) {
                    if (item.datePublished) return item.datePublished;
                    if (item.publishedDate) return item.publishedDate;
                    if (item.dateCreated) return item.dateCreated;
                    if (item.article?.datePublished) return item.article.datePublished;
                }
            } catch (e) {
                // Continue if JSON parsing fails
            }
        }
    }
    
    // 5. Time tags with datetime attribute
    match = html.match(/<time[^>]*datetime=["']([^"']+)["'][^>]*>/i);
    if (match?.[1]) return match[1];
    
    // 6. Data attributes
    match = html.match(/data-published[-_]?(?:time|date)=["']([^"']+)["']/i);
    if (match?.[1]) return match[1];
    
    match = html.match(/data-date=["']([^"']+)["']/i);
    if (match?.[1]) return match[1];
    
    // 7. Twitter card meta tags
    match = html.match(/<meta[^>]*name=["']twitter:data1["'][^>]*content=["']([^"']+)["'][^>]*>/i);
    if (match?.[1] && /\\d{4}/.test(match[1])) return match[1];
    
    // 8. Specific publisher formats
    // WordPress
    match = html.match(/<abbr[^>]*class=["'][^"']*published["'][^>]*title=["']([^"']+)["'][^>]*>/i);
    if (match?.[1]) return match[1];
    
    // Medium
    match = html.match(/data-post-published-at=["']([^"']+)["']/i);
    if (match?.[1]) return match[1];
    
    // 9. Look for ISO date patterns in the HTML (last resort)
    const isoDateMatch = html.match(/\\b(20\\d{2}[-\\/](0[1-9]|1[0-2])[-\\/](0[1-9]|[12]\\d|3[01])(?:T[\\d:]+(?:\\.\\d+)?(?:Z|[+-]\\d{2}:\\d{2})?)?)\\b/);
    if (isoDateMatch?.[1]) return isoDateMatch[1];
    
    return null;
};

// Function to extract page title
const extractTitle = (html) => {
    if (!html) return null;

    let match = html.match(/<title[^>]*>([\\s\\S]*?)<\\/title>/i);
    if (match?.[1]) return match[1].trim();

    match = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["'][^>]*>/i);
    if (match?.[1]) return match[1].trim();

    match = html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:title["'][^>]*>/i);
    if (match?.[1]) return match[1].trim();

    match = html.match(/<meta[^>]*name=["']twitter:title["'][^>]*content=["']([^"']+)["'][^>]*>/i);
    if (match?.[1]) return match[1].trim();

    return null;
};

// Function to extract meta description
const extractMetaDescription = (html) => {
    if (!html) return null;

    let match = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i);
    if (match?.[1]) return match[1].trim();

    match = html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["'][^>]*>/i);
    if (match?.[1]) return match[1].trim();

    match = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["'][^>]*>/i);
    if (match?.[1]) return match[1].trim();

    match = html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:description["'][^>]*>/i);
    if (match?.[1]) return match[1].trim();

    match = html.match(/<meta[^>]*name=["']twitter:description["'][^>]*content=["']([^"']+)["'][^>]*>/i);
    if (match?.[1]) return match[1].trim();

    return null;
};

// Extract values
const publishedDate = extractPublishedDate(htmlContent);
const title = extractTitle(htmlContent);
const metaDescription = extractMetaDescription(htmlContent);

// Return result
return {
    publishedDate,
    title,
    metaDescription
};`,
    };

    @node({
        id: '337f85ff-5c4e-45f0-b77c-f77b20c1f9b9',
        name: 'Structured Output Parser5',
        type: '@n8n/n8n-nodes-langchain.outputParserStructured',
        version: 1.3,
        position: [1264, 816],
        retryOnFail: true,
        waitBetweenTries: 5000,
    })
    StructuredOutputParser5 = {
        schemaType: 'manual',
        inputSchema: `{
  "type": "object",
  "properties": {
    "raw": {
      "type": "string",
      "description": "Keyword unchanged"
    },
    "uk_strategic": {
      "type": "string",
      "description": "UK/EU-focused strategic query (3-6 words)",
      "minLength": 3,
      "maxLength": 50
    },
    "regulatory": {
      "type": "string",
      "description": "Policy/compliance/mandate query (3-6 words)",
      "minLength": 3,
      "maxLength": 50
    },
    "market": {
      "type": "string",
      "description": "Supply/price/capacity query (3-6 words)",
      "minLength": 3,
      "maxLength": 50
    }
  },
  "required": ["raw", "uk_strategic", "regulatory", "market"],
  "additionalProperties": false
}`,
        autoFix: true,
    };

    @node({
        id: '64c41938-f4b5-4d17-ae00-e36bab7b2a17',
        name: 'DeepSeek 3.2',
        type: '@n8n/n8n-nodes-langchain.lmChatOpenRouter',
        version: 1,
        position: [832, 832],
        credentials: { openRouterApi: { id: 'kUkOiAL6PjmdfexG', name: 'Syntech GM OpenRouter account' } },
    })
    Deepseek32 = {
        model: 'deepseek/deepseek-v3.2',
        options: {},
    };

    @node({
        id: 'f5ea2675-3750-4e31-815c-9fd9585bae87',
        name: 'Split Out',
        type: 'n8n-nodes-base.splitOut',
        version: 1,
        position: [1632, 592],
    })
    SplitOut = {
        fieldToSplitOut: 'output',
        options: {},
    };

    @node({
        id: '46bd8f3e-c729-4fcc-bfc8-f818816085ae',
        name: 'DeepSeek 3.',
        type: '@n8n/n8n-nodes-langchain.lmChatOpenRouter',
        version: 1,
        position: [4048, 1120],
        credentials: { openRouterApi: { id: 'kUkOiAL6PjmdfexG', name: 'Syntech GM OpenRouter account' } },
    })
    Deepseek3 = {
        model: 'deepseek/deepseek-v3.2',
        options: {},
    };

    @node({
        id: '4cd282c9-1042-4561-83f0-b98bd0b8052d',
        name: 'create longtail keyword',
        type: '@n8n/n8n-nodes-langchain.chainLlm',
        version: 1.7,
        position: [-112, 2896],
        retryOnFail: true,
        waitBetweenTries: 5000,
    })
    CreateLongtailKeyword = {
        promptType: 'define',
        text: `=<content>
{{ $json.url_or_keyword }}
</content>`,
        hasOutputParser: true,
        messages: {
            messageValues: [
                {
                    message: `=# 📌 Prompt: Compact Google News Search Query Generator

Act as a compact Google News search query generator.

You will receive a single keyword related to sustainable biofuels (e.g., FAME Biodiesel, used cooking oil).

Your task is to generate **three short, keyword-optimized search phrases**, each focused on a different type of insight:

1. Recent News  
2. Market Price  
3. Investment Activity  

All queries should be focused on developments relevant to the **EU**.

---

## ✅ Rules

- Always include the input keyword exactly as provided  
- Keep each output compact, non-conversational, and max 5–6 words  
- Each output must emphasize one of the following:
  - **News** – general updates and coverage  
  - **Market** – price trends, market movements  
  - **Investment** – funding, company moves, infrastructure investment  
- Use compact terms like: news, update, market, price, investment, EU, policy  
- Never use punctuation or quotation marks  
- Never include years or dates  
- Use “EU” for location when helpful  
- Output exactly three variants following the output schema  
- Do not add commentary, markdown, or formatting  
- Output must be parsable by an output parser  

---

## 🧾 Input

A single keyword (string)

**Example Input:**  
used cooking oil

---

## 🧾 Output Schema

The output must follow **this exact structure** so it can be parsed reliably:

- \`news\`: a compact query focused on recent news  
- \`market\`: a compact query focused on price/market activity  
- \`investment\`: a compact query focused on funding/investment  

Structure:
\`\`\`json
{  
  news: [search phrase]  
  market: [search phrase]  
  investment: [search phrase]  
}

---

## 🧪 Example Output
\`\`\`json
{  
  news: used cooking oil EU biofuel news  
  market: used cooking oil EU market price  
  investment: used cooking oil EU investment update  
}`,
                },
            ],
        },
        batching: {},
    };

    @node({
        id: '9e6f34b6-9b12-42e2-a373-abec5c24f58f',
        name: 'create longtail keyword6 claude optimised',
        type: '@n8n/n8n-nodes-langchain.chainLlm',
        version: 1.7,
        position: [1072, 592],
        retryOnFail: true,
        waitBetweenTries: 5000,
    })
    CreateLongtailKeyword6ClaudeOptimised = {
        promptType: 'define',
        text: `=<content>
{{ $json.url_or_keyword }}
</content>`,
        hasOutputParser: true,
        needsFallback: true,
        messages: {
            messageValues: [
                {
                    message: `=Act as a compact search query generator optimized for discovering strategically relevant biofuel industry content.

You will receive a single keyword related to sustainable biofuels, renewable energy, infrastructure projects, or market entities.

Your task is to generate **four short, keyword-optimized search phrases**, each designed to capture different types of strategic intelligence:

1. **Raw** – Unchanged keyword (baseline search)
2. **UK Strategic** – UK/EU-focused content
3. **Regulatory** – Policy, compliance, mandates
4. **Market** – Supply, demand, pricing, capacity

---

## ✅ Rules

**Query Construction:**
- Keep each query **extremely compact: 2-3 words maximum**
- Include the input keyword exactly as provided (unless it's the raw query)
- Add only ONE additional term: UK, policy, market, price, etc.
- Trust Google News to find semantically related content
- Never use punctuation, quotation marks, or special characters
- Never include years, dates, or time references

**Query Pattern:**
- \`raw\`: [keyword] (unchanged)
- \`uk_strategic\`: [keyword] UK (or [keyword] EU)
- \`regulatory\`: [keyword] policy (or mandate/compliance/regulation)
- \`market\`: [keyword] market (or price/supply/capacity)

**Philosophy:**
- **Simpler is better** - Google News is smart enough to find relevant content
- **Broad captures more** - Let the algorithm handle semantic variations
- **2-3 words maximum** - Avoid over-specifying and limiting results

**Output Format:**
- Flat JSON structure with exactly 4 fields
- No commentary, markdown, or additional formatting
- Must be directly parsable by automated systems

---

## 🧾 Input

A single keyword (string)

**Example Inputs:**
- Technical terms: \`B100\`, \`FAME biodiesel\`, \`HVO\`, \`UCO\`
- Geographic: \`Lower Thames Crossing\`, \`Kingsnorth\`, \`Grangemouth\`
- Companies: \`Balfour Beatty\`, \`SSE\`, \`Neste\`, \`Volvo\`, \`Caterpillar\`
- Regulatory: \`RTFO\`, \`EN 14214\`
- General: \`used cooking oil\`, \`waste feedstock\`, \`drop-in fuel\`
- OEMs: \`Volvo\`, \`DAF\`, \`MAN\`, \`Scania\`, \`JCB\`, \`Caterpillar\`

---

## 🧾 Output Schema

The output must follow **this exact structure**:
\`\`\`json
{
  "raw": "[keyword unchanged]",
  "uk_strategic": "[keyword] UK",
  "regulatory": "[keyword] policy",
  "market": "[keyword] market"
}
\`\`\`

**Field Definitions:**

- \`raw\`: The keyword exactly as input, unchanged
- \`uk_strategic\`: Keyword + UK (or EU) - 2-3 words total
- \`regulatory\`: Keyword + policy (or mandate/compliance/regulation) - 2-3 words total
- \`market\`: Keyword + market (or price/supply/capacity) - 2-3 words total

---

## 🧪 Example Outputs

### Example 1: Technical Term
**Input:** \`B100\`
\`\`\`json
{
  "raw": "B100",
  "uk_strategic": "B100 UK",
  "regulatory": "B100 policy",
  "market": "B100 market"
}
\`\`\`

---

### Example 2: Feedstock Term
**Input:** \`used cooking oil\`
\`\`\`json
{
  "raw": "used cooking oil",
  "uk_strategic": "used cooking oil UK",
  "regulatory": "used cooking oil policy",
  "market": "used cooking oil price"
}
\`\`\`

---

### Example 3: Infrastructure Project
**Input:** \`Lower Thames Crossing\`
\`\`\`json
{
  "raw": "Lower Thames Crossing",
  "uk_strategic": "Lower Thames Crossing UK",
  "regulatory": "Lower Thames Crossing policy",
  "market": "Lower Thames Crossing market"
}
\`\`\`

---

### Example 4: OEM Company
**Input:** \`Volvo\`
\`\`\`json
{
  "raw": "Volvo",
  "uk_strategic": "Volvo UK",
  "regulatory": "Volvo emissions",
  "market": "Volvo market"
}
\`\`\`

---

### Example 5: Equipment Manufacturer
**Input:** \`Caterpillar\`
\`\`\`json
{
  "raw": "Caterpillar",
  "uk_strategic": "Caterpillar UK",
  "regulatory": "Caterpillar sustainability",
  "market": "Caterpillar market"
}
\`\`\`

---

### Example 6: Regulatory Term
**Input:** \`RTFO\`
\`\`\`json
{
  "raw": "RTFO",
  "uk_strategic": "RTFO UK",
  "regulatory": "RTFO compliance",
  "market": "RTFO price"
}
\`\`\`

---

### Example 7: Adjacent Technology
**Input:** \`sustainable aviation fuel\`
\`\`\`json
{
  "raw": "sustainable aviation fuel",
  "uk_strategic": "sustainable aviation fuel UK",
  "regulatory": "sustainable aviation fuel mandate",
  "market": "sustainable aviation fuel supply"
}
\`\`\`

---

### Example 8: Power Generation
**Input:** \`generators\`
\`\`\`json
{
  "raw": "generators",
  "uk_strategic": "generators UK",
  "regulatory": "generators emissions",
  "market": "generators market"
}
\`\`\`

---

### Example 9: Hydrogen/EV Context
**Input:** \`hydrogen vehicles\`
\`\`\`json
{
  "raw": "hydrogen vehicles",
  "uk_strategic": "hydrogen vehicles UK",
  "regulatory": "hydrogen vehicles policy",
  "market": "hydrogen vehicles market"
}
\`\`\`

---

### Example 10: VIP Client
**Input:** \`Balfour Beatty\`
\`\`\`json
{
  "raw": "Balfour Beatty",
  "uk_strategic": "Balfour Beatty UK",
  "regulatory": "Balfour Beatty sustainability",
  "market": "Balfour Beatty market"
}
\`\`\`

---

### Example 11: HVO
**Input:** \`HVO\`
\`\`\`json
{
  "raw": "HVO",
  "uk_strategic": "HVO UK",
  "regulatory": "HVO policy",
  "market": "HVO supply"
}
\`\`\`

---

### Example 12: Biodiesel
**Input:** \`biodiesel\`
\`\`\`json
{
  "raw": "biodiesel",
  "uk_strategic": "biodiesel UK",
  "regulatory": "biodiesel mandate",
  "market": "biodiesel price"
}
\`\`\`

---

## 📝 Query Design Principles

### **Trust Google News**
- Google's algorithm finds semantically related content automatically
- Simpler queries = broader coverage = more relevant results
- Over-specifying limits results unnecessarily

### **2-3 Words Maximum**
- Most queries should be exactly 2 words: \`[keyword] + [modifier]\`
- Only exception: multi-word input keywords (e.g., "used cooking oil")
- Total length after adding modifier: 2-3 words

### **Modifier Selection Guide**

**For uk_strategic:**
- Default: \`UK\`
- Alternative: \`EU\` (for EU-focused terms)

**For regulatory:**
- Default: \`policy\`
- For regulatory terms (RTFO, EN 14214): \`compliance\` or \`update\`
- For companies: \`emissions\` or \`sustainability\`
- Alternatives: \`mandate\`, \`regulation\`

**For market:**
- Default: \`market\`
- For feedstocks: \`price\` or \`supply\`
- For technical terms: \`capacity\` or \`supply\`
- Alternatives: \`demand\`, \`trends\`

---

## 🎯 Special Handling for Different Keyword Types

### **Technical Terms** (B100, FAME, HVO, UCO)
\`\`\`json
{
  "raw": "[keyword]",
  "uk_strategic": "[keyword] UK",
  "regulatory": "[keyword] policy",
  "market": "[keyword] market"
}
\`\`\`

### **Feedstocks** (used cooking oil, waste oils, tallow)
\`\`\`json
{
  "raw": "[keyword]",
  "uk_strategic": "[keyword] UK",
  "regulatory": "[keyword] policy",
  "market": "[keyword] price"
}
\`\`\`

### **Infrastructure/VIP** (Lower Thames Crossing, Balfour Beatty)
\`\`\`json
{
  "raw": "[keyword]",
  "uk_strategic": "[keyword] UK",
  "regulatory": "[keyword] policy",
  "market": "[keyword] market"
}
\`\`\`

### **OEMs** (Volvo, Caterpillar, DAF, JCB)
\`\`\`json
{
  "raw": "[keyword]",
  "uk_strategic": "[keyword] UK",
  "regulatory": "[keyword] emissions",
  "market": "[keyword] market"
}
\`\`\`

### **Regulatory Terms** (RTFO, EN 14214, SAF mandate)
\`\`\`json
{
  "raw": "[keyword]",
  "uk_strategic": "[keyword] UK",
  "regulatory": "[keyword] compliance",
  "market": "[keyword] price"
}
\`\`\`

---

## ⚠️ Critical Reminders

1. **Always output exactly 4 queries** in the specified JSON format
2. **Keep queries 2-3 words total** - trust Google to find relevant content
3. **Include the input keyword** in every query except \`raw\`
4. **Add only ONE modifier** per query (UK, policy, market, etc.)
5. **No punctuation, quotes, or special characters**
6. **No dates, years, or time references**
7. **Output only the JSON** – no commentary or markdown
8. **Be directly parsable** by automated systems
9. **Simpler is better** - broader queries yield more comprehensive results

---

## Example Decision Process

**Input:** \`biodiesel\`

**Think:**
- raw: Keep unchanged → \`biodiesel\`
- uk_strategic: Add UK → \`biodiesel UK\`
- regulatory: Policy term → \`biodiesel mandate\` (mandate more specific than policy for fuel)
- market: Pricing focus → \`biodiesel price\` (price more specific than market for commodity)

**Output:**
\`\`\`json
{
  "raw": "biodiesel",
  "uk_strategic": "biodiesel UK",
  "regulatory": "biodiesel mandate",
  "market": "biodiesel price"
}
\`\`\`

---

**Input:** \`Caterpillar\`

**Think:**
- raw: Keep unchanged → \`Caterpillar\`
- uk_strategic: Add UK → \`Caterpillar UK\`
- regulatory: Company sustainability → \`Caterpillar emissions\` (emissions more relevant than policy for OEM)
- market: General market → \`Caterpillar market\`

**Output:**
\`\`\`json
{
  "raw": "Caterpillar",
  "uk_strategic": "Caterpillar UK",
  "regulatory": "Caterpillar emissions",
  "market": "Caterpillar market"
}
\`\`\``,
                },
            ],
        },
        batching: {},
    };

    @node({
        id: '95bb4d6c-0bc2-465f-b504-5301534c4b8e',
        name: 'create longtail keyword6 claude optimised1',
        type: '@n8n/n8n-nodes-langchain.chainLlm',
        version: 1.7,
        position: [-112, 3120],
        retryOnFail: true,
        waitBetweenTries: 5000,
    })
    CreateLongtailKeyword6ClaudeOptimised1 = {
        promptType: 'define',
        text: `=<content>
{{ $json.url_or_keyword }}
</content>`,
        hasOutputParser: true,
        messages: {
            messageValues: [
                {
                    message: `=# 📌 Optimized Search Query Generator for Syntech Biofuel Content Discovery

Act as a compact search query generator optimized for discovering strategically relevant biofuel industry content.

You will receive a single keyword related to sustainable biofuels, renewable energy, infrastructure projects, or market entities.

Your task is to generate **seven short, keyword-optimized search phrases**, each designed to capture different types of strategic intelligence:

1. **Raw** – Unchanged keyword (baseline search)
2. **News (EU)** – EU-focused regulatory and policy developments
3. **News (Strategic)** – Broader geographic scope for operational intelligence and market parallels
4. **Regulatory** – Compliance, standards, mandates, frameworks
5. **Market** – Supply/demand dynamics, pricing, capacity trends
6. **Infrastructure** – Plant operations, logistics, collection networks, facilities
7. **Investment** – Funding, expansions, partnerships, strategic moves

---

## ✅ Rules

**Query Construction:**
- Keep each query compact: **3-5 words maximum**
- Include the input keyword exactly as provided (unless it's the raw query)
- Use concise industry terms: news, policy, supply, price, capacity, plant, operations, funding, expansion
- Never use punctuation, quotation marks, or special characters
- Never include years, dates, or time references
- Let search engines handle semantic variants naturally

**Geographic Approach:**
- Mix EU-specific and broader queries strategically
- Use "EU" when focusing on regulatory/policy developments
- Use "UK" for infrastructure and operations when appropriate
- Use broader terms (capacity, operations, trends) for global strategic intelligence

**Content Focus:**
Each query should target content types that score highly in relevance:
- Operational intelligence (plant operations, capacity changes, infrastructure)
- Market dynamics (supply/demand, pricing, production trends)
- Regulatory developments (policy updates, compliance, standards)
- Strategic moves (investments, partnerships, expansions)
- Business model insights (waste collection, processing, logistics)

**Output Format:**
- Flat JSON structure with exactly 7 fields
- No commentary, markdown, or additional formatting
- Must be directly parsable by automated systems

---

## 🧾 Input

A single keyword (string)

**Example Inputs:**
- Technical terms: \`B100\`, \`FAME biodiesel\`, \`HVO\`, \`UCO\`
- Geographic: \`Lower Thames Crossing\`, \`Kingsnorth\`, \`Grangemouth\`
- Companies: \`Balfour Beatty\`, \`SSE\`, \`Neste\`
- Regulatory: \`RTFO\`, \`EN 14214\`
- General: \`used cooking oil\`, \`waste feedstock\`, \`drop-in fuel\`

---

## 🧾 Output Schema

The output must follow **this exact structure**:

\`\`\`json
{
  "raw": "[keyword unchanged]",
  "news_eu": "[keyword] + EU + [news/policy term]",
  "news_broad": "[keyword] + [strategic term]",
  "regulatory": "[keyword] + [compliance/policy term]",
  "market": "[keyword] + [supply/price term]",
  "infrastructure": "[keyword] + [operations/facility term]",
  "investment": "[keyword] + [funding/expansion term]"
}
\`\`\`

**Field Definitions:**

- \`raw\`: The keyword exactly as input, unchanged
- \`news_eu\`: EU-focused regulatory, policy, or general news (3-5 words)
- \`news_broad\`: Broader geographic scope focusing on capacity, operations, market developments (3-5 words)
- \`regulatory\`: Policy, compliance, standards, mandates, frameworks (3-5 words)
- \`market\`: Supply, demand, price, capacity, production trends (3-5 words)
- \`infrastructure\`: Plant, facility, operations, logistics, collection networks (3-5 words)
- \`investment\`: Funding, expansion, partnerships, strategic investments (3-5 words)

---

## 🧪 Example Outputs

### Example 1: Technical Term
**Input:** \`B100\`

\`\`\`json
{
  "raw": "B100",
  "news_eu": "B100 EU policy",
  "news_broad": "B100 capacity trends",
  "regulatory": "B100 compliance standards",
  "market": "B100 supply price",
  "infrastructure": "B100 plant operations",
  "investment": "B100 expansion funding"
}
\`\`\`

---

### Example 2: Feedstock Term
**Input:** \`used cooking oil\`

\`\`\`json
{
  "raw": "used cooking oil",
  "news_eu": "used cooking oil EU regulation",
  "news_broad": "used cooking oil collection logistics",
  "regulatory": "used cooking oil policy mandate",
  "market": "used cooking oil supply price",
  "infrastructure": "used cooking oil processing plant",
  "investment": "used cooking oil facility expansion"
}
\`\`\`

---

### Example 3: Infrastructure Project
**Input:** \`Lower Thames Crossing\`

\`\`\`json
{
  "raw": "Lower Thames Crossing",
  "news_eu": "Lower Thames Crossing UK biofuel",
  "news_broad": "Lower Thames Crossing fuel supply",
  "regulatory": "Lower Thames Crossing emissions policy",
  "market": "Lower Thames Crossing contract suppliers",
  "infrastructure": "Lower Thames Crossing operations logistics",
  "investment": "Lower Thames Crossing funding decarbonisation"
}
\`\`\`

---

### Example 4: Company Name
**Input:** \`Balfour Beatty\`

\`\`\`json
{
  "raw": "Balfour Beatty",
  "news_eu": "Balfour Beatty UK sustainability",
  "news_broad": "Balfour Beatty biofuel operations",
  "regulatory": "Balfour Beatty emissions compliance",
  "market": "Balfour Beatty supply contracts",
  "infrastructure": "Balfour Beatty project fuel",
  "investment": "Balfour Beatty decarbonisation investment"
}
\`\`\`

---

### Example 5: Regulatory Term
**Input:** \`RTFO\`

\`\`\`json
{
  "raw": "RTFO",
  "news_eu": "RTFO UK policy update",
  "news_broad": "RTFO compliance trends",
  "regulatory": "RTFO mandate requirements",
  "market": "RTFO credit price",
  "infrastructure": "RTFO certified suppliers",
  "investment": "RTFO eligible projects"
}
\`\`\`

---

### Example 6: Adjacent Technology
**Input:** \`sustainable aviation fuel\`

\`\`\`json
{
  "raw": "sustainable aviation fuel",
  "news_eu": "sustainable aviation fuel EU mandate",
  "news_broad": "sustainable aviation fuel production capacity",
  "regulatory": "sustainable aviation fuel policy standards",
  "market": "sustainable aviation fuel feedstock supply",
  "infrastructure": "sustainable aviation fuel refinery operations",
  "investment": "sustainable aviation fuel facility expansion"
}
\`\`\`

---

### Example 7: Competitor
**Input:** \`Neste\`

\`\`\`json
{
  "raw": "Neste",
  "news_eu": "Neste EU operations",
  "news_broad": "Neste HVO capacity",
  "regulatory": "Neste renewable diesel compliance",
  "market": "Neste production supply",
  "infrastructure": "Neste refinery expansion",
  "investment": "Neste renewable fuel investment"
}
\`\`\`

---

## 📝 Query Design Principles

### **Balancing Specificity vs Coverage**

**Too specific (avoid):**
- ❌ \`B100 biodiesel UK infrastructure investment Q4 2024\`
- Why: Too narrow, will return very few results

**Too generic (avoid):**
- ❌ \`renewable energy\`
- Why: Too broad, returns irrelevant content

**Optimal (target):**
- ✅ \`B100 plant operations\`
- Why: Specific enough to be relevant, broad enough to return results

---

### **Geographic Strategy**

**Use "EU" for:**
- Regulatory and policy queries (\`news_eu\`, \`regulatory\`)
- Content focused on European market developments

**Use "UK" for:**
- Infrastructure projects (Lower Thames Crossing, Sizewell C)
- Company operations in UK market
- UK-specific regulatory terms (RTFO, UK SAF mandate)

**Use broader terms for:**
- Market intelligence (\`capacity\`, \`trends\`, \`supply\`)
- Operational insights (\`plant operations\`, \`collection logistics\`)
- Strategic parallels from other regions

**Why this works:**
- Captures EU/UK regulatory developments (Syntech's primary market)
- Also finds US/global content with strategic business model parallels
- Aligns with revised scoring prompt that values strategic context regardless of geography

---

### **Terminology Choices**

**Compact industry terms to use:**
- Policy, regulation, mandate, compliance, standards
- Supply, demand, price, capacity, production
- Plant, facility, refinery, operations, logistics
- Expansion, funding, investment, partnership
- Collection, processing, feedstock, waste

**Terms to avoid:**
- Long regulatory names (use abbreviations: RTFO not "Renewable Transport Fuel Obligation")
- Qualifiers like "latest", "recent", "new" (search engines prioritize recent content automatically)
- Company descriptors like "manufacturer", "producer" (implied by context)

---

### **Content Type Targeting**

Queries are designed to surface content that scores highly:

**Operational Intelligence:**
- Plant operations, capacity changes, facility expansions
- Collection networks, logistics, processing infrastructure
- Technology implementations, processing improvements

**Market Dynamics:**
- Supply/demand shifts, pricing trends
- Production capacity changes, plant closures/openings
- Feedstock availability, cost pressures

**Regulatory Developments:**
- Policy updates, mandate changes
- Compliance requirements, certification standards
- Framework adoptions, regulatory navigation

**Strategic Moves:**
- Investments, partnerships, expansions
- Company acquisitions, strategic alliances
- Funding announcements, financial backing

---

## 🎯 Special Handling for Different Keyword Types

The prompt should work intelligently across different input types:

### **Technical Terms** (B100, FAME, HVO, UCO)
- Focus on production, processing, market dynamics
- Include regulatory compliance and standards
- Capture supply chain and logistics

### **Geographic/Infrastructure** (Lower Thames Crossing, Kingsnorth)
- Emphasize UK context and project specifics
- Focus on fuel supply, operations, decarbonisation
- Capture contractor and supplier relationships

### **Companies** (Balfour Beatty, SSE, Neste)
- Balance competitive intelligence with partnership opportunities
- Capture operations, projects, sustainability initiatives
- Include investment and strategic moves

### **Regulatory** (RTFO, EN 14214, SAF mandate)
- Emphasize policy updates and compliance requirements
- Capture market impacts and industry responses
- Include certification and eligibility criteria

### **Feedstocks** (used cooking oil, waste oils, tallow)
- Focus on supply chain and collection logistics
- Capture pricing and availability dynamics
- Include processing and conversion technologies

---

## ⚠️ Critical Reminders

1. **Always output exactly 7 queries** in the specified JSON format
2. **Keep queries 3-5 words** for maximum search coverage
3. **Include the input keyword** in every query except \`raw\`
4. **No punctuation, quotes, or special characters**
5. **No dates, years, or time references**
6. **Output only the JSON** – no commentary or markdown
7. **Be directly parsable** by automated systems

---

## 🔄 Relationship to Content Scoring

These queries feed into the revised scoring system which evaluates:
- Strategic context and business model parallels
- Market intelligence and competitive landscape
- Regulatory developments and compliance insights
- Operational intelligence and infrastructure developments
- Source quality and content sentiment

**Query strategy aligns with scoring priorities:**
- Broader queries (\`news_broad\`, \`infrastructure\`) capture strategic parallels from any geography
- EU-focused queries (\`news_eu\`, \`regulatory\`) maintain regional focus
- Market queries surface capacity trends and competitive intelligence
- Investment queries capture expansions and strategic moves

The scoring system will filter for quality, relevance, and strategic value after search results are retrieved.`,
                },
            ],
        },
        batching: {},
    };

    @node({
        id: 'c13bc929-e293-4f91-85ad-9228c43ef139',
        name: 'If Not Error',
        type: 'n8n-nodes-base.if',
        version: 2.2,
        position: [4096, 288],
    })
    IfNotError = {
        conditions: {
            options: {
                caseSensitive: true,
                leftValue: '',
                typeValidation: 'strict',
                version: 2,
            },
            conditions: [
                {
                    id: '6e532ff2-3eee-4984-88ef-3cc30f2e6bdf',
                    leftValue: '={{ $json.error }}',
                    rightValue: '',
                    operator: {
                        type: 'string',
                        operation: 'notExists',
                        singleValue: true,
                    },
                },
            ],
            combinator: 'and',
        },
        options: {},
    };

    @node({
        id: 'ecd8da24-4f0a-4dff-b966-12095d4c3ed0',
        name: 'Structured Output Parser2',
        type: '@n8n/n8n-nodes-langchain.outputParserStructured',
        version: 1.3,
        position: [4576, 304],
    })
    StructuredOutputParser2 = {
        schemaType: 'manual',
        inputSchema: `{
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "description": "A compelling, benefit-driven title"
    },
    "summary": {
      "type": "string",
      "description": "A concise summary (max 50 words)"
    }
  },
  "required": ["title", "summary"]
}`,
        autoFix: true,
    };

    @node({
        id: 'fddc3745-2504-4172-998a-57c999eb5615',
        name: 'Merge9',
        type: 'n8n-nodes-base.merge',
        version: 3.2,
        position: [5968, 592],
    })
    Merge9 = {};

    @node({
        id: '2e89ec00-05ed-4a82-8cce-e44cc1482aeb',
        name: 'DeepSeek 3.1',
        type: '@n8n/n8n-nodes-langchain.lmChatOpenRouter',
        version: 1,
        position: [4208, 304],
        credentials: { openRouterApi: { id: 'kUkOiAL6PjmdfexG', name: 'Syntech GM OpenRouter account' } },
    })
    Deepseek31 = {
        model: 'deepseek/deepseek-v3.2',
        options: {},
    };

    @node({
        id: '9224d8fd-9f72-43db-9e8b-7a90965dca1f',
        name: 'RAG Web - Keyword Search',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [5168, 288],
    })
    RagWebKeywordSearch = {
        assignments: {
            assignments: [
                {
                    id: '1d34aa6b-dce8-4761-9a9a-a663f61a86ac',
                    name: 'title',
                    value: "={{ $('Merge').item.json.title || $('swap open ai with claude').item.json.output.title }}",
                    type: 'string',
                },
                {
                    id: 'ab5c9158-a33a-4f8f-b6d0-a6787df0f0d5',
                    name: 'content',
                    value: "={{ $('Scrape a url and get its content2').item.json.data.markdown.removeMarkdown() }}",
                    type: 'string',
                },
                {
                    id: 'f0c15fc7-071d-406d-8200-abecbf458836',
                    name: 'url',
                    value: `={{
  decodeURIComponent(
    ($('Merge').item.json.link || '')
      .replace(/^https?:\\/\\/www\\.google\\.com\\/url\\?.*?url=/, '')
      .split('&')[0]
  )
}}`,
                    type: 'string',
                },
                {
                    id: '81fb049e-bbc7-49f8-b932-9f2d3ae0305d',
                    name: 'summary',
                    value: "={{ $('swap open ai with claude').item.json.output.summary }}",
                    type: 'string',
                },
                {
                    id: '39872c24-4acc-4513-b7fb-7689cd511afb',
                    name: 'search_query',
                    value: "={{ $('Either Url or Keyword5').first().json.url_or_keyword }}",
                    type: 'string',
                },
                {
                    id: '42852696-c7af-4ce4-a273-e61970ef2e8f',
                    name: 'publication_date',
                    value: `={{ 
$('Merge').item.json.date 
|| $('Scrape a url and get its content2').item.json.data.metadata.publishedTime 
|| $('Scrape a url and get its content2').item.json.data.metadata.publishedTime 
|| $('Scrape a url and get its content2').item.json.data.metadata['article:published_time'] || '' }}`,
                    type: 'string',
                },
                {
                    id: '6bd73285-c360-4b10-8567-8ae66ecba2bd',
                    name: 'prompt',
                    value: "={{ $('When Executed by Another Workflow').first().json.prompt }}",
                    type: 'string',
                },
                {
                    id: '101c6d7f-6e56-4362-9238-0b3e4fd7f14d',
                    name: 'additional_formats',
                    value: "={{ $('When Executed by Another Workflow').first().json.additional_formats }}",
                    type: 'string',
                },
                {
                    id: 'a0b9d46b-67d2-4152-b1fa-2306fa5751e4',
                    name: 'source',
                    value: 'Website',
                    type: 'string',
                },
                {
                    id: '47689509-95e8-486e-85e5-d4423b40370e',
                    name: 'source_name',
                    value: "={{ $('Either Url or Keyword5').first().json.set_source_name }}",
                    type: 'string',
                },
                {
                    id: '07b65d02-7dc4-458c-adb7-954d30c26bfd',
                    name: 'source_category',
                    value: "={{ $('When Executed by Another Workflow').item.json.property_keyword_category }}",
                    type: 'string',
                },
                {
                    id: '9aea88f6-a629-4f42-ba37-8608bb631772',
                    name: 'mode',
                    value: "={{ $('When Executed by Another Workflow').first().json.process_mode }}",
                    type: 'string',
                },
            ],
        },
        options: {},
    };

    @node({
        id: 'bc11dc35-21e7-4522-bf0b-c7000232e7ab',
        name: 'If',
        type: 'n8n-nodes-base.if',
        version: 2.3,
        position: [3200, 592],
    })
    If_ = {
        conditions: {
            options: {
                caseSensitive: true,
                leftValue: '',
                typeValidation: 'loose',
                version: 3,
            },
            conditions: [
                {
                    id: 'afa01649-01d7-4563-98f0-7e0f3b86a7c1',
                    leftValue: '={{ $json.link }}',
                    rightValue: '',
                    operator: {
                        type: 'string',
                        operation: 'exists',
                        singleValue: true,
                    },
                },
            ],
            combinator: 'and',
        },
        looseTypeValidation: true,
        options: {},
    };

    @node({
        id: '79bbb1ed-79dc-4045-9ca0-a589653ebdc2',
        name: 'Has Data API Example',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [-112, 1568],
    })
    HasDataApiExample = {
        jsCode: `return {
  "requestMetadata": {
    "id": "e0164258-8d09-47f4-b436-33f13e3e51e5",
    "status": "ok",
    "html": "https://files.hasdata.com/e0164258-8d09-47f4-b436-33f13e3e51e5.html",
    "json": "https://files.hasdata.com/e0164258-8d09-47f4-b436-33f13e3e51e5.json",
    "url": "https://news.google.com/search?hl=en&gl=us&ceid=us%3Aen&q=balfour+beatty"
  },
  "newsResults": [
    {
      "link": "https://www.tipranks.com/news/company-announcements/balfour-beatty-continues-share-buyback-lifts-treasury-holdings-to-over-1-million-shares",
      "title": "Balfour Beatty Continues Share Buyback, Lifts Treasury Holdings to Over 1 Million Shares",
      "source": {
        "name": "TipRanks",
        "icon": "https://encrypted-tbn2.gstatic.com/faviconV2?url=https://www.tipranks.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
      },
      "date": "2026-01-26T07:25:55.000Z",
      "thumbnail": "https://blog.tipranks.com/wp-content/uploads/2023/06/Industrials-9-150x150.jpg",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iK0NnNXJTV1pSUjA5YVh6aFJXbGMxVFJDV0FSaVdBU2dLTWdZTmNJNUtOUWc=-w200-h112-p-df-rw",
      "position": 1
    },
    {
      "link": "https://finance.yahoo.com/news/price-target-shaping-story-balfour-180558597.html",
      "title": "How The New Price Target Is Shaping The Story For Balfour Beatty (LSE:BBY)",
      "source": {
        "name": "Yahoo Finance",
        "icon": "https://encrypted-tbn1.gstatic.com/faviconV2?url=https://finance.yahoo.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
      },
      "date": "2026-01-24T18:05:58.000Z",
      "thumbnail": "https://s.yimg.com/ny/api/res/1.2/dwvPQBmLx37V3keTdlHe6g--/YXBwaWQ9aGlnaGxhbmRlcjt3PTY0MDtoPTQ0Mg--/https://media.zenfs.com/en/simply_wall_st__316/c6c462914a42103d4ac688acc76cb016",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iJ0NnNUJVSEJXWkZGSFEwSXpiRk5rVFJDNkF4al9CQ2dLTWdNSkJ4UQ=-w200-h112-p-df-rw",
      "position": 2
    },
    {
      "link": "https://www.businesswire.com/news/home/20260122258604/en/Balfour-Beatty-Communities-Appoints-Jennifer-J.-Hill-as-President-of-Military-Housing",
      "title": "Balfour Beatty Communities Appoints Jennifer J. Hill as President of Military Housing",
      "source": {
        "name": "Business Wire",
        "icon": "https://encrypted-tbn3.gstatic.com/faviconV2?url=https://www.businesswire.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
      },
      "date": "2026-01-22T14:23:00.000Z",
      "thumbnail": "https://mms.businesswire.com/media/20260122258604/en/2699322/5/jenn_hill_headshot_PR.jpg?download\\\\u003d1",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iK0NnNUJORWg2VDJsR1ExRlVVMUo2VFJDc0JCaW9CQ2dLTWdhcEphRE5HUW8=-w200-h112-p-df-rw",
      "position": 3
    },
    {
      "link": "https://www.balfourbeatty.com/what-we-do/expertise/highways-services-and-asset-management/highways-services/",
      "title": "Highways Services",
      "source": {
        "name": "Balfour Beatty",
        "icon": "https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.balfourbeatty.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
      },
      "date": "2026-01-22T10:25:46.000Z",
      "thumbnail": "https://www.balfourbeatty.com/media/agzpdli4/compressed2018_09-15_bn2021_spmt_080-2.jpg",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iJ0NnNVhWbUkwYjJSak9YQXphbEZ6VFJERUF4aW1CU2dLTWdNRmdBWQ=-w200-h112-p-df-rw",
      "position": 4
    },
    {
      "link": "https://www.insurancebusinessmag.com/us/news/environmental/balfour-beatty-sues-insurers-for-treating-work-orders-as-legal-claims-562456.aspx",
      "title": "Balfour Beatty sues insurers for treating work orders as legal claims",
      "source": {
        "name": "Insurance Business",
        "icon": "https://encrypted-tbn2.gstatic.com/faviconV2?url=https://www.insurancebusinessmag.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
      },
      "date": "2026-01-20T09:31:43.000Z",
      "thumbnail": "https://cdn-res.keymedia.com/cdn-cgi/image/w\\\\u003d840,h\\\\u003d504,f\\\\u003dauto/https://cdn-res.keymedia.com/cms/images/us/003/0321_639045014982023770.png",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iK0NnNHpOVWRCVkc1WGNYRTRVMEZ6VFJDdUFSaWlBaWdCTWdhRm9aVG5RQWM=-w200-h112-p-df-rw",
      "position": 5
    },
    {
      "link": "https://www.investing.com/news/company-news/balfour-beatty-communities-names-jennifer-hill-as-military-housing-president-93CH-4460654",
      "title": "Balfour Beatty Communities names Jennifer Hill as military housing president",
      "source": {
        "name": "Investing.com",
        "icon": "https://encrypted-tbn2.gstatic.com/faviconV2?url=https://www.investing.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
      },
      "date": "2026-01-22T14:35:36.000Z",
      "position": 6
    },
    {
      "link": "https://markets.ft.com/data/announce/detail?dockey\\\\u003d600-202601220923BIZWIRE_USPRX____20260122_BW258604-1",
      "title": "Balfour Beatty Communities Appoints Jennifer J. Hill as President of Military Housing – Company Announcement",
      "source": {
        "name": "Financial Times",
        "icon": "https://encrypted-tbn2.gstatic.com/faviconV2?url=https://markets.ft.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
      },
      "date": "2026-01-22T14:23:00.000Z",
      "thumbnail": "https://mms.businesswire.com/media/20260122258604/en/2699322/4/jenn_hill_headshot_PR.jpg",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iK0NnNTBRekV4VkhkSFZqbGpVVEJOVFJEZ0F4amNBeWdLTWdhcEphRE5HUW8=-w200-h112-p-df-rw",
      "position": 7
    },
    {
      "link": "https://encrypted-tbn2.gstatic.com/faviconV2?url\\\\u003dhttp://www.msn.com\\\\u0026client\\\\u003dNEWS_360\\\\u0026size\\\\u003d96\\\\u0026type\\\\u003dFAVICON\\\\u0026fallback_opts\\\\u003dTYPE,SIZE,URL",
      "title": "WH Smith brings in ex Balfour Beatty boss to lead recovery after accounting blunder",
      "source": {
        "name": "MSN",
        "icon": "https://encrypted-tbn2.gstatic.com/faviconV2?url=http://www.msn.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
      },
      "date": "2026-01-23T09:48:24.000Z",
      "position": 8
    },
    {
      "link": "https://floridapolitics.com/archives/765521-balfour-beattys-troubling-legacy-federal-fraud-and-a-65-million-reckoning/",
      "title": "Balfour Beatty’s troubling legacy: Federal fraud and a $65 million reckoning",
      "source": {
        "name": "floridapolitics.com",
        "icon": "https://encrypted-tbn0.gstatic.com/faviconV2?url=https://floridapolitics.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL",
        "authors": [
          "Peter Schorsch"
        ]
      },
      "date": "2025-11-14T08:00:00.000Z",
      "thumbnail": "https://floridapolitics.com/wp-content/uploads/2025/11/balfour-beatty.webp",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iK0NnNXlUbEZmY1d0UldYRnRNVGhEVFJDUkF4ajhCU2dLTWdZcFFJanZwQVU=-w200-h112-p-df-rw",
      "position": 9
    },
    {
      "link": "https://www.constructiondive.com/news/balfour-beatty-growth-weakness-construction/807223/",
      "title": "Balfour Beatty touts growth despite US weakness",
      "source": {
        "name": "Construction Dive",
        "icon": "https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.constructiondive.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL",
        "authors": [
          "Matthew Thibault"
        ]
      },
      "date": "2025-12-05T08:00:00.000Z",
      "thumbnail": "https://imgproxy.divecdn.com/UcuMNZrQqVnf0pYbRZbkmzTAxoDLKDlYl2IuDs3ocKk/g:ce/rs:fill:1200:675:1/Z3M6Ly9kaXZlc2l0ZS1zdG9yYWdlL2RpdmVpbWFnZS9Db2xuZV9WYWxsZXlfVmlhZHVjdC5qcGc\\\\u003d.webp",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iK0NnNU5VbGRSWld0UFNHbzRRbk5MVFJDZkF4ampCU2dLTWdZQmdJS3R3UVE=-w200-h112-p-df-rw",
      "position": 10
    },
    {
      "link": "https://www.reuters.com/world/uk/uks-wh-smith-names-leo-quinn-new-chair-2026-01-19/",
      "title": "WH Smith names ex-Balfour Beatty chief as chair, shares soar",
      "source": {
        "name": "Reuters",
        "icon": "https://encrypted-tbn2.gstatic.com/faviconV2?url=https://www.reuters.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL",
        "authors": [
          "Yamini Kalia"
        ]
      },
      "date": "2026-01-19T08:59:00.000Z",
      "thumbnail": "https://www.reuters.com/resizer/v2/TFXUEEC5MNJHVIBZLMR7CWPULA.jpg?auth\\\\u003d0a75e6901f2656e5b7e459bd4bf104298f091778864965afcf9be6479658d338\\\\u0026width\\\\u003d1920\\\\u0026quality\\\\u003d80",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iL0NnNXRORkp3VG1kaVRsazRaVmQxVFJES0F4aWRCU2dLTWdrQkFvUmxEcW90bVFB=-w200-h112-p-df-rw",
      "position": 11
    },
    {
      "link": "https://www.balfourbeatty.com/media-centre/latest/balfour-beatty-completes-disposal-of-ten-infrastructure-investments-assets/",
      "title": "Balfour Beatty completes disposal of ten Infrastructure Investments assets",
      "source": {
        "name": "Balfour Beatty",
        "icon": "https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.balfourbeatty.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
      },
      "date": "2026-01-05T08:00:00.000Z",
      "thumbnail": "https://www.balfourbeatty.com/media/ax0dmps2/press-release.webp",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iK0NnNUJlRTF0Y25waGJXRTVlRFY0VFJESUFSamVBaWdLTWdhZFE0eHRKUVk=-w200-h112-p-df-rw",
      "position": 12
    },
    {
      "link": "https://www.tipranks.com/news/company-announcements/balfour-beatty-expands-share-buyback-lifts-treasury-stock-to-959039-shares",
      "title": "Balfour Beatty Expands Share Buyback, Lifts Treasury Stock to 959,039 Shares",
      "source": {
        "name": "TipRanks",
        "icon": "https://encrypted-tbn2.gstatic.com/faviconV2?url=https://www.tipranks.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
      },
      "date": "2026-01-23T07:25:51.000Z",
      "thumbnail": "https://blog.tipranks.com/wp-content/uploads/2023/06/Industrials-10-750x406.jpg",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iK0NnNHlaVlJpYjFWcmNYSkVWRzFYVFJDV0F4anVCU2dLTWdhUkE0cU5yUVE=-w200-h112-p-df-rw",
      "position": 13
    },
    {
      "link": "https://www.constructiondive.com/news/balfour-beatty-earnings-us-challenges/757678/",
      "title": "Balfour Beatty profits rise, but US arm struggles",
      "source": {
        "name": "Construction Dive",
        "icon": "https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.constructiondive.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL",
        "authors": [
          "Matthew Thibault"
        ]
      },
      "date": "2025-08-15T07:00:00.000Z",
      "thumbnail": "https://imgproxy.divecdn.com/UcuMNZrQqVnf0pYbRZbkmzTAxoDLKDlYl2IuDs3ocKk/g:ce/rs:fill:1200:675:1/Z3M6Ly9kaXZlc2l0ZS1zdG9yYWdlL2RpdmVpbWFnZS9Db2xuZV9WYWxsZXlfVmlhZHVjdC5qcGc\\\\u003d.webp",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iK0NnNU5VbGRSWld0UFNHbzRRbk5MVFJDZkF4ampCU2dLTWdZQmdJS3R3UVE=-w200-h112-p-df-rw",
      "position": 14
    },
    {
      "link": "https://www.balfourbeatty.com/media-centre/latest/balfour-beatty-appoints-managing-director-to-lead-its-uk-regional-civils-business/",
      "title": "Balfour Beatty appoints Managing Director to lead its UK Regional Civils business",
      "source": {
        "name": "Balfour Beatty",
        "icon": "https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.balfourbeatty.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
      },
      "date": "2026-01-19T14:32:59.000Z",
      "thumbnail": "https://www.balfourbeatty.com/media/h0kbsi0g/preferred-photo-for-kay-slade.jpg",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iK0NnNXFjMWhRVmtkTVpVVk9NSGxyVFJERUF4aW5CU2dLTWdhdFZZak5KUWc=-w200-h112-p-df-rw",
      "position": 15
    },
    {
      "link": "https://www.tipranks.com/news/company-announcements/balfour-beatty-advances-share-buyback-tightening-voting-share-base",
      "title": "Balfour Beatty Advances Share Buyback, Tightening Voting Share Base",
      "source": {
        "name": "TipRanks",
        "icon": "https://encrypted-tbn2.gstatic.com/faviconV2?url=https://www.tipranks.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
      },
      "date": "2026-01-22T07:29:03.000Z",
      "thumbnail": "https://blog.tipranks.com/wp-content/uploads/2023/06/Industrials-7-750x406.jpg",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iJ0NnNUdUbHBVYW1OSVJtODNNR3RKVFJDV0F4anVCU2dLTWdPQm9BWQ=-w200-h112-p-df-rw",
      "position": 16
    },
    {
      "link": "https://www.balfourbeatty.com/media-centre/latest/balfour-beatty-2025-trading-update/",
      "title": "Balfour Beatty 2025 Trading Update",
      "source": {
        "name": "Balfour Beatty",
        "icon": "https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.balfourbeatty.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
      },
      "date": "2025-12-04T08:00:00.000Z",
      "thumbnail": "https://www.balfourbeatty.com/media/hp3ocpfk/balfour-beatty-2023-agm-trading-update.png",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iK0NnNTNUelZHTTBNNFNuWmhkMWRzVFJDckFSaW5BaWdCTWdZZHBKQ01PUVk=-w200-h112-p-df-rw",
      "position": 17
    },
    {
      "link": "https://www.tipranks.com/news/company-announcements/balfour-beatty-updates-market-on-progress-of-share-buyback-programme",
      "title": "Balfour Beatty Updates Market on Progress of Share Buyback Programme",
      "source": {
        "name": "TipRanks",
        "icon": "https://encrypted-tbn2.gstatic.com/faviconV2?url=https://www.tipranks.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
      },
      "date": "2026-01-21T07:28:00.000Z",
      "thumbnail": "https://blog.tipranks.com/wp-content/uploads/2023/06/Industrials-2-750x406.jpg",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iMkNnNHRhV3R1YWw5blJFNWxVVkpSVFJDV0F4anVCU2dLTWdzQkVJcEZtZVRZQ01yZVBR=-w200-h112-p-df-rw",
      "position": 18
    },
    {
      "link": "https://www.balfourbeatty.com/media-centre/latest/balfour-beatty-unveils-72-million-ai-investment-transforming-how-britain-builds/",
      "title": "Balfour Beatty unveils £7.2 million AI investment: transforming how Britain builds",
      "source": {
        "name": "Balfour Beatty",
        "icon": "https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.balfourbeatty.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
      },
      "date": "2025-07-31T07:00:00.000Z",
      "thumbnail": "https://www.balfourbeatty.com/media/yu1nlxip/bb_copilot_press.jpg",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iK0NnNTBMVWxSYUdFeFdqQXplbGxSVFJERUJCaVJCQ2dLTWdZTk1vWm9uUVU=-w200-h112-p-df-rw",
      "position": 19
    },
    {
      "link": "https://www.balfourbeatty.com/media-centre/latest/balfour-beatty-secures-two-spots-on-national-grid-s-59-billion-high-voltage-direct-current-supply-chain-framework/",
      "title": "Balfour Beatty secures two spots on National Grid’s £59 billion High Voltage Direct Current supply chain framework",
      "source": {
        "name": "Balfour Beatty",
        "icon": "https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.balfourbeatty.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
      },
      "date": "2025-08-21T07:00:00.000Z",
      "thumbnail": "https://www.balfourbeatty.com/media/blgdqxy2/signings_2505010_0002.jpg",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iL0NnNVRUbkZ2ZEVkME1qSjBPVkY0VFJERUF4aW1CU2dLTWdrQlFKTG1NS2NlaHdJ=-w200-h112-p-df-rw",
      "position": 20
    },
    {
      "link": "https://www.balfourbeatty.com/media-centre/latest/balfour-beatty-completes-sale-of-omnicom/",
      "title": "Balfour Beatty completes sale of Omnicom",
      "source": {
        "name": "Balfour Beatty",
        "icon": "https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.balfourbeatty.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
      },
      "date": "2025-08-01T07:00:00.000Z",
      "thumbnail": "https://app-bb-u13-prod-westeurope.azurewebsites.net/media/ax0dmps2/press-release.webp?quality\\\\u003d90\\\\u0026v\\\\u003d1db604bbf3707b0",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iK0NnNWtjRGt0VDFWTFYzRXdibWRsVFJESUFSamVBaWdLTWdhZFE0eHRKUVk=-w200-h112-p-df-rw",
      "position": 21
    },
    {
      "link": "https://www.tipranks.com/news/company-announcements/balfour-beatty-expands-treasury-stock-with-ongoing-share-buyback",
      "title": "Balfour Beatty Expands Treasury Stock with Ongoing Share Buyback",
      "source": {
        "name": "TipRanks",
        "icon": "https://encrypted-tbn2.gstatic.com/faviconV2?url=https://www.tipranks.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
      },
      "date": "2026-01-20T07:34:19.000Z",
      "thumbnail": "https://blog.tipranks.com/wp-content/uploads/2023/06/Industrials-1-750x406.jpg",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iL0NnNWpSUzEzV1ZCc1JqaExia2wzVFJDV0F4anVCU2dLTWdrQklJQ2lIZWhUVUFF=-w200-h112-p-df-rw",
      "position": 22
    },
    {
      "link": "https://www.balfourbeatty.com/media-centre/latest/balfour-beatty-selected-by-rolls-royce-as-its-fissile-construction-partner/",
      "title": "Balfour Beatty selected by Rolls Royce as its fissile construction partner",
      "source": {
        "name": "Balfour Beatty",
        "icon": "https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.balfourbeatty.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
      },
      "date": "2025-09-09T07:00:00.000Z",
      "thumbnail": "https://www.balfourbeatty.com/media/gelhfhrg/submarines-raynesway-site-img.jpg",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iK0NnNDBaekJ2WDB4MlJ6aEhiVUZZVFJDZkF4amlCU2dLTWdZSmtKQXF1UVk=-w200-h112-p-df-rw",
      "position": 23
    },
    {
      "link": "https://www.balfourbeatty.com/media-centre/latest/balfour-beatty-launches-updated-building-new-futures-sustainability-strategy/",
      "title": "Balfour Beatty launches updated Building New Futures Sustainability Strategy",
      "source": {
        "name": "Balfour Beatty",
        "icon": "https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.balfourbeatty.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
      },
      "date": "2025-07-23T07:00:00.000Z",
      "thumbnail": "https://www.balfourbeatty.com/media/0rehqkcw/a4-landscape-cover-1.png",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iK0NnNVdhVUUxZDNaUlZGRkVWR0Y0VFJEZ0F4aUFCU2dLTWdZZGRKQ3JzUVk=-w200-h112-p-df-rw",
      "position": 24
    },
    {
      "link": "https://www.balfourbeatty.com/media-centre/latest/balfour-beatty-mobilises-to-begin-construction-on-grand-hyatt-miami-beach-in-the-us/",
      "title": "Balfour Beatty mobilises to begin construction on Grand Hyatt Miami Beach in the US",
      "source": {
        "name": "Balfour Beatty",
        "icon": "https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.balfourbeatty.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
      },
      "date": "2025-04-29T07:00:00.000Z",
      "thumbnail": "https://www.balfourbeatty.com/media/ax0dmps2/press-release.webp",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iK0NnNUJlRTF0Y25waGJXRTVlRFY0VFJESUFSamVBaWdLTWdhZFE0eHRKUVk=-w200-h112-p-df-rw",
      "position": 25
    },
    {
      "link": "https://www.businesswire.com/news/home/20260114924695/en/Balfour-Beatty-Campus-Solutions-Celebrates-Topping-Out-Milestone-for-UT-Austin-Student-Housing-Project",
      "title": "Balfour Beatty Campus Solutions Celebrates Topping Out Milestone for UT Austin Student Housing Project",
      "source": {
        "name": "Business Wire",
        "icon": "https://encrypted-tbn3.gstatic.com/faviconV2?url=https://www.businesswire.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
      },
      "date": "2026-01-14T15:08:00.000Z",
      "thumbnail": "https://mms.businesswire.com/media/20260114924695/en/2692073/5/BBCS-UTAustinTopOut-Blog.jpg?download\\\\u003d1",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iL0NnNVBORk5XUlcwelNUZE5NSFZyVFJDM0FSaVRBaWdCTWdrQlVJanpvT2F3VHdF=-w200-h112-p-df-rw",
      "position": 26
    },
    {
      "link": "https://www.balfourbeatty.com/media-centre/latest/balfour-beatty-2025-half-year-results/",
      "title": "Balfour Beatty 2025 half year results",
      "source": {
        "name": "Balfour Beatty",
        "icon": "https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.balfourbeatty.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
      },
      "date": "2025-08-13T07:00:00.000Z",
      "thumbnail": "https://www.balfourbeatty.com/media/ax0dmps2/press-release.webp",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iK0NnNUJlRTF0Y25waGJXRTVlRFY0VFJESUFSamVBaWdLTWdhZFE0eHRKUVk=-w200-h112-p-df-rw",
      "position": 27
    },
    {
      "link": "https://www.army.mil/article/289396/empty_seats_big_questions_at_fort_stewarts_year_end_town_hall",
      "title": "Empty seats, big questions at Fort Stewart's year-end town hall",
      "source": {
        "name": "army.mil",
        "icon": "https://encrypted-tbn2.gstatic.com/faviconV2?url=https://www.army.mil&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
      },
      "date": "2025-12-05T08:00:00.000Z",
      "thumbnail": "https://api.army.mil/e2/c/images/2025/12/05/1db378a5/max1200.jpg",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iK0NnNVFWWE5GVmxCU2MyRktiV3MyVFJERUF4aW1CU2dLTWdZTk1wandHQW8=-w200-h112-p-df-rw",
      "position": 28
    },
    {
      "link": "https://floridapolitics.com/archives/764631-lawsuit-alleges-balfour-beatty-systematically-failed-to-address-critical-problems-at-naval-air-station-key-west/",
      "title": "Lawsuit alleges Balfour Beatty systematically failed to address critical problems at Naval Air Station Key West",
      "source": {
        "name": "floridapolitics.com",
        "icon": "https://encrypted-tbn0.gstatic.com/faviconV2?url=https://floridapolitics.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL",
        "authors": [
          "Peter Schorsch"
        ]
      },
      "date": "2025-11-10T08:00:00.000Z",
      "thumbnail": "https://floridapolitics.com/wp-content/uploads/2019/12/NAS-Key-West.jpg",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iK0NnNUZOVUkyWlZOZmMycDRka2xJVFJERUF4aW1CU2dLTWdZQllKaURMQWc=-w200-h112-p-df-rw",
      "position": 29
    },
    {
      "link": "https://www.balfourbeatty.com/media-centre/latest/balfour-beatty-secures-833-million-net-zero-teesside-contract/",
      "title": "Balfour Beatty secures £833 million Net Zero Teesside contract",
      "source": {
        "name": "Balfour Beatty",
        "icon": "https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.balfourbeatty.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
      },
      "date": "2025-06-26T07:00:00.000Z",
      "thumbnail": "https://www.balfourbeatty.com/media/wcwpjo4u/nzt-power-illustation.jpg",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iK0NnNU1iWGxXU1VNMWF5MTFhSFYzVFJDZkF4ampCU2dLTWdZSllJQk5NUWM=-w200-h112-p-df-rw",
      "position": 30
    },
    {
      "link": "https://www.balfourbeatty.com/media-centre/latest/balfour-beatty-features-in-the-financial-times-discussing-how-businesses-can-unlock-gen-z-s-leadership-potential/",
      "title": "Balfour Beatty features in the FT discussing how businesses can unlock Gen Z’s leadership potential",
      "source": {
        "name": "Balfour Beatty",
        "icon": "https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.balfourbeatty.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
      },
      "date": "2025-10-23T07:00:00.000Z",
      "thumbnail": "https://www.balfourbeatty.com/media/t1djexoh/1702911796637.jpeg",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iK0NnNDJhRU56VFhaNE1USlRPV2xsVFJDcUJCaXFCQ2dLTWdhdFJaYk9JUWs=-w200-h112-p-df-rw",
      "position": 31
    },
    {
      "link": "https://www.balfourbeatty.com/media-centre/latest/balfour-beatty-welcomes-joanna-vezey-as-managing-director-of-its-uk-highways-business/",
      "title": "Balfour Beatty welcomes Joanna Vezey as Managing Director of its UK Highways business",
      "source": {
        "name": "Balfour Beatty",
        "icon": "https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.balfourbeatty.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
      },
      "date": "2025-09-30T07:00:00.000Z",
      "thumbnail": "https://www.balfourbeatty.com/media/o1ljn1eg/joannavezey_the-hub.jpg",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iK0NnNVRVM0pOUm5oUFQwUjNMVmwyVFJERUF4aW1CU2dLTWdZdFZaS3VwUWM=-w200-h112-p-df-rw",
      "position": 32
    },
    {
      "link": "https://www.balfourbeatty.com/media-centre/latest/balfour-beatty-set-to-protect-homes-businesses-and-farmland-through-47-million-flood-defence-contract/",
      "title": "Balfour Beatty set to protect homes, businesses and farmland through £47m flood defence contract",
      "source": {
        "name": "Balfour Beatty",
        "icon": "https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.balfourbeatty.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
      },
      "date": "2025-08-28T07:00:00.000Z",
      "thumbnail": "https://www.balfourbeatty.com/media/coghaffp/benacre-arial-view-updt.png",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iK0NnNUdSMkZpY1ZWM1VtUnFlVEEwVFJDNEF4aTVCU2dLTWdZSkVJeUtuQVU=-w200-h112-p-df-rw",
      "position": 33
    },
    {
      "link": "https://www.balfourbeatty.com/media-centre/latest/helping-apprentices-thrive-balfour-beatty-features-in-new-civil-engineer/",
      "title": "Helping apprentices thrive: Balfour Beatty features in New Civil Engineer",
      "source": {
        "name": "Balfour Beatty",
        "icon": "https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.balfourbeatty.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
      },
      "date": "2025-12-18T08:00:00.000Z",
      "thumbnail": "https://www.balfourbeatty.com/media/iu4nmxlm/tanvi.png",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iK0NnNTFWemcwUVVWbmNXTllNalZQVFJDQUJSamdBeWdLTWdZdHBaQ3V0UVk=-w200-h112-p-df-rw",
      "position": 34
    },
    {
      "link": "https://www.balfourbeatty.com/media-centre/latest/balfour-beatty-completes-disposal-of-foundry-courtyard-student-accommodation/",
      "title": "Balfour Beatty completes disposal of Foundry Courtyard student accommodation",
      "source": {
        "name": "Balfour Beatty",
        "icon": "https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.balfourbeatty.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
      },
      "date": "2025-12-19T08:00:00.000Z",
      "thumbnail": "https://www.balfourbeatty.com/media/r0unhlgg/press-release.jpg?width\\\\u003d250\\\\u0026height\\\\u003d145\\\\u0026v\\\\u003d1da65a11c5f5240",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iK0NnNXBlVlJhTWtSUGNsRlhTV2hPVFJDUkFSajZBU2dCTWdhaFE0eHVKUVk=-w200-h112-p-df-rw",
      "position": 35
    },
    {
      "link": "https://www.constructiondive.com/news/balfour-beatty-invests-microsoft-ai/757497/",
      "title": "Balfour Beatty invests nearly $10M in Microsoft AI",
      "source": {
        "name": "Construction Dive",
        "icon": "https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.constructiondive.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL",
        "authors": [
          "Matthew Thibault"
        ]
      },
      "date": "2025-08-13T07:00:00.000Z",
      "thumbnail": "https://imgproxy.divecdn.com/IYiGzODuO84HqnaSraPf-0Ph78WK_89LraGFMcKFc0s/g:ce/rs:fill:1200:675:1/Z3M6Ly9kaXZlc2l0ZS1zdG9yYWdlL2RpdmVpbWFnZS9hOV9oaWdod2F5LndlYnA\\\\u003d.webp",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iMkNnNTVaRWxOU210U1RXRmplbkJrVFJDZkF4ampCU2dLTWdzQkVJSUxwYUtwMW9pUExB=-w200-h112-p-df-rw",
      "position": 36
    },
    {
      "link": "https://www.unleash.ai/artificial-intelligence/balfour-beatty-cio-in-the-age-of-ai-the-organizations-that-will-thrive-are-those-where-hr-it-work-in-lockstep/",
      "title": "Balfour Beatty CIO: In the age of AI, ‘the organizations that will thrive are those where HR & IT work in lockstep’",
      "source": {
        "name": "unleash.ai",
        "icon": "https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.unleash.ai&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
      },
      "date": "2025-09-09T07:00:00.000Z",
      "thumbnail": "https://www.unleash.ai/wp-content/uploads/2025/09/BB_Littlebrook_141021_52_of_4111.jpg",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iK0NnNW1iM1U0WXpWa1lsOWxWM0JTVFJDM0FSaVRBaWdCTWdZQmc0Z29OUVk=-w200-h112-p-df-rw",
      "position": 37
    },
    {
      "link": "https://www.balfourbeatty.com/media-centre/latest/balfour-beatty-features-in-unleash-discussing-the-wide-ranging-benefits-of-microsoft-365-copilot/",
      "title": "Balfour Beatty features in UNLEASH discussing the wide ranging benefits of Microsoft 365 Copilot",
      "source": {
        "name": "Balfour Beatty",
        "icon": "https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.balfourbeatty.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
      },
      "date": "2025-09-16T07:00:00.000Z",
      "thumbnail": "https://www.balfourbeatty.com/media/tnbb42og/jon-o.png",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iK0NnNDFVbTlUUjFKVGFYVTFhRnBQVFJDbUJCaW1CQ2dLTWdZcFZaak5wUWc=-w200-h112-p-df-rw",
      "position": 38
    },
    {
      "link": "https://finance.yahoo.com/news/balfour-beatty-lon-bby-due-051450431.html",
      "title": "Balfour Beatty (LON:BBY) Is Due To Pay A Dividend Of £0.042",
      "source": {
        "name": "Yahoo Finance",
        "icon": "https://encrypted-tbn1.gstatic.com/faviconV2?url=https://finance.yahoo.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
      },
      "date": "2025-10-28T07:00:00.000Z",
      "thumbnail": "https://s.yimg.com/ny/api/res/1.2/iKCvirtQnZGdbLoKbCMnkw--/YXBwaWQ9aGlnaGxhbmRlcjt3PTI0MDA7aD0xNDQ0/https://media.zenfs.com/en/simply_wall_st__316/b51629222c8885381352698338d7e383",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iK0NnNUlXa1Y1WjJWMlZWcGlSMmRrVFJDdEF4aktCU2dLTWdhZEFwQXdoUWs=-w200-h112-p-df-rw",
      "position": 39
    },
    {
      "link": "https://www.constructiondive.com/news/balfour-beatty-ai-hackathon-us/759107/",
      "title": "Balfour Beatty plans stateside AI hackathon",
      "source": {
        "name": "Construction Dive",
        "icon": "https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.constructiondive.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL",
        "authors": [
          "Matthew Thibault"
        ]
      },
      "date": "2025-09-03T07:00:00.000Z",
      "thumbnail": "https://imgproxy.divecdn.com/qbpIqbzeiIu_V6geSc9J9avLnFag-fURumBm2ZOB6xw/g:nowe:0:0/c:3000:1694/rs:fill:1200:675:1/Z3M6Ly9kaXZlc2l0ZS1zdG9yYWdlL2RpdmVpbWFnZS9HZXR0eUltYWdlcy0yMTM2MzQxNjc1LmpwZw\\\\u003d\\\\u003d.webp",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iK0NnNDFhWFZHZFdneFdWRTFiemhWVFJDZkF4ampCU2dLTWdZZFlJcnN0UVU=-w200-h112-p-df-rw",
      "position": 40
    },
    {
      "link": "https://www.balfourbeatty.com/media-centre/latest/philip-hoare-joins-balfour-beatty-as-group-chief-executive/",
      "title": "Philip Hoare joins Balfour Beatty as Group Chief Executive",
      "source": {
        "name": "Balfour Beatty",
        "icon": "https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.balfourbeatty.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
      },
      "date": "2025-09-08T07:00:00.000Z",
      "thumbnail": "https://www.balfourbeatty.com/media/0kudune1/2627947794-philip-hoare.jpg",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iK0NnNUdaM1p3ZGxWc1duWjBhMHBPVFJDcUJCaXFCQ2dLTWdhbFZaYk5KUWc=-w200-h112-p-df-rw",
      "position": 41
    },
    {
      "link": "https://www.businesswire.com/news/home/20251120312948/en/Balfour-Beatty-Communities-Foundation-Appoints-Sean-Kent-as-President-and-Board-Member",
      "title": "Balfour Beatty Communities Foundation Appoints Sean Kent as President and Board Member",
      "source": {
        "name": "Business Wire",
        "icon": "https://encrypted-tbn3.gstatic.com/faviconV2?url=https://www.businesswire.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
      },
      "date": "2025-11-20T08:00:00.000Z",
      "thumbnail": "https://mms.businesswire.com/media/20251120312948/en/2649524/5/Preferred_1stPicks_119.jpg?download\\\\u003d1",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iK0NnNTVhbXBHV2xoTVJFRXhjRjk0VFJERUF4aW1CU2dLTWdhbEpwb01HZ28=-w200-h112-p-df-rw",
      "position": 42
    },
    {
      "link": "https://www.reuters.com/world/uk/uks-balfour-beatty-sees-higher-2025-profit-uk-construction-strength-2025-12-04/",
      "title": "Balfour Beatty sees 20% order book jump in 2025 on UK power generation demand",
      "source": {
        "name": "Reuters",
        "icon": "https://encrypted-tbn2.gstatic.com/faviconV2?url=https://www.reuters.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
      },
      "date": "2025-12-04T08:00:00.000Z",
      "thumbnail": "https://www.reuters.com/resizer/v2/2QJYOTURIVNDPKE63OJECLTYJQ.jpg?auth\\\\u003da2eb72330cecb750adac1e6d3d95ac22b04bd36692e59308a2829f1a5246312c\\\\u0026width\\\\u003d1920\\\\u0026quality\\\\u003d80",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iK0NnNHlSRE5mU1VkVk0yTkxiM3BuVFJEYkF4aUZCU2dLTWdhTlpJRUg4Z0E=-w200-h112-p-df-rw",
      "position": 43
    },
    {
      "link": "https://finance.yahoo.com/news/investing-balfour-beatty-lon-bby-055131058.html",
      "title": "Investing in Balfour Beatty (LON:BBY) five years ago would have delivered you a 233% gain",
      "source": {
        "name": "Yahoo Finance",
        "icon": "https://encrypted-tbn1.gstatic.com/faviconV2?url=https://finance.yahoo.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
      },
      "date": "2025-10-13T07:00:00.000Z",
      "thumbnail": "https://s.yimg.com/ny/api/res/1.2/MitQud9bh7aEAuR0sYMQMg--/YXBwaWQ9aGlnaGxhbmRlcjt3PTI0MDA7aD0xNTIw/https://media.zenfs.com/en/simply_wall_st__316/9d9b37b00783766bcc76345b32f0df21",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iI0NnNTZaRkpsYVdkcVVHaHNZMk40VFJDNUF4aTRCU2dLTWdB=-w200-h112-p-df-rw",
      "position": 44
    },
    {
      "link": "https://floridapolitics.com/archives/764840-key-west-families-sue-balfour-beatty-alleging-toxic-living-conditions-in-military-housing/",
      "title": "Key West families sue Balfour Beatty, alleging toxic living conditions in military housing",
      "source": {
        "name": "floridapolitics.com",
        "icon": "https://encrypted-tbn0.gstatic.com/faviconV2?url=https://floridapolitics.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL",
        "authors": [
          "Peter Schorsch"
        ]
      },
      "date": "2025-11-12T08:00:00.000Z",
      "thumbnail": "https://floridapolitics.com/wp-content/uploads/2016/05/court-lawsuit-Large.jpg",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iL0NnNDROVjk2U0c4dFpIQTRSWEF6VFJEREF4aW5CU2dLTWdrQmNJeVRLR2FwVHdF=-w200-h112-p-df-rw",
      "position": 45
    },
    {
      "link": "https://www.balfourbeatty.com/media-centre/latest/balfour-beatty-secures-162-million-contract-to-deliver-landmark-dunard-centre-in-edinburgh/",
      "title": "Balfour Beatty secures £162 million contract to deliver landmark Dunard Centre in Edinburgh",
      "source": {
        "name": "Balfour Beatty",
        "icon": "https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.balfourbeatty.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
      },
      "date": "2025-10-24T07:00:00.000Z",
      "thumbnail": "https://www.balfourbeatty.com/media/b4kgnung/1485-dca-dunard-centre-render-06-5ae402c9837860cd.jpg",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iK0NnNUVZM2xUVUcxRFQyWXlSMEpJVFJDcUJCaXFCQ2dLTWdhSmdZUk8xUU0=-w200-h112-p-df-rw",
      "position": 46
    },
    {
      "link": "https://richmondbizsense.com/2025/09/08/contracting-giant-balfour-beatty-puts-down-roots-in-scotts-addition/",
      "title": "Contracting giant Balfour Beatty puts down roots in Scott’s Addition",
      "source": {
        "name": "richmondbizsense.com",
        "icon": "https://encrypted-tbn0.gstatic.com/faviconV2?url=https://richmondbizsense.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL",
        "authors": [
          "Mike Platania"
        ]
      },
      "date": "2025-09-08T07:00:00.000Z",
      "thumbnail": "https://richmondbizsense.com/wp-content/uploads/2025/09/balfour-beatty-richmond-1-Cropped-scaled.jpg",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iK0NnNVBPWFkwU0VsaVFUVTNiV3AyVFJDZkF4ampCU2dLTWdZQlVJUk1yUVE=-w200-h112-p-df-rw",
      "position": 47
    },
    {
      "link": "https://www.balfourbeatty.com/media-centre/latest/balfour-beatty-appoints-nick-rowan-as-managing-director-of-its-regional-business-in-scotland/",
      "title": "Balfour Beatty appoints Nick Rowan as Managing Director of its Regional business in Scotland",
      "source": {
        "name": "Balfour Beatty",
        "icon": "https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.balfourbeatty.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
      },
      "date": "2025-06-16T07:00:00.000Z",
      "thumbnail": "https://www.balfourbeatty.com/media/oupbpcen/sft_8.jpg",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iK0NnNXlXa3BtUVc1UlZXNUlPR0l0VFJDbUJSakVBeWdLTWdZcFE1WnVJUWc=-w200-h112-p-df-rw",
      "position": 48
    },
    {
      "link": "https://www.balfourbeatty.com/media-centre/latest/we-are-balfour-beatty-living-places/",
      "title": "We are Balfour Beatty Living Places",
      "source": {
        "name": "Balfour Beatty",
        "icon": "https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.balfourbeatty.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
      },
      "date": "2025-10-22T07:00:00.000Z",
      "position": 49
    },
    {
      "link": "https://taskandpurpose.com/news/military-housing-troops-costs/",
      "title": "Military families forced to pay out of pocket for problems with privatized base housing",
      "source": {
        "name": "Task & Purpose",
        "icon": "https://encrypted-tbn0.gstatic.com/faviconV2?url=https://taskandpurpose.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL",
        "authors": [
          "Jeff Schogol"
        ]
      },
      "date": "2025-11-20T08:00:00.000Z",
      "thumbnail": "https://taskandpurpose.com/wp-content/uploads/2025/11/Balfour-Beatty-Families-pay-out-of-pocket.jpg?quality\\\\u003d85\\\\u0026w\\\\u003d2048",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iK0NnNWpTa2gyTlZGZlVYRTBjelpNVFJDZkF4ampCU2dLTWdZQlFJd0RHd28=-w200-h112-p-df-rw",
      "position": 50
    },
    {
      "link": "https://finance.yahoo.com/news/why-analysts-see-balfour-beatty-141048164.html",
      "title": "Why Analysts See Balfour Beatty Differently After Rising Valuation And Lower Risk Assumptions",
      "source": {
        "name": "Yahoo Finance",
        "icon": "https://encrypted-tbn1.gstatic.com/faviconV2?url=https://finance.yahoo.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
      },
      "date": "2025-12-09T08:00:00.000Z",
      "thumbnail": "https://s.yimg.com/ny/api/res/1.2/XRvJu1m2HTftSbMz2HtNBA--/YXBwaWQ9aGlnaGxhbmRlcjt3PTI0MDA7aD0xNjYw/https://media.zenfs.com/en/simply_wall_st__316/c6c462914a42103d4ac688acc76cb016",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iJ0NnNDVPRVJ0TnpCS1ZsaHBhMDFWVFJETUF4aWFCU2dLTWdNSkJ4SQ=-w200-h112-p-df-rw",
      "position": 51
    },
    {
      "link": "https://ukstories.microsoft.com/features/how-balfour-beatty-is-using-copilot-to-drive-productivity-at-scale/",
      "title": "Breaking new ground: How Balfour Beatty is using Copilot to drive productivity at scale",
      "source": {
        "name": "Microsoft UK Stories",
        "icon": "https://encrypted-tbn0.gstatic.com/faviconV2?url=https://ukstories.microsoft.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
      },
      "date": "2025-07-31T07:00:00.000Z",
      "thumbnail": "https://ukstories.microsoft.com/wp-content/uploads/2025/07/Balfour-Beatty-HS2-optimised-1024x683.jpg",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iK0NnNVJSelExTnpKSU0zaGZVR1ZvVFJERUF4aW1CU2dLTWdhTkFJck5PUVE=-w200-h112-p-df-rw",
      "position": 52
    },
    {
      "link": "https://www.constructiondive.com/news/balfour-beatty-new-ceo-philip-hoare/759945/",
      "title": "Balfour Beatty’s new CEO starts work",
      "source": {
        "name": "Construction Dive",
        "icon": "https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.constructiondive.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL",
        "authors": [
          "Matthew Thibault"
        ]
      },
      "date": "2025-09-11T07:00:00.000Z",
      "thumbnail": "https://imgproxy.divecdn.com/YjJqP-NrgTIRgeU9tLgs8HdQY2O-kjwRJW4pZfQFecE/g:ce/rs:fill:1200:675:1/Z3M6Ly9kaXZlc2l0ZS1zdG9yYWdlL2RpdmVpbWFnZS9HZXR0eUltYWdlcy0xODU3MzAxNjEwLmpwZw\\\\u003d\\\\u003d.webp",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iJ0NnNDVNSEZyWTFKRVlUTjVUMlIzVFJDZkF4ampCU2dLTWdNQmNBUQ=-w200-h112-p-df-rw",
      "position": 53
    },
    {
      "link": "https://finance.yahoo.com/news/recent-analyst-updates-mean-balfour-010844365.html",
      "title": "What Recent Analyst Updates Mean For Balfour Beatty’s Story and Valuation",
      "source": {
        "name": "Yahoo Finance",
        "icon": "https://encrypted-tbn1.gstatic.com/faviconV2?url=https://finance.yahoo.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
      },
      "date": "2025-11-24T08:00:00.000Z",
      "thumbnail": "https://s.yimg.com/ny/api/res/1.2/8RJU23WggXhOAq6vDL.mAg--/YXBwaWQ9aGlnaGxhbmRlcjt3PTI0MDA7aD04NDg-/https://media.zenfs.com/en/simply_wall_st__316/6274e524e96c80c36ef0806e55ebd73a",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iK0NnNURVbXhDVTJ0TVIwZG5SVkpzVFJESkFoaWtCeWdLTWdaVkVJNTVGQXM=-w200-h112-p-df-rw",
      "position": 54
    },
    {
      "link": "https://www.balfourbeatty.com/media-centre/latest/balfour-beatty-appoints-richard-watts-as-managing-director-of-its-uk-rail-business/",
      "title": "Balfour Beatty appoints Richard Watts as Managing Director of its UK Rail business",
      "source": {
        "name": "Balfour Beatty",
        "icon": "https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.balfourbeatty.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
      },
      "date": "2025-07-25T07:00:00.000Z",
      "thumbnail": "https://www.balfourbeatty.com/media/xxcdz1n0/image5.jpeg",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iK0NnNW5lRmhEZDJOaVFrdDZaWFJKVFJDQUJSamdBeWdLTWdZcFZKaVBwUWc=-w200-h112-p-df-rw",
      "position": 55
    },
    {
      "link": "https://www.rolls-royce.com/media/press-releases/2025/09-09-2025-rr-selects-balfour-beatty-as-construction-partner-for-major-derby-site-expansion-work.aspx",
      "title": "Rolls-Royce selects Balfour Beatty as construction partner for major Derby site expansion work",
      "source": {
        "name": "Rolls-Royce plc",
        "icon": "https://encrypted-tbn3.gstatic.com/faviconV2?url=https://www.rolls-royce.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
      },
      "date": "2025-09-09T07:00:00.000Z",
      "thumbnail": "https://www.rolls-royce.com/~/media/Images/R/Rolls-Royce/content-images/construction-partner-img-social.jpg",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iL0NnNU5hR290VFRFeU9YWmhhM1JRVFJDc0FoamdBeWdLTWdtUlFwZ0lwaWhVREFJ=-w200-h112-p-df-rw",
      "position": 56
    },
    {
      "link": "https://www.tipranks.com/news/company-announcements/balfour-beatty-advances-share-buyback-updates-voting-rights-total-2",
      "title": "Balfour Beatty Advances Share Buyback, Updates Voting Rights Total",
      "source": {
        "name": "TipRanks",
        "icon": "https://encrypted-tbn2.gstatic.com/faviconV2?url=https://www.tipranks.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
      },
      "date": "2026-01-19T07:26:45.000Z",
      "position": 57
    },
    {
      "link": "https://www.businesswire.com/news/home/20251212012783/en/Balfour-Beatty-Communities-Partners-with-U.S.-Army-to-Deliver-New-Military-Homes-at-Fort-Leonard-Wood",
      "title": "Balfour Beatty Communities Partners with U.S. Army to Deliver New Military Homes at Fort Leonard Wood",
      "source": {
        "name": "Business Wire",
        "icon": "https://encrypted-tbn3.gstatic.com/faviconV2?url=https://www.businesswire.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
      },
      "date": "2025-12-12T08:00:00.000Z",
      "thumbnail": "https://mms.businesswire.com/media/20251212012783/en/2669138/5/54975473147_dfc916abe5_c.jpg?download\\\\u003d1",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iK0NnNUZSbFpIVkZkTldXUmFPVUp1VFJEVUF4aVBCU2dLTWdZQlFKeGlwQWs=-w200-h112-p-df-rw",
      "position": 58
    },
    {
      "link": "https://www.worldconstructionnetwork.com/news/balfour-beatty-2025-order-book/",
      "title": "Balfour Beatty expects 20% rise in 2025 order book",
      "source": {
        "name": "World Construction Network",
        "icon": "https://encrypted-tbn1.gstatic.com/faviconV2?url=https://www.worldconstructionnetwork.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
      },
      "date": "2025-12-05T08:00:00.000Z",
      "thumbnail": "https://www.worldconstructionnetwork.com/wp-content/uploads/sites/26/2025/12/Balfour-Beatty-430x241.jpg",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iK0NnNURXbkptWmpkV05YSXhhazU0VFJEeEFSaXVBeWdLTWdZTjlZakhUUVE=-w200-h112-p-df-rw",
      "position": 59
    },
    {
      "link": "https://keysweekly.com/42/balfour-beatty-construction-accused-of-concealing-horrific-conditions-from-military-residents/",
      "title": "BALFOUR BEATTY ACCUSED OF ‘CONCEALING HORRIFIC CONDITIONS’ FROM MILITARY RESIDENTS",
      "source": {
        "name": "Keys Weekly Newspapers",
        "icon": "https://encrypted-tbn0.gstatic.com/faviconV2?url=https://keysweekly.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL",
        "authors": [
          "Wyatt Samuelson"
        ]
      },
      "date": "2025-09-18T07:00:00.000Z",
      "thumbnail": "https://keysweekly.com/wp-content/uploads/2025/09/Sigbee-Mold-Furniture-300x225.jpg",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iK0NnNHhWR0ZTYzJZNVFXMUJaMmw2VFJEaEFSaXNBaWdLTWdZTlVwQktKUVk=-w200-h112-p-df-rw",
      "position": 60
    },
    {
      "link": "https://www.balfourbeatty.com/media-centre/latest/balfour-beatty-appointed-to-national-grid-s-8-billion-electricity-transmission-partnership/",
      "title": "Balfour Beatty appointed to National Grid’s £8 billion Electricity Transmission Partnership",
      "source": {
        "name": "Balfour Beatty",
        "icon": "https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.balfourbeatty.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
      },
      "date": "2025-07-31T07:00:00.000Z",
      "thumbnail": "https://www.balfourbeatty.com/media/fd1c1jph/signing_2507016_0005.jpg",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iK0NnNW5ZVUZoZUZOVU9WZEdabTE2VFJERUF4aW1CU2dLTWdZQmtJeUR2QVU=-w200-h112-p-df-rw",
      "position": 61
    },
    {
      "link": "https://www.businesswire.com/news/home/20251218858317/en/Balfour-Beatty-Appoints-Justin-Maletic-as-Business-Unit-Leader-for-Central-Texas-and-Arizona-Buildings-Operations",
      "title": "Balfour Beatty Appoints Justin Maletic as Business Unit Leader for Central Texas and Arizona Buildings Operations",
      "source": {
        "name": "Business Wire",
        "icon": "https://encrypted-tbn3.gstatic.com/faviconV2?url=https://www.businesswire.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
      },
      "date": "2025-12-18T08:00:00.000Z",
      "thumbnail": "https://mms.businesswire.com/media/20251218858317/en/2674939/5/Justin-Maletic_webview.jpg?download\\\\u003d1",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iK0NnNDJRMlZpYVVocE5IcDRja1pFVFJDUUJSalVBeWdLTWdhcFZKaU9wUWc=-w200-h112-p-df-rw",
      "position": 62
    },
    {
      "link": "https://www.businessinsurance.com/balfour-beatty-hires-risk-manager/",
      "title": "Balfour Beatty hires risk manager",
      "source": {
        "name": "businessinsurance.com",
        "icon": "https://encrypted-tbn2.gstatic.com/faviconV2?url=https://www.businessinsurance.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL",
        "authors": [
          "Claire Wilkinson"
        ]
      },
      "date": "2025-08-18T07:00:00.000Z",
      "thumbnail": "https://www.businessinsurance.com/wp-content/uploads/2025/08/William-Motherway-for-web-300x180.jpg",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iK0NnNWhOV0UyWW5Ka1RXSmZSVWxTVFJDMEFSaXNBaWdLTWdhcFZZTE5KUWM=-w200-h112-p-df-rw",
      "position": 63
    },
    {
      "link": "https://www.balfourbeatty.com/media-centre/latest/balfour-beatty-vinci-makes-progress-on-key-hs2-viaducts/",
      "title": "Balfour Beatty VINCI makes progress on key HS2 viaducts",
      "source": {
        "name": "Balfour Beatty",
        "icon": "https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.balfourbeatty.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
      },
      "date": "2025-12-30T08:00:00.000Z",
      "thumbnail": "https://www.balfourbeatty.com/media/tqlhzp5w/hs2-xmas.jpg",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iL0NnNWtiMmRrY0hGb1pEaEVRWGxSVFJEQ0FSaURBaWdCTWdrQk1JS0dwS05pMlFB=-w200-h112-p-df-rw",
      "position": 64
    },
    {
      "link": "https://www.bizjournals.com/seattle/news/2025/09/29/microsoft-sak-builders-skanska-balfour-beatty.html",
      "title": "Subcontractor settles dispute over work on Microsoft's campus expansion",
      "source": {
        "name": "The Business Journals",
        "icon": "https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.bizjournals.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL",
        "authors": [
          "Nick Pasion"
        ]
      },
      "date": "2025-09-29T07:00:00.000Z",
      "thumbnail": "https://media.bizj.us/view/img/13011075/microsoft-50th-celebration-copilot-ai-reveal-event-16-campus-construction*900xx5095-2863-0-0.jpg",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iK0NnNVRiR3d6VW5JeFpsTjZURXRqVFJDZkF4ampCU2dLTWdZQmdJcFNNQVk=-w200-h112-p-df-rw",
      "position": 65
    },
    {
      "link": "https://www.multihousingnews.com/balfour-beatty-communities-adds-300-units-to-texas-portfolio/",
      "title": "Balfour Beatty Communities Adds to Texas Portfolio",
      "source": {
        "name": "Multi-Housing News",
        "icon": "https://encrypted-tbn1.gstatic.com/faviconV2?url=https://www.multihousingnews.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL",
        "authors": [
          "Gail Kalinoski"
        ]
      },
      "date": "2025-05-22T07:00:00.000Z",
      "thumbnail": "https://www.multihousingnews.com/wp-content/uploads/sites/57/2025/05/Screenshot-403-1.png",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iJ0NnNWZhakpCUVZsa09HNHlXbTVLVFJEbkF4ajFCQ2dLTWdNRm9CWQ=-w200-h112-p-df-rw",
      "position": 66
    },
    {
      "link": "https://www.constructiondive.com/news/balfour-beatty-dc-apartment-portals-1301/752527/",
      "title": "Balfour Beatty breaks ground on $260M DC apartment building",
      "source": {
        "name": "Construction Dive",
        "icon": "https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.constructiondive.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL",
        "authors": [
          "Matthew Thibault"
        ]
      },
      "date": "2025-07-09T07:00:00.000Z",
      "thumbnail": "https://imgproxy.divecdn.com/FyWgxf2lsZ12Xhxvx94NRlpESdILqO6nnry3z-CABLI/g:ce/rs:fill:1200:675:1/Z3M6Ly9kaXZlc2l0ZS1zdG9yYWdlL2RpdmVpbWFnZS9DMi5qcGc\\\\u003d.webp",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iJ0NnNUpVMDQxTlROWVdYSkVUMEZNVFJDZkF4ampCU2dLTWdNQllBUQ=-w200-h112-p-df-rw",
      "position": 67
    },
    {
      "link": "https://www.constructiondive.com/news/balfour-beatty-texas-interstate-30/746465/",
      "title": "Balfour Beatty nabs $889M Texas highway job",
      "source": {
        "name": "Construction Dive",
        "icon": "https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.constructiondive.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL",
        "authors": [
          "Matthew Thibault"
        ]
      },
      "date": "2025-04-28T07:00:00.000Z",
      "thumbnail": "https://imgproxy.divecdn.com/tzHJCClMMig5spmF_IRCgmksUEnlPlgDTOKr9CvhFcA/g:ce/rs:fill:1200:675:1/Z3M6Ly9kaXZlc2l0ZS1zdG9yYWdlL2RpdmVpbWFnZS9HZXR0eUltYWdlcy01Mzk2Nzg2MjQuanBn.webp",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iNkNnNXJiemx0V0dnM1FXWTJhVlYxVFJDZkF4ampCU2dLTWc0QkFJSUZtS2hxUVd2a0phcjJIZw=-w200-h112-p-df-rw",
      "position": 68
    },
    {
      "link": "https://finance.yahoo.com/news/balfour-beatty-first-half-revenue-093947693.html",
      "title": "Balfour Beatty first-half revenue grows via UK Construction boom",
      "source": {
        "name": "Yahoo Finance",
        "icon": "https://encrypted-tbn1.gstatic.com/faviconV2?url=https://finance.yahoo.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
      },
      "date": "2025-08-14T07:00:00.000Z",
      "thumbnail": "https://s.yimg.com/ny/api/res/1.2/S7QnTnsuPc1Qo68f8_eJZw--/YXBwaWQ9aGlnaGxhbmRlcjt3PTEyMDA7aD02NzU-/https://media.zenfs.com/en/world_construction_network_914/d5a448fef5161942c2cb93f64bad6eed",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iK0NnNVFWRkJ6YTBoRlgzWXlTV1ZmVFJDZkF4ampCU2dLTWdZTjVZekh4UVE=-w200-h112-p-df-rw",
      "position": 69
    },
    {
      "link": "https://www.moaa.org/content/publications-and-media/news-articles/2025-news-articles/spouse-and-family/key-west-families-sue-balfour-beatty,-allege-squalid,-toxic-housing-conditions/",
      "title": "Key West Families Sue Balfour Beatty, Allege Squalid, Toxic Housing Conditions",
      "source": {
        "name": "MOAA",
        "icon": "https://encrypted-tbn1.gstatic.com/faviconV2?url=https://www.moaa.org&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
      },
      "date": "2025-03-31T07:00:00.000Z",
      "thumbnail": "https://www.moaa.org/contentassets/32112c732eac481cbbd33bf1ffe84f0b/key-west-gate-h.jpg",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iK0NnNVVRbFF6U1ZoalVUQlRPR05EVFJDMkFSaVZBaWdCTWdZRm9KS211QVk=-w200-h112-p-df-rw",
      "position": 70
    },
    {
      "link": "https://www.balfourbeatty.com/media-centre/latest/balfour-beatty-signs-programme-alliance-agreement-to-deliver-sizewell-c-civil-works/",
      "title": "Balfour Beatty signs Programme Alliance Agreement to deliver Sizewell C civil works",
      "source": {
        "name": "Balfour Beatty",
        "icon": "https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.balfourbeatty.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
      },
      "date": "2025-06-30T07:00:00.000Z",
      "thumbnail": "https://www.balfourbeatty.com/media/vmmptmlv/detail-aerial-02_001-200130.jpg",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iK0NnNDBTMk40V0RWUmRHczJkbGhtVFJEREF4aW5CU2dLTWdZSlFJcFBzUVk=-w200-h112-p-df-rw",
      "position": 71
    },
    {
      "link": "https://www.balfourbeatty.com/media-centre/latest/balfour-beatty-2025-agm-trading-update/",
      "title": "Balfour Beatty 2025 AGM Trading Update",
      "source": {
        "name": "Balfour Beatty",
        "icon": "https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.balfourbeatty.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
      },
      "date": "2025-05-08T07:00:00.000Z",
      "thumbnail": "https://www.balfourbeatty.com/media/ftapiozr/1200x630-trading-update_1.jpg",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iK0NnNVBZVE4zWWw5SVgzZExhalZzVFJDUkF4ajhCU2dLTWdhZGc1QnR0UVk=-w200-h112-p-df-rw",
      "position": 72
    },
    {
      "link": "https://www.enr.com/articles/60649-balfour-beatty-picked-for-889m-i-30-rebuild-in-dallas",
      "title": "Balfour Beatty Picked for $889M I-30 Rebuild in Dallas",
      "source": {
        "name": "Engineering News-Record",
        "icon": "https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.enr.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL",
        "authors": [
          "Derek Lacey"
        ]
      },
      "date": "2025-04-24T07:00:00.000Z",
      "thumbnail": "https://www.enr.com/ext/resources/2025/04/24/IH30-Dal_020.webp?t\\\\u003d1745646460",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iNkNnNU1MV2w1UkRKclMwcG9XRlF0VFJDZkF4ampCU2dLTWc0QklJYkVNaVVtdDdpa2tycDJLZw=-w200-h112-p-df-rw",
      "position": 73
    },
    {
      "link": "https://www.businesswire.com/news/home/20250818746791/en/Balfour-Beatty-Appoints-William-Motherway-as-Vice-President-of-Risk-for-U.S.-Infrastructure-Operations",
      "title": "Balfour Beatty Appoints William Motherway as Vice President of Risk for U.S. Infrastructure Operations",
      "source": {
        "name": "Business Wire",
        "icon": "https://encrypted-tbn3.gstatic.com/faviconV2?url=https://www.businesswire.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
      },
      "date": "2025-08-18T07:00:00.000Z",
      "thumbnail": "https://mms.businesswire.com/media/20250818746791/en/2555965/5/William_Motherway_Headshot_II.jpg?download\\\\u003d1",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iK0NnNUhXRGN4ZDBFMlZsSXdRMnRoVFJEUUF4aVZCU2dLTWdhcEZhRHRsUW8=-w200-h112-p-df-rw",
      "position": 74
    },
    {
      "link": "https://carbonherald.com/balfour-beatty-wins-1-14b-deal-to-build-carbon-capture-power-plant/",
      "title": "Balfour Beatty Wins $1.14B Deal To Build Carbon Capture Power Plant",
      "source": {
        "name": "Carbon Herald",
        "icon": "https://encrypted-tbn2.gstatic.com/faviconV2?url=https://carbonherald.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL",
        "authors": [
          "Violet George"
        ]
      },
      "date": "2025-07-01T07:00:00.000Z",
      "thumbnail": "https://carbonherald.com/wp-content/uploads/2025/07/Balfour-Beatty-800x500.png",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iK0NnNUpPVUZNUzA5MmRXWkdjUzFVVFJDMkF4aTlCU2dLTWdZUm81UktPUWM=-w200-h112-p-df-rw",
      "position": 75
    },
    {
      "link": "https://www.balfourbeatty.com/media-centre/latest/balfour-beatty-features-on-bbc-news-discussing-the-sustainability-credentials-of-hvo-fuel/",
      "title": "Balfour Beatty features on BBC News discussing the sustainability credentials of HVO fuel",
      "source": {
        "name": "Balfour Beatty",
        "icon": "https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.balfourbeatty.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
      },
      "date": "2025-04-09T07:00:00.000Z",
      "thumbnail": "https://www.balfourbeatty.com/media/byfjtltk/jo-gilroy.png",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iK0NnNXRMVmczVVdabVNIUlNNR3BtVFJEMkF4ampCQ2dLTWdZdGRaS3VMUWM=-w200-h112-p-df-rw",
      "position": 76
    },
    {
      "link": "https://finance.yahoo.com/news/balfour-beatty-appointed-exclusive-contractor-092236436.html",
      "title": "Balfour Beatty appointed as exclusive contractor for Rolls-Royce nuclear project",
      "source": {
        "name": "Yahoo Finance",
        "icon": "https://encrypted-tbn1.gstatic.com/faviconV2?url=https://finance.yahoo.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
      },
      "date": "2025-09-10T07:00:00.000Z",
      "thumbnail": "https://s.yimg.com/ny/api/res/1.2/S_EFw3Rv2KFL6of0xcYq9g--/YXBwaWQ9aGlnaGxhbmRlcjt3PTI0MDA7aD0xMzUw/https://media.zenfs.com/en/world_construction_network_914/1d759a44c1aad60befc781156ce00ad5",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iI0NnNHdZVkpIU0VJMFpXWndVREpPVFJDZkF4ampCU2dLTWdB=-w200-h112-p-df-rw",
      "position": 77
    },
    {
      "link": "https://www.businesswire.com/news/home/20250710356802/en/Senior-Leadership-Change-at-Balfour-Beatty-Communities",
      "title": "Senior Leadership Change at Balfour Beatty Communities",
      "source": {
        "name": "Business Wire",
        "icon": "https://encrypted-tbn3.gstatic.com/faviconV2?url=https://www.businesswire.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
      },
      "date": "2025-07-10T07:00:00.000Z",
      "thumbnail": "https://mms.businesswire.com/media/20250710356802/en/503526/22/BBCommunites_RGB_5.5mm-01.jpg",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iK0NnNXZRVmgyUmtKc1VXc3hja1ZIVFJDSEF4aVBCaWdLTWdZZGxKU0tOUWM=-w200-h112-p-df-rw",
      "position": 78
    },
    {
      "link": "https://www.reuters.com/business/uks-balfour-beatty-gets-889-million-texas-highway-contract-2025-04-24/",
      "title": "UK's Balfour Beatty secures $889 million Texas highway contract",
      "source": {
        "name": "Reuters",
        "icon": "https://encrypted-tbn2.gstatic.com/faviconV2?url=https://www.reuters.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
      },
      "date": "2025-04-24T07:00:00.000Z",
      "thumbnail": "https://www.reuters.com/resizer/v2/XRTSVK4KMZJZXOAOZXINX5EZ24.jpg?auth\\\\u003d68c1b887256f00f1cfac0ed69c52cde50bafadc76b32e37a7c4386a4f966c024\\\\u0026height\\\\u003d1500\\\\u0026width\\\\u003d1200\\\\u0026quality\\\\u003d80\\\\u0026smart\\\\u003dtrue",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iK0NnNXNjRXBaVEVGU1ZqTlVaMWN3VFJEckJCanZBeWdLTWdhQlVZREk5UUE=-w200-h112-p-df-rw",
      "position": 79
    },
    {
      "link": "https://www.balfourbeatty.com/media-centre/latest/balfour-beatty-s-strategic-design-partnership-young-people-in-construction-hackathon-features-in-design-build-uk/",
      "title": "Balfour Beatty’s Strategic Design Partnership 'Young People in Construction Hackathon' features in Design & Build UK",
      "source": {
        "name": "Balfour Beatty",
        "icon": "https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.balfourbeatty.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
      },
      "date": "2025-04-15T07:00:00.000Z",
      "thumbnail": "https://www.balfourbeatty.com/media/vfpbt3j4/shared-image-2.jpg",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iI0NnNUNZMU52TW1ZNFFreGlPUzF2VFJEeUFoaWdCaWdLTWdB=-w200-h112-p-df-rw",
      "position": 80
    },
    {
      "link": "https://www.constructionequipmentguide.com/balfour-beatty-works-on-242m-us-70-project/69799",
      "title": "Balfour Beatty Works On $242M U.S. 70 Project",
      "source": {
        "name": "Construction Equipment Guide",
        "icon": "https://encrypted-tbn2.gstatic.com/faviconV2?url=https://www.constructionequipmentguide.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL",
        "authors": [
          "Cindy Riley"
        ]
      },
      "date": "2025-12-03T08:00:00.000Z",
      "thumbnail": "https://dmt55mxnkgbz2.cloudfront.net/1205x0_s3-69799-S-146_25-CR-1.jpg",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iK0NnNUpjRXBtUlZaUVRrOXJkMVpCVFJDUkF4ajhCU2dLTWdhaEJJZ05qZ1E=-w200-h112-p-df-rw",
      "position": 81
    },
    {
      "link": "https://markets.ft.com/data/announce/detail?dockey\\\\u003d600-202512121020BIZWIRE_USPRX____20251212_BW012783-1",
      "title": "Balfour Beatty Communities Partners with U.S. Army to Deliver New Military Homes at Fort Leonard Wood",
      "source": {
        "name": "Financial Times",
        "icon": "https://encrypted-tbn2.gstatic.com/faviconV2?url=https://markets.ft.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
      },
      "date": "2025-12-12T08:00:00.000Z",
      "thumbnail": "https://mms.businesswire.com/media/20251212012783/en/2669138/4/54975473147_dfc916abe5_c.jpg",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iK0NnNXBkakk0VFhsWVpXUTJiR3gxVFJEWEFoamdBeWdLTWdZQlFKeGlKQWs=-w200-h112-p-df-rw",
      "position": 82
    },
    {
      "link": "https://renews.biz/106226/balfour-beatty-sells-ofto-stakes-to-equitix/",
      "title": "Balfour Beatty sells OFTO stakes to Equitix",
      "source": {
        "name": "reNews",
        "icon": "https://encrypted-tbn1.gstatic.com/faviconV2?url=https://renews.biz&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
      },
      "date": "2026-01-06T08:00:00.000Z",
      "thumbnail": "https://renews.biz/media/15763/gwynt-y-mor-offshore-wind-farm-credit-rwe1.jpg?mode\\\\u003dcrop\\\\u0026width\\\\u003d770\\\\u0026heightratio\\\\u003d0.6103896103896103896103896104\\\\u0026slimmage\\\\u003dtrue",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iJ0NnNUhkVWh3YVZodE5IaDNiRTB5VFJDeEF4akZCU2dLTWdPQk9SSQ=-w200-h112-p-df-rw",
      "position": 83
    },
    {
      "link": "https://technologymagazine.com/news/how-balfour-beatty-boosted-productivity-with-microsoft-ai",
      "title": "How Balfour Beatty Boosted Productivity With Microsoft AI",
      "source": {
        "name": "Technology Magazine",
        "icon": "https://encrypted-tbn1.gstatic.com/faviconV2?url=https://technologymagazine.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL",
        "authors": [
          "Marcus Law"
        ]
      },
      "date": "2025-07-31T07:00:00.000Z",
      "thumbnail": "https://assets.bizclikmedia.net/144/e1a090f3b70661250c3683444cf95d83:f2a82efe7b8f5406fc364a948877634b/balfour-beatty.png",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iL0NnNU1MVUY0WW1GSWJVWlBWM0ZxVFJETEFSaVFBU2dCTWdrQllJcU9LS2k0MGdB=-w200-h112-p-df-rw",
      "position": 84
    },
    {
      "link": "https://www.reuters.com/business/energy/uks-balfour-beatty-wins-114-billion-contract-new-gas-power-plant-2025-06-26/",
      "title": "UK's Balfour Beatty wins $1.14 billion contract for new gas power plant",
      "source": {
        "name": "Reuters",
        "icon": "https://encrypted-tbn2.gstatic.com/faviconV2?url=https://www.reuters.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL",
        "authors": [
          "Yamini Kalia",
          "Mrigank Dhaniwala"
        ]
      },
      "date": "2025-06-26T07:00:00.000Z",
      "thumbnail": "https://www.reuters.com/resizer/v2/XRTSVK4KMZJZXOAOZXINX5EZ24.jpg?auth\\\\u003d68c1b887256f00f1cfac0ed69c52cde50bafadc76b32e37a7c4386a4f966c024\\\\u0026width\\\\u003d480\\\\u0026quality\\\\u003d80",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iK0NnNW1kRkl0WlcwNVJtSlZNRVJ3VFJEaUFoamdBeWdLTWdZUjRvQUg4Z0E=-w200-h112-p-df-rw",
      "position": 85
    },
    {
      "link": "https://www.enr.com/articles/60475-balfour-beatty-picks-atkinsrealis-exec-to-succeed-leo-quinn-as-ceo",
      "title": "Balfour Beatty Picks AtkinsRéalis Exec To Succeed Leo Quinn as CEO",
      "source": {
        "name": "Engineering News-Record",
        "icon": "https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.enr.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL",
        "authors": [
          "Emell Derra Adolphus"
        ]
      },
      "date": "2025-03-21T07:00:00.000Z",
      "thumbnail": "https://www.enr.com/ext/resources/2025/03/20/Philip-Hoare-BalfourBeatty.webp?t\\\\u003d1742859830",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iK0NnNUJlV2RITFZSZldIZGhURFp3VFJDeEF4akZCU2dLTWdhcFZaTE5KUWc=-w200-h112-p-df-rw",
      "position": 86
    },
    {
      "link": "https://www.railwayage.com/news/people-news-metrolink-balfour-beatty/",
      "title": "People News: Metrolink, Balfour Beatty",
      "source": {
        "name": "Railway Age",
        "icon": "https://encrypted-tbn2.gstatic.com/faviconV2?url=https://www.railwayage.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL",
        "authors": [
          "Carolina Worrell"
        ]
      },
      "date": "2025-08-19T07:00:00.000Z",
      "thumbnail": "https://www.railwayage.com/wp-content/uploads/2025/08/download-3.jpeg",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iL0NnNWtTMlJ2UldOUlNrTllkbEY0VFJDbEF4allCU2dLTWdtSk1wd1VtV3E1U0FJ=-w200-h112-p-df-rw",
      "position": 87
    },
    {
      "link": "https://www.costar.com/article/372661448/balfour-beatty-offloads-536-bed-glasgow-student-accommodation-block",
      "title": "News | Balfour Beatty offloads 536-bed Glasgow student accommodation block",
      "source": {
        "name": "CoStar",
        "icon": "https://encrypted-tbn3.gstatic.com/faviconV2?url=https://www.costar.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL",
        "authors": [
          "Luke Haynes"
        ]
      },
      "date": "2025-12-23T08:00:00.000Z",
      "thumbnail": "https://www.costar.com/_next/image?url\\\\u003dhttps://costar.brightspotcdn.com/dims4/default/21a2313/2147483647/strip/true/crop/2048x1366+0+0/resize/2048x1366!/quality/100/?url=http%3A%2F%2Fcostar-brightspot.s3.us-east-1.amazonaws.com%2F5d%2F5d%2Fb7a523b74b289506c2fd9dbd098c%2Ffoundry-courtyard-glasgow.%20%28CoStar%29.jpg\\\\u0026w\\\\u003d3840\\\\u0026q\\\\u003d75",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iK0NnNXdkRGRTZVZoM1ZuSlBObTAzVFJERUF4aW1CU2dLTWdZQmdJSmxPUWM=-w200-h112-p-df-rw",
      "position": 88
    },
    {
      "link": "https://www.balfourbeatty.com/media-centre/latest/balfour-beattys-strategic-design-partnership-features-in-design-build-uk/",
      "title": "Balfour Beatty's Strategic Design Partnership features in Design & Build UK",
      "source": {
        "name": "Balfour Beatty",
        "icon": "https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.balfourbeatty.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
      },
      "date": "2025-03-13T07:00:00.000Z",
      "thumbnail": "https://www.balfourbeatty.com/media/bkmcpzhb/sdp.png",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iL0NnNVhNR3MzTkd3MGJFZFdRVzB6VFJDb0F4anJCQ2dLTWdrWlFJUm9vbWdldGdB=-w200-h112-p-df-rw",
      "position": 89
    },
    {
      "link": "https://www.yahoo.com/news/articles/balfour-beatty-awarded-215m-edinburgh-095453427.html",
      "title": "Balfour Beatty awarded $215m for Edinburgh’s new concert hall",
      "source": {
        "name": "Yahoo",
        "icon": "https://encrypted-tbn1.gstatic.com/faviconV2?url=https://www.yahoo.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
      },
      "date": "2025-10-27T07:00:00.000Z",
      "thumbnail": "https://s.yimg.com/ny/api/res/1.2/ziR8kJnwL5nrDv_vJSeqyw--/YXBwaWQ9aGlnaGxhbmRlcjt3PTEyNDI7aD02OTk7Y2Y9d2VicA--/https://media.zenfs.com/en/world_construction_network_914/f2e5cf712b6f9b10925a4b837efa823b",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iI0NnNXJUMFJYVkRGUGVqVXhjbnBTVFJDZkF4amlCU2dLTWdB=-w200-h112-p-df-rw",
      "position": 90
    },
    {
      "link": "https://www.marketbeat.com/instant-alerts/balfour-beatty-lonbby-share-price-passes-above-200-day-moving-average-should-you-sell-2025-12-31/",
      "title": "Balfour Beatty (LON:BBY) Share Price Passes Above 200 Day Moving Average - Should You Sell?",
      "source": {
        "name": "MarketBeat",
        "icon": "https://encrypted-tbn3.gstatic.com/faviconV2?url=https://www.marketbeat.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
      },
      "date": "2025-12-31T08:00:00.000Z",
      "position": 91
    },
    {
      "link": "https://www.constructiondive.com/news/balfour-beatty-miami-hotel-grand-hyatt/746871/",
      "title": "Balfour Beatty kicks off $385M Miami hotel project",
      "source": {
        "name": "Construction Dive",
        "icon": "https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.constructiondive.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL",
        "authors": [
          "Matthew Thibault"
        ]
      },
      "date": "2025-05-12T07:00:00.000Z",
      "thumbnail": "https://imgproxy.divecdn.com/iQtaPRAiyJpnIdhd2BZWFLGw62jmmY2eWHcR2pMM4o4/g:ce/rs:fill:1200:675:1/Z3M6Ly9kaXZlc2l0ZS1zdG9yYWdlL2RpdmVpbWFnZS9HcmFuZF9IeWF0dF9NaWFtaV9CZWFjaDEuanBn.webp",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iK0NnNUhZV1ZmVVZORGJEZElVbkpPVFJDZkF4ampCU2dLTWdZQk1JQXNVUVE=-w200-h112-p-df-rw",
      "position": 92
    },
    {
      "link": "https://impact.economist.com/sustainability/net-zero-and-energy/in-conversation-with-joanna-gilroy",
      "title": "In conversation with Joanna Gilroy",
      "source": {
        "name": "Impact Economist",
        "icon": "https://encrypted-tbn3.gstatic.com/faviconV2?url=https://impact.economist.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
      },
      "date": "2025-06-24T07:00:00.000Z",
      "thumbnail": "https://impact.economist.com/sustainability/images/in-conversation-with-joanna-gilroy?f\\\\u003dauto\\\\u0026w\\\\u003d1200\\\\u0026h\\\\u003d630",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iI0NnNHhkRk0wZEZKSU9IUmFha3hDVFJDb0FSaXJBaWdCTWdB=-w200-h112-p-df-rw",
      "position": 93
    },
    {
      "link": "https://www.rtands.com/track-construction/balfour-beatty-prequalified-for-metrolinks-score-program/",
      "title": "Balfour Beatty Prequalified for Metrolink’s SCORE Program",
      "source": {
        "name": "Railway Track and Structures",
        "icon": "https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.rtands.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL",
        "authors": [
          "Jennifer McLawhorn"
        ]
      },
      "date": "2025-07-28T07:00:00.000Z",
      "thumbnail": "https://www.rtands.com/wp-content/uploads/2025/07/San-Bernardino-755x402.jpeg",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iI0NnNUpTbFpITTA1QmFWUlBkamRuVFJDU0F4anpCU2dLTWdB=-w200-h112-p-df-rw",
      "position": 94
    },
    {
      "link": "https://www.balfourbeatty.com/media-centre/latest/balfour-beatty-appointed-as-principal-contractor-for-new-deer-substation-extension/",
      "title": "Balfour Beatty appointed as principal contractor for New Deer Substation extension",
      "source": {
        "name": "Balfour Beatty",
        "icon": "https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.balfourbeatty.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
      },
      "date": "2025-09-25T07:00:00.000Z",
      "thumbnail": "https://www.balfourbeatty.com/media/wdyhot1f/newdeerextensionsite.jpg",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iL0NnNVpXbGhDVkhGQlozSnpNblpPVFJDZkF4ampCU2dLTWdrVk1JcFdSS1NDS1FJ=-w200-h112-p-df-rw",
      "position": 95
    },
    {
      "link": "https://www.forconstructionpros.com/business/construction-safety/detectable-warnings/article/22939951/balfour-beatty-balfour-beatty-designates-live-traffic-as-fifth-fatal-risk-in-construction-safety-initiative",
      "title": "Balfour Beatty Designates Live Traffic as Fifth Fatal Risk in Construction Safety Initiative",
      "source": {
        "name": "For Construction Pros",
        "icon": "https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.forconstructionpros.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
      },
      "date": "2025-05-06T07:00:00.000Z",
      "thumbnail": "https://img.forconstructionpros.com/mindful/acbm/workspaces/default/uploads/2025/04/dina-row-of-bright-orange-traffic-cones.H8UB2bzIVA.jpg?auto\\\\u003dformat,compress\\\\u0026q\\\\u003d70\\\\u0026w\\\\u003d400",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iI0NnNXhNM1poY25kS1FrMW9Ra0ZvVFJDTEFoaVFBeWdLTWdB=-w200-h112-p-df-rw",
      "position": 96
    },
    {
      "link": "https://www.balfourbeatty.com/media-centre/latest/balfour-beatty-2024-full-year-results/",
      "title": "Balfour Beatty 2024 Full Year Results",
      "source": {
        "name": "Balfour Beatty",
        "icon": "https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.balfourbeatty.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
      },
      "date": "2025-03-12T07:00:00.000Z",
      "thumbnail": "https://www.balfourbeatty.com/media/ax0dmps2/press-release.webp",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iK0NnNUJlRTF0Y25waGJXRTVlRFY0VFJESUFSamVBaWdLTWdhZFE0eHRKUVk=-w200-h112-p-df-rw",
      "position": 97
    },
    {
      "link": "https://www.balfourbeatty.com/media-centre/latest/balfour-beatty-features-in-construction-news-discussing-how-internal-mobility-can-power-the-uks-energy-transition/",
      "title": "Balfour Beatty features in Construction News discussing internal mobility in the energy sector",
      "source": {
        "name": "Balfour Beatty",
        "icon": "https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.balfourbeatty.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
      },
      "date": "2025-05-09T07:00:00.000Z",
      "thumbnail": "https://www.balfourbeatty.com/media/xt2kjt1g/stephen-tomkins.jpg",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iK0NnNWZOV0ZyYUdoSk9YZzBVMUJ4VFJERUF4aW1CU2dLTWdZbE5wanRvUWc=-w200-h112-p-df-rw",
      "position": 98
    },
    {
      "link": "https://www.gasworld.com/story/balfour-beatty-wins-833m-teesside-ccs-construction-contract/2160892.article/",
      "title": "Balfour Beatty wins £833m Teesside CCS construction contract",
      "source": {
        "name": "gasworld",
        "icon": "https://encrypted-tbn1.gstatic.com/faviconV2?url=https://www.gasworld.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL",
        "authors": [
          "Dominic Ellis"
        ]
      },
      "date": "2025-06-27T07:00:00.000Z",
      "thumbnail": "https://www.gasworld.com/wp-content/files/2025/06/Balfour-lead.png",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iK0NnNU1WMk5RUWprMU0yMXhhRzUyVFJDQUF4aWZCaWdLTWdZSmNJZ3JzUVE=-w200-h112-p-df-rw",
      "position": 99
    },
    {
      "link": "https://www.constructiondive.com/news/balfour-beatty-safety-work-zone-highway/747538/",
      "title": "The Fatal 5? Balfour Beatty highlights risk of live traffic.",
      "source": {
        "name": "Construction Dive",
        "icon": "https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.constructiondive.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL",
        "authors": [
          "Zachary Phillips"
        ]
      },
      "date": "2025-05-08T07:00:00.000Z",
      "thumbnail": "https://imgproxy.divecdn.com/SBxrB3vSpaIHvo6kHHVABDVn_XzrYLddq2KuPRn_dZk/g:ce/rs:fill:1200:675:1/Z3M6Ly9kaXZlc2l0ZS1zdG9yYWdlL2RpdmVpbWFnZS9HZXR0eUltYWdlcy0xMTU4NDc1MDc2LmpwZw\\\\u003d\\\\u003d.webp",
      "thumbnailSmall": "https://news.google.com/api/attachments/CC8iL0NnNWpkVXB4YlV4MVFTMXNVbGx5VFJDZkF4ampCU2dLTWdrQlFJcVZKS2lTRVFF=-w200-h112-p-df-rw",
      "position": 100
    }
  ],
  "menuLinks": [
    {
      "title": "U.S.",
      "topicToken": "CAAqIggKIhxDQkFTRHdvSkwyMHZNRGxqTjNjd0VnSmxiaWdBUAE",
      "hasdataLink": "https://api.hasdata.com/scrape/google/news?gl=us&hl=en-us&topicToken=CAAqIggKIhxDQkFTRHdvSkwyMHZNRGxqTjNjd0VnSmxiaWdBUAE"
    },
    {
      "title": "World",
      "topicToken": "CAAqJggKIiBDQkFTRWdvSUwyMHZNRGx1YlY4U0FtVnVHZ0pWVXlnQVAB",
      "hasdataLink": "https://api.hasdata.com/scrape/google/news?gl=us&hl=en-us&topicToken=CAAqJggKIiBDQkFTRWdvSUwyMHZNRGx1YlY4U0FtVnVHZ0pWVXlnQVAB"
    },
    {
      "title": "Local",
      "topicToken": "CAAqHAgKIhZDQklTQ2pvSWJHOWpZV3hmZGpJb0FBUAE",
      "hasdataLink": "https://api.hasdata.com/scrape/google/news?gl=us&hl=en-us&topicToken=CAAqHAgKIhZDQklTQ2pvSWJHOWpZV3hmZGpJb0FBUAE"
    },
    {
      "title": "Business",
      "topicToken": "CAAqJggKIiBDQkFTRWdvSUwyMHZNRGx6TVdZU0FtVnVHZ0pWVXlnQVAB",
      "hasdataLink": "https://api.hasdata.com/scrape/google/news?gl=us&hl=en-us&topicToken=CAAqJggKIiBDQkFTRWdvSUwyMHZNRGx6TVdZU0FtVnVHZ0pWVXlnQVAB"
    },
    {
      "title": "Technology",
      "topicToken": "CAAqJggKIiBDQkFTRWdvSUwyMHZNRGRqTVhZU0FtVnVHZ0pWVXlnQVAB",
      "hasdataLink": "https://api.hasdata.com/scrape/google/news?gl=us&hl=en-us&topicToken=CAAqJggKIiBDQkFTRWdvSUwyMHZNRGRqTVhZU0FtVnVHZ0pWVXlnQVAB"
    },
    {
      "title": "Entertainment",
      "topicToken": "CAAqJggKIiBDQkFTRWdvSUwyMHZNREpxYW5RU0FtVnVHZ0pWVXlnQVAB",
      "hasdataLink": "https://api.hasdata.com/scrape/google/news?gl=us&hl=en-us&topicToken=CAAqJggKIiBDQkFTRWdvSUwyMHZNREpxYW5RU0FtVnVHZ0pWVXlnQVAB"
    },
    {
      "title": "Sports",
      "topicToken": "CAAqJggKIiBDQkFTRWdvSUwyMHZNRFp1ZEdvU0FtVnVHZ0pWVXlnQVAB",
      "hasdataLink": "https://api.hasdata.com/scrape/google/news?gl=us&hl=en-us&topicToken=CAAqJggKIiBDQkFTRWdvSUwyMHZNRFp1ZEdvU0FtVnVHZ0pWVXlnQVAB"
    },
    {
      "title": "Science",
      "topicToken": "CAAqJggKIiBDQkFTRWdvSUwyMHZNRFp0Y1RjU0FtVnVHZ0pWVXlnQVAB",
      "hasdataLink": "https://api.hasdata.com/scrape/google/news?gl=us&hl=en-us&topicToken=CAAqJggKIiBDQkFTRWdvSUwyMHZNRFp0Y1RjU0FtVnVHZ0pWVXlnQVAB"
    },
    {
      "title": "Health",
      "topicToken": "CAAqIQgKIhtDQkFTRGdvSUwyMHZNR3QwTlRFU0FtVnVLQUFQAQ",
      "hasdataLink": "https://api.hasdata.com/scrape/google/news?gl=us&hl=en-us&topicToken=CAAqIQgKIhtDQkFTRGdvSUwyMHZNR3QwTlRFU0FtVnVLQUFQAQ"
    }
  ],
  "relatedTopics": [
    {
      "position": 1,
      "title": "Balfour Beatty",
      "topicToken": "CAAqIggKIhxDQkFTRHdvSkwyMHZNRGg1YzJ4eEVnSmxiaWdBUAE",
      "hasdataLink": "https://api.hasdata.com/scrape/google/news?gl=us&hl=en-us&topicToken=CAAqIggKIhxDQkFTRHdvSkwyMHZNRGg1YzJ4eEVnSmxiaWdBUAE"
    },
    {
      "position": 2,
      "title": "Balfour Beatty VINCI",
      "topicToken": "CAAqKAgKIiJDQkFTRXdvTkwyY3ZNVEZtZVRGNk1IWmZjUklDWlc0b0FBUAE",
      "hasdataLink": "https://api.hasdata.com/scrape/google/news?gl=us&hl=en-us&topicToken=CAAqKAgKIiJDQkFTRXdvTkwyY3ZNVEZtZVRGNk1IWmZjUklDWlc0b0FBUAE"
    },
    {
      "position": 3,
      "title": "Balfour Beatty Construction",
      "topicToken": "CAAqJAgKIh5DQkFTRUFvS0wyMHZNR2hvZEdZNE54SUNaVzRvQUFQAQ",
      "hasdataLink": "https://api.hasdata.com/scrape/google/news?gl=us&hl=en-us&topicToken=CAAqJAgKIh5DQkFTRUFvS0wyMHZNR2hvZEdZNE54SUNaVzRvQUFQAQ"
    },
    {
      "position": 4,
      "title": "Dutco Balfour Beatty LLC",
      "topicToken": "CAAqKAgKIiJDQkFTRXdvTkwyY3ZNVEZtTURCNk0yTnFOaElDWlc0b0FBUAE",
      "hasdataLink": "https://api.hasdata.com/scrape/google/news?gl=us&hl=en-us&topicToken=CAAqKAgKIiJDQkFTRXdvTkwyY3ZNVEZtTURCNk0yTnFOaElDWlc0b0FBUAE"
    },
    {
      "position": 5,
      "title": "Balfour Beatty Group Limited",
      "topicToken": "CAAqKAgKIiJDQkFTRXdvTkwyY3ZNVEZuT1cxdU1Xd3hkeElDWlc0b0FBUAE",
      "hasdataLink": "https://api.hasdata.com/scrape/google/news?gl=us&hl=en-us&topicToken=CAAqKAgKIiJDQkFTRXdvTkwyY3ZNVEZuT1cxdU1Xd3hkeElDWlc0b0FBUAE"
    },
    {
      "position": 6,
      "title": "Balfour Beatty Pension Fund",
      "topicToken": "CAAqKAgKIiJDQkFTRXdvTkwyY3ZNVEZuT1c0eFpIbHNPQklDWlc0b0FBUAE",
      "hasdataLink": "https://api.hasdata.com/scrape/google/news?gl=us&hl=en-us&topicToken=CAAqKAgKIiJDQkFTRXdvTkwyY3ZNVEZuT1c0eFpIbHNPQklDWlc0b0FBUAE"
    },
    {
      "position": 7,
      "title": "Balfour Beatty Rail GmbH",
      "topicToken": "CAAqJQgKIh9DQkFTRVFvTEwyY3ZNVEl5WTNvd1l6TVNBbVZ1S0FBUAE",
      "hasdataLink": "https://api.hasdata.com/scrape/google/news?gl=us&hl=en-us&topicToken=CAAqJQgKIh9DQkFTRVFvTEwyY3ZNVEl5WTNvd1l6TVNBbVZ1S0FBUAE"
    },
    {
      "position": 8,
      "title": "Balfour Beatty Utility Solutions Limited",
      "topicToken": "CAAqKAgKIiJDQkFTRXdvTkwyY3ZNVEZtTURGaWVHWmtOaElDWlc0b0FBUAE",
      "hasdataLink": "https://api.hasdata.com/scrape/google/news?gl=us&hl=en-us&topicToken=CAAqKAgKIiJDQkFTRXdvTkwyY3ZNVEZtTURGaWVHWmtOaElDWlc0b0FBUAE"
    },
    {
      "position": 9,
      "title": "Balfour Beatty Investments Limited",
      "topicToken": "CAAqKAgKIiJDQkFTRXdvTkwyY3ZNVEZtZVRJd2VEaDViaElDWlc0b0FBUAE",
      "hasdataLink": "https://api.hasdata.com/scrape/google/news?gl=us&hl=en-us&topicToken=CAAqKAgKIiJDQkFTRXdvTkwyY3ZNVEZtZVRJd2VEaDViaElDWlc0b0FBUAE"
    }
  ],
  "relatedPublications": [
    {
      "title": "Balfour Beatty",
      "hasdataLink": "https://api.hasdata.com/scrape/google/news?gl=us&hl=en-us&topicToken=CAAqIggKIhxDQkFTRHdvSkwyMHZNRGg1YzJ4eEVnSmxiaWdBUAE"
    }
  ]
}`,
    };

    @node({
        id: 'fd554637-06ad-40a0-88b8-d925223889cd',
        name: 'SerpAPI API Example',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [-112, 2240],
    })
    SerpapiApiExample = {
        jsCode: `return {
"search_metadata":
{
"id":
"697755df71b492add7f3325d",
"status":
"Success",
"json_endpoint":
"https://serpapi.com/searches/e93a14cc0d33a26e/697755df71b492add7f3325d.json",
"created_at":
"2026-01-26 11:54:07 UTC",
"processed_at":
"2026-01-26 11:54:07 UTC",
"google_news_url":
"https://news.google.com/search?q=Balfour+Beatty",
"raw_html_file":
"https://serpapi.com/searches/e93a14cc0d33a26e/697755df71b492add7f3325d.html",
"total_time_taken":
3.02
},
"search_parameters":
{
"engine":
"google_news",
"q":
"Balfour Beatty"
},
"news_results":
[
{
"position":
1,
"title":
"Balfour Beatty Continues Share Buyback, Lifts Treasury Holdings to Over 1 Million Shares",
"source":
{
"name":
"TipRanks",
"icon":
"https://encrypted-tbn2.gstatic.com/faviconV2?url=https://www.tipranks.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
},
"link":
"https://www.tipranks.com/news/company-announcements/balfour-beatty-continues-share-buyback-lifts-treasury-holdings-to-over-1-million-shares",
"thumbnail":
"https://blog.tipranks.com/wp-content/uploads/2023/06/Industrials-9-150x150.jpg",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iK0NnNXJTV1pSUjA5YVh6aFJXbGMxVFJDV0FSaVdBU2dLTWdZTmNJNUtOUWc",
"date":
"01/26/2026, 07:25 AM, +0000 UTC",
"iso_date":
"2026-01-26T07:25:55Z"
},
{
"position":
2,
"title":
"How The New Price Target Is Shaping The Story For Balfour Beatty (LSE:BBY)",
"source":
{
"name":
"Yahoo Finance",
"icon":
"https://encrypted-tbn1.gstatic.com/faviconV2?url=https://finance.yahoo.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
},
"link":
"https://finance.yahoo.com/news/price-target-shaping-story-balfour-180558597.html",
"thumbnail":
"https://s.yimg.com/ny/api/res/1.2/dwvPQBmLx37V3keTdlHe6g--/YXBwaWQ9aGlnaGxhbmRlcjt3PTY0MDtoPTQ0Mg--/https://media.zenfs.com/en/simply_wall_st__316/c6c462914a42103d4ac688acc76cb016",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iJ0NnNUJVSEJXWkZGSFEwSXpiRk5rVFJDNkF4al9CQ2dLTWdNSkJ4UQ",
"date":
"01/24/2026, 06:05 PM, +0000 UTC",
"iso_date":
"2026-01-24T18:05:58Z"
},
{
"position":
3,
"title":
"Balfour Beatty Communities Appoints Jennifer J. Hill as President of Military Housing",
"source":
{
"name":
"Business Wire",
"icon":
"https://encrypted-tbn3.gstatic.com/faviconV2?url=https://www.businesswire.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
},
"link":
"https://www.businesswire.com/news/home/20260122258604/en/Balfour-Beatty-Communities-Appoints-Jennifer-J.-Hill-as-President-of-Military-Housing",
"thumbnail":
"https://mms.businesswire.com/media/20260122258604/en/2699322/5/jenn_hill_headshot_PR.jpg?download=1",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iK0NnNUJORWg2VDJsR1ExRlVVMUo2VFJDc0JCaW9CQ2dLTWdhcEphRE5HUW8",
"date":
"01/22/2026, 02:23 PM, +0000 UTC",
"iso_date":
"2026-01-22T14:23:00Z"
},
{
"position":
4,
"title":
"Highways Services",
"source":
{
"name":
"Balfour Beatty",
"icon":
"https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.balfourbeatty.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
},
"link":
"https://www.balfourbeatty.com/what-we-do/expertise/highways-services-and-asset-management/highways-services/",
"thumbnail":
"https://www.balfourbeatty.com/media/agzpdli4/compressed2018_09-15_bn2021_spmt_080-2.jpg",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iJ0NnNVhWbUkwYjJSak9YQXphbEZ6VFJERUF4aW1CU2dLTWdNRmdBWQ",
"date":
"01/22/2026, 10:25 AM, +0000 UTC",
"iso_date":
"2026-01-22T10:25:46Z"
},
{
"position":
5,
"title":
"Balfour Beatty sues insurers for treating work orders as legal claims",
"source":
{
"name":
"Insurance Business",
"icon":
"https://encrypted-tbn2.gstatic.com/faviconV2?url=https://www.insurancebusinessmag.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
},
"link":
"https://www.insurancebusinessmag.com/us/news/environmental/balfour-beatty-sues-insurers-for-treating-work-orders-as-legal-claims-562456.aspx",
"thumbnail":
"https://cdn-res.keymedia.com/cdn-cgi/image/w=840,h=504,f=auto/https://cdn-res.keymedia.com/cms/images/us/003/0321_639045014982023770.png",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iK0NnNHpOVWRCVkc1WGNYRTRVMEZ6VFJDdUFSaWlBaWdCTWdhRm9aVG5RQWM",
"date":
"01/20/2026, 09:31 AM, +0000 UTC",
"iso_date":
"2026-01-20T09:31:43Z"
},
{
"position":
6,
"title":
"Balfour Beatty Communities names Jennifer Hill as military housing president",
"source":
{
"name":
"Investing.com",
"icon":
"https://encrypted-tbn2.gstatic.com/faviconV2?url=https://www.investing.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
},
"link":
"https://www.investing.com/news/company-news/balfour-beatty-communities-names-jennifer-hill-as-military-housing-president-93CH-4460654",
"date":
"01/22/2026, 02:35 PM, +0000 UTC",
"iso_date":
"2026-01-22T14:35:36Z"
},
{
"position":
7,
"title":
"Balfour Beatty’s troubling legacy: Federal fraud and a $65 million reckoning",
"source":
{
"name":
"floridapolitics.com",
"icon":
"https://encrypted-tbn0.gstatic.com/faviconV2?url=https://floridapolitics.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL",
"authors":
[
"Peter Schorsch"
]
},
"link":
"https://floridapolitics.com/archives/765521-balfour-beattys-troubling-legacy-federal-fraud-and-a-65-million-reckoning/",
"thumbnail":
"https://floridapolitics.com/wp-content/uploads/2025/11/balfour-beatty.webp",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iK0NnNXlUbEZmY1d0UldYRnRNVGhEVFJDUkF4ajhCU2dLTWdZcFFJanZwQVU",
"date":
"11/14/2025, 08:00 AM, +0000 UTC",
"iso_date":
"2025-11-14T08:00:00Z"
},
{
"position":
8,
"title":
"Balfour Beatty touts growth despite US weakness",
"source":
{
"name":
"Construction Dive",
"icon":
"https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.constructiondive.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL",
"authors":
[
"Matthew Thibault"
]
},
"link":
"https://www.constructiondive.com/news/balfour-beatty-growth-weakness-construction/807223/",
"thumbnail":
"https://imgproxy.divecdn.com/UcuMNZrQqVnf0pYbRZbkmzTAxoDLKDlYl2IuDs3ocKk/g:ce/rs:fill:1200:675:1/Z3M6Ly9kaXZlc2l0ZS1zdG9yYWdlL2RpdmVpbWFnZS9Db2xuZV9WYWxsZXlfVmlhZHVjdC5qcGc=.webp",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iK0NnNU5VbGRSWld0UFNHbzRRbk5MVFJDZkF4ampCU2dLTWdZQmdJS3R3UVE",
"date":
"12/05/2025, 08:00 AM, +0000 UTC",
"iso_date":
"2025-12-05T08:00:00Z"
},
{
"position":
9,
"title":
"WH Smith names ex-Balfour Beatty chief as chair, shares soar",
"source":
{
"name":
"Reuters",
"icon":
"https://encrypted-tbn2.gstatic.com/faviconV2?url=https://www.reuters.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL",
"authors":
[
"Yamini Kalia"
]
},
"link":
"https://www.reuters.com/world/uk/uks-wh-smith-names-leo-quinn-new-chair-2026-01-19/",
"thumbnail":
"https://www.reuters.com/resizer/v2/TFXUEEC5MNJHVIBZLMR7CWPULA.jpg?auth=0a75e6901f2656e5b7e459bd4bf104298f091778864965afcf9be6479658d338&width=1920&quality=80",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iL0NnNXRORkp3VG1kaVRsazRaVmQxVFJES0F4aWRCU2dLTWdrQkFvUmxEcW90bVFB",
"date":
"01/19/2026, 08:59 AM, +0000 UTC",
"iso_date":
"2026-01-19T08:59:00Z"
},
{
"position":
10,
"title":
"WH Smith brings in ex Balfour Beatty boss to lead recovery after accounting blunder",
"source":
{
"name":
"MSN",
"icon":
"https://encrypted-tbn2.gstatic.com/faviconV2?url=https://www.msn.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL",
"authors":
[
"Emily Hawkins"
]
},
"link":
"https://www.msn.com/en-us/money/companies/wh-smith-brings-in-ex-balfour-beatty-boss-to-lead-recovery-after-accounting-blunder/ar-AA1UuBcG",
"date":
"01/19/2026, 03:12 PM, +0000 UTC",
"iso_date":
"2026-01-19T15:12:54Z"
},
{
"position":
11,
"title":
"Balfour Beatty completes disposal of ten Infrastructure Investments assets",
"source":
{
"name":
"Balfour Beatty",
"icon":
"https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.balfourbeatty.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
},
"link":
"https://www.balfourbeatty.com/media-centre/latest/balfour-beatty-completes-disposal-of-ten-infrastructure-investments-assets/",
"thumbnail":
"https://www.balfourbeatty.com/media/ax0dmps2/press-release.webp",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iK0NnNUJlRTF0Y25waGJXRTVlRFY0VFJESUFSamVBaWdLTWdhZFE0eHRKUVk",
"date":
"01/05/2026, 08:00 AM, +0000 UTC",
"iso_date":
"2026-01-05T08:00:00Z"
},
{
"position":
12,
"title":
"Balfour Beatty Expands Share Buyback, Lifts Treasury Stock to 959,039 Shares",
"source":
{
"name":
"TipRanks",
"icon":
"https://encrypted-tbn2.gstatic.com/faviconV2?url=https://www.tipranks.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
},
"link":
"https://www.tipranks.com/news/company-announcements/balfour-beatty-expands-share-buyback-lifts-treasury-stock-to-959039-shares",
"thumbnail":
"https://blog.tipranks.com/wp-content/uploads/2023/06/Industrials-10-750x406.jpg",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iK0NnNHlaVlJpYjFWcmNYSkVWRzFYVFJDV0F4anVCU2dLTWdhUkE0cU5yUVE",
"date":
"01/23/2026, 07:25 AM, +0000 UTC",
"iso_date":
"2026-01-23T07:25:51Z"
},
{
"position":
13,
"title":
"Balfour Beatty profits rise, but US arm struggles",
"source":
{
"name":
"Construction Dive",
"icon":
"https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.constructiondive.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL",
"authors":
[
"Matthew Thibault"
]
},
"link":
"https://www.constructiondive.com/news/balfour-beatty-earnings-us-challenges/757678/",
"thumbnail":
"https://imgproxy.divecdn.com/UcuMNZrQqVnf0pYbRZbkmzTAxoDLKDlYl2IuDs3ocKk/g:ce/rs:fill:1200:675:1/Z3M6Ly9kaXZlc2l0ZS1zdG9yYWdlL2RpdmVpbWFnZS9Db2xuZV9WYWxsZXlfVmlhZHVjdC5qcGc=.webp",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iK0NnNU5VbGRSWld0UFNHbzRRbk5MVFJDZkF4ampCU2dLTWdZQmdJS3R3UVE",
"date":
"08/15/2025, 07:00 AM, +0000 UTC",
"iso_date":
"2025-08-15T07:00:00Z"
},
{
"position":
14,
"title":
"Balfour Beatty appoints Managing Director to lead its UK Regional Civils business",
"source":
{
"name":
"Balfour Beatty",
"icon":
"https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.balfourbeatty.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
},
"link":
"https://www.balfourbeatty.com/media-centre/latest/balfour-beatty-appoints-managing-director-to-lead-its-uk-regional-civils-business/",
"thumbnail":
"https://www.balfourbeatty.com/media/h0kbsi0g/preferred-photo-for-kay-slade.jpg",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iK0NnNXFjMWhRVmtkTVpVVk9NSGxyVFJERUF4aW5CU2dLTWdhdFZZak5KUWc",
"date":
"01/19/2026, 02:32 PM, +0000 UTC",
"iso_date":
"2026-01-19T14:32:59Z"
},
{
"position":
15,
"title":
"Balfour Beatty Advances Share Buyback, Tightening Voting Share Base",
"source":
{
"name":
"TipRanks",
"icon":
"https://encrypted-tbn2.gstatic.com/faviconV2?url=https://www.tipranks.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
},
"link":
"https://www.tipranks.com/news/company-announcements/balfour-beatty-advances-share-buyback-tightening-voting-share-base",
"thumbnail":
"https://blog.tipranks.com/wp-content/uploads/2023/06/Industrials-7-750x406.jpg",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iJ0NnNUdUbHBVYW1OSVJtODNNR3RKVFJDV0F4anVCU2dLTWdPQm9BWQ",
"date":
"01/22/2026, 07:29 AM, +0000 UTC",
"iso_date":
"2026-01-22T07:29:03Z"
},
{
"position":
16,
"title":
"Balfour Beatty 2025 Trading Update",
"source":
{
"name":
"Balfour Beatty",
"icon":
"https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.balfourbeatty.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
},
"link":
"https://www.balfourbeatty.com/media-centre/latest/balfour-beatty-2025-trading-update/",
"thumbnail":
"https://www.balfourbeatty.com/media/hp3ocpfk/balfour-beatty-2023-agm-trading-update.png",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iK0NnNTNUelZHTTBNNFNuWmhkMWRzVFJDckFSaW5BaWdCTWdZZHBKQ01PUVk",
"date":
"12/04/2025, 08:00 AM, +0000 UTC",
"iso_date":
"2025-12-04T08:00:00Z"
},
{
"position":
17,
"title":
"Balfour Beatty Updates Market on Progress of Share Buyback Programme",
"source":
{
"name":
"TipRanks",
"icon":
"https://encrypted-tbn2.gstatic.com/faviconV2?url=https://www.tipranks.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
},
"link":
"https://www.tipranks.com/news/company-announcements/balfour-beatty-updates-market-on-progress-of-share-buyback-programme",
"thumbnail":
"https://blog.tipranks.com/wp-content/uploads/2023/06/Industrials-2-750x406.jpg",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iMkNnNHRhV3R1YWw5blJFNWxVVkpSVFJDV0F4anVCU2dLTWdzQkVJcEZtZVRZQ01yZVBR",
"date":
"01/21/2026, 07:28 AM, +0000 UTC",
"iso_date":
"2026-01-21T07:28:00Z"
},
{
"position":
18,
"title":
"Balfour Beatty unveils £7.2 million AI investment: transforming how Britain builds",
"source":
{
"name":
"Balfour Beatty",
"icon":
"https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.balfourbeatty.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
},
"link":
"https://www.balfourbeatty.com/media-centre/latest/balfour-beatty-unveils-72-million-ai-investment-transforming-how-britain-builds/",
"thumbnail":
"https://www.balfourbeatty.com/media/yu1nlxip/bb_copilot_press.jpg",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iK0NnNTBMVWxSYUdFeFdqQXplbGxSVFJERUJCaVJCQ2dLTWdZTk1vWm9uUVU",
"date":
"07/31/2025, 07:00 AM, +0000 UTC",
"iso_date":
"2025-07-31T07:00:00Z"
},
{
"position":
19,
"title":
"Balfour Beatty awarded first phase of SSEN Transmission’s Netherton Hub",
"source":
{
"name":
"Balfour Beatty",
"icon":
"https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.balfourbeatty.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
},
"link":
"https://www.balfourbeatty.com/media-centre/latest/balfour-beatty-awarded-first-phase-of-ssen-transmission-s-netherton-hub/",
"thumbnail":
"https://www.balfourbeatty.com/media/yyfcn5d4/netherton-hub-aerial-view.jpg",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iK0NnNXNiMFExY1VnMVNrMHpXV3BHVFJERUF4aW1CU2dLTWdZQkVZU1hJQWs",
"date":
"09/22/2025, 07:00 AM, +0000 UTC",
"iso_date":
"2025-09-22T07:00:00Z"
},
{
"position":
20,
"title":
"Balfour Beatty secures two spots on National Grid’s £59 billion High Voltage Direct Current supply chain framework",
"source":
{
"name":
"Balfour Beatty",
"icon":
"https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.balfourbeatty.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
},
"link":
"https://www.balfourbeatty.com/media-centre/latest/balfour-beatty-secures-two-spots-on-national-grid-s-59-billion-high-voltage-direct-current-supply-chain-framework/",
"thumbnail":
"https://www.balfourbeatty.com/media/blgdqxy2/signings_2505010_0002.jpg",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iL0NnNVRUbkZ2ZEVkME1qSjBPVkY0VFJERUF4aW1CU2dLTWdrQlFKTG1NS2NlaHdJ",
"date":
"08/21/2025, 07:00 AM, +0000 UTC",
"iso_date":
"2025-08-21T07:00:00Z"
},
{
"position":
21,
"title":
"Balfour Beatty completes sale of Omnicom",
"source":
{
"name":
"Balfour Beatty",
"icon":
"https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.balfourbeatty.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
},
"link":
"https://www.balfourbeatty.com/media-centre/latest/balfour-beatty-completes-sale-of-omnicom/",
"thumbnail":
"https://app-bb-u13-prod-westeurope.azurewebsites.net/media/ax0dmps2/press-release.webp?quality=90&v=1db604bbf3707b0",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iK0NnNWtjRGt0VDFWTFYzRXdibWRsVFJESUFSamVBaWdLTWdhZFE0eHRKUVk",
"date":
"08/01/2025, 07:00 AM, +0000 UTC",
"iso_date":
"2025-08-01T07:00:00Z"
},
{
"position":
22,
"title":
"Balfour Beatty launches updated Building New Futures Sustainability Strategy",
"source":
{
"name":
"Balfour Beatty",
"icon":
"https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.balfourbeatty.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
},
"link":
"https://www.balfourbeatty.com/media-centre/latest/balfour-beatty-launches-updated-building-new-futures-sustainability-strategy/",
"thumbnail":
"https://www.balfourbeatty.com/media/0rehqkcw/a4-landscape-cover-1.png",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iK0NnNVdhVUUxZDNaUlZGRkVWR0Y0VFJEZ0F4aUFCU2dLTWdZZGRKQ3JzUVk",
"date":
"07/23/2025, 07:00 AM, +0000 UTC",
"iso_date":
"2025-07-23T07:00:00Z"
},
{
"position":
23,
"title":
"Balfour Beatty selected by Rolls Royce as its fissile construction partner",
"source":
{
"name":
"Balfour Beatty",
"icon":
"https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.balfourbeatty.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
},
"link":
"https://www.balfourbeatty.com/media-centre/latest/balfour-beatty-selected-by-rolls-royce-as-its-fissile-construction-partner/",
"thumbnail":
"https://www.balfourbeatty.com/media/gelhfhrg/submarines-raynesway-site-img.jpg",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iK0NnNDBaekJ2WDB4MlJ6aEhiVUZZVFJDZkF4amlCU2dLTWdZSmtKQXF1UVk",
"date":
"09/09/2025, 07:00 AM, +0000 UTC",
"iso_date":
"2025-09-09T07:00:00Z"
},
{
"position":
24,
"title":
"Balfour Beatty Expands Treasury Stock with Ongoing Share Buyback",
"source":
{
"name":
"TipRanks",
"icon":
"https://encrypted-tbn2.gstatic.com/faviconV2?url=https://www.tipranks.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
},
"link":
"https://www.tipranks.com/news/company-announcements/balfour-beatty-expands-treasury-stock-with-ongoing-share-buyback",
"thumbnail":
"https://blog.tipranks.com/wp-content/uploads/2023/06/Industrials-1-750x406.jpg",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iL0NnNWpSUzEzV1ZCc1JqaExia2wzVFJDV0F4anVCU2dLTWdrQklJQ2lIZWhUVUFF",
"date":
"01/20/2026, 07:34 AM, +0000 UTC",
"iso_date":
"2026-01-20T07:34:19Z"
},
{
"position":
25,
"title":
"Balfour Beatty mobilises to begin construction on Grand Hyatt Miami Beach in the US",
"source":
{
"name":
"Balfour Beatty",
"icon":
"https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.balfourbeatty.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
},
"link":
"https://www.balfourbeatty.com/media-centre/latest/balfour-beatty-mobilises-to-begin-construction-on-grand-hyatt-miami-beach-in-the-us/",
"thumbnail":
"https://www.balfourbeatty.com/media/ax0dmps2/press-release.webp",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iK0NnNUJlRTF0Y25waGJXRTVlRFY0VFJESUFSamVBaWdLTWdhZFE0eHRKUVk",
"date":
"04/29/2025, 07:00 AM, +0000 UTC",
"iso_date":
"2025-04-29T07:00:00Z"
},
{
"position":
26,
"title":
"Volunteering and Charitable Giving",
"source":
{
"name":
"Balfour Beatty",
"icon":
"https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.balfourbeatty.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
},
"link":
"https://www.balfourbeatty.com/about-us/how-we-operate/volunteering-and-charitable-giving/",
"thumbnail":
"https://www.balfourbeatty.com/media/4isokui4/stem-logo-220801.svg",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iK0NnNTZaa3d6WlV0WlIyMHlVVWMyVFJDZEFSakJBaWdCTWdZSmtZZ1N4UU0",
"date":
"07/23/2025, 06:45 AM, +0000 UTC",
"iso_date":
"2025-07-23T06:45:26Z"
},
{
"position":
27,
"title":
"Balfour Beatty Campus Solutions Celebrates Topping Out Milestone for UT Austin Student Housing Project",
"source":
{
"name":
"Business Wire",
"icon":
"https://encrypted-tbn3.gstatic.com/faviconV2?url=https://www.businesswire.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
},
"link":
"https://www.businesswire.com/news/home/20260114924695/en/Balfour-Beatty-Campus-Solutions-Celebrates-Topping-Out-Milestone-for-UT-Austin-Student-Housing-Project",
"thumbnail":
"https://mms.businesswire.com/media/20260114924695/en/2692073/5/BBCS-UTAustinTopOut-Blog.jpg?download=1",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iL0NnNVBORk5XUlcwelNUZE5NSFZyVFJDM0FSaVRBaWdCTWdrQlVJanpvT2F3VHdF",
"date":
"01/14/2026, 03:08 PM, +0000 UTC",
"iso_date":
"2026-01-14T15:08:00Z"
},
{
"position":
28,
"title":
"Balfour Beatty 2025 half year results",
"source":
{
"name":
"Balfour Beatty",
"icon":
"https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.balfourbeatty.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
},
"link":
"https://www.balfourbeatty.com/media-centre/latest/balfour-beatty-2025-half-year-results/",
"thumbnail":
"https://www.balfourbeatty.com/media/ax0dmps2/press-release.webp",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iK0NnNUJlRTF0Y25waGJXRTVlRFY0VFJESUFSamVBaWdLTWdhZFE0eHRKUVk",
"date":
"08/13/2025, 07:00 AM, +0000 UTC",
"iso_date":
"2025-08-13T07:00:00Z"
},
{
"position":
29,
"title":
"Empty seats, big questions at Fort Stewart's year-end town hall",
"source":
{
"name":
"army.mil",
"icon":
"https://encrypted-tbn2.gstatic.com/faviconV2?url=https://www.army.mil&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
},
"link":
"https://www.army.mil/article/289396/empty_seats_big_questions_at_fort_stewarts_year_end_town_hall",
"thumbnail":
"https://api.army.mil/e2/c/images/2025/12/05/1db378a5/max1200.jpg",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iK0NnNVFWWE5GVmxCU2MyRktiV3MyVFJERUF4aW1CU2dLTWdZTk1wandHQW8",
"date":
"12/05/2025, 08:00 AM, +0000 UTC",
"iso_date":
"2025-12-05T08:00:00Z"
},
{
"position":
30,
"title":
"Balfour Beatty secures £833 million Net Zero Teesside contract",
"source":
{
"name":
"Balfour Beatty",
"icon":
"https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.balfourbeatty.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
},
"link":
"https://www.balfourbeatty.com/media-centre/latest/balfour-beatty-secures-833-million-net-zero-teesside-contract/",
"thumbnail":
"https://www.balfourbeatty.com/media/wcwpjo4u/nzt-power-illustation.jpg",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iK0NnNU1iWGxXU1VNMWF5MTFhSFYzVFJDZkF4ampCU2dLTWdZSllJQk5NUWM",
"date":
"06/26/2025, 07:00 AM, +0000 UTC",
"iso_date":
"2025-06-26T07:00:00Z"
},
{
"position":
31,
"title":
"Lawsuit alleges Balfour Beatty systematically failed to address critical problems at Naval Air Station Key West",
"source":
{
"name":
"floridapolitics.com",
"icon":
"https://encrypted-tbn0.gstatic.com/faviconV2?url=https://floridapolitics.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL",
"authors":
[
"Peter Schorsch"
]
},
"link":
"https://floridapolitics.com/archives/764631-lawsuit-alleges-balfour-beatty-systematically-failed-to-address-critical-problems-at-naval-air-station-key-west/",
"thumbnail":
"https://floridapolitics.com/wp-content/uploads/2019/12/NAS-Key-West.jpg",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iK0NnNUZOVUkyWlZOZmMycDRka2xJVFJERUF4aW1CU2dLTWdZQllKaURMQWc",
"date":
"11/10/2025, 08:00 AM, +0000 UTC",
"iso_date":
"2025-11-10T08:00:00Z"
},
{
"position":
32,
"title":
"Balfour Beatty features in the FT discussing how businesses can unlock Gen Z’s leadership potential",
"source":
{
"name":
"Balfour Beatty",
"icon":
"https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.balfourbeatty.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
},
"link":
"https://www.balfourbeatty.com/media-centre/latest/balfour-beatty-features-in-the-financial-times-discussing-how-businesses-can-unlock-gen-z-s-leadership-potential/",
"thumbnail":
"https://www.balfourbeatty.com/media/t1djexoh/1702911796637.jpeg",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iK0NnNDJhRU56VFhaNE1USlRPV2xsVFJDcUJCaXFCQ2dLTWdhdFJaYk9JUWs",
"date":
"10/23/2025, 07:00 AM, +0000 UTC",
"iso_date":
"2025-10-23T07:00:00Z"
},
{
"position":
33,
"title":
"Balfour Beatty welcomes Joanna Vezey as Managing Director of its UK Highways business",
"source":
{
"name":
"Balfour Beatty",
"icon":
"https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.balfourbeatty.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
},
"link":
"https://www.balfourbeatty.com/media-centre/latest/balfour-beatty-welcomes-joanna-vezey-as-managing-director-of-its-uk-highways-business/",
"thumbnail":
"https://www.balfourbeatty.com/media/o1ljn1eg/joannavezey_the-hub.jpg",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iK0NnNVRVM0pOUm5oUFQwUjNMVmwyVFJERUF4aW1CU2dLTWdZdFZaS3VwUWM",
"date":
"09/30/2025, 07:00 AM, +0000 UTC",
"iso_date":
"2025-09-30T07:00:00Z"
},
{
"position":
34,
"title":
"Balfour Beatty set to protect homes, businesses and farmland through £47m flood defence contract",
"source":
{
"name":
"Balfour Beatty",
"icon":
"https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.balfourbeatty.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
},
"link":
"https://www.balfourbeatty.com/media-centre/latest/balfour-beatty-set-to-protect-homes-businesses-and-farmland-through-47-million-flood-defence-contract/",
"thumbnail":
"https://www.balfourbeatty.com/media/coghaffp/benacre-arial-view-updt.png",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iK0NnNUdSMkZpY1ZWM1VtUnFlVEEwVFJDNEF4aTVCU2dLTWdZSkVJeUtuQVU",
"date":
"08/28/2025, 07:00 AM, +0000 UTC",
"iso_date":
"2025-08-28T07:00:00Z"
},
{
"position":
35,
"title":
"Helping apprentices thrive: Balfour Beatty features in New Civil Engineer",
"source":
{
"name":
"Balfour Beatty",
"icon":
"https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.balfourbeatty.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
},
"link":
"https://www.balfourbeatty.com/media-centre/latest/helping-apprentices-thrive-balfour-beatty-features-in-new-civil-engineer/",
"thumbnail":
"https://www.balfourbeatty.com/media/iu4nmxlm/tanvi.png",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iK0NnNTFWemcwUVVWbmNXTllNalZQVFJDQUJSamdBeWdLTWdZdHBaQ3V0UVk",
"date":
"12/18/2025, 08:00 AM, +0000 UTC",
"iso_date":
"2025-12-18T08:00:00Z"
},
{
"position":
36,
"title":
"Balfour Beatty completes disposal of Foundry Courtyard student accommodation",
"source":
{
"name":
"Balfour Beatty",
"icon":
"https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.balfourbeatty.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
},
"link":
"https://www.balfourbeatty.com/media-centre/latest/balfour-beatty-completes-disposal-of-foundry-courtyard-student-accommodation/",
"thumbnail":
"https://www.balfourbeatty.com/media/r0unhlgg/press-release.jpg?width=250&height=145&v=1da65a11c5f5240",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iK0NnNXBlVlJhTWtSUGNsRlhTV2hPVFJDUkFSajZBU2dCTWdhaFE0eHVKUVk",
"date":
"12/19/2025, 08:00 AM, +0000 UTC",
"iso_date":
"2025-12-19T08:00:00Z"
},
{
"position":
37,
"title":
"Balfour Beatty invests nearly $10M in Microsoft AI",
"source":
{
"name":
"Construction Dive",
"icon":
"https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.constructiondive.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL",
"authors":
[
"Matthew Thibault"
]
},
"link":
"https://www.constructiondive.com/news/balfour-beatty-invests-microsoft-ai/757497/",
"thumbnail":
"https://imgproxy.divecdn.com/IYiGzODuO84HqnaSraPf-0Ph78WK_89LraGFMcKFc0s/g:ce/rs:fill:1200:675:1/Z3M6Ly9kaXZlc2l0ZS1zdG9yYWdlL2RpdmVpbWFnZS9hOV9oaWdod2F5LndlYnA=.webp",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iMkNnNTVaRWxOU210U1RXRmplbkJrVFJDZkF4ampCU2dLTWdzQkVJSUxwYUtwMW9pUExB",
"date":
"08/13/2025, 07:00 AM, +0000 UTC",
"iso_date":
"2025-08-13T07:00:00Z"
},
{
"position":
38,
"title":
"Balfour Beatty CIO: In the age of AI, ‘the organizations that will thrive are those where HR & IT work in lockstep’",
"source":
{
"name":
"unleash.ai",
"icon":
"https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.unleash.ai&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
},
"link":
"https://www.unleash.ai/artificial-intelligence/balfour-beatty-cio-in-the-age-of-ai-the-organizations-that-will-thrive-are-those-where-hr-it-work-in-lockstep/",
"thumbnail":
"https://www.unleash.ai/wp-content/uploads/2025/09/BB_Littlebrook_141021_52_of_4111.jpg",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iK0NnNW1iM1U0WXpWa1lsOWxWM0JTVFJDM0FSaVRBaWdCTWdZQmc0Z29OUVk",
"date":
"09/09/2025, 07:00 AM, +0000 UTC",
"iso_date":
"2025-09-09T07:00:00Z"
},
{
"position":
39,
"title":
"Balfour Beatty features in UNLEASH discussing the wide ranging benefits of Microsoft 365 Copilot",
"source":
{
"name":
"Balfour Beatty",
"icon":
"https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.balfourbeatty.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
},
"link":
"https://www.balfourbeatty.com/media-centre/latest/balfour-beatty-features-in-unleash-discussing-the-wide-ranging-benefits-of-microsoft-365-copilot/",
"thumbnail":
"https://www.balfourbeatty.com/media/tnbb42og/jon-o.png",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iK0NnNDFVbTlUUjFKVGFYVTFhRnBQVFJDbUJCaW1CQ2dLTWdZcFZaak5wUWc",
"date":
"09/16/2025, 07:00 AM, +0000 UTC",
"iso_date":
"2025-09-16T07:00:00Z"
},
{
"position":
40,
"title":
"Balfour Beatty plans stateside AI hackathon",
"source":
{
"name":
"Construction Dive",
"icon":
"https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.constructiondive.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL",
"authors":
[
"Matthew Thibault"
]
},
"link":
"https://www.constructiondive.com/news/balfour-beatty-ai-hackathon-us/759107/",
"thumbnail":
"https://imgproxy.divecdn.com/qbpIqbzeiIu_V6geSc9J9avLnFag-fURumBm2ZOB6xw/g:nowe:0:0/c:3000:1694/rs:fill:1200:675:1/Z3M6Ly9kaXZlc2l0ZS1zdG9yYWdlL2RpdmVpbWFnZS9HZXR0eUltYWdlcy0yMTM2MzQxNjc1LmpwZw==.webp",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iK0NnNDFhWFZHZFdneFdWRTFiemhWVFJDZkF4ampCU2dLTWdZZFlJcnN0UVU",
"date":
"09/03/2025, 07:00 AM, +0000 UTC",
"iso_date":
"2025-09-03T07:00:00Z"
},
{
"position":
41,
"title":
"Balfour Beatty (LON:BBY) Is Due To Pay A Dividend Of £0.042",
"source":
{
"name":
"Yahoo Finance",
"icon":
"https://encrypted-tbn1.gstatic.com/faviconV2?url=https://finance.yahoo.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
},
"link":
"https://finance.yahoo.com/news/balfour-beatty-lon-bby-due-051450431.html",
"thumbnail":
"https://s.yimg.com/ny/api/res/1.2/iKCvirtQnZGdbLoKbCMnkw--/YXBwaWQ9aGlnaGxhbmRlcjt3PTI0MDA7aD0xNDQ0/https://media.zenfs.com/en/simply_wall_st__316/b51629222c8885381352698338d7e383",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iK0NnNUlXa1Y1WjJWMlZWcGlSMmRrVFJDdEF4aktCU2dLTWdhZEFwQXdoUWs",
"date":
"10/28/2025, 07:00 AM, +0000 UTC",
"iso_date":
"2025-10-28T07:00:00Z"
},
{
"position":
42,
"title":
"Philip Hoare joins Balfour Beatty as Group Chief Executive",
"source":
{
"name":
"Balfour Beatty",
"icon":
"https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.balfourbeatty.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
},
"link":
"https://www.balfourbeatty.com/media-centre/latest/philip-hoare-joins-balfour-beatty-as-group-chief-executive/",
"thumbnail":
"https://www.balfourbeatty.com/media/0kudune1/2627947794-philip-hoare.jpg",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iK0NnNUdaM1p3ZGxWc1duWjBhMHBPVFJDcUJCaXFCQ2dLTWdhbFZaYk5KUWc",
"date":
"09/08/2025, 07:00 AM, +0000 UTC",
"iso_date":
"2025-09-08T07:00:00Z"
},
{
"position":
43,
"title":
"Balfour Beatty Communities Foundation Appoints Sean Kent as President and Board Member",
"source":
{
"name":
"Business Wire",
"icon":
"https://encrypted-tbn3.gstatic.com/faviconV2?url=https://www.businesswire.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
},
"link":
"https://www.businesswire.com/news/home/20251120312948/en/Balfour-Beatty-Communities-Foundation-Appoints-Sean-Kent-as-President-and-Board-Member",
"thumbnail":
"https://mms.businesswire.com/media/20251120312948/en/2649524/5/Preferred_1stPicks_119.jpg?download=1",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iK0NnNTVhbXBHV2xoTVJFRXhjRjk0VFJERUF4aW1CU2dLTWdhbEpwb01HZ28",
"date":
"11/20/2025, 08:00 AM, +0000 UTC",
"iso_date":
"2025-11-20T08:00:00Z"
},
{
"position":
44,
"title":
"Balfour Beatty sees 20% order book jump in 2025 on UK power generation demand",
"source":
{
"name":
"Reuters",
"icon":
"https://encrypted-tbn2.gstatic.com/faviconV2?url=https://www.reuters.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
},
"link":
"https://www.reuters.com/world/uk/uks-balfour-beatty-sees-higher-2025-profit-uk-construction-strength-2025-12-04/",
"thumbnail":
"https://www.reuters.com/resizer/v2/2QJYOTURIVNDPKE63OJECLTYJQ.jpg?auth=a2eb72330cecb750adac1e6d3d95ac22b04bd36692e59308a2829f1a5246312c&width=1920&quality=80",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iK0NnNHlSRE5mU1VkVk0yTkxiM3BuVFJEYkF4aUZCU2dLTWdhTlpJRUg4Z0E",
"date":
"12/04/2025, 08:00 AM, +0000 UTC",
"iso_date":
"2025-12-04T08:00:00Z"
},
{
"position":
45,
"title":
"What Recent Analyst Updates Mean For Balfour Beatty’s Story and Valuation",
"source":
{
"name":
"Yahoo Finance",
"icon":
"https://encrypted-tbn1.gstatic.com/faviconV2?url=https://finance.yahoo.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
},
"link":
"https://finance.yahoo.com/news/recent-analyst-updates-mean-balfour-010844365.html",
"thumbnail":
"https://s.yimg.com/ny/api/res/1.2/8RJU23WggXhOAq6vDL.mAg--/YXBwaWQ9aGlnaGxhbmRlcjt3PTI0MDA7aD04NDg-/https://media.zenfs.com/en/simply_wall_st__316/6274e524e96c80c36ef0806e55ebd73a",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iK0NnNURVbXhDVTJ0TVIwZG5SVkpzVFJESkFoaWtCeWdLTWdaVkVJNTVGQXM",
"date":
"11/24/2025, 08:00 AM, +0000 UTC",
"iso_date":
"2025-11-24T08:00:00Z"
},
{
"position":
46,
"title":
"Investing in Balfour Beatty (LON:BBY) five years ago would have delivered you a 233% gain",
"source":
{
"name":
"Yahoo Finance",
"icon":
"https://encrypted-tbn1.gstatic.com/faviconV2?url=https://finance.yahoo.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
},
"link":
"https://finance.yahoo.com/news/investing-balfour-beatty-lon-bby-055131058.html",
"thumbnail":
"https://s.yimg.com/ny/api/res/1.2/MitQud9bh7aEAuR0sYMQMg--/YXBwaWQ9aGlnaGxhbmRlcjt3PTI0MDA7aD0xNTIw/https://media.zenfs.com/en/simply_wall_st__316/9d9b37b00783766bcc76345b32f0df21",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iI0NnNTZaRkpsYVdkcVVHaHNZMk40VFJDNUF4aTRCU2dLTWdB",
"date":
"10/13/2025, 07:00 AM, +0000 UTC",
"iso_date":
"2025-10-13T07:00:00Z"
},
{
"position":
47,
"title":
"Key West families sue Balfour Beatty, alleging toxic living conditions in military housing",
"source":
{
"name":
"floridapolitics.com",
"icon":
"https://encrypted-tbn0.gstatic.com/faviconV2?url=https://floridapolitics.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL",
"authors":
[
"Peter Schorsch"
]
},
"link":
"https://floridapolitics.com/archives/764840-key-west-families-sue-balfour-beatty-alleging-toxic-living-conditions-in-military-housing/",
"thumbnail":
"https://floridapolitics.com/wp-content/uploads/2016/05/court-lawsuit-Large.jpg",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iL0NnNDROVjk2U0c4dFpIQTRSWEF6VFJEREF4aW5CU2dLTWdrQmNJeVRLR2FwVHdF",
"date":
"11/12/2025, 08:00 AM, +0000 UTC",
"iso_date":
"2025-11-12T08:00:00Z"
},
{
"position":
48,
"title":
"Balfour Beatty secures £162 million contract to deliver landmark Dunard Centre in Edinburgh",
"source":
{
"name":
"Balfour Beatty",
"icon":
"https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.balfourbeatty.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
},
"link":
"https://www.balfourbeatty.com/media-centre/latest/balfour-beatty-secures-162-million-contract-to-deliver-landmark-dunard-centre-in-edinburgh/",
"thumbnail":
"https://www.balfourbeatty.com/media/b4kgnung/1485-dca-dunard-centre-render-06-5ae402c9837860cd.jpg",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iK0NnNUVZM2xUVUcxRFQyWXlSMEpJVFJDcUJCaXFCQ2dLTWdhSmdZUk8xUU0",
"date":
"10/24/2025, 07:00 AM, +0000 UTC",
"iso_date":
"2025-10-24T07:00:00Z"
},
{
"position":
49,
"title":
"Contracting giant Balfour Beatty puts down roots in Scott’s Addition",
"source":
{
"name":
"richmondbizsense.com",
"icon":
"https://encrypted-tbn0.gstatic.com/faviconV2?url=https://richmondbizsense.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL",
"authors":
[
"Mike Platania"
]
},
"link":
"https://richmondbizsense.com/2025/09/08/contracting-giant-balfour-beatty-puts-down-roots-in-scotts-addition/",
"thumbnail":
"https://richmondbizsense.com/wp-content/uploads/2025/09/balfour-beatty-richmond-1-Cropped-scaled.jpg",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iK0NnNVBPWFkwU0VsaVFUVTNiV3AyVFJDZkF4ampCU2dLTWdZQlVJUk1yUVE",
"date":
"09/08/2025, 07:00 AM, +0000 UTC",
"iso_date":
"2025-09-08T07:00:00Z"
},
{
"position":
50,
"title":
"Balfour Beatty appoints Nick Rowan as Managing Director of its Regional business in Scotland",
"source":
{
"name":
"Balfour Beatty",
"icon":
"https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.balfourbeatty.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
},
"link":
"https://www.balfourbeatty.com/media-centre/latest/balfour-beatty-appoints-nick-rowan-as-managing-director-of-its-regional-business-in-scotland/",
"thumbnail":
"https://www.balfourbeatty.com/media/oupbpcen/sft_8.jpg",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iK0NnNXlXa3BtUVc1UlZXNUlPR0l0VFJDbUJSakVBeWdLTWdZcFE1WnVJUWc",
"date":
"06/16/2025, 07:00 AM, +0000 UTC",
"iso_date":
"2025-06-16T07:00:00Z"
},
{
"position":
51,
"title":
"We are Balfour Beatty Living Places",
"source":
{
"name":
"Balfour Beatty",
"icon":
"https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.balfourbeatty.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
},
"link":
"https://www.balfourbeatty.com/media-centre/latest/we-are-balfour-beatty-living-places/",
"date":
"10/22/2025, 07:00 AM, +0000 UTC",
"iso_date":
"2025-10-22T07:00:00Z"
},
{
"position":
52,
"title":
"Military families forced to pay out of pocket for problems with privatized base housing",
"source":
{
"name":
"Task & Purpose",
"icon":
"https://encrypted-tbn0.gstatic.com/faviconV2?url=https://taskandpurpose.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL",
"authors":
[
"Jeff Schogol"
]
},
"link":
"https://taskandpurpose.com/news/military-housing-troops-costs/",
"thumbnail":
"https://taskandpurpose.com/wp-content/uploads/2025/11/Balfour-Beatty-Families-pay-out-of-pocket.jpg?quality=85&w=2048",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iK0NnNWpTa2gyTlZGZlVYRTBjelpNVFJDZkF4ampCU2dLTWdZQlFJd0RHd28",
"date":
"11/20/2025, 08:00 AM, +0000 UTC",
"iso_date":
"2025-11-20T08:00:00Z"
},
{
"position":
53,
"title":
"Breaking new ground: How Balfour Beatty is using Copilot to drive productivity at scale",
"source":
{
"name":
"Microsoft UK Stories",
"icon":
"https://encrypted-tbn0.gstatic.com/faviconV2?url=https://ukstories.microsoft.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
},
"link":
"https://ukstories.microsoft.com/features/how-balfour-beatty-is-using-copilot-to-drive-productivity-at-scale/",
"thumbnail":
"https://ukstories.microsoft.com/wp-content/uploads/2025/07/Balfour-Beatty-HS2-optimised-1024x683.jpg",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iK0NnNVJSelExTnpKSU0zaGZVR1ZvVFJERUF4aW1CU2dLTWdhTkFJck5PUVE",
"date":
"07/31/2025, 07:00 AM, +0000 UTC",
"iso_date":
"2025-07-31T07:00:00Z"
},
{
"position":
54,
"title":
"Balfour Beatty’s new CEO starts work",
"source":
{
"name":
"Construction Dive",
"icon":
"https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.constructiondive.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL",
"authors":
[
"Matthew Thibault"
]
},
"link":
"https://www.constructiondive.com/news/balfour-beatty-new-ceo-philip-hoare/759945/",
"thumbnail":
"https://imgproxy.divecdn.com/YjJqP-NrgTIRgeU9tLgs8HdQY2O-kjwRJW4pZfQFecE/g:ce/rs:fill:1200:675:1/Z3M6Ly9kaXZlc2l0ZS1zdG9yYWdlL2RpdmVpbWFnZS9HZXR0eUltYWdlcy0xODU3MzAxNjEwLmpwZw==.webp",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iJ0NnNDVNSEZyWTFKRVlUTjVUMlIzVFJDZkF4ampCU2dLTWdNQmNBUQ",
"date":
"09/11/2025, 07:00 AM, +0000 UTC",
"iso_date":
"2025-09-11T07:00:00Z"
},
{
"position":
55,
"title":
"Why Analysts See Balfour Beatty Differently After Rising Valuation And Lower Risk Assumptions",
"source":
{
"name":
"Yahoo Finance",
"icon":
"https://encrypted-tbn1.gstatic.com/faviconV2?url=https://finance.yahoo.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
},
"link":
"https://finance.yahoo.com/news/why-analysts-see-balfour-beatty-141048164.html",
"thumbnail":
"https://s.yimg.com/ny/api/res/1.2/XRvJu1m2HTftSbMz2HtNBA--/YXBwaWQ9aGlnaGxhbmRlcjt3PTI0MDA7aD0xNjYw/https://media.zenfs.com/en/simply_wall_st__316/c6c462914a42103d4ac688acc76cb016",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iJ0NnNDVPRVJ0TnpCS1ZsaHBhMDFWVFJETUF4aWFCU2dLTWdNSkJ4SQ",
"date":
"12/09/2025, 08:00 AM, +0000 UTC",
"iso_date":
"2025-12-09T08:00:00Z"
},
{
"position":
56,
"title":
"Balfour Beatty appoints Richard Watts as Managing Director of its UK Rail business",
"source":
{
"name":
"Balfour Beatty",
"icon":
"https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.balfourbeatty.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
},
"link":
"https://www.balfourbeatty.com/media-centre/latest/balfour-beatty-appoints-richard-watts-as-managing-director-of-its-uk-rail-business/",
"thumbnail":
"https://www.balfourbeatty.com/media/xxcdz1n0/image5.jpeg",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iK0NnNW5lRmhEZDJOaVFrdDZaWFJKVFJDQUJSamdBeWdLTWdZcFZKaVBwUWc",
"date":
"07/25/2025, 07:00 AM, +0000 UTC",
"iso_date":
"2025-07-25T07:00:00Z"
},
{
"position":
57,
"title":
"Rolls-Royce selects Balfour Beatty as construction partner for major Derby site expansion work",
"source":
{
"name":
"Rolls-Royce plc",
"icon":
"https://encrypted-tbn3.gstatic.com/faviconV2?url=https://www.rolls-royce.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
},
"link":
"https://www.rolls-royce.com/media/press-releases/2025/09-09-2025-rr-selects-balfour-beatty-as-construction-partner-for-major-derby-site-expansion-work.aspx",
"thumbnail":
"https://www.rolls-royce.com/~/media/Images/R/Rolls-Royce/content-images/construction-partner-img-social.jpg",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iL0NnNU5hR290VFRFeU9YWmhhM1JRVFJDc0FoamdBeWdLTWdtUlFwZ0lwaWhVREFJ",
"date":
"09/09/2025, 07:00 AM, +0000 UTC",
"iso_date":
"2025-09-09T07:00:00Z"
},
{
"position":
58,
"title":
"Balfour Beatty Advances Share Buyback, Updates Voting Rights Total",
"source":
{
"name":
"TipRanks",
"icon":
"https://encrypted-tbn2.gstatic.com/faviconV2?url=https://www.tipranks.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
},
"link":
"https://www.tipranks.com/news/company-announcements/balfour-beatty-advances-share-buyback-updates-voting-rights-total-2",
"date":
"01/19/2026, 07:26 AM, +0000 UTC",
"iso_date":
"2026-01-19T07:26:45Z"
},
{
"position":
59,
"title":
"Balfour Beatty Communities Partners with U.S. Army to Deliver New Military Homes at Fort Leonard Wood",
"source":
{
"name":
"Business Wire",
"icon":
"https://encrypted-tbn3.gstatic.com/faviconV2?url=https://www.businesswire.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
},
"link":
"https://www.businesswire.com/news/home/20251212012783/en/Balfour-Beatty-Communities-Partners-with-U.S.-Army-to-Deliver-New-Military-Homes-at-Fort-Leonard-Wood",
"thumbnail":
"https://mms.businesswire.com/media/20251212012783/en/2669138/5/54975473147_dfc916abe5_c.jpg?download=1",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iK0NnNUZSbFpIVkZkTldXUmFPVUp1VFJEVUF4aVBCU2dLTWdZQlFKeGlwQWs",
"date":
"12/12/2025, 08:00 AM, +0000 UTC",
"iso_date":
"2025-12-12T08:00:00Z"
},
{
"position":
60,
"title":
"Balfour Beatty appointed to National Grid’s £8 billion Electricity Transmission Partnership",
"source":
{
"name":
"Balfour Beatty",
"icon":
"https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.balfourbeatty.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
},
"link":
"https://www.balfourbeatty.com/media-centre/latest/balfour-beatty-appointed-to-national-grid-s-8-billion-electricity-transmission-partnership/",
"thumbnail":
"https://www.balfourbeatty.com/media/fd1c1jph/signing_2507016_0005.jpg",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iK0NnNW5ZVUZoZUZOVU9WZEdabTE2VFJERUF4aW1CU2dLTWdZQmtJeUR2QVU",
"date":
"07/31/2025, 07:00 AM, +0000 UTC",
"iso_date":
"2025-07-31T07:00:00Z"
},
{
"position":
61,
"title":
"BALFOUR BEATTY ACCUSED OF ‘CONCEALING HORRIFIC CONDITIONS’ FROM MILITARY RESIDENTS",
"source":
{
"name":
"Keys Weekly Newspapers",
"icon":
"https://encrypted-tbn0.gstatic.com/faviconV2?url=https://keysweekly.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL",
"authors":
[
"Wyatt Samuelson"
]
},
"link":
"https://keysweekly.com/42/balfour-beatty-construction-accused-of-concealing-horrific-conditions-from-military-residents/",
"thumbnail":
"https://keysweekly.com/wp-content/uploads/2025/09/Sigbee-Mold-Furniture-300x225.jpg",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iK0NnNHhWR0ZTYzJZNVFXMUJaMmw2VFJEaEFSaXNBaWdLTWdZTlVwQktKUVk",
"date":
"09/18/2025, 07:00 AM, +0000 UTC",
"iso_date":
"2025-09-18T07:00:00Z"
},
{
"position":
62,
"title":
"Balfour Beatty Appoints Justin Maletic as Business Unit Leader for Central Texas and Arizona Buildings Operations",
"source":
{
"name":
"Business Wire",
"icon":
"https://encrypted-tbn3.gstatic.com/faviconV2?url=https://www.businesswire.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
},
"link":
"https://www.businesswire.com/news/home/20251218858317/en/Balfour-Beatty-Appoints-Justin-Maletic-as-Business-Unit-Leader-for-Central-Texas-and-Arizona-Buildings-Operations",
"thumbnail":
"https://mms.businesswire.com/media/20251218858317/en/2674939/5/Justin-Maletic_webview.jpg?download=1",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iK0NnNDJRMlZpYVVocE5IcDRja1pFVFJDUUJSalVBeWdLTWdhcFZKaU9wUWc",
"date":
"12/18/2025, 08:00 AM, +0000 UTC",
"iso_date":
"2025-12-18T08:00:00Z"
},
{
"position":
63,
"title":
"Balfour Beatty hires risk manager",
"source":
{
"name":
"businessinsurance.com",
"icon":
"https://encrypted-tbn2.gstatic.com/faviconV2?url=https://www.businessinsurance.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL",
"authors":
[
"Claire Wilkinson"
]
},
"link":
"https://www.businessinsurance.com/balfour-beatty-hires-risk-manager/",
"thumbnail":
"https://www.businessinsurance.com/wp-content/uploads/2025/08/William-Motherway-for-web-300x180.jpg",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iK0NnNWhOV0UyWW5Ka1RXSmZSVWxTVFJDMEFSaXNBaWdLTWdhcFZZTE5KUWM",
"date":
"08/18/2025, 07:00 AM, +0000 UTC",
"iso_date":
"2025-08-18T07:00:00Z"
},
{
"position":
64,
"title":
"Subcontractor settles dispute over work on Microsoft's campus expansion",
"source":
{
"name":
"The Business Journals",
"icon":
"https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.bizjournals.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL",
"authors":
[
"Nick Pasion"
]
},
"link":
"https://www.bizjournals.com/seattle/news/2025/09/29/microsoft-sak-builders-skanska-balfour-beatty.html",
"thumbnail":
"https://media.bizj.us/view/img/13011075/microsoft-50th-celebration-copilot-ai-reveal-event-16-campus-construction*900xx5095-2863-0-0.jpg",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iK0NnNVRiR3d6VW5JeFpsTjZURXRqVFJDZkF4ampCU2dLTWdZQmdJcFNNQVk",
"date":
"09/29/2025, 07:00 AM, +0000 UTC",
"iso_date":
"2025-09-29T07:00:00Z"
},
{
"position":
65,
"title":
"Balfour Beatty VINCI makes progress on key HS2 viaducts",
"source":
{
"name":
"Balfour Beatty",
"icon":
"https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.balfourbeatty.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
},
"link":
"https://www.balfourbeatty.com/media-centre/latest/balfour-beatty-vinci-makes-progress-on-key-hs2-viaducts/",
"thumbnail":
"https://www.balfourbeatty.com/media/tqlhzp5w/hs2-xmas.jpg",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iL0NnNWtiMmRrY0hGb1pEaEVRWGxSVFJEQ0FSaURBaWdCTWdrQk1JS0dwS05pMlFB",
"date":
"12/30/2025, 08:00 AM, +0000 UTC",
"iso_date":
"2025-12-30T08:00:00Z"
},
{
"position":
66,
"title":
"Balfour Beatty Communities Adds to Texas Portfolio",
"source":
{
"name":
"Multi-Housing News",
"icon":
"https://encrypted-tbn1.gstatic.com/faviconV2?url=https://www.multihousingnews.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL",
"authors":
[
"Gail Kalinoski"
]
},
"link":
"https://www.multihousingnews.com/balfour-beatty-communities-adds-300-units-to-texas-portfolio/",
"thumbnail":
"https://www.multihousingnews.com/wp-content/uploads/sites/57/2025/05/Screenshot-403-1.png",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iJ0NnNWZhakpCUVZsa09HNHlXbTVLVFJEbkF4ajFCQ2dLTWdNRm9CWQ",
"date":
"05/22/2025, 07:00 AM, +0000 UTC",
"iso_date":
"2025-05-22T07:00:00Z"
},
{
"position":
67,
"title":
"Balfour Beatty breaks ground on $260M DC apartment building",
"source":
{
"name":
"Construction Dive",
"icon":
"https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.constructiondive.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL",
"authors":
[
"Matthew Thibault"
]
},
"link":
"https://www.constructiondive.com/news/balfour-beatty-dc-apartment-portals-1301/752527/",
"thumbnail":
"https://imgproxy.divecdn.com/FyWgxf2lsZ12Xhxvx94NRlpESdILqO6nnry3z-CABLI/g:ce/rs:fill:1200:675:1/Z3M6Ly9kaXZlc2l0ZS1zdG9yYWdlL2RpdmVpbWFnZS9DMi5qcGc=.webp",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iJ0NnNUpVMDQxTlROWVdYSkVUMEZNVFJDZkF4ampCU2dLTWdNQllBUQ",
"date":
"07/09/2025, 07:00 AM, +0000 UTC",
"iso_date":
"2025-07-09T07:00:00Z"
},
{
"position":
68,
"title":
"Balfour Beatty nabs $889M Texas highway job",
"source":
{
"name":
"Construction Dive",
"icon":
"https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.constructiondive.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL",
"authors":
[
"Matthew Thibault"
]
},
"link":
"https://www.constructiondive.com/news/balfour-beatty-texas-interstate-30/746465/",
"thumbnail":
"https://imgproxy.divecdn.com/tzHJCClMMig5spmF_IRCgmksUEnlPlgDTOKr9CvhFcA/g:ce/rs:fill:1200:675:1/Z3M6Ly9kaXZlc2l0ZS1zdG9yYWdlL2RpdmVpbWFnZS9HZXR0eUltYWdlcy01Mzk2Nzg2MjQuanBn.webp",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iNkNnNXJiemx0V0dnM1FXWTJhVlYxVFJDZkF4ampCU2dLTWc0QkFJSUZtS2hxUVd2a0phcjJIZw",
"date":
"04/28/2025, 07:00 AM, +0000 UTC",
"iso_date":
"2025-04-28T07:00:00Z"
},
{
"position":
69,
"title":
"Key West Families Sue Balfour Beatty, Allege Squalid, Toxic Housing Conditions",
"source":
{
"name":
"MOAA",
"icon":
"https://encrypted-tbn1.gstatic.com/faviconV2?url=https://www.moaa.org&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
},
"link":
"https://www.moaa.org/content/publications-and-media/news-articles/2025-news-articles/spouse-and-family/key-west-families-sue-balfour-beatty,-allege-squalid,-toxic-housing-conditions/",
"thumbnail":
"https://www.moaa.org/contentassets/32112c732eac481cbbd33bf1ffe84f0b/key-west-gate-h.jpg",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iK0NnNVVRbFF6U1ZoalVUQlRPR05EVFJDMkFSaVZBaWdCTWdZRm9KS211QVk",
"date":
"03/31/2025, 07:00 AM, +0000 UTC",
"iso_date":
"2025-03-31T07:00:00Z"
},
{
"position":
70,
"title":
"Balfour Beatty first-half revenue grows via UK Construction boom",
"source":
{
"name":
"Yahoo Finance",
"icon":
"https://encrypted-tbn1.gstatic.com/faviconV2?url=https://finance.yahoo.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
},
"link":
"https://finance.yahoo.com/news/balfour-beatty-first-half-revenue-093947693.html",
"thumbnail":
"https://s.yimg.com/ny/api/res/1.2/S7QnTnsuPc1Qo68f8_eJZw--/YXBwaWQ9aGlnaGxhbmRlcjt3PTEyMDA7aD02NzU-/https://media.zenfs.com/en/world_construction_network_914/d5a448fef5161942c2cb93f64bad6eed",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iK0NnNVFWRkJ6YTBoRlgzWXlTV1ZmVFJDZkF4ampCU2dLTWdZTjVZekh4UVE",
"date":
"08/14/2025, 07:00 AM, +0000 UTC",
"iso_date":
"2025-08-14T07:00:00Z"
},
{
"position":
71,
"title":
"Balfour Beatty signs Programme Alliance Agreement to deliver Sizewell C civil works",
"source":
{
"name":
"Balfour Beatty",
"icon":
"https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.balfourbeatty.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
},
"link":
"https://www.balfourbeatty.com/media-centre/latest/balfour-beatty-signs-programme-alliance-agreement-to-deliver-sizewell-c-civil-works/",
"thumbnail":
"https://www.balfourbeatty.com/media/vmmptmlv/detail-aerial-02_001-200130.jpg",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iK0NnNDBTMk40V0RWUmRHczJkbGhtVFJEREF4aW5CU2dLTWdZSlFJcFBzUVk",
"date":
"06/30/2025, 07:00 AM, +0000 UTC",
"iso_date":
"2025-06-30T07:00:00Z"
},
{
"position":
72,
"title":
"Balfour Beatty 2025 AGM Trading Update",
"source":
{
"name":
"Balfour Beatty",
"icon":
"https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.balfourbeatty.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
},
"link":
"https://www.balfourbeatty.com/media-centre/latest/balfour-beatty-2025-agm-trading-update/",
"thumbnail":
"https://www.balfourbeatty.com/media/ftapiozr/1200x630-trading-update_1.jpg",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iK0NnNVBZVE4zWWw5SVgzZExhalZzVFJDUkF4ajhCU2dLTWdhZGc1QnR0UVk",
"date":
"05/08/2025, 07:00 AM, +0000 UTC",
"iso_date":
"2025-05-08T07:00:00Z"
},
{
"position":
73,
"title":
"Balfour Beatty Picked for $889M I-30 Rebuild in Dallas",
"source":
{
"name":
"Engineering News-Record",
"icon":
"https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.enr.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL",
"authors":
[
"Derek Lacey"
]
},
"link":
"https://www.enr.com/articles/60649-balfour-beatty-picked-for-889m-i-30-rebuild-in-dallas",
"thumbnail":
"https://www.enr.com/ext/resources/2025/04/24/IH30-Dal_020.webp?t=1745646460",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iNkNnNU1MV2w1UkRKclMwcG9XRlF0VFJDZkF4ampCU2dLTWc0QklJYkVNaVVtdDdpa2tycDJLZw",
"date":
"04/24/2025, 07:00 AM, +0000 UTC",
"iso_date":
"2025-04-24T07:00:00Z"
},
{
"position":
74,
"title":
"Balfour Beatty Appoints William Motherway as Vice President of Risk for U.S. Infrastructure Operations",
"source":
{
"name":
"Business Wire",
"icon":
"https://encrypted-tbn3.gstatic.com/faviconV2?url=https://www.businesswire.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
},
"link":
"https://www.businesswire.com/news/home/20250818746791/en/Balfour-Beatty-Appoints-William-Motherway-as-Vice-President-of-Risk-for-U.S.-Infrastructure-Operations",
"thumbnail":
"https://mms.businesswire.com/media/20250818746791/en/2555965/5/William_Motherway_Headshot_II.jpg?download=1",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iK0NnNUhXRGN4ZDBFMlZsSXdRMnRoVFJEUUF4aVZCU2dLTWdhcEZhRHRsUW8",
"date":
"08/18/2025, 07:00 AM, +0000 UTC",
"iso_date":
"2025-08-18T07:00:00Z"
},
{
"position":
75,
"title":
"Balfour Beatty appointed as exclusive contractor for Rolls-Royce nuclear project",
"source":
{
"name":
"Yahoo Finance",
"icon":
"https://encrypted-tbn1.gstatic.com/faviconV2?url=https://finance.yahoo.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
},
"link":
"https://finance.yahoo.com/news/balfour-beatty-appointed-exclusive-contractor-092236436.html",
"thumbnail":
"https://s.yimg.com/ny/api/res/1.2/S_EFw3Rv2KFL6of0xcYq9g--/YXBwaWQ9aGlnaGxhbmRlcjt3PTI0MDA7aD0xMzUw/https://media.zenfs.com/en/world_construction_network_914/1d759a44c1aad60befc781156ce00ad5",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iI0NnNHdZVkpIU0VJMFpXWndVREpPVFJDZkF4ampCU2dLTWdB",
"date":
"09/10/2025, 07:00 AM, +0000 UTC",
"iso_date":
"2025-09-10T07:00:00Z"
},
{
"position":
76,
"title":
"Balfour Beatty features on BBC News discussing the sustainability credentials of HVO fuel",
"source":
{
"name":
"Balfour Beatty",
"icon":
"https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.balfourbeatty.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
},
"link":
"https://www.balfourbeatty.com/media-centre/latest/balfour-beatty-features-on-bbc-news-discussing-the-sustainability-credentials-of-hvo-fuel/",
"thumbnail":
"https://www.balfourbeatty.com/media/byfjtltk/jo-gilroy.png",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iK0NnNXRMVmczVVdabVNIUlNNR3BtVFJEMkF4ampCQ2dLTWdZdGRaS3VMUWM",
"date":
"04/09/2025, 07:00 AM, +0000 UTC",
"iso_date":
"2025-04-09T07:00:00Z"
},
{
"position":
77,
"title":
"UK's Balfour Beatty secures $889 million Texas highway contract",
"source":
{
"name":
"Reuters",
"icon":
"https://encrypted-tbn2.gstatic.com/faviconV2?url=https://www.reuters.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
},
"link":
"https://www.reuters.com/business/uks-balfour-beatty-gets-889-million-texas-highway-contract-2025-04-24/",
"thumbnail":
"https://www.reuters.com/resizer/v2/XRTSVK4KMZJZXOAOZXINX5EZ24.jpg?auth=68c1b887256f00f1cfac0ed69c52cde50bafadc76b32e37a7c4386a4f966c024&height=1500&width=1200&quality=80&smart=true",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iK0NnNXNjRXBaVEVGU1ZqTlVaMWN3VFJEckJCanZBeWdLTWdhQlVZREk5UUE",
"date":
"04/24/2025, 07:00 AM, +0000 UTC",
"iso_date":
"2025-04-24T07:00:00Z"
},
{
"position":
78,
"title":
"Senior Leadership Change at Balfour Beatty Communities",
"source":
{
"name":
"Business Wire",
"icon":
"https://encrypted-tbn3.gstatic.com/faviconV2?url=https://www.businesswire.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
},
"link":
"https://www.businesswire.com/news/home/20250710356802/en/Senior-Leadership-Change-at-Balfour-Beatty-Communities",
"thumbnail":
"https://mms.businesswire.com/media/20250710356802/en/503526/22/BBCommunites_RGB_5.5mm-01.jpg",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iK0NnNXZRVmgyUmtKc1VXc3hja1ZIVFJDSEF4aVBCaWdLTWdZZGxKU0tOUWM",
"date":
"07/10/2025, 07:00 AM, +0000 UTC",
"iso_date":
"2025-07-10T07:00:00Z"
},
{
"position":
79,
"title":
"Balfour Beatty Wins $1.14B Deal To Build Carbon Capture Power Plant",
"source":
{
"name":
"Carbon Herald",
"icon":
"https://encrypted-tbn2.gstatic.com/faviconV2?url=https://carbonherald.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL",
"authors":
[
"Violet George"
]
},
"link":
"https://carbonherald.com/balfour-beatty-wins-1-14b-deal-to-build-carbon-capture-power-plant/",
"thumbnail":
"https://carbonherald.com/wp-content/uploads/2025/07/Balfour-Beatty-800x500.png",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iI0NnNUpPVUZNUzA5MmRXWkdjUzFVVFJDMkF4aTlCU2dLTWdB",
"date":
"07/01/2025, 07:00 AM, +0000 UTC",
"iso_date":
"2025-07-01T07:00:00Z"
},
{
"position":
80,
"title":
"Balfour Beatty breaks ground on US$260m tower in Washington D.C.",
"source":
{
"name":
"Construction Briefing",
"icon":
"https://encrypted-tbn2.gstatic.com/faviconV2?url=https://www.constructionbriefing.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL",
"authors":
[
"Mitchell Bradley Keller"
]
},
"link":
"https://www.constructionbriefing.com/news/balfour-beatty-breaks-ground-on-us260m-apartment-tower-in-washington-dc/8081321.article",
"thumbnail":
"https://www.constructionbriefing.com/Images/270xany/20250714-180737-110725Washington1301.png",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iI0NnNXZOVEkxVWtoRlgwbzFhRTVtVFJDYkFSaU9BaWdCTWdB",
"date":
"07/15/2025, 07:00 AM, +0000 UTC",
"iso_date":
"2025-07-15T07:00:00Z"
},
{
"position":
81,
"title":
"Balfour Beatty Works On $242M U.S. 70 Project",
"source":
{
"name":
"Construction Equipment Guide",
"icon":
"https://encrypted-tbn2.gstatic.com/faviconV2?url=https://www.constructionequipmentguide.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL",
"authors":
[
"Cindy Riley"
]
},
"link":
"https://www.constructionequipmentguide.com/balfour-beatty-works-on-242m-us-70-project/69799",
"thumbnail":
"https://dmt55mxnkgbz2.cloudfront.net/1205x0_s3-69799-S-146_25-CR-1.jpg",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iK0NnNUpjRXBtUlZaUVRrOXJkMVpCVFJDUkF4ajhCU2dLTWdhaEJJZ05qZ1E",
"date":
"12/03/2025, 08:00 AM, +0000 UTC",
"iso_date":
"2025-12-03T08:00:00Z"
},
{
"position":
82,
"title":
"Balfour Beatty Communities Partners with U.S. Army to Deliver New Military Homes at Fort Leonard Wood",
"source":
{
"name":
"Financial Times",
"icon":
"https://encrypted-tbn2.gstatic.com/faviconV2?url=https://markets.ft.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
},
"link":
"https://markets.ft.com/data/announce/detail?dockey=600-202512121020BIZWIRE_USPRX____20251212_BW012783-1",
"thumbnail":
"https://mms.businesswire.com/media/20251212012783/en/2669138/4/54975473147_dfc916abe5_c.jpg",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iK0NnNXBkakk0VFhsWVpXUTJiR3gxVFJEWEFoamdBeWdLTWdZQlFKeGlKQWs",
"date":
"12/12/2025, 08:00 AM, +0000 UTC",
"iso_date":
"2025-12-12T08:00:00Z"
},
{
"position":
83,
"title":
"Balfour Beatty sells OFTO stakes to Equitix",
"source":
{
"name":
"reNews",
"icon":
"https://encrypted-tbn1.gstatic.com/faviconV2?url=https://renews.biz&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
},
"link":
"https://renews.biz/106226/balfour-beatty-sells-ofto-stakes-to-equitix/",
"thumbnail":
"https://renews.biz/media/15763/gwynt-y-mor-offshore-wind-farm-credit-rwe1.jpg?mode=crop&width=770&heightratio=0.6103896103896103896103896104&slimmage=true",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iJ0NnNUhkVWh3YVZodE5IaDNiRTB5VFJDeEF4akZCU2dLTWdPQk9SSQ",
"date":
"01/06/2026, 08:00 AM, +0000 UTC",
"iso_date":
"2026-01-06T08:00:00Z"
},
{
"position":
84,
"title":
"How Balfour Beatty Boosted Productivity With Microsoft AI",
"source":
{
"name":
"Technology Magazine",
"icon":
"https://encrypted-tbn1.gstatic.com/faviconV2?url=https://technologymagazine.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL",
"authors":
[
"Marcus Law"
]
},
"link":
"https://technologymagazine.com/news/how-balfour-beatty-boosted-productivity-with-microsoft-ai",
"thumbnail":
"https://assets.bizclikmedia.net/144/e1a090f3b70661250c3683444cf95d83:f2a82efe7b8f5406fc364a948877634b/balfour-beatty.png",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iL0NnNU1MVUY0WW1GSWJVWlBWM0ZxVFJETEFSaVFBU2dCTWdrQllJcU9LS2k0MGdB",
"date":
"07/31/2025, 07:00 AM, +0000 UTC",
"iso_date":
"2025-07-31T07:00:00Z"
},
{
"position":
85,
"title":
"UK's Balfour Beatty wins $1.14 billion contract for new gas power plant",
"source":
{
"name":
"Reuters",
"icon":
"https://encrypted-tbn2.gstatic.com/faviconV2?url=https://www.reuters.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL",
"authors":
[
"Yamini Kalia",
"Mrigank Dhaniwala"
]
},
"link":
"https://www.reuters.com/business/energy/uks-balfour-beatty-wins-114-billion-contract-new-gas-power-plant-2025-06-26/",
"thumbnail":
"https://www.reuters.com/resizer/v2/XRTSVK4KMZJZXOAOZXINX5EZ24.jpg?auth=68c1b887256f00f1cfac0ed69c52cde50bafadc76b32e37a7c4386a4f966c024&width=480&quality=80",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iK0NnNW1kRkl0WlcwNVJtSlZNRVJ3VFJEaUFoamdBeWdLTWdZUjRvQUg4Z0E",
"date":
"06/26/2025, 07:00 AM, +0000 UTC",
"iso_date":
"2025-06-26T07:00:00Z"
},
{
"position":
86,
"title":
"Balfour Beatty Picks AtkinsRéalis Exec To Succeed Leo Quinn as CEO",
"source":
{
"name":
"Engineering News-Record",
"icon":
"https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.enr.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL",
"authors":
[
"Emell Derra Adolphus"
]
},
"link":
"https://www.enr.com/articles/60475-balfour-beatty-picks-atkinsrealis-exec-to-succeed-leo-quinn-as-ceo",
"thumbnail":
"https://www.enr.com/ext/resources/2025/03/20/Philip-Hoare-BalfourBeatty.webp?t=1742859830",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iK0NnNUJlV2RITFZSZldIZGhURFp3VFJDeEF4akZCU2dLTWdhcFZaTE5KUWc",
"date":
"03/21/2025, 07:00 AM, +0000 UTC",
"iso_date":
"2025-03-21T07:00:00Z"
},
{
"position":
87,
"title":
"People News: Metrolink, Balfour Beatty",
"source":
{
"name":
"Railway Age",
"icon":
"https://encrypted-tbn2.gstatic.com/faviconV2?url=https://www.railwayage.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL",
"authors":
[
"Carolina Worrell"
]
},
"link":
"https://www.railwayage.com/news/people-news-metrolink-balfour-beatty/",
"thumbnail":
"https://www.railwayage.com/wp-content/uploads/2025/08/download-3.jpeg",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iL0NnNWtTMlJ2UldOUlNrTllkbEY0VFJDbEF4allCU2dLTWdtSk1wd1VtV3E1U0FJ",
"date":
"08/19/2025, 07:00 AM, +0000 UTC",
"iso_date":
"2025-08-19T07:00:00Z"
},
{
"position":
88,
"title":
"Balfour Beatty's Strategic Design Partnership features in Design & Build UK",
"source":
{
"name":
"Balfour Beatty",
"icon":
"https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.balfourbeatty.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
},
"link":
"https://www.balfourbeatty.com/media-centre/latest/balfour-beattys-strategic-design-partnership-features-in-design-build-uk/",
"thumbnail":
"https://www.balfourbeatty.com/media/bkmcpzhb/sdp.png",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iL0NnNVhNR3MzTkd3MGJFZFdRVzB6VFJDb0F4anJCQ2dLTWdrWlFJUm9vbWdldGdB",
"date":
"03/13/2025, 07:00 AM, +0000 UTC",
"iso_date":
"2025-03-13T07:00:00Z"
},
{
"position":
89,
"title":
"News | Balfour Beatty offloads 536-bed Glasgow student accommodation block",
"source":
{
"name":
"CoStar",
"icon":
"https://encrypted-tbn3.gstatic.com/faviconV2?url=https://www.costar.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL",
"authors":
[
"Luke Haynes"
]
},
"link":
"https://www.costar.com/article/372661448/balfour-beatty-offloads-536-bed-glasgow-student-accommodation-block",
"thumbnail":
"https://www.costar.com/_next/image?url=https%3A%2F%2Fcostar.brightspotcdn.com%2Fdims4%2Fdefault%2F21a2313%2F2147483647%2Fstrip%2Ftrue%2Fcrop%2F2048x1366%2B0%2B0%2Fresize%2F2048x1366!%2Fquality%2F100%2F%3Furl%3Dhttp%253A%252F%252Fcostar-brightspot.s3.us-east-1.amazonaws.com%252F5d%252F5d%252Fb7a523b74b289506c2fd9dbd098c%252Ffoundry-courtyard-glasgow.%2520%2528CoStar%2529.jpg&w=3840&q=75",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iK0NnNXdkRGRTZVZoM1ZuSlBObTAzVFJERUF4aW1CU2dLTWdZQmdJSmxPUWM",
"date":
"12/23/2025, 08:00 AM, +0000 UTC",
"iso_date":
"2025-12-23T08:00:00Z"
},
{
"position":
90,
"title":
"Balfour Beatty kicks off $385M Miami hotel project",
"source":
{
"name":
"Construction Dive",
"icon":
"https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.constructiondive.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL",
"authors":
[
"Matthew Thibault"
]
},
"link":
"https://www.constructiondive.com/news/balfour-beatty-miami-hotel-grand-hyatt/746871/",
"thumbnail":
"https://imgproxy.divecdn.com/iQtaPRAiyJpnIdhd2BZWFLGw62jmmY2eWHcR2pMM4o4/g:ce/rs:fill:1200:675:1/Z3M6Ly9kaXZlc2l0ZS1zdG9yYWdlL2RpdmVpbWFnZS9HcmFuZF9IeWF0dF9NaWFtaV9CZWFjaDEuanBn.webp",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iK0NnNUhZV1ZmVVZORGJEZElVbkpPVFJDZkF4ampCU2dLTWdZQk1JQXNVUVE",
"date":
"05/12/2025, 07:00 AM, +0000 UTC",
"iso_date":
"2025-05-12T07:00:00Z"
},
{
"position":
91,
"title":
"Balfour Beatty (LON:BBY) Share Price Passes Above 200 Day Moving Average - Should You Sell?",
"source":
{
"name":
"MarketBeat",
"icon":
"https://encrypted-tbn3.gstatic.com/faviconV2?url=https://www.marketbeat.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
},
"link":
"https://www.marketbeat.com/instant-alerts/balfour-beatty-lonbby-share-price-passes-above-200-day-moving-average-should-you-sell-2025-12-31/",
"date":
"12/31/2025, 08:00 AM, +0000 UTC",
"iso_date":
"2025-12-31T08:00:00Z"
},
{
"position":
92,
"title":
"Balfour Beatty Prequalified for Metrolink’s SCORE Program",
"source":
{
"name":
"Railway Track and Structures",
"icon":
"https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.rtands.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL",
"authors":
[
"Jennifer McLawhorn"
]
},
"link":
"https://www.rtands.com/track-construction/balfour-beatty-prequalified-for-metrolinks-score-program/",
"thumbnail":
"https://www.rtands.com/wp-content/uploads/2025/07/San-Bernardino-755x402.jpeg",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iI0NnNUpTbFpITTA1QmFWUlBkamRuVFJDU0F4anpCU2dLTWdB",
"date":
"07/28/2025, 07:00 AM, +0000 UTC",
"iso_date":
"2025-07-28T07:00:00Z"
},
{
"position":
93,
"title":
"Balfour Beatty appointed as principal contractor for New Deer Substation extension",
"source":
{
"name":
"Balfour Beatty",
"icon":
"https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.balfourbeatty.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
},
"link":
"https://www.balfourbeatty.com/media-centre/latest/balfour-beatty-appointed-as-principal-contractor-for-new-deer-substation-extension/",
"thumbnail":
"https://www.balfourbeatty.com/media/wdyhot1f/newdeerextensionsite.jpg",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iL0NnNVpXbGhDVkhGQlozSnpNblpPVFJDZkF4ampCU2dLTWdrVk1JcFdSS1NDS1FJ",
"date":
"09/25/2025, 07:00 AM, +0000 UTC",
"iso_date":
"2025-09-25T07:00:00Z"
},
{
"position":
94,
"title":
"Balfour Beatty Designates Live Traffic as Fifth Fatal Risk in Construction Safety Initiative",
"source":
{
"name":
"For Construction Pros",
"icon":
"https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.forconstructionpros.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
},
"link":
"https://www.forconstructionpros.com/business/construction-safety/detectable-warnings/article/22939951/balfour-beatty-balfour-beatty-designates-live-traffic-as-fifth-fatal-risk-in-construction-safety-initiative",
"thumbnail":
"https://img.forconstructionpros.com/mindful/acbm/workspaces/default/uploads/2025/04/dina-row-of-bright-orange-traffic-cones.H8UB2bzIVA.jpg?auto=format%2Ccompress&q=70&w=400",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iI0NnNXhNM1poY25kS1FrMW9Ra0ZvVFJDTEFoaVFBeWdLTWdB",
"date":
"05/06/2025, 07:00 AM, +0000 UTC",
"iso_date":
"2025-05-06T07:00:00Z"
},
{
"position":
95,
"title":
"Balfour Beatty 2024 Full Year Results",
"source":
{
"name":
"Balfour Beatty",
"icon":
"https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.balfourbeatty.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
},
"link":
"https://www.balfourbeatty.com/media-centre/latest/balfour-beatty-2024-full-year-results/",
"thumbnail":
"https://www.balfourbeatty.com/media/ax0dmps2/press-release.webp",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iK0NnNUJlRTF0Y25waGJXRTVlRFY0VFJESUFSamVBaWdLTWdhZFE0eHRKUVk",
"date":
"03/12/2025, 07:00 AM, +0000 UTC",
"iso_date":
"2025-03-12T07:00:00Z"
},
{
"position":
96,
"title":
"Balfour Beatty features in Construction News discussing internal mobility in the energy sector",
"source":
{
"name":
"Balfour Beatty",
"icon":
"https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.balfourbeatty.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL"
},
"link":
"https://www.balfourbeatty.com/media-centre/latest/balfour-beatty-features-in-construction-news-discussing-how-internal-mobility-can-power-the-uks-energy-transition/",
"thumbnail":
"https://www.balfourbeatty.com/media/xt2kjt1g/stephen-tomkins.jpg",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iK0NnNWZOV0ZyYUdoSk9YZzBVMUJ4VFJERUF4aW1CU2dLTWdZbE5wanRvUWc",
"date":
"05/09/2025, 07:00 AM, +0000 UTC",
"iso_date":
"2025-05-09T07:00:00Z"
},
{
"position":
97,
"title":
"Balfour Beatty wins £833m Teesside CCS construction contract",
"source":
{
"name":
"gasworld",
"icon":
"https://encrypted-tbn1.gstatic.com/faviconV2?url=https://www.gasworld.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL",
"authors":
[
"Dominic Ellis"
]
},
"link":
"https://www.gasworld.com/story/balfour-beatty-wins-833m-teesside-ccs-construction-contract/2160892.article/",
"thumbnail":
"https://www.gasworld.com/wp-content/files/2025/06/Balfour-lead.png",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iK0NnNU1WMk5RUWprMU0yMXhhRzUyVFJDQUF4aWZCaWdLTWdZSmNJZ3JzUVE",
"date":
"06/27/2025, 07:00 AM, +0000 UTC",
"iso_date":
"2025-06-27T07:00:00Z"
},
{
"position":
98,
"title":
"The Fatal 5? Balfour Beatty highlights risk of live traffic.",
"source":
{
"name":
"Construction Dive",
"icon":
"https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.constructiondive.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL",
"authors":
[
"Zachary Phillips"
]
},
"link":
"https://www.constructiondive.com/news/balfour-beatty-safety-work-zone-highway/747538/",
"thumbnail":
"https://imgproxy.divecdn.com/SBxrB3vSpaIHvo6kHHVABDVn_XzrYLddq2KuPRn_dZk/g:ce/rs:fill:1200:675:1/Z3M6Ly9kaXZlc2l0ZS1zdG9yYWdlL2RpdmVpbWFnZS9HZXR0eUltYWdlcy0xMTU4NDc1MDc2LmpwZw==.webp",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iL0NnNWpkVXB4YlV4MVFTMXNVbGx5VFJDZkF4ampCU2dLTWdrQlFJcVZKS2lTRVFF",
"date":
"05/08/2025, 07:00 AM, +0000 UTC",
"iso_date":
"2025-05-08T07:00:00Z"
},
{
"position":
99,
"title":
"Balfour Beatty Mobilizes for 1M-sq-ft Miami Beach Hotel",
"source":
{
"name":
"Engineering News-Record",
"icon":
"https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.enr.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL",
"authors":
[
"Jim Parsons"
]
},
"link":
"https://www.enr.com/articles/60663-balfour-beatty-mobilizes-for-1m-sq-ft-miami-beach-hotel",
"thumbnail":
"https://www.enr.com/ext/resources/2025/04/29/Balfour-Beatty-Miami-Hyatt_Resized.webp?t=1745958776",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iK0NnNVVNRmhPYTFCQ00wRjVXbmRvVFJDdkFSaWZBaWdCTWdZQmtJVG5UUU0",
"date":
"04/29/2025, 07:00 AM, +0000 UTC",
"iso_date":
"2025-04-29T07:00:00Z"
},
{
"position":
100,
"title":
"US to keep monitors in place for TD Bank, Balfour Beatty, people familiar say",
"source":
{
"name":
"Reuters",
"icon":
"https://encrypted-tbn2.gstatic.com/faviconV2?url=https://www.reuters.com&client=NEWS_360&size=96&type=FAVICON&fallback_opts=TYPE,SIZE,URL",
"authors":
[
"Sarah Lynch",
"Chris Prentice"
]
},
"link":
"https://www.reuters.com/sustainability/boards-policy-regulation/us-keep-monitors-place-td-bank-balfour-beatty-people-familiar-say-2025-04-10/",
"thumbnail":
"https://www.reuters.com/resizer/v2/AI6VZ2L5UFNNFNZPZ5NGWAWOVM.jpg?auth=73f9fd55d956edb189daa80dff6f6b677fbbf02cab78ea0cf7311d6d2f6af1f5&width=1200&quality=80",
"thumbnail_small":
"https://news.google.com/api/attachments/CC8iK0NnNWtTMHBwV0c5amVFVmxUMEpNVFJERUF4aW1CU2dLTWdZdFZZcXZvUWM",
"date":
"04/10/2025, 07:00 AM, +0000 UTC",
"iso_date":
"2025-04-10T07:00:00Z"
}
],
"menu_links":
[
{
"title":
"U.S.",
"topic_token":
"CAAqIggKIhxDQkFTRHdvSkwyMHZNRGxqTjNjd0VnSmxiaWdBUAE",
"serpapi_link":
"https://serpapi.com/search.json?engine=google_news&topic_token=CAAqIggKIhxDQkFTRHdvSkwyMHZNRGxqTjNjd0VnSmxiaWdBUAE"
},
{
"title":
"World",
"topic_token":
"CAAqJggKIiBDQkFTRWdvSUwyMHZNRGx1YlY4U0FtVnVHZ0pWVXlnQVAB",
"serpapi_link":
"https://serpapi.com/search.json?engine=google_news&topic_token=CAAqJggKIiBDQkFTRWdvSUwyMHZNRGx1YlY4U0FtVnVHZ0pWVXlnQVAB"
},
{
"title":
"Your local news",
"topic_token":
"CAAqHAgKIhZDQklTQ2pvSWJHOWpZV3hmZGpJb0FBUAE",
"serpapi_link":
"https://serpapi.com/search.json?engine=google_news&topic_token=CAAqHAgKIhZDQklTQ2pvSWJHOWpZV3hmZGpJb0FBUAE"
},
{
"title":
"Business",
"topic_token":
"CAAqJggKIiBDQkFTRWdvSUwyMHZNRGx6TVdZU0FtVnVHZ0pWVXlnQVAB",
"serpapi_link":
"https://serpapi.com/search.json?engine=google_news&topic_token=CAAqJggKIiBDQkFTRWdvSUwyMHZNRGx6TVdZU0FtVnVHZ0pWVXlnQVAB"
},
{
"title":
"Technology",
"topic_token":
"CAAqJggKIiBDQkFTRWdvSUwyMHZNRGRqTVhZU0FtVnVHZ0pWVXlnQVAB",
"serpapi_link":
"https://serpapi.com/search.json?engine=google_news&topic_token=CAAqJggKIiBDQkFTRWdvSUwyMHZNRGRqTVhZU0FtVnVHZ0pWVXlnQVAB"
},
{
"title":
"Entertainment",
"topic_token":
"CAAqJggKIiBDQkFTRWdvSUwyMHZNREpxYW5RU0FtVnVHZ0pWVXlnQVAB",
"serpapi_link":
"https://serpapi.com/search.json?engine=google_news&topic_token=CAAqJggKIiBDQkFTRWdvSUwyMHZNREpxYW5RU0FtVnVHZ0pWVXlnQVAB"
},
{
"title":
"Sports",
"topic_token":
"CAAqJggKIiBDQkFTRWdvSUwyMHZNRFp1ZEdvU0FtVnVHZ0pWVXlnQVAB",
"serpapi_link":
"https://serpapi.com/search.json?engine=google_news&topic_token=CAAqJggKIiBDQkFTRWdvSUwyMHZNRFp1ZEdvU0FtVnVHZ0pWVXlnQVAB"
},
{
"title":
"Science",
"topic_token":
"CAAqJggKIiBDQkFTRWdvSUwyMHZNRFp0Y1RjU0FtVnVHZ0pWVXlnQVAB",
"serpapi_link":
"https://serpapi.com/search.json?engine=google_news&topic_token=CAAqJggKIiBDQkFTRWdvSUwyMHZNRFp0Y1RjU0FtVnVHZ0pWVXlnQVAB"
},
{
"title":
"Health",
"topic_token":
"CAAqIQgKIhtDQkFTRGdvSUwyMHZNR3QwTlRFU0FtVnVLQUFQAQ",
"serpapi_link":
"https://serpapi.com/search.json?engine=google_news&topic_token=CAAqIQgKIhtDQkFTRGdvSUwyMHZNR3QwTlRFU0FtVnVLQUFQAQ"
}
],
"related_topics":
[
{
"topic_token":
"CAAqIggKIhxDQkFTRHdvSkwyMHZNRGg1YzJ4eEVnSmxiaWdBUAE",
"serpapi_link":
"https://serpapi.com/search.json?engine=google_news&topic_token=CAAqIggKIhxDQkFTRHdvSkwyMHZNRGg1YzJ4eEVnSmxiaWdBUAE",
"title":
"Balfour Beatty"
},
{
"topic_token":
"CAAqJAgKIh5DQkFTRUFvS0wyMHZNR2hvZEdZNE54SUNaVzRvQUFQAQ",
"serpapi_link":
"https://serpapi.com/search.json?engine=google_news&topic_token=CAAqJAgKIh5DQkFTRUFvS0wyMHZNR2hvZEdZNE54SUNaVzRvQUFQAQ",
"title":
"Balfour Beatty Construction"
},
{
"topic_token":
"CAAqKAgKIiJDQkFTRXdvTkwyY3ZNVEZtTURCNk0yTnFOaElDWlc0b0FBUAE",
"serpapi_link":
"https://serpapi.com/search.json?engine=google_news&topic_token=CAAqKAgKIiJDQkFTRXdvTkwyY3ZNVEZtTURCNk0yTnFOaElDWlc0b0FBUAE",
"title":
"Dutco Balfour Beatty LLC"
},
{
"topic_token":
"CAAqKAgKIiJDQkFTRXdvTkwyY3ZNVEZtZVRGNk1IWmZjUklDWlc0b0FBUAE",
"serpapi_link":
"https://serpapi.com/search.json?engine=google_news&topic_token=CAAqKAgKIiJDQkFTRXdvTkwyY3ZNVEZtZVRGNk1IWmZjUklDWlc0b0FBUAE",
"title":
"Balfour Beatty VINCI"
},
{
"topic_token":
"CAAqKAgKIiJDQkFTRXdvTkwyY3ZNVEZuT1cxdU1Xd3hkeElDWlc0b0FBUAE",
"serpapi_link":
"https://serpapi.com/search.json?engine=google_news&topic_token=CAAqKAgKIiJDQkFTRXdvTkwyY3ZNVEZuT1cxdU1Xd3hkeElDWlc0b0FBUAE",
"title":
"Balfour Beatty Group Limited"
},
{
"topic_token":
"CAAqKAgKIiJDQkFTRXdvTkwyY3ZNVEZuT1c0eFpIbHNPQklDWlc0b0FBUAE",
"serpapi_link":
"https://serpapi.com/search.json?engine=google_news&topic_token=CAAqKAgKIiJDQkFTRXdvTkwyY3ZNVEZuT1c0eFpIbHNPQklDWlc0b0FBUAE",
"title":
"Balfour Beatty Pension Fund"
},
{
"topic_token":
"CAAqJQgKIh9DQkFTRVFvTEwyY3ZNVEl5WTNvd1l6TVNBbVZ1S0FBUAE",
"serpapi_link":
"https://serpapi.com/search.json?engine=google_news&topic_token=CAAqJQgKIh9DQkFTRVFvTEwyY3ZNVEl5WTNvd1l6TVNBbVZ1S0FBUAE",
"title":
"Balfour Beatty Rail GmbH"
},
{
"topic_token":
"CAAqKAgKIiJDQkFTRXdvTkwyY3ZNVEZtTURGaWVHWmtOaElDWlc0b0FBUAE",
"serpapi_link":
"https://serpapi.com/search.json?engine=google_news&topic_token=CAAqKAgKIiJDQkFTRXdvTkwyY3ZNVEZtTURGaWVHWmtOaElDWlc0b0FBUAE",
"title":
"Balfour Beatty Utility Solutions Limited"
},
{
"topic_token":
"CAAqKAgKIiJDQkFTRXdvTkwyY3ZNVEZtZVRJd2VEaDViaElDWlc0b0FBUAE",
"serpapi_link":
"https://serpapi.com/search.json?engine=google_news&topic_token=CAAqKAgKIiJDQkFTRXdvTkwyY3ZNVEZtZVRJd2VEaDViaElDWlc0b0FBUAE",
"title":
"Balfour Beatty Investments Limited"
}
]
}`,
    };

    @node({
        id: '44252d0e-6f2c-438d-8550-4d567a7d4522',
        name: 'SerAPI Google News',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.3,
        position: [2080, 592],
        onError: 'continueErrorOutput',
    })
    SerapiGoogleNews = {
        url: 'https://serpapi.com/search',
        sendQuery: true,
        queryParameters: {
            parameters: [
                {
                    name: 'engine',
                    value: 'google_news',
                },
                {
                    name: 'q',
                    value: "={{ $('Split Out').item.json.output.urlEncode() }}",
                },
                {
                    name: 'api_key',
                    value: 'a0041ca04144d4345895661da7151df1cda7dc657d3007678a633b6d589b90f7',
                },
            ],
        },
        options: {
            batching: {
                batch: {
                    batchSize: 1,
                    batchInterval: 5000,
                },
            },
        },
    };

    @node({
        id: '99267e92-ebea-484c-8e4f-286d6c45ca63',
        name: 'Limit',
        type: 'n8n-nodes-base.limit',
        version: 1,
        position: [1856, 592],
    })
    Limit = {
        maxItems: 100,
    };

    @node({
        id: 'aba07ef2-b077-47f6-8a45-79500ad85318',
        name: 'Split Out News Articles',
        type: 'n8n-nodes-base.splitOut',
        version: 1,
        position: [2304, 592],
    })
    SplitOutNewsArticles = {
        fieldToSplitOut: 'news_results',
        options: {},
    };

    @node({
        id: 'cced6341-eb09-48f7-a7bb-5afdf9c58780',
        name: 'Remove Duplicates',
        type: 'n8n-nodes-base.removeDuplicates',
        version: 2,
        position: [3424, 592],
        alwaysOutputData: true,
    })
    RemoveDuplicates = {
        compare: 'selectedFields',
        fieldsToCompare: 'link',
        options: {},
    };

    @node({
        id: 'bc00a1d9-506d-4467-b609-e71b607fab99',
        name: 'Scrape a url and get its content2',
        type: '@mendable/n8n-nodes-firecrawl.firecrawl',
        version: 1,
        position: [3872, 288],
        credentials: { firecrawlApi: { id: 'i4QliNET9guWjKJf', name: 'Syntech GM Firecrawl account' } },
        onError: 'continueRegularOutput',
        executeOnce: false,
    })
    ScrapeAUrlAndGetItsContent2 = {
        operation: 'scrape',
        url: "={{ $('Merge').item.json.url }}",
        scrapeOptions: {
            options: {
                formats: {
                    format: [
                        {},
                        {
                            type: 'summary',
                        },
                    ],
                },
                excludeTags: {
                    items: [
                        {
                            tag: 'footer',
                        },
                        {
                            tag: 'script',
                        },
                        {
                            tag: 'nav',
                        },
                        {
                            tag: 'style',
                        },
                    ],
                },
                headers: {},
            },
        },
        requestOptions: {},
    };

    @node({
        id: 'd080e075-592f-40f6-bebf-9d5a731dffb7',
        name: 'Limit 15 items',
        type: 'n8n-nodes-base.limit',
        version: 1,
        position: [112, 1344],
    })
    Limit15Items = {
        maxItems: 100,
    };

    @node({
        id: '113967fc-e9cd-4ce3-98c8-f02c3a4cc7f8',
        name: 'Is Less Than 3 Weeks Old',
        type: 'n8n-nodes-base.filter',
        version: 2.3,
        position: [2976, 592],
        alwaysOutputData: true,
    })
    IsLessThan3WeeksOld = {
        conditions: {
            options: {
                caseSensitive: true,
                leftValue: '',
                typeValidation: 'loose',
                version: 3,
            },
            conditions: [
                {
                    id: 'b2056f8a-6181-477a-856c-fc3300582464',
                    leftValue: "={{ $json?.date?.toDateTime().diffToNow('days').abs() < 21 }}",
                    rightValue: '14',
                    operator: {
                        type: 'boolean',
                        operation: 'true',
                        singleValue: true,
                    },
                },
            ],
            combinator: 'and',
        },
        looseTypeValidation: true,
        options: {},
    };

    @node({
        id: '0989ded2-6b5f-472d-8c82-696ff3eddfd1',
        name: 'Get many rows1',
        type: 'n8n-nodes-base.supabase',
        version: 1,
        position: [-112, 2016],
        credentials: { supabaseApi: { id: 'IT46INDKsZaZyCZQ', name: 'Stephen Supabase account' } },
        alwaysOutputData: false,
        executeOnce: true,
    })
    GetManyRows1 = {
        operation: 'getAll',
        tableId: 'Syntech Keyword url',
        returnAll: true,
        filterType: 'none',
    };

    @node({
        id: 'a19c6c4e-7972-4ffb-8b10-e243cd4796f4',
        name: 'Get many rows sb',
        type: 'n8n-nodes-base.supabase',
        version: 1,
        position: [112, 1568],
        credentials: { supabaseApi: { id: 'IT46INDKsZaZyCZQ', name: 'Stephen Supabase account' } },
        alwaysOutputData: false,
        executeOnce: true,
    })
    GetManyRowsSb = {
        operation: 'getAll',
        tableId: 'Syntech Keyword url',
        returnAll: true,
        filterType: 'none',
    };

    @node({
        id: '82e7f5d8-5357-49ae-a409-3011ebd25aa2',
        name: 'Create a row sb',
        type: 'n8n-nodes-base.supabase',
        version: 1,
        position: [336, 1568],
        credentials: { supabaseApi: { id: 'IT46INDKsZaZyCZQ', name: 'Stephen Supabase account' } },
    })
    CreateARowSb = {
        tableId: 'Syntech Keyword url',
        fieldsUi: {
            fieldValues: [
                {
                    fieldId: 'url',
                    fieldValue: `={{
  $('Merge').item.json.link.includes('url=')
    ? decodeURIComponent($('Merge').item.json.link.split('url=')[1].split('&')[0])
    : $('Merge').item.json.link
}}`,
                },
            ],
        },
    };

    @node({
        id: 'f83cf61d-c1d2-43cd-a1ad-cf6b82800fce',
        name: 'Create a row sb1',
        type: 'n8n-nodes-base.supabase',
        version: 1,
        position: [560, 1568],
        credentials: { supabaseApi: { id: 'IT46INDKsZaZyCZQ', name: 'Stephen Supabase account' } },
    })
    CreateARowSb1 = {
        tableId: 'Syntech Keyword url',
        fieldsUi: {
            fieldValues: [
                {
                    fieldId: 'url',
                    fieldValue: `={{
  $('Merge').item.json.link.includes('url=')
    ? decodeURIComponent($('Merge').item.json.link.split('url=')[1].split('&')[0])
    : $('Merge').item.json.link
}}`,
                },
            ],
        },
    };

    @node({
        id: '44d58c74-d13f-4b2d-a299-762c32f8f7f0',
        name: 'Create a row',
        type: 'n8n-nodes-base.dataTable',
        version: 1.1,
        position: [2528, 1008],
        executeOnce: true,
    })
    CreateARow = {
        operation: 'get',
        dataTableId: {
            __rl: true,
            value: '7q6kT90w9D0EjUGe',
            mode: 'list',
            cachedResultName: 'NEWS+ Google News',
            cachedResultUrl: '/projects/U9sMeJya1DaokkjK/datatables/7q6kT90w9D0EjUGe',
        },
        returnAll: true,
    };

    @node({
        id: '5956e36c-c76a-4048-9a3d-3435c55e31c5',
        name: 'Create a row1',
        type: 'n8n-nodes-base.dataTable',
        version: 1.1,
        position: [4944, 896],
        executeOnce: false,
    })
    CreateARow1 = {
        operation: 'upsert',
        dataTableId: {
            __rl: true,
            value: '7q6kT90w9D0EjUGe',
            mode: 'list',
            cachedResultName: 'NEWS+ Google News',
            cachedResultUrl: '/projects/U9sMeJya1DaokkjK/datatables/7q6kT90w9D0EjUGe',
        },
        filters: {
            conditions: [
                {
                    keyName: 'url',
                    keyValue:
                        "={{   $('Merge').item.json.link.includes('url=')     ? decodeURIComponent($('Merge').item.json.link.split('url=')[1].split('&')[0])     : $('Merge').item.json.link }}",
                },
            ],
        },
        columns: {
            mappingMode: 'defineBelow',
            value: {
                url: `={{
  $('Merge').item.json.link.includes('url=')
    ? decodeURIComponent($('Merge').item.json.link.split('url=')[1].split('&')[0])
    : $('Merge').item.json.link
}}`,
                created_at: '={{ $now }}',
            },
            matchingColumns: [],
            schema: [
                {
                    id: 'id_sb',
                    displayName: 'id_sb',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: 'number',
                    readOnly: false,
                    removed: true,
                },
                {
                    id: 'created_at',
                    displayName: 'created_at',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: 'dateTime',
                    readOnly: false,
                    removed: false,
                },
                {
                    id: 'url',
                    displayName: 'url',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: 'string',
                    readOnly: false,
                    removed: false,
                },
            ],
            attemptToConvertTypes: false,
            convertFieldsToString: false,
        },
        options: {},
    };

    @node({
        id: '3e06f62b-a212-40b9-a8f5-cc8926181334',
        name: 'Create a row2',
        type: 'n8n-nodes-base.dataTable',
        version: 1.1,
        position: [4944, 288],
        executeOnce: false,
    })
    CreateARow2 = {
        operation: 'upsert',
        dataTableId: {
            __rl: true,
            value: '7q6kT90w9D0EjUGe',
            mode: 'list',
            cachedResultName: 'NEWS+ Google News',
            cachedResultUrl: '/projects/U9sMeJya1DaokkjK/datatables/7q6kT90w9D0EjUGe',
        },
        filters: {
            conditions: [
                {
                    keyName: 'url',
                    keyValue:
                        "={{   $('Merge').item.json.link.includes('url=')     ? decodeURIComponent($('Merge').item.json.link.split('url=')[1].split('&')[0])     : $('Merge').item.json.link }}",
                },
            ],
        },
        columns: {
            mappingMode: 'defineBelow',
            value: {
                url: `={{
  $('Merge').item.json.link.includes('url=')
    ? decodeURIComponent($('Merge').item.json.link.split('url=')[1].split('&')[0])
    : $('Merge').item.json.link
}}`,
                created_at: '={{ $now }}',
            },
            matchingColumns: [],
            schema: [
                {
                    id: 'id_sb',
                    displayName: 'id_sb',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: 'number',
                    readOnly: false,
                    removed: true,
                },
                {
                    id: 'created_at',
                    displayName: 'created_at',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: 'dateTime',
                    readOnly: false,
                    removed: false,
                },
                {
                    id: 'url',
                    displayName: 'url',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: 'string',
                    readOnly: false,
                    removed: false,
                },
            ],
            attemptToConvertTypes: false,
            convertFieldsToString: false,
        },
        options: {},
    };

    @node({
        id: '1da547c9-3656-4596-bd86-1826787299b5',
        name: 'Markdown',
        type: 'n8n-nodes-base.markdown',
        version: 1,
        position: [784, 1568],
    })
    Markdown = {
        html: `=<!DOCTYPE html><html lang="en"><head><meta charSet="utf-8"/><link rel="icon" type="image/png" href="/images/frontend/favicons/default.png"/><link rel="icon" type="image/png" sizes="144x144" href="/images/frontend/favicons/144x144.png"/><link rel="icon" type="image/png" sizes="288x288" href="/images/frontend/favicons/288x288.png"/><link rel="apple-touch-icon-precomposed" sizes="144x144" href="/images/frontend/favicons/144x144.png"/><link rel="apple-touch-icon-precomposed" sizes="288x288" href="/images/frontend/favicons/288x288.png"/><meta http-equiv="X-UA-Compatible" content="IE=Edge"/><meta name="mobile-web-app-capable" content="yes"/><meta name="apple-mobile-web-app-capable" content="yes"/><meta name="application-name" content="Nikkei Asia"/><meta name="apple-mobile-web-app-title" content="Nikkei Asia"/><meta name="theme-color" content="#0076bf"/><meta name="msapplication-navbutton-color" content="#0076bf"/><meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"/><meta name="msapplication-starturl" content="/"/><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=0, shrink-to-fit=no"/><title>In world first, Japan&#x27;s Marubeni tests shipping hydrogen trapped in metal - Nikkei Asia</title><meta name="keywords" content="world,first,,Japan&#x27;s,Marubeni,tests,shipping,hydrogen,trapped,metal"/><meta name="description" content="TOKYO -- Japanese trading house Marubeni recently conducted the world&#x27;s first international transport of hydrogen using a metal hydride alloy, a mater"/><meta name="date" content="2026-02-07T05:38:13.000+09:00"/><meta name="robots" content="max-image-preview:large"/><meta name="bingbot" content="noarchive"/><meta name="cXenseParse:pageclass" content="article"/><link rel="canonical" href="https://asia.nikkei.com/business/energy/in-world-first-japan-s-marubeni-tests-shipping-hydrogen-trapped-in-metal"/><meta name="twitter:card" content="summary_large_image"/><meta name="twitter:site" content="@NAR"/><meta name="twitter:title" property="og:title" content="In world first, Japan&#x27;s Marubeni tests shipping hydrogen trapped in metal"/><meta name="twitter:description" property="og:description" content="Trading house spent a year clearing hurdles to transport clean energy"/><meta name="twitter:image" property="og:image" content="https://images.ft.com/v3/image/raw/https%3A%2F%2Fcms-image-bucket-productionv3-ap-northeast-1-a7d2.s3.ap-northeast-1.amazonaws.com%2Fimages%2F1%2F1%2F8%2F1%2F12111811-1-eng-GB%2Fe36811d1ab5a-20260206N-Marubeni-container.jpg?width=1260&amp;fit=cover&amp;gravity=faces&amp;dpr=2&amp;quality=medium&amp;source=nar-cms&amp;format=auto&amp;height=630"/><meta name="og:url" property="og:url" content="https://asia.nikkei.com/business/energy/in-world-first-japan-s-marubeni-tests-shipping-hydrogen-trapped-in-metal"/><meta name="og:type" property="og:type" content="article"/><meta name="og:site_name" property="og:site_name" content="Nikkei Asia"/><meta name="og:locale" property="og:locale" content="en_GB"/><meta name="og:image" property="og:image" content="https://images.ft.com/v3/image/raw/https%3A%2F%2Fcms-image-bucket-productionv3-ap-northeast-1-a7d2.s3.ap-northeast-1.amazonaws.com%2Fimages%2F1%2F1%2F8%2F1%2F12111811-1-eng-GB%2Fe36811d1ab5a-20260206N-Marubeni-container.jpg?width=1260&amp;fit=cover&amp;gravity=faces&amp;dpr=2&amp;quality=medium&amp;source=nar-cms&amp;format=auto&amp;height=630"/><meta name="og:image:width" property="og:image:width" content="1260"/><meta name="og:image:height" property="og:image:height" content="630"/><meta name="og:description" property="og:description" content="Trading house spent a year clearing hurdles to transport clean energy"/><meta name="next-head-count" content="37"/><script client-env="{&quot;NEXT_PUBLIC_DISABLE_NEXT_ROUTER&quot;:true,&quot;NEXT_PUBLIC_HOTJAR_ID&quot;:629942,&quot;NEXT_PUBLIC_HOTJAR_VERSION&quot;:6,&quot;NEXT_PUBLIC_PIANO_DEBUG&quot;:false,&quot;NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID&quot;:&quot;GTM-PGQQD4B&quot;,&quot;NEXT_PUBLIC_GOOGLE_ANALYTICS_ID&quot;:&quot;UA-44606671-1&quot;,&quot;NEXT_PUBLIC_GOOGLE_ANALYTICS_SITE&quot;:&quot;asia.nikkei.com&quot;,&quot;NEXT_PUBLIC_FRONTEND_CLOUDFRONT_STATIC_URL&quot;:&quot;https://d2p3vtsww1sn4i.cloudfront.net&quot;,&quot;NEXT_PUBLIC_SHOW_AD_BLOCK&quot;:false,&quot;NEXT_PUBLIC_OUTBRAIN_ADVERTISING_ID&quot;:&quot;00280e9c9208103b82992e13a5e43683ac&quot;,&quot;NEXT_PUBLIC_FACEBOOK_PIXEL_ID&quot;:&quot;1076130949081971&quot;,&quot;NEXT_PUBLIC_CHARTBEAT_ID&quot;:&quot;54438&quot;,&quot;NEXT_PUBLIC_MY_NEWS_EXPANSION_ENABLED&quot;:false,&quot;NEXT_PUBLIC_AI_FEATURES_ENABLED&quot;:false,&quot;NEXT_PUBLIC_DEFAULT_PAGINATION_LIMIT&quot;:40,&quot;NEXT_PUBLIC_SEARCH_PAGINATION_LIMIT&quot;:200,&quot;NEXT_PUBLIC_PRODUCT_MATRIX_ENABLED&quot;:false}" shared-frontend-env="{&quot;NEXT_PUBLIC_NODE_ENV&quot;:&quot;production&quot;,&quot;NEXT_PUBLIC_BASE_URL&quot;:&quot;https://asia.nikkei.com&quot;,&quot;NEXT_PUBLIC_APOLLO_TIMEOUT_MS&quot;:30000,&quot;NEXT_PUBLIC_APPLY_CYPRESS_PROPERTIES&quot;:false,&quot;NEXT_PUBLIC_APOLLO_SERVER_URL&quot;:&quot;https://asia.nikkei.com/api/__service/next_api/v1/graphql&quot;,&quot;NEXT_PUBLIC_PIANO_ID&quot;:&quot;3keAb0xYpj&quot;,&quot;NEXT_PUBLIC_PIANO_ENV&quot;:&quot;prod&quot;,&quot;NEXT_PUBLIC_PIANO_URL&quot;:&quot;https://experience-ap.piano.io&quot;,&quot;NEXT_PUBLIC_ATLAS_SDK_API_KEY&quot;:&quot;885cfd611594f1cb21ecd50b741a9f55a68fc4d8&quot;,&quot;NEXT_PUBLIC_ATLAS_ENDPOINT&quot;:&quot;https://astat.nikkei.com&quot;,&quot;NEXT_PUBLIC_SENTRY_ENABLED&quot;:true,&quot;NEXT_PUBLIC_ORIGAMI_URL&quot;:&quot;https://www.ft.com/__origami/service/image/v2/images/raw&quot;}">if("undefined"!=typeof window&&"undefined"!=typeof window){const e=JSON.parse(document.currentScript.getAttribute("client-env")),n=JSON.parse(document.currentScript.getAttribute("shared-frontend-env"));window.clientEnv=e,window.sharedFrontendEnv=n,Object.freeze(window.clientEnv),Object.freeze(window.sharedFrontendEnv)}</script><script>"undefined"!=typeof window&&"undefined"!=typeof window&&(window.addEventListener("dependencies.service.tracking.ready",(()=>{window.loggedIn=!(!window.paywallState||!window.paywallState.authority||-1!==["A1","A3I","A1S","-",""].indexOf(window.paywallState.authority))})),window.isCount=!1,window.oneClickFree=!1);</script><script>"undefined"!=typeof window&&"undefined"!=typeof window&&(tp=window.tp||[],tp.push(["init",function(){window.location.pathname.includes("/member")&&tp.pianoId.init({stage:"product-matrix"});const e=new CustomEvent("dependencies.service.piano.init",{detail:{piano:tp}});window.dispatchEvent(e)}]),window.addEventListener("dependencies.service.piano.push",(e=>{tp.push(e.detail.args)})),window.addEventListener("message",(e=>{if(e.data.type&&"get-piano-id"===e.data.type){const e=window.tp.aid;window.postMessage({type:"get-piano-id:response",pianoId:e},"*")}else e.data.type&&"set-access-token"===e.data.type?(window.tp.pianoId.loginByToken(e.data.accessToken),window.postMessage({type:"set-access-token:response"},"*")):e.data.type&&"piano-logout"===e.data.type&&window.tp.pianoId.logout().then((()=>{window.postMessage({type:"piano-logout:response"},"*")}))})),tp.push(["addHandler","showTemplate",function(e){"#paywall-offer"===e.containerSelector&&window.dispatchEvent(new CustomEvent("paywall-shown"))}]));</script><script>if("undefined"!=typeof window&&"undefined"!=typeof window){if(!["/account/newsletter-preferences"].find((t=>window.location.pathname.includes(t)))){var _sf_startpt=(new Date).getTime();!function(){var t=window._sf_async_config=window._sf_async_config||{};t.uid=window.clientEnv.NEXT_PUBLIC_CHARTBEAT_ID,t.domain="asia.nikkei.com",t.useCanonical=!0,t.useCanonicalDomain=!0,t.flickerControl=!1}(),function(){var t=document.createElement("script");t.setAttribute("async","true"),t.setAttribute("type","text/javascript"),t.setAttribute("src","//static.chartbeat.com/js/chartbeat_mab.js"),document.head.appendChild(t)}()}}</script><script id="google-tag-manager">if("undefined"!=typeof window&&"undefined"!=typeof window){const e=()=>{window.removeEventListener("dependencies.service.tracking.ready",e);((e,n,t,a,d)=>{e[a]=e[a]||[],e[a].push({"gtm.start":(new Date).getTime(),event:"gtm.js"});const i=n.getElementsByTagName(t)[0],o=n.createElement(t),r="dataLayer"!==a?"&l="+a:"";o.async=!0,o.src="https://www.googletagmanager.com/gtm.js?id="+d+r,o.addEventListener("load",(()=>{window.googletag.pubads().setTargeting("path",location.pathname)})),i.parentNode.insertBefore(o,i)})(window,document,"script","dataLayer",window.clientEnv.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID)};["/account/newsletter-preferences"].find((e=>window.location.pathname.includes(e)))||window.addEventListener("dependencies.service.tracking.ready",e)}</script><script>if("undefined"!=typeof window&&"undefined"!=typeof window){const e=()=>{var n,i,o,s,d,t;window.removeEventListener("dependencies.service.session.ready",e),n=window,i=document,o="script",s="ga",n.GoogleAnalyticsObject=s,n[s]=n[s]||function(){(n[s].q=n[s].q||[]).push(arguments)},n[s].l=1*new Date,d=i.createElement(o),t=i.getElementsByTagName(o)[0],d.async=1,d.src="//www.google-analytics.com/analytics.js",t.parentNode.insertBefore(d,t),ga("create",window.clientEnv.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,window.clientEnv.NEXT_PUBLIC_GOOGLE_ANALYTICS_SITE),ga("set","dimension1","-"!==window.session.memberId?"true":"false"),window.session&&""!==window.session.authority&&ga("set","dimension2",window.session.authority),window.session&&"-"!==window.session.memberId&&ga("set","dimension3",window.session.memberId);const w=window.sharedFrontendEnv.NEXT_PUBLIC_PIANO_ID;ga("set","dimension4",w),"undefined"!=typeof viewMode&&""!==viewMode&&ga("set","dimension5",viewMode),"undefined"!=typeof contractId&&""!==contractId&&ga("set","dimension6",contractId),"undefined"!=typeof c_code&&""!==c_code&&ga("set","dimension7",c_code),ga("send","pageview"),window.oneClickFree&&ga("send","event","OneClickFree","view","OneClickFree-view",{nonInteraction:!0})};[].find((e=>window.location.pathname.includes(e)))||window.addEventListener("dependencies.service.session.ready",e)}</script><script>if("undefined"!=typeof window&&"undefined"!=typeof window){const e=()=>{window.removeEventListener("dependencies.service.session.ready",e);var n="na";if(window.session?.authority){n="sub_1";var o=window.session.authority;-1!==["A2h","A2","A2P"].indexOf(o)?n="ex":-1!==["A1","A1S","A2N"].indexOf(o)&&(n="no")}window.googletag=window.googletag||{},googletag.cmd=googletag.cmd||[],googletag.cmd.push((function(){googletag.pubads().setTargeting("swgt",n),googletag.pubads().setTargeting("path",location.pathname)}))};["/account/newsletter-preferences","/member/register"].find((e=>window.location.pathname.includes(e)))||window.addEventListener("dependencies.service.session.ready",e)}</script><script>if("undefined"!=typeof window&&"undefined"!=typeof window){["/account/newsletter-preferences"].find((e=>window.location.pathname.includes(e)))||(!function(e,n,t,o,i,c,f){e.fbq||(i=e.fbq=function(){i.callMethod?i.callMethod.apply(i,arguments):i.queue.push(arguments)},e._fbq||(e._fbq=i),i.push=i,i.loaded=!0,i.version="2.0",i.queue=[],(c=n.createElement(t)).async=!0,c.src="https://connect.facebook.net/en_US/fbevents.js",(f=n.getElementsByTagName(t)[0]).parentNode.insertBefore(c,f))}(window,document,"script"),fbq("init",window.clientEnv.NEXT_PUBLIC_FACEBOOK_PIXEL_ID),fbq("track","PageView"))}</script><script>if("undefined"!=typeof window&&"undefined"!=typeof window){["/account/newsletter-preferences"].find((t=>window.location.pathname.includes(t)))||window.addEventListener("dependencies.service.tracking.ready",(()=>{if(-1==window.location.host.indexOf("staging")&&"article"==window.paywallState?.contentTypeIdentifier){var t=document,e=t.getElementsByTagName("head")[0],r=t.createElement("meta");r.setAttribute("property","product:availability");var n=new Date(tracking_data.publish_date),a=(new Date).getTime()-n.getTime(),i=Math.floor(a/864e5);i>90?r.setAttribute("content","out of stock"):r.setAttribute("content","in stock"),e.appendChild(r);var o=t.createElement("meta");o.setAttribute("property","product:custom_label_0"),o.setAttribute("content",i),e.appendChild(o);var d=t.createElement("meta");d.setAttribute("property","product:custom_label_1"),d.setAttribute("content",window.tracking_data.source),e.appendChild(d);var c=t.createElement("meta");c.setAttribute("property","product:brand"),c.setAttribute("content",window.tracking_data.section),e.appendChild(c);var p=t.createElement("meta");p.setAttribute("property","product:category"),p.setAttribute("content",window.tracking_data.topic),e.appendChild(p);var u=t.createElement("meta");u.setAttribute("property","product:retailer_item_id"),u.setAttribute("content",window.tracking_data.article_id),e.appendChild(u);var l=t.createElement("meta");l.setAttribute("property","product:condition"),l.setAttribute("content","new"),e.appendChild(l);var s=t.createElement("meta");s.setAttribute("property","product:price:amount"),s.setAttribute("content","1"),e.appendChild(s);var m=t.createElement("meta");m.setAttribute("property","product:price:currency"),m.setAttribute("content","USD"),e.appendChild(m)}}))}</script><script type="text/javascript" src="//platform.twitter.com/oct.js" async=""></script><script async="" src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"></script><script>if("undefined"!=typeof window&&"undefined"!=typeof window){["/account/newsletter-preferences"].some((e=>window.location.pathname.includes(e)))||window.dispatchEvent(new CustomEvent("dependencies.service.piano.push",{detail:{args:["init",function(){try{const t=document.createElement("script");t.setAttribute("id","outbrain-script"),t.setAttribute("type","text/javascript"),t.setAttribute("async","async"),t.src="//widgets.outbrain.com/outbrain.js",document.head.appendChild(t),t.addEventListener("load",e)}catch(e){}}]}}));const e=()=>{!function(e,t){var n=window.clientEnv.NEXT_PUBLIC_OUTBRAIN_ADVERTISING_ID;if(e.obApi){var i=function(e){return"[object Array]"===Object.prototype.toString.call(e)?e:[e]};e.obApi.marketerId=i(e.obApi.marketerId).concat(i(n))}else{var a=e.obApi=function(){a.dispatch?a.dispatch.apply(a,arguments):a.queue.push(arguments)};a.version="1.1",a.loaded=!0,a.marketerId=n,a.queue=[];var r=t.createElement("script");r.async=!0,r.src="//amplify.outbrain.com/cp/obtp.js",r.type="text/javascript";var o=t.getElementsByTagName("script")[0];o.parentNode.insertBefore(r,o)}}(window,document),obApi("track","PAGE_VIEW"),window.dispatchEvent(new CustomEvent("dependencies.service.outbrain.ready"))}}</script><link rel="manifest" href="/public-assets/manifest.json"/><link rel="preconnect" href="https://fonts.googleapis.com"/><link rel="preconnect" href="https://fonts.gstatic.com"/><style></style><link
          rel="stylesheet"href="https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@300;400;500;600;700&display=swap"
          media="print"
                        onload="this.media = 'all';"
                      />
                      <style></style><script src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&amp;version=v16.0" async="" defer="" crossorigin="anonymous"></script><noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=1076130949081971&amp;ev=PageView&amp;noscript=1"/></noscript><script id="replaceArticleBody" data-nscript="beforeInteractive">"undefined"!=typeof window&&"undefined"!=typeof window&&(window.replaceArticleBody=function(){const e=new Event("articleAccessCalled");document.dispatchEvent(e)});</script><script id="setupExpiredSubscription" data-nscript="beforeInteractive">if("undefined"!=typeof window&&"undefined"!=typeof window){const e="PreviousSubs",t=window.localStorage,n=JSON.parse(t.getItem(e))||{};window.dispatchEvent(new CustomEvent("dependencies.service.piano.updated",{detail:{args:["addHandler","experienceExecute",o=>{if(!o||!o.user||!o.user.uid||"anon"===o.user.uid)return;const i=o.user.uid;o.accessList.length>=1&&(n[i]=!0),n.hasOwnProperty(i)&&0===o.accessList.length&&(delete n[i],document.cookie="__tac=; Max-Age=0; path=/; domain="+location.host,document.cookie="__tac=; Max-Age=0; path=/; domain="+location.hostname,document.cookie="__tac=; Max-Age=0; path=/; domain=.nikkei.com"),t.setItem(e,JSON.stringify(n))}]}}))}</script><script id="schema-org" type="application/ld+json" async="" data-nscript="beforeInteractive">{"@context":"https://schema.org","@type":"NewsArticle","mainEntityOfPage":"https://asia.nikkei.comhttps://asia.nikkei.com/business/energy/in-world-first-japan-s-marubeni-tests-shipping-hydrogen-trapped-in-metal","publisher":{"@type":"Organization","name":"Nikkei Asia","logo":{"@type":"ImageObject","url":"https://asia.nikkei.com/images/frontend/nikkei-asia-logo.png"}},"headline":"In world first, Japan's Marubeni tests shipping hydrogen trapped in metal","articleSection":"energy","alternativeHeadline":"Trading house spent a year clearing hurdles to transport clean energy","image":"https://images.ft.com/v3/image/raw/https%3A%2F%2Fcms-image-bucket-productionv3-ap-northeast-1-a7d2.s3.ap-northeast-1.amazonaws.com%2Fimages%2F1%2F1%2F8%2F1%2F12111811-1-eng-GB%2Fe36811d1ab5a-20260206N-Marubeni-container.jpg?width=1200&fit=cover&gravity=faces&dpr=2&quality=medium&source=nar-cms&format=auto","datePublished":"2026-02-06T20:38:13.000Z","dateModified":"2026-02-06T20:38:13.000Z","author":{"@type":"Person","name":"Staff Writer"}}</script><link rel="preload" href="/_next/static/css/d55e5253fb13b991.css" as="style"/><link rel="stylesheet" href="/_next/static/css/d55e5253fb13b991.css" data-n-g=""/><link rel="preload" href="/_next/static/css/4f27eb6722ddbfe5.css" as="style"/><link rel="stylesheet" href="/_next/static/css/4f27eb6722ddbfe5.css" data-n-p=""/><link rel="preload" href="/_next/static/css/6ce224c75b0ce022.css" as="style"/><link rel="stylesheet" href="/_next/static/css/6ce224c75b0ce022.css" data-n-p=""/><link rel="preload" href="/_next/static/css/df7110f730630b19.css" as="style"/><link rel="stylesheet" href="/_next/static/css/df7110f730630b19.css" data-n-p=""/><link rel="preload" href="/_next/static/css/02918951e00490ee.css" as="style"/><link rel="stylesheet" href="/_next/static/css/02918951e00490ee.css" data-n-p=""/><link rel="preload" href="/_next/static/css/0934266b7fc9508d.css" as="style"/><link rel="stylesheet" href="/_next/static/css/0934266b7fc9508d.css" data-n-p=""/><link rel="preload" href="/_next/static/css/314a8b7317bf827a.css" as="style"/><link rel="stylesheet" href="/_next/static/css/314a8b7317bf827a.css" data-n-p=""/><link rel="preload" href="/_next/static/css/ffbe025e356edc76.css" as="style"/><link rel="stylesheet" href="/_next/static/css/ffbe025e356edc76.css" data-n-p=""/><link rel="preload" href="/_next/static/css/f8bc5f1eca545837.css" as="style"/><link rel="stylesheet" href="/_next/static/css/f8bc5f1eca545837.css" data-n-p=""/><noscript data-n-css=""></noscript><script defer="" nomodule="" src="/_next/static/chunks/polyfills-42372ed130431b0a.js"></script><script src="/_next/static/chunks/webpack-4b4b4826b301d994.js" defer=""></script><script src="/_next/static/chunks/framework-a32fdada02556615.js" defer=""></script><script src="/_next/static/chunks/main-a66c75b9611067ce.js" defer=""></script><script src="/_next/static/chunks/pages/_app-b6bc0a26690875ac.js" defer=""></script><script src="/_next/static/chunks/a5a946bf-c9db86cde31e93cb.js" defer=""></script><script src="/_next/static/chunks/9097-797492b16d6167aa.js" defer=""></script><script src="/_next/static/chunks/3374-ba0b1b5fe8990296.js" defer=""></script><script src="/_next/static/chunks/2117-02df4f145bb4093e.js" defer=""></script><script src="/_next/static/chunks/6741-e0f6ec9163416b4a.js" defer=""></script><script src="/_next/static/chunks/7159-2d5dd1999f774d71.js" defer=""></script><script src="/_next/static/chunks/982-8d5ea2f18a636e26.js" defer=""></script><script src="/_next/static/chunks/4783-6200d7da9e6931c8.js" defer=""></script><script src="/_next/static/chunks/9501-4e01e1ae85598b73.js" defer=""></script><script src="/_next/static/chunks/2596-6edfaec74234eac2.js" defer=""></script><script src="/_next/static/chunks/8321-38a949c3b67ff9ea.js" defer=""></script><script src="/_next/static/chunks/7111-9a5e040c88c84196.js" defer=""></script><script src="/_next/static/chunks/2171-38853b7d10a01616.js" defer=""></script><script src="/_next/static/chunks/8308-53f62f58c2b1869f.js" defer=""></script><script src="/_next/static/chunks/1373-401b3e894e229b8f.js" defer=""></script><script src="/_next/static/chunks/6718-124437b375898336.js" defer=""></script><script src="/_next/static/chunks/2459-c6deb70d7d48325d.js" defer=""></script><script src="/_next/static/chunks/pages/%5B...alias%5D-8f70d7619c987e28.js" defer=""></script><script src="/_next/static/MBN7XKHbBL_6QvTB8Xn0T/_buildManifest.js" defer=""></script><script src="/_next/static/MBN7XKHbBL_6QvTB8Xn0T/_ssgManifest.js" defer=""></script></head><body><div id="__next"><div class="LeaderboardAd_leaderboardAdContainer__WGdv5 false"><div class="LeaderboardAd_leaderboardAd__3uqP_"></div></div><header class="Navigation_navigationHeader__3CQXo false false no-print" data-trackable="header"><div class="Navigation_navigationHeaderOuter__gm47v "><div class="Navigation_navigationHeaderInner__Nt_wc"><button class="Link_linkButtonAsAnchor__xp_1E Link_link__qPD1b Navigation_navigationBurgerContainer__3u9l_" href="#" data-trackable="burger-menu-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25" class="Navigation_navigationBurger__pRcyQ"><path fill="#FFF" fill-rule="evenodd" d="M0 6h25V3H0zM0 14h25v-3H0zM0 22h25v-3H0z"></path></svg></button><div class="Navigation_navigationSearchLinkWrapper__YtWA5"><a class="Link_link__qPD1b Navigation_navigationSearchLink__OjmVS" href="/search"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25" data-trackable="search-button" class="Navigation_navigationSearchIcon__X4my4"><path fill="#FFF" fill-rule="evenodd" d="M19.256 17.143c1.294-1.714 2.013-3.714 2.013-6C21.269 5.57 16.813 1 11.206 1 5.6 1 1 5.571 1 11.143c0 5.571 4.6 10.143 10.206 10.143 2.3 0 4.457-.715 6.038-2l4.312 4.285c.288.286.719.429 1.006.429.288 0 .72-.143 1.007-.429.575-.571.575-1.428 0-2l-4.313-4.428zm-8.05 1.143c-4.025 0-7.331-3.143-7.331-7.143s3.306-7.286 7.331-7.286 7.332 3.286 7.332 7.286c0 4-3.307 7.143-7.332 7.143z"></path></svg></a></div><div class="Navigation_navigationLogoContainerWrapper__1_ues"><a class="Navigation_navigationLogoContainer__jVm6J" href="/" data-trackable="logo-NAR"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 670 124" class="Navigation_navigationLogo__Znx0T"><defs><style>.cls-1{fill:#fff}</style></defs><g id="\\u30EC\\u30A4\\u30E4\\u30FC_2" data-name="\\u30EC\\u30A4\\u30E4\\u30FC 2"><g id="\\u30EC\\u30A4\\u30E4\\u30FC_3" data-name="\\u30EC\\u30A4\\u30E4\\u30FC 3"><path d="M67.87,121.83l-57-65.34v65.34H0V33.59H3.88L60.73,98.8V33.59h10.9v88.24Z" class="cls-1"></path><path d="M91.17,33.59h11.27v88.24H91.17Z" class="cls-1"></path><path d="M144.76,77.64,133.24,90.16v31.67H122V33.59h11.27V76.77l38.57-43.18h12v.62L152.65,69.38l33.44,51.82v.63H173.44Z" class="cls-1"></path><path d="M220.27,77.64,208.75,90.16v31.67H197.48V33.59h11.27V76.77l38.57-43.18h12v.62L228.16,69.38,261.6,121.2v.63H249Z" class="cls-1"></path><path d="M273,33.59h46.83v9.76H284.27V71.26H315.2V80.9H284.27v31.16h35.56v9.77H273Z" class="cls-1"></path><path d="M336.11,33.59h11.27v88.24H336.11Z" class="cls-1"></path><path d="M447.81,97.58H404.86l-9.58,24.27H373V120.7L421.54,2.13h9.59L479.86,120.7v1.15H457.55ZM426.33,41.43l-14.7,39H441Z" class="cls-1"></path><path d="M488,115.91V97.75l.83-.33A45,45,0,0,0,517,107.16c9.91,0,15-3.8,15-10.07,0-6-3.3-8.09-12.39-10.41l-8.59-2.31C497.2,80.74,488,72.82,488,58.28c0-16.67,13.05-27.4,33-27.4,11.4,0,19.5,2,26.27,5.11V52.84l-.83.49a55.92,55.92,0,0,0-25.27-6.11c-9.75,0-12.89,3.8-12.89,9.08,0,5.12,3.14,7.76,9.91,9.58L526.61,68C544.45,72.82,553,78.59,553,94.61c0,19-14.7,29.06-34.69,29.06C503.65,123.67,494.73,120.37,488,115.91Z" class="cls-1"></path><path d="M562.79,0h22.3V19.32h-22.3ZM563,33.19h22v88.66H563Z" class="cls-1"></path><path d="M649.35,112c-4.46,6.27-11.89,12-24.78,12-17,0-29.73-9.08-29.73-26.25,0-18.33,14-24.6,35.51-27.74L648,67.53V67.2c0-14-5.95-18.33-19.33-18.33a50.47,50.47,0,0,0-26.1,6.61l-1-.33v-17c6.94-4.29,16.85-6.93,30.23-6.93C656.12,31.21,670,41,670,66.54v55.31H651ZM648,99.73v-18l-12.89,2c-13.38,2-18.66,5.29-18.66,13.05,0,6.93,4.29,11.55,13.54,11.55C638.61,108.31,644.23,104.68,648,99.73Z" class="cls-1"></path></g></g></svg></a></div><div class="NavigationActions_navigationActionsPlaceholder__7ctE_"></div></div></div><div class="Navigation_navigationSlim__IWNXf"><nav class="DesktopNavigation_desktopNavigation__sEoKj" data-trackable="menu" data-nav-level="1"><li class="DesktopNavigationItem_desktopNavigationItem__3rcre" location="landingpagenewsregion"><a class="Link_link__qPD1b" href="/location" data-trackable="world-link">World</a><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" class="DesktopNavigationItem_desktopNavigationItemIcon__PYYsl"><path fill-rule="evenodd" d="M1.913 11.288L7.5 5.701l5.587 5.587 1.326-1.326L7.5 3.125.587 9.962z"></path></svg><nav data-trackable="world" class="DesktopNavigationHoverItem_desktopNavigationHoverItemExpanded__Ycd9_ DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemDefault__hIXyC"><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS" href="/location/east-asia/china" data-trackable="china-link">China</a><nav data-trackable="china" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS" href="/location/east-asia/japan" data-trackable="japan-link">Japan</a><nav data-trackable="japan" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS" href="/location/south-asia/india" data-trackable="india-link">India</a><nav data-trackable="india" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS" href="/location/east-asia/south-korea" data-trackable="south-korea-link">South Korea</a><nav data-trackable="south-korea" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS" href="/location/southeast-asia/indonesia" data-trackable="indonesia-link">Indonesia</a><nav data-trackable="indonesia" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS" href="/location/east-asia/taiwan" data-trackable="taiwan-link">Taiwan</a><nav data-trackable="taiwan" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS" href="/location/southeast-asia/thailand" data-trackable="thailand-link">Thailand</a><nav data-trackable="thailand" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS" href="/location/rest-of-the-world/north-america/u.s" data-trackable="u.s.-link">U.S.</a><nav data-trackable="u.s." class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li></ul><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkDark__yUj72" href="/location/east-asia" data-trackable="east-asia-link">East Asia<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" class="DesktopNavigationHoverListItem_desktopNavigationItemIcon__5U4yw"><path fill-rule="evenodd" d="M1.913 11.288L7.5 5.701l5.587 5.587 1.326-1.326L7.5 3.125.587 9.962z"></path></svg></a><nav data-trackable="east-asia" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj"><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/location/east-asia/china" data-trackable="china-link">China</a><nav data-trackable="china" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/location/east-asia/hong-kong" data-trackable="hong-kong-link">Hong Kong</a><nav data-trackable="hong-kong" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/location/east-asia/macao" data-trackable="macao-link">Macao</a><nav data-trackable="macao" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/location/east-asia/taiwan" data-trackable="taiwan-link">Taiwan</a><nav data-trackable="taiwan" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/location/east-asia/mongolia" data-trackable="mongolia-link">Mongolia</a><nav data-trackable="mongolia" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/location/east-asia/japan" data-trackable="japan-link">Japan</a><nav data-trackable="japan" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/location/east-asia/south-korea" data-trackable="south-korea-link">South Korea</a><nav data-trackable="south-korea" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/location/east-asia/north-korea" data-trackable="north-korea-link">North Korea</a><nav data-trackable="north-korea" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkDark__yUj72" href="/location/southeast-asia" data-trackable="southeast-asia-link">Southeast Asia<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" class="DesktopNavigationHoverListItem_desktopNavigationItemIcon__5U4yw"><path fill-rule="evenodd" d="M1.913 11.288L7.5 5.701l5.587 5.587 1.326-1.326L7.5 3.125.587 9.962z"></path></svg></a><nav data-trackable="southeast-asia" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj"><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/location/southeast-asia/indonesia" data-trackable="indonesia-link">Indonesia</a><nav data-trackable="indonesia" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/location/southeast-asia/thailand" data-trackable="thailand-link">Thailand</a><nav data-trackable="thailand" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/location/southeast-asia/malaysia" data-trackable="malaysia-link">Malaysia</a><nav data-trackable="malaysia" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/location/southeast-asia/singapore" data-trackable="singapore-link">Singapore</a><nav data-trackable="singapore" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/location/southeast-asia/philippines" data-trackable="philippines-link">Philippines</a><nav data-trackable="philippines" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/location/southeast-asia/vietnam" data-trackable="vietnam-link">Vietnam</a><nav data-trackable="vietnam" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/location/southeast-asia/myanmar" data-trackable="myanmar-link">Myanmar</a><nav data-trackable="myanmar" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/location/southeast-asia/cambodia" data-trackable="cambodia-link">Cambodia</a><nav data-trackable="cambodia" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/location/southeast-asia/laos" data-trackable="laos-link">Laos</a><nav data-trackable="laos" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/location/southeast-asia/brunei" data-trackable="brunei-link">Brunei</a><nav data-trackable="brunei" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/location/southeast-asia/east-timor" data-trackable="east-timor-link">East Timor</a><nav data-trackable="east-timor" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkDark__yUj72" href="/location/south-asia" data-trackable="south-asia-link">South Asia<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" class="DesktopNavigationHoverListItem_desktopNavigationItemIcon__5U4yw"><path fill-rule="evenodd" d="M1.913 11.288L7.5 5.701l5.587 5.587 1.326-1.326L7.5 3.125.587 9.962z"></path></svg></a><nav data-trackable="south-asia" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj"><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/location/south-asia/india" data-trackable="india-link">India</a><nav data-trackable="india" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/location/south-asia/pakistan" data-trackable="pakistan-link">Pakistan</a><nav data-trackable="pakistan" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/location/south-asia/afghanistan" data-trackable="afghanistan-link">Afghanistan</a><nav data-trackable="afghanistan" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/location/south-asia/bangladesh" data-trackable="bangladesh-link">Bangladesh</a><nav data-trackable="bangladesh" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/location/south-asia/sri-lanka" data-trackable="sri-lanka-link">Sri Lanka</a><nav data-trackable="sri-lanka" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/location/south-asia/nepal" data-trackable="nepal-link">Nepal</a><nav data-trackable="nepal" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/location/south-asia/bhutan" data-trackable="bhutan-link">Bhutan</a><nav data-trackable="bhutan" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/location/south-asia/maldives" data-trackable="maldives-link">Maldives</a><nav data-trackable="maldives" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkDark__yUj72" href="/location/central-asia" data-trackable="central-asia-link">Central Asia<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" class="DesktopNavigationHoverListItem_desktopNavigationItemIcon__5U4yw"><path fill-rule="evenodd" d="M1.913 11.288L7.5 5.701l5.587 5.587 1.326-1.326L7.5 3.125.587 9.962z"></path></svg></a><nav data-trackable="central-asia" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj"><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/location/central-asia/kazakhstan" data-trackable="kazakhstan-link">Kazakhstan</a><nav data-trackable="kazakhstan" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/location/central-asia/uzbekistan" data-trackable="uzbekistan-link">Uzbekistan</a><nav data-trackable="uzbekistan" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/location/central-asia/turkmenistan" data-trackable="turkmenistan-link">Turkmenistan</a><nav data-trackable="turkmenistan" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/location/central-asia/tajikistan" data-trackable="tajikistan-link">Tajikistan</a><nav data-trackable="tajikistan" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/location/central-asia/kyrgyzstan" data-trackable="kyrgyzstan-link">Kyrgyzstan</a><nav data-trackable="kyrgyzstan" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkDark__yUj72" href="/location/oceania" data-trackable="oceania-link">Oceania<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" class="DesktopNavigationHoverListItem_desktopNavigationItemIcon__5U4yw"><path fill-rule="evenodd" d="M1.913 11.288L7.5 5.701l5.587 5.587 1.326-1.326L7.5 3.125.587 9.962z"></path></svg></a><nav data-trackable="oceania" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj"><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/location/oceania/australia" data-trackable="australia-link">Australia</a><nav data-trackable="australia" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/location/oceania/new-zealand" data-trackable="new-zealand-link">New Zealand</a><nav data-trackable="new-zealand" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/location/oceania/papua-new-guinea" data-trackable="papua-new-guinea-link">Papua New Guinea</a><nav data-trackable="papua-new-guinea" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/location/oceania/pacific-islands" data-trackable="pacific-islands-link">Pacific Islands</a><nav data-trackable="pacific-islands" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkDark__yUj72" href="/location/rest-of-the-world" data-trackable="rest-of-the-world-link">Rest of the World<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" class="DesktopNavigationHoverListItem_desktopNavigationItemIcon__5U4yw"><path fill-rule="evenodd" d="M1.913 11.288L7.5 5.701l5.587 5.587 1.326-1.326L7.5 3.125.587 9.962z"></path></svg></a><nav data-trackable="rest-of-the-world" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj"><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/location/rest-of-the-world/middle-east" data-trackable="middle-east-link">Middle East</a><nav data-trackable="middle-east" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/location/rest-of-the-world/russia-caucasus" data-trackable="russia-caucasus-link">Russia &amp; Caucasus</a><nav data-trackable="russia-caucasus" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/location/rest-of-the-world/north-america" data-trackable="north-america-link">North America</a><nav data-trackable="north-america" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/location/rest-of-the-world/latin-america" data-trackable="latin-america-link">Latin America</a><nav data-trackable="latin-america" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/location/rest-of-the-world/europe" data-trackable="europe-link">Europe</a><nav data-trackable="europe" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/location/rest-of-the-world/africa" data-trackable="africa-link">Africa</a><nav data-trackable="africa" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li></ul></nav></li></ul></nav></li><li class="DesktopNavigationItem_desktopNavigationItem__3rcre" location="5e3c42fe9617f8063ed83b11330b76b7"><a class="Link_link__qPD1b" href="/trending" data-trackable="trending-link">Trending</a><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" class="DesktopNavigationItem_desktopNavigationItemIcon__PYYsl"><path fill-rule="evenodd" d="M1.913 11.288L7.5 5.701l5.587 5.587 1.326-1.326L7.5 3.125.587 9.962z"></path></svg><nav data-trackable="trending" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemDefault__hIXyC"><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS" href="/politics/japan-election" data-trackable="japan-election-link">Japan election</a><nav data-trackable="japan-election" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS" href="/spotlight/trump-administration" data-trackable="trump-administration-link">Trump administration</a><nav data-trackable="trump-administration" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS" href="/politics/thai-election" data-trackable="thai-election-link">Thai election</a><nav data-trackable="thai-election" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS" href="/business/technology/artificial-intelligence" data-trackable="artificial-intelligence-link">Artificial intelligence</a><nav data-trackable="artificial-intelligence" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS" href="/business/automobiles/electric-vehicles" data-trackable="electric-vehicles-link">Electric vehicles</a><nav data-trackable="electric-vehicles" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS" href="/spotlight/supply-chain" data-trackable="supply-chain-link">Supply Chain</a><nav data-trackable="supply-chain" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS" href="/politics/international-relations/taiwan-tensions" data-trackable="taiwan-tensions-link">Taiwan tensions</a><nav data-trackable="taiwan-tensions" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS" href="/economy/bank-of-japan" data-trackable="bank-of-japan-link">Bank of Japan</a><nav data-trackable="bank-of-japan" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS" href="/spotlight/immigration" data-trackable="immigration-link">Immigration</a><nav data-trackable="immigration" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS" href="/spotlight/esg" data-trackable="esg-link">ESG</a><nav data-trackable="esg" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS" href="/spotlight/explainer" data-trackable="explainer-link">Explainer</a><nav data-trackable="explainer" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li></ul></nav></li><li class="DesktopNavigationItem_desktopNavigationItem__3rcre" location="landingpagebusiness"><a class="Link_link__qPD1b" href="/business" data-trackable="business-link">Business</a><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" class="DesktopNavigationItem_desktopNavigationItemIcon__PYYsl"><path fill-rule="evenodd" d="M1.913 11.288L7.5 5.701l5.587 5.587 1.326-1.326L7.5 3.125.587 9.962z"></path></svg><nav data-trackable="business" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemDefault__hIXyC"><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS DesktopNavigationHoverListItem_desktopNavigationLinkBold__fj1Oy" href="/business" data-trackable="business-link">Business</a><nav data-trackable="business" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS" href="/business/tech/semiconductors" data-trackable="semiconductors-link">Semiconductors</a><nav data-trackable="semiconductors" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS" href="/business/automobiles" data-trackable="automobiles-link">Automobiles</a><nav data-trackable="automobiles" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS" href="/business/energy" data-trackable="energy-link">Energy</a><nav data-trackable="energy" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS" href="/business/transportation" data-trackable="transportation-link">Transportation</a><nav data-trackable="transportation" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS" href="/business/retail" data-trackable="retail-link">Retail</a><nav data-trackable="retail" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS" href="/business/travel-leisure" data-trackable="travel-leisure-link">Travel &amp; Leisure</a><nav data-trackable="travel-leisure" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS" href="/business/media-entertainment" data-trackable="media-entertainment-link">Media &amp; Entertainment</a><nav data-trackable="media-entertainment" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS" href="/business/food-beverage" data-trackable="food-beverage-link">Food &amp; Beverage</a><nav data-trackable="food-beverage" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS" href="/business/finance" data-trackable="finance-link">Finance</a><nav data-trackable="finance" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS" href="/business/electronics" data-trackable="electronics-link">Electronics</a><nav data-trackable="electronics" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS" href="/business/startups" data-trackable="startups-link">Startups</a><nav data-trackable="startups" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS" href="/business/business-deals" data-trackable="business-deals-link">Business deals</a><nav data-trackable="business-deals" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li></ul></nav></li><li class="DesktopNavigationItem_desktopNavigationItem__3rcre" location="landingpagemarkets"><a class="Link_link__qPD1b" href="/business/markets" data-trackable="markets-link">Markets</a><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" class="DesktopNavigationItem_desktopNavigationItemIcon__PYYsl"><path fill-rule="evenodd" d="M1.913 11.288L7.5 5.701l5.587 5.587 1.326-1.326L7.5 3.125.587 9.962z"></path></svg><nav data-trackable="markets" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemDefault__hIXyC"><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS DesktopNavigationHoverListItem_desktopNavigationLinkBold__fj1Oy" href="/business/markets" data-trackable="markets-link">Markets</a><nav data-trackable="markets" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS" href="/business/markets/equities" data-trackable="equities-link">Equities</a><nav data-trackable="equities" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS" href="/business/markets/currencies" data-trackable="currencies-link">Currencies</a><nav data-trackable="currencies" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS" href="/business/markets/bonds" data-trackable="bonds-link">Bonds</a><nav data-trackable="bonds" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS" href="/business/markets/commodities" data-trackable="commodities-link">Commodities</a><nav data-trackable="commodities" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS" href="/business/markets/property" data-trackable="property-link">Property</a><nav data-trackable="property" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS" href="/business/markets/ipo" data-trackable="ipo-link">IPO</a><nav data-trackable="ipo" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS" href="/business/markets/wealth-management" data-trackable="wealth-management-link">Wealth Management</a><nav data-trackable="wealth-management" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li></ul></nav></li><li class="DesktopNavigationItem_desktopNavigationItem__3rcre" location="landingpagetech"><a class="Link_link__qPD1b" href="/business/tech" data-trackable="tech-link">Tech</a><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" class="DesktopNavigationItem_desktopNavigationItemIcon__PYYsl"><path fill-rule="evenodd" d="M1.913 11.288L7.5 5.701l5.587 5.587 1.326-1.326L7.5 3.125.587 9.962z"></path></svg><nav data-trackable="tech" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemDefault__hIXyC"><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS DesktopNavigationHoverListItem_desktopNavigationLinkBold__fj1Oy" href="/business/tech" data-trackable="tech-link">Tech</a><nav data-trackable="tech" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS" href="/techasia" data-trackable="#techasia-link">#techAsia</a><nav data-trackable="#techasia" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS" href="/business/china-tech" data-trackable="china-tech-link">China tech</a><nav data-trackable="china-tech" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS" href="/business/startups" data-trackable="startups-link">Startups</a><nav data-trackable="startups" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS" href="/spotlight/cryptocurrencies" data-trackable="cryptocurrencies-link">Cryptocurrencies</a><nav data-trackable="cryptocurrencies" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS" href="/spotlight/dealstreetasia" data-trackable="dealstreetasia-link">DealStreetAsia</a><nav data-trackable="dealstreetasia" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li></ul></nav></li><li class="DesktopNavigationItem_desktopNavigationItem__3rcre" location="landingpagepolitics"><a class="Link_link__qPD1b" href="/politics" data-trackable="politics-link">Politics</a><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" class="DesktopNavigationItem_desktopNavigationItemIcon__PYYsl"><path fill-rule="evenodd" d="M1.913 11.288L7.5 5.701l5.587 5.587 1.326-1.326L7.5 3.125.587 9.962z"></path></svg><nav data-trackable="politics" class="DesktopNavigationHoverItem_desktopNavigationHoverItemExpanded__Ycd9_ DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemDefault__hIXyC"><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS DesktopNavigationHoverListItem_desktopNavigationLinkBold__fj1Oy" href="/politics" data-trackable="politics-link">Politics</a><nav data-trackable="politics" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS" href="/politics/east-asia/china" data-trackable="china-link">China</a><nav data-trackable="china" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS" href="/politics/east-asia/japan" data-trackable="japan-link">Japan</a><nav data-trackable="japan" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS" href="/politics/south-asia/india" data-trackable="india-link">India</a><nav data-trackable="india" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS" href="/politics/east-asia/south-korea" data-trackable="south-korea-link">South Korea</a><nav data-trackable="south-korea" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS" href="/politics/south-east-asia/indonesia" data-trackable="indonesia-link">Indonesia</a><nav data-trackable="indonesia" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS" href="/politics/east-asia/taiwan" data-trackable="taiwan-link">Taiwan</a><nav data-trackable="taiwan" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS" href="/politics/south-east-asia/thailand" data-trackable="thailand-link">Thailand</a><nav data-trackable="thailand" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS" href="/politics/rest-of-the-world/north-america/u.s" data-trackable="u.s.-link">U.S.</a><nav data-trackable="u.s." class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li></ul><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkDark__yUj72" href="/politics/east-asia" data-trackable="east-asia-link">East Asia<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" class="DesktopNavigationHoverListItem_desktopNavigationItemIcon__5U4yw"><path fill-rule="evenodd" d="M1.913 11.288L7.5 5.701l5.587 5.587 1.326-1.326L7.5 3.125.587 9.962z"></path></svg></a><nav data-trackable="east-asia" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj"><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/politics/east-asia/china" data-trackable="china-link">China</a><nav data-trackable="china" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/politics/east-asia/hong-kong" data-trackable="hong-kong-link">Hong Kong</a><nav data-trackable="hong-kong" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/politics/east-asia/macao" data-trackable="macao-link">Macao</a><nav data-trackable="macao" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/politics/east-asia/taiwan" data-trackable="taiwan-link">Taiwan</a><nav data-trackable="taiwan" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/politics/east-asia/mongolia" data-trackable="mongolia-link">Mongolia</a><nav data-trackable="mongolia" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/politics/east-asia/japan" data-trackable="japan-link">Japan</a><nav data-trackable="japan" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/politics/east-asia/south-korea" data-trackable="south-korea-link">South Korea</a><nav data-trackable="south-korea" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/politics/east-asia/north-korea" data-trackable="north-korea-link">North Korea</a><nav data-trackable="north-korea" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkDark__yUj72" href="/politics/south-east-asia" data-trackable="southeast-asia-link">Southeast Asia<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" class="DesktopNavigationHoverListItem_desktopNavigationItemIcon__5U4yw"><path fill-rule="evenodd" d="M1.913 11.288L7.5 5.701l5.587 5.587 1.326-1.326L7.5 3.125.587 9.962z"></path></svg></a><nav data-trackable="southeast-asia" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj"><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/politics/south-east-asia/indonesia" data-trackable="indonesia-link">Indonesia</a><nav data-trackable="indonesia" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/politics/south-east-asia/thailand" data-trackable="thailand-link">Thailand</a><nav data-trackable="thailand" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/politics/south-east-asia/malaysia" data-trackable="malaysia-link">Malaysia</a><nav data-trackable="malaysia" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/politics/south-east-asia/singapore" data-trackable="singapore-link">Singapore</a><nav data-trackable="singapore" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/politics/south-east-asia/philippines" data-trackable="philippines-link">Philippines</a><nav data-trackable="philippines" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/politics/south-east-asia/vietnam" data-trackable="vietnam-link">Vietnam</a><nav data-trackable="vietnam" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/politics/south-east-asia/myanmar" data-trackable="myanmar-link">Myanmar</a><nav data-trackable="myanmar" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/politics/south-east-asia/cambodia" data-trackable="cambodia-link">Cambodia</a><nav data-trackable="cambodia" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/politics/south-east-asia/laos" data-trackable="laos-link">Laos</a><nav data-trackable="laos" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/politics/south-east-asia/brunei" data-trackable="brunei-link">Brunei</a><nav data-trackable="brunei" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/politics/south-east-asia/east-timor" data-trackable="east-timor-link">East Timor</a><nav data-trackable="east-timor" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkDark__yUj72" href="/politics/south-asia" data-trackable="south-asia-link">South Asia<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" class="DesktopNavigationHoverListItem_desktopNavigationItemIcon__5U4yw"><path fill-rule="evenodd" d="M1.913 11.288L7.5 5.701l5.587 5.587 1.326-1.326L7.5 3.125.587 9.962z"></path></svg></a><nav data-trackable="south-asia" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj"><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/politics/south-asia/india" data-trackable="india-link">India</a><nav data-trackable="india" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/politics/south-asia/pakistan" data-trackable="pakistan-link">Pakistan</a><nav data-trackable="pakistan" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/politics/south-asia/afghanistan" data-trackable="afghanistan-link">Afghanistan</a><nav data-trackable="afghanistan" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/politics/south-asia/bangladesh" data-trackable="bangladesh-link">Bangladesh</a><nav data-trackable="bangladesh" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/politics/south-asia/sri-lanka" data-trackable="sri-lanka-link">Sri Lanka</a><nav data-trackable="sri-lanka" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/politics/south-asia/nepal" data-trackable="nepal-link">Nepal</a><nav data-trackable="nepal" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/politics/south-asia/bhutan" data-trackable="bhutan-link">Bhutan</a><nav data-trackable="bhutan" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/politics/south-asia/maldives" data-trackable="maldives-link">Maldives</a><nav data-trackable="maldives" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkDark__yUj72" href="/politics/central-asia" data-trackable="central-asia-link">Central Asia<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" class="DesktopNavigationHoverListItem_desktopNavigationItemIcon__5U4yw"><path fill-rule="evenodd" d="M1.913 11.288L7.5 5.701l5.587 5.587 1.326-1.326L7.5 3.125.587 9.962z"></path></svg></a><nav data-trackable="central-asia" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj"><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/politics/central-asia/kazakhstan" data-trackable="kazakhstan-link">Kazakhstan</a><nav data-trackable="kazakhstan" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/politics/central-asia/uzbekistan" data-trackable="uzbekistan-link">Uzbekistan</a><nav data-trackable="uzbekistan" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/politics/central-asia/turkmenistan" data-trackable="turkmenistan-link">Turkmenistan</a><nav data-trackable="turkmenistan" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/politics/central-asia/tajikistan" data-trackable="tajikistan-link">Tajikistan</a><nav data-trackable="tajikistan" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/politics/central-asia/kyrgyzstan" data-trackable="kyrgyzstan-link">Kyrgyzstan</a><nav data-trackable="kyrgyzstan" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkDark__yUj72" href="/politics/oceania" data-trackable="oceania-link">Oceania<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" class="DesktopNavigationHoverListItem_desktopNavigationItemIcon__5U4yw"><path fill-rule="evenodd" d="M1.913 11.288L7.5 5.701l5.587 5.587 1.326-1.326L7.5 3.125.587 9.962z"></path></svg></a><nav data-trackable="oceania" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj"><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/politics/oceania/australia" data-trackable="australia-link">Australia</a><nav data-trackable="australia" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/politics/oceania/new-zealand" data-trackable="new-zealand-link">New Zealand</a><nav data-trackable="new-zealand" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/politics/oceania/papua-new-guinea" data-trackable="papua-new-guinea-link">Papua New Guinea</a><nav data-trackable="papua-new-guinea" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/politics/oceania/pacific-islands" data-trackable="pacific-islands-link">Pacific Islands</a><nav data-trackable="pacific-islands" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkDark__yUj72" href="/politics/rest-of-the-world" data-trackable="rest-of-the-world-link">Rest of the World<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" class="DesktopNavigationHoverListItem_desktopNavigationItemIcon__5U4yw"><path fill-rule="evenodd" d="M1.913 11.288L7.5 5.701l5.587 5.587 1.326-1.326L7.5 3.125.587 9.962z"></path></svg></a><nav data-trackable="rest-of-the-world" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj"><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/politics/rest-of-the-world/middle-east" data-trackable="middle-east-link">Middle East</a><nav data-trackable="middle-east" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/politics/rest-of-the-world/russia-caucasus" data-trackable="russia-caucasus-link">Russia &amp; Caucasus</a><nav data-trackable="russia-caucasus" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/politics/rest-of-the-world/north-america" data-trackable="north-america-link">North America</a><nav data-trackable="north-america" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/politics/rest-of-the-world/latin-america" data-trackable="latin-america-link">Latin America</a><nav data-trackable="latin-america" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/politics/rest-of-the-world/europe" data-trackable="europe-link">Europe</a><nav data-trackable="europe" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/politics/rest-of-the-world/africa" data-trackable="africa-link">Africa</a><nav data-trackable="africa" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li></ul></nav></li></ul></nav></li><li class="DesktopNavigationItem_desktopNavigationItem__3rcre" location="landingpageeconomy"><a class="Link_link__qPD1b" href="/economy" data-trackable="economy-link">Economy</a><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" class="DesktopNavigationItem_desktopNavigationItemIcon__PYYsl"><path fill-rule="evenodd" d="M1.913 11.288L7.5 5.701l5.587 5.587 1.326-1.326L7.5 3.125.587 9.962z"></path></svg><nav data-trackable="economy" class="DesktopNavigationHoverItem_desktopNavigationHoverItemExpanded__Ycd9_ DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemDefault__hIXyC"><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS DesktopNavigationHoverListItem_desktopNavigationLinkBold__fj1Oy" href="/economy" data-trackable="economy-link">Economy</a><nav data-trackable="economy" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS" href="/economy/east-asia/china" data-trackable="china-link">China</a><nav data-trackable="china" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS" href="/economy/east-asia/japan" data-trackable="japan-link">Japan</a><nav data-trackable="japan" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS" href="/economy/south-asia/india" data-trackable="india-link">India</a><nav data-trackable="india" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS" href="/economy/east-asia/south-korea" data-trackable="south-korea-link">South Korea</a><nav data-trackable="south-korea" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS" href="/economy/south-east-asia/indonesia" data-trackable="indonesia-link">Indonesia</a><nav data-trackable="indonesia" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS" href="/economy/east-asia/taiwan" data-trackable="taiwan-link">Taiwan</a><nav data-trackable="taiwan" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS" href="/economy/south-east-asia/thailand" data-trackable="thailand-link">Thailand</a><nav data-trackable="thailand" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS" href="/economy/rest-of-the-world/north-america/u.s" data-trackable="u.s.-link">U.S.</a><nav data-trackable="u.s." class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li></ul><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkDark__yUj72" href="/economy/east-asia" data-trackable="east-asia-link">East Asia<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" class="DesktopNavigationHoverListItem_desktopNavigationItemIcon__5U4yw"><path fill-rule="evenodd" d="M1.913 11.288L7.5 5.701l5.587 5.587 1.326-1.326L7.5 3.125.587 9.962z"></path></svg></a><nav data-trackable="east-asia" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj"><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/economy/east-asia/china" data-trackable="china-link">China</a><nav data-trackable="china" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/economy/east-asia/hong-kong" data-trackable="hong-kong-link">Hong Kong</a><nav data-trackable="hong-kong" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/economy/east-asia/macao" data-trackable="macao-link">Macao</a><nav data-trackable="macao" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/economy/east-asia/taiwan" data-trackable="taiwan-link">Taiwan</a><nav data-trackable="taiwan" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/economy/east-asia/mongolia" data-trackable="mongolia-link">Mongolia</a><nav data-trackable="mongolia" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/economy/east-asia/japan" data-trackable="japan-link">Japan</a><nav data-trackable="japan" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/economy/east-asia/south-korea" data-trackable="south-korea-link">South Korea</a><nav data-trackable="south-korea" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/economy/east-asia/north-korea" data-trackable="north-korea-link">North Korea</a><nav data-trackable="north-korea" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkDark__yUj72" href="/economy/south-east-asia" data-trackable="southeast-asia-link">Southeast Asia<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" class="DesktopNavigationHoverListItem_desktopNavigationItemIcon__5U4yw"><path fill-rule="evenodd" d="M1.913 11.288L7.5 5.701l5.587 5.587 1.326-1.326L7.5 3.125.587 9.962z"></path></svg></a><nav data-trackable="southeast-asia" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj"><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/economy/south-east-asia/indonesia" data-trackable="indonesia-link">Indonesia</a><nav data-trackable="indonesia" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/economy/south-east-asia/thailand" data-trackable="thailand-link">Thailand</a><nav data-trackable="thailand" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/economy/south-east-asia/malaysia" data-trackable="malaysia-link">Malaysia</a><nav data-trackable="malaysia" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/economy/south-east-asia/singapore" data-trackable="singapore-link">Singapore</a><nav data-trackable="singapore" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/economy/south-east-asia/philippines" data-trackable="philippines-link">Philippines</a><nav data-trackable="philippines" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/economy/south-east-asia/vietnam" data-trackable="vietnam-link">Vietnam</a><nav data-trackable="vietnam" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/economy/south-east-asia/myanmar" data-trackable="myanmar-link">Myanmar</a><nav data-trackable="myanmar" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/economy/south-east-asia/cambodia" data-trackable="cambodia-link">Cambodia</a><nav data-trackable="cambodia" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/economy/south-east-asia/laos" data-trackable="laos-link">Laos</a><nav data-trackable="laos" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/economy/south-east-asia/brunei" data-trackable="brunei-link">Brunei</a><nav data-trackable="brunei" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/economy/south-east-asia/east-timor" data-trackable="east-timor-link">East Timor</a><nav data-trackable="east-timor" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkDark__yUj72" href="/economy/south-asia" data-trackable="south-asia-link">South Asia<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" class="DesktopNavigationHoverListItem_desktopNavigationItemIcon__5U4yw"><path fill-rule="evenodd" d="M1.913 11.288L7.5 5.701l5.587 5.587 1.326-1.326L7.5 3.125.587 9.962z"></path></svg></a><nav data-trackable="south-asia" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj"><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/economy/south-asia/india" data-trackable="india-link">India</a><nav data-trackable="india" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/economy/south-asia/pakistan" data-trackable="pakistan-link">Pakistan</a><nav data-trackable="pakistan" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/economy/south-asia/afghanistan" data-trackable="afghanistan-link">Afghanistan</a><nav data-trackable="afghanistan" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/economy/south-asia/bangladesh" data-trackable="bangladesh-link">Bangladesh</a><nav data-trackable="bangladesh" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/economy/south-asia/sri-lanka" data-trackable="sri-lanka-link">Sri Lanka</a><nav data-trackable="sri-lanka" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/economy/south-asia/nepal" data-trackable="nepal-link">Nepal</a><nav data-trackable="nepal" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/economy/south-asia/bhutan" data-trackable="bhutan-link">Bhutan</a><nav data-trackable="bhutan" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/economy/south-asia/maldives" data-trackable="maldives-link">Maldives</a><nav data-trackable="maldives" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkDark__yUj72" href="/economy/central-asia" data-trackable="central-asia-link">Central Asia<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" class="DesktopNavigationHoverListItem_desktopNavigationItemIcon__5U4yw"><path fill-rule="evenodd" d="M1.913 11.288L7.5 5.701l5.587 5.587 1.326-1.326L7.5 3.125.587 9.962z"></path></svg></a><nav data-trackable="central-asia" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj"><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/economy/central-asia/kazakhstan" data-trackable="kazakhstan-link">Kazakhstan</a><nav data-trackable="kazakhstan" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/economy/central-asia/uzbekistan" data-trackable="uzbekistan-link">Uzbekistan</a><nav data-trackable="uzbekistan" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/economy/central-asia/turkmenistan" data-trackable="turkmenistan-link">Turkmenistan</a><nav data-trackable="turkmenistan" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/economy/central-asia/tajikistan" data-trackable="tajikistan-link">Tajikistan</a><nav data-trackable="tajikistan" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/economy/central-asia/kyrgyzstan" data-trackable="kyrgyzstan-link">Kyrgyzstan</a><nav data-trackable="kyrgyzstan" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkDark__yUj72" href="/economy/oceania" data-trackable="oceania-link">Oceania<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" class="DesktopNavigationHoverListItem_desktopNavigationItemIcon__5U4yw"><path fill-rule="evenodd" d="M1.913 11.288L7.5 5.701l5.587 5.587 1.326-1.326L7.5 3.125.587 9.962z"></path></svg></a><nav data-trackable="oceania" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj"><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/economy/oceania/australia" data-trackable="australia-link">Australia</a><nav data-trackable="australia" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/economy/oceania/new-zealand" data-trackable="new-zealand-link">New Zealand</a><nav data-trackable="new-zealand" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/economy/oceania/papua-new-guinea" data-trackable="papua-new-guinea-link">Papua New Guinea</a><nav data-trackable="papua-new-guinea" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/economy/oceania/pacific-islands" data-trackable="pacific-islands-link">Pacific Islands</a><nav data-trackable="pacific-islands" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkDark__yUj72" href="/economy/rest-of-the-world" data-trackable="rest-of-the-world-link">Rest of the World<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" class="DesktopNavigationHoverListItem_desktopNavigationItemIcon__5U4yw"><path fill-rule="evenodd" d="M1.913 11.288L7.5 5.701l5.587 5.587 1.326-1.326L7.5 3.125.587 9.962z"></path></svg></a><nav data-trackable="rest-of-the-world" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj"><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/economy/rest-of-the-world/middle-east" data-trackable="middle-east-link">Middle East</a><nav data-trackable="middle-east" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/economy/rest-of-the-world/russia-caucasus" data-trackable="russia-caucasus-link">Russia &amp; Caucasus</a><nav data-trackable="russia-caucasus" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/economy/rest-of-the-world/north-america" data-trackable="north-america-link">North America</a><nav data-trackable="north-america" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/economy/rest-of-the-world/latin-america" data-trackable="latin-america-link">Latin America</a><nav data-trackable="latin-america" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/economy/rest-of-the-world/europe" data-trackable="europe-link">Europe</a><nav data-trackable="europe" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLinkLight__vVv8V" href="/economy/rest-of-the-world/africa" data-trackable="africa-link">Africa</a><nav data-trackable="africa" class="DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8 DesktopNavigationHoverItem_desktopNavigationHoverItemStatic__f9HqV DesktopNavigationHoverItem_desktopNavigationHoverItemGrey__fyBYj" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI undefined"></ul></nav></li></ul></nav></li></ul></nav></li><li class="DesktopNavigationItem_desktopNavigationItem__3rcre" location="landingpagefeatures"><a class="Link_link__qPD1b" href="/features" data-trackable="features-link">Features</a><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" class="DesktopNavigationItem_desktopNavigationItemIcon__PYYsl"><path fill-rule="evenodd" d="M1.913 11.288L7.5 5.701l5.587 5.587 1.326-1.326L7.5 3.125.587 9.962z"></path></svg><nav data-trackable="features" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemDefault__hIXyC"><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS" href="/business/markets/trading-asia" data-trackable="trading-asia-link">Trading Asia</a><nav data-trackable="trading-asia" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS" href="/spotlight/asean-money" data-trackable="asean-money-link">ASEAN Money</a><nav data-trackable="asean-money" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS" href="/business/technology/tech-asia" data-trackable="tech-asia-link">Tech Asia</a><nav data-trackable="tech-asia" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS" href="/editor-s-picks/china-up-close" data-trackable="china-up-close-link">China Up Close</a><nav data-trackable="china-up-close" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS" href="/spotlight/policy-asia" data-trackable="policy-asia-link">Policy Asia</a><nav data-trackable="policy-asia" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS" href="/spotlight/big-in-asia" data-trackable="big-in-asia-link">Big in Asia</a><nav data-trackable="big-in-asia" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS" href="/spotlight/datawatch" data-trackable="datawatch-link">Datawatch</a><nav data-trackable="datawatch" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS" href="/infographics" data-trackable="infographics-link">Infographics</a><nav data-trackable="infographics" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li></ul></nav></li><li class="DesktopNavigationItem_desktopNavigationItem__3rcre" location="landingpageopinion"><a class="Link_link__qPD1b" href="/opinion" data-trackable="opinion-link">Opinion</a><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" class="DesktopNavigationItem_desktopNavigationItemIcon__PYYsl"><path fill-rule="evenodd" d="M1.913 11.288L7.5 5.701l5.587 5.587 1.326-1.326L7.5 3.125.587 9.962z"></path></svg><nav data-trackable="opinion" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemDefault__hIXyC"><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS DesktopNavigationHoverListItem_desktopNavigationLinkBold__fj1Oy" href="/opinion" data-trackable="opinion-link">Opinion</a><nav data-trackable="opinion" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS" href="/editor-s-picks/editor-in-chief-s-picks" data-trackable="editor-in-chief-s-picks-link">Editor-in-Chief&#x27;s Picks</a><nav data-trackable="editor-in-chief-s-picks" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS" href="/opinion/the-nikkei-view" data-trackable="the-nikkei-view-link">The Nikkei View</a><nav data-trackable="the-nikkei-view" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li></ul></nav></li><li class="DesktopNavigationItem_desktopNavigationItem__3rcre" location="landingpagelifearts"><a class="Link_link__qPD1b" href="/life-arts" data-trackable="life-arts-link">Life &amp; Arts</a><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" class="DesktopNavigationItem_desktopNavigationItemIcon__PYYsl"><path fill-rule="evenodd" d="M1.913 11.288L7.5 5.701l5.587 5.587 1.326-1.326L7.5 3.125.587 9.962z"></path></svg><nav data-trackable="life-arts" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemDefault__hIXyC"><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS DesktopNavigationHoverListItem_desktopNavigationLinkBold__fj1Oy" href="/life-arts" data-trackable="life-arts-link">Life &amp; Arts</a><nav data-trackable="life-arts" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS" href="/life-arts/life" data-trackable="life-link">Life</a><nav data-trackable="life" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS" href="/life-arts/arts" data-trackable="arts-link">Arts</a><nav data-trackable="arts" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS" href="/life-arts/my-personal-history" data-trackable="my-personal-history-link">My Personal History</a><nav data-trackable="my-personal-history" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS" href="/editor-s-picks/tea-leaves" data-trackable="tea-leaves-link">Tea Leaves</a><nav data-trackable="tea-leaves" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS" href="/life-arts/life/eat-drink" data-trackable="eat-drink-link">Eat &amp; Drink</a><nav data-trackable="eat-drink" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS" href="/life-arts/life/destinations" data-trackable="destinations-link">Destinations</a><nav data-trackable="destinations" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS" href="/life-arts/books" data-trackable="books-link">Books</a><nav data-trackable="books" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS" href="/life-arts/obituaries" data-trackable="obituaries-link">Obituaries</a><nav data-trackable="obituaries" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li></ul></nav></li><li class="DesktopNavigationItem_desktopNavigationItem__3rcre" location="921a8ebab5594fb122fc01e34eee364a"><a class="Link_link__qPD1b" href="/watch-listen" data-trackable="watch-listen-link">Watch &amp; Listen</a><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" class="DesktopNavigationItem_desktopNavigationItemIcon__PYYsl"><path fill-rule="evenodd" d="M1.913 11.288L7.5 5.701l5.587 5.587 1.326-1.326L7.5 3.125.587 9.962z"></path></svg><nav data-trackable="watch-listen" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemDefault__hIXyC"><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS" href="/spotlight/podcasts" data-trackable="podcasts-link">Podcasts</a><nav data-trackable="podcasts" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS" href="/video" data-trackable="video-link">Video</a><nav data-trackable="video" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li><li><a class="Link_link__qPD1b DesktopNavigationHoverListItem_desktopNavigationLink__P6rwS" href="/photos" data-trackable="photos-link">Photos</a><nav data-trackable="photos" class="DesktopNavigationHoverItem_desktopNavigationHoverItem__Pl6pX DesktopNavigationHoverItem_desktopNavigationHoverItemBase__BqWD8" data-visible="false"><ul class="DesktopNavigationHoverItem_desktopNavigationHoverItemList__fIrkI DesktopNavigationHoverItem_desktopNavigationHoverItemBlue__Jxvyf"></ul></nav></li></ul></nav></li></nav></div></header><div><div class="NewsArticleWrapper_newsArticleWrapper__5WTIa" data-trackable="article"><div class="NewsArticleHeader_newsArticleHeaderContainer__E1PfY"><span class="NewsArticleHeader_newsArticleTagContainer__9oA_J"><a class="ArticleTag_articleTag__P1Zo7" href="/business/energy" data-trackable="primary-tag" data-dark-mode="false">Energy</a></span><h1 class="article-header__title NewsArticleHeader_newsArticleHeaderTitle__4l37k" data-trackable="headline" data-dark-mode="false">In world first, Japan&#x27;s Marubeni tests shipping hydrogen trapped in metal</h1><p class="NewsArticleHeader_newsArticleHeaderSubtitle__ZlvPp" data-trackable="subhead" data-dark-mode="false">Trading house spent a year clearing hurdles to transport clean energy</p></div><div class="NewsArticleOuterContentWrapper_newsArticleOuterContentWrapper__vhU_s"><div data-trackable="image-main" class="NewsArticleHeaderImage_newsArticleHeaderImageContainer__CIe9L" style="display:block"><img class="image-main img-fluid ImageNew_imageNewImageResponsive__f1VTu" src="https://images.ft.com/v3/image/raw/https%3A%2F%2Fcms-image-bucket-productionv3-ap-northeast-1-a7d2.s3.ap-northeast-1.amazonaws.com%2Fimages%2F1%2F1%2F8%2F1%2F12111811-1-eng-GB%2Fe36811d1ab5a-20260206N-Marubeni-container.jpg?width=780&amp;fit=cover&amp;gravity=faces&amp;dpr=2&amp;quality=medium&amp;source=nar-cms&amp;format=auto" alt="20260206N Marubeni shipping container" width="780" height="auto" loading="eager"/></div><p class="NewsArticleCaption_newsArticleCaption__fxo8v" data-trackable="caption" data-dark-mode="false" style="display:block">Marubeni shipped a standard container that held a cylinder containing its hydrogen-storing metal hydride alloy.&nbsp;(Marubeni)</p><div class="NewsArticleDetails_newsArticleDetailsContainer__wnuEM"><div data-trackable="byline" class="NewsArticleDetails_newsArticleDetailsByline__VOUu6">KENTO HIRASHIMA</div><div class="ArticleTimestamp_articleTimestamp__Oknqo" data-dark-mode="false"><div data-trackable="timestamp" data-testid="timestamp" data-dark-mode="false" data-headphone="false" class="timestamp__time NewsArticleDetails_newsArticleDetailsTimestamp__A6wBL ArticleTimestamp_articleTimestampCreated__WDqHG "><span>February 7, 2026 05:38 JST</span></div></div><div class="AiFeaturesSection_aiFeaturesSection__XEKWz NewsArticle_newsArticleAiFeaturesSection__S4s_4"></div></div><div class="NewsArticle_newsArticleActionContainer__WkRTt"></div><div class="NewsArticle_newsArticleOuterContentContainerWrapper__unlkj"><div class="NewsArticle_newsArticleContentContainerWrapper___X4kK"><div class="ArticleBodyWithTracking_articleBodyWithTrackingTranslationWrapper___zPnA"><div class="ezrichtext-field NewsArticleBody_newsArticleBody__wMhF_" id="article-body-preview" data-article-body="" data-trackable="bodytext" data-atlas="body"><div><div><div data-dark-mode="false"><p data-dark-mode="false" class="Paragraph_paragraph__2p1wC">TOKYO -- Japanese trading house Marubeni recently conducted the world&#x27;s first international transport of hydrogen using a metal hydride alloy, a material that can store the gas and enable more efficient shipping.</p></div></div></div></div></div></div><div id="paywall-offer" class=""></div><div class="no-print InreadAd_inreadAd__jV4Tl " data-testid="inread-ad" data-unit-name="7049/NikkeiFT_PC_Inread_video"></div><div id="in-article-newsletter-signup"></div><div class="ArticlePaywallAdvert_articlePaywallAdvert__bQnoM"><div class="no-print InlineAd_inlineAd__9lUP7 " data-testid="inline-ad" data-unit-name="7049/NikkeiFT_PC_Upper_Medium_rectangle"></div></div></div></div><div class="ArticleFooter_articleFooter__bvJUI" data-testid="article-footer"><div class="ArticleFooter_articleFooterContent__6sjFU" data-article-type="News"><div data-trackable="read-next-listing" class="no-print ReadNext_readNext__nO_xK" data-testid="read-next"><div class="ContentTitle_contentTitle__pUTJD ReadNext_readNextPartialUnderlineAfterTitle__R57fn" data-trackable="listing-title"><h2 class="ContentTitle_contentTitleHeader__kVWNw ReadNext_readNextTitle__jlKNb">Read Next</h2></div><div class="ReadNext_readNextContent__Pxxbo"><div class="ReadNext_readNextContainer__xVZfE"><ul class="RelatedArticles_relatedArticles__kFA5N"><div data-trackable="slot-1"><li data-trackable="teaser-splash" class="RelatedArticleFeature_relatedArticleFeature__rI_aA"><div class="RelatedArticleFeature_relatedArticleFeatureImageContainer__hY9zn"><a class="RelatedArticleFeature_relatedArticleFeatureImageWrapper__xfG_q" href="/business/technology/tech-asia/inside-japan-s-long-battle-to-de-chinafy-its-rare-earth-supply-chain" data-trackable="thumbnail"><img class="ImageNew_imageNewImageResponsive__f1VTu RelatedArticleFeature_relatedArticleFeatureImage__CqZh5" href="/business/technology/tech-asia/inside-japan-s-long-battle-to-de-chinafy-its-rare-earth-supply-chain" src="https://images.ft.com/v3/image/raw/https%3A%2F%2Fcms-image-bucket-productionv3-ap-northeast-1-a7d2.s3.ap-northeast-1.amazonaws.com%2Fimages%2F6%2F1%2F6%2F8%2F12058616-1-eng-GB%2Fce746486baee-2026-01-12T022013Z_851541548_RC2CZIAL8PKW_RTRMADP_3_JAPAN-RAREEARTHS.JPG?width=700&amp;fit=cover&amp;gravity=faces&amp;dpr=2&amp;quality=medium&amp;source=nar-cms&amp;format=auto&amp;height=394" alt="Inside Japan&#x27;s long battle to &#x27;de-Chinafy&#x27; its rare earth supply chain" width="700" height="394" loading="eager"/></a></div><div class="RelatedArticleFeature_relatedArticleFeatureContentContainer__aQh8i"><div class="RelatedArticleFeature_relatedArticleFeatureContent__YvdDd"><a href="/business/technology/tech-asia" data-trackable="primary-tag"><div class="Tag_tag__TLJZU RelatedArticleFeature_relatedArticleFeatureTag__epywK" data-dark-mode="false">Tech Asia</div></a><a href="/business/technology/tech-asia/inside-japan-s-long-battle-to-de-chinafy-its-rare-earth-supply-chain" data-trackable="headline"><h4 class="Heading_heading__AsDWN RelatedArticleFeature_relatedArticleFeatureTitle__Tm0c7" data-dark-mode="false">Inside Japan&#x27;s long battle to &#x27;de-Chinafy&#x27; its rare earth supply chain</h4></a></div></div></li></div><div data-trackable="slot-2" class="RelatedArticle_relatedArticleWrapper__9LvOh"><li data-trackable="teaser-article" class="RelatedArticle_relatedArticle__SzKqU"><div class="RelatedArticle_relatedArticleContent__jyhuG"><a href="/business/energy" data-trackable="primary-tag"><div class="Tag_tag__TLJZU RelatedArticle_relatedArticleTag__0OjV_" data-dark-mode="false">Energy</div></a><a href="/business/energy/china-battery-storage-installations-triple-north-america-s-in-2025" data-trackable="headline"><h4 class="Heading_heading__AsDWN RelatedArticle_relatedArticleTitle__eP4yQ" data-dark-mode="false">China battery storage installations triple North America&#x27;s in 2025</h4></a></div><div class="RelatedArticle_relatedArticleImageContainer__aDmU4"><a class="RelatedArticle_relatedArticleImage__5bxeU" href="/business/energy/china-battery-storage-installations-triple-north-america-s-in-2025" data-trackable="thumbnail"><img class="RelatedArticle_relatedArticleImage__5bxeU ImageNew_imageNewImageResponsive__f1VTu" href="/business/energy/china-battery-storage-installations-triple-north-america-s-in-2025" src="https://images.ft.com/v3/image/raw/https%3A%2F%2Fcms-image-bucket-productionv3-ap-northeast-1-a7d2.s3.ap-northeast-1.amazonaws.com%2Fimages%2F6%2F1%2F3%2F2%2F12042316-1-eng-GB%2F530e42656131-GettyImages-2255930014_k.jpg?width=178&amp;fit=cover&amp;gravity=faces&amp;dpr=2&amp;quality=medium&amp;source=nar-cms&amp;format=auto&amp;height=100" alt="China battery storage installations triple North America&#x27;s in 2025" width="178" height="100" loading="eager"/></a></div></li></div><div data-trackable="slot-3" class="RelatedArticle_relatedArticleWrapper__9LvOh"><li data-trackable="teaser-article" class="RelatedArticle_relatedArticle__SzKqU"><div class="RelatedArticle_relatedArticleContent__jyhuG"><a href="/editor-s-picks/interview" data-trackable="primary-tag"><div class="Tag_tag__TLJZU RelatedArticle_relatedArticleTag__0OjV_" data-dark-mode="false">Interview</div></a><a href="/editor-s-picks/interview/next-gen-hondajet-to-take-off-on-green-fuel-for-efficiency-top-engineer" data-trackable="headline"><h4 class="Heading_heading__AsDWN RelatedArticle_relatedArticleTitle__eP4yQ" data-dark-mode="false">Next-gen HondaJet to take off on green fuel for efficiency: top engineer</h4></a></div><div class="RelatedArticle_relatedArticleImageContainer__aDmU4"><a class="RelatedArticle_relatedArticleImage__5bxeU" href="/editor-s-picks/interview/next-gen-hondajet-to-take-off-on-green-fuel-for-efficiency-top-engineer" data-trackable="thumbnail"><img class="RelatedArticle_relatedArticleImage__5bxeU ImageNew_imageNewImageResponsive__f1VTu" href="/editor-s-picks/interview/next-gen-hondajet-to-take-off-on-green-fuel-for-efficiency-top-engineer" src="https://images.ft.com/v3/image/raw/https%3A%2F%2Fcms-image-bucket-productionv3-ap-northeast-1-a7d2.s3.ap-northeast-1.amazonaws.com%2Fimages%2F3%2F8%2F4%2F5%2F11965483-1-eng-GB%2F09444ee892a4-20251231N-HondaJet.jpg?width=178&amp;fit=cover&amp;gravity=faces&amp;dpr=2&amp;quality=medium&amp;source=nar-cms&amp;format=auto&amp;height=100" alt="Next-gen HondaJet to take off on green fuel for efficiency: top engineer" width="178" height="100" loading="eager"/></a></div></li></div><div data-trackable="slot-4" class="RelatedArticle_relatedArticleWrapper__9LvOh"><li data-trackable="teaser-article" class="RelatedArticle_relatedArticle__SzKqU"><div class="RelatedArticle_relatedArticleContent__jyhuG"><a href="/business/business-deals" data-trackable="primary-tag"><div class="Tag_tag__TLJZU RelatedArticle_relatedArticleTag__0OjV_" data-dark-mode="false">Business deals</div></a><a href="/business/business-deals/japanese-companies-take-major-stakes-in-us-synthetic-gas-project" data-trackable="headline"><h4 class="Heading_heading__AsDWN RelatedArticle_relatedArticleTitle__eP4yQ" data-dark-mode="false">Japanese companies take major stakes in US synthetic gas project</h4></a></div><div class="RelatedArticle_relatedArticleImageContainer__aDmU4"><a class="RelatedArticle_relatedArticleImage__5bxeU" href="/business/business-deals/japanese-companies-take-major-stakes-in-us-synthetic-gas-project" data-trackable="thumbnail"><img class="RelatedArticle_relatedArticleImage__5bxeU ImageNew_imageNewImageResponsive__f1VTu" href="/business/business-deals/japanese-companies-take-major-stakes-in-us-synthetic-gas-project" src="https://images.ft.com/v3/image/raw/https%3A%2F%2Fcms-image-bucket-productionv3-ap-northeast-1-a7d2.s3.ap-northeast-1.amazonaws.com%2Fimages%2F3%2F5%2F3%2F2%2F11762353-1-eng-GB%2F9c3e3329f45f-2016-01-22T120000Z_357923653_TB3EC1M1GJSLW_RTRMADP_3_USA-ECONOMY-OIL.JPG?width=178&amp;fit=cover&amp;gravity=faces&amp;dpr=2&amp;quality=medium&amp;source=nar-cms&amp;format=auto&amp;height=100" alt="Japanese companies take major stakes in US synthetic gas project" width="178" height="100" loading="eager"/></a></div></li></div><div data-trackable="slot-5" class="RelatedArticle_relatedArticleWrapper__9LvOh"><li data-trackable="teaser-article" class="RelatedArticle_relatedArticle__SzKqU"><div class="RelatedArticle_relatedArticleContent__jyhuG"><a href="/business/energy" data-trackable="primary-tag"><div class="Tag_tag__TLJZU RelatedArticle_relatedArticleTag__0OjV_" data-dark-mode="false">Energy</div></a><a href="/business/energy/japanese-companies-take-another-crack-at-australian-hydrogen" data-trackable="headline"><h4 class="Heading_heading__AsDWN RelatedArticle_relatedArticleTitle__eP4yQ" data-dark-mode="false">Japanese companies take another crack at Australian hydrogen</h4></a></div><div class="RelatedArticle_relatedArticleImageContainer__aDmU4"><a class="RelatedArticle_relatedArticleImage__5bxeU" href="/business/energy/japanese-companies-take-another-crack-at-australian-hydrogen" data-trackable="thumbnail"><img class="RelatedArticle_relatedArticleImage__5bxeU ImageNew_imageNewImageResponsive__f1VTu" href="/business/energy/japanese-companies-take-another-crack-at-australian-hydrogen" src="https://images.ft.com/v3/image/raw/https%3A%2F%2Fcms-image-bucket-productionv3-ap-northeast-1-a7d2.s3.ap-northeast-1.amazonaws.com%2Fimages%2F4%2F0%2F9%2F4%2F11744904-2-eng-GB%2F45b261cbc8b2-photo_SXM2025101400010147.jpg?width=178&amp;fit=cover&amp;gravity=faces&amp;dpr=2&amp;quality=medium&amp;source=nar-cms&amp;format=auto&amp;height=100" alt="Japanese companies take another crack at Australian hydrogen" width="178" height="100" loading="eager"/></a></div></li></div><div data-trackable="slot-6" class="RelatedArticle_relatedArticleWrapper__9LvOh"><li data-trackable="teaser-article" class="RelatedArticle_relatedArticle__SzKqU"><div class="RelatedArticle_relatedArticleContent__jyhuG"><a href="/editor-s-picks/interview" data-trackable="primary-tag"><div class="Tag_tag__TLJZU RelatedArticle_relatedArticleTag__0OjV_" data-dark-mode="false">Interview</div></a><a href="/editor-s-picks/interview/japan-faces-competitive-pressure-from-china-s-push-for-green-ships" data-trackable="headline"><h4 class="Heading_heading__AsDWN RelatedArticle_relatedArticleTitle__eP4yQ" data-dark-mode="false">Japan faces competitive pressure from China&#x27;s push for green ships</h4></a></div><div class="RelatedArticle_relatedArticleImageContainer__aDmU4"><a class="RelatedArticle_relatedArticleImage__5bxeU" href="/editor-s-picks/interview/japan-faces-competitive-pressure-from-china-s-push-for-green-ships" data-trackable="thumbnail"><img class="RelatedArticle_relatedArticleImage__5bxeU ImageNew_imageNewImageResponsive__f1VTu" href="/editor-s-picks/interview/japan-faces-competitive-pressure-from-china-s-push-for-green-ships" src="https://images.ft.com/v3/image/raw/https%3A%2F%2Fcms-image-bucket-productionv3-ap-northeast-1-a7d2.s3.ap-northeast-1.amazonaws.com%2Fimages%2F1%2F5%2F9%2F9%2F11699951-1-eng-GB%2F0c75358050f2-photo_SXM2025103100015559.jpg?width=178&amp;fit=cover&amp;gravity=faces&amp;dpr=2&amp;quality=medium&amp;source=nar-cms&amp;format=auto&amp;height=100" alt="Japan faces competitive pressure from China&#x27;s push for green ships" width="178" height="100" loading="eager"/></a></div></li></div><div data-trackable="slot-7" class="RelatedArticle_relatedArticleWrapper__9LvOh"><li data-trackable="teaser-article" class="RelatedArticle_relatedArticle__SzKqU"><div class="RelatedArticle_relatedArticleContent__jyhuG"><a href="/business/energy" data-trackable="primary-tag"><div class="Tag_tag__TLJZU RelatedArticle_relatedArticleTag__0OjV_" data-dark-mode="false">Energy</div></a><a href="/business/energy/green-hydrogen-hits-a-red-light-over-high-costs" data-trackable="headline"><h4 class="Heading_heading__AsDWN RelatedArticle_relatedArticleTitle__eP4yQ" data-dark-mode="false">Green hydrogen hits a red light over high costs</h4></a></div><div class="RelatedArticle_relatedArticleImageContainer__aDmU4"><a class="RelatedArticle_relatedArticleImage__5bxeU" href="/business/energy/green-hydrogen-hits-a-red-light-over-high-costs" data-trackable="thumbnail"><img class="RelatedArticle_relatedArticleImage__5bxeU ImageNew_imageNewImageResponsive__f1VTu" href="/business/energy/green-hydrogen-hits-a-red-light-over-high-costs" src="https://images.ft.com/v3/image/raw/https%3A%2F%2Fcms-image-bucket-productionv3-ap-northeast-1-a7d2.s3.ap-northeast-1.amazonaws.com%2Fimages%2F9%2F2%2F3%2F8%2F11668329-2-eng-GB%2F83165e816044-photo_SXM2025110600005884.jpg?width=178&amp;fit=cover&amp;gravity=faces&amp;dpr=2&amp;quality=medium&amp;source=nar-cms&amp;format=auto&amp;height=100" alt="Green hydrogen hits a red light over high costs" width="178" height="100" loading="eager"/></a></div></li></div></ul></div></div></div><div class="OutbrainFooter_outbrainFooter__OI6Bs no-print" style="display:none"><div id="outbrain-footer" data-testid="outbrain-footer" class="OUTBRAIN outbrain outbrain--lower related-articles OutbrainFooter_outbrain__XGgRo" data-src="https://asia.nikkei.com/business/energy/in-world-first-japan-s-marubeni-tests-shipping-hydrogen-trapped-in-metal" data-widget-id="AR_5" data-trackable-context-onward-journey="Outbrain Footer" data-trackable="outbrain-footer" data-track-on-load="true"></div><div class="related-articles RelatedArticles_relatedArticles__kFA5N OutbrainFooter_outbrainRelatedArticles__0W_i4"><div id="div-gpt-ad-1710746285061-0" class="related-articles__article RelatedArticle_relatedArticle__SzKqU OutbrainFooter_outbrainFooterRelatedArticle__zCmzg"></div><div id="div-gpt-ad-1710746396283-0" class="related-articles__article RelatedArticle_relatedArticle__SzKqU OutbrainFooter_outbrainFooterRelatedArticle__zCmzg"></div><div id="div-gpt-ad-1710746559726-0" class="related-articles__article RelatedArticle_relatedArticle__SzKqU OutbrainFooter_outbrainFooterRelatedArticle__zCmzg"></div><div id="div-gpt-ad-1758684427004-0" class="related-articles__article RelatedArticle_relatedArticle__SzKqU OutbrainFooter_outbrainFooterRelatedArticle__zCmzg"></div></div><div class="OutbrainFooter_adYouMightAlsoLike__pH9TK"></div></div><div data-trackable="latest-footer-listing" data-test="latest-footer-listing" class="no-print LatestOnTopicBottom_latestOn___SVM6"><div class="ContentTitle_contentTitle__pUTJD LatestOnTopicBottom_latestOnPartialUnderlineAfterTitle__45yKi" data-trackable="listing-title"><h2 class="ContentTitle_contentTitleHeader__kVWNw LatestOnTopicBottom_latestOnTitle__ruCZU">Latest on <!-- -->Energy</h2></div><div class="LatestOnTopicBottom_latestOnContent__oolEO"><div class="LatestOnTopicBottom_latestOnContainer__58rEh"><div data-trackable="slot-1" class="RelatedArticle_relatedArticleWrapper__9LvOh"><li data-trackable="teaser-article" class="RelatedArticle_relatedArticle__SzKqU"><div class="RelatedArticle_relatedArticleContent__jyhuG"><a href="/business/energy" data-trackable="primary-tag"><div class="Tag_tag__TLJZU RelatedArticle_relatedArticleTag__0OjV_" data-dark-mode="false">Energy</div></a><a href="/business/energy/japan-s-tepco-plans-to-restart-kashiwazaki-kariwa-reactor-on-monday" data-trackable="headline"><h4 class="Heading_heading__AsDWN RelatedArticle_relatedArticleTitle__eP4yQ" data-dark-mode="false">Japan&#x27;s TEPCO plans to restart Kashiwazaki-Kariwa reactor on Monday</h4></a></div><div class="RelatedArticle_relatedArticleImageContainer__aDmU4"><a class="RelatedArticle_relatedArticleImage__5bxeU" href="/business/energy/japan-s-tepco-plans-to-restart-kashiwazaki-kariwa-reactor-on-monday" data-trackable="thumbnail"><img class="RelatedArticle_relatedArticleImage__5bxeU ImageNew_imageNewImageResponsive__f1VTu" href="/business/energy/japan-s-tepco-plans-to-restart-kashiwazaki-kariwa-reactor-on-monday" src="https://images.ft.com/v3/image/raw/https%3A%2F%2Fcms-image-bucket-productionv3-ap-northeast-1-a7d2.s3.ap-northeast-1.amazonaws.com%2Fimages%2F7%2F4%2F2%2F9%2F12109247-2-eng-GB%2Fc3032a911f44-photo_SXM2026020500004647.jpg?width=178&amp;fit=cover&amp;gravity=faces&amp;dpr=2&amp;quality=medium&amp;source=nar-cms&amp;format=auto&amp;height=100" alt="Japan&#x27;s TEPCO plans to restart Kashiwazaki-Kariwa reactor on Monday" width="178" height="100" loading="eager"/></a></div></li></div><div data-trackable="slot-2" class="RelatedArticle_relatedArticleWrapper__9LvOh"><li data-trackable="teaser-article" class="RelatedArticle_relatedArticle__SzKqU"><div class="RelatedArticle_relatedArticleContent__jyhuG"><a href="/business/energy" data-trackable="primary-tag"><div class="Tag_tag__TLJZU RelatedArticle_relatedArticleTag__0OjV_" data-dark-mode="false">Energy</div></a><a href="/business/energy/japan-s-ihi-to-boost-output-of-nuclear-plant-parts-as-ai-drives-up-demand" data-trackable="headline"><h4 class="Heading_heading__AsDWN RelatedArticle_relatedArticleTitle__eP4yQ" data-dark-mode="false">Japan&#x27;s IHI to boost output of nuclear plant parts as AI drives up demand</h4></a></div><div class="RelatedArticle_relatedArticleImageContainer__aDmU4"><a class="RelatedArticle_relatedArticleImage__5bxeU" href="/business/energy/japan-s-ihi-to-boost-output-of-nuclear-plant-parts-as-ai-drives-up-demand" data-trackable="thumbnail"><img class="RelatedArticle_relatedArticleImage__5bxeU ImageNew_imageNewImageResponsive__f1VTu" href="/business/energy/japan-s-ihi-to-boost-output-of-nuclear-plant-parts-as-ai-drives-up-demand" src="https://images.ft.com/v3/image/raw/https%3A%2F%2Fcms-image-bucket-productionv3-ap-northeast-1-a7d2.s3.ap-northeast-1.amazonaws.com%2Fimages%2F7%2F1%2F1%2F2%2F12092117-2-eng-GB%2F5206de6142ed-photo_SXM2026020300008911.jpg?width=178&amp;fit=cover&amp;gravity=faces&amp;dpr=2&amp;quality=medium&amp;source=nar-cms&amp;format=auto&amp;height=100" alt="Japan&#x27;s IHI to boost output of nuclear plant parts as AI drives up demand" width="178" height="100" loading="eager"/></a></div></li></div><div data-trackable="slot-3" class="RelatedArticle_relatedArticleWrapper__9LvOh"><li data-trackable="teaser-article" class="RelatedArticle_relatedArticle__SzKqU"><div class="RelatedArticle_relatedArticleContent__jyhuG"><a href="/business/energy" data-trackable="primary-tag"><div class="Tag_tag__TLJZU RelatedArticle_relatedArticleTag__0OjV_" data-dark-mode="false">Energy</div></a><a href="/business/energy/uk-s-octopus-energy-eyes-tie-ups-with-more-japanese-gas-utilities" data-trackable="headline"><h4 class="Heading_heading__AsDWN RelatedArticle_relatedArticleTitle__eP4yQ" data-dark-mode="false">UK&#x27;s Octopus Energy eyes tie-ups with more Japanese gas utilities</h4></a></div><div class="RelatedArticle_relatedArticleImageContainer__aDmU4"><a class="RelatedArticle_relatedArticleImage__5bxeU" href="/business/energy/uk-s-octopus-energy-eyes-tie-ups-with-more-japanese-gas-utilities" data-trackable="thumbnail"><img class="RelatedArticle_relatedArticleImage__5bxeU ImageNew_imageNewImageResponsive__f1VTu" href="/business/energy/uk-s-octopus-energy-eyes-tie-ups-with-more-japanese-gas-utilities" src="https://images.ft.com/v3/image/raw/https%3A%2F%2Fcms-image-bucket-productionv3-ap-northeast-1-a7d2.s3.ap-northeast-1.amazonaws.com%2Fimages%2F6%2F8%2F3%2F4%2F12084386-2-eng-GB%2F9b9da635bd61-photo_SXM2026013000018198.jpg?width=178&amp;fit=cover&amp;gravity=faces&amp;dpr=2&amp;quality=medium&amp;source=nar-cms&amp;format=auto&amp;height=100" alt="UK&#x27;s Octopus Energy eyes tie-ups with more Japanese gas utilities" width="178" height="100" loading="eager"/></a></div></li></div></div></div></div></div><div class="ArticleFooter_articleFooterAds__XmVWn"><div class="ArticleFooter_articleFooterBottomAdReadNext__IkQ3l"><div class="no-print InlineAd_inlineAd__9lUP7 " data-testid="inline-ad" data-unit-name="7049/NikkeiFT_PC_Lower_Medium_rectangle"></div></div></div></div></div></div><div class="no-print Advertorial_advertorial___RwR5"><div class="Advertorial_main__MBPUt"><div class="ContentTitle_contentTitle__pUTJD ContentTitle_advertorial__dpyYK"><h2 class="ContentTitle_contentTitleHeader__kVWNw">Sponsored Content</h2></div><div class="Advertorial_cardContainer__09Isa"><div class="AdvertorialCard_advertorialCardArticle__D81fJ"></div><div class="AdvertorialCard_advertorialCardArticle__D81fJ"></div><div class="AdvertorialCard_advertorialCardArticle__D81fJ"></div><div class="AdvertorialCard_advertorialCardArticle__D81fJ"></div><div class="AdvertorialCard_advertorialCardArticleLast__7JhMk"></div><h3 class="Tooltip_tooltip__vAjij">About Sponsored Content<span class="Tooltip_tooltipInner__K86Cx">This content was commissioned by Nikkei&#x27;s Global Business Bureau.</span></h3></div></div></div><div class="Footer_footerContainer__1Dvy2"><footer class="no-print Footer_footer__OYoYH"><a class="Footer_newsletterRegisterButton__Hkv9j" href="/member/register/newsletter" data-trackable="signup-button" target="_blank"><svg xmlns="http://www.w3.org/2000/svg" id="icon--mail-contact" width="25px" height="25px" viewBox="0 0 30 23" class="Footer_newsletterRegisterIcon__i27b7"><g id="Group-244"><path id="Shape" d="m0,0l0,22.5l30,0l0,-22.5l-30,0zm8.27875,9.91125l-5.77875,7.14l0,-11.8225l5.77875,4.6825zm-5.17625,-7.41125l23.79375,0l-11.89625,9.64125l-11.8975,-9.64125zm7.1175,8.985l4.78,3.87375l4.7875,-3.88l7.015,8.52125l-23.47375,0l6.89125,-8.515zm11.51,-1.58l5.77,-4.67625l0,11.685l-5.77,-7.00875z"></path></g></svg><span class="Footer_newsletterRegisterText__knALi">Register for our newsletters</span></a><ul class="SocialIcons_socialIcons__XnGD1"><li class="SocialIcons_socialIcon__tGBn6"><a class="Link_link__qPD1b" href="https://www.facebook.com/nikkeiasia" data-trackable="follow-facebook" target="_blank"><svg xmlns="http://www.w3.org/2000/svg" id="icon-facebook" width="12" height="24" viewBox="0 0 12 24" class="SocialIcons_socialIconSvg__m_pZK"><g id="Page-1" fill="currentColor" fill-rule="evenodd" stroke="none" stroke-width="1"><g id="Facebook-hover" fill="currentColor" fill-rule="nonzero"><path id="Shape" d="M3,8 L0,8 L0,12 L3,12 L3,24 L8,24 L8,12 L11.642,12 L12,8 L8,8 L8,6.333 C8,5.378 8.192,5 9.115,5 L12,5 L12,0 L8.192,0 C4.596,0 3,1.583 3,4.615 L3,8 Z"></path></g></g></svg></a></li><li class="SocialIcons_socialIcon__tGBn6"><a class="Link_link__qPD1b" href="https://twitter.com/NikkeiAsia" data-trackable="follow-twitter" target="_blank"><svg xmlns="http://www.w3.org/2000/svg" id="icon-twitter" width="20" height="20" viewBox="0 0 20 20" class="SocialIcons_socialIconSvg__m_pZK"><g id="Page-1" fill="currentColor" fill-rule="evenodd" stroke="none" stroke-width="1"><path id="Twitter" fill="currentColor" fill-rule="nonzero" d="M11.9027 8.46876L19.3482 0.00012207H17.5838L11.119 7.35332L5.95547 0.00012207H0L7.8082 11.1195L0 20.0001H1.76443L8.59152 12.2349L14.0445 20.0001H20L11.9023 8.46876H11.9027ZM9.48608 11.2174L8.69495 10.1102L2.40018 1.2998H5.11025L10.1902 8.41006L10.9813 9.5173L17.5847 18.7596H14.8746L9.48608 11.2178V11.2174Z"></path></g></svg></a></li><li class="SocialIcons_socialIcon__tGBn6"><a class="Link_link__qPD1b" href="https://www.linkedin.com/company/nikkeiasia/" data-trackable="follow-linkedin" target="_blank"><svg xmlns="http://www.w3.org/2000/svg" id="icon-linkedin" width="21" height="20" viewBox="0 0 21 20" class="SocialIcons_socialIconSvg__m_pZK"><g id="Page-1" fill="currentColor" fill-rule="evenodd" stroke="none" stroke-width="1"><g id="Linkedin" fill="currentColor" fill-rule="nonzero"><path id="Shape" d="M4.33,2.174 C4.33,3.374 3.365,4.348 2.174,4.348 C1.59963114,4.34588259 1.04964344,4.11561405 0.64509787,3.70788013 C0.240552297,3.3001462 0.0146084043,2.74836779 0.017,2.174 C0.017,0.974 0.983,0 2.174,0 C3.365,0 4.33,0.974 4.33,2.174 Z M4.348,6.087 L0,6.087 L0,20 L4.348,20 L4.348,6.087 Z M11.288,6.087 L6.968,6.087 L6.968,20 L11.29,20 L11.29,12.697 C11.29,8.636 16.532,8.303 16.532,12.697 L16.532,20 L20.87,20 L20.87,11.19 C20.87,4.338 13.111,4.588 11.289,7.96 L11.289,6.087 L11.288,6.087 Z"></path></g></g></svg></a></li><li class="SocialIcons_socialIcon__tGBn6"><a class="Link_link__qPD1b" href="https://www.instagram.com/nikkeiasia/" data-trackable="follow-instagram" target="_blank"><svg xmlns="http://www.w3.org/2000/svg" id="icon-instagram" width="23" height="23" viewBox="0 0 23 23" class="SocialIcons_socialIconSvg__m_pZK"><g id="Page-1" fill="currentColor" fill-rule="evenodd" stroke="none" stroke-width="1"><g id="Instagram" fill="currentColor" fill-rule="nonzero"><path id="Shape" d="M11.495,0 C8.373,0 7.982,0.013 6.755,0.07 C5.532,0.125 4.697,0.32 3.965,0.604 C3.19832571,0.892784611 2.50385604,1.345299 1.93,1.93 C1.34520271,2.50416611 0.892684717,3.19898258 0.604,3.966 C0.32,4.697 0.126,5.533 0.07,6.756 C0.013,7.983 -1.77635684e-15,8.374 -1.77635684e-15,11.496 C-1.77635684e-15,14.619 0.013,15.01 0.07,16.236 C0.125,17.46 0.32,18.296 0.603,19.026 C0.891555961,19.7933751 1.34408139,20.4885443 1.929,21.063 C2.569,21.703 3.209,22.095 3.965,22.389 C4.697,22.673 5.532,22.868 6.755,22.924 C7.982,22.98 8.373,22.993 11.495,22.993 C14.617,22.993 15.008,22.98 16.235,22.923 C17.458,22.868 18.293,22.673 19.025,22.389 C19.7920174,22.1003153 20.4868339,21.6477973 21.061,21.063 C21.6457723,20.4888134 22.0982865,19.7940028 22.387,19.027 C22.671,18.296 22.865,17.46 22.921,16.237 C22.977,15.01 22.99,14.619 22.99,11.497 C22.99,8.374 22.977,7.983 22.92,6.757 C22.865,5.533 22.67,4.697 22.387,3.966 C22.0979936,3.19890598 21.6451333,2.50408795 21.06,1.93 C20.4858544,1.34517771 19.791032,0.892655892 19.024,0.604 C18.292,0.319 17.457,0.125 16.234,0.069 C15.007,0.013 14.616,0 11.494,0 L11.495,0 Z M11.495,2.071 C14.565,2.071 14.928,2.083 16.14,2.138 C17.26,2.19 17.87,2.377 18.274,2.534 C18.811,2.743 19.194,2.992 19.596,3.394 C19.998,3.797 20.247,4.18 20.456,4.716 C20.613,5.121 20.801,5.73 20.852,6.851 C20.907,8.063 20.919,8.427 20.919,11.496 C20.919,14.566 20.907,14.93 20.852,16.142 C20.801,17.262 20.613,17.872 20.456,18.277 C20.247,18.813 19.998,19.197 19.596,19.598 C19.2251502,19.9798723 18.7734058,20.2737453 18.274,20.458 C17.869,20.616 17.261,20.803 16.14,20.854 C14.928,20.91 14.565,20.921 11.495,20.921 C8.425,20.921 8.062,20.91 6.85,20.854 C5.73,20.804 5.12,20.616 4.716,20.458 C4.21659416,20.2737453 3.76484975,19.9798723 3.394,19.598 C3.01227868,19.2274167 2.71841761,18.7760324 2.534,18.277 C2.377,17.872 2.189,17.263 2.138,16.142 C2.083,14.93 2.071,14.566 2.071,11.496 C2.071,8.426 2.083,8.063 2.138,6.851 C2.189,5.73 2.377,5.121 2.534,4.716 C2.743,4.18 2.992,3.796 3.394,3.394 C3.76484975,3.01212772 4.21659416,2.71825466 4.716,2.534 C5.121,2.377 5.729,2.19 6.85,2.138 C8.062,2.083 8.426,2.071 11.495,2.071 Z"></path><path id="Shape" d="M11.505,15.236 C10.135601,15.2361787 8.87012878,14.5057781 8.18527456,13.319933 C7.50042034,12.134088 7.50022974,10.6729566 8.18477456,9.48693299 C8.86931938,8.30090933 10.134601,7.5701786 11.504,7.57 C13.6209074,7.56972386 15.3372239,9.28559255 15.3375,11.4025 C15.3377761,13.5194074 13.6219074,15.2357239 11.505,15.236 Z M11.505,5.5 C8.24444107,5.50055226 5.60163188,8.1441076 5.60200004,11.4046666 C5.6023682,14.6652255 8.2457743,17.308184 11.5063333,17.3079999 C14.7668922,17.3078158 17.41,14.664559 17.41,11.404 C17.41,9.83798857 16.787836,8.3361315 15.6804049,7.22888797 C14.5729738,6.12164444 13.0710114,5.49973475 11.505,5.5 Z M19.019,5.27 C19.0325091,5.77170353 18.7725724,6.24118769 18.3401962,6.49602043 C17.90782,6.75085317 17.37118,6.75085317 16.9388038,6.49602043 C16.5064276,6.24118769 16.2464909,5.77170353 16.26,5.27 C16.26,4.50784705 16.877847,3.89 17.64,3.89 C18.402153,3.89 19.02,4.50784705 19.02,5.27 L19.019,5.27 Z"></path></g></g></svg></a></li><li class="SocialIcons_socialIcon__tGBn6"><a class="Link_link__qPD1b" href="https://www.youtube.com/user/NikkeiAsia" data-trackable="follow-youtube" target="_blank"><svg xmlns="http://www.w3.org/2000/svg" id="icon-youtube" width="27" height="20" viewBox="0 0 27 20" class="SocialIcons_socialIconSvg__m_pZK"><g id="Page-1" fill="currentColor" fill-rule="evenodd" stroke="none" stroke-width="1"><g id="Youtube" fill="currentColor" fill-rule="nonzero"><path id="Shape" d="M21.794,0.205 C17.79,-0.069 8.871,-0.068 4.872,0.205 C0.542,0.5 0.032,3.115 0,10 C0.032,16.872 0.538,19.499 4.872,19.796 C8.872,20.068 17.79,20.069 21.794,19.796 C26.124,19.5 26.634,16.885 26.667,10 C26.634,3.128 26.129,0.501 21.794,0.205 Z M10,14.445 L10,5.555 L18.889,9.992 L10,14.445 Z"></path></g></g></svg></a></li><li class="SocialIcons_socialIcon__tGBn6"><a class="Link_link__qPD1b" href="https://info.asia.nikkei.com/rss" data-trackable="follow-rss" target="_blank"><svg xmlns="http://www.w3.org/2000/svg" id="icon-rss" width="20" height="20" viewBox="0 0 20 20" class="SocialIcons_socialIconSvg__m_pZK"><g id="Page-1" fill="currentColor" fill-rule="evenodd" stroke="none" stroke-width="1"><g id="RSS" fill="currentColor" fill-rule="nonzero"><path id="Shape" d="M5.42,17.293 C5.41973492,18.0113796 5.13403697,18.7002163 4.62578459,19.2079061 C4.11753221,19.7155958 3.42837948,20.0005306 2.71,20 C1.99162052,20.0005306 1.30246779,19.7155958 0.79421541,19.2079061 C0.285963026,18.7002163 0.000265084571,18.0113796 0,17.293 C0.000530237148,16.5747937 0.286345206,15.8862139 0.794568834,15.3787404 C1.30279246,14.8712669 1.99179369,14.5864694 2.71,14.587 C4.20535902,14.5864471 5.41834411,15.7976418 5.42,17.293 Z M0,6.817 L0,10.826 C5.042,10.878 9.133,14.964 9.185,20 L13.199,20 C13.147,12.742 7.267,6.868 0,6.817 Z M0,4.01 C8.817,4.048 15.96,11.172 15.986,20 L20,20 C19.975,8.974 11.038,0.038 0,0 L0,4.01 Z"></path></g></g></svg></a></li><li class="SocialIcons_socialIcon__tGBn6"><a class="Link_link__qPD1b" href="https://t.me/nikkeiasia" data-trackable="follow-telegram" target="_blank"><svg xmlns="http://www.w3.org/2000/svg" id="icon-telegram" width="25" height="24" fill="currentColor" viewBox="0 0 24 24" class="SocialIcons_socialIconSvg__m_pZK"><path d="M12.5 24C19.1274 24 24.5 18.6274 24.5 12C24.5 5.37258 19.1274 0 12.5 0C5.87258 0 0.5 5.37258 0.5 12C0.5 18.6274 5.87258 24 12.5 24Z"></path><path fill="#000" fill-rule="evenodd" d="M5.93201 11.8735C9.43026 10.3494 11.763 9.34458 12.9301 8.85911C16.2627 7.473 16.9551 7.23222 17.4065 7.22427C17.5058 7.22252 17.7277 7.24712 17.8715 7.36378C17.9929 7.46229 18.0263 7.59536 18.0423 7.68876C18.0583 7.78215 18.0782 7.99491 18.0623 8.16116C17.8817 10.0586 17.1003 14.6633 16.7028 16.7886C16.5346 17.6878 16.2034 17.9893 15.8827 18.0188C15.1858 18.083 14.6567 17.5583 13.9817 17.1159C12.9256 16.4235 12.3289 15.9926 11.3037 15.317C10.119 14.5362 10.887 14.1071 11.5622 13.4058C11.7389 13.2223 14.8093 10.4295 14.8687 10.1762C14.8762 10.1445 14.8831 10.0264 14.8129 9.96403C14.7427 9.90167 14.6392 9.92299 14.5644 9.93995C14.4585 9.964 12.7713 11.0792 9.50276 13.2855C9.02385 13.6144 8.59007 13.7746 8.20141 13.7662C7.77295 13.757 6.94876 13.524 6.33606 13.3248C5.58456 13.0805 4.98728 12.9514 5.03929 12.5365C5.06638 12.3204 5.36395 12.0994 5.93201 11.8735Z" clip-rule="evenodd"></path></svg></a></li><li class="SocialIcons_socialIcon__tGBn6"><a class="Link_link__qPD1b" href="https://www.whatsapp.com/channel/0029VacReBOBqbrEcmjs4U0o" data-trackable="follow-whatsapp" target="_blank"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 28 28" class="SocialIcons_socialIconSvg__m_pZK"><g clip-path="url(#clip0_4133_107323)"><path fill="currentColor" fill-rule="evenodd" d="M23.9202 4.06584C21.2885 1.44525 17.7882 0.00132957 14.0588 0C6.37397 0 0.119658 6.21909 0.116984 13.8635C0.115647 16.3072 0.758058 18.6925 1.97804 20.7946L0 27.9796L7.39072 26.0517C9.4269 27.1566 11.7198 27.7383 14.0528 27.7389H14.0588C21.7423 27.7389 27.9974 21.5192 28 13.8748C28.0013 10.17 26.5527 6.6871 23.9202 4.0665V4.06584ZM14.0588 25.3975H14.0541C11.9751 25.3969 9.93564 24.8411 8.15617 23.7914L7.73299 23.5415L3.34709 24.6856L4.5176 20.4329L4.24218 19.9968C3.08236 18.162 2.46937 16.0413 2.4707 13.8642C2.47338 7.51078 7.67149 2.34138 14.0635 2.34138C17.1586 2.34271 20.0678 3.54266 22.2557 5.72117C24.4437 7.89902 25.6476 10.7949 25.6463 13.8735C25.6436 20.2275 20.4455 25.3969 14.0588 25.3969V25.3975ZM20.4147 16.7673C20.0664 16.5938 18.3538 15.7561 18.0343 15.6405C17.7147 15.5248 17.4828 15.467 17.2508 15.814C17.0189 16.161 16.3511 16.9415 16.1478 17.1721C15.9446 17.4035 15.7414 17.4321 15.3931 17.2585C15.0449 17.085 13.9225 16.7194 12.5915 15.5394C11.5561 14.6206 10.8568 13.4866 10.6536 13.1395C10.4504 12.7925 10.6322 12.605 10.806 12.4328C10.9624 12.2773 11.1543 12.028 11.3287 11.8259C11.5033 11.6238 11.5607 11.4789 11.677 11.2482C11.7934 11.0168 11.7352 10.8148 11.6483 10.6412C11.5614 10.4677 10.8649 8.76253 10.574 8.06918C10.2912 7.39377 10.0039 7.48551 9.79059 7.47421C9.58736 7.46423 9.35542 7.46225 9.12279 7.46225C8.89016 7.46225 8.51309 7.54867 8.19358 7.89569C7.87407 8.24267 6.97426 9.08097 6.97426 10.7855C6.97426 12.49 8.22236 14.1381 8.39681 14.3694C8.57127 14.6008 10.8534 18.0995 14.3476 19.6006C15.1786 19.9576 15.8276 20.171 16.3336 20.3306C17.168 20.5945 17.9273 20.5573 18.5276 20.4682C19.1968 20.3685 20.5886 19.6299 20.8787 18.8208C21.1688 18.0117 21.1688 17.3177 21.0819 17.1734C20.995 17.0292 20.7624 16.9421 20.4141 16.7686L20.4147 16.7673Z" clip-rule="evenodd"></path></g><defs><clipPath id="clip0_4133_107323"><path fill="#fff" d="M0 0H28V28H0z"></path></clipPath></defs></svg></a></li><li class="SocialIcons_socialIcon__tGBn6"><a class="Link_link__qPD1b" href="https://s.nikkei.com/podcasia" data-trackable="follow-podcast" target="_blank"><svg xmlns="http://www.w3.org/2000/svg" id="icon-podcast" width="28" height="28" fill="none" viewBox="0 0 28 28" class="SocialIcons_socialIconSvg__m_pZK"><path fill="currentColor" d="M14 6c-4.411 0-8 3.589-8 8v5c0 1.654 1.346 3 3 3h1c.553 0 1-.448 1-1v-5c0-.552-.447-1-1-1H8v-1c0-3.309 2.691-6 6-6s6 2.691 6 6v1h-2c-.553 0-1 .448-1 1v5c0 .552.447 1 1 1h1c1.654 0 3-1.346 3-3v-5c0-4.411-3.589-8-8-8z"></path><rect width="26" height="26" x="1" y="1" stroke="currentColor" stroke-width="2" rx="4"></rect></svg></a></li><li class="SocialIcons_socialIcon__tGBn6 SocialIcons_socialIconPushNotification__sQvLi"><a class="Link_link__qPD1b" id="browser-push-registration" data-trackable="push-notification"><svg xmlns="http://www.w3.org/2000/svg" width="25" height="26" fill="none" viewBox="0 0 25 26" class="SocialIcons_socialIconSvg__m_pZK"><path fill="currentColor" d="M14.1981 24.5604C14.6134 24.4405 14.9905 24.2472 15.3022 23.9947C15.6139 23.7421 15.8524 23.4366 16.0004 23.1001H10.4004C10.5314 23.398 10.7336 23.6721 10.9953 23.9068C11.2571 24.1414 11.5733 24.3319 11.926 24.4675C12.2786 24.6031 12.6608 24.6811 13.0507 24.697C13.4405 24.713 13.8304 24.6665 14.1981 24.5604Z"></path><path fill="currentColor" d="M20.4877 14.1042C20.5642 16.2008 21.1739 18.2449 22.2614 20.0426C22.3495 20.1882 22.3974 20.3546 22.4001 20.5249C22.4028 20.6951 22.3602 20.8629 22.2766 21.0113C22.1931 21.1596 22.0717 21.283 21.9248 21.369C21.7778 21.4549 21.6107 21.5002 21.4405 21.5003H4.15987C3.98967 21.5002 3.82256 21.4549 3.67564 21.369C3.52872 21.283 3.40728 21.1596 3.32375 21.0113C3.24023 20.8629 3.19763 20.6951 3.20031 20.5249C3.203 20.3546 3.25088 20.1882 3.33904 20.0426C4.47789 18.1599 5.09274 16.0068 5.1199 13.8065V9.9826C5.1199 7.94512 5.92907 5.9911 7.36941 4.55039C8.80974 3.10968 10.7633 2.30029 12.8002 2.30029C14.0723 2.30029 15.3119 2.61598 16.4143 3.20399C14.1408 3.99526 12.5093 6.15724 12.5093 8.70029C12.5093 11.9136 15.1142 14.5185 18.3275 14.5185C19.0908 14.5185 19.8198 14.3715 20.4877 14.1042Z"></path><path fill="currentColor" fill-rule="evenodd" d="M19.2002 5.50049H17.6002V7.90049H15.2002V9.50049H17.6002V11.9005H19.2002V9.50049H21.6002V7.90049H19.2002V5.50049Z" clip-rule="evenodd"></path></svg></a></li></ul><div class="Footer_appStoreIcons__69SPH"><a class="Link_link__qPD1b" href="https://nikkeiasiaios.onelink.me/q8oP/be8e9cfa" data-trackable="apple-app-store-logo" target="_blank"><svg xmlns="http://www.w3.org/2000/svg" id="icon-app-store" width="136" height="40" viewBox="0 0 136 40" class="Footer_appStoreIconSvg__t4T_W"><g fill="none"><path fill="#A6A6A6" d="M110.135 0H9.535c-.367 0-.73 0-1.095.002-.306.002-.61.008-.919.013C6.85.023 6.18.082 5.517.19c-.661.113-1.302.324-1.9.627-.599.306-1.145.704-1.62 1.18-.477.473-.875 1.02-1.178 1.62-.304.6-.514 1.24-.625 1.903-.111.662-.17 1.332-.179 2.002-.01.307-.01.615-.015.921V31.56c.005.31.006.61.015.921.008.671.068 1.34.18 2.002.11.663.32 1.306.624 1.905.303.598.701 1.143 1.179 1.614.473.477 1.02.875 1.618 1.179.599.304 1.24.517 1.901.63.663.11 1.333.168 2.004.177.31.007.613.011.919.011.366.002.728.002 1.095.002h116.6c.36 0 .724 0 1.084-.002.304 0 .617-.004.922-.01.67-.01 1.338-.068 2-.178.663-.114 1.307-.327 1.908-.63.598-.304 1.144-.702 1.617-1.179.476-.473.875-1.018 1.182-1.614.302-.6.51-1.242.619-1.905.111-.661.173-1.33.185-2.002.004-.31.004-.61.004-.921.008-.364.008-.725.008-1.094V17 9.536c0-.366 0-.73-.008-1.092 0-.306 0-.614-.004-.92-.012-.672-.074-1.34-.185-2.003-.109-.662-.318-1.303-.62-1.903-.617-1.203-1.595-2.182-2.798-2.8-.601-.302-1.245-.514-1.908-.627-.661-.11-1.33-.169-2-.176-.305-.005-.618-.011-.922-.013-.36-.002-.725-.002-1.084-.002h-16z"></path><path fill="#000" d="M8.445 39.125c-.305 0-.602-.004-.904-.01-.627-.009-1.251-.063-1.87-.164-.576-.1-1.134-.284-1.656-.548-.517-.261-.99-.605-1.397-1.016-.414-.407-.76-.879-1.02-1.397-.265-.521-.449-1.08-.544-1.657-.103-.62-.158-1.247-.166-1.875-.007-.21-.015-.913-.015-.913v-23.1s.009-.692.015-.895c.007-.628.063-1.253.165-1.872.096-.579.279-1.14.544-1.662.26-.518.603-.99 1.015-1.398.41-.412.884-.757 1.402-1.023.52-.263 1.078-.446 1.653-.544C6.287.95 6.915.895 7.543.887l.902-.012h118.769l.913.013c.623.007 1.244.061 1.858.162.581.099 1.145.284 1.671.548 1.038.535 1.883 1.381 2.415 2.42.26.52.441 1.076.535 1.649.104.624.162 1.255.174 1.887.003.283.003.588.003.89.008.375.008.732.008 1.092v20.929c0 .363 0 .718-.008 1.075 0 .325 0 .623-.004.93-.011.62-.069 1.24-.17 1.853-.094.581-.276 1.145-.54 1.67-.264.513-.607.98-1.016 1.386-.409.414-.881.759-1.4 1.022-.525.266-1.087.452-1.668.55-.618.101-1.243.156-1.869.163-.293.007-.6.011-.897.011l-1.084.002-117.69-.002z"></path><g fill="#FFF"><path d="M15.769 12.3c.022-1.696.911-3.263 2.356-4.151-.915-1.308-2.395-2.108-3.99-2.158-1.68-.176-3.308 1.005-4.164 1.005-.872 0-2.19-.988-3.608-.958-1.867.06-3.565 1.096-4.473 2.727-1.934 3.349-.491 8.27 1.361 10.977.927 1.325 2.01 2.805 3.428 2.753 1.387-.058 1.905-.885 3.58-.885 1.658 0 2.144.885 3.59.852 1.489-.025 2.426-1.332 3.32-2.67.667-.944 1.18-1.988 1.52-3.092-1.769-.748-2.918-2.48-2.92-4.4zM13.037 4.21c.812-.973 1.212-2.225 1.115-3.49-1.24.13-2.385.723-3.208 1.66-.812.924-1.223 2.133-1.144 3.361 1.257.013 2.45-.55 3.237-1.53z" transform="translate(17 8)"></path><path d="M8.302 10.14H3.57l-1.137 3.356H.427L4.911 1.078h2.083l4.483 12.418H9.438L8.302 10.14zM4.06 8.59h3.752l-1.85-5.446H5.91L4.06 8.59zM21.16 8.97c0 2.813-1.506 4.62-3.779 4.62-1.174.062-2.28-.553-2.848-1.583h-.043v4.484H12.63V4.442h1.8v1.506h.033c.593-1.024 1.7-1.638 2.883-1.6 2.298 0 3.813 1.816 3.813 4.622zm-1.91 0c0-1.833-.948-3.038-2.393-3.038-1.42 0-2.375 1.23-2.375 3.038 0 1.824.955 3.046 2.375 3.046 1.445 0 2.393-1.197 2.393-3.046zM31.125 8.97c0 2.813-1.506 4.62-3.779 4.62-1.174.062-2.28-.553-2.848-1.583h-.043v4.484h-1.859V4.442h1.799v1.506h.034c.593-1.024 1.7-1.638 2.883-1.6 2.298 0 3.813 1.816 3.813 4.622zm-1.91 0c0-1.833-.948-3.038-2.393-3.038-1.42 0-2.375 1.23-2.375 3.038 0 1.824.955 3.046 2.375 3.046 1.445 0 2.392-1.197 2.392-3.046zM37.71 10.036c.138 1.232 1.334 2.04 2.97 2.04 1.566 0 2.693-.808 2.693-1.919 0-.964-.68-1.54-2.29-1.936l-1.609-.388c-2.28-.55-3.339-1.617-3.339-3.348 0-2.142 1.867-3.614 4.519-3.614 2.624 0 4.423 1.472 4.483 3.614h-1.876c-.112-1.239-1.136-1.987-2.634-1.987-1.497 0-2.521.757-2.521 1.858 0 .878.654 1.395 2.255 1.79l1.368.336c2.548.603 3.606 1.626 3.606 3.443 0 2.323-1.85 3.778-4.794 3.778-2.753 0-4.613-1.42-4.733-3.667h1.902zM49.346 2.3v2.142h1.722v1.472h-1.722v4.991c0 .776.345 1.137 1.102 1.137.204-.004.408-.018.611-.043v1.463c-.34.063-.686.092-1.032.086-1.833 0-2.548-.689-2.548-2.445V5.914h-1.316V4.442h1.316V2.3h1.867zM52.065 8.97c0-2.849 1.678-4.639 4.294-4.639 2.625 0 4.295 1.79 4.295 4.639 0 2.856-1.661 4.638-4.295 4.638-2.633 0-4.294-1.782-4.294-4.638zm6.695 0c0-1.954-.895-3.108-2.401-3.108-1.506 0-2.4 1.162-2.4 3.108 0 1.962.894 3.106 2.4 3.106 1.506 0 2.401-1.144 2.401-3.106zM62.186 4.442h1.773v1.541h.043c.247-.992 1.156-1.674 2.177-1.635.214-.001.428.022.637.069v1.738c-.27-.082-.552-.12-.835-.112-.546-.022-1.075.196-1.447.596-.373.4-.551.944-.49 1.487v5.37h-1.858V4.442zM75.384 10.837c-.25 1.643-1.85 2.771-3.898 2.771-2.634 0-4.269-1.764-4.269-4.595 0-2.84 1.644-4.682 4.19-4.682 2.506 0 4.08 1.72 4.08 4.466v.637h-6.394v.112c-.06.674.173 1.341.64 1.832.465.49 1.12.757 1.796.732.902.085 1.752-.433 2.09-1.273h1.765zm-6.282-2.702h4.526c.034-.606-.186-1.198-.608-1.634-.421-.437-1.006-.677-1.612-.664-.612-.004-1.199.237-1.632.668-.433.432-.676 1.019-.674 1.63z" transform="translate(17 8) translate(25 9)"></path></g><path fill="#FFF" d="M2.826.731c.79-.057 1.562.244 2.106.818.544.574.801 1.362.702 2.147 0 1.906-1.03 3.002-2.808 3.002H.671V.73h2.155zM1.598 5.854h1.125c.563.034 1.112-.188 1.494-.605.382-.416.556-.982.473-1.541.077-.556-.1-1.118-.48-1.53-.381-.414-.927-.635-1.487-.604H1.598v4.28zM6.68 4.444c-.077-.807.31-1.588 1-2.015.688-.428 1.56-.428 2.249 0 .689.427 1.076 1.208.999 2.015.078.808-.308 1.591-.998 2.02-.69.428-1.562.428-2.252 0-.69-.429-1.076-1.212-.997-2.02zm3.334 0c0-.976-.439-1.547-1.208-1.547-.773 0-1.207.571-1.207 1.547 0 .984.434 1.55 1.207 1.55.77 0 1.208-.57 1.208-1.55zM16.573 6.698L15.651 6.698 14.721 3.381 14.65 3.381 13.724 6.698 12.811 6.698 11.569 2.195 12.471 2.195 13.277 5.631 13.344 5.631 14.27 2.195 15.122 2.195 16.048 5.631 16.118 5.631 16.921 2.195 17.81 2.195zM18.854 2.195h.855v.715h.066c.231-.527.771-.849 1.344-.802.444-.033.879.137 1.182.463.303.325.442.771.377 1.212v2.915h-.889V4.006c0-.724-.314-1.084-.972-1.084-.3-.014-.593.104-.8.324-.206.22-.307.518-.275.817v2.635h-.888V2.195zM24.094.437L24.982.437 24.982 6.698 24.094 6.698zM26.218 4.444c-.077-.807.31-1.588.999-2.015.689-.428 1.56-.428 2.25 0 .688.427 1.076 1.208.998 2.015.079.808-.308 1.591-.997 2.02-.69.428-1.563.428-2.252 0-.69-.429-1.077-1.212-.998-2.02zm3.333 0c0-.976-.439-1.547-1.208-1.547-.773 0-1.207.571-1.207 1.547 0 .984.434 1.55 1.207 1.55.77 0 1.208-.57 1.208-1.55zM31.4 5.424c0-.81.604-1.278 1.676-1.344l1.22-.07V3.62c0-.475-.315-.744-.922-.744-.497 0-.84.182-.939.5h-.86c.09-.773.818-1.27 1.84-1.27 1.128 0 1.765.563 1.765 1.514v3.077h-.855v-.633h-.07c-.291.462-.808.732-1.353.707-.382.04-.764-.084-1.05-.34-.286-.258-.45-.623-.451-1.008zm2.895-.384v-.377l-1.1.07c-.62.042-.9.253-.9.65 0 .405.351.64.834.64.287.03.572-.059.792-.244.22-.186.355-.452.374-.74zM36.348 4.444c0-1.423.732-2.324 1.87-2.324.574-.026 1.112.281 1.38.79h.067V.437h.888v6.26h-.851v-.71h-.07c-.29.504-.834.806-1.415.785-1.145 0-1.869-.901-1.869-2.328zm.918 0c0 .955.45 1.53 1.203 1.53.75 0 1.212-.583 1.212-1.526 0-.938-.468-1.53-1.212-1.53-.748 0-1.203.58-1.203 1.526zM44.23 4.444c-.077-.807.31-1.588.999-2.015.689-.428 1.56-.428 2.25 0 .688.427 1.075 1.208.998 2.015.079.808-.308 1.591-.997 2.02-.69.428-1.563.428-2.252 0-.69-.429-1.077-1.212-.998-2.02zm3.333 0c0-.976-.438-1.547-1.208-1.547-.772 0-1.207.571-1.207 1.547 0 .984.435 1.55 1.207 1.55.77 0 1.208-.57 1.208-1.55zM49.67 2.195h.855v.715h.066c.231-.527.77-.849 1.344-.802.444-.033.879.137 1.182.463.303.325.442.771.377 1.212v2.915h-.889V4.006c0-.724-.314-1.084-.972-1.084-.3-.014-.593.104-.8.324-.206.22-.307.518-.275.817v2.635h-.889V2.195zM58.515 1.074v1.141h.976v.749h-.976v2.315c0 .472.194.679.637.679.113 0 .226-.008.339-.021v.74c-.16.029-.322.044-.484.046-.988 0-1.381-.348-1.381-1.216V2.964h-.715v-.749h.715V1.074h.89zM60.705.437h.88v2.481h.07c.243-.53.792-.853 1.374-.806.441-.024.87.15 1.17.474.3.325.44.767.38 1.205v2.907h-.889V4.01c0-.72-.335-1.084-.963-1.084-.31-.025-.614.087-.832.307-.219.22-.33.526-.302.835v2.63h-.888V.437zM69.761 5.482c-.249.85-1.07 1.398-1.95 1.303-.601.016-1.178-.233-1.579-.68-.4-.449-.584-1.05-.502-1.645-.08-.596.103-1.198.501-1.65.399-.45.973-.707 1.575-.702 1.253 0 2.009.856 2.009 2.27v.31h-3.18v.05c-.028.334.086.664.315.91.228.246.55.384.884.38.435.052.858-.164 1.072-.546h.855zM66.635 4.03h2.275c.022-.306-.085-.607-.296-.829-.211-.222-.506-.345-.813-.338-.31-.004-.61.118-.829.338-.22.22-.34.518-.337.829z" transform="translate(43 8)"></path></g></svg></a><a class="Link_link__qPD1b" href="https://nikkeiasiaandroid.onelink.me/gUfe/aa627ce1" data-trackable="google-play-store-logo" target="_blank"><svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" id="svg51" width="180" height="53.333" viewBox="0 0 180 53.333" class="Footer_appStoreIconSvg__t4T_W"><path id="path11" fill="#100f0d" stroke-width="0.133" d="m173.33 53.333h-166.66c-3.6666 0-6.6665-2.9999-6.6665-6.6665v-39.999c0-3.6666 2.9999-6.6665 6.6665-6.6665h166.66c3.6666 0 6.6665 2.9999 6.6665 6.6665v39.999c0 3.6666-2.9999 6.6665-6.6665 6.6665"></path><path id="path13" fill="#a2a2a1" stroke-width="0.133" d="m173.33 1e-3h-166.66c-3.6666 0-6.6665 2.9999-6.6665 6.6665v39.999c0 3.6666 2.9999 6.6665 6.6665 6.6665h166.66c3.6666 0 6.6665-2.9999 6.6665-6.6665v-39.999c0-3.6666-2.9999-6.6665-6.6665-6.6665zm0 1.0661c3.0879 0 5.5999 2.5125 5.5999 5.6004v39.999c0 3.0879-2.5119 5.6004-5.5999 5.6004h-166.66c-3.0879 0-5.5993-2.5125-5.5993-5.6004v-39.999c0-3.0879 2.5114-5.6004 5.5993-5.6004h166.66"></path><path id="path35" fill="#fff" stroke-width="0.133" d="m142.58 40h2.4879v-16.669h-2.4879zm22.409-10.664-2.8519 7.2264h-0.0853l-2.9599-7.2264h-2.6799l4.4399 10.1-2.5319 5.6185h2.5946l6.8412-15.718zm-14.11 8.7706c-0.81331 0-1.9506-0.40786-1.9506-1.4156 0-1.2865 1.416-1.7797 2.6373-1.7797 1.0933 0 1.6093 0.23546 2.2733 0.55732-0.19333 1.5442-1.5226 2.6379-2.9599 2.6379zm0.30133-9.1352c-1.8013 0-3.6666 0.79371-4.4386 2.5521l2.208 0.92184c0.47198-0.92184 1.3506-1.2218 2.2733-1.2218 1.2866 0 2.5946 0.77131 2.6159 2.1442v0.17133c-0.45066-0.25733-1.416-0.64318-2.5946-0.64318-2.3813 0-4.8039 1.3077-4.8039 3.7524 0 2.2302 1.952 3.6671 4.1386 3.6671 1.672 0 2.5959-0.75054 3.1732-1.6301h0.0867v1.2874h2.4026v-6.391c0-2.9593-2.2106-4.6103-5.0612-4.6103zm-15.376 2.3937h-3.5386v-5.7133h3.5386c1.86 0 2.9159 1.5396 2.9159 2.8566 0 1.2917-1.056 2.8567-2.9159 2.8567zm-0.064-8.0337h-5.9614v16.669h2.4869v-6.3149h3.4746c2.7573 0 5.4679-1.9958 5.4679-5.1765 0-3.1801-2.7106-5.1769-5.4679-5.1769zm-32.507 14.778c-1.7188 0-3.1573-1.4396-3.1573-3.415 0-1.9984 1.4385-3.4583 3.1573-3.4583 1.6969 0 3.0286 1.46 3.0286 3.4583 0 1.9754-1.3317 3.415-3.0286 3.415zm2.8567-7.8403h-0.086c-0.55826-0.66572-1.6328-1.2672-2.9853-1.2672-2.8359 0-5.4348 2.4921-5.4348 5.6925 0 3.1786 2.5989 5.6488 5.4348 5.6488 1.3525 0 2.427-0.6016 2.9853-1.2885h0.086v0.81558c0 2.1703-1.1598 3.3296-3.0286 3.3296-1.5245 0-2.4697-1.0953-2.8567-2.0188l-2.1691 0.90206c0.62238 1.503 2.2759 3.351 5.0259 3.351 2.9218 0 5.392-1.7188 5.392-5.9077v-10.181h-2.3634zm4.0822 9.7304h2.4906v-16.669h-2.4906zm6.164-5.4988c-0.0641-2.1911 1.6978-3.3078 2.9645-3.3078 0.98851 0 1.8254 0.49425 2.1057 1.2026zm7.7326-1.8906c-0.47238-1.2666-1.9114-3.6082-4.8541-3.6082-2.9218 0-5.3488 2.2983-5.3488 5.6707 0 3.1791 2.4062 5.6707 5.6275 5.6707 2.5989 0 4.1031-1.589 4.7264-2.513l-1.9333-1.289c-0.64465 0.94531-1.5249 1.5682-2.7931 1.5682-1.2666 0-2.1692-0.58012-2.7483-1.7186l7.5815-3.1359zm-60.409-1.8682v2.4057h5.7565c-0.17186 1.3532-0.62292 2.3411-1.3104 3.0286-0.83798 0.83745-2.1483 1.7614-4.4462 1.7614-3.5443 0-6.315-2.8567-6.315-6.4009s2.7707-6.4013 6.315-6.4013c1.9118 0 3.3077 0.75198 4.3388 1.7186l1.6974-1.6973c-1.4396-1.3745-3.351-2.427-6.0362-2.427-4.8552 0-8.9363 3.9524-8.9363 8.807 0 4.8541 4.0811 8.8066 8.9363 8.8066 2.6202 0 4.5967-0.85932 6.143-2.4702 1.5896-1.5896 2.0838-3.8234 2.0838-5.628 0-0.55785-0.04333-1.0734-0.1292-1.5032zm14.772 7.3675c-1.7188 0-3.201-1.4177-3.201-3.4368 0-2.0406 1.4822-3.4364 3.201-3.4364 1.7181 0 3.2003 1.3958 3.2003 3.4364 0 2.0191-1.4822 3.4368-3.2003 3.4368zm0-9.1075c-3.137 0-5.6927 2.3842-5.6927 5.6707 0 3.265 2.5557 5.6707 5.6927 5.6707 3.1358 0 5.692-2.4057 5.692-5.6707 0-3.2865-2.5562-5.6707-5.692-5.6707zm12.417 9.1075c-1.7176 0-3.2003-1.4177-3.2003-3.4368 0-2.0406 1.4828-3.4364 3.2003-3.4364 1.7188 0 3.2005 1.3958 3.2005 3.4364 0 2.0191-1.4817 3.4368-3.2005 3.4368zm0-9.1075c-3.1358 0-5.6915 2.3842-5.6915 5.6707 0 3.265 2.5557 5.6707 5.6915 5.6707 3.137 0 5.6927-2.4057 5.6927-5.6707 0-3.2865-2.5557-5.6707-5.6927-5.6707"></path><path id="path37" fill="#eb3131" stroke-width="0.133" d="m27.622 25.899-14.194 15.066c5.34e-4 0.0031 0.0016 0.0057 0.0021 0.0089 0.43532 1.636 1.9296 2.8406 3.703 2.8406 0.70892 0 1.3745-0.19166 1.9453-0.52812l0.04533-0.02656 15.978-9.22-7.479-8.141"></path><path id="path39" fill="#f6b60b" stroke-width="0.133" d="m41.983 23.334-0.0136-0.0093-6.8982-3.999-7.7717 6.9156 7.7987 7.7977 6.8618-3.9592c1.203-0.64945 2.0197-1.9177 2.0197-3.3802 0-1.452-0.80571-2.7139-1.9968-3.3655"></path><path id="path41" fill="#5778c5" stroke-width="0.133" d="m13.426 12.37c-0.08533 0.31466-0.13018 0.64425-0.13018 0.98651v26.623c0 0.34162 0.04432 0.67233 0.13072 0.98587l14.684-14.681-14.684-13.914"></path><path id="path43" fill="#3bad49" stroke-width="0.133" d="m27.727 26.668 7.3473-7.3451-15.96-9.2534c-0.58012-0.34746-1.2572-0.54799-1.9817-0.54799-1.7734 0-3.2697 1.2068-3.7051 2.8447-5.34e-4 0.0016-5.34e-4 0.0027-5.34e-4 0.0041l14.3 14.298"></path><path id="path33" fill="#fff" stroke="#fff" stroke-miterlimit="10" stroke-width="0.267" d="m63.193 13.042h-3.8895v0.96251h2.9146c-0.0792 0.78545-0.39172 1.4021-0.91878 1.85-0.52705 0.44799-1.2 0.67292-1.9958 0.67292-0.87291 0-1.6125-0.30413-2.2186-0.90824-0.59385-0.61665-0.89584-1.3792-0.89584-2.2979 0-0.91864 0.30199-1.6812 0.89584-2.2978 0.60612-0.60412 1.3457-0.90624 2.2186-0.90624 0.44799 0 0.87504 0.07707 1.2666 0.24586 0.39172 0.16866 0.70625 0.40412 0.95211 0.70625l0.73958-0.73958c-0.33546-0.38132-0.76038-0.67292-1.2876-0.88544-0.52705-0.21253-1.077-0.31453-1.6708-0.31453-1.1645 0-2.1519 0.40412-2.9582 1.2104-0.80625 0.80825-1.2104 1.8041-1.2104 2.9811 0 1.177 0.40412 2.175 1.2104 2.9813 0.80625 0.80611 1.7937 1.2104 2.9582 1.2104 1.2229 0 2.1979-0.39172 2.9479-1.1876 0.66038-0.66238 0.99784-1.5582 0.99784-2.679 0-0.1896-0.02293-0.39172-0.05627-0.60425zm1.5068-3.7332v8.0249h4.6852v-0.98544h-3.654v-2.5457h3.2958v-0.96251h-3.2958v-2.5437h3.654v-0.98758zm11.255 0.98758v-0.98758h-5.5145v0.98758h2.2417v7.0373h1.0312v-7.0373zm4.9925-0.98758h-1.0312v8.0249h1.0312zm6.8066 0.98758v-0.98758h-5.5144v0.98758h2.2415v7.0373h1.0312v-7.0373zm10.406 0.05626c-0.79585-0.81877-1.7708-1.2229-2.9354-1.2229-1.1666 0-2.1415 0.40412-2.9374 1.2104-0.79585 0.79585-1.1874 1.7937-1.1874 2.9811s0.39159 2.1854 1.1874 2.9813c0.79585 0.80611 1.7708 1.2104 2.9374 1.2104 1.1541 0 2.1395-0.40426 2.9354-1.2104 0.79585-0.79585 1.1874-1.7938 1.1874-2.9813 0-1.177-0.39159-2.1729-1.1874-2.9686zm-5.1332 0.67078c0.59372-0.60412 1.3229-0.90624 2.1978-0.90624 0.87291 0 1.6021 0.30213 2.1854 0.90624 0.59372 0.59372 0.88531 1.3686 0.88531 2.2978 0 0.93131-0.29159 1.7041-0.88531 2.2979-0.58332 0.60412-1.3125 0.90824-2.1854 0.90824-0.87491 0-1.6041-0.30413-2.1978-0.90824-0.58132-0.60625-0.87291-1.3666-0.87291-2.2979 0-0.92918 0.29159-1.6916 0.87291-2.2978zm8.7706 1.3125-0.0437-1.548h0.0437l4.0791 6.5457h1.077v-8.0249h-1.0312v4.6957l0.0437 1.548h-0.0437l-3.8999-6.2437h-1.2562v8.0249h1.0312z"></path></svg></a></div><section class="Footer_navigationSection__5NsgZ"><nav class="FooterNavigation_navigation__QdA14"><h4 class="FooterNavigation_heading__7YbKY">About Nikkei Asia</h4><ul class="FooterNavigation_navigationList__XbpDt"><li class="FooterNavigation_navigationItem__3xd6p"><a class="Link_link__qPD1b" data-trackable="about-us-link" href="/about" target="_blank">About us</a></li><li class="FooterNavigation_navigationItem__3xd6p"><a class="Link_link__qPD1b" data-trackable="sitemap-link" href="https://info.asia.nikkei.com/sitemap" target="_blank">Sitemap</a></li><li class="FooterNavigation_navigationItem__3xd6p"><a class="Link_link__qPD1b" data-trackable="announcements-link" href="/Announcements" target="_blank">Announcements</a></li><li class="FooterNavigation_navigationItem__3xd6p"><a class="Link_link__qPD1b" data-trackable="advertising-link" href="https://marketing.nikkei.com/english/audience/asia/" target="_blank">Advertise with Nikkei Asia</a></li><li class="FooterNavigation_navigationItem__3xd6p"><a class="Link_link__qPD1b" data-trackable="about-nikkei-link" href="https://www.nikkei.co.jp/nikkeiinfo/en" target="_blank">About NIKKEI</a></li></ul></nav><nav class="FooterNavigation_navigation__QdA14"><h4 class="FooterNavigation_heading__7YbKY">Support</h4><ul class="FooterNavigation_navigationList__XbpDt"><li class="FooterNavigation_navigationItem__3xd6p"><a class="Link_link__qPD1b" data-trackable="help-link" href="https://help.asia.nikkei.com" target="_blank">Help / Contact us</a></li><li class="FooterNavigation_navigationItem__3xd6p"><a class="Link_link__qPD1b" data-trackable="tips-link" href="https://info.asia.nikkei.com/guide" target="_blank">View site tips</a></li></ul></nav><nav class="FooterNavigation_navigation__QdA14"><h4 class="FooterNavigation_heading__7YbKY">Subscriptions</h4><ul class="FooterNavigation_navigationList__XbpDt"><li class="FooterNavigation_navigationItem__3xd6p"><a class="Link_link__qPD1b" data-trackable="subscription-link" href="/member/register/" target="_blank">Individual subscription</a></li><li class="FooterNavigation_navigationItem__3xd6p"><a class="Link_link__qPD1b" data-trackable="corporate-subscription-link" href="https://corporate.asia.nikkei.com/" target="_blank">Corporate subscription</a></li><li class="FooterNavigation_navigationItem__3xd6p"><a class="Link_link__qPD1b" data-trackable="gift-subscription-link" href="/member/register/gift/purchase/?utm_source=organic&amp;utm_medium=sitemap&amp;utm_campaign=gift202303" target="_blank">Gift subscription</a></li></ul></nav><nav class="FooterNavigation_navigation__QdA14"><h4 class="FooterNavigation_heading__7YbKY">Legal &amp; Privacy</h4><ul class="FooterNavigation_navigationList__XbpDt"><li class="FooterNavigation_navigationItem__3xd6p"><a class="Link_link__qPD1b" data-trackable="terms-of-use-link" href="https://info.asia.nikkei.com/terms-of-use" target="_blank">Terms of use</a></li><li class="FooterNavigation_navigationItem__3xd6p"><a class="Link_link__qPD1b" data-trackable="copyright-link" href="https://info.asia.nikkei.com/copyright" target="_blank">Copyright</a></li><li class="FooterNavigation_navigationItem__3xd6p"><a class="Link_link__qPD1b" data-trackable="privacy-cookie-policy--link" href="https://info.asia.nikkei.com/privacy" target="_blank">Privacy &amp; Cookie policy</a></li><li class="FooterNavigation_navigationItem__3xd6p"><a class="Link_link__qPD1b" data-trackable="information-transmission-link" href="https://www.nikkei.com/lounge/privacy/cookie/optout.html#nikkeiasia" target="_blank">Information Transmission</a></li></ul></nav><nav class="FooterNavigation_navigation__QdA14"><h4 class="FooterNavigation_heading__7YbKY">Event</h4><ul class="FooterNavigation_navigationList__XbpDt"><li class="FooterNavigation_navigationItem__3xd6p"><a class="Link_link__qPD1b" data-trackable="nikkei-global-events-link" href="https://www.global-nikkei.com/events/" target="_blank">Nikkei Global Events</a></li></ul></nav></section><div class="Footer_copyright__1ODhL"><a class="Footer_footerNikkeiLogoLink__yCYrw" href="https://www.nikkei.co.jp/nikkeiinfo/en" data-trackable="nikkei-logo-link" target="_blank"><svg xmlns="http://www.w3.org/2000/svg" width="70" height="15" fill="none" viewBox="0 0 70 15" style="height:18px;width:100%"><path fill="#606060" d="M14.2461 0L11.6407 9.7216L8.43479 1.68497e-05L4.02013 0L0 15H3.64698H3.66353H3.6672L6.45692 4.58133L9.87951 15H13.8852H13.8896L17.9097 0H14.2461Z"></path><path fill="#606060" d="M66.5494 0L62.5293 15H66.1928L70.213 0H66.5494Z"></path><path fill="#606060" d="M20.1051 0L16.085 15H19.7485L23.7686 0H20.1051Z"></path><path fill="#606060" d="M61.1173 8.84169L61.8649 6.05227H55.6233L56.4283 3.0485H63.4199L64.2369 1.68497e-05L53.5818 0L49.6513 14.6658L46.7603 6.94088H45.625H45.6221L52.4827 1.68497e-05H48.1581L41.7551 6.36849L43.462 0H39.7984L35.846 14.7476L32.9244 6.94088H31.789H31.7862L38.6468 1.68497e-05H34.3222L27.9192 6.36849L29.626 0H25.9625L21.9424 15H22.0171H25.5801H25.6059L27.7658 6.94088H29.0615L31.6986 15H39.4161H39.4418L41.6017 6.94088H42.8975L45.5345 15H60.3201L61.136 11.9558H54.0411L54.8757 8.84169H61.1173Z"></path></svg></a><span class="Footer_copyrightText__X2QNr">No reproduction without permission.</span></div></footer></div><noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PGQQD4B" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript></div><script id="__NEXT_DATA__" type="application/json">{"props":{"pageProps":{"data":{"__typename":"Article","id":"4895cc98b6dbb905c08bae448d30888b","versionNumber":8,"url":"https://asia.nikkei.com/business/energy/in-world-first-japan-s-marubeni-tests-shipping-hydrogen-trapped-in-metal","lastModifiedDate":1770410293,"headline":"In world first, Japan's Marubeni tests shipping hydrogen trapped in metal","image":{"name":"20260206N Marubeni shipping container","caption":"Marubeni shipped a standard container that held a cylinder containing its hydrogen-storing metal hydride alloy.\\u0026nbsp;(Marubeni)","credit":null,"fullCaption":"Marubeni shipped a standard container that held a cylinder containing its hydrogen-storing metal hydride alloy.\\u0026nbsp;(Marubeni)","imageUrl":"https://cms-image-bucket-productionv3-ap-northeast-1-a7d2.s3.ap-northeast-1.amazonaws.com/images/1/1/8/1/12111811-1-eng-GB/e36811d1ab5a-20260206N-Marubeni-container.jpg","variation":"original","expiresAt":null,"__typename":"Image"},"thumbnailImage":null,"primaryTag":{"remoteId":"65e2de5d36ff0f92afbfa9e0773dadd4","name":"Energy","path":"/business/energy","__typename":"Tag"},"rootCategory":{"remoteId":"landingpagebusiness","name":"Business","__typename":"Tag"},"subhead":"Trading house spent a year clearing hurdles to transport clean energy","missile":false,"expiresAt":1778186293,"free":false,"paywallState":"paid","path":"/business/energy/in-world-first-japan-s-marubeni-tests-shipping-hydrogen-trapped-in-metal","author":null,"createdDate":1770410293,"displayDate":1770410293,"updateFlag":false,"inlineRelatedArticles":null,"relatedArticles":null,"isPublished":true,"remoteId":null,"additionalTags":[{"remoteId":"02921b1d1cf688741f664d65709c410d","name":"Transportation","path":"/business/transportation","__typename":"Tag"},{"remoteId":"fbe0c0c457513f5997b4323169c8f3bd","name":"Companies","path":"/business/companies","__typename":"Tag"},{"remoteId":"landingpageaustralia","name":"Australia","path":"/location/oceania/australia","__typename":"Tag"},{"remoteId":"landingpageindonesia","name":"Indonesia","path":"/location/southeast-asia/indonesia","__typename":"Tag"},{"remoteId":"5c9f7473bc0b304a9afc597aba2ff943","name":"Environment","path":"/spotlight/environment","__typename":"Tag"}],"appearsOn":[{"remoteId":"65e2de5d36ff0f92afbfa9e0773dadd4","name":"Energy","path":"/business/energy","__typename":"Tag"},{"remoteId":"02921b1d1cf688741f664d65709c410d","name":"Transportation","path":"/business/transportation","__typename":"Tag"},{"remoteId":"fbe0c0c457513f5997b4323169c8f3bd","name":"Companies","path":"/business/companies","__typename":"Tag"},{"remoteId":"landingpageaustralia","name":"Australia","path":"/location/oceania/australia","__typename":"Tag"},{"remoteId":"landingpageindonesia","name":"Indonesia","path":"/location/southeast-asia/indonesia","__typename":"Tag"},{"remoteId":"5c9f7473bc0b304a9afc597aba2ff943","name":"Environment","path":"/spotlight/environment","__typename":"Tag"},{"remoteId":"landingpagejapan","name":"Japan","path":"/location/east-asia/japan","__typename":"Tag"},{"remoteId":"landingpagebusiness","name":"Business","path":"/business","__typename":"Tag"},{"remoteId":"landingpagenewsregion","name":"News By Location","path":"/location","__typename":"Tag"},{"remoteId":"landingpageoceania","name":"Oceania","path":"/location/oceania","__typename":"Tag"},{"remoteId":"landingpagesoutheastasia","name":"Southeast Asia","path":"/location/southeast-asia","__typename":"Tag"},{"remoteId":"fbc811bfb079dd633b57facf0d7b71e8","name":"Spotlight","path":"/spotlight","__typename":"Tag"},{"remoteId":"landingpageeastasia","name":"East Asia","path":"/location/east-asia","__typename":"Tag"}],"primaryRegion":{"remoteId":"landingpagejapan","name":"Japan","__typename":"Tag"},"articleType":{"id":3,"name":"News","__typename":"ArticleType"},"readNext":[{"primaryTag":{"name":"Tech Asia","path":"/business/technology/tech-asia","__typename":"Tag"},"headline":"Inside Japan's long battle to 'de-Chinafy' its rare earth supply chain","image":{"imageUrl":"https://cms-image-bucket-productionv3-ap-northeast-1-a7d2.s3.ap-northeast-1.amazonaws.com/images/6/1/6/8/12058616-1-eng-GB/ce746486baee-2026-01-12T022013Z_851541548_RC2CZIAL8PKW_RTRMADP_3_JAPAN-RAREEARTHS.JPG","__typename":"Image"},"thumbnailImage":null,"url":"https://asia.nikkei.com/business/technology/tech-asia/inside-japan-s-long-battle-to-de-chinafy-its-rare-earth-supply-chain","path":"/business/technology/tech-asia/inside-japan-s-long-battle-to-de-chinafy-its-rare-earth-supply-chain","__typename":"Article"},{"primaryTag":{"name":"Energy","path":"/business/energy","__typename":"Tag"},"headline":"China battery storage installations triple North America's in 2025","image":{"imageUrl":"https://cms-image-bucket-productionv3-ap-northeast-1-a7d2.s3.ap-northeast-1.amazonaws.com/images/6/1/3/2/12042316-1-eng-GB/530e42656131-GettyImages-2255930014_k.jpg","__typename":"Image"},"thumbnailImage":null,"url":"https://asia.nikkei.com/business/energy/china-battery-storage-installations-triple-north-america-s-in-2025","path":"/business/energy/china-battery-storage-installations-triple-north-america-s-in-2025","__typename":"Article"},{"primaryTag":{"name":"Interview","path":"/editor-s-picks/interview","__typename":"Tag"},"headline":"Next-gen HondaJet to take off on green fuel for efficiency: top engineer","image":{"imageUrl":"https://cms-image-bucket-productionv3-ap-northeast-1-a7d2.s3.ap-northeast-1.amazonaws.com/images/3/8/4/5/11965483-1-eng-GB/09444ee892a4-20251231N-HondaJet.jpg","__typename":"Image"},"thumbnailImage":null,"url":"https://asia.nikkei.com/editor-s-picks/interview/next-gen-hondajet-to-take-off-on-green-fuel-for-efficiency-top-engineer","path":"/editor-s-picks/interview/next-gen-hondajet-to-take-off-on-green-fuel-for-efficiency-top-engineer","__typename":"Article"},{"primaryTag":{"name":"Business deals","path":"/business/business-deals","__typename":"Tag"},"headline":"Japanese companies take major stakes in US synthetic gas project","image":{"imageUrl":"https://cms-image-bucket-productionv3-ap-northeast-1-a7d2.s3.ap-northeast-1.amazonaws.com/images/3/5/3/2/11762353-1-eng-GB/9c3e3329f45f-2016-01-22T120000Z_357923653_TB3EC1M1GJSLW_RTRMADP_3_USA-ECONOMY-OIL.JPG","__typename":"Image"},"thumbnailImage":{"imageUrl":"https://cms-image-bucket-productionv3-ap-northeast-1-a7d2.s3.ap-northeast-1.amazonaws.com/images/3/5/3/2/11762353-1-eng-GB/9c3e3329f45f-2016-01-22T120000Z_357923653_TB3EC1M1GJSLW_RTRMADP_3_USA-ECONOMY-OIL.JPG","__typename":"Image"},"url":"https://asia.nikkei.com/business/business-deals/japanese-companies-take-major-stakes-in-us-synthetic-gas-project","path":"/business/business-deals/japanese-companies-take-major-stakes-in-us-synthetic-gas-project","__typename":"Article"},{"primaryTag":{"name":"Energy","path":"/business/energy","__typename":"Tag"},"headline":"Japanese companies take another crack at Australian hydrogen","image":{"imageUrl":"https://cms-image-bucket-productionv3-ap-northeast-1-a7d2.s3.ap-northeast-1.amazonaws.com/images/4/0/9/4/11744904-2-eng-GB/45b261cbc8b2-photo_SXM2025101400010147.jpg","__typename":"Image"},"thumbnailImage":null,"url":"https://asia.nikkei.com/business/energy/japanese-companies-take-another-crack-at-australian-hydrogen","path":"/business/energy/japanese-companies-take-another-crack-at-australian-hydrogen","__typename":"Article"},{"primaryTag":{"name":"Interview","path":"/editor-s-picks/interview","__typename":"Tag"},"headline":"Japan faces competitive pressure from China's push for green ships","image":{"imageUrl":"https://cms-image-bucket-productionv3-ap-northeast-1-a7d2.s3.ap-northeast-1.amazonaws.com/images/1/5/9/9/11699951-1-eng-GB/0c75358050f2-photo_SXM2025103100015559.jpg","__typename":"Image"},"thumbnailImage":null,"url":"https://asia.nikkei.com/editor-s-picks/interview/japan-faces-competitive-pressure-from-china-s-push-for-green-ships","path":"/editor-s-picks/interview/japan-faces-competitive-pressure-from-china-s-push-for-green-ships","__typename":"Article"},{"primaryTag":{"name":"Energy","path":"/business/energy","__typename":"Tag"},"headline":"Green hydrogen hits a red light over high costs","image":{"imageUrl":"https://cms-image-bucket-productionv3-ap-northeast-1-a7d2.s3.ap-northeast-1.amazonaws.com/images/9/2/3/8/11668329-2-eng-GB/83165e816044-photo_SXM2025110600005884.jpg","__typename":"Image"},"thumbnailImage":null,"url":"https://asia.nikkei.com/business/energy/green-hydrogen-hits-a-red-light-over-high-costs","path":"/business/energy/green-hydrogen-hits-a-red-light-over-high-costs","__typename":"Article"}],"updateType":{"id":0,"name":"New","__typename":"ArticleType"},"contentUrl":"https://cms-v3.asia.nikkei.com/content/4895cc98b6dbb905c08bae448d30888b","byline":"KENTO HIRASHIMA","body":"\\u003chtml\\u003e\\u003cbody\\u003e\\u003cdiv\\u003e\\u003cp\\u003eTOKYO -- Japanese trading house Marubeni recently conducted the world's first international transport of hydrogen using a metal hydride alloy, a material that can store the gas and enable more efficient shipping.\\u003c/p\\u003e\\u003cp\\u003eThe alloy absorbed \\"green\\" hydrogen produced in Australia and was then shipped by container vessel to Indonesia. Marubeni took around a year to clear customs procedures and other regulatory hurdles.\\u003c/p\\u003e\\u003cp\\u003eThe shipment from Australia in October 2025 was transported by truck to an industrial site outside Jakarta. There, Marubeni successfully extracted green hydrogen from the alloy and generated electricity with fuel cells.\\u003c/p\\u003e\\u003cp\\u003e\\"It was challenging, because there's no precedent for this,\\" said senior commercial officer Seiichiro Aoyama of Marubeni's new energy department, which led the project. \\"But it was significant that we were able to demonstrate the costs and the safety measures required for transporting metal hydride alloys.\\"\\u003c/p\\u003e\\u003cp\\u003eGreen hydrogen, which is produced using renewable energy, is a promising next-generation fuel that could play a role in the transition away from fossil fuels. But procurement costs have been a persistent challenge. Various efforts are being made to produce hydrogen in regions with access to cheap renewable energy and transport it elsewhere.\\u003c/p\\u003e\\u003cp\\u003eGaseous hydrogen occupies a large volume, so it is generally compressed or liquefied for transport. Compression offers only limited improvements in transport efficiency, while liquefaction comes with cooling costs and results in some vaporization during transport. Efforts are also underway to transport hydrogen in the form of ammonia, created by reacting the gas with nitrogen. But ammonia is toxic and has a strong odor, creating additional challenges.\\u003c/p\\u003e\\u003cp\\u003eMarubeni focused on metal hydride alloy technology. The special alloys absorb hydrogen under pressure or when cooled, releasing it when depressurized or heated. While the alloy itself is heavy and ill-suited to long-distance transport, it has low maintenance costs and minimal energy loss.\\u003c/p\\u003e\\u003cp\\u003eThe key alloy used in Marubeni's project was based on technology developed by an Australian company. The exact composition is undisclosed, but it is an iron-titanium alloy that absorbs hydrogen under pressure. Marubeni developed a storage device in which the alloy is packed into slender cylinders about 5 meters long and roughly 17 centimeters in diameter.\\u003c/p\\u003e\\u003cp\\u003eEach cylinder can store about 4 kilograms of hydrogen, equivalent to 50 kilowatt-hours to 60 kilowatt-hours of electricity -- roughly one to two days' worth of power consumption for an average household. In theory, the containers can absorb and release hydrogen about 1,000 to 1,500 times.\\u003c/p\\u003e\\u003cp\\u003eTo improve transport efficiency, Marubeni chose to use standard shipping containers. The company developed a mechanism to load the cylinders into the 20-foot containers used worldwide in maritime shipping, enabling them to be transported along with other cargo on container ships. Because container shipping costs are based on volume rather than weight, this approach helps offset the disadvantage of the alloy's heaviness.\\u003c/p\\u003e\\u003cp\\u003eFor the demonstration project, only one cylinder was used, but in theory a single container could hold at least 30, according to Marubeni.\\u003c/p\\u003e\\u003cp\\u003eCompressed hydrogen requires special high-pressure tanks and other equipment, and is regulated as a hazardous and flammable gas in Japan. Metal hydride alloys, by contrast, have lower risk of exploding.\\u003c/p\\u003e\\u003cp\\u003eEven so, Marubeni took extensive safety precautions because there was no precedent for international transport. Hydrogen is lighter than air and naturally rises, so the storage system was designed in a way that any leaked gas would dissipate naturally through ventilation at the top.\\u003c/p\\u003e\\u003cp\\u003e\\"There were many things we learned that will lead to future business,\\" Aoyama said.\\u003c/p\\u003e\\u003cp\\u003eThe most significant challenge involved customs approval. The alloy contains such materials as titanium, which have intrinsic resource value.\\u003c/p\\u003e\\u003cp\\u003e\\"It was difficult to explain that the alloy was simply a 'container' for hydrogen,\\" Aoyama said.\\u003c/p\\u003e        \\n\\u003cdiv class=\\"align-left ez-embed-type-image\\"\\u003e\\n    \\n    \\n    \\n    \\n                \\n                        \\n        \\n                    \\u003cdiv class=\\"article__image article__image--lightbox article__image--inline\\" style=\\"max-width:         320px\\" data-trackable=\\"image-inline\\"\\u003e\\n                \\n\\n\\n\\n\\u003cimg full=\\"https://images.ft.com/v3/image/raw/https%3A%2F%2Fcms-image-bucket-productionv3-ap-northeast-1-a7d2.s3.ap-northeast-1.amazonaws.com%2Fimages%2F8%2F2%2F8%2F1%2F12111828-1-eng-GB%2F322bdb1dc008-20260206N-Marubeni-Australia-hydrogen.jpg?source=nar-cms\\" class=\\"img-fluid js-lightbox-magnify lightbox__magnify \\" src=\\"https://images.ft.com/v3/image/raw/https%3A%2F%2Fcms-image-bucket-productionv3-ap-northeast-1-a7d2.s3.ap-northeast-1.amazonaws.com%2Fimages%2F_aliases%2Fmiddle_320%2F8%2F2%2F8%2F1%2F12111828-1-eng-GB%2F322bdb1dc008-20260206N-Marubeni-Australia-hydrogen.jpg?source=nar-cms\\" onerror=\\"this.src = '/assets/build/images/placeholder.jpg'; this.alt = '(placeholder image)'\\" loading=\\"lazy\\"\\u003e\\n\\n                \\u003cspan class=\\"article__caption\\" style=\\"max-width:         320px\\"\\u003e\\n                        Marubeni built a facility to produce green hydrogen near Adelaide in southern Australia. (Marubeni)\\n\\n\\n\\n\\n                \\u003c/span\\u003e\\n\\n                \\u003cspan class=\\"lightbox__control lightbox__control--close lightbox__control--hidden\\"\\u003e\\n                    \\u003csvg xmlns=\\"http://www.w3.org/2000/svg\\" xmlns:xlink=\\"http://www.w3.org/1999/xlink\\"\\u003e\\n                        \\u003cuse xmlns:xlink=\\"http://www.w3.org/1999/xlink\\" xlink:href=\\"#icon--cross\\" href=\\"#icon--cross\\"\\u003e\\u003c/use\\u003e\\n                        \\u003cimage class=\\"svg-fallback__image\\" src=\\"https://images.ft.com/v3/image/raw/https%3A%2F%2Fcms-v3.asia.nikkei.com%2Fassets%2Fimages%2Ficon--cross.svg?format=png\\u0026amp;source=nar-cms\\u0026amp;tint=%23ffffff\\"\\u003e\\u003c/image\\u003e\\n                    \\u003c/svg\\u003e\\n                \\u003c/span\\u003e\\n            \\u003c/div\\u003e\\n            \\n\\u003c/div\\u003e\\n\\u003cp\\u003e \\u003c/p\\u003e\\u003cp\\u003eIf classified as a raw material, the alloy itself would be subject to tariffs. While the hydrogen was subject to tariffs, proving how much was actually stored in the alloy took considerable time. Marubeni spent around a year consulting with customs authorities in both Indonesia and Australia to secure approval.\\u003c/p\\u003e\\u003cp\\u003eDespite overcoming these hurdles, Aoyama warned that \\"at present, it's difficult to scale this as a business.\\" Australian green hydrogen is relatively inexpensive, and the container transport improves efficiency. But the economics of the supply chain do not add up without stable, repeated demand for hundreds of shipments. The transport to Indonesia was conducted just once, and plans for future shipments are undecided.\\u003c/p\\u003e\\u003cp\\u003eBased on the trial, Marubeni is now envisioning container-based transport to remote islands. Multiple containers equipped with storage systems could be transported by ferry and installed directly on islands, where they could be used for emergency power with fuel cells in natural disasters and other emergencies. Because metal hydride alloys require no energy for storage, the company sees them as well-suited for long-term stockpiles.\\u003c/p\\u003e\\u003cp\\u003eMarubeni's demonstration was chosen in 2021 to receive a subsidy from the Japanese Ministry of the Environment. It used green hydrogen production facilities built by Marubeni near Adelaide in southern Australia, a region with abundant solar energy. The subsidy aimed to use Japan's Joint Crediting Mechanism to explore the potential use of carbon credits generated by the use of green hydrogen in Indonesia, one of Japan's partner countries in the JCM framework. Marubeni believes that the success of the trial could lead to other JCM business opportunities.\\u003c/p\\u003e\\u003cp\\u003e\\"Once we get approvals from Australia, similar projects are more likely to be approved in Europe, including the U.K., and in the U.S.,\\" said Zuquan He, manager of hydrogen and ammonia business development at Marubeni. \\u003c/p\\u003e\\n\\u003c/div\\u003e\\n\\u003c/body\\u003e\\u003c/html\\u003e","preview":"\\u003c!DOCTYPE html PUBLIC \\"-//W3C//DTD HTML 4.0 Transitional//EN\\" \\"http://www.w3.org/TR/REC-html40/loose.dtd\\"\\u003e\\n\\u003chtml\\u003e\\u003cbody\\u003e\\u003cdiv\\u003e\\u003cp\\u003eTOKYO -- Japanese trading house Marubeni recently conducted the world's first international transport of hydrogen using a metal hydride alloy, a material that can store the gas and enable more efficient shipping.\\u003c/p\\u003e\\u003c/div\\u003e\\u003c/body\\u003e\\u003c/html\\u003e\\n","latestOnTopic":{"topic":"Energy","items":[{"url":"https://asia.nikkei.com/business/energy/japan-s-tepco-plans-to-restart-kashiwazaki-kariwa-reactor-on-monday","path":"/business/energy/japan-s-tepco-plans-to-restart-kashiwazaki-kariwa-reactor-on-monday","image":{"imageUrl":"https://cms-image-bucket-productionv3-ap-northeast-1-a7d2.s3.ap-northeast-1.amazonaws.com/images/7/4/2/9/12109247-2-eng-GB/c3032a911f44-photo_SXM2026020500004647.jpg","name":"20260206 TEPCO Kashiwazaki-Kariwa reactor file photo","__typename":"Image"},"thumbnailImage":null,"primaryTag":{"name":"Energy","path":"/business/energy","__typename":"Tag"},"headline":"Japan's TEPCO plans to restart Kashiwazaki-Kariwa reactor on Monday","lastModifiedDate":1770353033,"versionNumber":7,"__typename":"Article"},{"url":"https://asia.nikkei.com/business/energy/japan-s-ihi-to-boost-output-of-nuclear-plant-parts-as-ai-drives-up-demand","path":"/business/energy/japan-s-ihi-to-boost-output-of-nuclear-plant-parts-as-ai-drives-up-demand","image":{"imageUrl":"https://cms-image-bucket-productionv3-ap-northeast-1-a7d2.s3.ap-northeast-1.amazonaws.com/images/7/1/1/2/12092117-2-eng-GB/5206de6142ed-photo_SXM2026020300008911.jpg","name":"20260203N IHI nuclear","__typename":"Image"},"thumbnailImage":null,"primaryTag":{"name":"Energy","path":"/business/energy","__typename":"Tag"},"headline":"Japan's IHI to boost output of nuclear plant parts as AI drives up demand","lastModifiedDate":1770142211,"versionNumber":8,"__typename":"Article"},{"url":"https://asia.nikkei.com/business/energy/uk-s-octopus-energy-eyes-tie-ups-with-more-japanese-gas-utilities","path":"/business/energy/uk-s-octopus-energy-eyes-tie-ups-with-more-japanese-gas-utilities","image":{"imageUrl":"https://cms-image-bucket-productionv3-ap-northeast-1-a7d2.s3.ap-northeast-1.amazonaws.com/images/6/8/3/4/12084386-2-eng-GB/9b9da635bd61-photo_SXM2026013000018198.jpg","name":"20260201N octopus energy montage","__typename":"Image"},"thumbnailImage":null,"primaryTag":{"name":"Energy","path":"/business/energy","__typename":"Tag"},"headline":"UK's Octopus Energy eyes tie-ups with more Japanese gas utilities","lastModifiedDate":1769962346,"versionNumber":6,"__typename":"Article"},{"url":"https://asia.nikkei.com/business/energy/trump-says-india-will-buy-oil-from-venezuela-not-iran","path":"/business/energy/trump-says-india-will-buy-oil-from-venezuela-not-iran","image":{"imageUrl":"https://cms-image-bucket-productionv3-ap-northeast-1-a7d2.s3.ap-northeast-1.amazonaws.com/images/5/7/0/4/12084075-1-eng-GB/fdbdfaf377d2-2026-02-01T015327Z_1808012913_RC2PCJA56P17_RTRMADP_3_USA-TRUMP.JPG","name":"U.S. President Trump at Joint Base Andrews Sunday, February 1st, 2026, 10:53","__typename":"Image"},"thumbnailImage":null,"primaryTag":{"name":"Energy","path":"/business/energy","__typename":"Tag"},"headline":"Trump says India will buy oil from Venezuela, not Iran","lastModifiedDate":1769924143,"versionNumber":7,"__typename":"Article"}],"__typename":"LatestOnTopicResult"},"keywords":"world,first,,Japan's,Marubeni,tests,shipping,hydrogen,trapped,metal","surrogateKey":"ez-all l899210 pl931 c447684 ct2 p1 p2 p75 p931 p899210 r447684 l81 pl136 c80 ct42 p80 p136 p81 l931 pl75 c602 c447665 r447665 l75 pl2 c74 l450 c346 p450 l5944 c3215 p5944 l180 pl179 c179 p179 p180 l86 pl137 c85 p137 p86 l64534 pl306 c27392 p306 p64534 l80 c79 l179 pl80 c178 l137 c136 l306 c254 l136 c135 c445979 r445979 l895826 pl401737 p128 p401737 p895826 l401737 pl128 c166368 c446407 r446407 c445969 r445969 l895815 p895815 c445981 r445981 c444094 r444094 l892143 pl6177 p76 p6177 p892143 l6177 pl76 c3330 c444073 r444073 c440576 r440576 l885521 pl1311 p1311 p885521 l1311 c804 c440677 r440677 c440253 r440253 l884870 p884870 c440258 r440258 c438638 r438638 l881733 p881733 c439168 r439168 c438419 r438419 l881276 p881276 c438401 r438401 c447586 r447586 l899050 p899050 c447594 r447594 c447211 r447211 l898305 p898305 c447215 r447215 c446996 r446996 l897874 p897874 c446997 r446997 c446985 r446985 l897850 p897850 c446986 r446986","source":null,"translationProhibited":false},"navigation":[{"label":"World","locationremoteid":"landingpagenewsregion","route":"/location","variation":"default","level":1,"items":[[{"label":"China","locationremoteid":"landingpagechina","route":"/location/east-asia/china","variation":"default","level":2},{"label":"Japan","locationremoteid":"landingpagejapan","route":"/location/east-asia/japan","variation":"default","level":2},{"label":"India","locationremoteid":"landingpageindia","route":"/location/south-asia/india","variation":"default","level":2},{"label":"South Korea","locationremoteid":"landingpagesouthkorea","route":"/location/east-asia/south-korea","variation":"default","level":2},{"label":"Indonesia","locationremoteid":"landingpageindonesia","route":"/location/southeast-asia/indonesia","variation":"default","level":2},{"label":"Taiwan","locationremoteid":"landingpagetaiwan","route":"/location/east-asia/taiwan","variation":"default","level":2},{"label":"Thailand","locationremoteid":"landingpagethailand","route":"/location/southeast-asia/thailand","variation":"default","level":2},{"label":"U.S.","locationremoteid":"08a2e89be7162b904cd1407142f313b4","route":"/location/rest-of-the-world/north-america/u.s","variation":"default","level":2}],[{"label":"East Asia","locationremoteid":"landingpageeastasia","route":"/location/east-asia","variation":"default","level":3,"items":[{"label":"China","locationremoteid":"landingpagechina","route":"/location/east-asia/china","variation":"default","level":4},{"label":"Hong Kong","locationremoteid":"landingpagehongkong","route":"/location/east-asia/hong-kong","variation":"default","level":4},{"label":"Macao","locationremoteid":"landingpagemacao","route":"/location/east-asia/macao","variation":"default","level":4},{"label":"Taiwan","locationremoteid":"landingpagetaiwan","route":"/location/east-asia/taiwan","variation":"default","level":4},{"label":"Mongolia","locationremoteid":"landingpagemongolia","route":"/location/east-asia/mongolia","variation":"default","level":4},{"label":"Japan","locationremoteid":"landingpagejapan","route":"/location/east-asia/japan","variation":"default","level":4},{"label":"South Korea","locationremoteid":"landingpagesouthkorea","route":"/location/east-asia/south-korea","variation":"default","level":4},{"label":"North Korea","locationremoteid":"landingpagenorthkorea","route":"/location/east-asia/north-korea","variation":"default","level":4}]},{"label":"Southeast Asia","locationremoteid":"landingpagesoutheastasia","route":"/location/southeast-asia","variation":"default","level":3,"items":[{"label":"Indonesia","locationremoteid":"landingpageindonesia","route":"/location/southeast-asia/indonesia","variation":"default","level":4},{"label":"Thailand","locationremoteid":"landingpagethailand","route":"/location/southeast-asia/thailand","variation":"default","level":4},{"label":"Malaysia","locationremoteid":"landingpagemalaysia","route":"/location/southeast-asia/malaysia","variation":"default","level":4},{"label":"Singapore","locationremoteid":"landingpagesingapore","route":"/location/southeast-asia/singapore","variation":"default","level":4},{"label":"Philippines","locationremoteid":"landingpagephilippines","route":"/location/southeast-asia/philippines","variation":"default","level":4},{"label":"Vietnam","locationremoteid":"landingpagevietnam","route":"/location/southeast-asia/vietnam","variation":"default","level":4},{"label":"Myanmar","locationremoteid":"landingpagemyanmar","route":"/location/southeast-asia/myanmar","variation":"default","level":4},{"label":"Cambodia","locationremoteid":"landingpagecambodia","route":"/location/southeast-asia/cambodia","variation":"default","level":4},{"label":"Laos","locationremoteid":"landingpagelaos","route":"/location/southeast-asia/laos","variation":"default","level":4},{"label":"Brunei","locationremoteid":"landingpagebrunei","route":"/location/southeast-asia/brunei","variation":"default","level":4},{"label":"East Timor","locationremoteid":"landingpageeasttimor","route":"/location/southeast-asia/east-timor","variation":"default","level":4}]},{"label":"South Asia","locationremoteid":"landingpagesouthasia","route":"/location/south-asia","variation":"default","level":3,"items":[{"label":"India","locationremoteid":"landingpageindia","route":"/location/south-asia/india","variation":"default","level":4},{"label":"Pakistan","locationremoteid":"landingpagepakistan","route":"/location/south-asia/pakistan","variation":"default","level":4},{"label":"Afghanistan","locationremoteid":"290e550cdbd78999eade2cf558c02eab","route":"/location/south-asia/afghanistan","variation":"default","level":4},{"label":"Bangladesh","locationremoteid":"landingpagebangladesh","route":"/location/south-asia/bangladesh","variation":"default","level":4},{"label":"Sri Lanka","locationremoteid":"landingpagesrilanka","route":"/location/south-asia/sri-lanka","variation":"default","level":4},{"label":"Nepal","locationremoteid":"landingpagenepal","route":"/location/south-asia/nepal","variation":"default","level":4},{"label":"Bhutan","locationremoteid":"landingpagebhutan","route":"/location/south-asia/bhutan","variation":"default","level":4},{"label":"Maldives","locationremoteid":"landingpagemaldives","route":"/location/south-asia/maldives","variation":"default","level":4}]},{"label":"Central Asia","locationremoteid":"landingpagecentralasia","route":"/location/central-asia","variation":"default","level":3,"items":[{"label":"Kazakhstan","locationremoteid":"landingpagekazakhstan","route":"/location/central-asia/kazakhstan","variation":"default","level":4},{"label":"Uzbekistan","locationremoteid":"landingpageuzbekistan","route":"/location/central-asia/uzbekistan","variation":"default","level":4},{"label":"Turkmenistan","locationremoteid":"landingpageturkmenistan","route":"/location/central-asia/turkmenistan","variation":"default","level":4},{"label":"Tajikistan","locationremoteid":"landingpagetajikistan","route":"/location/central-asia/tajikistan","variation":"default","level":4},{"label":"Kyrgyzstan","locationremoteid":"landingpagekyrgyzstan","route":"/location/central-asia/kyrgyzstan","variation":"default","level":4}]},{"label":"Oceania","locationremoteid":"landingpageoceania","route":"/location/oceania","variation":"default","level":3,"items":[{"label":"Australia","locationremoteid":"landingpageaustralia","route":"/location/oceania/australia","variation":"default","level":4},{"label":"New Zealand","locationremoteid":"landingpagenewzealand","route":"/location/oceania/new-zealand","variation":"default","level":4},{"label":"Papua New Guinea","locationremoteid":"landingpagepapuanewguinea","route":"/location/oceania/papua-new-guinea","variation":"default","level":4},{"label":"Pacific Islands","locationremoteid":"landingpagepacificislands","route":"/location/oceania/pacific-islands","variation":"default","level":4}]},{"label":"Rest of the World","locationremoteid":"landingpagerow","route":"/location/rest-of-the-world","variation":"default","level":3,"items":[{"label":"Middle East","locationremoteid":"landingpagemiddleeast","route":"/location/rest-of-the-world/middle-east","variation":"default","level":4},{"label":"Russia \\u0026 Caucasus","locationremoteid":"landingpagerussiacaucasus","route":"/location/rest-of-the-world/russia-caucasus","variation":"default","level":4},{"label":"North America","locationremoteid":"landingpagenorthamerica","route":"/location/rest-of-the-world/north-america","variation":"default","level":4},{"label":"Latin America","locationremoteid":"d56bcb3f7210364048757e40f894a7bc","route":"/location/rest-of-the-world/latin-america","variation":"default","level":4},{"label":"Europe","locationremoteid":"landingpageeurope","route":"/location/rest-of-the-world/europe","variation":"default","level":4},{"label":"Africa","locationremoteid":"landingpageafrica","route":"/location/rest-of-the-world/africa","variation":"default","level":4}]}]]},{"label":"Trending","locationremoteid":"5e3c42fe9617f8063ed83b11330b76b7","route":"/trending","variation":"default","level":1,"items":[[{"label":"Japan election","locationremoteid":"074ab9ae66618be3b5955986ec4268c9","route":"/politics/japan-election","variation":"default","level":2},{"label":"Trump administration","locationremoteid":"28231cdb710055f1867b6d99e7fd6307","route":"/spotlight/trump-administration","variation":"default","level":2},{"label":"Thai election","locationremoteid":"072e95e0562a47cd31976cea4e8a24f6","route":"/politics/thai-election","variation":"default","level":2},{"label":"Artificial intelligence","locationremoteid":"6152e68e454dcfcc2370c5a16c0491e4","route":"/business/technology/artificial-intelligence","variation":"default","level":2},{"label":"Electric vehicles","locationremoteid":"28b954733c7f98d96a9b2abf634b7989","route":"/business/automobiles/electric-vehicles","variation":"default","level":2},{"label":"Supply Chain","locationremoteid":"1dc67f2a64d0d3f8d3b3557fb6125531","route":"/spotlight/supply-chain","variation":"default","level":2},{"label":"Taiwan tensions","locationremoteid":"36e37287adf626852d82786a8ca4ba06","route":"/politics/international-relations/taiwan-tensions","variation":"default","level":2},{"label":"Bank of Japan","locationremoteid":"87b774a175087181383c7607c9909fef","route":"/economy/bank-of-japan","variation":"default","level":2},{"label":"Immigration","locationremoteid":"57e1bbb8043e4cd8cd1383104deffaf5","route":"/spotlight/immigration","variation":"default","level":2},{"label":"ESG","locationremoteid":"02add2118d92844c8bf8d05a9f657413","route":"/spotlight/esg","variation":"default","level":2},{"label":"Explainer","locationremoteid":"450f16b08a192a2995df5427b3557300","route":"/spotlight/explainer","variation":"default","level":2}]]},{"label":"Business","locationremoteid":"landingpagebusiness","route":"/business","variation":"default","level":1,"items":[[{"isParent":true,"label":"Business","locationremoteid":"landingpagebusiness","route":"/business","level":2},{"label":"Semiconductors","locationremoteid":"86083749a0244536823d7f83b2403c6c","route":"/business/tech/semiconductors","variation":"default","level":2},{"label":"Automobiles","locationremoteid":"landingpageautomobile","route":"/business/automobiles","variation":"default","level":2},{"label":"Energy","locationremoteid":"65e2de5d36ff0f92afbfa9e0773dadd4","route":"/business/energy","variation":"default","level":2},{"label":"Transportation","locationremoteid":"02921b1d1cf688741f664d65709c410d","route":"/business/transportation","variation":"default","level":2},{"label":"Retail","locationremoteid":"f450a94d662e0049e21c764c5a77e12e","route":"/business/retail","variation":"default","level":2},{"label":"Travel \\u0026 Leisure","locationremoteid":"a4bf44a5683c566e0d3c8ded98ed8152","route":"/business/travel-leisure","variation":"default","level":2},{"label":"Media \\u0026 Entertainment","locationremoteid":"cfaf03130a5633b6a5aa88401b34a060","route":"/business/media-entertainment","variation":"default","level":2},{"label":"Food \\u0026 Beverage","locationremoteid":"5def4b7f12edc1ff683920b159a7eb34","route":"/business/food-beverage","variation":"default","level":2},{"label":"Finance","locationremoteid":"landingpagebankingfinance","route":"/business/finance","variation":"default","level":2},{"label":"Electronics","locationremoteid":"landingpageelectronics","route":"/business/electronics","variation":"default","level":2},{"label":"Startups","locationremoteid":"8f46768f39882cc58b5f2887fed10983","route":"/business/startups","variation":"default","level":2},{"label":"Business deals","locationremoteid":"5c92b994c1e8a533e7054516045bd511","route":"/business/business-deals","variation":"default","level":2}]]},{"label":"Markets","locationremoteid":"landingpagemarkets","route":"/business/markets","variation":"default","level":1,"items":[[{"isParent":true,"label":"Markets","locationremoteid":"landingpagemarkets","route":"/business/markets","level":2},{"label":"Equities","locationremoteid":"dd727750bb9d8b21ed92e14fb653100f","route":"/business/markets/equities","variation":"default","level":2},{"label":"Currencies","locationremoteid":"ed8b3757597f1ab9ba56f628a74c8923","route":"/business/markets/currencies","variation":"default","level":2},{"label":"Bonds","locationremoteid":"f94fd6be772a5b66cd4648314b975aac","route":"/business/markets/bonds","variation":"default","level":2},{"label":"Commodities","locationremoteid":"944f7dc5df2055ebee64d4f2268ec328","route":"/business/markets/commodities","variation":"default","level":2},{"label":"Property","locationremoteid":"e0cf06f4d90a859f461be4a378b17349","route":"/business/markets/property","variation":"default","level":2},{"label":"IPO","locationremoteid":"1ecd115eb11250cc3724e8d526721718","route":"/business/markets/ipo","variation":"default","level":2},{"label":"Wealth Management","locationremoteid":"92967ca8be7a790e7b4047ad5b0a72d2","route":"/business/markets/wealth-management","variation":"default","level":2}]]},{"label":"Tech","locationremoteid":"landingpagetech","route":"/business/tech","variation":"default","level":1,"items":[[{"isParent":true,"label":"Tech","locationremoteid":"landingpagetech","route":"/business/tech","level":2},{"label":"#techAsia","locationremoteid":"0c3420ca7fbd8d7e4b5d050e1ac57ab8","route":"/techasia","variation":"default","level":2},{"label":"China tech","locationremoteid":"b8d66625153af08b09d23e3a8fba79a0","route":"/business/china-tech","variation":"default","level":2},{"label":"Startups","locationremoteid":"8f46768f39882cc58b5f2887fed10983","route":"/business/startups","variation":"default","level":2},{"label":"Cryptocurrencies","locationremoteid":"47e9dca7a83b7a278bf5a86b0e8861d2","route":"/spotlight/cryptocurrencies","variation":"default","level":2},{"label":"DealStreetAsia","locationremoteid":"d67f23ea071a0ff8ce10d24839b1ab99","route":"/spotlight/dealstreetasia","variation":"default","level":2}]]},{"label":"Politics","locationremoteid":"landingpagepolitics","filterBase":true,"route":"/politics","variation":"default","level":1,"items":[[{"isParent":true,"label":"Politics","locationremoteid":"landingpagepolitics","route":"/politics","level":2},{"label":"China","locationremoteid":"landingpagechina","route":"/politics/east-asia/china","variation":"default","level":2},{"label":"Japan","locationremoteid":"landingpagejapan","route":"/politics/east-asia/japan","variation":"default","level":2},{"label":"India","locationremoteid":"landingpageindia","route":"/politics/south-asia/india","variation":"default","level":2},{"label":"South Korea","locationremoteid":"landingpagesouthkorea","route":"/politics/east-asia/south-korea","variation":"default","level":2},{"label":"Indonesia","locationremoteid":"landingpageindonesia","route":"/politics/south-east-asia/indonesia","variation":"default","level":2},{"label":"Taiwan","locationremoteid":"landingpagetaiwan","route":"/politics/east-asia/taiwan","variation":"default","level":2},{"label":"Thailand","locationremoteid":"landingpagethailand","route":"/politics/south-east-asia/thailand","variation":"default","level":2},{"label":"U.S.","locationremoteid":"08a2e89be7162b904cd1407142f313b4","route":"/politics/rest-of-the-world/north-america/u.s","variation":"default","level":2}],[{"label":"East Asia","locationremoteid":"landingpageeastasia","route":"/politics/east-asia","variation":"default","level":3,"items":[{"label":"China","locationremoteid":"landingpagechina","route":"/politics/east-asia/china","variation":"default","level":4},{"label":"Hong Kong","locationremoteid":"landingpagehongkong","route":"/politics/east-asia/hong-kong","variation":"default","level":4},{"label":"Macao","locationremoteid":"landingpagemacao","route":"/politics/east-asia/macao","variation":"default","level":4},{"label":"Taiwan","locationremoteid":"landingpagetaiwan","route":"/politics/east-asia/taiwan","variation":"default","level":4},{"label":"Mongolia","locationremoteid":"landingpagemongolia","route":"/politics/east-asia/mongolia","variation":"default","level":4},{"label":"Japan","locationremoteid":"landingpagejapan","route":"/politics/east-asia/japan","variation":"default","level":4},{"label":"South Korea","locationremoteid":"landingpagesouthkorea","route":"/politics/east-asia/south-korea","variation":"default","level":4},{"label":"North Korea","locationremoteid":"landingpagenorthkorea","route":"/politics/east-asia/north-korea","variation":"default","level":4}]},{"label":"Southeast Asia","locationremoteid":"landingpagesoutheastasia","route":"/politics/south-east-asia","variation":"default","level":3,"items":[{"label":"Indonesia","locationremoteid":"landingpageindonesia","route":"/politics/south-east-asia/indonesia","variation":"default","level":4},{"label":"Thailand","locationremoteid":"landingpagethailand","route":"/politics/south-east-asia/thailand","variation":"default","level":4},{"label":"Malaysia","locationremoteid":"landingpagemalaysia","route":"/politics/south-east-asia/malaysia","variation":"default","level":4},{"label":"Singapore","locationremoteid":"landingpagesingapore","route":"/politics/south-east-asia/singapore","variation":"default","level":4},{"label":"Philippines","locationremoteid":"landingpagephilippines","route":"/politics/south-east-asia/philippines","variation":"default","level":4},{"label":"Vietnam","locationremoteid":"landingpagevietnam","route":"/politics/south-east-asia/vietnam","variation":"default","level":4},{"label":"Myanmar","locationremoteid":"landingpagemyanmar","route":"/politics/south-east-asia/myanmar","variation":"default","level":4},{"label":"Cambodia","locationremoteid":"landingpagecambodia","route":"/politics/south-east-asia/cambodia","variation":"default","level":4},{"label":"Laos","locationremoteid":"landingpagelaos","route":"/politics/south-east-asia/laos","variation":"default","level":4},{"label":"Brunei","locationremoteid":"landingpagebrunei","route":"/politics/south-east-asia/brunei","variation":"default","level":4},{"label":"East Timor","locationremoteid":"landingpageeasttimor","route":"/politics/south-east-asia/east-timor","variation":"default","level":4}]},{"label":"South Asia","locationremoteid":"landingpagesouthasia","route":"/politics/south-asia","variation":"default","level":3,"items":[{"label":"India","locationremoteid":"landingpageindia","route":"/politics/south-asia/india","variation":"default","level":4},{"label":"Pakistan","locationremoteid":"landingpagepakistan","route":"/politics/south-asia/pakistan","variation":"default","level":4},{"label":"Afghanistan","locationremoteid":"290e550cdbd78999eade2cf558c02eab","route":"/politics/south-asia/afghanistan","variation":"default","level":4},{"label":"Bangladesh","locationremoteid":"landingpagebangladesh","route":"/politics/south-asia/bangladesh","variation":"default","level":4},{"label":"Sri Lanka","locationremoteid":"landingpagesrilanka","route":"/politics/south-asia/sri-lanka","variation":"default","level":4},{"label":"Nepal","locationremoteid":"landingpagenepal","route":"/politics/south-asia/nepal","variation":"default","level":4},{"label":"Bhutan","locationremoteid":"landingpagebhutan","route":"/politics/south-asia/bhutan","variation":"default","level":4},{"label":"Maldives","locationremoteid":"landingpagemaldives","route":"/politics/south-asia/maldives","variation":"default","level":4}]},{"label":"Central Asia","locationremoteid":"landingpagecentralasia","route":"/politics/central-asia","variation":"default","level":3,"items":[{"label":"Kazakhstan","locationremoteid":"landingpagekazakhstan","route":"/politics/central-asia/kazakhstan","variation":"default","level":4},{"label":"Uzbekistan","locationremoteid":"landingpageuzbekistan","route":"/politics/central-asia/uzbekistan","variation":"default","level":4},{"label":"Turkmenistan","locationremoteid":"landingpageturkmenistan","route":"/politics/central-asia/turkmenistan","variation":"default","level":4},{"label":"Tajikistan","locationremoteid":"landingpagetajikistan","route":"/politics/central-asia/tajikistan","variation":"default","level":4},{"label":"Kyrgyzstan","locationremoteid":"landingpagekyrgyzstan","route":"/politics/central-asia/kyrgyzstan","variation":"default","level":4}]},{"label":"Oceania","locationremoteid":"landingpageoceania","route":"/politics/oceania","variation":"default","level":3,"items":[{"label":"Australia","locationremoteid":"landingpageaustralia","route":"/politics/oceania/australia","variation":"default","level":4},{"label":"New Zealand","locationremoteid":"landingpagenewzealand","route":"/politics/oceania/new-zealand","variation":"default","level":4},{"label":"Papua New Guinea","locationremoteid":"landingpagepapuanewguinea","route":"/politics/oceania/papua-new-guinea","variation":"default","level":4},{"label":"Pacific Islands","locationremoteid":"landingpagepacificislands","route":"/politics/oceania/pacific-islands","variation":"default","level":4}]},{"label":"Rest of the World","locationremoteid":"landingpagerow","route":"/politics/rest-of-the-world","variation":"default","level":3,"items":[{"label":"Middle East","locationremoteid":"landingpagemiddleeast","route":"/politics/rest-of-the-world/middle-east","variation":"default","level":4},{"label":"Russia \\u0026 Caucasus","locationremoteid":"landingpagerussiacaucasus","route":"/politics/rest-of-the-world/russia-caucasus","variation":"default","level":4},{"label":"North America","locationremoteid":"landingpagenorthamerica","route":"/politics/rest-of-the-world/north-america","variation":"default","level":4},{"label":"Latin America","locationremoteid":"d56bcb3f7210364048757e40f894a7bc","route":"/politics/rest-of-the-world/latin-america","variation":"default","level":4},{"label":"Europe","locationremoteid":"landingpageeurope","route":"/politics/rest-of-the-world/europe","variation":"default","level":4},{"label":"Africa","locationremoteid":"landingpageafrica","route":"/politics/rest-of-the-world/africa","variation":"default","level":4}]}]]},{"label":"Economy","locationremoteid":"landingpageeconomy","route":"/economy","filterBase":true,"variation":"default","level":1,"items":[[{"isParent":true,"label":"Economy","locationremoteid":"landingpageeconomy","route":"/economy","level":2},{"label":"China","locationremoteid":"landingpagechina","route":"/economy/east-asia/china","variation":"default","level":2},{"label":"Japan","locationremoteid":"landingpagejapan","route":"/economy/east-asia/japan","variation":"default","level":2},{"label":"India","locationremoteid":"landingpageindia","route":"/economy/south-asia/india","variation":"default","level":2},{"label":"South Korea","locationremoteid":"landingpagesouthkorea","route":"/economy/east-asia/south-korea","variation":"default","level":2},{"label":"Indonesia","locationremoteid":"landingpageindonesia","route":"/economy/south-east-asia/indonesia","variation":"default","level":2},{"label":"Taiwan","locationremoteid":"landingpagetaiwan","route":"/economy/east-asia/taiwan","variation":"default","level":2},{"label":"Thailand","locationremoteid":"landingpagethailand","route":"/economy/south-east-asia/thailand","variation":"default","level":2},{"label":"U.S.","locationremoteid":"08a2e89be7162b904cd1407142f313b4","route":"/economy/rest-of-the-world/north-america/u.s","variation":"default","level":2}],[{"label":"East Asia","locationremoteid":"landingpageeastasia","route":"/economy/east-asia","variation":"default","level":3,"items":[{"label":"China","locationremoteid":"landingpagechina","route":"/economy/east-asia/china","variation":"default","level":4},{"label":"Hong Kong","locationremoteid":"landingpagehongkong","route":"/economy/east-asia/hong-kong","variation":"default","level":4},{"label":"Macao","locationremoteid":"landingpagemacao","route":"/economy/east-asia/macao","variation":"default","level":4},{"label":"Taiwan","locationremoteid":"landingpagetaiwan","route":"/economy/east-asia/taiwan","variation":"default","level":4},{"label":"Mongolia","locationremoteid":"landingpagemongolia","route":"/economy/east-asia/mongolia","variation":"default","level":4},{"label":"Japan","locationremoteid":"landingpagejapan","route":"/economy/east-asia/japan","variation":"default","level":4},{"label":"South Korea","locationremoteid":"landingpagesouthkorea","route":"/economy/east-asia/south-korea","variation":"default","level":4},{"label":"North Korea","locationremoteid":"landingpagenorthkorea","route":"/economy/east-asia/north-korea","variation":"default","level":4}]},{"label":"Southeast Asia","locationremoteid":"landingpagesoutheastasia","route":"/economy/south-east-asia","variation":"default","level":3,"items":[{"label":"Indonesia","locationremoteid":"landingpageindonesia","route":"/economy/south-east-asia/indonesia","variation":"default","level":4},{"label":"Thailand","locationremoteid":"landingpagethailand","route":"/economy/south-east-asia/thailand","variation":"default","level":4},{"label":"Malaysia","locationremoteid":"landingpagemalaysia","route":"/economy/south-east-asia/malaysia","variation":"default","level":4},{"label":"Singapore","locationremoteid":"landingpagesingapore","route":"/economy/south-east-asia/singapore","variation":"default","level":4},{"label":"Philippines","locationremoteid":"landingpagephilippines","route":"/economy/south-east-asia/philippines","variation":"default","level":4},{"label":"Vietnam","locationremoteid":"landingpagevietnam","route":"/economy/south-east-asia/vietnam","variation":"default","level":4},{"label":"Myanmar","locationremoteid":"landingpagemyanmar","route":"/economy/south-east-asia/myanmar","variation":"default","level":4},{"label":"Cambodia","locationremoteid":"landingpagecambodia","route":"/economy/south-east-asia/cambodia","variation":"default","level":4},{"label":"Laos","locationremoteid":"landingpagelaos","route":"/economy/south-east-asia/laos","variation":"default","level":4},{"label":"Brunei","locationremoteid":"landingpagebrunei","route":"/economy/south-east-asia/brunei","variation":"default","level":4},{"label":"East Timor","locationremoteid":"landingpageeasttimor","route":"/economy/south-east-asia/east-timor","variation":"default","level":4}]},{"label":"South Asia","locationremoteid":"landingpagesouthasia","route":"/economy/south-asia","variation":"default","level":3,"items":[{"label":"India","locationremoteid":"landingpageindia","route":"/economy/south-asia/india","variation":"default","level":4},{"label":"Pakistan","locationremoteid":"landingpagepakistan","route":"/economy/south-asia/pakistan","variation":"default","level":4},{"label":"Afghanistan","locationremoteid":"290e550cdbd78999eade2cf558c02eab","route":"/economy/south-asia/afghanistan","variation":"default","level":4},{"label":"Bangladesh","locationremoteid":"landingpagebangladesh","route":"/economy/south-asia/bangladesh","variation":"default","level":4},{"label":"Sri Lanka","locationremoteid":"landingpagesrilanka","route":"/economy/south-asia/sri-lanka","variation":"default","level":4},{"label":"Nepal","locationremoteid":"landingpagenepal","route":"/economy/south-asia/nepal","variation":"default","level":4},{"label":"Bhutan","locationremoteid":"landingpagebhutan","route":"/economy/south-asia/bhutan","variation":"default","level":4},{"label":"Maldives","locationremoteid":"landingpagemaldives","route":"/economy/south-asia/maldives","variation":"default","level":4}]},{"label":"Central Asia","locationremoteid":"landingpagecentralasia","route":"/economy/central-asia","variation":"default","level":3,"items":[{"label":"Kazakhstan","locationremoteid":"landingpagekazakhstan","route":"/economy/central-asia/kazakhstan","variation":"default","level":4},{"label":"Uzbekistan","locationremoteid":"landingpageuzbekistan","route":"/economy/central-asia/uzbekistan","variation":"default","level":4},{"label":"Turkmenistan","locationremoteid":"landingpageturkmenistan","route":"/economy/central-asia/turkmenistan","variation":"default","level":4},{"label":"Tajikistan","locationremoteid":"landingpagetajikistan","route":"/economy/central-asia/tajikistan","variation":"default","level":4},{"label":"Kyrgyzstan","locationremoteid":"landingpagekyrgyzstan","route":"/economy/central-asia/kyrgyzstan","variation":"default","level":4}]},{"label":"Oceania","locationremoteid":"landingpageoceania","route":"/economy/oceania","variation":"default","level":3,"items":[{"label":"Australia","locationremoteid":"landingpageaustralia","route":"/economy/oceania/australia","variation":"default","level":4},{"label":"New Zealand","locationremoteid":"landingpagenewzealand","route":"/economy/oceania/new-zealand","variation":"default","level":4},{"label":"Papua New Guinea","locationremoteid":"landingpagepapuanewguinea","route":"/economy/oceania/papua-new-guinea","variation":"default","level":4},{"label":"Pacific Islands","locationremoteid":"landingpagepacificislands","route":"/economy/oceania/pacific-islands","variation":"default","level":4}]},{"label":"Rest of the World","locationremoteid":"landingpagerow","route":"/economy/rest-of-the-world","variation":"default","level":3,"items":[{"label":"Middle East","locationremoteid":"landingpagemiddleeast","route":"/economy/rest-of-the-world/middle-east","variation":"default","level":4},{"label":"Russia \\u0026 Caucasus","locationremoteid":"landingpagerussiacaucasus","route":"/economy/rest-of-the-world/russia-caucasus","variation":"default","level":4},{"label":"North America","locationremoteid":"landingpagenorthamerica","route":"/economy/rest-of-the-world/north-america","variation":"default","level":4},{"label":"Latin America","locationremoteid":"d56bcb3f7210364048757e40f894a7bc","route":"/economy/rest-of-the-world/latin-america","variation":"default","level":4},{"label":"Europe","locationremoteid":"landingpageeurope","route":"/economy/rest-of-the-world/europe","variation":"default","level":4},{"label":"Africa","locationremoteid":"landingpageafrica","route":"/economy/rest-of-the-world/africa","variation":"default","level":4}]}]]},{"label":"Features","locationremoteid":"landingpagefeatures","route":"/features","variation":"default","level":1,"items":[[{"label":"Trading Asia","locationremoteid":"987b3f2271837195cb17e9fd7fad624d","route":"/business/markets/trading-asia","variation":"default","level":2},{"label":"ASEAN Money","locationremoteid":"3264ec1f54fc8b1f7f4a20543fce9574","route":"/spotlight/asean-money","variation":"default","level":2},{"label":"Tech Asia","locationremoteid":"b36034300650ca3dfb68c0d81b884f39","route":"/business/technology/tech-asia","variation":"default","level":2},{"label":"China Up Close","locationremoteid":"0fb4cd4664f1efd753423c7d8ea3d916","route":"/editor-s-picks/china-up-close","variation":"default","level":2},{"label":"Policy Asia","locationremoteid":"0213e18cbc51026e73f5f33b6848f0be","route":"/spotlight/policy-asia","variation":"default","level":2},{"label":"Big in Asia","locationremoteid":"5c24fbdb465d7797874c17b3a9a34c86","route":"/spotlight/big-in-asia","variation":"default","level":2},{"label":"Datawatch","locationremoteid":"631e71a748249799db753eca7ac2a210","route":"/spotlight/datawatch","variation":"default","level":2},{"label":"Infographics","locationremoteid":"f058014b6c29aeee240d835a04f2a02f","route":"/infographics","variation":"homepage","level":2}]]},{"label":"Opinion","locationremoteid":"landingpageopinion","route":"/opinion","variation":"stream_opinion","level":1,"items":[[{"isParent":true,"label":"Opinion","locationremoteid":"landingpageopinion","route":"/opinion","level":2},{"label":"Editor-in-Chief's Picks","locationremoteid":"48e648ad6d54d510cfc8f2923e0c29e1","route":"/editor-s-picks/editor-in-chief-s-picks","variation":"default","level":2},{"label":"The Nikkei View","locationremoteid":"ffaf3129cd57c0ca1fe17dbc3d4d1fe9","route":"/opinion/the-nikkei-view","variation":"default","level":2}]]},{"label":"Life \\u0026 Arts","locationremoteid":"landingpagelifearts","route":"/life-arts","variation":"default","level":1,"items":[[{"isParent":true,"label":"Life \\u0026 Arts","locationremoteid":"landingpagelifearts","route":"/life-arts","level":2},{"label":"Life","locationremoteid":"199abfedc9b023dbc534843e68a15dbb","route":"/life-arts/life","variation":"default","level":2},{"label":"Arts","locationremoteid":"b538c582bf14c535356673fefbcf9094","route":"/life-arts/arts","variation":"default","level":2},{"label":"My Personal History","locationremoteid":"d244b33b1c465d451e10a1f01e191fbd","route":"/life-arts/my-personal-history","variation":"homepage","level":2},{"label":"Tea Leaves","locationremoteid":"13ae73bc7f2f8245673a13a485c1fbd9","route":"/editor-s-picks/tea-leaves","variation":"default","level":2},{"label":"Eat \\u0026 Drink","locationremoteid":"bb126142b27107a99af87b47ee1d1d45","route":"/life-arts/life/eat-drink","variation":"default","level":2},{"label":"Destinations","locationremoteid":"d2b7eff8114b6713a6b0594cbb4fcdad","route":"/life-arts/life/destinations","variation":"default","level":2},{"label":"Books","locationremoteid":"ae4c2cbce0655c82df58b1b7329c355d","route":"/life-arts/books","variation":"default","level":2},{"label":"Obituaries","locationremoteid":"fdb5db724375fab57c443bebe68d4ef7","route":"/life-arts/obituaries","variation":"default","level":2}]]},{"label":"Watch \\u0026 Listen","locationremoteid":"921a8ebab5594fb122fc01e34eee364a","route":"/watch-listen","variation":"default","level":1,"items":[[{"label":"Podcasts","locationremoteid":"903bb7ae31ec5fab95c1d658cd8a1f02","route":"/spotlight/podcasts","variation":"default","level":2},{"label":"Video","locationremoteid":"9b9f98e6743320bffae963e0b85e5288","route":"/video","variation":"default","level":2},{"label":"Photos","locationremoteid":"333cf159dc711ef5694bf27d963ddf22","route":"/photos","variation":"default","level":2}]]}],"url":"/business/energy/in-world-first-japan-s-marubeni-tests-shipping-hydrogen-trapped-in-metal","accessDecision":false,"myNewsExpansionEnabled":false,"isPreview":false,"ssrDateMs":1770527387525,"_sentryTraceData":"b7754ca115924aa9b6f4ed22e37e2aaa-ba20f4626ff58682-0","_sentryBaggage":"sentry-environment=production,sentry-release=MBN7XKHbBL_6QvTB8Xn0T,sentry-public_key=fee6d9cb8ec6177280d65b08bb2fccdb,sentry-trace_id=b7754ca115924aa9b6f4ed22e37e2aaa,sentry-sample_rate=0.0027,sentry-transaction=%2F%5B...alias%5D,sentry-sampled=false"},"__N_SSP":true},"page":"/[...alias]","query":{"alias":["business","energy","in-world-first-japan-s-marubeni-tests-shipping-hydrogen-trapped-in-metal"]},"buildId":"MBN7XKHbBL_6QvTB8Xn0T","isFallback":false,"isExperimentalCompile":false,"gssp":true,"scriptLoader":[]}</script><script>if("undefined"!=typeof window&&"undefined"!=typeof window){const e=function(e){var n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src=e;var t=document.getElementsByTagName("script")[0];t.parentNode.insertBefore(n,t)},n=["/view-newsletter"];window.addEventListener("dependencies.service.piano.ready",(t=>{if(n.some((e=>window.location.pathname.startsWith(e))))return;const d=\`\${window.sharedFrontendEnv.NEXT_PUBLIC_PIANO_URL}/xbuilder/experience/load?aid=\${window.sharedFrontendEnv.NEXT_PUBLIC_PIANO_ID}\`;e(d)}),{once:!0})}</script><script>if("undefined"!=typeof window&&"undefined"!=typeof window){["/account/newsletter-preferences"].find((e=>window.location.pathname.includes(e)))||window.addEventListener("dependencies.service.sitecatalyst.ready",(()=>{var e;(e=window._sf_async_config=window._sf_async_config||{}).sections=window.prop1||void 0,e.authors="nikkei",function(){window._sf_endpt=(new Date).getTime();var e=document.createElement("script"),n=document.getElementsByTagName("script")[0];e.type="text/javascript",e.async=!0,e.src="//static.chartbeat.com/js/chartbeat.js",n.parentNode.insertBefore(e,n)}()}))}</script></body></html>`,
        destinationKey: 'linebreak',
        options: {
            ignore: 'nav, footer, header, form, iframe, script, style',
        },
    };

    @node({
        id: 'dd289ce3-43eb-408e-8c44-a05b8e397949',
        name: 'Edit Fields1',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [1008, 1568],
    })
    EditFields1 = {
        assignments: {
            assignments: [
                {
                    id: 'bfd54331-d477-4a4f-b9c6-01c70016ec3b',
                    name: 'linebreak',
                    value: `={{ 
  $json.linebreak
    .replaceAll(/!\\[.*?\\]\\(.*?\\)|\\[[^\\]]*?\\]\\([^\\)]*?\\)/g, '')
    .replaceAll(/^\\s*[\\*\\-\\+]\\s*/gm, '')
}}`,
                    type: 'string',
                },
            ],
        },
        options: {},
    };

    @node({
        id: 'fff283a9-279f-43d2-a470-5feb7fc9cf5d',
        name: 'Code in JavaScript',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [-112, 1792],
    })
    CodeInJavascript = {
        jsCode: `return (function () {

  const mdNode = $('Markdown1').item.json;

  // Safely handle optional markdown cleanup
  if (mdNode?.linebreak && typeof mdNode.linebreak === 'string') {
    return mdNode.linebreak.replace(/[#*_\`>-]/g, '').trim();
  }

  const html = $('extract content').item.json.data || '';
  if (!html) return "No content found";

  // 1. Remove scripts, styles, forms, nav-like blocks
  let text = html
    .replace(/<script[\\s\\S]*?>[\\s\\S]*?<\\/script>/gi, '')
    .replace(/<style[\\s\\S]*?>[\\s\\S]*?<\\/style>/gi, '')
    .replace(/<noscript[\\s\\S]*?>[\\s\\S]*?<\\/noscript>/gi, '')
    .replace(/<form[\\s\\S]*?>[\\s\\S]*?<\\/form>/gi, '')
    .replace(/<svg[\\s\\S]*?>[\\s\\S]*?<\\/svg>/gi, '')
    .replace(/<[^>]+>/g, '\\n');

  // 2. Normalize
  let lines = text
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/[ \\t]+/g, ' ')
    .replace(/\\n{2,}/g, '\\n')
    .split('\\n')
    .map(l => l.trim())
    .filter(Boolean);

  // 3. Content scoring
  const articleLines = lines.filter(line => {
    const wordCount = line.split(/\\s+/).length;
    const punctuation = (line.match(/[.,;:!?]/g) || []).length;
    const linkLike = /(http|www\\.|@|©|™)/i.test(line);
    const navLike =
      /^(home|about|contact|privacy|terms|subscribe|login|menu|news|sports|weather|events)$/i.test(line);

    return (
      wordCount >= 8 &&
      punctuation >= 1 &&
      !linkLike &&
      !navLike
    );
  });

  // 4. Paragraph reconstruction
  const result = articleLines
    .join('\\n')
    .replace(/\\n{2,}/g, '\\n\\n')
    .trim();

  return result || "No article content found";

})();`,
    };

    @node({
        id: 'd1912543-80e1-48a4-b9c0-f5e5e6929714',
        name: 'OpenAI Chat Model3',
        type: '@n8n/n8n-nodes-langchain.lmChatOpenAi',
        version: 1.3,
        position: [5472, 1120],
        credentials: { openAiApi: { id: 'NoEKitspBJb0zQrp', name: 'Syntech GM OpenAi account' } },
    })
    OpenaiChatModel3 = {
        model: {
            __rl: true,
            value: 'gpt-4.1-nano',
            mode: 'list',
            cachedResultName: 'gpt-4.1-nano',
        },
        builtInTools: {},
        options: {},
    };

    @node({
        id: 'd7ee9cd5-b691-4c30-8fcb-d553dd19fd55',
        name: 'RAG Web - Keyword Search2',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [688, 3456],
    })
    RagWebKeywordSearch2 = {
        assignments: {
            assignments: [
                {
                    id: '1d34aa6b-dce8-4761-9a9a-a663f61a86ac',
                    name: 'title',
                    value: "={{ $('Merge').item.json.title || $('Create summary and title8').item.json.output.title }}",
                    type: 'string',
                },
                {
                    id: 'ab5c9158-a33a-4f8f-b6d0-a6787df0f0d5',
                    name: 'content',
                    value: '={{ $json.text }}',
                    type: 'string',
                },
                {
                    id: 'f0c15fc7-071d-406d-8200-abecbf458836',
                    name: 'url',
                    value: `={{
  decodeURIComponent(
    ($('Merge').item.json.link || '')
      .replace(/^https?:\\/\\/www\\.google\\.com\\/url\\?.*?url=/, '')
      .split('&')[0]
  )
}}`,
                    type: 'string',
                },
                {
                    id: '81fb049e-bbc7-49f8-b932-9f2d3ae0305d',
                    name: 'summary',
                    value: "={{ $('Create summary and title8').item.json.output.summary }}",
                    type: 'string',
                },
                {
                    id: '39872c24-4acc-4513-b7fb-7689cd511afb',
                    name: 'search_query',
                    value: "={{ $('Either Url or Keyword5').first().json.url_or_keyword }}",
                    type: 'string',
                },
                {
                    id: '42852696-c7af-4ce4-a273-e61970ef2e8f',
                    name: 'publication_date',
                    value: "={{ $('Merge').item.json.date.toDateTime() || $('extract date1').item.json.publishedDate }}",
                    type: 'string',
                },
                {
                    id: '6bd73285-c360-4b10-8567-8ae66ecba2bd',
                    name: 'prompt',
                    value: "={{ $('When Executed by Another Workflow').first().json.prompt }}",
                    type: 'string',
                },
                {
                    id: '101c6d7f-6e56-4362-9238-0b3e4fd7f14d',
                    name: 'additional_formats',
                    value: "={{ $('When Executed by Another Workflow').first().json.additional_formats }}",
                    type: 'string',
                },
                {
                    id: 'a0b9d46b-67d2-4152-b1fa-2306fa5751e4',
                    name: 'source',
                    value: 'Website',
                    type: 'string',
                },
                {
                    id: '9fa24bce-6aa0-4d13-a106-54727cd4ee0b',
                    name: 'source_name',
                    value: "={{ $('Either Url or Keyword5').first().json.set_source_name }}",
                    type: 'string',
                },
                {
                    id: '9aea88f6-a629-4f42-ba37-8608bb631772',
                    name: 'mode',
                    value: "={{ $('When Executed by Another Workflow').first().json.process_mode }}",
                    type: 'string',
                },
            ],
        },
        options: {},
    };

    @node({
        id: '72962652-276c-442e-a793-23cd9aa06460',
        name: 'Edit Fields2',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [112, 3456],
    })
    EditFields2 = {
        assignments: {
            assignments: [
                {
                    id: '6209ffc2-a660-4109-9ebe-97a95b8d2c6e',
                    name: 'data',
                    value: `=Cover FeatureNewsArticles

Search

Subscribe ▾

HDT Magazine

Subscribe | Digital Edition

Sept 23-25, 2026 | Scottsdale, AZ

Aftermarket

Aftermarket

Drivers

Drivers

Electronic Logging Devices (ELDs)

Electronic Logging Devices (ELDs)

Equipment

Equipment

Fleet Management

Fleet Management

Fuel Smarts

Fuel Smarts

Maintenance

Maintenance

Products

Products

Safety & Compliance

Safety & Compliance

Photos NewsArticles VideosMagazine BlogsEventsWhitepapersWebinars PodcastDisaster ResponseBuyer's Guide

SubscriptionMeet the EditorsNewsletterAdvertiseAbout UsContact UsPrivacy PolicyTerms and ConditionsCookie SettingsBobit Business MediaMarketing SolutionsContribute Content Press Release

MENU

SEARCH

Subscribe▴

Home\\Fuel Smarts

  Scania and DHL Testing Fuel-Extended Electric Truck

Scania and DHL believe electric vehicles with fuel-powered range extender could be an interim solution while fully electric trucks are being scaled and charging infrastructure built, the companies said.

Merchants Experts・Fleet Management Company

Read Merchants's Posts

February 20, 2025

Scania and DHL are jointly developing a Class 8 electric truck with a range-extending fuel-powered generator on board. 

Photo: Scania

4 min to read

Share

---

---

Scania and DHL Group have jointly developed an electric truck with a fuel-powered generator, the companies announced.

This technology makes it possible to shift to battery-electric road transport without having to wait for a complete charging network. 

Ad Loading...

Transitional Technology

According to the companies, fully electric vehicles are the ultimate solution in a sustainable transport system, and the shift to electric needs to accelerate now. 

There are, however, hurdles standing in the way of fully electric trucks. These include the lack of charging points, the high costs of ensuring enough charging capacity at the depots during seasonal peaks. Scania and DHL also point to strain on the grid and high spot prices for electricity on for instance calm winter days. 

This is where Scania and DHL’s Extended Range Electric Vehicle (EREV) comes into the picture.

Trucking's "Messy Middle" Explained

The vehicle helps to overcome these hurdles while enabling DHL to drive 80% – 90% of the time on renewable electricity. This is thanks to a fuel-powered generator, which replaces one of the battery packs.

The new e-truck will be deployed by the Post & Parcel Germany division in February for parcel transport between Berlin and Hamburg to test its performance in day-to-day operations. Eventually, additional vehicles are added to DHL’s fleet. 

Ad Loading...

The fuel-powered generator replaces one of the battery packs in a fully electric truck not needed for the majority of the transport routes, thus reducing the range coming from the batteries, but providing back-up energy for the mentioned scenarios. The vehicle has a possible range of 650 to 800 kilometers (subject to the findings from the test) and can be refueled at any conventional petrol station, if needed. 

This compares with the 550-kilometer range of Scania’s 100% electric trucks with an equivalent maximum weight, the OEM said.

 A Pragmatic Sustainable Logistics Solution

“It is going to take some time before renewable electricity is available,” said DHL Group CEO Tobias Meyer. “The grid and charging infrastructure are available and robust enough to rely fully on battery-electric trucks, especially for a large-scale system like the German parcel network of DHL. Instead of waiting for this day to come, DHL and Scania are collaborating on a pragmatic solution for making logistics more sustainable and reduce CO2 emissions by more than 80%. This vehicle is a sensible, practical solution that can make an immediate contribution to reducing greenhouse gas emissions in freight transport short-term. Such reductions should be proportionally reflected in the road toll pricing and EU fleet emission scheme. We see this collaboration as a successful innovation project of two companies committed to battle climate change.”

The EREV has been developed by Scania Pilot Partner, which the OEM launched to explore new transportation technologies and solutions.

Scania Pilot Partner is working together with DHL as a strategic partner to develop the new truck.

Ad Loading...

The Swedish truck OEM has been working on other hybrid powertrain solutions for heavy trucks, as well.

According to the companies, range-extended electric vehicles offer a promising interim solution for significant CO2 emission reductions. This is especially true, they said, where infrastructure and other conditions for fully electric transport are lacking. 

A Messy Middle Solution 

“The future is electric, but perfect must not be the enemy of good as we are getting there,” said Christian Levin, CEO, Scania. “The vehicle we have developed together with DHL is an example of interim solutions that can enhance the scaling of decarbonized heavy transport before the transport system eventually becomes 100 percent electrified. An effective climate transition requires that policymakers accept such solutions, while ramping up their investments in public infrastructure and other enabling conditions.”

Scania Pilot Partner explores new transportation technologies and solutions.

Photo: Scania

The EREV is a 10.5-meter-long truck with a maximum weight of 40 metric tons, powered by a 230kW electric engine (295 kW peak). 

Energy is delivered by a 416-kWh battery and a 120-kW gasoline powered generator. With the aid of the onboard generator – initially powered by petrol and later by diesel fuel or renewable diesel fuel – the truck’s range extends up to 800 kilometers. 

Ad Loading...

EREVs can be equipped with software limiting the usage of the fuel-powered generator. This allows CO2 emissions to be reduced and limited to a specified level. 

The truck’s maximum speed is 89 km/h. It features a cargo capacity of approximately 1,000 parcels (volume of a swap body). The truck can also pull a trailer with an additional swap body.

 The vehicle is to be deployed for “main carriage” transport between the cities of Berlin and Hamburg.

Related: Nikola Files for Bankruptcy

Topics:ScaniaTratonDiesel-Electric HybridsBattery-Electric TrucksBattery-Electric VehiclesEuropeDiesel Fuelrenewable dieselFuel Smarts

 More Fuel Smarts

Fuel Smarts•by News/Media Release•February 3, 2026

Researchers Demonstrate Wireless Charging of Electric Heavy-Duty Truck at Highway Speeds

Purdue researchers demonstrated a high-power wireless charging system capable of delivering energy to electric heavy-duty trucks at highway speeds, advancing the concept of electrified roadways for freight transportation.

Read More →

Equipment•by Deborah Lockridge•February 3, 2026

 EPA Wants to Know: Are DEF De-Rates Really Needed for Diesel Emissions Compliance?

The Environmental Protection Agency is asking diesel engine makers to provide information about diesel exhaust fluid system failures as it considers changes to emissions regulations.

Read More →

Sponsored•February 1, 2026

Stop Watching Footage, Start Driving Results

6 intelligent dashcam tactics to improve safety and boost ROI

Read More →

Ad Loading...

Fuel Smarts•by Deborah Lockridge•January 29, 2026

 California: Clean Truck Check Rules Still in Force for Out-of-State Trucks, Despite EPA Disapproval

The Environmental Protection Agency said California can’t enforce its Heavy-Duty Inspection and Maintenance Regulation, known as Clean Truck Check, on vehicles registered outside the state. But California said it will keep enforcing the rule.

Read More →

Fuel Smarts•January 27, 2026

Justice Department Pulls Back on Criminal Prosecution of Diesel Emissions Deletes

The Trump administration has announced it will no longer criminally prosecute “diesel delete” cases of truck owners altering emissions systems in violation of EPA regulations. What does that mean for heavy-duty fleets?

Read More →

Fuel Smarts•by Jack Roberts•January 26, 2026

 Why the Cummins X15N Changed the Conversation About Natural Gas Trucking

Natural gas is quietly building a reputation as a clean, affordable, and reliable alternative fuel for long-haul trucks. And Ian MacDonald with Hexagon Agility says the Cummins X15N is a big reason why. 

Read More →

Ad Loading...

Fuel Smarts•by News/Media Release•January 21, 2026

First Tesla Semi for RoadOne IntermodaLogistics 

RoadOne IntermodaLogistics has bought a fully electric Tesla Semi heavy-duty truck, the first of up to 10 for its Oakland, California, operations.

Read More →

Fuel Smarts•by News/Media Release•January 20, 2026

 Mercedes-Benz Initiates Megawatt Charging and Long-Haul EV Truck Trials

Mercedes-Benz has begun a new series of tests in Europe to validate vehicle compatibility with megawatt chargers and assess charging performance, thermal management, and usability on long-haul duty routes.

Read More →

Fuel Smarts•by News/Media Release•January 20, 2026

Windrose Bundles Free EV Truck Charging with Greenlane Infrastructure

Windrose customers will receive unlimited charging for three months on Greenlane’s high-power charging network.

Read More →

Ad Loading...

Sponsored•January 19, 2026

 3 New Ways Fleet Software Pays: ROI opportunities for modern fleet managers

Safety, uptime, and insurance costs directly impact profitability. This eBook looks at how fleet software is evolving to deliver real ROI through proactive maintenance, AI-powered video telematics, and real-time driver coaching. Learn how fleets are reducing crashes, defending claims, and using integrated data to make smarter operational decisions.

Read More →

View All →

Connect with us

 Topic

Aftermarket
Drivers
Electronic Logging Devices (ELDs)
Equipment
Fleet Management
Fuel Smarts
Maintenance
Products
Safety & Compliance

Quick Links

Photos
 News
Articles
 Videos
Magazine
 Blogs
Events
Whitepapers
Webinars
 Podcast
Disaster Response
Buyer's Guide

 Services

Subscription
Meet the Editors
Newsletter
Advertise
About Us
Contact Us
Privacy Policy
Terms and Conditions
Cookie Settings
Bobit Business Media
Marketing Solutions
Contribute Content
 Press Release

© 2026 Bobit Business Media Inc. All rights reserved.

Privacy PolicyTerms of UseTerms of SaleDo Not Sell or Share My Personal Information`,
                    type: 'string',
                },
            ],
        },
        options: {},
    };

    @node({
        id: 'd48ad3bd-e8fa-4f51-80a1-dc23d1bb97dc',
        name: 'Create summary and title10',
        type: '@n8n/n8n-nodes-langchain.chainLlm',
        version: 1.7,
        position: [336, 3456],
        retryOnFail: true,
        waitBetweenTries: 5000,
    })
    CreateSummaryAndTitle10 = {
        promptType: 'define',
        text: '=input={{ $json.data }}',
        messages: {
            messageValues: [
                {
                    message: `=Extract ONLY the main article content from this HTML. Return the exact original text with no additions or modifications.

KEEP:
- Article headlines, paragraphs, lists, quotes
- Multi-sentence text blocks (3+ sentences = likely article content)

REMOVE:
- Navigation (Home, About, Contact, Menu, Login, etc.)
- Headers, footers, sidebars, ads, widgets
- Social buttons (Share, Tweet, Follow, Like, etc.)
- Comments, "Related articles", "You may also like"
- Newsletter signups, cookie notices, legal text
- Copyright (©), "All Rights Reserved", "Powered by"
- Breadcrumbs (Home > News > Article)
- Metadata labels (Published:, Category:, Tags:, Author:, Read time:)
- Action buttons (Print, Email, Save, Subscribe)
- Embedded ads, sponsored content, product widgets
- Pagination (Page 1, Next, Previous)
- Anything that appears on every page of the site

RULES:
1. Return ONLY text that exists in the HTML - do NOT generate or summarize
2. If a line has 1-3 words and looks like navigation, remove it
3. If a paragraph has 3+ sentences with proper punctuation, keep it
4. Separate paragraphs with double line breaks
5. Strip all HTML tags but preserve text structure
6. Remove URLs unless they're part of a sentence
7. If no clear article found, return "No article content found"

OUTPUT: Plain text only, no HTML, no markdown, no preamble, no explanations. Start directly with the article content.

HTML:
{{ $json.data }}`,
                },
            ],
        },
        batching: {
            batchSize: 20,
        },
    };

    @node({
        id: '16d99d5a-1dd8-4773-b4ef-2287d3de7a63',
        name: 'OpenAI Chat Model4',
        type: '@n8n/n8n-nodes-langchain.lmChatOpenAi',
        version: 1.3,
        position: [416, 3680],
        credentials: { openAiApi: { id: 'NoEKitspBJb0zQrp', name: 'Syntech GM OpenAi account' } },
    })
    OpenaiChatModel4 = {
        model: {
            __rl: true,
            value: 'gpt-4.1-nano',
            mode: 'list',
            cachedResultName: 'gpt-4.1-nano',
        },
        builtInTools: {},
        options: {},
    };

    @node({
        id: '8fa76412-3464-44cc-bb55-05430aa545a9',
        name: 'When clicking ‘Execute workflow’',
        type: 'n8n-nodes-base.manualTrigger',
        version: 1,
        position: [-112, 3456],
    })
    WhenClickingExecuteWorkflow = {};

    @node({
        id: 'b11944af-85d8-4d47-8db4-ff4a1ccf72a6',
        name: 'Extracting Clean Article',
        type: '@n8n/n8n-nodes-langchain.chainLlm',
        version: 1.7,
        position: [5392, 896],
        retryOnFail: true,
        waitBetweenTries: 5000,
    })
    ExtractingCleanArticle = {
        promptType: 'define',
        text: `=Extract the clean article content from the HTML below.

CRITICAL: 
- If the input is exactly "No article content found", return that phrase unchanged.
- Otherwise, there IS article content - extract it precisely by removing navigation, ads, and boilerplate while keeping all article text.

HTML TO PROCESS:
{{ $json.data }}`,
        messages: {
            messageValues: [
                {
                    message: `=You are a precision HTML article content extractor. Your core function:

EXTRACT the main article text EXACTLY as written in the source HTML.
- Do NOT add, generate, summarize, or rephrase anything
- Do NOT skip content because it seems unclear - extract it anyway
- ALWAYS return article content unless the input is literally "No article content found"

ASSUMPTION: There is ALWAYS article content in the HTML. Your job is to find and clean it.

WHAT TO KEEP:
✓ Main article headlines and subheadlines
✓ ALL body paragraphs (multi-line text blocks with 2+ sentences)
✓ Numbered or bulleted lists that are part of the article
✓ Block quotes, pull quotes, and citations
✓ Image captions if they provide context
✓ Article dates/timestamps ONLY if part of the byline
✓ Tables or data presented in the article
✓ Interview Q&A sections (keep both questions and answers)
✓ Numbered steps or instructions
✓ Code snippets in technical articles
✓ Timeline or chronological information

WHAT TO REMOVE (Noise & Boilerplate):
✗ Navigation menus (Home, About, Contact, Login, Menu, Subscribe, etc.)
✗ Site headers and footers
✗ Sidebars, widgets, and page chrome
✗ Advertisements and promotional boxes
✗ Social sharing UI (Share, Tweet, Facebook, LinkedIn, Follow us, etc.)
✗ Comment sections and user discussions
✗ "Related articles", "You may also like", "Trending now", "Most popular"
✗ Newsletter signup forms and email capture
✗ Cookie notices, privacy banners, legal disclaimers
✗ Copyright statements (©, All Rights Reserved, Powered by, etc.)
✗ Author bios (unless inline within the article body)
✗ Site branding, taglines, and slogans
✗ Breadcrumb trails (Home > Category > Article)
✗ Metadata labels (Published:, Category:, Tags:, Read time:, Views:, etc.)
✗ Media player controls ("Listen to this", audio/video UI)
✗ Action buttons (Print, Email, Save, Download, Subscribe Now, etc.)
✗ Search bars and site utilities
✗ "Jump to section" or table of contents links (unless core to article)
✗ Pagination controls (Page 1 of 3, Next, Previous, Load more)
✗ Sponsored content labels and native advertising
✗ App download prompts and install banners
✗ Paywall messages ("Subscribe to continue reading")
✗ Poll widgets, surveys, and interactive elements
✗ User profile snippets
✗ Product recommendation carousels
✗ Live chat popups
✗ Exit intent overlays
✗ Event calendars and upcoming dates sidebars
✗ Stock tickers and live data feeds
✗ Forum thread metadata (posted by, replies, views)

FORMATTING RULES:
- Separate paragraphs with exactly TWO newline characters (\\n\\n)
- Preserve original sentence structure, punctuation, and capitalization
- Keep list formatting with bullet points (•) or numbers (1., 2., 3.)
- Maintain headline hierarchy visually (but no markdown # symbols)
- Strip ALL HTML tags completely while preserving text layout
- Remove excessive whitespace but keep intentional paragraph breaks
- Remove standalone URLs unless they are part of a readable sentence
- Convert data tables to readable plain text format if present

CONTENT IDENTIFICATION HEURISTICS:
- Paragraphs with 3+ sentences and proper punctuation = article content (KEEP)
- Headlines are typically 3-15 words in title case (KEEP)
- Navigation items are 1-3 words, often single nouns (REMOVE)
- True article content has varied sentence lengths and punctuation
- Boilerplate text (copyright, legal) often repeats across pages (REMOVE)
- Single-line text matching navigation patterns (Home, Menu, etc.) = noise (REMOVE)

EDGE CASES:
- Multiple articles: Extract ONLY the main/primary article
- Mixed content types: Keep all that's part of the core article narrative
- Nested quotes: Preserve them with proper attribution
- Interview format: Keep both Q and A
- Technical articles with code: Keep explanatory text AND code blocks
- Timelines: Preserve chronological structure
- When in doubt: INCLUDE rather than exclude

OUTPUT REQUIREMENTS:
- Return ONLY the cleaned article text
- NO preamble ("Here is the article:")
- NO postamble or explanatory notes
- NO markdown formatting (**, ##, etc.)
- NO HTML tags
- Start directly with the article headline or first paragraph
- Use plain text with line breaks only`,
                },
            ],
        },
        batching: {
            batchSize: 20,
        },
    };

    @node({
        id: 'b77a0b5f-9bb0-43e1-aae6-b273a2b5962f',
        name: 'Anthropic Chat Model',
        type: '@n8n/n8n-nodes-langchain.lmChatAnthropic',
        version: 1.3,
        position: [4656, 1328],
        credentials: { anthropicApi: { id: '0c1nNLaJWpeD3Cqz', name: 'Syntech GM Anthropic account' } },
    })
    AnthropicChatModel = {
        model: {
            __rl: true,
            mode: 'list',
            value: 'claude-sonnet-4-5-20250929',
            cachedResultName: 'Claude Sonnet 4.5',
        },
        options: {},
    };

    @node({
        id: 'ae6dd732-8c31-4f1c-bc7a-bec7a7714e08',
        name: 'Anthropic Chat Model1',
        type: '@n8n/n8n-nodes-langchain.lmChatAnthropic',
        version: 1.3,
        position: [4656, 512],
        credentials: { anthropicApi: { id: '0c1nNLaJWpeD3Cqz', name: 'Syntech GM Anthropic account' } },
    })
    AnthropicChatModel1 = {
        model: {
            __rl: true,
            mode: 'list',
            value: 'claude-sonnet-4-5-20250929',
            cachedResultName: 'Claude Sonnet 4.5',
        },
        options: {},
    };

    @node({
        id: 'dd05c258-a233-4898-8fae-9900d3861622',
        name: 'Set Article Content',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [5168, 896],
    })
    SetArticleContent = {
        assignments: {
            assignments: [
                {
                    id: '6209ffc2-a660-4109-9ebe-97a95b8d2c6e',
                    name: 'data',
                    value: `={{ (function () {
  // ========== STEP 0: Check if Markdown Already Processed ==========
  const mdNode = $('Markdown1').item.json;
  if (mdNode.linebreak && mdNode.linebreak.length > 0) {
    return mdNode.linebreak.removeMarkdown();
  }

  // ========== STEP 1: Get HTML Content ==========
  const html = $('extract content').item.json.data || '';
  if (!html) return "No content found";

  // ========== STEP 2: Isolate Main Content ==========
  let mainContent = html;
  
  // Try to find article container (priority order)
  const articleMatch = html.match(/<article[^>]*>([\\s\\S]*?)<\\/article>/i);
  const mainMatch = html.match(/<main[^>]*>([\\s\\S]*?)<\\/main>/i);
  const contentMatch = html.match(/<div[^>]*class="[^"]*(?:post-content|article-body|entry-content)[^"]*"[^>]*>([\\s\\S]*?)<\\/div>/i);
  
  if (articleMatch) mainContent = articleMatch[1];
  else if (mainMatch) mainContent = mainMatch[1];
  else if (contentMatch) mainContent = contentMatch[1];

  // ========== STEP 3: Remove Noise Elements ==========
  mainContent = mainContent
    // Scripts, styles, forms
    .replace(/<script[\\s\\S]*?<\\/script>/gi, '')
    .replace(/<style[\\s\\S]*?<\\/style>/gi, '')
    .replace(/<noscript[\\s\\S]*?<\\/noscript>/gi, '')
    .replace(/<form[\\s\\S]*?<\\/form>/gi, '')
    .replace(/<svg[\\s\\S]*?<\\/svg>/gi, '')
    // Navigation and UI elements
    .replace(/<nav[\\s\\S]*?<\\/nav>/gi, '')
    .replace(/<header[\\s\\S]*?<\\/header>/gi, '')
    .replace(/<footer[\\s\\S]*?<\\/footer>/gi, '')
    .replace(/<aside[\\s\\S]*?<\\/aside>/gi, '')
    // Common noise classes
    .replace(/<div[^>]*class="[^"]*(?:sidebar|widget|ad|advertisement|social|share|newsletter|comments|related)[^"]*"[^>]*>[\\s\\S]*?<\\/div>/gi, '')
    // Metadata and timestamps
    .replace(/<time[^>]*>[\\s\\S]*?<\\/time>/gi, '')
    .replace(/<span[^>]*class="[^"]*(?:date|author|category|tag)[^"]*"[^>]*>[\\s\\S]*?<\\/span>/gi, '');

  // ========== STEP 4: Convert Block Elements to Paragraphs ==========
  mainContent = mainContent
    .replace(/<\\/p>/gi, '</p>\\n\\n')           // Paragraph breaks
    .replace(/<br\\s*\\/?>/gi, '\\n')            // Line breaks
    .replace(/<\\/div>/gi, '</div>\\n')         // Div breaks
    .replace(/<\\/h[1-6]>/gi, '</h>\\n\\n')      // Heading breaks
    .replace(/<li[^>]*>/gi, '\\n• ')           // List items
    .replace(/<\\/li>/gi, '\\n');

  // ========== STEP 5: Strip Remaining Tags ==========
  let text = mainContent
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");

  // ========== STEP 6: Clean Lines ==========
  let lines = text
    .split('\\n')
    .map(line => line.trim())
    .filter(line => {
      if (!line) return false;
      
      // Remove short noise
      if (line.length < 20) {
        // But keep if it's a real headline (Title Case or punctuation)
        const isTitleCase = /^[A-Z][a-z]+(\\s+[A-Z][a-z]+)*$/.test(line);
        const hasPunctuation = /[.!?]$/.test(line);
        if (!isTitleCase && !hasPunctuation) return false;
      }

      // Remove navigation patterns
      const navPatterns = [
        /^(home|about|contact|login|sign up|subscribe|menu|search|follow)/i,
        /^©.*\\d{4}/,                    // Copyright
        /privacy|terms|cookie/i,         // Legal
        /(facebook|twitter|linkedin|instagram|share)/i,  // Social
        /^\\d+\\s*(views|comments|shares)/i,  // Metrics
        /^(all rights reserved|powered by)/i
      ];
      if (navPatterns.some(pattern => pattern.test(line))) return false;

      // Remove lines with mostly symbols
      const alphaRatio = (line.match(/[a-zA-Z]/g) || []).length / line.length;
      if (alphaRatio < 0.5) return false;

      return true;
    });

  // ========== STEP 7: Reconstruct Paragraphs ==========
  let paragraphs = [];
  let currentPara = '';

  lines.forEach(line => {
    // If line looks like a headline (short, title case, or ends with :)
    if (line.length < 100 && (/^[A-Z][^.!?]*$/.test(line) || line.endsWith(':'))) {
      if (currentPara) paragraphs.push(currentPara);
      paragraphs.push(line);  // Headline as separate paragraph
      currentPara = '';
    } else {
      // Accumulate sentences
      currentPara += (currentPara ? ' ' : '') + line;
      
      // End paragraph on sentence boundary
      if (/[.!?]$/.test(line)) {
        paragraphs.push(currentPara);
        currentPara = '';
      }
    }
  });
  
  if (currentPara) paragraphs.push(currentPara);

  // ========== STEP 8: Final Filtering ==========
  const result = paragraphs
    .filter(p => {
      const words = p.split(/\\s+/).length;
      // Keep headlines (short) or substantial paragraphs
      return p.length < 100 || words >= 15;
    })
    .join('\\n\\n')
    .trim();

  return result || "No article content found";
})() }}`,
                    type: 'string',
                },
            ],
        },
        options: {},
    };

    @node({
        id: 'd1b49eb9-3cc0-481e-b2c9-9057c29cf7d0',
        webhookId: '06ba8aa1-765e-4fe7-b689-6fe37afca9c0',
        name: 'Wait',
        type: 'n8n-nodes-base.wait',
        version: 1.1,
        position: [6192, 768],
    })
    Wait = {
        amount: 10,
    };

    @node({
        id: 'd28a2143-ff26-45cf-aada-8c1ca7db0f08',
        name: 'Anthropic Chat Model3',
        type: '@n8n/n8n-nodes-langchain.lmChatAnthropic',
        version: 1.3,
        position: [1136, 832],
        credentials: { anthropicApi: { id: '0c1nNLaJWpeD3Cqz', name: 'Syntech GM Anthropic account' } },
    })
    AnthropicChatModel3 = {
        model: {
            __rl: true,
            value: 'claude-haiku-4-5-20251001',
            mode: 'list',
            cachedResultName: 'Claude Haiku 4.5',
        },
        options: {
            temperature: 0.2,
        },
    };

    @node({
        id: '8e6dac5f-2ac2-43ae-9fbb-235369410bf2',
        name: 'Anthropic Chat Model4',
        type: '@n8n/n8n-nodes-langchain.lmChatAnthropic',
        version: 1.3,
        position: [4464, 1136],
        credentials: { anthropicApi: { id: '0c1nNLaJWpeD3Cqz', name: 'Syntech GM Anthropic account' } },
    })
    AnthropicChatModel4 = {
        model: {
            __rl: true,
            value: 'claude-haiku-4-5-20251001',
            mode: 'list',
            cachedResultName: 'Claude Haiku 4.5',
        },
        options: {
            temperature: 0.2,
        },
    };

    @node({
        id: 'a143193f-e45b-4098-9a4b-63da49b61842',
        name: 'Anthropic Chat Model5',
        type: '@n8n/n8n-nodes-langchain.lmChatAnthropic',
        version: 1.3,
        position: [4432, 304],
        credentials: { anthropicApi: { id: '0c1nNLaJWpeD3Cqz', name: 'Syntech GM Anthropic account' } },
    })
    AnthropicChatModel5 = {
        model: {
            __rl: true,
            value: 'claude-haiku-4-5-20251001',
            mode: 'list',
            cachedResultName: 'Claude Haiku 4.5',
        },
        options: {
            temperature: 0.2,
        },
    };

    @node({
        id: 'd048df84-93bf-40aa-ab31-182f6577a79f',
        name: 'swap open ai with claude',
        type: '@n8n/n8n-nodes-langchain.chainLlm',
        version: 1.7,
        position: [4384, 80],
        retryOnFail: true,
        waitBetweenTries: 5000,
    })
    SwapOpenAiWithClaude = {
        promptType: 'define',
        text: `=<content>
{{ $('Scrape a url and get its content2').item.json.data.markdown }}
</content>`,
        hasOutputParser: true,
        needsFallback: true,
        messages: {
            messageValues: [
                {
                    message: `=<prompt>
  <task>
    Your primary tasks are to analyze the provided content and generate a JSON object containing two key-value pairs:
    1. **title:** A clear, descriptive, news-style title that reflects the core information or event in the content.
    2. **summary:** A concise and informative summary of the key details in the content.
  </task>

  <steps>
    1. Review the content thoroughly.
    2. Identify the primary news, announcement, or action being reported.
    3. Write a summary that distills the essential information, adhering to the word count limit.
    4. Write a title in the style of a news or trade publication headline. Focus on describing what happened or is happening — not selling a benefit.
    5. Format the final output as a single JSON object.
  </steps>

  <restrictions>
    - **Summary Word Count:** Max 50 words.
    - **Title Style:** Use objective, publication-style phrasing — not benefit-driven or marketing-style.
    - **Clarity:** Avoid jargon; prioritize informative clarity.
    - **JSON Formatting:** Final output must be a single, valid JSON object enclosed in a markdown code block. No text before or after the JSON.
  </restrictions>

  <output_rules>
    - **Format:** Raw JSON object.
    - **Keys:** Must contain exactly two keys: \`title\` and \`summary\`.
    - **Values:** Both values must be strings.
    - **Tone:** Professional, factual, and informative.
  </output_rules>

  <examples>
    ### Example 1
    **Input Content:** A press release detailing the launch of Syntech ASB and its ISCC certification.
    **Output:**
    [Start of JSON Output]
    {
      "title": "Syntech Launches UK-Made ISCC-Certified Biofuel from Used Cooking Oil",
      "summary": "Syntech ASB is a new ISCC-certified biofuel made entirely from used cooking oil. It is a drop-in replacement for diesel, allowing businesses to reduce carbon emissions by up to 90% without engine modifications or new equipment investments."
    }
    [End of JSON Output]
  </examples>
</prompt>`,
                },
            ],
        },
        batching: {
            batchSize: 20,
        },
    };

    @node({
        id: '613751ad-e2c4-4b48-bf50-58c63dcdc3f8',
        name: 'Anthropic Chat Model6',
        type: '@n8n/n8n-nodes-langchain.lmChatAnthropic',
        version: 1.3,
        position: [1296, 1024],
        credentials: { anthropicApi: { id: '0c1nNLaJWpeD3Cqz', name: 'Syntech GM Anthropic account' } },
    })
    AnthropicChatModel6 = {
        model: {
            __rl: true,
            value: 'claude-sonnet-4-5-20250929',
            mode: 'list',
            cachedResultName: 'Claude Sonnet 4.5',
        },
        options: {
            temperature: 0.2,
        },
    };

    @node({
        id: 'f2f2f3c0-6b7d-46f1-9446-4eb711a6e711',
        name: 'OpenAI Chat Model1',
        type: '@n8n/n8n-nodes-langchain.lmChatOpenAi',
        version: 1.3,
        position: [4288, 1136],
        credentials: { openAiApi: { id: 'NoEKitspBJb0zQrp', name: 'Syntech GM OpenAi account' } },
    })
    OpenaiChatModel1 = {
        model: {
            __rl: true,
            value: 'gpt-4.1-nano',
            mode: 'list',
            cachedResultName: 'gpt-4.1-nano',
        },
        builtInTools: {},
        options: {
            temperature: 0.2,
        },
    };

    @node({
        id: '24b956a6-95ae-4d64-9b75-2d88ff908b47',
        name: 'OpenAI Chat Model',
        type: '@n8n/n8n-nodes-langchain.lmChatOpenAi',
        version: 1.3,
        position: [4320, 288],
        credentials: { openAiApi: { id: 'NoEKitspBJb0zQrp', name: 'Syntech GM OpenAi account' } },
    })
    OpenaiChatModel = {
        model: {
            __rl: true,
            value: 'gpt-4.1-nano',
            mode: 'list',
            cachedResultName: 'gpt-4.1-nano',
        },
        builtInTools: {},
        options: {
            temperature: 0.2,
        },
    };

    @node({
        id: '68ef2026-34aa-4363-9a6e-4bfab5d3516c',
        name: 'OpenAI Chat Model5',
        type: '@n8n/n8n-nodes-langchain.lmChatOpenAi',
        version: 1.3,
        position: [1008, 832],
        credentials: { openAiApi: { id: 'NoEKitspBJb0zQrp', name: 'Syntech GM OpenAi account' } },
    })
    OpenaiChatModel5 = {
        model: {
            __rl: true,
            value: 'gpt-4.1-nano',
            mode: 'list',
            cachedResultName: 'gpt-4.1-nano',
        },
        builtInTools: {},
        options: {
            temperature: 0.2,
        },
    };

    // =====================================================================
    // ROUTAGE ET CONNEXIONS
    // =====================================================================

    @links()
    defineRouting() {
        this.WhenExecutedByAnotherWorkflow.out(0).to(this.Limit15Items.in(0));
        this.EitherUrlOrKeyword5.out(0).to(this.Filter5.in(0));
        this.LoopOverItems6.out(1).to(this.EitherUrlOrKeyword5.in(0));
        this.CreateSummaryAndTitle8.out(0).to(this.CreateARow1.in(0));
        this.Filter5.out(0).to(this.CreateLongtailKeyword6ClaudeOptimised.in(0));
        this.RagWebKeywordSearch1.out(0).to(this.Merge9.in(1));
        this.Merge.out(0).to(this.IsLessThan3WeeksOld.in(0));
        this.ExtractContent.out(0).to(this.ExtractDate1.in(0));
        this.ExtractContent.out(1).to(this.ScrapeAUrlAndGetItsContent2.in(0));
        this.ExtractDate1.out(0).to(this.Markdown1.in(0));
        this.Markdown1.out(0).to(this.CreateSummaryAndTitle8.in(0));
        this.SplitOut.out(0).to(this.Limit.in(0));
        this.CreateLongtailKeyword6ClaudeOptimised.out(0).to(this.SplitOut.in(0));
        this.IfNotError.out(0).to(this.SwapOpenAiWithClaude.in(0));
        this.IfNotError.out(1).to(this.LoopOverItems6.in(0));
        this.RagWebKeywordSearch.out(0).to(this.Merge9.in(0));
        this.Merge9.out(0).to(this.Wait.in(0));
        this.If_.out(0).to(this.RemoveDuplicates.in(0));
        this.If_.out(1).to(this.LoopOverItems6.in(0));
        this.SerapiGoogleNews.out(0).to(this.SplitOutNewsArticles.in(0));
        this.SerapiGoogleNews.out(1).to(this.LoopOverItems6.in(0));
        this.Limit.out(0).to(this.SerapiGoogleNews.in(0));
        this.SplitOutNewsArticles.out(0).to(this.Merge.in(0));
        this.SplitOutNewsArticles.out(0).to(this.CreateARow.in(0));
        this.RemoveDuplicates.out(0).to(this.ExtractContent.in(0));
        this.ScrapeAUrlAndGetItsContent2.out(0).to(this.IfNotError.in(0));
        this.Limit15Items.out(0).to(this.LoopOverItems6.in(0));
        this.IsLessThan3WeeksOld.out(0).to(this.If_.in(0));
        this.GetManyRowsSb.out(0).to(this.CreateARowSb.in(0));
        this.CreateARowSb.out(0).to(this.CreateARowSb1.in(0));
        this.CreateARowSb1.out(0).to(this.Markdown.in(0));
        this.HasDataApiExample.out(0).to(this.GetManyRowsSb.in(0));
        this.CreateARow1.out(0).to(this.SetArticleContent.in(0));
        this.CreateARow.out(0).to(this.Merge.in(1));
        this.CreateARow2.out(0).to(this.RagWebKeywordSearch.in(0));
        this.Markdown.out(0).to(this.EditFields1.in(0));
        this.EditFields2.out(0).to(this.CreateSummaryAndTitle10.in(0));
        this.CreateSummaryAndTitle10.out(0).to(this.RagWebKeywordSearch2.in(0));
        this.WhenClickingExecuteWorkflow.out(0).to(this.EditFields2.in(0));
        this.ExtractingCleanArticle.out(0).to(this.RagWebKeywordSearch1.in(0));
        this.SetArticleContent.out(0).to(this.ExtractingCleanArticle.in(0));
        this.Wait.out(0).to(this.LoopOverItems6.in(0));
        this.SwapOpenAiWithClaude.out(0).to(this.CreateARow2.in(0));

        this.CreateSummaryAndTitle8.uses({
            ai_languageModel: this.OpenaiChatModel1.output,
            ai_outputParser: this.StructuredOutputParser15.output,
        });
        this.StructuredOutputParser15.uses({
            ai_languageModel: this.AnthropicChatModel.output,
        });
        this.CreateLongtailKeyword5.uses({
            ai_languageModel: this.OpenaiChatModel2.output,
            ai_outputParser: this.StructuredOutputParser3.output,
        });
        this.StructuredOutputParser5.uses({
            ai_languageModel: this.AnthropicChatModel6.output,
        });
        this.CreateLongtailKeyword6ClaudeOptimised.uses({
            ai_languageModel: this.OpenaiChatModel5.output,
            ai_outputParser: this.StructuredOutputParser5.output,
        });
        this.StructuredOutputParser2.uses({
            ai_languageModel: this.AnthropicChatModel1.output,
        });
        this.CreateSummaryAndTitle10.uses({
            ai_languageModel: this.OpenaiChatModel4.output,
        });
        this.ExtractingCleanArticle.uses({
            ai_languageModel: this.OpenaiChatModel3.output,
        });
        this.SwapOpenAiWithClaude.uses({
            ai_languageModel: this.OpenaiChatModel.output,
            ai_outputParser: this.StructuredOutputParser2.output,
        });
    }
}
