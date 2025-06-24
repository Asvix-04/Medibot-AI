import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Signup from './components/Signup';
import Signin from './components/Signin';
import ProfileSummary from './components/ProfileSummary';
import EmailVerification from './components/EmailVerification';
import VerificationRequiredPage from './components/VerificationRequiredPage';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import ProtectedRoute from './components/ProtectedRoute';
import UserProfile from './components/UserProfile';
import ChatPage from './pages/ChatPage';
import Navigation from './components/Navigation';
import HealthDashboard from './components/dashboard/HealthDashboard';
import { SettingsLayout } from './components/settings';
import MedicationManager from './components/dashboard/MedicationManager';
import './App.css';
import { ToastProvider } from './context/ToastContext';
import ToastContainer from './components/ui/ToastContainer';
import ErrorBoundary from './components/common/ErrorBoundary';
import AppointmentScheduler from './components/appointments/AppointmentScheduler';
import OnboardingFlow from './components/onboarding/OnboardingFlow';
import OnboardingCheck from './components/OnboardingCheck';
import FAQPage from './components/faq/FAQPage';
import LandingPage from './components/landing';
import { SettingsProvider } from './context/SettingsContext';
import HospitalsList from './components/hospital/HospitalsList';
import HospitalDetails from './components/hospital/HospitalDetails';

const AppContent = () => {
  const location = useLocation();
  const isChatPage = location.pathname === '/chat';
  const [darkMode] = useState(false);

  return (
    <>
      {!isChatPage && location.pathname !== '/landing' && location.pathname !== '/' && <Navigation />}
      <div className={!isChatPage && location.pathname !== '/signin' && location.pathname !== '/signup' && location.pathname !== '/forgot-password' && !location.pathname.startsWith('/reset-password') ? 'pt-14' : ''}>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/verify-email" element={<EmailVerification />} />
          <Route path="/verification-required" element={<VerificationRequiredPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfileSummary />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-profile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <OnboardingCheck>
                  <ChatPage />
                </OnboardingCheck>
              </ProtectedRoute>
            }
          />
          <Route
            path="/health-dashboard"
            element={
              <ProtectedRoute>
                <HealthDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings/*"
            element={
              <ProtectedRoute>
                <SettingsLayout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/medication-manager"
            element={
              <ErrorBoundary>
                <MedicationManager darkMode={darkMode} />
              </ErrorBoundary>
            }
          />
          <Route
            path="/appointments"
            element={
              <ProtectedRoute>
                <ErrorBoundary>
                  <AppointmentScheduler darkMode={darkMode} />
                </ErrorBoundary>
              </ProtectedRoute>
            }
          />
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <OnboardingFlow />
              </ProtectedRoute>
            }
          />
          <Route path="/faq" element={<FAQPage darkMode={darkMode} />} />
          <Route path="/hospital/profile" element={<HospitalsList />} />
          <Route path="/hospital/profile/:id" element={<HospitalDetails />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </div>
    </>
  );
};

const App = () => {
  return (
    <SettingsProvider>
      <ToastProvider>
        <div className="App">
          <Router>
            <ToastContainer />
            <AppContent />
          </Router>
        </div>
      </ToastProvider>
    </SettingsProvider>
  );
};

export default App;
