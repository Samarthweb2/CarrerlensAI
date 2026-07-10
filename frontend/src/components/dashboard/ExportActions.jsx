import React from 'react';
import { motion } from 'framer-motion';

export default function ExportActions({ onReset, onCopySuggestions, data = {} }) {
  
  const downloadCSV = () => {
    const csvRows = [];
    csvRows.push("CareerLensAI Analysis Report");
    csvRows.push(`File Name,${data.fileName || "Resume.pdf"}`);
    csvRows.push(`Upload Date,${data.uploadDate || "Today"}`);
    csvRows.push(`ATS Score,${data.atsScore || 0}%`);
    csvRows.push(`Resume Quality Score,${data.resumeScore || 0}%`);
    csvRows.push(`Formatting Score,${data.formatting || 0}%`);
    csvRows.push(`Grammar Score,${data.grammar || 0}%`);
    csvRows.push("");
    
    csvRows.push("Section,Score");
    if (data.sectionScores) {
      Object.entries(data.sectionScores).forEach(([section, score]) => {
        csvRows.push(`${section},${score}%`);
      });
    }
    csvRows.push("");
    
    csvRows.push("Skills Extracted");
    if (data.skillsFound) {
      csvRows.push(data.skillsFound.join(" | "));
    }
    csvRows.push("");
    
    csvRows.push("Missing Target Skills");
    if (data.missingSkills) {
      csvRows.push(data.missingSkills.join(" | "));
    }
    csvRows.push("");
    
    csvRows.push("AI Actionable Suggestions");
    if (data.suggestions) {
      data.suggestions.forEach((s, idx) => {
        csvRows.push(`Suggestion #${idx + 1},"${s.replace(/"/g, '""')}"`);
      });
    }

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.map(e => e).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${(data.fileName || 'Resume').split('.')[0]}_ATS_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white border-3 border-text p-6 sm:p-8 rounded-3xl shadow-[6px_6px_0px_#1F1F1F] select-none text-left w-full flex flex-col md:flex-row md:items-center justify-between gap-4">
      
      <div>
        <h3 className="text-sm font-black text-text uppercase tracking-wider mb-1">Export Analysis Reports</h3>
        <p className="text-xs font-bold text-text-light">
          Share your resume grade or save the optimizations list offline.
        </p>
      </div>

      <div className="flex flex-wrap gap-2.5">
        <button
          onClick={handlePrint}
          className="px-4 py-2 border-2 border-text bg-[#FFD54F]/10 hover:bg-[#FFD54F]/30 text-xs font-black rounded-xl text-text transition-all cursor-pointer active:scale-95 shadow-[2px_2px_0px_#1F1F1F]"
        >
          📄 Print PDF
        </button>

        <button
          onClick={downloadCSV}
          className="px-4 py-2 border-2 border-text bg-secondary/10 hover:bg-secondary/20 text-xs font-black rounded-xl text-text transition-all cursor-pointer active:scale-95 shadow-[2px_2px_0px_#1F1F1F]"
        >
          📊 Export Excel/CSV
        </button>

        <button
          onClick={onCopySuggestions}
          className="px-4 py-2 border-2 border-text bg-white hover:bg-cream-dark/20 text-xs font-black rounded-xl text-text transition-all cursor-pointer active:scale-95 shadow-[2px_2px_0px_#1F1F1F]"
        >
          📋 Copy Suggestions
        </button>

        <button
          onClick={onReset}
          className="px-5 py-2 bg-primary hover:bg-[#FFD54F] border-2 border-text text-xs font-black rounded-xl text-text transition-all cursor-pointer active:scale-95 shadow-[2px_2px_0px_#1F1F1F]"
        >
          🔄 New Scan
        </button>
      </div>

    </div>
  );
}
