-- Query 4: Top Hiring Cities / Locations
-- Purpose: Identify which geographical locations offer the most job postings.
-- Used in: Job Location Heatmaps or City Dashboard.

SELECT 
    location AS city_or_region,
    COUNT(id) AS jobs_posted,
    ROUND(AVG(CASE WHEN salary IS NOT NULL AND salary > 0 THEN salary END), 2) AS average_salary
FROM 
    jobs
WHERE 
    location IS NOT NULL AND location != '' AND location != 'Not Specified'
GROUP BY 
    location
ORDER BY 
    jobs_posted DESC
LIMIT 25;
