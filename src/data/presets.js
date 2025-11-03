// Deployment presets for different architecture scenarios

export const presets = {
  'shared-saas': {
    name: 'Shared SaaS',
    description: 'Multi-tenant shared infrastructure - Cost-optimized for multiple customers',
    zones: {
      public: {
        xRange: [0, 350],
        components: [
          {
            id: 'user-public',
            type: 'component',
            label: 'End Users',
            description: 'External end users accessing the application',
            position: { x: 50, y: 250 },
            visible: true,
            icon: '👤'
          },
          {
            id: 'cdn',
            type: 'component',
            label: 'CDN',
            description: 'Shared CDN - CloudFlare for all tenants',
            position: { x: 180, y: 250 },
            visible: true,
            icon: '🌐'
          },
          {
            id: 'llm-public',
            type: 'component',
            label: 'External LLM',
            description: 'External LLM providers - OpenAI, Anthropic, etc.',
            position: { x: 280, y: 80 },
            visible: true,
            icon: '🤖'
          },
          {
            id: 'airia-platform-na',
            type: 'component',
            label: 'Airia Platform (NA)',
            description: 'North America region - Airia AI platform orchestration layer',
            position: { x: 320, y: 250 },
            visible: true,
            icon: '✨'
          },
          {
            id: 'airia-platform-eu',
            type: 'component',
            label: 'Airia Platform (EU)',
            description: 'Europe region - Airia AI platform orchestration layer',
            position: { x: 320, y: 350 },
            visible: false,
            icon: '✨'
          },
          {
            id: 'airia-platform-apac',
            type: 'component',
            label: 'Airia Platform (APAC)',
            description: 'Asia-Pacific region (Singapore, Australia) - Airia AI platform orchestration layer',
            position: { x: 320, y: 450 },
            visible: false,
            icon: '✨'
          },
          {
            id: 'airia-platform-mena',
            type: 'component',
            label: 'Airia Platform (MENA)',
            description: 'Middle East & North Africa region - Airia AI platform orchestration layer',
            position: { x: 320, y: 550 },
            visible: false,
            icon: '✨'
          },
          {
            id: 'public-app-integrations',
            type: 'component',
            label: 'Public Application Integrations',
            description: 'Third-party SaaS integrations - Salesforce, Slack, etc.',
            position: { x: 280, y: 420 },
            visible: true,
            icon: '🔗'
          }
        ]
      },
      private: {
        xRange: [400, 750],
        components: [
          {
            id: 'airia-cloud-connector',
            type: 'component',
            label: 'Airia Cloud Connector',
            description: 'Connector for customer on-premises systems to Airia Cloud',
            position: { x: 480, y: 180 },
            visible: true,
            icon: '🔌'
          },
          {
            id: 'user-private',
            type: 'component',
            label: 'Internal Users',
            description: 'Internal admins and support staff',
            position: { x: 480, y: 480 },
            visible: true,
            icon: '👨‍💼'
          },
          {
            id: 'llm-private',
            type: 'component',
            label: 'Private LLM',
            description: 'Self-hosted LLM service for sensitive data',
            position: { x: 640, y: 220 },
            visible: true,
            icon: '🧠'
          },
          {
            id: 'customer-database',
            type: 'component',
            label: 'Database',
            description: 'Customer on-premises database',
            position: { x: 640, y: 340 },
            visible: true,
            icon: '🗄️'
          },
          {
            id: 'private-api',
            type: 'component',
            label: 'Private API',
            description: 'Customer private API endpoints',
            position: { x: 640, y: 460 },
            visible: true,
            icon: '🔐'
          }
        ]
      }
    },
    connections: [
      { id: 'e0', source: 'user-public', target: 'cdn', animated: false },
      { id: 'e0c', source: 'cdn', target: 'user-private', animated: false },
      { id: 'e0d', source: 'cdn', target: 'airia-cloud-connector', animated: false },
      { id: 'e0e', source: 'airia-cloud-connector', target: 'llm-private', animated: false },
      { id: 'e0f', source: 'airia-cloud-connector', target: 'customer-database', animated: false },
      { id: 'e0g', source: 'airia-cloud-connector', target: 'private-api', animated: false },

      // CDN to regional platforms
      { id: 'e1-na', source: 'cdn', target: 'airia-platform-na', animated: false },
      { id: 'e1-eu', source: 'cdn', target: 'airia-platform-eu', animated: false },
      { id: 'e1-apac', source: 'cdn', target: 'airia-platform-apac', animated: false },
      { id: 'e1-mena', source: 'cdn', target: 'airia-platform-mena', animated: false },

      // Regional platforms to LLM
      { id: 'e2-na', source: 'airia-platform-na', target: 'llm-public', animated: false },
      { id: 'e2-eu', source: 'airia-platform-eu', target: 'llm-public', animated: false },
      { id: 'e2-apac', source: 'airia-platform-apac', target: 'llm-public', animated: false },
      { id: 'e2-mena', source: 'airia-platform-mena', target: 'llm-public', animated: false },

      // Regional platforms to public integrations
      { id: 'e3-na', source: 'airia-platform-na', target: 'public-app-integrations', animated: false },
      { id: 'e3-eu', source: 'airia-platform-eu', target: 'public-app-integrations', animated: false },
      { id: 'e3-apac', source: 'airia-platform-apac', target: 'public-app-integrations', animated: false },
      { id: 'e3-mena', source: 'airia-platform-mena', target: 'public-app-integrations', animated: false },
    ]
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
        visible: true,
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
        visible: true,
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
    ]
  }
};

export const presetList = [
  { id: 'shared-saas', name: 'Shared SaaS', description: 'Multi-tenant, cost-optimized' },
  { id: 'dedicated-saas', name: 'Dedicated SaaS', description: 'Single-tenant, isolated resources' },
  { id: 'customer-hosted', name: 'Customer Hosted', description: 'On-premises, full control' }
];
