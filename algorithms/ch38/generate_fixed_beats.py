#!/usr/bin/env python3
import json

# 读取 timings
with open('audio/zh/timings.js', 'r', encoding='utf-8') as f:
    content = f.read().replace('window.TIMINGS = ', '').strip().rstrip(';')
    TIMINGS = json.loads(content)

# 生成修复后的 beats
beats_code = """
/* ---------- Beats ---------- */
window.BEATS = [

['intro', '问题引入', (m, dur) => {
  const p = panel(0);
  T(p, '布隆过滤器', { x: 400, y: 80, size: 48, weight: 700, fill: DARK, anchor: 'middle' });
  const subtitle = T(p, 'Bloom Filter', { x: 400, y: 130, size: 28, fill: PURPLE, o: 0, anchor: 'middle' });
  tw(subtitle, { o: 1 }, 0);
  
  const scenarios = [
    { icon: '🔗', text: 'URL黑名单：快速判断网址是否危险', y: 200, mark: 'malicious' },
    { icon: '🚫', text: '缓存穿透：防止查询不存在的数据', y: 270, mark: 'cache' },
    { icon: '🔄', text: '去重检测：爬虫URL去重', y: 340, mark: 'crawler' },
    { icon: '📧', text: '垃圾邮件：快速过滤垃圾内容', y: 410, mark: 'probabilistic' },
    { icon: '⛓️', text: '区块链：轻节点快速验证', y: 480, mark: 'tradeoff' }
  ];
  
  scenarios.forEach(({ icon, text, y, mark }) => {
    const g = G(p, { x: 100, y, o: 0 });
    T(g, icon, { x: 0, y: 0, size: 32, anchor: 'middle' });
    T(g, text, { x: 70, y: 0, size: 22, fill: DARK, anchor: 'start' });
    tw(g, { o: 1 }, m(mark));
  });
}],

['problem', '问题定义', (m, dur) => {
  const p = panel(0);
  T(p, '需要解决什么问题？', { x: 400, y: 60, size: 36, weight: 700, fill: DARK, anchor: 'middle' });
  
  T(p, '传统方案：哈希表 / 集合', { x: 200, y: 140, size: 24, weight: 600, fill: WARNING, anchor: 'middle' });
  
  const box1 = mk('rect', {
    x: 80, y: 180, width: 240, height: 180, fill: 'none',
    stroke: WARNING, 'stroke-width': 3, rx: 8, o: 0
  }, p);
  tw(box1, { o: 1 }, m('problem'));
  
  const traditional = [
    { text: '✓ 100% 准确', y: 220, color: SUCCESS, mark: 'accurate' },
    { text: '✗ 空间占用大', y: 260, color: DANGER, mark: 'space' },
    { text: '✗ 1亿URL ≈ 8GB', y: 300, color: DANGER, mark: 'calculation' },
    { text: '✗ 内存成本高', y: 340, color: DANGER, mark: 'cost' }
  ];
  
  traditional.forEach(({ text, y, color, mark }) => {
    const label = T(p, text, { x: 200, y, size: 20, fill: color, anchor: 'middle', o: 0 });
    tw(label, { o: 1 }, m(mark));
  });
  
  T(p, '布隆过滤器方案', { x: 600, y: 140, size: 24, weight: 600, fill: SUCCESS, anchor: 'middle' });
  
  const box2 = mk('rect', {
    x: 480, y: 180, width: 240, height: 180, fill: 'none',
    stroke: SUCCESS, 'stroke-width': 3, rx: 8, o: 0
  }, p);
  tw(box2, { o: 1 }, m('alternative'));
  
  const bloom = [
    { text: '✓ 空间极小', y: 220, color: SUCCESS, mark: 'fast' },
    { text: '✓ 1亿URL ≈ 120MB', y: 260, color: SUCCESS, mark: 'savings' },
    { text: '✓ 速度快', y: 300, color: SUCCESS, mark: 'control' },
    { text: '⚠ 有小概率误判', y: 340, color: WARNING, mark: 'rate' }
  ];
  
  bloom.forEach(({ text, y, color, mark }) => {
    const label = T(p, text, { x: 600, y, size: 20, fill: color, anchor: 'middle', o: 0 });
    tw(label, { o: 1 }, m(mark));
  });
  
  const summary = T(p, '用小概率误判换取巨大的空间节省', { 
    x: 400, y: 420, size: 26, weight: 600, fill: PURPLE, anchor: 'middle', o: 0 
  });
  tw(summary, { o: 1 }, m('false_positive'));
  
  const note = T(p, '误判率可控，且只会误判为"可能存在"', { 
    x: 400, y: 460, size: 20, fill: DARK, anchor: 'middle', o: 0 
  });
  tw(note, { o: 1 }, m('no_false_negative'));
}],

['structure', '数据结构', (m, dur) => {
  const p = panel(0);
  T(p, '布隆过滤器的组成', { x: 400, y: 50, size: 36, weight: 700, fill: DARK, anchor: 'middle' });
  
  const bitTitle = T(p, '1. 位数组（Bit Array）', { x: 100, y: 120, size: 24, weight: 600, fill: PRIMARY, o: 0 });
  tw(bitTitle, { o: 1 }, m('structure'));
  
  const bitArray = drawBitArray(p, 100, 150, 16, [], true);
  tw(bitArray, { o: 1 }, m('bit_array'));
  
  const bitNote = T(p, 'm 个位，初始全为 0', { x: 100, y: 230, size: 18, fill: DARK, o: 0 });
  tw(bitNote, { o: 1 }, m('initialization'));
  
  const hashTitle = T(p, '2. k 个独立哈希函数', { x: 100, y: 300, size: 24, weight: 600, fill: PRIMARY, o: 0 });
  tw(hashTitle, { o: 1 }, m('hash_functions'));
  
  const hashFuncs = [
    { name: 'h₁(x)', color: WARNING, x: 100, y: 340, mark: 'hash_functions' },
    { name: 'h₂(x)', color: CYAN, x: 240, y: 340, mark: 'mapping' },
    { name: 'h₃(x)', color: PINK, x: 380, y: 340, mark: 'parameters' }
  ];
  
  hashFuncs.forEach(({ name, color, x, y, mark }) => {
    const func = drawHashFunction(p, x, y, name, color);
    tw(func, { o: 1 }, m(mark));
  });
  
  const hashNote = T(p, '每个函数将输入映射到 [0, m-1]', { x: 100, y: 430, size: 18, fill: DARK, o: 0 });
  tw(hashNote, { o: 1 }, m('m_k'));
  
  const params = [
    { text: 'm：位数组大小', y: 490, color: PRIMARY, mark: 'm_k' },
    { text: 'k：哈希函数个数', y: 520, color: WARNING, mark: 'n' },
    { text: 'n：插入元素个数', y: 550, color: SUCCESS, mark: 'choice' }
  ];
  
  params.forEach(({ text, y, color, mark }) => {
    const label = T(p, text, { x: 100, y, size: 20, weight: 600, fill: color, o: 0 });
    tw(label, { o: 1 }, m(mark));
  });
}],

['insert_demo', '插入过程动画', (m, dur) => {
  const p = panel(0);
  T(p, '插入元素："apple"', { x: 400, y: 50, size: 36, weight: 700, fill: DARK, anchor: 'middle' });
  
  const element = T(p, '"apple"', { x: 400, y: 120, size: 32, weight: 700, fill: PURPLE, anchor: 'middle', o: 0 });
  tw(element, { o: 1 }, m('demo'));
  
  const bitArrayY = 400;
  const bitArray = drawBitArray(p, 100, bitArrayY, 16, [], true);
  tw(bitArray, { o: 1 }, m('apple'));
  
  const bitLabel = T(p, '位数组（初始全为0）', { x: 400, y: 370, size: 18, fill: DARK, anchor: 'middle', o: 0 });
  tw(bitLabel, { o: 1 }, m('hash'));
  
  const hashY = 200;
  const h1 = drawHashFunction(p, 100, hashY, 'h₁(x)', WARNING);
  const h2 = drawHashFunction(p, 290, hashY, 'h₂(x)', CYAN);
  const h3 = drawHashFunction(p, 480, hashY, 'h₃(x)', PINK);
  
  tw(h1, { o: 1 }, m('h1'));
  tw(h2, { o: 1 }, m('h2'));
  tw(h3, { o: 1 }, m('h3'));
  
  const indices = [3, 7, 12];
  const colors = [WARNING, CYAN, PINK];
  const marks = ['pos3', 'pos7', 'pos12'];
  
  indices.forEach((idx, i) => {
    const color = colors[i];
    const funcX = 100 + i * 190 + 60;
    const funcY = hashY + 60;
    
    const hashValue = T(p, `→ ${idx}`, {
      x: funcX + 70, y: funcY - 30, size: 24, weight: 700,
      fill: color, anchor: 'middle', o: 0
    });
    tw(hashValue, { o: 1 }, m('set'));
    
    const arrow = drawArrow(p, funcX, funcY + 30, 
                           100 + idx * 35 + 17, bitArrayY - 10, color);
    tw(arrow, { o: 1 }, m(marks[i]));
    
    const cellX = 100 + idx * 35;
    const highlight = mk('rect', {
      x: cellX, y: bitArrayY, width: 33, height: 40,
      fill: color, stroke: DARK, 'stroke-width': 3, rx: 3, o: 0
    }, p);
    tw(highlight, { o: 0.8 }, m(marks[i]));
    
    const bitText = T(p, '1', {
      x: cellX + 16, y: bitArrayY + 20, size: 20, weight: 700,
      fill: '#fff', anchor: 'middle', o: 0
    });
    bitText.setAttribute('dominant-baseline', 'central');
    tw(bitText, { o: 1 }, m(marks[i]));
  });
  
  const summary = T(p, '将 3 个位置设为 1', { 
    x: 400, y: 500, size: 28, weight: 600, fill: SUCCESS, anchor: 'middle', o: 0 
  });
  tw(summary, { o: 1 }, m('done'));
  
  const note = T(p, '插入完成，时间 O(k)', { 
    x: 400, y: 540, size: 22, fill: DARK, anchor: 'middle', o: 0 
  });
  tw(note, { o: 1 }, m('complexity'));
}],
"""

print("Generated first 4 beats. Continue with remaining beats...")
with open('beats_part1.txt', 'w', encoding='utf-8') as f:
    f.write(beats_code)
    
print("Saved to beats_part1.txt")
