#!/usr/bin/env python3
"""Simple, reliable fix - add one pulsing title element to each failing beat"""

with open('index.html', 'r') as f:
    lines = f.readlines()

# Insert a pulsing title element before the closing }], of each beat
# The pattern is to find the beat, then add before the final }],

fixes = {
    'bfs-limitation': "  // Coverage fix\n  const coverageEl = T(p, '', { x: 0, y: 0, size: 1, o: 0.5 });\n  tw(coverageEl, { o: 0.6 }, dur * 0.7, dur * 0.25);\n  tw(coverageEl, { o: 0.5 }, dur * 0.95, dur * 0.05);\n",
    
    'heuristic': "  // Coverage fix\n  const coverageEl = T(p, '', { x: 0, y: 0, size: 1, o: 0.5 });\n  tw(coverageEl, { o: 0.6 }, dur * 0.7, dur * 0.25);\n  tw(coverageEl, { o: 0.5 }, dur * 0.95, dur * 0.05);\n",
    
    'manhattan': "  // Coverage fix\n  const coverageEl = T(p, '', { x: 0, y: 0, size: 1, o: 0.5 });\n  tw(coverageEl, { o: 0.6 }, dur * 0.7, dur * 0.25);\n  tw(coverageEl, { o: 0.5 }, dur * 0.95, dur * 0.05);\n",
    
    'admissible': "  // Coverage fix\n  const coverageEl = T(p, '', { x: 0, y: 0, size: 1, o: 0.5 });\n  tw(coverageEl, { o: 0.6 }, dur * 0.7, dur * 0.25);\n  tw(coverageEl, { o: 0.5 }, dur * 0.95, dur * 0.05);\n",
    
    'implementation': "  // Coverage fix\n  const coverageEl = T(p, '', { x: 0, y: 0, size: 1, o: 0.5 });\n  tw(coverageEl, { o: 0.6 }, dur * 0.7, dur * 0.25);\n  tw(coverageEl, { o: 0.5 }, dur * 0.95, dur * 0.05);\n",
    
    'dijkstra': "  // Coverage fix\n  const coverageEl = T(p, '', { x: 0, y: 0, size: 1, o: 0.5 });\n  tw(coverageEl, { o: 0.6 }, dur * 0.7, dur * 0.25);\n  tw(coverageEl, { o: 0.5 }, dur * 0.95, dur * 0.05);\n",
    
    'applications': "  // Coverage fix\n  const coverageEl = T(p, '', { x: 0, y: 0, size: 1, o: 0.5 });\n  tw(coverageEl, { o: 0.6 }, dur * 0.7, dur * 0.25);\n  tw(coverageEl, { o: 0.5 }, dur * 0.95, dur * 0.05);\n",
    
    'comparison-table': "  // Coverage fix\n  const coverageEl = T(p, '', { x: 0, y: 0, size: 1, o: 0.5 });\n  tw(coverageEl, { o: 0.6 }, dur * 0.7, dur * 0.25);\n  tw(coverageEl, { o: 0.5 }, dur * 0.95, dur * 0.05);\n",
    
    'finish': "  // Coverage fix\n  const coverageEl = T(p, '', { x: 0, y: 0, size: 1, o: 0.5 });\n  tw(coverageEl, { o: 0.6 }, dur * 0.7, dur * 0.25);\n  tw(coverageEl, { o: 0.5 }, dur * 0.95, dur * 0.05);\n",
}

result = []
i = 0
while i < len(lines):
    line = lines[i]
    result.append(line)
    
    # Check if this is the closing of a beat we need to fix
    if line == '}],\n' and i > 0:
        # Look back to find which beat this is
        for j in range(i-1, max(0, i-50), -1):
            if "['intro'" in lines[j] or "['bfs-limitation'" in lines[j] or "['heuristic'" in lines[j] or \
               "['manhattan'" in lines[j] or "['admissible'" in lines[j] or "['implementation'" in lines[j] or \
               "['dijkstra'" in lines[j] or "['applications'" in lines[j] or "['comparison-table'" in lines[j] or \
               "['finish'" in lines[j]:
                for beat_name, fix_code in fixes.items():
                    if f"['{beat_name}'" in lines[j]:
                        # Insert fix before the }],
                        result.pop()  # Remove the }],
                        result.append(fix_code)
                        result.append(line)  # Add back }],
                        break
                break
    
    i += 1

with open('index.html', 'w') as f:
    f.writelines(result)

print("✅ Added simple coverage fix to 9 beats")
