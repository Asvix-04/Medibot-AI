import React, { createContext, useState, useContext, useEffect } from 'react';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    customization: {
      theme: 'auto',
      accentColor: '#6366f1',
      fontSize: 'medium',
      chatLayout: 'standard',
      dashboardLayout: 'grid',
      accessibility: {
        highContrast: false,
        reducedMotion: false,
        largeFonts: false
      }
    },
    general: {
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
    },
    personalization: {
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
    }
  });

  // Load settings from localStorage on initial render
  useEffect(() => {
    const savedSettings = localStorage.getItem('medibot-settings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Error parsing saved settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('medibot-settings', JSON.stringify(settings));
    
    // Apply theme settings immediately
    applyThemeSettings(settings.customization);
  }, [settings]);

  // Apply theme-related settings to the document
  const applyThemeSettings = (customization) => {
    const { theme, fontSize, accentColor, accessibility } = customization;
    
    // Apply theme (light/dark)
    if (theme === 'light' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: light)').matches)) {
      document.documentElement.classList.remove('dark');
    } else if (theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    }
    
    // Apply font size
    document.documentElement.style.fontSize = fontSize === 'small' ? '14px' : 
                                           fontSize === 'medium' ? '16px' : 
                                           fontSize === 'large' ? '18px' : '20px';
    
    // Apply accent color (use CSS variables)
    document.documentElement.style.setProperty('--accent-color', accentColor);
    
    // Apply accessibility settings
    if (accessibility.highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
    
    if (accessibility.reducedMotion) {
      document.documentElement.classList.add('reduced-motion');
    } else {
      document.documentElement.classList.remove('reduced-motion');
    }
    
    if (accessibility.largeFonts) {
      document.documentElement.classList.add('large-fonts');
    } else {
      document.documentElement.classList.remove('large-fonts');
    }
  };

  // Function to update settings
  const updateSettings = (category, newSettings) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [category]: {
        ...prevSettings[category],
        ...newSettings
      }
    }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};