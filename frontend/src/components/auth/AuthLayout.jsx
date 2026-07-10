import React from 'react';
import { motion } from 'framer-motion';
import RobotIllustration from './RobotIllustration';

export default function AuthLayout({ children, activeField, status, onNavigate }) {
  return (
    <div className="min-h-screen bg-cream text-text flex flex-col font-sans relative overflow-x-hidden">
      
      {/* Decorative subtle floating background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5
            }}
            className="absolute opacity-15 text-lg"
            style={{
              left: `${10 + i * 16}%`,
              top: `${15 + (i % 3) * 20}%`
            }}
          >
            {['✨', '⭐', '📄', '🚀', '🌸', '🎈'][i % 6]}
          </motion.div>
        ))}
      </div>

      {/* Small Header Logo */}
      <header className="px-6 py-4 border-b border-card-border/60 bg-white/20 backdrop-blur-md relative z-20">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          
          <div className="flex items-center gap-6">
            {/* Logo */}
            <a href="/" onClick={(e) => { e.preventDefault(); onNavigate('/'); }} className="flex items-center gap-2 group">
              <svg viewBox="0 0 100 100" fill="none" className="w-8 h-8 shrink-0 transition-transform duration-300 group-hover:scale-110">
                <line x1="50" y1="20" x2="50" y2="8" stroke="#7C5CFF" strokeWidth="3" strokeLinecap="round"/>
                <circle cx="50" cy="8" r="4.5" fill="#FFD54F"/>
                <rect x="15" y="20" width="70" height="60" rx="14" fill="#7C5CFF"/>
                <rect x="20" y="25" width="60" height="50" rx="10" fill="white"/>
                <circle cx="38" cy="48" r="7" fill="#1F1F1F"/>
                <circle cx="62" cy="48" r="7" fill="#1F1F1F"/>
                <path d="M40 64 Q50 72 60 64" stroke="#1F1F1F" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
              </svg>
              <span className="text-base sm:text-lg font-extrabold tracking-tight text-text">
                Career<span className="text-secondary">Lens</span>AI
              </span>
            </a>

            <div className="h-4 w-px bg-card-border/80 hidden sm:block" />

            {/* Back to Home Button */}
            <motion.button
              onClick={() => onNavigate('/')}
              whileHover={{ x: -3 }}
              className="group flex items-center gap-1.5 text-xs font-black text-text hover:text-secondary uppercase tracking-wider transition-colors cursor-pointer select-none"
            >
              <span className="transition-transform group-hover:-translate-x-1 inline-block">←</span> Back to Home
            </motion.button>
          </div>

          {/* Right Header Help links */}
          <div className="flex items-center gap-4 sm:gap-6 text-xs font-black text-text-light uppercase tracking-wider select-none">
            <span className="text-text-muted hidden md:inline">Need Help?</span>
            <a
              href="#faq"
              onClick={(e) => { e.preventDefault(); onNavigate('/#faq'); }}
              className="hover:text-secondary hover:underline transition-colors"
            >
              FAQ
            </a>
            <a
              href="#contact"
              onClick={(e) => { e.preventDefault(); onNavigate('/#contact'); }}
              className="hover:text-secondary hover:underline transition-colors"
            >
              Contact
            </a>
          </div>

        </div>
      </header>

      {/* Main Split Layout Grid */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 sm:px-8 py-8 sm:py-14 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
        
        {/* LEFT SIDE: Beautiful Illustration (lg:col-span-7) */}
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left gap-6">
          
          {/* Welcome heading & description placed FIRST (removes huge gap) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-md w-full"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-black text-text leading-tight mb-2">
              Welcome to <span className="text-secondary">CareerLensAI</span>
            </h1>
            <p className="text-sm sm:text-base text-text-light leading-relaxed font-semibold">
              Helping students build their dream careers with AI-powered resume optimization.
            </p>
            <div className="h-0.5 bg-card-border/60 mt-4 w-full" />
          </motion.div>

          {/* Storyteller Illustration placed below the text */}
          <RobotIllustration activeField={activeField} status={status} />
        </div>

        {/* RIGHT SIDE: Auth Card Holder (lg:col-span-5) */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end w-full">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, type: "spring", bounce: 0.1 }}
            className="w-full max-w-[450px] bg-white border-3 border-text p-8 sm:p-10 rounded-3xl shadow-[8px_8px_0px_#1F1F1F] flex flex-col"
          >
            {children}
          </motion.div>
        </div>

      </main>

    </div>
  );
}
