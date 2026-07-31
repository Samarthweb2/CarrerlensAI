import json
from typing import Dict, Any, List, Optional

def build_resume_analysis_prompt(
    parsed_resume: Dict[str, Any],
    job_description: Optional[str] = None,
    missing_skills_from_db: Optional[List[str]] = None,
    top_matches_text: Optional[str] = None
) -> str:
    """
    Constructs the prompt sent to Gemini for single resume analysis.
    """
    jd_context = ""
    if job_description:
        jd_context = f"\nTarget Job Description to align and score against:\n{job_description}\n"
        
    db_context = ""
    if missing_skills_from_db:
        db_context += f"\nBased on database analysis of similar roles, these critical skills are missing from the candidate's resume: {', '.join(missing_skills_from_db)}\n"
    if top_matches_text:
        db_context += f"\nThe database similarity search matched the resume with these top roles:\n{top_matches_text}\n"
    
    prompt = f"""
    You are an expert ATS (Applicant Tracking System) parser and student talent advisor.
    Analyze this parsed resume data and generate standard metric grades, missing skills, career roadmap, and matching roles.
    {jd_context}
    {db_context}
    
    Resume Input Data:
    {json.dumps(parsed_resume, indent=2)}
    
    Your entire response MUST be a single parseable JSON document matching exactly this schema:
    {{
        "atsScore": 91, // integer score from 0-100 evaluating ATS compatibility. CRITICAL: If a job description is provided, this MUST represent the match percentage between the resume and the job description.
        "resumeScore": 89, // integer overall resume quality score from 0-100
        "formatting": 95, // integer score evaluating formatting quality
        "grammar": 93, // integer grammar score
        "keywords": 86, // integer keyword match percentage
        "skillsFound": ["Python", "SQL", "React"], // list of extracted tech skills
        "missingSkills": {json.dumps(missing_skills_from_db or ["Docker", "AWS", "CI/CD"])}, // list of target skills. CRITICAL: Ensure you include the database-derived missing skills listed in the context above.
        "suggestions": [
            "Add measurable achievements with exact impact metrics (e.g. 'Improved database query speed by 35%').",
            "Include your portfolio or GitHub links for project verification."
        ], // list of specific actionable recommendations. If a job description is provided, tailor these suggestions to help the user match the job requirements.
        "improvements": [
            {{
                "before": "Worked on SQL database.",
                "after": "Designed and optimized SQL queries reducing execution time by 35% through query profiling.",
                "reason": "Quantified impact with metrics and specified exact optimizations."
            }}
        ], // specific resume bullet point improvement suggestions. CRITICAL: Rephrase actual weak bullets found in the resume. If a job description is provided, show how to align these bullets with the job description requirements using the "before" and "after" format.
        "interviewQuestions": [
            "You mentioned SQL query optimization. Can you explain the specific indexing or profiling steps you took to improve performance by 35%?"
        ], // custom mock interview questions suggested to practice candidate's gaps for this job. If a job description is provided, base these questions on the overlap and gaps between the resume and the job description.
        "sectionScores": {{
            "Education": 95,
            "Experience": 78,
            "Projects": 87,
            "Skills": 72,
            "Summary": 61,
            "Certifications": 85
        }}, // scores from 0-100 evaluating content density in sections
        "keywordMatch": {{
            "matched": 82, // integer matched keyword percentage
            "missing": 18, // integer missing keyword percentage
            "density": "4.2%" // string representing keyword repetition density
        }},
        "roadmap": [
            {{"title": "Student / Foundational", "completed": true, "desc": "Acquired core programming or field-specific skills"}},
            {{"title": "Junior Engineer / Analyst", "completed": true, "desc": "Initial role details"}},
            {{"title": "Mid-Level Professional", "completed": true, "desc": "Next milestone details"}},
            {{"title": "Senior Professional", "completed": false, "desc": "Advanced role details"}},
            {{"title": "Lead / Architect", "completed": false, "desc": "Technical lead or specialty lead details"}},
            {{"title": "VP / Director / CTO", "completed": false, "desc": "Executive or principal lead details"}}
        ], // 6 milestone items dynamically tailored to the candidate's actual target field.
        "jobMatches": [
            {{"company": "Google", "role": "Software Engineer I", "match": 92, "salary": "₹18–24 LPA", "location": "Bangalore", "logo": "G", "color": "#4285F4"}}
        ]
    }}
    
    Strict constraints:
    1. Do not wrap the JSON output in markdown ```json or other formatting. Return ONLY raw JSON text.
    2. Provide actual analysis based on the candidate's parsed resume details and the target job description if provided.
    3. Ensure all JSON keys match exactly.
    """
    return prompt

def build_resume_comparison_prompt(
    r1_text: str,
    r2_text: str,
    filename1: str = "Resume V1",
    filename2: str = "Resume V2"
) -> str:
    """
    Constructs the prompt sent to Gemini for comparing two resumes.
    """
    return f"""
    You are an expert talent recruiter comparing two versions of a candidate's resume:
    Resume 1 ({filename1}):
    {r1_text[:6000]}
    
    Resume 2 ({filename2}):
    {r2_text[:6000]}
    
    Compare these two resumes and return a JSON document matching exactly this schema:
    {{
        "atsScore1": 85, // estimated ATS score for Resume 1 (0-100)
        "atsScore2": 92, // estimated ATS score for Resume 2 (0-100)
        "atsScoreDiff": 7, // difference (atsScore2 - atsScore1)
        "highlightedChanges": [
            {{"type": "addition", "text": "Added AWS ECS deployment experience to projects."}},
            {{"type": "deletion", "text": "Removed old high school store associate job."}}
        ], // list of addition/deletion summaries
        "improvedSkills": ["AWS ECS", "Docker", "CI/CD"], // list of new/better presented skills in Resume 2
        "atsDifferenceReason": "Resume 2 quantifies impact, removes redundant high school experience, and adds key DevOps keywords (Docker, ECS)."
    }}
    
    Strict constraints:
    1. Return ONLY the raw JSON text.
    2. Analyze actual content differences between Resume 1 and Resume 2.
    """
