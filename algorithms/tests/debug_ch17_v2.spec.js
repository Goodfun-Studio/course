const { test } = require('@playwright/test');

test('debug ch17 v2', async ({ page }) => {
  await page.goto('http://localhost:8000/ch17/index.html');
  
  // 检查 P 是否在加载后立即存在
  const pImmediate = await page.evaluate(() => typeof window.P);
  console.log('P type immediately:', pImmediate);
  
  // 等待一段时间
  await page.waitForTimeout(2000);
  
  const info = await page.evaluate(() => {
    return {
      pType: typeof P,
      pExists: typeof P !== 'undefined',
      pValue: typeof P !== 'undefined' ? { i: P.i, t: P.t, playing: P.playing } : null,
      bootExists: typeof boot === 'function',
      beatsCount: window.BEATS ? window.BEATS.length : 0
    };
  });
  
  console.log('After 2s:', JSON.stringify(info, null, 2));
});
