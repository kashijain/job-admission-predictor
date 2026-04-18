from flask import Blueprint
from controllers.complaint_controller import add_complaint, check_duplicate, get_user_complaints

complaint_bp = Blueprint('complaint_bp', __name__)

@complaint_bp.route('/add', methods=['POST'])
def add_complaint_route():
    return add_complaint()

@complaint_bp.route('/check-duplicate', methods=['POST'])
def check_duplicate_route():
    return check_duplicate()

@complaint_bp.route('/mine', methods=['GET'])
def get_user_complaints_route():
    return get_user_complaints()
