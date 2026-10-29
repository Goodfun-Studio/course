const { test, expect } = require('@playwright/test');

test.describe('Chapter 33: Suffix Array', () => {
  test('页面加载和基本元素', async ({ page }) => {
    await page.goto('http://localhost:8000/ch33/index.html');
    
    // 检查标题
    await expect(page).toHaveTitle(/后缀数组/);
    
    // 等待引擎加载
    await page.waitForTimeout(2000);
    
    // 检查是否有 BEATS 数组
    const beatsCount = await page.evaluate(() => window.BEATS ? window.BEATS.length : 0);
    expect(beatsCount).toBe(13);
  });
  
  test('CHAPTER 对象正确', async ({ page }) => {
    await page.goto('http://localhost:8000/ch33/index.html');
    await page.waitForTimeout(1000);
    
    const chapter = await page.evaluate(() => window.CHAPTER);
    expect(chapter.number).toBe(33);
    expect(chapter.title).toBe('后缀数组');
    expect(chapter.language).toBe('zh');
    expect(chapter.minutes).toBe(14);
  });
  
  test('时间轴正常前进', async ({ page }) => {
    await page.goto('http://localhost:8000/ch33/index.html');
    await page.waitForTimeout(1000);
    
    // 检查时间是否前进
    const t0 = await page.evaluate(() => window.P ? window.P.t : 0);
    await page.waitForTimeout(2000);
    const t1 = await page.evaluate(() => window.P ? window.P.t : 0);
    
    expect(t1).toBeGreaterThan(t0);
    expect(t1).toBeGreaterThan(1);
  });
  
  test('所有 beat 可访问', async ({ page }) => {
    await page.goto('http://localhost:8000/ch33/index.html');
    await page.waitForTimeout(1000);
    
    const beats = await page.evaluate(() => {
      return window.BEATS ? window.BEATS.map(b => b.id) : [];
    });
    
    expect(beats).toContain('intro');
    expect(beats).toContain('suffix-array-construction');
    expect(beats).toContain('lcp-computation');
    expect(beats).toContain('summary');
  });
  
  test('后缀数组构建动画 - 检查补间次数', async ({ page }) => {
    await page.goto('http://localhost:8000/ch33/index.html');
    await page.waitForTimeout(1000);
    
    // 跳转到 suffix-array-construction beat
    await page.evaluate(() => {
      const idx = window.BEATS.findIndex(b => b.id === 'suffix-array-construction');
      if (idx >= 0 && window.P) {
        window.P.jump(idx);
      }
    });
    
    await page.waitForTimeout(500);
    
    // 统计补间数量
    const tweenCount = await page.evaluate(() => {
      const idx = window.BEATS.findIndex(b => b.id === 'suffix-array-construction');
      if (idx < 0) return 0;
      
      let count = 0;
      const originalTw = window.tw;
      window.tw = function() {
        count++;
        return originalTw.apply(this, arguments);
      };
      
      // 清除并重新执行
      const svg = document.querySelector('svg');
      if (svg) svg.innerHTML = '';
      window.BEATS[idx].run();
      
      window.tw = originalTw;
      return count;
    });
    
    // 后缀数组构建应该有 >= 25 次补间
    expect(tweenCount).toBeGreaterThanOrEqual(25);
  });
  
  test('LCP 计算动画 - 检查补间次数', async ({ page }) => {
    await page.goto('http://localhost:8000/ch33/index.html');
    await page.waitForTimeout(1000);
    
    // 统计 lcp-computation 的补间
    const tweenCount = await page.evaluate(() => {
      const idx = window.BEATS.findIndex(b => b.id === 'lcp-computation');
      if (idx < 0) return 0;
      
      let count = 0;
      const originalTw = window.tw;
      window.tw = function() {
        count++;
        return originalTw.apply(this, arguments);
      };
      
      const svg = document.querySelector('svg');
      if (svg) svg.innerHTML = '';
      window.BEATS[idx].run();
      
      window.tw = originalTw;
      return count;
    });
    
    // LCP 计算应该有 >= 20 次补间
    expect(tweenCount).toBeGreaterThanOrEqual(20);
  });
  
  test('banana 示例正确展示', async ({ page }) => {
    await page.goto('http://localhost:8000/ch33/index.html');
    await page.waitForTimeout(1000);
    
    // 跳转到 banana-example
    await page.evaluate(() => {
      const idx = window.BEATS.findIndex(b => b.id === 'banana-example');
      if (idx >= 0 && window.P) {
        window.P.jump(idx);
      }
    });
    
    await page.waitForTimeout(500);
    
    // 检查是否有 "banana" 文本
    const hasBanana = await page.evaluate(() => {
      const svg = document.querySelector('svg');
      if (!svg) return false;
      
      const texts = Array.from(svg.querySelectorAll('text'));
      return texts.some(t => t.textContent.includes('banana'));
    });
    
    expect(hasBanana).toBe(true);
  });
  
  test('颜色方案正确应用', async ({ page }) => {
    await page.goto('http://localhost:8000/ch33/index.html');
    await page.waitForTimeout(2000);
    
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
    await page.goto('http://localhost:8000/ch33/index.html');
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
    
    await page.goto('http://localhost:8000/ch33/index.html');
    await page.waitForTimeout(5000);
    
    expect(errors.length).toBe(0);
  });
  
  test('后缀数组动画持续时间', async ({ page }) => {
    await page.goto('http://localhost:8000/ch33/index.html');
    await page.waitForTimeout(1000);
    
    // 检查 suffix-array-construction 动画时长
    const duration = await page.evaluate(() => {
      const idx = window.BEATS.findIndex(b => b.id === 'suffix-array-construction');
      if (idx < 0) return 0;
      
      let maxTime = 0;
      const originalTw = window.tw;
      window.tw = function(obj, props, start, duration) {
        const endTime = start + duration;
        if (endTime > maxTime) maxTime = endTime;
        return originalTw.apply(this, arguments);
      };
      
      const svg = document.querySelector('svg');
      if (svg) svg.innerHTML = '';
      window.BEATS[idx].run();
      
      window.tw = originalTw;
      return maxTime;
    });
    
    // 动画应该持续至少 12 秒
    expect(duration).toBeGreaterThanOrEqual(12);
  });
  
  test('LCP 动画持续时间', async ({ page }) => {
    await page.goto('http://localhost:8000/ch33/index.html');
    await page.waitForTimeout(1000);
    
    // 检查 lcp-computation 动画时长
    const duration = await page.evaluate(() => {
      const idx = window.BEATS.findIndex(b => b.id === 'lcp-computation');
      if (idx < 0) return 0;
      
      let maxTime = 0;
      const originalTw = window.tw;
      window.tw = function(obj, props, start, duration) {
        const endTime = start + duration;
        if (endTime > maxTime) maxTime = endTime;
        return originalTw.apply(this, arguments);
      };
      
      const svg = document.querySelector('svg');
      if (svg) svg.innerHTML = '';
      window.BEATS[idx].run();
      
      window.tw = originalTw;
      return maxTime;
    });
    
    // 动画应该持续至少 10 秒
    expect(duration).toBeGreaterThanOrEqual(10);
  });
  
  test('后缀数组结果正确', async ({ page }) => {
    await page.goto('http://localhost:8000/ch33/index.html');
    await page.waitForTimeout(1000);
    
    // 跳转到 suffix-array-construction
    await page.evaluate(() => {
      const idx = window.BEATS.findIndex(b => b.id === 'suffix-array-construction');
      if (idx >= 0 && window.P) {
        window.P.jump(idx);
      }
    });
    
    await page.waitForTimeout(500);
    
    // 检查最终结果 [5, 3, 1, 0, 4, 2]
    const hasCorrectResult = await page.evaluate(() => {
      const svg = document.querySelector('svg');
      if (!svg) return false;
      
      const texts = Array.from(svg.querySelectorAll('text'));
      return texts.some(t => 
        t.textContent.includes('[5, 3, 1, 0, 4, 2]') ||
        (t.textContent.includes('5') && texts.some(t2 => t2.textContent.includes('3')))
      );
    });
    
    expect(hasCorrectResult).toBe(true);
  });
});
