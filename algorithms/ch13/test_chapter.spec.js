const { test, expect } = require('@playwright/test');

test.describe('第十三章：拓扑排序', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8765/algorithms/ch13/');
    await page.waitForTimeout(1000);
  });

  test('页面加载正常', async ({ page }) => {
    const title = await page.title();
    expect(title).toContain('第十三章');
    expect(title).toContain('拓扑排序');
  });

  test('所有 beats 可以访问', async ({ page }) => {
    const beatCount = await page.evaluate(() => window.BEATS ? window.BEATS.length : 0);
    expect(beatCount).toBeGreaterThanOrEqual(13);
  });

  test('beat 0: intro', async ({ page }) => {
    await page.evaluate(() => window.jumpToBeat(0));
    await page.waitForTimeout(500);
    
    const screenshot = await page.screenshot();
    expect(screenshot).toBeTruthy();
  });

  test('beat 1: motivation', async ({ page }) => {
    await page.evaluate(() => window.jumpToBeat(1));
    await page.waitForTimeout(500);
    
    const screenshot = await page.screenshot();
    expect(screenshot).toBeTruthy();
  });

  test('beat 2: dag-concept', async ({ page }) => {
    await page.evaluate(() => window.jumpToBeat(2));
    await page.waitForTimeout(500);
    
    const screenshot = await page.screenshot();
    expect(screenshot).toBeTruthy();
  });

  test('beat 3: topo-definition', async ({ page }) => {
    await page.evaluate(() => window.jumpToBeat(3));
    await page.waitForTimeout(500);
    
    const screenshot = await page.screenshot();
    expect(screenshot).toBeTruthy();
  });

  test('beat 4: kahn-concept', async ({ page }) => {
    await page.evaluate(() => window.jumpToBeat(4));
    await page.waitForTimeout(500);
    
    const screenshot = await page.screenshot();
    expect(screenshot).toBeTruthy();
  });

  test('beat 5: kahn-example', async ({ page }) => {
    await page.evaluate(() => window.jumpToBeat(5));
    await page.waitForTimeout(500);
    
    const screenshot = await page.screenshot();
    expect(screenshot).toBeTruthy();
  });

  test('beat 6: kahn-demo (动画演示)', async ({ page }) => {
    await page.evaluate(() => window.jumpToBeat(6));
    await page.waitForTimeout(2000);
    
    const screenshot = await page.screenshot();
    expect(screenshot).toBeTruthy();
    
    // 检查是否有节点元素
    const hasNodes = await page.evaluate(() => {
      const circles = document.querySelectorAll('circle');
      return circles.length > 5;
    });
    expect(hasNodes).toBe(true);
  });

  test('beat 7: dfs-method', async ({ page }) => {
    await page.evaluate(() => window.jumpToBeat(7));
    await page.waitForTimeout(500);
    
    const screenshot = await page.screenshot();
    expect(screenshot).toBeTruthy();
  });

  test('beat 8: dfs-example', async ({ page }) => {
    await page.evaluate(() => window.jumpToBeat(8));
    await page.waitForTimeout(500);
    
    const screenshot = await page.screenshot();
    expect(screenshot).toBeTruthy();
  });

  test('beat 9: comparison', async ({ page }) => {
    await page.evaluate(() => window.jumpToBeat(9));
    await page.waitForTimeout(500);
    
    const screenshot = await page.screenshot();
    expect(screenshot).toBeTruthy();
  });

  test('beat 10: complexity', async ({ page }) => {
    await page.evaluate(() => window.jumpToBeat(10));
    await page.waitForTimeout(500);
    
    const screenshot = await page.screenshot();
    expect(screenshot).toBeTruthy();
  });

  test('beat 11: applications', async ({ page }) => {
    await page.evaluate(() => window.jumpToBeat(11));
    await page.waitForTimeout(500);
    
    const screenshot = await page.screenshot();
    expect(screenshot).toBeTruthy();
  });

  test('beat 12: uniqueness', async ({ page }) => {
    await page.evaluate(() => window.jumpToBeat(12));
    await page.waitForTimeout(500);
    
    const screenshot = await page.screenshot();
    expect(screenshot).toBeTruthy();
  });

  test('beat 13: summary', async ({ page }) => {
    await page.evaluate(() => window.jumpToBeat(13));
    await page.waitForTimeout(500);
    
    const screenshot = await page.screenshot();
    expect(screenshot).toBeTruthy();
  });

  test('练习题显示正常', async ({ page }) => {
    const lastBeat = await page.evaluate(() => window.BEATS.length - 1);
    await page.evaluate((beat) => window.jumpToBeat(beat), lastBeat);
    await page.waitForTimeout(1000);
    
    // 跳转到练习题
    await page.evaluate(() => {
      const nextBtn = document.querySelector('.next-btn');
      if (nextBtn) nextBtn.click();
    });
    await page.waitForTimeout(500);
    
    const hasExercises = await page.evaluate(() => {
      return document.body.textContent.includes('练习') || 
             document.body.textContent.includes('问题');
    });
    expect(hasExercises).toBe(true);
  });

  test('无 JavaScript 错误', async ({ page }) => {
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.evaluate(() => window.jumpToBeat(0));
    await page.waitForTimeout(1000);
    
    expect(errors.length).toBe(0);
  });
});
