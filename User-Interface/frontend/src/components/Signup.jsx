import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import medibot_logo from '../assets/medibot_logo.jpg';
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from '../firebase';
import Modal from './Modal';

const Signup = () => {
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
      alert("Please accept the Terms of Service and Privacy Policy");
      return;
    }
    
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      
      await sendEmailVerification(userCredential.user);
      
      alert("Account created! Please check your email to verify your account.");
      
    } catch (error) {
      console.error("Error creating account:", error);
      alert(`Error: ${error.message}`);
    }
  };
  
  // Prevent default on links to open modal instead of navigating
  const handleTermsClick = (e) => {
    e.preventDefault();
    setShowTermsModal(true);
  };
  
  const handlePrivacyClick = (e) => {
    e.preventDefault();
    setShowPrivacyModal(true);
  };
  
  // Rest of the component stays the same, just update the terms checkbox part:
  
  // Replace the terms checkbox section with this updated version:
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
            className="focus:ring-1 focus:ring-black h-3.5 w-3.5 text-black border-gray-300 rounded"
          />
        </div>
        <div className="ml-2 text-xs">
          <label htmlFor="termsAccepted" className="font-medium text-gray-700">
            I agree to the{" "}
            <button
              type="button"
              onClick={handleTermsClick}
              className="text-black hover:underline bg-transparent border-0 p-0 font-medium inline-flex align-baseline"
            >
              Terms of Service
            </button>
            {" "}and{" "}
            <button
              type="button"
              onClick={handlePrivacyClick}
              className="text-black hover:underline bg-transparent border-0 p-0 font-medium inline-flex align-baseline"
            >
              Privacy Policy
            </button>
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-6 px-4 sm:px-6 lg:px-8">
      {/* Terms Modal */}
      <Modal 
        isOpen={showTermsModal} 
        onClose={() => setShowTermsModal(false)}
        title="Terms of Service"
      >
        <div className="prose prose-sm">
          <h4 className="font-bold text-lg">1. Introduction</h4>
          <p>
            Welcome to Medibot. These Terms of Service govern your use of our website and services.
            By using Medibot, you agree to these terms. Please read them carefully.
          </p>

          <h4 className="font-bold text-lg mt-4">2. Services</h4>
          <p>
            Medibot provides AI-powered health insights and information. Our services are not a substitute
            for professional medical advice, diagnosis, or treatment.
          </p>

          <h4 className="font-bold text-lg mt-4">3. Data Collection & AI Training</h4>
          <p>
            <strong>Important:</strong> By using Medibot, you agree that we may collect and use your health data,
            questions, interactions, and feedback to train and improve our AI models. This helps us provide
            more accurate and personalized health insights for all users. Data used for training our AI models
            is anonymized and stripped of personally identifiable information.
          </p>

          <h4 className="font-bold text-lg mt-4">4. User Accounts</h4>
          <p>
            You are responsible for safeguarding your account and for any activities or actions under your account.
          </p>

          <h4 className="font-bold text-lg mt-4">5. Health Disclaimer</h4>
          <p>
            Medibot provides general information and is not a substitute for professional medical advice.
            Always consult with a qualified healthcare provider regarding any medical conditions or treatments.
          </p>

          <h4 className="font-bold text-lg mt-4">6. Privacy</h4>
          <p>
            Your privacy is important to us. Please refer to our Privacy Policy for information on how we collect,
            use, and disclose your personal data.
          </p>

          <h4 className="font-bold text-lg mt-4">7. Changes to Terms</h4>
          <p>
            We may update these terms from time to time. We will notify you of any changes by posting the new
            terms on this page.
          </p>

          <h4 className="font-bold text-lg mt-4">8. Contact Us</h4>
          <p>
            If you have any questions about these Terms, please contact us at support@medibot.ai.
          </p>
        </div>
      </Modal>

      {/* Privacy Policy Modal */}
      <Modal 
        isOpen={showPrivacyModal} 
        onClose={() => setShowPrivacyModal(false)}
        title="Privacy Policy"
      >
        <div className="prose prose-sm">
          <h4 className="font-bold text-lg">1. Information We Collect</h4>
          <p>
            We collect information you provide directly to us, including personal data (name, email, phone number),
            account information, and health data you choose to share with us.
          </p>

          <h4 className="font-bold text-lg mt-4">2. Use of Your Data</h4>
          <p>
            We use your data to provide and improve our services, communicate with you, and personalize your experience.
          </p>
          <p className="font-medium">
            <strong>AI Training:</strong> We may use anonymized data from user interactions to train and improve our AI models.
            This includes health questions, symptom descriptions, and interactions with our chatbot. This training helps us
            provide more accurate and helpful responses to health inquiries.
          </p>

          <h4 className="font-bold text-lg mt-4">3. Data Protection</h4>
          <p>
            We implement appropriate security measures to protect your personal information and health data.
            We use encryption, secure servers, and regular security assessments.
          </p>

          <h4 className="font-bold text-lg mt-4">4. Data Sharing</h4>
          <p>
            We do not sell your personal information. We may share data with:
          </p>
          <ul className="list-disc pl-5">
            <li>Service providers who help operate our platform</li>
            <li>Legal authorities when required by law</li>
            <li>Research partners (using anonymized data only)</li>
          </ul>

          <h4 className="font-bold text-lg mt-4">5. Your Rights</h4>
          <p>
            You have the right to access, update, or delete your personal information. You can also opt out
            of having your anonymized data used for AI training by contacting us.
          </p>

          <h4 className="font-bold text-lg mt-4">6. Cookies</h4>
          <p>
            We use cookies and similar tracking technologies to enhance your experience on our website.
          </p>

          <h4 className="font-bold text-lg mt-4">7. Changes to Policy</h4>
          <p>
            We may update this privacy policy from time to time. We will notify you of any changes by posting
            the new policy on this page.
          </p>

          <h4 className="font-bold text-lg mt-4">8. Contact Us</h4>
          <p>
            If you have questions about this Privacy Policy, please contact us at privacy@medibot.ai.
          </p>
        </div>
      </Modal>

      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
        <div className="bg-black py-5 px-4 relative">
          <div className="flex justify-center">
            <img className="h-12 w-auto rounded-full p-1 bg-white" src={medibot_logo} alt="Medibot" />
          </div>
          <h1 className="mt-2 text-center text-2xl font-bold text-white">Medibot</h1>
          <p className="mt-1 text-center text-xs text-gray-400 max-w-sm mx-auto">
            AI-powered health insights. Trusted. Private. Secure.
          </p>
          
          <div className="absolute -bottom-3 left-0 right-0 h-6 bg-white" style={{
            clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 0 100%)',
            opacity: 0.1
          }}></div>
        </div>
        
        <div className="p-6 bg-white">
          <h2 className="text-center text-xl font-bold text-gray-900 mb-4">Create your account</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="fullName" className="block text-xs font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <div className="relative rounded-md">
                <input
                  type="text"
                  name="fullName"
                  id="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="block w-full px-3 py-2 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-transparent"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <i className="bx bxs-user text-gray-400 text-sm"></i>
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative rounded-md">
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="block w-full px-3 py-2 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-transparent"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <i className="bx bxs-envelope text-gray-400 text-sm"></i>
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-500">We'll send a verification code</p>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-xs font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative rounded-md">
                <input
                  type="password"
                  name="password"
                  id="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="block w-full px-3 py-2 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-transparent"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <i className="bx bxs-lock-alt text-gray-400 text-sm"></i>
                </div>
              </div>
              
              <div className="mt-1">
                <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ease-out ${
                      passwordStrength === 0 ? 'w-0' :
                      passwordStrength === 1 ? 'w-1/4 bg-red-500' :
                      passwordStrength === 2 ? 'w-2/4 bg-yellow-500' :
                      passwordStrength === 3 ? 'w-3/4 bg-gray-700' :
                      'w-full bg-green-500'
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
                Confirm Password
              </label>
              <div className="relative rounded-md">
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`block w-full px-3 py-2 text-sm text-gray-900 bg-gray-50 border ${
                    formData.confirmPassword && !passwordMatch ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-transparent`}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <i className={`bx ${formData.confirmPassword && !passwordMatch ? 'bxs-error text-red-500' : 
                    formData.confirmPassword && passwordMatch ? 'bxs-check-circle text-green-500' : 'bxs-check-circle text-gray-400'} text-sm`}></i>
                </div>
              </div>
              {formData.confirmPassword && !passwordMatch && (
                <p className="mt-0.5 text-xs text-red-500">Passwords do not match</p>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="phoneNumber" className="block text-xs font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <div className="flex space-x-2">
                  <div className="relative w-20">
                    <input
                      type="text"
                      name="countryCode"
                      id="countryCode"
                      value={formData.countryCode}
                      onChange={handleChange}
                      placeholder="+91"
                      maxLength="4"
                      className="block w-full px-3 py-2 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-transparent"
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
                      className="block w-full px-3 py-2 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-transparent"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <i className="bx bx-phone text-gray-400 text-sm"></i>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <label htmlFor="userType" className="block text-xs font-medium text-gray-700 mb-1">
                  User Type
                </label>
                <div className="relative rounded-md">
                  <select
                    name="userType"
                    id="userType"
                    value={formData.userType}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-transparent appearance-none"
                  >
                    <option value="Patient">Patient</option>
                    <option value="Doctor">Doctor</option>
                    <option value="Other">Other</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                    <i className="bx bx-chevron-down text-sm"></i>
                  </div>
                </div>
              </div>
            </div>
            
            {renderTermsSection()}
            
            <div className="mt-4">
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-black"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <i className="bx bxs-user-plus h-4 w-4 text-gray-500 group-hover:text-gray-400"></i>
                </span>
                Create Account
              </button>
            </div>
          </form>
          
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-600">
              Already have an account?{' '}
              <Link to="/signin" className="font-medium text-black hover:text-gray-800">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;