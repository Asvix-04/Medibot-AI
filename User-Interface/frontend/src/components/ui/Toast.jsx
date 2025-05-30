import React, { useEffect, useState } from 'react';

const Toast = ({ id, message, type, duration, onClose }) => {
  const [visible, setVisible] = useState(false);
  
  // Show animation on mount
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'error':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      case 'warning':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      default: // info
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  const getStyles = () => {
    const baseClasses = "fixed flex items-center p-4 mb-3 max-w-xs rounded-lg shadow-lg transform transition-all duration-300";
    const positionClasses = "top-4 right-4";
    const visibilityClasses = visible 
      ? "translate-x-0 opacity-100" 
      : "translate-x-full opacity-0";
    
    let colorClasses;
    switch (type) {
      case 'success':
        colorClasses = "bg-violet-50 text-violet-800 border-l-4 border-violet-500";
        break;
      case 'error':
        colorClasses = "bg-red-50 text-red-800 border-l-4 border-red-500";
        break;
      case 'warning':
        colorClasses = "bg-amber-50 text-amber-800 border-l-4 border-amber-500";
        break;
      default: // info
        colorClasses = "bg-indigo-50 text-indigo-800 border-l-4 border-indigo-500";
    }
    
    return `${baseClasses} ${positionClasses} ${visibilityClasses} ${colorClasses}`;
  };

  const handleClose = () => {
    setVisible(false);
    // Give time for exit animation before removing
    setTimeout(() => onClose(id), 300);
  };

  return (
    <div className={getStyles()} role="alert">
      <div className="flex items-center">
        <div className="mr-3">{getIcon()}</div>
        <div className="text-sm font-medium">{message}</div>
      </div>
      <button
        type="button"
        onClick={handleClose}
        className="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex h-8 w-8 hover:bg-violet-100 focus:outline-none focus:ring-2 focus:ring-violet-400"
        aria-label="Close"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
        </svg>
      </button>
    </div>
  );
};

export default Toast;