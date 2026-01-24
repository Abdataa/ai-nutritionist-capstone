"""
Quick check to see what endpoints are registered.
"""

import sys
from pathlib import Path

# Add current directory
sys.path.append(str(Path(__file__).parent))

from fastapi import FastAPI
import uvicorn
from fastapi.routing import APIRoute

# Create a minimal app to test
app = FastAPI()

# Try to import and include routers
print("🔍 Checking available routers...")

routers_to_check = ["auth", "mealplan", "pdf", "clients"]

for router_name in routers_to_check:
    try:
        module = __import__(f"routers.{router_name}", fromlist=[router_name])
        router = getattr(module, "router", None)
        if router:
            app.include_router(router)
            print(f"✅ {router_name} router found and included")
        else:
            print(f"❌ {router_name} router not found in module")
    except ImportError as e:
        print(f"❌ Could not import {router_name}: {e}")
    except Exception as e:
        print(f"⚠️ Error with {router_name}: {e}")

# List all routes
@app.get("/")
def root():
    return {"message": "Router check"}

if __name__ == "__main__":
    print("\n📋 Registered routes:")
    for route in app.routes:
        if isinstance(route, APIRoute):
            print(f"  {route.methods} {route.path}")
    
    print("\n🚀 Starting server to test...")
    print("Open http://localhost:8001/docs to see available endpoints")
    
    uvicorn.run(app, host="0.0.0.0", port=8001)