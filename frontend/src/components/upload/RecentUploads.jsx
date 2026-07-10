import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RecentUploads({ onReanalyze, recentUploads = [] }) {

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="w-full bg-white border-3 border-text p-6 sm:p-8 rounded-3xl shadow-[6px_6px_0px_#1F1F1F]"
    >
      <h3 className="text-lg font-black text-text mb-1 flex items-center gap-2 select-none">
        <span>📄</span> Recent Uploads
      </h3>
      <p className="text-xs font-bold text-text-light mb-6 select-none">
        Your resume uploads from this session.
      </p>

      {recentUploads.length === 0 ? (
        <div className="py-8 text-center text-text-muted font-bold text-sm select-none">
          No previous uploads found. Start by dropping a file above!
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <AnimatePresence>
            {recentUploads.map(item => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-2 border-card-border p-4 rounded-2xl hover:border-secondary hover:bg-secondary/5 transition-all select-none gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center text-lg select-none">
                    📄
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-text truncate max-w-[180px] sm:max-w-[240px]">
                      {item.name}
                    </h4>
                    <p className="text-[11px] font-bold text-text-light">
                      {item.date} {item.size ? `• ${item.size}` : ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  {item.analysisId && (
                    <button
                      onClick={() => onReanalyze(item.analysisId)}
                      className="px-3 py-1.5 bg-primary/20 hover:bg-primary border-2 border-primary/30 hover:border-text text-[11px] font-black rounded-lg text-text transition-all cursor-pointer active:scale-95"
                    >
                      View Dashboard
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
