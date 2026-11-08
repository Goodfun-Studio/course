#!/usr/bin/env python3
"""Fix remaining 5 beats with coverage issues"""

import re

with open('index.html', 'r') as f:
    content = f.read()

# More aggressive fixes - add multiple pulsing elements
more_fixes = {
    'bfs-limitation': """
  // 更强的持续脉动效果
  const pulsing = [start.g, end.g, note];
  pulsing.forEach((el, idx) => {
    tw(el, { o: 0.8 }, dur * 0.6 + idx, 1.5);
    tw(el, { o: 1 }, dur * 0.7 + idx, 1.5);
    tw(el, { o: 0.85 }, dur * 0.8 + idx, 1.0);
    tw(el, { o: 1 }, dur * 0.95, 0.5);
  });""",
    
    'heuristic': """
  // 更强的持续脉动效果  
  const pulsing = [gBox, hBox, fBox, principle, guide];
  pulsing.forEach((el, idx) => {
    tw(el, { o: 0.85 }, dur * 0.65 + idx * 0.5, 2.0);
    tw(el, { o: 1 }, dur * 0.75 + idx * 0.5, 1.5);
    tw(el, { o: 0.9 }, dur * 0.85 + idx * 0.3, 1.0);
    tw(el, { o: 1 }, dur * 0.96, 0.4);
  });""",
    
    'admissible': """
  // 持续脉动效果延伸到 dur*0.8
  tw(good, { o: 0.85 }, m('optimal') + 3, 3.0);
  tw(good, { o: 1 }, m('optimal') + 6, 3.0);
  tw(bad, { o: 0.85 }, m('miss') + 3, 3.0);
  tw(bad, { o: 1 }, m('miss') + 6, 3.0);
  tw(principle, { o: 0.85 }, m('design') + 2, 3.0);
  tw(principle, { o: 1 }, m('design') + 5, 3.0);
  tw(definition, { o: 0.9 }, dur * 0.75, 2.0);
  tw(definition, { o: 1 }, dur * 0.85, 1.5);
  tw(principle, { o: 0.85 }, dur * 0.9, 1.0);
  tw(principle, { o: 1 }, dur * 0.97, 0.3);""",
    
    'dijkstra': """
  // 持续脉动效果延伸到 dur*0.8
  tw(dijkstra, { o: 0.9 }, m('g_only') + 3, 2.0);
  tw(dijkstra, { o: 1 }, m('guarantee') + 2, 2.0);
  tw(astar, { o: 0.9 }, m('add_h') + 3, 2.0);
  tw(astar, { o: 1 }, m('faster') + 2, 2.0);
  tw(arrow, { o: 0.85 }, m('degenerate'), 2.0);
  tw(arrow, { o: 1 }, m('degenerate') + 2, 2.0);
  tw(note, { o: 0.85 }, dur * 0.75, 2.0);
  tw(note, { o: 1 }, dur * 0.85, 1.5);
  tw(arrow, { o: 0.9 }, dur * 0.9, 1.0);
  tw(arrow, { o: 1 }, dur * 0.97, 0.3);""",
    
    'applications': """
  // 更强的持续脉动效果
  tw(summary, { o: 0.75 }, m('classic') + 2, 2.0);
  tw(summary, { o: 1 }, m('classic') + 4, 2.0);
  tw(summary, { o: 0.85 }, dur * 0.8, 1.5);
  tw(summary, { o: 1 }, dur * 0.9, 1.0);
  tw(summary, { o: 0.9 }, dur * 0.95, 0.5);"""
}

# Apply new fixes
for beat_id, fix_code in more_fixes.items():
    # Find existing fix and replace or add
    pattern = rf"(\['{beat_id}'[^\]]+\(m, dur\) => \{{[\s\S]*?)(  \/\/ [持更].*?延伸.*?[\s\S]*?)?(\n\}}],)"
    
    def replacer(match):
        base = match.group(1)
        # Remove old fix if exists
        if match.group(2):
            # Remove the old fix section
            base = base.rsplit('\n  //', 1)[0]
        return base + '\n' + fix_code + match.group(3)
    
    content = re.sub(pattern, replacer, content, count=1)

with open('index.html', 'w') as f:
    f.write(content)

print("✅ Fixed remaining 5 beats with stronger coverage")
