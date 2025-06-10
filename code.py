import gradio as gr
import pandas as pd
from openai import OpenAI
import fitz
import faiss
import numpy as np

openai = OpenAI(base_url="http://localhost:11434/v1", api_key="ollama")

rag_df = pd.read_csv('/content/updated_disease_data_13_fuzzy_filled (1).csv')

def extract_text_from_pdf(file_path):
    doc = fitz.open(file_path)
    text = ""
    for page in doc:
        text += page.get_text()
    return text

cure_text = extract_text_from_pdf('/content/TheCureForAllDiseases.pdf')
textbook_text = extract_text_from_pdf('/content/Harrison.pdf')

rag_documents = []

for _, row in rag_df.iterrows():
    doc_text = " | ".join(str(cell) for cell in row if pd.notna(cell))
    rag_documents.append(doc_text)

rag_documents += [p for p in cure_text.split('\n\n') if p.strip()]
rag_documents += [p for p in textbook_text.split('\n\n') if p.strip()]

print(f"Total documents for retrieval: {len(rag_documents)}")


def get_embedding(text):
    response = openai.embeddings.create(input=text, model="nomic-embed-text")
    return np.array(response.data[0].embedding, dtype=np.float32)

print("Generating embeddings for documents...")

document_embeddings = []
batch_size = 16
for i in range(0, len(rag_documents), batch_size):
    batch_texts = rag_documents[i:i+batch_size]
    for txt in batch_texts:
        emb = get_embedding(txt)
        document_embeddings.append(emb)

document_embeddings = np.vstack(document_embeddings)

embedding_dim = document_embeddings.shape[1]
index = faiss.IndexFlatL2(embedding_dim)
index.add(document_embeddings)

print(f"FAISS index built with {index.ntotal} vectors.")

system_message = """
You are a knowledgeable and compassionate medical AI assistant. When the user mentions any disease or medical condition, you must carefully and thoroughly analyze all three provided documents to extract accurate, detailed, and relevant information.
For each condition, provide:
1. A clear and comprehensive description of the disease, including its nature and how it affects the body.
2. Signs and symptoms the patient might experience.
3. Necessary precautions the patient should take to manage or avoid worsening the condition.
4. Recommended methods and treatments to recover from or manage the disease, based strictly on the data from the three documents.
5. Dietary recommendations and foods to be consumed or avoided, tailored to support recovery and overall health according to the disease.
Use only the information contained within the three provided documents to answer questions. If exact information is not available, infer the closest relevant information from the web.
If the user’s query is unrelated to the medical documents, gently redirect the conversation to their health concerns.
Provide detailed answer.
"""
def retrieve_relevant_info(user_input, docs, faiss_index, k=3):
    user_emb = get_embedding(user_input)
    D, I = faiss_index.search(np.array([user_emb]), k)
    results = []
    for idx in I[0]:
        if 0 <= idx < len(docs):
            results.append(docs[idx])
    return results if results else ["No relevant information found in the document."]

def chat(message, history):
    relevant_info = retrieve_relevant_info(message, rag_documents, index)
    rag_context = "\n\n".join(relevant_info)

    full_prompt = f"""{system_message}

Relevant medical document excerpts:
{rag_context}

User question:
{message}

Please provide a clear, concise description, severity details, symptoms, and precautions based only on the above medical document.
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
            yield response

gr.ChatInterface(fn=chat, type="messages").launch(inbrowser=True, debug=True)
