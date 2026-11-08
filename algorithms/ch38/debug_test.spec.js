const { test } = require('@playwright/test');
const path = require('path');

test('debug tw calls', async ({ page }) => {
  await page.goto(`file://${path.join(__dirname, 'index.html')}`);
  await page.waitForTimeout(1000);
  
  const debug = await page.evaluate(() => {
    // 检查全局变量
    const info = {
      hasTIMINGS: !!window.TIMINGS,
      hasBEATS: !!window.BEATS,
      hasTW: !!window.TW,
      hasPanel: typeof window.panel === 'function',
      hasTwFunc: typeof window.tw === 'function',
      beatsCount: window.BEATS ? window.BEATS.length : 0,
      twArrayLength: window.TW ? window.TW.length : 0
    };
    
    // 测试执行一个 beat
    if (window.BEATS && window.BEATS.length > 0 && window.TIMINGS) {
      const beat = window.BEATS[0];
      const timing = window.TIMINGS[beat.id];
      
      // 清空 TW
      window.TW = [];
      
      // 定义 m 函数
      const m = (mark) => timing.marks[mark] || 0;
      
      // 执行
      try {
        beat.run(m, timing.dur);
        info.afterRun_twArrayLength = window.TW.length;
        info.sampleTW = window.TW.slice(0, 3);
      } catch (e) {
        info.runError = e.message;
        info.runStack = e.stack;
      }
    }
    
    return info;
  });
  
  console.log('Debug Info:', JSON.stringify(debug, null, 2));
});
