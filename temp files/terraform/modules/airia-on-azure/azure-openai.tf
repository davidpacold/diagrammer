# Azure OpenAI Service Configuration
# This file provisions Azure OpenAI Service with GPT-4.1 series model deployments

# Azure Cognitive Services Account for OpenAI
resource "azurerm_cognitive_account" "openai" {
  count               = var.openai_enabled ? 1 : 0
  name                = "${var.resource_prefix}-openai-${var.environment}"
  resource_group_name = azurerm_resource_group.this.name
  location            = var.openai_location != "" ? var.openai_location : azurerm_resource_group.this.location
  kind                = "OpenAI"
  sku_name            = var.openai_sku

  # Custom subdomain for the OpenAI endpoint
  custom_subdomain_name = "${var.resource_prefix}-openai-${var.environment}"

  # Network configuration
  public_network_access_enabled = var.openai_public_network_access_enabled

  dynamic "network_acls" {
    for_each = var.openai_public_network_access_enabled ? [] : [1]
    content {
      default_action = "Deny"

      # Allow access from AKS subnet
      virtual_network_rules {
        subnet_id                            = azurerm_subnet.aks.id
        ignore_missing_vnet_service_endpoint = false
      }

      # Optionally allow specific IP ranges
      ip_rules = var.openai_allowed_ips
    }
  }

  identity {
    type = "SystemAssigned"
  }

  tags = merge(local.common_tags, { Service = "OpenAI" })
}

# GPT-4.1 Mini Model Deployment
resource "azurerm_cognitive_deployment" "gpt_4_1_mini" {
  count                = var.openai_enabled ? 1 : 0
  name                 = "gpt-4.1-mini"
  cognitive_account_id = azurerm_cognitive_account.openai[0].id

  model {
    format  = "OpenAI"
    name    = "gpt-4.1-mini"
    version = var.gpt_4_1_mini_version
  }

  sku {
    name     = "Standard"
    capacity = var.gpt_4_1_mini_capacity # Capacity in thousands of tokens per minute (TPM)
  }

  rai_policy_name = var.openai_rai_policy
}

# GPT-4.1 Model Deployment (full version)
resource "azurerm_cognitive_deployment" "gpt_4_1" {
  count                = var.openai_enabled && var.deploy_gpt_4_1 ? 1 : 0
  name                 = "gpt-4.1"
  cognitive_account_id = azurerm_cognitive_account.openai[0].id

  model {
    format  = "OpenAI"
    name    = "gpt-4.1"
    version = var.gpt_4_1_version
  }

  sku {
    name     = "Standard"
    capacity = var.gpt_4_1_capacity
  }

  rai_policy_name = var.openai_rai_policy
}

# Text Embedding Model Deployment
resource "azurerm_cognitive_deployment" "text_embedding" {
  count                = var.openai_enabled && var.deploy_text_embedding ? 1 : 0
  name                 = "text-embedding-3-large"
  cognitive_account_id = azurerm_cognitive_account.openai[0].id

  model {
    format  = "OpenAI"
    name    = "text-embedding-3-large"
    version = var.text_embedding_version
  }

  sku {
    name     = "Standard"
    capacity = var.text_embedding_capacity
  }
}

# Private Endpoint for Azure OpenAI (optional)
resource "azurerm_private_endpoint" "openai" {
  count               = var.openai_enabled && var.openai_private_endpoint_enabled ? 1 : 0
  name                = "${var.resource_prefix}-openai-pe-${var.environment}"
  resource_group_name = azurerm_resource_group.this.name
  location            = azurerm_resource_group.this.location
  subnet_id           = azurerm_subnet.private_endpoints.id

  private_service_connection {
    name                           = "${var.resource_prefix}-openai-psc-${var.environment}"
    private_connection_resource_id = azurerm_cognitive_account.openai[0].id
    subresource_names              = ["account"]
    is_manual_connection           = false
  }

  private_dns_zone_group {
    name                 = "${var.resource_prefix}-openai-dns-${var.environment}"
    private_dns_zone_ids = [azurerm_private_dns_zone.openai[0].id]
  }

  depends_on = [
    azurerm_subnet.private_endpoints
  ]

  tags = merge(local.common_tags, { Service = "OpenAI" })
}

# Private DNS Zone for OpenAI (optional)
resource "azurerm_private_dns_zone" "openai" {
  count               = var.openai_enabled && var.openai_private_endpoint_enabled ? 1 : 0
  name                = "privatelink.openai.azure.com"
  resource_group_name = azurerm_resource_group.this.name

  tags = merge(local.common_tags, { Service = "OpenAI" })
}

# Link Private DNS Zone to VNet (optional)
resource "azurerm_private_dns_zone_virtual_network_link" "openai" {
  count                 = var.openai_enabled && var.openai_private_endpoint_enabled ? 1 : 0
  name                  = "${var.resource_prefix}-openai-dns-link-${var.environment}"
  resource_group_name   = azurerm_resource_group.this.name
  private_dns_zone_name = azurerm_private_dns_zone.openai[0].name
  virtual_network_id    = azurerm_virtual_network.this.id
  registration_enabled  = false

  tags = merge(local.common_tags, { Service = "OpenAI" })
}

# Store OpenAI connection details in Key Vault (optional)
resource "azurerm_key_vault_secret" "openai_endpoint" {
  count        = var.openai_enabled && var.store_openai_keys_in_keyvault ? 1 : 0
  name         = "openai-endpoint"
  value        = azurerm_cognitive_account.openai[0].endpoint
  key_vault_id = var.key_vault_id

  depends_on = [azurerm_cognitive_account.openai]
}

resource "azurerm_key_vault_secret" "openai_key" {
  count        = var.openai_enabled && var.store_openai_keys_in_keyvault ? 1 : 0
  name         = "openai-primary-key"
  value        = azurerm_cognitive_account.openai[0].primary_access_key
  key_vault_id = var.key_vault_id

  depends_on = [azurerm_cognitive_account.openai]
}
