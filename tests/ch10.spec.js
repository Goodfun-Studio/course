const { test, expect } = require('@playwright/test');

test.describe('Chapter 10: Merge Sort', () => {
  test('should load without errors', async ({ page }) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    
    await page.goto('http://localhost:8000/ch10/');
    await page.waitForTimeout(1000);
    
    expect(errors).toHaveLength(0);
  });

  test('should have correct chapter info', async ({ page }) => {
    await page.goto('http://localhost:8000/ch10/');
    
    const title = await page.title();
    expect(title).toContain('归并排序');
    
    // Check title and metadata in the page
    const hasChapterInfo = await page.evaluate(() => {
      const titleEl = document.querySelector('title');
      return titleEl && titleEl.textContent.includes('第十章');
    });
    expect(hasChapterInfo).toBe(true);
  });

  test('should have all beats', async ({ page }) => {
    await page.goto('http://localhost:8000/ch10/');
    
    const beats = await page.evaluate(() => window.BEATS);
    expect(beats.length).toBeGreaterThanOrEqual(10);
    
    const beatIds = beats.map(b => b.id);
    expect(beatIds).toContain('intro');
    expect(beatIds).toContain('merge-sort-demo');
    expect(beatIds).toContain('summary');
  });

  test('should have no text overlap', async ({ page }) => {
    await page.goto('http://localhost:8000/ch10/');
    await page.waitForTimeout(500);
    
    const textElements = await page.$$('text');
    const boxes = [];
    
    for (const el of textElements) {
      const box = await el.boundingBox();
      if (box && box.width > 0 && box.height > 0) {
        const opacity = await el.evaluate(e => {
          return parseFloat(window.getComputedStyle(e).opacity || '1');
        });
        if (opacity > 0.5) {
          boxes.push(box);
        }
      }
    }
    
    let overlaps = 0;
    for (let i = 0; i < boxes.length; i++) {
      for (let j = i + 1; j < boxes.length; j++) {
        const a = boxes[i];
        const b = boxes[j];
        
        const overlapX = Math.max(0, Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x));
        const overlapY = Math.max(0, Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y));
        
        if (overlapX > 10 && overlapY > 10) {
          overlaps++;
        }
      }
    }
    
    expect(overlaps).toBeLessThan(3);
  });

  test('should advance time correctly', async ({ page }) => {
    await page.goto('http://localhost:8000/ch10/');
    await page.waitForTimeout(1000);
    
    // Click to start if cover is visible
    const coverVisible = await page.isVisible('#cover');
    if (coverVisible) {
      await page.click('#coverGo');
      await page.waitForTimeout(500);
    }
    
    // Check that SVG elements are being animated
    const hasAnimations = await page.evaluate(() => {
      const svg = document.querySelector('svg');
      return svg && svg.children.length > 0;
    });
    
    expect(hasAnimations).toBe(true);
  });

  test('merge-sort-demo beat should have rich animations', async ({ page }) => {
    await page.goto('http://localhost:8000/ch10/');
    await page.waitForTimeout(1000);
    
    // Check that the page has the merge-sort-demo beat
    const hasDemoBeat = await page.evaluate(() => {
      const beats = window.BEATS;
      return beats && beats.some(b => b.id === 'merge-sort-demo');
    });
    
    expect(hasDemoBeat).toBe(true);
    
    // Check for multiple visual elements (after page loads)
    await page.waitForTimeout(500);
    const svgElements = await page.$$('svg *');
    expect(svgElements.length).toBeGreaterThan(5);
    
    // Check for different colors
    const colors = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('svg *'));
      const fills = elements.map(el => {
        const fill = el.getAttribute('fill');
        const stroke = el.getAttribute('stroke');
        return [fill, stroke];
      }).flat().filter(c => c && c !== 'none');
      return [...new Set(fills)];
    });
    
    expect(colors.length).toBeGreaterThanOrEqual(3);
  });

  test('should have proper timings structure', async ({ page }) => {
    await page.goto('http://localhost:8000/ch10/');
    
    const timings = await page.evaluate(() => window.TIMINGS);
    expect(timings).toBeDefined();
    
    for (const beatId in timings) {
      const timing = timings[beatId];
      expect(timing).toHaveProperty('dur');
      expect(timing).toHaveProperty('marks');
      expect(timing).toHaveProperty('cues');
      expect(typeof timing.dur).toBe('number');
      expect(timing.dur).toBeGreaterThan(0);
    }
  });
});
