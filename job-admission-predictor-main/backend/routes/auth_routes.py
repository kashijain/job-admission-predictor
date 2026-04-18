from flask import Blueprint
from controllers.auth_controller import register, login

auth_bp = Blueprint('auth_bp', __name__)

@auth_bp.route('/register', methods=['POST'])
def register_user():
    return register()

@auth_bp.route('/login', methods=['POST'])
def login_user():
    return login()
