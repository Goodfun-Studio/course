import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix variants - narration has multi-source and 0-1 BFS content but only 2 marks
# We need to add more visual content to match the narration duration
old_variants = """['variants', 'BFS 变体', (m, dur) => {
  const p = panel(0);
  
  const title = T(p, 'BFS 的变体', { x: 800, y: 100, size: 52, weight: 600, fill: COL.chalk, anchor: 'middle', o: 0 });
  tw(title, { o: 1 }, 0, 0.6, out);
  
  const t_bidirectional = m('bidirectional');
  const variant1 = T(p, '1. 双向 BFS', { x: 400, y: 220, size: 34, fill: QUEUED, weight: 600, o: 0 });
  tw(variant1, { o: 1 }, t_bidirectional, 0.5);
  const desc1 = T(p, '从起点和终点同时搜索，相遇即找到', { x: 450, y: 280, size: 26, fill: COL.chalk, o: 0 });
  tw(desc1, { o: 1 }, t_bidirectional + 0.5, 0.5);
  
  const variant2 = T(p, '2. 多源 BFS', { x: 400, y: 360, size: 34, fill: QUEUED, weight: 600, o: 0 });
  tw(variant2, { o: 1 }, t_bidirectional + 3, 0.5);
  const desc2 = T(p, '从多个起点同时开始搜索', { x: 450, y: 420, size: 26, fill: COL.chalk, o: 0 });
  tw(desc2, { o: 1 }, t_bidirectional + 3.5, 0.5);
  
  const t_weighted = m('weighted');
  const variant3 = T(p, '3. Dijkstra 算法', { x: 400, y: 500, size: 34, fill: QUEUED, weight: 600, o: 0 });
  tw(variant3, { o: 1 }, t_weighted, 0.5);
  const desc3 = T(p, '带权图的最短路径（BFS 的加权版本）', { x: 450, y: 560, size: 26, fill: COL.chalk, o: 0 });
  tw(desc3, { o: 1 }, t_weighted + 0.5, 0.5);
  
  const variant4 = T(p, '4. 零一 BFS', { x: 400, y: 640, size: 34, fill: QUEUED, weight: 600, o: 0 });
  tw(variant4, { o: 1 }, t_weighted + 3, 0.5);
  const desc4 = T(p, '边权只有 0/1 时，用双端队列优化', { x: 450, y: 700, size: 26, fill: COL.chalk, o: 0 });
  tw(desc4, { o: 1 }, t_weighted + 3.5, 0.5);
}],"""

new_variants = """['variants', 'BFS 变体', (m, dur) => {
  const p = panel(0);
  
  const title = T(p, 'BFS 的变体', { x: 800, y: 100, size: 52, weight: 600, fill: COL.chalk, anchor: 'middle', o: 0 });
  tw(title, { o: 1 }, 0, 0.6, out);
  
  const t_bidirectional = m('bidirectional');
  const variant1 = T(p, '1. 双向 BFS', { x: 400, y: 220, size: 34, fill: QUEUED, weight: 600, o: 0 });
  tw(variant1, { o: 1 }, t_bidirectional, 0.5);
  const desc1 = T(p, '从起点和终点同时搜索，相遇即找到', { x: 450, y: 280, size: 26, fill: COL.chalk, o: 0 });
  tw(desc1, { o: 1 }, t_bidirectional + 0.5, 0.5);
  
  // Visual: bidirectional arrows
  const arrow1 = mk('line', { x1: 350, y1: 250, x2: 450, y2: 250, stroke: VISITED, 'stroke-width': 3, o: 0 }, p);
  tw(arrow1, { o: 1 }, t_bidirectional + 2, 1.0);
  const arrow2 = mk('line', { x1: 1050, y1: 250, x2: 950, y2: 250, stroke: VISITED, 'stroke-width': 3, o: 0 }, p);
  tw(arrow2, { o: 1 }, t_bidirectional + 3, 1.0);
  
  const variant2 = T(p, '2. 多源 BFS', { x: 400, y: 360, size: 34, fill: QUEUED, weight: 600, o: 0 });
  tw(variant2, { o: 1 }, t_bidirectional + 7, 0.5);
  const desc2 = T(p, '从多个起点同时开始搜索', { x: 450, y: 420, size: 26, fill: COL.chalk, o: 0 });
  tw(desc2, { o: 1 }, t_bidirectional + 7.5, 0.5);
  
  // Visual: multiple source points
  for (let i = 0; i < 3; i++) {
    const circle = mk('circle', { cx: 350 + i * 100, cy: 390, r: 8, fill: CURRENT, o: 0 }, p);
    tw(circle, { o: 1 }, t_bidirectional + 9 + i * 0.3, 0.5);
  }
  
  const t_weighted = m('weighted');
  const variant3 = T(p, '3. Dijkstra 算法', { x: 400, y: 500, size: 34, fill: QUEUED, weight: 600, o: 0 });
  tw(variant3, { o: 1 }, t_weighted, 0.5);
  const desc3 = T(p, '带权图的最短路径（BFS 的加权版本）', { x: 450, y: 560, size: 26, fill: COL.chalk, o: 0 });
  tw(desc3, { o: 1 }, t_weighted + 0.5, 0.5);
  
  // Visual: weighted edges
  const edge1 = T(p, '5', { x: 500, y: 530, size: 24, fill: PATH, weight: 700, o: 0 });
  tw(edge1, { o: 1 }, t_weighted + 2, 0.5);
  const edge2 = T(p, '3', { x: 600, y: 530, size: 24, fill: PATH, weight: 700, o: 0 });
  tw(edge2, { o: 1 }, t_weighted + 2.5, 0.5);
  
  const variant4 = T(p, '4. 零一 BFS', { x: 400, y: 640, size: 34, fill: QUEUED, weight: 600, o: 0 });
  tw(variant4, { o: 1 }, t_weighted + 8, 0.5);
  const desc4 = T(p, '边权只有 0/1 时，用双端队列优化', { x: 450, y: 700, size: 26, fill: COL.chalk, o: 0 });
  tw(desc4, { o: 1 }, t_weighted + 8.5, 0.5);
  
  // Visual: 0/1 edges
  const zero = T(p, '0', { x: 500, y: 670, size: 24, fill: VISITED, weight: 700, o: 0 });
  tw(zero, { o: 1 }, t_weighted + 10, 0.5);
  const one = T(p, '1', { x: 580, y: 670, size: 24, fill: QUEUED, weight: 700, o: 0 });
  tw(one, { o: 1 }, t_weighted + 10.5, 0.5);
  
  // Extend to fill remaining time
  tw(variant4, { s: 1.05 }, t_weighted + 18, 1.0);
  tw(variant4, { s: 1.0 }, t_weighted + 20, 1.0);
}],"""

content = content.replace(old_variants, new_variants)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed variants")
