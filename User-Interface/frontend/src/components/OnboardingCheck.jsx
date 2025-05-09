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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin h-12 w-12 border-4 border-purple-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  return <>{children}</>;
};

export default OnboardingCheck;