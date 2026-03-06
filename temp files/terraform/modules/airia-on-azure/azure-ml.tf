# Data source for current Azure client configuration
data "azurerm_client_config" "current" {}

# Application Insights for ML Workspace
resource "azurerm_application_insights" "ml" {
  count               = var.ml_workspace_enabled ? 1 : 0
  name                = "${var.resource_prefix}-ml-appinsights-${var.environment}"
  location            = var.ml_workspace_location != "" ? var.ml_workspace_location : var.location
  resource_group_name = azurerm_resource_group.this.name
  application_type    = "web"
  retention_in_days   = var.ml_workspace_application_insights_retention_days

  tags = merge(local.common_tags, { Service = "MachineLearning" })
}

# Key Vault for ML Workspace
resource "azurerm_key_vault" "ml" {
  count                      = var.ml_workspace_enabled ? 1 : 0
  name                       = "${var.resource_prefix}mlkv${replace(var.environment, "-", "")}"
  location                   = var.ml_workspace_location != "" ? var.ml_workspace_location : var.location
  resource_group_name        = azurerm_resource_group.this.name
  tenant_id                  = data.azurerm_client_config.current.tenant_id
  sku_name                   = "standard"
  soft_delete_retention_days = 7
  purge_protection_enabled   = var.ml_workspace_key_vault_purge_protection_enabled

  public_network_access_enabled = var.ml_workspace_public_network_access_enabled
  rbac_authorization_enabled    = true # Use RBAC instead of access policies to avoid circular dependencies

  tags = merge(local.common_tags, { Service = "MachineLearning" })
}

# Storage Account for ML Workspace
resource "azurerm_storage_account" "ml" {
  count                    = var.ml_workspace_enabled ? 1 : 0
  name                     = "${var.resource_prefix}mlsa${replace(var.environment, "-", "")}"
  resource_group_name      = azurerm_resource_group.this.name
  location                 = var.ml_workspace_location != "" ? var.ml_workspace_location : var.location
  account_tier             = "Standard"
  account_replication_type = var.ml_workspace_storage_replication_type
  account_kind             = "StorageV2"

  public_network_access_enabled   = var.ml_workspace_public_network_access_enabled
  allow_nested_items_to_be_public = false

  network_rules {
    default_action = var.ml_workspace_public_network_access_enabled ? "Allow" : "Deny"
    bypass         = ["AzureServices"]
    ip_rules       = var.ml_workspace_allowed_ips
  }

  tags = merge(local.common_tags, { Service = "MachineLearning" })
}

# Container Registry for ML Workspace (optional)
resource "azurerm_container_registry" "ml" {
  count               = var.ml_workspace_enabled && var.ml_workspace_container_registry_enabled ? 1 : 0
  name                = "${var.resource_prefix}mlacr${replace(var.environment, "-", "")}"
  resource_group_name = azurerm_resource_group.this.name
  location            = var.ml_workspace_location != "" ? var.ml_workspace_location : var.location
  sku                 = var.ml_workspace_container_registry_sku
  admin_enabled       = false

  public_network_access_enabled = var.ml_workspace_public_network_access_enabled

  tags = merge(local.common_tags, { Service = "MachineLearning" })
}

# Azure Machine Learning Workspace for Serverless Endpoints (e.g., Llama models)
resource "azurerm_machine_learning_workspace" "this" {
  count                   = var.ml_workspace_enabled ? 1 : 0
  name                    = "${var.resource_prefix}-ml-${var.environment}"
  location                = var.ml_workspace_location != "" ? var.ml_workspace_location : var.location
  resource_group_name     = azurerm_resource_group.this.name
  application_insights_id = azurerm_application_insights.ml[0].id
  key_vault_id            = azurerm_key_vault.ml[0].id
  storage_account_id      = azurerm_storage_account.ml[0].id
  container_registry_id   = var.ml_workspace_container_registry_enabled ? azurerm_container_registry.ml[0].id : null

  public_network_access_enabled = var.ml_workspace_public_network_access_enabled
  image_build_compute_name      = var.ml_workspace_image_build_compute_name

  identity {
    type = "SystemAssigned"
  }

  # Encryption configuration removed to avoid circular dependency
  # Customer-managed keys can be configured post-deployment if needed

  tags = merge(local.common_tags, { Service = "MachineLearning" })

  depends_on = [
    azurerm_application_insights.ml,
    azurerm_key_vault.ml,
    azurerm_storage_account.ml,
    azurerm_container_registry.ml
  ]
}

# Note: Customer-managed encryption keys for ML workspace can be configured
# post-deployment to avoid Terraform circular dependencies

# Private Endpoint for ML Workspace (if enabled)
resource "azurerm_private_endpoint" "ml" {
  count               = var.ml_workspace_enabled && var.ml_workspace_private_endpoint_enabled ? 1 : 0
  name                = "${var.resource_prefix}-ml-pe-${var.environment}"
  location            = var.location
  resource_group_name = azurerm_resource_group.this.name
  subnet_id           = azurerm_subnet.private_endpoints.id

  private_service_connection {
    name                           = "${var.resource_prefix}-ml-psc-${var.environment}"
    private_connection_resource_id = azurerm_machine_learning_workspace.this[0].id
    is_manual_connection           = false
    subresource_names              = ["amlworkspace"]
  }

  private_dns_zone_group {
    name                 = "default"
    private_dns_zone_ids = [azurerm_private_dns_zone.ml[0].id]
  }

  depends_on = [
    azurerm_subnet.private_endpoints
  ]

  tags = merge(local.common_tags, { Service = "MachineLearning" })
}

# Private DNS Zone for ML Workspace
resource "azurerm_private_dns_zone" "ml" {
  count               = var.ml_workspace_enabled && var.ml_workspace_private_endpoint_enabled ? 1 : 0
  name                = "privatelink.api.azureml.ms"
  resource_group_name = azurerm_resource_group.this.name

  tags = merge(local.common_tags, { Service = "MachineLearning" })
}

# Link Private DNS Zone to VNet
resource "azurerm_private_dns_zone_virtual_network_link" "ml" {
  count                 = var.ml_workspace_enabled && var.ml_workspace_private_endpoint_enabled ? 1 : 0
  name                  = "${var.resource_prefix}-ml-dns-link-${var.environment}"
  resource_group_name   = azurerm_resource_group.this.name
  private_dns_zone_name = azurerm_private_dns_zone.ml[0].name
  virtual_network_id    = azurerm_virtual_network.this.id
  registration_enabled  = false

  tags = merge(local.common_tags, { Service = "MachineLearning" })
}