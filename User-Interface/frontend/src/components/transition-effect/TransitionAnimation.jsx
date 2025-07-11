
import React from 'react';
import Lottie from 'lottie-react';
import transitionAnimation from './lotties/transition.json';

const TransitionAnimation = () => {
  return (
    <div className="w-64 h-64 sm:w-80 sm:h-80">
      <Lottie
        animationData={transitionAnimation}
        loop={true}
        autoplay={true}
      />
    </div>
  );
};

export default TransitionAnimation;
