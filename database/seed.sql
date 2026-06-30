-- Start a transaction to ensure all inserts succeed or fail together
BEGIN TRANSACTION;

-- Clear any existing data in the tables (optional but useful for fresh seeds)
DELETE FROM skill_roadmaps;
DELETE FROM job_skills;
DELETE FROM candidate_skills;
DELETE FROM jobs;
DELETE FROM skills;
DELETE FROM candidates;

-- Reset SQLite autoincrement counters
DELETE FROM sqlite_sequence WHERE name IN ('candidates', 'skills', 'jobs', 'skill_roadmaps');

-- ====================================================================
-- 1. INSERT SKILLS (Master list — ETL will dynamically add more)
-- ====================================================================
INSERT INTO skills (id, name, category) VALUES
(1, 'Python', 'Programming'),
(2, 'SQL', 'Database Management'),
(3, 'Tableau', 'Data Visualization'),
(4, 'Power BI', 'Data Visualization'),
(5, 'Machine Learning', 'AI & ML'),
(6, 'Excel', 'Data Analysis'),
(7, 'Communication', 'Soft Skill'),
(8, 'Problem Solving', 'Soft Skill'),
(9, 'R', 'Programming'),
(10, 'Git', 'Version Control');

-- ====================================================================
-- 2. INSERT CANDIDATES
-- ====================================================================
INSERT INTO candidates (id, first_name, last_name, email, phone, resume_path) VALUES
(1, 'Alice', 'Chen', 'alice.chen@email.com', '123-456-7890', '/resumes/alice_chen_resume.pdf'),
(2, 'Bob', 'Patel', 'bob.patel@email.com', '234-567-8901', '/resumes/bob_patel_resume.pdf'),
(3, 'Charlie', 'Ross', 'charlie.ross@email.com', '345-678-9012', '/resumes/charlie_ross_resume.pdf');

-- ====================================================================
-- 3. JOBS — No longer seeded here.
-- Jobs and job_skills are loaded from real datasets via the ETL pipeline.
-- Run: python backend/etl_pipeline.py
-- ====================================================================

-- ====================================================================
-- 4. INSERT CANDIDATE_SKILLS (Mapping Candidates to their Skills)
-- ====================================================================
-- Alice Chen's Skills (Python: Expert, SQL: Advanced, Git: Intermediate, Machine Learning: Advanced)
INSERT INTO candidate_skills (candidate_id, skill_id, proficiency) VALUES
(1, 1, 'Expert'),
(1, 2, 'Advanced'),
(1, 10, 'Intermediate'),
(1, 5, 'Advanced');

-- Bob Patel's Skills (SQL: Advanced, Tableau: Advanced, Power BI: Intermediate, Excel: Expert, Communication: Advanced)
INSERT INTO candidate_skills (candidate_id, skill_id, proficiency) VALUES
(2, 2, 'Advanced'),
(2, 3, 'Advanced'),
(2, 4, 'Intermediate'),
(2, 6, 'Expert'),
(2, 7, 'Advanced');

-- Charlie Ross's Skills (R: Advanced, Python: Intermediate, SQL: Intermediate, Problem Solving: Expert)
INSERT INTO candidate_skills (candidate_id, skill_id, proficiency) VALUES
(3, 9, 'Advanced'),
(3, 1, 'Intermediate'),
(3, 2, 'Intermediate'),
(3, 8, 'Expert');

-- ====================================================================
-- 5. INSERT SKILL ROADMAPS
-- ====================================================================
-- Seeding roadmap steps for key skills: Python (1), SQL (2), Power BI (4), Machine Learning (5), Excel (6)
INSERT INTO skill_roadmaps (skill_id, step_number, topic, description) VALUES
-- Python (Skill ID: 1)
(1, 1, 'Learn Python Basics', 'Variables, data types, loops, conditionals, and functions.'),
(1, 2, 'Data Structures in Python', 'Master lists, dictionaries, tuples, and sets.'),
(1, 3, 'Pandas & NumPy for Data Analytics', 'Data manipulation, filtering, aggregation, and handling missing data.'),
(1, 4, 'Build a Data Cleaning Project', 'Clean a dirty CSV dataset and export clean data.'),

-- SQL (Skill ID: 2)
(2, 1, 'Learn Basic SQL Queries', 'SELECT, WHERE, ORDER BY, and basic filtering.'),
(2, 2, 'Aggregate Functions & Grouping', 'COUNT, SUM, AVG, MIN, MAX and GROUP BY, HAVING clauses.'),
(2, 3, 'SQL Joins & Subqueries', 'INNER JOIN, LEFT/RIGHT JOIN, and nesting queries.'),
(2, 4, 'Solve Practice Problems', 'Solve SQL challenges on LeetCode, HackerRank, or StrataScratch.'),

-- Power BI (Skill ID: 4)
(4, 1, 'Get Started with Power Query', 'Connect to data sources, transform, clean and shape data.'),
(4, 2, 'Data Modeling in Power BI', 'Establish relationships, understand star schemas and active vs inactive relationships.'),
(4, 3, 'Learn DAX (Data Analysis Expressions)', 'Write measures and calculated columns (CALCULATE, RELATED, DIVIDE).'),
(4, 4, 'Build an Interactive Dashboard', 'Create charts, maps, KPIs, and publish reports.'),

-- Machine Learning (Skill ID: 5)
(5, 1, 'Data Preprocessing', 'Feature scaling, encoding categorical variables, train-test split.'),
(5, 2, 'Supervised Learning Algorithms', 'Linear regression, decision trees, random forests, and SVM.'),
(5, 3, 'Model Evaluation', 'Accuracy, precision, recall, F1-score, and ROC-AUC curves.'),
(5, 4, 'End-to-End ML Pipeline Project', 'Train a classification model and deploy it as a simple API.'),

-- Excel (Skill ID: 6)
(6, 1, 'Excel Formulas & Shortcuts', 'VLOOKUP, INDEX-MATCH, XLOOKUP, IF, SUMIFS, and shortcuts.'),
(6, 2, 'Pivot Tables & Charts', 'Summarize large datasets, group values, and create dashboards.'),
(6, 3, 'Data Cleaning in Excel', 'Remove duplicates, split columns, and use Flash Fill.'),
(6, 4, 'Case Study Dashboard', 'Build a sales report or financial budget tool.');

-- Commit the transaction if everything succeeded
COMMIT;
