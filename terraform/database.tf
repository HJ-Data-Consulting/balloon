resource "google_firestore_database" "database" {
  project    = var.project_id
  name       = "(default)"
  location_id = var.region # Or a multi-region like "nam5"
  type       = "FIRESTORE_NATIVE"

  # Optional: Define CMEK settings
  # kms_key_name = "projects/my-project/locations/my-location/keyRings/my-key-ring/cryptoKeys/my-key"
}
