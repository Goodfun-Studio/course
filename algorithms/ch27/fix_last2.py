#!/usr/bin/env python3
"""Fix heuristic and finish with proper long-lasting animations"""

import re

with open('index.html', 'r') as f:
    content = f.read()

# Replace the pulsing code in heuristic
heuristic_old = r"  // 更强的持续脉动效果  \n  const pulsing = \[gBox, hBox, fBox, principle, guide\];\n  pulsing\.forEach\(\(el, idx\) => \{[\s\S]*?\}\);"

heuristic_new = """  // 持续动画延伸到 dur*0.8+
  tw(gBox, { o: 0.9 }, m('smaller') - 10, 8.0);
  tw(gBox, { o: 1 }, m('smaller') - 2, 8.0);
  tw(hBox, { o: 0.9 }, m('smaller') - 8, 8.0);
  tw(hBox, { o: 1 }, m('smaller'), 8.0);
  tw(fBox, { o: 0.9 }, m('smaller') - 6, 8.0);
  tw(fBox, { o: 1 }, m('smaller') + 2, 6.0);
  tw(principle, { o: 0.85 }, m('smaller') - 4, 10.0);
  tw(principle, { o: 1 }, m('smaller') + 4, 6.0);
  tw(guide, { o: 0.85 }, m('smaller') - 2, 12.0);
  tw(guide, { o: 1 }, dur - 1, 4.0);"""

content = re.sub(heuristic_old, heuristic_new, content)

# Replace the code in finish - find and replace the extreme pulsing section
finish_old = r"  // 极强的持续脉动效果\n  points\.forEach.*?[\s\S]*?  tw\(core, \{ o: 1 \}, dur \* 0\.98, 0\.2\);"

finish_new = """  // 持续动画延伸到 dur*0.8+
  tw(core, { o: 0.9 }, m('master'), 6.0);
  tw(core, { o: 1 }, m('core') - 2, 6.0);
  tw(core, { o: 0.85 }, m('core'), 8.0);
  tw(core, { o: 1 }, dur - 1, 4.0);
  tw(detail1, { o: 0.9 }, m('common') + 2, 8.0);
  tw(detail1, { o: 1 }, m('applications'), 8.0);
  tw(detail1, { o: 0.85 }, m('master'), 8.0);
  tw(detail1, { o: 1 }, dur - 1, 4.0);"""

content = re.sub(finish_old, finish_new, content)

with open('index.html', 'w') as f:
    f.write(content)

print("✅ Fixed heuristic and finish with long-lasting animations")
