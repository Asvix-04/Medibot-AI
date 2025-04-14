import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';

const PersonalizationSettings = () => {
  const [settings, setSettings] = useState({
    healthPriorities: ['diabetes', 'heart'],
    userPreferences: {
      responseLength: 'medium',
      technicalLevel: 'balanced'
    },
    preferredUnits: {
      weight: 'kg',
      height: 'cm',
      temperature: 'celsius'
    },
    preferredTimes: {
      morningReminder: '08:00',
      eveningReminder: '20:00'
    }
  });

  const { addToast } = useToast();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setSettings({
        ...settings,
        [parent]: {
          ...settings[parent],
          [child]: inputValue
        }
      });
    } else {
      setSettings({
        ...settings,
        [name]: inputValue
      });
    }
  };

  const handleMultiSelect = (e) => {
    const { options } = e.target;
    const selectedValues = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedValues.push(options[i].value);
      }
    }
    setSettings({
      ...settings,
      healthPriorities: selectedValues
    });
  };

  const handleSave = () => {
    // Here you would add API call to save settings
    // For now, we'll just simulate success
    
    addToast('Personalization settings saved successfully!', 'success');
    
    // If there was an error:
    // addToast('Failed to save settings. Please try again.', 'error');
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Personalization Settings</h2>
      
      <div className="space-y-6">
        {/* Health Priorities */}
        <div>
          <h3 className="text-md font-medium text-gray-900 mb-2">Health Priorities</h3>
          <p className="text-sm text-gray-500 mb-3">
            Select health conditions you want Medibot to focus on
          </p>
          <select
            multiple
            name="healthPriorities"
            value={settings.healthPriorities}
            onChange={handleMultiSelect}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            size={5}
          >
            <option value="diabetes">Diabetes</option>
            <option value="heart">Heart Health</option>
            <option value="cholesterol">Cholesterol</option>
            <option value="bloodPressure">Blood Pressure</option>
            <option value="weight">Weight Management</option>
            <option value="mental">Mental Health</option>
            <option value="sleep">Sleep</option>
            <option value="allergies">Allergies</option>
          </select>
          <p className="mt-1 text-xs text-gray-500">Hold Ctrl (or Cmd) to select multiple options</p>
        </div>

        {/* AI Response Preferences */}
        <div>
          <h3 className="text-md font-medium text-gray-900 mb-2">AI Response Preferences</h3>
          <p className="text-sm text-gray-500 mb-3">
            Customize how Medibot responds to your inquiries
          </p>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="responseLength" className="block text-sm font-medium text-gray-700 mb-1">
                Response Length
              </label>
              <select
                id="responseLength"
                name="userPreferences.responseLength"
                value={settings.userPreferences.responseLength}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="brief">Brief - Short and concise answers</option>
                <option value="medium">Medium - Balanced responses with key details</option>
                <option value="detailed">Detailed - Comprehensive explanations</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="technicalLevel" className="block text-sm font-medium text-gray-700 mb-1">
                Technical Level
              </label>
              <select
                id="technicalLevel"
                name="userPreferences.technicalLevel"
                value={settings.userPreferences.technicalLevel}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="simple">Simple - Easy to understand, minimal medical terminology</option>
                <option value="balanced">Balanced - Some medical terms with explanations</option>
                <option value="technical">Technical - Full medical terminology for healthcare professionals</option>
              </select>
            </div>
          </div>
        </div>

        {/* Unit Preferences */}
        <div>
          <h3 className="text-md font-medium text-gray-900 mb-2">Measurement Units</h3>
          <p className="text-sm text-gray-500 mb-3">
            Set your preferred units of measurement
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="weightUnit" className="block text-sm font-medium text-gray-700 mb-1">
                Weight
              </label>
              <select
                id="weightUnit"
                name="preferredUnits.weight"
                value={settings.preferredUnits.weight}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="kg">Kilograms (kg)</option>
                <option value="lb">Pounds (lb)</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="heightUnit" className="block text-sm font-medium text-gray-700 mb-1">
                Height
              </label>
              <select
                id="heightUnit"
                name="preferredUnits.height"
                value={settings.preferredUnits.height}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="cm">Centimeters (cm)</option>
                <option value="ft">Feet/Inches (ft/in)</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="temperatureUnit" className="block text-sm font-medium text-gray-700 mb-1">
                Temperature
              </label>
              <select
                id="temperatureUnit"
                name="preferredUnits.temperature"
                value={settings.preferredUnits.temperature}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="celsius">Celsius (°C)</option>
                <option value="fahrenheit">Fahrenheit (°F)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reminder Times */}
        <div>
          <h3 className="text-md font-medium text-gray-900 mb-2">Reminder Times</h3>
          <p className="text-sm text-gray-500 mb-3">
            Set your preferred times for health reminders
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="morningReminder" className="block text-sm font-medium text-gray-700 mb-1">
                Morning Reminder
              </label>
              <input
                type="time"
                id="morningReminder"
                name="preferredTimes.morningReminder"
                value={settings.preferredTimes.morningReminder}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="eveningReminder" className="block text-sm font-medium text-gray-700 mb-1">
                Evening Reminder
              </label>
              <input
                type="time"
                id="eveningReminder"
                name="preferredTimes.eveningReminder"
                value={settings.preferredTimes.eveningReminder}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="pt-4">
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonalizationSettings;