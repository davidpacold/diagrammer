output "resource_group_name" {
  description = "Name of the resource group"
  value       = azurerm_resource_group.this.name
}

output "resource_group_id" {
  description = "ID of the resource group"
  value       = azurerm_resource_group.this.id
}

output "vnet_id" {
  description = "ID of the virtual network"
  value       = azurerm_virtual_network.this.id
}

output "vnet_name" {
  description = "Name of the virtual network"
  value       = azurerm_virtual_network.this.name
}

output "aks_subnet_id" {
  description = "ID of the AKS subnet"
  value       = azurerm_subnet.aks.id
}

output "private_endpoints_subnet_id" {
  description = "ID of the private endpoints subnet"
  value       = azurerm_subnet.private_endpoints.id
}

output "aks_cluster_id" {
  description = "ID of the AKS cluster"
  value       = azurerm_kubernetes_cluster.this.id
}

output "aks_cluster_name" {
  description = "Name of the AKS cluster"
  value       = azurerm_kubernetes_cluster.this.name
}

output "aks_cluster_fqdn" {
  description = "FQDN of the AKS cluster"
  value       = azurerm_kubernetes_cluster.this.fqdn
}

output "aks_cluster_kube_config" {
  description = "Kubernetes config for the AKS cluster"
  value       = azurerm_kubernetes_cluster.this.kube_config_raw
  sensitive   = true
}

output "aks_cluster_kubelet_identity" {
  description = "Kubelet identity information"
  value       = azurerm_kubernetes_cluster.this.kubelet_identity
}

output "aks_cluster_identity" {
  description = "AKS cluster identity information"
  value       = azurerm_kubernetes_cluster.this.identity
}

output "additional_node_pools" {
  description = "Information about additional node pools"
  value = {
    for k, v in azurerm_kubernetes_cluster_node_pool.additional : k => {
      id                   = v.id
      name                 = v.name
      vm_size              = v.vm_size
      node_count           = v.node_count
      auto_scaling_enabled = v.auto_scaling_enabled
      min_count            = v.min_count
      max_count            = v.max_count
      zones                = v.zones
      node_labels          = v.node_labels
      node_taints          = v.node_taints
    }
  }
}

output "postgresql_server_id" {
  description = "ID of the PostgreSQL server"
  value       = azurerm_postgresql_flexible_server.this.id
}

output "postgresql_server_name" {
  description = "Name of the PostgreSQL server"
  value       = azurerm_postgresql_flexible_server.this.name
}

output "postgresql_server_fqdn" {
  description = "FQDN of the PostgreSQL server"
  value       = azurerm_postgresql_flexible_server.this.fqdn
}

output "postgresql_admin_username" {
  description = "Administrator username for PostgreSQL server"
  value       = azurerm_postgresql_flexible_server.this.administrator_login
}

output "postgresql_database_names" {
  description = "List of created database names"
  value       = [for db in azurerm_postgresql_flexible_server_database.databases : db.name]
}

output "postgresql_private_endpoint_id" {
  description = "ID of the PostgreSQL private endpoint"
  value       = azurerm_private_endpoint.postgresql.id
}

output "postgresql_private_endpoint_ip" {
  description = "Private IP address of the PostgreSQL private endpoint"
  value       = azurerm_private_endpoint.postgresql.private_service_connection[0].private_ip_address
}

output "private_dns_zone_id" {
  description = "ID of the private DNS zone"
  value       = azurerm_private_dns_zone.postgresql.id
}

output "aks_node_resource_group" {
  description = "Name of the AKS node resource group"
  value       = azurerm_kubernetes_cluster.this.node_resource_group
}

output "application_gateway_public_ip" {
  description = "Public IP address of the Application Gateway"
  value       = azurerm_public_ip.appgw.ip_address
}

output "application_gateway_fqdn" {
  description = "FQDN of the Application Gateway"
  value       = azurerm_public_ip.appgw.fqdn
}

output "application_gateway_id" {
  description = "ID of the Application Gateway"
  value       = azurerm_application_gateway.this.id
}

output "application_gateway_name" {
  description = "Name of the Application Gateway"
  value       = azurerm_application_gateway.this.name
}

output "storage_account_id" {
  description = "ID of the storage account"
  value       = azurerm_storage_account.this.id
}

output "storage_account_name" {
  description = "Name of the storage account"
  value       = azurerm_storage_account.this.name
}

output "storage_account_primary_blob_connection_string" {
  description = "Primary blob connection string of the storage account"
  value       = azurerm_storage_account.this.primary_blob_connection_string
  sensitive   = true
}

output "storage_container_names" {
  description = "Name of Azure blob storage container(s)"
  value       = var.storage_containers
}

output "storage_private_endpoint_id" {
  description = "ID of the blob storage private endpoint"
  value       = azurerm_private_endpoint.blob.id
}

output "storage_private_endpoint_ip" {
  description = "Private IP address of the blob storage private endpoint"
  value       = azurerm_private_endpoint.blob.private_service_connection[0].private_ip_address
}

# Azure OpenAI Outputs
output "openai_enabled" {
  description = "Whether Azure OpenAI is enabled"
  value       = var.openai_enabled
}

output "openai_endpoint" {
  description = "Endpoint URL for Azure OpenAI service"
  value       = var.openai_enabled ? azurerm_cognitive_account.openai[0].endpoint : null
}

output "openai_primary_key" {
  description = "Primary access key for Azure OpenAI service"
  value       = var.openai_enabled ? azurerm_cognitive_account.openai[0].primary_access_key : null
  sensitive   = true
}

output "openai_api_key" {
  description = "The primary API key for Azure OpenAI service (alias for openai_primary_key)"
  value       = var.openai_enabled ? azurerm_cognitive_account.openai[0].primary_access_key : null
  sensitive   = true
}

output "openai_secondary_key" {
  description = "Secondary access key for Azure OpenAI service"
  value       = var.openai_enabled ? azurerm_cognitive_account.openai[0].secondary_access_key : null
  sensitive   = true
}

output "openai_resource_id" {
  description = "Resource ID of the Azure OpenAI service"
  value       = var.openai_enabled ? azurerm_cognitive_account.openai[0].id : null
}

output "openai_name" {
  description = "The name of the Azure OpenAI service"
  value       = var.openai_enabled ? azurerm_cognitive_account.openai[0].name : null
}

output "openai_custom_subdomain" {
  description = "Custom subdomain for Azure OpenAI service"
  value       = var.openai_enabled ? azurerm_cognitive_account.openai[0].custom_subdomain_name : null
}

output "gpt_4_1_mini_deployment_name" {
  description = "Name of the GPT-4.1 mini deployment"
  value       = var.openai_enabled ? azurerm_cognitive_deployment.gpt_4_1_mini[0].name : null
}

output "openai_model_name" {
  description = "The deployed model name (gpt-4.1-mini) to use when calling the API"
  value       = var.openai_enabled ? azurerm_cognitive_deployment.gpt_4_1_mini[0].name : null
}

output "gpt_4_1_mini_deployment_id" {
  description = "ID of the GPT-4.1 mini deployment"
  value       = var.openai_enabled ? azurerm_cognitive_deployment.gpt_4_1_mini[0].id : null
}

output "gpt_4_1_deployment_name" {
  description = "Name of the GPT-4.1 deployment (if deployed)"
  value       = var.openai_enabled && var.deploy_gpt_4_1 ? azurerm_cognitive_deployment.gpt_4_1[0].name : null
}

output "text_embedding_deployment_name" {
  description = "Name of the text embedding deployment (if deployed)"
  value       = var.openai_enabled && var.deploy_text_embedding ? azurerm_cognitive_deployment.text_embedding[0].name : null
}

output "openai_private_endpoint_ip" {
  description = "Private IP address of the OpenAI private endpoint (if enabled)"
  value       = var.openai_enabled && var.openai_private_endpoint_enabled ? azurerm_private_endpoint.openai[0].private_service_connection[0].private_ip_address : null
}

output "openai_connection_example" {
  description = "Example connection string for Azure OpenAI"
  value = var.openai_enabled ? {
    endpoint                = azurerm_cognitive_account.openai[0].endpoint
    api_version             = "2025-04-01-preview"
    gpt_4_1_mini_deployment = azurerm_cognitive_deployment.gpt_4_1_mini[0].name
    authentication_note     = "Use either Azure AD authentication or API key from openai_primary_key output"
  } : null
}

output "openai_api_version" {
  description = "Recommended API version for Azure OpenAI"
  value       = "2025-04-01-preview"
}

output "openai_full_endpoint_example" {
  description = "Example full endpoint URL for chat completions - shows the complete URL format"
  value       = var.openai_enabled ? "${azurerm_cognitive_account.openai[0].endpoint}openai/deployments/${azurerm_cognitive_deployment.gpt_4_1_mini[0].name}/chat/completions?api-version=2025-04-01-preview" : null
}

# Cosmos DB Cassandra Outputs
output "cosmos_cassandra_enabled" {
  description = "Whether Cosmos DB Cassandra is enabled"
  value       = var.cosmos_cassandra_enabled
}

output "cosmos_cassandra_account_id" {
  description = "ID of the Cosmos DB account"
  value       = var.cosmos_cassandra_enabled ? azurerm_cosmosdb_account.cassandra[0].id : null
}

output "cosmos_cassandra_account_name" {
  description = "Name of the Cosmos DB account"
  value       = var.cosmos_cassandra_enabled ? azurerm_cosmosdb_account.cassandra[0].name : null
}

output "cosmos_cassandra_endpoint" {
  description = "Endpoint URL for Cosmos DB Cassandra API"
  value       = var.cosmos_cassandra_enabled ? azurerm_cosmosdb_account.cassandra[0].endpoint : null
}

output "cosmos_cassandra_contact_point" {
  description = "Cassandra contact point for the Cosmos DB account"
  value       = var.cosmos_cassandra_enabled ? "${azurerm_cosmosdb_account.cassandra[0].name}.cassandra.cosmos.azure.com" : null
}

output "cosmos_cassandra_port" {
  description = "Port for Cassandra connections"
  value       = var.cosmos_cassandra_enabled ? 10350 : null
}

output "cosmos_cassandra_primary_key" {
  description = "Primary access key for Cosmos DB Cassandra"
  value       = var.cosmos_cassandra_enabled ? azurerm_cosmosdb_account.cassandra[0].primary_key : null
  sensitive   = true
}

output "cosmos_cassandra_secondary_key" {
  description = "Secondary access key for Cosmos DB Cassandra"
  value       = var.cosmos_cassandra_enabled ? azurerm_cosmosdb_account.cassandra[0].secondary_key : null
  sensitive   = true
}

output "cosmos_cassandra_primary_readonly_key" {
  description = "Primary read-only access key for Cosmos DB Cassandra"
  value       = var.cosmos_cassandra_enabled ? azurerm_cosmosdb_account.cassandra[0].primary_readonly_key : null
  sensitive   = true
}

output "cosmos_cassandra_connection_strings" {
  description = "Connection strings for Cosmos DB Cassandra (Cassandra endpoint)"
  value = var.cosmos_cassandra_enabled ? [
    "AccountEndpoint=${azurerm_cosmosdb_account.cassandra[0].endpoint};AccountKey=${azurerm_cosmosdb_account.cassandra[0].primary_key}",
    "ContactPoint=${azurerm_cosmosdb_account.cassandra[0].name}.cassandra.cosmos.azure.com;Port=10350;Username=${azurerm_cosmosdb_account.cassandra[0].name};Password=${azurerm_cosmosdb_account.cassandra[0].primary_key}"
  ] : []
  sensitive = true
}

output "cosmos_cassandra_keyspaces" {
  description = "Created Cassandra keyspaces"
  value       = var.cosmos_cassandra_enabled ? { for k, v in azurerm_cosmosdb_cassandra_keyspace.keyspaces : k => v.id } : {}
}

output "cosmos_cassandra_tables" {
  description = "Created Cassandra tables"
  value = var.cosmos_cassandra_enabled ? { for k, v in azurerm_cosmosdb_cassandra_table.tables : k => {
    id          = v.id
    name        = v.name
    keyspace_id = v.cassandra_keyspace_id
  } } : {}
}

output "cosmos_cassandra_private_endpoint_id" {
  description = "ID of the Cosmos DB private endpoint"
  value       = var.cosmos_cassandra_enabled && var.cosmos_cassandra_private_endpoint_enabled ? azurerm_private_endpoint.cosmos_cassandra[0].id : null
}

output "cosmos_cassandra_private_endpoint_ip" {
  description = "Private IP address of the Cosmos DB private endpoint"
  value       = var.cosmos_cassandra_enabled && var.cosmos_cassandra_private_endpoint_enabled ? azurerm_private_endpoint.cosmos_cassandra[0].private_service_connection[0].private_ip_address : null
}

output "cosmos_cassandra_serverless_enabled" {
  description = "Whether Cosmos DB is running in serverless mode"
  value       = var.cosmos_cassandra_enabled ? var.cosmos_cassandra_serverless : null
}

output "cosmos_cassandra_consistency_level" {
  description = "Configured consistency level for Cosmos DB"
  value       = var.cosmos_cassandra_enabled ? var.cosmos_cassandra_consistency_level : null
}

output "cosmos_cassandra_locations" {
  description = "Geo-locations configured for Cosmos DB"
  value       = var.cosmos_cassandra_enabled ? azurerm_cosmosdb_account.cassandra[0].geo_location : []
}

output "cosmos_cassandra_connection_example" {
  description = "Example connection configuration for Cosmos DB Cassandra"
  value = var.cosmos_cassandra_enabled ? {
    contact_point = "${azurerm_cosmosdb_account.cassandra[0].name}.cassandra.cosmos.azure.com"
    port          = 10350
    username      = azurerm_cosmosdb_account.cassandra[0].name
    ssl_enabled   = true
    auth_note     = "Use primary_key output as password for authentication"
  } : null
}

# Azure Document Intelligence Outputs
output "document_intelligence_enabled" {
  description = "Whether Azure Document Intelligence is enabled"
  value       = var.document_intelligence_enabled
}

output "document_intelligence_endpoint" {
  description = "Endpoint for Azure Document Intelligence service"
  value       = var.document_intelligence_enabled ? azurerm_cognitive_account.document_intelligence[0].endpoint : null
  sensitive   = false
}

output "document_intelligence_primary_key" {
  description = "Primary access key for Azure Document Intelligence"
  value       = var.document_intelligence_enabled ? azurerm_cognitive_account.document_intelligence[0].primary_access_key : null
  sensitive   = true
}

output "document_intelligence_secondary_key" {
  description = "Secondary access key for Azure Document Intelligence"
  value       = var.document_intelligence_enabled ? azurerm_cognitive_account.document_intelligence[0].secondary_access_key : null
  sensitive   = true
}

output "document_intelligence_id" {
  description = "Resource ID of the Azure Document Intelligence service"
  value       = var.document_intelligence_enabled ? azurerm_cognitive_account.document_intelligence[0].id : null
}

output "document_intelligence_name" {
  description = "Name of the Azure Document Intelligence service"
  value       = var.document_intelligence_enabled ? azurerm_cognitive_account.document_intelligence[0].name : null
}

output "document_intelligence_location" {
  description = "Location of the Azure Document Intelligence service"
  value       = var.document_intelligence_enabled ? azurerm_cognitive_account.document_intelligence[0].location : null
}

output "document_intelligence_sku" {
  description = "SKU of the Azure Document Intelligence service"
  value       = var.document_intelligence_enabled ? azurerm_cognitive_account.document_intelligence[0].sku_name : null
}

output "document_intelligence_private_endpoint_id" {
  description = "Resource ID of the Document Intelligence private endpoint"
  value       = var.document_intelligence_enabled && var.document_intelligence_private_endpoint_enabled ? azurerm_private_endpoint.document_intelligence[0].id : null
}

output "document_intelligence_private_endpoint_ip" {
  description = "Private IP address of the Document Intelligence private endpoint"
  value       = var.document_intelligence_enabled && var.document_intelligence_private_endpoint_enabled ? azurerm_private_endpoint.document_intelligence[0].private_service_connection[0].private_ip_address : null
}

output "document_intelligence_api_version" {
  description = "Recommended API version for Azure Document Intelligence"
  value       = "2023-07-31"
}

output "document_intelligence_connection_example" {
  description = "Example connection information for Document Intelligence"
  value = var.document_intelligence_enabled ? {
    endpoint                     = azurerm_cognitive_account.document_intelligence[0].endpoint
    auth_note                    = "Use primary_key output as Ocp-Apim-Subscription-Key header for authentication"
    api_version                  = "2023-07-31"
    example_analyze_document_url = "${azurerm_cognitive_account.document_intelligence[0].endpoint}formrecognizer/documentModels/prebuilt-document:analyze?api-version=2023-07-31"
    example_analyze_layout_url   = "${azurerm_cognitive_account.document_intelligence[0].endpoint}formrecognizer/documentModels/prebuilt-layout:analyze?api-version=2023-07-31"
    example_analyze_invoice_url  = "${azurerm_cognitive_account.document_intelligence[0].endpoint}formrecognizer/documentModels/prebuilt-invoice:analyze?api-version=2023-07-31"
    example_analyze_receipt_url  = "${azurerm_cognitive_account.document_intelligence[0].endpoint}formrecognizer/documentModels/prebuilt-receipt:analyze?api-version=2023-07-31"
  } : null
}

# Azure Machine Learning Workspace Outputs
output "ml_workspace_enabled" {
  description = "Whether Azure ML workspace is enabled"
  value       = var.ml_workspace_enabled
}

output "ml_workspace_id" {
  description = "Resource ID of the Azure ML workspace"
  value       = var.ml_workspace_enabled ? azurerm_machine_learning_workspace.this[0].id : null
}

output "ml_workspace_name" {
  description = "Name of the Azure ML workspace"
  value       = var.ml_workspace_enabled ? azurerm_machine_learning_workspace.this[0].name : null
}

output "ml_workspace_location" {
  description = "Location of the Azure ML workspace"
  value       = var.ml_workspace_enabled ? azurerm_machine_learning_workspace.this[0].location : null
}

output "ml_workspace_discovery_url" {
  description = "Discovery URL for the Azure ML workspace"
  value       = var.ml_workspace_enabled ? azurerm_machine_learning_workspace.this[0].discovery_url : null
}

output "ml_workspace_workspace_url" {
  description = "Workspace URL for Azure ML Studio"
  value       = var.ml_workspace_enabled ? "https://ml.azure.com/?wsid=${azurerm_machine_learning_workspace.this[0].id}" : null
}

output "ml_workspace_studio_endpoint" {
  description = "Azure ML Studio endpoint URL"
  value       = var.ml_workspace_enabled ? "https://ml.azure.com" : null
}

output "ml_workspace_application_insights_id" {
  description = "Resource ID of the Application Insights for ML workspace"
  value       = var.ml_workspace_enabled ? azurerm_application_insights.ml[0].id : null
}

output "ml_workspace_key_vault_id" {
  description = "Resource ID of the Key Vault for ML workspace"
  value       = var.ml_workspace_enabled ? azurerm_key_vault.ml[0].id : null
}

output "ml_workspace_storage_account_id" {
  description = "Resource ID of the Storage Account for ML workspace"
  value       = var.ml_workspace_enabled ? azurerm_storage_account.ml[0].id : null
}

output "ml_workspace_container_registry_id" {
  description = "Resource ID of the Container Registry for ML workspace"
  value       = var.ml_workspace_enabled && var.ml_workspace_container_registry_enabled ? azurerm_container_registry.ml[0].id : null
}

output "ml_workspace_container_registry_login_server" {
  description = "Login server URL for the Container Registry"
  value       = var.ml_workspace_enabled && var.ml_workspace_container_registry_enabled ? azurerm_container_registry.ml[0].login_server : null
}

output "ml_workspace_private_endpoint_id" {
  description = "Resource ID of the ML workspace private endpoint"
  value       = var.ml_workspace_enabled && var.ml_workspace_private_endpoint_enabled ? azurerm_private_endpoint.ml[0].id : null
}

output "ml_workspace_private_endpoint_ip" {
  description = "Private IP address of the ML workspace private endpoint"
  value       = var.ml_workspace_enabled && var.ml_workspace_private_endpoint_enabled ? azurerm_private_endpoint.ml[0].private_service_connection[0].private_ip_address : null
}

output "ml_workspace_principal_id" {
  description = "Principal ID of the ML workspace managed identity"
  value       = var.ml_workspace_enabled ? azurerm_machine_learning_workspace.this[0].identity[0].principal_id : null
}

output "ml_workspace_connection_example" {
  description = "Example connection information for ML workspace"
  value = var.ml_workspace_enabled ? {
    workspace_url             = "https://ml.azure.com/?wsid=${azurerm_machine_learning_workspace.this[0].id}"
    discovery_url             = azurerm_machine_learning_workspace.this[0].discovery_url
    workspace_id              = azurerm_machine_learning_workspace.this[0].workspace_id
    auth_note                 = "Use Azure CLI authentication or service principal for API access"
    serverless_endpoints_note = "Deploy serverless endpoints via Azure ML Studio or CLI"
    api_base_url              = "https://${azurerm_machine_learning_workspace.this[0].location}.api.azureml.ms"
  } : null
}
