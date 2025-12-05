resource "google_cloud_run_v2_service" "frontend" {
  provider = google-beta
  name     = "frontend"
  location = var.region
  project  = var.project_id

  template {
    containers {
      image = "gcr.io/cloud-run/hello" # Placeholder
      ports {
        container_port = 3000
      }
    }
  }

  traffic {
    percent         = 100
    type            = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
  }
}

resource "google_cloud_run_v2_service" "backend" {
  provider = google-beta
  name     = "backend"
  location = var.region
  project  = var.project_id

  template {
    containers {
      image = "gcr.io/cloud-run/hello" # Placeholder
      ports {
        container_port = 3001
      }
    }
  }

  traffic {
    percent         = 100
    type            = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
  }
}

resource "google_cloud_run_service_iam_member" "frontend_public" {
  provider = google-beta
  project  = google_cloud_run_v2_service.frontend.project
  location = google_cloud_run_v2_service.frontend.location
  service  = google_cloud_run_v2_service.frontend.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}
