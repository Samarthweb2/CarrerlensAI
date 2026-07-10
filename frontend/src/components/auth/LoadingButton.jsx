import React from 'react';
import { motion } from 'framer-motion';

export default function LoadingButton({ children, loading, className = '', ...props }) {
  return (
    <motion.button
      whileHover={loading ? {} : { y: -2, scale: 1.01 }}
      whileTap={loading ? {} : { scale: 0.98 }}
      disabled={loading}
      className={`w-full py-3.5 bg-[#FFD54F] hover:bg-[#ffcd29] disabled:bg-gray-200 border-2 border-text text-text font-black text-sm sm:text-base rounded-xl transition-all shadow-[4px_4px_0px_#1F1F1F] active:shadow-[0px_0px_0px_#1F1F1F] active:translate-x-[4px] active:translate-y-[4px] disabled:shadow-none disabled:translate-y-0 disabled:border-card-border disabled:text-text-muted flex items-center justify-center gap-2 cursor-pointer ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin h-5 w-5 text-current" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Processing...</span>
        </>
      ) : (
        children
      )}
    </motion.button>
  );
}
