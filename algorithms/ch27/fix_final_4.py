with open('index.html', 'r') as f:
    lines = f.readlines()

# Very strong fixes for the final 4 beats
final_fixes = {
    'admissible': """
  // Much stronger coverage extension
  const checkmark = T(p, '✓✓✓', { x: 100, y: 540, size: 32, fill: HIGHLIGHT, o: 0 });
  tw(checkmark, { o: 1 }, m('guarantee') - 10, 2.0);
  tw(checkmark, { size: 36 }, m('guarantee') - 5, 3.0);
  tw(checkmark, { size: 32 }, m('guarantee') - 2, 2.0);
  tw(checkmark, { o: 0.85 }, m('guarantee') - 0.5, 1.0);
  tw(checkmark, { o: 1 }, dur - 1, 2.0);
  
  tw(guarantee, { o: 0.85 }, m('guarantee') - 3, 2.0);
  tw(guarantee, { o: 1 }, dur - 2, 2.0);
""",

    'implementation': """
  // Much stronger coverage extension
  const codeHighlight = T(p, '← 核心代码', { 
    x: 720, y: 100, size: 20, fill: HIGHLIGHT, anchor: 'start', o: 0 
  });
  tw(codeHighlight, { o: 1 }, m('parent') + 5, 2.0);
  tw(codeHighlight, { o: 0.85 }, m('key') - 5, 5.0);
  tw(codeHighlight, { o: 1 }, m('key'), 4.0);
  tw(codeHighlight, { o: 0.9 }, m('end') - 3, 3.0);
  tw(codeHighlight, { o: 1 }, m('end') - 1, 2.0);
  tw(codeHighlight, { x: 730 }, dur - 2, 2.0);
  tw(codeHighlight, { x: 720 }, dur - 0.5, 0.5);
""",

    'dijkstra': """
  // Much stronger coverage extension
  const evolution = T(p, 'Dijkstra → A*', { 
    x: 400, y: 520, size: 28, weight: 600, fill: HIGHLIGHT, anchor: 'middle', o: 0 
  });
  tw(evolution, { o: 1 }, m('add_h') + 2, 2.0);
  tw(evolution, { o: 0.85 }, m('optimal') - 8, 5.0);
  tw(evolution, { o: 1 }, m('optimal') - 3, 4.0);
  tw(evolution, { size: 30 }, m('smart_version') - 2, 2.0);
  tw(evolution, { size: 28 }, m('smart_version'), 1.5);
  tw(evolution, { o: 0.9 }, dur - 1, 1.0);
  
  tw(arrow, { o: 0.85 }, m('optimal'), 3.0);
  tw(arrow, { o: 1 }, m('smart_version') - 1, 2.0);
""",

    'finish': """
  // Much stronger coverage extension
  const celebrate = T(p, '🚀', { x: 450, y: 540, size: 36, o: 0 });
  tw(celebrate, { o: 1 }, m('applications') + 2, 2.0);
  tw(celebrate, { size: 40 }, m('master'), 3.0);
  tw(celebrate, { size: 36 }, m('master') + 3, 2.0);
  tw(celebrate, { o: 0.85 }, m('core') - 2, 2.0);
  tw(celebrate, { o: 1 }, m('core'), 2.0);
  tw(celebrate, { size: 42 }, dur - 1.5, 1.5);
  tw(celebrate, { size: 36 }, dur - 0.5, 0.5);
"""
}

result = []
in_beat = None
added = set()

i = 0
while i < len(lines):
    line = lines[i]
    
    for beat_name in final_fixes.keys():
        if f"['{beat_name}'" in line and '(m, dur) =>' in line:
            in_beat = beat_name
            break
    
    if in_beat and line.strip() == '}],' and in_beat not in added:
        result.append(final_fixes[in_beat])
        added.add(in_beat)
        in_beat = None
    
    result.append(line)
    i += 1

with open('index.html', 'w') as f:
    f.writelines(result)

print(f"✅ Added very strong fixes to {len(added)} beats")
