import React, { useState } from 'react';
import { auth, db } from '../../firebase';
import { doc, updateDoc, arrayUnion, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { useToast } from '../../context/ToastContext';

const HealthMetricsForm = ({ onSuccess, darkMode }) => {
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [metricType, setMetricType] = useState('bloodPressure');
  const [metricDate, setMetricDate] = useState(formatDateForInput(new Date()));
  const [metricTime, setMetricTime] = useState(formatTimeForInput(new Date()));
  
  // Metric-specific values
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [glucoseLevel, setGlucoseLevel] = useState('');
  const [weight, setWeight] = useState('');
  const [sleepHours, setSleepHours] = useState('');
  
  // Validation errors
  const [errors, setErrors] = useState({});

  // Helper functions for date formatting
  function formatDateForInput(date) {
    return date.toISOString().split('T')[0];
  }
  
  function formatTimeForInput(date) {
    return date.toTimeString().split(' ')[0].substring(0, 5);
  }
  
  function combineDateTime(date, time) {
    const combinedDate = new Date(`${date}T${time}`);
    return combinedDate;
  }

  // Form reset function
  const resetForm = () => {
    setMetricType('bloodPressure');
    setMetricDate(formatDateForInput(new Date()));
    setMetricTime(formatTimeForInput(new Date()));
    setSystolic('');
    setDiastolic('');
    setHeartRate('');
    setGlucoseLevel('');
    setWeight('');
    setSleepHours('');
    setErrors({});
  };

  // Validation functions
  const validateForm = () => {
    const newErrors = {};
    
    // Common validation for date/time
    if (!metricDate) newErrors.date = 'Date is required';
    if (!metricTime) newErrors.time = 'Time is required';
    
    // Metric-specific validation
    switch (metricType) {
      case 'bloodPressure':
        if (!systolic) newErrors.systolic = 'Systolic value is required';
        else if (systolic < 60 || systolic > 250) newErrors.systolic = 'Must be between 60 and 250';
        
        if (!diastolic) newErrors.diastolic = 'Diastolic value is required';
        else if (diastolic < 40 || diastolic > 150) newErrors.diastolic = 'Must be between 40 and 150';
        
        if (parseInt(systolic) <= parseInt(diastolic) && systolic && diastolic) 
          newErrors.systolic = 'Systolic must be greater than diastolic';
        break;
        
      case 'heartRate':
        if (!heartRate) newErrors.heartRate = 'Heart rate is required';
        else if (heartRate < 35 || heartRate > 220) newErrors.heartRate = 'Must be between 35 and 220';
        break;
        
      case 'bloodGlucose':
        if (!glucoseLevel) newErrors.glucoseLevel = 'Glucose level is required';
        else if (glucoseLevel < 30 || glucoseLevel > 600) newErrors.glucoseLevel = 'Must be between 30 and 600';
        break;
        
      case 'weight':
        if (!weight) newErrors.weight = 'Weight is required';
        else if (weight < 20 || weight > 500) newErrors.weight = 'Must be between 20 and 500';
        break;
        
      case 'sleep':
        if (!sleepHours) newErrors.sleepHours = 'Sleep duration is required';
        else if (sleepHours < 0 || sleepHours > 24) newErrors.sleepHours = 'Must be between 0 and 24';
        break;
        
      default:
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      const user = auth.currentUser;
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      const combinedDateTime = combineDateTime(metricDate, metricTime);
      const formattedDate = formatDateForInput(combinedDateTime);
      
      // Prepare the new data point based on metric type
      let newDataPoint;
      switch (metricType) {
        case 'bloodPressure':
          newDataPoint = { 
            date: formattedDate, 
            systolic: parseInt(systolic), 
            diastolic: parseInt(diastolic),
            timestamp: Timestamp.fromDate(combinedDateTime)
          };
          break;
          
        case 'heartRate':
          newDataPoint = { 
            date: formattedDate, 
            value: parseInt(heartRate),
            timestamp: Timestamp.fromDate(combinedDateTime)
          };
          break;
          
        case 'bloodGlucose':
          newDataPoint = { 
            date: formattedDate, 
            value: parseInt(glucoseLevel),
            timestamp: Timestamp.fromDate(combinedDateTime)
          };
          break;
          
        case 'weight':
          newDataPoint = { 
            date: formattedDate, 
            value: parseFloat(weight),
            timestamp: Timestamp.fromDate(combinedDateTime)
          };
          break;
          
        case 'sleep':
          newDataPoint = { 
            date: formattedDate, 
            hours: parseFloat(sleepHours),
            timestamp: Timestamp.fromDate(combinedDateTime)
          };
          break;
          
        default:
          throw new Error('Invalid metric type');
      }
      
      // Get reference to the user's health metrics document
      const healthMetricsRef = doc(db, "healthMetrics", user.uid);
      
      // Check if document exists
      const healthMetricsDoc = await getDoc(healthMetricsRef);
      
      if (healthMetricsDoc.exists()) {
        // Update existing document
        await updateDoc(healthMetricsRef, {
          [`${metricType}`]: arrayUnion(newDataPoint),
          updatedAt: Timestamp.now()
        });
      } else {
        // Create new document with the metric
        await setDoc(healthMetricsRef, {
          [`${metricType}`]: [newDataPoint],
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        });
      }
      
      // Show success message
      addToast(`${getMetricTypeName(metricType)} data added successfully!`, 'success');
      
      // Reset form
      resetForm();
      
      // Call success callback if provided
      if (onSuccess) onSuccess(metricType, newDataPoint);
      
    } catch (error) {
      console.error('Error adding health metric:', error);
      addToast(`Error: ${error.message}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to get display name for metric type
  const getMetricTypeName = (type) => {
    switch (type) {
      case 'bloodPressure': return 'Blood Pressure';
      case 'heartRate': return 'Heart Rate';
      case 'bloodGlucose': return 'Blood Glucose';
      case 'weight': return 'Weight';
      case 'sleep': return 'Sleep';
      default: return type;
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-100'} p-6`}>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Add Health Metric</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Metric Type Selection */}
        <div>
          <label htmlFor="metricType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Metric Type
          </label>
          <select
            id="metricType"
            name="metricType"
            value={metricType}
            onChange={(e) => setMetricType(e.target.value)}
            className={`block w-full px-3 py-2 border ${
              darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
            } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
          >
            <option value="bloodPressure">Blood Pressure</option>
            <option value="heartRate">Heart Rate</option>
            <option value="bloodGlucose">Blood Glucose</option>
            <option value="weight">Weight</option>
            <option value="sleep">Sleep Duration</option>
          </select>
        </div>
        
        {/* Date and Time Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="metricDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date
            </label>
            <input
              type="date"
              id="metricDate"
              name="metricDate"
              value={metricDate}
              onChange={(e) => setMetricDate(e.target.value)}
              max={formatDateForInput(new Date())}
              className={`block w-full px-3 py-2 border ${
                errors.date ? 'border-red-300' : darkMode ? 'border-gray-600' : 'border-gray-300'
              } ${
                darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
            />
            {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
          </div>
          
          <div>
            <label htmlFor="metricTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Time
            </label>
            <input
              type="time"
              id="metricTime"
              name="metricTime"
              value={metricTime}
              onChange={(e) => setMetricTime(e.target.value)}
              className={`block w-full px-3 py-2 border ${
                errors.time ? 'border-red-300' : darkMode ? 'border-gray-600' : 'border-gray-300'
              } ${
                darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
            />
            {errors.time && <p className="mt-1 text-sm text-red-600">{errors.time}</p>}
          </div>
        </div>
        
        {/* Metric-specific input fields */}
        {metricType === 'bloodPressure' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="systolic" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Systolic (mmHg)
              </label>
              <input
                type="number"
                id="systolic"
                name="systolic"
                value={systolic}
                onChange={(e) => setSystolic(e.target.value)}
                placeholder="120"
                className={`block w-full px-3 py-2 border ${
                  errors.systolic ? 'border-red-300' : darkMode ? 'border-gray-600' : 'border-gray-300'
                } ${
                  darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'
                } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
              />
              {errors.systolic && <p className="mt-1 text-sm text-red-600">{errors.systolic}</p>}
            </div>
            <div>
              <label htmlFor="diastolic" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Diastolic (mmHg)
              </label>
              <input
                type="number"
                id="diastolic"
                name="diastolic"
                value={diastolic}
                onChange={(e) => setDiastolic(e.target.value)}
                placeholder="80"
                className={`block w-full px-3 py-2 border ${
                  errors.diastolic ? 'border-red-300' : darkMode ? 'border-gray-600' : 'border-gray-300'
                } ${
                  darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'
                } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
              />
              {errors.diastolic && <p className="mt-1 text-sm text-red-600">{errors.diastolic}</p>}
            </div>
          </div>
        )}
        
        {metricType === 'heartRate' && (
          <div>
            <label htmlFor="heartRate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Heart Rate (BPM)
            </label>
            <input
              type="number"
              id="heartRate"
              name="heartRate"
              value={heartRate}
              onChange={(e) => setHeartRate(e.target.value)}
              placeholder="72"
              className={`block w-full px-3 py-2 border ${
                errors.heartRate ? 'border-red-300' : darkMode ? 'border-gray-600' : 'border-gray-300'
              } ${
                darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
            />
            {errors.heartRate && <p className="mt-1 text-sm text-red-600">{errors.heartRate}</p>}
          </div>
        )}
        
        {metricType === 'bloodGlucose' && (
          <div>
            <label htmlFor="glucoseLevel" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Blood Glucose (mg/dL)
            </label>
            <input
              type="number"
              id="glucoseLevel"
              name="glucoseLevel"
              value={glucoseLevel}
              onChange={(e) => setGlucoseLevel(e.target.value)}
              placeholder="100"
              className={`block w-full px-3 py-2 border ${
                errors.glucoseLevel ? 'border-red-300' : darkMode ? 'border-gray-600' : 'border-gray-300'
              } ${
                darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
            />
            {errors.glucoseLevel && <p className="mt-1 text-sm text-red-600">{errors.glucoseLevel}</p>}
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Enter fasting glucose level for best tracking
            </p>
          </div>
        )}
        
        {metricType === 'weight' && (
          <div>
            <label htmlFor="weight" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Weight (kg)
            </label>
            <input
              type="number"
              id="weight"
              name="weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              step="0.1"
              placeholder="70.5"
              className={`block w-full px-3 py-2 border ${
                errors.weight ? 'border-red-300' : darkMode ? 'border-gray-600' : 'border-gray-300'
              } ${
                darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
            />
            {errors.weight && <p className="mt-1 text-sm text-red-600">{errors.weight}</p>}
          </div>
        )}
        
        {metricType === 'sleep' && (
          <div>
            <label htmlFor="sleepHours" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sleep Duration (hours)
            </label>
            <input
              type="number"
              id="sleepHours"
              name="sleepHours"
              value={sleepHours}
              onChange={(e) => setSleepHours(e.target.value)}
              step="0.1"
              placeholder="8.0"
              className={`block w-full px-3 py-2 border ${
                errors.sleepHours ? 'border-red-300' : darkMode ? 'border-gray-600' : 'border-gray-300'
              } ${
                darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
            />
            {errors.sleepHours && <p className="mt-1 text-sm text-red-600">{errors.sleepHours}</p>}
          </div>
        )}
        
        {/* Submit button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`relative px-6 py-2 ${
              darkMode 
                ? 'bg-gradient-to-r from-purple-700 to-indigo-800 hover:from-purple-800 hover:to-indigo-900' 
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
            } text-white text-base font-medium rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-all duration-300 ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add {getMetricTypeName(metricType)}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HealthMetricsForm;