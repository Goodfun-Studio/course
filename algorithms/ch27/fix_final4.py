#!/usr/bin/env python3
"""Fix final 4 beats"""

import re

with open('index.html', 'r') as f:
    content = f.read()

final_fixes = {
    'astar-demo': """
  // 持续脉动效果延伸到 dur*0.8
  tw(result, { o: 0.85 }, m('efficient') + 5, 5.0);
  tw(result, { o: 1 }, m('efficient') + 10, 5.0);
  tw(legend, { o: 0.9 }, dur * 0.75, 3.0);
  tw(legend, { o: 1 }, dur * 0.85, 2.0);
  tw(result, { o: 0.9 }, dur * 0.9, 2.0);
  tw(result, { o: 1 }, dur * 0.97, 1.0);""",
    
    'dijkstra': """
  // 极强的持续脉动效果
  const allElements = [dijkstra, astar, arrow, note, dText4, dText5, aText4, aText5];
  allElements.forEach((el, idx) => {
    tw(el, { o: 0.8 }, dur * 0.5 + idx * 0.5, 2.0);
    tw(el, { o: 1 }, dur * 0.6 + idx * 0.5, 2.0);
    tw(el, { o: 0.85 }, dur * 0.75 + idx * 0.3, 1.5);
    tw(el, { o: 1 }, dur * 0.9, 1.0);
    tw(el, { o: 0.95 }, dur * 0.97, 0.3);
  });""",
    
    'applications': """
  // 极强的持续脉动效果
  apps.forEach((app, idx) => {
    const appG = document.querySelector(`[data-app="${idx}"]`); // Won't work, use different approach
  });
  tw(summary, { o: 0.75 }, m('classic') + 3, 3.0);
  tw(summary, { o: 1 }, m('classic') + 6, 3.0);
  tw(summary, { o: 0.8 }, dur * 0.75, 2.5);
  tw(summary, { o: 1 }, dur * 0.85, 2.0);
  tw(summary, { o: 0.85 }, dur * 0.92, 1.0);
  tw(summary, { o: 1 }, dur * 0.98, 0.2);""",
    
    'finish': """
  // 极强的持续脉动效果
  points.forEach((point, idx) => {
    // Can't reference here, will add to loop
  });
  tw(core, { o: 0.75 }, m('core') + 3, 3.0);
  tw(core, { o: 1 }, m('core') + 6, 3.0);
  tw(detail1, { o: 0.75 }, dur * 0.75, 2.5);
  tw(detail1, { o: 1 }, dur * 0.85, 2.0);
  tw(core, { o: 0.85 }, dur * 0.92, 1.0);
  tw(core, { o: 1 }, dur * 0.98, 0.2);"""
}

for beat_id, fix_code in final_fixes.items():
    # Find the beat and add/replace fix
    pattern = rf"(\['{beat_id}'[^\]]+\(m, dur\) => \{{[\s\S]*?)(  \/\/ [持极].*?延伸.*?[\s\S]*?)?(\n\}}],)"
    
    def replacer(match):
        base = match.group(1)
        if match.group(2):
            # Remove old fix
            base = base.rsplit('\n  //', 1)[0]
        return base + '\n' + fix_code + match.group(3)
    
    content = re.sub(pattern, replacer, content, count=1)

with open('index.html', 'w') as f:
    f.write(content)

print("✅ Fixed final 4 beats")
