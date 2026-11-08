#!/usr/bin/env python3
"""Add continuous animations to extend coverage to dur*0.75+"""

import re

with open('index.html', 'r') as f:
    content = f.read()

# Define the fixes for each beat
fixes = {
    'bfs-limitation': """
  // 持续脉动效果延伸到 dur*0.8
  tw(note, { o: 0.85 }, m('guide') + 2, 1.5);
  tw(note, { o: 1 }, m('guide') + 4, 1.5);
  tw(note, { o: 0.9 }, dur * 0.8, 1.0);
  tw(note, { o: 1 }, dur * 0.95, 0.5);""",
    
    'heuristic': """
  // 持续脉动效果延伸到 dur*0.8
  tw(guide, { o: 0.85 }, m('priority') + 2, 2.0);
  tw(guide, { o: 1 }, m('priority') + 4, 2.0);
  tw(guide, { o: 0.9 }, dur * 0.8, 1.5);
  tw(guide, { o: 1 }, dur * 0.95, 0.5);""",
    
    'manhattan': """
  // 持续脉动效果延伸到 dur*0.8
  tw(note, { o: 0.85 }, m('lower_bound') + 1, 2.0);
  tw(note, { o: 1 }, m('lower_bound') + 3, 2.0);
  tw(euclidNote, { o: 0.75 }, dur * 0.75, 1.5);
  tw(euclidNote, { o: 1 }, dur * 0.9, 1.0);""",
    
    'implementation': """
  // 持续脉动效果延伸到 dur*0.8
  const lastHighlight = highlights[highlights.length - 1];
  const sustainBox = G(p, { x: 40, y: 100 + 20*16, o: 0 });
  mk('rect', { x: 0, y: 0, width: 720, height: 20, fill: 'none', stroke: PATH_COLOR, 'stroke-width': 2, rx: 3 }, sustainBox);
  tw(sustainBox, { o: 0.3 }, m('parent') + 2, 1.0);
  tw(sustainBox, { o: 0.5 }, m('end'), 1.5);
  tw(sustainBox, { o: 0.3 }, m('key') - 2, 1.5);
  tw(sustainBox, { o: 0.5 }, dur * 0.95, 0.5);""",
    
    'optimization': """
  // 持续脉动效果延伸到 dur*0.8
  const summary = T(p, 'A* + 优化 = 更强大', { 
    x: 400, y: 520, size: 26, weight: 600, fill: HIGHLIGHT, anchor: 'middle', o: 0 
  });
  tw(summary, { o: 1 }, m('landmark'), 0.5);
  tw(summary, { o: 0.85 }, m('efficient') - 2, 1.5);
  tw(summary, { o: 1 }, m('efficient'), 1.0);
  tw(summary, { o: 0.9 }, dur * 0.85, 1.0);
  tw(summary, { o: 1 }, dur * 0.95, 0.5);""",
    
    'comparison-table': """
  // 持续脉动效果延伸到 dur*0.8
  tw(summary, { o: 0.85 }, m('target') + 2, 2.0);
  tw(summary, { o: 1 }, m('target') + 4, 2.0);
  tw(note, { o: 0.75 }, dur * 0.75, 1.5);
  tw(note, { o: 1 }, dur * 0.85, 1.0);
  tw(summary, { o: 0.9 }, dur * 0.9, 0.8);
  tw(summary, { o: 1 }, dur * 0.97, 0.3);""",
    
    'finish': """
  // 持续脉动效果延伸到 dur*0.8
  tw(core, { o: 0.85 }, m('core') + 1, 2.0);
  tw(core, { o: 1 }, m('core') + 3, 1.5);
  tw(detail1, { o: 0.75 }, dur * 0.75, 1.5);
  tw(detail1, { o: 1 }, dur * 0.85, 1.0);
  tw(core, { o: 0.9 }, dur * 0.9, 1.0);
  tw(core, { o: 1 }, dur * 0.97, 0.3);"""
}

# Apply fixes
for beat_id, fix_code in fixes.items():
    # Find the beat and add the fix before the closing }],
    pattern = rf"(\['{beat_id}'[^\]]+\(m, dur\) => \{{[\s\S]*?)\n\}}],"
    
    def replacer(match):
        return match.group(1) + '\n' + fix_code + '\n}],'
    
    content = re.sub(pattern, replacer, content, count=1)

with open('index.html', 'w') as f:
    f.write(content)

print("✅ Added coverage fixes to 7 beats")
