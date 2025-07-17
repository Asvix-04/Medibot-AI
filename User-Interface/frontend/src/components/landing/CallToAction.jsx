import React from "react";
import { Link } from "react-router-dom";
import callToActionImage from "../../assets/calltoaction.jpg";

const CallToAction = () => {
  return (
    <section
      id="call-to-action"
      style={{ opacity: 1 }}
      aria-labelledby="cta-heading"
      className="py-20 mb-2 relative overflow-hidden w-full bg-gradient-to-br from-slate-900/50 via-purple-950/20 to-slate-950/50"
    >
      {/* Background pattern overlay */}
      <div className="absolute inset-0 z-0 opacity-10" aria-hidden="true">
        {/* SVG pattern for background */}
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 800 800"
        >
          <path
            fill="none"
            stroke="white"
            strokeWidth="1.5"
            d="M769 229L1037 260.9M927 880L731 737 520 660 309 538 40 599 295 764 126.5 879.5 40 599-197 493 102 382-31 229 126.5 79.5-69-63"
          />
          <path
            fill="none"
            stroke="white"
            strokeWidth="1.5"
            d="M-31 229L237 261 390 382 603 493 308.5 537.5 101.5 381.5M370 905L295 764"
          />
          <path
            fill="none"
            stroke="white"
            strokeWidth="1.5"
            d="M520 660L578 842 731 737 840 599 603 493 520 660 295 764 309 538 390 382 539 269 769 229 577.5 41.5 370 105 295 -36 126.5 79.5 237 261 102 382 40 599 -69 737 127 880"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="lg:flex lg:items-center lg:justify-between">
          <div className="lg:w-1/2">
            <h2
              id="cta-heading"
              className="text-3xl font-extrabold sm:text-4xl text-left text-white"
            >
              Take Control of Your Health Journey
            </h2>
            <p
              id="cta-description"
              className="mt-4 text-xl text-left"
              style={{ color: "#d6d4d4", opacity: 0.9 }}
            >
              Join thousands of users already experiencing smarter healthcare
              management with Medibot's AI-powered platform.
            </p>
            <div
              role="group"
              aria-label="Call to action buttons"
              className="mt-8 gap-4 flex flex-col sm:flex-row sm:items-center"
            >
              <Link
                to="/signup"
                aria-label="Start your health journey by signing up"
                className=" px-8 py-2 justify-center gap-2 whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-10 inline-flex items-centers border text-base font-medium rounded-full shadow-sm text-white bg-[#1a103d] border-[#a970ff] hover:bg-[#1a103d] hover:border-[#a970ff] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#a970ff]"
              >
                Start Your Health Journey
              </Link>
              <Link
                to="/chat"
                aria-label="Try AI chat demo"
                className="justify-center gap-2 whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-10 inline-flex items-center px-8 py-4 border border-[#a970ff] text-base font-medium rounded-full text-white bg-transparent hover:bg-[#1a103d] hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#a970ff]"
              >
                Try AI Chat Demo
              </Link>
            </div>

            {/* Feature list */}
            <div
              role="list"
              aria-labelledby="features-heading"
              className="mt-10 bg-black bg-opacity-20 p-6 rounded-xl backdrop-blur-sm"
            >
              <h3
                id="features-heading"
                className="text-lg font-bold mb-4 text-left"
                style={{ color: "#d6d4d4" }}
              >
                What you'll get:
              </h3>
              <ul className="space-y-4">
                {[
                  "Smart symptom analysis and health insights",
                  "Medication tracking with smart reminders",
                  "24/7 AI health assistant",
                  "Personalized health dashboard",
                ].map((item, index) => (
                  <li key={index} className="flex items-center">
                    <svg
                      className="h-5 w-5 mr-2"
                      style={{ color: "#7c3aed" }}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      role="img"
                      aria-label="Check icon"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span style={{ color: "#d6d4d4" }}>{item}</span>
                  </li>
                ))}
              </ul>
              <p
                className="mt-6 text-sm"
                style={{ color: "#d6d4d4", opacity: 0.8 }}
                aria-label="No credit card required. Get started for free."
              >
                No credit card required. Get started for free.
              </p>
            </div>
          </div>

          {/* Image container */}
          <div className="mt-12 lg:mt-0 lg:w-1/2 flex justify-center lg:justify-end">
            <div
              className="rounded-2xl overflow-hidden shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-300 border-4"
              style={{ borderColor: "rgba(214, 212, 212, 0.2)" }}
            >
              <img
                src={callToActionImage}
                alt="Healthcare professional using Medibot"
                className="w-full h-auto max-w-md object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
