import React from 'react';
import { motion } from 'framer-motion';

export default function UploadProgress({ progress, message, fileName }) {
  // SVG circular indicators
  const radius = 50;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const messages = [
    { label: 'Reading Resume...', minVal: 0 },
    { label: 'Extracting Skills...', minVal: 18 },
    { label: 'Calculating ATS Score...', minVal: 35 },
    { label: 'Finding Missing Skills...', minVal: 55 },
    { label: 'Analyzing Projects...', minVal: 72 },
    { label: 'Matching Jobs...', minVal: 85 },
    { label: 'Preparing Dashboard...', minVal: 95 }
  ];

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-white border-3 border-text p-8 sm:p-10 rounded-3xl shadow-[8px_8px_0px_#1F1F1F] flex flex-col items-center w-full text-center relative select-none"
    >
      {/* Title */}
      <h3 className="text-xl font-black text-text mb-1">Scanning Resume...</h3>
      <p className="text-xs font-bold text-text-light mb-8 truncate max-w-[280px]">
        Processing: <span className="text-secondary font-black">{fileName || "Resume.pdf"}</span>
      </p>

      {/* Floating Sparkles in background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
        <motion.span animate={{ y: [-10, 10, -10], rotate: 360 }} transition={{ repeat: Infinity, duration: 4 }} className="absolute top-10 left-10 text-xl">✨</motion.span>
        <motion.span animate={{ y: [10, -10, 10], rotate: -360 }} transition={{ repeat: Infinity, duration: 4, delay: 0.5 }} className="absolute bottom-10 right-10 text-xl">⭐</motion.span>
      </div>

      {/* Circular Progress & Robot scan block */}
      <div className="w-40 h-40 relative flex items-center justify-center mb-8">
        
        {/* Animated circular progress border */}
        <svg viewBox="0 0 120 120" className="w-full h-full transform -rotate-90">
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="#FFF5E0"
            strokeWidth={strokeWidth}
          />
          <motion.circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="#7C5CFF"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.2 }}
            strokeLinecap="round"
          />
        </svg>

        {/* Mascot Robot inside circle */}
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <motion.svg
            viewBox="0 0 80 80"
            className="w-16 h-16"
            animate={{
              y: [0, -4, 0],
              rotate: [0, 2, -2, 0]
            }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <ellipse cx="40" cy="72" rx="16" ry="2" fill="#E8D5B0" opacity="0.4"/>
            {/* Robot Head */}
            <rect x="20" y="20" width="40" height="32" rx="8" fill="#7C5CFF" stroke="#1F1F1F" strokeWidth="2" />
            <rect x="24" y="24" width="32" height="24" rx="6" fill="white" />
            
            {/* Blink Eyes */}
            <circle cx="34" cy="34" r="3" fill="#1F1F1F" />
            <circle cx="46" cy="34" r="3" fill="#1F1F1F" />
            <circle cx="35" cy="32" r="1" fill="white" />
            <circle cx="47" cy="32" r="1" fill="white" />
            
            {/* smile */}
            <path d="M 36 40 Q 40 43 44 40" stroke="#1F1F1F" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            {/* Antenna */}
            <line x1="40" y1="20" x2="40" y2="10" stroke="#7C5CFF" strokeWidth="2" />
            <circle cx="40" cy="8" r="3.5" fill="#FFD54F" stroke="#1F1F1F" strokeWidth="1.5" />
            
            {/* scan lens bar */}
            <motion.rect
              x="26"
              y="26"
              width="28"
              height="2"
              fill="#FF8A50"
              animate={{ y: [0, 16, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            />
          </motion.svg>
        </div>

        {/* Circular indicator text at bottom */}
        <div className="absolute bg-primary border-2 border-text px-3 py-1 rounded-full text-xs font-black shadow-[2px_2px_0px_#1F1F1F] -bottom-1">
          {progress}%
        </div>
      </div>

      {/* Rotating processing text message */}
      <div className="bg-cream border-2 border-card-border p-3.5 rounded-2xl w-full flex items-center justify-center mb-6">
        <p className="text-sm font-black text-text animate-pulse">
          🤖 {message || "Reading Resume..."}
        </p>
      </div>

      {/* Progress logs checkmark list */}
      <div className="w-full flex flex-col gap-2.5 text-left border-t border-card-border/60 pt-6">
        {messages.map((step) => {
          const isDone = progress >= step.minVal + 8; // delay checkmark offset slightly for visual pacing
          const isPending = progress < step.minVal;
          return (
            <div
              key={step.label}
              className={`flex items-center gap-2.5 text-xs font-bold transition-colors duration-300 ${
                isDone ? 'text-accent-green' : isPending ? 'text-text-muted' : 'text-secondary font-black'
              }`}
            >
              <span className="text-base select-none">
                {isDone ? '✓' : isPending ? '○' : '⚙'}
              </span>
              <span>{step.label}</span>
            </div>
          );
        })}
      </div>

    </motion.div>
  );
}
