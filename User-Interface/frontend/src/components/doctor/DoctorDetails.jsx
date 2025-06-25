import React from "react";
import { useParams } from "react-router-dom";
import { doctorsList } from "./DoctorsList.mock";

const DoctorDetails = () => {
    const { id } = useParams();
    const doctor = doctorsList.find((d) => d.id === parseInt(id));

    if (!doctor) return <div className="text-center p-10 text-red-600">Doctor Not Found</div>;

    return (
        <div className="doctor-details bg-gradient-to-br from-[#121212] to-[#1a1a1a] text-white py-10 px-6 min-h-screen">
            <h1 className="text-3xl font-bold text-blue-500 text-center mb-8">{doctor.name}</h1>

            <div className="grid gap-8 md:grid-cols-2">
                <img
                    src={doctor.photo}
                    alt={doctor.name}
                    className="rounded-lg w-full h-35 object-cover"
                />
                <div className="space-y-3">
                    <p><strong>👨‍⚕️ Specialty:</strong> {doctor.specialty}</p>
                    <p><strong>🎓 Qualifications:</strong> {doctor.qualifications}</p>
                    <p><strong>🧠 Experience:</strong> {doctor.experience}</p>
                    <p><strong>🏥 Clinic Address:</strong> {doctor.clinicAddress}</p>
                    <p><strong>⏰ Timings:</strong> {doctor.timings}</p>
                    <p><strong>📞 Contact:</strong> {doctor.contact}</p>
                </div>
            </div>

            <div className="mt-10">
                <h2 className="text-xl font-bold mb-2 text-indigo-400">🩺 About</h2>
                <p className="text-gray-300">{doctor.about}</p>
            </div>

            <div className="mt-10">
                <h2 className="text-xl font-bold mb-2 text-indigo-400">⭐ Patient Reviews</h2>
                {doctor.reviews.map((r, idx) => (
                    <div key={idx} className="border-t border-gray-700 pt-3 mt-3 text-gray-300">
                        <p className="font-semibold">{r.name}</p>
                        <p>“{r.comment}”</p>
                    </div>
                ))}
            </div>

            <div className="mt-10 text-center">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition">
                    📅 Book Appointment
                </button>
            </div>
        </div>
    );
};

export default DoctorDetails;