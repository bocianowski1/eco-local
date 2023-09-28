variable "prefix" {
  type        = string
  description = "Prefix for all resources"
  default     = "echoslackbot"
}

variable "slack_token" {
  type        = string
  description = "Slack token"
}