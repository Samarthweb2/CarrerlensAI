import React from 'react';
import { motion } from 'framer-motion';

export default function MissingSkills({ missingSkills = [] }) {
  return (
    <div className="bg-white border-3 border-text p-6 sm:p-8 rounded-3xl shadow-[6px_6px_0px_#1F1F1F] select-none text-left w-full relative overflow-hidden">
      
      {/* Hand-drawn point arrow or robot backdrop */}
      <div className="absolute right-4 bottom-2 opacity-15 pointer-events-none select-none hidden sm:block">
        {/* Smiling robot pointer SVG */}
        <svg viewBox="0 0 100 100" className="w-24 h-24">
          <rect x="10" y="30" width="50" height="42" rx="10" fill="#7C5CFF" stroke="#1F1F1F" strokeWidth="2" />
          <rect x="14" y="34" width="42" height="34" rx="8" fill="white" />
          <circle cx="28" cy="46" r="3.5" fill="#1F1F1F" />
          <circle cx="48" cy="46" r="3.5" fill="#1F1F1F" />
          <path d="M 32 54 Q 38 58 44 54" stroke="#1F1F1F" strokeWidth="2" fill="none" />
          {/* Pointer Hand pointing left */}
          <path d="M 60 50 L 90 50 M 90 50 L 80 40 M 90 50 L 80 60" stroke="#FF8A50" strokeWidth="4" strokeLinecap="round" />
        </svg>
      </div>

      <h3 className="text-sm font-black text-text uppercase tracking-wider mb-2 flex items-center gap-2">
        <span>⚠️</span> Missing Skill Gaps ({missingSkills.length})
      </h3>
      <p className="text-xs font-bold text-text-light mb-6">
        Recruiters look for these related keywords. Add them to stand out!
      </p>

      {missingSkills.length === 0 ? (
        <p className="text-xs font-bold text-accent-green">Fantastic! No major skill gaps identified.</p>
      ) : (
        <div className="flex flex-wrap gap-2.5">
          {missingSkills.map((skill, index) => (
            <motion.div
              key={skill}
              whileHover={{ scale: 1.05 }}
              className="px-3.5 py-2 bg-accent-orange/15 border-2 border-accent-orange rounded-xl text-xs font-black text-accent-orange shadow-[2px_2px_0px_#1F1F1F] flex items-center gap-1.5 cursor-default transition-all"
            >
              <span className="text-base select-none">⚡</span>
              <span>{skill}</span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
