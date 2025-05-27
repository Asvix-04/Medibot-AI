import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import TrendAnalysis from './TrendAnalysis';
import CorrelationAnalysis from './CorrelationAnalysis';
import HealthInsights from './HealthInsights';
import { useToast } from '../../context/ToastContext';

const HealthTrends = ({ darkMode }) => {
  // State for health data
  const [healthMetrics, setHealthMetrics] = useState({
    bloodPressure: [],
    heartRate: [],
    bloodGlucose: [],
    weight: [],
    sleep: []
  });
  
  // State for UI control
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('trends');
  const [timeRange, setTimeRange] = useState('1m'); // 1w, 1m, 3m, 6m, 1y, all
  const [selectedMetrics, setSelectedMetrics] = useState(['bloodPressure', 'heartRate', 'weight']);
  
  const { addToast } = useToast();
  
  // Fetch health data from Firestore
  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        setLoading(true);
        const user = auth.currentUser;
        
        if (!user) {
          throw new Error('User not authenticated');
        }
        
        const healthMetricsRef = doc(db, 'healthMetrics', user.uid);
        const metricsDoc = await getDoc(healthMetricsRef);
        
        if (metricsDoc.exists()) {
          const data = metricsDoc.data();
          
          // Process and filter data based on timeRange
          const filteredData = filterDataByTimeRange(data, timeRange);
          setHealthMetrics(filteredData);
        } else {
          // If no health metrics exist yet
          addToast('No health data found. Start tracking your metrics to see analytics.', 'info');
        }
      } catch (err) {
        console.error('Error fetching health data:', err);
        setError(err.message);
        addToast(`Error loading health data: ${err.message}`, 'error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchHealthData();
  }, [timeRange]);
  
  // Filter data based on selected time range
  const filterDataByTimeRange = (data, range) => {
    const result = {...data};
    const now = new Date();
    let cutoffDate;
    
    switch(range) {
      case '1w':
        cutoffDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case '1m':
        cutoffDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case '3m':
        cutoffDate = new Date(now.setMonth(now.getMonth() - 3));
        break;
      case '6m':
        cutoffDate = new Date(now.setMonth(now.getMonth() - 6));
        break;
      case '1y':
        cutoffDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default: // 'all'
        return result;
    }
    
    // Filter each metrics category
    Object.keys(result).forEach(metricType => {
      if (Array.isArray(result[metricType])) {
        result[metricType] = result[metricType].filter(item => {
          const itemDate = item.timestamp ? new Date(item.timestamp.toDate()) : new Date(item.date);
          return itemDate >= cutoffDate;
        });
      }
    });
    
    return result;
  };
  
  // Toggle metric selection for analysis
  const toggleMetricSelection = (metric) => {
    if (selectedMetrics.includes(metric)) {
      setSelectedMetrics(selectedMetrics.filter(m => m !== metric));
    } else {
      setSelectedMetrics([...selectedMetrics, metric]);
    }
  };
  
  // Check if we have enough data for meaningful analysis
  const hasEnoughData = Object.values(healthMetrics).some(arr => arr && arr.length > 3);

  return (
    <div className={`max-w-6xl mx-auto ${darkMode ? 'text-white' : 'text-gray-900'}`}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Health Analytics & Insights</h1>
        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Track trends, discover correlations, and get personalized health insights
        </p>
      </div>
      
      {/* Time Range Selector - Updated colors */}
      <div className={`flex items-center p-4 rounded-xl mb-6 ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } border shadow-sm`}>
        <div className="mr-4">
          <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Time Range:
          </label>
        </div>
        <div className="flex gap-2">
          {[
            { value: '1w', label: '1 Week' },
            { value: '1m', label: '1 Month' },
            { value: '3m', label: '3 Months' },
            { value: '6m', label: '6 Months' },
            { value: '1y', label: '1 Year' },
            { value: 'all', label: 'All Time' },
          ].map(option => (
            <button 
              key={option.value}
              onClick={() => setTimeRange(option.value)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                timeRange === option.value 
                  ? (darkMode ? 'bg-violet-700 text-white' : 'bg-violet-100 text-violet-800')
                  : (darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700')
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Tab Navigation - Updated colors */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px">
          <li className="mr-2">
            <button
              onClick={() => setActiveTab('trends')}
              className={`inline-block py-4 px-4 text-sm font-medium border-b-2 rounded-t-lg ${
                activeTab === 'trends'
                  ? (darkMode ? 'text-violet-400 border-violet-400' : 'text-violet-600 border-violet-600')
                  : (darkMode ? 'text-gray-400 border-transparent hover:text-gray-300 hover:border-gray-300' : 'text-gray-500 border-transparent hover:text-gray-600 hover:border-gray-300')
              }`}
            >
              Trend Analysis
            </button>
          </li>
          <li className="mr-2">
            <button
              onClick={() => setActiveTab('correlations')}
              className={`inline-block py-4 px-4 text-sm font-medium border-b-2 rounded-t-lg ${
                activeTab === 'correlations'
                  ? (darkMode ? 'text-violet-400 border-violet-400' : 'text-violet-600 border-violet-600')
                  : (darkMode ? 'text-gray-400 border-transparent hover:text-gray-300 hover:border-gray-300' : 'text-gray-500 border-transparent hover:text-gray-600 hover:border-gray-300')
              }`}
            >
              Correlation Analysis
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('insights')}
              className={`inline-block py-4 px-4 text-sm font-medium border-b-2 rounded-t-lg ${
                activeTab === 'insights'
                  ? (darkMode ? 'text-violet-400 border-violet-400' : 'text-violet-600 border-violet-600')
                  : (darkMode ? 'text-gray-400 border-transparent hover:text-gray-300 hover:border-gray-300' : 'text-gray-500 border-transparent hover:text-gray-600 hover:border-gray-300')
              }`}
            >
              AI Insights & Recommendations
            </button>
          </li>
        </ul>
      </div>
      
      {/* Loading state - Updated colors */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className={`w-12 h-12 rounded-full animate-spin border-4 border-solid border-t-violet-500 border-r-transparent border-b-violet-500 border-l-transparent`}></div>
        </div>
      )}
      
      {/* Error state */}
      {error && !loading && (
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
      )}
      
      {/* Not enough data state */}
      {!hasEnoughData && !loading && !error && (
        <div className={`text-center py-12 rounded-xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border mb-8`}>
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 bg-indigo-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium mb-2">Not enough data for analysis</h3>
          <p className={`mb-6 max-w-sm mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            You need more health data to generate meaningful insights. Continue tracking your metrics regularly to unlock powerful analytics.
          </p>
        </div>
      )}
      
      {/* Tab Content */}
      {!loading && !error && hasEnoughData && (
        <>
          {activeTab === 'trends' && (
            <TrendAnalysis 
              healthMetrics={healthMetrics}
              selectedMetrics={selectedMetrics}
              toggleMetricSelection={toggleMetricSelection}
              timeRange={timeRange}
              darkMode={darkMode}
            />
          )}
          
          {activeTab === 'correlations' && (
            <CorrelationAnalysis 
              healthMetrics={healthMetrics}
              selectedMetrics={selectedMetrics}
              toggleMetricSelection={toggleMetricSelection}
              darkMode={darkMode}
            />
          )}
          
          {activeTab === 'insights' && (
            <HealthInsights 
              healthMetrics={healthMetrics}
              timeRange={timeRange}
              darkMode={darkMode}
            />
          )}
        </>
      )}
    </div>
  );
};

export default HealthTrends;