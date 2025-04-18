import React from 'react';

const NearbyFacilitiesMap = ({ 
  userLocation, 
  onFacilitySelect,
  selectedFacility,
  darkMode = false 
}) => {
  return (
    <div className="h-full relative">
      {/* Map placeholder */}
      <div className={`h-full w-full rounded-lg flex items-center justify-center ${
        darkMode ? 'bg-gray-700' : 'bg-gray-100'
      }`}>
        <div className="text-center p-6 max-w-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <h3 className="text-lg font-medium mb-2">Map Not Available</h3>
          <p className="text-gray-500 mb-4">
            The interactive map showing nearby medical facilities will be available once the Google Maps API key is configured.
          </p>
          <p className="text-sm text-gray-400">
            You can still manually enter location details in the appointment form.
          </p>
        </div>
      </div>
      
      {/* Selected facility info - if provided through demo data */}
      {selectedFacility && (
        <div className={`absolute bottom-4 left-4 right-4 p-4 rounded-md shadow-lg ${
          darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
        }`}>
          <h3 className="font-medium">{selectedFacility.name}</h3>
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {selectedFacility.vicinity}
          </p>
          {selectedFacility.rating && (
            <div className="flex items-center mt-1">
              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Rating: {selectedFacility.rating} 
              </span>
              <span className="text-yellow-500 ml-1">★</span>
            </div>
          )}
          <div className="flex justify-end mt-2">
            <button
              onClick={() => onFacilitySelect(selectedFacility)}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Select This Location
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NearbyFacilitiesMap;