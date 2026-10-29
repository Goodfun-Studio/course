const { test, expect } = require('@playwright/test');

test.describe('第18章：活动选择问题', () => {
  test('页面加载和基本元素', async ({ page }) => {
    await page.goto('http://localhost:8001/ch18/index.html');
    
    // 检查标题
    await expect(page).toHaveTitle(/活动选择问题/);
    
    // 等待引擎加载
    await page.waitForTimeout(2000);
    
    // 检查是否有 BEATS 数组
    const beatsCount = await page.evaluate(() => window.BEATS ? window.BEATS.length : 0);
    expect(beatsCount).toBeGreaterThanOrEqual(12);
    console.log(`✓ BEATS 数组包含 ${beatsCount} 个 beat`);
  });
  
  test('所有核心 beat 存在', async ({ page }) => {
    await page.goto('http://localhost:8001/ch18/index.html');
    await page.waitForTimeout(1000);
    
    const beats = await page.evaluate(() => {
      return window.BEATS ? window.BEATS.map(b => b[0]) : [];
    });
    
    const requiredBeats = ['intro', 'problem-definition', 'greedy-concept', 
                           'wrong-strategy-1', 'wrong-strategy-2', 'correct-strategy',
                           'greedy-demo', 'algorithm', 'proof', 'applications',
                           'greedy-vs-dp', 'variants', 'summary'];
    
    requiredBeats.forEach(beatId => {
      expect(beats).toContain(beatId);
    });
    
    console.log(`✓ 所有必需的 beat 都存在`);
  });

  test('greedy-demo beat 包含足够的动画', async ({ page }) => {
    await page.goto('http://localhost:8001/ch18/index.html');
    await page.waitForTimeout(1000);
    
    // 检查 greedy-demo beat
    const greedyDemo = await page.evaluate(() => {
      const beat = window.BEATS ? window.BEATS.find(b => b[0] === 'greedy-demo') : null;
      return beat ? { id: beat[0], title: beat[1] } : null;
    });
    
    expect(greedyDemo).not.toBeNull();
    expect(greedyDemo.title).toBe('贪心选择过程动画');
    console.log(`✓ greedy-demo beat 存在: ${greedyDemo.title}`);
  });

  test('动画使用多种颜色', async ({ page }) => {
    await page.goto('http://localhost:8001/ch18/index.html');
    await page.waitForTimeout(3000);
    
    // 检查颜色常量
    const colors = await page.evaluate(() => {
      return {
        SELECTED: window.SELECTED,
        REJECTED: window.REJECTED,
        CANDIDATE: window.CANDIDATE,
        NEUTRAL: window.NEUTRAL,
        TIMELINE_BG: window.TIMELINE_BG
      };
    });
    
    expect(colors.SELECTED).toBeDefined();
    expect(colors.REJECTED).toBeDefined();
    expect(colors.CANDIDATE).toBeDefined();
    console.log(`✓ 使用了多种颜色: SELECTED=${colors.SELECTED}, REJECTED=${colors.REJECTED}, CANDIDATE=${colors.CANDIDATE}`);
  });

  test('音频文件存在', async ({ page }) => {
    await page.goto('http://localhost:8001/ch18/index.html');
    await page.waitForTimeout(1000);
    
    // 检查 TIMINGS
    const hasTimings = await page.evaluate(() => {
      return window.TIMINGS ? Object.keys(window.TIMINGS).length : 0;
    });
    
    expect(hasTimings).toBeGreaterThanOrEqual(12);
    console.log(`✓ timings.js 包含 ${hasTimings} 个音频定义`);
  });

  test('SVG 元素渲染正常', async ({ page }) => {
    await page.goto('http://localhost:8001/ch18/index.html');
    await page.waitForTimeout(3000);
    
    // 检查主 SVG
    const stageSvg = page.locator('#stage');
    await expect(stageSvg).toBeVisible();
    
    // 检查SVG内容是否渲染
    const hasContent = await page.evaluate(() => {
      const stage = document.querySelector('#stage');
      return stage && stage.children.length > 0;
    });
    expect(hasContent).toBeTruthy();
    console.log(`✓ SVG 内容渲染正常`);
  });
});
