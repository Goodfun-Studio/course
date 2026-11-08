#!/usr/bin/env node
// 分析 ch25 的每个 beat，计算缩放因子

const fs = require('fs');
const path = require('path');

const htmlPath = path.join(process.env.HOME, 'course/algorithms/ch25/index.html');
const content = fs.readFileSync(htmlPath, 'utf-8');

// 提取所有 beat 函数
const beatPattern = /function\s+(\w+)\(\s*\)\s*\{([\s\S]*?)(?=\nfunction\s+\w+\(\s*\)\s*\{|\n\/\*\s*----------)/g;
const beats = [];
let match;

while ((match = beatPattern.exec(content)) !== null) {
  const [, name, body] = match;
  beats.push({ name, body, start: match.index });
}

console.log(`Found ${beats.length} beat functions\n`);

// 分析每个 beat 的时间轴
beats.forEach(beat => {
  let tlStart = 0, tlEnd = 0;
  const animations = [];
  
  // 匹配所有 tl() 调用
  const tlPattern = /tl\([^,]+,\s*([^,]+),/g;
  let tlMatch;
  
  while ((tlMatch = tlPattern.exec(beat.body)) !== null) {
    const posArg = tlMatch[1].trim();
    let t0;
    
    if (/^[\d.]+$/.test(posArg)) {
      // 数字
      t0 = parseFloat(posArg);
    } else if (posArg === "'<'" || posArg === '"<"') {
      // '<' - 与前一个同时
      t0 = tlStart;
    } else if (/^['"]>/.test(posArg)) {
      // '>偏移'
      const offsetMatch = posArg.match(/['"]>([\d.+-]+)/);
      if (offsetMatch) {
        const offset = parseFloat(offsetMatch[1]);
        t0 = tlEnd + (isNaN(offset) ? 0 : offset);
      } else {
        t0 = tlEnd;
      }
    } else {
      continue; // 无法解析，跳过
    }
    
    tlStart = t0;
    tlEnd = Math.max(tlEnd, t0 + 0.6);
    animations.push({ pos: posArg, t0, tlEnd });
  }
  
  const animEnd = tlEnd;
  const targetDur = 20 * 0.9; // 18 秒
  const factor = animEnd > 0 ? targetDur / animEnd : 1;
  const ratio = animEnd / 20;
  const coverage = animEnd / 20;
  
  console.log(`${beat.name}:`);
  console.log(`  Current animEnd: ${animEnd.toFixed(2)}s`);
  console.log(`  Target: ${targetDur.toFixed(2)}s`);
  console.log(`  Scale factor: ${factor.toFixed(2)}x`);
  console.log(`  Current ratio: ${ratio.toFixed(2)}`);
  console.log(`  Animations: ${animations.length}`);
  console.log();
});
