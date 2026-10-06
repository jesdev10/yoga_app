"""Script to verify PostgreSQL database connection and tables."""

import sys
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from sqlalchemy import create_engine, inspect, text
from app.core.config import settings

def main():
    print("=" * 60)
    print("BLISS MIND DATABASE HEALTH CHECK")
    print("=" * 60)
    
    # Hide password in output
    db_target = settings.database_url.split("@")[-1] if "@" in settings.database_url else settings.database_url
    print(f"Connecting to: {db_target} ...")
    
    try:
        engine = create_engine(settings.database_url)
        with engine.connect() as conn:
            print("Status: [CONNECTED SUCCESSFULLY]\n")
            
            # 1. Check Tables
            inspector = inspect(engine)
            tables = sorted(inspector.get_table_names())
            print(f"Total tables found ({len(tables)}):")
            for t in tables:
                print(f"  - {t}")
            
            # 2. Check Session Types Seed Data
            if "session_types" in tables:
                rows = conn.execute(text("SELECT session_type_id, name FROM session_types ORDER BY session_type_id;")).fetchall()
                print(f"\nSample Session Types ({len(rows)} seeded):")
                for r in rows:
                    print(f"  [{r[0]}] {r[1]}")
            
            print("\n" + "=" * 60)
            print("RESULT: Your PostgreSQL database is active and working perfectly!")
            print("=" * 60)
            
    except Exception as exc:
        print("\nStatus: [CONNECTION FAILED]")
        print(f"Error details: {exc}")
        sys.exit(1)

if __name__ == "__main__":
    main()
