from flask import Flask
from flask_cors import CORS
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
import os
from config import Config
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # CORS Configuration - Allow frontend URLs
    # In production, specify exact fronted URLs instead of "*"
    CORS(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:5173", "http://localhost:3000"],
            "methods": ["GET", "POST", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })
    
    # Initialize MongoDB Client with error handling
    try:
        client = MongoClient(app.config['MONGO_URI'], serverSelectionTimeoutMS=5000)
        # Test connection
        client.admin.command('ping')
        app.db = client.get_default_database()
        logger.info("✓ MongoDB connection successful")
    except ConnectionFailure as e:
        logger.error(f"✗ MongoDB connection failed: {e}")
        logger.warning("Using mock database - predictions won't be saved")
        app.db = None
    except Exception as e:
        logger.error(f"✗ Unexpected error connecting to MongoDB: {e}")
        app.db = None
    
    # Create required collections automatically
    if app.db is not None:
        if 'users' not in app.db.list_collection_names():
            app.db.create_collection('users')
        if 'predictions' not in app.db.list_collection_names():
            app.db.create_collection('predictions')
        if 'complaints' not in app.db.list_collection_names():
            app.db.create_collection('complaints')
        logger.info("✓ Collections initialized")

    # Register Blueprints
    from routes.auth_routes import auth_bp
    from routes.predict_routes import predict_bp
    from routes.complaint_routes import complaint_bp
    from routes.admin_routes import admin_bp
    from routes.btech_routes import btech_bp
    from routes.resume_routes import resume_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(predict_bp, url_prefix='/api/predict')
    app.register_blueprint(complaint_bp, url_prefix='/api/complaint')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(btech_bp, url_prefix='/api/predict')
    app.register_blueprint(resume_bp, url_prefix='/api/tools')
    
    @app.route('/')
    def index():
        return {
            "message": "🎓 Job and Admission Predictor API is running",
            "status": "healthy",
            "db_connected": app.db is not None
        }, 200

    return app

if __name__ == '__main__':
    app = create_app()
    port = int(os.environ.get("PORT", 5000))
    # In production, set debug=False
    app.run(host="0.0.0.0", port=port, debug=True)
