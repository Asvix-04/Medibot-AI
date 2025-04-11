import React from 'react';
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
import './App.css';

// Create an AppContent component to use the useLocation hook
const AppContent = () => {
  const location = useLocation();
  const isChatPage = location.pathname === '/chat';
  
  return (
    <>
      {!isChatPage && <Navigation />}
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
                <ChatPage />
              </ProtectedRoute>
            } 
          />
          <Route path="/" element={<Signin />} />
        </Routes>
      </div>
    </>
  );
};

function App() {
  return (
    <Router>
      <div className="App">
        <AppContent />
      </div>
    </Router>
  );
}

export default App;
