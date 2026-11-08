const { test } = require('@playwright/test');

test('Ch17 比率和内容覆盖测试', async ({ page }) => {
  await page.goto('http://localhost:8000/ch17/index.html');
  await page.waitForTimeout(5000);
  
  const results = await page.evaluate(() => {
    if (typeof P === 'undefined' || !window.BEATS || !window.TIMINGS) {
      return { error: 'Objects not loaded' };
    }
    
    const results = [];
    
    for (let i = 0; i < window.BEATS.length; i++) {
      const beat = window.BEATS[i];
      const timing = window.TIMINGS[beat.id];
      
      if (!timing || !beat.run) continue;
      
      try {
        // 重置 TW
        TW.length = 0;
        
        // 创建 m 函数
        const m = (name) => timing.marks[name] || 0;
        
        // 运行 beat
        beat.run(m, timing.dur);
        
        // 计算最大动画时间（比率）
        const animEnd = TW.length > 0 
          ? Math.max(...TW.map(w => (w.t0 || 0) + (w.dur || 0.3)))
          : 0;
        const ratio = timing.dur > 0 ? animEnd / timing.dur : 0;
        
        // 计算内容覆盖（采样 0.5s，最后一次内容变化）
        // 找出所有动画的开始时间（内容变化时刻）
        const contentChangeTimes = TW.map(w => w.t0 || 0).filter(t => t > 0);
        const lastContentChange = contentChangeTimes.length > 0 
          ? Math.max(...contentChangeTimes)
          : 0;
        const coverage = timing.dur > 0 ? lastContentChange / timing.dur : 0;
        
        results.push({
          beatId: beat.id,
          narrationDur: timing.dur,
          maxAnimTime: parseFloat(animEnd.toFixed(2)),
          ratio: parseFloat(ratio.toFixed(2)),
          lastContentChange: parseFloat(lastContentChange.toFixed(2)),
          coverage: parseFloat(coverage.toFixed(2)),
          twCount: TW.length,
          ratioOK: ratio >= 0.8 && ratio <= 1.2,
          coverageOK: coverage >= 0.7
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
  
  console.log('\n=== Ch17 比率和内容覆盖实测结果 ===\n');
  console.log('比率测试:');
  console.log('| beat | ratio | 判定 |');
  console.log('|------|-------|------|');
  
  results.results.forEach(r => {
    if (r.error) {
      console.log(`| ${r.beatId} | ERROR | ✗ |`);
    } else {
      const status = r.ratioOK ? '✓' : '✗';
      console.log(`| ${r.beatId} | ${r.ratio.toFixed(2)} | ${status} |`);
    }
  });
  
  const ratioPassCount = results.results.filter(r => r.ratioOK).length;
  const totalCount = results.results.filter(r => !r.error).length;
  console.log(`\n比率通过: ${ratioPassCount}/${totalCount} beats\n`);
  
  console.log('内容覆盖测试:');
  console.log('| beat | coverage | 判定 |');
  console.log('|------|----------|------|');
  
  results.results.forEach(r => {
    if (r.error) {
      console.log(`| ${r.beatId} | ERROR | ✗ |`);
    } else {
      const status = r.coverageOK ? '✓' : '✗';
      console.log(`| ${r.beatId} | ${r.coverage.toFixed(2)} | ${status} |`);
    }
  });
  
  const coveragePassCount = results.results.filter(r => r.coverageOK).length;
  console.log(`\n内容覆盖通过: ${coveragePassCount}/${totalCount} beats\n`);
  
  console.log('详细数据:');
  results.results.forEach(r => {
    if (!r.error) {
      console.log(`  ${r.beatId}: ratio=${r.ratio} (max=${r.maxAnimTime}s), coverage=${r.coverage} (last=${r.lastContentChange}s), dur=${r.narrationDur}s`);
    }
  });
});
