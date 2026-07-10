import React from 'react';
import { motion } from 'framer-motion';

export default function SuccessModal({ message }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-text/50 backdrop-blur-sm p-4 select-none">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-sm bg-white border-3 border-text rounded-3xl p-8 text-center shadow-[8px_8px_0px_#1F1F1F] relative overflow-hidden"
      >
        
        {/* Floating sparkles and particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.span
              key={i}
              initial={{ y: 50, opacity: 1 }}
              animate={{ y: -80, x: (i % 2 === 0 ? 30 : -30) * (i * 0.2 + 1), scale: [0.5, 1, 0], opacity: [1, 1, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.2 }}
              className="absolute text-lg"
              style={{ left: `${25 + (i % 3) * 20}%`, bottom: '20%' }}
            >
              {['🎉', '✨', '🎈', '⭐'][i % 4]}
            </motion.span>
          ))}
        </div>

        {/* Celebrating Robot Mascot */}
        <svg viewBox="0 0 140 140" fill="none" className="w-28 h-28 mx-auto mb-4">
          <ellipse cx="70" cy="125" rx="30" ry="5" fill="#E8D5B0" opacity="0.4"/>
          {/* Celebrating arms */}
          <motion.path
            d="M 30 90 Q 10 65 20 50"
            stroke="#7C5CFF" strokeWidth="6" strokeLinecap="round"
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 0.5 }}
          />
          <motion.path
            d="M 110 90 Q 130 65 120 50"
            stroke="#7C5CFF" strokeWidth="6" strokeLinecap="round"
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 0.5, delay: 0.1 }}
          />
          {/* Head */}
          <motion.g
            animate={{ y: [0, -2, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <rect x="35" y="25" width="70" height="58" rx="14" fill="#7C5CFF"/>
            <rect x="40" y="30" width="60" height="48" rx="10" fill="white"/>
            {/* Squint happy eyes */}
            <path d="M 50 48 Q 57 40 64 48" stroke="#1F1F1F" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
            <path d="M 76 48 Q 83 40 90 48" stroke="#1F1F1F" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
            {/* laughing open mouth */}
            <path d="M 58 60 Q 70 74 82 60 Z" fill="#FF8A50" stroke="#1F1F1F" strokeWidth="2"/>
          </motion.g>
          <rect x="48" y="85" width="44" height="32" rx="8" fill="#7C5CFF"/>
          <rect x="54" y="91" width="32" height="20" rx="4" fill="#F9F5EB"/>
          <circle cx="70" cy="101" r="4.5" fill="#FFD54F"/>
        </svg>

        {/* Checkmark circle */}
        <div className="w-12 h-12 rounded-full bg-accent-green/10 border-2 border-accent-green flex items-center justify-center mx-auto mb-4 text-accent-green">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" className="w-6 h-6">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h3 className="text-xl font-black text-text mb-1">
          Success!
        </h3>
        <p className="text-sm font-bold text-text-light">
          {message || 'You have successfully signed in.'}
        </p>
      </motion.div>
    </div>
  );
}
