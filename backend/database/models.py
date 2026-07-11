import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from database.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    is_verified = Column(Boolean, default=False)
    verification_code = Column(String, nullable=True)
    reset_token = Column(String, nullable=True)
    profile_pic = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    resumes = relationship("Resume", back_populates="user", cascade="all, delete-orphan")
    analyses = relationship("Analysis", back_populates="user", cascade="all, delete-orphan")

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    filename = Column(String, nullable=False)
    filepath = Column(String, nullable=False)
    uploaded_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="resumes")
    analysis = relationship("Analysis", back_populates="resume", uselist=False, cascade="all, delete-orphan")

class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(Integer, primary_key=True, index=True)
    resume_id = Column(Integer, ForeignKey("resumes.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    ats_score = Column(Integer, default=0)
    resume_score = Column(Integer, default=0)
    formatting = Column(Integer, default=0)
    grammar = Column(Integer, default=0)
    keywords = Column(Integer, default=0)
    
    skills_found = Column(JSON, nullable=False)
    missing_skills = Column(JSON, nullable=False)
    suggestions = Column(JSON, nullable=False)
    section_scores = Column(JSON, nullable=False)
    keyword_match = Column(JSON, nullable=True)
    roadmap = Column(JSON, nullable=True)
    job_matches = Column(JSON, nullable=True)
    
    job_description = Column(String, nullable=True)
    improvements = Column(JSON, nullable=True)
    interview_questions = Column(JSON, nullable=True)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="analyses")
    resume = relationship("Resume", back_populates="analysis")

class JobRole(Base):
    __tablename__ = "job_roles"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    industry = Column(String, nullable=False)
    required_skills = Column(JSON, nullable=False)
    preferred_skills = Column(JSON, nullable=True)
    experience_level = Column(String, nullable=True)
    ats_keywords = Column(JSON, nullable=False)
