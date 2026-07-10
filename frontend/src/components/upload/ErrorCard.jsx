import React from 'react';
import { motion } from 'framer-motion';

export default function ErrorCard({ errorMsg, onRetry }) {
  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-white border-3 border-text p-8 sm:p-10 rounded-3xl shadow-[8px_8px_0px_#1F1F1F] flex flex-col items-center w-full text-center relative select-none"
    >
      {/* Worried / Confused Mascot */}
      <div className="w-40 h-40 relative flex justify-center items-center mb-6">
        {/* Shaking Confused Robot */}
        <motion.svg
          viewBox="0 0 100 120"
          className="w-32 h-32 relative z-10"
          animate={{
            x: [-1, 1, -1, 1, 0],
            y: [0, -1, 0, 1, 0]
          }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ellipse cx="50" cy="115" rx="30" ry="3" fill="#E8D5B0" opacity="0.4"/>
          {/* Sweat droplet */}
          <motion.path
            d="M 22 28 Q 16 35 20 41 Q 24 41 24 35 Z"
            fill="#80D8FF"
            animate={{ y: [0, 8, 16], opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeIn" }}
          />

          {/* Robot Head tilted slightly */}
          <g transform="rotate(4, 50, 50)">
            <rect x="25" y="25" width="50" height="42" rx="10" fill="#7C5CFF" stroke="#1F1F1F" strokeWidth="2" />
            <rect x="29" y="29" width="42" height="34" rx="8" fill="white" />
            
            {/* Dizzy / Confused Eyes */}
            {/* Eye 1 */}
            <path d="M 33 39 L 41 47 M 41 39 L 33 47" stroke="#1F1F1F" strokeWidth="2.5" strokeLinecap="round" />
            {/* Eye 2 */}
            <path d="M 59 39 L 67 47 M 67 39 L 59 47" stroke="#1F1F1F" strokeWidth="2.5" strokeLinecap="round" />

            {/* Confused Squiggly Mouth */}
            <path d="M 43 56 Q 47 52 50 56 Q 53 60 57 56" fill="none" stroke="#1F1F1F" strokeWidth="2.5" strokeLinecap="round" />

            {/* Antenna crooked */}
            <path d="M 50 25 Q 46 16 48 10" fill="none" stroke="#7C5CFF" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="48" cy="8" r="3.5" fill="#FF8A50" stroke="#1F1F1F" strokeWidth="1.5" />
          </g>

          {/* Torso */}
          <rect x="34" y="67" width="32" height="28" rx="8" fill="#7C5CFF" stroke="#1F1F1F" strokeWidth="2" />
          
          {/* Confused Question mark bubble */}
          <g transform="translate(68, 70)">
            <circle cx="10" cy="10" r="12" fill="#FF8A50" stroke="#1F1F1F" strokeWidth="2" />
            <text x="10" y="15" textAnchor="middle" fill="white" fontWeight="900" fontSize="16">?</text>
          </g>
        </motion.svg>
      </div>

      {/* Error Badge */}
      <div className="w-12 h-12 bg-accent-orange/15 rounded-full flex items-center justify-center mb-4 border-2 border-accent-orange select-none">
        <span className="text-xl text-accent-orange font-black">!</span>
      </div>

      <h3 className="text-xl font-black text-text mb-2 select-none">Upload Failed</h3>
      <p className="text-xs sm:text-sm font-bold text-text-light mb-8 max-w-xs leading-relaxed select-none">
        {errorMsg || "Something went wrong while scanning your file."}
      </p>

      {/* Try Again Button */}
      <button
        onClick={onRetry}
        className="px-8 py-3.5 bg-primary border-3 border-text text-sm font-black rounded-2xl shadow-[4px_4px_0px_#1F1F1F] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-text cursor-pointer select-none active:scale-95 w-full max-w-xs"
      >
        Try Again
      </button>
    </motion.div>
  );
}
