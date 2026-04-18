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


@app.route('/placement-predictor')
def placement_predictor():
    return render_template('placement_predictor.html')


@app.route('/mtech-predictor')
def mtech_predictor():
    return render_template('mtech_predictor.html')


def recommend_career(skill, internships, projects, stream):
    careers = []
    if skill == 'Python':
        careers.extend(['Data Analyst', 'ML Engineer', 'Software Developer'])
    elif skill == 'Java':
        careers.extend(['Backend Developer', 'Software Engineer'])
    elif skill == 'Web Development':
        careers.extend(['Frontend Developer', 'Full Stack Developer'])
    elif skill == 'Data Science':
        careers.extend(['Data Scientist', 'ML Engineer'])
    else:
        careers.extend(['Software Developer', 'System Analyst', 'IT Support'])
        
    # Additional logic based on projects and internships
    if internships > 1 or projects > 2:
        careers.append('Senior/Lead Role (Future Potential)')
        
    return list(dict.fromkeys(careers))


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
        
        recommended_careers = recommend_career(skill_str, internships, projects, stream_str)

        return render_template('result.html', 
                               placement_result=placement_result,
                               placement_probability=placement_percentage,
                               admission_probability=admission_percentage,
                               profile=profile,
                               recommended_skills=recommended_skills,
                               recommended_careers=recommended_careers)
                               
    except Exception as e:
        return str(e), 400


@app.route('/college-predictor', methods=['GET', 'POST'])
def college_predictor():
    if request.method == 'GET':
        return render_template('college_predictor.html', results=None)
        
    try:
        percentage = float(request.form['percentage'])
        jee = float(request.form['jee'])
        branch = request.form['branch']
        state = request.form['state']
        
        results = []
        
        # Rule-based college recommendation logic
        if jee > 98:
            results.append({
                "category": "Top IITs / Premium Institutes",
                "admission_level": "Very High Match",
                "branch_match": "High probability",
                "details": "IIT Bombay, IIT Delhi, IIT Madras, Top NITs (Trichy, Surathkal)"
            })
        elif jee > 95:
            results.append({
                "category": "Newer IITs / Top NITs / IIITs",
                "admission_level": "High Match",
                "branch_match": "Good probability",
                "details": "NIT Warangal, NIT Rourkela, IIIT Hyderabad, MNIT Jaipur"
            })
        elif jee > 90:
            results.append({
                "category": "NITs / IIITs / Top State GFTIs",
                "admission_level": "Good Match",
                "branch_match": "Suitable option",
                "details": "Lower NITs, IIIT Kota, PEC Chandigarh, BIT Mesra"
            })
        elif jee > 80:
            results.append({
                "category": "Government Engineering Colleges",
                "admission_level": "Moderate Match",
                "branch_match": "Possible depending on state quota",
                "details": "State Government Colleges, Tier-2 Private Universities"
            })
        else:
            results.append({
                "category": "Private Engineering Colleges",
                "admission_level": "Fair Match",
                "branch_match": "Highly achievable",
                "details": "Tier-3 Private Colleges, Local State Universities"
            })
            
        input_data = {
            "jee": jee,
            "percentage": percentage,
            "branch": branch,
            "state": state
        }
        
        return render_template('college_predictor.html', results=results, input_data=input_data)
        
    except Exception as e:
        return str(e), 400


@app.route('/btech-predictor', methods=['GET', 'POST'])
def btech_predictor():
    if request.method == 'GET':
        return render_template('btech_predictor.html', results=None)
        
    try:
        percentage_10 = float(request.form['percentage_10'])
        percentage_12 = float(request.form['percentage_12'])
        jee = float(request.form['jee'])
        branch = request.form['branch']
        state = request.form['state']
        
        results = []
        
        # City-wise College Data
        city_colleges = {
            "jaipur": [
                {"name": "MNIT Jaipur", "type": "NIT", "branches": "CSE, ECE, EE, ME", "admission_level": "High Match", "note": "Top NIT in Rajasthan"},
                {"name": "SKIT Jaipur", "type": "Private", "branches": "CSE, IT, ECE", "admission_level": "Fair Match", "note": "Popular private choice"},
                {"name": "JECRC University", "type": "Private", "branches": "CSE, Specializations", "admission_level": "Fair Match", "note": "Good placements"},
                {"name": "Poornima College of Engineering", "type": "Private", "branches": "CSE, ECE", "admission_level": "Safe Match", "note": "Decent local college"}
            ],
            "kota": [
                {"name": "IIIT Kota", "type": "IIIT", "branches": "CSE, ECE", "admission_level": "Good Match", "note": "Growing institute of national importance"},
                {"name": "RTU Kota", "type": "Government", "branches": "CSE, Civil, EE", "admission_level": "Moderate Match", "note": "State government university"},
                {"name": "Career Point University", "type": "Private", "branches": "CSE, IT", "admission_level": "Safe Match", "note": "Private university"}
            ],
            "delhi": [
                {"name": "IIT Delhi", "type": "IIT", "branches": "CSE, MnC, EE", "admission_level": "Very High Match", "note": "Top premium institute"},
                {"name": "DTU (Delhi Technological University)", "type": "Government", "branches": "CSE, SE, IT", "admission_level": "High Match", "note": "Excellent state university"},
                {"name": "NSUT Delhi", "type": "Government", "branches": "CSE, ECE", "admission_level": "High Match", "note": "Great placements and location"},
                {"name": "Maharaja Agrasen Institute", "type": "Private", "branches": "CSE, IT", "admission_level": "Moderate Match", "note": "Top tier IPU college"}
            ],
            "pune": [
                {"name": "COEP Pune", "type": "Government", "branches": "CSE, E&TC, ME", "admission_level": "High Match", "note": "Premier state institute"},
                {"name": "PICT Pune", "type": "Private", "branches": "CSE, IT", "admission_level": "Good Match", "note": "Highly reputed for IT branches"},
                {"name": "VIT Pune", "type": "Private", "branches": "CSE, AI, Data Science", "admission_level": "Moderate Match", "note": "Strong industry connect"},
                {"name": "MIT WPU", "type": "Private University", "branches": "CSE, Specializations", "admission_level": "Fair Match", "note": "Private university with good infra"}
            ]
        }
        
        # 1. Determine base category matches
        if jee > 98:
            base_category = {
                "category": "Top IITs / Premium Institutes",
                "admission_level": "Very High Match",
                "details": "IIT Bombay, IIT Delhi, IIT Madras, Top NITs"
            }
        elif jee > 95:
            base_category = {
                "category": "Newer IITs / Top NITs / IIITs",
                "admission_level": "High Match",
                "details": "NIT Warangal, NIT Rourkela, IIIT Hyderabad"
            }
        elif jee > 90:
            base_category = {
                "category": "NITs / IIITs / Top State GFTIs",
                "admission_level": "Good Match",
                "details": "Lower NITs, IIIT Kota, PEC Chandigarh"
            }
        elif jee > 80:
            base_category = {
                "category": "Government Engineering Colleges",
                "admission_level": "Moderate Match",
                "details": "State Government Colleges, Tier-2 Private"
            }
        else:
            base_category = {
                "category": "Private Engineering Colleges",
                "admission_level": "Fair Match",
                "details": "Tier-3 Private Colleges, Local State Universities"
            }
            
        results.append(base_category)
        
        # 2. Filter city-wise colleges if state/city matches example data
        # Clean user input to match keys (lower case, strip spaces)
        search_location = state.lower().strip()
        matched_colleges = []
        
        for city_key, colleges in city_colleges.items():
            if city_key in search_location:
                # Filter appropriate colleges by JEE percentile level rough mapping
                for college in colleges:
                    if jee > 95 and college['type'] in ['IIT', 'NIT', 'IIIT']:
                        matched_colleges.append(college)
                    elif jee > 85 and college['type'] in ['NIT', 'IIIT', 'Government']:
                        matched_colleges.append(college)
                    elif jee <= 85 and college['type'] in ['Government', 'Private', 'Private University']:
                        matched_colleges.append(college)
                break # Matched a city, stop checking other cities
                
        # Fallback if no specific city/college matched
        if not matched_colleges:
            matched_colleges = None
            
        input_data = {
            "jee": jee,
            "percentage_10": percentage_10,
            "percentage_12": percentage_12,
            "branch": branch,
            "state": state
        }
        
        return render_template('btech_predictor.html', results=results, input_data=input_data, matched_colleges=matched_colleges)
        
    except Exception as e:
        return str(e), 400


if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
