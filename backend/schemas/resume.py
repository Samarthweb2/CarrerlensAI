from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class ResumeAnalysisResponse(BaseModel):
    ats_score: int
    resume_score: int
    formatting: int
    grammar: int
    keywords: int
    skills_found: List[str]
    missing_skills: List[str]
    suggestions: List[str]

class LinksSchema(BaseModel):
    github: Optional[str] = None
    linkedin: Optional[str] = None

class ResumeUploadResponse(BaseModel):
    fileId: int
    fileName: str
    text: str
    education: List[str]
    experience: List[str]
    projects: List[str]
    skills: List[str]
    certifications: List[str]
    links: LinksSchema
    analysisId: int
