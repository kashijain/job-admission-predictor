import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
import joblib
import os
import numpy as np

# Create model directory if it doesn't exist
os.makedirs('model', exist_ok=True)

print("Loading dataset...")
# Load dataset
df = pd.read_csv('data/collegePlace.csv')

# Preprocessing
# Gender: Male=1, Female=0
df['Gender'] = df['Gender'].map({'Male': 1, 'Female': 0})

# Stream: One-hot encoding or Label encoding 
# Since random forest can handle label encoded, let's map them simply
stream_mapping = {
    'Electronics And Communication': 0,
    'Computer Science': 1,
    'Information Technology': 2,
    'Mechanical': 3,
    'Electrical': 4,
    'Civil': 5
}
df['Stream'] = df['Stream'].map(stream_mapping)

# Add PrimarySkill
np.random.seed(42)
def assign_skill(placed):
    if placed:
        return np.random.choice([1, 2, 3, 4], p=[0.2, 0.3, 0.3, 0.2])
    else:
        return np.random.choice([0, 1, 2], p=[0.5, 0.3, 0.2])
        
df['PrimarySkill'] = df['PlacedOrNot'].apply(assign_skill)

# Add Projects
np.random.seed(123)
def assign_projects(placed):
    if placed:
        return np.random.choice([1, 2, 3, 4, 5], p=[0.1, 0.2, 0.4, 0.2, 0.1])
    else:
        return np.random.choice([0, 1, 2, 3], p=[0.3, 0.4, 0.2, 0.1])

df['Projects'] = df['PlacedOrNot'].apply(assign_projects)

print("Training Placement Model...")
# 1. Placement Model
X = df[['Age', 'Gender', 'Stream', 'Internships', 'CGPA', 'Hostel', 'HistoryOfBacklogs', 'PrimarySkill', 'Projects']]
y = df['PlacedOrNot']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

placement_model = RandomForestClassifier(n_estimators=100, random_state=42)
placement_model.fit(X_train, y_train)

# Save the placement model
joblib.dump(placement_model, 'model/placement_model.pkl')
print(f"Placement Model Accuracy: {placement_model.score(X_test, y_test)*100:.2f}%")


print("Training Admission Model...")
# 2. Admission Model (Using a heuristic approach trained as a classifier for admission prediction)
# If CGPA > 7.5, no backlogs -> Highly likely for admission
# To make it ML based, let's create a synthetic target column for admission
def calculate_admission_chance(row):
    score = row['CGPA'] * 10
    if row['HistoryOfBacklogs'] == 0:
        score += 5
    if row['Internships'] > 0:
        score += 5
    if row['Projects'] > 1:
        score += 5
    if row['PrimarySkill'] > 0:
        score += 5
    return 1 if score >= 85 else 0

df['AdmissionTarget'] = df.apply(calculate_admission_chance, axis=1)

y_adm = df['AdmissionTarget']
X_train_adm, X_test_adm, y_train_adm, y_test_adm = train_test_split(X, y_adm, test_size=0.2, random_state=42)

# Logistic regression outputs useful probabilities for admission
admission_model = LogisticRegression()
admission_model.fit(X_train_adm, y_train_adm)

# Save the admission model
joblib.dump(admission_model, 'model/admission_model.pkl')
print(f"Admission Model Accuracy: {admission_model.score(X_test_adm, y_test_adm)*100:.2f}%")

print("\nModels saved successfully in the 'model' folder.")
