import React from "react";
import { hospitalsList } from "./HospitalsList.mock";
import { Link } from "react-router-dom";

const HospitalsList = () => {
  return (
    <div className="hospital-list-view bg-[#121212] min-h-screen py-12 px-4 sm:px-6 lg:px-16">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-indigo-400">
          🏥 Hospitals
        </h1>
      </div>

      {/* Hospitals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {hospitalsList.map((hospital) => (
          <div
            key={hospital.id}
            className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
          >
            <img
              src={hospital.photos[0]}
              alt={hospital.name}
              className="w-full h-48 sm:h-56 object-cover"
            />
            <div className="p-4 flex flex-col gap-2">
              <h2 className="text-xl font-semibold text-gray-800">
                {hospital.name}
              </h2>
              <p className="text-sm text-gray-600">{hospital.address}</p>
              <Link
                to={`/hospital/details/${hospital.id}`}
                className="mt-3 inline-block bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                View Profile →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HospitalsList;