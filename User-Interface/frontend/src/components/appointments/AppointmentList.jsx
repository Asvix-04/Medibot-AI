import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { useToast } from '../../context/ToastContext';

const AppointmentList = ({ darkMode = false }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToast } = useToast();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      
      if (!user) {
        throw new Error("You must be logged in to view appointments");
      }
      
      const appointmentsRef = collection(db, "users", user.uid, "appointments");
      const q = query(appointmentsRef, orderBy("date", "asc"));
      const snapshot = await getDocs(q);
      
      const appointmentList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Convert Timestamp to string for easier handling
        date: doc.data().date,
        time: doc.data().time
      }));
      
      setAppointments(appointmentList);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      try {
        const user = auth.currentUser;
        await deleteDoc(doc(db, "users", user.uid, "appointments", id));
        addToast("Appointment cancelled successfully", "success");
        fetchAppointments(); // Refresh the list
      } catch (error) {
        console.error("Error cancelling appointment:", error);
        addToast(`Error: ${error.message}`, "error");
      }
    }
  };

  // Group appointments by date for better organization
  const groupedAppointments = appointments.reduce((groups, appointment) => {
    const date = appointment.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(appointment);
    return groups;
  }, {});

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-12 h-12 rounded-full animate-spin border-4 border-solid border-t-violet-500 border-r-transparent border-b-violet-500 border-l-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-6 rounded-xl ${darkMode ? 'bg-red-900/30 text-red-200' : 'bg-red-50 text-red-800'} mb-6`}>
        <p>{error}</p>
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border text-center`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-violet-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h3 className="text-lg font-medium mb-2">No Appointments</h3>
        <p className={`mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          You don't have any scheduled appointments yet.
        </p>
      </div>
    );
  }

  // Format date for display
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="space-y-8">
      {Object.entries(groupedAppointments).map(([date, dateAppointments]) => (
        <div key={date} className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border shadow-sm`}>
          <h3 className={`text-lg font-medium mb-4 pb-2 border-b ${darkMode ? 'border-gray-700 text-violet-300' : 'border-gray-200 text-violet-700'}`}>
            {formatDate(date)}
          </h3>
          
          <div className="space-y-4">
            {dateAppointments.map(appointment => (
              <div 
                key={appointment.id} 
                className={`p-4 rounded-lg ${
                  darkMode ? 'bg-gray-700 hover:bg-gray-650 border border-violet-900/30' : 'bg-gray-50 hover:bg-violet-50 border border-violet-100/30'
                } transition-colors`}
              >
                <div className="flex justify-between">
                  <div>
                    <div className="flex items-center">
                      <h4 className={`font-medium ${darkMode ? 'text-violet-200' : 'text-violet-800'}`}>{appointment.doctorName}</h4>
                      {appointment.specialty && (
                        <span className={`ml-2 text-sm px-2 py-0.5 rounded-full ${
                          darkMode ? 'bg-violet-900/30 text-violet-200' : 'bg-violet-100 text-violet-800'
                        }`}>
                          {appointment.specialty}
                        </span>
                      )}
                    </div>
                    
                    <div className={`mt-1 flex items-center text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-1 ${darkMode ? 'text-violet-400' : 'text-violet-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {appointment.time}
                    </div>
                    
                    {appointment.location && (
                      <div className={`mt-1 flex items-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-1 ${darkMode ? 'text-violet-400' : 'text-violet-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {appointment.location}
                      </div>
                    )}
                    
                    {appointment.notes && (
                      <div className={`mt-2 text-sm italic ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {appointment.notes}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <button
                      onClick={() => handleDelete(appointment.id)}
                      className={`text-sm px-3 py-1 rounded-lg ${
                        darkMode 
                          ? 'bg-violet-900/30 text-violet-200 hover:bg-violet-900/50' 
                          : 'bg-violet-100 text-violet-700 hover:bg-violet-200'
                      } transition-colors`}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AppointmentList;