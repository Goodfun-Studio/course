const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto(`file://${path.resolve(__dirname, 'index.html')}`);
  
  // Wait for page to load
  await page.waitForTimeout(1000);
  
  const results = await page.evaluate(() => {
    const results = [];
    
    window.BEATS.forEach((beat, i) => {
      const beatId = beat.id;
      const timing = window.TIMINGS[beatId];
      
      if (!timing) {
        results.push({ id: beatId, ratio: 'MISSING', error: true });
        return;
      }
      
      // Reset TW array
      window.TW = [];
      window.P = { i };
      
      try {
        // Run the beat
        beat.run((mark) => timing.marks[mark] || 0, timing.dur);
        
        // Calculate max animation time
        const maxTime = Math.max(0, ...window.TW.map(w => w.t0 + w.dur));
        const ratio = maxTime / timing.dur;
        
        results.push({
          id: beatId,
          ratio: ratio.toFixed(2),
          maxTime: maxTime.toFixed(2),
          duration: timing.dur.toFixed(2),
          inRange: ratio >= 0.8 && ratio <= 1.2
        });
      } catch (e) {
        results.push({ id: beatId, ratio: 'ERROR', error: true, message: e.message });
      }
    });
    
    return results;
  });
  
  console.log('Beat\t\t\tMax Anim\tDuration\tRatio\tStatus');
  console.log('====\t\t\t========\t========\t=====\t======');
  
  let allPass = true;
  results.forEach(r => {
    if (r.error) {
      console.log(`${r.id}\t\t${r.ratio}\t\t\t\t\tFAIL`);
      allPass = false;
    } else {
      const status = r.inRange ? 'PASS' : 'FAIL';
      if (!r.inRange) allPass = false;
      console.log(`${r.id}\t${r.maxTime}s\t\t${r.duration}s\t\t${r.ratio}\t${status}`);
    }
  });
  
  console.log('\n' + (allPass ? '✓ All beats pass!' : '✗ Some beats failed'));
  
  await browser.close();
  process.exit(allPass ? 0 : 1);
})();
