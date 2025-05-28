import React, { useState, useEffect } from 'react';
import { auth } from '../../firebase';

const NameCollectionScreen = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    // Get user's display name from auth if available
    const user = auth.currentUser;
    if (user && user.displayName) {
      setName(user.displayName);
      setIsValid(true);
    }
    
    // Animation timing
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setName(value);
    setIsValid(value.trim().length >= 2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isValid) {
      onSubmit(name.trim());
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-violet-50 to-white">
      <div className={`max-w-lg w-full bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-500 ${isAnimating ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}`}>
        <div className="bg-gradient-to-r from-violet-600 to-violet-800 p-8">
          <h1 className="text-3xl font-bold text-white text-center">Before we get started...</h1>
        </div>
        
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-lg font-medium text-gray-900 mb-3 text-center">
                What should we call you?
              </label>
              <div className="mt-4">
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={name}
                  onChange={handleChange}
                  autoFocus
                  className="block w-full px-4 py-3 text-lg text-gray-900 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                  placeholder="Your name"
                />
              </div>
              <p className="mt-3 text-sm text-gray-500 text-center">
                This helps us personalize your experience
              </p>
            </div>
            
            <div className="pt-4">
              <button
                type="submit"
                disabled={!isValid}
                className={`w-full py-3 px-4 flex justify-center items-center rounded-xl text-white text-lg font-medium shadow-md transition-all duration-300 ${
                  isValid 
                    ? 'bg-gradient-to-r from-violet-600 to-violet-800 hover:shadow-lg transform hover:-translate-y-1' 
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                Continue to Dashboard
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NameCollectionScreen;