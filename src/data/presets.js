// Deployment presets for different architecture scenarios

export const presets = {
  'shared-saas': {
    name: 'Shared SaaS',
    description: 'Multi-tenant shared infrastructure - Cost-optimized for multiple customers',
    zones: {
      public: {
        xRange: [0, 525],
        components: [
          // Column 1: Customers (far left)
          {
            id: 'customer-1',
            type: 'component',
            label: 'Customer A',
            description: 'Customer A end users',
            position: { x: -50, y: 100 },
            visible: true,
            icon: '👥'
          },
          {
            id: 'customer-2',
            type: 'component',
            label: 'Customer B',
            description: 'Customer B end users',
            position: { x: -50, y: 200 },
            visible: true,
            icon: '👥'
          },
          {
            id: 'customer-3',
            type: 'component',
            label: 'Customer C',
            description: 'Customer C end users',
            position: { x: -50, y: 300 },
            visible: true,
            icon: '👥'
          },

          // Column 2: Airia Managed (inside boundary box)
          {
            id: 'cdn',
            type: 'component',
            label: 'CDN',
            description: 'Shared CDN - CloudFlare for all tenants',
            position: { x: 20, y: 20 },
            visible: true,
            icon: '🌐',
            parentBoundary: 'airia-managed'
          },
          {
            id: 'airia-platform-na',
            type: 'component',
            label: 'Airia Platform (NA)',
            description: 'North America region - Airia AI platform orchestration layer',
            position: { x: 20, y: 100 },
            visible: true,
            icon: '✨',
            parentBoundary: 'airia-managed'
          },
          {
            id: 'airia-platform-eu',
            type: 'component',
            label: 'Airia Platform (EU)',
            description: 'Europe region - Airia AI platform orchestration layer',
            position: { x: 200, y: 100 },
            visible: false,
            icon: '✨',
            parentBoundary: 'airia-managed'
          },
          {
            id: 'airia-platform-apac',
            type: 'component',
            label: 'Airia Platform (APAC)',
            description: 'Asia-Pacific region (Singapore, Australia) - Airia AI platform orchestration layer',
            position: { x: 200, y: 180 },
            visible: false,
            icon: '✨',
            parentBoundary: 'airia-managed'
          },
          {
            id: 'airia-platform-mena',
            type: 'component',
            label: 'Airia Platform (MENA)',
            description: 'Middle East & North Africa region - Airia AI platform orchestration layer',
            position: { x: 200, y: 260 },
            visible: false,
            icon: '✨',
            parentBoundary: 'airia-managed'
          },
          {
            id: 'airia-key-llm',
            type: 'component',
            label: 'Airia Key LLM',
            description: 'Airia-managed LLM service - Optimized models for key extraction',
            position: { x: 20, y: 260 },
            visible: true,
            icon: '🔑',
            parentBoundary: 'airia-managed'
          },
          {
            id: 'siem-public',
            type: 'component',
            label: 'SIEM (Public)',
            description: 'Cloud SIEM - Splunk Cloud, Datadog Security, etc.',
            position: { x: 150, y: 450 },
            visible: false,
            icon: '🛡️'
          },

          // External Services (positioned relative to boundary box)
          {
            id: 'llm-public',
            type: 'component',
            label: 'External LLM',
            description: 'External LLM providers - OpenAI, Anthropic, etc.',
            position: { x: 30, y: 450 },
            visible: true,
            icon: '🤖',
            positioning: {
              relativeTo: 'airia-managed',
              placement: 'below',
              offsetX: -140,
              offsetY: 10
            }
          },
          {
            id: 'pinecone',
            type: 'component',
            label: 'Pinecone',
            description: 'Vector database for AI embeddings and semantic search',
            position: { x: 200, y: 450 },
            visible: false,
            icon: '🌲',
            positioning: {
              relativeTo: 'airia-managed',
              placement: 'below',
              offsetX: 30,
              offsetY: 10
            }
          },
          {
            id: 'weaviate-public',
            type: 'component',
            label: 'Weaviate',
            description: 'Cloud-hosted vector database for AI-native applications',
            position: { x: 350, y: 450 },
            visible: false,
            icon: '🔷',
            positioning: {
              relativeTo: 'airia-managed',
              placement: 'below',
              offsetX: 180,
              offsetY: 10
            }
          },
          {
            id: 'public-app-integrations',
            type: 'component',
            label: 'Public Application Integrations',
            description: 'Third-party SaaS integrations - Salesforce, Slack, etc.',
            position: { x: 500, y: 450 },
            visible: false,
            icon: '🔗',
            positioning: {
              relativeTo: 'airia-managed',
              placement: 'below',
              offsetX: 330,
              offsetY: 10
            }
          }
        ]
      },
      private: {
        xRange: [575, 900],
        components: [
          {
            id: 'airia-cloud-connector',
            type: 'component',
            label: 'Airia Cloud Connector',
            description: 'Connector for customer on-premises systems to Airia Cloud',
            position: { x: 600, y: 200 },
            visible: false,
            icon: '🔌'
          },
          {
            id: 'user-private',
            type: 'component',
            label: 'Internal Users',
            description: 'Internal admins and support staff',
            position: { x: 600, y: 500 },
            visible: true,
            icon: '👨‍💼'
          },
          {
            id: 'llm-private',
            type: 'component',
            label: 'Private LLM',
            description: 'Self-hosted LLM service for sensitive data',
            position: { x: 750, y: 240 },
            visible: false,
            icon: '🧠'
          },
          {
            id: 'customer-database',
            type: 'component',
            label: 'Database',
            description: 'Customer on-premises database',
            position: { x: 750, y: 360 },
            visible: false,
            icon: '🗄️'
          },
          {
            id: 'private-api',
            type: 'component',
            label: 'Private API',
            description: 'Customer private API endpoints',
            position: { x: 750, y: 480 },
            visible: false,
            icon: '🔐'
          },
          {
            id: 'weaviate-private',
            type: 'component',
            label: 'Weaviate (Private)',
            description: 'Self-hosted vector database for on-premises AI applications',
            position: { x: 750, y: 100 },
            visible: false,
            icon: '🔷'
          },
          {
            id: 'siem-private',
            type: 'component',
            label: 'SIEM (Private)',
            description: 'On-premises SIEM - Splunk Enterprise, QRadar, etc.',
            position: { x: 750, y: 600 },
            visible: false,
            icon: '🔒'
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
        x: 170,
        y: 80,
        width: 400,
        height: 360,
        color: '#3b82f6'
      }
    ],
    columnHeaders: []
  },

  'dedicated-saas': {
    name: 'Dedicated SaaS',
    description: 'Single-tenant dedicated infrastructure - Isolated resources per customer',
    components: [
      {
        id: 'user-public',
        type: 'component',
        label: 'End Users',
        description: 'External end users accessing the application',
        position: { x: 50, y: 175 },
        visible: true,
        zone: 'public',
        icon: '👤'
      },
      {
        id: 'user-private',
        type: 'component',
        label: 'Internal Users',
        description: 'Internal admins and support staff',
        position: { x: 400, y: 80 },
        visible: true,
        zone: 'private',
        icon: '👨‍💼'
      },
      {
        id: 'cdn',
        type: 'component',
        label: 'CDN',
        description: 'Dedicated CDN distribution',
        position: { x: 100, y: 100 },
        visible: true,
        zone: 'public',
        icon: '🌐'
      },
      {
        id: 'loadbalancer',
        type: 'component',
        label: 'Dedicated LB',
        description: 'Customer-specific load balancer',
        position: { x: 100, y: 250 },
        visible: true,
        zone: 'public',
        icon: '⚖️'
      },
      {
        id: 'apigateway',
        type: 'component',
        label: 'Dedicated API Gateway',
        description: 'Isolated API Gateway for this customer',
        position: { x: 400, y: 150 },
        visible: true,
        zone: 'private',
        icon: '🚪'
      },
      {
        id: 'appserver1',
        type: 'component',
        label: 'App Server 1',
        description: 'Dedicated application server',
        position: { x: 400, y: 300 },
        visible: true,
        zone: 'private',
        icon: '🖥️'
      },
      {
        id: 'appserver2',
        type: 'component',
        label: 'App Server 2',
        description: 'Dedicated application server for HA',
        position: { x: 550, y: 300 },
        visible: true,
        zone: 'private',
        icon: '🖥️'
      },
      {
        id: 'cache',
        type: 'component',
        label: 'Dedicated Redis',
        description: 'Dedicated cache instance',
        position: { x: 700, y: 150 },
        visible: true,
        zone: 'private',
        icon: '💾'
      },
      {
        id: 'database-primary',
        type: 'component',
        label: 'Dedicated DB (Primary)',
        description: 'Dedicated database instance',
        position: { x: 700, y: 300 },
        visible: true,
        zone: 'private',
        icon: '🗄️'
      },
      {
        id: 'database-replica',
        type: 'component',
        label: 'Dedicated DB (Replica)',
        description: 'Dedicated read replica',
        position: { x: 850, y: 300 },
        visible: true,
        zone: 'private',
        icon: '🗄️'
      },
      {
        id: 'messagequeue',
        type: 'component',
        label: 'Dedicated Queue',
        description: 'Dedicated message queue',
        position: { x: 700, y: 450 },
        visible: true,
        zone: 'private',
        icon: '📬'
      },
      {
        id: 'storage',
        type: 'component',
        label: 'Dedicated Storage',
        description: 'Dedicated S3/R2 bucket',
        position: { x: 400, y: 450 },
        visible: true,
        zone: 'private',
        icon: '📦'
      },
      {
        id: 'monitoring',
        type: 'component',
        label: 'Dedicated Monitoring',
        description: 'Customer-specific monitoring stack',
        position: { x: 850, y: 450 },
        visible: true,
        zone: 'private',
        icon: '📊'
      },
      {
        id: 'llm-public',
        type: 'component',
        label: 'External LLM API',
        description: 'Public LLM API - OpenAI, Anthropic, etc.',
        position: { x: 100, y: 400 },
        visible: true,
        zone: 'public',
        icon: '🤖'
      },
      {
        id: 'llm-private',
        type: 'component',
        label: 'Dedicated Private LLM',
        description: 'Customer-specific self-hosted LLM instance',
        position: { x: 475, y: 375 },
        visible: false,
        zone: 'private',
        icon: '🧠'
      }
    ],
    connections: [
      { id: 'e0', source: 'user-public', target: 'cdn', animated: false },
      { id: 'e1', source: 'cdn', target: 'loadbalancer', animated: false },
      { id: 'e2', source: 'loadbalancer', target: 'apigateway', animated: false },
      { id: 'e2b', source: 'user-private', target: 'apigateway', animated: false },
      { id: 'e3', source: 'apigateway', target: 'appserver1', animated: false },
      { id: 'e4', source: 'apigateway', target: 'appserver2', animated: false },
      { id: 'e5', source: 'appserver1', target: 'cache', animated: false },
      { id: 'e6', source: 'appserver2', target: 'cache', animated: false },
      { id: 'e7', source: 'appserver1', target: 'database-primary', animated: false },
      { id: 'e8', source: 'appserver2', target: 'database-primary', animated: false },
      { id: 'e9', source: 'database-primary', target: 'database-replica', animated: false, label: 'replication' },
      { id: 'e10', source: 'appserver1', target: 'messagequeue', animated: false },
      { id: 'e11', source: 'appserver2', target: 'messagequeue', animated: false },
      { id: 'e12', source: 'appserver1', target: 'storage', animated: false },
      { id: 'e13', source: 'appserver2', target: 'storage', animated: false },
      { id: 'e14', source: 'appserver1', target: 'llm-public', animated: false },
      { id: 'e15', source: 'appserver2', target: 'llm-public', animated: false },
      { id: 'e16', source: 'appserver1', target: 'llm-private', animated: false },
      { id: 'e17', source: 'appserver2', target: 'llm-private', animated: false }
    ]
  },

  'customer-hosted': {
    name: 'Customer Hosted',
    description: 'On-premises or customer VPC deployment - Full customer control',
    components: [
      {
        id: 'user-public',
        type: 'component',
        label: 'Remote Users',
        description: 'Remote users connecting via VPN',
        position: { x: 50, y: 100 },
        visible: true,
        zone: 'public',
        icon: '👤'
      },
      {
        id: 'user-private',
        type: 'component',
        label: 'On-Site Users',
        description: 'On-premises internal users and administrators',
        position: { x: 400, y: 80 },
        visible: true,
        zone: 'private',
        icon: '👨‍💼'
      },
      {
        id: 'vpn',
        type: 'component',
        label: 'VPN Gateway',
        description: 'Secure VPN connection to customer network',
        position: { x: 100, y: 100 },
        visible: true,
        zone: 'public',
        icon: '🔐'
      },
      {
        id: 'firewall',
        type: 'component',
        label: 'Firewall',
        description: 'Customer-managed firewall',
        position: { x: 100, y: 250 },
        visible: true,
        zone: 'public',
        icon: '🛡️'
      },
      {
        id: 'loadbalancer',
        type: 'component',
        label: 'Load Balancer',
        description: 'Customer-managed load balancer (HAProxy/NGINX)',
        position: { x: 250, y: 175 },
        visible: true,
        zone: 'public',
        icon: '⚖️'
      },
      {
        id: 'apigateway',
        type: 'component',
        label: 'API Gateway',
        description: 'On-premises API Gateway',
        position: { x: 400, y: 150 },
        visible: true,
        zone: 'private',
        icon: '🚪'
      },
      {
        id: 'appserver1',
        type: 'component',
        label: 'App Server 1',
        description: 'Customer-hosted application server',
        position: { x: 450, y: 300 },
        visible: true,
        zone: 'private',
        icon: '🖥️'
      },
      {
        id: 'appserver2',
        type: 'component',
        label: 'App Server 2',
        description: 'Customer-hosted application server',
        position: { x: 600, y: 300 },
        visible: true,
        zone: 'private',
        icon: '🖥️'
      },
      {
        id: 'appserver3',
        type: 'component',
        label: 'App Server 3',
        description: 'Customer-hosted application server',
        position: { x: 525, y: 400 },
        visible: true,
        zone: 'private',
        icon: '🖥️'
      },
      {
        id: 'cache',
        type: 'component',
        label: 'Redis Cluster',
        description: 'Self-managed Redis cluster',
        position: { x: 750, y: 150 },
        visible: true,
        zone: 'private',
        icon: '💾'
      },
      {
        id: 'database-primary',
        type: 'component',
        label: 'Database (Primary)',
        description: 'Customer-managed database server',
        position: { x: 750, y: 300 },
        visible: true,
        zone: 'private',
        icon: '🗄️'
      },
      {
        id: 'database-replica',
        type: 'component',
        label: 'Database (Replica)',
        description: 'Customer-managed read replica',
        position: { x: 850, y: 300 },
        visible: true,
        zone: 'private',
        icon: '🗄️'
      },
      {
        id: 'database-backup',
        type: 'component',
        label: 'Backup DB',
        description: 'Customer-managed backup database',
        position: { x: 800, y: 400 },
        visible: true,
        zone: 'private',
        icon: '💿'
      },
      {
        id: 'messagequeue',
        type: 'component',
        label: 'Message Queue',
        description: 'Self-hosted message broker',
        position: { x: 600, y: 500 },
        visible: true,
        zone: 'private',
        icon: '📬'
      },
      {
        id: 'storage',
        type: 'component',
        label: 'Local Storage',
        description: 'On-premises file storage (NAS/SAN)',
        position: { x: 450, y: 500 },
        visible: true,
        zone: 'private',
        icon: '📦'
      },
      {
        id: 'monitoring',
        type: 'component',
        label: 'Monitoring Stack',
        description: 'Customer-managed monitoring (Prometheus/Grafana)',
        position: { x: 750, y: 500 },
        visible: true,
        zone: 'private',
        icon: '📊'
      },
      {
        id: 'backup-system',
        type: 'component',
        label: 'Backup System',
        description: 'Customer backup infrastructure',
        position: { x: 900, y: 500 },
        visible: true,
        zone: 'private',
        icon: '💾'
      },
      {
        id: 'llm-public',
        type: 'component',
        label: 'External LLM API',
        description: 'Public LLM API - OpenAI, Anthropic (optional for air-gapped)',
        position: { x: 250, y: 350 },
        visible: true,
        zone: 'public',
        icon: '🤖'
      },
      {
        id: 'llm-private',
        type: 'component',
        label: 'On-Premises LLM',
        description: 'Fully on-premises LLM deployment - Llama, Mistral, etc.',
        position: { x: 650, y: 200 },
        visible: false,
        zone: 'private',
        icon: '🧠'
      }
    ],
    connections: [
      { id: 'e0', source: 'user-public', target: 'vpn', animated: false },
      { id: 'e1', source: 'vpn', target: 'firewall', animated: false },
      { id: 'e2', source: 'firewall', target: 'loadbalancer', animated: false },
      { id: 'e2b', source: 'user-private', target: 'apigateway', animated: false },
      { id: 'e3', source: 'loadbalancer', target: 'apigateway', animated: false },
      { id: 'e4', source: 'apigateway', target: 'appserver1', animated: false },
      { id: 'e5', source: 'apigateway', target: 'appserver2', animated: false },
      { id: 'e6', source: 'apigateway', target: 'appserver3', animated: false },
      { id: 'e7', source: 'appserver1', target: 'cache', animated: false },
      { id: 'e8', source: 'appserver2', target: 'cache', animated: false },
      { id: 'e9', source: 'appserver3', target: 'cache', animated: false },
      { id: 'e10', source: 'appserver1', target: 'database-primary', animated: false },
      { id: 'e11', source: 'appserver2', target: 'database-primary', animated: false },
      { id: 'e12', source: 'appserver3', target: 'database-primary', animated: false },
      { id: 'e13', source: 'database-primary', target: 'database-replica', animated: false, label: 'replication' },
      { id: 'e14', source: 'database-primary', target: 'database-backup', animated: false, label: 'backup' },
      { id: 'e15', source: 'appserver1', target: 'messagequeue', animated: false },
      { id: 'e16', source: 'appserver2', target: 'messagequeue', animated: false },
      { id: 'e17', source: 'appserver3', target: 'messagequeue', animated: false },
      { id: 'e18', source: 'appserver1', target: 'storage', animated: false },
      { id: 'e19', source: 'appserver2', target: 'storage', animated: false },
      { id: 'e20', source: 'appserver3', target: 'storage', animated: false },
      { id: 'e21', source: 'database-primary', target: 'backup-system', animated: false },
      { id: 'e22', source: 'storage', target: 'backup-system', animated: false },
      { id: 'e23', source: 'appserver1', target: 'llm-public', animated: false },
      { id: 'e24', source: 'appserver2', target: 'llm-public', animated: false },
      { id: 'e25', source: 'appserver3', target: 'llm-public', animated: false },
      { id: 'e26', source: 'appserver1', target: 'llm-private', animated: false },
      { id: 'e27', source: 'appserver2', target: 'llm-private', animated: false },
      { id: 'e28', source: 'appserver3', target: 'llm-private', animated: false }
    ],
    zoneLabels: {
      left: '🌐 Public Network',
      right: '🏢 Customer Network'
    }
  }
};

export const presetList = [
  { id: 'shared-saas', name: 'Shared SaaS', description: 'Multi-tenant, cost-optimized' },
  { id: 'dedicated-saas', name: 'Dedicated SaaS', description: 'Single-tenant, isolated resources' },
  { id: 'customer-hosted', name: 'Customer Hosted', description: 'On-premises, full control' }
];
