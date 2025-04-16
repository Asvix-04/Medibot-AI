import React, { useState, useEffect } from 'react';
import { auth, db } from '../../../firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  Timestamp
} from 'firebase/firestore';
import { useToast } from '../../../context/ToastContext';

const MedicationForm = ({ 
  showAddForm, 
  setShowAddForm, 
  showEditForm, 
  setShowEditForm, 
  editingMedication,
  setEditingMedication,
  showDeleteConfirm,
  setShowDeleteConfirm,
  deletingMedicationId,
  setDeletingMedicationId,
  fetchMedications,
  darkMode,
  formatDateForInput
}) => {
  const { addToast } = useToast();
  
  // Form data
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: 'once-daily',
    timeOfDay: ['08:00'],
    startDate: formatDateForInput(new Date()),
    endDate: '',
    instructions: '',
    prescribedBy: '',
    reason: '',
    refills: 0,
    pharmacy: '',
    notes: '',
  });
  
  // Validation errors
  const [errors, setErrors] = useState({});
  
  // Reset form state when editing medication changes
  useEffect(() => {
    if (editingMedication) {
      setFormData({
        name: editingMedication.name || '',
        dosage: editingMedication.dosage || '',
        frequency: editingMedication.frequency || 'once-daily',
        timeOfDay: editingMedication.timeOfDay || ['08:00'],
        startDate: editingMedication.startDate || '',
        endDate: editingMedication.endDate || '',
        instructions: editingMedication.instructions || '',
        prescribedBy: editingMedication.prescribedBy || '',
        reason: editingMedication.reason || '',
        refills: editingMedication.refills || 0,
        pharmacy: editingMedication.pharmacy || '',
        notes: editingMedication.notes || '',
      });
    }
  }, [editingMedication]);
  
  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      dosage: '',
      frequency: 'once-daily',
      timeOfDay: ['08:00'],
      startDate: formatDateForInput(new Date()),
      endDate: '',
      instructions: '',
      prescribedBy: '',
      reason: '',
      refills: 0,
      pharmacy: '',
      notes: '',
    });
    setErrors({});
  };
  
  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    // Validate required fields
    if (!formData.name.trim()) newErrors.name = 'Medication name is required';
    if (!formData.dosage.trim()) newErrors.dosage = 'Dosage is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    
    if (formData.endDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = 'End date must be after start date';
    }
    if (!formData.timeOfDay || formData.timeOfDay.length === 0) {
      newErrors.timeOfDay = 'At least one time is required';
    }
    if (formData.refills < 0) newErrors.refills = 'Refills cannot be negative';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'refills') {
      setFormData({
        ...formData,
        [name]: parseInt(value) || 0
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  // Handle time changes (for timeOfDay array)
  const handleTimeChange = (index, value) => {
    const updatedTimes = [...formData.timeOfDay];
    updatedTimes[index] = value;
    
    setFormData({
      ...formData,
      timeOfDay: updatedTimes
    });
  };
  
  // Add another time slot
  const addTimeSlot = () => {
    setFormData({
      ...formData,
      timeOfDay: [...formData.timeOfDay, '12:00']
    });
  };
  
  // Remove a time slot
  const removeTimeSlot = (index) => {
    const updatedTimes = formData.timeOfDay.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      timeOfDay: updatedTimes
    });
  };
  
  // Handle form submission for adding new medication
  const handleAddMedication = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No user is signed in");
      
      // Prepare data for Firestore
      const medicationData = {
        ...formData,
        startDate: formData.startDate,
        endDate: formData.endDate || null,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };
      
      // Save to Firestore
      const medicationsRef = collection(db, "users", user.uid, "medications");
      await addDoc(medicationsRef, medicationData);
      
      addToast("Medication added successfully", "success");
      resetForm();
      setShowAddForm(false);
      fetchMedications();
      
    } catch (error) {
      console.error("Error adding medication:", error);
      addToast(`Error adding medication: ${error.message}`, "error");
    }
  };
  
  // Handle form submission for editing medication
  const handleEditMedication = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No user is signed in");
      
      if (!editingMedication?.id) throw new Error("No medication ID provided for update");
      
      // Prepare data for Firestore
      const medicationData = {
        ...formData,
        startDate: formData.startDate,
        endDate: formData.endDate || null,
        updatedAt: Timestamp.now()
      };
      
      // Update in Firestore
      const medicationRef = doc(db, "users", user.uid, "medications", editingMedication.id);
      await updateDoc(medicationRef, medicationData);
      
      addToast("Medication updated successfully", "success");
      resetForm();
      setShowEditForm(false);
      setEditingMedication(null);
      fetchMedications();
      
    } catch (error) {
      console.error("Error updating medication:", error);
      addToast(`Error updating medication: ${error.message}`, "error");
    }
  };
  
  // Handle medication deletion
  const handleDeleteMedication = async () => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No user is signed in");
      
      if (!deletingMedicationId) throw new Error("No medication ID provided for deletion");
      
      // Delete from Firestore
      const medicationRef = doc(db, "users", user.uid, "medications", deletingMedicationId);
      await deleteDoc(medicationRef);
      
      addToast("Medication deleted successfully", "success");
      setShowDeleteConfirm(false);
      setDeletingMedicationId(null);
      fetchMedications();
      
    } catch (error) {
      console.error("Error deleting medication:", error);
      addToast(`Error deleting medication: ${error.message}`, "error");
    }
  };
  
  // Render add medication form modal
  const renderAddForm = () => {
    if (!showAddForm) return null;
    
    return (
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
          </div>
          
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          
          <div className={`inline-block align-bottom ${
            darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'
          } rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full`}>
            <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} px-4 py-3 flex justify-between items-center`}>
              <h3 className="text-lg font-medium">Add New Medication</h3>
              <button 
                onClick={() => setShowAddForm(false)}
                className={`rounded-md ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <form onSubmit={handleAddMedication} className="space-y-6">
                {renderFormFields()}
                
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className={`mr-3 px-4 py-2 rounded-lg font-medium ${
                      darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                    } transition-colors`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`px-4 py-2 rounded-lg font-medium ${
                      darkMode ? 'bg-indigo-700 hover:bg-indigo-800' : 'bg-indigo-600 hover:bg-indigo-700'
                    } text-white transition-colors`}
                  >
                    Add Medication
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Render edit medication form modal
  const renderEditForm = () => {
    if (!showEditForm) return null;
    
    return (
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
          </div>
          
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          
          <div className={`inline-block align-bottom ${
            darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'
          } rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full`}>
            <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} px-4 py-3 flex justify-between items-center`}>
              <h3 className="text-lg font-medium">Edit Medication</h3>
              <button 
                onClick={() => setShowEditForm(false)}
                className={`rounded-md ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <form onSubmit={handleEditMedication} className="space-y-6">
                {renderFormFields()}
                
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowEditForm(false)}
                    className={`mr-3 px-4 py-2 rounded-lg font-medium ${
                      darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                    } transition-colors`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`px-4 py-2 rounded-lg font-medium ${
                      darkMode ? 'bg-indigo-700 hover:bg-indigo-800' : 'bg-indigo-600 hover:bg-indigo-700'
                    } text-white transition-colors`}
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Render delete confirmation modal
  const renderDeleteConfirm = () => {
    if (!showDeleteConfirm) return null;
    
    return (
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
          </div>
          
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          
          <div className={`inline-block align-bottom ${
            darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'
          } rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full`}>
            <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} px-4 py-3 flex justify-between items-center`}>
              <h3 className="text-lg font-medium">Delete Medication</h3>
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className={`rounded-md ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <p className="mb-4">Are you sure you want to delete this medication? This action cannot be undone.</p>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className={`mr-3 px-4 py-2 rounded-lg font-medium ${
                    darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                  } transition-colors`}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteMedication}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    darkMode ? 'bg-red-700 hover:bg-red-800' : 'bg-red-600 hover:bg-red-700'
                  } text-white transition-colors`}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Common form fields for add and edit forms
  const renderFormFields = () => {
    return (
      <>
        {/* Basic Information */}
        <div>
          <h4 className={`text-md font-medium mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>Basic Information</h4>
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="name" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Medication Name*
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`block w-full px-3 py-2 rounded-md ${
                  errors.name ? 'border-red-300 focus:border-red-300 focus:ring focus:ring-red-200' : ''
                } ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
              />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
            </div>
            
            <div>
              <label htmlFor="dosage" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Dosage*
              </label>
              <input
                type="text"
                id="dosage"
                name="dosage"
                value={formData.dosage}
                onChange={handleChange}
                placeholder="e.g., 10mg, 1 tablet"
                className={`block w-full px-3 py-2 rounded-md ${
                  errors.dosage ? 'border-red-300 focus:border-red-300 focus:ring focus:ring-red-200' : ''
                } ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
              />
              {errors.dosage && <p className="mt-1 text-sm text-red-500">{errors.dosage}</p>}
            </div>
            
            <div>
              <label htmlFor="reason" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Reason for Taking
              </label>
              <input
                type="text"
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="e.g., High blood pressure"
                className={`block w-full px-3 py-2 rounded-md ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
              />
            </div>
          </div>
        </div>
        
        {/* Schedule */}
        <div>
          <h4 className={`text-md font-medium mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>Schedule</h4>
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="frequency" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Frequency
              </label>
              <select
                id="frequency"
                name="frequency"
                value={formData.frequency}
                onChange={handleChange}
                className={`block w-full px-3 py-2 rounded-md ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
              >
                <option value="once-daily">Once Daily</option>
                <option value="twice-daily">Twice Daily</option>
                <option value="three-times-daily">Three Times Daily</option>
                <option value="four-times-daily">Four Times Daily</option>
                <option value="every-other-day">Every Other Day</option>
                <option value="weekly">Weekly</option>
                <option value="as-needed">As Needed</option>
              </select>
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Time(s) of Day*
              </label>
              
              {formData.timeOfDay.map((time, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => handleTimeChange(index, e.target.value)}
                    className={`block flex-grow px-3 py-2 rounded-md ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                  />
                  
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeTimeSlot(index)}
                      className="ml-2 p-2 rounded-full text-red-500 hover:bg-red-100 hover:text-red-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
              {errors.timeOfDay && <p className="mt-1 text-sm text-red-500">{errors.timeOfDay}</p>}
              
              <button
                type="button"
                onClick={addTimeSlot}
                className={`mt-2 px-3 py-1 rounded-lg text-sm font-medium ${
                  darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                } transition-colors`}
              >
                Add Another Time
              </button>
            </div>
          </div>
        </div>
        
        {/* Duration */}
        <div>
          <h4 className={`text-md font-medium mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>Duration</h4>
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="startDate" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Start Date*
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className={`block w-full px-3 py-2 rounded-md ${
                  errors.startDate ? 'border-red-300 focus:border-red-300 focus:ring focus:ring-red-200' : ''
                } ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
              />
              {errors.startDate && <p className="mt-1 text-sm text-red-500">{errors.startDate}</p>}
            </div>
            
            <div>
              <label htmlFor="endDate" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className={`block w-full px-3 py-2 rounded-md ${
                  errors.endDate ? 'border-red-300 focus:border-red-300 focus:ring focus:ring-red-200' : ''
                } ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
              />
              {errors.endDate && <p className="mt-1 text-sm text-red-500">{errors.endDate}</p>}
            </div>
          </div>
        </div>
        
        {/* Additional Information */}
        <div>
          <h4 className={`text-md font-medium mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>Additional Information</h4>
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="instructions" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Instructions
              </label>
              <textarea
                id="instructions"
                name="instructions"
                value={formData.instructions}
                onChange={handleChange}
                rows="3"
                className={`block w-full px-3 py-2 rounded-md ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
              ></textarea>
            </div>
            
            <div>
              <label htmlFor="prescribedBy" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Prescribed By
              </label>
              <input
                type="text"
                id="prescribedBy"
                name="prescribedBy"
                value={formData.prescribedBy}
                onChange={handleChange}
                className={`block w-full px-3 py-2 rounded-md ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
              />
            </div>
            
            <div>
              <label htmlFor="refills" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Refills
              </label>
              <input
                type="number"
                id="refills"
                name="refills"
                value={formData.refills}
                onChange={handleChange}
                min="0"
                className={`block w-full px-3 py-2 rounded-md ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
              />
            </div>
            
            <div>
              <label htmlFor="pharmacy" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Pharmacy
              </label>
              <input
                type="text"
                id="pharmacy"
                name="pharmacy"
                value={formData.pharmacy}
                onChange={handleChange}
                className={`block w-full px-3 py-2 rounded-md ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
              />
            </div>
            
            <div>
              <label htmlFor="notes" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                className={`block w-full px-3 py-2 rounded-md ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
              ></textarea>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      {renderAddForm()}
      {renderEditForm()}
      {renderDeleteConfirm()}
    </>
  );
};

export default MedicationForm;