#!/usr/bin/env python3
import re

with open('index.html', 'r') as f:
    content = f.read()

# 找到 demo_k0
start = content.find("['demo_k0',")
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

new_beat = """['demo_k0', 'Floyd-Warshall 演示：k = 0 (A)', (m, dur) => {
  const p = stage(m);
  
  const title = T(p, '迭代：k = 0（中转点 A）', {
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
  
  const matrix = drawDistanceMatrix(p, dist);
  tw(matrix, { o: 1 }, 1.5, 0.6);
  
  const nodeA = graph._nodeElements['A'];
  tw(nodeA.circle, { fill: CURRENT }, 2.5, 0.4);
  tw(nodeA.circle, { r: 35 }, 2.5, 0.3, out);
  tw(nodeA.circle, { r: 30 }, 2.8, 0.3, io);
  tw(nodeA.circle, { stroke: PRIMARY, 'stroke-width': 5 }, 2.5, 0.4);
  tw(nodeA.circle, { opacity: 0.9 }, 2.5, 0.3);
  
  // 检查多个点对
  const pairs = [
    { i: 'B', j: 'D', t: 3.7, update: false },
    { i: 'B', j: 'C', t: 4.5, update: false },
    { i: 'B', j: 'E', t: 5.3, update: false },
    { i: 'C', j: 'B', t: 6.1, update: false },
    { i: 'C', j: 'D', t: 6.9, update: false },
    { i: 'C', j: 'E', t: 7.7, update: false },
    { i: 'D', j: 'B', t: 8.5, update: true },
    { i: 'D', j: 'C', t: 10.1, update: false },
    { i: 'D', j: 'E', t: 10.9, update: false },
    { i: 'E', j: 'B', t: 11.7, update: false },
    { i: 'E', j: 'C', t: 12.5, update: false },
    { i: 'E', j: 'D', t: 13.3, update: false }
  ];
  
  pairs.forEach(pair => {
    const key = `${pair.i}-${pair.j}`;
    const cell = matrix._cells[key];
    const t = pair.t;
    
    tw(cell.rect, { fill: CELL_CHECKING }, t, 0.25);
    tw(cell.rect, { stroke: PRIMARY, 'stroke-width': 3 }, t, 0.25);
    tw(cell.text, { s: 1.15 }, t, 0.2, out);
    tw(cell.text, { fill: CURRENT }, t, 0.2);
    
    if (pair.update) {
      const cellIA = matrix._cells[`${pair.i}-A`];
      const cellAJ = matrix._cells[`A-${pair.j}`];
      
      tw(cellIA.rect, { fill: '#fff3e0', stroke: SECONDARY, 'stroke-width': 2 }, t + 0.3, 0.3);
      tw(cellAJ.rect, { fill: '#fff3e0', stroke: SECONDARY, 'stroke-width': 2 }, t + 0.3, 0.3);
      tw(cellIA.text, { fill: SECONDARY }, t + 0.3, 0.2);
      tw(cellAJ.text, { fill: SECONDARY }, t + 0.3, 0.2);
      
      const newDist = dist[pair.i]['A'] + dist['A'][pair.j];
      if (newDist < dist[pair.i][pair.j]) {
        dist[pair.i][pair.j] = newDist;
        updateMatrixCell(matrix._cells, pair.i, pair.j, newDist, t + 0.6);
        
        tw(cellIA.rect, { fill: CELL_INIT, stroke: '#bdc3c7', 'stroke-width': 2 }, t + 1.1, 0.3);
        tw(cellAJ.rect, { fill: CELL_INIT, stroke: '#bdc3c7', 'stroke-width': 2 }, t + 1.1, 0.3);
        tw(cellIA.text, { fill: '#2c3e50' }, t + 1.1, 0.2);
        tw(cellAJ.text, { fill: '#2c3e50' }, t + 1.1, 0.2);
      }
    } else {
      tw(cell.rect, { fill: CELL_INIT }, t + 0.4, 0.25);
      tw(cell.rect, { stroke: '#bdc3c7', 'stroke-width': 2 }, t + 0.4, 0.25);
      tw(cell.text, { s: 1 }, t + 0.4, 0.2, io);
      tw(cell.text, { fill: '#2c3e50' }, t + 0.4, 0.2);
    }
  });
  
  tw(nodeA.circle, { fill: VISITED }, 14.5, 0.5);
  tw(nodeA.circle, { stroke: '#2c3e50', 'stroke-width': 3 }, 14.5, 0.5);
  tw(nodeA.circle, { opacity: 1 }, 14.5, 0.3);
  
  const hint = T(p, '第一轮结束：通过 A 更新了 D→B', {
    x: W/2, y: 650, size: 20, fill: PRIMARY, anchor: 'middle', o: 0
  });
  tw(hint, { o: 1 }, 15, 0.7);
}]"""

content = content[:start] + new_beat + content[end:]

with open('index.html', 'w') as f:
    f.write(content)

print("✅ 已增强 demo_k0")
