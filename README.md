# CareerPilot AI 🚀

An AI-powered resume analyzer and job-matching application that helps candidates understand how well their resume matches a target job description and identify areas for improvement.

CareerPilot AI combines **keyword-based resume matching** with **Gemini-powered AI feedback** to provide actionable career insights.

---

## ✨ Features

* 📄 Resume and job description analysis
* 📊 Resume-to-job match score
* 🔑 Matched keyword detection
* ⚠️ Missing keyword identification
* 🤖 Gemini-powered AI feedback
* 💡 Resume improvement suggestions
* 💪 Identification of resume strengths
* 🎯 Interview preparation topics
* 💾 Persistent analysis results
* 📚 Analysis history
* ⚡ Responsive React interface
* 🔗 REST API-based backend

---

## 🛠️ Tech Stack

### Frontend

* React.js
* React Router
* Axios
* HTML
* CSS

### Backend

* Node.js
* Express.js
* REST APIs

### Database

* MongoDB
* Mongoose

### AI

* Google Gemini API

---

## 🏗️ Architecture

```text
                    CareerPilot AI
                          │
             ┌────────────┴────────────┐
             │                         │
          Frontend                  Backend
          React.js              Node.js + Express
             │                         │
             │                  ┌──────┴──────┐
             │                  │             │
             │              MongoDB       Gemini API
             │                  │             │
             └────────────── API ─────────────┘
```

---

## 🔄 How It Works

```text
User enters resume
        │
        ↓
User enters job description
        │
        ↓
React sends data to Express API
        │
        ↓
Backend analyzes resume keywords
        │
        ├───────────────┐
        ↓               ↓
Match calculation    Gemini AI
        │               │
        └───────┬───────┘
                ↓
          Analysis Result
                │
        ┌───────┴────────┐
        ↓                ↓
     Frontend         MongoDB
     Results           History
```

---

## 📋 Analysis Output

CareerPilot AI provides:

### Match Score

A score representing the overlap between the resume and the target job description.

### Matched Keywords

Skills and keywords present in both the resume and job description.

### Potential Gaps

Important keywords or skills from the job description that are not detected in the resume.

### AI Summary

Gemini generates a concise assessment of the candidate's resume in relation to the target role.

### Improvement Suggestions

AI-generated recommendations for improving the resume.

### Strengths

Highlights relevant strengths already present in the candidate's resume.

### Interview Preparation

Generates topics that the candidate should prepare based on the target role.

---

## 📁 Project Structure

```text
CareerPilot/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ScoreCard.jsx
│   │   │   └── TagList.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Analyze.jsx
│   │   │   └── History.jsx
│   │   │
│   │   ├── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── .gitignore
└── README.md
```

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone <your-github-repository-url>
cd CareerPilot
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Configure environment variables

Create a `.env` file inside the `backend` directory.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
```

Do not commit the `.env` file to GitHub.

A `.env.example` file is included to show the required environment variables.

### 4. Start the backend

```bash
npm run dev
```

or, depending on the scripts in `package.json`:

```bash
npm start
```

The backend will run on:

```text
http://localhost:5000
```

### 5. Install frontend dependencies

Open another terminal:

```bash
cd frontend
npm install
```

### 6. Configure frontend API URL

Create a `.env` file inside `frontend`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 7. Start the frontend

```bash
npm run dev
```

The application will be available at the local Vite URL shown in the terminal.

---

## 🔐 Environment Variables

### Backend

```env
PORT=
MONGO_URI=
GEMINI_API_KEY=
```

### Frontend

```env
VITE_API_URL=
```

Never expose API keys or database credentials in the frontend or commit them to GitHub.

---

## 🔌 API

The backend exposes REST endpoints for resume analysis and analysis history.

### Analyze Resume

```http
POST /api/analyze
```

Example request:

```json
{
  "candidateName": "Ananya",
  "resumeText": "B.Tech IT student with experience in React, Node.js and MongoDB...",
  "jobDescription": "Looking for a software engineering intern with React and Node.js..."
}
```

The API returns the calculated match score, matched keywords, missing keywords, and AI-generated feedback.

---

## 💡 Example Use Case

A candidate applying for a **Software Engineering Internship** can paste:

1. Their resume
2. The internship job description

CareerPilot then analyzes the two and provides:

```text
Match Score: 78%

Matched Keywords:
✓ React
✓ Node.js
✓ MongoDB
✓ REST APIs

Potential Gaps:
⚠ TypeScript
⚠ Docker
⚠ Testing

AI Feedback:
Improve your backend testing experience and highlight
relevant API development projects.
```

This helps candidates identify gaps before submitting an application.

---

## 🚀 Future Improvements

* User authentication and personalized dashboards
* PDF/DOCX resume upload
* Automatic resume text extraction
* Resume section-wise scoring
* Multiple resume versions
* Job recommendation system
* Resume improvement/rewrite assistant
* Interview question generation
* Saved job descriptions
* Advanced analytics dashboard
* Deployment with production environment configuration

---

## 🎯 Learning Outcomes

This project demonstrates practical experience with:

* Full-stack MERN development
* React component architecture
* REST API development
* MongoDB data persistence
* Third-party API integration
* Generative AI integration
* Frontend-backend communication
* Asynchronous JavaScript
* Error and loading state handling
* Environment variable management
* Git and GitHub workflow
* Application deployment

---

## 👩‍💻 Author

**Ananya Pappula**

B.Tech – Information Technology

---

## 📄 License

This project is developed for educational and portfolio purposes.
