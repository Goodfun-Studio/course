const { test } = require('@playwright/test');

test('Ch17 最终比率测试', async ({ page }) => {
  await page.goto('http://localhost:8000/ch17/index.html');
  await page.waitForTimeout(5000);
  
  const results = await page.evaluate(() => {
    // 检查必要对象
    if (typeof P === 'undefined' || !window.BEATS || !window.TIMINGS) {
      return { error: 'Objects not loaded' };
    }
    
    const results = [];
    
    for (let i = 0; i < window.BEATS.length; i++) {
      const beat = window.BEATS[i];
      const timing = window.TIMINGS[beat.id];
      
      if (!timing || !beat.run) continue;
      
      try {
        // 重置 TW（全局数组）
        TW.length = 0;
        
        // 创建 m 函数
        const m = (name) => timing.marks[name] || 0;
        
        // 运行 beat
        beat.run(m, timing.dur);
        
        // 计算最大动画时间
        const animEnd = TW.length > 0 
          ? Math.max(...TW.map(w => (w.t0 || 0) + (w.dur || 0.3)))
          : 0;
        const ratio = timing.dur > 0 ? animEnd / timing.dur : 0;
        
        results.push({
          beatId: beat.id,
          narrationDur: timing.dur,
          maxAnimTime: parseFloat(animEnd.toFixed(2)),
          ratio: parseFloat(ratio.toFixed(2)),
          twCount: TW.length,
          inRange: ratio >= 0.8 && ratio <= 1.2
        });
      } catch (err) {
        results.push({ beatId: beat.id, error: err.message });
      }
    }
    
    return { success: true, results };
  });
  
  if (results.error) {
    console.log('ERROR:', results.error);
    return;
  }
  
  console.log('\n=== Ch17 动画/旁白比率实测结果 ===\n');
  console.log('| beat | ratio | 判定 |');
  console.log('|------|-------|------|');
  
  results.results.forEach(r => {
    if (r.error) {
      console.log(`| ${r.beatId} | ERROR: ${r.error} | ✗ |`);
    } else {
      const status = r.inRange ? '✓' : '✗';
      console.log(`| ${r.beatId} | ${r.ratio.toFixed(2)} | ${status} |`);
    }
  });
  
  const inRangeCount = results.results.filter(r => r.inRange).length;
  const totalCount = results.results.filter(r => !r.error).length;
  
  console.log(`\n通过: ${inRangeCount}/${totalCount} beats\n`);
  
  console.log('详细数据:');
  results.results.forEach(r => {
    if (!r.error) {
      console.log(`  ${r.beatId}: max=${r.maxAnimTime}s, dur=${r.narrationDur}s, ratio=${r.ratio} (tw=${r.twCount})`);
    }
  });
});
