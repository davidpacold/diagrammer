# Azure Application Gateway Resources
# Provides application-level load balancing and SSL termination for web traffic

# Subnet for Application Gateway
resource "azurerm_subnet" "appgw" {
  name                 = "${var.resource_prefix}-appgw-subnet-${var.environment}"
  resource_group_name  = azurerm_resource_group.this.name
  virtual_network_name = azurerm_virtual_network.this.name
  address_prefixes     = [var.appgw_subnet_address_prefix]
}

# Public IP for Application Gateway
resource "azurerm_public_ip" "appgw" {
  name                = "${var.resource_prefix}-appgw-pip-${var.environment}"
  location            = azurerm_resource_group.this.location
  resource_group_name = azurerm_resource_group.this.name
  allocation_method   = "Static"
  sku                 = "Standard"
  tags                = merge(local.common_tags, { Service = "ApplicationGateway" })
}

# Application Gateway
resource "azurerm_application_gateway" "this" {
  name                = "${var.resource_prefix}-appgw-${var.environment}"
  location            = azurerm_resource_group.this.location
  resource_group_name = azurerm_resource_group.this.name

  sku {
    name     = var.appgw_sku_name
    tier     = var.appgw_sku_tier
    capacity = var.appgw_capacity
  }

  gateway_ip_configuration {
    name      = "gateway-ip-config"
    subnet_id = azurerm_subnet.appgw.id
  }

  frontend_port {
    name = "http-port"
    port = 80
  }

  frontend_port {
    name = "https-port"
    port = 443
  }

  frontend_ip_configuration {
    name                 = "frontend-ip"
    public_ip_address_id = azurerm_public_ip.appgw.id
  }

  backend_address_pool {
    name         = "nginx-ingress-backend"
    ip_addresses = [var.nginx_internal_ip]
  }

  backend_http_settings {
    name                                = "http-settings"
    cookie_based_affinity               = "Disabled"
    port                                = 80
    protocol                            = "Http"
    request_timeout                     = 60
    probe_name                          = "http-health-probe"
    pick_host_name_from_backend_address = false
  }

  backend_http_settings {
    name                                = "https-settings"
    cookie_based_affinity               = "Disabled"
    port                                = 443
    protocol                            = "Https"
    request_timeout                     = 60
    probe_name                          = "https-health-probe"
    host_name                           = var.application_gateway_hostname
    pick_host_name_from_backend_address = false
  }

  http_listener {
    name                           = "http-listener"
    frontend_ip_configuration_name = "frontend-ip"
    frontend_port_name             = "http-port"
    protocol                       = "Http"
  }

  dynamic "http_listener" {
    for_each = var.ssl_certificate_data != "" ? [1] : []
    content {
      name                           = "https-listener"
      frontend_ip_configuration_name = "frontend-ip"
      frontend_port_name             = "https-port"
      protocol                       = "Https"
      ssl_certificate_name           = var.ssl_certificate_name
    }
  }

  # When SSL is configured: redirect HTTP to HTTPS
  dynamic "redirect_configuration" {
    for_each = var.ssl_certificate_data != "" ? [1] : []
    content {
      name                 = "http-to-https-redirect"
      redirect_type        = "Permanent"
      target_listener_name = "https-listener"
      include_path         = true
      include_query_string = true
    }
  }

  # When SSL is configured: HTTP rule redirects to HTTPS
  # When no SSL: HTTP rule routes directly to backend
  dynamic "request_routing_rule" {
    for_each = var.ssl_certificate_data != "" ? [1] : []
    content {
      name                        = "http-to-https-rule"
      priority                    = 100
      rule_type                   = "Basic"
      http_listener_name          = "http-listener"
      redirect_configuration_name = "http-to-https-redirect"
    }
  }

  dynamic "request_routing_rule" {
    for_each = var.ssl_certificate_data == "" ? [1] : []
    content {
      name                       = "http-routing-rule"
      priority                   = 100
      rule_type                  = "Basic"
      http_listener_name         = "http-listener"
      backend_address_pool_name  = "nginx-ingress-backend"
      backend_http_settings_name = "http-settings"
    }
  }

  # HTTPS routing rule (only when SSL is configured)
  dynamic "request_routing_rule" {
    for_each = var.ssl_certificate_data != "" ? [1] : []
    content {
      name                       = "https-routing-rule"
      priority                   = 101
      rule_type                  = "Basic"
      http_listener_name         = "https-listener"
      backend_address_pool_name  = "nginx-ingress-backend"
      backend_http_settings_name = "http-settings"
    }
  }

  probe {
    name                                      = "http-health-probe"
    protocol                                  = "Http"
    path                                      = var.health_probe_path
    port                                      = var.health_probe_port
    host                                      = var.nginx_internal_ip
    interval                                  = 15
    timeout                                   = 10
    unhealthy_threshold                       = 5
    pick_host_name_from_backend_http_settings = false

    match {
      status_code = ["200-399"]
    }
  }

  probe {
    name                                      = "https-health-probe"
    protocol                                  = "Https"
    path                                      = var.health_probe_path
    port                                      = 443
    host                                      = var.health_probe_host != "" ? var.health_probe_host : null
    interval                                  = 15
    timeout                                   = 10
    unhealthy_threshold                       = 5
    pick_host_name_from_backend_http_settings = var.health_probe_host == ""

    match {
      status_code = ["200-399"]
    }
  }

  dynamic "ssl_certificate" {
    for_each = var.ssl_certificate_data != "" ? [1] : []
    content {
      name     = var.ssl_certificate_name
      data     = var.ssl_certificate_data
      password = var.ssl_certificate_password
    }
  }

  tags = merge(local.common_tags, { Service = "ApplicationGateway" })
}