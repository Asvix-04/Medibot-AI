import React, { useState } from "react";

const DoctorAppointmentForm = ({ onClose, doctor }) => {
  const [form, setForm] = useState({
    name: "",
    age: "",
    date: "",
    time: "",
    doctorId: doctor?.id || null,
    doctorName: doctor?.name || ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newAppointment = {
      ...form,
      id: Date.now(),
      status: "Pending"
    };

    // Save to localStorage
    const existing = JSON.parse(localStorage.getItem("doctor-appointments") || "[]");
    localStorage.setItem("doctor-appointments", JSON.stringify([...existing, newAppointment]));

    alert("Appointment booked successfully!");
    onClose();
  };

  return (
    <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">📅 Book Appointment with {doctor?.name}</h2>
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
          type="number"
          name="age"
          placeholder="Your Age"
          className="w-full p-2 border rounded"
          value={form.age}
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

export default DoctorAppointmentForm;
