#!/usr/bin/env python3
"""Add even more aggressive animations to heuristic, admissible, finish"""

import re

with open('index.html', 'r') as f:
    content = f.read()

# For heuristic - add ADDITIONAL animations (don't replace)
heuristic_pattern = r"(  tw\(guide, \{ o: 1 \}, dur - 1, 4\.0\);\n)(\}\],\n\n\['astar-demo')"
heuristic_add = r"\1  // 额外的持续动画\n  tw(formula, { o: 0.9 }, dur * 0.7, 15.0);\n  tw(formula, { o: 1 }, dur * 0.95, 5.0);\n\2"
content = re.sub(heuristic_pattern, heuristic_add, content)

# For admissible - find and add more
admissible_pattern = r"(  tw\(principle, \{ o: 1 \}, dur \* 0\.97, 0\.3\);\n)(\}\],\n\n\['implementation')"
admissible_add = r"\1  // 额外的持续动画\n  tw(definition, { o: 0.85 }, dur * 0.7, 15.0);\n  tw(definition, { o: 1 }, dur * 0.9, 8.0);\n  tw(good, { o: 0.9 }, dur * 0.8, 12.0);\n  tw(good, { o: 1 }, dur * 0.97, 3.0);\n\2"
content = re.sub(admissible_pattern, admissible_add, content)

# For finish - add more
finish_pattern = r"(  tw\(detail1, \{ o: 1 \}, dur \* 0\.98, 2\.0\);\n)(\}\]\n\n\];\n)"
finish_add = r"\1  // 额外的持续动画\n  const finalPulse = [core, detail1];\n  finalPulse.forEach((el, idx) => {\n    tw(el, { o: 0.85 }, dur * 0.75 + idx, 8.0);\n    tw(el, { o: 1 }, dur * 0.9 + idx, 5.0);\n  });\n\2"
content = re.sub(finish_pattern, finish_add, content)

with open('index.html', 'w') as f:
    f.write(content)

print("✅ Added extra animations to heuristic, admissible, finish")
