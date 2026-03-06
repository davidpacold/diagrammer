output "resource_group_name" {
  description = "Name of the created resource group"
  value       = module.airia_on_azure.resource_group_name
}

output "resource_group_id" {
  description = "ID of the created resource group"
  value       = module.airia_on_azure.resource_group_id
}

output "vnet_id" {
  description = "ID of the virtual network"
  value       = module.airia_on_azure.vnet_id
}

output "vnet_name" {
  description = "Name of the virtual network"
  value       = module.airia_on_azure.vnet_name
}

output "aks_cluster_id" {
  description = "ID of the AKS cluster"
  value       = module.airia_on_azure.aks_cluster_id
}

output "aks_cluster_name" {
  description = "Name of the AKS cluster"
  value       = module.airia_on_azure.aks_cluster_name
}

output "aks_cluster_fqdn" {
  description = "FQDN of the AKS cluster"
  value       = module.airia_on_azure.aks_cluster_fqdn
}

output "aks_cluster_kube_config" {
  description = "Kubernetes config for the AKS cluster"
  value       = module.airia_on_azure.aks_cluster_kube_config
  sensitive   = true
}

output "postgresql_server_id" {
  description = "ID of the PostgreSQL server"
  value       = module.airia_on_azure.postgresql_server_id
}

output "postgresql_server_name" {
  description = "Name of the PostgreSQL server"
  value       = module.airia_on_azure.postgresql_server_name
}

output "postgresql_server_fqdn" {
  description = "FQDN of the PostgreSQL server"
  value       = module.airia_on_azure.postgresql_server_fqdn
}

output "postgresql_admin_username" {
  description = "Administrator username for PostgreSQL server"
  value       = module.airia_on_azure.postgresql_admin_username
}

output "postgresql_database_names" {
  description = "List of created database names"
  value       = module.airia_on_azure.postgresql_database_names
}

output "postgresql_private_endpoint_id" {
  description = "ID of the PostgreSQL private endpoint"
  value       = module.airia_on_azure.postgresql_private_endpoint_id
}

output "postgresql_private_endpoint_ip" {
  description = "Private IP address of the PostgreSQL private endpoint"
  value       = module.airia_on_azure.postgresql_private_endpoint_ip
}

output "additional_node_pools" {
  description = "Information about additional node pools"
  value       = module.airia_on_azure.additional_node_pools
}

output "aks_node_resource_group" {
  description = "Name of the AKS node resource group"
  value       = module.airia_on_azure.aks_node_resource_group
}

output "application_gateway_public_ip" {
  description = "Public IP address of the Application Gateway"
  value       = module.airia_on_azure.application_gateway_public_ip
}

output "application_gateway_fqdn" {
  description = "FQDN of the Application Gateway"
  value       = module.airia_on_azure.application_gateway_fqdn
}

output "application_gateway_id" {
  description = "ID of the Application Gateway"
  value       = module.airia_on_azure.application_gateway_id
}

output "application_gateway_name" {
  description = "Name of the Application Gateway"
  value       = module.airia_on_azure.application_gateway_name
}

output "storage_account_id" {
  description = "ID of the storage account"
  value       = module.airia_on_azure.storage_account_id
}

output "storage_account_name" {
  description = "Name of the storage account"
  value       = module.airia_on_azure.storage_account_name
}

output "storage_account_primary_blob_connection_string" {
  description = "Primary blob connection string of the storage account"
  value       = module.airia_on_azure.storage_account_primary_blob_connection_string
  sensitive   = true
}

output "storage_container_names" {
  description = "Name of Azure blob storage container(s)"
  value       = module.airia_on_azure.storage_container_names
}

output "storage_private_endpoint_id" {
  description = "ID of the blob storage private endpoint"
  value       = module.airia_on_azure.storage_private_endpoint_id
}

output "storage_private_endpoint_ip" {
  description = "Private IP address of the blob storage private endpoint"
  value       = module.airia_on_azure.storage_private_endpoint_ip
}

# Azure OpenAI Outputs
output "openai_enabled" {
  description = "Whether Azure OpenAI is enabled"
  value       = module.airia_on_azure.openai_enabled
}

output "openai_endpoint" {
  description = "The endpoint for Azure OpenAI service"
  value       = module.airia_on_azure.openai_endpoint
}

output "openai_name" {
  description = "The name of the Azure OpenAI service"
  value       = module.airia_on_azure.openai_name
}

output "openai_api_key" {
  description = "The primary API key for Azure OpenAI service"
  value       = module.airia_on_azure.openai_api_key
  sensitive   = true
}

output "openai_primary_key" {
  description = "Primary access key for Azure OpenAI service (same as openai_api_key)"
  value       = module.airia_on_azure.openai_primary_key
  sensitive   = true
}

output "openai_model_name" {
  description = "The deployed model name (gpt-4.1-mini) to use when calling the API"
  value       = module.airia_on_azure.openai_model_name
}

output "openai_api_version" {
  description = "Recommended API version for Azure OpenAI"
  value       = module.airia_on_azure.openai_api_version
}

output "openai_full_endpoint_example" {
  description = "Example full endpoint URL for chat completions - shows the complete URL format"
  value       = module.airia_on_azure.openai_full_endpoint_example
}

output "openai_custom_subdomain" {
  description = "Custom subdomain for Azure OpenAI service"
  value       = module.airia_on_azure.openai_custom_subdomain
}

output "gpt_4_1_mini_deployment_name" {
  description = "Name of the GPT-4.1 mini deployment"
  value       = module.airia_on_azure.gpt_4_1_mini_deployment_name
}

output "gpt_4_1_deployment_name" {
  description = "Name of the GPT-4.1 deployment (if deployed)"
  value       = module.airia_on_azure.gpt_4_1_deployment_name
}

output "text_embedding_deployment_name" {
  description = "Name of the text embedding deployment (if deployed)"
  value       = module.airia_on_azure.text_embedding_deployment_name
}

output "openai_connection_example" {
  description = "Example connection configuration for Azure OpenAI"
  value       = module.airia_on_azure.openai_connection_example
}

# Cosmos DB Cassandra Outputs
output "cosmos_cassandra_enabled" {
  description = "Whether Cosmos DB Cassandra is enabled"
  value       = module.airia_on_azure.cosmos_cassandra_enabled
}

output "cosmos_cassandra_account_name" {
  description = "Name of the Cosmos DB account"
  value       = module.airia_on_azure.cosmos_cassandra_account_name
}

output "cosmos_cassandra_endpoint" {
  description = "Endpoint URL for Cosmos DB Cassandra API"
  value       = module.airia_on_azure.cosmos_cassandra_endpoint
}

output "cosmos_cassandra_contact_point" {
  description = "Cassandra contact point for the Cosmos DB account"
  value       = module.airia_on_azure.cosmos_cassandra_contact_point
}

output "cosmos_cassandra_port" {
  description = "Port for Cassandra connections"
  value       = module.airia_on_azure.cosmos_cassandra_port
}

output "cosmos_cassandra_primary_key" {
  description = "Primary access key for Cosmos DB Cassandra"
  value       = module.airia_on_azure.cosmos_cassandra_primary_key
  sensitive   = true
}

output "cosmos_cassandra_keyspaces" {
  description = "Created Cassandra keyspaces"
  value       = module.airia_on_azure.cosmos_cassandra_keyspaces
}

output "cosmos_cassandra_tables" {
  description = "Created Cassandra tables"
  value       = module.airia_on_azure.cosmos_cassandra_tables
}

output "cosmos_cassandra_connection_example" {
  description = "Example connection configuration for Cosmos DB Cassandra"
  value       = module.airia_on_azure.cosmos_cassandra_connection_example
}

# Azure Document Intelligence Outputs
output "document_intelligence_enabled" {
  description = "Whether Azure Document Intelligence is enabled"
  value       = module.airia_on_azure.document_intelligence_enabled
}

output "document_intelligence_endpoint" {
  description = "Endpoint for Azure Document Intelligence service"
  value       = module.airia_on_azure.document_intelligence_endpoint
}

output "document_intelligence_primary_key" {
  description = "Primary access key for Azure Document Intelligence"
  value       = module.airia_on_azure.document_intelligence_primary_key
  sensitive   = true
}

output "document_intelligence_name" {
  description = "Name of the Azure Document Intelligence service"
  value       = module.airia_on_azure.document_intelligence_name
}

output "document_intelligence_location" {
  description = "Location of the Azure Document Intelligence service"
  value       = module.airia_on_azure.document_intelligence_location
}

output "document_intelligence_api_version" {
  description = "Recommended API version for Azure Document Intelligence"
  value       = module.airia_on_azure.document_intelligence_api_version
}

output "document_intelligence_connection_example" {
  description = "Example connection information for Document Intelligence"
  value       = module.airia_on_azure.document_intelligence_connection_example
}

# Azure Machine Learning Workspace Outputs
output "ml_workspace_enabled" {
  description = "Whether Azure ML workspace is enabled"
  value       = module.airia_on_azure.ml_workspace_enabled
}

output "ml_workspace_id" {
  description = "Resource ID of the Azure ML workspace"
  value       = module.airia_on_azure.ml_workspace_id
}

output "ml_workspace_name" {
  description = "Name of the Azure ML workspace"
  value       = module.airia_on_azure.ml_workspace_name
}

output "ml_workspace_workspace_url" {
  description = "Workspace URL for Azure ML Studio"
  value       = module.airia_on_azure.ml_workspace_workspace_url
}

output "ml_workspace_studio_endpoint" {
  description = "Azure ML Studio endpoint URL"
  value       = module.airia_on_azure.ml_workspace_studio_endpoint
}

output "ml_workspace_connection_example" {
  description = "Example connection information for ML workspace"
  value       = module.airia_on_azure.ml_workspace_connection_example
}

output "ml_workspace_key_vault_id" {
  description = "Resource ID of the Key Vault for ML workspace"
  value       = module.airia_on_azure.ml_workspace_key_vault_id
}

output "ml_workspace_storage_account_id" {
  description = "Resource ID of the Storage Account for ML workspace"
  value       = module.airia_on_azure.ml_workspace_storage_account_id
}

output "ml_workspace_container_registry_id" {
  description = "Resource ID of the Container Registry for ML workspace"
  value       = module.airia_on_azure.ml_workspace_container_registry_id
}