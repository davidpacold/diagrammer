# Azure Cognitive Services Account for Document Intelligence (Form Recognizer)
resource "azurerm_cognitive_account" "document_intelligence" {
  count               = var.document_intelligence_enabled ? 1 : 0
  name                = "${var.resource_prefix}-doc-intelligence-${var.environment}"
  location            = var.document_intelligence_location != "" ? var.document_intelligence_location : var.location
  resource_group_name = azurerm_resource_group.this.name
  kind                = "FormRecognizer"
  sku_name            = var.document_intelligence_sku

  public_network_access_enabled = var.document_intelligence_public_network_access_enabled
  local_auth_enabled            = true
  custom_subdomain_name         = "${var.resource_prefix}-doc-intelligence-${var.environment}"

  network_acls {
    default_action = var.document_intelligence_public_network_access_enabled ? "Allow" : "Deny"
    ip_rules       = var.document_intelligence_allowed_ips
  }

  tags = merge(local.common_tags, { Service = "DocumentIntelligence" })
}

# Private Endpoint for Document Intelligence (if enabled)
resource "azurerm_private_endpoint" "document_intelligence" {
  count               = var.document_intelligence_enabled && var.document_intelligence_private_endpoint_enabled ? 1 : 0
  name                = "${var.resource_prefix}-doc-intelligence-pe-${var.environment}"
  location            = var.location
  resource_group_name = azurerm_resource_group.this.name
  subnet_id           = azurerm_subnet.private_endpoints.id

  private_service_connection {
    name                           = "${var.resource_prefix}-doc-intelligence-psc-${var.environment}"
    private_connection_resource_id = azurerm_cognitive_account.document_intelligence[0].id
    is_manual_connection           = false
    subresource_names              = ["account"]
  }

  private_dns_zone_group {
    name                 = "default"
    private_dns_zone_ids = [azurerm_private_dns_zone.document_intelligence[0].id]
  }

  depends_on = [
    azurerm_subnet.private_endpoints
  ]

  tags = merge(local.common_tags, { Service = "DocumentIntelligence" })
}

# Private DNS Zone for Document Intelligence
resource "azurerm_private_dns_zone" "document_intelligence" {
  count               = var.document_intelligence_enabled && var.document_intelligence_private_endpoint_enabled ? 1 : 0
  name                = "privatelink.cognitiveservices.azure.com"
  resource_group_name = azurerm_resource_group.this.name

  tags = merge(local.common_tags, { Service = "DocumentIntelligence" })
}

# Link Private DNS Zone to VNet
resource "azurerm_private_dns_zone_virtual_network_link" "document_intelligence" {
  count                 = var.document_intelligence_enabled && var.document_intelligence_private_endpoint_enabled ? 1 : 0
  name                  = "${var.resource_prefix}-doc-intelligence-dns-link-${var.environment}"
  resource_group_name   = azurerm_resource_group.this.name
  private_dns_zone_name = azurerm_private_dns_zone.document_intelligence[0].name
  virtual_network_id    = azurerm_virtual_network.this.id
  registration_enabled  = false

  tags = merge(local.common_tags, { Service = "DocumentIntelligence" })
}

# Store Document Intelligence keys in Key Vault (optional)
resource "azurerm_key_vault_secret" "document_intelligence_endpoint" {
  count        = var.document_intelligence_enabled && var.store_document_intelligence_keys_in_keyvault && var.key_vault_id != "" ? 1 : 0
  name         = "document-intelligence-endpoint"
  value        = azurerm_cognitive_account.document_intelligence[0].endpoint
  key_vault_id = var.key_vault_id

  depends_on = [azurerm_cognitive_account.document_intelligence]

  tags = merge(local.common_tags, { Service = "DocumentIntelligence" })
}

resource "azurerm_key_vault_secret" "document_intelligence_key" {
  count        = var.document_intelligence_enabled && var.store_document_intelligence_keys_in_keyvault && var.key_vault_id != "" ? 1 : 0
  name         = "document-intelligence-key"
  value        = azurerm_cognitive_account.document_intelligence[0].primary_access_key
  key_vault_id = var.key_vault_id

  depends_on = [azurerm_cognitive_account.document_intelligence]

  tags = merge(local.common_tags, { Service = "DocumentIntelligence" })
}