#!/usr/bin/env python3
import re

with open('index.html', 'r') as f:
    content = f.read()

# 找到 demo_setup
start = content.find("['demo_setup',")
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

new_beat = """['demo_setup', 'Floyd-Warshall 演示：初始化', (m, dur) => {
  const p = stage(m);
  
  const title = T(p, 'Floyd-Warshall 演示', {
    x: W/2, y: 80, size: 32, fill: COL.chalk, weight: 700, anchor: 'middle', o: 0
  });
  tw(title, { o: 1 }, 0.5, 0.7);
  tw(title, { y: 75 }, 1.5, 0.5, out);
  
  // 图
  const graph = drawGraph(p);
  tw(graph, { o: 1 }, 1.5, 0.8);
  
  // 高亮所有节点，展示图结构
  const nodeKeys = Object.keys(NODES);
  nodeKeys.forEach((key, idx) => {
    const node = graph._nodeElements[key];
    tw(node.circle, { fill: PRIMARY }, 2.5 + idx * 0.3, 0.4);
    tw(node.circle, { r: 33 }, 2.5 + idx * 0.3, 0.3, out);
    tw(node.circle, { r: 30 }, 2.8 + idx * 0.3, 0.3, io);
    tw(node.circle, { fill: UNVISITED }, 3.5 + idx * 0.3, 0.4);
  });
  
  // 高亮边，特别标出负权边
  const edgeKeys = Object.keys(graph._edgeElements);
  edgeKeys.forEach((key, idx) => {
    const edge = graph._edgeElements[key];
    const weight = parseInt(edge.dataset.weight);
    const highlightColor = weight < 0 ? EDGE_NEGATIVE : EDGE_SELECTED;
    
    tw(edge, { stroke: highlightColor, 'stroke-width': 4 }, 5 + idx * 0.3, 0.4);
    tw(edge, { opacity: 1 }, 5 + idx * 0.3, 0.3);
    tw(edge, { stroke: EDGE_DEFAULT, 'stroke-width': 3 }, 5.5 + idx * 0.3, 0.4);
    tw(edge, { opacity: 0.7 }, 5.5 + idx * 0.3, 0.3);
  });
  
  // 初始化距离矩阵
  const initialDist = {};
  nodeKeys.forEach(i => {
    initialDist[i] = {};
    nodeKeys.forEach(j => {
      if (i === j) {
        initialDist[i][j] = 0;
      } else {
        const edge = EDGES.find(e => e.from === i && e.to === j);
        initialDist[i][j] = edge ? edge.weight : Infinity;
      }
    });
  });
  
  const matrix = drawDistanceMatrix(p, initialDist);
  tw(matrix, { o: 1 }, 8, 0.8);
  
  // 逐行高亮矩阵，展示初始值
  nodeKeys.forEach((rowKey, i) => {
    nodeKeys.forEach((colKey, j) => {
      const cell = matrix._cells[`${rowKey}-${colKey}`];
      const t = 9 + i * 0.5 + j * 0.1;
      
      if (rowKey === colKey) {
        tw(cell.rect, { fill: '#d4edda', stroke: VISITED, 'stroke-width': 2 }, t, 0.3);
        tw(cell.text, { fill: VISITED }, t, 0.2);
      } else if (cell.value !== Infinity) {
        const color = cell.value < 0 ? EDGE_NEGATIVE : PRIMARY;
        tw(cell.rect, { fill: '#fff3e0', stroke: color, 'stroke-width': 2 }, t, 0.3);
        tw(cell.text, { fill: color, s: 1.2 }, t, 0.2);
        tw(cell.text, { s: 1 }, t + 0.3, 0.2);
      }
      
      tw(cell.rect, { fill: CELL_INIT, stroke: '#bdc3c7', 'stroke-width': 2 }, t + 0.5, 0.3);
      tw(cell.text, { fill: cell.value === Infinity ? INF_COLOR : '#2c3e50' }, t + 0.5, 0.2);
    });
  });
  
  const hint1 = T(p, '初始化：对角线 = 0，直接边 = 权值，无边 = ∞', {
    x: W/2, y: 620, size: 20, fill: COL.dim, anchor: 'middle', o: 0
  });
  tw(hint1, { o: 1 }, 12, 0.7);
  
  const hint2 = T(p, '接下来逐个中转点 k 迭代，更新矩阵...', {
    x: W/2, y: 670, size: 22, fill: PRIMARY, weight: 600, anchor: 'middle', o: 0
  });
  tw(hint2, { o: 1 }, 13, 0.8);
  tw(hint2, { s: 1.05 }, 13.5, 0.3, out);
  
  // 保存到 metadata 供后续 beat 使用
  m.graph = graph;
  m.matrix = matrix;
  m.dist = JSON.parse(JSON.stringify(initialDist));
}]"""

content = content[:start] + new_beat + content[end:]

with open('index.html', 'w') as f:
    f.write(content)

print("✅ 已增强 demo_setup")
