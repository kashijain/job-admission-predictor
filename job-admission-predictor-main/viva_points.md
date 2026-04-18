# 🎤 Viva Voce / PPT Speaking Points

Use these high-impact points to present your project dynamically to the external examiner/panel:

## 1. Project Introduction
- **Problem Addressed:** Uncertainty among students regarding their placement and higher education prospects, alongside ineffective issue tracking.
- **Solution:** A unified platform integrating historical data analytics, machine learning, and support ticketing.

## 2. Core Machine Learning Pipeline
- **Placement Predictor:** Utilizes the **Random Forest Classifier** because it efficiently handles complex non-linear relationships and avoids overfitting using multiple decision trees.
- **Admission Predictor:** Utilizes **Logistic Regression** to estimate the odds (probability curve) of M.Tech admission based on heuristic weights (CGPA, Projects, etc).

## 3. The "X-Factor" (Duplicate Detection)
- Instead of just CRUD operations for complaints, we introduced **Natural Language Processing (NLP)**.
- **Mechanism:** When a user submits a complaint, the backend converts the text using a **TF-IDF Vectorizer** (Term Frequency-Inverse Document Frequency) which converts words to numerical importance arrays.
- We then compute the **Cosine Similarity** between the new complaint and all existing database complaints.
- **Logic:** If the angle similarity is > 0.8 (80%), the API intercepts and rejects the complaint as a duplicate.

## 4. Software Engineering & Architecture
- **JWT Authentication:** Implemented stateless token-based authorization. No sessions are stored on the server, making the backend completely horizontally scalable.
- **Microservices-esque Routing:** Used Flask Blueprints for a clean separations of concerns.
- **Modern User Interface:** Built a Single Page Application (SPA) using React and Vite. Result visualizations achieved using `Chart.js` for premium real-time rendering. 

## 5. Deployment Architecture
- **Vercel** for the React Frontend Edge delivery.
- **Render** for the Python/Flask API, offering robust continuous integration.
- **MongoDB Atlas** utilized via PyMongo to represent our persistent Document data store.
