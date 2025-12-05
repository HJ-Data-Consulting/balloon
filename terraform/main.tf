terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = "balloon-87473"
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

  project                    = "balloon-87473"
  service                    = each.key
  disable_dependent_services = false # Keep this false to avoid accidentally disabling core services
}
