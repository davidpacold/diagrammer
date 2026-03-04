// Customer Hosted deployment preset - On-premises or customer VPC deployment

export const customerHosted = {
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
        external: { x: 30, y: 450, width: 500 } // External services
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
        ingress: { x: 600, y: 40, width: 180 },
        kubernetes: { x: 820, y: 20, width: 260 },
        services: { x: 600, y: 200, width: 400 }
      }
    }
  },
  zones: {
    public: {
      xRange: [0, 525],
      components: [
        // PUBLIC ZONE - External Components
        // Customer (single)
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
      xRange: [575, 1200],
      components: [
        // PRIVATE ZONE COMPONENTS

        // Column 1: Entry point and services (x=600)
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
        {
          id: 'ingress',
          type: 'component',
          label: 'Ingress',
          description: 'Kubernetes ingress controller for routing traffic',
          position: { x: 600, y: 190 },
          visible: true,
          icon: '🚪',
          zone: 'private'
        },
        {
          id: 'blob-storage',
          type: 'component',
          label: 'Blob Storage',
          description: 'Object storage for documents and files (S3-compatible)',
          position: { x: 1120, y: 550 },  // Column 3, below AI Services container (510 + 40 spacing)
          visible: true,
          icon: '🗂️',
          zone: 'private'
        },
        {
          id: 'weaviate-private',
          type: 'component',
          label: 'Weaviate (Private)',
          description: 'Self-hosted vector database for on-premises AI applications',
          position: { x: 600, y: 490 },
          visible: false,
          icon: '🔷',
          zone: 'private'
        },
        {
          id: 'siem-private',
          type: 'component',
          label: 'SIEM (Private)',
          description: 'On-premises SIEM - Splunk Enterprise, QRadar, etc.',
          position: { x: 600, y: 640 },
          visible: false,
          icon: '🔒',
          zone: 'private'
        },

        // Column 2: Kubernetes Cluster (parentBoundary='kubernetes-cluster')
        // Positions RELATIVE to boundary at (820, 20)
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

        // Column 3: Additional services (x=1120)
        {
          id: 'private-api',
          type: 'component',
          label: 'Private API',
          description: 'Customer private API endpoints',
          position: { x: 1120, y: 40 },
          visible: false,
          icon: '🔐',
          zone: 'private'
        },

        // AI Services Container Components (parentBoundary='ai-services-container')
        // Positions RELATIVE to boundary at (1120, 190)
        {
          id: 'llm-private',
          type: 'component',
          label: 'Private LLM',
          description: 'Self-hosted LLM service for sensitive data',
          position: { x: 40, y: 40 },  // Relative to AI Services boundary
          visible: true,
          icon: '🧠',
          zone: 'private',
          parentBoundary: 'ai-services-container'
        },
        {
          id: 'vision-model',
          type: 'component',
          label: 'Vision Model',
          description: 'Self-hosted vision/multimodal AI model for image and video analysis',
          position: { x: 40, y: 190 },  // Below Private LLM: 40 + 110 + 40 = 190
          visible: true,
          icon: '👁️',
          zone: 'private',
          parentBoundary: 'ai-services-container'
        },

        // Database Container Components (parentBoundary='database-container')
        // Positions RELATIVE to boundary at (820, 250)
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
        }
      ]
    }
  },
  connections: [
    // Customer to Ingress
    { id: 'e0-customer-ingress', source: 'customer-1', target: 'ingress', animated: false },

    // Internal Users to Ingress
    { id: 'e0-internal-ingress', source: 'user-private', target: 'ingress', animated: false },

    // Ingress to Airia Platform (in Kubernetes)
    { id: 'e1-ingress-platform', source: 'ingress', target: 'airia-platform-customer', animated: false },

    // Airia Platform to services
    { id: 'e2-platform-llm-public', source: 'airia-platform-customer', target: 'llm-public', animated: false },
    { id: 'e3-platform-integrations', source: 'airia-platform-customer', target: 'public-app-integrations', animated: false },
    { id: 'e4-platform-pinecone', source: 'airia-platform-customer', target: 'pinecone', animated: false },
    { id: 'e5-platform-weaviate-public', source: 'airia-platform-customer', target: 'weaviate-public', animated: false },
    { id: 'e6-platform-weaviate-private', source: 'airia-platform-customer', target: 'weaviate-private', animated: false },
    { id: 'e7-platform-siem-public', source: 'airia-platform-customer', target: 'siem-public', animated: false },

    // Airia Platform to private services
    { id: 'e8-platform-blob', source: 'airia-platform-customer', target: 'blob-storage', animated: false },
    { id: 'e9-platform-postgres', source: 'airia-platform-customer', target: 'postgres-db', animated: false },
    { id: 'e10-platform-cassandra', source: 'airia-platform-customer', target: 'cassandra-db', animated: false },
    { id: 'e11-platform-llm-private', source: 'airia-platform-customer', target: 'llm-private', animated: false },
    { id: 'e12-platform-private-api', source: 'airia-platform-customer', target: 'private-api', animated: false },
    { id: 'e13-platform-siem-private', source: 'airia-platform-customer', target: 'siem-private', animated: false },
    { id: 'e14-platform-vision', source: 'airia-platform-customer', target: 'vision-model', animated: false },
  ],
  boundaryBoxes: [
    {
      id: 'kubernetes-cluster',
      label: 'Kubernetes Cluster',
      x: 820,  // In private zone, column 2
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
          'ingress',
          'blob-storage',
          'weaviate-private',
          'llm-private',
          'postgres-db',
          'cassandra-db',
          'private-api',
          'siem-private',
          'vision-model'
        ],
        rule: 'Components with parentBoundary="kubernetes-cluster" must be containerized services running in K8s.'
      }
    },
    {
      id: 'database-container',
      label: 'Databases',
      x: 820,  // Same column as Kubernetes, below it
      y: 250,  // Below Kubernetes: 20 (K8s y) + 190 (K8s height) + 40 (spacing) = 250
      width: 260,  // Width: 40 (padding) + 180 (component) + 40 (padding) = 260
      height: 320,  // Height: 40 (top pad) + 110 (PostgreSQL) + 40 (spacing) + 110 (Cassandra) + 20 (bottom pad) = 320
      padding: 40,
      color: '#059669',  // Database green
      zone: 'private',
      containmentRules: {
        description: 'Database cluster with PostgreSQL and Cassandra',
        mustContain: [
          'postgres-db',
          'cassandra-db'
        ],
        mustExclude: [
          'user-private',
          'ingress',
          'blob-storage',
          'weaviate-private',
          'llm-private',
          'airia-platform-customer',
          'private-api',
          'siem-private',
          'vision-model'
        ],
        rule: 'Components with parentBoundary="database-container" must be database services.'
      }
    },
    {
      id: 'ai-services-container',
      label: 'AI Services',
      x: 1120,  // Column 3 - After Database/K8s containers (820 + 260 + 40 spacing = 1120)
      y: 190,  // Below Private API: 40 (Private API y) + 110 (height) + 40 (spacing) = 190
      width: 260,  // Width: 40 (padding) + 180 (component) + 40 (padding) = 260
      height: 320,  // Height: 40 (top pad) + 110 (LLM) + 40 (spacing) + 110 (Vision) + 20 (bottom pad) = 320
      padding: 40,
      color: '#7c3aed',  // Purple for AI services
      zone: 'private',
      containmentRules: {
        description: 'AI services including LLM and Vision models',
        mustContain: [
          'llm-private',
          'vision-model'
        ],
        mustExclude: [
          'user-private',
          'ingress',
          'blob-storage',
          'weaviate-private',
          'airia-platform-customer',
          'private-api',
          'siem-private',
          'postgres-db',
          'cassandra-db'
        ],
        rule: 'Components with parentBoundary="ai-services-container" must be AI/ML services.'
      }
    }
  ],
  columnHeaders: []
};

