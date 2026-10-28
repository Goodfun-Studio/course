const { test } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

test('截图 ch06 每个 beat', async ({ page }) => {
  const outDir = path.join(__dirname, '../algorithms/ch06/screenshots');
  fs.mkdirSync(outDir, { recursive: true });
  const filePath = path.join(__dirname, '../algorithms/ch06/index.html');
  await page.goto(`file://${filePath}`);
  await page.waitForTimeout(1500);
  const ids = await page.evaluate(() => window.BEATS.map(b => b.id));
  console.log('BEATS:', ids.join(', '));
  for (let i = 0; i < ids.length; i++) {
    await page.evaluate(n => { location.hash = ''; }, i);
    await page.goto(`file://${filePath}?beat=${i}`, { waitUntil: 'load' });
    await page.waitForTimeout(600);
    // 触发播放到该 beat 末尾
    await page.evaluate(() => { if (window.SEEK) window.SEEK(0); });
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(outDir, `${String(i).padStart(2, '0')}-${ids[i]}.png`) });
    console.log('shot', i, ids[i]);
  }
});
