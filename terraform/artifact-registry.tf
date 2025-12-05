resource "google_artifact_registry_repository" "repository" {
  provider      = google-beta
  project       = var.project_id
  location      = var.region
  repository_id = "youtube-analysis"
  description   = "Docker repository for the YouTube Analysis app."
  format        = "DOCKER"
}
