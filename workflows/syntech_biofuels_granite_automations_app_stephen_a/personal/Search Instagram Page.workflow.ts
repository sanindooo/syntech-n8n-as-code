import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : Search Instagram Page
// Nodes   : 29  |  Connections: 28
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// Start                              executeWorkflowTrigger
// InstagramProfileScraper            apify                      [onError→out(1)] [creds]
// AnalyzeAnImage                     googleGemini               [onError→out(1)] [creds]
// AnalyzeVideo                       googleGemini               [onError→out(1)] [creds]
// Switch_                            switch
// Merge2                             merge
// ImageField                         set
// VideoFields                        set
// AnalyzeAnImage1                    googleGemini               [onError→out(1)] [creds]
// SplitOut                           splitOut
// Limit6                             limit
// EitherUrlOrKeyword1                set
// LoopOverItems1                     splitInBatches
// FilterOutEmptyContent2             filter
// CreateSummaryAndTitle5             chainLlm                   [AI]
// StructuredOutputParser11           outputParserStructured     [ai_outputParser]
// SidecarFields                      set
// SidecarImages1                     set
// Summarize                          summarize
// StickyNote11                       stickyNote
// InstagramProfileScraperFields1     set
// Merge                              merge                      [alwaysOutput]
// If1                                if
// Deepseek3                          lmChatOpenRouter           [creds] [ai_languageModel]
// OpenaiChatModel1                   lmChatOpenAi               [creds]
// GetManyRowsSb                      supabase                   [creds] [executeOnce]
// CreateARowSb                       supabase                   [creds]
// GetManyRows                        dataTable                  [executeOnce]
// CreateARow                         dataTable
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// Start
//    → Limit6
//      → LoopOverItems1
//       .out(1) → EitherUrlOrKeyword1
//          → InstagramProfileScraper
//            → Merge
//              → If1
//                → Switch_
//                  → AnalyzeAnImage
//                    → ImageField
//                      → Merge2
//                        → FilterOutEmptyContent2
//                          → CreateSummaryAndTitle5
//                            → CreateARow
//                              → InstagramProfileScraperFields1
//                                → LoopOverItems1 (↩ loop)
//                 .out(1) → AnalyzeVideo
//                    → VideoFields
//                      → Merge2.in(2) (↩ loop)
//                 .out(2) → SplitOut
//                    → AnalyzeAnImage1
//                      → SidecarFields
//                        → Summarize
//                          → SidecarImages1
//                            → Merge2.in(1) (↩ loop)
//               .out(1) → LoopOverItems1 (↩ loop)
//           .out(1) → GetManyRows
//              → Merge.in(1) (↩ loop)
// GetManyRowsSb
//    → CreateARowSb
//
// AI CONNECTIONS
// CreateSummaryAndTitle5.uses({ ai_outputParser: StructuredOutputParser11, ai_languageModel: Deepseek3 })
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: '3TArIAzUNlMPDPqK',
    name: 'Search Instagram Page',
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
export class SearchInstagramPageWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: '2a01203d-8acb-4431-8e6c-acce15be7884',
        name: 'Start',
        type: 'n8n-nodes-base.executeWorkflowTrigger',
        version: 1.1,
        position: [-14160, -3456],
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
        id: 'b01036bb-6fc7-4383-a8eb-de1272026506',
        name: 'Instagram profile scraper',
        type: '@apify/n8n-nodes-apify.apify',
        version: 1,
        position: [-13264, -3840],
        credentials: { apifyApi: { id: 'JsuEKmvPtVt6JvXD', name: 'Syntech GM Apify account' } },
        onError: 'continueErrorOutput',
    })
    InstagramProfileScraper = {
        operation: 'Run actor and get dataset',
        actorSource: 'store',
        actorId: {
            __rl: true,
            value: 'nH2AHrwxeTRJoN5hX',
            mode: 'id',
        },
        customBody: `={
    "onlyPostsNewerThan": "1 month",
    "resultsLimit": 5,
    "skipPinnedPosts": false,
    "username": [
        "{{ $json.url_or_keyword }}"
    ]
}`,
    };

    @node({
        id: '7a814881-3903-443e-9257-94bc4ceb9c50',
        name: 'Analyze an image',
        type: '@n8n/n8n-nodes-langchain.googleGemini',
        version: 1,
        position: [-11472, -3984],
        credentials: { googlePalmApi: { id: 'bpjfJQDu5gNEKIgK', name: 'Syntech GM Google Gemini(PaLM) Api account' } },
        onError: 'continueErrorOutput',
    })
    AnalyzeAnImage = {
        resource: 'image',
        operation: 'analyze',
        modelId: {
            __rl: true,
            value: 'models/gemini-2.5-flash-lite',
            mode: 'list',
            cachedResultName: 'models/gemini-2.5-flash-lite',
        },
        text: `=<prompt>

    <introduction>
    You are a Visual Description Specialist. You excel at analyzing images and creating descriptions that are both factually accurate for accessibility (alt-text) and rich enough to convey the image's emotional tone.
    </introduction>

    <task>
    Analyze the provided image. Write a single, concise paragraph that functions as rich alt-text. Your description must identify the main people and objects, describe the setting, and capture the overall mood and atmosphere of the scene.
    </task>

    <output_rules>
    <rule_1> **Content Priority:** Start by describing the main subject (person or object). Then, describe the background and any significant secondary elements. </rule_1>
    <rule_2> **Capture the Mood:** Weave in adjectives that convey the feeling of the photo (e.g., "serene," "bustling," "joyful," "melancholy").</rule_2>
    <rule_3> **Format:** The entire output must be a single, descriptive paragraph, ideally 2-4 sentences long.</rule_3>
    </output_rules>

    <restrictions>
    <restriction_1> **Be Objective:** Describe only what is visually present. Do not invent names, backstories, or infer information not explicitly shown.</restriction_1>
    <restriction_2> **No Lists:** Do not use bullet points. The output must be a paragraph.</restriction_2>
    </restrictions>

    <examples>
    <example_1>
        **For an image of a person on a foggy London bridge:**
        **Your Correct Output:** "A person walks across a bridge in London, their silhouette partially obscured by thick morning fog. The iconic shape of a double-decker bus is faintly visible in the background, creating a moody and atmospheric urban scene."
    </example_1>
    <example_2>
        **For an image of a plate of food in a restaurant:**
        **Your Correct Output:** "A vibrant plate of fish and chips sits on a dark wooden table, illuminated by warm restaurant lighting. The fish has a golden, crispy batter, and a small dish of mushy peas adds a splash of color, making the meal look comforting and delicious."
    </example_2>
    </examples>

</prompt>`,
        imageUrls: "={{ $('Instagram profile scraper').item.json.displayUrl }}",
        options: {},
    };

    @node({
        id: '57d1c9a5-ef85-4278-b731-ed1828c8b4c0',
        name: 'Analyze video',
        type: '@n8n/n8n-nodes-langchain.googleGemini',
        version: 1,
        position: [-11472, -3600],
        credentials: { googlePalmApi: { id: 'bpjfJQDu5gNEKIgK', name: 'Syntech GM Google Gemini(PaLM) Api account' } },
        onError: 'continueErrorOutput',
    })
    AnalyzeVideo = {
        resource: 'video',
        operation: 'analyze',
        modelId: {
            __rl: true,
            value: 'models/gemini-2.5-flash-lite',
            mode: 'list',
            cachedResultName: 'models/gemini-2.5-flash-lite',
        },
        text: `<prompt>

    <introduction>
    You are a Video Analysis Specialist. You excel at watching video content and summarizing it effectively. Your skill is in creating descriptions that capture the sequence of events, key subjects, and the overall narrative or emotional tone of the video.
    </introduction>

    <task>
    Analyze the provided video. Write a single, concise paragraph that functions as a rich summary. Your description must identify the main people or subjects, describe the key sequence of actions from beginning to end, and capture the overall mood and atmosphere of the video.
    </task>

    <output_rules>
    <rule_1> **Narrative Flow:** Briefly describe the opening scene, the main action or development, and how the video concludes. </rule_1>
    <rule_2> **Capture the Mood:** Weave in adjectives that convey the feeling of the video, considering visuals, pacing, and any audible music or sounds.</rule_2>
    <rule_3> **Format:** The entire output must be a single, descriptive paragraph, ideally 2-4 sentences long.</rule_3>
    </output_rules>

    <restrictions>
    <restriction_1> **Summarize, Don't Detail:** Focus on the most important actions. Do not provide a shot-by-shot breakdown of the entire video.</restriction_1>
    <restriction_2> **Be Objective:** Describe only what happens in the video. Do not invent backstories or predict what might happen next.</restriction_2>
    <restriction_3> **No Lists:** Do not use bullet points. The output must be a paragraph.</restriction_3>
    </restrictions>

    <examples>
    <example_1>
        **For a video of someone unboxing a new phone:**
        **Your Correct Output:** "The video opens with a person placing a sleek, branded box on a clean white desk. They proceed to carefully unbox a new smartphone, removing the protective film and turning it on for the first time, ending with a shot of the bright, glowing home screen, creating a feeling of excitement and anticipation."
    </example_1>
    <example_2>
        **For a travel video of a market:**
        **Your Correct Output:** "This short, fast-paced video clip follows someone through a vibrant street market, capturing quick shots of colourful textiles and bustling crowds. Set to upbeat, energetic music, the video conveys a sense of adventure and cultural immersion in just a few seconds."
    </example_2>
    </examples>

</prompt>`,
        videoUrls: '={{ $json.videoUrl }}',
        options: {},
    };

    @node({
        id: 'c5339940-5f84-4d1e-bf23-17711ec1e666',
        name: 'Switch',
        type: 'n8n-nodes-base.switch',
        version: 3.3,
        position: [-12368, -3856],
    })
    Switch_ = {
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
                                leftValue: "={{ $('If1').item.json.type }}",
                                rightValue: 'Image',
                                operator: {
                                    type: 'string',
                                    operation: 'equals',
                                },
                                id: 'e106c5fe-6a60-42c8-b903-111972b85a3f',
                            },
                        ],
                        combinator: 'and',
                    },
                    renameOutput: true,
                    outputKey: 'Image',
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
                                id: '64f8adb7-a378-4031-9e83-1926292e4d6e',
                                leftValue: "={{ $('If1').item.json.type }}",
                                rightValue: 'Video',
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
                    outputKey: 'Video',
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
                                id: '15e45d2b-d3ca-457b-abcc-f6a6273e826d',
                                leftValue: "={{ $('If1').item.json.type }}",
                                rightValue: 'Sidecar',
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
                    outputKey: 'Sidecar',
                },
            ],
        },
        options: {},
    };

    @node({
        id: '6842a50d-7de8-473a-90aa-18cd777231dd',
        name: 'Merge2',
        type: 'n8n-nodes-base.merge',
        version: 3.2,
        position: [-11024, -3808],
    })
    Merge2 = {
        numberInputs: 3,
    };

    @node({
        id: '3d5fcfdf-ef4a-4477-81ae-6e63b73a352b',
        name: 'image field',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [-11248, -3984],
    })
    ImageField = {
        assignments: {
            assignments: [
                {
                    id: '2a08b0a3-caaf-40f7-86ad-3e1d8da5242f',
                    name: 'image',
                    value: '={{ $json.content.parts[0].text }}',
                    type: 'string',
                },
            ],
        },
        options: {},
    };

    @node({
        id: 'f79ec9bf-7c0a-4cd6-a0be-d7b49102853e',
        name: 'video fields',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [-11248, -3600],
    })
    VideoFields = {
        assignments: {
            assignments: [
                {
                    id: '6bec0252-74d5-443d-a8dd-62065d2a6975',
                    name: 'video',
                    value: '={{ $json.content.parts[0].text }}',
                    type: 'string',
                },
            ],
        },
        options: {},
    };

    @node({
        id: 'c9d8a2cf-bf16-433b-8b1f-4721a1f1aa40',
        name: 'Analyze an image1',
        type: '@n8n/n8n-nodes-langchain.googleGemini',
        version: 1,
        position: [-11920, -3792],
        credentials: { googlePalmApi: { id: 'bpjfJQDu5gNEKIgK', name: 'Syntech GM Google Gemini(PaLM) Api account' } },
        onError: 'continueErrorOutput',
    })
    AnalyzeAnImage1 = {
        resource: 'image',
        operation: 'analyze',
        modelId: {
            __rl: true,
            value: 'models/gemini-2.5-flash-lite',
            mode: 'list',
            cachedResultName: 'models/gemini-2.5-flash-lite',
        },
        text: `=<prompt>

    <introduction>
    You are a Visual Description Specialist. You excel at analyzing images and creating descriptions that are both factually accurate for accessibility (alt-text) and rich enough to convey the image's emotional tone.
    </introduction>

    <task>
    Analyze the provided image. Write a single, concise paragraph that functions as rich alt-text. Your description must identify the main people and objects, describe the setting, and capture the overall mood and atmosphere of the scene.
    </task>

    <output_rules>
    <rule_1> **Content Priority:** Start by describing the main subject (person or object). Then, describe the background and any significant secondary elements. </rule_1>
    <rule_2> **Capture the Mood:** Weave in adjectives that convey the feeling of the photo (e.g., "serene," "bustling," "joyful," "melancholy").</rule_2>
    <rule_3> **Format:** The entire output must be a single, descriptive paragraph, ideally 2-4 sentences long.</rule_3>
    </output_rules>

    <restrictions>
    <restriction_1> **Be Objective:** Describe only what is visually present. Do not invent names, backstories, or infer information not explicitly shown.</restriction_1>
    <restriction_2> **No Lists:** Do not use bullet points. The output must be a paragraph.</restriction_2>
    </restrictions>

    <examples>
    <example_1>
        **For an image of a person on a foggy London bridge:**
        **Your Correct Output:** "A person walks across a bridge in London, their silhouette partially obscured by thick morning fog. The iconic shape of a double-decker bus is faintly visible in the background, creating a moody and atmospheric urban scene."
    </example_1>
    <example_2>
        **For an image of a plate of food in a restaurant:**
        **Your Correct Output:** "A vibrant plate of fish and chips sits on a dark wooden table, illuminated by warm restaurant lighting. The fish has a golden, crispy batter, and a small dish of mushy peas adds a splash of color, making the meal look comforting and delicious."
    </example_2>
    </examples>

</prompt>`,
        imageUrls: '={{ $json.images }}',
        options: {},
    };

    @node({
        id: 'dc8d5f35-6423-4a6d-abb1-e56e81c44d34',
        name: 'Split Out',
        type: 'n8n-nodes-base.splitOut',
        version: 1,
        position: [-12144, -3792],
    })
    SplitOut = {
        fieldToSplitOut: 'images',
        options: {},
    };

    @node({
        id: 'de2180a9-e73b-4f9f-b89d-fc73efb1bbca',
        name: 'Limit6',
        type: 'n8n-nodes-base.limit',
        version: 1,
        position: [-13936, -3456],
    })
    Limit6 = {
        maxItems: 100,
    };

    @node({
        id: 'ad1ae1e3-91b9-4f42-ad08-4335f6b05457',
        name: 'Either Url or Keyword1',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [-13488, -3840],
    })
    EitherUrlOrKeyword1 = {
        assignments: {
            assignments: [
                {
                    id: '8efead37-57d8-4101-9010-c855f2525db6',
                    name: 'url_or_keyword',
                    value: '={{ $json.property_url || $json.url_or_keyword }}',
                    type: 'string',
                },
                {
                    id: '761f96da-4b01-4ac7-8a07-03e42c93bdd8',
                    name: 'prompt',
                    value: '={{ $json.prompt }}',
                    type: 'string',
                },
                {
                    id: '7af35df9-e2ce-4e76-b8d8-115ef1099d7b',
                    name: 'additional_formats',
                    value: '={{ $json.additional_formats }}',
                    type: 'string',
                },
            ],
        },
        options: {},
    };

    @node({
        id: '69bbc0ab-7f65-426c-974b-751c7629d77c',
        name: 'Loop Over Items1',
        type: 'n8n-nodes-base.splitInBatches',
        version: 3,
        position: [-13712, -3456],
    })
    LoopOverItems1 = {
        options: {},
    };

    @node({
        id: '5830ad9a-43f6-4e09-b585-e007f90897bd',
        name: 'Filter out empty content2',
        type: 'n8n-nodes-base.filter',
        version: 2.2,
        position: [-10800, -3792],
    })
    FilterOutEmptyContent2 = {
        conditions: {
            options: {
                caseSensitive: true,
                leftValue: '',
                typeValidation: 'strict',
                version: 2,
            },
            conditions: [
                {
                    id: '66ef2c27-8157-47fc-a348-9b34481bd702',
                    leftValue: "={{ $('Merge').item.json.caption }}",
                    rightValue: '',
                    operator: {
                        type: 'string',
                        operation: 'notEmpty',
                        singleValue: true,
                    },
                },
                {
                    id: 'f8550bb0-e3bd-482d-9810-e57fc6060e52',
                    leftValue: "={{ $('Merge').item.json.ownerUsername }}",
                    rightValue: 'syntechbiofuel',
                    operator: {
                        type: 'string',
                        operation: 'notContains',
                    },
                },
                {
                    id: 'b5271347-4a6a-4350-9344-e6bcebd5a3a5',
                    leftValue: "={{ $('Merge').item.json.caption }}",
                    rightValue: 'https://',
                    operator: {
                        type: 'string',
                        operation: 'notStartsWith',
                    },
                },
            ],
            combinator: 'and',
        },
        options: {},
    };

    @node({
        id: '0e398697-2809-4af9-815d-045780db6b49',
        name: 'Create summary and title5',
        type: '@n8n/n8n-nodes-langchain.chainLlm',
        version: 1.7,
        position: [-10576, -3792],
    })
    CreateSummaryAndTitle5 = {
        promptType: 'define',
        text: `=<content>
{{ $('Merge').item.json.caption }}
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
        id: '0af476a1-5832-4246-93ad-6f76b61daca5',
        name: 'Structured Output Parser11',
        type: '@n8n/n8n-nodes-langchain.outputParserStructured',
        version: 1.3,
        position: [-10448, -3568],
    })
    StructuredOutputParser11 = {
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
        id: 'bb59ea06-820a-4c9b-bb48-8392950d0c27',
        name: 'sidecar fields',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [-11696, -3792],
    })
    SidecarFields = {
        assignments: {
            assignments: [
                {
                    id: '8043336f-37b2-450d-9cee-0a9304f87969',
                    name: 'sidecar',
                    value: '={{ $json.content.parts[0].text }}',
                    type: 'string',
                },
                {
                    id: 'f2dad15b-20aa-4c6a-9653-b38d64b56cac',
                    name: 'shortCode',
                    value: "={{ $('Switch').item.json.shortCode }}",
                    type: 'string',
                },
                {
                    id: 'c39b39a4-c952-4193-8bb0-e03be3654a22',
                    name: 'caption',
                    value: "={{ $('Merge').item.json.caption }}",
                    type: 'string',
                },
            ],
        },
        options: {},
    };

    @node({
        id: '2bdfd5b5-ba92-4823-8e67-186b6a25c14c',
        name: 'sidecar images1',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [-11248, -3792],
    })
    SidecarImages1 = {
        assignments: {
            assignments: [
                {
                    id: '437df34e-c8a0-4e54-9b86-f332e3390dd3',
                    name: 'sidecar_images',
                    value: '={{ $json.appended_sidecar }}',
                    type: 'string',
                },
            ],
        },
        options: {},
    };

    @node({
        id: '40fa62c9-76c0-45de-823c-d1615840fadf',
        name: 'Summarize',
        type: 'n8n-nodes-base.summarize',
        version: 1.1,
        position: [-11472, -3792],
    })
    Summarize = {
        fieldsToSummarize: {
            values: [
                {
                    aggregation: 'append',
                    field: 'sidecar',
                },
            ],
        },
        fieldsToSplitBy: 'shortCode',
        options: {},
    };

    @node({
        id: 'd1b74960-c938-4bbd-a386-72d0bdd75463',
        name: 'Sticky Note11',
        type: 'n8n-nodes-base.stickyNote',
        version: 1,
        position: [-14240, -4464],
    })
    StickyNote11 = {
        content: `## Instagram posts (images/videos) into text summaries for business use
## Fetches the  posts from specific Instagram profiles.
## Images: Describes the scene, mood, and objects. Videos: Summarizes the action and narrative. Carousels: Analyzes every slide and combines them.
## Reads the Caption + AI Visual Description. Generates a Catchy Title and a 50-word Business Summary.
## OUTPUT: A clean list containing the AI-written Title, Summary, and original Link.`,
        height: 1168,
        width: 4400,
        color: 3,
    };

    @node({
        id: '9323ecba-3611-49cf-ad0d-a491833edf57',
        name: 'Instagram profile scraper fields1',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [-10000, -3616],
    })
    InstagramProfileScraperFields1 = {
        assignments: {
            assignments: [
                {
                    id: 'a4834c8f-ac22-4c1c-a063-cb013a7551e1',
                    name: 'title',
                    value: "={{ $('Create summary and title5').item.json.output.title }}",
                    type: 'string',
                },
                {
                    id: '32dabcd5-3ab3-4db6-aa40-4b95ac34bc83',
                    name: 'content',
                    value: `=Content:
{{ $('Merge').item.json.caption }}

Single image Description:
{{ $('Merge2').item.json.image }}

Video Analysis:
{{ $('Merge2').item.json.video }}

Multiple image Description:
{{ $('Merge2').item.json.sidecar_images }}`,
                    type: 'string',
                },
                {
                    id: '534a78cb-d400-4d1d-8a6b-183e66484257',
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
                    id: 'd508784a-e41d-4ea9-8871-c8759b9bef5a',
                    name: 'summary',
                    value: "={{ $('Create summary and title5').item.json.output.summary }}",
                    type: 'string',
                },
                {
                    id: '5d3ea0be-c893-4a29-a9b4-4b5fe7b2bde0',
                    name: 'search_query',
                    value: "={{ $('Either Url or Keyword1').first().json.url_or_keyword }}",
                    type: 'string',
                },
                {
                    id: '5a9c9207-b078-4fbc-88d9-c2e8fa2a2fed',
                    name: 'publication_date',
                    value: "={{ $('Merge').item.json.timestamp }}",
                    type: 'string',
                },
                {
                    id: 'c1a6a0ce-b44f-4ef6-9742-fc87d628f391',
                    name: 'source',
                    value: 'Instagram',
                    type: 'string',
                },
                {
                    id: '1e2ead8a-561a-4693-997c-7b6d8c169eeb',
                    name: 'source_name',
                    value: "={{ $('Start').item.json.property_name }}",
                    type: 'string',
                },
                {
                    id: 'f53a4876-9a86-4ed3-bc5a-e1bde726dbb5',
                    name: 'source_category',
                    value: "={{ $('Start').item.json.property_category }}",
                    type: 'string',
                },
                {
                    id: '5df51f8f-9a46-457d-b8b8-15ea63b70751',
                    name: 'prompt',
                    value: "={{ $('Start').first().json.prompt }}",
                    type: 'string',
                },
                {
                    id: '9eae9c3d-3384-4e34-a482-2e1336b828e2',
                    name: 'additional_formats',
                    value: "={{ $('Start').first().json.additional_formats }}",
                    type: 'string',
                },
                {
                    id: '72a938f3-ef21-454f-ac18-a37eaa24f8a5',
                    name: 'mode',
                    value: "={{ $('Start').first().json.process_mode }}",
                    type: 'string',
                },
            ],
        },
        options: {},
    };

    @node({
        id: 'c4f05ea5-4e7d-4206-a92b-5235ac2a5cb7',
        name: 'Merge',
        type: 'n8n-nodes-base.merge',
        version: 3.2,
        position: [-12816, -3840],
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
        id: 'fb309486-125e-4dd3-abff-fedf58539271',
        name: 'If1',
        type: 'n8n-nodes-base.if',
        version: 2.3,
        position: [-12592, -3840],
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
        id: 'b2de6273-83bb-4e99-a3f9-e0eea3f36ce2',
        name: 'DeepSeek 3.',
        type: '@n8n/n8n-nodes-langchain.lmChatOpenRouter',
        version: 1,
        position: [-10576, -3568],
        credentials: { openRouterApi: { id: 'kUkOiAL6PjmdfexG', name: 'Syntech GM OpenRouter account' } },
    })
    Deepseek3 = {
        model: 'deepseek/deepseek-v3.2',
        options: {},
    };

    @node({
        id: '73c38847-4d67-4e29-95cb-c7d8755ae18e',
        name: 'OpenAI Chat Model1',
        type: '@n8n/n8n-nodes-langchain.lmChatOpenAi',
        version: 1.2,
        position: [-14160, -4192],
        credentials: { openAiApi: { id: 'NoEKitspBJb0zQrp', name: 'Syntech GM OpenAi account' } },
    })
    OpenaiChatModel1 = {
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
        id: '364c4300-212a-4fa8-a8f0-1e772e60e391',
        name: 'Get many rows sb',
        type: 'n8n-nodes-base.supabase',
        version: 1,
        position: [-14160, -3232],
        credentials: { supabaseApi: { id: 'IT46INDKsZaZyCZQ', name: 'Stephen Supabase account' } },
        alwaysOutputData: false,
        executeOnce: true,
    })
    GetManyRowsSb = {
        operation: 'getAll',
        tableId: 'Syntech Instagram url',
        returnAll: true,
        filterType: 'none',
    };

    @node({
        id: 'f288c886-e064-4e8d-bfc2-149d8882046d',
        name: 'Create a row sb',
        type: 'n8n-nodes-base.supabase',
        version: 1,
        position: [-13936, -3232],
        credentials: { supabaseApi: { id: 'IT46INDKsZaZyCZQ', name: 'Stephen Supabase account' } },
    })
    CreateARowSb = {
        tableId: 'Syntech Instagram url',
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
        id: '3d43ce43-8045-44a2-81bf-964a1b558ec6',
        name: 'Get many rows',
        type: 'n8n-nodes-base.dataTable',
        version: 1.1,
        position: [-13040, -3600],
        executeOnce: true,
    })
    GetManyRows = {
        operation: 'get',
        dataTableId: {
            __rl: true,
            value: 'if87jM2WxDxgaSVd',
            mode: 'list',
            cachedResultName: 'NEWS+ Instagram',
            cachedResultUrl: '/projects/U9sMeJya1DaokkjK/datatables/if87jM2WxDxgaSVd',
        },
        returnAll: true,
    };

    @node({
        id: '7005f92b-077c-4ac5-87b1-0dbd2c6fee6e',
        name: 'Create a row',
        type: 'n8n-nodes-base.dataTable',
        version: 1.1,
        position: [-10224, -3792],
        executeOnce: false,
    })
    CreateARow = {
        operation: 'upsert',
        dataTableId: {
            __rl: true,
            value: 'if87jM2WxDxgaSVd',
            mode: 'list',
            cachedResultName: 'NEWS+ Instagram',
            cachedResultUrl: '/projects/U9sMeJya1DaokkjK/datatables/if87jM2WxDxgaSVd',
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
        this.Start.out(0).to(this.Limit6.in(0));
        this.InstagramProfileScraper.out(0).to(this.Merge.in(0));
        this.InstagramProfileScraper.out(1).to(this.GetManyRows.in(0));
        this.AnalyzeAnImage.out(0).to(this.ImageField.in(0));
        this.AnalyzeVideo.out(0).to(this.VideoFields.in(0));
        this.Switch_.out(0).to(this.AnalyzeAnImage.in(0));
        this.Switch_.out(1).to(this.AnalyzeVideo.in(0));
        this.Switch_.out(2).to(this.SplitOut.in(0));
        this.Merge2.out(0).to(this.FilterOutEmptyContent2.in(0));
        this.ImageField.out(0).to(this.Merge2.in(0));
        this.VideoFields.out(0).to(this.Merge2.in(2));
        this.AnalyzeAnImage1.out(0).to(this.SidecarFields.in(0));
        this.SplitOut.out(0).to(this.AnalyzeAnImage1.in(0));
        this.Limit6.out(0).to(this.LoopOverItems1.in(0));
        this.EitherUrlOrKeyword1.out(0).to(this.InstagramProfileScraper.in(0));
        this.LoopOverItems1.out(1).to(this.EitherUrlOrKeyword1.in(0));
        this.FilterOutEmptyContent2.out(0).to(this.CreateSummaryAndTitle5.in(0));
        this.CreateSummaryAndTitle5.out(0).to(this.CreateARow.in(0));
        this.SidecarFields.out(0).to(this.Summarize.in(0));
        this.SidecarImages1.out(0).to(this.Merge2.in(1));
        this.Summarize.out(0).to(this.SidecarImages1.in(0));
        this.InstagramProfileScraperFields1.out(0).to(this.LoopOverItems1.in(0));
        this.Merge.out(0).to(this.If1.in(0));
        this.If1.out(0).to(this.Switch_.in(0));
        this.If1.out(1).to(this.LoopOverItems1.in(0));
        this.GetManyRowsSb.out(0).to(this.CreateARowSb.in(0));
        this.GetManyRows.out(0).to(this.Merge.in(1));
        this.CreateARow.out(0).to(this.InstagramProfileScraperFields1.in(0));

        this.CreateSummaryAndTitle5.uses({
            ai_languageModel: this.Deepseek3.output,
            ai_outputParser: this.StructuredOutputParser11.output,
        });
    }
}
