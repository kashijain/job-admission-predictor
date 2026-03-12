# Job Admission Predictor

A polished, professional machine learning project built with Flask that predicts job campus placement probability and higher education admission chances based on a student's academic profile.

## Project Description

This web application takes student academic features such as age, gender, engineering stream, number of internships, CGPA, hostel residency, and history of backlogs. It leverages historical data to predict if the student will secure a placement and provides an estimated probability. Furthermore, it analyzes the same profile to calculate the likelihood of higher education admission, displaying both predictions interactively on a sleek dashboard.

## Features

- **Interactive UI**: Clean, gradient-styled home page with an integrated student profile form.
- **Machine Learning Integration**: Powered by Scikit-Learn `RandomForestClassifier` (Placement) and `LogisticRegression` (Admission).
- **Dashboard Results**: Results are presented in a comprehensive dashboard featuring:
  - Concise Student Profile Summary.
  - Probability Progress Bars for Placement and Admission.
  - Interactive Bar Chart using **Chart.js** comparing both probabilities.
  - Actionable Interpretation messages based on the outcome.

## Technology Stack

- **Frontend**: HTML5, CSS3, Bootstrap 5, FontAwesome, Chart.js
- **Backend**: Python, Flask
- **Machine Learning**: Scikit-Learn, Pandas, NumPy, Joblib

## Folder Structure

```text
Job-Admission-Predictor/
├── app.py                   # Main Flask Application
├── train_model.py           # ML Model Training Script
├── requirements.txt         # Project Dependencies
├── README.md                # Project Documentation
├── data/                    
│   └── collegePlace.csv     # Dataset for training
├── model/                   # Local directory for saved .pkl models
│   ├── placement_model.pkl
│   └── admission_model.pkl
├── templates/               
│   ├── index.html           # Landing Page & Input Form
│   └── result.html          # Dashboard Result Page
└── static/                  
    ├── style.css            # Custom Styling
    └── script.js            # Chart.js initialization logic
```

## How to Run Locally

1. **Clone or Download the Repository**  
   Navigate to the project root directory in your terminal.

2. **Create a Virtual Environment (Recommended)**  
   ```bash
   python -m venv venv
   source venv/bin/activate    # On Windows: venv\Scripts\activate
   ```

3. **Install Dependencies**  
   ```bash
   pip install -r requirements.txt
   ```

4. **Train the Models**  
   Generate the `.pkl` models by running the training script.
   ```bash
   python train_model.py
   ```

5. **Start the Application**  
   ```bash
   python app.py
   ```

6. **View the Web App**  
   Open your browser and navigate to `http://127.0.0.1:5000`

---

## Project Screenshots Guide

*For project submission and documentation, please take the following screenshots:*

1. **Homepage / Input Form**  
   *Capture the main landing page showing the gradient header, input form fields with icons, and the "About the Project" section.*
2. **Prediction Result Dashboard**  
   *Capture the top part of the result page displaying the Student Profile Summary and the Prediction progress cards.*
3. **Charts and Interpretation**  
   *Capture the bottom section showing the Chart.js bar chart and the dynamic interpretation message.*
4. **Terminal Running App**  
   *Take a screenshot of the terminal/command prompt showing the Flask server running successfully.*
