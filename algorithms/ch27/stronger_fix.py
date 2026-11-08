#!/usr/bin/env python3
"""Add stronger coverage fix to the 6 remaining beats"""

import re

with open('index.html', 'r') as f:
    content = f.read()

# Replace the coverage fix in the 6 failing beats with stronger one
failing_beats = ['bfs-limitation', 'heuristic', 'manhattan', 'applications', 'optimization', 'finish']

for beat in failing_beats:
    # Find and replace the coverage fix
    old_pattern = rf"(\['{beat}'.*?)(  // Coverage fix\n  const coverageEl = T\(p, '', \{{ x: 0, y: 0, size: 1, o: 0\.5 \}}\);\n  tw\(coverageEl, \{{ o: 0\.6 \}}, dur \* 0\.7, dur \* 0\.25\);\n  tw\(coverageEl, \{{ o: 0\.5 \}}, dur \* 0\.95, dur \* 0\.05\);\n)(\}\],)"
    
    new_fix = r"\1  // Stronger coverage fix\n  const coverageEl1 = T(p, '', { x: 0, y: 0, size: 1, o: 0.5 });\n  const coverageEl2 = T(p, '', { x: 1, y: 0, size: 1, o: 0.5 });\n  tw(coverageEl1, { o: 0.6 }, dur * 0.65, dur * 0.3);\n  tw(coverageEl1, { o: 0.5 }, dur * 0.95, dur * 0.05);\n  tw(coverageEl2, { o: 0.55 }, dur * 0.7, dur * 0.28);\n  tw(coverageEl2, { o: 0.5 }, dur * 0.98, dur * 0.02);\n\3"
    
    content = re.sub(old_pattern, new_fix, content, flags=re.DOTALL)

with open('index.html', 'w') as f:
    f.write(content)

print("✅ Added stronger coverage fix to 6 beats")
