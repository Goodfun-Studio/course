#!/usr/bin/env python3
"""
完整修复 ch38 布隆过滤器动画时间标记
将所有硬编码时间替换为 m('mark') 调用
"""

import re

# 读取原始文件
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 提取文件头部（到 BEATS 之前）
header_match = re.search(r'(.*?/\* ---------- Beats ---------- \*/)', content, re.DOTALL)
if not header_match:
    print("Error: Could not find beats section")
    exit(1)

header = header_match.group(1)

# 提取文件尾部（BEATS 之后）
footer_match = re.search(r'(window\.BEATS = window\.BEATS\.map.*?</script>.*?</body>.*?</html>)', content, re.DOTALL)
if not footer_match:
    print("Error: Could not find footer")
    exit(1)

footer = footer_match.group(1)

# 生成完整的修复后的 BEATS 代码
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
  
  const box1 = mk('rect', { x: 80, y: 180, width: 240, height: 180, fill: 'none',
    stroke: WARNING, 'stroke-width': 3, rx: 8, o: 0 }, p);
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
  const box2 = mk('rect', { x: 480, y: 180, width: 240, height: 180, fill: 'none',
    stroke: SUCCESS, 'stroke-width': 3, rx: 8, o: 0 }, p);
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
    x: 400, y: 420, size: 26, weight: 600, fill: PURPLE, anchor: 'middle', o: 0 });
  tw(summary, { o: 1 }, m('false_positive'));
  const note = T(p, '误判率可控，且只会误判为"可能存在"', { 
    x: 400, y: 460, size: 20, fill: DARK, anchor: 'middle', o: 0 });
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
    const arrow = drawArrow(p, funcX, funcY + 30, 100 + idx * 35 + 17, bitArrayY - 10, color);
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
    x: 400, y: 500, size: 28, weight: 600, fill: SUCCESS, anchor: 'middle', o: 0 });
  tw(summary, { o: 1 }, m('done'));
  const note = T(p, '插入完成，时间 O(k)', { 
    x: 400, y: 540, size: 22, fill: DARK, anchor: 'middle', o: 0 });
  tw(note, { o: 1 }, m('complexity'));
}],

['query_demo', '查询过程动画', (m, dur) => {
  const p = panel(0);
  T(p, '查询元素是否存在', { x: 400, y: 50, size: 36, weight: 700, fill: DARK, anchor: 'middle' });
  const bitArrayY = 350;
  const existingIndices = [3, 7, 12];
  const bitArray = drawBitArray(p, 100, bitArrayY, 16, existingIndices, true);
  tw(bitArray, { o: 1 }, m('query'));
  const statusLabel = T(p, '已插入：apple (位置 3, 7, 12)', { 
    x: 400, y: 310, size: 18, fill: DARK, anchor: 'middle', o: 0 });
  tw(statusLabel, { o: 1 }, m('state'));
  
  const bananaLabel = T(p, '查询："banana"', { x: 200, y: 120, size: 24, weight: 600, fill: PRIMARY, o: 0 });
  tw(bananaLabel, { o: 1 }, m('banana'));
  
  const queryIndices1 = [2, 7, 15];
  const hashY = 160;
  const marks1 = ['check', 'pos2', 'not_exist'];
  queryIndices1.forEach((idx, i) => {
    const colors = [WARNING, CYAN, PINK];
    const color = colors[i];
    const hashLabel = T(p, `h${i+1}("banana") = ${idx}`, {
      x: 200, y: hashY + i * 30, size: 18, fill: color, o: 0
    });
    tw(hashLabel, { o: 1 }, m(marks1[i]));
    const cellX = 100 + idx * 35 + 17;
    const arrow = drawArrow(p, 300, hashY + i * 30, cellX, bitArrayY - 10, color);
    tw(arrow, { o: 1 }, m(marks1[i]));
  });
  
  const result1 = T(p, '位置 2 为 0 → 一定不存在 ✓', {
    x: 200, y: 280, size: 22, weight: 600, fill: SUCCESS, o: 0
  });
  tw(result1, { o: 1 }, m('certain'));
  
  const cherryLabel = T(p, '查询："cherry"', { x: 600, y: 120, size: 24, weight: 600, fill: PRIMARY, o: 0 });
  tw(cherryLabel, { o: 1 }, m('cherry'));
  
  const queryIndices2 = [3, 7, 12];
  const marks2 = ['positions2', 'all_one', 'should_exist'];
  queryIndices2.forEach((idx, i) => {
    const colors = [WARNING, CYAN, PINK];
    const color = colors[i];
    const hashLabel = T(p, `h${i+1}("cherry") = ${idx}`, {
      x: 600, y: hashY + i * 30, size: 18, fill: color, o: 0
    });
    tw(hashLabel, { o: 1 }, m(marks2[i]));
    const cellX = 100 + idx * 35 + 17;
    const arrow = drawArrow(p, 650, hashY + i * 30, cellX, bitArrayY - 10, color);
    tw(arrow, { o: 1 }, m(marks2[i]));
  });
  
  const result2 = T(p, '所有位都是 1 → 可能存在 ⚠', {
    x: 600, y: 280, size: 22, weight: 600, fill: WARNING, o: 0
  });
  tw(result2, { o: 1 }, m('false_positive'));
  const falsePositive = T(p, '（实际未插入，这是误判）', {
    x: 600, y: 310, size: 18, fill: DANGER, o: 0
  });
  tw(falsePositive, { o: 1 }, m('coincidence'));
  
  const summary = T(p, '返回"不存在" → 100%准确；返回"可能存在" → 有误判', {
    x: 400, y: 500, size: 22, weight: 600, fill: PURPLE, anchor: 'middle', o: 0
  });
  tw(summary, { o: 1 }, m('maybe'));
}],

['false_positive', '误判率分析', (m, dur) => {
  const p = panel(0);
  T(p, '误判率（False Positive Rate）', { x: 400, y: 60, size: 36, weight: 700, fill: DARK, anchor: 'middle' });
  const box = mk('rect', { x: 80, y: 120, width: 640, height: 100, fill: LIGHT,
    stroke: WARNING, 'stroke-width': 3, rx: 8, o: 0 }, p);
  tw(box, { o: 1 }, m('calculation'));
  const def1 = T(p, '误判：元素未插入，但所有哈希位置都是 1', {
    x: 400, y: 155, size: 22, fill: DARK, anchor: 'middle', o: 0 });
  tw(def1, { o: 1 }, m('definition'));
  const def2 = T(p, '（因为其他元素恰好设置了这些位）', {
    x: 400, y: 190, size: 18, fill: DANGER, anchor: 'middle', o: 0 });
  tw(def2, { o: 1 }, m('reason'));
  
  const title = T(p, '误判率公式', { x: 400, y: 260, size: 28, weight: 600, fill: PURPLE, anchor: 'middle', o: 0 });
  tw(title, { o: 1 }, m('formula'));
  const formula = T(p, 'P ≈ (1 - e^(-kn/m))^k', {
    x: 400, y: 320, size: 36, weight: 700, family: 'monospace',
    fill: DARK, anchor: 'middle', o: 0
  });
  tw(formula, { o: 1 }, m('math'));
  
  const params = [
    { text: 'k = 哈希函数个数', y: 390, mark: 'parameters' },
    { text: 'n = 已插入元素数量', y: 430, mark: 'parameters' },
    { text: 'm = 位数组大小', y: 470, mark: 'optimal' }
  ];
  params.forEach(({ text, y, mark }) => {
    const label = T(p, text, { x: 150, y, size: 22, fill: DARK, o: 0 });
    tw(label, { o: 1 }, m(mark));
  });
  
  const optimal = T(p, '最优哈希函数个数：k = (m/n) × ln(2) ≈ 0.693 × (m/n)', {
    x: 400, y: 530, size: 20, weight: 600, fill: SUCCESS, anchor: 'middle', o: 0
  });
  tw(optimal, { o: 1 }, m('best_k'));
}],

['parameters', '参数选择示例', (m, dur) => {
  const p = panel(0);
  T(p, '参数配置示例', { x: 400, y: 50, size: 36, weight: 700, fill: DARK, anchor: 'middle' });
  const examples = [
    { title: '示例1：1亿URL，1%误判率', n: '100,000,000', fpr: '1%', m: '≈ 120 MB', k: '7', y: 130, color: PRIMARY, mark: 'example1' },
    { title: '示例2：1000万用户，0.1%误判率', n: '10,000,000', fpr: '0.1%', m: '≈ 18 MB', k: '10', y: 260, color: SUCCESS, mark: 'example2' },
    { title: '示例3：100万商品，5%误判率', n: '1,000,000', fpr: '5%', m: '≈ 800 KB', k: '4', y: 390, color: WARNING, mark: 'example3' }
  ];
  
  examples.forEach(({ title, n, fpr, m, k, y, color, mark }) => {
    const g = G(p, { x: 80, y, o: 0 });
    T(g, title, { x: 0, y: 0, size: 24, weight: 700, fill: color });
    T(g, `n = ${n}`, { x: 20, y: 35, size: 18, fill: DARK });
    T(g, `误判率 = ${fpr}`, { x: 20, y: 60, size: 18, fill: DARK });
    T(g, `位数组 = ${m}`, { x: 20, y: 85, size: 18, fill: DARK });
    T(g, `哈希函数 = ${k} 个`, { x: 20, y: 110, size: 18, fill: DARK });
    tw(g, { o: 1 }, m(mark));
  });
  
  const note = T(p, '误判率越低，需要的空间越大', {
    x: 400, y: 540, size: 24, weight: 600, fill: PURPLE, anchor: 'middle', o: 0 });
  tw(note, { o: 1 }, m('tradeoff'));
}],

['applications', '应用场景', (m, dur) => {
  const p = panel(0);
  T(p, '布隆过滤器的应用', { x: 400, y: 60, size: 36, weight: 700, fill: DARK, anchor: 'middle' });
  const applications = [
    { icon: '🗄️', title: 'Redis 缓存穿透防护', desc: '防止查询不存在的key打穿缓存', y: 150, color: PRIMARY, mark: 'redis' },
    { icon: '🕷️', title: '爬虫 URL 去重', desc: '百亿URL去重，内存占用仅几GB', y: 230, color: SUCCESS, mark: 'crawler' },
    { icon: '📧', title: '垃圾邮件过滤', desc: '快速判断邮件地址是否在黑名单', y: 310, color: WARNING, mark: 'spam' },
    { icon: '⛓️', title: '区块链轻节点', desc: 'Bitcoin SPV使用布隆过滤器同步交易', y: 390, color: CYAN, mark: 'blockchain' },
    { icon: '🔍', title: '数据库查询优化', desc: 'HBase/Cassandra用于快速判断行是否存在', y: 470, color: PURPLE, mark: 'database' }
  ];
  
  applications.forEach(({ icon, title, desc, y, color, mark }) => {
    const g = G(p, { x: 100, y, o: 0 });
    T(g, icon, { x: 0, y: 0, size: 36, anchor: 'middle' });
    T(g, title, { x: 70, y: -5, size: 24, weight: 700, fill: color, anchor: 'start' });
    T(g, desc, { x: 70, y: 25, size: 18, fill: DARK, anchor: 'start' });
    tw(g, { o: 1 }, m(mark));
  });
}],

['pros_cons', '优缺点分析', (m, dur) => {
  const p = panel(0);
  T(p, '优点 vs 缺点', { x: 400, y: 60, size: 36, weight: 700, fill: DARK, anchor: 'middle' });
  const prosTitle = T(p, '优点', { x: 200, y: 130, size: 28, weight: 700, fill: SUCCESS, anchor: 'middle', o: 0 });
  tw(prosTitle, { o: 1 }, m('summary'));
  
  const pros = [
    { text: '✓ 空间效率极高', y: 180, mark: 'space' },
    { text: '✓ 查询速度快 O(k)', y: 220, mark: 'speed' },
    { text: '✓ 不存储原始数据', y: 260, mark: 'privacy' },
    { text: '✓ 隐私保护好', y: 300, mark: 'privacy' },
    { text: '✓ 易于并行化', y: 340, mark: 'parallel' }
  ];
  pros.forEach(({ text, y, mark }) => {
    const label = T(p, text, { x: 100, y, size: 22, fill: SUCCESS, o: 0 });
    tw(label, { o: 1 }, m(mark));
  });
  
  const consTitle = T(p, '缺点', { x: 600, y: 130, size: 28, weight: 700, fill: DANGER, anchor: 'middle', o: 0 });
  tw(consTitle, { o: 1 }, m('false_positive'));
  
  const cons = [
    { text: '✗ 存在误判（假阳性）', y: 180, mark: 'false_positive' },
    { text: '✗ 不支持删除元素', y: 220, mark: 'no_delete' },
    { text: '✗ 无法获取原始数据', y: 260, mark: 'no_data' },
    { text: '✗ 不支持计数', y: 300, mark: 'no_count' },
    { text: '✗ 容量固定难扩展', y: 340, mark: 'fixed' }
  ];
  cons.forEach(({ text, y, mark }) => {
    const label = T(p, text, { x: 500, y, size: 22, fill: DANGER, o: 0 });
    tw(label, { o: 1 }, m(mark));
  });
  
  const suitable = T(p, '适用：允许少量误判，但空间受限的场景', {
    x: 400, y: 420, size: 24, weight: 600, fill: PURPLE, anchor: 'middle', o: 0
  });
  tw(suitable, { o: 1 }, m('acceptable'));
  const note = T(p, '注意：误判只会将"不存在"误判为"可能存在"', {
    x: 400, y: 460, size: 20, fill: WARNING, anchor: 'middle', o: 0
  });
  tw(note, { o: 1 }, m('no_fn'));
  const note2 = T(p, '不会将"存在"误判为"不存在"（无假阴性）', {
    x: 400, y: 495, size: 20, fill: SUCCESS, anchor: 'middle', o: 0
  });
  tw(note2, { o: 1 }, m('guarantee'));
}],

['variants', '变体和改进', (m, dur) => {
  const p = panel(0);
  T(p, '布隆过滤器的变体', { x: 400, y: 60, size: 36, weight: 700, fill: DARK, anchor: 'middle' });
  const variants = [
    { name: 'Counting Bloom Filter', desc: '用计数器代替位，支持删除', space: '空间增加 3-4 倍', y: 150, color: PRIMARY, mark: 'counting' },
    { name: 'Cuckoo Filter', desc: '基于布谷鸟哈希，支持删除', space: '空间类似，查询更快', y: 250, color: SUCCESS, mark: 'cuckoo' },
    { name: 'Scalable Bloom Filter', desc: '动态扩展，多个过滤器链', space: '容量可增长', y: 350, color: WARNING, mark: 'scalable' },
    { name: 'Blocked Bloom Filter', desc: '分块存储，缓存友好', space: '更好的CPU缓存性能', y: 450, color: CYAN, mark: 'blocked' }
  ];
  
  variants.forEach(({ name, desc, space, y, color, mark }) => {
    const g = G(p, { x: 80, y, o: 0 });
    T(g, name, { x: 0, y: 0, size: 26, weight: 700, fill: color });
    T(g, desc, { x: 20, y: 35, size: 20, fill: DARK });
    T(g, space, { x: 20, y: 65, size: 18, fill: color });
    tw(g, { o: 1 }, m(mark));
  });
}],

['implementation', '代码实现', (m, dur) => {
  const p = panel(0);
  T(p, '代码实现', { x: 400, y: 50, size: 36, weight: 700, fill: DARK, anchor: 'middle' });
  const code = `class BloomFilter {
  constructor(size, hashCount) {
    this.size = size;
    this.hashCount = hashCount;
    this.bits = new Array(size).fill(0);
  }
  
  hash(str, seed) {
    let h = seed;
    for (let i = 0; i < str.length; i++) {
      h = (h * 31 + str.charCodeAt(i)) % this.size;
    }
    return h;
  }
  
  add(item) {
    for (let i = 0; i < this.hashCount; i++) {
      const index = this.hash(item, i);
      this.bits[index] = 1;
    }
  }
  
  contains(item) {
    for (let i = 0; i < this.hashCount; i++) {
      const index = this.hash(item, i);
      if (this.bits[index] === 0) {
        return false;  // 一定不存在
      }
    }
    return true;  // 可能存在（或误判）
  }
}

// 使用示例
const bf = new BloomFilter(1000, 3);
bf.add("apple");
bf.contains("apple");   // true（确实存在）
bf.contains("banana");  // false（一定不存在）
bf.contains("cherry");  // 可能误判为true`;
  
  const codeElem = T(p, code, { x: 50, y: 110, size: 13, family: 'monospace', fill: DARK, o: 0 });
  codeElem.setAttribute('white-space', 'pre');
  tw(codeElem, { o: 1 }, m('code'));
}],

['summary', '总结', (m, dur) => {
  const p = panel(0);
  T(p, '布隆过滤器总结', { x: 400, y: 60, size: 40, weight: 700, fill: DARK, anchor: 'middle' });
  const points = [
    { text: '✓ 位数组 + 多个哈希函数', y: 160, color: PRIMARY, mark: 'components' },
    { text: '✓ 空间效率极高，速度快', y: 220, color: SUCCESS, mark: 'advantage' },
    { text: '✓ 无假阴性，有假阳性', y: 280, color: WARNING, mark: 'characteristic' },
    { text: '✓ 误判率可通过参数控制', y: 340, color: CYAN, mark: 'control' },
    { text: '✓ 适合海量数据快速判断', y: 400, color: PURPLE, mark: 'suitable' }
  ];
  
  points.forEach(({ text, y, color, mark }) => {
    const label = T(p, text, { x: 120, y, size: 28, weight: 600, fill: color, o: 0 });
    tw(label, { o: 1 }, m(mark));
  });
  
  const core = T(p, '核心思想：用小概率误判换取巨大空间节省', { 
    x: 400, y: 490, size: 28, weight: 700, fill: PURPLE, anchor: 'middle', o: 0 });
  tw(core, { o: 1 }, m('tradeoff'));
  const footer = T(p, '大数据场景的利器', { 
    x: 400, y: 540, size: 24, fill: DARK, anchor: 'middle', o: 0 });
  tw(footer, { o: 1 }, m('tool'));
}]

];
"""

# 组装完整文件
new_content = header + beats_code + "\n" + footer

# 写入文件
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("✅ Complete fix applied successfully!")
print("All 12 beats now use (m, dur) => signature and m('mark') timing.")
