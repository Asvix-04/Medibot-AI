import React from 'react';

const Benefits = () => {
  const benefits = [
    {
      title: 'Save Time',
      description: 'Spend less time managing your health records and more time focusing on what matters to you.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'Reduce Stress',
      description: 'Eliminate the worry of forgotten medications or missed appointments with automatic reminders.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'Better Health Decisions',
      description: 'Make informed choices with data-driven insights and evidence-based recommendations.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      title: 'Health Trends',
      description: 'Visualize your health progress over time with intuitive charts and analytics.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
      )
    },
  ];

  return (
    <section className="py-20 relative" style={{ background: 'linear-gradient(135deg, #121212 0%, #1a1a1a 100%)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold sm:text-4xl" style={{ color: '#f75600' }}>
            Benefits of Using Medibot
          </h2>
          <p className="mt-4 max-w-2xl text-xl mx-auto" style={{ color: '#d6d4d4' }}>
            Experience how Medibot can transform your healthcare journey.
          </p>
        </div>

        <div className="mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center h-20 w-20 rounded-full mb-6" 
                   style={{ backgroundColor: 'rgba(247, 86, 0, 0.15)' }}>
                <div style={{ color: '#f75600' }}>
                  {benefit.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: '#E2711D' }}>{benefit.title}</h3>
              <p style={{ color: '#d6d4d4' }}>{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Wave divider */}
      <svg className="absolute w-full bottom-0" style={{ marginBottom: '-1px' }} viewBox="0 0 1440 100" preserveAspectRatio="none">
        <path fill="#121212" d="M0,0 C240,60 480,100 720,80 C960,60 1200,0 1440,40 L1440,100 L0,100 Z"></path>
      </svg>
    </section>
  );
};

export default Benefits;