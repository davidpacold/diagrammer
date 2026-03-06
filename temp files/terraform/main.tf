module "airia_on_azure" {
  source = "./modules/airia-on-azure"

  # Required variables
  subscription_id           = var.subscription_id
  resource_prefix           = var.resource_prefix
  environment               = var.environment
  location                  = var.location
  postgresql_admin_password = var.postgresql_admin_password

  # Resource tags
  owner       = var.owner
  cost_center = var.cost_center
  application = var.application

  # Network configuration
  vnet_address_space               = var.vnet_address_space
  aks_subnet_address_prefix        = var.aks_subnet_address_prefix
  private_endpoints_subnet_address_prefix = var.private_endpoints_subnet_address_prefix
  appgw_subnet_address_prefix      = var.appgw_subnet_address_prefix

  # AKS configuration
  kubernetes_version      = var.kubernetes_version
  aks_oidc_issuer_enabled = var.aks_oidc_issuer_enabled
  aks_dns_service_ip      = var.aks_dns_service_ip
  aks_service_cidr   = var.aks_service_cidr
  default_node_pool  = var.default_node_pool

  # Additional node pools (e.g., GPU nodes)
  additional_node_pools = var.additional_node_pools

  # Nginx internal IP for private connectivity
  nginx_internal_ip = var.nginx_internal_ip

  # PostgreSQL configuration
  postgresql_version                      = var.postgresql_version
  postgresql_admin_username               = var.postgresql_admin_username
  postgresql_sku_name                     = var.postgresql_sku_name
  postgresql_storage_mb                   = var.postgresql_storage_mb
  postgresql_storage_tier                 = var.postgresql_storage_tier
  postgresql_backup_retention_days        = var.postgresql_backup_retention_days
  postgresql_geo_redundant_backup_enabled = var.postgresql_geo_redundant_backup_enabled
  postgresql_auto_grow_enabled            = var.postgresql_auto_grow_enabled
  postgresql_zone                         = var.postgresql_zone
  postgresql_maintenance_window           = var.postgresql_maintenance_window
  postgresql_database_names               = var.postgresql_database_names
  postgresql_extensions                   = var.postgresql_extensions
  postgresql_shared_preload_libraries     = var.postgresql_shared_preload_libraries

  # Application Gateway configuration
  health_probe_path            = var.health_probe_path
  health_probe_port            = var.health_probe_port
  health_probe_host            = var.health_probe_host
  appgw_sku_name               = var.appgw_sku_name
  appgw_sku_tier               = var.appgw_sku_tier
  appgw_capacity               = var.appgw_capacity
  application_gateway_hostname = var.application_gateway_hostname
  ssl_certificate_name         = var.ssl_certificate_name
  ssl_certificate_data         = var.ssl_certificate_data
  ssl_certificate_password     = var.ssl_certificate_password

  # Storage configuration
  storage_containers               = var.storage_containers
  storage_blob_retention_days      = var.storage_blob_retention_days
  storage_container_retention_days = var.storage_container_retention_days

  # Azure OpenAI configuration
  openai_enabled                       = var.openai_enabled
  openai_location                      = var.openai_location
  openai_sku                           = var.openai_sku
  openai_public_network_access_enabled = var.openai_public_network_access_enabled
  openai_allowed_ips                   = var.openai_allowed_ips
  openai_private_endpoint_enabled      = var.openai_private_endpoint_enabled
  gpt_4_1_mini_version                 = var.gpt_4_1_mini_version
  gpt_4_1_mini_capacity                = var.gpt_4_1_mini_capacity
  deploy_gpt_4_1                       = var.deploy_gpt_4_1
  gpt_4_1_version                      = var.gpt_4_1_version
  gpt_4_1_capacity                     = var.gpt_4_1_capacity
  deploy_text_embedding                = var.deploy_text_embedding
  text_embedding_version               = var.text_embedding_version
  text_embedding_capacity              = var.text_embedding_capacity
  openai_rai_policy                    = var.openai_rai_policy
  store_openai_keys_in_keyvault        = var.store_openai_keys_in_keyvault
  key_vault_id                         = var.key_vault_id

  # Cosmos DB Cassandra configuration
  cosmos_cassandra_enabled                       = var.cosmos_cassandra_enabled
  cosmos_cassandra_location                      = var.cosmos_cassandra_location
  cosmos_cassandra_serverless                    = var.cosmos_cassandra_serverless
  cosmos_cassandra_serverless_throughput_limit   = var.cosmos_cassandra_serverless_throughput_limit
  cosmos_cassandra_consistency_level             = var.cosmos_cassandra_consistency_level
  cosmos_cassandra_max_interval_seconds          = var.cosmos_cassandra_max_interval_seconds
  cosmos_cassandra_max_staleness_prefix          = var.cosmos_cassandra_max_staleness_prefix
  cosmos_cassandra_zone_redundant                = var.cosmos_cassandra_zone_redundant
  cosmos_cassandra_additional_locations          = var.cosmos_cassandra_additional_locations
  cosmos_cassandra_public_network_access_enabled = var.cosmos_cassandra_public_network_access_enabled
  cosmos_cassandra_allowed_ip_ranges             = var.cosmos_cassandra_allowed_ip_ranges
  cosmos_cassandra_virtual_network_rules         = var.cosmos_cassandra_virtual_network_rules
  cosmos_cassandra_automatic_failover_enabled    = var.cosmos_cassandra_automatic_failover_enabled
  cosmos_cassandra_backup_type                   = var.cosmos_cassandra_backup_type
  cosmos_cassandra_backup_interval               = var.cosmos_cassandra_backup_interval
  cosmos_cassandra_backup_retention              = var.cosmos_cassandra_backup_retention
  cosmos_cassandra_backup_storage_redundancy     = var.cosmos_cassandra_backup_storage_redundancy
  cosmos_cassandra_enable_free_tier              = var.cosmos_cassandra_enable_free_tier
  cosmos_cassandra_analytical_storage_enabled    = var.cosmos_cassandra_analytical_storage_enabled
  cosmos_cassandra_additional_capabilities       = var.cosmos_cassandra_additional_capabilities
  cosmos_cassandra_private_endpoint_enabled      = var.cosmos_cassandra_private_endpoint_enabled
  cosmos_cassandra_keyspaces                     = var.cosmos_cassandra_keyspaces
  cosmos_cassandra_tables                        = var.cosmos_cassandra_tables
  store_cosmos_keys_in_keyvault                  = var.store_cosmos_keys_in_keyvault

  # Azure Document Intelligence configuration
  document_intelligence_enabled                       = var.document_intelligence_enabled
  document_intelligence_location                      = var.document_intelligence_location
  document_intelligence_sku                           = var.document_intelligence_sku
  document_intelligence_public_network_access_enabled = var.document_intelligence_public_network_access_enabled
  document_intelligence_allowed_ips                   = var.document_intelligence_allowed_ips
  document_intelligence_private_endpoint_enabled      = var.document_intelligence_private_endpoint_enabled
  store_document_intelligence_keys_in_keyvault        = var.store_document_intelligence_keys_in_keyvault

  # Azure Machine Learning workspace configuration
  ml_workspace_enabled                             = var.ml_workspace_enabled
  ml_workspace_location                            = var.ml_workspace_location
  ml_workspace_public_network_access_enabled       = var.ml_workspace_public_network_access_enabled
  ml_workspace_allowed_ips                         = var.ml_workspace_allowed_ips
  ml_workspace_private_endpoint_enabled            = var.ml_workspace_private_endpoint_enabled
  ml_workspace_container_registry_enabled          = var.ml_workspace_container_registry_enabled
  ml_workspace_container_registry_sku              = var.ml_workspace_container_registry_sku
  ml_workspace_storage_replication_type            = var.ml_workspace_storage_replication_type
  ml_workspace_application_insights_retention_days = var.ml_workspace_application_insights_retention_days
  ml_workspace_encryption_enabled                  = var.ml_workspace_encryption_enabled
  ml_workspace_key_vault_purge_protection_enabled  = var.ml_workspace_key_vault_purge_protection_enabled
  ml_workspace_image_build_compute_name            = var.ml_workspace_image_build_compute_name
}
