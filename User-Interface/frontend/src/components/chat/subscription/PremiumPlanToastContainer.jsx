import React from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

const PremiumPlanToastContainer = ({ onClose, darkMode, isBackgroundBlur }) => {
  const navigate = useNavigate();

  const handlePremiumClick = () => {
    localStorage.setItem("plan", "premium");
    navigate("/payment");
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 dark:bg-black/60 bg-slate-300 bg-opacity-60 backdrop-blur-sm z-40"></div>
      <div className={`${isBackgroundBlur ? "fixed inset-0 min-h-screen flex items-center justify-center z-50 p-4 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" : ""}`}>
        <div className="dark:bg-[#0d1117] dark:text-white bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 border border-gray-700 space-y-5 animate-scale-in">

          <h2 className="text-2xl sm:text-3xl font-bold text-center">
            Upgrade to <span className="text-yellow-400">Premium</span>
          </h2>
          <p className="text-center dark:text-gray-400 text-gray-900 text-sm">₹100 / $2 per month</p>
          <p className="text-xs dark:text-gray-500 text-gray-800 text-center">
            Secured via <span className="text-blue-500 underline cursor-pointer">Stripe</span>.
          </p>

          <ul className="space-y-3 text-sm dark:text-gray-300 text-gray-600 leading-relaxed px-2">
            {[
              "All Basic Plan Features",
              "Prescription Analysis: Auto-read prescriptions.",
              "Medication Summariser: Clear med summaries.",
              "Disease Summariser: Simplify complex info.",
              "Advanced Multimodal AI: Access premium models.",
            ].map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <FaCheckCircle className="text-green-500 mt-1" /> {item}
              </li>
            ))}
          </ul>

          <div className="dark:bg-[#161b22] bg-[#e4e5e7] p-4 rounded-lg border border-gray-700 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="dark:text-gray-400 text-gray-900">Plan</span>
              <span className="font-medium dark:text-white text-gray-900">Premium</span>
            </div>
            <div className="flex justify-between">
              <span className="dark:text-gray-400 text-gray-900">Price</span>
              <span className="font-medium dark:text-white text-gray-900">₹100 / $2 <span className="dark:text-gray-500 text-gray-700">/month</span></span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 bg-[#21262d] hover:bg-[#30363d] text-gray-300 rounded-lg py-2 font-semibold transition"
            >
              Cancel
            </button>
            <button
              onClick={handlePremiumClick}
              className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg py-2 font-semibold transition"
            >
              Pay ₹100 / $2
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center pt-2">
            🔒 Payments are secure and encrypted.
          </p>
        </div>
      </div>
    </>
  );
};

export default PremiumPlanToastContainer;