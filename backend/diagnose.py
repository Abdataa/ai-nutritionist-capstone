"""
Diagnose the API setup.
"""

import sys
from pathlib import Path
import os

# Add project root
sys.path.append(str(Path(__file__).parent))

print("🔧 DIAGNOSING API SETUP")
print("=" * 50)

# Check directory structure
print("\n📁 Directory structure:")
for item in os.listdir("."):
    if os.path.isdir(item):
        print(f"  📂 {item}/")
    elif item.endswith(".py"):
        print(f"  📄 {item}")

# Check routers directory
print("\n📁 Checking routers directory:")
if os.path.exists("routers"):
    print("  ✅ routers/ exists")
    for item in os.listdir("routers"):
        print(f"    📄 {item}")
else:
    print("  ❌ routers/ directory not found!")

# Try to import
print("\n🔍 Trying imports:")

try:
    from main import app
    print("  ✅ main.py imports successfully")
except Exception as e:
    print(f"  ❌ Error importing main.py: {e}")

try:
    import routers
    print("  ✅ routers package imports successfully")
    
    # Check individual routers
    for router in ["auth", "mealplan", "pdf", "clients"]:
        try:
            module = __import__(f"routers.{router}", fromlist=[router])
            print(f"    ✅ routers.{router} exists")
        except ImportError:
            print(f"    ❌ routers.{router} does not exist")
            
except ImportError as e:
    print(f"  ❌ Error importing routers: {e}")

print("\n" + "=" * 50)
print("💡 Recommendations:")
print("1. Make sure you have routers/auth.py and routers/mealplan.py")
print("2. Check that main.py includes the routers")
print("3. Run: python diagnose.py to check again")