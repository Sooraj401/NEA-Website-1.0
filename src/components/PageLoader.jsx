import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PageLoader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setIsFinished(true), 300);
          return 100;
        }
        return Math.min(100, prev + 3);
      });
    }, 30);
    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {!isFinished && (
        <motion.div
          key="loader"
          initial={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-9999 bg-slate-950 flex flex-col items-center justify-center text-white"
        >
          <div className="flex flex-col items-center">
            <span className="font-smooch text-6xl font-bold text-amber-500">{progress}%</span>
            <div className="w-32 h-0.5 bg-amber-500/30 mt-3 overflow-hidden">
              <div 
                className="h-full bg-amber-500 transition-all duration-100" 
                style={{ width: `${progress}%` }} 
              />
            </div>
          </div>

          {/* Concave bottom border effect on exit */}
          <div className="absolute -bottom-12 left-0 right-0 h-12 bg-slate-950 rounded-b-[100%] scale-x-125" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}