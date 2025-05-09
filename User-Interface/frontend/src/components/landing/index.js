import React from 'react';
import Header from './Header';
import Hero from './Hero';
import Features from './Features';
import About from './About';
import HowItWorks from './HowItWorks';
import Benefits from './Benefits';
import Testimonials from './Testimonials';
import Integration from './Integration';
import FAQ from './FAQ';
import CallToAction from './CallToAction';
import Footer from './Footer';

const LandingPage = () => {
  return (
    <div className="landing-page overflow-hidden">
      <Header />
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
        <Footer />
      </div>
    </div>
  );
};

export default LandingPage;