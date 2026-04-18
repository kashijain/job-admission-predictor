"""
B.Tech College Recommender Engine
Recommends colleges based on JEE score, branch, category, state, and college type preference
"""

BTECH_COLLEGES = {
    'Tier 1 - NITs and Top Government': {
        'colleges': [
            {'name': 'National Institute of Technology Delhi', 'icon': '🏛️', 'popular_branches': ['CSE', 'Mechanical'], 'location': 'Delhi', 'type': 'Government'},
            {'name': 'National Institute of Technology Bombay', 'icon': '🏛️', 'popular_branches': ['CSE', 'ECE'], 'location': 'Maharashtra', 'type': 'Government'},
            {'name': 'National Institute of Technology Madras', 'icon': '🏛️', 'popular_branches': ['CSE', 'Mechanical'], 'location': 'Tamil Nadu', 'type': 'Government'},
            {'name': 'National Institute of Technology Warangal', 'icon': '🏛️', 'popular_branches': ['CSE', 'ECE'], 'location': 'Telangana', 'type': 'Government'},
            {'name': 'National Institute of Technology Surathkal', 'icon': '🏛️', 'popular_branches': ['CSE', 'Mechanical'], 'location': 'Karnataka', 'type': 'Government'},
            {'name': 'National Institute of Technology Rourkela', 'icon': '🏛️', 'popular_branches': ['CSE', 'Electrical','Mechanical'], 'location': 'Odisha', 'type': 'Government'},
        ]
    },
    'Tier 2 - GFTI & Good Government': {
        'colleges': [
            {'name': 'Delhi Technological University (DTU)', 'icon': '🎓', 'popular_branches': ['CSE', 'ECE', 'Mechanical'], 'location': 'Delhi', 'type': 'Government'},
            {'name': 'Netaji Subhas University of Technology', 'icon': '🎓', 'popular_branches': ['CSE', 'Mechanical'], 'location': 'Delhi', 'type': 'Government'},
            {'name': 'MNIT Jaipur', 'icon': '🎓', 'popular_branches': ['CSE', 'Civil'], 'location': 'Rajasthan', 'type': 'Government'},
            {'name': 'NITK Mangalore', 'icon': '🎓', 'popular_branches': ['CSE', 'Mechanical'], 'location': 'Karnataka', 'type': 'Government'},
            {'name': 'Jadavpur University', 'icon': '🎓', 'popular_branches': ['CSE', 'Mechanical'], 'location': 'West Bengal', 'type': 'Government'},
            {'name': 'Anna University', 'icon': '🎓', 'popular_branches': ['CSE', 'ECE'], 'location': 'Tamil Nadu', 'type': 'Government'},
            {'name': 'IIIT Delhi', 'icon': '💻', 'popular_branches': ['CSE', 'ECE'], 'location': 'Delhi', 'type': 'Government'},
            {'name': 'IIIT Hyderabad', 'icon': '💻', 'popular_branches': ['CSE'], 'location': 'Telangana', 'type': 'Government'},
        ]
    },
    'Tier 3 - Private & State Universities': {
        'colleges': [
            {'name': 'Vellore Institute of Technology (VIT)', 'icon': '🏢', 'popular_branches': ['CSE', 'ECE', 'Mechanical'], 'location': 'Tamil Nadu', 'type': 'Private'},
            {'name': 'Manipal University', 'icon': '🏢', 'popular_branches': ['CSE', 'ECE', 'Mechanical'], 'location': 'Karnataka', 'type': 'Private'},
            {'name': 'Amrita Vishwa Vidyapeetham', 'icon': '🏢', 'popular_branches': ['CSE', 'ECE'], 'location': 'Kerala', 'type': 'Private'},
            {'name': 'SRM University', 'icon': '🏢', 'popular_branches': ['CSE', 'Mechanical'], 'location': 'Tamil Nadu', 'type': 'Private'},
            {'name': 'LPU Punjab', 'icon': '🏢', 'popular_branches': ['CSE', 'ECE', 'Mechanical'], 'location': 'Punjab', 'type': 'Private'},
            {'name': 'Chandigarh University', 'icon': '🏢', 'popular_branches': ['CSE', 'Mechanical'], 'location': 'Punjab', 'type': 'Private'},
        ]
    }
}


def recommend_btech_colleges(jee_score, percentage_12, pcm_percentage, preferred_branch, category, state, college_type='Any'):
    """
    Recommend B.Tech colleges based on profile
    
    Returns: safe_colleges, moderate_colleges, ambitious_colleges
    """
    
    # Determine tier based on scores
    if jee_score >= 90 and percentage_12 >= 90:
        base_tier = 'Tier 1'
    elif jee_score >= 75 and percentage_12 >= 80:
        base_tier = 'Tier 2'
    else:
        base_tier = 'Tier 3'
    
    safe_colleges = []
    moderate_colleges = []
    ambitious_colleges = []
    
    # Strategy: Recommend across all tiers based on score
    
    # SAFE: One tier below their base tier
    if base_tier == 'Tier 1':
        safe_tier_colleges = BTECH_COLLEGES['Tier 2 - GFTI & Good Government']['colleges']
        for college in safe_tier_colleges[:2]:
            if college_type == 'Any' or college['type'] == college_type:
                safe_colleges.append({
                    'name': college['name'],
                    'branch_available': preferred_branch in college['popular_branches'],
                    'reason': f'High probability - secure backup option',
                    'tier': 'Tier 2'
                })
    elif base_tier == 'Tier 2':
        safe_tier_colleges = BTECH_COLLEGES['Tier 3 - Private & State Universities']['colleges']
        for college in safe_tier_colleges[:2]:
            if college_type == 'Any' or college['type'] == college_type:
                safe_colleges.append({
                    'name': college['name'],
                    'branch_available': preferred_branch in college['popular_branches'],
                    'reason': f'Excellent fit for your profile',
                    'tier': 'Tier 3'
                })
    else:  # Tier 3
        safe_tier_colleges = BTECH_COLLEGES['Tier 3 - Private & State Universities']['colleges']
        for college in safe_tier_colleges[2:4]:
            if college_type == 'Any' or college['type'] == college_type:
                safe_colleges.append({
                    'name': college['name'],
                    'branch_available': preferred_branch in college['popular_branches'],
                    'reason': f'Strong profile match',
                    'tier': 'Tier 3'
                })
    
    # MODERATE: Same tier as their base tier
    moderate_tier_colleges = BTECH_COLLEGES[{
        'Tier 1': 'Tier 1 - NITs and Top Government',
        'Tier 2': 'Tier 2 - GFTI & Good Government',
        'Tier 3': 'Tier 3 - Private & State Universities'
    }[base_tier]]['colleges']
    
    for college in moderate_tier_colleges[1:3]:
        if college_type == 'Any' or college['type'] == college_type:
            moderate_colleges.append({
                'name': college['name'],
                'branch_available': preferred_branch in college['popular_branches'],
                'reason': f'Competitive but achievable with your scores',
                'tier': base_tier
            })
    
    # AMBITIOUS: One tier above their base tier
    if base_tier == 'Tier 3':
        ambitious_tier_colleges = BTECH_COLLEGES['Tier 2 - GFTI & Good Government']['colleges']
        for college in ambitious_tier_colleges[:1]:
            if college_type == 'Any' or college['type'] == college_type:
                ambitious_colleges.append({
                    'name': college['name'],
                    'branch_available': preferred_branch in college['popular_branches'],
                    'reason': f'Stretch goal - worth trying with your strong JEE score',
                    'tier': 'Tier 2'
                })
    elif base_tier == 'Tier 2':
        ambitious_tier_colleges = BTECH_COLLEGES['Tier 1 - NITs and Top Government']['colleges']
        for college in ambitious_tier_colleges[:2]:
            if college_type == 'Any' or college['type'] == college_type:
                ambitious_colleges.append({
                    'name': college['name'],
                    'branch_available': preferred_branch in college['popular_branches'],
                    'reason': f'Ambitious choice - excellent JEE performance helps',
                    'tier': 'Tier 1'
                })
    else:  # Tier 1
        ambitious_tier_colleges = BTECH_COLLEGES['Tier 1 - NITs and Top Government']['colleges']
        for college in ambitious_tier_colleges[:3]:
            if college_type == 'Any' or college['type'] == college_type:
                ambitious_colleges.append({
                    'name': college['name'],
                    'branch_available': preferred_branch in college['popular_branches'],
                    'reason': f'Top choice - pursue your preferred branch',
                    'tier': 'Tier 1'
                })
    
    # Category-based recommendation note
    category_note = ""
    if category in ['SC', 'ST', 'OBC']:
        category_note = f"Your {category} category reservation strengthens your profile. You may qualify for colleges at higher tiers than peers with similar scores."
    
    return {
        'safe_colleges': safe_colleges,
        'moderate_colleges': moderate_colleges,
        'ambitious_colleges': ambitious_colleges,
        'category_note': category_note
    }
