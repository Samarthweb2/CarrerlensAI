import React from 'react';

export default function Divider({ children }) {
  return (
    <div className="flex items-center gap-3.5 my-4 w-full select-none">
      <div className="h-0.5 bg-card-border/80 flex-1" />
      {children && (
        <span className="text-[11px] font-black text-text-muted uppercase tracking-wider">
          {children}
        </span>
      )}
      <div className="h-0.5 bg-card-border/80 flex-1" />
    </div>
  );
}
