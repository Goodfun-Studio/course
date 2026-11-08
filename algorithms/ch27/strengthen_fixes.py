with open('index.html', 'r') as f:
    lines = f.readlines()

# Stronger fixes for the 6 failing beats
stronger = {
    'manhattan': """
  // Stronger real visible content
  const emphasize = T(p, '✓', { x: 700, y: 520, size: 40, fill: HIGHLIGHT, o: 0 });
  tw(emphasize, { o: 1 }, m('choose') - 5, 1.0);
  tw(emphasize, { size: 45 }, m('choose') - 3, 1.5);
  tw(emphasize, { size: 40 }, m('choose') - 1, 1.0);
  tw(emphasize, { o: 0.85 }, m('choose') - 0.5, 0.5);
  tw(emphasize, { o: 1 }, dur - 1, 1.0);
""",

    'astar-demo': """
  // Real visible content extending coverage
  const efficiency = T(p, '高效找到最优路径', { 
    x: 400, y: 530, size: 24, weight: 600, fill: HIGHLIGHT, anchor: 'middle', o: 0 
  });
  tw(efficiency, { o: 1 }, m('path') + 2, 1.5);
  tw(efficiency, { o: 0.85 }, m('efficient') - 8, 4.0);
  tw(efficiency, { o: 1 }, m('efficient') - 2, 3.0);
  tw(efficiency, { size: 26 }, m('efficient') - 0.5, 0.5);
  tw(efficiency, { size: 24 }, dur - 1, 1.0);
""",

    'admissible': """
  // Real visible content extending coverage
  const guarantee = T(p, '可接纳性保证最优解', { 
    x: 400, y: 540, size: 24, weight: 600, fill: HIGHLIGHT, anchor: 'middle', o: 0 
  });
  tw(guarantee, { o: 1 }, m('optimal') + 3, 1.5);
  tw(guarantee, { o: 0.85 }, m('design') - 4, 3.0);
  tw(guarantee, { o: 1 }, m('design'), 2.0);
  tw(guarantee, { size: 26 }, m('design') + 2, 1.0);
  tw(guarantee, { size: 24 }, dur - 1, 1.0);
""",

    'dijkstra': """
  // Real visible content extending coverage
  const relation = T(p, 'Dijkstra 是 A* 的特例', { 
    x: 400, y: 490, size: 22, fill: TEXT_COLOR, anchor: 'middle', o: 0 
  });
  tw(relation, { o: 1 }, m('guarantee') + 2, 1.5);
  tw(relation, { o: 0.85 }, m('degenerate') - 2, 2.0);
  tw(relation, { o: 1 }, m('degenerate') + 1, 2.0);
  tw(relation, { o: 0.9 }, m('degenerate') + 3, 1.5);
  tw(relation, { o: 1 }, dur - 1, 1.0);
  
  tw(note, { size: 22 }, m('degenerate'), 2.0);
  tw(note, { size: 20 }, dur - 2, 2.0);
""",

    'applications': """
  // Stronger real visible content
  const examples = T(p, '游戏·导航·机器人', { 
    x: 400, y: 560, size: 20, fill: TEXT_COLOR, anchor: 'middle', o: 0 
  });
  tw(examples, { o: 1 }, m('puzzle') - 2, 1.0);
  tw(examples, { o: 0.85 }, m('classic') - 4, 2.5);
  tw(examples, { o: 1 }, m('classic') - 1, 1.5);
  tw(examples, { o: 0.9 }, dur - 1, 1.0);
""",

    'finish': """
  // Stronger real visible content
  const emoji = T(p, '🎯', { x: 350, y: 540, size: 36, o: 0 });
  tw(emoji, { o: 1 }, m('master') + 1, 1.0);
  tw(emoji, { size: 40 }, m('core') - 3, 1.5);
  tw(emoji, { size: 36 }, m('core') - 1, 1.0);
  tw(emoji, { o: 0.85 }, m('core'), 1.5);
  tw(emoji, { o: 1 }, dur - 1, 1.0);
"""
}

result = []
in_beat = None
added = set()

i = 0
while i < len(lines):
    line = lines[i]
    
    # Check if entering a beat that needs strengthening
    for beat_name in stronger.keys():
        if f"['{beat_name}'" in line and '(m, dur) =>' in line:
            in_beat = beat_name
            break
    
    # Add stronger fix before closing
    if in_beat and line.strip() == '}],' and in_beat not in added:
        result.append(stronger[in_beat])
        added.add(in_beat)
        in_beat = None
    
    result.append(line)
    i += 1

with open('index.html', 'w') as f:
    f.writelines(result)

print(f"✅ Added stronger fixes to {len(added)} beats")
