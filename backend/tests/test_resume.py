import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import sys
import os
import io
from unittest.mock import patch, MagicMock

# Ensure backend imports work
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.database import Base, get_db
from database.models import User, Resume, Analysis
from resume_parser import parse_resume_to_json, extract_email, extract_phone, extract_skills_keywords
from services.ai_service import analyze_resume_text
from main import app

# Shared file-based database for SQLite compatibility in tests
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_temp.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

@pytest.fixture(autouse=True, scope="module")
def setup_module_db():
    # Make sure all tables exist
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)
    # Cleanup file
    if os.path.exists("./test_temp.db"):
        try:
            os.remove("./test_temp.db")
        except Exception:
            pass

@pytest.fixture(autouse=True)
def setup_db():
    db = TestingSessionLocal()
    db.query(Analysis).delete()
    db.query(Resume).delete()
    db.query(User).delete()
    db.commit()
    db.close()
    yield

def create_test_user():
    db = TestingSessionLocal()
    user = User(
        full_name="Resume Owner",
        email="owner@example.com",
        password_hash="hashed_password_placeholder"
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    db.close()
    return user

def get_auth_token(email="owner@example.com"):
    from utils.jwt_handler import create_access_token
    return create_access_token({"sub": email})

# --- PARSER TESTS ---
def test_resume_parser_heuristics():
    sample_text = """
    John Doe
    john.doe@example.com | +1 (123) 456-7890
    github.com/johndoe | linkedin.com/in/johndoe
    
    Education
    B.S. in Computer Science - Tech University, 2021
    
    Skills
    Python, React, Docker, FastAPI, SQL
    
    Experience
    Software Engineer - Google, 2021-Present
    - Wrote clean Python code and built React web apps
    
    Projects
    Portfolio Website
    - Created React page with FastAPI server
    
    Certifications
    AWS Certified Cloud Practitioner - 2023
    """
    
    email = extract_email(sample_text)
    phone = extract_phone(sample_text)
    skills = extract_skills_keywords(sample_text)
    
    assert email == "john.doe@example.com"
    assert phone == "+1 (123) 456-7890" or "123-456-7890" in phone
    assert "Python" in skills
    assert "React" in skills
    assert "FastAPI" in skills

# --- AI GRADER TESTS ---
def test_ai_heuristics_grader():
    parsed_sample = {
        "fileId": "1",
        "fileName": "Resume.pdf",
        "text": "sample text",
        "education": ["B.S. CS"],
        "experience": ["Worked at TechCorp"],
        "projects": ["Built App"],
        "skills": ["Python", "SQL"],
        "certifications": [],
        "links": {"github": "github.com/test", "linkedin": "linkedin.com/in/test"}
    }
    
    analysis = analyze_resume_text(parsed_sample)
    assert analysis["atsScore"] > 0
    assert analysis["resumeScore"] > 0
    assert len(analysis["skillsFound"]) == 2
    assert "Docker" in analysis["missingSkills"]
    assert len(analysis["jobMatches"]) > 0

# --- GEMINI MOCKING ---
@patch("google.generativeai.GenerativeModel")
def test_gemini_api_mocking(mock_model_class):
    mock_model = MagicMock()
    mock_response = MagicMock()
    
    mock_response.text = """
    {
        "atsScore": 95,
        "resumeScore": 92,
        "formatting": 90,
        "grammar": 95,
        "keywords": 88,
        "skillsFound": ["Python", "React"],
        "missingSkills": ["AWS"],
        "suggestions": ["Add metrics"],
        "sectionScores": {"Education": 95},
        "keywordMatch": {"matched": 88, "missing": 12, "density": "3.5%"},
        "roadmap": [],
        "jobMatches": []
    }
    """
    mock_model.generate_content.return_value = mock_response
    mock_model_class.return_value = mock_model
    
    with patch("services.ai_service.GEMINI_API_KEY", "mock_key_present"):
        parsed_sample = {
            "fileName": "test.pdf",
            "text": "Python React developer",
            "skills": ["Python", "React"]
        }
        from services.ai_service import analyze_resume_text
        analysis = analyze_resume_text(parsed_sample)
        assert analysis["atsScore"] == 95
        assert "Python" in analysis["skillsFound"]

# --- UPLOAD API VALIDATIONS ---
def test_upload_invalid_file_type():
    create_test_user()
    token = get_auth_token()
    headers = {"Authorization": f"Bearer {token}"}
    
    file_payload = {"file": ("test.txt", io.BytesIO(b"raw text content"), "text/plain")}
    response = client.post("/api/v1/resume/upload", files=file_payload, headers=headers)
    
    assert response.status_code == 400
    assert "PDF or DOCX" in response.json()["detail"]

def test_upload_file_too_large():
    create_test_user()
    token = get_auth_token()
    headers = {"Authorization": f"Bearer {token}"}
    
    large_payload = b"0" * (5 * 1024 * 1024 + 100)
    file_payload = {"file": ("resume.pdf", io.BytesIO(large_payload), "application/pdf")}
    response = client.post("/api/v1/resume/upload", files=file_payload, headers=headers)
    
    assert response.status_code == 400
    assert "too large" in response.json()["detail"]

# --- DASHBOARD & JOBS API TESTS ---
def test_dashboard_endpoint_missing_id():
    create_test_user()
    token = get_auth_token()
    headers = {"Authorization": f"Bearer {token}"}
    
    response = client.get("/api/v1/dashboard/99999", headers=headers)
    assert response.status_code == 404

def test_jobs_endpoint():
    create_test_user()
    token = get_auth_token()
    headers = {"Authorization": f"Bearer {token}"}
    
    response = client.get("/api/v1/jobs", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert len(data["matches"]) > 0
