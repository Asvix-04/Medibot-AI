import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import SettingsSidebar from './SettingsSidebar';
import GeneralSettings from './GeneralSettings';
import PersonalizationSettings from './PersonalizationSettings';
import SecuritySettings from './SecuritySettings';
import CustomizationSettings from './CustomizationSettings';
import DataSettings from './DataSettings';

const SettingsLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Updated with violet-based gradient */}
      <div className="bg-gradient-to-r from-violet-600 via-violet-700 to-indigo-700 py-6 px-4 sm:px-6 lg:px-8 text-white shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">Settings</h1>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 rounded-md border border-violet-400 hover:bg-violet-700/50 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className={`w-full md:w-64 flex-shrink-0 ${mobileMenuOpen ? 'block' : 'hidden md:block'}`}>
            <SettingsSidebar activeRoute={location.pathname} onNavigate={(path) => {
              navigate(path);
              setMobileMenuOpen(false);
            }} />
          </div>

          {/* Content area */}
          <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <Routes>
              <Route path="/" element={<GeneralSettings />} />
              <Route path="/personalization" element={<PersonalizationSettings />} />
              <Route path="/security" element={<SecuritySettings />} />
              <Route path="/customization" element={<CustomizationSettings />} />
              <Route path="/data" element={<DataSettings />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsLayout;