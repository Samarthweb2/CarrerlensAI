-- Query 6: Jobs Requiring SQL
-- Purpose: Retrieve all job listings that explicitly demand SQL skills.
-- Used in: SQL-specific job filtering widgets.

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
    s.name = 'SQL'
ORDER BY 
    j.salary DESC;
