import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import dashboardService from '../services/dashboardService';

export default function Dashboard({ onNavigate }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const queryParams = new URLSearchParams(window.location.search);
  const analysisId = queryParams.get('id');

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      if (analysisId) {
        const result = await dashboardService.getDashboardData(analysisId);
        setData(result);
      } else {
        setError("No active resume analysis ID was specified in the URL. Please upload a resume first.");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Failed to load dashboard data. Ensure the FastAPI backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [analysisId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center text-center p-8 select-none">
        {/* Animated robot loading spinner */}
        <div className="w-24 h-24 mb-6">
          <svg viewBox="0 0 100 100" className="w-full h-full animate-bounce">
            <rect x="25" y="25" width="50" height="42" rx="10" fill="#7C5CFF" stroke="#1F1F1F" strokeWidth="3" />
            <rect x="30" y="30" width="40" height="32" rx="8" fill="white" />
            <circle cx="42" cy="44" r="4" fill="#1F1F1F" />
            <circle cx="58" cy="44" r="4" fill="#1F1F1F" />
            <path d="M 44 54 Q 50 58 56 54" stroke="#1F1F1F" strokeWidth="2" fill="none" />
            <line x1="50" y1="25" x2="50" y2="10" stroke="#7C5CFF" strokeWidth="3" />
            <circle cx="50" cy="8" r="4" fill="#FFD54F" />
          </svg>
        </div>
        <h2 className="text-xl font-black text-text mb-2">Analyzing Resume Insights...</h2>
        <p className="text-xs font-bold text-text-light max-w-xs">AI is assembling your scoring cards, keyword matches, and career roadmaps.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center text-center p-8 select-none">
        <div className="text-5xl mb-4">⚠️</div>
        <h2 className="text-xl font-black text-text mb-2">Dashboard Error</h2>
        <p className="text-xs font-bold text-text-light max-w-md mb-6 leading-relaxed">{error}</p>
        <div className="flex gap-4">
          <button
            onClick={fetchDashboard}
            className="px-5 py-2.5 bg-primary border-2 border-text text-xs font-black rounded-xl text-text shadow-[4px_4px_0px_#1F1F1F] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
          >
            Retry Loading
          </button>
          <button
            onClick={() => onNavigate('/upload')}
            className="px-5 py-2.5 bg-white border-2 border-card-border hover:border-text text-xs font-black rounded-xl text-text cursor-pointer transition-colors"
          >
            Go Upload Resume
          </button>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout
      data={data}
      onNavigate={onNavigate}
    />
  );
}
