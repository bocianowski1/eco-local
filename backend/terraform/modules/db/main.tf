resource "azurerm_cosmosdb_account" "db" {
  name                = "${var.prefix}-cosmosdb"
  resource_group_name = var.rg_name
  location            = var.location
  offer_type          = "Standard"
  kind                = "PostgreSQL"

  consistency_policy {
    consistency_level       = "Session"
    max_interval_in_seconds = 5
    max_staleness_prefix    = 10
  }

  geo_location {
    location          = var.location
    failover_priority = 0
  }

  capabilities {
    name = "EnablePostgreSQL"
  }

  enable_automatic_failover = false

  tags = {
    project = "${var.prefix}"
  }
}
