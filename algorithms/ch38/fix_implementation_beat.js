const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

// 找到 implementation beat 的位置
const implStartPattern = /\['implementation', '代码实现', \(m, dur\) => \{/;
const implEndPattern = /\}\],\s*\n\s*\['summary'/;

const startMatch = html.match(implStartPattern);
if (!startMatch) {
  console.error('Cannot find implementation beat');
  process.exit(1);
}

const startIndex = html.indexOf(startMatch[0]);
const endMatch = html.substring(startIndex).match(implEndPattern);
if (!endMatch) {
  console.error('Cannot find implementation beat end');
  process.exit(1);
}

const endIndex = startIndex + html.substring(startIndex).indexOf(endMatch[0]);

// 新的 implementation beat 实现
const newImpl = `['implementation', '代码实现', (m, dur) => {
  const p = panel(0);
  
  const title = T(p, '代码实现', { x: 400, y: 50, size: 36, weight: 700, fill: DARK, anchor: 'middle', o: 0 });
  tw(title, { o: 1 }, m('code'));
  
  // 代码段落分步展示
  const sections = [
    { 
      text: \`class BloomFilter {\`, 
      y: 110, 
      color: PURPLE,
      mark: 'class' 
    },
    { 
      text: \`  constructor(size, hashCount) {
    this.size = size;
    this.hashCount = hashCount;\`, 
      y: 140, 
      color: PRIMARY,
      mark: 'constructor' 
    },
    { 
      text: \`    this.bits = new Array(size).fill(0);
  }\`, 
      y: 200, 
      color: SUCCESS,
      mark: 'init' 
    },
    { 
      text: \`  hash(str, seed) {\`, 
      y: 250, 
      color: WARNING,
      mark: 'hash_function' 
    },
    { 
      text: \`    let h = seed;
    for (let i = 0; i < str.length; i++) {
      h = (h * 31 + str.charCodeAt(i)) % this.size;
    }
    return h;
  }\`, 
      y: 280, 
      color: CYAN,
      mark: 'seed' 
    },
    { 
      text: \`  add(item) {\`, 
      y: 360, 
      color: PINK,
      mark: 'add' 
    },
    { 
      text: \`    for (let i = 0; i < this.hashCount; i++) {
      const index = this.hash(item, i);
      this.bits[index] = 1;
    }
  }\`, 
      y: 390, 
      color: SUCCESS,
      mark: 'set_bits' 
    },
    { 
      text: \`  contains(item) {\`, 
      y: 460, 
      color: PRIMARY,
      mark: 'contains' 
    },
    { 
      text: \`    for (let i = 0; i < this.hashCount; i++) {
      const index = this.hash(item, i);
      if (this.bits[index] === 0) {\`, 
      y: 490, 
      color: WARNING,
      mark: 'check_bits' 
    },
    { 
      text: \`        return false;  // 一定不存在
      }
    }\`, 
      y: 540, 
      color: DANGER,
      mark: 'return_false' 
    },
    { 
      text: \`    return true;  // 可能存在
  }
}\`, 
      y: 580, 
      color: SUCCESS,
      mark: 'return_true' 
    }
  ];
  
  // 逐段显示代码
  sections.forEach(({ text, y, color, mark }) => {
    const elem = T(p, text, { 
      x: 50, y, 
      size: 12, 
      family: 'monospace', 
      fill: color, 
      o: 0 
    });
    elem.setAttribute('white-space', 'pre');
    tw(elem, { o: 1 }, m(mark));
  });
  
  // 使用示例
  const usageTitle = T(p, '使用示例', { 
    x: 450, y: 110, 
    size: 24, 
    weight: 600, 
    fill: PURPLE, 
    o: 0 
  });
  tw(usageTitle, { o: 1 }, m('usage'));
  
  const usageCode = [
    { text: \`const bf = new BloomFilter(1000, 3);\`, y: 150, mark: 'create' },
    { text: \`bf.add("apple");\`, y: 180, mark: 'create' },
    { text: \`bf.contains("apple");   // true\`, y: 210, mark: 'test1' },
    { text: \`bf.contains("banana");  // false\`, y: 240, mark: 'test2' },
    { text: \`bf.contains("cherry");  // 可能误判\`, y: 270, mark: 'test3' }
  ];
  
  usageCode.forEach(({ text, y, mark }) => {
    const elem = T(p, text, { 
      x: 450, y, 
      size: 14, 
      family: 'monospace', 
      fill: DARK, 
      o: 0 
    });
    tw(elem, { o: 1 }, m(mark));
  });
  
  // 添加注释框
  const note = T(p, '完整的布隆过滤器实现', { 
    x: 400, y: 320, 
    size: 18, 
    weight: 600, 
    fill: PURPLE, 
    anchor: 'middle', 
    o: 0 
  });
  tw(note, { o: 1 }, m('simple'));
}]`;

// 替换
const before = html.substring(0, startIndex);
const after = html.substring(endIndex);
const newHtml = before + newImpl + after;

fs.writeFileSync('index.html', newHtml);
console.log('✅ Fixed implementation beat');
