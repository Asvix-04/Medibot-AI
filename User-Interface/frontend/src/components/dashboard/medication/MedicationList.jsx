import React from 'react';

const MedicationList = ({ 
  medications,
  searchedMedications,
  loading,
  error,
  darkMode,
  isMedicationActive,
  startEditingMedication,
  startDeleteMedication,
  onAddMedication,
  onClearFilters,
  printRef,
  fetchMedications
}) => {
  
  // Format date to display in more readable format
  const formatDateDisplay = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Format time for display
  const formatTime = (timeString) => {
    if (!timeString) return '';
    
    try {
      const [hours, minutes] = timeString.split(':').map(Number);
      const date = new Date();
      date.setHours(hours, minutes, 0, 0);
      
      return new Intl.DateTimeFormat(undefined, {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }).format(date);
    } catch (error) {
      return timeString;
    }
  };
  
  // Return next dose in human-readable format
  const formatNextDose = (nextDose) => {
    if (!nextDose) return 'Not scheduled';
    
    const now = new Date();
    const nextDoseDate = new Date(nextDose);
    
    // If it's today
    if (nextDoseDate.toDateString() === now.toDateString()) {
      return `Today at ${new Intl.DateTimeFormat(undefined, {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }).format(nextDoseDate)}`;
    }
    
    // If it's tomorrow
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (nextDoseDate.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow at ${new Intl.DateTimeFormat(undefined, {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }).format(nextDoseDate)}`;
    }
    
    // Otherwise show full date and time
    return new Intl.DateTimeFormat(undefined, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(nextDoseDate);
  };

  // Loading State
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className={`w-12 h-12 rounded-full animate-spin border-4 border-solid border-t-indigo-500 border-r-transparent border-b-indigo-500 border-l-transparent`}></div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className={`p-6 rounded-xl ${darkMode ? 'bg-red-900/30 text-red-200' : 'bg-red-50 text-red-800'} mb-6`}>
        <div className="flex items-center mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="font-medium">Error Loading Medications</h3>
        </div>
        <p className="text-sm">{error}</p>
        <button 
          onClick={fetchMedications}
          className={`mt-4 px-3 py-1 rounded-lg text-sm font-medium ${
            darkMode ? 'bg-red-700 hover:bg-red-800' : 'bg-red-100 hover:bg-red-200'
          } transition-colors`}
        >
          Try Again
        </button>
      </div>
    );
  }

  // Empty State - No medications at all
  if (medications.length === 0) {
    return (
      <div className={`text-center py-20 rounded-xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 bg-indigo-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium mb-2">No medications found</h3>
        <p className={`mb-6 max-w-sm mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          You haven't added any medications yet. Start by adding your first medication to keep track of your prescriptions.
        </p>
        <button
          onClick={onAddMedication}
          className={`inline-flex items-center px-4 py-2 rounded-lg font-medium ${
            darkMode 
              ? 'bg-indigo-700 hover:bg-indigo-800' 
              : 'bg-indigo-600 hover:bg-indigo-700'
          } text-white transition-colors`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Your First Medication
        </button>
      </div>
    );
  }

  // No medications match filter criteria
  if (searchedMedications.length === 0) {
    return (
      <div className={`text-center py-12 rounded-xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border mb-8`}>
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 bg-yellow-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium mb-2">No matching medications</h3>
        <p className={`mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          No medications match your current search or filter criteria.
        </p>
        <button
          onClick={onClearFilters}
          className={`text-sm px-4 py-2 rounded-lg ${
            darkMode 
              ? 'bg-gray-700 hover:bg-gray-600 text-white' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
          }`}
        >
          Clear filters
        </button>
      </div>
    );
  }

  // Main medication list display
  return (
    <>
      {/* Visible Medication Table */}
      <div className={`rounded-xl overflow-hidden ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border mb-8`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={darkMode ? 'bg-gray-900' : 'bg-gray-50'}>
              <tr>
                <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                  Medication
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                  Schedule
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                  Duration
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                  Next Dose
                </th>
                <th className={`px-6 py-3 text-right text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {searchedMedications.map((medication) => (
                <tr key={medication.id} className={darkMode ? 'hover:bg-gray-750' : 'hover:bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                        isMedicationActive(medication) 
                          ? 'bg-green-100 text-green-600'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium">{medication.name}</div>
                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{medication.dosage}</div>
                        {medication.reason && (
                          <div className={`text-xs italic mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>{medication.reason}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">{medication.frequency}</div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {medication.timeOfDay?.map(time => formatTime(time)).join(', ')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">{formatDateDisplay(medication.startDate)}</div>
                    {medication.endDate ? (
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        to {formatDateDisplay(medication.endDate)}
                      </div>
                    ) : (
                      <div className="text-xs rounded-full px-2 py-0.5 mt-1 bg-blue-100 text-blue-800 inline-block">
                        Ongoing
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {medication.nextDose && isMedicationActive(medication) ? (
                      <div>
                        <div className={`text-sm font-medium ${
                          new Date(medication.nextDose) - new Date() < 3600000 // Less than 1 hour
                            ? 'text-red-600' 
                            : darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {formatNextDose(medication.nextDose)}
                        </div>
                        {new Date(medication.nextDose) - new Date() < 3600000 && (
                          <div className="text-xs rounded-full px-2 py-0.5 mt-1 bg-red-100 text-red-800 inline-block">
                            Coming up soon
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {isMedicationActive(medication) ? 'Not scheduled' : 'Inactive'}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => startEditingMedication(medication)}
                      className={`mr-3 ${darkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-900'}`}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => startDeleteMedication(medication.id)}
                      className={darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-900'}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Printable Medication List (hidden until print) */}
      <div className="hidden">
        <div ref={printRef} className="p-8">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold">Medication List</h1>
            <p className="text-gray-600">Generated on {new Date().toLocaleDateString()}</p>
          </div>
          
          <table className="w-full border-collapse border">
            <thead>
              <tr>
                <th className="border p-2 text-left">Medication & Dosage</th>
                <th className="border p-2 text-left">Instructions</th>
                <th className="border p-2 text-left">Schedule</th>
                <th className="border p-2 text-left">Duration</th>
                <th className="border p-2 text-left">Prescribed By</th>
              </tr>
            </thead>
            <tbody>
              {medications.filter(med => isMedicationActive(med)).map((medication) => (
                <tr key={`print-${medication.id}`}>
                  <td className="border p-2">
                    <div className="font-bold">{medication.name}</div>
                    <div>{medication.dosage}</div>
                    {medication.reason && <div className="text-sm italic mt-1">{medication.reason}</div>}
                  </td>
                  <td className="border p-2">
                    {medication.instructions || 'No specific instructions'}
                  </td>
                  <td className="border p-2">
                    <div>{medication.frequency}</div>
                    <div className="text-sm text-gray-600">
                      {medication.timeOfDay?.map(time => formatTime(time)).join(', ')}
                    </div>
                  </td>
                  <td className="border p-2">
                    <div>Start: {formatDateDisplay(medication.startDate)}</div>
                    {medication.endDate ? (
                      <div>End: {formatDateDisplay(medication.endDate)}</div>
                    ) : (
                      <div className="text-sm italic">Ongoing</div>
                    )}
                  </td>
                  <td className="border p-2">
                    {medication.prescribedBy || 'Not specified'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {medications.filter(med => isMedicationActive(med)).length === 0 && (
            <div className="text-center py-4">
              <p>No active medications to display.</p>
            </div>
          )}
          
          <div className="mt-8 text-xs text-gray-500">
            <p>This medication list is for informational purposes only. Always follow your healthcare provider's instructions.</p>
            <p className="mt-2">For emergency assistance, contact your doctor or local emergency services.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default MedicationList;