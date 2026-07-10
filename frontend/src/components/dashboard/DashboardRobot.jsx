import React from 'react';
import { motion } from 'framer-motion';

export default function DashboardRobot({ score = 91 }) {
  // Determine expression
  let mood = 'happy';
  if (score < 60) mood = 'concerned';
  else if (score < 85) mood = 'thinking';

  return (
    <div className="w-full flex justify-center items-center select-none pointer-events-none relative h-36">
      {/* Sparkles / Particles for high scores */}
      {mood === 'happy' && (
        <>
          <motion.span
            animate={{ scale: [0, 1.2, 0], y: [-10, -30] }}
            transition={{ repeat: Infinity, duration: 1.8, delay: 0.2 }}
            className="absolute left-6 top-6 text-sm"
          >
            ✨
          </motion.span>
          <motion.span
            animate={{ scale: [0, 1.2, 0], y: [-10, -25] }}
            transition={{ repeat: Infinity, duration: 2, delay: 0.8 }}
            className="absolute right-6 top-6 text-sm"
          >
            ⭐
          </motion.span>
        </>
      )}
      
      <motion.svg
        viewBox="0 0 160 160"
        className="w-32 h-32 relative z-10"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Shadow */}
        <ellipse cx="80" cy="150" rx="60" ry="6" fill="#E8D5B0" opacity="0.4" />

        {/* Sweating for concerned mood */}
        {mood === 'concerned' && (
          <motion.path
            d="M 45 45 Q 35 55 40 65 Q 45 65 45 55 Z"
            fill="#80D8FF"
            animate={{ y: [0, 12], opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
        )}

        {/* Waving Arm (Waves once when page loads) */}
        <motion.path
          d="M 28 92 Q 10 70 18 55"
          stroke="#7C5CFF"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          animate={{
            rotate: [0, -25, 5, -20, 0]
          }}
          transition={{ duration: 1.8, ease: "easeInOut", delay: 0.5 }}
          style={{ originX: "28px", originY: "92px" }}
        />

        {/* Other Arm */}
        <motion.path
          d="M 132 92 Q 150 105 142 118"
          stroke="#7C5CFF"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          animate={{ y: [0, -3, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        />

        {/* Robot Head */}
        <motion.g
          animate={{
            y: [0, -4, 0],
            rotate: mood === 'thinking' ? [0, 3, 3, 0] : [0, 1, -1, 0]
          }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        >
          <rect x="35" y="30" width="90" height="72" rx="18" fill="#7C5CFF" stroke="#1F1F1F" strokeWidth="3" />
          <rect x="42" y="37" width="76" height="58" rx="13" fill="white" />
          
          {/* Antenna */}
          <line x1="80" y1="30" x2="80" y2="14" stroke="#7C5CFF" strokeWidth="4" />
          <motion.circle
            cx="80"
            cy="10"
            r="6"
            fill={mood === 'happy' ? '#FFD54F' : mood === 'thinking' ? '#7C5CFF' : '#FF8A50'}
            stroke="#1F1F1F"
            strokeWidth="2"
            animate={{ scale: mood === 'happy' ? [1, 1.2, 1] : 1 }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />

          {/* Expressions */}
          {mood === 'happy' && (
            <>
              {/* Happy squinty eyes */}
              <path d="M 52 58 Q 60 50 68 58" stroke="#1F1F1F" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <path d="M 92 58 Q 100 50 108 58" stroke="#1F1F1F" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              {/* Smiling mouth */}
              <path d="M 70 72 Q 80 84 90 72" stroke="#1F1F1F" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              {/* Blush */}
              <circle cx="48" cy="68" r="4.5" fill="#FFB4B4" />
              <circle cx="112" cy="68" r="4.5" fill="#FFB4B4" />
            </>
          )}

          {mood === 'thinking' && (
            <>
              {/* Curious looking-up eyes */}
              <circle cx="60" cy="54" r="6" fill="#1F1F1F" />
              <circle cx="100" cy="54" r="6" fill="#1F1F1F" />
              <circle cx="62" cy="50" r="2.5" fill="white" />
              <circle cx="102" cy="50" r="2.5" fill="white" />
              {/* Curved mouth */}
              <path d="M 72 74 Q 80 70 88 74" stroke="#1F1F1F" strokeWidth="3" strokeLinecap="round" fill="none" />
            </>
          )}

          {mood === 'concerned' && (
            <>
              {/* Worried eyes (slanted brows) */}
              <path d="M 50 50 L 66 58" stroke="#1F1F1F" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M 110 50 L 94 58" stroke="#1F1F1F" strokeWidth="3.5" strokeLinecap="round" />
              <circle cx="58" cy="62" r="5" fill="#1F1F1F" />
              <circle cx="102" cy="62" r="5" fill="#1F1F1F" />
              {/* Squiggly mouth */}
              <path d="M 72 78 Q 76 74 80 78 Q 84 82 88 78" fill="none" stroke="#1F1F1F" strokeWidth="3" strokeLinecap="round" />
            </>
          )}
        </motion.g>

        {/* Torso */}
        <rect x="55" y="100" width="50" height="42" rx="12" fill="#7C5CFF" stroke="#1F1F1F" strokeWidth="3" />
        <rect x="65" y="108" width="30" height="24" rx="6" fill="#FFF9EC" opacity="0.35" />
      </motion.svg>
    </div>
  );
}
