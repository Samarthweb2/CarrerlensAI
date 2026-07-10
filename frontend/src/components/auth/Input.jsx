import React from 'react';

export default function Input({ label, error, ...props }) {
  return (
    <div className="flex flex-col gap-1.5 w-full text-left">
      {label && (
        <label className="text-[13px] font-black text-text uppercase tracking-wide">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-3 bg-white border-2 rounded-xl text-sm font-semibold text-text placeholder-text-muted transition-all outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/10 ${
          error ? 'border-accent-orange' : 'border-card-border'
        }`}
        {...props}
      />
      {error && (
        <span className="text-xs font-bold text-accent-orange block mt-0.5">
          {error}
        </span>
      )}
    </div>
  );
}
