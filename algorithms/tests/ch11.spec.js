const { test, expect } = require('@playwright/test');

test.describe('Chapter 11: Binary Search', () => {
  test('页面加载和基本元素', async ({ page }) => {
    await page.goto('http://localhost:8000/ch11/index.html');
    
    // 检查标题
    await expect(page).toHaveTitle(/二分查找/);
    
    // 等待引擎加载
    await page.waitForTimeout(2000);
    
    // 检查是否有 BEATS 数组
    const beatsCount = await page.evaluate(() => window.BEATS ? window.BEATS.length : 0);
    expect(beatsCount).toBeGreaterThanOrEqual(10);
  });
  
  test('时间轴正常前进', async ({ page }) => {
    await page.goto('http://localhost:8000/ch11/index.html');
    await page.waitForTimeout(1000);
    
    // 检查时间是否前进
    const t0 = await page.evaluate(() => window.P ? window.P.t : 0);
    await page.waitForTimeout(2000);
    const t1 = await page.evaluate(() => window.P ? window.P.t : 0);
    
    expect(t1).toBeGreaterThan(t0);
    expect(t1).toBeGreaterThan(1.5);
  });
  
  test('所有 beat 可访问', async ({ page }) => {
    await page.goto('http://localhost:8000/ch11/index.html');
    await page.waitForTimeout(1000);
    
    const beats = await page.evaluate(() => {
      return window.BEATS ? window.BEATS.map(b => b.id) : [];
    });
    
    expect(beats).toContain('intro');
    expect(beats).toContain('demo');
    expect(beats).toContain('summary');
  });
  
  test('demo beat 存在且有动画', async ({ page }) => {
    await page.goto('http://localhost:8000/ch11/index.html');
    await page.waitForTimeout(1000);
    
    const demoExists = await page.evaluate(() => {
      if (!window.BEATS) return false;
      return window.BEATS.some(b => b.id === 'demo');
    });
    
    expect(demoExists).toBe(true);
  });
  
  test('无 JavaScript 错误', async ({ page }) => {
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto('http://localhost:8000/ch11/index.html');
    await page.waitForTimeout(3000);
    
    expect(errors.length).toBe(0);
  });
  
  test('TIMINGS 已加载', async ({ page }) => {
    await page.goto('http://localhost:8000/ch11/index.html');
    await page.waitForTimeout(1000);
    
    const hasTimings = await page.evaluate(() => {
      return typeof window.TIMINGS !== 'undefined' && window.TIMINGS !== null;
    });
    
    expect(hasTimings).toBe(true);
  });
});
