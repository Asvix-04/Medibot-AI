import React from 'react';
import medibot_logo from '../../assets/medibot_logo.jpg';

const WelcomeScreen = ({ onContinue }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-500 p-8 flex flex-col items-center">
          <div className="w-28 h-28 rounded-full bg-white p-1 shadow-xl mb-6 overflow-hidden">
            <img 
              src={medibot_logo} 
              alt="Medibot" 
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to Medibot</h1>
          <p className="text-white/80 text-center">Your AI assistant for medical information</p>
        </div>
        
        {/* Content */}
        <div className="p-8">
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <div className="bg-purple-100 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="font-medium text-gray-900">Ask me anything about health concerns</h3>
                <p className="text-gray-500 text-sm mt-1">Get information about symptoms, conditions, and general health questions.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <div className="bg-purple-100 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="font-medium text-gray-900">Your data is private and secure</h3>
                <p className="text-gray-500 text-sm mt-1">We use encryption to protect your personal information and health data.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <div className="bg-purple-100 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="font-medium text-gray-900">Get reliable information 24/7</h3>
                <p className="text-gray-500 text-sm mt-1">Access health information whenever you need it, day or night.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <div className="bg-purple-100 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="font-medium text-gray-900">Not a replacement for professional advice</h3>
                <p className="text-gray-500 text-sm mt-1">Always consult with a healthcare professional for medical decisions.</p>
              </div>
            </div>
          </div>
          
          <button
            onClick={onContinue}
            className="mt-8 w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-lg font-medium rounded-xl shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transform transition-all duration-300 hover:-translate-y-1"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;