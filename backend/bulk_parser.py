import os
import re
import glob
import subprocess
import sys

# Base directory paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RESUMES_DIR = os.path.join(BASE_DIR, 'data', 'resumes')

# Import core modules
from resume_parser import extract_text_from_pdf
from matching_engine import save_candidate_profile, get_connection

def install_and_import_reportlab():
    """Dynamically installs reportlab if not available, to generate sample PDFs."""
    try:
        from reportlab.lib.pagesizes import letter
        from reportlab.pdfgen import canvas
    except ImportError:
        print("Installing reportlab to generate sample PDFs...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "reportlab"])
        
def create_sample_pdf_resumes():
    """Generates 3 realistic PDF resumes in data/resumes for the parser to read."""
    install_and_import_reportlab()
    from reportlab.lib.pagesizes import letter
    from reportlab.pdfgen import canvas
    
    os.makedirs(RESUMES_DIR, exist_ok=True)
    
    candidates = [
        {
            "filename": "Alice_Chen_Resume.pdf",
            "name": "Alice Chen",
            "email": "alice.chen@email.com",
            "phone": "123-456-7890",
            "lines": [
                "Alice Chen - Senior Data Scientist",
                "Email: alice.chen@email.com | Phone: 123-456-7890",
                "Summary: High-performing Data Scientist with experience in Machine Learning.",
                "Technical Skills: Python, SQL, Machine Learning, Git, R, Pandas, NumPy.",
                "Education: MS in Computer Science.",
                "Experience: Tech lead at AI Systems writing ML algorithms and database queries."
            ]
        },
        {
            "filename": "Bob_Patel_Resume.pdf",
            "name": "Bob Patel",
            "email": "bob.patel@email.com",
            "phone": "234-567-8901",
            "lines": [
                "Bob Patel - BI Analyst",
                "Email: bob.patel@email.com | Phone: 234-567-8901",
                "Summary: Specialized in reporting, interactive dashboards, and business insights.",
                "Technical Skills: SQL, Tableau, Power BI, Excel, Communication, databases.",
                "Education: BS in Business Analytics.",
                "Experience: BI developer building retail reports and business logic dashboards."
            ]
        },
        {
            "filename": "Charlie_Ross_Resume.pdf",
            "name": "Charlie Ross",
            "email": "charlie.ross@email.com",
            "phone": "345-678-9012",
            "lines": [
                "Charlie Ross - Analyst",
                "Email: charlie.ross@email.com | Phone: 345-678-9012",
                "Summary: Analytical problem solver with statistical background.",
                "Technical Skills: R, Python, SQL, Problem Solving, Git, analytical models.",
                "Education: BS in Statistics.",
                "Experience: Research analyst running R scripts and solving mathematical puzzles."
            ]
        }
    ]
    
    for c_data in candidates:
        filepath = os.path.join(RESUMES_DIR, c_data['filename'])
        if os.path.exists(filepath):
            continue
            
        c = canvas.Canvas(filepath, pagesize=letter)
        width, height = letter
        
        # Simple vertical page writer
        y = height - 50
        c.setFont("Helvetica-Bold", 16)
        c.drawString(50, y, c_data['name'])
        c.setFont("Helvetica", 10)
        
        for line in c_data['lines'][1:]:
            y -= 25
            c.drawString(50, y, line)
            
        c.save()
        print(f"Generated sample resume PDF: {filepath}")

def extract_contact_info(text, filename=""):
    """Extracts email, phone, and name from the resume text using regex heuristics."""
    # Find email
    email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', text)
    email = email_match.group(0) if email_match else "unknown@email.com"
    
    # Find phone
    phone_match = re.search(r'(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', text)
    phone = phone_match.group(0) if phone_match else "000-000-0000"
    
    # Heuristics for Name: use first non-empty line
    lines = [line.strip() for line in text.split('\n') if line.strip() and "page" not in line.lower()]
    name = "Unknown Candidate"
    if lines:
        first_line = lines[0]
        # Clean up tags or contact details if they leaked onto first line
        first_line = re.sub(r'(email|phone|resume|curriculum|cv|summary).*$', '', first_line, flags=re.IGNORECASE)
        name = first_line.strip()
        
    # Final name fallback from filename (e.g. Alice_Chen_Resume -> Alice Chen)
    if not name or len(name) < 3:
        basename = os.path.splitext(os.path.basename(filename))[0]
        name = basename.replace('_Resume', '').replace('_', ' ').replace('-', ' ').title()
        
    # Split into first and last name
    parts = name.split()
    first_name = parts[0] if parts else "Unknown"
    last_name = " ".join(parts[1:]) if len(parts) > 1 else "Candidate"
    
    return first_name, last_name, email, phone

def extract_skills_from_text(text):
    """Matches text against the master skills list in SQLite."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM skills")
    master_skills = [row['name'] for row in cursor.fetchall()]
    conn.close()
    
    extracted = []
    text_lower = text.lower()
    for skill in master_skills:
        # Check for word boundaries
        pattern = r'\b' + re.escape(skill.lower()) + r'\b'
        if re.search(pattern, text_lower):
            extracted.append(skill)
            
    return extracted

def run_bulk_parser():
    """Scans data/resumes, parses PDFs, and saves to database."""
    print("--- Starting CareerLensAI Bulk Resume Parser ---")
    
    # If no resumes folder or empty, build sample resumes
    if not os.path.exists(RESUMES_DIR) or not os.listdir(RESUMES_DIR):
        create_sample_pdf_resumes()
        
    # Scan for PDF resumes
    pdf_resumes = glob.glob(os.path.join(RESUMES_DIR, "*.pdf"))
    if not pdf_resumes:
        print("No PDF resumes found to parse.")
        return
        
    success_count = 0
    for filepath in pdf_resumes:
        print(f"Parsing: {os.path.basename(filepath)}...")
        text = extract_text_from_pdf(filepath)
        
        if text:
            first_name, last_name, email, phone = extract_contact_info(text, filepath)
            skills = extract_skills_from_text(text)
            
            # Save to SQLite via matching_engine
            candidate_id = save_candidate_profile(
                first_name=first_name,
                last_name=last_name,
                email=email,
                phone=phone,
                resume_path=filepath,
                skills_list=skills
            )
            if candidate_id:
                print(f"Successfully processed {first_name} {last_name} (ID: {candidate_id}). Extracted Skills: {skills}")
                success_count += 1
            else:
                print(f"Failed to save profile for {first_name} {last_name} in database.")
        else:
            print(f"Failed to read text from {os.path.basename(filepath)}.")
            
    print(f"--- Bulk Resume Parser Completed. Successfully processed {success_count}/{len(pdf_resumes)} resumes. ---")

if __name__ == '__main__':
    run_bulk_parser()

