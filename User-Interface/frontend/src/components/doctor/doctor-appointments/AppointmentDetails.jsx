// AppointmentDetails.jsx
import React from "react";

const AppointmentDetails = ({ appointment, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
      <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md shadow-lg relative">
        {/* Header with title and close */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg sm:text-xl font-semibold">📝 Appointment Details</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-red-600 text-2xl absolute right-4 top-2"
          >
            &times;
          </button>
        </div>

        {/* Appointment Info */}
        <div className="flex flex-col space-y-2 text-sm sm:text-base">
          <p><strong>👤 Patient Name:</strong> {appointment.name}</p>
          <p><strong>👤 Patient Age:</strong> {appointment.age}</p>
          <p><strong>🩺 Doctor:</strong> {appointment.doctorName}</p>
          <p><strong>📅 Date:</strong> {appointment.date}</p>
          <p><strong>⏰ Time:</strong> {appointment.time}</p>
          <p><strong>📌 Status:</strong> {appointment.status}</p>
        </div>

        {/* Close Button */}
        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full sm:w-auto"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetails;