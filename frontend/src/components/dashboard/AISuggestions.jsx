import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function AISuggestions({ suggestions = [] }) {
  const [visibleCount, setVisibleCount] = useState(0);

  // Stagger visibility of chatbot suggestions sequentially
  useEffect(() => {
    if (visibleCount < suggestions.length) {
      const timer = setTimeout(() => {
        setVisibleCount(prev => prev + 1);
      }, 1000); // 1s stagger delay
      return () => clearTimeout(timer);
    }
  }, [visibleCount, suggestions]);

  return (
    <div className="bg-white border-3 border-text p-6 sm:p-8 rounded-3xl shadow-[6px_6px_0px_#1F1F1F] select-none text-left w-full relative">
      <h3 className="text-sm font-black text-text uppercase tracking-wider mb-2 flex items-center gap-2">
        <span>🤖</span> AI Assistant Suggestions
      </h3>
      <p className="text-xs font-bold text-text-light mb-6">
        Here are actionable steps you can take to make your resume stand out to hiring managers:
      </p>

      <div className="flex flex-col gap-4">
        {suggestions.slice(0, visibleCount).map((suggestion, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10, y: 5 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-start gap-3 bg-cream/30 border-2 border-card-border p-3.5 rounded-2xl relative"
          >
            {/* Tiny avatar bubble */}
            <div className="w-8 h-8 rounded-xl bg-secondary/15 border border-secondary/35 flex items-center justify-center text-xs shrink-0 select-none">
              🤖
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <span className="text-[10px] font-black text-text-light uppercase tracking-wider">Recommendation {index + 1}</span>
              <p className="text-xs sm:text-sm font-bold text-text leading-relaxed">
                {suggestion}
              </p>
            </div>
          </motion.div>
        ))}

        {visibleCount < suggestions.length && (
          <div className="flex items-center gap-2 text-text-muted p-2 select-none">
            <motion.span
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
              className="text-xs font-bold"
            >
              AI is writing suggestions...
            </motion.span>
            <div className="flex gap-1">
              <motion.span animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1.5 h-1.5 bg-text-muted rounded-full inline-block" />
              <motion.span animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.15 }} className="w-1.5 h-1.5 bg-text-muted rounded-full inline-block" />
              <motion.span animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.3 }} className="w-1.5 h-1.5 bg-text-muted rounded-full inline-block" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
