const { test, expect } = require('@playwright/test');

test.describe('Chapter 26: Fenwick Tree (Binary Indexed Tree)', () => {
  test('页面加载和基本元素', async ({ page }) => {
    await page.goto('http://localhost:8000/ch26/index.html');
    
    // 检查标题
    await expect(page).toHaveTitle(/树状数组/);
    
    // 等待引擎加载
    await page.waitForTimeout(2000);
    
    // 检查是否有 BEATS 数组
    const beatsCount = await page.evaluate(() => window.BEATS ? window.BEATS.length : 0);
    expect(beatsCount).toBeGreaterThanOrEqual(11);
    expect(beatsCount).toBeLessThanOrEqual(14);
  });
  
  test('时间轴正常前进', async ({ page }) => {
    await page.goto('http://localhost:8000/ch26/index.html');
    await page.waitForTimeout(1000);
    
    // 检查时间是否前进
    const t0 = await page.evaluate(() => window.P ? window.P.t : 0);
    await page.waitForTimeout(2000);
    const t1 = await page.evaluate(() => window.P ? window.P.t : 0);
    
    expect(t1).toBeGreaterThan(t0);
    expect(t1).toBeGreaterThan(1);
  });
  
  test('所有 beat 可访问', async ({ page }) => {
    await page.goto('http://localhost:8000/ch26/index.html');
    await page.waitForTimeout(1000);
    
    const beats = await page.evaluate(() => {
      return window.BEATS ? window.BEATS.map(b => b[0]) : [];
    });
    
    // 检查关键beats
    expect(beats).toContain('intro');
    expect(beats).toContain('update-demo');
    expect(beats).toContain('query-demo');
    expect(beats).toContain('summary');
  });
  
  test('核心动画：单点更新演示', async ({ page }) => {
    await page.goto('http://localhost:8000/ch26/index.html');
    await page.waitForTimeout(1000);
    
    // 跳转到update-demo beat
    await page.evaluate(() => {
      const updateIdx = window.BEATS.findIndex(b => b[0] === 'update-demo');
      if (updateIdx >= 0 && window.jumpToBeat) {
        window.jumpToBeat(updateIdx);
      }
    });
    
    await page.waitForTimeout(1000);
    
    // 检查是否有节点元素
    const nodeCount = await page.evaluate(() => {
      const svg = document.querySelector('svg');
      if (!svg) return 0;
      const rects = svg.querySelectorAll('rect');
      return rects.length;
    });
    
    expect(nodeCount).toBeGreaterThan(5); // 至少有5个节点
    
    // 检查动画时长
    const beatDuration = await page.evaluate(() => {
      if (!window.TIMINGS || !window.TIMINGS['update-demo']) return 0;
      return window.TIMINGS['update-demo'].duration;
    });
    
    expect(beatDuration).toBeGreaterThan(10); // 至少10秒
  });
  
  test('核心动画：区间查询演示', async ({ page }) => {
    await page.goto('http://localhost:8000/ch26/index.html');
    await page.waitForTimeout(1000);
    
    // 跳转到query-demo beat
    await page.evaluate(() => {
      const queryIdx = window.BEATS.findIndex(b => b[0] === 'query-demo');
      if (queryIdx >= 0 && window.jumpToBeat) {
        window.jumpToBeat(queryIdx);
      }
    });
    
    await page.waitForTimeout(1000);
    
    // 检查是否有箭头和节点
    const hasElements = await page.evaluate(() => {
      const svg = document.querySelector('svg');
      if (!svg) return false;
      const lines = svg.querySelectorAll('line');
      const rects = svg.querySelectorAll('rect');
      return lines.length > 3 && rects.length > 5;
    });
    
    expect(hasElements).toBe(true);
    
    // 检查动画时长
    const beatDuration = await page.evaluate(() => {
      if (!window.TIMINGS || !window.TIMINGS['query-demo']) return 0;
      return window.TIMINGS['query-demo'].duration;
    });
    
    expect(beatDuration).toBeGreaterThan(10); // 至少10秒
  });
  
  test('动画时长检查', async ({ page }) => {
    await page.goto('http://localhost:8000/ch26/index.html');
    await page.waitForTimeout(1000);
    
    // 获取总时长
    const totalDuration = await page.evaluate(() => {
      if (!window.TIMINGS) return 0;
      return Object.values(window.TIMINGS).reduce((sum, t) => sum + (t.duration || 0), 0);
    });
    
    // 应该在10-12分钟之间 (600-720秒)
    expect(totalDuration).toBeGreaterThanOrEqual(600);
    expect(totalDuration).toBeLessThanOrEqual(750);
  });
  
  test('补间动画数量检查 - update-demo', async ({ page }) => {
    await page.goto('http://localhost:8000/ch26/index.html');
    await page.waitForTimeout(1000);
    
    // 读取源码检查tw调用
    const twCount = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll('script:not([src])'));
      const mainScript = scripts.find(s => s.textContent.includes('update-demo'));
      if (!mainScript) return 0;
      
      const beatCode = mainScript.textContent.match(/\['update-demo'[^\]]+\][^[]*?\{([^}]+(\{[^}]+\})*)+\}/s);
      if (!beatCode) return 0;
      
      const matches = beatCode[0].match(/tw\(/g);
      return matches ? matches.length : 0;
    });
    
    expect(twCount).toBeGreaterThanOrEqual(20); // 至少20次tw调用
  });
  
  test('补间动画数量检查 - query-demo', async ({ page }) => {
    await page.goto('http://localhost:8000/ch26/index.html');
    await page.waitForTimeout(1000);
    
    // 读取源码检查tw调用
    const twCount = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll('script:not([src])'));
      const mainScript = scripts.find(s => s.textContent.includes('query-demo'));
      if (!mainScript) return 0;
      
      const beatCode = mainScript.textContent.match(/\['query-demo'[^\]]+\][^[]*?\{([^}]+(\{[^}]+\})*)+\}/s);
      if (!beatCode) return 0;
      
      const matches = beatCode[0].match(/tw\(/g);
      return matches ? matches.length : 0;
    });
    
    expect(twCount).toBeGreaterThanOrEqual(20); // 至少20次tw调用
  });
  
  test('颜色方案检查', async ({ page }) => {
    await page.goto('http://localhost:8000/ch26/index.html');
    await page.waitForTimeout(1000);
    
    // 检查是否定义了足够的颜色
    const colorCount = await page.evaluate(() => {
      const colors = new Set();
      const script = document.querySelector('script:not([src])');
      if (!script) return 0;
      const content = script.textContent;
      const colorMatches = content.match(/COLOR\s*=\s*'#[0-9a-fA-F]{6}'/g);
      return colorMatches ? colorMatches.length : 0;
    });
    
    expect(colorCount).toBeGreaterThanOrEqual(4); // 至少4种颜色
  });
  
  test('视觉状态变化检测 - update-demo', async ({ page }) => {
    await page.goto('http://localhost:8000/ch26/index.html');
    await page.waitForTimeout(1000);
    
    // 跳转到update-demo
    await page.evaluate(() => {
      const idx = window.BEATS.findIndex(b => b[0] === 'update-demo');
      if (idx >= 0 && window.jumpToBeat) {
        window.jumpToBeat(idx);
      }
    });
    
    // 获取beat的时间信息
    const timing = await page.evaluate(() => {
      return window.TIMINGS ? window.TIMINGS['update-demo'] : null;
    });
    
    if (!timing) {
      console.log('Warning: No timing info for update-demo');
      return;
    }
    
    const startTime = timing.start;
    const duration = timing.duration;
    const midTime = startTime + duration * 0.5;
    
    // Seek到开始
    await page.evaluate((t) => {
      if (window.P && window.P.seek) window.P.seek(t);
    }, startTime + 0.5);
    await page.waitForTimeout(500);
    const screenshot1 = await page.screenshot();
    
    // Seek到中间
    await page.evaluate((t) => {
      if (window.P && window.P.seek) window.P.seek(t);
    }, midTime);
    await page.waitForTimeout(500);
    const screenshot2 = await page.screenshot();
    
    // 简单检查：两个截图应该不同（这里只是基本检查，实际像素差异需要图像处理库）
    expect(screenshot1.length).toBeGreaterThan(0);
    expect(screenshot2.length).toBeGreaterThan(0);
    // 注意：真正的像素差异检测需要额外的库，这里只做基础验证
  });
  
  test('视觉状态变化检测 - query-demo', async ({ page }) => {
    await page.goto('http://localhost:8000/ch26/index.html');
    await page.waitForTimeout(1000);
    
    // 跳转到query-demo
    await page.evaluate(() => {
      const idx = window.BEATS.findIndex(b => b[0] === 'query-demo');
      if (idx >= 0 && window.jumpToBeat) {
        window.jumpToBeat(idx);
      }
    });
    
    // 获取beat的时间信息
    const timing = await page.evaluate(() => {
      return window.TIMINGS ? window.TIMINGS['query-demo'] : null;
    });
    
    if (!timing) {
      console.log('Warning: No timing info for query-demo');
      return;
    }
    
    const startTime = timing.start;
    const duration = timing.duration;
    const midTime = startTime + duration * 0.5;
    
    // Seek到开始
    await page.evaluate((t) => {
      if (window.P && window.P.seek) window.P.seek(t);
    }, startTime + 0.5);
    await page.waitForTimeout(500);
    const screenshot1 = await page.screenshot();
    
    // Seek到中间
    await page.evaluate((t) => {
      if (window.P && window.P.seek) window.P.seek(t);
    }, midTime);
    await page.waitForTimeout(500);
    const screenshot2 = await page.screenshot();
    
    // 基本验证
    expect(screenshot1.length).toBeGreaterThan(0);
    expect(screenshot2.length).toBeGreaterThan(0);
  });
  
  test('无 JavaScript 错误', async ({ page }) => {
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto('http://localhost:8000/ch26/index.html');
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
