import React from 'react';
import { motion } from 'framer-motion';

export default function ErrorToast({ message, onClose }) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
      className="fixed bottom-6 right-6 z-50 max-w-sm bg-white border-3 border-text rounded-2xl p-4 shadow-[4px_4px_0px_#1F1F1F] flex items-start gap-3.5 select-none"
    >
      
      {/* Confused mini robot icon */}
      <svg viewBox="0 0 80 80" fill="none" className="w-11 h-11 shrink-0">
        <ellipse cx="40" cy="72" rx="16" ry="3" fill="#E8D5B0" opacity="0.4"/>
        <motion.g
          animate={{ rotate: [-4, 4, -4] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        >
          <rect x="15" y="15" width="50" height="42" rx="10" fill="#7C5CFF"/>
          <rect x="19" y="19" width="42" height="34" rx="8" fill="white"/>
          {/* Confused/worried eyes */}
          <circle cx="32" cy="31" r="4.5" fill="#1F1F1F"/>
          <circle cx="48" cy="31" r="4.5" fill="#1F1F1F"/>
          {/* Flat worried mouth */}
          <path d="M 33 42 H 47" stroke="#1F1F1F" strokeWidth="2.5" strokeLinecap="round"/>
        </motion.g>
        <rect x="28" y="55" width="24" height="15" rx="4" fill="#7C5CFF"/>
      </svg>

      <div className="flex-1 text-left">
        <h4 className="text-sm font-black text-accent-orange uppercase tracking-wide">
          Oops!
        </h4>
        <p className="text-xs font-bold text-text mt-0.5 leading-snug">
          {message}
        </p>
      </div>

      <button
        onClick={onClose}
        className="text-text-muted hover:text-text font-black text-sm select-none cursor-pointer"
      >
        ✕
      </button>
    </motion.div>
  );
}
