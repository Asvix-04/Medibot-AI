import gradio as gr
import pandas as pd
from openai import OpenAI
import fitz
import faiss
import numpy as np
import whisper

openai = OpenAI(base_url="http://localhost:11434/v1", api_key="ollama")
whisper_model = whisper.load_model("tiny")

# Load CSVs
rag_df = pd.read_csv('/content/updated_disease_data_13_fuzzy_filled (1).csv')
rag_df2 = pd.read_csv('/content/serious_diseases.csv')
rag_df3 = pd.read_csv('/content/dis_descp.csv')

# Extract PDF text
def extract_text_from_pdf(file_path):
    try:
        doc = fitz.open(file_path)
        return "\n".join(page.get_text() for page in doc)
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return ""

cure_text = extract_text_from_pdf('/content/TheCureForAllDiseases.pdf')
textbook_text = extract_text_from_pdf('/content/Harrison.pdf')

# Prepare RAG documents
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

# Transcribe function
def transcribe_audio(file_path):
    try:
        result = whisper_model.transcribe(file_path)
        return result["text"]
    except Exception as e:
        return f"Transcription failed: {e}"

# RAG system prompt and chat
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
Go through all the five documents thoroughly to provide the accurate answer, the five documents has the precautions too, if the answer is not found search the web for the relevant answers.
Provide detailed answer.
"""

def retrieve_relevant_info(user_input, docs, faiss_index, k=3):
    user_emb = get_embedding(user_input)
    D, I = faiss_index.search(np.array([user_emb]), k)
    return [docs[idx] for idx in I[0] if 0 <= idx < len(docs)]

def rag_response(transcribed_text):
    relevant_info = retrieve_relevant_info(transcribed_text, rag_documents, index)
    rag_context = "\n\n".join(relevant_info)

    full_prompt = f"""
Relevant medical document excerpts:
{rag_context}

User question:
{transcribed_text}

Please provide a clear, concise description, dietary recommendations, symptoms, precautions, and measures for cure based only on the above medical document.
"""

    messages = [
        {"role": "system", "content": system_message},
        {"role": "user", "content": full_prompt}
    ]

    response = ""
    stream = openai.chat.completions.create(model="llama3.2", messages=messages, stream=True)
    for chunk in stream:
        delta = chunk.choices[0].delta.content
        if delta:
            response += delta
    return response

# Gradio interface
with gr.Blocks() as demo:
    gr.Markdown("## 🎧 Whisper Medical Assistant")

    audio_input = gr.Audio(type="filepath", label="Speak your question", interactive=True)
    transcription_output = gr.Textbox(label="Transcription Result")
    rag_output = gr.Textbox(label="Medical Response")

    # Step 1: Transcribe audio
    audio_input.change(
        fn=transcribe_audio,
        inputs=audio_input,
        outputs=transcription_output
    ).then(  # Step 2: After transcription, generate RAG response
        fn=rag_response,
        inputs=transcription_output,
        outputs=rag_output
    )

demo.launch(inbrowser=True, debug=True)
