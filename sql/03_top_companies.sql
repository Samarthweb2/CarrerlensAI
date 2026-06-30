-- Query 3: Top Hiring Companies
-- Purpose: Rank companies based on the volume of jobs posted and the average salary offered.
-- Used in: Top Hiring Companies dashboard widget.

SELECT 
    company,
    COUNT(id) AS jobs_posted,
    ROUND(AVG(CASE WHEN salary IS NOT NULL AND salary > 0 THEN salary END), 2) AS average_offered_salary
FROM 
    jobs
WHERE
    company IS NOT NULL AND company != '' AND company != 'Unknown'
GROUP BY 
    company
ORDER BY 
    jobs_posted DESC, average_offered_salary DESC
LIMIT 25;
