import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : Syntech Mention Monitor
// Nodes   : 8  |  Connections: 7
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// ScheduleTrigger                    scheduleTrigger
// GetAllSources                      notion                     [creds]
// GetActiveSources                   filter
// Limit1                             limit
// MapToContentSourcing               set
// CallContentSourcing                httpRequest                [onError→out(1)] [creds] [retry]
// SourcingComplete                   noOp
// Error                              set
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// ScheduleTrigger
//    → GetAllSources
//      → GetActiveSources
//        → Limit1
//          → MapToContentSourcing
//            → CallContentSourcing
//              → SourcingComplete
//             .out(1) → Error
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
        position: [-528, 3776],
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
        position: [-304, 3776],
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
        position: [-80, 3776],
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
        position: [144, 3776],
    })
    Limit1 = {
        maxItems: 1000,
    };

    @node({
        id: 'a1b2c3d4-map-to-content-sourcing',
        name: 'Map To Content Sourcing',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [368, 3776],
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
                    value: '={{ $json.property_category || $json.property_keyword_category || "Mention" }}',
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
        id: '69994eba-4330-4907-a4bd-fbed6d69adec',
        name: 'Call Content Sourcing',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.4,
        position: [592, 3776],
        credentials: { httpBearerAuth: { id: 'e0bBYiHsQNeVlYmn', name: 'Syntech Content Sourcing Bearer' } },
        onError: 'continueErrorOutput',
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
        id: 'd4e5f6a7-sourcing-complete',
        name: 'Sourcing Complete',
        type: 'n8n-nodes-base.noOp',
        version: 1,
        position: [816, 3680],
    })
    SourcingComplete = {};

    @node({
        id: '2af34975-d660-48f1-92e2-ce3ff69ea653',
        name: 'Error',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [816, 3872],
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
        this.GetAllSources.out(0).to(this.GetActiveSources.in(0));
        this.GetActiveSources.out(0).to(this.Limit1.in(0));
        this.Limit1.out(0).to(this.MapToContentSourcing.in(0));
        this.MapToContentSourcing.out(0).to(this.CallContentSourcing.in(0));
        this.CallContentSourcing.out(0).to(this.SourcingComplete.in(0));
        this.CallContentSourcing.out(1).to(this.Error.in(0));
    }
}
