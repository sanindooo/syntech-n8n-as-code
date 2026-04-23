import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : Search Twitter/X (Post and Keyword)
// Nodes   : 26  |  Connections: 22
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// InitialInput                       executeWorkflowTrigger
// Limit3                             limit
// KeywordOrUrl                       if
// Merge4                             merge                      [alwaysOutput]
// EitherUrlOrKeyword                 set
// XFields1                           set                        [alwaysOutput]
// TwitterXPostScraperUrls            apify                      [onError→out(1)] [creds]
// TwitterXPostScraperKeyword         apify                      [onError→out(1)] [creds] [alwaysOutput]
// LoopOverItems3                     splitInBatches
// OpenaiChatModel9                   lmChatOpenAi               [creds] [ai_languageModel]
// StructuredOutputParser9            outputParserStructured     [ai_outputParser]
// CreateSummaryAndTitle4             chainLlm                   [AI]
// OpenaiChatModel10                  lmChatOpenAi               [creds]
// StructuredOutputParser10           outputParserStructured     [ai_outputParser]
// XFields                            set
// CreateLongtailKeyword              chainLlm                   [AI]
// IfValidContent                     if                         [alwaysOutput]
// TwitterXPostFields1                set
// StickyNote                         stickyNote
// Merge                              merge                      [alwaysOutput]
// If1                                if
// Deepseek3                          lmChatOpenRouter           [creds] [ai_languageModel]
// GetManyRowsSupabase                supabase                   [creds] [executeOnce]
// GetManyRows                        dataTable                  [executeOnce]
// CreateARowSupabase                 supabase                   [creds]
// CreateARow                         dataTable
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// InitialInput
//    → Limit3
//      → LoopOverItems3
//       .out(1) → EitherUrlOrKeyword
//          → KeywordOrUrl
//            → TwitterXPostScraperUrls
//              → XFields
//                → Merge4
//                  → IfValidContent
//                    → Merge
//                      → If1
//                        → CreateSummaryAndTitle4
//                          → CreateARow
//                            → TwitterXPostFields1
//                              → LoopOverItems3 (↩ loop)
//                       .out(1) → LoopOverItems3 (↩ loop)
//                    → GetManyRows
//                      → Merge.in(1) (↩ loop)
//                   .out(1) → LoopOverItems3 (↩ loop)
//           .out(1) → TwitterXPostScraperKeyword
//              → XFields1
//                → Merge4.in(1) (↩ loop)
// GetManyRowsSupabase
//    → CreateARowSupabase
//
// AI CONNECTIONS
// CreateSummaryAndTitle4.uses({ ai_outputParser: StructuredOutputParser10, ai_languageModel: Deepseek3 })
// CreateLongtailKeyword.uses({ ai_languageModel: OpenaiChatModel9, ai_outputParser: StructuredOutputParser9 })
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'zykTHDZ-r8op3Zitq25Y2',
    name: 'Search Twitter/X (Post and Keyword)',
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
export class SearchTwitterXPostAndKeywordWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'ac1ae95d-6052-4baa-9b84-16a651ac9bee',
        name: 'Initial Input',
        type: 'n8n-nodes-base.executeWorkflowTrigger',
        version: 1.1,
        position: [-32, 400],
    })
    InitialInput = {
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
        id: 'e66f8732-4bdc-4d17-aaec-e252b30fa4c8',
        name: 'Limit3',
        type: 'n8n-nodes-base.limit',
        version: 1,
        position: [192, 400],
    })
    Limit3 = {
        maxItems: 1000,
    };

    @node({
        id: '3b56d10b-209e-4b7f-84de-0d217537c204',
        name: 'keyword or url',
        type: 'n8n-nodes-base.if',
        version: 2.2,
        position: [864, 112],
    })
    KeywordOrUrl = {
        conditions: {
            options: {
                caseSensitive: true,
                leftValue: '',
                typeValidation: 'strict',
                version: 2,
            },
            conditions: [
                {
                    id: '3d1849b4-edf5-488f-83e4-3678e2f03e64',
                    leftValue: '={{ $json.url_or_keyword }}',
                    rightValue: '=https://',
                    operator: {
                        type: 'string',
                        operation: 'contains',
                    },
                },
            ],
            combinator: 'and',
        },
        options: {},
    };

    @node({
        id: 'e30d20d5-0bdb-4f7c-a786-715b4036e175',
        name: 'Merge4',
        type: 'n8n-nodes-base.merge',
        version: 3.2,
        position: [1536, 112],
        alwaysOutputData: true,
    })
    Merge4 = {};

    @node({
        id: 'b448ab9b-3456-4564-9be9-4e31de885082',
        name: 'Either Url or Keyword',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [640, 112],
    })
    EitherUrlOrKeyword = {
        assignments: {
            assignments: [
                {
                    id: '8efead37-57d8-4101-9010-c855f2525db6',
                    name: 'url_or_keyword',
                    value: '={{ $json.property_url || $json.url_or_keyword || $json.name }}',
                    type: 'string',
                },
                {
                    id: '670b79a6-99da-4cef-9b7d-74f346980d34',
                    name: 'prompt',
                    value: '={{ $json.prompt }}',
                    type: 'string',
                },
                {
                    id: '0a3f9442-f913-4b62-9fe3-30b46de7569d',
                    name: 'additional_formats',
                    value: '={{ $json.additional_formats }}',
                    type: 'string',
                },
            ],
        },
        options: {},
    };

    @node({
        id: 'be8b5a9a-6bef-4a02-90d1-5f28f63033b6',
        name: 'X fields1',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [1312, 208],
        alwaysOutputData: true,
    })
    XFields1 = {
        assignments: {
            assignments: [
                {
                    id: '0de21055-4554-4c15-9071-4c7a32560eae',
                    name: 'content',
                    value: '={{ $json.text }}',
                    type: 'string',
                },
                {
                    id: 'd7e8711b-7f7c-487e-8aae-afa5d6132cec',
                    name: 'url',
                    value: '={{ $json.url }}',
                    type: 'string',
                },
                {
                    id: '69a2c6ec-5340-4ef4-8dbb-c9bb1d945bfe',
                    name: 'publication_date',
                    value: '={{ $json.createdAt }}',
                    type: 'string',
                },
                {
                    id: 'b3af0d59-d4e0-4dde-8bfc-6716e11d9089',
                    name: 'search_query',
                    value: "={{ $('Either Url or Keyword').item.json.url_or_keyword }}",
                    type: 'string',
                },
            ],
        },
        options: {},
    };

    @node({
        id: '6ff06bec-75d8-42d3-be82-da5abdfcfb6d',
        name: 'Twitter/ X post scraper - urls',
        type: '@apify/n8n-nodes-apify.apify',
        version: 1,
        position: [1088, 16],
        credentials: { apifyApi: { id: 'JsuEKmvPtVt6JvXD', name: 'Syntech GM Apify account' } },
        onError: 'continueErrorOutput',
        alwaysOutputData: false,
    })
    TwitterXPostScraperUrls = {
        operation: 'Run actor and get dataset',
        actorSource: 'store',
        actorId: {
            __rl: true,
            value: 'ghSpYIW3L1RvT57NT',
            mode: 'list',
            cachedResultName: 'Twitter Scraper PPR (danek/twitter-scraper-ppr)',
            cachedResultUrl: 'https://console.apify.com/actors/ghSpYIW3L1RvT57NT/input',
        },
        customBody: `={
    "max_posts": 10,
    "username": "{{ 
  (() => {
    const input = $json.url_or_keyword;
    
    // If input contains x.com or twitter.com, extract username
    if (input.includes('x.com/') || input.includes('twitter.com/')) {
      // Remove protocol and domain
      const urlPart = input
        .replace(/^https?:\\/\\//, '')           // Remove http:// or https://
        .replace(/^(www\\.)?twitter\\.com\\//, '') // Remove twitter.com/
        .replace(/^(www\\.)?x\\.com\\//, '');      // Remove x.com/
      
      // Extract username (everything before / or end of string)
      const username = urlPart.split(/[/?#]/)[0];
      
      // Remove @ if present
      return username.replace(/^@/, '');
    }
    
    // If it's already just a username, return it (remove @ if present)
    return input.replace(/^@/, '');
  })()
}}"
}

`,
        timeout: {},
    };

    @node({
        id: '7021c8f1-fd12-4069-8adf-3fe10c3f61da',
        name: 'Twitter/ X post scraper - keyword',
        type: '@apify/n8n-nodes-apify.apify',
        version: 1,
        position: [1088, 208],
        credentials: { apifyApi: { id: 'JsuEKmvPtVt6JvXD', name: 'Syntech GM Apify account' } },
        onError: 'continueErrorOutput',
        alwaysOutputData: true,
    })
    TwitterXPostScraperKeyword = {
        operation: 'Run actor and get dataset',
        actorSource: 'store',
        actorId: {
            __rl: true,
            value: 'nfp1fpt5gUlBwPcor',
            mode: 'list',
            cachedResultName: 'Twitter (X.com) Scraper Unlimited: No Limits (apidojo/twitter-scraper-lite)',
            cachedResultUrl: 'https://console.apify.com/actors/nfp1fpt5gUlBwPcor/input',
        },
        customBody: `={
    "customMapFunction": "(object) => { return {...object} }",
    "includeSearchTerms": false,
    "maxItems": 5,
    "onlyImage": false,
    "onlyQuote": false,
    "onlyTwitterBlue": false,
    "onlyVerifiedUsers": false,
    "onlyVideo": false,
    "searchTerms": [
        "{{ $json.url_or_keyword }}"
    ],
    "sort": "Top",
    "tweetLanguage": "en"
}`,
    };

    @node({
        id: '3c5bf1b0-1599-4513-a429-d3989b68cfef',
        name: 'Loop Over Items3',
        type: 'n8n-nodes-base.splitInBatches',
        version: 3,
        position: [416, 400],
        executeOnce: false,
    })
    LoopOverItems3 = {
        options: {},
    };

    @node({
        id: 'b75ddd43-2938-4ea2-8dca-c5f41dbd5538',
        name: 'OpenAI Chat Model9',
        type: '@n8n/n8n-nodes-langchain.lmChatOpenAi',
        version: 1.2,
        position: [-32, 1184],
        credentials: { openAiApi: { id: 'NoEKitspBJb0zQrp', name: 'Syntech GM OpenAi account' } },
    })
    OpenaiChatModel9 = {
        model: {
            __rl: true,
            value: 'gpt-4.1-nano',
            mode: 'list',
            cachedResultName: 'gpt-4.1-nano',
        },
        options: {},
    };

    @node({
        id: 'b435b683-23e4-47e8-8a76-93568061f31b',
        name: 'Structured Output Parser9',
        type: '@n8n/n8n-nodes-langchain.outputParserStructured',
        version: 1.3,
        position: [112, 1184],
    })
    StructuredOutputParser9 = {
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
        id: '34499045-0965-4cde-9cc9-ad641456f780',
        name: 'Create summary and title4',
        type: '@n8n/n8n-nodes-langchain.chainLlm',
        version: 1.7,
        position: [2656, 112],
    })
    CreateSummaryAndTitle4 = {
        promptType: 'define',
        text: `=<content>
{{ $('If1').item.json.content }}
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
        id: '7a4834e9-f499-4fb1-87a4-6078fab73135',
        name: 'OpenAI Chat Model10',
        type: '@n8n/n8n-nodes-langchain.lmChatOpenAi',
        version: 1.2,
        position: [-32, -208],
        credentials: { openAiApi: { id: 'NoEKitspBJb0zQrp', name: 'Syntech GM OpenAi account' } },
    })
    OpenaiChatModel10 = {
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
        id: '578a9e6e-f207-4867-9d59-75b63e0dcfd2',
        name: 'Structured Output Parser10',
        type: '@n8n/n8n-nodes-langchain.outputParserStructured',
        version: 1.3,
        position: [2800, 336],
    })
    StructuredOutputParser10 = {
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
    };

    @node({
        id: '80350079-cfa5-44f9-b611-1a3c8525611f',
        name: 'X fields',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [1312, 16],
    })
    XFields = {
        assignments: {
            assignments: [
                {
                    id: 'ca614e10-a88b-4f70-8ea6-09a7dee7e772',
                    name: '=content',
                    value: '={{ $json.text }}',
                    type: 'string',
                },
                {
                    id: 'd7e8711b-7f7c-487e-8aae-afa5d6132cec',
                    name: 'url',
                    value: '=https://x.com/{{ $json.author.screen_name }}/status/{{ $json.tweet_id }}',
                    type: 'string',
                },
                {
                    id: '69a2c6ec-5340-4ef4-8dbb-c9bb1d945bfe',
                    name: 'publication_date',
                    value: '={{ $json.created_at }}',
                    type: 'string',
                },
                {
                    id: 'b3af0d59-d4e0-4dde-8bfc-6716e11d9089',
                    name: 'search_query',
                    value: "={{ $('Either Url or Keyword').item.json.url_or_keyword }}",
                    type: 'string',
                },
            ],
        },
        options: {},
    };

    @node({
        id: '5b919ad1-83c4-47c2-8bd2-8e8508077530',
        name: 'create longtail keyword',
        type: '@n8n/n8n-nodes-langchain.chainLlm',
        version: 1.7,
        position: [-32, 960],
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
                    message: `=Act as a Twitter/X search phrase generator.

You will receive a single keyword related to sustainable biofuels (e.g., “B20 FAME”, “used cooking oil”, etc.).

Your task is to generate a **short, relevant Twitter/X search query** that includes the keyword exactly as provided. The goal is to surface the **latest posts, commentary, or breaking news** about that keyword, with a **primary focus on the UK**, and **secondarily on the EU**.

---

**Rules:**
- Always include the input keyword exactly as given.
- Use concise, search-friendly language (no more than 6–8 words).
- Optionally include **hashtags**, country mentions (\`UK\`, \`EU\`), or terms like \`regulation\`, \`news\`, \`update\`, \`biofuel\`, \`policy\`, etc.
- No need for full sentences – this is a search term for X.
- Do **not** include usernames or links.

---

**Input format:** A single keyword (string)  
**Output format:** One short search query for Twitter/X

---

**Examples:**
- Input: \`used cooking oil\` → Output: \`used cooking oil UK biofuel news\`
- Input: \`B20 FAME\` → Output: \`B20 FAME UK regulation\`
- Input: \`waste-derived biodiesel\` → Output: \`#wastebiodiesel UK policy update\``,
                },
            ],
        },
        batching: {},
    };

    @node({
        id: 'd0c37b9b-b1a8-4a75-a390-9760cf0dc86b',
        name: 'If Valid Content?',
        type: 'n8n-nodes-base.if',
        version: 2.2,
        position: [1760, 112],
        alwaysOutputData: true,
    })
    IfValidContent = {
        conditions: {
            options: {
                caseSensitive: true,
                leftValue: '',
                typeValidation: 'strict',
                version: 2,
            },
            conditions: [
                {
                    id: '4a79dc1a-993d-4f55-a508-0b1fd1055780',
                    leftValue: '={{ $json.content }}',
                    rightValue: '',
                    operator: {
                        type: 'string',
                        operation: 'notEmpty',
                        singleValue: true,
                    },
                },
                {
                    id: 'b4353be1-5da7-4423-9018-2139e44ad239',
                    leftValue: '={{ $json.url }}',
                    rightValue: '',
                    operator: {
                        type: 'string',
                        operation: 'notEmpty',
                        singleValue: true,
                    },
                },
                {
                    id: '1acba9c2-9c44-4137-9da1-13473b6c47eb',
                    leftValue: '={{ $json.content }}',
                    rightValue: 'https://',
                    operator: {
                        type: 'string',
                        operation: 'notStartsWith',
                    },
                },
                {
                    id: '6d8ad5a5-a39d-44f2-8564-bdc8880305f2',
                    leftValue: '={{ $json.url }}',
                    rightValue: 'syntechbiofuel',
                    operator: {
                        type: 'string',
                        operation: 'notContains',
                    },
                },
                {
                    id: '378c0625-3c25-43cc-9739-0e72fdc20ce2',
                    leftValue: '={{ $json.publication_date }}',
                    rightValue: '={{ new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString() }}',
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
        id: 'c55f0799-d496-4442-8cc8-d1a71625cd81',
        name: 'Twitter/ X post fields1',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [3232, 240],
        retryOnFail: false,
    })
    TwitterXPostFields1 = {
        assignments: {
            assignments: [
                {
                    id: '1d34aa6b-dce8-4761-9a9a-a663f61a86ac',
                    name: 'title',
                    value: "={{ $('Create summary and title4').item.json.output.title }}",
                    type: 'string',
                },
                {
                    id: 'ab5c9158-a33a-4f8f-b6d0-a6787df0f0d5',
                    name: 'content',
                    value: "={{ $('Merge').item.json.content }}",
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
                    id: '0276c4d6-4a0f-49c5-95e1-9cece3690cc8',
                    name: 'summary',
                    value: "={{ $('Create summary and title4').item.json.output.summary }}",
                    type: 'string',
                },
                {
                    id: '9573ac47-f760-4075-af1e-41774d546f60',
                    name: 'search_query',
                    value: "={{ $('Merge').first().json.search_query }}",
                    type: 'string',
                },
                {
                    id: '42852696-c7af-4ce4-a273-e61970ef2e8f',
                    name: 'publication_date',
                    value: "={{ $('Merge').item.json.publication_date }}",
                    type: 'string',
                },
                {
                    id: '156a551e-8b0b-49ae-9543-4337fd48f33f',
                    name: 'source',
                    value: 'X',
                    type: 'string',
                },
                {
                    id: '8c19cd4c-cca7-4311-89c4-0efa9890e41e',
                    name: 'source_name',
                    value: "={{ $('Initial Input').item.json.property_name }}",
                    type: 'string',
                },
                {
                    id: 'de00eba2-7f0e-45a2-bf24-0c0b49c13404',
                    name: 'source_category',
                    value: "={{ $('Initial Input').item.json.property_category }}",
                    type: 'string',
                },
                {
                    id: '28519406-e423-4222-a586-4562a4dca6b9',
                    name: 'prompt',
                    value: "={{ $('Initial Input').first().json.prompt }}",
                    type: 'string',
                },
                {
                    id: 'cb2f856d-5f8b-4429-b6cb-550f05b4d09a',
                    name: 'additional_formats',
                    value: "={{ $('Initial Input').first().json.additional_formats }}",
                    type: 'string',
                },
                {
                    id: '3e7f1bc1-8eb9-48d5-9321-f67f466d2f83',
                    name: 'mode',
                    value: "={{ $('Initial Input').first().json.process_mode }}",
                    type: 'string',
                },
            ],
        },
        options: {},
    };

    @node({
        id: '4b31e3e8-708e-4b7c-ac6f-d0ad6eb2f766',
        name: 'Sticky Note',
        type: 'n8n-nodes-base.stickyNote',
        version: 1,
        position: [-176, -320],
    })
    StickyNote = {
        content: '## News scrap through Twitter ',
        height: 880,
        width: 3632,
        color: 6,
    };

    @node({
        id: 'c71290b8-aebe-4098-a4cf-c61e45690b90',
        name: 'Merge',
        type: 'n8n-nodes-base.merge',
        version: 3.2,
        position: [2208, 112],
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
        id: '609aba6e-7378-4efd-9373-28cddc689055',
        name: 'If1',
        type: 'n8n-nodes-base.if',
        version: 2.3,
        position: [2432, 112],
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
        id: '59e2937d-2f20-4696-a29a-5fd0051036b5',
        name: 'DeepSeek 3.',
        type: '@n8n/n8n-nodes-langchain.lmChatOpenRouter',
        version: 1,
        position: [2672, 336],
        credentials: { openRouterApi: { id: 'kUkOiAL6PjmdfexG', name: 'Syntech GM OpenRouter account' } },
    })
    Deepseek3 = {
        model: 'deepseek/deepseek-v3.2',
        options: {},
    };

    @node({
        id: '333692fa-0d24-42ce-8455-be33f4e36657',
        name: 'Get many rows supabase',
        type: 'n8n-nodes-base.supabase',
        version: 1,
        position: [-32, 624],
        credentials: { supabaseApi: { id: 'IT46INDKsZaZyCZQ', name: 'Stephen Supabase account' } },
        alwaysOutputData: false,
        executeOnce: true,
    })
    GetManyRowsSupabase = {
        operation: 'getAll',
        tableId: 'Syntech Twitter url',
        returnAll: true,
        filterType: 'none',
    };

    @node({
        id: 'c90091a4-d828-4803-ae55-2f677897a505',
        name: 'Get many rows',
        type: 'n8n-nodes-base.dataTable',
        version: 1.1,
        position: [1984, 208],
        executeOnce: true,
    })
    GetManyRows = {
        operation: 'get',
        dataTableId: {
            __rl: true,
            value: 'kqFbg6Y3MSPn65xN',
            mode: 'list',
            cachedResultName: 'NEWS+ Twitter',
            cachedResultUrl: '/projects/U9sMeJya1DaokkjK/datatables/kqFbg6Y3MSPn65xN',
        },
        returnAll: true,
    };

    @node({
        id: 'f55eb577-51e3-433a-9dae-e3c4ba7079bd',
        name: 'Create a row supabase',
        type: 'n8n-nodes-base.supabase',
        version: 1,
        position: [224, 624],
        credentials: { supabaseApi: { id: 'IT46INDKsZaZyCZQ', name: 'Stephen Supabase account' } },
    })
    CreateARowSupabase = {
        tableId: 'Syntech Twitter url',
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
        id: 'a8cfd738-4abb-4bd1-90ea-e6f73ce42b1b',
        name: 'Create a row',
        type: 'n8n-nodes-base.dataTable',
        version: 1.1,
        position: [2992, 128],
        executeOnce: false,
    })
    CreateARow = {
        operation: 'upsert',
        dataTableId: {
            __rl: true,
            value: 'kqFbg6Y3MSPn65xN',
            mode: 'list',
            cachedResultName: 'NEWS+ Twitter',
            cachedResultUrl: '/projects/U9sMeJya1DaokkjK/datatables/kqFbg6Y3MSPn65xN',
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

    // =====================================================================
    // ROUTAGE ET CONNEXIONS
    // =====================================================================

    @links()
    defineRouting() {
        this.InitialInput.out(0).to(this.Limit3.in(0));
        this.Limit3.out(0).to(this.LoopOverItems3.in(0));
        this.KeywordOrUrl.out(0).to(this.TwitterXPostScraperUrls.in(0));
        this.KeywordOrUrl.out(1).to(this.TwitterXPostScraperKeyword.in(0));
        this.Merge4.out(0).to(this.IfValidContent.in(0));
        this.EitherUrlOrKeyword.out(0).to(this.KeywordOrUrl.in(0));
        this.XFields1.out(0).to(this.Merge4.in(1));
        this.TwitterXPostScraperUrls.out(0).to(this.XFields.in(0));
        this.TwitterXPostScraperKeyword.out(0).to(this.XFields1.in(0));
        this.LoopOverItems3.out(1).to(this.EitherUrlOrKeyword.in(0));
        this.CreateSummaryAndTitle4.out(0).to(this.CreateARow.in(0));
        this.XFields.out(0).to(this.Merge4.in(0));
        this.IfValidContent.out(0).to(this.Merge.in(0));
        this.IfValidContent.out(0).to(this.GetManyRows.in(0));
        this.IfValidContent.out(1).to(this.LoopOverItems3.in(0));
        this.TwitterXPostFields1.out(0).to(this.LoopOverItems3.in(0));
        this.Merge.out(0).to(this.If1.in(0));
        this.If1.out(0).to(this.CreateSummaryAndTitle4.in(0));
        this.If1.out(1).to(this.LoopOverItems3.in(0));
        this.GetManyRowsSupabase.out(0).to(this.CreateARowSupabase.in(0));
        this.GetManyRows.out(0).to(this.Merge.in(1));
        this.CreateARow.out(0).to(this.TwitterXPostFields1.in(0));

        this.CreateSummaryAndTitle4.uses({
            ai_languageModel: this.Deepseek3.output,
            ai_outputParser: this.StructuredOutputParser10.output,
        });
        this.CreateLongtailKeyword.uses({
            ai_languageModel: this.OpenaiChatModel9.output,
            ai_outputParser: this.StructuredOutputParser9.output,
        });
    }
}
