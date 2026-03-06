# Airia on Azure Terraform Module

This Terraform module deploys the Airia platform on Microsoft Azure, providing a complete infrastructure setup including Azure Kubernetes Service (AKS), PostgreSQL Flexible Server, and supporting network resources.

> **Note**: This module is designed for POC environments, testing, and as a reference architecture. For production deployments, review and adapt the configuration to meet your specific requirements.

## Architecture Overview

The module creates:
- **Resource Group**: Primary container for all resources
- **Virtual Network**: Isolated network environment with dedicated subnets
- **AKS Cluster**: Managed Kubernetes cluster with configurable node pools
- **PostgreSQL Flexible Server**: Managed database with private connectivity
- **Static Public IP**: For ingress traffic routing
- **Network Security Groups**: Traffic control and security rules
- **Private DNS Zone**: For internal service discovery

## Features

- 🚀 **Production-ready AKS cluster** with auto-scaling capabilities
- 🔒 **Private PostgreSQL** with network isolation and custom extensions
- 🌐 **Secure networking** with dedicated subnets and NSG rules
- ⚡ **Flexible configuration** for different environments
- 📊 **Multiple databases** support with pre-configured extensions
- 🔧 **Additional node pools** for workload separation

## Quick Start

```hcl
module "airia_azure" {
  source = "./modules/airia-on-azure"

  subscription_id     = "your-subscription-id"
  resource_prefix     = "airia"
  environment        = "prod"
  location           = "eastus"
  
  postgresql_admin_password = var.postgresql_password
}
```

## Requirements

| Name | Version |
|------|---------|
| terraform | >= 1.12 |
| azurerm | ~> 4.35 |

## Providers

| Name | Version |
|------|---------|
| azurerm | ~> 4.35 |

## Resources Created

### Core Infrastructure
- `azurerm_resource_group.this` - Main resource group
- `azurerm_virtual_network.this` - Virtual network with configurable address space
- `azurerm_subnet.aks` - Dedicated subnet for AKS cluster
- `azurerm_subnet.private_endpoints` - Dedicated subnet for private endpoints

### Kubernetes Infrastructure
- `azurerm_kubernetes_cluster.this` - AKS cluster with RBAC enabled
- `azurerm_kubernetes_cluster_node_pool.additional` - Additional node pools (optional)
- `azurerm_public_ip.static` - Static public IP for ingress

### Database Infrastructure
- `azurerm_postgresql_flexible_server.this` - PostgreSQL Flexible Server
- `azurerm_postgresql_flexible_server_database.databases` - Individual databases
- `azurerm_private_endpoint.postgresql` - Private endpoint for database access
- `azurerm_private_dns_zone.postgresql` - Private DNS zone for PostgreSQL

### Application Gateway
- `azurerm_subnet.appgw` - Dedicated subnet for Application Gateway
- `azurerm_public_ip.appgw` - Public IP for Application Gateway
- `azurerm_application_gateway.this` - Application Gateway with SSL offload and HTTP-to-HTTPS redirect

### Azure AI & ML Services
- `azurerm_cognitive_account.openai` - Azure OpenAI with GPT-4.1 Mini, GPT-4.1, and text-embedding models (optional)
- `azurerm_cognitive_account.document_intelligence` - Azure Document Intelligence (optional)
- `azurerm_machine_learning_workspace.this` - Azure ML Workspace with Key Vault, Storage, App Insights, Container Registry (optional)

### Storage
- `azurerm_storage_account.this` - Storage account for platform data
- `azurerm_storage_container.containers` - Configurable storage containers

### Cosmos DB (Optional)
- `azurerm_cosmosdb_account.cassandra` - Cosmos DB with Cassandra API (disabled by default)

### Security & Networking
- `azurerm_network_security_group.this` - AKS subnet NSG
- `azurerm_network_security_group.appgw` - Application Gateway subnet NSG
- Multiple `azurerm_network_security_rule.*` - Layered security rules for AKS and AppGW subnets
- `azurerm_role_assignment.*` - RBAC assignments (AKS identity scoped to VNet)

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| subscription_id | Azure subscription ID where resources will be deployed | `string` | n/a | yes |
| resource_prefix | Prefix to use for resource naming (e.g. application name) | `string` | n/a | yes |
| postgresql_admin_password | Administrator password for PostgreSQL server | `string` | n/a | yes |
| environment | Deployment environment (e.g. dev, test, prod) | `string` | `"dev"` | no |
| location | Azure region where resources will be deployed | `string` | `"eastus"` | no |
| vnet_address_space | Address space for the virtual network | `string` | `"10.0.0.0/22"` | no |
| aks_subnet_address_prefix | Address prefix for the AKS subnet | `string` | `"10.0.0.0/23"` | no |
| private_endpoints_subnet_address_prefix | Address prefix for the private endpoints subnet (PostgreSQL, Storage, OpenAI, Cosmos DB, Document Intelligence, ML Workspace) | `string` | `"10.0.2.0/24"` | no |
| appgw_subnet_address_prefix | Address prefix for the Application Gateway subnet | `string` | `"10.0.3.0/24"` | no |
| kubernetes_version | Version of Kubernetes to use for the AKS cluster | `string` | `"1.34"` | no |
| aks_dns_service_ip | IP address within the service CIDR for cluster service discovery | `string` | `"10.100.0.10"` | no |
| aks_service_cidr | The Network Range used by the Kubernetes service | `string` | `"10.100.0.0/16"` | no |

### AKS Configuration

| Name | Description | Type | Default |
|------|-------------|------|---------|
| default_node_pool | Configuration for the default node pool | `object` | See below |
| additional_node_pools | Map of additional node pools to create | `map(object)` | `{}` |

#### Default Node Pool Configuration
```hcl
default_node_pool = {
  temporary_name_for_rotation = "temprotation"
  name                        = "default"
  node_count                  = 3
  auto_scaling_enabled        = true
  min_count                   = 2
  max_count                   = 6
  vm_size                     = "Standard_D2s_v3"
  zones                       = ["1", "2"]
  max_pods                    = 75
  max_surge                   = "33%"
}
```

### PostgreSQL Configuration

| Name | Description | Type | Default |
|------|-------------|------|---------|
| postgresql_version | Version of PostgreSQL to use | `string` | `"16"` |
| postgresql_admin_username | Administrator username for PostgreSQL server | `string` | `"airiaadmin"` |
| postgresql_sku_name | SKU name for the PostgreSQL server | `string` | `"GP_Standard_D2s_v3"` |
| postgresql_storage_mb | Storage size in MB for PostgreSQL server | `number` | `65536` |
| postgresql_backup_retention_days | Backup retention period in days | `number` | `7` |
| postgresql_geo_redundant_backup_enabled | Enable geo-redundant backup | `bool` | `false` |
| postgresql_auto_grow_enabled | Enable auto-grow storage | `bool` | `true` |
| postgresql_database_names | List of database names to create | `list(string)` | See below |
| postgresql_extensions | List of PostgreSQL extensions to enable | `list(string)` | See below |

#### Default Databases (15)
```hcl
["auditlog", "conversations", "dataingest", "datastore", "identity", "keycloak", "marketplace", "mcpgateway", "metrics", "platform", "policyengine", "rag", "scheduler", "sectoolkit", "usercredentialstore"]
```

#### Default PostgreSQL Extensions
```hcl
["TIMESCALEDB", "VECTOR", "PGCRYPTO", "UUID-OSSP", "POSTGIS", "PG_TRGM", "FUZZYSTRMATCH", "AGE", "UNACCENT"]
```

## Outputs

### Resource Group
| Name | Description |
|------|-------------|
| resource_group_name | Name of the resource group |
| resource_group_id | ID of the resource group |

### Networking
| Name | Description |
|------|-------------|
| vnet_id | ID of the virtual network |
| vnet_name | Name of the virtual network |
| aks_subnet_id | ID of the AKS subnet |
| private_endpoints_subnet_id | ID of the private endpoints subnet |
| static_ip_address | The static public IP address |
| static_ip_id | ID of the static public IP |

### AKS Cluster
| Name | Description |
|------|-------------|
| aks_cluster_id | ID of the AKS cluster |
| aks_cluster_name | Name of the AKS cluster |
| aks_cluster_fqdn | FQDN of the AKS cluster |
| aks_cluster_kube_config | Kubernetes config for the AKS cluster (sensitive) |
| aks_cluster_identity | AKS cluster identity information |
| aks_node_resource_group | Name of the AKS node resource group |
| additional_node_pools | Information about additional node pools |

### PostgreSQL
| Name | Description |
|------|-------------|
| postgresql_server_id | ID of the PostgreSQL server |
| postgresql_server_name | Name of the PostgreSQL server |
| postgresql_server_fqdn | FQDN of the PostgreSQL server |
| postgresql_admin_username | Administrator username for PostgreSQL server |
| postgresql_database_names | List of created database names |
| postgresql_private_endpoint_ip | Private IP address of the PostgreSQL private endpoint |
| private_dns_zone_id | ID of the private DNS zone |

## Usage Examples

### Basic Deployment
```hcl
module "airia_prod" {
  source = "./modules/airia-on-azure"

  subscription_id           = "12345678-1234-1234-1234-123456789012"
  resource_prefix          = "airia"
  environment             = "prod"
  location                = "eastus"
  postgresql_admin_password = var.postgresql_password
}
```

### Development Environment with Custom Configuration
```hcl
module "airia_dev" {
  source = "./modules/airia-on-azure"

  subscription_id     = "12345678-1234-1234-1234-123456789012"
  resource_prefix     = "airia"
  environment        = "dev"
  location           = "westus2"
  
  # Smaller development configuration
  default_node_pool = {
    node_count           = 2
    auto_scaling_enabled = true
    min_count           = 1
    max_count           = 3
    vm_size             = "Standard_B2s"
  }
  
  postgresql_sku_name = "B_Standard_B1ms"
  postgresql_storage_mb = 32768
  
  postgresql_admin_password = var.postgresql_password
}
```

### Production with Additional Node Pools
```hcl
module "airia_prod" {
  source = "./modules/airia-on-azure"

  subscription_id     = "12345678-1234-1234-1234-123456789012"
  resource_prefix     = "airia"
  environment        = "prod"
  location           = "eastus"
  
  additional_node_pools = {
    compute_intensive = {
      name                 = "compute"
      vm_size              = "Standard_F8s_v2"
      auto_scaling_enabled = true
      min_count            = 1
      max_count            = 10
      node_taints          = ["workload=compute:NoSchedule"]
      node_labels          = {
        "workload" = "compute"
      }
    }
    memory_optimized = {
      name                 = "memory"
      vm_size              = "Standard_E4s_v3"
      auto_scaling_enabled = true
      min_count            = 1
      max_count            = 5
      node_taints          = ["workload=memory:NoSchedule"]
      node_labels          = {
        "workload" = "memory"
      }
    }
  }
  
  postgresql_admin_password = var.postgresql_password
}
```

## Network Security

The module creates two Network Security Groups with layered rules:

### Application Gateway NSG
- **Port 80/443**: Allowed from Internet (public web traffic)
- **Port 65200-65535**: Allowed from GatewayManager (required for AppGW v2 health probes)
- **All ports**: Allowed from AzureLoadBalancer (health probes)

### AKS Subnet NSG
- **Port 80/443**: Allowed from Application Gateway subnet only (not directly from Internet)
- **Port 6390**: Allowed from AzureLoadBalancer
- **Port 443**: Allowed from AzureTrafficManager
- **Outbound rules**: AKS to PostgreSQL (5432), Cosmos DB (10350), AI Services (443), ML Workspace (443)

## Database Configuration

The PostgreSQL server is configured with:
- Private network access only (no public access)
- Private endpoint for secure connectivity from AKS
- Multiple pre-configured databases for different Airia services
- Essential extensions for time-series data, vector operations, and graph processing
- Automated backups with configurable retention

## Security Best Practices

- ✅ PostgreSQL server has public network access disabled
- ✅ All traffic routed through private endpoints
- ✅ Dedicated NSGs for both AKS and Application Gateway subnets
- ✅ AKS subnet only accepts traffic from Application Gateway subnet (not directly from Internet)
- ✅ AKS identity scoped to VNet (not entire resource group)
- ✅ HTTP-to-HTTPS redirect when SSL certificate is configured
- ✅ RBAC enabled on AKS cluster
- ✅ Managed identities used for Azure resource access
- ✅ Sensitive outputs marked as sensitive
- ✅ Secrets should be set via environment variables (`TF_VAR_*`), not hardcoded in tfvars

## Troubleshooting

### Common Issues

1. **AKS cluster creation fails**: Ensure the subscription has sufficient quota for the requested VM sizes and regions
2. **PostgreSQL connection issues**: Verify the private endpoint is properly configured and DNS resolution is working
3. **Network connectivity problems**: Check NSG rules and subnet configurations
4. **Permission errors**: Ensure the Terraform execution context has appropriate Azure permissions

### Required Azure Permissions

The executing principal needs these permissions:
- `Contributor` role on the target subscription or resource group
- `Network Contributor` for VNet and subnet operations
- `Kubernetes Service Cluster Admin Role` for AKS management

## Contributing

When modifying this module:
1. Update variable descriptions and validation rules
2. Add new outputs for any new resources
3. Update this README with new configuration options
4. Test with multiple environments (dev, staging, prod)

## License

This module is maintained by the Airia team for internal use.