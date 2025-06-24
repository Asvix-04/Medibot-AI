import React from "react";
import { useParams } from "react-router-dom";
import { hospitalsList } from "./HospitalsList.mock";

const HospitalDetails = () => {
    const { id } = useParams();
    const hospital = hospitalsList.find(h => h.id === parseInt(id));
    const hospital1 = hospitalsList.findIndex(h => h.id === parseInt(id));

    if (!hospital) return <div className="text-center p-10 text-red-600">Hospital Not Found</div>;

    return (
        <div className="hospital-details">
            <div className="relative bg-gradient-to-br from-[#121212] to-[#1a1a1a] overflow-hidden pt-10">

                <h1 className="text-3xl font-bold text-blue-700 text-center mb-6">{hospital.name}</h1>


                <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-2">
                    {hospital.photos.map((url, index) => (
                        <div className="col-md-6 mb-3 p-4" key={index}>
                            <img src={url} alt={`Hospital ${index}`} className="rounded-lg w-full h-60 object-cover" />
                        </div>
                    ))}
                </div>

                <div className="mt-16 grid gap-8 md:grid-cols-3 lg:grid-cols-3">
                    <div className="col-md-6 mb-3">
                        <h2 className="text-xl font-bold mb-2" style={{ color: '#818cf8' }}>🏥 About</h2>
                        <p style={{ color: '#d6d4d4' }}>{hospital.about}</p>
                    </div>
                    <div className="col-md-6 mb-3">
                        <h2 className="text-xl font-bold mb-2" style={{ color: '#818cf8' }}>🩺 Specialties</h2>
                        <ul className="list-disc list-inside text-gray-600" style={{ color: '#d6d4d4' }}>
                            {hospital.specialties.map((spec, i) => <li key={i}>{spec}</li>)}
                        </ul>
                    </div>
                    <div className="col-md-6 mb-3">
                        <h2 className="text-xl font-bold mb-2" style={{ color: '#818cf8' }}>📍 Address</h2>
                        <p style={{ color: '#d6d4d4' }}>{hospital.address}</p>
                    </div>
                </div>
                <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-2">
                    <div className="col-md-6 mb-3">
                        <h2 className="text-xl font-bold mb-2" style={{ color: '#818cf8' }}>⏰ Timings</h2>
                        <p style={{ color: '#d6d4d4' }}>{hospital.timings}</p>
                    </div>
                    <div className="col-md-6 mb-3">
                        <h2 className="text-xl font-bold mb-2" style={{ color: '#818cf8' }}>📞 Contact</h2>
                        <p style={{ color: '#d6d4d4' }}>{hospital.contact}</p>
                    </div>
                </div>
                {hospital.mapEmbedUrl && (
                    <div>
                        <h2 className="mt-16 text-xl font-bold mb-2" style={{ color: '#818cf8' }}>🗺️ Location</h2>
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


                <div>
                    <h2 className="mt-12 text-xl font-bold mb-2" style={{ color: '#818cf8' }}>⭐ Patient Reviews</h2>
                    {hospital.reviews.map((r, idx) => (
                        <div key={idx} className="border-t pt-3 mt-3 text-gray-600" style={{ color: '#d6d4d4' }}>
                            <p className="font-semibold" style={{ color: '#d6d4d4' }}>{r.name}</p>
                            <p style={{ color: '#d6d4d4' }}>“{r.comment}”</p>
                        </div>
                    ))}
                </div>


                <div className="mt-10 text-xl font-bold mb-2" style={{ color: '#818cf8' }}>
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition">
                        📅 Book Appointment
                    </button>
                </div>
            </div>
        </div>
    )
};

export default HospitalDetails;
