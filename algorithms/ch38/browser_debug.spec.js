const { test } = require('@playwright/test');
const path = require('path');

test('detailed error', async ({ page }) => {
  const errors = [];
  
  page.on('pageerror', err => {
    errors.push({
      message: err.message,
      stack: err.stack
    });
  });
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('Console Error:', msg.text());
    }
  });
  
  await page.goto(`file://${path.join(__dirname, 'index.html')}`);
  await page.waitForTimeout(2000);
  
  console.log('\n=== Errors ===');
  errors.forEach((err, i) => {
    console.log(`\nError ${i+1}:`);
    console.log(err.message);
    console.log(err.stack);
  });
  
  const result = await page.evaluate(() => {
    return {
      hasBEATS: typeof window.BEATS !== 'undefined',
      beatsCount: window.BEATS ? window.BEATS.length : 0
    };
  });
  
  console.log('\n=== Result ===');
  console.log(result);
});
