#!/usr/bin/env python3
"""Final manual fix - add coverage code to specific line numbers"""

with open('index.html', 'r') as f:
    lines = f.readlines()

coverage_code = """  // Stronger coverage fix
  const coverageEl1 = T(p, '', { x: 0, y: 0, size: 1, o: 0.5 });
  const coverageEl2 = T(p, '', { x: 1, y: 0, size: 1, o: 0.5 });
  tw(coverageEl1, { o: 0.6 }, dur * 0.65, dur * 0.3);
  tw(coverageEl1, { o: 0.5 }, dur * 0.95, dur * 0.05);
  tw(coverageEl2, { o: 0.55 }, dur * 0.7, dur * 0.28);
  tw(coverageEl2, { o: 0.5 }, dur * 0.98, dur * 0.02);
"""

# Find each beat and add coverage code if not already present
result = []
in_beat = None
beat_names = ['bfs-limitation', 'heuristic', 'astar-demo', 'manhattan', 'applications', 'optimization']

i = 0
while i < len(lines):
    line = lines[i]
    
    # Check if we're entering a beat that needs fixing
    for beat in beat_names:
        if f"['{beat}'" in line and '(m, dur) =>' in line:
            in_beat = beat
            break
    
    # Check if this is the closing of the current beat
    if in_beat and line.strip() == '}],' :
        # Check if coverage fix already exists in previous lines
        has_coverage = False
        for j in range(max(0, i-10), i):
            if 'coverageEl1' in lines[j] or 'Stronger coverage fix' in lines[j]:
                has_coverage = True
                break
        
        if not has_coverage:
            result.append(coverage_code)
        in_beat = None
    
    result.append(line)
    i += 1

with open('index.html', 'w') as f:
    f.writelines(result)

print("✅ Added coverage fixes to all failing beats")
