const { test } = require('@playwright/test');

test('检查 ch17 页面错误', async ({ page }) => {
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push('Console: ' + msg.text());
    }
  });
  
  await page.goto('http://localhost:8000/ch17/index.html');
  await page.waitForTimeout(5000);
  
  const info = await page.evaluate(() => {
    return {
      hasP: typeof P !== 'undefined',
      hasBEATS: typeof window.BEATS !== 'undefined',
      hasTIMINGS: typeof window.TIMINGS !== 'undefined',
      hasTW: typeof window.TW !== 'undefined',
      beatsCount: window.BEATS ? window.BEATS.length : 0,
      pType: typeof P
    };
  });
  
  console.log('页面信息:', info);
  console.log('页面错误:', errors.length > 0 ? errors : '无');
});
