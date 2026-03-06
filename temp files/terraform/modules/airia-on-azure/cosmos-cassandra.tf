# Azure Cosmos DB with Cassandra API Configuration
# This file provisions Azure Cosmos DB with serverless Cassandra API support

# Cosmos DB Account with Cassandra API
resource "azurerm_cosmosdb_account" "cassandra" {
  count               = var.cosmos_cassandra_enabled ? 1 : 0
  name                = "${var.resource_prefix}-cosmos-cassandra-${var.environment}"
  resource_group_name = azurerm_resource_group.this.name
  location            = azurerm_resource_group.this.location
  offer_type          = "Standard"
  kind                = "GlobalDocumentDB"

  # Enable serverless capability for cost optimization
  capacity {
    total_throughput_limit = var.cosmos_cassandra_serverless ? var.cosmos_cassandra_serverless_throughput_limit : -1
  }

  # Cassandra API capabilities
  capabilities {
    name = "EnableCassandra"
  }

  # Enable serverless if specified
  dynamic "capabilities" {
    for_each = var.cosmos_cassandra_serverless ? [1] : []
    content {
      name = "EnableServerless"
    }
  }

  # Additional capabilities
  dynamic "capabilities" {
    for_each = var.cosmos_cassandra_additional_capabilities
    content {
      name = capabilities.value
    }
  }

  # Consistency policy
  consistency_policy {
    consistency_level       = var.cosmos_cassandra_consistency_level
    max_interval_in_seconds = var.cosmos_cassandra_consistency_level == "BoundedStaleness" ? var.cosmos_cassandra_max_interval_seconds : null
    max_staleness_prefix    = var.cosmos_cassandra_consistency_level == "BoundedStaleness" ? var.cosmos_cassandra_max_staleness_prefix : null
  }

  # Geo-location configuration
  geo_location {
    location          = var.cosmos_cassandra_location != "" ? var.cosmos_cassandra_location : azurerm_resource_group.this.location
    failover_priority = 0
    zone_redundant    = var.cosmos_cassandra_zone_redundant
  }

  # Additional geo-locations for multi-region setup
  dynamic "geo_location" {
    for_each = var.cosmos_cassandra_additional_locations
    content {
      location          = geo_location.value.location
      failover_priority = geo_location.value.failover_priority
      zone_redundant    = geo_location.value.zone_redundant
    }
  }

  # Network configuration
  public_network_access_enabled = var.cosmos_cassandra_public_network_access_enabled

  # IP range filter for network security
  ip_range_filter = var.cosmos_cassandra_allowed_ip_ranges

  # Virtual network filter
  is_virtual_network_filter_enabled = length(var.cosmos_cassandra_virtual_network_rules) > 0

  dynamic "virtual_network_rule" {
    for_each = var.cosmos_cassandra_virtual_network_rules
    content {
      id                                   = virtual_network_rule.value.subnet_id
      ignore_missing_vnet_service_endpoint = virtual_network_rule.value.ignore_missing_endpoint
    }
  }

  # Enable automatic failover for high availability
  automatic_failover_enabled = var.cosmos_cassandra_automatic_failover_enabled

  # Backup configuration
  backup {
    type                = var.cosmos_cassandra_backup_type
    interval_in_minutes = var.cosmos_cassandra_backup_type == "Periodic" ? var.cosmos_cassandra_backup_interval : null
    retention_in_hours  = var.cosmos_cassandra_backup_type == "Periodic" ? var.cosmos_cassandra_backup_retention : null
    storage_redundancy  = var.cosmos_cassandra_backup_type == "Periodic" ? var.cosmos_cassandra_backup_storage_redundancy : null
  }

  # Enable free tier if specified (for dev/test environments)
  free_tier_enabled = var.cosmos_cassandra_enable_free_tier

  # Enable analytical storage if needed
  analytical_storage_enabled = var.cosmos_cassandra_analytical_storage_enabled

  # System-assigned managed identity
  identity {
    type = "SystemAssigned"
  }

  tags = merge(local.common_tags, { Service = "CosmosDB" })

  depends_on = [
    azurerm_subnet.aks
  ]
}

# Cassandra Keyspace
resource "azurerm_cosmosdb_cassandra_keyspace" "keyspaces" {
  for_each            = var.cosmos_cassandra_enabled ? var.cosmos_cassandra_keyspaces : {}
  name                = each.key
  resource_group_name = azurerm_resource_group.this.name
  account_name        = azurerm_cosmosdb_account.cassandra[0].name

  # Throughput settings (only for non-serverless)
  throughput = !var.cosmos_cassandra_serverless && each.value.throughput != null ? each.value.throughput : null

  # Autoscale settings (only for non-serverless)
  dynamic "autoscale_settings" {
    for_each = !var.cosmos_cassandra_serverless && each.value.autoscale_max_throughput != null ? [1] : []
    content {
      max_throughput = each.value.autoscale_max_throughput
    }
  }
}

# Cassandra Tables
resource "azurerm_cosmosdb_cassandra_table" "tables" {
  for_each              = var.cosmos_cassandra_enabled ? var.cosmos_cassandra_tables : {}
  name                  = each.value.name
  cassandra_keyspace_id = azurerm_cosmosdb_cassandra_keyspace.keyspaces[each.value.keyspace].id

  # Table schema
  schema {
    # Partition keys
    dynamic "partition_key" {
      for_each = each.value.partition_keys
      content {
        name = partition_key.value
      }
    }

    # Clustering keys  
    dynamic "cluster_key" {
      for_each = each.value.clustering_keys
      content {
        name     = cluster_key.value.name
        order_by = cluster_key.value.order_by
      }
    }

    # Column definitions
    dynamic "column" {
      for_each = each.value.columns
      content {
        name = column.value.name
        type = column.value.type
      }
    }
  }

  # TTL settings
  default_ttl = each.value.default_ttl

  # Throughput settings (only for non-serverless)
  throughput = !var.cosmos_cassandra_serverless && each.value.throughput != null ? each.value.throughput : null

  # Autoscale settings (only for non-serverless)
  dynamic "autoscale_settings" {
    for_each = !var.cosmos_cassandra_serverless && each.value.autoscale_max_throughput != null ? [1] : []
    content {
      max_throughput = each.value.autoscale_max_throughput
    }
  }

  depends_on = [
    azurerm_cosmosdb_cassandra_keyspace.keyspaces
  ]
}

# Private Endpoint for Cosmos DB (optional)
resource "azurerm_private_endpoint" "cosmos_cassandra" {
  count               = var.cosmos_cassandra_enabled && var.cosmos_cassandra_private_endpoint_enabled ? 1 : 0
  name                = "${var.resource_prefix}-cosmos-cassandra-pe-${var.environment}"
  resource_group_name = azurerm_resource_group.this.name
  location            = azurerm_resource_group.this.location
  subnet_id           = azurerm_subnet.private_endpoints.id

  private_service_connection {
    name                           = "${var.resource_prefix}-cosmos-cassandra-psc-${var.environment}"
    private_connection_resource_id = azurerm_cosmosdb_account.cassandra[0].id
    subresource_names              = ["Cassandra"]
    is_manual_connection           = false
  }

  private_dns_zone_group {
    name                 = "${var.resource_prefix}-cosmos-cassandra-dns-${var.environment}"
    private_dns_zone_ids = [azurerm_private_dns_zone.cosmos_cassandra[0].id]
  }

  depends_on = [
    azurerm_subnet.private_endpoints
  ]

  tags = merge(local.common_tags, { Service = "CosmosDB" })
}

# Private DNS Zone for Cosmos DB (optional)
resource "azurerm_private_dns_zone" "cosmos_cassandra" {
  count               = var.cosmos_cassandra_enabled && var.cosmos_cassandra_private_endpoint_enabled ? 1 : 0
  name                = "privatelink.cassandra.cosmos.azure.com"
  resource_group_name = azurerm_resource_group.this.name

  tags = merge(local.common_tags, { Service = "CosmosDB" })
}

# Link Private DNS Zone to VNet (optional)
resource "azurerm_private_dns_zone_virtual_network_link" "cosmos_cassandra" {
  count                 = var.cosmos_cassandra_enabled && var.cosmos_cassandra_private_endpoint_enabled ? 1 : 0
  name                  = "${var.resource_prefix}-cosmos-cassandra-dns-link-${var.environment}"
  resource_group_name   = azurerm_resource_group.this.name
  private_dns_zone_name = azurerm_private_dns_zone.cosmos_cassandra[0].name
  virtual_network_id    = azurerm_virtual_network.this.id
  registration_enabled  = false

  tags = merge(local.common_tags, { Service = "CosmosDB" })
}

# Role assignment for AKS to access Cosmos DB
resource "azurerm_role_assignment" "cosmos_cassandra_aks" {
  count                = var.cosmos_cassandra_enabled ? 1 : 0
  scope                = azurerm_cosmosdb_account.cassandra[0].id
  role_definition_name = "Cosmos DB Account Reader Role"
  principal_id         = azurerm_kubernetes_cluster.this.identity[0].principal_id
}

# Store Cosmos DB connection details in Key Vault (optional)
resource "azurerm_key_vault_secret" "cosmos_cassandra_endpoint" {
  count        = var.cosmos_cassandra_enabled && var.store_cosmos_keys_in_keyvault ? 1 : 0
  name         = "cosmos-cassandra-endpoint"
  value        = azurerm_cosmosdb_account.cassandra[0].endpoint
  key_vault_id = var.key_vault_id

  depends_on = [azurerm_cosmosdb_account.cassandra]
}

resource "azurerm_key_vault_secret" "cosmos_cassandra_primary_key" {
  count        = var.cosmos_cassandra_enabled && var.store_cosmos_keys_in_keyvault ? 1 : 0
  name         = "cosmos-cassandra-primary-key"
  value        = azurerm_cosmosdb_account.cassandra[0].primary_key
  key_vault_id = var.key_vault_id

  depends_on = [azurerm_cosmosdb_account.cassandra]
}

# Connection strings stored as individual components since connection_strings is not directly available
resource "azurerm_key_vault_secret" "cosmos_cassandra_connection_info" {
  count = var.cosmos_cassandra_enabled && var.store_cosmos_keys_in_keyvault ? 1 : 0
  name  = "cosmos-cassandra-connection-info"
  value = jsonencode({
    contact_point = "${azurerm_cosmosdb_account.cassandra[0].name}.cassandra.cosmos.azure.com"
    port          = 10350
    username      = azurerm_cosmosdb_account.cassandra[0].name
    ssl_enabled   = true
  })
  key_vault_id = var.key_vault_id

  depends_on = [azurerm_cosmosdb_account.cassandra]
}