const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Listen for console messages and errors
  page.on('console', msg => console.log('Console:', msg.text()));
  page.on('pageerror', err => console.error('Page error:', err));
  
  await page.goto(`file://${path.resolve(__dirname, 'index.html')}`);
  
  // Wait for page to fully load
  await page.waitForFunction(() => window.BEATS && window.TIMINGS && window.runBeat);
  
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
        // Set beat index
        window.P.i = i;
        
        // Run the beat using the engine's runBeat function
        window.P.end = window.runBeat(i);
        
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
        results.push({ 
          id: beatId, 
          ratio: 'ERROR', 
          error: true, 
          message: e.message,
          stack: e.stack
        });
      }
    });
    
    return results;
  });
  
  console.log('\n=== Test Results ===\n');
  console.log('Beat\t\t\tMax Anim\tDuration\tRatio\tStatus');
  console.log('====\t\t\t========\t========\t=====\t======');
  
  let allPass = true;
  results.forEach(r => {
    if (r.error) {
      const tabs = r.id.length < 8 ? '\t\t' : '\t';
      console.log(`${r.id}${tabs}ERROR`);
      console.log(`  Error: ${r.message}`);
      allPass = false;
    } else {
      const status = r.inRange ? 'PASS' : 'FAIL';
      if (!r.inRange) allPass = false;
      const tabs = r.id.length < 8 ? '\t\t' : '\t';
      console.log(`${r.id}${tabs}${r.maxTime}s\t\t${r.duration}s\t\t${r.ratio}\t${status}`);
    }
  });
  
  console.log('\n' + (allPass ? '✓ All beats pass!' : '✗ Some beats failed'));
  
  await browser.close();
  process.exit(allPass ? 0 : 1);
})();
