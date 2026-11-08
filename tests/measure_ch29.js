const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const filePath = path.join(__dirname, '../algorithms/ch29/index.html');
  await page.goto(`file://${filePath}`);
  
  // 等待页面完全加载
  await page.waitForTimeout(2000);
  
  // 执行测量脚本
  const results = await page.evaluate(() => {
    const results = [];
    
    window.BEATS.forEach((b, i) => {
      // 设置当前 beat
      P.i = i;
      P.end = runBeat(i);
      
      // 计算最大动画时间
      const maxAnimTime = Math.max(0, ...TW.map(w => w.t0 + w.dur));
      
      // 获取旁白时长
      const narrationDur = TIMINGS[b.id].dur;
      
      // 计算比值
      const ratio = maxAnimTime / narrationDur;
      
      results.push({
        beatId: b.id,
        maxAnimTime: maxAnimTime.toFixed(2),
        narrationDur: narrationDur.toFixed(2),
        ratio: ratio.toFixed(3),
        inRange: ratio >= 0.8 && ratio <= 1.2
      });
    });
    
    return results;
  });
  
  // 输出结果
  console.log('=' .repeat(80));
  console.log('CH29 双向BFS 实测动画/旁白比值');
  console.log('=' .repeat(80));
  console.log();
  
  let passCount = 0;
  results.forEach(r => {
    const status = r.inRange ? '✓' : '✗';
    console.log(`${status} ${r.beatId.padEnd(30)} | 动画: ${r.maxAnimTime.padStart(6)}s | 旁白: ${r.narrationDur.padStart(6)}s | 比值: ${r.ratio}`);
    if (r.inRange) passCount++;
  });
  
  console.log();
  console.log('=' .repeat(80));
  console.log(`验收结果: ${passCount}/${results.length} 个 beat 的比值在 [0.8, 1.2] 范围内`);
  
  if (passCount === results.length) {
    console.log('✓ 所有 beat 都已达标！');
  } else {
    console.log('✗ 仍有 beat 未达标');
    const failed = results.filter(r => !r.inRange);
    failed.forEach(r => {
      console.log(`   ${r.beatId}: ${r.ratio} (${r.ratio < 0.8 ? '动画太短' : '动画太长'})`);
    });
  }
  console.log('=' .repeat(80));
  
  await browser.close();
})();
