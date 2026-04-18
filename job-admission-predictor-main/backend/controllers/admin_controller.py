from flask import jsonify, current_app
from utils.auth_middleware import admin_required

@admin_required
def get_all_users(current_user):
    # Check database availability
    if current_app.db is None:
        return jsonify({'message': 'Database unavailable. Please try again later.'}), 503
    
    users = list(current_app.db.users.find({}, {'password': 0}))
    for u in users:
        u['_id'] = str(u['_id'])
    return jsonify({'users': users}), 200

@admin_required
def get_all_complaints(current_user):
    # Check database availability
    if current_app.db is None:
        return jsonify({'message': 'Database unavailable. Please try again later.'}), 503
    
    complaints = list(current_app.db.complaints.find({}).sort('timestamp', -1))
    for c in complaints:
        c['_id'] = str(c['_id'])
    return jsonify({'complaints': complaints}), 200

@admin_required
def get_all_predictions(current_user):
    # Check database availability
    if current_app.db is None:
        return jsonify({'message': 'Database unavailable. Please try again later.'}), 503
    
    predictions = list(current_app.db.predictions.find({}).sort('timestamp', -1))
    for p in predictions:
        p['_id'] = str(p['_id'])
    return jsonify({'predictions': predictions}), 200
