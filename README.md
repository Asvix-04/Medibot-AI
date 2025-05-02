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
