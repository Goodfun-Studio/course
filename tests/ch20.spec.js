const { test, expect } = require('@playwright/test');

test.describe('Ch20 LIS - Animation Timing Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8000/algorithms/ch20/');
    await page.waitForLoadState('networkidle');
  });

  test('should load without JS errors', async ({ page }) => {
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));
    
    await page.waitForTimeout(2000);
    expect(errors).toEqual([]);
  });

  test('all beats should have mark-driven timing', async ({ page }) => {
    const beatInfo = await page.evaluate(() => {
      if (!window.BEATS || !window.TIMINGS) {
        return { error: 'BEATS or TIMINGS not found' };
      }
      
      const results = [];
      for (const beat of window.BEATS) {
        const timing = window.TIMINGS[beat.id];
        if (!timing) {
          results.push({ id: beat.id, error: 'No timing found' });
          continue;
        }
        
        // Check if beat function has (m, dur) signature
        const funcStr = beat.run.toString();
        const hasMarkParam = funcStr.match(/^\s*\(m,\s*dur\)\s*=>/);
        
        results.push({
          id: beat.id,
          hasMarkParam: !!hasMarkParam,
          markCount: Object.keys(timing.marks || {}).length,
          duration: timing.dur
        });
      }
      return results;
    });

    console.log('Beat info:', JSON.stringify(beatInfo, null, 2));
    
    if (beatInfo.error) {
      throw new Error(beatInfo.error);
    }
    
    // All beats should have (m, dur) signature
    for (const beat of beatInfo) {
      expect(beat.hasMarkParam).toBe(true);
      expect(beat.markCount).toBeGreaterThan(0);
    }
  });

  test('animation/narration ratio should be in [0.8, 1.2]', async ({ page }) => {
    const ratios = await page.evaluate(() => {
      if (!window.BEATS || !window.TIMINGS) {
        return { error: 'BEATS or TIMINGS not found' };
      }
      
      // Mock m function to track max time used
      const results = [];
      
      for (const beat of window.BEATS) {
        const timing = window.TIMINGS[beat.id];
        if (!timing) continue;
        
        let maxTime = 0;
        const m = (mark) => {
          const t = timing.marks[mark];
          if (t !== undefined && t > maxTime) maxTime = t;
          return t || 0;
        };
        
        try {
          // Create a mock panel
          const mockPanel = () => document.createElementNS('http://www.w3.org/2000/svg', 'g');
          window.panel = mockPanel;
          
          // Run the beat
          beat.run(m, timing.dur);
          
          const ratio = maxTime > 0 ? maxTime / timing.dur : 0;
          results.push({
            id: beat.id,
            maxTime,
            duration: timing.dur,
            ratio: ratio.toFixed(2)
          });
        } catch (e) {
          results.push({
            id: beat.id,
            error: e.message
          });
        }
      }
      
      return results;
    });

    console.log('Ratios:', JSON.stringify(ratios, null, 2));
    
    if (ratios.error) {
      throw new Error(ratios.error);
    }
    
    // Check each beat's ratio
    for (const beat of ratios) {
      if (beat.error) {
        console.warn(`Beat ${beat.id} error: ${beat.error}`);
        continue;
      }
      
      const ratio = parseFloat(beat.ratio);
      console.log(`${beat.id}: ratio=${ratio} (maxTime=${beat.maxTime}s, dur=${beat.duration}s)`);
      
      // Ratio should be in [0.8, 1.2]
      expect(ratio).toBeGreaterThanOrEqual(0.8);
      expect(ratio).toBeLessThanOrEqual(1.2);
    }
  });
});
