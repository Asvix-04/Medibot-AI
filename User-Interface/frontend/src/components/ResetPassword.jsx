import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import { auth } from '../firebase';
import medibot_logo from '../assets/medibot_logo.jpg';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [isVerifying, setIsVerifying] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const verifyCode = async () => {
      const oobCode = searchParams.get('oobCode');
      if (!oobCode) {
        setError('Invalid password reset link. Please request a new one.');
        setIsVerifying(false);
        return;
      }
      
      try {
        const email = await verifyPasswordResetCode(auth, oobCode);
        setEmail(email);
        setIsVerifying(false);
      } catch (error) {
        console.error("Error verifying reset code:", error);
        setError('This password reset link has expired or is invalid. Please request a new one.');
        setIsVerifying(false);
      }
    };
    
    verifyCode();
  }, [searchParams]);
  
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    
    // Calculate password strength
    let strength = 0;
    if (value.length >= 8) strength += 1;
    if (/[A-Z]/.test(value)) strength += 1;
    if (/[0-9]/.test(value)) strength += 1;
    if (/[^A-Za-z0-9]/.test(value)) strength += 1;
    setPasswordStrength(strength);
    
    // Check if passwords match
    if (confirmPassword) {
      setPasswordMatch(value === confirmPassword);
    }
  };
  
  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setPasswordMatch(password === value);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const oobCode = searchParams.get('oobCode');
      await confirmPasswordReset(auth, oobCode, password);
      setIsCompleted(true);
    } catch (error) {
      console.error("Error resetting password:", error);
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-violet-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying your reset link...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-violet-600 to-indigo-700 py-5 px-4 relative">
          <div className="flex justify-center">
            <img className="h-12 w-auto rounded-full p-1 bg-white" src={medibot_logo} alt="Medibot" />
          </div>
          <h1 className="mt-2 text-center text-2xl font-bold text-white">Medibot</h1>
          <p className="mt-1 text-center text-xs text-violet-100 max-w-sm mx-auto">
            AI-powered health insights. Trusted. Private. Secure.
          </p>
          
          <div className="absolute -bottom-3 left-0 right-0 h-6 bg-white" style={{
            clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 0 100%)',
            opacity: 0.1
          }}></div>
        </div>
        
        <div className="p-6 bg-white">
          {error && !isCompleted && (
            <div className="mb-6 text-center">
              <div className="bg-red-100 p-3 rounded-full inline-block mb-4">
                <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <button 
                onClick={() => navigate('/forgot-password')}
                className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-700 text-white text-sm rounded-md hover:from-violet-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
              >
                Request New Reset Link
              </button>
            </div>
          )}
          
          {!error && !isCompleted && (
            <>
              <h2 className="text-center text-xl font-bold text-gray-900 mb-5">Reset your password</h2>
              <p className="text-center text-sm text-gray-600 mb-6">
                Create a new password for <span className="font-medium">{email}</span>
              </p>
              
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="password" className="block text-xs font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <div className="relative rounded-md">
                    <input
                      type="password"
                      name="password"
                      id="password"
                      required
                      value={password}
                      onChange={handlePasswordChange}
                      placeholder="••••••••"
                      className="block w-full px-3 py-2 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <i className="bx bxs-lock-alt text-violet-400 text-sm"></i>
                    </div>
                  </div>
                  
                  <div className="mt-1">
                    <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ease-out ${
                          passwordStrength === 0 ? 'w-0' :
                          passwordStrength === 1 ? 'w-1/4 bg-red-500' :
                          passwordStrength === 2 ? 'w-2/4 bg-yellow-500' :
                          passwordStrength === 3 ? 'w-3/4 bg-violet-500' :
                          'w-full bg-violet-700'
                        }`}
                      ></div>
                    </div>
                    <p className="mt-0.5 text-xs text-gray-500">
                      {passwordStrength === 0 ? 'Enter password' :
                      passwordStrength === 1 ? 'Weak' :
                      passwordStrength === 2 ? 'Medium' :
                      passwordStrength === 3 ? 'Good' : 'Strong'}
                    </p>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-xs font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <div className="relative rounded-md">
                    <input
                      type="password"
                      name="confirmPassword"
                      id="confirmPassword"
                      required
                      value={confirmPassword}
                      onChange={handleConfirmPasswordChange}
                      placeholder="••••••••"
                      className={`block w-full px-3 py-2 text-sm text-gray-900 bg-gray-50 border ${
                        confirmPassword && !passwordMatch ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500`}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <i className={`bx ${confirmPassword && !passwordMatch ? 'bxs-error text-red-500' : 
                        confirmPassword && passwordMatch ? 'bxs-check-circle text-violet-500' : 'bxs-check-circle text-gray-400'} text-sm`}></i>
                    </div>
                  </div>
                  {confirmPassword && !passwordMatch && (
                    <p className="mt-0.5 text-xs text-red-500">Passwords do not match</p>
                  )}
                </div>
                
                <div className="mt-5">
                  <button
                    type="submit"
                    disabled={isSubmitting || !passwordMatch || password.length < 8}
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-violet-600 to-indigo-700 hover:from-violet-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="inline-flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Resetting...
                      </span>
                    ) : (
                      'Reset Password'
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
          
          {isCompleted && (
            <div className="text-center">
              <div className="bg-violet-100 p-3 rounded-full inline-block mb-4">
                <svg className="h-12 w-12 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Password Reset Complete</h2>
              <p className="text-gray-600 mb-6">
                Your password has been successfully reset.
              </p>
              <button 
                onClick={() => navigate('/signin')}
                className="w-full py-2 px-4 border border-transparent rounded-md text-white bg-gradient-to-r from-violet-600 to-indigo-700 hover:from-violet-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
              >
                Sign in with new password
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;