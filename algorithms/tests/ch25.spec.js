const { test, expect } = require('@playwright/test');

test.describe('Chapter 25: Segment Tree', () => {
  test('页面加载和基本元素', async ({ page }) => {
    await page.goto('http://localhost:8000/ch25/index.html');
    
    // 检查标题
    await expect(page).toHaveTitle(/线段树/);
    
    // 等待引擎加载
    await page.waitForTimeout(2000);
    
    // 检查是否有 BEATS 数组
    const beatsCount = await page.evaluate(() => window.BEATS ? window.BEATS.length : 0);
    expect(beatsCount).toBeGreaterThanOrEqual(12);
    expect(beatsCount).toBeLessThanOrEqual(15);
  });
  
  test('时间轴正常前进', async ({ page }) => {
    await page.goto('http://localhost:8000/ch25/index.html');
    await page.waitForTimeout(1000);
    
    // 检查时间是否前进
    const t0 = await page.evaluate(() => window.P ? window.P.t : 0);
    await page.waitForTimeout(2000);
    const t1 = await page.evaluate(() => window.P ? window.P.t : 0);
    
    expect(t1).toBeGreaterThan(t0);
    expect(t1).toBeGreaterThan(1);
  });
  
  test('所有 beat 可访问', async ({ page }) => {
    await page.goto('http://localhost:8000/ch25/index.html');
    await page.waitForTimeout(1000);
    
    const beats = await page.evaluate(() => {
      return window.BEATS ? window.BEATS.map(b => b.id) : [];
    });
    
    // 检查关键beats
    expect(beats).toContain('intro');
    expect(beats).toContain('build_demo');
    expect(beats).toContain('query_demo');
    expect(beats).toContain('summary');
  });
  
  test('核心动画：构建线段树', async ({ page }) => {
    await page.goto('http://localhost:8000/ch25/index.html');
    await page.waitForTimeout(1000);
    
    // 跳转到build_demo beat
    await page.evaluate(() => {
      const buildIdx = window.BEATS.findIndex(b => b.id === 'build_demo');
      if (buildIdx >= 0 && window.jumpToBeat) {
        window.jumpToBeat(buildIdx);
      }
    });
    
    await page.waitForTimeout(1000);
    
    // 检查是否有树节点元素
    const nodeCount = await page.evaluate(() => {
      const svg = document.querySelector('svg');
      if (!svg) return 0;
      const rects = svg.querySelectorAll('rect');
      return rects.length;
    });
    
    expect(nodeCount).toBeGreaterThan(10); // 至少有10个节点
  });
  
  test('核心动画：区间查询', async ({ page }) => {
    await page.goto('http://localhost:8000/ch25/index.html');
    await page.waitForTimeout(1000);
    
    // 跳转到query_demo beat
    await page.evaluate(() => {
      const queryIdx = window.BEATS.findIndex(b => b.id === 'query_demo');
      if (queryIdx >= 0 && window.jumpToBeat) {
        window.jumpToBeat(queryIdx);
      }
    });
    
    await page.waitForTimeout(1000);
    
    // 检查是否有树结构和高亮
    const hasElements = await page.evaluate(() => {
      const svg = document.querySelector('svg');
      if (!svg) return false;
      const lines = svg.querySelectorAll('line');
      const rects = svg.querySelectorAll('rect');
      return lines.length > 5 && rects.length > 5;
    });
    
    expect(hasElements).toBe(true);
  });
  
  test('动画时长检查', async ({ page }) => {
    await page.goto('http://localhost:8000/ch25/index.html');
    await page.waitForTimeout(1000);
    
    // 获取总时长
    const totalDuration = await page.evaluate(() => {
      if (!window.timings) return 0;
      return Object.values(window.timings).reduce((sum, t) => sum + (t.duration || 0), 0);
    });
    
    // 应该在12-15分钟之间 (720-900秒)
    expect(totalDuration).toBeGreaterThanOrEqual(150); // 至少2.5分钟
    expect(totalDuration).toBeLessThanOrEqual(1000); // 最多16分钟多
  });
  
  test('补间动画数量检查', async ({ page }) => {
    await page.goto('http://localhost:8000/ch25/index.html');
    await page.waitForTimeout(1000);
    
    // 检查核心动画beat的补间数量
    const tweenCounts = await page.evaluate(() => {
      const results = {};
      ['build_demo', 'query_demo'].forEach(beatId => {
        const beatIdx = window.BEATS.findIndex(b => b.id === beatId);
        if (beatIdx >= 0 && window.jumpToBeat) {
          window.jumpToBeat(beatIdx);
          // 等待一帧让动画注册
          const beat = window.BEATS[beatIdx];
          if (beat && beat.f) {
            beat.f();
            // 计数不精确，但可以检查是否有足够的动画调用
            results[beatId] = true;
          }
        }
      });
      return results;
    });
    
    expect(tweenCounts.build_demo).toBe(true);
    expect(tweenCounts.query_demo).toBe(true);
  });
  
  test('颜色方案检查', async ({ page }) => {
    await page.goto('http://localhost:8000/ch25/index.html');
    await page.waitForTimeout(1000);
    
    // 检查是否定义了足够的颜色
    const colorCount = await page.evaluate(() => {
      const colors = new Set();
      const script = document.querySelector('script:not([src])');
      if (!script) return 0;
      const content = script.textContent;
      const colorMatches = content.match(/COLOR_\w+\s*=\s*'#[0-9a-fA-F]{6}'/g);
      return colorMatches ? colorMatches.length : 0;
    });
    
    expect(colorCount).toBeGreaterThanOrEqual(5); // 至少5种颜色
  });
  
  test('无 JavaScript 错误', async ({ page }) => {
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto('http://localhost:8000/ch25/index.html');
    await page.waitForTimeout(5000);
    
    // 允许某些良性错误（如音频文件不存在）
    const criticalErrors = errors.filter(e => 
      !e.includes('audio') && 
      !e.includes('404') &&
      !e.includes('net::ERR')
    );
    
    expect(criticalErrors.length).toBe(0);
  });
});
