import React from 'react';
import FAQ from '../landing/FAQ';

const FAQPage = ({ darkMode = false }) => {
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="container mx-auto pt-8 px-4">
        <FAQ accentColor="#8b5cf6" />
      </div>
    </div>
  );
};

export default FAQPage;