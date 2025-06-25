import React, { useState } from "react";
import { doctorsList } from "./DoctorsList.mock";
import { Link } from "react-router-dom";

const DoctorsList = () => {

    const [selectedSpecialty, setSelectedSpecialty] = useState("All");

    // Get unique specialties for dropdown options
    const specialties = ["All", ...new Set(doctorsList.map((doc) => doc.specialty))];

    // Filter doctors based on selected specialty
    const filteredDoctors =
        selectedSpecialty === "All"
            ? doctorsList
            : doctorsList.filter((doc) => doc.specialty === selectedSpecialty);

    return (
        <div className="doctor-list-view bg-[#121212] min-h-screen py-10 px-6">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-center text-indigo-400 mb-10">👨‍⚕️ Our Doctors</h1>
                </div>
                {/* Dropdown Filter */}
                <div className="text-center mb-8">
                    <span className="w-md border border-transparent text-base leading-6 font-medium rounded-md text-[#d6d4d4] transition duration-300 ease-in-out md:py-4 md:text-lg md:px-10">
                        Select Doctor Specialty<select
                            className="bg-blue-600 text-white px-4 py-1 hover:bg-blue-700 transition ml-1"
                            value={selectedSpecialty}
                            onChange={(e) => setSelectedSpecialty(e.target.value)}
                        >
                            {specialties.map((spec, i) => (
                                <option key={i} value={spec}>
                                    {spec}
                                </option>
                            ))}
                        </select></span>
                </div>
            </div>

            {/* Doctor Cards */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {filteredDoctors.length > 0 ? (
                    filteredDoctors.map((doctor) => (
                        <div key={doctor.id} className="bg-white p-6 rounded-lg shadow-lg">
                            <img src={doctor.photo} alt={doctor.name} className="h-sm w-full object-cover rounded" />
                            <h2 className="text-xl font-semibold mt-2">{doctor.name}</h2>
                            <p className="text-sm text-gray-600">{doctor.specialty}</p>
                            <p className="text-sm text-gray-500">{doctor.clinicAddress}</p>
                            <Link
                                to={`/doctor/profile/${doctor.id}`}
                                className="inline-block mt-2 text-blue-600 font-semibold hover:underline"
                            >
                                View Profile →
                            </Link>
                        </div>
                    ))
                ) : (
                    <p className="text-white text-center col-span-full">No doctors found for this specialty.</p>
                )}
            </div>
        </div>
    );
};

export default DoctorsList;