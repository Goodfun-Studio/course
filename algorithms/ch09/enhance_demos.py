#!/usr/bin/env python3
"""
增强 ch09 的 demo beat 动画，确保通过质量检测
"""
import re

html_file = 'index.html'

with open(html_file, 'r', encoding='utf-8') as f:
    content = f.read()

# 替换 demo_k0
demo_k0_old = re.search(r"\['demo_k0'.*?\]\],", content, re.DOTALL).group(0)

demo_k0_new = """['demo_k0', 'Floyd-Warshall 演示：k = 0 (A)', (m, dur) => {
  const p = stage(m);
  
  const title = T(p, '迭代：k = 0（中转点 A）', {
    x: W/2, y: 80, size: 28, fill: COL.chalk, weight: 700, anchor: 'middle', o: 0
  });
  tw(title, { o: 1 }, 0.5, 0.7);
  
  const graph = drawGraph(p);
  tw(graph, { o: 1 }, 0.5, 0.5);
  
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
  tw(matrix, { o: 1 }, 0.5, 0.5);
  
  let t = 1.5;
  const nodeA = graph._nodeElements['A'];
  tw(nodeA.circle, { fill: CURRENT }, t, 0.4);
  tw(nodeA.circle, { r: 35 }, t, 0.3, out);
  tw(nodeA.circle, { r: 30 }, t + 0.3, 0.3, io);
  tw(nodeA.circle, { stroke: PRIMARY, 'stroke-width': 5 }, t, 0.4);
  t += 1;
  
  // 检查更多点对以增加动画丰富度
  const checkPairs = [
    { i: 'B', j: 'D', update: false },
    { i: 'B', j: 'C', update: false },
    { i: 'B', j: 'E', update: false },
    { i: 'C', j: 'B', update: false },
    { i: 'C', j: 'D', update: false },
    { i: 'C', j: 'E', update: false },
    { i: 'D', j: 'B', update: true },
    { i: 'D', j: 'C', update: false },
    { i: 'D', j: 'E', update: false },
    { i: 'E', j: 'B', update: false },
    { i: 'E', j: 'C', update: false },
    { i: 'E', j: 'D', update: false }
  ];
  
  checkPairs.forEach(pair => {
    const key = `${pair.i}-${pair.j}`;
    const cell = matrix._cells[key];
    
    tw(cell.rect, { fill: CELL_CHECKING }, t, 0.25);
    tw(cell.rect, { stroke: PRIMARY, 'stroke-width': 3 }, t, 0.25);
    tw(cell.text, { s: 1.15 }, t, 0.2, out);
    
    if (pair.update) {
      const cellIA = matrix._cells[`${pair.i}-A`];
      const cellAJ = matrix._cells[`A-${pair.j}`];
      
      tw(cellIA.rect, { fill: '#fff3e0', stroke: SECONDARY, 'stroke-width': 2 }, t + 0.3, 0.3);
      tw(cellAJ.rect, { fill: '#fff3e0', stroke: SECONDARY, 'stroke-width': 2 }, t + 0.3, 0.3);
      
      const newDist = dist[pair.i]['A'] + dist['A'][pair.j];
      if (newDist < dist[pair.i][pair.j]) {
        dist[pair.i][pair.j] = newDist;
        updateMatrixCell(matrix._cells, pair.i, pair.j, newDist, t + 0.6);
        
        tw(cellIA.rect, { fill: CELL_INIT, stroke: '#bdc3c7', 'stroke-width': 2 }, t + 1.1, 0.3);
        tw(cellAJ.rect, { fill: CELL_INIT, stroke: '#bdc3c7', 'stroke-width': 2 }, t + 1.1, 0.3);
        t += 1.5;
      }
    } else {
      tw(cell.rect, { fill: CELL_INIT }, t + 0.4, 0.25);
      tw(cell.rect, { stroke: '#bdc3c7', 'stroke-width': 2 }, t + 0.4, 0.25);
      tw(cell.text, { s: 1 }, t + 0.4, 0.2, io);
      t += 0.7;
    }
  });
  
  tw(nodeA.circle, { fill: VISITED }, t, 0.5);
  tw(nodeA.circle, { stroke: '#2c3e50', 'stroke-width': 3 }, t, 0.5);
  
  const hint = T(p, '第一轮结束：通过 A 更新了 D→B', {
    x: W/2, y: 650, size: 20, fill: PRIMARY, anchor: 'middle', o: 0
  });
  tw(hint, { o: 1 }, t, 0.7);
}],"""

content = content.replace(demo_k0_old, demo_k0_new)

# 替换 demo_k1（类似增强）
demo_k1_pattern = r"\['demo_k1'.*?\]\],"
demo_k1_match = re.search(demo_k1_pattern, content, re.DOTALL)
if demo_k1_match:
    demo_k1_old = demo_k1_match.group(0)
    demo_k1_new = """['demo_k1', 'Floyd-Warshall 演示：k = 1 (B)', (m, dur) => {
  const p = stage(m);
  
  const title = T(p, '迭代：k = 1（中转点 B）', {
    x: W/2, y: 80, size: 28, fill: COL.chalk, weight: 700, anchor: 'middle', o: 0
  });
  tw(title, { o: 1 }, 0.5, 0.7);
  
  const graph = drawGraph(p);
  tw(graph, { o: 1 }, 0.5, 0.5);
  
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
  tw(matrix, { o: 1 }, 0.5, 0.5);
  
  let t = 1.5;
  const nodeB = graph._nodeElements['B'];
  tw(nodeB.circle, { fill: CURRENT }, t, 0.4);
  tw(nodeB.circle, { r: 35 }, t, 0.3, out);
  tw(nodeB.circle, { r: 30 }, t + 0.3, 0.3, io);
  tw(nodeB.circle, { stroke: PRIMARY, 'stroke-width': 5 }, t, 0.4);
  t += 1;
  
  const checkPairs = [
    { i: 'A', j: 'C', old: Infinity, newVal: 12, update: true },
    { i: 'A', j: 'D', old: 7, newVal: 7, update: false },
    { i: 'A', j: 'E', old: Infinity, newVal: Infinity, update: false },
    { i: 'C', j: 'D', old: Infinity, newVal: 11, update: true },
    { i: 'C', j: 'E', old: Infinity, newVal: Infinity, update: false },
    { i: 'D', j: 'C', old: -5, newVal: -5, update: false },
    { i: 'D', j: 'E', old: 3, newVal: 3, update: false },
    { i: 'E', j: 'C', old: Infinity, newVal: Infinity, update: false },
    { i: 'E', j: 'D', old: Infinity, newVal: Infinity, update: false }
  ];
  
  checkPairs.forEach(pair => {
    const key = `${pair.i}-${pair.j}`;
    const cell = matrix._cells[key];
    
    tw(cell.rect, { fill: CELL_CHECKING }, t, 0.25);
    tw(cell.rect, { stroke: PRIMARY, 'stroke-width': 3 }, t, 0.25);
    tw(cell.text, { s: 1.15 }, t, 0.2, out);
    
    if (pair.update) {
      const cellIB = matrix._cells[`${pair.i}-B`];
      const cellBJ = matrix._cells[`B-${pair.j}`];
      
      tw(cellIB.rect, { fill: '#fff3e0', stroke: SECONDARY, 'stroke-width': 2 }, t + 0.3, 0.3);
      tw(cellBJ.rect, { fill: '#fff3e0', stroke: SECONDARY, 'stroke-width': 2 }, t + 0.3, 0.3);
      
      dist[pair.i][pair.j] = pair.newVal;
      updateMatrixCell(matrix._cells, pair.i, pair.j, pair.newVal, t + 0.6);
      
      tw(cellIB.rect, { fill: CELL_INIT, stroke: '#bdc3c7', 'stroke-width': 2 }, t + 1.1, 0.3);
      tw(cellBJ.rect, { fill: CELL_INIT, stroke: '#bdc3c7', 'stroke-width': 2 }, t + 1.1, 0.3);
      t += 1.5;
    } else {
      tw(cell.rect, { fill: CELL_INIT }, t + 0.4, 0.25);
      tw(cell.rect, { stroke: '#bdc3c7', 'stroke-width': 2 }, t + 0.4, 0.25);
      tw(cell.text, { s: 1 }, t + 0.4, 0.2, io);
      t += 0.7;
    }
  });
  
  tw(nodeB.circle, { fill: VISITED }, t, 0.5);
  tw(nodeB.circle, { stroke: '#2c3e50', 'stroke-width': 3 }, t, 0.5);
  
  const hint = T(p, 'A→C 和 C→D 通过 B 找到路径', {
    x: W/2, y: 650, size: 20, fill: PRIMARY, anchor: 'middle', o: 0
  });
  tw(hint, { o: 1 }, t, 0.7);
}],"""
    content = content.replace(demo_k1_old, demo_k1_new)

# 保存
with open(html_file, 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ 已增强 demo_k0 和 demo_k1 的动画")
