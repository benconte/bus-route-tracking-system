# Setting Up Google Maps API for Vite + React + TypeScript App

This guide will walk you through the steps to set up Google Maps API for your Vite + React + TypeScript application.

## Prerequisites

Before you begin, ensure you have the following:

- A Google Cloud Platform (GCP) account.
- A billing account set up on GCP (Google Maps API requires billing information).
- Vite + React + TypeScript application set up locally.

## Step 1: Obtain Google Maps API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Select a project (or create a new one) from the project dropdown menu at the top of the page.
3. Navigate to the **APIs & Services > Credentials** page.
4. Click on **Create Credentials > API Key**.
5. Copy the generated API key.

## Step 2: Configure Environment Variables

1. Locate the `.env.example` file in your project.
2. Duplicate it and rename the duplicated file to `.env`.
3. Open the `.env` file.
4. Replace the placeholder value with your Google Maps API key:

   ```plaintext
   REACT_APP_GOOGLE_MAPS_API_KEY=YOUR_API_KEY_HERE

## Step 3: Install everything
```plaintext
   npm install