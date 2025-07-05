# RAG approach with multi model, speech to speech, multi lingual feature
import gradio as gr
import asyncio
import uuid
import numpy as np
import faiss
from openai import OpenAI
from gtts import gTTS
import whisper
from googletrans import Translator
import pandas as pd
import fitz
import os



# Initialize OpenAI API and Whisper Model
openai = OpenAI(base_url="http://localhost:11434/v1", api_key="ollama")
whisper_model = whisper.load_model("tiny")


# Placeholder for your RAG data
rag_df = pd.read_csv('/content/updated_disease_data_13_fuzzy_filled (1).csv')
rag_df2 = pd.read_csv('/content/serious_diseases.csv')
rag_df3 = pd.read_csv('/content/dis_descp.csv')

def extract_text_from_pdf(file_path):
    try:
        doc = fitz.open(file_path)
        return "\n".join(page.get_text() for page in doc)
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return ""

cure_text = extract_text_from_pdf('/content/TheCureForAllDiseases.pdf')
textbook_text = extract_text_from_pdf('/content/Harrison.pdf')

rag_documents = []

for df in [rag_df, rag_df2, rag_df3]:
    for _, row in df.iterrows():
        doc_text = " | ".join(str(cell) for cell in row if pd.notna(cell))
        rag_documents.append(doc_text)

rag_documents += [p.strip() for p in cure_text.split('\n\n') if p.strip()]
rag_documents += [p.strip() for p in textbook_text.split('\n\n') if p.strip()]

def get_embedding(text):
    response = openai.embeddings.create(input=text, model="nomic-embed-text")
    return np.array(response.data[0].embedding, dtype=np.float32)

document_embeddings = []
batch_size = 16

for i in range(0, len(rag_documents), batch_size):
    for txt in rag_documents[i:i + batch_size]:
        document_embeddings.append(get_embedding(txt))

document_embeddings = np.vstack(document_embeddings)
embedding_dim = document_embeddings.shape[1]
index = faiss.IndexFlatL2(embedding_dim)
index.add(document_embeddings)

# Transcribe function with multilingual support
async def transcribe_audio(file_path, user_lang):
    try:
        result = whisper_model.transcribe(file_path)
        transcribed_text = result["text"]

        if user_lang != "en":
            translated_text = await translate_text(transcribed_text, target_lang=user_lang)
            return translated_text  # Only return translated text (one value)
        else:
            return transcribed_text  # Only return transcribed text (one value)

    except Exception as e:
        error_msg = f"Transcription failed: {e}"
        return error_msg  # Return only the error message in case of failure

translator = Translator()

async def translate_text(text, target_lang='en'):
    result = await translator.translate(text, dest=target_lang)
    return result.text

system_message = """
You are a knowledgeable and compassionate medical AI assistant. When the user mentions any disease or medical condition, you must carefully and thoroughly analyze all five provided documents to extract accurate, detailed, and relevant information.

For each condition, provide:
1. A clear and comprehensive description of the disease, including its nature and how it affects the body.
2. Signs and symptoms the patient might experience.
3. Necessary precautions the patient should take to manage or avoid worsening the condition.
4. Recommended methods and treatments to recover from or manage the disease, based strictly on the data from the five documents.
5. Dietary recommendations and foods to be consumed or avoided, tailored to support recovery and overall health according to the disease.

Use only the information contained within the five provided documents to answer questions. If exact information is not available, infer the closest relevant information from the web.
If the user’s query is unrelated to the medical documents, gently redirect the conversation to their health concerns.
Go through all the five documents thoroughly to provide the accurate answer, the five documents have the precautions too, if the answer is not found search the web for the relevant answers.
Provide detailed answer.
"""

def retrieve_relevant_info(user_input, docs, faiss_index, k=3):
    user_emb = get_embedding(user_input)
    D, I = faiss_index.search(np.array([user_emb]), k)
    return [docs[idx] for idx in I[0] if 0 <= idx < len(docs)]

async def rag_response(transcribed_text, user_lang, selected_model):
    translated_input = await translate_text(transcribed_text, target_lang='en')  # Translate user input to English
    relevant_info = retrieve_relevant_info(translated_input, rag_documents, index)
    rag_context = "\n\n".join(relevant_info)

    full_prompt = f"""
Relevant medical document excerpts:
{rag_context}

User question:
{translated_input}

Please provide a clear, concise description, dietary recommendations, symptoms, precautions, and measures for cure based only on the above medical document.
"""

    messages = [
        {"role": "system", "content": system_message},
        {"role": "user", "content": full_prompt}
    ]

    response = ""
    if selected_model == "deepseek":
        stream = openai.chat.completions.create(
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": full_prompt}
            ],
            model="deepseek-r1:1.5b",
            stream=True
        )
        response = ""
        for chunk in stream:
            if chunk.choices[0].delta.content:
                response += chunk.choices[0].delta.content

    elif selected_model == "gemma3n":
        stream = openai.chat.completions.create(
            model="gemma3n",
            messages=[{"role": "system", "content": system_message}, {"role": "user", "content": full_prompt}],
            stream=True
        )
        response = ""
        for chunk in stream:
            if chunk.choices[0].delta.content:
                response += chunk.choices[0].delta.content
    else:
        stream = openai.chat.completions.create(model="llama3.2", messages=messages, stream=True)
        response = ""
        for chunk in stream:
            delta = chunk.choices[0].delta.content
            if delta:
                response += delta


    # Translate the response back to the user's selected language
    translated_response = await translate_text(response, target_lang=user_lang)

    # Now, generate speech in the selected language
    audio_path = f"output_{uuid.uuid4().hex}.mp3"
    gtts_tts = gTTS(text=translated_response, lang=user_lang)
    gtts_tts.save(audio_path)


    return translated_response, audio_path  # Ensure both text and audio are returned

# Remove unwanted characters from text before passing to TTS
async def clean_text_for_tts(text):
    return text.replace('*', '').replace('[', '').replace(']', '')


async def handle_text_input(text, lang, selected_model):
    cleaned_text = await clean_text_for_tts(text)  # Clean text before passing to TTS
    return await rag_response(cleaned_text, lang, selected_model)

with gr.Blocks() as demo:
    gr.Markdown("## 🎧 Whisper Medical Assistant")

    model_select=gr.Dropdown(
        label="select model",
        choices=["llama3.2","deepseek","gemma3n"],
        value="llama3.2"
    )

    audio_input = gr.Audio(type="filepath", label="Speak your question", interactive=True)
    text_input = gr.Textbox(label="Or Type your question", placeholder="Type here...", interactive=True)
    submit_button = gr.Button("Submit")

    transcription_output = gr.Textbox(label="Transcription Result")
    rag_output = gr.Textbox(label="Medical Response")
    audio_output = gr.Audio(label="Response Audio", type="filepath")

    selected_lang = gr.Dropdown(
        label="Select Language",
        choices=["en", "es", "fr", "de", "it", "pt", "zh", "ja", "ko", "ru", "hi", "ta", "kn", "te", "mr", "ml", "gu", "pa", "as"],
        value="en"  # Default to English
    )

    # Transcribe audio (with multilingual support)
    audio_input.change(
        fn=transcribe_audio,
        inputs=[audio_input, selected_lang],
        outputs=[transcription_output]  # Only output the transcription result
    ).then(
        fn=rag_response,
        inputs=[transcription_output, selected_lang],
        outputs=[rag_output, audio_output]
    )

    # Text input
    submit_button.click(
        fn=handle_text_input,
        inputs=[text_input, selected_lang, model_select],
        outputs=[rag_output, audio_output]
    )

demo.launch(inbrowser=True, debug=True, share=True)
