const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto(`file://${path.resolve(__dirname, 'index.html')}`);
  await page.waitForFunction(() => window.testContentCoverage);
  await page.waitForTimeout(500);
  
  const results = await page.evaluate(() => window.testContentCoverage());
  
  console.log('\nBeat\t\t\tanimEnd\t\tdur\t\tratio\tlastChg\tcoverage\tStatus');
  console.log('====\t\t\t=======\t\t===\t\t=====\t=======\t========\t======');
  
  let allPass = true;
  results.forEach(r => {
    if (r.error) {
      console.log(`${r.id}\t\tERROR: ${r.msg}`);
      allPass = false;
    } else {
      const ratioStatus = r.ratioPass ? '✓' : '✗';
      const coverageStatus = r.coveragePass ? '✓' : '✗';
      const overallStatus = r.ratioPass && r.coveragePass ? '✓' : '✗';
      if (!r.ratioPass || !r.coveragePass) allPass = false;
      
      const tab = r.id.length < 10 ? '\t\t' : '\t';
      console.log(`${r.id}${tab}${r.animEnd}s\t\t${r.dur}s\t\t${r.ratio}${ratioStatus}\t${r.lastChange}s\t${r.coverage}${coverageStatus}\t\t${overallStatus}`);
    }
  });
  
  console.log('\n' + (allPass ? '✓ ALL PASS (ratio + coverage)' : '✗ Some FAIL'));
  
  await browser.close();
  process.exit(allPass ? 0 : 1);
})();
