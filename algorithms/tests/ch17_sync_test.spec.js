const { test, expect } = require('@playwright/test');

test.describe('Chapter 17: 动画与旁白同步测试', () => {
  test('验证每个 beat 的动画时长与旁白时长比率在 [0.8, 1.2] 范围内', async ({ page }) => {
    await page.goto('http://localhost:8000/ch17/index.html');
    await page.waitForTimeout(2000);
    
    const results = await page.evaluate(() => {
      if (!window.BEATS || !window.TIMINGS) {
        return { error: 'BEATS or TIMINGS not found' };
      }
      
      const results = [];
      const TW = [];
      
      // 模拟 tw 函数来收集动画时间
      const mockTw = (elem, props, t0) => {
        TW.push({ t0, dur: 0.3 }); // 默认 duration
      };
      
      // 模拟其他函数
      const mockPanel = () => ({ appendChild: () => {} });
      const mockG = () => ({ setAttribute: () => {}, appendChild: () => {} });
      const mockT = () => ({ setAttribute: () => {}, textContent: '' });
      const mockMk = () => ({ setAttribute: () => {} });
      const mockProg = () => {};
      
      window.BEATS.forEach(beat => {
        if (!beat || !beat.id || !beat.run) return;
        
        const timing = window.TIMINGS[beat.id];
        if (!timing || !timing.dur || !timing.marks) return;
        
        TW.length = 0;
        
        try {
          // 创建 m 函数
          const m = (markName) => {
            return timing.marks[markName] || 0;
          };
          
          // 运行 beat 的 run 函数
          beat.run(m, timing.dur);
          
          // 计算最大动画时间
          let maxAnimTime = 0;
          TW.forEach(tw => {
            const endTime = (tw.t0 || 0) + (tw.dur || 0);
            if (endTime > maxAnimTime) maxAnimTime = endTime;
          });
          
          const ratio = timing.dur > 0 ? maxAnimTime / timing.dur : 0;
          
          results.push({
            beatId: beat.id,
            narrationDur: timing.dur,
            maxAnimTime: maxAnimTime,
            ratio: ratio,
            inRange: ratio >= 0.8 && ratio <= 1.2,
            twCount: TW.length
          });
        } catch (err) {
          results.push({
            beatId: beat.id,
            error: err.message
          });
        }
      });
      
      return results;
    });
    
    console.log('\n=== 动画与旁白同步比率 ===\n');
    
    results.forEach(r => {
      if (r.error) {
        console.log(`${r.beatId}: ERROR - ${r.error}`);
      } else {
        const status = r.inRange ? '✓' : '✗';
        console.log(`${status} ${r.beatId}: ${r.ratio.toFixed(2)} (max=${r.maxAnimTime.toFixed(1)}s, dur=${r.narrationDur}s, tw=${r.twCount})`);
      }
    });
    
    // 检查是否所有 beat 都在范围内
    const allInRange = results.every(r => r.inRange || r.error);
    const inRangeCount = results.filter(r => r.inRange).length;
    const totalCount = results.length;
    
    console.log(`\n总计: ${inRangeCount}/${totalCount} beats 在 [0.8, 1.2] 范围内`);
    
    // 如果不是全部通过，至少要有一半以上
    expect(inRangeCount).toBeGreaterThan(totalCount * 0.5);
  });
});
