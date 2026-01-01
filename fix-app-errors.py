import re

# Read the app.js file
with open('d:/OneDrive/Desktop/Movies/app.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix 1: Remove the duplicate currentUser declaration (line 284)
# Change "let currentUser = null;" to just a comment since auth.js already declares it
content = content.replace(
    'let currentUser = null;',
    '// currentUser is now declared in auth.js'
)

# Fix 2: Replace the logout event listener to use the Supabase auth function
content = content.replace(
    "document.getElementById('logoutBtn').addEventListener('click', logout);",
    "document.getElementById('logoutBtn').addEventListener('click', () => { if (window.authFunctions && window.authFunctions.signOut) window.authFunctions.signOut(); });"
)

# Write the fixed version
with open('d:/OneDrive/Desktop/Movies/app.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed app.js:")
print("1. Removed duplicate currentUser declaration")
print("2. Fixed logout button to use Supabase Auth signOut")
