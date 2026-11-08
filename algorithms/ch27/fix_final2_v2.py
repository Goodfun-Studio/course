#!/usr/bin/env python3
"""Fix astar-demo and finish with animations starting earlier"""

import re

with open('index.html', 'r') as f:
    content = f.read()

# Fix astar-demo - replace the pulsing section
astar_old = r"  // 持续脉动效果延伸到 dur\*0\.8\n  tw\(result.*?tw\(result, \{ o: 1 \}, dur \* 0\.97, 1\.0\);"

astar_new = """  // 持续脉动效果延伸到 dur*0.8+
  tw(result, { o: 0.9 }, m('efficient') - 20, 15.0);
  tw(result, { o: 1 }, m('efficient') - 5, 15.0);
  tw(legend, { o: 0.85 }, m('efficient') - 15, 20.0);
  tw(legend, { o: 1 }, m('efficient') + 5, 15.0);
  tw(result, { o: 0.95 }, dur * 0.85, 10.0);
  tw(result, { o: 1 }, dur * 0.98, 2.0);"""

content = re.sub(astar_old, astar_new, content, flags=re.DOTALL)

# Fix finish - replace the pulsing section  
finish_old = r"  // 持续动画延伸到 dur\*0\.8\+\n  tw\(core.*?tw\(detail1, \{ o: 1 \}, dur - 1, 4\.0\);"

finish_new = """  // 持续动画延伸到 dur*0.8+
  tw(core, { o: 0.9 }, m('applications'), 10.0);
  tw(core, { o: 1 }, m('master'), 8.0);
  tw(core, { o: 0.85 }, m('core') - 2, 10.0);
  tw(core, { o: 1 }, dur * 0.95, 5.0);
  tw(detail1, { o: 0.85 }, m('applications') + 2, 10.0);
  tw(detail1, { o: 1 }, m('master') + 2, 8.0);
  tw(detail1, { o: 0.9 }, m('core'), 8.0);
  tw(detail1, { o: 1 }, dur * 0.98, 2.0);"""

content = re.sub(finish_old, finish_new, content, flags=re.DOTALL)

with open('index.html', 'w') as f:
    f.write(content)

print("✅ Fixed astar-demo and finish")
