const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('Console:', msg.text()));
  
  await page.goto(`file://${path.resolve(__dirname, 'index.html')}`);
  await page.waitForFunction(() => window.BEATS && window.TIMINGS);
  await page.waitForTimeout(500);
  
  const debug = await page.evaluate(() => {
    const beat = window.BEATS[0];
    const timing = window.TIMINGS[beat.id];
    
    // Check if tw is available
    console.log('typeof tw:', typeof window.tw);
    console.log('typeof T:', typeof window.T);
    console.log('typeof panel:', typeof window.panel);
    
    // Clear TW
    window.TW = [];
    
    // Create m function
    const m = (mark) => {
      const time = timing.marks[mark] || 0;
      console.log(`m('${mark}') = ${time}`);
      return time;
    };
    
    console.log('About to run beat...');
    
    // Try to run the beat
    try {
      beat.run(m, timing.dur);
      console.log('Beat run completed');
      console.log('TW length:', window.TW.length);
      
      return {
        success: true,
        twLength: window.TW.length,
        hasTw: typeof window.tw !== 'undefined'
      };
    } catch (e) {
      console.error('Error running beat:', e.message);
      return { success: false, error: e.message };
    }
  });
  
  console.log('\nResult:', JSON.stringify(debug, null, 2));
  
  await browser.close();
})();
