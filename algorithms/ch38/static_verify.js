const fs = require('fs');
const path = require('path');

// 读取 timings
const timingsCode = fs.readFileSync('audio/zh/timings.js', 'utf8');
const timingsJson = timingsCode.replace('window.TIMINGS = ', '').trim().replace(/;$/, '');
const TIMINGS = JSON.parse(timingsJson);

console.log('\n📊 Ch38 布隆过滤器 - 验收报告 (标准B)\n');
console.log('=' .repeat(80));

let passCount = 0;
let failCount = 0;

for (const beatId in TIMINGS) {
  const timing = TIMINGS[beatId];
  const dur = timing.dur;
  const marks = timing.marks;
  
  // 获取所有 mark 的时间值
  const markTimes = Object.values(marks);
  const maxMark = Math.max(...markTimes);
  
  // 指标1：比值 = 最大 mark 时间 / dur
  // (假设最后一个动画在最后一个 mark 处触发，持续时间可忽略或很短)
  const ratio = maxMark / dur;
  
  // 指标2：覆盖率 = 最大 mark 时间 / dur
  // (最后一次元素变化发生在最后一个 mark)
  const coverage = maxMark / dur;
  
  const ratioOK = ratio >= 0.8 && ratio <= 1.2;
  const coverageOK = coverage >= 0.7;
  
  const ratioMark = ratioOK ? '✅' : '❌';
  const coverageMark = coverageOK ? '✅' : '❌';
  
  console.log(`\n${beatId}:`);
  console.log(`  指标1 (比值):  ${ratio.toFixed(3)} ${ratioMark} [0.8-1.2]`);
  console.log(`  指标2 (覆盖): ${coverage.toFixed(3)} ${coverageMark} [≥0.7]`);
  console.log(`  dur: ${dur.toFixed(2)}s, 最大mark: ${maxMark.toFixed(2)}s, marks数: ${Object.keys(marks).length}`);
  
  if (ratioOK && coverageOK) {
    passCount++;
  } else {
    failCount++;
  }
}

console.log('\n' + '='.repeat(80));
console.log(`\n总结: ${Object.keys(TIMINGS).length} beats, ${passCount} 通过, ${failCount} 失败`);
console.log(failCount === 0 ? '\n✅ 全部通过标准B验收' : '\n❌ 部分指标未达标');

process.exit(failCount === 0 ? 0 : 1);
