import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import medibot_logo from '../assets/medibot_logo.jpg';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = auth.currentUser;
  
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/signin');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  // Don't show navigation on these pages
  if (['/signin', '/signup', '/verify-email', '/verification-required', '/forgot-password'].includes(location.pathname) || 
      location.pathname.startsWith('/reset-password')) {
    return null;
  }
  
  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-2.5 fixed w-full z-10 top-0 left-0 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <img src={medibot_logo} alt="Medibot" className="h-8 w-8 rounded-full mr-2" />
          <span className="text-lg font-bold">Medibot</span>
        </div>
        
        {currentUser && (
          <div className="flex items-center space-x-4">
            <Link 
              to="/user-profile" 
              className={`text-sm font-medium ${location.pathname === '/user-profile' ? 'text-black' : 'text-gray-600 hover:text-black'}`}
            >
              View Profile
            </Link>
            <Link 
              to="/health-dashboard" 
              className={`text-sm font-medium ${location.pathname === '/health-dashboard' ? 'text-black' : 'text-gray-600 hover:text-black'}`}
            >
              Dashboard
            </Link>
            <Link 
              to="/chat" 
              className={`text-sm font-medium ${location.pathname === '/chat' ? 'text-black' : 'text-gray-600 hover:text-black'}`}
            >
              Chat
            </Link>
            <button 
              onClick={handleSignOut}
              className="text-sm font-medium text-gray-600 hover:text-black"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;