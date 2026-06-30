-- Query 8: Candidate-Job Skill Match Percentage
-- Purpose: Calculate how well a candidate's skills match the requirements of each job posting.
-- Used in: Candidate recommendations list / matching engine.

SELECT 
    c.first_name || ' ' || c.last_name AS candidate_name,
    j.title AS job_title,
    j.company AS company_name,
    COUNT(cs.skill_id) AS matching_skills_count,
    (SELECT COUNT(*) FROM job_skills WHERE job_id = j.id) AS total_skills_required,
    ROUND(
        (CAST(COUNT(cs.skill_id) AS REAL) / 
        (SELECT COUNT(*) FROM job_skills WHERE job_id = j.id)) * 100, 
        2
    ) AS match_percentage
FROM 
    candidates c
CROSS JOIN 
    jobs j
LEFT JOIN 
    candidate_skills cs ON c.id = cs.candidate_id 
    AND cs.skill_id IN (SELECT skill_id FROM job_skills WHERE job_id = j.id)
GROUP BY 
    c.id, j.id
ORDER BY 
    match_percentage DESC;
