#!/usr/bin/env node
// 自动修复 ch25 的时间参数

const fs = require('fs');
const path = require('path');

const htmlPath = path.join(process.env.HOME, 'course/algorithms/ch25/index.html');
let content = fs.readFileSync(htmlPath, 'utf-8');

// Beat 定义
const beatDefs = [
  'intro', 'problem', 'structure', 'build_intro', 'build_demo',
  'query_intro', 'query_demo', 'update_point', 'lazy_intro', 'lazy_demo',
  'implementation', 'complexity', 'applications', 'vs_fenwick', 'summary'
];

// 提取每个 beat 函数
function extractBeatFunction(content, beatName) {
  const regex = new RegExp(`function\\s+${beatName}\\s*\\(\\s*\\)\\s*\\{([\\s\\S]*?)(?=\\nfunction\\s+\\w+\\s*\\(\\s*\\)\\s*\\{|\\n\\/\\*\\s*----------)`);
  const match = content.match(regex);
  if (!match) return null;
  
  const fullMatch = match[0];
  const body = match[1];
  const startIndex = content.indexOf(fullMatch);
  
  return { fullMatch, body, startIndex };
}

// 计算动画结束时间
function calculateAnimEnd(body) {
  let tlStart = 0, tlEnd = 0;
  const tlPattern = /tl\([^,]+,\s*([^,]+),/g;
  let match;
  
  while ((match = tlPattern.exec(body)) !== null) {
    const posArg = match[1].trim();
    let t0;
    
    if (/^[\d.]+$/.test(posArg)) {
      t0 = parseFloat(posArg);
    } else if (posArg === "'<'" || posArg === '"<"') {
      t0 = tlStart;
    } else if (/^['"]>/.test(posArg)) {
      const offsetMatch = posArg.match(/['"]>([\d.+-]+)/);
      if (offsetMatch) {
        const offset = parseFloat(offsetMatch[1]);
        t0 = tlEnd + (isNaN(offset) ? 0 : offset);
      } else {
        t0 = tlEnd;
      }
    } else {
      continue;
    }
    
    tlStart = t0;
    tlEnd = Math.max(tlEnd, t0 + 0.6);
  }
  
  return tlEnd;
}

// 修复一个 beat 函数
function fixBeatFunction(body, factor) {
  // 替换所有 tl() 调用中的数字和偏移
  return body.replace(/tl\(([^,]+),\s*([^,]+),/g, (match, elem, pos) => {
    const posArg = pos.trim();
    let newPos;
    
    if (/^[\d.]+$/.test(posArg)) {
      // 纯数字
      const num = parseFloat(posArg);
      const scaled = num * factor;
      newPos = scaled.toFixed(2);
    } else if (posArg === "'<'" || posArg === '"<"') {
      // '<' 保持不变
      newPos = posArg;
    } else if (/^['"]>/.test(posArg)) {
      // '>偏移' 或 '>数字'
      const quote = posArg[0];
      const offsetMatch = posArg.match(/['"]>([\d.+-]+)/);
      if (offsetMatch) {
        const offset = parseFloat(offsetMatch[1]);
        const scaled = offset * factor;
        newPos = `${quote}>${scaled.toFixed(2)}${quote}`;
      } else {
        // 只有 '>' 没有数字，保持不变
        newPos = posArg;
      }
    } else {
      // 其他情况（变量等），保持不变
      newPos = posArg;
    }
    
    return `tl(${elem}, ${newPos},`;
  });
}

// 处理所有 beat
beatDefs.forEach(beatName => {
  console.log(`Processing ${beatName}...`);
  
  const extracted = extractBeatFunction(content, beatName);
  if (!extracted) {
    console.log(`  ⚠️  Could not extract function`);
    return;
  }
  
  const animEnd = calculateAnimEnd(extracted.body);
  const targetDur = 20 * 0.9;
  const factor = animEnd > 0 ? targetDur / animEnd : 1;
  
  console.log(`  AnimEnd: ${animEnd.toFixed(2)}s, Factor: ${factor.toFixed(2)}x`);
  
  const fixedBody = fixBeatFunction(extracted.body, factor);
  const fixedFunction = extracted.fullMatch.replace(extracted.body, fixedBody);
  
  // 替换原函数
  content = content.slice(0, extracted.startIndex) + fixedFunction + content.slice(extracted.startIndex + extracted.fullMatch.length);
  
  console.log(`  ✓ Fixed`);
});

// 写回文件
fs.writeFileSync(htmlPath, content, 'utf-8');
console.log('\n✅ All beats fixed!');
