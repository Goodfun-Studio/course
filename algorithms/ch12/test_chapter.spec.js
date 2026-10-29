const { test, expect } = require('@playwright/test');

test.describe('Chapter 12: Heap Sort', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8765/ch12/');
    await page.waitForTimeout(1000);
  });

  test('应该加载页面并显示标题', async ({ page }) => {
    const title = await page.title();
    expect(title).toContain('堆排序');
  });

  test('应该包含所有 beats', async ({ page }) => {
    const beats = await page.evaluate(() => window.BEATS);
    expect(beats).toBeDefined();
    expect(beats.length).toBeGreaterThanOrEqual(12);
  });

  test('应该正确加载 timings', async ({ page }) => {
    const timings = await page.evaluate(() => window.TIMINGS);
    expect(timings).toBeDefined();
    expect(timings.intro).toBeDefined();
    expect(timings.intro.dur).toBeGreaterThan(0);
    expect(timings.intro.marks).toBeDefined();
    expect(timings.intro.cues).toBeDefined();
  });

  test('播放器应该能正常工作', async ({ page }) => {
    await page.waitForTimeout(3000);
    const time = await page.evaluate(() => window.P && window.P.t);
    expect(time).toBeGreaterThan(2);
  });

  test('应该没有 JavaScript 错误', async ({ page }) => {
    const errors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.waitForTimeout(2000);
    expect(errors.length).toBe(0);
  });

  test('应该能截图所有 beats', async ({ page }) => {
    const beats = await page.evaluate(() => window.BEATS);
    
    for (let i = 0; i < Math.min(beats.length, 5); i++) {
      await page.evaluate((index) => {
        window.P.jumpToBeat(index);
      }, i);
      
      await page.waitForTimeout(500);
      await page.screenshot({ 
        path: `tests/screenshots/ch12-beat${i}.png`,
        fullPage: true 
      });
    }
  });

  test('heap-sort-demo beat 应该存在', async ({ page }) => {
    const beats = await page.evaluate(() => window.BEATS);
    const demoId = beats.find(b => b.id === 'heap-sort-demo');
    expect(demoId).toBeDefined();
  });
});
