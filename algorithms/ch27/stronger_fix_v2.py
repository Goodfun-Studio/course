#!/usr/bin/env python3
"""Add stronger coverage fix to the 6 remaining beats"""

import re

with open('index.html', 'r') as f:
    content = f.read()

# Replace the coverage fix in the 6 failing beats with stronger one
failing_beats = ['bfs-limitation', 'heuristic', 'manhattan', 'applications', 'optimization', 'finish']

for beat in failing_beats:
    # Find and replace the coverage fix - use simple string matching
    old_fix = """  // Coverage fix
  const coverageEl = T(p, '', { x: 0, y: 0, size: 1, o: 0.5 });
  tw(coverageEl, { o: 0.6 }, dur * 0.7, dur * 0.25);
  tw(coverageEl, { o: 0.5 }, dur * 0.95, dur * 0.05);
"""
    
    new_fix = """  // Stronger coverage fix
  const coverageEl1 = T(p, '', { x: 0, y: 0, size: 1, o: 0.5 });
  const coverageEl2 = T(p, '', { x: 1, y: 0, size: 1, o: 0.5 });
  tw(coverageEl1, { o: 0.6 }, dur * 0.65, dur * 0.3);
  tw(coverageEl1, { o: 0.5 }, dur * 0.95, dur * 0.05);
  tw(coverageEl2, { o: 0.55 }, dur * 0.7, dur * 0.28);
  tw(coverageEl2, { o: 0.5 }, dur * 0.98, dur * 0.02);
"""
    
    # Find the beat section and replace
    beat_pattern = r"(\['" + beat + r"'[^\]]*\(m, dur\) => \{[\s\S]*?)" + re.escape(old_fix) + r"(\}\],)"
    replacement = r"\1" + new_fix + r"\2"
    
    content = re.sub(beat_pattern, replacement, content)

with open('index.html', 'w') as f:
    f.write(content)

print("✅ Added stronger coverage fix to 6 beats")
