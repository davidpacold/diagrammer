# Core Azure Infrastructure Resources
# Provides the foundational infrastructure including VNet, subnets, AKS cluster, and PostgreSQL database

locals {
  network_contrib_scope   = azurerm_virtual_network.this.id
  mc_resource_group_scope = "/subscriptions/${var.subscription_id}/resourceGroups/${azurerm_kubernetes_cluster.this.node_resource_group}"

  common_tags = merge(
    {
      Environment = var.environment
      ManagedBy   = "Terraform"
      Project     = var.resource_prefix
      Application = var.application
    },
    var.owner != "" ? { Owner = var.owner } : {},
    var.cost_center != "" ? { CostCenter = var.cost_center } : {},
  )
}

# Resource Group
resource "azurerm_resource_group" "this" {
  name     = "${var.resource_prefix}-${var.environment}"
  location = var.location
  tags     = local.common_tags
}