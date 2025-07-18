import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const PaymentSuccess = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8f7ff] via-[#ece9fe] to-[#f8f7ff] px-4">
      <div className="bg-white shadow-xl rounded-3xl p-8 max-w-md text-center">
        <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-[#7b4ee5] mb-2">Payment Successful!</h2>
        <p className="text-gray-700 mb-6">Thank you for your purchase. Your premium features are now unlocked.</p>
        <Link
          to="/chat"
          className="inline-block px-6 py-3 rounded-lg bg-gradient-to-r from-[#7b4ee5] to-[#a78bfa] text-white font-semibold hover:from-[#8e69e4] hover:to-[#9d7ef5] transition duration-300"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;