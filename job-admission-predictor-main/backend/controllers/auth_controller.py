from flask import request, jsonify, current_app
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime

def register():
    data = request.json
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Missing email or password'}), 400
        
    users = current_app.db.users
    if users.find_one({'email': data['email']}):
        return jsonify({'message': 'User already exists'}), 400
        
    hashed_password = generate_password_hash(data['password'])
    
    # Default role is student. Can be changed manually for admin.
    role = data.get('role', 'student')
    
    user_id = users.insert_one({
        'name': data.get('name', 'Student'),
        'email': data['email'],
        'password': hashed_password,
        'role': role,
        'created_at': datetime.datetime.utcnow()
    }).inserted_id
    
    return jsonify({'message': 'User registered successfully', 'user_id': str(user_id)}), 201

def login():
    data = request.json
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Missing email or password'}), 400
        
    users = current_app.db.users
    user = users.find_one({'email': data['email']})
    
    if not user or not check_password_hash(user['password'], data['password']):
        return jsonify({'message': 'Invalid credentials'}), 401
        
    token = jwt.encode({
        'user_id': str(user['_id']),
        'email': user['email'],
        'role': user['role'],
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }, current_app.config['SECRET_KEY'], algorithm="HS256")
    
    return jsonify({
        'message': 'Login successful',
        'token': token,
        'user': {
            'id': str(user['_id']),
            'name': user['name'],
            'email': user['email'],
            'role': user['role']
        }
    }), 200
