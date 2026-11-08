const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto(`file://${path.resolve(__dirname, 'index.html')}`);
  await page.waitForFunction(() => window.BEATS && window.TIMINGS);
  await page.waitForTimeout(500);
  
  const debug = await page.evaluate(() => {
    const beat = window.BEATS[0];
    const timing = window.TIMINGS[beat.id];
    
    // Clear TW
    window.TW = [];
    
    // Create m function
    const m = (mark) => timing.marks[mark] || 0;
    
    console.log('Beat:', beat.id);
    console.log('Timing:', timing);
    console.log('m function:', typeof m);
    console.log('m("scc"):', m('scc'));
    
    // Try to run the beat
    try {
      beat.run(m, timing.dur);
      console.log('TW length after run:', window.TW.length);
      console.log('TW sample:', window.TW.slice(0, 3));
      
      return {
        success: true,
        twLength: window.TW.length,
        twSample: window.TW.slice(0, 3).map(w => ({ t0: w.t0, dur: w.dur }))
      };
    } catch (e) {
      console.error('Error:', e);
      return { success: false, error: e.message, stack: e.stack };
    }
  });
  
  console.log('Debug result:', JSON.stringify(debug, null, 2));
  
  await browser.close();
})();
