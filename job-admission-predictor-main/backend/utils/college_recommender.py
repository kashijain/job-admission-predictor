"""
College Recommendation Engine for M.Tech Admissions
Uses rule-based logic based on CGPA, internships, projects, and GATE score
"""

# Define your college database
COLLEGES_DATABASE = {
    'Tier 1': {
        'tier_name': 'Tier 1 - Premium Institutes',
        'tier_description': 'Top IITs and Central Universities',
        'minimum_cgpa': 7.5,
        'colleges': [
            {
                'name': 'Indian Institute of Technology Delhi',
                'abbreviation': 'IIT Delhi',
                'cgpa_required': 8.0,
                'gate_preferred': True,
                'specializations': ['CSE', 'ECE', 'Mechanical', 'Power Systems']
            },
            {
                'name': 'Indian Institute of Technology Bombay',
                'abbreviation': 'IIT Bombay',
                'cgpa_required': 8.0,
                'gate_preferred': True,
                'specializations': ['CSE', 'ECE', 'Mechanical', 'Civil']
            },
            {
                'name': 'Indian Institute of Technology Madras',
                'abbreviation': 'IIT Madras',
                'cgpa_required': 7.8,
                'gate_preferred': True,
                'specializations': ['CSE', 'ECE', 'Mechanical']
            },
            {
                'name': 'Indian Institute of Technology Kharagpur',
                'abbreviation': 'IIT Kharagpur',
                'cgpa_required': 7.8,
                'gate_preferred': True,
                'specializations': ['CSE', 'ECE', 'Mechanical', 'Civil']
            },
            {
                'name': 'Indian Institute of Technology Kanpur',
                'abbreviation': 'IIT Kanpur',
                'cgpa_required': 7.7,
                'gate_preferred': True,
                'specializations': ['CSE', 'ECE', 'Mechanical']
            },
            {
                'name': 'National Institute of Technology Delhi',
                'abbreviation': 'NIT Delhi',
                'cgpa_required': 7.8,
                'gate_preferred': True,
                'specializations': ['CSE', 'ECE', 'Mechanical']
            }
        ]
    },
    'Tier 2': {
        'tier_name': 'Tier 2 - Very Good Institutes',
        'tier_description': 'Good NITs and Central Universities',
        'minimum_cgpa': 6.5,
        'colleges': [
            {
                'name': 'National Institute of Technology Trichy',
                'abbreviation': 'NIT Trichy',
                'cgpa_required': 7.2,
                'gate_preferred': True,
                'specializations': ['CSE', 'ECE', 'Mechanical', 'Civil']
            },
            {
                'name': 'National Institute of Technology Warangal',
                'abbreviation': 'NIT Warangal',
                'cgpa_required': 7.0,
                'gate_preferred': True,
                'specializations': ['CSE', 'ECE', 'Mechanical']
            },
            {
                'name': 'National Institute of Technology Surathkal',
                'abbreviation': 'NIT Surathkal',
                'cgpa_required': 7.0,
                'gate_preferred': True,
                'specializations': ['CSE', 'ECE', 'Mechanical']
            },
            {
                'name': 'Delhi Technological University',
                'abbreviation': 'DTU',
                'cgpa_required': 7.0,
                'gate_preferred': False,
                'specializations': ['CSE', 'ECE', 'Mechanical']
            },
            {
                'name': 'Jadavpur University',
                'abbreviation': 'Jadavpur University',
                'cgpa_required': 6.8,
                'gate_preferred': False,
                'specializations': ['CSE', 'ECE', 'Mechanical', 'Civil']
            },
            {
                'name': 'Andhra University',
                'abbreviation': 'Andhra University',
                'cgpa_required': 6.5,
                'gate_preferred': False,
                'specializations': ['CSE', 'ECE', 'Mechanical']
            }
        ]
    },
    'Tier 3': {
        'tier_name': 'Tier 3 - Good Regional Institutes',
        'tier_description': 'State Universities and Other Institutes',
        'minimum_cgpa': 5.5,
        'colleges': [
            {
                'name': 'Anna University',
                'abbreviation': 'Anna University',
                'cgpa_required': 6.0,
                'gate_preferred': False,
                'specializations': ['CSE', 'ECE', 'Mechanical', 'Civil']
            },
            {
                'name': 'Pune University',
                'abbreviation': 'Pune University',
                'cgpa_required': 5.8,
                'gate_preferred': False,
                'specializations': ['CSE', 'ECE', 'Mechanical']
            },
            {
                'name': 'Mysore University',
                'abbreviation': 'Mysore University',
                'cgpa_required': 5.7,
                'gate_preferred': False,
                'specializations': ['CSE', 'ECE', 'Mechanical']
            },
            {
                'name': 'Karnataka State University',
                'abbreviation': 'Karnataka University',
                'cgpa_required': 5.6,
                'gate_preferred': False,
                'specializations': ['CSE', 'ECE', 'Mechanical']
            },
            {
                'name': 'Bharati Vidyapeeth',
                'abbreviation': 'Bharati Vidyapeeth',
                'cgpa_required': 5.5,
                'gate_preferred': False,
                'specializations': ['CSE', 'ECE', 'Mechanical', 'Civil']
            }
        ]
    }
}


def get_college_tier(cgpa, internships, projects, gate_qualified=False, gate_score=None):
    """
    Determine the expected college tier based on student profile.
    
    Args:
        cgpa (float): Student CGPA (0-10)
        internships (int): Number of internships
        projects (int): Number of projects
        gate_qualified (bool): Whether student qualified GATE
        gate_score (int/float): GATE score if available
    
    Returns:
        str: 'Tier 1', 'Tier 2', or 'Tier 3'
    """
    # Calculate score with weights
    cgpa_weight = 0.6  # CGPA is most important (60%)
    internship_weight = 0.15  # Internships (15%)
    project_weight = 0.15  # Projects (15%)
    gate_weight = 0.1  # GATE bonus (10%)
    
    # Normalize inputs
    cgpa_score = (cgpa / 10) * 100  # 0-100
    internship_score = min((internships / 3) * 100, 100)  # Normalize to 0-100, max at 3+
    project_score = min((projects / 5) * 100, 100)  # Normalize to 0-100, max at 5+
    gate_score_normalized = 0
    
    if gate_qualified and gate_score:
        # GATE score typically ranges 0-1000
        # Score > 600 is good, > 700 is excellent
        gate_score_normalized = min((gate_score / 700) * 100, 100)
    elif gate_qualified:
        gate_score_normalized = 50  # Qualified but no score info
    
    # Calculate weighted score
    weighted_score = (
        (cgpa_score * cgpa_weight) +
        (internship_score * internship_weight) +
        (project_score * project_weight) +
        (gate_score_normalized * gate_weight)
    )
    
    # Determine tier based on weighted score
    if weighted_score >= 75:
        return 'Tier 1'
    elif weighted_score >= 65:
        return 'Tier 2'
    else:
        return 'Tier 3'


def recommend_colleges(cgpa, internships, projects, gate_qualified=False, gate_score=None, stream='Computer Science'):
    """
    Recommend colleges based on student profile.
    Returns colleges categorized as Safe, Moderate, and Ambitious.
    
    Args:
        cgpa (float): Student CGPA (0-10)
        internships (int): Number of internships
        projects (int): Number of projects
        gate_qualified (bool): Whether student qualified GATE
        gate_score (int/float): GATE score if available
        stream (str): Student's stream/branch
    
    Returns:
        dict: Contains college_tier, safe_colleges, moderate_colleges, ambitious_colleges
    """
    college_tier = get_college_tier(cgpa, internships, projects, gate_qualified, gate_score)
    
    safe_colleges = []
    moderate_colleges = []
    ambitious_colleges = []
    
    # Bonus for GATE qualification and projects
    cgpa_boost = 0
    if gate_qualified and gate_score and gate_score > 650:
        cgpa_boost = 0.3
    elif gate_qualified:
        cgpa_boost = 0.15
    
    cgpa_boosted = cgpa + cgpa_boost
    
    # Classification logic
    if college_tier == 'Tier 1':
        # Tier 1 candidates can apply to all tiers
        
        # Safe: Tier 2 colleges
        for college in COLLEGES_DATABASE['Tier 2']['colleges'][:2]:
            safe_colleges.append({
                'name': college['name'],
                'abbreviation': college['abbreviation'],
                'tier': 'Tier 2',
                'reason': f"Your profile matches Tier 2 institutes perfectly"
            })
        
        # Moderate: Top Tier 2 and bottom Tier 1
        moderate_colleges.append({
            'name': 'National Institute of Technology Trichy',
            'abbreviation': 'NIT Trichy',
            'tier': 'Tier 2',
            'reason': 'Strong institute, competitive cut-off'
        })
        
        for college in COLLEGES_DATABASE['Tier 1']['colleges'][-2:]:
            moderate_colleges.append({
                'name': college['name'],
                'abbreviation': college['abbreviation'],
                'tier': 'Tier 1',
                'reason': 'Your CGPA qualifies; GATE helps'
            })
        
        # Ambitious: Top Tier 1 colleges (if GATE qualified with good score)
        if gate_qualified and gate_score and gate_score > 700:
            ambitious_colleges.append({
                'name': 'Indian Institute of Technology Delhi',
                'abbreviation': 'IIT Delhi',
                'tier': 'Tier 1',
                'reason': 'Strong GATE score + excellent CGPA'
            })
            ambitious_colleges.append({
                'name': 'Indian Institute of Technology Bombay',
                'abbreviation': 'IIT Bombay',
                'tier': 'Tier 1',
                'reason': 'Premium choice with strong profile'
            })
        else:
            ambitious_colleges.append({
                'name': 'Indian Institute of Technology Madras',
                'abbreviation': 'IIT Madras',
                'tier': 'Tier 1',
                'reason': 'Good fit for your profile'
            })
    
    elif college_tier == 'Tier 2':
        # Tier 2 candidates: Safe in Tier 2/3, Moderate in good Tier 2, Ambitious in Tier 1
        
        # Safe: Tier 3 colleges
        for college in COLLEGES_DATABASE['Tier 3']['colleges'][:2]:
            safe_colleges.append({
                'name': college['name'],
                'abbreviation': college['abbreviation'],
                'tier': 'Tier 3',
                'reason': 'Excellent fit for your strong profile'
            })
        
        # Moderate: Tier 2 colleges
        for college in COLLEGES_DATABASE['Tier 2']['colleges'][1:3]:
            moderate_colleges.append({
                'name': college['name'],
                'abbreviation': college['abbreviation'],
                'tier': 'Tier 2',
                'reason': f'Matches your profile well'
            })
        
        # Ambitious: Good Tier 1 colleges (if conditions are met)
        if cgpa >= 7.5 and internships >= 2 and gate_qualified:
            ambitious_colleges.append({
                'name': 'National Institute of Technology Delhi',
                'abbreviation': 'NIT Delhi',
                'tier': 'Tier 1',
                'reason': 'Strong profile with GATE qualification'
            })
        if cgpa >= 7.8 and gate_qualified and gate_score and gate_score > 600:
            ambitious_colleges.append({
                'name': 'Indian Institute of Technology Kanpur',
                'abbreviation': 'IIT Kanpur',
                'tier': 'Tier 1',
                'reason': 'Excellent CGPA + GATE score'
            })
    
    else:  # Tier 3
        # Tier 3 candidates: Safe in Tier 3, Moderate in Tier 2, Ambitious in good Tier 2
        
        # Safe: Tier 3 colleges
        for college in COLLEGES_DATABASE['Tier 3']['colleges'][2:4]:
            safe_colleges.append({
                'name': college['name'],
                'abbreviation': college['abbreviation'],
                'tier': 'Tier 3',
                'reason': 'Strong match for your profile'
            })
        
        # Moderate: Lower Tier 2 colleges
        for college in COLLEGES_DATABASE['Tier 2']['colleges'][-2:]:
            moderate_colleges.append({
                'name': college['name'],
                'abbreviation': college['abbreviation'],
                'tier': 'Tier 2',
                'reason': 'Challenging but achievable'
            })
        
        # Ambitious: Better Tier 2 colleges (if GATE qualified)
        if gate_qualified and gate_score and gate_score > 650:
            ambitious_colleges.append({
                'name': 'National Institute of Technology Warangal',
                'abbreviation': 'NIT Warangal',
                'tier': 'Tier 2',
                'reason': 'GATE score strengthens your profile'
            })
        if cgpa >= 7.0 and internships >= 2:
            ambitious_colleges.append({
                'name': 'Delhi Technological University',
                'abbreviation': 'DTU',
                'tier': 'Tier 2',
                'reason': 'Strong academics and experience'
            })
    
    return {
        'college_tier': college_tier,
        'safe_colleges': safe_colleges,
        'moderate_colleges': moderate_colleges,
        'ambitious_colleges': ambitious_colleges,
        'recommendation_summary': get_recommendation_summary(college_tier, cgpa, gate_qualified, gate_score)
    }


def get_recommendation_summary(tier, cgpa, gate_qualified, gate_score):
    """Generate a helpful summary message for the student"""
    summary = f"Based on your profile (CGPA: {cgpa}/10"
    
    if gate_qualified and gate_score:
        summary += f", GATE: {gate_score}/1000"
    
    summary += f"), you are likely to secure admission in {tier} institutes. "
    
    if tier == 'Tier 1':
        summary += "Focus on your GATE preparation to secure better rankings in premier institutes."
    elif tier == 'Tier 2':
        summary += "You have a good chance at high-quality institutes. Consider appearing for GATE to expand your options."
    else:
        summary += "You have a solid chance at quality institutes. Improve your GATE score to open doors to better institutions."
    
    return summary
