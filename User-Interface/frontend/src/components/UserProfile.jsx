import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from '../firebase';
import defaultAvatar from '../assets/default-avatar.jpeg';

const UserProfile = () => {
  const [userData, setUserData] = useState({
    photoURL: null,
    fullName: '',
    displayName: '',
    dateOfBirth: '',
    gender: '',
    email: '',
    emailVerified: false,
    phoneNumber: '',
    location: '',
    language: 'en',
    timezone: 'UTC',
    darkMode: false,
    shareData: false,
    updatedAt: null
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Check auth state first
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          if (!user) {
            setError("No user is signed in. Please sign in again.");
            setLoading(false);
            navigate('/signin');
            return;
          }
          
          try {
            // Check if the app is online
            if (!navigator.onLine) {
              console.log("User is offline, trying to use cached data");
              
              // Try to get cached data
              const cachedUserData = localStorage.getItem(`user_profile_${user.uid}`);
              if (cachedUserData) {
                const parsedData = JSON.parse(cachedUserData);
                console.log("Using cached user data:", parsedData);
                setUserData(parsedData);
                setLoading(false);
                return;
              } else {
                throw new Error("No cached data available. Please connect to the internet and try again.");
              }
            }
            
            // Get profile data from Firestore
            const userDoc = await getDoc(doc(db, "users", user.uid));
            
            console.log("Auth user:", auth.currentUser);
            console.log("Document path:", `users/${auth.currentUser?.uid}`);
            console.log("Document exists:", userDoc.exists());
            console.log("Document data:", userDoc.data());

            if (userDoc.exists()) {
              const userData = userDoc.data();
              
              // Store data in localStorage for offline access
              try {
                localStorage.setItem(`user_profile_${user.uid}`, JSON.stringify(userData));
              } catch (storageError) {
                console.warn("Could not cache profile data:", storageError);
              }
              
              setUserData(userData);
            } else {
              setError("User profile not found. Please complete your profile.");
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
            
            // Check for specific offline error
            if (error.message && error.message.includes("offline")) {
              setError("You appear to be offline. Please check your internet connection and try again.");
            } else {
              setError(`Error loading profile: ${error.message}`);
            }
          } finally {
            setLoading(false);
          }
        });
        
        return () => unsubscribe();
      } catch (error) {
        console.error("Error in auth state:", error);
        setLoading(false);
        setError(`Authentication error: ${error.message}`);
      }
    };
    
    fetchUserData();
  }, [navigate]);
  
  const handleEditProfile = () => {
    navigate('/profile');
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 max-w-md w-full bg-white rounded-lg shadow-lg border border-gray-100">
          <div className="animate-spin h-12 w-12 border-4 border-black border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 max-w-md w-full bg-white rounded-lg shadow-lg border border-gray-100">
          <div className="bg-red-100 p-3 rounded-full inline-block mb-4">
            <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Profile</h3>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-black text-white text-sm rounded-md hover:bg-gray-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Modern gradient */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-500 py-8 px-4 relative text-white">
        <h1 className="text-center text-3xl font-bold">User Profile</h1>
        <p className="mt-2 text-center text-white/80 max-w-lg mx-auto">
          Your personal information and preferences
        </p>
        
        <div className="absolute -bottom-5 left-0 right-0 h-10 bg-gray-50" style={{
          clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 0 100%)',
          opacity: 0.3
        }}></div>
      </div>
      
      <div className="container mx-auto px-4 py-6 max-w-4xl -mt-5">
        {/* Profile Overview Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8 border border-gray-100 relative z-10">
          <div className="p-8 flex flex-col md:flex-row md:items-center">
            <div className="flex-shrink-0 mb-6 md:mb-0 md:mr-8 flex flex-col items-center md:items-start">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-indigo-100 shadow-lg relative">
                <img 
                  src={userData.photoURL || defaultAvatar} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/30 to-transparent"></div>
              </div>
              
              <div className="mt-6 flex space-x-2">
                <button
                  onClick={handleEditProfile}
                  className="px-4 py-2 bg-purple-600 text-white text-sm rounded-full hover:bg-purple-700 transition-colors duration-300 flex items-center shadow-md"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Edit Profile
                </button>
              </div>
            </div>
            
            <div className="flex-grow text-center md:text-left py-4 md:pr-6 md:pl-6 md:border-l md:border-gray-200">
              <h2 className="text-3xl font-bold text-gray-900 mb-1">{userData.fullName}</h2>
              {userData.displayName && (
                <p className="text-gray-600 text-lg mb-4">@{userData.displayName}</p>
              )}
              
              <div className="flex flex-wrap gap-3 justify-center md:justify-start mt-4">
                {userData.emailVerified && (
                  <div className="inline-flex items-center bg-green-50 px-3 py-1 rounded-full text-sm text-green-700 font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Verified Account
                  </div>
                )}
                
                <div className="inline-flex items-center bg-purple-50 px-3 py-1 rounded-full text-sm text-purple-700 font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {userData.phoneNumber || "No phone added"}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Personal Information */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <div className="border-b border-gray-200">
              <h3 className="text-lg font-medium text-white px-6 py-4 bg-gradient-to-r from-indigo-600 to-blue-500 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Personal Information
              </h3>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-500">Full Name</span>
                  <span className="text-sm text-gray-900">{userData.fullName}</span>
                </div>
                
                {userData.displayName && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-500">Display Name</span>
                    <span className="text-sm text-gray-900">@{userData.displayName}</span>
                  </div>
                )}
                
                {userData.dateOfBirth && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-500">Date of Birth</span>
                    <span className="text-sm text-gray-900">{new Date(userData.dateOfBirth).toLocaleDateString()}</span>
                  </div>
                )}
                
                {userData.gender && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-500">Gender</span>
                    <span className="text-sm text-gray-900 capitalize">{userData.gender}</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-500">Email</span>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-900">{userData.email}</span>
                    {userData.emailVerified && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
                
                {userData.location && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-500">Location</span>
                    <span className="text-sm text-gray-900">{userData.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Preferences */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <div className="border-b border-gray-200">
              <h3 className="text-lg font-medium text-white px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-500 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Preferences
              </h3>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-500">Language</span>
                  <span className="text-sm text-gray-900">
                    {userData.language === 'en' ? 'English' :
                     userData.language === 'es' ? 'Spanish' :
                     userData.language === 'fr' ? 'French' :
                     userData.language === 'de' ? 'German' :
                     userData.language === 'zh' ? 'Chinese' :
                     userData.language === 'hi' ? 'Hindi' :
                     userData.language === 'ar' ? 'Arabic' : userData.language}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-500">Timezone</span>
                  <span className="text-sm text-gray-900">{userData.timezone}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-500">Email Notifications</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${userData.receiveEmails ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {userData.receiveEmails ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-500">Dark Mode</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${userData.darkMode ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                    {userData.darkMode ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-500">Data Sharing</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${userData.shareData ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                    {userData.shareData ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                
                {userData.updatedAt && (
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm font-medium text-gray-500">Last Updated</span>
                    <span className="text-xs text-gray-500">{userData.updatedAt.toLocaleDateString()} at {userData.updatedAt.toLocaleTimeString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => navigate('/chat')}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors duration-300 flex items-center shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            Chat with Medibot
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;