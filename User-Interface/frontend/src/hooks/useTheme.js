import { useSettings } from '../context/SettingsContext';

export const useTheme = () => {
  const { settings } = useSettings();
  const { customization } = settings;
  
  // Helper function to get appropriate color for current theme
  const getThemeColor = (lightColor, darkColor) => {
    if (customization.theme === 'light') return lightColor;
    if (customization.theme === 'dark') return darkColor;
    
    // Auto theme - check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return darkColor;
    }
    return lightColor;
  };
  
  return {
    isDarkMode: customization.theme === 'dark' || 
               (customization.theme === 'auto' && 
                window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches),
    accentColor: customization.accentColor,
    fontSize: customization.fontSize,
    chatLayout: customization.chatLayout,
    getThemeColor
  };
};