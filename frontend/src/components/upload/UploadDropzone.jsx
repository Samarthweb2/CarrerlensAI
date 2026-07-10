import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

export default function UploadDropzone({ onUploadStart, onError }) {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const validateAndProcessFile = (file) => {
    if (!file) return;

    // Check size limit: 5MB
    const maxSizeBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      onError("Oops! This file is too large. Please upload a resume under 5 MB.");
      return;
    }

    // Check file extension/mime type (PDF or DOCX)
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];
    const fileNameLower = file.name.toLowerCase();
    const isAllowedExt = fileNameLower.endsWith('.pdf') || fileNameLower.endsWith('.docx') || fileNameLower.endsWith('.doc');

    if (!allowedTypes.includes(file.type) && !isAllowedExt) {
      onError("Oops! Looks like this isn't a resume. Please upload a PDF or DOCX file.");
      return;
    }

    onUploadStart(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".pdf,.docx,.doc"
        onChange={handleChange}
      />

      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
        className={`w-full relative border-3 border-dashed rounded-3xl p-8 sm:p-12 flex flex-col items-center justify-center text-center cursor-pointer select-none transition-all duration-300 group ${
          isDragActive
            ? 'border-primary bg-primary/5 shadow-[0_0_25px_rgba(255,213,79,0.25)]'
            : 'border-card-border hover:border-secondary hover:bg-secondary/5 hover:shadow-[0_0_20px_rgba(124,92,255,0.08)]'
        }`}
      >
        {/* Decorative sparkles on drag */}
        {isDragActive && (
          <>
            <motion.span animate={{ scale: [1, 1.4, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="absolute top-8 left-12 text-2xl">✨</motion.span>
            <motion.span animate={{ scale: [1, 1.4, 1] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.3 }} className="absolute bottom-8 right-12 text-2xl">⭐</motion.span>
            <motion.span animate={{ scale: [1, 1.4, 1] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.6 }} className="absolute top-1/2 right-8 text-xl">✨</motion.span>
          </>
        )}

        {/* Mascot + Resume Illustration */}
        <div className="w-48 h-40 relative mb-6 flex justify-center items-center">
          
          {/* Sparkles backdrop */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
            className="absolute inset-0 opacity-20 text-text-muted select-none pointer-events-none flex items-center justify-center text-8xl"
          >
            ✺
          </motion.div>

          {/* Cute scan/cloud icon floating */}
          <motion.div
            animate={{ y: isDragActive ? -25 : [0, -6, 0] }}
            transition={isDragActive ? { duration: 0.3 } : { duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="z-10"
          >
            <svg viewBox="0 0 160 160" className="w-36 h-36">
              {/* Cloud back */}
              <path d="M 40 100 Q 20 100 25 80 Q 25 60 50 60 Q 60 40 85 45 Q 110 40 120 60 Q 140 60 135 80 Q 135 100 115 100 Z" fill="#FFF9ED" stroke="#1F1F1F" strokeWidth="2.5" />
              
              {/* Smiling Robot in cloud */}
              <g transform="translate(45, 45)">
                {/* Robot Head */}
                <rect x="15" y="10" width="40" height="30" rx="8" fill="#7C5CFF" stroke="#1F1F1F" strokeWidth="2" />
                <rect x="18" y="13" width="34" height="24" rx="6" fill="white" />
                
                {/* Eyes */}
                <circle cx="28" cy="22" r="3" fill="#1F1F1F" />
                <circle cx="42" cy="22" r="3" fill="#1F1F1F" />
                {/* Smile */}
                <path d="M 31 27 Q 35 31 39 27" stroke="#1F1F1F" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                
                {/* Antenna */}
                <line x1="35" y1="10" x2="35" y2="4" stroke="#7C5CFF" strokeWidth="2" />
                <circle cx="35" cy="2" r="2" fill="#FFD54F" />

                {/* Blush */}
                <circle cx="22" cy="25" r="2" fill="#FFB4B4" />
                <circle cx="48" cy="25" r="2" fill="#FFB4B4" />
              </g>

              {/* Upload arrow floating dynamically */}
              <g transform="translate(68, 85)">
                <rect x="4" y="12" width="16" height="5" rx="1.5" fill="#FFD54F" stroke="#1F1F1F" strokeWidth="2" />
                <path d="M12 0 L6 8 L18 8 Z" fill="#FF8A50" stroke="#1F1F1F" strokeWidth="2" strokeLinejoin="round" />
              </g>
            </svg>
          </motion.div>

          {/* Paper airplane floating behind cloud */}
          <motion.span
            animate={{
              x: isDragActive ? 50 : [-20, 20, -20],
              y: isDragActive ? -40 : [-10, 10, -10],
              rotate: [10, -10, 10]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-2 right-4 text-2xl"
          >
            🚀
          </motion.span>
        </div>

        {/* Heading */}
        <h3 className="text-lg sm:text-xl font-black text-text mb-2 select-none group-hover:text-secondary transition-colors">
          {isDragActive ? "Catching Your Resume! 🤖" : "Drag & Drop Your Resume"}
        </h3>
        
        {/* Subtitle */}
        <p className="text-xs sm:text-sm font-bold text-text-light mb-8 select-none">
          PDF, DOCX up to 5 MB
        </p>

        {/* CTA Buttons */}
          <button
            type="button"
            className="px-6 py-3.5 bg-primary border-3 border-text text-sm font-black rounded-2xl shadow-[4px_4px_0px_#1F1F1F] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-text cursor-pointer select-none active:scale-95"
            onClick={(e) => {
              e.stopPropagation();
              onButtonClick();
            }}
          >
            Browse Files
          </button>
      </div>
    </motion.div>
  );
}
