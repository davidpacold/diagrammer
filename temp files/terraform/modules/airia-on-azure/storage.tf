# Azure Storage Resources
# Provides blob storage account and containers for application data

# Storage Account
resource "azurerm_storage_account" "this" {
  name                             = substr(lower(replace(replace("${var.resource_prefix}${var.environment}sa", "-", ""), "_", "")), 0, 24)
  resource_group_name              = azurerm_resource_group.this.name
  location                         = azurerm_resource_group.this.location
  account_tier                     = "Standard"
  account_replication_type         = "LRS"
  account_kind                     = "StorageV2"
  https_traffic_only_enabled       = true
  public_network_access_enabled    = false
  cross_tenant_replication_enabled = false
  allow_nested_items_to_be_public  = false
  min_tls_version                  = "TLS1_2"

  # Network rules - access is via private endpoint only
  network_rules {
    default_action = "Deny"
    bypass         = ["AzureServices"]
  }

  blob_properties {
    versioning_enabled  = false
    change_feed_enabled = false

    # Optional: Configure retention policies for data protection
    # Only enabled if retention days > 0 (incurs additional storage costs)
    dynamic "delete_retention_policy" {
      for_each = var.storage_blob_retention_days > 0 ? [1] : []
      content {
        days = var.storage_blob_retention_days
      }
    }

    dynamic "container_delete_retention_policy" {
      for_each = var.storage_container_retention_days > 0 ? [1] : []
      content {
        days = var.storage_container_retention_days
      }
    }
  }

  # Identity for managed access
  identity {
    type = "SystemAssigned"
  }

  tags = merge(local.common_tags, { Service = "Storage" })
}

# Storage Container(s)
resource "azurerm_storage_container" "this" {
  for_each           = toset(var.storage_containers)
  name               = each.key
  storage_account_id = azurerm_storage_account.this.id

  # Default to private access for security
  container_access_type = "private"
}

# Private DNS Zone for Blob Storage
resource "azurerm_private_dns_zone" "blob" {
  name                = "privatelink.blob.core.windows.net"
  resource_group_name = azurerm_resource_group.this.name

  tags = merge(local.common_tags, { Service = "Storage" })
}

# Link Private DNS Zone to VNet
resource "azurerm_private_dns_zone_virtual_network_link" "blob" {
  name                  = "${var.resource_prefix}-blob-dns-link-${var.environment}"
  resource_group_name   = azurerm_resource_group.this.name
  private_dns_zone_name = azurerm_private_dns_zone.blob.name
  virtual_network_id    = azurerm_virtual_network.this.id

  tags = merge(local.common_tags, { Service = "Storage" })
}

# Private Endpoint for Blob Storage
resource "azurerm_private_endpoint" "blob" {
  name                = "${var.resource_prefix}-blob-pe-${var.environment}"
  location            = azurerm_resource_group.this.location
  resource_group_name = azurerm_resource_group.this.name
  subnet_id           = azurerm_subnet.private_endpoints.id

  private_service_connection {
    name                           = "${var.resource_prefix}-blob-psc-${var.environment}"
    private_connection_resource_id = azurerm_storage_account.this.id
    subresource_names              = ["blob"]
    is_manual_connection           = false
  }

  private_dns_zone_group {
    name                 = "${var.resource_prefix}-blob-dns-group-${var.environment}"
    private_dns_zone_ids = [azurerm_private_dns_zone.blob.id]
  }

  tags = merge(local.common_tags, { Service = "Storage" })
}