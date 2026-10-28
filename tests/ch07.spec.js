const { test, expect } = require('@playwright/test');

test.describe('Chapter 7: Minimum Spanning Trees', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8765/algorithms/ch07/');
    await page.waitForLoadState('networkidle');
  });

  const beats = [
    'intro',
    'definition',
    'applications',
    'boruvka-intro',
    'boruvka-demo',
    'prim-intro',
    'prim-demo',
    'kruskal-intro',
    'kruskal-demo',
    'comparison',
    'complexity',
    'finish'
  ];

  beats.forEach((beatId, index) => {
    test(`should render beat ${index + 1}: ${beatId}`, async ({ page }) => {
      // Wait for page to load
      await page.waitForTimeout(1000);
      
      // Check no JavaScript errors
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      
      // Navigate to beat (if not first)
      if (index > 0) {
        for (let i = 0; i < index; i++) {
          await page.keyboard.press('ArrowRight');
          await page.waitForTimeout(500);
        }
      }
      
      // Take screenshot
      await page.screenshot({ 
        path: `algorithms/ch07/screenshots/${beatId}.png`,
        fullPage: false 
      });
      
      // Verify no errors
      expect(errors).toHaveLength(0);
      
      // Verify SVG content exists
      const svg = await page.locator('svg').first();
      await expect(svg).toBeVisible();
    });
  });

  test('should have correct chapter metadata', async ({ page }) => {
    const title = await page.title();
    expect(title).toContain('最小生成树');
  });

  test('should have all audio files', async ({ page }) => {
    const timings = await page.evaluate(() => window.TIMINGS);
    expect(Object.keys(timings)).toHaveLength(12);
    
    beats.forEach(beatId => {
      expect(timings[beatId]).toBeDefined();
      expect(timings[beatId].dur).toBeGreaterThan(0);
    });
  });

  test('should navigate through all beats', async ({ page }) => {
    await page.waitForTimeout(1000);
    
    for (let i = 0; i < beats.length - 1; i++) {
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(800);
    }
    
    // Should reach the end
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    expect(errors).toHaveLength(0);
  });
});
