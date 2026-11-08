const { test } = require('@playwright/test');

test('最终测试 ch17 比率', async ({ page }) => {
  await page.goto('http://localhost:8000/ch17/index.html');
  
  // 等待更长时间确保所有对象加载
  await page.waitForTimeout(5000);
  
  const results = await page.evaluate(() => {
    if (!window.P || !window.BEATS || !window.TIMINGS) {
      return { error: 'Objects not loaded', p: !!window.P, beats: !!window.BEATS, timings: !!window.TIMINGS };
    }
    
    const results = [];
    
    for (let i = 0; i < window.BEATS.length; i++) {
      const beat = window.BEATS[i];
      const timing = window.TIMINGS[beat.id];
      
      if (!timing || !beat.run) continue;
      
      try {
        // 重置 TW
        window.TW.length = 0;
        
        // 创建 m 函数
        const m = (name) => timing.marks[name] || 0;
        
        // 运行 beat
        beat.run(m, timing.dur);
        
        // 计算最大动画时间
        const animEnd = window.TW.length > 0 
          ? Math.max(...window.TW.map(w => (w.t0 || 0) + (w.dur || 0.3)))
          : 0;
        const ratio = timing.dur > 0 ? animEnd / timing.dur : 0;
        
        results.push({
          beatId: beat.id,
          narrationDur: timing.dur,
          maxAnimTime: parseFloat(animEnd.toFixed(2)),
          ratio: parseFloat(ratio.toFixed(2)),
          twCount: window.TW.length,
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
    console.log('P:', results.p, 'BEATS:', results.beats, 'TIMINGS:', results.timings);
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
