import React from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

const BasePlanToastContainer = ({ onClose, darkMode,isBackgroundBlur }) => {
  const navigate = useNavigate();

  const handleBasicClick = () => {
    localStorage.setItem("plan", "free");
    navigate("/health-dashboard");
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 dark:bg-black/60 bg-slate-300 backdrop-blur-sm z-40 animate-fadeIn"></div>
      <div className={`${isBackgroundBlur ? "fixed inset-0 min-h-screen flex items-center justify-center z-50 p-4 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" : ""}`}>
        <div className="toastcontainer dark:bg-gradient-to-br from-[#0d1117] to-[#161b22] dark:text-white bg-white w-full max-w-md rounded-2xl shadow-xl p-6 border border-gray-700 space-y-6 animate-scaleIn">

          <div className="text-center space-y-1">
            <h2 className="text-3xl font-extrabold text-blue-400">Base Plan</h2>
            <p className="dark:text-gray-100 text-gray-600 text-sm">Free Users</p>
          </div>

          <ul className="space-y-4 text-sm sm:text-base">
            {[
              "Multilingual Support: Communicate in multiple languages with ease.",
              "Text to Speech: Converts written text into natural-sounding speech.",
              "Speech to Text: Converts spoken words into accurate text in real-time.",
              "Speech to Speech Translation: Talk in one language and get translated audio in another.",
              "Multimodal AI (Free Models): Uses open-source AI models for smart, responsive interactions.",
              "Visual Accessibility (ARIA Support): Designed to support visually impaired users with screen-reader and navigation-friendly features.",
            ].map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 dark:text-gray-100 text-gray-600 leading-relaxed">
                <FaCheckCircle className="text-green-500 min-w-[20px] mt-1" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-[#21262d] hover:bg-[#30363d] text-gray-300 rounded-lg py-3 font-semibold transition"
            >
              Cancel
            </button>
            <button
              onClick={handleBasicClick}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 font-semibold transition"
            >
              Choose Free
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BasePlanToastContainer;
