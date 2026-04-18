from flask import request, jsonify, current_app
from utils.auth_middleware import token_required
from utils.ml_utils import is_duplicate_complaint
import datetime

@token_required
def add_complaint(current_user):
    data = request.json
    subject = data.get('subject')
    description = data.get('description')
    
    if not subject or not description:
        return jsonify({'message': 'Subject and description are required'}), 400
    
    # Check database availability
    if current_app.db is None:
        return jsonify({'message': 'Database unavailable. Please try again later.'}), 503
        
    complaints_collection = current_app.db.complaints
    
    # Check for duplicates using ML (TF-IDF + Cosine Similarity)
    # Fetch recent complaints (e.g., last 100 to limit matrix size)
    existing_complaints = list(complaints_collection.find({}, {'description': 1}).sort('timestamp', -1).limit(100))
    existing_texts = [c['description'] for c in existing_complaints if 'description' in c]
    
    is_duplicate = is_duplicate_complaint(description, existing_texts, threshold=0.8)
    
    if is_duplicate:
        return jsonify({
            'message': 'Duplicate complaint detected. Similarity too high.',
            'is_duplicate': True
        }), 400
        
    # Insert new complaint
    complaint_data = {
        'user_id': current_user['user_id'],
        'email': current_user['email'],
        'subject': subject,
        'description': description,
        'status': 'Pending',
        'timestamp': datetime.datetime.utcnow()
    }
    
    complaint_id = complaints_collection.insert_one(complaint_data).inserted_id
    
    return jsonify({
        'message': 'Complaint registered successfully',
        'complaint_id': str(complaint_id),
        'is_duplicate': False
    }), 201

@token_required
def check_duplicate(current_user):
    data = request.json
    description = data.get('description')
    if not description:
         return jsonify({'message': 'Description is required'}), 400
    
    # Check database availability
    if current_app.db is None:
        return jsonify({'message': 'Database unavailable. Please try again later.'}), 503
         
    complaints_collection = current_app.db.complaints
    existing_complaints = list(complaints_collection.find({}, {'description': 1}).sort('timestamp', -1).limit(100))
    existing_texts = [c['description'] for c in existing_complaints if 'description' in c]
    
    is_duplicate = is_duplicate_complaint(description, existing_texts, threshold=0.8)
    
    return jsonify({
        'is_duplicate': is_duplicate
    }), 200
    
@token_required
def get_user_complaints(current_user):
    # Check database availability
    if current_app.db is None:
        return jsonify({'message': 'Database unavailable. Please try again later.'}), 503
    
    complaints_collection = current_app.db.complaints
    complaints = list(complaints_collection.find({'user_id': current_user['user_id']}))
    
    for c in complaints:
        c['_id'] = str(c['_id'])
        
    return jsonify({'complaints': complaints}), 200
