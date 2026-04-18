# Job and Admission Predictor

## Project Overview
Job and Admission Predictor is a full-stack web application that helps students estimate outcomes across multiple academic and career workflows. The platform includes job placement prediction, M.Tech admission prediction, B.Tech admission prediction, resume analysis, and complaint management in a single dashboard-based experience.

## Features
- Job placement prediction using machine learning models
- M.Tech admission prediction based on academic inputs
- B.Tech admission prediction workflow
- Resume Analyzer for ATS-style feedback and skill detection
- Complaint submission system with duplicate complaint detection
- JWT-based authentication with student and admin roles
- Admin dashboard for monitoring users, predictions, and complaints

## Tech Stack
- Frontend: React, Vite, Tailwind CSS, React Router, Axios
- Backend: Flask, Flask-CORS, PyJWT
- Database: MongoDB
- Machine Learning: scikit-learn, pandas, numpy, joblib
- Resume Parsing: PyPDF2, python-docx, pdfplumber

## How to Run

### Backend
```bash
cd backend
pip install -r requirements.txt
python app.py
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Notes
- Backend runs on Flask and serves the API routes.
- Frontend runs with Vite in development mode.
- If environment variables are needed, configure them in the backend before running the server.
