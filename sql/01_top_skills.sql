-- Query 1: Top Demanded Skills
-- Purpose: Identify the most requested skills across all job postings.
-- Used in: Trending Skills dashboard widget.

SELECT 
    s.name AS skill_name,
    s.category AS skill_category,
    COUNT(js.job_id) AS job_demand_count
FROM 
    job_skills js
JOIN 
    skills s ON js.skill_id = s.id
GROUP BY 
    s.id, s.name, s.category
ORDER BY 
    job_demand_count DESC
LIMIT 25;
