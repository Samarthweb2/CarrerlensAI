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
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)
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

@patch("google.generativeai.GenerativeModel")
@patch("resume_parser.extract_text")
def test_full_candidate_lifecycle_flow(mock_extract, mock_model_class):
    # Mock resume file extraction content
    mock_extract.return_value = "Python, SQL, React software engineer resume details"

    # Mock Gemini model responses
    mock_model = MagicMock()
    mock_response = MagicMock()
    mock_response.text = """
    {
        "atsScore": 92,
        "resumeScore": 90,
        "formatting": 95,
        "grammar": 93,
        "keywords": 86,
        "skillsFound": ["Python", "SQL", "React"],
        "missingSkills": ["Docker", "AWS"],
        "suggestions": ["Add metrics", "Link GitHub"],
        "sectionScores": {
            "Education": 95,
            "Experience": 80,
            "Projects": 85,
            "Skills": 90,
            "Summary": 75,
            "Certifications": 85
        },
        "keywordMatch": {
            "matched": 86,
            "missing": 14,
            "density": "4.5%"
        },
        "roadmap": [
            {"title": "Student", "completed": true, "desc": "Foundational coursework"},
            {"title": "Data Analyst", "completed": true, "desc": "SQL wrangling"}
        ],
        "jobMatches": [
            {"company": "Google", "role": "Data Analyst", "match": 92, "salary": "18 LPA", "location": "Bangalore", "logo": "G", "color": "#4285F4"}
        ]
    }
    """
    mock_model.generate_content.return_value = mock_response
    mock_model_class.return_value = mock_model

    # Enable Gemini key environment context
    with patch("services.ai_service.GEMINI_API_KEY", "mock_key_present"):
        
        # 1. SIGNUP
        signup_payload = {
            "full_name": "Integration Candidate",
            "email": "lifecycle@example.com",
            "password": "Password123!"
        }
        signup_resp = client.post("/api/v1/auth/signup", json=signup_payload)
        assert signup_resp.status_code == 201

        # 2. LOGIN
        login_payload = {
            "email": "lifecycle@example.com",
            "password": "Password123!"
        }
        login_resp = client.post("/api/v1/auth/login", json=login_payload)
        assert login_resp.status_code == 200
        token = login_resp.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # 3. UPLOAD RESUME
        pdf_content = b"%PDF-1.4 mock pdf structure text Python, SQL, React"
        file_payload = {"file": ("my_resume.pdf", io.BytesIO(pdf_content), "application/pdf")}
        upload_resp = client.post("/api/v1/resume/upload", files=file_payload, headers=headers)
        assert upload_resp.status_code == 200
        upload_data = upload_resp.json()
        assert upload_data["fileName"] == "my_resume.pdf"
        assert upload_data["analysisId"] is not None
        analysis_id = upload_data["analysisId"]

        # 4. FETCH DASHBOARD
        dashboard_resp = client.get(f"/api/v1/dashboard/{analysis_id}", headers=headers)
        assert dashboard_resp.status_code == 200
        dashboard_data = dashboard_resp.json()
        assert dashboard_data["atsScore"] == 92
        assert "Python" in dashboard_data["skillsFound"]
        assert dashboard_data["fileName"] == "my_resume.pdf"
        assert dashboard_data["userName"] == "Integration"

        # 5. FETCH RECOMMENDATION JOBS
        jobs_resp = client.get("/api/v1/jobs", headers=headers)
        assert jobs_resp.status_code == 200
        jobs_data = jobs_resp.json()
        assert jobs_data["status"] == "success"
        assert len(jobs_data["matches"]) > 0
        assert jobs_data["matches"][0]["company"] == "Google"

        # 6. LOGOUT
        logout_resp = client.post("/api/v1/auth/logout", headers=headers)
        assert logout_resp.status_code == 200
        assert "Logged out successfully" in logout_resp.json()["message"]

def test_upload_invalid_resume_flow():
    # 1. SIGNUP & LOGIN
    signup_payload = {
        "full_name": "Error User",
        "email": "error@example.com",
        "password": "Password123!"
    }
    client.post("/api/v1/auth/signup", json=signup_payload)
    login_resp = client.post("/api/v1/auth/login", json={"email": "error@example.com", "password": "Password123!"})
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. UPLOAD UNSUPPORTED FORMAT
    file_payload = {"file": ("avatar.png", io.BytesIO(b"png image bytes"), "image/png")}
    response = client.post("/api/v1/resume/upload", files=file_payload, headers=headers)
    assert response.status_code == 400
    assert "PDF or DOCX" in response.json()["detail"]

@patch("resume_parser.extract_text")
def test_gemini_failure_fallback_integration(mock_extract):
    # Mock resume file extraction content
    mock_extract.return_value = "Python, SQL, React developer details"

    # 1. SIGNUP & LOGIN
    signup_payload = {
        "full_name": "Fallback Candidate",
        "email": "fallback@example.com",
        "password": "Password123!"
    }
    client.post("/api/v1/auth/signup", json=signup_payload)
    login_resp = client.post("/api/v1/auth/login", json={"email": "fallback@example.com", "password": "Password123!"})
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. MOCK GEMINI FAILURE
    # Simulate a network/API exception inside GenerativeModel.generate_content
    with patch("google.generativeai.GenerativeModel") as mock_model_class:
        mock_model = MagicMock()
        mock_model.generate_content.side_effect = Exception("API quota exceeded or rate limit limit reached.")
        mock_model_class.return_value = mock_model

        with patch("services.ai_service.GEMINI_API_KEY", "mock_key_present"):
            pdf_content = b"%PDF-1.4 text Python, SQL, React"
            file_payload = {"file": ("my_resume.pdf", io.BytesIO(pdf_content), "application/pdf")}
            
            # The backend should catch the exception, fall back to local heuristic calculations, and return 200 OK
            response = client.post("/api/v1/resume/upload", files=file_payload, headers=headers)
            assert response.status_code == 200
            data = response.json()
            assert data["fileName"] == "my_resume.pdf"
            assert data["analysisId"] is not None
            
            # Fetch dashboard data to confirm fallback scoring exists
            analysis_id = data["analysisId"]
            dash_resp = client.get(f"/api/v1/dashboard/{analysis_id}", headers=headers)
            assert dash_resp.status_code == 200
            dash_data = dash_resp.json()
            assert dash_data["atsScore"] > 0
            assert "Python" in dash_data["skillsFound"]
