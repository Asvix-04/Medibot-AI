# MediBot – AI-Powered Health Management Platform

**Version: 1.0.0** (Assuming this is the current state after AI integration)

## Project Overview
Medibot is an AI-powered health management platform designed to make healthcare more accessible, personalized, and effective through artificial intelligence. The application combines medical expertise with cutting-edge AI technology to provide personalized healthcare guidance, symptom analysis, and health metrics tracking.

## Problem Statement
In today's healthcare landscape, individuals face several challenges:
• Fragmented health information spread across multiple platforms and providers.
• Difficulty tracking medications consistently and managing complex medical regimens.
• Limited access to reliable health information and preliminary symptom analysis outside of scheduled doctor visits.
• Challenges in monitoring and understanding personal health metrics.
• Inability to easily share comprehensive health data with healthcare providers.
Medibot addresses these issues by creating an integrated platform that empowers users to take control of their health journey.

## Key Features

1.  **AI-Powered Medical Chatbot (New & Enhanced)**
    *   24/7 access to an AI assistant for preliminary health-related queries.
    *   Utilizes a Retrieval Augmented Generation (RAG) model with a local LLM (Llama 3.2 via Ollama) and a custom knowledge base.
    *   Provides information on diseases, symptoms, precautions, treatments, and dietary recommendations based on its knowledge base.
    *   Natural language conversation interface for intuitive interactions.
    *   **Disclaimer:** The AI chatbot provides information for educational purposes and is not a substitute for professional medical advice.

2.  **Comprehensive Health Metrics Tracking**
    *   Monitor vital metrics including blood pressure, heart rate, blood glucose, weight, and sleep.
    *   Visualization of trends over time with intuitive charts.

3.  **Medication Management**
    *   Smart reminders and comprehensive medication tracking.

4.  **Appointment Scheduling**
    *   Find and book appointments, with reminders and map integration.

5.  **Medical Records Management**
    *   Access personal health history and securely share it with providers.

6.  **Personalized Health Insights**
    *   AI-powered recommendations based on personal data.

7.  **Robust Security and Privacy**
    *   Designed with data protection in mind (striving for HIPAA compliance).
    *   End-to-end encryption for personal information.

## Uniqueness & Value Proposition
What makes Medibot stand out:

1.  **Integrated AI Chatbot:** Unlike basic health trackers, Medibot offers an AI-powered chatbot for preliminary medical information retrieval, leveraging a custom knowledge base.
2.  **Holistic Approach:** Addresses multiple aspects of healthcare management in a single application.
3.  **Data-Driven Insights:** Analyzes health metrics to provide meaningful insights.
4.  **Accessibility:** 24/7 access to health information and tools.
5.  **User-Centric Design:** Intuitive interface with dark/light mode support.
6.  **Privacy-Focused:** Prioritizes user data protection.

## Technology Stack

**Frontend**
*   Framework: React.js
*   Routing: React Router DOM
*   Styling: TailwindCSS
*   State Management: React Context API
*   Authentication: Firebase Authentication
*   HTTP Client: Axios
*   Data Visualization: Chart.js
*   Document Generation: jsPDF, html-to-image, file-saver
*   Maps: Google Maps API

**Backend (Node.js)**
*   Runtime: Node.js
*   Framework: Express.js
*   Database: MongoDB with Mongoose
*   Authentication: Firebase Admin SDK
*   API Security: CORS

**ML Service (Python)**
*   Framework: Flask
*   LLM Serving: Ollama (running Llama 3.2 and Nomic Embed Text)
*   Vector Database: FAISS (Facebook AI Similarity Search)
*   Data Handling: Pandas, NumPy
*   PDF Extraction: PyMuPDF (fitz)

## Project Structure

The project is organized into three main parts: `frontend`, `backend`, and `ml-service`.

```
Medibot-AI/
├── User-Interface/
│   ├── frontend/
│   │   ├── public/                   # Static assets for React app
│   │   ├── src/
│   │   │   ├── assets/               # Images, logos
│   │   │   ├── components/           # Reusable React components
│   │   │   │   ├── analytics/        # Charts and data visualization
│   │   │   │   ├── auth/             # Authentication components
│   │   │   │   ├── chat/             # Chat interface components
│   │   │   │   ├── dashboard/        # Dashboard widgets
│   │   │   │   ├── health/           # Health metrics components
│   │   │   │   ├── landing/          # Landing page components
│   │   │   │   ├── layout/           # Layout containers
│   │   │   │   ├── medications/      # Medication tracking components
│   │   │   │   ├── settings/         # User settings components
│   │   │   │   └── ui/               # Shared UI elements
│   │   │   ├── context/              # React Context providers
│   │   │   │   ├── AuthContext.js    # Authentication state
│   │   │   │   ├── ChatContext.js    # Chat conversation state
│   │   │   │   ├── SettingsContext.js # User preferences
│   │   │   │   └── ToastContext.js   # Notification system
│   │   │   ├── pages/                # Top-level page components
│   │   │   │   ├── AppointmentPage.jsx
│   │   │   │   ├── ChatPage.jsx
│   │   │   │   ├── DashboardPage.jsx
│   │   │   │   ├── LandingPage.jsx
│   │   │   │   ├── MedicationPage.jsx
│   │   │   │   ├── ReportsPage.jsx
│   │   │   │   └── SettingsPage.jsx
│   │   │   ├── App.js                # Main React application component
│   │   │   ├── firebase.js           # Firebase client configuration
│   │   │   ├── index.js              # React app entry point
│   │   │   └── index.css             # Global styles
│   │   ├── package.json
│   │   └── tailwind.config.js
│   │
│   ├── backend/
│   │   ├── controllers/              # Request handling logic
│   │   │   ├── authController.js
│   │   │   ├── conversationController.js
│   │   │   ├── healthDataController.js
│   │   │   └── userController.js
│   │   ├── middleware/               # Express middleware
│   │   │   ├── auth.js               # Token verification
│   │   │   └── errorHandler.js       # Error handling
│   │   ├── models/                   # MongoDB Mongoose schemas
│   │   │   ├── Appointment.js
│   │   │   ├── Conversation.js
│   │   │   ├── HealthData.js
│   │   │   ├── Medication.js
│   │   │   └── User.js
│   │   ├── routes/                   # API route definitions
│   │   │   ├── authRoutes.js
│   │   │   ├── chatRoutes.js         # Routes for AI chatbot
│   │   │   ├── conversationRoutes.js
│   │   │   ├── healthDataRoutes.js
│   │   │   └── userRoutes.js
│   │   ├── templates/                # Email templates
│   │   │   └── welcomeEmail.html
│   │   ├── .env.example              # Environment variable template
│   │   ├── index.js                  # Express server entry point
│   │   └── package.json
│   │
│   └── ml-service/
│       ├── data/                     # Directory for knowledge base files
│       │   ├── disease_data_13_fuzzy_filled.csv  # Disease data
│       │   ├── serious_diseases.csv              # Severity information
│       │   ├── dis_descp.csv                     # Disease descriptions
│       │   ├── TheCureForAllDiseases.pdf         # Medical reference
│       │   └── Harrison.pdf                      # Medical textbook
│       ├── medical_chatbot.index     # Saved FAISS index (auto-generated)
│       ├── medical_chatbot_service.py # Python Flask service for the AI chatbot
│       └── requirements.txt          # Python dependencies
│
├── .gitignore
├── CONTRIBUTING.md                   # Contribution guidelines
└── README.md                         # Project documentation
```

## Setup and Installation

To set up and run Medibot locally, you'll need to configure and start three services: the Ollama LLM service, the Python ML service, the Node.js backend, and the React frontend.

### Prerequisites
Node.js (v16 or higher)
npm (v7 or higher)
Python 3.8 or later
pip (Python package installer)
MongoDB (local or Atlas cloud instance)
Ollama installed (for local LLM serving)
Git

### Step 1: Clone the Repository

```
git clone https://github.com/Asvix-04/Medibot-AI.git
cd Medibot-AI
```

### Step 2: Set up Ollama and Pull Models

1. Install Ollama from ollama.ai
2. Start the Ollama service
3. Pull the required models:

```
ollama pull llama3.2
ollama pull nomic-embed-text
```

### Step 3: Set Up ML Service

```
cd User-Interface/ml-service

# Create a Python virtual environment (recommended)
python -m venv venv
# Activate the virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install flask flask-cors openai faiss-cpu pandas numpy PyMuPDF

# Create data directory if it doesn't exist
mkdir -p data

# Start the ML service
python medical_chatbot_service.py
```

Note: The first run will build embeddings and may take several minutes. Subsequent runs will be faster as they use the saved index.

### Step 4: Set Up Backend

```
cd ../backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env file with your MongoDB URI, Firebase credentials, etc.

# Start backend server
npm run dev
```

### Step 5: Set Up Frontend

```

cd ../frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Add your Firebase config and other API keys

# Start development server
npm start
```
The application should now be running at http://localhost:3000.

### Step 6: Firebase Configuration

1. Create a Firebase project at https://firebase.google.com
2. Enable Authentication (Email/Password and Google Sign-in)
3. Create a Firestore database
4. Get your Firebase config and add it to your .env file
5. For backend, generate a Firebase Service Account key and save its path in your backend .env file

## Using the Application

After setting up, you can access the following features:

> Authentication: Start at the Sign In/Sign Up pages
> Chat: Access the AI chatbot through the main chat interface
> Health Dashboard: View and track health metrics
> Medication Manager: Manage current and past medications
> Appointments: Schedule and manage medical appointments
> Reports: Generate health reports from collected data
> Settings: Customize application preferences and manage data