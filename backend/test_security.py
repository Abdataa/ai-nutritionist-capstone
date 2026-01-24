"""
Test security module functionality.
"""

import sys
from pathlib import Path

# Add project root
sys.path.append(str(Path(__file__).parent))

print("🔒 Testing Security Module")
print("=" * 50)

try:
    from core.security import (
        get_password_hash,
        verify_password,
        create_access_token,
        get_current_user,
        get_current_active_user,
        PasswordValidator
    )
    
    print("✅ All imports successful!")
    
    # Test password hashing
    print("\n🔐 Testing password hashing:")
    password = "TestPass123!"
    hashed = get_password_hash(password)
    print(f"   Password: {password}")
    print(f"   Hashed: {hashed[:30]}...")
    print(f"   Verify: {verify_password(password, hashed)}")
    
    # Test token creation
    print("\n🎫 Testing token creation:")
    token_data = {"user_id": 1, "email": "test@example.com"}
    token, expiry = create_access_token(token_data)
    print(f"   Token: {token[:50]}...")
    print(f"   Expiry: {expiry}")
    
    # Test password validator
    print("\n📋 Testing password validator:")
    validator = PasswordValidator()
    is_valid, errors = validator.comprehensive_validate("Weak")
    print(f"   'Weak': Valid={is_valid}, Errors={errors}")
    
    is_valid, errors = validator.comprehensive_validate("StrongPass123!")
    print(f"   'StrongPass123!': Valid={is_valid}, Errors={errors}")
    
    # Check function availability
    print("\n👤 Checking auth functions:")
    print(f"   get_current_user: {get_current_user is not None}")
    print(f"   get_current_active_user: {get_current_active_user is not None}")
    
except Exception as e:
    print(f"❌ Error: {str(e)}")
    import traceback
    traceback.print_exc()

print("\n" + "=" * 50)
print("✅ Security module test complete!")