import React, { useState } from 'react';

const CustomizationSettings = () => {
  const [settings, setSettings] = useState({
    theme: 'auto',
    accentColor: '#6366f1', // Default indigo color
    fontSize: 'medium',
    chatLayout: 'standard',
    dashboardLayout: 'grid',
    accessibility: {
      highContrast: false,
      reducedMotion: false,
      largeFonts: false
    }
  });

  const [showColorPicker, setShowColorPicker] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setSettings({
        ...settings,
        [parent]: {
          ...settings[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      });
    } else {
      setSettings({
        ...settings,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would save the settings to your backend
    setMessage({ type: 'success', text: 'Customization settings saved successfully!' });
    
    // Clear the message after 3 seconds
    setTimeout(() => {
      setMessage({ type: '', text: '' });
    }, 3000);
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Customization Settings</h2>
      
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Theme Selection */}
        <div>
          <h3 className="text-md font-medium text-gray-900 mb-2">Theme</h3>
          <p className="text-sm text-gray-500 mb-3">
            Select your preferred theme for the Medibot interface
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {['light', 'dark', 'auto'].map((themeOption) => (
              <div 
                key={themeOption}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  settings.theme === themeOption 
                    ? 'border-indigo-500 bg-indigo-50' 
                    : 'border-gray-200 hover:border-indigo-300'
                }`}
                onClick={() => setSettings({...settings, theme: themeOption})}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    id={`theme-${themeOption}`}
                    name="theme"
                    value={themeOption}
                    checked={settings.theme === themeOption}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
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
          <h3 className="text-md font-medium text-gray-900 mb-2">Accent Color</h3>
          <p className="text-sm text-gray-500 mb-3">
            Choose your preferred accent color for buttons and highlights
          </p>
          
          <div className="flex flex-wrap gap-3">
            {['#6366f1', '#8b5cf6', '#ec4899', '#14b8a6', '#22c55e', '#eab308', '#ef4444', '#64748b'].map((color) => (
              <div 
                key={color}
                className={`h-8 w-8 rounded-full cursor-pointer border-2 ${
                  settings.accentColor === color ? 'border-gray-800' : 'border-transparent'
                }`}
                style={{ backgroundColor: color }}
                onClick={() => setSettings({...settings, accentColor: color})}
              ></div>
            ))}
            
            <div className="relative">
              <div 
                className={`h-8 w-8 rounded-full cursor-pointer border-2 flex items-center justify-center bg-white ${
                  !['#6366f1', '#8b5cf6', '#ec4899', '#14b8a6', '#22c55e', '#eab308', '#ef4444', '#64748b'].includes(settings.accentColor) ? 'border-gray-800' : 'border-gray-300'
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
                    value={settings.accentColor}
                    onChange={(e) => setSettings({...settings, accentColor: e.target.value})}
                    className="h-8 w-full cursor-pointer"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Font Size */}
        <div>
          <h3 className="text-md font-medium text-gray-900 mb-2">Font Size</h3>
          <p className="text-sm text-gray-500 mb-3">
            Select your preferred font size for better readability
          </p>
          <select
            name="fontSize"
            value={settings.fontSize}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="small">Small</option>
            <option value="medium">Medium (Default)</option>
            <option value="large">Large</option>
            <option value="x-large">Extra Large</option>
          </select>
        </div>
        
        {/* Chat Layout */}
        <div>
          <h3 className="text-md font-medium text-gray-900 mb-2">Chat Layout</h3>
          <p className="text-sm text-gray-500 mb-3">
            Choose how your chat interface is displayed
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {['standard', 'compact', 'bubble', 'minimalist'].map((layoutOption) => (
              <div 
                key={layoutOption}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  settings.chatLayout === layoutOption 
                    ? 'border-indigo-500 bg-indigo-50' 
                    : 'border-gray-200 hover:border-indigo-300'
                }`}
                onClick={() => setSettings({...settings, chatLayout: layoutOption})}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    id={`layout-${layoutOption}`}
                    name="chatLayout"
                    value={layoutOption}
                    checked={settings.chatLayout === layoutOption}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
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
          <h3 className="text-md font-medium text-gray-900 mb-2">Dashboard Layout</h3>
          <p className="text-sm text-gray-500 mb-3">
            Choose how your health dashboard is organized
          </p>
          <select
            name="dashboardLayout"
            value={settings.dashboardLayout}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="grid">Grid (Default)</option>
            <option value="list">List</option>
            <option value="columns">Columns</option>
            <option value="tabs">Tabbed</option>
          </select>
        </div>
        
        {/* Accessibility Options */}
        <div>
          <h3 className="text-md font-medium text-gray-900 mb-2">Accessibility</h3>
          <p className="text-sm text-gray-500 mb-3">
            Enable accessibility features to improve your experience
          </p>
          
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                id="high-contrast"
                name="accessibility.highContrast"
                type="checkbox"
                checked={settings.accessibility.highContrast}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
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
                checked={settings.accessibility.reducedMotion}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
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
                checked={settings.accessibility.largeFonts}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
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
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save Customization Settings
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomizationSettings;