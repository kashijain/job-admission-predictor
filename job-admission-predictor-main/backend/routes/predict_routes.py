from flask import Blueprint
from controllers.predict_controller import predict_job, predict_admission

predict_bp = Blueprint('predict_bp', __name__)

@predict_bp.route('/job', methods=['POST'])
def job_prediction():
    return predict_job()

@predict_bp.route('/admission', methods=['POST'])
def admission_prediction():
    return predict_admission()
