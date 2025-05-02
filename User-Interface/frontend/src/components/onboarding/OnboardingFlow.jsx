import React, { useState, useEffect } from 'react';
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
      }
      navigate('/chat');
    } catch (error) {
      console.error("Error updating user profile:", error);
      // Even if there's an error, proceed to the chat
      navigate('/chat');
    }
  };

  const handleNextStep = () => {
    setStep(step + 1);
  };

  // If user refreshes during onboarding, redirect them back to appropriate step
  useEffect(() => {
    // This is a simple approach - you might want to load from localStorage or Firestore
    // to handle refreshes more robustly
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {step === 1 && <WelcomeScreen onContinue={handleNextStep} />}
      {step === 2 && <NameCollectionScreen onSubmit={handleNameSubmit} />}
    </div>
  );
};

export default OnboardingFlow;