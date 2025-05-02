import React from 'react';

const LocationPermissionModal = ({ onResponse, darkMode = false }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`max-w-md w-full rounded-lg shadow-lg p-6 ${
        darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      }`}>
        <div className="text-center mb-6">
          <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-blue-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium mt-3">Location Access</h3>
        </div>
        
        <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Medibot would like to access your location to show you nearby medical facilities such as hospitals, clinics, and pharmacies.
        </p>
        
        <div className={`mb-6 p-4 rounded-md ${
          darkMode ? 'bg-gray-700' : 'bg-blue-50'
        }`}>
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-blue-800'}`}>
            This helps you find the nearest healthcare providers. Your location data is only used to display nearby options and is never stored permanently.
          </p>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button 
            onClick={() => onResponse(false)}
            className={`px-4 py-2 rounded-md ${
              darkMode 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
            }`}
          >
            Not Now
          </button>
          <button 
            onClick={() => onResponse(true)}
            className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white"
          >
            Allow Access
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationPermissionModal;