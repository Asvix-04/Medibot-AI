import React from 'react';
import { Link } from 'react-router-dom';
import medibot_logo from '../../assets/medibot_logo.jpg';

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-br from-[#121212] to-[#1a1a1a] overflow-hidden pt-20">
      {/* Background pattern */}
      <div className="hidden lg:block lg:absolute lg:inset-0">
        <svg 
          className="absolute left-0 bottom-0 transform opacity-10"
          width="800" 
          height="800" 
          fill="none" 
          viewBox="0 0 800 800"
        >
          <circle cx="400" cy="400" r="350" stroke="#f75600" strokeWidth="2" />
          <circle cx="400" cy="400" r="250" stroke="#f75600" strokeWidth="2" />
          <circle cx="400" cy="400" r="150" stroke="#f75600" strokeWidth="2" />
        </svg>
      </div>
      
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:w-full lg:pb-28 xl:pb-32">
          {/* Logo section */}
          <div className="flex justify-center">
            <div className="flex items-center">
              <img
                className="h-16 w-16 rounded-full p-1 bg-white"
                src={medibot_logo}
                alt="Medibot"
              />
              <h1 className="ml-3 text-4xl font-bold" style={{ color: '#f75600' }}>Medibot</h1>
            </div>
          </div>
          
          <main className="mt-10 mx-auto max-w-screen-xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="text-center">
              <h2 className="text-4xl tracking-tight leading-10 font-bold text-[#d6d4d4] sm:text-5xl sm:leading-none md:text-6xl">
                Your AI-powered <br className="xl:hidden" />
                <span style={{ color: '#f75600' }}>health assistant</span>
              </h2>
              <p className="mt-3 text-base text-[#d6d4d4] sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl">
                Manage medications, track health metrics, schedule appointments, and receive personalized health insights—all in one secure platform.
              </p>
              <div className="mt-8 sm:mt-12 flex justify-center">
                <div className="rounded-md shadow mr-4">
                  <Link 
                    to="/signup" 
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-[#d6d4d4] transition duration-300 ease-in-out md:py-4 md:text-lg md:px-10"
                    style={{ backgroundColor: '#f75600' }}
                    onMouseOver={e => {e.currentTarget.style.backgroundColor = '#E2711D'}}
                    onMouseOut={e => {e.currentTarget.style.backgroundColor = '#f75600'}}
                  >
                    Get Started
                  </Link>
                </div>
                <div>
                  <Link 
                    to="/chat" 
                    className="w-full flex items-center justify-center px-8 py-3 border text-base leading-6 font-medium rounded-md transition duration-300 ease-in-out md:py-4 md:text-lg md:px-10"
                    style={{ 
                      color: '#d6d4d4',
                      borderColor: '#d6d4d4',
                      backgroundColor: 'transparent'
                    }}
                    onMouseOver={e => {e.currentTarget.style.backgroundColor = 'rgba(214, 212, 212, 0.1)'}}
                    onMouseOut={e => {e.currentTarget.style.backgroundColor = 'transparent'}}
                  >
                    Try Demo
                  </Link>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      
      {/* Wave divider */}
      <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 100" preserveAspectRatio="none">
        <path fill="#121212" d="M0,100 C240,40 480,80 720,80 C960,80 1200,40 1440,100 L1440,100 L0,100 Z"></path>
      </svg>
    </div>
  );
};

export default Hero;