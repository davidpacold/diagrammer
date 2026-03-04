// Dedicated SaaS deployment preset - Single-tenant isolated infrastructure

export const dedicatedSaas = {
  name: 'Dedicated SaaS',
  description: 'Single-tenant dedicated infrastructure - Isolated resources per customer',
  zoneDefinitions: {
    public: {
      x: -5000,
      y: -5000,
      width: 5550, // Up to zone boundary at x: 550
      height: 10000,
      backgroundColor: '#dbeafe',
      opacity: 0.3,
      regions: {
        companies: { x: -50, y: 40, width: 100 }, // Far left for company users
        managed: { x: 120, y: 0, width: 410, height: 650 }, // Airia Managed boundary (120+410=530 < 550)
        external: { x: 30, y: 670, width: 500 } // Below managed for external services
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
        // Column 1: Different Companies (far left)
        {
          id: 'company-a-users',
          type: 'component',
          label: 'Company A Users',
          description: 'Company A end users',
          position: { x: -250, y: 40 },  // Moved left to prevent overlap with boundary (x: 0)
          visible: true,
          icon: '👥',
          zone: 'public'
        },
        {
          id: 'company-b-users',
          type: 'component',
          label: 'Company B Users',
          description: 'Company B end users',
          position: { x: -250, y: 190 },  // Consistent 150px spacing, moved left to prevent overlap
          visible: true,
          icon: '👥',
          zone: 'public'
        },
        {
          id: 'company-c-users',
          type: 'component',
          label: 'Company C Users',
          description: 'Company C end users',
          position: { x: -250, y: 340 },  // Consistent 150px spacing, moved left to prevent overlap
          visible: true,
          icon: '👥',
          zone: 'public'
        },

        // Column 2: Airia Managed (inside boundary box)
        {
          id: 'cdn-company-a',
          type: 'component',
          label: 'CDN (Company A)',
          description: 'Dedicated CDN for Company A',
          position: { x: 40, y: 40 },
          visible: true,
          icon: '🌐',
          zone: 'public',
          parentBoundary: 'airia-managed'
        },
        {
          id: 'cdn-company-b',
          type: 'component',
          label: 'CDN (Company B)',
          description: 'Dedicated CDN for Company B',
          position: { x: 40, y: 190 },  // Aligned with Company B Users at y=190
          visible: true,
          icon: '🌐',
          zone: 'public',
          parentBoundary: 'airia-managed'
        },
        {
          id: 'cdn-company-c',
          type: 'component',
          label: 'CDN (Company C)',
          description: 'Dedicated CDN for Company C',
          position: { x: 40, y: 340 },  // Aligned with Company C Users at y=340
          visible: true,
          icon: '🌐',
          zone: 'public',
          parentBoundary: 'airia-managed'
        },
        {
          id: 'airia-platform-company-a',
          type: 'component',
          label: 'Airia Platform (Company A)',
          description: 'Dedicated platform instance for Company A',
          position: { x: 260, y: 40 },  // Moved from 230 to 260 for 40px spacing (40+180+40=260)
          visible: true,
          icon: '✨',
          zone: 'public',
          parentBoundary: 'airia-managed'
        },
        {
          id: 'airia-platform-company-b',
          type: 'component',
          label: 'Airia Platform (Company B)',
          description: 'Dedicated platform instance for Company B',
          position: { x: 260, y: 190 },  // Aligned with Company B Users at y=190 (40px spacing from CDN)
          visible: true,
          icon: '✨',
          zone: 'public',
          parentBoundary: 'airia-managed'
        },
        {
          id: 'airia-platform-company-c',
          type: 'component',
          label: 'Airia Platform (Company C)',
          description: 'Dedicated platform instance for Company C',
          position: { x: 260, y: 340 },  // Aligned with Company C Users at y=340 (40px spacing from CDN)
          visible: true,
          icon: '✨',
          zone: 'public',
          parentBoundary: 'airia-managed'
        },
        {
          id: 'airia-key-llm',
          type: 'component',
          label: 'Airia Key LLM',
          description: 'Shared Airia-managed LLM service for all companies',
          position: { x: 150, y: 490 },  // Centered below Company C row (340 + 110 + 40 = 490)
          visible: true,
          icon: '🔑',
          zone: 'public',
          parentBoundary: 'airia-managed'
        },
        {
          id: 'siem-public',
          type: 'component',
          label: 'SIEM (Public)',
          description: 'Cloud SIEM - Splunk Cloud, Datadog Security, etc.',
          position: { x: 20, y: 900 },  // Row 2, col 1
          visible: false,
          icon: '🛡️',
          zone: 'public'
        },

        // External Services (below Airia Managed boundary)
        // Row 1 (y=750): External LLM, Public App Integrations
        // Row 2 (y=900): SIEM, Weaviate, Pinecone
        {
          id: 'llm-public',
          type: 'component',
          label: 'External LLM',
          description: 'External LLM providers - OpenAI, Anthropic, etc.',
          position: { x: 20, y: 750 },  // Moved down to avoid Company C overlap
          visible: true,
          icon: '🤖',
          zone: 'public'
        },
        {
          id: 'public-app-integrations',
          type: 'component',
          label: 'Public Application Integrations',
          description: 'Third-party SaaS integrations - Salesforce, Slack, etc.',
          position: { x: 240, y: 750 },  // 40px spacing from External LLM
          visible: false,
          icon: '🔗',
          zone: 'public'
        },
        {
          id: 'weaviate-public',
          type: 'component',
          label: 'Weaviate',
          description: 'Dedicated cloud-hosted vector database',
          position: { x: 240, y: 900 },  // Row 2, col 2
          visible: false,
          icon: '🔷',
          zone: 'public'
        },
        {
          id: 'pinecone',
          type: 'component',
          label: 'Pinecone',
          description: 'Dedicated vector database instance',
          position: { x: 20, y: 1050 },  // Row 3, col 1
          visible: false,
          icon: '🌲',
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
          description: 'Customer internal admins and support staff',
          position: { x: 600, y: 40 },  // Row 1, Col 1 - Changed from y: 500
          visible: true,
          icon: '👨‍💼',
          zone: 'private'
        },
        {
          id: 'airia-cloud-connector',
          type: 'component',
          label: 'Airia Cloud Connector',
          description: 'Dedicated connector for customer on-premises systems',
          position: { x: 820, y: 40 },  // Row 1, Col 2 (820px ensures 40px spacing: 600+180+40=820)
          visible: false,
          icon: '🔌',
          zone: 'private'
        },
        {
          id: 'weaviate-private',
          type: 'component',
          label: 'Weaviate (Private)',
          description: 'Customer self-hosted vector database',
          position: { x: 600, y: 190 },  // Row 2, Col 1
          visible: false,
          icon: '🔷',
          zone: 'private'
        },
        {
          id: 'llm-private',
          type: 'component',
          label: 'Private LLM',
          description: 'Customer self-hosted LLM service',
          position: { x: 820, y: 190 },  // Row 2, Col 2 (aligned with Cloud Connector)
          visible: false,
          icon: '🧠',
          zone: 'private'
        },
        {
          id: 'customer-database',
          type: 'component',
          label: 'Database',
          description: 'Customer on-premises database',
          position: { x: 600, y: 340 },  // Row 3, Col 1 - Same as before (good spacing)
          visible: false,
          icon: '🗄️',
          zone: 'private'
        },
        {
          id: 'private-api',
          type: 'component',
          label: 'Private API',
          description: 'Customer private API endpoints',
          position: { x: 820, y: 340 },  // Row 3, Col 2 (aligned with Cloud Connector)
          visible: false,
          icon: '🔐',
          zone: 'private'
        },
        {
          id: 'siem-private',
          type: 'component',
          label: 'SIEM (Private)',
          description: 'On-premises SIEM - Splunk Enterprise, QRadar, etc.',
          position: { x: 600, y: 490 },  // Row 4, Col 1 - Changed from y: 600
          visible: false,
          icon: '🔒',
          zone: 'private'
        }
      ]
    }
  },
  connections: [
    // Company Users to their dedicated CDNs
    { id: 'e0-company-a', source: 'company-a-users', target: 'cdn-company-a', animated: false },
    { id: 'e0-company-b', source: 'company-b-users', target: 'cdn-company-b', animated: false },
    { id: 'e0-company-c', source: 'company-c-users', target: 'cdn-company-c', animated: false },
    { id: 'e0c', source: 'user-private', target: 'cdn-company-a', animated: false },
    { id: 'e0e', source: 'airia-cloud-connector', target: 'llm-private', animated: false },
    { id: 'e0f', source: 'airia-cloud-connector', target: 'customer-database', animated: false },
    { id: 'e0g', source: 'airia-cloud-connector', target: 'private-api', animated: false },

    // CDNs to their dedicated platform instances
    { id: 'e1-ca', source: 'cdn-company-a', target: 'airia-platform-company-a', animated: false },
    { id: 'e1-cb', source: 'cdn-company-b', target: 'airia-platform-company-b', animated: false },
    { id: 'e1-cc', source: 'cdn-company-c', target: 'airia-platform-company-c', animated: false },

    // Company platforms to Cloud Connector
    { id: 'e1a-ca', source: 'airia-platform-company-a', target: 'airia-cloud-connector', animated: false },
    { id: 'e1a-cb', source: 'airia-platform-company-b', target: 'airia-cloud-connector', animated: false },
    { id: 'e1a-cc', source: 'airia-platform-company-c', target: 'airia-cloud-connector', animated: false },

    // Company platforms to External LLM
    { id: 'e2-ca', source: 'airia-platform-company-a', target: 'llm-public', animated: false },
    { id: 'e2-cb', source: 'airia-platform-company-b', target: 'llm-public', animated: false },
    { id: 'e2-cc', source: 'airia-platform-company-c', target: 'llm-public', animated: false },

    // Company platforms to Airia Key LLM (managed)
    { id: 'e2a-ca', source: 'airia-platform-company-a', target: 'airia-key-llm', animated: false },
    { id: 'e2a-cb', source: 'airia-platform-company-b', target: 'airia-key-llm', animated: false },
    { id: 'e2a-cc', source: 'airia-platform-company-c', target: 'airia-key-llm', animated: false },

    // Company platforms to public integrations
    { id: 'e3-ca', source: 'airia-platform-company-a', target: 'public-app-integrations', animated: false },
    { id: 'e3-cb', source: 'airia-platform-company-b', target: 'public-app-integrations', animated: false },
    { id: 'e3-cc', source: 'airia-platform-company-c', target: 'public-app-integrations', animated: false },

    // Company platforms to Pinecone
    { id: 'e4-ca', source: 'airia-platform-company-a', target: 'pinecone', animated: false },
    { id: 'e4-cb', source: 'airia-platform-company-b', target: 'pinecone', animated: false },
    { id: 'e4-cc', source: 'airia-platform-company-c', target: 'pinecone', animated: false },

    // Company platforms to Weaviate (Public)
    { id: 'e5-ca', source: 'airia-platform-company-a', target: 'weaviate-public', animated: false },
    { id: 'e5-cb', source: 'airia-platform-company-b', target: 'weaviate-public', animated: false },
    { id: 'e5-cc', source: 'airia-platform-company-c', target: 'weaviate-public', animated: false },

    // Company platforms to Weaviate (Private)
    { id: 'e6-ca', source: 'airia-platform-company-a', target: 'weaviate-private', animated: false },
    { id: 'e6-cb', source: 'airia-platform-company-b', target: 'weaviate-private', animated: false },
    { id: 'e6-cc', source: 'airia-platform-company-c', target: 'weaviate-private', animated: false },

    // Company platforms to SIEM (Public)
    { id: 'e7-ca', source: 'airia-platform-company-a', target: 'siem-public', animated: false },
    { id: 'e7-cb', source: 'airia-platform-company-b', target: 'siem-public', animated: false },
    { id: 'e7-cc', source: 'airia-platform-company-c', target: 'siem-public', animated: false },

    // Company platforms to SIEM (Private) via Cloud Connector
    { id: 'e8-siem', source: 'airia-cloud-connector', target: 'siem-private', animated: false },
  ],
  boundaryBoxes: [
    {
      id: 'airia-managed',
      label: 'Airia Managed',
      x: 0,  // Start at left edge for 2-column layout
      y: 0,  // Start from top
      width: 480, // Minimum width: 40 + 180 + 40 + 180 + 40 = 480px (with proper spacing)
      height: 640, // Minimum height: Key LLM at y=490 + 110 (height) + 40 (padding) = 640px
      padding: 40, // Padding around boundary content for dynamic sizing
      color: '#3b82f6',
      badgeLabel: 'Airia Managed',
      badgeColor: 'indigo',
      zone: 'public',
      // Explicit containment rules for this boundary
      containmentRules: {
        description: 'Dedicated Airia-managed infrastructure per company in the public cloud',
        mustContain: [
          'cdn-company-a',              // Dedicated CDN for Company A
          'cdn-company-b',              // Dedicated CDN for Company B
          'cdn-company-c',              // Dedicated CDN for Company C
          'airia-platform-company-a',   // Dedicated platform instance for Company A
          'airia-platform-company-b',   // Dedicated platform instance for Company B
          'airia-platform-company-c',   // Dedicated platform instance for Company C
          'airia-key-llm'               // Shared Airia-managed LLM service
        ],
        mustExclude: [
          'company-a-users',            // Company A end users (external)
          'company-b-users',            // Company B end users (external)
          'company-c-users',            // Company C end users (external)
          'llm-public',                 // External LLM providers
          'pinecone',                   // External vector DB
          'weaviate-public',            // External vector DB
          'public-app-integrations',    // External SaaS integrations
          'siem-public'                 // External SIEM services
        ],
        rule: 'Components with parentBoundary="airia-managed" must be Airia-owned dedicated infrastructure. Company users and external services stay outside.'
      }
    }
  ],
  columnHeaders: []
};

