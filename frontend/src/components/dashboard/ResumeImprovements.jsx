import React from 'react';
import { motion } from 'framer-motion';

export default function ResumeImprovements({ improvements = [] }) {
  if (!improvements || improvements.length === 0) {
    return (
      <div className="bg-white border-3 border-text p-8 rounded-3xl shadow-[6px_6px_0px_#1F1F1F] text-center select-none">
        <span className="text-4xl mb-3 block">✨</span>
        <h3 className="text-lg font-black text-text mb-1">No Bullet Improvements Needed</h3>
        <p className="text-xs font-bold text-text-light max-w-sm mx-auto">
          Your resume bullets already look strong and result-oriented! If you scan against a target job description, Gemini will recommend custom before/after updates.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border-3 border-text p-6 sm:p-8 rounded-3xl shadow-[6px_6px_0px_#1F1F1F] text-left w-full">
      <div className="flex items-center gap-2.5 mb-2">
        <span className="text-2xl">✨</span>
        <h3 className="text-sm font-black text-text uppercase tracking-wider">AI Resume Bullet Improver</h3>
      </div>
      <p className="text-xs font-bold text-text-light mb-6">
        Upgrade simple bullet points into high-impact, results-driven descriptions that impress recruiters and pass ATS keywords:
      </p>

      <div className="flex flex-col gap-6">
        {improvements.map((imp, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.1 }}
            className="border-2 border-text rounded-2xl overflow-hidden shadow-[4px_4px_0px_#1F1F1F] bg-cream/10 flex flex-col"
          >
            {/* Header / Rationale bar */}
            <div className="bg-[#7C5CFF]/15 border-b-2 border-text px-4 py-2.5 flex items-center justify-between text-xs font-black text-secondary">
              <span>SUGGESTION #{idx + 1}</span>
              <span className="bg-white border border-text px-2 py-0.5 rounded text-[10px] uppercase font-bold text-text">
                ATS ALIGNED
              </span>
            </div>

            {/* Before-and-After content split */}
            <div className="grid grid-cols-1 md:grid-cols-2 border-b-2 border-text">
              {/* BEFORE */}
              <div className="p-4 flex flex-col gap-2 border-r-0 md:border-r-2 border-text bg-[#FF8A50]/5">
                <div className="flex items-center gap-1.5 text-xs font-black text-accent-orange">
                  <span>❌</span> BEFORE (Original)
                </div>
                <p className="text-xs font-bold text-text-light italic bg-white/60 p-3 rounded-xl border border-card-border">
                  "{imp.before}"
                </p>
              </div>

              {/* AFTER */}
              <div className="p-4 flex flex-col gap-2 bg-[#4CAF50]/5">
                <div className="flex items-center gap-1.5 text-xs font-black text-accent-green">
                  <span>🚀</span> AFTER (Improved Bullet)
                </div>
                <p className="text-xs sm:text-sm font-black text-text bg-white p-3 rounded-xl border-2 border-accent-green shadow-[2px_2px_0px_rgba(76,175,80,0.15)]">
                  "{imp.after}"
                </p>
              </div>
            </div>

            {/* Improvement logic details */}
            <div className="p-4 bg-white flex flex-col gap-1">
              <span className="text-[10px] font-black text-text-muted uppercase tracking-wider">AI Rationale:</span>
              <p className="text-xs font-bold text-text-light">
                {imp.reason || "Replaces passive verbs with action-driven metrics to clearly communicate business impact and tech stack optimizations."}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
