import React from 'react';
import Hero from './Hero';
import Features from './Features';
import About from './About';
import HowItWorks from './HowItWorks';
import Benefits from './Benefits';
import Testimonials from './Testimonials';
import Integration from './Integration';
import FAQ from './FAQ';
import CallToAction from './CallToAction';

const LandingPage = () => {
  return (
    <div className="landing-page min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-900 text-white flex flex-col items-center justify-start overflow-x-hidden">
      <div className='fixed inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-20 left-10 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl'></div>
        <div className='absolute bottom-20 right-10 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl'></div>
      </div>
      <div className="mt-0 pt-0">
        <Hero />
        <About />
        <Features />
        <HowItWorks />
        <Benefits />
        <Testimonials />
        <Integration />
        <FAQ />
        <CallToAction />
      </div>
    </div>
  );
};

export default LandingPage;