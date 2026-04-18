import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    # Security: Use strong secret key in production
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev_key_change_this_in_production')
    
    # MongoDB Connection
    MONGO_URI = os.environ.get('MONGO_URI', 'mongodb://localhost:27017/job_admission_db')
    
    # Flask Settings
    FLASK_ENV = os.environ.get('FLASK_ENV', 'development')
    
    # API Settings
    JSON_SORT_KEYS = False
