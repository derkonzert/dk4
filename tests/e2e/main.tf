variable "checkly_api_key" {}

terraform {
  required_providers {
    checkly = {
      source  = "checkly/checkly"
      version = "0.8.1"
    }
  }
}

provider "checkly" {
  api_key = var.checkly_api_key
}

resource "checkly_check" "create-event" {
  name                      = "Create Event"
  type                      = "BROWSER"
  activated                 = true
  should_fail               = false
  frequency                 = 60
  double_check              = true
  ssl_check                 = false
  use_global_alert_settings = true
  locations = [
    "eu-central-1"
  ]

  script = file("${path.module}/tests/create-event.js")

  group_id    = checkly_check_group.dk4-group.id
  group_order = 0


  #   alert_channel_subscription {
  #     channel_id = checkly_alert_channel.alert-email.id
  #     activated  = true
  #   }

}

resource "checkly_check_group" "dk4-group" {
  name      = "DK4 Stage"
  activated = true

  locations = [
    "eu-central-1"
  ]
  concurrency               = 2
  environment_variables     = {}
  tags = []
  double_check              = true
  use_global_alert_settings = true

}

# resource "checkly_check" "search" {

#   name                      = "Search E2E"
#   type                      = "BROWSER"
#   activated                 = true
#   should_fail               = false
#   frequency                 = 15
#   double_check              = true
#   ssl_check                 = false
#   use_global_alert_settings = true
#   locations = [
#     "us-west-1",
#     "eu-central-1"
#   ]

#     script = file("${path.module}/scripts/search.js")

#   alert_channel_subscription {
#     channel_id = checkly_alert_channel.alert-email.id
#     activated  = true
#   }

# }

# resource "checkly_check" "checkout" {

#   name                      = "Checkout E2E"
#   type                      = "BROWSER"
#   activated                 = true
#   should_fail               = false
#   frequency                 = 60
#   double_check              = true
#   ssl_check                 = false
#   use_global_alert_settings = true
#   locations = [
#     "us-west-1",
#     "eu-central-1"
#   ]

#     script = file("${path.module}/scripts/checkout.js")

#   alert_channel_subscription {
#     channel_id = checkly_alert_channel.alert-email.id
#     activated  = true
#   }

# }

# resource "checkly_check" "webstore-list-books" {
#   name                      = "list-books"
#   type                      = "API"
#   activated                 = true
#   should_fail               = false
#   frequency                 = 1
#   double_check              = true
#   ssl_check                 = true
#   use_global_alert_settings = true
#   degraded_response_time    = 5000
#   max_response_time         = 10000

#   locations = [
#     "eu-central-1",
#     "us-west-1"
#   ]

#   request {
#     url              = "https://danube-webshop.herokuapp.com/api/books"
#     follow_redirects = true
#     assertion {
#       source     = "STATUS_CODE"
#       comparison = "EQUALS"
#       target     = "200"
#     }
#     assertion {
#       source     = "JSON_BODY"
#       property   = "$.length"
#       comparison = "EQUALS"
#       target     = "30"
#     }
#   }
# }

# resource "checkly_alert_channel" "alert-email" {
#   email {
#     address = "user@email.com"
#   }
#   send_recovery = true 
#   send_failure = true
#   send_degraded = false

# }
