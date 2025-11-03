// Initial component definitions for system architecture diagram

export const initialComponents = [
  {
    id: 'cdn',
    type: 'component',
    label: 'CDN',
    description: 'Content Delivery Network - Distributes static assets globally for faster load times',
    position: { x: 100, y: 100 },
    visible: true,
    zone: 'public',
    icon: '🌐'
  },
  {
    id: 'loadbalancer',
    type: 'component',
    label: 'Load Balancer',
    description: 'Distributes incoming traffic across multiple application servers',
    position: { x: 100, y: 250 },
    visible: true,
    zone: 'public',
    icon: '⚖️'
  },
  {
    id: 'apigateway',
    type: 'component',
    label: 'API Gateway',
    description: 'Single entry point for API requests, handles routing and authentication',
    position: { x: 400, y: 150 },
    visible: true,
    zone: 'private',
    icon: '🚪'
  },
  {
    id: 'appserver1',
    type: 'component',
    label: 'App Server 1',
    description: 'Backend application server - Processes business logic and API requests',
    position: { x: 400, y: 300 },
    visible: true,
    zone: 'private',
    icon: '🖥️'
  },
  {
    id: 'appserver2',
    type: 'component',
    label: 'App Server 2',
    description: 'Backend application server - Processes business logic and API requests',
    position: { x: 550, y: 300 },
    visible: true,
    zone: 'private',
    icon: '🖥️'
  },
  {
    id: 'cache',
    type: 'component',
    label: 'Redis Cache',
    description: 'In-memory data store for caching frequently accessed data',
    position: { x: 700, y: 150 },
    visible: true,
    zone: 'private',
    icon: '💾'
  },
  {
    id: 'database-primary',
    type: 'component',
    label: 'Database (Primary)',
    description: 'Main database for read/write operations - PostgreSQL/MySQL',
    position: { x: 700, y: 300 },
    visible: true,
    zone: 'private',
    icon: '🗄️'
  },
  {
    id: 'database-replica',
    type: 'component',
    label: 'Database (Replica)',
    description: 'Read-only database replica for scaling read operations',
    position: { x: 850, y: 300 },
    visible: true,
    zone: 'private',
    icon: '🗄️'
  },
  {
    id: 'messagequeue',
    type: 'component',
    label: 'Message Queue',
    description: 'Asynchronous message processing - RabbitMQ/SQS/Kafka',
    position: { x: 700, y: 450 },
    visible: true,
    zone: 'private',
    icon: '📬'
  },
  {
    id: 'storage',
    type: 'component',
    label: 'Object Storage',
    description: 'S3/R2 storage for files, media, and static assets',
    position: { x: 400, y: 450 },
    visible: true,
    zone: 'private',
    icon: '📦'
  },
  {
    id: 'monitoring',
    type: 'component',
    label: 'Monitoring',
    description: 'Observability and logging infrastructure - Prometheus/Grafana/DataDog',
    position: { x: 850, y: 450 },
    visible: true,
    zone: 'private',
    icon: '📊'
  }
];

// Initial connections between components
export const initialConnections = [
  { id: 'e1', source: 'cdn', target: 'loadbalancer', animated: false },
  { id: 'e2', source: 'loadbalancer', target: 'apigateway', animated: false },
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
];
