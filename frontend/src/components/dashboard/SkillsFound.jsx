import React from 'react';
import { motion } from 'framer-motion';

export default function SkillsFound({ skills = [] }) {
  // Fun colors for playful pills
  const colors = [
    'bg-primary/10 border-primary text-secondary',
    'bg-accent-green/10 border-accent-green text-accent-green',
    'bg-accent-orange/10 border-accent-orange text-accent-orange',
    'bg-primary/20 border-secondary text-text',
    'bg-[#FFD54F]/10 border-[#FFD54F] text-text'
  ];

  return (
    <div className="bg-white border-3 border-text p-6 sm:p-8 rounded-3xl shadow-[6px_6px_0px_#1F1F1F] select-none text-left w-full">
      <h3 className="text-sm font-black text-text uppercase tracking-wider mb-2 flex items-center gap-2">
        <span>✅</span> Skills Found ({skills.length})
      </h3>
      <p className="text-xs font-bold text-text-light mb-6">
        Great job! We detected these tech capabilities in your document text.
      </p>

      {skills.length === 0 ? (
        <p className="text-xs font-bold text-text-muted">No skills found. Let's optimize your layout.</p>
      ) : (
        <div className="flex flex-wrap gap-2.5">
          {skills.map((skill, index) => {
            const colorClass = colors[index % colors.length];
            return (
              <motion.div
                key={skill}
                whileHover={{ scale: 1.08, y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className={`px-3 py-1.5 border-2 rounded-xl text-xs font-black shadow-[2px_2px_0px_#1F1F1F] cursor-default transition-all ${colorClass}`}
              >
                {skill}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
