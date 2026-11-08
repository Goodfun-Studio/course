// 验证脚本：测量动画/旁白比值和内容覆盖率
const fs = require('fs');
const path = require('path');

// 读取 timings.js
const timingsPath = path.join(__dirname, 'audio/zh/timings.js');
const timingsContent = fs.readFileSync(timingsPath, 'utf-8');
// 提取 TIMINGS 对象
const timingsMatch = timingsContent.match(/const TIMINGS = ({[\s\S]*});/);
if (!timingsMatch) {
  console.error('无法解析 TIMINGS');
  process.exit(1);
}
const TIMINGS = eval('(' + timingsMatch[1] + ')');

// 读取 index.html
const htmlPath = path.join(__dirname, 'index.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf-8');

// 提取所有 beat 定义
const beatPattern = /\['(\w+)',\s*'[^']*',\s*\(m,\s*dur\)\s*=>\s*{([\s\S]*?)\}\],/g;
const beats = [];
let match;
while ((match = beatPattern.exec(htmlContent)) !== null) {
  beats.push({
    id: match[1],
    code: match[2]
  });
}

console.log(`找到 ${beats.length} 个 beat\n`);
console.log('验证结果：\n');
console.log('Beat ID          | 动画/旁白比值 | 内容覆盖率 | 状态');
console.log('----------------|-------------|----------|------');

beats.forEach(beat => {
  const timing = TIMINGS[beat.id];
  if (!timing) {
    console.log(`${beat.id.padEnd(16)}| 未找到 timing 数据`);
    return;
  }

  // 提取所有 tw() 调用的时间
  const twPattern = /tw\([^,]+,\s*{[^}]*},\s*([^,\)]+)/g;
  const times = [];
  let twMatch;
  while ((twMatch = twPattern.exec(beat.code)) !== null) {
    const timeExpr = twMatch[1].trim();
    // 简化评估：假设 m('mark') 被替换为实际值
    // 这里我们只检查是否使用了 m() 而不是硬编码数字
    if (!timeExpr.match(/^\d+(\.\d+)?$/)) {
      times.push(timeExpr);
    }
  }

  // 检查签名
  const hasCorrectSignature = htmlContent.includes(`['${beat.id}', '`, beat.code) && 
                              htmlContent.includes(`(m, dur) =>`);

  // 指标1：比值检查（需要实际运行才能准确计算，这里做简单检查）
  const usesMarks = times.some(t => t.includes('m('));
  const ratio = usesMarks ? '✓ 使用 marks' : '✗ 硬编码';
  
  // 指标2：内容覆盖率（简化检查）
  const hasDurParam = beat.code.includes('(m, dur)') || htmlContent.includes(`['${beat.id}', '`) && htmlContent.includes('(m, dur)');
  const coverage = hasDurParam ? '✓ 有 dur 参数' : '✗ 缺少 dur';

  const status = usesMarks && hasDurParam ? '✓ 通过' : '✗ 需要修复';

  console.log(`${beat.id.padEnd(16)}| ${ratio.padEnd(11)} | ${coverage.padEnd(8)} | ${status}`);
});

console.log('\n详细说明：');
console.log('- 动画/旁白比值：检查是否使用 m() 获取 marks 时间而非硬编码');
console.log('- 内容覆盖率：检查 beat 函数是否有 (m, dur) 参数');
console.log('\n注意：精确的比值和覆盖率需要在浏览器中运行实际测量。');
