from flask import Flask, render_template, request
import joblib
import os
import numpy as np

app = Flask(__name__)

# Load models
placement_model_path = os.path.join('model', 'placement_model.pkl')
admission_model_path = os.path.join('model', 'admission_model.pkl')

try:
    placement_model = joblib.load(placement_model_path)
    admission_model = joblib.load(admission_model_path)
except FileNotFoundError:
    print("Warning: Model files not found. Please run train_model.py first.")
    placement_model = None
    admission_model = None


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/predict', methods=['POST'])
def predict():
    if not placement_model or not admission_model:
        return "Models not loaded. Please train the models first.", 500

    try:
        # Extract features from form
        age = int(request.form['age'])
        
        gender_str = request.form['gender']
        gender = 1 if gender_str == 'Male' else 0

        stream_str = request.form['stream']
        stream_mapping = {
            'Electronics And Communication': 0,
            'Computer Science': 1,
            'Information Technology': 2,
            'Mechanical': 3,
            'Electrical': 4,
            'Civil': 5
        }
        stream = stream_mapping.get(stream_str, 1)

        internships = int(request.form['internships'])
        projects = int(request.form['projects'])
        cgpa = float(request.form['cgpa'])
        hostel = int(request.form['hostel'])
        backlogs = int(request.form['backlogs'])
        
        skill_str = request.form['skill']
        skill_mapping = {
            'None': 0,
            'Web Development': 1,
            'Java': 2,
            'Python': 3,
            'Data Science': 4
        }
        skill = skill_mapping.get(skill_str, 0)

        # Create input array
        input_data = np.array([[age, gender, stream, internships, cgpa, hostel, backlogs, skill, projects]])
        
        # 1. Placement Prediction
        placement_pred = placement_model.predict(input_data)[0]
        placement_prob = placement_model.predict_proba(input_data)[0][1]
        
        # Skill and Projects slightly influence placement probability
        if skill > 0 or projects > 0:
            placement_prob = min(0.99, placement_prob + (skill * 0.02) + (projects * 0.03))
            placement_pred = 1 if placement_prob >= 0.5 else 0
            
        placement_percentage = round(placement_prob * 100, 2)
        placement_result = "Placed" if placement_pred == 1 else "Not Placed"

        # 2. Admission Probability
        # Using predict_proba to get percentage
        admission_prob = admission_model.predict_proba(input_data)[0][1] # Probability of class 1
        admission_percentage = round(admission_prob * 100, 2)

        # Profile details for dashboard
        profile = {
            'Age': age,
            'Gender': gender_str,
            'Stream': stream_str,
            'Primary Skill': skill_str,
            'Projects': projects,
            'Internships': internships,
            'CGPA': cgpa,
            'Hostel Resident': 'Yes' if hostel == 1 else 'No',
            'History of Backlogs': 'Yes' if backlogs == 1 else 'No'
        }

        # Recommendation Logic based on Primary Skill
        recommendations = {
            'Python': ['Machine Learning', 'Data Structures', 'SQL', 'FastAPI'],
            'Java': ['Spring Boot', 'System Design', 'Microservices', 'Hibernate'],
            'Web Development': ['React', 'Node.js', 'MongoDB', 'TypeScript'],
            'Data Science': ['Deep Learning', 'Statistics', 'TensorFlow', 'Python Pandas'],
            'None': ['Programming Basics', 'Git', 'Data Structures', 'Problem Solving']
        }
        
        # Default to 'None' mapping if something goes wrong
        recommended_skills = recommendations.get(skill_str, recommendations['None'])

        return render_template('result.html', 
                               placement_result=placement_result,
                               placement_probability=placement_percentage,
                               admission_probability=admission_percentage,
                               profile=profile,
                               recommended_skills=recommended_skills)
                               
    except Exception as e:
        return str(e), 400


if __name__ == '__main__':
    app.run(debug=True)
