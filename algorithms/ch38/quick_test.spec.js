const { test } = require('@playwright/test');
const path = require('path');

test('quick syntax check', async ({ page }) => {
  page.on('console', msg => console.log('Browser:', msg.text()));
  page.on('pageerror', err => console.error('Error:', err.message));
  
  await page.goto(`file://${path.join(__dirname, 'index.html')}`);
  await page.waitForTimeout(2000);
  
  const result = await page.evaluate(() => {
    return {
      hasBEATS: !!window.BEATS,
      beatsCount: window.BEATS ? window.BEATS.length : 0,
      error: window.lastError || null
    };
  });
  
  console.log(JSON.stringify(result, null, 2));
});
