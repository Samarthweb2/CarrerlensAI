import os
import re
from typing import Optional, List, Dict, Any
# pyrefly: ignore [missing-import]
import fitz  # PyMuPDF
# pyrefly: ignore [missing-import]
import docx

def extract_text_from_pdf(pdf_path: str) -> str:
    """
    Extracts plain text from a PDF file using PyMuPDF (fitz).
    """
    text = ""
    try:
        doc = fitz.open(pdf_path)
        for page in doc:
            page_text = page.get_text()
            if page_text:
                text += page_text + "\n"
        doc.close()
    except Exception as e:
        print(f"Error extracting text from PDF {pdf_path}: {e}")
    return text.strip()

def extract_text_from_docx(docx_path: str) -> str:
    """
    Extracts plain text from a DOCX file using python-docx.
    """
    text_list = []
    try:
        doc = docx.Document(docx_path)
        for para in doc.paragraphs:
            if para.text.strip():
                text_list.append(para.text.strip())
        # Also extract table cells if any exist
        for table in doc.tables:
            for row in table.rows:
                row_text = [cell.text.strip() for cell in row.cells if cell.text.strip()]
                if row_text:
                    text_list.append(" | ".join(row_text))
    except Exception as e:
        print(f"Error extracting text from DOCX {docx_path}: {e}")
    return "\n".join(text_list).strip()

def extract_text(file_path: str) -> str:
    """
    Extracts plain text from either a PDF or DOCX file.
    """
    ext = os.path.splitext(file_path)[1].lower()
    if ext == ".pdf":
        return extract_text_from_pdf(file_path)
    elif ext in (".docx", ".doc"):
        return extract_text_from_docx(file_path)
    return ""

def extract_email(text: str) -> Optional[str]:
    """
    Extracts email address from text using regex.
    """
    email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', text)
    return email_match.group(0) if email_match else None

def extract_phone(text: str) -> Optional[str]:
    """
    Extracts phone number from text using regex.
    """
    phone_match = re.search(r'(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', text)
    return phone_match.group(0) if phone_match else None

def extract_links(text: str) -> Dict[str, Optional[str]]:
    """
    Extracts GitHub and LinkedIn handles from text.
    """
    github_match = re.search(r'(github\.com/[\w\.-]+)', text, re.IGNORECASE)
    linkedin_match = re.search(r'(linkedin\.com/in/[\w\.-]+)', text, re.IGNORECASE)
    
    return {
        "github": github_match.group(0) if github_match else None,
        "linkedin": linkedin_match.group(0) if linkedin_match else None
    }

def extract_skills_keywords(text: str) -> List[str]:
    """
    Matches text against a list of standard tech skills.
    """
    common_skills = [
        "python", "sql", "power bi", "react", "fastapi", "machine learning", 
        "pandas", "numpy", "docker", "aws", "kubernetes", "ci/cd", "javascript",
        "html", "css", "git", "java", "c++", "tableau", "excel", "spark", "hadoop",
        "nlp", "deep learning", "pytorch", "tensorflow", "agile", "scrum"
    ]
    
    extracted = []
    text_lower = text.lower()
    for skill in common_skills:
        pattern = r'\b' + re.escape(skill) + r'\b'
        if re.search(pattern, text_lower):
            # Format back to nice casing
            title_case_mapping = {
                "python": "Python", "sql": "SQL", "power bi": "Power BI", "react": "React",
                "fastapi": "FastAPI", "machine learning": "Machine Learning", "pandas": "Pandas",
                "numpy": "NumPy", "docker": "Docker", "aws": "AWS", "kubernetes": "Kubernetes",
                "ci/cd": "CI/CD", "javascript": "JavaScript", "html": "HTML", "css": "CSS",
                "git": "Git", "java": "Java", "c++": "C++", "tableau": "Tableau", "excel": "Excel",
                "spark": "Spark", "hadoop": "Hadoop", "nlp": "NLP", "deep learning": "Deep Learning",
                "pytorch": "PyTorch", "tensorflow": "TensorFlow", "agile": "Agile", "scrum": "Scrum"
            }
            extracted.append(title_case_mapping.get(skill, skill.title()))
            
    return list(set(extracted))

def extract_section_content(text: str, section_name: str) -> List[str]:
    """
    Heuristically extracts lines located under specific section headers.
    """
    lines = text.split('\n')
    section_headers = {
        "education": ["education", "academic background", "studies", "qualification", "qualifications", "academic credentials"],
        "experience": ["experience", "employment history", "work experience", "professional experience", "internships", "employment"],
        "projects": ["projects", "personal projects", "academic projects", "key projects", "development projects"],
        "skills": ["skills", "technical skills", "key skills", "technologies", "expertise", "competencies"],
        "certifications": ["certifications", "licenses", "courses", "credentials"]
    }
    
    targets = section_headers.get(section_name.lower(), [])
    if not targets:
        return []
        
    start_idx = -1
    for i, line in enumerate(lines):
        clean_line = line.strip().lower().rstrip(':')
        if clean_line in targets or any(clean_line == t for t in targets):
            start_idx = i
            break
            
    if start_idx == -1:
        # Fuzzy match
        for i, line in enumerate(lines):
            clean_line = line.strip().lower().rstrip(':')
            if any(t in clean_line for t in targets) and len(clean_line.split()) <= 3:
                start_idx = i
                break
                
    if start_idx == -1:
        return []
        
    content_lines = []
    all_headers = []
    for h_list in section_headers.values():
        all_headers.extend(h_list)
        
    for line in lines[start_idx + 1:]:
        clean_line = line.strip().lower().rstrip(':')
        if any(clean_line == h for h in all_headers) or (any(h in clean_line for h in all_headers) and len(clean_line.split()) <= 3):
            break
        if line.strip():
            content_lines.append(line.strip())
            
    return content_lines

def parse_resume_to_json(file_path: str, filename: str) -> Dict[str, Any]:
    """
    Main parser coordinator. Extracts text and segments it into structured JSON fields.
    """
    raw_text = extract_text(file_path)
    
    email = extract_email(raw_text)
    phone = extract_phone(raw_text)
    links = extract_links(raw_text)
    
    education = extract_section_content(raw_text, "education")
    experience = extract_section_content(raw_text, "experience")
    projects = extract_section_content(raw_text, "projects")
    skills = extract_skills_keywords(raw_text)
    certifications = extract_section_content(raw_text, "certifications")
    
    return {
        "fileId": str(os.path.basename(file_path).split('_')[0]),
        "fileName": filename,
        "text": raw_text,
        "education": education,
        "experience": experience,
        "projects": projects,
        "skills": skills,
        "certifications": certifications,
        "links": links
    }
