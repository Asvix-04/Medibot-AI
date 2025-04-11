import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDoc, doc } from "firebase/firestore";
import { auth, db } from '../firebase';
import defaultAvatar from '../assets/default-avatar.jpeg';

const UserProfile = () => {
  const [userData, setUserData] = useState({
    photoURL: null,
    fullName: '',
    age: '',
    bloodGroup: '',
    pastDiseases: [],
    familyHistory: [],
    medications: '',
    allergies: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const user = auth.currentUser;
        if (!user) {
          throw new Error("No user is signed in");
        }
        
        // Get user document from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        
        if (userDoc.exists()) {
          setUserData({
            photoURL: user.photoURL || null,
            ...userDoc.data()
          });
        } else {
          throw new Error("User profile not found");
        }
        
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);
  
  const handleEditProfile = () => {
    navigate('/profile');
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin h-12 w-12 border-4 border-black border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center p-6">
          <div className="text-red-600 text-5xl mb-4">
            <i className="bx bx-error-circle"></i>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Profile</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-black py-5 px-4 relative">
        <h1 className="text-center text-2xl font-bold text-white">User Profile</h1>
        <p className="mt-1 text-center text-xs text-gray-400 max-w-sm mx-auto">
          Your personal health information
        </p>
        
        <div className="absolute -bottom-3 left-0 right-0 h-6 bg-gray-50" style={{
          clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 0 100%)',
          opacity: 0.1
        }}></div>
      </div>
      
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        {/* Profile Overview Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="p-6 flex flex-col items-center sm:flex-row sm:items-start">
            <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
              <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300">
                <img 
                  src={userData.photoURL || defaultAvatar} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="flex-grow text-center sm:text-left">
              <h2 className="text-2xl font-bold text-gray-900">{userData.fullName}</h2>
              <p className="text-gray-600">Age: {userData.age} years</p>
              <p className="text-gray-600">Blood Group: {userData.bloodGroup}</p>
              <div className="mt-4">
                <button
                  onClick={handleEditProfile}
                  className="px-4 py-2 bg-black text-white text-sm rounded-md hover:bg-gray-800"
                >
                  <i className="bx bx-edit mr-1"></i> Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Medical Information */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 px-6 py-4 bg-gray-50">Medical Information</h3>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Past Diseases</h4>
              {userData.pastDiseases.length > 0 ? (
                <ul className="list-disc pl-5 text-gray-600">
                  {userData.pastDiseases.map((disease, index) => (
                    <li key={index}>{disease}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">None reported</p>
              )}
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Family History</h4>
              {userData.familyHistory.length > 0 ? (
                <ul className="list-disc pl-5 text-gray-600">
                  {userData.familyHistory.map((condition, index) => (
                    <li key={index}>{condition}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">None reported</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Additional Health Information */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 px-6 py-4 bg-gray-50">Additional Health Information</h3>
          </div>
          
          <div className="p-6">
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Current Medications</h4>
              {userData.medications ? (
                <p className="text-gray-600">{userData.medications}</p>
              ) : (
                <p className="text-gray-500 italic">No current medications</p>
              )}
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Allergies</h4>
              {userData.allergies ? (
                <p className="text-gray-600">{userData.allergies}</p>
              ) : (
                <p className="text-gray-500 italic">No known allergies</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 border border-black text-black text-sm rounded-md mr-3 hover:bg-gray-100"
          >
            Back to Dashboard
          </button>
          <button
            onClick={handleEditProfile}
            className="px-4 py-2 bg-black text-white text-sm rounded-md hover:bg-gray-800"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;