import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : LinkedIn Search (Profile, Keyword, Company)
// Nodes   : 27  |  Connections: 26
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// Start                              executeWorkflowTrigger
// LinkedinProfileScraper             apify                      [onError→out(1)] [creds] [alwaysOutput]
// Limit4                             limit
// EitherUrlOrKeyword2                set
// Merge5                             merge                      [alwaysOutput]
// LinkedinFields                     set                        [alwaysOutput]
// LinkedinFields1                    set                        [alwaysOutput]
// LoopOverItems2                     splitInBatches
// CreateSummaryAndTitle3             chainLlm                   [AI] [retry]
// StructuredOutputParser8            outputParserStructured     [ai_outputParser]
// LinkedinCompanyPostSearchScraper   apify                      [onError→out(1)] [creds] [alwaysOutput]
// Switch1                            switch
// LinkedinKewordScraper              apify                      [onError→out(1)] [creds] [alwaysOutput]
// LinkedinPostSearchScraperFields    set
// StickyNote                         stickyNote
// GetManyRows                        supabase                   [creds] [executeOnce]
// Merge                              merge                      [alwaysOutput]
// If1                                if
// CreateARow                         supabase                   [creds]
// LinkedinFields2                    set                        [alwaysOutput]
// Deepseek3                          lmChatOpenRouter           [creds]
// IfValidContent                     if
// OpenaiChatModel                    lmChatOpenAi               [creds]
// GetManyRows1                       dataTable                  [executeOnce]
// CreateARow1                        dataTable
// GetManyRowsFilteredByDate          dataTable                  [executeOnce]
// OpenaiChatModel1                   lmChatOpenAi               [creds] [ai_languageModel]
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// Start
//    → Limit4
//      → LoopOverItems2
//       .out(1) → EitherUrlOrKeyword2
//          → Switch1
//            → LinkedinKewordScraper
//              → LinkedinFields2
//                → Merge5
//                  → IfValidContent
//                    → Merge
//                      → If1
//                        → CreateSummaryAndTitle3
//                          → CreateARow1
//                            → LinkedinPostSearchScraperFields
//                              → LoopOverItems2 (↩ loop)
//                       .out(1) → LoopOverItems2 (↩ loop)
//                    → GetManyRows1
//                      → Merge.in(1) (↩ loop)
//                   .out(1) → LoopOverItems2 (↩ loop)
//           .out(1) → LinkedinProfileScraper
//              → LinkedinFields
//                → Merge5.in(1) (↩ loop)
//           .out(2) → LinkedinCompanyPostSearchScraper
//              → LinkedinFields1
//                → Merge5.in(2) (↩ loop)
// GetManyRows
//    → CreateARow
//      → GetManyRowsFilteredByDate
//
// AI CONNECTIONS
// CreateSummaryAndTitle3.uses({ ai_outputParser: StructuredOutputParser8, ai_languageModel: OpenaiChatModel1 })
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'p9T1CJ8sI5Q18MoG',
    name: 'LinkedIn Search (Profile, Keyword, Company)',
    active: true,
    isArchived: false,
    projectId: 'U9sMeJya1DaokkjK',
    tags: ['NEWS+'],
    settings: {
        executionOrder: 'v1',
        saveExecutionProgress: true,
        callerPolicy: 'workflowsFromSameOwner',
        availableInMCP: false,
        timeSavedPerExecution: 1,
        timeSavedMode: 'fixed',
        errorWorkflow: 'o41mt2JfV10VTV65',
        binaryMode: 'separate',
    },
})
export class LinkedinSearchProfileKeywordCompanyWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: '1908423c-0a8e-4d48-bf60-6fc7ba9e0124',
        name: 'Start',
        type: 'n8n-nodes-base.executeWorkflowTrigger',
        version: 1.1,
        position: [-13808, -3760],
    })
    Start = {
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
        id: '9c012d8b-8c74-423c-8e9e-864f589ac80d',
        name: 'Linkedin profile scraper',
        type: '@apify/n8n-nodes-apify.apify',
        version: 1,
        position: [-12688, -4144],
        credentials: { apifyApi: { id: 'JsuEKmvPtVt6JvXD', name: 'Syntech GM Apify account' } },
        onError: 'continueErrorOutput',
        alwaysOutputData: true,
    })
    LinkedinProfileScraper = {
        operation: 'Run actor and get dataset',
        actorSource: 'store',
        actorId: {
            __rl: true,
            value: 'A3cAPGpwBEG8RJwse',
            mode: 'list',
            cachedResultName:
                'LinkedIn Profile Posts Bulk Scraper (No Cookies)⚡$2 per 1k (harvestapi/linkedin-profile-posts)',
            cachedResultUrl: 'https://console.apify.com/actors/A3cAPGpwBEG8RJwse/input',
        },
        customBody: `={
    "includeQuotePosts": false,
    "includeReposts": false,
    "maxComments": 0,
    "maxPosts": 5,
    "maxReactions": 0,
    "postedLimit": "month",
    "scrapeComments": false,
    "scrapeReactions": false,
    "targetUrls": [
        "{{ $json.url_or_keyword }}"
    ]
}`,
    };

    @node({
        id: '6bb364ec-9f65-4cd5-a71e-03914fe8971d',
        name: 'Limit4',
        type: 'n8n-nodes-base.limit',
        version: 1,
        position: [-13584, -3760],
    })
    Limit4 = {
        maxItems: 100,
    };

    @node({
        id: '5dd9cd63-b40f-4281-b6e4-b749253b7b7a',
        name: 'Either Url or Keyword2',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [-13136, -4192],
    })
    EitherUrlOrKeyword2 = {
        assignments: {
            assignments: [
                {
                    id: '8efead37-57d8-4101-9010-c855f2525db6',
                    name: 'url_or_keyword',
                    value: '={{ $json.property_url || $json.url_or_keyword || $json.name }}',
                    type: 'string',
                },
                {
                    id: '20618a33-4eba-4a9e-99e3-5271598f180c',
                    name: 'prompt',
                    value: '={{ $json.prompt }}',
                    type: 'string',
                },
                {
                    id: 'f195a260-08af-4cc2-a6b1-7e5f306adb5c',
                    name: 'additional_formats',
                    value: '={{ $json.additional_formats }}',
                    type: 'string',
                },
            ],
        },
        options: {},
    };

    @node({
        id: 'e81ebcac-7c35-4a4c-9505-5cabe71be38f',
        name: 'Merge5',
        type: 'n8n-nodes-base.merge',
        version: 3.2,
        position: [-12240, -4160],
        alwaysOutputData: true,
    })
    Merge5 = {
        numberInputs: 3,
    };

    @node({
        id: '1e62cb7e-3cd3-47d1-aad0-933af76a3aa5',
        name: 'linkedin fields',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [-12464, -4144],
        alwaysOutputData: true,
    })
    LinkedinFields = {
        assignments: {
            assignments: [
                {
                    id: '85711e61-d413-47d4-b046-f368cd9ea7e6',
                    name: 'url',
                    value: '={{ $json.linkedinUrl }}',
                    type: 'string',
                },
                {
                    id: '3ecbaa12-9e7c-4210-adf3-8ae326daa833',
                    name: 'content',
                    value: '={{ $json.content }}',
                    type: 'string',
                },
                {
                    id: 'b3e1beef-2b90-40f4-b275-f09998ec258b',
                    name: 'publication_date',
                    value: '={{ $json.postedAt.date }}',
                    type: 'string',
                },
                {
                    id: 'bcd3d0bb-05f7-4e46-9292-c9f035648ba8',
                    name: 'search_query',
                    value: "={{ $('Either Url or Keyword2').item.json.url_or_keyword }}",
                    type: 'string',
                },
            ],
        },
        options: {},
    };

    @node({
        id: 'f893a992-f5dc-4426-a28d-546ce0ed5508',
        name: 'linkedin fields1',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [-12464, -3952],
        alwaysOutputData: true,
    })
    LinkedinFields1 = {
        assignments: {
            assignments: [
                {
                    id: '85711e61-d413-47d4-b046-f368cd9ea7e6',
                    name: 'url',
                    value: '={{ $json.linkedinUrl }}',
                    type: 'string',
                },
                {
                    id: '3ecbaa12-9e7c-4210-adf3-8ae326daa833',
                    name: 'content',
                    value: '={{ $json.content }}',
                    type: 'string',
                },
                {
                    id: 'b3e1beef-2b90-40f4-b275-f09998ec258b',
                    name: 'publication_date',
                    value: '={{ $json.postedAt.date }}',
                    type: 'string',
                },
                {
                    id: 'bcd3d0bb-05f7-4e46-9292-c9f035648ba8',
                    name: 'search_query',
                    value: "={{ $('Either Url or Keyword2').item.json.url_or_keyword }}",
                    type: 'string',
                },
            ],
        },
        options: {},
    };

    @node({
        id: '4779a52e-eec3-455d-8929-0f5e51e7f392',
        name: 'Loop Over Items2',
        type: 'n8n-nodes-base.splitInBatches',
        version: 3,
        position: [-13360, -3760],
    })
    LoopOverItems2 = {
        options: {},
    };

    @node({
        id: '4e404d22-d31c-47d4-9f48-bb547a057a2b',
        name: 'Create summary and title3',
        type: '@n8n/n8n-nodes-langchain.chainLlm',
        version: 1.7,
        position: [-11072, -4144],
        retryOnFail: true,
        waitBetweenTries: 5000,
    })
    CreateSummaryAndTitle3 = {
        promptType: 'define',
        text: `=<content>
{{ $('If1').item.json.content }}
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
        id: '1ff8f019-ed54-464f-b6ec-2cdfded1882f',
        name: 'Structured Output Parser8',
        type: '@n8n/n8n-nodes-langchain.outputParserStructured',
        version: 1.3,
        position: [-10864, -3920],
    })
    StructuredOutputParser8 = {
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
        id: 'd970d390-4ab3-4abf-8b38-8d70b7b8e274',
        name: 'Linkedin company post search scraper',
        type: '@apify/n8n-nodes-apify.apify',
        version: 1,
        position: [-12688, -3952],
        credentials: { apifyApi: { id: 'JsuEKmvPtVt6JvXD', name: 'Syntech GM Apify account' } },
        onError: 'continueErrorOutput',
        alwaysOutputData: true,
    })
    LinkedinCompanyPostSearchScraper = {
        operation: 'Run actor and get dataset',
        actorSource: 'store',
        actorId: {
            __rl: true,
            value: 'WI0tj4Ieb5Kq458gB',
            mode: 'list',
            cachedResultName:
                'LinkedIn Company Posts Scraper (No Cookies) ✅ $2 per 1k (harvestapi/linkedin-company-posts)',
            cachedResultUrl: 'https://console.apify.com/actors/WI0tj4Ieb5Kq458gB/input',
        },
        customBody: `={
    "includeQuotePosts": false,
    "includeReposts": false,
    "maxPosts": 5,
    "postedLimit": "month",
    "scrapeComments": false,
    "scrapeReactions": false,
    "targetUrls": [
        "{{ $json.url_or_keyword }}"
    ]
}`,
    };

    @node({
        id: '9c6d228c-026a-41ff-9479-271961df3214',
        name: 'Switch1',
        type: 'n8n-nodes-base.switch',
        version: 3.3,
        position: [-12912, -4208],
    })
    Switch1 = {
        rules: {
            values: [
                {
                    conditions: {
                        options: {
                            caseSensitive: true,
                            leftValue: '',
                            typeValidation: 'strict',
                            version: 2,
                        },
                        conditions: [
                            {
                                leftValue: '={{ $json.url_or_keyword }}',
                                rightValue: 'https://',
                                operator: {
                                    type: 'string',
                                    operation: 'notContains',
                                },
                                id: '9bd7a37d-5619-4b82-ac94-75dd3df5d5ca',
                            },
                        ],
                        combinator: 'and',
                    },
                    renameOutput: true,
                    outputKey: 'Keyword',
                },
                {
                    conditions: {
                        options: {
                            caseSensitive: true,
                            leftValue: '',
                            typeValidation: 'strict',
                            version: 2,
                        },
                        conditions: [
                            {
                                id: '89af75b5-0f31-4712-950f-767d7199e28f',
                                leftValue: '={{ $json.url_or_keyword }}',
                                rightValue: 'https://www.linkedin.com/in/',
                                operator: {
                                    type: 'string',
                                    operation: 'contains',
                                },
                            },
                        ],
                        combinator: 'and',
                    },
                    renameOutput: true,
                    outputKey: 'profile url',
                },
                {
                    conditions: {
                        options: {
                            caseSensitive: true,
                            leftValue: '',
                            typeValidation: 'strict',
                            version: 2,
                        },
                        conditions: [
                            {
                                id: 'a6aba742-8519-4530-9004-d805321fcd21',
                                leftValue: '={{ $json.url_or_keyword }}',
                                rightValue: 'https://www.linkedin.com/company/',
                                operator: {
                                    type: 'string',
                                    operation: 'contains',
                                },
                            },
                        ],
                        combinator: 'and',
                    },
                    renameOutput: true,
                    outputKey: 'company url',
                },
            ],
        },
        options: {},
    };

    @node({
        id: '6a5c11a2-c447-47f5-8885-a7065fca8802',
        name: 'Linkedin keword scraper',
        type: '@apify/n8n-nodes-apify.apify',
        version: 1,
        position: [-12688, -4336],
        credentials: { apifyApi: { id: 'JsuEKmvPtVt6JvXD', name: 'Syntech GM Apify account' } },
        onError: 'continueErrorOutput',
        alwaysOutputData: true,
    })
    LinkedinKewordScraper = {
        operation: 'Run actor and get dataset',
        actorSource: 'store',
        actorId: {
            __rl: true,
            value: 'buIWk2uOUzTmcLsuB',
            mode: 'list',
            cachedResultName: 'Linkedin Post Search Scraper (No Cookies) (harvestapi/linkedin-post-search)',
            cachedResultUrl: 'https://console.apify.com/actors/buIWk2uOUzTmcLsuB/input',
        },
        customBody: `={
    "maxPosts": 5,
    "scrapeComments": false,
    "scrapeReactions": false,
    "searchQueries": [
        "{{ $('Either Url or Keyword2').item.json.url_or_keyword }}"
    ]
}`,
    };

    @node({
        id: '0d25986b-cad1-44fc-bca0-03104edf2970',
        name: 'Linkedin post search scraper fields',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [-10432, -3968],
    })
    LinkedinPostSearchScraperFields = {
        assignments: {
            assignments: [
                {
                    id: '43ef6d98-1769-479a-ab8a-0f9d4d543ce6',
                    name: 'title',
                    value: "={{ $('Create summary and title3').item.json.output.title }}",
                    type: 'string',
                },
                {
                    id: '014cb7eb-9846-4c41-8cee-4a809250264e',
                    name: 'content',
                    value: "={{ $('Merge').item.json.content }}",
                    type: 'string',
                },
                {
                    id: 'b2be53b4-3451-4aeb-be78-c71beb7a8178',
                    name: 'url',
                    value: `={{ 
  decodeURIComponent(
    $('Merge').item.json.url
      .replace(/^https:\\/\\/www\\.google\\.com\\/url\\?rct=j&sa=t&url=/, '')
      .split('&')[0]
  )
}}`,
                    type: 'string',
                },
                {
                    id: '54293f71-70d3-40d0-9f40-19de090bcd63',
                    name: 'summary',
                    value: "={{ $('Create summary and title3').item.json.output.summary }}",
                    type: 'string',
                },
                {
                    id: 'ce7b5d35-72b2-4f82-8744-f1643dd958eb',
                    name: 'search_query',
                    value: "={{ $('Merge').first().json.search_query }}",
                    type: 'string',
                },
                {
                    id: 'db4f55e1-7247-4206-a654-e5d314dbd40b',
                    name: 'publication_date',
                    value: "={{ $('Merge').item.json.publication_date }}",
                    type: 'string',
                },
                {
                    id: '7674fce2-3c47-4703-88e3-c55a4990ee5c',
                    name: 'prompt',
                    value: "={{ $('Either Url or Keyword2').first().json.prompt }}",
                    type: 'string',
                },
                {
                    id: '694d03a3-b47b-4515-9ed7-fa8cf0d4b0b6',
                    name: 'additional_formats',
                    value: "={{ $('Either Url or Keyword2').first().json.additional_formats }}",
                    type: 'string',
                },
                {
                    id: 'cdb58557-3653-4500-943e-71ea35ec0f27',
                    name: 'source',
                    value: 'LinkedIn',
                    type: 'string',
                },
                {
                    id: '428c69e0-b325-4cf8-ae56-85faec6ca685',
                    name: 'source_category',
                    value: "={{ $('Start').item.json.property_category }}",
                    type: 'string',
                },
                {
                    id: '8546cd27-cefc-4d61-a3e7-86f0c66b12c9',
                    name: 'source_name',
                    value: "={{ $('Start').item.json.property_name }}",
                    type: 'string',
                },
                {
                    id: '070c84e8-8286-4abb-b573-4a18af055f6d',
                    name: 'mode',
                    value: "={{ $('Start').first().json.process_mode }}",
                    type: 'string',
                },
            ],
        },
        options: {},
    };

    @node({
        id: 'b865c9e3-8bb3-4c43-9a1c-fce32593dd77',
        name: 'Sticky Note',
        type: 'n8n-nodes-base.stickyNote',
        version: 1,
        position: [-13872, -4576],
    })
    StickyNote = {
        content: '## News Scrap through LinkedIn url',
        height: 976,
        width: 3600,
        color: 4,
    };

    @node({
        id: 'e3ed024e-fe05-4235-b96b-b2654416cfa1',
        name: 'Get many rows',
        type: 'n8n-nodes-base.supabase',
        version: 1,
        position: [-13808, -3536],
        credentials: { supabaseApi: { id: 'IT46INDKsZaZyCZQ', name: 'Stephen Supabase account' } },
        alwaysOutputData: false,
        executeOnce: true,
    })
    GetManyRows = {
        operation: 'getAll',
        tableId: 'Syntech linkedin url',
        returnAll: true,
        filterType: 'none',
    };

    @node({
        id: 'e154ca37-7cc4-4f6d-ad4e-140e9972ff3a',
        name: 'Merge',
        type: 'n8n-nodes-base.merge',
        version: 3.2,
        position: [-11568, -4144],
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
        id: '04435cec-46d1-4b38-97bd-6ba36f4a439d',
        name: 'If1',
        type: 'n8n-nodes-base.if',
        version: 2.3,
        position: [-11344, -4144],
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
        id: '9a2e359f-1410-480b-9fb2-527dd19f15d6',
        name: 'Create a row',
        type: 'n8n-nodes-base.supabase',
        version: 1,
        position: [-13584, -3536],
        credentials: { supabaseApi: { id: 'IT46INDKsZaZyCZQ', name: 'Stephen Supabase account' } },
    })
    CreateARow = {
        tableId: 'Syntech linkedin url',
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
        id: '2d57f5c6-b31d-42e4-b63e-9ee1161e462f',
        name: 'linkedin fields2',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [-12464, -4336],
        alwaysOutputData: true,
    })
    LinkedinFields2 = {
        assignments: {
            assignments: [
                {
                    id: '85711e61-d413-47d4-b046-f368cd9ea7e6',
                    name: 'url',
                    value: '={{ $json.linkedinUrl }}',
                    type: 'string',
                },
                {
                    id: '3ecbaa12-9e7c-4210-adf3-8ae326daa833',
                    name: 'content',
                    value: '={{ $json.content }}',
                    type: 'string',
                },
                {
                    id: 'b3e1beef-2b90-40f4-b275-f09998ec258b',
                    name: 'publication_date',
                    value: '={{ $json.postedAt.date }}',
                    type: 'string',
                },
                {
                    id: 'bcd3d0bb-05f7-4e46-9292-c9f035648ba8',
                    name: 'search_query',
                    value: "={{ $('Either Url or Keyword2').item.json.url_or_keyword }}",
                    type: 'string',
                },
            ],
        },
        options: {},
    };

    @node({
        id: 'e9be87fc-06bd-4498-9068-29111ca49c38',
        name: 'DeepSeek 3.',
        type: '@n8n/n8n-nodes-langchain.lmChatOpenRouter',
        version: 1,
        position: [-11120, -3920],
        credentials: { openRouterApi: { id: 'kUkOiAL6PjmdfexG', name: 'Syntech GM OpenRouter account' } },
    })
    Deepseek3 = {
        model: 'deepseek/deepseek-v3.2',
        options: {},
    };

    @node({
        id: '6b90dccb-1023-40fb-98e2-4e1ca8000d3a',
        name: 'If Valid Content?',
        type: 'n8n-nodes-base.if',
        version: 2.2,
        position: [-12016, -4144],
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
            ],
            combinator: 'and',
        },
        options: {},
    };

    @node({
        id: '2561ac0a-3d28-41e7-9e84-4e6dc55797f2',
        name: 'OpenAI Chat Model',
        type: '@n8n/n8n-nodes-langchain.lmChatOpenAi',
        version: 1.2,
        position: [-13808, -4544],
        credentials: { openAiApi: { id: 'NoEKitspBJb0zQrp', name: 'Syntech GM OpenAi account' } },
    })
    OpenaiChatModel = {
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
        id: 'e8c3a733-9a88-4ec8-9fa8-abec3078e639',
        name: 'Get many rows1',
        type: 'n8n-nodes-base.dataTable',
        version: 1.1,
        position: [-11792, -4000],
        executeOnce: true,
    })
    GetManyRows1 = {
        operation: 'get',
        dataTableId: {
            __rl: true,
            value: 'ZxmRSG3yvK2zI93g',
            mode: 'list',
            cachedResultName: 'NEWS+ LinkedIn',
            cachedResultUrl: '/projects/U9sMeJya1DaokkjK/datatables/ZxmRSG3yvK2zI93g',
        },
        filters: {
            conditions: [
                {
                    keyName: 'createdAt',
                    condition: 'gte',
                    keyValue: "={{ $now.minus(60, 'days') }}",
                },
            ],
        },
        returnAll: true,
    };

    @node({
        id: 'a66723db-2eb2-4456-b7cc-df8008a5d095',
        name: 'Create a row1',
        type: 'n8n-nodes-base.dataTable',
        version: 1.1,
        position: [-10656, -4144],
        executeOnce: false,
    })
    CreateARow1 = {
        operation: 'upsert',
        dataTableId: {
            __rl: true,
            value: 'ZxmRSG3yvK2zI93g',
            mode: 'list',
            cachedResultName: 'NEWS+ LinkedIn',
            cachedResultUrl: '/projects/U9sMeJya1DaokkjK/datatables/ZxmRSG3yvK2zI93g',
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

    @node({
        id: 'f2cc509c-09fd-4ce1-bd27-899acf05c39c',
        name: 'Get many rows filtered by date',
        type: 'n8n-nodes-base.dataTable',
        version: 1.1,
        position: [-13360, -3536],
        executeOnce: true,
    })
    GetManyRowsFilteredByDate = {
        operation: 'get',
        dataTableId: {
            __rl: true,
            value: 'ZxmRSG3yvK2zI93g',
            mode: 'list',
            cachedResultName: 'NEWS+ LinkedIn',
            cachedResultUrl: '/projects/U9sMeJya1DaokkjK/datatables/ZxmRSG3yvK2zI93g',
        },
        filters: {
            conditions: [
                {
                    keyName: 'createdAt',
                    condition: 'gt',
                    keyValue: "={{ $now.minus(60, 'days') }}",
                },
            ],
        },
        returnAll: true,
        orderBy: true,
    };

    @node({
        id: 'd7ec9893-78af-4e0d-b9d6-63c1e9068d95',
        name: 'OpenAI Chat Model1',
        type: '@n8n/n8n-nodes-langchain.lmChatOpenAi',
        version: 1.3,
        position: [-10992, -3920],
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
        options: {},
    };

    // =====================================================================
    // ROUTAGE ET CONNEXIONS
    // =====================================================================

    @links()
    defineRouting() {
        this.Start.out(0).to(this.Limit4.in(0));
        this.LinkedinProfileScraper.out(0).to(this.LinkedinFields.in(0));
        this.Limit4.out(0).to(this.LoopOverItems2.in(0));
        this.EitherUrlOrKeyword2.out(0).to(this.Switch1.in(0));
        this.Merge5.out(0).to(this.IfValidContent.in(0));
        this.LinkedinFields.out(0).to(this.Merge5.in(1));
        this.LinkedinFields1.out(0).to(this.Merge5.in(2));
        this.LoopOverItems2.out(1).to(this.EitherUrlOrKeyword2.in(0));
        this.CreateSummaryAndTitle3.out(0).to(this.CreateARow1.in(0));
        this.LinkedinCompanyPostSearchScraper.out(0).to(this.LinkedinFields1.in(0));
        this.Switch1.out(0).to(this.LinkedinKewordScraper.in(0));
        this.Switch1.out(1).to(this.LinkedinProfileScraper.in(0));
        this.Switch1.out(2).to(this.LinkedinCompanyPostSearchScraper.in(0));
        this.LinkedinPostSearchScraperFields.out(0).to(this.LoopOverItems2.in(0));
        this.GetManyRows.out(0).to(this.CreateARow.in(0));
        this.Merge.out(0).to(this.If1.in(0));
        this.If1.out(0).to(this.CreateSummaryAndTitle3.in(0));
        this.If1.out(1).to(this.LoopOverItems2.in(0));
        this.CreateARow.out(0).to(this.GetManyRowsFilteredByDate.in(0));
        this.LinkedinKewordScraper.out(0).to(this.LinkedinFields2.in(0));
        this.LinkedinFields2.out(0).to(this.Merge5.in(0));
        this.IfValidContent.out(0).to(this.Merge.in(0));
        this.IfValidContent.out(0).to(this.GetManyRows1.in(0));
        this.IfValidContent.out(1).to(this.LoopOverItems2.in(0));
        this.CreateARow1.out(0).to(this.LinkedinPostSearchScraperFields.in(0));
        this.GetManyRows1.out(0).to(this.Merge.in(1));

        this.CreateSummaryAndTitle3.uses({
            ai_languageModel: this.OpenaiChatModel1.output,
            ai_outputParser: this.StructuredOutputParser8.output,
        });
    }
}
