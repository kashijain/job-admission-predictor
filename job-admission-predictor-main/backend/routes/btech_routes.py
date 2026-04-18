from flask import Blueprint
from controllers.btech_controller import predict_btech

btech_bp = Blueprint('btech_bp', __name__)

@btech_bp.route('/btech', methods=['POST'])
def btech_prediction():
    return predict_btech()
