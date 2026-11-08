import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix bfs-concept - add more animations for third layer
old_concept = """['bfs-concept', 'BFS 核心思想', (m, dur) => {
  const p = panel(0);
  
  const title = T(p, '层级遍历', { x: 800, y: 100, size: 56, weight: 600, fill: COL.chalk, anchor: 'middle', o: 0 });
  tw(title, { o: 1 }, 0, 0.6, out);
  
  const t_wave = m('wave');
  const concept = T(p, '像水波一样，一圈圈向外扩散', { x: 800, y: 190, size: 32, fill: COL.dim, anchor: 'middle', o: 0 });
  tw(concept, { o: 1 }, t_wave, 0.6);
  
  // Center point
  const origin = mk('circle', { cx: 800, cy: 380, r: 15, fill: CURRENT, o: 0 }, p);
  tw(origin, { o: 1 }, t_wave + 0.5, 0.5);
  const originLabel = T(p, '起点', { x: 800, y: 350, size: 24, fill: COL.chalk, anchor: 'middle', o: 0 });
  tw(originLabel, { o: 1 }, t_wave + 0.5, 0.5);
  
  // Layer 1
  const t_first = m('first');
  const layer1Label = T(p, '第一层：邻居', { x: 400, y: 460, size: 28, fill: QUEUED, o: 0 });
  tw(layer1Label, { o: 1 }, t_first, 0.5);
  for (let i = 0; i < 4; i++) {
    const angle = i * Math.PI / 2;
    const x = 800 + Math.cos(angle) * 120;
    const y = 380 + Math.sin(angle) * 120;
    const node = mk('circle', { cx: x, cy: y, r: 12, fill: QUEUED, o: 0 }, p);
    tw(node, { o: 1 }, t_first + 0.3 + i * 0.1, 0.4);
  }
  
  // Layer 2
  const t_second = m('second');
  const layer2Label = T(p, '第二层：邻居的邻居', { x: 400, y: 530, size: 28, fill: VISITED, o: 0 });
  tw(layer2Label, { o: 1 }, t_second, 0.5);
  for (let i = 0; i < 8; i++) {
    const angle = i * Math.PI / 4;
    const x = 800 + Math.cos(angle) * 200;
    const y = 380 + Math.sin(angle) * 200;
    const node = mk('circle', { cx: x, cy: y, r: 10, fill: VISITED, o: 0 }, p);
    tw(node, { o: 1 }, t_second + 0.3 + i * 0.08, 0.4);
  }
  
  const t_level = m('level');
  const key = T(p, '同一层的节点，距离起点的步数相同', { x: 800, y: 680, size: 30, fill: PATH, anchor: 'middle', o: 0 });
  tw(key, { o: 1 }, t_level, 0.7);
}],"""

new_concept = """['bfs-concept', 'BFS 核心思想', (m, dur) => {
  const p = panel(0);
  
  const title = T(p, '层级遍历', { x: 800, y: 100, size: 56, weight: 600, fill: COL.chalk, anchor: 'middle', o: 0 });
  tw(title, { o: 1 }, 0, 0.6, out);
  
  const t_wave = m('wave');
  const concept = T(p, '像水波一样，一圈圈向外扩散', { x: 800, y: 190, size: 32, fill: COL.dim, anchor: 'middle', o: 0 });
  tw(concept, { o: 1 }, t_wave, 0.6);
  
  // Center point
  const origin = mk('circle', { cx: 800, cy: 380, r: 15, fill: CURRENT, o: 0 }, p);
  tw(origin, { o: 1 }, t_wave + 0.5, 0.5);
  const originLabel = T(p, '起点', { x: 800, y: 350, size: 24, fill: COL.chalk, anchor: 'middle', o: 0 });
  tw(originLabel, { o: 1 }, t_wave + 0.5, 0.5);
  
  // Layer 1
  const t_first = m('first');
  const layer1Label = T(p, '第一层：邻居', { x: 400, y: 460, size: 28, fill: QUEUED, o: 0 });
  tw(layer1Label, { o: 1 }, t_first, 0.5);
  for (let i = 0; i < 4; i++) {
    const angle = i * Math.PI / 2;
    const x = 800 + Math.cos(angle) * 120;
    const y = 380 + Math.sin(angle) * 120;
    const node = mk('circle', { cx: x, cy: y, r: 12, fill: QUEUED, o: 0 }, p);
    tw(node, { o: 1 }, t_first + 0.3 + i * 0.1, 0.4);
  }
  
  // Layer 2
  const t_second = m('second');
  const layer2Label = T(p, '第二层：邻居的邻居', { x: 400, y: 530, size: 28, fill: VISITED, o: 0 });
  tw(layer2Label, { o: 1 }, t_second, 0.5);
  for (let i = 0; i < 8; i++) {
    const angle = i * Math.PI / 4;
    const x = 800 + Math.cos(angle) * 200;
    const y = 380 + Math.sin(angle) * 200;
    const node = mk('circle', { cx: x, cy: y, r: 10, fill: VISITED, o: 0 }, p);
    tw(node, { o: 1 }, t_second + 0.3 + i * 0.08, 0.4);
  }
  
  const t_level = m('level');
  const key = T(p, '同一层的节点，距离起点的步数相同', { x: 800, y: 680, size: 30, fill: PATH, anchor: 'middle', o: 0 });
  tw(key, { o: 1 }, t_level, 0.7);
  
  // Add subtle animations to extend to end
  tw(key, { s: 1.05 }, t_level + 5, 1.5);
  tw(key, { s: 1.0 }, t_level + 7, 1.5);
}],"""

content = content.replace(old_concept, new_concept)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed bfs-concept")
