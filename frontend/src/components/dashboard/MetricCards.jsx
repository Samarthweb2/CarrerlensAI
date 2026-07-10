import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function CountUpValue({ value = 0, duration = 1200 }) {
  const [displayVal, setDisplayVal] = useState(0);

  useEffect(() => {
    let start = 0;
    const stepTime = Math.abs(Math.floor(duration / value));
    const timer = setInterval(() => {
      start += 1;
      if (start >= value) {
        setDisplayVal(value);
        clearInterval(timer);
      } else {
        setDisplayVal(start);
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, [value, duration]);

  return <>{displayVal}</>;
}

export default function MetricCards({ resumeScore = 89, formatting = 95, grammar = 93, keywords = 86 }) {
  const metrics = [
    { title: 'Resume Score', val: resumeScore, desc: 'Overall rating quality', icon: '🎯', color: '#7C5CFF' },
    { title: 'Formatting', val: formatting, desc: 'Layout & spacing read', icon: '🎨', color: '#4CAF50' },
    { title: 'Grammar', val: grammar, desc: 'Spelling & passive speech', icon: '✍️', color: '#FF8A50' },
    { title: 'Keyword Match', val: keywords, desc: 'Search queries keywords', icon: '⚡', color: '#FFD54F' }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
      {metrics.map((metric, i) => (
        <motion.div
          key={metric.title}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
          whileHover={{ y: -3, scale: 1.01 }}
          className="bg-white border-3 border-text p-4 sm:p-5 rounded-2xl shadow-[4px_4px_0px_#1F1F1F] flex flex-col text-left select-none relative group overflow-hidden"
        >
          {/* Subtle background circles */}
          <div className="absolute top-0 right-0 w-12 h-12 bg-cream/30 rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform" />
          
          <div className="flex items-center justify-between mb-2">
            <span className="text-xl">{metric.icon}</span>
            <span className="text-2xl font-black text-text">
              <CountUpValue value={metric.val} />
              <span className="text-sm font-black text-text-light">%</span>
            </span>
          </div>

          <h4 className="text-xs sm:text-sm font-black text-text truncate">
            {metric.title}
          </h4>
          <p className="text-[10px] font-bold text-text-light leading-snug">
            {metric.desc}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
