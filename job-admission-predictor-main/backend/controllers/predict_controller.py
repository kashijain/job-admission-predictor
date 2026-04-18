from flask import request, jsonify, current_app
import joblib
import numpy as np
import os
from utils.auth_middleware import token_required
from utils.college_recommender import recommend_colleges, get_college_tier
import datetime
import logging

logger = logging.getLogger(__name__)

# Load Models
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
placement_model_path = os.path.join(BASE_DIR, 'ml_models', 'placement_model.pkl')
admission_model_path = os.path.join(BASE_DIR, 'ml_models', 'admission_model.pkl')

placement_model = None
admission_model = None

def load_model(model_path, model_name):
    """Load a persisted model with a little extra diagnostics for dependency mismatches."""
    logger.info("Loading %s model from %s", model_name, model_path)
    if not os.path.exists(model_path):
        logger.error("%s model file not found at %s", model_name, model_path)
        return None

    try:
        model = joblib.load(model_path)
        logger.info("%s model loaded successfully", model_name)
        return model
    except ModuleNotFoundError as exc:
        logger.error(
            "Failed to load %s model because module '%s' is unavailable. "
            "This usually means the model was serialized with a different NumPy/scikit-learn environment.",
            model_name,
            exc.name,
        )
    except Exception as exc:
        logger.exception("Failed to load %s model from %s: %s", model_name, model_path, exc)

    return None

placement_model = load_model(placement_model_path, 'placement')
admission_model = load_model(admission_model_path, 'admission')

def validate_prediction_input(data):
    """Validate prediction input data with proper ranges"""
    errors = []
    
    try:
        age = int(data.get('age', 21))
        if age < 18 or age > 40:
            errors.append("Age must be between 18 and 40")
    except (ValueError, TypeError):
        errors.append("Age must be a valid number")
    
    try:
        cgpa = float(data.get('cgpa', 0.0))
        if cgpa < 0 or cgpa > 10:
            errors.append("CGPA must be between 0 and 10")
    except (ValueError, TypeError):
        errors.append("CGPA must be a valid number")
    
    gender = data.get('gender', 'Male')
    if gender not in ['Male', 'Female']:
        errors.append("Gender must be 'Male' or 'Female'")
    
    stream = data.get('stream', 'Computer Science')
    valid_streams = ['Electronics And Communication', 'Computer Science', 'Information Technology', 'Mechanical', 'Electrical', 'Civil']
    if stream not in valid_streams:
        errors.append(f"Stream must be one of: {', '.join(valid_streams)}")
    
    try:
        internships = int(data.get('internships', 0))
        if internships < 0 or internships > 10:
            errors.append("Internships must be between 0 and 10")
    except (ValueError, TypeError):
        errors.append("Internships must be a valid number")
    
    try:
        projects = int(data.get('projects', 0))
        if projects < 0 or projects > 20:
            errors.append("Projects must be between 0 and 20")
    except (ValueError, TypeError):
        errors.append("Projects must be a valid number")
    
    backlogs = data.get('backlogs', 0)
    if backlogs not in [0, 1, '0', '1']:
        errors.append("Backlogs must be 0 or 1")
    
    hostel = data.get('hostel', 0)
    if hostel not in [0, 1, '0', '1']:
        errors.append("Hostel must be 0 or 1")
    
    skill = data.get('skill', 'None')
    valid_skills = ['None', 'Web Development', 'Java', 'Python', 'Data Science']
    if skill not in valid_skills:
        errors.append(f"Skill must be one of: {', '.join(valid_skills)}")
    
    return errors

@token_required
def predict_job(current_user):
    """Predict job placement using Random Forest model"""
    logger.info(f"Job prediction request received from user: {current_user['email']}")
    
    if not placement_model:
        logger.error("Placement model not loaded")
        return jsonify({'message': 'ML model not available. Please try again later.'}), 500
    
    data = request.json
    if not data:
        logger.error("No JSON data in request body")
        return jsonify({'message': 'Request body must contain JSON data'}), 400
    
    logger.info(f"Received form data: {data}")
    
    # Validate input
    validation_errors = validate_prediction_input(data)
    if validation_errors:
        error_msg = 'Invalid input: ' + ', '.join(validation_errors)
        logger.warning(error_msg)
        return jsonify({'message': error_msg}), 400
    
    try:
        # Parse and map input data
        age = int(data.get('age'))
        gender = 1 if data.get('gender') == 'Male' else 0
        
        stream_mapping = {
            'Electronics And Communication': 0,
            'Computer Science': 1,
            'Information Technology': 2,
            'Mechanical': 3,
            'Electrical': 4,
            'Civil': 5
        }
        stream = stream_mapping.get(data.get('stream'), 1)
        
        internships = int(data.get('internships'))
        cgpa = float(data.get('cgpa'))
        hostel = int(data.get('hostel'))
        backlogs = int(data.get('backlogs'))
        projects = int(data.get('projects'))
        
        skill_mapping = {
            'None': 0,
            'Web Development': 1,
            'Java': 2,
            'Python': 3,
            'Data Science': 4
        }
        skill = skill_mapping.get(data.get('skill'), 0)
        
        # Prepare input for model
        input_data = np.array([[age, gender, stream, internships, cgpa, hostel, backlogs, skill, projects]])
        
        # Get prediction probability
        placement_prob = float(placement_model.predict_proba(input_data)[0][1])
        
        # Apply skill/projects bonus
        if skill > 0 or projects > 0:
            placement_prob = min(0.99, placement_prob + (skill * 0.02) + (projects * 0.03))
        
        placement_pred = 1 if placement_prob >= 0.5 else 0
        placement_percentage = round(placement_prob * 100, 2)
        
        # Save prediction to database if available
        if current_app.db is not None:
            current_app.db.predictions.insert_one({
                'user_id': current_user['user_id'],
                'email': current_user['email'],
                'type': 'job',
                'features': data,
                'result': placement_pred,
                'probability': placement_percentage,
                'timestamp': datetime.datetime.utcnow()
            })
        
        logger.info(f"Job prediction generated for user {current_user['email']}: {placement_percentage}%")
        
        return jsonify({
            'result': placement_pred,
            'probability': placement_percentage,
            'message': 'Likely to be Placed' if placement_pred == 1 else 'May Not Be Placed',
            'confidence': f"{placement_percentage}%"
        }), 200

    except Exception as e:
        logger.error(f"Error in job prediction: {str(e)}")
        return jsonify({'message': f'Prediction failed: {str(e)}'}), 500

@token_required
def predict_admission(current_user):
    """Predict M.Tech admission using Logistic Regression model"""
    logger.info(f"Admission prediction request received from user: {current_user['email']}")
    
    if not admission_model:
        logger.error("Admission model not loaded")
        return jsonify({'message': 'ML model not available. Please try again later.'}), 500
    
    data = request.json
    if not data:
        logger.error("No JSON data in request body")
        return jsonify({'message': 'Request body must contain JSON data'}), 400
    
    logger.info(f"Received form data: {data}")
    
    # Validate input
    validation_errors = validate_prediction_input(data)
    if validation_errors:
        error_msg = 'Invalid input: ' + ', '.join(validation_errors)
        logger.warning(error_msg)
        return jsonify({'message': error_msg}), 400
    
    try:
        # Parse and map input data
        age = int(data.get('age'))
        gender = 1 if data.get('gender') == 'Male' else 0
        
        stream_mapping = {
            'Electronics And Communication': 0,
            'Computer Science': 1,
            'Information Technology': 2,
            'Mechanical': 3,
            'Electrical': 4,
            'Civil': 5
        }
        stream = stream_mapping.get(data.get('stream'), 1)
        
        internships = int(data.get('internships'))
        cgpa = float(data.get('cgpa'))
        hostel = int(data.get('hostel'))
        backlogs = int(data.get('backlogs'))
        projects = int(data.get('projects'))
        
        skill_mapping = {
            'None': 0,
            'Web Development': 1,
            'Java': 2,
            'Python': 3,
            'Data Science': 4
        }
        skill = skill_mapping.get(data.get('skill'), 0)
        
        # Prepare input for model
        input_data = np.array([[age, gender, stream, internships, cgpa, hostel, backlogs, skill, projects]])
        
        # Get prediction probability
        admission_prob = float(admission_model.predict_proba(input_data)[0][1])
        admission_percentage = round(admission_prob * 100, 2)
        
        # Save prediction to database if available
        if current_app.db is not None:
            current_app.db.predictions.insert_one({
                'user_id': current_user['user_id'],
                'email': current_user['email'],
                'type': 'admission',
                'features': data,
                'probability': admission_percentage,
                'timestamp': datetime.datetime.utcnow()
            })
        
        logger.info(f"Admission prediction generated for user {current_user['email']}: {admission_percentage}%")
        
        # Determine message based on probability
        if admission_percentage > 70:
            message = 'High Chance of Admission'
        elif admission_percentage > 50:
            message = 'Moderate Chance of Admission'
        else:
            message = 'Low Chance of Admission'
        
        # Get college recommendations
        gate_qualified = data.get('gateQualified', False)
        gate_score = data.get('gateScore', None)
        stream_name = data.get('stream', 'Computer Science')
        
        try:
            gate_score = int(gate_score) if gate_score else None
        except (ValueError, TypeError):
            gate_score = None
        
        college_recommendations = recommend_colleges(
            cgpa=cgpa,
            internships=internships,
            projects=projects,
            gate_qualified=gate_qualified,
            gate_score=gate_score,
            stream=stream_name
        )
        
        return jsonify({
            'probability': admission_percentage,
            'message': message,
            'confidence': f"{admission_percentage}%",
            'collegeTier': college_recommendations['college_tier'],
            'safeColleges': college_recommendations['safe_colleges'],
            'moderateColleges': college_recommendations['moderate_colleges'],
            'ambitiousColleges': college_recommendations['ambitious_colleges'],
            'recommendationSummary': college_recommendations['recommendation_summary']
        }), 200

    except Exception as e:
        logger.error(f"Error in admission prediction: {str(e)}")
        return jsonify({'message': f'Prediction failed: {str(e)}'}), 500
