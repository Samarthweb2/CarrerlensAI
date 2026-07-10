import React from 'react';
import { motion } from 'framer-motion';

export default function KeywordChart({ keywordMatch = { matched: 82, missing: 18, density: "4.2%" } }) {
  const { matched, missing, density } = keywordMatch;

  // SVG parameters
  const size = 120;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Pie segment offsets
  const matchedOffset = circumference - (matched / 100) * circumference;
  const missingOffset = circumference - (missing / 100) * circumference;

  return (
    <div className="bg-white border-3 border-text p-6 sm:p-8 rounded-3xl shadow-[6px_6px_0px_#1F1F1F] select-none text-left w-full flex flex-col sm:flex-row items-center gap-6">
      
      {/* Animated Donut Gauge */}
      <div className="w-32 h-32 relative shrink-0 flex items-center justify-center">
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full transform -rotate-90">
          {/* Missing Keywords segment */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#FF8A50"
            strokeWidth={strokeWidth}
          />
          {/* Matched Keywords segment */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#7C5CFF"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: matchedOffset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-2xl font-black text-text">{matched}%</span>
          <span className="text-[9px] font-black text-text-light uppercase tracking-wider">Match</span>
        </div>
      </div>

      {/* Legend & Density Information */}
      <div className="flex-1 flex flex-col gap-3 w-full">
        <h3 className="text-sm font-black text-text uppercase tracking-wider mb-1">Keyword Split</h3>
        
        <div className="flex flex-col gap-2">
          {/* Matched */}
          <div className="flex items-center justify-between text-xs font-bold text-text">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 bg-secondary border border-text rounded-md inline-block" />
              <span>Matched Keywords</span>
            </div>
            <span className="font-black text-secondary">{matched}%</span>
          </div>

          {/* Missing */}
          <div className="flex items-center justify-between text-xs font-bold text-text">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 bg-accent-orange border border-text rounded-md inline-block" />
              <span>Missing Keywords</span>
            </div>
            <span className="font-black text-accent-orange">{missing}%</span>
          </div>

          {/* Density */}
          <div className="border-t border-card-border/60 pt-2.5 mt-1 flex items-center justify-between text-xs font-bold text-text">
            <span>Overall Density</span>
            <span className="bg-primary/20 border border-primary/30 px-2 py-0.5 rounded-md font-black text-text">
              {density}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
