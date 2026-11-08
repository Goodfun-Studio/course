const { test } = require('@playwright/test');

test('调试页面加载', async ({ page }) => {
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  
  await page.goto('http://localhost:8000/ch17/index.html');
  
  for (let i = 0; i < 10; i++) {
    await page.waitForTimeout(1000);
    
    const status = await page.evaluate(() => {
      return {
        time: Date.now(),
        hasP: typeof P !== 'undefined',
        hasBEATS: typeof window.BEATS !== 'undefined',
        hasTIMINGS: typeof window.TIMINGS !== 'undefined',
        hasTW: typeof TW !== 'undefined'
      };
    });
    
    console.log(`${i+1}s:`, status);
    
    if (status.hasP && status.hasBEATS && status.hasTIMINGS && status.hasTW) {
      console.log('所有对象已加载！');
      break;
    }
  }
  
  console.log('页面错误:', errors.length > 0 ? errors : '无');
});
