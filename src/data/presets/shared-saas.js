// Shared SaaS deployment preset - Multi-tenant shared infrastructure

export const sharedSaas = {
  name: 'Shared SaaS',
  description: 'Multi-tenant shared infrastructure - Cost-optimized for multiple customers',
  zoneDefinitions: {
    public: {
      x: -5000,
      y: -5000,
      width: 5550, // Up to zone boundary at x: 550
      height: 10000,
      backgroundColor: '#dbeafe',
      opacity: 0.3,
      regions: {
        customers: { x: -50, y: 50, width: 100 }, // Far left for customer nodes
        managed: { x: 170, y: 80, width: 360, height: 360 }, // Airia Managed boundary (stays within public zone: 170+360=530 < 550)
        external: { x: 30, y: 450, width: 500 } // Below managed for external services
      }
    },
    private: {
      x: 550,
      y: -5000,
      width: 5000,
      height: 10000,
      backgroundColor: '#f3f4f6',
      opacity: 0.3,
      showBorder: true,
      borderColor: '#9ca3af',
      regions: {
        connector: { x: 600, y: 200, width: 150 },
        services: { x: 750, y: 100, width: 200 }
      }
    }
  },
  zones: {
    public: {
      xRange: [0, 525],
      components: [
        // PUBLIC ZONE - External Components (no parentBoundary)
        // Column 1: Customers at x=20
        {
          id: 'customer-1',
          type: 'component',
          label: 'Customer A',
          description: 'Customer A end users',
          position: { x: 20, y: 40 },
          visible: true,
          icon: 'users',
          zone: 'public'
        },
        {
          id: 'customer-2',
          type: 'component',
          label: 'Customer B',
          description: 'Customer B end users',
          position: { x: 20, y: 190 },
          visible: false,
          icon: 'users',
          zone: 'public'
        },
        {
          id: 'customer-3',
          type: 'component',
          label: 'Customer C',
          description: 'Customer C end users',
          position: { x: 20, y: 340 },
          visible: false,
          icon: 'users',
          zone: 'public'
        },

        // Airia Managed Components (parentBoundary='airia-managed')
        // Positions RELATIVE to boundary at (260, 20)
        // Boundary has 30px padding, so components start at relative (30, 30)
        {
          id: 'cdn',
          type: 'component',
          label: 'WAF and CDN',
          description: 'Shared WAF and CDN - CloudFlare for all tenants',
          position: { x: 30, y: 30 },  // Relative to boundary (260, 20), absolute: (290, 50)
          visible: true,
          icon: 'globe',
          zone: 'public',
          parentBoundary: 'airia-managed'
        },
        {
          id: 'airia-platform-na',
          type: 'component',
          label: 'Airia Platform (NA)',
          description: 'North America region - Airia AI platform orchestration layer',
          position: { x: 30, y: 180 },  // Relative to boundary, absolute: (290, 200)
          visible: true,
          icon: 'layers',
          zone: 'public',
          parentBoundary: 'airia-managed'
        },
        {
          id: 'airia-key-llm',
          type: 'component',
          label: 'Airia Key LLM',
          description: 'Airia-managed LLM service - Optimized models for key extraction',
          position: { x: 30, y: 330 },  // Relative to boundary, absolute: (290, 350)
          visible: true,
          icon: 'key',
          zone: 'public',
          parentBoundary: 'airia-managed'
        },
        {
          id: 'airia-platform-eu',
          type: 'component',
          label: 'Airia Platform (EU)',
          description: 'Europe region - Airia AI platform orchestration layer',
          position: { x: 30, y: 480 },  // Relative to boundary, absolute: (290, 500)
          visible: false,
          icon: 'layers',
          zone: 'public',
          parentBoundary: 'airia-managed'
        },
        {
          id: 'airia-platform-apac',
          type: 'component',
          label: 'Airia Platform (APAC)',
          description: 'Asia-Pacific region (Singapore, Australia) - Airia AI platform orchestration layer',
          position: { x: 30, y: 630 },  // Relative to boundary, absolute: (290, 650)
          visible: false,
          icon: 'layers',
          zone: 'public',
          parentBoundary: 'airia-managed'
        },
        {
          id: 'airia-platform-mena',
          type: 'component',
          label: 'Airia Platform (MENA)',
          description: 'Middle East & North Africa region - Airia AI platform orchestration layer',
          position: { x: 30, y: 780 },  // Relative to boundary, absolute: (290, 800)
          visible: false,
          icon: 'layers',
          zone: 'public',
          parentBoundary: 'airia-managed'
        },
        // External Services (below Airia Managed box)
        // Row 1 (y=700): External LLM, Public App Integrations
        // Row 2 (y=850): SIEM, Weaviate
        // Row 3 (y=1000): Pinecone
        {
          id: 'llm-openai',
          type: 'component',
          label: 'OpenAI',
          description: 'OpenAI API - GPT-4, GPT-4o, embeddings',
          position: { x: 20, y: 700 },
          visible: true,
          icon: 'cpu',
          zone: 'public'
        },
        {
          id: 'llm-anthropic',
          type: 'component',
          label: 'Anthropic',
          description: 'Anthropic API - Claude models',
          position: { x: 20, y: 850 },
          visible: true,
          icon: 'cpu',
          zone: 'public'
        },
        {
          id: 'llm-google',
          type: 'component',
          label: 'Google AI',
          description: 'Google AI - Gemini models',
          position: { x: 20, y: 1000 },
          visible: true,
          icon: 'cpu',
          zone: 'public'
        },
        {
          id: 'public-app-integrations',
          type: 'component',
          label: 'Public Application Integrations',
          description: 'Third-party SaaS integrations - Salesforce, Slack, etc.',
          position: { x: 240, y: 700 }, // 40px spacing from External LLM: 20+180+40=240 (240+180=420 < 550)
          visible: false,
          icon: 'link',
          zone: 'public'
        },
        {
          id: 'office365',
          type: 'component',
          label: 'Office 365',
          description: 'Microsoft Office 365 - Email, SharePoint, Teams integration',
          position: { x: 240, y: 700 },
          visible: false,
          icon: 'monitor',
          zone: 'public'
        },
        {
          id: 'siem-public',
          type: 'component',
          label: 'SIEM (Public)',
          description: 'Cloud SIEM - Splunk Cloud, Datadog Security, etc.',
          position: { x: 240, y: 850 },
          visible: false,
          icon: 'shield',
          zone: 'public'
        },
        {
          id: 'weaviate-public',
          type: 'component',
          label: 'Weaviate',
          description: 'Cloud-hosted vector database for AI-native applications',
          position: { x: 240, y: 1000 },
          visible: false,
          icon: 'database',
          zone: 'public'
        },
        {
          id: 'pinecone',
          type: 'component',
          label: 'Pinecone',
          description: 'Vector database for AI embeddings and semantic search',
          position: { x: 20, y: 1150 },
          visible: false,
          icon: 'database',
          zone: 'public'
        }
      ]
    },
    private: {
      xRange: [575, 900],
      components: [
        // Private zone components - Grid: 2 columns, 150px vertical, 200px horizontal spacing
        {
          id: 'user-private',
          type: 'component',
          label: 'Internal Users',
          description: 'Internal admins and support staff',
          position: { x: 600, y: 40 },  // Row 1, Col 1 - Changed from y: 500
          visible: false,
          icon: 'users',
          zone: 'private'
        },
        {
          id: 'airia-cloud-connector',
          type: 'component',
          label: 'Airia Cloud Connector',
          description: 'Connector for customer on-premises systems to Airia Cloud',
          position: { x: 820, y: 40 },  // Row 1, Col 2 (820px ensures 40px spacing: 600+180+40=820)
          visible: false,
          icon: 'link',
          zone: 'private'
        },
        {
          id: 'weaviate-private',
          type: 'component',
          label: 'Weaviate (Private)',
          description: 'Self-hosted vector database for on-premises AI applications',
          position: { x: 600, y: 190 },  // Row 2, Col 1 - Changed from y: 100
          visible: false,
          icon: 'database',
          zone: 'private'
        },
        {
          id: 'llm-private',
          type: 'component',
          label: 'Private LLM',
          description: 'Self-hosted LLM service for sensitive data',
          position: { x: 820, y: 190 },  // Row 2, Col 2 (aligned with Cloud Connector)
          visible: false,
          icon: 'cpu',
          zone: 'private'
        },
        {
          id: 'customer-database',
          type: 'component',
          label: 'Database',
          description: 'Customer on-premises database',
          position: { x: 600, y: 340 },  // Row 3, Col 1 - Changed from y: 360
          visible: false,
          icon: 'database',
          zone: 'private'
        },
        {
          id: 'private-api',
          type: 'component',
          label: 'Private API',
          description: 'Customer private API endpoints',
          position: { x: 820, y: 340 },  // Row 3, Col 2 (aligned with Cloud Connector)
          visible: false,
          icon: 'key',
          zone: 'private'
        },
        {
          id: 'siem-private',
          type: 'component',
          label: 'SIEM (Private)',
          description: 'On-premises SIEM - Splunk Enterprise, QRadar, etc.',
          position: { x: 600, y: 490 },  // Row 4, Col 1 - Changed from y: 600
          visible: false,
          icon: 'shield',
          zone: 'private'
        }
      ]
    }
  },
  connections: [
    // Multiple customers to CDN (multi-tenant)
    { id: 'e0-customer1', source: 'customer-1', target: 'cdn', animated: false },
    { id: 'e0-customer2', source: 'customer-2', target: 'cdn', animated: false },
    { id: 'e0-customer3', source: 'customer-3', target: 'cdn', animated: false },
    { id: 'e0c', source: 'user-private', target: 'cdn', animated: false },
    { id: 'e0e', source: 'airia-cloud-connector', target: 'llm-private', animated: false },
    { id: 'e0f', source: 'airia-cloud-connector', target: 'customer-database', animated: false },
    { id: 'e0g', source: 'airia-cloud-connector', target: 'private-api', animated: false },

    // CDN to regional platforms
    { id: 'e1-na', source: 'cdn', target: 'airia-platform-na', animated: false },
    { id: 'e1-eu', source: 'cdn', target: 'airia-platform-eu', animated: false },
    { id: 'e1-apac', source: 'cdn', target: 'airia-platform-apac', animated: false },
    { id: 'e1-mena', source: 'cdn', target: 'airia-platform-mena', animated: false },

    // Regional platforms to Cloud Connector (connects to left handle)
    { id: 'e1a-na', source: 'airia-platform-na', target: 'airia-cloud-connector', animated: false },
    { id: 'e1a-eu', source: 'airia-platform-eu', target: 'airia-cloud-connector', animated: false },
    { id: 'e1a-apac', source: 'airia-platform-apac', target: 'airia-cloud-connector', animated: false },
    { id: 'e1a-mena', source: 'airia-platform-mena', target: 'airia-cloud-connector', animated: false },

    // Airia Key LLM to LLM providers
    { id: 'e-llm-openai', source: 'airia-key-llm', target: 'llm-openai', animated: false },
    { id: 'e-llm-anthropic', source: 'airia-key-llm', target: 'llm-anthropic', animated: false },
    { id: 'e-llm-google', source: 'airia-key-llm', target: 'llm-google', animated: false },

    // Regional platforms to Airia Key LLM (managed)
    { id: 'e2a-na', source: 'airia-platform-na', target: 'airia-key-llm', animated: false },
    { id: 'e2a-eu', source: 'airia-platform-eu', target: 'airia-key-llm', animated: false },
    { id: 'e2a-apac', source: 'airia-platform-apac', target: 'airia-key-llm', animated: false },
    { id: 'e2a-mena', source: 'airia-platform-mena', target: 'airia-key-llm', animated: false },

    // Regional platforms to LLM providers (bring your own API key)
    { id: 'e-byok-openai-na', source: 'airia-platform-na', target: 'llm-openai', animated: false },
    { id: 'e-byok-anthropic-na', source: 'airia-platform-na', target: 'llm-anthropic', animated: false },
    { id: 'e-byok-google-na', source: 'airia-platform-na', target: 'llm-google', animated: false },
    { id: 'e-byok-openai-eu', source: 'airia-platform-eu', target: 'llm-openai', animated: false },
    { id: 'e-byok-anthropic-eu', source: 'airia-platform-eu', target: 'llm-anthropic', animated: false },
    { id: 'e-byok-google-eu', source: 'airia-platform-eu', target: 'llm-google', animated: false },
    { id: 'e-byok-openai-apac', source: 'airia-platform-apac', target: 'llm-openai', animated: false },
    { id: 'e-byok-anthropic-apac', source: 'airia-platform-apac', target: 'llm-anthropic', animated: false },
    { id: 'e-byok-google-apac', source: 'airia-platform-apac', target: 'llm-google', animated: false },
    { id: 'e-byok-openai-mena', source: 'airia-platform-mena', target: 'llm-openai', animated: false },
    { id: 'e-byok-anthropic-mena', source: 'airia-platform-mena', target: 'llm-anthropic', animated: false },
    { id: 'e-byok-google-mena', source: 'airia-platform-mena', target: 'llm-google', animated: false },

    // Regional platforms to public integrations
    { id: 'e3-na', source: 'airia-platform-na', target: 'public-app-integrations', animated: false },
    { id: 'e3-eu', source: 'airia-platform-eu', target: 'public-app-integrations', animated: false },
    { id: 'e3-apac', source: 'airia-platform-apac', target: 'public-app-integrations', animated: false },
    { id: 'e3-mena', source: 'airia-platform-mena', target: 'public-app-integrations', animated: false },

    // Regional platforms to Office 365
    { id: 'e-o365-na', source: 'airia-platform-na', target: 'office365', animated: false },
    { id: 'e-o365-eu', source: 'airia-platform-eu', target: 'office365', animated: false },
    { id: 'e-o365-apac', source: 'airia-platform-apac', target: 'office365', animated: false },
    { id: 'e-o365-mena', source: 'airia-platform-mena', target: 'office365', animated: false },

    // Regional platforms to Pinecone
    { id: 'e4-na', source: 'airia-platform-na', target: 'pinecone', animated: false },
    { id: 'e4-eu', source: 'airia-platform-eu', target: 'pinecone', animated: false },
    { id: 'e4-apac', source: 'airia-platform-apac', target: 'pinecone', animated: false },
    { id: 'e4-mena', source: 'airia-platform-mena', target: 'pinecone', animated: false },

    // Regional platforms to Weaviate (Public)
    { id: 'e5-na', source: 'airia-platform-na', target: 'weaviate-public', animated: false },
    { id: 'e5-eu', source: 'airia-platform-eu', target: 'weaviate-public', animated: false },
    { id: 'e5-apac', source: 'airia-platform-apac', target: 'weaviate-public', animated: false },
    { id: 'e5-mena', source: 'airia-platform-mena', target: 'weaviate-public', animated: false },

    // Regional platforms to Weaviate (Private)
    { id: 'e6-na', source: 'airia-platform-na', target: 'weaviate-private', animated: false },
    { id: 'e6-eu', source: 'airia-platform-eu', target: 'weaviate-private', animated: false },
    { id: 'e6-apac', source: 'airia-platform-apac', target: 'weaviate-private', animated: false },
    { id: 'e6-mena', source: 'airia-platform-mena', target: 'weaviate-private', animated: false },

    // Regional platforms to SIEM (Public)
    { id: 'e7-na', source: 'airia-platform-na', target: 'siem-public', animated: false },
    { id: 'e7-eu', source: 'airia-platform-eu', target: 'siem-public', animated: false },
    { id: 'e7-apac', source: 'airia-platform-apac', target: 'siem-public', animated: false },
    { id: 'e7-mena', source: 'airia-platform-mena', target: 'siem-public', animated: false },

    // Regional platforms to SIEM (Private) via Cloud Connector
    { id: 'e8-siem', source: 'airia-cloud-connector', target: 'siem-private', animated: false },
  ],
  boundaryBoxes: [
    {
      id: 'airia-managed',
      label: 'Airia Managed',
      x: 260,  // Start after customers (x: 20 + 180 card width + 60 gap)
      y: 20,   // Small margin from top
      width: 270, // Minimum width for single column + padding - stays within zone: 260 + 270 = 530 < 550 ✅
      height: 470, // Minimum height - will grow dynamically based on visible children
      padding: 30, // Padding around boundary content for dynamic sizing
      color: '#3b82f6',
      badgeLabel: 'Airia Managed',
      badgeColor: 'indigo',
      zone: 'public',
      // Explicit containment rules for this boundary
      containmentRules: {
        description: 'Airia-managed infrastructure components in the public cloud',
        mustContain: [
          'cdn',                    // Shared CDN (CloudFlare)
          'airia-platform-na',      // North America platform instance
          'airia-platform-eu',      // Europe platform instance
          'airia-platform-apac',    // Asia-Pacific platform instance
          'airia-platform-mena',    // Middle East & North Africa platform instance
          'airia-key-llm'           // Airia-managed LLM service
        ],
        mustExclude: [
          'customer-1',             // Customer A users (external)
          'customer-2',             // Customer B users (external)
          'customer-3',             // Customer C users (external)
          'llm-openai',             // OpenAI
          'llm-anthropic',          // Anthropic
          'llm-google',             // Google AI
          'pinecone',               // External vector DB
          'weaviate-public',        // External vector DB
          'public-app-integrations',// External SaaS integrations
          'siem-public'             // External SIEM services
        ],
        rule: 'Components with parentBoundary="airia-managed" must be Airia-owned infrastructure. Customer-facing and external services stay outside.'
      }
    }
  ],
  columnHeaders: []
};

