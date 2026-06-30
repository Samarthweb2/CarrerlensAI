-- Query 7: Jobs Requiring Python
-- Purpose: Retrieve all job listings that explicitly demand Python skills.
-- Used in: Python-specific job filtering widgets.

SELECT 
    j.id AS job_id,
    j.title AS job_title,
    j.company,
    j.location,
    j.salary,
    js.importance
FROM 
    jobs j
JOIN 
    job_skills js ON j.id = js.job_id
JOIN 
    skills s ON js.skill_id = s.id
WHERE 
    s.name = 'Python'
ORDER BY 
    j.salary DESC;
