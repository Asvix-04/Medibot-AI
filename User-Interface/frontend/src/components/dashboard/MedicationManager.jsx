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
import medibot_logo from '../../assets/medibot_logo.jpg';

// Inside MedicationManager.jsx, add this constant near the top of the file
const DEMO_MEDICATIONS = [
  {
    id: 'demo-1',
    name: 'Metformin',
    dosage: '500mg',
    frequency: 'twice-daily',
    timeOfDay: ['08:00', '20:00'],
    startDate: '2023-12-01',
    endDate: null, // ongoing
    instructions: 'Take with food to minimize stomach upset',
    prescribedBy: 'Dr. Sarah Johnson',
    reason: 'Type 2 Diabetes',
    refills: 3,
    pharmacy: 'MediCare Pharmacy',
    notes: 'Working well, minimal side effects',
    nextDose: new Date(new Date().setHours(20, 0, 0, 0)) // Today at 8pm
  },
  {
    id: 'demo-2',
    name: 'Lisinopril',
    dosage: '10mg',
    frequency: 'once-daily',
    timeOfDay: ['09:00'],
    startDate: '2023-11-15',
    endDate: null, // ongoing
    instructions: 'Take in the morning with or without food',
    prescribedBy: 'Dr. Mark Williams',
    reason: 'Hypertension',
    refills: 5,
    pharmacy: 'HealthPlus Pharmacy',
    notes: 'Monitor blood pressure weekly',
    nextDose: new Date(new Date().setHours(9, 0, 0, 0)) // Today at 9am
  },
  {
    id: 'demo-3',
    name: 'Atorvastatin',
    dosage: '20mg',
    frequency: 'once-daily',
    timeOfDay: ['21:00'],
    startDate: '2023-10-20',
    endDate: null, // ongoing
    instructions: 'Take at night before bedtime',
    prescribedBy: 'Dr. Sarah Johnson',
    reason: 'High cholesterol',
    refills: 2,
    pharmacy: 'MediCare Pharmacy',
    notes: 'Follow up with blood work in 3 months',
    nextDose: new Date(new Date().setHours(21, 0, 0, 0)) // Today at 9pm
  },
  {
    id: 'demo-4',
    name: 'Vitamin D3',
    dosage: '2000 IU',
    frequency: 'once-daily',
    timeOfDay: ['08:00'],
    startDate: '2023-09-15',
    endDate: null, // ongoing
    instructions: 'Take with breakfast',
    prescribedBy: 'Dr. Jennifer Lee',
    reason: 'Vitamin D deficiency',
    refills: 11,
    pharmacy: 'HealthPlus Pharmacy',
    notes: '',
    nextDose: new Date(new Date().setHours(8, 0, 0, 0)) // Today at 8am
  },
  {
    id: 'demo-5',
    name: 'Amoxicillin',
    dosage: '500mg',
    frequency: 'three-times-daily',
    timeOfDay: ['08:00', '14:00', '20:00'],
    startDate: '2024-03-01',
    endDate: '2024-03-10', // completed course
    instructions: 'Take until all pills are finished, even if you feel better',
    prescribedBy: 'Dr. Mark Williams',
    reason: 'Bacterial infection',
    refills: 0,
    pharmacy: 'MediCare Pharmacy',
    notes: 'Completed full course',
    nextDose: null // Already completed
  }
];

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

  // Move calculateNextDose before fetchMedications and wrap it in useCallback
  const calculateNextDose = useCallback((timeOfDay) => {
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
  }, []); // No dependencies needed as it's a pure function

  // Fetch medications from database - now calculateNextDose is available
  const fetchMedications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const user = auth.currentUser;
      
      // For development/demo purposes
      const useDemoData = process.env.REACT_APP_USE_DEMO_DATA === 'true' || !user;
      
      if (useDemoData) {
        console.log("Using demo medication data");
        setTimeout(() => {
          setMedications(DEMO_MEDICATIONS);
          setLoading(false);
        }, 800); // Simulate loading delay for UI testing
        return;
      }
      
      if (!user) {
        console.log("No authenticated user found");
        setError("You must be signed in to view medications. Please sign in and try again.");
        setLoading(false);
        return;
      }
      
      console.log("Fetching medications for user:", user.uid);
      
      const medicationsRef = collection(db, "users", user.uid, "medications");
      const q = query(medicationsRef, orderBy("startDate", "desc"));
      
      const querySnapshot = await getDocs(q);
      const medicationsData = [];
      
      console.log("Medications data count:", querySnapshot.size);
      
      if (querySnapshot.size === 0 && process.env.NODE_ENV !== 'production') {
        // Use demo data if no medications found and not in production
        console.log("No medications found, using demo data");
        setMedications(DEMO_MEDICATIONS);
      } else {
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          
          const startDate = data.startDate instanceof Timestamp ? 
            data.startDate.toDate().toISOString().split('T')[0] : data.startDate;
            
          const endDate = data.endDate instanceof Timestamp ? 
            data.endDate.toDate().toISOString().split('T')[0] : data.endDate;
          
          medicationsData.push({
            id: doc.id,
            ...data,
            startDate,
            endDate,
            nextDose: calculateNextDose(data.timeOfDay)
          });
        });
        
        setMedications(medicationsData.length > 0 ? medicationsData : DEMO_MEDICATIONS);
      }
    } catch (err) {
      console.error("Error fetching medications:", err);
      setError(`Failed to load medications: ${err.message}`);
      addToast(`Error loading medications: ${err.message}`, "error");
      
      // Fall back to demo data on error
      if (process.env.NODE_ENV !== 'production') {
        console.log("Error occurred, falling back to demo data");
        setMedications(DEMO_MEDICATIONS);
      }
    } finally {
      setLoading(false);
    }
  }, [addToast, calculateNextDose]); // Now properly include calculateNextDose as a dependency
  
  // Now fetchMedications is defined before it's used in useEffect hooks
  useEffect(() => {
    fetchMedications();
  }, [fetchMedications]);
  
  useEffect(() => {
    // Check if we should open the add form (when navigated from dashboard)
    if (location.state?.openAddForm) {
      setShowAddForm(true);
      // Clean up the state so refreshing doesn't reopen the form
      window.history.replaceState({}, document.title);
    }
  }, [location]);
  
  useEffect(() => {
    // Verify Firebase connection
    console.log("Firebase auth state:", auth.currentUser ? "Logged in" : "Not logged in");
    
    // Check if collection paths are correct
    if (auth.currentUser) {
      console.log("Collection path:", `users/${auth.currentUser.uid}/medications`);
    }
  }, []);
  
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

  // Handle starting the edit process for a medication
  const startEditingMedication = (medication) => {
    setEditingMedication(medication);
    setShowEditForm(true);
  };

  // Handle starting the delete process for a medication
  const startDeleteMedication = (id) => {
    setDeletingMedicationId(id);
    setShowDeleteConfirm(true);
  };

  // Debug information (remove in production)
  console.log("MedicationManager render state:", { 
    medications: medications.length, 
    loading, 
    error, 
    showAddForm 
  });

  return (
    <div className="min-h-screen bg-white py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Black header with logo - matches signin/signup */}
        <div className="bg-black py-5 px-4 mb-6 rounded-t-lg relative">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img className="h-12 w-auto rounded-full p-1 bg-white mr-4" src={medibot_logo} alt="Medibot" />
              <div>
                <h1 className="text-2xl font-bold text-white">Medication Manager</h1>
                <p className="text-xs text-gray-400">
                  Manage prescriptions, schedule reminders, and track medication history
                </p>
              </div>
            </div>
          </div>
          
          {/* Decorative triangle at bottom of header */}
          <div className="absolute -bottom-3 left-0 right-0 h-6 bg-white" style={{
            clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 0 100%)',
            opacity: 0.1
          }}></div>
        </div>
        
        {/* Main content area - styled like the signin/signup form container */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100 p-6">
          {/* Search and Filter Controls */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Find Medications</h2>
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <div className="flex gap-2">
                <button 
                  onClick={() => setFilterStatus('current')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${
                    filterStatus === 'current' 
                      ? 'bg-black text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  } transition-colors`}
                >
                  Current
                </button>
                <button 
                  onClick={() => setFilterStatus('past')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${
                    filterStatus === 'past' 
                      ? 'bg-black text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  } transition-colors`}
                >
                  Past
                </button>
                <button 
                  onClick={() => setFilterStatus('future')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${
                    filterStatus === 'future' 
                      ? 'bg-black text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  } transition-colors`}
                >
                  Future
                </button>
                <button 
                  onClick={() => setFilterStatus('all')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${
                    filterStatus === 'all' 
                      ? 'bg-black text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  } transition-colors`}
                >
                  All
                </button>
              </div>
              
              <div className="w-full sm:w-auto">
                <div className="relative rounded-md">
                  <input 
                    type="text" 
                    placeholder="Search medications..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 rounded-md text-sm w-full bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-black focus:border-transparent"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setShowAddForm(true)}
                className="group relative flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-black"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 group-hover:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </span>
                Add Medication
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print Medication List
              </button>
            </div>
          </div>
          
          {/* Debug info - remove in production */}
          {process.env.NODE_ENV !== 'production' && (
            <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
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
            darkMode={false} // Override darkMode to match the signin/signup design
            isMedicationActive={isMedicationActive}
            startEditingMedication={startEditingMedication}
            startDeleteMedication={startDeleteMedication}
            onAddMedication={() => setShowAddForm(true)}
            onClearFilters={() => { setSearchQuery(''); setFilterStatus('all'); }}
            printRef={printComponentRef}
            fetchMedications={fetchMedications}
          />
        </div>
        
        {/* Medication Form for Add/Edit - update styling in MedicationForm component */}
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
          darkMode={false} // Override darkMode to match the signin/signup design
          formatDateForInput={formatDateForInput}
        />
      </div>
    </div>
  );
};

export default MedicationManager;