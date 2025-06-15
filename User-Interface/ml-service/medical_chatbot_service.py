import os
import pandas as pd
import numpy as np
import fitz
import faiss
from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import threading

app = Flask(__name__)
CORS(app)

# Standard initialization for OpenAI 1.3.0
openai = OpenAI(
    base_url="http://localhost:11434/v1", 
    api_key="ollama"
)

rag_documents = []
index = None
document_embeddings = []
embedding_dim = 0

# Add an initialization flag to track when data loading is complete
initialization_complete = False
initialization_lock = threading.Lock()

system_message = """
You are a knowledgeable and compassionate medical AI assistant. When the user mentions any disease or medical condition, you must carefully and thoroughly analyze all provided documents to extract accurate, detailed, and relevant information.

For each condition, provide:
1. A clear and comprehensive description of the disease, including its nature and how it affects the body.
2. Signs and symptoms the patient might experience.
3. Necessary precautions the patient should take to manage or avoid worsening the condition.
4. Recommended methods and treatments to recover from or manage the disease, based strictly on the data from the documents.
5. Dietary recommendations and foods to be consumed or avoided, tailored to support recovery and overall health according to the disease.

Use only the information contained within the provided documents to answer questions. If exact information is not available, clearly state that.
Provide detailed answer in a friendly, conversational tone.
"""

def extract_text_from_pdf(file_path):
    """Extract text from a PDF file"""
    try:
        doc = fitz.open(file_path)
        text = ""
        for page in doc:
            text += page.get_text()
        return text
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return ""

def get_embedding(text):
    """Get embedding for a text using Ollama API"""
    response = openai.embeddings.create(input=text, model="nomic-embed-text")
    return np.array(response.data[0].embedding, dtype=np.float32)

# Make sure retrieve_relevant_info has error handling
def retrieve_relevant_info(user_input, docs, faiss_index, k=3):
    """Retrieve relevant information from documents using vector search"""
    try:
        # Use a thread-safe check for index availability
        with initialization_lock:
            if not initialization_complete or faiss_index is None:
                print("Error: FAISS index is not ready yet")
                return ["I apologize, but I'm still initializing my knowledge base. Please try again in a moment."]
            
        user_emb = get_embedding(user_input)
        D, I = faiss_index.search(np.array([user_emb]), k)
        return [docs[idx] for idx in I[0] if 0 <= idx < len(docs)]
    except Exception as e:
        print(f"Error in retrieve_relevant_info: {e}")
        return ["I apologize, but I'm having trouble accessing my knowledge base. Please try again later."]

INDEX_FILE_PATH = "medical_chatbot.index" # Define a constant for the index file
# You might also want to save/load rag_documents if they are large and slow to process
# For simplicity, we'll focus on the FAISS index here.

def load_data():
    """Load all the data and build the FAISS index, or load from disk if available."""
    global rag_documents, index, document_embeddings, embedding_dim, initialization_complete
    
    try:
        base_dir = os.path.dirname(os.path.abspath(__file__))
        data_dir = os.path.join(base_dir, 'data')
        index_file_full_path = os.path.join(base_dir, INDEX_FILE_PATH) # Full path to index file

        # --- Load RAG documents (this part still runs every time) ---
        # You could optimize this further by saving/loading rag_documents if needed
        # For now, we re-process them to ensure they match the loaded index's source.
        
        # Load CSV files
        rag_df = pd.read_csv(os.path.join(data_dir, 'disease_data_13_fuzzy_filled.csv'))  
        rag_df2 = pd.read_csv(os.path.join(data_dir, 'serious_diseases.csv'))  
        rag_df3 = pd.read_csv(os.path.join(data_dir, 'dis_descp.csv'))  
        
        # Load PDF files
        cure_text = extract_text_from_pdf(os.path.join(data_dir, 'TheCureForAllDiseases.pdf'))
        textbook_text = extract_text_from_pdf(os.path.join(data_dir, 'Harrison.pdf'))
        
        current_rag_documents = [] # Use a local variable first
        for _, row in rag_df.iterrows():
            doc_text = " | ".join(str(cell) for cell in row if pd.notna(cell))
            current_rag_documents.append(doc_text)
        for _, row in rag_df2.iterrows():
            doc_text = " | ".join(str(cell) for cell in row if pd.notna(cell))
            current_rag_documents.append(doc_text)
        for _, row in rag_df3.iterrows():
            doc_text = " | ".join(str(cell) for cell in row if pd.notna(cell))
            current_rag_documents.append(doc_text)
        current_rag_documents += [p.strip() for p in cure_text.split('\n\n') if p.strip()]
        current_rag_documents += [p.strip() for p in textbook_text.split('\n\n') if p.strip()]
        
        rag_documents = current_rag_documents # Assign to global
        print(f"Total documents for retrieval: {len(rag_documents)}")
        # --- End RAG documents loading ---

        if os.path.exists(index_file_full_path):
            print(f"Found existing FAISS index at {index_file_full_path}. Loading...")
            index = faiss.read_index(index_file_full_path)
            # We assume the rag_documents loaded above correspond to this index.
            # For a more robust system, you might save embeddings or a hash of rag_documents
            # alongside the index to ensure consistency.
            embedding_dim = index.d # Get dimension from loaded index
            print(f"FAISS index loaded with {index.ntotal} vectors and dimension {embedding_dim}.")
        else:
            print(f"No existing FAISS index found at {index_file_full_path}. Building new index...")
            # Generate embeddings
            print("Generating embeddings for documents...")
            document_embeddings = []
            batch_size = 8 
            total_docs = len(rag_documents)
            
            for i in range(0, total_docs, batch_size):
                batch_texts = rag_documents[i:i + batch_size]
                print(f"Processing embeddings for documents {i+1} to {min(i+batch_size, total_docs)} of {total_docs}...")
                for txt_idx, txt in enumerate(batch_texts):
                    try:
                        emb = get_embedding(txt)
                        document_embeddings.append(emb)
                    except Exception as e_emb:
                        print(f"Error embedding document {i + txt_idx + 1} ('{txt[:50]}...'): {e_emb}")
                
            if not document_embeddings:
                print("Critical Error: No documents were successfully embedded. Cannot build FAISS index.")
                with initialization_lock:
                    initialization_complete = True 
                return 

            document_embeddings = np.vstack(document_embeddings)
            
            embedding_dim = document_embeddings.shape[1]
            index = faiss.IndexFlatL2(embedding_dim)
            index.add(document_embeddings)
            print(f"FAISS index built with {index.ntotal} vectors.")
            
            try:
                print(f"Attempting to save FAISS index to: {index_file_full_path}")
                faiss.write_index(index, index_file_full_path) 
                print(f"FAISS index successfully saved to {index_file_full_path}")
                # Verify immediately after saving
                if os.path.exists(index_file_full_path):
                    print(f"Verification successful: File '{index_file_full_path}' exists after save.")
                else:
                    print(f"CRITICAL VERIFICATION FAILURE: File '{index_file_full_path}' does NOT exist immediately after save attempt.")
            except Exception as e_save:
                print(f"CRITICAL ERROR during faiss.write_index: Failed to save FAISS index to {index_file_full_path}. Error: {e_save}")

        with initialization_lock: # This should be outside the else, to run whether loaded or built
            initialization_complete = True
            print("Initialization complete. Ready to handle requests.")
    
    except FileNotFoundError as e_fnf:
        print(f"Critical Error during initialization: File not found - {e_fnf}. Please ensure all data files are present in the 'data' directory.")
        with initialization_lock:
            initialization_complete = True 
    except Exception as e:
        print(f"Critical Error during initialization: {e}")
        with initialization_lock:
            initialization_complete = True 

def generate_response(user_message):
    """Generate a response to the user's message using the RAG system"""
    relevant_info = retrieve_relevant_info(user_message, rag_documents, index)
    rag_context = "\n\n".join(relevant_info)

    full_prompt = f"""
Relevant medical document excerpts:
{rag_context}

User question:
{user_message}

Please provide a clear, concise description, dietary recommendations, symptoms, precautions, and measures for cure based only on the above medical document.
"""

    messages = [
        {"role": "system", "content": system_message},
        {"role": "user", "content": full_prompt}
    ]

    try:
        response = openai.chat.completions.create(
            model="llama3.2", 
            messages=messages
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"Error generating response: {e}")
        return "I'm sorry, I encountered an error while processing your question. Please try again."

# API endpoint to handle chat requests
@app.route('/api/medical-chat', methods=['POST'])
def medical_chat():
    # Thread-safe check if initialization is complete
    with initialization_lock:
        is_ready = initialization_complete and index is not None
    
    if not is_ready:
        return jsonify({
            'response': "I'm still loading my medical knowledge base. Please try again in a moment."
        }), 503  # 503 Service Unavailable
    
    data = request.get_json()
    
    if not data or 'message' not in data:
        return jsonify({'error': 'No message provided'}), 400
    
    user_message = data['message']
    
    try:
        response = generate_response(user_message)
        return jsonify({'response': response})
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Failed to generate response'}), 500

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    with initialization_lock:
        is_ready = initialization_complete and index is not None
    
    return jsonify({
        'status': 'ready' if is_ready else 'initializing',
        'documents_loaded': len(rag_documents) if rag_documents else 0,
        'index_built': index is not None
    })

# Load data on a separate thread to not block the server startup
def initialize_data():
    print("Initializing medical chatbot data...")
    load_data()
    print("Medical chatbot data initialized successfully!")

if __name__ == '__main__':
    # Start data loading in a separate thread
    init_thread = threading.Thread(target=initialize_data)
    init_thread.start()
    
    # Start the Flask server
    app.run(host='0.0.0.0', port=5050)