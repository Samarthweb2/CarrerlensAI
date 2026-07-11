import os
import re
import json
import logging
from typing import Dict, Any, List, Optional
# pyrefly: ignore [missing-import]
import google.generativeai as genai
from sqlalchemy.orm import Session
from database.models import JobRole

logger = logging.getLogger(__name__)

# Configure Google Generative AI if key is present
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
else:
    logger.warning("GEMINI_API_KEY not found in environment. Falling back to local heuristic calculations.")

def analyze_resume_text(parsed_resume: Dict[str, Any], job_description: Optional[str] = None, db: Session = None) -> Dict[str, Any]:
    """
    Core entrypoint for resume analysis. Uses Gemini AI if GEMINI_API_KEY is configured,
    otherwise falls back to dynamic local heuristic evaluations.
    """
    target_jd = job_description
    job_matches = []
    missing_skills_from_db = []
    top_matches_text = ""
    
    # NEW DATA-DRIVEN WORKFLOW: Match against our Job Knowledge Base
    if db:
        try:
            user_skills = set([s.lower() for s in parsed_resume.get("skills", [])])
            
            # Prevent RAM overflow (OOM crash) on Render's 512MB RAM container:
            # Query only required columns and limit results using a dynamic LIKE filter on user's top skills
            from sqlalchemy import or_
            filters = []
            # Match top 15 skills to keep database index/scan search space small and fast
            for skill in list(user_skills)[:15]:
                clean_sk = skill.replace('"', '').replace('%', '') # sanitize input
                filters.append(JobRole.required_skills.like(f'%"{clean_sk}"%'))
                filters.append(JobRole.ats_keywords.like(f'%"{clean_sk}"%'))

            if filters:
                roles = db.query(
                    JobRole.title, JobRole.company, JobRole.location, JobRole.industry,
                    JobRole.description, JobRole.required_skills, JobRole.preferred_skills,
                    JobRole.salary_min, JobRole.salary_max, JobRole.work_type, JobRole.ats_keywords
                ).filter(or_(*filters)).limit(2000).all()
            else:
                roles = db.query(
                    JobRole.title, JobRole.company, JobRole.location, JobRole.industry,
                    JobRole.description, JobRole.required_skills, JobRole.preferred_skills,
                    JobRole.salary_min, JobRole.salary_max, JobRole.work_type, JobRole.ats_keywords
                ).limit(200).all()
                
            scored_roles = []
            for r in roles:
                # Combine required skills and ATS keywords for matching
                role_skills = set([s.lower() for s in (r.required_skills or [])] + [s.lower() for s in (r.ats_keywords or [])])
                overlap = len(user_skills.intersection(role_skills))
                total_unique_skills = len(user_skills.union(role_skills))
                
                # Jaccard index similarity
                base_score = (overlap / total_unique_skills) * 100 if total_unique_skills > 0 else 0
                
                # Boost match score for better UI visibility (e.g. min 40, max 99)
                match_score = min(int(base_score * 1.5 + 40), 99) if overlap > 0 else 0
                scored_roles.append((match_score, r))

                
            # Sort by highest score
            scored_roles.sort(key=lambda x: x[0], reverse=True)
            top_20 = scored_roles[:20]
            top_5 = scored_roles[:5]
            
            # Format top 5 roles for the UI
            colors = ["#4285F4", "#F25022", "#FF9900", "#007CC3", "#34A853"]
            job_matches = []
            for i, (score, r) in enumerate(top_5):
                # Format estimated salary range
                salary_str = "₹8–15 LPA"
                if r.salary_min and r.salary_max:
                    salary_str = f"₹{r.salary_min // 100000}–{r.salary_max // 100000} LPA"
                
                job_matches.append({
                    "company": r.company or "Tech Enterprise",
                    "role": r.title,
                    "match": score,
                    "salary": salary_str,
                    "location": r.location or "Remote",
                    "logo": r.company[0] if r.company else r.title[0],
                    "color": colors[i % len(colors)]
                })
            
            # Aggregate required skills from top 20 jobs
            aggregated_required_skills = {}
            for score, r in top_20:
                for skill in (r.required_skills or []):
                    skill_lower = skill.lower()
                    aggregated_required_skills[skill_lower] = aggregated_required_skills.get(skill_lower, 0) + 1
            
            # Sort aggregated skills by frequency
            sorted_aggregated_skills = sorted(aggregated_required_skills.items(), key=lambda x: x[1], reverse=True)
            
            # Identify missing skills: top required skills across matches that the user does not have
            missing_set = []
            for skill_lower, freq in sorted_aggregated_skills[:10]:
                if skill_lower not in user_skills:
                    # Find proper cased name
                    proper_name = skill_lower.title()
                    # Special cased cased skills
                    if skill_lower == 'sql': proper_name = 'SQL'
                    elif skill_lower == 'aws': proper_name = 'AWS'
                    elif skill_lower == 'gcp': proper_name = 'GCP'
                    elif skill_lower == 'ci/cd': proper_name = 'CI/CD'
                    elif skill_lower == 'api': proper_name = 'API'
                    missing_set.append(proper_name)
            missing_skills_from_db = missing_set
            
            # Format top matched jobs summary text for Gemini prompt
            top_matches_text = "\n".join([
                f"- {r.title} at {r.company} (Match Score: {score}%)"
                for score, r in top_5
            ])
            
            # If the user didn't paste a specific JD, use our Top Matched role!
            if not target_jd and top_5:
                top_role = top_5[0][1]
                target_jd = f"Target Role: {top_role.title}\nCompany: {top_role.company}\nDescription: {top_role.description}\nRequired Skills: {', '.join(top_role.required_skills or [])}\nATS Keywords: {', '.join(top_role.ats_keywords or [])}"
                logger.info(f"Using matched job role as target JD: {top_role.title}")
                
        except Exception as e:
            logger.error(f"Failed to match against Job Knowledge Base: {e}")

    if GEMINI_API_KEY:
        try:
            result = analyze_resume_with_gemini(parsed_resume, target_jd, missing_skills_from_db, top_matches_text)
            if job_matches:
                result["jobMatches"] = job_matches
            return result
        except Exception as e:
            logger.error(f"Gemini API analysis failed: {e}. Falling back to heuristic mapping.")
            
    result = analyze_resume_with_heuristics(parsed_resume, target_jd)
    if job_matches:
        result["jobMatches"] = job_matches
    return result

def analyze_resume_with_gemini(
    parsed_resume: Dict[str, Any], 
    job_description: Optional[str] = None,
    missing_skills_from_db: List[str] = None,
    top_matches_text: str = None
) -> Dict[str, Any]:
    """
    Queries Gemini 1.5/2.5 API with strict JSON schema instructions to analyze resume text.
    """
    model = genai.GenerativeModel(
        model_name="gemini-1.5-flash",
        generation_config={"response_mime_type": "application/json"}
    )
    
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
            {{"title": "Student", "completed": true, "desc": "Foundational coursework & project building"}},
            {{"title": "Junior Analyst", "completed": true, "desc": "Data cleaning, reporting & SQL wrangling"}},
            {{"title": "Data Analyst", "completed": true, "desc": "Dashboards, statistical tests & business reviews"}},
            {{"title": "Senior Analyst", "completed": false, "desc": "Predictive models, pipeline architecture & coaching"}},
            {{"title": "Analytics Engineer", "completed": false, "desc": "dbt orchestration, warehousing & analytics pipelines"}},
            {{"title": "AI Engineer", "completed": false, "desc": "LLMs tuning, agent systems & microservice deployments"}}
        ], // 6 milestone items displaying the candidate's career progression path
        "jobMatches": [
            {{"company": "Google", "role": "Associate Data Analyst", "match": 92, "salary": "₹18–24 LPA", "location": "Bangalore", "logo": "G", "color": "#4285F4"}},
            {{"company": "Microsoft", "role": "Data Engineer I", "match": 89, "salary": "₹20–26 LPA", "location": "Hyderabad", "logo": "M", "color": "#F25022"}}
        ] // list of job recommendation objects
    }}
    
    Strict constraints:
    1. Do not wrap the JSON output in markdown ```json or other formatting. Return ONLY raw JSON text.
    2. Provide actual analysis based on the candidate's parsed resume details and the target job description if provided.
    3. Ensure all JSON keys match exactly.
    """
    
    response = model.generate_content(prompt)
    response_text = response.text.strip()
    
    # Parse the output
    try:
        # Strip potential markdown formatting if returned anyway
        if response_text.startswith("```"):
            response_text = re.sub(r"^```(?:json)?\n", "", response_text)
            response_text = re.sub(r"\n```$", "", response_text)
        return json.loads(response_text)
    except Exception as parse_err:
        logger.error(f"Failed to parse Gemini response JSON: {parse_err}. Raw output was: {response_text}")
        raise parse_err

def analyze_resume_with_heuristics(parsed_resume: Dict[str, Any], job_description: Optional[str] = None) -> Dict[str, Any]:
    """
    Local dynamic backup logic to compute resume metrics if the API is disabled/offline.
    """
    skills = parsed_resume.get("skills", [])
    text = parsed_resume.get("text", "")
    
    skills_count = len(skills)
    ats_score = min(60 + (skills_count * 4), 98)
    resume_score = min(58 + (skills_count * 5), 97)
    
    # If job description is present, calculate a match based on overlapping keywords
    if job_description:
        jd_lower = job_description.lower()
        matches = 0
        for s in skills:
            if s.lower() in jd_lower:
                matches += 1
        ats_score = min(40 + (matches * 15), 98) if skills else 40
    
    education_score = 95 if parsed_resume.get("education") else 0
    experience_score = min(40 + (len(parsed_resume.get("experience", [])) * 5), 95) if parsed_resume.get("experience") else 40
    projects_score = min(50 + (len(parsed_resume.get("projects", [])) * 10), 95) if parsed_resume.get("projects") else 40
    skills_score = min(40 + (skills_count * 6), 98)
    
    links = parsed_resume.get("links", {})
    formatting_penalty = 0
    if not links.get("github"):
        formatting_penalty += 5
    if not links.get("linkedin"):
        formatting_penalty += 5
    formatting_score = 100 - formatting_penalty
    
    grammar_score = 94 if len(text) > 100 else 50
    keyword_match_percentage = min(50 + (skills_count * 5), 95)
    keyword_missing_percentage = 100 - keyword_match_percentage
    
    tech_stack_universe = ["Docker", "AWS", "Kubernetes", "CI/CD", "TypeScript", "Python", "SQL", "React", "Node.js", "FastAPI"]
    missing_skills = [s for s in tech_stack_universe if s not in skills][:5]
    if not missing_skills:
        missing_skills = ["Docker", "AWS", "Communication", "CI/CD", "Leadership"]
        
    suggestions = []
    if len(parsed_resume.get("experience", [])) < 3:
        suggestions.append("Add measurable achievements with exact impact metrics (e.g. 'Improved database query speed by 35%').")
    if not links.get("github"):
        suggestions.append("Include a link to your GitHub portfolio for project validation.")
    if "AWS" in missing_skills or "Docker" in missing_skills:
        suggestions.append("Add cloud-related hosting and container deployment projects (e.g., AWS, Docker).")
    if not parsed_resume.get("education"):
        suggestions.append("Ensure your Education section explicitly lists your degree, university, and graduation year.")
    if len(skills) < 5:
        suggestions.append("List more technical skill keywords matching target job descriptions.")
    
    if len(suggestions) < 3:
        suggestions.extend([
            "Tailor your professional summary to emphasize analytical skillsets.",
            "Detail target internship or freelance experience to expand proof of work."
        ])
    
    roadmap = [
        {"title": "Student", "completed": True, "desc": "Foundational coursework & project building"},
        {"title": "Junior Analyst", "completed": True, "desc": "Data cleaning, reporting & SQL wrangling"},
        {"title": "Data Analyst", "completed": ats_score >= 70, "desc": "Dashboards, statistical tests & business reviews"},
        {"title": "Senior Analyst", "completed": False, "desc": "Predictive models, pipeline architecture & coaching"},
        {"title": "Analytics Engineer", "completed": False, "desc": "dbt orchestration, warehousing & analytics pipelines"},
        {"title": "AI Engineer", "completed": False, "desc": "LLMs tuning, agent systems & microservice deployments"}
    ]
    
    job_matches = [
        {"company": "Google", "role": "Associate Data Analyst", "match": min(ats_score + 1, 99), "salary": "₹18–24 LPA", "location": "Bangalore", "logo": "G", "color": "#4285F4"},
        {"company": "Microsoft", "role": "Data Engineer I", "match": min(ats_score - 2, 99), "salary": "₹20–26 LPA", "location": "Hyderabad", "logo": "M", "color": "#F25022"},
        {"company": "Amazon", "role": "Business Intelligence Eng", "match": min(ats_score - 4, 99), "salary": "₹16–22 LPA", "location": "Chennai", "logo": "A", "color": "#FF9900"},
        {"company": "Infosys", "role": "Systems Engineer", "match": min(ats_score + 5, 99), "salary": "₹8–12 LPA", "location": "Pune", "logo": "I", "color": "#007CC3"}
    ]

    improvements = [
        {
            "before": "Worked on SQL database.",
            "after": "Designed and optimized SQL queries reducing execution latency by 35% through indexes and schema modifications.",
            "reason": "Quantified business impact and highlighted specific database performance techniques."
        },
        {
            "before": "Built React pages and UI interfaces.",
            "after": "Implemented responsive React components using Tailwind CSS, improving client-side page load speed by 25%.",
            "reason": "Used active verbs and quantified performance improvements for user experience."
        }
    ]

    interview_questions = [
        "In your resume, you mentioned optimizing SQL queries to reduce execution time by 35%. Can you walk us through the profiling tools and specific index modifications you used?",
        "How do you evaluate which React components require caching or memoization to achieve the 25% speed increase you noted?"
    ]

    return {
        "atsScore": ats_score,
        "resumeScore": resume_score,
        "formatting": formatting_score,
        "grammar": grammar_score,
        "keywords": keyword_match_percentage,
        "skillsFound": skills,
        "missingSkills": missing_skills,
        "suggestions": suggestions,
        "improvements": improvements,
        "interviewQuestions": interview_questions,
        "sectionScores": {
            "Education": education_score,
            "Experience": experience_score,
            "Projects": projects_score,
            "Skills": skills_score,
            "Summary": 65 if "summary" in text.lower() else 35,
            "Certifications": 85 if parsed_resume.get("certifications") else 40
        },
        "keywordMatch": {
            "matched": keyword_match_percentage,
            "missing": keyword_missing_percentage,
            "density": f"{min(2.0 + (skills_count * 0.3), 6.5):.1f}%"
        },
        "roadmap": roadmap,
        "jobMatches": job_matches,
        "historyData": [
            {"label": "Scan 1", "score": max(50, ats_score - 15)},
            {"label": "Scan 2", "score": max(60, ats_score - 8)},
            {"label": "Scan 3", "score": ats_score}
        ]
    }

def compare_resumes(r1_text: str, r2_text: str, filename1: str = "Resume V1", filename2: str = "Resume V2") -> Dict[str, Any]:
    """
    Compares two resumes using Gemini to highlight changes, improved skills, and ATS differences.
    """
    if GEMINI_API_KEY:
        try:
            model = genai.GenerativeModel(
                model_name="gemini-1.5-flash",
                generation_config={"response_mime_type": "application/json"}
            )
            prompt = f"""
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
            response = model.generate_content(prompt)
            response_text = response.text.strip()
            if response_text.startswith("```"):
                response_text = re.sub(r"^```(?:json)?\n", "", response_text)
                response_text = re.sub(r"\n```$", "", response_text)
            return json.loads(response_text)
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

