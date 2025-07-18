import React from "react";

const Features = () => {
  const features = [
    {
      title: "Medication Management",
      description:
        "Never miss a dose with smart reminders and comprehensive medication tracking.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-purple-400"
          fill="none"
          aria-hidden="true"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
          />
        </svg>
      ),
    },
    {
      title: "Health Tracking",
      description:
        "Monitor vital metrics like blood pressure, heart rate, glucose levels, and more.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className="h-10 w-10 text-purple-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
    {
      title: "AI-Powered Insights",
      description:
        "Receive personalized health recommendations based on your data and medical best practices.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className="h-10 w-10 text-purple-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      ),
    },
    {
      title: "Appointment Scheduling",
      description:
        "Find and book appointments with healthcare providers and get timely reminders.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-purple-400"
          aria-hidden="true"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      title: "Medical Records",
      description:
        "Access your health history and share information securely with healthcare providers.",
      icon: (
        <svg
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-purple-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
    {
      title: "Health Chat Assistant",
      description:
        "Ask health questions and get evidence-based answers from our AI health assistant.",
      icon: (
        <svg
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-purple-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
      ),
    },
  ];

  return (
    <section
      aria-labelledby="features-heading"
      id="features"
      className="w-full max-w-7xl mx-auto px-6 py-20 relative"
      style={{ opacity: 1 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2
            id="features-heading"
            className="text-4xl md:text-5xl font-bold text-white"
          >
            Everything you need to manage your health
          </h2>
          <p
            className="mt-4 max-w-2xl text-xl mx-auto"
            style={{ color: "#d6d4d4" }}
          >
            Medibot combines powerful features into one intuitive platform to
            help you take control of your health journey.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              role="listitem"
              aria-label={`Feature: ${feature.title}`}
              key={index}
              className="transform transition-transform hover:translate-y-[-5px] relative p-8 rounded-xl duration-300 text-card-foreground bg-slate-800/50 backdrop-blur-sm border border-white/10 shadow-lg shadow-purple-500/5 hover:shadow-purple-500/10 h-full"
            >
              <div className="tracking-tight flex items-center space-x-3 text-white text-xl font-semibold">
                <div
                  className="p-2 bg-purple-500/10 rounded-lg"
                  style={{ color: "#6366f1" }}
                  aria-hidden="true"
                >
                  {feature.icon}
                </div>
                <span>{feature.title}</span>
              </div>
              <p className="p-6 pt-0 text-slate-300 text-base">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
