import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

const SubscriptionPage = () => {
  const navigate = useNavigate();

  const handleFreePlan = () => {
    // For free users, you can navigate to success/thank you page directly
    navigate('health-dashboard');
  };

  const handlePremiumPlan = () => {
    // For paid users, go to the payment page
    navigate('/payment');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f7ff] via-[#ece9fe] to-[#f8f7ff] flex items-center justify-center p-6">
      <div className="max-w-5xl w-full">
        <h2 className="text-4xl font-bold text-center mb-10 text-[#7b4ee5]">Choose Your Plan</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Free Plan */}
          <div className="bg-white rounded-3xl shadow-lg border border-purple-100 hover:shadow-2xl transition duration-300 flex flex-col">
            <div className="bg-gradient-to-r from-[#7b4ee5] to-[#a78bfa] text-white text-center rounded-t-3xl p-6">
              <h3 className="text-2xl font-bold">Basic Plan</h3>
              <p className="text-sm mt-1">Free Users</p>
            </div>
            <div className="p-6 flex-grow">
              <ul className="space-y-3">
                {[
                  "multilingual feature",
                  "text to speech",
                  "speech to text",
                  "Speech to speech",
                  "health monitoring (bp, sugar and cholesterol)",
                  "multi-model feature (open-source or free models)",
                  "medication reminder"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center text-gray-700">
                    <FaCheckCircle className="text-green-500 mr-2" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-6">
              <button
                onClick={handleFreePlan}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-[#7b4ee5] to-[#a78bfa] text-white font-semibold hover:from-[#8e69e4] hover:to-[#9d7ef5] shadow-md transition duration-300"
              >
                Choose Free
              </button>
            </div>
          </div>

          {/* Premium Plan */}
          <div className="bg-white rounded-3xl shadow-lg border border-purple-100 hover:shadow-2xl transition duration-300 flex flex-col">
            <div className="bg-gradient-to-r from-[#7b4ee5] to-[#a78bfa] text-white text-center rounded-t-3xl p-6">
              <h3 className="text-2xl font-bold">Premium Plan</h3>
              <p className="text-sm mt-1">Paid Users (₹100)</p>
            </div>
            <div className="p-6 flex-grow">
              <ul className="space-y-3">
                {[
                  "prescription analysis",
                  "multi-model feature (paid models)",
                  "health monitoring (bp, sugar and cholesterol)",
                  "medication summariser",
                  "disease summariser",
                  "mental health bot (if possible we’ll integrate it)"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center text-gray-700">
                    <FaCheckCircle className="text-green-500 mr-2" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-6">
              <button
                onClick={handlePremiumPlan}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-[#7b4ee5] to-[#a78bfa] text-white font-semibold hover:from-[#8e69e4] hover:to-[#9d7ef5] shadow-md transition duration-300"
              >
                Choose Premium
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;