import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import medibot_logo from '../assets/medibot_logo.jpg';
import { createUserWithEmailAndPassword, sendEmailVerification, signInWithPopup } from "firebase/auth";
import { auth, googleProvider, db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import Modal from './Modal';

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
    countryCode: '',
    userType: 'Patient',
    termsAccepted: false
  });
  
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  
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
      
      navigate('/verification-required');
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
  
  const handleGoogleSignUp = async (e) => {
    if (e) e.preventDefault();
    
    try {
      setSubmitting(true);
      setError('');
      
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Check if this is first login with Google
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (!userDoc.exists()) {
        // Create a new user profile
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
        });
      }
      
      navigate('/health-dashboard'); 
      
    } catch (error) {
      console.error("Google sign-up error:", error);
      
      if (error.code === 'auth/popup-closed-by-user') {
        setError('Sign-up was canceled.');
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        setError('An account already exists with this email. Please sign in using the appropriate method.');
      } else {
        setError('An error occurred during sign-up. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleTermsClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowTermsModal(true);
  };
  
  const handlePrivacyClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowPrivacyModal(true);
  };
  
  const renderTermsSection = () => (
    <div className="mt-3">
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id="termsAccepted"
            name="termsAccepted"
            type="checkbox"
            checked={formData.termsAccepted}
            onChange={handleChange}
            className="h-4 w-4 text-[#f75600] focus:ring-[#f75600] border-[#2a2a2a] rounded"
          />
        </div>
        <div className="ml-2 text-sm">
          <label htmlFor="termsAccepted" className="font-medium text-[#d6d4d4]">
            I agree to the{" "}
            <button
              type="button"
              onClick={handleTermsClick}
              className="text-[#f75600] hover:text-[#E2711D] bg-transparent border-0 p-0 font-medium inline-flex align-baseline transition-colors"
            >
              Terms of Service
            </button>
            {" "}and{" "}
            <button
              type="button"
              onClick={handlePrivacyClick}
              className="text-[#f75600] hover:text-[#E2711D] bg-transparent border-0 p-0 font-medium inline-flex align-baseline transition-colors"
            >
              Privacy Policy
            </button>
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#121212] to-[#1a1a1a] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Background pattern */}
      <div className="fixed inset-0 z-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
          <path fill="none" stroke="#f75600" strokeWidth="1.5" 
            d="M769 229L1037 260.9M927 880L731 737 520 660 309 538 40 599 295 764 126.5 879.5 40 599-197 493 102 382-31 229 126.5 79.5-69-63" />
          <path fill="none" stroke="#f75600" strokeWidth="1.5" 
            d="M-31 229L237 261 390 382 603 493 308.5 537.5 101.5 381.5M370 905L295 764" />
          <path fill="none" stroke="#f75600" strokeWidth="1.5" 
            d="M520 660L578 842 731 737 840 599 603 493 520 660 295 764 309 538 390 382 539 269 769 229 577.5 41.5 370 105 295 -36 126.5 79.5 237 261 102 382 40 599 -69 737 127 880" />
          <path fill="none" stroke="#f75600" strokeWidth="1.5" 
            d="M520-140L578.5 42.5 731-63M603 493L539 269 237 261 370 105M902 382L539 269M390 382L102 382" />
          <path fill="none" stroke="#f75600" strokeWidth="1.5" 
            d="M-222 42L126.5 79.5 370 105 539 269 577.5 41.5 927 80 769 229 902 382 603 493 731 737M295-36L577.5 41.5M578 842L295 764M40-201L127 80M102 382L-261 269" />
        </svg>
      </div>
      
      {/* Terms Modal */}
      <Modal 
        isOpen={showTermsModal} 
        onClose={() => setShowTermsModal(false)}
        title="Terms of Service"
      >
        <div className="prose prose-sm text-[#d6d4d4]">
          <h4 className="font-bold text-lg text-[#f75600]">1. Introduction</h4>
          <p>
            Welcome to Medibot. These Terms of Service govern your use of our website and services.
            By using Medibot, you agree to these terms. Please read them carefully.
          </p>
          {/* Rest of terms content */}
        </div>
      </Modal>

      {/* Privacy Policy Modal */}
      <Modal 
        isOpen={showPrivacyModal} 
        onClose={() => setShowPrivacyModal(false)}
        title="Privacy Policy"
      >
        <div className="prose prose-sm text-[#d6d4d4]">
          <h4 className="font-bold text-lg text-[#f75600]">1. Information We Collect</h4>
          <p>
            We collect information you provide directly to us, including personal data (name, email, phone number),
            account information, and health data you choose to share with us.
          </p>
          {/* Rest of privacy policy content */}
        </div>
      </Modal>

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="h-24 w-24 rounded-full bg-white p-2 shadow-lg">
            <img className="h-full w-full rounded-full object-cover" src={medibot_logo} alt="Medibot" />
          </div>
        </div>
        
        <h2 className="mt-6 text-center text-3xl font-extrabold" style={{ color: '#f75600' }}>
          Create Account
        </h2>
        <p className="mt-2 text-center text-sm text-[#d6d4d4]">
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
              <label htmlFor="fullName" className="block text-sm font-medium text-[#d6d4d4]">
                Full Name
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-[#E2711D]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                  placeholder="John Doe"
                  className="block w-full pl-10 pr-3 py-3 border border-[#2a2a2a] bg-[#121212] focus:ring-[#f75600] focus:border-[#f75600] rounded-md shadow-sm placeholder-gray-500 text-[#d6d4d4]"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#d6d4d4]">
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-[#E2711D]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                  className="block w-full pl-10 pr-3 py-3 border border-[#2a2a2a] bg-[#121212] focus:ring-[#f75600] focus:border-[#f75600] rounded-md shadow-sm placeholder-gray-500 text-[#d6d4d4]"
                  placeholder="you@example.com"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">We'll send a verification code</p>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#d6d4d4]">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-[#E2711D]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                  className="block w-full pl-10 pr-3 py-3 border border-[#2a2a2a] bg-[#121212] focus:ring-[#f75600] focus:border-[#f75600] rounded-md shadow-sm placeholder-gray-500 text-[#d6d4d4]"
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
                      passwordStrength === 3 ? 'w-3/4 bg-[#E2711D]' :
                      'w-full bg-[#f75600]'
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
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#d6d4d4]">
                Confirm password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-[#E2711D]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                    formData.confirmPassword && !passwordMatch ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-[#2a2a2a] focus:ring-[#f75600] focus:border-[#f75600]'
                  } bg-[#121212] rounded-md shadow-sm placeholder-gray-500 text-[#d6d4d4]`}
                  placeholder="••••••••"
                />
                {formData.confirmPassword && !passwordMatch && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
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
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-[#d6d4d4]">
                  Phone Number <span className="text-gray-500 text-xs">(Optional)</span>
                </label>
                <div className="flex space-x-2">
                  <div className="relative w-20">
                    <input
                      type="text"
                      name="countryCode"
                      id="countryCode"
                      value={formData.countryCode}
                      onChange={handleChange}
                      placeholder="+1"
                      maxLength="4"
                      className="block w-full px-3 py-3 border border-[#2a2a2a] bg-[#121212] focus:ring-[#f75600] focus:border-[#f75600] rounded-md shadow-sm placeholder-gray-500 text-[#d6d4d4]"
                    />
                  </div>
                  <div className="relative rounded-md flex-1">
                    <input
                      type="tel"
                      name="phoneNumber"
                      id="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="(555) 123-4567"
                      className="block w-full px-3 py-3 border border-[#2a2a2a] bg-[#121212] focus:ring-[#f75600] focus:border-[#f75600] rounded-md shadow-sm placeholder-gray-500 text-[#d6d4d4]"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label htmlFor="userType" className="block text-sm font-medium text-[#d6d4d4]">
                  User Type
                </label>
                <div className="relative rounded-md">
                  <select
                    name="userType"
                    id="userType"
                    value={formData.userType}
                    onChange={handleChange}
                    className="block w-full px-3 py-3 border border-[#2a2a2a] bg-[#121212] focus:ring-[#f75600] focus:border-[#f75600] rounded-md shadow-sm placeholder-gray-500 text-[#d6d4d4] appearance-none"
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
            
            {renderTermsSection()}
            
            <div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-lg bg-[#f75600] text-[#d6d4d4] font-medium text-sm hover:bg-[#E2711D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f75600] transition-all duration-300"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#d6d4d4]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
                <span className="px-2 bg-[#1a1a1a] text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={handleGoogleSignUp}
                disabled={submitting}
                className="w-full flex items-center justify-center py-2.5 px-4 border border-[#2a2a2a] rounded-md shadow-sm bg-[#121212] text-sm font-medium text-[#d6d4d4] hover:bg-[#1d1d1d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f75600] transition-colors"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin mr-2 h-5 w-5 text-[#f75600]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing up...
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
          <p className="text-sm text-[#d6d4d4]">
            Already have an account?{' '}
            <Link to="/signin" className="font-medium text-[#f75600] hover:text-[#E2711D] transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
      
      {/* Return to home link */}
      <div className="mt-8 text-center">
        <Link to="/" className="inline-flex items-center text-sm font-medium text-[#d6d4d4] hover:text-[#f75600] transition-colors">
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