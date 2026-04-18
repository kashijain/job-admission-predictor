"""
B.Tech Admission Predictor Controller
Uses rule-based logic based on JEE score, 12th percentage, category, branch preference
"""
from flask import request, jsonify, current_app
from utils.auth_middleware import token_required
import datetime
import logging

logger = logging.getLogger(__name__)

def validate_btech_input(data):
    """Validate B.Tech admission input data"""
    errors = []
    
    # 12th Percentage
    try:
        percentage_12 = float(data.get('percentage12', 0))
        if percentage_12 < 0 or percentage_12 > 100:
            errors.append("12th Percentage must be between 0 and 100")
    except (ValueError, TypeError):
        errors.append("12th Percentage must be a valid number")
    
    # PCM Percentage
    try:
        pcm_percentage = float(data.get('pcmPercentage', 0))
        if pcm_percentage < 0 or pcm_percentage > 100:
            errors.append("PCM Percentage must be between 0 and 100")
    except (ValueError, TypeError):
        errors.append("PCM Percentage must be a valid number")
    
    # JEE Score/Percentile
    try:
        jee_score = float(data.get('jeeScore', 0))
        if jee_score < 0:
            errors.append("JEE Score/Percentile cannot be negative")
    except (ValueError, TypeError):
        errors.append("JEE Score/Percentile must be a valid number")
    
    # Category
    category = data.get('category', 'General')
    valid_categories = ['General', 'OBC', 'SC', 'ST', 'PWD']
    if category not in valid_categories:
        errors.append(f"Category must be one of: {', '.join(valid_categories)}")
    
    # State
    state = data.get('state', 'Other')
    if not state or len(state) < 2:
        errors.append("Valid state must be selected")
    
    # Branch Preference
    branch = data.get('preferredBranch', 'CSE')
    valid_branches = ['CSE', 'ECE', 'Mechanical', 'Electrical', 'Civil', 'Chemical', 'Aerospace', 'Biomedical']
    if branch not in valid_branches:
        errors.append(f"Branch must be one of: {', '.join(valid_branches)}")
    
    # College Type
    college_type = data.get('collegeType', 'Any')
    valid_types = ['Government', 'Private', 'Any']
    if college_type not in valid_types:
        errors.append("College type must be Government, Private, or Any")
    
    return errors


def calculate_btech_admission_probability(percentage_12, pcm_percentage, jee_score, category='General'):
    """
    Calculate admission probability using rule-based logic
    
    Logic:
    - JEE score is primary factor (0-100 percentile scale)
    - 12th percentage adds support (0-100)
    - PCM percentage adds support (0-100)
    - Category provides reservation bonus
    """
    
    # Normalize percentages to 0-1 range
    jee_weight = 0.50  # JEE is most important
    pcm_weight = 0.30  # PCM scores matter
    twelve_weight = 0.20  # 12th percentage matters but less
    
    # Calculate weighted score
    jee_normalized = min(jee_score / 100, 1.0)  # Convert to 0-1
    pcm_normalized = pcm_percentage / 100.0
    twelve_normalized = percentage_12 / 100.0
    
    base_score = (
        (jee_normalized * jee_weight) +
        (pcm_normalized * pcm_weight) +
        (twelve_normalized * twelve_weight)
    ) * 100  # Convert back to 0-100
    
    # Apply category bonus for reserved categories
    category_bonus = 0
    if category in ['SC', 'ST', 'OBC']:
        category_bonus = 5.0  # Additional 5% for reserved categories
    
    admission_prob = min(base_score + category_bonus, 99.5)
    
    return admission_prob


def get_btech_college_tier(jee_score, percentage_12, category='General'):
    """
    Determine college tier based on profile
    
    Tier 1: NIT, IIIT, Top Government colleges
    Tier 2: GFTI, Good Government colleges
    Tier 3: Private colleges, State universities
    """
    
    # Tier calculation
    if jee_score >= 95 and percentage_12 >= 95:
        return 'Tier 1'
    elif jee_score >= 85 and percentage_12 >= 85:
        return 'Tier 1'
    elif jee_score >= 75 and percentage_12 >= 80:
        return 'Tier 2'
    elif jee_score >= 60 and percentage_12 >= 70:
        return 'Tier 2'
    else:
        return 'Tier 3'


@token_required
def predict_btech(current_user):
    """Predict B.Tech admission probability"""
    logger.info(f"📌 B.Tech prediction request from user: {current_user['email']}")
    
    data = request.json
    if not data:
        logger.error("❌ No JSON data in request")
        return jsonify({'message': 'Request body must contain JSON'}), 400
    
    logger.info(f"📊 Received form data: {data}")
    
    # Validate input
    validation_errors = validate_btech_input(data)
    if validation_errors:
        error_msg = 'Invalid input: ' + ', '.join(validation_errors)
        logger.warning(f"❌ {error_msg}")
        return jsonify({'message': error_msg}), 400
    
    try:
        # Extract data
        percentage_12 = float(data.get('percentage12'))
        pcm_percentage = float(data.get('pcmPercentage'))
        jee_score = float(data.get('jeeScore'))
        category = data.get('category', 'General')
        state = data.get('state', 'Other')
        preferred_branch = data.get('preferredBranch', 'CSE')
        college_type = data.get('collegeType', 'Any')
        
        # Calculate admission probability
        admission_prob = calculate_btech_admission_probability(
            percentage_12, pcm_percentage, jee_score, category
        )
        
        # Determine college tier
        college_tier = get_btech_college_tier(jee_score, percentage_12, category)
        
        # Generate message
        if admission_prob > 80:
            message = 'Excellent Chances of Admission'
            explanation = 'Your profile is very strong. You have excellent chances at most colleges in your preferred tier.'
        elif admission_prob > 60:
            message = 'Good Chances of Admission'
            explanation = 'Your profile is competitive. You have good chances at colleges in your preferred tier.'
        elif admission_prob > 40:
            message = 'Moderate Chances of Admission'
            explanation = 'Your profile is reasonable. Apply strategically to colleges across tiers.'
        else:
            message = 'Low-to-Moderate Chances'
            explanation = 'Consider Tier 3 colleges or prepare for the next attempt.'
        
        # Save prediction to database if available
        if current_app.db is not None:
            current_app.db.predictions.insert_one({
                'user_id': current_user['user_id'],
                'email': current_user['email'],
                'type': 'btech',
                'features': data,
                'probability': admission_prob,
                'college_tier': college_tier,
                'timestamp': datetime.datetime.utcnow()
            })
        
        logger.info(f"✓ B.Tech prediction for {current_user['email']}: {admission_prob}% (Tier: {college_tier})")
        
        return jsonify({
            'probability': round(admission_prob, 2),
            'message': message,
            'explanation': explanation,
            'collegeTier': college_tier,
            'confidence': f"{round(admission_prob, 2)}%",
            'recommendationSummary': f"Based on your JEE score ({jee_score}), 12th percentage ({percentage_12}%), and category ({category}), you fall in the {college_tier} category. {explanation}"
        }), 200
        
    except Exception as e:
        logger.error(f"Error in B.Tech prediction: {str(e)}")
        return jsonify({'message': f'Prediction failed: {str(e)}'}), 500
