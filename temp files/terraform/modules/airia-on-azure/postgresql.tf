# PostgreSQL Database Resources
# Provides managed PostgreSQL flexible server with databases, configuration, and private networking

# Private DNS Zone for PostgreSQL
resource "azurerm_private_dns_zone" "postgresql" {
  name                = "privatelink.postgres.database.azure.com"
  resource_group_name = azurerm_resource_group.this.name
  tags                = merge(local.common_tags, { Service = "PostgreSQL" })
}

# Private DNS Zone VNet Link
resource "azurerm_private_dns_zone_virtual_network_link" "postgresql" {
  name                  = "${var.resource_prefix}-postgresql-dns-link-${var.environment}"
  resource_group_name   = azurerm_resource_group.this.name
  private_dns_zone_name = azurerm_private_dns_zone.postgresql.name
  virtual_network_id    = azurerm_virtual_network.this.id
}

# PostgreSQL Flexible Server
resource "azurerm_postgresql_flexible_server" "this" {
  name                   = "${var.resource_prefix}-postgresql-${var.environment}"
  resource_group_name    = azurerm_resource_group.this.name
  location               = azurerm_resource_group.this.location
  version                = var.postgresql_version
  administrator_login    = var.postgresql_admin_username
  administrator_password = var.postgresql_admin_password
  zone                   = var.postgresql_zone

  storage_mb   = var.postgresql_storage_mb
  storage_tier = var.postgresql_storage_tier
  sku_name     = var.postgresql_sku_name

  backup_retention_days         = var.postgresql_backup_retention_days
  geo_redundant_backup_enabled  = var.postgresql_geo_redundant_backup_enabled
  auto_grow_enabled             = var.postgresql_auto_grow_enabled
  public_network_access_enabled = false

  tags = merge(local.common_tags, { Service = "PostgreSQL" })
}

# PostgreSQL Databases
resource "azurerm_postgresql_flexible_server_database" "databases" {
  for_each  = toset(var.postgresql_database_names)
  name      = each.value
  server_id = azurerm_postgresql_flexible_server.this.id
  collation = "en_US.utf8"
  charset   = "utf8"
}

# PostgreSQL Extensions
resource "azurerm_postgresql_flexible_server_configuration" "extensions" {
  name      = "azure.extensions"
  server_id = azurerm_postgresql_flexible_server.this.id
  value     = join(",", var.postgresql_extensions)
}

# PostgreSQL Shared Preload Libraries
resource "azurerm_postgresql_flexible_server_configuration" "shared_preload_libraries" {
  count     = length(var.postgresql_shared_preload_libraries) > 0 ? 1 : 0
  name      = "shared_preload_libraries"
  server_id = azurerm_postgresql_flexible_server.this.id
  value     = join(",", var.postgresql_shared_preload_libraries)
}

# Private Endpoint for PostgreSQL
resource "azurerm_private_endpoint" "postgresql" {
  name                = "${var.resource_prefix}-postgresql-pe-${var.environment}"
  location            = azurerm_resource_group.this.location
  resource_group_name = azurerm_resource_group.this.name
  subnet_id           = azurerm_subnet.private_endpoints.id

  private_service_connection {
    name                           = "${var.resource_prefix}-postgresql-psc-${var.environment}"
    private_connection_resource_id = azurerm_postgresql_flexible_server.this.id
    subresource_names              = ["postgresqlServer"]
    is_manual_connection           = false
  }

  private_dns_zone_group {
    name                 = "${var.resource_prefix}-postgresql-dns-group-${var.environment}"
    private_dns_zone_ids = [azurerm_private_dns_zone.postgresql.id]
  }

  tags = merge(local.common_tags, { Service = "PostgreSQL" })
}