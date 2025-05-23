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
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-500 py-6 px-4 sm:px-6 lg:px-8 text-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">Settings</h1>
          {/* Mobile menu button */}
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
          <div className="flex-1 bg-white rounded-lg shadow-sm p-6">
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