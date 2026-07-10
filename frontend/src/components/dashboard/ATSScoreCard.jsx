import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ATSScoreCard({ score = 91 }) {
  const [displayScore, setDisplayScore] = useState(0);

  // Easing upward animation
  useEffect(() => {
    let start = 0;
    const duration = 1200; // ms
    const stepTime = Math.abs(Math.floor(duration / score));
    const timer = setInterval(() => {
      start += 1;
      if (start >= score) {
        setDisplayScore(score);
        clearInterval(timer);
      } else {
        setDisplayScore(start);
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, [score]);

  // Gauge details
  const radius = 55;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  // Determine colors based on score
  let gaugeColor = "#4CAF50"; // Green
  let feedbackText = "Excellent!";
  let feedbackSub = "Your resume is ATS Friendly";
  
  if (score < 60) {
    gaugeColor = "#FF5722"; // Red
    feedbackText = "Needs Revision!";
    feedbackSub = "Low keyword matches & formatting issues";
  } else if (score < 85) {
    gaugeColor = "#FFC107"; // Yellow
    feedbackText = "Good Start!";
    feedbackSub = "Optimizable for higher visibility";
  }

  return (
    <div className="bg-white border-3 border-text p-8 rounded-3xl shadow-[6px_6px_0px_#1F1F1F] flex flex-col items-center text-center relative select-none w-full">
      <h3 className="text-sm font-black text-text uppercase tracking-wider mb-6">ATS Score</h3>

      <div className="w-40 h-40 relative flex items-center justify-center mb-6">
        
        {/* SVG Circle indicator */}
        <svg viewBox="0 0 130 130" className="w-full h-full transform -rotate-90">
          <circle
            cx="65"
            cy="65"
            r={radius}
            fill="none"
            stroke="#FFF5E0"
            strokeWidth={strokeWidth}
          />
          <motion.circle
            cx="65"
            cy="65"
            r={radius}
            fill="none"
            stroke={gaugeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.1 }}
            strokeLinecap="round"
          />
        </svg>

        {/* Big percentage display */}
        <div className="absolute flex flex-col items-center">
          <motion.span
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="text-4xl sm:text-5xl font-black text-text"
          >
            {displayScore}
          </motion.span>
          <span className="text-[10px] font-black text-text-light uppercase tracking-wider">Percent</span>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <h4 className="text-lg font-black text-text flex items-center gap-1.5 justify-center">
          <span style={{ color: gaugeColor }}>●</span> {feedbackText}
        </h4>
        <p className="text-xs font-bold text-text-light">
          {feedbackSub}
        </p>
      </div>
    </div>
  );
}
