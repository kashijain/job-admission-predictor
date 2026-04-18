from flask import Blueprint
from controllers.admin_controller import get_all_users, get_all_complaints, get_all_predictions

admin_bp = Blueprint('admin_bp', __name__)

@admin_bp.route('/users', methods=['GET'])
def users_route():
    return get_all_users()

@admin_bp.route('/complaints', methods=['GET'])
def complaints_route():
    return get_all_complaints()

@admin_bp.route('/predictions', methods=['GET'])
def predictions_route():
    return get_all_predictions()
