import React from 'react';

const Integration = () => {
  const integrations = [
    { name: 'Electronic Health Records', delay: '0' },
    { name: 'Pharmacy Systems', delay: '100' },
    { name: 'Fitness Trackers', delay: '200' },
    { name: 'Mobile Health Apps', delay: '300' },
    { name: 'Telemedicine Platforms', delay: '400' },
    { name: 'Medical Devices', delay: '500' },
  ];

  return (
    <section className="py-20 relative overflow-hidden" style={{ background: '#121212' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold sm:text-4xl" style={{ color: '#f75600' }}>
            Seamless Integrations
          </h2>
          <p className="mt-4 max-w-2xl text-xl mx-auto" style={{ color: '#d6d4d4' }}>
            Medibot works with your existing health technology ecosystem.
          </p>
        </div>

        <div className="mt-16">
          <div className="relative rounded-xl shadow-xl p-8 md:p-12" style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a' }}>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              {integrations.map((integration, index) => (
                <div key={index} className="flex items-center space-x-4" data-aos="fade-up" data-aos-delay={integration.delay}>
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-opacity-10 flex items-center justify-center" 
                       style={{ backgroundColor: 'rgba(247, 86, 0, 0.15)' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                         style={{ color: '#f75600' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span style={{ color: '#d6d4d4' }} className="font-medium">{integration.name}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <p style={{ color: '#d6d4d4', opacity: 0.8 }} className="mb-6">
                Secure, HIPAA-compliant connections with your healthcare providers.
              </p>
              <button 
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md transition-colors duration-200"
                style={{ backgroundColor: '#f75600', color: '#d6d4d4' }}
                onMouseOver={e => {e.currentTarget.style.backgroundColor = '#E2711D'}}
                onMouseOut={e => {e.currentTarget.style.backgroundColor = '#f75600'}}
              >
                Learn about integrations
                <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 hidden lg:block">
        <svg width="404" height="404" fill="none" viewBox="0 0 404 404">
          <defs>
            <pattern id="integration-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="4" height="4" fill="currentColor" className="opacity-10" style={{ color: '#f75600' }} />
            </pattern>
          </defs>
          <rect width="404" height="404" fill="url(#integration-pattern)" />
        </svg>
      </div>
    </section>
  );
};

export default Integration;