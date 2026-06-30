# pyrefly: ignore [missing-import]
import pdfplumber
import os
import re


def extract_text_from_pdf(pdf_file_path_or_obj):
    """
    Extracts all readable text from a PDF file.
    
    Args:
        pdf_file_path_or_obj: Can be a file path string (e.g., 'resume.pdf') or 
                              a file-like byte object (e.g., Streamlit's uploaded file).
        
    Returns:
        str: The extracted text from the PDF, or None if an error occurs.
    """
    extracted_text = ""
    try:
        # Open the PDF using pdfplumber
        with pdfplumber.open(pdf_file_path_or_obj) as pdf:
            # Loop through every page in the PDF document
            for page_num, page in enumerate(pdf.pages, start=1):
                # Extract text while preserving simple layouts/columns
                page_text = page.extract_text()
                
                if page_text:
                    extracted_text += f"--- Page {page_num} ---\n"
                    extracted_text += page_text + "\n\n"
                    
        return extracted_text.strip()
        
    except Exception as e:
        print(f"Error during PDF extraction: {e}")
        return None


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
    # Import here to avoid circular imports at module level
    from matching_engine import get_connection

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
