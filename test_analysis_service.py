"""Smoke test for resume_analysis_service."""
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from services.resume_analysis_service import (
    analyze_resume, get_skills_flat, get_skills_by_category
)

SAMPLE_RESUME = """Alice Chen - Senior Data Scientist
Email: alice.chen@email.com | Phone: 123-456-7890
linkedin.com/in/alice-chen | github.com/alicechen

Summary
High-performing Data Scientist with 5+ years of experience in Machine Learning and NLP.

Technical Skills
Python, SQL, Machine Learning, TensorFlow, PyTorch, Pandas, NumPy, Git, Docker, AWS

Experience
Senior Data Scientist at Google
Jan 2022 - Present
- Built ML pipelines processing 1M+ records daily
- Led a team of 4 data scientists
- Deployed models to production using Docker and Kubernetes

Data Analyst at Meta
Jun 2019 - Dec 2021
- Analyzed user engagement metrics using SQL and Python
- Created Tableau dashboards for executive reporting

Education
M.S. in Computer Science
Stanford University
2017-2019
GPA: 3.9/4.0

B.Tech in Information Technology
IIT Delhi
2013-2017

Projects
Resume Analyzer
Built an NLP-based resume parsing tool
Technologies: Python, Flask

Certifications
AWS Solutions Architect - 2023
Google Professional ML Engineer - 2022
"""

profile = analyze_resume(SAMPLE_RESUME, "Alice_Chen_Resume.pdf")

print("=== CONTACT ===")
for k, v in profile['contact'].items():
    print(f"  {k}: {v}")

print(f"\n=== SUMMARY ===")
print(f"  {profile['summary']}")

print(f"\n=== SKILLS ({len(profile['skills'])}) ===")
for s in profile['skills']:
    print(f"  {s['name']:20s} [{s['category']}]")

print(f"\n=== EDUCATION ({len(profile['education'])}) ===")
for e in profile['education']:
    print(f"  {e['level'] or '?':12s} | {e['degree']}")
    if e['institution']:
        print(f"               | {e['institution']}")

print(f"\n=== EXPERIENCE ({len(profile['experience'])}) ===")
for x in profile['experience']:
    print(f"  {x['role'] or '?'} @ {x['company'] or '?'}")
    print(f"    Duration: {x['duration'] or 'N/A'}, Current: {x['is_current']}")
    for r in x['responsibilities'][:2]:
        print(f"    - {r}")

print(f"\n=== PROJECTS ({len(profile['projects'])}) ===")
for p in profile['projects']:
    print(f"  {p['name']} -> {p['technologies']}")

print(f"\n=== CERTIFICATIONS ({len(profile['certifications'])}) ===")
for c in profile['certifications']:
    print(f"  {c['name']} ({c['year']})")

print(f"\n=== METADATA ===")
for k, v in profile['metadata'].items():
    print(f"  {k}: {v}")

print(f"\n=== HELPER: get_skills_flat ===")
print(f"  {get_skills_flat(profile)}")

print(f"\n=== HELPER: get_skills_by_category ===")
for cat, names in get_skills_by_category(profile).items():
    print(f"  {cat}: {names}")

print("\n[OK] All extractions completed successfully!")
