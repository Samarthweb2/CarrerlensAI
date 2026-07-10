import React from 'react';

export default function Checkbox({ label, ...props }) {
  return (
    <label className="flex items-start gap-2.5 cursor-pointer text-left select-none group">
      <input
        type="checkbox"
        className="peer sr-only"
        {...props}
      />
      <div className="w-5.5 h-5.5 shrink-0 rounded-lg border-2 border-card-border peer-checked:border-secondary peer-checked:bg-secondary flex items-center justify-center transition-all peer-focus:ring-4 peer-focus:ring-secondary/15">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="3.5"
          className="w-3.5 h-3.5 opacity-0 peer-checked:opacity-100 transition-opacity"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      {label && (
        <span className="text-xs sm:text-[13px] font-bold text-text-light group-hover:text-text transition-colors leading-tight">
          {label}
        </span>
      )}
    </label>
  );
}
