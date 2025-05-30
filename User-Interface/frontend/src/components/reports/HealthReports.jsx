import React, { useState, useEffect, useRef } from 'react';
import { auth, db } from '../../firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import ReportTemplate from './ReportTemplate';
import ReportExport from './ReportExport';
import { useToast } from '../../context/ToastContext';

const HealthReports = ({ darkMode }) => {
  // State management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [healthData, setHealthData] = useState({
    bloodPressure: [],
    heartRate: [],
    bloodGlucose: [],
    weight: [],
    sleep: []
  });
  const [medications, setMedications] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('comprehensive');
  const [selectedMetrics, setSelectedMetrics] = useState(['bloodPressure', 'heartRate', 'bloodGlucose', 'weight']);
  const [dateRange, setDateRange] = useState({
    startDate: subtractDays(new Date(), 30),
    endDate: new Date()
  });
  const [includeMedications, setIncludeMedications] = useState(true);
  const [includeInsights, setIncludeInsights] = useState(true);
  const [reportTitle, setReportTitle] = useState('Health Report');
  
  const reportRef = useRef(null);
  const { addToast } = useToast();

  // Helper function to get date from X days ago
  function subtractDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() - days);
    return result;
  }

  // Format date for display
  const formatDateForInput = (date) => {
    return date.toISOString().split('T')[0];
  };

  // Fetch health data from Firestore
  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        setLoading(true);
        const user = auth.currentUser;
        
        if (!user) {
          throw new Error('User not authenticated');
        }
        
        // Fetch health metrics
        const healthMetricsRef = doc(db, 'healthMetrics', user.uid);
        const metricsDoc = await getDoc(healthMetricsRef);
        
        if (metricsDoc.exists()) {
          setHealthData(filterDataByDateRange(metricsDoc.data()));
        }
        
        // Fetch medications
        const medicationsRef = collection(db, 'users', user.uid, 'medications');
        const querySnapshot = await getDocs(medicationsRef);
        
        const medicationsData = [];
        querySnapshot.forEach(doc => {
          medicationsData.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        setMedications(medicationsData);
        
      } catch (err) {
        console.error('Error fetching health data:', err);
        setError(err.message);
        addToast(`Error loading health data: ${err.message}`, 'error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchHealthData();
  }, [dateRange]); // Re-fetch when date range changes

  // Filter data by date range
  const filterDataByDateRange = (data) => {
    const filteredData = {...data};
    const startTimestamp = dateRange.startDate.getTime();
    const endTimestamp = dateRange.endDate.getTime();
    
    Object.keys(filteredData).forEach(metricType => {
      if (Array.isArray(filteredData[metricType])) {
        filteredData[metricType] = filteredData[metricType].filter(item => {
          const itemDate = new Date(item.date);
          const itemTimestamp = itemDate.getTime();
          return itemTimestamp >= startTimestamp && itemTimestamp <= endTimestamp;
        });
      }
    });
    
    return filteredData;
  };

  // Templates data
  const templates = [
    { id: 'comprehensive', name: 'Comprehensive Report', description: 'Complete health overview with all metrics and insights' },
    { id: 'basic', name: 'Basic Health Summary', description: 'Simple overview of key health metrics' },
    { id: 'cardiac', name: 'Cardiac Health', description: 'Focused on blood pressure and heart rate' },
    { id: 'diabetes', name: 'Diabetes Management', description: 'Blood glucose and related metrics' }
  ];

  // Update selected metrics based on template
  useEffect(() => {
    switch (selectedTemplate) {
      case 'comprehensive':
        setSelectedMetrics(['bloodPressure', 'heartRate', 'bloodGlucose', 'weight', 'sleep']);
        setIncludeMedications(true);
        setIncludeInsights(true);
        break;
      case 'basic':
        setSelectedMetrics(['bloodPressure', 'heartRate', 'weight']);
        setIncludeMedications(true);
        setIncludeInsights(false);
        break;
      case 'cardiac':
        setSelectedMetrics(['bloodPressure', 'heartRate']);
        setIncludeMedications(true);
        setIncludeInsights(true);
        break;
      case 'diabetes':
        setSelectedMetrics(['bloodGlucose', 'weight']);
        setIncludeMedications(true);
        setIncludeInsights(true);
        break;
      default:
        break;
    }
  }, [selectedTemplate]);

  // Handle date range change
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: new Date(value)
    }));
  };

  // Handle metric selection
  const toggleMetric = (metric) => {
    setSelectedMetrics(prev => 
      prev.includes(metric) 
        ? prev.filter(m => m !== metric) 
        : [...prev, metric]
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className={`w-12 h-12 rounded-full animate-spin border-4 border-solid border-t-violet-500 border-r-transparent border-b-violet-500 border-l-transparent`}></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`p-6 rounded-xl ${darkMode ? 'bg-red-900/30 text-red-200' : 'bg-red-50 text-red-800'} mb-6`}>
        <div className="flex items-center mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="font-medium">Error Loading Health Data</h3>
        </div>
        <p className="text-sm">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className={`mt-4 px-3 py-1 rounded-lg text-sm font-medium ${
            darkMode ? 'bg-red-700 hover:bg-red-800' : 'bg-red-100 hover:bg-red-200'
          } transition-colors`}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className={`max-w-6xl mx-auto ${darkMode ? 'text-white' : 'text-gray-900'}`}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Health Reports</h1>
        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Generate customized health reports and export them as PDF or CSV
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Report Configuration Panel */}
        <div className="lg:col-span-1">
          <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border shadow-sm`}>
            <h2 className="text-lg font-semibold mb-4">Report Configuration</h2>
            
            {/* Report Title */}
            <div className="mb-6">
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Report Title
              </label>
              <input
                type="text"
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white focus:ring-violet-500 focus:border-violet-500' 
                    : 'bg-white border-gray-300 text-gray-900 focus:ring-violet-500 focus:border-violet-500'
                }`}
              />
            </div>
            
            {/* Template Selection */}
            <div className="mb-6">
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Report Template
              </label>
              <div className="space-y-2">
                {templates.map(template => (
                  <div 
                    key={template.id}
                    className={`p-3 rounded-md border cursor-pointer transition-colors ${
                      selectedTemplate === template.id
                        ? (darkMode ? 'bg-violet-900/30 border-violet-700' : 'bg-violet-50 border-violet-300')
                        : (darkMode ? 'bg-gray-700 border-gray-600 hover:border-gray-500' : 'bg-white border-gray-200 hover:border-gray-300')
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        checked={selectedTemplate === template.id}
                        onChange={() => {}}
                        className="h-4 w-4 text-violet-600"
                      />
                      <label className="ml-3 block text-sm font-medium">
                        {template.name}
                      </label>
                    </div>
                    {template.description && (
                      <p className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} ml-7`}>
                        {template.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Date Range Selection */}
            <div className="mb-6">
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Date Range
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">From</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formatDateForInput(dateRange.startDate)}
                    onChange={handleDateChange}
                    className={`w-full px-3 py-2 border rounded-md ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:ring-violet-500 focus:border-violet-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:ring-violet-500 focus:border-violet-500'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">To</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formatDateForInput(dateRange.endDate)}
                    max={formatDateForInput(new Date())}
                    onChange={handleDateChange}
                    className={`w-full px-3 py-2 border rounded-md ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:ring-violet-500 focus:border-violet-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:ring-violet-500 focus:border-violet-500'
                    }`}
                  />
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button 
                  className={`px-3 py-1 text-xs rounded-md ${
                    darkMode ? 'bg-violet-900/30 hover:bg-violet-800/40 text-violet-100' : 'bg-violet-100 hover:bg-violet-200 text-violet-700'
                  }`}
                  onClick={() => setDateRange({
                    startDate: subtractDays(new Date(), 7),
                    endDate: new Date()
                  })}
                >
                  Last 7 days
                </button>
                <button 
                  className={`px-3 py-1 text-xs rounded-md ${
                    darkMode ? 'bg-violet-900/30 hover:bg-violet-800/40 text-violet-100' : 'bg-violet-100 hover:bg-violet-200 text-violet-700'
                  }`}
                  onClick={() => setDateRange({
                    startDate: subtractDays(new Date(), 30),
                    endDate: new Date()
                  })}
                >
                  Last 30 days
                </button>
                <button 
                  className={`px-3 py-1 text-xs rounded-md ${
                    darkMode ? 'bg-violet-900/30 hover:bg-violet-800/40 text-violet-100' : 'bg-violet-100 hover:bg-violet-200 text-violet-700'
                  }`}
                  onClick={() => setDateRange({
                    startDate: subtractDays(new Date(), 90),
                    endDate: new Date()
                  })}
                >
                  Last 3 months
                </button>
              </div>
            </div>
            
            {/* Metrics Selection */}
            <div className="mb-6">
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Include Health Metrics
              </label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input 
                    id="metric-bp" 
                    type="checkbox" 
                    checked={selectedMetrics.includes('bloodPressure')}
                    onChange={() => toggleMetric('bloodPressure')}
                    className="h-4 w-4 text-violet-600 rounded"
                  />
                  <label htmlFor="metric-bp" className="ml-3 text-sm">
                    Blood Pressure
                  </label>
                </div>
                <div className="flex items-center">
                  <input 
                    id="metric-hr" 
                    type="checkbox" 
                    checked={selectedMetrics.includes('heartRate')}
                    onChange={() => toggleMetric('heartRate')}
                    className="h-4 w-4 text-violet-600 rounded"
                  />
                  <label htmlFor="metric-hr" className="ml-3 text-sm">
                    Heart Rate
                  </label>
                </div>
                <div className="flex items-center">
                  <input 
                    id="metric-glucose" 
                    type="checkbox" 
                    checked={selectedMetrics.includes('bloodGlucose')}
                    onChange={() => toggleMetric('bloodGlucose')}
                    className="h-4 w-4 text-violet-600 rounded"
                  />
                  <label htmlFor="metric-glucose" className="ml-3 text-sm">
                    Blood Glucose
                  </label>
                </div>
                <div className="flex items-center">
                  <input 
                    id="metric-weight" 
                    type="checkbox" 
                    checked={selectedMetrics.includes('weight')}
                    onChange={() => toggleMetric('weight')}
                    className="h-4 w-4 text-violet-600 rounded"
                  />
                  <label htmlFor="metric-weight" className="ml-3 text-sm">
                    Weight
                  </label>
                </div>
                <div className="flex items-center">
                  <input 
                    id="metric-sleep" 
                    type="checkbox" 
                    checked={selectedMetrics.includes('sleep')}
                    onChange={() => toggleMetric('sleep')}
                    className="h-4 w-4 text-violet-600 rounded"
                  />
                  <label htmlFor="metric-sleep" className="ml-3 text-sm">
                    Sleep
                  </label>
                </div>
              </div>
            </div>
            
            {/* Additional Options */}
            <div className="mb-6">
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Additional Information
              </label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input 
                    id="include-medications" 
                    type="checkbox" 
                    checked={includeMedications}
                    onChange={() => setIncludeMedications(!includeMedications)}
                    className="h-4 w-4 text-violet-600 rounded"
                  />
                  <label htmlFor="include-medications" className="ml-3 text-sm">
                    Include Medications
                  </label>
                </div>
                <div className="flex items-center">
                  <input 
                    id="include-insights" 
                    type="checkbox" 
                    checked={includeInsights}
                    onChange={() => setIncludeInsights(!includeInsights)}
                    className="h-4 w-4 text-violet-600 rounded"
                  />
                  <label htmlFor="include-insights" className="ml-3 text-sm">
                    Include AI Insights
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          {/* Export Options */}
          <div className="mb-6">
            <ReportExport 
              reportRef={reportRef}
              fileName={`health-report-${new Date().toISOString().split('T')[0]}`}
              healthData={healthData}
              selectedMetrics={selectedMetrics}
              darkMode={darkMode}
            />
          </div>
        </div>
        
        {/* Report Preview */}
        <div className="lg:col-span-2">
          <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border shadow-sm`}>
            <h2 className="text-lg font-semibold mb-4">Report Preview</h2>
            <div className="bg-white rounded-lg shadow-lg p-6 mx-auto max-w-4xl">
              <div 
                ref={reportRef} 
                id="health-report-container" 
                style={{ 
                  display: 'block',
                  width: '100%',
                  height: 'auto',
                  minHeight: '500px',
                  position: 'relative'
                }}
              >
                <ReportTemplate 
                  title={reportTitle}
                  template={selectedTemplate}
                  healthData={healthData}
                  medications={includeMedications ? medications : []}
                  selectedMetrics={selectedMetrics}
                  dateRange={dateRange}
                  includeInsights={includeInsights}
                  darkMode={false} // Always use light mode for reports for better printing
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthReports;