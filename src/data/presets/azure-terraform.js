// Azure Terraform deployment preset - Real-world Azure infrastructure managed by Terraform
// Based on the airia-on-azure Terraform module
//
// Layout: 3 subnet boundaries inside the VNet (private zone)
//   - AppGW Subnet (10.0.3.0/24): Application Gateway + NSG
//   - AKS Subnet (10.0.0.0/23): AKS cluster, node pools, NGINX, NSG
//   - PE Subnet (10.0.2.0/24): Private Endpoints
//   - PaaS services below (no subnet - accessed via PE)

export const azureTerraform = {
  name: 'Azure Terraform',
  description: 'Real-world Azure deployment managed by Terraform - AKS, PostgreSQL, OpenAI, and AI services',
  zoneLabels: {
    left: 'Internet / Public',
    right: 'Azure Subscription / VNet (10.0.0.0/22)',
  },
  zoneDefinitions: {
    public: {
      x: -5000,
      y: -5000,
      width: 5550,
      height: 10000,
      backgroundColor: '#dbeafe',
      opacity: 0.3,
      regions: {
        external: { x: 20, y: 40, width: 200 },
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
        vnet: { x: 575, y: 20, width: 900 },
      }
    }
  },
  zones: {
    public: {
      xRange: [0, 525],
      components: [
        {
          id: 'end-users',
          type: 'component',
          label: 'End Users',
          description: 'External users accessing the platform via HTTPS',
          position: { x: 20, y: 80 },
          visible: true,
          icon: 'users',
          zone: 'public',
          badgeLabel: 'External',
          badgeColor: 'green'
        },
        {
          id: 'public-ip',
          type: 'component',
          label: 'Public IP',
          description: 'Azure Public IP address (Standard SKU, Static) assigned to the Application Gateway for internet-facing traffic.',
          position: { x: 20, y: 230 },
          visible: true,
          icon: 'globe',
          zone: 'public',
          badgeLabel: 'External',
          badgeColor: 'green'
        },
      ]
    },
    private: {
      xRange: [575, 1500],
      components: [
        // ═══ AppGW Subnet (10.0.3.0/24) - 256 IPs, 251 usable ═══
        {
          id: 'appgw-nsg',
          type: 'component',
          label: 'AppGW NSG',
          description: 'Application Gateway NSG - Inbound: Allow HTTP (:80) and HTTPS (:443) from Internet, Gateway Manager (65200-65535) for v2 health probes, Azure Load Balancer probes',
          position: { x: 30, y: 30 },
          visible: true,
          icon: 'shield',
          zone: 'private',
          parentBoundary: 'appgw-subnet',
          badgeLabel: 'AppGW Subnet',
          badgeColor: 'indigo'
        },
        {
          id: 'appgw',
          type: 'component',
          label: 'Application Gateway',
          description: 'Azure Application Gateway (Standard_v2) - L7 load balancer with SSL termination and health probes. Public IP with HTTP/HTTPS listeners. Backend pool targets NGINX internal IP (10.0.1.250).',
          position: { x: 30, y: 180 },
          visible: true,
          icon: 'door',
          zone: 'private',
          parentBoundary: 'appgw-subnet',
          badgeLabel: 'AppGW Subnet',
          badgeColor: 'indigo'
        },

        // ═══ AKS Subnet (10.0.0.0/23) - 512 IPs, 507 usable ═══
        {
          id: 'aks-nsg',
          type: 'component',
          label: 'AKS NSG',
          description: 'AKS subnet NSG - Inbound: Allow HTTP/HTTPS from AppGW subnet, Load Balancer (:6390), Traffic Manager (:443). Outbound: Allow to PostgreSQL (:5432), Cosmos DB (:10350), AI services (:443), ML workspace (:443)',
          position: { x: 30, y: 30 },
          visible: true,
          icon: 'shield',
          zone: 'private',
          parentBoundary: 'aks-subnet',
          badgeLabel: 'AKS Subnet',
          badgeColor: 'blue'
        },
        {
          id: 'nginx-ingress',
          type: 'component',
          label: 'NGINX Ingress',
          description: 'NGINX Ingress Controller - Internal LoadBalancer (10.0.1.250) routing traffic from Application Gateway to AKS services',
          position: { x: 250, y: 30 },
          visible: true,
          icon: 'network',
          zone: 'private',
          parentBoundary: 'aks-subnet',
          badgeLabel: 'AKS Subnet',
          badgeColor: 'blue'
        },
        {
          id: 'aks-cluster',
          type: 'component',
          label: 'AKS Cluster',
          description: 'Azure Kubernetes Service (v1.34) - Azure CNI networking, RBAC enabled, SystemAssigned identity with Network Contributor and Storage Blob Data Contributor roles',
          position: { x: 140, y: 180 },
          visible: true,
          icon: 'server',
          zone: 'private',
          parentBoundary: 'aks-subnet',
          badgeLabel: 'AKS Subnet',
          badgeColor: 'blue'
        },
        {
          id: 'default-pool',
          type: 'component',
          label: 'CPU Node Pool',
          description: 'AKS default node pool: Standard_E4as_v5, 2-6 nodes (autoscale), zones 1+2, 75 max pods, 33% max surge. Up to ~456 IPs with Azure CNI.',
          position: { x: 30, y: 330 },
          visible: true,
          icon: 'server',
          zone: 'private',
          parentBoundary: 'aks-subnet',
          badgeLabel: 'AKS Subnet',
          badgeColor: 'blue'
        },
        {
          id: 'gpu-pool',
          type: 'component',
          label: 'GPU Node Pool',
          description: 'AKS GPU node pool: Standard_NC4as_T4_v3 (4 vCPU, 28GB RAM, 1x NVIDIA T4 16GB), scale from 0, gpu=true:NoSchedule taint, 200GB managed OS disk, 30 max pods.',
          position: { x: 250, y: 330 },
          visible: true,
          icon: 'cpu',
          zone: 'private',
          parentBoundary: 'aks-subnet',
          badgeLabel: 'AKS Subnet',
          badgeColor: 'blue'
        },

        // ═══ Private Endpoints Subnet (10.0.2.0/24) - 256 IPs, 251 usable ═══
        // Contains: PE hub + all services accessed via private endpoints
        {
          id: 'private-endpoints',
          type: 'component',
          label: 'Private Endpoints',
          description: 'Private Endpoints Subnet (10.0.2.0/24) - 6 private endpoints providing secure connectivity. Each gets a private IP + DNS zone.',
          position: { x: 250, y: 30 },
          visible: true,
          icon: 'link',
          zone: 'private',
          parentBoundary: 'pe-subnet',
          badgeLabel: 'PE Subnet',
          badgeColor: 'purple'
        },
        {
          id: 'postgresql',
          type: 'component',
          label: 'PostgreSQL',
          description: 'Azure PostgreSQL Flexible Server (v16) - GP_Standard_D4s_v3, 64GB storage, 15 databases (identity, platform, rag, etc.), extensions: TimescaleDB, pgvector, PostGIS, AGE. Private endpoint only.',
          position: { x: 30, y: 180 },
          visible: true,
          icon: 'database',
          zone: 'private',
          parentBoundary: 'pe-subnet',
          badgeLabel: 'PE Endpoint',
          badgeColor: 'purple'
        },
        {
          id: 'blob-storage',
          type: 'component',
          label: 'Blob Storage',
          description: 'Azure Storage Account (StorageV2, LRS) - Private endpoint only, TLS 1.2, deny public access, AzureServices bypass. Containers for application data.',
          position: { x: 250, y: 180 },
          visible: true,
          icon: 'box',
          zone: 'private',
          parentBoundary: 'pe-subnet',
          badgeLabel: 'PE Endpoint',
          badgeColor: 'purple'
        },
        {
          id: 'azure-openai',
          type: 'component',
          label: 'Azure OpenAI',
          description: 'Azure OpenAI Service (S0) - Deployments: GPT-4.1 mini, GPT-4.1, text-embedding-3-large. Private endpoint, VNet-integrated with AKS subnet ACL.',
          position: { x: 470, y: 180 },
          visible: true,
          icon: 'cpu',
          zone: 'private',
          parentBoundary: 'pe-subnet',
          badgeLabel: 'PE Endpoint',
          badgeColor: 'purple'
        },
        {
          id: 'doc-intelligence',
          type: 'component',
          label: 'Document Intelligence',
          description: 'Azure Document Intelligence (Form Recognizer, S0) - Document parsing and extraction service. Private endpoint, deny public network access.',
          position: { x: 30, y: 330 },
          visible: true,
          icon: 'eye',
          zone: 'private',
          parentBoundary: 'pe-subnet',
          badgeLabel: 'PE Endpoint',
          badgeColor: 'purple'
        },
        {
          id: 'ml-workspace',
          type: 'component',
          label: 'Azure ML Workspace',
          description: 'Azure Machine Learning workspace for serverless endpoints (e.g., Llama models). Includes Key Vault, Storage Account, Container Registry, Application Insights. Private endpoint.',
          position: { x: 250, y: 330 },
          visible: true,
          icon: 'layers',
          zone: 'private',
          parentBoundary: 'pe-subnet',
          badgeLabel: 'PE Endpoint',
          badgeColor: 'purple'
        },
        {
          id: 'cosmos-cassandra',
          type: 'component',
          label: 'Cosmos DB (Cassandra)',
          description: 'Azure Cosmos DB with Cassandra API - Serverless mode (4000 RU/s limit), Session consistency, automatic failover, private endpoint. Optional deployment.',
          position: { x: 470, y: 330 },
          visible: false,
          icon: 'database',
          zone: 'private',
          parentBoundary: 'pe-subnet',
          badgeLabel: 'PE Endpoint',
          badgeColor: 'purple'
        },
        {
          id: 'private-dns',
          type: 'component',
          label: 'Private DNS Zones',
          description: 'Azure Private DNS Zones linked to VNet: privatelink.postgres.database.azure.com, privatelink.blob.core.windows.net, privatelink.openai.azure.com, privatelink.cognitiveservices.azure.com, privatelink.api.azureml.ms, privatelink.cassandra.cosmos.azure.com',
          position: { x: 30, y: 480 },
          visible: false,
          icon: 'globe',
          zone: 'private',
          parentBoundary: 'pe-subnet',
          badgeLabel: 'PE Subnet',
          badgeColor: 'purple'
        },
        {
          id: 'key-vault',
          type: 'component',
          label: 'Key Vault',
          description: 'Azure Key Vault - Optional secret storage for OpenAI keys, Cosmos DB keys, and Document Intelligence keys. RBAC-authorized, soft delete enabled.',
          position: { x: 250, y: 480 },
          visible: false,
          icon: 'key',
          zone: 'private',
          parentBoundary: 'pe-subnet',
          badgeLabel: 'PE Subnet',
          badgeColor: 'purple'
        },
      ]
    }
  },
  connections: [
    // === Inbound: End Users -> AppGW NSG -> Application Gateway ===
    { id: 'e-users-pip', source: 'end-users', target: 'public-ip', label: 'HTTPS', edgeColor: 'customer', animated: false },
    { id: 'e-pip-nsg', source: 'public-ip', target: 'appgw-nsg', label: ':443', edgeColor: 'customer', animated: false },
    { id: 'e-nsg-appgw', source: 'appgw-nsg', target: 'appgw', label: ':80/:443', edgeColor: 'customer', animated: false },

    // === AppGW -> AKS NSG -> NGINX Ingress ===
    { id: 'e-appgw-aksnsg', source: 'appgw', target: 'aks-nsg', label: 'HTTP/S', edgeColor: 'managed', animated: false },
    { id: 'e-aksnsg-nginx', source: 'aks-nsg', target: 'nginx-ingress', label: ':80/:443', edgeColor: 'managed', animated: false },

    // === NGINX -> AKS Cluster -> Node Pools ===
    { id: 'e-nginx-aks', source: 'nginx-ingress', target: 'aks-cluster', edgeColor: 'managed', animated: false },
    { id: 'e-aks-default', source: 'aks-cluster', target: 'default-pool', edgeColor: 'managed', animated: false },
    { id: 'e-aks-gpu', source: 'aks-cluster', target: 'gpu-pool', edgeColor: 'managed', animated: false },

    // === AKS Cluster outbound -> AKS NSG -> Private Endpoints ===
    { id: 'e-aks-nsg-out', source: 'aks-cluster', target: 'aks-nsg', lineStyle: 'dashed', edgeColor: 'managed', animated: false },
    { id: 'e-nsg-pe', source: 'aks-nsg', target: 'private-endpoints', edgeColor: 'managed', animated: false },

    // === Private Endpoints -> Data & AI Services ===
    { id: 'e-pe-pg', source: 'private-endpoints', target: 'postgresql', label: ':5432', edgeColor: 'managed', animated: false },
    { id: 'e-pe-blob', source: 'private-endpoints', target: 'blob-storage', edgeColor: 'managed', animated: false },
    { id: 'e-pe-openai', source: 'private-endpoints', target: 'azure-openai', label: ':443', edgeColor: 'managed', animated: false },
    { id: 'e-pe-cosmos', source: 'private-endpoints', target: 'cosmos-cassandra', label: ':10350', edgeColor: 'managed', animated: false },
    { id: 'e-pe-docint', source: 'private-endpoints', target: 'doc-intelligence', label: ':443', edgeColor: 'managed', animated: false },
    { id: 'e-pe-ml', source: 'private-endpoints', target: 'ml-workspace', label: ':443', edgeColor: 'managed', animated: false },

    // Private DNS resolves endpoints
    { id: 'e-dns-pg', source: 'private-dns', target: 'postgresql', lineStyle: 'dashed', edgeColor: 'external', animated: false },
    { id: 'e-dns-blob', source: 'private-dns', target: 'blob-storage', lineStyle: 'dashed', edgeColor: 'external', animated: false },
    { id: 'e-dns-openai', source: 'private-dns', target: 'azure-openai', lineStyle: 'dashed', edgeColor: 'external', animated: false },
    { id: 'e-dns-cosmos', source: 'private-dns', target: 'cosmos-cassandra', lineStyle: 'dashed', edgeColor: 'external', animated: false },
    { id: 'e-dns-docint', source: 'private-dns', target: 'doc-intelligence', lineStyle: 'dashed', edgeColor: 'external', animated: false },
    { id: 'e-dns-ml', source: 'private-dns', target: 'ml-workspace', lineStyle: 'dashed', edgeColor: 'external', animated: false },

    // Key Vault stores secrets
    { id: 'e-kv-openai', source: 'key-vault', target: 'azure-openai', lineStyle: 'dashed', edgeColor: 'byok', animated: false },
    { id: 'e-kv-cosmos', source: 'key-vault', target: 'cosmos-cassandra', lineStyle: 'dashed', edgeColor: 'byok', animated: false },
    { id: 'e-kv-docint', source: 'key-vault', target: 'doc-intelligence', lineStyle: 'dashed', edgeColor: 'byok', animated: false },
  ],
  boundaryBoxes: [
    {
      id: 'vnet',
      label: 'Virtual Network (10.0.0.0/22)',
      x: 545,
      y: -30,
      width: 830,
      height: 1050,
      padding: 20,
      color: '#6b7280',
      badgeLabel: '1024 IPs',
      badgeColor: 'blue',
      zone: 'private',
      containmentRules: {
        description: 'Azure Virtual Network containing all subnets',
        mustContain: ['appgw-subnet', 'aks-subnet', 'pe-subnet'],
        mustExclude: [],
        rule: 'VNet 10.0.0.0/22 spans 1024 IPs, divided into 3 subnets: AppGW, AKS, and Private Endpoints.'
      }
    },
    {
      id: 'appgw-subnet',
      label: 'AppGW Subnet (10.0.3.0/24)',
      x: 575,
      y: 20,
      width: 240,
      height: 200,
      padding: 30,
      color: '#059669',
      badgeLabel: '10.0.3.0/24',
      badgeColor: 'indigo',
      zone: 'private',
      containmentRules: {
        description: 'Application Gateway dedicated subnet',
        mustContain: ['appgw-nsg', 'appgw'],
        mustExclude: [],
        rule: 'Application Gateway v2 requires a dedicated subnet. NSG controls inbound internet traffic.'
      }
    },
    {
      id: 'aks-subnet',
      label: 'AKS Subnet (10.0.0.0/23)',
      x: 855,
      y: 20,
      width: 460,
      height: 200,
      padding: 30,
      color: '#0078d4',
      badgeLabel: '10.0.0.0/23',
      badgeColor: 'indigo',
      zone: 'private',
      containmentRules: {
        description: 'AKS cluster subnet with Azure CNI - each pod gets a real IP',
        mustContain: ['aks-nsg', 'nginx-ingress', 'aks-cluster', 'default-pool', 'gpu-pool'],
        mustExclude: [],
        rule: 'Azure CNI assigns IPs from this subnet to every pod. Default pool: up to 6 nodes x 75 pods = 456 IPs. GPU pool: up to 5 nodes x 30 pods = 155 IPs.'
      }
    },
    {
      id: 'pe-subnet',
      label: 'Private Endpoints Subnet (10.0.2.0/24)',
      x: 575,
      y: 510,
      width: 680,
      height: 200,
      padding: 30,
      color: '#7c3aed',
      badgeLabel: '10.0.2.0/24',
      badgeColor: 'indigo',
      zone: 'private',
      containmentRules: {
        description: 'Private Endpoints subnet - each PaaS service gets a private IP here',
        mustContain: ['private-endpoints', 'postgresql', 'blob-storage', 'azure-openai', 'doc-intelligence', 'ml-workspace', 'cosmos-cassandra', 'private-dns', 'key-vault'],
        mustExclude: [],
        rule: 'Private Link endpoints for PostgreSQL, Blob, OpenAI, Cosmos DB, Document Intelligence, and ML Workspace. Currently ~6 IPs used.'
      }
    },
  ],
  columnHeaders: [],
  scenes: [
    {
      title: 'Internet Entry Point',
      description: 'End users connect via HTTPS. Traffic enters the AppGW Subnet (10.0.3.0/24) through the AppGW NSG, which allows ports 80/443 from the internet.',
      visible: ['end-users', 'public-ip', 'appgw-nsg', 'appgw'],
      select: 'appgw',
    },
    {
      title: 'Ingress & Networking',
      description: 'Application Gateway routes to the AKS Subnet (10.0.0.0/23). The AKS NSG allows inbound HTTP/HTTPS only from the AppGW subnet. NGINX Ingress receives traffic on internal IP 10.0.1.250.',
      visible: ['end-users', 'public-ip', 'appgw-nsg', 'appgw', 'aks-nsg', 'nginx-ingress'],
      select: 'aks-nsg',
    },
    {
      title: 'AKS Compute Layer',
      description: 'AKS cluster with Azure CNI networking runs two node pools in the same subnet. CPU pool (2-6 E4as_v5 nodes, 75 pods each) and GPU pool (NC4as_T4_v3, NVIDIA T4, scale-from-zero).',
      visible: ['end-users', 'public-ip', 'appgw-nsg', 'appgw', 'aks-nsg', 'nginx-ingress', 'aks-cluster', 'default-pool', 'gpu-pool'],
      select: 'aks-cluster',
    },
    {
      title: 'Private Endpoints',
      description: 'Outbound traffic from node pools passes through the AKS NSG to the PE Subnet (10.0.2.0/24). Each Azure PaaS service has a dedicated private endpoint with a private IP and DNS zone.',
      visible: ['end-users', 'public-ip', 'appgw-nsg', 'appgw', 'aks-nsg', 'nginx-ingress', 'aks-cluster', 'default-pool', 'gpu-pool', 'private-endpoints'],
      select: 'private-endpoints',
    },
    {
      title: 'Data & AI Services',
      description: 'Private endpoints connect to Azure PaaS services: PostgreSQL (15 databases, pgvector), Blob Storage, Azure OpenAI (GPT-4.1, embeddings), Document Intelligence, and ML Workspace. All deny public network access.',
      visible: ['end-users', 'public-ip', 'appgw-nsg', 'appgw', 'aks-nsg', 'nginx-ingress', 'aks-cluster', 'default-pool', 'gpu-pool', 'private-endpoints', 'postgresql', 'blob-storage', 'azure-openai', 'doc-intelligence', 'ml-workspace'],
      select: 'azure-openai',
    },
    {
      title: 'Full Infrastructure',
      description: 'Complete Terraform-managed Azure infrastructure: 3 subnets within VNet 10.0.0.0/22, AKS with CPU and GPU pools, 6 private endpoints, PostgreSQL, Blob Storage, OpenAI, Document Intelligence, ML Workspace, Cosmos DB (optional), Private DNS zones, and Key Vault.',
      visible: ['end-users', 'public-ip', 'appgw-nsg', 'appgw', 'aks-nsg', 'nginx-ingress', 'aks-cluster', 'default-pool', 'gpu-pool', 'private-endpoints', 'postgresql', 'blob-storage', 'azure-openai', 'cosmos-cassandra', 'doc-intelligence', 'ml-workspace', 'private-dns', 'key-vault'],
      select: null,
    },
  ],
};
