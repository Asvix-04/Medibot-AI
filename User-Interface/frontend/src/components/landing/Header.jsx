import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import medibot_logo from '../../assets/medibot_logo.jpg';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-[#121212] shadow-lg' : 'bg-[#121212]/80'
      }`}
      style={{ minHeight: 72, backdropFilter: 'blur(8px)' }}
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-18" style={{ height: 72 }}>
        <Link to="/" className="flex items-center">
          <img src={medibot_logo} alt="Medibot" className="h-10 w-10 rounded-full p-1 bg-white" />
          <span className="ml-2 text-2xl font-bold text-[#6366f1]">Medibot</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-10">
          <Link to="/" className="text-[#d6d4d4] hover:text-white transition-colors">
            Home
          </Link>
          <a href="#features" className="text-[#d6d4d4] hover:text-white transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="text-[#d6d4d4] hover:text-white transition-colors">
            How It Works
          </a>
          <a href="#about" className="text-[#d6d4d4] hover:text-white transition-colors">
            About
          </a>
          <a href="#faq" className="text-[#d6d4d4] hover:text-white transition-colors">
            FAQ
          </a>
        </nav>

        {/* Sign In/Sign Up Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <Link 
            to="/signin" 
            className="px-4 py-2 border border-[#d6d4d4] rounded-md text-[#d6d4d4] hover:bg-[#d6d4d4] hover:bg-opacity-10 transition-colors"
          >
            Sign In
          </Link>
          <Link 
            to="/signup" 
            className="px-4 py-2 rounded-md text-[#d6d4d4] bg-[#6366f1] hover:bg-[#4f46e5] transition-colors"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile menu button */}
        <button 
          className="md:hidden text-[#d6d4d4]"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'} mt-4`}>
        <div className="flex flex-col space-y-4 py-2">
          <Link to="/" className="text-[#d6d4d4] hover:text-white px-4 py-2 rounded-md">
            Home
          </Link>
          <a href="#features" className="text-[#d6d4d4] hover:text-white px-4 py-2 rounded-md">
            Features
          </a>
          <a href="#how-it-works" className="text-[#d6d4d4] hover:text-white px-4 py-2 rounded-md">
            How It Works
          </a>
          <a href="#about" className="text-[#d6d4d4] hover:text-white px-4 py-2 rounded-md">
            About
          </a>
          <a href="#faq" className="text-[#d6d4d4] hover:text-white px-4 py-2 rounded-md">
            FAQ
          </a>
          <div className="flex flex-col space-y-2 pt-4 border-t border-[#2a2a2a]">
            <Link to="/signin" className="text-[#d6d4d4] hover:text-white px-4 py-2 rounded-md">
              Sign In
            </Link>
            <Link to="/signup" className="bg-[#f75600] text-[#d6d4d4] px-4 py-2 rounded-md hover:bg-[#E2711D]">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;