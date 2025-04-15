import React, { useState } from 'react';

const DataSettings = () => {
  const [dataOptions, setDataOptions] = useState({
    autoBackup: true,
    backupFrequency: 'weekly',
    dataRetention: '6months',
    dataSharing: {
      anonymousResearch: true,
      serviceImprovement: true,
      thirdParties: false
    }
  });
  
  const [syncStatus, setSyncStatus] = useState('synced'); // 'synced', 'syncing', 'error'
  const [exportFormat, setExportFormat] = useState('json');
  const [message, setMessage] = useState({ type: '', text: '' });
  
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
  
  const handleImport = (e) => {
    e.preventDefault();
    // This would be implemented with actual file handling logic
    setMessage({ type: 'success', text: 'Data imported successfully! Processing your information...' });
    
    // Clear the message after 3 seconds
    setTimeout(() => {
      setMessage({ type: '', text: '' });
    }, 3000);
  };
  
  const handleExport = (format) => {
    // This would generate and download the actual file
    setMessage({ type: 'success', text: `Health data exported in ${format.toUpperCase()} format successfully!` });
    
    // Clear the message after 3 seconds
    setTimeout(() => {
      setMessage({ type: '', text: '' });
    }, 3000);
  };
  
  const handleSync = () => {
    setSyncStatus('syncing');
    
    // Simulate sync process
    setTimeout(() => {
      setSyncStatus('synced');
      setMessage({ type: 'success', text: 'Data synchronized with cloud storage!' });
      
      // Clear the message after 3 seconds
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
    }, 2000);
  };
  
  const handleDeleteData = (dataType) => {
    if (window.confirm(`Are you sure you want to delete your ${dataType} data? This action cannot be undone.`)) {
      setMessage({ type: 'success', text: `Your ${dataType} data has been deleted.` });
      
      // Clear the message after 3 seconds
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
    }
  };
  
  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  // Mock data usage statistics
  const dataUsage = {
    chatHistory: { size: 1200000, count: 125 },
    healthMetrics: { size: 3500000, count: 450 },
    medications: { size: 800000, count: 15 },
    appointments: { size: 650000, count: 8 },
    profiles: { size: 250000, count: 1 }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Data Management</h2>
      
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {message.text}
        </div>
      )}
      
      <div className="space-y-8">
        {/* Data Usage */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 mb-8">
          <div className="border-b border-gray-200">
            <h2 className="text-lg font-medium text-white px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center">
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
                <span className="text-lg font-bold text-indigo-600">
                  {formatSize(Object.values(dataUsage).reduce((total, item) => total + item.size, 0))}
                </span>
              </div>
              
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full" style={{ width: '30%' }}></div>
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
            <h2 className="text-lg font-medium text-white px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center">
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
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
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
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-300 flex items-center disabled:opacity-50"
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
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="json">JSON</option>
                  <option value="csv">CSV</option>
                  <option value="pdf">PDF Report</option>
                </select>
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={() => handleExport(exportFormat)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-300 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Export All Data
                </button>
                
                <button
                  onClick={() => handleExport('health-summary')}
                  className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors duration-300 flex items-center"
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
                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                  <span>Upload a file</span>
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                </label>
                <p className="pl-1 text-sm text-gray-500">or drag and drop</p>
                
                <button
                  type="submit"
                  className="ml-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-300"
                >
                  Import
                </button>
              </form>
              <p className="mt-1 text-xs text-gray-500">JSON or CSV files up to 10MB</p>
            </div>
          </div>
        </div>
        
        {/* Data Retention & Privacy */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 mb-8">
          <div className="border-b border-gray-200">
            <h2 className="text-lg font-medium text-white px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center">
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
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
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
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
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
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
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
            onClick={() => {
              setMessage({ type: 'success', text: 'Data settings saved successfully!' });
              setTimeout(() => setMessage({ type: '', text: '' }), 3000);
            }}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save Data Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataSettings;