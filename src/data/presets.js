// Deployment presets for different architecture scenarios

export const presets = {
  'shared-saas': {
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
            icon: '👥',
            zone: 'public'
          },
          {
            id: 'customer-2',
            type: 'component',
            label: 'Customer B',
            description: 'Customer B end users',
            position: { x: 20, y: 190 },
            visible: true,
            icon: '👥',
            zone: 'public'
          },
          {
            id: 'customer-3',
            type: 'component',
            label: 'Customer C',
            description: 'Customer C end users',
            position: { x: 20, y: 340 },
            visible: true,
            icon: '👥',
            zone: 'public'
          },

          // Airia Managed Components (parentBoundary='airia-managed')
          // Positions RELATIVE to boundary at (260, 20)
          // Boundary has 30px padding, so components start at relative (30, 30)
          {
            id: 'cdn',
            type: 'component',
            label: 'CDN',
            description: 'Shared CDN - CloudFlare for all tenants',
            position: { x: 30, y: 30 },  // Relative to boundary (260, 20), absolute: (290, 50)
            visible: true,
            icon: '🌐',
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
            icon: '✨',
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
            icon: '🔑',
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
            icon: '✨',
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
            icon: '✨',
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
            icon: '✨',
            zone: 'public',
            parentBoundary: 'airia-managed'
          },
          // External Services (below Airia Managed box)
          // Row 1 (y=700): External LLM, Public App Integrations
          // Row 2 (y=850): SIEM, Weaviate
          // Row 3 (y=1000): Pinecone
          {
            id: 'llm-public',
            type: 'component',
            label: 'External LLM',
            description: 'External LLM providers - OpenAI, Anthropic, etc.',
            position: { x: 20, y: 700 },
            visible: true,
            icon: '🤖',
            zone: 'public'
          },
          {
            id: 'public-app-integrations',
            type: 'component',
            label: 'Public Application Integrations',
            description: 'Third-party SaaS integrations - Salesforce, Slack, etc.',
            position: { x: 240, y: 700 }, // 40px spacing from External LLM: 20+180+40=240 (240+180=420 < 550)
            visible: false,
            icon: '🔗',
            zone: 'public'
          },
          {
            id: 'siem-public',
            type: 'component',
            label: 'SIEM (Public)',
            description: 'Cloud SIEM - Splunk Cloud, Datadog Security, etc.',
            position: { x: 20, y: 850 }, // Row 2, col 1
            visible: false,
            icon: '🛡️',
            zone: 'public'
          },
          {
            id: 'weaviate-public',
            type: 'component',
            label: 'Weaviate',
            description: 'Cloud-hosted vector database for AI-native applications',
            position: { x: 240, y: 850 }, // Row 2, col 2 (aligned with Public App Integrations)
            visible: false,
            icon: '🔷',
            zone: 'public'
          },
          {
            id: 'pinecone',
            type: 'component',
            label: 'Pinecone',
            description: 'Vector database for AI embeddings and semantic search',
            position: { x: 20, y: 1000 }, // Row 3, col 1 (moved to new row to stay in zone)
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
            description: 'Internal admins and support staff',
            position: { x: 600, y: 40 },  // Row 1, Col 1 - Changed from y: 500
            visible: true,
            icon: '👨‍💼',
            zone: 'private'
          },
          {
            id: 'airia-cloud-connector',
            type: 'component',
            label: 'Airia Cloud Connector',
            description: 'Connector for customer on-premises systems to Airia Cloud',
            position: { x: 820, y: 40 },  // Row 1, Col 2 (820px ensures 40px spacing: 600+180+40=820)
            visible: false,
            icon: '🔌',
            zone: 'private'
          },
          {
            id: 'weaviate-private',
            type: 'component',
            label: 'Weaviate (Private)',
            description: 'Self-hosted vector database for on-premises AI applications',
            position: { x: 600, y: 190 },  // Row 2, Col 1 - Changed from y: 100
            visible: false,
            icon: '🔷',
            zone: 'private'
          },
          {
            id: 'llm-private',
            type: 'component',
            label: 'Private LLM',
            description: 'Self-hosted LLM service for sensitive data',
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
            position: { x: 600, y: 340 },  // Row 3, Col 1 - Changed from y: 360
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

      // Regional platforms to External LLM
      { id: 'e2-na', source: 'airia-platform-na', target: 'llm-public', animated: false },
      { id: 'e2-eu', source: 'airia-platform-eu', target: 'llm-public', animated: false },
      { id: 'e2-apac', source: 'airia-platform-apac', target: 'llm-public', animated: false },
      { id: 'e2-mena', source: 'airia-platform-mena', target: 'llm-public', animated: false },

      // Regional platforms to Airia Key LLM (managed)
      { id: 'e2a-na', source: 'airia-platform-na', target: 'airia-key-llm', animated: false },
      { id: 'e2a-eu', source: 'airia-platform-eu', target: 'airia-key-llm', animated: false },
      { id: 'e2a-apac', source: 'airia-platform-apac', target: 'airia-key-llm', animated: false },
      { id: 'e2a-mena', source: 'airia-platform-mena', target: 'airia-key-llm', animated: false },

      // Regional platforms to public integrations
      { id: 'e3-na', source: 'airia-platform-na', target: 'public-app-integrations', animated: false },
      { id: 'e3-eu', source: 'airia-platform-eu', target: 'public-app-integrations', animated: false },
      { id: 'e3-apac', source: 'airia-platform-apac', target: 'public-app-integrations', animated: false },
      { id: 'e3-mena', source: 'airia-platform-mena', target: 'public-app-integrations', animated: false },

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
            'llm-public',             // External LLM providers
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
  },

  'dedicated-saas': {
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
        zone: 'public', // This boundary box belongs to the public zone
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
  },

  'customer-hosted': {
    name: 'Customer Hosted',
    description: 'On-premises or customer VPC deployment - Full customer control',
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
          managed: { x: 170, y: 80, width: 360, height: 360 }, // Airia Managed boundary
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
            icon: '👥',
            zone: 'public'
          },
          {
            id: 'customer-2',
            type: 'component',
            label: 'Customer B',
            description: 'Customer B end users',
            position: { x: 20, y: 190 },
            visible: true,
            icon: '👥',
            zone: 'public'
          },
          {
            id: 'customer-3',
            type: 'component',
            label: 'Customer C',
            description: 'Customer C end users',
            position: { x: 20, y: 340 },
            visible: true,
            icon: '👥',
            zone: 'public'
          },

          // Airia Managed Components (parentBoundary='airia-managed')
          // Positions RELATIVE to boundary at (260, 20)
          {
            id: 'cdn',
            type: 'component',
            label: 'CDN',
            description: 'Shared CDN - CloudFlare for all tenants',
            position: { x: 30, y: 30 },
            visible: true,
            icon: '🌐',
            zone: 'public',
            parentBoundary: 'airia-managed'
          },
          {
            id: 'airia-key-llm',
            type: 'component',
            label: 'Airia Key LLM',
            description: 'Airia-managed LLM service - Optimized models for key extraction',
            position: { x: 30, y: 330 },
            visible: true,
            icon: '🔑',
            zone: 'public',
            parentBoundary: 'airia-managed'
          },

          // External Services
          {
            id: 'llm-public',
            type: 'component',
            label: 'External LLM',
            description: 'External LLM providers - OpenAI, Anthropic, etc.',
            position: { x: 20, y: 700 },
            visible: true,
            icon: '🤖',
            zone: 'public'
          },
          {
            id: 'public-app-integrations',
            type: 'component',
            label: 'Public Application Integrations',
            description: 'Third-party SaaS integrations - Salesforce, Slack, etc.',
            position: { x: 240, y: 700 },
            visible: false,
            icon: '🔗',
            zone: 'public'
          },
          {
            id: 'siem-public',
            type: 'component',
            label: 'SIEM (Public)',
            description: 'Cloud SIEM - Splunk Cloud, Datadog Security, etc.',
            position: { x: 20, y: 850 },
            visible: false,
            icon: '🛡️',
            zone: 'public'
          },
          {
            id: 'weaviate-public',
            type: 'component',
            label: 'Weaviate',
            description: 'Cloud-hosted vector database for AI-native applications',
            position: { x: 240, y: 850 },
            visible: false,
            icon: '🔷',
            zone: 'public'
          },
          {
            id: 'pinecone',
            type: 'component',
            label: 'Pinecone',
            description: 'Vector database for AI embeddings and semantic search',
            position: { x: 20, y: 1000 },
            visible: false,
            icon: '🌲',
            zone: 'public'
          }
        ]
      },
      private: {
        xRange: [575, 900],
        components: [
          // Private zone components
          {
            id: 'user-private',
            type: 'component',
            label: 'Internal Users',
            description: 'Internal admins and support staff',
            position: { x: 600, y: 40 },
            visible: true,
            icon: '👨‍💼',
            zone: 'private'
          },

          // Kubernetes Cluster Components (parentBoundary='kubernetes-cluster')
          // Positions RELATIVE to boundary
          {
            id: 'airia-platform-customer',
            type: 'component',
            label: 'Airia Platform',
            description: 'Customer-hosted Airia Platform running in Kubernetes',
            position: { x: 40, y: 40 },  // Relative to Kubernetes boundary
            visible: true,
            icon: '✨',
            zone: 'private',
            parentBoundary: 'kubernetes-cluster'
          },

          // Blob Storage - Outside Kubernetes (absolute position in private zone)
          {
            id: 'blob-storage',
            type: 'component',
            label: 'Blob Storage',
            description: 'Object storage for documents and files (S3-compatible)',
            position: { x: 600, y: 250 },  // Column 1 below Internal Users and Weaviate
            visible: true,
            icon: '🗂️',
            zone: 'private'
          },
          {
            id: 'airia-cloud-connector',
            type: 'component',
            label: 'Airia Cloud Connector',
            description: 'Connector for customer on-premises systems to Airia Cloud',
            position: { x: 820, y: 40 },
            visible: false,
            icon: '🔌',
            zone: 'private'
          },
          {
            id: 'weaviate-private',
            type: 'component',
            label: 'Weaviate (Private)',
            description: 'Self-hosted vector database for on-premises AI applications',
            position: { x: 600, y: 190 },
            visible: false,
            icon: '🔷',
            zone: 'private'
          },
          {
            id: 'llm-private',
            type: 'component',
            label: 'Private LLM',
            description: 'Self-hosted LLM service for sensitive data',
            position: { x: 820, y: 190 },
            visible: false,
            icon: '🧠',
            zone: 'private'
          },
          // Database Container Components (parentBoundary='database-container')
          // Positions RELATIVE to boundary
          {
            id: 'postgres-db',
            type: 'component',
            label: 'PostgreSQL',
            description: 'PostgreSQL relational database',
            position: { x: 40, y: 40 },  // Relative to database container boundary
            visible: true,
            icon: '🐘',
            zone: 'private',
            parentBoundary: 'database-container'
          },
          {
            id: 'cassandra-db',
            type: 'component',
            label: 'Cassandra',
            description: 'Cassandra distributed NoSQL database',
            position: { x: 40, y: 190 },  // Below PostgreSQL: 40 + 110 + 40 = 190
            visible: true,
            icon: '💍',
            zone: 'private',
            parentBoundary: 'database-container'
          },
          {
            id: 'private-api',
            type: 'component',
            label: 'Private API',
            description: 'Customer private API endpoints',
            position: { x: 820, y: 340 },
            visible: false,
            icon: '🔐',
            zone: 'private'
          },
          {
            id: 'siem-private',
            type: 'component',
            label: 'SIEM (Private)',
            description: 'On-premises SIEM - Splunk Enterprise, QRadar, etc.',
            position: { x: 600, y: 490 },
            visible: false,
            icon: '🔒',
            zone: 'private'
          }
        ]
      }
    },
    connections: [
      // Customers to CDN
      { id: 'e0-customer1', source: 'customer-1', target: 'cdn', animated: false },
      { id: 'e0-customer2', source: 'customer-2', target: 'cdn', animated: false },
      { id: 'e0-customer3', source: 'customer-3', target: 'cdn', animated: false },
      { id: 'e0c', source: 'user-private', target: 'cdn', animated: false },

      // CDN to Airia Platform (in Kubernetes)
      { id: 'e1-platform', source: 'cdn', target: 'airia-platform-customer', animated: false },

      // Airia Platform to services
      { id: 'e1a-platform', source: 'airia-platform-customer', target: 'airia-cloud-connector', animated: false },
      { id: 'e2-platform', source: 'airia-platform-customer', target: 'llm-public', animated: false },
      { id: 'e2a-platform', source: 'airia-platform-customer', target: 'airia-key-llm', animated: false },
      { id: 'e3-platform', source: 'airia-platform-customer', target: 'public-app-integrations', animated: false },
      { id: 'e4-platform', source: 'airia-platform-customer', target: 'pinecone', animated: false },
      { id: 'e5-platform', source: 'airia-platform-customer', target: 'weaviate-public', animated: false },
      { id: 'e6-platform', source: 'airia-platform-customer', target: 'weaviate-private', animated: false },
      { id: 'e7-platform', source: 'airia-platform-customer', target: 'siem-public', animated: false },

      // Airia Platform to Blob Storage (within Kubernetes)
      { id: 'e-blob', source: 'airia-platform-customer', target: 'blob-storage', animated: false },

      // Cloud connector to private services
      { id: 'e0e', source: 'airia-cloud-connector', target: 'llm-private', animated: false },
      { id: 'e0f', source: 'airia-cloud-connector', target: 'customer-database', animated: false },
      { id: 'e0g', source: 'airia-cloud-connector', target: 'private-api', animated: false },
      { id: 'e8-siem', source: 'airia-cloud-connector', target: 'siem-private', animated: false },
    ],
    boundaryBoxes: [
      {
        id: 'airia-managed',
        label: 'Airia Managed',
        x: 260,
        y: 20,
        width: 270,
        height: 320,  // Reduced height since platform moved to private zone
        padding: 30,
        color: '#3b82f6',
        zone: 'public',
        containmentRules: {
          description: 'Airia-managed infrastructure components in the public cloud',
          mustContain: [
            'cdn',
            'airia-key-llm'
          ],
          mustExclude: [
            'customer-1',
            'customer-2',
            'customer-3',
            'llm-public',
            'pinecone',
            'weaviate-public',
            'public-app-integrations',
            'siem-public'
          ],
          rule: 'Components with parentBoundary="airia-managed" must be Airia-owned infrastructure. Customer-facing and external services stay outside.'
        }
      },
      {
        id: 'kubernetes-cluster',
        label: 'Kubernetes Cluster',
        x: 820,  // In private zone: 820px ensures 40px spacing from Internal Users at 600
        y: 20,
        width: 260,  // Width: 40 (padding) + 180 (component) + 40 (padding) = 260
        height: 190,  // Height: 40 (padding) + 110 (Platform) + 40 (padding) = 190
        padding: 40,
        color: '#326ce5',  // Kubernetes blue
        zone: 'private',
        containmentRules: {
          description: 'Customer-hosted Kubernetes cluster running Airia Platform',
          mustContain: [
            'airia-platform-customer'
          ],
          mustExclude: [
            'user-private',
            'blob-storage',
            'airia-cloud-connector',
            'weaviate-private',
            'llm-private',
            'customer-database',
            'private-api',
            'siem-private'
          ],
          rule: 'Components with parentBoundary="kubernetes-cluster" must be containerized services running in K8s.'
        }
      }
    ],
    columnHeaders: []
  }

};

export const presetList = [
  { id: 'shared-saas', name: 'Shared SaaS', description: 'Multi-tenant, cost-optimized' },
  { id: 'dedicated-saas', name: 'Dedicated SaaS', description: 'Single-tenant, isolated resources' },
  { id: 'customer-hosted', name: 'Customer Hosted', description: 'On-premises, full control' }
];
