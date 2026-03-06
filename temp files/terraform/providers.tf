terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.35"
    }
  }
  required_version = ">= 1.12"
}

provider "azurerm" {
  subscription_id = var.subscription_id

  features {
    resource_group {
      # Allows Terraform to destroy a resource group even when it contains resources
      # not managed by Terraform. Required for clean tear-down of AKS (which creates
      # its own node resource group with Azure-managed resources).
      prevent_deletion_if_contains_resources = false
    }
  }
}
