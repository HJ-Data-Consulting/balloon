# Design Document: YouTube Channel Analysis App

## 1. Overview

This document outlines the architecture for a web application that analyzes a YouTube channel's videos using AI. The application will be built on Google Cloud Platform (GCP) and will follow modern, scalable, and maintainable best practices.

## 2. Architecture

The proposed architecture is a serverless, microservices-oriented architecture on GCP.

### 2.1. Components

- **Frontend**: A Next.js web application for the dashboard, containerized and served via **Cloud Run**.
- **Backend API**: A backend service (Node.js with Express) also running on **Cloud Run**. This API will serve data to the frontend.
- **Data Ingestion**: A **Cloud Function** responsible for fetching video data from the **YouTube Data API**.
- **AI Analysis**: A **Cloud Function** that will be triggered when new data is stored in Firestore. This function will use **Vertex AI** (Gemini) to perform analysis.
- **Database**: **Firestore** will serve as the central NoSQL database.
- **CI/CD**: **Cloud Build** will be used to create a CI/CD pipeline.
- **Authentication**: **GCP Identity Platform** or **Firebase Authentication** for user management.

### 2.2. Data Flow

1.  A **Cloud Scheduler** job triggers the **Data Ingestion** Cloud Function on a recurring basis.
2.  The **Data Ingestion** function calls the **YouTube Data API** to fetch the latest video data from the specified channel.
3.  The video metadata is stored as documents in **Firestore**.
4.  The new documents in Firestore trigger the **AI Analysis** Cloud Function.
5.  The **AI Analysis** function processes the video data (e.g., transcripts or comments) with a **Vertex AI (Gemini)** model.
6.  The analysis results are stored back in the corresponding video document in **Firestore**.
7.  The **Frontend** application, running on **Cloud Run**, is accessed by the user.
8.  The frontend makes API calls to the **Backend API**, also on **Cloud Run**.
9.  The backend API reads the video and analysis data from **Firestore** and returns it to the frontend.
10. The user views the analysis on the dashboard.

## 3. Project Structure (Monorepo)

This project will be structured as a monorepo, a single git repository containing multiple related but distinct projects. This approach has several advantages:

- **Simplified Dependency Management**: We can manage dependencies for the frontend and backend in a coordinated way.
- **Atomic Commits**: Changes that span multiple projects (e.g., changing an API and updating the frontend that uses it) can be made in a single commit.
- **Code Sharing**: It's easier to share code (e.g., data models) between the frontend, backend, and cloud functions.
- **Unified CI/CD**: A single CI/CD pipeline in Cloud Build can build, test, and deploy all the components of the application.

The proposed directory structure will be:

```
/
├── packages/
│   ├── frontend/     # Next.js frontend
│   ├── backend/      # Express backend API
│   ├── functions/
│   │   ├── data-ingestion/
│   │   └── ai-analysis/
│   └── shared/       # Shared code (e.g., data models)
├── terraform/        # Terraform infrastructure as code
├── DESIGN.md         # This design document
└── README.md
```

## 4. Next Steps

The next steps are outlined in the to-do list, starting with setting up the monorepo structure.
