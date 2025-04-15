import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import medibot_logo from '../assets/medibot_logo.jpg';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase';

const Signin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [submitting, setSubmitting] = useState(false);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      console.log("Login successful!");
      navigate('/chat'); // Changed from '/profile' to '/chat'
      
    } catch (error) {
      console.error("Error signing in:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
        {}
        <div className="bg-black py-5 px-4 relative">
          <div className="flex justify-center">
            <img className="h-12 w-auto rounded-full p-1 bg-white" src={medibot_logo} alt="Medibot" />
          </div>
          <h1 className="mt-2 text-center text-2xl font-bold text-white">Medibot</h1>
          <p className="mt-1 text-center text-xs text-gray-400 max-w-sm mx-auto">
            AI-powered health insights. Trusted. Private. Secure.
          </p>
          
          {}
          <div className="absolute -bottom-3 left-0 right-0 h-6 bg-white" style={{
            clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 0 100%)',
            opacity: 0.1
          }}></div>
        </div>
        
        {}
        <div className="p-6 bg-white">
          <h2 className="text-center text-xl font-bold text-gray-900 mb-5">Sign in to your account</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {}
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
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="block w-full px-3 py-2 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-transparent"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <i className="bx bxs-envelope text-gray-400 text-sm"></i>
                </div>
              </div>
            </div>
            
            {}
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
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="block w-full px-3 py-2 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-transparent"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <i className="bx bxs-lock-alt text-gray-400 text-sm"></i>
                </div>
              </div>
            </div>
            
            {}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-3.5 w-3.5 text-black focus:ring-1 focus:ring-black border-gray-300 rounded"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-xs text-gray-700">
                  Remember me
                </label>
              </div>
              
              <div className="text-xs">
                <Link to="/forgot-password" className="font-medium text-black hover:text-gray-800">
                  Forgot your password?
                </Link>
              </div>
            </div>
            
            {}
            <div className="mt-5">
              <button
                type="submit"
                disabled={submitting}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-black disabled:opacity-70"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <i className="bx bxs-lock-alt h-4 w-4 text-gray-500 group-hover:text-gray-400"></i>
                </span>
                {submitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>
          </form>
          
          {}
          <div className="mt-5 text-center">
            <p className="text-xs text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-black hover:text-gray-800">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;