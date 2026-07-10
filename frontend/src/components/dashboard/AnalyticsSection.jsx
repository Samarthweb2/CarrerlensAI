import React from 'react';
import { motion } from 'framer-motion';

export default function AnalyticsSection({ historyData = [] }) {
  // Line chart coordinates mapping
  // Let's draw an SVG line chart
  const width = 280;
  const height = 120;
  const padding = 20;

  // Map scores to chart points
  const points = historyData.map((d, index) => {
    const x = padding + (index / (historyData.length - 1)) * (width - 2 * padding);
    const y = height - padding - (d.score / 100) * (height - 2 * padding);
    return { x, y, label: d.label, score: d.score };
  });

  // SVG path construction
  const pathD = points.reduce((acc, p, index) => {
    return index === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, "");

  return (
    <div className="bg-white border-3 border-text p-6 sm:p-8 rounded-3xl shadow-[6px_6px_0px_#1F1F1F] select-none text-left w-full grid grid-cols-1 md:grid-cols-2 gap-6">
      
      {/* Chart 1: Resume Improvement Progress */}
      <div className="flex flex-col gap-3 w-full">
        <h3 className="text-sm font-black text-text uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <span>📈</span> Resume Improvement
        </h3>
        <p className="text-[11px] font-bold text-text-light mb-2">
          Weekly scan analytics progress tracking.
        </p>

        {/* SVG Chart */}
        <div className="border-2 border-card-border p-3 rounded-2xl bg-cream/10 relative flex justify-center">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-[280px]">
            {/* Grid line divisions */}
            <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#1F1F1F" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.15" />
            <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="#1F1F1F" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.15" />
            <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#1F1F1F" strokeWidth="1" opacity="0.3" />

            {/* Glowing path */}
            {pathD && (
              <motion.path
                d={pathD}
                fill="none"
                stroke="#7C5CFF"
                strokeWidth="3.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
            )}

            {/* Dots */}
            {points.map((p, i) => (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r="5" fill="#FFD54F" stroke="#1F1F1F" strokeWidth="2" />
                <text x={p.x} y={p.y - 8} textAnchor="middle" fontSize="9" fontWeight="900" fill="#1F1F1F">
                  {p.score}%
                </text>
                <text x={p.x} y={height - 4} textAnchor="middle" fontSize="8" fontWeight="bold" fill="#7A7A7A">
                  {p.label}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* Chart 2: Skill Distribution & Readiness */}
      <div className="flex flex-col gap-3 w-full justify-between">
        <div>
          <h3 className="text-sm font-black text-text uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <span>🎯</span> Application Readiness
          </h3>
          <p className="text-[11px] font-bold text-text-light mb-4">
            How prepared is your resume for core target requirements.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {/* Readiness factor 1 */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-[10px] font-black text-text uppercase">
              <span>ATS Compliance</span>
              <span>91%</span>
            </div>
            <div className="w-full h-3 bg-cream border border-text rounded-full overflow-hidden">
              <div className="h-full bg-accent-green" style={{ width: '91%' }} />
            </div>
          </div>

          {/* Readiness factor 2 */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-[10px] font-black text-text uppercase">
              <span>Keyword Density match</span>
              <span>82%</span>
            </div>
            <div className="w-full h-3 bg-cream border border-text rounded-full overflow-hidden">
              <div className="h-full bg-secondary" style={{ width: '82%' }} />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
