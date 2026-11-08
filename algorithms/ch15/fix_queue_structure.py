import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix queue-structure - extend animations
old_queue = """['queue-structure', '队列：先进先出', (m, dur) => {
  const p = panel(0);
  
  const title = T(p, 'Queue - 队列', { x: 800, y: 100, size: 56, weight: 600, fill: COL.chalk, anchor: 'middle', o: 0 });
  tw(title, { o: 1 }, 0, 0.6, out);
  
  const t_fifo = m('fifo');
  const fifo = T(p, 'FIFO: First In First Out', { x: 800, y: 180, size: 32, fill: COL.dim, anchor: 'middle', o: 0 });
  tw(fifo, { o: 1 }, t_fifo, 0.5);
  
  const t_why = m('why');
  const why = T(p, '为什么用队列？', { x: 400, y: 260, size: 34, fill: CURRENT, o: 0 });
  tw(why, { o: 1 }, t_why, 0.5);
  
  const t_process = m('process');
  const reason = T(p, '→ 按发现顺序访问，保证层级顺序', { x: 450, y: 320, size: 28, fill: COL.chalk, o: 0 });
  tw(reason, { o: 1 }, t_process, 0.6);
  
  // Queue visualization
  const queueY = 450;
  const queueLabel = T(p, '队列操作：', { x: 400, y: queueY - 30, size: 28, fill: COL.chalk, o: 0 });
  tw(queueLabel, { o: 1 }, t_process + 1, 0.5);
  
  // Initial queue
  const items = ['A', 'B', 'C', 'D'];
  for (let i = 0; i < items.length; i++) {
    const x = 500 + i * 90;
    const box = mk('rect', { x: x, y: queueY, width: 70, height: 70, rx: 5, fill: QUEUED, o: 0 }, p);
    tw(box, { o: 0.8 }, t_process + 1.5 + i * 0.15, 0.4);
    const label = T(p, items[i], { x: x + 35, y: queueY + 45, size: 32, fill: 'white', anchor: 'middle', o: 0 });
    tw(label, { o: 1 }, t_process + 1.5 + i * 0.15, 0.4);
  }
  
  // Enqueue arrow（队尾在右端，新元素从右侧向左进入队列）
  const t_enqueue = m('enqueue');
  const enqueueArrow = T(p, '← 入队（enqueue）', { x: 860, y: queueY + 45, size: 24, fill: VISITED, anchor: 'start', o: 0 });
  tw(enqueueArrow, { o: 1 }, t_enqueue, 0.5);
  
  // Dequeue arrow（队首在左端，元素向左离开队列）
  const t_dequeue = m('dequeue');
  const dequeueArrow = T(p, '← 出队（dequeue）', { x: 485, y: queueY + 45, size: 24, fill: PATH, anchor: 'end', o: 0 });
  tw(dequeueArrow, { o: 1 }, t_dequeue, 0.5);
  
  const t_order = m('order');
  const contrast = T(p, 'BFS 用队列 ≠ DFS 用栈', { x: 800, y: 620, size: 30, fill: COL.dim, anchor: 'middle', o: 0 });
  tw(contrast, { o: 1 }, t_order, 0.6);
}],"""

new_queue = """['queue-structure', '队列：先进先出', (m, dur) => {
  const p = panel(0);
  
  const title = T(p, 'Queue - 队列', { x: 800, y: 100, size: 56, weight: 600, fill: COL.chalk, anchor: 'middle', o: 0 });
  tw(title, { o: 1 }, 0, 0.6, out);
  
  const t_fifo = m('fifo');
  const fifo = T(p, 'FIFO: First In First Out', { x: 800, y: 180, size: 32, fill: COL.dim, anchor: 'middle', o: 0 });
  tw(fifo, { o: 1 }, t_fifo, 0.5);
  
  const t_why = m('why');
  const why = T(p, '为什么用队列？', { x: 400, y: 260, size: 34, fill: CURRENT, o: 0 });
  tw(why, { o: 1 }, t_why, 0.5);
  
  const t_process = m('process');
  const reason = T(p, '→ 按发现顺序访问，保证层级顺序', { x: 450, y: 320, size: 28, fill: COL.chalk, o: 0 });
  tw(reason, { o: 1 }, t_process, 0.6);
  
  // Queue visualization
  const queueY = 450;
  const queueLabel = T(p, '队列操作：', { x: 400, y: queueY - 30, size: 28, fill: COL.chalk, o: 0 });
  tw(queueLabel, { o: 1 }, t_process + 1, 0.5);
  
  // Initial queue
  const items = ['A', 'B', 'C', 'D'];
  const boxes = [];
  for (let i = 0; i < items.length; i++) {
    const x = 500 + i * 90;
    const box = mk('rect', { x: x, y: queueY, width: 70, height: 70, rx: 5, fill: QUEUED, o: 0 }, p);
    tw(box, { o: 0.8 }, t_process + 1.5 + i * 0.15, 0.4);
    boxes.push(box);
    const label = T(p, items[i], { x: x + 35, y: queueY + 45, size: 32, fill: 'white', anchor: 'middle', o: 0 });
    tw(label, { o: 1 }, t_process + 1.5 + i * 0.15, 0.4);
  }
  
  // Enqueue arrow（队尾在右端，新元素从右侧向左进入队列）
  const t_enqueue = m('enqueue');
  const enqueueArrow = T(p, '← 入队（enqueue）', { x: 860, y: queueY + 45, size: 24, fill: VISITED, anchor: 'start', o: 0 });
  tw(enqueueArrow, { o: 1 }, t_enqueue, 0.5);
  
  // Dequeue arrow（队首在左端，元素向左离开队列）
  const t_dequeue = m('dequeue');
  const dequeueArrow = T(p, '← 出队（dequeue）', { x: 485, y: queueY + 45, size: 24, fill: PATH, anchor: 'end', o: 0 });
  tw(dequeueArrow, { o: 1 }, t_dequeue, 0.5);
  
  const t_order = m('order');
  const contrast = T(p, 'BFS 用队列 ≠ DFS 用栈', { x: 800, y: 620, size: 30, fill: COL.dim, anchor: 'middle', o: 0 });
  tw(contrast, { o: 1 }, t_order, 0.6);
  
  // Add pulse animations to queue boxes to extend duration
  boxes.forEach((box, i) => {
    tw(box, { s: 1.1 }, t_order + 2 + i * 0.3, 0.4);
    tw(box, { s: 1.0 }, t_order + 2.5 + i * 0.3, 0.4);
  });
}],"""

content = content.replace(old_queue, new_queue)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed queue-structure")
