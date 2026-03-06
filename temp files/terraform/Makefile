.PHONY: check-env init plan apply destroy validate

# Load .env file if it exists
ifneq (,$(wildcard .env))
    include .env
    export
endif

# Check required environment variables
check-env:
	@echo "Checking required environment variables..."
	@if [ -f .env ]; then echo "✓ Loading environment variables from .env file"; fi
	@if [ -n "$$ARM_CLIENT_ID" ] && [ -n "$$ARM_CLIENT_SECRET" ] && [ -n "$$ARM_SUBSCRIPTION_ID" ] && [ -n "$$ARM_TENANT_ID" ]; then \
		echo "✓ Azure service principal authentication configured"; \
	else \
		echo "ℹ Azure CLI authentication will be used (service principal not configured)"; \
	fi

# Initialize Terraform
init: check-env
	@echo "Initializing Terraform..."
	terraform init

# Plan deployment
plan: check-env
	@echo "Planning Terraform deployment..."
	terraform plan -var-file=terraform.tfvars

# Apply deployment
apply: check-env
	@echo "Applying Terraform deployment..."
	terraform apply -var-file=terraform.tfvars

# Destroy deployment
destroy: check-env
	@echo "Destroying Terraform deployment..."
	terraform destroy -var-file=terraform.tfvars

# Validate configuration
validate: check-env
	@echo "Validating Terraform configuration..."
	terraform validate

# Show help
help:
	@echo "Available targets:"
	@echo "  init      - Initialize Terraform"
	@echo "  plan      - Plan Terraform deployment"
	@echo "  apply     - Apply Terraform deployment"
	@echo "  destroy   - Destroy Terraform deployment"
	@echo "  validate  - Validate Terraform configuration"
	@echo "  check-env - Check required environment variables"
	@echo ""
	@echo "Required environment variables:"
	@echo "  TF_VAR_postgresql_admin_password - PostgreSQL admin password"
	@echo ""
	@echo "Optional environment variables (for service principal auth):"
	@echo "  ARM_CLIENT_ID       - Azure service principal client ID"
	@echo "  ARM_CLIENT_SECRET   - Azure service principal client secret"
	@echo "  ARM_SUBSCRIPTION_ID - Azure subscription ID"
	@echo "  ARM_TENANT_ID       - Azure tenant ID"