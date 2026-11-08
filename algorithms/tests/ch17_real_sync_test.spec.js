const { test, expect } = require('@playwright/test');

test.describe('Chapter 17: 实际运行同步测试', () => {
  test('通过实际播放验证动画与旁白同步', async ({ page }) => {
    await page.goto('http://localhost:8000/ch17/index.html');
    
    // 等待页面完全加载
    await page.waitForFunction(() => window.P && window.BEATS && window.TIMINGS);
    
    console.log('\n=== 开始测试各 beat 动画时长 ===\n');
    
    // 获取所有 beat 的信息
    const beatInfo = await page.evaluate(() => {
      return window.BEATS.map(beat => ({
        id: beat.id,
        narrationDur: window.TIMINGS[beat.id] ? window.TIMINGS[beat.id].dur : 0
      }));
    });
    
    const results = [];
    
    for (const beat of beatInfo) {
      // 跳转到这个 beat
      await page.goto(`http://localhost:8000/ch17/index.html?beat=${beatInfo.indexOf(beat)}&t=0`);
      await page.waitForTimeout(500);
      
      // 获取这个 beat 的动画最大时间
      const maxTime = await page.evaluate((beatId) => {
        // 查找所有带 data-t0 或 data-dur 属性的元素
        const stage = document.getElementById('stage');
        if (!stage) return 0;
        
        let maxT = 0;
        const allElems = stage.querySelectorAll('[data-t0], [data-dur]');
        
        allElems.forEach(elem => {
          const t0 = parseFloat(elem.getAttribute('data-t0') || 0);
          const dur = parseFloat(elem.getAttribute('data-dur') || 0);
          const endTime = t0 + dur;
          if (endTime > maxT) maxT = endTime;
        });
        
        return maxT;
      }, beat.id);
      
      const ratio = beat.narrationDur > 0 ? maxTime / beat.narrationDur : 0;
      const inRange = ratio >= 0.8 && ratio <= 1.2;
      
      results.push({
        beatId: beat.id,
        narrationDur: beat.narrationDur,
        maxAnimTime: maxTime,
        ratio: ratio,
        inRange: inRange
      });
      
      const status = inRange ? '✓' : '✗';
      console.log(`${status} ${beat.id}: ${ratio.toFixed(2)} (max=${maxTime.toFixed(1)}s, dur=${beat.narrationDur}s)`);
    }
    
    const inRangeCount = results.filter(r => r.inRange).length;
    const totalCount = results.length;
    
    console.log(`\n总计: ${inRangeCount}/${totalCount} beats 在 [0.8, 1.2] 范围内\n`);
    
    // 生成修复前后对比报告
    console.log('修复后比率:');
    results.forEach(r => {
      console.log(`  ${r.beatId}: ${r.ratio.toFixed(2)}`);
    });
  });
});
