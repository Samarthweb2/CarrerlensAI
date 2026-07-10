import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardHeader({
  userName = "Samarth",
  fileName = "Resume.pdf",
  analysisDuration = "4.8",
  onNavigate
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const notifications = [
    { id: 1, text: "🤖 ATS system upgraded to version 4.2!", read: false },
    { id: 2, text: "🔥 Added 5 new resume templates.", read: true }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-cream/90 backdrop-blur-md border-b-3 border-text px-4 sm:px-6 py-4 w-full">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Welcome Section */}
        <div className="flex flex-col text-left">
          <h1 className="text-xl sm:text-2xl font-black text-text flex items-center gap-1.5 select-none">
            Hello {userName} 👋
          </h1>
          
          <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1.5 mt-1 text-[11px] font-bold text-text-light">
            <span className="flex items-center gap-1">
              <span className="text-secondary select-none">📄</span> Resume: <strong className="text-text">{fileName}</strong>
            </span>
            <span className="text-card-border/60 hidden sm:inline">|</span>
            <span className="flex items-center gap-1">
              <span className="text-primary select-none">⚡</span> Analysis Time: <strong className="text-text">{analysisDuration} Seconds</strong>
            </span>
            <span className="text-card-border/60 hidden sm:inline">|</span>
            <span className="flex items-center gap-1">
              <span className="text-accent-orange select-none">📅</span> Scanned: <strong className="text-text">Today</strong>
            </span>
          </div>
        </div>

        {/* Action Widgets */}
        <div className="flex items-center gap-3.5 justify-end relative">
          
          {/* Notification Bell */}
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-10 h-10 border-2 border-card-border hover:border-text hover:bg-cream-dark/10 rounded-xl flex items-center justify-center cursor-pointer transition-colors relative"
          >
            <span className="text-base select-none">🔔</span>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent-orange text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-text">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification dropdown drawer */}
          <AnimatePresence>
            {showNotifications && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-12 top-12 w-64 bg-white border-3 border-text p-4 rounded-2xl shadow-[4px_4px_0px_#1F1F1F] z-50 flex flex-col gap-2.5 text-left"
                >
                  <div className="flex items-center justify-between border-b border-card-border/40 pb-2 mb-1">
                    <span className="text-xs font-black text-text">Notifications</span>
                  </div>
                  {notifications.map(n => (
                    <div
                      key={n.id}
                      className={`p-2 rounded-lg text-xs leading-relaxed font-bold transition-all ${
                        n.read ? 'text-text-light bg-cream/10' : 'text-text bg-secondary/5 border-l-3 border-secondary'
                      }`}
                    >
                      {n.text}
                    </div>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Settings button */}
          <button
            onClick={() => alert("Settings panel drawer...")}
            className="w-10 h-10 border-2 border-card-border hover:border-text hover:bg-cream-dark/10 rounded-xl flex items-center justify-center cursor-pointer transition-colors"
          >
            <span className="text-base select-none">⚙️</span>
          </button>

          {/* User profile avatar */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl border-2 border-text bg-primary/25 flex items-center justify-center font-black text-sm select-none">
              {userName[0] || 'U'}
            </div>
            <span className="text-xs font-extrabold hidden md:inline text-text">{userName}</span>
          </div>

          {/* Logout Escape CTA */}
          <button
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              onNavigate('/');
            }}
            className="px-3.5 py-2 border-2 border-card-border hover:border-text hover:bg-cream-dark/10 rounded-xl font-bold text-xs cursor-pointer text-text transition-all select-none active:scale-95"
          >
            Logout ➔
          </button>

        </div>
      </div>
    </header>
  );
}
