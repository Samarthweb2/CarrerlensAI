# pyrefly: ignore [missing-import]
from fastapi import APIRouter, UploadFile, File, HTTPException, status
# pyrefly: ignore [missing-import]
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import os
import tempfile
import shutil
import logging
import uuid
from pathlib import Path

# Import existing functions from backend
from resume_parser import extract_text_from_pdf
from services.resume_analysis_service import analyze_resume, get_skills_flat
from matching_engine import save_candidate_profile, get_candidate_matches

# Set up logging
logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/resume",
    tags=["Resume Analysis"]
)

class CandidateProfileResponse(BaseModel):
    status: str
    message: str

@router.post("/parse", response_model=CandidateProfileResponse)
async def parse_resume(file: UploadFile = File(...)):
    """
    Placeholder endpoint to upload and parse a resume.
    """
    return {
        "status": "success",
        "message": f"Resume '{file.filename}' received. Parsing logic placeholder."
    }

# Pydantic schemas for the structured candidate profile response
class ContactInfo(BaseModel):
    first_name: str
    last_name: str
    full_name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    portfolio: Optional[str] = None

class SkillItem(BaseModel):
    name: str
    category: str

class EducationItem(BaseModel):
    degree: str
    level: Optional[str] = None
    institution: Optional[str] = None
    year: Optional[str] = None
    graduation_year: Optional[int] = None
    gpa: Optional[str] = None

class ExperienceItem(BaseModel):
    role: str
    company: Optional[str] = None
    duration: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    is_current: bool
    responsibilities: List[str] = []

class ProjectItem(BaseModel):
    name: str
    description: Optional[str] = None
    technologies: List[str] = []

class CertificationItem(BaseModel):
    name: str
    issuer: Optional[str] = None
    year: Optional[int] = None

class MetadataInfo(BaseModel):
    source_filename: str
    parsed_at: str
    raw_text_length: int
    sections_detected: List[str] = []

class ResumeAnalysisResponse(BaseModel):
    contact: ContactInfo
    summary: Optional[str] = None
    skills: List[SkillItem] = []
    education: List[EducationItem] = []
    experience: List[ExperienceItem] = []
    projects: List[ProjectItem] = []
    certifications: List[CertificationItem] = []
    metadata: MetadataInfo

class JobMatchItem(BaseModel):
    candidate_name: str
    job_title: str
    company_name: str
    salary: Optional[int] = None
    experience_level: Optional[str] = None
    location: Optional[str] = None
    matching_skills_count: int
    total_skills_required: int
    match_percentage: float

class AnalyzeResumeResponse(BaseModel):
    candidate_profile: ResumeAnalysisResponse
    job_matches: List[JobMatchItem] = []

@router.post("/analyze", response_model=AnalyzeResumeResponse)
async def analyze_resume_endpoint(file: UploadFile = File(...)):
    """
    Accepts a PDF resume upload, extracts text, analyzes it, saves the candidate profile and 
    skills to the database, queries matching job roles, and returns the profile combined with matches.
    """
    # 1. Accept a PDF resume upload using UploadFile.
    # Validate PDF content type / file extension
    filename = file.filename or "resume.pdf"
    if not filename.lower().endswith(".pdf"):
        logger.error(f"Upload failed: File '{filename}' is not a PDF.")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file format. Only PDF files are allowed."
        )

    # 2. Save the uploaded file temporarily.
    suffix = Path(filename).suffix or ".pdf"
    temp_path = None
    try:
        # Create a named temporary file that persists after closing
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
            shutil.copyfileobj(file.file, temp_file)
            temp_path = temp_file.name
        
        logger.info(f"Successfully uploaded and temporarily saved '{filename}' to '{temp_path}'.")
    except Exception as e:
        logger.error(f"Failed to save uploaded file '{filename}' temporarily: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save uploaded file temporarily."
        )

    # 3. Use the existing resume_parser.py to extract the resume content.
    # 4. Pass the parsed output to resume_analysis_service.py.
    # 7. Delete the temporary uploaded file after processing.
    try:
        raw_text = extract_text_from_pdf(temp_path)
        if not raw_text:
            logger.error(f"Text extraction failed or empty result for resume '{filename}'.")
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Could not extract text from the PDF resume. Make sure it contains readable text."
            )

        # Pass parsed output to resume_analysis_service.py
        profile = analyze_resume(raw_text, filename=filename)
        logger.info(f"Successfully parsed and analyzed resume '{filename}'.")

        # Extract contact and skills info for database matching integration
        contact = profile.get("contact", {})
        first_name = contact.get("first_name") or "Unknown"
        last_name = contact.get("last_name") or "Candidate"
        email = contact.get("email")
        phone = contact.get("phone")
        skills_flat = get_skills_flat(profile)

        # Generate a unique fallback email if none was parsed to satisfy SQLite's NOT NULL constraint
        if not email:
            email = f"unknown_{uuid.uuid4().hex[:10]}@email.com"
            logger.info(f"No email parsed from resume '{filename}'. Generated fallback: {email}")

        # Save profile to the SQLite database via matching_engine.py
        candidate_id = save_candidate_profile(
            first_name=first_name,
            last_name=last_name,
            email=email,
            phone=phone,
            resume_path=temp_path or filename,
            skills_list=skills_flat
        )

        if candidate_id is None:
            logger.error(f"Failed to save candidate profile for resume '{filename}' to database.")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to save candidate profile to matching database."
            )

        logger.info(f"Saved candidate profile (ID: {candidate_id}) to database. Retrieving matches...")

        # Retrieve candidate matches using the database matching engine
        job_matches = get_candidate_matches(candidate_id=candidate_id)
        logger.info(f"Retrieved {len(job_matches)} job matches for candidate ID {candidate_id}.")

        return {
            "candidate_profile": profile,
            "job_matches": job_matches
        }

    except HTTPException as he:
        # Pass HTTPExceptions straight through
        raise he
    except Exception as e:
        logger.error(f"Error during processing of resume '{filename}': {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while analyzing the resume: {str(e)}"
        )
    finally:
        # Cleanup the temporary file
        if temp_path and os.path.exists(temp_path):
            try:
                os.remove(temp_path)
                logger.info(f"Successfully deleted temporary file '{temp_path}'.")
            except Exception as cleanup_err:
                logger.warning(f"Failed to delete temporary file '{temp_path}': {str(cleanup_err)}")


