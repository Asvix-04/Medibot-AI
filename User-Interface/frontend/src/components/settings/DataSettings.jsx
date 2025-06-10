import React, { useState, useEffect, useCallback } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { useToast } from '../../context/ToastContext';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import { jsPDF } from 'jspdf';
import { auth, db, storage } from '../../firebase';
import { 
  collection, getDocs, doc, /* deleteDoc, */ writeBatch, query, where, setDoc
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL /* , deleteObject */ } from 'firebase/storage';

const DataSettings = () => {
  // Use settings from context instead of local state
  const { settings, updateSettings } = useSettings();
  const { addToast } = useToast();
  
  // Get data settings from context or use defaults
  const [dataOptions, setDataOptions] = useState(
    settings.data || {
      autoBackup: true,
      backupFrequency: 'weekly',
      dataRetention: '6months',
      dataSharing: {
        anonymousResearch: true,
        serviceImprovement: true,
        thirdParties: false
      }
    }
  );
  
  const [syncStatus, setSyncStatus] = useState('synced'); 
  const [exportFormat, setExportFormat] = useState('json');
  const [dataUsage, setDataUsage] = useState({
    chatHistory: { size: 0, count: 0 },
    healthMetrics: { size: 0, count: 0 },
    medications: { size: 0, count: 0 },
    appointments: { size: 0, count: 0 }
  });
  const [fileInput, setFileInput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load real data usage statistics when component mounts
  useEffect(() => {
    fetchDataUsageStats();
  }, []);

  // Update local state when settings change
  useEffect(() => {
    if (settings.data) {
      setDataOptions(settings.data);
    }
  }, [settings.data]);

  // Fetch real data usage statistics from Firestore
  const fetchDataUsageStats = useCallback(async () => {
    if (!auth.currentUser) return;
    
    setIsLoading(true);
    const userId = auth.currentUser.uid;
    const stats = { ...dataUsage };
    
    try {
      // Fetch chat history count
      const chatQuery = query(collection(db, "conversations"), where("userId", "==", userId));
      const chatSnapshot = await getDocs(chatQuery);
      stats.chatHistory.count = chatSnapshot.size;
      stats.chatHistory.size = estimateSizeFromDocs(chatSnapshot.docs);
      
      // Fetch health metrics
      const healthMetricsDoc = await getDocs(collection(db, "users", userId, "healthMetrics"));
      stats.healthMetrics.count = healthMetricsDoc.size;
      stats.healthMetrics.size = estimateSizeFromDocs(healthMetricsDoc.docs);
      
      // Fetch medications
      const medsQuery = query(collection(db, "users", userId, "medications"));
      const medsSnapshot = await getDocs(medsQuery);
      stats.medications.count = medsSnapshot.size;
      stats.medications.size = estimateSizeFromDocs(medsSnapshot.docs);
      
      // Fetch appointments
      const apptsQuery = query(collection(db, "users", userId, "appointments"));
      const apptsSnapshot = await getDocs(apptsQuery);
      stats.appointments.count = apptsSnapshot.size;
      stats.appointments.size = estimateSizeFromDocs(apptsSnapshot.docs);
      
      setDataUsage(stats);
    } catch (error) {
      console.error("Error fetching data usage stats:", error);
      addToast("Failed to load data usage statistics", "error");
    } finally {
      setIsLoading(false);
    }
  }, [dataUsage, addToast]);
  
  // Estimate size of documents in bytes
  const estimateSizeFromDocs = (docs) => {
    let totalSize = 0;
    docs.forEach(doc => {
      // Approximate size calculation - this is an estimation
      const dataStr = JSON.stringify(doc.data());
      totalSize += new Blob([dataStr]).size;
    });
    return totalSize;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setDataOptions({
        ...dataOptions,
        [parent]: {
          ...dataOptions[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      });
    } else {
      setDataOptions({
        ...dataOptions,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };
  
  const saveSettings = () => {
    // Save to settings context
    updateSettings('data', dataOptions);
    addToast('Data settings saved successfully!', 'success');
  };
  
  // Handle file import
  const handleImport = async (e) => {
    e.preventDefault();
    
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      addToast('Please select a file to import', 'error');
      return;
    }
    
    const file = fileInput.files[0];
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      addToast('File size exceeds 10MB limit', 'error');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const fileReader = new FileReader();
      
      fileReader.onload = async (event) => {
        const content = event.target.result;
        
        try {
          // Process based on file type
          if (file.name.endsWith('.json')) {
            await importJsonData(content);
          } else if (file.name.endsWith('.csv')) {
            await importCsvData(content);
          } else {
            throw new Error('Unsupported file format. Please use JSON or CSV files.');
          }
          
          addToast('Data imported successfully!', 'success');
          // Refresh stats after import
          fetchDataUsageStats();
        } catch (error) {
          console.error('Error importing data:', error);
          addToast(`Import failed: ${error.message}`, 'error');
        } finally {
          setIsLoading(false);
        }
      };
      
      fileReader.onerror = () => {
        setIsLoading(false);
        addToast('Error reading file', 'error');
      };
      
      if (file.name.endsWith('.json') || file.name.endsWith('.csv')) {
        fileReader.readAsText(file);
      } else {
        throw new Error('Unsupported file format. Please use JSON or CSV files.');
      }
    } catch (error) {
      setIsLoading(false);
      addToast(`Import failed: ${error.message}`, 'error');
    }
  };
  
  // Import JSON data
  const importJsonData = async (content) => {
    if (!auth.currentUser) throw new Error('You must be signed in to import data');
    
    const userId = auth.currentUser.uid;
    const data = JSON.parse(content);
    const batch = writeBatch(db);
    
    // Process and import different types of data
    if (data.healthMetrics && Array.isArray(data.healthMetrics)) {
      data.healthMetrics.forEach((metric, index) => {
        const metricRef = doc(collection(db, "users", userId, "healthMetrics"));
        batch.set(metricRef, {
          ...metric,
          importedAt: new Date(),
          importSource: 'user-upload'
        });
      });
    }
    
    // Add other data types as needed
    
    await batch.commit();
  };
  
  // Import CSV data
  const importCsvData = async (content) => {
    if (!auth.currentUser) throw new Error('You must be signed in to import data');
    
    const userId = auth.currentUser.uid;
    const results = Papa.parse(content, { header: true });
    
    if (results.errors.length > 0) {
      throw new Error(`CSV parsing error: ${results.errors[0].message}`);
    }
    
    const batch = writeBatch(db);
    
    // Try to determine data type from CSV structure
    const firstRow = results.data[0];
    if (!firstRow) throw new Error('CSV file is empty');
    
    // Process based on detected data type
    if ('systolic' in firstRow || 'diastolic' in firstRow) {
      // Looks like blood pressure data
      results.data.forEach((row, index) => {
        if (!row.date) return; // Skip rows without date
        
        const metricRef = doc(collection(db, "users", userId, "healthMetrics"));
        batch.set(metricRef, {
          type: 'bloodPressure',
          date: new Date(row.date),
          systolic: parseInt(row.systolic) || 0,
          diastolic: parseInt(row.diastolic) || 0,
          importedAt: new Date(),
          importSource: 'csv-upload'
        });
      });
    } else if ('value' in firstRow && 'metric' in firstRow) {
      // Generic health metric
      results.data.forEach((row, index) => {
        if (!row.date || !row.metric) return; // Skip incomplete rows
        
        const metricRef = doc(collection(db, "users", userId, "healthMetrics"));
        batch.set(metricRef, {
          type: row.metric.toLowerCase(),
          date: new Date(row.date),
          value: parseFloat(row.value) || 0,
          importedAt: new Date(),
          importSource: 'csv-upload'
        });
      });
    }
    
    await batch.commit();
  };
  
  // Export data
  const handleExport = async (format) => {
    if (!auth.currentUser) {
      addToast('You must be signed in to export data', 'error');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const userId = auth.currentUser.uid;
      
      // Fetch all user data
      const healthMetricsSnapshot = await getDocs(collection(db, "users", userId, "healthMetrics"));
      const medicationsSnapshot = await getDocs(collection(db, "users", userId, "medications"));
      const appointmentsSnapshot = await getDocs(collection(db, "users", userId, "appointments"));
      
      const healthMetrics = healthMetricsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      const medications = medicationsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      const appointments = appointmentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      const userData = {
        healthMetrics,
        medications,
        appointments,
        exportDate: new Date().toISOString()
      };
      
      if (format === 'json') {
        // Export as JSON
        const blob = new Blob([JSON.stringify(userData, null, 2)], {
          type: 'application/json'
        });
        saveAs(blob, `medibot-data-export-${new Date().toISOString().split('T')[0]}.json`);
      } else if (format === 'csv') {
        // Export each data type as separate CSV
        exportAsCsv('health-metrics', healthMetrics);
        exportAsCsv('medications', medications);
        exportAsCsv('appointments', appointments);
      } else if (format === 'pdf') {
        await exportAsPdf(userData);
      }
      
      addToast(`Data exported successfully as ${format.toUpperCase()}`, 'success');
    } catch (error) {
      console.error('Export error:', error);
      addToast(`Export failed: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Export data as CSV files
  const exportAsCsv = (name, data) => {
    if (!data || data.length === 0) return;
    
    // Convert to CSV
    const csv = Papa.unparse(data);
    
    // Create blob and save
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `medibot-${name}-${new Date().toISOString().split('T')[0]}.csv`);
  };
  
  // Export data as PDF
  const exportAsPdf = async (data) => {
    const pdf = new jsPDF();
    let yPos = 20;
    
    // Add title
    pdf.setFontSize(18);
    pdf.text('Medibot Health Data Export', 105, yPos, { align: 'center' });
    yPos += 10;
    
    // Add date
    pdf.setFontSize(12);
    pdf.text(`Export Date: ${new Date().toLocaleDateString()}`, 105, yPos, { align: 'center' });
    yPos += 20;
    
    // Add health metrics
    if (data.healthMetrics && data.healthMetrics.length > 0) {
      pdf.setFontSize(14);
      pdf.text('Health Metrics', 20, yPos);
      yPos += 10;
      
      // Only include first 50 records to avoid PDF getting too large
      const limitedMetrics = data.healthMetrics.slice(0, 50);
      
      pdf.setFontSize(10);
      for (const metric of limitedMetrics) {
        let metricText = `Date: ${new Date(metric.date).toLocaleDateString()} | `;
        
        if (metric.type === 'bloodPressure') {
          metricText += `Type: Blood Pressure | Systolic: ${metric.systolic} | Diastolic: ${metric.diastolic}`;
        } else {
          metricText += `Type: ${metric.type} | Value: ${metric.value || metric.hours || 'N/A'}`;
        }
        
        pdf.text(metricText, 20, yPos);
        yPos += 6;
        
        // Add page if needed
        if (yPos > 270) {
          pdf.addPage();
          yPos = 20;
        }
      }
      
      if (data.healthMetrics.length > 50) {
        pdf.text(`Note: Showing 50 of ${data.healthMetrics.length} health metrics.`, 20, yPos);
        yPos += 10;
      }
    }
    
    // Similar sections for medications and appointments would be added here
    
    pdf.save(`medibot-health-report-${new Date().toISOString().split('T')[0]}.pdf`);
  };
  
  // Handle cloud sync
  const handleSync = async () => {
    if (!auth.currentUser) {
      addToast('You must be signed in to sync data', 'error');
      return;
    }
    
    setSyncStatus('syncing');
    
    try {
      const userId = auth.currentUser.uid;
      
      // Prepare data for backup
      const healthMetricsSnapshot = await getDocs(collection(db, "users", userId, "healthMetrics"));
      const medicationsSnapshot = await getDocs(collection(db, "users", userId, "medications"));
      const appointmentsSnapshot = await getDocs(collection(db, "users", userId, "appointments"));
      
      const backupData = {
        healthMetrics: healthMetricsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })),
        medications: medicationsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })),
        appointments: appointmentsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })),
        timestamp: new Date().toISOString()
      };
      
      // Create backup file in Firebase Storage
      const backupBlob = new Blob([JSON.stringify(backupData)], { type: 'application/json' });
      const backupRef = ref(storage, `backups/${userId}/medibot-backup-${new Date().toISOString()}.json`);
      
      await uploadBytes(backupRef, backupBlob);
      const downloadUrl = await getDownloadURL(backupRef);
      
      // Save backup reference to user's profile
      const userBackupRef = doc(db, "users", userId, "backups", new Date().toISOString());
      await setDoc(userBackupRef, {
        timestamp: new Date(),
        fileUrl: downloadUrl,
        dataCount: {
          healthMetrics: backupData.healthMetrics.length,
          medications: backupData.medications.length,
          appointments: backupData.appointments.length
        }
      });
      
      setSyncStatus('synced');
      addToast('Data synchronized with cloud storage!', 'success');
    } catch (error) {
      console.error('Sync error:', error);
      setSyncStatus('error');
      addToast(`Sync failed: ${error.message}`, 'error');
    }
  };
  
  // Handle data deletion
  const handleDeleteData = async (dataType) => {
    if (!auth.currentUser) {
      addToast('You must be signed in to delete data', 'error');
      return;
    }
    
    // Confirmation with detailed warning
    const confirmMessage = dataType === 'all' 
      ? 'Are you sure you want to delete ALL your data? This action cannot be undone and will permanently remove all your health records, medications, and appointment history.'
      : `Are you sure you want to delete your ${dataType} data? This action cannot be undone.`;
      
    if (!window.confirm(confirmMessage)) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const userId = auth.currentUser.uid;
      const batch = writeBatch(db);
      
      if (dataType === 'all') {
        // Delete all data
        const collections = ['healthMetrics', 'medications', 'appointments'];
        
        for (const collName of collections) {
          const snapshot = await getDocs(collection(db, "users", userId, collName));
          snapshot.forEach(doc => {
            batch.delete(doc.ref);
          });
        }
        
        // Delete chat history
        const chatSnapshot = await getDocs(
          query(collection(db, "conversations"), where("userId", "==", userId))
        );
        
        chatSnapshot.forEach(doc => {
          batch.delete(doc.ref);
        });
      } else if (dataType === 'chat history') {
        // Delete chat history
        const chatSnapshot = await getDocs(
          query(collection(db, "conversations"), where("userId", "==", userId))
        );
        
        chatSnapshot.forEach(doc => {
          batch.delete(doc.ref);
        });
      } else if (dataType === 'health metrics') {
        // Delete health metrics
        const snapshot = await getDocs(collection(db, "users", userId, "healthMetrics"));
        snapshot.forEach(doc => {
          batch.delete(doc.ref);
        });
      } else if (dataType === 'medication') {
        // Delete medications
        const snapshot = await getDocs(collection(db, "users", userId, "medications"));
        snapshot.forEach(doc => {
          batch.delete(doc.ref);
        });
      }
      
      await batch.commit();
      
      // Update usage statistics
      fetchDataUsageStats();
      
      addToast(`Your ${dataType} data has been deleted.`, 'success');
    } catch (error) {
      console.error('Delete error:', error);
      addToast(`Failed to delete data: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };
  
  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Data Management</h2>
      
      <div className="space-y-8">
        {/* Data Usage */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 mb-8">
          <div className="border-b border-gray-200">
            <h2 className="text-lg font-medium text-white px-6 py-4 bg-gradient-to-r from-violet-600 to-indigo-700 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Data Usage
            </h2>
          </div>
          
          <div className="p-6">
            <div className="mb-6">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-gray-900">Total Storage Used</h3>
                <span className="text-lg font-bold text-violet-600">
                  {formatSize(Object.values(dataUsage).reduce((total, item) => total + item.size, 0))}
                </span>
              </div>
              
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-gradient-to-r from-violet-500 to-indigo-600 h-2.5 rounded-full" style={{ width: '30%' }}></div>
              </div>
              <p className="mt-1 text-xs text-gray-500">30% of allocated storage</p>
            </div>
            
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Type</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Records</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(dataUsage).map(([key, data]) => (
                  <tr key={key}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatSize(data.size)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {data.count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Data Backup & Export */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 mb-8">
          <div className="border-b border-gray-200">
            <h2 className="text-lg font-medium text-white px-6 py-4 bg-gradient-to-r from-violet-600 to-indigo-700 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
              </svg>
              Backup & Export
            </h2>
          </div>
          
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-md font-medium text-gray-900 mb-2">Cloud Backup</h3>
              
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-600">
                  Automatically back up your health data to secure cloud storage
                </p>
                <div className="flex items-center">
                  <input
                    id="auto-backup"
                    name="autoBackup"
                    type="checkbox"
                    checked={dataOptions.autoBackup}
                    onChange={handleChange}
                    className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded"
                  />
                  <label htmlFor="auto-backup" className="ml-2 text-sm text-gray-700">
                    Enable
                  </label>
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="backupFrequency" className="block text-sm font-medium text-gray-700 mb-1">
                  Backup Frequency
                </label>
                <select
                  id="backupFrequency"
                  name="backupFrequency"
                  value={dataOptions.backupFrequency}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              
              <div className="flex">
                <button
                  onClick={handleSync}
                  disabled={syncStatus === 'syncing'}
                  className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors duration-300 flex items-center disabled:opacity-50"
                >
                  {syncStatus === 'syncing' ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Syncing...
                    </>
                  ) : syncStatus === 'synced' ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Sync Now
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      Retry Sync
                    </>
                  )}
                </button>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-md font-medium text-gray-900 mb-4">Export Health Data</h3>
              
              <div className="mb-4">
                <label htmlFor="exportFormat" className="block text-sm font-medium text-gray-700 mb-1">
                  Export Format
                </label>
                <select
                  id="exportFormat"
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
                >
                  <option value="json">JSON</option>
                  <option value="csv">CSV</option>
                  <option value="pdf">PDF Report</option>
                </select>
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={() => handleExport(exportFormat)}
                  className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors duration-300 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Export All Data
                </button>
                
                <button
                  onClick={() => handleExport('health-summary')}
                  className="px-4 py-2 border border-violet-600 text-violet-600 rounded-lg hover:bg-violet-50 transition-colors duration-300 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export Health Summary
                </button>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6 mt-6">
              <h3 className="text-md font-medium text-gray-900 mb-4">Import Health Data</h3>
              
              <form onSubmit={handleImport} className="flex items-center">
                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-violet-600 hover:text-violet-500 focus-within:outline-none">
                  <span>Upload a file</span>
                  <input 
                    id="file-upload" 
                    name="file-upload" 
                    type="file" 
                    accept=".json,.csv" 
                    className="sr-only"
                    onChange={(e) => setFileInput(e.target)} 
                  />
                </label>
                <p className="pl-1 text-sm text-gray-500">or drag and drop</p>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="ml-auto px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors duration-300 flex items-center disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Importing...
                    </>
                  ) : 'Import'}
                </button>
              </form>
              <p className="mt-1 text-xs text-gray-500">JSON or CSV files up to 10MB</p>
            </div>
          </div>
        </div>
        
        {/* Data Retention & Privacy */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 mb-8">
          <div className="border-b border-gray-200">
            <h2 className="text-lg font-medium text-white px-6 py-4 bg-gradient-to-r from-violet-600 to-indigo-700 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
              </svg>
              Data Retention & Privacy
            </h2>
          </div>
          
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-md font-medium text-gray-900 mb-2">Data Retention</h3>
              <p className="text-sm text-gray-600 mb-3">
                Choose how long Medibot should store your health data
              </p>
              
              <select
                name="dataRetention"
                value={dataOptions.dataRetention}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
              >
                <option value="forever">Indefinitely (until manually deleted)</option>
                <option value="1year">1 Year</option>
                <option value="6months">6 Months</option>
                <option value="3months">3 Months</option>
                <option value="1month">1 Month</option>
              </select>
            </div>
            
            <div className="mb-6">
              <h3 className="text-md font-medium text-gray-900 mb-2">Data Sharing</h3>
              <p className="text-sm text-gray-600 mb-3">
                Control how your anonymized health data may be shared
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    id="anonymous-research"
                    name="dataSharing.anonymousResearch"
                    type="checkbox"
                    checked={dataOptions.dataSharing.anonymousResearch}
                    onChange={handleChange}
                    className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded"
                  />
                  <label htmlFor="anonymous-research" className="ml-3 text-sm text-gray-700">
                    Anonymous medical research
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="service-improvement"
                    name="dataSharing.serviceImprovement"
                    type="checkbox"
                    checked={dataOptions.dataSharing.serviceImprovement}
                    onChange={handleChange}
                    className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded"
                  />
                  <label htmlFor="service-improvement" className="ml-3 text-sm text-gray-700">
                    Service improvement (AI training)
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="third-parties"
                    name="dataSharing.thirdParties"
                    type="checkbox"
                    checked={dataOptions.dataSharing.thirdParties}
                    onChange={handleChange}
                    className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded"
                  />
                  <label htmlFor="third-parties" className="ml-3 text-sm text-gray-700">
                    Trusted third parties (for additional services)
                  </label>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-md font-medium text-gray-900 mb-4">Data Management</h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-red-50 rounded-lg">
                  <h4 className="text-sm font-medium text-red-800 mb-1">Delete Specific Data</h4>
                  <p className="text-xs text-red-600 mb-3">
                    Delete specific categories of your health data. This action cannot be undone.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleDeleteData('chat history')}
                      className="px-3 py-1 bg-white border border-red-300 text-red-700 rounded hover:bg-red-50 text-xs"
                    >
                      Chat History
                    </button>
                    <button
                      onClick={() => handleDeleteData('health metrics')}
                      className="px-3 py-1 bg-white border border-red-300 text-red-700 rounded hover:bg-red-50 text-xs"
                    >
                      Health Metrics
                    </button>
                    <button
                      onClick={() => handleDeleteData('medication')}
                      className="px-3 py-1 bg-white border border-red-300 text-red-700 rounded hover:bg-red-50 text-xs"
                    >
                      Medication Data
                    </button>
                  </div>
                </div>
                
                <div className="p-4 bg-red-50 rounded-lg">
                  <h4 className="text-sm font-medium text-red-800 mb-1">Clear All Data</h4>
                  <p className="text-xs text-red-600 mb-3">
                    Delete all your health data from Medibot. This action cannot be undone.
                  </p>
                  <button
                    onClick={() => handleDeleteData('all')}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
                  >
                    Delete All My Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Save Button */}
        <div className="pt-4">
          <button
            type="button"
            onClick={saveSettings}
            disabled={isLoading}
            className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-700 text-white rounded-lg hover:from-violet-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50"
          >
            Save Data Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataSettings;