Medibot-AI/
├── User-Interface/
│   ├── backend/            # Backend server and API
│   ├── frontend/           # React frontend application
│   └── Readme.md           # Project documentation


## Backend Structure

backend/
├── controllers/
│   ├── authController.js          # Handles authentication operations
│   ├── conversationController.js   # Manages AI conversations
│   ├── healthController.js         # Processes health data operations
│   └── userController.js           # Handles user profile operations
│
├── middleware/
│   └── auth.js                     # Authentication middleware (token verification)
│
├── models/
│   ├── conversationModel.js        # Schema for AI conversations
│   ├── healthProfileModel.js       # Schema for health profiles
│   └── userModel.js                # Schema for user accounts
│
├── routes/
│   ├── authRoutes.js               # Authentication endpoints
│   ├── conversationRoutes.js       # AI conversation endpoints
│   ├── healthDataRoutes.js         # Health data endpoints
│   └── userRoutes.js               # User profile endpoints
│
├── .env                            # Environment variables (not in git)
├── .gitignore                      # Specifies files ignored by git
├── index.js                        # Main server entry point
├── firebaseServiceAccount.json     # Firebase credentials (not in git)
└── package.json                    # Node dependencies and scripts

## Frontend Structure

frontend/
├── public/
│   ├── favicon.ico                 # Site favicon
│   ├── index.html                  # HTML entry point
│   ├── logo192.png                 # React logo (small)
│   ├── logo512.png                 # React logo (large)
│   ├── manifest.json               # PWA configuration
│   └── robots.txt                  # Search engine crawl rules
│
├── src/
│   ├── assets/
│   │   └── medibot_logo.jpg        # Application logo
│   │
│   ├── components/
│   │   ├── appointments/           # Appointment scheduling components
│   │   │   ├── AppointmentList.jsx        # List of user's appointments
│   │   │   ├── AppointmentScheduler.jsx   # Appointment creation interface
│   │   │   ├── LocationPermissionModal.jsx # Location permission request
│   │   │   └── NearbyFacilitiesMap.jsx    # Map showing medical facilities
│   │   │
│   │   ├── common/
│   │   │   └── ErrorBoundary.jsx          # Error catching component
│   │   │
│   │   ├── dashboard/
│   │   │   ├── HealthDashboard.jsx        # Main health metrics dashboard
│   │   │   ├── MedicationManager.jsx      # Medication management interface
│   │   │   └── medication/
│   │   │       ├── MedicationForm.jsx     # Add/edit medication form
│   │   │       └── MedicationList.jsx     # List of medications
│   │   │
│   │   ├── layout/
│   │   │   └── ChatLayout.jsx            # Chat interface layout wrapper
│   │   │
│   │   ├── reports/
│   │   │   ├── HealthReports.jsx         # Health report generation
│   │   │   └── ReportTemplate.jsx        # Report layout templates
│   │   │
│   │   ├── settings/
│   │   │   ├── CustomizationSettings.jsx  # UI customization options
│   │   │   ├── DataSettings.jsx          # Data management settings
│   │   │   ├── GeneralSettings.jsx       # General application settings
│   │   │   ├── PersonalizationSettings.jsx # Personal preferences
│   │   │   ├── SecuritySettings.jsx      # Security and privacy settings
│   │   │   ├── SettingsLayout.jsx        # Settings page layout
│   │   │   ├── SettingsSidebar.jsx       # Settings navigation sidebar
│   │   │   └── index.js                  # Settings components export
│   │   │
│   │   ├── sidebar/
│   │   │   ├── ChatHistory.jsx           # List of past conversations
│   │   │   ├── ChatItem.jsx              # Individual chat in history
│   │   │   ├── Sidebar.jsx               # Main chat sidebar
│   │   │   ├── SidebarFooter.jsx         # Footer links in sidebar
│   │   │   ├── SidebarHeader.jsx         # Header content in sidebar
│   │   │   └── index.js                  # Sidebar components export
│   │   │
│   │   ├── ui/
│   │   │   └── ToastContainer.jsx        # Notification component
│   │   │
│   │   ├── EmailVerification.jsx         # Email verification handling
│   │   ├── ForgotPassword.jsx            # Password reset request
│   │   ├── Modal.jsx                     # Reusable modal component
│   │   ├── Navigation.jsx                # Main navigation bar
│   │   ├── ProfileDropdown.jsx           # User menu dropdown
│   │   ├── ProfileSummary.jsx            # User profile editor
│   │   ├── ProtectedRoute.jsx            # Auth-required route wrapper
│   │   ├── ResetPassword.jsx             # Password reset form
│   │   ├── Signin.jsx                    # Login page
│   │   ├── Signup.jsx                    # Registration page
│   │   ├── UserProfile.jsx               # User profile display
│   │   └── VerificationRequiredPage.jsx  # Email verification prompt
│   │
│   ├── context/
│   │   └── ToastContext.jsx              # Notification state management
│   │
│   ├── pages/
│   │   └── ChatPage.jsx                  # Main chat interface page
│   │
│   ├── App.css                           # Global styles
│   ├── App.js                            # Main application component
│   ├── firebase.js                       # Firebase configuration
│   ├── index.css                         # CSS entry point
│   └── index.js                          # JavaScript entry point
│
├── .env                                  # Environment variables
├── .gitignore                            # Git ignore configuration
├── package.json                          # NPM dependencies and scripts
├── README.md                             # Frontend documentation
└── tailwind.config.js                    # Tailwind CSS configuration


## Key Components and Their Purposes

### Authentication System

> Complete authentication flow with signup, signin, email verification

> Password recovery and reset capabilities

> Firebase integration for secure authentication

### User Profile System

Comprehensive health profile management

Personal information and medical history tracking

Profile photo upload and management

### Chat Interface

AI-powered chat assistant for health inquiries

Conversation history management

Responsive design with dark/light mode support

### Health Dashboard

Visualization of key health metrics

Medication tracking and reminders

Appointment scheduling and management

### Settings and Customization

Application preferences and personalization

Security and privacy controls

Data management (export, backup, deletion)

### Appointment System

Schedule medical appointments

Google Maps integration for finding nearby facilities

Appointment management (view, cancel, reschedule)

### Medication Management

Track current and past medications

Set reminders for medication doses

Generate printable medication lists

### Health Reports

Generate comprehensive health reports

Multiple report templates

Export capabilities in various formats

This structure provides a complete overview of the Medibot application, showing how the various components interconnect to create a comprehensive medical AI assistant platform.