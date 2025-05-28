import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import WelcomeScreen from './WelcomeScreen';
import NameCollectionScreen from './NameCollectionScreen';

const OnboardingFlow = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleNameSubmit = async (name) => {
    try {
      const user = auth.currentUser;
      if (user) {
        // Update user document with preferred name and onboarding status
        await updateDoc(doc(db, "users", user.uid), {
          preferredName: name,
          hasCompletedOnboarding: true,
          updatedAt: new Date()
        });
        
        // Navigate to dashboard
        navigate('/health-dashboard');
      } else {
        navigate('/signin');
      }
    } catch (error) {
      console.error("Error updating user profile:", error);
      navigate('/health-dashboard');
    }
  };

  const handleNextStep = () => {
    setStep(step + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white">
      {step === 1 && <WelcomeScreen onContinue={handleNextStep} />}
      {step === 2 && <NameCollectionScreen onSubmit={handleNameSubmit} />}
    </div>
  );
};

export default OnboardingFlow;