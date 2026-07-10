import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import sys
import os

# Ensure backend imports work
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.database import Base, get_db
from database.models import User, Resume, Analysis
from utils.password import hash_password, verify_password
from utils.jwt_handler import create_access_token, decode_access_token
from main import app

# Use a file-based SQLite database for tests to share data across connections
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
    # Make sure all models are imported so metadata is aware of them
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
    # Truncate tables before each test
    db = TestingSessionLocal()
    db.query(Analysis).delete()
    db.query(Resume).delete()
    db.query(User).delete()
    db.commit()
    db.close()
    yield

def test_password_hashing():
    raw_pwd = "SecretPassword123!"
    hashed = hash_password(raw_pwd)
    assert hashed != raw_pwd
    assert verify_password(raw_pwd, hashed) is True
    assert verify_password("wrong_password", hashed) is False

def test_jwt_handlers():
    data = {"sub": "test@example.com"}
    token = create_access_token(data)
    decoded = decode_access_token(token)
    assert decoded is not None
    assert decoded["sub"] == "test@example.com"
    
    assert decode_access_token("invalid_token_string") is None

def test_signup_success():
    payload = {
        "full_name": "Test User",
        "email": "test@example.com",
        "password": "Password123!"
    }
    response = client.post("/api/v1/auth/signup", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["full_name"] == "Test User"
    assert data["email"] == "test@example.com"
    assert "password_hash" not in data

def test_signup_duplicate_email():
    payload = {
        "full_name": "Test User",
        "email": "duplicate@example.com",
        "password": "Password123!"
    }
    client.post("/api/v1/auth/signup", json=payload)
    response = client.post("/api/v1/auth/signup", json=payload)
    assert response.status_code == 400
    assert "already exists" in response.json()["detail"]

def test_login_success():
    signup_payload = {
        "full_name": "Test Login User",
        "email": "login@example.com",
        "password": "LoginPassword123!"
    }
    client.post("/api/v1/auth/signup", json=signup_payload)

    login_payload = {
        "email": "login@example.com",
        "password": "LoginPassword123!"
    }
    response = client.post("/api/v1/auth/login", json=login_payload)
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == "login@example.com"

def test_login_wrong_credentials():
    login_payload = {
        "email": "nonexistent@example.com",
        "password": "WrongPassword!"
    }
    response = client.post("/api/v1/auth/login", json=login_payload)
    assert response.status_code == 401

def test_get_current_user_profile():
    signup_payload = {
        "full_name": "Auth User",
        "email": "authme@example.com",
        "password": "Password123!"
    }
    client.post("/api/v1/auth/signup", json=signup_payload)

    login_response = client.post("/api/v1/auth/login", json={
        "email": "authme@example.com",
        "password": "Password123!"
    })
    token = login_response.json()["access_token"]

    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("/api/v1/auth/me", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "authme@example.com"
    assert data["full_name"] == "Auth User"

def test_get_profile_unauthorized():
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 401

def test_logout():
    response = client.post("/api/v1/auth/logout")
    assert response.status_code == 200
    assert "Logged out successfully" in response.json()["message"]
