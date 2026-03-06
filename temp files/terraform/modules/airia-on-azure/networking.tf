# Network Infrastructure Resources
# Provides VNet, subnets, and network security configuration for the Azure infrastructure

# Virtual Network
resource "azurerm_virtual_network" "this" {
  name                = "${var.resource_prefix}-vnet-${var.environment}"
  address_space       = [var.vnet_address_space]
  location            = azurerm_resource_group.this.location
  resource_group_name = azurerm_resource_group.this.name
  tags                = merge(local.common_tags, { Service = "Networking" })
}

# Subnet for AKS
resource "azurerm_subnet" "aks" {
  name                 = "${var.resource_prefix}-aks-subnet-${var.environment}"
  resource_group_name  = azurerm_resource_group.this.name
  virtual_network_name = azurerm_virtual_network.this.name
  address_prefixes     = [var.aks_subnet_address_prefix]
  service_endpoints    = ["Microsoft.AzureCosmosDB", "Microsoft.Storage", "Microsoft.CognitiveServices"]
}

# Subnet for Private Endpoints
resource "azurerm_subnet" "private_endpoints" {
  name                                          = "${var.resource_prefix}-private-endpoints-subnet-${var.environment}"
  resource_group_name                           = azurerm_resource_group.this.name
  virtual_network_name                          = azurerm_virtual_network.this.name
  address_prefixes                              = [var.private_endpoints_subnet_address_prefix]
  private_link_service_network_policies_enabled = false
}

# Network Security Group
resource "azurerm_network_security_group" "this" {
  name                = "${var.resource_prefix}-nsg-${var.environment}"
  location            = azurerm_resource_group.this.location
  resource_group_name = azurerm_resource_group.this.name
  tags                = merge(local.common_tags, { Service = "Networking" })
}

# Associates AKS subnet with the NSG
resource "azurerm_subnet_network_security_group_association" "this" {
  subnet_id                 = azurerm_subnet.aks.id
  network_security_group_id = azurerm_network_security_group.this.id

  depends_on = [azurerm_network_security_group.this, azurerm_subnet.aks]
}

# Network Security Rules - Allow inbound HTTP/HTTPS only from Application Gateway subnet
resource "azurerm_network_security_rule" "vnet_nsr" {
  name                        = "${var.resource_prefix}-nsr-client-${var.environment}"
  priority                    = 105
  direction                   = "Inbound"
  access                      = "Allow"
  protocol                    = "Tcp"
  source_port_range           = "*"
  destination_port_ranges     = ["80", "443"]
  source_address_prefix       = var.appgw_subnet_address_prefix
  destination_address_prefix  = "VirtualNetwork"
  resource_group_name         = azurerm_resource_group.this.name
  network_security_group_name = azurerm_network_security_group.this.name
}

# Network Security Rule for Load Balancer
resource "azurerm_network_security_rule" "lb_nsr" {
  name                        = "${var.resource_prefix}-nsr-load-balancer-${var.environment}"
  priority                    = 106
  direction                   = "Inbound"
  access                      = "Allow"
  protocol                    = "Tcp"
  source_port_range           = "*"
  destination_port_range      = "6390"
  source_address_prefix       = "AzureLoadBalancer"
  destination_address_prefix  = "VirtualNetwork"
  resource_group_name         = azurerm_resource_group.this.name
  network_security_group_name = azurerm_network_security_group.this.name
}

# Network Security Rule for Traffic Manager
resource "azurerm_network_security_rule" "traffic_manager_nsr" {
  name                        = "${var.resource_prefix}-nsr-traffic-manager-${var.environment}"
  priority                    = 107
  direction                   = "Inbound"
  access                      = "Allow"
  protocol                    = "Tcp"
  source_port_range           = "*"
  destination_port_range      = "443"
  source_address_prefix       = "AzureTrafficManager"
  destination_address_prefix  = "VirtualNetwork"
  resource_group_name         = azurerm_resource_group.this.name
  network_security_group_name = azurerm_network_security_group.this.name
}

# Application Gateway Network Security Group
resource "azurerm_network_security_group" "appgw" {
  name                = "${var.resource_prefix}-appgw-nsg-${var.environment}"
  location            = azurerm_resource_group.this.location
  resource_group_name = azurerm_resource_group.this.name
  tags                = merge(local.common_tags, { Service = "Networking" })
}

# Associates Application Gateway subnet with its NSG
resource "azurerm_subnet_network_security_group_association" "appgw" {
  subnet_id                 = azurerm_subnet.appgw.id
  network_security_group_id = azurerm_network_security_group.appgw.id

  depends_on = [
    azurerm_network_security_group.appgw,
    azurerm_subnet.appgw,
    azurerm_network_security_rule.appgw_http_inbound,
    azurerm_network_security_rule.appgw_https_inbound,
    azurerm_network_security_rule.appgw_gateway_manager,
    azurerm_network_security_rule.appgw_lb_inbound,
  ]
}

# Allow inbound HTTP traffic to Application Gateway
resource "azurerm_network_security_rule" "appgw_http_inbound" {
  name                        = "${var.resource_prefix}-appgw-http-inbound-${var.environment}"
  priority                    = 100
  direction                   = "Inbound"
  access                      = "Allow"
  protocol                    = "Tcp"
  source_port_range           = "*"
  destination_port_range      = "80"
  source_address_prefix       = "Internet"
  destination_address_prefix  = "*"
  resource_group_name         = azurerm_resource_group.this.name
  network_security_group_name = azurerm_network_security_group.appgw.name
}

# Allow inbound HTTPS traffic to Application Gateway
resource "azurerm_network_security_rule" "appgw_https_inbound" {
  name                        = "${var.resource_prefix}-appgw-https-inbound-${var.environment}"
  priority                    = 101
  direction                   = "Inbound"
  access                      = "Allow"
  protocol                    = "Tcp"
  source_port_range           = "*"
  destination_port_range      = "443"
  source_address_prefix       = "Internet"
  destination_address_prefix  = "*"
  resource_group_name         = azurerm_resource_group.this.name
  network_security_group_name = azurerm_network_security_group.appgw.name
}

# Required: Allow Azure Gateway Manager for AppGW v2 health probes
resource "azurerm_network_security_rule" "appgw_gateway_manager" {
  name                        = "${var.resource_prefix}-appgw-gateway-manager-${var.environment}"
  priority                    = 102
  direction                   = "Inbound"
  access                      = "Allow"
  protocol                    = "Tcp"
  source_port_range           = "*"
  destination_port_range      = "65200-65535"
  source_address_prefix       = "Internet"
  destination_address_prefix  = "*"
  resource_group_name         = azurerm_resource_group.this.name
  network_security_group_name = azurerm_network_security_group.appgw.name
}

# Allow Azure Load Balancer health probes
resource "azurerm_network_security_rule" "appgw_lb_inbound" {
  name                        = "${var.resource_prefix}-appgw-lb-inbound-${var.environment}"
  priority                    = 103
  direction                   = "Inbound"
  access                      = "Allow"
  protocol                    = "*"
  source_port_range           = "*"
  destination_port_range      = "*"
  source_address_prefix       = "AzureLoadBalancer"
  destination_address_prefix  = "*"
  resource_group_name         = azurerm_resource_group.this.name
  network_security_group_name = azurerm_network_security_group.appgw.name
}

# Network Security Rule for AKS to PostgreSQL access
resource "azurerm_network_security_rule" "aks_to_postgresql_nsr" {
  name                        = "${var.resource_prefix}-nsr-aks-postgresql-${var.environment}"
  priority                    = 108
  direction                   = "Outbound"
  access                      = "Allow"
  protocol                    = "Tcp"
  source_port_range           = "*"
  destination_port_range      = "5432"
  source_address_prefix       = var.aks_subnet_address_prefix
  destination_address_prefix  = var.private_endpoints_subnet_address_prefix
  resource_group_name         = azurerm_resource_group.this.name
  network_security_group_name = azurerm_network_security_group.this.name
}

# Network Security Rule for AKS to Cosmos DB access
resource "azurerm_network_security_rule" "aks_to_cosmos_nsr" {
  name                        = "${var.resource_prefix}-nsr-aks-cosmos-${var.environment}"
  priority                    = 109
  direction                   = "Outbound"
  access                      = "Allow"
  protocol                    = "Tcp"
  source_port_range           = "*"
  destination_port_range      = "10350"
  source_address_prefix       = var.aks_subnet_address_prefix
  destination_address_prefix  = "AzureCosmosDB"
  resource_group_name         = azurerm_resource_group.this.name
  network_security_group_name = azurerm_network_security_group.this.name
}

# Network Security Rule for AKS to AI services access
resource "azurerm_network_security_rule" "aks_to_ai_services_nsr" {
  name                        = "${var.resource_prefix}-nsr-aks-ai-services-${var.environment}"
  priority                    = 110
  direction                   = "Outbound"
  access                      = "Allow"
  protocol                    = "Tcp"
  source_port_range           = "*"
  destination_port_range      = "443"
  source_address_prefix       = var.aks_subnet_address_prefix
  destination_address_prefix  = "CognitiveServicesManagement"
  resource_group_name         = azurerm_resource_group.this.name
  network_security_group_name = azurerm_network_security_group.this.name
}

# Network Security Rule for AKS to Azure ML workspace access
resource "azurerm_network_security_rule" "aks_to_ml_workspace_nsr" {
  name                        = "${var.resource_prefix}-nsr-aks-ml-workspace-${var.environment}"
  priority                    = 111
  direction                   = "Outbound"
  access                      = "Allow"
  protocol                    = "Tcp"
  source_port_range           = "*"
  destination_port_range      = "443"
  source_address_prefix       = var.aks_subnet_address_prefix
  destination_address_prefix  = "AzureMachineLearning"
  resource_group_name         = azurerm_resource_group.this.name
  network_security_group_name = azurerm_network_security_group.this.name
}