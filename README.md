# 🎯 CareerLensAI — Intelligent Student Resume Analyzer & Job Matching Platform

[![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Python Version](https://img.shields.io/badge/python-3.10%2B-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791.svg)](https://www.postgresql.org/)
[![Live Demo](https://img.shields.io/badge/demo-live%20app-brightgreen.svg)](https://careerlensai-frontend.onrender.com)

> **CareerLensAI** is an enterprise-grade AI-powered Student Resume Analyzer and Data-Driven Job Matching Platform. It ingests thousands of real LinkedIn job postings into PostgreSQL/SQLite via an automated ETL pipeline, extracts technical skills, performs domain classification, and computes set-based Jaccard similarity matching to provide actionable ATS scores, technical skill gap analysis, and personalized career roadmaps.

---

## 🔗 Live Demo & Deployments

- 🌐 **Frontend Application**: [https://careerlensai-frontend.onrender.com](https://careerlensai-frontend.onrender.com)
- ⚙️ **Backend API Documentation**: [https://careerlensai-backend.onrender.com/docs](https://careerlensai-backend.onrender.com/docs)

---

## 🌟 Core Features

- 📄 **Multi-Format Resume Parsing**: Automatically extracts text, contact info, education, work experience, projects, and skills from PDF and DOCX files.
- 🎯 **Domain-Aware Job Matching**: Classifies candidates into technical domains (*Frontend, Backend, Data, DevOps, Mobile, Cybersecurity*) and queries relevant jobs from a database of 115,000+ real LinkedIn postings.
- 📐 **Set-Based Jaccard & Coverage Scoring**: Evaluates candidate skill sets against real job postings using set theory ($Jaccard + Coverage$) for realistic, non-clustered match percentages (52% – 94%).
- 🛠️ **Pure Technical Skill Gap Analysis**: Automatically filters out soft skills (*Communication, Leadership, Teamwork*) to identify true technical skill deficiencies required by industry roles.
- 📊 **Dynamic ATS Scoring & Breakdown**: Computes instant ATS compatibility scores based on section completeness, formatting quality, and keyword density.
- 🤖 **Gemini AI Enhancement Layer**: Leverages Google Gemini 1.5/2.5 Flash to generate personalized resume bullet rewrites (*Before vs. After*) and tailored mock interview questions without overriding database job search results.
- 🔐 **Secure Authentication & OTP Verification**: Complete JWT-based authentication with bcrypt password hashing and email OTP verification.
- 📱 **Fully Responsive Glassmorphic UI**: Ultra-modern, dark-themed dashboard built with React 18, Tailwind CSS, Lucide Icons, and Recharts.

---

## 📸 Visual Tour & Screenshots

Here is a visual walkthrough of the CareerLensAI application interface:

### 1. Landing Page
*Modern glassmorphic landing page featuring project highlights, real-time metrics, and call-to-action.*
![Landing Page](docs/screenshots/01_landing_page.png)

---

### 2. Authentication (Login & Signup)
*Secure user authentication supporting JWT tokens, email verification, and password recovery.*
| Login Screen | Signup Screen |
|---|---|
| ![Login Page](docs/screenshots/02_login_page.png) | ![Signup Page](docs/screenshots/03_signup_page.png) |

---

### 3. OTP Verification
*Two-factor email OTP verification interface for secure account activation.*
![OTP Verification](docs/screenshots/04_otp_verification.png)

---

### 4. Resume Upload & Dropzone
*Drag-and-drop file uploader supporting multi-format resume documents with instant parsing status.*
| Upload Dropzone | Dashboard Overview |
|---|---|
| ![Resume Upload](docs/screenshots/06_resume_upload.png) | ![Dashboard Overview](docs/screenshots/05_dashboard_overview.png) |

---

### 5. ATS Score & Analytics Breakdown
*Comprehensive ATS compatibility score breakdown across education, experience, skills, and formatting.*
![ATS Analysis](docs/screenshots/07_ats_analysis.png)

---

### 6. Domain-Driven Job Recommendations
*Real-time job matching powered by database queries over 115,000+ real LinkedIn postings with set-based match scores.*
![Job Recommendations](docs/screenshots/08_job_recommendations.png)

---

### 7. Technical Skill Gap Analysis & Roadmap
*Domain-specific technical missing skills analysis excluding soft skills, accompanied by step-by-step career roadmaps.*
![Skill Gap Analysis](docs/screenshots/09_skill_gap_analysis.png)

---

### 8. Responsive Mobile View
*Fully optimized mobile user interface designed for seamless navigation on all screen dimensions.*
<img src="docs/screenshots/10_mobile_view.png" width="380" alt="Mobile View" />

---

## 🏗️ System Architecture & Resume Analysis Pipeline

### High-Level Architecture

CareerLensAI follows a clean, decoupled client-server architecture. The frontend communicates with a FastAPI REST backend backed by PostgreSQL/SQLite and an optional Gemini AI enhancement layer.

```mermaid
flowchart LR
    subgraph Client Layer [Frontend - React 18 + Tailwind CSS]
        A[User Browser] --> B[React Router / Auth Provider]
        B --> C[Resume Upload Dropzone]
        B --> D[Dashboard & Analytics UI]
    end

    subgraph API Layer [Backend - FastAPI]
        C -->|POST /api/v1/resumes/upload| E[Resume Parser Route]
        E --> F[PyMuPDF / pdfplumber Text Extractor]
        F --> G[Regex & Heuristic Section Parser]
        G --> H[AI Analysis Service Engine]
    end

    subgraph Data & Storage Layer [PostgreSQL / SQLite]
        H -->|ILIKE Domain Search| I[(JobRole Table - 115k+ LinkedIn Jobs)]
        I -->|Return Scored Roles| H
        H -->|Persist Analysis Record| J[(Analyses & Users DB)]
    end

    subgraph AI Enhancement Layer [Optional Gemini API]
        H -.->|Enhance Suggestions & Questions| K[Google Gemini 1.5/2.5 Flash]
        K -.->|Return JSON Enhancements| H
    end
```

---

### Resume Analysis & Skill Matching Pipeline

When a candidate uploads a resume document, CareerLensAI executes a 6-stage analytical pipeline:

```mermaid
flowchart TD
    A[1. Upload Document - PDF/DOCX] --> B[2. Text Extraction & Structural Parsing]
    B --> C[3. Canonical Skill Normalization & Extraction]
    C --> D[4. Domain Classification - Frontend, Backend, Data, DevOps, Mobile, Security]
    D --> E[5. PostgreSQL/SQLite Scoped Query & Set-Based Jaccard Scoring]
    E --> F[6. Pure Technical Skill Gap Extraction - Excludes Soft Skills]
    F --> G[7. Gemini Enhancement Overlay - Bullet Rewrites & Interview Prep]
    G --> H[8. Render Interactive Dashboard Analytics]
```

1. **Document Parsing**: Extract raw text and isolate section blocks (*Education, Experience, Projects, Skills*).
2. **Skill Normalization**: Match raw tokens against canonical dictionary (`standardize_skill_name`), converting aliases (*e.g., `postgres` $\rightarrow$ `PostgreSQL`, `k8s` $\rightarrow$ `Kubernetes`*).
3. **Domain Classification**: Calculate domain frequency scores across skill definitions to classify the candidate into a target domain.
4. **Database Querying**: Execute PostgreSQL/SQLite case-insensitive `ILIKE` queries filtered by domain keywords to pull relevant job postings.
5. **Set-Based Scoring**: Compute technical coverage ($C$) and Jaccard similarity ($J$) on non-soft skills to generate match percentages (52% – 94%).
6. **Technical Gap Extraction**: Aggregate required skills across top matched database roles, removing candidate skills and `SOFT_SKILLS` (*Communication, Leadership, Teamwork*).

---

## 🗄️ Database Schema

CareerLensAI uses a relational schema designed in SQLAlchemy and managed with automated column migration scripts:

```mermaid
erDiagram
    USERS {
        int id PK
        string email UK
        string password_hash
        string full_name
        boolean is_verified
        string verification_code
        datetime created_at
    }

    RESUMES {
        int id PK
        int user_id FK
        string filename
        string filepath
        datetime uploaded_at
    }

    ANALYSES {
        int id PK
        int resume_id FK
        int user_id FK
        int ats_score
        int resume_score
        json skills_found
        json missing_skills
        json suggestions
        json section_scores
        json roadmap
        json job_matches
        json improvements
        json interview_questions
        datetime created_at
    }

    JOB_ROLES {
        int id PK
        string title
        string company
        string location
        string industry
        string description
        json required_skills
        json preferred_skills
        string experience_level
        int salary_min
        int salary_max
        string work_type
        json ats_keywords
    }

    SKILLS {
        int id PK
        string name UK
        string category
    }

    USERS ||--o{ RESUMES : "uploads"
    USERS ||--o{ ANALYSES : "owns"
    RESUMES ||--o{ ANALYSES : "evaluated_by"
```

---

## 💻 Tech Stack

| Component | Technology | Description |
|---|---|---|
| **Frontend Framework** | React 18, Vite | High-performance single page application |
| **Styling & Icons** | Tailwind CSS, Lucide Icons | Glassmorphic, modern dark mode design |
| **Data Visualization** | Recharts | Dynamic interactive ATS score & skill charts |
| **Backend Framework** | FastAPI (Python 3.10+) | Asynchronous high-performance REST API |
| **Database** | PostgreSQL 16 / SQLite | Primary relational store for users & job knowledge base |
| **ORM & Driver** | SQLAlchemy, psycopg2-binary | Data modeling and database interface |
| **Authentication** | PyJWT, Passlib (bcrypt) | Stateless JSON Web Token authentication |
| **Document Parsing** | PyMuPDF (fitz), pdfplumber | PDF/DOCX text extraction & layout processing |
| **ETL & Data Processing** | Python CSV, Regex Engine | Ingestion engine for 115k+ LinkedIn job postings |
| **AI Layer** | Google Generative AI (Gemini Flash) | Advanced bullet rewriting and mock interview generation |

---

## 📁 Project Structure

```text
CareerLensAI/
├── backend/
│   ├── api/
│   │   ├── middleware/
│   │   │   └── auth.py               # JWT authentication middleware
│   │   └── routes/
│   │       ├── auth.py               # Signup, login, OTP verification routes
│   │       ├── dashboard.py          # Dashboard analytics API endpoints
│   │       ├── health.py             # Server health check endpoint
│   │       ├── jobs.py               # Job role search & filtering routes
│   │       └── resume.py             # Resume upload, parse, and analyze routes
│   ├── database/
│   │   ├── database.py               # PostgreSQL/SQLite connection & session factory
│   │   └── models.py                 # SQLAlchemy ORM models (User, Resume, Analysis, JobRole, Skill)
│   ├── schemas/
│   │   ├── auth.py                   # Pydantic schemas for auth requests
│   │   └── resume.py                 # Pydantic schemas for analysis responses
│   ├── services/
│   │   ├── ai_service.py             # Domain detection, set-based Jaccard search, Gemini enhancement
│   │   ├── auth_service.py           # User creation, password verification, OTP lifecycle
│   │   └── jobs_service.py           # Job role search & database retrieval
│   ├── utils/
│   │   ├── jwt_handler.py            # Token generation & verification
│   │   └── password.py               # Bcrypt password hashing functions
│   ├── bulk_parser.py                # Batch resume parsing runner
│   ├── etl_pipeline.py               # 6-stage ETL pipeline for LinkedIn dataset
│   ├── main.py                       # FastAPI application entry point & CORS configuration
│   └── resume_parser.py              # PDF/DOCX extraction & JSON section parser
├── frontend/
│   ├── public/                       # Static public assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/                 # Login, Signup, OTP UI components
│   │   │   ├── common/               # Navbar, Footer, Loading Spiders
│   │   │   ├── dashboard/            # ATS Score Card, Job Recs, Skill Gap components
│   │   │   └── landing/              # Hero, Features, Metrics components
│   │   ├── pages/                    # Main app page routes
│   │   ├── services/
│   │   │   ├── api.js                # Axios client configuration
│   │   │   ├── authService.js        # Authentication API calls
│   │   │   └── resumeService.js      # Resume analysis API calls
│   │   ├── App.jsx                   # Application layout & routing setup
│   │   └── main.jsx                  # React DOM root entry point
│   ├── index.html                    # Root HTML document
│   ├── package.json                  # Frontend dependencies
│   ├── tailwind.config.js            # Tailwind CSS design system configuration
│   └── vite.config.js                # Vite build configuration
├── data/
│   ├── raw/
│   │   └── postings.csv              # Raw LinkedIn job postings dataset (516 MB)
│   └── reports/                      # Generated ETL markdown execution reports
├── docs/
│   └── screenshots/                  # High-quality application screenshots
├── .gitignore                        # Git exclusion rules
├── LICENSE                           # Software license
└── README.md                         # Documentation (this file)
```

---

## 📡 API Endpoint Documentation

| Method | Endpoint Route | Description | Auth Required |
|---|---|---|---|
| `GET` | `/health` | Application health check & status ping | No |
| `POST` | `/api/v1/auth/signup` | Register new user account & dispatch OTP | No |
| `POST` | `/api/v1/auth/verify-otp` | Verify 6-digit email OTP code | No |
| `POST` | `/api/v1/auth/login` | Authenticate user & return JWT Bearer token | No |
| `GET` | `/api/v1/auth/me` | Retrieve currently authenticated user profile | Yes |
| `POST` | `/api/v1/resumes/upload` | Upload resume file, execute analysis pipeline, save results | Yes |
| `GET` | `/api/v1/resumes/my-analyses` | Fetch history of candidate's past resume analyses | Yes |
| `GET` | `/api/v1/resumes/analysis/{id}` | Retrieve specific resume analysis record details | Yes |
| `POST` | `/api/v1/resumes/compare` | Compare two resume versions side-by-side | Yes |
| `GET` | `/api/v1/jobs` | Query & filter database job roles | No |
| `GET` | `/api/v1/dashboard/stats` | Aggregate dashboard statistics & metrics | Yes |

---

## 🚀 Installation & Local Setup Guide

### Prerequisites
- **Python 3.10+** installed
- **Node.js 18+** and **npm** installed
- **Git** installed

### 1. Clone the Repository
```bash
git clone https://github.com/Samarthweb2/CarrerlensAI.git
cd CareerLensAI
```

### 2. Setup & Run Backend

```bash
# Navigate to backend directory
cd backend

# Create a virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install required dependencies
pip install -r requirements.txt
# (Additional required packages if running locally)
pip install pyjwt passlib python-multipart bcrypt pydantic email-validator PyMuPDF pdfplumber

# (Optional) Ingest LinkedIn dataset into local database via ETL Pipeline
python etl_pipeline.py --limit 15000

# Start the FastAPI backend server
python main.py
```
*Backend server will start on `http://localhost:8000` with interactive API docs at `http://localhost:8000/docs`.*

---

### 3. Setup & Run Frontend

```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```
*Frontend web application will start on `http://localhost:5173`.*

---

## ⚙️ Environment Variables

Create a `.env` file in `backend/` and `frontend/` as needed:

### Backend `.env` (`backend/.env`)
```ini
# Database Connection (PostgreSQL or SQLite fallback)
DATABASE_URL=sqlite:///./careerlens_auth.db
# Example PostgreSQL: postgresql+psycopg2://user:password@localhost:5432/careerlens

# JWT Secret Configuration
JWT_SECRET_KEY=your_super_secret_jwt_key_here
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# (Optional) Google Gemini API Key for AI enhancements
GEMINI_API_KEY=your_google_gemini_api_key_here

# Frontend CORS Origin
FRONTEND_URL=http://localhost:5173,https://careerlensai-frontend.onrender.com
```

### Frontend `.env` (`frontend/.env`)
```ini
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

---

## 🗺️ Future Roadmap

- [ ] **Multi-Resume Comparison Matrix**: Visual side-by-side diffing between different resume versions.
- [ ] **Custom ATS Template Export**: One-click export of optimized resume content into clean ATS-friendly PDF/Word templates.
- [ ] **Real-time Recruiter Portal**: Talent acquisition dashboard for recruiters to post jobs and screen applicant pools.
- [ ] **Vector Database Upgrade**: Migrate SQL skill searches to Pinecone / pgvector vector embeddings for semantic similarity scoring.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the project repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

