import re

# Read the original app.js
with open('d:/OneDrive/Desktop/Movies/app.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Find and remove the old authentication section (lines 360-461)
# We'll replace it with a comment
pattern = r'// ============================================\r?\n// Authentication Functions\r?\n// ============================================.*?function updateUIForLoggedOutUser\(\) \{[^}]+\}'

replacement = '''// ============================================
// Authentication Functions
// ============================================
// NOTE: Authentication is now handled by auth.js using Supabase Auth
// Old localStorage-based auth functions have been removed to prevent conflicts'''

content_fixed = re.sub(pattern, replacement, content, flags=re.DOTALL)

# Also fix the init() function to not call the old initAuth
content_fixed = content_fixed.replace(
    '    initAuth();',
    '    // initAuth(); // Disabled - using Supabase Auth from auth.js\n    if (window.authFunctions && window.authFunctions.initAuth) {\n        window.authFunctions.initAuth();\n    }'
)

# Write the fixed version
with open('d:/OneDrive/Desktop/Movies/app.js', 'w', encoding='utf-8') as f:
    f.write(content_fixed)

print("Fixed app.js - removed conflicting auth functions")
