# Azure Kubernetes Service (AKS) Resources
# Provides managed Kubernetes cluster with associated role assignments and node pools

# AKS Cluster
resource "azurerm_kubernetes_cluster" "this" {
  name                              = "${var.resource_prefix}-aks-${var.environment}"
  location                          = azurerm_resource_group.this.location
  resource_group_name               = azurerm_resource_group.this.name
  dns_prefix                        = "${var.resource_prefix}-${var.environment}"
  kubernetes_version                = var.kubernetes_version
  role_based_access_control_enabled = true
  oidc_issuer_enabled               = var.aks_oidc_issuer_enabled

  default_node_pool {
    temporary_name_for_rotation = var.default_node_pool.temporary_name_for_rotation
    name                        = var.default_node_pool.name
    node_count                  = var.default_node_pool.auto_scaling_enabled ? null : var.default_node_pool.node_count
    auto_scaling_enabled        = var.default_node_pool.auto_scaling_enabled
    min_count                   = var.default_node_pool.auto_scaling_enabled ? var.default_node_pool.min_count : null
    max_count                   = var.default_node_pool.auto_scaling_enabled ? var.default_node_pool.max_count : null
    vm_size                     = var.default_node_pool.vm_size
    vnet_subnet_id              = azurerm_subnet.aks.id
    zones                       = var.default_node_pool.zones
    max_pods                    = var.default_node_pool.max_pods

    upgrade_settings {
      max_surge = var.default_node_pool.max_surge
    }
  }

  identity {
    type = "SystemAssigned"
  }

  network_profile {
    network_plugin = "azure"
    dns_service_ip = var.aks_dns_service_ip
    service_cidr   = var.aks_service_cidr
  }

  tags = merge(local.common_tags, { Service = "Kubernetes" })
}

# Additional Node Pools
resource "azurerm_kubernetes_cluster_node_pool" "additional" {
  for_each              = var.additional_node_pools
  kubernetes_cluster_id = azurerm_kubernetes_cluster.this.id
  vnet_subnet_id        = azurerm_subnet.aks.id
  name                  = each.value.name
  vm_size               = each.value.vm_size
  os_disk_size_gb       = each.value.os_disk_size_gb
  os_disk_type          = each.value.os_disk_type
  zones                 = each.value.zones
  auto_scaling_enabled  = each.value.auto_scaling_enabled
  min_count             = each.value.auto_scaling_enabled ? each.value.min_count : null
  max_count             = each.value.auto_scaling_enabled ? each.value.max_count : null
  node_count            = each.value.node_count
  node_taints           = each.value.node_taints
  node_labels           = each.value.node_labels
  max_pods              = each.value.max_pods
  gpu_driver            = each.value.gpu_driver

  upgrade_settings {
    max_surge = each.value.max_surge
  }

  lifecycle {
    ignore_changes = [
      node_count
    ]
  }
}

# Grant Network Contributor rights to the AKS cluster identity
resource "azurerm_role_assignment" "this" {
  scope                = local.network_contrib_scope
  role_definition_name = "Network Contributor"
  principal_id         = azurerm_kubernetes_cluster.this.identity[0].principal_id
}

# Grant Network Contributor rights to the MC_ resource group
resource "azurerm_role_assignment" "mc_resource_group" {
  scope                = local.mc_resource_group_scope
  role_definition_name = "Network Contributor"
  principal_id         = azurerm_kubernetes_cluster.this.identity[0].principal_id
}

# Role assignment to allow AKS managed identity access to storage
resource "azurerm_role_assignment" "aks_storage_blob_data_contributor" {
  scope                = azurerm_storage_account.this.id
  role_definition_name = "Storage Blob Data Contributor"
  principal_id         = azurerm_kubernetes_cluster.this.identity[0].principal_id

  depends_on = [azurerm_kubernetes_cluster.this, azurerm_storage_account.this]
}