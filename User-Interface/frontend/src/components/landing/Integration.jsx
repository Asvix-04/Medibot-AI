import React from "react";

const Integration = () => {
  const integrations = [
    { name: "Electronic Health Records", delay: "0" },
    { name: "Pharmacy Systems", delay: "100" },
    { name: "Fitness Trackers", delay: "200" },
    { name: "Mobile Health Apps", delay: "300" },
    { name: "Telemedicine Platforms", delay: "400" },
    { name: "Medical Devices", delay: "500" },
  ];

  return (
    <section
      aria-labelledby="integration-heading"
      className="py-20 relative overflow-hidden w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      style={{ opacity: 1 }}
    >
      <div className="relative z-10">
        <div className="text-center md:text-left">
          <h2
            id="integration-heading"
            className="text-3xl font-extrabold sm:text-4xl text-white"
          >
            Seamless Integrations
          </h2>
          <p
            className="mt-4 max-w-2xl text-xl mx-auto md:mx-0"
            style={{ color: "#d6d4d4" }}
            role="doc-subtitle"
          >
            Medibot works with your existing health technology ecosystem.
          </p>
        </div>

        <div className="mt-16">
          <div
            role="region"
            aria-label="List of healthcare system integrations"
            className="relative rounded-xl shadow-xl p-6 sm:p-8 md:p-12 overflow-hidden w-full bg-slate-800/50 backdrop-blur-sm border border-white/10 shadow-purple-500/5"
          >
            <div
              role="list"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8"
            >
              {integrations.map((integration, index) => (
                <div
                  role="listitem"
                  key={index}
                  className="flex items-center space-x-4"
                  data-aos="fade-up"
                  data-aos-delay={integration.delay}
                >
                  <div
                    aria-hidden="true"
                    className="flex-shrink-0 h-12 w-12 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-purple-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span
                    style={{ color: "#d6d4d4" }}
                    className="font-medium text-sm sm:text-base"
                  >
                    {integration.name}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <p
                id="integration-description"
                style={{ color: "#d6d4d4", opacity: 0.8 }}
                className="mb-6 text-sm sm:text-base"
              >
                Secure, HIPAA-compliant connections with your healthcare
                providers.
              </p>
              <button
                aria-label="Learn more about Medibot's integrations"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap py-2 px-6 text-white border border-[#a970ff] rounded-full font-medium bg-[#1a103d] hover:bg-[#1a103d] hover:border-[#a970ff] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#a970ff] text-sm sm:text-lg"
              >
                Learn about integrations
                <svg
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-2 h-4 w-4 sm:h-5 sm:w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div
        className="absolute top-0 right-0 -mt-20 -mr-20 hidden lg:block"
        aria-hidden="true"
      >
        <svg width="404" height="404" fill="none" viewBox="0 0 404 404">
          <defs>
            <pattern
              id="integration-pattern"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <rect
                width="4"
                height="4"
                fill="currentColor"
                style={{ color: "#6366f1", opacity: 0.1 }}
              />
            </pattern>
          </defs>
          <rect width="404" height="404" fill="url(#integration-pattern)" />
        </svg>
      </div>
    </section>
  );
};

export default Integration;
