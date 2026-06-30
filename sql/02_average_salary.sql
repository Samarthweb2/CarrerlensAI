-- Query 2: Average Salary by Role
-- Purpose: Calculate average salaries for each unique job title.
-- Used in: Salary Insights dashboard widget.
-- Note: Filters out NULL salaries and requires ≥3 postings for statistical reliability.

SELECT 
    title AS job_role,
    ROUND(AVG(salary), 2) AS average_salary_usd,
    COUNT(id) AS job_postings_count,
    MIN(salary) AS min_salary,
    MAX(salary) AS max_salary
FROM 
    jobs
WHERE 
    salary IS NOT NULL AND salary > 0
GROUP BY 
    title
HAVING 
    COUNT(id) >= 3
ORDER BY 
    average_salary_usd DESC
LIMIT 20;
