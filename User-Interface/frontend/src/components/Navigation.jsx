import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import medibot_logo from '../assets/medibot_logo.jpg';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = auth.currentUser;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/signin');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const excludedRoutes = [
    '/signin', '/signup', '/verify-email',
    '/verification-required', '/forgot-password'
  ];
  if (
    excludedRoutes.includes(location.pathname) ||
    location.pathname.startsWith('/reset-password')
  ) {
    return null;
  }

  const getLinkClass = (path) => {
    const baseClasses = "text-sm font-medium px-3 py-2 rounded-md transition-all duration-200";
    if (location.pathname === path) {
      return `${baseClasses} bg-gradient-to-r from-violet-50 to-violet-100 text-violet-700 border-b-2 border-violet-500`;
    }
    return `${baseClasses} text-gray-600 hover:text-violet-700 hover:bg-violet-50`;
  };

  return (
    <nav className="bg-white bg-opacity-95 backdrop-blur-sm border-b border-violet-100 px-4 py-2 fixed w-full z-10 top-0 left-0 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center group">
          <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-violet-100 group-hover:border-violet-200 transition-all duration-200 shadow-sm">
            <img src={medibot_logo} alt="Medibot" className="h-full w-full object-cover" />
          </div>
          <div className="ml-2">
            <span className="text-lg font-bold text-gray-800">Medibot</span>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full ml-1 bg-gradient-to-r from-violet-500 to-indigo-600 text-white">
              AI
            </span>
          </div>
        </Link>

        {/* Hamburger menu for mobile */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-700 hover:text-violet-700 focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Desktop Nav Links */}
        {currentUser && (
          <div className="hidden md:flex items-center space-x-2">
            <Link to="/user-profile" className={getLinkClass('/user-profile')}>
              <span className="flex items-center">
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profile
              </span>
            </Link>

            <Link to="/health-dashboard" className={getLinkClass('/health-dashboard')}>
              <span className="flex items-center">
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Dashboard
              </span>
            </Link>

            <Link to="/chat" className={getLinkClass('/chat')}>
              <span className="flex items-center">
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Chat
              </span>
            </Link>

            <button
              onClick={handleSignOut}
              className="text-sm font-medium px-3 py-2 rounded-md text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200 ml-2 flex items-center"
            >
              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>
        )}
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && currentUser && (
        <div className="md:hidden bg-white border-t border-violet-100 shadow-sm px-4 py-2 space-y-2">
          <Link to="/user-profile" className={getLinkClass('/user-profile')} onClick={() => setIsMenuOpen(false)}>Profile</Link>
          <Link to="/health-dashboard" className={getLinkClass('/health-dashboard')} onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
          <Link to="/chat" className={getLinkClass('/chat')} onClick={() => setIsMenuOpen(false)}>Chat</Link>
          <button
            onClick={() => {
              setIsMenuOpen(false);
              handleSignOut();
            }}
            className="block w-full text-left text-sm font-medium px-3 py-2 rounded-md text-gray-600 hover:text-red-600 hover:bg-red-50"
          >
            Sign Out
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navigation;