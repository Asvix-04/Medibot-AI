import re
import pandas as pd
import numpy as np
from sklearn import preprocessing
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.model_selection import train_test_split
import csv
import warnings
warnings.filterwarnings("ignore", category=DeprecationWarning)

# Load the training and testing data
training = pd.read_csv('Training.csv')
testing = pd.read_csv('Testing.csv')

# Preparing the data
cols = training.columns[:-1]
x = training[cols]
y = training['prognosis']

# Encoding string labels to numeric values
le = preprocessing.LabelEncoder()
le.fit(y)
y = le.transform(y)

# Split the data into train and test sets
x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.33, random_state=42)

# Gradient Boosting Classifier Model
gbc = GradientBoostingClassifier()
gbc.fit(x_train, y_train)
print(f"Gradient Boosting Classifier score: {gbc.score(x_test, y_test)}")

# Dictionaries for severity, description, and precautions
description_list = {}
severityDictionary = {}
precautionDictionary = {}

def load_csv_data(file_path, dictionary, columns):
    try:
        with open(file_path) as csv_file:
            csv_reader = csv.reader(csv_file)
            for row in csv_reader:
                if len(row) >= columns:
                    dictionary[row[0]] = row[1:columns]
    except Exception as e:
        print(f"Error loading {file_path}: {e}")

# Load data from CSV files
load_csv_data('symptom_Description.csv', description_list, 2)
load_csv_data('Symptom_severity.csv', severityDictionary, 2)
load_csv_data('symptom_precaution.csv', precautionDictionary, 5)

# Function to get severity level
def get_severity(disease):
    severity = severityDictionary.get(disease, ['Unknown'])[0]
    if severity == 'Mild':
        return f"Severity: Mild"
    elif severity == 'Moderate':
        return f"Severity: Moderate"
    elif severity == 'Severe':
        return f"Severity: Severe"
    else:
        return ""

# Function to collect user info and greet
def getInfo():
    print("-----------------------------------AI Medical ChatBot-----------------------------------")
    name = input("\nYour Name? -> ")
    print(f"Hello, {name}")

# Function to find related symptoms
def get_related_symptoms(symptom):
    possible_symptoms = [s for s in x.columns if symptom.lower() in s.lower().replace("_", "")]
    return possible_symptoms if possible_symptoms else None

# Ask user about related symptoms
def ask_related_symptoms(symptom):
    related_symptoms = get_related_symptoms(symptom)
    confirmed_symptoms = [symptom]
    if related_symptoms and len(related_symptoms) > 1:
        print("Are you experiencing any of these symptoms?")
        for s in related_symptoms:
            response = input(f"{s.replace('_', ' ')}? (yes/no): ").strip().lower()
            if response == 'yes':
                confirmed_symptoms.append(s)
    return confirmed_symptoms

# Predict disease function
def disease_prediction(symptoms_exp):
    input_vector = np.zeros(len(x.columns))
    for symptom in symptoms_exp:
        if symptom in x.columns:
            input_vector[x.columns.get_loc(symptom)] = 1
    prediction = gbc.predict([input_vector])
    return le.inverse_transform(prediction)[0]

# Main function
def main():
    getInfo()
    symptoms_exp = set()
    while True:
        symptom = input("Enter a symptom you are experiencing (or type 'done' to finish): ").strip().lower().replace(" ", "_")
        if symptom == 'done':
            break
        related_symptoms = ask_related_symptoms(symptom)
        symptoms_exp.update(related_symptoms)
    if not symptoms_exp:
        print("No symptoms entered. Exiting.")
        return
    disease = disease_prediction(symptoms_exp)
    print(f"You may have {disease}")
    print(f"{description_list.get(disease, ['No description available.'])[0]}")
    severity = get_severity(disease)
    if severity:
        print(severity)
    else:
        print("Please consult a doctor for further advice.")
    precautions = precautionDictionary.get(disease, [])
    if precautions:
        print("Take the following precautions:")
        for i, precaution in enumerate(precautions, 1):
            print(f"{i}) {precaution}")
    else:
        print("No precautions available. Please consult a doctor.")

if __name__ == "__main__":
    main()
