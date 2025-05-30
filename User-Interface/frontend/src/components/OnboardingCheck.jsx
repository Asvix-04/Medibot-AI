import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const OnboardingCheck = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          navigate('/signin');
          return;
        }
        
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          
          // If user hasn't completed onboarding, redirect them
          if (!userData.hasCompletedOnboarding) {
            navigate('/onboarding');
            return;
          }
        } else {
          // If user doc doesn't exist, they need to complete onboarding
          navigate('/onboarding');
          return;
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error checking onboarding status:", error);
        setLoading(false);
      }
    };
    
    checkOnboardingStatus();
  }, [navigate]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-violet-50">
        <div className="animate-spin h-12 w-12 border-4 border-violet-600 border-t-transparent rounded-full mb-4"></div>
        <p className="text-violet-700 font-medium text-sm animate-pulse">Preparing your experience...</p>
      </div>
    );
  }
  
  return <>{children}</>;
};

export default OnboardingCheck;