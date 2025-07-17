import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaLock } from "react-icons/fa";

const PaymentPage = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handlePayment = async () => {
    if (!userData.name || !userData.email || !userData.phone) {
      alert("Please fill in all details");
      return;
    }

    try {
      // 1. Call backend to create Razorpay order
      const { data } = await axios.post(
        "http://localhost:5000/api/payment/create-order",
        {
          amount: 100, // ₹100
        }
      );

      const { orderId, amount, currency } = data;

      // 2. Open Razorpay checkout
      const options = {
        key: "rzp_test_dbUuGw9KNmfd58",
        amount,
        currency,
        name: "Medibot Premium Subscription",
        description: "Unlock Premium Features",
        order_id: orderId,
        handler: function (response) {
          console.log("Payment success:", response);
          navigate("/payment-success");
        },
        prefill: {
          name: userData.name,
          email: userData.email,
          contact: userData.phone,
        },
        notes: {
          plan: "Premium Subscription",
        },
        theme: {
          color: "#7b4ee5",
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (err) {
      console.error("Payment error:", err);
      alert("Failed to initiate payment. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8f7ff] via-[#ece9fe] to-[#f8f7ff] px-4 py-10">
      <div className="bg-white shadow-xl rounded-3xl p-8 max-w-md w-full">
        <div className="flex items-center mb-4">
          <FaLock className="text-[#7b4ee5] text-3xl mr-2" />
          <h2 className="text-2xl font-bold text-[#7b4ee5]">Secure Payment with Razorpay</h2>
        </div>
        <p className="text-gray-600 mb-6">You are paying <span className="font-semibold">₹100</span> for the Premium Subscription.</p>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-left text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              name="name"
              value={userData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="mt-1 block w-full rounded-lg border border-purple-200 px-4 py-3 bg-gradient-to-br from-[#f8f7ff] via-[#ece9fe] to-[#f8f7ff] focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]"
            />
          </div>
          <div>
            <label className="block text-left text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="mt-1 block w-full rounded-lg border border-purple-200 px-4 py-3 bg-gradient-to-br from-[#f8f7ff] via-[#ece9fe] to-[#f8f7ff] focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]"
            />
          </div>
          <div>
            <label className="block text-left text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={userData.phone}
              onChange={handleChange}
              placeholder="10-digit phone number"
              className="mt-1 block w-full rounded-lg border border-purple-200 px-4 py-3 bg-gradient-to-br from-[#f8f7ff] via-[#ece9fe] to-[#f8f7ff] focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]"
            />
          </div>
        </div>

        <button
          onClick={handlePayment}
          className="w-full py-3 rounded-lg bg-gradient-to-r from-[#7b4ee5] to-[#a78bfa] text-white font-semibold hover:from-[#8e69e4] hover:to-[#9d7ef5] transition duration-300"
        >
          Pay ₹100
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
