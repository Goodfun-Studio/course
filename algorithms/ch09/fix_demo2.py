#!/usr/bin/env python3
import re

with open('index.html', 'r') as f:
    content = f.read()

# 找到 demo_k1 的起始位置
start = content.find("['demo_k1',")
end = start
bracket_count = 0
in_beat = False
for i in range(start, len(content)):
    if content[i] == '[' and not in_beat:
        in_beat = True
        bracket_count = 1
    elif in_beat:
        if content[i:i+2] == '],':
            bracket_count -= 1
            if bracket_count == 0:
                end = i + 2
                break

old_beat = content[start:end]

# 新版本：使用绝对时间
new_beat = """['demo_k1', 'Floyd-Warshall 演示：k = 1 (B)', (m, dur) => {
  const p = stage(m);
  
  const title = T(p, '迭代：k = 1（中转点 B）', {
    x: W/2, y: 80, size: 28, fill: COL.chalk, weight: 700, anchor: 'middle', o: 0
  });
  tw(title, { o: 1 }, 0.5, 0.7);
  
  const graph = drawGraph(p);
  tw(graph, { o: 1 }, 0.8, 0.6);
  
  const nodeKeys = Object.keys(NODES);
  const dist = {};
  nodeKeys.forEach(i => {
    dist[i] = {};
    nodeKeys.forEach(j => {
      if (i === j) {
        dist[i][j] = 0;
      } else {
        const edge = EDGES.find(e => e.from === i && e.to === j);
        dist[i][j] = edge ? edge.weight : Infinity;
      }
    });
  });
  dist['D']['B'] = 11;
  
  const matrix = drawDistanceMatrix(p, dist);
  tw(matrix, { o: 1 }, 1.5, 0.6);
  
  const nodeB = graph._nodeElements['B'];
  tw(nodeB.circle, { fill: CURRENT }, 2.5, 0.4);
  tw(nodeB.circle, { r: 35 }, 2.5, 0.3, out);
  tw(nodeB.circle, { r: 30 }, 2.8, 0.3, io);
  tw(nodeB.circle, { stroke: PRIMARY, 'stroke-width': 5 }, 2.5, 0.4);
  tw(nodeB.circle, { opacity: 0.9 }, 2.5, 0.3);
  
  // 检查多个点对，使用绝对时间
  const pairs = [
    { i: 'A', j: 'C', t: 3.7, update: true },
    { i: 'A', j: 'D', t: 5.3, update: false },
    { i: 'A', j: 'E', t: 6.1, update: false },
    { i: 'C', j: 'D', t: 6.9, update: true },
    { i: 'C', j: 'E', t: 8.5, update: false },
    { i: 'D', j: 'C', t: 9.3, update: false },
    { i: 'D', j: 'E', t: 10.1, update: false },
    { i: 'E', j: 'A', t: 10.9, update: false },
    { i: 'E', j: 'C', t: 11.7, update: false },
    { i: 'E', j: 'D', t: 12.5, update: false }
  ];
  
  pairs.forEach(pair => {
    const key = `${pair.i}-${pair.j}`;
    const cell = matrix._cells[key];
    const t = pair.t;
    
    tw(cell.rect, { fill: CELL_CHECKING }, t, 0.25);
    tw(cell.rect, { stroke: PRIMARY, 'stroke-width': 3 }, t, 0.25);
    tw(cell.text, { s: 1.2 }, t, 0.2, out);
    tw(cell.text, { fill: CURRENT }, t, 0.2);
    
    if (pair.update) {
      const cellIB = matrix._cells[`${pair.i}-B`];
      const cellBJ = matrix._cells[`B-${pair.j}`];
      
      tw(cellIB.rect, { fill: '#fff3e0', stroke: SECONDARY, 'stroke-width': 2 }, t + 0.3, 0.3);
      tw(cellBJ.rect, { fill: '#fff3e0', stroke: SECONDARY, 'stroke-width': 2 }, t + 0.3, 0.3);
      tw(cellIB.text, { fill: SECONDARY }, t + 0.3, 0.2);
      tw(cellBJ.text, { fill: SECONDARY }, t + 0.3, 0.2);
      
      const viaBDist = dist[pair.i]['B'] + dist['B'][pair.j];
      if (viaBDist < dist[pair.i][pair.j]) {
        dist[pair.i][pair.j] = viaBDist;
        updateMatrixCell(matrix._cells, pair.i, pair.j, viaBDist, t + 0.7);
        
        tw(cellIB.rect, { fill: CELL_INIT, stroke: '#bdc3c7', 'stroke-width': 2 }, t + 1.2, 0.3);
        tw(cellBJ.rect, { fill: CELL_INIT, stroke: '#bdc3c7', 'stroke-width': 2 }, t + 1.2, 0.3);
        tw(cellIB.text, { fill: '#2c3e50' }, t + 1.2, 0.2);
        tw(cellBJ.text, { fill: '#2c3e50' }, t + 1.2, 0.2);
      }
    } else {
      tw(cell.rect, { fill: CELL_INIT }, t + 0.4, 0.25);
      tw(cell.rect, { stroke: '#bdc3c7', 'stroke-width': 2 }, t + 0.4, 0.25);
      tw(cell.text, { s: 1 }, t + 0.4, 0.2, io);
      tw(cell.text, { fill: '#2c3e50' }, t + 0.4, 0.2);
    }
  });
  
  tw(nodeB.circle, { fill: VISITED }, 13.5, 0.5);
  tw(nodeB.circle, { stroke: '#2c3e50', 'stroke-width': 3 }, 13.5, 0.5);
  tw(nodeB.circle, { opacity: 1 }, 13.5, 0.3);
  
  const hint = T(p, 'A→C 和 C→D 通过 B 找到路径', {
    x: W/2, y: 650, size: 20, fill: PRIMARY, anchor: 'middle', o: 0
  });
  tw(hint, { o: 1 }, 14, 0.7);
}]"""

content = content[:start] + new_beat + content[end:]

with open('index.html', 'w') as f:
    f.write(content)

print("✅ 已增强 demo_k1（使用绝对时间）")
