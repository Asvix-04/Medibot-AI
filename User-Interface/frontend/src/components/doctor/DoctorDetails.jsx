import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { doctorsList } from "./DoctorsList.mock";
import DoctorAppointmentForm from "./DoctorAppointmentForm";

const DoctorDetails = () => {
  const { id } = useParams();
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);

  const handleOpenAppointmentForm = () => setShowAppointmentForm(true);
  const handleCloseAppointmentForm = () => setShowAppointmentForm(false);

  const doctor = doctorsList.find((d) => d.id === parseInt(id));
  if (!doctor)
    return (
      <div className="text-center p-10 text-red-600 text-xl">
        Doctor Not Found
      </div>
    );

  return (
    <>
      <div className="bg-gradient-to-br from-[#121212] to-[#1a1a1a] text-white px-4 sm:px-6 lg:px-12 py-10 min-h-screen">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-500 text-center mb-10">
          {doctor.name}
        </h1>

        {/* Doctor Info Grid */}
        <div className="grid gap-6 lg:gap-12 md:grid-cols-2">
          <img
            src={doctor.photo}
            alt={doctor.name}
            className="rounded-lg w-full h-64 sm:h-80 object-cover shadow-lg"
          />
          <div className="space-y-4 text-base sm:text-lg">
            <p>
              <strong>👨‍⚕️ Specialty:</strong> {doctor.specialty}
            </p>
            <p>
              <strong>🎓 Qualifications:</strong> {doctor.qualifications}
            </p>
            <p>
              <strong>🧠 Experience:</strong> {doctor.experience}
            </p>
            <p>
              <strong>🏥 Clinic Address:</strong> {doctor.clinicAddress}
            </p>
            <p>
              <strong>⏰ Timings:</strong> {doctor.timings}
            </p>
            <p>
              <strong>📞 Contact:</strong> {doctor.contact}
            </p>
          </div>
        </div>

        {/* About */}
        <div className="mt-10">
          <h2 className="text-xl sm:text-2xl font-bold mb-2 text-indigo-400">
            🩺 About
          </h2>
          <p className="text-gray-300 text-sm sm:text-base">{doctor.about}</p>
        </div>

        {/* Reviews */}
        <div className="mt-10">
          <h2 className="text-xl sm:text-2xl font-bold mb-2 text-indigo-400">
            ⭐ Patient Reviews
          </h2>
          {doctor.reviews.map((r, idx) => (
            <div
              key={idx}
              className="border-t border-gray-700 pt-3 mt-3 text-gray-300 text-sm sm:text-base"
            >
              <p className="font-semibold">{r.name}</p>
              <p>“{r.comment}”</p>
            </div>
          ))}
        </div>

        {/* Book Appointment Button */}
        <div className="mt-12 text-center">
          <button
            className="bg-blue-600 text-white px-6 py-3 rounded-lg text-base sm:text-lg font-medium hover:bg-blue-700 transition"
            onClick={handleOpenAppointmentForm}
          >
            📅 Book Appointment
          </button>
        </div>
      </div>

      {/* Appointment Modal */}
      {showAppointmentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 px-4">
          <DoctorAppointmentForm
            onClose={handleCloseAppointmentForm}
            doctor={doctor}
          />
        </div>
      )}
    </>
  );
};

export default DoctorDetails;
