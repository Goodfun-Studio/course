#!/usr/bin/env node
// 更准确地修复 ch25 的时间参数 - 考虑替换后的实际效果

const fs = require('fs');
const path = require('path');

const htmlPath = path.join(process.env.HOME, 'course/algorithms/ch25/index.html');
let content = fs.readFileSync(htmlPath, 'utf-8');

const beatDefs = [
  'intro', 'problem', 'structure', 'build_intro', 'build_demo',
  'query_intro', 'query_demo', 'update_point', 'lazy_intro', 'lazy_demo',
  'implementation', 'complexity', 'applications', 'vs_fenwick', 'summary'
];

function extractBeatFunction(content, beatName) {
  const regex = new RegExp(`function\\s+${beatName}\\s*\\(\\s*\\)\\s*\\{([\\s\\S]*?)(?=\\nfunction\\s+\\w+\\s*\\(\\s*\\)\\s*\\{|\\n\\/\\*\\s*----------)`);
  const match = content.match(regex);
  if (!match) return null;
  
  const fullMatch = match[0];
  const body = match[1];
  const startIndex = content.indexOf(fullMatch);
  
  return { fullMatch, body, startIndex };
}

// 解析 tl() 调用，返回带位置信息的列表
function parseTlCalls(body) {
  const calls = [];
  const tlPattern = /tl\(([^,]+),\s*([^,]+),/g;
  let match;
  
  while ((match = tlPattern.exec(body)) !== null) {
    calls.push({
      fullMatch: match[0],
      elem: match[1].trim(),
      pos: match[2].trim(),
      index: match.index
    });
  }
  
  return calls;
}

// 计算缩放后的动画结束时间
function simulateAnimEnd(calls, factor) {
  let tlStart = 0, tlEnd = 0;
  
  for (const call of calls) {
    const posArg = call.pos;
    let t0;
    
    if (/^[\d.]+$/.test(posArg)) {
      const num = parseFloat(posArg);
      t0 = num * factor;
    } else if (posArg === "'<'" || posArg === '"<"') {
      t0 = tlStart;
    } else if (/^['"]>/.test(posArg)) {
      const offsetMatch = posArg.match(/['"]>([\d.+-]+)/);
      if (offsetMatch) {
        const offset = parseFloat(offsetMatch[1]);
        t0 = tlEnd + offset * factor;
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

// 应用缩放到函数体
function applyScaling(body, factor) {
  return body.replace(/tl\(([^,]+),\s*([^,]+),/g, (match, elem, pos) => {
    const posArg = pos.trim();
    let newPos;
    
    if (/^[\d.]+$/.test(posArg)) {
      const num = parseFloat(posArg);
      const scaled = num * factor;
      newPos = scaled.toFixed(2);
    } else if (posArg === "'<'" || posArg === '"<"') {
      newPos = posArg;
    } else if (/^['"]>/.test(posArg)) {
      const quote = posArg[0];
      const offsetMatch = posArg.match(/['"]>([\d.+-]+)/);
      if (offsetMatch) {
        const offset = parseFloat(offsetMatch[1]);
        const scaled = offset * factor;
        newPos = `${quote}>${scaled.toFixed(2)}${quote}`;
      } else {
        newPos = posArg;
      }
    } else {
      newPos = posArg;
    }
    
    return `tl(${elem}, ${newPos},`;
  });
}

// 处理所有 beat，迭代调整因子
beatDefs.forEach(beatName => {
  console.log(`Processing ${beatName}...`);
  
  const extracted = extractBeatFunction(content, beatName);
  if (!extracted) {
    console.log(`  ⚠️  Could not extract function`);
    return;
  }
  
  const calls = parseTlCalls(extracted.body);
  const targetDur = 20 * 0.9; // 18 秒
  
  // 初始因子
  const initialEnd = simulateAnimEnd(calls, 1.0);
  let factor = targetDur / initialEnd;
  
  // 模拟缩放后的效果
  let simEnd = simulateAnimEnd(calls, factor);
  console.log(`  Initial: ${initialEnd.toFixed(2)}s, Factor: ${factor.toFixed(2)}x → Sim: ${simEnd.toFixed(2)}s`);
  
  // 如果误差较大，迭代调整
  let iterations = 0;
  while (Math.abs(simEnd - targetDur) > 0.5 && iterations < 5) {
    factor = factor * (targetDur / simEnd);
    simEnd = simulateAnimEnd(calls, factor);
    iterations++;
    console.log(`  Iteration ${iterations}: Factor: ${factor.toFixed(2)}x → Sim: ${simEnd.toFixed(2)}s`);
  }
  
  const fixedBody = applyScaling(extracted.body, factor);
  const fixedFunction = extracted.fullMatch.replace(extracted.body, fixedBody);
  
  content = content.slice(0, extracted.startIndex) + fixedFunction + content.slice(extracted.startIndex + extracted.fullMatch.length);
  
  console.log(`  ✓ Fixed with factor ${factor.toFixed(2)}x`);
});

fs.writeFileSync(htmlPath, content, 'utf-8');
console.log('\n✅ All beats fixed!');
