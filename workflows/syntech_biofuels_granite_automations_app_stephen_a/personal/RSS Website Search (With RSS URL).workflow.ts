import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : RSS Website Search (With RSS URL)
// Nodes   : 44  |  Connections: 36
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// WhenExecutedByAnotherWorkflow      executeWorkflowTrigger
// RssRead                            rssFeedRead                [onError→out(1)] [alwaysOutput]
// ScrapeAUrlAndGetItsContent2        firecrawl                  [onError→regular] [creds]
// IfNotError                         if
// ExtractContent                     httpRequest                [onError→out(1)]
// Markdown1                          markdown
// ExtractDate1                       code
// LoopOverItems4                     splitInBatches
// CreateSummaryAndTitle              chainLlm                   [AI] [onError→regular] [retry]
// StructuredOutputParser2            outputParserStructured     [AI] [ai_outputParser]
// Merge9                             merge
// CreateSummaryAndTitle9             chainLlm                   [AI] [retry]
// StructuredOutputParser6            outputParserStructured     [AI] [ai_outputParser]
// EitherUrlOrKeyword4                set
// StickyNote7                        stickyNote
// RssSearchFields                    set
// RssSearchFields1                   set
// Merge                              merge                      [alwaysOutput]
// If1                                if
// Deepseek3                          lmChatOpenRouter           [creds]
// Deepseek31                         lmChatOpenRouter           [creds]
// SetUrls                            set
// EditFields                         set
// Wait                               wait
// Limit                              limit
// GetManyRowsSb                      supabase                   [creds] [executeOnce]
// CreateARowSb                       supabase                   [creds]
// CreateARowSb1                      supabase                   [creds]
// CreateARow                         dataTable
// GetManyRows1                       dataTable                  [executeOnce]
// CreateARow1                        dataTable
// Markdown                           markdown
// EditFields1                        set
// RssSearchFields2                   set
// RssSearchFields3                   set
// Get20Ideas                         limit
// StickyNote                         stickyNote
// EditFields2                        set
// OpenaiChatModel                    lmChatOpenAi               [creds] [ai_languageModel]
// ExtractCleanContent                chainLlm                   [AI] [retry]
// AnthropicChatModel                 lmChatAnthropic            [creds] [ai_languageModel]
// OpenaiChatModel5                   lmChatOpenAi               [creds] [ai_languageModel]
// OpenaiChatModel6                   lmChatOpenAi               [creds] [ai_languageModel]
// AnthropicChatModel1                lmChatAnthropic            [creds] [ai_languageModel]
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// WhenExecutedByAnotherWorkflow
//    → Limit
//      → LoopOverItems4
//       .out(1) → EitherUrlOrKeyword4
//          → RssRead
//            → EditFields
//              → Merge
//                → If1
//                  → Get20Ideas
//                    → SetUrls
//                      → ExtractContent
//                        → ExtractDate1
//                          → Markdown1
//                            → CreateSummaryAndTitle9
//                              → CreateARow1
//                                → EditFields2
//                                  → ExtractCleanContent
//                                    → RssSearchFields
//                                      → Merge9.in(1)
//                                        → LoopOverItems4 (↩ loop)
//                       .out(1) → Wait
//                          → ScrapeAUrlAndGetItsContent2
//                            → IfNotError
//                              → CreateSummaryAndTitle
//                                → CreateARow
//                                  → RssSearchFields1
//                                    → Merge9 (↩ loop)
//                             .out(1) → LoopOverItems4 (↩ loop)
//                 .out(1) → LoopOverItems4 (↩ loop)
//           .out(1) → GetManyRows1
//              → Merge.in(1) (↩ loop)
// GetManyRowsSb
//    → CreateARowSb1
//      → CreateARowSb
//        → RssSearchFields3
//          → RssSearchFields2
//            → Markdown
//              → EditFields1
//
// AI CONNECTIONS
// CreateSummaryAndTitle.uses({ ai_outputParser: StructuredOutputParser2, ai_languageModel: OpenaiChatModel6 })
// StructuredOutputParser2.uses({ ai_languageModel: AnthropicChatModel1 })
// CreateSummaryAndTitle9.uses({ ai_outputParser: StructuredOutputParser6, ai_languageModel: OpenaiChatModel5 })
// StructuredOutputParser6.uses({ ai_languageModel: AnthropicChatModel })
// ExtractCleanContent.uses({ ai_languageModel: OpenaiChatModel })
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'iMG6XApQjSxVQxIe',
    name: 'RSS Website Search (With RSS URL)',
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
        timeSavedPerExecution: 5,
    },
})
export class RssWebsiteSearchWithRssUrlWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: '03f7228f-392c-47b4-a823-ad82b246c9b7',
        name: 'When Executed by Another Workflow',
        type: 'n8n-nodes-base.executeWorkflowTrigger',
        version: 1.1,
        position: [-1552, 1152],
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
        id: 'aca2d549-17fe-4072-ad0d-4434c345d250',
        name: 'RSS Read',
        type: 'n8n-nodes-base.rssFeedRead',
        version: 1.2,
        position: [-656, 544],
        onError: 'continueErrorOutput',
        alwaysOutputData: true,
    })
    RssRead = {
        url: '={{ $json.url_or_keyword }}',
        options: {},
    };

    @node({
        id: 'b0648335-5066-4db2-80a9-f5ea1a0cad4d',
        name: 'Scrape a url and get its content2',
        type: '@mendable/n8n-nodes-firecrawl.firecrawl',
        version: 1,
        position: [1136, 352],
        credentials: { firecrawlApi: { id: 'i4QliNET9guWjKJf', name: 'Syntech GM Firecrawl account' } },
        onError: 'continueRegularOutput',
    })
    ScrapeAUrlAndGetItsContent2 = {
        operation: 'scrape',
        requestOptions: {},
    };

    @node({
        id: 'fc52058c-9161-4829-b894-cad31468d8a5',
        name: 'If Not Error',
        type: 'n8n-nodes-base.if',
        version: 2.2,
        position: [1504, 352],
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
        id: 'f9d14987-f5aa-458b-b475-5cda4395da75',
        name: 'extract content',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.2,
        position: [688, 544],
        onError: 'continueErrorOutput',
    })
    ExtractContent = {
        url: "={{ decodeURIComponent($json.set_url.match(/url=([^&]+)/)?.[1] || '') || $json.set_url }}",
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
        id: 'adeb3b6f-8629-4dcd-a20a-32aff0e9f2b1',
        name: 'Markdown1',
        type: 'n8n-nodes-base.markdown',
        version: 1,
        position: [1136, 752],
    })
    Markdown1 = {
        html: "={{ $('extract content').item.json.data || '' }}",
        destinationKey: 'linebreak',
        options: {
            ignore: 'nav, footer, header, form, iframe',
        },
    };

    @node({
        id: '85560df6-6cf3-4658-8ff2-09bdaa9deb75',
        name: 'extract date1',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [912, 752],
    })
    ExtractDate1 = {
        mode: 'runOnceForEachItem',
        jsCode: `const htmlContent = $node["extract content"].json["data"];

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
        id: '81458de0-125e-4c3c-9b48-40b23cc5ac7f',
        name: 'Loop Over Items4',
        type: 'n8n-nodes-base.splitInBatches',
        version: 3,
        position: [-1104, 1152],
    })
    LoopOverItems4 = {
        options: {},
    };

    @node({
        id: 'fa30100b-0198-4256-ad12-79c9ad0f195f',
        name: 'Create summary and title',
        type: '@n8n/n8n-nodes-langchain.chainLlm',
        version: 1.7,
        position: [1856, 240],
        onError: 'continueRegularOutput',
        retryOnFail: true,
        waitBetweenTries: 5000,
    })
    CreateSummaryAndTitle = {
        promptType: 'define',
        text: `=<content>
{{ $('Scrape a url and get its content2').item.json.data.markdown }}
</content>`,
        hasOutputParser: true,
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
        batching: {},
    };

    @node({
        id: '242d85eb-b0ea-48e0-a3be-ee40f4862c20',
        name: 'Structured Output Parser2',
        type: '@n8n/n8n-nodes-langchain.outputParserStructured',
        version: 1.3,
        position: [2048, 464],
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
        id: 'e144fa64-fb52-4564-9f7a-b3d19ccf7084',
        name: 'Merge9',
        type: 'n8n-nodes-base.merge',
        version: 3.2,
        position: [3008, 752],
    })
    Merge9 = {};

    @node({
        id: '6e646c48-93f8-46b3-81ce-e3caf592ae36',
        name: 'Create summary and title9',
        type: '@n8n/n8n-nodes-langchain.chainLlm',
        version: 1.7,
        position: [1392, 752],
        retryOnFail: true,
        waitBetweenTries: 5000,
    })
    CreateSummaryAndTitle9 = {
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
        batching: {},
    };

    @node({
        id: '3f4b0c43-2572-47b7-8b1f-c75ae8b433a8',
        name: 'Structured Output Parser6',
        type: '@n8n/n8n-nodes-langchain.outputParserStructured',
        version: 1.3,
        position: [1488, 976],
    })
    StructuredOutputParser6 = {
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
        id: '723b2d6b-0d30-42e4-9a09-eb52c8d84ff0',
        name: 'Either Url or Keyword4',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [-880, 544],
    })
    EitherUrlOrKeyword4 = {
        assignments: {
            assignments: [
                {
                    id: '8efead37-57d8-4101-9010-c855f2525db6',
                    name: 'url_or_keyword',
                    value: '={{ $json.property_rss_feed || $json.url_or_keyword }}',
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
            ],
        },
        options: {},
    };

    @node({
        id: '95cfe887-55c3-4096-a8ed-c3d121033698',
        name: 'Sticky Note7',
        type: 'n8n-nodes-base.stickyNote',
        version: 1,
        position: [-1632, 240],
    })
    StickyNote7 = {
        content: '## Try to scrape this RSS article using Firecrawl',
        height: 1088,
        width: 4800,
        color: 4,
    };

    @node({
        id: '201bcada-7855-44de-8f45-c8cb60f0c6f9',
        name: 'RSS search fields',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [2784, 752],
    })
    RssSearchFields = {
        assignments: {
            assignments: [
                {
                    id: '53313200-69a8-4749-b320-7ad926795be1',
                    name: 'title',
                    value: "={{ $('Merge').item.json.title || $('Create summary and title9').item.json.output.title }}",
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
                    value: "={{ $('Merge').item.json.link }}",
                    type: 'string',
                },
                {
                    id: 'b72746e5-4271-48e7-af68-4e1bdfd40452',
                    name: 'summary',
                    value: "={{ $('Create summary and title9').item.json.output.summary }}",
                    type: 'string',
                },
                {
                    id: '39872c24-4acc-4513-b7fb-7689cd511afb',
                    name: 'search_query',
                    value: "={{ $if($('Limit').isExecuted, $('Limit').item.json.property_rss_feed, undefined) || $if($('When Executed by Another Workflow').isExecuted, $('When Executed by Another Workflow').item.json.url_or_keyword, undefined) }}",
                    type: 'string',
                },
                {
                    id: '42852696-c7af-4ce4-a273-e61970ef2e8f',
                    name: 'publication_date',
                    value: "={{ $if($('Merge').isExecuted, $('Merge').item.json.pubDate || $('extract date1').item.json.publishedDate ||'') }}",
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
                    value: 'RSS',
                    type: 'string',
                },
                {
                    id: '8f8e993b-8d0f-4adc-a788-5aa6359ec0c5',
                    name: 'source_category',
                    value: "={{ $('When Executed by Another Workflow').item.json.property_category }}",
                    type: 'string',
                },
                {
                    id: '8a7e7ea6-40c1-490d-8d37-ec928232766c',
                    name: 'source_name',
                    value: "={{ $('When Executed by Another Workflow').item.json.property_name }}",
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
        id: 'c437d7f9-0353-42d6-b8b0-2f55d3ce5601',
        name: 'RSS search fields1',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [2496, 352],
    })
    RssSearchFields1 = {
        assignments: {
            assignments: [
                {
                    id: '53313200-69a8-4749-b320-7ad926795be1',
                    name: 'title',
                    value: "={{ $('Merge').item.json.title || $('Create summary and title').item.json.output.title }}",
                    type: 'string',
                },
                {
                    id: 'ab5c9158-a33a-4f8f-b6d0-a6787df0f0d5',
                    name: 'content',
                    value: `=RSS Article Description: 
{{ $if($('Merge').isExecuted, $('Merge').item.json['content:encodedSnippet'], '') || '' }}

{{ $if($('Merge').isExecuted, $('Merge').item.json.contentSnippet, '') }}
------------------
Article page:
{{ 
  $('Scrape a url and get its content2').item.json.data.markdown.removeMarkdown()
}}`,
                    type: 'string',
                },
                {
                    id: 'f0c15fc7-071d-406d-8200-abecbf458836',
                    name: 'url',
                    value: "={{ $('Merge').item.json.link }}",
                    type: 'string',
                },
                {
                    id: 'b72746e5-4271-48e7-af68-4e1bdfd40452',
                    name: 'summary',
                    value: "={{ $('Create summary and title').item.json.output.summary }}",
                    type: 'string',
                },
                {
                    id: '39872c24-4acc-4513-b7fb-7689cd511afb',
                    name: 'search_query',
                    value: "={{ $if($('Limit').isExecuted, $('Limit').item.json.property_rss_feed, undefined) || $if($('When Executed by Another Workflow').isExecuted, $('When Executed by Another Workflow').item.json.url_or_keyword, undefined) }}",
                    type: 'string',
                },
                {
                    id: '42852696-c7af-4ce4-a273-e61970ef2e8f',
                    name: 'publication_date',
                    value: "={{ $if($('Merge').isExecuted, $('Merge').item.json.pubDate || $('Scrape a url and get its content2').item.json.data.metadata.publishedTime || $('Scrape a url and get its content2').item.json.data.metadata.publishedTime || $('Scrape a url and get its content2').item.json.data.metadata['article:published_time'], '') }}",
                    type: 'string',
                },
                {
                    id: '6bd73285-c360-4b10-8567-8ae66ecba2bd',
                    name: 'prompt',
                    value: "={{ $('When Executed by Another Workflow').first().json.source }}",
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
                    value: 'RSS',
                    type: 'string',
                },
                {
                    id: 'f8842b25-c59b-4765-b48b-d27334dbbd6c',
                    name: 'source_category',
                    value: "={{ $('When Executed by Another Workflow').item.json.property_category }}",
                    type: 'string',
                },
                {
                    id: 'df785b48-f361-48bf-9766-2d16bdd1a5e2',
                    name: 'source_name',
                    value: "={{ $('When Executed by Another Workflow').item.json.property_name }}",
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
        id: '8b891382-6cbe-4198-b03e-f79a72e969bd',
        name: 'Merge',
        type: 'n8n-nodes-base.merge',
        version: 3.2,
        position: [-208, 544],
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
        id: '028ce2e1-155a-4cae-978f-85e7dc45d481',
        name: 'If1',
        type: 'n8n-nodes-base.if',
        version: 2.3,
        position: [16, 544],
    })
    If1 = {
        conditions: {
            options: {
                caseSensitive: true,
                leftValue: '',
                typeValidation: 'loose',
                version: 3,
            },
            conditions: [
                {
                    id: '371490de-8c72-493f-8b9a-0cd3bb56f4c4',
                    leftValue: '={{ $json.link }}',
                    rightValue: '',
                    operator: {
                        type: 'string',
                        operation: 'notEmpty',
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
        id: '6e0f7e35-8d2c-495f-9dcf-d3f661ea877c',
        name: 'DeepSeek 3.',
        type: '@n8n/n8n-nodes-langchain.lmChatOpenRouter',
        version: 1,
        position: [-1552, 32],
        credentials: { openRouterApi: { id: 'kUkOiAL6PjmdfexG', name: 'Syntech GM OpenRouter account' } },
    })
    Deepseek3 = {
        model: 'deepseek/deepseek-v3.2',
        options: {},
    };

    @node({
        id: 'ad0d3589-5805-464f-b0b0-eadf1d580089',
        name: 'DeepSeek 3.1',
        type: '@n8n/n8n-nodes-langchain.lmChatOpenRouter',
        version: 1,
        position: [-1552, 1376],
        credentials: { openRouterApi: { id: 'kUkOiAL6PjmdfexG', name: 'Syntech GM OpenRouter account' } },
    })
    Deepseek31 = {
        model: 'deepseek/deepseek-v3.2',
        options: {},
    };

    @node({
        id: '591fdf39-69e2-4931-852e-60eeeb88a44c',
        name: 'set urls',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [464, 544],
        executeOnce: false,
    })
    SetUrls = {
        assignments: {
            assignments: [
                {
                    id: '0f1fd4a3-670d-4861-af5b-bc94fa454574',
                    name: 'set_url',
                    value: "={{ $if($('Merge').isExecuted, $('Merge').item.json.link, '') }}",
                    type: 'string',
                },
            ],
        },
        options: {},
    };

    @node({
        id: '6c4816d0-9d94-43ea-902c-6a1cdd89d3eb',
        name: 'Edit Fields',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [-432, 448],
    })
    EditFields = {
        assignments: {
            assignments: [
                {
                    id: '9daa83c0-18f5-4502-b10c-2d92b2cef282',
                    name: 'link',
                    value: `={{
  decodeURIComponent(
    ($json.link || '')
      .replace(/^https?:\\/\\/www\\.google\\.com\\/url\\?.*?url=/, '')
      .split('&')[0]
  )
}}`,
                    type: 'string',
                },
            ],
        },
        includeOtherFields: true,
        options: {
            ignoreConversionErrors: true,
        },
    };

    @node({
        id: '8496fadc-7760-4a30-9bc1-25fea0a64ca8',
        webhookId: '0b5363ac-7ca5-45a6-95e3-ae68f4b7f4ee',
        name: 'Wait',
        type: 'n8n-nodes-base.wait',
        version: 1.1,
        position: [912, 352],
    })
    Wait = {};

    @node({
        id: '09af34d1-cf92-4e4f-b19c-001aed7c6757',
        name: 'Limit',
        type: 'n8n-nodes-base.limit',
        version: 1,
        position: [-1328, 1152],
    })
    Limit = {
        maxItems: 1000,
    };

    @node({
        id: '92e0b114-1160-4125-9c27-3b10e63e2c93',
        name: 'Get many rows sb',
        type: 'n8n-nodes-base.supabase',
        version: 1,
        position: [-1552, 1584],
        credentials: { supabaseApi: { id: 'IT46INDKsZaZyCZQ', name: 'Stephen Supabase account' } },
        alwaysOutputData: false,
        executeOnce: true,
    })
    GetManyRowsSb = {
        operation: 'getAll',
        tableId: 'Syntech RSS firecrawl url',
        returnAll: true,
        filterType: 'none',
    };

    @node({
        id: 'cb4f070d-6f4b-46b4-9c7b-1be7856ec8ee',
        name: 'Create a row sb',
        type: 'n8n-nodes-base.supabase',
        version: 1,
        position: [-1104, 1584],
        credentials: { supabaseApi: { id: 'IT46INDKsZaZyCZQ', name: 'Stephen Supabase account' } },
    })
    CreateARowSb = {
        tableId: 'Syntech RSS firecrawl url',
        fieldsUi: {
            fieldValues: [
                {
                    fieldId: 'url',
                    fieldValue: "={{ $('Merge').item.json.link }}",
                },
            ],
        },
    };

    @node({
        id: '1ce2fc44-69d7-4a08-aeca-dbb84ee8be85',
        name: 'Create a row sb1',
        type: 'n8n-nodes-base.supabase',
        version: 1,
        position: [-1328, 1584],
        credentials: { supabaseApi: { id: 'IT46INDKsZaZyCZQ', name: 'Stephen Supabase account' } },
    })
    CreateARowSb1 = {
        tableId: 'Syntech RSS firecrawl url',
        fieldsUi: {
            fieldValues: [
                {
                    fieldId: 'url',
                    fieldValue: "={{ $('Merge').item.json.link }}",
                },
            ],
        },
    };

    @node({
        id: '2476f19c-67c4-4dcd-9d5c-3e84ea9a4ca7',
        name: 'Create a row',
        type: 'n8n-nodes-base.dataTable',
        version: 1.1,
        position: [2208, 352],
        executeOnce: false,
    })
    CreateARow = {
        operation: 'upsert',
        dataTableId: {
            __rl: true,
            value: 'fLvz1THUu62Lp3Ev',
            mode: 'list',
            cachedResultName: 'NEWS+ RSS w URL',
            cachedResultUrl: '/projects/U9sMeJya1DaokkjK/datatables/fLvz1THUu62Lp3Ev',
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
        id: 'ffe86446-6588-4295-b117-aa90ec99d879',
        name: 'Get many rows1',
        type: 'n8n-nodes-base.dataTable',
        version: 1.1,
        position: [-432, 848],
        executeOnce: true,
    })
    GetManyRows1 = {
        operation: 'get',
        dataTableId: {
            __rl: true,
            value: 'fLvz1THUu62Lp3Ev',
            mode: 'list',
            cachedResultName: 'NEWS+ RSS w URL',
            cachedResultUrl: '/projects/U9sMeJya1DaokkjK/datatables/fLvz1THUu62Lp3Ev',
        },
        returnAll: true,
    };

    @node({
        id: 'd23ff821-5850-4923-8e11-ac1a2cca85e2',
        name: 'Create a row1',
        type: 'n8n-nodes-base.dataTable',
        version: 1.1,
        position: [1920, 752],
        executeOnce: false,
    })
    CreateARow1 = {
        operation: 'upsert',
        dataTableId: {
            __rl: true,
            value: 'fLvz1THUu62Lp3Ev',
            mode: 'list',
            cachedResultName: 'NEWS+ RSS w URL',
            cachedResultUrl: '/projects/U9sMeJya1DaokkjK/datatables/fLvz1THUu62Lp3Ev',
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
        id: '6eb86d33-8ba4-4240-a174-cc780b35945b',
        name: 'Markdown',
        type: 'n8n-nodes-base.markdown',
        version: 1,
        position: [-432, 1584],
    })
    Markdown = {
        html: `=<!doctype html>
<html lang="en-US">
	<head>
				<!-- Google tag (gtag.js) -->
		<script async src="https://www.googletagmanager.com/gtag/js?id=G-LGNTVTWFF1"></script>
		<script>
		window.dataLayer = window.dataLayer || [];
		function gtag(){dataLayer.push(arguments);}
		gtag('js', new Date());

		gtag('config', 'G-LGNTVTWFF1');
		</script>
		
		<meta charset="UTF-8">
<script>
var gform;gform||(document.addEventListener("gform_main_scripts_loaded",function(){gform.scriptsLoaded=!0}),document.addEventListener("gform/theme/scripts_loaded",function(){gform.themeScriptsLoaded=!0}),window.addEventListener("DOMContentLoaded",function(){gform.domLoaded=!0}),gform={domLoaded:!1,scriptsLoaded:!1,themeScriptsLoaded:!1,isFormEditor:()=>"function"==typeof InitializeEditor,callIfLoaded:function(o){return!(!gform.domLoaded||!gform.scriptsLoaded||!gform.themeScriptsLoaded&&!gform.isFormEditor()||(gform.isFormEditor()&&console.warn("The use of gform.initializeOnLoaded() is deprecated in the form editor context and will be removed in Gravity Forms 3.1."),o(),0))},initializeOnLoaded:function(o){gform.callIfLoaded(o)||(document.addEventListener("gform_main_scripts_loaded",()=>{gform.scriptsLoaded=!0,gform.callIfLoaded(o)}),document.addEventListener("gform/theme/scripts_loaded",()=>{gform.themeScriptsLoaded=!0,gform.callIfLoaded(o)}),window.addEventListener("DOMContentLoaded",()=>{gform.domLoaded=!0,gform.callIfLoaded(o)}))},hooks:{action:{},filter:{}},addAction:function(o,r,e,t){gform.addHook("action",o,r,e,t)},addFilter:function(o,r,e,t){gform.addHook("filter",o,r,e,t)},doAction:function(o){gform.doHook("action",o,arguments)},applyFilters:function(o){return gform.doHook("filter",o,arguments)},removeAction:function(o,r){gform.removeHook("action",o,r)},removeFilter:function(o,r,e){gform.removeHook("filter",o,r,e)},addHook:function(o,r,e,t,n){null==gform.hooks[o][r]&&(gform.hooks[o][r]=[]);var d=gform.hooks[o][r];null==n&&(n=r+"_"+d.length),gform.hooks[o][r].push({tag:n,callable:e,priority:t=null==t?10:t})},doHook:function(r,o,e){var t;if(e=Array.prototype.slice.call(e,1),null!=gform.hooks[r][o]&&((o=gform.hooks[r][o]).sort(function(o,r){return o.priority-r.priority}),o.forEach(function(o){"function"!=typeof(t=o.callable)&&(t=window[t]),"action"==r?t.apply(null,e):e[0]=t.apply(null,e)})),"filter"==r)return e[0]},removeHook:function(o,r,t,n){var e;null!=gform.hooks[o][r]&&(e=(e=gform.hooks[o][r]).filter(function(o,r,e){return!!(null!=n&&n!=o.tag||null!=t&&t!=o.priority)}),gform.hooks[o][r]=e)}});
</script>

		<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
		<link rel="profile" href="https://gmpg.org/xfn/11">

		<meta name='robots' content='index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' />

	<!-- This site is optimized with the Yoast SEO Premium plugin v26.8 (Yoast SEO v26.8) - https://yoast.com/product/yoast-seo-premium-wordpress/ -->
	<title>Meet the 2025 Outstanding Congressional Staff Award Winners</title>
	<meta name="description" content="Growth Energy proudly recognizes the 2025 Outstanding Congressional Staff award winners; leading staffers who have gone above and beyond to actively engage with Growth Energy and our members on issues that impact the biofuels industry." />
	<link rel="canonical" href="https://growthenergy.org/2025/09/16/2025-staff-award-winners/" />
	<meta property="og:locale" content="en_US" />
	<meta property="og:type" content="article" />
	<meta property="og:title" content="Meet the 2025 Outstanding Congressional Staff Award Winners" />
	<meta property="og:description" content="Growth Energy proudly recognizes the 2025 Outstanding Congressional Staff award winners; leading staffers who have gone above and beyond to actively engage with Growth Energy and our members on issues that impact the biofuels industry." />
	<meta property="og:url" content="https://growthenergy.org/2025/09/16/2025-staff-award-winners/" />
	<meta property="og:site_name" content="Growth Energy" />
	<meta property="article:published_time" content="2025-09-16T16:00:12+00:00" />
	<meta property="article:modified_time" content="2025-09-16T18:30:05+00:00" />
	<meta property="og:image" content="https://growthenergy.org/wp-content/uploads/2025/09/DSC_8139-1024x591.jpg" />
	<meta property="og:image:width" content="1024" />
	<meta property="og:image:height" content="591" />
	<meta property="og:image:type" content="image/jpeg" />
	<meta name="author" content="Holly Cullen" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:label1" content="Written by" />
	<meta name="twitter:data1" content="Holly Cullen" />
	<meta name="twitter:label2" content="Est. reading time" />
	<meta name="twitter:data2" content="4 minutes" />
	<script type="application/ld+json" class="yoast-schema-graph">{"@context":"https://schema.org","@graph":[{"@type":"Article","@id":"https://growthenergy.org/2025/09/16/2025-staff-award-winners/#article","isPartOf":{"@id":"https://growthenergy.org/2025/09/16/2025-staff-award-winners/"},"author":{"name":"Holly Cullen","@id":"https://growthenergy.org/#/schema/person/a50194e6c9bacef74b6f007dfe80f78b"},"headline":"Meet the 2025 Outstanding Congressional Staff Award Winners","datePublished":"2025-09-16T16:00:12+00:00","dateModified":"2025-09-16T18:30:05+00:00","mainEntityOfPage":{"@id":"https://growthenergy.org/2025/09/16/2025-staff-award-winners/"},"wordCount":525,"image":{"@id":"https://growthenergy.org/2025/09/16/2025-staff-award-winners/#primaryimage"},"thumbnailUrl":"https://growthenergy.org/wp-content/uploads/2025/09/DSC_8139.jpg","articleSection":["Blog"],"inLanguage":"en-US"},{"@type":"WebPage","@id":"https://growthenergy.org/2025/09/16/2025-staff-award-winners/","url":"https://growthenergy.org/2025/09/16/2025-staff-award-winners/","name":"Meet the 2025 Outstanding Congressional Staff Award Winners","isPartOf":{"@id":"https://growthenergy.org/#website"},"primaryImageOfPage":{"@id":"https://growthenergy.org/2025/09/16/2025-staff-award-winners/#primaryimage"},"image":{"@id":"https://growthenergy.org/2025/09/16/2025-staff-award-winners/#primaryimage"},"thumbnailUrl":"https://growthenergy.org/wp-content/uploads/2025/09/DSC_8139.jpg","datePublished":"2025-09-16T16:00:12+00:00","dateModified":"2025-09-16T18:30:05+00:00","author":{"@id":"https://growthenergy.org/#/schema/person/a50194e6c9bacef74b6f007dfe80f78b"},"description":"Growth Energy proudly recognizes the 2025 Outstanding Congressional Staff award winners; leading staffers who have gone above and beyond to actively engage with Growth Energy and our members on issues that impact the biofuels industry.","inLanguage":"en-US","potentialAction":[{"@type":"ReadAction","target":["https://growthenergy.org/2025/09/16/2025-staff-award-winners/"]}]},{"@type":"ImageObject","inLanguage":"en-US","@id":"https://growthenergy.org/2025/09/16/2025-staff-award-winners/#primaryimage","url":"https://growthenergy.org/wp-content/uploads/2025/09/DSC_8139.jpg","contentUrl":"https://growthenergy.org/wp-content/uploads/2025/09/DSC_8139.jpg","width":7713,"height":4450},{"@type":"WebSite","@id":"https://growthenergy.org/#website","url":"https://growthenergy.org/","name":"Growth Energy","description":"Growth Energy is the leading voice of America’s biofuel industry, delivering a new generation of plant-based energy and climate solutions.","potentialAction":[{"@type":"SearchAction","target":{"@type":"EntryPoint","urlTemplate":"https://growthenergy.org/?s={search_term_string}"},"query-input":{"@type":"PropertyValueSpecification","valueRequired":true,"valueName":"search_term_string"}}],"inLanguage":"en-US"},{"@type":"Person","@id":"https://growthenergy.org/#/schema/person/a50194e6c9bacef74b6f007dfe80f78b","name":"Holly Cullen","image":{"@type":"ImageObject","inLanguage":"en-US","@id":"https://growthenergy.org/#/schema/person/image/","url":"https://secure.gravatar.com/avatar/7d5d4ccabdedc4354a32ff6ecbc0f96fb0810c26c73f2631637e241b1dc69d7d?s=96&d=mm&r=g","contentUrl":"https://secure.gravatar.com/avatar/7d5d4ccabdedc4354a32ff6ecbc0f96fb0810c26c73f2631637e241b1dc69d7d?s=96&d=mm&r=g","caption":"Holly Cullen"},"url":"https://growthenergy.org/member/holly-cullen/"}]}</script>
	<!-- / Yoast SEO Premium plugin. -->


<link rel='dns-prefetch' href='//unpkg.com' />
<link rel='dns-prefetch' href='//maps.googleapis.com' />
<link rel='dns-prefetch' href='//www.google.com' />
<link rel="alternate" type="application/rss+xml" title="Growth Energy &raquo; Feed" href="https://growthenergy.org/feed/" />
<link rel="alternate" type="application/rss+xml" title="Growth Energy &raquo; Comments Feed" href="https://growthenergy.org/comments/feed/" />
<link rel="alternate" title="oEmbed (JSON)" type="application/json+oembed" href="https://growthenergy.org/wp-json/oembed/1.0/embed?url=https%3A%2F%2Fgrowthenergy.org%2F2025%2F09%2F16%2F2025-staff-award-winners%2F" />
<link rel="alternate" title="oEmbed (XML)" type="text/xml+oembed" href="https://growthenergy.org/wp-json/oembed/1.0/embed?url=https%3A%2F%2Fgrowthenergy.org%2F2025%2F09%2F16%2F2025-staff-award-winners%2F&#038;format=xml" />
<style id='wp-img-auto-sizes-contain-inline-css'>
img:is([sizes=auto i],[sizes^="auto," i]){contain-intrinsic-size:3000px 1500px}
/*# sourceURL=wp-img-auto-sizes-contain-inline-css */
</style>
<style id='classic-theme-styles-inline-css'>
/*! This file is auto-generated */
.wp-block-button__link{color:#fff;background-color:#32373c;border-radius:9999px;box-shadow:none;text-decoration:none;padding:calc(.667em + 2px) calc(1.333em + 2px);font-size:1.125em}.wp-block-file__button{background:#32373c;color:#fff;text-decoration:none}
/*# sourceURL=/wp-includes/css/classic-themes.min.css */
</style>
<link rel='stylesheet' id='wskt-styles-css' href='https://growthenergy.org/wp-content/themes/wsk-theme/dist/css/styles.css?ver=1764054002' media='all' />
<script src="https://growthenergy.org/wp-includes/js/jquery/jquery.min.js?ver=3.7.1" id="jquery-core-js"></script>
<script src="https://growthenergy.org/wp-includes/js/jquery/jquery-migrate.min.js?ver=3.4.1" id="jquery-migrate-js"></script>
<script src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js?ver=4.1.0" id="lottie-scripts-js"></script>
<link rel="https://api.w.org/" href="https://growthenergy.org/wp-json/" /><link rel="alternate" title="JSON" type="application/json" href="https://growthenergy.org/wp-json/wp/v2/posts/19382" /><link rel="EditURI" type="application/rsd+xml" title="RSD" href="https://growthenergy.org/xmlrpc.php?rsd" />
<link rel='shortlink' href='https://growthenergy.org/?p=19382' />
		<link rel="shortcut icon" href="https://growthenergy.org/wp-content/plugins/wsk-theme-support/dist/img/favicon.ico" />

		<link rel="apple-touch-icon-precomposed" sizes="57x57" href="https://growthenergy.org/wp-content/plugins/wsk-theme-support/dist/img/apple-touch-icon-57x57.png" />
		<link rel="apple-touch-icon-precomposed" sizes="114x114" href="https://growthenergy.org/wp-content/plugins/wsk-theme-support/dist/img/apple-touch-icon-114x114.png" />
		<link rel="apple-touch-icon-precomposed" sizes="72x72" href="https://growthenergy.org/wp-content/plugins/wsk-theme-support/dist/img/apple-touch-icon-72x72.png" />
		<link rel="apple-touch-icon-precomposed" sizes="144x144" href="https://growthenergy.org/wp-content/plugins/wsk-theme-support/dist/img/apple-touch-icon-144x144.png" />
		<link rel="apple-touch-icon-precomposed" sizes="60x60" href="https://growthenergy.org/wp-content/plugins/wsk-theme-support/dist/img/apple-touch-icon-60x60.png" />
		<link rel="apple-touch-icon-precomposed" sizes="120x120" href="https://growthenergy.org/wp-content/plugins/wsk-theme-support/dist/img/apple-touch-icon-120x120.png" />
		<link rel="apple-touch-icon-precomposed" sizes="76x76" href="https://growthenergy.org/wp-content/plugins/wsk-theme-support/dist/img/apple-touch-icon-76x76.png" />
		<link rel="apple-touch-icon-precomposed" sizes="152x152" href="https://growthenergy.org/wp-content/plugins/wsk-theme-support/dist/img/apple-touch-icon-152x152.png" />

		<link rel="icon" type="image/png" href="https://growthenergy.org/wp-content/plugins/wsk-theme-support/dist/img/favicon-196x196.png" sizes="196x196" />
		<link rel="icon" type="image/png" href="https://growthenergy.org/wp-content/plugins/wsk-theme-support/dist/img/favicon-96x96.png" sizes="96x96" />
		<link rel="icon" type="image/png" href="https://growthenergy.org/wp-content/plugins/wsk-theme-support/dist/img/favicon-32x32.png" sizes="32x32" />
		<link rel="icon" type="image/png" href="https://growthenergy.org/wp-content/plugins/wsk-theme-support/dist/img/favicon-16x16.png" sizes="16x16" />
		<link rel="icon" type="image/png" href="https://growthenergy.org/wp-content/plugins/wsk-theme-support/dist/img/favicon-128.png" sizes="128x128" />

		<meta name="application-name" content="Growth Energy">
		<meta name="msapplication-tooltip" content="Growth Energy is the leading voice of America’s biofuel industry, delivering a new generation of plant-based energy and climate solutions.">
		<meta name="msapplication-TileColor" content="#FFFFFF" />
		<meta name="msapplication-TileImage" content="https://growthenergy.org/wp-content/plugins/wsk-theme-support/dist/img/mstile-144x144.png" />
		<meta name="msapplication-square70x70logo" content="https://growthenergy.org/wp-content/plugins/wsk-theme-support/dist/img/mstile-70x70.png" />
		<meta name="msapplication-square150x150logo" content="https://growthenergy.org/wp-content/plugins/wsk-theme-support/dist/img/mstile-150x150.png" />
		<meta name="msapplication-wide310x150logo" content="https://growthenergy.org/wp-content/plugins/wsk-theme-support/dist/img/mstile-310x150.png" />
		<meta name="msapplication-square310x310logo" content="https://growthenergy.org/wp-content/plugins/wsk-theme-support/dist/img/mstile-310x310.png" />
			<style id='global-styles-inline-css'>
:root{--wp--preset--aspect-ratio--square: 1;--wp--preset--aspect-ratio--4-3: 4/3;--wp--preset--aspect-ratio--3-4: 3/4;--wp--preset--aspect-ratio--3-2: 3/2;--wp--preset--aspect-ratio--2-3: 2/3;--wp--preset--aspect-ratio--16-9: 16/9;--wp--preset--aspect-ratio--9-16: 9/16;--wp--preset--color--black: #000000;--wp--preset--color--cyan-bluish-gray: #abb8c3;--wp--preset--color--white: #ffffff;--wp--preset--color--pale-pink: #f78da7;--wp--preset--color--vivid-red: #cf2e2e;--wp--preset--color--luminous-vivid-orange: #ff6900;--wp--preset--color--luminous-vivid-amber: #fcb900;--wp--preset--color--light-green-cyan: #7bdcb5;--wp--preset--color--vivid-green-cyan: #00d084;--wp--preset--color--pale-cyan-blue: #8ed1fc;--wp--preset--color--vivid-cyan-blue: #0693e3;--wp--preset--color--vivid-purple: #9b51e0;--wp--preset--gradient--vivid-cyan-blue-to-vivid-purple: linear-gradient(135deg,rgb(6,147,227) 0%,rgb(155,81,224) 100%);--wp--preset--gradient--light-green-cyan-to-vivid-green-cyan: linear-gradient(135deg,rgb(122,220,180) 0%,rgb(0,208,130) 100%);--wp--preset--gradient--luminous-vivid-amber-to-luminous-vivid-orange: linear-gradient(135deg,rgb(252,185,0) 0%,rgb(255,105,0) 100%);--wp--preset--gradient--luminous-vivid-orange-to-vivid-red: linear-gradient(135deg,rgb(255,105,0) 0%,rgb(207,46,46) 100%);--wp--preset--gradient--very-light-gray-to-cyan-bluish-gray: linear-gradient(135deg,rgb(238,238,238) 0%,rgb(169,184,195) 100%);--wp--preset--gradient--cool-to-warm-spectrum: linear-gradient(135deg,rgb(74,234,220) 0%,rgb(151,120,209) 20%,rgb(207,42,186) 40%,rgb(238,44,130) 60%,rgb(251,105,98) 80%,rgb(254,248,76) 100%);--wp--preset--gradient--blush-light-purple: linear-gradient(135deg,rgb(255,206,236) 0%,rgb(152,150,240) 100%);--wp--preset--gradient--blush-bordeaux: linear-gradient(135deg,rgb(254,205,165) 0%,rgb(254,45,45) 50%,rgb(107,0,62) 100%);--wp--preset--gradient--luminous-dusk: linear-gradient(135deg,rgb(255,203,112) 0%,rgb(199,81,192) 50%,rgb(65,88,208) 100%);--wp--preset--gradient--pale-ocean: linear-gradient(135deg,rgb(255,245,203) 0%,rgb(182,227,212) 50%,rgb(51,167,181) 100%);--wp--preset--gradient--electric-grass: linear-gradient(135deg,rgb(202,248,128) 0%,rgb(113,206,126) 100%);--wp--preset--gradient--midnight: linear-gradient(135deg,rgb(2,3,129) 0%,rgb(40,116,252) 100%);--wp--preset--font-size--small: 13px;--wp--preset--font-size--medium: 20px;--wp--preset--font-size--large: 36px;--wp--preset--font-size--x-large: 42px;--wp--preset--spacing--20: 0.44rem;--wp--preset--spacing--30: 0.67rem;--wp--preset--spacing--40: 1rem;--wp--preset--spacing--50: 1.5rem;--wp--preset--spacing--60: 2.25rem;--wp--preset--spacing--70: 3.38rem;--wp--preset--spacing--80: 5.06rem;--wp--preset--shadow--natural: 6px 6px 9px rgba(0, 0, 0, 0.2);--wp--preset--shadow--deep: 12px 12px 50px rgba(0, 0, 0, 0.4);--wp--preset--shadow--sharp: 6px 6px 0px rgba(0, 0, 0, 0.2);--wp--preset--shadow--outlined: 6px 6px 0px -3px rgb(255, 255, 255), 6px 6px rgb(0, 0, 0);--wp--preset--shadow--crisp: 6px 6px 0px rgb(0, 0, 0);}:where(.is-layout-flex){gap: 0.5em;}:where(.is-layout-grid){gap: 0.5em;}body .is-layout-flex{display: flex;}.is-layout-flex{flex-wrap: wrap;align-items: center;}.is-layout-flex > :is(*, div){margin: 0;}body .is-layout-grid{display: grid;}.is-layout-grid > :is(*, div){margin: 0;}:where(.wp-block-columns.is-layout-flex){gap: 2em;}:where(.wp-block-columns.is-layout-grid){gap: 2em;}:where(.wp-block-post-template.is-layout-flex){gap: 1.25em;}:where(.wp-block-post-template.is-layout-grid){gap: 1.25em;}.has-black-color{color: var(--wp--preset--color--black) !important;}.has-cyan-bluish-gray-color{color: var(--wp--preset--color--cyan-bluish-gray) !important;}.has-white-color{color: var(--wp--preset--color--white) !important;}.has-pale-pink-color{color: var(--wp--preset--color--pale-pink) !important;}.has-vivid-red-color{color: var(--wp--preset--color--vivid-red) !important;}.has-luminous-vivid-orange-color{color: var(--wp--preset--color--luminous-vivid-orange) !important;}.has-luminous-vivid-amber-color{color: var(--wp--preset--color--luminous-vivid-amber) !important;}.has-light-green-cyan-color{color: var(--wp--preset--color--light-green-cyan) !important;}.has-vivid-green-cyan-color{color: var(--wp--preset--color--vivid-green-cyan) !important;}.has-pale-cyan-blue-color{color: var(--wp--preset--color--pale-cyan-blue) !important;}.has-vivid-cyan-blue-color{color: var(--wp--preset--color--vivid-cyan-blue) !important;}.has-vivid-purple-color{color: var(--wp--preset--color--vivid-purple) !important;}.has-black-background-color{background-color: var(--wp--preset--color--black) !important;}.has-cyan-bluish-gray-background-color{background-color: var(--wp--preset--color--cyan-bluish-gray) !important;}.has-white-background-color{background-color: var(--wp--preset--color--white) !important;}.has-pale-pink-background-color{background-color: var(--wp--preset--color--pale-pink) !important;}.has-vivid-red-background-color{background-color: var(--wp--preset--color--vivid-red) !important;}.has-luminous-vivid-orange-background-color{background-color: var(--wp--preset--color--luminous-vivid-orange) !important;}.has-luminous-vivid-amber-background-color{background-color: var(--wp--preset--color--luminous-vivid-amber) !important;}.has-light-green-cyan-background-color{background-color: var(--wp--preset--color--light-green-cyan) !important;}.has-vivid-green-cyan-background-color{background-color: var(--wp--preset--color--vivid-green-cyan) !important;}.has-pale-cyan-blue-background-color{background-color: var(--wp--preset--color--pale-cyan-blue) !important;}.has-vivid-cyan-blue-background-color{background-color: var(--wp--preset--color--vivid-cyan-blue) !important;}.has-vivid-purple-background-color{background-color: var(--wp--preset--color--vivid-purple) !important;}.has-black-border-color{border-color: var(--wp--preset--color--black) !important;}.has-cyan-bluish-gray-border-color{border-color: var(--wp--preset--color--cyan-bluish-gray) !important;}.has-white-border-color{border-color: var(--wp--preset--color--white) !important;}.has-pale-pink-border-color{border-color: var(--wp--preset--color--pale-pink) !important;}.has-vivid-red-border-color{border-color: var(--wp--preset--color--vivid-red) !important;}.has-luminous-vivid-orange-border-color{border-color: var(--wp--preset--color--luminous-vivid-orange) !important;}.has-luminous-vivid-amber-border-color{border-color: var(--wp--preset--color--luminous-vivid-amber) !important;}.has-light-green-cyan-border-color{border-color: var(--wp--preset--color--light-green-cyan) !important;}.has-vivid-green-cyan-border-color{border-color: var(--wp--preset--color--vivid-green-cyan) !important;}.has-pale-cyan-blue-border-color{border-color: var(--wp--preset--color--pale-cyan-blue) !important;}.has-vivid-cyan-blue-border-color{border-color: var(--wp--preset--color--vivid-cyan-blue) !important;}.has-vivid-purple-border-color{border-color: var(--wp--preset--color--vivid-purple) !important;}.has-vivid-cyan-blue-to-vivid-purple-gradient-background{background: var(--wp--preset--gradient--vivid-cyan-blue-to-vivid-purple) !important;}.has-light-green-cyan-to-vivid-green-cyan-gradient-background{background: var(--wp--preset--gradient--light-green-cyan-to-vivid-green-cyan) !important;}.has-luminous-vivid-amber-to-luminous-vivid-orange-gradient-background{background: var(--wp--preset--gradient--luminous-vivid-amber-to-luminous-vivid-orange) !important;}.has-luminous-vivid-orange-to-vivid-red-gradient-background{background: var(--wp--preset--gradient--luminous-vivid-orange-to-vivid-red) !important;}.has-very-light-gray-to-cyan-bluish-gray-gradient-background{background: var(--wp--preset--gradient--very-light-gray-to-cyan-bluish-gray) !important;}.has-cool-to-warm-spectrum-gradient-background{background: var(--wp--preset--gradient--cool-to-warm-spectrum) !important;}.has-blush-light-purple-gradient-background{background: var(--wp--preset--gradient--blush-light-purple) !important;}.has-blush-bordeaux-gradient-background{background: var(--wp--preset--gradient--blush-bordeaux) !important;}.has-luminous-dusk-gradient-background{background: var(--wp--preset--gradient--luminous-dusk) !important;}.has-pale-ocean-gradient-background{background: var(--wp--preset--gradient--pale-ocean) !important;}.has-electric-grass-gradient-background{background: var(--wp--preset--gradient--electric-grass) !important;}.has-midnight-gradient-background{background: var(--wp--preset--gradient--midnight) !important;}.has-small-font-size{font-size: var(--wp--preset--font-size--small) !important;}.has-medium-font-size{font-size: var(--wp--preset--font-size--medium) !important;}.has-large-font-size{font-size: var(--wp--preset--font-size--large) !important;}.has-x-large-font-size{font-size: var(--wp--preset--font-size--x-large) !important;}
/*# sourceURL=global-styles-inline-css */
</style>
<link rel='stylesheet' id='magic_login_shortcode-css' href='https://growthenergy.org/wp-content/plugins/magic-login-pro/dist/css/shortcode-style.css?ver=2.6.2' media='all' />
<link rel='stylesheet' id='dashicons-css' href='https://growthenergy.org/wp-includes/css/dashicons.min.css?ver=4b85fce668565ad624a6052afd1721d9' media='all' />
</head>

	<body class="wp-singular post-template-default single single-post postid-19382 single-format-standard wp-theme-wsk-theme is-minimal-ui">
		<div class="site">

			
<header id="masthead" class="site-header" role="banner">
	
<nav class="navbar navbar-expand-xl navbar-light navbar-dark navbar-transparent">

	<div class="container-fluid">

		<a href="https://growthenergy.org" class="navbar-brand" title="Growth Energy"><svg xmlns="http://www.w3.org/2000/svg" width="383" height="82" viewBox="0 0 387.26 82.356">
  <g id="logo-growth-energy" transform="translate(-30.14 -30.77)">
    <g id="logo_brand-mark" transform="translate(30.14 30.777)">
      <path id="Path_47" data-name="Path 47" d="M30.14,80.541c0,17,8.4,30.952,19.143,32.588a29.827,29.827,0,0,1-7-8.021c-4.116-6.74-6.379-15.463-6.379-24.56,0-14.222,11.68-35.389,18.011-45.815-1.547-2.481-2.528-3.953-2.528-3.953S30.14,62.455,30.14,80.548Z" transform="translate(-30.14 -30.78)" fill="#1be0e0"/>
      <path id="Path_48" data-name="Path 48" d="M48.08,80.541c0,17,8.4,30.952,19.143,32.588a29.828,29.828,0,0,1-7-8.021c-4.116-6.74-6.379-15.463-6.379-24.56,0-14.222,11.68-35.389,18.011-45.815-1.547-2.481-2.528-3.953-2.528-3.953S48.08,62.455,48.08,80.548Z" transform="translate(-35.854 -30.78)" fill="#13919b"/>
      <path id="Path_49" data-name="Path 49" d="M66.02,80.541c0,17,8.4,30.952,19.143,32.588a29.828,29.828,0,0,1-7-8.021c-4.116-6.74-6.379-15.463-6.379-24.56,0-14.222,11.68-35.389,18.011-45.815-1.547-2.481-2.528-3.953-2.528-3.953S66.02,62.455,66.02,80.548Z" transform="translate(-41.569 -30.78)" fill="#0c8e4d"/>
      <path id="Path_50" data-name="Path 50" d="M126.447,80.538c0-18.093-21.248-49.768-21.248-49.768S83.95,62.445,83.95,80.538c0,16.989,8.389,30.912,19.129,32.554-.1-3.516-.15-7.312-.15-11.292,0-17.63,2.269-48.494,2.269-48.494s2.269,30.864,2.269,48.494c0,3.98-.055,7.782-.15,11.292C118.051,111.443,126.447,97.52,126.447,80.538Z" transform="translate(-47.28 -30.777)" fill="#08bc15"/>
    </g>
    <g id="logo_word-mark">
      <path id="Path_51" data-name="Path 51" d="M180.66,125.142v3.121h5.152v1.022H180.66v3.305h5.724v1.022H179.57V124.12h6.815v1.022Z" transform="translate(-47.598 -29.735)" fill="none"/>
      <path id="Path_52" data-name="Path 52" d="M196.623,134.712l-2.14-2.849-2.153,2.849h-1.22l2.767-3.646-2.651-3.5h1.22l2.044,2.692,2.031-2.692h1.213l-2.637,3.5,2.753,3.646h-1.22Z" transform="translate(-51.273 -30.834)" fill="none"/>
      <path id="Path_53" data-name="Path 53" d="M210.014,131.061c0,2.2-1.411,3.748-3.292,3.748a2.9,2.9,0,0,1-2.6-1.506v3.721H203.09V127.5h1.036v1.342a2.9,2.9,0,0,1,2.6-1.506c1.881,0,3.292,1.547,3.292,3.734Zm-1.09,0a2.43,2.43,0,1,0-2.392,2.821C207.942,133.882,208.923,132.71,208.923,131.061Z" transform="translate(-55.089 -30.76)" fill="none"/>
      <path id="Path_54" data-name="Path 54" d="M221.29,130.288v4.355h-1.036v-1.118a2.985,2.985,0,0,1-2.515,1.288,2.334,2.334,0,0,1-2.61-2.283,2.566,2.566,0,0,1,2.808-2.378,7.707,7.707,0,0,1,2.324.4v-.266a1.824,1.824,0,0,0-1.935-2.072,4.84,4.84,0,0,0-2.085.647l-.416-.845a5.773,5.773,0,0,1,2.569-.688,2.686,2.686,0,0,1,2.9,2.958Zm-1.036,2.113v-1.09a8.223,8.223,0,0,0-2.153-.293c-1.063,0-1.963.607-1.963,1.465s.777,1.411,1.785,1.411a2.352,2.352,0,0,0,2.337-1.492Z" transform="translate(-58.924 -30.757)" fill="none"/>
      <path id="Path_55" data-name="Path 55" d="M233.132,130.084v4.545H232.1V130.22a1.806,1.806,0,0,0-1.785-1.976,2.084,2.084,0,0,0-2.215,1.84v4.545H227.06V127.48H228.1v1.145a2.707,2.707,0,0,1,2.351-1.315,2.611,2.611,0,0,1,2.678,2.767Z" transform="translate(-62.725 -30.751)" fill="none"/>
      <path id="Path_56" data-name="Path 56" d="M245.3,123.877v9.663h-1.036V132.2a2.9,2.9,0,0,1-2.6,1.506c-1.881,0-3.292-1.547-3.292-3.748s1.411-3.734,3.292-3.734a2.9,2.9,0,0,1,2.6,1.506V123.87H245.3Zm-1.036,6.079a2.524,2.524,0,0,0-2.406-2.808c-1.411,0-2.392,1.159-2.392,2.808a2.43,2.43,0,1,0,4.8,0Z" transform="translate(-66.33 -29.655)" fill="none"/>
      <path id="Path_57" data-name="Path 57" d="M251.28,124.335a.688.688,0,0,1,.688-.675.681.681,0,0,1,.675.675.682.682,0,1,1-1.363,0Zm.164,1.99h1.036v7.149h-1.036Z" transform="translate(-70.439 -29.588)" fill="none"/>
      <path id="Path_58" data-name="Path 58" d="M261.962,130.084v4.545h-1.036V130.22a1.806,1.806,0,0,0-1.785-1.976,2.084,2.084,0,0,0-2.215,1.84v4.545H255.89V127.48h1.036v1.145a2.707,2.707,0,0,1,2.351-1.315,2.611,2.611,0,0,1,2.678,2.767Z" transform="translate(-71.908 -30.751)" fill="none"/>
      <path id="Path_59" data-name="Path 59" d="M274.094,127.49v6.385a3.2,3.2,0,0,1-3.51,3.135,4.612,4.612,0,0,1-2.889-.954l.457-.818a3.393,3.393,0,0,0,2.3.845c1.642,0,2.61-.818,2.61-2.215V132.71a2.973,2.973,0,0,1-2.6,1.4,3.4,3.4,0,0,1,0-6.787,2.973,2.973,0,0,1,2.6,1.4V127.49h1.036Zm-1.036,3.217a2.4,2.4,0,1,0-2.406,2.474A2.337,2.337,0,0,0,273.058,130.707Z" transform="translate(-75.501 -30.754)" fill="none"/>
      <path id="Path_60" data-name="Path 60" d="M292.511,131.459h-5.3l-.954,2.153H285.09l4.191-9.493h1.172l4.191,9.493h-1.172l-.954-2.153Zm-.443-1.022-2.194-4.988-2.215,4.988Z" transform="translate(-81.209 -29.735)" fill="none"/>
      <path id="Path_61" data-name="Path 61" d="M311.343,130.087v4.545h-1.036v-4.409a1.754,1.754,0,0,0-1.642-1.976,1.816,1.816,0,0,0-1.935,1.84v4.545h-1.036v-4.409a1.754,1.754,0,0,0-1.642-1.976,1.816,1.816,0,0,0-1.935,1.84v4.545H301.08v-7.149h1.036v1.049a2.218,2.218,0,0,1,2.072-1.213,2.427,2.427,0,0,1,2.31,1.52,2.332,2.332,0,0,1,2.31-1.52,2.552,2.552,0,0,1,2.542,2.767Z" transform="translate(-86.302 -30.754)" fill="none"/>
      <path id="Path_62" data-name="Path 62" d="M324.281,133.014l.634.675a4.28,4.28,0,0,1-2.876,1.1,3.671,3.671,0,0,1-3.619-3.762,3.551,3.551,0,0,1,3.523-3.721c2.153,0,3.387,1.629,3.387,4.13h-5.847a2.535,2.535,0,0,0,2.542,2.419,3.362,3.362,0,0,0,2.256-.859Zm-4.784-2.487h4.811a2.284,2.284,0,0,0-2.324-2.283A2.5,2.5,0,0,0,319.5,130.527Z" transform="translate(-91.825 -30.751)" fill="none"/>
      <path id="Path_63" data-name="Path 63" d="M334.773,127.33v.927a2.5,2.5,0,0,0-2.767,2.392v3.993H330.97v-7.149h1.036v1.4A2.882,2.882,0,0,1,334.773,127.33Z" transform="translate(-95.823 -30.757)" fill="none"/>
      <path id="Path_64" data-name="Path 64" d="M338.17,124.335a.688.688,0,0,1,.688-.675.681.681,0,0,1,.675.675.682.682,0,1,1-1.363,0Zm.164,1.99h1.036v7.149h-1.036Z" transform="translate(-98.116 -29.588)" fill="none"/>
      <path id="Path_65" data-name="Path 65" d="M342.2,131.054a3.766,3.766,0,0,1,3.707-3.734,3.682,3.682,0,0,1,2.542,1.049l-.716.7a2.486,2.486,0,0,0-1.826-.831,2.822,2.822,0,0,0,0,5.629,2.526,2.526,0,0,0,1.867-.872l.716.7a3.651,3.651,0,0,1-2.583,1.09,3.778,3.778,0,0,1-3.707-3.748Z" transform="translate(-99.4 -30.754)" fill="none"/>
      <path id="Path_66" data-name="Path 66" d="M359.171,130.288v4.355h-1.036v-1.118a2.985,2.985,0,0,1-2.515,1.288,2.334,2.334,0,0,1-2.61-2.283,2.566,2.566,0,0,1,2.808-2.378,7.707,7.707,0,0,1,2.324.4v-.266a1.824,1.824,0,0,0-1.935-2.072,4.84,4.84,0,0,0-2.085.647l-.416-.845a5.773,5.773,0,0,1,2.569-.688,2.686,2.686,0,0,1,2.9,2.958Zm-1.036,2.113v-1.09a8.223,8.223,0,0,0-2.153-.293c-1.063,0-1.963.607-1.963,1.465s.777,1.411,1.785,1.411a2.352,2.352,0,0,0,2.337-1.492Z" transform="translate(-102.843 -30.757)" fill="none"/>
      <path id="Path_67" data-name="Path 67" d="M364.974,127.137a3.145,3.145,0,0,0,.716-1.288.759.759,0,0,1-.75-.763.748.748,0,0,1,.763-.736c.525,0,.845.47.845,1.1,0,.552-.232,1.022-1.063,2.058l-.511-.388Z" transform="translate(-106.643 -29.808)" fill="none"/>
      <path id="Path_68" data-name="Path 68" d="M369.43,133.743l.538-.763a4.15,4.15,0,0,0,2.419.9c.94,0,1.574-.443,1.574-1.118,0-.777-.831-1.022-1.8-1.3-1.731-.5-2.392-1.009-2.392-2.031a2.212,2.212,0,0,1,2.5-2.1,4.756,4.756,0,0,1,2.556.8l-.5.8a3.884,3.884,0,0,0-2.058-.675c-.8,0-1.465.361-1.465,1.049,0,.62.525.818,1.854,1.247,1.145.361,2.337.75,2.337,2.1s-1.131,2.153-2.61,2.153a4.873,4.873,0,0,1-2.958-1.063Z" transform="translate(-108.073 -30.757)" fill="none"/>
      <path id="Path_69" data-name="Path 69" d="M385.91,124.12h4.355a2.4,2.4,0,0,1,2.61,2.365,2.253,2.253,0,0,1-1.356,2.085,2.772,2.772,0,0,1,1.731,2.446,2.61,2.61,0,0,1-2.821,2.6H385.91Zm4.075,4.021a1.541,1.541,0,1,0,0-3.039h-3v3.039Zm.17,4.491a1.773,1.773,0,1,0,0-3.516h-3.162v3.51h3.162Z" transform="translate(-113.323 -29.735)" fill="none"/>
      <path id="Path_70" data-name="Path 70" d="M398.88,124.335a.688.688,0,0,1,.688-.675.681.681,0,0,1,.675.675.682.682,0,1,1-1.363,0Zm.17,1.99h1.036v7.149H399.05Z" transform="translate(-117.454 -29.588)" fill="none"/>
      <path id="Path_71" data-name="Path 71" d="M402.92,131.054a3.7,3.7,0,1,1,3.707,3.748A3.766,3.766,0,0,1,402.92,131.054Zm6.3,0a2.612,2.612,0,1,0-2.6,2.821A2.744,2.744,0,0,0,409.224,131.054Z" transform="translate(-118.741 -30.754)" fill="none"/>
      <path id="Path_72" data-name="Path 72" d="M421.351,133.014l.634.675a4.28,4.28,0,0,1-2.876,1.1,3.671,3.671,0,0,1-3.619-3.762,3.551,3.551,0,0,1,3.523-3.721c2.153,0,3.387,1.629,3.387,4.13h-5.847a2.535,2.535,0,0,0,2.542,2.419,3.362,3.362,0,0,0,2.256-.859Zm-4.784-2.487h4.811a2.284,2.284,0,0,0-2.324-2.283A2.5,2.5,0,0,0,416.567,130.527Z" transform="translate(-122.745 -30.751)" fill="none"/>
      <path id="Path_73" data-name="Path 73" d="M427.33,131.054a3.766,3.766,0,0,1,3.707-3.734,3.682,3.682,0,0,1,2.542,1.049l-.716.7a2.486,2.486,0,0,0-1.826-.831,2.822,2.822,0,0,0,0,5.629A2.527,2.527,0,0,0,432.9,133l.716.7a3.651,3.651,0,0,1-2.583,1.09,3.778,3.778,0,0,1-3.707-3.748Z" transform="translate(-126.516 -30.754)" fill="none"/>
      <path id="Path_74" data-name="Path 74" d="M437.87,131.054a3.7,3.7,0,1,1,3.707,3.748A3.766,3.766,0,0,1,437.87,131.054Zm6.3,0a2.612,2.612,0,1,0-2.6,2.821A2.744,2.744,0,0,0,444.174,131.054Z" transform="translate(-129.873 -30.754)" fill="none"/>
      <path id="Path_75" data-name="Path 75" d="M457.092,130.084v4.545h-1.036V130.22a1.806,1.806,0,0,0-1.785-1.976,2.084,2.084,0,0,0-2.215,1.84v4.545H451.02V127.48h1.036v1.145a2.707,2.707,0,0,1,2.351-1.315,2.611,2.611,0,0,1,2.678,2.767Z" transform="translate(-134.062 -30.751)" fill="none"/>
      <path id="Path_76" data-name="Path 76" d="M462.22,131.054a3.7,3.7,0,1,1,3.707,3.748A3.766,3.766,0,0,1,462.22,131.054Zm6.3,0a2.612,2.612,0,1,0-2.6,2.821A2.744,2.744,0,0,0,468.517,131.054Z" transform="translate(-137.63 -30.754)" fill="none"/>
      <path id="Path_77" data-name="Path 77" d="M485.623,130.087v4.545h-1.036v-4.409a1.754,1.754,0,0,0-1.642-1.976,1.816,1.816,0,0,0-1.935,1.84v4.545h-1.036v-4.409a1.754,1.754,0,0,0-1.642-1.976,1.816,1.816,0,0,0-1.935,1.84v4.545H475.36v-7.149H476.4v1.049a2.218,2.218,0,0,1,2.072-1.213,2.427,2.427,0,0,1,2.31,1.52,2.332,2.332,0,0,1,2.31-1.52,2.552,2.552,0,0,1,2.542,2.767Z" transform="translate(-141.815 -30.754)" fill="none"/>
      <path id="Path_78" data-name="Path 78" d="M492.906,136.964l.245-.886a1.917,1.917,0,0,0,.845.177,1.059,1.059,0,0,0,1.036-.634l.416-.886-3.108-7.176h1.145l2.5,5.942,2.365-5.942h1.118l-3.264,7.946a2.236,2.236,0,0,1-2.167,1.683,2.726,2.726,0,0,1-1.131-.232Z" transform="translate(-147.224 -30.83)" fill="none"/>
      <path id="Path_79" data-name="Path 79" d="M190.751,78.415h11.442v11.04a16.08,16.08,0,0,1-10.876,4.355,14.325,14.325,0,1,1,0-28.649,15.859,15.859,0,0,1,10.876,4.355l-2.862,2.74a11.507,11.507,0,0,0-8.021-3.346,10.582,10.582,0,0,0,0,21.153,11.749,11.749,0,0,0,6.849-2.3v-5.8h-7.414V78.421Z" transform="translate(-46.744 -10.954)" fill="none"/>
      <path id="Path_80" data-name="Path 80" d="M232.541,75.207v3.462c-4.314,0-7.374,2.378-7.735,6V96.516H220.82V75.684h3.987V79.67a8.241,8.241,0,0,1,7.735-4.47Z" transform="translate(-60.737 -14.152)" fill="none"/>
      <path id="Path_81" data-name="Path 81" d="M239.38,86.086a10.958,10.958,0,1,1,11,10.917A11.066,11.066,0,0,1,239.38,86.086Zm17.923,0c0-4.027-3.183-7.414-6.931-7.414a7.448,7.448,0,0,0,0,14.87A7.237,7.237,0,0,0,257.3,86.086Z" transform="translate(-66.649 -14.155)" fill="none"/>
      <path id="Path_82" data-name="Path 82" d="M272.84,75.92h4.068l4.8,15.51,5.159-15.51h3.387l5.159,15.51,4.757-15.51h4.068l-7.012,20.833h-3.666l-5-15.469-5.036,15.469h-3.666L272.847,75.92Z" transform="translate(-77.307 -14.382)" fill="none"/>
      <path id="Path_83" data-name="Path 83" d="M332.839,93.062a6.707,6.707,0,0,1-4.15,1.492,5.344,5.344,0,0,1-5.479-5.683V67.52h3.9v5.724h4.913v3.387h-4.913V88.6a2.3,2.3,0,0,0,2.133,2.5,3.1,3.1,0,0,0,2.133-.763l1.452,2.74Z" transform="translate(-93.351 -11.706)" fill="none"/>
      <path id="Path_84" data-name="Path 84" d="M359.947,80.816V94.07h-3.9V81.5c0-3.1-1.976-5.275-4.8-5.275-3.142,0-5.758,2.215-5.758,4.913V94.07H341.54V67.52h3.946v8.825a7.771,7.771,0,0,1,6.644-3.585c4.593,0,7.816,3.346,7.816,8.055Z" transform="translate(-99.19 -11.706)" fill="none"/>
      <path id="Path_85" data-name="Path 85" d="M395.659,69.652v7.9H411.9v3.789H395.659v8.423H411.9v3.789H391.55V65.87H411.9v3.789H395.659Z" transform="translate(-115.119 -11.18)" fill="none"/>
      <path id="Path_86" data-name="Path 86" d="M446.433,83.265V96.52h-3.9V83.946c0-3.1-1.976-5.275-4.8-5.275s-5.4,1.895-5.724,4.355v13.5H428.02V75.694h3.987v3.019a7.767,7.767,0,0,1,6.61-3.5C443.21,75.21,446.433,78.556,446.433,83.265Z" transform="translate(-126.736 -14.155)" fill="none"/>
      <path id="Path_87" data-name="Path 87" d="M476.642,91.2l2.5,2.576C477.289,95.756,473.664,97,470.72,97A10.7,10.7,0,0,1,460,86.045c0-6.406,4.634-10.835,10.392-10.835,6.365,0,10.031,4.832,10.031,12.287h-16.4a6.617,6.617,0,0,0,6.644,5.963,9.108,9.108,0,0,0,5.963-2.256Zm-12.566-6.89h12.491c-.443-3.223-2.419-5.561-6-5.561A6.524,6.524,0,0,0,464.075,84.314Z" transform="translate(-136.922 -14.155)" fill="none"/>
      <path id="Path_88" data-name="Path 88" d="M506.431,75.737V79.2c-4.314,0-7.374,2.378-7.735,6V97.046H494.71V76.214H498.7V80.2a8.241,8.241,0,0,1,7.735-4.47Z" transform="translate(-147.979 -14.321)" fill="none"/>
      <path id="Path_89" data-name="Path 89" d="M534.516,76.58V95.191c0,5.356-4.389,9.145-10.556,9.145a14.183,14.183,0,0,1-8.7-2.78l1.574-2.978a9.742,9.742,0,0,0,6.529,2.3c4.47,0,7.169-2.133,7.169-5.758V92.1a8.71,8.71,0,0,1-7.374,3.789c-5.479,0-9.466-4.109-9.466-9.909s3.987-9.868,9.466-9.868a8.747,8.747,0,0,1,7.374,3.83V76.594h3.987Zm-3.987,9.391a6.345,6.345,0,1,0-6.365,6.447A6.145,6.145,0,0,0,530.529,85.971Z" transform="translate(-154.024 -14.442)" fill="none"/>
      <path id="Path_90" data-name="Path 90" d="M550.058,104l.886-3.06a5.392,5.392,0,0,0,2.535.647,2.922,2.922,0,0,0,2.862-1.608l1.049-2.215L548.45,76.82h4.273l6.685,16.437,6.324-16.437h4.15L560.7,99.54c-1.492,3.748-3.707,5.315-6.685,5.356a8.848,8.848,0,0,1-3.946-.886Z" transform="translate(-165.096 -14.668)" fill="none"/>
      <path id="Path_91" data-name="Path 91" d="M591.578,72.118l1.431,2.038h-.947l-1.37-1.956H589.4v1.956h-.825V68.54h2.365a1.914,1.914,0,0,1,2.085,1.833,1.807,1.807,0,0,1-1.438,1.751Zm-2.181-.681h1.424c.811,0,1.356-.4,1.356-1.063s-.545-1.063-1.356-1.063H589.4v2.126Z" transform="translate(-177.879 -12.031)" fill="none"/>
      <path id="Path_92" data-name="Path 92" d="M589.233,75.336a4.743,4.743,0,1,1,4.743-4.743A4.746,4.746,0,0,1,589.233,75.336Zm0-8.8a4.062,4.062,0,1,0,4.062,4.062A4.063,4.063,0,0,0,589.233,66.531Z" transform="translate(-176.576 -11.174)" fill="none"/>
    </g>
  </g>
</svg></a>
		<span class="mobile-search-overlay-toggle">
			<button data-wsk-toggle="overlay" data-wsk-target="#search-overlay" class="btn btn-icon-only navbar-flag" type="button"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" class="icon">
<path d="M22 22L15.3334 15.3333M17.5556 9.77778C17.5556 14.0733 14.0733 17.5556 9.77778 17.5556C5.48223 17.5556 2 14.0733 2 9.77778C2 5.48223 5.48223 2 9.77778 2C14.0733 2 17.5556 5.48223 17.5556 9.77778Z" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
</svg></button>		</span>

		<button class="navbar-toggler" aria-controls="navbar-menu-overlay" aria-expanded="false" aria-label="Toggle navigation" data-wsk-toggle="overlay" data-wsk-target="#navbar-menu-overlay" type="button"><span class="navbar-toggler__icon"></span></button>
		<div id="navbarSupportedContent" class="collapse navbar-collapse">
			<div class="navbar-top">
				<ul id="menu-navbar-sub-menu" class="navbar-sub-nav list-inline"><li id="menu-item-16605" class="menu-item menu-item-type-taxonomy menu-item-object-category current-post-ancestor menu-item-16605"><a href="https://growthenergy.org/category/news/" class="link-muted">News</a></li>
<li id="menu-item-17252" class="menu-item menu-item-type-custom menu-item-object-custom menu-item-17252"><a href="https://growthenergy.org/E15Now" class="link-muted">Take Action</a></li>
<li id="menu-item-18310" class="menu-item menu-item-type-custom menu-item-object-custom menu-item-18310"><a href="/our-network/events/" class="link-muted">Events</a></li>
<li id="menu-item-16606" class="menu-item menu-item-type-taxonomy menu-item-object-category menu-item-16606"><a href="https://growthenergy.org/category/research-fact-sheets/" class="link-muted">Fact Sheets</a></li>
<li id="menu-item-16608" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-16608"><a href="https://growthenergy.org/about-us/contact/" class="link-muted">Contact</a></li>
</ul>
				<button data-bs-toggle="modal" data-bs-target="#login-registration-modal" class="btn btn-outline navbar-flag" type="button">Member Login<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" class="btn__icon btn__icon-right">
<path d="M5.3163 19.4384C5.92462 18.0052 7.34492 17 9 17H15C16.6551 17 18.0754 18.0052 18.6837 19.4384M16 9.5C16 11.7091 14.2091 13.5 12 13.5C9.79086 13.5 8 11.7091 8 9.5C8 7.29086 9.79086 5.5 12 5.5C14.2091 5.5 16 7.29086 16 9.5ZM22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="white" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</svg></button>
				<button data-bs-toggle="offcanvas" data-bs-target="#bookmarksOffcanvas" aria-controls="bookmarksOffcanvas" class="btn btn-icon-only navbar-flag" type="button"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" class="icon">
<path d="M4 7.33333C4 5.46649 4 4.53307 4.37369 3.82003C4.7024 3.19282 5.22691 2.68289 5.87203 2.36331C6.60544 2 7.56553 2 9.48571 2H14.5143C16.4345 2 17.3946 2 18.128 2.36331C18.7731 2.68289 19.2976 3.19282 19.6263 3.82003C20 4.53307 20 5.46649 20 7.33333V22L12 17.5556L4 22V7.33333Z" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
</svg></button>
				<button data-wsk-toggle="overlay" data-wsk-target="#search-overlay" class="btn btn-icon-only navbar-flag" type="button"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" class="icon">
<path d="M22 22L15.3334 15.3333M17.5556 9.77778C17.5556 14.0733 14.0733 17.5556 9.77778 17.5556C5.48223 17.5556 2 14.0733 2 9.77778C2 5.48223 5.48223 2 9.77778 2C14.0733 2 17.5556 5.48223 17.5556 9.77778Z" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
</svg></button>			</div>

			<ul id="menu-navbar-menu" class="navbar-nav"><li  id="menu-item-16113" class="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children dropdown nav-item nav-item-16113"><a href="#" class="nav-link  dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" data-bs-auto-close="outside" aria-expanded="false"><span class="dropdown-toggle__icon"></span>Value of Biofuels<svg xmlns="http://www.w3.org/2000/svg" width="14" height="8" viewBox="0 0 14 8" fill="none" class="dropdown-chevron__icon">
<path d="M1 1L7 7L13 1" stroke="#13919B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg></a>
<ul class="dropdown-menu dropdown-menu-end dropdown-menu-xxxl-start  depth_0">
	<li  id="menu-item-16114" class="menu-item menu-item-type-post_type menu-item-object-page nav-item nav-item-16114"><a href="https://growthenergy.org/value-of-biofuels/" class="dropdown-item ">Overview</a></li>
	<li  id="menu-item-16116" class="menu-item menu-item-type-post_type menu-item-object-page nav-item nav-item-16116"><a href="https://growthenergy.org/value-of-biofuels/value-at-the-pump/" class="dropdown-item ">Value at the Pump</a></li>
	<li  id="menu-item-16115" class="menu-item menu-item-type-post_type menu-item-object-page nav-item nav-item-16115"><a href="https://growthenergy.org/value-of-biofuels/value-for-the-rural-community/" class="dropdown-item ">Value for the Rural Community</a></li>
	<li  id="menu-item-16124" class="menu-item menu-item-type-post_type menu-item-object-page nav-item nav-item-16124"><a href="https://growthenergy.org/value-of-biofuels/value-for-the-environment/" class="dropdown-item ">Value for the Environment</a></li>
</ul>
</li>
<li  id="menu-item-16110" class="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children dropdown nav-item nav-item-16110"><a href="#" class="nav-link  dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" data-bs-auto-close="outside" aria-expanded="false"><span class="dropdown-toggle__icon"></span>Policy Priorities<svg xmlns="http://www.w3.org/2000/svg" width="14" height="8" viewBox="0 0 14 8" fill="none" class="dropdown-chevron__icon">
<path d="M1 1L7 7L13 1" stroke="#13919B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg></a>
<ul class="dropdown-menu dropdown-menu-end dropdown-menu-xxxl-start  depth_0">
	<li  id="menu-item-16097" class="menu-item menu-item-type-post_type menu-item-object-page nav-item nav-item-16097"><a href="https://growthenergy.org/policy-priorities/" class="dropdown-item ">Overview</a></li>
	<li  id="menu-item-18897" class="menu-item menu-item-type-post_type menu-item-object-page nav-item nav-item-18897"><a href="https://growthenergy.org/2025-roadmap-energy-dominance/" class="dropdown-item ">2025 Policy Roadmap</a></li>
	<li  id="menu-item-16101" class="menu-item menu-item-type-post_type menu-item-object-policy-priority nav-item nav-item-16101"><a href="https://growthenergy.org/policy-priority/e15-and-higher-ethanol-blends/" class="dropdown-item ">Lower-Cost, Lower-Emissions Bioethanol</a></li>
	<li  id="menu-item-16107" class="menu-item menu-item-type-post_type menu-item-object-policy-priority nav-item nav-item-16107"><a href="https://growthenergy.org/policy-priority/the-renewable-fuel-standard/" class="dropdown-item ">The Renewable Fuel Standard</a></li>
	<li  id="menu-item-16128" class="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children dropdown nav-item nav-item-16128 dropdown-menu-child-item dropdown-menu-end at_depth_1"><a href="#" class="dropdown-item  dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" data-bs-auto-close="outside" aria-expanded="false"><span class="dropdown-toggle__icon"></span>Tax Incentives and Technology<svg xmlns="http://www.w3.org/2000/svg" width="14" height="8" viewBox="0 0 14 8" fill="none" class="dropdown-chevron__icon">
<path d="M1 1L7 7L13 1" stroke="#13919B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg></a>
	<ul class="dropdown-menu dropdown-submenu dropdown-menu-end dropdown-menu-xxxl-start  depth_1">
		<li  id="menu-item-16099" class="menu-item menu-item-type-post_type menu-item-object-policy-priority nav-item nav-item-16099"><a href="https://growthenergy.org/policy-priority/clean-fuel-tax-incentives/" class="dropdown-item ">Clean Fuel Tax Incentives</a></li>
		<li  id="menu-item-16106" class="menu-item menu-item-type-post_type menu-item-object-policy-priority nav-item nav-item-16106"><a href="https://growthenergy.org/policy-priority/aviation-maritime-fuel/" class="dropdown-item ">Aviation and Maritime Fuel</a></li>
		<li  id="menu-item-16098" class="menu-item menu-item-type-post_type menu-item-object-policy-priority nav-item nav-item-16098"><a href="https://growthenergy.org/policy-priority/carbon-capture-technology/" class="dropdown-item ">Carbon Capture Technology</a></li>
		<li  id="menu-item-16100" class="menu-item menu-item-type-post_type menu-item-object-policy-priority nav-item nav-item-16100"><a href="https://growthenergy.org/policy-priority/climate-smart-agriculture/" class="dropdown-item ">Carbon-Reducing Farm Practices</a></li>
	</ul>
</li>
	<li  id="menu-item-16129" class="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children dropdown nav-item nav-item-16129 dropdown-menu-child-item dropdown-menu-end at_depth_1"><a href="#" class="dropdown-item  dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" data-bs-auto-close="outside" aria-expanded="false"><span class="dropdown-toggle__icon"></span>Standards<svg xmlns="http://www.w3.org/2000/svg" width="14" height="8" viewBox="0 0 14 8" fill="none" class="dropdown-chevron__icon">
<path d="M1 1L7 7L13 1" stroke="#13919B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg></a>
	<ul class="dropdown-menu dropdown-submenu dropdown-menu-end dropdown-menu-xxxl-start  depth_1">
		<li  id="menu-item-16109" class="menu-item menu-item-type-post_type menu-item-object-policy-priority nav-item nav-item-16109"><a href="https://growthenergy.org/policy-priority/vehicle-emissions-standards/" class="dropdown-item ">Vehicle Emissions Standards</a></li>
		<li  id="menu-item-16104" class="menu-item menu-item-type-post_type menu-item-object-policy-priority nav-item nav-item-16104"><a href="https://growthenergy.org/policy-priority/low-carbon-fuel-standards/" class="dropdown-item ">Low Carbon Fuel Standards</a></li>
	</ul>
</li>
	<li  id="menu-item-16130" class="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children dropdown nav-item nav-item-16130 dropdown-menu-child-item dropdown-menu-end at_depth_1"><a href="#" class="dropdown-item  dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" data-bs-auto-close="outside" aria-expanded="false"><span class="dropdown-toggle__icon"></span>Trade &#038; Transport<svg xmlns="http://www.w3.org/2000/svg" width="14" height="8" viewBox="0 0 14 8" fill="none" class="dropdown-chevron__icon">
<path d="M1 1L7 7L13 1" stroke="#13919B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg></a>
	<ul class="dropdown-menu dropdown-submenu dropdown-menu-end dropdown-menu-xxxl-start  depth_1">
		<li  id="menu-item-16103" class="menu-item menu-item-type-post_type menu-item-object-policy-priority nav-item nav-item-16103"><a href="https://growthenergy.org/policy-priority/global-marketplace/" class="dropdown-item ">Global Marketplace</a></li>
		<li  id="menu-item-16108" class="menu-item menu-item-type-post_type menu-item-object-policy-priority nav-item nav-item-16108"><a href="https://growthenergy.org/policy-priority/transport-and-logistics/" class="dropdown-item ">Transport and Logistics</a></li>
	</ul>
</li>
</ul>
</li>
<li  id="menu-item-16532" class="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children dropdown nav-item nav-item-16532"><a href="#" class="nav-link  dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" data-bs-auto-close="outside" aria-expanded="false"><span class="dropdown-toggle__icon"></span>Resources<svg xmlns="http://www.w3.org/2000/svg" width="14" height="8" viewBox="0 0 14 8" fill="none" class="dropdown-chevron__icon">
<path d="M1 1L7 7L13 1" stroke="#13919B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg></a>
<ul class="dropdown-menu dropdown-menu-end dropdown-menu-xxxl-start  depth_0">
	<li  id="menu-item-16533" class="menu-item menu-item-type-post_type menu-item-object-page nav-item nav-item-16533"><a href="https://growthenergy.org/resources/" class="dropdown-item ">Overview</a></li>
	<li  id="menu-item-16631" class="menu-item menu-item-type-post_type menu-item-object-page nav-item nav-item-16631"><a href="https://growthenergy.org/indices-data-trends/" class="dropdown-item ">Indices, Data &#038; Trends</a></li>
	<li  id="menu-item-18346" class="menu-item menu-item-type-post_type menu-item-object-page nav-item nav-item-18346"><a href="https://growthenergy.org/fuel-finder/" class="dropdown-item ">Fuel Finder</a></li>
	<li  id="menu-item-18573" class="menu-item menu-item-type-post_type menu-item-object-page nav-item nav-item-18573"><a href="https://growthenergy.org/bioeconomy-infrastructure/" class="dropdown-item ">Bioeconomy Infrastructure</a></li>
	<li  id="menu-item-16644" class="menu-item menu-item-type-taxonomy menu-item-object-category current-post-ancestor nav-item nav-item-16644"><a href="https://growthenergy.org/category/news/" class="dropdown-item active">News</a></li>
	<li  id="menu-item-16645" class="menu-item menu-item-type-taxonomy menu-item-object-category nav-item nav-item-16645"><a href="https://growthenergy.org/category/comments-testimony-letters/" class="dropdown-item ">Comments, Testimony &amp; Letters</a></li>
	<li  id="menu-item-16648" class="menu-item menu-item-type-post_type menu-item-object-page nav-item nav-item-16648"><a href="https://growthenergy.org/retailer-supplier-hub/" class="dropdown-item ">Retailer &#038; Supplier Hub</a></li>
	<li  id="menu-item-16646" class="menu-item menu-item-type-taxonomy menu-item-object-category nav-item nav-item-16646"><a href="https://growthenergy.org/category/research-fact-sheets/" class="dropdown-item ">Research &amp; Fact Sheets</a></li>
	<li  id="menu-item-16643" class="menu-item menu-item-type-post_type menu-item-object-page nav-item nav-item-16643"><a href="https://growthenergy.org/value-of-biofuels/value-at-the-pump/biofuel-basics/" class="dropdown-item ">Biofuel Basics</a></li>
</ul>
</li>
<li  id="menu-item-16088" class="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children dropdown nav-item nav-item-16088"><a href="#" class="nav-link  dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" data-bs-auto-close="outside" aria-expanded="false"><span class="dropdown-toggle__icon"></span>About Us<svg xmlns="http://www.w3.org/2000/svg" width="14" height="8" viewBox="0 0 14 8" fill="none" class="dropdown-chevron__icon">
<path d="M1 1L7 7L13 1" stroke="#13919B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg></a>
<ul class="dropdown-menu dropdown-menu-end dropdown-menu-xxxl-start  depth_0">
	<li  id="menu-item-15695" class="menu-item menu-item-type-post_type menu-item-object-page nav-item nav-item-15695"><a href="https://growthenergy.org/about-us/" class="dropdown-item ">Overview</a></li>
	<li  id="menu-item-16095" class="menu-item menu-item-type-post_type menu-item-object-page nav-item nav-item-16095"><a href="https://growthenergy.org/about-us/our-leadership-staff/" class="dropdown-item ">Our Leadership &#038; Staff</a></li>
	<li  id="menu-item-16089" class="menu-item menu-item-type-post_type menu-item-object-page nav-item nav-item-16089"><a href="https://growthenergy.org/about-us/growth-energy-membership-events/" class="dropdown-item ">Membership &#038; Events</a></li>
	<li  id="menu-item-19020" class="menu-item menu-item-type-post_type menu-item-object-annual-report nav-item nav-item-19020"><a href="https://growthenergy.org/annual-report/annual-report-2024/" class="dropdown-item ">Annual Report</a></li>
	<li  id="menu-item-16091" class="menu-item menu-item-type-post_type menu-item-object-page nav-item nav-item-16091"><a href="https://growthenergy.org/about-us/careers/" class="dropdown-item ">Careers</a></li>
	<li  id="menu-item-16092" class="menu-item menu-item-type-post_type menu-item-object-page nav-item nav-item-16092"><a href="https://growthenergy.org/about-us/contact/" class="dropdown-item ">Contact</a></li>
</ul>
</li>
<li  id="menu-item-16112" class="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children dropdown nav-item nav-item-16112"><a href="#" class="nav-link  dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" data-bs-auto-close="outside" aria-expanded="false"><span class="dropdown-toggle__icon"></span>Our Network<svg xmlns="http://www.w3.org/2000/svg" width="14" height="8" viewBox="0 0 14 8" fill="none" class="dropdown-chevron__icon">
<path d="M1 1L7 7L13 1" stroke="#13919B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg></a>
<ul class="dropdown-menu dropdown-menu-end dropdown-menu-xxxl-start  depth_0">
	<li  id="menu-item-15697" class="menu-item menu-item-type-post_type menu-item-object-page nav-item nav-item-15697"><a href="https://growthenergy.org/our-network/" class="dropdown-item ">Overview</a></li>
	<li  id="menu-item-16136" class="menu-item menu-item-type-post_type menu-item-object-page nav-item nav-item-16136"><a href="https://growthenergy.org/our-network/our-members/" class="dropdown-item ">Our Members</a></li>
	<li  id="menu-item-16132" class="menu-item menu-item-type-post_type menu-item-object-page nav-item nav-item-16132"><a href="https://growthenergy.org/our-network/becoming-a-member/" class="dropdown-item ">Becoming a Member</a></li>
	<li  id="menu-item-18345" class="menu-item menu-item-type-custom menu-item-object-custom nav-item nav-item-18345"><a href="https://getbiofuel.com/" class="dropdown-item ">Get Biofuel</a></li>
	<li  id="menu-item-16133" class="menu-item menu-item-type-post_type menu-item-object-page nav-item nav-item-16133"><a href="https://growthenergy.org/our-network/events/" class="dropdown-item ">Events</a></li>
	<li  id="menu-item-16134" class="menu-item menu-item-type-post_type menu-item-object-page nav-item nav-item-16134"><a href="https://growthenergy.org/our-network/growth-energy-pac/" class="dropdown-item ">Growth Energy PAC</a></li>
	<li  id="menu-item-16531" class="menu-item menu-item-type-post_type menu-item-object-page nav-item nav-item-16531"><a href="https://growthenergy.org/our-network/member-portal/" class="dropdown-item ">Member Portal</a></li>
</ul>
</li>
</ul>		</div>

	</div>

</nav>
</header>

	<main id="main" class="site-main" role="main">

		
			
			
<section class="layout layout--post-header colour-scheme colour-scheme--dark layout--padding-y">

	
	<div class="container-fluid">
		<div class="layout__content">

			<header class="layout__header">
				<div class="breadcrumbs"><span><span class="breadcrumb_last" aria-current="page">Meet the 2025 Outstanding Congressional Staff Award Winners</span></span></div>			</header>

			<div class="row justify-content-between">

				<div class="col-lg-3 mb-6 mb-lg-0 order-2 order-lg-1">
					<div class="sidebar h-100 d-flex flex-column">

						<div class="sidebar__header mb-5 d-none d-lg-block"><div class="sidebar__group"><a data-wsk-toggle="previous-page" class="btn btn-blank btn-back" href="https://growthenergy.org"><svg xmlns="http://www.w3.org/2000/svg" width="29" height="14" viewBox="0 0 29 14" fill="none" class="icon">
    <path d="M28.5 7H1M1 7L7 1M1 7L7 13" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
</svg>Back</a></div></div>
						<div class="sidebar__body mt-auto"><div class="sidebar__group"><ul class="actions-menu"><li><button class="stacked-button" data-wsk-toggle="toggle-bookmark" data-wsk-toggle-bookmark-id="19382" data-wsk-action="add" type="button"><div class="stacked-button__icon"><span class="stacked-button__icon--add"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" class="icon">
<circle cx="12" cy="12" r="11.7333" fill="none" stroke="white" stroke-width="0.533333"/>
<path d="M12.2667 12.4445V8.17779M10.2095 10.3111H14.3238M17.0667 18.1333V8.74668C17.0667 7.5519 17.0667 6.95451 16.8424 6.49816C16.6452 6.09675 16.3305 5.77039 15.9434 5.56586C15.5034 5.33334 14.9273 5.33334 13.7752 5.33334H10.7581C9.60598 5.33334 9.02993 5.33334 8.58988 5.56586C8.2028 5.77039 7.8881 6.09675 7.69087 6.49816C7.46666 6.95451 7.46666 7.5519 7.46666 8.74668V18.1333L12.2667 15.2889L17.0667 18.1333Z" stroke="white" stroke-width="0.533333" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</svg></span><span class="stacked-button__icon--remove"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 25 24" class="icon">
<circle cx="12.5473" cy="12" r="11.7333" fill="white" stroke="none" style="stroke: none;"/>
<path d="M10.7568 10.3111H14.8711M17.614 18.1333V8.74668C17.614 7.5519 17.614 6.95451 17.3898 6.49816C17.1925 6.09675 16.8778 5.77039 16.4908 5.56586C16.0507 5.33334 15.4747 5.33334 14.3225 5.33334H11.3054C10.1533 5.33334 9.57724 5.33334 9.1372 5.56586C8.75012 5.77039 8.43542 6.09675 8.23819 6.49816C8.01398 6.95451 8.01398 7.5519 8.01398 8.74668V18.1333L12.814 15.2889L17.614 18.1333Z" fill="none" stroke="black" stroke-width="0.533333" stroke-linecap="round" stroke-linejoin="round" style="stroke: black;"/>
</svg></span></div><span class="stacked-button__text"><span class="stacked-button__text--add">Add to My</span><span class="stacked-button__text--remove">Remove from</span><br />Resources</span></button></li><li><button class="stacked-button" data-wsk-toggle="print" type="button"><span class="stacked-button__icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" class="icon">
<circle cx="12" cy="12" r="11.7333" stroke="white" fill="none" stroke-width="0.533333"/>
<path d="M16.1067 8.53334V7.38134C16.1067 6.66448 16.1067 6.30604 15.9672 6.03224C15.8444 5.79139 15.6486 5.59557 15.4078 5.47286C15.134 5.33334 14.7755 5.33334 14.0587 5.33334H10.4747C9.7578 5.33334 9.39937 5.33334 9.12556 5.47286C8.88471 5.59557 8.6889 5.79139 8.56618 6.03224C8.42667 6.30604 8.42667 6.66448 8.42667 7.38134V8.53334M8.42667 15.5733C7.83148 15.5733 7.53389 15.5733 7.28973 15.5079C6.62716 15.3304 6.10963 14.8129 5.93209 14.1503C5.86667 13.9061 5.86667 13.6085 5.86667 13.0133V11.6053C5.86667 10.53 5.86667 9.99239 6.07593 9.58168C6.26001 9.22041 6.55373 8.92669 6.91501 8.74261C7.32572 8.53334 7.86337 8.53334 8.93867 8.53334H15.5947C16.67 8.53334 17.2076 8.53334 17.6183 8.74261C17.9796 8.92669 18.2733 9.22041 18.4574 9.58168C18.6667 9.99239 18.6667 10.53 18.6667 11.6053V13.0133C18.6667 13.6085 18.6667 13.9061 18.6012 14.1503C18.4237 14.8129 17.9062 15.3304 17.2436 15.5079C16.9994 15.5733 16.7018 15.5733 16.1067 15.5733M14.1867 10.7733H16.1067M10.4747 18.1333H14.0587C14.7755 18.1333 15.134 18.1333 15.4078 17.9938C15.6486 17.8711 15.8444 17.6753 15.9672 17.4345C16.1067 17.1606 16.1067 16.8022 16.1067 16.0853V15.0613C16.1067 14.3445 16.1067 13.986 15.9672 13.7122C15.8444 13.4714 15.6486 13.2756 15.4078 13.1529C15.134 13.0133 14.7755 13.0133 14.0587 13.0133H10.4747C9.7578 13.0133 9.39937 13.0133 9.12556 13.1529C8.88471 13.2756 8.6889 13.4714 8.56618 13.7122C8.42667 13.986 8.42667 14.3445 8.42667 15.0613V16.0853C8.42667 16.8022 8.42667 17.1606 8.56618 17.4345C8.6889 17.6753 8.88471 17.8711 9.12556 17.9938C9.39937 18.1333 9.7578 18.1333 10.4747 18.1333Z" stroke="white" stroke-width="0.533333" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</svg></span><span class="stacked-button__text">Print<br />this page</span></button></li><li><button class="stacked-button" data-popover-content="#popover-sharing-buttons" data-bs-placement="bottom" data-bs-toggle="popover" data-bs-html="true" type="button"><span class="stacked-button__icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 25" class="icon">
<circle cx="12" cy="12.7333" r="11.7333" stroke="white" stroke-width="0.533333" fill="none"/>
<path d="M9.71259 13.3525L13.76 15.6875M13.7541 9.24587L9.71259 11.5808M17.0667 8.36001C17.0667 9.33203 16.2707 10.12 15.2889 10.12C14.3071 10.12 13.5111 9.33203 13.5111 8.36001C13.5111 7.38798 14.3071 6.60001 15.2889 6.60001C16.2707 6.60001 17.0667 7.38798 17.0667 8.36001ZM9.95556 12.4667C9.95556 13.4387 9.15962 14.2267 8.17778 14.2267C7.19594 14.2267 6.4 13.4387 6.4 12.4667C6.4 11.4947 7.19594 10.7067 8.17778 10.7067C9.15962 10.7067 9.95556 11.4947 9.95556 12.4667ZM17.0667 16.5733C17.0667 17.5454 16.2707 18.3333 15.2889 18.3333C14.3071 18.3333 13.5111 17.5454 13.5111 16.5733C13.5111 15.6013 14.3071 14.8133 15.2889 14.8133C16.2707 14.8133 17.0667 15.6013 17.0667 16.5733Z" stroke="white" stroke-width="0.533333" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</svg></span><span class="stacked-button__text">Share<br />this page</span></button></li></ul></div></div>
					</div>
				</div>

				<div class="col-lg-8 pb-7 order-1 order-lg-2">
					<div class="layout__body">
						<div class="d-lg-none mb-6">
							<a data-wsk-toggle="previous-page" class="btn btn-blank btn-back" href="https://growthenergy.org"><svg xmlns="http://www.w3.org/2000/svg" width="29" height="14" viewBox="0 0 29 14" fill="none" class="icon">
    <path d="M28.5 7H1M1 7L7 1M1 7L7 13" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
</svg>Back</a>						</div>

												<div class="mb-6">
															<h1 class="mb-0 layout__body-title">Meet the 2025 Outstanding Congressional Staff Award Winners</h1>							
													</div>
						
						
					</div>
				</div>

			</div>

		</div>
	</div>

</section>

			
<section class="layout layout--post-content colour-scheme colour-scheme--light layout--padding-y">
	<div class="container-fluid">
		<div class="row justify-content-between">

			<div class="col-lg-3 order-1 order-lg-0">
				<div class="sidebar">
					<div class="sidebar__footer"><div class="sidebar__group sidebar__group--bordered"><div class="mb-5"><a href="https://growthenergy.org/category/news/blog/" class="post-term tag tag--dark">Blog</a></div>Published — <div class="post-meta__posted-on"><time datetime="2025-09-16T12:00:12-04:00">September 16, 2025</time></div></div></div>				</div>
			</div>

			<div class="col-lg-8 order-0 order-lg-1">

									<div class="layout__media">
						<div class="media--rounded media"><div class="media__inner"><img width="7713" height="4450" src="https://growthenergy.org/wp-content/uploads/2025/09/DSC_8139.jpg" class="attachment-full size-full img-fluid" alt="" loading="lazy" /></div></div>					</div>
				
									<div class="layout__body">
						<p>Each year, Growth Energy recognizes the leading congressional staffers who have gone above and beyond to assist and actively engage with the Growth Energy team and our members on a variety of issues that impact the biofuels industry. Growth Energy proudly announced this year&rsquo;s winners of the Outstanding Congressional Staff awards at the 2025 Growth Energy Biofuels Summit (GEBS) this September.</p>
<p>&ldquo;<span data-teams="true">Every single one of these recipients have dedicated their own time to a number of legislative issues that impact the biofuels industry,&rdquo; said Growth Energy CEO Emily Skor. &ldquo;They are among the best and the brightest on Capitol Hill when it comes to biofuels, and we are proud to recognize all their hard work this past year.&rdquo;</span></p>
<p>Learn more about this year&rsquo;s winners below.</p>
<p>&nbsp;</p>
<p><strong><img loading="lazy" decoding="async" class="alignleft wp-image-19385 img-fluid" src="https://growthenergy.org/wp-content/uploads/2025/09/Trenton-Hoekstra-Headshot-300x286.jpg" alt="" width="168" height="160" srcset="https://growthenergy.org/wp-content/uploads/2025/09/Trenton-Hoekstra-Headshot-300x286.jpg 300w, https://growthenergy.org/wp-content/uploads/2025/09/Trenton-Hoekstra-Headshot-1024x975.jpg 1024w, https://growthenergy.org/wp-content/uploads/2025/09/Trenton-Hoekstra-Headshot-768x731.jpg 768w, https://growthenergy.org/wp-content/uploads/2025/09/Trenton-Hoekstra-Headshot-1536x1463.jpg 1536w, https://growthenergy.org/wp-content/uploads/2025/09/Trenton-Hoekstra-Headshot-2048x1950.jpg 2048w" sizes="auto, (max-width: 168px) 100vw, 168px">Winner &ndash; Trenton Hoekstra, Legislative Assistant to Senator Joni Ernst (R-Iowa)</strong></p>
<p>Trenton Hoekstra is a Legislative Assistant to U.S. Senator Joni Ernst (R-Iowa), handling the senator&rsquo;s agriculture, nutrition, trade, and biofuels portfolio. In his current role, he is the senator&rsquo;s first call when it comes to biofuel policy, and therefore one of the most influential staffers in the Seante on our issues. Trenton grew up on his family&rsquo;s corn, soybean, and hog farm in northwest Iowa, and is a graduate of the University of South Dakota.</p>
<p>&nbsp;</p>
<p>&nbsp;</p>
<p><img loading="lazy" decoding="async" class="alignleft wp-image-19384 img-fluid" style="--tw-scale-x: 1; --tw-scale-y: 1; --tw-scroll-snap-strictness: proximity; --tw-ring-offset-width: 0px; --tw-ring-offset-color: #fff; --tw-ring-color: #3b82f680; --tw-ring-offset-shadow: 0 0 #0000; --tw-ring-shadow: 0 0 #0000; --tw-shadow: 0 0 #0000; --tw-shadow-colored: 0 0 #0000;" src="https://growthenergy.org/wp-content/uploads/2025/09/Thomas-Liepold-300x300.jpg" alt="" width="166" height="166" srcset="https://growthenergy.org/wp-content/uploads/2025/09/Thomas-Liepold-300x300.jpg 300w, https://growthenergy.org/wp-content/uploads/2025/09/Thomas-Liepold-1024x1024.jpg 1024w, https://growthenergy.org/wp-content/uploads/2025/09/Thomas-Liepold-150x150.jpg 150w, https://growthenergy.org/wp-content/uploads/2025/09/Thomas-Liepold-768x768.jpg 768w, https://growthenergy.org/wp-content/uploads/2025/09/Thomas-Liepold-800x800.jpg 800w, https://growthenergy.org/wp-content/uploads/2025/09/Thomas-Liepold.jpg 1080w" sizes="auto, (max-width: 166px) 100vw, 166px"></p>
<p><strong>Winner &ndash; Thomas Liepold, Professional Staff Member for Senator Amy Klobuchar (D-Minn.)</strong></p>
<p>Thomas Liepold is a Professional Staff member for Ranking Member Amy Klobuchar (D-Minn.) on the U.S. Senate Committee on Agriculture, Nutrition, and Forestry where he works on energy and rural development issues. He began working for Senator Klobuchar in 2016 and has worked on a range of issues from trade, crop insurance, livestock and biofuels. Thomas grew up on his family&rsquo;s farm in Heron Lake, Minnesota. Thomas earned a bachelor&rsquo;s degree in agriculture marketing and a master&rsquo;s degree in public policy from the University of Minnesota.</p>
<p>&nbsp;</p>
<p><img loading="lazy" decoding="async" class="alignleft wp-image-19383 img-fluid" src="https://growthenergy.org/wp-content/uploads/2025/09/Abby-Goins-300x300.jpg" alt="" width="166" height="166" srcset="https://growthenergy.org/wp-content/uploads/2025/09/Abby-Goins-300x300.jpg 300w, https://growthenergy.org/wp-content/uploads/2025/09/Abby-Goins-150x150.jpg 150w, https://growthenergy.org/wp-content/uploads/2025/09/Abby-Goins.jpg 565w" sizes="auto, (max-width: 166px) 100vw, 166px"></p>
<p><strong>Winner &ndash; Abby Goins, Legislative Assistant to Representative Adrian Smith (R-Neb.)</strong></p>
<p>Abby Goins is a Legislative Assistant for Congressman Adrian Smith (Neb.-03), a senior member of the House Ways and Means Committee and Chairman of the Subcommittee on Trade. Abby advises Congressman Smith on trade, agriculture, and energy policy. Prior to this role, she spent three years in Congressman Tracey Mann&rsquo;s (Kan.-01) office. Abby is from Oswego, Kansas and is a graduate of Kansas State University, where she studied Agricultural Economics and Global Food Systems Leadership.</p>
<p>&nbsp;</p>
<p><img loading="lazy" decoding="async" class="wp-image-19386 alignleft img-fluid" src="https://growthenergy.org/wp-content/uploads/2025/09/Yusuf-Nekzad-278x300.jpg" alt="" width="162" height="175" srcset="https://growthenergy.org/wp-content/uploads/2025/09/Yusuf-Nekzad-278x300.jpg 278w, https://growthenergy.org/wp-content/uploads/2025/09/Yusuf-Nekzad-948x1024.jpg 948w, https://growthenergy.org/wp-content/uploads/2025/09/Yusuf-Nekzad-768x830.jpg 768w, https://growthenergy.org/wp-content/uploads/2025/09/Yusuf-Nekzad-1422x1536.jpg 1422w, https://growthenergy.org/wp-content/uploads/2025/09/Yusuf-Nekzad-1896x2048.jpg 1896w" sizes="auto, (max-width: 162px) 100vw, 162px"></p>
<p><strong>Winner &ndash; Yusuf Nekzad, Legislative Director for Representative Nikki Budzinski (D-Ill.)</strong></p>
<p>Yusuf Nekzad serves as Legislative Director for Rep. Nikki Budzinski (Ill.-13). Congresswoman Budzinski is a member of the House Agriculture Committee, Co-Chair of the Congressional Biofuels Caucus, and Vice Chair for Policy of the New Democrat Coalition. A known expert on the Hill for energy policy, Yusuf previously served as Legislative Affairs Coordinator for the Department of Energy&rsquo;s Office of Infrastructure and as a Senior Policy Advisor to former Rep. Cheri Bustos of Illinois.</p>
<p>&nbsp;</p>
<p>Congratulations to all of our Outstanding Congressional Staff award winners! Thank you for all your hard work, leadership, and partnership over the years.</p>
					</div>
				
			</div>

		</div>
	</div>
</section>
			
		
	</main>

			
<section class="layout layout--testimonial colour-scheme colour-scheme--dark layout--padding-y-wide">

	<div class="container-fluid">
		<div class="layout__inner">

			<div class="grid">

				<div class="g-col-12 g-col-md-10 g-start-md-2 g-col-lg-8 g-start-lg-3">
											<h6 class="layout__title">Expanding America's Bioeconomy</h6>
					
					<blockquote class="blockquote"><div class="blockquote__body">Growth Energy is the leading voice of America’s biofuel industry. Our members operate and support biomanufacturing facilities at the heart of America’s bioeconomy, delivering a new generation of clean fuel options.</div></blockquote>
					<a href="https://growthenergy.org/our-network/becoming-a-member/" target="" title="Becoming a Member" class="btn btn-outline">Becoming a Member</a>				</div>

			</div>

		</div>
	</div>

</section>

<section class="layout layout--overlapping-form colour-scheme colour-scheme--light layout--padding-y">

	<div class="container-fluid">
		<div class="layout__inner colour-scheme colour-scheme--gradient-ltr">

			<div class="grid">
				<div class="g-col-12 g-col-lg-4 layout__content">

					<header class="layout__header animation animation--fade-in-up">
													<h5>Email updates</h5>
						
													<h2>Stay connected to Growth </h2>
											</header>

											<div class="layout__intro animation animation--fade-in-up animation--delay-4">
							Want to get the latest news and updates about how you can help? Subscribe to email updates. 						</div>
					
				</div>

				<div class="g-col-12 g-col-lg-8 form--minimal">
					
                <div class='gf_browser_chrome gform_wrapper gravity-theme gform-theme--no-framework' data-form-theme='gravity-theme' data-form-index='0' id='gform_wrapper_4' ><form method='post' enctype='multipart/form-data' target='gform_ajax_frame_4' id='gform_4'  action='/2025/09/16/2025-staff-award-winners/' data-formid='4' novalidate><div class='gf_invisible ginput_recaptchav3' data-sitekey='6LdAwL8qAAAAAMjdFEaiyqzzlWbLVZM2hTji_UsI' data-tabindex='0'><input id="input_35be03f21148cf7daf00d9edcddf7231" class="gfield_recaptcha_response" type="hidden" name="input_35be03f21148cf7daf00d9edcddf7231" value=""/></div>
                        <div class='gform-body gform_body'><div id='gform_fields_4' class='gform_fields top_label form_sublabel_below description_below validation_below'><div id="field_4_10" class="gfield gfield--type-honeypot gform_validation_container field_sublabel_below gfield--has-description field_description_below field_validation_below gfield_visibility_visible"  ><label class="gfield_label gform-field-label form-label" for="input_4_10">Company</label><div class="ginput_container"><input name="input_10" id="input_4_10" type="text" value="" autocomplete="new-password"></div><div class="gfield_description" id="gfield_description_4_10">This field is for validation purposes and should be left unchanged.</div></div><div id="field_4_1" class="gfield gfield--type-text gfield--width-half gfield_contains_required field_sublabel_below gfield--no-description field_description_below hidden_label field_validation_below gfield_visibility_visible"  ><label class="gfield_label gform-field-label form-label" for="input_4_1">First name<span class="gfield_required"><span class="gfield_required gfield_required_text">(Required)</span></span></label><div class="ginput_container ginput_container_text"><input name="input_1" id="input_4_1" type="text" value="" class="form-control-default form-control" placeholder="First name" aria-required="true" aria-invalid="false"></div></div><div id="field_4_3" class="gfield gfield--type-text gfield--width-half gfield_contains_required field_sublabel_below gfield--no-description field_description_below hidden_label field_validation_below gfield_visibility_visible"  ><label class="gfield_label gform-field-label form-label" for="input_4_3">Last name<span class="gfield_required"><span class="gfield_required gfield_required_text">(Required)</span></span></label><div class="ginput_container ginput_container_text"><input name="input_3" id="input_4_3" type="text" value="" class="form-control-default form-control" placeholder="Last name" aria-required="true" aria-invalid="false"></div></div><div id="field_4_4" class="gfield gfield--type-email gfield--width-half gfield_contains_required field_sublabel_below gfield--no-description field_description_below hidden_label field_validation_below gfield_visibility_visible"  ><label class="gfield_label gform-field-label form-label" for="input_4_4">Email<span class="gfield_required"><span class="gfield_required gfield_required_text">(Required)</span></span></label><div class="ginput_container ginput_container_email">
                            <input name="input_4" id="input_4_4" type="email" value="" class="form-control-default form-control" placeholder="Email" aria-required="true" aria-invalid="false">
                        </div></div><div id="field_4_6" class="gfield gfield--type-text gfield--width-half gfield_contains_required field_sublabel_below gfield--no-description field_description_below hidden_label field_validation_below gfield_visibility_visible"  ><label class="gfield_label gform-field-label form-label" for="input_4_6">Zip<span class="gfield_required"><span class="gfield_required gfield_required_text">(Required)</span></span></label><div class="ginput_container ginput_container_text"><input name="input_6" id="input_4_6" type="text" value="" class="form-control-default form-control" placeholder="Zip" aria-required="true" aria-invalid="false"></div></div><fieldset id="field_4_8" class="gfield gfield--type-consent gfield--type-choice gfield--input-type-consent gfield--width-half gfield_contains_required field_sublabel_below gfield--no-description field_description_below hidden_label field_validation_below gfield_visibility_visible"  ><legend class="gfield_label gform-field-label gfield_label_before_complex">Terms and Conditions consent<span class="gfield_required"><span class="gfield_required gfield_required_text">(Required)</span></span></legend><div class="ginput_container ginput_container_consent form-check"><input name="input_8.1" id="input_4_8_1" type="checkbox" value="1" aria-required="true" aria-invalid="false" class="form-check-input"> <label class="gform-field-label gform-field-label--type-inline gfield_consent_label form-label form-check-label" for="input_4_8_1">I agree to the <a href="/terms-and-conditions/">Terms and Conditions</a><span class="gfield_required gfield_required_text">(Required)</span></label><input type="hidden" name="input_8.2" value='I agree to the &lt;a href="/terms-and-conditions/"&gt;Terms and Conditions&lt;/a&gt;' class="gform_hidden"><input type="hidden" name="input_8.3" value="2" class="gform_hidden"></div></fieldset><fieldset id="field_4_9" class="gfield gfield--type-consent gfield--type-choice gfield--input-type-consent gfield--width-half gfield_contains_required field_sublabel_below gfield--no-description field_description_below hidden_label field_validation_below gfield_visibility_visible"  ><legend class="gfield_label gform-field-label gfield_label_before_complex">Newsletter signup consent<span class="gfield_required"><span class="gfield_required gfield_required_text">(Required)</span></span></legend><div class="ginput_container ginput_container_consent form-check"><input name="input_9.1" id="input_4_9_1" type="checkbox" value="1" aria-required="true" aria-invalid="false" class="form-check-input"> <label class="gform-field-label gform-field-label--type-inline gfield_consent_label form-label form-check-label" for="input_4_9_1">I agree to receive email updates<span class="gfield_required gfield_required_text">(Required)</span></label><input type="hidden" name="input_9.2" value="I agree to receive email updates" class="gform_hidden"><input type="hidden" name="input_9.3" value="2" class="gform_hidden"></div></fieldset></div></div>
        <div class='gform-footer gform_footer top_label'> <button type="submit" id="gform_submit_button_4" class="gform_btn btn-outline btn btn-outline" onclick="gform.submission.handleButtonClick(this);" data-submission-type="submit">Subscribe</button> <html><body><script>(function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'9cb0d23c9887f5b9',t:'MTc3MDYxMzQxNi4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();</script></body></html>
<input type='hidden' name='gform_ajax' value='form_id=4&amp;title=&amp;description=&amp;tabindex=0&amp;theme=gravity-theme&amp;hash=f42a510e790de993bccc2be2ea52cc96' />
            <input type='hidden' class='gform_hidden' name='gform_submission_method' data-js='gform_submission_method_4' value='iframe' />
            <input type='hidden' class='gform_hidden' name='gform_theme' data-js='gform_theme_4' id='gform_theme_4' value='gravity-theme' />
            <input type='hidden' class='gform_hidden' name='gform_style_settings' data-js='gform_style_settings_4' id='gform_style_settings_4' value='' />
            <input type='hidden' class='gform_hidden' name='is_submit_4' value='1' />
            <input type='hidden' class='gform_hidden' name='gform_submit' value='4' />
            
            <input type='hidden' class='gform_hidden' name='gform_currency' data-currency='USD' value='9n2H111HwRQvFL0ATDU0+LQDaKktawXYS/TmLmOaG+7mTU0En+XNspVUN6vUijv+SLzu/C7PmqCPrInx+jzRqHTgOsH4u1Gag2Jge554M8u96u0=' />
            <input type='hidden' class='gform_hidden' name='gform_unique_id' value='' />
            <input type='hidden' class='gform_hidden' name='state_4' value='WyJ7XCI4LjFcIjpcIjA3OGU2NTc3NDNmOGZkYTUxMDUxOGMxZGU1Mzg4N2M5XCIsXCI4LjJcIjpcImRhNDI4MGFlMDVjNTQ3Yjk4ZDM2OWFmYjA5YjgzZjBhXCIsXCI4LjNcIjpcIjljMmMxMDQ3MDE5NWMzNzQ0MTEzNTRiMzkwM2E0ZDE2XCIsXCI5LjFcIjpcIjA3OGU2NTc3NDNmOGZkYTUxMDUxOGMxZGU1Mzg4N2M5XCIsXCI5LjJcIjpcIjU0N2UxZDRhMGQzM2ZlM2QwNjZjMmRlMmZiMjhjYzdhXCIsXCI5LjNcIjpcIjljMmMxMDQ3MDE5NWMzNzQ0MTEzNTRiMzkwM2E0ZDE2XCJ9IiwiNzYxNTdkNjFjZDZlMDhkZmFkNmYzNjc3MGVjZjU2YTgiXQ==' />
            <input type='hidden' autocomplete='off' class='gform_hidden' name='gform_target_page_number_4' id='gform_target_page_number_4' value='0' />
            <input type='hidden' autocomplete='off' class='gform_hidden' name='gform_source_page_number_4' id='gform_source_page_number_4' value='1' />
            <input type='hidden' name='gform_field_values' value='' />
            
        </div>
                        </form>
                        </div>
		                <iframe style='display:none;width:0px;height:0px;' src='about:blank' name='gform_ajax_frame_4' id='gform_ajax_frame_4' title='This iframe contains the logic required to handle Ajax powered Gravity Forms.'></iframe>
		                <script>
gform.initializeOnLoaded( function() {gformInitSpinner( 4, 'https://growthenergy.org/wp-content/plugins/gravityforms/images/spinner.svg', true );jQuery('#gform_ajax_frame_4').on('load',function(){var contents = jQuery(this).contents().find('*').html();var is_postback = contents.indexOf('GF_AJAX_POSTBACK') >= 0;if(!is_postback){return;}var form_content = jQuery(this).contents().find('#gform_wrapper_4');var is_confirmation = jQuery(this).contents().find('#gform_confirmation_wrapper_4').length > 0;var is_redirect = contents.indexOf('gformRedirect(){') >= 0;var is_form = form_content.length > 0 && ! is_redirect && ! is_confirmation;var mt = parseInt(jQuery('html').css('margin-top'), 10) + parseInt(jQuery('body').css('margin-top'), 10) + 100;if(is_form){jQuery('#gform_wrapper_4').html(form_content.html());if(form_content.hasClass('gform_validation_error')){jQuery('#gform_wrapper_4').addClass('gform_validation_error');} else {jQuery('#gform_wrapper_4').removeClass('gform_validation_error');}setTimeout( function() { /* delay the scroll by 50 milliseconds to fix a bug in chrome */  }, 50 );if(window['gformInitDatepicker']) {gformInitDatepicker();}if(window['gformInitPriceFields']) {gformInitPriceFields();}var current_page = jQuery('#gform_source_page_number_4').val();gformInitSpinner( 4, 'https://growthenergy.org/wp-content/plugins/gravityforms/images/spinner.svg', true );jQuery(document).trigger('gform_page_loaded', [4, current_page]);window['gf_submitting_4'] = false;}else if(!is_redirect){var confirmation_content = jQuery(this).contents().find('.GF_AJAX_POSTBACK').html();if(!confirmation_content){confirmation_content = contents;}jQuery('#gform_wrapper_4').replaceWith(confirmation_content);jQuery(document).trigger('gform_confirmation_loaded', [4]);window['gf_submitting_4'] = false;wp.a11y.speak(jQuery('#gform_confirmation_message_4').text());}else{jQuery('#gform_4').append(contents);if(window['gformRedirect']) {gformRedirect();}}jQuery(document).trigger("gform_pre_post_render", [{ formId: "4", currentPage: "current_page", abort: function() { this.preventDefault(); } }]);        if (event && event.defaultPrevented) {                return;        }        const gformWrapperDiv = document.getElementById( "gform_wrapper_4" );        if ( gformWrapperDiv ) {            const visibilitySpan = document.createElement( "span" );            visibilitySpan.id = "gform_visibility_test_4";            gformWrapperDiv.insertAdjacentElement( "afterend", visibilitySpan );        }        const visibilityTestDiv = document.getElementById( "gform_visibility_test_4" );        let postRenderFired = false;        function triggerPostRender() {            if ( postRenderFired ) {                return;            }            postRenderFired = true;            gform.core.triggerPostRenderEvents( 4, current_page );            if ( visibilityTestDiv ) {                visibilityTestDiv.parentNode.removeChild( visibilityTestDiv );            }        }        function debounce( func, wait, immediate ) {            var timeout;            return function() {                var context = this, args = arguments;                var later = function() {                    timeout = null;                    if ( !immediate ) func.apply( context, args );                };                var callNow = immediate && !timeout;                clearTimeout( timeout );                timeout = setTimeout( later, wait );                if ( callNow ) func.apply( context, args );            };        }        const debouncedTriggerPostRender = debounce( function() {            triggerPostRender();        }, 200 );        if ( visibilityTestDiv && visibilityTestDiv.offsetParent === null ) {            const observer = new MutationObserver( ( mutations ) => {                mutations.forEach( ( mutation ) => {                    if ( mutation.type === 'attributes' && visibilityTestDiv.offsetParent !== null ) {                        debouncedTriggerPostRender();                        observer.disconnect();                    }                });            });            observer.observe( document.body, {                attributes: true,                childList: false,                subtree: true,                attributeFilter: [ 'style', 'class' ],            });        } else {            triggerPostRender();        }    } );} );
</script>
				</div>
			</div>

		</div>
	</div>

</section>

<footer id="colophon" class="site-footer colour-scheme colour-scheme--light layout--padding-y" role="contentinfo">
	<div class="container-fluid">

		<div id="main-footer">
			<div class="grid">

				<div class="g-col-12 g-col-lg-6">
					<a href="https://growthenergy.org" class="footer-brand" title="Growth Energy"><svg xmlns="http://www.w3.org/2000/svg" width="384" height="83" viewBox="0 0 387.26 82.356">
  <g id="logo-growth-energy" transform="translate(-30.14 -30.77)">
    <g id="logo_brand-mark" transform="translate(30.14 30.777)">
      <path id="Path_47" data-name="Path 47" d="M30.14,80.541c0,17,8.4,30.952,19.143,32.588a29.827,29.827,0,0,1-7-8.021c-4.116-6.74-6.379-15.463-6.379-24.56,0-14.222,11.68-35.389,18.011-45.815-1.547-2.481-2.528-3.953-2.528-3.953S30.14,62.455,30.14,80.548Z" transform="translate(-30.14 -30.78)" fill="#1be0e0"/>
      <path id="Path_48" data-name="Path 48" d="M48.08,80.541c0,17,8.4,30.952,19.143,32.588a29.828,29.828,0,0,1-7-8.021c-4.116-6.74-6.379-15.463-6.379-24.56,0-14.222,11.68-35.389,18.011-45.815-1.547-2.481-2.528-3.953-2.528-3.953S48.08,62.455,48.08,80.548Z" transform="translate(-35.854 -30.78)" fill="#13919b"/>
      <path id="Path_49" data-name="Path 49" d="M66.02,80.541c0,17,8.4,30.952,19.143,32.588a29.828,29.828,0,0,1-7-8.021c-4.116-6.74-6.379-15.463-6.379-24.56,0-14.222,11.68-35.389,18.011-45.815-1.547-2.481-2.528-3.953-2.528-3.953S66.02,62.455,66.02,80.548Z" transform="translate(-41.569 -30.78)" fill="#0c8e4d"/>
      <path id="Path_50" data-name="Path 50" d="M126.447,80.538c0-18.093-21.248-49.768-21.248-49.768S83.95,62.445,83.95,80.538c0,16.989,8.389,30.912,19.129,32.554-.1-3.516-.15-7.312-.15-11.292,0-17.63,2.269-48.494,2.269-48.494s2.269,30.864,2.269,48.494c0,3.98-.055,7.782-.15,11.292C118.051,111.443,126.447,97.52,126.447,80.538Z" transform="translate(-47.28 -30.777)" fill="#08bc15"/>
    </g>
    <g id="logo_word-mark">
      <path id="Path_51" data-name="Path 51" d="M180.66,125.142v3.121h5.152v1.022H180.66v3.305h5.724v1.022H179.57V124.12h6.815v1.022Z" transform="translate(-47.598 -29.735)" fill="none"/>
      <path id="Path_52" data-name="Path 52" d="M196.623,134.712l-2.14-2.849-2.153,2.849h-1.22l2.767-3.646-2.651-3.5h1.22l2.044,2.692,2.031-2.692h1.213l-2.637,3.5,2.753,3.646h-1.22Z" transform="translate(-51.273 -30.834)" fill="none"/>
      <path id="Path_53" data-name="Path 53" d="M210.014,131.061c0,2.2-1.411,3.748-3.292,3.748a2.9,2.9,0,0,1-2.6-1.506v3.721H203.09V127.5h1.036v1.342a2.9,2.9,0,0,1,2.6-1.506c1.881,0,3.292,1.547,3.292,3.734Zm-1.09,0a2.43,2.43,0,1,0-2.392,2.821C207.942,133.882,208.923,132.71,208.923,131.061Z" transform="translate(-55.089 -30.76)" fill="none"/>
      <path id="Path_54" data-name="Path 54" d="M221.29,130.288v4.355h-1.036v-1.118a2.985,2.985,0,0,1-2.515,1.288,2.334,2.334,0,0,1-2.61-2.283,2.566,2.566,0,0,1,2.808-2.378,7.707,7.707,0,0,1,2.324.4v-.266a1.824,1.824,0,0,0-1.935-2.072,4.84,4.84,0,0,0-2.085.647l-.416-.845a5.773,5.773,0,0,1,2.569-.688,2.686,2.686,0,0,1,2.9,2.958Zm-1.036,2.113v-1.09a8.223,8.223,0,0,0-2.153-.293c-1.063,0-1.963.607-1.963,1.465s.777,1.411,1.785,1.411a2.352,2.352,0,0,0,2.337-1.492Z" transform="translate(-58.924 -30.757)" fill="none"/>
      <path id="Path_55" data-name="Path 55" d="M233.132,130.084v4.545H232.1V130.22a1.806,1.806,0,0,0-1.785-1.976,2.084,2.084,0,0,0-2.215,1.84v4.545H227.06V127.48H228.1v1.145a2.707,2.707,0,0,1,2.351-1.315,2.611,2.611,0,0,1,2.678,2.767Z" transform="translate(-62.725 -30.751)" fill="none"/>
      <path id="Path_56" data-name="Path 56" d="M245.3,123.877v9.663h-1.036V132.2a2.9,2.9,0,0,1-2.6,1.506c-1.881,0-3.292-1.547-3.292-3.748s1.411-3.734,3.292-3.734a2.9,2.9,0,0,1,2.6,1.506V123.87H245.3Zm-1.036,6.079a2.524,2.524,0,0,0-2.406-2.808c-1.411,0-2.392,1.159-2.392,2.808a2.43,2.43,0,1,0,4.8,0Z" transform="translate(-66.33 -29.655)" fill="none"/>
      <path id="Path_57" data-name="Path 57" d="M251.28,124.335a.688.688,0,0,1,.688-.675.681.681,0,0,1,.675.675.682.682,0,1,1-1.363,0Zm.164,1.99h1.036v7.149h-1.036Z" transform="translate(-70.439 -29.588)" fill="none"/>
      <path id="Path_58" data-name="Path 58" d="M261.962,130.084v4.545h-1.036V130.22a1.806,1.806,0,0,0-1.785-1.976,2.084,2.084,0,0,0-2.215,1.84v4.545H255.89V127.48h1.036v1.145a2.707,2.707,0,0,1,2.351-1.315,2.611,2.611,0,0,1,2.678,2.767Z" transform="translate(-71.908 -30.751)" fill="none"/>
      <path id="Path_59" data-name="Path 59" d="M274.094,127.49v6.385a3.2,3.2,0,0,1-3.51,3.135,4.612,4.612,0,0,1-2.889-.954l.457-.818a3.393,3.393,0,0,0,2.3.845c1.642,0,2.61-.818,2.61-2.215V132.71a2.973,2.973,0,0,1-2.6,1.4,3.4,3.4,0,0,1,0-6.787,2.973,2.973,0,0,1,2.6,1.4V127.49h1.036Zm-1.036,3.217a2.4,2.4,0,1,0-2.406,2.474A2.337,2.337,0,0,0,273.058,130.707Z" transform="translate(-75.501 -30.754)" fill="none"/>
      <path id="Path_60" data-name="Path 60" d="M292.511,131.459h-5.3l-.954,2.153H285.09l4.191-9.493h1.172l4.191,9.493h-1.172l-.954-2.153Zm-.443-1.022-2.194-4.988-2.215,4.988Z" transform="translate(-81.209 -29.735)" fill="none"/>
      <path id="Path_61" data-name="Path 61" d="M311.343,130.087v4.545h-1.036v-4.409a1.754,1.754,0,0,0-1.642-1.976,1.816,1.816,0,0,0-1.935,1.84v4.545h-1.036v-4.409a1.754,1.754,0,0,0-1.642-1.976,1.816,1.816,0,0,0-1.935,1.84v4.545H301.08v-7.149h1.036v1.049a2.218,2.218,0,0,1,2.072-1.213,2.427,2.427,0,0,1,2.31,1.52,2.332,2.332,0,0,1,2.31-1.52,2.552,2.552,0,0,1,2.542,2.767Z" transform="translate(-86.302 -30.754)" fill="none"/>
      <path id="Path_62" data-name="Path 62" d="M324.281,133.014l.634.675a4.28,4.28,0,0,1-2.876,1.1,3.671,3.671,0,0,1-3.619-3.762,3.551,3.551,0,0,1,3.523-3.721c2.153,0,3.387,1.629,3.387,4.13h-5.847a2.535,2.535,0,0,0,2.542,2.419,3.362,3.362,0,0,0,2.256-.859Zm-4.784-2.487h4.811a2.284,2.284,0,0,0-2.324-2.283A2.5,2.5,0,0,0,319.5,130.527Z" transform="translate(-91.825 -30.751)" fill="none"/>
      <path id="Path_63" data-name="Path 63" d="M334.773,127.33v.927a2.5,2.5,0,0,0-2.767,2.392v3.993H330.97v-7.149h1.036v1.4A2.882,2.882,0,0,1,334.773,127.33Z" transform="translate(-95.823 -30.757)" fill="none"/>
      <path id="Path_64" data-name="Path 64" d="M338.17,124.335a.688.688,0,0,1,.688-.675.681.681,0,0,1,.675.675.682.682,0,1,1-1.363,0Zm.164,1.99h1.036v7.149h-1.036Z" transform="translate(-98.116 -29.588)" fill="none"/>
      <path id="Path_65" data-name="Path 65" d="M342.2,131.054a3.766,3.766,0,0,1,3.707-3.734,3.682,3.682,0,0,1,2.542,1.049l-.716.7a2.486,2.486,0,0,0-1.826-.831,2.822,2.822,0,0,0,0,5.629,2.526,2.526,0,0,0,1.867-.872l.716.7a3.651,3.651,0,0,1-2.583,1.09,3.778,3.778,0,0,1-3.707-3.748Z" transform="translate(-99.4 -30.754)" fill="none"/>
      <path id="Path_66" data-name="Path 66" d="M359.171,130.288v4.355h-1.036v-1.118a2.985,2.985,0,0,1-2.515,1.288,2.334,2.334,0,0,1-2.61-2.283,2.566,2.566,0,0,1,2.808-2.378,7.707,7.707,0,0,1,2.324.4v-.266a1.824,1.824,0,0,0-1.935-2.072,4.84,4.84,0,0,0-2.085.647l-.416-.845a5.773,5.773,0,0,1,2.569-.688,2.686,2.686,0,0,1,2.9,2.958Zm-1.036,2.113v-1.09a8.223,8.223,0,0,0-2.153-.293c-1.063,0-1.963.607-1.963,1.465s.777,1.411,1.785,1.411a2.352,2.352,0,0,0,2.337-1.492Z" transform="translate(-102.843 -30.757)" fill="none"/>
      <path id="Path_67" data-name="Path 67" d="M364.974,127.137a3.145,3.145,0,0,0,.716-1.288.759.759,0,0,1-.75-.763.748.748,0,0,1,.763-.736c.525,0,.845.47.845,1.1,0,.552-.232,1.022-1.063,2.058l-.511-.388Z" transform="translate(-106.643 -29.808)" fill="none"/>
      <path id="Path_68" data-name="Path 68" d="M369.43,133.743l.538-.763a4.15,4.15,0,0,0,2.419.9c.94,0,1.574-.443,1.574-1.118,0-.777-.831-1.022-1.8-1.3-1.731-.5-2.392-1.009-2.392-2.031a2.212,2.212,0,0,1,2.5-2.1,4.756,4.756,0,0,1,2.556.8l-.5.8a3.884,3.884,0,0,0-2.058-.675c-.8,0-1.465.361-1.465,1.049,0,.62.525.818,1.854,1.247,1.145.361,2.337.75,2.337,2.1s-1.131,2.153-2.61,2.153a4.873,4.873,0,0,1-2.958-1.063Z" transform="translate(-108.073 -30.757)" fill="none"/>
      <path id="Path_69" data-name="Path 69" d="M385.91,124.12h4.355a2.4,2.4,0,0,1,2.61,2.365,2.253,2.253,0,0,1-1.356,2.085,2.772,2.772,0,0,1,1.731,2.446,2.61,2.61,0,0,1-2.821,2.6H385.91Zm4.075,4.021a1.541,1.541,0,1,0,0-3.039h-3v3.039Zm.17,4.491a1.773,1.773,0,1,0,0-3.516h-3.162v3.51h3.162Z" transform="translate(-113.323 -29.735)" fill="none"/>
      <path id="Path_70" data-name="Path 70" d="M398.88,124.335a.688.688,0,0,1,.688-.675.681.681,0,0,1,.675.675.682.682,0,1,1-1.363,0Zm.17,1.99h1.036v7.149H399.05Z" transform="translate(-117.454 -29.588)" fill="none"/>
      <path id="Path_71" data-name="Path 71" d="M402.92,131.054a3.7,3.7,0,1,1,3.707,3.748A3.766,3.766,0,0,1,402.92,131.054Zm6.3,0a2.612,2.612,0,1,0-2.6,2.821A2.744,2.744,0,0,0,409.224,131.054Z" transform="translate(-118.741 -30.754)" fill="none"/>
      <path id="Path_72" data-name="Path 72" d="M421.351,133.014l.634.675a4.28,4.28,0,0,1-2.876,1.1,3.671,3.671,0,0,1-3.619-3.762,3.551,3.551,0,0,1,3.523-3.721c2.153,0,3.387,1.629,3.387,4.13h-5.847a2.535,2.535,0,0,0,2.542,2.419,3.362,3.362,0,0,0,2.256-.859Zm-4.784-2.487h4.811a2.284,2.284,0,0,0-2.324-2.283A2.5,2.5,0,0,0,416.567,130.527Z" transform="translate(-122.745 -30.751)" fill="none"/>
      <path id="Path_73" data-name="Path 73" d="M427.33,131.054a3.766,3.766,0,0,1,3.707-3.734,3.682,3.682,0,0,1,2.542,1.049l-.716.7a2.486,2.486,0,0,0-1.826-.831,2.822,2.822,0,0,0,0,5.629A2.527,2.527,0,0,0,432.9,133l.716.7a3.651,3.651,0,0,1-2.583,1.09,3.778,3.778,0,0,1-3.707-3.748Z" transform="translate(-126.516 -30.754)" fill="none"/>
      <path id="Path_74" data-name="Path 74" d="M437.87,131.054a3.7,3.7,0,1,1,3.707,3.748A3.766,3.766,0,0,1,437.87,131.054Zm6.3,0a2.612,2.612,0,1,0-2.6,2.821A2.744,2.744,0,0,0,444.174,131.054Z" transform="translate(-129.873 -30.754)" fill="none"/>
      <path id="Path_75" data-name="Path 75" d="M457.092,130.084v4.545h-1.036V130.22a1.806,1.806,0,0,0-1.785-1.976,2.084,2.084,0,0,0-2.215,1.84v4.545H451.02V127.48h1.036v1.145a2.707,2.707,0,0,1,2.351-1.315,2.611,2.611,0,0,1,2.678,2.767Z" transform="translate(-134.062 -30.751)" fill="none"/>
      <path id="Path_76" data-name="Path 76" d="M462.22,131.054a3.7,3.7,0,1,1,3.707,3.748A3.766,3.766,0,0,1,462.22,131.054Zm6.3,0a2.612,2.612,0,1,0-2.6,2.821A2.744,2.744,0,0,0,468.517,131.054Z" transform="translate(-137.63 -30.754)" fill="none"/>
      <path id="Path_77" data-name="Path 77" d="M485.623,130.087v4.545h-1.036v-4.409a1.754,1.754,0,0,0-1.642-1.976,1.816,1.816,0,0,0-1.935,1.84v4.545h-1.036v-4.409a1.754,1.754,0,0,0-1.642-1.976,1.816,1.816,0,0,0-1.935,1.84v4.545H475.36v-7.149H476.4v1.049a2.218,2.218,0,0,1,2.072-1.213,2.427,2.427,0,0,1,2.31,1.52,2.332,2.332,0,0,1,2.31-1.52,2.552,2.552,0,0,1,2.542,2.767Z" transform="translate(-141.815 -30.754)" fill="none"/>
      <path id="Path_78" data-name="Path 78" d="M492.906,136.964l.245-.886a1.917,1.917,0,0,0,.845.177,1.059,1.059,0,0,0,1.036-.634l.416-.886-3.108-7.176h1.145l2.5,5.942,2.365-5.942h1.118l-3.264,7.946a2.236,2.236,0,0,1-2.167,1.683,2.726,2.726,0,0,1-1.131-.232Z" transform="translate(-147.224 -30.83)" fill="none"/>
      <path id="Path_79" data-name="Path 79" d="M190.751,78.415h11.442v11.04a16.08,16.08,0,0,1-10.876,4.355,14.325,14.325,0,1,1,0-28.649,15.859,15.859,0,0,1,10.876,4.355l-2.862,2.74a11.507,11.507,0,0,0-8.021-3.346,10.582,10.582,0,0,0,0,21.153,11.749,11.749,0,0,0,6.849-2.3v-5.8h-7.414V78.421Z" transform="translate(-46.744 -10.954)" fill="none"/>
      <path id="Path_80" data-name="Path 80" d="M232.541,75.207v3.462c-4.314,0-7.374,2.378-7.735,6V96.516H220.82V75.684h3.987V79.67a8.241,8.241,0,0,1,7.735-4.47Z" transform="translate(-60.737 -14.152)" fill="none"/>
      <path id="Path_81" data-name="Path 81" d="M239.38,86.086a10.958,10.958,0,1,1,11,10.917A11.066,11.066,0,0,1,239.38,86.086Zm17.923,0c0-4.027-3.183-7.414-6.931-7.414a7.448,7.448,0,0,0,0,14.87A7.237,7.237,0,0,0,257.3,86.086Z" transform="translate(-66.649 -14.155)" fill="none"/>
      <path id="Path_82" data-name="Path 82" d="M272.84,75.92h4.068l4.8,15.51,5.159-15.51h3.387l5.159,15.51,4.757-15.51h4.068l-7.012,20.833h-3.666l-5-15.469-5.036,15.469h-3.666L272.847,75.92Z" transform="translate(-77.307 -14.382)" fill="none"/>
      <path id="Path_83" data-name="Path 83" d="M332.839,93.062a6.707,6.707,0,0,1-4.15,1.492,5.344,5.344,0,0,1-5.479-5.683V67.52h3.9v5.724h4.913v3.387h-4.913V88.6a2.3,2.3,0,0,0,2.133,2.5,3.1,3.1,0,0,0,2.133-.763l1.452,2.74Z" transform="translate(-93.351 -11.706)" fill="none"/>
      <path id="Path_84" data-name="Path 84" d="M359.947,80.816V94.07h-3.9V81.5c0-3.1-1.976-5.275-4.8-5.275-3.142,0-5.758,2.215-5.758,4.913V94.07H341.54V67.52h3.946v8.825a7.771,7.771,0,0,1,6.644-3.585c4.593,0,7.816,3.346,7.816,8.055Z" transform="translate(-99.19 -11.706)" fill="none"/>
      <path id="Path_85" data-name="Path 85" d="M395.659,69.652v7.9H411.9v3.789H395.659v8.423H411.9v3.789H391.55V65.87H411.9v3.789H395.659Z" transform="translate(-115.119 -11.18)" fill="none"/>
      <path id="Path_86" data-name="Path 86" d="M446.433,83.265V96.52h-3.9V83.946c0-3.1-1.976-5.275-4.8-5.275s-5.4,1.895-5.724,4.355v13.5H428.02V75.694h3.987v3.019a7.767,7.767,0,0,1,6.61-3.5C443.21,75.21,446.433,78.556,446.433,83.265Z" transform="translate(-126.736 -14.155)" fill="none"/>
      <path id="Path_87" data-name="Path 87" d="M476.642,91.2l2.5,2.576C477.289,95.756,473.664,97,470.72,97A10.7,10.7,0,0,1,460,86.045c0-6.406,4.634-10.835,10.392-10.835,6.365,0,10.031,4.832,10.031,12.287h-16.4a6.617,6.617,0,0,0,6.644,5.963,9.108,9.108,0,0,0,5.963-2.256Zm-12.566-6.89h12.491c-.443-3.223-2.419-5.561-6-5.561A6.524,6.524,0,0,0,464.075,84.314Z" transform="translate(-136.922 -14.155)" fill="none"/>
      <path id="Path_88" data-name="Path 88" d="M506.431,75.737V79.2c-4.314,0-7.374,2.378-7.735,6V97.046H494.71V76.214H498.7V80.2a8.241,8.241,0,0,1,7.735-4.47Z" transform="translate(-147.979 -14.321)" fill="none"/>
      <path id="Path_89" data-name="Path 89" d="M534.516,76.58V95.191c0,5.356-4.389,9.145-10.556,9.145a14.183,14.183,0,0,1-8.7-2.78l1.574-2.978a9.742,9.742,0,0,0,6.529,2.3c4.47,0,7.169-2.133,7.169-5.758V92.1a8.71,8.71,0,0,1-7.374,3.789c-5.479,0-9.466-4.109-9.466-9.909s3.987-9.868,9.466-9.868a8.747,8.747,0,0,1,7.374,3.83V76.594h3.987Zm-3.987,9.391a6.345,6.345,0,1,0-6.365,6.447A6.145,6.145,0,0,0,530.529,85.971Z" transform="translate(-154.024 -14.442)" fill="none"/>
      <path id="Path_90" data-name="Path 90" d="M550.058,104l.886-3.06a5.392,5.392,0,0,0,2.535.647,2.922,2.922,0,0,0,2.862-1.608l1.049-2.215L548.45,76.82h4.273l6.685,16.437,6.324-16.437h4.15L560.7,99.54c-1.492,3.748-3.707,5.315-6.685,5.356a8.848,8.848,0,0,1-3.946-.886Z" transform="translate(-165.096 -14.668)" fill="none"/>
      <path id="Path_91" data-name="Path 91" d="M591.578,72.118l1.431,2.038h-.947l-1.37-1.956H589.4v1.956h-.825V68.54h2.365a1.914,1.914,0,0,1,2.085,1.833,1.807,1.807,0,0,1-1.438,1.751Zm-2.181-.681h1.424c.811,0,1.356-.4,1.356-1.063s-.545-1.063-1.356-1.063H589.4v2.126Z" transform="translate(-177.879 -12.031)" fill="none"/>
      <path id="Path_92" data-name="Path 92" d="M589.233,75.336a4.743,4.743,0,1,1,4.743-4.743A4.746,4.746,0,0,1,589.233,75.336Zm0-8.8a4.062,4.062,0,1,0,4.062,4.062A4.063,4.063,0,0,0,589.233,66.531Z" transform="translate(-176.576 -11.174)" fill="none"/>
    </g>
  </g>
</svg></a>				</div>

				<div class="g-col-12 g-col-lg-6 g-col-xl-5 g-start-xl-8 mt-auto strapline">
											<small>Every day, Growth Energy members are expanding America’s bioeconomy  by inspiring new ways to create more with less.</small>
									</div>

			</div>
		</div>

		<div id="mid-footer">

			<div class="grid">

					<aside class="footer-widget-area-1">
		<div id="nav_menu-2" class="widget widget_nav_menu"><h5 class="widget__title">Policy Priorities</h5><div class="menu-policy-priorities-container"><ul id="menu-policy-priorities" class="list-unstyled"><li id="menu-item-16142" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-16142"><a href="https://growthenergy.org/policy-priorities/" class="link-muted">Overview</a></li>
<li id="menu-item-16070" class="menu-item menu-item-type-post_type menu-item-object-policy-priority menu-item-16070"><a href="https://growthenergy.org/policy-priority/e15-and-higher-ethanol-blends/" class="link-muted">Lower-Cost, Lower-Emissions Bioethanol</a></li>
<li id="menu-item-16065" class="menu-item menu-item-type-post_type menu-item-object-policy-priority menu-item-16065"><a href="https://growthenergy.org/policy-priority/clean-fuel-tax-incentives/" class="link-muted">Clean Fuel Tax Incentives</a></li>
<li id="menu-item-16071" class="menu-item menu-item-type-post_type menu-item-object-policy-priority menu-item-16071"><a href="https://growthenergy.org/policy-priority/the-renewable-fuel-standard/" class="link-muted">The Renewable Fuel Standard</a></li>
<li id="menu-item-16069" class="menu-item menu-item-type-post_type menu-item-object-policy-priority menu-item-16069"><a href="https://growthenergy.org/policy-priority/aviation-maritime-fuel/" class="link-muted">Aviation and Maritime Fuel</a></li>
<li id="menu-item-16064" class="menu-item menu-item-type-post_type menu-item-object-policy-priority menu-item-16064"><a href="https://growthenergy.org/policy-priority/carbon-capture-technology/" class="link-muted">Carbon Capture Technology</a></li>
<li id="menu-item-16063" class="menu-item menu-item-type-post_type menu-item-object-policy-priority menu-item-16063"><a href="https://growthenergy.org/policy-priority/climate-smart-agriculture/" class="link-muted">Carbon-Reducing Farm Practices</a></li>
<li id="menu-item-16067" class="menu-item menu-item-type-post_type menu-item-object-policy-priority menu-item-16067"><a href="https://growthenergy.org/policy-priority/vehicle-emissions-standards/" class="link-muted">Vehicle Emissions Standards</a></li>
<li id="menu-item-16060" class="menu-item menu-item-type-post_type menu-item-object-policy-priority menu-item-16060"><a href="https://growthenergy.org/policy-priority/low-carbon-fuel-standards/" class="link-muted">Low Carbon Fuel Standards</a></li>
<li id="menu-item-16068" class="menu-item menu-item-type-post_type menu-item-object-policy-priority menu-item-16068"><a href="https://growthenergy.org/policy-priority/global-marketplace/" class="link-muted">Global Marketplace</a></li>
<li id="menu-item-16059" class="menu-item menu-item-type-post_type menu-item-object-policy-priority menu-item-16059"><a href="https://growthenergy.org/policy-priority/transport-and-logistics/" class="link-muted">Transport and Logistics</a></li>
</ul></div></div>	</aside>
	
					<aside class="footer-widget-area-2">
		<div id="nav_menu-3" class="widget widget_nav_menu"><h5 class="widget__title">Value of Biofuels</h5><div class="menu-value-of-biofuels-container"><ul id="menu-value-of-biofuels" class="list-unstyled"><li id="menu-item-16141" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-16141"><a href="https://growthenergy.org/value-of-biofuels/" class="link-muted">Overview</a></li>
<li id="menu-item-16073" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-16073"><a href="https://growthenergy.org/value-of-biofuels/value-at-the-pump/" class="link-muted">Value at the Pump</a></li>
<li id="menu-item-16139" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-16139"><a href="https://growthenergy.org/value-of-biofuels/value-for-the-rural-community/" class="link-muted">Value for the Rural Community</a></li>
<li id="menu-item-16138" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-16138"><a href="https://growthenergy.org/value-of-biofuels/value-for-the-environment/" class="link-muted">Value for the Environment</a></li>
</ul></div></div>	</aside>
	
					<aside class="footer-widget-area-3">
		<div id="nav_menu-6" class="widget widget_nav_menu"><h5 class="widget__title">Resources</h5><div class="menu-resources-container"><ul id="menu-resources" class="list-unstyled"><li id="menu-item-16650" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-16650"><a href="https://growthenergy.org/resources/" class="link-muted">Overview</a></li>
<li id="menu-item-16649" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-16649"><a href="https://growthenergy.org/indices-data-trends/" class="link-muted">Indices, Data &#038; Trends</a></li>
<li id="menu-item-16156" class="menu-item menu-item-type-taxonomy menu-item-object-category current-post-ancestor menu-item-16156"><a href="https://growthenergy.org/category/news/" class="link-muted">News</a></li>
<li id="menu-item-16651" class="menu-item menu-item-type-taxonomy menu-item-object-category menu-item-16651"><a href="https://growthenergy.org/category/comments-testimony-letters/" class="link-muted">Comments, Testimony &amp; Letters</a></li>
<li id="menu-item-16652" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-16652"><a href="https://growthenergy.org/retailer-supplier-hub/" class="link-muted">Retailer &#038; Supplier Hub</a></li>
<li id="menu-item-16653" class="menu-item menu-item-type-taxonomy menu-item-object-category menu-item-16653"><a href="https://growthenergy.org/category/research-fact-sheets/" class="link-muted">Research &amp; Fact Sheets</a></li>
<li id="menu-item-16654" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-16654"><a href="https://growthenergy.org/value-of-biofuels/value-at-the-pump/biofuel-basics/" class="link-muted">Biofuel Basics</a></li>
</ul></div></div>	</aside>
	
					<aside class="footer-widget-area-4">
		<div id="nav_menu-4" class="widget widget_nav_menu"><h5 class="widget__title">About Us</h5><div class="menu-about-us-container"><ul id="menu-about-us" class="list-unstyled"><li id="menu-item-16143" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-16143"><a href="https://growthenergy.org/about-us/" class="link-muted">Overview</a></li>
<li id="menu-item-16147" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-16147"><a href="https://growthenergy.org/about-us/our-leadership-staff/" class="link-muted">Our Leadership &#038; Staff</a></li>
<li id="menu-item-16148" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-16148"><a href="https://growthenergy.org/about-us/our-members/" class="link-muted">Our Members</a></li>
<li id="menu-item-16146" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-16146"><a href="https://growthenergy.org/about-us/growth-energy-membership-events/" class="link-muted">Membership &#038; Events</a></li>
<li id="menu-item-19019" class="menu-item menu-item-type-post_type menu-item-object-annual-report menu-item-19019"><a href="https://growthenergy.org/annual-report/annual-report-2024/" class="link-muted">Annual Report</a></li>
<li id="menu-item-16144" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-16144"><a href="https://growthenergy.org/about-us/careers/" class="link-muted">Careers</a></li>
<li id="menu-item-16145" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-16145"><a href="https://growthenergy.org/about-us/contact/" class="link-muted">Contact</a></li>
</ul></div></div>	</aside>
	
					<aside class="footer-widget-area-5">
		<div id="nav_menu-5" class="widget widget_nav_menu"><h5 class="widget__title">Our Network</h5><div class="menu-our-network-container"><ul id="menu-our-network" class="list-unstyled"><li id="menu-item-16150" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-16150"><a href="https://growthenergy.org/our-network/" class="link-muted">Overview</a></li>
<li id="menu-item-16154" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-16154"><a href="https://growthenergy.org/our-network/our-members/" class="link-muted">Our Members</a></li>
<li id="menu-item-16151" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-16151"><a href="https://growthenergy.org/our-network/becoming-a-member/" class="link-muted">Becoming a Member</a></li>
<li id="menu-item-16152" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-16152"><a href="https://growthenergy.org/our-network/events/" class="link-muted">Events</a></li>
<li id="menu-item-16153" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-16153"><a href="https://growthenergy.org/our-network/growth-energy-pac/" class="link-muted">Growth Energy PAC</a></li>
<li id="menu-item-16155" class="menu-item menu-item-type-custom menu-item-object-custom menu-item-16155"><a href="#" class="link-muted">Member Portal</a></li>
</ul></div></div>	</aside>
	
			</div>

			<div class="footer-navigation-toggle-wrap d-none d-lg-block">
				<button class="btn btn-blank collapsed" data-wsk-toggle="footer-navigation" role="button">
					<span class="collapse-toggle__icon"></span>
				</button>
			</div>

		</div>

		<div id="sub-footer" class="pt-6">
			<div class="grid">

				<div class="g-col-12 g-col-lg-6">

					<div class="contact-details">
						<div class="contact-details contact-details--address">1401 Eye Street, NW, Suite 1220,<br /> Washington, DC 20005</div>						<span class="contact-details__separator">—</span>
						<div class="contact-details contact-details--phone-number"><a href="tel:(202) 545-4000" class="link-muted">(202) 545-4000</a></div>					</div>

					<div class="compliance">
													<span class="copyright-details">&copy;2026 Growth Energy</span>
						
						<ul id="menu-footer-sub-menu" class="list-inline"><li id="menu-item-16604" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-privacy-policy menu-item-16604"><a rel="privacy-policy" href="https://growthenergy.org/privacy-policy/" class="link-muted">Privacy Policy</a></li>
<li id="menu-item-16894" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-16894"><a href="https://growthenergy.org/terms-and-conditions/" class="link-muted">Terms and Conditions</a></li>
</ul>					</div>

				</div>

				<div class="g-col-12 g-col-lg-6">

											<div class="social-network-buttons"><div class="btn-group btn-group-horizontal" role="group"><a href="https://twitter.com/growthenergy/" target="_blank" title="X" class="btn btn-icon-only btn-icon-only--filled"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24" width="24" class="icon"><path d="M18.2048 2.25H21.5128L14.2858 10.51L22.7878 21.75H16.1308L10.9168 14.933L4.95084 21.75H1.64084L9.37084 12.915L1.21484 2.25H8.04084L12.7538 8.481L18.2048 2.25ZM17.0438 19.77H18.8768L7.04484 4.126H5.07784L17.0438 19.77Z"/></svg></a><a href="https://www.linkedin.com/company/growthenergy/" target="_blank" title="LinkedIn" class="btn btn-icon-only btn-icon-only--filled"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24" width="24" class="icon"><path d="M6.94048 4.99993C6.94011 5.81424 6.44608 6.54702 5.69134 6.85273C4.9366 7.15845 4.07187 6.97605 3.5049 6.39155C2.93793 5.80704 2.78195 4.93715 3.1105 4.19207C3.43906 3.44699 4.18654 2.9755 5.00048 2.99993C6.08155 3.03238 6.94097 3.91837 6.94048 4.99993ZM7.00048 8.47993H3.00048V20.9999H7.00048V8.47993ZM13.3205 8.47993H9.34048V20.9999H13.2805V14.4299C13.2805 10.7699 18.0505 10.4299 18.0505 14.4299V20.9999H22.0005V13.0699C22.0005 6.89993 14.9405 7.12993 13.2805 10.1599L13.3205 8.47993Z"/></svg></a><a href="https://www.facebook.com/GrowthEnergy/" target="_blank" title="Facebook" class="btn btn-icon-only btn-icon-only--filled"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24" width="24" class="icon"><path d="M14 13.5H16.5L17.5 9.5H14V7.5C14 6.47062 14 5.5 16 5.5H17.5V2.1401C17.1743 2.09685 15.943 2 14.6429 2C11.9284 2 10 3.65686 10 6.69971V9.5H7V13.5H10V22H14V13.5Z"/></svg></a><a href="https://www.instagram.com/growthenergy/" target="_blank" title="Instagram" class="btn btn-icon-only btn-icon-only--filled"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24" width="24" class="icon"><path d="M12.001 9C10.3436 9 9.00098 10.3431 9.00098 12C9.00098 13.6573 10.3441 15 12.001 15C13.6583 15 15.001 13.6569 15.001 12C15.001 10.3427 13.6579 9 12.001 9ZM12.001 7C14.7614 7 17.001 9.2371 17.001 12C17.001 14.7605 14.7639 17 12.001 17C9.24051 17 7.00098 14.7629 7.00098 12C7.00098 9.23953 9.23808 7 12.001 7ZM18.501 6.74915C18.501 7.43926 17.9402 7.99917 17.251 7.99917C16.5609 7.99917 16.001 7.4384 16.001 6.74915C16.001 6.0599 16.5617 5.5 17.251 5.5C17.9393 5.49913 18.501 6.0599 18.501 6.74915ZM12.001 4C9.5265 4 9.12318 4.00655 7.97227 4.0578C7.18815 4.09461 6.66253 4.20007 6.17416 4.38967C5.74016 4.55799 5.42709 4.75898 5.09352 5.09255C4.75867 5.4274 4.55804 5.73963 4.3904 6.17383C4.20036 6.66332 4.09493 7.18811 4.05878 7.97115C4.00703 9.0752 4.00098 9.46105 4.00098 12C4.00098 14.4745 4.00753 14.8778 4.05877 16.0286C4.0956 16.8124 4.2012 17.3388 4.39034 17.826C4.5591 18.2606 4.7605 18.5744 5.09246 18.9064C5.42863 19.2421 5.74179 19.4434 6.17187 19.6094C6.66619 19.8005 7.19148 19.9061 7.97212 19.9422C9.07618 19.9939 9.46203 20 12.001 20C14.4755 20 14.8788 19.9934 16.0296 19.9422C16.8117 19.9055 17.3385 19.7996 17.827 19.6106C18.2604 19.4423 18.5752 19.2402 18.9074 18.9085C19.2436 18.5718 19.4445 18.2594 19.6107 17.8283C19.8013 17.3358 19.9071 16.8098 19.9432 16.0289C19.9949 14.9248 20.001 14.5389 20.001 12C20.001 9.52552 19.9944 9.12221 19.9432 7.97137C19.9064 7.18906 19.8005 6.66149 19.6113 6.17318C19.4434 5.74038 19.2417 5.42635 18.9084 5.09255C18.573 4.75715 18.2616 4.55693 17.8271 4.38942C17.338 4.19954 16.8124 4.09396 16.0298 4.05781C14.9258 4.00605 14.5399 4 12.001 4ZM12.001 2C14.7176 2 15.0568 2.01 16.1235 2.06C17.1876 2.10917 17.9135 2.2775 18.551 2.525C19.2101 2.77917 19.7668 3.1225 20.3226 3.67833C20.8776 4.23417 21.221 4.7925 21.476 5.45C21.7226 6.08667 21.891 6.81333 21.941 7.8775C21.9885 8.94417 22.001 9.28333 22.001 12C22.001 14.7167 21.991 15.0558 21.941 16.1225C21.8918 17.1867 21.7226 17.9125 21.476 18.55C21.2218 19.2092 20.8776 19.7658 20.3226 20.3217C19.7668 20.8767 19.2076 21.22 18.551 21.475C17.9135 21.7217 17.1876 21.89 16.1235 21.94C15.0568 21.9875 14.7176 22 12.001 22C9.28431 22 8.94514 21.99 7.87848 21.94C6.81431 21.8908 6.08931 21.7217 5.45098 21.475C4.79264 21.2208 4.23514 20.8767 3.67931 20.3217C3.12348 19.7658 2.78098 19.2067 2.52598 18.55C2.27848 17.9125 2.11098 17.1867 2.06098 16.1225C2.01348 15.0558 2.00098 14.7167 2.00098 12C2.00098 9.28333 2.01098 8.94417 2.06098 7.8775C2.11014 6.8125 2.27848 6.0875 2.52598 5.45C2.78014 4.79167 3.12348 4.23417 3.67931 3.67833C4.23514 3.1225 4.79348 2.78 5.45098 2.525C6.08848 2.2775 6.81348 2.11 7.87848 2.06C8.94514 2.0125 9.28431 2 12.001 2Z"/></svg></a><a href="https://www.youtube.com/@growthenergy/" target="_blank" title="YouTube" class="btn btn-icon-only btn-icon-only--filled"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24" width="24" class="icon"><path d="M12.2439 4C12.778 4.00294 14.1143 4.01586 15.5341 4.07273L16.0375 4.09468C17.467 4.16236 18.8953 4.27798 19.6037 4.4755C20.5486 4.74095 21.2913 5.5155 21.5423 6.49732C21.942 8.05641 21.992 11.0994 21.9982 11.8358L21.9991 11.9884L21.9991 11.9991C21.9991 11.9991 21.9991 12.0028 21.9991 12.0099L21.9982 12.1625C21.992 12.8989 21.942 15.9419 21.5423 17.501C21.2878 18.4864 20.5451 19.261 19.6037 19.5228C18.8953 19.7203 17.467 19.8359 16.0375 19.9036L15.5341 19.9255C14.1143 19.9824 12.778 19.9953 12.2439 19.9983L12.0095 19.9991L11.9991 19.9991C11.9991 19.9991 11.9956 19.9991 11.9887 19.9991L11.7545 19.9983C10.6241 19.9921 5.89772 19.941 4.39451 19.5228C3.4496 19.2573 2.70692 18.4828 2.45587 17.501C2.0562 15.9419 2.00624 12.8989 2 12.1625V11.8358C2.00624 11.0994 2.0562 8.05641 2.45587 6.49732C2.7104 5.51186 3.45308 4.73732 4.39451 4.4755C5.89772 4.05723 10.6241 4.00622 11.7545 4H12.2439ZM9.99911 8.49914V15.4991L15.9991 11.9991L9.99911 8.49914Z"/></svg></a></div></div>					
				</div>

			</div>
		</div>

	</div>

</footer>


		</div><!-- .site -->

		<script type="speculationrules">
{"prefetch":[{"source":"document","where":{"and":[{"href_matches":"/*"},{"not":{"href_matches":["/wp-*.php","/wp-admin/*","/wp-content/uploads/*","/wp-content/*","/wp-content/plugins/*","/wp-content/themes/wsk-theme/*","/*\\\\?(.+)"]}},{"not":{"selector_matches":"a[rel~=\\"nofollow\\"]"}},{"not":{"selector_matches":".no-prefetch, .no-prefetch a"}}]},"eagerness":"conservative"}]}
</script>

	<div id="bookmarksOffcanvas" class="offcanvas offcanvas-end" tabindex="-1" aria-labelledby="bookmarksOffcanvasLabel">
		<div class="offcanvas-header">
			<h5 id="bookmarksOffcanvasLabel" class="offcanvas-title">My Resources (0)</h5>
			<button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close">
				Close			</button>
		</div>

		<div class="offcanvas-body">
			No bookmarks found.		</div>
	</div>

	
	<div id="login-registration-modal" class="modal fade tint colour-scheme"  tabindex="-1" role="dialog" aria-hidden="true">
		<div class="modal-dialog" role="document">
			<div class="modal-content">

				<div class="modal-header">
					<button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">Close</button>
				</div>

				<div class="modal-body">
									
	<div class="login-registration-form">

		<div class="login-registration-form__form" data-form="login" aria-expanded="true">
			
	<div class="form__intro">
		<h2>Welcome back</h2>
		<p>To the nation&#039;s largest association of ethanol producers and supporters.</p>
	</div>

	<ul class="nav nav-pills mb-6" id="pills-tab" role="tablist">
		<li class="nav-item" role="presentation">
			<button class="nav-link active" id="standard-login-tab" data-bs-toggle="pill" data-bs-target="#standard-login" type="button" role="tab" aria-controls="standard-login" aria-selected="true">Sign in with Password</button>
		</li>
		<li class="nav-item" role="presentation">
			<button class="nav-link" id="passwordless-login-tab" data-bs-toggle="pill" data-bs-target="#passwordless-login" type="button" role="tab" aria-controls="passwordless-login" aria-selected="false">Sign in with Email Link</button>
		</li>
	</ul>
	<div class="tab-content" id="pills-tabContent">
		<div class="tab-pane fade show active" id="standard-login" role="tabpanel" aria-labelledby="standard-login-tab" tabindex="0">
			<form id="login" action="login" method="post">
				<div class="form__body">
					<div class="form-field">
						<label for="username" class="form-label">
							Username						</label>

						<div class="form-control-container">
							<input id="username" class="form-control" name="username" placeholder="Enter your username" type="text" />
						</div>
					</div>

					<div class="form-field">
						<label for="password" class="form-label">
							Password						</label>

						<div class="form-control-container">
							<input id="password" class="form-control" name="password" placeholder="Enter your password" type="password" />

							<a href="https://growthenergy.org/wp-login.php?action=lostpassword" class="form-text">
								Forgotten password?							</a>
						</div>
					</div>

					<input type="hidden" id="security" name="security" value="0944a9575b" /><input type="hidden" name="_wp_http_referer" value="/2025/09/16/2025-staff-award-winners/" />				</div>

				<div class="form__footer">
					<button class="btn btn-outline" type="submit">
						Log in					</button>
				</div>
				
			</form>
		</div>
		<div class="tab-pane fade" id="passwordless-login" role="tabpanel" aria-labelledby="passwordless-login-tab" tabindex="0">
					<div id="magic-login-shortcode">
			<div class="magic-login-form-header">
				<p class="message">Please enter your username or email address. You will receive an email message to log in.</p>
			</div>
							<form name="magicloginform"
					  class="magic-login-inline-login-form "
					  id="magicloginform"
					  action=""
					  method="post"
					  autocomplete="off"
					  data-ajax-url="https://growthenergy.org/wp-admin/admin-ajax.php"
					  data-ajax-spinner="https://growthenergy.org/wp-admin/images/spinner.gif"
					  data-ajax-sending-msg="Sending..."
					  data-spam-protection-msg="Please verify that you are not a robot."
				>
											<label for="user_login">Username or Email Address</label>
										<input type="text" name="log" id="user_login" class="input" value="" size="20" autocapitalize="off" autocomplete="username" required />
					

											<input type="hidden" name="redirect_to" value="https://growthenergy.org/2025/09/16/2025-staff-award-winners" />
										<input type="hidden" name="testcookie" value="1" />

					
					<input type="submit" name="wp-submit" id="wp-submit" class="magic-login-submit button button-primary button-large " value="Send me the link" />
				</form>
					</div>
				</div>
	</div>



	
			<div class="login-registration-form__actions">
				Not a member?
				<button class="btn btn-link" data-wsk-toggle="login-registration-form" data-toggle-target="registration" type="button">
					Create an account				</button>
			</div>
		</div>

		<div class="login-registration-form__form" data-form="registration" aria-expanded="false">
			
                <div class='gf_browser_chrome gform_wrapper gravity-theme gform-theme--no-framework' data-form-theme='gravity-theme' data-form-index='0' id='gform_wrapper_1' >
                        <div class='gform_heading'>
                            <h2 class="gform_title">New Account Creation</h2>
                            <p class='gform_description'></p>
                        </div><form method='post' enctype='multipart/form-data' target='gform_ajax_frame_1' id='gform_1'  action='/2025/09/16/2025-staff-award-winners/' data-formid='1' novalidate><div class='gf_invisible ginput_recaptchav3' data-sitekey='6LdAwL8qAAAAAMjdFEaiyqzzlWbLVZM2hTji_UsI' data-tabindex='0'><input id="input_9e4ac593f2b5cde8e633ad1c4ff5c880" class="gfield_recaptcha_response" type="hidden" name="input_9e4ac593f2b5cde8e633ad1c4ff5c880" value=""/></div>
                        <div class='gform-body gform_body'><div id='gform_fields_1' class='gform_fields top_label form_sublabel_below description_below validation_below'><div id="field_1_8" class="gfield gfield--type-honeypot gform_validation_container field_sublabel_below gfield--has-description field_description_below field_validation_below gfield_visibility_visible"  ><label class="gfield_label gform-field-label form-label" for="input_1_8">LinkedIn</label><div class="ginput_container"><input name="input_8" id="input_1_8" type="text" value="" autocomplete="new-password"></div><div class="gfield_description" id="gfield_description_1_8">This field is for validation purposes and should be left unchanged.</div></div><div id="field_1_4" class="gfield gfield--type-text gfield--width-full field_sublabel_below gfield--no-description field_description_below field_validation_below gfield_visibility_visible"  ><label class="gfield_label gform-field-label form-label" for="input_1_4">Company Name</label><div class="ginput_container ginput_container_text"><input name="input_4" id="input_1_4" type="text" value="" class="form-control-default form-control" placeholder="Enter your company name" aria-invalid="false"></div></div><div id="field_1_1" class="gfield gfield--type-text field_sublabel_below gfield--no-description field_description_below field_validation_below gfield_visibility_visible"  ><label class="gfield_label gform-field-label form-label" for="input_1_1">First Name</label><div class="ginput_container ginput_container_text"><input name="input_1" id="input_1_1" type="text" value="" class="form-control-default form-control" placeholder="Enter your first name" aria-invalid="false"></div></div><div id="field_1_6" class="gfield gfield--type-text gfield--width-full field_sublabel_below gfield--no-description field_description_below field_validation_below gfield_visibility_visible"  ><label class="gfield_label gform-field-label form-label" for="input_1_6">Last Name</label><div class="ginput_container ginput_container_text"><input name="input_6" id="input_1_6" type="text" value="" class="form-control-default form-control" placeholder="Enter your Last Name" aria-invalid="false"></div></div><div id="field_1_3" class="gfield gfield--type-email field_sublabel_below gfield--no-description field_description_below field_validation_below gfield_visibility_visible"  ><label class="gfield_label gform-field-label form-label" for="input_1_3">Email</label><div class="ginput_container ginput_container_email">
                            <input name="input_3" id="input_1_3" type="email" value="" class="form-control-default form-control" placeholder="Enter your email" aria-invalid="false">
                        </div></div><fieldset id="field_1_7" class="gfield gfield--type-password gfield--width-full field_sublabel_above gfield--no-description field_description_below hidden_label field_validation_below gfield_visibility_visible"  ><legend class="gfield_label gform-field-label gfield_label_before_complex">Password</legend><div class="ginput_complex ginput_container ginput_container_password gform-grid-row" id="input_1_7_container">
						<span id="input_1_7_1_container" class="ginput_password ginput_left gform-grid-col gform-grid-col--size-auto">
							<label for="input_1_7" class="gform-field-label gform-field-label--type-sub form-label">Enter Password</label>
							<span class="password_input_container">
							<input type="password" name="input_7" id="input_1_7" value="" placeholder="Your password" aria-invalid="false" class="form-control">
							
							</span>
						</span>
						<span id="input_1_7_2_container" class="ginput_password ginput_right gform-grid-col gform-grid-col--size-auto">
							<label for="input_1_7_2" class="gform-field-label gform-field-label--type-sub form-label">Confirm Password</label>
							<span class="password_input_container">
							<input type="password" name="input_7_2" id="input_1_7_2" value="" placeholder="Confirm your password" aria-invalid="false" class="form-control">
							
							</span>
						</span>
						<div class="gf_clear gf_clear_complex"></div>
					</div></fieldset></div></div>
        <div class='gform-footer gform_footer top_label'> <button type="submit" id="gform_submit_button_1" class="gform_btn btn-primary btn-block btn btn-primary btn-block" onclick="gform.submission.handleButtonClick(this);" data-submission-type="submit">Create account</button> <html><body></body></html>
<input type='hidden' name='gform_ajax' value='form_id=1&amp;title=1&amp;description=1&amp;tabindex=0&amp;theme=gravity-theme&amp;hash=1e993cc193748f148a8b151d80e3d47f' />
            <input type='hidden' class='gform_hidden' name='gform_submission_method' data-js='gform_submission_method_1' value='iframe' />
            <input type='hidden' class='gform_hidden' name='gform_theme' data-js='gform_theme_1' id='gform_theme_1' value='gravity-theme' />
            <input type='hidden' class='gform_hidden' name='gform_style_settings' data-js='gform_style_settings_1' id='gform_style_settings_1' value='' />
            <input type='hidden' class='gform_hidden' name='is_submit_1' value='1' />
            <input type='hidden' class='gform_hidden' name='gform_submit' value='1' />
            
            <input type='hidden' class='gform_hidden' name='gform_currency' data-currency='USD' value='1kkTruIoGxpyng0IR8QrDMN4qt5ZFY08+Yszn0rPUmc51AMFpj7jT+FMVFUJQjtl5NG8XyfKJK0HsJC19S9zaHKkJT7Wpn6z/KN8w3vRsftgfA0=' />
            <input type='hidden' class='gform_hidden' name='gform_unique_id' value='' />
            <input type='hidden' class='gform_hidden' name='state_1' value='WyJbXSIsIjIwMGM4ZjEyNWJkZjY2YmQ1MmY2ODhmMmRhODk1YTc3Il0=' />
            <input type='hidden' autocomplete='off' class='gform_hidden' name='gform_target_page_number_1' id='gform_target_page_number_1' value='0' />
            <input type='hidden' autocomplete='off' class='gform_hidden' name='gform_source_page_number_1' id='gform_source_page_number_1' value='1' />
            <input type='hidden' name='gform_field_values' value='' />
            
        </div>
                        </form>
                        </div>
		                <iframe style='display:none;width:0px;height:0px;' src='about:blank' name='gform_ajax_frame_1' id='gform_ajax_frame_1' title='This iframe contains the logic required to handle Ajax powered Gravity Forms.'></iframe>
		                <script>
gform.initializeOnLoaded( function() {gformInitSpinner( 1, 'https://growthenergy.org/wp-content/plugins/gravityforms/images/spinner.svg', true );jQuery('#gform_ajax_frame_1').on('load',function(){var contents = jQuery(this).contents().find('*').html();var is_postback = contents.indexOf('GF_AJAX_POSTBACK') >= 0;if(!is_postback){return;}var form_content = jQuery(this).contents().find('#gform_wrapper_1');var is_confirmation = jQuery(this).contents().find('#gform_confirmation_wrapper_1').length > 0;var is_redirect = contents.indexOf('gformRedirect(){') >= 0;var is_form = form_content.length > 0 && ! is_redirect && ! is_confirmation;var mt = parseInt(jQuery('html').css('margin-top'), 10) + parseInt(jQuery('body').css('margin-top'), 10) + 100;if(is_form){jQuery('#gform_wrapper_1').html(form_content.html());if(form_content.hasClass('gform_validation_error')){jQuery('#gform_wrapper_1').addClass('gform_validation_error');} else {jQuery('#gform_wrapper_1').removeClass('gform_validation_error');}setTimeout( function() { /* delay the scroll by 50 milliseconds to fix a bug in chrome */  }, 50 );if(window['gformInitDatepicker']) {gformInitDatepicker();}if(window['gformInitPriceFields']) {gformInitPriceFields();}var current_page = jQuery('#gform_source_page_number_1').val();gformInitSpinner( 1, 'https://growthenergy.org/wp-content/plugins/gravityforms/images/spinner.svg', true );jQuery(document).trigger('gform_page_loaded', [1, current_page]);window['gf_submitting_1'] = false;}else if(!is_redirect){var confirmation_content = jQuery(this).contents().find('.GF_AJAX_POSTBACK').html();if(!confirmation_content){confirmation_content = contents;}jQuery('#gform_wrapper_1').replaceWith(confirmation_content);jQuery(document).trigger('gform_confirmation_loaded', [1]);window['gf_submitting_1'] = false;wp.a11y.speak(jQuery('#gform_confirmation_message_1').text());}else{jQuery('#gform_1').append(contents);if(window['gformRedirect']) {gformRedirect();}}jQuery(document).trigger("gform_pre_post_render", [{ formId: "1", currentPage: "current_page", abort: function() { this.preventDefault(); } }]);        if (event && event.defaultPrevented) {                return;        }        const gformWrapperDiv = document.getElementById( "gform_wrapper_1" );        if ( gformWrapperDiv ) {            const visibilitySpan = document.createElement( "span" );            visibilitySpan.id = "gform_visibility_test_1";            gformWrapperDiv.insertAdjacentElement( "afterend", visibilitySpan );        }        const visibilityTestDiv = document.getElementById( "gform_visibility_test_1" );        let postRenderFired = false;        function triggerPostRender() {            if ( postRenderFired ) {                return;            }            postRenderFired = true;            gform.core.triggerPostRenderEvents( 1, current_page );            if ( visibilityTestDiv ) {                visibilityTestDiv.parentNode.removeChild( visibilityTestDiv );            }        }        function debounce( func, wait, immediate ) {            var timeout;            return function() {                var context = this, args = arguments;                var later = function() {                    timeout = null;                    if ( !immediate ) func.apply( context, args );                };                var callNow = immediate && !timeout;                clearTimeout( timeout );                timeout = setTimeout( later, wait );                if ( callNow ) func.apply( context, args );            };        }        const debouncedTriggerPostRender = debounce( function() {            triggerPostRender();        }, 200 );        if ( visibilityTestDiv && visibilityTestDiv.offsetParent === null ) {            const observer = new MutationObserver( ( mutations ) => {                mutations.forEach( ( mutation ) => {                    if ( mutation.type === 'attributes' && visibilityTestDiv.offsetParent !== null ) {                        debouncedTriggerPostRender();                        observer.disconnect();                    }                });            });            observer.observe( document.body, {                attributes: true,                childList: false,                subtree: true,                attributeFilter: [ 'style', 'class' ],            });        } else {            triggerPostRender();        }    } );} );
</script>

			<div class="login-registration-form__actions">
				Already a member?
				<button class="btn btn-link" data-wsk-toggle="login-registration-form" data-toggle-target="login" type="button">
					Log in				</button>
			</div>
		</div>

	</div>

									</div>

			</div>
		</div>
	</div>

	
	<div id="member-application-modal" class="modal fade colour-scheme" tabindex="-1" role="dialog" aria-hidden="true">
		<div class="modal-dialog" role="document">
			<div class="modal-content">

				<div class="modal-header">
					<button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">Close</button>
				</div>

				<div class="modal-body">
					
                <div class='gf_browser_chrome gform_wrapper gravity-theme gform-theme--no-framework' data-form-theme='gravity-theme' data-form-index='0' id='gform_wrapper_2' ><form method='post' enctype='multipart/form-data' target='gform_ajax_frame_2' id='gform_2'  action='/2025/09/16/2025-staff-award-winners/' data-formid='2' novalidate><div class='gf_invisible ginput_recaptchav3' data-sitekey='6LdAwL8qAAAAAMjdFEaiyqzzlWbLVZM2hTji_UsI' data-tabindex='0'><input id="input_e2b319fd2e41264554e8d155ce5222e0" class="gfield_recaptcha_response" type="hidden" name="input_e2b319fd2e41264554e8d155ce5222e0" value=""/></div><div id='gf_page_steps_2' class='gf_page_steps'><div id='gf_step_2_1' class='gf_step gf_step_active gf_step_first'><span class='gf_step_number'>1</span><span class='gf_step_label'></span></div><div id='gf_step_2_2' class='gf_step gf_step_next gf_step_pending'><span class='gf_step_number'>2</span><span class='gf_step_label'></span></div><div id='gf_step_2_3' class='gf_step gf_step_pending'><span class='gf_step_number'>3</span><span class='gf_step_label'></span></div><div id='gf_step_2_4' class='gf_step gf_step_pending'><span class='gf_step_number'>4</span><span class='gf_step_label'></span></div><div id='gf_step_2_5' class='gf_step gf_step_last gf_step_pending'><span class='gf_step_number'>5</span><span class='gf_step_label'></span></div></div>
                        <div class='gform-body gform_body'><div id='gform_page_2_1' class='gform_page ' data-js='page-field-id-0' >
					<div class='gform_page_fields'><div id='gform_fields_2' class='gform_fields top_label form_sublabel_below description_below validation_below'><div id="field_2_19" class="gfield gfield--type-honeypot gform_validation_container field_sublabel_below gfield--has-description field_description_below field_validation_below gfield_visibility_visible"  ><label class="gfield_label gform-field-label form-label" for="input_2_19">Name</label><div class="ginput_container"><input name="input_19" id="input_2_19" type="text" value="" autocomplete="new-password"></div><div class="gfield_description" id="gfield_description_2_19">This field is for validation purposes and should be left unchanged.</div></div><fieldset id="field_2_1" class="gfield gfield--type-radio gfield--type-choice gfield--input-type-radio field_sublabel_below gfield--no-description field_description_below field_validation_below gfield_visibility_visible"  ><legend class="gfield_label gform-field-label">How do you contribute to the Bioeconomy?</legend><div class="ginput_container ginput_container_radio"><div class="gfield_radio" id="input_2_1">
			<div class="gchoice gchoice_2_1_0">
					<input class="gfield-choice-input form-check-input" name="input_1" type="radio" value="Ethanol production" id="choice_2_1_0" onchange="gformToggleRadioOther( this )">
					<label for="choice_2_1_0" id="label_2_1_0" class="gform-field-label gform-field-label--type-inline form-label form-check-label">Ethanol production</label>
			</div>
			<div class="gchoice gchoice_2_1_1">
					<input class="gfield-choice-input form-check-input" name="input_1" type="radio" value="Ethanol derivatives production" id="choice_2_1_1" onchange="gformToggleRadioOther( this )">
					<label for="choice_2_1_1" id="label_2_1_1" class="gform-field-label gform-field-label--type-inline form-label form-check-label">Ethanol derivatives production</label>
			</div>
			<div class="gchoice gchoice_2_1_2">
					<input class="gfield-choice-input form-check-input" name="input_1" type="radio" value="Distribution" id="choice_2_1_2" onchange="gformToggleRadioOther( this )">
					<label for="choice_2_1_2" id="label_2_1_2" class="gform-field-label gform-field-label--type-inline form-label form-check-label">Distribution</label>
			</div></div></div></fieldset><div id="field_2_4" class="gfield gfield--type-number gfield--input-type-number field_sublabel_below gfield--no-description field_description_below field_validation_below gfield_visibility_visible"  ><label class="gfield_label gform-field-label form-label" for="input_2_4">What is your annual turnover?</label><div class="ginput_container ginput_container_number"><input name="input_4" id="input_2_4" type="text" step="any" value="" class="form-control-default form-control" aria-invalid="false"></div></div><div id="field_2_5" class="gfield gfield--type-number gfield--input-type-number field_sublabel_below gfield--no-description field_description_below field_validation_below gfield_visibility_visible"  ><label class="gfield_label gform-field-label form-label" for="input_2_5">What is your employee headcount?</label><div class="ginput_container ginput_container_number"><input name="input_5" id="input_2_5" type="number" step="any" value="" class="form-control-default form-control" aria-invalid="false"></div></div></div>
                    </div>
                    <div class='gform-page-footer gform_page_footer top_label'>
                         <button type="button" id="gform_next_button_2_7" class="gform_next_btn btn-primary gform-theme-btn btn-primary btn btn-primary" onclick="gform.submission.handleButtonClick(this);" data-submission-type="next">Next</button> <html><body></body></html>

                    </div>
                </div>
                <div id='gform_page_2_2' class='gform_page' data-js='page-field-id-7' style='display:none;'>
                    <div class='gform_page_fields'>
                        <div id='gform_fields_2_2' class='gform_fields top_label form_sublabel_below description_below validation_below'><div id="field_2_6" class="gfield gfield--type-textarea gfield--input-type-textarea field_sublabel_below gfield--no-description field_description_below field_validation_below gfield_visibility_visible"  ><label class="gfield_label gform-field-label form-label" for="input_2_6">Free text field</label><div class="ginput_container ginput_container_textarea"><textarea name="input_6" id="input_2_6" class="textarea form-control-default form-control" aria-invalid="false" rows="10" cols="50"></textarea></div></div><fieldset id="field_2_15" class="gfield gfield--type-checkbox gfield--type-choice gfield--input-type-checkbox gfield--width-full field_sublabel_below gfield--no-description field_description_below field_validation_below gfield_visibility_visible"  ><legend class="gfield_label gform-field-label gfield_label_before_complex">Checkoxes field</legend><div class="ginput_container ginput_container_checkbox"><div class="gfield_checkbox " id="input_2_15"><div class="gchoice gchoice_2_15_1">
								<input class="gfield-choice-input form-check-input" name="input_15.1" type="checkbox" value="First Choice" id="choice_2_15_1">
								<label for="choice_2_15_1" id="label_2_15_1" class="gform-field-label gform-field-label--type-inline form-label form-check-label">First Choice</label>
							</div><div class="gchoice gchoice_2_15_2">
								<input class="gfield-choice-input form-check-input" name="input_15.2" type="checkbox" value="Second Choice" id="choice_2_15_2">
								<label for="choice_2_15_2" id="label_2_15_2" class="gform-field-label gform-field-label--type-inline form-label form-check-label">Second Choice</label>
							</div><div class="gchoice gchoice_2_15_3">
								<input class="gfield-choice-input form-check-input" name="input_15.3" type="checkbox" value="Third Choice" id="choice_2_15_3">
								<label for="choice_2_15_3" id="label_2_15_3" class="gform-field-label gform-field-label--type-inline form-label form-check-label">Third Choice</label>
							</div></div></div></fieldset></div>
                    </div>
                    <div class='gform-page-footer gform_page_footer top_label'>
                        <button type="button" id="gform_previous_button_2_8" class="gform_previous_btn btn-outline gform-theme-btn btn-outline gform-theme-btn btn-outline--secondary btn btn-outline" onclick="gform.submission.handleButtonClick(this);" data-submission-type="previous">Previous</button> <button type="button" id="gform_next_button_2_8" class="gform_next_btn btn-primary gform-theme-btn btn-primary btn btn-primary" onclick="gform.submission.handleButtonClick(this);" data-submission-type="next">Next</button> <html><body></body></html>

                    </div>
                </div>
                <div id='gform_page_2_3' class='gform_page' data-js='page-field-id-8' style='display:none;'>
                    <div class='gform_page_fields'>
                        <div id='gform_fields_2_3' class='gform_fields top_label form_sublabel_below description_below validation_below'><div id="field_2_13" class="gfield gfield--type-textarea gfield--input-type-textarea gfield--width-full field_sublabel_below gfield--no-description field_description_below field_validation_below gfield_visibility_visible"  ><label class="gfield_label gform-field-label form-label" for="input_2_13">Free text field</label><div class="ginput_container ginput_container_textarea"><textarea name="input_13" id="input_2_13" class="textarea form-control-default form-control" aria-invalid="false" rows="10" cols="50"></textarea></div></div><div id="field_2_16" class="gfield gfield--type-fileupload gfield--input-type-fileupload gfield--width-full field_sublabel_below gfield--no-description field_description_below field_validation_below gfield_visibility_visible"  ><label class="gfield_label gform-field-label form-label" for="input_2_16">File</label><div class="ginput_container ginput_container_fileupload"><input type="hidden" name="MAX_FILE_SIZE" value="52428800" class="form-control"><input name="input_16" id="input_2_16" type="file" class="form-control-default form-control" aria-describedby="gfield_upload_rules_2_16" onchange="javascript:gformValidateFileSize( this, 52428800 );"><span class="gfield_description gform_fileupload_rules" id="gfield_upload_rules_2_16">Max. file size: 50 MB.</span><div class="gfield_description validation_message gfield_validation_message validation_message--hidden-on-empty" id="live_validation_message_2_16"></div> </div></div></div>
                    </div>
                    <div class='gform-page-footer gform_page_footer top_label'>
                        <button type="button" id="gform_previous_button_2_9" class="gform_previous_btn btn-outline gform-theme-btn btn-outline gform-theme-btn btn-outline--secondary btn btn-outline" onclick="gform.submission.handleButtonClick(this);" data-submission-type="previous">Previous</button> <button type="button" id="gform_next_button_2_9" class="gform_next_btn btn-primary gform-theme-btn btn-primary btn btn-primary" onclick="gform.submission.handleButtonClick(this);" data-submission-type="next">Next</button> <html><body></body></html>

                    </div>
                </div>
                <div id='gform_page_2_4' class='gform_page' data-js='page-field-id-9' style='display:none;'>
                    <div class='gform_page_fields'>
                        <div id='gform_fields_2_4' class='gform_fields top_label form_sublabel_below description_below validation_below'><div id="field_2_17" class="gfield gfield--type-textarea gfield--input-type-textarea gfield--width-full field_sublabel_below gfield--no-description field_description_below field_validation_below gfield_visibility_visible"  ><label class="gfield_label gform-field-label form-label" for="input_2_17">Free text field</label><div class="ginput_container ginput_container_textarea"><textarea name="input_17" id="input_2_17" class="textarea form-control-default form-control" aria-invalid="false" rows="10" cols="50"></textarea></div></div><div id="field_2_18" class="gfield gfield--type-fileupload gfield--input-type-fileupload gfield--width-full field_sublabel_below gfield--no-description field_description_below field_validation_below gfield_visibility_visible"  ><label class="gfield_label gform-field-label form-label" for="gform_browse_button_2_18">File</label><div class="ginput_container ginput_container_fileupload"><div id="gform_multifile_upload_2_18" data-settings='{"runtimes":"html5,flash,html4","browse_button":"gform_browse_button_2_18","container":"gform_multifile_upload_2_18","drop_element":"gform_drag_drop_area_2_18","filelist":"gform_preview_2_18","unique_names":true,"file_data_name":"file","url":"https:\\/\\/growthenergy.org\\/?gf_page=afc528d15ca7270","flash_swf_url":"https:\\/\\/growthenergy.org\\/wp-includes\\/js\\/plupload\\/plupload.flash.swf","silverlight_xap_url":"https:\\/\\/growthenergy.org\\/wp-includes\\/js\\/plupload\\/plupload.silverlight.xap","filters":{"mime_types":[{"title":"Allowed Files","extensions":"*"}],"max_file_size":"52428800b"},"multipart":true,"urlstream_upload":false,"multipart_params":{"form_id":2,"field_id":18,"_gform_file_upload_nonce_2_18":"df0a83340c"},"gf_vars":{"max_files":0,"message_id":"gform_multifile_messages_2_18","disallowed_extensions":["php","asp","aspx","cmd","csh","bat","html","htm","hta","jar","exe","com","js","lnk","htaccess","phar","phtml","ps1","ps2","php3","php4","php5","php6","py","rb","tmp"]}}' class="gform_fileupload_multifile">
										<div id="gform_drag_drop_area_2_18" class="gform_drop_area gform-theme-field-control">
											<span class="gform_drop_instructions">Drop files here or </span>
											<button type="button" id="gform_browse_button_2_18" class="button gform_button_select_files gform-theme-button gform-theme-button--control btn btn-outline" aria-describedby="gfield_upload_rules_2_18">Select files</button>
										</div>
									</div><span class="gfield_description gform_fileupload_rules" id="gfield_upload_rules_2_18">Max. file size: 50 MB.</span><ul class="validation_message--hidden-on-empty gform-ul-reset" id="gform_multifile_messages_2_18"></ul> <div id="gform_preview_2_18" class="ginput_preview_list"></div></div></div></div>
                    </div>
                    <div class='gform-page-footer gform_page_footer top_label'>
                        <button type="button" id="gform_previous_button_2_10" class="gform_previous_btn btn-outline gform-theme-btn btn-outline gform-theme-btn btn-outline--secondary btn btn-outline" onclick="gform.submission.handleButtonClick(this);" data-submission-type="previous">Previous</button> <button type="button" id="gform_next_button_2_10" class="gform_next_btn btn-primary gform-theme-btn btn-primary btn btn-primary" onclick="gform.submission.handleButtonClick(this);" data-submission-type="next">Next</button> <html><body></body></html>

                    </div>
                </div>
                <div id='gform_page_2_5' class='gform_page' data-js='page-field-id-10' style='display:none;'>
                    <div class='gform_page_fields'>
                        <div id='gform_fields_2_5' class='gform_fields top_label form_sublabel_below description_below validation_below'><div id="field_2_14" class="gfield gfield--type-textarea gfield--input-type-textarea gfield--width-full field_sublabel_below gfield--no-description field_description_below field_validation_below gfield_visibility_visible"  ><label class="gfield_label gform-field-label form-label" for="input_2_14">Free text field</label><div class="ginput_container ginput_container_textarea"><textarea name="input_14" id="input_2_14" class="textarea form-control-default form-control" aria-invalid="false" rows="10" cols="50"></textarea></div></div></div></div>
        <div class='gform-page-footer gform_page_footer top_label'><button type="submit" id="gform_previous_button_2" class="gform_previous_btn btn-outline gform-theme-btn btn-outline gform-theme-btn btn-outline--secondary btn btn-outline" onclick="gform.submission.handleButtonClick(this);" data-submission-type="previous">Previous</button> <button type="submit" id="gform_submit_button_2" class="gform_btn btn-outline btn btn-outline" onclick="gform.submission.handleButtonClick(this);" data-submission-type="submit">Submit</button> <html><body></body></html>
<input type='hidden' name='gform_ajax' value='form_id=2&amp;title=&amp;description=&amp;tabindex=0&amp;theme=gravity-theme&amp;hash=ee44f4bb3d5b165b978b5ad1a3585c93' />
            <input type='hidden' class='gform_hidden' name='gform_submission_method' data-js='gform_submission_method_2' value='iframe' />
            <input type='hidden' class='gform_hidden' name='gform_theme' data-js='gform_theme_2' id='gform_theme_2' value='gravity-theme' />
            <input type='hidden' class='gform_hidden' name='gform_style_settings' data-js='gform_style_settings_2' id='gform_style_settings_2' value='' />
            <input type='hidden' class='gform_hidden' name='is_submit_2' value='1' />
            <input type='hidden' class='gform_hidden' name='gform_submit' value='2' />
            
            <input type='hidden' class='gform_hidden' name='gform_currency' data-currency='USD' value='d9rxmf+zYunMKhVhiXjmFjG+DbKcz8jXGa+I9uPGYcmnSAbv8QkFwCpIGGn6MXY+CYHx+ImZdcuRmfvB4yV1T5lXKrMHINDftB07xwyE1cViQtQ=' />
            <input type='hidden' class='gform_hidden' name='gform_unique_id' value='' />
            <input type='hidden' class='gform_hidden' name='state_2' value='WyJ7XCIxXCI6W1wiZDRiNmQyMDNmYTU4Y2IxNmMwYzhjZWM0OTY1NjdkYTFcIixcImY4NjcyZjQ0YmIyODYzMDlhYjk2YjcxNzI1OGFlYmZkXCIsXCIzZDQ0MzMxOTQwY2RjZDI3ZDAyMDE2MWMwZTg0Y2IzNFwiXSxcIjE1LjFcIjpcImU2ZGNhY2UxMDZjZjNlMGViZWEyZWJjNjkzYTlhNmUyXCIsXCIxNS4yXCI6XCJkOTVlMzkyYWRhMjQ4MDBjZWYzNTkxYTcyMGEzNTYwOFwiLFwiMTUuM1wiOlwiODIzZDQ4ZDVmMGJjY2UyNjc2Y2RiMTYwMWE5YjNjYmRcIn0iLCI3NzM5YmMyZDdiYWJhYzdhZmYxYWMxYjQ2NzMxOTUwYiJd' />
            <input type='hidden' autocomplete='off' class='gform_hidden' name='gform_target_page_number_2' id='gform_target_page_number_2' value='2' />
            <input type='hidden' autocomplete='off' class='gform_hidden' name='gform_source_page_number_2' id='gform_source_page_number_2' value='1' />
            <input type='hidden' name='gform_field_values' value='' />
            <input type='hidden' name='gform_uploaded_files' id='gform_uploaded_files_2' value='' />
        </div>
             </div></div>
                        </form>
                        </div>
		                <iframe style='display:none;width:0px;height:0px;' src='about:blank' name='gform_ajax_frame_2' id='gform_ajax_frame_2' title='This iframe contains the logic required to handle Ajax powered Gravity Forms.'></iframe>
		                <script>
gform.initializeOnLoaded( function() {gformInitSpinner( 2, 'https://growthenergy.org/wp-content/plugins/gravityforms/images/spinner.svg', true );jQuery('#gform_ajax_frame_2').on('load',function(){var contents = jQuery(this).contents().find('*').html();var is_postback = contents.indexOf('GF_AJAX_POSTBACK') >= 0;if(!is_postback){return;}var form_content = jQuery(this).contents().find('#gform_wrapper_2');var is_confirmation = jQuery(this).contents().find('#gform_confirmation_wrapper_2').length > 0;var is_redirect = contents.indexOf('gformRedirect(){') >= 0;var is_form = form_content.length > 0 && ! is_redirect && ! is_confirmation;var mt = parseInt(jQuery('html').css('margin-top'), 10) + parseInt(jQuery('body').css('margin-top'), 10) + 100;if(is_form){jQuery('#gform_wrapper_2').html(form_content.html());if(form_content.hasClass('gform_validation_error')){jQuery('#gform_wrapper_2').addClass('gform_validation_error');} else {jQuery('#gform_wrapper_2').removeClass('gform_validation_error');}setTimeout( function() { /* delay the scroll by 50 milliseconds to fix a bug in chrome */  }, 50 );if(window['gformInitDatepicker']) {gformInitDatepicker();}if(window['gformInitPriceFields']) {gformInitPriceFields();}var current_page = jQuery('#gform_source_page_number_2').val();gformInitSpinner( 2, 'https://growthenergy.org/wp-content/plugins/gravityforms/images/spinner.svg', true );jQuery(document).trigger('gform_page_loaded', [2, current_page]);window['gf_submitting_2'] = false;}else if(!is_redirect){var confirmation_content = jQuery(this).contents().find('.GF_AJAX_POSTBACK').html();if(!confirmation_content){confirmation_content = contents;}jQuery('#gform_wrapper_2').replaceWith(confirmation_content);jQuery(document).trigger('gform_confirmation_loaded', [2]);window['gf_submitting_2'] = false;wp.a11y.speak(jQuery('#gform_confirmation_message_2').text());}else{jQuery('#gform_2').append(contents);if(window['gformRedirect']) {gformRedirect();}}jQuery(document).trigger("gform_pre_post_render", [{ formId: "2", currentPage: "current_page", abort: function() { this.preventDefault(); } }]);        if (event && event.defaultPrevented) {                return;        }        const gformWrapperDiv = document.getElementById( "gform_wrapper_2" );        if ( gformWrapperDiv ) {            const visibilitySpan = document.createElement( "span" );            visibilitySpan.id = "gform_visibility_test_2";            gformWrapperDiv.insertAdjacentElement( "afterend", visibilitySpan );        }        const visibilityTestDiv = document.getElementById( "gform_visibility_test_2" );        let postRenderFired = false;        function triggerPostRender() {            if ( postRenderFired ) {                return;            }            postRenderFired = true;            gform.core.triggerPostRenderEvents( 2, current_page );            if ( visibilityTestDiv ) {                visibilityTestDiv.parentNode.removeChild( visibilityTestDiv );            }        }        function debounce( func, wait, immediate ) {            var timeout;            return function() {                var context = this, args = arguments;                var later = function() {                    timeout = null;                    if ( !immediate ) func.apply( context, args );                };                var callNow = immediate && !timeout;                clearTimeout( timeout );                timeout = setTimeout( later, wait );                if ( callNow ) func.apply( context, args );            };        }        const debouncedTriggerPostRender = debounce( function() {            triggerPostRender();        }, 200 );        if ( visibilityTestDiv && visibilityTestDiv.offsetParent === null ) {            const observer = new MutationObserver( ( mutations ) => {                mutations.forEach( ( mutation ) => {                    if ( mutation.type === 'attributes' && visibilityTestDiv.offsetParent !== null ) {                        debouncedTriggerPostRender();                        observer.disconnect();                    }                });            });            observer.observe( document.body, {                attributes: true,                childList: false,                subtree: true,                attributeFilter: [ 'style', 'class' ],            });        } else {            triggerPostRender();        }    } );} );
</script>
				</div>

			</div>
		</div>
	</div>

	
	<div id="contact-modal" class="modal fade colour-scheme" tabindex="-1" role="dialog" aria-hidden="true">
		<div class="modal-dialog" role="document">
			<div class="modal-content">

				<div class="modal-header">
					<button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">Close</button>
				</div>

				<div class="modal-body">
					
                <div class='gf_browser_chrome gform_wrapper gravity-theme gform-theme--no-framework' data-form-theme='gravity-theme' data-form-index='0' id='gform_wrapper_6' >
                        <div class='gform_heading'>
                            <h2 class="gform_title">Get in Touch</h2>
                            <p class='gform_description'>Send us a quick note — we’ll respond as soon as we can.</p>
                        </div><form method='post' enctype='multipart/form-data' target='gform_ajax_frame_6' id='gform_6'  action='/2025/09/16/2025-staff-award-winners/' data-formid='6' novalidate><div class='gf_invisible ginput_recaptchav3' data-sitekey='6LdAwL8qAAAAAMjdFEaiyqzzlWbLVZM2hTji_UsI' data-tabindex='0'><input id="input_4a79835752d484794e1f1310d08e6042" class="gfield_recaptcha_response" type="hidden" name="input_4a79835752d484794e1f1310d08e6042" value=""/></div>
                        <div class='gform-body gform_body'><div id='gform_fields_6' class='gform_fields top_label form_sublabel_above description_above validation_below'><div id="field_6_17" class="gfield gfield--type-honeypot gform_validation_container field_sublabel_above gfield--has-description field_description_above field_validation_below gfield_visibility_visible"  ><label class="gfield_label gform-field-label form-label" for="input_6_17">Instagram</label><div class="gfield_description" id="gfield_description_6_17">This field is for validation purposes and should be left unchanged.</div><div class="ginput_container"><input name="input_17" id="input_6_17" type="text" value="" autocomplete="new-password"></div></div><div id="field_6_7" class="gfield gfield--type-select gfield--input-type-select gfield--width-full field_sublabel_above gfield--no-description field_description_above field_validation_below gfield_visibility_visible"  ><label class="gfield_label gform-field-label form-label" for="input_6_7">I have a question regarding ...</label><div class="ginput_container ginput_container_select"><select name="input_7" id="input_6_7" class="form-control-default gfield_select form-control" aria-invalid="false"><option value="Biofuels">Biofuels</option><option value="Membership">Membership</option><option value="Media Inquiry">Media Inquiry</option><option value="Retailer Information">Retailer Information</option><option value="Other">Other</option></select></div></div><div id="field_6_5" class="gfield gfield--type-text gfield--input-type-text field_sublabel_above gfield--no-description field_description_above field_validation_below gfield_visibility_visible"  ><label class="gfield_label gform-field-label form-label" for="input_6_5">First name</label><div class="ginput_container ginput_container_text"><input name="input_5" id="input_6_5" type="text" value="" class="form-control-default form-control" placeholder="John" aria-invalid="false"></div></div><div id="field_6_8" class="gfield gfield--type-text gfield--input-type-text gfield--width-full field_sublabel_above gfield--no-description field_description_above field_validation_below gfield_visibility_visible"  ><label class="gfield_label gform-field-label form-label" for="input_6_8">Last name</label><div class="ginput_container ginput_container_text"><input name="input_8" id="input_6_8" type="text" value="" class="form-control-default form-control" placeholder="Smith" aria-invalid="false"></div></div><div id="field_6_9" class="gfield gfield--type-email gfield--input-type-email gfield--width-full field_sublabel_above gfield--no-description field_description_above field_validation_below gfield_visibility_visible"  ><label class="gfield_label gform-field-label form-label" for="input_6_9">Email</label><div class="ginput_container ginput_container_email">
                            <input name="input_9" id="input_6_9" type="email" value="" class="form-control-default form-control" placeholder="jsmith@example.com" aria-invalid="false">
                        </div></div><div id="field_6_10" class="gfield gfield--type-phone gfield--input-type-phone gfield--width-full field_sublabel_above gfield--no-description field_description_above field_validation_below gfield_visibility_visible"  ><label class="gfield_label gform-field-label form-label" for="input_6_10">Phone</label><div class="ginput_container ginput_container_phone"><input name="input_10" id="input_6_10" type="tel" value="" class="form-control-default form-control" placeholder="(800) 555&#8209;0000" aria-invalid="false"></div></div><div id="field_6_11" class="gfield gfield--type-text gfield--input-type-text gfield--width-full field_sublabel_above gfield--no-description field_description_above field_validation_below gfield_visibility_visible"  ><label class="gfield_label gform-field-label form-label" for="input_6_11">Zip code</label><div class="ginput_container ginput_container_text"><input name="input_11" id="input_6_11" type="text" value="" class="form-control-default form-control" placeholder="90210" aria-invalid="false"></div></div><div id="field_6_12" class="gfield gfield--type-select gfield--input-type-select gfield--width-full field_sublabel_above gfield--no-description field_description_above field_validation_below gfield_visibility_visible"  ><label class="gfield_label gform-field-label form-label" for="input_6_12">I am a ...</label><div class="ginput_container ginput_container_select"><select name="input_12" id="input_6_12" class="form-control-default gfield_select form-control" aria-invalid="false"><option value="Producer Member">Producer Member</option><option value="Associate Member">Associate Member</option><option value="Prospective Member">Prospective Member</option><option value="Member of the Press">Member of the Press</option><option value="Other">Other</option></select></div></div><div id="field_6_13" class="gfield gfield--type-textarea gfield--input-type-textarea gfield--width-full field_sublabel_above gfield--no-description field_description_above field_validation_below gfield_visibility_visible"  ><label class="gfield_label gform-field-label form-label" for="input_6_13">Question/Comment</label><div class="ginput_container ginput_container_textarea"><textarea name="input_13" id="input_6_13" class="textarea form-control-default form-control" aria-invalid="false" rows="10" cols="50"></textarea></div></div><fieldset id="field_6_14" class="gfield gfield--type-consent gfield--type-choice gfield--input-type-consent gfield--width-full gfield_contains_required field_sublabel_above gfield--no-description field_description_above hidden_label field_validation_below gfield_visibility_visible"  ><legend class="gfield_label gform-field-label gfield_label_before_complex">Consent Terms &amp; Conditions<span class="gfield_required"><span class="gfield_required gfield_required_text">(Required)</span></span></legend><div class="ginput_container ginput_container_consent form-check"><input name="input_14.1" id="input_6_14_1" type="checkbox" value="1" aria-required="true" aria-invalid="false" class="form-check-input"> <label class="gform-field-label gform-field-label--type-inline gfield_consent_label form-label form-check-label" for="input_6_14_1">I agree to the Growth Energy <a href="/terms-and-conditions/">Terms and Conditions</a><span class="gfield_required gfield_required_text">(Required)</span></label><input type="hidden" name="input_14.2" value='I agree to the Growth Energy &lt;a href="/terms-and-conditions/"&gt;Terms and Conditions&lt;/a&gt;' class="gform_hidden"><input type="hidden" name="input_14.3" value="3" class="gform_hidden"></div></fieldset><fieldset id="field_6_15" class="gfield gfield--type-consent gfield--type-choice gfield--input-type-consent gfield--width-full field_sublabel_above gfield--no-description field_description_above hidden_label field_validation_below gfield_visibility_visible"  ><legend class="gfield_label gform-field-label gfield_label_before_complex">Consent Terms &amp; Conditions</legend><div class="ginput_container ginput_container_consent form-check"><input name="input_15.1" id="input_6_15_1" type="checkbox" value="1" aria-invalid="false" class="form-check-input"> <label class="gform-field-label gform-field-label--type-inline gfield_consent_label form-label form-check-label" for="input_6_15_1">Keep me in the loop with updates and news on biofuels, policy, and industry insights.</label><input type="hidden" name="input_15.2" value="Keep me in the loop with updates and news on biofuels, policy, and industry insights." class="gform_hidden"><input type="hidden" name="input_15.3" value="3" class="gform_hidden"></div></fieldset><div id="field_6_16" class="gfield gfield--type-html gfield--input-type-html gfield_html gfield_html_formatted gfield_no_follows_desc field_sublabel_above gfield--no-description field_description_above field_validation_below gfield_visibility_visible"  >This site is protected by reCAPTCHA and the Google <a href="https://policies.google.com/privacy">Privacy Policy</a> and <a href="https://policies.google.com/terms">Terms of Service</a> apply.</div></div></div>
        <div class='gform-footer gform_footer top_label'> <button type="submit" id="gform_submit_button_6" class="gform_btn btn-outline btn btn-outline" onclick="gform.submission.handleButtonClick(this);" data-submission-type="submit">Submit</button> <html><body></body></html>
<input type='hidden' name='gform_ajax' value='form_id=6&amp;title=1&amp;description=1&amp;tabindex=0&amp;theme=gravity-theme&amp;hash=7f882b94088c6d86aaba6ddc35cdad8a' />
            <input type='hidden' class='gform_hidden' name='gform_submission_method' data-js='gform_submission_method_6' value='iframe' />
            <input type='hidden' class='gform_hidden' name='gform_theme' data-js='gform_theme_6' id='gform_theme_6' value='gravity-theme' />
            <input type='hidden' class='gform_hidden' name='gform_style_settings' data-js='gform_style_settings_6' id='gform_style_settings_6' value='' />
            <input type='hidden' class='gform_hidden' name='is_submit_6' value='1' />
            <input type='hidden' class='gform_hidden' name='gform_submit' value='6' />
            
            <input type='hidden' class='gform_hidden' name='gform_currency' data-currency='USD' value='YWnuPVyngFMGfOkGgzVxbHEsePWIjWh6SvjyMz7B1r5NLVkNbsrWCt4zUR3HDVMiwI5yvCqkxs7G9q1Auda755wvTKgGKPVW2yjoBkV2rjpZg0c=' />
            <input type='hidden' class='gform_hidden' name='gform_unique_id' value='' />
            <input type='hidden' class='gform_hidden' name='state_6' value='WyJ7XCIxMlwiOltcImU0YzU1NGY2OWYzMTU1NzEzOTI2YWU2NTc0M2E0NGVmXCIsXCI4MmYxYzNjZDAwMGQzNmIzMTNlOTU5NDUzZWU3YzA2MlwiLFwiYmI1NTE4ZmE5OWI4YjUxMzllM2QyZTJjYzZhZjdkOWZcIixcImE5MzRkODQwMGNlNDRiMzU0ZGE4OTNlNmFjYmU3NDUxXCIsXCI3YTJlOGE4YzBiOTExMDkwMTk5NmM0NmIwZDZiYzJiN1wiXSxcIjE0LjFcIjpcIjA3OGU2NTc3NDNmOGZkYTUxMDUxOGMxZGU1Mzg4N2M5XCIsXCIxNC4yXCI6XCI0OGZjNGQ3ZWQ0NTY3ZDY5NGQwOGY4MjQ5OWU1Mjk0YlwiLFwiMTQuM1wiOlwiNzEwOTIyNzA2NDA5NDE3Y2I1MTQxYjllZjExMWFkY2VcIixcIjE1LjFcIjpcIjA3OGU2NTc3NDNmOGZkYTUxMDUxOGMxZGU1Mzg4N2M5XCIsXCIxNS4yXCI6XCJkYjNkMGNmOWViMTFmY2RjYjcwODA0Nzc2NTM1MjU4OFwiLFwiMTUuM1wiOlwiNzEwOTIyNzA2NDA5NDE3Y2I1MTQxYjllZjExMWFkY2VcIn0iLCIyMzQxN2IzMDM0YzA0ZTllYTUxZjY2ZGQwODg4NmZmYiJd' />
            <input type='hidden' autocomplete='off' class='gform_hidden' name='gform_target_page_number_6' id='gform_target_page_number_6' value='0' />
            <input type='hidden' autocomplete='off' class='gform_hidden' name='gform_source_page_number_6' id='gform_source_page_number_6' value='1' />
            <input type='hidden' name='gform_field_values' value='' />
            
        </div>
                        </form>
                        </div>
		                <iframe style='display:none;width:0px;height:0px;' src='about:blank' name='gform_ajax_frame_6' id='gform_ajax_frame_6' title='This iframe contains the logic required to handle Ajax powered Gravity Forms.'></iframe>
		                <script>
gform.initializeOnLoaded( function() {gformInitSpinner( 6, 'https://growthenergy.org/wp-content/plugins/gravityforms/images/spinner.svg', true );jQuery('#gform_ajax_frame_6').on('load',function(){var contents = jQuery(this).contents().find('*').html();var is_postback = contents.indexOf('GF_AJAX_POSTBACK') >= 0;if(!is_postback){return;}var form_content = jQuery(this).contents().find('#gform_wrapper_6');var is_confirmation = jQuery(this).contents().find('#gform_confirmation_wrapper_6').length > 0;var is_redirect = contents.indexOf('gformRedirect(){') >= 0;var is_form = form_content.length > 0 && ! is_redirect && ! is_confirmation;var mt = parseInt(jQuery('html').css('margin-top'), 10) + parseInt(jQuery('body').css('margin-top'), 10) + 100;if(is_form){jQuery('#gform_wrapper_6').html(form_content.html());if(form_content.hasClass('gform_validation_error')){jQuery('#gform_wrapper_6').addClass('gform_validation_error');} else {jQuery('#gform_wrapper_6').removeClass('gform_validation_error');}setTimeout( function() { /* delay the scroll by 50 milliseconds to fix a bug in chrome */  }, 50 );if(window['gformInitDatepicker']) {gformInitDatepicker();}if(window['gformInitPriceFields']) {gformInitPriceFields();}var current_page = jQuery('#gform_source_page_number_6').val();gformInitSpinner( 6, 'https://growthenergy.org/wp-content/plugins/gravityforms/images/spinner.svg', true );jQuery(document).trigger('gform_page_loaded', [6, current_page]);window['gf_submitting_6'] = false;}else if(!is_redirect){var confirmation_content = jQuery(this).contents().find('.GF_AJAX_POSTBACK').html();if(!confirmation_content){confirmation_content = contents;}jQuery('#gform_wrapper_6').replaceWith(confirmation_content);jQuery(document).trigger('gform_confirmation_loaded', [6]);window['gf_submitting_6'] = false;wp.a11y.speak(jQuery('#gform_confirmation_message_6').text());}else{jQuery('#gform_6').append(contents);if(window['gformRedirect']) {gformRedirect();}}jQuery(document).trigger("gform_pre_post_render", [{ formId: "6", currentPage: "current_page", abort: function() { this.preventDefault(); } }]);        if (event && event.defaultPrevented) {                return;        }        const gformWrapperDiv = document.getElementById( "gform_wrapper_6" );        if ( gformWrapperDiv ) {            const visibilitySpan = document.createElement( "span" );            visibilitySpan.id = "gform_visibility_test_6";            gformWrapperDiv.insertAdjacentElement( "afterend", visibilitySpan );        }        const visibilityTestDiv = document.getElementById( "gform_visibility_test_6" );        let postRenderFired = false;        function triggerPostRender() {            if ( postRenderFired ) {                return;            }            postRenderFired = true;            gform.core.triggerPostRenderEvents( 6, current_page );            if ( visibilityTestDiv ) {                visibilityTestDiv.parentNode.removeChild( visibilityTestDiv );            }        }        function debounce( func, wait, immediate ) {            var timeout;            return function() {                var context = this, args = arguments;                var later = function() {                    timeout = null;                    if ( !immediate ) func.apply( context, args );                };                var callNow = immediate && !timeout;                clearTimeout( timeout );                timeout = setTimeout( later, wait );                if ( callNow ) func.apply( context, args );            };        }        const debouncedTriggerPostRender = debounce( function() {            triggerPostRender();        }, 200 );        if ( visibilityTestDiv && visibilityTestDiv.offsetParent === null ) {            const observer = new MutationObserver( ( mutations ) => {                mutations.forEach( ( mutation ) => {                    if ( mutation.type === 'attributes' && visibilityTestDiv.offsetParent !== null ) {                        debouncedTriggerPostRender();                        observer.disconnect();                    }                });            });            observer.observe( document.body, {                attributes: true,                childList: false,                subtree: true,                attributeFilter: [ 'style', 'class' ],            });        } else {            triggerPostRender();        }    } );} );
</script>
				</div>

			</div>
		</div>
	</div>

	<div class="toast-container position-fixed bottom-0 end-0 p-3"><div id="feedback-toast" class="toast colour-scheme colour-scheme--dark" role="alert" aria-live="assertive" aria-atomic="true"><div class="toast-body"></div></div></div><div id="popover-sharing-buttons" class="hide"><div class="sharing-buttons"><div class="btn-group btn-group-horizontal" role="group"><a href="https://www.facebook.com/sharer/sharer.php?fbrefresh=1&#038;u=https%3A%2F%2Fgrowthenergy.org%2F2025%2F09%2F16%2F2025-staff-award-winners%2F" target="_blank" title="Facebook" class="btn btn-icon-only btn-icon-only--filled"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24" width="24" class="icon"><path d="M14 13.5H16.5L17.5 9.5H14V7.5C14 6.47062 14 5.5 16 5.5H17.5V2.1401C17.1743 2.09685 15.943 2 14.6429 2C11.9284 2 10 3.65686 10 6.69971V9.5H7V13.5H10V22H14V13.5Z"/></svg></a><a href="https://twitter.com/intent/tweet?text=Meet%20the%202025%20Outstanding%20Congressional%20Staff%20Award%20Winners%20https%3A%2F%2Fgrowthenergy.org%2F2025%2F09%2F16%2F2025-staff-award-winners%2F" target="_blank" title="Twitter" class="btn btn-icon-only btn-icon-only--filled"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24" width="24" class="icon"><path d="M18.2048 2.25H21.5128L14.2858 10.51L22.7878 21.75H16.1308L10.9168 14.933L4.95084 21.75H1.64084L9.37084 12.915L1.21484 2.25H8.04084L12.7538 8.481L18.2048 2.25ZM17.0438 19.77H18.8768L7.04484 4.126H5.07784L17.0438 19.77Z"/></svg></a><a href="http://www.linkedin.com/sharing/share-offsite/?url=https://growthenergy.org/2025/09/16/2025-staff-award-winners/" target="_blank" title="LinkedIn" class="btn btn-icon-only btn-icon-only--filled"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24" width="24" class="icon"><path d="M6.94048 4.99993C6.94011 5.81424 6.44608 6.54702 5.69134 6.85273C4.9366 7.15845 4.07187 6.97605 3.5049 6.39155C2.93793 5.80704 2.78195 4.93715 3.1105 4.19207C3.43906 3.44699 4.18654 2.9755 5.00048 2.99993C6.08155 3.03238 6.94097 3.91837 6.94048 4.99993ZM7.00048 8.47993H3.00048V20.9999H7.00048V8.47993ZM13.3205 8.47993H9.34048V20.9999H13.2805V14.4299C13.2805 10.7699 18.0505 10.4299 18.0505 14.4299V20.9999H22.0005V13.0699C22.0005 6.89993 14.9405 7.12993 13.2805 10.1599L13.3205 8.47993Z"/></svg></a></div></div></div>
	<div id="biofuels-curriculum" class="modal fade colour-scheme" tabindex="-1" role="dialog" aria-hidden="true">
		<div class="modal-dialog" role="document">
			<div class="modal-content">

				<div class="modal-header">
					<button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">Close</button>
				</div>

				<div class="modal-body">
					
                <div class='gf_browser_chrome gform_wrapper gravity-theme gform-theme--no-framework' data-form-theme='gravity-theme' data-form-index='0' id='gform_wrapper_7' >
                        <div class='gform_heading'>
                            <h2 class="gform_title">Biofuels Curriculum</h2>
                            <p class='gform_description'>Complete this form to access the curriculum documents.</p>
                        </div><form method='post' enctype='multipart/form-data' target='gform_ajax_frame_7' id='gform_7'  action='/2025/09/16/2025-staff-award-winners/' data-formid='7' novalidate><div class='gf_invisible ginput_recaptchav3' data-sitekey='6LdAwL8qAAAAAMjdFEaiyqzzlWbLVZM2hTji_UsI' data-tabindex='0'><input id="input_cd9dd5320020fefeee61b975273695e9" class="gfield_recaptcha_response" type="hidden" name="input_cd9dd5320020fefeee61b975273695e9" value=""/></div>
                        <div class='gform-body gform_body'><div id='gform_fields_7' class='gform_fields top_label form_sublabel_above description_above validation_below'><div id="field_7_19" class="gfield gfield--type-honeypot gform_validation_container field_sublabel_above gfield--has-description field_description_above field_validation_below gfield_visibility_visible"  ><label class="gfield_label gform-field-label form-label" for="input_7_19">Instagram</label><div class="gfield_description" id="gfield_description_7_19">This field is for validation purposes and should be left unchanged.</div><div class="ginput_container"><input name="input_19" id="input_7_19" type="text" value="" autocomplete="new-password"></div></div><div id="field_7_5" class="gfield gfield--type-text gfield--input-type-text gfield_contains_required field_sublabel_above gfield--no-description field_description_above field_validation_below gfield_visibility_visible"  ><label class="gfield_label gform-field-label form-label" for="input_7_5">First name<span class="gfield_required"><span class="gfield_required gfield_required_text">(Required)</span></span></label><div class="ginput_container ginput_container_text"><input name="input_5" id="input_7_5" type="text" value="" class="form-control-default form-control" placeholder="John" aria-required="true" aria-invalid="false"></div></div><div id="field_7_8" class="gfield gfield--type-text gfield--input-type-text gfield--width-full gfield_contains_required field_sublabel_above gfield--no-description field_description_above field_validation_below gfield_visibility_visible"  ><label class="gfield_label gform-field-label form-label" for="input_7_8">Last name<span class="gfield_required"><span class="gfield_required gfield_required_text">(Required)</span></span></label><div class="ginput_container ginput_container_text"><input name="input_8" id="input_7_8" type="text" value="" class="form-control-default form-control" placeholder="Smith" aria-required="true" aria-invalid="false"></div></div><div id="field_7_9" class="gfield gfield--type-email gfield--input-type-email gfield--width-full gfield_contains_required field_sublabel_above gfield--no-description field_description_above field_validation_below gfield_visibility_visible"  ><label class="gfield_label gform-field-label form-label" for="input_7_9">Email<span class="gfield_required"><span class="gfield_required gfield_required_text">(Required)</span></span></label><div class="ginput_container ginput_container_email">
                            <input name="input_9" id="input_7_9" type="email" value="" class="form-control-default form-control" placeholder="jsmith@example.com" aria-required="true" aria-invalid="false">
                        </div></div><div id="field_7_10" class="gfield gfield--type-phone gfield--input-type-phone gfield--width-full field_sublabel_above gfield--no-description field_description_above field_validation_below gfield_visibility_visible"  ><label class="gfield_label gform-field-label form-label" for="input_7_10">Phone</label><div class="ginput_container ginput_container_phone"><input name="input_10" id="input_7_10" type="tel" value="" class="form-control-default form-control" placeholder="(800) 555&#8209;0000" aria-invalid="false"></div></div><div id="field_7_11" class="gfield gfield--type-text gfield--input-type-text gfield--width-full gfield_contains_required field_sublabel_above gfield--no-description field_description_above field_validation_below gfield_visibility_visible"  ><label class="gfield_label gform-field-label form-label" for="input_7_11">ZIP/Postal code<span class="gfield_required"><span class="gfield_required gfield_required_text">(Required)</span></span></label><div class="ginput_container ginput_container_text"><input name="input_11" id="input_7_11" type="text" value="" class="form-control-default form-control" placeholder="90210" aria-required="true" aria-invalid="false"></div></div><div id="field_7_18" class="gfield gfield--type-text gfield--input-type-text gfield--width-full field_sublabel_above gfield--no-description field_description_above field_validation_below gfield_visibility_visible"  ><label class="gfield_label gform-field-label form-label" for="input_7_18">School Name</label><div class="ginput_container ginput_container_text"><input name="input_18" id="input_7_18" type="text" value="" class="form-control-default form-control" aria-invalid="false"></div></div><div id="field_7_13" class="gfield gfield--type-textarea gfield--input-type-textarea gfield--width-full field_sublabel_above gfield--no-description field_description_above field_validation_below gfield_visibility_visible"  ><label class="gfield_label gform-field-label form-label" for="input_7_13">How did you hear about the curriculum?</label><div class="ginput_container ginput_container_textarea"><textarea name="input_13" id="input_7_13" class="textarea form-control-default form-control" aria-invalid="false" rows="10" cols="50"></textarea></div></div><fieldset id="field_7_14" class="gfield gfield--type-consent gfield--type-choice gfield--input-type-consent gfield--width-full gfield_contains_required field_sublabel_above gfield--no-description field_description_above hidden_label field_validation_below gfield_visibility_visible"  ><legend class="gfield_label gform-field-label gfield_label_before_complex">Consent Terms &amp; Conditions<span class="gfield_required"><span class="gfield_required gfield_required_text">(Required)</span></span></legend><div class="ginput_container ginput_container_consent form-check"><input name="input_14.1" id="input_7_14_1" type="checkbox" value="1" aria-required="true" aria-invalid="false" class="form-check-input"> <label class="gform-field-label gform-field-label--type-inline gfield_consent_label form-label form-check-label" for="input_7_14_1">I agree to the Growth Energy <a href="/terms-and-conditions/">Terms and Conditions</a><span class="gfield_required gfield_required_text">(Required)</span></label><input type="hidden" name="input_14.2" value='I agree to the Growth Energy &lt;a href="/terms-and-conditions/"&gt;Terms and Conditions&lt;/a&gt;' class="gform_hidden"><input type="hidden" name="input_14.3" value="4" class="gform_hidden"></div></fieldset><fieldset id="field_7_15" class="gfield gfield--type-consent gfield--type-choice gfield--input-type-consent gfield--width-full field_sublabel_above gfield--no-description field_description_above hidden_label field_validation_below gfield_visibility_visible"  ><legend class="gfield_label gform-field-label gfield_label_before_complex">Consent Terms &amp; Conditions</legend><div class="ginput_container ginput_container_consent form-check"><input name="input_15.1" id="input_7_15_1" type="checkbox" value="1" aria-invalid="false" class="form-check-input"> <label class="gform-field-label gform-field-label--type-inline gfield_consent_label form-label form-check-label" for="input_7_15_1">Join our mailing list for early access to policy announcements, updates on our work, how you can help, and more.</label><input type="hidden" name="input_15.2" value="Join our mailing list for early access to policy announcements, updates on our work, how you can help, and more." class="gform_hidden"><input type="hidden" name="input_15.3" value="4" class="gform_hidden"></div></fieldset><div id="field_7_16" class="gfield gfield--type-html gfield--input-type-html gfield_html gfield_html_formatted gfield_no_follows_desc field_sublabel_above gfield--no-description field_description_above field_validation_below gfield_visibility_visible"  >This site is protected by reCAPTCHA and the Google <a href="https://policies.google.com/privacy">Privacy Policy</a> and <a href="https://policies.google.com/terms">Terms of Service</a> apply.</div></div></div>
        <div class='gform-footer gform_footer top_label'> <button type="submit" id="gform_submit_button_7" class="gform_btn btn-outline btn btn-outline" onclick="gform.submission.handleButtonClick(this);" data-submission-type="submit">Submit</button> <html><body></body></html>
<input type='hidden' name='gform_ajax' value='form_id=7&amp;title=1&amp;description=1&amp;tabindex=0&amp;theme=gravity-theme&amp;styles=[]&amp;hash=165971e17cf3c70c2a3232a7c7fc9033' />
            <input type='hidden' class='gform_hidden' name='gform_submission_method' data-js='gform_submission_method_7' value='iframe' />
            <input type='hidden' class='gform_hidden' name='gform_theme' data-js='gform_theme_7' id='gform_theme_7' value='gravity-theme' />
            <input type='hidden' class='gform_hidden' name='gform_style_settings' data-js='gform_style_settings_7' id='gform_style_settings_7' value='[]' />
            <input type='hidden' class='gform_hidden' name='is_submit_7' value='1' />
            <input type='hidden' class='gform_hidden' name='gform_submit' value='7' />
            
            <input type='hidden' class='gform_hidden' name='gform_currency' data-currency='USD' value='c/NEIbR4eicZpZeyR7yZUIEvDj6AapkzFfhstalTbggn0vcjN56KyujG1Ckk8ZAMWvuhN5Qm4SIiHzgl7wd6iENDpAEz0Z4L005vGOIkk8fzBTc=' />
            <input type='hidden' class='gform_hidden' name='gform_unique_id' value='' />
            <input type='hidden' class='gform_hidden' name='state_7' value='WyJ7XCIxNC4xXCI6XCIwNzhlNjU3NzQzZjhmZGE1MTA1MThjMWRlNTM4ODdjOVwiLFwiMTQuMlwiOlwiNDhmYzRkN2VkNDU2N2Q2OTRkMDhmODI0OTllNTI5NGJcIixcIjE0LjNcIjpcImJiZTdiYmQ2Yzc3OTFmOWNhODIyZDY3ZjhlZDY0N2NmXCIsXCIxNS4xXCI6XCIwNzhlNjU3NzQzZjhmZGE1MTA1MThjMWRlNTM4ODdjOVwiLFwiMTUuMlwiOlwiODgxNzNhYWM1YTM3Y2VkNDY2ZmU5Yzg5ZTZmNzc0MjdcIixcIjE1LjNcIjpcImJiZTdiYmQ2Yzc3OTFmOWNhODIyZDY3ZjhlZDY0N2NmXCJ9IiwiOGY5MDRmMjc2NWY1MWRmYzUxY2QyZmQ1MWU1NjRlOTIiXQ==' />
            <input type='hidden' autocomplete='off' class='gform_hidden' name='gform_target_page_number_7' id='gform_target_page_number_7' value='0' />
            <input type='hidden' autocomplete='off' class='gform_hidden' name='gform_source_page_number_7' id='gform_source_page_number_7' value='1' />
            <input type='hidden' name='gform_field_values' value='' />
            
        </div>
                        </form>
                        </div>
		                <iframe style='display:none;width:0px;height:0px;' src='about:blank' name='gform_ajax_frame_7' id='gform_ajax_frame_7' title='This iframe contains the logic required to handle Ajax powered Gravity Forms.'></iframe>
		                <script>
gform.initializeOnLoaded( function() {gformInitSpinner( 7, 'https://growthenergy.org/wp-content/plugins/gravityforms/images/spinner.svg', true );jQuery('#gform_ajax_frame_7').on('load',function(){var contents = jQuery(this).contents().find('*').html();var is_postback = contents.indexOf('GF_AJAX_POSTBACK') >= 0;if(!is_postback){return;}var form_content = jQuery(this).contents().find('#gform_wrapper_7');var is_confirmation = jQuery(this).contents().find('#gform_confirmation_wrapper_7').length > 0;var is_redirect = contents.indexOf('gformRedirect(){') >= 0;var is_form = form_content.length > 0 && ! is_redirect && ! is_confirmation;var mt = parseInt(jQuery('html').css('margin-top'), 10) + parseInt(jQuery('body').css('margin-top'), 10) + 100;if(is_form){jQuery('#gform_wrapper_7').html(form_content.html());if(form_content.hasClass('gform_validation_error')){jQuery('#gform_wrapper_7').addClass('gform_validation_error');} else {jQuery('#gform_wrapper_7').removeClass('gform_validation_error');}setTimeout( function() { /* delay the scroll by 50 milliseconds to fix a bug in chrome */  }, 50 );if(window['gformInitDatepicker']) {gformInitDatepicker();}if(window['gformInitPriceFields']) {gformInitPriceFields();}var current_page = jQuery('#gform_source_page_number_7').val();gformInitSpinner( 7, 'https://growthenergy.org/wp-content/plugins/gravityforms/images/spinner.svg', true );jQuery(document).trigger('gform_page_loaded', [7, current_page]);window['gf_submitting_7'] = false;}else if(!is_redirect){var confirmation_content = jQuery(this).contents().find('.GF_AJAX_POSTBACK').html();if(!confirmation_content){confirmation_content = contents;}jQuery('#gform_wrapper_7').replaceWith(confirmation_content);jQuery(document).trigger('gform_confirmation_loaded', [7]);window['gf_submitting_7'] = false;wp.a11y.speak(jQuery('#gform_confirmation_message_7').text());}else{jQuery('#gform_7').append(contents);if(window['gformRedirect']) {gformRedirect();}}jQuery(document).trigger("gform_pre_post_render", [{ formId: "7", currentPage: "current_page", abort: function() { this.preventDefault(); } }]);        if (event && event.defaultPrevented) {                return;        }        const gformWrapperDiv = document.getElementById( "gform_wrapper_7" );        if ( gformWrapperDiv ) {            const visibilitySpan = document.createElement( "span" );            visibilitySpan.id = "gform_visibility_test_7";            gformWrapperDiv.insertAdjacentElement( "afterend", visibilitySpan );        }        const visibilityTestDiv = document.getElementById( "gform_visibility_test_7" );        let postRenderFired = false;        function triggerPostRender() {            if ( postRenderFired ) {                return;            }            postRenderFired = true;            gform.core.triggerPostRenderEvents( 7, current_page );            if ( visibilityTestDiv ) {                visibilityTestDiv.parentNode.removeChild( visibilityTestDiv );            }        }        function debounce( func, wait, immediate ) {            var timeout;            return function() {                var context = this, args = arguments;                var later = function() {                    timeout = null;                    if ( !immediate ) func.apply( context, args );                };                var callNow = immediate && !timeout;                clearTimeout( timeout );                timeout = setTimeout( later, wait );                if ( callNow ) func.apply( context, args );            };        }        const debouncedTriggerPostRender = debounce( function() {            triggerPostRender();        }, 200 );        if ( visibilityTestDiv && visibilityTestDiv.offsetParent === null ) {            const observer = new MutationObserver( ( mutations ) => {                mutations.forEach( ( mutation ) => {                    if ( mutation.type === 'attributes' && visibilityTestDiv.offsetParent !== null ) {                        debouncedTriggerPostRender();                        observer.disconnect();                    }                });            });            observer.observe( document.body, {                attributes: true,                childList: false,                subtree: true,                attributeFilter: [ 'style', 'class' ],            });        } else {            triggerPostRender();        }    } );} );
</script>
				</div>

			</div>
		</div>
	</div>

	<div id="search-overlay" data-wsk-active="false" class="overlay colour-scheme colour-scheme--dark overlay--navbar-visible"><div class="overlay__content"><div class="overlay__content-inner"><div class="container-fluid"><div class="row"><div class="col-lg-8"><form class="form form--minimal search-form" role="search" method="get" action="https://growthenergy.org/"><div class="form__body"><label class="visually-hidden" for="s">Enter search term</label><input class="form-control" type="text" value="" name="s" placeholder="Search" /></div><div class="form__footer"><button type="submit" class="btn btn-outline btn-lg">Search</button></div></form><div class="mb-5"><span class="display-text">Popular Searches —</span></div><ul class="popular-search-terms"><li><a href="/?s=Policy%20Updates" class="link-muted">Policy Updates <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="16" width="16" class="icon"><path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"/></svg></a></li><li><a href="/?s=Events" class="link-muted">Events <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="16" width="16" class="icon"><path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"/></svg></a></li><li><a href="/?s=Biofuel" class="link-muted">Biofuel <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="16" width="16" class="icon"><path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"/></svg></a></li><li><a href="/?s=GE%20leadership%20team" class="link-muted">GE leadership team <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="16" width="16" class="icon"><path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"/></svg></a></li></ul></div></div></div></div></div></div><div id="navbar-menu-overlay" data-wsk-active="false" class="overlay navbar-menu-overlay colour-scheme colour-scheme--dark"><div class="overlay__content"><div class="overlay__content-inner"><div class="container-fluid"><ul id="menu-navbar-menu-1" class="navbar-nav"><li  class="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children dropdown nav-item nav-item-16113"><a href="#" class="nav-link  dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" data-bs-auto-close="outside" aria-expanded="false"><span class="dropdown-toggle__icon"></span>Value of Biofuels<svg xmlns="http://www.w3.org/2000/svg" width="14" height="8" viewBox="0 0 14 8" fill="none" class="dropdown-chevron__icon">
<path d="M1 1L7 7L13 1" stroke="#13919B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg></a>
<ul class="dropdown-menu dropdown-menu-end dropdown-menu-xxxl-start  depth_0">
	<li  class="menu-item menu-item-type-post_type menu-item-object-page nav-item nav-item-16114"><a href="https://growthenergy.org/value-of-biofuels/" class="dropdown-item ">Overview</a></li>
	<li  class="menu-item menu-item-type-post_type menu-item-object-page nav-item nav-item-16116"><a href="https://growthenergy.org/value-of-biofuels/value-at-the-pump/" class="dropdown-item ">Value at the Pump</a></li>
	<li  class="menu-item menu-item-type-post_type menu-item-object-page nav-item nav-item-16115"><a href="https://growthenergy.org/value-of-biofuels/value-for-the-rural-community/" class="dropdown-item ">Value for the Rural Community</a></li>
	<li  class="menu-item menu-item-type-post_type menu-item-object-page nav-item nav-item-16124"><a href="https://growthenergy.org/value-of-biofuels/value-for-the-environment/" class="dropdown-item ">Value for the Environment</a></li>
</ul>
</li>
<li  class="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children dropdown nav-item nav-item-16110"><a href="#" class="nav-link  dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" data-bs-auto-close="outside" aria-expanded="false"><span class="dropdown-toggle__icon"></span>Policy Priorities<svg xmlns="http://www.w3.org/2000/svg" width="14" height="8" viewBox="0 0 14 8" fill="none" class="dropdown-chevron__icon">
<path d="M1 1L7 7L13 1" stroke="#13919B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg></a>
<ul class="dropdown-menu dropdown-menu-end dropdown-menu-xxxl-start  depth_0">
	<li  class="menu-item menu-item-type-post_type menu-item-object-page nav-item nav-item-16097"><a href="https://growthenergy.org/policy-priorities/" class="dropdown-item ">Overview</a></li>
	<li  class="menu-item menu-item-type-post_type menu-item-object-page nav-item nav-item-18897"><a href="https://growthenergy.org/2025-roadmap-energy-dominance/" class="dropdown-item ">2025 Policy Roadmap</a></li>
	<li  class="menu-item menu-item-type-post_type menu-item-object-policy-priority nav-item nav-item-16101"><a href="https://growthenergy.org/policy-priority/e15-and-higher-ethanol-blends/" class="dropdown-item ">Lower-Cost, Lower-Emissions Bioethanol</a></li>
	<li  class="menu-item menu-item-type-post_type menu-item-object-policy-priority nav-item nav-item-16107"><a href="https://growthenergy.org/policy-priority/the-renewable-fuel-standard/" class="dropdown-item ">The Renewable Fuel Standard</a></li>
	<li  class="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children dropdown nav-item nav-item-16128 dropdown-menu-child-item dropdown-menu-end at_depth_1"><a href="#" class="dropdown-item  dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" data-bs-auto-close="outside" aria-expanded="false"><span class="dropdown-toggle__icon"></span>Tax Incentives and Technology<svg xmlns="http://www.w3.org/2000/svg" width="14" height="8" viewBox="0 0 14 8" fill="none" class="dropdown-chevron__icon">
<path d="M1 1L7 7L13 1" stroke="#13919B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg></a>
	<ul class="dropdown-menu dropdown-submenu dropdown-menu-end dropdown-menu-xxxl-start  depth_1">
		<li  class="menu-item menu-item-type-post_type menu-item-object-policy-priority nav-item nav-item-16099"><a href="https://growthenergy.org/policy-priority/clean-fuel-tax-incentives/" class="dropdown-item ">Clean Fuel Tax Incentives</a></li>
		<li  class="menu-item menu-item-type-post_type menu-item-object-policy-priority nav-item nav-item-16106"><a href="https://growthenergy.org/policy-priority/aviation-maritime-fuel/" class="dropdown-item ">Aviation and Maritime Fuel</a></li>
		<li  class="menu-item menu-item-type-post_type menu-item-object-policy-priority nav-item nav-item-16098"><a href="https://growthenergy.org/policy-priority/carbon-capture-technology/" class="dropdown-item ">Carbon Capture Technology</a></li>
		<li  class="menu-item menu-item-type-post_type menu-item-object-policy-priority nav-item nav-item-16100"><a href="https://growthenergy.org/policy-priority/climate-smart-agriculture/" class="dropdown-item ">Carbon-Reducing Farm Practices</a></li>
	</ul>
</li>
	<li  class="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children dropdown nav-item nav-item-16129 dropdown-menu-child-item dropdown-menu-end at_depth_1"><a href="#" class="dropdown-item  dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" data-bs-auto-close="outside" aria-expanded="false"><span class="dropdown-toggle__icon"></span>Standards<svg xmlns="http://www.w3.org/2000/svg" width="14" height="8" viewBox="0 0 14 8" fill="none" class="dropdown-chevron__icon">
<path d="M1 1L7 7L13 1" stroke="#13919B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg></a>
	<ul class="dropdown-menu dropdown-submenu dropdown-menu-end dropdown-menu-xxxl-start  depth_1">
		<li  class="menu-item menu-item-type-post_type menu-item-object-policy-priority nav-item nav-item-16109"><a href="https://growthenergy.org/policy-priority/vehicle-emissions-standards/" class="dropdown-item ">Vehicle Emissions Standards</a></li>
		<li  class="menu-item menu-item-type-post_type menu-item-object-policy-priority nav-item nav-item-16104"><a href="https://growthenergy.org/policy-priority/low-carbon-fuel-standards/" class="dropdown-item ">Low Carbon Fuel Standards</a></li>
	</ul>
</li>
	<li  class="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children dropdown nav-item nav-item-16130 dropdown-menu-child-item dropdown-menu-end at_depth_1"><a href="#" class="dropdown-item  dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" data-bs-auto-close="outside" aria-expanded="false"><span class="dropdown-toggle__icon"></span>Trade &#038; Transport<svg xmlns="http://www.w3.org/2000/svg" width="14" height="8" viewBox="0 0 14 8" fill="none" class="dropdown-chevron__icon">
<path d="M1 1L7 7L13 1" stroke="#13919B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg></a>
	<ul class="dropdown-menu dropdown-submenu dropdown-menu-end dropdown-menu-xxxl-start  depth_1">
		<li  class="menu-item menu-item-type-post_type menu-item-object-policy-priority nav-item nav-item-16103"><a href="https://growthenergy.org/policy-priority/global-marketplace/" class="dropdown-item ">Global Marketplace</a></li>
		<li  class="menu-item menu-item-type-post_type menu-item-object-policy-priority nav-item nav-item-16108"><a href="https://growthenergy.org/policy-priority/transport-and-logistics/" class="dropdown-item ">Transport and Logistics</a></li>
	</ul>
</li>
</ul>
</li>
<li  class="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children dropdown nav-item nav-item-16532"><a href="#" class="nav-link  dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" data-bs-auto-close="outside" aria-expanded="false"><span class="dropdown-toggle__icon"></span>Resources<svg xmlns="http://www.w3.org/2000/svg" width="14" height="8" viewBox="0 0 14 8" fill="none" class="dropdown-chevron__icon">
<path d="M1 1L7 7L13 1" stroke="#13919B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg></a>
<ul class="dropdown-menu dropdown-menu-end dropdown-menu-xxxl-start  depth_0">
	<li  class="menu-item menu-item-type-post_type menu-item-object-page nav-item nav-item-16533"><a href="https://growthenergy.org/resources/" class="dropdown-item ">Overview</a></li>
	<li  class="menu-item menu-item-type-post_type menu-item-object-page nav-item nav-item-16631"><a href="https://growthenergy.org/indices-data-trends/" class="dropdown-item ">Indices, Data &#038; Trends</a></li>
	<li  class="menu-item menu-item-type-post_type menu-item-object-page nav-item nav-item-18346"><a href="https://growthenergy.org/fuel-finder/" class="dropdown-item ">Fuel Finder</a></li>
	<li  class="menu-item menu-item-type-post_type menu-item-object-page nav-item nav-item-18573"><a href="https://growthenergy.org/bioeconomy-infrastructure/" class="dropdown-item ">Bioeconomy Infrastructure</a></li>
	<li  class="menu-item menu-item-type-taxonomy menu-item-object-category current-post-ancestor nav-item nav-item-16644"><a href="https://growthenergy.org/category/news/" class="dropdown-item active">News</a></li>
	<li  class="menu-item menu-item-type-taxonomy menu-item-object-category nav-item nav-item-16645"><a href="https://growthenergy.org/category/comments-testimony-letters/" class="dropdown-item ">Comments, Testimony &amp; Letters</a></li>
	<li  class="menu-item menu-item-type-post_type menu-item-object-page nav-item nav-item-16648"><a href="https://growthenergy.org/retailer-supplier-hub/" class="dropdown-item ">Retailer &#038; Supplier Hub</a></li>
	<li  class="menu-item menu-item-type-taxonomy menu-item-object-category nav-item nav-item-16646"><a href="https://growthenergy.org/category/research-fact-sheets/" class="dropdown-item ">Research &amp; Fact Sheets</a></li>
	<li  class="menu-item menu-item-type-post_type menu-item-object-page nav-item nav-item-16643"><a href="https://growthenergy.org/value-of-biofuels/value-at-the-pump/biofuel-basics/" class="dropdown-item ">Biofuel Basics</a></li>
</ul>
</li>
<li  class="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children dropdown nav-item nav-item-16088"><a href="#" class="nav-link  dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" data-bs-auto-close="outside" aria-expanded="false"><span class="dropdown-toggle__icon"></span>About Us<svg xmlns="http://www.w3.org/2000/svg" width="14" height="8" viewBox="0 0 14 8" fill="none" class="dropdown-chevron__icon">
<path d="M1 1L7 7L13 1" stroke="#13919B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg></a>
<ul class="dropdown-menu dropdown-menu-end dropdown-menu-xxxl-start  depth_0">
	<li  class="menu-item menu-item-type-post_type menu-item-object-page nav-item nav-item-15695"><a href="https://growthenergy.org/about-us/" class="dropdown-item ">Overview</a></li>
	<li  class="menu-item menu-item-type-post_type menu-item-object-page nav-item nav-item-16095"><a href="https://growthenergy.org/about-us/our-leadership-staff/" class="dropdown-item ">Our Leadership &#038; Staff</a></li>
	<li  class="menu-item menu-item-type-post_type menu-item-object-page nav-item nav-item-16089"><a href="https://growthenergy.org/about-us/growth-energy-membership-events/" class="dropdown-item ">Membership &#038; Events</a></li>
	<li  class="menu-item menu-item-type-post_type menu-item-object-annual-report nav-item nav-item-19020"><a href="https://growthenergy.org/annual-report/annual-report-2024/" class="dropdown-item ">Annual Report</a></li>
	<li  class="menu-item menu-item-type-post_type menu-item-object-page nav-item nav-item-16091"><a href="https://growthenergy.org/about-us/careers/" class="dropdown-item ">Careers</a></li>
	<li  class="menu-item menu-item-type-post_type menu-item-object-page nav-item nav-item-16092"><a href="https://growthenergy.org/about-us/contact/" class="dropdown-item ">Contact</a></li>
</ul>
</li>
<li  class="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children dropdown nav-item nav-item-16112"><a href="#" class="nav-link  dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" data-bs-auto-close="outside" aria-expanded="false"><span class="dropdown-toggle__icon"></span>Our Network<svg xmlns="http://www.w3.org/2000/svg" width="14" height="8" viewBox="0 0 14 8" fill="none" class="dropdown-chevron__icon">
<path d="M1 1L7 7L13 1" stroke="#13919B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg></a>
<ul class="dropdown-menu dropdown-menu-end dropdown-menu-xxxl-start  depth_0">
	<li  class="menu-item menu-item-type-post_type menu-item-object-page nav-item nav-item-15697"><a href="https://growthenergy.org/our-network/" class="dropdown-item ">Overview</a></li>
	<li  class="menu-item menu-item-type-post_type menu-item-object-page nav-item nav-item-16136"><a href="https://growthenergy.org/our-network/our-members/" class="dropdown-item ">Our Members</a></li>
	<li  class="menu-item menu-item-type-post_type menu-item-object-page nav-item nav-item-16132"><a href="https://growthenergy.org/our-network/becoming-a-member/" class="dropdown-item ">Becoming a Member</a></li>
	<li  class="menu-item menu-item-type-custom menu-item-object-custom nav-item nav-item-18345"><a href="https://getbiofuel.com/" class="dropdown-item ">Get Biofuel</a></li>
	<li  class="menu-item menu-item-type-post_type menu-item-object-page nav-item nav-item-16133"><a href="https://growthenergy.org/our-network/events/" class="dropdown-item ">Events</a></li>
	<li  class="menu-item menu-item-type-post_type menu-item-object-page nav-item nav-item-16134"><a href="https://growthenergy.org/our-network/growth-energy-pac/" class="dropdown-item ">Growth Energy PAC</a></li>
	<li  class="menu-item menu-item-type-post_type menu-item-object-page nav-item nav-item-16531"><a href="https://growthenergy.org/our-network/member-portal/" class="dropdown-item ">Member Portal</a></li>
</ul>
</li>
</ul><ul id="menu-navbar-sub-menu-1" class="navbar-sub-nav list-inline"><li class="menu-item menu-item-type-taxonomy menu-item-object-category current-post-ancestor menu-item-16605"><a href="https://growthenergy.org/category/news/" class="link-muted">News</a></li>
<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-17252"><a href="https://growthenergy.org/E15Now" class="link-muted">Take Action</a></li>
<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-18310"><a href="/our-network/events/" class="link-muted">Events</a></li>
<li class="menu-item menu-item-type-taxonomy menu-item-object-category menu-item-16606"><a href="https://growthenergy.org/category/research-fact-sheets/" class="link-muted">Fact Sheets</a></li>
<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-16608"><a href="https://growthenergy.org/about-us/contact/" class="link-muted">Contact</a></li>
</ul></div></div></div></div>
	<div id="contact-support-modal" class="modal fade colour-scheme" tabindex="-1" role="dialog" aria-hidden="true">
		<div class="modal-dialog" role="document">
			<div class="modal-content">

				<div class="modal-header">
					<button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">Close</button>
				</div>

				<div class="modal-body">
					
                <div class='gf_browser_chrome gform_wrapper gravity-theme gform-theme--no-framework' data-form-theme='gravity-theme' data-form-index='0' id='gform_wrapper_7' >
                        <div class='gform_heading'>
                            <h2 class="gform_title">Biofuels Curriculum</h2>
                            <p class='gform_description'>Complete this form to access the curriculum documents.</p>
                        </div><form method='post' enctype='multipart/form-data' target='gform_ajax_frame_7' id='gform_7'  action='/2025/09/16/2025-staff-award-winners/' data-formid='7' novalidate><div class='gf_invisible ginput_recaptchav3' data-sitekey='6LdAwL8qAAAAAMjdFEaiyqzzlWbLVZM2hTji_UsI' data-tabindex='0'><input id="input_cd9dd5320020fefeee61b975273695e9" class="gfield_recaptcha_response" type="hidden" name="input_cd9dd5320020fefeee61b975273695e9" value=""/></div>
                        <div class='gform-body gform_body'><div id='gform_fields_7' class='gform_fields top_label form_sublabel_above description_above validation_below'><div id="field_7_19" class="gfield gfield--type-honeypot gform_validation_container field_sublabel_above gfield--has-description field_description_above field_validation_below gfield_visibility_visible"  ><label class="gfield_label gform-field-label form-label" for="input_7_19">Facebook</label><div class="gfield_description" id="gfield_description_7_19">This field is for validation purposes and should be left unchanged.</div><div class="ginput_container"><input name="input_19" id="input_7_19" type="text" value="" autocomplete="new-password"></div></div><div id="field_7_5" class="gfield gfield--type-text gfield--input-type-text gfield_contains_required field_sublabel_above gfield--no-description field_description_above field_validation_below gfield_visibility_visible"  ><label class="gfield_label gform-field-label form-label" for="input_7_5">First name<span class="gfield_required"><span class="gfield_required gfield_required_text">(Required)</span></span></label><div class="ginput_container ginput_container_text"><input name="input_5" id="input_7_5" type="text" value="" class="form-control-default form-control" placeholder="John" aria-required="true" aria-invalid="false"></div></div><div id="field_7_8" class="gfield gfield--type-text gfield--input-type-text gfield--width-full gfield_contains_required field_sublabel_above gfield--no-description field_description_above field_validation_below gfield_visibility_visible"  ><label class="gfield_label gform-field-label form-label" for="input_7_8">Last name<span class="gfield_required"><span class="gfield_required gfield_required_text">(Required)</span></span></label><div class="ginput_container ginput_container_text"><input name="input_8" id="input_7_8" type="text" value="" class="form-control-default form-control" placeholder="Smith" aria-required="true" aria-invalid="false"></div></div><div id="field_7_9" class="gfield gfield--type-email gfield--input-type-email gfield--width-full gfield_contains_required field_sublabel_above gfield--no-description field_description_above field_validation_below gfield_visibility_visible"  ><label class="gfield_label gform-field-label form-label" for="input_7_9">Email<span class="gfield_required"><span class="gfield_required gfield_required_text">(Required)</span></span></label><div class="ginput_container ginput_container_email">
                            <input name="input_9" id="input_7_9" type="email" value="" class="form-control-default form-control" placeholder="jsmith@example.com" aria-required="true" aria-invalid="false">
                        </div></div><div id="field_7_10" class="gfield gfield--type-phone gfield--input-type-phone gfield--width-full field_sublabel_above gfield--no-description field_description_above field_validation_below gfield_visibility_visible"  ><label class="gfield_label gform-field-label form-label" for="input_7_10">Phone</label><div class="ginput_container ginput_container_phone"><input name="input_10" id="input_7_10" type="tel" value="" class="form-control-default form-control" placeholder="(800) 555&#8209;0000" aria-invalid="false"></div></div><div id="field_7_11" class="gfield gfield--type-text gfield--input-type-text gfield--width-full gfield_contains_required field_sublabel_above gfield--no-description field_description_above field_validation_below gfield_visibility_visible"  ><label class="gfield_label gform-field-label form-label" for="input_7_11">ZIP/Postal code<span class="gfield_required"><span class="gfield_required gfield_required_text">(Required)</span></span></label><div class="ginput_container ginput_container_text"><input name="input_11" id="input_7_11" type="text" value="" class="form-control-default form-control" placeholder="90210" aria-required="true" aria-invalid="false"></div></div><div id="field_7_18" class="gfield gfield--type-text gfield--input-type-text gfield--width-full field_sublabel_above gfield--no-description field_description_above field_validation_below gfield_visibility_visible"  ><label class="gfield_label gform-field-label form-label" for="input_7_18">School Name</label><div class="ginput_container ginput_container_text"><input name="input_18" id="input_7_18" type="text" value="" class="form-control-default form-control" aria-invalid="false"></div></div><div id="field_7_13" class="gfield gfield--type-textarea gfield--input-type-textarea gfield--width-full field_sublabel_above gfield--no-description field_description_above field_validation_below gfield_visibility_visible"  ><label class="gfield_label gform-field-label form-label" for="input_7_13">How did you hear about the curriculum?</label><div class="ginput_container ginput_container_textarea"><textarea name="input_13" id="input_7_13" class="textarea form-control-default form-control" aria-invalid="false" rows="10" cols="50"></textarea></div></div><fieldset id="field_7_14" class="gfield gfield--type-consent gfield--type-choice gfield--input-type-consent gfield--width-full gfield_contains_required field_sublabel_above gfield--no-description field_description_above hidden_label field_validation_below gfield_visibility_visible"  ><legend class="gfield_label gform-field-label gfield_label_before_complex">Consent Terms &amp; Conditions<span class="gfield_required"><span class="gfield_required gfield_required_text">(Required)</span></span></legend><div class="ginput_container ginput_container_consent form-check"><input name="input_14.1" id="input_7_14_1" type="checkbox" value="1" aria-required="true" aria-invalid="false" class="form-check-input"> <label class="gform-field-label gform-field-label--type-inline gfield_consent_label form-label form-check-label" for="input_7_14_1">I agree to the Growth Energy <a href="/terms-and-conditions/">Terms and Conditions</a><span class="gfield_required gfield_required_text">(Required)</span></label><input type="hidden" name="input_14.2" value='I agree to the Growth Energy &lt;a href="/terms-and-conditions/"&gt;Terms and Conditions&lt;/a&gt;' class="gform_hidden"><input type="hidden" name="input_14.3" value="4" class="gform_hidden"></div></fieldset><fieldset id="field_7_15" class="gfield gfield--type-consent gfield--type-choice gfield--input-type-consent gfield--width-full field_sublabel_above gfield--no-description field_description_above hidden_label field_validation_below gfield_visibility_visible"  ><legend class="gfield_label gform-field-label gfield_label_before_complex">Consent Terms &amp; Conditions</legend><div class="ginput_container ginput_container_consent form-check"><input name="input_15.1" id="input_7_15_1" type="checkbox" value="1" aria-invalid="false" class="form-check-input"> <label class="gform-field-label gform-field-label--type-inline gfield_consent_label form-label form-check-label" for="input_7_15_1">Join our mailing list for early access to policy announcements, updates on our work, how you can help, and more.</label><input type="hidden" name="input_15.2" value="Join our mailing list for early access to policy announcements, updates on our work, how you can help, and more." class="gform_hidden"><input type="hidden" name="input_15.3" value="4" class="gform_hidden"></div></fieldset><div id="field_7_16" class="gfield gfield--type-html gfield--input-type-html gfield_html gfield_html_formatted gfield_no_follows_desc field_sublabel_above gfield--no-description field_description_above field_validation_below gfield_visibility_visible"  >This site is protected by reCAPTCHA and the Google <a href="https://policies.google.com/privacy">Privacy Policy</a> and <a href="https://policies.google.com/terms">Terms of Service</a> apply.</div></div></div>
        <div class='gform-footer gform_footer top_label'> <button type="submit" id="gform_submit_button_7" class="gform_btn btn-outline btn btn-outline" onclick="gform.submission.handleButtonClick(this);" data-submission-type="submit">Submit</button> <html><body></body></html>
<input type='hidden' name='gform_ajax' value='form_id=7&amp;title=1&amp;description=1&amp;tabindex=0&amp;theme=gravity-theme&amp;hash=d8c1045f237e19e5b35a19e447d2d24e' />
            <input type='hidden' class='gform_hidden' name='gform_submission_method' data-js='gform_submission_method_7' value='iframe' />
            <input type='hidden' class='gform_hidden' name='gform_theme' data-js='gform_theme_7' id='gform_theme_7' value='gravity-theme' />
            <input type='hidden' class='gform_hidden' name='gform_style_settings' data-js='gform_style_settings_7' id='gform_style_settings_7' value='' />
            <input type='hidden' class='gform_hidden' name='is_submit_7' value='1' />
            <input type='hidden' class='gform_hidden' name='gform_submit' value='7' />
            
            <input type='hidden' class='gform_hidden' name='gform_currency' data-currency='USD' value='q6k5rvadH7RwHcWhqbigpR5CkoDxp28fJkgUlCawDlX+cxVtw+KrztfQ8YDEwdlqnEY5JS9LbAnIOiumW8j8ANJ9jOi1IZvjGCEcV4ffCuJZoTM=' />
            <input type='hidden' class='gform_hidden' name='gform_unique_id' value='' />
            <input type='hidden' class='gform_hidden' name='state_7' value='WyJ7XCIxNC4xXCI6XCIwNzhlNjU3NzQzZjhmZGE1MTA1MThjMWRlNTM4ODdjOVwiLFwiMTQuMlwiOlwiNDhmYzRkN2VkNDU2N2Q2OTRkMDhmODI0OTllNTI5NGJcIixcIjE0LjNcIjpcImJiZTdiYmQ2Yzc3OTFmOWNhODIyZDY3ZjhlZDY0N2NmXCIsXCIxNS4xXCI6XCIwNzhlNjU3NzQzZjhmZGE1MTA1MThjMWRlNTM4ODdjOVwiLFwiMTUuMlwiOlwiODgxNzNhYWM1YTM3Y2VkNDY2ZmU5Yzg5ZTZmNzc0MjdcIixcIjE1LjNcIjpcImJiZTdiYmQ2Yzc3OTFmOWNhODIyZDY3ZjhlZDY0N2NmXCJ9IiwiOGY5MDRmMjc2NWY1MWRmYzUxY2QyZmQ1MWU1NjRlOTIiXQ==' />
            <input type='hidden' autocomplete='off' class='gform_hidden' name='gform_target_page_number_7' id='gform_target_page_number_7' value='0' />
            <input type='hidden' autocomplete='off' class='gform_hidden' name='gform_source_page_number_7' id='gform_source_page_number_7' value='1' />
            <input type='hidden' name='gform_field_values' value='' />
            
        </div>
                        </form>
                        </div>
		                <iframe style='display:none;width:0px;height:0px;' src='about:blank' name='gform_ajax_frame_7' id='gform_ajax_frame_7' title='This iframe contains the logic required to handle Ajax powered Gravity Forms.'></iframe>
		                <script>
gform.initializeOnLoaded( function() {gformInitSpinner( 7, 'https://growthenergy.org/wp-content/plugins/gravityforms/images/spinner.svg', true );jQuery('#gform_ajax_frame_7').on('load',function(){var contents = jQuery(this).contents().find('*').html();var is_postback = contents.indexOf('GF_AJAX_POSTBACK') >= 0;if(!is_postback){return;}var form_content = jQuery(this).contents().find('#gform_wrapper_7');var is_confirmation = jQuery(this).contents().find('#gform_confirmation_wrapper_7').length > 0;var is_redirect = contents.indexOf('gformRedirect(){') >= 0;var is_form = form_content.length > 0 && ! is_redirect && ! is_confirmation;var mt = parseInt(jQuery('html').css('margin-top'), 10) + parseInt(jQuery('body').css('margin-top'), 10) + 100;if(is_form){jQuery('#gform_wrapper_7').html(form_content.html());if(form_content.hasClass('gform_validation_error')){jQuery('#gform_wrapper_7').addClass('gform_validation_error');} else {jQuery('#gform_wrapper_7').removeClass('gform_validation_error');}setTimeout( function() { /* delay the scroll by 50 milliseconds to fix a bug in chrome */  }, 50 );if(window['gformInitDatepicker']) {gformInitDatepicker();}if(window['gformInitPriceFields']) {gformInitPriceFields();}var current_page = jQuery('#gform_source_page_number_7').val();gformInitSpinner( 7, 'https://growthenergy.org/wp-content/plugins/gravityforms/images/spinner.svg', true );jQuery(document).trigger('gform_page_loaded', [7, current_page]);window['gf_submitting_7'] = false;}else if(!is_redirect){var confirmation_content = jQuery(this).contents().find('.GF_AJAX_POSTBACK').html();if(!confirmation_content){confirmation_content = contents;}jQuery('#gform_wrapper_7').replaceWith(confirmation_content);jQuery(document).trigger('gform_confirmation_loaded', [7]);window['gf_submitting_7'] = false;wp.a11y.speak(jQuery('#gform_confirmation_message_7').text());}else{jQuery('#gform_7').append(contents);if(window['gformRedirect']) {gformRedirect();}}jQuery(document).trigger("gform_pre_post_render", [{ formId: "7", currentPage: "current_page", abort: function() { this.preventDefault(); } }]);        if (event && event.defaultPrevented) {                return;        }        const gformWrapperDiv = document.getElementById( "gform_wrapper_7" );        if ( gformWrapperDiv ) {            const visibilitySpan = document.createElement( "span" );            visibilitySpan.id = "gform_visibility_test_7";            gformWrapperDiv.insertAdjacentElement( "afterend", visibilitySpan );        }        const visibilityTestDiv = document.getElementById( "gform_visibility_test_7" );        let postRenderFired = false;        function triggerPostRender() {            if ( postRenderFired ) {                return;            }            postRenderFired = true;            gform.core.triggerPostRenderEvents( 7, current_page );            if ( visibilityTestDiv ) {                visibilityTestDiv.parentNode.removeChild( visibilityTestDiv );            }        }        function debounce( func, wait, immediate ) {            var timeout;            return function() {                var context = this, args = arguments;                var later = function() {                    timeout = null;                    if ( !immediate ) func.apply( context, args );                };                var callNow = immediate && !timeout;                clearTimeout( timeout );                timeout = setTimeout( later, wait );                if ( callNow ) func.apply( context, args );            };        }        const debouncedTriggerPostRender = debounce( function() {            triggerPostRender();        }, 200 );        if ( visibilityTestDiv && visibilityTestDiv.offsetParent === null ) {            const observer = new MutationObserver( ( mutations ) => {                mutations.forEach( ( mutation ) => {                    if ( mutation.type === 'attributes' && visibilityTestDiv.offsetParent !== null ) {                        debouncedTriggerPostRender();                        observer.disconnect();                    }                });            });            observer.observe( document.body, {                attributes: true,                childList: false,                subtree: true,                attributeFilter: [ 'style', 'class' ],            });        } else {            triggerPostRender();        }    } );} );
</script>
				</div>

			</div>
		</div>
	</div>

	
	<div id="picture-at-the-pump-modal" class="modal fade colour-scheme" tabindex="-1" role="dialog" aria-hidden="true">
		<div class="modal-dialog" role="document">
			<div class="modal-content">

				<div class="modal-header">
					<button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">Close</button>
				</div>

				<div class="modal-body">
					
	<form id="picture-at-the-pump">
		<div class="form__intro">
			<h2>Submit a Saving</h2>
		</div>

		<div class="form__body">
			<div class="form-field">
				<label for="station_location" class="form-label">
					Station Address				</label>

				<div class="form-control-container">
					<input id="station_location" class="form-control" name="station_location" placeholder="Enter address" type="text" required />
				</div>
			</div>

			<div class="form-field">
				<div class="grid">

					<div class="g-col-12 g-col-md-4">
						<label for="e10_price" class="form-label">
							E10 Price						</label>

						<div class="form-control-container">
							<input id="e10_price" min="0" step="0.001" class="form-control" name="e10_price" placeholder="$0.00" type="number" />
						</div>
					</div>

					<div class="g-col-12 g-col-md-4">
						<label for="e15_price" class="form-label">
							E15 Price						</label>

						<div class="form-control-container">
							<input id="e15_price" min="0" step="0.001" class="form-control" name="e15_price" placeholder="$0.00" type="number" />
						</div>
					</div>

					<div class="g-col-12 g-col-md-4">
						<label for="e85_price" class="form-label">
							E85 Price						</label>

						<div class="form-control-container">
							<input id="e85_price" min="0" step="0.001" class="form-control" name="e85_price" placeholder="$0.00" type="number" />
						</div>
					</div>

				</div>
			</div>

			<div class="form-field">
				<label for="date_of_photo" class="form-label">
					Date of Photo				</label>

				<div class="form-control-container">
					<input id="date_of_photo" class="form-control datepicker" name="date_of_photo" placeholder="mm/dd/yyyy" type="text" data-date-format="mm/dd/yyyy" required />
				</div>
			</div>

			<div class="form-field">
				<label for="photo" class="form-label">
					Photo				</label>

				<div class="form-control-container">
					<input id="photo" class="form-control" name="photo" type="file" required />
				</div>
			</div>

			<input type="hidden" id="security" name="security" value="403f110f18" /><input type="hidden" name="_wp_http_referer" value="/2025/09/16/2025-staff-award-winners/" />		</div>

		<div class="form__footer">
			<button class="btn btn-primary" type="submit">
				Submit			</button>
		</div>
	</form>

					</div>

			</div>
		</div>
	</div>

	<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAmginI-h471LddJInpB9Twp-yQdb3p0Ng&amp;ver=1" id="wskts-script-google-maps-js"></script>
<script id="gforms_recaptcha_recaptcha-js-extra">
var gforms_recaptcha_recaptcha_strings = {"nonce":"1978558a02","disconnect":"Disconnecting","change_connection_type":"Resetting","spinner":"https://growthenergy.org/wp-content/plugins/gravityforms/images/spinner.svg","connection_type":"classic","disable_badge":"1","change_connection_type_title":"Change Connection Type","change_connection_type_message":"Changing the connection type will delete your current settings.  Do you want to proceed?","disconnect_title":"Disconnect","disconnect_message":"Disconnecting from reCAPTCHA will delete your current settings.  Do you want to proceed?","site_key":"6LdAwL8qAAAAAMjdFEaiyqzzlWbLVZM2hTji_UsI"};
//# sourceURL=gforms_recaptcha_recaptcha-js-extra
</script>
<script src="https://www.google.com/recaptcha/api.js?render=6LdAwL8qAAAAAMjdFEaiyqzzlWbLVZM2hTji_UsI&amp;ver=2.1.0" id="gforms_recaptcha_recaptcha-js" defer data-wp-strategy="defer"></script>
<script src="https://growthenergy.org/wp-content/plugins/gravityformsrecaptcha/js/frontend.min.js?ver=2.1.0" id="gforms_recaptcha_frontend-js" defer data-wp-strategy="defer"></script>
<script id="wskt-scripts-js-extra">
var wskt = {"templateDirectory":"https://growthenergy.org/wp-content/themes/wsk-theme","ajaxURL":"https://growthenergy.org/wp-admin/admin-ajax.php","board_meetings":[],"wikiPrintLogo":"https://growthenergy.org/wp-content/themes/wsk-theme/assets/img/logo-wiki-print-styles.png"};
//# sourceURL=wskt-scripts-js-extra
</script>
<script src="https://growthenergy.org/wp-content/themes/wsk-theme/dist/js/scripts.js?ver=1764054002" id="wskt-scripts-js"></script>
<script src="https://growthenergy.org/wp-includes/js/dist/dom-ready.min.js?ver=f77871ff7694fffea381" id="wp-dom-ready-js"></script>
<script src="https://growthenergy.org/wp-includes/js/dist/hooks.min.js?ver=dd5603f07f9220ed27f1" id="wp-hooks-js"></script>
<script src="https://growthenergy.org/wp-includes/js/dist/i18n.min.js?ver=c26c3dc7bed366793375" id="wp-i18n-js"></script>
<script id="wp-i18n-js-after">
wp.i18n.setLocaleData( { 'text direction\\u0004ltr': [ 'ltr' ] } );
//# sourceURL=wp-i18n-js-after
</script>
<script src="https://growthenergy.org/wp-includes/js/dist/a11y.min.js?ver=cb460b4676c94bd228ed" id="wp-a11y-js"></script>
<script defer='defer' src="https://growthenergy.org/wp-content/plugins/gravityforms/js/jquery.json.min.js?ver=2.9.27" id="gform_json-js"></script>
<script id="gform_gravityforms-js-extra">
var gform_i18n = {"datepicker":{"days":{"monday":"Mo","tuesday":"Tu","wednesday":"We","thursday":"Th","friday":"Fr","saturday":"Sa","sunday":"Su"},"months":{"january":"January","february":"February","march":"March","april":"April","may":"May","june":"June","july":"July","august":"August","september":"September","october":"October","november":"November","december":"December"},"firstDay":0,"iconText":"Select date"}};
var gf_legacy_multi = [];
var gform_gravityforms = {"strings":{"invalid_file_extension":"This type of file is not allowed. Must be one of the following:","delete_file":"Delete this file","in_progress":"in progress","file_exceeds_limit":"File exceeds size limit","illegal_extension":"This type of file is not allowed.","max_reached":"Maximum number of files reached","unknown_error":"There was a problem while saving the file on the server","currently_uploading":"Please wait for the uploading to complete","cancel":"Cancel","cancel_upload":"Cancel this upload","cancelled":"Cancelled","error":"Error","message":"Message"},"vars":{"images_url":"https://growthenergy.org/wp-content/plugins/gravityforms/images"}};
var gf_global = {"gf_currency_config":{"name":"U.S. Dollar","symbol_left":"$","symbol_right":"","symbol_padding":"","thousand_separator":",","decimal_separator":".","decimals":2,"code":"USD"},"base_url":"https://growthenergy.org/wp-content/plugins/gravityforms","number_formats":[],"spinnerUrl":"https://growthenergy.org/wp-content/plugins/gravityforms/images/spinner.svg","version_hash":"d571a8135a2aaf953ce48d910c093434","strings":{"newRowAdded":"New row added.","rowRemoved":"Row removed","formSaved":"The form has been saved.  The content contains the link to return and complete the form."}};
var gf_global = {"gf_currency_config":{"name":"U.S. Dollar","symbol_left":"$","symbol_right":"","symbol_padding":"","thousand_separator":",","decimal_separator":".","decimals":2,"code":"USD"},"base_url":"https://growthenergy.org/wp-content/plugins/gravityforms","number_formats":[],"spinnerUrl":"https://growthenergy.org/wp-content/plugins/gravityforms/images/spinner.svg","version_hash":"d571a8135a2aaf953ce48d910c093434","strings":{"newRowAdded":"New row added.","rowRemoved":"Row removed","formSaved":"The form has been saved.  The content contains the link to return and complete the form."}};
var gf_legacy = {"is_legacy":""};
var gf_global = {"gf_currency_config":{"name":"U.S. Dollar","symbol_left":"$","symbol_right":"","symbol_padding":"","thousand_separator":",","decimal_separator":".","decimals":2,"code":"USD"},"base_url":"https://growthenergy.org/wp-content/plugins/gravityforms","number_formats":[],"spinnerUrl":"https://growthenergy.org/wp-content/plugins/gravityforms/images/spinner.svg","version_hash":"d571a8135a2aaf953ce48d910c093434","strings":{"newRowAdded":"New row added.","rowRemoved":"Row removed","formSaved":"The form has been saved.  The content contains the link to return and complete the form."}};
var gf_global = {"gf_currency_config":{"name":"U.S. Dollar","symbol_left":"$","symbol_right":"","symbol_padding":"","thousand_separator":",","decimal_separator":".","decimals":2,"code":"USD"},"base_url":"https://growthenergy.org/wp-content/plugins/gravityforms","number_formats":[],"spinnerUrl":"https://growthenergy.org/wp-content/plugins/gravityforms/images/spinner.svg","version_hash":"d571a8135a2aaf953ce48d910c093434","strings":{"newRowAdded":"New row added.","rowRemoved":"Row removed","formSaved":"The form has been saved.  The content contains the link to return and complete the form."}};
var gf_global = {"gf_currency_config":{"name":"U.S. Dollar","symbol_left":"$","symbol_right":"","symbol_padding":"","thousand_separator":",","decimal_separator":".","decimals":2,"code":"USD"},"base_url":"https://growthenergy.org/wp-content/plugins/gravityforms","number_formats":[],"spinnerUrl":"https://growthenergy.org/wp-content/plugins/gravityforms/images/spinner.svg","version_hash":"d571a8135a2aaf953ce48d910c093434","strings":{"newRowAdded":"New row added.","rowRemoved":"Row removed","formSaved":"The form has been saved.  The content contains the link to return and complete the form."}};
var gf_global = {"gf_currency_config":{"name":"U.S. Dollar","symbol_left":"$","symbol_right":"","symbol_padding":"","thousand_separator":",","decimal_separator":".","decimals":2,"code":"USD"},"base_url":"https://growthenergy.org/wp-content/plugins/gravityforms","number_formats":[],"spinnerUrl":"https://growthenergy.org/wp-content/plugins/gravityforms/images/spinner.svg","version_hash":"d571a8135a2aaf953ce48d910c093434","strings":{"newRowAdded":"New row added.","rowRemoved":"Row removed","formSaved":"The form has been saved.  The content contains the link to return and complete the form."}};
//# sourceURL=gform_gravityforms-js-extra
</script>
<script defer='defer' src="https://growthenergy.org/wp-content/plugins/gravityforms/js/gravityforms.min.js?ver=2.9.27" id="gform_gravityforms-js"></script>
<script defer='defer' src="https://growthenergy.org/wp-content/plugins/gravityforms/js/placeholders.jquery.min.js?ver=2.9.27" id="gform_placeholder-js"></script>
<script defer='defer' src="https://growthenergy.org/wp-content/plugins/gravityforms/assets/js/dist/utils.min.js?ver=48a3755090e76a154853db28fc254681" id="gform_gravityforms_utils-js"></script>
<script defer='defer' src="https://growthenergy.org/wp-content/plugins/gravityforms/assets/js/dist/vendor-theme.min.js?ver=4f8b3915c1c1e1a6800825abd64b03cb" id="gform_gravityforms_theme_vendors-js"></script>
<script id="gform_gravityforms_theme-js-extra">
var gform_theme_config = {"common":{"form":{"honeypot":{"version_hash":"d571a8135a2aaf953ce48d910c093434"},"ajax":{"ajaxurl":"https://growthenergy.org/wp-admin/admin-ajax.php","ajax_submission_nonce":"15bcee3cf9","i18n":{"step_announcement":"Step %1$s of %2$s, %3$s","unknown_error":"There was an unknown error processing your request. Please try again."}}}},"hmr_dev":"","public_path":"https://growthenergy.org/wp-content/plugins/gravityforms/assets/js/dist/","config_nonce":"7d181e1b21"};
//# sourceURL=gform_gravityforms_theme-js-extra
</script>
<script defer='defer' src="https://growthenergy.org/wp-content/plugins/gravityforms/assets/js/dist/scripts-theme.min.js?ver=0183eae4c8a5f424290fa0c1616e522c" id="gform_gravityforms_theme-js"></script>
<script src="https://growthenergy.org/wp-includes/js/plupload/moxie.min.js?ver=1.3.5.1" id="moxiejs-js"></script>
<script src="https://growthenergy.org/wp-includes/js/plupload/plupload.min.js?ver=2.1.9" id="plupload-js"></script>
<script>
gform.initializeOnLoaded( function() { jQuery(document).on('gform_post_render', function(event, formId, currentPage){if(formId == 4) {if(typeof Placeholders != 'undefined'){
                        Placeholders.enable();
                    }} } );jQuery(document).on('gform_post_conditional_logic', function(event, formId, fields, isInit){} ) } );
</script>
<script>
gform.initializeOnLoaded( function() {jQuery(document).trigger("gform_pre_post_render", [{ formId: "4", currentPage: "1", abort: function() { this.preventDefault(); } }]);        if (event && event.defaultPrevented) {                return;        }        const gformWrapperDiv = document.getElementById( "gform_wrapper_4" );        if ( gformWrapperDiv ) {            const visibilitySpan = document.createElement( "span" );            visibilitySpan.id = "gform_visibility_test_4";            gformWrapperDiv.insertAdjacentElement( "afterend", visibilitySpan );        }        const visibilityTestDiv = document.getElementById( "gform_visibility_test_4" );        let postRenderFired = false;        function triggerPostRender() {            if ( postRenderFired ) {                return;            }            postRenderFired = true;            gform.core.triggerPostRenderEvents( 4, 1 );            if ( visibilityTestDiv ) {                visibilityTestDiv.parentNode.removeChild( visibilityTestDiv );            }        }        function debounce( func, wait, immediate ) {            var timeout;            return function() {                var context = this, args = arguments;                var later = function() {                    timeout = null;                    if ( !immediate ) func.apply( context, args );                };                var callNow = immediate && !timeout;                clearTimeout( timeout );                timeout = setTimeout( later, wait );                if ( callNow ) func.apply( context, args );            };        }        const debouncedTriggerPostRender = debounce( function() {            triggerPostRender();        }, 200 );        if ( visibilityTestDiv && visibilityTestDiv.offsetParent === null ) {            const observer = new MutationObserver( ( mutations ) => {                mutations.forEach( ( mutation ) => {                    if ( mutation.type === 'attributes' && visibilityTestDiv.offsetParent !== null ) {                        debouncedTriggerPostRender();                        observer.disconnect();                    }                });            });            observer.observe( document.body, {                attributes: true,                childList: false,                subtree: true,                attributeFilter: [ 'style', 'class' ],            });        } else {            triggerPostRender();        }    } );
</script>
<script>
gform.initializeOnLoaded( function() { jQuery(document).on('gform_post_render', function(event, formId, currentPage){if(formId == 1) {if(typeof Placeholders != 'undefined'){
                        Placeholders.enable();
                    }} } );jQuery(document).on('gform_post_conditional_logic', function(event, formId, fields, isInit){} ) } );
</script>
<script>
gform.initializeOnLoaded( function() {jQuery(document).trigger("gform_pre_post_render", [{ formId: "1", currentPage: "1", abort: function() { this.preventDefault(); } }]);        if (event && event.defaultPrevented) {                return;        }        const gformWrapperDiv = document.getElementById( "gform_wrapper_1" );        if ( gformWrapperDiv ) {            const visibilitySpan = document.createElement( "span" );            visibilitySpan.id = "gform_visibility_test_1";            gformWrapperDiv.insertAdjacentElement( "afterend", visibilitySpan );        }        const visibilityTestDiv = document.getElementById( "gform_visibility_test_1" );        let postRenderFired = false;        function triggerPostRender() {            if ( postRenderFired ) {                return;            }            postRenderFired = true;            gform.core.triggerPostRenderEvents( 1, 1 );            if ( visibilityTestDiv ) {                visibilityTestDiv.parentNode.removeChild( visibilityTestDiv );            }        }        function debounce( func, wait, immediate ) {            var timeout;            return function() {                var context = this, args = arguments;                var later = function() {                    timeout = null;                    if ( !immediate ) func.apply( context, args );                };                var callNow = immediate && !timeout;                clearTimeout( timeout );                timeout = setTimeout( later, wait );                if ( callNow ) func.apply( context, args );            };        }        const debouncedTriggerPostRender = debounce( function() {            triggerPostRender();        }, 200 );        if ( visibilityTestDiv && visibilityTestDiv.offsetParent === null ) {            const observer = new MutationObserver( ( mutations ) => {                mutations.forEach( ( mutation ) => {                    if ( mutation.type === 'attributes' && visibilityTestDiv.offsetParent !== null ) {                        debouncedTriggerPostRender();                        observer.disconnect();                    }                });            });            observer.observe( document.body, {                attributes: true,                childList: false,                subtree: true,                attributeFilter: [ 'style', 'class' ],            });        } else {            triggerPostRender();        }    } );
</script>
<script>
gform.initializeOnLoaded( function() { jQuery(document).on('gform_post_render', function(event, formId, currentPage){if(formId == 2) {gformInitCurrencyFormatFields('#input_2_4');} } );jQuery(document).on('gform_post_conditional_logic', function(event, formId, fields, isInit){} ) } );
</script>
<script>
gform.initializeOnLoaded( function() {jQuery(document).trigger("gform_pre_post_render", [{ formId: "2", currentPage: "1", abort: function() { this.preventDefault(); } }]);        if (event && event.defaultPrevented) {                return;        }        const gformWrapperDiv = document.getElementById( "gform_wrapper_2" );        if ( gformWrapperDiv ) {            const visibilitySpan = document.createElement( "span" );            visibilitySpan.id = "gform_visibility_test_2";            gformWrapperDiv.insertAdjacentElement( "afterend", visibilitySpan );        }        const visibilityTestDiv = document.getElementById( "gform_visibility_test_2" );        let postRenderFired = false;        function triggerPostRender() {            if ( postRenderFired ) {                return;            }            postRenderFired = true;            gform.core.triggerPostRenderEvents( 2, 1 );            if ( visibilityTestDiv ) {                visibilityTestDiv.parentNode.removeChild( visibilityTestDiv );            }        }        function debounce( func, wait, immediate ) {            var timeout;            return function() {                var context = this, args = arguments;                var later = function() {                    timeout = null;                    if ( !immediate ) func.apply( context, args );                };                var callNow = immediate && !timeout;                clearTimeout( timeout );                timeout = setTimeout( later, wait );                if ( callNow ) func.apply( context, args );            };        }        const debouncedTriggerPostRender = debounce( function() {            triggerPostRender();        }, 200 );        if ( visibilityTestDiv && visibilityTestDiv.offsetParent === null ) {            const observer = new MutationObserver( ( mutations ) => {                mutations.forEach( ( mutation ) => {                    if ( mutation.type === 'attributes' && visibilityTestDiv.offsetParent !== null ) {                        debouncedTriggerPostRender();                        observer.disconnect();                    }                });            });            observer.observe( document.body, {                attributes: true,                childList: false,                subtree: true,                attributeFilter: [ 'style', 'class' ],            });        } else {            triggerPostRender();        }    } );
</script>
<script>
gform.initializeOnLoaded( function() { jQuery(document).on('gform_post_render', function(event, formId, currentPage){if(formId == 6) {if(typeof Placeholders != 'undefined'){
                        Placeholders.enable();
                    }} } );jQuery(document).on('gform_post_conditional_logic', function(event, formId, fields, isInit){} ) } );
</script>
<script>
gform.initializeOnLoaded( function() {jQuery(document).trigger("gform_pre_post_render", [{ formId: "6", currentPage: "1", abort: function() { this.preventDefault(); } }]);        if (event && event.defaultPrevented) {                return;        }        const gformWrapperDiv = document.getElementById( "gform_wrapper_6" );        if ( gformWrapperDiv ) {            const visibilitySpan = document.createElement( "span" );            visibilitySpan.id = "gform_visibility_test_6";            gformWrapperDiv.insertAdjacentElement( "afterend", visibilitySpan );        }        const visibilityTestDiv = document.getElementById( "gform_visibility_test_6" );        let postRenderFired = false;        function triggerPostRender() {            if ( postRenderFired ) {                return;            }            postRenderFired = true;            gform.core.triggerPostRenderEvents( 6, 1 );            if ( visibilityTestDiv ) {                visibilityTestDiv.parentNode.removeChild( visibilityTestDiv );            }        }        function debounce( func, wait, immediate ) {            var timeout;            return function() {                var context = this, args = arguments;                var later = function() {                    timeout = null;                    if ( !immediate ) func.apply( context, args );                };                var callNow = immediate && !timeout;                clearTimeout( timeout );                timeout = setTimeout( later, wait );                if ( callNow ) func.apply( context, args );            };        }        const debouncedTriggerPostRender = debounce( function() {            triggerPostRender();        }, 200 );        if ( visibilityTestDiv && visibilityTestDiv.offsetParent === null ) {            const observer = new MutationObserver( ( mutations ) => {                mutations.forEach( ( mutation ) => {                    if ( mutation.type === 'attributes' && visibilityTestDiv.offsetParent !== null ) {                        debouncedTriggerPostRender();                        observer.disconnect();                    }                });            });            observer.observe( document.body, {                attributes: true,                childList: false,                subtree: true,                attributeFilter: [ 'style', 'class' ],            });        } else {            triggerPostRender();        }    } );
</script>
<script>
gform.initializeOnLoaded( function() { jQuery(document).on('gform_post_render', function(event, formId, currentPage){if(formId == 7) {if(typeof Placeholders != 'undefined'){
                        Placeholders.enable();
                    }} } );jQuery(document).on('gform_post_conditional_logic', function(event, formId, fields, isInit){} ) } );
</script>
<script>
gform.initializeOnLoaded( function() {jQuery(document).trigger("gform_pre_post_render", [{ formId: "7", currentPage: "1", abort: function() { this.preventDefault(); } }]);        if (event && event.defaultPrevented) {                return;        }        const gformWrapperDiv = document.getElementById( "gform_wrapper_7" );        if ( gformWrapperDiv ) {            const visibilitySpan = document.createElement( "span" );            visibilitySpan.id = "gform_visibility_test_7";            gformWrapperDiv.insertAdjacentElement( "afterend", visibilitySpan );        }        const visibilityTestDiv = document.getElementById( "gform_visibility_test_7" );        let postRenderFired = false;        function triggerPostRender() {            if ( postRenderFired ) {                return;            }            postRenderFired = true;            gform.core.triggerPostRenderEvents( 7, 1 );            if ( visibilityTestDiv ) {                visibilityTestDiv.parentNode.removeChild( visibilityTestDiv );            }        }        function debounce( func, wait, immediate ) {            var timeout;            return function() {                var context = this, args = arguments;                var later = function() {                    timeout = null;                    if ( !immediate ) func.apply( context, args );                };                var callNow = immediate && !timeout;                clearTimeout( timeout );                timeout = setTimeout( later, wait );                if ( callNow ) func.apply( context, args );            };        }        const debouncedTriggerPostRender = debounce( function() {            triggerPostRender();        }, 200 );        if ( visibilityTestDiv && visibilityTestDiv.offsetParent === null ) {            const observer = new MutationObserver( ( mutations ) => {                mutations.forEach( ( mutation ) => {                    if ( mutation.type === 'attributes' && visibilityTestDiv.offsetParent !== null ) {                        debouncedTriggerPostRender();                        observer.disconnect();                    }                });            });            observer.observe( document.body, {                attributes: true,                childList: false,                subtree: true,                attributeFilter: [ 'style', 'class' ],            });        } else {            triggerPostRender();        }    } );
</script>

	</body>
</html>`,
        destinationKey: 'linebreak',
        options: {
            ignore: 'nav, footer, header, form, iframe',
        },
    };

    @node({
        id: '36c21f85-8ac7-4482-9cd2-3d6f72c4cf51',
        name: 'Edit Fields1',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [-208, 1584],
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
        id: '61eb3f13-505b-4447-8b60-e51bbc75684f',
        name: 'RSS search fields2',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [-656, 1584],
    })
    RssSearchFields2 = {
        assignments: {
            assignments: [
                {
                    id: '53313200-69a8-4749-b320-7ad926795be1',
                    name: 'title',
                    value: "={{ $('Merge').item.json.title || $('Create summary and title9').item.json.output.title }}",
                    type: 'string',
                },
                {
                    id: 'ab5c9158-a33a-4f8f-b6d0-a6787df0f0d5',
                    name: 'content',
                    value: `=RSS Article Description: 
{{ $if($('Merge').isExecuted, $('Merge').item.json['content:encodedSnippet'], '') || '' }}

{{ $if($('Merge').isExecuted, $('Merge').item.json.contentSnippet, '') }}
------------------
Article page:
{{ (function() {
  // 1. Get the raw data
  let rawData = ($('Markdown1').item.json.linebreak && $('Markdown1').item.json.linebreak.length > 0)
    ? $('Markdown1').item.json.linebreak.removeMarkdown()
    : ($('extract content').item.json.data || '');

  // 2. Extract Metadata Description (Caption)
  // This is the most important part for Instagram links
  let metaMatch = rawData.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']*)["']/i) 
               || rawData.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i);
  let metaDescription = metaMatch ? metaMatch[1] : '';

  // 3. Clean the HTML for the body
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

  // 4. Return combined results
  return (metaDescription + "\\n\\n" + cleanedPage).trim() || "No content found";
})() }}`,
                    type: 'string',
                },
                {
                    id: 'f0c15fc7-071d-406d-8200-abecbf458836',
                    name: 'url',
                    value: "={{ $('Merge').item.json.link }}",
                    type: 'string',
                },
                {
                    id: 'b72746e5-4271-48e7-af68-4e1bdfd40452',
                    name: 'summary',
                    value: "={{ $('Create summary and title9').item.json.output.summary }}",
                    type: 'string',
                },
                {
                    id: '39872c24-4acc-4513-b7fb-7689cd511afb',
                    name: 'search_query',
                    value: "={{ $if($('Limit').isExecuted, $('Limit').item.json.property_rss_feed, undefined) || $if($('When Executed by Another Workflow').isExecuted, $('When Executed by Another Workflow').item.json.url_or_keyword, undefined) }}",
                    type: 'string',
                },
                {
                    id: '42852696-c7af-4ce4-a273-e61970ef2e8f',
                    name: 'publication_date',
                    value: "={{ $if($('Merge').isExecuted, $('Merge').item.json.pubDate || $('extract date1').item.json.publishedDate ||'') }}",
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
                    value: 'RSS',
                    type: 'string',
                },
                {
                    id: '8a7e7ea6-40c1-490d-8d37-ec928232766c',
                    name: 'source_name',
                    value: "={{ $('When Executed by Another Workflow').item.json.property_name }}",
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
        id: '73a850d1-b464-41d5-919a-5719db6e866e',
        name: 'RSS search fields3',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [-880, 1584],
    })
    RssSearchFields3 = {
        assignments: {
            assignments: [
                {
                    id: '53313200-69a8-4749-b320-7ad926795be1',
                    name: 'title',
                    value: "={{ $('Merge').item.json.title || $('Create summary and title').item.json.output.title }}",
                    type: 'string',
                },
                {
                    id: 'ab5c9158-a33a-4f8f-b6d0-a6787df0f0d5',
                    name: 'content',
                    value: `=RSS Article Description: 
{{ $if($('Merge').isExecuted, $('Merge').item.json['content:encodedSnippet'], '') || '' }}

{{ $if($('Merge').isExecuted, $('Merge').item.json.contentSnippet, '') }}
------------------
Article page:
{{ 
  $('Scrape a url and get its content2').item.json.data.markdown.removeMarkdown()
}}`,
                    type: 'string',
                },
                {
                    id: 'f0c15fc7-071d-406d-8200-abecbf458836',
                    name: 'url',
                    value: "={{ $('Merge').item.json.link }}",
                    type: 'string',
                },
                {
                    id: 'b72746e5-4271-48e7-af68-4e1bdfd40452',
                    name: 'summary',
                    value: "={{ $('Create summary and title').item.json.output.summary }}",
                    type: 'string',
                },
                {
                    id: '39872c24-4acc-4513-b7fb-7689cd511afb',
                    name: 'search_query',
                    value: "={{ $if($('Limit').isExecuted, $('Limit').item.json.property_rss_feed, undefined) || $if($('When Executed by Another Workflow').isExecuted, $('When Executed by Another Workflow').item.json.url_or_keyword, undefined) }}",
                    type: 'string',
                },
                {
                    id: '42852696-c7af-4ce4-a273-e61970ef2e8f',
                    name: 'publication_date',
                    value: "={{ $if($('Merge').isExecuted, $('Merge').item.json.pubDate || $('Scrape a url and get its content2').item.json.data.metadata.publishedTime || $('Scrape a url and get its content2').item.json.data.metadata.publishedTime || $('Scrape a url and get its content2').item.json.data.metadata['article:published_time'], '') }}",
                    type: 'string',
                },
                {
                    id: '6bd73285-c360-4b10-8567-8ae66ecba2bd',
                    name: 'prompt',
                    value: "={{ $('When Executed by Another Workflow').first().json.source }}",
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
                    value: 'RSS',
                    type: 'string',
                },
                {
                    id: 'df785b48-f361-48bf-9766-2d16bdd1a5e2',
                    name: 'source_name',
                    value: "={{ $('When Executed by Another Workflow').item.json.property_name }}",
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
        id: '5bd001e4-24b7-4ea9-92a4-de288d4a1c0b',
        name: 'Get 20 Ideas',
        type: 'n8n-nodes-base.limit',
        version: 1,
        position: [240, 544],
    })
    Get20Ideas = {
        maxItems: 20,
    };

    @node({
        id: '85f44f68-4bec-441c-a976-d0571a0a7435',
        name: 'Sticky Note',
        type: 'n8n-nodes-base.stickyNote',
        version: 1,
        position: [1056, -368],
    })
    StickyNote = {
        content: `## Errors
Fire crawl isn't needed, neither is extract content, because the RSS feed node actually gets the website content that we need:

https://www.loom.com/share/a54cefd8ad534730b2f0a7ed4b6cbfbc
`,
        height: 176,
        width: 384,
        color: 3,
    };

    @node({
        id: '14634843-fed9-41bf-bd00-768be891f6c0',
        name: 'Edit Fields2',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [2208, 752],
    })
    EditFields2 = {
        assignments: {
            assignments: [
                {
                    id: 'e26a2ad4-804b-4a4d-8075-861705f91bb1',
                    name: 'data',
                    value: `=Article page:
{{ (function () {
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
        id: '4d398560-e895-4784-a5f2-cbfac2d29ab1',
        name: 'OpenAI Chat Model',
        type: '@n8n/n8n-nodes-langchain.lmChatOpenAi',
        version: 1.3,
        position: [2512, 976],
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
        options: {},
    };

    @node({
        id: 'a2e185a1-2a8b-4a08-827e-bd02a54196ad',
        name: 'Extract Clean Content',
        type: '@n8n/n8n-nodes-langchain.chainLlm',
        version: 1.9,
        position: [2432, 752],
        retryOnFail: true,
        waitBetweenTries: 5000,
    })
    ExtractCleanContent = {
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
        batching: {},
    };

    @node({
        id: '8f367ca8-31ce-46b2-ac2b-24226eb3ce2b',
        name: 'Anthropic Chat Model',
        type: '@n8n/n8n-nodes-langchain.lmChatAnthropic',
        version: 1.3,
        position: [1568, 1184],
        credentials: { anthropicApi: { id: '0c1nNLaJWpeD3Cqz', name: 'Syntech GM Anthropic account' } },
    })
    AnthropicChatModel = {
        model: {
            __rl: true,
            value: 'claude-haiku-4-5-20251001',
            mode: 'list',
            cachedResultName: 'Claude Haiku 4.5',
        },
        options: {
            temperature: 0,
        },
    };

    @node({
        id: 'a622c7c3-9412-4c0c-ad82-f6458f031dad',
        name: 'OpenAI Chat Model5',
        type: '@n8n/n8n-nodes-langchain.lmChatOpenAi',
        version: 1.3,
        position: [1360, 976],
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

    @node({
        id: '7d9cadf6-d476-4e80-98c8-38f6dc8825ef',
        name: 'OpenAI Chat Model6',
        type: '@n8n/n8n-nodes-langchain.lmChatOpenAi',
        version: 1.3,
        position: [1872, 464],
        credentials: { openAiApi: { id: 'NoEKitspBJb0zQrp', name: 'Syntech GM OpenAi account' } },
    })
    OpenaiChatModel6 = {
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
        id: '30333a13-4f13-4519-9a43-7a853b2a8435',
        name: 'Anthropic Chat Model1',
        type: '@n8n/n8n-nodes-langchain.lmChatAnthropic',
        version: 1.3,
        position: [2096, 672],
        credentials: { anthropicApi: { id: '0c1nNLaJWpeD3Cqz', name: 'Syntech GM Anthropic account' } },
    })
    AnthropicChatModel1 = {
        model: {
            __rl: true,
            value: 'claude-haiku-4-5-20251001',
            mode: 'list',
            cachedResultName: 'Claude Haiku 4.5',
        },
        options: {
            temperature: 0,
        },
    };

    // =====================================================================
    // ROUTAGE ET CONNEXIONS
    // =====================================================================

    @links()
    defineRouting() {
        this.WhenExecutedByAnotherWorkflow.out(0).to(this.Limit.in(0));
        this.RssRead.out(0).to(this.EditFields.in(0));
        this.RssRead.out(1).to(this.GetManyRows1.in(0));
        this.ScrapeAUrlAndGetItsContent2.out(0).to(this.IfNotError.in(0));
        this.IfNotError.out(0).to(this.CreateSummaryAndTitle.in(0));
        this.IfNotError.out(1).to(this.LoopOverItems4.in(0));
        this.ExtractContent.out(0).to(this.ExtractDate1.in(0));
        this.ExtractContent.out(1).to(this.Wait.in(0));
        this.Markdown1.out(0).to(this.CreateSummaryAndTitle9.in(0));
        this.ExtractDate1.out(0).to(this.Markdown1.in(0));
        this.LoopOverItems4.out(1).to(this.EitherUrlOrKeyword4.in(0));
        this.CreateSummaryAndTitle.out(0).to(this.CreateARow.in(0));
        this.Merge9.out(0).to(this.LoopOverItems4.in(0));
        this.CreateSummaryAndTitle9.out(0).to(this.CreateARow1.in(0));
        this.EitherUrlOrKeyword4.out(0).to(this.RssRead.in(0));
        this.RssSearchFields.out(0).to(this.Merge9.in(1));
        this.RssSearchFields1.out(0).to(this.Merge9.in(0));
        this.Merge.out(0).to(this.If1.in(0));
        this.If1.out(0).to(this.Get20Ideas.in(0));
        this.If1.out(1).to(this.LoopOverItems4.in(0));
        this.SetUrls.out(0).to(this.ExtractContent.in(0));
        this.EditFields.out(0).to(this.Merge.in(0));
        this.Wait.out(0).to(this.ScrapeAUrlAndGetItsContent2.in(0));
        this.Limit.out(0).to(this.LoopOverItems4.in(0));
        this.GetManyRowsSb.out(0).to(this.CreateARowSb1.in(0));
        this.CreateARowSb.out(0).to(this.RssSearchFields3.in(0));
        this.CreateARowSb1.out(0).to(this.CreateARowSb.in(0));
        this.GetManyRows1.out(0).to(this.Merge.in(1));
        this.CreateARow.out(0).to(this.RssSearchFields1.in(0));
        this.CreateARow1.out(0).to(this.EditFields2.in(0));
        this.Markdown.out(0).to(this.EditFields1.in(0));
        this.RssSearchFields3.out(0).to(this.RssSearchFields2.in(0));
        this.RssSearchFields2.out(0).to(this.Markdown.in(0));
        this.Get20Ideas.out(0).to(this.SetUrls.in(0));
        this.EditFields2.out(0).to(this.ExtractCleanContent.in(0));
        this.ExtractCleanContent.out(0).to(this.RssSearchFields.in(0));

        this.CreateSummaryAndTitle.uses({
            ai_languageModel: this.OpenaiChatModel6.output,
            ai_outputParser: this.StructuredOutputParser2.output,
        });
        this.StructuredOutputParser2.uses({
            ai_languageModel: this.AnthropicChatModel1.output,
        });
        this.CreateSummaryAndTitle9.uses({
            ai_languageModel: this.OpenaiChatModel5.output,
            ai_outputParser: this.StructuredOutputParser6.output,
        });
        this.StructuredOutputParser6.uses({
            ai_languageModel: this.AnthropicChatModel.output,
        });
        this.ExtractCleanContent.uses({
            ai_languageModel: this.OpenaiChatModel.output,
        });
    }
}
