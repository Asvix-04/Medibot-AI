import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ReportTemplate = ({
  title,
  template,
  healthData,
  medications,
  selectedMetrics,
  dateRange,
  includeInsights
}) => {
  // Format date for display
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    });
  };
  
  // Metric configurations
  const metricConfigs = {
    bloodPressure: {
      label: 'Blood Pressure',
      unit: 'mmHg',
      color: '#9333ea', // Purple
      normalRange: {
        systolic: { min: 90, max: 120 },
        diastolic: { min: 60, max: 80 }
      },
      getValue: (item) => `${item.systolic}/${item.diastolic} mmHg`
    },
    heartRate: {
      label: 'Heart Rate',
      unit: 'BPM',
      color: '#ef4444', // Red
      normalRange: { min: 60, max: 100 },
      getValue: (item) => `${item.value} BPM`
    },
    bloodGlucose: {
      label: 'Blood Glucose',
      unit: 'mg/dL',
      color: '#f59e0b', // Amber
      normalRange: { min: 80, max: 130 },
      getValue: (item) => `${item.value} mg/dL`
    },
    weight: {
      label: 'Weight',
      unit: 'kg',
      color: '#10b981', // Emerald
      getValue: (item) => `${item.value} kg`
    },
    sleep: {
      label: 'Sleep',
      unit: 'hours',
      color: '#3b82f6', // Blue
      normalRange: { min: 7, max: 9 },
      getValue: (item) => `${item.hours} hours`
    }
  };
  
  // Prepare chart data for a metric
  const prepareChartData = (metricType) => {
    const metric = healthData[metricType];
    
    if (!metric || metric.length === 0) {
      return null;
    }
    
    // Sort by date
    const sortedData = [...metric].sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
    });
    
    const labels = sortedData.map(item => item.date);
    
    const datasets = [];
    
    if (metricType === 'bloodPressure') {
      // Blood pressure has two values (systolic/diastolic)
      datasets.push({
        label: 'Systolic',
        data: sortedData.map(item => item.systolic),
        borderColor: '#9333ea', // Purple
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        tension: 0.3,
        pointRadius: 3
      });
      
      datasets.push({
        label: 'Diastolic',
        data: sortedData.map(item => item.diastolic),
        borderColor: '#6366f1', // Indigo
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.3,
        pointRadius: 3
      });
    } else {
      // Other metrics have a single value
      const valueKey = metricType === 'sleep' ? 'hours' : 'value';
      
      datasets.push({
        label: metricConfigs[metricType].label,
        data: sortedData.map(item => item[valueKey]),
        borderColor: metricConfigs[metricType].color,
        backgroundColor: `${metricConfigs[metricType].color}20`,
        tension: 0.3,
        pointRadius: 3
      });
    }
    
    return {
      labels,
      datasets
    };
  };
  
  // Get chart options for a metric
  const getChartOptions = (metricType) => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          align: 'end',
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            title: function(context) {
              return formatDate(context[0].label);
            }
          }
        }
      },
      scales: {
        x: {
          ticks: {
            maxRotation: 45,
            minRotation: 45,
            callback: function(value, index, values) {
              if (values.length > 10) {
                // Show fewer x-axis labels for readability
                if (index % Math.ceil(values.length / 10) !== 0) {
                  return '';
                }
              }
              const date = new Date(this.getLabelForValue(value));
              return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
            }
          },
          grid: {
            display: false
          }
        },
        y: {
          grid: {
            color: '#f1f1f1',
          }
        }
      }
    };
  };
  
  // Calculate statistics for metric
  const calculateStatistics = (metricType) => {
    const metric = healthData[metricType];
    
    if (!metric || metric.length === 0) {
      return {
        avg: 'N/A',
        min: 'N/A',
        max: 'N/A',
        count: 0,
        trend: 'neutral'
      };
    }
    
    let values = [];
    
    if (metricType === 'bloodPressure') {
      // For blood pressure, calculate stats for systolic
      values = metric.map(item => item.systolic);
    } else {
      // For other metrics, use the standard value field
      const valueKey = metricType === 'sleep' ? 'hours' : 'value';
      values = metric.map(item => item[valueKey]);
    }
    
    const sum = values.reduce((total, current) => total + current, 0);
    const avg = sum / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);
    
    // Calculate trend (recent readings vs overall average)
    let trend = 'neutral';
    if (values.length >= 3) {
      const recentValues = values.slice(-3);
      const recentAvg = recentValues.reduce((total, current) => total + current, 0) / recentValues.length;
      
      const difference = recentAvg - avg;
      const percentChange = (difference / avg) * 100;
      
      if (Math.abs(percentChange) > 5) {
        if (metricType === 'sleep' || metricType === 'weight') {
          // For these metrics, trend is more context-dependent
          trend = percentChange > 0 ? 'increasing' : 'decreasing';
        } else {
          // For vitals, lower is typically better
          trend = percentChange < 0 ? 'improving' : 'worsening';
        }
      }
    }
    
    return {
      avg: avg.toFixed(1),
      min: min,
      max: max,
      count: values.length,
      trend
    };
  };
  
  // Generate insights based on health data
  const generateInsights = () => {
    const insights = [];
    
    // Check if we have enough data
    const hasEnoughData = Object.values(healthData).some(metricArray => 
      Array.isArray(metricArray) && metricArray.length >= 3
    );
    
    if (!hasEnoughData) {
      return ["Insufficient data to generate insights. Continue tracking your health metrics regularly to receive personalized insights."];
    }
    
    // Blood pressure insights
    if (selectedMetrics.includes('bloodPressure') && healthData.bloodPressure && healthData.bloodPressure.length >= 3) {
      const bpData = [...healthData.bloodPressure].sort((a, b) => new Date(b.date) - new Date(a.date));
      const recentBP = bpData.slice(0, 3);
      const avgSystolic = recentBP.reduce((sum, item) => sum + item.systolic, 0) / recentBP.length;
      const avgDiastolic = recentBP.reduce((sum, item) => sum + item.diastolic, 0) / recentBP.length;
      
      if (avgSystolic > 140 || avgDiastolic > 90) {
        insights.push("Recent blood pressure readings appear elevated. Consider discussing these results with your healthcare provider.");
      } else if (avgSystolic > 120 || avgDiastolic > 80) {
        insights.push("Your recent blood pressure readings suggest pre-hypertension. Regular monitoring and lifestyle habits may help maintain healthier levels.");
      } else if (avgSystolic < 90 || avgDiastolic < 60) {
        insights.push("Your recent blood pressure readings are lower than typical ranges. If you're experiencing dizziness or fatigue, consult with your healthcare provider.");
      } else {
        insights.push("Your blood pressure appears to be within normal ranges. Keep up your healthy habits!");
      }
    }
    
    // Blood glucose insights
    if (selectedMetrics.includes('bloodGlucose') && healthData.bloodGlucose && healthData.bloodGlucose.length >= 3) {
      const glucoseData = [...healthData.bloodGlucose].sort((a, b) => new Date(b.date) - new Date(a.date));
      const recentGlucose = glucoseData.slice(0, 3);
      const avgGlucose = recentGlucose.reduce((sum, item) => sum + item.value, 0) / recentGlucose.length;
      
      if (avgGlucose > 180) {
        insights.push("Recent blood glucose readings are elevated. Consider discussing diabetes management with your healthcare provider.");
      } else if (avgGlucose > 130) {
        insights.push("Your recent blood glucose readings are higher than target range. Regular exercise and diet management may help.");
      } else if (avgGlucose < 70) {
        insights.push("Your recent blood glucose readings are below normal range, which can lead to hypoglycemia. Keep quick-acting carbohydrates accessible.");
      }
    }
    
    // Heart rate insights
    if (selectedMetrics.includes('heartRate') && healthData.heartRate && healthData.heartRate.length >= 3) {
      const hrData = [...healthData.heartRate].sort((a, b) => new Date(b.date) - new Date(a.date));
      const recentHR = hrData.slice(0, 3);
      const avgHR = recentHR.reduce((sum, item) => sum + item.value, 0) / recentHR.length;
      
      if (avgHR > 100) {
        insights.push("Your recent resting heart rate is elevated. This can be normal during stress or exercise, but if persistent, consider consulting your healthcare provider.");
      } else if (avgHR < 60) {
        insights.push("Your resting heart rate is lower than typical ranges. This can be normal for athletes but may warrant discussion with your healthcare provider if you're experiencing symptoms.");
      }
    }
    
    // Sleep insights
    if (selectedMetrics.includes('sleep') && healthData.sleep && healthData.sleep.length >= 5) {
      const sleepData = [...healthData.sleep].sort((a, b) => new Date(b.date) - new Date(a.date));
      const recentSleep = sleepData.slice(0, 5);
      const avgSleep = recentSleep.reduce((sum, item) => sum + item.hours, 0) / recentSleep.length;
      
      if (avgSleep < 6) {
        insights.push("You've been averaging less than 6 hours of sleep. Insufficient sleep can impact many aspects of health including metabolism and immune function.");
      } else if (avgSleep > 9) {
        insights.push("You've been averaging more than 9 hours of sleep. While individual needs vary, excessive sleep can sometimes be associated with other health conditions.");
      } else if (avgSleep >= 7 && avgSleep <= 9) {
        insights.push("Your sleep duration appears to be within recommended ranges. Quality sleep contributes to better overall health.");
      }
    }
    
    // Cross-metric insights
    if (selectedMetrics.includes('weight') && selectedMetrics.includes('bloodPressure') && 
        healthData.weight && healthData.weight.length >= 5 && 
        healthData.bloodPressure && healthData.bloodPressure.length >= 5) {
      
      // Calculate if weight is trending with blood pressure
      const weightData = [...healthData.weight].sort((a, b) => new Date(a.date) - new Date(b.date));
      const bpData = [...healthData.bloodPressure].sort((a, b) => new Date(a.date) - new Date(b.date));
      
      if (weightData.length >= 5 && bpData.length >= 5) {
        const firstWeights = weightData.slice(0, 3).map(w => w.value);
        const lastWeights = weightData.slice(-3).map(w => w.value);
        const firstBPs = bpData.slice(0, 3).map(bp => bp.systolic);
        const lastBPs = bpData.slice(-3).map(bp => bp.systolic);
        
        const weightTrend = (avgArray(lastWeights) - avgArray(firstWeights)) / avgArray(firstWeights);
        const bpTrend = (avgArray(lastBPs) - avgArray(firstBPs)) / avgArray(firstBPs);
        
        if (weightTrend > 0.03 && bpTrend > 0.03) {
          insights.push("There appears to be a correlation between weight increase and blood pressure elevation in your data. Weight management strategies may help improve both metrics.");
        } else if (weightTrend < -0.03 && bpTrend < -0.03) {
          insights.push("Your data shows a positive trend - both weight and blood pressure appear to be decreasing together. Keep up the good work!");
        }
      }
    }
    
    // Medication adherence insights
    if (medications && medications.length > 0) {
      insights.push("Regular medication adherence is important. Consider using the medication reminder feature if you're not already doing so.");
    }
    
    // General insights if we have limited specific insights
    if (insights.length < 2) {
      insights.push("Consistent monitoring of your health metrics can reveal important patterns over time. Try to record measurements at similar times each day for the most accurate trends.");
      insights.push("Consider discussing your health tracking data with your healthcare provider at your next appointment.");
    }
    
    return insights;
  };
  
  // Helper function to calculate average of an array
  const avgArray = (arr) => arr.reduce((sum, val) => sum + val, 0) / arr.length;
  
  // Create medication list grouped by status (current/past)
  const createMedicationList = () => {
    if (!medications || medications.length === 0) {
      return { current: [], past: [] };
    }
    
    const today = new Date();
    const current = [];
    const past = [];
    
    medications.forEach(med => {
      const startDate = new Date(med.startDate);
      const endDate = med.endDate ? new Date(med.endDate) : null;
      
      if (!endDate || endDate >= today) {
        current.push(med);
      } else {
        past.push(med);
      }
    });
    
    return { current, past };
  };
  
  const medicationGroups = createMedicationList();
  const insights = includeInsights ? generateInsights() : [];
  
  return (
    <div className="report-container font-sans text-gray-900">
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-gray-600 mt-1">
          Report period: {formatDate(dateRange.startDate)} to {formatDate(dateRange.endDate)}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Generated on {formatDate(new Date())}
        </p>
      </header>
      
      {/* Overview Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">
          Health Summary
        </h2>
        
        {selectedMetrics.length === 0 ? (
          <p className="text-gray-600">No health metrics selected for this report.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {selectedMetrics.map(metricType => {
              const stats = calculateStatistics(metricType);
              const config = metricConfigs[metricType];
              
              return (
                <div key={metricType} className="border rounded-lg p-4 bg-gray-50">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    {config.label}
                  </h3>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500">Average:</span>
                      <span className="text-sm font-medium">
                        {stats.avg !== 'N/A' ? `${stats.avg} ${config.unit}` : 'N/A'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500">Range:</span>
                      <span className="text-sm">
                        {stats.min !== 'N/A' ? `${stats.min} - ${stats.max} ${config.unit}` : 'N/A'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500">Readings:</span>
                      <span className="text-sm">{stats.count}</span>
                    </div>
                    
                    {stats.trend !== 'neutral' && stats.count > 2 && (
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-gray-500">Trend:</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          stats.trend === 'improving' ? 'bg-green-100 text-green-800' : 
                          stats.trend === 'worsening' ? 'bg-red-100 text-red-800' :
                          stats.trend === 'increasing' ? 'bg-blue-100 text-blue-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {stats.trend === 'improving' ? 'Improving' : 
                           stats.trend === 'worsening' ? 'Worsening' :
                           stats.trend.charAt(0).toUpperCase() + stats.trend.slice(1)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
      
      {/* Charts Section */}
      {selectedMetrics.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">
            Health Trends
          </h2>
          
          <div className="space-y-8">
            {selectedMetrics.map(metricType => {
              const chartData = prepareChartData(metricType);
              const config = metricConfigs[metricType];
              
              if (!chartData) {
                return (
                  <div key={metricType} className="border rounded-lg p-4 text-center">
                    <h3 className="font-medium mb-2">{config.label}</h3>
                    <p className="text-gray-500 text-sm">No data available for this period</p>
                  </div>
                );
              }
              
              return (
                <div key={metricType} className="border rounded-lg p-4 bg-white">
                  <h3 className="font-medium mb-4">{config.label}</h3>
                  <div className="h-64">
                    <Line
                      data={chartData}
                      options={getChartOptions(metricType)}
                    />
                  </div>
                  
                  {/* Normal Range Info */}
                  {config.normalRange && (
                    <div className="mt-3 text-xs text-gray-500 flex items-center">
                      <span className="w-3 h-3 inline-block rounded-full bg-green-100 border border-green-300 mr-1"></span>
                      <span>
                        Typical range: {
                          metricType === 'bloodPressure' 
                            ? `${config.normalRange.systolic.min}-${config.normalRange.systolic.max}/${config.normalRange.diastolic.min}-${config.normalRange.diastolic.max} mmHg` 
                            : `${config.normalRange.min}-${config.normalRange.max} ${config.unit}`
                        }
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}
      
      {/* Data Tables Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">
          Detailed Health Data
        </h2>
        
        {selectedMetrics.length === 0 ? (
          <p className="text-gray-600">No health metrics selected for this report.</p>
        ) : (
          <div className="space-y-6">
            {selectedMetrics.map(metricType => {
              const metric = healthData[metricType];
              const config = metricConfigs[metricType];
              
              if (!metric || metric.length === 0) {
                return (
                  <div key={metricType} className="border rounded-lg p-4 text-center">
                    <h3 className="font-medium mb-2">{config.label}</h3>
                    <p className="text-gray-500 text-sm">No data available for this period</p>
                  </div>
                );
              }
              
              // Sort by date, most recent first
              const sortedData = [...metric].sort((a, b) => {
                return new Date(b.date) - new Date(a.date);
              });
              
              return (
                <div key={metricType} className="overflow-hidden">
                  <h3 className="font-medium mb-3">{config.label}</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                          {metricType === 'bloodPressure' && (
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {sortedData.slice(0, 10).map((item, index) => (
                          <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                            <td className="px-4 py-2 text-sm text-gray-900">{formatDate(item.date)}</td>
                            <td className="px-4 py-2 text-sm text-gray-900 font-medium">{config.getValue(item)}</td>
                            {metricType === 'bloodPressure' && (
                              <td className="px-4 py-2 text-sm">
                                {(() => {
                                  const { systolic, diastolic } = item;
                                  if (systolic >= 180 || diastolic >= 120) return (
                                    <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                                      Hypertensive Crisis
                                    </span>
                                  );
                                  if (systolic >= 140 || diastolic >= 90) return (
                                    <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                                      Hypertension Stage 2
                                    </span>
                                  );
                                  if (systolic >= 130 || diastolic >= 80) return (
                                    <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-800">
                                      Hypertension Stage 1
                                    </span>
                                  );
                                  if (systolic >= 120 && systolic < 130 && diastolic < 80) return (
                                    <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                                      Elevated
                                    </span>
                                  );
                                  if (systolic < 120 && diastolic < 80) return (
                                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                                      Normal
                                    </span>
                                  );
                                  if (systolic < 90 || diastolic < 60) return (
                                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                                      Low
                                    </span>
                                  );
                                  return '';
                                })()}
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {sortedData.length > 10 && (
                      <div className="mt-2 text-xs text-right text-gray-500">
                        Showing 10 most recent entries of {sortedData.length} total.
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
      
      {/* Medications Section */}
      {includeMedications && (medicationGroups.current.length > 0 || medicationGroups.past.length > 0) && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">
            Medications
          </h2>
          
          {/* Current Medications */}
          {medicationGroups.current.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Current Medications</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medication</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dosage</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Started</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {medicationGroups.current.map((med, index) => (
                      <tr key={med.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="px-4 py-2 text-sm font-medium text-gray-900">{med.name}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{med.dosage}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {med.frequency}
                          <div className="text-xs text-gray-500">
                            {med.timeOfDay?.join(', ')}
                          </div>
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">{formatDate(med.startDate)}</td>
                        <td className="px-4 py-2 text-sm text-gray-500">
                          {med.reason ? med.reason : (med.notes ? med.notes : '-')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* Past Medications */}
          {medicationGroups.past.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-3">Past Medications</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medication</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dosage</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {medicationGroups.past.map((med, index) => (
                      <tr key={med.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="px-4 py-2 text-sm text-gray-900">{med.name}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{med.dosage}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {formatDate(med.startDate)} - {formatDate(med.endDate)}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-500">
                          {med.reason || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      )}
      
      {/* AI Insights Section */}
      {includeInsights && insights.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">
            Health Insights
          </h2>
          
          <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4">
            <ul className="list-disc pl-5 space-y-2">
              {insights.map((insight, index) => (
                <li key={index} className="text-gray-800">{insight}</li>
              ))}
            </ul>
            
            <div className="mt-4 pt-3 border-t border-indigo-200 text-xs text-gray-500">
              <p>These insights are generated automatically based on your health data and are for informational purposes only. 
              Always consult with a healthcare professional before making changes to your health regimen.</p>
            </div>
          </div>
        </section>
      )}
      
      {/* Footer */}
      <footer className="text-center text-xs text-gray-400 mt-12 pt-6 border-t border-gray-200">
        <p>This report is generated for informational purposes only and is not intended as medical advice.</p>
        <p className="mt-1">Medibot Health Report | Generated on {new Date().toLocaleString()}</p>
      </footer>
    </div>
  );
};

export default ReportTemplate;