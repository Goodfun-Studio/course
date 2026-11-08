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
    
    // Wrap tw to log calls
    const originalTw = window.tw;
    let twCallCount = 0;
    window.tw = function(...args) {
      twCallCount++;
      console.log(`tw call #${twCallCount}:`, args[2], args[3]);
      return originalTw.apply(this, args);
    };
    
    window.TW = [];
    
    const m = (mark) => timing.marks[mark] || 0;
    
    console.log('Running beat...');
    beat.run(m, timing.dur);
    console.log('Beat completed');
    console.log('tw was called', twCallCount, 'times');
    console.log('TW.length =', window.TW.length);
    
    if (window.TW.length > 0) {
      console.log('First TW entry:', JSON.stringify({ t0: window.TW[0].t0, dur: window.TW[0].dur }));
    }
  });
  
  await browser.close();
})();
