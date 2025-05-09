import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import medibot_logo from '../assets/medibot_logo.jpg';
import { createUserWithEmailAndPassword, sendEmailVerification, signInWithPopup } from "firebase/auth";
import { auth, googleProvider, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

const Signup = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    countryCode: '+1',
    userType: 'Patient',
    termsAccepted: false
  });
  
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordMatch, setPasswordMatch] = useState(true);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
    
    if (name === 'password') {
      let strength = 0;
      if (value.length >= 8) strength += 1;
      if (/[A-Z]/.test(value)) strength += 1;
      if (/[0-9]/.test(value)) strength += 1;
      if (/[^A-Za-z0-9]/.test(value)) strength += 1;
      setPasswordStrength(strength);
    }
    
    if (name === 'confirmPassword' || (name === 'password' && formData.confirmPassword)) {
      if (name === 'password') {
        setPasswordMatch(value === formData.confirmPassword);
      } else {
        setPasswordMatch(formData.password === value);
      }
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.termsAccepted) {
      setError("Please accept the Terms of Service and Privacy Policy");
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    
    try {
      setSubmitting(true);
      setError('');
      
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      
      await sendEmailVerification(userCredential.user);
      
      // Save additional user data to Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.countryCode + formData.phoneNumber,
        userType: formData.userType,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLogin: new Date(),
        authProvider: 'email'
      });
      
      // Changed navigation to go to chat page instead of verification required
      navigate('/chat');
    } catch (error) {
      console.error("Error creating account:", error);
      if (error.code === 'auth/email-already-in-use') {
        setError("This email is already registered. Please sign in instead.");
      } else if (error.code === 'auth/weak-password') {
        setError("Password is too weak. Please use a stronger password.");
      } else {
        setError(`Error: ${error.message}`);
      }
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleGoogleSignUp = async () => {
    try {
      setSubmitting(true);
      setError('');
      
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      await setDoc(doc(db, "users", user.uid), {
        fullName: user.displayName || '',
        email: user.email,
        photoURL: user.photoURL,
        phoneNumber: user.phoneNumber || '',
        emailVerified: user.emailVerified,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLogin: new Date(),
        authProvider: 'google',
        userType: 'Patient' // Default user type
      }, { merge: true });
      
      // Changed navigation to go to chat page instead of health dashboard
      navigate('/chat');
      
    } catch (error) {
      if (error.code === 'auth/popup-closed-by-user') {
        setError('Sign-up was canceled.');
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        setError('An account already exists with this email.');
      } else {
        setError('An error occurred during sign-up. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleTermsClick = (e) => {
    e.preventDefault();
    // Open terms modal or navigate to terms page
    alert("Terms of Service will open here");
  };
  
  const handlePrivacyClick = (e) => {
    e.preventDefault();
    // Open privacy policy modal or navigate to privacy page
    alert("Privacy Policy will open here");
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-to-br from-[#121212] to-[#1a1a1a]">
      {/* Background pattern */}
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
          <circle cx="400" cy="400" r="350" stroke="#6366f1" strokeWidth="2" fill="none" />
          <circle cx="400" cy="400" r="250" stroke="#6366f1" strokeWidth="2" fill="none" />
          <circle cx="400" cy="400" r="150" stroke="#6366f1" strokeWidth="2" fill="none" />
        </svg>
      </div>

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="h-20 w-20 rounded-full bg-white p-2 shadow-lg">
            <img className="h-full w-full rounded-full object-cover" src={medibot_logo} alt="Medibot" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold" style={{ color: '#6366f1' }}>
          Create Account
        </h2>
        <p className="mt-2 text-center text-sm" style={{ color: '#d6d4d4' }}>
          Join Medibot for personalized health insights
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#1a1a1a] py-8 px-4 shadow-2xl sm:rounded-xl sm:px-10 border border-[#2a2a2a]">
          {error && (
            <div className="mb-4 rounded-md bg-red-900 bg-opacity-30 p-4 border border-red-800">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium" style={{ color: '#d6d4d4' }}>
                Full Name
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5" style={{ color: '#818cf8' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  name="fullName"
                  id="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-[#2a2a2a] bg-[#121212] rounded-md shadow-sm placeholder-gray-500 text-[#d6d4d4] focus:ring-[#6366f1] focus:border-[#6366f1]"
                  placeholder="John Doe"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium" style={{ color: '#d6d4d4' }}>
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5" style={{ color: '#818cf8' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-[#2a2a2a] bg-[#121212] rounded-md shadow-sm placeholder-gray-500 text-[#d6d4d4] focus:ring-[#6366f1] focus:border-[#6366f1]"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium" style={{ color: '#d6d4d4' }}>
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5" style={{ color: '#818cf8' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-[#2a2a2a] bg-[#121212] rounded-md shadow-sm placeholder-gray-500 text-[#d6d4d4] focus:ring-[#6366f1] focus:border-[#6366f1]"
                  placeholder="••••••••"
                />
              </div>
              
              <div className="mt-1">
                <div className="h-1 w-full bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ease-out ${
                      passwordStrength === 0 ? 'w-0' :
                      passwordStrength === 1 ? 'w-1/4 bg-red-500' :
                      passwordStrength === 2 ? 'w-2/4 bg-yellow-500' :
                      passwordStrength === 3 ? 'w-3/4 bg-[#818cf8]' :
                      'w-full bg-[#6366f1]'
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
              <label htmlFor="confirmPassword" className="block text-sm font-medium" style={{ color: '#d6d4d4' }}>
                Confirm password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5" style={{ color: '#818cf8' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 border ${
                    formData.confirmPassword && !passwordMatch ? 'border-red-500' : 'border-[#2a2a2a]'
                  } bg-[#121212] rounded-md shadow-sm placeholder-gray-500 text-[#d6d4d4] focus:ring-[#6366f1] focus:border-[#6366f1]`}
                  placeholder="••••••••"
                />
                {formData.confirmPassword && !passwordMatch && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              {formData.confirmPassword && !passwordMatch && (
                <p className="mt-1 text-xs text-red-500">
                  Passwords do not match
                </p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium" style={{ color: '#d6d4d4' }}>
                  Phone Number
                </label>
                <div className="mt-1 flex space-x-2">
                  <div className="relative w-24">
                    <input
                      type="text"
                      name="countryCode"
                      id="countryCode"
                      value={formData.countryCode}
                      onChange={handleChange}
                      className="block w-full px-3 py-3 border border-[#2a2a2a] bg-[#121212] rounded-md shadow-sm placeholder-gray-500 text-[#d6d4d4] focus:ring-[#6366f1] focus:border-[#6366f1]"
                      placeholder="+1"
                    />
                  </div>
                  <div className="relative flex-1">
                    <input
                      type="tel"
                      name="phoneNumber"
                      id="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="block w-full px-3 py-3 border border-[#2a2a2a] bg-[#121212] rounded-md shadow-sm placeholder-gray-500 text-[#d6d4d4] focus:ring-[#6366f1] focus:border-[#6366f1]"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label htmlFor="userType" className="block text-sm font-medium" style={{ color: '#d6d4d4' }}>
                  User Type
                </label>
                <div className="mt-1 relative">
                  <select
                    name="userType"
                    id="userType"
                    value={formData.userType}
                    onChange={handleChange}
                    className="block w-full px-3 py-3 border border-[#2a2a2a] bg-[#121212] rounded-md shadow-sm placeholder-gray-500 text-[#d6d4d4] focus:ring-[#6366f1] focus:border-[#6366f1] appearance-none"
                  >
                    <option value="Patient">Patient</option>
                    <option value="Doctor">Doctor</option>
                    <option value="Other">Other</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-3">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="termsAccepted"
                    name="termsAccepted"
                    type="checkbox"
                    checked={formData.termsAccepted}
                    onChange={handleChange}
                    className="h-4 w-4 text-[#6366f1] focus:ring-[#6366f1] border-[#2a2a2a] rounded cursor-pointer"
                  />
                </div>
                <div className="ml-2 text-sm flex flex-wrap items-center">
                  <span className="font-medium text-[#d6d4d4]">
                    I agree to the{' '}
                  </span>
                  <button
                    type="button"
                    onClick={handleTermsClick}
                    className="ml-1 text-[#6366f1] hover:text-[#4f46e5] bg-transparent border-0 p-0 font-medium inline-flex align-baseline transition-colors cursor-pointer"
                  >
                    Terms of Service
                  </button>
                  <span className="font-medium text-[#d6d4d4] mx-1">and</span>
                  <button
                    type="button"
                    onClick={handlePrivacyClick}
                    className="text-[#6366f1] hover:text-[#4f46e5] bg-transparent border-0 p-0 font-medium inline-flex align-baseline transition-colors cursor-pointer"
                  >
                    Privacy Policy
                  </button>
                </div>
              </div>
            </div>
            
            <div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-lg bg-[#6366f1] text-[#d6d4d4] font-medium text-sm hover:bg-[#4f46e5] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6366f1] transition-all duration-300 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </>
                ) : 'Create Account'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#2a2a2a]"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#1a1a1a] text-[#d6d4d4]">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={handleGoogleSignUp}
                disabled={submitting}
                className="w-full flex items-center justify-center py-2.5 px-4 border border-[#2a2a2a] rounded-md shadow-sm bg-[#121212] text-sm font-medium text-[#d6d4d4] hover:bg-[#232323] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6366f1] transition-colors cursor-pointer"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing up with Google...
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" className="mr-2" viewBox="0 0 48 48">
                      <g>
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                        <path fill="none" d="M0 0h48v48H0z"></path>
                      </g>
                    </svg>
                    Sign up with Google
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Sign in link */}
        <div className="mt-6 text-center">
          <p className="text-sm" style={{ color: '#d6d4d4' }}>
            Already have an account?{' '}
            <Link to="/signin" className="font-medium text-[#6366f1] hover:text-[#4f46e5] transition-colors cursor-pointer">
              Sign in
            </Link>
          </p>
        </div>
      </div>
      
      {/* Return to home link */}
      <div className="mt-8 text-center">
        <Link to="/" className="inline-flex items-center text-sm font-medium text-[#d6d4d4] hover:text-[#6366f1] transition-colors cursor-pointer">
          <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Signup;