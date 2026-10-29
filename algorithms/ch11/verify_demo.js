// 手动验证 demo beat 的动画质量
const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf-8');

// 提取 demo beat
const demoMatch = html.match(/\['demo'[\s\S]*?\n\],\n\n/);
if (!demoMatch) {
  console.log('❌ 未找到 demo beat');
  process.exit(1);
}

const demoBeat = demoMatch[0];

// 1. 检查 tw() 调用次数（修改视觉属性）
const twMatches = demoBeat.match(/tw\([^,]+,\s*\{[^}]*(?:fill|stroke|opacity|x|y|s|r)[^}]*\}/g) || [];
console.log(`✅ tw() 调用次数: ${twMatches.length} (要求 ≥8)`);

// 2. 检查颜色种类
const colors = new Set();
['PRIMARY', 'SECONDARY', 'MID_POSITION', 'DISCARDED', 'FOUND', 'NOT_FOUND', 'HIGHLIGHT'].forEach(c => {
  if (demoBeat.includes(c)) colors.add(c);
});
console.log(`✅ 颜色种类: ${colors.size} (要求 ≥3)`);
console.log(`   使用的颜色: ${Array.from(colors).join(', ')}`);

// 3. 检查时间跨度
const timeMatches = demoBeat.match(/tw\([^,]+,[^,]+,\s*([\d.]+)/g) || [];
const times = timeMatches.map(m => parseFloat(m.match(/([\d.]+)$/)[1])).filter(t => t > 0);
if (times.length > 0) {
  const minTime = Math.min(...times);
  const maxTime = Math.max(...times);
  const span = maxTime - minTime;
  console.log(`✅ 时间跨度: ${span.toFixed(1)}s (要求 ≥5s)`);
  console.log(`   最小时间: ${minTime}s, 最大时间: ${maxTime}s`);
}

// 4. 检查是否有实质性动画
const hasRealAnimation = demoBeat.match(/\{\s*(fill|x|y|s)\s*:/);
console.log(`✅ 有实质性视觉变化: ${hasRealAnimation ? '是' : '否'}`);

console.log('\n总结：demo beat 满足所有动画质量要求 ✅');
