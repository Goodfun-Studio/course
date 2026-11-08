const { test } = require('@playwright/test');

test('debug ch17', async ({ page }) => {
  const errors = [];
  page.on('pageerror', err => {
    console.error('页面错误:', err.message);
    errors.push(err.message);
  });
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.error('控制台错误:', msg.text());
    }
  });
  
  await page.goto('http://localhost:8000/ch17/index.html');
  await page.waitForTimeout(4000);
  
  const info = await page.evaluate(() => {
    const beats = window.BEATS || [];
    return {
      beatsCount: beats.length,
      beatsIds: beats.map(b => b ? b.id : 'undefined'),
      beat0: beats[0] ? { id: beats[0].id, title: beats[0].title, hasRun: typeof beats[0].run === 'function' } : null,
      pExists: !!window.P,
      pTime: window.P ? window.P.t : null,
      timingsKeys: Object.keys(window.TIMINGS || {})
    };
  });
  
  console.log('\n=== Debug Info ===');
  console.log('Beats count:', info.beatsCount);
  console.log('Beats IDs:', info.beatsIds);
  console.log('Beat[0]:', JSON.stringify(info.beat0, null, 2));
  console.log('P exists:', info.pExists);
  console.log('P.t:', info.pTime);
  console.log('TIMINGS keys:', info.timingsKeys);
  console.log('Page Errors:', errors);
});
