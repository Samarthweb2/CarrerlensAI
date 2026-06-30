-- Query 9: Skill Gap Analysis
-- Purpose: For each candidate-job pair, identify which skills the job requires that the candidate lacks.
-- Used in: Feedback panel to student on what they are missing.

SELECT 
    c.first_name || ' ' || c.last_name AS candidate_name,
    j.title AS job_title,
    j.company AS company_name,
    s.name AS missing_skill_name,
    js.importance AS skill_importance
FROM 
    candidates c
CROSS JOIN 
    jobs j
JOIN 
    job_skills js ON j.id = js.job_id
JOIN 
    skills s ON js.skill_id = s.id
LEFT JOIN 
    candidate_skills cs ON c.id = cs.candidate_id AND cs.skill_id = js.skill_id
WHERE 
    cs.skill_id IS NULL
ORDER BY 
    candidate_name, job_title;
