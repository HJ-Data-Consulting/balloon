terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "~> 5.0"
    }
  }
}

variable "project_id" {
  description = "The GCP project ID."
  default     = "balloon-87473"
}

variable "region" {
  description = "The GCP region to deploy resources to."
  default     = "us-central1"
}

provider "google" {
  project = var.project_id
  region  = var.region
}

provider "google-beta" {
  project = var.project_id
  region  = var.region
}

resource "google_project_service" "project_services" {
  for_each = toset([
    "run.googleapis.com",             # Cloud Run
    "firestore.googleapis.com",       # Firestore
    "cloudfunctions.googleapis.com",  # Cloud Functions
    "cloudbuild.googleapis.com",      # Cloud Build
    "artifactregistry.googleapis.com",# Artifact Registry
    "iam.googleapis.com",             # IAM
    "cloudresourcemanager.googleapis.com", # Cloud Resource Manager
    "aiplatform.googleapis.com",      # Vertex AI (for Gemini)
    "youtube.googleapis.com"          # YouTube Data API
  ])

  project                    = var.project_id
  service                    = each.key
  disable_dependent_services = false # Keep this false to avoid accidentally disabling core services
}
