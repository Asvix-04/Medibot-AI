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
    <div className="mt-4 p-6 bg-white rounded-lg border border-violet-100 shadow-sm">
      <div className="flex flex-col items-center">
        <div className="bg-violet-100 p-3 rounded-full mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Email Verification Required</h3>
        <p className="text-sm text-gray-600 text-center mb-4">
          We've sent a verification link to your email address. Please verify your email to access all features.
        </p>
        <button
          onClick={resendVerification}
          disabled={resendDisabled}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            resendDisabled 
              ? 'bg-violet-100 text-violet-400 cursor-not-allowed' 
              : 'bg-violet-600 text-white hover:bg-violet-700 shadow-md hover:shadow-lg'
          }`}
        >
          {resendDisabled 
            ? `Resend in ${countdown}s` 
            : "Resend verification email"}
        </button>
        
        {resendDisabled && (
          <p className="mt-3 text-xs text-violet-500">
            Check your inbox and spam folder for the verification email
          </p>
        )}
      </div>
    </div>
  );
};

export default VerificationCheck;