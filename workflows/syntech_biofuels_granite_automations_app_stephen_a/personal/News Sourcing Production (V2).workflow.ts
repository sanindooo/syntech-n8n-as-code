import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : News Sourcing Production (V2)
// Nodes   : 140  |  Connections: 126
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// ScheduleTrigger                    scheduleTrigger
// Merge                              merge
// GetAllSources                      notion                     [creds]
// MatchSources                       switch
// GetActiveSources                   filter
// GetAllResults                      notion                     [creds] [alwaysOutput] [executeOnce]
// RemoveDuplicates                   merge
// IfHighPriority                     if
// Randomise                          sort
// MatchInputFormat                   set                        [executeOnce]
// Evaluation                         evaluation
// RunEvaluation                      evaluationTrigger          [creds]
// SetOutputInEvaluationGoogleSheet   evaluation                 [creds]
// IfPublicationDate                  if
// IfTextLongerThan2000Chars          if
// SplitsTextInSmallChuncks           code
// If2                                if
// Merge1                             merge
// LoopOverItems                      splitInBatches
// IfPublicationDate2                 if
// SetArticleUrl                      set
// AddContentToPost                   notion                     [onError→out(1)] [creds] [retry]
// Sources                            set
// NoOperationDoNothing               noOp
// Merge3                             merge
// FormSubmission1                    webhook
// IfFromForm                         if
// SelectFields                       set
// RemoveDuplicates1                  merge
// SetGoogleSheetFields               set
// GetAllIdeasFromEvaluationTable2    googleSheets               [creds] [executeOnce]
// IsContentEmpty                     filter
// IfFromForm1                        if
// RemoveDuplicates3                  removeDuplicates
// Sort                               sort
// ValidContentOnlyScoreAbove2        filter
// Limit1                             limit
// GetAllSources1                     notion                     [creds]
// Filter                             filter
// AddContentIdeaToEvaluationTable1   googleSheets               [creds]
// OpenaiChatModel8                   lmChatOpenAi               [creds] [ai_languageModel]
// Evaluation1                        evaluation                 [AI]
// UrgentlyWatchedList                executeWorkflowTrigger
// ManuallyTriggerContentEngine       webhook
// ScrapeAUrlAndGetItsContent3        firecrawl                  [onError→regular] [creds]
// IfNotError3                        if
// FailedUrls1                        set
// ExtractContent3                    httpRequest                [onError→out(1)]
// Markdown2                          markdown
// ExtractDate4                       code
// CreateSummaryAndTitle10            chainLlm                   [AI]
// OpenaiChatModel15                  lmChatOpenAi               [creds] [ai_languageModel]
// StructuredOutputParser21           outputParserStructured     [ai_outputParser]
// Filter6                            filter
// Merge11                            merge
// RssSearchFields2                   set
// CreateSummaryAndTitle11            chainLlm                   [AI]
// OpenaiChatModel16                  lmChatOpenAi               [creds] [ai_languageModel]
// StructuredOutputParser22           outputParserStructured     [ai_outputParser]
// RssSearchFields3                   set
// AddContentWithDate                 httpRequest                [onError→out(1)] [creds]
// AddContentWithoutDate              httpRequest                [onError→out(1)] [creds]
// StickyNote6                        stickyNote
// StickyNote7                        stickyNote
// MapDataForNotion                   set
// MapDataForNotion1                  set
// CheckSourcesExecuted               if
// CheckSourcesExecuted1              if
// Get15Ideas                         limit
// CallLinkedinSearchProfileKeywordCompany executeWorkflow
// CallTavilyKeywordSearch            executeWorkflow
// CallSearchInstagramPage            executeWorkflow
// CallSearchWebsiteFromForm          executeWorkflow
// CallSearchTwitterXPostAndKeyword   executeWorkflow
// CallRssWebsiteSearchNoRssUrl       executeWorkflow
// CallRssWebsiteSearchWithRssUrl     executeWorkflow
// NoRssUrlAvailable                  filter
// SendAMessage1                      slack                      [creds]
// SendAMessage                       slack                      [creds]
// SendAMessage2                      slack                      [creds]
// SendAMessage3                      slack                      [creds]
// AddContentWithDate1                httpRequest                [onError→out(1)] [creds]
// SendAMessage4                      slack                      [creds]
// AddContentWithoutDate1             httpRequest                [onError→out(1)] [creds]
// SendAMessage5                      slack                      [creds]
// SendAMessage6                      slack                      [creds]
// Sonnet45T06                        lmChatAnthropic            [creds]
// AnthropicChatModel6                lmChatAnthropic            [creds]
// AnthropicChatModel7                lmChatAnthropic            [creds]
// AnthropicChatModel8                lmChatAnthropic            [creds]
// StickyNote13                       stickyNote
// StickyNote14                       stickyNote
// StickyNote15                       stickyNote
// StickyNote16                       stickyNote
// Get100BestArticles                 limit
// StructuredOutputParser2            outputParserStructured     [AI] [retry]
// StructuredOutputParser24           outputParserStructured
// StructuredOutputParser25           outputParserStructured
// StructuredOutputParser26           outputParserStructured
// StructuredOutputParser27           outputParserStructured     [AI]
// CallSearchGoogleSyntech            executeWorkflow            [onError→regular]
// ClassifyViaRelevanceService        httpRequest                [onError→out(1)] [creds] [retry]
// PerformFinalCalculation            code
// Limit16Items                       limit
// AnthropicChatModel2                lmChatAnthropic            [creds] [ai_languageModel]
// StructuredOutputParser             outputParserStructured     [AI]
// ThresholdMet                       if
// SelectFields1                      set
// MapDataForNotion2                  set
// MapDataForNotion3                  set
// AddContentWithDate2                httpRequest                [onError→out(1)] [creds]
// AddContentWithDate3                httpRequest                [onError→out(1)] [creds]
// StickyNote                         stickyNote
// AnthropicChatModel                 lmChatAnthropic            [creds] [ai_languageModel]
// Stage4ClassificationAgentClaudeOptimisation1 chainLlm                   [retry]
// Aggregate                          aggregate
// SemanticKeywordDeduplication       httpRequest                [retry]
// StickyNote1                        stickyNote
// DeduplicatedArticles               splitOut
// GetDefaultPlatformPrompts          notion                     [creds] [executeOnce]
// GetDefaultImagePrompts             notion                     [creds] [executeOnce]
// AggregateImagePrompts              aggregate
// AggregatePlatformPrompts           aggregate
// SetPlatformPrompts                 set
// SetImagePrompts                    set
// FinalInput                         merge
// ImageAndPlatformPrompts            merge
// DefaultArticleOutputs              aggregate
// StickyNote2                        stickyNote
// OpenaiChatModel1                   lmChatOpenAi               [creds]
// OpenaiChatModel                    lmChatOpenAi               [creds]
// OpenaiChatModel2                   lmChatOpenAi               [creds]
// OpenaiChatModel3                   lmChatOpenAi               [creds]
// AnthropicChatModel1                lmChatAnthropic            [creds] [ai_languageModel]
// OpenaiChatModel4                   lmChatOpenAi               [creds]
// Sonnet45T0                         lmChatAnthropic            [creds]
// CodeInJavascript                   code
// FilterArticlesByTopic2             httpRequest                [onError→out(1)] [creds] [retry]
// FilterArticlesByTopic              httpRequest                [onError→out(1)] [creds] [retry]
// FilterArticlesByTopic1             httpRequest                [onError→out(1)] [creds] [retry]
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// ScheduleTrigger
//    → GetAllSources
//      → GetActiveSources
//        → IfHighPriority
//          → Merge3
//            → Limit1
//              → MatchSources
//                → CallRssWebsiteSearchWithRssUrl
//                  → Merge.in(2)
//                    → IsContentEmpty
//                      → RemoveDuplicates3
//                        → GetAllResults
//                          → RemoveDuplicates.in(1)
//                            → IfFromForm
//                              → SelectFields
//                                → Filter
//                                  → SetGoogleSheetFields
//                                    → RemoveDuplicates1
//                                      → AddContentIdeaToEvaluationTable1
//                                  → GetAllIdeasFromEvaluationTable2
//                                    → RemoveDuplicates1.in(1) (↩ loop)
//                                → GetDefaultPlatformPrompts
//                                  → AggregatePlatformPrompts
//                                    → SetPlatformPrompts
//                                      → ImageAndPlatformPrompts
//                                        → DefaultArticleOutputs
//                                          → FinalInput
//                                            → IfFromForm1
//                                              → IfTextLongerThan2000Chars
//                                                → LoopOverItems
//                                                  → NoOperationDoNothing
//                                                 .out(1) → CheckSourcesExecuted1
//                                                    → MapDataForNotion1
//                                                      → SplitsTextInSmallChuncks
//                                                        → If2
//                                                          → IfPublicationDate2
//                                                            → AddContentWithDate
//                                                              → SetArticleUrl
//                                                                → Merge1
//                                                                  → AddContentToPost
//                                                                    → LoopOverItems (↩ loop)
//                                                                   .out(1) → SendAMessage2
//                                                                      → LoopOverItems (↩ loop)
//                                                             .out(1) → SendAMessage1
//                                                                → LoopOverItems (↩ loop)
//                                                           .out(1) → AddContentWithoutDate
//                                                              → SetArticleUrl (↩ loop)
//                                                             .out(1) → SendAMessage
//                                                                → LoopOverItems (↩ loop)
//                                                         .out(1) → Merge1.in(1) (↩ loop)
//                                                   .out(1) → FilterArticlesByTopic1
//                                                      → MapDataForNotion1 (↩ loop)
//                                                     .out(1) → SendAMessage6
//                                                        → LoopOverItems (↩ loop)
//                                               .out(1) → CheckSourcesExecuted
//                                                  → MapDataForNotion
//                                                    → IfPublicationDate
//                                                      → AddContentWithDate1
//                                                       .out(1) → SendAMessage3
//                                                     .out(1) → AddContentWithoutDate1
//                                                       .out(1) → SendAMessage4
//                                                 .out(1) → FilterArticlesByTopic
//                                                    → MapDataForNotion (↩ loop)
//                                                   .out(1) → SendAMessage5
//                                             .out(1) → ValidContentOnlyScoreAbove2
//                                                → IfTextLongerThan2000Chars (↩ loop)
//                                → GetDefaultImagePrompts
//                                  → AggregateImagePrompts
//                                    → SetImagePrompts
//                                      → ImageAndPlatformPrompts.in(1) (↩ loop)
//                                → FinalInput.in(1) (↩ loop)
//                             .out(1) → Aggregate
//                                → SemanticKeywordDeduplication
//                                  → DeduplicatedArticles
//                                    → ClassifyViaRelevanceService
//                                      → PerformFinalCalculation
//                                        → ThresholdMet
//                                          → Sort
//                                            → Get100BestArticles
//                                              → Evaluation
//                                                → SetOutputInEvaluationGoogleSheet
//                                                  → Evaluation1
//                                               .out(1) → SelectFields (↩ loop)
//                                         .out(1) → SelectFields1
//                        → RemoveDuplicates (↩ loop)
//                → NoRssUrlAvailable
//                  → CallRssWebsiteSearchNoRssUrl
//                    → Merge.in(1) (↩ loop)
//               .out(1) → CallLinkedinSearchProfileKeywordCompany
//                  → Merge.in(3) (↩ loop)
//               .out(2) → CallTavilyKeywordSearch
//                  → Merge.in(5) (↩ loop)
//               .out(2) → Limit16Items
//                  → CallSearchGoogleSyntech
//                    → Merge.in(4) (↩ loop)
//               .out(3) → CallSearchInstagramPage
//                  → Merge.in(6) (↩ loop)
//               .out(4) → CallSearchWebsiteFromForm
//                  → Merge.in(7) (↩ loop)
//               .out(5) → CallSearchTwitterXPostAndKeyword
//                  → Merge.in(8) (↩ loop)
//         .out(1) → Randomise
//            → Get15Ideas
//              → Merge3.in(1) (↩ loop)
// RunEvaluation
//    → GetAllSources1
//      → MatchInputFormat
// FormSubmission1
//    → Sources
//      → MatchSources (↩ loop)
// UrgentlyWatchedList
//    → ScrapeAUrlAndGetItsContent3
//      → IfNotError3
//        → CreateSummaryAndTitle10
//          → RssSearchFields2
//            → Merge11
//              → Merge (↩ loop)
//       .out(1) → FailedUrls1
//          → ExtractContent3
//            → ExtractDate4
//              → Markdown2
//                → Filter6
//                  → CreateSummaryAndTitle11
//                    → RssSearchFields3
//                      → Merge11.in(1) (↩ loop)
// ManuallyTriggerContentEngine
//    → GetAllSources (↩ loop)
// MapDataForNotion2
//    → MapDataForNotion3
//      → AddContentWithDate2
//        → AddContentWithDate3
// CodeInJavascript
//    → FilterArticlesByTopic2
//
// AI CONNECTIONS
// Evaluation1.uses({ ai_languageModel: OpenaiChatModel8 })
// CreateSummaryAndTitle10.uses({ ai_languageModel: OpenaiChatModel15, ai_outputParser: StructuredOutputParser21 })
// CreateSummaryAndTitle11.uses({ ai_languageModel: OpenaiChatModel16, ai_outputParser: StructuredOutputParser22 })
// StructuredOutputParser2.uses({ ai_languageModel: AnthropicChatModel })
// StructuredOutputParser27.uses({ ai_languageModel: AnthropicChatModel1 })
// StructuredOutputParser.uses({ ai_languageModel: AnthropicChatModel2 })
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'UzEv74M2D2q4z0Zx',
    name: 'News Sourcing Production (V2)',
    active: false,
    tags: ['NEWS+'],
    settings: {
        executionOrder: 'v1',
        callerPolicy: 'workflowsFromSameOwner',
        availableInMCP: false,
        errorWorkflow: 'o41mt2JfV10VTV65',
        timeSavedMode: 'fixed',
        binaryMode: 'separate',
        timeSavedPerExecution: 90,
        timezone: 'Europe/London',
    },
})
export class NewsSourcingProductionV2Workflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: '4b1fadb2-7bc0-4311-a4cb-5ad37c2b14db',
        name: 'Schedule Trigger',
        type: 'n8n-nodes-base.scheduleTrigger',
        version: 1.2,
        position: [-304, 4928],
    })
    ScheduleTrigger = {
        rule: {
            interval: [
                {
                    triggerAtHour: 5,
                },
            ],
        },
    };

    @node({
        id: '8cfd0ece-f824-4aeb-af07-492ca32ea591',
        name: 'Merge',
        type: 'n8n-nodes-base.merge',
        version: 3.2,
        position: [2544, 5392],
    })
    Merge = {
        numberInputs: 9,
    };

    @node({
        id: '06283e28-ded7-4d6a-bb69-104879e2650c',
        name: 'Get All Sources',
        type: 'n8n-nodes-base.notion',
        version: 2.2,
        position: [-80, 5024],
        credentials: { notionApi: { id: 'k0ZwGrqySi9Wayf7', name: 'Stephen Notion account' } },
    })
    GetAllSources = {
        resource: 'databasePage',
        operation: 'getAll',
        databaseId: {
            __rl: true,
            value: '27a785c0-cfab-807b-b5eb-e1214e18960d',
            mode: 'list',
            cachedResultName: 'Syntech Biofuels Static Sources',
            cachedResultUrl: 'https://www.notion.so/27a785c0cfab807bb5ebe1214e18960d',
        },
        returnAll: true,
        options: {},
    };

    @node({
        id: 'c204fb7b-22c3-4572-8100-308c2e7b8392',
        name: 'Match Sources',
        type: 'n8n-nodes-base.switch',
        version: 3.3,
        position: [1552, 5376],
    })
    MatchSources = {
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
                                leftValue:
                                    "={{ $json.source || $if($('Get All Sources').isExecuted, $('Get All Sources').item.json.property_source, null) }}",
                                rightValue: 'RSS',
                                operator: {
                                    type: 'string',
                                    operation: 'equals',
                                },
                                id: '64eaa223-9be7-410e-8ff2-3e07451e36fe',
                            },
                        ],
                        combinator: 'and',
                    },
                    renameOutput: true,
                    outputKey: 'RSS',
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
                                id: '1d69a784-393b-4571-9fc2-9610ebc6e080',
                                leftValue:
                                    "={{ $json.source || $if($('Get All Sources').isExecuted, $('Get All Sources').item.json.property_source, null) }}",
                                rightValue: 'LinkedIn',
                                operator: {
                                    type: 'string',
                                    operation: 'equals',
                                    name: 'filter.operator.equals',
                                },
                            },
                        ],
                        combinator: 'and',
                    },
                    renameOutput: true,
                    outputKey: 'LinkedIn',
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
                                id: 'b422070f-f4e4-4177-9f59-b5b9c621ac49',
                                leftValue:
                                    "={{ $json.source || $if($('Get All Sources').isExecuted, $('Get All Sources').item.json.property_source, null) }}",
                                rightValue: '=Keyword',
                                operator: {
                                    type: 'string',
                                    operation: 'equals',
                                    name: 'filter.operator.equals',
                                },
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
                                id: '39bfb8ee-3bee-417f-86be-f230bb821856',
                                leftValue:
                                    "={{ $json.source || $if($('Get All Sources').isExecuted, $('Get All Sources').item.json.property_source, null) }}",
                                rightValue: 'Instagram',
                                operator: {
                                    type: 'string',
                                    operation: 'equals',
                                    name: 'filter.operator.equals',
                                },
                            },
                        ],
                        combinator: 'and',
                    },
                    renameOutput: true,
                    outputKey: 'Instagram',
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
                                id: '7c3bf149-65f1-475c-9d68-f3e29d76e933',
                                leftValue:
                                    "={{ $json.source || $if($('Get All Sources').isExecuted, $('Get All Sources').item.json.property_source, null) }}",
                                rightValue: 'Website',
                                operator: {
                                    type: 'string',
                                    operation: 'equals',
                                    name: 'filter.operator.equals',
                                },
                            },
                        ],
                        combinator: 'and',
                    },
                    renameOutput: true,
                    outputKey: 'Website',
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
                                id: '00c92dc8-148e-442a-9b62-f6f4a33608e6',
                                leftValue:
                                    "={{ $json.source || $if($('Get All Sources').isExecuted, $('Get All Sources').item.json.property_source, null) }}",
                                rightValue: 'X',
                                operator: {
                                    type: 'string',
                                    operation: 'equals',
                                    name: 'filter.operator.equals',
                                },
                            },
                        ],
                        combinator: 'and',
                    },
                    renameOutput: true,
                    outputKey: 'Twitter/ X',
                },
            ],
        },
        options: {},
    };

    @node({
        id: '1bf5bb7b-a7f7-4ac3-aea4-36af680c0796',
        name: 'Get Active Sources',
        type: 'n8n-nodes-base.filter',
        version: 2.2,
        position: [144, 5024],
    })
    GetActiveSources = {
        conditions: {
            options: {
                caseSensitive: true,
                leftValue: '',
                typeValidation: 'strict',
                version: 2,
            },
            conditions: [
                {
                    id: '45d48713-c0cb-44ab-83fc-168ac9a7c419',
                    leftValue: '={{ $json.property_status }}',
                    rightValue: 'Active',
                    operator: {
                        type: 'string',
                        operation: 'equals',
                        name: 'filter.operator.equals',
                    },
                },
            ],
            combinator: 'and',
        },
        options: {},
    };

    @node({
        id: '6afbd4b0-997a-4f7f-aa83-00ae4de78749',
        name: 'Get All Results',
        type: 'n8n-nodes-base.notion',
        version: 2.2,
        position: [3216, 5568],
        credentials: { notionApi: { id: 'k0ZwGrqySi9Wayf7', name: 'Stephen Notion account' } },
        alwaysOutputData: true,
        executeOnce: true,
    })
    GetAllResults = {
        resource: 'databasePage',
        operation: 'getAll',
        databaseId: {
            __rl: true,
            value: '27c785c0-cfab-8137-800f-dcf3e01a3e97',
            mode: 'list',
            cachedResultName: 'Syntech Biofuel Content Ideas',
            cachedResultUrl: 'https://www.notion.so/27c785c0cfab8137800fdcf3e01a3e97',
        },
        returnAll: true,
        options: {},
    };

    @node({
        id: 'aa6dacbc-1614-4c86-b616-7629e649f906',
        name: 'Remove Duplicates',
        type: 'n8n-nodes-base.merge',
        version: 3.2,
        position: [3440, 5504],
    })
    RemoveDuplicates = {
        mode: 'combine',
        advanced: true,
        mergeByFields: {
            values: [
                {
                    field1: 'url',
                    field2: 'property_source_url',
                },
            ],
        },
        joinMode: 'keepNonMatches',
        outputDataFrom: 'input1',
        options: {},
    };

    @node({
        id: '35d08e7e-2b1b-47ca-873d-426c9697d715',
        name: 'If High Priority',
        type: 'n8n-nodes-base.if',
        version: 2.2,
        position: [368, 5024],
    })
    IfHighPriority = {
        conditions: {
            options: {
                caseSensitive: true,
                leftValue: '',
                typeValidation: 'strict',
                version: 2,
            },
            conditions: [
                {
                    id: 'b5d7e3e1-0a6d-47e3-8762-1d6bcb90d942',
                    leftValue: '={{ $json.property_priority }}',
                    rightValue: 'High',
                    operator: {
                        type: 'string',
                        operation: 'equals',
                        name: 'filter.operator.equals',
                    },
                },
            ],
            combinator: 'and',
        },
        options: {},
    };

    @node({
        id: '287ff45d-eae8-436d-8374-43ed69c5ec1d',
        name: 'Randomise',
        type: 'n8n-nodes-base.sort',
        version: 1,
        position: [592, 5104],
    })
    Randomise = {
        type: 'random',
    };

    @node({
        id: '00f0fcd4-ad96-4a0c-a1d9-e27c124a33a9',
        name: 'Match Input Format',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [4336, 5840],
        executeOnce: true,
    })
    MatchInputFormat = {
        assignments: {
            assignments: [
                {
                    id: 'a4678c4d-3605-43b3-930d-54f3db0cf209',
                    name: 'content',
                    value: "={{ $('Run Evaluation').item.json.Content }}",
                    type: 'string',
                },
                {
                    id: '960e3dc3-5af8-4535-bca0-6db869b1bed0',
                    name: 'url',
                    value: "={{ $('Run Evaluation').item.json.URL }}",
                    type: 'string',
                },
                {
                    id: '084b87c7-e199-4284-89d5-a2a5bb7a69e7',
                    name: 'title',
                    value: "={{ $('Run Evaluation').item.json.Title }}",
                    type: 'string',
                },
                {
                    id: '4957e170-7f99-4439-8b8a-29e930aa8823',
                    name: 'publication_date',
                    value: '={{ $(\'Run Evaluation\').item.json["Publication Date"] }}',
                    type: 'string',
                },
                {
                    id: '7bf20e2e-95b3-4acc-9a9b-7fcf895f1ad2',
                    name: 'expected_relevance',
                    value: '={{ $(\'Run Evaluation\').item.json["Expected_Score"] }}',
                    type: 'string',
                },
            ],
        },
        options: {},
    };

    @node({
        id: '88ebf61d-7526-44ab-a126-02e89da3e552',
        name: 'Evaluation',
        type: 'n8n-nodes-base.evaluation',
        version: 4.7,
        position: [8656, 5072],
    })
    Evaluation = {
        operation: 'checkIfEvaluating',
    };

    @node({
        id: '84ee2532-f9b0-461d-9f40-34aeb5705a38',
        name: 'Run Evaluation',
        type: 'n8n-nodes-base.evaluationTrigger',
        version: 4.6,
        position: [3888, 5840],
        credentials: { googleSheetsOAuth2Api: { id: 'OSB0yUnhxYm2AAN5', name: 'Stephen Google Sheets account' } },
    })
    RunEvaluation = {
        documentId: {
            __rl: true,
            value: '1DGxbB-WIk_Ycv8W0iH7dXUo6ESu67ZqLNFhXB8w3-AI',
            mode: 'list',
            cachedResultName: 'Syntech Evaluation Test',
            cachedResultUrl:
                'https://docs.google.com/spreadsheets/d/1DGxbB-WIk_Ycv8W0iH7dXUo6ESu67ZqLNFhXB8w3-AI/edit?usp=drivesdk',
        },
        sheetName: {
            __rl: true,
            value: 'gid=0',
            mode: 'list',
            cachedResultName: 'Evaluations',
            cachedResultUrl:
                'https://docs.google.com/spreadsheets/d/1DGxbB-WIk_Ycv8W0iH7dXUo6ESu67ZqLNFhXB8w3-AI/edit#gid=0',
        },
    };

    @node({
        id: '3c89d2d2-af1c-4ed3-84f3-87402bdeea4a',
        name: 'Set Output In Evaluation Google Sheet',
        type: 'n8n-nodes-base.evaluation',
        version: 4.7,
        position: [8880, 4976],
        credentials: { googleSheetsOAuth2Api: { id: 'OSB0yUnhxYm2AAN5', name: 'Stephen Google Sheets account' } },
    })
    SetOutputInEvaluationGoogleSheet = {
        documentId: {
            __rl: true,
            value: '1DGxbB-WIk_Ycv8W0iH7dXUo6ESu67ZqLNFhXB8w3-AI',
            mode: 'list',
            cachedResultName: 'Syntech Evaluation Test',
            cachedResultUrl:
                'https://docs.google.com/spreadsheets/d/1DGxbB-WIk_Ycv8W0iH7dXUo6ESu67ZqLNFhXB8w3-AI/edit?usp=drivesdk',
        },
        sheetName: {
            __rl: true,
            value: 'gid=0',
            mode: 'list',
            cachedResultName: 'Evaluations',
            cachedResultUrl:
                'https://docs.google.com/spreadsheets/d/1DGxbB-WIk_Ycv8W0iH7dXUo6ESu67ZqLNFhXB8w3-AI/edit#gid=0',
        },
        outputs: {
            values: [
                {
                    outputName: 'Actual_Score',
                    outputValue: '={{ $json.output.relevance_score }}',
                },
                {
                    outputName: 'AI_Reasoning',
                    outputValue: "={{ $('Classification Agent (Claude Optimisation) - OLD').item.json.output.reason }}",
                },
            ],
        },
    };

    @node({
        id: 'f3bf8c61-83a9-48b2-a7d7-eff545890647',
        name: 'If Publication Date',
        type: 'n8n-nodes-base.if',
        version: 2.2,
        position: [11968, 6048],
    })
    IfPublicationDate = {
        conditions: {
            options: {
                caseSensitive: true,
                leftValue: '',
                typeValidation: 'strict',
                version: 2,
            },
            conditions: [
                {
                    id: 'e20ca9df-9034-44ac-8d9e-ecad56c6a923',
                    leftValue: "={{ $('Map Data for Notion').item.json.publication_date }}",
                    rightValue: 'NA',
                    operator: {
                        type: 'string',
                        operation: 'notEquals',
                    },
                },
            ],
            combinator: 'or',
        },
        options: {},
    };

    @node({
        id: 'fa852bf5-e0ee-443e-97fc-ffcfff342229',
        name: 'IF text longer than 2000 chars',
        type: 'n8n-nodes-base.if',
        version: 1,
        position: [11072, 6064],
    })
    IfTextLongerThan2000Chars = {
        conditions: {
            number: [
                {
                    value1: "={{ $('Final Input').item.json.content?.length() }}",
                    operation: 'larger',
                    value2: 2000,
                },
            ],
        },
    };

    @node({
        id: 'c098c3ec-ea7c-41df-af3f-db59ce80b321',
        name: 'Splits text in small chuncks',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [12192, 5152],
    })
    SplitsTextInSmallChuncks = {
        jsCode: `let result = [];
let firstBlock = true;

// Split text on \\n characters - FIXED: Use .item instead of .first() to get current item
let textBlocks = $input.first().json.content_remove_duplicate_node.split(/\\n/) || $input.first().json.content_if_sources_executed;

for (let block of textBlocks) {
    if (block.length === 0) continue;
    result.push({
        "textSubString": block.trim(),
        "firstBlock": firstBlock
    });
    firstBlock = false;
}

return result;`,
    };

    @node({
        id: '567ab93a-6fd1-4b85-aca3-151e1a82f350',
        name: 'IF2',
        type: 'n8n-nodes-base.if',
        version: 1,
        position: [12416, 5152],
    })
    If2 = {
        conditions: {
            boolean: [
                {
                    value1: '={{ $json.firstBlock }}',
                    value2: true,
                },
            ],
        },
    };

    @node({
        id: '48970471-a15e-4335-ab99-5120b28c4ea4',
        name: 'Merge1',
        type: 'n8n-nodes-base.merge',
        version: 2.1,
        position: [13312, 5248],
    })
    Merge1 = {
        mode: 'combine',
        combinationMode: 'multiplex',
        options: {},
    };

    @node({
        id: '993da253-7e28-4d4c-97ed-52a14b8e0ce7',
        name: 'Loop Over Items',
        type: 'n8n-nodes-base.splitInBatches',
        version: 3,
        position: [11296, 5728],
    })
    LoopOverItems = {
        options: {},
    };

    @node({
        id: 'e459002d-42c9-4f0f-a33a-a7a51b9c5926',
        name: 'If Publication Date2',
        type: 'n8n-nodes-base.if',
        version: 2.2,
        position: [12640, 5088],
    })
    IfPublicationDate2 = {
        conditions: {
            options: {
                caseSensitive: true,
                leftValue: '',
                typeValidation: 'strict',
                version: 2,
            },
            conditions: [
                {
                    id: 'e20ca9df-9034-44ac-8d9e-ecad56c6a923',
                    leftValue: "={{ $('Map Data for Notion1').item.json.publication_date }}",
                    rightValue: 'NA',
                    operator: {
                        type: 'string',
                        operation: 'notEquals',
                    },
                },
            ],
            combinator: 'and',
        },
        options: {},
    };

    @node({
        id: '99b13bbc-348c-4cc8-b67f-34684eadc234',
        name: 'Set Article URL',
        type: 'n8n-nodes-base.set',
        version: 3.2,
        position: [13088, 5088],
    })
    SetArticleUrl = {
        fields: {
            values: [
                {
                    name: 'url',
                    stringValue: '={{ $json.url }}',
                },
            ],
        },
        include: 'none',
        options: {},
    };

    @node({
        id: '47f698a2-322f-4f97-afa3-3bbb24b99c03',
        name: 'Add Content To Post',
        type: 'n8n-nodes-base.notion',
        version: 2.2,
        position: [13536, 5248],
        credentials: { notionApi: { id: 'k0ZwGrqySi9Wayf7', name: 'Stephen Notion account' } },
        onError: 'continueErrorOutput',
        retryOnFail: true,
        waitBetweenTries: 5000,
    })
    AddContentToPost = {
        resource: 'block',
        blockId: {
            __rl: true,
            value: '={{ $json.url }}',
            mode: 'url',
        },
        blockUi: {
            blockValues: [
                {
                    textContent: '={{ $json.textSubString }}',
                },
            ],
        },
    };

    @node({
        id: 'f371b50c-581b-4b8b-9bf2-eee676a6f182',
        name: 'sources',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [1264, 5536],
    })
    Sources = {
        assignments: {
            assignments: [
                {
                    id: '4289e8b4-8a0a-4929-b43b-eb3610653c15',
                    name: 'prompt',
                    value: "={{ $json.body.data.properties['Own Analysis'].rich_text[0].text.content }}",
                    type: 'string',
                },
                {
                    id: '3ff2b13d-6bcf-43fa-8646-05ce4499bf91',
                    name: 'url_or_keyword',
                    value: "={{ $json.body.data.properties['Source URL or Keyword'].title[0].text.content }}",
                    type: 'string',
                },
                {
                    id: '3ebeed9d-5988-4b35-bb1d-b5eb6bcf0328',
                    name: 'source',
                    value: "={{ $json.body.data.properties['Source Platform'].multi_select[0].name }}",
                    type: 'string',
                },
                {
                    id: '29c37d50-0339-49f9-9c3a-3bcba964ecd9',
                    name: 'additional_formats',
                    value: '={{ $json.body.data.properties["Additional Formats"].relation }}',
                    type: 'array',
                },
                {
                    id: 'bc4aa16e-fbc6-4c7f-b43a-68fce7e46cf3',
                    name: 'process_mode',
                    value: '={{ $json.body.data.properties.Mode.multi_select[0].name }}',
                    type: 'string',
                },
                {
                    id: '1b931470-5b57-42e4-8584-75c19d6d9e7c',
                    name: 'bypass_filter',
                    value: true,
                    type: 'boolean',
                },
            ],
        },
        options: {},
    };

    @node({
        id: '0930a06b-5c19-4469-a8c1-5d63c5c2c836',
        name: 'No Operation, do nothing',
        type: 'n8n-nodes-base.noOp',
        version: 1,
        position: [11520, 5072],
    })
    NoOperationDoNothing = {};

    @node({
        id: '421e2ef3-e607-4251-b8f5-edd05ec198e5',
        name: 'Merge3',
        type: 'n8n-nodes-base.merge',
        version: 3.2,
        position: [1040, 5024],
    })
    Merge3 = {};

    @node({
        id: '75d3a83d-0fc4-4dc0-862a-9cae146b789e',
        webhookId: 'd7c4ad3a-52b4-46fd-b480-76a083a42ff2',
        name: 'Form Submission1',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [1040, 5536],
    })
    FormSubmission1 = {
        httpMethod: 'POST',
        path: 'news-sourcing-production',
        options: {},
    };

    @node({
        id: '89508ea6-d10a-46af-8dba-652e2ec23576',
        name: 'If From Form',
        type: 'n8n-nodes-base.if',
        version: 2.2,
        position: [3664, 5504],
    })
    IfFromForm = {
        conditions: {
            options: {
                caseSensitive: true,
                leftValue: '',
                typeValidation: 'strict',
                version: 2,
            },
            conditions: [
                {
                    id: 'cc515966-f679-4152-a85b-f524bb588f34',
                    leftValue: "={{ $('sources').isExecuted }}",
                    rightValue: '',
                    operator: {
                        type: 'boolean',
                        operation: 'true',
                        singleValue: true,
                    },
                },
            ],
            combinator: 'and',
        },
        options: {},
    };

    @node({
        id: 'c1d4815d-900a-4c44-9993-81287c45492e',
        name: 'select fields',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [8880, 5648],
    })
    SelectFields = {
        assignments: {
            assignments: [
                {
                    id: '9a8264bf-82d2-434f-b146-3b8deb76e519',
                    name: 'title',
                    value: "={{ $('Deduplicated Articles').item.json.title || $('Remove Duplicates').item.json.title }}",
                    type: 'string',
                },
                {
                    id: 'dfdf1695-e69f-4cff-a8f0-21d9da07745b',
                    name: 'content',
                    value: `={{ ($('Deduplicated Articles').item.json.content || $('Remove Duplicates').item.json.content || '').substring(0, 49000) }}

{{ $('Deduplicated Articles').item.json.duplicates.length > 0 ? 
$('Deduplicated Articles').item.json.duplicates.map((article, index) => \`## Duplicate Articles:

Title \${index + 1}: \${article.title}
Summary \${index + 1}: \${article.summary}
Url \${index + 1}: \${article.url}\`).join('\\n') : 'No Duplicate Articles'}}`,
                    type: 'string',
                },
                {
                    id: '4899f665-2f29-41df-afea-d8a744a6fec9',
                    name: 'url',
                    value: "={{ $('Deduplicated Articles').item.json.url || $('Remove Duplicates').item.json.url }}",
                    type: 'string',
                },
                {
                    id: 'ec8500c3-9d57-45d3-b1a9-2de1706dee8d',
                    name: 'summary',
                    value: "={{ $('Deduplicated Articles').item.json.summary || $('Remove Duplicates').item.json.summary }}",
                    type: 'string',
                },
                {
                    id: '0c470796-e8e2-4605-a6af-9e8236d9635c',
                    name: 'search_query',
                    value: "={{ $('Deduplicated Articles').item.json.search_query || $('Remove Duplicates').item.json.search_query }}",
                    type: 'string',
                },
                {
                    id: '4d34103a-b327-42cc-8e50-dec38a8fc1f5',
                    name: 'publication_date',
                    value: "={{ $('Deduplicated Articles').item.json.publication_date || $('Remove Duplicates').item.json.publication_date }}",
                    type: 'string',
                },
                {
                    id: '02065b1c-286c-4cf9-8709-27d8a766d2d1',
                    name: 'prompt',
                    value: "={{ $('Deduplicated Articles').item.json.prompt }}",
                    type: 'string',
                },
                {
                    id: 'ef20184c-2ce1-4660-9658-fe12f9776f2d',
                    name: 'additional_formats',
                    value: "={{ $('Deduplicated Articles').item.json.additional_formats }}",
                    type: 'string',
                },
                {
                    id: '5a5e80cb-0ad3-4e06-86f8-63e9e59765fd',
                    name: 'source',
                    value: "={{ $('Deduplicated Articles').item.json.source || $('Remove Duplicates').item.json.source }}",
                    type: 'string',
                },
                {
                    id: 'f3e017bd-5f4f-4265-ba02-9280077f42a6',
                    name: 'source_name',
                    value: "={{ $('Deduplicated Articles').item.json.source_name || $('Remove Duplicates').item.json.source_name }}",
                    type: 'string',
                },
                {
                    id: '61574df1-c16c-42df-9b9b-ebe428bd7eae',
                    name: 'mode',
                    value: "={{ $('Deduplicated Articles').item.json.mode }}",
                    type: 'string',
                },
                {
                    id: 'b9505f97-3c09-4d20-aaa3-cbccd96a8ced',
                    name: 'relevance_score',
                    value: "={{ $('Evaluation').isExecuted ? $('Evaluation').item.json.output.final_score : '' }}",
                    type: 'string',
                },
                {
                    id: 'c9b91b3f-d479-49e2-a597-3e0c233379ed',
                    name: 'reason',
                    value: "={{ $('Evaluation').isExecuted ? $('Evaluation').item.json.output.reason : '' }}",
                    type: 'string',
                },
                {
                    id: 'd8061e59-9f62-4596-9a93-0346f90b0ea7',
                    name: 'analysis',
                    value: '={{ $json }}',
                    type: 'object',
                },
            ],
        },
        options: {},
    };

    @node({
        id: 'bfa8ff5a-337a-4d0d-9563-1966c536e097',
        name: 'Remove Duplicates1',
        type: 'n8n-nodes-base.merge',
        version: 3.2,
        position: [9680, 5120],
    })
    RemoveDuplicates1 = {
        mode: 'combine',
        advanced: true,
        mergeByFields: {
            values: [
                {
                    field1: 'url',
                    field2: 'URL',
                },
            ],
        },
        joinMode: 'keepNonMatches',
        outputDataFrom: 'input1',
        options: {},
    };

    @node({
        id: '596db740-da22-47ff-8b5a-72195b734517',
        name: 'Set Google Sheet Fields',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [9456, 4960],
    })
    SetGoogleSheetFields = {
        assignments: {
            assignments: [
                {
                    id: '4061f412-99c2-4549-9d2e-be355aa6a5bb',
                    name: 'url',
                    value: "={{ $('select fields').item.json.url }}",
                    type: 'string',
                },
                {
                    id: '60a2488f-d96c-4c21-94f1-6f627e9c99ae',
                    name: 'title',
                    value: "={{ $('select fields').item.json.title }}",
                    type: 'string',
                },
                {
                    id: '30183727-5e80-401c-a728-37da12a2054b',
                    name: 'content',
                    value: "={{ $('select fields').item.json.content }}",
                    type: 'string',
                },
                {
                    id: 'ac7fb376-710f-43b5-9ff8-c3de8dc4f0ff',
                    name: 'publication_date',
                    value: "={{ $('select fields').item.json.publication_date }}",
                    type: 'string',
                },
            ],
        },
        options: {},
    };

    @node({
        id: '09172abb-e810-4dcd-963e-83ab12502e3b',
        name: 'Get All Ideas From Evaluation Table2',
        type: 'n8n-nodes-base.googleSheets',
        version: 4.7,
        position: [9456, 5152],
        credentials: { googleSheetsOAuth2Api: { id: 'OSB0yUnhxYm2AAN5', name: 'Stephen Google Sheets account' } },
        executeOnce: true,
    })
    GetAllIdeasFromEvaluationTable2 = {
        documentId: {
            __rl: true,
            value: '1DGxbB-WIk_Ycv8W0iH7dXUo6ESu67ZqLNFhXB8w3-AI',
            mode: 'list',
            cachedResultName: 'Syntech Evaluation Test',
            cachedResultUrl:
                'https://docs.google.com/spreadsheets/d/1DGxbB-WIk_Ycv8W0iH7dXUo6ESu67ZqLNFhXB8w3-AI/edit?usp=drivesdk',
        },
        sheetName: {
            __rl: true,
            value: 'gid=0',
            mode: 'list',
            cachedResultName: 'Evaluations',
            cachedResultUrl:
                'https://docs.google.com/spreadsheets/d/1DGxbB-WIk_Ycv8W0iH7dXUo6ESu67ZqLNFhXB8w3-AI/edit#gid=0',
        },
        options: {
            dataLocationOnSheet: {
                values: {
                    rangeDefinition: 'detectAutomatically',
                },
            },
        },
    };

    @node({
        id: '2777f302-46a7-4462-af0d-ac14235e4dcd',
        name: 'is content empty?',
        type: 'n8n-nodes-base.filter',
        version: 2.2,
        position: [2768, 5504],
    })
    IsContentEmpty = {
        conditions: {
            options: {
                caseSensitive: true,
                leftValue: '',
                typeValidation: 'strict',
                version: 2,
            },
            conditions: [
                {
                    id: 'd1a433e2-115c-4f9c-a258-7731b132de1c',
                    leftValue: '={{ $json.content }}',
                    rightValue: '',
                    operator: {
                        type: 'string',
                        operation: 'notEmpty',
                        singleValue: true,
                    },
                },
                {
                    id: 'ad722536-85c8-4fba-8145-67715452ce2f',
                    leftValue: '={{ $json.title }}',
                    rightValue: '',
                    operator: {
                        type: 'string',
                        operation: 'notEmpty',
                        singleValue: true,
                    },
                },
                {
                    id: 'fe7a45d4-d4f0-4ace-a3b9-ded0a3b66bc6',
                    leftValue: '={{ $json.summary }}',
                    rightValue: '',
                    operator: {
                        type: 'string',
                        operation: 'notEmpty',
                        singleValue: true,
                    },
                },
                {
                    id: '42359478-9817-4951-b123-cb290b9d766d',
                    leftValue: '={{ $json.search_query }}',
                    rightValue: '',
                    operator: {
                        type: 'string',
                        operation: 'notEmpty',
                        singleValue: true,
                    },
                },
                {
                    id: 'dcacffd7-ba99-4bc9-bac1-deda617262aa',
                    leftValue: '={{ $json.url }}',
                    rightValue: 'https://syntechbiofuel.com/',
                    operator: {
                        type: 'string',
                        operation: 'notStartsWith',
                    },
                },
                {
                    id: '3251c219-5c31-41e5-9bbd-ede17913a7cf',
                    leftValue: '={{ $json.content }}',
                    rightValue: 'Aa',
                    operator: {
                        type: 'string',
                        operation: 'notStartsWith',
                    },
                },
                {
                    id: '36e2c2b2-ec6a-42f9-ad14-32264f257027',
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
        id: '506bc082-0484-4e00-b910-4671ef7883b1',
        name: 'If From Form1',
        type: 'n8n-nodes-base.if',
        version: 2.2,
        position: [10624, 6064],
    })
    IfFromForm1 = {
        conditions: {
            options: {
                caseSensitive: true,
                leftValue: '',
                typeValidation: 'strict',
                version: 2,
            },
            conditions: [
                {
                    id: 'cc515966-f679-4152-a85b-f524bb588f34',
                    leftValue: "={{ $('sources').isExecuted }}",
                    rightValue: '',
                    operator: {
                        type: 'boolean',
                        operation: 'true',
                        singleValue: true,
                    },
                },
            ],
            combinator: 'and',
        },
        options: {},
    };

    @node({
        id: '78d5c0df-fe3b-441b-aac7-0a02714d8da3',
        name: 'Remove Duplicates3',
        type: 'n8n-nodes-base.removeDuplicates',
        version: 2,
        position: [2992, 5504],
    })
    RemoveDuplicates3 = {
        compare: 'selectedFields',
        fieldsToCompare: 'url',
        options: {},
    };

    @node({
        id: '4d4122ed-446c-4f9e-a115-9bebf3bd0455',
        name: 'Sort',
        type: 'n8n-nodes-base.sort',
        version: 1,
        position: [8208, 5072],
    })
    Sort = {
        sortFieldsUi: {
            sortField: [
                {
                    fieldName: 'total_score',
                    order: 'descending',
                },
            ],
        },
        options: {},
    };

    @node({
        id: '8c2d4150-c55b-45f0-899d-b5b82a71112c',
        name: 'Valid content only (score above 2)',
        type: 'n8n-nodes-base.filter',
        version: 2.2,
        position: [10848, 6176],
    })
    ValidContentOnlyScoreAbove2 = {
        conditions: {
            options: {
                caseSensitive: true,
                leftValue: '',
                typeValidation: 'loose',
                version: 2,
            },
            conditions: [
                {
                    id: '8987c495-abc2-4e29-86db-4466755af908',
                    leftValue: '={{ $json.analysis.threshold_met }}',
                    rightValue: 3,
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
        id: '7be521da-1288-4e1f-a1db-ca078be64f4e',
        name: 'Limit1',
        type: 'n8n-nodes-base.limit',
        version: 1,
        position: [1264, 5024],
    })
    Limit1 = {
        maxItems: 1000,
    };

    @node({
        id: '56cf1c67-65e8-4b9e-952d-2e7ced1ac891',
        name: 'Get All Sources1',
        type: 'n8n-nodes-base.notion',
        version: 2.2,
        position: [4112, 5840],
        credentials: { notionApi: { id: 'k0ZwGrqySi9Wayf7', name: 'Stephen Notion account' } },
    })
    GetAllSources1 = {
        resource: 'databasePage',
        operation: 'getAll',
        databaseId: {
            __rl: true,
            value: '27a785c0-cfab-807b-b5eb-e1214e18960d',
            mode: 'list',
            cachedResultName: 'Syntech Biofuels Static Sources',
            cachedResultUrl: 'https://www.notion.so/27a785c0cfab807bb5ebe1214e18960d',
        },
        returnAll: true,
        options: {},
    };

    @node({
        id: '060424c8-e8de-442b-bb74-3c6c6d6976b5',
        name: 'filter',
        type: 'n8n-nodes-base.filter',
        version: 2.2,
        position: [9168, 5120],
    })
    Filter = {
        conditions: {
            options: {
                caseSensitive: true,
                leftValue: '',
                typeValidation: 'loose',
                version: 2,
            },
            conditions: [
                {
                    id: '8181b8db-969e-49ec-9489-805d0054391e',
                    leftValue: "={{ $if($('sources').isExecuted, $('sources').first().json.bypass_filter, false) }}",
                    rightValue: '',
                    operator: {
                        type: 'boolean',
                        operation: 'false',
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
        id: '9afd2164-c4c1-4ae6-80bc-96a7b78d5669',
        name: 'Add Content Idea to Evaluation Table1',
        type: 'n8n-nodes-base.googleSheets',
        version: 4.7,
        position: [9904, 5120],
        credentials: { googleSheetsOAuth2Api: { id: 'OSB0yUnhxYm2AAN5', name: 'Stephen Google Sheets account' } },
    })
    AddContentIdeaToEvaluationTable1 = {
        operation: 'append',
        documentId: {
            __rl: true,
            value: '1DGxbB-WIk_Ycv8W0iH7dXUo6ESu67ZqLNFhXB8w3-AI',
            mode: 'list',
            cachedResultName: 'Syntech Evaluation Test',
            cachedResultUrl:
                'https://docs.google.com/spreadsheets/d/1DGxbB-WIk_Ycv8W0iH7dXUo6ESu67ZqLNFhXB8w3-AI/edit?usp=drivesdk',
        },
        sheetName: {
            __rl: true,
            value: 'gid=0',
            mode: 'list',
            cachedResultName: 'Evaluations',
            cachedResultUrl:
                'https://docs.google.com/spreadsheets/d/1DGxbB-WIk_Ycv8W0iH7dXUo6ESu67ZqLNFhXB8w3-AI/edit#gid=0',
        },
        columns: {
            mappingMode: 'defineBelow',
            value: {
                'Publication Date': '={{ $json.publication_date }}',
                URL: '={{ $json.url }}',
                Title: '={{ $json.title }}',
                Content: '={{ $json.content }}',
                'Actual Score':
                    "={{ $('Classification agent with Batch (Tariq)').item.json.message.content.relevance_score }}",
                'AI Reasoning':
                    "={{ $('Classification agent with Batch (Tariq)').item.json.message.content.reasoning }}",
            },
            matchingColumns: ['URL'],
            schema: [
                {
                    id: 'Title',
                    displayName: 'Title',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: 'string',
                    canBeUsedToMatch: true,
                },
                {
                    id: 'URL',
                    displayName: 'URL',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: 'string',
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'Content',
                    displayName: 'Content',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: 'string',
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'Publication Date',
                    displayName: 'Publication Date',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: 'string',
                    canBeUsedToMatch: true,
                },
                {
                    id: 'Actual Score',
                    displayName: 'Actual Score',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: 'string',
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'Expected Score',
                    displayName: 'Expected Score',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: 'string',
                    canBeUsedToMatch: true,
                    removed: true,
                },
                {
                    id: 'Human Reasoning',
                    displayName: 'Human Reasoning',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: 'string',
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'AI Reasoning',
                    displayName: 'AI Reasoning',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    type: 'string',
                    canBeUsedToMatch: true,
                    removed: false,
                },
            ],
            attemptToConvertTypes: false,
            convertFieldsToString: false,
        },
        options: {
            useAppend: true,
        },
    };

    @node({
        id: '61b9dd4c-2825-4b1e-9efc-2511d6463e99',
        name: 'OpenAI Chat Model8',
        type: '@n8n/n8n-nodes-langchain.lmChatOpenAi',
        version: 1.2,
        position: [9184, 4944],
        credentials: { openAiApi: { id: 'NoEKitspBJb0zQrp', name: 'Syntech GM OpenAi account' } },
    })
    OpenaiChatModel8 = {
        model: {
            __rl: true,
            mode: 'list',
            value: 'gpt-4.1-mini',
        },
        options: {},
    };

    @node({
        id: '96d992cc-01b9-459f-bfc1-8430a6bb47f6',
        name: 'Evaluation1',
        type: 'n8n-nodes-base.evaluation',
        version: 4.8,
        position: [9104, 4720],
    })
    Evaluation1 = {
        operation: 'setMetrics',
        expectedAnswer: "={{ $('Run Evaluation').item.json.Expected_Score }}",
        actualAnswer: "={{ $('Perform Final Calculation').item.json.total_score }}",
        prompt: `=You are an expert evaluator assessing how closely an actual score matches the expected score.

Compare the expected and actual scores numerically, then assign a final similarity rating from 0 to 5 according to the following scale:

# Scoring Criteria
- 5: Perfect match – actual and expected scores are identical.
- 4: Very close – difference of 1 point.
- 3: Somewhat close – difference of 2 points.
- 2: Noticeably different – difference of 3 points.
- 1: Highly different – difference of 4 points.
- 0: Completely misaligned or invalid comparison – difference greater than 4 or one score missing.

# Output Format
Only output the final score in strict JSON format as follows:
{
  "score": <integer from 0 to 5>
}

Do not include any reasoning, explanation, or additional text.
`,
        options: {},
    };

    @node({
        id: '8e17161f-f301-4adf-9269-da28c62045d2',
        name: 'Urgently Watched List',
        type: 'n8n-nodes-base.executeWorkflowTrigger',
        version: 1.1,
        position: [-304, 4384],
    })
    UrgentlyWatchedList = {
        inputSource: 'passthrough',
    };

    @node({
        id: 'fbd58fff-1149-427d-8fa6-1e9003bd130e',
        webhookId: 'eda87c01-fe8a-42f6-a116-fa1b7eb6d165',
        name: 'Manually Trigger Content Engine',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [-304, 5120],
    })
    ManuallyTriggerContentEngine = {
        httpMethod: 'POST',
        path: 'trigger-content-engine',
        options: {},
    };

    @node({
        id: '75eb1a9b-10dd-4396-b956-4ec1828aab16',
        name: 'Scrape a url and get its content3',
        type: '@mendable/n8n-nodes-firecrawl.firecrawl',
        version: 1,
        position: [-80, 4384],
        credentials: { firecrawlApi: { id: 'i4QliNET9guWjKJf', name: 'Syntech GM Firecrawl account' } },
        onError: 'continueRegularOutput',
    })
    ScrapeAUrlAndGetItsContent3 = {
        operation: 'scrape',
        requestOptions: {},
    };

    @node({
        id: '6abff399-9660-4438-a46c-3fcf8cbd5083',
        name: 'If Not Error3',
        type: 'n8n-nodes-base.if',
        version: 2.2,
        position: [144, 4384],
    })
    IfNotError3 = {
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
        id: 'fe89925c-6e17-46a4-b534-4c7c20ec5477',
        name: 'failed urls1',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [368, 4656],
        executeOnce: false,
    })
    FailedUrls1 = {
        assignments: {
            assignments: [
                {
                    id: '0f1fd4a3-670d-4861-af5b-bc94fa454574',
                    name: 'failed_url',
                    value: "={{ $if($('RSS Read').isExecuted, $('RSS Read').item.json.link, decodeURIComponent($('Urgently Watched List').item.json.link.match(/url=([^&]+)/)?.[1])) }}",
                    type: 'string',
                },
            ],
        },
        options: {},
    };

    @node({
        id: 'efc4137e-d747-4d00-941c-aa859c0fbe02',
        name: 'extract content3',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.2,
        position: [592, 4656],
        onError: 'continueErrorOutput',
    })
    ExtractContent3 = {
        url: "={{ decodeURIComponent($json.failed_url.match(/url=([^&]+)/)?.[1] || '') || $json.failed_url }}",
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
        id: '39ba9fcf-cc68-4f99-abcf-52a4896b87cb',
        name: 'Markdown2',
        type: 'n8n-nodes-base.markdown',
        version: 1,
        position: [1040, 4656],
    })
    Markdown2 = {
        html: "={{ $('extract content3').item.json.data || '' }}",
        destinationKey: 'linebreak',
        options: {},
    };

    @node({
        id: 'ccaa02ca-3011-4bf8-b02d-a99fd7378904',
        name: 'extract date4',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [816, 4656],
    })
    ExtractDate4 = {
        mode: 'runOnceForEachItem',
        jsCode: `const htmlContent = $node["extract content3"].json["data"];

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
    // Matches formats like: 2024-01-15, 2024-01-15T10:30:00, etc.
    const isoDateMatch = html.match(/\\b(20\\d{2}[-\\/](0[1-9]|1[0-2])[-\\/](0[1-9]|[12]\\d|3[01])(?:T[\\d:]+(?:\\.\\d+)?(?:Z|[+-]\\d{2}:\\d{2})?)?)\\b/);
    if (isoDateMatch?.[1]) return isoDateMatch[1];
    
    return null;
};

// Extract the published date
const publishedDate = extractPublishedDate(htmlContent);

// Return the result
return {
    publishedDate: publishedDate
};`,
    };

    @node({
        id: 'c2bc475f-6277-4edb-b93e-b5d05c80c689',
        name: 'Create summary and title10',
        type: '@n8n/n8n-nodes-langchain.chainLlm',
        version: 1.7,
        position: [1488, 4144],
    })
    CreateSummaryAndTitle10 = {
        promptType: 'define',
        text: `=<content>
{{ $('Scrape a url and get its content3').item.json.data.markdown }}
</content>`,
        hasOutputParser: true,
        messages: {
            messageValues: [
                {
                    message: `=<prompt>
    <task>
        Your primary tasks are to analyze provided content and then generate a JSON object containing two key-value pairs:
        1.  **title:** A compelling, benefit-driven title.
        2.  **summary:** A concise and powerful summary of the key information.
    </task>
    
    <steps>
        1.  Thoroughly review all the key information provided.
        2.  Identify the most critical benefits for the target audience (businesses with vehicle fleets, construction machinery, etc.).
        3.  Distill this information into a clear, engaging summary, adhering strictly to the word count limit.
        4.  Craft a short, impactful title that grabs attention and highlights the primary value proposition.
        5.  Format the final output as a single JSON object.
    </steps>

    <restrictions>
        - **Summary Word Count:** DO NOT exceed 50 words for the summary.
        - **Tone:** AVOID jargon where possible. Focus on clear business benefits.
        - **Clarity:** Ensure the 'drop-in' nature (no engine modification) is communicated as a key advantage of simplicity.
        - **JSON Formatting:** The final output must be a single, valid JSON object enclosed in a markdown code block. Do not include any text before or after the JSON object.
-if "article page" has only page or header or footer information dont mention it in your output
    </restrictions>

    <output_rules>
        - **Format:** A raw JSON object.
        - **Keys:** The JSON object must contain exactly two keys: \`title\` and \`summary\`.
        - **Values:** The values for both keys must be strings.
        - **Tone:** The content of the strings must be professional, confident, and inspiring.
    </output_rules>

    <examples>
        ### Example 1
        **Input Content:** A press release detailing the launch of Syntech ASB and its ISCC certification.
        **Output:**
        \`\`\`json
        {
          "title": "Immediately Cut Carbon Emissions by 90% with UK-Made Biofuel",
          "summary": "Syntech ASB is a UK-made, ISCC-certified biofuel from 100% used cooking oil. As a simple drop-in fuel for any diesel engine, it helps businesses instantly reduce carbon emissions by up to 90% and meet Net Zero targets without new investment."
        }
        \`\`\`
    </examples>

</prompt>
`,
                },
            ],
        },
        batching: {},
    };

    @node({
        id: '3b0115f2-f365-448f-b9d4-c5ce6565be65',
        name: 'OpenAI Chat Model15',
        type: '@n8n/n8n-nodes-langchain.lmChatOpenAi',
        version: 1.2,
        position: [1504, 4368],
        credentials: { openAiApi: { id: 'NoEKitspBJb0zQrp', name: 'Syntech GM OpenAi account' } },
    })
    OpenaiChatModel15 = {
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
        id: 'e8a0aa71-eae0-4073-b969-ea81b00d7454',
        name: 'Structured Output Parser21',
        type: '@n8n/n8n-nodes-langchain.outputParserStructured',
        version: 1.3,
        position: [1632, 4368],
    })
    StructuredOutputParser21 = {
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
        id: '98985b83-5a92-44b9-afe5-21ca5cae7183',
        name: 'Filter6',
        type: 'n8n-nodes-base.filter',
        version: 2.2,
        position: [1264, 4656],
    })
    Filter6 = {
        conditions: {
            options: {
                caseSensitive: true,
                leftValue: '',
                typeValidation: 'strict',
                version: 2,
            },
            conditions: [
                {
                    id: '8cf8cda7-52a7-46bf-9ac4-75e3d84f69ea',
                    leftValue: '={{ $json.linebreak }}',
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
        options: {},
    };

    @node({
        id: 'acb9f820-eb99-4d18-b85a-438cc7d69f5d',
        name: 'Merge11',
        type: 'n8n-nodes-base.merge',
        version: 3.2,
        position: [2064, 4384],
    })
    Merge11 = {};

    @node({
        id: '187ca25c-c472-4e98-b7a8-aaae156fcf9c',
        name: 'RSS search fields2',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [1840, 4256],
    })
    RssSearchFields2 = {
        assignments: {
            assignments: [
                {
                    id: '53313200-69a8-4749-b320-7ad926795be1',
                    name: 'title',
                    value: '={{ $json.output.title }}',
                    type: 'string',
                },
                {
                    id: 'ab5c9158-a33a-4f8f-b6d0-a6787df0f0d5',
                    name: 'content',
                    value: `=RSS Article Description: 
{{ $if($('RSS Read').isExecuted, $('RSS Read').item.json['content:encodedSnippet'], $('Urgently Watched List').item.json['content:encodedSnippet']) || '' }}

{{ $if($('RSS Read').isExecuted, $('RSS Read').item.json.contentSnippet, $('Urgently Watched List').item.json.contentSnippet) }}
------------------
Article page:
{{ 
  $('Scrape a url and get its content3').item.json.data.markdown.removeMarkdown()
}}

`,
                    type: 'string',
                },
                {
                    id: 'f0c15fc7-071d-406d-8200-abecbf458836',
                    name: 'url',
                    value: "={{ $if($('RSS Read').isExecuted, $('RSS Read').item.json.link || decodeURIComponent($('RSS Read').item.json.link.match(/url=([^&]+)/)?.[1]), decodeURIComponent($('Urgently Watched List').item.json.link.match(/url=([^&]+)/)?.[1])) }}",
                    type: 'string',
                },
                {
                    id: 'b72746e5-4271-48e7-af68-4e1bdfd40452',
                    name: 'summary',
                    value: '={{ $json.output.summary }}',
                    type: 'string',
                },
                {
                    id: '39872c24-4acc-4513-b7fb-7689cd511afb',
                    name: 'search_query',
                    value: "={{ $if($('Limit5').isExecuted, $('Limit5').item.json.property_rss_feed, undefined) || $if($('sources').isExecuted, $('sources').item.json.url_or_keyword, undefined) || 'Urgent Watchlist' }}",
                    type: 'string',
                },
                {
                    id: '42852696-c7af-4ce4-a273-e61970ef2e8f',
                    name: 'publication_date',
                    value: "={{ $if($('RSS Read').isExecuted, $('RSS Read').item.json.pubDate || $('Scrape a url and get its content3').item.json.data.metadata.publishedTime || $('Scrape a url and get its content3').item.json.data.metadata.publishedTime || $('Scrape a url and get its content3').item.json.data.metadata['article:published_time'], $('Urgently Watched List').item.json.pubDate) }}",
                    type: 'string',
                },
                {
                    id: '6bd73285-c360-4b10-8567-8ae66ecba2bd',
                    name: 'prompt',
                    value: "={{ $if($('sources').isExecuted, $('sources').item.json.prompt, \"\") }}",
                    type: 'string',
                },
                {
                    id: '101c6d7f-6e56-4362-9238-0b3e4fd7f14d',
                    name: 'additional_formats',
                    value: "={{ $if($('sources').isExecuted, $('sources').item.json.additional_formats, \"\") }}",
                    type: 'string',
                },
                {
                    id: 'a0b9d46b-67d2-4152-b1fa-2306fa5751e4',
                    name: 'source',
                    value: 'RSS',
                    type: 'string',
                },
                {
                    id: '9aea88f6-a629-4f42-ba37-8608bb631772',
                    name: 'mode',
                    value: "={{ $if($('sources').isExecuted, $('sources').item.json.process_mode, \"\") }}",
                    type: 'string',
                },
            ],
        },
        options: {},
    };

    @node({
        id: '6212deab-0bb5-4032-9d8f-e9b577cd3e82',
        name: 'Create summary and title11',
        type: '@n8n/n8n-nodes-langchain.chainLlm',
        version: 1.7,
        position: [1488, 4656],
    })
    CreateSummaryAndTitle11 = {
        promptType: 'define',
        text: `=<content>
{{ $('Markdown2').item.json.linebreak }}
</content>`,
        hasOutputParser: true,
        messages: {
            messageValues: [
                {
                    message: `=<prompt>
    <task>
        Your primary tasks are to analyze provided content and then generate a JSON object containing two key-value pairs:
        1.  **title:** A compelling, benefit-driven title.
        2.  **summary:** A concise and powerful summary of the key information.
    </task>
    
    <steps>
        1.  Thoroughly review all the key information provided.
        2.  Identify the most critical benefits for the target audience (businesses with vehicle fleets, construction machinery, etc.).
        3.  Distill this information into a clear, engaging summary, adhering strictly to the word count limit.
        4.  Craft a short, impactful title that grabs attention and highlights the primary value proposition.
        5.  Format the final output as a single JSON object.
    </steps>

    <restrictions>
        - **Summary Word Count:** DO NOT exceed 50 words for the summary.
        - **Tone:** AVOID jargon where possible. Focus on clear business benefits.
        - **Clarity:** Ensure the 'drop-in' nature (no engine modification) is communicated as a key advantage of simplicity.
        - **JSON Formatting:** The final output must be a single, valid JSON object enclosed in a markdown code block. Do not include any text before or after the JSON object.
-if "article page" has only page or header or footer information dont mention it in your output
    </restrictions>

    <output_rules>
        - **Format:** A raw JSON object.
        - **Keys:** The JSON object must contain exactly two keys: \`title\` and \`summary\`.
        - **Values:** The values for both keys must be strings.
        - **Tone:** The content of the strings must be professional, confident, and inspiring.
    </output_rules>

    <examples>
        ### Example 1
        **Input Content:** A press release detailing the launch of Syntech ASB and its ISCC certification.
        **Output:**
        \`\`\`json
        {
          "title": "Immediately Cut Carbon Emissions by 90% with UK-Made Biofuel",
          "summary": "Syntech ASB is a UK-made, ISCC-certified biofuel from 100% used cooking oil. As a simple drop-in fuel for any diesel engine, it helps businesses instantly reduce carbon emissions by up to 90% and meet Net Zero targets without new investment."
        }
        \`\`\`
    </examples>

</prompt>
`,
                },
            ],
        },
        batching: {},
    };

    @node({
        id: '984f612c-143b-4602-83c0-83a087bf48fd',
        name: 'OpenAI Chat Model16',
        type: '@n8n/n8n-nodes-langchain.lmChatOpenAi',
        version: 1.2,
        position: [1504, 4880],
        credentials: { openAiApi: { id: 'NoEKitspBJb0zQrp', name: 'Syntech GM OpenAi account' } },
    })
    OpenaiChatModel16 = {
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
        id: '5b7d3051-9966-431e-adc9-8e78b361bda3',
        name: 'Structured Output Parser22',
        type: '@n8n/n8n-nodes-langchain.outputParserStructured',
        version: 1.3,
        position: [1632, 4880],
    })
    StructuredOutputParser22 = {
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
        id: '671d2eeb-90a8-402e-a55c-129e2c58c529',
        name: 'RSS search fields3',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [1840, 4656],
    })
    RssSearchFields3 = {
        assignments: {
            assignments: [
                {
                    id: '53313200-69a8-4749-b320-7ad926795be1',
                    name: 'title',
                    value: '={{ $json.output.title }}',
                    type: 'string',
                },
                {
                    id: 'ab5c9158-a33a-4f8f-b6d0-a6787df0f0d5',
                    name: 'content',
                    value: `=RSS Article Description: 
{{ $if($('RSS Read').isExecuted, $('RSS Read').item.json['content:encodedSnippet'], $('Urgently Watched List').item.json['content:encodedSnippet']) || '' }}

{{ $if($('RSS Read').isExecuted, $('RSS Read').item.json.contentSnippet, $('Urgently Watched List').item.json.contentSnippet) }}
------------------
Article page:
{{ 
  $('Markdown2').item.json.linebreak.removeMarkdown()
}}`,
                    type: 'string',
                },
                {
                    id: 'f0c15fc7-071d-406d-8200-abecbf458836',
                    name: 'url',
                    value: "={{ $if($('RSS Read').isExecuted, $('RSS Read').item.json.link || decodeURIComponent($('RSS Read').item.json.link.match(/url=([^&]+)/)?.[1]), decodeURIComponent($('Urgently Watched List').item.json.link.match(/url=([^&]+)/)?.[1])) }}",
                    type: 'string',
                },
                {
                    id: 'b72746e5-4271-48e7-af68-4e1bdfd40452',
                    name: 'summary',
                    value: '={{ $json.output.summary }}',
                    type: 'string',
                },
                {
                    id: '39872c24-4acc-4513-b7fb-7689cd511afb',
                    name: 'search_query',
                    value: "={{ $if($('Limit5').isExecuted, $('Limit5').item.json.property_rss_feed, undefined) || $if($('sources').isExecuted, $('sources').item.json.url_or_keyword, undefined) || 'Urgent Watchlist' }}",
                    type: 'string',
                },
                {
                    id: '42852696-c7af-4ce4-a273-e61970ef2e8f',
                    name: 'publication_date',
                    value: "={{ $if($('RSS Read').isExecuted, $('RSS Read').item.json.pubDate || $('Scrape a url and get its content3').item.json.data.metadata.publishedTime || $('Scrape a url and get its content3').item.json.data.metadata.publishedTime || $('Scrape a url and get its content3').item.json.data.metadata['article:published_time'], $('Urgently Watched List').item.json.pubDate) }}",
                    type: 'string',
                },
                {
                    id: '6bd73285-c360-4b10-8567-8ae66ecba2bd',
                    name: 'prompt',
                    value: "={{ $if($('sources').isExecuted, $('sources').item.json.prompt, \"\") }}",
                    type: 'string',
                },
                {
                    id: '101c6d7f-6e56-4362-9238-0b3e4fd7f14d',
                    name: 'additional_formats',
                    value: "={{ $if($('sources').isExecuted, $('sources').item.json.additional_formats, \"\") }}",
                    type: 'string',
                },
                {
                    id: 'a0b9d46b-67d2-4152-b1fa-2306fa5751e4',
                    name: 'source',
                    value: 'RSS',
                    type: 'string',
                },
                {
                    id: '9aea88f6-a629-4f42-ba37-8608bb631772',
                    name: 'mode',
                    value: "={{ $if($('sources').isExecuted, $('sources').item.json.process_mode, \"\") }}",
                    type: 'string',
                },
            ],
        },
        options: {},
    };

    @node({
        id: '9bdc4191-c39c-4f8b-aad7-1f07382cd7ee',
        name: 'Add Content With Date',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.3,
        position: [12864, 4944],
        credentials: { notionApi: { id: 'k0ZwGrqySi9Wayf7', name: 'Stephen Notion account' } },
        onError: 'continueErrorOutput',
    })
    AddContentWithDate = {
        method: 'POST',
        url: 'https://api.notion.com/v1/pages',
        authentication: 'predefinedCredentialType',
        nodeCredentialType: 'notionApi',
        sendHeaders: true,
        headerParameters: {
            parameters: [
                {
                    name: 'Notion-Version',
                    value: '2025-09-03',
                },
            ],
        },
        sendBody: true,
        specifyBody: 'json',
        jsonBody: `={
  "parent": {
    "type": "database_id",
    "database_id": "27c785c0-cfab-8137-800f-dcf3e01a3e97"
  },
  "properties": {
    "Article Name": {
      "title": [
        {
          "text": {
            "content": "{{ $('Map Data for Notion1').item.json.title }}"
          }
        }
      ]
    },
    "Publication Date": {
      "date": {
        "start": "{{ $('Map Data for Notion1').item.json.publication_date }}"
      }
    },
    "Source URL": {
      "url": "{{ $('Map Data for Notion1').item.json.url }}"
    },
    "Source": {
      "multi_select": [
        {
          "name": "{{ $('Map Data for Notion1').item.json.source }}"
        }
      ]
    },
    "Source Name": {
      "rich_text": [
        {
          "text": {
            "content": "{{ $('Map Data for Notion1').item.json.source_name }}"
          }
        }
      ]
    },
    "Status": {
      "select": {
        "name": "Not Reviewed"
      }
    },
    "Search Query": {
      "rich_text": [
        {
          "text": {
            "content": "{{ $('Map Data for Notion1').item.json.search_query }}"
          }
        }
      ]
    },
    "Summary": {
      "rich_text": [
        {
          "text": {
            "content": "{{ $('Map Data for Notion1').item.json.summary }}"
          }
        }
      ]
    },
    "Own Analysis": {
      "rich_text": [
        {
          "text": {
            "content": "{{ $('Map Data for Notion1').item.json.prompt }}"
          }
        }
      ]
    },
    "Fact Fingerprint": {
      "rich_text": [
        {
          "text": {
            "content": "{{ $('Map Data for Notion1').item.json.fact_extraction }}"
          }
        }
      ]
    },
    "Topic Action": {
      "multi_select": [
        {
          "name": "{{ $('Map Data for Notion1').item.json.topical_signature.topic_action }}"
        }
      ]
    },
    "Topic Entities": {
      "multi_select": [
        {{ $('Map Data for Notion1').item.json.topical_signature.topic_entities }}
      ]
    },
    "Topic Geo": {
      "multi_select": [
        {
          "name": "{{ $('Map Data for Notion1').item.json.topical_signature.topic_geo }}"
        }
      ]
    },
    "Topic Signature": {
      "rich_text": [
        {
          "text": {
            "content": "{{ $('Map Data for Notion1').item.json.topical_signature.topic_signature }}"
          }
        }
      ]
    },
    "Topic Subject": {
      "rich_text": [
        {
          "text": {
            "content": "{{ $('Map Data for Notion1').item.json.topical_signature.topic_subject }}"
          }
        }
      ]
    },
    "pathway": {
    "rich_text": [
      {
        "text": {
          "content": {{ $('Map Data for Notion1').item.json.pathway.toJsonString() }}
        }
      }
    ]
  },
  "key_highlights": {
    "rich_text": [
      {
        "text": {
          "content": "{{ $('Map Data for Notion1').item.json.key_highlights }}"
        }
      }
    ]
  },
  "strategic_summary": {
    "rich_text": [
      {
        "text": {
          "content": {{ $('Map Data for Notion1').item.json.strategic_summary.toJsonString() }}
        }
      }
    ]
  },
  "recommended_action": {
    "rich_text": [
      {
        "text": {
          "content": {{ $('Map Data for Notion1').item.json.recommended_action.toJsonString() }}
        }
      }
    ]
  },
  "active_scoring_components": {
    "rich_text": [
      {
        "text": {
          "content": {{ $('Map Data for Notion1').item.json.active_scoring_components.toJsonString() }}
        }
      }
    ]
  },
  "priority_band": {
    "multi_select": [
      {
        "name": {{ $('Map Data for Notion1').item.json.priority_band.toJsonString() }}
      }
    ]
  },
  "total_score": {
    "number": {{ $('Map Data for Notion1').item.json.total_score }}
  },
    "Update Status": {
      "select": {
        "name": "{{ $('Map Data for Notion1').item.json.classification }}"
      }
    },
    "Additional Formats": {
      "relation": [{{ $('Map Data for Notion1').item.json.platform_prompts.map(item => \`{"id":"\${item}"}\`) }}]
    },
    "Choose Image Format": {
      "relation": [{{ $('Map Data for Notion1').item.json.image_prompts.map(item => \`{"id":"\${item}"}\`) }}]
    }
  },
  "children": [
    {
      "object": "block",
      "type": "paragraph",
      "paragraph": {
        "rich_text": [
          {
            "text": {
              "content": {{ $json.textSubString.toJsonString() }}
            }
          }
        ]
      }
    }
  ]
}`,
        options: {},
    };

    @node({
        id: 'df8ee00c-0ee0-46c1-b516-1fd28e50b414',
        name: 'Add Content Without Date',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.3,
        position: [12864, 5232],
        credentials: { notionApi: { id: 'k0ZwGrqySi9Wayf7', name: 'Stephen Notion account' } },
        onError: 'continueErrorOutput',
    })
    AddContentWithoutDate = {
        method: 'POST',
        url: 'https://api.notion.com/v1/pages',
        authentication: 'predefinedCredentialType',
        nodeCredentialType: 'notionApi',
        sendHeaders: true,
        headerParameters: {
            parameters: [
                {
                    name: 'Notion-Version',
                    value: '2025-09-03',
                },
            ],
        },
        sendBody: true,
        specifyBody: 'json',
        jsonBody: `={
  "parent": {
    "type": "database_id",
    "database_id": "27c785c0-cfab-8137-800f-dcf3e01a3e97"
  },
  "properties": {
    "Article Name": {
      "title": [
        {
          "text": {
            "content": "{{ $('Map Data for Notion1').item.json.title }}"
          }
        }
      ]
    },
    "Source URL": {
      "url": "{{ $('Map Data for Notion1').item.json.url }}"
    },
    "Source Name": {
      "rich_text": [
        {
          "text": {
            "content": "{{ $('Map Data for Notion1').item.json.source_name }}"
          }
        }
      ]
    },
    "Source": {
      "multi_select": [
        {
          "name": "{{ $('Map Data for Notion1').item.json.source }}"
        }
      ]
    },
    "Status": {
      "select": {
        "name": "Not Reviewed"
      }
    },
    "Search Query": {
      "rich_text": [
        {
          "text": {
            "content": "{{ $('Map Data for Notion1').item.json.search_query }}"
          }
        }
      ]
    },
    "Summary": {
      "rich_text": [
        {
          "text": {
            "content": "{{ $('Map Data for Notion1').item.json.summary }}"
          }
        }
      ]
    },
    "Own Analysis": {
      "rich_text": [
        {
          "text": {
            "content": "{{ $('Map Data for Notion1').item.json.prompt }}"
          }
        }
      ]
    },
    "Fact Fingerprint": {
      "rich_text": [
        {
          "text": {
            "content": "{{ $('Map Data for Notion1').item.json.fact_extraction }}"
          }
        }
      ]
    },
    "Topic Action": {
      "multi_select": [
        {
          "name": "{{ $('Map Data for Notion1').item.json.topical_signature.topic_action }}"
        }
      ]
    },
    "Topic Entities": {
      "multi_select": [
        {
          "name": "{{ $('Map Data for Notion1').item.json.topical_signature.topic_entities }}"
        }
      ]
    },
    "Topic Geo": {
      "multi_select": [
        {
          "name": "{{ $('Map Data for Notion1').item.json.topical_signature.topic_geo }}"
        }
      ]
    },
    "Topic Signature": {
      "rich_text": [
        {
          "text": {
            "content": "{{ $('Map Data for Notion1').item.json.topical_signature.topic_signature }}"
          }
        }
      ]
    },
    "Topic Subject": {
      "rich_text": [
        {
          "text": {
            "content": "{{ $('Map Data for Notion1').item.json.topical_signature.topic_subject }}"
          }
        }
      ]
    },
    "pathway": {
    "rich_text": [
      {
        "text": {
          "content": {{ $('Map Data for Notion1').item.json.pathway.toJsonString() }}
        }
      }
    ]
  },
  "key_highlights": {
    "rich_text": [
      {
        "text": {
          "content": "{{ $('Map Data for Notion1').item.json.key_highlights }}"
        }
      }
    ]
  },
  "strategic_summary": {
    "rich_text": [
      {
        "text": {
          "content": {{ $('Map Data for Notion1').item.json.strategic_summary.toJsonString() }}
        }
      }
    ]
  },
  "recommended_action": {
    "rich_text": [
      {
        "text": {
          "content": {{ $('Map Data for Notion1').item.json.recommended_action.toJsonString() }}
        }
      }
    ]
  },
  "active_scoring_components": {
    "rich_text": [
      {
        "text": {
          "content": {{ $('Map Data for Notion1').item.json.active_scoring_components.toJsonString() }}
        }
      }
    ]
  },
  "priority_band": {
    "multi_select": [
      {
        "name": {{ $('Map Data for Notion1').item.json.priority_band.toJsonString() }}
      }
    ]
  },
  "total_score": {
    "number": {{ $('Map Data for Notion1').item.json.total_score }}
  },
    "Update Status": {
      "select": {
        "name": "{{ $('Map Data for Notion1').item.json.classification }}"
      }
    },
    "Additional Formats": {
      "relation": [{{ $('Map Data for Notion1').item.json.platform_prompts.map(item => \`{"id":"\${item}"}\`) }}]
    },
    "Choose Image Format": {
      "relation": [{{ $('Map Data for Notion1').item.json.image_prompts.map(item => \`{"id":"\${item}"}\`) }}]
    }
  },
  "children": [
    {
      "object": "block",
      "type": "paragraph",
      "paragraph": {
        "rich_text": [
          {
            "text": {
              "content": {{ $json.textSubString.toJsonString() }}
            }
          }
        ]
      }
    }
  ]
}`,
        options: {},
    };

    @node({
        id: '45d3f0b1-ebdb-4091-aa9b-c8a9e3be6800',
        name: 'Sticky Note6',
        type: 'n8n-nodes-base.stickyNote',
        version: 1,
        position: [2464, 5328],
    })
    StickyNote6 = {
        content: '## Remove Duplicates',
        height: 448,
        width: 1392,
        color: 3,
    };

    @node({
        id: '13c4dd8a-50ac-4336-82a1-2bacd4ba5f1c',
        name: 'Sticky Note7',
        type: 'n8n-nodes-base.stickyNote',
        version: 1,
        position: [1712, 4352],
    })
    StickyNote7 = {
        content: '## Call sub workflow according to switch node',
        height: 2000,
        width: 576,
        color: 6,
    };

    @node({
        id: 'bacb4485-a644-4e3b-90dc-8e5166c776aa',
        name: 'Map Data for Notion',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [11744, 6048],
    })
    MapDataForNotion = {
        assignments: {
            assignments: [
                {
                    id: '60beb5e2-6383-409b-8c39-19c9941d0611',
                    name: 'title',
                    value: "={{ $('Final Input').item.json.title }}",
                    type: 'string',
                },
                {
                    id: '75e5203c-7fc8-45d1-9aaf-ac3feca9998f',
                    name: 'publication_date',
                    value: `={{
(() => {
  const raw = $('Final Input').item.json.publication_date;
  if (!raw || typeof raw !== 'string') return 'NA';

  let dt;

  dt = DateTime.fromISO(raw, { zone: 'utc' });
  if (dt.isValid) return dt.toISO();

  dt = DateTime.fromRFC2822(raw, { zone: 'utc' });
  if (dt.isValid) return dt.toISO();

  dt = DateTime.fromHTTP(raw, { zone: 'utc' });
  if (dt.isValid) return dt.toISO();

  const formats = [
    'ccc LLL dd HH:mm:ss Z yyyy',
    'yyyy-MM-dd HH:mm:ss',
    'yyyy/MM/dd HH:mm:ss',
    'dd/MM/yyyy HH:mm:ss',
    'dd-MM-yyyy HH:mm:ss',
    'yyyy-MM-dd',
    'dd/MM/yyyy',
    'MM/dd/yyyy'
  ];

  for (const f of formats) {
    dt = DateTime.fromFormat(raw, f, { zone: 'utc' });
    if (dt.isValid) return dt.toISO();
  }

  const jsDate = new Date(raw);
  if (!isNaN(jsDate)) {
    return DateTime.fromJSDate(jsDate, { zone: 'utc' }).toISO();
  }

  return 'NA';
})()
}}`,
                    type: 'string',
                },
                {
                    id: 'cda65c46-ca98-4d3b-94a5-8efa8468a5c5',
                    name: 'url',
                    value: "={{ $('Final Input').item.json.url ? $('Final Input').item.json.url?.trim() : \"NA\" }}",
                    type: 'string',
                },
                {
                    id: '2eaf0819-96c5-43f9-8bfe-60020f39a7da',
                    name: 'source',
                    value: "={{ $('Final Input').item.json.source ? $('Final Input').item.json.source : \"NA\" }}",
                    type: 'string',
                },
                {
                    id: '96dab174-e8ef-4c01-8047-a56813c50f76',
                    name: 'source_name',
                    value: "={{ $('Final Input').item.json.source_name }}",
                    type: 'string',
                },
                {
                    id: '48f2ac2b-de0b-47f6-9b56-f5d231119533',
                    name: 'search_query',
                    value: "={{ $('Final Input').item.json.search_query ? $('Final Input').item.json.search_query?.trim() : \"NA\"}}",
                    type: 'string',
                },
                {
                    id: 'a6d31903-9b90-4a94-bd31-865b362b41ec',
                    name: 'summary',
                    value: "={{ $('Final Input').item.json.summary ? $('Final Input').item.json.summary : \"NA\"}}",
                    type: 'string',
                },
                {
                    id: 'af126fa8-eb15-4598-baaf-d6ac11c76a21',
                    name: 'prompt',
                    value: "={{ $if($('Final Input').isExecuted, $('Final Input').item.json.prompt || '' , '') }}",
                    type: 'string',
                },
                {
                    id: '2570abdd-fc3f-43b7-81f8-ffe0e871cc73',
                    name: 'fact_extraction',
                    value: "={{ $('Filter Articles By Topic').isExecuted ? $('Filter Articles By Topic').item.json.fact_extraction.toJsonString().replace(/\"/g, '\\\\\"') : \"NA\"}}",
                    type: 'string',
                },
                {
                    id: '34694247-0e3f-4da5-8f8f-91baa3121149',
                    name: 'topical_signature.topic_action',
                    value: "={{ $('Filter Articles By Topic').isExecuted ? $('Filter Articles By Topic').item.json.topical_signature.topic_action : \"NA\"}}",
                    type: 'string',
                },
                {
                    id: '7e0ce80d-80be-4c32-9bd7-82f65bfde025',
                    name: 'topical_signature.topic_entities',
                    value: `={{ $('Filter Articles By Topic').isExecuted ? $('Filter Articles By Topic').item.json.topical_signature.topic_entities.map(item =>
      \`{
          "name": "\${item}"
        }\`) : NA }}`,
                    type: 'array',
                },
                {
                    id: 'dc6e0e34-409e-4359-8dfc-9eac487c5096',
                    name: 'topical_signature.topic_geo',
                    value: "={{ $('Filter Articles By Topic').isExecuted ? $('Filter Articles By Topic').item.json.topical_signature.topic_geo : \"NA\"}}",
                    type: 'string',
                },
                {
                    id: '2da15c35-1446-438b-9999-f428288dbe21',
                    name: 'topical_signature.topic_signature',
                    value: "={{ $('Filter Articles By Topic').isExecuted ? $('Filter Articles By Topic').item.json.topical_signature.topic_signature : \"NA\"}}",
                    type: 'string',
                },
                {
                    id: '798291f1-bf55-4c9a-a562-13a40d8cf312',
                    name: 'topical_signature.topic_subject',
                    value: "={{ $('Filter Articles By Topic').isExecuted ? $('Filter Articles By Topic').item.json.topical_signature.topic_subject : \"NA\"}}",
                    type: 'string',
                },
                {
                    id: 'f7ebaccb-ca0b-4c45-81aa-fa046b46b005',
                    name: 'classification',
                    value: "={{ $('Filter Articles By Topic').isExecuted ? $('Filter Articles By Topic').item.json.classification : \"new\"}}",
                    type: 'string',
                },
                {
                    id: 'c6c89504-6855-44af-a0d8-fdc3c12c79dc',
                    name: 'content_remove_duplicate_node',
                    value: `={{ 
  ($('Final Input').item.json.content ?? '')
    .replace(/\\\\/g, '\\\\\\\\')
    .replace(/"/g, '\\\\"')
    .replace(/\\n/g, '\\\\n')
}}`,
                    type: 'string',
                },
                {
                    id: '8edde5a6-1960-4492-ab89-aceaedc23df5',
                    name: 'pathway',
                    value: "={{ $('Check Sources Executed').item.json.analysis.pathway }}",
                    type: 'string',
                },
                {
                    id: '2000d261-dff9-4178-9d9b-d2bde88e0a79',
                    name: 'total_score',
                    value: "={{ $('Check Sources Executed').item.json.analysis.total_score }}",
                    type: 'number',
                },
                {
                    id: 'fb933280-486d-4785-89ef-39f89ebea213',
                    name: 'strategic_summary',
                    value: "={{ $('Check Sources Executed').item.json.analysis.strategic_summary }}",
                    type: 'string',
                },
                {
                    id: '7e2c9882-620d-4b09-8db5-17772131634a',
                    name: 'key_highlights',
                    value: '={{ $(\'Check Sources Executed\').item.json.analysis.key_highlights.join(". ") }}',
                    type: 'string',
                },
                {
                    id: '5b6f8ff1-7f1d-4d76-b682-aa22de79685f',
                    name: 'recommended_action',
                    value: "={{ $('Check Sources Executed').item.json.analysis.recommended_action }}",
                    type: 'string',
                },
                {
                    id: 'be6698a9-68e6-4e01-a174-ff7b2b709cb1',
                    name: 'priority_band',
                    value: "={{ $('Check Sources Executed').item.json.analysis.priority_band }}",
                    type: 'string',
                },
                {
                    id: '7bb655a8-d74b-473e-bef3-6cbd462da6cd',
                    name: 'active_scoring_components',
                    value: "={{ $('Check Sources Executed').item.json.analysis.active_scoring_components || '' }}",
                    type: 'string',
                },
                {
                    id: '92481803-007a-4f79-a32a-7533ecba1ced',
                    name: 'image_prompts',
                    value: "={{ $('Final Input').item.json.data[1].image_prompt_ids }}",
                    type: 'string',
                },
                {
                    id: 'ab44745b-638d-45ed-8ef8-bec0c68d9fc4',
                    name: 'platform_prompts',
                    value: "={{ $('Final Input').item.json.data[0].platform_prompt_ids }}",
                    type: 'string',
                },
            ],
        },
        options: {
            ignoreConversionErrors: true,
        },
    };

    @node({
        id: '2397989b-96cc-419a-acb0-2f6bfc46ed75',
        name: 'Map Data for Notion1',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [11968, 5152],
    })
    MapDataForNotion1 = {
        assignments: {
            assignments: [
                {
                    id: '60beb5e2-6383-409b-8c39-19c9941d0611',
                    name: 'title',
                    value: "={{ $('Final Input').item.json.title }}",
                    type: 'string',
                },
                {
                    id: '75e5203c-7fc8-45d1-9aaf-ac3feca9998f',
                    name: 'publication_date',
                    value: `={{
(() => {
  const raw = $('Final Input').item.json.publication_date;
  if (!raw || typeof raw !== 'string') return 'NA';

  let dt;

  dt = DateTime.fromISO(raw, { zone: 'utc' });
  if (dt.isValid) return dt.toISO();

  dt = DateTime.fromRFC2822(raw, { zone: 'utc' });
  if (dt.isValid) return dt.toISO();

  dt = DateTime.fromHTTP(raw, { zone: 'utc' });
  if (dt.isValid) return dt.toISO();

  const formats = [
    'ccc LLL dd HH:mm:ss Z yyyy',
    'yyyy-MM-dd HH:mm:ss',
    'yyyy/MM/dd HH:mm:ss',
    'dd/MM/yyyy HH:mm:ss',
    'dd-MM-yyyy HH:mm:ss',
    'yyyy-MM-dd',
    'dd/MM/yyyy',
    'MM/dd/yyyy'
  ];

  for (const f of formats) {
    dt = DateTime.fromFormat(raw, f, { zone: 'utc' });
    if (dt.isValid) return dt.toISO();
  }

  const jsDate = new Date(raw);
  if (!isNaN(jsDate)) {
    return DateTime.fromJSDate(jsDate, { zone: 'utc' }).toISO();
  }

  return 'NA';
})()
}}`,
                    type: 'string',
                },
                {
                    id: 'cda65c46-ca98-4d3b-94a5-8efa8468a5c5',
                    name: 'url',
                    value: "={{ $('Final Input').item.json.url ? $('Final Input').item.json.url?.trim() : \"NA\" }}",
                    type: 'string',
                },
                {
                    id: '2eaf0819-96c5-43f9-8bfe-60020f39a7da',
                    name: 'source',
                    value: "={{ $('Final Input').item.json.source ? $('Final Input').item.json.source : \"NA\" }}",
                    type: 'string',
                },
                {
                    id: '9fb33c0f-f4c0-4697-8454-f7366cb1469f',
                    name: 'source_name',
                    value: "={{ $('Final Input').item.json.source_name }}",
                    type: 'string',
                },
                {
                    id: '48f2ac2b-de0b-47f6-9b56-f5d231119533',
                    name: 'search_query',
                    value: "={{ $('Final Input').item.json.search_query ? $('Final Input').item.json.search_query?.trim() : \"NA\"}}",
                    type: 'string',
                },
                {
                    id: 'a6d31903-9b90-4a94-bd31-865b362b41ec',
                    name: 'summary',
                    value: "={{ $('Final Input').item.json.summary ? $('Final Input').item.json.summary : \"NA\"}}",
                    type: 'string',
                },
                {
                    id: 'af126fa8-eb15-4598-baaf-d6ac11c76a21',
                    name: 'prompt',
                    value: "={{ $if($('Final Input').isExecuted, $('Final Input').item.json.prompt || '' , '') }}",
                    type: 'string',
                },
                {
                    id: 'c6c89504-6855-44af-a0d8-fdc3c12c79dc',
                    name: 'content_remove_duplicate_node',
                    value: "={{ $('Final Input').item.json.content ? $('Final Input').item.json.content : \"NA\"}}",
                    type: 'string',
                },
                {
                    id: '7ad26930-4b4b-4d58-97be-db52f57212e3',
                    name: 'content_if_sources_executed',
                    value: "={{ $('Final Input').item.json.content ? $('Final Input').item.json.content : \"NA\"}}",
                    type: 'string',
                },
                {
                    id: 'ccaadeed-1214-432f-867f-11197522ac00',
                    name: 'fact_extraction',
                    value: "={{ $('Filter Articles By Topic1').isExecuted ? $('Filter Articles By Topic1').item.json.fact_extraction.toJsonString().replace(/\"/g, '\\\\\"') : \"NA\"}}",
                    type: 'string',
                },
                {
                    id: '07ca4374-1d1c-4965-843e-6b2e16f357ea',
                    name: 'topical_signature.topic_action',
                    value: "={{ $('Filter Articles By Topic1').isExecuted ? $('Filter Articles By Topic1').item.json.topical_signature.topic_action : \"NA\"}}",
                    type: 'string',
                },
                {
                    id: 'd4700429-50a0-4f4e-bdcd-8c2255382d9c',
                    name: 'topical_signature.topic_entities',
                    value: `={{ $('Filter Articles By Topic1').isExecuted ? $('Filter Articles By Topic1').item.json.topical_signature.topic_entities.map(item =>
      \`{
          "name": "\${item}"
        }\`) : "NA" }}`,
                    type: 'array',
                },
                {
                    id: '75e1fcc1-f990-453d-b731-1462a9ccb8fa',
                    name: 'topical_signature.topic_geo',
                    value: "={{ $('Filter Articles By Topic1').isExecuted ? $('Filter Articles By Topic1').item.json.topical_signature.topic_geo : \"NA\"}}",
                    type: 'string',
                },
                {
                    id: '57af503e-3fca-47ce-97cc-37e0c93f222a',
                    name: 'topical_signature.topic_signature',
                    value: "={{ $('Filter Articles By Topic1').isExecuted ? $('Filter Articles By Topic1').item.json.topical_signature.topic_signature : \"NA\"}}",
                    type: 'string',
                },
                {
                    id: '8ce6c2e7-9a05-41b8-940b-916a612571cc',
                    name: 'topical_signature.topic_subject',
                    value: "={{ $('Filter Articles By Topic1').isExecuted ? $('Filter Articles By Topic1').item.json.topical_signature.topic_subject : \"NA\"}}",
                    type: 'string',
                },
                {
                    id: '19bc8e04-245a-4bd3-a836-0a112330ee7d',
                    name: 'classification',
                    value: "={{ $('Filter Articles By Topic1').isExecuted ? $('Filter Articles By Topic1').item.json.classification : \"new\"}}",
                    type: 'string',
                },
                {
                    id: 'c479fe81-c0d8-48a3-8fb3-2d9f9faf6cb7',
                    name: 'content_if_sources_executed',
                    value: "={{ $('Check Sources Executed1').item.json.content ? $('Check Sources Executed1').item.json.content : \"NA\"}}",
                    type: 'string',
                },
                {
                    id: 'e75ac639-3d0f-49fb-9257-ade65d4f55b9',
                    name: 'content_remove_duplicate_node',
                    value: "={{ $('Final Input').item.json.content ? $('Final Input').item.json.content : \"NA\"}}",
                    type: 'string',
                },
                {
                    id: '63d7a524-31cf-442b-8ed3-37ba1c002d00',
                    name: 'pathway',
                    value: "={{ $('Check Sources Executed1').item.json.analysis.pathway }}",
                    type: 'string',
                },
                {
                    id: '452b9c72-719c-49f3-99a7-0b923e986c0d',
                    name: 'total_score',
                    value: "={{ $('Check Sources Executed1').item.json.analysis.total_score }}",
                    type: 'number',
                },
                {
                    id: '7a96d705-b7b3-440c-9e0b-aa98f0206c92',
                    name: 'strategic_summary',
                    value: "={{ $('Check Sources Executed1').item.json.analysis.strategic_summary }}",
                    type: 'string',
                },
                {
                    id: '11f690f6-bade-4a42-9cd7-373ae90532d7',
                    name: 'key_highlights',
                    value: '={{ $(\'Check Sources Executed1\').item.json.analysis.key_highlights.join(". ") }}',
                    type: 'string',
                },
                {
                    id: 'a0d87b24-85e2-4ac9-809e-91b4a84d8c66',
                    name: 'recommended_action',
                    value: "={{ $('Check Sources Executed1').item.json.analysis.recommended_action }}",
                    type: 'string',
                },
                {
                    id: '9cdd9bb7-3179-4487-94ec-10a9d0be1b68',
                    name: 'priority_band',
                    value: "={{ $('Check Sources Executed1').item.json.analysis.priority_band }}",
                    type: 'string',
                },
                {
                    id: 'e6feffc1-0ed4-4386-aee6-9c3049a65919',
                    name: 'active_scoring_components',
                    value: "={{ $('Check Sources Executed1').item.json.analysis.active_scoring_components || '' }}",
                    type: 'string',
                },
                {
                    id: 'a7c8166e-dd91-4ea8-b65e-b9592f133638',
                    name: 'image_prompts',
                    value: "={{ $('Final Input').item.json.data[1].image_prompt_ids }}",
                    type: 'array',
                },
                {
                    id: '629b868a-80ba-4964-a4eb-307d01251428',
                    name: 'platform_prompts',
                    value: "={{ $('Final Input').item.json.data[0].platform_prompt_ids }}",
                    type: 'array',
                },
            ],
        },
        options: {
            ignoreConversionErrors: true,
        },
    };

    @node({
        id: 'eee4c7f9-3e80-4dcb-8d20-be942ae2b900',
        name: 'Check Sources Executed',
        type: 'n8n-nodes-base.if',
        version: 2.2,
        position: [11296, 6144],
    })
    CheckSourcesExecuted = {
        conditions: {
            options: {
                caseSensitive: true,
                leftValue: '',
                typeValidation: 'strict',
                version: 2,
            },
            conditions: [
                {
                    id: 'cc515966-f679-4152-a85b-f524bb588f34',
                    leftValue: "={{ $('sources').isExecuted }}",
                    rightValue: '',
                    operator: {
                        type: 'boolean',
                        operation: 'true',
                        singleValue: true,
                    },
                },
            ],
            combinator: 'and',
        },
        options: {},
    };

    @node({
        id: 'dfbfd4a8-6995-46d1-96fe-be959fd06d1f',
        name: 'Check Sources Executed1',
        type: 'n8n-nodes-base.if',
        version: 2.2,
        position: [11520, 5264],
    })
    CheckSourcesExecuted1 = {
        conditions: {
            options: {
                caseSensitive: true,
                leftValue: '',
                typeValidation: 'strict',
                version: 2,
            },
            conditions: [
                {
                    id: 'cc515966-f679-4152-a85b-f524bb588f34',
                    leftValue: "={{ $('sources').isExecuted }}",
                    rightValue: '',
                    operator: {
                        type: 'boolean',
                        operation: 'true',
                        singleValue: true,
                    },
                },
            ],
            combinator: 'and',
        },
        options: {},
    };

    @node({
        id: 'f7ce7419-bc36-47eb-adff-13043a050625',
        name: 'Get 15 Ideas',
        type: 'n8n-nodes-base.limit',
        version: 1,
        position: [816, 5104],
    })
    Get15Ideas = {
        maxItems: 15,
    };

    @node({
        id: 'a22ece2c-3361-4999-bf3e-9a0690e22910',
        name: "Call 'LinkedIn Search (Profile, Keyword, Company)'",
        type: 'n8n-nodes-base.executeWorkflow',
        version: 1.3,
        position: [2064, 5232],
    })
    CallLinkedinSearchProfileKeywordCompany = {
        workflowId: {
            __rl: true,
            value: 'p9T1CJ8sI5Q18MoG',
            mode: 'list',
            cachedResultUrl: '/workflow/p9T1CJ8sI5Q18MoG',
            cachedResultName: 'LinkedIn Search (Profile, Keyword, Company)',
        },
        workflowInputs: {
            mappingMode: 'defineBelow',
            value: {
                id: '={{ $json.id }}',
                name: '={{ $json.name }}',
                url: '={{ $json.url }}',
                property_keyword_category: '={{ $json.property_keyword_category }}',
                property_priority: '={{ $json.property_priority }}',
                property_rss_feed: '={{ $json.property_rss_feed }}',
                property_source: '={{ $json.property_source }}',
                property_category: '={{ $json.property_category }}',
                property_url: '={{ $json.property_url }}',
                property_status: '={{ $json.property_status }}',
                property_name: '={{ $json.property_name }}',
                prompt: '={{ $json.prompt }}',
                url_or_keyword: '={{ $json.url_or_keyword }}',
                source: '={{ $json.source }}',
                additional_formats: '={{ $json.additional_formats }}',
                process_mode: '={{ $json.process_mode }}',
                bypass_filter: '={{ $json.bypass_filter }}',
            },
            matchingColumns: [],
            schema: [
                {
                    id: 'id',
                    displayName: 'id',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'name',
                    displayName: 'name',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'url',
                    displayName: 'url',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'property_keyword_category',
                    displayName: 'property_keyword_category',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'property_priority',
                    displayName: 'property_priority',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'property_rss_feed',
                    displayName: 'property_rss_feed',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'property_source',
                    displayName: 'property_source',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'property_category',
                    displayName: 'property_category',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'property_url',
                    displayName: 'property_url',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'property_status',
                    displayName: 'property_status',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'property_name',
                    displayName: 'property_name',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'prompt',
                    displayName: 'prompt',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'url_or_keyword',
                    displayName: 'url_or_keyword',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'source',
                    displayName: 'source',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'additional_formats',
                    displayName: 'additional_formats',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'process_mode',
                    displayName: 'process_mode',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'bypass_filter',
                    displayName: 'bypass_filter',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
            ],
            attemptToConvertTypes: false,
            convertFieldsToString: true,
        },
        options: {},
    };

    @node({
        id: '4da7d80b-cd47-4e92-9362-c94d7ec623df',
        name: "Call 'Tavily Keyword Search'",
        type: 'n8n-nodes-base.executeWorkflow',
        version: 1.3,
        position: [2064, 5616],
    })
    CallTavilyKeywordSearch = {
        workflowId: {
            __rl: true,
            value: 'N0iykcUkUjgXDL0k',
            mode: 'list',
            cachedResultUrl: '/workflow/N0iykcUkUjgXDL0k',
            cachedResultName: 'Tavily Keyword Search',
        },
        workflowInputs: {
            mappingMode: 'defineBelow',
            value: {
                id: '={{ $json.id }}',
                name: '={{ $json.name }}',
                url: '={{ $json.url }}',
                property_keyword_category: '={{ $json.property_keyword_category }}',
                property_priority: '={{ $json.property_priority }}',
                property_rss_feed: '={{ $json.property_rss_feed }}',
                property_source: '={{ $json.property_source }}',
                property_category: '={{ $json.property_category }}',
                property_url: '={{ $json.property_url }}',
                property_status: '={{ $json.property_status }}',
                property_name: '={{ $json.property_name }}',
                prompt: '={{ $json.prompt }}',
                url_or_keyword: '={{ $json.url_or_keyword }}',
                source: '={{ $json.source }}',
                additional_formats: '={{ $json.additional_formats }}',
                process_mode: '={{ $json.process_mode }}',
                bypass_filter: '={{ $json.bypass_filter }}',
            },
            matchingColumns: [],
            schema: [
                {
                    id: 'id',
                    displayName: 'id',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'name',
                    displayName: 'name',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'url',
                    displayName: 'url',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'property_keyword_category',
                    displayName: 'property_keyword_category',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'property_priority',
                    displayName: 'property_priority',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'property_rss_feed',
                    displayName: 'property_rss_feed',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'property_source',
                    displayName: 'property_source',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'property_category',
                    displayName: 'property_category',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'property_url',
                    displayName: 'property_url',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'property_status',
                    displayName: 'property_status',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'property_name',
                    displayName: 'property_name',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'prompt',
                    displayName: 'prompt',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'url_or_keyword',
                    displayName: 'url_or_keyword',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'source',
                    displayName: 'source',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'additional_formats',
                    displayName: 'additional_formats',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'process_mode',
                    displayName: 'process_mode',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'bypass_filter',
                    displayName: 'bypass_filter',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
            ],
            attemptToConvertTypes: false,
            convertFieldsToString: true,
        },
        options: {},
    };

    @node({
        id: '128a85e2-ee24-4834-93ba-b70bcc27fc94',
        name: "Call 'Search Instagram Page'",
        type: 'n8n-nodes-base.executeWorkflow',
        version: 1.3,
        position: [2064, 5808],
    })
    CallSearchInstagramPage = {
        workflowId: {
            __rl: true,
            value: '3TArIAzUNlMPDPqK',
            mode: 'list',
            cachedResultUrl: '/workflow/3TArIAzUNlMPDPqK',
            cachedResultName: 'Search Instagram Page',
        },
        workflowInputs: {
            mappingMode: 'defineBelow',
            value: {
                id: '={{ $json.id }}',
                name: '={{ $json.name }}',
                url: '={{ $json.url }}',
                property_keyword_category: '={{ $json.property_keyword_category }}',
                property_priority: '={{ $json.property_priority }}',
                property_rss_feed: '={{ $json.property_rss_feed }}',
                property_source: '={{ $json.property_source }}',
                property_category: '={{ $json.property_category }}',
                property_url: '={{ $json.property_url }}',
                property_status: '={{ $json.property_status }}',
                property_name: '={{ $json.property_name }}',
                additional_formats: '={{ $json.additional_formats }}',
                prompt: '={{ $json.prompt }}',
                url_or_keyword: '={{ $json.url_or_keyword }}',
                source: '={{ $json.source }}',
                process_mode: '={{ $json.process_mode }}',
                bypass_filter: '={{ $json.bypass_filter }}',
            },
            matchingColumns: [],
            schema: [
                {
                    id: 'id',
                    displayName: 'id',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'name',
                    displayName: 'name',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'url',
                    displayName: 'url',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'property_keyword_category',
                    displayName: 'property_keyword_category',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'property_priority',
                    displayName: 'property_priority',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'property_rss_feed',
                    displayName: 'property_rss_feed',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'property_source',
                    displayName: 'property_source',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'property_category',
                    displayName: 'property_category',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'property_url',
                    displayName: 'property_url',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'property_status',
                    displayName: 'property_status',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'property_name',
                    displayName: 'property_name',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'prompt',
                    displayName: 'prompt',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'url_or_keyword',
                    displayName: 'url_or_keyword',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'source',
                    displayName: 'source',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'additional_formats',
                    displayName: 'additional_formats',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'process_mode',
                    displayName: 'process_mode',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'bypass_filter',
                    displayName: 'bypass_filter',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
            ],
            attemptToConvertTypes: false,
            convertFieldsToString: true,
        },
        options: {},
    };

    @node({
        id: '121a2c06-d6be-46b4-a502-bc72ed294b10',
        name: "Call 'Search Website (From Form)'",
        type: 'n8n-nodes-base.executeWorkflow',
        version: 1.3,
        position: [2064, 6000],
    })
    CallSearchWebsiteFromForm = {
        workflowId: {
            __rl: true,
            value: 'ycHkaKQLsL4xE1sD',
            mode: 'list',
            cachedResultUrl: '/workflow/ycHkaKQLsL4xE1sD',
            cachedResultName: 'Search Website (From Form)',
        },
        workflowInputs: {
            mappingMode: 'defineBelow',
            value: {
                id: '={{ $json.id }}',
                name: '={{ $json.name }}',
                url: '={{ $json.url }}',
                property_keyword_category: '={{ $json.property_keyword_category }}',
                property_priority: '={{ $json.property_priority }}',
                property_rss_feed: '={{ $json.property_rss_feed }}',
                property_source: '={{ $json.property_source }}',
                property_category: '={{ $json.property_category }}',
                property_url: '={{ $json.property_url }}',
                property_status: '={{ $json.property_status }}',
                property_name: '={{ $json.property_name }}',
                prompt: '={{ $json.prompt }} ',
                url_or_keyword: '={{ $json.url_or_keyword }}',
                source: '={{ $json.source }}',
                additional_formats: '={{ $json.additional_formats }}',
                process_mode: '={{ $json.process_mode }}',
                bypass_filter: '={{ $json.bypass_filter }}',
            },
            matchingColumns: [],
            schema: [
                {
                    id: 'id',
                    displayName: 'id',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'name',
                    displayName: 'name',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'url',
                    displayName: 'url',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'property_keyword_category',
                    displayName: 'property_keyword_category',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'property_priority',
                    displayName: 'property_priority',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'property_rss_feed',
                    displayName: 'property_rss_feed',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'property_source',
                    displayName: 'property_source',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'property_category',
                    displayName: 'property_category',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'property_url',
                    displayName: 'property_url',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'property_status',
                    displayName: 'property_status',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'property_name',
                    displayName: 'property_name',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'prompt',
                    displayName: 'prompt',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'url_or_keyword',
                    displayName: 'url_or_keyword',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'source',
                    displayName: 'source',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'additional_formats',
                    displayName: 'additional_formats',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'process_mode',
                    displayName: 'process_mode',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'bypass_filter',
                    displayName: 'bypass_filter',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
            ],
            attemptToConvertTypes: false,
            convertFieldsToString: true,
        },
        options: {},
    };

    @node({
        id: '7a20395c-a9ca-4e76-964d-b9a977d17124',
        name: "Call 'Search Twitter/X (Post and Keyword)'",
        type: 'n8n-nodes-base.executeWorkflow',
        version: 1.3,
        position: [2064, 6192],
    })
    CallSearchTwitterXPostAndKeyword = {
        workflowId: {
            __rl: true,
            value: 'zykTHDZ-r8op3Zitq25Y2',
            mode: 'list',
            cachedResultUrl: '/workflow/zykTHDZ-r8op3Zitq25Y2',
            cachedResultName: 'Search Twitter/X (Post and Keyword)',
        },
        workflowInputs: {
            mappingMode: 'defineBelow',
            value: {
                id: '={{ $json.id }}',
                name: '={{ $json.name }}',
                url: '={{ $json.url }}',
                property_keyword_category: '={{ $json.property_keyword_category }}',
                property_priority: '={{ $json.property_priority }}',
                property_rss_feed: '={{ $json.property_rss_feed }}',
                property_source: '={{ $json.property_source }}',
                property_category: '={{ $json.property_category }}',
                property_url: '={{ $json.property_url }}',
                property_status: '={{ $json.property_status }}',
                property_name: '={{ $json.property_name }}',
                prompt: '={{ $json.prompt }}',
                url_or_keyword: '={{ $json.url_or_keyword }}',
                source: '={{ $json.source }}',
                additional_formats: '={{ $json.additional_formats }}',
                process_mode: '={{ $json.process_mode }}',
                bypass_filter: '={{ $json.bypass_filter }}',
            },
            matchingColumns: [],
            schema: [
                {
                    id: 'id',
                    displayName: 'id',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'name',
                    displayName: 'name',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'url',
                    displayName: 'url',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'property_keyword_category',
                    displayName: 'property_keyword_category',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'property_priority',
                    displayName: 'property_priority',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'property_rss_feed',
                    displayName: 'property_rss_feed',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'property_source',
                    displayName: 'property_source',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'property_category',
                    displayName: 'property_category',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'property_url',
                    displayName: 'property_url',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'property_status',
                    displayName: 'property_status',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'property_name',
                    displayName: 'property_name',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'prompt',
                    displayName: 'prompt',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'url_or_keyword',
                    displayName: 'url_or_keyword',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'source',
                    displayName: 'source',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'additional_formats',
                    displayName: 'additional_formats',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'process_mode',
                    displayName: 'process_mode',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'bypass_filter',
                    displayName: 'bypass_filter',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
            ],
            attemptToConvertTypes: false,
            convertFieldsToString: true,
        },
        options: {},
    };

    @node({
        id: '5aac1619-2600-4aae-b0dc-a9a7cb74f436',
        name: "Call 'RSS Website Search (No RSS URL)'",
        type: 'n8n-nodes-base.executeWorkflow',
        version: 1.3,
        position: [2064, 4848],
    })
    CallRssWebsiteSearchNoRssUrl = {
        workflowId: {
            __rl: true,
            value: 'TYqzZiZzfuOwpnbZ',
            mode: 'list',
            cachedResultUrl: '/workflow/TYqzZiZzfuOwpnbZ',
            cachedResultName: 'RSS Website Search (No RSS URL)',
        },
        workflowInputs: {
            mappingMode: 'defineBelow',
            value: {
                prompt: '={{ $json.prompt }}',
                url_or_keyword: '={{ $json.url_or_keyword }}',
                source: '={{ $json.source }}',
                additional_formats: '={{ $json.additional_formats }}',
                process_mode: '={{ $json.process_mode }}',
                bypass_filter: '={{ $json.bypass_filter }}',
                id: '={{ $json.id }}',
                name: '={{ $json.name }}',
                url: '={{ $json.url }}',
                property_keyword_category: '={{ $json.property_keyword_category }}',
                property_priority: '={{ $json.property_priority }}',
                property_rss_feed: '={{ $json.property_rss_feed }}',
                property_source: '={{ $json.property_source }}',
                property_category: '={{ $json.property_category }}',
                property_url: '={{ $json.property_url }}',
                property_status: '={{ $json.property_status }}',
                property_name: '={{ $json.property_name }}',
            },
            matchingColumns: [],
            schema: [
                {
                    id: 'id',
                    displayName: 'id',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'name',
                    displayName: 'name',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'url',
                    displayName: 'url',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'property_keyword_category',
                    displayName: 'property_keyword_category',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'property_priority',
                    displayName: 'property_priority',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'property_rss_feed',
                    displayName: 'property_rss_feed',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'property_source',
                    displayName: 'property_source',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'property_category',
                    displayName: 'property_category',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'property_url',
                    displayName: 'property_url',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'property_status',
                    displayName: 'property_status',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'property_name',
                    displayName: 'property_name',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'prompt',
                    displayName: 'prompt',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'url_or_keyword',
                    displayName: 'url_or_keyword',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'source',
                    displayName: 'source',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'additional_formats',
                    displayName: 'additional_formats',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'process_mode',
                    displayName: 'process_mode',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'bypass_filter',
                    displayName: 'bypass_filter',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
            ],
            attemptToConvertTypes: false,
            convertFieldsToString: true,
        },
        options: {},
    };

    @node({
        id: 'dd0991f7-32f0-4f2b-9f2d-a508214a0b09',
        name: "Call 'RSS Website Search (With RSS URL)'",
        type: 'n8n-nodes-base.executeWorkflow',
        version: 1.3,
        position: [2064, 5040],
    })
    CallRssWebsiteSearchWithRssUrl = {
        workflowId: {
            __rl: true,
            value: 'iMG6XApQjSxVQxIe',
            mode: 'list',
            cachedResultUrl: '/workflow/iMG6XApQjSxVQxIe',
            cachedResultName: 'RSS Website Search (With RSS URL)',
        },
        workflowInputs: {
            mappingMode: 'defineBelow',
            value: {
                id: '={{ $json.id }}',
                name: '={{ $json.name }}',
                url: '={{ $json.url }}',
                property_keyword_category: '={{ $json.property_keyword_category }}',
                property_priority: '={{ $json.property_priority }}',
                property_rss_feed: '={{ $json.property_rss_feed }}',
                property_source: '={{ $json.property_source }}',
                property_category: '={{ $json.property_category }}',
                property_url: '={{ $json.property_url }}',
                property_status: '={{ $json.property_status }}',
                property_name: '={{ $json.property_name }}',
                prompt: '={{ $json.prompt }} ',
                url_or_keyword: '={{ $json.url_or_keyword }}',
                source: '={{ $json.source }}',
                additional_formats: '={{ $json.additional_formats }}',
                process_mode: '={{ $json.process_mode }}',
                bypass_filter: '={{ $json.bypass_filter }}',
            },
            matchingColumns: [],
            schema: [
                {
                    id: 'id',
                    displayName: 'id',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'name',
                    displayName: 'name',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'url',
                    displayName: 'url',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'property_keyword_category',
                    displayName: 'property_keyword_category',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'property_priority',
                    displayName: 'property_priority',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'property_rss_feed',
                    displayName: 'property_rss_feed',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'property_source',
                    displayName: 'property_source',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'property_category',
                    displayName: 'property_category',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'property_url',
                    displayName: 'property_url',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'property_status',
                    displayName: 'property_status',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'property_name',
                    displayName: 'property_name',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'prompt',
                    displayName: 'prompt',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'url_or_keyword',
                    displayName: 'url_or_keyword',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'source',
                    displayName: 'source',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'additional_formats',
                    displayName: 'additional_formats',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'process_mode',
                    displayName: 'process_mode',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
                {
                    id: 'bypass_filter',
                    displayName: 'bypass_filter',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    removed: false,
                },
            ],
            attemptToConvertTypes: false,
            convertFieldsToString: true,
        },
        options: {},
    };

    @node({
        id: '5f568fd4-4664-47fd-9afc-9dd989549deb',
        name: 'No RSS URL Available?',
        type: 'n8n-nodes-base.filter',
        version: 2.3,
        position: [1840, 4848],
    })
    NoRssUrlAvailable = {
        conditions: {
            options: {
                caseSensitive: true,
                leftValue: '',
                typeValidation: 'strict',
                version: 3,
            },
            conditions: [
                {
                    id: 'ede016ab-0777-432f-a844-717295d22232',
                    leftValue: '={{ $json.property_rss_feed }}',
                    rightValue: '',
                    operator: {
                        type: 'string',
                        operation: 'empty',
                        singleValue: true,
                    },
                },
            ],
            combinator: 'and',
        },
        options: {},
    };

    @node({
        id: 'a8d5cf74-7c76-460a-bf69-303cab44b415',
        webhookId: 'd98789a2-b2b3-4f8f-a4fb-e226aa1adb2e',
        name: 'Send a message1',
        type: 'n8n-nodes-base.slack',
        version: 2.3,
        position: [13088, 4896],
        credentials: { slackApi: { id: 'hndVCHiq0HgMBAh3', name: 'Stephen Slack account' } },
    })
    SendAMessage1 = {
        select: 'channel',
        channelId: {
            __rl: true,
            value: 'C09V1831FN2',
            mode: 'list',
            cachedResultName: 'syntech-n8n-error-tracker',
        },
        text: `= *Workflow Execution Error* ⚠️

- *Workflow Name:* News Sourcing Production (V2)
- *Error Node:* Add Content With Date
- *Error Message:* {{ $json.error }}
- *Timestamp:* {{ $now.toFormat('dd-MM-yyyy HH:mm:ss') }}
- *Issue:* News sourcing workflow skipped some news
- *Article:* 
Title: {{ $('Map Data for Notion1').item.json.title }}
Url: {{ $('Map Data for Notion1').item.json.url }}
Summary: {{ $('Map Data for Notion1').item.json.summary }}

*Next Steps:* Please review the workflow and retry the execution.
Workflow Execution: <https://syntech.granite-automations.app/workflow/{{ $workflow.id }}/executions/{{ $execution.id }}|View Execution>`,
        otherOptions: {
            includeLinkToWorkflow: false,
            unfurl_links: true,
        },
    };

    @node({
        id: 'ea3a9fbc-47f5-428d-8228-db989bba51ad',
        webhookId: 'd98789a2-b2b3-4f8f-a4fb-e226aa1adb2e',
        name: 'Send a message',
        type: 'n8n-nodes-base.slack',
        version: 2.3,
        position: [13088, 5280],
        credentials: { slackApi: { id: 'hndVCHiq0HgMBAh3', name: 'Stephen Slack account' } },
    })
    SendAMessage = {
        select: 'channel',
        channelId: {
            __rl: true,
            value: 'C09V1831FN2',
            mode: 'list',
            cachedResultName: 'syntech-n8n-error-tracker',
        },
        text: `= *Workflow Execution Error* ⚠️

- *Workflow Name:* News Sourcing Production (V2)
- *Error Node:* Add Content Without Date
- *Error Message:* {{ $json.error }}
- *Timestamp:* {{ $now.toFormat('dd-MM-yyyy HH:mm:ss') }}
- *Issue:* News sourcing workflow skipped some news
- *Article:* 
Title: {{ $('Map Data for Notion1').item.json.title }}
Url: {{ $('Map Data for Notion1').item.json.url }}
Summary: {{ $('Map Data for Notion1').item.json.summary }}

*Next Steps:* Please review the workflow and retry the execution.
Workflow Execution: <https://syntech.granite-automations.app/workflow/{{ $workflow.id }}/executions/{{ $execution.id }}|View Execution>`,
        otherOptions: {
            includeLinkToWorkflow: false,
            unfurl_links: true,
        },
    };

    @node({
        id: '0f7fae83-c8de-479f-98ff-f8a464627d10',
        webhookId: 'd98789a2-b2b3-4f8f-a4fb-e226aa1adb2e',
        name: 'Send a message2',
        type: 'n8n-nodes-base.slack',
        version: 2.3,
        position: [13760, 5504],
        credentials: { slackApi: { id: 'hndVCHiq0HgMBAh3', name: 'Stephen Slack account' } },
    })
    SendAMessage2 = {
        select: 'channel',
        channelId: {
            __rl: true,
            value: 'C09V1831FN2',
            mode: 'list',
            cachedResultName: 'syntech-n8n-error-tracker',
        },
        text: `= *Workflow Execution Error* ⚠️

- *Workflow Name:* News Sourcing Production (V2)
- *Error Node:* Add Content To Post
- *Error Message:* {{ $json.error }}
- *Timestamp:* {{ $now.toFormat('dd-MM-yyyy HH:mm:ss') }}
- *Article:* 
Title: {{ $('Map Data for Notion1').item.json.title }}
Url: {{ $('Map Data for Notion1').item.json.url }}
Summary: {{ $('Map Data for Notion1').item.json.summary }}

*Next Steps:* Please review the workflow and retry the execution.
Workflow Execution: <https://syntech.granite-automations.app/workflow/{{ $workflow.id }}/executions/{{ $execution.id }}|View Execution>`,
        otherOptions: {
            includeLinkToWorkflow: false,
            unfurl_links: true,
        },
    };

    @node({
        id: '160fd58e-1282-4f36-98c5-aef084d94b3f',
        webhookId: 'd98789a2-b2b3-4f8f-a4fb-e226aa1adb2e',
        name: 'Send a message3',
        type: 'n8n-nodes-base.slack',
        version: 2.3,
        position: [12416, 5952],
        credentials: { slackApi: { id: 'hndVCHiq0HgMBAh3', name: 'Stephen Slack account' } },
    })
    SendAMessage3 = {
        select: 'channel',
        channelId: {
            __rl: true,
            value: 'C09V1831FN2',
            mode: 'list',
            cachedResultName: 'syntech-n8n-error-tracker',
        },
        text: `= *Workflow Execution Error* ⚠️

- *Workflow Name:* News Sourcing Production (V2)
- *Error Node:* Add Content With Date1
- *Error Message:* {{ $json.error }}
- *Timestamp:* {{ $now.toFormat('dd-MM-yyyy HH:mm:ss') }}
- *Issue:* News sourcing workflow skipped some news
- *Article:* 
Title: {{ $('Map Data for Notion').item.json.title }}
Url: {{ $('Map Data for Notion').item.json.url }}
Summary: {{ $('Map Data for Notion').item.json.summary }}

*Next Steps:* Please review the workflow and retry the execution.
Workflow Execution: <https://syntech.granite-automations.app/workflow/{{ $workflow.id }}/executions/{{ $execution.id }}|View Execution>`,
        otherOptions: {
            includeLinkToWorkflow: false,
            unfurl_links: true,
        },
    };

    @node({
        id: 'db731d0d-abaa-4bd5-9aca-76bcb1e7bc09',
        name: 'Add Content With Date1',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.3,
        position: [12192, 5952],
        credentials: { notionApi: { id: 'k0ZwGrqySi9Wayf7', name: 'Stephen Notion account' } },
        onError: 'continueErrorOutput',
    })
    AddContentWithDate1 = {
        method: 'POST',
        url: 'https://api.notion.com/v1/pages',
        authentication: 'predefinedCredentialType',
        nodeCredentialType: 'notionApi',
        sendHeaders: true,
        headerParameters: {
            parameters: [
                {
                    name: 'Notion-Version',
                    value: '2025-09-03',
                },
            ],
        },
        sendBody: true,
        specifyBody: 'json',
        jsonBody: `={
  "parent": {
    "type": "database_id",
    "database_id": "27c785c0-cfab-8137-800f-dcf3e01a3e97"
  },
  "properties": {
    "Article Name": {
      "title": [
        {
          "text": {
            "content": "{{ $('Map Data for Notion').item.json.title }}"
          }
        }
      ]
    },
    "Publication Date": {
      "date": {
        "start": "{{ $('Map Data for Notion').item.json.publication_date }}"
      }
    },
    "Source URL": {
      "url": "{{ $('Map Data for Notion').item.json.url }}"
    },
    "Source": {
      "multi_select": [
        {
          "name": "{{ $('Map Data for Notion').item.json.source }}"
        }
      ]
    },
    "Source Name": {
      "rich_text": [
        {
          "text": {
            "content": "{{ $('Map Data for Notion').item.json.source_name }}"
          }
        }
      ]
    },
    "Status": {
      "select": {
        "name": "Not Reviewed"
      }
    },
    "Search Query": {
      "rich_text": [
        {
          "text": {
            "content": "{{ $('Map Data for Notion').item.json.search_query }}"
          }
        }
      ]
    },    
    "Summary": {
      "rich_text": [
        {
          "text": {
            "content": "{{ $('Map Data for Notion').item.json.summary }}"
          }
        }
      ]
    },
    "Own Analysis": {
      "rich_text": [
        {
          "text": {
            "content": "{{ $json.prompt }}"
          }
        }
      ]
    },
    "Fact Fingerprint": {
      "rich_text": [
        {
          "text": {
            "content": "{{ $json.fact_extraction }}"
          }
        }
      ]
    },
    "Topic Action": {
      "multi_select": [
        {
          "name": "{{ $('Map Data for Notion').item.json.topical_signature.topic_action }}"
        }
      ]
    },
    "Topic Entities": {
      "multi_select": [
          {{ $json.topical_signature.topic_entities }}
      ]
    },
    "Topic Geo": {
      "multi_select": [
        {
          "name": "{{ $json.topical_signature.topic_geo }}"
        }
      ]
    },
    "Topic Signature": {
      "rich_text": [
        {
          "text": {
            "content": "{{ $json.topical_signature.topic_signature }}"
          }
        }
      ]
    },
    "Topic Subject": {
      "rich_text": [
        {
          "text": {
            "content": "{{ $json.topical_signature.topic_subject }}"
          }
        }
      ]
    },
   "pathway": {
    "rich_text": [
      {
        "text": {
          "content": {{ $('Map Data for Notion').item.json.pathway.toJsonString() }}
        }
      }
    ]
  },
  "key_highlights": {
    "rich_text": [
      {
        "text": {
          "content": "{{ $('Map Data for Notion').item.json.key_highlights }}"
        }
      }
    ]
  },
  "strategic_summary": {
    "rich_text": [
      {
        "text": {
          "content": {{ $('Map Data for Notion').item.json.strategic_summary.toJsonString() }}
        }
      }
    ]
  },
  "recommended_action": {
    "rich_text": [
      {
        "text": {
          "content": {{ $('Map Data for Notion').item.json.recommended_action.toJsonString() }}
        }
      }
    ]
  },
  "active_scoring_components": {
    "rich_text": [
      {
        "text": {
          "content": {{ $('Map Data for Notion').item.json.active_scoring_components.toJsonString() }}
        }
      }
    ]
  },
  "priority_band": {
    "multi_select": [
      {
        "name": {{ $('Map Data for Notion').item.json.priority_band.toJsonString() }}
      }
    ]
  },
  "total_score": {
    "number": {{ $('Map Data for Notion').item.json.total_score }}
  },
    "Update Status": {
      "select": {
        "name": "{{ $json.classification }}"
      }
    },
    "Additional Formats": {
      "relation": [{{ $('Map Data for Notion').item.json.platform_prompts.map(item => \`{"id":"\${item}"}\`) }}]
    },
    "Choose Image Format": {
      "relation": [{{ $('Map Data for Notion').item.json.image_prompts.map(item => \`{"id":"\${item}"}\`) }}]
    }
  },
  "children": [
    {
      "object": "block",
      "type": "paragraph",
      "paragraph": {
        "rich_text": [
          {
            "text": {
              "content": {{ $json.content_remove_duplicate_node.toJsonString() }}
            }
          }
        ]
      }
    }
  ]
}
`,
        options: {},
    };

    @node({
        id: 'b176b14f-1c92-455d-949d-ff6990622cfe',
        webhookId: 'd98789a2-b2b3-4f8f-a4fb-e226aa1adb2e',
        name: 'Send a message4',
        type: 'n8n-nodes-base.slack',
        version: 2.3,
        position: [12416, 6144],
        credentials: { slackApi: { id: 'hndVCHiq0HgMBAh3', name: 'Stephen Slack account' } },
    })
    SendAMessage4 = {
        select: 'channel',
        channelId: {
            __rl: true,
            value: 'C09V1831FN2',
            mode: 'list',
            cachedResultName: 'syntech-n8n-error-tracker',
        },
        text: `= *Workflow Execution Error* ⚠️

- *Workflow Name:* News Sourcing Production (V2)
- *Error Node:* Add Content Without Date1
- *Error Message:* {{ $json.error }}
- *Timestamp:* {{ $now.toFormat('dd-MM-yyyy HH:mm:ss') }}
- *Issue:* News sourcing workflow skipped some news
- *Article:* 
Title: {{ $('Map Data for Notion').item.json.title }}
Url: {{ $('Map Data for Notion').item.json.url }}
Summary: {{ $('Map Data for Notion').item.json.summary }}

*Next Steps:* Please review the workflow and retry the execution.
Workflow Execution: <https://syntech.granite-automations.app/workflow/{{ $workflow.id }}/executions/{{ $execution.id }}|View Execution>`,
        otherOptions: {
            includeLinkToWorkflow: false,
            unfurl_links: true,
        },
    };

    @node({
        id: 'ba6c24f0-c172-4cd4-a438-654fea49d558',
        name: 'Add Content Without Date1',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.3,
        position: [12192, 6144],
        credentials: { notionApi: { id: 'k0ZwGrqySi9Wayf7', name: 'Stephen Notion account' } },
        onError: 'continueErrorOutput',
    })
    AddContentWithoutDate1 = {
        method: 'POST',
        url: 'https://api.notion.com/v1/pages',
        authentication: 'predefinedCredentialType',
        nodeCredentialType: 'notionApi',
        sendHeaders: true,
        headerParameters: {
            parameters: [
                {
                    name: 'Notion-Version',
                    value: '2025-09-03',
                },
            ],
        },
        sendBody: true,
        specifyBody: 'json',
        jsonBody: `={
  "parent": {
    "type": "database_id",
    "database_id": "27c785c0-cfab-8137-800f-dcf3e01a3e97"
  },
  "properties": {
    "Article Name": {
      "title": [
        {
          "text": {
            "content": "{{ $('Map Data for Notion').item.json.title }}"
          }
        }
      ]
    },
    "Source URL": {
      "url": "{{ $('Map Data for Notion').item.json.url }}"
    },
    "Source": {
      "multi_select": [
        {
          "name": "{{ $('Map Data for Notion').item.json.source }}"
        }
      ]
    },
    "Source Name": {
      "rich_text": [
        {
          "text": {
            "content": "{{ $('Map Data for Notion').item.json.source_name }}"
          }
        }
      ]
    },
    "Status": {
      "select": {
        "name": "Not Reviewed"
      }
    },
    "Search Query": {
      "rich_text": [
        {
          "text": {
            "content": "{{ $('Map Data for Notion').item.json.search_query }}"
          }
        }
      ]
    },
    "Summary": {
      "rich_text": [
        {
          "text": {
            "content": "{{ $('Map Data for Notion').item.json.summary }}"
          }
        }
      ]
    },
    "Own Analysis": {
      "rich_text": [
        {
          "text": {
            "content": "{{ $json.prompt }}"
          }
        }
      ]
    },
    "Fact Fingerprint": {
      "rich_text": [
        {
          "text": {
            "content": "{{ $json.fact_extraction }}"
          }
        }
      ]
    },
    "Topic Action": {
      "multi_select": [
        {
          "name": "{{ $('Map Data for Notion').item.json.topical_signature.topic_action }}"
        }
      ]
    },
    "Topic Entities": {
      "multi_select": [
        {
          "name": "{{ $('Map Data for Notion').item.json.topical_signature.topic_entities }}"
        }
      ]
    },
    "Topic Geo": {
      "multi_select": [
        {
          "name": "{{ $json.topical_signature.topic_geo }}"
        }
      ]
    },
    "Topic Signature": {
      "rich_text": [
        {
          "text": {
            "content": "{{ $json.topical_signature.topic_signature }}"
          }
        }
      ]
    },
    "Topic Subject": {
      "rich_text": [
        {
          "text": {
            "content": "{{ $json.topical_signature.topic_subject }}"
          }
        }
      ]
    },
    "pathway": {
    "rich_text": [
      {
        "text": {
          "content": {{ $('Map Data for Notion').item.json.pathway.toJsonString() }}
        }
      }
    ]
  },
  "key_highlights": {
    "rich_text": [
      {
        "text": {
          "content": "{{ $('Map Data for Notion').item.json.key_highlights }}"
        }
      }
    ]
  },
  "strategic_summary": {
    "rich_text": [
      {
        "text": {
          "content": {{ $('Map Data for Notion').item.json.strategic_summary.toJsonString() }}
        }
      }
    ]
  },
  "recommended_action": {
    "rich_text": [
      {
        "text": {
          "content": {{ $('Map Data for Notion').item.json.recommended_action.toJsonString() }}
        }
      }
    ]
  },
  "active_scoring_components": {
    "rich_text": [
      {
        "text": {
          "content": {{ $('Map Data for Notion').item.json.active_scoring_components.toJsonString() }}
        }
      }
    ]
  },
  "priority_band": {
    "multi_select": [
      {
        "name": {{ $('Map Data for Notion').item.json.priority_band.toJsonString() }}
      }
    ]
  },
  "total_score": {
    "number": {{ $('Map Data for Notion').item.json.total_score }}
  },
    "Update Status": {
      "select": {
        "name": "{{ $json.classification }}"
      }
    },
    "Additional Formats": {
      "relation": [{{ $('Map Data for Notion').item.json.platform_prompts.map(item => \`{"id":"\${item}"}\`) }}]
    },
    "Choose Image Format": {
      "relation": [{{ $('Map Data for Notion').item.json.image_prompts.map(item => \`{"id":"\${item}"}\`) }}]
    }
  },
  "children": [
    {
      "object": "block",
      "type": "paragraph",
      "paragraph": {
        "rich_text": [
          {
            "text": {
              "content": {{ $json.content_remove_duplicate_node.toJsonString() }}
            }
          }
        ]
      }
    }
  ]
}
`,
        options: {},
    };

    @node({
        id: '775553b6-5694-48cf-b9ad-3fb8ae75bb8a',
        webhookId: 'd98789a2-b2b3-4f8f-a4fb-e226aa1adb2e',
        name: 'Send a message5',
        type: 'n8n-nodes-base.slack',
        version: 2.3,
        position: [11744, 6272],
        credentials: { slackApi: { id: 'hndVCHiq0HgMBAh3', name: 'Stephen Slack account' } },
    })
    SendAMessage5 = {
        select: 'channel',
        channelId: {
            __rl: true,
            value: 'C09V1831FN2',
            mode: 'list',
            cachedResultName: 'syntech-n8n-error-tracker',
        },
        text: `= *Workflow Execution Error* ⚠️

- *Workflow Name:* News Sourcing Production (V2)
- *Error Node:* Filter Articles By Topic
- *Error Message:* {{ $json.error }}
- *Timestamp:* {{ $now.toFormat('dd-MM-yyyy HH:mm:ss') }}
- *Article:*
Title: {{ $json.title }}
Url:{{ $json.url }}
Summary: {{ $json.summary }}

*Next Steps:* Please review the workflow and retry the execution.
Workflow Execution: <https://syntech.granite-automations.app/workflow/{{ $workflow.id }}/executions/{{ $execution.id }}|View Execution>`,
        otherOptions: {
            includeLinkToWorkflow: false,
            unfurl_links: true,
        },
    };

    @node({
        id: '713a12ed-d2f3-4b91-b1bf-c863c0b93cc8',
        webhookId: 'd98789a2-b2b3-4f8f-a4fb-e226aa1adb2e',
        name: 'Send a message6',
        type: 'n8n-nodes-base.slack',
        version: 2.3,
        position: [11968, 5488],
        credentials: { slackApi: { id: 'hndVCHiq0HgMBAh3', name: 'Stephen Slack account' } },
    })
    SendAMessage6 = {
        select: 'channel',
        channelId: {
            __rl: true,
            value: 'C09V1831FN2',
            mode: 'list',
            cachedResultName: 'syntech-n8n-error-tracker',
        },
        text: `= *Workflow Execution Error* ⚠️

- *Workflow Name:* News Sourcing Production (V2)
- *Error Node:* Filter Articles By Topic1
- *Error Message:* {{ $json.error }}
- *Timestamp:* {{ $now.toFormat('dd-MM-yyyy HH:mm:ss') }}
- *Article:*
Title: {{ $json.title }}
Url:{{ $json.url }}
Summary: {{ $json.summary }}

*Next Steps:* Please review the workflow and retry the execution.
Workflow Execution: <https://syntech.granite-automations.app/workflow/{{ $workflow.id }}/executions/{{ $execution.id }}|View Execution>`,
        otherOptions: {
            includeLinkToWorkflow: false,
            unfurl_links: true,
        },
    };

    @node({
        id: 'eeb7bb23-4d86-455e-b1c9-5424b96ecd2c',
        name: 'Sonnet 4.5 T0.6',
        type: '@n8n/n8n-nodes-langchain.lmChatAnthropic',
        version: 1.3,
        position: [6832, 5536],
        credentials: { anthropicApi: { id: '0c1nNLaJWpeD3Cqz', name: 'Syntech GM Anthropic account' } },
    })
    Sonnet45T06 = {
        model: {
            __rl: true,
            value: 'claude-sonnet-4-5-20250929',
            mode: 'list',
            cachedResultName: 'Claude Sonnet 4.5',
        },
        options: {
            temperature: 0,
        },
    };

    @node({
        id: '5a7b317c-e8f4-41e9-84a9-869e2e34f1c2',
        name: 'Anthropic Chat Model6',
        type: '@n8n/n8n-nodes-langchain.lmChatAnthropic',
        version: 1.3,
        position: [4576, 5552],
        credentials: { anthropicApi: { id: '0c1nNLaJWpeD3Cqz', name: 'Syntech GM Anthropic account' } },
    })
    AnthropicChatModel6 = {
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
        id: 'a5887b9e-f01e-4e67-b08a-25f955de8d24',
        name: 'Anthropic Chat Model7',
        type: '@n8n/n8n-nodes-langchain.lmChatAnthropic',
        version: 1.3,
        position: [5136, 5536],
        credentials: { anthropicApi: { id: '0c1nNLaJWpeD3Cqz', name: 'Syntech GM Anthropic account' } },
    })
    AnthropicChatModel7 = {
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
        id: '75887b74-ab06-4e22-9d73-c6c5fd6cca9d',
        name: 'Anthropic Chat Model8',
        type: '@n8n/n8n-nodes-langchain.lmChatAnthropic',
        version: 1.3,
        position: [5856, 5360],
        credentials: { anthropicApi: { id: '0c1nNLaJWpeD3Cqz', name: 'Syntech GM Anthropic account' } },
    })
    AnthropicChatModel8 = {
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
        id: 'a1f994da-e8c0-4aff-baf7-e7fa0ed104d9',
        name: 'Sticky Note13',
        type: 'n8n-nodes-base.stickyNote',
        version: 1,
        position: [4512, 4848],
    })
    StickyNote13 = {
        content: `## Stage 1
PURPOSE: Block petroleum/natural gas content with no biofuel component
DECISION: PASS or REJECT

AUTO-PASS if ANY of these present:
✓ Biofuel keywords (HVO, B100, UCO, biodiesel, SAF, etc.)
✓ VIP keywords (Lower Thames Crossing, Balfour Beatty, SSE, NetZero Teesside)
✓ Policy/market forces (government budget, public procurement + construction/energy context)

REJECT if:
✗ Fossil fuel ONLY (petroleum, LNG, coal with NO biofuel component)
✗ No VIP keywords
✗ No downstream policy effects

OUTPUT: decision (PASS/REJECT), biofuel_keywords_found, reason`,
        height: 848,
        width: 560,
    };

    @node({
        id: '8a283ef6-145f-4695-9da8-967e089e8c1a',
        name: 'Sticky Note14',
        type: 'n8n-nodes-base.stickyNote',
        version: 1,
        position: [5104, 4848],
    })
    StickyNote14 = {
        content: `## Stage 2
PURPOSE: Auto-pass strategic clients/projects regardless of biofuel focus
DECISION: VIP_PASS (+2 baseline) or CONTINUE (0 baseline)

VIP_PASS if:
✓ Article is ABOUT VIP entity (Lower Thames Crossing, Balfour Beatty, SSE, NetZero Teesside)
✓ VIP entity is primary subject, not just mentioned in passing

CONTINUE if:
✓ VIP mentioned but article not primarily about them
✓ No VIP keywords detected

VIP BYPASS: VIP_PASS articles skip Stage 3 (density check) and go directly to Stage 4

OUTPUT: decision (VIP_PASS/CONTINUE), vip_entity, baseline_points (2 or 0), context`,
        height: 848,
        width: 656,
    };

    @node({
        id: '6f7f0b07-6dbf-47a7-bc01-72c0b39edc15',
        name: 'Sticky Note15',
        type: 'n8n-nodes-base.stickyNote',
        version: 1,
        position: [5824, 4480],
    })
    StickyNote15 = {
        content: `## Stage 3
PURPOSE: Ensure article has sufficient biofuel focus (60%+ keyword density)
DECISION: PASS or REJECT

PASS if:
✓ Biofuel keywords in ≥60% of article content (sentence/paragraph count)
✓ OR downstream effect exception triggered

DOWNSTREAM EXCEPTIONS (auto-pass even if <60% density):
✓ Biofuel policy/regulation
✓ Government budgets/procurement (construction/infrastructure + decarbonization context)
✓ Market forces affecting biofuel economics
✓ Infrastructure developments supporting biofuels
✓ Industry decarbonization commitments
✓ Adoption success stories

REJECT if:
✗ <60% density AND no downstream effect

NOTE: VIP articles bypass this stage entirely

OUTPUT: decision (PASS/REJECT), density_score (%), keywords_found, downstream_effect (true/false)`,
        height: 1088,
        width: 944,
    };

    @node({
        id: '5d1817e9-3b03-44bd-b781-281181fe7e14',
        name: 'Sticky Note16',
        type: 'n8n-nodes-base.stickyNote',
        version: 1,
        position: [6800, 4304],
    })
    StickyNote16 = {
        content: `## Stage 4
PURPOSE: Assign 0-10 points based on strategic value to Syntech
DECISION: SCORE (0-10) + threshold check (≥2 = surface to client)

SCORING COMPONENTS (max 10 points):
1. Topical Relevance (0-3): How focused article is on biofuels
2. Market Indicators (0-3): Concrete developments signaling adoption growth
3. OEM Validation (0-3): Equipment manufacturers testing/deploying biofuels
4. Adoption Success Stories (0-2): Real-world case studies proving viability
5. Strategic Context (0-1): UK focus, target sectors, waste feedstock, competitor intel

PLUS: VIP Baseline (+2 if VIP_PASS from Stage 2)

PRIORITY BANDS:
🔴 8-10 points = MUST-READ (immediate priority)
🟠 5-7 points = STRONG INTEREST (review soon)
🟡 2-4 points = MARGINAL (quick review - surfaces to client)
⚫ 0-1 points = REJECT (don't surface)

THRESHOLD: ≥2 points surfaces to client (making it "leaky" per client request)

ADJUSTMENTS:
- Geographic: -1 if international without UK connection
- Adoption vs Announcement: -1 to -2 if announcement/business move rather than actual deployment

OUTPUT: final_score, threshold_met (true/false), priority_band, scoring_breakdown, 
        strategic_summary, key_highlights, recommended_action`,
        height: 1600,
        width: 864,
    };

    @node({
        id: '459fe455-d764-4f96-9805-54f8c37fbdd5',
        name: 'Get 100 best articles',
        type: 'n8n-nodes-base.limit',
        version: 1,
        position: [8432, 5072],
    })
    Get100BestArticles = {
        maxItems: 100,
    };

    @node({
        id: '36ad7add-123b-4678-b744-2002d5e8b664',
        name: 'Structured Output Parser2',
        type: '@n8n/n8n-nodes-langchain.outputParserStructured',
        version: 1.3,
        position: [7152, 5552],
        retryOnFail: true,
        waitBetweenTries: 5000,
    })
    StructuredOutputParser2 = {
        jsonSchemaExample: `{
  "pathway": "A",
  
  "scoring_breakdown": {
    "pathway_a": {
      "fuel_type_gate": {
        "points": 2,
        "passed": true,
        "evidence": "Waste-derived HVO from UCO"
      },
      "substance_gate": {
        "passed": true,
        "specific_adoption": "WOMADelaide festival uses B100 and HVO",
        "measurable_data": "90% GHG reduction vs diesel",
        "proof_progress": "Off-grid power adoption in events sector"
      },
      "operational_deployment": {
        "points": 3,
        "evidence": "Festival powering all stages with B100/HVO"
      },
      "technology_validation": {
        "points": 3,
        "evidence": "90% GHG reduction - quantified proof"
      },
      "sales_opportunity": {
        "points": 0,
        "evidence": null
      },
      "market_intelligence": {
        "points": 0,
        "evidence": null
      },
      "oem_breakthrough": {
        "points": 0,
        "evidence": null
      },
      "strategic_relevance": {
        "points": 1,
        "evidence": "Off-grid power application, waste feedstock"
      }
    },
    
    "pathway_b": {
      "vip_confirmation": null,
      "project_scale": {
        "points": 0,
        "evidence": null
      },
      "timeline_urgency": {
        "points": 0,
        "evidence": null
      },
      "decarbonization_commitment": {
        "points": 0,
        "evidence": null
      },
      "strategic_positioning": {
        "points": 0,
        "evidence": null
      }
    },
    
    "pathway_c": {
      "policy_scale": {
        "points": 0,
        "evidence": null
      },
      "timeline_implementation": {
        "points": 0,
        "evidence": null
      },
      "syntech_alignment": {
        "points": 0,
        "evidence": null
      },
      "market_opportunity": {
        "points": 0,
        "evidence": null
      }
    }
  },
  
  "strategic_summary": "WOMADelaide demonstrates B100/HVO viability for off-grid power at scale",
  "key_highlights": [
    "First SA festival using 100% renewable energy",
    "B100 and HVO from UCO achieving 90% GHG reduction",
    "Validates off-grid power application"
  ],
  "recommended_action": "Monitor events sector as potential new market vertical"
}`,
        autoFix: true,
    };

    @node({
        id: 'cadc7580-285d-4422-9be7-6b318d48e51b',
        name: 'Structured Output Parser24',
        type: '@n8n/n8n-nodes-langchain.outputParserStructured',
        version: 1.3,
        position: [4928, 5568],
    })
    StructuredOutputParser24 = {
        jsonSchemaExample: `{
  "decision": "PASS",
  "reason": "Article mentions biofuels/renewable diesel",
  "biofuel_keywords_found": ["HVO", "renewable diesel"]
}`,
    };

    @node({
        id: '0656c631-e448-4a71-9833-5ffca62ca976',
        name: 'Structured Output Parser25',
        type: '@n8n/n8n-nodes-langchain.outputParserStructured',
        version: 1.3,
        position: [-304, 6416],
    })
    StructuredOutputParser25 = {
        jsonSchemaExample: `{
  "decision": "CONTINUE",
  "reason": "VIP entity mentioned but article not primarily about them",
  "vip_mentioned": "Lower Thames Crossing",
  "context": "Listed among 100 projects in industry roundup",
  "note": "Proceed to Stage 3 for biofuel density check"
}`,
    };

    @node({
        id: '078b6e86-8942-484b-a71a-edd9deef84d6',
        name: 'Structured Output Parser26',
        type: '@n8n/n8n-nodes-langchain.outputParserStructured',
        version: 1.3,
        position: [6192, 5360],
    })
    StructuredOutputParser26 = {
        jsonSchemaExample: `{
  "pathway": "A",
  "confidence": "high",
  "reasoning": "UCO feedstock pricing headline indicates actionable market intelligence",
  "keywords_detected": ["UCO", "feedstocks", "CIF ARA"]
}`,
    };

    @node({
        id: 'c6a7b1a2-4b92-4f8c-9e21-5a8d8e3e7a10',
        name: 'Structured Output Parser27',
        type: '@n8n/n8n-nodes-langchain.outputParserStructured',
        version: 1.3,
        position: [7024, 5024],
    })
    StructuredOutputParser27 = {
        jsonSchemaExample: `{
  "pathway": "D",
  "decision": "SURFACE",
  "vertical": "Expert",
  "content_type": "research_paper",
  "topic_summary": "One sentence describing what this content is about",
  "syntech_relevance": "Brief note on any connection to biofuels, decarbonisation, or Syntech's sectors — or null if none",
  "key_highlights": [
    "First notable point from the content",
    "Second notable point if present",
    "Third notable point if present"
  ]
}`,
        autoFix: true,
    };

    @node({
        id: 'cdc13bb0-783e-46bf-8380-eaeeeff1ce0c',
        name: "Call 'Search Google Syntech'",
        type: 'n8n-nodes-base.executeWorkflow',
        version: 1.3,
        position: [2064, 5424],
        onError: 'continueRegularOutput',
    })
    CallSearchGoogleSyntech = {
        workflowId: {
            __rl: true,
            value: 'LD5_Lrj2Q4hN9kpTCWyxC',
            mode: 'list',
            cachedResultUrl: '/workflow/LD5_Lrj2Q4hN9kpTCWyxC',
            cachedResultName: 'Search Google Syntech',
        },
        workflowInputs: {
            mappingMode: 'defineBelow',
            value: {
                id: '={{ $json.id }}',
                name: '={{ $json.name }}',
                url: '={{ $json.url }}',
                property_keyword_category: '={{ $json.property_keyword_category }}',
                property_priority: '={{ $json.property_priority }}',
                property_rss_feed: '={{ $json.property_rss_feed }}',
                property_source: '={{ $json.property_source }}',
                property_category: '={{ $json.property_category }}',
                property_url: '={{ $json.property_url }}',
                property_status: '={{ $json.property_status }}',
                property_name: '={{ $json.property_name }}',
                prompt: '={{ $json.prompt }}',
                bypass_filter: '={{ $json.bypass_filter }}',
                process_mode: '={{ $json.process_mode }}',
                additional_formats: '={{ $json.additional_formats }}',
                source: '={{ $json.source }}',
                url_or_keyword: '={{ $json.url_or_keyword }}',
            },
            matchingColumns: [],
            schema: [
                {
                    id: 'id',
                    displayName: 'id',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                },
                {
                    id: 'name',
                    displayName: 'name',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                },
                {
                    id: 'url',
                    displayName: 'url',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                },
                {
                    id: 'property_keyword_category',
                    displayName: 'property_keyword_category',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                },
                {
                    id: 'property_priority',
                    displayName: 'property_priority',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                },
                {
                    id: 'property_rss_feed',
                    displayName: 'property_rss_feed',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                },
                {
                    id: 'property_source',
                    displayName: 'property_source',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                },
                {
                    id: 'property_category',
                    displayName: 'property_category',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                },
                {
                    id: 'property_url',
                    displayName: 'property_url',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                },
                {
                    id: 'property_status',
                    displayName: 'property_status',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                },
                {
                    id: 'property_name',
                    displayName: 'property_name',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                },
                {
                    id: 'prompt',
                    displayName: 'prompt',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                },
                {
                    id: 'url_or_keyword',
                    displayName: 'url_or_keyword',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                },
                {
                    id: 'source',
                    displayName: 'source',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                },
                {
                    id: 'additional_formats',
                    displayName: 'additional_formats',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                },
                {
                    id: 'process_mode',
                    displayName: 'process_mode',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                },
                {
                    id: 'bypass_filter',
                    displayName: 'bypass_filter',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                },
            ],
            attemptToConvertTypes: false,
            convertFieldsToString: true,
        },
        mode: 'each',
        options: {},
    };

    @node({
        id: '8d7e2b14-5a9c-4f61-9b28-7c3e5d6a4b9f',
        name: 'Classify via Relevance Service',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.3,
        position: [5088, 5328],
        credentials: { httpBearerAuth: { id: 'rTkgjtU8QIYs0nXm', name: 'Syntech Relevance Classifier Bearer' } },
        onError: 'continueErrorOutput',
        retryOnFail: true,
        maxTries: 3,
        waitBetweenTries: 5000,
    })
    ClassifyViaRelevanceService = {
        method: 'POST',
        url: 'https://syntech-biofuel-relevance-classifier-production.up.railway.app/classify',
        authentication: 'predefinedCredentialType',
        nodeCredentialType: 'httpBearerAuth',
        sendHeaders: true,
        headerParameters: {
            parameters: [
                {
                    name: 'Content-Type',
                    value: 'application/json',
                },
                {
                    name: 'X-Request-Id',
                    value: '={{ $execution.id }}-{{ $itemIndex }}',
                },
            ],
        },
        sendBody: true,
        specifyBody: 'json',
        jsonBody: `={
            "title":            {{ JSON.stringify($('Deduplicated Articles').item.json.title) }},
            "content":          {{ JSON.stringify($('Deduplicated Articles').item.json.content) }},
            "url":               {{ JSON.stringify($('Deduplicated Articles').item.json.url) }},
            "source":           {{ JSON.stringify($('Deduplicated Articles').item.json.source) }},
            "source_category":  {{ JSON.stringify($('Deduplicated Articles').item.json.source_category || "") }},
            "summary":          {{ JSON.stringify($('Deduplicated Articles').item.json.summary || "") }}
        }`,
        options: {
            timeout: 15000,
            response: {
                response: {
                    responseFormat: 'json',
                },
            },
        },
    };

    @node({
        id: 'de16c7e4-12ec-47c4-a419-f4dde2ace718',
        name: 'Perform Final Calculation',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [7760, 5328],
    })
    PerformFinalCalculation = {
        mode: 'runOnceForEachItem',
        jsCode: `// Flatten the microservice envelope so downstream references
// (e.g. $('Perform Final Calculation').item.json.threshold_met) keep working
// without edits. The service returns { "analysis": {...} }; every field the
// legacy code node emitted at root now lives under .analysis.
// (TODO: remove this flatten when Notion mappers migrate to reading .analysis.*
// directly — tracked in docs/solutions/2026-n8n-to-microservice-cutover.md.)
return $input.first().json.analysis;`,
    };

    @node({
        id: '1a6b7e45-dddc-4ee3-9013-0ff868844676',
        name: 'Limit 16 Items',
        type: 'n8n-nodes-base.limit',
        version: 1,
        position: [1840, 5424],
    })
    Limit16Items = {
        maxItems: 100,
    };

    @node({
        id: '6397c51a-1f48-4318-8e15-dc74fa3d8a75',
        name: 'Anthropic Chat Model2',
        type: '@n8n/n8n-nodes-langchain.lmChatAnthropic',
        version: 1.3,
        position: [5344, 5760],
        credentials: { anthropicApi: { id: '0c1nNLaJWpeD3Cqz', name: 'Syntech GM Anthropic account' } },
    })
    AnthropicChatModel2 = {
        model: {
            __rl: true,
            value: 'claude-haiku-4-5-20251001',
            mode: 'list',
            cachedResultName: 'Claude Haiku 4.5',
        },
        options: {},
    };

    @node({
        id: '957a5dcf-666d-4658-bf11-16347a61221c',
        name: 'Structured Output Parser',
        type: '@n8n/n8n-nodes-langchain.outputParserStructured',
        version: 1.3,
        position: [5456, 5552],
    })
    StructuredOutputParser = {
        jsonSchemaExample: `{
  "decision": "VIP_PASS",
  "vip_entity": "Balfour Beatty",
  "baseline_points": 5,
  "reasoning": "Article is about Balfour Beatty's contract win. decision may also be CONTINUE or PATHWAY_D; vip_entity may be any of Balfour Beatty, SSE, Lower Thames Crossing, NetZero Teesside, Sizewell C, National Highways, Highland Fuels, Falkirk Council, A9 Duelling, Highland Council, Transport for London, Sunbelt Rentals, or null."
}`,
        autoFix: true,
    };

    @node({
        id: 'cfd3ef4a-d61c-48b0-9b2d-deac0398e6ef',
        name: 'Threshold Met?',
        type: 'n8n-nodes-base.if',
        version: 2.3,
        position: [7984, 5328],
    })
    ThresholdMet = {
        conditions: {
            options: {
                caseSensitive: true,
                leftValue: '',
                typeValidation: 'strict',
                version: 3,
            },
            conditions: [
                {
                    id: 'a2276983-29bb-4082-853d-554d417df7fd',
                    leftValue: "={{ $('Perform Final Calculation').item.json.threshold_met }}",
                    rightValue: '',
                    operator: {
                        type: 'boolean',
                        operation: 'true',
                        singleValue: true,
                    },
                },
            ],
            combinator: 'and',
        },
        options: {},
    };

    @node({
        id: 'a115a15f-546f-4aa3-a852-b023f8b79d92',
        name: 'select fields1',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [8208, 5408],
    })
    SelectFields1 = {
        assignments: {
            assignments: [
                {
                    id: '9a8264bf-82d2-434f-b146-3b8deb76e519',
                    name: 'title',
                    value: "={{ $('Deduplicated Articles').item.json.title }}",
                    type: 'string',
                },
                {
                    id: 'dfdf1695-e69f-4cff-a8f0-21d9da07745b',
                    name: 'content',
                    value: "={{ ($('Deduplicated Articles').item.json.content || '').substring(0, 49000) }}",
                    type: 'string',
                },
                {
                    id: '4899f665-2f29-41df-afea-d8a744a6fec9',
                    name: 'url',
                    value: "={{ $('Deduplicated Articles').item.json.url }}",
                    type: 'string',
                },
                {
                    id: 'ec8500c3-9d57-45d3-b1a9-2de1706dee8d',
                    name: 'summary',
                    value: "={{ $('Deduplicated Articles').item.json.summary }}",
                    type: 'string',
                },
                {
                    id: '0c470796-e8e2-4605-a6af-9e8236d9635c',
                    name: 'search_query',
                    value: "={{ $('Deduplicated Articles').item.json.search_query }}",
                    type: 'string',
                },
                {
                    id: '4d34103a-b327-42cc-8e50-dec38a8fc1f5',
                    name: 'publication_date',
                    value: "={{ $('Deduplicated Articles').item.json.publication_date }}",
                    type: 'string',
                },
                {
                    id: '02065b1c-286c-4cf9-8709-27d8a766d2d1',
                    name: 'prompt',
                    value: "={{ $('Deduplicated Articles').item.json.prompt }}",
                    type: 'string',
                },
                {
                    id: 'ef20184c-2ce1-4660-9658-fe12f9776f2d',
                    name: 'additional_formats',
                    value: "={{ $('Deduplicated Articles').item.json.additional_formats }}",
                    type: 'string',
                },
                {
                    id: '5a5e80cb-0ad3-4e06-86f8-63e9e59765fd',
                    name: 'source',
                    value: "={{ $('Deduplicated Articles').item.json.source }}",
                    type: 'string',
                },
                {
                    id: 'f3e017bd-5f4f-4265-ba02-9280077f42a6',
                    name: 'source_name',
                    value: "={{ $('Deduplicated Articles').item.json.source_name }}",
                    type: 'string',
                },
                {
                    id: '61574df1-c16c-42df-9b9b-ebe428bd7eae',
                    name: 'mode',
                    value: "={{ $('Deduplicated Articles').item.json.mode }}",
                    type: 'string',
                },
                {
                    id: 'd8061e59-9f62-4596-9a93-0346f90b0ea7',
                    name: 'analysis',
                    value: '={{ $json }}',
                    type: 'object',
                },
            ],
        },
        options: {},
    };

    @node({
        id: '8ec9dfd7-e3bc-443b-a168-f2c465bfaa81',
        name: 'Map Data for Notion2',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [-304, 6624],
    })
    MapDataForNotion2 = {
        assignments: {
            assignments: [
                {
                    id: '60beb5e2-6383-409b-8c39-19c9941d0611',
                    name: 'title',
                    value: "={{ $('Remove Duplicates').item.json.title }}",
                    type: 'string',
                },
                {
                    id: '75e5203c-7fc8-45d1-9aaf-ac3feca9998f',
                    name: 'publication_date',
                    value: `={{
(() => {
  const raw = $('Merge').item.json.publication_date;
  if (!raw || typeof raw !== 'string') return 'NA';

  let dt;

  dt = DateTime.fromISO(raw, { zone: 'utc' });
  if (dt.isValid) return dt.toISO();

  dt = DateTime.fromRFC2822(raw, { zone: 'utc' });
  if (dt.isValid) return dt.toISO();

  dt = DateTime.fromHTTP(raw, { zone: 'utc' });
  if (dt.isValid) return dt.toISO();

  const formats = [
    'ccc LLL dd HH:mm:ss Z yyyy',
    'yyyy-MM-dd HH:mm:ss',
    'yyyy/MM/dd HH:mm:ss',
    'dd/MM/yyyy HH:mm:ss',
    'dd-MM-yyyy HH:mm:ss',
    'yyyy-MM-dd',
    'dd/MM/yyyy',
    'MM/dd/yyyy'
  ];

  for (const f of formats) {
    dt = DateTime.fromFormat(raw, f, { zone: 'utc' });
    if (dt.isValid) return dt.toISO();
  }

  const jsDate = new Date(raw);
  if (!isNaN(jsDate)) {
    return DateTime.fromJSDate(jsDate, { zone: 'utc' }).toISO();
  }

  return 'NA';
})()
}}`,
                    type: 'string',
                },
                {
                    id: 'cda65c46-ca98-4d3b-94a5-8efa8468a5c5',
                    name: 'url',
                    value: "={{ $('Remove Duplicates').item.json.url ? $('Remove Duplicates').item.json.url?.trim() : \"NA\" }}",
                    type: 'string',
                },
                {
                    id: '2eaf0819-96c5-43f9-8bfe-60020f39a7da',
                    name: 'source',
                    value: "={{ $('Merge').item.json.source ? $('Merge').item.json.source : \"NA\" }}",
                    type: 'string',
                },
                {
                    id: '96dab174-e8ef-4c01-8047-a56813c50f76',
                    name: 'source_name',
                    value: "={{ $('Merge').item.json.source_name }}",
                    type: 'string',
                },
                {
                    id: '48f2ac2b-de0b-47f6-9b56-f5d231119533',
                    name: 'search_query',
                    value: "={{ $('Merge').item.json.search_query ? $('Merge').item.json.search_query?.trim() : \"NA\"}}",
                    type: 'string',
                },
                {
                    id: 'a6d31903-9b90-4a94-bd31-865b362b41ec',
                    name: 'summary',
                    value: "={{ $('Merge').item.json.summary ? $('Merge').item.json.summary : \"NA\"}}",
                    type: 'string',
                },
                {
                    id: 'af126fa8-eb15-4598-baaf-d6ac11c76a21',
                    name: 'prompt',
                    value: "={{ $if($('Merge').isExecuted, $('Merge').item.json.prompt || '' , '') }}",
                    type: 'string',
                },
                {
                    id: '2570abdd-fc3f-43b7-81f8-ffe0e871cc73',
                    name: 'fact_extraction',
                    value: "={{ $('Filter Articles By Topic').isExecuted ? $('Filter Articles By Topic').item.json.fact_extraction.toJsonString().replace(/\"/g, '\\\\\"') : \"NA\"}}",
                    type: 'string',
                },
                {
                    id: '34694247-0e3f-4da5-8f8f-91baa3121149',
                    name: 'topical_signature.topic_action',
                    value: "={{ $('Filter Articles By Topic').isExecuted ? $('Filter Articles By Topic').item.json.topical_signature.topic_action : \"NA\"}}",
                    type: 'string',
                },
                {
                    id: '7e0ce80d-80be-4c32-9bd7-82f65bfde025',
                    name: 'topical_signature.topic_entities',
                    value: `={{ $('Filter Articles By Topic').isExecuted ? $('Filter Articles By Topic').item.json.topical_signature.topic_entities.map(item =>
      \`{
          "name": "\${item}"
        }\`) : NA }}`,
                    type: 'array',
                },
                {
                    id: 'dc6e0e34-409e-4359-8dfc-9eac487c5096',
                    name: 'topical_signature.topic_geo',
                    value: "={{ $('Filter Articles By Topic').isExecuted ? $('Filter Articles By Topic').item.json.topical_signature.topic_geo : \"NA\"}}",
                    type: 'string',
                },
                {
                    id: '2da15c35-1446-438b-9999-f428288dbe21',
                    name: 'topical_signature.topic_signature',
                    value: "={{ $('Filter Articles By Topic').isExecuted ? $('Filter Articles By Topic').item.json.topical_signature.topic_signature : \"NA\"}}",
                    type: 'string',
                },
                {
                    id: '798291f1-bf55-4c9a-a562-13a40d8cf312',
                    name: 'topical_signature.topic_subject',
                    value: "={{ $('Filter Articles By Topic').isExecuted ? $('Filter Articles By Topic').item.json.topical_signature.topic_subject : \"NA\"}}",
                    type: 'string',
                },
                {
                    id: 'f7ebaccb-ca0b-4c45-81aa-fa046b46b005',
                    name: 'classification',
                    value: "={{ $('Filter Articles By Topic').isExecuted ? $('Filter Articles By Topic').item.json.classification : \"new\"}}",
                    type: 'string',
                },
                {
                    id: 'c6c89504-6855-44af-a0d8-fdc3c12c79dc',
                    name: 'content_remove_duplicate_node',
                    value: `={{ 
  ($('Remove Duplicates').item.json.content ?? '')
    .replace(/\\\\/g, '\\\\\\\\')
    .replace(/"/g, '\\\\"')
    .replace(/\\n/g, '\\\\n')
}}`,
                    type: 'string',
                },
                {
                    id: '8edde5a6-1960-4492-ab89-aceaedc23df5',
                    name: 'topical_relevance_reasoning',
                    value: "={{ $('Check Sources Executed').item.json.analysis.scoring_breakdown.topical_relevance.reasoning }}",
                    type: 'string',
                },
                {
                    id: '6325c336-b8c1-4be4-9258-94804e8481f6',
                    name: 'market_indicators',
                    value: "={{ $('Check Sources Executed').item.json.analysis.scoring_breakdown.market_indicators.reasoning }}",
                    type: 'string',
                },
                {
                    id: 'f070672c-d7ee-46c0-a9dd-25cd504586fa',
                    name: 'oem_validation',
                    value: "={{ $('Check Sources Executed').item.json.analysis.scoring_breakdown.oem_validation.reasoning }}",
                    type: 'string',
                },
                {
                    id: '66fcc916-4a34-44f5-8d80-85933aa486f3',
                    name: 'adoption_success_story',
                    value: "={{ $('Check Sources Executed').item.json.analysis.scoring_breakdown.adoption_success_story.reasoning }}",
                    type: 'string',
                },
                {
                    id: 'fb933280-486d-4785-89ef-39f89ebea213',
                    name: 'strategic_context',
                    value: "={{ $('Check Sources Executed').item.json.analysis.scoring_breakdown.strategic_context.reasoning }}",
                    type: 'string',
                },
                {
                    id: '43dd4bfb-492c-4778-9744-bff6a8e0a65c',
                    name: 'penalties_geographic',
                    value: "={{ $('Check Sources Executed').item.json.analysis.scoring_breakdown.penalties.geographic.reasoning }}",
                    type: 'string',
                },
                {
                    id: '046fd7a0-02c4-4551-9870-bbfea6e37308',
                    name: 'penalties_sector',
                    value: "={{ $('Check Sources Executed').item.json.analysis.scoring_breakdown.penalties.sector.reasoning }}",
                    type: 'string',
                },
                {
                    id: 'c0f44a86-dd5d-4ead-a885-9faecfd415d1',
                    name: 'penalties_applied',
                    value: `=Geographic: {{ $('Check Sources Executed').item.json.analysis.calculation_summary.penalties_applied.geographic }}
Sector: {{ $('Check Sources Executed').item.json.analysis.calculation_summary.penalties_applied.sector }}`,
                    type: 'string',
                },
                {
                    id: '082d1617-3239-41c6-a0f1-06b4332d5e08',
                    name: 'competitor_intel',
                    value: "={{ $('Check Sources Executed').item.json.analysis.scoring_breakdown.competitor_intel.note }}",
                    type: 'string',
                },
                {
                    id: '7e2c9882-620d-4b09-8db5-17772131634a',
                    name: 'key_highlights',
                    value: '={{ $(\'Check Sources Executed\').item.json.analysis.key_highlights.join(". ") }}',
                    type: 'string',
                },
                {
                    id: '5b6f8ff1-7f1d-4d76-b682-aa22de79685f',
                    name: 'recommended_action',
                    value: "={{ $('Check Sources Executed').item.json.analysis.recommended_action }}",
                    type: 'string',
                },
                {
                    id: 'be6698a9-68e6-4e01-a174-ff7b2b709cb1',
                    name: 'priority_band',
                    value: "={{ $('Check Sources Executed').item.json.analysis.priority_band }}",
                    type: 'string',
                },
                {
                    id: '1d814640-3d05-499d-bf90-ac9121e5f21e',
                    name: 'penalty_total',
                    value: "={{ $('Check Sources Executed').item.json.analysis.calculation_summary.penalty_total }}",
                    type: 'number',
                },
                {
                    id: '551848cb-34d8-4553-af66-cb06a7a046b7',
                    name: 'component_total',
                    value: "={{ $('Check Sources Executed').item.json.analysis.calculation_summary.component_total }}",
                    type: 'number',
                },
                {
                    id: '2000d261-dff9-4178-9d9b-d2bde88e0a79',
                    name: 'final_score',
                    value: "={{ $('Check Sources Executed').item.json.analysis.calculation_summary.final_score }}",
                    type: 'number',
                },
            ],
        },
        options: {
            ignoreConversionErrors: true,
        },
    };

    @node({
        id: '68e3697a-05ce-4f5f-82f5-21515e50fd54',
        name: 'Map Data for Notion3',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [-80, 6624],
    })
    MapDataForNotion3 = {
        assignments: {
            assignments: [
                {
                    id: '60beb5e2-6383-409b-8c39-19c9941d0611',
                    name: 'title',
                    value: "={{ $('Remove Duplicates').item.json.title }}",
                    type: 'string',
                },
                {
                    id: '75e5203c-7fc8-45d1-9aaf-ac3feca9998f',
                    name: 'publication_date',
                    value: `={{
(() => {
  const raw = $('Merge').item.json.publication_date;
  if (!raw || typeof raw !== 'string') return 'NA';

  let dt;

  dt = DateTime.fromISO(raw, { zone: 'utc' });
  if (dt.isValid) return dt.toISO();

  dt = DateTime.fromRFC2822(raw, { zone: 'utc' });
  if (dt.isValid) return dt.toISO();

  dt = DateTime.fromHTTP(raw, { zone: 'utc' });
  if (dt.isValid) return dt.toISO();

  const formats = [
    'ccc LLL dd HH:mm:ss Z yyyy',
    'yyyy-MM-dd HH:mm:ss',
    'yyyy/MM/dd HH:mm:ss',
    'dd/MM/yyyy HH:mm:ss',
    'dd-MM-yyyy HH:mm:ss',
    'yyyy-MM-dd',
    'dd/MM/yyyy',
    'MM/dd/yyyy'
  ];

  for (const f of formats) {
    dt = DateTime.fromFormat(raw, f, { zone: 'utc' });
    if (dt.isValid) return dt.toISO();
  }

  const jsDate = new Date(raw);
  if (!isNaN(jsDate)) {
    return DateTime.fromJSDate(jsDate, { zone: 'utc' }).toISO();
  }

  return 'NA';
})()
}}`,
                    type: 'string',
                },
                {
                    id: 'cda65c46-ca98-4d3b-94a5-8efa8468a5c5',
                    name: 'url',
                    value: "={{ $('Remove Duplicates').item.json.url ? $('Remove Duplicates').item.json.url?.trim() : \"NA\" }}",
                    type: 'string',
                },
                {
                    id: '2eaf0819-96c5-43f9-8bfe-60020f39a7da',
                    name: 'source',
                    value: "={{ $('Merge').item.json.source ? $('Merge').item.json.source : \"NA\" }}",
                    type: 'string',
                },
                {
                    id: '9fb33c0f-f4c0-4697-8454-f7366cb1469f',
                    name: 'source_name',
                    value: "={{ $('Merge').item.json.source_name }}",
                    type: 'string',
                },
                {
                    id: '48f2ac2b-de0b-47f6-9b56-f5d231119533',
                    name: 'search_query',
                    value: "={{ $('Merge').item.json.search_query ? $('Merge').item.json.search_query?.trim() : \"NA\"}}",
                    type: 'string',
                },
                {
                    id: 'a6d31903-9b90-4a94-bd31-865b362b41ec',
                    name: 'summary',
                    value: "={{ $('Merge').item.json.summary ? $('Merge').item.json.summary : \"NA\"}}",
                    type: 'string',
                },
                {
                    id: 'af126fa8-eb15-4598-baaf-d6ac11c76a21',
                    name: 'prompt',
                    value: "={{ $if($('Merge').isExecuted, $('Merge').item.json.prompt || '' , '') }}",
                    type: 'string',
                },
                {
                    id: 'c6c89504-6855-44af-a0d8-fdc3c12c79dc',
                    name: 'content_remove_duplicate_node',
                    value: "={{ $('Remove Duplicates').item.json.content ? $('Remove Duplicates').item.json.content : \"NA\"}}",
                    type: 'string',
                },
                {
                    id: '7ad26930-4b4b-4d58-97be-db52f57212e3',
                    name: 'content_if_sources_executed',
                    value: "={{ $('Check Sources Executed1').item.json.content ? $('Check Sources Executed1').item.json.content : \"NA\"}}",
                    type: 'string',
                },
                {
                    id: 'ccaadeed-1214-432f-867f-11197522ac00',
                    name: 'fact_extraction',
                    value: "={{ $('Filter Articles By Topic1').isExecuted ? $('Filter Articles By Topic1').item.json.fact_extraction.toJsonString().replace(/\"/g, '\\\\\"') : \"NA\"}}",
                    type: 'string',
                },
                {
                    id: '07ca4374-1d1c-4965-843e-6b2e16f357ea',
                    name: 'topical_signature.topic_action',
                    value: "={{ $('Filter Articles By Topic1').isExecuted ? $('Filter Articles By Topic1').item.json.topical_signature.topic_action : \"NA\"}}",
                    type: 'string',
                },
                {
                    id: 'd4700429-50a0-4f4e-bdcd-8c2255382d9c',
                    name: 'topical_signature.topic_entities',
                    value: `={{ $('Filter Articles By Topic1').isExecuted ? $('Filter Articles By Topic1').item.json.topical_signature.topic_entities.map(item =>
      \`{
          "name": "\${item}"
        }\`) : "NA" }}`,
                    type: 'array',
                },
                {
                    id: '75e1fcc1-f990-453d-b731-1462a9ccb8fa',
                    name: 'topical_signature.topic_geo',
                    value: "={{ $('Filter Articles By Topic1').isExecuted ? $('Filter Articles By Topic1').item.json.topical_signature.topic_geo : \"NA\"}}",
                    type: 'string',
                },
                {
                    id: '57af503e-3fca-47ce-97cc-37e0c93f222a',
                    name: 'topical_signature.topic_signature',
                    value: "={{ $('Filter Articles By Topic1').isExecuted ? $('Filter Articles By Topic1').item.json.topical_signature.topic_signature : \"NA\"}}",
                    type: 'string',
                },
                {
                    id: '8ce6c2e7-9a05-41b8-940b-916a612571cc',
                    name: 'topical_signature.topic_subject',
                    value: "={{ $('Filter Articles By Topic1').isExecuted ? $('Filter Articles By Topic1').item.json.topical_signature.topic_subject : \"NA\"}}",
                    type: 'string',
                },
                {
                    id: '19bc8e04-245a-4bd3-a836-0a112330ee7d',
                    name: 'classification',
                    value: "={{ $('Filter Articles By Topic1').isExecuted ? $('Filter Articles By Topic1').item.json.classification : \"new\"}}",
                    type: 'string',
                },
                {
                    id: 'c479fe81-c0d8-48a3-8fb3-2d9f9faf6cb7',
                    name: 'content_if_sources_executed',
                    value: "={{ $('Check Sources Executed1').item.json.content ? $('Check Sources Executed1').item.json.content : \"NA\"}}",
                    type: 'string',
                },
                {
                    id: 'e75ac639-3d0f-49fb-9257-ade65d4f55b9',
                    name: 'content_remove_duplicate_node',
                    value: "={{ $('Remove Duplicates').item.json.content ? $('Remove Duplicates').item.json.content : \"NA\"}}",
                    type: 'string',
                },
                {
                    id: '63d7a524-31cf-442b-8ed3-37ba1c002d00',
                    name: 'topical_relevance_reasoning',
                    value: "={{ $('Check Sources Executed1').item.json.analysis.scoring_breakdown.topical_relevance.reasoning }}",
                    type: 'string',
                },
                {
                    id: '43be379b-79af-4b42-9a9f-1c0771d2da06',
                    name: 'market_indicators',
                    value: "={{ $('Check Sources Executed1').item.json.analysis.scoring_breakdown.market_indicators.reasoning }}",
                    type: 'string',
                },
                {
                    id: 'da4f653a-ce24-4d37-986f-9de77dbaa76a',
                    name: 'oem_validation',
                    value: "={{ $('Check Sources Executed1').item.json.analysis.scoring_breakdown.oem_validation.reasoning }}",
                    type: 'string',
                },
                {
                    id: 'ccf47e4f-7efd-4000-bd89-27ff2a2e5b57',
                    name: 'adoption_success_story',
                    value: "={{ $('Check Sources Executed1').item.json.analysis.scoring_breakdown.adoption_success_story.reasoning }}",
                    type: 'string',
                },
                {
                    id: '7a96d705-b7b3-440c-9e0b-aa98f0206c92',
                    name: 'strategic_context',
                    value: "={{ $('Check Sources Executed1').item.json.analysis.scoring_breakdown.strategic_context.reasoning }}",
                    type: 'string',
                },
                {
                    id: '66488d0f-c649-4c0d-b9c5-db147a9c117d',
                    name: 'penalties_geographic',
                    value: "={{ $('Check Sources Executed1').item.json.analysis.scoring_breakdown.penalties.geographic.reasoning }}",
                    type: 'string',
                },
                {
                    id: '79cc3295-5217-4e14-8a09-361fad59134c',
                    name: 'penalties_sector',
                    value: "={{ $('Check Sources Executed1').item.json.analysis.scoring_breakdown.penalties.sector.reasoning }}",
                    type: 'string',
                },
                {
                    id: '95d200f5-5ef2-4710-bd79-92358b20f911',
                    name: 'penalties_applied',
                    value: `=Geographic: {{ $('Check Sources Executed1').item.json.analysis.calculation_summary.penalties_applied.geographic }}
Sector: {{ $('Check Sources Executed1').item.json.analysis.calculation_summary.penalties_applied.sector }}`,
                    type: 'string',
                },
                {
                    id: '94649e07-9d14-4163-b971-3fcfc0168a64',
                    name: 'penalty_total',
                    value: "={{ $('Check Sources Executed1').item.json.analysis.calculation_summary.penalty_total }}",
                    type: 'string',
                },
                {
                    id: '09c1df56-e5f9-4ee2-bf08-f0cb6c62d7f9',
                    name: 'competitor_intel',
                    value: "={{ $('Check Sources Executed1').item.json.analysis.scoring_breakdown.competitor_intel.note }}",
                    type: 'string',
                },
                {
                    id: '692d400d-1517-4906-8bb7-0fa2e6e6f5e2',
                    name: 'component_total',
                    value: "={{ $('Check Sources Executed1').item.json.analysis.calculation_summary.component_total }}",
                    type: 'string',
                },
                {
                    id: '3851f88d-c25a-47dd-80f4-1f660f283c3f',
                    name: 'final_score',
                    value: "={{ $('Check Sources Executed1').item.json.analysis.calculation_summary.final_score }}",
                    type: 'string',
                },
                {
                    id: '11f690f6-bade-4a42-9cd7-373ae90532d7',
                    name: 'key_highlights',
                    value: '={{ $(\'Check Sources Executed1\').item.json.analysis.key_highlights.join(". ") }}',
                    type: 'string',
                },
                {
                    id: 'a0d87b24-85e2-4ac9-809e-91b4a84d8c66',
                    name: 'recommended_action',
                    value: "={{ $('Check Sources Executed1').item.json.analysis.recommended_action }}",
                    type: 'string',
                },
                {
                    id: '9cdd9bb7-3179-4487-94ec-10a9d0be1b68',
                    name: 'priority_band',
                    value: "={{ $('Check Sources Executed1').item.json.analysis.priority_band }}",
                    type: 'string',
                },
            ],
        },
        options: {
            ignoreConversionErrors: true,
        },
    };

    @node({
        id: '92a14ff0-e159-420c-9ec8-731a95a1b176',
        name: 'Add Content With Date2',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.3,
        position: [144, 6624],
        credentials: { notionApi: { id: 'k0ZwGrqySi9Wayf7', name: 'Stephen Notion account' } },
        onError: 'continueErrorOutput',
    })
    AddContentWithDate2 = {
        method: 'POST',
        url: 'https://api.notion.com/v1/pages',
        authentication: 'predefinedCredentialType',
        nodeCredentialType: 'notionApi',
        sendHeaders: true,
        headerParameters: {
            parameters: [
                {
                    name: 'Notion-Version',
                    value: '2025-09-03',
                },
            ],
        },
        sendBody: true,
        specifyBody: 'json',
        jsonBody: `={
  "parent": {
    "type": "database_id",
    "database_id": "27c785c0-cfab-8137-800f-dcf3e01a3e97"
  },
  "properties": {
    "Article Name": {
      "title": [
        {
          "text": {
            "content": "{{ $('Map Data for Notion').item.json.title }}"
          }
        }
      ]
    },
    "Publication Date": {
      "date": {
        "start": "{{ $('Map Data for Notion').item.json.publication_date }}"
      }
    },
    "Source URL": {
      "url": "{{ $('Map Data for Notion').item.json.url }}"
    },
    "Source": {
      "multi_select": [
        {
          "name": "{{ $('Map Data for Notion').item.json.source }}"
        }
      ]
    },
    "Source Name": {
      "rich_text": [
        {
          "text": {
            "content": "{{ $('Map Data for Notion').item.json.source_name }}"
          }
        }
      ]
    },
    "Status": {
      "select": {
        "name": "Not Reviewed"
      }
    },
    "Search Query": {
      "rich_text": [
        {
          "text": {
            "content": "{{ $('Map Data for Notion').item.json.search_query }}"
          }
        }
      ]
    },    
    "Summary": {
      "rich_text": [
        {
          "text": {
            "content": "{{ $('Map Data for Notion').item.json.summary }}"
          }
        }
      ]
    },
    "Own Analysis": {
      "rich_text": [
        {
          "text": {
            "content": "{{ $json.prompt }}"
          }
        }
      ]
    },
    "Fact Fingerprint": {
      "rich_text": [
        {
          "text": {
            "content": "{{ $json.fact_extraction }}"
          }
        }
      ]
    },
    "Topic Action": {
      "multi_select": [
        {
          "name": "{{ $('Map Data for Notion').item.json.topical_signature.topic_action }}"
        }
      ]
    },
    "Topic Entities": {
      "multi_select": [
          {{ $json.topical_signature.topic_entities }}
      ]
    },
    "Topic Geo": {
      "multi_select": [
        {
          "name": "{{ $json.topical_signature.topic_geo }}"
        }
      ]
    },
    "Topic Signature": {
      "rich_text": [
        {
          "text": {
            "content": "{{ $json.topical_signature.topic_signature }}"
          }
        }
      ]
    },
    "Topic Subject": {
      "rich_text": [
        {
          "text": {
            "content": "{{ $json.topical_signature.topic_subject }}"
          }
        }
      ]
    },
   "topical_relevance_reasoning": {
    "rich_text": [
      {
        "text": {
          "content": {{ $('Map Data for Notion').item.json.topical_relevance_reasoning.toJsonString() }}
        }
      }
    ]
  },
  "market_indicators": {
    "rich_text": [
      {
        "text": {
          "content": {{ $('Map Data for Notion').item.json.market_indicators.toJsonString() }}
        }
      }
    ]
  },
  "oem_validation": {
    "rich_text": [
      {
        "text": {
          "content": {{ $('Map Data for Notion').item.json.oem_validation.toJsonString() }}
        }
      }
    ]
  },
  "adoption_success_story": {
    "rich_text": [
      {
        "text": {
          "content": {{ $('Map Data for Notion').item.json.adoption_success_story.toJsonString() }}
        }
      }
    ]
  },
  "strategic_context": {
    "rich_text": [
      {
        "text": {
          "content": {{ $('Map Data for Notion').item.json.strategic_context.toJsonString() }}
        }
      }
    ]
  },
  "penalties_geographic": {
    "rich_text": [
      {
        "text": {
          "content": {{ $('Map Data for Notion').item.json.penalties_geographic.toJsonString() }}
        }
      }
    ]
  },
  "penalties_sector": {
    "rich_text": [
      {
        "text": {
          "content": {{ $('Map Data for Notion').item.json.penalties_sector.toJsonString() }}
        }
      }
    ]
  },
  "penalties_applied": {
    "rich_text": [
      {
        "text": {
          "content": {{ $('Map Data for Notion').item.json.penalties_applied.toJsonString() }}
        }
      }
    ]
  },
  "competitor_intel": {
    "rich_text": [
      {
        "text": {
          "content": {{ $('Map Data for Notion').item.json.competitor_intel.toJsonString() }}
        }
      }
    ]
  },
  "key_highlights": {
    "rich_text": [
      {
        "text": {
          "content": "{{ $('Map Data for Notion').item.json.key_highlights }}"
        }
      }
    ]
  },
  "recommended_action": {
    "rich_text": [
      {
        "text": {
          "content": {{ $('Map Data for Notion').item.json.recommended_action.toJsonString() }}
        }
      }
    ]
  },
  "priority_band": {
    "multi_select": [
      {
        "name": {{ $('Map Data for Notion').item.json.priority_band.toJsonString() }}
      }
    ]
  },
  "penalty_total": {
    "number": {{ $('Map Data for Notion').item.json.penalty_total }}
  },
  "component_total": {
    "number": {{ $('Map Data for Notion').item.json.component_total }}
  },
  "final_score": {
    "number": {{ $('Map Data for Notion').item.json.final_score }}
  },
    "Update Status": {
      "select": {
        "name": "{{ $json.classification }}"
      }
    }
  },
  "children": [
    {
      "object": "block",
      "type": "paragraph",
      "paragraph": {
        "rich_text": [
          {
            "text": {
              "content": {{ $json.content_remove_duplicate_node.toJsonString() }}
            }
          }
        ]
      }
    }
  ]
}
`,
        options: {},
    };

    @node({
        id: '67917644-bc13-4ba7-98ef-e34ac46398c0',
        name: 'Add Content With Date3',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.3,
        position: [368, 6624],
        credentials: { notionApi: { id: 'k0ZwGrqySi9Wayf7', name: 'Stephen Notion account' } },
        onError: 'continueErrorOutput',
    })
    AddContentWithDate3 = {
        method: 'POST',
        url: 'https://api.notion.com/v1/pages',
        authentication: 'predefinedCredentialType',
        nodeCredentialType: 'notionApi',
        sendHeaders: true,
        headerParameters: {
            parameters: [
                {
                    name: 'Notion-Version',
                    value: '2025-09-03',
                },
            ],
        },
        sendBody: true,
        specifyBody: 'json',
        jsonBody: `={
  "parent": {
    "type": "database_id",
    "database_id": "27c785c0-cfab-8137-800f-dcf3e01a3e97"
  },
  "properties": {
    "Article Name": {
      "title": [
        {
          "text": {
            "content": "{{ $('Map Data for Notion1').item.json.title }}"
          }
        }
      ]
    },
    "Publication Date": {
      "date": {
        "start": "{{ $('Map Data for Notion1').item.json.publication_date }}"
      }
    },
    "Source URL": {
      "url": "{{ $('Map Data for Notion1').item.json.url }}"
    },
    "Source": {
      "multi_select": [
        {
          "name": "{{ $('Map Data for Notion1').item.json.source }}"
        }
      ]
    },
    "Source Name": {
      "rich_text": [
        {
          "text": {
            "content": "{{ $('Map Data for Notion1').item.json.source_name }}"
          }
        }
      ]
    },
    "Status": {
      "select": {
        "name": "Not Reviewed"
      }
    },
    "Search Query": {
      "rich_text": [
        {
          "text": {
            "content": "{{ $('Map Data for Notion1').item.json.search_query }}"
          }
        }
      ]
    },
    "Summary": {
      "rich_text": [
        {
          "text": {
            "content": "{{ $('Map Data for Notion1').item.json.summary }}"
          }
        }
      ]
    },
    "Own Analysis": {
      "rich_text": [
        {
          "text": {
            "content": "{{ $('Map Data for Notion1').item.json.prompt }}"
          }
        }
      ]
    },
    "Fact Fingerprint": {
      "rich_text": [
        {
          "text": {
            "content": "{{ $('Map Data for Notion1').item.json.fact_extraction }}"
          }
        }
      ]
    },
    "Topic Action": {
      "multi_select": [
        {
          "name": "{{ $('Map Data for Notion1').item.json.topical_signature.topic_action }}"
        }
      ]
    },
    "Topic Entities": {
      "multi_select": [
        {{ $('Map Data for Notion1').item.json.topical_signature.topic_entities }}
      ]
    },
    "Topic Geo": {
      "multi_select": [
        {
          "name": "{{ $('Map Data for Notion1').item.json.topical_signature.topic_geo }}"
        }
      ]
    },
    "Topic Signature": {
      "rich_text": [
        {
          "text": {
            "content": "{{ $('Map Data for Notion1').item.json.topical_signature.topic_signature }}"
          }
        }
      ]
    },
    "Topic Subject": {
      "rich_text": [
        {
          "text": {
            "content": "{{ $('Map Data for Notion1').item.json.topical_signature.topic_subject }}"
          }
        }
      ]
    },
    "topical_relevance_reasoning": {
    "rich_text": [
      {
        "text": {
          "content": {{ $('Map Data for Notion1').item.json.topical_relevance_reasoning.toJsonString() }}
        }
      }
    ]
  },
  "market_indicators": {
    "rich_text": [
      {
        "text": {
          "content": {{ $('Map Data for Notion1').item.json.market_indicators.toJsonString() }}
        }
      }
    ]
  },
  "oem_validation": {
    "rich_text": [
      {
        "text": {
          "content": {{ $('Map Data for Notion1').item.json.oem_validation.toJsonString() }}
        }
      }
    ]
  },
  "adoption_success_story": {
    "rich_text": [
      {
        "text": {
          "content": {{ $('Map Data for Notion1').item.json.adoption_success_story.toJsonString() }}
        }
      }
    ]
  },
  "strategic_context": {
    "rich_text": [
      {
        "text": {
          "content": {{ $('Map Data for Notion1').item.json.strategic_context.toJsonString() }}
        }
      }
    ]
  },
  "penalties_geographic": {
    "rich_text": [
      {
        "text": {
          "content": {{ $('Map Data for Notion1').item.json.penalties_geographic.toJsonString() }}
        }
      }
    ]
  },
  "penalties_sector": {
    "rich_text": [
      {
        "text": {
          "content": {{ $('Map Data for Notion1').item.json.penalties_sector.toJsonString() }}
        }
      }
    ]
  },
  "penalties_applied": {
    "rich_text": [
      {
        "text": {
          "content": {{ $('Map Data for Notion1').item.json.penalties_applied.toJsonString() }}
        }
      }
    ]
  },
  "competitor_intel": {
    "rich_text": [
      {
        "text": {
          "content": {{ $('Map Data for Notion1').item.json.competitor_intel.toJsonString() }}
        }
      }
    ]
  },
  "key_highlights": {
    "rich_text": [
      {
        "text": {
          "content": "{{ $('Map Data for Notion1').item.json.key_highlights }}"
        }
      }
    ]
  },
  "recommended_action": {
    "rich_text": [
      {
        "text": {
          "content": {{ $('Map Data for Notion1').item.json.recommended_action.toJsonString() }}
        }
      }
    ]
  },
  "priority_band": {
    "multi_select": [
      {
        "name": {{ $('Map Data for Notion1').item.json.priority_band.toJsonString() }}
      }
    ]
  },
  "penalty_total": {
    "number": {{ $('Map Data for Notion1').item.json.penalty_total }}
  },
  "component_total": {
    "number": {{ $('Map Data for Notion1').item.json.component_total }}
  },
  "final_score": {
    "number": {{ $('Map Data for Notion1').item.json.final_score }}
  },
    "Update Status": {
      "select": {
        "name": "{{ $('Map Data for Notion1').item.json.classification }}"
      }
    }
  },
  "children": [
    {
      "object": "block",
      "type": "paragraph",
      "paragraph": {
        "rich_text": [
          {
            "text": {
              "content": {{ $json.textSubString.toJsonString() }}
            }
          }
        ]
      }
    }
  ]
}`,
        options: {},
    };

    @node({
        id: '458040e0-8c20-44dd-b824-53bf08427b64',
        name: 'Sticky Note',
        type: 'n8n-nodes-base.stickyNote',
        version: 1,
        position: [-464, 6240],
    })
    StickyNote = {
        content: `## DO NOT DELETE
This is the old Notion schema. `,
        height: 544,
        width: 1088,
    };

    @node({
        id: '46d92a3f-87cd-4b0c-adf3-2eeace451e84',
        name: 'Anthropic Chat Model',
        type: '@n8n/n8n-nodes-langchain.lmChatAnthropic',
        version: 1.3,
        position: [7184, 5760],
        credentials: { anthropicApi: { id: '0c1nNLaJWpeD3Cqz', name: 'Syntech GM Anthropic account' } },
    })
    AnthropicChatModel = {
        model: {
            __rl: true,
            value: 'claude-sonnet-4-5-20250929',
            mode: 'list',
            cachedResultName: 'Claude Sonnet 4.5',
        },
        options: {
            temperature: 0,
        },
    };

    @node({
        id: 'd586dcc8-7c15-4713-90f5-ee5aa0d99965',
        name: 'STAGE - 4: Classification Agent (Claude Optimisation)1',
        type: '@n8n/n8n-nodes-langchain.chainLlm',
        version: 1.7,
        position: [-304, 3920],
        retryOnFail: true,
        waitBetweenTries: 5000,
    })
    Stage4ClassificationAgentClaudeOptimisation1 = {
        promptType: 'define',
        text: `=Score this article using your decision tree framework:

ARTICLE TITLE: {{ $('If From Form').item.json.title }}
ARTICLE CONTENT: {{ $('If From Form').item.json.content }}
SOURCE URL: {{ $('If From Form').item.json.url }}

PREVIOUS STAGE OUTPUTS:

**Stage 1 - Fossil Fuel Check:**
{{ $('⛽️ STAGE - 1: Fossil Fuel Filter').item.json.output.toJsonString() }}

**Stage 2 - VIP Detection:**
{{ $('🔑 STAGE - 2: VIP Keyword handler').item.json.output.toJsonString() }}

**Stage 3 - Biofuel Focus:**
{{ $('🪨 STAGE - 3: Topic Density Test').isExecuted ? $('🪨 STAGE - 3: Topic Density Test').item.json.output.toJsonString() : 'VIP Article' }}

Evaluate and provide scoring breakdown with final decision.`,
        hasOutputParser: true,
        messages: {
            messageValues: [
                {
                    message: `=# STAGE 4: PATHWAY-AWARE STRATEGIC VALUE SCORER - FINAL

**Purpose**: Assess strategic value using Tim's decision-making framework, adapted per pathway
**Decision**: SCORE (0-21 points) + threshold check (≥3 = surface to client)
**Token Budget**: Unlimited - this is the brain

---

## THINKING LIKE TIM - CORE PRINCIPLES

From transcript analysis and client feedback, Tim evaluates articles by asking:

1. **"Does this prove the fuel works?"** - Quantified results, OEM approvals, operational validation
2. **"Can we learn something actionable?"** - Market intelligence we can't easily Google
3. **"Does this show adoption/progress?"** - Actual deployment, not just announcements
4. **"Is this novel or routine?"** - Strategic intel vs standard compliance

**Key insight from transcripts**: 

> "The interesting thing about this is it's not interesting to us from a marine perspective, but it's good from the point of view it's reporting about the reduction in particles... people are using this stuff and it proves that it is 81%... **strong evidence that what we're doing matters**." - Tim on marine B100 article

**Tim doesn't care about CONTEXT (festivals, maritime, awards). He cares about PROOF and ACTIONABLE INTELLIGENCE.**

---

## STEP 1: READ PATHWAY FROM STAGE 3

\`\`\`
pathway = Stage3 classification ("A", "B", or "C")

IF pathway === "A" → Apply BIOFUEL CONTENT evaluation
IF pathway === "B" → Apply VIP STRATEGIC evaluation  
IF pathway === "C" → Apply REGULATORY/MARKET evaluation
\`\`\`

Each pathway has different substance requirements and scoring criteria.

---

## PATHWAY A: BIOFUEL CONTENT EVALUATION

**This is the primary pathway - articles explicitly about biofuels.**

### A1: FUEL TYPE GATE (Disqualifying)

\`\`\`
Is article about:
├─ Ethanol (corn, sugarcane, any source) → REJECT
├─ Crop-based oils ONLY (palm, soy, rapeseed) with no waste component → REJECT
└─ Waste-derived biodiesel (UCO, tallow, waste oils) → +2 points, CONTINUE
\`\`\`

**Add +2 if discusses waste-derived fuels:**
- UCO → HVO/FAME/B100/renewable diesel
- Animal fats → biodiesel
- Waste oils → fuel conversion

---

### A2: SUBSTANCE GATE (Disqualifying) - TIM'S THREE QUESTIONS

**These are Tim's actual decision criteria from transcripts:**

#### Question 1: SPECIFIC ADOPTION?
**Does article say WHO is using WHAT fuel?**

**PASS - Specific examples:**
- ✅ "WOMADelaide festival uses B100 from UCO" (WHO: festival, WHAT: B100)
- ✅ "John Deere approves B30 across Tier 4 engines" (WHO: John Deere, WHAT: B30)
- ✅ "Marine vessel completes voyage on B100" (WHO: vessel, WHAT: B100)
- ✅ "Restaurant Technologies recycled 390M lbs UCO" (WHO: RT, WHAT: UCO collection)
- ✅ "UECC uses 8,990 tonnes UCOME for Toyota shipments" (WHO: UECC/Toyota, WHAT: UCOME)

**FAIL - Too generic:**
- ❌ "Government supports biofuels" (WHO: vague, WHAT: vague)
- ❌ "Industry expected to grow" (WHO: nobody specific, WHAT: generic)
- ❌ "Market shows promise" (WHO: nobody, WHAT: aspirational)

**If NO specific WHO/WHAT → REJECT**

---

#### Question 2: MEASURABLE DATA?
**Does article provide QUANTIFIED information?**

**PASS - Measurable examples:**
- ✅ "390 million pounds UCO recycled" (volume)
- ✅ "81% black carbon reduction" (percentage)
- ✅ "50,000 tonnes/year renewable diesel" (capacity)
- ✅ "B30 across entire Tier 4 engine line" (scope)
- ✅ "8,990 tonnes UCOME, 22K tonnes CO2e reduction" (volumes + impact)
- ✅ "EIA: RD production 250K→290K bpd by 2027" (market forecast)

**FAIL - Vague claims:**
- ❌ "Promising results" (no numbers)
- ❌ "Significant reduction" (how much?)
- ❌ "Market growing" (by how much?)

**SPECIAL CASE - OEM Approvals:**
Even without deployment volumes, OEM approvals pass this check because they're inherently measurable (scope: "entire Tier 4 line", "all equipment", etc.)

**If NO measurable data AND not an OEM approval → REJECT**

---

#### Question 3: PROOF/PROGRESS (Not Localized Obstacles)?
**Is article about something HAPPENING or just one company's problems?**

**PASS - Progress/Adoption:**
- ✅ Facilities going operational with fuel production
- ✅ Fleets deploying biodiesel with operational results
- ✅ Technology validation proving fuel works (even wrong sector)
- ✅ OEM approvals expanding market compatibility
- ✅ UCO collection/supply chain developments at scale
- ✅ Market-wide regulatory changes
- ✅ Competitive intelligence: facilities GOING LIVE (not announced)

**PASS - Market-Wide Obstacles (These Matter):**
- ✅ "UK regulation delays ALL biodiesel facilities" (affects Syntech + market)
- ✅ "UCO supply disrupted by China export restrictions" (global feedstock impact)
- ✅ "SAF demand affects UCO availability for ground transport" (market dynamics)

**REJECT - Localized Obstacles (These Don't Matter):**
- ❌ "Oregon refinery delayed by federal permits" (one company's problem, no market entry)
- ❌ "Competitor facility blocked by lawsuit" (legal issue, not market intelligence)
- ❌ "Construction timeline pushed to 2027 for XYZ plant" (individual project delay)

**The Test from Tim's Transcripts:**

> "It's an American one... it's just ongoing stuff that has NO RELEVANCE to us whatsoever... nothing we could glean from it, really... it wasn't news about a development, it wasn't something that was really specific." - Tim on Oregon refinery rejection

**Ask**: "Does this affect Syntech's business or just the company mentioned?"
- One company's problems ≠ Syntech's problem → REJECT
- Market-wide forces = Syntech's problem → PASS

**If localized obstacles only → REJECT**

---

### A3: PATHWAY A VALUE SCORING

**If article passes substance gate, award points for ALL components that apply:**

---

#### VALUE CHECK 1: OPERATIONAL DEPLOYMENT (0 or 3 points)

**Criteria**: Specific deployment with concrete proof of biofuel use

**Awards 3 points if article shows:**
- WHO: Named company/fleet/facility/event
- WHAT: Specific fuel type + application  
- HOW MUCH: Volume/scale/investment with numbers
- WHEN: Timeline or operational status (not "plans to")

**Examples scoring 3 points:**
- ✅ "WOMADelaide powers all stages with B100/HVO from UCO" (WHO: festival, WHAT: B100/HVO, HOW MUCH: all stages, WHEN: 2026)
- ✅ "UECC uses 8,990 tonnes UCOME for Toyota shipments" (WHO: UECC, WHAT: UCOME, HOW MUCH: 8,990 tonnes, WHEN: 2024-2025)
- ✅ "Restaurant Technologies recycled 390M lbs UCO, ISCC certified" (WHO: RT, WHAT: UCO collection, HOW MUCH: 390M lbs, WHEN: 2025)
- ✅ "Cotswold Council deploys 30 HVO lorries, £7.8M investment" (WHO: Council, WHAT: HVO, HOW MUCH: 30 vehicles + £7.8M, WHEN: operational)

**Examples scoring 0 points:**
- ❌ "Council plans to explore biofuel options" (plans, not deployment)
- ❌ "Facility announced with timeline TBD" (announcement, not operational)
- ❌ "Company considering B100 for future fleet" (aspirational, not deployed)

**Why this matters (Tim's words):**
> "If someone's doing something somewhere else that we're not aware of, we'd like to know... people are pushing it now" - Tim on festival B100 adoption

---

#### VALUE CHECK 2: TECHNOLOGY VALIDATION (0 or 3 points)

**Criteria**: Proves waste-derived biodiesel works with QUANTIFIED benefits

**Awards 3 points for EITHER:**

**A) Quantified Performance Proof:**
- Specific emissions: "81% black carbon reduction", "90% CO2 vs diesel"
- Operational metrics: "500,000 km testing", "162M lbs CO2 prevented annually"  
- Verified commercial results (not lab tests)
- Must include NUMBERS proving fuel works

**B) OEM Approvals/Certifications:**
- Manufacturer approves biodiesel: "John Deere certifies B30 across Tier 4"
- Technology certification: "Scania validates HVO for entire truck line"
- Market expansion: "JCB announces all equipment HVO-compatible"
- Industry training: "Lloyd's Register launches FAME handling course"

**Examples scoring 3 points:**
- ✅ "Marine vessel achieves 81% black carbon reduction on B100" (quantified proof, even wrong sector)
- ✅ "Festival achieves 90% GHG reduction with B100/HVO" (quantified benefit)
- ✅ "John Deere approves B30 across entire Tier 4 engine portfolio" (OEM validation)
- ✅ "R.W. Beckett certifies burners for B100 home heating" (OEM certification expanding market)
- ✅ "Hydrogen tugboat completes zero-carbon voyage using B100" (operational validation)

**Examples scoring 0 points:**
- ❌ "Promising pilot results" (vague, no numbers)
- ❌ "Technology shows potential" (aspirational, not proven)
- ❌ "Initial tests encouraging" (no quantified proof)

**Why this matters (Tim's words):**
> "The interesting thing about this is... it's reporting about the reduction in particles... it proves that it is 81%... **strong evidence that what we're doing matters**... even though we're not into marine." - Tim on marine B100

**Context doesn't matter if PROOF exists.** Marine, aviation, festivals - all valid if they prove the fuel works.

---

#### VALUE CHECK 3: SALES OPPORTUNITY SIGNAL (0 or 3 points)

**Criteria**: Indicates potential Syntech customers or market opportunities

**Awards 3 points if article discusses:**

**Infrastructure/Construction (Future Opportunities):**
- UK construction/infrastructure projects announced (not completed)
- Major projects needing fuel for equipment/generators/off-grid power
- Government procurement with decarbonization requirements
- Capital investment in fuel-consuming sectors

**Funding Signals:**
- Budget allocations for construction/infrastructure/transport (with £/$amounts)
- Tender requirements including emissions reduction
- Capital expenditure announcements for fuel-heavy sectors

**Sector Commitments:**
- Construction/logistics decarbonization pledges with timelines
- Corporate net-zero commitments in Syntech's target sectors
- Scope 3 reduction programs requiring fuel solutions

**Examples scoring 3 points:**
- ✅ "£3.3bn infrastructure budget including transport schemes" (future fuel demand)
- ✅ "Council tender requires net-zero fuel supplier by 2026" (procurement opportunity)
- ✅ "Construction sector commits to 50% emissions reduction" (market driver)
- ✅ "SSE announces decarbonization plan for equipment fleet" (strategic customer opportunity)

**Examples scoring 0 points:**
- ❌ "Market expected to grow" (generic, no specific opportunities)
- ❌ "Council switched to HVO last year" (already deployed, not future opportunity)
- ❌ "Industry discusses sustainability goals" (aspirational, no concrete commitments)

---

#### VALUE CHECK 4: MARKET INTELLIGENCE (0 or 2 points)

**Criteria**: Actionable market information affecting business decisions

**Awards 2 points for:**

**Supply Chain Intelligence:**
- UCO pricing trends: "UCO prices surge 40% on SAF demand"
- Feedstock availability: "China UCO supply impacts European market"
- Collection developments: "Restaurant Technologies recycled 390M lbs UCO"

**Regulatory Intelligence:**
- RTFO mandate changes affecting waste-derived fuels
- Carbon pricing impacts on biofuel economics
- Policy shifts creating opportunities or challenges

**Market Forecasts (MUST BE SPECIFIC):**
- ✅ "EIA: RD production 250K→290K bpd by 2027" (specific forecast)
- ✅ "Swedish RD demand hits record high, prices up 15%" (market trend + data)
- ❌ "Biofuel market expected to grow" (generic, no actionable data)

**Competitive Intelligence (MUST BE ACTIONABLE):**
- ✅ Competitor facility GOES OPERATIONAL with capacity (affects market supply)
- ✅ Daekyung O&T acquisition: Korea's No.1 UCO supplier sold for 500B won (consolidation signal)
- ✅ Competitor adopts novel process Syntech can learn from
- ❌ Competitor achieves routine ISCC certification (standard compliance, not novel)
- ❌ Competitor facility delayed/blocked (no market impact yet)

**Demand Trends (MUST HAVE DATA):**
- Biofuel adoption rates with specific numbers
- Geographic market developments with metrics
- Downstream forces: "SAF demand affects UCO availability for ground transport"

**Examples scoring 2 points:**
- ✅ "EIA: RD production 250K→290K bpd, biodiesel flat at 100K bpd" (market forecast)
- ✅ "UCO CIF ARA gains, vegoil-gasoil spreads mixed" (feedstock pricing)
- ✅ "Daekyung O&T acquisition: 500B won for Korea's top UCO supplier" (competitive M&A)
- ✅ "POME-UCO RD spread hits highs amid policy changes" (feedstock economics)

**Examples scoring 0 points:**
- ❌ "Competitor achieves ISCC certification" (routine compliance)
- ❌ "Oregon refinery delayed by permits" (localized obstacle, no market entry)
- ❌ "Market shows strong growth potential" (generic, no data)

---

#### VALUE CHECK 5: OEM BREAKTHROUGH (0 or 2 points)

**Criteria**: Equipment manufacturer validation or certification

**Awards 2 points for:**

**OEM Approvals:**
- Major manufacturer approves biodiesel: Caterpillar, Volvo, JCB, Scania, John Deere, DAF, MAN
- Engine line certification for B100/HVO/FAME
- Industry standard validation (BS EN 14214, ASTM D6751) from OEM

**Technology Milestones:**
- First-of-kind commercial adoption with manufacturer backing
- Breakthrough in biofuel performance/compatibility
- Major fleet operator validation (100+ vehicles) with OEM partnership

**Examples scoring 2 points:**
- ✅ "John Deere approves B30 across entire Tier 4 engine line"
- ✅ "JCB announces all equipment HVO-compatible as standard"
- ✅ "R.W. Beckett certifies burners for B100 home heating"
- ✅ "Scania validates HVO for complete truck portfolio"

**Why this matters:**
OEM validation is valuable BY ITSELF - it expands Syntech's addressable market and validates the technology, even without specific deployment metrics.

---

#### VALUE CHECK 6: STRATEGIC RELEVANCE TO SYNTECH (0 or 1 point)

**Criteria**: Direct alignment with Syntech's business model

**Awards 1 point for:**

**Target Sector Focus:**
- UK construction/logistics/infrastructure deployment
- Off-grid power, generators, NRMM applications
- Municipal fleets, waste collection vehicles

**Feedstock/Process:**
- Waste feedstock emphasis (UCO collection, circular economy)
- Transesterification process (FAME production)
- UK waste sourcing (not imported)

**Value Proposition:**
- Drop-in fuel messaging (no modifications required)
- Scope 3 emissions reduction focus
- BS EN 14214 standard mentioned
- "Made in Britain" / local production emphasis

**Examples scoring 1 point:**
- ✅ "UK festival uses B100 from UCO for off-grid power"
- ✅ "New UCO collection network expands across Scotland"
- ✅ "Municipal fleet targets Scope 3 reduction through drop-in biofuel"
- ✅ "Construction equipment using FAME compliant with BS EN 14214"

---

### PATHWAY A FINAL SCORE

\`\`\`
PATHWAY A SCORE = Fuel Type Gate (0 or 2)
                + Operational Deployment (0 or 3)
                + Technology Validation (0 or 3)
                + Sales Opportunity (0 or 3)
                + Market Intelligence (0 or 2)
                + OEM Breakthrough (0 or 2)
                + Strategic Relevance (0 or 1)

Maximum: 16 points
\`\`\`

---

## PATHWAY B: VIP STRATEGIC EVALUATION

**This pathway is for VIP entity articles WITHOUT explicit biofuel discussion.**

**Why this pathway exists:**
VIP entities (Lower Thames Crossing, Balfour Beatty, SSE, etc.) are Syntech's strategic customers. Infrastructure spending = fuel demand for equipment/generators. Decarbonization commitments = future biofuel opportunities.

**Lower substance bar:**
These articles don't need:
- Biofuel keywords (that would be Pathway A)
- Operational deployment metrics
- Technology validation proof

They just need to signal **sales opportunity or strategic intelligence**.

---

### B1: VIP CONFIRMATION

\`\`\`
Does article discuss VIP entity?
├─ YES (LTC, Balfour Beatty, SSE, NetZero Teesside, Sizewell C) → CONTINUE
└─ NO → ERROR (should not be in Pathway B)
\`\`\`

---

### B2: VIP SUBSTANCE CHECK (Simpler than Pathway A)

**Article must have ONE of these:**

**Infrastructure/Project Intelligence:**
- Project timelines, scale, investment amounts
- Construction contracts awarded
- Facility developments or expansions

**Financial Intelligence:**
- Budget allocations for infrastructure/construction
- Capital expenditure announcements
- Procurement budgets

**Strategic Commitments:**
- Decarbonization pledges with timelines
- Net-zero commitments for operations/fleets
- Sustainability targets

**If article has NONE of these → REJECT** (just company news with no strategic value)

---

### B3: PATHWAY B VALUE SCORING

**Award points for ALL that apply:**

#### VALUE CHECK 1: PROJECT SCALE (0 or 5 points)

**Awards 5 points if:**
- Major infrastructure project: £500M+ value
- Multi-year timeline (2+ years of fuel demand)
- Significant construction activity (equipment/generator fuel needs)

**Examples scoring 5 points:**
- ✅ "£10.2bn Lower Thames Crossing construction starts 2026"
- ✅ "£1.7bn A5 Western Transport Corridor begins early 2026"
- ✅ "Balfour Beatty wins £800M highway contract"

---

#### VALUE CHECK 2: TIMELINE/URGENCY (0 or 3 points)

**Awards 3 points if:**
- Project starting within 12 months
- Immediate procurement opportunities
- Clear timeline for fuel demand

**Examples scoring 3 points:**
- ✅ "LTC construction begins summer 2026"
- ✅ "Tender released with Q1 2026 decision date"
- ✅ "Project commences imminently"

---

#### VALUE CHECK 3: DECARBONIZATION COMMITMENT (0 or 3 points)

**Awards 3 points if:**
- VIP entity commits to emissions reduction
- Net-zero targets for operations/fleets
- Sustainability requirements in procurement

**Examples scoring 3 points:**
- ✅ "SSE commits to net-zero construction fleet by 2028"
- ✅ "Project requires 50% emissions reduction vs baseline"
- ✅ "Council mandates sustainable fuel suppliers"

---

#### VALUE CHECK 4: STRATEGIC POSITIONING (0 or 2 points)

**Awards 2 points if:**
- Multiple VIP entities mentioned (portfolio opportunity)
- Industry-wide trend affecting multiple customers
- Long-term relationship potential

---

### PATHWAY B FINAL SCORE

\`\`\`
PATHWAY B SCORE = Project Scale (0 or 5)
                + Timeline/Urgency (0 or 3)
                + Decarbonization Commitment (0 or 3)
                + Strategic Positioning (0 or 2)

Maximum: 13 points
\`\`\`

---

## PATHWAY C: REGULATORY/MARKET EVALUATION

**This pathway is for policy/regulation articles creating biofuel opportunities.**

**Why this pathway exists:**
Policy creates market conditions. Budget allocations, procurement mandates, energy policy - these signal future demand even without saying "biofuel."

---

### C1: REGULATORY CONFIRMATION

\`\`\`
Does article discuss policy/regulation affecting fuel markets?
├─ YES (budget, mandates, procurement rules) → CONTINUE
└─ NO → ERROR (should not be in Pathway C)
\`\`\`

---

### C2: PATHWAY C SUBSTANCE CHECK

**Article must have:**

**Policy/Regulatory Change:**
- Government budget allocations
- New mandates or standards
- Procurement rule changes
- Energy/transport policy shifts

**Market Impact:**
- Clear connection to fuel demand
- Implications for low-carbon fuels
- Infrastructure/transport sector effects

**If article has generic policy discussion with no market impact → REJECT**

---

### C3: PATHWAY C VALUE SCORING

#### VALUE CHECK 1: POLICY SCALE (0 or 5 points)

**Awards 5 points if:**
- National-level policy (UK-wide)
- Significant budget: £1bn+ allocated
- Multi-sector impact

**Examples scoring 5 points:**
- ✅ "UK budget: £3.3bn capital expenditure for infrastructure/transport"
- ✅ "Government mandates 50% emissions reduction in public procurement"
- ✅ "RTFO increases renewable fuel mandate to 15% by 2027"

---

#### VALUE CHECK 2: TIMELINE/IMPLEMENTATION (0 or 3 points)

**Awards 3 points if:**
- Policy takes effect within 12 months
- Procurement opportunities imminent
- Clear implementation schedule

---

#### VALUE CHECK 3: SYNTECH ALIGNMENT (0 or 3 points)

**Awards 3 points if:**
- Policy specifically benefits waste-derived fuels
- Targets construction/transport/infrastructure sectors
- Creates competitive advantage for drop-in fuels

---

#### VALUE CHECK 4: MARKET OPPORTUNITY (0 or 2 points)

**Awards 2 points if:**
- New market segments opening
- Regulatory tailwinds for biofuels
- First-mover advantage potential

---

### PATHWAY C FINAL SCORE

\`\`\`
PATHWAY C SCORE = Policy Scale (0 or 5)
                + Timeline/Implementation (0 or 3)
                + Syntech Alignment (0 or 3)
                + Market Opportunity (0 or 2)

Maximum: 13 points
\`\`\`

---

## FINAL DECISION

\`\`\`
Calculate total score based on pathway

IF score ≥ 3 → SURFACE TO CLIENT
IF score < 3 → REJECT
\`\`\`

**Priority Bands:**
- **10+ points**: MUST-READ (exceptional strategic value)
- **6-9 points**: STRONG INTEREST (clear relevance)
- **3-5 points**: MARGINAL (review, borderline value)
- **<3 points**: REJECT (insufficient value)

---

## OUTPUT FORMAT

**CRITICAL: Do NOT calculate total_score, decision, or priority_band. These will be calculated by the code node.**

**Output ONLY these fields:**

\`\`\`json
{
  "pathway": "A",
  
  "scoring_breakdown": {
    "pathway_a": {
      "fuel_type_gate": {"points": 2, "passed": true, "evidence": "..."},
      "substance_gate": {
        "passed": true,
        "specific_adoption": "WHO + WHAT details",
        "measurable_data": "Quantified metrics",
        "proof_progress": "Progress or market-wide impact"
      },
      "operational_deployment": {"points": 3, "evidence": "..."},
      "technology_validation": {"points": 3, "evidence": "..."},
      "sales_opportunity": {"points": 0, "evidence": null},
      "market_intelligence": {"points": 2, "evidence": "..."},
      "oem_breakthrough": {"points": 0, "evidence": null},
      "strategic_relevance": {"points": 1, "evidence": "..."}
    },
    
    "pathway_b": {
      "vip_confirmation": "VIP entity name",
      "project_scale": {"points": 5, "evidence": "..."},
      "timeline_urgency": {"points": 3, "evidence": "..."},
      "decarbonization_commitment": {"points": 0, "evidence": null},
      "strategic_positioning": {"points": 2, "evidence": "..."}
    },
    
    "pathway_c": {
      "policy_scale": {"points": 5, "evidence": "..."},
      "timeline_implementation": {"points": 3, "evidence": "..."},
      "syntech_alignment": {"points": 3, "evidence": "..."},
      "market_opportunity": {"points": 2, "evidence": "..."}
    }
  },
  
  "strategic_summary": "1-2 sentence summary of why this matters to Syntech",
  "key_highlights": [
    "Bullet point 1",
    "Bullet point 2",
    "Bullet point 3"
  ],
  "recommended_action": "What Syntech should do with this intelligence"
}
\`\`\`

**Do NOT include:**
- ❌ \`total_score\` (code node calculates this)
- ❌ \`decision\` (code node calculates this)
- ❌ \`priority_band\` (code node calculates this)
- ❌ \`threshold_met\` (code node calculates this)

---

## CRITICAL REMINDERS - TIM'S THINKING

**From Transcripts:**

1. **Context doesn't matter if PROOF exists**
   - "Strong evidence that what we're doing matters... even though we're not into marine"
   - Festival, maritime, aviation, hydrogen+B100 - all prove the fuel works

2. **"We know that anyway" = reject**
   - Generic info easily found via Google has no value
   - Novel intelligence only

3. **Obstacles only matter if market-wide**
   - "It's just ongoing stuff that has no relevance to us whatsoever"
   - One company's problems ≠ Syntech's problems

4. **Adoption signals matter**
   - "If someone's doing something we're not aware of, we'd like to know"
   - New applications, unexpected sectors using biofuel

5. **OEM approvals = market expansion**
   - Don't need deployment metrics to be valuable
   - Opens addressable market

6. **UCO intelligence valuable everywhere**
   - Even in wrong sectors if it shows feedstock dynamics
   - Supply, pricing, collection all matter

7. **Paywalled headlines count**
   - If headline has specifics, substance exists
   - "Swedish RD demand record high" = actionable

8. **VIP infrastructure = fuel demand**
   - £10bn construction project = equipment needs fuel
   - Don't need "biofuel" mentioned

**Philosophy**: Think like Tim - "Does this help us make better business decisions, or is it just nice to know?"`,
                },
            ],
        },
        batching: {
            batchSize: 10,
            delayBetweenBatches: 1000,
        },
    };

    @node({
        id: 'a2952f67-b16b-40bf-a0b4-4c01671320cf',
        name: 'Aggregate',
        type: 'n8n-nodes-base.aggregate',
        version: 1,
        position: [3888, 5328],
    })
    Aggregate = {
        aggregate: 'aggregateAllItemData',
        destinationFieldName: 'articles',
        options: {},
    };

    @node({
        id: '12489703-55c6-4ef1-b147-c726ce91e97b',
        name: 'Semantic Keyword Deduplication',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [4112, 5328],
        retryOnFail: true,
        waitBetweenTries: 5000,
    })
    SemanticKeywordDeduplication = {
        method: 'POST',
        url: 'https://syntech-semantic-article-deduplication-production.up.railway.app/deduplicate',
        sendBody: true,
        bodyParameters: {
            parameters: [
                {
                    name: 'articles',
                    value: '={{ $json.articles.map(a => ({ ...a, id: a.url })) }}',
                },
                {
                    name: 'similarity_threshold',
                    value: '0.70',
                },
            ],
        },
        options: {},
    };

    @node({
        id: 'bb03a775-6b06-4c54-ae66-74506e0897cf',
        name: 'Sticky Note1',
        type: 'n8n-nodes-base.stickyNote',
        version: 1,
        position: [3872, 5152],
    })
    StickyNote1 = {
        content: `## Semantic Deduplication
This performs semantic deduplication, which uses keywords to create content clusters, selecting the best quality content and reducing the overall number of articles. `,
        height: 336,
        width: 592,
    };

    @node({
        id: 'a1eb0ecf-f382-463b-8e8e-bcdc7b21964e',
        name: 'Deduplicated Articles',
        type: 'n8n-nodes-base.splitOut',
        version: 1,
        position: [4336, 5328],
    })
    DeduplicatedArticles = {
        fieldToSplitOut: 'selected_articles',
        options: {},
    };

    @node({
        id: '93d95a0d-49a9-4e70-a890-c950d7836692',
        name: 'Get Default Platform Prompts',
        type: 'n8n-nodes-base.notion',
        version: 2.2,
        position: [9168, 5504],
        credentials: { notionApi: { id: 'k0ZwGrqySi9Wayf7', name: 'Stephen Notion account' } },
        executeOnce: true,
    })
    GetDefaultPlatformPrompts = {
        resource: 'databasePage',
        operation: 'getAll',
        databaseId: {
            __rl: true,
            value: '27c785c0-cfab-810e-9c97-cefeee3d04b3',
            mode: 'list',
            cachedResultName: 'Syntech Platform Prompts',
            cachedResultUrl: 'https://www.notion.so/27c785c0cfab810e9c97cefeee3d04b3',
        },
        returnAll: true,
        filterType: 'manual',
        filters: {
            conditions: [
                {
                    key: 'Set Default|checkbox',
                    condition: 'equals',
                    checkboxValue: true,
                },
            ],
        },
        options: {},
    };

    @node({
        id: '41af1c20-757d-4551-a3da-7f07953fda63',
        name: 'Get Default Image Prompts',
        type: 'n8n-nodes-base.notion',
        version: 2.2,
        position: [9168, 5696],
        credentials: { notionApi: { id: 'k0ZwGrqySi9Wayf7', name: 'Stephen Notion account' } },
        executeOnce: true,
    })
    GetDefaultImagePrompts = {
        resource: 'databasePage',
        operation: 'getAll',
        databaseId: {
            __rl: true,
            value: '28e785c0-cfab-81e1-af77-eeb6e59c00ee',
            mode: 'list',
            cachedResultName: 'Syntech Image Prompts',
            cachedResultUrl: 'https://www.notion.so/28e785c0cfab81e1af77eeb6e59c00ee',
        },
        returnAll: true,
        filterType: 'manual',
        filters: {
            conditions: [
                {
                    key: 'Set Default|checkbox',
                    condition: 'equals',
                    checkboxValue: true,
                },
            ],
        },
        options: {},
    };

    @node({
        id: 'db3fd131-2e2b-4e9c-ab9c-7f3046fa9bd2',
        name: 'Aggregate Image Prompts',
        type: 'n8n-nodes-base.aggregate',
        version: 1,
        position: [9456, 5696],
        alwaysOutputData: false,
    })
    AggregateImagePrompts = {
        aggregate: 'aggregateAllItemData',
        destinationFieldName: 'image_prompts',
        options: {},
    };

    @node({
        id: 'ba1d00e4-d26b-4377-8552-450591f81784',
        name: 'Aggregate Platform Prompts',
        type: 'n8n-nodes-base.aggregate',
        version: 1,
        position: [9456, 5504],
        alwaysOutputData: false,
    })
    AggregatePlatformPrompts = {
        aggregate: 'aggregateAllItemData',
        destinationFieldName: 'platform_prompts',
        options: {},
    };

    @node({
        id: 'd8e68ea1-09c2-4e2f-9666-0a3f569bedd6',
        name: 'Set Platform Prompts',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [9680, 5504],
    })
    SetPlatformPrompts = {
        assignments: {
            assignments: [
                {
                    id: 'b20a8269-4945-40a0-bb84-eefa6c0faf09',
                    name: 'platform_prompt_ids',
                    value: '={{ $json.platform_prompts.map(item => item.id) }}',
                    type: 'array',
                },
            ],
        },
        options: {},
    };

    @node({
        id: 'e08cdb46-e3d8-4035-961e-8f7e1fc47a3f',
        name: 'Set Image Prompts',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [9680, 5696],
    })
    SetImagePrompts = {
        assignments: {
            assignments: [
                {
                    id: '13dc9af4-0b89-4421-a0c4-218b77db7fe5',
                    name: 'image_prompt_ids',
                    value: '={{ $json.image_prompts.map(item => item.id) }}',
                    type: 'array',
                },
            ],
        },
        options: {},
    };

    @node({
        id: '454fa126-000f-472e-9e91-f86def8e46b6',
        name: 'Final Input',
        type: 'n8n-nodes-base.merge',
        version: 3.2,
        position: [10400, 6064],
    })
    FinalInput = {
        mode: 'combine',
        combineBy: 'combineAll',
        options: {},
    };

    @node({
        id: '3f1ada83-661f-495b-b928-6469790da904',
        name: 'Image and Platform Prompts',
        type: 'n8n-nodes-base.merge',
        version: 3.2,
        position: [9904, 5664],
    })
    ImageAndPlatformPrompts = {};

    @node({
        id: '1d5bfb68-51d3-4525-9c07-9ae9b64ecba8',
        name: 'Default Article Outputs',
        type: 'n8n-nodes-base.aggregate',
        version: 1,
        position: [10128, 5664],
    })
    DefaultArticleOutputs = {
        aggregate: 'aggregateAllItemData',
        options: {},
    };

    @node({
        id: 'b481687f-8e6b-4c7e-8464-83b5163c898b',
        name: 'Sticky Note2',
        type: 'n8n-nodes-base.stickyNote',
        version: 1,
        position: [9088, 5392],
    })
    StickyNote2 = {
        content: `## Set default outputs
This add default content and image types to each article
`,
        height: 496,
        width: 1216,
    };

    @node({
        id: '2181d00d-324a-4ab9-a68e-5c9a97f1a166',
        name: 'OpenAI Chat Model1',
        type: '@n8n/n8n-nodes-langchain.lmChatOpenAi',
        version: 1.3,
        position: [4720, 5568],
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
            temperature: 0,
        },
    };

    @node({
        id: '1db5b244-5241-4297-8254-6405b00416f0',
        name: 'OpenAI Chat Model',
        type: '@n8n/n8n-nodes-langchain.lmChatOpenAi',
        version: 1.3,
        position: [5312, 5552],
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
            temperature: 0,
        },
    };

    @node({
        id: '0f968e34-c627-4282-8728-c85fff94ac03',
        name: 'OpenAI Chat Model2',
        type: '@n8n/n8n-nodes-langchain.lmChatOpenAi',
        version: 1.3,
        position: [6000, 5360],
        credentials: { openAiApi: { id: 'NoEKitspBJb0zQrp', name: 'Syntech GM OpenAi account' } },
    })
    OpenaiChatModel2 = {
        model: {
            __rl: true,
            value: 'gpt-4.1-nano',
            mode: 'list',
            cachedResultName: 'gpt-4.1-nano',
        },
        builtInTools: {},
        options: {
            temperature: 0,
        },
    };

    @node({
        id: '96ae998e-18bf-4974-ab25-dc0baa409ae3',
        name: 'OpenAI Chat Model3',
        type: '@n8n/n8n-nodes-langchain.lmChatOpenAi',
        version: 1.3,
        position: [6992, 5536],
        credentials: { openAiApi: { id: 'NoEKitspBJb0zQrp', name: 'Syntech GM OpenAi account' } },
    })
    OpenaiChatModel3 = {
        model: {
            __rl: true,
            value: 'gpt-5.2',
            mode: 'list',
            cachedResultName: 'gpt-5.2',
        },
        builtInTools: {},
        options: {
            temperature: 0,
        },
    };

    @node({
        id: '7a1a06b9-d040-412f-9e90-8268a8b72ca9',
        name: 'Anthropic Chat Model1',
        type: '@n8n/n8n-nodes-langchain.lmChatAnthropic',
        version: 1.3,
        position: [7120, 5168],
        credentials: { anthropicApi: { id: '0c1nNLaJWpeD3Cqz', name: 'Syntech GM Anthropic account' } },
    })
    AnthropicChatModel1 = {
        model: {
            __rl: true,
            value: 'claude-sonnet-4-5-20250929',
            mode: 'list',
            cachedResultName: 'Claude Sonnet 4.5',
        },
        options: {
            temperature: 0,
        },
    };

    @node({
        id: 'ddd5c731-c662-4980-96c1-c61b0fe83482',
        name: 'OpenAI Chat Model4',
        type: '@n8n/n8n-nodes-langchain.lmChatOpenAi',
        version: 1.3,
        position: [6960, 5168],
        credentials: { openAiApi: { id: 'NoEKitspBJb0zQrp', name: 'Syntech GM OpenAi account' } },
    })
    OpenaiChatModel4 = {
        model: {
            __rl: true,
            value: 'gpt-5.2',
            mode: 'list',
            cachedResultName: 'gpt-5.2',
        },
        builtInTools: {},
        options: {
            temperature: 0,
        },
    };

    @node({
        id: '2182408a-3e3b-4aa5-b6e6-488a65ed2c0c',
        name: 'Sonnet 4.5 T0.',
        type: '@n8n/n8n-nodes-langchain.lmChatAnthropic',
        version: 1.3,
        position: [6816, 5168],
        credentials: { anthropicApi: { id: '0c1nNLaJWpeD3Cqz', name: 'Syntech GM Anthropic account' } },
    })
    Sonnet45T0 = {
        model: {
            __rl: true,
            value: 'claude-sonnet-4-5-20250929',
            mode: 'list',
            cachedResultName: 'Claude Sonnet 4.5',
        },
        options: {
            temperature: 0,
        },
    };

    @node({
        id: '65a79c64-e22c-4dec-9f7e-4d727811eb5b',
        name: 'Code in JavaScript',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [11328, 6528],
    })
    CodeInJavascript = {
        jsCode: `return {
  "data": [
    {
      "platform_prompt_ids": [
        "2b7785c0-cfab-8096-afb4-ed4f01eee75c"
      ]
    },
    {
      "image_prompt_ids": [
        "2e6785c0-cfab-8010-8513-e4af8c17e77f",
        "2e7785c0-cfab-8060-bd47-ced887736f8a",
        "2e7785c0-cfab-8011-b3de-e1e60aa875d7",
        "2e7785c0-cfab-80ac-94d1-ddc5568bc98b"
      ]
    }
  ],
  "title": "How Sizewell C nuclear project can help UK ‘take back control of energy supply’ amid volatile market",
  "content": "The government has announced plans to accelerate planning approvals for the Sizewell C nuclear project and a major sustainable aviation fuel (SAF) plant.\\n\\nMinisters have designated the Environment Agency as the “lead environmental regulator” for the nuclear power station on the Suffolk coast and Lighthouse Green Fuels, a Teesside facility producing green fuel for aeroplanes. \\n\\nThis aims to streamline a process where developers typically engage with multiple bodies – including Natural England, the Marine Management Organisation, and Forestry England – a system often leading to costly delays in securing planning approval.\\n\\nThe Environment Agency will now act as a single point of contact, coordinating all environmental checks on the projects’ potential impact on nature. \\n\\nThe Department for Environment, Food and Rural Affairs (Defra) has, however, assured that this change will not lead to a watering down of green standards, as the agency will co-ordinate with the other regulators on all the same assessments.\\n\\nConstruction works on the site of the new Sizewell C nuclear power plant in Suffolk (REUTERS/Chris Radburn/File Photo)\\n\\nMinisters say Sizewell C could supply six million homes with nuclear energy, reducing England’s reliance on foreign fossil fuel imports and its exposure to volatile prices.\\n\\nIf approved, the Lighthouse Green Fuels project will become Europe’s largest SAF plant for fuels made from sources such as agricultural waste, forestry residues, municipal solid waste and used cooking oils instead of food crops.\\n\\nEnvironment Secretary Emma Reynolds said: “We are taking back control of our energy supply to bring stability for families and create skilled jobs for local people, without compromising on environmental protections.\\n\\n“Global shocks from conflicts in Ukraine and the Middle East show that relying on a volatile global fossil fuel market is simply not sustainable for Britain.\\n\\n“These measures are a win-win for energy security, nature and for keeping bills down in the long-run.”\\n\\nIt comes amid the Government’s wider efforts to remove almost all fossil fuels from the UK’s electricity generation by 2030, as well as overhaul the planning system to speed up the rollout of new energy and infrastructure projects.\\n\\nLast month, Energy Secretary Ed Miliband unveiled plans to speed up new nuclear power projects by overhauling regulations and cutting costs as part of the Government’s response to an independent review, led by former Office of Fair Trading boss John Fingleton.\\n\\nMinisters said they will implement some recommendations from the review by the end of the year, which includes appointing a lead regulator to reduce bureaucracy in the planning process.\\n\\nWhile the Government will not carry forward the recommendation to water down regulations that protect the country’s most important habitats, green groups said concerns and uncertainties remain over how the reforms could affect environmental protections.\\n\\nMina Golshan, safety, security and assurance director at Sizewell C, said: “Simplifying regulation like this will lead to better outcomes for the environment, greater efficiencies for our project, and better value for consumers.\\n\\n“It gives us a simple framework to build on our already constructive relationship with the Environment Agency – and we embrace the opportunity to demonstrate how regulation can work more effectively and efficiently for both project delivery and environmental protection.”\\n\\nNoaman Al Adhami, UK country head for Alfanar Projects, the developers behind Lighthouse Green Fuels, said: “We welcome the opportunity to support Defra’s lead environmental regulator pilot, which represents an important step forward in streamlining engagement with statutory bodies and accelerating the delivery of major infrastructure projects.\\n\\n“By enabling earlier, more co-ordinated regulatory input, this initiative will help unlock investment and support the timely progression of projects like Lighthouse Green Fuels as we advance towards construction.”\\n\\n## Duplicate Articles:\\n\\nTitle 1: UK power station ‘could supply up to six million homes with nuclear energy’\\nSummary 1: The UK government will streamline approvals for Sizewell C nuclear plant, supplying six million homes, and Europe's largest sustainable aviation fuel plant, aiming to boost energy security and reduce fossil fuel reliance by 2030.\\nUrl 1: https://www.independent.co.uk/bulletin/news/mucler-energy-uk-sizewell-c-lighthouse-green-fuels-b2954146.html",
  "url": "https://www.independent.co.uk/news/uk/politics/sizewell-c-nuclear-energy-fuel-iran-middle-east-uk-b2953802.html",
  "summary": "The UK government plans to fast-track Sizewell C nuclear plant and a green aviation fuel facility, aiming to supply six million homes, reduce reliance on imports, and enhance energy security while maintaining environmental standards.",
  "search_query": "Sizewell",
  "publication_date": "2026-04-08T17:30:00.000-04:00",
  "prompt": null,
  "additional_formats": null,
  "source": "Website",
  "source_name": "Sizewell",
  "mode": null,
  "relevance_score": null,
  "reason": null,
  "analysis": {
    "pathway": "B",
    "scoring_breakdown": {
      "pathway_a": {
        "fuel_type_gate": {
          "points": 0,
          "passed": false,
          "evidence": "Article mentions SAF (sustainable aviation fuel) but this is not Syntech's market. SAF is aviation-focused, not construction/logistics biodiesel."
        },
        "substance_gate": {
          "passed": false,
          "specific_adoption": "Lighthouse Green Fuels SAF plant mentioned but not operational - still in planning/approval stage",
          "measurable_data": "Europe's largest SAF plant claim, but no deployment volumes or operational metrics",
          "proof_progress": "Planning acceleration announced, not operational deployment"
        },
        "operational_deployment": {
          "points": 0,
          "evidence": "No operational deployment of biodiesel in construction or logistics mentioned in article"
        },
        "technology_validation": {
          "points": 0,
          "evidence": "No technology validation evidence for biodiesel applications"
        },
        "sales_opportunity": {
          "points": 0,
          "evidence": null
        },
        "market_intelligence": {
          "points": 0,
          "evidence": null
        },
        "oem_breakthrough": {
          "points": 0,
          "evidence": null
        },
        "strategic_relevance": {
          "points": 0,
          "evidence": "Article focuses on SAF and nuclear, not biodiesel for construction/logistics"
        }
      },
      "pathway_b": {
        "vip_confirmation": null,
        "project_scale": {
          "points": 5,
          "evidence": null
        },
        "timeline_urgency": {
          "points": 3,
          "evidence": null
        },
        "decarbonization_commitment": {
          "points": 3,
          "evidence": null
        },
        "strategic_positioning": {
          "points": 2,
          "evidence": null
        }
      },
      "pathway_c": {
        "policy_scale": {
          "points": 0,
          "evidence": null
        },
        "timeline_implementation": {
          "points": 0,
          "evidence": null
        },
        "syntech_alignment": {
          "points": 0,
          "evidence": null
        },
        "market_opportunity": {
          "points": 0,
          "evidence": null
        }
      }
    },
    "strategic_summary": "Sizewell C planning acceleration signals imminent construction phase for major VIP customer, creating significant fuel demand opportunity for multi-year infrastructure project aligned with UK decarbonization goals.",
    "key_highlights": [
      "Government fast-tracking Sizewell C approvals with Environment Agency as lead regulator - construction phase approaching",
      "Major infrastructure project supplying six million homes - multi-year equipment and fuel demand",
      "Explicit government commitment to energy security and fossil fuel reduction creates procurement opportunity for drop-in biofuel solutions"
    ],
    "recommended_action": "Proactive outreach to Sizewell C procurement team regarding biodiesel supply for construction equipment fleet. Position Syntech as aligned with project's energy security and decarbonization objectives, emphasizing drop-in fuel capability for NRMM applications.",
    "total_score": 13,
    "decision": "SURFACE",
    "priority_band": "MUST-READ",
    "threshold_met": true,
    "active_scoring_components": "Project Scale: null | Timeline: null | Decarbonization: null | Positioning: null"
  }
}`,
    };

    @node({
        id: 'f0c83b5b-5f31-490e-8dc7-5adfd8d4d46b',
        name: 'Filter Articles By Topic2',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.2,
        position: [11536, 6528],
        credentials: {
            httpHeaderAuth: { id: 'kzydmFSpHI8T1Y9W', name: 'Syntech Classifier Bearer' },
            httpBearerAuth: { id: 'JmQByIdKZ85XtGwZ', name: 'Syntech Article Classifier Bearer' },
        },
        onError: 'continueErrorOutput',
        retryOnFail: true,
        maxTries: 3,
        waitBetweenTries: 5000,
    })
    FilterArticlesByTopic2 = {
        method: 'POST',
        url: 'https://syntech-article-classifier-production.up.railway.app/classify',
        authentication: 'genericCredentialType',
        genericAuthType: 'httpBearerAuth',
        sendBody: true,
        specifyBody: 'json',
        jsonBody: '={{ { "article": $json.toJsonString() } }}',
        options: {},
    };

    @node({
        id: 'd2eb0771-55b3-47cb-b69f-8ddb4bccb06a',
        name: 'Filter Articles By Topic',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.2,
        position: [11504, 6240],
        credentials: {
            httpHeaderAuth: { id: 'kzydmFSpHI8T1Y9W', name: 'Syntech Classifier Bearer' },
            httpBearerAuth: { id: 'JmQByIdKZ85XtGwZ', name: 'Syntech Article Classifier Bearer' },
        },
        onError: 'continueErrorOutput',
        retryOnFail: true,
        maxTries: 3,
        waitBetweenTries: 5000,
    })
    FilterArticlesByTopic = {
        method: 'POST',
        url: 'https://syntech-article-classifier-production.up.railway.app/classify',
        authentication: 'genericCredentialType',
        genericAuthType: 'httpBearerAuth',
        sendBody: true,
        specifyBody: 'json',
        jsonBody: '={{ { "article": $json.toJsonString() } }}',
        options: {},
    };

    @node({
        id: 'ec1bcba3-f3db-4403-b7b1-80764c383b10',
        name: 'Filter Articles By Topic1',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.2,
        position: [11744, 5344],
        credentials: {
            httpHeaderAuth: { id: 'kzydmFSpHI8T1Y9W', name: 'Syntech Classifier Bearer' },
            httpBearerAuth: { id: 'JmQByIdKZ85XtGwZ', name: 'Syntech Article Classifier Bearer' },
        },
        onError: 'continueErrorOutput',
        retryOnFail: true,
        maxTries: 3,
        waitBetweenTries: 5000,
    })
    FilterArticlesByTopic1 = {
        method: 'POST',
        url: 'https://syntech-article-classifier-production.up.railway.app/classify',
        authentication: 'genericCredentialType',
        genericAuthType: 'httpBearerAuth',
        sendBody: true,
        specifyBody: 'json',
        jsonBody: '={{ { "article": $json.toJsonString() } }}',
        options: {},
    };

    // =====================================================================
    // CONTENT SOURCING MICROSERVICE (REPLACEMENT FOR SUB-WORKFLOWS)
    // =====================================================================
    // This node replaces all the executeWorkflow calls to:
    // - CallLinkedinSearchProfileKeywordCompany
    // - CallTavilyKeywordSearch
    // - CallSearchInstagramPage
    // - CallSearchWebsiteFromForm
    // - CallSearchTwitterXPostAndKeyword
    // - CallRssWebsiteSearchNoRssUrl
    // - CallRssWebsiteSearchWithRssUrl
    // - CallSearchGoogleSyntech
    //
    // To use: connect MatchSources outputs to this node, then wire output to Merge
    // =====================================================================

    @node({
        id: 'c5f8e3a2-9d7b-4c1e-8f6a-2b3d4e5f6a7b',
        name: 'Content Sourcing Service',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.3,
        position: [2064, 4400],
        onError: 'continueErrorOutput',
        retryOnFail: true,
        maxTries: 3,
        waitBetweenTries: 5000,
    })
    ContentSourcingService = {
        method: 'POST',
        url: 'https://syntech-content-sourcing-production.up.railway.app/search',
        authentication: 'genericCredentialType',
        genericAuthType: 'httpHeaderAuth',
        sendHeaders: true,
        headerParameters: {
            parameters: [
                {
                    name: 'Content-Type',
                    value: 'application/json',
                },
                {
                    name: 'X-Request-Id',
                    value: '={{ $execution.id }}-{{ $itemIndex }}',
                },
            ],
        },
        sendBody: true,
        specifyBody: 'json',
        jsonBody: `={
  "source_type": {{ JSON.stringify($json.property_source) }},
  "url_or_keyword": {{ JSON.stringify($json.property_url || $json.url || $json.name) }},
  "source_name": {{ JSON.stringify($json.name) }},
  "source_category": {{ JSON.stringify($json.property_category || "") }},
  "prompt": {{ JSON.stringify($json.property_keyword_category || null) }},
  "test_mode": false
}`,
        options: {
            response: {
                response: {
                    responseFormat: 'json',
                },
            },
            timeout: 120000,
        },
    };

    // =====================================================================
    // ROUTAGE ET CONNEXIONS
    // =====================================================================

    @links()
    defineRouting() {
        this.ScheduleTrigger.out(0).to(this.GetAllSources.in(0));
        this.Merge.out(0).to(this.IsContentEmpty.in(0));
        this.GetAllSources.out(0).to(this.GetActiveSources.in(0));
        this.MatchSources.out(0).to(this.CallRssWebsiteSearchWithRssUrl.in(0));
        this.MatchSources.out(0).to(this.NoRssUrlAvailable.in(0));
        this.MatchSources.out(1).to(this.CallLinkedinSearchProfileKeywordCompany.in(0));
        this.MatchSources.out(2).to(this.CallTavilyKeywordSearch.in(0));
        this.MatchSources.out(2).to(this.Limit16Items.in(0));
        this.MatchSources.out(3).to(this.CallSearchInstagramPage.in(0));
        this.MatchSources.out(4).to(this.CallSearchWebsiteFromForm.in(0));
        this.MatchSources.out(5).to(this.CallSearchTwitterXPostAndKeyword.in(0));
        this.GetActiveSources.out(0).to(this.IfHighPriority.in(0));
        this.GetAllResults.out(0).to(this.RemoveDuplicates.in(1));
        this.RemoveDuplicates.out(0).to(this.IfFromForm.in(0));
        this.IfHighPriority.out(0).to(this.Merge3.in(0));
        this.IfHighPriority.out(1).to(this.Randomise.in(0));
        this.Randomise.out(0).to(this.Get15Ideas.in(0));
        this.Evaluation.out(0).to(this.SetOutputInEvaluationGoogleSheet.in(0));
        this.Evaluation.out(1).to(this.SelectFields.in(0));
        this.RunEvaluation.out(0).to(this.GetAllSources1.in(0));
        this.SetOutputInEvaluationGoogleSheet.out(0).to(this.Evaluation1.in(0));
        this.IfPublicationDate.out(0).to(this.AddContentWithDate1.in(0));
        this.IfPublicationDate.out(1).to(this.AddContentWithoutDate1.in(0));
        this.IfTextLongerThan2000Chars.out(0).to(this.LoopOverItems.in(0));
        this.IfTextLongerThan2000Chars.out(1).to(this.CheckSourcesExecuted.in(0));
        this.SplitsTextInSmallChuncks.out(0).to(this.If2.in(0));
        this.If2.out(0).to(this.IfPublicationDate2.in(0));
        this.If2.out(1).to(this.Merge1.in(1));
        this.Merge1.out(0).to(this.AddContentToPost.in(0));
        this.LoopOverItems.out(0).to(this.NoOperationDoNothing.in(0));
        this.LoopOverItems.out(1).to(this.CheckSourcesExecuted1.in(0));
        this.IfPublicationDate2.out(0).to(this.AddContentWithDate.in(0));
        this.IfPublicationDate2.out(1).to(this.AddContentWithoutDate.in(0));
        this.SetArticleUrl.out(0).to(this.Merge1.in(0));
        this.AddContentToPost.out(0).to(this.LoopOverItems.in(0));
        this.AddContentToPost.out(1).to(this.SendAMessage2.in(0));
        this.Sources.out(0).to(this.MatchSources.in(0));
        this.Merge3.out(0).to(this.Limit1.in(0));
        this.FormSubmission1.out(0).to(this.Sources.in(0));
        this.IfFromForm.out(0).to(this.SelectFields.in(0));
        this.IfFromForm.out(1).to(this.Aggregate.in(0));
        this.SelectFields.out(0).to(this.Filter.in(0));
        this.SelectFields.out(0).to(this.GetDefaultPlatformPrompts.in(0));
        this.SelectFields.out(0).to(this.GetDefaultImagePrompts.in(0));
        this.SelectFields.out(0).to(this.FinalInput.in(1));
        this.RemoveDuplicates1.out(0).to(this.AddContentIdeaToEvaluationTable1.in(0));
        this.SetGoogleSheetFields.out(0).to(this.RemoveDuplicates1.in(0));
        this.GetAllIdeasFromEvaluationTable2.out(0).to(this.RemoveDuplicates1.in(1));
        this.IsContentEmpty.out(0).to(this.RemoveDuplicates3.in(0));
        this.IfFromForm1.out(0).to(this.IfTextLongerThan2000Chars.in(0));
        this.IfFromForm1.out(1).to(this.ValidContentOnlyScoreAbove2.in(0));
        this.RemoveDuplicates3.out(0).to(this.GetAllResults.in(0));
        this.RemoveDuplicates3.out(0).to(this.RemoveDuplicates.in(0));
        this.Sort.out(0).to(this.Get100BestArticles.in(0));
        this.ValidContentOnlyScoreAbove2.out(0).to(this.IfTextLongerThan2000Chars.in(0));
        this.Limit1.out(0).to(this.MatchSources.in(0));
        this.GetAllSources1.out(0).to(this.MatchInputFormat.in(0));
        this.Filter.out(0).to(this.SetGoogleSheetFields.in(0));
        this.Filter.out(0).to(this.GetAllIdeasFromEvaluationTable2.in(0));
        this.UrgentlyWatchedList.out(0).to(this.ScrapeAUrlAndGetItsContent3.in(0));
        this.ManuallyTriggerContentEngine.out(0).to(this.GetAllSources.in(0));
        this.ScrapeAUrlAndGetItsContent3.out(0).to(this.IfNotError3.in(0));
        this.IfNotError3.out(0).to(this.CreateSummaryAndTitle10.in(0));
        this.IfNotError3.out(1).to(this.FailedUrls1.in(0));
        this.FailedUrls1.out(0).to(this.ExtractContent3.in(0));
        this.ExtractContent3.out(0).to(this.ExtractDate4.in(0));
        this.Markdown2.out(0).to(this.Filter6.in(0));
        this.ExtractDate4.out(0).to(this.Markdown2.in(0));
        this.CreateSummaryAndTitle10.out(0).to(this.RssSearchFields2.in(0));
        this.Filter6.out(0).to(this.CreateSummaryAndTitle11.in(0));
        this.Merge11.out(0).to(this.Merge.in(0));
        this.RssSearchFields2.out(0).to(this.Merge11.in(0));
        this.CreateSummaryAndTitle11.out(0).to(this.RssSearchFields3.in(0));
        this.RssSearchFields3.out(0).to(this.Merge11.in(1));
        this.AddContentWithDate.out(0).to(this.SetArticleUrl.in(0));
        this.AddContentWithDate.out(1).to(this.SendAMessage1.in(0));
        this.AddContentWithoutDate.out(0).to(this.SetArticleUrl.in(0));
        this.AddContentWithoutDate.out(1).to(this.SendAMessage.in(0));
        this.MapDataForNotion.out(0).to(this.IfPublicationDate.in(0));
        this.MapDataForNotion1.out(0).to(this.SplitsTextInSmallChuncks.in(0));
        this.CheckSourcesExecuted.out(0).to(this.MapDataForNotion.in(0));
        this.CheckSourcesExecuted.out(1).to(this.FilterArticlesByTopic.in(0));
        this.CheckSourcesExecuted1.out(0).to(this.MapDataForNotion1.in(0));
        this.CheckSourcesExecuted1.out(1).to(this.FilterArticlesByTopic1.in(0));
        this.Get15Ideas.out(0).to(this.Merge3.in(1));
        this.CallLinkedinSearchProfileKeywordCompany.out(0).to(this.Merge.in(3));
        this.CallTavilyKeywordSearch.out(0).to(this.Merge.in(5));
        this.CallSearchInstagramPage.out(0).to(this.Merge.in(6));
        this.CallSearchWebsiteFromForm.out(0).to(this.Merge.in(7));
        this.CallSearchTwitterXPostAndKeyword.out(0).to(this.Merge.in(8));
        this.CallRssWebsiteSearchNoRssUrl.out(0).to(this.Merge.in(1));
        this.CallRssWebsiteSearchWithRssUrl.out(0).to(this.Merge.in(2));
        this.NoRssUrlAvailable.out(0).to(this.CallRssWebsiteSearchNoRssUrl.in(0));
        this.SendAMessage1.out(0).to(this.LoopOverItems.in(0));
        this.SendAMessage.out(0).to(this.LoopOverItems.in(0));
        this.AddContentWithDate1.out(1).to(this.SendAMessage3.in(0));
        this.AddContentWithoutDate1.out(1).to(this.SendAMessage4.in(0));
        this.SendAMessage6.out(0).to(this.LoopOverItems.in(0));
        this.SendAMessage2.out(0).to(this.LoopOverItems.in(0));
        this.Get100BestArticles.out(0).to(this.Evaluation.in(0));
        this.CallSearchGoogleSyntech.out(0).to(this.Merge.in(4));
        this.DeduplicatedArticles.out(0).to(this.ClassifyViaRelevanceService.in(0));
        this.ClassifyViaRelevanceService.out(0).to(this.PerformFinalCalculation.in(0));
        this.PerformFinalCalculation.out(0).to(this.ThresholdMet.in(0));
        this.Limit16Items.out(0).to(this.CallSearchGoogleSyntech.in(0));
        this.ThresholdMet.out(0).to(this.Sort.in(0));
        this.ThresholdMet.out(1).to(this.SelectFields1.in(0));
        this.MapDataForNotion2.out(0).to(this.MapDataForNotion3.in(0));
        this.MapDataForNotion3.out(0).to(this.AddContentWithDate2.in(0));
        this.AddContentWithDate2.out(0).to(this.AddContentWithDate3.in(0));
        this.Aggregate.out(0).to(this.SemanticKeywordDeduplication.in(0));
        this.SemanticKeywordDeduplication.out(0).to(this.DeduplicatedArticles.in(0));
        this.GetDefaultPlatformPrompts.out(0).to(this.AggregatePlatformPrompts.in(0));
        this.GetDefaultImagePrompts.out(0).to(this.AggregateImagePrompts.in(0));
        this.AggregateImagePrompts.out(0).to(this.SetImagePrompts.in(0));
        this.AggregatePlatformPrompts.out(0).to(this.SetPlatformPrompts.in(0));
        this.SetPlatformPrompts.out(0).to(this.ImageAndPlatformPrompts.in(0));
        this.SetImagePrompts.out(0).to(this.ImageAndPlatformPrompts.in(1));
        this.FinalInput.out(0).to(this.IfFromForm1.in(0));
        this.ImageAndPlatformPrompts.out(0).to(this.DefaultArticleOutputs.in(0));
        this.DefaultArticleOutputs.out(0).to(this.FinalInput.in(0));
        this.CodeInJavascript.out(0).to(this.FilterArticlesByTopic2.in(0));
        this.FilterArticlesByTopic.out(0).to(this.MapDataForNotion.in(0));
        this.FilterArticlesByTopic.out(1).to(this.SendAMessage5.in(0));
        this.FilterArticlesByTopic1.out(0).to(this.MapDataForNotion1.in(0));
        this.FilterArticlesByTopic1.out(1).to(this.SendAMessage6.in(0));

        this.Evaluation1.uses({
            ai_languageModel: this.OpenaiChatModel8.output,
        });
        this.CreateSummaryAndTitle10.uses({
            ai_languageModel: this.OpenaiChatModel15.output,
            ai_outputParser: this.StructuredOutputParser21.output,
        });
        this.CreateSummaryAndTitle11.uses({
            ai_languageModel: this.OpenaiChatModel16.output,
            ai_outputParser: this.StructuredOutputParser22.output,
        });
        this.StructuredOutputParser2.uses({
            ai_languageModel: this.AnthropicChatModel.output,
        });
        this.StructuredOutputParser27.uses({
            ai_languageModel: this.AnthropicChatModel1.output,
        });
        this.StructuredOutputParser.uses({
            ai_languageModel: this.AnthropicChatModel2.output,
        });
    }
}
