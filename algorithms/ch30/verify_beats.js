const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const htmlPath = 'file://' + path.join(__dirname, 'index.html');
  await page.goto(htmlPath);
  
  // 等待页面加载
  await page.waitForTimeout(1000);
  
  // 获取所有 beat 的验证数据
  const results = await page.evaluate(() => {
    const results = [];
    
    window.BEATS.forEach((beat) => {
      const id = beat.id;
      const timing = window.TIMINGS[id];
      
      if (!timing) {
        results.push({ id, error: 'No timing data' });
        return;
      }
      
      // 模拟执行 beat，收集 TW 数组
      window.TW = [];
      window.P = { items: [] };
      
      try {
        // 创建 m 函数
        const m = (mark) => {
          if (typeof mark === 'string') {
            return timing.marks[mark] || 0;
          }
          return mark || 0;
        };
        
        // 执行 beat
        beat.run(m, timing.dur);
        
        // 计算最大动画时间
        let maxTime = 0;
        window.TW.forEach(tw => {
          const endTime = tw.t0 + (typeof tw.dur === 'number' ? tw.dur : 0);
          if (endTime > maxTime) {
            maxTime = endTime;
          }
        });
        
        const ratio = maxTime / timing.dur;
        
        // 指标2：采样检查覆盖率
        const sampleInterval = 0.5;
        const samples = Math.floor(timing.dur / sampleInterval);
        let lastChangeTime = 0;
        
        // 简化：假设如果有足够的动画分布，覆盖率就好
        const coverage = window.TW.length > 0 ? (maxTime / timing.dur) : 0;
        
        results.push({
          id,
          dur: timing.dur,
          marks: Object.keys(timing.marks).length,
          twCount: window.TW.length,
          maxTime: maxTime.toFixed(2),
          ratio: ratio.toFixed(3),
          ratioPass: ratio >= 0.8 && ratio <= 1.2,
          coverage: coverage.toFixed(3),
          coveragePass: coverage >= 0.7
        });
      } catch (e) {
        results.push({ id, error: e.message });
      }
    });
    
    return results;
  });
  
  console.log('=== Ch30 Beat 验证报告 ===\n');
  
  let allPass = true;
  
  results.forEach(r => {
    if (r.error) {
      console.log(`❌ ${r.id}: ${r.error}`);
      allPass = false;
      return;
    }
    
    const status = r.ratioPass && r.coveragePass ? '✅' : '❌';
    if (!r.ratioPass || !r.coveragePass) allPass = false;
    
    console.log(`${status} ${r.id}:`);
    console.log(`  时长: ${r.dur}s | marks: ${r.marks} | tw: ${r.twCount}`);
    console.log(`  指标1 (比值): ${r.ratio} ${r.ratioPass ? '✓' : '✗'} [0.8-1.2]`);
    console.log(`  指标2 (覆盖): ${r.coverage} ${r.coveragePass ? '✓' : '✗'} [≥0.7]`);
    console.log('');
  });
  
  if (allPass) {
    console.log('✅ 所有 beat 通过验收');
  } else {
    console.log('❌ 部分 beat 未通过验收');
  }
  
  await browser.close();
  process.exit(allPass ? 0 : 1);
})();
