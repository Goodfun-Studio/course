const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto(`file://${path.resolve(__dirname, 'index.html')}`);
  await page.waitForFunction(() => window.BEATS && window.TIMINGS && window.runBeat);
  await page.waitForTimeout(500);
  
  const results = await page.evaluate(() => {
    const results = [];
    
    window.BEATS.forEach((beat, i) => {
      const beatId = beat.id;
      const timing = window.TIMINGS[beatId];
      
      if (!timing) {
        results.push({ id: beatId, ratio: 'MISSING', error: true });
        return;
      }
      
      try {
        // Use the actual runBeat function from engine.js
        window.P = window.P || {};
        window.P.i = i;
        const end = window.runBeat(i);
        
        // The ratio is end / timing.dur
        const ratio = end / timing.dur;
        
        results.push({
          id: beatId,
          ratio: ratio.toFixed(2),
          end: end.toFixed(2),
          duration: timing.dur.toFixed(2),
          inRange: ratio >= 0.8 && ratio <= 1.2
        });
      } catch (e) {
        results.push({ 
          id: beatId, 
          ratio: 'ERROR', 
          error: true, 
          message: e.message
        });
      }
    });
    
    return results;
  });
  
  console.log('\n=== Beat Animation/Narration Ratio Test ===\n');
  console.log('Beat\t\t\tEnd Time\tDuration\tRatio\tStatus');
  console.log('====\t\t\t========\t========\t=====\t======');
  
  let allPass = true;
  results.forEach(r => {
    if (r.error) {
      const tabs = r.id.length < 8 ? '\t\t' : '\t';
      console.log(`${r.id}${tabs}ERROR - ${r.message}`);
      allPass = false;
    } else {
      const status = r.inRange ? 'PASS' : 'FAIL';
      if (!r.inRange) allPass = false;
      const tabs = r.id.length < 8 ? '\t\t' : '\t';
      console.log(`${r.id}${tabs}${r.end}s\t\t${r.duration}s\t\t${r.ratio}\t${status}`);
    }
  });
  
  console.log('\n' + (allPass ? '✓ All beats pass [0.8, 1.2] range!' : '✗ Some beats out of range'));
  
  await browser.close();
  process.exit(allPass ? 0 : 1);
})();
