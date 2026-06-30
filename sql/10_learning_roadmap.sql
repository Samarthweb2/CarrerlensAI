-- Query 10: Learning Roadmap Generator
-- Purpose: Generate a sequential learning roadmap based on the missing skills for a candidate-job pair.
-- Used in: Dynamic learning recommendation module.

SELECT 
    c.first_name || ' ' || c.last_name AS candidate_name,
    j.title AS job_role,
    s.name AS missing_skill,
    sr.step_number,
    sr.topic AS learning_step,
    sr.description AS step_details
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
JOIN 
    skill_roadmaps sr ON s.id = sr.skill_id
WHERE 
    cs.skill_id IS NULL
ORDER BY 
    candidate_name, job_role, missing_skill, sr.step_number;
