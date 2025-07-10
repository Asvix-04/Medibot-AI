import os
import streamlit as st
from openai import OpenAI
from azure.ai.inference import ChatCompletionsClient
from azure.ai.inference.models import SystemMessage, UserMessage
from azure.core.credentials import AzureKeyCredential
import google.generativeai as genai


genai.configure(api_key=" ")
gemini_model = genai.GenerativeModel("gemini-1.5-flash")

os.environ["GITHUB_TOKEN"] = " "

# GitHub Token and Base URL for OpenAI/Mistral
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
BASE_URL = " "

# Available Models
available_models = [
    "openai/gpt-4o",
    "mistral-ai/Mistral-Large-2411",
    "gemini/gemini-1.5-flash"
]

# System prompt
DEFAULT_SYSTEM_PROMPT = (
    """You are MedBot, an expert medical assistant trained to help users understand symptoms, possible diseases, treatments, precautions, and severity levels.

Your role is to:
- Ask clarifying questions if user input is vague or incomplete.
- Identify likely diseases based on symptoms, using reliable medical knowledge.
- Provide factual and concise answers only from established medical literature.
- Recommend general precautions and over-the-counter steps when applicable.
- Clearly advise users to consult licensed healthcare professionals for diagnosis or treatment.

Always:
- Use bullet points or numbered lists when listing multiple items.
- Avoid giving direct medical advice or prescriptions.
- Clearly indicate uncertainty when applicable.
- Be empathetic, respectful, and non-alarming in tone.

Example format:
**Symptoms Identified**:
- Headache
- Nausea
- Sensitivity to light

**Possible Condition**: Migraine  
**Severity**: Moderate  
**Precautions**:
- Rest in a dark, quiet room
- Stay hydrated
- Avoid screen exposure

**Note**: Please consult a medical professional for diagnosis or treatment."""
)

# Core logic for generating responses
def generate_response(model, user_prompt):
    if not user_prompt.strip():
        return "⚠️ Please enter a valid health query."

    try:
        if model.startswith("openai/"):
            if not GITHUB_TOKEN:
                return "❌ GITHUB_TOKEN is missing."
            client = OpenAI(base_url=BASE_URL, api_key=GITHUB_TOKEN)
            response = client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": DEFAULT_SYSTEM_PROMPT},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.7,
                top_p=0.9
            )
            return response.choices[0].message.content

        elif model.startswith("mistral-ai/"):
            if not GITHUB_TOKEN:
                return "❌ GITHUB_TOKEN is missing."
            client = ChatCompletionsClient(
                endpoint=BASE_URL,
                credential=AzureKeyCredential(GITHUB_TOKEN)
            )
            response = client.complete(
                model=model,
                messages=[
                    SystemMessage(DEFAULT_SYSTEM_PROMPT),
                    UserMessage(user_prompt)
                ],
                temperature=0.7,
                top_p=0.9,
                max_tokens=1000
            )
            return response.choices[0].message.content

        elif model.startswith("gemini/"):
            full_prompt = DEFAULT_SYSTEM_PROMPT + "\n\n" + user_prompt
            response = gemini_model.generate_content([full_prompt])
            return response.text

        else:
            return "⚠️ Unsupported model selected."

    except Exception as e:
        return f"⚠️ Error: {str(e)}"

# --------------------------
# Streamlit UI
# --------------------------
st.set_page_config(page_title="AI Medical Assistant", layout="centered")
st.title(" AI Medical Assistant (OpenAI / Mistral / Gemini)")

# Model selector
selected_model = st.selectbox(" Select Model", available_models)

# User prompt
user_prompt = st.text_area(" Enter your symptoms or medical query:", height=150)

# Button
if st.button("Generate Response"):
    with st.spinner(" Generating..."):
        response = generate_response(selected_model, user_prompt)
        st.markdown("###  AI Response")
        st.markdown(response)
