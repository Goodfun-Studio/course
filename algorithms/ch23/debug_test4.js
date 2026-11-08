const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('>', msg.text()));
  
  await page.goto(`file://${path.resolve(__dirname, 'index.html')}`);
  await page.waitForFunction(() => window.BEATS && window.TIMINGS);
  await page.waitForTimeout(500);
  
  await page.evaluate(() => {
    const beat = window.BEATS[0];
    const timing = window.TIMINGS[beat.id];
    
    // Check what tw does
    const originalTw = window.tw;
    window.tw = function(e, to, t0, dur, ease) {
      console.log('tw called with:', {
        e: e ? e.tagName || 'object' : 'null',
        to: JSON.stringify(to),
        t0: t0,
        dur: dur
      });
      const result = originalTw(e, to, t0, dur, ease);
      console.log('TW.length after push:', window.TW.length);
      return result;
    };
    
    window.TW = [];
    console.log('Initial TW.length:', window.TW.length);
    
    const m = (mark) => timing.marks[mark] || 0;
    
    beat.run(m, timing.dur);
    
    console.log('Final TW.length:', window.TW.length);
  });
  
  await browser.close();
})();
