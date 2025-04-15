import React, { createContext, useContext, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid'; // You may need to install this package

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  
  // Define removeToast first 
  const removeToast = useCallback((id) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);

  // Then define addToast which depends on removeToast
  const addToast = useCallback((message, type = 'success', duration = 5000) => {
    const newToast = {
      id: uuidv4(),
      message,
      type, // 'success', 'error', 'info', 'warning'
      duration,
    };

    setToasts(prevToasts => [...prevToasts, newToast]);

    // Auto-remove the toast after duration
    if (duration !== 0) {
      setTimeout(() => {
        removeToast(newToast.id);
      }, duration);
    }
    
    return newToast.id;
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};