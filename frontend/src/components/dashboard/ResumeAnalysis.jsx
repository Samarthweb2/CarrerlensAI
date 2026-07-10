import React from 'react';
import { motion } from 'framer-motion';

export default function ResumeAnalysis({ sectionScores = {} }) {
  const sections = Object.entries(sectionScores).map(([name, score]) => ({
    name,
    score
  }));

  return (
    <div className="bg-white border-3 border-text p-6 sm:p-8 rounded-3xl shadow-[6px_6px_0px_#1F1F1F] select-none text-left w-full">
      <h3 className="text-sm font-black text-text uppercase tracking-wider mb-2 flex items-center gap-2">
        <span>📊</span> Section Evaluator
      </h3>
      <p className="text-xs font-bold text-text-light mb-6">
        Here's the detailed evaluation breakdown for individual sections.
      </p>

      <div className="flex flex-col gap-4">
        {sections.map((sec, i) => (
          <div key={sec.name} className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-xs font-black text-text">
              <span>{sec.name}</span>
              <span>{sec.score}%</span>
            </div>
            
            {/* Animated progress bar bar */}
            <div className="w-full h-4 bg-cream border-2 border-text rounded-full overflow-hidden relative">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${sec.score}%` }}
                transition={{ duration: 1.2, ease: "easeOut", delay: i * 0.1 }}
                className="h-full bg-secondary border-r-2 border-text"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
