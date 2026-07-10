import React from 'react';

export default function DashboardSidebar({ activeSection = 'overview', setActiveSection, onNewScan }) {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: '🎯' },
    { id: 'improvements', label: 'Improver', icon: '✨' },
    { id: 'interview', label: 'Interview Prep', icon: '🧠' },
    { id: 'compare', label: 'Comparison', icon: '⚖️' },
    { id: 'jobs', label: 'Job Matches', icon: '💼' },
    { id: 'profile', label: 'Profile Settings', icon: '👤' },
    { id: 'admin', label: 'Admin Panel', icon: '🔒' }
  ];

  return (
    <aside className="w-full lg:w-64 shrink-0 flex flex-col bg-white border-b-3 lg:border-b-0 lg:border-r-3 border-text p-6 select-none h-auto lg:h-screen lg:sticky lg:top-0">
      
      {/* Branding Logo header */}
      <div className="flex items-center gap-2.5 mb-8">
        <svg viewBox="0 0 100 100" fill="none" className="w-8 h-8 shrink-0">
          <line x1="50" y1="20" x2="50" y2="8" stroke="#7C5CFF" strokeWidth="3" strokeLinecap="round"/>
          <circle cx="50" cy="8" r="4.5" fill="#FFD54F"/>
          <rect x="15" y="20" width="70" height="60" rx="14" fill="#7C5CFF"/>
          <rect x="20" y="25" width="60" height="50" rx="10" fill="white"/>
          <circle cx="38" cy="48" r="7" fill="#1F1F1F"/>
          <circle cx="62" cy="48" r="7" fill="#1F1F1F"/>
          <path d="M40 64 Q50 72 60 64" stroke="#1F1F1F" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
        </svg>
        <span className="text-base font-black tracking-tight text-text">
          Career<span className="text-secondary">Lens</span>AI
        </span>
      </div>

      {/* Menu links list */}
      <nav className="flex-1 flex flex-row lg:flex-col gap-2.5 overflow-x-auto lg:overflow-x-visible pb-3 lg:pb-0">
        {menuItems.map(item => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-primary border-text text-text shadow-[2px_2px_0px_#1F1F1F]'
                  : 'bg-white border-transparent hover:border-card-border text-text-light hover:text-text'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Upload new scan escape button */}
      <div className="border-t border-card-border/60 pt-6 mt-4 lg:mt-0">
        <button
          onClick={onNewScan}
          className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-secondary hover:bg-secondary/90 border-2 border-text text-xs font-black rounded-xl text-white shadow-[3px_3px_0px_#1F1F1F] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer select-none active:scale-95"
        >
          <span>🔄</span>
          <span>Analyze Another</span>
        </button>
      </div>

    </aside>
  );
}
