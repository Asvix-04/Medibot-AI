import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth, db } from '../../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { useToast } from '../../context/ToastContext';
import NearbyFacilitiesMap from './NearbyFacilitiesMap';
import AppointmentList from './AppointmentList'; // Add this import
import LocationPermissionModal from './LocationPermissionModal';

const AppointmentScheduler = ({ darkMode = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();
  
  // Form state
  const [formData, setFormData] = useState({
    doctorName: '',
    specialty: '',
    date: '',
    time: '',
    location: '',
    notes: '',
    facilityId: '' // Will be populated when a user selects a facility from the map
  });
  
  // Location and map state
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeView, setActiveView] = useState(location.state?.view === 'all' ? 'list' : 'schedule');
  
  // Check if location permission has been previously granted
  useEffect(() => {
    const checkLocationPermission = () => {
      const hasPermission = localStorage.getItem('locationPermissionGranted');
      if (hasPermission === 'true') {
        setLocationPermissionGranted(true);
        getUserLocation();
      } else {
        // Show location permission modal if not previously granted
        setShowLocationModal(true);
      }
    };
    
    checkLocationPermission();
  }, []);
  
  // Get user's current location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setLoading(false);
        },
        (err) => {
          console.error("Error getting location:", err);
          setError("Unable to get your location. Please enable location services and try again.");
          setLoading(false);
        },
        { enableHighAccuracy: true }
      );
    } else {
      setError("Geolocation is not supported by your browser");
    }
  };
  
  // Handle location permission response
  const handleLocationPermission = (granted) => {
    setShowLocationModal(false);
    if (granted) {
      localStorage.setItem('locationPermissionGranted', 'true');
      setLocationPermissionGranted(true);
      getUserLocation();
    }
  };
  
  // Handle facility selection from map
  const handleFacilitySelect = (facility) => {
    setSelectedFacility(facility);
    setFormData({
      ...formData,
      location: facility.name + (facility.vicinity ? ', ' + facility.vicinity : ''),
      facilityId: facility.place_id || ''
    });
  };
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.doctorName || !formData.date || !formData.time) {
      addToast("Please fill in all required fields", "error");
      return;
    }
    
    try {
      setLoading(true);
      const user = auth.currentUser;
      
      if (!user) {
        throw new Error("You must be logged in to schedule an appointment");
      }
      
      // Prepare appointment data
      const appointmentData = {
        ...formData,
        userId: user.uid,
        createdAt: Timestamp.now(),
        status: 'scheduled'
      };
      
      // Save to Firestore
      const appointmentsRef = collection(db, "users", user.uid, "appointments");
      await addDoc(appointmentsRef, appointmentData);
      
      addToast("Appointment scheduled successfully", "success");
      navigate('/dashboard');
      
    } catch (error) {
      console.error("Error scheduling appointment:", error);
      addToast(`Error: ${error.message}`, "error");
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Add this function to your component
  const getNearbyFacilities = (facilityType) => {
    // Convert facilityType to Google Maps Place type
    let placeType = facilityType;
    if (facilityType === 'hospital') placeType = 'hospital';
    else if (facilityType === 'clinic') placeType = 'doctor';
    else if (facilityType === 'pharmacy') placeType = 'pharmacy';
    
    // Call the search function exposed by the map component
    if (window.searchNearbyFacilities) {
      window.searchNearbyFacilities(placeType);
    } else {
      setError('Map not initialized yet. Please try again in a moment.');
    }
  };

  return (
    <div className={`max-w-6xl mx-auto p-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">
          {activeView === 'list' ? 'Your Appointments' : 'Schedule an Appointment'}
        </h1>
        
        {/* Toggle buttons */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveView('list')}
            className={`${activeView === 'list' ? 
              'bg-blue-600 text-white' : 
              darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
            } px-4 py-2 rounded-lg`}
          >
            View Appointments
          </button>
          <button
            onClick={() => setActiveView('schedule')}
            className={`${activeView === 'schedule' ? 
              'bg-blue-600 text-white' : 
              darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
            } px-4 py-2 rounded-lg`}
          >
            Schedule New
          </button>
        </div>
        
        {/* Show either the appointment list or the scheduling form based on active view */}
        {activeView === 'list' ? (
          <AppointmentList darkMode={darkMode} /> // You'd need to create this component
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Appointment Form */}
            <div className={`p-6 rounded-xl ${
              darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } border shadow-sm`}>
              <h2 className="text-lg font-semibold mb-4">Appointment Details</h2>
              
              {error && (
                <div className={`p-3 mb-4 rounded-md ${
                  darkMode ? 'bg-red-900/30 text-red-200' : 'bg-red-50 text-red-700'
                }`}>
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Doctor Name*
                  </label>
                  <input
                    type="text"
                    name="doctorName"
                    value={formData.doctorName}
                    onChange={handleChange}
                    required
                    className={`block w-full px-3 py-2 border rounded-md ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Specialty
                  </label>
                  <select
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleChange}
                    className={`block w-full px-3 py-2 border rounded-md ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  >
                    <option value="">Select specialty...</option>
                    <option value="General Practitioner">General Practitioner</option>
                    <option value="Cardiologist">Cardiologist</option>
                    <option value="Dermatologist">Dermatologist</option>
                    <option value="Endocrinologist">Endocrinologist</option>
                    <option value="Neurologist">Neurologist</option>
                    <option value="Gynecologist">Gynecologist</option>
                    <option value="Pediatrician">Pediatrician</option>
                    <option value="Psychiatrist">Psychiatrist</option>
                    <option value="Orthopedist">Orthopedist</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Date*
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className={`block w-full px-3 py-2 border rounded-md ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Time*
                    </label>
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      required
                      className={`block w-full px-3 py-2 border rounded-md ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    />
                  </div>
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder={locationPermissionGranted ? "Select a location from the map or type here" : "Enable location to see nearby options or type here"}
                    className={`block w-full px-3 py-2 border rounded-md ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    rows="3"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Any special requests or information?"
                    className={`block w-full px-3 py-2 border rounded-md ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  ></textarea>
                </div>
                
                <div className="flex justify-end mt-6">
                  <button
                    type="button"
                    onClick={() => navigate('/dashboard')}
                    className={`mr-3 px-4 py-2 rounded-lg text-sm ${
                      darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                      loading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {loading ? 'Scheduling...' : 'Schedule Appointment'}
                  </button>
                </div>
              </form>
            </div>
            
            {/* Map Section */}
            <div className={`p-6 rounded-xl ${
              darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } border shadow-sm`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Nearby Medical Facilities</h2>
                
                {!locationPermissionGranted && (
                  <button
                    onClick={() => setShowLocationModal(true)}
                    className={`px-3 py-1 rounded-lg text-sm ${
                      darkMode ? 'bg-blue-700 text-white' : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    Enable Location
                  </button>
                )}
              </div>
              
              {locationPermissionGranted && userLocation ? (
                <div className="h-[500px] rounded-lg overflow-hidden">
                  <NearbyFacilitiesMap 
                    userLocation={userLocation} 
                    onFacilitySelect={handleFacilitySelect}
                    selectedFacility={selectedFacility}
                    darkMode={darkMode}
                  />
                </div>
              ) : (
                <div className={`h-[500px] rounded-lg flex items-center justify-center ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                  {loading ? (
                    <div className="text-center">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent"></div>
                      <p className="mt-2">Getting your location...</p>
                    </div>
                  ) : (
                    <div className="text-center p-6">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <p className="mb-3">Enable location services to see nearby medical facilities</p>
                      <button
                        onClick={() => setShowLocationModal(true)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${
                          darkMode ? 'bg-blue-700 hover:bg-blue-800' : 'bg-blue-600 hover:bg-blue-700'
                        } text-white`}
                      >
                        Allow Location Access
                      </button>
                    </div>
                  )}
                </div>
              )}
              
              <div className="mt-4">
                <div className={`flex rounded-md overflow-hidden border ${
                  darkMode ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <button
                    className={`flex-1 py-2 ${
                      darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => getNearbyFacilities('hospital')}
                  >
                    Hospitals
                  </button>
                  <button
                    className={`flex-1 py-2 ${
                      darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => getNearbyFacilities('clinic')}
                  >
                    Clinics
                  </button>
                  <button
                    className={`flex-1 py-2 ${
                      darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => getNearbyFacilities('pharmacy')}
                  >
                    Pharmacies
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {showLocationModal && (
        <LocationPermissionModal 
          onResponse={handleLocationPermission} 
          darkMode={darkMode} 
        />
      )}
    </div>
  );
};

export default AppointmentScheduler;