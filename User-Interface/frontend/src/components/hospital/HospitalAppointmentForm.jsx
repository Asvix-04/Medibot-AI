import React, { useState } from "react";

const HospitalAppointmentForm = ({ onClose }) => {
  const [form, setForm] = useState({
    name: "",
    date: "",
    time: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Appointment booked:", form);
    alert("Appointment booked successfully!");
    onClose();
  };

  return (
    <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">📅 Book Appointment</h2>
        <button onClick={onClose} className="text-gray-600 hover:text-red-600 text-2xl">&times;</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          className="w-full p-2 border rounded"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="date"
          className="w-full p-2 border rounded"
          value={form.date}
          onChange={handleChange}
          required
        />
        <input
          type="time"
          name="time"
          className="w-full p-2 border rounded"
          value={form.time}
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Confirm Booking
        </button>
      </form>
    </div>
  );
};

export default HospitalAppointmentForm;
