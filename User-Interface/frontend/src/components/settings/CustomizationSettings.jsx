import React, { useState } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { useToast } from '../../context/ToastContext';

const CustomizationSettings = () => {
  const { settings, updateSettings } = useSettings();
  const { addToast } = useToast();
  
  // Use the settings from context instead of local state
  const [localSettings, setLocalSettings] = useState(settings.customization);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setLocalSettings({
        ...localSettings,
        [parent]: {
          ...localSettings[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      });
    } else {
      setLocalSettings({
        ...localSettings,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Update the global settings
    updateSettings('customization', localSettings);
    
    // Show success toast
    addToast('Customization settings saved successfully!', 'success');
  };

  // Preview the theme without saving
  const previewTheme = (themeOption) => {
    setLocalSettings({...localSettings, theme: themeOption});
  };
  
  // Preview the accent color without saving
  const previewAccentColor = (color) => {
    setLocalSettings({...localSettings, accentColor: color});
    document.documentElement.style.setProperty('--accent-color', color);
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6 text-left">Customization Settings</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Theme Selection */}
        <div>
          <h3 className="text-md font-medium text-gray-900 mb-2 text-left">Theme</h3>
          <p className="text-sm text-gray-500 mb-3 text-left">
            Select your preferred theme for the Medibot interface
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {['light', 'dark', 'auto'].map((themeOption) => (
              <div 
                key={themeOption}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  localSettings.theme === themeOption 
                    ? 'border-violet-500 bg-violet-50' 
                    : 'border-gray-200 hover:border-violet-300'
                }`}
                onClick={() => previewTheme(themeOption)}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    id={`theme-${themeOption}`}
                    name="theme"
                    value={themeOption}
                    checked={localSettings.theme === themeOption}
                    onChange={handleChange}
                    className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300"
                  />
                  <label htmlFor={`theme-${themeOption}`} className="ml-3 block text-sm font-medium text-gray-700 capitalize">
                    {themeOption}
                  </label>
                </div>
                <div className="mt-2 h-10 rounded-md border border-gray-200 overflow-hidden">
                  <div className={`h-full w-full ${
                    themeOption === 'light' ? 'bg-white' : 
                    themeOption === 'dark' ? 'bg-gray-800' : 
                    'bg-gradient-to-r from-white to-gray-800'
                  }`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Accent Color */}
        <div>
          <h3 className="text-md font-medium text-gray-900 mb-2 text-left">Accent Color</h3>
          <p className="text-sm text-gray-500 mb-3 text-left">
            Choose your preferred accent color for buttons and highlights
          </p>
          
          <div className="flex flex-wrap gap-3">
            {['#8b5cf6', '#a78bfa', '#7c3aed', '#6366f1', '#4f46e5', '#4338ca', '#3730a3', '#312e81'].map((color) => (
              <div 
                key={color}
                className={`h-8 w-8 rounded-full cursor-pointer border-2 ${
                  localSettings.accentColor === color ? 'border-gray-800' : 'border-transparent'
                }`}
                style={{ backgroundColor: color }}
                onClick={() => previewAccentColor(color)}
              ></div>
            ))}
            
            <div className="relative">
              <div 
                className={`h-8 w-8 rounded-full cursor-pointer border-2 flex items-center justify-center bg-white ${
                  !['#8b5cf6', '#a78bfa', '#7c3aed', '#6366f1', '#4f46e5', '#4338ca', '#3730a3', '#312e81'].includes(localSettings.accentColor) ? 'border-gray-800' : 'border-gray-300'
                }`}
                onClick={() => setShowColorPicker(!showColorPicker)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              
              {showColorPicker && (
                <div className="absolute z-10 mt-2 p-3 bg-white rounded-lg shadow-lg border border-gray-200">
                  <input 
                    type="color" 
                    value={localSettings.accentColor}
                    onChange={(e) => previewAccentColor(e.target.value)}
                    className="h-8 w-full cursor-pointer"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Font Size */}
        <div>
          <h3 className="text-md font-medium text-gray-900 mb-2 text-left">Font Size</h3>
          <p className="text-sm text-gray-500 mb-3 text-left">
            Select your preferred font size for better readability
          </p>
          <select
            name="fontSize"
            value={localSettings.fontSize}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
          >
            <option value="small">Small</option>
            <option value="medium">Medium (Default)</option>
            <option value="large">Large</option>
            <option value="x-large">Extra Large</option>
          </select>
        </div>
        
        {/* Chat Layout */}
        <div>
          <h3 className="text-md font-medium text-gray-900 mb-2 text-left">Chat Layout</h3>
          <p className="text-sm text-gray-500 mb-3 text-left">
            Choose how your chat interface is displayed
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {['standard', 'compact', 'bubble', 'minimalist'].map((layoutOption) => (
              <div 
                key={layoutOption}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  localSettings.chatLayout === layoutOption 
                    ? 'border-violet-500 bg-violet-50' 
                    : 'border-gray-200 hover:border-violet-300'
                }`}
                onClick={() => setLocalSettings({...localSettings, chatLayout: layoutOption})}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    id={`layout-${layoutOption}`}
                    name="chatLayout"
                    value={layoutOption}
                    checked={localSettings.chatLayout === layoutOption}
                    onChange={handleChange}
                    className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300"
                  />
                  <label htmlFor={`layout-${layoutOption}`} className="ml-3 block text-sm font-medium text-gray-700 capitalize">
                    {layoutOption}
                  </label>
                </div>
                <div className="mt-2 h-16 rounded-md border border-gray-200 bg-gray-50 p-2 text-xs text-gray-500">
                  {layoutOption === 'standard' && "Default chat layout with message bubbles"}
                  {layoutOption === 'compact' && "Condensed layout to see more messages at once"}
                  {layoutOption === 'bubble' && "Rounded bubble style messages with more spacing"}
                  {layoutOption === 'minimalist' && "Clean and simple design with minimal elements"}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Dashboard Layout */}
        <div>
          <h3 className="text-md font-medium text-gray-900 mb-2 text-left">Dashboard Layout</h3>
          <p className="text-sm text-gray-500 mb-3 text-left">
            Choose how your health dashboard is organized
          </p>
          <select
            name="dashboardLayout"
            value={localSettings.dashboardLayout}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
          >
            <option value="grid">Grid (Default)</option>
            <option value="list">List</option>
            <option value="columns">Columns</option>
            <option value="tabs">Tabbed</option>
          </select>
        </div>
        
        {/* Accessibility Options */}
        <div>
          <h3 className="text-md font-medium text-gray-900 mb-2 text-left">Accessibility</h3>
          <p className="text-sm text-gray-500 mb-3 text-left">
            Enable accessibility features to improve your experience
          </p>
          
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                id="high-contrast"
                name="accessibility.highContrast"
                type="checkbox"
                checked={localSettings.accessibility.highContrast}
                onChange={handleChange}
                className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded"
              />
              <label htmlFor="high-contrast" className="ml-3 text-sm text-gray-700">
                High contrast mode
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                id="reduced-motion"
                name="accessibility.reducedMotion"
                type="checkbox"
                checked={localSettings.accessibility.reducedMotion}
                onChange={handleChange}
                className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded"
              />
              <label htmlFor="reduced-motion" className="ml-3 text-sm text-gray-700">
                Reduce animations and motion
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                id="large-fonts"
                name="accessibility.largeFonts"
                type="checkbox"
                checked={localSettings.accessibility.largeFonts}
                onChange={handleChange}
                className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded"
              />
              <label htmlFor="large-fonts" className="ml-3 text-sm text-gray-700">
                Use larger fonts throughout
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
            Save Customization Settings
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomizationSettings;