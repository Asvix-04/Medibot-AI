import React from "react";

const About = () => {
  const aboutFeatures = [
    {
      title: "Smart Diagnosis",
      description:
        "Analyze symptoms and get real-time health insights using AI-powered medical intelligence.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          role="img"
          aria-label="Smart Diagnosis Icon"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 9v3m0 0v3m0-3h3m-3 0H9"
          />
        </svg>
      ),
    },
    {
      title: "Medication Tracker",
      description:
        "Never miss a dose. Schedule reminders, track your intake, and manage prescriptions effortlessly.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          role="img"
          aria-label="Medication Tracker Icon"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 9v2m0 4h.01"
          />
        </svg>
      ),
    },
    {
      title: "24/7 Health Chatbot",
      description:
        "Get immediate answers to your health questions anytime, anywhere with our AI-powered health assistant.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          role="img"
          aria-label="Health Chatbot Icon"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
      ),
    },
    {
      title: "Personal Health Dashboard",
      description:
        "View your health metrics at a glance with customizable dashboards tailored to your specific needs.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          role="img"
          aria-label="Personal Health Dashboard Icon"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
  ];

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="w-full py-20 bg-gradient from-slate-900/50 via-purple-950/20 to-slate-950/50"
      style={{ opacity: 1 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2
            id="about-heading"
            className="text-4xl md:text-5xl font-bold text-white"
          >
            Transforming Healthcare with AI
          </h2>
          <p
            className="mt-4 text-lg text-slate-300 max-w-2xl mx-auto"
            aria-describedby="about-heading"
          >
            We're on a mission to make healthcare more accessible, personalized,
            and effective through the power of artificial intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {aboutFeatures.map((feature, index) => (
            <div
              key={index}
              role="group"
              aria-labelledby={`feature-title-${index}`}
              aria-describedby={`feature-desc-${index}`}
              className="flex flex-col md:flex-row items-center text-center md:text-left"
            >
              <div
                className="flex-shrink-0 flex items-center justify-center h-24 w-24 rounded-full mb-6 md:mb-0 md:mr-6 text-purple-400"
                style={{ background: "rgba(99, 102, 241, 0.15)" }}
              >
                {feature.icon}
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-lg" style={{ color: "#d6d4d4" }}>
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <p
            className="text-xl max-w-3xl mx-auto"
            style={{ color: "#d6d4d4" }}
            aria-label="AI healthcare mission statement"
          >
            Medibot combines medical expertise with cutting-edge AI technology
            to provide you with personalized healthcare guidance whenever you
            need it.
          </p>
          <div className="mt-8">
            <a
              href="#features"
              role="button"
              aria-label="Explore features section"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 py-2 px-6 bg-[#1a103d] text-white border border-[#a970ff] rounded-full font-medium shadow-none hover:bg-[#1a103d] hover:border-[#a970ff] hover:text-white w-60 h-14 text-lg"
            >
              Explore Our Features
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="ml-2 h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
