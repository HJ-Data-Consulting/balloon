# This is a placeholder for the data ingestion function.
# We will need to create a storage bucket and upload the function source code to it.
resource "google_cloudfunctions_function" "data_ingestion" {
  name        = "data-ingestion"
  description = "Fetches video data from YouTube."
  runtime     = "nodejs18" # Or another supported runtime

  available_memory_mb   = 256
  source_archive_bucket = "placeholder-bucket" # Placeholder
  source_archive_object = "placeholder.zip"    # Placeholder
  trigger_http          = true
  entry_point           = "handler"
}

# This is a placeholder for the AI analysis function.
resource "google_cloudfunctions_function" "ai_analysis" {
  name        = "ai-analysis"
  description = "Analyzes video data using Vertex AI."
  runtime     = "nodejs18" # Or another supported runtime

  available_memory_mb   = 256
  source_archive_bucket = "placeholder-bucket" # Placeholder
  source_archive_object = "placeholder.zip"    # Placeholder
  event_trigger {
    event_type = "google.firestore.document.v1.written"
    resource   = "projects/${var.project_id}/databases/(default)/documents/videos/{videoId}"
  }
  entry_point = "handler"
}
