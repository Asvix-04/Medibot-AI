# AI Medical Chatbot

This project is an AI-based chatbot designed to help users predict potential diseases based on their input symptoms. The chatbot uses machine learning algorithms, including Decision Tree Classifier and Support Vector Machine Classifier, to predict diseases and advise whether a doctor consultation is necessary. Additionally, it gives precautionary advice based on the symptoms provided. 
 
## Project Structure 

The chatbot relies on several CSV files for its data, including symptom descriptions, severities, and precautions. The code is structured to:

1. Load and preprocess training and testing data.
2. Use machine learning models to predict diseases.
3. Provide text-to-speech feedback using the `pyttsx3` library. 
4. Display disease descriptions and precautions based on the predicted outcome.

### Files in the Project

- **`Symptom_severity.csv`**: Contains information about the severity level of each symptom.
- **`Testing.csv`**: Contains test data to evaluate the model's accuracy.
- **`Training.csv`**: Contains training data for model learning.
- **`dataset (1).csv`**: Contains example disease data like:
  ```
  Fungal infection, itching, skin rash, nodal skin eruptions, dischromic patches
  ```
- **`symptom_Description.csv`**: Contains descriptions of each symptom.
- **`symptom_precaution.csv`**: Provides precautionary measures for each predicted disease.

### Libraries Used

- `pandas`: For data manipulation and analysis.
- `scikit-learn`: For machine learning models and cross-validation.
- `pyttsx3`: For text-to-speech functionality.
- `re`: For pattern matching in symptom input.

### Code Example

```python
import re
import pandas as pd
import pyttsx3
from sklearn import preprocessing
from sklearn.tree import DecisionTreeClassifier, _tree
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.model_selection import cross_val_score
from sklearn.svm import SVC
import csv
import warnings
warnings.filterwarnings("ignore", category=DeprecationWarning)

# Load the training and testing data
training = pd.read_csv('Training.csv')
testing = pd.read_csv('Testing.csv')

# Preparing the data
cols = training.columns
cols = cols[:-1]
x = training[cols]
y = training['prognosis']
y1 = y

# Encoding string labels to numeric values
le = preprocessing.LabelEncoder()
le.fit(y)
y = le.transform(y)

# Split the data into train and test sets
x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.33, random_state=42)

# DecisionTreeClassifier Model
clf1 = DecisionTreeClassifier()
clf = clf1.fit(x_train, y_train)

# Cross-validation to check accuracy
scores = cross_val_score(clf, x_test, y_test, cv=3)
print(f"Decision Tree Classifier score: {scores.mean()}")

# Support Vector Classifier Model
model = SVC()
model.fit(x_train, y_train)
print("SVM score: ", model.score(x_test, y_test))
```

### How to Run

1. Clone the repository.
   ```bash
   git clone https://github.com/vignesh1507/AI-Medical-Chatbot.git
   ```
3. Ensure all required libraries are installed:
    ```bash
    pip3 install -r requirements.txt
    ```
4. Run the `AI Medical Chatbot` script in the terminal:
    ```bash
    python code.py
    ```

### How It Works

1. The chatbot asks for your symptoms.
2. It predicts potential diseases using the Decision Tree & SVM classifier.
3. The chatbot cross-validates the predictions to ensure accuracy.
4. It also suggests precautions based on the identified disease and speaks the output using text-to-speech.


### Precautionary Advice

Based on the predicted disease, the chatbot also gives precautionary advice from the `symptom_precaution.csv`.

### Author

- **Vignesh Skanda**: Developer of the AI Medical Chatbot.
