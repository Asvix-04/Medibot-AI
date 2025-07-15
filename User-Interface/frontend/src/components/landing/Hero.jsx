import React from 'react';
import { Link } from 'react-router-dom';
import medibot_logo from '../../assets/medibot_logo.jpg';

const Hero = () => {
  return (
    <div className="relative py-12 md:pt-36 lg:pb-24 overflow-hidden">
      {/* Background pattern */}
      <div className='absolute inset-0'>
        <svg
          className="absolute top-0 left-0 w-full h-full"
          preserveAspectRatio="none"
          viewBox="0 0 1440 800"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#6b21a8', stopOpacity: 0.1 }} />
              <stop offset="100%" style={{ stopColor: '#3b0764', stopOpacity: 0.1 }} />
            </linearGradient>
          </defs>
          <path
            d="M0,0 C300,100 600,50 900,150 C1200,250 1440,200 1440,400 V800 H0 Z"
            fill="url(#gradient)"
          />
        </svg>
      </div>

      <div className="relative py-12 md:pt-20 lg:pb-24 overflow-hidden">
        <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:w-full lg:pb-28 xl:pb-32">
          {/* Logo section */}
          <div className="flex justify-center">
            <div className="flex items-center">
              <img
                className="h-16 w-16 rounded-full p-1 bg-white"
                src={medibot_logo}
                alt="Medibot"
              />
              <h1 className="ml-3 text-4xl font-bold" style={{ color: 'white' }}>Medibot</h1>
            </div>
          </div>

          <main className="mt-10 mx-auto max-w-screen-xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="text-center">
              <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl" style={{ opacity: "1", transform: "none" }}>
                Your AI-powered health assistant
              </h2>
              <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-300 " style={{ opacity: "1", transform: "none" }}>
                Manage medications, track health metrics, schedule appointments, and receive personalized health insights—all in one secure platform.
              </p>
              <div className="mt-8 sm:mt-12 flex justify-center">
                <div className="rounded-md shadow mr-4" style={{opacity: "1", transform: "none"}}>
                  <Link
                    to="/signup"
                    className="justify-center gap-2 whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-10 inline-flex items-center px-6 py-3 border text-base font-medium rounded-full shadow-sm text-white bg-[#1a103d] border-[#a970ff] hover:bg-[#1a103d] hover:border-[#a970ff] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#a970ff]"
                  >
                    Get Started
                  </Link>
                </div>
                <div className="rounded-md shadow mr-4" style={{opacity: "1", transform: "none"}}>
                  <Link
                    to="/chat"
                    className="justify-center gap-2 whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-10 inline-flex items-center px-6 py-3 border border-[#a970ff] text-base font-medium rounded-full text-white bg-transparent hover:bg-[#1a103d] hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#a970ff]"
                  >
                    Try Demo
                  </Link>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Hero;