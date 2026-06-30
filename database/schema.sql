-- Enable Foreign Key Support in SQLite (must be executed for each connection)
PRAGMA foreign_keys = ON;

-- Drop existing tables to allow schema recreation (order matters due to foreign key constraints)
DROP TABLE IF EXISTS skill_roadmaps;
DROP TABLE IF EXISTS job_skills;
DROP TABLE IF EXISTS candidate_skills;
DROP TABLE IF EXISTS jobs;
DROP TABLE IF EXISTS skills;
DROP TABLE IF EXISTS candidates;

-- ====================================================================
-- 1. CANDIDATES TABLE
-- ====================================================================
-- Stores profile information for job seekers or students.
CREATE TABLE IF NOT EXISTS candidates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    resume_path TEXT, -- Path to the stored PDF/Word resume file
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- 2. SKILLS TABLE
-- ====================================================================
-- A master list of all skills (e.g., Python, SQL, Public Speaking).
CREATE TABLE IF NOT EXISTS skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    category TEXT -- e.g., 'Programming', 'Data Analysis', 'Soft Skill'
);

-- ====================================================================
-- 3. JOBS TABLE
-- ====================================================================
-- Stores job postings or job descriptions to match candidates against.
CREATE TABLE IF NOT EXISTS jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT,
    description TEXT,
    salary INTEGER, -- Annual salary in USD (median if range provided)
    experience_level TEXT, -- e.g., 'Entry level', 'Mid-Senior level', 'Director', 'Executive', 'Internship', 'Associate'
    work_type TEXT, -- e.g., 'Full-time', 'Part-time', 'Contract', 'Temporary', 'Internship'
    posted_date TEXT DEFAULT CURRENT_TIMESTAMP,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);


-- ====================================================================
-- 4. CANDIDATE_SKILLS TABLE (Junction Table)
-- ====================================================================
-- Maps candidates to their skills (Many-to-Many relationship).
CREATE TABLE IF NOT EXISTS candidate_skills (
    candidate_id INTEGER NOT NULL,
    skill_id INTEGER NOT NULL,
    proficiency TEXT CHECK(proficiency IN ('Beginner', 'Intermediate', 'Advanced', 'Expert')),
    PRIMARY KEY (candidate_id, skill_id),
    FOREIGN KEY (candidate_id) REFERENCES candidates (id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills (id) ON DELETE CASCADE
);

-- ====================================================================
-- 5. JOB_SKILLS TABLE (Junction Table)
-- ====================================================================
-- Maps jobs to their required skills (Many-to-Many relationship).
CREATE TABLE IF NOT EXISTS job_skills (
    job_id INTEGER NOT NULL,
    skill_id INTEGER NOT NULL,
    importance TEXT CHECK(importance IN ('Required', 'Preferred')),
    PRIMARY KEY (job_id, skill_id),
    FOREIGN KEY (job_id) REFERENCES jobs (id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills (id) ON DELETE CASCADE
);

-- ====================================================================
-- 6. SKILL_ROADMAPS TABLE
-- ====================================================================
-- Stores learning roadmap steps for different skills.
CREATE TABLE IF NOT EXISTS skill_roadmaps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    skill_id INTEGER NOT NULL,
    step_number INTEGER NOT NULL,
    topic TEXT NOT NULL,
    description TEXT,
    FOREIGN KEY (skill_id) REFERENCES skills (id) ON DELETE CASCADE
);

-- ====================================================================
-- INDEXES FOR PERFORMANCE OPTIMIZATION
-- ====================================================================
-- Indexes speed up database queries on columns that are frequently used in WHERE, JOIN, or ORDER BY clauses.
CREATE INDEX IF NOT EXISTS idx_candidates_email ON candidates(email);
CREATE INDEX IF NOT EXISTS idx_skills_name ON skills(name);
CREATE INDEX IF NOT EXISTS idx_jobs_company ON jobs(company);
CREATE INDEX IF NOT EXISTS idx_jobs_experience ON jobs(experience_level);
CREATE INDEX IF NOT EXISTS idx_jobs_work_type ON jobs(work_type);
CREATE INDEX IF NOT EXISTS idx_jobs_title ON jobs(title);
CREATE INDEX IF NOT EXISTS idx_job_skills_job ON job_skills(job_id);
CREATE INDEX IF NOT EXISTS idx_job_skills_skill ON job_skills(skill_id);

-- ====================================================================
-- TRIGGERS TO AUTOMATICALLY UPDATE timestamps
-- ====================================================================
-- These triggers automatically update the 'updated_at' column whenever a candidate or job record is modified.
CREATE TRIGGER IF NOT EXISTS update_candidate_timestamp 
AFTER UPDATE ON candidates
BEGIN
    UPDATE candidates SET updated_at = CURRENT_TIMESTAMP WHERE id = old.id;
END;

CREATE TRIGGER IF NOT EXISTS update_job_timestamp 
AFTER UPDATE ON jobs
BEGIN
    UPDATE jobs SET updated_at = CURRENT_TIMESTAMP WHERE id = old.id;
END;
