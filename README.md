# CareerPilot AI

A MERN-stack AI career assistant for students. It analyzes resume text against a job description, extracts strengths/gaps, calculates a transparent keyword match score, and uses Google Gemini to generate personalized improvement suggestions.

## Features
- React + Vite responsive frontend
- Node.js + Express REST API
- MongoDB with Mongoose
- Google Gemini AI integration
- Resume vs Job Description analysis
- Match score based on keyword overlap
- AI-generated strengths, missing skills and suggestions
- Save analysis history to MongoDB
- Clean dashboard suitable for a 3rd-year CS/MERN project

## Tech Stack
React, Vite, Node.js, Express, MongoDB, Mongoose, Google Gemini API, Axios, CSS

## Run locally

### 1. Backend
```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

Update `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/careerpilot
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-2.5-flash
CLIENT_URL=http://localhost:5173
```

### 2. Frontend
```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Frontend `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

Open http://localhost:5173

## API
- `GET /api/health`
- `POST /api/analyze`
- `GET /api/analyses`
- `GET /api/analyses/:id`
- `DELETE /api/analyses/:id`

## Resume bullets
- Built **CareerPilot AI**, a MERN-based career assistant that analyzes resumes against job descriptions using REST APIs, MongoDB, and Google Gemini.
- Implemented an explainable keyword-matching engine and AI-generated skill-gap analysis to identify strengths, missing skills, and actionable resume improvements.
- Designed a responsive React dashboard with analysis history and reusable components, integrating an Express/Mongoose backend for persistent analysis storage.

> Important: only claim features you actually run, test, and understand before submitting the project on a resume.
