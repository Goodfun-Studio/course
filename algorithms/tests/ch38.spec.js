const { test, expect } = require('@playwright/test');

test.describe('Chapter 38: Bloom Filter', () => {
  test('页面加载和基本元素', async ({ page }) => {
    await page.goto('http://localhost:8000/ch38/index.html');
    
    // 检查标题
    await expect(page).toHaveTitle(/Bloom Filter/);
    
    // 等待引擎加载
    await page.waitForTimeout(2000);
    
    // 检查是否有 BEATS 数组
    const beatsCount = await page.evaluate(() => window.BEATS ? window.BEATS.length : 0);
    expect(beatsCount).toBe(12);
  });
  
  test('时间轴正常前进', async ({ page }) => {
    await page.goto('http://localhost:8000/ch38/index.html');
    
    // 等待引擎完全初始化
    await page.waitForFunction(() => window.P && window.P.t !== undefined, { timeout: 5000 });
    await page.waitForTimeout(500);
    
    // 检查时间是否前进
    const t0 = await page.evaluate(() => window.P.t);
    await page.waitForTimeout(2000);
    const t1 = await page.evaluate(() => window.P.t);
    
    expect(t1).toBeGreaterThan(t0);
    expect(t1).toBeGreaterThan(1);
  });
  
  test('所有 beat 可访问', async ({ page }) => {
    await page.goto('http://localhost:8000/ch38/index.html');
    await page.waitForTimeout(1000);
    
    const beats = await page.evaluate(() => {
      return window.BEATS ? window.BEATS.map(b => b[0]) : [];
    });
    
    expect(beats).toContain('intro');
    expect(beats).toContain('insert_demo');
    expect(beats).toContain('query_demo');
    expect(beats).toContain('summary');
  });
  
  test('插入动画 - 检查补间次数 (≥20次)', async ({ page }) => {
    await page.goto('http://localhost:8000/ch38/index.html');
    await page.waitForTimeout(1000);
    
    // 跳转到 insert_demo beat
    await page.evaluate(() => {
      if (window.P && window.BEATS) {
        const beatIndex = window.BEATS.findIndex(b => b[0] === 'insert_demo');
        if (beatIndex >= 0) {
          window.P.goto(beatIndex);
        }
      }
    });
    
    await page.waitForTimeout(500);
    
    // 重置补间计数
    await page.evaluate(() => {
      window.tweenCount = 0;
      const originalTw = window.tw;
      window.tw = function(...args) {
        window.tweenCount++;
        return originalTw.apply(this, args);
      };
    });
    
    // 重新执行 beat
    await page.evaluate(() => {
      const beatIndex = window.BEATS.findIndex(b => b[0] === 'insert_demo');
      if (beatIndex >= 0 && window.BEATS[beatIndex][2]) {
        window.BEATS[beatIndex][2]();
      }
    });
    
    await page.waitForTimeout(500);
    
    const tweenCount = await page.evaluate(() => window.tweenCount || 0);
    console.log(`insert_demo 补间次数: ${tweenCount}`);
    expect(tweenCount).toBeGreaterThanOrEqual(20);
  });
  
  test('查询动画 - 检查补间次数 (≥20次)', async ({ page }) => {
    await page.goto('http://localhost:8000/ch38/index.html');
    await page.waitForTimeout(1000);
    
    // 跳转到 query_demo beat
    await page.evaluate(() => {
      if (window.P && window.BEATS) {
        const beatIndex = window.BEATS.findIndex(b => b[0] === 'query_demo');
        if (beatIndex >= 0) {
          window.P.goto(beatIndex);
        }
      }
    });
    
    await page.waitForTimeout(500);
    
    // 重置补间计数
    await page.evaluate(() => {
      window.tweenCount = 0;
      const originalTw = window.tw;
      window.tw = function(...args) {
        window.tweenCount++;
        return originalTw.apply(this, args);
      };
    });
    
    // 重新执行 beat
    await page.evaluate(() => {
      const beatIndex = window.BEATS.findIndex(b => b[0] === 'query_demo');
      if (beatIndex >= 0 && window.BEATS[beatIndex][2]) {
        window.BEATS[beatIndex][2]();
      }
    });
    
    await page.waitForTimeout(500);
    
    const tweenCount = await page.evaluate(() => window.tweenCount || 0);
    console.log(`query_demo 补间次数: ${tweenCount}`);
    expect(tweenCount).toBeGreaterThanOrEqual(20);
  });
  
  test('插入动画持续时间 (≥10秒)', async ({ page }) => {
    await page.goto('http://localhost:8000/ch38/index.html');
    await page.waitForTimeout(1000);
    
    // 跳转到 insert_demo
    await page.evaluate(() => {
      if (window.P && window.BEATS) {
        const beatIndex = window.BEATS.findIndex(b => b[0] === 'insert_demo');
        if (beatIndex >= 0) {
          window.P.goto(beatIndex);
        }
      }
    });
    
    await page.waitForTimeout(500);
    
    // 记录最大补间时间
    await page.evaluate(() => {
      window.maxTweenTime = 0;
      const originalTw = window.tw;
      window.tw = function(elem, props, delay = 0, duration = 0.5) {
        const endTime = delay + duration;
        if (endTime > window.maxTweenTime) {
          window.maxTweenTime = endTime;
        }
        return originalTw.apply(this, arguments);
      };
    });
    
    // 重新执行 beat
    await page.evaluate(() => {
      const beatIndex = window.BEATS.findIndex(b => b[0] === 'insert_demo');
      if (beatIndex >= 0 && window.BEATS[beatIndex][2]) {
        window.BEATS[beatIndex][2]();
      }
    });
    
    await page.waitForTimeout(500);
    
    const maxTime = await page.evaluate(() => window.maxTweenTime || 0);
    console.log(`insert_demo 动画时长: ${maxTime} 秒`);
    expect(maxTime).toBeGreaterThanOrEqual(10);
  });
  
  test('查询动画持续时间 (≥10秒)', async ({ page }) => {
    await page.goto('http://localhost:8000/ch38/index.html');
    await page.waitForTimeout(1000);
    
    // 跳转到 query_demo
    await page.evaluate(() => {
      if (window.P && window.BEATS) {
        const beatIndex = window.BEATS.findIndex(b => b[0] === 'query_demo');
        if (beatIndex >= 0) {
          window.P.goto(beatIndex);
        }
      }
    });
    
    await page.waitForTimeout(500);
    
    // 记录最大补间时间
    await page.evaluate(() => {
      window.maxTweenTime = 0;
      const originalTw = window.tw;
      window.tw = function(elem, props, delay = 0, duration = 0.5) {
        const endTime = delay + duration;
        if (endTime > window.maxTweenTime) {
          window.maxTweenTime = endTime;
        }
        return originalTw.apply(this, arguments);
      };
    });
    
    // 重新执行 beat
    await page.evaluate(() => {
      const beatIndex = window.BEATS.findIndex(b => b[0] === 'query_demo');
      if (beatIndex >= 0 && window.BEATS[beatIndex][2]) {
        window.BEATS[beatIndex][2]();
      }
    });
    
    await page.waitForTimeout(500);
    
    const maxTime = await page.evaluate(() => window.maxTweenTime || 0);
    console.log(`query_demo 动画时长: ${maxTime} 秒`);
    expect(maxTime).toBeGreaterThanOrEqual(10);
  });
  
  test('检查使用了 4+ 种颜色', async ({ page }) => {
    await page.goto('http://localhost:8000/ch38/index.html');
    await page.waitForTimeout(2000);
    
    // 执行第一个beat确保有元素渲染
    await page.evaluate(() => {
      if (window.BEATS && window.BEATS.length > 0) {
        window.BEATS[0][2](); // 执行 intro
      }
    });
    
    await page.waitForTimeout(1000);
    
    const colorCount = await page.evaluate(() => {
      const colors = new Set();
      const svgElements = document.querySelectorAll('svg *[fill], svg *[stroke]');
      
      svgElements.forEach(el => {
        const fill = el.getAttribute('fill');
        const stroke = el.getAttribute('stroke');
        if (fill && fill !== 'none' && fill !== 'transparent') colors.add(fill);
        if (stroke && stroke !== 'none' && stroke !== 'transparent') colors.add(stroke);
      });
      
      return colors.size;
    });
    
    console.log(`使用了 ${colorCount} 种颜色`);
    expect(colorCount).toBeGreaterThanOrEqual(4);
  });
  
  test('检查文字间距 (≥60px)', async ({ page }) => {
    await page.goto('http://localhost:8000/ch38/index.html');
    await page.waitForTimeout(1000);
    
    const minDistance = await page.evaluate(() => {
      const texts = Array.from(document.querySelectorAll('text'));
      if (texts.length < 2) return 1000;
      
      let minDist = 1000;
      for (let i = 0; i < texts.length; i++) {
        for (let j = i + 1; j < texts.length; j++) {
          const rect1 = texts[i].getBoundingClientRect();
          const rect2 = texts[j].getBoundingClientRect();
          
          const dx = Math.abs(rect1.x - rect2.x);
          const dy = Math.abs(rect1.y - rect2.y);
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist > 0 && dist < minDist) {
            minDist = dist;
          }
        }
      }
      
      return minDist;
    });
    
    console.log(`最小文字间距: ${minDistance} px`);
    expect(minDistance).toBeGreaterThanOrEqual(60);
  });
  
  test('检查 panel(0) 和 panel(800) 的使用', async ({ page }) => {
    await page.goto('http://localhost:8000/ch38/index.html');
    await page.waitForTimeout(1000);
    
    const panelUsage = await page.evaluate(() => {
      let panel0Count = 0;
      let panel800Count = 0;
      
      // 检查每个 beat 的代码
      if (window.BEATS) {
        window.BEATS.forEach(beat => {
          const funcStr = beat[2].toString();
          if (funcStr.includes('panel(0)')) panel0Count++;
          if (funcStr.includes('panel(800)')) panel800Count++;
        });
      }
      
      return { panel0Count, panel800Count };
    });
    
    console.log(`panel(0): ${panelUsage.panel0Count}, panel(800): ${panelUsage.panel800Count}`);
    expect(panelUsage.panel0Count).toBeGreaterThan(0);
    expect(panelUsage.panel800Count).toBeGreaterThan(0);
  });
});
