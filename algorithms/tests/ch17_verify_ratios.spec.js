const { test } = require('@playwright/test');

test('验证 ch17 所有 beat 的动画/旁白比率', async ({ page }) => {
  await page.goto('http://localhost:8000/ch17/index.html');
  await page.waitForTimeout(3000);
  
  const results = await page.evaluate(() => {
    // 检查必要的对象是否存在
    if (!window.P || !window.BEATS || !window.TIMINGS || !window.runBeat || !window.TW) {
      return [{ error: 'Required objects not loaded' }];
    }
    
    const results = [];
    
    for (let i = 0; i < window.BEATS.length; i++) {
      const beat = window.BEATS[i];
      const timing = window.TIMINGS[beat.id];
      
      if (!timing) {
        results.push({ beatId: beat.id, error: 'No timing found' });
        continue;
      }
      
      try {
        // 运行 beat
        window.P.i = i;
        window.P.end = window.runBeat(i);
        
        // 计算最大动画时间
        const animEnd = Math.max(0, ...window.TW.map(w => (w.t0 || 0) + (w.dur || 0)));
        const ratio = timing.dur > 0 ? animEnd / timing.dur : 0;
        
        results.push({
          beatId: beat.id,
          narrationDur: timing.dur,
          maxAnimTime: parseFloat(animEnd.toFixed(2)),
          ratio: parseFloat(ratio.toFixed(2)),
          inRange: ratio >= 0.8 && ratio <= 1.2
        });
      } catch (err) {
        results.push({ beatId: beat.id, error: err.message });
      }
    }
    
    return results;
  });
  
  console.log('\n=== Ch17 动画/旁白比率实测结果 ===\n');
  console.log('| beat | ratio | 判定 |');
  console.log('|------|-------|------|');
  
  results.forEach(r => {
    if (r.error) {
      console.log(`| ${r.beatId || 'unknown'} | ERROR | ✗ |`);
    } else {
      const status = r.inRange ? '✓' : '✗';
      console.log(`| ${r.beatId} | ${r.ratio.toFixed(2)} | ${status} |`);
    }
  });
  
  const inRangeCount = results.filter(r => r.inRange).length;
  const totalCount = results.filter(r => !r.error).length;
  
  console.log(`\n通过: ${inRangeCount}/${totalCount} beats`);
  console.log('\n详细数据:');
  results.forEach(r => {
    if (!r.error) {
      console.log(`  ${r.beatId}: max=${r.maxAnimTime}s, dur=${r.narrationDur}s, ratio=${r.ratio}`);
    }
  });
});
