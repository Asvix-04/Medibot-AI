import React from "react";

const RefundPolicy = () => {
  return (
    <div className="min-h-screen text-left mt-8 py-12 px-6 sm:px-10 md:px-20 lg:px-40 bg-white text-gray-800">
      <h1 className="text-3xl font-bold mb-8 text-left text-primary">Refund and Cancellation Policy</h1>

      <div className="space-y-6">
        <p>
          This Refund and Cancellation Policy outlines the terms under which you may cancel an order or request a refund for products or services purchased through our platform.
        </p>

        <h2 className="text-xl font-semibold">1. Order Cancellations</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li>Cancellation requests will be considered only if made within <strong>1 day</strong> of placing the order.</li>
          <li>Cancellations may not be possible if the order has already been processed for shipping or is out for delivery.</li>
          <li>In such cases, you may choose to <strong>refuse delivery</strong> of the product.</li>
        </ul>

        <h2 className="text-xl font-semibold">2. Exceptions</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li>We do not accept cancellations for perishable items such as flowers, food, etc.</li>
          <li>Refunds or replacements may be considered if the delivered product is of poor quality, subject to verification.</li>
        </ul>

        <h2 className="text-xl font-semibold">3. Damaged or Defective Products</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li>Report any damaged or defective items within <strong>1 day</strong> of receipt.</li>
          <li>Refunds or replacements will be processed after the seller verifies the issue.</li>
        </ul>

        <h2 className="text-xl font-semibold">4. Product Mismatch or Dissatisfaction</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li>If the product received does not match the description or your expectations, contact our support team within <strong>1 day</strong>.</li>
          <li>Our team will evaluate the issue and take appropriate action.</li>
        </ul>

        <h2 className="text-xl font-semibold">5. Warranty-Related Issues</h2>
        <p>
          For items covered under a manufacturer’s warranty, please reach out directly to the manufacturer for service or support.
        </p>

        <h2 className="text-xl font-semibold">6. Refund Processing</h2>
        <p>
          If your refund is approved, the amount will be processed within <strong>2 business days</strong>.
        </p>
      </div>
    </div>
  );
};

export default RefundPolicy;