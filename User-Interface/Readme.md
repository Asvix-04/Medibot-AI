<<<<<<< HEAD
# MediBot – AI-Powered Health Management Platform
=======

MediBot – AI Documentation
>>>>>>> 3e81d70e48c4a1003ba6b80ea252925c8966f1cd

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

<<<<<<< HEAD
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
=======
frontend/
├── public/ # Static files
│ ├── index.html # HTML entry point
│ ├── favicon.ico # Site favicon
│ └── manifest.json # PWA configuration
=======
```
Medibot-AI/
├── User-Interface/
│   ├── backend/          # Backend server and API
│   ├── frontend/         # React frontend application
│   └── Readme.md         # Project documentation
```

## Backend Structure
```
backend/
├── controllers/
│   ├── authController.js          # Handles authentication operations
│   ├── conversationController.js   # Manages AI conversations
│   ├── healthController.js         # Processes health data operations
│   └── userController.js           # Handles user profile operations

│
├── src/
│ ├── assets/ # Static assets
│ │ └── medibot_logo.jpg # Application logo
│ │
│ ├── components/ # React components
│ │ ├── appointments/ # Appointment management
│ │ │ ├── AppointmentList.jsx
│ │ │ ├── AppointmentScheduler.jsx
│ │ │ ├── LocationPermissionModal.jsx
│ │ │ └── NearbyFacilitiesMap.jsx
│ │ │
│ │ ├── chat/ # Chat functionality
│ │ │ ├── ChatArea.jsx # Main chat display area
│ │ │ ├── ChatInput.jsx # Message input component
│ │ │ ├── ChatMessage.jsx # Individual message display
│ │ │ └── index.js # Component exports
│ │ │
│ │ ├── common/ # Common utilities
│ │ │ └── ErrorBoundary.jsx # Error handling wrapper
│ │ │
│ │ ├── dashboard/ # Health dashboard components
│ │ │ ├── HealthDashboard.jsx # Main dashboard view
│ │ │ ├── HealthMetricsForm.jsx # Health metrics input form
│ │ │ ├── MedicationManager.jsx # Medication management
│ │ │ └── medication/ # Medication subcomponents
│ │ │
│ │ ├── feedback/ # User feedback components
│ │ │ └── FeedbackForm.jsx
│ │ │
│ │ ├── landing/ # Landing page components
│ │ │ ├── Header.jsx # Navigation header
│ │ │ ├── Hero.jsx # Hero section
│ │ │ ├── Features.jsx # Features section
│ │ │ ├── About.jsx # About section
│ │ │ ├── HowItWorks.jsx # Process explanation
│ │ │ ├── Benefits.jsx # Benefits section
│ │ │ ├── Testimonials.jsx # User testimonials
│ │ │ ├── Integration.jsx # Integration section
│ │ │ ├── FAQ.jsx # FAQ section
│ │ │ ├── CallToAction.jsx # CTA section
│ │ │ ├── Footer.jsx # Page footer
│ │ │ └── index.js # Landing page export
│ │ │
│ │ ├── layout/ # Layout components
│ │ │ └── ChatLayout.jsx # Chat interface layout
│ │ │
│ │ ├── onboarding/ # User onboarding flow
│ │ │ ├── OnboardingFlow.jsx # Main onboarding controller
│ │ │ ├── WelcomeScreen.jsx # Initial welcome screen
│ │ │ └── NameCollectionScreen.jsx # User name collection
│ │ │
│ │ ├── reports/ # Health reports generation
│ │ │ ├── HealthReports.jsx
│ │ │ └── ReportTemplate.jsx
│ │ │
│ │ ├── settings/ # Application settings
│ │ │ ├── GeneralSettings.jsx
│ │ │ ├── PersonalizationSettings.jsx
│ │ │ ├── SecuritySettings.jsx
│ │ │ ├── CustomizationSettings.jsx
│ │ │ ├── DataSettings.jsx
│ │ │ ├── SettingsLayout.jsx
│ │ │ └── index.js
│ │ │
│ │ ├── sidebar/ # Chat sidebar components
│ │ │ ├── Sidebar.jsx # Main sidebar component
│ │ │ ├── SidebarHeader.jsx # Sidebar header
│ │ │ ├── ChatHistory.jsx # Past conversation list
│ │ │ ├── ChatItem.jsx # Individual conversation item
│ │ │ └── index.js # Exports
│ │ │
│ │ ├── ui/ # UI components
│ │ │ ├── Logo.jsx # App logo component
│ │ │ ├── ProfileDropdown.jsx # User menu dropdown
│ │ │ └── ToastContainer.jsx # Notification display
│ │ │
│ │ ├── EmailVerification.jsx # Email verification handling
│ │ ├── ForgotPassword.jsx # Password recovery
│ │ ├── Modal.jsx # Reusable modal
│ │ ├── Navigation.jsx # Main navigation bar
│ │ ├── OnboardingCheck.jsx # Onboarding verification
│ │ ├── ProtectedRoute.jsx # Authentication wrapper
│ │ ├── ResetPassword.jsx # Password reset form
│ │ ├── Signin.jsx # Login page
│ │ ├── Signup.jsx # Registration page
│ │ └── UserProfile.jsx # User profile component
│ │
│ ├── context/ # React context providers
│ │ └── ToastContext.jsx # Toast notification context
│ │
│ ├── pages/ # Page components
│ │ └── ChatPage.jsx # Chat page container
│ │
│ ├── App.js # Main application component
│ ├── firebase.js # Firebase configuration
│ ├── index.js # Application entry point
│ └── index.css # Global styles with Tailwind
│
├── tailwind.config.js # Tailwind CSS configuration
├── postcss.config.js # PostCSS configuration
└── package.json # Dependencies and scripts
Backend Structure
backend/
├── controllers/ # API controllers
│ ├── authController.js # Authentication logic
│ ├── conversationController.js # Chat conversation management
│ ├── healthController.js # Health data operations
│ └── userController.js # User profile operations
│
├── middleware/ # Express middleware
│ └── auth.js # Token verification middleware
│

├── models/ # MongoDB schemas
│ ├── conversationModel.js # Chat conversation schema
│ ├── healthProfileModel.js # Health data schema
│ └── userModel.js # User account schema
=======
├── .env                            # Environment variables (not in git)
├── .gitignore                      # Specifies files ignored by git
├── index.js                        # Main server entry point
├── firebaseServiceAccount.json     # Firebase credentials (not in git)
└── package.json                    # Node dependencies and scripts
```
## Frontend Structure
```
frontend/
├── public/
│   ├── favicon.ico                 # Site favicon
│   ├── index.html                  # HTML entry point
│   ├── logo192.png                 # React logo (small)
│   ├── logo512.png                 # React logo (large)
│   ├── manifest.json               # PWA configuration
│   └── robots.txt                  # Search engine crawl rules

│
├── routes/ # API routes
│ ├── authRoutes.js # Authentication endpoints
│ ├── conversationRoutes.js # Chat conversation endpoints
│ ├── healthDataRoutes.js # Health data endpoints
│ └── userRoutes.js # User profile endpoints
│

├── index.js # Server entry point
├── package.json # Dependencies and scripts
└── firebaseServiceAccount.json # Firebase credentials (not in git)
=======
├── .env                                  # Environment variables
├── .gitignore                            # Git ignore configuration
├── package.json                          # NPM dependencies and scripts
├── README.md                             # Frontend documentation
└── tailwind.config.js                    # Tailwind CSS configuration
```

## Key Components and Their Purposes

### Authentication System

> Complete authentication flow with signup, signin, email verification

> Password recovery and reset capabilities

> Firebase integration for secure authentication

### User Profile System

> Comprehensive health profile management

> Personal information and medical history tracking

> Profile photo upload and management

### Chat Interface

> AI-powered chat assistant for health inquiries

> Conversation history management

> Responsive design with dark/light mode support

### Health Dashboard

> Visualization of key health metrics

> Medication tracking and reminders

> Appointment scheduling and management

### Settings and Customization

> Application preferences and personalization

> Security and privacy controls

> Data management (export, backup, deletion)


#### Sign Up (`Signup.jsx`)
- Allows new users to create an account  
- Collects essential user information (name, email, mobile number and password)  
- Includes terms of service and privacy policy consent  
- Sends verification email to confirm user identity  

#### Sign In (`Signin.jsx`)
- Handles user authentication  
- Validates email verification status  
- Redirects to appropriate pages based on auth status  


Google Maps integration for finding nearby facilities

Appointment management (view, cancel, reschedule)

### Medication Management

Track current and past medications

Set reminders for medication doses


Generate printable medication lists

### User Profile (`UserProfile.jsx`)
- Displays user's complete health profile  
- Shows medical history and current health informations  
- Provides access to edit profile details  
- Links to AI chat functionality  


### Health Reports

Generate comprehensive health reports

Multiple report templates

Export capabilities in various formats

This structure provides a complete overview of the Medibot application, showing how the various components interconnect to create a comprehensive medical AI assistant platform.

>>>>>>> 3e81d70e48c4a1003ba6b80ea252925c8966f1cd
