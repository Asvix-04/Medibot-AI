
MediBot – AI Documentation

Project Overview:
Medibot is an AI-powered health management platform designed to make healthcare more accessible, personalized, and effective through artificial intelligence. The application combines medical expertise with cutting-edge AI technology to provide personalized healthcare guidance whenever needed.

Problem Statement:
In today's healthcare landscape, individuals face several challenges:
• Fragmented health information spread across multiple platforms and providers
• Difficulty tracking medications consistently and managing complex medical regimens
• Limited access to reliable health information outside of scheduled doctor visits
• Challenges in monitoring and understanding personal health metrics
• Inability to easily share comprehensive health data with healthcare providers
Medibot addresses these issues by creating an integrated platform that empowers users to take control of their health journey.

Key Features:

1. AI-Powered Health Assistant
   • 24/7 access to evidence-based health information
   • Ability to ask questions about symptoms, conditions, and general health concerns
   • Natural language conversation interface for intuitive interactions
2. Comprehensive Health Metrics Tracking
   • Monitor vital metrics including:
   o Blood pressure (systolic/diastolic)
   o Heart rate
   o Blood glucose levels
   o Weight
   o Sleep duration
   • Visualization of trends over time with intuitive charts
   • Data validation to ensure accuracy of health information
3. Medication Management
   • Smart reminders to prevent missed doses
   • Comprehensive medication tracking
   • Schedule management for complex medication regimens
   • Adherence tracking and reporting
4. Appointment Scheduling
   • Find and book appointments with healthcare providers
   • Timely reminders for upcoming appointments
   • Integration with maps to locate nearby medical facilities
   • View, cancel, and reschedule functionality
   •
5. Medical Records Management
   • Access to personal health history
   • Secure sharing capabilities with healthcare providers
   • Generated health reports from collected data
   • Multiple export formats for different use cases
6. Personalized Health Insights
   • AI-powered recommendations based on personal data
   • Correlation analysis between different health metrics
   • Intelligent alerts for concerning trends
   • Evidence-based guidance for health improvements
7. Robust Security and Privacy
   • HIPAA-compliant data protection
   • End-to-end encryption for personal information
   • Granular control over data sharing preferences
   • Options to export, backup, or delete personal data

Uniqueness & Value Proposition:
What makes Medibot stand out from other health applications:

1. AI Integration: Unlike basic health trackers, Medibot combines symptom analysis, health monitoring, and personalized guidance through advanced AI.
2. Holistic Approach: The platform addresses multiple aspects of healthcare management in a single application, eliminating the need for numerous disconnected health apps.
3. Data-Driven Insights: Medibot doesn't just collect data; it analyzes relationships between different health metrics to provide meaningful insights about how lifestyle and medication choices affect overall health.
4. Accessibility: The platform is designed to be accessible 24/7, providing reliable health information whenever needed, particularly valuable for those with chronic conditions or complex health needs.
5. User-Centric Design: With both dark and light mode support, customizable dashboards, and intuitive interfaces, the application prioritizes user experience while handling sensitive health information.
6. Privacy-First Philosophy: Built with HIPAA compliance at its core, Medibot prioritizes user data protection while still enabling valuable health insights.
   Unique Selling Points (USP):
   • "Healthcare in Your Pocket" - Access to AI-powered medical guidance anytime, anywhere
   • "Complete Health Management" - One platform for all healthcare tracking and management needs
   • "Data That Works For You" - Turn health metrics into actionable insights for better outcomes
   • "Bridge the Gap" - Connect personal health monitoring with professional healthcare services
   • "Privacy Without Compromise" - Industry-leading security while maintaining full functionality

Medibot AI Project Structure & Tech Stack
Technology Stack
Frontend
• Framework: React.js (v19.1.0)
• Routing: React Router DOM (v7.5.0)
• Styling: TailwindCSS (v3.4.17) with dark mode support
• Authentication: Firebase Authentication
• Database: Firebase Firestore
• HTTP Client: Axios
• Data Visualization: Chart.js and react-chartjs-2
• Document Generation: jsPDF, html-to-image, file-saver
• Maps: Google Maps API with @googlemaps/js-api-loader
• Testing: Jest, React Testing Library
Backend
• Runtime: Node.js
• Framework: Express.js (v5.1.0)
• Database: MongoDB with Mongoose (v8.13.2)
• Authentication: Firebase Admin SDK
• Environment Variables: dotenv
• API Security: CORS middleware
• Development: nodemon for hot reloading

Project Structure
Frontend Structure

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

