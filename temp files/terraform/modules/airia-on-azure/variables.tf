variable "subscription_id" {
  type        = string
  description = "Azure subscription ID where resources will be deployed"
}

variable "resource_prefix" {
  type        = string
  description = "Prefix to use for resource naming (e.g. application name)"
}

variable "environment" {
  type        = string
  description = "Deployment environment (e.g. dev, test, prod)"
  default     = "dev"
}

variable "location" {
  type        = string
  description = "Azure region where resources will be deployed"
  default     = "eastus"
}

# Resource Tags
variable "owner" {
  type        = string
  description = "Contact email for the resources (used in Owner tag)"
  default     = ""
}

variable "cost_center" {
  type        = string
  description = "Cost center for billing and chargeback tracking (used in CostCenter tag)"
  default     = ""
}

variable "application" {
  type        = string
  description = "Application name (used in Application tag)"
  default     = "airia"
}

# Network Variables
variable "vnet_address_space" {
  type        = string
  description = "Address space for the virtual network"
  default     = "10.0.0.0/22"
}

variable "aks_subnet_address_prefix" {
  type        = string
  description = "Address prefix for the AKS subnet"
  default     = "10.0.0.0/23"
}

variable "private_endpoints_subnet_address_prefix" {
  type        = string
  description = "Address prefix for the private endpoints subnet (PostgreSQL, Storage, OpenAI, Cosmos DB, Document Intelligence, ML Workspace)"
  default     = "10.0.2.0/24"
}

variable "appgw_subnet_address_prefix" {
  type        = string
  description = "Address prefix for the Application Gateway subnet"
  default     = "10.0.3.0/24"
}

# AKS Variables
variable "kubernetes_version" {
  type        = string
  description = "Version of Kubernetes to use for the AKS cluster"
  default     = "1.34"
}

variable "aks_oidc_issuer_enabled" {
  type        = bool
  description = "Enable OIDC issuer for the AKS cluster (required for workload identity)"
  default     = false
}

variable "aks_dns_service_ip" {
  type        = string
  description = "IP address within the service CIDR that will be used by cluster service discovery"
  default     = "10.100.0.10"
}

variable "aks_service_cidr" {
  type        = string
  description = "The Network Range used by the Kubernetes service"
  default     = "10.100.0.0/16"
}

# Default node pool configuration
variable "default_node_pool" {
  type = object({
    temporary_name_for_rotation = optional(string, "temprotation")
    name                        = optional(string, "default")
    node_count                  = optional(number, 2)
    auto_scaling_enabled        = optional(bool, true)
    min_count                   = optional(number, 2)
    max_count                   = optional(number, 6)
    vm_size                     = optional(string, "Standard_E4as_v5")
    zones                       = optional(list(string), ["1", "2"])
    max_pods                    = optional(number, 75)
    max_surge                   = optional(string, "33%")
  })
  description = "Configuration for the default node pool"
  default     = {}
}

# Additional node pools
variable "additional_node_pools" {
  type = map(object({
    name                 = string
    vm_size              = optional(string, "Standard_E4as_v5")
    os_disk_size_gb      = optional(number, 128)
    os_disk_type         = optional(string, "Ephemeral")
    zones                = optional(list(string), ["1", "2"])
    auto_scaling_enabled = optional(bool, true)
    min_count            = optional(number, 1)
    max_count            = optional(number, 5)
    node_count           = optional(number, 1)
    node_taints          = optional(list(string), [])
    node_labels          = optional(map(string), {})
    max_pods             = optional(number, 75)
    max_surge            = optional(string, "33%")
    gpu_driver           = optional(string, null)
  }))
  description = "Map of additional node pools to create"
  default = {
    gpu = {
      name                 = "gpunodes"
      vm_size              = "Standard_NC4as_T4_v3" # 4 vCPU, 28GB RAM, 1x NVIDIA T4 (16GB)
      os_disk_size_gb      = 200
      os_disk_type         = "Managed"
      node_count           = 0
      auto_scaling_enabled = false
      min_count            = null
      max_count            = null
      max_pods             = 30
      max_surge            = "10%"
      node_taints          = ["gpu=true:NoSchedule"]
      node_labels = {
        "gpu" = "true"
      }
      zones      = ["1", "2"]
      gpu_driver = "Install"
    }
  }
}

# PostgreSQL Variables
variable "postgresql_version" {
  type        = string
  description = "Version of PostgreSQL to use"
  default     = "16"
  validation {
    condition     = contains(["16"], var.postgresql_version)
    error_message = "PostgreSQL version must be 16."
  }
}

variable "postgresql_admin_username" {
  type        = string
  description = "Administrator username for PostgreSQL server"
  default     = "airiaadmin"
}

variable "postgresql_admin_password" {
  type        = string
  description = "Administrator password for PostgreSQL server"
  sensitive   = true
}

variable "postgresql_sku_name" {
  type        = string
  description = "SKU name for the PostgreSQL server"
  default     = "GP_Standard_D4s_v3"
}

variable "postgresql_storage_mb" {
  type        = number
  description = "Storage size in MB for PostgreSQL server"
  default     = 65536
}

variable "postgresql_storage_tier" {
  type        = string
  description = "Storage tier for PostgreSQL server"
  default     = null
}

variable "postgresql_backup_retention_days" {
  type        = number
  description = "Backup retention period in days"
  default     = 7
  validation {
    condition     = var.postgresql_backup_retention_days >= 7 && var.postgresql_backup_retention_days <= 35
    error_message = "Backup retention days must be between 7 and 35."
  }
}

variable "postgresql_geo_redundant_backup_enabled" {
  type        = bool
  description = "Enable geo-redundant backup"
  default     = false
}

variable "postgresql_auto_grow_enabled" {
  type        = bool
  description = "Enable auto-grow storage"
  default     = true
}

variable "postgresql_zone" {
  type        = string
  description = "Availability zone for PostgreSQL Flexible Server (zone availability varies by region)"
  default     = "2"
}

variable "postgresql_maintenance_window" {
  type = object({
    day_of_week  = number
    start_hour   = number
    start_minute = number
  })
  description = "Maintenance window configuration"
  default = {
    day_of_week  = 0 # Sunday
    start_hour   = 3 # 3am UTC
    start_minute = 0
  }
}

variable "postgresql_database_names" {
  type        = list(string)
  description = "List of database names to create"
  default     = ["auditlog", "conversations", "dataingest", "datastore", "identity", "keycloak", "marketplace", "mcpgateway", "metrics", "platform", "policyengine", "rag", "scheduler", "sectoolkit", "usercredentialstore"]
}

variable "postgresql_extensions" {
  type        = list(string)
  description = "List of PostgreSQL extensions to enable"
  default     = ["TIMESCALEDB", "VECTOR", "PGCRYPTO", "UUID-OSSP", "POSTGIS", "PG_TRGM", "FUZZYSTRMATCH", "AGE", "UNACCENT"]
}

variable "postgresql_shared_preload_libraries" {
  type        = list(string)
  description = "List of shared preload libraries for PostgreSQL"
  default     = ["pg_cron", "pg_stat_statements", "timescaledb", "age"]
}

# Application Gateway Variables
variable "health_probe_path" {
  type        = string
  description = "Path for the Application Gateway health probe (e.g. /ping for Traefik, /healthz for NGINX)"
  default     = "/healthz"
}

variable "health_probe_port" {
  type        = number
  description = "Port for the Application Gateway health probe (e.g. 80 for Traefik, 10254 for NGINX)"
  default     = 10254
}

variable "health_probe_host" {
  type        = string
  description = "Host header for the Application Gateway health probe (empty string uses pick_host_name_from_backend_http_settings)"
  default     = ""
}

variable "appgw_sku_name" {
  type        = string
  description = "SKU name for the Application Gateway"
  default     = "Standard_v2"
}

variable "appgw_sku_tier" {
  type        = string
  description = "SKU tier for the Application Gateway"
  default     = "Standard_v2"
}

variable "appgw_capacity" {
  type        = number
  description = "Capacity (instance count) for the Application Gateway"
  default     = 1
}

variable "application_gateway_hostname" {
  type        = string
  description = "Hostname for the Application Gateway backend health probe"
  default     = "localhost"
}

variable "ssl_certificate_name" {
  type        = string
  description = "Name of the SSL certificate for HTTPS listener"
  default     = ""
}

variable "ssl_certificate_data" {
  type        = string
  description = "Base64 encoded PFX certificate data"
  default     = ""
  sensitive   = true
}

variable "ssl_certificate_password" {
  type        = string
  description = "Password for the PFX certificate"
  default     = ""
  sensitive   = true
}

variable "nginx_internal_ip" {
  type        = string
  description = "Internal IP address of the nginx ingress controller (LoadBalancer service)"
  default     = "10.0.1.250" # Static IP near top of AKS subnet to avoid dynamic allocation conflicts
}

variable "storage_containers" {
  type        = list(string)
  description = "List of Azure storage containers to create"
  default     = ["airia-default"]
}

variable "storage_blob_retention_days" {
  type        = number
  description = "Number of days to retain deleted blobs (0 = disabled, incurs additional storage costs when enabled)"
  default     = 7
}

variable "storage_container_retention_days" {
  type        = number
  description = "Number of days to retain deleted containers (0 = disabled, incurs additional storage costs when enabled)"
  default     = 7
}

# Azure OpenAI Variables
variable "openai_enabled" {
  type        = bool
  description = "Enable Azure OpenAI Service deployment"
  default     = true
}

variable "openai_location" {
  type        = string
  description = "Location for Azure OpenAI service (limited regions available)"
  default     = "" # If empty, uses resource group location
  validation {
    condition = contains([
      "", # Allow empty to use default
      "eastus",
      "eastus2",
      "westus",
      "westus3",
      "northcentralus",
      "southcentralus",
      "canadaeast",
      "westeurope",
      "northeurope",
      "swedencentral",
      "uksouth",
      "francecentral",
      "japaneast",
      "australiaeast"
    ], var.openai_location)
    error_message = "Azure OpenAI is only available in specific regions. Check Azure documentation for current availability."
  }
}

variable "openai_sku" {
  type        = string
  description = "SKU for Azure OpenAI service"
  default     = "S0"
}

variable "openai_public_network_access_enabled" {
  type        = bool
  description = "Enable public network access for Azure OpenAI"
  default     = false # Set to false for production, uses private endpoint
}

variable "openai_allowed_ips" {
  type        = list(string)
  description = "List of allowed IP addresses for Azure OpenAI (when using network ACLs)"
  default     = []
}

variable "openai_private_endpoint_enabled" {
  type        = bool
  description = "Enable private endpoint for Azure OpenAI"
  default     = true
}

# GPT-4.1 Mini Configuration
variable "gpt_4_1_mini_version" {
  type        = string
  description = "Version of GPT-4.1 mini model to deploy"
  default     = "2025-04-14"
}

variable "gpt_4_1_mini_capacity" {
  type        = number
  description = "Capacity for GPT-4.1 mini deployment (in thousands of tokens per minute)"
  default     = 10 # 10K TPM for development, increase for production
  validation {
    condition     = var.gpt_4_1_mini_capacity >= 1 && var.gpt_4_1_mini_capacity <= 1000
    error_message = "Capacity must be between 1 and 1000 (representing 1K to 1M tokens per minute)."
  }
}

# GPT-4.1 Configuration
variable "deploy_gpt_4_1" {
  type        = bool
  description = "Deploy full GPT-4.1 model in addition to GPT-4.1 mini"
  default     = true
}

variable "gpt_4_1_version" {
  type        = string
  description = "Version of GPT-4.1 model to deploy"
  default     = "2025-04-14"
}

variable "gpt_4_1_capacity" {
  type        = number
  description = "Capacity for GPT-4.1 deployment (in thousands of tokens per minute)"
  default     = 10
}

# Text Embedding Configuration (Optional)
variable "deploy_text_embedding" {
  type        = bool
  description = "Deploy text embedding model"
  default     = true # Recommended for RAG and vector search
}

variable "text_embedding_version" {
  type        = string
  description = "Version of text embedding model to deploy"
  default     = "1" # No retirement scheduled before April 2027
}

variable "text_embedding_capacity" {
  type        = number
  description = "Capacity for text embedding deployment (in thousands of tokens per minute)"
  default     = 50 # Higher capacity for embedding operations
}

# Azure OpenAI RAI Policy
variable "openai_rai_policy" {
  type        = string
  description = "Responsible AI policy name for OpenAI deployments"
  default     = null # Use Azure default if not specified
}

# Key Vault Integration (Optional)
variable "store_openai_keys_in_keyvault" {
  type        = bool
  description = "Store OpenAI keys in Azure Key Vault"
  default     = false
}

variable "key_vault_id" {
  type        = string
  description = "ID of existing Key Vault for storing OpenAI secrets"
  default     = ""
}

# Cosmos DB Cassandra Variables
variable "cosmos_cassandra_enabled" {
  type        = bool
  description = "Enable Azure Cosmos DB with Cassandra API"
  default     = false
}

variable "cosmos_cassandra_location" {
  type        = string
  description = "Location for Cosmos DB Cassandra deployment (if empty, uses resource group location)"
  default     = ""
}

variable "cosmos_cassandra_serverless" {
  type        = bool
  description = "Enable serverless mode for Cosmos DB (cost-optimized for variable workloads)"
  default     = true
}

variable "cosmos_cassandra_serverless_throughput_limit" {
  type        = number
  description = "Maximum RU/s limit for serverless Cosmos DB account"
  default     = 4000
}

variable "cosmos_cassandra_consistency_level" {
  type        = string
  description = "Default consistency level for Cosmos DB"
  default     = "Session"
  validation {
    condition     = contains(["BoundedStaleness", "Eventual", "Session", "Strong", "ConsistentPrefix"], var.cosmos_cassandra_consistency_level)
    error_message = "Consistency level must be one of: BoundedStaleness, Eventual, Session, Strong, ConsistentPrefix."
  }
}

variable "cosmos_cassandra_max_interval_seconds" {
  type        = number
  description = "Max lag time in seconds for BoundedStaleness consistency"
  default     = 5
}

variable "cosmos_cassandra_max_staleness_prefix" {
  type        = number
  description = "Max staleness prefix for BoundedStaleness consistency"
  default     = 100
}

variable "cosmos_cassandra_zone_redundant" {
  type        = bool
  description = "Enable zone redundancy for Cosmos DB"
  default     = false
}

variable "cosmos_cassandra_additional_locations" {
  type = list(object({
    location          = string
    failover_priority = number
    zone_redundant    = optional(bool, false)
  }))
  description = "Additional geo-locations for multi-region Cosmos DB setup"
  default     = []
}

variable "cosmos_cassandra_public_network_access_enabled" {
  type        = bool
  description = "Enable public network access for Cosmos DB"
  default     = false
}

variable "cosmos_cassandra_allowed_ip_ranges" {
  type        = set(string)
  description = "Set of allowed IP ranges for Cosmos DB access"
  default     = []
}

variable "cosmos_cassandra_virtual_network_rules" {
  type = list(object({
    subnet_id               = string
    ignore_missing_endpoint = optional(bool, false)
  }))
  description = "Virtual network rules for Cosmos DB"
  default     = []
}

variable "cosmos_cassandra_automatic_failover_enabled" {
  type        = bool
  description = "Enable automatic failover for Cosmos DB"
  default     = true
}

variable "cosmos_cassandra_backup_type" {
  type        = string
  description = "Backup type for Cosmos DB (Periodic or Continuous)"
  default     = "Periodic"
  validation {
    condition     = contains(["Periodic", "Continuous"], var.cosmos_cassandra_backup_type)
    error_message = "Backup type must be either Periodic or Continuous."
  }
}

variable "cosmos_cassandra_backup_interval" {
  type        = number
  description = "Backup interval in minutes (60-1440) for Periodic backup"
  default     = 240
}

variable "cosmos_cassandra_backup_retention" {
  type        = number
  description = "Backup retention in hours (8-720) for Periodic backup"
  default     = 8
}

variable "cosmos_cassandra_backup_storage_redundancy" {
  type        = string
  description = "Storage redundancy for backups (Local, Zone, or Geo)"
  default     = "Local"
}

variable "cosmos_cassandra_enable_free_tier" {
  type        = bool
  description = "Enable free tier for Cosmos DB (for dev/test, max 1 per subscription)"
  default     = false
}

variable "cosmos_cassandra_analytical_storage_enabled" {
  type        = bool
  description = "Enable analytical storage for Cosmos DB"
  default     = false
}

variable "cosmos_cassandra_additional_capabilities" {
  type        = list(string)
  description = "Additional capabilities to enable for Cosmos DB"
  default     = []
}

variable "cosmos_cassandra_private_endpoint_enabled" {
  type        = bool
  description = "Enable private endpoint for Cosmos DB"
  default     = true
}

variable "cosmos_cassandra_keyspaces" {
  type = map(object({
    throughput               = optional(number)
    autoscale_max_throughput = optional(number)
  }))
  description = "Map of Cassandra keyspaces to create"
  default     = {}
}

variable "cosmos_cassandra_tables" {
  type = map(object({
    name           = string
    keyspace       = string
    partition_keys = list(string)
    clustering_keys = list(object({
      name     = string
      order_by = string
    }))
    columns = list(object({
      name = string
      type = string
    }))
    default_ttl              = optional(number)
    throughput               = optional(number)
    autoscale_max_throughput = optional(number)
  }))
  description = "Map of Cassandra tables to create"
  default     = {}
}

variable "store_cosmos_keys_in_keyvault" {
  type        = bool
  description = "Store Cosmos DB keys in Azure Key Vault"
  default     = false
}

# Azure Document Intelligence Variables
variable "document_intelligence_enabled" {
  type        = bool
  description = "Enable Azure Document Intelligence (Form Recognizer) service deployment"
  default     = true
}

variable "document_intelligence_location" {
  type        = string
  description = "Location for Azure Document Intelligence service (limited regions available)"
  default     = "" # If empty, uses resource group location
  validation {
    condition = contains([
      "", # Allow empty to use default
      "eastus",
      "eastus2",
      "westus",
      "westus2",
      "westus3",
      "centralus",
      "northcentralus",
      "southcentralus",
      "canadacentral",
      "canadaeast",
      "brazilsouth",
      "northeurope",
      "westeurope",
      "uksouth",
      "ukwest",
      "francecentral",
      "germanywestcentral",
      "norwayeast",
      "switzerlandnorth",
      "swedencentral",
      "japaneast",
      "japanwest",
      "koreacentral",
      "koreasouth",
      "southeastasia",
      "eastasia",
      "australiaeast",
      "australiasoutheast",
      "australiacentral",
      "centralindia",
      "southindia",
      "westindia",
      "southafricanorth",
      "uaenorth"
    ], var.document_intelligence_location)
    error_message = "Azure Document Intelligence is only available in specific regions. Check Azure documentation for current availability."
  }
}

variable "document_intelligence_sku" {
  type        = string
  description = "SKU for Azure Document Intelligence service"
  default     = "S0"
  validation {
    condition     = contains(["F0", "S0"], var.document_intelligence_sku)
    error_message = "Document Intelligence SKU must be either F0 (free tier) or S0 (standard)."
  }
}

variable "document_intelligence_public_network_access_enabled" {
  type        = bool
  description = "Enable public network access for Azure Document Intelligence"
  default     = false # Set to false for production, uses private endpoint
}

variable "document_intelligence_allowed_ips" {
  type        = list(string)
  description = "List of allowed IP addresses for Azure Document Intelligence (when using network ACLs)"
  default     = []
}

variable "document_intelligence_private_endpoint_enabled" {
  type        = bool
  description = "Enable private endpoint for Azure Document Intelligence"
  default     = true
}

# Key Vault Integration for Document Intelligence (Optional)
variable "store_document_intelligence_keys_in_keyvault" {
  type        = bool
  description = "Store Document Intelligence keys in Azure Key Vault"
  default     = false
}

# Azure Machine Learning Workspace Variables
variable "ml_workspace_enabled" {
  type        = bool
  description = "Enable Azure Machine Learning workspace deployment for serverless endpoints (e.g., Llama models)"
  default     = true
}

variable "ml_workspace_location" {
  type        = string
  description = "Location for Azure ML workspace (limited regions available)"
  default     = "" # If empty, uses resource group location
  validation {
    condition = contains([
      "", # Allow empty to use default
      "eastus",
      "eastus2",
      "westus",
      "westus2",
      "westus3",
      "centralus",
      "northcentralus",
      "southcentralus",
      "canadacentral",
      "canadaeast",
      "brazilsouth",
      "northeurope",
      "westeurope",
      "uksouth",
      "ukwest",
      "francecentral",
      "germanywestcentral",
      "norwayeast",
      "switzerlandnorth",
      "swedencentral",
      "japaneast",
      "japanwest",
      "koreacentral",
      "koreasouth",
      "southeastasia",
      "eastasia",
      "australiaeast",
      "australiasoutheast",
      "australiacentral",
      "centralindia",
      "southindia",
      "westindia",
      "southafricanorth",
      "uaenorth"
    ], var.ml_workspace_location)
    error_message = "Azure ML workspace is only available in specific regions. Check Azure documentation for current availability."
  }
}

variable "ml_workspace_public_network_access_enabled" {
  type        = bool
  description = "Enable public network access for Azure ML workspace"
  default     = false # Set to false for production, uses private endpoint
}

variable "ml_workspace_allowed_ips" {
  type        = list(string)
  description = "List of allowed IP addresses for Azure ML workspace (when using network ACLs)"
  default     = []
}

variable "ml_workspace_private_endpoint_enabled" {
  type        = bool
  description = "Enable private endpoint for Azure ML workspace"
  default     = true
}

variable "ml_workspace_container_registry_enabled" {
  type        = bool
  description = "Enable Azure Container Registry for ML workspace"
  default     = true
}

variable "ml_workspace_container_registry_sku" {
  type        = string
  description = "SKU for Azure Container Registry"
  default     = "Basic"
  validation {
    condition     = contains(["Basic", "Standard", "Premium"], var.ml_workspace_container_registry_sku)
    error_message = "Container Registry SKU must be Basic, Standard, or Premium."
  }
}

variable "ml_workspace_storage_replication_type" {
  type        = string
  description = "Storage replication type for ML workspace storage account"
  default     = "LRS"
  validation {
    condition     = contains(["LRS", "GRS", "RAGRS", "ZRS", "GZRS", "RAGZRS"], var.ml_workspace_storage_replication_type)
    error_message = "Storage replication type must be one of: LRS, GRS, RAGRS, ZRS, GZRS, RAGZRS."
  }
}

variable "ml_workspace_application_insights_retention_days" {
  type        = number
  description = "Retention days for Application Insights (30-730 days)"
  default     = 30
  validation {
    condition     = var.ml_workspace_application_insights_retention_days >= 30 && var.ml_workspace_application_insights_retention_days <= 730
    error_message = "Application Insights retention must be between 30 and 730 days."
  }
}

variable "ml_workspace_encryption_enabled" {
  type        = bool
  description = "Enable customer-managed key encryption for ML workspace"
  default     = false
}

variable "ml_workspace_key_vault_purge_protection_enabled" {
  type        = bool
  description = "Enable purge protection for ML workspace Key Vault"
  default     = false
}

variable "ml_workspace_image_build_compute_name" {
  type        = string
  description = "Name of compute target for image builds (optional)"
  default     = null
}
