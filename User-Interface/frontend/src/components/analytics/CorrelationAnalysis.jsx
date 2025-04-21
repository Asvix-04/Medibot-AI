import React, { useState, useMemo } from 'react';

import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const CorrelationAnalysis = ({ healthMetrics, selectedMetrics, toggleMetricSelection, darkMode }) => {
  const [primaryMetric, setPrimaryMetric] = useState(null);
  
  // Metric display configurations
  const metricConfigs = {
    bloodPressure: {
      label: 'Blood Pressure',
      color: 'rgba(147, 51, 234, 0.8)', // Purple
      unit: 'mmHg',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      getValue: (item) => item.systolic // Use systolic for correlation
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
      getValue: (item) => item.value
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
      getValue: (item) => item.value
    },
    weight: {
      label: 'Weight',
      color: 'rgba(16, 185, 129, 0.8)', // Emerald
      unit: 'kg',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
        </svg>
      ),
      getValue: (item) => item.value
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
      getValue: (item) => item.hours
    }
  };

  // Generate all available metric pairs based on selected metrics
  const metricPairs = useMemo(() => {
    const pairs = [];
    
    if (selectedMetrics.length < 2) {
      return pairs;
    }
    
    // Generate all possible combinations of metrics
    for (let i = 0; i < selectedMetrics.length; i++) {
      for (let j = i + 1; j < selectedMetrics.length; j++) {
        const metric1 = selectedMetrics[i];
        const metric2 = selectedMetrics[j];
        
        // Make sure both metrics have data
        if (
          healthMetrics[metric1] && 
          healthMetrics[metric1].length > 2 &&
          healthMetrics[metric2] && 
          healthMetrics[metric2].length > 2
        ) {
          pairs.push({
            x: metric1,
            y: metric2
          });
        }
      }
    }
    
    return pairs;
  }, [selectedMetrics, healthMetrics]);

  // Calculate correlation coefficient between two arrays
  const calculateCorrelation = (xValues, yValues) => {
    if (xValues.length !== yValues.length || xValues.length < 3) {
      return null;
    }
    
    const n = xValues.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;
    
    for (let i = 0; i < n; i++) {
      sumX += xValues[i];
      sumY += yValues[i];
      sumXY += xValues[i] * yValues[i];
      sumX2 += xValues[i] * xValues[i];
      sumY2 += yValues[i] * yValues[i];
    }
    
    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    
    if (denominator === 0) return null;
    
    return numerator / denominator;
  };

  // Prepare data for scatter plot
  const prepareScatterData = (metric1, metric2) => {
    const data1 = healthMetrics[metric1];
    const data2 = healthMetrics[metric2];
    
    if (!data1 || !data2 || data1.length < 3 || data2.length < 3) {
      return null;
    }
    
    // Sync data points by date
    const dateToValue1 = {};
    const dateToValue2 = {};
    
    data1.forEach(item => {
      dateToValue1[item.date] = metricConfigs[metric1].getValue(item);
    });
    
    data2.forEach(item => {
      dateToValue2[item.date] = metricConfigs[metric2].getValue(item);
    });
    
    // Find common dates
    const commonDates = Object.keys(dateToValue1).filter(date => dateToValue2[date] !== undefined);
    
    if (commonDates.length < 3) {
      return null;
    }
    
    // Create paired data points
    const points = commonDates.map(date => ({
      x: dateToValue1[date],
      y: dateToValue2[date],
      date: date
    }));
    
    // Calculate correlation
    const xValues = points.map(p => p.x);
    const yValues = points.map(p => p.y);
    const correlation = calculateCorrelation(xValues, yValues);
    
    return {
      points,
      correlation
    };
  };

  // Get correlation description
  const getCorrelationDescription = (correlation) => {
    if (correlation === null) return 'Insufficient data';
    
    const abs = Math.abs(correlation);
    let strength;
    
    if (abs < 0.2) strength = 'very weak';
    else if (abs < 0.4) strength = 'weak';
    else if (abs < 0.6) strength = 'moderate';
    else if (abs < 0.8) strength = 'strong';
    else strength = 'very strong';
    
    const direction = correlation > 0 ? 'positive' : 'negative';
    
    return `${strength} ${direction} correlation (r = ${correlation.toFixed(2)})`;
  };

  // Get color based on correlation strength
  const getCorrelationColor = (correlation) => {
    if (correlation === null) return 'gray';
    
    const abs = Math.abs(correlation);
    
    if (abs < 0.2) return '#9ca3af'; // gray-400
    if (abs < 0.4) return correlation > 0 ? '#60a5fa' : '#f87171'; // blue-400 or red-400
    if (abs < 0.6) return correlation > 0 ? '#3b82f6' : '#ef4444'; // blue-500 or red-500
    if (abs < 0.8) return correlation > 0 ? '#2563eb' : '#dc2626'; // blue-600 or red-600
    return correlation > 0 ? '#1d4ed8' : '#b91c1c'; // blue-700 or red-700
  };

  // Format chart options
  const getChartOptions = (metric1, metric2) => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const point = context.raw;
              return [
                `${metricConfigs[metric1].label}: ${point.x} ${metricConfigs[metric1].unit}`,
                `${metricConfigs[metric2].label}: ${point.y} ${metricConfigs[metric2].unit}`,
                `Date: ${new Date(point.date).toLocaleDateString()}`,
              ];
            }
          },
          backgroundColor: darkMode ? 'rgba(17, 24, 39, 0.9)' : 'rgba(255, 255, 255, 0.9)',
          titleColor: darkMode ? '#e5e7eb' : '#111827',
          bodyColor: darkMode ? '#e5e7eb' : '#4b5563',
          borderColor: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
          borderWidth: 1,
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: `${metricConfigs[metric1].label} (${metricConfigs[metric1].unit})`,
            color: darkMode ? '#e5e7eb' : '#111827',
          },
          ticks: {
            color: darkMode ? '#9ca3af' : '#6b7280',
          },
          grid: {
            color: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
          },
        },
        y: {
          title: {
            display: true,
            text: `${metricConfigs[metric2].label} (${metricConfigs[metric2].unit})`,
            color: darkMode ? '#e5e7eb' : '#111827',
          },
          ticks: {
            color: darkMode ? '#9ca3af' : '#6b7280',
          },
          grid: {
            color: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
          },
        }
      }
    };
  };

  // Get insight text about the correlation
  const getCorrelationInsight = (metric1, metric2, correlation) => {
    if (correlation === null) return 'More data points needed to determine correlation.';
    
    const abs = Math.abs(correlation);
    const strength = abs < 0.3 ? 'weak' : abs < 0.7 ? 'moderate' : 'strong';
    const direction = correlation > 0 ? 'positive' : 'negative';
    
    // Special case interpretations for common pairs
    if ((metric1 === 'sleep' && metric2 === 'bloodPressure') || 
        (metric2 === 'sleep' && metric1 === 'bloodPressure')) {
      if (correlation < -0.3)
        return 'Better sleep quality appears to be associated with lower blood pressure readings, which aligns with research showing sleep's importance for cardiovascular health.';
      else if (correlation > 0.3)
        return 'Unexpectedly, more sleep appears to correlate with higher blood pressure in your data. This could be worth discussing with a healthcare provider.';
      else
        return 'There doesn\'t seem to be a strong relationship between your sleep and blood pressure based on available data.';
    }
    
    if ((metric1 === 'weight' && metric2 === 'bloodPressure') || 
        (metric2 === 'weight' && metric1 === 'bloodPressure')) {
      if (correlation > 0.3)
        return 'There appears to be a relationship between weight and blood pressure, which is consistent with medical research showing that weight management can help control blood pressure.';
      else
        return 'Your data doesn\'t show a strong correlation between weight and blood pressure, which may indicate other factors have more influence on your blood pressure.';
    }
    
    // General interpretations
    if (direction === 'positive') {
      return `The ${strength} positive correlation suggests that as ${metricConfigs[metric1].label} increases, ${metricConfigs[metric2].label} tends to increase as well.`;
    } else {
      return `The ${strength} negative correlation suggests that as ${metricConfigs[metric1].label} increases, ${metricConfigs[metric2].label} tends to decrease.`;
    }
  };

  return (
    <div>
      {/* Metrics Selection */}
      <div className={`mb-6 p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <h3 className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
          Select Metrics to Analyze Correlations
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
      
      {/* Selection prompt */}
      {selectedMetrics.length < 2 && (
        <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border text-center mb-6`}>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
            Please select at least two metrics to analyze correlations between them.
          </p>
        </div>
      )}
      
      {/* Correlation Matrix */}
      {selectedMetrics.length >= 2 && (
        <>
          <div className={`p-4 mb-6 rounded-xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
            <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Correlation Summary
            </h3>
            
            <div className="overflow-x-auto">
              <table className={`min-w-full ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <thead>
                  <tr className={darkMode ? 'border-b border-gray-700' : 'border-b'}>
                    <th className="py-2 px-3 text-left">Metrics</th>
                    <th className="py-2 px-3 text-left">Correlation</th>
                    <th className="py-2 px-3 text-left">Interpretation</th>
                    <th className="py-2 px-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {metricPairs.map(({ x, y }, index) => {
                    const scatterData = prepareScatterData(x, y);
                    const correlation = scatterData?.correlation || null;
                    
                    return (
                      <tr 
                        key={index} 
                        className={`${darkMode ? 'border-b border-gray-700' : 'border-b'} hover:${darkMode ? 'bg-gray-750' : 'bg-gray-50'} cursor-pointer`}
                        onClick={() => setPrimaryMetric({ metric1: x, metric2: y })}
                      >
                        <td className="py-3 px-3">
                          <div className="flex items-center">
                            <span className="mr-2" style={{ color: metricConfigs[x].color }}>
                              {metricConfigs[x].icon}
                            </span>
                            <span>vs</span>
                            <span className="ml-2" style={{ color: metricConfigs[y].color }}>
                              {metricConfigs[y].icon}
                            </span>
                          </div>
                          <div className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {metricConfigs[x].label} & {metricConfigs[y].label}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          {correlation !== null ? (
                            <div className="flex items-center">
                              <div 
                                className={`w-2 h-2 rounded-full mr-2`} 
                                style={{ backgroundColor: getCorrelationColor(correlation) }}
                              ></div>
                              <span>{correlation.toFixed(2)}</span>
                            </div>
                          ) : (
                            <span className="text-gray-400">Insufficient data</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-sm">
                          {getCorrelationDescription(correlation)}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <button 
                            className={`px-2 py-1 rounded text-xs ${
                              darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setPrimaryMetric({ metric1: x, metric2: y });
                            }}
                          >
                            View Detail
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Detailed Correlation View */}
          {primaryMetric && (() => {
            const { metric1, metric2 } = primaryMetric;
            const scatterData = prepareScatterData(metric1, metric2);
            
            if (!scatterData) return (
              <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border text-center mb-6`}>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                  Not enough matching data points to analyze correlation. Try recording more data on the same days.
                </p>
              </div>
            );
            
            const { points, correlation } = scatterData;
            
            // Format data for chart
            const chartData = {
              datasets: [
                {
                  label: `${metricConfigs[metric1].label} vs ${metricConfigs[metric2].label}`,
                  data: points,
                  backgroundColor: getCorrelationColor(correlation),
                  borderColor: 'rgba(0,0,0,0)',
                  pointRadius: 6,
                  pointHoverRadius: 8,
                }
              ]
            };
            
            const chartOptions = getChartOptions(metric1, metric2);
            
            return (
              <div className={`rounded-xl overflow-hidden border mb-6 ${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              } shadow-sm transition-all duration-300`}>
                {/* Header */}
                <div 
                  className={`px-6 py-4 flex justify-between items-center ${
                    darkMode ? 'bg-gray-900' : 'bg-gray-50'
                  } border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
                >
                  <div className="flex items-center">
                    <span 
                      className="p-2 rounded-full mr-3"
                      style={{ backgroundColor: `rgba(${getCorrelationColor(correlation).replace(/[^\d,]/g, '')},0.2)` }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                      </svg>
                    </span>
                    <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {metricConfigs[metric1].label} vs {metricConfigs[metric2].label} Correlation
                    </h3>
                  </div>
                  
                  <button 
                    onClick={() => setPrimaryMetric(null)}
                    className={`rounded-md ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                {/* Chart */}
                <div className="p-6">
                  <div className="h-80">
                    <Scatter data={chartData} options={chartOptions} />
                  </div>
                </div>
                
                {/* Analysis */}
                <div className={`px-6 py-4 ${darkMode ? 'bg-gray-900/40' : 'bg-gray-50'} border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <h4 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Correlation Analysis
                  </h4>
                  
                  <div className="flex items-center mb-4">
                    <div 
                      className={`px-3 py-1 rounded-full text-sm font-medium`}
                      style={{ 
                        backgroundColor: `rgba(${getCorrelationColor(correlation).replace(/[^\d,]/g, '')},0.2)`,
                        color: getCorrelationColor(correlation)
                      }}
                    >
                      {getCorrelationDescription(correlation)}
                    </div>
                  </div>
                  
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {getCorrelationInsight(metric1, metric2, correlation)}
                  </p>
                  
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                      <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase`}>
                        Correlation Coefficient
                      </p>
                      <p className={`mt-1 font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        r = {correlation !== null ? correlation.toFixed(4) : 'N/A'}
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                      <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase`}>
                        Data Points
                      </p>
                      <p className={`mt-1 font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {points.length}
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                      <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase`}>
                        Statistical Significance
                      </p>
                      <p className={`mt-1 font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {points.length > 10 && Math.abs(correlation) > 0.5 ? 'Significant' : 
                         points.length <= 10 ? 'More data needed' : 'Not significant'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </>
      )}
      
      {/* Education Section */}
      <div className={`p-6 rounded-xl ${darkMode ? 'bg-blue-900/20 border-blue-900/30' : 'bg-blue-50 border-blue-100'} border mb-6`}>
        <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
          Understanding Correlations
        </h3>
        <p className={`text-sm ${darkMode ? 'text-blue-200' : 'text-blue-700'} mb-3`}>
          Correlation measures how two metrics change together, with values from -1 to 1:
        </p>
        <ul className={`list-disc pl-5 text-sm space-y-2 ${darkMode ? 'text-blue-200' : 'text-blue-700'}`}>
          <li><strong>Positive correlation (0 to 1):</strong> As one metric increases, the other tends to increase too.</li>
          <li><strong>Negative correlation (0 to -1):</strong> As one metric increases, the other tends to decrease.</li>
          <li><strong>No correlation (near 0):</strong> No consistent relationship between the metrics.</li>
        </ul>
        <div className={`mt-4 text-sm ${darkMode ? 'text-blue-300' : 'text-blue-800'} font-medium`}>
          <strong>Important:</strong> Correlation does not necessarily indicate causation. Other factors may be involved.
        </div>
      </div>
    </div>
  );
};

export default CorrelationAnalysis;