const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto(`file://${path.resolve(__dirname, 'index.html')}`);
  await page.waitForFunction(() => window.testBeatRatios);
  
  const results = await page.evaluate(() => window.testBeatRatios());
  
  console.log('\nBeat\t\t\tanimEnd\t\tdur\t\tratio\tStatus');
  console.log('====\t\t\t=======\t\t===\t\t=====\t======');
  let allPass = true;
  results.forEach(r => {
    const s = r.pass ? '✓' : '✗ FAIL';
    if (!r.pass) allPass = false;
    const tab = r.id.length < 10 ? '\t\t' : '\t';
    console.log(`${r.id}${tab}${r.animEnd}s\t\t${r.dur}s\t\t${r.ratio}\t${s}`);
  });
  console.log('\n' + (allPass ? '✓ ALL PASS' : '✗ Some FAIL'));
  await browser.close();
})();
