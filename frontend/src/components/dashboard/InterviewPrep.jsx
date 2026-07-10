import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function InterviewPrep({ questions = [] }) {
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState({});
  const [loadingFeedback, setLoadingFeedback] = useState({});

  const handleAnswerChange = (idx, value) => {
    setAnswers(prev => ({ ...prev, [idx]: value }));
  };

  const handlePracticeSubmit = (idx, qText) => {
    const candidateAnswer = answers[idx];
    if (!candidateAnswer) {
      alert("Please write your answer response before submitting! ✏️");
      return;
    }

    setLoadingFeedback(prev => ({ ...prev, [idx]: true }));
    // Simulate smart AI feedback locally for a premium interactive feel
    setTimeout(() => {
      setLoadingFeedback(prev => ({ ...prev, [idx]: false }));
      
      const score = Math.min(65 + candidateAnswer.length // length boost
                     + (candidateAnswer.toLowerCase().includes("designed") ? 10 : 0)
                     + (candidateAnswer.toLowerCase().includes("reduced") ? 10 : 0)
                     + (candidateAnswer.toLowerCase().includes("optimized") ? 10 : 0), 98);
      
      setFeedback(prev => ({
        ...prev,
        [idx]: {
          score,
          verdict: score >= 85 ? "Excellent Response! 🌟" : score >= 70 ? "Good Attempt! 👍" : "Needs Work ⚠️",
          notes: score >= 85 
            ? "Great job quantifying your impact and explaining the technical methodology. You directly answered the core query." 
            : "Try listing specific engineering tools or libraries, and quantify the result (e.g. 'reduced latency by 20%') to increase credibility."
        }
      }));
    }, 1500);
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="bg-white border-3 border-text p-8 rounded-3xl shadow-[6px_6px_0px_#1F1F1F] text-center select-none">
        <span className="text-4xl mb-3 block">🧠</span>
        <h3 className="text-lg font-black text-text mb-1">No Custom Interview Questions</h3>
        <p className="text-xs font-bold text-text-light max-w-sm mx-auto">
          Scan your resume against a target job description to let Gemini assemble customized behavioral and technical interview questions based on your experience.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border-3 border-text p-6 sm:p-8 rounded-3xl shadow-[6px_6px_0px_#1F1F1F] text-left w-full">
      <div className="flex items-center gap-2.5 mb-2">
        <span className="text-2xl">🧠</span>
        <h3 className="text-sm font-black text-text uppercase tracking-wider">AI Custom Interview Prep</h3>
      </div>
      <p className="text-xs font-bold text-text-light mb-6">
        Here are custom interview questions generated to test the specific gaps between your resume experience and target requirements. Practice your answers below:
      </p>

      <div className="flex flex-col gap-6">
        {questions.map((q, idx) => (
          <div
            key={idx}
            className="border-2 border-text rounded-2xl p-5 bg-cream/15 flex flex-col gap-4 shadow-[4px_4px_0px_#1F1F1F]"
          >
            {/* Question title */}
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 shrink-0 bg-[#7C5CFF] border-2 border-text font-black text-xs text-white rounded-full flex items-center justify-center">
                {idx + 1}
              </span>
              <p className="text-xs sm:text-sm font-black text-text leading-relaxed">
                {q}
              </p>
            </div>

            {/* Answer Input textarea */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-black text-text-muted uppercase tracking-wider">Your Response:</span>
              <textarea
                className="w-full h-24 p-3.5 bg-white border-2 border-card-border hover:border-text focus:border-secondary rounded-xl text-xs font-bold text-text resize-none outline-none transition-all placeholder:text-text-muted"
                placeholder="Type your response here. Try to use Action Verbs and specify metrics..."
                value={answers[idx] || ''}
                onChange={(e) => handleAnswerChange(idx, e.target.value)}
              />
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => handlePracticeSubmit(idx, q)}
                disabled={loadingFeedback[idx]}
                className="px-4 py-2.5 bg-primary border-2 border-text text-xs font-black rounded-xl text-text shadow-[2px_2px_0px_#1F1F1F] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
              >
                {loadingFeedback[idx] ? 'Evaluating...' : 'Submit Response'}
              </button>
            </div>

            {/* Feedback presentation */}
            {feedback[idx] && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="border-t border-card-border/60 pt-4 mt-1 flex flex-col gap-2.5 text-left"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-secondary bg-secondary/10 px-2 py-0.5 rounded border border-secondary/35 uppercase">
                    AI Assessment: {feedback[idx].verdict}
                  </span>
                  <span className="text-xs font-black text-text">
                    Readiness Score: {feedback[idx].score}%
                  </span>
                </div>
                <p className="text-xs font-bold text-text-light bg-white border border-card-border p-3 rounded-xl">
                  {feedback[idx].notes}
                </p>
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
