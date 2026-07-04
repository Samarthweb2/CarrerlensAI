import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  Upload,
  ArrowRight,
  FileText,
  Brain,
  Target,
  Briefcase,
  Search,
  BarChart3,
  Map,
  Star,
  Menu,
  X,
  Play,
  ChevronRight,
  Sparkles,
  Rocket
} from 'lucide-react';

/* ═══════════════════════════════════════════════════
   INLINE SVG COMPONENTS — Cartoon Illustrations
   ═══════════════════════════════════════════════════ */

// Cute AI Robot Mascot — Now with CSS animation classes for blink + breathe
const RobotMascot = ({ className = '' }) => (
  <svg viewBox="0 0 280 320" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Antenna */}
    <line x1="140" y1="50" x2="140" y2="20" stroke="#7C5CFF" strokeWidth="4" strokeLinecap="round"/>
    <circle cx="140" cy="14" r="10" fill="#FFD54F" stroke="#E6BE3D" strokeWidth="2"/>
    <circle cx="140" cy="14" r="4" fill="#FFF9ED"/>

    {/* Body shadow */}
    <ellipse cx="140" cy="295" rx="80" ry="12" fill="#E8D5B0" opacity="0.5"/>

    {/* Robot Body — wrapped in breathing group */}
    <g className="robot-body-breathe">
      <rect x="80" y="170" width="120" height="110" rx="24" fill="#7C5CFF"/>
      <rect x="90" y="180" width="100" height="90" rx="16" fill="#9B85FF" opacity="0.4"/>

      {/* Belly circle */}
      <circle cx="140" cy="225" r="20" fill="white" opacity="0.3"/>
      <circle cx="140" cy="225" r="12" fill="#FFD54F"/>
    </g>

    {/* Robot Head */}
    <rect x="60" y="50" width="160" height="130" rx="32" fill="#7C5CFF"/>
    <rect x="70" y="58" width="140" height="114" rx="26" fill="white"/>

    {/* Left Eye — with blink */}
    <g className="robot-eye">
      <circle cx="110" cy="105" r="18" fill="#1F1F1F"/>
      <circle cx="116" cy="98" r="6" fill="white"/>
      <circle cx="112" cy="102" r="3" fill="white" opacity="0.6"/>
    </g>

    {/* Right Eye — with blink (slightly delayed) */}
    <g className="robot-eye-delayed">
      <circle cx="170" cy="105" r="18" fill="#1F1F1F"/>
      <circle cx="176" cy="98" r="6" fill="white"/>
      <circle cx="172" cy="102" r="3" fill="white" opacity="0.6"/>
    </g>

    {/* Cute blush cheeks */}
    <ellipse cx="85" cy="125" rx="12" ry="8" fill="#FFB4B4" opacity="0.5"/>
    <ellipse cx="195" cy="125" rx="12" ry="8" fill="#FFB4B4" opacity="0.5"/>

    {/* Smile */}
    <path d="M115 135 Q140 155 165 135" stroke="#1F1F1F" strokeWidth="4" strokeLinecap="round" fill="none"/>

    {/* Ears */}
    <rect x="40" y="85" width="24" height="40" rx="12" fill="#FFD54F" stroke="#E6BE3D" strokeWidth="2"/>
    <rect x="216" y="85" width="24" height="40" rx="12" fill="#FFD54F" stroke="#E6BE3D" strokeWidth="2"/>

    {/* Arms */}
    <rect x="42" y="190" width="38" height="16" rx="8" fill="#7C5CFF"/>
    <circle cx="42" cy="198" r="12" fill="#FFD54F" stroke="#E6BE3D" strokeWidth="2"/>
    <rect x="200" y="190" width="38" height="16" rx="8" fill="#7C5CFF"/>
    <circle cx="238" cy="198" r="12" fill="#FFD54F" stroke="#E6BE3D" strokeWidth="2"/>

    {/* Legs */}
    <rect x="105" y="275" width="24" height="20" rx="8" fill="#7C5CFF"/>
    <rect x="151" y="275" width="24" height="20" rx="8" fill="#7C5CFF"/>
    <rect x="100" y="288" width="34" height="14" rx="7" fill="#FFD54F"/>
    <rect x="146" y="288" width="34" height="14" rx="7" fill="#FFD54F"/>

    {/* Resume the robot is holding (right hand) */}
    <g transform="rotate(-8, 248, 180)">
      <rect x="230" y="155" width="50" height="65" rx="6" fill="white" stroke="#E5E7EB" strokeWidth="2"/>
      <line x1="240" y1="170" x2="270" y2="170" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round"/>
      <line x1="240" y1="178" x2="265" y2="178" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round"/>
      <line x1="240" y1="186" x2="260" y2="186" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round"/>
      <line x1="240" y1="194" x2="268" y2="194" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="255" cy="207" r="6" fill="#4CAF50" opacity="0.3"/>
      <path d="M252 207 l3 3 l5 -5" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
  </svg>
);

// Speech Bubble — improved with better shadow class and natural tail
const SpeechBubble = ({ className = '' }) => (
  <div className={`relative ${className}`}>
    <div className="speech-bubble bg-white rounded-2xl px-5 py-3.5 border-2 border-gray-100/80">
      <p className="text-[13.5px] font-extrabold text-text leading-snug">
        Hey! Let's make your<br />resume awesome! 🎉
      </p>
    </div>
    {/* Tail pointing naturally down-left toward robot */}
    <div className="absolute -bottom-[10px] left-10 w-5 h-5 bg-white border-b-2 border-r-2 border-gray-100/80 transform rotate-45" />
  </div>
);

// Floating Paper Airplane
const PaperAirplane = ({ className = '' }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className}>
    <path d="M6 24L42 8L26 42L22 28L6 24Z" fill="#87CEEB" stroke="#5BA3D9" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M22 28L42 8" stroke="#5BA3D9" strokeWidth="2"/>
  </svg>
);

// Floating Folder
const FloatingFolder = ({ className = '' }) => (
  <svg viewBox="0 0 56 48" fill="none" className={className}>
    <path d="M4 14C4 10.686 6.686 8 10 8H18L24 14H46C49.314 14 52 16.686 52 20V38C52 41.314 49.314 44 46 44H10C6.686 44 4 41.314 4 38V14Z" fill="#FFD54F" stroke="#E6BE3D" strokeWidth="2"/>
    <path d="M4 20H52" stroke="#E6BE3D" strokeWidth="2"/>
    <rect x="18" y="26" width="20" height="3" rx="1.5" fill="white" opacity="0.6"/>
    <rect x="22" y="32" width="12" height="3" rx="1.5" fill="white" opacity="0.4"/>
  </svg>
);

// Floating Document
const FloatingDocument = ({ className = '' }) => (
  <svg viewBox="0 0 40 48" fill="none" className={className}>
    <rect x="2" y="2" width="36" height="44" rx="6" fill="white" stroke="#E5E7EB" strokeWidth="2"/>
    <line x1="10" y1="14" x2="30" y2="14" stroke="#D1D5DB" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="10" y1="22" x2="26" y2="22" stroke="#D1D5DB" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="10" y1="30" x2="22" y2="30" stroke="#D1D5DB" strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="28" cy="36" r="5" fill="#4CAF50" opacity="0.25"/>
    <path d="M26 36 l2 2 l4 -4" stroke="#4CAF50" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Sparkle Star
const SparkleStarSVG = ({ className = '', color = '#FFD54F' }) => (
  <svg viewBox="0 0 32 32" fill="none" className={className}>
    <path d="M16 2L19.5 12.5L30 16L19.5 19.5L16 30L12.5 19.5L2 16L12.5 12.5L16 2Z" fill={color} stroke={color === '#FFD54F' ? '#E6BE3D' : color} strokeWidth="1"/>
  </svg>
);

// Tiny sparkle (smaller, 4-point)
const TinySparkle = ({ className = '', color = '#FFD54F' }) => (
  <svg viewBox="0 0 16 16" fill="none" className={className}>
    <path d="M8 1L9.5 6.5L15 8L9.5 9.5L8 15L6.5 9.5L1 8L6.5 6.5L8 1Z" fill={color} opacity="0.7"/>
  </svg>
);

// Small geometric doodle — curved arrow
const CurvedArrow = ({ className = '' }) => (
  <svg viewBox="0 0 40 40" fill="none" className={className}>
    <path d="M8 30 Q8 10 28 10" stroke="#FF8A50" strokeWidth="3" strokeLinecap="round" fill="none"/>
    <path d="M24 6L28 10L24 14" stroke="#FF8A50" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
);

// Small geometric circle doodle
const CircleDoodle = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="10" stroke="#7C5CFF" strokeWidth="2" strokeDasharray="4 3"/>
  </svg>
);

// Small triangle doodle
const TriangleDoodle = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 4L22 20H2L12 4Z" fill="#FFD54F" opacity="0.6" stroke="#E6BE3D" strokeWidth="1.5"/>
  </svg>
);

// Floating small circle dot
const FloatingDot = ({ className = '', color = '#7C5CFF' }) => (
  <svg viewBox="0 0 16 16" fill="none" className={className}>
    <circle cx="8" cy="8" r="6" fill={color} opacity="0.25"/>
    <circle cx="8" cy="8" r="3" fill={color} opacity="0.5"/>
  </svg>
);

/* ═══════════════════════════════════════════════════
   FEATURE CARD ILLUSTRATIONS — Playful Cartoon Style
   ═══════════════════════════════════════════════════ */

// 1. Happy smiling resume with face, green checkmark, sparkles
const ResumeAnalysisIllustration = () => (
  <svg viewBox="0 0 160 140" fill="none" className="w-full h-full">
    {/* Shadow */}
    <ellipse cx="80" cy="132" rx="40" ry="6" fill="#E8D5B0" opacity="0.4"/>
    {/* Main document body */}
    <g className="illust-wiggle">
      <rect x="35" y="12" width="80" height="105" rx="14" fill="white" stroke="#E5E7EB" strokeWidth="2.5"/>
      {/* Corner fold */}
      <path d="M95 12L115 32" stroke="#E5E7EB" strokeWidth="2"/>
      <path d="M95 12L95 32H115" fill="#F9F5EB" stroke="#E5E7EB" strokeWidth="2" strokeLinejoin="round"/>
      {/* Face — happy eyes */}
      <circle cx="62" cy="52" r="5" fill="#1F1F1F"/>
      <circle cx="88" cy="52" r="5" fill="#1F1F1F"/>
      <circle cx="64" cy="50" r="2" fill="white"/>
      <circle cx="90" cy="50" r="2" fill="white"/>
      {/* Blush */}
      <ellipse cx="54" cy="62" rx="6" ry="4" fill="#FFB4B4" opacity="0.5"/>
      <ellipse cx="96" cy="62" rx="6" ry="4" fill="#FFB4B4" opacity="0.5"/>
      {/* Smile */}
      <path d="M64 66 Q75 78 86 66" stroke="#1F1F1F" strokeWidth="3" strokeLinecap="round" fill="none"/>
      {/* Text lines */}
      <line x1="50" y1="88" x2="100" y2="88" stroke="#D1D5DB" strokeWidth="3" strokeLinecap="round"/>
      <line x1="50" y1="97" x2="90" y2="97" stroke="#D1D5DB" strokeWidth="3" strokeLinecap="round"/>
      <line x1="50" y1="106" x2="80" y2="106" stroke="#D1D5DB" strokeWidth="3" strokeLinecap="round"/>
    </g>
    {/* Green checkmark badge */}
    <circle cx="120" cy="95" r="14" fill="#4CAF50"/>
    <path d="M113 95 l5 5 l9 -9" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    {/* Sparkles */}
    <path d="M28 25L30 30L35 31L30 33L28 38L26 33L21 31L26 30Z" fill="#FFD54F" className="sparkle-twinkle"/>
    <path d="M130 20L131.5 24L136 25L131.5 27L130 31L128.5 27L124 25L128.5 24Z" fill="#7C5CFF" opacity="0.7" className="sparkle-twinkle-delayed"/>
    <path d="M25 80L26.5 83L30 84L26.5 85.5L25 89L23.5 85.5L20 84L23.5 83Z" fill="#FF8A50" opacity="0.6" className="sparkle-twinkle-slow"/>
  </svg>
);

// 2. Cute dashboard with pie chart, 92%, colorful bars, glasses character
const ATSScoreIllustration = () => (
  <svg viewBox="0 0 160 140" fill="none" className="w-full h-full">
    <ellipse cx="80" cy="132" rx="40" ry="6" fill="#E8D5B0" opacity="0.4"/>
    {/* Dashboard card */}
    <g className="illust-bounce">
      <rect x="20" y="15" width="110" height="100" rx="16" fill="white" stroke="#E5E7EB" strokeWidth="2.5"/>
      {/* Score circle */}
      <circle cx="75" cy="55" r="28" fill="none" stroke="#E8E8E8" strokeWidth="6"/>
      <circle cx="75" cy="55" r="28" fill="none" stroke="#4CAF50" strokeWidth="6" strokeDasharray="160" strokeDashoffset="13" strokeLinecap="round" transform="rotate(-90 75 55)"/>
      {/* Score text */}
      <text x="75" y="52" textAnchor="middle" fontSize="18" fontWeight="900" fill="#1F1F1F" fontFamily="Nunito">92</text>
      <text x="75" y="66" textAnchor="middle" fontSize="9" fontWeight="700" fill="#6B7280" fontFamily="Nunito">% Score</text>
      {/* Mini bars at bottom */}
      <rect x="34" y="95" width="14" height="12" rx="4" fill="#FFD54F"/>
      <rect x="53" y="89" width="14" height="18" rx="4" fill="#4CAF50"/>
      <rect x="72" y="92" width="14" height="15" rx="4" fill="#7C5CFF"/>
      <rect x="91" y="87" width="14" height="20" rx="4" fill="#FF8A50"/>
    </g>
    {/* Glasses character peeking */}
    <circle cx="138" cy="38" r="14" fill="#FFF5E0" stroke="#E6BE3D" strokeWidth="2"/>
    <circle cx="133" cy="36" r="4" fill="#1F1F1F"/>
    <circle cx="143" cy="36" r="4" fill="#1F1F1F"/>
    <circle cx="134" cy="35" r="1.5" fill="white"/>
    <circle cx="144" cy="35" r="1.5" fill="white"/>
    <path d="M133 43 Q138 47 143 43" stroke="#1F1F1F" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    {/* Glasses frames */}
    <circle cx="133" cy="36" r="6" fill="none" stroke="#7C5CFF" strokeWidth="1.5"/>
    <circle cx="143" cy="36" r="6" fill="none" stroke="#7C5CFF" strokeWidth="1.5"/>
    <line x1="139" y1="36" x2="137" y2="36" stroke="#7C5CFF" strokeWidth="1.5"/>
    {/* Sparkles */}
    <path d="M15 50L17 55L22 56L17 58L15 63L13 58L8 56L13 55Z" fill="#FFD54F" className="sparkle-twinkle"/>
    <circle cx="140" cy="20" r="3" fill="#4CAF50" opacity="0.4" className="sparkle-twinkle-delayed"/>
  </svg>
);

// 3. Funny pink brain with glasses, lightning bolts
const SkillGapIllustration = () => (
  <svg viewBox="0 0 160 140" fill="none" className="w-full h-full">
    <ellipse cx="80" cy="132" rx="35" ry="6" fill="#E8D5B0" opacity="0.4"/>
    <g className="illust-wiggle">
      {/* Brain body */}
      <ellipse cx="75" cy="65" rx="38" ry="35" fill="#FADADD"/>
      <path d="M75 30 Q95 28 100 42 Q112 42 112 55 Q118 60 112 72 Q112 85 100 87 Q95 100 75 100 Q55 100 50 87 Q38 85 38 72 Q32 60 38 55 Q38 42 50 42 Q55 28 75 30Z" fill="none" stroke="#E91E8E" strokeWidth="2.5" opacity="0.6"/>
      {/* Brain line */}
      <line x1="75" y1="38" x2="75" y2="92" stroke="#E91E8E" strokeWidth="2" opacity="0.3"/>
      {/* Brain wrinkles */}
      <path d="M55 52 Q65 48 75 55" stroke="#E91E8E" strokeWidth="1.5" opacity="0.3" fill="none"/>
      <path d="M75 55 Q85 48 95 52" stroke="#E91E8E" strokeWidth="1.5" opacity="0.3" fill="none"/>
      <path d="M50 72 Q60 68 70 75" stroke="#E91E8E" strokeWidth="1.5" opacity="0.3" fill="none"/>
      <path d="M80 75 Q90 68 100 72" stroke="#E91E8E" strokeWidth="1.5" opacity="0.3" fill="none"/>
      {/* Glasses */}
      <circle cx="63" cy="60" r="10" fill="none" stroke="#1F1F1F" strokeWidth="2.5"/>
      <circle cx="87" cy="60" r="10" fill="none" stroke="#1F1F1F" strokeWidth="2.5"/>
      <line x1="73" y1="60" x2="77" y2="60" stroke="#1F1F1F" strokeWidth="2.5"/>
      <line x1="53" y1="58" x2="45" y2="55" stroke="#1F1F1F" strokeWidth="2" strokeLinecap="round"/>
      <line x1="97" y1="58" x2="105" y2="55" stroke="#1F1F1F" strokeWidth="2" strokeLinecap="round"/>
      {/* Eyes behind glasses */}
      <circle cx="63" cy="59" r="3.5" fill="#1F1F1F"/>
      <circle cx="87" cy="59" r="3.5" fill="#1F1F1F"/>
      <circle cx="64.5" cy="57.5" r="1.5" fill="white"/>
      <circle cx="88.5" cy="57.5" r="1.5" fill="white"/>
      {/* Smile */}
      <path d="M67 75 Q75 82 83 75" stroke="#E91E8E" strokeWidth="2" strokeLinecap="round" fill="none"/>
    </g>
    {/* Lightning bolts */}
    <path d="M125 30L119 45H127L121 60" stroke="#FFD54F" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M30 35L26 45H32L28 55" stroke="#FFD54F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7"/>
    {/* Sparkles */}
    <path d="M135 70L137 75L142 76L137 78L135 83L133 78L128 76L133 75Z" fill="#7C5CFF" opacity="0.6" className="sparkle-twinkle"/>
    <circle cx="22" cy="80" r="3" fill="#FF8A50" opacity="0.5" className="sparkle-twinkle-delayed"/>
  </svg>
);

// 4. Bullseye target with arrow hitting center, stars
const JobMatchIllustration = () => (
  <svg viewBox="0 0 160 140" fill="none" className="w-full h-full">
    <ellipse cx="75" cy="132" rx="40" ry="6" fill="#E8D5B0" opacity="0.4"/>
    <g className="illust-pulse">
      {/* Target rings */}
      <circle cx="75" cy="65" r="42" fill="#FFF0E0" stroke="#FF8A50" strokeWidth="2.5" opacity="0.4"/>
      <circle cx="75" cy="65" r="32" fill="#FFE0CC" stroke="#FF8A50" strokeWidth="2.5" opacity="0.5"/>
      <circle cx="75" cy="65" r="22" fill="#FFD0B0" stroke="#FF8A50" strokeWidth="2.5" opacity="0.6"/>
      <circle cx="75" cy="65" r="12" fill="#FF8A50" opacity="0.8"/>
      <circle cx="75" cy="65" r="5" fill="white"/>
      {/* Arrow hitting center */}
      <line x1="108" y1="32" x2="78" y2="62" stroke="#7C5CFF" strokeWidth="3.5" strokeLinecap="round"/>
      <polygon points="76,64 86,52 82,66" fill="#7C5CFF"/>
      {/* Arrow tail feathers */}
      <line x1="108" y1="32" x2="115" y2="25" stroke="#7C5CFF" strokeWidth="2" strokeLinecap="round"/>
      <line x1="108" y1="32" x2="112" y2="22" stroke="#7C5CFF" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
    </g>
    {/* Flag */}
    <line x1="130" y1="30" x2="130" y2="80" stroke="#4CAF50" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M130 30L145 38L130 46" fill="#FF4444" opacity="0.8"/>
    {/* Stars */}
    <path d="M22 30L24.5 37L32 38L24.5 41L22 48L19.5 41L12 38L19.5 37Z" fill="#FFD54F" className="sparkle-twinkle"/>
    <path d="M140 85L141.5 89L146 90L141.5 91.5L140 96L138.5 91.5L134 90L138.5 89Z" fill="#7C5CFF" opacity="0.6" className="sparkle-twinkle-delayed"/>
    <circle cx="30" cy="100" r="4" fill="#FF8A50" opacity="0.3" className="sparkle-twinkle-slow"/>
  </svg>
);

// 5. Cute treasure map with flags, dotted path, location pins
const CareerRoadmapIllustration = () => (
  <svg viewBox="0 0 160 140" fill="none" className="w-full h-full">
    <ellipse cx="80" cy="132" rx="45" ry="6" fill="#E8D5B0" opacity="0.4"/>
    <g className="illust-bounce">
      {/* Map background — parchment style */}
      <rect x="18" y="18" width="120" height="95" rx="12" fill="#FFF8E8" stroke="#E6BE3D" strokeWidth="2.5"/>
      {/* Torn/worn edges */}
      <path d="M18 30 Q25 28 30 32 Q38 28 45 31" stroke="#E6BE3D" strokeWidth="1" opacity="0.3" fill="none"/>
      {/* Dotted path */}
      <path d="M40 90 Q45 75 55 70 Q70 60 80 50 Q90 42 105 35 Q115 28 125 30" stroke="#7C5CFF" strokeWidth="3" strokeLinecap="round" fill="none" strokeDasharray="6 5"/>
      {/* Start pin */}
      <circle cx="40" cy="90" r="8" fill="#FF8A50"/>
      <circle cx="40" cy="90" r="4" fill="white"/>
      {/* Mid marker */}
      <circle cx="80" cy="50" r="6" fill="#7C5CFF"/>
      <circle cx="80" cy="50" r="3" fill="white"/>
      {/* End flag */}
      <line x1="125" y1="30" x2="125" y2="15" stroke="#4CAF50" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M125 15L138 20L125 25" fill="#FF4444" opacity="0.8"/>
      {/* Tiny compass rose */}
      <circle cx="105" cy="82" r="10" fill="white" stroke="#E6BE3D" strokeWidth="1.5"/>
      <path d="M105 74L107 80L105 82L103 80Z" fill="#FF4444"/>
      <path d="M105 90L103 84L105 82L107 84Z" fill="#D1D5DB"/>
      {/* Mountain doodle */}
      <path d="M55 45L60 35L65 42L70 30L78 45" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.4"/>
    </g>
    {/* Stars */}
    <path d="M10 40L12 45L17 46L12 48L10 53L8 48L3 46L8 45Z" fill="#FFD54F" className="sparkle-twinkle"/>
    <path d="M145 60L146.5 63.5L150 65L146.5 66.5L145 70L143.5 66.5L140 65L143.5 63.5Z" fill="#7C5CFF" opacity="0.5" className="sparkle-twinkle-delayed"/>
  </svg>
);

// 6. Analytics dashboard with bar charts, line graph, trend
const AnalyticsDashIllustration = () => (
  <svg viewBox="0 0 160 140" fill="none" className="w-full h-full">
    <ellipse cx="80" cy="132" rx="40" ry="6" fill="#E8D5B0" opacity="0.4"/>
    <g className="illust-grow">
      {/* Monitor */}
      <rect x="18" y="12" width="120" height="80" rx="12" fill="white" stroke="#E5E7EB" strokeWidth="2.5"/>
      {/* Screen top bar */}
      <rect x="18" y="12" width="120" height="18" rx="12" fill="#F9F5EB"/>
      <circle cx="32" cy="21" r="3" fill="#FF4444" opacity="0.5"/>
      <circle cx="42" cy="21" r="3" fill="#FFD54F" opacity="0.6"/>
      <circle cx="52" cy="21" r="3" fill="#4CAF50" opacity="0.5"/>
      {/* Chart bars */}
      <rect x="32" y="68" width="14" height="16" rx="4" fill="#FFD54F"/>
      <rect x="52" y="55" width="14" height="29" rx="4" fill="#7C5CFF"/>
      <rect x="72" y="60" width="14" height="24" rx="4" fill="#FF8A50"/>
      <rect x="92" y="45" width="14" height="39" rx="4" fill="#4CAF50"/>
      <rect x="112" y="50" width="14" height="34" rx="4" fill="#7C5CFF" opacity="0.5"/>
      {/* Trend line */}
      <path d="M39 62 L59 50 L79 55 L99 40 L119 44" stroke="#FF8A50" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <circle cx="39" cy="62" r="3" fill="#FF8A50"/>
      <circle cx="99" cy="40" r="3" fill="#FF8A50"/>
      {/* Monitor stand */}
      <rect x="68" y="92" width="20" height="8" rx="3" fill="#D1D5DB"/>
      <rect x="58" y="100" width="40" height="6" rx="3" fill="#E5E7EB"/>
    </g>
    {/* Growth arrow */}
    <path d="M140 30L145 20" stroke="#4CAF50" strokeWidth="3" strokeLinecap="round"/>
    <path d="M141 20L145 20L145 24" stroke="#4CAF50" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    {/* Sparkle */}
    <path d="M12 60L14 65L19 66L14 68L12 73L10 68L5 66L10 65Z" fill="#FFD54F" className="sparkle-twinkle"/>
  </svg>
);

// Section background floating doodles
const SwirlDoodle = ({ className = '' }) => (
  <svg viewBox="0 0 32 32" fill="none" className={className}>
    <path d="M16 4 Q28 4 28 16 Q28 24 20 24 Q14 24 14 18 Q14 14 18 14" stroke="#7C5CFF" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.3"/>
  </svg>
);

const SquiggleDoodle = ({ className = '' }) => (
  <svg viewBox="0 0 48 16" fill="none" className={className}>
    <path d="M4 8 Q10 2 16 8 Q22 14 28 8 Q34 2 40 8 Q46 14 48 8" stroke="#FFD54F" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.4"/>
  </svg>
);

const TinyPaper = ({ className = '' }) => (
  <svg viewBox="0 0 20 26" fill="none" className={className}>
    <rect x="1" y="1" width="18" height="24" rx="3" fill="white" stroke="#D1D5DB" strokeWidth="1.5" opacity="0.5"/>
    <line x1="5" y1="7" x2="15" y2="7" stroke="#E5E7EB" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="5" y1="11" x2="13" y2="11" stroke="#E5E7EB" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="5" y1="15" x2="11" y2="15" stroke="#E5E7EB" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const PinDoodle = ({ className = '' }) => (
  <svg viewBox="0 0 20 28" fill="none" className={className}>
    <circle cx="10" cy="10" r="8" fill="#FF8A50" opacity="0.5"/>
    <circle cx="10" cy="10" r="3" fill="white" opacity="0.7"/>
    <path d="M10 18L10 26" stroke="#FF8A50" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
  </svg>
);

// Small Robot for Features Header and CTA
const SmallRobot = ({ className = '', flip = false }) => (
  <svg viewBox="0 0 80 80" fill="none" className={className} style={flip ? { transform: 'scaleX(-1)' } : {}}>
    <line x1="40" y1="14" x2="40" y2="6" stroke="#7C5CFF" strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="40" cy="4" r="3" fill="#FFD54F"/>
    <rect x="18" y="14" width="44" height="36" rx="12" fill="#7C5CFF"/>
    <rect x="22" y="17" width="36" height="30" rx="9" fill="white"/>
    <circle cx="33" cy="30" r="5" fill="#1F1F1F"/>
    <circle cx="34.5" cy="28.5" r="2" fill="white"/>
    <circle cx="47" cy="30" r="5" fill="#1F1F1F"/>
    <circle cx="48.5" cy="28.5" r="2" fill="white"/>
    <path d="M33 40 Q40 47 47 40" stroke="#1F1F1F" strokeWidth="2" strokeLinecap="round" fill="none"/>
    <ellipse cx="24" cy="38" rx="4" ry="3" fill="#FFB4B4" opacity="0.5"/>
    <ellipse cx="56" cy="38" rx="4" ry="3" fill="#FFB4B4" opacity="0.5"/>
    <rect x="10" y="24" width="10" height="12" rx="5" fill="#FFD54F"/>
    <rect x="60" y="24" width="10" height="12" rx="5" fill="#FFD54F"/>
    <rect x="26" y="50" width="10" height="14" rx="5" fill="#7C5CFF"/>
    <rect x="44" y="50" width="10" height="14" rx="5" fill="#7C5CFF"/>
    <rect x="23" y="60" width="16" height="8" rx="4" fill="#FFD54F"/>
    <rect x="41" y="60" width="16" height="8" rx="4" fill="#FFD54F"/>
  </svg>
);

// ── How It Works Step Illustrations ──

// Step 1: Upload Resume (gently falling)
const StepUploadIllustration = () => (
  <svg viewBox="0 0 160 140" fill="none" className="w-28 h-28 sm:w-32 sm:h-32">
    <ellipse cx="80" cy="130" rx="35" ry="5" fill="#E8D5B0" opacity="0.4"/>
    {/* Upload Box */}
    <rect x="30" y="55" width="100" height="65" rx="12" fill="white" stroke="#7C5CFF" strokeWidth="2.5" strokeDasharray="5 4"/>
    <path d="M80 75v25M70 85l10-10 10 10" stroke="#7C5CFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    
    {/* Falling Resume */}
    <motion.g
      animate={{ y: [-20, 15, -20] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      <rect x="55" y="10" width="50" height="65" rx="6" fill="white" stroke="#E5E7EB" strokeWidth="2"/>
      <line x1="65" y1="25" x2="95" y2="25" stroke="#D1D5DB" strokeWidth="2"/>
      <line x1="65" y1="35" x2="90" y2="35" stroke="#D1D5DB" strokeWidth="2"/>
      <line x1="65" y1="45" x2="85" y2="45" stroke="#D1D5DB" strokeWidth="2"/>
    </motion.g>
  </svg>
);

// Step 2: AI Reads Resume (blinks, page flips, sparkles)
const StepReadIllustration = () => (
  <svg viewBox="0 0 160 140" fill="none" className="w-28 h-28 sm:w-32 sm:h-32">
    <ellipse cx="80" cy="130" rx="40" ry="5" fill="#E8D5B0" opacity="0.4"/>
    {/* Cute Robot Mascot with Glasses */}
    <g className="illust-wiggle" transform="translate(10, 20)">
      <rect x="15" y="25" width="65" height="55" rx="14" fill="#7C5CFF"/>
      <rect x="20" y="29" width="55" height="47" rx="10" fill="white"/>
      {/* Glasses */}
      <circle cx="36" cy="48" r="9" fill="none" stroke="#1F1F1F" strokeWidth="2"/>
      <circle cx="59" cy="48" r="9" fill="none" stroke="#1F1F1F" strokeWidth="2"/>
      <line x1="45" y1="48" x2="50" y2="48" stroke="#1F1F1F" strokeWidth="2"/>
      {/* Eyes */}
      <g className="robot-eye">
        <circle cx="36" cy="48" r="3" fill="#1F1F1F"/>
        <circle cx="59" cy="48" r="3" fill="#1F1F1F"/>
      </g>
    </g>
    
    {/* Flipping document */}
    <g transform="translate(95, 25)">
      <rect x="0" y="0" width="45" height="60" rx="6" fill="white" stroke="#E5E7EB" strokeWidth="2"/>
      <motion.path
        d="M 45 0 L 22 15 L 22 45 L 45 60 Z"
        fill="#F9F5EB"
        stroke="#E5E7EB"
        strokeWidth="1.5"
        animate={{ rotateY: [0, -180, 0] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "left center" }}
      />
    </g>
    
    {/* Sparkles */}
    <path d="M15 20L17 24L21 25L17 26L15 30L13 26L9 25L13 24Z" fill="#FFD54F" className="sparkle-twinkle"/>
    <path d="M130 15L131.5 18L135 19L131.5 20L130 23L128.5 20L125 19L128.5 18Z" fill="#FF8A50" className="sparkle-twinkle-delayed"/>
  </svg>
);

// Step 3: ATS Analysis (Gauge filling 0 to 92%)
const StepATSIllustration = () => (
  <svg viewBox="0 0 160 140" fill="none" className="w-28 h-28 sm:w-32 sm:h-32">
    <ellipse cx="80" cy="130" rx="35" ry="5" fill="#E8D5B0" opacity="0.4"/>
    <circle cx="80" cy="65" r="38" fill="white" stroke="#E5E7EB" strokeWidth="8"/>
    <motion.circle
      cx="80"
      cy="65"
      r="38"
      fill="none"
      stroke="#4CAF50"
      strokeWidth="8"
      strokeLinecap="round"
      transform="rotate(-90 80 65)"
      initial={{ strokeDasharray: "240", strokeDashoffset: "240" }}
      whileInView={{ strokeDashoffset: "20" }} // fill to 92%
      viewport={{ once: false }}
      transition={{ duration: 2, ease: "easeOut" }}
    />
    <text x="80" y="72" textAnchor="middle" fontSize="18" fontWeight="900" fill="#1F1F1F" fontFamily="Nunito">92%</text>
  </svg>
);

// Step 4: Skill Gap Detection (searching brain with magnifying glass)
const StepSkillIllustration = () => (
  <svg viewBox="0 0 160 140" fill="none" className="w-28 h-28 sm:w-32 sm:h-32">
    <ellipse cx="80" cy="130" rx="35" ry="5" fill="#E8D5B0" opacity="0.4"/>
    {/* Brain */}
    <g className="illust-wiggle" transform="translate(15, 20)">
      <ellipse cx="45" cy="45" rx="30" ry="26" fill="#FADADD"/>
      <path d="M45 19 Q55 19 60 28 Q68 28 68 38 Q72 42 68 50 Q68 58 60 60 Q55 68 45 68 Q35 68 30 60 Q22 58 22 50 Q18 42 22 38 Q22 28 30 28 Q35 19 45 19Z" fill="none" stroke="#E91E8E" strokeWidth="2" opacity="0.6"/>
    </g>
    
    {/* Magnifying Glass */}
    <motion.g
      animate={{ x: [0, 12, -12, 0], y: [0, -8, 8, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      <circle cx="85" cy="70" r="14" fill="white" stroke="#FF8A50" strokeWidth="2.5"/>
      <line x1="95" y1="80" x2="110" y2="95" stroke="#FF8A50" strokeWidth="3.5" strokeLinecap="round"/>
    </motion.g>

    {/* Pop-in Checkmarks / Warnings */}
    <motion.g
      initial={{ scale: 0, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.6, type: "spring" }}
      className="origin-center"
    >
      <circle cx="120" cy="35" r="9" fill="#4CAF50"/>
      <path d="M116 35 l3 3 l5 -5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      
      <circle cx="35" cy="95" r="9" fill="#FFD54F"/>
      <text x="35" y="99" textAnchor="middle" fontSize="11" fontWeight="900" fill="#1F1F1F">!</text>
    </motion.g>
  </svg>
);

// Step 5: Career Roadmap (drawing path, pop-up flags)
const StepRoadmapIllustration = () => (
  <svg viewBox="0 0 160 140" fill="none" className="w-28 h-28 sm:w-32 sm:h-32">
    <ellipse cx="80" cy="130" rx="45" ry="5" fill="#E8D5B0" opacity="0.4"/>
    <g className="illust-bounce">
      <rect x="20" y="20" width="120" height="95" rx="12" fill="#FFF8E8" stroke="#E6BE3D" strokeWidth="2"/>
      
      <motion.path
        d="M35 90 Q60 80 75 55 T125 35"
        stroke="#7C5CFF"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
        strokeDasharray="140"
        initial={{ strokeDashoffset: 140 }}
        whileInView={{ strokeDashoffset: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 1.8, ease: "easeInOut" }}
      />
      
      <motion.g
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        transition={{ delay: 0.8, type: "spring" }}
        className="origin-center"
      >
        <circle cx="35" cy="90" r="5" fill="#FF8A50"/>
        <line x1="125" y1="35" x2="125" y2="18" stroke="#4CAF50" strokeWidth="2"/>
        <path d="M125 18l12 4-12 4Z" fill="#FF4444"/>
      </motion.g>
    </g>
  </svg>
);

// Step 6: Smart Job Matching (flying cards)
const StepMatchIllustration = () => {
  const cardVariants = (delay) => ({
    hidden: { y: 35, opacity: 0, scale: 0.8 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { delay, type: "spring", stiffness: 100, damping: 12 }
    }
  });

  return (
    <svg viewBox="0 0 160 140" fill="none" className="w-28 h-28 sm:w-32 sm:h-32">
      <ellipse cx="80" cy="130" rx="40" ry="5" fill="#E8D5B0" opacity="0.4"/>
      
      <motion.g variants={cardVariants(0.1)} initial="hidden" whileInView="visible">
        <rect x="10" y="15" width="60" height="40" rx="8" fill="white" stroke="#E5E7EB" strokeWidth="1.5" className="shadow-sm"/>
        <text x="40" y="38" textAnchor="middle" fontSize="12" fontWeight="900" fill="#4285F4" fontFamily="Nunito">Google</text>
      </motion.g>

      <motion.g variants={cardVariants(0.3)} initial="hidden" whileInView="visible">
        <rect x="85" y="25" width="60" height="40" rx="8" fill="white" stroke="#E5E7EB" strokeWidth="1.5" className="shadow-sm"/>
        <text x="115" y="48" textAnchor="middle" fontSize="10" fontWeight="900" fill="#F25022" fontFamily="Nunito">Microsoft</text>
      </motion.g>

      <motion.g variants={cardVariants(0.5)} initial="hidden" whileInView="visible">
        <rect x="40" y="75" width="65" height="40" rx="8" fill="white" stroke="#E5E7EB" strokeWidth="1.5" className="shadow-sm"/>
        <text x="72.5" y="98" textAnchor="middle" fontSize="10" fontWeight="900" fill="#FF9900" fontFamily="Nunito">Amazon</text>
      </motion.g>
    </svg>
  );
};

// Cute Thumbs-Up Robot Mascot for bottom CTA card
const ThumbsUpRobot = ({ className = '' }) => (
  <svg viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <ellipse cx="90" cy="165" rx="50" ry="8" fill="#E8D5B0" opacity="0.4"/>
    {/* Head */}
    <g className="robot-body-breathe">
      <rect x="40" y="30" width="100" height="85" rx="20" fill="#7C5CFF"/>
      <rect x="48" y="36" width="84" height="73" rx="16" fill="white"/>
      <g className="robot-eye">
        <circle cx="70" cy="68" r="10" fill="#1F1F1F"/>
        <circle cx="74" cy="64" r="3.5" fill="white"/>
      </g>
      <g className="robot-eye-delayed">
        <circle cx="110" cy="68" r="10" fill="#1F1F1F"/>
        <circle cx="114" cy="64" r="3.5" fill="white"/>
      </g>
      <path d="M75 88 Q90 98 105 88" stroke="#1F1F1F" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
      <ellipse cx="58" cy="80" rx="7" ry="4" fill="#FFB4B4" opacity="0.5"/>
      <ellipse cx="122" cy="80" rx="7" ry="4" fill="#FFB4B4" opacity="0.5"/>
    </g>
    
    {/* Body */}
    <rect x="55" y="115" width="70" height="45" rx="12" fill="#7C5CFF"/>
    
    {/* Thumbs Up Hand/Arm */}
    <path d="M125 130 H142 C146 130 148 126 148 123 C148 120 144 117 138 117" stroke="#7C5CFF" strokeWidth="6" strokeLinecap="round"/>
    <path d="M138 117 C138 111 144 107 146 109 C148 111 146 117 141 119" stroke="#FFD54F" strokeWidth="6" strokeLinecap="round"/>
    <circle cx="141" cy="123" r="8" fill="#FFD54F"/>
  </svg>
);


/* ═══════════════════════════════════════════════════
   MAIN APP COMPONENT
   ═══════════════════════════════════════════════════ */

export default function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('Home');
  const [isDragOver, setIsDragOver] = useState(false);

  // Interactive Product Demo State Hooks
  const [demoStep, setDemoStep] = useState('idle'); // 'idle' | 'scanning' | 'processing' | 'results'
  const [demoProgress, setDemoProgress] = useState(0);
  const [demoMessage, setDemoMessage] = useState('');
  const [isDemoDragOver, setIsDemoDragOver] = useState(false);

  const startDemo = () => {
    if (demoStep !== 'idle') return;
    
    // Step 1: Scanning (upload animation)
    setDemoStep('scanning');
    setDemoProgress(0);
    
    // Wait for the upload/scan animation to complete (2 seconds)
    setTimeout(() => {
      setDemoStep('processing');
      
      // Step 2: Processing messages transition
      const messages = [
        'Reading Resume...',
        'Analyzing Skills...',
        'Calculating ATS Score...',
        'Finding Missing Skills...',
        'Matching Jobs...',
        'Building Career Roadmap...'
      ];
      
      let msgIndex = 0;
      setDemoMessage(messages[0]);
      
      // We will increment progress bar up to 100 over 4.5 seconds
      const progressInterval = setInterval(() => {
        setDemoProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            // transition to results
            setTimeout(() => {
              setDemoStep('results');
            }, 600);
            return 100;
          }
          const next = prev + 4;
          
          // Switch messages based on progress checkpoints
          const index = Math.min(Math.floor((next / 100) * messages.length), messages.length - 1);
          setDemoMessage(messages[index]);
          
          return next;
        });
      }, 160);
      
    }, 2000);
  };

  const resetDemo = () => {
    setDemoStep('idle');
    setDemoProgress(0);
    setDemoMessage('');
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll event listener Scroll Spy
  useEffect(() => {
    const handleScrollSpy = () => {
      const sectionIds = ['home', 'features', 'how-it-works', 'pricing', 'contact'];
      
      // At the bottom of the page, Contact is active
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60) {
        setActiveLink('Contact');
        return;
      }

      const scrollPosition = window.scrollY + 200; // offset for sticky header

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const el = document.getElementById(id);
        if (el) {
          if (scrollPosition >= el.offsetTop) {
            const mappedName = 
              id === 'home' ? 'Home' :
              id === 'features' ? 'Features' :
              id === 'how-it-works' ? 'How it Works' :
              id === 'pricing' ? 'Pricing' :
              id === 'contact' ? 'Contact' : 'Home';
            setActiveLink(mappedName);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScrollSpy);
    handleScrollSpy();
    return () => window.removeEventListener('scroll', handleScrollSpy);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      // Map id to link name immediately
      const mappedName = 
        id === 'home' ? 'Home' :
        id === 'features' ? 'Features' :
        id === 'how-it-works' ? 'How it Works' :
        id === 'pricing' ? 'Pricing' :
        id === 'contact' ? 'Contact' : 'Home';
      setActiveLink(mappedName);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.14, delayChildren: 0.1 }
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1, y: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.88 },
    visible: {
      opacity: 1, scale: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }
    }
  };

  // Gentle floating for decorative items
  const float = (dur, delay = 0) => ({
    y: [0, -10, 0],
    transition: { duration: dur, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay }
  });

  const floatRotate = (dur, delay = 0, deg = 8) => ({
    y: [0, -10, 0],
    rotate: [-deg, deg, -deg],
    transition: { duration: dur, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay }
  });

  const navLinks = ['Home', 'Features', 'How it Works', 'Pricing', 'Contact'];

  const features = [
    {
      title: 'Resume Analysis',
      desc: 'Deep AI analysis of your resume with personalized recommendations.',
      Illustration: ResumeAnalysisIllustration,
      color: '#FF8A50'
    },
    {
      title: 'ATS Score',
      desc: 'Instant ATS score with keyword optimization suggestions.',
      Illustration: ATSScoreIllustration,
      color: '#4CAF50'
    },
    {
      title: 'Skill Gap Detection',
      desc: 'Identify missing technical and soft skills required for your target role.',
      Illustration: SkillGapIllustration,
      color: '#7C5CFF'
    },
    {
      title: 'Smart Job Matching',
      desc: 'Receive personalized job recommendations based on your resume.',
      Illustration: JobMatchIllustration,
      color: '#FF8A50'
    },
    {
      title: 'Career Roadmap',
      desc: 'Step-by-step roadmap to reach your dream career.',
      Illustration: CareerRoadmapIllustration,
      color: '#4CAF50'
    },
    {
      title: 'Analytics Dashboard',
      desc: 'Interactive charts showing resume insights and career progress.',
      Illustration: AnalyticsDashIllustration,
      color: '#7C5CFF'
    }
  ];

  return (
    <div className="relative min-h-screen bg-cream text-text overflow-x-hidden">

      {/* ═══════════════════════════════════════════
          NAVBAR
          ═══════════════════════════════════════════ */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'nav-sticky py-3 shadow-sm' : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">

          {/* Logo */}
          <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }} className="flex items-center gap-2.5 group">
            <SmallRobot className="w-9 h-9 transition-transform duration-300 group-hover:scale-110" />
            <span className="text-xl font-extrabold tracking-tight text-text">
              Career<span className="text-secondary">Lens</span>AI
            </span>
          </a>

          {/* Center Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = activeLink === link;
              const targetId = link.toLowerCase().replace(/\s+/g, '-');
              return (
                <a
                  key={link}
                  href={`#${targetId}`}
                  onClick={(e) => { e.preventDefault(); scrollToSection(targetId); }}
                  className={`relative px-4 py-2 text-[15px] font-bold rounded-xl transition-colors duration-200 ${
                    isActive ? 'text-text' : 'text-text-light hover:text-text hover:bg-cream-dark'
                  }`}
                >
                  {link}
                  {isActive && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute -bottom-0.5 left-4 right-4 h-[3px] bg-primary rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </div>

          {/* Right CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="#login"
              className="px-5 py-2.5 text-[14px] font-bold text-text-light hover:text-text border-2 border-gray-200 hover:border-gray-300 rounded-full transition-all duration-200"
            >
              Log In
            </a>
            <motion.a
              href="#get-started"
              whileHover={{ y: -2, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="btn-yellow text-[14px] !py-2.5 !px-6 flex items-center gap-1.5"
            >
              Get Started <ArrowRight className="w-4 h-4 btn-arrow" />
            </motion.a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-text hover:text-secondary transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b border-card-border"
            >
              <div className="px-6 py-6 flex flex-col gap-3">
                {navLinks.map((link) => {
                  const targetId = link.toLowerCase().replace(/\s+/g, '-');
                  return (
                    <a
                      key={link}
                      href={`#${targetId}`}
                      onClick={(e) => { e.preventDefault(); scrollToSection(targetId); setIsMobileMenuOpen(false); }}
                      className={`text-base font-bold py-2 px-3 rounded-xl transition-colors ${
                        activeLink === link ? 'text-secondary bg-purple-50' : 'text-text-light hover:text-text hover:bg-cream-dark'
                      }`}
                    >
                      {link}
                    </a>
                  );
                })}
                <div className="h-px bg-card-border my-2" />
                <a href="#login" className="text-center py-3 text-base font-bold text-text-light hover:text-text rounded-full border-2 border-gray-200">
                  Log In
                </a>
                <a href="#get-started" className="btn-yellow text-center text-base">
                  Get Started →
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>


      {/* ═══════════════════════════════════════════
          HERO SECTION — Polished spacing and breathing
          ═══════════════════════════════════════════ */}
      <section id="home" className="max-w-7xl mx-auto px-6 sm:px-8 pt-32 sm:pt-40 pb-12 sm:pb-16 relative z-10">

        {/* Decorative background dots — repositioned */}
        <div className="absolute top-28 right-4 w-40 h-40 dot-pattern opacity-20 pointer-events-none rounded-full" />
        <div className="absolute bottom-12 left-8 w-24 h-24 dot-pattern opacity-15 pointer-events-none rounded-full hidden lg:block" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12 items-center">

          {/* ── Left Side — Improved spacing ── */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-start"
          >
            {/* Badge */}
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/20 border-2 border-primary/30 text-sm font-bold text-text mb-7"
            >
              <span>⭐</span>
              <span>AI-Powered Career Assistant</span>
            </motion.div>

            {/* Headline — improved line-height and balance */}
            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl lg:text-[3.6rem] font-black tracking-tight text-text leading-[1.15] mb-6"
            >
              Your Career,{' '}
              <br />
              Our <span className="text-secondary">AI</span> Magic{' '}
              <motion.span
                animate={{ rotate: [0, 14, -8, 14, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }}
                className="inline-block"
              >
                ✨
              </motion.span>
            </motion.h1>

            {/* Description — narrower max-width for better readability */}
            <motion.p
              variants={fadeUp}
              className="text-text-light text-[17px] sm:text-lg leading-[1.7] max-w-[380px] mb-9"
            >
              Upload your resume and let our AI analyze it, find skill gaps, and match you with the best career opportunities.
            </motion.p>

            {/* CTA Buttons — enhanced hover */}
            <motion.div
              variants={fadeUp}
              className="flex flex-wrap items-center gap-4 mb-12"
            >
              <motion.a
                href="#upload"
                whileHover={{ y: -3, scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="btn-yellow inline-flex items-center gap-2.5 text-base"
              >
                <Upload className="w-[18px] h-[18px] btn-arrow" />
                Upload Resume
              </motion.a>
              <motion.a
                href="#how-it-works"
                whileHover={{ y: -3, scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="btn-outline inline-flex items-center gap-2.5 text-base"
              >
                <Play className="w-4 h-4 btn-play" fill="currentColor" />
                See How It Works
              </motion.a>
            </motion.div>

            {/* Social Proof — improved avatars with hover, spacing, better shadows */}
            <motion.div
              variants={fadeUp}
              className="flex items-center gap-5"
            >
              {/* Avatar group — improved overlap and hover */}
              <div className="flex -space-x-2.5">
                {[
                  { bg: '#FF8A50', letter: 'A' },
                  { bg: '#7C5CFF', letter: 'J' },
                  { bg: '#4CAF50', letter: 'M' },
                  { bg: '#FFD54F', letter: 'S' }
                ].map((avatar, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -4, scale: 1.15 }}
                    className="avatar-item w-10 h-10 rounded-full border-[3px] border-cream flex items-center justify-center text-white font-bold text-xs cursor-pointer"
                    style={{ background: avatar.bg, zIndex: 4 - i, color: avatar.bg === '#FFD54F' ? '#1F1F1F' : 'white' }}
                  >
                    {avatar.letter}
                  </motion.div>
                ))}
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[13.5px] font-extrabold text-text">Loved by 10,000+ users</span>
                <div className="flex items-center gap-0.5">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="w-4 h-4 star-gold fill-current" />
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* ── Right Side — Robot + Upload Box + Floating Decorations ── */}
          <motion.div
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            className="relative flex flex-col items-center justify-center min-h-[520px] lg:min-h-[580px]"
          >

            {/* ── Floating decorative elements — carefully repositioned ── */}

            {/* Paper airplane — top right, tilted, floating with rotation */}
            <motion.div animate={floatRotate(5.5, 0, 10)} className="absolute -top-4 right-8 lg:right-16 w-12 h-12 z-10">
              <PaperAirplane className="w-full h-full" />
            </motion.div>

            {/* Folder — top left area */}
            <motion.div animate={float(5, 0.3)} className="absolute top-8 left-0 lg:left-4 w-12 h-12 z-10">
              <FloatingFolder className="w-full h-full" />
            </motion.div>

            {/* Document — mid right */}
            <motion.div animate={float(4.5, 0.8)} className="absolute top-1/3 -right-2 lg:right-2 w-10 h-10 z-10">
              <FloatingDocument className="w-full h-full" />
            </motion.div>

            {/* Golden sparkle star — upper-left quadrant */}
            <motion.div animate={float(3.8, 0.2)} className="absolute top-2 left-1/4 w-8 h-8 z-10 sparkle-twinkle">
              <SparkleStarSVG className="w-full h-full" />
            </motion.div>

            {/* Purple sparkle — bottom left */}
            <motion.div animate={float(4.2, 0.6)} className="absolute bottom-32 left-2 lg:left-6 w-6 h-6 z-10 sparkle-twinkle-delayed">
              <SparkleStarSVG className="w-full h-full" color="#7C5CFF" />
            </motion.div>

            {/* Curved arrow — mid-right area */}
            <motion.div animate={floatRotate(5.5, 0.5, 6)} className="absolute top-24 right-0 lg:right-6 w-7 h-7 z-10">
              <CurvedArrow className="w-full h-full" />
            </motion.div>

            {/* Circle doodle — bottom right */}
            <motion.div animate={float(4, 1)} className="absolute bottom-24 right-8 lg:right-14 w-6 h-6 z-10">
              <CircleDoodle className="w-full h-full" />
            </motion.div>

            {/* Triangle — upper mid */}
            <motion.div animate={float(4.5, 1.5)} className="absolute top-16 right-1/3 w-5 h-5 z-10">
              <TriangleDoodle className="w-full h-full" />
            </motion.div>

            {/* Tiny sparkles — scattered */}
            <motion.div animate={float(3.2, 0.4)} className="absolute top-0 left-1/3 w-4 h-4 z-10 sparkle-twinkle-slow">
              <TinySparkle className="w-full h-full" color="#FFD54F" />
            </motion.div>

            <motion.div animate={float(3.5, 0.9)} className="absolute bottom-16 left-1/5 w-3.5 h-3.5 z-10 sparkle-twinkle">
              <TinySparkle className="w-full h-full" color="#FF8A50" />
            </motion.div>

            <motion.div animate={float(3, 1.1)} className="absolute top-1/2 -left-3 lg:left-0 w-3 h-3 z-10 sparkle-twinkle-delayed">
              <TinySparkle className="w-full h-full" color="#7C5CFF" />
            </motion.div>

            {/* Floating dots */}
            <motion.div animate={float(4.8, 0.7)} className="absolute bottom-40 right-4 w-4 h-4 z-10">
              <FloatingDot className="w-full h-full" color="#FFD54F" />
            </motion.div>

            <motion.div animate={float(3.6, 1.3)} className="absolute top-36 left-8 w-3 h-3 z-10">
              <FloatingDot className="w-full h-full" color="#FF8A50" />
            </motion.div>

            {/* ── Speech Bubble — better positioning, connected to robot ── */}
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
              className="absolute top-[-8px] right-[-4px] lg:right-4 z-20"
            >
              <SpeechBubble />
            </motion.div>

            {/* ── Robot Mascot — alive with floating + gentle head tilt + hand wave ── */}
            <motion.div
              animate={{
                y: [0, -8, 0],
                rotate: [0, 1.5, 0, -1, 0],
              }}
              transition={{
                y: { duration: 4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
                rotate: { duration: 6, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 0.5 }
              }}
              className="relative z-10 w-48 sm:w-56 lg:w-60 mb-6"
            >
              <RobotMascot className="w-full h-auto" />
            </motion.div>

            {/* ── Upload Box — improved visual focus ── */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              animate={isDragOver ? {
                scale: [1, 1.03, 1.01, 1.03],
                transition: { duration: 0.6, repeat: Infinity, repeatType: "reverse" }
              } : {}}
              transition={{ duration: 0.3 }}
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setIsDragOver(false); }}
              className={`upload-box w-full max-w-[380px] px-8 py-10 flex flex-col items-center text-center cursor-pointer z-10 ${
                isDragOver ? '!border-secondary !bg-secondary/5' : ''
              }`}
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 ${
                isDragOver ? 'bg-secondary/15' : 'bg-secondary/8'
              }`}>
                <Upload className={`w-7 h-7 text-secondary ${isDragOver ? '' : 'upload-icon-pulse'}`} />
              </div>
              <p className="text-[15px] font-extrabold text-text mb-1.5">
                Drag & drop your resume here
              </p>
              <p className="text-sm text-text-light mb-5">
                or <span className="text-secondary font-bold cursor-pointer hover:underline">click to browse</span>
              </p>
              <p className="text-xs text-text-muted font-semibold tracking-wide">
                PDF, DOCX or TXT (Max 5MB)
              </p>
            </motion.div>

          </motion.div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════
          FEATURES SECTION — Playful Cartoon Style
          ═══════════════════════════════════════════ */}
      <section className="relative z-10 pt-20 sm:pt-28 overflow-hidden" id="features">

        {/* ── Section background gradient ── */}
        <div className="absolute inset-0 bg-gradient-to-b from-cream via-[#FFF5E0] to-cream pointer-events-none" />

        {/* ── Floating background doodles ── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Stars */}
          <motion.div animate={float(4, 0)} className="absolute top-12 left-[8%] sparkle-twinkle">
            <SparkleStarSVG className="w-7 h-7" />
          </motion.div>
          <motion.div animate={float(5, 0.6)} className="absolute top-1/3 right-[6%] sparkle-twinkle-delayed">
            <SparkleStarSVG className="w-5 h-5" color="#7C5CFF" />
          </motion.div>
          <motion.div animate={float(3.5, 1.2)} className="absolute bottom-1/4 left-[12%] sparkle-twinkle-slow">
            <SparkleStarSVG className="w-6 h-6" />
          </motion.div>
          {/* Tiny sparkles */}
          <motion.div animate={float(3.2, 0.3)} className="absolute top-[20%] left-[20%] sparkle-twinkle">
            <TinySparkle className="w-4 h-4" color="#FF8A50" />
          </motion.div>
          <motion.div animate={float(3.8, 0.9)} className="absolute bottom-[15%] right-[15%] sparkle-twinkle-delayed">
            <TinySparkle className="w-4 h-4" color="#7C5CFF" />
          </motion.div>
          {/* Swirl */}
          <motion.div animate={floatRotate(6, 0.4, 5)} className="absolute top-[15%] right-[12%]">
            <SwirlDoodle className="w-8 h-8" />
          </motion.div>
          <motion.div animate={floatRotate(7, 1, 4)} className="absolute bottom-[20%] left-[5%]">
            <SwirlDoodle className="w-6 h-6" />
          </motion.div>
          {/* Squiggles */}
          <motion.div animate={float(5.5, 0.2)} className="absolute top-[40%] left-[3%]">
            <SquiggleDoodle className="w-12 h-4" />
          </motion.div>
          <motion.div animate={float(5, 1.5)} className="absolute bottom-[35%] right-[4%]">
            <SquiggleDoodle className="w-10 h-3" />
          </motion.div>
          {/* Tiny papers */}
          <motion.div animate={floatRotate(5, 0.6, 8)} className="absolute top-[60%] right-[8%]">
            <TinyPaper className="w-5 h-6" />
          </motion.div>
          <motion.div animate={floatRotate(4.5, 1.2, 6)} className="absolute top-[8%] left-[45%]">
            <TinyPaper className="w-4 h-5" />
          </motion.div>
          {/* Pins */}
          <motion.div animate={float(4, 0.8)} className="absolute bottom-[12%] left-[18%]">
            <PinDoodle className="w-4 h-6" />
          </motion.div>
          {/* Paper plane */}
          <motion.div animate={floatRotate(6, 0.3, 12)} className="absolute bottom-[30%] right-[10%]">
            <PaperAirplane className="w-8 h-8" />
          </motion.div>
          {/* Circle doodles */}
          <motion.div animate={float(4.5, 0.5)} className="absolute top-[50%] left-[7%]">
            <CircleDoodle className="w-5 h-5" />
          </motion.div>
          <motion.div animate={float(5, 1.8)} className="absolute top-[70%] right-[18%]">
            <FloatingDot className="w-4 h-4" color="#FFD54F" />
          </motion.div>
          {/* Triangle */}
          <motion.div animate={float(4.2, 0.7)} className="absolute bottom-[8%] right-[25%]">
            <TriangleDoodle className="w-5 h-5" />
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">

          {/* ── Section Header ── */}
          <div className="relative">
            {/* Small robots flanking header */}
            <motion.div animate={float(4, 0)} className="absolute -left-4 lg:-left-10 top-4 hidden lg:block">
              <SmallRobot className="w-16 h-16 opacity-90" />
            </motion.div>
            <motion.div animate={float(5, 0.5)} className="absolute -right-4 lg:-right-10 top-0 hidden lg:block">
              <SmallRobot className="w-14 h-14 opacity-90" flip />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7 }}
              className="text-center mb-6"
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent-orange/10 border-2 border-accent-orange/20 text-sm font-bold text-accent-orange mb-5">
                ✨ Features
              </div>

              {/* Heading */}
              <h2 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-black text-text leading-[1.15]">
                Everything You Need to<br />
                Land Your Dream Job
              </h2>

              {/* Hand-drawn underline */}
              <div className="flex justify-center mt-3 mb-5">
                <svg width="80" height="14" viewBox="0 0 80 14" fill="none">
                  <path d="M3 10 Q12 3 24 9 Q36 15 48 8 Q60 1 72 9 Q76 11 78 9" stroke="#FFD54F" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
                </svg>
              </div>

              {/* Description */}
              <p className="text-text-light text-base sm:text-[17px] leading-relaxed max-w-lg mx-auto">
                CareerLensAI uses AI to analyze resumes, calculate ATS scores, identify missing skills, recommend improvements, and match you with suitable jobs.
              </p>
            </motion.div>
          </div>

          {/* ── Features Grid — 3 cols desktop, 2 tablet, 1 mobile ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 mt-12">
            {features.map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{
                  duration: 0.65,
                  delay: i * 0.12,
                  type: 'spring',
                  stiffness: 100,
                  damping: 15
                }}
              >
                <div className="feature-card h-full flex flex-col group">
                  {/* Illustration — bounces on card hover */}
                  <div className="w-full h-40 mb-6 flex items-center justify-center transition-transform duration-400 group-hover:scale-[1.04]">
                    <feat.Illustration />
                  </div>
                  {/* Title */}
                  <h3 className="text-[18px] font-extrabold text-text mb-2.5">{feat.title}</h3>
                  {/* Description */}
                  <p className="text-[14px] text-text-light leading-[1.65] flex-1">{feat.desc}</p>
                  {/* Arrow button */}
                  <div
                    className="feat-arrow-btn mt-5 inline-flex items-center justify-center w-11 h-11 rounded-full cursor-pointer"
                    style={{ background: feat.color }}
                  >
                    <ArrowRight className="w-5 h-5 text-white feat-arrow-icon" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Wave divider at bottom of Features to transition to future section */}
      <div className="relative w-full overflow-hidden leading-[0] bg-cream pointer-events-none">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[60px]" fill="none">
          <path d="M985.66 92.83C906.67 72 823.78 31 741.52 13.56c-82.26-17.34-168.06-16.33-250.45.39-57.84 11.73-114 31.07-172 41.86C251.27 68.61 174.79 61 106.98 42.52 39.17 24 15.19 12 0 3v117h1200V92.83z" fill="#FFF3D6" opacity="0.5" />
          <path d="M321.39 56.44c58-10.79 114.16-30.13 172-41.86 82.39-16.72 168.19-17.73 250.45-.39C823.78 31 906.67 72 985.66 92.83c70.05 18.48 146.53 26.09 214.34 3V120H0V56.44z" fill="#FFF9ED" />
        </svg>
      </div>

      {/* ═══════════════════════════════════════════
          HOW IT WORKS SECTION — Alternating Dotted Timeline
          ═══════════════════════════════════════════ */}
      <section className="relative z-10 py-20 sm:py-28 bg-[#FFF9ED] overflow-hidden" id="how-it-works">
        
        {/* Floating background decorations */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div animate={float(5, 0.4)} className="absolute top-[10%] left-[6%]">
            <PaperAirplane className="w-8 h-8 opacity-70" />
          </motion.div>
          <motion.div animate={float(4.5, 0.9)} className="absolute top-[35%] right-[8%]">
            <SparkleStarSVG className="w-7 h-7" color="#FFD54F" />
          </motion.div>
          <motion.div animate={float(3.8, 1.2)} className="absolute bottom-[20%] left-[8%]">
            <SparkleStarSVG className="w-6 h-6" color="#7C5CFF" />
          </motion.div>
          <motion.div animate={floatRotate(6, 0.2, 5)} className="absolute bottom-[40%] right-[5%]">
            <SwirlDoodle className="w-8 h-8" />
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">

          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent-orange/10 border-2 border-accent-orange/20 text-sm font-bold text-accent-orange mb-5">
              ⚡ How It Works
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-black text-text leading-[1.15]">
              See CareerLensAI<br />Working Its Magic
            </h2>
            <div className="flex justify-center mt-3 mb-5">
              <svg width="80" height="14" viewBox="0 0 80 14" fill="none">
                <path d="M3 10 Q12 3 24 9 Q36 15 48 8 Q60 1 72 9" stroke="#7C5CFF" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
              </svg>
            </div>
            <p className="text-text-light text-base sm:text-[17px] leading-relaxed max-w-md mx-auto">
              Upload your resume and let our AI transform it into career insights in just a few seconds.
            </p>
          </motion.div>

          {/* Timeline Container */}
          <div className="relative max-w-5xl mx-auto">
            
            {/* Center Dotted Path Line (Desktop) */}
            <div className="absolute left-1/2 -translate-x-1/2 top-10 bottom-10 w-[3px] border-l-3 border-dashed border-[#7C5CFF]/30 hidden md:block" />

            {/* Steps Grid */}
            <div className="flex flex-col gap-12 sm:gap-20">
              
              {/* Step 1: Upload Resume */}
              <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 relative">
                {/* Center Badge (Desktop) */}
                <div className="absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-primary border-3 border-white shadow-md flex items-center justify-center font-black text-text text-base hidden md:flex z-20">
                  1
                </div>
                {/* Content Left */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, type: "spring" }}
                  className="text-left md:text-right md:pr-16 order-2 md:order-1"
                >
                  <div className="inline-flex items-center gap-2 mb-3 md:hidden">
                    <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-black text-text text-sm">1</span>
                    <h3 className="text-xl font-extrabold text-text">Upload Resume</h3>
                  </div>
                  <h3 className="text-xl font-extrabold text-text mb-3 hidden md:block">📄 Upload Resume</h3>
                  <p className="text-[15px] text-text-light leading-relaxed max-w-md md:ml-auto">
                    Student drops a resume into an upload box.
                  </p>
                </motion.div>
                {/* Illustration Right */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="flex justify-start md:justify-start md:pl-16 order-1 md:order-2"
                >
                  <div className="w-40 h-40 bg-white border-2 border-[#F3E8D0] rounded-2xl flex items-center justify-center shadow-sm">
                    <StepUploadIllustration />
                  </div>
                </motion.div>
              </div>

              {/* Step 2: AI Reads Resume */}
              <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 relative">
                {/* Center Badge (Desktop) */}
                <div className="absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-secondary text-white border-3 border-white shadow-md flex items-center justify-center font-black text-base hidden md:flex z-20">
                  2
                </div>
                {/* Illustration Left */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="flex justify-start md:justify-end md:pr-16 order-1"
                >
                  <div className="w-40 h-40 bg-white border-2 border-[#F3E8D0] rounded-2xl flex items-center justify-center shadow-sm">
                    <StepReadIllustration />
                  </div>
                </motion.div>
                {/* Content Right */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, type: "spring" }}
                  className="text-left md:pl-16 order-2"
                >
                  <div className="inline-flex items-center gap-2 mb-3 md:hidden">
                    <span className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center font-black text-sm">2</span>
                    <h3 className="text-xl font-extrabold text-text">AI Reads Resume</h3>
                  </div>
                  <h3 className="text-xl font-extrabold text-text mb-3 hidden md:block">🤖 AI Reads Resume</h3>
                  <p className="text-[15px] text-text-light leading-relaxed max-w-md">
                    Robot wearing glasses reading the resume. Resume pages flip and loading sparkles appear.
                  </p>
                </motion.div>
              </div>

              {/* Step 3: ATS Analysis */}
              <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 relative">
                {/* Center Badge (Desktop) */}
                <div className="absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-accent-green text-white border-3 border-white shadow-md flex items-center justify-center font-black text-base hidden md:flex z-20">
                  3
                </div>
                {/* Content Left */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, type: "spring" }}
                  className="text-left md:text-right md:pr-16 order-2 md:order-1"
                >
                  <div className="inline-flex items-center gap-2 mb-3 md:hidden">
                    <span className="w-8 h-8 rounded-full bg-accent-green text-white flex items-center justify-center font-black text-sm">3</span>
                    <h3 className="text-xl font-extrabold text-text">ATS Analysis</h3>
                  </div>
                  <h3 className="text-xl font-extrabold text-text mb-3 hidden md:block">📊 ATS Analysis</h3>
                  <p className="text-[15px] text-text-light leading-relaxed max-w-md md:ml-auto">
                    Circular ATS gauge filling from 0 to 92% automatically once it becomes visible.
                  </p>
                </motion.div>
                {/* Illustration Right */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="flex justify-start md:justify-start md:pl-16 order-1 md:order-2"
                >
                  <div className="w-40 h-40 bg-white border-2 border-[#F3E8D0] rounded-2xl flex items-center justify-center shadow-sm">
                    <StepATSIllustration />
                  </div>
                </motion.div>
              </div>

              {/* Step 4: Skill Gap Detection */}
              <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 relative">
                {/* Center Badge (Desktop) */}
                <div className="absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-accent-orange text-white border-3 border-white shadow-md flex items-center justify-center font-black text-base hidden md:flex z-20">
                  4
                </div>
                {/* Illustration Left */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="flex justify-start md:justify-end md:pr-16 order-1"
                >
                  <div className="w-40 h-40 bg-white border-2 border-[#F3E8D0] rounded-2xl flex items-center justify-center shadow-sm">
                    <StepSkillIllustration />
                  </div>
                </motion.div>
                {/* Content Right */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, type: "spring" }}
                  className="text-left md:pl-16 order-2"
                >
                  <div className="inline-flex items-center gap-2 mb-3 md:hidden">
                    <span className="w-8 h-8 rounded-full bg-accent-orange text-white flex items-center justify-center font-black text-sm">4</span>
                    <h3 className="text-xl font-extrabold text-text">Skill Gap Detection</h3>
                  </div>
                  <h3 className="text-xl font-extrabold text-text mb-3 hidden md:block">🧠 Skill Gap Detection</h3>
                  <p className="text-[15px] text-text-light leading-relaxed max-w-md">
                    Brain searching through skills with a magnifying glass. Required skills appear with green checkmarks or warning indicators.
                  </p>
                </motion.div>
              </div>

              {/* Step 5: Career Roadmap */}
              <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 relative">
                {/* Center Badge (Desktop) */}
                <div className="absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-primary border-3 border-white shadow-md flex items-center justify-center font-black text-text text-base hidden md:flex z-20">
                  5
                </div>
                {/* Content Left */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, type: "spring" }}
                  className="text-left md:text-right md:pr-16 order-2 md:order-1"
                >
                  <div className="inline-flex items-center gap-2 mb-3 md:hidden">
                    <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-black text-text text-sm">5</span>
                    <h3 className="text-xl font-extrabold text-text">Career Roadmap</h3>
                  </div>
                  <h3 className="text-xl font-extrabold text-text mb-3 hidden md:block">🗺 Career Roadmap</h3>
                  <p className="text-[15px] text-text-light leading-relaxed max-w-md md:ml-auto">
                    Treasure map path automatically drawing itself as flags pop into view.
                  </p>
                </motion.div>
                {/* Illustration Right */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="flex justify-start md:justify-start md:pl-16 order-1 md:order-2"
                >
                  <div className="w-40 h-40 bg-white border-2 border-[#F3E8D0] rounded-2xl flex items-center justify-center shadow-sm">
                    <StepRoadmapIllustration />
                  </div>
                </motion.div>
              </div>

              {/* Step 6: Smart Job Matching */}
              <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 relative">
                {/* Center Badge (Desktop) */}
                <div className="absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-secondary text-white border-3 border-white shadow-md flex items-center justify-center font-black text-base hidden md:flex z-20">
                  6
                </div>
                {/* Illustration Left */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="flex justify-start md:justify-end md:pr-16 order-1"
                >
                  <div className="w-40 h-40 bg-white border-2 border-[#F3E8D0] rounded-2xl flex items-center justify-center shadow-sm">
                    <StepMatchIllustration />
                  </div>
                </motion.div>
                {/* Content Right */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, type: "spring" }}
                  className="text-left md:pl-16 order-2"
                >
                  <div className="inline-flex items-center gap-2 mb-3 md:hidden">
                    <span className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center font-black text-sm">6</span>
                    <h3 className="text-xl font-extrabold text-text">Smart Job Matching</h3>
                  </div>
                  <h3 className="text-xl font-extrabold text-text mb-3 hidden md:block">💼 Smart Job Matching</h3>
                  <p className="text-[15px] text-text-light leading-relaxed max-w-md">
                    Matches fly towards you in spring cards from Google, Microsoft, and Amazon.
                  </p>
                </motion.div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          INTERACTIVE PRODUCT DEMO SECTION
          ═══════════════════════════════════════════ */}
      <section className="relative z-10 py-20 sm:py-28 bg-cream border-t border-card-border overflow-hidden" id="product-demo">
        
        {/* Decorative background doodles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div animate={float(4.5, 0.3)} className="absolute top-[8%] left-[10%] sparkle-twinkle">
            <TinySparkle className="w-5 h-5" color="#FFD54F" />
          </motion.div>
          <motion.div animate={float(5, 0.7)} className="absolute bottom-[10%] right-[10%] sparkle-twinkle-delayed">
            <TinySparkle className="w-5 h-5" color="#7C5CFF" />
          </motion.div>
          <motion.div animate={floatRotate(6, 0.5, 8)} className="absolute top-[20%] right-[12%]">
            <PaperAirplane className="w-7 h-7 opacity-50" />
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">

          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/20 border-2 border-primary/30 text-sm font-bold text-text mb-5">
              ✨ Live Product Demo
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-black text-text leading-[1.15]">
              Watch Your Resume<br />Come to Life
            </h2>
            <div className="flex justify-center mt-3 mb-5">
              <svg width="80" height="14" viewBox="0 0 80 14" fill="none">
                <path d="M3 10 Q12 3 24 9 Q36 15 48 8 Q60 1 72 9" stroke="#FFD54F" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
              </svg>
            </div>
            <p className="text-text-light text-base sm:text-[17px] leading-relaxed max-w-md mx-auto">
              Drag a resume into CareerLensAI and watch our AI analyze it in real time.
            </p>
          </motion.div>

          {/* Main Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch max-w-5xl mx-auto">

            {/* LEFT SIDE: Interactive Upload Card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col"
            >
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDemoDragOver(true); }}
                onDragLeave={() => setIsDemoDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setIsDemoDragOver(false); startDemo(); }}
                onClick={startDemo}
                className={`feature-card flex-1 flex flex-col items-center justify-center text-center p-8 sm:p-12 cursor-pointer transition-all duration-300 min-h-[360px] ${
                  isDemoDragOver ? 'demo-upload-glowing' : ''
                }`}
              >
                {/* Upload Icon */}
                <motion.div
                  animate={isDemoDragOver || demoStep === 'scanning' ? { scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] } : {}}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className={`w-20 h-20 rounded-3xl bg-secondary/8 flex items-center justify-center mb-6 text-secondary`}
                >
                  <Upload className="w-10 h-10" />
                </motion.div>

                <h3 className="text-lg sm:text-xl font-extrabold text-text mb-2">
                  Drag your Resume Here
                </h3>
                <p className="text-sm text-text-light mb-6">
                  or <span className="text-secondary font-bold hover:underline">Browse Files</span>
                </p>

                <div className="flex gap-4 text-xs font-semibold text-text-muted">
                  <span className="px-3 py-1 bg-cream-dark border border-card-border rounded-md">PDF</span>
                  <span className="px-3 py-1 bg-cream-dark border border-card-border rounded-md">DOCX</span>
                </div>

                {/* Scanning document floating anim */}
                <AnimatePresence>
                  {demoStep === 'scanning' && (
                    <motion.div
                      initial={{ y: 80, x: 0, opacity: 0, scale: 0.8 }}
                      animate={{ y: -80, x: 120, opacity: [0, 1, 1, 0], scale: [0.8, 1.1, 0.7] }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1.8, ease: "easeInOut" }}
                      className="absolute z-20"
                    >
                      <svg viewBox="0 0 60 80" fill="none" className="w-14 h-20 shadow-md">
                        <rect width="60" height="80" rx="8" fill="white" stroke="#7C5CFF" strokeWidth="3"/>
                        <line x1="12" y1="20" x2="48" y2="20" stroke="#D1D5DB" strokeWidth="2.5"/>
                        <line x1="12" y1="35" x2="40" y2="35" stroke="#D1D5DB" strokeWidth="2.5"/>
                        <line x1="12" y1="50" x2="44" y2="50" stroke="#D1D5DB" strokeWidth="2.5"/>
                      </svg>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* RIGHT SIDE: Playful AI Processing / Results Panel */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col"
            >
              <div className={`feature-card flex-1 flex flex-col p-6 sm:p-8 min-h-[360px] transition-all duration-500 ${
                demoStep === 'processing' ? 'demo-machine-glowing' : ''
              }`}>

                {/* Idle / Scanning State */}
                {(demoStep === 'idle' || demoStep === 'scanning') && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <ThumbsUpRobot className="w-32 h-32 mb-6" />
                    <h3 className="text-[17px] font-extrabold text-text mb-2">
                      {demoStep === 'scanning' ? "Catching resume... 🫴" : "AI Processing Machine"}
                    </h3>
                    <p className="text-sm text-text-light max-w-xs">
                      {demoStep === 'scanning' ? "Got it! Feeding it to the processor..." : "Click or drop a resume on the left to start the magic!"}
                    </p>
                  </div>
                )}

                {/* Processing State */}
                {demoStep === 'processing' && (
                  <div className="flex-1 flex flex-col justify-center">
                    {/* Glowing machinery SVG */}
                    <div className="flex items-center justify-center gap-6 mb-8 relative">
                      {/* Left Gear */}
                      <svg viewBox="0 0 60 60" fill="none" className="w-16 h-16 gear-spin-clockwise">
                        <circle cx="30" cy="30" r="20" fill="none" stroke="#FF8A50" strokeWidth="4"/>
                        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                          <rect key={deg} x="27" y="2" width="6" height="12" rx="2" fill="#FF8A50" transform={`rotate(${deg} 30 30)`} />
                        ))}
                        <circle cx="30" cy="30" r="8" fill="#1F1F1F"/>
                      </svg>
                      
                      {/* Right Gear */}
                      <svg viewBox="0 0 50 50" fill="none" className="w-12 h-12 gear-spin-counter">
                        <circle cx="25" cy="25" r="16" fill="none" stroke="#7C5CFF" strokeWidth="3"/>
                        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                          <rect key={deg} x="23" y="1" width="4" height="10" rx="1.5" fill="#7C5CFF" transform={`rotate(${deg} 25 25)`} />
                        ))}
                        <circle cx="25" cy="25" r="6" fill="#1F1F1F"/>
                      </svg>

                      {/* Small floating sparkles */}
                      <span className="absolute top-2 left-1/3 sparkle-twinkle">✨</span>
                      <span className="absolute bottom-2 right-1/3 sparkle-twinkle-delayed">✨</span>
                    </div>

                    <h4 className="text-base font-extrabold text-text mb-2 text-center">
                      {demoMessage}
                    </h4>

                    {/* Progress Bar Container */}
                    <div className="w-full h-4 bg-cream-dark border-2 border-card-border rounded-full overflow-hidden mb-2">
                      <motion.div
                        className="h-full progress-bar-shine rounded-full"
                        style={{ width: `${demoProgress}%` }}
                        transition={{ ease: "easeOut" }}
                      />
                    </div>
                    
                    <span className="text-xs font-bold text-text-muted text-center block">
                      {demoProgress}% Complete
                    </span>
                  </div>
                )}

                {/* Results State */}
                {demoStep === 'results' && (
                  <div className="flex-1 flex flex-col">
                    
                    <div className="flex items-center justify-between border-b-2 border-card-border pb-4 mb-4">
                      <h4 className="text-base font-extrabold text-text">Analysis Results</h4>
                      <button
                        onClick={resetDemo}
                        className="px-3.5 py-1.5 text-xs font-bold text-secondary bg-secondary/8 border-2 border-secondary/20 hover:bg-secondary/15 rounded-full transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        Reset Demo 🔄
                      </button>
                    </div>

                    {/* Scrollable results list */}
                    <div className="flex-1 flex flex-col gap-4 overflow-y-auto max-h-[300px] pr-2">
                      
                      {/* ATS Gauge Card */}
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-accent-green/5 border-2 border-accent-green/20 rounded-2xl flex items-center justify-between"
                      >
                        <div>
                          <span className="text-xs font-bold text-accent-green block uppercase tracking-wide">ATS SCORE</span>
                          <span className="text-sm font-black text-text">Compatibility Match</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xl font-black text-accent-green">92%</span>
                          {/* Mini Arc Gauge */}
                          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                            <circle cx="18" cy="18" r="15" stroke="#E5E7EB" strokeWidth="4"/>
                            <circle cx="18" cy="18" r="15" stroke="#4CAF50" strokeWidth="4" strokeDasharray="94" strokeDashoffset="7" strokeLinecap="round" transform="rotate(-90 18 18)"/>
                          </svg>
                        </div>
                      </motion.div>

                      {/* Skills Found */}
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="p-4 bg-white border border-card-border rounded-2xl"
                      >
                        <span className="text-xs font-bold text-accent-green block uppercase tracking-wide mb-2">✓ Skills Found</span>
                        <div className="flex flex-wrap gap-2">
                          {['Python', 'SQL', 'Power BI', 'Excel'].map((s) => (
                            <span key={s} className="px-2.5 py-1 bg-accent-green/8 text-accent-green text-xs font-bold rounded-lg border border-accent-green/10">
                              ✓ {s}
                            </span>
                          ))}
                        </div>
                      </motion.div>

                      {/* Missing Skills */}
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="p-4 bg-white border border-card-border rounded-2xl"
                      >
                        <span className="text-xs font-bold text-accent-orange block uppercase tracking-wide mb-2">⚠ Missing Skills</span>
                        <div className="flex flex-wrap gap-2">
                          {['AWS', 'Docker', 'Communication'].map((s) => (
                            <span key={s} className="px-2.5 py-1 bg-accent-orange/8 text-accent-orange text-xs font-bold rounded-lg border border-accent-orange/10">
                              ⚠ {s}
                            </span>
                          ))}
                        </div>
                      </motion.div>

                      {/* Job Matches */}
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.45 }}
                        className="p-4 bg-white border border-card-border rounded-2xl"
                      >
                        <span className="text-xs font-bold text-secondary block uppercase tracking-wide mb-2.5">💼 Job Matches</span>
                        <div className="flex flex-col gap-2">
                          {[
                            { name: 'Infosys', match: '95%' },
                            { name: 'TCS', match: '91%' },
                            { name: 'Microsoft', match: '84%' },
                            { name: 'Google', match: '79%' }
                          ].map((job) => (
                            <div key={job.name} className="flex justify-between items-center text-xs font-bold border-b border-card-border/40 pb-1.5 last:border-b-0 last:pb-0">
                              <span className="text-text">{job.name}</span>
                              <span className="text-secondary">{job.match} Match</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>

                    </div>
                  </div>
                )}

              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Placeholders for future sections */}
      <div id="pricing" className="h-[20px]" />


      {/* ═══════════════════════════════════════════
          PLAYFUL CTA CARD — Thumbs-Up Mascot
          ═══════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 pb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="cta-section px-8 sm:px-12 py-10 sm:py-12 flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-5">
            <ThumbsUpRobot className="w-20 h-20 sm:w-24 sm:h-24 shrink-0" />
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-text">
                Ready to Analyze Your Own Resume? <Rocket className="w-5 h-5 inline-block text-accent-orange" />
              </h3>
              <p className="text-sm text-text-light mt-1 max-w-lg">
                Upload your resume and unlock personalized career insights powered by AI.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <motion.a
              href="#upload"
              onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}
              whileHover={{ y: -3, scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="btn-yellow inline-flex items-center gap-2 px-6 py-3 text-base shadow-[0_4px_14px_rgba(255,213,79,0.35)] cursor-pointer"
            >
              Analyze My Resume <ArrowRight className="w-5 h-5" />
            </motion.a>
            <motion.a
              href="#how-it-works"
              onClick={(e) => { e.preventDefault(); scrollToSection('how-it-works'); }}
              whileHover={{ y: -3, scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="btn-outline inline-flex items-center gap-2 px-6 py-3 text-base cursor-pointer"
            >
              Learn More
            </motion.a>
          </div>
        </motion.div>
      </section>


      {/* ═══════════════════════════════════════════
          FOOTER / CONTACT
          ═══════════════════════════════════════════ */}
      <footer id="contact" className="border-t-2 border-card-border py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <SmallRobot className="w-7 h-7" />
            <span className="text-sm font-bold text-text">
              Career<span className="text-secondary">Lens</span>AI
            </span>
          </div>
          <p className="text-xs text-text-muted font-semibold">
            © 2026 CareerLensAI. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {['Privacy', 'Terms', 'Contact'].map(l => (
              <a
                key={l}
                href={l === 'Contact' ? '#contact' : `#${l.toLowerCase()}`}
                onClick={(e) => {
                  if (l === 'Contact') {
                    e.preventDefault();
                    scrollToSection('contact');
                  }
                }}
                className="text-xs font-bold text-text-light hover:text-secondary transition-colors"
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </footer>

    </div>
  );
}
