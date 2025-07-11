import React, { useState } from 'react';

const HospitalFeedbackForm = ({ onClose }) => {

    const [formData, setFormData] = useState({
        hospitalName: '',
        contactPerson: '',
        uiRating: '',
        responsivenessRating: '',
        easeOfUseRating: '',
        bestFeatures: '',
        issues: '',
        suggestions: '',
        recommend: '',
        additionalFeedback: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Get existing feedbacks from localStorage or initialize empty array
        const existingFeedbacks = JSON.parse(localStorage.getItem("hospitalFeedbacks") || "[]");

        // Add new feedback to array
        const updatedFeedbacks = [...existingFeedbacks, formData];

        // Store updated array back in localStorage
        localStorage.setItem("hospitalFeedbacks", JSON.stringify(updatedFeedbacks));

        alert("Thank you for your feedback!");
        onClose(); // Close modal after submit
    };

    return (
        <div className="p-6 bg-white shadow-md rounded-lg w-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">🏥 Hospital Feedback Form</h2>
                <button onClick={onClose} className="text-gray-600 hover:text-red-600 text-xl">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">

                <input
                    type="text"
                    name="hospitalName"
                    placeholder="Hospital Name"
                    className="w-full p-2 border rounded"
                    value={formData.hospitalName}
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="contactPerson"
                    placeholder="Contact Person (Name & Designation)"
                    className="w-full p-2 border rounded"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    required
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <select name="uiRating" value={formData.uiRating} onChange={handleChange} className="p-2 border rounded" required>
                        <option value="">UI Rating</option>
                        <option>Excellent</option>
                        <option>Good</option>
                        <option>Average</option>
                        <option>Poor</option>
                    </select>

                    <select name="responsivenessRating" value={formData.responsivenessRating} onChange={handleChange} className="p-2 border rounded" required>
                        <option value="">Responsiveness</option>
                        <option>Excellent</option>
                        <option>Good</option>
                        <option>Average</option>
                        <option>Poor</option>
                    </select>

                    <select name="easeOfUseRating" value={formData.easeOfUseRating} onChange={handleChange} className="p-2 border rounded" required>
                        <option value="">Ease of Use</option>
                        <option>Excellent</option>
                        <option>Good</option>
                        <option>Average</option>
                        <option>Poor</option>
                    </select>
                </div>

                <textarea
                    name="bestFeatures"
                    placeholder="What features do you find most useful?"
                    className="w-full p-2 border rounded"
                    value={formData.bestFeatures}
                    onChange={handleChange}
                />

                <textarea
                    name="issues"
                    placeholder="Have you faced any issues or bugs?"
                    className="w-full p-2 border rounded"
                    value={formData.issues}
                    onChange={handleChange}
                />

                <textarea
                    name="suggestions"
                    placeholder="Suggestions for improvements or features?"
                    className="w-full p-2 border rounded"
                    value={formData.suggestions}
                    onChange={handleChange}
                />

                <div className="mt-2">
                    <label className="block mb-1 font-medium">Would you recommend our app to others?</label>
                    <div className="flex gap-4">
                        <label><input type="radio" name="recommend" value="Yes" onChange={handleChange} /> Yes</label>
                        <label><input type="radio" name="recommend" value="No" onChange={handleChange} /> No</label>
                        <label><input type="radio" name="recommend" value="Maybe" onChange={handleChange} /> Maybe</label>
                    </div>
                </div>

                <textarea
                    name="additionalFeedback"
                    placeholder="Any other comments or feedback?"
                    className="w-full p-2 border rounded"
                    value={formData.additionalFeedback}
                    onChange={handleChange}
                />

                <button
                    type="submit"
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Submit Feedback
                </button>
            </form>
        </div>
    );
};

export default HospitalFeedbackForm;
