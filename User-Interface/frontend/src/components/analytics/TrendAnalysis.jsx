import React, { useState, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const TrendAnalysis = ({ healthMetrics, selectedMetrics, toggleMetricSelection, timeRange, darkMode }) => {
  const [advancedOptions, setAdvancedOptions] = useState({
    movingAverage: true,
    showGoalLines: true,
    regressionLine: false,
    annotations: true
  });
  
  const [focusMetric, setFocusMetric] = useState(null);
  
  // Metric display configurations
  const metricConfigs = {
    bloodPressure: {
      label: 'Blood Pressure',
      color: 'rgba(147, 51, 234, 0.8)', // Purple
      secondaryColor: 'rgba(79, 70, 229, 0.8)', // Indigo for diastolic
      unit: 'mmHg',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      normalRange: { min: [90, 60], max: [120, 80] } // [systolic, diastolic]
    },
    heartRate: {
      label: 'Heart Rate',
      color: 'rgba(239, 68, 68, 0.8)', // Red
      unit: 'BPM',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      normalRange: { min: 60, max: 100 }
    },
    bloodGlucose: {
      label: 'Blood Glucose',
      color: 'rgba(245, 158, 11, 0.8)', // Amber
      unit: 'mg/dL',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      normalRange: { min: 70, max: 99 }
    },
    weight: {
      label: 'Weight',
      color: 'rgba(16, 185, 129, 0.8)', // Emerald
      unit: 'kg',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
        </svg>
      )
    },
    sleep: {
      label: 'Sleep',
      color: 'rgba(59, 130, 246, 0.8)', // Blue
      unit: 'hours',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      ),
      normalRange: { min: 7, max: 9 }
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('default', { 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };
  
  // Generate labels (dates) from all metrics combined
  const allDates = useMemo(() => {
    const dates = new Set();
    
    Object.entries(healthMetrics).forEach(([key, metrics]) => {
      if (Array.isArray(metrics)) {
        metrics.forEach(metric => {
          dates.add(metric.date);
        });
      }
    });
    
    return [...dates].sort((a, b) => new Date(a) - new Date(b));
  }, [healthMetrics]);
  
  // Calculate moving average for a dataset
  const calculateMovingAverage = (data, window = 3) => {
    if (!data || data.length < window) return data;
    
    const result = [];
    
    for (let i = 0; i < data.length; i++) {
      if (i < window - 1) {
        result.push(data[i]);
        continue;
      }
      
      let sum = 0;
      for (let j = 0; j < window; j++) {
        sum += data[i - j];
      }
      result.push(sum / window);
    }
    
    return result;
  };
  
  // Prepare chart data for each selected metric
  const prepareChartData = (metricType) => {
    if (!healthMetrics[metricType] || !healthMetrics[metricType].length) {
      return null;
    }
    
    // Sort metrics by date
    const sortedMetrics = [...healthMetrics[metricType]].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
    
    const labels = sortedMetrics.map(item => formatDate(item.date));
    
    if (metricType === 'bloodPressure') {
      // Blood pressure has systolic and diastolic values
      const systolicData = sortedMetrics.map(item => item.systolic);
      const diastolicData = sortedMetrics.map(item => item.diastolic);
      
      const datasets = [
        {
          label: 'Systolic',
          data: systolicData,
          borderColor: metricConfigs.bloodPressure.color,
          backgroundColor: `${metricConfigs.bloodPressure.color.replace('0.8', '0.1')}`,
          tension: 0.3,
          fill: false
        },
        {
          label: 'Diastolic',
          data: diastolicData,
          borderColor: metricConfigs.bloodPressure.secondaryColor,
          backgroundColor: `${metricConfigs.bloodPressure.secondaryColor.replace('0.8', '0.1')}`,
          tension: 0.3,
          fill: false
        }
      ];
      
      // Add moving average if enabled
      if (advancedOptions.movingAverage) {
        datasets.push({
          label: 'Systolic (Avg)',
          data: calculateMovingAverage(systolicData),
          borderColor: metricConfigs.bloodPressure.color.replace('0.8', '0.5'),
          borderDash: [5, 5],
          backgroundColor: 'transparent',
          tension: 0.4,
          pointRadius: 0,
          borderWidth: 2
        });
        
        datasets.push({
          label: 'Diastolic (Avg)',
          data: calculateMovingAverage(diastolicData),
          borderColor: metricConfigs.bloodPressure.secondaryColor.replace('0.8', '0.5'),
          borderDash: [5, 5],
          backgroundColor: 'transparent',
          tension: 0.4,
          pointRadius: 0,
          borderWidth: 2
        });
      }
      
      return { labels, datasets };
      
    } else {
      // For metrics with a single value
      const data = sortedMetrics.map(item => item.value || item.hours); // hours for sleep
      const metricConfig = metricConfigs[metricType];
      
      const datasets = [
        {
          label: metricConfig.label,
          data: data,
          borderColor: metricConfig.color,
          backgroundColor: `${metricConfig.color.replace('0.8', '0.1')}`,
          tension: 0.3,
          fill: true
        }
      ];
      
      // Add moving average if enabled
      if (advancedOptions.movingAverage) {
        datasets.push({
          label: `${metricConfig.label} (Moving Avg)`,
          data: calculateMovingAverage(data),
          borderColor: metricConfig.color.replace('0.8', '0.5'),
          borderDash: [5, 5],
          backgroundColor: 'transparent',
          tension: 0.4,
          pointRadius: 0,
          borderWidth: 2
        });
      }
      
      return { labels, datasets };
    }
  };
  
  // Configure options for charts
  const getChartOptions = (metricType) => {
    const metricConfig = metricConfigs[metricType];
    
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            font: {
              size: 12,
            },
            color: darkMode ? '#e5e7eb' : '#4b5563'
          }
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: darkMode ? 'rgba(17, 24, 39, 0.9)' : 'rgba(255, 255, 255, 0.9)',
          titleColor: darkMode ? '#e5e7eb' : '#111827',
          bodyColor: darkMode ? '#e5e7eb' : '#4b5563',
          borderColor: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
          borderWidth: 1,
          padding: 10,
          titleFont: {
            size: 14,
            weight: 'bold'
          },
          bodyFont: {
            size: 13
          },
          callbacks: {
            label: function(context) {
              const label = context.dataset.label || '';
              const value = context.parsed.y !== null ? context.parsed.y : null;
              const unit = metricConfig.unit || '';
              return `${label}: ${value} ${unit}`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false,
            color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
          },
          ticks: {
            color: darkMode ? '#9ca3af' : '#6b7280',
            maxRotation: 45,
            minRotation: 45
          }
        },
        y: {
          grid: {
            color: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
          },
          ticks: {
            color: darkMode ? '#9ca3af' : '#6b7280'
          },
          // Add normal range annotation if applicable
          afterDataLimits: (scale) => {
            if (advancedOptions.showGoalLines && metricConfig.normalRange) {
              const min = Array.isArray(metricConfig.normalRange.min) ? 
                metricConfig.normalRange.min[0] : metricConfig.normalRange.min;
              const max = Array.isArray(metricConfig.normalRange.max) ? 
                metricConfig.normalRange.max[0] : metricConfig.normalRange.max;
                
              if (scale.min > min) {
                scale.min = min * 0.9;
              }
              if (scale.max < max) {
                scale.max = max * 1.1;
              }
            }
          }
        }
      }
    };
  };
  
  // Calculate statistical metrics for a given dataset
  const calculateStatistics = (metricType) => {
    if (!healthMetrics[metricType] || !healthMetrics[metricType].length) {
      return null;
    }
    
    let values;
    if (metricType === 'bloodPressure') {
      const systolic = healthMetrics[metricType].map(item => item.systolic);
      const diastolic = healthMetrics[metricType].map(item => item.diastolic);
      
      return {
        systolic: {
          min: Math.min(...systolic),
          max: Math.max(...systolic),
          avg: Number((systolic.reduce((sum, val) => sum + val, 0) / systolic.length).toFixed(1)),
          recent: systolic[systolic.length - 1]
        },
        diastolic: {
          min: Math.min(...diastolic),
          max: Math.max(...diastolic),
          avg: Number((diastolic.reduce((sum, val) => sum + val, 0) / diastolic.length).toFixed(1)),
          recent: diastolic[diastolic.length - 1]
        }
      };
    } else {
      values = healthMetrics[metricType].map(item => item.value || item.hours);
      
      // Calculate trend (percentage change from first to last)
      const first = values[0];
      const last = values[values.length - 1];
      const trendPct = first !== 0 ? ((last - first) / first * 100).toFixed(1) : 0;
      
      return {
        min: Math.min(...values),
        max: Math.max(...values),
        avg: Number((values.reduce((sum, val) => sum + val, 0) / values.length).toFixed(1)),
        recent: values[values.length - 1],
        trend: trendPct
      };
    }
  };
  
  // Determine if the current value is within the normal range
  const getStatusIndicator = (metricType, value, isSecondary = false) => {
    const metricConfig = metricConfigs[metricType];
    if (!metricConfig || !metricConfig.normalRange) return 'neutral';
    
    let min, max;
    
    if (metricType === 'bloodPressure' && Array.isArray(metricConfig.normalRange.min)) {
      min = isSecondary ? metricConfig.normalRange.min[1] : metricConfig.normalRange.min[0];
      max = isSecondary ? metricConfig.normalRange.max[1] : metricConfig.normalRange.max[0];
    } else {
      min = metricConfig.normalRange.min;
      max = metricConfig.normalRange.max;
    }
    
    if (value < min) return 'low';
    if (value > max) return 'high';
    return 'normal';
  };
  
  // Get color class based on status
  const getStatusColorClass = (status, type = 'bg') => {
    switch(status) {
      case 'low':
        return `${type}-blue-500`;
      case 'high':
        return `${type}-red-500`;
      case 'normal':
        return `${type}-green-500`;
      default:
        return `${type}-gray-500`;
    }
  };
  
  return (
    <div>
      {/* Metric Selector */}
      <div className={`mb-6 p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <h3 className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
          Select Metrics to Analyze
        </h3>
        <div className="flex flex-wrap gap-2">
          {Object.keys(metricConfigs).map(metricType => (
            <button
              key={metricType}
              onClick={() => toggleMetricSelection(metricType)}
              className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedMetrics.includes(metricType)
                  ? (darkMode 
                      ? `bg-${metricConfigs[metricType].color.split(',')[0].replace('rgba(', '')}-700 text-white` 
                      : `bg-${metricConfigs[metricType].color.split(',')[0].replace('rgba(', '')}-100 text-${metricConfigs[metricType].color.split(',')[0].replace('rgba(', '')}-800`)
                  : (darkMode ? 'bg-gray-700 text-gray-300' : 'bg-white text-gray-600')
              }`}
            >
              <span className="mr-1.5">{metricConfigs[metricType].icon}</span>
              {metricConfigs[metricType].label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Advanced Options */}
      <div className={`mb-6 p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'}`}>
        <div className="flex flex-wrap gap-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={advancedOptions.movingAverage}
              onChange={() => setAdvancedOptions({...advancedOptions, movingAverage: !advancedOptions.movingAverage})}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <span className={`ml-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Show Moving Average</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={advancedOptions.showGoalLines}
              onChange={() => setAdvancedOptions({...advancedOptions, showGoalLines: !advancedOptions.showGoalLines})}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <span className={`ml-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Show Normal Ranges</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={advancedOptions.annotations}
              onChange={() => setAdvancedOptions({...advancedOptions, annotations: !advancedOptions.annotations})}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <span className={`ml-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Show Annotations</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={advancedOptions.regressionLine}
              onChange={() => setAdvancedOptions({...advancedOptions, regressionLine: !advancedOptions.regressionLine})}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <span className={`ml-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Show Trend Line</span>
          </label>
        </div>
      </div>
      
      {/* Metrics Cards and Charts */}
      <div className="grid grid-cols-1 gap-6">
        {selectedMetrics.map(metricType => {
          const chartData = prepareChartData(metricType);
          const statistics = calculateStatistics(metricType);
          const metricConfig = metricConfigs[metricType];
          
          if (!chartData || !statistics) return null;
          
          return (
            <div 
              key={metricType}
              className={`rounded-xl overflow-hidden border ${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              } shadow-sm transition-all duration-300`}
            >
              {/* Metric Header */}
              <div 
                className="px-6 py-4 flex justify-between items-center"
                style={{ 
                  backgroundColor: darkMode ? 'rgba(17, 24, 39, 0.8)' : 'rgba(249, 250, 251, 0.8)',
                  borderBottom: `2px solid ${metricConfig.color}` 
                }}
              >
                <div className="flex items-center">
                  <span 
                    className={`p-2 rounded-full mr-3`}
                    style={{ backgroundColor: metricConfig.color.replace('0.8', '0.15') }}
                  >
                    {metricConfig.icon}
                  </span>
                  <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {metricConfig.label} Trends
                  </h3>
                </div>
                
                <div className="flex items-center">
                  {metricType === 'bloodPressure' ? (
                    <div className="flex items-center space-x-3">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium bg-opacity-15 ${
                        getStatusColorClass(getStatusIndicator(metricType, statistics.systolic.recent), 'bg')}`
                      }>
                        Systolic: {statistics.systolic.recent} mmHg
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium bg-opacity-15 ${
                        getStatusColorClass(getStatusIndicator(metricType, statistics.diastolic.recent, true), 'bg')}`
                      }>
                        Diastolic: {statistics.diastolic.recent} mmHg
                      </div>
                    </div>
                  ) : (
                    <div className={`px-3 py-1 rounded-full text-sm font-medium bg-opacity-15 ${
                      getStatusColorClass(getStatusIndicator(metricType, statistics.recent), 'bg')}`
                    }>
                      Recent: {statistics.recent} {metricConfig.unit}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Chart Area */}
              <div className="p-4">
                <div className="h-80">
                  <Line data={chartData} options={getChartOptions(metricType)} />
                </div>
              </div>
              
              {/* Statistics Panel */}
              <div className={`px-6 py-4 ${darkMode ? 'bg-gray-900/40' : 'bg-gray-50'} border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                  {metricType === 'bloodPressure' ? (
                    <>
                      <div>
                        <h4 className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wide`}>
                          Systolic Range
                        </h4>
                        <p className={`mt-1 text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                          {statistics.systolic.min} - {statistics.systolic.max} mmHg
                        </p>
                      </div>
                      <div>
                        <h4 className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wide`}>
                          Systolic Avg
                        </h4>
                        <p className={`mt-1 text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                          {statistics.systolic.avg} mmHg
                        </p>
                      </div>
                      <div>
                        <h4 className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wide`}>
                          Diastolic Range
                        </h4>
                        <p className={`mt-1 text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                          {statistics.diastolic.min} - {statistics.diastolic.max} mmHg
                        </p>
                      </div>
                      <div>
                        <h4 className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wide`}>
                          Diastolic Avg
                        </h4>
                        <p className={`mt-1 text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                          {statistics.diastolic.avg} mmHg
                        </p>
                      </div>
                      <div>
                        <h4 className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wide`}>
                          Readings
                        </h4>
                        <p className={`mt-1 text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                          {healthMetrics[metricType].length}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <h4 className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wide`}>
                          Range
                        </h4>
                        <p className={`mt-1 text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                          {statistics.min} - {statistics.max} {metricConfig.unit}
                        </p>
                      </div>
                      <div>
                        <h4 className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wide`}>
                          Average
                        </h4>
                        <p className={`mt-1 text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                          {statistics.avg} {metricConfig.unit}
                        </p>
                      </div>
                      <div>
                        <h4 className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wide`}>
                          Change
                        </h4>
                        <p className={`mt-1 text-sm font-semibold ${
                          Number(statistics.trend) > 0 
                            ? 'text-green-500' 
                            : Number(statistics.trend) < 0 
                              ? 'text-red-500' 
                              : darkMode ? 'text-gray-200' : 'text-gray-900'
                        }`}>
                          {Number(statistics.trend) > 0 ? '+' : ''}{statistics.trend}%
                        </p>
                      </div>
                      <div>
                        <h4 className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wide`}>
                          Recent Value
                        </h4>
                        <p className={`mt-1 text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                          {statistics.recent} {metricConfig.unit}
                        </p>
                      </div>
                      <div>
                        <h4 className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wide`}>
                          Readings
                        </h4>
                        <p className={`mt-1 text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                          {healthMetrics[metricType].length}
                        </p>
                      </div>
                    </>
                  )}
                </div>
                
                {/* Insight and Analysis */}
                <div className={`mt-4 pt-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <h4 className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wide mb-2`}>
                    Analysis
                  </h4>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {metricType === 'bloodPressure' ? (
                      <>
                        Your blood pressure readings average {statistics.systolic.avg}/{statistics.diastolic.avg} mmHg over 
                        this period. Your most recent reading of {statistics.systolic.recent}/{statistics.diastolic.recent} mmHg is  
                        {' '}
                        {getStatusIndicator(metricType, statistics.systolic.recent) === 'normal' && 
                         getStatusIndicator(metricType, statistics.diastolic.recent, true) === 'normal' ? (
                          <span className="text-green-500 font-medium">within the normal range</span>
                        ) : getStatusIndicator(metricType, statistics.systolic.recent) === 'high' || 
                           getStatusIndicator(metricType, statistics.diastolic.recent, true) === 'high' ? (
                          <span className="text-red-500 font-medium">above the recommended range</span>
                        ) : (
                          <span className="text-blue-500 font-medium">lower than the typical range</span>
                        )}
                        .
                      </>
                    ) : metricType === 'heartRate' ? (
                      <>
                        Your heart rate has averaged {statistics.avg} BPM. Your most recent reading of {statistics.recent} BPM is
                        {' '}
                        {getStatusIndicator(metricType, statistics.recent) === 'normal' ? (
                          <span className="text-green-500 font-medium">within the normal range</span>
                        ) : getStatusIndicator(metricType, statistics.recent) === 'high' ? (
                          <span className="text-red-500 font-medium">higher than the typical range</span>
                        ) : (
                          <span className="text-blue-500 font-medium">lower than the typical range</span>
                        )}
                        . Your heart rate has 
                        {statistics.trend > 0 ? (
                          <span className="font-medium"> increased by {statistics.trend}%</span>
                        ) : statistics.trend < 0 ? (
                          <span className="font-medium"> decreased by {Math.abs(statistics.trend)}%</span>
                        ) : (
                          <span className="font-medium"> remained stable</span>
                        )}
                        {' '}over this period.
                      </>
                    ) : metricType === 'bloodGlucose' ? (
                      <>
                        Your blood glucose has averaged {statistics.avg} mg/dL. Your most recent reading of {statistics.recent} mg/dL is
                        {' '}
                        {getStatusIndicator(metricType, statistics.recent) === 'normal' ? (
                          <span className="text-green-500 font-medium">within the normal range</span>
                        ) : getStatusIndicator(metricType, statistics.recent) === 'high' ? (
                          <span className="text-red-500 font-medium">higher than the typical range</span>
                        ) : (
                          <span className="text-blue-500 font-medium">lower than the typical range</span>
                        )}
                        . Your blood glucose has 
                        {statistics.trend > 0 ? (
                          <span className="font-medium"> increased by {statistics.trend}%</span>
                        ) : statistics.trend < 0 ? (
                          <span className="font-medium"> decreased by {Math.abs(statistics.trend)}%</span>
                        ) : (
                          <span className="font-medium"> remained stable</span>
                        )}
                        {' '}over this period.
                      </>
                    ) : metricType === 'weight' ? (
                      <>
                        Your weight has averaged {statistics.avg} kg. Your most recent measurement of {statistics.recent} kg shows 
                        {statistics.trend > 0 ? (
                          <span className="font-medium"> an increase of {statistics.trend}%</span>
                        ) : statistics.trend < 0 ? (
                          <span className="font-medium"> a decrease of {Math.abs(statistics.trend)}%</span>
                        ) : (
                          <span className="font-medium"> stable weight maintenance</span>
                        )}
                        {' '}over this period.
                      </>
                    ) : metricType === 'sleep' ? (
                      <>
                        Your sleep duration has averaged {statistics.avg} hours. Your most recent sleep record of {statistics.recent} hours is
                        {' '}
                        {getStatusIndicator(metricType, statistics.recent) === 'normal' ? (
                          <span className="text-green-500 font-medium">within the recommended range</span>
                        ) : getStatusIndicator(metricType, statistics.recent) === 'high' ? (
                          <span className="text-blue-500 font-medium">longer than typical</span>
                        ) : (
                          <span className="text-red-500 font-medium">shorter than recommended</span>
                        )}
                        . Your sleep duration has 
                        {statistics.trend > 0 ? (
                          <span className="font-medium"> increased by {statistics.trend}%</span>
                        ) : statistics.trend < 0 ? (
                          <span className="font-medium"> decreased by {Math.abs(statistics.trend)}%</span>
                        ) : (
                          <span className="font-medium"> remained consistent</span>
                        )}
                        {' '}over this period.
                      </>
                    ) : (
                      'Analysis not available for this metric.'
                    )}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrendAnalysis;