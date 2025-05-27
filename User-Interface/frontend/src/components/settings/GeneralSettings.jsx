import React, { useState } from 'react';

const GeneralSettings = () => {
  const [settings, setSettings] = useState({
    language: 'en',
    notifications: {
      email: true,
      push: true,
      reminders: true,
      appointmentAlerts: true,
      medicationReminders: true
    },
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12hour',
    autoSave: true,
    privacyMode: false,
    audioEnabled: true
  });
  
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (name.includes('.')) {
        const [parent, child] = name.split('.');
        setSettings({
          ...settings,
          [parent]: {
            ...settings[parent],
            [child]: checked
          }
        });
      } else {
        setSettings({
          ...settings,
          [name]: checked
        });
      }
    } else {
      if (name.includes('.')) {
        const [parent, child] = name.split('.');
        setSettings({
          ...settings,
          [parent]: {
            ...settings[parent],
            [child]: value
          }
        });
      } else {
        setSettings({
          ...settings,
          [name]: value
        });
      }
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would save the settings to your backend
    setMessage({ type: 'success', text: 'General settings saved successfully!' });
    
    // Clear the message after 3 seconds
    setTimeout(() => {
      setMessage({ type: '', text: '' });
    }, 3000);
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">General Settings</h2>
      
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' ? 'bg-violet-100 text-violet-800' : 'bg-red-100 text-red-800'
        }`}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Language */}
        <div>
          <h3 className="text-md font-medium text-gray-900 mb-2">Language</h3>
          <p className="text-sm text-gray-500 mb-3">
            Select your preferred language for the Medibot interface
          </p>
          <select
            name="language"
            value={settings.language}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="zh">Chinese</option>
            <option value="ja">Japanese</option>
            <option value="hi">Hindi</option>
            <option value="ar">Arabic</option>
            <option value="ru">Russian</option>
            <option value="pt">Portuguese</option>
          </select>
        </div>

        {/* Notifications */}
        <div>
          <h3 className="text-md font-medium text-gray-900 mb-2 text-left">Notifications</h3>
          <p className="text-sm text-gray-500 mb-3 text-left">
            Manage how you receive notifications from Medibot
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  id="email-notifications"
                  name="notifications.email"
                  type="checkbox"
                  checked={settings.notifications.email}
                  onChange={handleChange}
                  className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded"
                />
                <label htmlFor="email-notifications" className="ml-3 text-sm text-gray-700">
                  Email notifications
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  id="push-notifications"
                  name="notifications.push"
                  type="checkbox"
                  checked={settings.notifications.push}
                  onChange={handleChange}
                  className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded"
                />
                <label htmlFor="push-notifications" className="ml-3 text-sm text-gray-700">
                  Push notifications
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  id="reminders"
                  name="notifications.reminders"
                  type="checkbox"
                  checked={settings.notifications.reminders}
                  onChange={handleChange}
                  className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded"
                />
                <label htmlFor="reminders" className="ml-3 text-sm text-gray-700">
                  Health reminders
                </label>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  id="appointment-alerts"
                  name="notifications.appointmentAlerts"
                  type="checkbox"
                  checked={settings.notifications.appointmentAlerts}
                  onChange={handleChange}
                  className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded"
                />
                <label htmlFor="appointment-alerts" className="ml-3 text-sm text-gray-700">
                  Appointment alerts
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  id="medication-reminders"
                  name="notifications.medicationReminders"
                  type="checkbox"
                  checked={settings.notifications.medicationReminders}
                  onChange={handleChange}
                  className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded"
                />
                <label htmlFor="medication-reminders" className="ml-3 text-sm text-gray-700">
                  Medication reminders
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Timezone */}
        <div>
          <h3 className="text-md font-medium text-gray-900 mb-2">Timezone</h3>
          <p className="text-sm text-gray-500 mb-3">
            Set your timezone for accurate scheduling and reminders
          </p>
          <select
            name="timezone"
            value={settings.timezone}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
          >
            <option value="UTC">UTC (Coordinated Universal Time)</option>
            <option value="GMT">GMT (Greenwich Mean Time)</option>
            <option value="EST">EST (Eastern Standard Time)</option>
            <option value="CST">CST (Central Standard Time)</option>
            <option value="MST">MST (Mountain Standard Time)</option>
            <option value="PST">PST (Pacific Standard Time)</option>
            <option value="IST">IST (Indian Standard Time)</option>
            <option value="JST">JST (Japan Standard Time)</option>
            <option value="AEST">AEST (Australian Eastern Standard Time)</option>
            <option value="CET">CET (Central European Time)</option>
          </select>
        </div>
        
        {/* Date & Time Format */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-md font-medium text-gray-900 mb-2">Date Format</h3>
            <select
              name="dateFormat"
              value={settings.dateFormat}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY (US)</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY (Europe/Asia)</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD (ISO)</option>
              <option value="MMM DD, YYYY">MMM DD, YYYY (Jan 01, 2025)</option>
              <option value="DD MMM YYYY">DD MMM YYYY (01 Jan 2025)</option>
            </select>
          </div>
          
          <div>
            <h3 className="text-md font-medium text-gray-900 mb-2">Time Format</h3>
            <select
              name="timeFormat"
              value={settings.timeFormat}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
            >
              <option value="12hour">12-hour (AM/PM)</option>
              <option value="24hour">24-hour</option>
            </select>
          </div>
        </div>

        {/* Additional Preferences */}
        <div>
          <h3 className="text-md font-medium text-gray-900 mb-3">Additional Preferences</h3>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                id="auto-save"
                name="autoSave"
                type="checkbox"
                checked={settings.autoSave}
                onChange={handleChange}
                className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded"
              />
              <label htmlFor="auto-save" className="ml-3 text-sm text-gray-700">
                Automatically save chat conversations
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                id="privacy-mode"
                name="privacyMode"
                type="checkbox"
                checked={settings.privacyMode}
                onChange={handleChange}
                className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded"
              />
              <label htmlFor="privacy-mode" className="ml-3 text-sm text-gray-700">
                Privacy mode (blur sensitive information when idle)
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                id="audio-enabled"
                name="audioEnabled"
                type="checkbox"
                checked={settings.audioEnabled}
                onChange={handleChange}
                className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded"
              />
              <label htmlFor="audio-enabled" className="ml-3 text-sm text-gray-700">
                Enable sound effects and audio notifications
              </label>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4">
          <button
            type="submit"
            className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-700 text-white rounded-lg hover:from-violet-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
          >
            Save General Settings
          </button>
        </div>
      </form>
    </div>
  );
};

export default GeneralSettings;