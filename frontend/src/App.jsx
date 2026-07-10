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
  Rocket,
  Bell,
  Settings
} from 'lucide-react';

// Authentication Experience Component Imports
import AuthLayout from './components/auth/AuthLayout';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import ForgotPassword from './components/auth/ForgotPassword';
import VerifyEmail from './components/auth/VerifyEmail';
import UploadLayout from './components/upload/UploadLayout';
import Dashboard from './pages/Dashboard';

/* ═══════════════════════════════════════════════════
   INLINE SVG COMPONENTS — Cartoon Illustrations
   ═══════════════════════════════════════════════════ */

// Cute AI Robot Mascot — Now with CSS animation classes for blink + breathe
// Cute AI Robot Mascot Sitting at Laptop — Telling a Resume Scan Story
const RobotMascot = ({ className = '' }) => (
  <svg viewBox="0 0 320 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Table Top */}
    <line x1="20" y1="260" x2="300" y2="260" stroke="#1F1F1F" strokeWidth="4" strokeLinecap="round" />
    <path d="M 60 260 L 50 295 M 260 260 L 270 295" stroke="#1F1F1F" strokeWidth="3.5" strokeLinecap="round" />
    
    {/* Laptop base and screen */}
    <rect x="145" y="248" width="60" height="12" rx="3" fill="#E5E7EB" stroke="#1F1F1F" strokeWidth="2.5" />
    <path d="M 155 248 L 150 220 L 200 220 L 195 248 Z" fill="white" stroke="#1F1F1F" strokeWidth="2.5" strokeLinejoin="round" />
    {/* Glowing laptop screen content */}
    <rect x="156" y="224" width="38" height="20" rx="2" fill="#7C5CFF" opacity="0.15" />
    <line x1="162" y1="230" x2="188" y2="230" stroke="#7C5CFF" strokeWidth="2" strokeLinecap="round" />
    <line x1="162" y1="236" x2="182" y2="236" stroke="#7C5CFF" strokeWidth="2" strokeLinecap="round" />

    {/* Floating Holographic Dashboard Behind */}
    <g opacity="0.95" className="floating-bubble-slow">
      <rect x="175" y="25" width="130" height="95" rx="14" fill="white" stroke="#1F1F1F" strokeWidth="2.5" />
      {/* Mini ATS Gauge circle */}
      <circle cx="215" cy="70" r="20" fill="#FFFDF9" stroke="#1F1F1F" strokeWidth="2" />
      <circle cx="215" cy="70" r="20" fill="none" stroke="#22C55E" strokeWidth="4" strokeDasharray="125" strokeDashoffset="30" strokeLinecap="round" />
      <text x="215" y="74" textAnchor="middle" fontSize="10" fontWeight="900" fill="#1F1F1F">92%</text>
      
      {/* Stat lines and mini bar charts */}
      <rect x="246" y="45" width="44" height="6" rx="2" fill="#FFD54F" stroke="#1F1F1F" strokeWidth="1.5" />
      <rect x="246" y="61" width="36" height="6" rx="2" fill="#7C5CFF" stroke="#1F1F1F" strokeWidth="1.5" />
      <rect x="246" y="77" width="40" height="6" rx="2" fill="#FF8A50" stroke="#1F1F1F" strokeWidth="1.5" />
    </g>

    {/* Connecting light rays from laptop to hologram */}
    <path d="M 175 220 L 195 125 M 190 220 L 265 125" stroke="#7C5CFF" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4" />

    {/* Star Sparkles */}
    <path d="M 20 60 L 22 63 L 25 64 L 22 65 L 20 68 L 18 65 L 15 64 L 18 63 Z" fill="#FFD54F" stroke="#E6BE3D" strokeWidth="1" />
    <path d="M 20 220 L 22 223 L 25 224 L 22 225 L 20 228 L 18 225 L 15 224 L 18 223 Z" fill="#FF8A50" stroke="#E67E22" strokeWidth="1" />

    {/* Robot Mascot Sitting */}
    <g className="robot-body-breathe" transform="translate(60, 95)">
      {/* Body shadow on table */}
      <ellipse cx="60" cy="158" rx="35" ry="5" fill="#E8D5B0" opacity="0.4" />

      {/* Torso */}
      <rect x="30" y="85" width="60" height="58" rx="14" fill="#7C5CFF" stroke="#1F1F1F" strokeWidth="2.5" />
      <rect x="38" y="93" width="44" height="40" rx="8" fill="#FFF9ED" opacity="0.3" />

      {/* Head with breathing and head-tilt */}
      <g>
        {/* Antenna */}
        <line x1="60" y1="28" x2="60" y2="15" stroke="#7C5CFF" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="60" cy="10" r="5" fill="#FFD54F" stroke="#1F1F1F" strokeWidth="2" />

        {/* Head Box */}
        <rect x="15" y="28" width="90" height="66" rx="16" fill="#7C5CFF" stroke="#1F1F1F" strokeWidth="2.5" />
        <rect x="21" y="34" width="78" height="54" rx="12" fill="white" />

        {/* Eyes (blinking) */}
        <g className="robot-eye">
          <circle cx="43" cy="56" r="8" fill="#1F1F1F" />
          <circle cx="46" cy="52" r="2.5" fill="white" />
        </g>
        <g className="robot-eye-delayed">
          <circle cx="77" cy="56" r="8" fill="#1F1F1F" />
          <circle cx="80" cy="52" r="2.5" fill="white" />
        </g>

        {/* Blush & Smile */}
        <ellipse cx="29" cy="66" rx="5" ry="3" fill="#FFB4B4" opacity="0.5" />
        <ellipse cx="91" cy="66" rx="5" ry="3" fill="#FFB4B4" opacity="0.5" />
        <path d="M 48 68 Q 60 76 72 68" stroke="#1F1F1F" strokeWidth="3" strokeLinecap="round" fill="none" />
        
        {/* Ears */}
        <rect x="1" y="44" width="14" height="24" rx="6" fill="#FFD54F" stroke="#1F1F1F" strokeWidth="2" />
        <rect x="105" y="44" width="14" height="24" rx="6" fill="#FFD54F" stroke="#1F1F1F" strokeWidth="2" />
      </g>

      {/* Left Hand: Typing on laptop */}
      <path d="M 30 115 Q 55 110 88 135" stroke="#7C5CFF" strokeWidth="7.5" strokeLinecap="round" />
      <circle cx="88" cy="135" r="5.5" fill="#FFD54F" stroke="#1F1F1F" strokeWidth="2" />

      {/* Right Hand: Analyzing & holding resume */}
      <path d="M 90 110 Q 115 102 120 112" stroke="#7C5CFF" strokeWidth="7.5" strokeLinecap="round" />
      <circle cx="120" cy="112" r="5.5" fill="#FFD54F" stroke="#1F1F1F" strokeWidth="2" />

      {/* Resume Document held in hand */}
      <g transform="translate(112, 60) rotate(14)">
        <rect width="32" height="44" rx="4" fill="white" stroke="#1F1F1F" strokeWidth="2" />
        <line x1="6" y1="10" x2="26" y2="10" stroke="#E5E7EB" strokeWidth="2" />
        <line x1="6" y1="18" x2="22" y2="18" stroke="#E5E7EB" strokeWidth="2" />
        <line x1="6" y1="26" x2="26" y2="26" stroke="#7C5CFF" strokeWidth="2" />
      </g>

      {/* Legs */}
      <rect x="42" y="143" width="10" height="12" rx="3" fill="#FFD54F" stroke="#1F1F1F" strokeWidth="2" />
      <rect x="68" y="143" width="10" height="12" rx="3" fill="#FFD54F" stroke="#1F1F1F" strokeWidth="2" />
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

// Dynamic Mascot for interactive demo that reacts to steps
const InteractiveDemoRobot = ({ step }) => {
  const isScanning = step === 'scanning';
  const isProcessing = step === 'processing';
  const isResults = step === 'results';

  // Arms position
  let leftArmD = "M 30 100 Q 15 110 20 125";
  let rightArmD = "M 110 100 Q 125 110 120 125";
  
  if (isScanning) {
    leftArmD = "M 30 100 Q 0 85 10 70"; // reaches out to catch the resume
  } else if (isResults) {
    leftArmD = "M 30 100 Q 10 70 20 55"; // celebrating
    rightArmD = "M 110 100 Q 130 70 120 55";
  }

  // Mouth path
  let mouthPath = "M 55 78 Q 70 88 85 78";
  if (isProcessing) {
    mouthPath = "M 60 82 H 80";
  } else if (isResults) {
    mouthPath = "M 52 75 Q 70 95 88 75 Z";
  }

  return (
    <svg viewBox="0 0 140 180" fill="none" className="w-32 h-40 select-none">
      {/* Shadow */}
      <ellipse cx="70" cy="165" rx="35" ry="6" fill="#E8D5B0" opacity="0.4"/>
      
      {/* Left Arm */}
      <motion.path
        d={leftArmD}
        stroke="#7C5CFF"
        strokeWidth="7"
        strokeLinecap="round"
        animate={isResults ? { y: [0, -5, 0] } : {}}
        transition={{ repeat: Infinity, duration: 0.6 }}
      />
      {/* Right Arm */}
      <motion.path
        d={rightArmD}
        stroke="#7C5CFF"
        strokeWidth="7"
        strokeLinecap="round"
        animate={isResults ? { y: [0, -5, 0] } : {}}
        transition={{ repeat: Infinity, duration: 0.6, delay: 0.1 }}
      />

      {/* Head */}
      <motion.g
        animate={isProcessing ? { y: [0, -2, 0], rotate: [-1.1, 1.1, -1.1] } : { y: [0, -3, 0] }}
        transition={{ repeat: Infinity, duration: isProcessing ? 1.4 : 3, ease: "easeInOut" }}
        style={{ transformOrigin: "70px 105px" }}
      >
        {/* Antenna */}
        <line x1="70" y1="28" x2="70" y2="15" stroke="#7C5CFF" strokeWidth="3" strokeLinecap="round"/>
        <circle cx="70" cy="11" r="4" fill="#FFD54F"/>
        {/* Ears */}
        <rect x="18" y="44" width="10" height="15" rx="4" fill="#FFD54F"/>
        <rect x="112" y="44" width="10" height="15" rx="4" fill="#FFD54F"/>
        
        {/* Head Shape */}
        <rect x="25" y="28" width="90" height="75" rx="18" fill="#7C5CFF" stroke="#5b3fc4" strokeWidth="1"/>
        <rect x="31" y="34" width="78" height="63" rx="14" fill="white"/>

        {/* Eyes */}
        {isResults ? (
          <>
            <path d="M 45 60 Q 55 50 65 60" stroke="#1F1F1F" strokeWidth="4.5" strokeLinecap="round" fill="none"/>
            <path d="M 75 60 Q 85 50 95 60" stroke="#1F1F1F" strokeWidth="4.5" strokeLinecap="round" fill="none"/>
          </>
        ) : (
          <>
            <g className="robot-eye">
              <circle cx="53" cy="58" r="7" fill="#1F1F1F"/>
              <circle cx="55.5" cy="55.5" r="2.5" fill="white"/>
            </g>
            <g className="robot-eye-delayed">
              <circle cx="87" cy="58" r="7" fill="#1F1F1F"/>
              <circle cx="89.5" cy="55.5" r="2.5" fill="white"/>
            </g>
          </>
        )}

        {/* Blush */}
        <ellipse cx="43" cy="72" rx="6" ry="3.5" fill="#FFB4B4" opacity="0.6"/>
        <ellipse cx="97" cy="72" rx="6" ry="3.5" fill="#FFB4B4" opacity="0.6"/>

        {/* Mouth */}
        <path d={mouthPath} fill={isResults ? "#FF8A50" : "none"} stroke="#1F1F1F" strokeWidth="3" strokeLinecap="round"/>
      </motion.g>

      {/* Torso */}
      <rect x="42" y="103" width="56" height="42" rx="10" fill="#7C5CFF" stroke="#5b3fc4" strokeWidth="1"/>
      <rect x="50" y="111" width="40" height="26" rx="6" fill="#F9F5EB"/>
      
      {/* Indicator Light */}
      <circle cx="70" cy="124" r="5" fill={isProcessing ? "#4CAF50" : isResults ? "#FFD54F" : "#FF8A50"} className={isProcessing ? "sparkle-twinkle" : ""}/>

      {/* Legs */}
      <rect x="50" y="145" width="10" height="20" rx="3" fill="#FFD54F"/>
      <rect x="80" y="145" width="10" height="20" rx="3" fill="#FFD54F"/>
    </svg>
  );
};

// Robot mascot pointing right for Bottom CTA
const PointingRobot = ({ className = '' }) => (
  <svg viewBox="0 0 160 160" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Shadow */}
    <ellipse cx="80" cy="145" rx="40" ry="6" fill="#E8D5B0" opacity="0.4"/>
    
    {/* Body Legs */}
    <rect x="62" y="125" width="10" height="15" rx="2" fill="#FFD54F"/>
    <rect x="88" y="125" width="10" height="15" rx="2" fill="#FFD54F"/>
    
    {/* Torso */}
    <rect x="50" y="85" width="60" height="45" rx="12" fill="#7C5CFF" stroke="#5b3fc4" strokeWidth="1"/>
    <rect x="58" y="93" width="44" height="29" rx="6" fill="#F9F5EB"/>
    <circle cx="80" cy="107" r="5" fill="#4CAF50" className="sparkle-twinkle"/>

    {/* Left Arm at rest */}
    <path d="M 46 95 Q 35 115 42 125" stroke="#7C5CFF" strokeWidth="6" strokeLinecap="round"/>

    {/* Right Arm POINTING to the right */}
    <path d="M 112 95 Q 135 90 148 95" stroke="#7C5CFF" strokeWidth="6.5" strokeLinecap="round"/>
    <path d="M 148 95 H 158" stroke="#FFD54F" strokeWidth="5.5" strokeLinecap="round"/>
    <circle cx="148" cy="95" r="5" fill="#FFD54F"/>

    {/* Head (sitting slightly tilted) */}
    <motion.g
      animate={{ y: [0, -3, 0], rotate: [-2, 2, -2] }}
      transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
      style={{ transformOrigin: "80px 85px" }}
    >
      {/* Antenna */}
      <line x1="80" y1="25" x2="80" y2="12" stroke="#7C5CFF" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="80" cy="8" r="4" fill="#FFD54F"/>
      
      {/* Head Box */}
      <rect x="35" y="25" width="90" height="64" rx="16" fill="#7C5CFF" stroke="#5b3fc4" strokeWidth="1"/>
      <rect x="41" y="31" width="78" height="52" rx="12" fill="white"/>

      {/* Eyes */}
      <g className="robot-eye">
        <circle cx="63" cy="52" r="6" fill="#1F1F1F"/>
        <circle cx="65.5" cy="49.5" r="2.2" fill="white"/>
      </g>
      <g className="robot-eye-delayed">
        <circle cx="97" cy="52" r="6" fill="#1F1F1F"/>
        <circle cx="99.5" cy="49.5" r="2.2" fill="white"/>
      </g>

      {/* Smile */}
      <path d="M 68 68 Q 80 76 92 68" stroke="#1F1F1F" strokeWidth="3" strokeLinecap="round" fill="none"/>
      
      {/* Blush */}
      <ellipse cx="51" cy="62" rx="5" ry="3" fill="#FFB4B4" opacity="0.6"/>
      <ellipse cx="109" cy="62" rx="5" ry="3" fill="#FFB4B4" opacity="0.6"/>
    </motion.g>
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

  // FAQ Accordion State Hook
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  // Custom Navigation Router State Hooks
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [activeField, setActiveField] = useState(null);
  const [authStatus, setAuthStatus] = useState('idle'); // 'idle' | 'success' | 'error' | 'forgot' | 'verify'

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
      // Reset animations state
      setActiveField(null);
      setAuthStatus('idle');
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    // Reset animations state
    setActiveField(null);
    setAuthStatus(path === '/verify-email' ? 'verify' : 'idle');
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const cleanPath = currentPath.split('?')[0];
    const protectedRoutes = ['/upload', '/dashboard'];
    const authRoutes = ['/login', '/signup', '/forgot-password', '/verify-email'];

    if (protectedRoutes.includes(cleanPath)) {
      if (!token) {
        navigateTo('/login');
      }
    } else if (authRoutes.includes(cleanPath)) {
      if (token) {
        navigateTo('/upload');
      }
    }
  }, [currentPath]);
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

  // Scroll lock ref to prevent performance-costly re-renders during active scrolling
  const isScrollingRef = React.useRef(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Optimized Scroll Spy and active link indicator
  useEffect(() => {
    let ticking = false;
    const handleScrollSpy = () => {
      if (isScrollingRef.current) return;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const sectionIds = ['home', 'features', 'how-it-works', 'faq', 'contact'];
          
          if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60) {
            setActiveLink('Contact');
            ticking = false;
            return;
          }

          const scrollPosition = window.scrollY + 120; // smaller offset for exact triggers

          for (let i = sectionIds.length - 1; i >= 0; i--) {
            const id = sectionIds[i];
            const el = document.getElementById(id);
            if (el) {
              if (scrollPosition >= el.offsetTop) {
                const mappedName = 
                  id === 'home' ? 'Home' :
                  id === 'features' ? 'Features' :
                  id === 'how-it-works' ? 'How it Works' :
                  id === 'faq' ? 'FAQ' :
                  id === 'contact' ? 'Contact' : 'Home';
                
                // Only update state if active link actually changed to prevent expensive re-renders
                setActiveLink(prev => prev !== mappedName ? mappedName : prev);
                break;
              }
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScrollSpy);
    handleScrollSpy();
    return () => window.removeEventListener('scroll', handleScrollSpy);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      isScrollingRef.current = true;
      el.scrollIntoView({ behavior: 'smooth' });
      const mappedName = 
        id === 'home' ? 'Home' :
        id === 'features' ? 'Features' :
        id === 'how-it-works' ? 'How it Works' :
        id === 'faq' ? 'FAQ' :
        id === 'contact' ? 'Contact' : 'Home';
      setActiveLink(mappedName);
      
      // Unlock Scroll Spy calculations after scroll animation completes
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 700);
    }
  };

  // Optimized Animation variants (trigger once when visible, standard timings)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.05 }
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1, y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.94 },
    visible: {
      opacity: 1, scale: 1,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }
    }
  };

  // Slower gentle cartoon wiggles for decorative items to reduce CPU usage
  const float = (dur, delay = 0) => ({
    y: [0, -6, 0],
    transition: { duration: dur + 1.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay }
  });

  const floatRotate = (dur, delay = 0, deg = 5) => ({
    y: [0, -6, 0],
    rotate: [-deg, deg, -deg],
    transition: { duration: dur + 1.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay }
  });

  const navLinks = ['Home', 'Features', 'How it Works', 'FAQ', 'Contact'];

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
  // Route-based Page Rendering Switch
  const cleanPath = currentPath.split('?')[0];

  if (cleanPath === '/login') {
    return (
      <AuthLayout activeField={activeField} status={authStatus} onNavigate={navigateTo}>
        <Login
          onNavigate={navigateTo}
          onSuccess={() => navigateTo('/upload')}
          onActiveFieldChange={setActiveField}
          setStatus={setAuthStatus}
        />
      </AuthLayout>
    );
  }
  if (cleanPath === '/signup') {
    return (
      <AuthLayout activeField={activeField} status={authStatus} onNavigate={navigateTo}>
        <Signup
          onNavigate={navigateTo}
          onSuccess={() => navigateTo('/verify-email')}
          onActiveFieldChange={setActiveField}
          setStatus={setAuthStatus}
        />
      </AuthLayout>
    );
  }
  if (cleanPath === '/forgot-password') {
    return (
      <AuthLayout activeField={activeField} status={authStatus} onNavigate={navigateTo}>
        <ForgotPassword onNavigate={navigateTo} />
      </AuthLayout>
    );
  }
  if (cleanPath === '/verify-email') {
    return (
      <AuthLayout activeField={activeField} status={authStatus} onNavigate={navigateTo}>
        <VerifyEmail onNavigate={navigateTo} />
      </AuthLayout>
    );
  }
  if (cleanPath === '/upload') {
    return <UploadLayout onNavigate={navigateTo} />;
  }
  if (cleanPath === '/dashboard') {
    return <Dashboard onNavigate={navigateTo} />;
  }

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
              onClick={(e) => { e.preventDefault(); navigateTo('/login'); }}
              className="px-5 py-2.5 text-[14px] font-bold text-text-light hover:text-text border-2 border-gray-200 hover:border-gray-300 rounded-full transition-all duration-200 cursor-pointer"
            >
              Log In
            </a>
            <motion.a
              href="#signup"
              onClick={(e) => { e.preventDefault(); navigateTo('/signup'); }}
              whileHover={{ y: -2, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="btn-yellow text-[14px] !py-2.5 !px-6 flex items-center gap-1.5 cursor-pointer"
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
                <a
                  href="#login"
                  onClick={(e) => { e.preventDefault(); navigateTo('/login'); setIsMobileMenuOpen(false); }}
                  className="text-center py-3 text-base font-bold text-text-light hover:text-text rounded-full border-2 border-gray-200"
                >
                  Log In
                </a>
                <a
                  href="#signup"
                  onClick={(e) => { e.preventDefault(); navigateTo('/signup'); setIsMobileMenuOpen(false); }}
                  className="btn-yellow text-center text-base"
                >
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
                href="#signup"
                onClick={(e) => { e.preventDefault(); navigateTo('/signup'); }}
                whileHover={{ y: -3, scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="btn-yellow inline-flex items-center gap-2.5 text-base cursor-pointer"
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

          {/* Main Layout Grid (3 columns on desktop, stacks on mobile) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 items-stretch max-w-6xl mx-auto relative">

            {/* Absolute positioned floating resume (for scanning step animation, desktop only) */}
            <AnimatePresence>
              {demoStep === 'scanning' && (
                <motion.div
                  initial={{ left: "15%", top: "45%", opacity: 0, scale: 0.8 }}
                  animate={{
                    // Floats from left (15%) to robot hand (45%) to machine scanner (80%)
                    left: ["15%", "45%", "80%"],
                    top: ["45%", "35%", "50%"],
                    opacity: [0, 1, 1, 0],
                    scale: [0.8, 1.15, 1.15, 0.4]
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 2.0,
                    times: [0, 0.5, 0.8, 1.0],
                    ease: "easeInOut"
                  }}
                  className="absolute w-14 h-20 z-30 pointer-events-none hidden lg:block"
                >
                  <svg viewBox="0 0 60 80" fill="none" className="w-full h-full shadow-md bg-white rounded-lg border-2 border-[#7C5CFF]">
                    <rect width="60" height="80" rx="8" fill="white"/>
                    <line x1="12" y1="20" x2="48" y2="20" stroke="#D1D5DB" strokeWidth="2.5"/>
                    <line x1="12" y1="35" x2="40" y2="35" stroke="#D1D5DB" strokeWidth="2.5"/>
                    <line x1="12" y1="50" x2="44" y2="50" stroke="#D1D5DB" strokeWidth="2.5"/>
                  </svg>
                </motion.div>
              )}
            </AnimatePresence>

            {/* LEFT SIDE: Interactive Upload Card (span-4) */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-4 flex flex-col"
            >
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDemoDragOver(true); }}
                onDragLeave={() => setIsDemoDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setIsDemoDragOver(false); startDemo(); }}
                onClick={startDemo}
                className={`feature-card flex-1 flex flex-col items-center justify-center text-center p-8 cursor-pointer transition-all duration-300 min-h-[360px] ${
                  isDemoDragOver ? 'demo-upload-glowing' : ''
                }`}
              >
                {/* Upload Icon */}
                <motion.div
                  animate={isDemoDragOver || demoStep === 'scanning' ? { scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] } : {}}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="w-20 h-20 rounded-3xl bg-secondary/8 flex items-center justify-center mb-6 text-secondary"
                >
                  <Upload className="w-10 h-10" />
                </motion.div>

                <h3 className="text-lg font-extrabold text-text mb-2">
                  Drag Resume Here
                </h3>
                <p className="text-sm text-text-light mb-6">
                  or <span className="text-secondary font-bold hover:underline">Browse Files</span>
                </p>

                <div className="flex gap-3 text-xs font-semibold text-text-muted">
                  <span className="px-3 py-1 bg-cream-dark border border-card-border rounded-md">PDF</span>
                  <span className="px-3 py-1 bg-cream-dark border border-card-border rounded-md">DOCX</span>
                </div>
              </div>
            </motion.div>

            {/* CENTER: Cute AI Robot Mascot (span-3) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-3 flex flex-col items-center justify-center p-4 relative"
            >
              <InteractiveDemoRobot step={demoStep} />

              {/* Celebrating Confetti/Sparkles in Results State */}
              {demoStep === 'results' && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  {[...Array(12)].map((_, idx) => (
                    <motion.span
                      key={idx}
                      initial={{ y: 80, x: 0, scale: 0.5, opacity: 1 }}
                      animate={{
                        y: [-20, -120],
                        x: [0, (idx % 2 === 0 ? 45 : -45) * (idx * 0.2 + 0.5)],
                        rotate: [0, 360],
                        opacity: [1, 0]
                      }}
                      transition={{
                        duration: 2.2,
                        repeat: Infinity,
                        delay: idx * 0.15,
                        ease: "easeOut"
                      }}
                      className="absolute text-xl"
                      style={{
                        left: `${35 + (idx % 3) * 15}%`,
                        top: '60%'
                      }}
                    >
                      {['🎉', '✨', '🎈', '⭐', '🌸'][idx % 5]}
                    </motion.span>
                  ))}
                </div>
              )}
            </motion.div>

            {/* RIGHT SIDE: AI Processing / Results Panel (span-5) */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-5 flex flex-col"
            >
              <div className={`feature-card flex-1 flex flex-col p-6 sm:p-8 min-h-[360px] transition-all duration-500 ${
                demoStep === 'processing' ? 'demo-machine-glowing' : ''
              }`}>

                {/* Idle State */}
                {demoStep === 'idle' && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-full bg-cream-dark flex items-center justify-center text-text-muted mb-4 border border-card-border">
                      ⚙
                    </div>
                    <h3 className="text-[17px] font-extrabold text-text mb-2">
                      AI Processing Machine
                    </h3>
                    <p className="text-sm text-text-light max-w-xs">
                      Click or drop a resume on the left to start the magic!
                    </p>
                  </div>
                )}

                {/* Scanning state */}
                {demoStep === 'scanning' && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <motion.div
                      animate={{ scale: [1, 1.05, 1], rotate: [0, 3, -3, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="w-16 h-16 rounded-full bg-secondary/8 text-secondary flex items-center justify-center mb-4 border border-secondary/20"
                    >
                      🔍
                    </motion.div>
                    <h3 className="text-[17px] font-extrabold text-text mb-2">
                      Catching resume... 🫴
                    </h3>
                    <p className="text-sm text-text-light max-w-xs">
                      Robot is picking the resume and sliding it into the scanner.
                    </p>
                  </div>
                )}

                {/* Processing State */}
                {demoStep === 'processing' && (
                  <div className="flex-1 flex flex-col justify-center">
                    {/* Rotating Gears */}
                    <div className="flex items-center justify-center gap-6 mb-8 relative">
                      <svg viewBox="0 0 60 60" fill="none" className="w-16 h-16 gear-spin-clockwise">
                        <circle cx="30" cy="30" r="20" fill="none" stroke="#FF8A50" strokeWidth="4"/>
                        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                          <rect key={deg} x="27" y="2" width="6" height="12" rx="2" fill="#FF8A50" transform={`rotate(${deg} 30 30)`} />
                        ))}
                        <circle cx="30" cy="30" r="8" fill="#1F1F1F"/>
                      </svg>
                      
                      <svg viewBox="0 0 50 50" fill="none" className="w-12 h-12 gear-spin-counter">
                        <circle cx="25" cy="25" r="16" fill="none" stroke="#7C5CFF" strokeWidth="3"/>
                        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                          <rect key={deg} x="23" y="1" width="4" height="10" rx="1.5" fill="#7C5CFF" transform={`rotate(${deg} 25 25)`} />
                        ))}
                        <circle cx="25" cy="25" r="6" fill="#1F1F1F"/>
                      </svg>

                      <span className="absolute top-2 left-1/3 sparkle-twinkle">✨</span>
                      <span className="absolute bottom-2 right-1/3 sparkle-twinkle-delayed">✨</span>
                    </div>

                    <div className="mb-4 text-center">
                      <h4 className="text-base font-extrabold text-text mb-1">
                        ⚙ {demoMessage}
                      </h4>
                      {/* Playful ASCII loader bar */}
                      <span className="text-sm font-mono text-secondary block select-none">
                        {demoProgress < 30 ? "███░░░░░░░" : demoProgress < 60 ? "██████░░░░" : demoProgress < 90 ? "████████░░" : "██████████"}
                      </span>
                    </div>

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

                    {/* Scrollable results list (popping out one after another) */}
                    <div className="flex-1 flex flex-col gap-4 overflow-y-auto max-h-[300px] pr-2">
                      
                      {/* Card 1: ATS Score */}
                      <motion.div
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, type: "spring", stiffness: 120 }}
                        className="p-4 bg-accent-green/5 border-2 border-accent-green/20 rounded-2xl flex items-center justify-between shadow-sm"
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

                      {/* Card 2: Skills Found */}
                      <motion.div
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, type: "spring", stiffness: 120 }}
                        className="p-4 bg-white border border-card-border rounded-2xl shadow-sm"
                      >
                        <span className="text-xs font-bold text-accent-green block uppercase tracking-wide mb-2">✓ Skills Found</span>
                        <div className="flex flex-wrap gap-2">
                          {['Python', 'SQL', 'Power BI'].map((s) => (
                            <span key={s} className="px-2.5 py-1 bg-accent-green/8 text-accent-green text-xs font-bold rounded-lg border border-accent-green/10">
                              ✓ {s}
                            </span>
                          ))}
                        </div>
                      </motion.div>

                      {/* Card 3: Missing Skills */}
                      <motion.div
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, type: "spring", stiffness: 120 }}
                        className="p-4 bg-white border border-card-border rounded-2xl shadow-sm"
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

                      {/* Card 4: Job Matches */}
                      <motion.div
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, type: "spring", stiffness: 120 }}
                        className="p-4 bg-white border border-card-border rounded-2xl shadow-sm"
                      >
                        <span className="text-xs font-bold text-secondary block uppercase tracking-wide mb-2.5">💼 Job Matches</span>
                        <div className="flex flex-col gap-2">
                          {[
                            { name: 'Infosys', match: '95%' },
                            { name: 'Microsoft', match: '90%' }
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

      {/* ═══════════════════════════════════════════
          DASHBOARD PREVIEW SECTION
          ═══════════════════════════════════════════ */}
      <section className="relative z-10 py-20 sm:py-28 bg-cream border-t border-card-border overflow-hidden" id="dashboard-preview">
        
        {/* Slow floating decorative elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{ y: [-15, 15, -15], rotate: [0, 10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[12%] left-[8%] opacity-35"
          >
            <TinySparkle className="w-6 h-6" color="#FFD54F" />
          </motion.div>
          <motion.div
            animate={{ y: [15, -15, 15], rotate: [0, -10, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[14%] right-[6%] opacity-35"
          >
            <TinySparkle className="w-6 h-6" color="#7C5CFF" />
          </motion.div>
          <motion.div
            animate={{ x: [-10, 10, -10], y: [-10, 10, -10] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[28%] right-[8%] opacity-30"
          >
            <PaperAirplane className="w-8 h-8" />
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
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary/10 border-2 border-secondary/20 text-sm font-bold text-text mb-5">
              📊 Dashboard Preview
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-black text-text leading-[1.15]">
              Your <span className="text-secondary bg-secondary/8 px-3 rounded-xl border border-secondary/15">Career</span>,<br />Visualized Beautifully
            </h2>
            <div className="flex justify-center mt-3 mb-5">
              <svg width="80" height="14" viewBox="0 0 80 14" fill="none">
                <path d="M3 10 Q12 3 24 9 Q36 15 48 8 Q60 1 72 9" stroke="#7C5CFF" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
              </svg>
            </div>
            <p className="text-text-light text-base sm:text-[17px] leading-relaxed max-w-2xl mx-auto">
              CareerLensAI transforms your resume into powerful insights, personalized recommendations, ATS optimization and career analytics — all in one beautiful dashboard.
            </p>
          </motion.div>

          {/* 60 / 40 Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-7xl mx-auto">

            {/* LEFT SIDE: Premium Dashboard Preview (60%) */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.2 }}
              className="lg:col-span-7 flex flex-col"
            >
              {/* Premium Browser Window Frame */}
              <div className="bg-white border-3 border-text rounded-3xl overflow-hidden shadow-[8px_8px_0px_#1F1F1F] flex flex-col w-full">
                
                {/* Browser Top Bar */}
                <div className="bg-cream-dark border-b-3 border-text px-4 py-3 flex items-center justify-between select-none">
                  {/* Dots */}
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-accent-orange border-2 border-text inline-block" />
                    <span className="w-3.5 h-3.5 rounded-full bg-primary border-2 border-text inline-block" />
                    <span className="w-3.5 h-3.5 rounded-full bg-accent-green border-2 border-text inline-block" />
                  </div>
                  {/* Title / URL Bar */}
                  <div className="bg-white border-2 border-text rounded-lg px-4 py-1 text-xs font-semibold text-text-light w-1/2 text-center truncate">
                    careerlensai.com/dashboard/samarth
                  </div>
                  <div className="w-12" />
                </div>

                {/* Dashboard Inner Top Bar */}
                <div className="border-b-2 border-card-border px-6 py-4 flex items-center justify-between bg-cream/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary border-2 border-text flex items-center justify-center font-black text-text text-sm">
                      S
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-text leading-tight">Hello Samarth 👋</h4>
                      <span className="text-[11px] text-text-muted font-bold block">Uploaded July 5</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5">
                    {/* Shaking Notification Bell */}
                    <motion.button
                      animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                      transition={{ repeat: Infinity, repeatDelay: 4.5, duration: 0.7 }}
                      className="p-2 rounded-xl border-2 border-card-border hover:bg-cream-dark transition-colors cursor-pointer text-text relative"
                    >
                      <Bell className="w-4.5 h-4.5" />
                      <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-accent-orange border border-white" />
                    </motion.button>

                    <button className="p-2 rounded-xl border-2 border-card-border hover:bg-cream-dark transition-colors cursor-pointer text-text">
                      <Settings className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </div>

                {/* Dashboard Widgets Content */}
                <div className="p-6 bg-cream/2 bg-opacity-35 flex flex-col gap-6 max-h-[640px] overflow-y-auto">

                  {/* FIRST ROW: Four Stat Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    
                    {/* Widget 1: ATS Score */}
                    <motion.div
                      whileHover={{ y: -4 }}
                      className="bg-white border-2 border-card-border p-3.5 rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden shadow-sm"
                    >
                      <span className="text-[10px] font-black text-text-muted uppercase tracking-wide">ATS SCORE</span>
                      <h5 className="text-xl font-black text-accent-green mt-1">92%</h5>
                      <span className="text-[10px] font-bold text-accent-green bg-accent-green/8 px-2 py-0.5 rounded-md border border-accent-green/10 mt-1.5">
                        Excellent
                      </span>
                    </motion.div>

                    {/* Widget 2: Resume Score */}
                    <motion.div
                      whileHover={{ y: -4 }}
                      className="bg-white border-2 border-card-border p-3.5 rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden shadow-sm"
                    >
                      <span className="text-[10px] font-black text-text-muted uppercase tracking-wide">RESUME SCORE</span>
                      <h5 className="text-xl font-black text-secondary mt-1">89%</h5>
                      <span className="text-[10px] font-bold text-secondary bg-secondary/8 px-2 py-0.5 rounded-md border border-secondary/10 mt-1.5 flex items-center gap-0.5">
                        Trending Up ↗
                      </span>
                    </motion.div>

                    {/* Widget 3: Jobs Matched */}
                    <motion.div
                      whileHover={{ y: -4 }}
                      className="bg-white border-2 border-card-border p-3.5 rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden shadow-sm"
                    >
                      <span className="text-[10px] font-black text-text-muted uppercase tracking-wide">JOBS MATCHED</span>
                      <h5 className="text-xl font-black text-text mt-1">124</h5>
                      <span className="text-[10px] font-bold text-text-light bg-cream-dark px-2 py-0.5 rounded-md border border-card-border mt-1.5 flex items-center gap-1">
                        💼 Matched
                      </span>
                    </motion.div>

                    {/* Widget 4: Missing Skills */}
                    <motion.div
                      whileHover={{ y: -4 }}
                      className="bg-white border-2 border-card-border p-3.5 rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden shadow-sm"
                    >
                      <span className="text-[10px] font-black text-text-muted uppercase tracking-wide">MISSING SKILLS</span>
                      <h5 className="text-xl font-black text-accent-orange mt-1">6</h5>
                      <span className="text-[10px] font-bold text-accent-orange bg-accent-orange/8 px-2 py-0.5 rounded-md border border-accent-orange/10 mt-1.5">
                        ⚠ Add Soon
                      </span>
                    </motion.div>

                  </div>

                  {/* SECOND ROW: Charts (Skill Distribution / Resume Sections) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Left: Skill Distribution (Bar Chart) */}
                    <div className="bg-white border-2 border-card-border p-4.5 rounded-2xl shadow-sm flex flex-col">
                      <h5 className="text-xs font-black text-text uppercase tracking-wide mb-3">🛠 Skill Distribution</h5>
                      <div className="flex flex-col gap-2.5">
                        {[
                          { name: 'Python', width: '95%' },
                          { name: 'SQL', width: '82%' },
                          { name: 'Power BI', width: '75%' },
                          { name: 'Machine Learning', width: '70%' },
                          { name: 'FastAPI', width: '62%' }
                        ].map((s, idx) => (
                          <div key={s.name} className="flex flex-col gap-0.5 text-xs font-bold text-text-light">
                            <div className="flex justify-between">
                              <span>{s.name}</span>
                              <span className="text-secondary">{s.width}</span>
                            </div>
                            <div className="w-full bg-cream-dark border border-card-border h-3.5 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-secondary rounded-full"
                                initial={{ width: "0%" }}
                                whileInView={{ width: s.width }}
                                viewport={{ once: true }}
                                transition={{ duration: 1.2, delay: idx * 0.1, ease: "easeOut" }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right: Resume Sections (Donut Chart) */}
                    <div className="bg-white border-2 border-card-border p-4.5 rounded-2xl shadow-sm flex flex-col items-center justify-center">
                      <h5 className="text-xs font-black text-text uppercase tracking-wide self-start mb-3">📊 Resume Sections</h5>
                      
                      <div className="flex items-center gap-5 w-full">
                        {/* Custom Segmented SVG Donut Chart */}
                        <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                          <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                            {/* Segment 1: Education (Yellow) */}
                            <motion.circle
                              cx="50" cy="50" r="38"
                              stroke="#FFD54F" strokeWidth="12" fill="none"
                              strokeDasharray="238.7"
                              initial={{ strokeDashoffset: 238.7 }}
                              whileInView={{ strokeDashoffset: 238.7 * 0.75 }}
                              viewport={{ once: true }}
                              transition={{ duration: 1.5, ease: "easeOut" }}
                            />
                            {/* Segment 2: Projects (Purple) */}
                            <motion.circle
                              cx="50" cy="50" r="38"
                              stroke="#7C5CFF" strokeWidth="12" fill="none"
                              strokeDasharray="238.7"
                              initial={{ strokeDashoffset: 238.7 }}
                              whileInView={{ strokeDashoffset: 238.7 * 0.55 }}
                              viewport={{ once: true }}
                              transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                              className="origin-center"
                              style={{ rotate: "90deg" }}
                            />
                            {/* Segment 3: Skills (Orange) */}
                            <motion.circle
                              cx="50" cy="50" r="38"
                              stroke="#FF8A50" strokeWidth="12" fill="none"
                              strokeDasharray="238.7"
                              initial={{ strokeDashoffset: 238.7 }}
                              whileInView={{ strokeDashoffset: 238.7 * 0.35 }}
                              viewport={{ once: true }}
                              transition={{ duration: 1.5, ease: "easeOut", delay: 0.4 }}
                              className="origin-center"
                              style={{ rotate: "162deg" }}
                            />
                            {/* Segment 4: Experience (Green) */}
                            <motion.circle
                              cx="50" cy="50" r="38"
                              stroke="#22C55E" strokeWidth="12" fill="none"
                              strokeDasharray="238.7"
                              initial={{ strokeDashoffset: 238.7 }}
                              whileInView={{ strokeDashoffset: 238.7 * 0.10 }}
                              viewport={{ once: true }}
                              transition={{ duration: 1.5, ease: "easeOut", delay: 0.6 }}
                              className="origin-center"
                              style={{ rotate: "234deg" }}
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-base font-black text-text leading-none">5</span>
                            <span className="text-[8px] font-bold text-text-muted uppercase mt-0.5">Blocks</span>
                          </div>
                        </div>

                        {/* Legends */}
                        <div className="flex flex-col gap-1.5 text-xs font-bold text-text-light flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded bg-[#FFD54F] border border-text/10" />
                            <span>Education</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded bg-[#7C5CFF] border border-text/10" />
                            <span>Projects</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded bg-[#FF8A50] border border-text/10" />
                            <span>Skills</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded bg-[#22C55E] border border-text/10" />
                            <span>Experience</span>
                          </div>
                        </div>
                      </div>

                    </div>

                  </div>

                  {/* THIRD ROW: Career Roadmap Horizontal Timeline */}
                  <div className="bg-white border-2 border-card-border p-5 rounded-2xl shadow-sm">
                    <h5 className="text-xs font-black text-text uppercase tracking-wide mb-4">🗺 Personalized Career Roadmap</h5>
                    
                    <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2 scrollbar-none">
                      {[
                        { title: 'Data Analyst', bg: '#FFD54F' },
                        { title: 'Business Analyst', bg: '#FF8A50' },
                        { title: 'Senior Analyst', bg: '#7C5CFF' },
                        { title: 'Analytics Engineer', bg: '#FF8A50' },
                        { title: 'AI Engineer', bg: '#22C55E' }
                      ].map((node, index) => (
                        <div key={node.title} className="flex items-center gap-2 shrink-0">
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2, type: "spring", stiffness: 100 }}
                            whileHover={{ scale: 1.05 }}
                            className="px-3.5 py-2.5 rounded-xl border-2 border-text flex items-center justify-center font-extrabold text-xs text-text shadow-sm"
                            style={{ backgroundColor: `${node.bg}15`, borderColor: node.bg }}
                          >
                            {node.title}
                          </motion.div>
                          
                          {index < 4 && (
                            <motion.span
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: index * 0.2 + 0.1 }}
                              className="text-text-muted font-bold text-sm shrink-0 select-none px-0.5"
                            >
                              ➔
                            </motion.span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* FOURTH ROW: Job Recommendations */}
                  <div className="bg-white border-2 border-card-border p-5 rounded-2xl shadow-sm">
                    <h5 className="text-xs font-black text-text uppercase tracking-wide mb-4">💼 Smart Job Recommendations</h5>
                    
                    <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-thin">
                      {[
                        { company: 'Google', salary: '$140k - $180k', loc: 'Mountain View, CA', remote: 'Hybrid', match: '84%', logo: 'G' },
                        { company: 'Microsoft', salary: '$150k - $190k', loc: 'Redmond, WA', remote: 'Remote', match: '91%', logo: 'M' },
                        { company: 'Infosys', salary: '$95k - $120k', loc: 'New York, NY', remote: 'On-site', match: '95%', logo: 'I' },
                        { company: 'Amazon', salary: '$160k - $210k', loc: 'Seattle, WA', remote: 'Remote', match: '82%', logo: 'A' }
                      ].map((j, idx) => (
                        <motion.div
                          key={j.company}
                          whileHover={{ y: -3 }}
                          className="w-56 shrink-0 p-4 border-2 border-card-border hover:border-secondary/40 rounded-xl bg-cream/4 relative flex flex-col justify-between transition-colors shadow-sm"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded bg-text text-white flex items-center justify-center font-black text-xs">
                                {j.logo}
                              </div>
                              <span className="text-xs font-extrabold text-text">{j.company}</span>
                            </div>
                            <span className="px-2 py-0.5 bg-secondary/8 text-secondary text-[10px] font-bold rounded border border-secondary/10">
                              {j.match} Match
                            </span>
                          </div>

                          <div className="mb-4">
                            <span className="text-sm font-black text-text block leading-snug">{j.salary}</span>
                            <span className="text-[11px] text-text-light font-bold block mt-1">{j.loc}</span>
                          </div>

                          <div className="flex items-center justify-between mt-auto">
                            <span className="text-[9px] font-black text-text-muted bg-cream-dark px-1.5 py-0.5 rounded border border-card-border uppercase">
                              {j.remote}
                            </span>
                            <button className="px-3 py-1 bg-secondary text-white font-extrabold text-[10px] rounded-lg hover:bg-secondary-dark transition-colors cursor-pointer">
                              Apply
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* FIFTH ROW: AI Suggestions Speech Bubble */}
                  <div className="bg-white border-2 border-card-border p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center gap-4.5">
                    
                    {/* Mini Mascot Animation */}
                    <div className="shrink-0 flex flex-col items-center">
                      <svg viewBox="0 0 100 120" fill="none" className="w-16 h-20 select-none">
                        <ellipse cx="50" cy="110" rx="20" ry="3" fill="#E8D5B0" opacity="0.4"/>
                        {/* Arm waving */}
                        <motion.path
                          d="M 22 75 Q 8 60 12 50"
                          stroke="#7C5CFF" strokeWidth="5.5" strokeLinecap="round"
                          animate={{ rotate: [0, -15, 15, -15, 0] }}
                          transition={{ repeat: Infinity, duration: 2.5, repeatDelay: 1.5 }}
                          style={{ transformOrigin: "22px 75px" }}
                        />
                        {/* Head */}
                        <motion.g
                          animate={{ y: [0, -2, 0] }}
                          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                        >
                          <rect x="25" y="20" width="50" height="42" rx="10" fill="#7C5CFF"/>
                          <rect x="29" y="24" width="42" height="34" rx="8" fill="white"/>
                          {/* Eyes */}
                          <g className="robot-eye">
                            <circle cx="42" cy="38" r="4.5" fill="#1F1F1F"/>
                            <circle cx="43.5" cy="36.5" r="1.5" fill="white"/>
                          </g>
                          <g className="robot-eye-delayed">
                            <circle cx="58" cy="38" r="4.5" fill="#1F1F1F"/>
                            <circle cx="59.5" cy="36.5" r="1.5" fill="white"/>
                          </g>
                          <path d="M 44 47 Q 50 52 56 47" stroke="#1F1F1F" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                        </motion.g>
                        {/* Body */}
                        <rect x="36" y="65" width="28" height="25" rx="6" fill="#7C5CFF"/>
                        <rect x="40" y="70" width="20" height="15" rx="3" fill="#F9F5EB"/>
                        <circle cx="50" cy="77" r="3" fill="#FFD54F"/>
                      </svg>
                    </div>

                    {/* Speech Bubble / Suggestions List */}
                    <div className="flex-1 p-4 bg-cream/10 border-2 border-card-border rounded-2xl relative speech-bubble">
                      <h6 className="text-xs font-black text-secondary uppercase tracking-wide mb-2.5">🤖 AI Recommendations</h6>
                      
                      <div className="flex flex-col gap-2 text-xs font-bold text-text-light">
                        {[
                          'Add measurable achievements (e.g. Optimized queries by 45%)',
                          'Improve ATS keyword density for Machine Learning terms',
                          'Mention specific SQL and Power BI dashboard projects',
                          'Rewrite career summary to highlight target job matches'
                        ].map((s, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.25, duration: 0.5 }}
                            className="flex items-start gap-2.5"
                          >
                            <span className="text-accent-green text-[13px] leading-none select-none shrink-0">✔</span>
                            <span>{s}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                  </div>

                </div>

              </div>
            </motion.div>

            {/* RIGHT SIDE: Beautiful Feature Explanation Cards (40%) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {[
                {
                  icon: '🤖',
                  title: 'AI Resume Analysis',
                  desc: 'Our AI evaluates every section of your resume and identifies critical strengths and formatting weaknesses.',
                  color: '#FFD54F'
                },
                {
                  icon: '📈',
                  title: 'ATS Optimization',
                  desc: 'Increase recruiter compatibility and bypass layout scanners using intelligent keyword density suggestions.',
                  color: '#7C5CFF'
                },
                {
                  icon: '🎯',
                  title: 'Job Matching',
                  desc: 'Discover matching career recommendations perfectly suited to your skillset and experience level.',
                  color: '#22C55E'
                },
                {
                  icon: '🧠',
                  title: 'Skill Gap Detection',
                  desc: 'Identify exactly what tools, libraries, or methodologies you need to acquire to stand out to employers.',
                  color: '#FF8A50'
                },
                {
                  icon: '🗺',
                  title: 'Personalized Career Roadmap',
                  desc: 'Receive an automated step-by-step career timeline generated by AI to guide your self-learning journey.',
                  color: '#7C5CFF'
                }
              ].map((f, idx) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: idx * 0.15 }}
                  whileHover={{ y: -4, scale: 1.015 }}
                  className="feature-card p-5 cursor-pointer relative overflow-hidden transition-all duration-300"
                >
                  <div className="flex gap-4 items-start">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border-2 border-text text-base"
                      style={{ backgroundColor: `${f.color}15` }}
                    >
                      {f.icon}
                    </div>
                    <div>
                      <h4 className="text-[15px] font-black text-text mb-1">{f.title}</h4>
                      <p className="text-xs sm:text-[13px] text-text-light leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FAQ SECTION
          ═══════════════════════════════════════════ */}
      <section className="relative z-10 py-20 sm:py-28 bg-cream border-t border-card-border overflow-hidden" id="faq">
        
        {/* Slow cartoon doodles floating in FAQ */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div animate={float(4.5, 0.4)} className="absolute top-[10%] right-[15%] sparkle-twinkle">
            <TinySparkle className="w-5 h-5" color="#FF8A50" />
          </motion.div>
          <motion.div animate={float(5.5, 0.8)} className="absolute bottom-[15%] left-[8%] sparkle-twinkle-delayed">
            <TinySparkle className="w-5 h-5" color="#7C5CFF" />
          </motion.div>
          <motion.div animate={floatRotate(6, 0.2, 5)} className="absolute top-[40%] left-[5%]">
            <Star className="w-6 h-6 text-primary opacity-45" />
          </motion.div>
        </div>

        <div className="max-w-4xl mx-auto px-6 sm:px-8 relative z-10">

          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/20 border-2 border-primary/30 text-sm font-bold text-text mb-5">
              ❓ Frequently Asked Questions
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-black text-text leading-[1.15]">
              Everything You Need to Know
            </h2>
            <div className="flex justify-center mt-3 mb-5">
              <svg width="80" height="14" viewBox="0 0 80 14" fill="none">
                <path d="M3 10 Q12 3 24 9 Q36 15 48 8 Q60 1 72 9" stroke="#FFD54F" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
              </svg>
            </div>
            <p className="text-text-light text-base sm:text-[17px] leading-relaxed max-w-2xl mx-auto">
              Find answers to common questions about CareerLensAI, resume analysis, ATS scoring, privacy, and AI-powered recommendations.
            </p>
          </motion.div>

          {/* FAQ Accordions Grid */}
          <div className="flex flex-col gap-4">
            {[
              {
                q: 'Is my resume stored?',
                a: 'No. Your resume is processed on secure temporary servers in real-time memory to perform the analysis, and is instantly discarded after insights are generated.'
              },
              {
                q: 'How is the ATS score calculated?',
                a: 'Our AI cross-references your resume layout, keywords, missing hard/soft skills, project metrics, and job titles against our proprietary database of thousands of industry-standard successful resume benchmarks.'
              },
              {
                q: 'Which file formats are supported?',
                a: 'We support standard PDF and Microsoft Word (DOCX) formats up to 5MB. For best analysis accuracy, we recommend cleanly formatted PDF files.'
              },
              {
                q: 'Can I edit my resume after analysis?',
                a: 'Yes! CareerLensAI lets you re-upload your updated resume as many times as you like to verify if your updates successfully optimized your ATS score and keyword match.'
              },
              {
                q: 'Will AI rewrite my resume?',
                a: 'No. CareerLensAI does not change your original document. It points out grammar improvements, keyword omissions, and gives copy-pasteable bullet point recommendations to help you write it better.'
              },
              {
                q: 'How accurate are job recommendations?',
                a: 'Recommendations are highly accurate, using semantic skills matching algorithms that compare your qualifications directly to requirements and locations of hundreds of live developer job listings.'
              },
              {
                q: 'Can I download my report?',
                a: 'Yes, you can export your dashboard analysis report, key recommendations, and custom career roadmap path as a clean printable PDF report card.'
              },
              {
                q: 'Is CareerLensAI free?',
                a: 'Yes, basic resume scanning, keyword checkouts, and dashboard analytics are completely free to use. Premium career roadmaps and custom analytics reports are coming soon.'
              },
              {
                q: 'Can recruiters view my resume?',
                a: 'Recruiters cannot view your files unless you explicitly toggle on "Share with Hiring Partners" in your career settings dashboard.'
              },
              {
                q: 'How secure is my data?',
                a: 'Extremely secure. All resume uploads use TLS/SSL encryption in transit, and we strictly follow modern data safety policies (GDPR and CCPA compliant).'
              }
            ].map((item, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-20px' }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  whileHover={{ y: -2 }}
                  className="bg-white border-2 border-card-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 font-extrabold text-base sm:text-lg text-text select-none cursor-pointer"
                  >
                    <span>{item.q}</span>
                    <motion.div
                      animate={{ rotate: isOpen ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-secondary shrink-0"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      >
                        <div className="px-6 pb-5 pt-1 text-sm sm:text-base text-text-light border-t border-card-border/60 leading-relaxed bg-[#FFFDF9]/60">
                          {item.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>


      {/* ═══════════════════════════════════════════
          PLAYFUL CTA CARD — Pointing Mascot
          ═══════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 pb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="cta-section px-8 sm:px-12 py-10 sm:py-12 flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-5">
            <PointingRobot className="w-20 h-20 sm:w-24 sm:h-24 shrink-0" />
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-text">
                Ready to Build Your Dream Career? <Rocket className="w-5 h-5 inline-block text-accent-orange" />
              </h3>
              <p className="text-sm text-text-light mt-1 max-w-lg">
                Upload your resume and let our AI optimize your profile to attract top hiring teams.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <motion.a
              href="#signup"
              onClick={(e) => { e.preventDefault(); navigateTo('/signup'); }}
              whileHover={{ y: -3, scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="btn-yellow inline-flex items-center gap-2 px-6 py-3 text-base shadow-[0_4px_14px_rgba(255,213,79,0.35)] cursor-pointer"
            >
              Analyze Resume <ArrowRight className="w-5 h-5" />
            </motion.a>
            <motion.a
              href="#product-demo"
              onClick={(e) => { e.preventDefault(); scrollToSection('product-demo'); }}
              whileHover={{ y: -3, scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="btn-outline inline-flex items-center gap-2 px-6 py-3 text-base cursor-pointer"
            >
              View Demo
            </motion.a>
          </div>
        </motion.div>
      </section>


      {/* ═══════════════════════════════════════════
          FOOTER / CONTACT
          ═══════════════════════════════════════════ */}
      <footer id="contact" className="border-t-2 border-card-border bg-[#FFFDF9] py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col lg:flex-row justify-between gap-12">
          
          {/* Brand Info */}
          <div className="max-w-xs flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <SmallRobot className="w-8 h-8" />
              <span className="text-lg font-bold text-text">
                Career<span className="text-secondary">Lens</span>AI
              </span>
            </div>
            <p className="text-xs sm:text-[13px] text-text-light leading-relaxed font-semibold">
              Transforming resumes into actionable insights, skill roadmap charts, and smart recruiter-matching recommendations.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-4 mt-2">
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-text-muted hover:text-secondary transition-colors" title="LinkedIn">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="text-text-muted hover:text-secondary transition-colors" title="GitHub">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a href="mailto:support@careerlensai.com" className="text-text-muted hover:text-secondary transition-colors" title="Email Us">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M0 3v18h24v-18h-24zm21.518 2l-9.518 7.713-9.518-7.713h19.036zm-19.518 14v-11.817l10 8.104 10-8.104v11.817h-20z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links Sitemaps */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div className="flex flex-col gap-3">
              <h5 className="text-[13px] font-black text-text uppercase tracking-wide">Quick Links</h5>
              <div className="flex flex-col gap-2.5 text-xs font-bold text-text-light">
                <a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }} className="hover:text-secondary hover:underline transition-all">Home</a>
                <a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }} className="hover:text-secondary hover:underline transition-all">Features</a>
                <a href="#how-it-works" onClick={(e) => { e.preventDefault(); scrollToSection('how-it-works'); }} className="hover:text-secondary hover:underline transition-all">How It Works</a>
                <a href="#faq" onClick={(e) => { e.preventDefault(); scrollToSection('faq'); }} className="hover:text-secondary hover:underline transition-all">FAQ</a>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <h5 className="text-[13px] font-black text-text uppercase tracking-wide">Resources</h5>
              <div className="flex flex-col gap-2.5 text-xs font-bold text-text-light">
                <a href="#privacy" className="hover:text-secondary hover:underline transition-all">Privacy Policy</a>
                <a href="#terms" className="hover:text-secondary hover:underline transition-all">Terms of Service</a>
                <a href="#support" className="hover:text-secondary hover:underline transition-all">Support</a>
              </div>
            </div>

            <div className="flex flex-col gap-3 col-span-2 sm:col-span-1">
              <h5 className="text-[13px] font-black text-text uppercase tracking-wide">Legal</h5>
              <div className="flex flex-col gap-2.5 text-xs font-bold text-text-light">
                <a href="#github" className="hover:text-secondary hover:underline transition-all">GitHub Repo</a>
                <p className="text-[11px] text-text-muted leading-relaxed font-semibold">GDPR & CCPA Compliant data guidelines.</p>
              </div>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-6 sm:px-8 border-t border-card-border/60 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-muted font-bold">
            © 2026 CareerLensAI. All Rights Reserved.
          </p>
          <p className="text-[10px] text-text-muted font-bold">
            Design crafted with premium cartoon style vector aesthetics.
          </p>
        </div>
      </footer>

    </div>
  );
}
