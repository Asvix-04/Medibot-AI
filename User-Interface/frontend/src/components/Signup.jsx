import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import medibot_logo from '../assets/medibot_logo.jpg';

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    userType: 'Patient'
  });
  
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordMatch, setPasswordMatch] = useState(true);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
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
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
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
          <h2 className="text-center text-xl font-bold text-gray-900 mb-4">Create your account</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {}
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
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="block w-full px-3 py-2 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-transparent"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <i className="bx bxs-lock-alt text-gray-400 text-sm"></i>
                </div>
              </div>
              
              {}
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
            
            {}
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
            
            {}
            <div className="grid grid-cols-2 gap-4">
              {}
              <div>
                <label htmlFor="phoneNumber" className="block text-xs font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <div className="relative rounded-md">
                  <input
                    type="tel"
                    name="phoneNumber"
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4567"
                    className="block w-full px-3 py-2 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-transparent"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <i className="bx bx-phone text-gray-400 text-sm"></i>
                  </div>
                </div>
              </div>
              
              {}
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
            
            {}
            <div className="mt-3">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    className="focus:ring-1 focus:ring-black h-3.5 w-3.5 text-black border-gray-300 rounded"
                  />
                </div>
                <div className="ml-2 text-xs">
                  <label htmlFor="terms" className="font-medium text-gray-700">
                    I agree to the{" "}
                    <Link to="/terms" className="text-black hover:underline">Terms of Service</Link>
                    {" "}and{" "}
                    <Link to="/privacy" className="text-black hover:underline">Privacy Policy</Link>
                  </label>
                </div>
              </div>
            </div>
            
            {}
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
          
          {}
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