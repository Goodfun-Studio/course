import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix intro - extend wave animation to fill the remaining time
old_intro = """['intro', '问题引入', (m, dur) => {
  const p = panel(0);
  
  const title = T(p, '广度优先搜索', { x: 800, y: 100, size: 64, weight: 700, fill: COL.chalk, anchor: 'middle', o: 0 });
  tw(title, { o: 1 }, 0, 0.6, out);
  
  const subtitle = T(p, 'BFS - Breadth-First Search', { x: 800, y: 170, size: 32, fill: COL.dim, anchor: 'middle', o: 0 });
  tw(subtitle, { o: 1 }, 0.5, 0.5);
  
  const t_bfs = m('bfs');
  
  const t_social = m('social');
  const scenario1 = T(p, '社交网络：找到你的二度好友', { x: 400, y: 260, size: 30, fill: COL.chalk, o: 0 });
  tw(scenario1, { o: 1 }, t_social, 0.5);
  
  const t_map = m('map');
  const scenario2 = T(p, '地图导航：找到最短路径', { x: 400, y: 330, size: 30, fill: COL.chalk, o: 0 });
  tw(scenario2, { o: 1 }, t_map, 0.5);
  
  const t_game = m('game');
  const scenario3 = T(p, '走迷宫：最少步数', { x: 400, y: 400, size: 30, fill: COL.chalk, o: 0 });
  tw(scenario3, { o: 1 }, t_game, 0.5);
  
  const t_core = m('core');
  const core = T(p, '核心问题：如何逐层遍历图的节点？', { x: 800, y: 520, size: 36, fill: VISITED, anchor: 'middle', o: 0 });
  tw(core, { o: 1 }, t_core, 0.7);
  
  // Wave effect illustration
  const center = { x: 800, y: 650 };
  for (let i = 0; i < 4; i++) {
    const circle = mk('circle', { 
      cx: center.x, cy: center.y, r: 40 + i * 30, 
      fill: 'none', stroke: QUEUED, 'stroke-width': 2, o: 0 
    }, p);
    tw(circle, { o: 0.6 }, t_core + 1 + i * 0.3, 0.5);
  }
}],"""

new_intro = """['intro', '问题引入', (m, dur) => {
  const p = panel(0);
  
  const title = T(p, '广度优先搜索', { x: 800, y: 100, size: 64, weight: 700, fill: COL.chalk, anchor: 'middle', o: 0 });
  tw(title, { o: 1 }, 0, 0.6, out);
  
  const subtitle = T(p, 'BFS - Breadth-First Search', { x: 800, y: 170, size: 32, fill: COL.dim, anchor: 'middle', o: 0 });
  tw(subtitle, { o: 1 }, 0.5, 0.5);
  
  const t_bfs = m('bfs');
  
  const t_social = m('social');
  const scenario1 = T(p, '社交网络：找到你的二度好友', { x: 400, y: 260, size: 30, fill: COL.chalk, o: 0 });
  tw(scenario1, { o: 1 }, t_social, 0.5);
  
  const t_map = m('map');
  const scenario2 = T(p, '地图导航：找到最短路径', { x: 400, y: 330, size: 30, fill: COL.chalk, o: 0 });
  tw(scenario2, { o: 1 }, t_map, 0.5);
  
  const t_game = m('game');
  const scenario3 = T(p, '走迷宫：最少步数', { x: 400, y: 400, size: 30, fill: COL.chalk, o: 0 });
  tw(scenario3, { o: 1 }, t_game, 0.5);
  
  const t_core = m('core');
  const core = T(p, '核心问题：如何逐层遍历图的节点？', { x: 800, y: 520, size: 36, fill: VISITED, anchor: 'middle', o: 0 });
  tw(core, { o: 1 }, t_core, 0.7);
  
  // Wave effect illustration - extended to fill remaining time
  const center = { x: 800, y: 650 };
  for (let i = 0; i < 4; i++) {
    const circle = mk('circle', { 
      cx: center.x, cy: center.y, r: 40 + i * 30, 
      fill: 'none', stroke: QUEUED, 'stroke-width': 2, o: 0 
    }, p);
    tw(circle, { o: 0.6 }, t_core + 1 + i * 0.5, 0.6);
    tw(circle, { o: 0.3 }, t_core + 4 + i * 0.5, 0.6);
  }
  
  // Add pulsing effect to keep animation active until end
  tw(core, { s: 1.05 }, dur - 2, 1.0);
  tw(core, { s: 1.0 }, dur - 1, 1.0);
}],"""

content = content.replace(old_intro, new_intro)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed intro")
