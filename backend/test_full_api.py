"""
Complete test of the AI Nutritionist API.
"""

import requests
import json
import time

BASE_URL = "http://localhost:8001"

def test_all_endpoints():
    print("🧪 COMPLETE AI NUTRITIONIST API TEST")
    print("=" * 60)
    
    # Test 1: Health check
    print("\n1️⃣ Testing root endpoint...")
    response = requests.get(f"{BASE_URL}/")
    print(f"   Status: {response.status_code}")
    print(f"   Response: {json.dumps(response.json(), indent=2)}")
    
    # Test 2: Check if docs are available
    print("\n2️⃣ Checking API documentation...")
    try:
        response = requests.get(f"{BASE_URL}/docs")
        if response.status_code == 200:
            print("   ✅ Swagger docs available at http://localhost:8001/docs")
        else:
            print("   ❌ Docs not available")
    except:
        print("   ❌ Could not access docs")
    
    # Test 3: Register a user
    print("\n3️⃣ Testing user registration...")
    register_data = {
        "name": "Fitness Coach",
        "email": "coach@example.com",
        "password": "CoachPass123!"
    }
    
    response = requests.post(
        f"{BASE_URL}/api/v1/auth/register",
        json=register_data
    )
    
    print(f"   Status: {response.status_code}")
    if response.status_code in [200, 201]:
        print("   ✅ Registration successful")
        user_data = response.json()
        print(f"   User ID: {user_data.get('id')}")
    else:
        print(f"   Response: {response.text}")
        # Try login if user already exists
        print("   Trying login instead...")
    
    # Test 4: Login
    print("\n4️⃣ Testing login...")
    login_data = {
        "username": "coach@example.com",
        "password": "CoachPass123!"
    }
    
    response = requests.post(
        f"{BASE_URL}/api/v1/auth/login",
        data=login_data
    )
    
    print(f"   Status: {response.status_code}")
    if response.status_code == 200:
        token_data = response.json()
        access_token = token_data.get("access_token")
        print("   ✅ Login successful")
        print(f"   Token received ({len(access_token)} chars)")
    else:
        print(f"   ❌ Login failed: {response.text}")
        return None
    
    # Test 5: Generate meal plan (CORE FEATURE)
    print("\n5️⃣ Testing AI meal plan generation...")
    headers = {"Authorization": f"Bearer {access_token}"}
    
    meal_plan_request = {
        "goal": "fat_loss",
        "daily_calories": 1800,
        "diet_type": "vegan",
        "macros": {
            "protein": 40,
            "carbs": 30,
            "fats": 30
        },
        "client_name": "Test Client",
        "notes": "Testing the AI nutritionist"
    }
    
    print("   Sending request to AI model...")
    start_time = time.time()
    
    response = requests.post(
        f"{BASE_URL}/api/meal-plans/generate",
        json=meal_plan_request,
        headers=headers
    )
    
    elapsed_time = time.time() - start_time
    print(f"   ⏱️  Response time: {elapsed_time:.2f} seconds")
    print(f"   Status: {response.status_code}")
    
    if response.status_code == 201:
        result = response.json()
        print("   ✅ AI meal plan generated successfully!")
        print(f"   Plan ID: {result.get('id')}")
        print(f"   Client: {result.get('client_name')}")
        print(f"   Source: {result.get('source')}")
        print(f"   Calories: {result.get('target_calories')}")
        
        # Save the full response
        with open('generated_meal_plan.json', 'w') as f:
            json.dump(result, f, indent=2)
        print("   💾 Full meal plan saved to generated_meal_plan.json")
        
        # Show meal plan structure
        meal_plan = result.get('meal_plan', {})
        if meal_plan:
            days = meal_plan.get('days', [])
            print(f"   📅 7-day plan structure: {len(days)} days")
            
            if days:
                # Show first day
                day1 = days[0]
                print(f"   📅 {day1.get('day')}:")
                meals = day1.get('meals', [])
                print(f"   🍽️  {len(meals)} meals:")
                
                for i, meal in enumerate(meals[:3]):  # Show first 3 meals
                    desc = meal.get('description', '')
                    print(f"     {i+1}. {meal.get('meal')}: {desc[:50]}...")
                
                # Show grocery list
                grocery_list = result.get('grocery_list', {})
                if grocery_list:
                    print(f"   🛒 Grocery list: {len(grocery_list)} items")
                    items = list(grocery_list.items())[:5]  # First 5 items
                    for item, quantity in items:
                        print(f"     - {item}: {quantity}")
        
        return result.get('id')  # Return plan ID for next tests
    
    else:
        print(f"   ❌ Meal plan generation failed: {response.text}")
        return None
    
    return access_token

def test_more_scenarios(access_token):
    """Test different diet types and goals."""
    print("\n6️⃣ Testing different scenarios...")
    print("=" * 60)
    
    headers = {"Authorization": f"Bearer {access_token}"}
    
    scenarios = [
        {
            "name": "Keto Muscle Gain",
            "params": {
                "goal": "muscle_gain",
                "daily_calories": 2500,
                "diet_type": "keto",
                "macros": {"protein": 35, "carbs": 5, "fats": 60}
            }
        },
        {
            "name": "Vegetarian Maintenance",
            "params": {
                "goal": "maintenance",
                "daily_calories": 2000,
                "diet_type": "vegetarian",
                "macros": {"protein": 30, "carbs": 50, "fats": 20}
            }
        },
        {
            "name": "High Protein Fat Loss",
            "params": {
                "goal": "fat_loss",
                "daily_calories": 1500,
                "diet_type": "balanced",
                "macros": {"protein": 50, "carbs": 30, "fats": 20}
            }
        }
    ]
    
    for scenario in scenarios:
        print(f"\n📋 Testing: {scenario['name']}")
        
        request_data = scenario['params'].copy()
        request_data["client_name"] = f"Client - {scenario['name']}"
        request_data["notes"] = f"Test: {scenario['name']}"
        
        try:
            response = requests.post(
                f"{BASE_URL}/api/meal-plans/generate",
                json=request_data,
                headers=headers,
                timeout=30
            )
            
            if response.status_code == 201:
                result = response.json()
                print(f"   ✅ Generated successfully")
                print(f"   Source: {result.get('source')}")
                
                # Quick validation
                meal_plan = result.get('meal_plan', {})
                if meal_plan.get('days'):
                    print(f"   📅 Days: {len(meal_plan['days'])}")
                
                # Check for diet violations
                if "vegan" in request_data['diet_type'].lower():
                    plan_text = json.dumps(result).lower()
                    forbidden = ["chicken", "beef", "egg", "milk"]
                    violations = [f for f in forbidden if f in plan_text]
                    if violations:
                        print(f"   ⚠️  Possible violations: {violations}")
            else:
                print(f"   ❌ Failed: {response.status_code}")
                
        except Exception as e:
            print(f"   ❌ Error: {str(e)}")

def test_pdf_export(access_token, plan_id):
    """Test PDF export functionality."""
    print("\n7️⃣ Testing PDF export...")
    
    headers = {"Authorization": f"Bearer {access_token}"}
    
    try:
        response = requests.get(
            f"{BASE_URL}/api/meal-plans/{plan_id}/export/pdf",
            headers=headers,
            stream=True
        )
        
        if response.status_code == 200:
            # Save PDF
            with open('exported_meal_plan.pdf', 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            
            print("   ✅ PDF exported successfully!")
            print("   💾 Saved as exported_meal_plan.pdf")
            print("   📄 File size:", len(response.content), "bytes")
        else:
            print(f"   ❌ PDF export failed: {response.status_code}")
            print(f"   Response: {response.text[:200]}")
            
    except Exception as e:
        print(f"   ❌ Error exporting PDF: {str(e)}")

if __name__ == "__main__":
    print("🚀 Starting complete API test...")
    print("Make sure server is running at http://localhost:8001")
    print("-" * 60)
    
    try:
        # Test main endpoints
        plan_id = test_all_endpoints()
        
        if plan_id:
            # Get token again for additional tests
            login_data = {
                "username": "coach@example.com",
                "password": "CoachPass123!"
            }
            response = requests.post(
                f"{BASE_URL}/api/v1/auth/login",
                data=login_data
            )
            
            if response.status_code == 200:
                access_token = response.json().get("access_token")
                
                # Test more scenarios
                test_more_scenarios(access_token)
                
                # Test PDF export
                test_pdf_export(access_token, plan_id)
        
        print("\n" + "=" * 60)
        print("🎉 TEST COMPLETE!")
        print("\n📋 Generated Files:")
        print("   - generated_meal_plan.json (Full meal plan)")
        print("   - exported_meal_plan.pdf (PDF export)")
        print("\n🔗 API Documentation: http://localhost:8001/docs")
        print("👤 Test User: coach@example.com / CoachPass123!")
        
    except requests.exceptions.ConnectionError:
        print("\n❌ Cannot connect to server!")
        print("Make sure the backend is running with:")
        print("  uvicorn main:app --reload --host 0.0.0.0 --port 8001")
    except Exception as e:
        print(f"\n❌ Test failed: {str(e)}")