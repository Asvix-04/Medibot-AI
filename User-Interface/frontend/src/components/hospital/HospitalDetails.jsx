import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { hospitalsList } from "./HospitalsList.mock";
import HospitalFeedbackForm from "./HospitalFeedbackForm";
import HospitalAppointmentForm from "./HospitalAppointmentForm";

const HospitalDetails = () => {
    const [showAppointmentForm, setShowAppointmentForm] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);
    const { id } = useParams();

    const handleOpenAppointmentForm = () => setShowAppointmentForm(true);
    const handleCloseAppointmentForm = () => setShowAppointmentForm(false);
    const handleOpenFeedback = () => setShowFeedback(true);
    const handleCloseFeedback = () => setShowFeedback(false);

    const hospital = hospitalsList.find(h => h.id === parseInt(id));
    if (!hospital) return <div className="text-center p-10 text-red-600">Hospital Not Found</div>;

    return (
        <div className="bg-gradient-to-br from-[#121212] to-[#1a1a1a] min-h-screen p-4 sm:p-6 lg:p-10 text-white">
            <h1 className="text-2xl sm:text-3xl font-bold text-blue-500 text-center mb-6">
                {hospital.name}
            </h1>

            {/* Images */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 mt-8">
                {hospital.photos.map((url, index) => (
                    <div key={index}>
                        <img src={url} alt={`Hospital ${index}`} className="rounded-lg w-full h-60 object-cover" />
                    </div>
                ))}
            </div>

            {/* Details Section */}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mt-12 text-gray-300">
                <div>
                    <h2 className="text-lg font-semibold text-indigo-400">🏥 About</h2>
                    <p>{hospital.about}</p>
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-indigo-400">🩺 Specialties</h2>
                    <ul className="list-disc list-inside">
                        {hospital.specialties.map((spec, i) => <li key={i}>{spec}</li>)}
                    </ul>
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-indigo-400">📍 Address</h2>
                    <p>{hospital.address}</p>
                </div>
            </div>

            {/* Timing & Contact */}
            <div className="grid gap-8 sm:grid-cols-2 mt-12 text-gray-300">
                <div>
                    <h2 className="text-lg font-semibold text-indigo-400">⏰ Timings</h2>
                    <p>{hospital.timings}</p>
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-indigo-400">📞 Contact</h2>
                    <p>{hospital.contact}</p>
                </div>
            </div>

            {/* Map */}
            {hospital.mapEmbedUrl && (
                <div className="mt-12">
                    <h2 className="text-lg font-semibold text-indigo-400 mb-2">🗺️ Location</h2>
                    <iframe
                        src={hospital.mapEmbedUrl}
                        width="100%"
                        height="300"
                        loading="lazy"
                        allowFullScreen
                        className="rounded-lg"
                        title="hospital-map"
                    ></iframe>
                </div>
            )}

            {/* Reviews */}
            <div className="mt-12">
                <h2 className="text-lg font-semibold text-indigo-400 mb-4">⭐ Patient Reviews</h2>
                {hospital.reviews.map((r, idx) => (
                    <div key={idx} className="border-t border-gray-700 pt-3 mt-3">
                        <p className="font-semibold text-white">{r.name}</p>
                        <p>“{r.comment}”</p>
                    </div>
                ))}
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-12">
                <button
                    onClick={handleOpenFeedback}
                    className="px-6 py-2 bg-blue-600 rounded hover:bg-blue-700 transition"
                >
                    📝 Give Feedback
                </button>
                <button
                    onClick={handleOpenAppointmentForm}
                    className="px-6 py-2 bg-blue-600 rounded hover:bg-blue-700 transition "
                >
                    📅 Book Appointment
                </button>
            </div>

            {/* Modals */}
            {showAppointmentForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
                    <HospitalAppointmentForm onClose={handleCloseAppointmentForm} />
                </div>
            )}

            {showFeedback && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
                    <div className="bg-white text-black rounded-md shadow-lg p-4 w-full max-w-xl">
                        <HospitalFeedbackForm onClose={handleCloseFeedback} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default HospitalDetails;
