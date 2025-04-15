# Medibot User Interface

The Medibot User Interface is a comprehensive medical AI assistant platform with both frontend and backend components. It provides users with a secure way to interact with the Medibot AI, manage their health profiles, and receive personalized health insights.

---

## Project Structure

The project is divided into two main components:  


---

## Frontend Components

### Authentication Pages

#### Sign Up (`Signup.jsx`)
- Allows new users to create an account  
- Collects essential user information (name, email, mobile number and password)  
- Includes terms of service and privacy policy consent  
- Sends verification email to confirm user identity  

#### Sign In (`Signin.jsx`)
- Handles user authentication  
- Validates email verification status  
- Redirects to appropriate pages based on auth status  

#### Email Verification (`EmailVerification.jsx`, `VerificationCheck.jsx`)
- Processes verification links sent to user email  
- Provides interface for resending verification emails  
- Shows verification status  

#### Password Recovery (`ForgotPassword.jsx`, `ResetPassword.jsx`)
- Allows users to request password reset links  
- Handles password reset process securely  

---

## User Profile Management

### Profile Summary (`ProfileSummary.jsx`)
- Complete health profile creation/editing interface  
- Collects personal information (name, age)  
- Records medical data (blood group, past conditions, family history)  
- Manages current medications and allergies  
- Supports profile photo upload  

### User Profile (`UserProfile.jsx`)
- Displays user's complete health profile  
- Shows medical history and current health informations  
- Provides access to edit profile details  
- Links to AI chat functionality  

---

## Chat Interface

### Chat Layout (`ChatLayout.jsx`)
- Main chat interface container  
- Manages conversation state and history  
- Handles dark/light mode preferences  

### Chat Components
- **Chat Area (`ChatArea.jsx`)**: Displays message history  
- **Chat Input (`ChatInput.jsx`)**: Handles message composition and sending  
- **Chat Message (`ChatMessage.jsx`)**: Renders individual messages  

### Sidebar (`Sidebar.jsx`)
- Shows conversation history  
- Provides new chat creation  
- Contains chat management controls  

---

## Navigation & UI Components

### Navigation (`Navigation.jsx`)
- Main navigation bar for the application  
- Provides links to key sections  
- Handles sign-out functionality  

### Profile Dropdown (`ProfileDropdown.jsx`)
- User account menu  
- Quick access to profile pages  
- Theme toggle control  
- Sign-out option  

### Protected Routes (`ProtectedRoute.jsx`)
- Secures routes requiring authentication  
- Redirects unauthenticated or unverified users  
- Ensures proper access control  

---

## Backend Components

### Controllers

#### User Controller (`userController.js`)
- Manages user profile data  
- Handles creating and updating user information  
- Retrieves user details  

#### Health Controller (`healthController.js`)
- Manages health profile data  
- Stores medical history, conditions, and medications  
- Processes health data updates  

---

### Models

#### User Model (`userModel.js`)
- Defines user data structure  
- Stores authentication and personal information  
- Tracks account status  

#### Health Profile Model (`healthProfileModel.js`)
- Defines health data structure  
- Stores medical history and current health information  
- Links health data to user accounts  

---

### Routes & Middleware

#### API Routes
- **User Routes (`userRoutes.js`)**: Endpoints for user profile management  
- **Health Data Routes (`healthDataRoutes.js`)**: Endpoints for health data management  

#### Authentication Middleware (`auth.js`)
- Verifies Firebase tokens  
- Secures API endpoints  
- Establishes user context for requests  

---

## Setup Instructions

### Prerequisites
- Node.js (v14+)  
- MongoDB (local or Atlas)  
- Firebase project (for authentication)  

---

### Backend Setup

1. Navigate to the backend directory:  
   ```sh
   cd Medibot-AI/User-Interface/backend

2. Install dependencies:  
   ```sh
   npm install

3. Start Server
   npm run dev
## Frontend Setup

1. Navigate to the frontend directory:  
   ```sh
   cd Medibot-AI/User-Interface/frontend
## Install Dependencies

2. Install project dependencies:  
   ```sh
   npm install

3. npm start

4. pip install -r requirements.txt



