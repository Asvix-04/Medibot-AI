import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { applyActionCode, getAuth, getIdToken } from 'firebase/auth';
import axios from 'axios';

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying');
  const navigate = useNavigate();
  const auth = getAuth();
  
  useEffect(() => {
    const verifyEmail = async () => {
      const actionCode = searchParams.get('oobCode');
      
      if (!actionCode) {
        setStatus('error');
        return;
      }
      
      try {
        await applyActionCode(auth, actionCode);
        setStatus('success');
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('error');
      }
    };
    
    verifyEmail();
  }, [searchParams, auth]);
  
  useEffect(() => {
    if (status === 'success' && auth.currentUser) {
      const sendWelcomeEmail = async () => {
        try {
          const token = await getIdToken(auth.currentUser);
          
          // Replace this URL with your actual backend URL
          const backendUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
          
          await axios.post(`${backendUrl}/api/auth/welcome-email`, 
            { fullName: auth.currentUser.displayName || '' },
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
          console.log('Welcome email request sent successfully');
        } catch (error) {
          console.error("Error sending welcome email:", error);
        }
      };
      
      sendWelcomeEmail();
    }
  }, [status, auth]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100 p-8">
        <div className="text-center">
          {status === 'verifying' && (
            <>
              <div className="animate-spin h-12 w-12 border-4 border-black border-t-transparent rounded-full mx-auto mb-4"></div>
              <h2 className="text-xl font-bold text-gray-900">Verifying your email...</h2>
            </>
          )}
          
          {status === 'success' && (
            <>
              <div className="bg-green-100 p-3 rounded-full inline-block mb-4">
                <svg className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Email Verified!</h2>
              <p className="text-gray-600 mb-6">Your email has been successfully verified.</p>
              <button 
                onClick={() => navigate('/signin')}
                className="w-full py-2 px-4 border border-transparent rounded-md text-white bg-black hover:bg-gray-800"
              >
                Sign in to your account
              </button>
            </>
          )}
          
          {status === 'error' && (
            <>
              <div className="bg-red-100 p-3 rounded-full inline-block mb-4">
                <svg className="h-12 w-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Verification Failed</h2>
              <p className="text-gray-600 mb-6">The verification link is invalid or has expired.</p>
              <button 
                onClick={() => navigate('/signup')}
                className="w-full py-2 px-4 border border-transparent rounded-md text-white bg-black hover:bg-gray-800"
              >
                Back to signup
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;