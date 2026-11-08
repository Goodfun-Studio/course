const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('Chapter 16 - DFS Animation Tests', () => {
  test.beforeEach(async ({ page }) => {
    const filePath = path.resolve(__dirname, '../algorithms/ch16/index.html');
    await page.goto(`file://${filePath}`);
    await page.waitForFunction(() => window.BEATS && window.TIMINGS);
  });

  test('all beats should have animation/narration ratio between 0.8 and 1.2', async ({ page }) => {
    const results = await page.evaluate(() => {
      const results = [];
      
      for (let i = 0; i < BEATS.length; i++) {
        const beat = BEATS[i];
        const beatId = beat.id;
        const timing = TIMINGS[beatId];
        
        if (!timing) {
          results.push({ beatId, error: 'No timing data' });
          continue;
        }
        
        // Reset state
        window.P = { i: 0, t: 0, end: 0 };
        window.TW = [];
        
        // Run the beat
        try {
          P.i = i;
          P.end = runBeat(i);
          
          // Calculate max animation end time
          const animEnd = Math.max(0, ...TW.map(w => w.t0 + w.dur));
          const narrationDur = timing.dur;
          const ratio = animEnd / narrationDur;
          
          results.push({
            beatId,
            animEnd: animEnd.toFixed(2),
            narrationDur: narrationDur.toFixed(2),
            ratio: ratio.toFixed(3),
            pass: ratio >= 0.8 && ratio <= 1.2
          });
        } catch (error) {
          results.push({ beatId, error: error.message });
        }
      }
      
      return results;
    });

    console.log('\nAnimation/Narration Ratio Results:');
    console.log('====================================');
    
    let allPass = true;
    results.forEach(r => {
      if (r.error) {
        console.log(`${r.beatId}: ERROR - ${r.error}`);
        allPass = false;
      } else {
        const status = r.pass ? '✓' : '✗';
        console.log(`${status} ${r.beatId}: anim=${r.animEnd}s, narr=${r.narrationDur}s, ratio=${r.ratio}`);
        if (!r.pass) allPass = false;
      }
    });
    
    expect(allPass).toBe(true);
  });

  test('no JavaScript errors in console', async ({ page }) => {
    const errors = [];
    page.on('pageerror', error => {
      errors.push(error.message);
    });
    
    await page.evaluate(() => {
      for (let i = 0; i < BEATS.length; i++) {
        window.P = { i: 0, t: 0, end: 0 };
        window.TW = [];
        P.i = i;
        P.end = runBeat(i);
      }
    });
    
    expect(errors).toEqual([]);
  });
});
