import React, { useState, useEffect } from 'react';
import { auth } from '../../firebase';
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
import { Line } from 'react-chartjs-2';
import HealthMetricsForm from './HealthMetricsForm';
import { useNavigate } from 'react-router-dom';
import medibot_logo from '../../assets/medibot_logo.jpg';

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

const HealthDashboard = ({ darkMode = false }) => {
  // State management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [healthMetrics, setHealthMetrics] = useState({
    bloodPressure: [],
    heartRate: [],
    bloodGlucose: [],
    weight: [],
    sleep: []
  });
  const [medications, setMedications] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [healthGoals, setHealthGoals] = useState([]);
  const [showAddMetricForm, setShowAddMetricForm] = useState(false);
  const navigate = useNavigate();
  
  // Mock data for demonstration
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const user = auth.currentUser;
        
        if (!user) {
          throw new Error("No user is signed in");
        }
        
        
        setHealthMetrics({
          bloodPressure: [
            { date: '2025-04-08', systolic: 120, diastolic: 80 },
            { date: '2025-04-09', systolic: 118, diastolic: 79 },
            { date: '2025-04-10', systolic: 122, diastolic: 82 },
            { date: '2025-04-11', systolic: 121, diastolic: 80 },
            { date: '2025-04-12', systolic: 119, diastolic: 78 },
            { date: '2025-04-13', systolic: 120, diastolic: 81 },
            { date: '2025-04-14', systolic: 118, diastolic: 79 }
          ],
          heartRate: [
            { date: '2025-04-08', value: 72 },
            { date: '2025-04-09', value: 74 },
            { date: '2025-04-10', value: 71 },
            { date: '2025-04-11', value: 73 },
            { date: '2025-04-12', value: 75 },
            { date: '2025-04-13', value: 72 },
            { date: '2025-04-14', value: 70 }
          ],
          bloodGlucose: [
            { date: '2025-04-08', value: 95 },
            { date: '2025-04-09', value: 98 },
            { date: '2025-04-10', value: 102 },
            { date: '2025-04-11', value: 97 },
            { date: '2025-04-12', value: 99 },
            { date: '2025-04-13', value: 96 },
            { date: '2025-04-14', value: 98 }
          ],
          weight: [
            { date: '2025-04-01', value: 68.5 },
            { date: '2025-04-07', value: 68.2 },
            { date: '2025-04-14', value: 67.9 }
          ],
          sleep: [
            { date: '2025-04-08', hours: 7.5 },
            { date: '2025-04-09', hours: 6.8 },
            { date: '2025-04-10', hours: 7.2 },
            { date: '2025-04-11', hours: 8.0 },
            { date: '2025-04-12', hours: 7.3 },
            { date: '2025-04-13', hours: 6.5 },
            { date: '2025-04-14', hours: 7.8 }
          ]
        });
        
        // Mock medications data
        setMedications([
          {
            id: 1,
            name: 'Metformin',
            dosage: '500mg',
            frequency: 'Twice daily',
            timeOfDay: ['08:00', '20:00'],
            startDate: '2025-01-15',
            endDate: '2025-07-15',
            instructions: 'Take with meals',
            nextDose: new Date(new Date().setHours(20, 0, 0, 0))
          },
          {
            id: 2,
            name: 'Lisinopril',
            dosage: '10mg',
            frequency: 'Once daily',
            timeOfDay: ['09:00'],
            startDate: '2025-02-10',
            endDate: null, // Ongoing
            instructions: 'Take in the morning',
            nextDose: new Date(new Date().setHours(9, 0, 0, 0))
          },
          {
            id: 3,
            name: 'Vitamin D',
            dosage: '1000 IU',
            frequency: 'Once daily',
            timeOfDay: ['08:00'],
            startDate: '2025-01-01',
            endDate: null, // Ongoing
            instructions: 'Take with breakfast',
            nextDose: new Date(new Date().setHours(8, 0, 0, 0))
          }
        ]);
        
        // Mock upcoming appointments
        setUpcomingAppointments([
          {
            id: 1,
            doctor: 'Dr. Sharma',
            specialty: 'Cardiologist',
            date: '2025-04-22',
            time: '10:00',
            location: 'Heart Care Center, Mumbai',
            notes: 'Annual heart checkup'
          },
          {
            id: 2,
            doctor: 'Dr. Patel',
            specialty: 'Endocrinologist',
            date: '2025-05-05',
            time: '14:30',
            location: 'City Diabetes Clinic, Delhi',
            notes: 'Follow-up on medication adjustment'
          }
        ]);
        
        // Mock health goals
        setHealthGoals([
          {
            id: 1,
            title: 'Lower Blood Pressure',
            target: 'Below 120/80',
            progress: 85,
            startDate: '2025-03-01',
            endDate: '2025-06-01'
          },
          {
            id: 2,
            title: 'Reduce Weight',
            target: '65 kg',
            progress: 60,
            current: '67.9 kg',
            startDate: '2025-03-15',
            endDate: '2025-06-15'
          },
          {
            id: 3,
            title: 'Improve Sleep',
            target: '8 hours nightly',
            progress: 75,
            startDate: '2025-04-01',
            endDate: '2025-05-01'
          }
        ]);
        
      } catch (err) {
        console.error("Error fetching health data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Format date to display in more readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Check if medication needs to be taken soon (within 1 hour)
  const isMedicationDueSoon = (nextDose) => {
    const now = new Date();
    const oneHour = 60 * 60 * 1000;
    const diff = nextDose - now;
    return diff > 0 && diff < oneHour;
  };
  
  // Get next medication(s) to take
  const getUpcomingMedications = () => {
    const now = new Date();
    return medications
      .filter(med => med.nextDose > now)
      .sort((a, b) => a.nextDose - b.nextDose)
      .slice(0, 3);
  };
  
  // Format time difference to display how soon medication is needed
  const formatTimeDiff = (nextDose) => {
    const now = new Date();
    const diff = nextDose - now;
    const minutes = Math.floor(diff / (60 * 1000));
    
    if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''} from now`;
    } else {
      const hours = Math.floor(minutes / 60);
      return `${hours} hour${hours !== 1 ? 's' : ''} from now`;
    }
  };
  
  // Sort upcoming appointments by date
  const sortedAppointments = [...upcomingAppointments].sort((a, b) => {
    return new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`);
  });
  
  // Chart configuration for blood pressure
  const bloodPressureChartData = {
    labels: healthMetrics.bloodPressure.map(item => formatDate(item.date)),
    datasets: [
      {
        label: 'Systolic',
        data: healthMetrics.bloodPressure.map(item => item.systolic),
        borderColor: 'rgba(247, 86, 0, 0.8)',
        backgroundColor: 'rgba(247, 86, 0, 0.2)',
        tension: 0.4,
      },
      {
        label: 'Diastolic',
        data: healthMetrics.bloodPressure.map(item => item.diastolic),
        borderColor: 'rgba(226, 113, 29, 0.8)',
        backgroundColor: 'rgba(226, 113, 29, 0.2)',
        tension: 0.4,
      }
    ]
  };
  
  // Chart configuration for heart rate
  const heartRateChartData = {
    labels: healthMetrics.heartRate.map(item => formatDate(item.date)),
    datasets: [
      {
        label: 'Heart Rate',
        data: healthMetrics.heartRate.map(item => item.value),
        borderColor: 'rgba(239, 68, 68, 0.8)',
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        tension: 0.4,
        fill: true,
      }
    ]
  };
  
  // Chart configuration for blood glucose
  const glucoseChartData = {
    labels: healthMetrics.bloodGlucose.map(item => formatDate(item.date)),
    datasets: [
      {
        label: 'Blood Glucose',
        data: healthMetrics.bloodGlucose.map(item => item.value),
        borderColor: 'rgba(245, 158, 11, 0.8)',
        backgroundColor: 'rgba(245, 158, 11, 0.2)',
        tension: 0.4,
      }
    ]
  };
  
  // Chart configuration for weight
  const weightChartData = {
    labels: healthMetrics.weight.map(item => formatDate(item.date)),
    datasets: [
      {
        label: 'Weight (kg)',
        data: healthMetrics.weight.map(item => item.value),
        borderColor: 'rgba(16, 185, 129, 0.8)',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        tension: 0.4,
      }
    ]
  };
  
  // Common chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        displayColors: false,
        backgroundColor: 'rgba(53, 53, 91, 0.9)',
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        padding: 12,
        cornerRadius: 8
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        }
      },
      y: {
        grid: {
          color: 'rgba(156, 163, 175, 0.1)'
        }
      }
    }
  };

  const renderChart = (chartData, options) => {
    try {
      return <Line data={chartData} options={options} />;
    } catch (error) {
      console.error("Error rendering chart:", error);
      return (
        <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
          <p className="text-gray-500">Chart could not be loaded</p>
        </div>
      );
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-t-purple-600 border-r-transparent border-b-purple-600 border-l-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-700">Loading your health dashboard...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-medium text-red-800 mb-2">Error Loading Dashboard</h2>
        <p className="text-red-700">{error}</p>
        <button 
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Black header with logo - matches signin/signup */}
      <div className="bg-black py-5 px-4 mb-6 rounded-lg relative">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <img className="h-12 w-auto rounded-full p-1 bg-white mr-4" src={medibot_logo} alt="Medibot" />
            <div>
              <h1 className="text-2xl font-bold text-white">Health Dashboard</h1>
              <p className="text-xs text-gray-400">
                Monitor your health metrics, medications, and upcoming appointments
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
      
      {/* Then continue with your dashboard content, wrapped in this container: */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100 p-6">
        {/* Quick Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-[#f75600] to-[#E2711D] rounded-2xl p-5 text-white shadow-lg">
            <div className="flex items-start mb-2">
              <h3 className="text-lg font-medium">Blood Pressure</h3>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            {healthMetrics.bloodPressure.length > 0 && (
              <>
                <div className="text-3xl font-bold">
                  {healthMetrics.bloodPressure[healthMetrics.bloodPressure.length - 1].systolic}/
                  {healthMetrics.bloodPressure[healthMetrics.bloodPressure.length - 1].diastolic}
                </div>
                <p className="text-sm opacity-80">Last recorded on {formatDate(healthMetrics.bloodPressure[healthMetrics.bloodPressure.length - 1].date)}</p>
              </>
            )}
          </div>
          
          <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl p-5 text-white shadow-lg">
            <div className="flex items-start mb-2">
              <h3 className="text-lg font-medium">Heart Rate</h3>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            {healthMetrics.heartRate.length > 0 && (
              <>
                <div className="text-3xl font-bold">
                  {healthMetrics.heartRate[healthMetrics.heartRate.length - 1].value} <span className="text-xl">BPM</span>
                </div>
                <p className="text-sm opacity-80">Last recorded on {formatDate(healthMetrics.heartRate[healthMetrics.heartRate.length - 1].date)}</p>
              </>
            )}
          </div>
          
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-5 text-white shadow-lg">
            <div className="flex items-start mb-2">
              <h3 className="text-lg font-medium">Blood Glucose</h3>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            {healthMetrics.bloodGlucose.length > 0 && (
              <>
                <div className="text-3xl font-bold">
                  {healthMetrics.bloodGlucose[healthMetrics.bloodGlucose.length - 1].value} <span className="text-xl">mg/dL</span>
                </div>
                <p className="text-sm opacity-80">Last recorded on {formatDate(healthMetrics.bloodGlucose[healthMetrics.bloodGlucose.length - 1].date)}</p>
              </>
            )}
          </div>
          
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 text-white shadow-lg">
            <div className="flex items-start mb-2">
              <h3 className="text-lg font-medium">Weight</h3>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            </div>
            {healthMetrics.weight.length > 0 && (
              <>
                <div className="text-3xl font-bold">
                  {healthMetrics.weight[healthMetrics.weight.length - 1].value} <span className="text-xl">kg</span>
                </div>
                <p className="text-sm opacity-80">Last recorded on {formatDate(healthMetrics.weight[healthMetrics.weight.length - 1].date)}</p>
              </>
            )}
          </div>
        </div>
        
        {/* Medication Reminders */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 mb-8">
          <div className="border-b border-gray-200">
            <h2 className="text-lg font-medium text-white px-6 py-4 bg-gradient-to-r from-[#f75600] to-[#E2711D] rounded-t-lg flex items-center">
              {/* Icon and title */}
            </h2>
          </div>
          
          <div className="p-6">
            {medications.length > 0 ? (
              <div className="space-y-4">
                {getUpcomingMedications().map((medication) => (
                  <div 
                    key={medication.id}
                    className={`p-4 rounded-lg border ${
                      isMedicationDueSoon(medication.nextDose) 
                        ? 'bg-red-50 border-red-200' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{medication.name} ({medication.dosage})</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        isMedicationDueSoon(medication.nextDose)
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {formatTimeDiff(medication.nextDose)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{medication.instructions}</p>
                  </div>
                ))}
                
                <div className="flex justify-between items-center pt-2">
                  <button 
                    className="text-sm text-indigo-600 hover:text-indigo-800"
                    onClick={() => navigate('/medication-manager')}
                  >
                    View all medications
                  </button>
                  <button 
                    className="text-sm px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    onClick={() => navigate('/medication-manager', { state: { openAddForm: true } })}
                  >
                    Add medication
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-600 mb-4">No medications have been added</p>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                  Add your first medication
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Health Metrics Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Blood Pressure Chart */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <div className="border-b border-gray-200">
              <h2 className="text-lg font-medium px-6 py-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Blood Pressure History
              </h2>
            </div>
            <div className="h-64">
              {renderChart(bloodPressureChartData, chartOptions)}
            </div>
            <div className="mt-2 text-center text-sm text-gray-500">
              Showing data for the past week
            </div>
          </div>

          {/* Heart Rate Chart */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <div className="border-b border-gray-200">
              <h2 className="text-lg font-medium px-6 py-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Heart Rate History
              </h2>
            </div>
            <div className="p-6">
              <div className="h-64">
                {renderChart(heartRateChartData, chartOptions)}
              </div>
              <div className="mt-2 text-center text-sm text-gray-500">
                Showing data for the past week
              </div>
            </div>
          </div>

          {/* Blood Glucose Chart */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <div className="border-b border-gray-200">
              <h2 className="text-lg font-medium px-6 py-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                Blood Glucose History
              </h2>
            </div>
            <div className="p-6">
              <div className="h-64">
                {renderChart(glucoseChartData, chartOptions)}
              </div>
              <div className="mt-2 text-center text-sm text-gray-500">
                Showing data for the past week
              </div>
            </div>
          </div>

          {/* Weight Chart */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <div className="border-b border-gray-200">
              <h2 className="text-lg font-medium px-6 py-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
                Weight History
              </h2>
            </div>
            <div className="p-6">
              <div className="h-64">
                {renderChart(weightChartData, chartOptions)}
              </div>
              <div className="mt-2 text-center text-sm text-gray-500">
                Showing data for the past two weeks
              </div>
            </div>
          </div>
        </div>
        
        {/* Two Column Layout - Appointments and Health Goals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Upcoming Appointments */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <div className="border-b border-gray-200">
              <h2 className="text-lg font-medium text-white px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Upcoming Appointments
              </h2>
            </div>
            <div className="p-6">
              {sortedAppointments.length > 0 ? (
                <div className="space-y-4">
                  {sortedAppointments.map((appointment) => (
                    <div key={appointment.id} className="p-4 rounded-lg bg-blue-50 border border-blue-100">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900">
                          {appointment.doctor} <span className="text-blue-600">({appointment.specialty})</span>
                        </h3>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {formatDate(appointment.date)}, {appointment.time}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{appointment.location}</p>
                      <p className="text-sm text-gray-500 italic">{appointment.notes}</p>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-2">
                    <button 
                      onClick={() => navigate('/appointments', { state: { view: 'all' } })}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      View all appointments
                    </button>
                    <button 
                      onClick={() => navigate('/appointments')} 
                      className="text-sm px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Schedule appointment
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-600 mb-4">No upcoming appointments</p>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Schedule an appointment
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Health Goals */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <div className="border-b border-gray-200">
              <h2 className="text-lg font-medium text-white px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Health Goals
              </h2>
            </div>
            <div className="p-6">
              {healthGoals.length > 0 ? (
                <div className="space-y-5">
                  {healthGoals.map((goal) => (
                    <div key={goal.id} className="space-y-2">
                      <div className="flex justify-between">
                        <h3 className="font-medium text-gray-900">{goal.title}</h3>
                        <span className="text-sm text-gray-500">
                          {goal.progress}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-emerald-500 h-2 rounded-full" 
                          style={{ width: `${goal.progress}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Target: {goal.target}</span>
                        {goal.current && <span>Current: {goal.current}</span>}
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-2">
                    <button className="text-sm text-emerald-600 hover:text-emerald-800">
                      View all goals
                    </button>
                    <button className="text-sm px-3 py-1 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                      Add new goal
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-600 mb-4">No health goals have been set</p>
                  <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                    Set your first goal
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer with action buttons */}
        <div className="flex justify-center space-x-4">
          <button 
            onClick={() => setShowAddMetricForm(true)} 
            className="group relative flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-black">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Add Health Data
          </button>
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export Health Report
          </button>
        </div>

        {/* Form modal */}
        {showAddMetricForm && (
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
              </div>
              
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="relative">
                  {/* Close button */}
                  <button 
                    className="absolute -top-4 -right-4 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg"
                    onClick={() => setShowAddMetricForm(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  
                  {/* Form component */}
                  <HealthMetricsForm 
                    onSuccess={(metricType, newData) => {
                      // Update your local state here to refresh the dashboard
                      // For example, if it's blood pressure:
                      if (metricType === 'bloodPressure') {
                        setHealthMetrics(prev => ({
                          ...prev,
                          bloodPressure: [...prev.bloodPressure, newData]
                        }));
                      }
                      // Close the form
                      setShowAddMetricForm(false);
                    }} 
                    darkMode={darkMode}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthDashboard;