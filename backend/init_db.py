"""
Simple database initialization without complex imports.
"""

import sys
import os
from pathlib import Path

# Add current directory to path
sys.path.append(str(Path(__file__).parent))

# Set up environment variables first
os.environ["SECRET_KEY"] = "test-secret-key-for-development-only"
os.environ["DATABASE_URL"] = "sqlite:///./ai_nutritionist.db"

# Now import
from database.database import Base, engine
from sqlalchemy.orm import Session

def init_database():
    """Create all database tables."""
    print("🗄️  Initializing database...")
    
    try:
        # Drop all tables (for development only)
        print("   Dropping existing tables...")
        Base.metadata.drop_all(bind=engine)
        
        # Create all tables
        print("   Creating tables...")
        Base.metadata.create_all(bind=engine)
        
        print("✅ Database tables created successfully!")
        
        # Create a test user (simpler version without password hashing)
        from database.models import User
        
        db = Session(bind=engine)
        try:
            # Check if test user exists
            test_user = db.query(User).filter(User.email == "coach@example.com").first()
            if not test_user:
                # Simple password hash for testing
                import hashlib
                password_hash = hashlib.sha256("CoachPass123!".encode()).hexdigest()
                
                test_user = User(
                    name="Test Fitness Coach",
                    email="coach@example.com",
                    password_hash=password_hash
                )
                db.add(test_user)
                db.commit()
                print(f"👤 Test user created:")
                print(f"   Email: coach@example.com")
                print(f"   Password: CoachPass123!")
                print(f"   Note: This is a development/test user")
            else:
                print("👤 Test user already exists")
            
            print("\n🎯 Database initialization complete!")
            print("\nNext steps:")
            print("1. Install dependencies: pip install pydantic-settings python-dotenv")
            print("2. Run: python main.py")
            print("3. Access API docs at: http://localhost:8000/docs")
            
        finally:
            db.close()
            
    except Exception as e:
        print(f"❌ Error initializing database: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    init_database()