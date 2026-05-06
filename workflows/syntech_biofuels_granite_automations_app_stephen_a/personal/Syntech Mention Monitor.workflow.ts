import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : Syntech Mention Monitor
// Nodes   : 67  |  Connections: 76
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// ScheduleTrigger                    scheduleTrigger
// GetAllSources                      notion                     [creds]
// GetActiveSources                   filter
// Limit1                             limit
// ManuallyTriggerContentEngine       webhook
// MatchInputFormat1                  set                        [executeOnce]
// Evaluation2                        evaluation
// RunEvaluation1                     evaluationTrigger          [creds]
// SetOutputInEvaluationGoogleSheet1  evaluation                 [creds]
// IfTextLongerThan2000Chars1         if
// RemoveDuplicates6                  merge
// SetGoogleSheetFields1              set
// GetAllIdeasFromEvaluationTable     googleSheets               [creds] [executeOnce]
// GetAllSources3                     notion                     [creds]
// OpenaiChatModel2                   lmChatOpenAi               [creds] [ai_languageModel]
// ClassificationAgentWithBatch       chainLlm                   [AI]
// StructuredOutputParser1            outputParserStructured     [ai_outputParser]
// AddContentIdeaToEvaluationTable    googleSheets               [creds]
// Evaluation3                        evaluation                 [AI]
// OpenaiChatModel9                   lmChatOpenAi               [creds] [ai_languageModel]
// GetRatingFormattedForNotion1       code
// GetAllResults2                     notion                     [creds] [alwaysOutput] [executeOnce]
// OpenaiChatModel3                   lmChatOpenAi               [creds] [ai_languageModel]
// StructuredOutputParser3            outputParserStructured     [ai_outputParser]
// ClassificationPreScreener          chainLlm                   [AI]
// SyntechMentioned                   filter
// Merge6                             merge
// Aggregate1                         aggregate
// SemanticKeywordDeduplication1      httpRequest
// StickyNote                         stickyNote
// IfPublicationDate1                 if
// SplitsTextInSmallChuncks1          code
// If_                                if
// Merge5                             merge
// LoopOverItems1                     splitInBatches
// IfPublicationDate3                 if
// SetArticleUrl1                     set
// AddContentToPost1                  notion                     [onError→out(1)] [creds]
// NoOperationDoNothing1              noOp
// AddContentWithDate2                httpRequest                [onError→out(1)] [creds]
// AddContentWithoutDate2             httpRequest                [onError→out(1)] [creds]
// MapDataForNotion2                  set
// MapDataForNotion3                  set
// CheckSourcesExecuted3              if
// SendAMessage7                      slack                      [creds]
// SendAMessage8                      slack                      [creds]
// SendAMessage9                      slack                      [creds]
// Merge                              merge
// MatchSources                       switch
// CallLinkedinSearchProfileKeywordCompany executeWorkflow
// CallTavilyKeywordSearch            executeWorkflow
// CallSearchInstagramPage            executeWorkflow
// CallSearchWebsiteFromForm          executeWorkflow
// CallSearchTwitterXPostAndKeyword   executeWorkflow
// CallRssWebsiteSearchWithRssUrl     executeWorkflow
// CallSearchGoogleSyntech            executeWorkflow
// RemoveDuplicates                   removeDuplicates
// IsValidContent                     filter
// DeduplicatedArticles               splitOut
// Sources                            set
// FormSubmission1                    webhook
// CheckSourcesExecuted               if
// SelectFields                       set
// AddContentWithDate                 httpRequest                [onError→out(1)] [creds]
// AddContentWithoutDate              httpRequest                [onError→out(1)] [creds]
// SendAMessage                       slack                      [creds]
// SendAMessage1                      slack                      [creds]
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// ScheduleTrigger
//    → GetAllSources
//      → GetActiveSources
//        → Limit1
//          → MatchSources
//            → CallRssWebsiteSearchWithRssUrl
//              → Merge
//                → IsValidContent
//                  → RemoveDuplicates
//                    → Merge6
//                      → Aggregate1
//                        → SemanticKeywordDeduplication1
//                          → DeduplicatedArticles
//                            → ClassificationPreScreener
//                              → SyntechMentioned
//                                → ClassificationAgentWithBatch
//                                  → Evaluation2
//                                    → SetOutputInEvaluationGoogleSheet1
//                                      → Evaluation3
//                                   .out(1) → SelectFields
//                                      → SetGoogleSheetFields1
//                                        → RemoveDuplicates6
//                                          → AddContentIdeaToEvaluationTable
//                                      → GetAllIdeasFromEvaluationTable
//                                        → RemoveDuplicates6.in(1) (↩ loop)
//                                      → GetRatingFormattedForNotion1
//                                        → IfTextLongerThan2000Chars1
//                                          → LoopOverItems1
//                                            → NoOperationDoNothing1
//                                           .out(1) → CheckSourcesExecuted3
//                                              → MapDataForNotion3
//                                                → SplitsTextInSmallChuncks1
//                                                  → If_
//                                                    → IfPublicationDate3
//                                                      → AddContentWithDate2
//                                                        → SetArticleUrl1
//                                                          → Merge5
//                                                            → AddContentToPost1
//                                                              → LoopOverItems1 (↩ loop)
//                                                             .out(1) → SendAMessage9
//                                                                → LoopOverItems1 (↩ loop)
//                                                       .out(1) → SendAMessage7
//                                                          → LoopOverItems1 (↩ loop)
//                                                     .out(1) → AddContentWithoutDate2
//                                                        → SetArticleUrl1 (↩ loop)
//                                                       .out(1) → SendAMessage8
//                                                          → LoopOverItems1 (↩ loop)
//                                                   .out(1) → Merge5.in(1) (↩ loop)
//                                             .out(1) → MapDataForNotion3 (↩ loop)
//                                         .out(1) → CheckSourcesExecuted
//                                            → MapDataForNotion2
//                                              → IfPublicationDate1
//                                                → AddContentWithDate
//                                                 .out(1) → SendAMessage
//                                               .out(1) → AddContentWithoutDate
//                                                 .out(1) → SendAMessage1
//                                           .out(1) → MapDataForNotion2 (↩ loop)
//                    → GetAllResults2
//                      → Merge6.in(1) (↩ loop)
//           .out(1) → CallLinkedinSearchProfileKeywordCompany
//              → Merge.in(1) (↩ loop)
//           .out(2) → CallTavilyKeywordSearch
//              → Merge.in(3) (↩ loop)
//           .out(2) → CallSearchGoogleSyntech
//              → Merge.in(2) (↩ loop)
//           .out(3) → CallSearchInstagramPage
//              → Merge.in(4) (↩ loop)
//           .out(4) → CallSearchWebsiteFromForm
//              → Merge.in(5) (↩ loop)
//           .out(5) → CallSearchTwitterXPostAndKeyword
//              → Merge.in(6) (↩ loop)
// ManuallyTriggerContentEngine
//    → GetAllSources (↩ loop)
// RunEvaluation1
//    → GetAllSources3
//      → MatchInputFormat1
//        → ClassificationAgentWithBatch (↩ loop)
// FormSubmission1
//    → Sources
//      → MatchSources (↩ loop)
//
// AI CONNECTIONS
// ClassificationAgentWithBatch.uses({ ai_languageModel: OpenaiChatModel2, ai_outputParser: StructuredOutputParser1 })
// Evaluation3.uses({ ai_languageModel: OpenaiChatModel9 })
// ClassificationPreScreener.uses({ ai_languageModel: OpenaiChatModel3, ai_outputParser: StructuredOutputParser3 })
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'XO9Or6DUoTqXgAA5',
    name: 'Syntech Mention Monitor',
    active: true,
    isArchived: false,
    projectId: 'U9sMeJya1DaokkjK',
    tags: ['SYNTECH'],
    settings: {
        executionOrder: 'v1',
        callerPolicy: 'workflowsFromSameOwner',
        availableInMCP: false,
        timeSavedPerExecution: 120,
        errorWorkflow: 'Qsg1jSZ5AQScoAOn',
        binaryMode: 'separate',
    },
})
export class SyntechMentionMonitorWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: '72662346-6564-44f4-af59-c6790dfccfc0',
        name: 'Schedule Trigger',
        type: 'n8n-nodes-base.scheduleTrigger',
        version: 1.2,
        position: [-528, 3904],
    })
    ScheduleTrigger = {
        rule: {
            interval: [
                {
                    triggerAtHour: 8,
                },
            ],
        },
    };

    @node({
        id: 'ff8c3bc2-80be-4d05-a3ac-9a7cfe49bbcf',
        name: 'Get All Sources',
        type: 'n8n-nodes-base.notion',
        version: 2.2,
        position: [-304, 3904],
        credentials: { notionApi: { id: 'k0ZwGrqySi9Wayf7', name: 'Stephen Notion account' } },
    })
    GetAllSources = {
        resource: 'databasePage',
        operation: 'getAll',
        databaseId: {
            __rl: true,
            value: '2a8785c0-cfab-8153-bfad-e3a7a0ef72c9',
            mode: 'list',
            cachedResultName: 'Syntech Biofuel Mentions Sources',
            cachedResultUrl: 'https://www.notion.so/2a8785c0cfab8153bfade3a7a0ef72c9',
        },
        returnAll: true,
        options: {},
    };

    @node({
        id: 'd07eaab5-d8e7-49e1-9f91-36db0592a20d',
        name: 'Get Active Sources',
        type: 'n8n-nodes-base.filter',
        version: 2.2,
        position: [-80, 3904],
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
        id: 'dc2bc078-8569-4a65-af54-2c93f539dccb',
        name: 'Limit1',
        type: 'n8n-nodes-base.limit',
        version: 1,
        position: [144, 3904],
    })
    Limit1 = {
        maxItems: 1000,
    };

    @node({
        id: 'b1ee63f0-21eb-457f-ae99-f0d69f418b4c',
        webhookId: 'eda87c01-fe8a-42f6-a116-fa1b7eb6d165',
        name: 'Manually Trigger Content Engine',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [-528, 4096],
    })
    ManuallyTriggerContentEngine = {
        httpMethod: 'POST',
        path: 'trigger-mentions-engine',
        options: {},
    };

    @node({
        id: '9dc29f11-941f-4486-9bc1-f380e9d1048b',
        name: 'Match Input Format1',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [2960, 4352],
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
        id: '0ea56ce9-296a-44ba-904c-0f019853da3e',
        name: 'Evaluation2',
        type: 'n8n-nodes-base.evaluation',
        version: 4.7,
        position: [3536, 4192],
    })
    Evaluation2 = {
        operation: 'checkIfEvaluating',
    };

    @node({
        id: '832f17c7-553c-4fae-9d7e-4fb667313298',
        name: 'Run Evaluation1',
        type: 'n8n-nodes-base.evaluationTrigger',
        version: 4.6,
        position: [2384, 4352],
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
        id: '44d7be98-b9d3-480d-b99f-f7f95943d2a4',
        name: 'Set Output In Evaluation Google Sheet1',
        type: 'n8n-nodes-base.evaluation',
        version: 4.7,
        position: [3760, 3808],
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
        id: 'd482e057-4baf-4b51-8665-c96572bb55ad',
        name: 'IF text longer than 2000 chars1',
        type: 'n8n-nodes-base.if',
        version: 1,
        position: [4336, 4896],
    })
    IfTextLongerThan2000Chars1 = {
        conditions: {
            number: [
                {
                    value1: "={{  $('Deduplicated Articles').item.json.content?.length() }}",
                    operation: 'larger',
                    value2: 2000,
                },
            ],
        },
    };

    @node({
        id: '7b05392b-a922-4d46-b7cf-634b1f1af7a1',
        name: 'Remove Duplicates6',
        type: 'n8n-nodes-base.merge',
        version: 3.2,
        position: [4336, 4288],
    })
    RemoveDuplicates6 = {
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
        id: '49a430a4-f15d-4d45-b7a6-681160089743',
        name: 'Set Google Sheet Fields1',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [4048, 4128],
    })
    SetGoogleSheetFields1 = {
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
        id: 'f9556892-0972-4dc4-97da-c0d4953ef69b',
        name: 'Get All Ideas From Evaluation Table',
        type: 'n8n-nodes-base.googleSheets',
        version: 4.7,
        position: [4048, 4320],
        credentials: { googleSheetsOAuth2Api: { id: 'HbsRTv9aneCsIKOQ', name: 'Stephen Google Sheets account' } },
        executeOnce: true,
    })
    GetAllIdeasFromEvaluationTable = {
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
        id: 'fdc6fa9c-cef5-4ce6-a21f-e5f47e6cd4e1',
        name: 'Get All Sources3',
        type: 'n8n-nodes-base.notion',
        version: 2.2,
        position: [2672, 4352],
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
        id: '91ee9aec-6956-473d-91d5-6dc6ca8b60c2',
        name: 'OpenAI Chat Model2',
        type: '@n8n/n8n-nodes-langchain.lmChatOpenAi',
        version: 1.2,
        position: [3200, 4416],
        credentials: { openAiApi: { id: 'NoEKitspBJb0zQrp', name: 'Syntech GM OpenAi account' } },
    })
    OpenaiChatModel2 = {
        model: {
            __rl: true,
            value: 'gpt-5.1',
            mode: 'list',
            cachedResultName: 'gpt-5.1',
        },
        options: {
            temperature: 0.2,
        },
    };

    @node({
        id: '1ab48314-6160-4879-b16a-3737cbbce72f',
        name: 'Classification agent with Batch',
        type: '@n8n/n8n-nodes-langchain.chainLlm',
        version: 1.7,
        position: [3184, 4192],
    })
    ClassificationAgentWithBatch = {
        promptType: 'define',
        text: `=Title: {{ $('Deduplicated Articles').item.json.title }}
Summary: {{ $('Deduplicated Articles').item.json.summary }}
Content: {{ $('Deduplicated Articles').item.json.content }}`,
        hasOutputParser: true,
        messages: {
            messageValues: [
                {
                    message: `=<prompt>
    <introduction>
        You are an expert evaluator of sustainability and renewable fuel content.
        Your new role is to perform **targeted sentiment analysis**, assessing the overall **sentiment (positive, negative, or neutral)** expressed about **Syntech Biofuel** in any given article or content piece.
        Assign a **sentiment score from 0 (very negative) to 5 (very positive)**, reflecting the tone expressed towards Syntech Biofuel specifically, using best practices for sentiment analysis.
    </introduction>
    
    <task>
        Assess **all statements specifically about Syntech Biofuel** in the article.
        - If Syntech Biofuel is not mentioned, or if the content is a directory, listing, or index page with no meaningful context, always assign a neutral score.
        - Weigh overall sentiment: consider both positive and negative aspects when present, and use domain expertise to assign the most appropriate score.
        - Ignore sentiment about the broader sector, UK policy, or competitors unless Syntech Biofuel is expressly referenced in the same context.
        Output only the following JSON object, nothing else:
        {"score": number, "reason": "short factual explanation"}
    </task>
    
    <sentiment_scoring_criteria>
        **0 — Very Negative:** Clear criticism or strongly negative opinion about Syntech (e.g., major failures, scandals, poor innovation, public backlash).
        **1 — Negative:** Negative or mildly critical sentiment about Syntech (e.g., minor setbacks, negative comparisons, disappointing results).
        **2 — Slightly Negative:** Subtle or slight negativity, or muted criticism (e.g., minor concerns, tepid commentary).
        **3 — Neutral:** No explicit opinion, just factual/brief mention, or genuinely balanced/mixed sentiment. Also use if Syntech Biofuel is not mentioned, or if the content is non-substantive (e.g., a directory or listing).
        **4 — Positive:** Generally positive tone or minor praise about Syntech (e.g., being recognized for progress, improving operations, successful minor projects).
        **5 — Very Positive:** Strong praise, endorsement, or highly favorable coverage (e.g., major breakthrough, award-wins, industry leadership attributed to Syntech).
    </sentiment_scoring_criteria>
    
    <steps>
        1. **Read the entire article or excerpt.**
        2. **Extract all statements about Syntech Biofuel** (ignore sentiment not about Syntech).
        3. **Identify the tone** of these statements (positive, negative, neutral, or mixed).
        4. **Assign a score** from 0 to 5 based on the overall sentiment expressed about Syntech.
        5. If Syntech Biofuel is *not mentioned*, or if the content is non-substantive (e.g., directory, listing, or tag page), assign a score of 3 (neutral) and explain why.
        6. Provide a concise factual reason for your assigned sentiment in the \`reason\` field.
        7. Output the result as a JSON object: {"score": number, "reason": "short factual explanation"}.
        8. Output nothing else.
    </steps>
    
    <restrictions>
        * Only evaluate sentiment about Syntech Biofuel itself.
        * Ignore statements unrelated to Syntech Biofuel.
        * Keep the \`reason\` concise (1–2 sentences max).
        * Do not output keyword lists, scoring chains, markdown, or commentary—**only** the specified JSON.
    </restrictions>
    
    <output_example>
        {"score": 5, "reason": "The article highlights Syntech Biofuel as the leader in UK circular biofuel innovation and praises its recent breakthrough."}
        {"score": 3, "reason": "The content is a listing of sustainability articles and does not contain any meaningful reference to Syntech Biofuel."}
    </output_example>
    
    <output_rules>
        Output the JSON only. Do not output anything else.
    </output_rules>
</prompt>`,
                },
            ],
        },
        batching: {
            batchSize: 10,
            delayBetweenBatches: 1000,
        },
    };

    @node({
        id: '416346b7-4f5c-4bad-8e2d-82378ff3ccbe',
        name: 'Structured Output Parser1',
        type: '@n8n/n8n-nodes-langchain.outputParserStructured',
        version: 1.3,
        position: [3328, 4416],
    })
    StructuredOutputParser1 = {
        schemaType: 'manual',
        inputSchema: `{
  "type": "object",
  "properties": {
    "sentiment_score": {
      "type": "integer",
      "description": "Sentiment score from 0 (very negative) to 5 (very positive) reflecting the overall sentiment expressed about Syntech Biofuel in the article. Use 3 for neutral or if Syntech Biofuel is not mentioned.",
      "minimum": 0,
      "maximum": 5
    },
    "reason": {
      "type": "string",
      "description": "Short factual explanation for the assigned sentiment score (1-2 sentences maximum), focusing only on statements about Syntech Biofuel."
    }
  },
  "required": ["score", "reason"]
}`,
    };

    @node({
        id: '625eaf0c-1261-46c8-aeab-0f988f0b8bca',
        name: 'Add Content Idea to Evaluation Table',
        type: 'n8n-nodes-base.googleSheets',
        version: 4.7,
        position: [4560, 4288],
        credentials: { googleSheetsOAuth2Api: { id: 'HbsRTv9aneCsIKOQ', name: 'Stephen Google Sheets account' } },
    })
    AddContentIdeaToEvaluationTable = {
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
                'Actual Score': "={{ $('Classification agent with Batch').item.json.message.content.relevance_score }}",
                'AI Reasoning': "={{ $('Classification agent with Batch').item.json.message.content.reasoning }}",
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
        id: '2971e3ec-824c-4b5c-a744-3acfe14bb678',
        name: 'Evaluation3',
        type: 'n8n-nodes-base.evaluation',
        version: 4.8,
        position: [3984, 3696],
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
        id: 'b435ba64-ea99-4c20-9790-f8f99b8da1b3',
        name: 'OpenAI Chat Model9',
        type: '@n8n/n8n-nodes-langchain.lmChatOpenAi',
        version: 1.2,
        position: [4064, 3920],
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
        id: '29d61852-b5c6-460b-9288-89a6b56637fb',
        name: 'Get Rating Formatted For Notion1',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [4048, 4896],
    })
    GetRatingFormattedForNotion1 = {
        mode: 'runOnceForEachItem',
        jsCode: `let output;

switch ($json.sentiment_score) {
  case 0:
    output = '0 - Very Negative';
    break;

  case 1:
    output = '1 - Negative';
    break;

  case 2:
    output = '2 - Relatively Negative';
    break;

  case 3:
    output = '3 - Neutral';
    break;

  case 4:
    output = '4 - Relatively Positive';
    break;

  case 5:
    output = '5 - Very Positive';
    break;

  default:
    output = '3 - Neutral';
}

return { output };`,
    };

    @node({
        id: 'fb99b680-1e53-40ee-b5c8-7d9a733bfe75',
        name: 'Get All Results2',
        type: 'n8n-nodes-base.notion',
        version: 2.2,
        position: [1488, 4128],
        credentials: { notionApi: { id: 'k0ZwGrqySi9Wayf7', name: 'Stephen Notion account' } },
        alwaysOutputData: true,
        executeOnce: true,
    })
    GetAllResults2 = {
        resource: 'databasePage',
        operation: 'getAll',
        databaseId: {
            __rl: true,
            value: '2a4785c0-cfab-8160-b859-f1992a8d67d8',
            mode: 'list',
            cachedResultName: 'Syntech Biofuel Mention Tracker',
            cachedResultUrl: 'https://www.notion.so/2a4785c0cfab8160b859f1992a8d67d8',
        },
        returnAll: true,
        options: {},
    };

    @node({
        id: '477f2a62-2659-4c5e-b17b-9cf18f04c0d4',
        name: 'OpenAI Chat Model3',
        type: '@n8n/n8n-nodes-langchain.lmChatOpenAi',
        version: 1.2,
        position: [2624, 4176],
        credentials: { openAiApi: { id: 'NoEKitspBJb0zQrp', name: 'Syntech GM OpenAi account' } },
    })
    OpenaiChatModel3 = {
        model: {
            __rl: true,
            mode: 'list',
            value: 'gpt-4.1-mini',
        },
        options: {
            temperature: 0.2,
        },
    };

    @node({
        id: 'd20287a3-439d-4ccc-a82b-220cf2a7b93d',
        name: 'Structured Output Parser3',
        type: '@n8n/n8n-nodes-langchain.outputParserStructured',
        version: 1.3,
        position: [2752, 4176],
    })
    StructuredOutputParser3 = {
        schemaType: 'manual',
        inputSchema: `{
  "type": "object",
  "properties": {
    "relevant": {
      "type": "boolean",
      "description": "True if the content meaningfully discusses or refers to Syntech Biofuel based on the source type. False if it’s irrelevant, too generic, or about another entity."
    },
    "reason": {
      "type": "string",
      "description": "Short factual explanation of why the content is or isn't relevant to Syntech Biofuel. Max 1–2 sentences."
    }
  },
  "required": ["relevant", "reason"],
  "additionalProperties": false
}`,
    };

    @node({
        id: '587938cd-927f-40b4-9365-902310c69be5',
        name: 'Classification Pre-Screener',
        type: '@n8n/n8n-nodes-langchain.chainLlm',
        version: 1.7,
        position: [2608, 3952],
    })
    ClassificationPreScreener = {
        promptType: 'define',
        text: `=Source (if present): {{ $json.source }}
Title: {{ $('Deduplicated Articles').item.json.title }}
Summary: {{ $('Deduplicated Articles').item.json.summary }}
Content: {{ $('Deduplicated Articles').item.json.content }}`,
        hasOutputParser: true,
        messages: {
            messageValues: [
                {
                    message: `=<prompt>
    <introduction>
        You are a content relevance screener for mentions of **Syntech Biofuel**, a company in the renewable fuels sector. 
        Your task is to determine whether the provided content is **meaningfully relevant** to Syntech Biofuel, using an understanding of the **source type** and content structure.
    </introduction>

    <input>
        You will receive:
        1. \`content\` — a block of text or scraped content from a page or post.
        2. \`source_type\` — the type of content source, such as "article", "tweet", "directory", "forum_post", "instagram", or "unknown".
    </input>

    <task>
        Based on the \`source_type\`, evaluate whether the content contains a **meaningful reference** to Syntech Biofuel.
        
        - **Relevant** means Syntech Biofuel is explicitly or implicitly discussed, quoted, evaluated, or referenced in a meaningful way — including operational updates, market presence, news, commentary, or sentiment.
        - If **source_type is a social platform** like "tweet" or "instagram", short-form or thin content may still be relevant if it names or clearly implies Syntech Biofuel in a meaningful way.
        - If the **source_type is "directory", "listing", or "tag page"**, and Syntech is just listed or linked without substantive content, mark it as **not relevant**.
        - If Syntech is not mentioned at all, or refers to a different company called Syntech, also mark it as **not relevant**.

        Output your decision as a JSON object in this format:
        {"relevant": true/false, "reason": "short factual explanation"}
    </task>

    <examples>
        {"relevant": true, "reason": "Tweet includes a direct mention of Syntech Biofuel’s new refinery and expresses public support."}
        {"relevant": false, "reason": "The content is a directory of ESG topics with no detailed mention of Syntech Biofuel."}
        {"relevant": true, "reason": "Instagram post shows Syntech Biofuel’s team attending an industry summit, with relevant caption."}
        {"relevant": false, "reason": "The content lists Syntech among many companies without providing any additional information."}
        {"relevant": false, "reason": "No mention of Syntech Biofuel was found in the content."}
    </examples>

    <steps>
        1. Review the \`content\` and the \`source_type\`.
        2. Determine if the content meaningfully references Syntech Biofuel.
        3. Use context-appropriate thresholds depending on the source type.
        4. If relevant, return: {"relevant": true, "reason": "..."}
        5. If not, return: {"relevant": false, "reason": "..."}
        6. Output only the JSON object. Do not output commentary, formatting, or metadata.
    </steps>

    <restrictions>
        * Treat short content (like tweets or Instagram captions) as valid if it expresses relevance.
        * Be strict with listings, index pages, and scraped feeds — reject unless there's meaningful context.
        * Ignore other companies named Syntech unless it clearly refers to Syntech Biofuel.
        * Keep the \`reason\` short (1–2 factual sentences).
    </restrictions>
</prompt>`,
                },
            ],
        },
        batching: {
            batchSize: 10,
            delayBetweenBatches: 1000,
        },
    };

    @node({
        id: '2208d0b3-84a7-42b5-b061-7281fac78867',
        name: 'Syntech Mentioned?',
        type: 'n8n-nodes-base.filter',
        version: 2.3,
        position: [2960, 4048],
    })
    SyntechMentioned = {
        conditions: {
            options: {
                caseSensitive: true,
                leftValue: '',
                typeValidation: 'strict',
                version: 3,
            },
            conditions: [
                {
                    id: '8feba7aa-b555-4f2b-aa8d-307b4c49fb48',
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

    @node({
        id: 'b47cfc29-5828-4f4c-8c30-62ec42ba1171',
        name: 'Merge6',
        type: 'n8n-nodes-base.merge',
        version: 3.2,
        position: [1712, 4048],
    })
    Merge6 = {
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
        id: '5fd3e5b5-ab3e-4e27-9c0a-182bc14d0c01',
        name: 'Aggregate1',
        type: 'n8n-nodes-base.aggregate',
        version: 1,
        position: [1936, 4048],
    })
    Aggregate1 = {
        aggregate: 'aggregateAllItemData',
        destinationFieldName: 'articles',
        options: {},
    };

    @node({
        id: 'b9d6b9be-1ade-465e-9d57-9d82f7d33f6a',
        name: 'Semantic Keyword Deduplication1',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [2160, 4048],
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
        id: 'e51e613f-4cc7-4ec8-a8bc-28dd07feb7f7',
        name: 'Sticky Note',
        type: 'n8n-nodes-base.stickyNote',
        version: 1,
        position: [1920, 3872],
    })
    StickyNote = {
        content: `## Semantic Deduplication
This performs semantic deduplication, which uses keywords to create content clusters, selecting the best quality content and reducing the overall number of articles. `,
        height: 336,
        width: 592,
    };

    @node({
        id: '6ebdd0a6-25fa-4bfa-b008-805f851ff39f',
        name: 'If Publication Date1',
        type: 'n8n-nodes-base.if',
        version: 2.2,
        position: [5008, 4912],
    })
    IfPublicationDate1 = {
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
                    leftValue: "={{ $('Map Data for Notion2').item.json.publication_date }}",
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
        id: '45028048-1204-4426-9078-e27183c19237',
        name: 'Splits text in small chuncks1',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [5232, 4144],
    })
    SplitsTextInSmallChuncks1 = {
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
        id: 'd7bb1a59-d525-4d28-b6a5-5ae61a8239f1',
        name: 'IF',
        type: 'n8n-nodes-base.if',
        version: 1,
        position: [5456, 4144],
    })
    If_ = {
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
        id: '49592de8-1a7a-4636-bf3f-6b03ca70e223',
        name: 'Merge5',
        type: 'n8n-nodes-base.merge',
        version: 2.1,
        position: [6352, 4144],
    })
    Merge5 = {
        mode: 'combine',
        combinationMode: 'multiplex',
        options: {},
    };

    @node({
        id: 'eb8e75fe-f211-443e-9e04-15c17ec3f4b4',
        name: 'Loop Over Items1',
        type: 'n8n-nodes-base.splitInBatches',
        version: 3,
        position: [4560, 4512],
    })
    LoopOverItems1 = {
        options: {},
    };

    @node({
        id: '78d1aa03-fb36-4368-8aa0-b640507744c5',
        name: 'If Publication Date3',
        type: 'n8n-nodes-base.if',
        version: 2.2,
        position: [5680, 4000],
    })
    IfPublicationDate3 = {
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
                    leftValue: "={{ $('Map Data for Notion3').item.json.publication_date }}",
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
        id: 'ef6d703a-a492-42a9-83f2-61cefd00d66f',
        name: 'Set Article URL1',
        type: 'n8n-nodes-base.set',
        version: 3.2,
        position: [6128, 3904],
    })
    SetArticleUrl1 = {
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
        id: '0c3b0758-3205-4a9b-b884-d8978bf18c4e',
        name: 'Add Content To Post1',
        type: 'n8n-nodes-base.notion',
        version: 2.2,
        position: [6576, 4144],
        credentials: { notionApi: { id: 'k0ZwGrqySi9Wayf7', name: 'Stephen Notion account' } },
        onError: 'continueErrorOutput',
    })
    AddContentToPost1 = {
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
        id: 'dcafed09-ef89-490d-a876-f7c9c4111ebc',
        name: 'No Operation, do nothing1',
        type: 'n8n-nodes-base.noOp',
        version: 1,
        position: [4784, 3952],
    })
    NoOperationDoNothing1 = {};

    @node({
        id: '849a566b-66b3-4f96-a163-9608b5c2b121',
        name: 'Add Content With Date2',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.3,
        position: [5904, 3760],
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
    "database_id": "2a4785c0cfab8160b859f1992a8d67d8"
  },
  "properties": {
    "Article Name": {
      "title": [
        {
          "text": {
            "content": {{ $('Map Data for Notion3').item.json.title.toJsonString() }}
          }
        }
      ]
    },
    "Publication Date": {
      "date": {
        "start": "{{ $('Map Data for Notion3').item.json.publication_date }}"
      }
    },
    "Source URL": {
      "url": "{{ $('Map Data for Notion3').item.json.url }}"
    },
    "Source": {
      "multi_select": [
        {
          "name": {{ $('Map Data for Notion3').item.json.source.toJsonString() }}
        }
      ]
    },
    "Source Name": {
      "rich_text": [
        {
          "text": {
            "content": {{ $('Map Data for Notion3').item.json.source_name.toJsonString() }}
          }
        }
      ]
    },
    "Rating": {
      "select": {
        "name": "{{ $('Map Data for Notion3').item.json.rating }}"
      }
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
            "content": {{ $('Map Data for Notion3').item.json.search_query.toJsonString() }}
          }
        }
      ]
    },    
    "Summary": {
      "rich_text": [
        {
          "text": {
            "content": {{ $('Map Data for Notion3').item.json.summary.toJsonString() }}
          }
        }
      ]
    },
    "Own Analysis": {
      "rich_text": [
        {
          "text": {
            "content": "{{ $('Map Data for Notion3').item.json.prompt || 'N/a' }}"
          }
        }
      ]
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
}
`,
        options: {},
    };

    @node({
        id: '07f6dbdf-91ec-4691-9f55-8e2592944d0f',
        name: 'Add Content Without Date2',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.3,
        position: [5904, 4048],
        credentials: { notionApi: { id: 'k0ZwGrqySi9Wayf7', name: 'Stephen Notion account' } },
        onError: 'continueErrorOutput',
    })
    AddContentWithoutDate2 = {
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
    "database_id": "2a4785c0cfab8160b859f1992a8d67d8"
  },
  "properties": {
    "Article Name": {
      "title": [
        {
          "text": {
            "content": {{ $('Map Data for Notion3').item.json.title.toJsonString() }}
          }
        }
      ]
    },
    "Source URL": {
      "url": "{{ $('Map Data for Notion3').item.json.url }}"
    },
    "Source": {
      "multi_select": [
        {
          "name": {{ $('Map Data for Notion3').item.json.source.toJsonString() }}
        }
      ]
    },
    "Source Name": {
      "rich_text": [
        {
          "text": {
            "content": {{ $('Map Data for Notion3').item.json.source_name.toJsonString() }}
          }
        }
      ]
    },
    "Rating": {
      "select": {
        "name": "{{ $('Map Data for Notion3').item.json.rating }}"
      }
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
            "content": {{ $('Map Data for Notion3').item.json.search_query.toJsonString() }}
          }
        }
      ]
    },    
    "Summary": {
      "rich_text": [
        {
          "text": {
            "content": {{ $('Map Data for Notion3').item.json.summary.toJsonString() }}
          }
        }
      ]
    },
    "Own Analysis": {
      "rich_text": [
        {
          "text": {
            "content": "{{ $('Map Data for Notion3').item.json.prompt || 'N/a' }}"
          }
        }
      ]
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
}
`,
        options: {},
    };

    @node({
        id: 'fdf10db1-1c77-44b7-a201-d0e558b073a5',
        name: 'Map Data for Notion2',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [4784, 4912],
    })
    MapDataForNotion2 = {
        assignments: {
            assignments: [
                {
                    id: '60beb5e2-6383-409b-8c39-19c9941d0611',
                    name: 'title',
                    value: "={{ $('select fields').item.json.title }}",
                    type: 'string',
                },
                {
                    id: '75e5203c-7fc8-45d1-9aaf-ac3feca9998f',
                    name: 'publication_date',
                    value: `={{
(() => {
  const raw = $('select fields').item.json.publication_date;
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
                    value: "={{ $('select fields').item.json.url ? $('select fields').item.json.url?.trim() : \"NA\" }}",
                    type: 'string',
                },
                {
                    id: '2eaf0819-96c5-43f9-8bfe-60020f39a7da',
                    name: 'source',
                    value: "={{ $('select fields').item.json.source ? $('select fields').item.json.source : \"NA\" }}",
                    type: 'string',
                },
                {
                    id: '96dab174-e8ef-4c01-8047-a56813c50f76',
                    name: 'source_name',
                    value: "={{ $('select fields').item.json.source_name }}",
                    type: 'string',
                },
                {
                    id: '48f2ac2b-de0b-47f6-9b56-f5d231119533',
                    name: 'search_query',
                    value: "={{ $('select fields').item.json.search_query ? $('select fields').item.json.search_query?.trim() : \"NA\"}}",
                    type: 'string',
                },
                {
                    id: 'a6d31903-9b90-4a94-bd31-865b362b41ec',
                    name: 'summary',
                    value: "={{ $('select fields').item.json.summary ? $('select fields').item.json.summary : \"NA\"}}",
                    type: 'string',
                },
                {
                    id: 'af126fa8-eb15-4598-baaf-d6ac11c76a21',
                    name: 'prompt',
                    value: "={{ $if($('select fields').isExecuted, $('select fields').item.json.prompt || '' , '') }}",
                    type: 'string',
                },
                {
                    id: 'c6c89504-6855-44af-a0d8-fdc3c12c79dc',
                    name: 'content_remove_duplicate_node',
                    value: `={{ 
  ($('select fields').item.json.content ?? '')
    .replace(/\\\\/g, '\\\\\\\\')
    .replace(/"/g, '\\\\"')
    .replace(/\\n/g, '\\\\n')
}}`,
                    type: 'string',
                },
                {
                    id: 'edf862c6-703b-410b-934e-58650b86ba52',
                    name: 'rating',
                    value: "={{ $('Get Rating Formatted For Notion1').item.json.output }}",
                    type: 'string',
                },
            ],
        },
        options: {
            ignoreConversionErrors: true,
        },
    };

    @node({
        id: 'ad13c2d0-65c5-4564-8a7d-682f4c9162a1',
        name: 'Map Data for Notion3',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [5008, 4144],
    })
    MapDataForNotion3 = {
        assignments: {
            assignments: [
                {
                    id: '60beb5e2-6383-409b-8c39-19c9941d0611',
                    name: 'title',
                    value: "={{ $('Deduplicated Articles').item.json.title }}",
                    type: 'string',
                },
                {
                    id: '75e5203c-7fc8-45d1-9aaf-ac3feca9998f',
                    name: 'publication_date',
                    value: `={{
(() => {
  const raw = $('Deduplicated Articles').item.json.publication_date;
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
                    value: "={{ $('select fields').item.json.url ? $('select fields').item.json.url?.trim() : \"NA\" }}",
                    type: 'string',
                },
                {
                    id: '2eaf0819-96c5-43f9-8bfe-60020f39a7da',
                    name: 'source',
                    value: "={{ $('select fields').item.json.source ? $('select fields').item.json.source : \"NA\" }}",
                    type: 'string',
                },
                {
                    id: '9fb33c0f-f4c0-4697-8454-f7366cb1469f',
                    name: 'source_name',
                    value: "={{ $('select fields').item.json.source_name }}",
                    type: 'string',
                },
                {
                    id: '48f2ac2b-de0b-47f6-9b56-f5d231119533',
                    name: 'search_query',
                    value: "={{ $('select fields').item.json.search_query ? $('select fields').item.json.search_query?.trim() : \"NA\"}}",
                    type: 'string',
                },
                {
                    id: 'a6d31903-9b90-4a94-bd31-865b362b41ec',
                    name: 'summary',
                    value: "={{ $('select fields').item.json.summary ? $('select fields').item.json.summary : \"NA\"}}",
                    type: 'string',
                },
                {
                    id: 'c6c89504-6855-44af-a0d8-fdc3c12c79dc',
                    name: 'content_remove_duplicate_node',
                    value: "={{ $('Deduplicated Articles').item.json.content ? $('select fields').item.json.content : \"NA\"}}",
                    type: 'string',
                },
                {
                    id: '7ad26930-4b4b-4d58-97be-db52f57212e3',
                    name: 'content_if_sources_executed',
                    value: "={{ $('Deduplicated Articles').item.json.content ? $('select fields').item.json.content : \"NA\"}}",
                    type: 'string',
                },
                {
                    id: 'e75ac639-3d0f-49fb-9257-ade65d4f55b9',
                    name: 'content_remove_duplicate_node',
                    value: "={{ $('Deduplicated Articles').item.json.content ? $('Deduplicated Articles').item.json.content : \"NA\"}}",
                    type: 'string',
                },
                {
                    id: '8b375e8c-64c7-440a-92d4-f960dd747b35',
                    name: 'rating',
                    value: '={{ $json.output }}',
                    type: 'string',
                },
                {
                    id: 'ec1f0346-e899-485a-82db-b976c2338920',
                    name: 'prompt',
                    value: "={{ $if($('select fields').isExecuted, $('select fields').item.json.prompt || '' , '') }}",
                    type: 'string',
                },
            ],
        },
        options: {
            ignoreConversionErrors: true,
        },
    };

    @node({
        id: 'be83026f-f336-4d9b-9508-a27959362998',
        name: 'Check Sources Executed3',
        type: 'n8n-nodes-base.if',
        version: 2.2,
        position: [4784, 4144],
    })
    CheckSourcesExecuted3 = {
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
        id: 'ec59618e-d530-4333-8781-b64ff62e47a4',
        webhookId: 'd98789a2-b2b3-4f8f-a4fb-e226aa1adb2e',
        name: 'Send a message7',
        type: 'n8n-nodes-base.slack',
        version: 2.3,
        position: [6128, 3712],
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
        text: `= *Workflow Execution Error* ⚠️

- *Workflow Name:* News Sourcing Production (V2)
- *Error Node:* Add Content With Date
- *Error Message:* {{ $json.error }}
- *Timestamp:* {{ $now.toFormat('dd-MM-yyyy HH:mm:ss') }}
- *Issue:* News sourcing workflow skipped some news
- *Article:* 
Title: {{ $('Map Data for Notion3').item.json.title }}
Url: {{ $('Map Data for Notion3').item.json.url }}
Summary: {{ $('Map Data for Notion3').item.json.summary }}

*Next Steps:* Please review the workflow and retry the execution.
Workflow Execution: <https://syntech.granite-automations.app/workflow/{{ $workflow.id }}/executions/{{ $execution.id }}|View Execution>`,
        otherOptions: {
            includeLinkToWorkflow: false,
            unfurl_links: true,
        },
    };

    @node({
        id: 'd5050a1d-3861-4b08-904c-1c44d4c578d1',
        webhookId: 'd98789a2-b2b3-4f8f-a4fb-e226aa1adb2e',
        name: 'Send a message8',
        type: 'n8n-nodes-base.slack',
        version: 2.3,
        position: [6128, 4096],
        credentials: { slackApi: { id: 'hndVCHiq0HgMBAh3', name: 'Stephen Slack account' } },
    })
    SendAMessage8 = {
        select: 'channel',
        channelId: {
            __rl: true,
            value: 'C09V1831FN2',
            mode: 'list',
            cachedResultName: 'syntech-n8n-error-tracker',
        },
        text: `= *Workflow Execution Error* ⚠️

- *Workflow Name:* Syntech Mentions
- *Error Node:* Add Content Without Date
- *Error Message:* {{ $json.error }}
- *Timestamp:* {{ $now.toFormat('dd-MM-yyyy HH:mm:ss') }}
- *Issue:* News sourcing workflow skipped some news
- *Article:* 
Title: {{ $('Map Data for Notion3').item.json.title }}
Url: {{ $('Map Data for Notion3').item.json.url }}
Summary: {{ $('Map Data for Notion3').item.json.summary }}

*Next Steps:* Please review the workflow and retry the execution.
Workflow Execution: <https://syntech.granite-automations.app/workflow/{{ $workflow.id }}/executions/{{ $execution.id }}|View Execution>`,
        otherOptions: {
            includeLinkToWorkflow: false,
            unfurl_links: true,
        },
    };

    @node({
        id: '4a0e21e4-b2b5-4669-abdd-c38cc9a5ef62',
        webhookId: 'd98789a2-b2b3-4f8f-a4fb-e226aa1adb2e',
        name: 'Send a message9',
        type: 'n8n-nodes-base.slack',
        version: 2.3,
        position: [6800, 4384],
        credentials: { slackApi: { id: 'hndVCHiq0HgMBAh3', name: 'Stephen Slack account' } },
    })
    SendAMessage9 = {
        select: 'channel',
        channelId: {
            __rl: true,
            value: 'C09V1831FN2',
            mode: 'list',
            cachedResultName: 'syntech-n8n-error-tracker',
        },
        text: `= *Workflow Execution Error* ⚠️

- *Workflow Name:* Syntech Mentions
- *Error Node:* Add Content To Post
- *Error Message:* {{ $json.error }}
- *Timestamp:* {{ $now.toFormat('dd-MM-yyyy HH:mm:ss') }}
- *Article:* 
Title: {{ $('Map Data for Notion3').item.json.title }}
Url: {{ $('Map Data for Notion3').item.json.url }}
Summary: {{ $('Map Data for Notion3').item.json.summary }}

*Next Steps:* Please review the workflow and retry the execution.
Workflow Execution: <https://syntech.granite-automations.app/workflow/{{ $workflow.id }}/executions/{{ $execution.id }}|View Execution>`,
        otherOptions: {
            includeLinkToWorkflow: false,
            unfurl_links: true,
        },
    };

    @node({
        id: 'f1d6e38c-f1f8-4d5a-bb08-a736dcf793ab',
        name: 'Merge',
        type: 'n8n-nodes-base.merge',
        version: 3.2,
        position: [816, 3968],
    })
    Merge = {
        numberInputs: 7,
    };

    @node({
        id: 'cde60031-fc49-4c9b-bc36-817966793f21',
        name: 'Match Sources',
        type: 'n8n-nodes-base.switch',
        version: 3.3,
        position: [368, 3840],
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
        id: '69994eba-4330-4907-a4bd-fbed6d69adec',
        name: "Call 'LinkedIn Search (Profile, Keyword, Company)'",
        type: 'n8n-nodes-base.executeWorkflow',
        version: 1.3,
        position: [592, 3808],
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
        id: 'df86631a-0e63-4548-ba0e-eab945cdcea0',
        name: "Call 'Tavily Keyword Search'",
        type: 'n8n-nodes-base.executeWorkflow',
        version: 1.3,
        position: [592, 4192],
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
        id: '588772fa-168e-4d87-9adb-b82131d44c98',
        name: "Call 'Search Instagram Page'",
        type: 'n8n-nodes-base.executeWorkflow',
        version: 1.3,
        position: [592, 4384],
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
        id: 'cdb4e3c7-f0ed-4b38-81f4-44ad22f88a96',
        name: "Call 'Search Website (From Form)'",
        type: 'n8n-nodes-base.executeWorkflow',
        version: 1.3,
        position: [592, 4576],
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
        id: '60b87dc0-5729-4d94-8f07-a913c165ce59',
        name: "Call 'Search Twitter/X (Post and Keyword)'",
        type: 'n8n-nodes-base.executeWorkflow',
        version: 1.3,
        position: [592, 4768],
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
        id: 'c03c259e-03bd-43a2-a323-792b37f84e56',
        name: "Call 'RSS Website Search (With RSS URL)'",
        type: 'n8n-nodes-base.executeWorkflow',
        version: 1.3,
        position: [592, 3616],
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
        id: 'd6a51d1c-8fac-43eb-bc8b-15f0ed0760fb',
        name: "Call 'Search Google Syntech'",
        type: 'n8n-nodes-base.executeWorkflow',
        version: 1.3,
        position: [592, 4000],
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
        id: '5260f01f-7000-4216-93e6-e42e115c0ddb',
        name: 'Remove Duplicates',
        type: 'n8n-nodes-base.removeDuplicates',
        version: 2,
        position: [1264, 4048],
    })
    RemoveDuplicates = {
        compare: 'selectedFields',
        fieldsToCompare: 'url',
        options: {},
    };

    @node({
        id: 'f2932479-005f-4781-a8d3-93f6e49db643',
        name: 'Is Valid Content?',
        type: 'n8n-nodes-base.filter',
        version: 2.2,
        position: [1040, 4048],
    })
    IsValidContent = {
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
        id: '211432cf-4a22-43ac-b40c-7fefda7840c1',
        name: 'Deduplicated Articles',
        type: 'n8n-nodes-base.splitOut',
        version: 1,
        position: [2384, 4048],
    })
    DeduplicatedArticles = {
        fieldToSplitOut: 'selected_articles',
        options: {},
    };

    @node({
        id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        name: 'Source Exclusion',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [2584, 4048],
    })
    SourceExclusion = {
        mode: 'runOnceForAllItems',
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

// Add any additional blocklist entries from ENV
const envBlocklist = $env.SYNTECH_BLOCKLIST || '';
if (envBlocklist) {
  blocklist.push(...envBlocklist.split(',').map(s => s.trim().toLowerCase()));
}

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
        id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
        name: 'Pre-filter',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [2784, 4048],
    })
    PreFilter = {
        mode: 'runOnceForAllItems',
        jsCode: `/**
 * Pre-filter: 3-tier relevance check to reduce LLM costs
 *
 * Tier 1: "Syntech" present (case-insensitive) → instant pass
 * Tier 2: Surname (Bingham, Hart, Olone) + biofuel context + "Syntech" → instant pass
 * Tier 3: Surname + biofuel context WITHOUT "Syntech" → needs LLM verification
 *
 * Items failing all tiers are filtered out.
 */

// Get config from ENV or use defaults
const surnames = ($env.SYNTECH_SURNAMES || 'Bingham,Hart,Olone')
  .split(',')
  .map(s => s.trim().toLowerCase());

const biofuelTerms = [
  'biofuel', 'biofuels', 'biodiesel', 'bioethanol', 'renewable fuel',
  'sustainable fuel', 'green fuel', 'hvo', 'saf', 'sustainable aviation',
  'used cooking oil', 'uco', 'waste oil', 'feedstock', 'decarbonization',
  'decarbonisation', 'net zero', 'net-zero', 'carbon neutral'
];

const results = [];

for (const item of $input.all()) {
  const content = (item.json.content || '').toLowerCase();
  const title = (item.json.title || '').toLowerCase();
  const text = content + ' ' + title;

  const hasSyntech = /syntech/i.test(text);
  const hasSurname = surnames.some(name => text.includes(name));
  const hasBiofuelContext = biofuelTerms.some(term => text.includes(term));

  let tier = null;
  let pass = false;

  // Tier 1: Syntech explicitly mentioned
  if (hasSyntech) {
    tier = 1;
    pass = true;
  }
  // Tier 2: Surname + biofuel context + Syntech
  else if (hasSurname && hasBiofuelContext && hasSyntech) {
    tier = 2;
    pass = true;
  }
  // Tier 3: Surname + biofuel context WITHOUT Syntech → needs LLM check
  else if (hasSurname && hasBiofuelContext && !hasSyntech) {
    tier = 3;
    pass = true; // Will be verified by downstream LLM
    item.json._needsLlmVerification = true;
  }
  // No match - filter out
  else if (hasSurname || hasBiofuelContext) {
    // Partial match - might be relevant, let it through for LLM check
    tier = 3;
    pass = true;
    item.json._needsLlmVerification = true;
  }

  if (pass) {
    item.json._preFilterTier = tier;
    results.push(item);
  }
}

console.log(\`Pre-filter: \${results.length} items passed (Tier 1: instant, Tier 3: pending LLM)\`);

return results;`,
    };

    @node({
        id: '10759796-c19b-4103-927a-7efa8945686e',
        name: 'sources',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [144, 4096],
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
        id: 'e0015fb6-c186-4a9f-b002-3b79f4657ee1',
        webhookId: 'd7c4ad3a-52b4-46fd-b480-76a083a42ff2',
        name: 'Form Submission1',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [-80, 4096],
    })
    FormSubmission1 = {
        httpMethod: 'POST',
        path: 'mention-tracking-production',
        options: {},
    };

    @node({
        id: '7ff7df66-38f7-46c7-8880-0ffb6a3b1ad7',
        name: 'Check Sources Executed',
        type: 'n8n-nodes-base.if',
        version: 2.2,
        position: [4560, 4912],
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
        id: 'c74eca0d-b142-4491-bf93-6aabbad3e7cb',
        name: 'select fields',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [3760, 4368],
    })
    SelectFields = {
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
                    id: '294ed909-fb37-4f4b-94dc-e76fbf1f3e21',
                    name: 'sentiment_score',
                    value: "={{ $('Classification agent with Batch').item.json.output.sentiment_score }}",
                    type: 'number',
                },
                {
                    id: 'af8ebff6-6518-42cd-9c7e-1cc4b41b3b7b',
                    name: 'reason',
                    value: "={{ $('Classification agent with Batch').item.json.output.reason }}",
                    type: 'string',
                },
                {
                    id: 'ffc903b2-60a9-471e-b19d-064fe45f6e62',
                    name: 'source_name',
                    value: "={{ $('Deduplicated Articles').item.json.source_name }}",
                    type: 'string',
                },
            ],
        },
        options: {},
    };

    @node({
        id: '1748e93b-5d8e-47cd-b06d-01b34aae0662',
        name: 'Add Content With Date',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.3,
        position: [5232, 4800],
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
    "database_id": "2a4785c0cfab8160b859f1992a8d67d8"
  },
  "properties": {
    "Article Name": {
      "title": [
        {
          "text": {
            "content": {{ $('Map Data for Notion2').item.json.title.toJsonString() }}
          }
        }
      ]
    },
    "Publication Date": {
      "date": {
        "start": "{{ $('Map Data for Notion2').item.json.publication_date }}"
      }
    },
    "Source URL": {
      "url": "{{ $('Map Data for Notion2').item.json.url }}"
    },
    "Source": {
      "multi_select": [
        {
          "name": {{ $('Map Data for Notion2').item.json.source.toJsonString() }}
        }
      ]
    },
    "Source Name": {
      "rich_text": [
        {
          "text": {
            "content": {{ $('Map Data for Notion2').item.json.source_name.toJsonString() }}
          }
        }
      ]
    },
    "Rating": {
      "select": {
        "name": "{{ $('Map Data for Notion2').item.json.rating }}"
      }
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
            "content": {{ $('Map Data for Notion2').item.json.search_query.toJsonString() }}
          }
        }
      ]
    },    
    "Summary": {
      "rich_text": [
        {
          "text": {
            "content": {{ $('Map Data for Notion2').item.json.summary.toJsonString() }}
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
        id: '2547401d-9013-43a5-8617-e70bdabc11f4',
        name: 'Add Content Without Date',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.3,
        position: [5232, 4992],
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
    "database_id": "2a4785c0cfab8160b859f1992a8d67d8"
  },
  "properties": {
    "Article Name": {
      "title": [
        {
          "text": {
            "content": {{ $('Map Data for Notion2').item.json.title.toJsonString() }}
          }
        }
      ]
    },
    "Source URL": {
      "url": "{{ $('Map Data for Notion2').item.json.url }}"
    },
    "Source": {
      "multi_select": [
        {
          "name": {{ $('Map Data for Notion2').item.json.source.toJsonString() }}
        }
      ]
    },
    "Source Name": {
      "rich_text": [
        {
          "text": {
            "content": {{ $('Map Data for Notion2').item.json.source_name.toJsonString() }}
          }
        }
      ]
    },
    "Rating": {
      "select": {
        "name": "{{ $('Map Data for Notion2').item.json.rating }}"
      }
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
            "content": {{ $('Map Data for Notion2').item.json.search_query.toJsonString() }}
          }
        }
      ]
    },    
    "Summary": {
      "rich_text": [
        {
          "text": {
            "content": {{ $('Map Data for Notion2').item.json.summary.toJsonString() }}
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
        id: '22ecebae-c6af-44d9-964b-3292dd060fca',
        webhookId: 'd98789a2-b2b3-4f8f-a4fb-e226aa1adb2e',
        name: 'Send a message',
        type: 'n8n-nodes-base.slack',
        version: 2.3,
        position: [5456, 4800],
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

- *Workflow Name:* Syntech Mentions
- *Error Node:* Add Content With Date1
- *Error Message:* {{ $json.error }}
- *Timestamp:* {{ $now.toFormat('dd-MM-yyyy HH:mm:ss') }}
- *Issue:* News sourcing workflow skipped some news
- *Article:* 
Title: {{ $('Map Data for Notion2').item.json.title }}
Url: {{ $('Map Data for Notion2').item.json.url }}
Summary: {{ $('Map Data for Notion2').item.json.summary }}

*Next Steps:* Please review the workflow and retry the execution.
Workflow Execution: <https://syntech.granite-automations.app/workflow/{{ $workflow.id }}/executions/{{ $execution.id }}|View Execution>`,
        otherOptions: {
            includeLinkToWorkflow: false,
            unfurl_links: true,
        },
    };

    @node({
        id: '5a5e9cff-9752-4a59-b9c5-791c38103c4e',
        webhookId: 'd98789a2-b2b3-4f8f-a4fb-e226aa1adb2e',
        name: 'Send a message1',
        type: 'n8n-nodes-base.slack',
        version: 2.3,
        position: [5456, 4992],
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

- *Workflow Name:* Syntech Mentions
- *Error Node:* Add Content Without Date1
- *Error Message:* {{ $json.error }}
- *Timestamp:* {{ $now.toFormat('dd-MM-yyyy HH:mm:ss') }}
- *Issue:* News sourcing workflow skipped some news
- *Article:* 
Title: {{ $('Map Data for Notion2').item.json.title }}
Url: {{ $('Map Data for Notion2').item.json.url }}
Summary: {{ $('Map Data for Notion2').item.json.summary }}

*Next Steps:* Please review the workflow and retry the execution.
Workflow Execution: <https://syntech.granite-automations.app/workflow/{{ $workflow.id }}/executions/{{ $execution.id }}|View Execution>`,
        otherOptions: {
            includeLinkToWorkflow: false,
            unfurl_links: true,
        },
    };

    // =====================================================================
    // ROUTAGE ET CONNEXIONS
    // =====================================================================

    @links()
    defineRouting() {
        this.ScheduleTrigger.out(0).to(this.GetAllSources.in(0));
        this.GetAllSources.out(0).to(this.GetActiveSources.in(0));
        this.GetActiveSources.out(0).to(this.Limit1.in(0));
        this.Limit1.out(0).to(this.MatchSources.in(0));
        this.ManuallyTriggerContentEngine.out(0).to(this.GetAllSources.in(0));
        this.MatchInputFormat1.out(0).to(this.ClassificationAgentWithBatch.in(0));
        this.Evaluation2.out(0).to(this.SetOutputInEvaluationGoogleSheet1.in(0));
        this.Evaluation2.out(1).to(this.SelectFields.in(0));
        this.RunEvaluation1.out(0).to(this.GetAllSources3.in(0));
        this.SetOutputInEvaluationGoogleSheet1.out(0).to(this.Evaluation3.in(0));
        this.IfTextLongerThan2000Chars1.out(0).to(this.LoopOverItems1.in(0));
        this.IfTextLongerThan2000Chars1.out(1).to(this.CheckSourcesExecuted.in(0));
        this.RemoveDuplicates6.out(0).to(this.AddContentIdeaToEvaluationTable.in(0));
        this.SetGoogleSheetFields1.out(0).to(this.RemoveDuplicates6.in(0));
        this.GetAllIdeasFromEvaluationTable.out(0).to(this.RemoveDuplicates6.in(1));
        this.GetAllSources3.out(0).to(this.MatchInputFormat1.in(0));
        this.ClassificationAgentWithBatch.out(0).to(this.Evaluation2.in(0));
        this.GetRatingFormattedForNotion1.out(0).to(this.IfTextLongerThan2000Chars1.in(0));
        this.GetAllResults2.out(0).to(this.Merge6.in(1));
        this.ClassificationPreScreener.out(0).to(this.SyntechMentioned.in(0));
        this.SyntechMentioned.out(0).to(this.ClassificationAgentWithBatch.in(0));
        this.Merge6.out(0).to(this.Aggregate1.in(0));
        this.Aggregate1.out(0).to(this.SemanticKeywordDeduplication1.in(0));
        this.SemanticKeywordDeduplication1.out(0).to(this.DeduplicatedArticles.in(0));
        this.IfPublicationDate1.out(0).to(this.AddContentWithDate.in(0));
        this.IfPublicationDate1.out(1).to(this.AddContentWithoutDate.in(0));
        this.SplitsTextInSmallChuncks1.out(0).to(this.If_.in(0));
        this.If_.out(0).to(this.IfPublicationDate3.in(0));
        this.If_.out(1).to(this.Merge5.in(1));
        this.Merge5.out(0).to(this.AddContentToPost1.in(0));
        this.LoopOverItems1.out(0).to(this.NoOperationDoNothing1.in(0));
        this.LoopOverItems1.out(1).to(this.CheckSourcesExecuted3.in(0));
        this.IfPublicationDate3.out(0).to(this.AddContentWithDate2.in(0));
        this.IfPublicationDate3.out(1).to(this.AddContentWithoutDate2.in(0));
        this.SetArticleUrl1.out(0).to(this.Merge5.in(0));
        this.AddContentToPost1.out(0).to(this.LoopOverItems1.in(0));
        this.AddContentToPost1.out(1).to(this.SendAMessage9.in(0));
        this.AddContentWithDate2.out(0).to(this.SetArticleUrl1.in(0));
        this.AddContentWithDate2.out(1).to(this.SendAMessage7.in(0));
        this.AddContentWithoutDate2.out(0).to(this.SetArticleUrl1.in(0));
        this.AddContentWithoutDate2.out(1).to(this.SendAMessage8.in(0));
        this.MapDataForNotion2.out(0).to(this.IfPublicationDate1.in(0));
        this.MapDataForNotion3.out(0).to(this.SplitsTextInSmallChuncks1.in(0));
        this.CheckSourcesExecuted3.out(0).to(this.MapDataForNotion3.in(0));
        this.CheckSourcesExecuted3.out(1).to(this.MapDataForNotion3.in(0));
        this.SendAMessage7.out(0).to(this.LoopOverItems1.in(0));
        this.SendAMessage8.out(0).to(this.LoopOverItems1.in(0));
        this.SendAMessage9.out(0).to(this.LoopOverItems1.in(0));
        this.MatchSources.out(0).to(this.CallRssWebsiteSearchWithRssUrl.in(0));
        this.MatchSources.out(1).to(this.CallLinkedinSearchProfileKeywordCompany.in(0));
        this.MatchSources.out(2).to(this.CallTavilyKeywordSearch.in(0));
        this.MatchSources.out(2).to(this.CallSearchGoogleSyntech.in(0));
        this.MatchSources.out(3).to(this.CallSearchInstagramPage.in(0));
        this.MatchSources.out(4).to(this.CallSearchWebsiteFromForm.in(0));
        this.MatchSources.out(5).to(this.CallSearchTwitterXPostAndKeyword.in(0));
        this.CallLinkedinSearchProfileKeywordCompany.out(0).to(this.Merge.in(1));
        this.CallTavilyKeywordSearch.out(0).to(this.Merge.in(3));
        this.CallSearchInstagramPage.out(0).to(this.Merge.in(4));
        this.CallSearchWebsiteFromForm.out(0).to(this.Merge.in(5));
        this.CallSearchTwitterXPostAndKeyword.out(0).to(this.Merge.in(6));
        this.CallRssWebsiteSearchWithRssUrl.out(0).to(this.Merge.in(0));
        this.CallSearchGoogleSyntech.out(0).to(this.Merge.in(2));
        this.Merge.out(0).to(this.IsValidContent.in(0));
        this.RemoveDuplicates.out(0).to(this.Merge6.in(0));
        this.RemoveDuplicates.out(0).to(this.GetAllResults2.in(0));
        this.IsValidContent.out(0).to(this.RemoveDuplicates.in(0));
        this.DeduplicatedArticles.out(0).to(this.SourceExclusion.in(0));
        this.SourceExclusion.out(0).to(this.PreFilter.in(0));
        this.PreFilter.out(0).to(this.ClassificationPreScreener.in(0));
        this.FormSubmission1.out(0).to(this.Sources.in(0));
        this.Sources.out(0).to(this.MatchSources.in(0));
        this.CheckSourcesExecuted.out(0).to(this.MapDataForNotion2.in(0));
        this.CheckSourcesExecuted.out(1).to(this.MapDataForNotion2.in(0));
        this.SelectFields.out(0).to(this.SetGoogleSheetFields1.in(0));
        this.SelectFields.out(0).to(this.GetAllIdeasFromEvaluationTable.in(0));
        this.SelectFields.out(0).to(this.GetRatingFormattedForNotion1.in(0));
        this.AddContentWithDate.out(1).to(this.SendAMessage.in(0));
        this.AddContentWithoutDate.out(1).to(this.SendAMessage1.in(0));

        this.ClassificationAgentWithBatch.uses({
            ai_languageModel: this.OpenaiChatModel2.output,
            ai_outputParser: this.StructuredOutputParser1.output,
        });
        this.Evaluation3.uses({
            ai_languageModel: this.OpenaiChatModel9.output,
        });
        this.ClassificationPreScreener.uses({
            ai_languageModel: this.OpenaiChatModel3.output,
            ai_outputParser: this.StructuredOutputParser3.output,
        });
    }
}
