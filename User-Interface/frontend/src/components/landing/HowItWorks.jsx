import React from 'react';
import step1Image from '../../assets/step1Image.jpg';
import step2Image from '../../assets/step2Image.jpg';
import step3Image from '../../assets/step3Image.jpg';
import step4Image from '../../assets/step4Image.jpg';



const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      title: 'Create Your Profile',
      description: 'Sign up and complete your health profile with basic information to get personalized recommendations.',
      image: step1Image,
    },
    {
      number: '02',
      title: 'Track Your Health',
      description: 'Add your medications, record health metrics, and manage your appointments all in one place.',
      image: step2Image,
    },
    {
      number: '03',
      title: 'Receive Insights',
      description: 'Get AI-powered health insights, medication reminders, and appointment notifications.',
      image: step3Image,
    },
    {
      number: '04',
      title: 'Improve Your Health',
      description: 'Use Medibot\'s recommendations to make informed health decisions and achieve your goals.',
      image: step4Image,
    },
  ];

  return (
    <section id="how-it-works" className="w-full py-20 bg-gradient-to-br from-slate-900/50 via-purple-950/20 to-slate-950/50" style={{ opacity: 1 }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white ">
            How Medibot Works
          </h2>
          <p className="mt-4 text-lg text-slate-300 max-w-2xl mx-auto">
            Your journey to better health management in four simple steps.
          </p>
        </div>

        <div className="mt-16">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex flex-col md:flex-row items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''
                } mb-16 last:mb-0`}
            >
              <div className="md:w-1/3 mb-8 md:mb-0">
                <div className="bg-[#1a1a1a] p-2 rounded-xl shadow-md border border-[#2a2a2a]">
                  <img
                    src={step.image}
                    alt={`Step ${step.number}: ${step.title}`}
                    className="h-auto object-cover w-[700px] rounded-xl"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/600x400?text=Step+' + step.number;
                    }}
                  />
                </div>
              </div>

              <div className={`md:w-1/2 ${index % 2 === 1 ? 'md:pr-12' : 'md:pl-12'}`}>
                <div className="inline-block rounded-full text-purple-400 bg-opacity-10 px-3 py-1 text-sm font-semibold mb-4">
                  Step {step.number}
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-lg text-slate-300">
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
