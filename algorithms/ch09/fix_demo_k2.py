#!/usr/bin/env python3
import re

with open('index.html', 'r') as f:
    content = f.read()

# 找到 demo_k2
start = content.find("['demo_k2',")
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

new_beat = """['demo_k2', 'Floyd-Warshall 演示：k = 2 (C)', (m, dur) => {
  const p = stage(m);
  
  const title = T(p, '迭代：k = 2（中转点 C）', {
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
  dist['A']['C'] = 12;
  dist['C']['D'] = 11;
  
  const matrix = drawDistanceMatrix(p, dist);
  tw(matrix, { o: 1 }, 1.5, 0.6);
  
  const nodeC = graph._nodeElements['C'];
  tw(nodeC.circle, { fill: CURRENT }, 2.5, 0.4);
  tw(nodeC.circle, { r: 35 }, 2.5, 0.3, out);
  tw(nodeC.circle, { r: 30 }, 2.8, 0.3, io);
  tw(nodeC.circle, { stroke: PRIMARY, 'stroke-width': 5 }, 2.5, 0.4);
  tw(nodeC.circle, { opacity: 0.9 }, 2.5, 0.3);
  
  // C 是关键节点，连接负权边
  const pairs = [
    { i: 'A', j: 'E', t: 3.7, update: true },
    { i: 'B', j: 'E', t: 5.3, update: true },
    { i: 'B', j: 'D', t: 6.9, update: false },
    { i: 'D', j: 'E', t: 8.5, update: true },
    { i: 'D', j: 'B', t: 10.1, update: false },
    { i: 'E', j: 'A', t: 11.7, update: false },
    { i: 'E', j: 'B', t: 12.5, update: false },
    { i: 'E', j: 'D', t: 13.3, update: false }
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
      const cellIC = matrix._cells[`${pair.i}-C`];
      const cellCJ = matrix._cells[`C-${pair.j}`];
      
      tw(cellIC.rect, { fill: '#ffe5e5', stroke: EDGE_NEGATIVE, 'stroke-width': 2 }, t + 0.3, 0.3);
      tw(cellCJ.rect, { fill: '#ffe5e5', stroke: EDGE_NEGATIVE, 'stroke-width': 2 }, t + 0.3, 0.3);
      tw(cellIC.text, { fill: EDGE_NEGATIVE }, t + 0.3, 0.2);
      tw(cellCJ.text, { fill: EDGE_NEGATIVE }, t + 0.3, 0.2);
      
      const viaCDist = dist[pair.i]['C'] + dist['C'][pair.j];
      if (viaCDist < dist[pair.i][pair.j]) {
        dist[pair.i][pair.j] = viaCDist;
        updateMatrixCell(matrix._cells, pair.i, pair.j, viaCDist, t + 0.7, {
          flashColor: '#ffe5e5'
        });
        
        tw(cellIC.rect, { fill: CELL_INIT, stroke: '#bdc3c7', 'stroke-width': 2 }, t + 1.2, 0.3);
        tw(cellCJ.rect, { fill: CELL_INIT, stroke: '#bdc3c7', 'stroke-width': 2 }, t + 1.2, 0.3);
        tw(cellIC.text, { fill: '#2c3e50' }, t + 1.2, 0.2);
        tw(cellCJ.text, { fill: '#2c3e50' }, t + 1.2, 0.2);
      }
    } else {
      tw(cell.rect, { fill: CELL_INIT }, t + 0.4, 0.25);
      tw(cell.rect, { stroke: '#bdc3c7', 'stroke-width': 2 }, t + 0.4, 0.25);
      tw(cell.text, { s: 1 }, t + 0.4, 0.2, io);
      tw(cell.text, { fill: '#2c3e50' }, t + 0.4, 0.2);
    }
  });
  
  tw(nodeC.circle, { fill: VISITED }, 14.5, 0.5);
  tw(nodeC.circle, { stroke: '#2c3e50', 'stroke-width': 3 }, 14.5, 0.5);
  tw(nodeC.circle, { opacity: 1 }, 14.5, 0.3);
  
  const hint = T(p, '负权边 D→C 让 D→E 的距离优化为 1！', {
    x: W/2, y: 650, size: 20, fill: EDGE_NEGATIVE, weight: 600, anchor: 'middle', o: 0
  });
  tw(hint, { o: 1 }, 15, 0.7);
}]"""

content = content[:start] + new_beat + content[end:]

with open('index.html', 'w') as f:
    f.write(content)

print("✅ 已增强 demo_k2")
