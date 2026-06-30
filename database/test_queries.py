import sqlite3
import os

def run_test():
    # File paths
    db_dir = os.path.dirname(__file__)
    db_path = os.path.join(db_dir, 'careerlens.db')
    sql_dir = os.path.join(db_dir, '..', 'sql')
    
    # Connect to the SQLite database
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Get all .sql files in the sql directory and sort them
    sql_files = sorted([f for f in os.listdir(sql_dir) if f.endswith('.sql')])
    
    print("==========================================================")
    print("          CAREERLENS AI ANALYTICS ENGINE TEST")
    print("==========================================================")
    
    for filename in sql_files:
        print(f"\n[RUNNING] {filename}")
        filepath = os.path.join(sql_dir, filename)
        
        with open(filepath, 'r', encoding='utf-8') as f:
            query = f.read()
            
        try:
            cursor.execute(query)
            rows = cursor.fetchall()
            headers = [desc[0] for desc in cursor.description]
            
            # Calculate column widths for nice tabular formatting
            col_widths = [len(h) for h in headers]
            for row in rows:
                for idx, val in enumerate(row):
                    col_widths[idx] = max(col_widths[idx], len(str(val)))
            
            # Print headers
            header_row = "  |  ".join(f"{h:<{col_widths[idx]}}" for idx, h in enumerate(headers))
            print(header_row)
            print("-" * len(header_row))
            
            # Print data rows (limiting to top 5 for dashboard preview)
            for row in rows[:5]:
                data_row = "  |  ".join(f"{str(val):<{col_widths[idx]}}" for idx, val in enumerate(row))
                print(data_row)
                
            if len(rows) > 5:
                print(f"... ({len(rows) - 5} more rows)")
                
        except Exception as e:
            print(f"[ERROR] Error executing {filename}: {e}")
            
    conn.close()

if __name__ == '__main__':
    run_test()
