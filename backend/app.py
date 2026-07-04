# pyrefly: ignore [missing-import]
import streamlit as st
import io
import os
import pandas as pd
import collections

# Base directory for the project (one level up from backend/)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Import our custom modules
from resume_parser import extract_text_from_pdf
from resume_parser import extract_contact_info, extract_skills_from_text
import matching_engine as me

# Set up page configurations for a premium look
st.set_page_config(
    page_title="CareerLensAI - Talent Intelligence Hub",
    page_icon="🎯",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom Styling (Glassmorphism & premium dark UI vibes via Streamlit Markdown)
st.markdown("""
<style>
    .reportview-container {
        background: #0F172A;
    }
    .metric-card {
        background: rgba(30, 41, 59, 0.5);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 20px;
        margin: 10px 0px;
    }
    .badge-required {
        background-color: #EF4444;
        color: white;
        padding: 3px 8px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: bold;
    }
    .badge-preferred {
        background-color: #3B82F6;
        color: white;
        padding: 3px 8px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: bold;
    }
</style>
""", unsafe_allowed_html=True)

# Helper function to get candidates dropdown list
def get_candidate_options():
    conn = me.get_connection()
    rows = conn.execute("SELECT id, first_name || ' ' || last_name AS name FROM candidates").fetchall()
    conn.close()
    return {row['name']: row['id'] for row in rows}

# Helper function to get jobs dropdown list (paginated for large datasets)
def get_job_options(search_term=None, limit=100):
    conn = me.get_connection()
    if search_term:
        rows = conn.execute(
            "SELECT id, title, company FROM jobs WHERE title LIKE ? OR company LIKE ? LIMIT ?",
            (f'%{search_term}%', f'%{search_term}%', limit)
        ).fetchall()
    else:
        rows = conn.execute("SELECT id, title, company FROM jobs LIMIT ?", (limit,)).fetchall()
    conn.close()
    return {f"{row['title']} ({row['company']})": row['id'] for row in rows}

# ====================================================================
# SIDEBAR NAVIGATION
# ====================================================================
st.sidebar.title("🎯 CareerLensAI")
st.sidebar.markdown("*Intelligent Resume & Talent Matching Engine*")
st.sidebar.markdown("---")

app_mode = st.sidebar.radio(
    "Select Portal View",
    ["Candidate Portal", "Recruiter Dashboard"]
)

st.sidebar.markdown("---")
st.sidebar.markdown("### Database Status")

# Fetch database stats to show in sidebar
try:
    conn = me.get_connection()
    cand_count = conn.execute("SELECT COUNT(*) FROM candidates").fetchone()[0]
    job_count = conn.execute("SELECT COUNT(*) FROM jobs").fetchone()[0]
    skills_count = conn.execute("SELECT COUNT(*) FROM skills").fetchone()[0]
    conn.close()
    
    st.sidebar.success("Database Connected")
    st.sidebar.write(f"👥 Candidates: **{cand_count}**")
    st.sidebar.write(f"💼 Job Listings: **{job_count}**")
    st.sidebar.write(f"🔑 Master Skills: **{skills_count}**")
except Exception as e:
    st.sidebar.error("Database connection failed")

# ====================================================================
# MODE 1: CANDIDATE PORTAL
# ====================================================================
if app_mode == "Candidate Portal":
    st.title("👥 Candidate Match & Skill Gap Engine")
    st.write("Upload your resume, find matching job listings, view skill gaps, and explore structural roadmaps.")
    st.markdown("---")
    
    col1, col2 = st.columns([1, 2])
    
    with col1:
        st.subheader("1. Setup Profile")
        
        # Choice: Login or Upload
        profile_action = st.radio("Choose Action:", ["Select Existing Profile", "Upload New Resume (PDF)"])
        
        selected_candidate_id = None
        
        if profile_action == "Select Existing Profile":
            cand_opts = get_candidate_options()
            if cand_opts:
                selected_name = st.selectbox("Select Candidate:", list(cand_opts.keys()))
                selected_candidate_id = cand_opts[selected_name]
            else:
                st.warning("No candidates in database. Please upload a resume first!")
                
        else:
            # Upload PDF
            uploaded_file = st.file_uploader("Upload Resume PDF", type=["pdf"])
            if uploaded_file is not None:
                with st.spinner("Extracting text and matching skills..."):
                    # Process file in memory
                    pdf_stream = io.BytesIO(uploaded_file.read())
                    raw_text = extract_text_from_pdf(pdf_stream)
                    
                    if raw_text:
                        # Extract info
                        first_name, last_name, email, phone = extract_contact_info(raw_text, uploaded_file.name)
                        skills = extract_skills_from_text(raw_text)
                        
                        # Save path
                        save_dir = os.path.join(BASE_DIR, 'data', 'uploads')
                        os.makedirs(save_dir, exist_ok=True)
                        save_path = os.path.join(save_dir, uploaded_file.name)
                        
                        with open(save_path, 'wb') as f:
                            f.write(uploaded_file.getbuffer())
                            
                        # Save profile in sqlite
                        selected_candidate_id = me.save_candidate_profile(
                            first_name=first_name,
                            last_name=last_name,
                            email=email,
                            phone=phone,
                            resume_path=save_path,
                            skills_list=skills
                        )
                        st.success(f"Successfully loaded and parsed profile for {first_name} {last_name}!")
                    else:
                        st.error("Failed to parse PDF contents.")
        
        # Display profile details if logged in
        if selected_candidate_id:
            conn = me.get_connection()
            cand_profile = conn.execute("SELECT * FROM candidates WHERE id = ?", (selected_candidate_id,)).fetchone()
            cand_skills_rows = conn.execute("""
                SELECT s.name FROM candidate_skills cs 
                JOIN skills s ON cs.skill_id = s.id 
                WHERE cs.candidate_id = ?
            """, (selected_candidate_id,)).fetchall()
            conn.close()
            
            if cand_profile:
                st.markdown("#### Candidate Details:")
                st.write(f"📧 Email: **{cand_profile['email']}**")
                st.write(f"📞 Phone: **{cand_profile['phone']}**")
                
                skills_str = ", ".join([r['name'] for r in cand_skills_rows])
                st.write(f"🛠️ Skills: *{skills_str}*")
                
    with col2:
        st.subheader("2. Job Match & Recommendations")
        
        if selected_candidate_id:
            # Matching percentage for candidate (optimized: no CROSS JOIN)
            matches = me.get_candidate_matches(candidate_id=selected_candidate_id, limit=50)
            
            if matches:
                # Convert list of dicts to DataFrame for clean display
                df_matches = pd.DataFrame(matches)
                
                # Display columns available
                display_cols = ['job_title', 'company_name', 'matching_skills_count', 'total_skills_required', 'match_percentage']
                if 'experience_level' in df_matches.columns:
                    display_cols.insert(2, 'experience_level')
                if 'salary' in df_matches.columns:
                    display_cols.insert(2, 'salary')
                
                # Plot matches as a bar chart (top 15 for readability)
                st.markdown("#### Top Job Matches")
                chart_data = df_matches.head(15)
                st.bar_chart(data=chart_data, x='job_title', y='match_percentage')
                
                # Interactive Dropdown to pick a job and view skill gaps / roadmaps
                st.markdown("#### Select a matching job to perform detailed Gap Analysis:")
                job_names = [f"{m['job_title']} at {m['company_name']}" for m in matches]
                selected_job_desc = st.selectbox("Select Job Listing:", job_names)
                
                # Find matching record
                selected_idx = job_names.index(selected_job_desc)
                selected_match = matches[selected_idx]
                
                # Find job ID
                conn = me.get_connection()
                job_id_row = conn.execute("SELECT id FROM jobs WHERE title = ? AND company = ?", (selected_match['job_title'], selected_match['company_name'])).fetchone()
                conn.close()
                
                if job_id_row:
                    job_id = job_id_row['id']
                    
                    col_m1, col_m2, col_m3 = st.columns(3)
                    with col_m1:
                        st.metric("ATS Match Score", f"{selected_match['match_percentage']}%")
                    with col_m2:
                        st.metric("Skills Overlap", f"{selected_match['matching_skills_count']} / {selected_match['total_skills_required']}")
                    with col_m3:
                        salary_val = selected_match.get('salary')
                        st.metric("Salary", f"${salary_val:,}" if salary_val else "Not Listed")
                        
                    # Skill gaps
                    gaps = me.get_skill_gaps(candidate_id=selected_candidate_id, job_id=job_id)
                    
                    st.markdown("### 🔍 Skill Gap Analysis")
                    if gaps:
                        st.warning("You are missing the following skills required for this job:")
                        for gap in gaps:
                            badge = f"<span class='badge-required'>Required</span>" if gap['skill_importance'] == 'Required' else f"<span class='badge-preferred'>Preferred</span>"
                            st.markdown(f"*   **{gap['missing_skill_name']}** {badge}", unsafe_allowed_html=True)
                            
                        # Learning Roadmap
                        roadmap = me.get_learning_roadmap(candidate_id=selected_candidate_id, job_id=job_id)
                        
                        st.markdown("### 🗺️ Your Personalized Learning Roadmap")
                        if roadmap:
                            st.info("Follow this step-by-step roadmap to close your skill gaps:")
                            
                            # Group steps by missing skill
                            roadmap_by_skill = collections.defaultdict(list)
                            for step in roadmap:
                                roadmap_by_skill[step['missing_skill']].append(step)
                                
                            for missing_skill, steps in roadmap_by_skill.items():
                                with st.expander(f"📚 Roadmap for: {missing_skill}"):
                                    for step in sorted(steps, key=lambda x: x['step_number']):
                                        st.markdown(f"**Step {step['step_number']}: {step['learning_step']}**")
                                        st.markdown(f"*{step['step_details']}*")
                                        st.markdown("---")
                        else:
                            st.write("No pre-seeded roadmap steps found for your missing skills. Try searching YouTube or Coursera!")
                    else:
                        st.success("🎉 Perfect Match! You possess all the skills required/preferred for this job!")
            else:
                st.info("No job matches found. Check your profile skills or ensure the ETL pipeline has been run.")
        else:
            st.info("Please login or upload a resume to view match details.")

# ====================================================================
# MODE 2: RECRUITER PORTAL
# ====================================================================
else:
    st.title("🎯 Recruiter Talent Intelligence Portal")
    st.write("Analyze skill demands, salary distributions, hiring hot spots, and source top candidates.")
    st.markdown("---")
    
    tab1, tab2 = st.tabs(["📊 Market & Skill Analytics", "🔍 Talent Match Engine"])
    
    with tab1:
        st.subheader("Talent Market Insights")
        
        # Row 1: Top Skills and Top Salaries
        col_r1_1, col_r1_2 = st.columns(2)
        
        with col_r1_1:
            st.markdown("#### Demand Curve: Top Demanded Skills")
            top_skills = me.get_top_skills()
            if top_skills:
                df_skills = pd.DataFrame(top_skills)
                st.bar_chart(df_skills, x='skill_name', y='job_demand_count')
                st.dataframe(df_skills, hide_index=True)
            else:
                st.info("No skill data available. Run the ETL pipeline first.")
                
        with col_r1_2:
            st.markdown("#### Salary Benchmark: Average Salary by Role")
            avg_salary = me.get_average_salary()
            if avg_salary:
                df_salary = pd.DataFrame(avg_salary)
                st.bar_chart(df_salary, x='job_role', y='average_salary_usd')
                st.dataframe(df_salary, hide_index=True)
            else:
                st.info("No salary data available. Ensure dataset includes salary information.")
                
        # Row 2: Hiring Cities & Skill Combinations
        col_r2_1, col_r2_2 = st.columns(2)
        
        with col_r2_1:
            st.markdown("#### Geographic Hubs: Hiring Cities")
            top_cities = me.get_top_cities()
            if top_cities:
                df_cities = pd.DataFrame(top_cities)
                st.bar_chart(df_cities, x='city_or_region', y='jobs_posted')
                st.dataframe(df_cities, hide_index=True)
            else:
                st.info("No location data available.")
                
        with col_r2_2:
            st.markdown("#### Co-occurrence: Top Skill Pairs Required Together")
            combinations = me.get_skill_combinations()
            if combinations:
                df_combos = pd.DataFrame(combinations)
                st.dataframe(df_combos, hide_index=True)
            else:
                st.info("No skill combination data available.")
                
    with tab2:
        st.subheader("Source Top Candidates for Job Openings")
        
        # Search-enabled job selection (handles 10K+ jobs)
        job_search = st.text_input("🔍 Search jobs by title or company:", placeholder="e.g. Data Analyst, Google")
        job_opts = get_job_options(search_term=job_search if job_search else None, limit=100)
        
        if job_opts:
            selected_job_label = st.selectbox("Select Active Job Opening:", list(job_opts.keys()))
            selected_job_id = job_opts[selected_job_label]
            
            # Use optimized per-job candidate matching (no CROSS JOIN)
            job_matches = me.get_job_candidates(job_id=selected_job_id, limit=50)
            
            if job_matches:
                st.markdown(f"#### Candidates Matched for {selected_job_label}")
                df_job_matches = pd.DataFrame(job_matches)
                # Select display columns
                df_job_display = df_job_matches[['candidate_name', 'matching_skills_count', 'total_skills_required', 'match_percentage']]
                
                # Format index to look like rank
                df_job_display = df_job_display.copy()
                df_job_display.index = df_job_display.index + 1
                st.dataframe(df_job_display, use_container_width=True)
                
                # Detailed breakdown of individual candidate
                st.markdown("#### Select a candidate to view their details:")
                c_names = [m['candidate_name'] for m in job_matches]
                selected_candidate_name = st.selectbox("Candidate Profile:", c_names)
                
                # Get candidate ID from the match data
                selected_c_match = next((m for m in job_matches if m['candidate_name'] == selected_candidate_name), None)
                
                if selected_c_match:
                    c_id = selected_c_match.get('candidate_id')
                    if not c_id:
                        # Fallback: look up from DB
                        conn = me.get_connection()
                        c_id_row = conn.execute("SELECT id FROM candidates WHERE first_name || ' ' || last_name = ?", (selected_candidate_name,)).fetchone()
                        conn.close()
                        c_id = c_id_row['id'] if c_id_row else None
                    
                    if c_id:
                        # Fetch missing skills for candidate
                        c_gaps = me.get_skill_gaps(candidate_id=c_id, job_id=selected_job_id)
                        
                        # Fetch present skills for candidate
                        conn = me.get_connection()
                        present_skills_rows = conn.execute("""
                            SELECT s.name FROM candidate_skills cs
                            JOIN skills s ON cs.skill_id = s.id
                            WHERE cs.candidate_id = ?
                        """, (c_id,)).fetchall()
                        conn.close()
                        
                        c_present = [r['name'] for r in present_skills_rows]
                        
                        col_p1, col_p2 = st.columns(2)
                        with col_p1:
                            st.markdown("🟢 **Possessed Skills:**")
                            for s in c_present:
                                st.write(f"- {s}")
                        with col_p2:
                            st.markdown("🔴 **Missing Skills (Skill Gap):**")
                            if c_gaps:
                                for gap in c_gaps:
                                    st.write(f"- {gap['missing_skill_name']} ({gap['skill_importance']})")
                            else:
                                st.success("Perfect Match! No missing skills.")
            else:
                st.write("No candidate matches found for this job. Upload resumes via the Candidate Portal.")
        else:
            if job_search:
                st.warning(f"No jobs found matching '{job_search}'. Try a different search term.")
            else:
                st.warning("No job openings found. Run the ETL pipeline to import job data.")
