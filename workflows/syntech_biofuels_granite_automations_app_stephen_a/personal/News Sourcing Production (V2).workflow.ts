import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : News Sourcing Production (V2)
// Nodes   : 80  |  Connections: 91
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// ScheduleTrigger                    scheduleTrigger
// GetAllSources                      notion                     [creds]
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
// ManuallyTriggerContentEngine       webhook
// AddContentWithDate                 httpRequest                [onError→out(1)] [creds]
// AddContentWithoutDate              httpRequest                [onError→out(1)] [creds]
// StickyNote6                        stickyNote
// MapDataForNotion                   set
// MapDataForNotion1                  set
// CheckSourcesExecuted               if
// CheckSourcesExecuted1              if
// Get15Ideas                         limit
// SendAMessage1                      slack                      [creds]
// SendAMessage                       slack                      [creds]
// SendAMessage2                      slack                      [creds]
// SendAMessage3                      slack                      [creds]
// AddContentWithDate1                httpRequest                [onError→out(1)] [creds]
// SendAMessage4                      slack                      [creds]
// AddContentWithoutDate1             httpRequest                [onError→out(1)] [creds]
// SendAMessage5                      slack                      [creds]
// SendAMessage6                      slack                      [creds]
// ClassifyViaRelevanceService        httpRequest                [onError→out(1)] [creds] [retry]
// PerformFinalCalculation            code
// ThresholdMet                       if
// SelectFields1                      set
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
// FilterArticlesByTopic              httpRequest                [onError→out(1)] [creds] [retry]
// FilterArticlesByTopic1             httpRequest                [onError→out(1)] [creds] [retry]
// Get1000BestArticles                limit
// MapToContentSourcing               set
// SplitOutArticles                   splitOut
// CallContentSourcingBatch           httpRequest                [creds] [executeOnce] [retry]
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// ScheduleTrigger
//    → GetAllSources
//      → IfHighPriority
//        → Merge3
//          → Limit1
//            → MapToContentSourcing
//              → CallContentSourcingBatch
//                → SplitOutArticles
//                  → RemoveDuplicates3
//                    → GetAllResults
//                      → RemoveDuplicates.in(1)
//                        → IfFromForm
//                          → SelectFields
//                            → Filter
//                              → SetGoogleSheetFields
//                                → RemoveDuplicates1
//                                  → AddContentIdeaToEvaluationTable1
//                              → GetAllIdeasFromEvaluationTable2
//                                → RemoveDuplicates1.in(1) (↩ loop)
//                            → GetDefaultPlatformPrompts
//                              → AggregatePlatformPrompts
//                                → SetPlatformPrompts
//                                  → ImageAndPlatformPrompts
//                                    → DefaultArticleOutputs
//                                      → FinalInput
//                                        → IfFromForm1
//                                          → IfTextLongerThan2000Chars
//                                            → LoopOverItems
//                                              → NoOperationDoNothing
//                                             .out(1) → CheckSourcesExecuted1
//                                                → MapDataForNotion1
//                                                  → SplitsTextInSmallChuncks
//                                                    → If2
//                                                      → IfPublicationDate2
//                                                        → AddContentWithDate
//                                                          → SetArticleUrl
//                                                            → Merge1
//                                                              → AddContentToPost
//                                                                → LoopOverItems (↩ loop)
//                                                               .out(1) → SendAMessage2
//                                                                  → LoopOverItems (↩ loop)
//                                                         .out(1) → SendAMessage1
//                                                            → LoopOverItems (↩ loop)
//                                                       .out(1) → AddContentWithoutDate
//                                                          → SetArticleUrl (↩ loop)
//                                                         .out(1) → SendAMessage
//                                                            → LoopOverItems (↩ loop)
//                                                     .out(1) → Merge1.in(1) (↩ loop)
//                                               .out(1) → FilterArticlesByTopic1
//                                                  → MapDataForNotion1 (↩ loop)
//                                                 .out(1) → SendAMessage6
//                                                    → LoopOverItems (↩ loop)
//                                           .out(1) → CheckSourcesExecuted
//                                              → MapDataForNotion
//                                                → IfPublicationDate
//                                                  → AddContentWithDate1
//                                                   .out(1) → SendAMessage3
//                                                 .out(1) → AddContentWithoutDate1
//                                                   .out(1) → SendAMessage4
//                                             .out(1) → FilterArticlesByTopic
//                                                → MapDataForNotion (↩ loop)
//                                               .out(1) → SendAMessage5
//                                         .out(1) → ValidContentOnlyScoreAbove2
//                                            → IfTextLongerThan2000Chars (↩ loop)
//                            → GetDefaultImagePrompts
//                              → AggregateImagePrompts
//                                → SetImagePrompts
//                                  → ImageAndPlatformPrompts.in(1) (↩ loop)
//                            → FinalInput.in(1) (↩ loop)
//                         .out(1) → Aggregate
//                            → SemanticKeywordDeduplication
//                              → DeduplicatedArticles
//                                → ClassifyViaRelevanceService
//                                  → PerformFinalCalculation
//                                    → ThresholdMet
//                                      → Sort
//                                        → Get1000BestArticles
//                                          → Evaluation
//                                            → SetOutputInEvaluationGoogleSheet
//                                              → Evaluation1
//                                           .out(1) → SelectFields (↩ loop)
//                                     .out(1) → SelectFields1
//                    → RemoveDuplicates (↩ loop)
//       .out(1) → Randomise
//          → Get15Ideas
//            → Merge3.in(1) (↩ loop)
// RunEvaluation
//    → GetAllSources1
//      → MatchInputFormat
//        → ClassifyViaRelevanceService (↩ loop)
// FormSubmission1
//    → Sources
//      → MapToContentSourcing (↩ loop)
// ManuallyTriggerContentEngine
//    → GetAllSources (↩ loop)
//
// AI CONNECTIONS
// Evaluation1.uses({ ai_languageModel: OpenaiChatModel8 })
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'UzEv74M2D2q4z0Zx',
    name: 'News Sourcing Production (V2)',
    active: true,
    isArchived: false,
    projectId: 'U9sMeJya1DaokkjK',
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
        position: [720, 5200],
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
        id: '06283e28-ded7-4d6a-bb69-104879e2650c',
        name: 'Get All Sources',
        type: 'n8n-nodes-base.notion',
        version: 2.2,
        position: [944, 5296],
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
        filterType: 'manual',
        filters: {
            conditions: [
                {
                    key: 'Status|status',
                    condition: 'equals',
                    statusValue: 'Active',
                },
            ],
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
        position: [1136, 5296],
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
        position: [1360, 5376],
    })
    Randomise = {
        type: 'random',
    };

    @node({
        id: '00f0fcd4-ad96-4a0c-a1d9-e27c124a33a9',
        name: 'Match Input Format',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [4336, 5696],
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
        position: [5744, 5056],
    })
    Evaluation = {
        operation: 'checkIfEvaluating',
    };

    @node({
        id: '84ee2532-f9b0-461d-9f40-34aeb5705a38',
        name: 'Run Evaluation',
        type: 'n8n-nodes-base.evaluationTrigger',
        version: 4.6,
        position: [3888, 5696],
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
        position: [5968, 4960],
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
        position: [9056, 6032],
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
        position: [8160, 6048],
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
        position: [9280, 5136],
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
        position: [9504, 5136],
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
        position: [10400, 5232],
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
        position: [8384, 5712],
    })
    LoopOverItems = {
        options: {},
    };

    @node({
        id: 'e459002d-42c9-4f0f-a33a-a7a51b9c5926',
        name: 'If Publication Date2',
        type: 'n8n-nodes-base.if',
        version: 2.2,
        position: [9728, 5072],
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
        position: [10176, 5072],
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
        position: [10624, 5232],
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
        position: [2032, 5616],
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
        position: [8608, 5056],
    })
    NoOperationDoNothing = {};

    @node({
        id: '421e2ef3-e607-4251-b8f5-edd05ec198e5',
        name: 'Merge3',
        type: 'n8n-nodes-base.merge',
        version: 3.2,
        position: [1808, 5296],
    })
    Merge3 = {};

    @node({
        id: '75d3a83d-0fc4-4dc0-862a-9cae146b789e',
        webhookId: 'd7c4ad3a-52b4-46fd-b480-76a083a42ff2',
        name: 'Form Submission1',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [1808, 5616],
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
        position: [5968, 5632],
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
        position: [6768, 5104],
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
        position: [6544, 4944],
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
        position: [6544, 5136],
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
        id: '506bc082-0484-4e00-b910-4671ef7883b1',
        name: 'If From Form1',
        type: 'n8n-nodes-base.if',
        version: 2.2,
        position: [7712, 6048],
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
        position: [5296, 5056],
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
        position: [7936, 6160],
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
        position: [2032, 5296],
    })
    Limit1 = {
        maxItems: 1000,
    };

    @node({
        id: '56cf1c67-65e8-4b9e-952d-2e7ced1ac891',
        name: 'Get All Sources1',
        type: 'n8n-nodes-base.notion',
        version: 2.2,
        position: [4112, 5696],
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
        position: [6256, 5104],
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
        position: [6992, 5104],
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
        position: [6272, 4928],
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
        position: [6192, 4704],
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
        id: 'fbd58fff-1149-427d-8fa6-1e9003bd130e',
        webhookId: 'eda87c01-fe8a-42f6-a116-fa1b7eb6d165',
        name: 'Manually Trigger Content Engine',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [720, 5392],
    })
    ManuallyTriggerContentEngine = {
        httpMethod: 'POST',
        path: 'trigger-content-engine',
        options: {},
    };

    @node({
        id: '9bdc4191-c39c-4f8b-aad7-1f07382cd7ee',
        name: 'Add Content With Date',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.3,
        position: [9952, 4928],
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
          "name": "{{ $('Map Data for Notion1').item.json.topical_signature.topic_geo || 'n/a' }}"
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
        position: [9952, 5216],
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
        position: [2944, 5328],
    })
    StickyNote6 = {
        content: '## Remove Duplicates',
        height: 448,
        width: 912,
        color: 3,
    };

    @node({
        id: 'bacb4485-a644-4e3b-90dc-8e5166c776aa',
        name: 'Map Data for Notion',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [8832, 6032],
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
        position: [9056, 5136],
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
        position: [8384, 6128],
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
        position: [8608, 5248],
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
        position: [1584, 5376],
    })
    Get15Ideas = {
        maxItems: 15,
    };

    @node({
        id: 'a8d5cf74-7c76-460a-bf69-303cab44b415',
        webhookId: 'd98789a2-b2b3-4f8f-a4fb-e226aa1adb2e',
        name: 'Send a message1',
        type: 'n8n-nodes-base.slack',
        version: 2.3,
        position: [10176, 4880],
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
        position: [10176, 5264],
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
        position: [10848, 5488],
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
        position: [9504, 5936],
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
        position: [9280, 5936],
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
          "name": "{{ $json.topical_signature.topic_geo || 'n/a' }}"
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
        position: [9504, 6128],
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
        position: [9280, 6128],
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
        position: [8832, 6256],
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
        position: [9056, 5472],
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
        id: '8d7e2b14-5a9c-4f61-9b28-7c3e5d6a4b9f',
        name: 'Classify via Relevance Service',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.3,
        position: [4592, 5328],
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
            response: {
                response: {
                    responseFormat: 'json',
                },
            },
            timeout: 15000,
        },
    };

    @node({
        id: 'de16c7e4-12ec-47c4-a419-f4dde2ace718',
        name: 'Perform Final Calculation',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [4848, 5312],
    })
    PerformFinalCalculation = {
        mode: 'runOnceForEachItem',
        jsCode: `// Flatten the microservice envelope so downstream references
// (e.g. $('Perform Final Calculation').item.json.threshold_met) keep working
// without edits. The service returns { "analysis": {...} }; every field the
// legacy code node emitted at root now lives under .analysis.
// (TODO: remove this flatten when Notion mappers migrate to reading .analysis.*
// directly — tracked in docs/solutions/2026-n8n-to-microservice-cutover.md.)
return $json.analysis`,
    };

    @node({
        id: 'cfd3ef4a-d61c-48b0-9b2d-deac0398e6ef',
        name: 'Threshold Met?',
        type: 'n8n-nodes-base.if',
        version: 2.3,
        position: [5072, 5312],
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
        position: [5296, 5392],
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
        position: [6256, 5488],
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
        position: [6256, 5680],
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
        position: [6544, 5680],
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
        position: [6544, 5488],
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
        position: [6768, 5488],
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
        position: [6768, 5680],
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
        position: [7488, 6048],
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
        position: [6992, 5648],
    })
    ImageAndPlatformPrompts = {};

    @node({
        id: '1d5bfb68-51d3-4525-9c07-9ae9b64ecba8',
        name: 'Default Article Outputs',
        type: 'n8n-nodes-base.aggregate',
        version: 1,
        position: [7216, 5648],
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
        position: [6176, 5376],
    })
    StickyNote2 = {
        content: `## Set default outputs
This add default content and image types to each article
`,
        height: 496,
        width: 1216,
    };

    @node({
        id: 'd2eb0771-55b3-47cb-b69f-8ddb4bccb06a',
        name: 'Filter Articles By Topic',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.2,
        position: [8592, 6224],
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
        position: [8832, 5328],
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

    @node({
        id: '459fe455-d764-4f96-9805-54f8c37fbdd5',
        name: 'Get 1000 best articles',
        type: 'n8n-nodes-base.limit',
        version: 1,
        position: [5520, 5056],
    })
    Get1000BestArticles = {
        maxItems: 1000,
    };

    @node({
        id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        name: 'Map To Content Sourcing',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [2304, 5504],
    })
    MapToContentSourcing = {
        assignments: {
            assignments: [
                {
                    id: 'cs-source-type',
                    name: 'source_type',
                    value: '={{ $json.property_source }}',
                    type: 'string',
                },
                {
                    id: 'cs-url-or-keyword',
                    name: 'url_or_keyword',
                    value: '={{ $json.property_rss_feed || $json.property_url || $json.property_name }}',
                    type: 'string',
                },
                {
                    id: 'cs-source-name',
                    name: 'source_name',
                    value: '={{ $json.property_name }}',
                    type: 'string',
                },
                {
                    id: 'cs-source-category',
                    name: 'source_category',
                    value: '={{ $json.property_category || $json.property_keyword_category || "News" }}',
                    type: 'string',
                },
                {
                    id: 'cs-prompt',
                    name: 'prompt',
                    value: '={{ $json.prompt || null }}',
                    type: 'string',
                },
                {
                    id: 'cs-additional-formats',
                    name: 'additional_formats',
                    value: '={{ $json.additional_formats || null }}',
                    type: 'string',
                },
                {
                    id: 'cs-test-mode',
                    name: 'test_mode',
                    value: '={{ true }}',
                    type: 'boolean',
                },
            ],
        },
        options: {},
    };

    @node({
        id: 'c3d4e5f6-a7b8-9012-cdef-345678901234',
        name: 'Split Out Articles',
        type: 'n8n-nodes-base.splitOut',
        version: 1,
        position: [2784, 5504],
    })
    SplitOutArticles = {
        fieldToSplitOut: 'articles',
        options: {},
    };

    @node({
        id: 'bc8ebb5e-e97a-4b89-b5be-e1b3d34b1fdf',
        name: 'Call Content Sourcing Batch',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [2544, 5504],
        credentials: { httpBearerAuth: { id: 'e0bBYiHsQNeVlYmn', name: 'Syntech Content Sourcing Bearer' } },
        executeOnce: true,
        retryOnFail: true,
        waitBetweenTries: 5000,
    })
    CallContentSourcingBatch = {
        method: 'POST',
        url: 'https://syntech-content-sourcing-production.up.railway.app/search/batch',
        authentication: 'genericCredentialType',
        genericAuthType: 'httpBearerAuth',
        sendBody: true,
        specifyBody: 'json',
        jsonBody: `={
  "sources": {{ JSON.stringify($input.all().map(item => ({
    source_type: item.json.source_type,
    url_or_keyword: item.json.url_or_keyword,
    source_name: item.json.source_name,
    source_category: item.json.source_category,
    prompt: item.json.prompt,
    additional_formats: item.json.additional_formats,
    test_mode: item.json.test_mode
  }))) }},
  "max_concurrent_apify": 3
}`,
        options: {
            timeout: 300000,
        },
    };

    // =====================================================================
    // ROUTAGE ET CONNEXIONS
    // =====================================================================

    @links()
    defineRouting() {
        this.ScheduleTrigger.out(0).to(this.GetAllSources.in(0));
        this.GetAllSources.out(0).to(this.IfHighPriority.in(0));
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
        this.Sources.out(0).to(this.MapToContentSourcing.in(0));
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
        this.IfFromForm1.out(0).to(this.IfTextLongerThan2000Chars.in(0));
        this.IfFromForm1.out(1).to(this.ValidContentOnlyScoreAbove2.in(0));
        this.RemoveDuplicates3.out(0).to(this.GetAllResults.in(0));
        this.RemoveDuplicates3.out(0).to(this.RemoveDuplicates.in(0));
        this.Sort.out(0).to(this.Get1000BestArticles.in(0));
        this.ValidContentOnlyScoreAbove2.out(0).to(this.IfTextLongerThan2000Chars.in(0));
        this.Limit1.out(0).to(this.MapToContentSourcing.in(0));
        this.GetAllSources1.out(0).to(this.MatchInputFormat.in(0));
        this.Filter.out(0).to(this.SetGoogleSheetFields.in(0));
        this.Filter.out(0).to(this.GetAllIdeasFromEvaluationTable2.in(0));
        this.ManuallyTriggerContentEngine.out(0).to(this.GetAllSources.in(0));
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
        this.SendAMessage1.out(0).to(this.LoopOverItems.in(0));
        this.SendAMessage.out(0).to(this.LoopOverItems.in(0));
        this.AddContentWithDate1.out(1).to(this.SendAMessage3.in(0));
        this.AddContentWithoutDate1.out(1).to(this.SendAMessage4.in(0));
        this.SendAMessage6.out(0).to(this.LoopOverItems.in(0));
        this.SendAMessage2.out(0).to(this.LoopOverItems.in(0));
        this.DeduplicatedArticles.out(0).to(this.ClassifyViaRelevanceService.in(0));
        this.ClassifyViaRelevanceService.out(0).to(this.PerformFinalCalculation.in(0));
        this.PerformFinalCalculation.out(0).to(this.ThresholdMet.in(0));
        this.ThresholdMet.out(0).to(this.Sort.in(0));
        this.ThresholdMet.out(1).to(this.SelectFields1.in(0));
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
        this.FilterArticlesByTopic.out(0).to(this.MapDataForNotion.in(0));
        this.FilterArticlesByTopic.out(1).to(this.SendAMessage5.in(0));
        this.FilterArticlesByTopic1.out(0).to(this.MapDataForNotion1.in(0));
        this.FilterArticlesByTopic1.out(1).to(this.SendAMessage6.in(0));
        this.MatchInputFormat.out(0).to(this.ClassifyViaRelevanceService.in(0));
        this.Get1000BestArticles.out(0).to(this.Evaluation.in(0));
        this.MapToContentSourcing.out(0).to(this.CallContentSourcingBatch.in(0));
        this.SplitOutArticles.out(0).to(this.RemoveDuplicates3.in(0));
        this.CallContentSourcingBatch.out(0).to(this.SplitOutArticles.in(0));

        this.Evaluation1.uses({
            ai_languageModel: this.OpenaiChatModel8.output,
        });
    }
}
