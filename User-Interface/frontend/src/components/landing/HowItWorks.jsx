import React from 'react';

const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      title: 'Create Your Profile',
      description: 'Sign up and complete your health profile with basic information to get personalized recommendations.',
      image: 'https://via.placeholder.com/600x400?text=Create+Your+Profile',
    },
    {
      number: '02',
      title: 'Track Your Health',
      description: 'Add your medications, record health metrics, and manage your appointments all in one place.',
      image: 'https://via.placeholder.com/600x400?text=Track+Your+Health',
    },
    {
      number: '03',
      title: 'Receive Insights',
      description: 'Get AI-powered health insights, medication reminders, and appointment notifications.',
      image: 'https://via.placeholder.com/600x400?text=Receive+Insights',
    },
    {
      number: '04',
      title: 'Improve Your Health',
      description: 'Use Medibot\'s recommendations to make informed health decisions and achieve your goals.',
      image: 'https://via.placeholder.com/600x400?text=Improve+Your+Health',
    },
  ];

  return (
    <section id="how-it-works" className="py-20" style={{ background: '#121212' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold sm:text-4xl" style={{ color: '#f75600' }}>
            How Medibot Works
          </h2>
          <p className="mt-4 max-w-2xl text-xl mx-auto" style={{ color: '#d6d4d4' }}>
            Your journey to better health management in four simple steps.
          </p>
        </div>

        <div className="mt-16">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className={`flex flex-col md:flex-row items-center ${
                index % 2 === 1 ? 'md:flex-row-reverse' : ''
              } mb-16 last:mb-0`}
            >
              <div className="md:w-1/2 mb-8 md:mb-0">
                <div className="bg-[#1a1a1a] p-2 rounded-xl shadow-lg border border-[#2a2a2a]">
                  {/* Replace placeholder with actual image */}
                  <img
                    src={step.image}
                    alt={`Step ${step.number}: ${step.title}`}
                    className="w-full h-auto rounded-lg object-cover"
                    onError={(e) => {
                      // Fallback if image fails to load
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/600x400?text=Step+' + step.number;
                    }}
                  />
                </div>
              </div>
              
              <div className={`md:w-1/2 ${index % 2 === 1 ? 'md:pr-12' : 'md:pl-12'}`}>
                <div className="inline-block rounded-full bg-[#f75600] bg-opacity-10 px-3 py-1 text-sm font-semibold mb-4" style={{ color: '#f75600' }}>
                  Step {step.number}
                </div>
                <h3 className="text-2xl font-bold mb-4" style={{ color: '#E2711D' }}>
                  {step.title}
                </h3>
                <p className="text-lg" style={{ color: '#d6d4d4' }}>
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;