# Balloon Project: Infrastructure Setup

This document outlines the steps to create and deploy the infrastructure for the Balloon project. The goal is to have a fully automated, reusable setup managed by code.

## 1. Initial GCP Project Creation (Manual Steps)

These commands are run once to create the GCP project and link billing. Terraform will manage the project's services and resources afterward.

**Important:** These commands must be run from the `balloon` project directory.

*First, set your active account if it's not already set:*
```bash
# Replace with your GCP account email
gcloud config set account "hejustino@hjdconsulting.ca"
```

*Next, generate a unique project ID:*
```bash
# Note: Project IDs cannot be changed later.
export PROJECT_ID="balloon-$(shuf -i 10000-99999 -n 1)"
echo "Your unique project ID is: $PROJECT_ID"
```

*Create the project:*
```bash
gcloud projects create "$PROJECT_ID" --name="Balloon YouTube Analysis"
```

*Set your local gcloud config to use this new project:*
```bash
gcloud config set project "$PROJECT_ID"
```

*Find your Billing Account ID:*
```bash
gcloud beta billing accounts list
```

*Link the project to your billing account (replace AAAAAA-BBBBBB-CCCCCC with your ID):*
```bash
gcloud beta billing projects link "$PROJECT_ID" --billing-account=AAAAAA-BBBBBB-CCCCCC
```

## 2. Automated Infrastructure with Terraform

Once the project is created and billing is linked, Terraform manages all resources.

*Initialize Terraform (run in the 'terraform' directory):*
```bash
terraform init
```

*See the plan of what will be created:*
```bash
terraform plan
```

*Apply the plan to create the infrastructure:*
```bash
terraform apply
```