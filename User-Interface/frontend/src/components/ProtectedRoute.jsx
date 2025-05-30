import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../firebase';

const ProtectedRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
      setIsLoading(false);
    });
    
    return () => unsubscribe();
  }, []);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-violet-600 border-t-transparent rounded-full"></div>
        <span className="ml-3 text-violet-600 font-medium">Verifying access...</span>
      </div>
    );
  }
  
  if (!currentUser) {
    return <Navigate to="/signin" />;
  }
  
  if (!currentUser.emailVerified) {
    return <Navigate to="/verification-required" />;
  }
  
  return children;
};

export default ProtectedRoute;