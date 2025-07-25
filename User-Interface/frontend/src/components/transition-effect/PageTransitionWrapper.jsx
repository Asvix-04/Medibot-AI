import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import TransitionAnimation from './TransitionAnimation'

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    filter: 'blur(8px)',
  },
  animate: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
  },
  exit: {
    opacity: 0,
    y: -20,
    filter: 'blur(6px)',
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
  },
};

const PageTransitionWrapper = ({ children, location }) => {
  const [showTransition, setShowTransition] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setShowTransition(true);
    setShowContent(false);

    const skipChimeRoutes = ['/chat', '/signin', '/signup']; // Add other routes here if needed

    const shouldPlayChime = !skipChimeRoutes.includes(location.pathname);

    const chime = shouldPlayChime ? new Audio('/sounds/chime.mp3') : null;
    if (chime) chime.volume = 0.5;

    const handleInteraction = () => {
      if (chime) { chime.play().catch((e) => console.warn("Autoplay blocked", e)) };
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };

    window.addEventListener('click', handleInteraction);
    window.addEventListener('keydown', handleInteraction);

    const timer = setTimeout(() => {
      setShowTransition(false);
      setShowContent(true);
    }, 1500);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className={`relative min-h-screen overflow-hidden transition-colors duration-500`}
      >
        {showTransition && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 50, delay: 1.5 }}
            className="fixed inset-0 z-20 flex items-center justify-center pointer-events-none"
          >
            <TransitionAnimation />
          </motion.div>
        )}

        {showContent && (
          <div className="relative z-10 pt-10">
            {children}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransitionWrapper;
