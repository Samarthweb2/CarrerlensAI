import os
import uuid
import logging
from fastapi import APIRouter, UploadFile, File, HTTPException, status, Depends, Form
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from pathlib import Path

# DB imports
from database.database import get_db
from database.models import User, Resume, Analysis
from api.middleware.auth import get_current_user

# Parser & service imports
from resume_parser import parse_resume_to_json, extract_text
from services.ai_service import analyze_resume_text, compare_resumes
from services.resume_service import save_uploaded_file, UPLOAD_DIR
from schemas.resume import ResumeUploadResponse, LinksSchema
from pydantic import BaseModel

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/resume",
    tags=["Resume Analysis"]
)

@router.post("/upload", response_model=ResumeUploadResponse)
async def upload_resume(
    file: UploadFile = File(...),
    job_description: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Accepts a resume document upload (PDF/DOCX <= 5MB), saves it locally with a UUID prefix,
    extracts plain text and sections, triggers a dynamic AI scoring, saves Resume/Analysis to the
    database, and yields parsing structured JSON.
    """
    # 1. Validation size check: 5MB
    max_size = 5 * 1024 * 1024
    # Read file size by seeking
    file.file.seek(0, os.SEEK_END)
    file_size = file.file.tell()
    file.file.seek(0) # reset pointer
    
    if file_size > max_size:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Oops! This file is too large. Please upload a resume under 5 MB."
        )

    # 2. File suffix validation check
    filename = file.filename or "resume.pdf"
    file_ext = os.path.splitext(filename)[1].lower()
    if file_ext not in {".pdf", ".docx", ".doc"}:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Oops! Looks like this isn't a resume. Please upload a PDF or DOCX file."
        )

    # 3. Store unique filename with UUID prefix to prevent collisions
    try:
        unique_filename = f"{uuid.uuid4()}_{filename}"
        file_path = os.path.join(UPLOAD_DIR, unique_filename)
        
        try:
            with open(file_path, "wb") as buffer:
                buffer.write(file.file.read())
        except Exception as e:
            logger.error(f"Failed to save upload locally: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to save uploaded file on server."
            )

        # 4. Save Resume record in database
        db_resume = Resume(
            user_id=current_user.id,
            filename=filename,
            filepath=file_path
        )
        db.add(db_resume)
        db.commit()
        db.refresh(db_resume)

        # 5. Extract text and parse section chunks
        try:
            parsed_data = parse_resume_to_json(file_path, filename)
        except Exception as e:
            logger.error(f"Parsing failed for {filename}: {e}")
            # Cleanup
            if os.path.exists(file_path):
                os.remove(file_path)
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Failed to extract text or parse the uploaded resume document structure."
            )

        # 6. Perform dynamic scoring and recommendations via AI analyzer
        try:
            analysis_data = analyze_resume_text(parsed_data, job_description, db)
        except Exception as e:
            logger.error(f"AI analysis calculation failed: {e}")
            # Cleanup
            if os.path.exists(file_path):
                os.remove(file_path)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to process resume analysis calculations."
            )

        # 7. Save Analysis record in database
        db_analysis = Analysis(
            resume_id=db_resume.id,
            user_id=current_user.id,
            ats_score=analysis_data["atsScore"],
            resume_score=analysis_data["resumeScore"],
            formatting=analysis_data["formatting"],
            grammar=analysis_data["grammar"],
            keywords=analysis_data["keywords"],
            skills_found=analysis_data["skillsFound"],
            missing_skills=analysis_data["missingSkills"],
            suggestions=analysis_data["suggestions"],
            section_scores=analysis_data["sectionScores"],
            keyword_match=analysis_data["keywordMatch"],
            roadmap=analysis_data["roadmap"],
            job_matches=analysis_data["jobMatches"],
            job_description=job_description,
            improvements=analysis_data.get("improvements", []),
            interview_questions=analysis_data.get("interviewQuestions", [])
        )
        
        db.add(db_analysis)
        db.commit()
        db.refresh(db_analysis)
    except Exception as outer_err:
        import traceback
        print("=" * 60)
        print("UPLOAD ENDPOINT EXCEPTION DETECTED")
        traceback.print_exc()
        print("=" * 60)
        raise outer_err

    # 8. Return response
    links_payload = parsed_data.get("links", {})
    return {
        "fileId": db_resume.id,
        "fileName": filename,
        "text": parsed_data["text"],
        "education": parsed_data["education"],
        "experience": parsed_data["experience"],
        "projects": parsed_data["projects"],
        "skills": parsed_data["skills"],
        "certifications": parsed_data["certifications"],
        "links": LinksSchema(
            github=links_payload.get("github"),
            linkedin=links_payload.get("linkedin")
        ),
        "analysisId": db_analysis.id
    }

@router.get("/{id}")
async def get_resume(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Fetches file details for a saved resume.
    """
    resume = db.query(Resume).filter(Resume.id == id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume file record not found."
        )
    return {
        "id": resume.id,
        "filename": resume.filename,
        "uploaded_at": resume.uploaded_at
    }

@router.delete("/{id}", status_code=status.HTTP_200_OK)
async def delete_resume(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Deletes the saved resume document, the associated database record, and cascade deletes the analyses.
    """
    resume = db.query(Resume).filter(Resume.id == id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume file record not found."
        )
        
    # Delete file from local uploads directory
    if os.path.exists(resume.filepath):
        try:
            os.remove(resume.filepath)
        except Exception as e:
            logger.warning(f"Could not remove local file {resume.filepath}: {e}")

    db.delete(resume)
    db.commit()
    return {"status": "success", "message": "Resume document deleted successfully."}

class CompareRequest(BaseModel):
    resumeId1: int
    resumeId2: int

@router.get("", response_model=List[Dict[str, Any]])
async def list_resumes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Lists all resumes uploaded by the current user with basic analysis scores.
    """
    resumes = db.query(Resume).filter(Resume.user_id == current_user.id).all()
    results = []
    for r in resumes:
        analysis = db.query(Analysis).filter(Analysis.resume_id == r.id).first()
        results.append({
            "id": r.id,
            "filename": r.filename,
            "uploaded_at": r.uploaded_at.strftime("%B %d, %Y") if r.uploaded_at else "Unknown",
            "analysisId": analysis.id if analysis else None,
            "atsScore": analysis.ats_score if analysis else None
        })
    return results

@router.post("/compare")
async def compare_resumes_api(
    payload: CompareRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Compares two resumes of the user to highlight changes, improved skills, and ATS differences.
    """
    res1 = db.query(Resume).filter(Resume.id == payload.resumeId1, Resume.user_id == current_user.id).first()
    res2 = db.query(Resume).filter(Resume.id == payload.resumeId2, Resume.user_id == current_user.id).first()
    
    if not res1 or not res2:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="One or both of the specified resumes could not be found."
        )
        
    try:
        text1 = extract_text(res1.filepath)
        text2 = extract_text(res2.filepath)
        
        comparison = compare_resumes(text1, text2, res1.filename, res2.filename)
        return comparison
    except Exception as e:
        logger.error(f"Error during resume comparison: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Resume comparison failed: {str(e)}"
        )
