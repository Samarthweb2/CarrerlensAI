import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import apiClient from '../../services/api';

export default function ResumeComparison() {
  const [resumes, setResumes] = useState([]);
  const [selectedId1, setSelectedId1] = useState('');
  const [selectedId2, setSelectedId2] = useState('');
  const [loadingResumes, setLoadingResumes] = useState(false);
  const [comparing, setComparing] = useState(false);
  const [comparisonResult, setComparisonResult] = useState(null);
  const [error, setError] = useState('');

  const fetchResumesList = async () => {
    setLoadingResumes(true);
    try {
      const response = await apiClient.get('/resume');
      setResumes(response.data);
      if (response.data.length >= 2) {
        setSelectedId1(response.data[0].id);
        setSelectedId2(response.data[1].id);
      } else if (response.data.length === 1) {
        setSelectedId1(response.data[0].id);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch uploaded resumes. Please make sure the backend is active.');
    } finally {
      setLoadingResumes(false);
    }
  };

  useEffect(() => {
    fetchResumesList();
  }, []);

  const handleCompare = async () => {
    if (!selectedId1 || !selectedId2) {
      setError('Please select two resumes to compare.');
      return;
    }
    if (selectedId1 === selectedId2) {
      setError('Please select two different resumes.');
      return;
    }

    setError('');
    setComparing(true);
    setComparisonResult(null);

    try {
      const response = await apiClient.post('/resume/compare', {
        resumeId1: parseInt(selectedId1),
        resumeId2: parseInt(selectedId2)
      });
      setComparisonResult(response.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Comparison calculation failed. Please try again.');
    } finally {
      setComparing(false);
    }
  };

  return (
    <div className="bg-white border-3 border-text p-6 sm:p-8 rounded-3xl shadow-[6px_6px_0px_#1F1F1F] text-left w-full">
      <div className="flex items-center gap-2.5 mb-2">
        <span className="text-2xl">⚖️</span>
        <h3 className="text-sm font-black text-text uppercase tracking-wider">Resume Version Comparison</h3>
      </div>
      <p className="text-xs font-bold text-text-light mb-6">
        Select two versions of your resume from your history to evaluate how modifications affected your ATS score and highlight improved skill sets:
      </p>

      {error && (
        <div className="bg-accent-orange/10 border-2 border-accent-orange p-3.5 rounded-xl text-xs font-bold text-text mb-4">
          ⚠️ {error}
        </div>
      )}

      {/* Selectors grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end mb-8 bg-cream/15 border-2 border-card-border p-5 rounded-2xl">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black text-text uppercase tracking-wider">Version 1 (Before):</label>
          <select
            className="w-full p-3 bg-white border-2 border-text font-bold text-xs rounded-xl outline-none"
            value={selectedId1}
            onChange={(e) => setSelectedId1(e.target.value)}
            disabled={loadingResumes || comparing}
          >
            <option value="">-- Select Resume V1 --</option>
            {resumes.map(r => (
              <option key={r.id} value={r.id}>
                {r.filename} (Score: {r.atsScore || 'N/A'})
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black text-text uppercase tracking-wider">Version 2 (After/Improved):</label>
          <select
            className="w-full p-3 bg-white border-2 border-text font-bold text-xs rounded-xl outline-none"
            value={selectedId2}
            onChange={(e) => setSelectedId2(e.target.value)}
            disabled={loadingResumes || comparing}
          >
            <option value="">-- Select Resume V2 --</option>
            {resumes.map(r => (
              <option key={r.id} value={r.id}>
                {r.filename} (Score: {r.atsScore || 'N/A'})
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2 flex justify-center mt-2">
          <button
            type="button"
            onClick={handleCompare}
            disabled={comparing || resumes.length < 2}
            className="px-6 py-3.5 bg-secondary hover:bg-secondary/90 border-2 border-text text-xs font-black rounded-xl text-white shadow-[3px_3px_0px_#1F1F1F] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
          >
            {comparing ? 'Analyzing Differences...' : 'Run Version Comparison'}
          </button>
        </div>
      </div>

      {resumes.length < 2 && !loadingResumes && (
        <p className="text-center text-xs font-bold text-text-light py-4 select-none">
          💡 You need at least 2 uploaded resumes in your history to run comparisons.
        </p>
      )}

      {/* Comparison results */}
      {comparisonResult && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-6"
        >
          {/* Delta score display */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-[#FF8A50]/5 border-2 border-text p-4 rounded-2xl text-center shadow-[3px_3px_0px_#1F1F1F]">
              <span className="text-[10px] font-black text-text-light uppercase tracking-wider block mb-1">V1 Score</span>
              <div className="text-3xl font-black text-text">{comparisonResult.atsScore1}%</div>
            </div>

            <div className="bg-[#4CAF50]/5 border-2 border-accent-green p-4 rounded-2xl text-center shadow-[3px_3px_0px_rgba(76,175,80,0.15)]">
              <span className="text-[10px] font-black text-accent-green uppercase tracking-wider block mb-1">V2 Score</span>
              <div className="text-3xl font-black text-accent-green">{comparisonResult.atsScore2}%</div>
            </div>

            <div className="bg-[#7C5CFF]/5 border-2 border-secondary p-4 rounded-2xl text-center shadow-[3px_3px_0px_rgba(124,92,255,0.15)]">
              <span className="text-[10px] font-black text-secondary uppercase tracking-wider block mb-1">Score Delta</span>
              <div className={`text-3xl font-black ${comparisonResult.atsScoreDiff >= 0 ? 'text-accent-green' : 'text-accent-orange'}`}>
                {comparisonResult.atsScoreDiff >= 0 ? `+${comparisonResult.atsScoreDiff}` : comparisonResult.atsScoreDiff}%
              </div>
            </div>
          </div>

          {/* Rationale explanation */}
          <div className="border-2 border-text p-4 rounded-2xl bg-cream/10">
            <span className="text-[10px] font-black text-text-muted uppercase tracking-wider block mb-1">Comparison Overview:</span>
            <p className="text-xs font-bold text-text leading-relaxed">
              {comparisonResult.atsDifferenceReason}
            </p>
          </div>

          {/* Highlighted changes additions/deletions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ADDITIONS */}
            <div className="border-2 border-text rounded-2xl overflow-hidden shadow-[4px_4px_0px_#1F1F1F]">
              <div className="bg-[#4CAF50]/15 border-b-2 border-text px-4 py-2.5 text-xs font-black text-accent-green">
                ➕ HIGHLIGHTED ADDITIONS
              </div>
              <div className="p-4 bg-white flex flex-col gap-2.5 min-h-[120px]">
                {comparisonResult.highlightedChanges.filter(c => c.type === 'addition').map((c, i) => (
                  <div key={i} className="flex gap-2 text-xs font-bold text-text items-start">
                    <span className="text-accent-green shrink-0">✓</span>
                    <span>{c.text}</span>
                  </div>
                ))}
                {comparisonResult.highlightedChanges.filter(c => c.type === 'addition').length === 0 && (
                  <span className="text-xs font-bold text-text-light text-center py-6 italic">No major additions found.</span>
                )}
              </div>
            </div>

            {/* DELETIONS / REMOVALS */}
            <div className="border-2 border-text rounded-2xl overflow-hidden shadow-[4px_4px_0px_#1F1F1F]">
              <div className="bg-[#FF8A50]/15 border-b-2 border-text px-4 py-2.5 text-xs font-black text-accent-orange">
                ➖ HIGHLIGHTED DELETIONS / SIMPLIFICATIONS
              </div>
              <div className="p-4 bg-white flex flex-col gap-2.5 min-h-[120px]">
                {comparisonResult.highlightedChanges.filter(c => c.type === 'deletion').map((c, i) => (
                  <div key={i} className="flex gap-2 text-xs font-bold text-text-light items-start">
                    <span className="text-accent-orange shrink-0">×</span>
                    <span className="line-through">{c.text}</span>
                  </div>
                ))}
                {comparisonResult.highlightedChanges.filter(c => c.type === 'deletion').length === 0 && (
                  <span className="text-xs font-bold text-text-light text-center py-6 italic">No major deletions found.</span>
                )}
              </div>
            </div>
          </div>

          {/* Improved Skills list */}
          <div className="bg-[#7C5CFF]/5 border-2 border-secondary p-5 rounded-2xl">
            <span className="text-[10px] font-black text-secondary uppercase tracking-wider block mb-3">Key Improved Skills & Keywords:</span>
            <div className="flex flex-wrap gap-2">
              {comparisonResult.improvedSkills.map((s, i) => (
                <span
                  key={i}
                  className="bg-white border-2 border-secondary/40 text-secondary text-xs font-black px-3 py-1 rounded-xl shadow-[2px_2px_0px_rgba(124,92,255,0.15)]"
                >
                  {s}
                </span>
              ))}
              {comparisonResult.improvedSkills.length === 0 && (
                <span className="text-xs font-bold text-text-light italic">No new tech stack keywords detected.</span>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
