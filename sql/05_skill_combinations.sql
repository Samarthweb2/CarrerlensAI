-- Query 5: Most Common Skill Combinations
-- Purpose: Find pairs of skills that are most frequently requested together in the same job post.
-- Used in: Learning recommendations and path mapping.

SELECT 
    s1.name AS skill_a,
    s2.name AS skill_b,
    COUNT(js1.job_id) AS co_occurrence_count
FROM 
    job_skills js1
JOIN 
    job_skills js2 ON js1.job_id = js2.job_id AND js1.skill_id < js2.skill_id
JOIN 
    skills s1 ON js1.skill_id = s1.id
JOIN 
    skills s2 ON js2.skill_id = s2.id
GROUP BY 
    s1.name, s2.name
HAVING
    co_occurrence_count >= 5
ORDER BY 
    co_occurrence_count DESC, skill_a, skill_b
LIMIT 25;
