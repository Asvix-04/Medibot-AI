import React, { useState, useEffect, useRef, useCallback } from 'react'; // Add useCallback
import { auth, db } from '../../firebase';
import { 
  collection, 
  getDocs, 
  query, 
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { useToast } from '../../context/ToastContext';
import { useReactToPrint } from 'react-to-print';
import MedicationForm from './medication/MedicationForm';
import MedicationList from './medication/MedicationList';
import { useLocation } from 'react-router-dom';

const MedicationManager = ({ darkMode }) => {
  const location = useLocation();
  
  // States
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingMedication, setEditingMedication] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingMedicationId, setDeletingMedicationId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('current');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Print functionality ref
  const printComponentRef = useRef();
  
  // Toast notifications
  const { addToast } = useToast();
  
  // Fetch medications on component mount
  useEffect(() => {
    fetchMedications();
  }, [fetchMedications]);
  
  // Add this effect after your other useEffect hooks
  useEffect(() => {
    // Check if we should open the add form (when navigated from dashboard)
    if (location.state?.openAddForm) {
      setShowAddForm(true);
      // Clean up the state so refreshing doesn't reopen the form
      window.history.replaceState({}, document.title);
    }
  }, [location]);
  
  // Add this useEffect after your existing ones

  useEffect(() => {
    // Verify Firebase connection
    console.log("Firebase auth state:", auth.currentUser ? "Logged in" : "Not logged in");
    
    // Check if collection paths are correct
    if (auth.currentUser) {
      console.log("Collection path:", `users/${auth.currentUser.uid}/medications`);
    }
  }, []);
  
  // Helper functions for date formatting
  function formatDateForInput(date) {
    return date.toISOString().split('T')[0];
  }
  
  // Check if medication is active (current)
  function isMedicationActive(medication) {
    const today = new Date();
    const startDate = new Date(medication.startDate);
    const endDate = medication.endDate ? new Date(medication.endDate) : null;
    
    return startDate <= today && (!endDate || endDate >= today);
  }
  
  // Handle print medication list
  const handlePrint = useReactToPrint({
    content: () => printComponentRef.current,
    documentTitle: "Medication List",
    onAfterPrint: () => addToast("Medication list printed successfully", "success")
  });

  // Fetch medications from database
  const fetchMedications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null); // Reset any previous errors
      
      const user = auth.currentUser;
      
      if (!user) {
        console.log("No authenticated user found");
        // Add visible error or redirect to login
        setError("You must be signed in to view medications. Please sign in and try again.");
        setLoading(false);
        return;
      }
      
      console.log("Fetching medications for user:", user.uid); // Debug log
      
      const medicationsRef = collection(db, "users", user.uid, "medications");
      const q = query(medicationsRef, orderBy("startDate", "desc"));
      
      const querySnapshot = await getDocs(q);
      const medicationsData = [];
      
      console.log("Medications data count:", querySnapshot.size); // Debug log
      
      querySnapshot.forEach((doc) => {
        // Existing code to process documents
        const data = doc.data();
        
        // Convert Firestore timestamps to JS Date objects if they exist
        const startDate = data.startDate instanceof Timestamp ? 
          data.startDate.toDate().toISOString().split('T')[0] : data.startDate;
          
        const endDate = data.endDate instanceof Timestamp ? 
          data.endDate.toDate().toISOString().split('T')[0] : data.endDate;
        
        medicationsData.push({
          id: doc.id,
          ...data,
          startDate,
          endDate,
          // Calculate next dose based on time of day
          nextDose: calculateNextDose(data.timeOfDay)
        });
      });
      
      setMedications(medicationsData);
    } catch (err) {
      console.error("Error fetching medications:", err);
      setError(`Failed to load medications: ${err.message}`);
      addToast(`Error loading medications: ${err.message}`, "error");
    } finally {
      setLoading(false);
    }
  }, [addToast]); // Include dependencies used inside the function
  
  // Now your useEffect with fetchMedications in dependencies
  useEffect(() => {
    fetchMedications();
  }, [fetchMedications]); // Add fetchMedications to the dependency array
  
  
  
  // Calculate next dose time based on medication schedule
  const calculateNextDose = (timeOfDay) => {
    if (!timeOfDay || !timeOfDay.length) return null;
    
    const now = new Date();
    const today = new Date();
    let nextDose = null;
    
    // Find the next dose time today
    for (const time of timeOfDay) {
      const [hours, minutes] = time.split(':').map(Number);
      const doseTime = new Date(today);
      doseTime.setHours(hours, minutes, 0, 0);
      
      if (doseTime > now) {
        nextDose = doseTime;
        break;
      }
    }
    
    // If no dose time is found for today, use the first dose time tomorrow
    if (!nextDose && timeOfDay.length > 0) {
      const [hours, minutes] = timeOfDay[0].split(':').map(Number);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(hours, minutes, 0, 0);
      nextDose = tomorrow;
    }
    
    return nextDose;
  };
  
  // Set up medication for editing
  const startEditingMedication = (medication) => {
    setEditingMedication(medication);
    setShowEditForm(true);
  };
  
  // Set up medication for deletion
  const startDeleteMedication = (id) => {
    setDeletingMedicationId(id);
    setShowDeleteConfirm(true);
  };
  
  // Filter medications based on selected status
  const filteredMedications = medications.filter(medication => {
    const isActive = isMedicationActive(medication);
    
    switch (filterStatus) {
      case 'current':
        return isActive;
      case 'past':
        return !isActive && new Date(medication.endDate) < new Date();
      case 'future':
        return !isActive && new Date(medication.startDate) > new Date();
      default:
        return true;
    }
  });
  
  // Further filter by search query
  const searchedMedications = filteredMedications.filter(medication => {
    const searchLower = searchQuery.toLowerCase();
    return (
      medication.name.toLowerCase().includes(searchLower) ||
      medication.prescribedBy?.toLowerCase().includes(searchLower) ||
      medication.reason?.toLowerCase().includes(searchLower) ||
      medication.pharmacy?.toLowerCase().includes(searchLower)
    );
  });

  // Debug information (remove in production)
  console.log("MedicationManager render state:", { 
    medications: medications.length, 
    loading, 
    error, 
    showAddForm 
  });

  return (
    <div className={`max-w-6xl mx-auto ${darkMode ? 'text-white' : 'text-gray-900'}`}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Medication Manager</h1>
        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Manage your medications, schedule reminders, and keep track of your prescription history
        </p>
      </div>
      
      {/* Search and Filter Controls */}
      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } p-4 rounded-xl shadow-sm border`}>
        <div className="flex gap-2">
          <button 
            onClick={() => setFilterStatus('current')}
            className={`px-3 py-2 rounded-lg text-sm font-medium ${
              filterStatus === 'current' 
                ? (darkMode ? 'bg-indigo-700 text-white' : 'bg-indigo-100 text-indigo-800') 
                : (darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600')
            } transition-colors`}
          >
            Current
          </button>
          <button 
            onClick={() => setFilterStatus('past')}
            className={`px-3 py-2 rounded-lg text-sm font-medium ${
              filterStatus === 'past' 
                ? (darkMode ? 'bg-indigo-700 text-white' : 'bg-indigo-100 text-indigo-800') 
                : (darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600')
            } transition-colors`}
          >
            Past
          </button>
          <button 
            onClick={() => setFilterStatus('future')}
            className={`px-3 py-2 rounded-lg text-sm font-medium ${
              filterStatus === 'future' 
                ? (darkMode ? 'bg-indigo-700 text-white' : 'bg-indigo-100 text-indigo-800') 
                : (darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600')
            } transition-colors`}
          >
            Future
          </button>
          <button 
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-2 rounded-lg text-sm font-medium ${
              filterStatus === 'all' 
                ? (darkMode ? 'bg-indigo-700 text-white' : 'bg-indigo-100 text-indigo-800') 
                : (darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600')
            } transition-colors`}
          >
            All
          </button>
        </div>
        
        <div className="w-full sm:w-auto">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search medications..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-9 pr-4 py-2 rounded-lg text-sm w-full ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'
              } border focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors`}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mb-6">
        <button
          onClick={() => setShowAddForm(true)}
          className={`flex items-center px-4 py-2 rounded-lg font-medium ${
            darkMode 
              ? 'bg-indigo-700 hover:bg-indigo-800' 
              : 'bg-indigo-600 hover:bg-indigo-700'
          } text-white transition-colors`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Medication
        </button>
        <button
          onClick={handlePrint}
          className={`flex items-center px-4 py-2 rounded-lg font-medium ${
            darkMode 
              ? 'bg-gray-700 hover:bg-gray-800 text-white' 
              : 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700'
          } transition-colors`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print Medication List
        </button>
      </div>

      {/* Debug info - remove in production */}
      {process.env.NODE_ENV !== 'production' && (
        <div className="mb-4 p-2 bg-yellow-100 text-yellow-800 rounded text-xs">
          <div><strong>Debug:</strong> Loading: {loading.toString()}</div>
          <div>Error: {error || 'None'}</div>
          <div>Medications: {medications.length}</div>
          <div>Filtered: {searchedMedications.length}</div>
          <div>User: {auth.currentUser?.uid || 'Not authenticated'}</div>
        </div>
      )}
      
      {/* Medication List Component */}
      <MedicationList 
        medications={medications}
        searchedMedications={searchedMedications}
        loading={loading}
        error={error}
        darkMode={darkMode}
        isMedicationActive={isMedicationActive}
        startEditingMedication={startEditingMedication}
        startDeleteMedication={startDeleteMedication}
        onAddMedication={() => setShowAddForm(true)}
        onClearFilters={() => { setSearchQuery(''); setFilterStatus('all'); }}
        printRef={printComponentRef}
        fetchMedications={fetchMedications}
      />
      
      {/* Medication Form for Add/Edit */}
      <MedicationForm
        showAddForm={showAddForm}
        setShowAddForm={setShowAddForm}
        showEditForm={showEditForm}
        setShowEditForm={setShowEditForm}
        editingMedication={editingMedication}
        setEditingMedication={setEditingMedication}
        showDeleteConfirm={showDeleteConfirm}
        setShowDeleteConfirm={setShowDeleteConfirm}
        deletingMedicationId={deletingMedicationId}
        setDeletingMedicationId={setDeletingMedicationId}
        fetchMedications={fetchMedications}
        darkMode={darkMode}
        formatDateForInput={formatDateForInput}
      />
    </div>
  );
};

export default MedicationManager;