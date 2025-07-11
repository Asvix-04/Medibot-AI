import React, { useEffect, useState } from "react";

const HospitalFeedbackReview = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("hospitalFeedbacks");
    if (stored) {
      setFeedbacks(JSON.parse(stored));
    }
  }, []);

  return (
    <div className="bg-[#0B0B0F] min-h-screen py-12 px-4 sm:px-6 lg:px-16 text-white">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-indigo-400 mb-10 text-center">
        ⭐ Patient Feedback Review
      </h1>

      {feedbacks.length === 0 ? (
        <p className="text-center text-gray-400">No feedback submitted yet.</p>
      ) : (
        <div className="grid gap-6">
          {feedbacks.map((f, idx) => (
            <div
              key={idx}
              className="bg-[#121212] border border-[#2A2A35] rounded-xl p-6 shadow hover:shadow-lg transition"
            >
              <h2 className="text-lg text-indigo-300 font-semibold mb-2">
                🏥 {f.hospitalName}
              </h2>
              <p className="text-sm text-gray-400">👤 {f.contactPerson}</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-300 mt-4">
                <p><strong>UI:</strong> {f.uiRating}</p>
                <p><strong>Responsiveness:</strong> {f.responsivenessRating}</p>
                <p><strong>Ease of Use:</strong> {f.easeOfUseRating}</p>
              </div>

              {f.bestFeatures && (
                <p className="mt-3 text-gray-300"><strong>Best Features:</strong> {f.bestFeatures}</p>
              )}
              {f.issues && (
                <p className="mt-2 text-red-400"><strong>Issues:</strong> {f.issues}</p>
              )}
              {f.suggestions && (
                <p className="mt-2 text-yellow-400"><strong>Suggestions:</strong> {f.suggestions}</p>
              )}
              <p className="mt-2">
                <strong>Recommend:</strong>{" "}
                <span className="text-indigo-400">{f.recommend}</span>
              </p>
              {f.additionalFeedback && (
                <p className="mt-2 text-gray-300"><strong>More:</strong> {f.additionalFeedback}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HospitalFeedbackReview;