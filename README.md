![Built with Love](https://img.shields.io/badge/Built%20with-%E2%9D%A4-red?style=for-the-badge)
![Made with React](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react)
![Brain Powered](https://img.shields.io/badge/AI%20Model-Ollama%20+%20RAG-ff69b4?style=for-the-badge&logo=openai)
![Voice Enabled](https://img.shields.io/badge/Speech%20to%20Text-Whisper-8A2BE2?style=for-the-badge&logo=OpenAI)
![Database](https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb)
![Appointments Ready](https://img.shields.io/badge/Appointments-Enabled-blue?style=for-the-badge&logo=googlecalendar)
![Dynamic Bot](https://img.shields.io/badge/Chatbot-Interactive-orange?style=for-the-badge&logo=chatbot)
![Code Style](https://img.shields.io/badge/Code-Clean%20AF-00bfff?style=for-the-badge)
![Deployment Level](https://img.shields.io/badge/Status-Beta-yellow?style=for-the-badge)

## Introducing Medibot a product of ASVIX.

## 🎥 Watch MediBot in Action

[![Watch the demo](https://img.shields.io/badge/Demo-Click%20to%20Watch-red?style=for-the-badge&logo=youtube)](https://youtu.be/XQC5HuJTyVY?feature=shared)

---


# MediBot AI

Is an advanced AI-powered medical chatbot designed to assist users in validating their medical queries, tracking health metrics, and connecting with nearby healthcare services. With an interactive conversational interface, MediBot provides a holistic digital healthcare experience through a combination of AI models and real-time integrations. 

## Features

- AI Medical Chatbot: Built using a combination of the Ollama and RAG models to provide real-time, accurate responses to medical queries.
- Voice Interaction: Integrated OpenAI Whisper for speech-to-text functionality.
- React-Based Frontend: Built with modern React for a responsive user interface.
- Geo Integration: Uses Google Maps API to help users locate nearby hospitals, clinics, and pharmacies.
- Appointment Scheduling: Schedule and manage appointments directly through the platform.
- Health Dashboard: Monitor critical health metrics such as:
  * Blood Pressure (BP)
  * Heart Rate
  * Pulse Rate
  * Cholesterol levels
- Health Report Generator: Automatically generate personalized health reports for the users.

## Upcoming Features

- Prescription analysis and OCR from scanned documents
- Speech-to-speech chatbot interaction
- Real-time consultation with certified doctors
- Medicine lookup and information retrieval

---

## How to Set Up and Run MediBot

Follow these instructions to set up and run the MediBot AI locally on your machine.

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- Git
- MongoDB
- Firebase Project

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Asvix-04/Medibot-AI.git
cd Medibot-AI
````

---

### 2️⃣ Backend Setup

```bash
cd User-Interface/backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env to include:
# - MONGO_URI
# - FIREBASE_CREDENTIALS (path to firebaseServiceAccount.json)

# Start backend
npm run dev
```

---

### 3️⃣ Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Add your:
# - Firebase config
# - Google Maps API key

# Start frontend
npm start
```

The application will now be available at [http://localhost:3000](http://localhost:3000).

---

## Firebase Configuration

1. Go to [Firebase Console](https://firebase.google.com)
2. Create a new project.
3. Enable:
   * Authentication (Email/Password, Google)
   * Firestore database
4. Add Firebase config to `frontend/firebase.js`
5. Generate a Firebase **Service Account** key and save it as `firebaseServiceAccount.json` in the backend.

---

## Application Structure

```
Medibot-AI/
│
├── User-Interface/
│   ├── frontend/       # React frontend with health UI
│   └── backend/        # Node.js + Express backend with chatbot integration
│
├── models/             # AI model integrations
└── README.md
```

---

## Features Overview

| Feature          | Access Point              |
| ---------------- | ------------------------- |
| Chatbot          | Main chat interface       |
| Health Dashboard | User dashboard            |
| Voice Input      | Chat interface (mic icon) |
| Appointments     | Schedule section          |
| Reports          | Reports tab               |
| Authentication   | Sign Up / Sign In         |
| Nearby Hospitals | Map integration           |

---

## Contributing

We welcome contributions! Please fork the repo, create a new branch for your feature or bug fix, and submit a pull request.

---

## Contact

For suggestions, issues, or business inquiries, feel free to open an issue or contact us at **(asvix2025@gmail.com)**.
