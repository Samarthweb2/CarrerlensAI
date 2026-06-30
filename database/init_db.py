"""
CareerLensAI Database Initializer
==================================
Applies schema and optionally triggers ETL pipeline.

Usage:
    python init_db.py              # Schema + ETL (if dataset exists)
    python init_db.py --skip-etl   # Schema only
    python init_db.py --limit 15000  # Schema + ETL with row limit
"""

import sqlite3
import os
import sys

def init_db(run_etl=True, etl_limit=None):
    # Define paths relative to this script's directory
    db_dir = os.path.dirname(__file__)
    db_path = os.path.join(db_dir, 'careerlens.db')
    schema_path = os.path.join(db_dir, 'schema.sql')
    
    print(f"--- CareerLensAI Database Initializer ---")
    print(f"Database File: {db_path}")
    
    # Connect to the SQLite database (creates it if it doesn't exist)
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Enable foreign key support (by default, SQLite disables foreign key enforcement)
    cursor.execute("PRAGMA foreign_keys = ON;")
    
    try:
        # 1. Apply the schema
        print("Applying schema from schema.sql...")
        with open(schema_path, 'r', encoding='utf-8') as f:
            schema_sql = f.read()
        cursor.executescript(schema_sql)
        
        # Save (commit) the changes
        conn.commit()
        print("SUCCESS: Database schema applied successfully!")
        
    except sqlite3.Error as e:
        print(f"ERROR: Database initialization failed: {e}")
        conn.rollback()
        return
        
    finally:
        # Close the connection
        conn.close()
    
    # 2. Trigger ETL pipeline to import real job data
    if run_etl:
        # Check if any CSV datasets exist in data/raw/
        base_dir = os.path.dirname(db_dir)
        raw_dir = os.path.join(base_dir, 'data', 'raw')
        
        # Look for any CSV file in data/raw/
        csv_files = []
        if os.path.isdir(raw_dir):
            csv_files = [f for f in os.listdir(raw_dir) if f.lower().endswith('.csv')]
        
        if csv_files:
            print(f"\n--- Triggering ETL Pipeline ({len(csv_files)} CSV file(s) found) ---")
            # Import and run ETL
            backend_dir = os.path.join(base_dir, 'backend')
            sys.path.insert(0, backend_dir)
            from etl_pipeline import run_etl_pipeline
            run_etl_pipeline(limit=etl_limit)
        else:
            print(f"""
╔══════════════════════════════════════════════════════════╗
║  ℹ  No CSV Datasets Found — Jobs Table is Empty        ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  To populate jobs, place any compatible CSV file into:   ║
║                                                          ║
║    data/raw/                                             ║
║    └── your_dataset.csv                                  ║
║                                                          ║
║  Required columns: title, description                    ║
║  Optional: company_name, location, med_salary,           ║
║            skills_desc, formatted_experience_level, etc.  ║
║                                                          ║
║  Then run: python backend/etl_pipeline.py                ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
""")
    else:
        print("\n  >> Skipped ETL pipeline (--skip-etl flag)")


if __name__ == '__main__':
    skip_etl = '--skip-etl' in sys.argv
    
    etl_limit = None
    if '--limit' in sys.argv:
        try:
            idx = sys.argv.index('--limit')
            etl_limit = int(sys.argv[idx + 1])
        except (IndexError, ValueError):
            print("Usage: python init_db.py [--skip-etl] [--limit N]")
            sys.exit(1)
    
    init_db(run_etl=not skip_etl, etl_limit=etl_limit)
