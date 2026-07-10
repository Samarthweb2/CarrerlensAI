import React, { useState } from 'react';

export default function PasswordInput({ label, error, ...props }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col gap-1.5 w-full text-left">
      {label && (
        <label className="text-[13px] font-black text-text uppercase tracking-wide">
          {label}
        </label>
      )}
      <div className="relative w-full">
        <input
          type={showPassword ? 'text' : 'password'}
          className={`w-full pl-4 pr-12 py-3 bg-white border-2 rounded-xl text-sm font-semibold text-text placeholder-text-muted transition-all outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/10 ${
            error ? 'border-accent-orange' : 'border-card-border'
          }`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-text-muted hover:text-secondary uppercase select-none cursor-pointer"
        >
          {showPassword ? 'Hide' : 'Show'}
        </button>
      </div>
      {error && (
        <span className="text-xs font-bold text-accent-orange block mt-0.5">
          {error}
        </span>
      )}
    </div>
  );
}
