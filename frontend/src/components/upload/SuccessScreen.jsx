import React from 'react';
import { motion } from 'framer-motion';

export default function SuccessScreen({ onExplore, onReset, fileName }) {
  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-white border-3 border-text p-8 sm:p-10 rounded-3xl shadow-[8px_8px_0px_#1F1F1F] flex flex-col items-center w-full text-center relative select-none"
    >
      {/* Dynamic Confetti effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
        {[...Array(8)].map((_, i) => (
          <motion.span
            key={i}
            initial={{ y: 220, opacity: 1 }}
            animate={{
              y: -80,
              x: (i % 2 === 0 ? 50 : -50) * (i * 0.2 + 1),
              scale: [0.5, 1.2, 0],
              opacity: [1, 1, 0]
            }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.25 }}
            className="absolute text-xl"
            style={{ left: `${20 + (i % 4) * 20}%` }}
          >
            {['🎉', '✨', '🎈', '⭐'][i % 4]}
          </motion.span>
        ))}
      </div>

      {/* Mascot celebrations */}
      <div className="w-40 h-40 relative flex justify-center items-center mb-6">
        {/* Celebrating Robot Mascot */}
        <motion.svg
          viewBox="0 0 100 120"
          className="w-32 h-32 relative z-10"
          animate={{
            y: [0, -12, 0],
            rotate: [-4, 4, -4]
          }}
          transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut" }}
        >
          <ellipse cx="50" cy="115" rx="30" ry="4" fill="#E8D5B0" opacity="0.4"/>
          {/* Celebrating arms */}
          <path d="M 18 68 Q 6 45 15 32" stroke="#7C5CFF" strokeWidth="5.5" strokeLinecap="round" />
          <path d="M 82 68 Q 94 45 85 32" stroke="#7C5CFF" strokeWidth="5.5" strokeLinecap="round" />

          {/* Head */}
          <rect x="25" y="25" width="50" height="42" rx="10" fill="#7C5CFF" stroke="#1F1F1F" strokeWidth="2" />
          <rect x="29" y="29" width="42" height="34" rx="8" fill="white" />
          {/* Eyes (happy squints) */}
          <path d="M 36 43 Q 41 37 46 43" stroke="#1F1F1F" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M 54 43 Q 59 37 64 43" stroke="#1F1F1F" strokeWidth="3" strokeLinecap="round" fill="none" />
          
          {/* Laughing Mouth */}
          <path d="M 42 49 Q 50 60 58 49 Z" fill="#FF8A50" stroke="#1F1F1F" strokeWidth="2" />
          <circle cx="34" cy="48" r="2.5" fill="#FFB4B4" />
          <circle cx="66" cy="48" r="2.5" fill="#FFB4B4" />

          {/* Antenna */}
          <line x1="50" y1="25" x2="50" y2="12" stroke="#7C5CFF" strokeWidth="2.5" />
          <circle cx="50" cy="8" r="4" fill="#FFD54F" stroke="#1F1F1F" strokeWidth="1.5" />

          {/* Torso */}
          <rect x="34" y="67" width="32" height="28" rx="8" fill="#7C5CFF" stroke="#1F1F1F" strokeWidth="2" />
          <rect x="40" y="72" width="20" height="18" rx="4" fill="#FFF9ED" opacity="0.3" />

          {/* Confetti Star inside body */}
          <polygon points="50,75 52,80 57,81 53,84 54,89 50,86 46,89 47,84 43,81 48,80" fill="#FFD54F" />

          {/* Legs */}
          <rect x="40" y="95" width="8" height="12" rx="2" fill="#FFD54F" stroke="#1F1F1F" strokeWidth="1.5" />
          <rect x="52" y="95" width="8" height="12" rx="2" fill="#FFD54F" stroke="#1F1F1F" strokeWidth="1.5" />
        </motion.svg>
      </div>

      {/* Complete Message */}
      <div className="w-12 h-12 bg-accent-green/15 rounded-full flex items-center justify-center mb-4 select-none border-2 border-accent-green">
        <span className="text-xl text-accent-green font-black">✓</span>
      </div>
      <h3 className="text-xl font-black text-text mb-2 select-none">Analysis Complete!</h3>
      <p className="text-xs sm:text-sm font-bold text-text-light mb-8 max-w-xs leading-relaxed select-none">
        Great news! We've scanned <span className="text-secondary font-black">{fileName || "your resume"}</span> and calculated your career recommendations.
      </p>

      {/* Action CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-3.5 w-full max-w-sm justify-center">
        <button
          onClick={onExplore}
          className="px-6 py-3.5 bg-primary border-3 border-text text-sm font-black rounded-2xl shadow-[4px_4px_0px_#1F1F1F] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-text cursor-pointer select-none active:scale-95 flex-1"
        >
          View Dashboard
        </button>
        <button
          onClick={onReset}
          className="px-6 py-3.5 bg-white border-3 border-text text-sm font-black rounded-2xl shadow-[4px_4px_0px_#1F1F1F] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-cream-dark/20 transition-all text-text cursor-pointer select-none active:scale-95 flex-1"
        >
          Upload Another
        </button>
      </div>
    </motion.div>
  );
}
