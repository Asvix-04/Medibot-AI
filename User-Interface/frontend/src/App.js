import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './components/Signup';
import Signin from './components/Signin';
import ProfileSummary from './components/ProfileSummary';
import EmailVerification from './components/EmailVerification';
import VerificationRequiredPage from './components/VerificationRequiredPage';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/verify-email" element={<EmailVerification />} />
          <Route path="/verification-required" element={<VerificationRequiredPage />} />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfileSummary />
              </ProtectedRoute>
            } 
          />
          <Route path="/" element={<Signin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
