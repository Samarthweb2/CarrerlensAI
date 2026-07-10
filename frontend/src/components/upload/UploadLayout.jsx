import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import UploadDropzone from './UploadDropzone';
import RecentUploads from './RecentUploads';
import AIAssistantPanel from './AIAssistantPanel';
import UploadProgress from './UploadProgress';
import SuccessScreen from './SuccessScreen';
import ErrorCard from './ErrorCard';
import resumeService from '../../services/resumeService';

export default function UploadLayout({ onNavigate }) {
  // States: 'idle', 'uploading', 'success', 'error'
  const [uploadState, setUploadState] = useState('idle');
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('Reading Resume...');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "🤖 ATS system upgraded to version 4.2!", read: false },
    { id: 2, text: "🔥 Added 5 new resume templates.", read: true }
  ]);
  const [user, setUser] = useState({ full_name: 'Samarth Mishra' });
  const [analysisId, setAnalysisId] = useState(null);
  const [recentUploads, setRecentUploads] = useState([]);

  useEffect(() => {
    const rawUser = localStorage.getItem('user');
    if (rawUser) {
      try {
        setUser(JSON.parse(rawUser));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleUploadStart = async (file) => {
    setUploadedFile(file);
    setProgress(0);
    setProgressMessage('Uploading Resume File...');
    setUploadState('uploading');

    let parsingInterval = null;

    try {
      // Step 1: Upload the file and track percentage progress up to 50%
      const response = await resumeService.uploadResume(file, jobDescription, (percent) => {
        // Map 0-100% network upload into 0-50% progress bar
        setProgress(Math.min(Math.round(percent / 2), 50));
        if (percent >= 100) {
          setProgressMessage('Reading & Extracting Text...');
        }
      });
      
      // Step 2: Once uploaded, simulate processing ticks from 50% to 99% while parsing
      setProgress(60);
      setProgressMessage('Segmenting Sections...');
      
      parsingInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 98) {
            clearInterval(parsingInterval);
            return 98;
          }
          if (prev < 70) {
            setProgressMessage('Segmenting Sections...');
            return prev + 2;
          } else if (prev < 85) {
            setProgressMessage('Running AI Grading Engine...');
            return prev + 1;
          } else {
            setProgressMessage('Finalizing Job Recommendation Matches...');
            return prev + 1;
          }
        });
      }, 150);

      // Once response finishes, complete to 100%
      if (response && response.analysisId) {
        clearInterval(parsingInterval);
        setAnalysisId(response.analysisId);
        setProgress(100);
        setProgressMessage('Analysis Successful!');

        // Track this real upload in the session's recent uploads list
        setRecentUploads(prev => [
          {
            id: response.analysisId,
            name: file.name,
            date: new Date().toLocaleString(),
            size: `${(file.size / 1024).toFixed(0)} KB`,
            analysisId: response.analysisId
          },
          ...prev
        ]);

        setTimeout(() => {
          setUploadState('success');
        }, 600);
      } else {
        clearInterval(parsingInterval);
        handleError('Analysis finished but no analysis ID was returned.');
      }
    } catch (err) {
      if (parsingInterval) {
        clearInterval(parsingInterval);
      }
      const msg = err.response?.data?.detail || 'Something went wrong while scanning your file. Make sure the backend service is running.';
      handleError(msg);
    }
  };

  const handleViewDashboard = (analysisId) => {
    if (analysisId) {
      onNavigate(`/dashboard?id=${analysisId}`);
    }
  };

  const handleError = (message) => {
    setErrorMsg(message);
    setUploadState('error');
  };

  const handleReset = () => {
    setUploadedFile(null);
    setProgress(0);
    setErrorMsg('');
    setUploadState('idle');
  };

  const handleExplore = () => {
    if (analysisId) {
      onNavigate(`/dashboard?id=${analysisId}`);
    } else {
      onNavigate('/dashboard');
    }
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-cream text-text flex flex-col font-sans">
      
      {/* Sticky Header Nav */}
      <header className="sticky top-0 z-40 bg-cream/90 backdrop-blur-md border-b-3 border-text px-4 sm:px-6 py-4 w-full">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo & workspace title */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('/')}>
              <svg viewBox="0 0 100 100" fill="none" className="w-8 h-8 shrink-0">
                <line x1="50" y1="20" x2="50" y2="8" stroke="#7C5CFF" strokeWidth="3" strokeLinecap="round"/>
                <circle cx="50" cy="8" r="4.5" fill="#FFD54F"/>
                <rect x="15" y="20" width="70" height="60" rx="14" fill="#7C5CFF"/>
                <rect x="20" y="25" width="60" height="50" rx="10" fill="white"/>
                <circle cx="38" cy="48" r="7" fill="#1F1F1F"/>
                <circle cx="62" cy="48" r="7" fill="#1F1F1F"/>
                <path d="M40 64 Q50 72 60 64" stroke="#1F1F1F" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
              </svg>
              <span className="text-lg font-black tracking-tight hidden sm:inline">
                Career<span className="text-secondary">Lens</span>AI
              </span>
            </div>
            
            <div className="h-6 w-[2px] bg-card-border/60 hidden sm:block" />
            
            <span className="bg-primary/20 border-2 border-primary/40 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black text-secondary select-none">
              🎓 Student Workspace
            </span>
          </div>

          {/* Right Header Navigation Panel */}
          <div className="flex items-center gap-4 relative">
            
            {/* Notification Bell */}
            <button
              onClick={toggleNotifications}
              className="w-10 h-10 border-2 border-card-border hover:border-text hover:bg-cream-dark/10 rounded-xl flex items-center justify-center cursor-pointer transition-colors relative"
            >
              <span className="text-base">🔔</span>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-orange text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-text">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Drawer */}
            <AnimatePresence>
              {showNotifications && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-12 top-12 w-64 bg-white border-3 border-text p-4 rounded-2xl shadow-[4px_4px_0px_#1F1F1F] z-50 flex flex-col gap-2.5 text-left"
                  >
                    <div className="flex items-center justify-between border-b border-card-border/40 pb-2 mb-1">
                      <span className="text-xs font-black text-text">Notifications</span>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllRead}
                          className="text-[10px] font-bold text-secondary hover:underline cursor-pointer"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    {notifications.map(n => (
                      <div
                        key={n.id}
                        className={`p-2 rounded-lg text-xs leading-relaxed font-bold transition-all ${
                          n.read ? 'text-text-light bg-cream/10' : 'text-text bg-secondary/5 border-l-3 border-secondary'
                        }`}
                      >
                        {n.text}
                      </div>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* User Profile Info */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl border-2 border-text bg-primary/20 flex items-center justify-center font-black text-sm select-none">
                {user.full_name ? user.full_name[0].toUpperCase() : 'U'}
              </div>
              <span className="text-xs font-extrabold hidden md:inline text-text">
                {user.full_name ? user.full_name.split(' ')[0] : 'User'}
              </span>
            </div>

            <button
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                onNavigate('/');
              }}
              className="px-3.5 py-2 border-2 border-card-border hover:border-text hover:bg-cream-dark/10 rounded-xl font-bold text-xs cursor-pointer text-text transition-all select-none active:scale-95"
            >
              Logout ➔
            </button>
          </div>
        </div>
      </header>

      {/* Main Grid Wrapper */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT INTERACTION COLUMN */}
          <div className="lg:col-span-8 flex flex-col gap-8 w-full">
            
            {/* Conditional Sub-Title Header */}
            {uploadState === 'idle' && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-left select-none"
              >
                <span className="bg-secondary/15 border-2 border-secondary/35 text-secondary px-3 py-1 rounded-full text-xs font-black inline-block mb-3.5">
                  🔥 Upload Center
                </span>
                <h1 className="text-3xl sm:text-4xl font-black text-text tracking-tight mb-2">
                  Scan Your Resume
                </h1>
                <p className="text-sm font-bold text-text-light max-w-xl leading-relaxed">
                  Upload your CV in PDF or Word format. Our interactive AI agent will analyze keyword layouts, match skill requirements, and test against common ATS filters.
                </p>
              </motion.div>
            )}

            {/* Transition states wrapper */}
            <div className="w-full">
              <AnimatePresence mode="wait">
                {uploadState === 'idle' && (
                  <motion.div
                    key="idle-view"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col gap-6"
                  >
                    {/* Job Description Textarea */}
                    <div className="bg-white border-3 border-text p-5 rounded-3xl shadow-[6px_6px_0px_#1F1F1F] flex flex-col gap-3.5 text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🎯</span>
                        <h3 className="text-xs font-black text-text uppercase tracking-wider">Target Job Description (Recommended)</h3>
                      </div>
                      <p className="text-[11px] font-bold text-text-light">
                        Pasting the job description allows Gemini to calculate a precise ATS match percentage, identify missing keywords, and suggest custom bullet improvements.
                      </p>
                      <textarea
                        className="w-full h-28 p-3 bg-cream/20 border-2 border-card-border hover:border-text focus:border-secondary rounded-xl text-xs font-bold text-text resize-none outline-none transition-all placeholder:text-text-muted/65"
                        placeholder="Paste target job description here..."
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                      />
                    </div>

                    <UploadDropzone
                      onUploadStart={handleUploadStart}
                      onError={handleError}
                    />
                    
                    <RecentUploads
                      recentUploads={recentUploads}
                      onReanalyze={handleViewDashboard}
                    />
                  </motion.div>
                )}

                {uploadState === 'uploading' && (
                  <motion.div
                    key="uploading-view"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <UploadProgress
                      progress={progress}
                      message={progressMessage}
                      fileName={uploadedFile?.name}
                    />
                  </motion.div>
                )}

                {uploadState === 'success' && (
                  <motion.div
                    key="success-view"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <SuccessScreen
                      onExplore={handleExplore}
                      onReset={handleReset}
                      fileName={uploadedFile?.name}
                    />
                  </motion.div>
                )}

                {uploadState === 'error' && (
                  <motion.div
                    key="error-view"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <ErrorCard
                      errorMsg={errorMsg}
                      onRetry={handleReset}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* RIGHT ASSISTANT COLUMN */}
          <div className="lg:col-span-4 w-full">
            <AIAssistantPanel />
          </div>

        </div>
      </main>

    </div>
  );
}
