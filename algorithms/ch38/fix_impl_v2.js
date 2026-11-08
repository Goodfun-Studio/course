const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

// 找到 implementation beat
const startPattern = /\['implementation', '代码实现', \(m, dur\) => \{/;
const endPattern = /\}\],\s*\n\s*\['summary'/;

const startMatch = html.match(startPattern);
if (!startMatch) {
  console.error('Cannot find implementation beat');
  process.exit(1);
}

const startIndex = html.indexOf(startMatch[0]);
const endMatch = html.substring(startIndex).match(endPattern);
if (!endMatch) {
  console.error('Cannot find end');
  process.exit(1);
}

const endIndex = startIndex + html.substring(startIndex).indexOf(endMatch[0]);

// 新实现 - 使用单引号避免转义问题
const newImpl = `['implementation', '代码实现', (m, dur) => {
  const p = panel(0);
  
  const title = T(p, '代码实现', { x: 400, y: 50, size: 36, weight: 700, fill: DARK, anchor: 'middle', o: 0 });
  tw(title, { o: 1 }, m('code'));
  
  // 代码行逐步显示
  const codeLines = [
    { text: 'class BloomFilter {', y: 110, mark: 'class', color: PURPLE },
    { text: '  constructor(size, hashCount) {', y: 135, mark: 'constructor', color: PRIMARY },
    { text: '    this.size = size;', y: 160, mark: 'constructor', color: DARK },
    { text: '    this.hashCount = hashCount;', y: 185, mark: 'init', color: DARK },
    { text: '    this.bits = new Array(size).fill(0);', y: 210, mark: 'init', color: SUCCESS },
    { text: '  }', y: 235, mark: 'init', color: DARK },
    { text: '  hash(str, seed) {', y: 270, mark: 'hash_function', color: WARNING },
    { text: '    let h = seed;', y: 295, mark: 'simple', color: DARK },
    { text: '    for (let i = 0; i < str.length; i++)', y: 320, mark: 'simple', color: DARK },
    { text: '      h = (h * 31 + str.charCodeAt(i)) % this.size;', y: 345, mark: 'seed', color: CYAN },
    { text: '    return h;', y: 370, mark: 'seed', color: DARK },
    { text: '  }', y: 395, mark: 'seed', color: DARK },
    { text: '  add(item) {', y: 430, mark: 'add', color: PINK },
    { text: '    for (let i = 0; i < this.hashCount; i++)', y: 455, mark: 'add', color: DARK },
    { text: '      this.bits[this.hash(item, i)] = 1;', y: 480, mark: 'set_bits', color: SUCCESS },
    { text: '  }', y: 505, mark: 'set_bits', color: DARK },
    { text: '  contains(item) {', y: 540, mark: 'contains', color: PRIMARY },
    { text: '    for (let i = 0; i < this.hashCount; i++)', y: 565, mark: 'check_bits', color: DARK },
    { text: '      if (this.bits[this.hash(item, i)] === 0)', y: 590, mark: 'check_bits', color: WARNING },
    { text: '        return false;', y: 615, mark: 'return_false', color: DANGER },
    { text: '    return true;', y: 640, mark: 'return_true', color: SUCCESS },
    { text: '  }', y: 665, mark: 'return_true', color: DARK },
    { text: '}', y: 690, mark: 'return_true', color: PURPLE }
  ];
  
  codeLines.forEach(({ text, y, mark, color }) => {
    const line = T(p, text, { x: 50, y, size: 14, family: 'monospace', fill: color, o: 0 });
    tw(line, { o: 1 }, m(mark));
  });
  
  // 使用示例区域
  const exampleBox = mk('rect', {
    x: 480, y: 100, width: 300, height: 200,
    fill: LIGHT, stroke: PRIMARY, 'stroke-width': 2, rx: 8, o: 0
  }, p);
  tw(exampleBox, { o: 1 }, m('usage'));
  
  const usageTitle = T(p, '使用示例', { x: 630, y: 130, size: 20, weight: 600, fill: PRIMARY, anchor: 'middle', o: 0 });
  tw(usageTitle, { o: 1 }, m('usage'));
  
  const examples = [
    { text: 'const bf = new BloomFilter(1000, 3);', y: 165, mark: 'create' },
    { text: 'bf.add("apple");', y: 195, mark: 'create' },
    { text: 'bf.contains("apple");  // true', y: 225, mark: 'test1' },
    { text: 'bf.contains("banana"); // false', y: 255, mark: 'test2' },
    { text: 'bf.contains("cherry"); // 误判?', y: 285, mark: 'test3' }
  ];
  
  examples.forEach(({ text, y, mark }) => {
    const ex = T(p, text, { x: 500, y, size: 13, family: 'monospace', fill: DARK, o: 0 });
    tw(ex, { o: 1 }, m(mark));
  });
}]`;

const before = html.substring(0, startIndex);
const after = html.substring(endIndex);
const newHtml = before + newImpl + after;

fs.writeFileSync('index.html', newHtml);
console.log('✅ Fixed implementation beat v2');
