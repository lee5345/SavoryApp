# SavoryApp

SavoryApp is a mobile application that helps users save and revisit recipes extracted from social media videos. By submitting a recipe video URL, users can automatically analyze the content and build a personal recipe collection, similar to an Instagram-style profile for food inspiration.

## Features

- Submit recipe video URLs for analysis
- Extract structured recipe information from video content
- View previously analyzed recipes in a profile-style feed
- Mobile-first UI built with React Native and Expo

## Tech Stack

### Frontend

- React Native
- Expo Router
- TypeScript
- Expo UI components & Haptics

### Backend

- Node.js
- Express.js
- REST API architecture
- TwelveLabs API for video understanding
- ~~OpenAI APIs for transcription and text processing (DEPRECATED)~~

## How It Works

1. User submits a recipe video URL from the mobile app
2. Frontend sends the URL to the Express backend
3. Backend ingests the video and processes it using TwelveLabs
4. Structured recipe data (ingredients, steps, title) is generated
5. Recipes are stored and displayed in the app’s "Recipes" tab

## Project Structure

```
SavoryApp/
├── app/                # Expo Router screens (tabs, modal, etc.)
├── components/         # Reusable UI components
├── constants/          # Theme and styling
├── server/             # Express backend
│   ├── controllers/
│   ├── routes/
│   └── utils/
└── README.md
```

## Current Status

- Core frontend navigation and styling implemented
- Backend video ingestion and analysis pipeline functional
- Recipe persistence and user accounts planned for future iterations

## Future Improvements

- User authentication
- Cloud database for saved recipes
- Ingredient scaling and shopping list generation
- Improved recipe parsing accuracy
- Search and filtering in recipe feed

## SavoryApp

#### Developed by Martin Lee
