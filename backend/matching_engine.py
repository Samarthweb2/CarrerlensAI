import sqlite3
import os

# Base directory paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, 'database', 'careerlens.db')
SQL_DIR = os.path.join(BASE_DIR, 'sql')

def get_connection():
    """Returns a connection to the SQLite database with Foreign Keys enabled."""
    conn = sqlite3.connect(DB_PATH)
    conn.execute("PRAGMA foreign_keys = ON;")
    # Set row_factory to sqlite3.Row so we can access columns by name (like dictionaries)
    conn.row_factory = sqlite3.Row
    return conn

def execute_sql_file(filename, params=None):
    """Reads a SQL query from file and executes it, returning rows as dictionaries."""
    filepath = os.path.join(SQL_DIR, filename)
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"SQL file not found: {filepath}")
        
    with open(filepath, 'r', encoding='utf-8') as f:
        query = f.read()
        
    conn = get_connection()
    cursor = conn.cursor()
    try:
        if params:
            cursor.execute(query, params)
        else:
            cursor.execute(query)
        # Convert sqlite3.Row objects to standard Python dictionaries
        results = [dict(row) for row in cursor.fetchall()]
        return results
    except sqlite3.Error as e:
        print(f"Database error executing {filename}: {e}")
        return []
    finally:
        conn.close()

# --- ANALYTICS APIS ---

def get_top_skills():
    return execute_sql_file("01_top_skills.sql")

def get_average_salary():
    return execute_sql_file("02_average_salary.sql")

def get_top_companies():
    return execute_sql_file("03_top_companies.sql")

def get_top_cities():
    return execute_sql_file("04_top_cities.sql")

def get_skill_combinations():
    return execute_sql_file("05_skill_combinations.sql")

def get_jobs_by_sql():
    return execute_sql_file("06_jobs_by_sql.sql")

def get_jobs_by_python():
    return execute_sql_file("07_jobs_by_python.sql")

# --- MATCHING ENGINE APIS (Optimized for 10K+ jobs) ---

def get_candidate_matches(candidate_id=None, limit=50):
    """
    Gets job match percentages for a specific candidate.
    
    At 10K+ jobs, we can NOT do a full CROSS JOIN of all candidates × all jobs.
    Instead, we run a targeted query for the given candidate against jobs
    that share at least one skill.
    """
    if candidate_id is None:
        # Return empty if no candidate specified — full CROSS JOIN is too expensive
        return []
    
    conn = get_connection()
    cursor = conn.cursor()
    try:
        # Get candidate name
        c = cursor.execute(
            "SELECT first_name || ' ' || last_name AS name FROM candidates WHERE id = ?",
            (candidate_id,)
        ).fetchone()
        if not c:
            return []
        candidate_name = c['name']
        
        # Find jobs that share at least one skill with this candidate
        # and calculate match percentage — much faster than CROSS JOIN
        cursor.execute("""
            SELECT 
                ? AS candidate_name,
                j.title AS job_title,
                j.company AS company_name,
                j.salary,
                j.experience_level,
                j.location,
                COUNT(cs.skill_id) AS matching_skills_count,
                (SELECT COUNT(*) FROM job_skills WHERE job_id = j.id) AS total_skills_required,
                ROUND(
                    (CAST(COUNT(cs.skill_id) AS REAL) / 
                    (SELECT COUNT(*) FROM job_skills WHERE job_id = j.id)) * 100, 
                    2
                ) AS match_percentage
            FROM 
                jobs j
            JOIN 
                job_skills js ON j.id = js.job_id
            JOIN 
                candidate_skills cs ON cs.candidate_id = ? AND cs.skill_id = js.skill_id
            WHERE
                (SELECT COUNT(*) FROM job_skills WHERE job_id = j.id) > 0
            GROUP BY 
                j.id
            ORDER BY 
                match_percentage DESC
            LIMIT ?
        """, (candidate_name, candidate_id, limit))
        
        results = [dict(row) for row in cursor.fetchall()]
        return results
    except sqlite3.Error as e:
        print(f"Database error in get_candidate_matches: {e}")
        return []
    finally:
        conn.close()


def get_job_candidates(job_id, limit=50):
    """
    Gets candidates ranked by match percentage for a specific job.
    Optimized: only JOINs against candidates who share ≥1 skill.
    """
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT 
                c.first_name || ' ' || c.last_name AS candidate_name,
                c.id AS candidate_id,
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
            JOIN 
                candidate_skills cs ON c.id = cs.candidate_id
            JOIN 
                job_skills js ON js.job_id = ? AND js.skill_id = cs.skill_id
            JOIN 
                jobs j ON j.id = ?
            GROUP BY 
                c.id
            ORDER BY 
                match_percentage DESC
            LIMIT ?
        """, (job_id, job_id, limit))
        
        results = [dict(row) for row in cursor.fetchall()]
        return results
    except sqlite3.Error as e:
        print(f"Database error in get_job_candidates: {e}")
        return []
    finally:
        conn.close()


def get_skill_gaps(candidate_id=None, job_id=None):
    """Gets missing skills for a specific candidate-job pair (parameterized, no CROSS JOIN)."""
    if candidate_id is None or job_id is None:
        return []
    
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT 
                c.first_name || ' ' || c.last_name AS candidate_name,
                j.title AS job_title,
                j.company AS company_name,
                s.name AS missing_skill_name,
                js.importance AS skill_importance
            FROM 
                candidates c,
                jobs j
            JOIN 
                job_skills js ON j.id = js.job_id
            JOIN 
                skills s ON js.skill_id = s.id
            LEFT JOIN 
                candidate_skills cs ON c.id = cs.candidate_id AND cs.skill_id = js.skill_id
            WHERE 
                c.id = ? AND j.id = ?
                AND cs.skill_id IS NULL
            ORDER BY 
                js.importance DESC, s.name
        """, (candidate_id, job_id))
        
        results = [dict(row) for row in cursor.fetchall()]
        return results
    except sqlite3.Error as e:
        print(f"Database error in get_skill_gaps: {e}")
        return []
    finally:
        conn.close()


def get_learning_roadmap(candidate_id=None, job_id=None):
    """Gets step-by-step roadmaps for missing skills (parameterized, no CROSS JOIN)."""
    if candidate_id is None or job_id is None:
        return []
    
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT 
                c.first_name || ' ' || c.last_name AS candidate_name,
                j.title AS job_role,
                s.name AS missing_skill,
                sr.step_number,
                sr.topic AS learning_step,
                sr.description AS step_details
            FROM 
                candidates c,
                jobs j
            JOIN 
                job_skills js ON j.id = js.job_id
            JOIN 
                skills s ON js.skill_id = s.id
            LEFT JOIN 
                candidate_skills cs ON c.id = cs.candidate_id AND cs.skill_id = js.skill_id
            JOIN 
                skill_roadmaps sr ON s.id = sr.skill_id
            WHERE 
                c.id = ? AND j.id = ?
                AND cs.skill_id IS NULL
            ORDER BY 
                s.name, sr.step_number
        """, (candidate_id, job_id))
        
        results = [dict(row) for row in cursor.fetchall()]
        return results
    except sqlite3.Error as e:
        print(f"Database error in get_learning_roadmap: {e}")
        return []
    finally:
        conn.close()


# --- DATA WRITE APIS (To save parsed resumes) ---

def save_candidate_profile(first_name, last_name, email, phone, resume_path, skills_list):
    """
    Saves a parsed candidate resume profile and their extracted skills to the database.
    
    skills_list: List of skill names (strings), e.g. ['Python', 'SQL']
    Returns: The inserted candidate's ID
    """
    conn = get_connection()
    cursor = conn.cursor()
    try:
        # 1. Insert candidate or update if email already exists
        cursor.execute("""
            INSERT INTO candidates (first_name, last_name, email, phone, resume_path)
            VALUES (?, ?, ?, ?, ?)
            ON CONFLICT(email) DO UPDATE SET
                first_name=excluded.first_name,
                last_name=excluded.last_name,
                phone=excluded.phone,
                resume_path=excluded.resume_path,
                updated_at=CURRENT_TIMESTAMP
        """, (first_name, last_name, email, phone, resume_path))
        
        # Get the ID of the candidate (either inserted or updated)
        cursor.execute("SELECT id FROM candidates WHERE email = ?", (email,))
        candidate_id = cursor.fetchone()['id']
        
        # 2. Clear old skills for this candidate (so we don't duplicate when re-uploading)
        cursor.execute("DELETE FROM candidate_skills WHERE candidate_id = ?", (candidate_id,))
        
        # 3. Add skills
        for skill_name in skills_list:
            # Check if skill exists in master list, insert if not
            cursor.execute("SELECT id FROM skills WHERE LOWER(name) = LOWER(?)", (skill_name.strip(),))
            skill_row = cursor.fetchone()
            
            if skill_row:
                skill_id = skill_row['id']
            else:
                # Skill doesn't exist, add it to master skills library
                cursor.execute("INSERT INTO skills (name, category) VALUES (?, 'Technical')", (skill_name.strip(),))
                skill_id = cursor.lastrowid
            
            # Map skill to candidate (default to Intermediate proficiency for parsed skills)
            cursor.execute("""
                INSERT INTO candidate_skills (candidate_id, skill_id, proficiency)
                VALUES (?, ?, 'Intermediate')
            """, (candidate_id, skill_id))
            
        conn.commit()
        return candidate_id
        
    except sqlite3.Error as e:
        conn.rollback()
        print(f"Error saving candidate profile: {e}")
        return None
    finally:
        conn.close()
