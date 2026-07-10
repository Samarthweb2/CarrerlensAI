import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CareerRoadmap({ steps = [] }) {
  // Store selected milestone index for detail display
  const [selectedIndex, setSelectedIndex] = useState(2); // Default to current milestone

  return (
    <div className="bg-white border-3 border-text p-6 sm:p-8 rounded-3xl shadow-[6px_6px_0px_#1F1F1F] select-none text-left w-full">
      <h3 className="text-sm font-black text-text uppercase tracking-wider mb-2 flex items-center gap-2">
        <span>🗺️</span> Interactive Career Roadmap
      </h3>
      <p className="text-xs font-bold text-text-light mb-8">
        Click on milestones to see skill requirements and scope.
      </p>

      {/* Horizontal roadmap container with overflow auto */}
      <div className="w-full overflow-x-auto pb-4 mb-6">
        <div className="flex items-center gap-6 min-w-[640px] px-4 relative">
          
          {/* Connector Dotted Line */}
          <div className="absolute top-1/2 left-0 right-0 h-[3px] border-t-3 border-dashed border-text-muted/40 z-0 -translate-y-1/2" />

          {steps.map((step, index) => {
            const isSelected = selectedIndex === index;
            const isCompleted = step.completed;

            return (
              <div
                key={step.title}
                onClick={() => setSelectedIndex(index)}
                className="flex-1 flex flex-col items-center cursor-pointer relative z-10 select-none group"
              >
                {/* Node Ring */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={`w-10 h-10 rounded-full border-3 border-text flex items-center justify-center font-black text-sm transition-all shadow-[2px_2px_0px_#1F1F1F] ${
                    isCompleted
                      ? 'bg-primary text-text shadow-[0_0_12px_rgba(255,213,79,0.5),2px_2px_0px_#1F1F1F]'
                      : 'bg-white text-text-muted hover:border-secondary'
                  } ${isSelected ? 'ring-4 ring-secondary/35' : ''}`}
                >
                  {isCompleted ? '✓' : index + 1}
                </motion.div>

                {/* Milestone label */}
                <span
                  className={`text-xs mt-3 font-black text-center whitespace-nowrap transition-colors duration-250 ${
                    isSelected ? 'text-secondary' : isCompleted ? 'text-text' : 'text-text-light'
                  }`}
                >
                  {step.title}
                </span>

                {/* Glow ring indicator on selection */}
                {isSelected && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute -inset-1 rounded-full border-2 border-secondary/60 pointer-events-none"
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed milestone explanation panel */}
      <div className="bg-cream border-2 border-card-border p-5 rounded-2xl relative transition-all min-h-[96px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedIndex}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-1"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="bg-secondary/15 border border-secondary/35 text-secondary text-[10px] font-black px-2 py-0.5 rounded">
                Tier {selectedIndex + 1}
              </span>
              <span className="text-xs font-black text-text-light">•</span>
              <span className="text-xs font-black text-text-light uppercase tracking-wider">
                {steps[selectedIndex]?.completed ? 'Completed Milestone' : 'Target Career Path'}
              </span>
            </div>
            
            <h4 className="text-sm font-black text-text">
              {steps[selectedIndex]?.title}
            </h4>
            <p className="text-xs font-bold text-text-light leading-relaxed">
              {steps[selectedIndex]?.desc || "Unlock detailed qualifications by checking matching jobs below."}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
}
