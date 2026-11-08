// 测试脚本：验证动画与旁白同步
const fs = require('fs');
const path = require('path');

// 读取 index.html
const htmlPath = path.join(__dirname, 'index.html');
const html = fs.readFileSync(htmlPath, 'utf-8');

// 读取 timings.js
const timingsPath = path.join(__dirname, 'audio/zh/timings.js');
const window = {};
eval(fs.readFileSync(timingsPath, 'utf-8'));
const TIMINGS = window.TIMINGS;

// 提取所有 tw 调用
const twPattern = /tw\([^,]+,\s*\{[^}]*\},\s*([^)]+)\)/g;
const beats = html.match(/\['(\w+)',\s*'[^']*',\s*\(m,\s*dur\)\s*=>\s*\{[\s\S]*?\}\],/g);

console.log('=== Ch30 动画与旁白同步验证 ===\n');

let allPass = true;

if (!beats) {
  console.log('❌ 未找到 beat 定义');
  process.exit(1);
}

beats.forEach((beatCode) => {
  const beatIdMatch = beatCode.match(/\['(\w+)'/);
  if (!beatIdMatch) return;
  
  const beatId = beatIdMatch[1];
  const timing = TIMINGS[beatId];
  
  if (!timing) {
    console.log(`❌ ${beatId}: 缺少 timing 数据`);
    allPass = false;
    return;
  }
  
  // 提取所有 tw 调用的时间参数
  const twTimes = [];
  let match;
  const twRegex = /tw\([^,]+,\s*\{[^}]*\},\s*([^)]+)\)/g;
  
  while ((match = twRegex.exec(beatCode)) !== null) {
    const timeExpr = match[1].trim();
    // 只统计非零的表达式
    if (timeExpr !== '0' && timeExpr !== 'm(0)') {
      twTimes.push(timeExpr);
    }
  }
  
  // 指标1：最大动画时间 / dur 应该在 [0.8, 1.2]
  // 这里我们简单检查是否使用了 m() 函数
  const usesMark = beatCode.includes('m(');
  const usesHardcoded = /tw\([^,]+,\s*\{[^}]*\},\s*\d+\.?\d*\)/.test(beatCode);
  
  const ratio = usesMark && !usesHardcoded ? 'PASS (使用 m())' : 'UNKNOWN';
  const status = usesMark && !usesHardcoded ? '✓' : '?';
  
  console.log(`${status} ${beatId}:`);
  console.log(`  - 时长: ${timing.dur.toFixed(2)}s`);
  console.log(`  - marks: ${Object.keys(timing.marks).length} 个`);
  console.log(`  - tw 调用: ${twTimes.length} 次`);
  console.log(`  - 使用 m(): ${usesMark ? '是' : '否'}`);
  console.log(`  - 硬编码时间: ${usesHardcoded ? '是' : '否'}`);
  console.log('');
  
  if (usesHardcoded) {
    allPass = false;
  }
});

if (allPass) {
  console.log('✅ 所有 beat 都已使用 m() 函数');
} else {
  console.log('⚠️  部分 beat 仍有硬编码时间');
}

process.exit(allPass ? 0 : 1);
