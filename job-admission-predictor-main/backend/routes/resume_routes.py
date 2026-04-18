from flask import Blueprint
from controllers.resume_controller import analyze_resume

resume_bp = Blueprint('resume', __name__)

@resume_bp.route('/resume', methods=['POST'])
def resume_analyze():
    return analyze_resume()

export = resume_bp
