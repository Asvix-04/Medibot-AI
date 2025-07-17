import React, { useState } from "react";

const FAQ = () => {
  const faqs = [
    {
      question: "Is my health data secure with Medibot?",
      answer:
        "Yes, we take your privacy seriously. Medibot is fully HIPAA-compliant and uses end-to-end encryption to protect your health information. Your data is never sold to third parties and is only used to provide you with personalized health insights.",
    },
    {
      question: "Can Medibot replace my doctor?",
      answer:
        "No, Medibot is designed to complement your healthcare providers, not replace them. While our AI provides evidence-based information and insights, it should not be used for diagnosis or as a substitute for professional medical advice, diagnosis, or treatment.",
    },
    {
      question: "How does medication tracking work?",
      answer:
        "Medibot allows you to input your medications including name, dosage, frequency, and schedule. The app then sends you timely reminders, tracks your adherence, and alerts you when refills are needed. You can also record side effects and effectiveness to discuss with your doctor.",
    },
    {
      question: "What health metrics can I track?",
      answer:
        "You can track a wide range of health metrics including blood pressure, heart rate, blood glucose, weight, temperature, oxygen saturation, and sleep. Medibot visualizes trends over time and provides insights into how these metrics relate to each other.",
    },
    {
      question: "Is there a cost to use Medibot?",
      answer:
        "Medibot offers both free and premium subscription options. The free version includes basic medication tracking and health logging. Premium subscribers get advanced features like health insights, integration with medical devices, and unlimited metric tracking.",
    },
    {
      question: "Can I share my health data with my doctor?",
      answer:
        "Yes, Medibot makes it easy to share your health data with healthcare providers. You can generate comprehensive reports of your medications, adherence, and health metrics to bring to appointments or share electronically with your care team.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="py-20 w-full max-w-7xl mx-auto px-6"
      style={{ opacity: 1 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left">
          <h2 className="text-3xl font-extrabold sm:text-4xl text-white">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 max-w-2xl text-xl" style={{ color: "#d6d4d4" }}>
            Everything you need to know about Medibot.
          </p>
        </div>

        <div className="mt-12 max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="mb-4">
              <button
                // aria added for accessibility
                id={`faq-button-${index}`}
                type="button"
                aria-expanded={openIndex === index}
                aria-controls={`faq-content-${index}`}
                className="flex justify-between items-center w-full px-6 py-4 text-left rounded-lg focus:outline-none transition-colors duration-200"
                style={{
                  backgroundColor:
                    openIndex === index ? "#7c3aed" : "#00000080",
                  color: "#d6d4d4",
                }}
                onClick={() => toggleFaq(index)}
                onMouseOver={(e) => {
                  if (openIndex !== index) {
                    e.currentTarget.style.backgroundColor = "#8b5cf6";
                  }
                }}
                onMouseOut={(e) => {
                  if (openIndex !== index) {
                    e.currentTarget.style.backgroundColor = "#00000080";
                  }
                }}
              >
                <span className="text-lg font-medium">{faq.question}</span>
                <svg
                  className={`w-5 h-5 transition-transform ${
                    openIndex === index ? "transform rotate-180" : ""
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {openIndex === index && (
                <div
                  id={`faq-content-${index}`}
                  role="region"
                  aria-labelledby={`faq-button-${index}`}
                  className="px-6 py-4 rounded-b-lg"
                  style={{ backgroundColor: "#262626" }}
                >
                  <p style={{ color: "#d6d4d4" }}>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p style={{ color: "#d6d4d4" }}>
            Still have questions?{" "}
            <a
              href="#contact"
              className="font-medium hover:underline text-purple-400"
              onMouseOver={(e) => (e.target.style.color = "#6366f1")}
              onMouseOut={(e) => (e.target.style.color = "#7c3aed")}
            >
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
