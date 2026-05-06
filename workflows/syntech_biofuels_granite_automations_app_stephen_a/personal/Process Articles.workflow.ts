import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : Process Articles
// Nodes   : 52  |  Connections: 48
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// MatchInputFormat                   set                        [executeOnce]
// Evaluation                         evaluation
// RunEvaluation                      evaluationTrigger          [creds]
// SetOutputInEvaluationGoogleSheet   evaluation                 [creds]
// SelectFields                       set
// RemoveDuplicates1                  merge
// SetGoogleSheetFields               set
// GetAllIdeasFromEvaluationTable2    googleSheets               [creds] [executeOnce]
// Sort                               sort
// ValidContentOnlyScoreAbove2        filter
// GetAllSources1                     notion                     [creds]
// Filter                             filter
// AddContentIdeaToEvaluationTable1   googleSheets               [creds]
// OpenaiChatModel8                   lmChatOpenAi               [creds] [ai_languageModel]
// Evaluation1                        evaluation                 [AI]
// SendAMessage5                      slack                      [creds]
// ClassifyViaRelevanceService        httpRequest                [onError→out(1)] [creds] [retry]
// PerformFinalCalculation            code
// ThresholdMet                       if
// SelectFields1                      set
// Aggregate                          aggregate
// SemanticKeywordDeduplication       httpRequest                [retry]
// StickyNote1                        stickyNote
// DeduplicatedArticles               splitOut
// Get1000BestArticles                limit
// SplitOutArticles                   splitOut
// ResumeContentQueue                 webhook                    [creds]
// SendAMessage7                      slack                      [creds]
// NoOperationDoNothing2              noOp
// IfNotMention                       if
// MatchInputFormat1                  set                        [executeOnce]
// Evaluation2                        evaluation
// RunEvaluation1                     evaluationTrigger          [creds]
// SetOutputInEvaluationGoogleSheet1  evaluation                 [creds]
// GetAllSources3                     notion                     [creds]
// Evaluation3                        evaluation                 [AI]
// OpenaiChatModel9                   lmChatOpenAi               [creds] [ai_languageModel]
// Aggregate1                         aggregate
// SemanticKeywordDeduplication1      httpRequest
// SourceExclusion                    code
// PreFilter                          code
// DeduplicatedArticles1              splitOut
// SendAMessage                       slack                      [creds]
// ProcessMentionArticle              httpRequest                [onError→out(1)] [creds] [retry]
// ProcessNewsArticle                 httpRequest                [onError→out(1)] [creds] [retry]
// NoOperationDoNothing               noOp
// OpenaiChatModel                    lmChatOpenAi               [creds] [ai_languageModel]
// StructuredOutputParser             outputParserStructured     [ai_outputParser]
// If_                                if
// Merge                              merge
// VerifyArticleRelevancy             chainLlm                   [AI] [retry]
// IsRelevant                         filter
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// RunEvaluation
//    → GetAllSources1
//      → MatchInputFormat
//        → ClassifyViaRelevanceService
//          → PerformFinalCalculation
//            → ThresholdMet
//              → Sort
//                → Get1000BestArticles
//                  → Evaluation
//                    → SetOutputInEvaluationGoogleSheet
//                      → Evaluation1
//                   .out(1) → SelectFields
//                      → Filter
//                        → SetGoogleSheetFields
//                          → RemoveDuplicates1
//                            → AddContentIdeaToEvaluationTable1
//                        → GetAllIdeasFromEvaluationTable2
//                          → RemoveDuplicates1.in(1) (↩ loop)
//                      → ValidContentOnlyScoreAbove2
//                        → ProcessNewsArticle
//                          → NoOperationDoNothing2
//                         .out(1) → SendAMessage5
//             .out(1) → SelectFields1
//         .out(1) → SendAMessage7
// ResumeContentQueue
//    → SplitOutArticles
//      → IfNotMention
//        → Aggregate
//          → SemanticKeywordDeduplication
//            → DeduplicatedArticles
//              → ClassifyViaRelevanceService (↩ loop)
//       .out(1) → Aggregate1
//          → SemanticKeywordDeduplication1
//            → DeduplicatedArticles1
//              → SourceExclusion
//                → PreFilter
//                  → If_
//                    → VerifyArticleRelevancy
//                      → IsRelevant
//                        → Merge
//                          → ProcessMentionArticle
//                            → Evaluation2
//                              → SetOutputInEvaluationGoogleSheet1
//                                → Evaluation3
//                             .out(1) → NoOperationDoNothing
//                           .out(1) → SendAMessage
//                   .out(1) → Merge.in(1) (↩ loop)
// RunEvaluation1
//    → GetAllSources3
//      → MatchInputFormat1
//        → ProcessMentionArticle (↩ loop)
//
// AI CONNECTIONS
// Evaluation1.uses({ ai_languageModel: OpenaiChatModel8 })
// Evaluation3.uses({ ai_languageModel: OpenaiChatModel9 })
// VerifyArticleRelevancy.uses({ ai_languageModel: OpenaiChatModel, ai_outputParser: StructuredOutputParser })
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'xMber2oB93RuRWim',
    name: 'Process Articles',
    active: true,
    isArchived: false,
    projectId: 'U9sMeJya1DaokkjK',
    tags: ['NEWS+', 'SYNTECH'],
    settings: { executionOrder: 'v1', binaryMode: 'separate' },
})
export class ProcessArticlesWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'dcbf947b-3ff8-4cfe-ac2f-bf8c1f51eb03',
        name: 'Match Input Format',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [-1344, 224],
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
        id: '45a20361-e842-49c1-b22a-247ecc5fa9eb',
        name: 'Evaluation',
        type: 'n8n-nodes-base.evaluation',
        version: 4.7,
        position: [0, -64],
    })
    Evaluation = {
        operation: 'checkIfEvaluating',
    };

    @node({
        id: 'aa2816da-216f-4566-9ee7-ab14465ce236',
        name: 'Run Evaluation',
        type: 'n8n-nodes-base.evaluationTrigger',
        version: 4.6,
        position: [-1792, 224],
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
        id: '1a136719-de3e-4fe2-80f6-480cc969c868',
        name: 'Set Output In Evaluation Google Sheet',
        type: 'n8n-nodes-base.evaluation',
        version: 4.7,
        position: [224, -400],
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
        id: '8c0fd86a-a2c8-42b1-9b30-3ae3ed80101c',
        name: 'select fields',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [224, 80],
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
                    id: 'f4ed6cb7-a5a4-401e-8a52-d81a8e11bea5',
                    name: 'author',
                    value: "={{ $('Deduplicated Articles').item.json.author }}",
                    type: 'string',
                },
                {
                    id: 'b7009aa6-4950-49c3-99b4-9dac161d2124',
                    name: 'source_category',
                    value: "={{ $('Deduplicated Articles').item.json.source_category }}",
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
        id: '075e0416-aa8f-4f76-86d7-607915cf5c2c',
        name: 'Remove Duplicates1',
        type: 'n8n-nodes-base.merge',
        version: 3.2,
        position: [1024, -112],
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
        id: '057472e5-afb6-4b52-a387-af538aa7879d',
        name: 'Set Google Sheet Fields',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [800, -208],
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
        id: '57b39eff-ba38-4eaf-b53c-15f8a58c796c',
        name: 'Get All Ideas From Evaluation Table2',
        type: 'n8n-nodes-base.googleSheets',
        version: 4.7,
        position: [800, -16],
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
        id: '96a51128-bdfc-4587-868f-ba5f872d66bc',
        name: 'Sort',
        type: 'n8n-nodes-base.sort',
        version: 1,
        position: [-448, -64],
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
        id: '0ad50e0a-5bbb-4087-a308-b15965b12562',
        name: 'Valid content only (score above 2)',
        type: 'n8n-nodes-base.filter',
        version: 2.2,
        position: [512, 272],
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
        id: 'bbd4479f-7e7b-4157-ae89-bf4ab2f0e15f',
        name: 'Get All Sources1',
        type: 'n8n-nodes-base.notion',
        version: 2.2,
        position: [-1568, 224],
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
        id: 'c81b8b37-e234-4c7c-a4fa-4d9a1673834e',
        name: 'filter',
        type: 'n8n-nodes-base.filter',
        version: 2.2,
        position: [512, -112],
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
        id: '3ee4e41b-4273-4d76-9c49-11fd089cfe09',
        name: 'Add Content Idea to Evaluation Table1',
        type: 'n8n-nodes-base.googleSheets',
        version: 4.7,
        position: [1248, -112],
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
        id: 'c97120f6-b765-4328-b157-131abc2331d4',
        name: 'OpenAI Chat Model8',
        type: '@n8n/n8n-nodes-langchain.lmChatOpenAi',
        version: 1.2,
        position: [528, -288],
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
        id: '0fd09749-a94d-4639-8366-7897bcd0d93d',
        name: 'Evaluation1',
        type: 'n8n-nodes-base.evaluation',
        version: 4.8,
        position: [448, -512],
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
        id: 'fd34ca94-b27d-4e98-a541-85f00ef5351d',
        webhookId: 'd98789a2-b2b3-4f8f-a4fb-e226aa1adb2e',
        name: 'Send a message5',
        type: 'n8n-nodes-base.slack',
        version: 2.3,
        position: [1024, 368],
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
        id: '95162ed1-43d2-4503-8ce6-e69e24afe428',
        name: 'Classify via Relevance Service',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.3,
        position: [-1120, 128],
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
  "title":{{ JSON.stringify($('Deduplicated Articles').item.json.title) }},
  "content":{{ JSON.stringify($('Deduplicated Articles').item.json.content) }},
  "url":{{ JSON.stringify($('Deduplicated Articles').item.json.url) }},
  "source":{{ JSON.stringify($('Deduplicated Articles').item.json.source) }},
  "source_category":{{ JSON.stringify($('Deduplicated Articles').item.json.source_category || "") }},
  "summary":{{ JSON.stringify($('Deduplicated Articles').item.json.summary || "") }},
  "author":{{ JSON.stringify($('Deduplicated Articles').item.json.author ?? null) }}
}`,
        options: {
            batching: {
                batch: {
                    batchSize: 10,
                    batchInterval: 3000,
                },
            },
            response: {
                response: {
                    responseFormat: 'json',
                },
            },
            timeout: 180000,
        },
    };

    @node({
        id: 'd4638f17-2e00-4175-9890-8837c8449b14',
        name: 'Perform Final Calculation',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [-896, 32],
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
        id: 'bf513ba4-6a10-475e-8cd1-038e23045fb6',
        name: 'Threshold Met?',
        type: 'n8n-nodes-base.if',
        version: 2.3,
        position: [-672, 32],
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
        id: '73568c1a-d7fb-4ce4-bbfa-b7ecf11db671',
        name: 'select fields1',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [-448, 128],
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
        id: '9557b71d-4a6b-460d-875b-0bf2c133bf55',
        name: 'Aggregate',
        type: 'n8n-nodes-base.aggregate',
        version: 1,
        position: [-1792, 32],
    })
    Aggregate = {
        aggregate: 'aggregateAllItemData',
        destinationFieldName: 'articles',
        options: {},
    };

    @node({
        id: '6099ed3f-ca0d-4bf6-8367-776cd399dc9a',
        name: 'Semantic Keyword Deduplication',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [-1568, 32],
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
        id: '9d782b97-bbf7-4ad8-b89d-962a6301746b',
        name: 'Sticky Note1',
        type: 'n8n-nodes-base.stickyNote',
        version: 1,
        position: [-1808, -96],
    })
    StickyNote1 = {
        content: `## Semantic Deduplication
This performs semantic deduplication, which uses keywords to create content clusters, selecting the best quality content and reducing the overall number of articles. `,
        height: 304,
        width: 608,
    };

    @node({
        id: '53f4bf9e-d3d7-4e93-b7b6-3f9ea6ce4e60',
        name: 'Deduplicated Articles',
        type: 'n8n-nodes-base.splitOut',
        version: 1,
        position: [-1344, 32],
    })
    DeduplicatedArticles = {
        fieldToSplitOut: 'selected_articles',
        options: {},
    };

    @node({
        id: '0dc8a8d8-3b6e-43ba-a5c8-0ecce4138d95',
        name: 'Get 1000 best articles',
        type: 'n8n-nodes-base.limit',
        version: 1,
        position: [-224, -64],
    })
    Get1000BestArticles = {
        maxItems: 1000,
    };

    @node({
        id: '2e35c34c-5d21-4818-a6c5-234c79c91941',
        name: 'Split Out Articles',
        type: 'n8n-nodes-base.splitOut',
        version: 1,
        position: [-2400, 512],
    })
    SplitOutArticles = {
        fieldToSplitOut: 'body.articles',
        options: {},
    };

    @node({
        id: '64c7c44e-35a0-420c-88f7-7c7b6871873c',
        webhookId: 'bbfd5027-a96f-4ec1-bc49-1b612b0f18ad',
        name: 'Resume Content Queue',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [-2608, 512],
        credentials: { httpHeaderAuth: { id: 'voWjuyaflZP6RgSr', name: 'Syntech Content Webhook Bearer' } },
    })
    ResumeContentQueue = {
        httpMethod: 'POST',
        path: 'flush-syntech-queue',
        authentication: 'headerAuth',
        options: {},
    };

    @node({
        id: '8901b4d4-18a1-4b96-958c-de4212eb27cc',
        webhookId: 'd98789a2-b2b3-4f8f-a4fb-e226aa1adb2e',
        name: 'Send a message7',
        type: 'n8n-nodes-base.slack',
        version: 2.3,
        position: [-896, 224],
        credentials: { slackApi: { id: 'hndVCHiq0HgMBAh3', name: 'Stephen Slack account' } },
    })
    SendAMessage7 = {
        select: 'channel',
        channelId: {
            __rl: true,
            value: 'C09V1831FN2',
            mode: 'list',
            cachedResultName: 'syntech-n8n-error-tracker',
        },
        text: `= *Classification Workflow Execution Error* ⚠️

- *Workflow Name:* News Sourcing Production (V2)
- *Error Node:* Classify via Relevance Service
- *Error Message:* {{ $json.error }}
- *Timestamp:* {{ $now.toFormat('dd-MM-yyyy HH:mm:ss') }}
- *Article:*
Title: {{ $('Deduplicated Articles').item.json.title }}
Url:{{ $('Deduplicated Articles').item.json.url }}

Workflow Execution: <https://syntech.granite-automations.app/workflow/{{ $workflow.id }}/executions/{{ $execution.id }}|View Execution>`,
        otherOptions: {
            includeLinkToWorkflow: false,
            unfurl_links: true,
        },
    };

    @node({
        id: '9c8ae5e6-cb0b-43be-938d-7868bc9bbece',
        name: 'No Operation, do nothing2',
        type: 'n8n-nodes-base.noOp',
        version: 1,
        position: [1024, 176],
    })
    NoOperationDoNothing2 = {};

    @node({
        id: '8bd9745d-f8e6-4416-bdc5-be43e4add32d',
        name: 'If Not Mention',
        type: 'n8n-nodes-base.if',
        version: 2.3,
        position: [-2176, 512],
    })
    IfNotMention = {
        conditions: {
            options: {
                caseSensitive: true,
                leftValue: '',
                typeValidation: 'strict',
                version: 3,
            },
            conditions: [
                {
                    id: 'e4c49199-9495-4470-aa2d-0a7d695f9062',
                    leftValue: '={{ $json.source_category }}',
                    rightValue: 'Mention',
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
        id: '8a77b9c3-c4bc-4f06-b523-9349472b12a5',
        name: 'Match Input Format1',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [112, 1248],
        executeOnce: true,
    })
    MatchInputFormat1 = {
        assignments: {
            assignments: [
                {
                    id: 'a4678c4d-3605-43b3-930d-54f3db0cf209',
                    name: 'content',
                    value: "={{ $('Run Evaluation1').item.json.Content }}",
                    type: 'string',
                },
                {
                    id: '960e3dc3-5af8-4535-bca0-6db869b1bed0',
                    name: 'url',
                    value: "={{ $('Run Evaluation1').item.json.URL }}",
                    type: 'string',
                },
                {
                    id: '084b87c7-e199-4284-89d5-a2a5bb7a69e7',
                    name: 'title',
                    value: "={{ $('Run Evaluation1').item.json.Title }}",
                    type: 'string',
                },
                {
                    id: '4957e170-7f99-4439-8b8a-29e930aa8823',
                    name: 'publication_date',
                    value: '={{ $(\'Run Evaluation1\').item.json["Publication Date"] }}',
                    type: 'string',
                },
                {
                    id: '7bf20e2e-95b3-4acc-9a9b-7fcf895f1ad2',
                    name: 'expected_relevance',
                    value: '={{ $(\'Run Evaluation1\').item.json["Expected Score"] }}',
                    type: 'string',
                },
            ],
        },
        options: {},
    };

    @node({
        id: 'd93c93cd-b912-4191-b2cd-cad6a98376fd',
        name: 'Evaluation2',
        type: 'n8n-nodes-base.evaluation',
        version: 4.7,
        position: [528, 1008],
    })
    Evaluation2 = {
        operation: 'checkIfEvaluating',
    };

    @node({
        id: '78beaced-90f0-4a7a-87fb-702e2d4d9e9b',
        name: 'Run Evaluation1',
        type: 'n8n-nodes-base.evaluationTrigger',
        version: 4.6,
        position: [-336, 1248],
        credentials: { googleSheetsOAuth2Api: { id: 'HbsRTv9aneCsIKOQ', name: 'Stephen Google Sheets account' } },
    })
    RunEvaluation1 = {
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
        id: 'c5f08ac2-5089-4a04-a710-4dfeebf0d0de',
        name: 'Set Output In Evaluation Google Sheet1',
        type: 'n8n-nodes-base.evaluation',
        version: 4.7,
        position: [752, 768],
        credentials: { googleSheetsOAuth2Api: { id: 'HbsRTv9aneCsIKOQ', name: 'Stephen Google Sheets account' } },
    })
    SetOutputInEvaluationGoogleSheet1 = {
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
                    outputValue: "={{ $('Classification agent with Batch').item.json.output.reason }}",
                },
            ],
        },
    };

    @node({
        id: '8a71cf52-ae40-46b0-bc51-9ab205e52ace',
        name: 'Get All Sources3',
        type: 'n8n-nodes-base.notion',
        version: 2.2,
        position: [-112, 1248],
        credentials: { notionApi: { id: 'k0ZwGrqySi9Wayf7', name: 'Stephen Notion account' } },
    })
    GetAllSources3 = {
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
        id: '21483590-360c-4d8d-863a-3845256fe95c',
        name: 'Evaluation3',
        type: 'n8n-nodes-base.evaluation',
        version: 4.8,
        position: [976, 656],
    })
    Evaluation3 = {
        operation: 'setMetrics',
        expectedAnswer: "={{ $('Run Evaluation1').item.json.Expected_Score }}",
        actualAnswer: "={{ $('Classification agent with Batch').item.json.output.relevance_score }}",
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
        id: '70f59394-d8f0-44d2-a233-8ddaffb9b23d',
        name: 'OpenAI Chat Model9',
        type: '@n8n/n8n-nodes-langchain.lmChatOpenAi',
        version: 1.2,
        position: [1056, 880],
        credentials: { openAiApi: { id: 'NoEKitspBJb0zQrp', name: 'Syntech GM OpenAi account' } },
    })
    OpenaiChatModel9 = {
        model: {
            __rl: true,
            mode: 'list',
            value: 'gpt-4.1-mini',
        },
        options: {},
    };

    @node({
        id: '5b8962ea-13f8-415e-a153-5ea02aa85d20',
        name: 'Aggregate1',
        type: 'n8n-nodes-base.aggregate',
        version: 1,
        position: [-1824, 912],
    })
    Aggregate1 = {
        aggregate: 'aggregateAllItemData',
        destinationFieldName: 'articles',
        options: {},
    };

    @node({
        id: '47be708c-bd69-4c2e-a55a-8ed3acc457d3',
        name: 'Semantic Keyword Deduplication1',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [-1600, 912],
    })
    SemanticKeywordDeduplication1 = {
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
        id: '0c7b0625-da5e-40d4-98f6-a44c45c29832',
        name: 'Source Exclusion',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [-1152, 912],
    })
    SourceExclusion = {
        jsCode: `/**
 * Source Exclusion Filter
 * Filters out content authored by Syntech's own accounts before pre-filter runs.
 * Blocklist is configurable via ENV vars (comma-separated per platform).
 */

// Get blocklist from ENV or use defaults
const blocklist = [
  // Default Syntech account URLs
  'syntechbiofuel.com',
  'facebook.com/syntechbiofuel',
  'x.com/syntechbiofuel',
  'twitter.com/syntechbiofuel',
  'instagram.com/syntechbiofuel',
  'linkedin.com/company/syntechbiofuel',
  'syntechbiofuel.medium.com',
];

const filtered = [];
const excluded = [];

for (const item of $input.all()) {
  const url = (item.json.url || '').toLowerCase();
  const author = (item.json.author || '').toLowerCase();

  // Check if URL or author matches any blocklist pattern
  const isBlocked = blocklist.some(pattern => {
    const p = pattern.toLowerCase();
    return url.includes(p) || author.includes(p);
  });

  if (isBlocked) {
    excluded.push(item.json.url);
  } else {
    filtered.push(item);
  }
}

if (excluded.length > 0) {
  console.log(\`Source Exclusion: filtered out \${excluded.length} Syntech-authored items\`);
}

return filtered;`,
    };

    @node({
        id: '2fe793b1-8e6d-4d33-9ac0-be8f8ba43020',
        name: 'Pre-filter',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [-928, 912],
    })
    PreFilter = {
        jsCode: `/**
 * Pre-filter: 3-tier relevance check to reduce LLM costs
 *
 * Tier 1: "Syntech" present (case-insensitive) → instant pass
 * Tier 3: Surname + biofuel context, OR Syntech-specific term → needs LLM verification
 *
 * Items failing all tiers are filtered out.
 */

const surnames = ["bingham", "hart", "olone"];

const biofuelTerms = [
    "biofuel",
    "biofuels",
    "biodiesel",
    "bioethanol",
    "renewable fuel",
    "sustainable fuel",
    "green fuel",
    "hvo",
    "saf",
    "sustainable aviation",
    "used cooking oil",
    "uco",
    "waste oil",
    "feedstock",
    "decarbonization",
    "decarbonisation",
    "net zero",
    "net-zero",
    "carbon neutral",
];

const syntechSpecificTerms = [
    "grangemouth",
    "kingsnorth",
    "kent",
    "asb",
    "advanced sustainable biofuel",
    "circular biofuel",
];

const results = [];

for (const item of $input.all()) {
    const content = (item.json.content || "").toLowerCase();
    const title = (item.json.title || "").toLowerCase();
    const text = content + " " + title;

    const hasSyntech = /syntech/i.test(text);
    const hasSurname = surnames.some((name) => text.includes(name));
    const hasBiofuelContext = biofuelTerms.some((term) => text.includes(term));
    const hasSyntechSpecific = syntechSpecificTerms.some((term) =>
        text.includes(term),
    );

    let tier = null;
    let pass = false;

    // Tier 1: Syntech explicitly mentioned
    if (hasSyntech) {
        tier = 1;
        pass = true;
    }
    // Tier 3: Surname + biofuel context, OR Syntech-specific term
    else if ((hasSurname && hasBiofuelContext) || hasSyntechSpecific) {
        tier = 3;
        pass = true;
        item.json._needsLlmVerification = true;
    }

    if (pass) {
        item.json._preFilterTier = tier;
        results.push(item);
    }
}

console.log(
    \`Pre-filter: \${results.length} items passed (Tier 1: instant, Tier 3: pending LLM)\`,
);

return results;`,
    };

    @node({
        id: 'b9c7cbf0-68d2-4d3b-9382-549dfdf41ebb',
        name: 'Deduplicated Articles1',
        type: 'n8n-nodes-base.splitOut',
        version: 1,
        position: [-1376, 912],
    })
    DeduplicatedArticles1 = {
        fieldToSplitOut: 'selected_articles',
        options: {},
    };

    @node({
        id: '9baa326c-32db-42a6-87aa-f23f277380c6',
        webhookId: 'd98789a2-b2b3-4f8f-a4fb-e226aa1adb2e',
        name: 'Send a message',
        type: 'n8n-nodes-base.slack',
        version: 2.3,
        position: [528, 1216],
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
- *Error Node:* Filter Articles By Topic
- *Error Message:* {{ $json.error }}
- *Timestamp:* {{ $now.toFormat('dd-MM-yyyy HH:mm:ss') }}
- *Article:*
Title: {{ $('Deduplicated Articles1').item.json.title }}
Url:{{ $('Deduplicated Articles1').item.json.url }}
Summary: {{ $('Deduplicated Articles1').item.json.summary }}

*Next Steps:* Please review the workflow and retry the execution.
Workflow Execution: <https://syntech.granite-automations.app/workflow/{{ $workflow.id }}/executions/{{ $execution.id }}|View Execution>`,
        otherOptions: {
            includeLinkToWorkflow: false,
            unfurl_links: true,
        },
    };

    @node({
        id: '7da66f21-c160-4514-854f-1f34f2ca1337',
        name: 'Process Mention Article',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.2,
        position: [304, 1120],
        credentials: {
            httpHeaderAuth: { id: 'kzydmFSpHI8T1Y9W', name: 'Syntech Classifier Bearer' },
            httpBearerAuth: { id: 'JmQByIdKZ85XtGwZ', name: 'Syntech Article Classifier Bearer' },
        },
        onError: 'continueErrorOutput',
        retryOnFail: true,
        maxTries: 3,
        waitBetweenTries: 5000,
    })
    ProcessMentionArticle = {
        method: 'POST',
        url: 'https://syntech-article-processor-production.up.railway.app/mentions/analyze',
        authentication: 'genericCredentialType',
        genericAuthType: 'httpBearerAuth',
        sendBody: true,
        specifyBody: 'json',
        jsonBody: `={{JSON.stringify({
  url: $('Deduplicated Articles1').item.json.url,
  title: $('Deduplicated Articles1').item.json.title,
  content: $('Deduplicated Articles1').item.json.content,
  summary: $('Deduplicated Articles1').item.json.summary || null,
  source: $('Deduplicated Articles1').item.json.source || null,
  publication_date: $('Deduplicated Articles1').item.json.publication_date || null
})}}`,
        options: {
            batching: {
                batch: {
                    batchSize: 5,
                },
            },
            timeout: 60000,
        },
    };

    @node({
        id: '303f17b4-761d-4805-8476-bc5780a7bb8d',
        name: 'Process News Article',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.2,
        position: [800, 272],
        credentials: {
            httpHeaderAuth: { id: 'kzydmFSpHI8T1Y9W', name: 'Syntech Classifier Bearer' },
            httpBearerAuth: { id: 'JmQByIdKZ85XtGwZ', name: 'Syntech Article Classifier Bearer' },
        },
        onError: 'continueErrorOutput',
        retryOnFail: true,
        maxTries: 3,
        waitBetweenTries: 5000,
    })
    ProcessNewsArticle = {
        method: 'POST',
        url: 'https://syntech-article-processor-production.up.railway.app/classify',
        authentication: 'genericCredentialType',
        genericAuthType: 'httpBearerAuth',
        sendBody: true,
        specifyBody: 'json',
        jsonBody: '={{ { "article": $json.toJsonString() } }}',
        options: {},
    };

    @node({
        id: 'ba06cc84-08cb-45b0-8657-eaa1c9283645',
        name: 'No Operation, do nothing',
        type: 'n8n-nodes-base.noOp',
        version: 1,
        position: [736, 1104],
    })
    NoOperationDoNothing = {};

    @node({
        id: 'b316d9e2-38c0-4c39-97a4-8f5075e6796c',
        name: 'OpenAI Chat Model',
        type: '@n8n/n8n-nodes-langchain.lmChatOpenAi',
        version: 1.3,
        position: [-384, 848],
        credentials: { openAiApi: { id: 'NoEKitspBJb0zQrp', name: 'Syntech GM OpenAi account' } },
    })
    OpenaiChatModel = {
        model: {
            __rl: true,
            value: 'gpt-4o-mini',
            mode: 'list',
            cachedResultName: 'gpt-4o-mini',
        },
        builtInTools: {},
        options: {
            temperature: 0,
        },
    };

    @node({
        id: '754b67f2-f142-46db-b5c2-ca13258d8a22',
        name: 'Structured Output Parser',
        type: '@n8n/n8n-nodes-langchain.outputParserStructured',
        version: 1.3,
        position: [-208, 848],
    })
    StructuredOutputParser = {
        schemaType: 'manual',
        inputSchema: `{
    "type": "object",
    "properties": {
        "relevant": {
            "type": "boolean",
            "description": "True if the article is about Syntech Biofuel"
        },
        "reason": {
            "type": "string",
            "description": "Brief explanation for the decision"
        }
    },
    "required": ["relevant", "reason"]
}`,
    };

    @node({
        id: '9fe21345-d366-480e-a12d-91cf7cd7b0dd',
        name: 'If',
        type: 'n8n-nodes-base.if',
        version: 2.3,
        position: [-720, 912],
    })
    If_ = {
        conditions: {
            options: {
                caseSensitive: true,
                leftValue: '',
                typeValidation: 'strict',
                version: 3,
            },
            conditions: [
                {
                    id: '5d8dfd78-98b1-4e35-bd76-ca6c9018a422',
                    leftValue: '={{ $json._needsLlmVerification }}',
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
        id: 'be5c9fa6-dae3-45f9-864c-60a30b14c8bc',
        name: 'Merge',
        type: 'n8n-nodes-base.merge',
        version: 3.2,
        position: [112, 1008],
    })
    Merge = {};

    @node({
        id: '3d98c3c7-d91b-405e-a833-4ec12d7177a4',
        name: 'Verify Article Relevancy',
        type: '@n8n/n8n-nodes-langchain.chainLlm',
        version: 1.9,
        position: [-368, 624],
        retryOnFail: true,
        waitBetweenTries: 5000,
    })
    VerifyArticleRelevancy = {
        promptType: 'define',
        text: "={{ $('Deduplicated Articles1').item.json.content }}",
        hasOutputParser: true,
        messages: {
            messageValues: [
                {
                    message: `=You are verifying whether an article is about Syntech Biofuel (a UK-based circular biofuel company).

Determine if the content specifically mentions or discusses:
- Syntech Biofuel (the company) 
- Syntech's executives (Bingham, Hart, Olone) in a biofuel context
- Syntech's facilities (Grangemouth, Kingsnorth, Kent)
- Syntech's products (ASB / Advanced Sustainable Biofuel) 

If the article is about generic biofuel news with no connection to Syntech, return false. 

Output JSON only: 
{"relevant": true/false, "reason": "one sentence explanation"}

Output schema:

{
    "type": "object",
    "properties": {
        "relevant": {
            "type": "boolean",
            "description": "True if the article is about Syntech Biofuel"
        },
        "reason": {
            "type": "string",
            "description": "Brief explanation for the decision"
        }
    },
    "required": ["relevant", "reason"]
}`,
                },
            ],
        },
        batching: {},
    };

    @node({
        id: '0e5d0a4f-2592-46b4-bcbd-4b8d9735413c',
        name: 'Is Relevant?',
        type: 'n8n-nodes-base.filter',
        version: 2.3,
        position: [-48, 832],
    })
    IsRelevant = {
        conditions: {
            options: {
                caseSensitive: true,
                leftValue: '',
                typeValidation: 'strict',
                version: 3,
            },
            conditions: [
                {
                    id: '28a1b7b1-c521-451f-8bbb-c76bd92d373f',
                    leftValue: '={{ $json.output.relevant }}',
                    rightValue: true,
                    operator: {
                        type: 'boolean',
                        operation: 'equals',
                    },
                },
            ],
            combinator: 'and',
        },
        options: {},
    };

    // =====================================================================
    // ROUTAGE ET CONNEXIONS
    // =====================================================================

    @links()
    defineRouting() {
        this.MatchInputFormat.out(0).to(this.ClassifyViaRelevanceService.in(0));
        this.Evaluation.out(0).to(this.SetOutputInEvaluationGoogleSheet.in(0));
        this.Evaluation.out(1).to(this.SelectFields.in(0));
        this.RunEvaluation.out(0).to(this.GetAllSources1.in(0));
        this.SetOutputInEvaluationGoogleSheet.out(0).to(this.Evaluation1.in(0));
        this.SelectFields.out(0).to(this.Filter.in(0));
        this.SelectFields.out(0).to(this.ValidContentOnlyScoreAbove2.in(0));
        this.RemoveDuplicates1.out(0).to(this.AddContentIdeaToEvaluationTable1.in(0));
        this.SetGoogleSheetFields.out(0).to(this.RemoveDuplicates1.in(0));
        this.GetAllIdeasFromEvaluationTable2.out(0).to(this.RemoveDuplicates1.in(1));
        this.Sort.out(0).to(this.Get1000BestArticles.in(0));
        this.ValidContentOnlyScoreAbove2.out(0).to(this.ProcessNewsArticle.in(0));
        this.GetAllSources1.out(0).to(this.MatchInputFormat.in(0));
        this.Filter.out(0).to(this.SetGoogleSheetFields.in(0));
        this.Filter.out(0).to(this.GetAllIdeasFromEvaluationTable2.in(0));
        this.ClassifyViaRelevanceService.out(0).to(this.PerformFinalCalculation.in(0));
        this.ClassifyViaRelevanceService.out(1).to(this.SendAMessage7.in(0));
        this.PerformFinalCalculation.out(0).to(this.ThresholdMet.in(0));
        this.ThresholdMet.out(0).to(this.Sort.in(0));
        this.ThresholdMet.out(1).to(this.SelectFields1.in(0));
        this.Aggregate.out(0).to(this.SemanticKeywordDeduplication.in(0));
        this.SemanticKeywordDeduplication.out(0).to(this.DeduplicatedArticles.in(0));
        this.DeduplicatedArticles.out(0).to(this.ClassifyViaRelevanceService.in(0));
        this.Get1000BestArticles.out(0).to(this.Evaluation.in(0));
        this.SplitOutArticles.out(0).to(this.IfNotMention.in(0));
        this.ResumeContentQueue.out(0).to(this.SplitOutArticles.in(0));
        this.IfNotMention.out(0).to(this.Aggregate.in(0));
        this.IfNotMention.out(1).to(this.Aggregate1.in(0));
        this.MatchInputFormat1.out(0).to(this.ProcessMentionArticle.in(0));
        this.Evaluation2.out(0).to(this.SetOutputInEvaluationGoogleSheet1.in(0));
        this.Evaluation2.out(1).to(this.NoOperationDoNothing.in(0));
        this.RunEvaluation1.out(0).to(this.GetAllSources3.in(0));
        this.SetOutputInEvaluationGoogleSheet1.out(0).to(this.Evaluation3.in(0));
        this.GetAllSources3.out(0).to(this.MatchInputFormat1.in(0));
        this.Aggregate1.out(0).to(this.SemanticKeywordDeduplication1.in(0));
        this.SemanticKeywordDeduplication1.out(0).to(this.DeduplicatedArticles1.in(0));
        this.SourceExclusion.out(0).to(this.PreFilter.in(0));
        this.PreFilter.out(0).to(this.If_.in(0));
        this.DeduplicatedArticles1.out(0).to(this.SourceExclusion.in(0));
        this.ProcessMentionArticle.out(0).to(this.Evaluation2.in(0));
        this.ProcessMentionArticle.out(1).to(this.SendAMessage.in(0));
        this.ProcessNewsArticle.out(0).to(this.NoOperationDoNothing2.in(0));
        this.ProcessNewsArticle.out(1).to(this.SendAMessage5.in(0));
        this.If_.out(0).to(this.VerifyArticleRelevancy.in(0));
        this.If_.out(1).to(this.Merge.in(1));
        this.Merge.out(0).to(this.ProcessMentionArticle.in(0));
        this.VerifyArticleRelevancy.out(0).to(this.IsRelevant.in(0));
        this.IsRelevant.out(0).to(this.Merge.in(0));

        this.Evaluation1.uses({
            ai_languageModel: this.OpenaiChatModel8.output,
        });
        this.Evaluation3.uses({
            ai_languageModel: this.OpenaiChatModel9.output,
        });
        this.VerifyArticleRelevancy.uses({
            ai_languageModel: this.OpenaiChatModel.output,
            ai_outputParser: this.StructuredOutputParser.output,
        });
    }
}
