"""
Simple test to verify the backend is working.
"""

import asyncio
import sys
from pathlib import Path
import requests
import json

# Add current directory to path
sys.path.append(str(Path(__file__).parent))

async def test_backend():
    """Test the backend API endpoints."""
    
    print(" Testing Backend API")
    print("=" * 50)
    
    base_url = "http://localhost:8000"
    
    # Test 1: Health check
    print("\n1️⃣ Testing health endpoint...")
    try:
        response = requests.get(f"{base_url}/")
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.json()}")
    except Exception as e:
        print(f"    Failed to connect: {e}")
        return
    
    # Test 2: Register a user
    print("\n2️⃣ Testing user registration...")
    register_data = {
        "name": "Demo Coach",
        "email": "demo@example.com",
        "password": "DemoPass123!"
    }
    
    response = requests.post(
        f"{base_url}/api/v1/auth/register",
        json=register_data
    )
    
    print(f"   Status: {response.status_code}")
    if response.status_code == 201:
        print("    Registration successful")
    else:
        print(f"   Response: {response.text}")
    
    # Test 3: Login
    print("\n3️⃣ Testing login...")
    login_data = {
        "username": "demo@example.com",
        "password": "DemoPass123!"
    }
    
    response = requests.post(
        f"{base_url}/api/v1/auth/login",
        data=login_data
    )
    
    print(f"   Status: {response.status_code}")
    if response.status_code == 200:
        token_data = response.json()
        access_token = token_data.get("access_token")
        print("    Login successful")
        print(f"   Token received: {len(access_token)} chars")
    else:
        print(f"    Login failed: {response.text}")
        return
    
    # Test 4: Generate meal plan (main functionality)
    print("\n4️⃣ Testing meal plan generation...")
    
    headers = {"Authorization": f"Bearer {access_token}"}
    
    meal_request = {
        "goal": "fat_loss",
        "daily_calories": 1800,
        "diet_type": "vegan",
        "macros": {
            "protein": 40,
            "carbs": 30,
            "fats": 30
        },
        "client_name": "John Doe",
        "notes": "Test generation from backend"
    }
    
    print("   Sending request...")
    response = requests.post(
        f"{base_url}/api/meal-plans/generate",
        json=meal_request,
        headers=headers
    )
    
    print(f"   Status: {response.status_code}")
    if response.status_code == 201:
        result = response.json()
        print("    Meal plan generated successfully!")
        print(f"   Plan ID: {result.get('id')}")
        print(f"   Client: {result.get('client_name')}")
        print(f"   Source: {result.get('source')}")
        
        # Save to file
        with open('generated_plan.json', 'w') as f:
            json.dump(result, f, indent=2)
        print("    Saved to generated_plan.json")
        
        # Show preview
        meal_plan = result.get('meal_plan', {})
        if meal_plan:
            days = meal_plan.get('days', [])
            print(f"    Days generated: {len(days)}")
            if days:
                day1 = days[0]
                print(f"    {day1.get('day')}: {len(day1.get('meals', []))} meals")
    else:
        print(f"    Failed: {response.text}")
    
    print("\n" + "=" * 50)
    print(" Backend test completed!")
    print("\n🔗 API Documentation available at: http://localhost:8000/docs")

if __name__ == "__main__":
    print("AI Nutritionist Backend Tester")
    print("Make sure the server is running on http://localhost:8000")
    print("Press Enter to start testing...")
    input()
    
    asyncio.run(test_backend())