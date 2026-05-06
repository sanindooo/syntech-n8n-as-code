import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : News Sourcing Production (V2)
// Nodes   : 14  |  Connections: 14
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// ScheduleTrigger                    scheduleTrigger
// GetAllSources                      notion                     [creds]
// IfHighPriority                     if
// Randomise                          sort
// Sources                            set
// Merge3                             merge
// FormSubmission1                    webhook
// Limit1                             limit
// ManuallyTriggerContentEngine       webhook
// Get15Ideas                         limit
// MapToContentSourcing               set
// CallContentSourcing                httpRequest                [onError→out(1)] [creds] [retry]
// NoOperationDoNothing1              noOp
// Error                              set
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// ScheduleTrigger
//    → GetAllSources
//      → IfHighPriority
//        → Merge3
//          → Limit1
//            → MapToContentSourcing
//              → CallContentSourcing
//                → NoOperationDoNothing1
//               .out(1) → Error
//       .out(1) → Randomise
//          → Get15Ideas
//            → Merge3.in(1) (↩ loop)
// FormSubmission1
//    → Sources
//      → MapToContentSourcing (↩ loop)
// ManuallyTriggerContentEngine
//    → GetAllSources (↩ loop)
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
        id: 'ef22580c-bc40-4bb4-a9e5-88b793f3b432',
        name: 'Schedule Trigger',
        type: 'n8n-nodes-base.scheduleTrigger',
        version: 1.2,
        position: [5088, 4480],
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
        id: '3a1107e8-5550-499e-a4ca-78af1f940bb4',
        name: 'Get All Sources',
        type: 'n8n-nodes-base.notion',
        version: 2.2,
        position: [5312, 4576],
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
        id: 'd1f4775b-b11d-470f-8277-157563593dab',
        name: 'If High Priority',
        type: 'n8n-nodes-base.if',
        version: 2.2,
        position: [5536, 4576],
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
        id: '687b518f-a827-4286-928e-3b7d4576f20a',
        name: 'Randomise',
        type: 'n8n-nodes-base.sort',
        version: 1,
        position: [5760, 4656],
    })
    Randomise = {
        type: 'random',
    };

    @node({
        id: '40cec2d8-e3f9-4d31-a1f2-f9624305b1af',
        name: 'sources',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [6432, 4768],
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
        id: 'c994aa93-dbf8-44f8-8e75-6a5eea8155fb',
        name: 'Merge3',
        type: 'n8n-nodes-base.merge',
        version: 3.2,
        position: [6208, 4576],
    })
    Merge3 = {};

    @node({
        id: 'fa8c650a-cece-43da-a0a5-1a048bacf932',
        webhookId: 'd7c4ad3a-52b4-46fd-b480-76a083a42ff2',
        name: 'Form Submission1',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [6208, 4768],
    })
    FormSubmission1 = {
        httpMethod: 'POST',
        path: 'news-sourcing-production',
        options: {},
    };

    @node({
        id: 'e03b8d84-6fa1-40b2-b70b-9ca177e0b6bf',
        name: 'Limit1',
        type: 'n8n-nodes-base.limit',
        version: 1,
        position: [6432, 4576],
    })
    Limit1 = {
        maxItems: 1000,
    };

    @node({
        id: '67592465-ef64-427c-917d-eefd1d0597e4',
        webhookId: 'eda87c01-fe8a-42f6-a116-fa1b7eb6d165',
        name: 'Manually Trigger Content Engine',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [5088, 4672],
    })
    ManuallyTriggerContentEngine = {
        httpMethod: 'POST',
        path: 'trigger-content-engine',
        options: {},
    };

    @node({
        id: 'bc4fdf07-3247-4ed7-970f-4f7d02621639',
        name: 'Get 15 Ideas',
        type: 'n8n-nodes-base.limit',
        version: 1,
        position: [5984, 4656],
    })
    Get15Ideas = {
        maxItems: 15,
    };

    @node({
        id: '2ee50459-1301-4621-aa3a-dfad1b69556b',
        name: 'Map To Content Sourcing',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [6656, 4672],
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
                    value: '={{ false }}',
                    type: 'boolean',
                },
            ],
        },
        options: {},
    };

    @node({
        id: 'a896abe6-1919-4737-9c4c-8c7c48a5243f',
        name: 'Call Content Sourcing',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [6880, 4672],
        credentials: { httpBearerAuth: { id: 'e0bBYiHsQNeVlYmn', name: 'Syntech Content Sourcing Bearer' } },
        onError: 'continueErrorOutput',
        executeOnce: false,
        retryOnFail: true,
        waitBetweenTries: 5000,
    })
    CallContentSourcing = {
        method: 'POST',
        url: 'https://syntech-content-sourcing-production.up.railway.app/search',
        authentication: 'genericCredentialType',
        genericAuthType: 'httpBearerAuth',
        sendBody: true,
        specifyBody: 'json',
        jsonBody: `={{JSON.stringify(
  {
    source_type:$json.source_type,
    url_or_keyword:$json.url_or_keyword,
    source_name:$json.source_name,
    source_category:$json.source_category,
    prompt:$json.prompt,
    additional_formats:$json.additional_formats,
    test_mode:$json.test_mode
  }
)}}`,
        options: {
            batching: {
                batch: {
                    batchSize: 3,
                    batchInterval: 2000,
                },
            },
            timeout: 180000,
        },
    };

    @node({
        id: '032efbf9-8e45-42a0-9d7f-558ce850e730',
        name: 'No Operation, do nothing1',
        type: 'n8n-nodes-base.noOp',
        version: 1,
        position: [7104, 4576],
    })
    NoOperationDoNothing1 = {};

    @node({
        id: 'cc893069-7c29-4921-8a76-96c761bfdb25',
        name: 'Error',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [7104, 4768],
    })
    Error = {
        assignments: {
            assignments: [
                {
                    id: '8b991a0d-d332-4593-acef-1af2aaf9bdb2',
                    name: 'error',
                    value: '={{ $json.error.message }}',
                    type: 'string',
                },
                {
                    id: 'a84fbebe-7e0c-4d06-8e6c-cd8799688ce8',
                    name: 'source_type',
                    value: '={{ $json.source_type }}',
                    type: 'string',
                },
                {
                    id: '49d88b45-d93e-47e7-9ee5-33a6c1bc2a3a',
                    name: 'url_or_keyword',
                    value: '={{ $json.url_or_keyword }}',
                    type: 'string',
                },
                {
                    id: 'c4366a40-2c08-4662-9224-43950f5cf6d2',
                    name: 'source_name',
                    value: '={{ $json.source_name }}',
                    type: 'string',
                },
                {
                    id: 'afa82a0e-3262-43a5-adc5-83e5a02883c4',
                    name: 'source_category',
                    value: '={{ $json.source_category }}',
                    type: 'string',
                },
                {
                    id: '9c636a6d-cdc4-48be-9fed-32518707590b',
                    name: 'error.code',
                    value: '={{ $json.error.code }}',
                    type: 'string',
                },
                {
                    id: '57ae904c-c298-4770-9f9e-954856779182',
                    name: 'error.status',
                    value: '={{ $json.error.status }}',
                    type: 'number',
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
        this.ScheduleTrigger.out(0).to(this.GetAllSources.in(0));
        this.GetAllSources.out(0).to(this.IfHighPriority.in(0));
        this.IfHighPriority.out(0).to(this.Merge3.in(0));
        this.IfHighPriority.out(1).to(this.Randomise.in(0));
        this.Randomise.out(0).to(this.Get15Ideas.in(0));
        this.Sources.out(0).to(this.MapToContentSourcing.in(0));
        this.Merge3.out(0).to(this.Limit1.in(0));
        this.FormSubmission1.out(0).to(this.Sources.in(0));
        this.Limit1.out(0).to(this.MapToContentSourcing.in(0));
        this.ManuallyTriggerContentEngine.out(0).to(this.GetAllSources.in(0));
        this.Get15Ideas.out(0).to(this.Merge3.in(1));
        this.MapToContentSourcing.out(0).to(this.CallContentSourcing.in(0));
        this.CallContentSourcing.out(0).to(this.NoOperationDoNothing1.in(0));
        this.CallContentSourcing.out(1).to(this.Error.in(0));
    }
}
