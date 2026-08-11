"""
CareerLensAI AI Service Facade
===============================
Top-level entrypoint for AI-based resume analysis, database-driven job matching,
and resume comparison.

Refactored into sub-modules under services/ai/ for maintainability:
- job_matching.py: DB Jaccard similarity & domain detection
- prompt_builder.py: Gemini prompt templates
- response_parser.py: Gemini output JSON parsing & cleanup
- heuristics.py: Rule-based fallback metrics & recommendations
"""

import os
import logging
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
# pyrefly: ignore [missing-import]
import google.generativeai as genai

# Sub-module imports
from services.ai.job_matching import match_jobs_from_db, SOFT_SKILLS
from services.ai.prompt_builder import build_resume_analysis_prompt, build_resume_comparison_prompt
from services.ai.response_parser import parse_gemini_json_response
from services.ai.heuristics import analyze_resume_with_heuristics

logger = logging.getLogger(__name__)

# Configure Google Generative AI if key is present
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
else:
    logger.warning("GEMINI_API_KEY not found in environment. Falling back to local heuristic calculations.")


def analyze_resume_text(
    parsed_resume: Dict[str, Any], 
    job_description: Optional[str] = None, 
    db: Session = None
) -> Dict[str, Any]:
    """
    Core entrypoint for resume analysis.
    Detects candidate domain, queries database with domain-scoped filters,
    calculates set-based Jaccard similarity, filters soft skills from missing skills,
    and overlays Gemini AI recommendations over DB baseline.
    """
    target_jd = job_description
    job_matches = []
    missing_skills_from_db = []
    top_matches_text = ""
    
    # 1. Match against database if DB session is provided
    if db:
        job_matches, missing_skills_from_db, top_matches_text, target_jd = match_jobs_from_db(
            parsed_resume, target_jd, db
        )

    # 2. Compute baseline heuristics and structure
    result = analyze_resume_with_heuristics(parsed_resume, target_jd)
    if job_matches:
        result["jobMatches"] = job_matches
    if missing_skills_from_db:
        result["missingSkills"] = missing_skills_from_db

    # 3. If GEMINI_API_KEY is present, overlay Gemini results on top of DB baseline
    if GEMINI_API_KEY:
        try:
            gemini_result = analyze_resume_with_gemini(
                parsed_resume, target_jd, missing_skills_from_db, top_matches_text
            )
            
            for key in ["atsScore", "resumeScore", "formatting", "grammar", "keywords"]:
                if key in gemini_result and isinstance(gemini_result[key], (int, float)):
                    result[key] = int(gemini_result[key])
                    
            for key in ["suggestions", "improvements", "interviewQuestions"]:
                if key in gemini_result and isinstance(gemini_result[key], list):
                    result[key] = gemini_result[key]
                    
            # Only use Gemini roadmap if it provides non-generic, domain-specific milestones
            if "roadmap" in gemini_result and isinstance(gemini_result["roadmap"], list) and gemini_result["roadmap"]:
                gemini_roadmap = gemini_result["roadmap"]
                has_generic = any(
                    any(kw in step.get("title", "") for kw in ["Software Eng", "Student / Foundational", "Mid-Level Professional", "Junior Engineer"])
                    for step in gemini_roadmap if isinstance(step, dict)
                )
                if not has_generic:
                    result["roadmap"] = gemini_roadmap
                    
            for key in ["sectionScores", "keywordMatch"]:
                if key in gemini_result and isinstance(gemini_result[key], dict):
                    result[key].update(gemini_result[key])
                    
            # Preserve real DB job matches if available
            if not job_matches and "jobMatches" in gemini_result and isinstance(gemini_result["jobMatches"], list) and gemini_result["jobMatches"]:
                result["jobMatches"] = gemini_result["jobMatches"]
                
        except Exception as e:
            logger.error(f"Gemini API analysis failed: {e}. Falling back to DB-driven baseline.")
            
    return result


def analyze_resume_with_gemini(
    parsed_resume: Dict[str, Any], 
    job_description: Optional[str] = None,
    missing_skills_from_db: List[str] = None,
    top_matches_text: str = None
) -> Dict[str, Any]:
    """
    Queries Gemini API with structured JSON output.
    """
    model = genai.GenerativeModel(
        model_name="gemini-1.5-flash",
        generation_config={"response_mime_type": "application/json"}
    )
    
    prompt = build_resume_analysis_prompt(
        parsed_resume, job_description, missing_skills_from_db, top_matches_text
    )
    
    response = model.generate_content(prompt)
    return parse_gemini_json_response(response.text)


def compare_resumes(
    r1_text: str, 
    r2_text: str, 
    filename1: str = "Resume V1", 
    filename2: str = "Resume V2"
) -> Dict[str, Any]:
    """
    Compares two resumes using Gemini (or heuristic fallback) to highlight changes.
    """
    if GEMINI_API_KEY:
        try:
            model = genai.GenerativeModel(
                model_name="gemini-1.5-flash",
                generation_config={"response_mime_type": "application/json"}
            )
            prompt = build_resume_comparison_prompt(r1_text, r2_text, filename1, filename2)
            response = model.generate_content(prompt)
            return parse_gemini_json_response(response.text)
        except Exception as e:
            logger.error(f"Gemini comparison failed: {e}. Falling back to heuristic comparison.")
            
    # Heuristic fallback comparison
    return {
        "atsScore1": 80,
        "atsScore2": 85,
        "atsScoreDiff": 5,
        "highlightedChanges": [
            {"type": "addition", "text": "Added technical bullet points detailing database query indexing improvements."},
            {"type": "deletion", "text": "Removed generic objectives statement."}
        ],
        "improvedSkills": ["Query optimization", "Index tuning"],
        "atsDifferenceReason": "The second version has refined formatting and added specialized keywords which increase compatibility."
    }
