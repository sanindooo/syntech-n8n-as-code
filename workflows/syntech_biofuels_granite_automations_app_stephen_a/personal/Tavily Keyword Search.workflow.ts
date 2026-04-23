import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : Tavily Keyword Search
// Nodes   : 45  |  Connections: 33
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// WhenExecutedByAnotherWorkflow      executeWorkflowTrigger
// Search                             tavily                     [onError→out(1)] [creds]
// Limit2                             limit
// ScrapeAUrlAndGetItsContent4        firecrawl                  [onError→regular] [creds]
// EitherUrlOrKeyword3                set
// Merge8                             merge
// ExtractContent1                    httpRequest                [onError→out(1)]
// LoopOverItems5                     splitInBatches
// Markdown6                          markdown
// ExtractDate                        code
// StructuredOutputParser5            outputParserStructured     [AI] [ai_outputParser]
// CreateSummaryAndTitle2             chainLlm                   [AI] [retry]
// OpenaiChatModel6                   lmChatOpenAi               [creds]
// StructuredOutputParser7            outputParserStructured     [AI] [ai_outputParser]
// HttpsFields                        set
// TavilySearchFields1                set
// StickyNote                         stickyNote
// Merge                              merge                      [alwaysOutput]
// IfUrl                              if
// CreateLongtailKeywordOld           chainLlm                   [AI] [retry]
// SplitOutSearches                   splitOut
// SplitOutResults                    splitOut                   [alwaysOutput]
// Deepseek32                         lmChatOpenRouter           [creds]
// Deepseek3                          lmChatOpenRouter           [creds]
// CreateLongtailKeyword              chainLlm                   [retry]
// CreateLongtailKeywordClaudeOptimised chainLlm                   [AI] [retry]
// StructuredOutputParser             outputParserStructured     [ai_outputParser]
// CreateLongtailKeywordClaudeOptimised1 chainLlm                   [retry]
// IfNotError                         if
// RemoveDuplicates                   removeDuplicates           [alwaysOutput]
// GetManyRowsSb                      supabase                   [creds] [executeOnce]
// CreateARowSb2                      supabase                   [creds]
// CreateARowSb3                      supabase                   [creds]
// CreateARow                         dataTable
// GetManyRows1                       dataTable                  [executeOnce]
// CreateARow1                        dataTable
// OpenaiChatModel                    lmChatOpenAi               [creds]
// OpenaiChatModel1                   lmChatOpenAi               [creds]
// AnthropicChatModel                 lmChatAnthropic            [creds] [ai_languageModel]
// AnthropicChatModel1                lmChatAnthropic            [creds] [ai_languageModel]
// AnthropicChatModel2                lmChatAnthropic            [creds] [ai_languageModel]
// OpenaiChatModel3                   lmChatOpenAi               [creds] [ai_languageModel]
// ExtractingCleanArticle             chainLlm                   [AI] [retry]
// AnthropicChatModel3                lmChatAnthropic            [creds] [ai_languageModel]
// SetArticleContent                  set
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// WhenExecutedByAnotherWorkflow
//    → Limit2
//      → LoopOverItems5
//       .out(1) → EitherUrlOrKeyword3
//          → CreateLongtailKeywordClaudeOptimised
//            → SplitOutSearches
//              → Search
//                → SplitOutResults
//                  → Merge
//                    → IfUrl
//                      → RemoveDuplicates
//                        → ExtractContent1
//                          → ExtractDate
//                            → Markdown6
//                              → CreateSummaryAndTitle2
//                                → CreateARow1
//                                  → SetArticleContent
//                                    → ExtractingCleanArticle
//                                      → HttpsFields
//                                        → Merge8.in(1)
//                                          → LoopOverItems5 (↩ loop)
//                         .out(1) → ScrapeAUrlAndGetItsContent4
//                            → IfNotError
//                              → CreateARow
//                                → TavilySearchFields1
//                                  → Merge8 (↩ loop)
//                             .out(1) → LoopOverItems5 (↩ loop)
//                     .out(1) → LoopOverItems5 (↩ loop)
//                  → GetManyRows1
//                    → Merge.in(1) (↩ loop)
//               .out(1) → LoopOverItems5 (↩ loop)
// CreateLongtailKeywordOld
//    → GetManyRowsSb
//      → CreateARowSb3
//        → CreateARowSb2
//
// AI CONNECTIONS
// StructuredOutputParser5.uses({ ai_languageModel: AnthropicChatModel3 })
// CreateSummaryAndTitle2.uses({ ai_outputParser: StructuredOutputParser7, ai_languageModel: AnthropicChatModel1 })
// StructuredOutputParser7.uses({ ai_languageModel: AnthropicChatModel2 })
// CreateLongtailKeywordOld.uses({ ai_outputParser: StructuredOutputParser })
// CreateLongtailKeywordClaudeOptimised.uses({ ai_outputParser: StructuredOutputParser5, ai_languageModel: AnthropicChatModel })
// ExtractingCleanArticle.uses({ ai_languageModel: OpenaiChatModel3 })
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'N0iykcUkUjgXDL0k',
    name: 'Tavily Keyword Search',
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
export class TavilyKeywordSearchWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'ee25570c-8668-4102-a1c6-e1d825a0a800',
        name: 'When Executed by Another Workflow',
        type: 'n8n-nodes-base.executeWorkflowTrigger',
        version: 1.1,
        position: [-3024, 912],
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
        id: '5921a686-3040-48fa-a8fb-5cafcb9e19f3',
        name: 'Search',
        type: '@tavily/n8n-nodes-tavily.tavily',
        version: 1,
        position: [-1280, 272],
        credentials: { tavilyApi: { id: 'a0EwrVfEBKcaROmO', name: 'Syntech Stephen Tavily account' } },
        onError: 'continueErrorOutput',
        alwaysOutputData: false,
    })
    Search = {
        query: "={{ $('Split Out Searches').item.json.output }}",
        options: {
            topic: 'news',
            search_depth: 'advanced',
            time_range: 'month',
        },
    };

    @node({
        id: '4d819dfa-2e7e-44ce-a1c6-aefca308dde8',
        name: 'Limit2',
        type: 'n8n-nodes-base.limit',
        version: 1,
        position: [-2800, 912],
    })
    Limit2 = {
        maxItems: 100,
    };

    @node({
        id: 'ceb073d5-46c8-4738-8d8b-cb935ca0d772',
        name: 'Scrape a url and get its content4',
        type: '@mendable/n8n-nodes-firecrawl.firecrawl',
        version: 1,
        position: [288, 64],
        credentials: { firecrawlApi: { id: 'i4QliNET9guWjKJf', name: 'Syntech GM Firecrawl account' } },
        onError: 'continueRegularOutput',
        executeOnce: false,
    })
    ScrapeAUrlAndGetItsContent4 = {
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
        id: 'c5f87772-46f4-49b3-8648-708db0bcf7f1',
        name: 'Either Url or Keyword3',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [-2352, 272],
    })
    EitherUrlOrKeyword3 = {
        assignments: {
            assignments: [
                {
                    id: '8efead37-57d8-4101-9010-c855f2525db6',
                    name: 'url_or_keyword',
                    value: '={{ $json.property_name || $json.url_or_keyword }}',
                    type: 'string',
                },
                {
                    id: '1bf13ab6-84ba-4faf-ae05-c664b1e9c8cd',
                    name: 'prompt',
                    value: '={{ $json.prompt }}',
                    type: 'string',
                },
                {
                    id: 'e49600f7-c2d9-46d2-9903-5bc13fbb7f78',
                    name: 'additional_formats',
                    value: '={{ $json.additional_formats }}',
                    type: 'string',
                },
                {
                    id: '7654f174-9525-47d6-aa35-eda8fe63abfa',
                    name: 'set_source_name',
                    value: "={{ $('When Executed by Another Workflow').item.json.property_name }}",
                    type: 'string',
                },
            ],
        },
        options: {},
    };

    @node({
        id: '35c579c4-ea75-4729-a9f6-5fbf144f9f84',
        name: 'Merge8',
        type: 'n8n-nodes-base.merge',
        version: 3.2,
        position: [2384, 464],
    })
    Merge8 = {};

    @node({
        id: '7e8a0203-0f91-4305-b4f0-2e1ffe5b5fbb',
        name: 'extract content1',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.2,
        position: [64, 272],
        onError: 'continueErrorOutput',
    })
    ExtractContent1 = {
        url: "={{ $('Merge').item.json.url }}",
        sendHeaders: true,
        headerParameters: {
            parameters: [
                {
                    name: 'User-Agent',
                    value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                },
                {
                    name: 'Accept',
                    value: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                },
                {
                    name: 'Accept-Language',
                    value: 'en-US,en;q=0.9',
                },
                {
                    name: 'Cache-Control',
                    value: 'no-cache',
                },
            ],
        },
        options: {},
    };

    @node({
        id: '54beadde-9687-443b-93db-36dfc7576678',
        name: 'Loop Over Items5',
        type: 'n8n-nodes-base.splitInBatches',
        version: 3,
        position: [-2576, 912],
    })
    LoopOverItems5 = {
        options: {},
    };

    @node({
        id: '3ec8f51c-38e4-4cf1-aea8-1c26be3c608b',
        name: 'Markdown6',
        type: 'n8n-nodes-base.markdown',
        version: 1,
        position: [512, 464],
    })
    Markdown6 = {
        html: "={{ $('extract content1').item.json.data || '' }}",
        destinationKey: 'linebreak',
        options: {},
    };

    @node({
        id: 'b00d76aa-84fb-4a9d-aabb-664afb048a18',
        name: 'extract date',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [288, 464],
    })
    ExtractDate = {
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
        id: 'd79b50a6-33a5-4c9f-bfd5-09c69dee0410',
        name: 'Structured Output Parser5',
        type: '@n8n/n8n-nodes-langchain.outputParserStructured',
        version: 1.3,
        position: [-1872, 496],
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
        id: 'ef38d5fb-637e-4d65-85e9-72011e9d49fc',
        name: 'Create summary and title2',
        type: '@n8n/n8n-nodes-langchain.chainLlm',
        version: 1.7,
        position: [800, 464],
        retryOnFail: true,
        waitBetweenTries: 5000,
    })
    CreateSummaryAndTitle2 = {
        promptType: 'define',
        text: `=<content>
{{ (function () {

  const mdNode = $('Markdown6').item.json;
  const hasLinebreak =
    mdNode.linebreak && mdNode.linebreak.length > 0;

  //  CASE 1: linebreak present → use directly
  if (hasLinebreak) {
    return mdNode.linebreak;
  }

  //  CASE 2: no linebreak → use extract content + step 2 & 3
  let rawData = $('extract content1').item.json.data || '';

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
        batching: {},
    };

    @node({
        id: '0e047562-94f9-48a1-8bbc-08995c4ad461',
        name: 'OpenAI Chat Model6',
        type: '@n8n/n8n-nodes-langchain.lmChatOpenAi',
        version: 1.2,
        position: [-3024, 1984],
        credentials: { openAiApi: { id: 'S2kEpGa9PHsoI7on', name: 'OpenAi account' } },
    })
    OpenaiChatModel6 = {
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
        id: '13ad4863-17b0-486c-8cb0-0defd2acb0f7',
        name: 'Structured Output Parser7',
        type: '@n8n/n8n-nodes-langchain.outputParserStructured',
        version: 1.3,
        position: [992, 688],
    })
    StructuredOutputParser7 = {
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
        id: '03d2f660-d9e4-4247-9511-b173d55b9298',
        name: 'https fields',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [2160, 464],
    })
    HttpsFields = {
        assignments: {
            assignments: [
                {
                    id: '1d34aa6b-dce8-4761-9a9a-a663f61a86ac',
                    name: 'title',
                    value: "={{ $('Merge').item.json.title || $('Create summary and title2').item.json.output.title }}",
                    type: 'string',
                },
                {
                    id: 'ab5c9158-a33a-4f8f-b6d0-a6787df0f0d5',
                    name: 'content',
                    value: `={{ $json.text || (function () {

  const mdNode = $('Markdown6').item.json;
  const hasLinebreak =
    mdNode.linebreak && mdNode.linebreak.length > 0;

  //  CASE 1: linebreak present → use directly
  if (hasLinebreak) {
    return mdNode.linebreak.removeMarkdown();
  }

  //  CASE 2: no linebreak → use extract content + step 2 & 3
  let rawData = $('extract content1').item.json.data || '';

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
`,
                    type: 'string',
                },
                {
                    id: 'f0c15fc7-071d-406d-8200-abecbf458836',
                    name: 'url',
                    value: `={{
  decodeURIComponent(
    ($('Merge').item.json.url || '')
      .replace(/^https?:\\/\\/www\\.google\\.com\\/url\\?.*?url=/, '')
      .split('&')[0]
  )
}}`,
                    type: 'string',
                },
                {
                    id: '81fb049e-bbc7-49f8-b932-9f2d3ae0305d',
                    name: 'summary',
                    value: "={{ $('Create summary and title2').item.json.output.summary }}",
                    type: 'string',
                },
                {
                    id: 'da6884f3-275c-41e7-87c5-c20fb29e9419',
                    name: 'search_query',
                    value: "={{ $('Search').item.json.query }}",
                    type: 'string',
                },
                {
                    id: '42852696-c7af-4ce4-a273-e61970ef2e8f',
                    name: 'publication_date',
                    value: "={{ $('extract date').item.json.publishedDate || '' }}",
                    type: 'string',
                },
                {
                    id: 'a0b9d46b-67d2-4152-b1fa-2306fa5751e4',
                    name: 'source',
                    value: '=Tavily',
                    type: 'string',
                },
                {
                    id: '2d48f306-c0cc-4c2b-9a28-1d810282b524',
                    name: 'source_name',
                    value: "={{ $('Either Url or Keyword3').first().json.set_source_name }}",
                    type: 'string',
                },
                {
                    id: '0a45e855-b96a-4d20-bfc7-e77f6bae2f1e',
                    name: 'source_category',
                    value: "={{ $('When Executed by Another Workflow').item.json.property_keyword_category }}",
                    type: 'string',
                },
                {
                    id: 'b6707082-f321-40a8-8174-678e004169df',
                    name: '=additional_formats',
                    value: "={{ $('When Executed by Another Workflow').first().json.additional_formats }}",
                    type: 'string',
                },
                {
                    id: 'ac5d4a60-217d-4291-a6cd-ef525481c403',
                    name: 'prompt',
                    value: "={{ $('When Executed by Another Workflow').first().json.prompt }}",
                    type: 'string',
                },
                {
                    id: 'eb7d506e-d06c-448f-a6a1-7726df3f6bbb',
                    name: '=mode',
                    value: "={{ $('When Executed by Another Workflow').first().json.process_mode }}",
                    type: 'string',
                },
            ],
        },
        options: {},
    };

    @node({
        id: '11ae2d33-22d8-42dd-8eee-9add787cd7c2',
        name: 'tavily search fields1',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [1360, 64],
    })
    TavilySearchFields1 = {
        assignments: {
            assignments: [
                {
                    id: '1d34aa6b-dce8-4761-9a9a-a663f61a86ac',
                    name: 'title',
                    value: "={{ $('Merge').item.json.title || $('Scrape a url and get its content4').item.json.data.metadata.title }}",
                    type: 'string',
                },
                {
                    id: 'ab5c9158-a33a-4f8f-b6d0-a6787df0f0d5',
                    name: 'content',
                    value: `={{ 
  $('Scrape a url and get its content4').item.json.data.markdown.removeMarkdown()
}}`,
                    type: 'string',
                },
                {
                    id: 'f0c15fc7-071d-406d-8200-abecbf458836',
                    name: 'url',
                    value: `={{
  decodeURIComponent(
    ($('Scrape a url and get its content4').item.json.data.metadata.url || '')
      .replace(/^https?:\\/\\/www\\.google\\.com\\/url\\?.*?url=/, '')
      .split('&')[0]
  )
}}`,
                    type: 'string',
                },
                {
                    id: '0276c4d6-4a0f-49c5-95e1-9cece3690cc8',
                    name: 'summary',
                    value: "={{ $('Scrape a url and get its content4').item.json.data.summary }}",
                    type: 'string',
                },
                {
                    id: '9573ac47-f760-4075-af1e-41774d546f60',
                    name: 'search_query',
                    value: "={{ $('Either Url or Keyword3').item.json.url_or_keyword }}",
                    type: 'string',
                },
                {
                    id: '42852696-c7af-4ce4-a273-e61970ef2e8f',
                    name: 'publication_date',
                    value: `={{ $('Merge').item.json.published_date || $json.data.metadata.citation_publication_date || $('Scrape a url and get its content4').item.json.data.metadata['cXenseParse:publishtime'] || $('Scrape a url and get its content4').item.json.data.metadata.publishedTime || $('Scrape a url and get its content4').item.json.data.metadata.publishedTime || $('Scrape a url and get its content4').item.json.data.metadata['article:published_time'] }}

`,
                    type: 'string',
                },
                {
                    id: '156a551e-8b0b-49ae-9543-4337fd48f33f',
                    name: 'source',
                    value: 'Tavily',
                    type: 'string',
                },
                {
                    id: 'a9551812-83e1-4e44-a212-a8d4e81952a6',
                    name: 'source_name',
                    value: "={{ $('Either Url or Keyword3').first().json.set_source_name }}",
                    type: 'string',
                },
                {
                    id: 'bbc14417-5037-4894-b03a-d2f20456105b',
                    name: 'source_category',
                    value: "={{ $('When Executed by Another Workflow').item.json.property_keyword_category }}",
                    type: 'string',
                },
                {
                    id: '40580acd-9a0c-4de0-91cd-0605052a5810',
                    name: 'prompt',
                    value: "={{ $('When Executed by Another Workflow').first().json.prompt }}",
                    type: 'string',
                },
                {
                    id: 'a1839b94-f160-4685-8932-0258bd67b0cf',
                    name: 'additional_formats',
                    value: "={{ $('When Executed by Another Workflow').first().json.additional_formats }}",
                    type: 'string',
                },
                {
                    id: '8cad40d7-a7a0-46cb-a90e-a20807fe81b9',
                    name: '=mode',
                    value: "={{ $('When Executed by Another Workflow').first().json.process_mode }}",
                    type: 'string',
                },
            ],
        },
        options: {},
    };

    @node({
        id: '94f292fc-0737-453e-be17-d3c0d8490d91',
        name: 'Sticky Note',
        type: 'n8n-nodes-base.stickyNote',
        version: 1,
        position: [-3072, 0],
    })
    StickyNote = {
        content: '##  News scrap through Keyword using Firecrawl',
        height: 1088,
        width: 5648,
        color: 4,
    };

    @node({
        id: 'd3df7199-6462-44c3-b231-46237708530f',
        name: 'Merge',
        type: 'n8n-nodes-base.merge',
        version: 3.2,
        position: [-608, 272],
        alwaysOutputData: true,
    })
    Merge = {
        mode: 'combine',
        advanced: true,
        mergeByFields: {
            values: [
                {
                    field1: 'url',
                    field2: 'url',
                },
            ],
        },
        joinMode: 'keepNonMatches',
        outputDataFrom: 'input1',
        options: {},
    };

    @node({
        id: '80e44e56-4c8b-45e2-9499-f0b1c3d18848',
        name: 'If URL',
        type: 'n8n-nodes-base.if',
        version: 2.3,
        position: [-384, 272],
    })
    IfUrl = {
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
                    leftValue: '={{ $json.url }}',
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
        id: '348108d5-5a6f-490a-8d61-ba069beda3c8',
        name: 'create longtail keyword OLD',
        type: '@n8n/n8n-nodes-langchain.chainLlm',
        version: 1.7,
        position: [-3024, 1552],
        retryOnFail: true,
        waitBetweenTries: 5000,
    })
    CreateLongtailKeywordOld = {
        promptType: 'define',
        text: `=<content>
{{ $json.url_or_keyword }}
</content>`,
        hasOutputParser: true,
        messages: {
            messageValues: [
                {
                    message: `=Act as a search query generator.

You will receive a single keyword related to sustainable biofuels (e.g., “B20 FAME”, “used cooking oil”, etc.).

Your task is to generate a **concise and relevant search phrase** that includes the keyword exactly as provided. The search phrase should aim to surface the **latest news, market trends, regulatory updates, or technological advancements** related to that keyword, with a **primary focus on the UK**, and **secondarily on the EU**.

Keep the output **short, clear, and snappy** — like a search engine query. Make sure it sounds natural but is optimized to find **recent insights**.

---

**Rules:**
- **Always include the input keyword as-is** in the output.
- Keep the total phrase **under 10 words**.
- Focus the query on **UK and EU news or insights**.
- Prioritize recent, relevant developments (e.g., past few months).

---

**Input format:** A single keyword (string)  
**Output format:** One concise search phrase

---

**Examples:**
- Input: \`used cooking oil\` → Output: \`UK and EU news on used cooking oil\`
- Input: \`B20 FAME\` → Output: \`Market trends and news for B20 FAME UK\`
- Input: \`waste-derived biodiesel\` → Output: \`UK updates on waste-derived biodiesel\``,
                },
            ],
        },
        batching: {},
    };

    @node({
        id: '7a4cb8c7-3306-481b-8bac-9b69fa271ccd',
        name: 'Split Out Searches',
        type: 'n8n-nodes-base.splitOut',
        version: 1,
        position: [-1504, 272],
    })
    SplitOutSearches = {
        fieldToSplitOut: 'output',
        options: {},
    };

    @node({
        id: '834c1109-5249-4681-a55c-369d2bd7d5e5',
        name: 'Split Out Results',
        type: 'n8n-nodes-base.splitOut',
        version: 1,
        position: [-1056, 272],
        alwaysOutputData: true,
    })
    SplitOutResults = {
        fieldToSplitOut: 'results',
        options: {},
    };

    @node({
        id: '8f94b440-6066-49d2-a48a-2668024cb60d',
        name: 'DeepSeek 3.2',
        type: '@n8n/n8n-nodes-langchain.lmChatOpenRouter',
        version: 1,
        position: [-3024, 1136],
        credentials: { openRouterApi: { id: 'kUkOiAL6PjmdfexG', name: 'Syntech GM OpenRouter account' } },
    })
    Deepseek32 = {
        model: 'deepseek/deepseek-v3.2',
        options: {},
    };

    @node({
        id: '2cfb7524-760b-4574-a85e-d86d69a2b866',
        name: 'DeepSeek 3.',
        type: '@n8n/n8n-nodes-langchain.lmChatOpenRouter',
        version: 1,
        position: [-3024, 1344],
        credentials: { openRouterApi: { id: 'kUkOiAL6PjmdfexG', name: 'Syntech GM OpenRouter account' } },
    })
    Deepseek3 = {
        model: 'deepseek/deepseek-v3.2',
        options: {},
    };

    @node({
        id: '9bae8f0a-7874-4ca8-886a-c03de3038e2a',
        name: 'create longtail keyword',
        type: '@n8n/n8n-nodes-langchain.chainLlm',
        version: 1.7,
        position: [-3024, 2192],
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
        id: 'c153faf4-41b1-430d-8e84-481cf78a5bcb',
        name: 'create longtail keyword claude optimised',
        type: '@n8n/n8n-nodes-langchain.chainLlm',
        version: 1.7,
        position: [-2080, 272],
        retryOnFail: true,
        waitBetweenTries: 5000,
    })
    CreateLongtailKeywordClaudeOptimised = {
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
        id: 'e4c25586-314a-4725-b1eb-982dbbc2ad6a',
        name: 'Structured Output Parser',
        type: '@n8n/n8n-nodes-langchain.outputParserStructured',
        version: 1.3,
        position: [-2960, 1776],
    })
    StructuredOutputParser = {
        schemaType: 'manual',
        inputSchema: `{
  "type": "object",
  "properties": {
    "news": {
      "type": "string",
      "description": "Compact query focused on recent news"
    },
    "market": {
      "type": "string",
      "description": "Compact query focused on price or market activity"
    },
    "investment": {
      "type": "string",
      "description": "Compact query focused on funding or investment"
    }
  },
  "required": ["news", "market", "investment"]
}`,
    };

    @node({
        id: 'b348b27d-d1c6-42c8-bbae-c48b22287a2f',
        name: 'create longtail keyword claude optimised1',
        type: '@n8n/n8n-nodes-langchain.chainLlm',
        version: 1.7,
        position: [-3024, 2416],
        retryOnFail: true,
        waitBetweenTries: 5000,
    })
    CreateLongtailKeywordClaudeOptimised1 = {
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
        id: 'a9a3139d-36f2-4bb0-8b89-6dfb318d75bb',
        name: 'If Not Error',
        type: 'n8n-nodes-base.if',
        version: 2.2,
        position: [512, 64],
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
        id: '77cf4e07-d84f-4367-97c4-7cdaf9c8b320',
        name: 'Remove Duplicates',
        type: 'n8n-nodes-base.removeDuplicates',
        version: 2,
        position: [-160, 272],
        alwaysOutputData: true,
    })
    RemoveDuplicates = {
        compare: 'selectedFields',
        fieldsToCompare: 'url',
        options: {},
    };

    @node({
        id: 'cb3796b7-a215-4945-bc2d-88a2b26ecf5b',
        name: 'Get many rows sb',
        type: 'n8n-nodes-base.supabase',
        version: 1,
        position: [-2672, 1664],
        credentials: { supabaseApi: { id: 'IT46INDKsZaZyCZQ', name: 'Stephen Supabase account' } },
        alwaysOutputData: false,
        executeOnce: true,
    })
    GetManyRowsSb = {
        operation: 'getAll',
        tableId: 'Syntech keyword firecrawl url',
        returnAll: true,
        filterType: 'none',
    };

    @node({
        id: '1a960401-5708-493a-b287-e9f90b3ebf2f',
        name: 'Create a row sb2',
        type: 'n8n-nodes-base.supabase',
        version: 1,
        position: [-2224, 1664],
        credentials: { supabaseApi: { id: 'IT46INDKsZaZyCZQ', name: 'Stephen Supabase account' } },
    })
    CreateARowSb2 = {
        tableId: 'Syntech keyword firecrawl url',
        fieldsUi: {
            fieldValues: [
                {
                    fieldId: 'url',
                    fieldValue: `={{
  $('Merge').item.json.url.includes('url=')
    ? decodeURIComponent($('Merge').item.json.url.split('url=')[1].split('&')[0])
    : $('Merge').item.json.url
}}`,
                },
            ],
        },
    };

    @node({
        id: 'c5cfd645-0b70-4b35-8e0b-66dfe42bb00b',
        name: 'Create a row sb3',
        type: 'n8n-nodes-base.supabase',
        version: 1,
        position: [-2448, 1664],
        credentials: { supabaseApi: { id: 'IT46INDKsZaZyCZQ', name: 'Stephen Supabase account' } },
    })
    CreateARowSb3 = {
        tableId: 'Syntech keyword firecrawl url',
        fieldsUi: {
            fieldValues: [
                {
                    fieldId: 'url',
                    fieldValue: `={{
  $('Merge').item.json.url.includes('url=')
    ? decodeURIComponent($('Merge').item.json.url.split('url=')[1].split('&')[0])
    : $('Merge').item.json.url
}}`,
                },
            ],
        },
    };

    @node({
        id: '5b7d4a46-9d28-4272-ab96-8b5f5b28f120',
        name: 'Create a row',
        type: 'n8n-nodes-base.dataTable',
        version: 1.1,
        position: [944, 64],
        executeOnce: false,
    })
    CreateARow = {
        operation: 'upsert',
        dataTableId: {
            __rl: true,
            value: 'mVdJV0trdZcmc9mW',
            mode: 'list',
            cachedResultName: 'NEWS+ Tavily',
            cachedResultUrl: '/projects/U9sMeJya1DaokkjK/datatables/mVdJV0trdZcmc9mW',
        },
        filters: {
            conditions: [
                {
                    keyName: 'url',
                    keyValue: `={{
  $('Merge').item.json.url.includes('url=')
    ? decodeURIComponent($('Merge').item.json.url.split('url=')[1].split('&')[0])
    : $('Merge').item.json.url
}}`,
                },
            ],
        },
        columns: {
            mappingMode: 'defineBelow',
            value: {
                url: `={{
  $('Merge').item.json.url.includes('url=')
    ? decodeURIComponent($('Merge').item.json.url.split('url=')[1].split('&')[0])
    : $('Merge').item.json.url
}}`,
            },
            matchingColumns: ['url'],
            schema: [
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
        id: '982d159b-ddf2-43f1-9c1a-8f4ab5bbe206',
        name: 'Get many rows1',
        type: 'n8n-nodes-base.dataTable',
        version: 1.1,
        position: [-832, 576],
        executeOnce: true,
    })
    GetManyRows1 = {
        operation: 'get',
        dataTableId: {
            __rl: true,
            value: 'mVdJV0trdZcmc9mW',
            mode: 'list',
            cachedResultName: 'NEWS+ Tavily',
            cachedResultUrl: '/projects/U9sMeJya1DaokkjK/datatables/mVdJV0trdZcmc9mW',
        },
        returnAll: true,
    };

    @node({
        id: '9224ce35-e032-4133-8134-f3b6c2be1e8e',
        name: 'Create a row1',
        type: 'n8n-nodes-base.dataTable',
        version: 1.1,
        position: [1360, 464],
        executeOnce: false,
    })
    CreateARow1 = {
        operation: 'upsert',
        dataTableId: {
            __rl: true,
            value: 'mVdJV0trdZcmc9mW',
            mode: 'list',
            cachedResultName: 'NEWS+ Tavily',
            cachedResultUrl: '/projects/U9sMeJya1DaokkjK/datatables/mVdJV0trdZcmc9mW',
        },
        filters: {
            conditions: [
                {
                    keyName: 'url',
                    keyValue:
                        "={{   $('Merge').item.json.url.includes('url=')     ? decodeURIComponent($('Merge').item.json.url.split('url=')[1].split('&')[0])     : $('Merge').item.json.url }}",
                },
            ],
        },
        columns: {
            mappingMode: 'defineBelow',
            value: {
                url: `={{
  $('Merge').item.json.url.includes('url=')
    ? decodeURIComponent($('Merge').item.json.url.split('url=')[1].split('&')[0])
    : $('Merge').item.json.url
}}`,
            },
            matchingColumns: ['url'],
            schema: [
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
        id: 'e3b91d94-33ca-4937-83e1-141cc89be1d0',
        name: 'OpenAI Chat Model',
        type: '@n8n/n8n-nodes-langchain.lmChatOpenAi',
        version: 1.3,
        position: [-2128, 496],
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
        id: 'db884e62-f4b0-47da-befd-8c0085773012',
        name: 'OpenAI Chat Model1',
        type: '@n8n/n8n-nodes-langchain.lmChatOpenAi',
        version: 1.3,
        position: [736, 688],
        credentials: { openAiApi: { id: 'NoEKitspBJb0zQrp', name: 'Syntech GM OpenAi account' } },
    })
    OpenaiChatModel1 = {
        model: {
            __rl: true,
            mode: 'list',
            value: 'gpt-5-mini',
        },
        builtInTools: {},
        options: {},
    };

    @node({
        id: 'c3fe489c-bbee-4b70-8842-20d0f2d07a29',
        name: 'Anthropic Chat Model',
        type: '@n8n/n8n-nodes-langchain.lmChatAnthropic',
        version: 1.3,
        position: [-2000, 496],
        credentials: { anthropicApi: { id: '0c1nNLaJWpeD3Cqz', name: 'Syntech GM Anthropic account' } },
    })
    AnthropicChatModel = {
        model: {
            __rl: true,
            value: 'claude-haiku-4-5-20251001',
            mode: 'list',
            cachedResultName: 'Claude Haiku 4.5',
        },
        options: {},
    };

    @node({
        id: 'ed84aff7-4609-43e9-a4b8-238939edbd19',
        name: 'Anthropic Chat Model1',
        type: '@n8n/n8n-nodes-langchain.lmChatAnthropic',
        version: 1.3,
        position: [864, 688],
        credentials: { anthropicApi: { id: '0c1nNLaJWpeD3Cqz', name: 'Syntech GM Anthropic account' } },
    })
    AnthropicChatModel1 = {
        model: {
            __rl: true,
            value: 'claude-haiku-4-5-20251001',
            mode: 'list',
            cachedResultName: 'Claude Haiku 4.5',
        },
        options: {},
    };

    @node({
        id: '727739e8-1e42-4408-856c-06ef182b9238',
        name: 'Anthropic Chat Model2',
        type: '@n8n/n8n-nodes-langchain.lmChatAnthropic',
        version: 1.3,
        position: [1072, 896],
        credentials: { anthropicApi: { id: '0c1nNLaJWpeD3Cqz', name: 'Syntech GM Anthropic account' } },
    })
    AnthropicChatModel2 = {
        model: {
            __rl: true,
            mode: 'list',
            value: 'claude-sonnet-4-5-20250929',
            cachedResultName: 'Claude Sonnet 4.5',
        },
        options: {},
    };

    @node({
        id: 'af4707b8-3bff-4305-bd30-dc1987c56272',
        name: 'OpenAI Chat Model3',
        type: '@n8n/n8n-nodes-langchain.lmChatOpenAi',
        version: 1.3,
        position: [1888, 688],
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
        id: '9a7129fe-6515-496c-9138-05ed3c6644a7',
        name: 'Extracting Clean Article',
        type: '@n8n/n8n-nodes-langchain.chainLlm',
        version: 1.7,
        position: [1808, 464],
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
        id: '3e60efb8-d3e4-4b1d-b27e-d551bcfa6309',
        name: 'Anthropic Chat Model3',
        type: '@n8n/n8n-nodes-langchain.lmChatAnthropic',
        version: 1.3,
        position: [-1792, 704],
        credentials: { anthropicApi: { id: '0c1nNLaJWpeD3Cqz', name: 'Syntech GM Anthropic account' } },
    })
    AnthropicChatModel3 = {
        model: {
            __rl: true,
            value: 'claude-haiku-4-5-20251001',
            mode: 'list',
            cachedResultName: 'Claude Haiku 4.5',
        },
        options: {},
    };

    @node({
        id: '6f35b962-f9f3-4985-990e-b561c642628c',
        name: 'Set Article Content',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [1584, 464],
    })
    SetArticleContent = {
        assignments: {
            assignments: [
                {
                    id: '6209ffc2-a660-4109-9ebe-97a95b8d2c6e',
                    name: 'data',
                    value: `={{ (function () {
  // ========== STEP 0: Check if Markdown Already Processed ==========
  const mdNode = $('Markdown6').item.json;
  if (mdNode.linebreak && mdNode.linebreak.length > 0) {
    return mdNode.linebreak.removeMarkdown();
  }

  // ========== STEP 1: Get HTML Content ==========
  const html = $('extract content1').item.json.data || '';
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

    // =====================================================================
    // ROUTAGE ET CONNEXIONS
    // =====================================================================

    @links()
    defineRouting() {
        this.WhenExecutedByAnotherWorkflow.out(0).to(this.Limit2.in(0));
        this.Search.out(0).to(this.SplitOutResults.in(0));
        this.Search.out(1).to(this.LoopOverItems5.in(0));
        this.Limit2.out(0).to(this.LoopOverItems5.in(0));
        this.ScrapeAUrlAndGetItsContent4.out(0).to(this.IfNotError.in(0));
        this.EitherUrlOrKeyword3.out(0).to(this.CreateLongtailKeywordClaudeOptimised.in(0));
        this.Merge8.out(0).to(this.LoopOverItems5.in(0));
        this.ExtractContent1.out(0).to(this.ExtractDate.in(0));
        this.ExtractContent1.out(1).to(this.ScrapeAUrlAndGetItsContent4.in(0));
        this.LoopOverItems5.out(1).to(this.EitherUrlOrKeyword3.in(0));
        this.Markdown6.out(0).to(this.CreateSummaryAndTitle2.in(0));
        this.ExtractDate.out(0).to(this.Markdown6.in(0));
        this.CreateSummaryAndTitle2.out(0).to(this.CreateARow1.in(0));
        this.HttpsFields.out(0).to(this.Merge8.in(1));
        this.TavilySearchFields1.out(0).to(this.Merge8.in(0));
        this.Merge.out(0).to(this.IfUrl.in(0));
        this.IfUrl.out(0).to(this.RemoveDuplicates.in(0));
        this.IfUrl.out(1).to(this.LoopOverItems5.in(0));
        this.SplitOutSearches.out(0).to(this.Search.in(0));
        this.SplitOutResults.out(0).to(this.Merge.in(0));
        this.SplitOutResults.out(0).to(this.GetManyRows1.in(0));
        this.CreateLongtailKeywordClaudeOptimised.out(0).to(this.SplitOutSearches.in(0));
        this.IfNotError.out(0).to(this.CreateARow.in(0));
        this.IfNotError.out(1).to(this.LoopOverItems5.in(0));
        this.RemoveDuplicates.out(0).to(this.ExtractContent1.in(0));
        this.GetManyRowsSb.out(0).to(this.CreateARowSb3.in(0));
        this.CreateLongtailKeywordOld.out(0).to(this.GetManyRowsSb.in(0));
        this.CreateARowSb3.out(0).to(this.CreateARowSb2.in(0));
        this.GetManyRows1.out(0).to(this.Merge.in(1));
        this.CreateARow.out(0).to(this.TavilySearchFields1.in(0));
        this.CreateARow1.out(0).to(this.SetArticleContent.in(0));
        this.ExtractingCleanArticle.out(0).to(this.HttpsFields.in(0));
        this.SetArticleContent.out(0).to(this.ExtractingCleanArticle.in(0));

        this.StructuredOutputParser5.uses({
            ai_languageModel: this.AnthropicChatModel3.output,
        });
        this.CreateSummaryAndTitle2.uses({
            ai_languageModel: this.AnthropicChatModel1.output,
            ai_outputParser: this.StructuredOutputParser7.output,
        });
        this.StructuredOutputParser7.uses({
            ai_languageModel: this.AnthropicChatModel2.output,
        });
        this.CreateLongtailKeywordOld.uses({
            ai_outputParser: this.StructuredOutputParser.output,
        });
        this.CreateLongtailKeywordClaudeOptimised.uses({
            ai_languageModel: this.AnthropicChatModel.output,
            ai_outputParser: this.StructuredOutputParser5.output,
        });
        this.ExtractingCleanArticle.uses({
            ai_languageModel: this.OpenaiChatModel3.output,
        });
    }
}
