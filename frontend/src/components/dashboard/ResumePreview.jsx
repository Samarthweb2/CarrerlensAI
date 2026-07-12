import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ResumePreview({ fileName = "Resume.pdf", parsedResume = null }) {
  const [activeWeakness, setActiveWeakness] = useState(null);

  const weaknesses = [
    {
      id: 'summary',
      title: 'Vague Professional Summary',
      desc: 'Summary contains excessive buzzwords ("motivated", "self-starter") without specifying metrics. Rewrite to focus on statistical results.',
      top: '22%'
    },
    {
      id: 'experience',
      title: 'Lacks Quantifiable Impact',
      desc: 'This project description lists duties instead of accomplishments. Add measurable achievements (e.g. "reduced latency by 20%").',
      top: '52%'
    }
  ];

  // Destructure parsedResume with dynamic fallbacks
  const {
    name = "Candidate Name",
    email = "email@example.com",
    phone = "",
    links = {},
    education = [],
    experience = [],
    projects = [],
    skills = [],
    certifications = []
  } = parsedResume || {};

  const contactInfo = [
    email,
    phone,
    links.linkedin ? `LinkedIn: ${links.linkedin}` : '',
    links.github ? `GitHub: ${links.github}` : ''
  ].filter(Boolean).join(' • ');

  return (
    <div className="bg-white border-3 border-text p-6 sm:p-8 rounded-3xl shadow-[6px_6px_0px_#1F1F1F] select-none text-left w-full flex flex-col h-full min-h-[500px]">
      
      {/* Title */}
      <div className="flex items-center justify-between border-b border-card-border/60 pb-4 mb-4">
        <div>
          <h3 className="text-sm font-black text-text uppercase tracking-wider">Resume Preview</h3>
          <p className="text-[10px] font-bold text-text-light">{fileName}</p>
        </div>
        <span className="bg-accent-orange/15 border border-accent-orange/30 text-accent-orange text-[9px] font-black px-2 py-0.5 rounded">
          ⚠️ 2 Areas of Improvement
        </span>
      </div>

      {/* Preview paper body */}
      <div className="flex-1 border-2 border-card-border bg-cream/10 rounded-2xl p-6 relative overflow-y-auto max-h-[460px] font-sans text-[11px] leading-relaxed shadow-inner">
        
        {/* Contact Info Header */}
        <div className="text-center mb-6">
          <h4 className="text-sm font-extrabold text-text">{name}</h4>
          <p className="text-text-muted text-[10px] font-bold">{contactInfo}</p>
        </div>

        {/* Summary block with weakness trigger */}
        <div
          className="mb-6 cursor-pointer relative group border-2 border-transparent hover:border-accent-orange/40 hover:bg-accent-orange/5 p-1.5 rounded transition-all"
          onClick={() => setActiveWeakness('summary')}
        >
          {/* Weakness highlights stripe */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent-orange rounded" />
          <h5 className="font-extrabold text-text uppercase tracking-wider mb-1 text-[10px]">Professional Summary</h5>
          <p className="text-text-muted">
            Motivated professional with strong skills in {skills.slice(0, 5).join(', ')}. Detail-oriented team worker who thrives in fast-paced software development and technology environments.
          </p>
        </div>

        {/* Education block */}
        {education.length > 0 && (
          <div className="mb-6">
            <h5 className="font-extrabold text-text uppercase tracking-wider mb-1.5 text-[10px]">Education</h5>
            <ul className="list-disc pl-4 text-text-muted flex flex-col gap-1">
              {education.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Experience block with weakness trigger */}
        {(experience.length > 0 || projects.length > 0) && (
          <div
            className="mb-6 cursor-pointer relative group border-2 border-transparent hover:border-accent-orange/40 hover:bg-accent-orange/5 p-1.5 rounded transition-all"
            onClick={() => setActiveWeakness('experience')}
          >
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent-orange rounded" />
            <h5 className="font-extrabold text-text uppercase tracking-wider mb-1.5 text-[10px]">Projects & Experience</h5>
            
            <div className="mb-2">
              <ul className="list-disc pl-4 text-text-muted flex flex-col gap-1">
                {experience.slice(0, 4).map((item, idx) => (
                  <li key={`exp-${idx}`}>{item}</li>
                ))}
                {projects.slice(0, 4).map((item, idx) => (
                  <li key={`proj-${idx}`}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Skills block */}
        {skills.length > 0 && (
          <div className="mb-4">
            <h5 className="font-extrabold text-text uppercase tracking-wider mb-1 text-[10px]">Skills</h5>
            <p className="text-text-muted">
              {skills.join(', ')}
            </p>
          </div>
        )}

        {/* Certifications block */}
        {certifications.length > 0 && (
          <div className="mb-4">
            <h5 className="font-extrabold text-text uppercase tracking-wider mb-1.5 text-[10px]">Certifications</h5>
            <ul className="list-disc pl-4 text-text-muted flex flex-col gap-1">
              {certifications.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Active Weakness details balloon overlay */}
        <AnimatePresence>
          {activeWeakness && (
            <>
              <div className="absolute inset-0 bg-text/5 z-20 rounded-2xl" onClick={() => setActiveWeakness(null)} />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="absolute left-4 right-4 z-30 bg-white border-3 border-text p-4 rounded-xl shadow-[4px_4px_0px_#1F1F1F]"
                style={{ top: weaknesses.find(w => w.id === activeWeakness)?.top || '30%' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-accent-orange/20 border border-accent-orange/40 text-accent-orange text-[9px] font-black px-2 py-0.5 rounded">
                    Weakness Identified
                  </span>
                  <button
                    onClick={() => setActiveWeakness(null)}
                    className="text-text-muted hover:text-text font-black text-xs cursor-pointer select-none"
                  >
                    ✕
                  </button>
                </div>
                <h4 className="text-xs font-black text-text mb-1">
                  {weaknesses.find(w => w.id === activeWeakness)?.title}
                </h4>
                <p className="text-[10px] font-bold text-text-light leading-relaxed">
                  {weaknesses.find(w => w.id === activeWeakness)?.desc}
                </p>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4 text-center">
        <p className="text-[10px] font-bold text-text-muted">
          💡 Click highlighted sections to explore weakness explanations.
        </p>
      </div>

    </div>
  );
}
