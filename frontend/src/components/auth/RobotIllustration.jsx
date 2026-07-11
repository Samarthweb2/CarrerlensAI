import React from 'react';
import { motion } from 'framer-motion';

export default function RobotIllustration({ activeField, status }) {
  const isEmailActive = activeField === 'email';
  const isPasswordActive = activeField === 'password';
  const isSuccess = status === 'success';
  const isError = status === 'error';
  const isForgot = status === 'forgot';
  const isVerify = status === 'verify';

  console.log('Mascot activeField:', activeField, 'status:', status);

  // Mascot dynamic facial values
  let eyeOffset = isEmailActive ? 4 : 0; // shift eyes right toward form
  let faceColor = "#7C5CFF";
  let blushOpacity = 0.5;
  let smilePath = "M 76 76 Q 90 85 104 76"; // standard smile

  // Confused/Error state face
  if (isError) {
    smilePath = "M 78 78 Q 90 68 102 78"; // frown
    faceColor = "#FF8A50";
    blushOpacity = 0.2;
  } else if (isSuccess) {
    smilePath = "M 74 72 Q 90 92 106 72 Z"; // big laughing mouth
  }

  // Arms position
  let leftArmD = "M 30 100 Q 12 112 18 126";
  let rightArmD = "M 150 100 Q 170 80 162 60"; // default waving hand
  
  if (isPasswordActive) {
    // Cover eyes with hands
    leftArmD = "M 30 100 Q 42 75 70 58";
    rightArmD = "M 150 100 Q 138 75 110 58";
  } else if (isSuccess) {
    // Celebrating hands up
    leftArmD = "M 30 100 Q 10 75 22 55";
    rightArmD = "M 150 100 Q 170 75 158 55";
  } else if (isForgot || isVerify) {
    // Hold letter envelope in front of chest
    rightArmD = "M 150 100 Q 125 110 115 118";
  }

  return (
    <div className="relative w-full max-w-lg flex flex-col items-center select-none gap-8">
      
      {/* Background Soft Blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
        <motion.div
          animate={{
            scale: [1, 1.12, 0.95, 1],
            rotate: [0, 30, -30, 0],
            x: isEmailActive ? 15 : [-5, 5, -5],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-72 h-72 rounded-full bg-primary/15 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 0.92, 1.06, 1],
            rotate: [0, -45, 45, 0],
          }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute w-64 h-64 rounded-full bg-secondary/10 blur-3xl"
        />
      </div>

      {/* Reacting Mascot Card Area */}
      <div className="relative flex justify-center items-center w-full min-h-[220px]">
        {/* Confetti particles on success */}
        {isSuccess && (
          <div className="absolute inset-0 pointer-events-none z-20">
            {[...Array(6)].map((_, i) => (
              <motion.span
                key={i}
                initial={{ y: 80, opacity: 1 }}
                animate={{ y: -50, x: (i % 2 === 0 ? 40 : -40) * (i * 0.2 + 1), scale: [0.5, 1.2, 0], opacity: [1, 1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
                className="absolute text-lg"
                style={{ left: `${30 + (i % 3) * 20}%` }}
              >
                {['🎉', '✨', '⭐', '🎈'][i % 4]}
              </motion.span>
            ))}
          </div>
        )}

        <motion.svg
          viewBox="0 0 400 240"
          fill="none"
          className="w-[360px] h-[216px] relative z-10"
          animate={isSuccess ? { y: [0, -12, 0] } : {}}
          transition={isSuccess ? { duration: 0.5, repeat: Infinity, ease: "easeInOut" } : {}}
        >
          {/* Shadow */}
          <ellipse cx="200" cy="215" rx="55" ry="6" fill="#E8D5B0" opacity="0.4"/>

          {/* Sparkles */}
          <motion.g
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <path d="M70 40L72 43L75 44L72 45L70 48L68 45L65 44L68 43Z" fill="#FFD54F"/>
            <path d="M330 60L332 63L335 64L332 65L330 68L328 65L325 64L328 63Z" fill="#7C5CFF"/>
          </motion.g>

          {/* Robot Mascot Body Group */}
          <g transform="translate(110, 20)">
            
            {/* Left Arm */}
            <motion.path
              d={leftArmD}
              animate={{ d: leftArmD }}
              transition={{ duration: 0.2 }}
              stroke={faceColor}
              strokeWidth="7"
              strokeLinecap="round"
            />

            {/* Right Arm */}
            <motion.path
              d={rightArmD}
              animate={{ d: rightArmD }}
              transition={{ duration: 0.2 }}
              stroke={faceColor}
              strokeWidth="7"
              strokeLinecap="round"
            />

            {/* Robot Head Group */}
            <motion.g
              animate={isSuccess ? { rotate: [-2, 2, -2] } : { y: [0, -3, 0], rotate: [-1.2, 1.2, -1.2] }}
              transition={{ repeat: Infinity, duration: isSuccess ? 0.6 : 3.5, ease: "easeInOut" }}
              style={{ transformOrigin: "90px 90px" }}
            >
              {/* Antenna */}
              <line x1="90" y1="28" x2="90" y2="15" stroke={faceColor} strokeWidth="3" strokeLinecap="round"/>
              <circle cx="90" cy="11" r="4.5" fill="#FFD54F" stroke="#1F1F1F" strokeWidth="2"/>

              {/* Head Box */}
              <rect x="44" y="28" width="92" height="74" rx="18" fill={faceColor} stroke="#1F1F1F" strokeWidth="2.5"/>
              <rect x="50" y="34" width="80" height="62" rx="14" fill="white"/>

              {/* Eyes with blink and look-offset */}
              {isSuccess ? (
                <>
                  <path d="M 64 56 Q 72 46 80 56" stroke="#1F1F1F" strokeWidth="4" strokeLinecap="round" fill="none"/>
                  <path d="M 100 56 Q 108 46 116 56" stroke="#1F1F1F" strokeWidth="4" strokeLinecap="round" fill="none"/>
                </>
              ) : isError ? (
                <>
                  <circle cx="73" cy="56" r="7.5" fill="#1F1F1F"/>
                  <circle cx="107" cy="56" r="7.5" fill="#1F1F1F"/>
                  <path d="M 66 45 Q 73 50 80 47" stroke="#1F1F1F" strokeWidth="3" strokeLinecap="round" fill="none"/>
                  <path d="M 100 47 Q 107 50 114 45" stroke="#1F1F1F" strokeWidth="3" strokeLinecap="round" fill="none"/>
                </>
              ) : (
                <>
                  <g className="robot-eye">
                    <circle cx={73 + eyeOffset} cy="56" r="7.5" fill="#1F1F1F"/>
                    <circle cx={75.5 + eyeOffset} cy="53.5" r="2.5" fill="white"/>
                  </g>
                  <g className="robot-eye-delayed">
                    <circle cx={107 + eyeOffset} cy="56" r="7.5" fill="#1F1F1F"/>
                    <circle cx={109.5 + eyeOffset} cy="53.5" r="2.5" fill="white"/>
                  </g>
                </>
              )}

              {/* Mouth */}
              <path d={smilePath} stroke="#1F1F1F" strokeWidth="3" strokeLinecap="round" fill={isSuccess ? "#FF8A50" : "none"}/>
              
              {/* Blush */}
              <ellipse cx="61" cy="68" rx="5" ry="3.5" fill="#FFB4B4" opacity={blushOpacity}/>
              <ellipse cx="119" cy="68" rx="5" ry="3.5" fill="#FFB4B4" opacity={blushOpacity}/>
            </motion.g>

            {/* Torso */}
            <rect x="60" y="100" width="60" height="42" rx="12" fill={faceColor} stroke="#1F1F1F" strokeWidth="2.5"/>
            <rect x="68" y="108" width="44" height="26" rx="6" fill="#FFF9ED" stroke="#E6DCC3" strokeWidth="1"/>

            {/* Forgot Mail overlay in hands */}
            {(isForgot || isVerify) && (
              <motion.g
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transform="translate(65, 110)"
              >
                <rect width="30" height="20" rx="3" fill="white" stroke="#1F1F1F" strokeWidth="2"/>
                <path d="M0 2 L15 11 L30 2" stroke="#1F1F1F" strokeWidth="2" strokeLinejoin="round"/>
              </motion.g>
            )}

            {/* Legs */}
            <rect x="69" y="142" width="11" height="15" rx="3.5" fill="#FFD54F" stroke="#1F1F1F" strokeWidth="2"/>
            <rect x="100" y="142" width="11" height="15" rx="3.5" fill="#FFD54F" stroke="#1F1F1F" strokeWidth="2"/>
          </g>

        </motion.svg>
      </div>

      {/* STORYLINE BOARD: Resume -> Robot Scans -> ATS -> Job Match -> Dashboard */}
      <div className="w-full bg-white border-3 border-text p-6 rounded-3xl shadow-[5px_5px_0px_#1F1F1F] flex flex-col gap-4 text-left">
        <span className="text-[11px] font-black text-secondary uppercase tracking-wider block">How CareerLensAI Works</span>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs font-bold text-text relative select-none">
          
          {/* Step 1: Resume */}
          <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 border-card-border bg-cream-dark/20">
            <span className="text-base shrink-0">📄</span>
            <div>
              <p className="font-extrabold text-[13px]">1. Resume</p>
              <p className="text-[10px] text-text-light font-semibold">Drop PDF/Word</p>
            </div>
          </div>

          <span className="hidden sm:inline text-text-muted font-black text-lg">➔</span>

          {/* Step 2: ATS Check */}
          <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 border-card-border bg-cream-dark/20">
            <span className="text-base shrink-0">🤖</span>
            <div>
              <p className="font-extrabold text-[13px]">2. AI Scan</p>
              <p className="text-[10px] text-text-light font-semibold">Checks ATS rules</p>
            </div>
          </div>

          <span className="hidden sm:inline text-text-muted font-black text-lg">➔</span>

          {/* Step 3: Match */}
          <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 border-card-border bg-cream-dark/20">
            <span className="text-base shrink-0">🎯</span>
            <div>
              <p className="font-extrabold text-[13px]">3. Dashboard</p>
              <p className="text-[10px] text-text-light font-semibold">Jobs & roadmaps</p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
