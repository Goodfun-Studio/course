#!/usr/bin/env python3
import re

with open('index.html', 'r') as f:
    content = f.read()

# 找到 demo_final
start = content.find("['demo_final',")
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

new_beat = """['demo_final', 'Floyd-Warshall 演示：收敛', (m, dur) => {
  const p = stage(m);
  
  const title = T(p, '迭代：k = 3, 4（D, E）→ 收敛', {
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
  // 应用前面的更新
  dist['D']['B'] = 11;
  dist['A']['C'] = 12;
  dist['C']['D'] = 11;
  dist['B']['E'] = 14;
  dist['A']['E'] = 18;
  dist['D']['E'] = 1;
  
  const matrix = drawDistanceMatrix(p, dist);
  tw(matrix, { o: 1 }, 1.5, 0.6);
  
  // k=3 (D) 的关键更新
  const nodeD = graph._nodeElements['D'];
  tw(nodeD.circle, { fill: CURRENT }, 2.5, 0.4);
  tw(nodeD.circle, { r: 35 }, 2.5, 0.3, out);
  tw(nodeD.circle, { r: 30 }, 2.8, 0.3, io);
  tw(nodeD.circle, { stroke: PRIMARY, 'stroke-width': 5 }, 2.5, 0.4);
  
  const k3Updates = [
    { i: 'A', j: 'E', old: 18, new: 8, t: 3.5 },
    { i: 'B', j: 'E', old: 14, new: 4, t: 5.0 },
    { i: 'A', j: 'C', old: 12, new: 2, t: 6.5 },
    { i: 'B', j: 'C', old: Infinity, new: -2, t: 8.0 }
  ];
  
  k3Updates.forEach(u => {
    const cell = matrix._cells[`${u.i}-${u.j}`];
    tw(cell.rect, { fill: CELL_CHECKING }, u.t, 0.3);
    tw(cell.rect, { stroke: PRIMARY, 'stroke-width': 3 }, u.t, 0.3);
    tw(cell.text, { s: 1.3 }, u.t, 0.2, out);
    tw(cell.text, { fill: CURRENT }, u.t, 0.2);
    
    dist[u.i][u.j] = u.new;
    updateMatrixCell(matrix._cells, u.i, u.j, u.new, u.t + 0.5);
    
    tw(cell.rect, { fill: CELL_UPDATED }, u.t + 0.8, 0.3);
    tw(cell.text, { s: 1 }, u.t + 0.8, 0.2, io);
    tw(cell.text, { fill: '#2c3e50' }, u.t + 0.8, 0.2);
  });
  
  tw(nodeD.circle, { fill: VISITED }, 9.5, 0.4);
  tw(nodeD.circle, { stroke: '#2c3e50', 'stroke-width': 3 }, 9.5, 0.4);
  
  // k=4 (E) 快速过
  const nodeE = graph._nodeElements['E'];
  tw(nodeE.circle, { fill: CURRENT }, 10.5, 0.3);
  tw(nodeE.circle, { r: 33 }, 10.5, 0.2, out);
  tw(nodeE.circle, { r: 30 }, 10.7, 0.2, io);
  tw(nodeE.circle, { stroke: SECONDARY, 'stroke-width': 4 }, 10.5, 0.3);
  tw(nodeE.circle, { fill: VISITED }, 11.5, 0.3);
  tw(nodeE.circle, { stroke: '#2c3e50', 'stroke-width': 3 }, 11.5, 0.3);
  
  // 所有单元格变蓝表示最终确定
  const allCells = Object.values(matrix._cells);
  allCells.forEach((cell, idx) => {
    if (cell.value !== Infinity && cell.value !== 0) {
      tw(cell.rect, { fill: CELL_FINAL }, 12.0 + idx * 0.05, 0.6);
      tw(cell.text, { fill: PRIMARY }, 12.0 + idx * 0.05, 0.4);
    }
  });
  
  const hint = T(p, '✅ 算法收敛！所有点对最短距离已计算完成', {
    x: W/2, y: 650, size: 22, fill: PRIMARY, weight: 600, anchor: 'middle', o: 0
  });
  tw(hint, { o: 1 }, 13.5, 0.8);
  tw(hint, { s: 1.1 }, 13.5, 0.4, out);
}]"""

content = content[:start] + new_beat + content[end:]

with open('index.html', 'w') as f:
    f.write(content)

print("✅ 已增强 demo_final")
