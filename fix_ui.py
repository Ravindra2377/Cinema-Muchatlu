import re

with open('styles.css', 'r') as f:
    css = f.read()

# 1. Lock background
css = re.sub(
    r'\.app-shell \{ background: radial-gradient\([^)]+\), var\(--ink\); min-height: 100vh; display: flex; \}',
    r'.app-shell { background: radial-gradient(circle at 65% -20%, rgba(103, 44, 42, 0.22), transparent 36%), var(--ink); background-attachment: fixed; min-height: 100vh; display: flex; }',
    css
)

# Also let's check text alignment in .movie-info
if '.movie-info' in css:
    # Let's align text left or center depending on what it is
    pass

with open('styles.css', 'w') as f:
    f.write(css)
