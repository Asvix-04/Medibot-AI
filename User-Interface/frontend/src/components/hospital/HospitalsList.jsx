import React from "react";
import { hospitalsList } from "./HospitalsList.mock";
import { Link } from "react-router-dom";

const HospitalsList = () => {
    return (
        <div className="hospital-list-view">
            <div className=" relative bg-gradient-to-br from-[#121212] to-[#1a1a1a] overflow-hidden pt-30" style={{height:'100vh',background: '#121212' }}>
                <div className="text-center">
                    <h1 className="mt-10 text-3xl font-extrabold sm:text-4xl" style={{ color: '#6366f1' }}>🏥 Hospitals</h1></div>
                <div className="mt-10 grid gap-8 md:grid-cols-1 lg:grid-cols-3">
                    {hospitalsList.map(hospital => (
                        <div key={hospital.id} className="bg-white p-4 rounded-lg shadow">
                            <img src={hospital.photos[0]} alt={hospital.name} className="h-40 w-full object-cover rounded" />
                            <h2 className="text-xl font-semibold mt-2">{hospital.name}</h2>
                            <p className="text-sm text-gray-500">{hospital.address}</p>
                            <Link
                                to={`/hospital/profile/${hospital.id}`}
                                className="inline-block mt-2 text-blue-600 font-semibold hover:underline"
                            >
                                View Profile →
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HospitalsList;