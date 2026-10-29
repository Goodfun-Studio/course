const { test, expect } = require('@playwright/test');

test.describe('Chapter 30: Convex Hull (Graham Scan)', () => {
  test('页面加载和基本元素', async ({ page }) => {
    await page.goto('http://localhost:8000/ch30/index.html');
    
    // 检查标题
    await expect(page).toHaveTitle(/Graham Scan/);
    
    // 等待引擎加载
    await page.waitForTimeout(2000);
    
    // 检查是否有 BEATS 数组
    const beatsCount = await page.evaluate(() => window.BEATS ? window.BEATS.length : 0);
    expect(beatsCount).toBe(12);
  });
  
  test('时间轴正常前进', async ({ page }) => {
    await page.goto('http://localhost:8000/ch30/index.html');
    await page.waitForTimeout(1000);
    
    // 检查时间是否前进
    const t0 = await page.evaluate(() => window.P ? window.P.t : 0);
    await page.waitForTimeout(2000);
    const t1 = await page.evaluate(() => window.P ? window.P.t : 0);
    
    expect(t1).toBeGreaterThan(t0);
    expect(t1).toBeGreaterThan(1);
  });
  
  test('所有 beat 可访问', async ({ page }) => {
    await page.goto('http://localhost:8000/ch30/index.html');
    await page.waitForTimeout(1000);
    
    const beats = await page.evaluate(() => {
      return window.BEATS ? window.BEATS.map(b => b[0]) : [];
    });
    
    expect(beats).toContain('intro');
    expect(beats).toContain('polar_sort');
    expect(beats).toContain('build_hull');
    expect(beats).toContain('summary');
  });
  
  test('极角排序动画 - 检查补间次数', async ({ page }) => {
    await page.goto('http://localhost:8000/ch30/index.html');
    await page.waitForTimeout(1000);
    
    // 跳转到 polar_sort beat
    await page.evaluate(() => {
      const idx = window.BEATS.findIndex(b => b[0] === 'polar_sort');
      if (idx >= 0 && window.P) {
        window.P.jump(idx);
      }
    });
    
    await page.waitForTimeout(500);
    
    // 检查是否有足够的动画元素
    const animElements = await page.evaluate(() => {
      const svg = document.querySelector('svg');
      if (!svg) return 0;
      
      // 计数有 opacity transition 的元素
      const allElements = svg.querySelectorAll('*');
      let count = 0;
      allElements.forEach(el => {
        const style = window.getComputedStyle(el);
        if (style.transition && style.transition.includes('opacity')) {
          count++;
        }
      });
      return count;
    });
    
    // 极角排序应该有大量动画元素（点、射线、标签）
    expect(animElements).toBeGreaterThan(15);
  });
  
  test('凸包构建动画 - 检查栈可视化', async ({ page }) => {
    await page.goto('http://localhost:8000/ch30/index.html');
    await page.waitForTimeout(1000);
    
    // 跳转到 build_hull beat (panel 800)
    await page.evaluate(() => {
      const idx = window.BEATS.findIndex(b => b[0] === 'build_hull');
      if (idx >= 0 && window.P) {
        window.P.jump(idx);
      }
    });
    
    await page.waitForTimeout(500);
    
    // 检查是否有"栈"标签
    const hasStackLabel = await page.evaluate(() => {
      const svg = document.querySelector('svg');
      if (!svg) return false;
      
      const texts = Array.from(svg.querySelectorAll('text'));
      return texts.some(t => t.textContent.includes('栈'));
    });
    
    expect(hasStackLabel).toBe(true);
    
    // 检查是否有凸包线条（绿色粗线）
    const hasHullLines = await page.evaluate(() => {
      const svg = document.querySelector('svg');
      if (!svg) return false;
      
      const lines = Array.from(svg.querySelectorAll('line'));
      return lines.some(l => l.getAttribute('stroke') === '#2ecc71');
    });
    
    expect(hasHullLines).toBe(true);
  });
  
  test('叉积判断动画 - 检查箭头', async ({ page }) => {
    await page.goto('http://localhost:8000/ch30/index.html');
    await page.waitForTimeout(1000);
    
    // 跳转到 cross_product beat
    await page.evaluate(() => {
      const idx = window.BEATS.findIndex(b => b[0] === 'cross_product');
      if (idx >= 0 && window.P) {
        window.P.jump(idx);
      }
    });
    
    await page.waitForTimeout(500);
    
    // 检查是否有箭头（多条线组成）
    const lineCount = await page.evaluate(() => {
      const svg = document.querySelector('svg');
      if (!svg) return 0;
      return svg.querySelectorAll('line').length;
    });
    
    // 应该有向量箭头（每个箭头3条线）
    expect(lineCount).toBeGreaterThan(6);
  });
  
  test('颜色方案正确应用', async ({ page }) => {
    await page.goto('http://localhost:8000/ch30/index.html');
    await page.waitForTimeout(1000);
    
    const colors = await page.evaluate(() => {
      const svg = document.querySelector('svg');
      if (!svg) return [];
      
      const fills = new Set();
      const strokes = new Set();
      
      svg.querySelectorAll('*').forEach(el => {
        const fill = el.getAttribute('fill');
        const stroke = el.getAttribute('stroke');
        if (fill && fill !== 'none') fills.add(fill);
        if (stroke && stroke !== 'none') strokes.add(stroke);
      });
      
      return {
        fills: Array.from(fills),
        strokes: Array.from(strokes)
      };
    });
    
    // 应该使用5种以上颜色
    const uniqueColors = new Set([...colors.fills, ...colors.strokes]);
    expect(uniqueColors.size).toBeGreaterThanOrEqual(5);
  });
  
  test('文字不重叠检查', async ({ page }) => {
    await page.goto('http://localhost:8000/ch30/index.html');
    await page.waitForTimeout(2000);
    
    const hasOverlap = await page.evaluate(() => {
      const svg = document.querySelector('svg');
      if (!svg) return false;
      
      const texts = Array.from(svg.querySelectorAll('text'));
      const positions = texts.map(t => {
        const bbox = t.getBBox();
        return {
          x: bbox.x,
          y: bbox.y,
          width: bbox.width,
          height: bbox.height
        };
      });
      
      // 检查任意两个文字是否重叠
      for (let i = 0; i < positions.length; i++) {
        for (let j = i + 1; j < positions.length; j++) {
          const a = positions[i];
          const b = positions[j];
          
          const xOverlap = a.x < b.x + b.width && a.x + a.width > b.x;
          const yOverlap = a.y < b.y + b.height && a.y + a.height > b.y;
          
          if (xOverlap && yOverlap) {
            // 检查是否间距 < 60px
            const dy = Math.abs((a.y + a.height/2) - (b.y + b.height/2));
            if (dy < 60) {
              return true;
            }
          }
        }
      }
      
      return false;
    });
    
    expect(hasOverlap).toBe(false);
  });
  
  test('无 JavaScript 错误', async ({ page }) => {
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto('http://localhost:8000/ch30/index.html');
    await page.waitForTimeout(5000);
    
    expect(errors.length).toBe(0);
  });
  
  test('动画流畅度 - 补间数量统计', async ({ page }) => {
    await page.goto('http://localhost:8000/ch30/index.html');
    await page.waitForTimeout(1000);
    
    // 统计 polar_sort 的补间
    const polarTweens = await page.evaluate(() => {
      const idx = window.BEATS.findIndex(b => b[0] === 'polar_sort');
      if (idx < 0) return 0;
      
      // 简单统计：执行 beat 函数并计数 tw() 调用
      let tweenCount = 0;
      const originalTw = window.tw;
      window.tw = function() {
        tweenCount++;
        return originalTw.apply(this, arguments);
      };
      
      // 清除并重新执行
      const svg = document.querySelector('svg');
      if (svg) svg.innerHTML = '';
      window.BEATS[idx][2](); // 执行函数
      
      window.tw = originalTw;
      return tweenCount;
    });
    
    expect(polarTweens).toBeGreaterThanOrEqual(20);
    
    // 统计 build_hull 的补间
    const hullTweens = await page.evaluate(() => {
      const idx = window.BEATS.findIndex(b => b[0] === 'build_hull');
      if (idx < 0) return 0;
      
      let tweenCount = 0;
      const originalTw = window.tw;
      window.tw = function() {
        tweenCount++;
        return originalTw.apply(this, arguments);
      };
      
      const svg = document.querySelector('svg');
      if (svg) svg.innerHTML = '';
      window.BEATS[idx][2]();
      
      window.tw = originalTw;
      return tweenCount;
    });
    
    expect(hullTweens).toBeGreaterThanOrEqual(30);
  });
});
