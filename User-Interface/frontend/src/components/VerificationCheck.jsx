import React, { useState } from 'react';
import { sendEmailVerification } from "firebase/auth";
import { auth } from '../firebase';

const VerificationCheck = () => {
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  const resendVerification = async () => {
    try {
      if (!auth.currentUser) {
        alert("You must be logged in to resend verification");
        return;
      }
      
      await sendEmailVerification(auth.currentUser);
      
      setResendDisabled(true);
      setCountdown(60);
      
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      alert("Verification email sent!");
      
    } catch (error) {
      console.error("Error sending verification email:", error);
      alert(`Error: ${error.message}`);
    }
  };
  
  return (
    <div className="mt-4 text-center">
      <p className="text-sm text-gray-700 mb-2">
        Please verify your email to access all features.
      </p>
      <button
        onClick={resendVerification}
        disabled={resendDisabled}
        className="text-sm font-medium text-black hover:text-gray-800 disabled:text-gray-400"
      >
        {resendDisabled 
          ? `Resend verification email (${countdown}s)` 
          : "Resend verification email"}
      </button>
    </div>
  );
};

export default VerificationCheck;