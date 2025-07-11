import React, { useState } from "react";
import { doctorsList } from "./DoctorsList.mock";
import { Link } from "react-router-dom";

const DoctorsList = () => {
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");

  const specialties = ["All", ...new Set(doctorsList.map((doc) => doc.specialty))];

  const filteredDoctors =
    selectedSpecialty === "All"
      ? doctorsList
      : doctorsList.filter((doc) => doc.specialty === selectedSpecialty);

  return (
    <div className="bg-[#121212] min-h-screen py-12 px-4 sm:px-6 lg:px-16">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-indigo-400 mb-4">
          👨‍⚕️ Our Doctors
        </h1>
        <label className="text-lg text-white font-medium">
          Select Doctor Specialty:
          <select
            className="ml-3 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
          >
            {specialties.map((spec, i) => (
              <option key={i} value={spec}>
                {spec}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Doctor Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
            >
              <img
                src={doctor.photo}
                alt={doctor.name}
                className="w-full h-60 object-cover"
              />
              <div className="p-5 flex flex-col gap-1">
                <h2 className="text-xl font-semibold text-gray-800">{doctor.name}</h2>
                <p className="text-gray-600">{doctor.specialty}</p>
                <p className="text-gray-500 text-sm">{doctor.clinicAddress}</p>
                <Link
                  to={`/doctor/details/${doctor.id}`}
                  className="mt-3 inline-block bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  View Profile →
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className="text-white text-center col-span-full text-lg">
            No doctors found for this specialty.
          </p>
        )}
      </div>
    </div>
  );
};

export default DoctorsList;
