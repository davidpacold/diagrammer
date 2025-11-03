// Deployment presets for different architecture scenarios

export const presets = {
  'shared-saas': {
    name: 'Shared SaaS',
    description: 'Multi-tenant shared infrastructure - Cost-optimized for multiple customers',
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
        position: { x: 400, y: 100 },
        visible: true,
        zone: 'private',
        icon: '👨‍💼'
      },
      {
        id: 'cdn',
        type: 'component',
        label: 'CDN',
        description: 'Shared CDN - CloudFlare for all tenants',
        position: { x: 100, y: 100 },
        visible: true,
        zone: 'public',
        icon: '🌐'
      },
      {
        id: 'llm-public',
        type: 'component',
        label: 'External LLM',
        description: 'External LLM providers - OpenAI, Anthropic, etc.',
        position: { x: 100, y: 350 },
        visible: true,
        zone: 'public',
        icon: '🤖'
      },
      {
        id: 'airia-platform',
        type: 'component',
        label: 'Airia Platform',
        description: 'Airia AI platform orchestration layer',
        position: { x: 250, y: 200 },
        visible: true,
        zone: 'public',
        icon: '✨'
      },
      {
        id: 'loadbalancer',
        type: 'component',
        label: 'Shared Load Balancer',
        description: 'Single load balancer serving all tenants',
        position: { x: 100, y: 250 },
        visible: false,
        zone: 'public',
        icon: '⚖️'
      },
      {
        id: 'apigateway',
        type: 'component',
        label: 'API Gateway',
        description: 'Shared API Gateway with tenant routing',
        position: { x: 400, y: 175 },
        visible: false,
        zone: 'private',
        icon: '🚪'
      },
      {
        id: 'appserver',
        type: 'component',
        label: 'App Server Pool',
        description: 'Shared application servers handling all tenant requests',
        position: { x: 550, y: 250 },
        visible: false,
        zone: 'private',
        icon: '🖥️'
      },
      {
        id: 'cache',
        type: 'component',
        label: 'Shared Redis',
        description: 'Multi-tenant cache with namespace isolation',
        position: { x: 700, y: 150 },
        visible: false,
        zone: 'private',
        icon: '💾'
      },
      {
        id: 'database-primary',
        type: 'component',
        label: 'Shared Database',
        description: 'Multi-tenant database with row-level security',
        position: { x: 700, y: 300 },
        visible: false,
        zone: 'private',
        icon: '🗄️'
      },
      {
        id: 'messagequeue',
        type: 'component',
        label: 'Shared Queue',
        description: 'Multi-tenant message queue',
        position: { x: 700, y: 450 },
        visible: false,
        zone: 'private',
        icon: '📬'
      },
      {
        id: 'storage',
        type: 'component',
        label: 'Shared Storage',
        description: 'S3/R2 with bucket-level tenant isolation',
        position: { x: 550, y: 450 },
        visible: false,
        zone: 'private',
        icon: '📦'
      },
      {
        id: 'llm-private',
        type: 'component',
        label: 'Private LLM',
        description: 'Self-hosted LLM service for sensitive data',
        position: { x: 550, y: 350 },
        visible: false,
        zone: 'private',
        icon: '🧠'
      }
    ],
    connections: [
      { id: 'e0', source: 'user-public', target: 'cdn', animated: false },
      { id: 'e0b', source: 'llm-public', target: 'airia-platform', animated: false },
      { id: 'e1', source: 'cdn', target: 'airia-platform', animated: false },
      { id: 'e1b', source: 'cdn', target: 'loadbalancer', animated: false },
      { id: 'e2', source: 'loadbalancer', target: 'apigateway', animated: false },
      { id: 'e2b', source: 'user-private', target: 'apigateway', animated: false },
      { id: 'e3', source: 'apigateway', target: 'appserver', animated: false },
      { id: 'e4', source: 'appserver', target: 'cache', animated: false },
      { id: 'e5', source: 'appserver', target: 'database-primary', animated: false },
      { id: 'e6', source: 'appserver', target: 'messagequeue', animated: false },
      { id: 'e7', source: 'appserver', target: 'storage', animated: false },
      { id: 'e8', source: 'appserver', target: 'llm-public', animated: false },
      { id: 'e9', source: 'appserver', target: 'llm-private', animated: false }
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
