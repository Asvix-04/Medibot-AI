import React, { useEffect, useRef, useState, useCallback } from 'react';

const NearbyFacilitiesMap = ({ 
  userLocation, 
  onFacilitySelect,
  selectedFacility,
  darkMode = false 
}) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [placesService, setPlacesService] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize map when component mounts and userLocation is available
  useEffect(() => {
    if (!userLocation || !window.google) return;
    
    const mapOptions = {
      center: userLocation,
      zoom: 14,
      styles: darkMode ? [
        { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
        // Add more dark mode styling as needed
      ] : [],
      mapTypeControl: false
    };
    
    const newMap = new window.google.maps.Map(mapRef.current, mapOptions);
    setMap(newMap);
    
    // Add marker for user's location
    new window.google.maps.Marker({
      position: userLocation,
      map: newMap,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: "#4285F4",
        fillOpacity: 0.8,
        strokeWeight: 2,
        strokeColor: "#FFFFFF",
      },
      title: "Your Location"
    });
    
    // Initialize Places service
    const service = new window.google.maps.places.PlacesService(newMap);
    setPlacesService(service);
    
  }, [userLocation, darkMode]);

  // Function to search for nearby facilities - wrap with useCallback
  const searchNearbyFacilities = useCallback((type) => {
    if (!placesService || !userLocation) return;
    
    setLoading(true);
    setError(null);
    
    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));
    setMarkers([]);
    
    const request = {
      location: userLocation,
      radius: '5000', // 5km radius
      type: type // 'hospital', 'pharmacy', etc.
    };
    
    placesService.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setFacilities(results);
        
        // Create markers for each facility
        const newMarkers = results.map(place => {
          const marker = new window.google.maps.Marker({
            position: place.geometry.location,
            map: map,
            title: place.name,
            animation: window.google.maps.Animation.DROP
          });
          
          // Add click event to marker
          marker.addListener('click', () => {
            onFacilitySelect(place);
          });
          
          return marker;
        });
        
        setMarkers(newMarkers);
        
        // Adjust map bounds to include all markers
        const bounds = new window.google.maps.LatLngBounds();
        bounds.extend(userLocation);
        results.forEach(place => bounds.extend(place.geometry.location));
        map.fitBounds(bounds);
        
      } else {
        setError(`Error finding nearby ${type}s: ${status}`);
      }
      
      setLoading(false);
    });
  }, [placesService, userLocation, markers, map, setFacilities, setMarkers, setError, setLoading, onFacilitySelect]);

  // Now your useEffect will work properly with the memoized function
  useEffect(() => {
    if (map && placesService) {
      window.searchNearbyFacilities = searchNearbyFacilities;
    }
  }, [map, placesService, searchNearbyFacilities]);

  return (
    <div className="h-full relative">
      <div ref={mapRef} className="h-full w-full rounded-lg"></div>
      
      {loading && (
        <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md">
          <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      )}
      
      {error && (
        <div className={`absolute top-4 left-4 right-4 p-3 rounded-lg ${
          darkMode ? 'bg-red-900/70 text-white' : 'bg-red-100 text-red-800'
        }`}>
          {error}
        </div>
      )}
      
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