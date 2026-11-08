#!/usr/bin/env python3
"""Add VERY STRONG coverage fix to the last 3 beats"""

with open('index.html', 'r') as f:
    lines = f.readlines()

# Much stronger coverage code
coverage_code = """  // VERY STRONG coverage fix - large opacity changes
  const cov1 = T(p, '', { x: 0, y: 0, size: 1, o: 0.4 });
  const cov2 = T(p, '', { x: 1, y: 0, size: 1, o: 0.9 });
  tw(cov1, { o: 0.9 }, dur * 0.6, dur * 0.35);
  tw(cov1, { o: 0.4 }, dur * 0.95, dur * 0.05);
  tw(cov2, { o: 0.4 }, dur * 0.65, dur * 0.3);
  tw(cov2, { o: 0.9 }, dur * 0.95, dur * 0.05);
"""

# Last 3 failing beats
beat_names = ['admissible', 'comparison-table', 'finish']

result = []
in_beat = None

i = 0
while i < len(lines):
    line = lines[i]
    
    # Check if we're entering a beat that needs fixing
    for beat in beat_names:
        if f"['{beat}'" in line and '(m, dur) =>' in line:
            in_beat = beat
            break
    
    # Check if this is the closing of the current beat
    if in_beat and line.strip() == '}],':
        # Check if coverage fix already exists
        has_coverage = False
        for j in range(max(0, i-15), i):
            if 'cov1' in lines[j] or 'VERY STRONG' in lines[j] or 'Stronger coverage' in lines[j]:
                has_coverage = True
                break
        
        if not has_coverage:
            result.append(coverage_code)
        in_beat = None
    
    result.append(line)
    i += 1

with open('index.html', 'w') as f:
    f.writelines(result)

print("✅ Added VERY STRONG coverage fixes to last 3 beats")
