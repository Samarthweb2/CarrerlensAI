import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function JobRecommendations({ jobs = [] }) {
  const [savedJobs, setSavedJobs] = useState([]);

  const toggleSave = (company) => {
    setSavedJobs(prev =>
      prev.includes(company)
        ? prev.filter(c => c !== company)
        : [...prev, company]
    );
  };

  return (
    <div className="bg-white border-3 border-text p-6 sm:p-8 rounded-3xl shadow-[6px_6px_0px_#1F1F1F] select-none text-left w-full">
      <h3 className="text-sm font-black text-text uppercase tracking-wider mb-2 flex items-center gap-2">
        <span>💼</span> Recommended Career Matches ({jobs.length})
      </h3>
      <p className="text-xs font-bold text-text-light mb-6">
        Based on detected skill matches, we found these openings tailored for your profile.
      </p>

      {/* Horizontal scrolling wrapper */}
      <div className="w-full overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-[720px] px-2">
          {jobs.map((job) => {
            const isSaved = savedJobs.includes(job.company);

            return (
              <motion.div
                key={job.company}
                whileHover={{ y: -3 }}
                className="w-64 bg-cream/10 border-2.5 border-text p-5 rounded-2xl flex flex-col justify-between shadow-[3px_3px_0px_#1F1F1F] shrink-0"
              >
                <div>
                  {/* Card Header: Logo & Save button */}
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="w-10 h-10 rounded-xl border-2 border-text flex items-center justify-center font-black text-base text-white shadow-[2px_2px_0px_#1F1F1F]"
                      style={{ backgroundColor: job.color }}
                    >
                      {job.logo}
                    </div>

                    <button
                      onClick={() => toggleSave(job.company)}
                      className={`w-8 h-8 rounded-lg border-2 border-card-border flex items-center justify-center text-xs transition-colors cursor-pointer ${
                        isSaved ? 'bg-primary border-text text-text' : 'bg-white hover:border-text text-text-muted'
                      }`}
                    >
                      {isSaved ? '★' : '☆'}
                    </button>
                  </div>

                  {/* Role Title */}
                  <h4 className="text-sm font-black text-text leading-snug truncate">
                    {job.role}
                  </h4>
                  <p className="text-xs font-bold text-text-light mb-3">
                    {job.company}
                  </p>

                  {/* Matching score badge */}
                  <div className="flex items-center gap-1.5 mb-4">
                    <span className="bg-accent-green/10 border border-accent-green/30 text-accent-green px-2 py-0.5 rounded text-[10px] font-black">
                      {job.match}% Match
                    </span>
                    <span className="text-[10px] font-bold text-text-light">{job.location}</span>
                  </div>
                </div>

                {/* Salary details & apply */}
                <div className="border-t border-card-border/60 pt-3.5 mt-2 flex flex-col gap-2">
                  <div className="flex items-center justify-between text-[11px] font-black text-text">
                    <span>Est. Salary</span>
                    <span className="text-secondary">{job.salary}</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => alert(`Redirecting application process for ${job.company}...`)}
                      className="flex-1 px-3 py-1.5 bg-primary hover:bg-[#FFD54F] border-2 border-text text-[11px] font-black rounded-lg text-text shadow-[2px_2px_0px_#1F1F1F] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer text-center"
                    >
                      Apply Now
                    </button>
                    <button
                      onClick={() => alert(`Opening detail overlays for ${job.role}...`)}
                      className="px-2 py-1.5 bg-white border-2 border-card-border hover:border-text text-[10px] font-bold rounded-lg text-text-muted hover:text-text cursor-pointer transition-colors"
                    >
                      Details
                    </button>
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
