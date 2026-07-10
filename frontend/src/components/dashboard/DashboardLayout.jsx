import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';
import ATSScoreCard from './ATSScoreCard';
import MetricCards from './MetricCards';
import SkillsFound from './SkillsFound';
import MissingSkills from './MissingSkills';
import AISuggestions from './AISuggestions';
import ResumeAnalysis from './ResumeAnalysis';
import KeywordChart from './KeywordChart';
import CareerRoadmap from './CareerRoadmap';
import JobRecommendations from './JobRecommendations';
import ResumePreview from './ResumePreview';
import AnalyticsSection from './AnalyticsSection';
import ExportActions from './ExportActions';
import DashboardRobot from './DashboardRobot';

// New sub-components
import ResumeImprovements from './ResumeImprovements';
import InterviewPrep from './InterviewPrep';
import ResumeComparison from './ResumeComparison';
import UserProfile from './UserProfile';
import AdminDashboard from './AdminDashboard';

export default function DashboardLayout({ data = {}, onNavigate }) {
  const [activeSection, setActiveSection] = useState('overview');
  const [confettiActive, setConfettiActive] = useState(false);

  // References for scrolling Spy integration
  const overviewRef = useRef(null);
  const skillsRef = useRef(null);
  const recommendationsRef = useRef(null);
  const jobsRef = useRef(null);
  const analyticsRef = useRef(null);

  // Confetti trigger on initial high-score load
  useEffect(() => {
    if (data.atsScore >= 85) {
      setConfettiActive(true);
      const timer = setTimeout(() => setConfettiActive(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [data.atsScore]);

  // Handle side menu clicks smoothly scrolling matching cards
  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);

    const refMap = {
      overview: overviewRef,
      skills: skillsRef,
      recommendations: recommendationsRef,
      jobs: jobsRef,
      analytics: analyticsRef
    };

    const targetRef = refMap[sectionId];
    if (targetRef && targetRef.current) {
      targetRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleCopySuggestions = () => {
    if (data.suggestions) {
      navigator.clipboard.writeText(data.suggestions.join('\n'));
      alert('Suggestions copied to clipboard! 📋');
    }
  };

  const handleNewScan = () => {
    onNavigate('/upload');
  };

  return (
    <div className="min-h-screen bg-cream text-text flex flex-col lg:flex-row font-sans relative overflow-x-hidden">
      
      {/* Dynamic confetti canvas simulation */}
      {confettiActive && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(24)].map((_, i) => (
            <motion.span
              key={i}
              initial={{ y: -50, x: Math.random() * window.innerWidth, rotate: 0 }}
              animate={{
                y: window.innerHeight + 50,
                x: `calc(${Math.random() * 100}vw)`,
                rotate: 360
              }}
              transition={{
                duration: Math.random() * 2 + 2,
                repeat: 0,
                ease: 'linear'
              }}
              className="absolute text-xl"
            >
              {['🎉', '✨', '🎈', '⭐', '🌈'][i % 5]}
            </motion.span>
          ))}
        </div>
      )}

      {/* LEFT SIDEBAR PANEL */}
      <DashboardSidebar
        activeSection={activeSection}
        setActiveSection={handleSectionChange}
        onNewScan={handleNewScan}
      />

      {/* RIGHT VIEWSPACE WORK AREA */}
      <div className="flex-1 flex flex-col min-w-0 bg-cream">
        
        {/* Top greeting header */}
        <DashboardHeader
          userName={data.userName}
          fileName={data.fileName}
          analysisDuration={data.analysisDuration}
          onNavigate={onNavigate}
        />

        {/* Scrolling Grid viewport container */}
        <div className="flex-1 px-4 sm:px-6 py-8 overflow-y-auto max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Main column cards (fluid width based on section type) */}
            <div className={`${
              ['profile', 'compare', 'admin'].includes(activeSection) ? 'lg:col-span-12' : 'lg:col-span-8'
            } flex flex-col gap-8 w-full`}>
              
              {activeSection === 'overview' && (
                <div className="flex flex-col gap-8">
                  {/* Metric breakdown cards */}
                  <MetricCards
                    resumeScore={data.resumeScore}
                    formatting={data.formatting}
                    grammar={data.grammar}
                    keywords={data.keywords}
                  />

                  {/* Interactive Career roadmap milestone */}
                  <CareerRoadmap steps={data.roadmap} />

                  {/* Skills Found and Missing skills check gaps */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <SkillsFound skills={data.skillsFound} />
                    <MissingSkills missingSkills={data.missingSkills} />
                  </div>
                  
                  {/* Keyword split donut visualization */}
                  <KeywordChart keywordMatch={data.keywordMatch} />

                  {/* ChatGPT recommendations list */}
                  <AISuggestions suggestions={data.suggestions} />

                  {/* Analytics historical charts */}
                  <AnalyticsSection historyData={data.historyData} />
                  
                  {/* PDF paper weaknesses review previews */}
                  <ResumePreview fileName={data.fileName} />

                  {/* PDF offline sharing triggers */}
                  <ExportActions
                    onReset={handleNewScan}
                    onCopySuggestions={handleCopySuggestions}
                    data={data}
                  />
                </div>
              )}

              {activeSection === 'improvements' && (
                <ResumeImprovements improvements={data.improvements} />
              )}

              {activeSection === 'interview' && (
                <InterviewPrep questions={data.interviewQuestions} />
              )}

              {activeSection === 'compare' && (
                <ResumeComparison />
              )}

              {activeSection === 'jobs' && (
                <JobRecommendations jobs={data.jobMatches} />
              )}

              {activeSection === 'profile' && (
                <UserProfile onNavigate={onNavigate} />
              )}

              {activeSection === 'admin' && (
                <AdminDashboard />
              )}

            </div>

            {/* Right mascot info column (hidden on wide pages) */}
            {!['profile', 'compare', 'admin'].includes(activeSection) && (
              <div className="lg:col-span-4 flex flex-col gap-8 w-full lg:sticky lg:top-24">
                
                {/* Mascot robot controller */}
                <div className="bg-white border-3 border-text p-6 rounded-3xl shadow-[6px_6px_0px_#1F1F1F]">
                  <DashboardRobot score={data.atsScore} />
                  <div className="text-center mt-3">
                    <span className="text-[10px] font-black text-secondary uppercase tracking-widest bg-secondary/15 px-2 py-0.5 rounded">
                      Mascot Status: {data.atsScore >= 85 ? 'Happy 🎉' : data.atsScore >= 60 ? 'Thinking 💭' : 'Concerned ⚠️'}
                    </span>
                  </div>
                </div>

                {/* Circular gauge */}
                <ATSScoreCard score={data.atsScore} />

                {/* Bar evaluation breakdowns */}
                <ResumeAnalysis sectionScores={data.sectionScores} />

              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
}
