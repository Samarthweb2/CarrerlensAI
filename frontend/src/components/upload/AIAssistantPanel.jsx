import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AIAssistantPanel() {
  const tips = [
    "ATS scanners read clean PDFs much better than multi-column templates.",
    "Keep your skill keywords exact (e.g. use 'SQL' instead of 'Database management').",
    "Avoid using visual tables or headers. Screen readers skip them easily.",
    "Include action verbs (e.g. 'Led', 'Developed', 'Optimized') at the start of bullets."
  ];

  const [activeTip, setActiveTip] = useState(tips[0]);
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const tipInterval = setInterval(() => {
      setTipIndex(prev => {
        const next = (prev + 1) % tips.length;
        setActiveTip(tips[next]);
        return next;
      });
    }, 6000);
    return () => clearInterval(tipInterval);
  }, []);

  const quickActions = [
    { title: 'Resume Templates', desc: 'Duolingo-style doc themes', icon: '🎨', color: '#7C5CFF' },
    { title: 'ATS Tips', desc: 'Beat scanning filters', icon: '⚡', color: '#FFD54F' },
    { title: 'Career Guide', desc: 'Landing student internships', icon: '🎯', color: '#4CAF50' },
    { title: 'Interview Tips', desc: 'Practice with custom AI bots', icon: '🧠', color: '#FF8A50' }
  ];

  return (
    <div className="flex flex-col gap-6 w-full text-left">
      
      {/* Mascot Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white border-3 border-text p-6 rounded-3xl shadow-[6px_6px_0px_#1F1F1F] flex flex-col items-center text-center relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/5 rounded-bl-full pointer-events-none" />
        
        {/* Animated robot avatar */}
        <div className="w-20 h-20 relative mb-4 select-none">
          <svg viewBox="0 0 100 100" className="w-20 h-20">
            <ellipse cx="50" cy="90" rx="25" ry="4" fill="#E8D5B0" opacity="0.4"/>
            <motion.g
              animate={{ y: [0, -3, 0] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
            >
              <line x1="50" y1="24" x2="50" y2="10" stroke="#7C5CFF" strokeWidth="3" />
              <circle cx="50" cy="8" r="4" fill="#FFD54F" />
              <rect x="20" y="24" width="60" height="52" rx="12" fill="#7C5CFF" stroke="#1F1F1F" strokeWidth="2.5" />
              <rect x="25" y="29" width="50" height="42" rx="9" fill="white" />
              {/* Eyes */}
              <circle cx="40" cy="46" r="5" fill="#1F1F1F" />
              <circle cx="60" cy="46" r="5" fill="#1F1F1F" />
              {/* Blush */}
              <circle cx="32" cy="54" r="3" fill="#FFB4B4" />
              <circle cx="68" cy="54" r="3" fill="#FFB4B4" />
              {/* Smile */}
              <path d="M 44 56 Q 50 61 56 56" stroke="#1F1F1F" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </motion.g>
          </svg>
        </div>

        <h4 className="text-base font-extrabold text-text select-none">Hi Samarth! 👋</h4>
        <p className="text-xs font-bold text-text-light mb-5 max-w-[210px] select-none">
          Ready to improve your career today? Here is your quick AI tip:
        </p>

        {/* Tip content bubble */}
        <div className="bg-cream border-2 border-card-border p-4 rounded-2xl w-full min-h-[96px] flex items-center justify-center relative text-left">
          <div className="absolute -top-[9px] left-1/2 -translate-x-1/2 w-4 h-4 bg-cream border-t-2 border-l-2 border-card-border transform rotate-45" />
          <AnimatePresence mode="wait">
            <motion.p
              key={tipIndex}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.3 }}
              className="text-xs font-bold text-text leading-relaxed flex gap-2"
            >
              <span className="text-secondary select-none">💡</span>
              <span>{activeTip}</span>
            </motion.p>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Quick Actions List */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white border-3 border-text p-6 rounded-3xl shadow-[6px_6px_0px_#1F1F1F] flex flex-col"
      >
        <h4 className="text-sm font-black text-text uppercase tracking-wider mb-4 select-none">
          Quick Actions
        </h4>
        
        <div className="grid grid-cols-1 gap-3">
          {quickActions.map((action, i) => (
            <motion.button
              key={action.title}
              whileHover={{ x: 4, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3.5 p-3 rounded-2xl border-2 border-card-border hover:border-text transition-all text-left bg-cream/10 cursor-pointer w-full group"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-[2px_2px_0px_#1F1F1F] border-2 border-text transition-transform group-hover:-rotate-3"
                style={{ backgroundColor: action.color === '#FFD54F' ? '#FFF9ED' : `${action.color}15` }}
              >
                {action.icon}
              </div>
              <div>
                <h5 className="text-xs sm:text-sm font-black text-text group-hover:text-secondary transition-colors">
                  {action.title}
                </h5>
                <p className="text-[10px] font-bold text-text-light">
                  {action.desc}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

    </div>
  );
}
