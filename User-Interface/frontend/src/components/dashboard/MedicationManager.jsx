import React, { useState, useEffect, useRef, useCallback } from 'react';
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
import { useLocation, useNavigate } from 'react-router-dom';
import medibot_logo from '../../assets/medibot_logo.jpg';

// Demo medications constant stays unchanged
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
  const navigate = useNavigate();
  
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
  const [dashboardStats, setDashboardStats] = useState({
    current: 0,
    upcoming: 0,
    dueToday: 0,
    expiringSoon: 0
  });
  
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

  // Check if medication is due today
  function isMedicationDueToday(medication) {
    if (!medication.nextDose) return false;
    const today = new Date();
    const nextDose = new Date(medication.nextDose);
    return nextDose.getDate() === today.getDate() && 
           nextDose.getMonth() === today.getMonth() && 
           nextDose.getFullYear() === today.getFullYear();
  }
  
  // Check if medication is expiring soon (within 7 days)
  function isMedicationExpiringSoon(medication) {
    if (!medication.endDate) return false;
    const today = new Date();
    const endDate = new Date(medication.endDate);
    const daysUntilExpiration = Math.round((endDate - today) / (1000 * 60 * 60 * 24));
    return daysUntilExpiration >= 0 && daysUntilExpiration <= 7;
  }

  // Format time difference for next dose
  function formatTimeDiff(nextDoseDate) {
    if (!nextDoseDate) return 'Not scheduled';
    
    const now = new Date();
    const nextDose = new Date(nextDoseDate);
    const diffMs = nextDose - now;
    const diffMin = Math.floor(diffMs / 60000);
    
    if (diffMin < 0) return 'Overdue';
    if (diffMin < 60) return `In ${diffMin} min`;
    
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `In ${diffHours} hr`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `In ${diffDays} day${diffDays > 1 ? 's' : ''}`;
  }
  
  // Handle print medication list
  const handlePrint = useReactToPrint({
    content: () => printComponentRef.current,
    documentTitle: "Medication List",
    onAfterPrint: () => addToast("Medication list printed successfully", "success")
  });

  // Calculate next dose useCallback
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
  }, []);

  // Calculate dashboard statistics
  const calculateDashboardStats = useCallback((meds) => {
    let current = 0;
    let upcoming = 0;
    let dueToday = 0;
    let expiringSoon = 0;
    
    meds.forEach(med => {
      if (isMedicationActive(med)) {
        current++;
        if (isMedicationDueToday(med)) dueToday++;
      }
      
      if (new Date(med.startDate) > new Date()) {
        upcoming++;
      }
      
      if (isMedicationExpiringSoon(med)) {
        expiringSoon++;
      }
    });
    
    setDashboardStats({
      current,
      upcoming,
      dueToday,
      expiringSoon
    });
  }, []);

  // Fetch medications from database
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
          calculateDashboardStats(DEMO_MEDICATIONS);
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
        calculateDashboardStats(DEMO_MEDICATIONS);
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
        
        const medsToUse = medicationsData.length > 0 ? medicationsData : DEMO_MEDICATIONS;
        setMedications(medsToUse);
        calculateDashboardStats(medsToUse);
      }
    } catch (err) {
      console.error("Error fetching medications:", err);
      setError(`Failed to load medications: ${err.message}`);
      addToast(`Error loading medications: ${err.message}`, "error");
      
      // Fall back to demo data on error
      if (process.env.NODE_ENV !== 'production') {
        console.log("Error occurred, falling back to demo data");
        setMedications(DEMO_MEDICATIONS);
        calculateDashboardStats(DEMO_MEDICATIONS);
      }
    } finally {
      setLoading(false);
    }
  }, [addToast, calculateNextDose, calculateDashboardStats]);
  
  // Initial fetch
  useEffect(() => {
    fetchMedications();
  }, [fetchMedications]);
  
  // Check for add form navigation from dashboard
  useEffect(() => {
    if (location.state?.openAddForm) {
      setShowAddForm(true);
      window.history.replaceState({}, document.title);
    }
  }, [location]);
  
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
      case 'dueSoon':
        return isActive && medication.nextDose && 
              (new Date(medication.nextDose) - new Date()) < 24 * 60 * 60 * 1000; // Due within 24 hours
      default:
        return true;
    }
  });
  
  // Further filter by search query
  const searchedMedications = filteredMedications.filter(medication => {
    if (!searchQuery.trim()) return true;
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

  // Get medications due today
  const getDueTodayMedications = () => {
    return medications.filter(med => isMedicationDueToday(med));
  };

  return (
    <div className="min-h-screen bg-white py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-violet-700 to-violet-900 py-5 px-4 mb-6 rounded-lg relative shadow-md">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full bg-white p-1 mr-4 shadow-lg flex items-center justify-center">
                <img className="h-10 w-auto rounded-full" src={medibot_logo} alt="Medibot" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Medication Manager</h1>
                <p className="text-xs text-violet-200">
                  Manage prescriptions, schedule reminders, and track medication history
                </p>
              </div>
            </div>
            
            {/* Return to dashboard button */}
            <button 
              onClick={() => navigate('/dashboard')}
              className="text-white bg-violet-800/40 hover:bg-violet-800/70 px-3 py-1 rounded-md text-sm flex items-center transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Dashboard
            </button>
          </div>
          
          {/* Decorative triangle */}
          <div className="absolute -bottom-3 left-0 right-0 h-6 bg-white" style={{
            clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 0 100%)',
            opacity: 0.1
          }}></div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Current Medications</p>
                <h3 className="text-2xl font-bold text-violet-700">{dashboardStats.current}</h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-violet-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-violet-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Due Today</p>
                <h3 className="text-2xl font-bold text-violet-700">{dashboardStats.dueToday}</h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Upcoming</p>
                <h3 className="text-2xl font-bold text-violet-700">{dashboardStats.upcoming}</h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Expiring Soon</p>
                <h3 className="text-2xl font-bold text-violet-700">{dashboardStats.expiringSoon}</h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main content area */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100 p-6">
          {/* Search and Filter Controls */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Find Medications</h2>
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setFilterStatus('current')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    filterStatus === 'current' 
                      ? 'bg-violet-600 text-white shadow-sm' 
                      : 'bg-gray-100 text-gray-600 hover:bg-violet-50 hover:text-violet-700'
                  }`}
                >
                  Current
                </button>
                <button 
                  onClick={() => setFilterStatus('dueSoon')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    filterStatus === 'dueSoon' 
                      ? 'bg-violet-600 text-white shadow-sm' 
                      : 'bg-gray-100 text-gray-600 hover:bg-violet-50 hover:text-violet-700'
                  }`}
                >
                  Due Soon
                </button>
                <button 
                  onClick={() => setFilterStatus('past')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    filterStatus === 'past' 
                      ? 'bg-violet-600 text-white shadow-sm' 
                      : 'bg-gray-100 text-gray-600 hover:bg-violet-50 hover:text-violet-700'
                  }`}
                >
                  Past
                </button>
                <button 
                  onClick={() => setFilterStatus('future')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    filterStatus === 'future' 
                      ? 'bg-violet-600 text-white shadow-sm' 
                      : 'bg-gray-100 text-gray-600 hover:bg-violet-50 hover:text-violet-700'
                  }`}
                >
                  Future
                </button>
                <button 
                  onClick={() => setFilterStatus('all')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    filterStatus === 'all' 
                      ? 'bg-violet-600 text-white shadow-sm' 
                      : 'bg-gray-100 text-gray-600 hover:bg-violet-50 hover:text-violet-700'
                  }`}
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
                    className="pl-9 pr-4 py-2 rounded-md text-sm w-full bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
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
                className="group relative flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-violet-600 to-violet-800 hover:from-violet-700 hover:to-violet-900 focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-sm transition-all duration-200"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-violet-300 group-hover:text-violet-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </span>
                <span className="pl-5">Add Medication</span>
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center px-4 py-2 border border-violet-200 rounded-md shadow-sm text-sm font-medium text-violet-700 bg-white hover:bg-violet-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-all duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print Medication List
              </button>
            </div>
          </div>
          
          {/* Medications Due Today Section */}
          {dashboardStats.dueToday > 0 && filterStatus !== 'dueSoon' && (
            <div className="mb-6 p-4 rounded-lg bg-violet-50 border border-violet-100">
              <h3 className="text-md font-medium text-violet-900 mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-violet-700" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                Medications Due Today
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {getDueTodayMedications().map(medication => (
                  <div key={`due-${medication.id}`} className="flex items-center p-3 bg-white rounded-md border border-violet-100 shadow-sm">
                    <div className="mr-3 flex-shrink-0 h-10 w-10 rounded-full bg-violet-100 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                    </div>
                    <div className="flex-grow">
                      <div className="font-medium text-gray-900">{medication.name}</div>
                      <div className="text-sm text-gray-500">{formatTimeDiff(medication.nextDose)}</div>
                    </div>
                    <button
                      onClick={() => startEditingMedication(medication)}
                      className="ml-2 p-1 rounded-full text-violet-600 hover:bg-violet-50"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
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
        </div>
        
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
    </div>
  );
};

export default MedicationManager;