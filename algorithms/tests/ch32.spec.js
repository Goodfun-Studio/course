const { test, expect } = require('@playwright/test');

test.describe('Chapter 32: Sieve of Eratosthenes', () => {
  test('页面加载和基本元素', async ({ page }) => {
    await page.goto('http://localhost:8000/ch32/index.html');
    
    // 检查标题
    await expect(page).toHaveTitle(/素数筛法/);
    
    // 等待引擎加载
    await page.waitForTimeout(2000);
    
    // 检查是否有 BEATS 数组
    const beatsCount = await page.evaluate(() => window.BEATS ? window.BEATS.length : 0);
    expect(beatsCount).toBe(12);
  });
  
  test('时间轴正常前进', async ({ page }) => {
    await page.goto('http://localhost:8000/ch32/index.html');
    await page.waitForTimeout(1000);
    
    // 检查时间是否前进
    const t0 = await page.evaluate(() => window.P ? window.P.t : 0);
    await page.waitForTimeout(2000);
    const t1 = await page.evaluate(() => window.P ? window.P.t : 0);
    
    expect(t1).toBeGreaterThan(t0);
    expect(t1).toBeGreaterThan(1);
  });
  
  test('所有 beat 可访问', async ({ page }) => {
    await page.goto('http://localhost:8000/ch32/index.html');
    await page.waitForTimeout(1000);
    
    const beats = await page.evaluate(() => {
      return window.BEATS ? window.BEATS.map(b => b[0]) : [];
    });
    
    expect(beats).toContain('intro');
    expect(beats).toContain('sieve-animation');
    expect(beats).toContain('code-impl');
    expect(beats).toContain('summary');
  });
  
  test('素数筛动画 - 检查网格和数字', async ({ page }) => {
    await page.goto('http://localhost:8000/ch32/index.html');
    await page.waitForTimeout(1000);
    
    // 跳转到 sieve-animation beat
    await page.evaluate(() => {
      const idx = window.BEATS.findIndex(b => b[0] === 'sieve-animation');
      if (idx >= 0 && window.P) {
        window.P.jump(idx);
      }
    });
    
    await page.waitForTimeout(500);
    
    // 检查是否有49个数字（2-50）
    const rectCount = await page.evaluate(() => {
      const svg = document.querySelector('svg');
      if (!svg) return 0;
      return svg.querySelectorAll('rect').length;
    });
    
    expect(rectCount).toBeGreaterThanOrEqual(49);
    
    // 检查数字文本
    const hasNumbers = await page.evaluate(() => {
      const svg = document.querySelector('svg');
      if (!svg) return false;
      
      const texts = Array.from(svg.querySelectorAll('text'));
      return texts.some(t => /^\d+$/.test(t.textContent));
    });
    
    expect(hasNumbers).toBe(true);
  });
  
  test('素数筛动画 - 检查补间次数', async ({ page }) => {
    await page.goto('http://localhost:8000/ch32/index.html');
    await page.waitForTimeout(1000);
    
    // 统计 sieve-animation 的补间
    const tweenCount = await page.evaluate(() => {
      const idx = window.BEATS.findIndex(b => b[0] === 'sieve-animation');
      if (idx < 0) return 0;
      
      let count = 0;
      const originalTw = window.tw;
      window.tw = function() {
        count++;
        return originalTw.apply(this, arguments);
      };
      
      // 清除并重新执行
      const svg = document.querySelector('svg[data-panel="0"]');
      if (svg) svg.innerHTML = '';
      window.BEATS[idx][2](); // 执行函数
      
      window.tw = originalTw;
      return count;
    });
    
    // 核心动画应该有≥25次补间
    expect(tweenCount).toBeGreaterThanOrEqual(25);
  });
  
  test('素数筛动画 - 检查动画时长', async ({ page }) => {
    await page.goto('http://localhost:8000/ch32/index.html');
    await page.waitForTimeout(1000);
    
    // 获取 sieve-animation 的最大时间戳
    const maxTime = await page.evaluate(() => {
      const idx = window.BEATS.findIndex(b => b[0] === 'sieve-animation');
      if (idx < 0) return 0;
      
      let max = 0;
      const originalTw = window.tw;
      window.tw = function(target, props, time, duration) {
        const endTime = time + (duration || 0);
        if (endTime > max) max = endTime;
        return originalTw.apply(this, arguments);
      };
      
      const svg = document.querySelector('svg[data-panel="0"]');
      if (svg) svg.innerHTML = '';
      window.BEATS[idx][2]();
      
      window.tw = originalTw;
      return max;
    });
    
    // 应该≥12秒
    expect(maxTime).toBeGreaterThanOrEqual(12);
  });
  
  test('代码实现 - 检查代码块', async ({ page }) => {
    await page.goto('http://localhost:8000/ch32/index.html');
    await page.waitForTimeout(1000);
    
    // 跳转到 code-impl beat
    await page.evaluate(() => {
      const idx = window.BEATS.findIndex(b => b[0] === 'code-impl');
      if (idx >= 0 && window.P) {
        window.P.jump(idx);
      }
    });
    
    await page.waitForTimeout(500);
    
    // 检查是否有等宽字体的代码
    const hasCode = await page.evaluate(() => {
      const svg = document.querySelector('svg');
      if (!svg) return false;
      
      const texts = Array.from(svg.querySelectorAll('text'));
      return texts.some(t => {
        const family = t.getAttribute('font-family');
        return family && family.includes('monospace');
      });
    });
    
    expect(hasCode).toBe(true);
    
    // 检查是否有关键词
    const hasKeywords = await page.evaluate(() => {
      const svg = document.querySelector('svg');
      if (!svg) return false;
      
      const texts = Array.from(svg.querySelectorAll('text'));
      const content = texts.map(t => t.textContent).join(' ');
      return content.includes('def') && content.includes('is_prime');
    });
    
    expect(hasKeywords).toBe(true);
  });
  
  test('颜色方案 - 检查多样性', async ({ page }) => {
    await page.goto('http://localhost:8000/ch32/index.html');
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
    
    // 应该使用4种以上颜色（素数绿、合数灰、当前橙、标记红）
    const uniqueColors = new Set([...colors.fills, ...colors.strokes]);
    expect(uniqueColors.size).toBeGreaterThanOrEqual(4);
  });
  
  test('文字间距检查', async ({ page }) => {
    await page.goto('http://localhost:8000/ch32/index.html');
    await page.waitForTimeout(2000);
    
    const hasGoodSpacing = await page.evaluate(() => {
      const svg = document.querySelector('svg');
      if (!svg) return true;
      
      const texts = Array.from(svg.querySelectorAll('text'));
      const positions = texts.map(t => {
        const y = parseFloat(t.getAttribute('y')) || 0;
        return y;
      }).filter(y => y > 0).sort((a, b) => a - b);
      
      // 检查相邻文字间距
      for (let i = 1; i < positions.length; i++) {
        const spacing = positions[i] - positions[i-1];
        if (spacing > 0 && spacing < 60) {
          return false;
        }
      }
      
      return true;
    });
    
    expect(hasGoodSpacing).toBe(true);
  });
  
  test('Panel 函数签名检查', async ({ page }) => {
    await page.goto('http://localhost:8000/ch32/index.html');
    await page.waitForTimeout(1000);
    
    // 检查是否使用 panel(0)
    const usesPanel0 = await page.evaluate(() => {
      // 检查源代码中是否所有 beat 都用 panel(0)
      return window.BEATS.every(beat => {
        const funcStr = beat[2].toString();
        return funcStr.includes('panel(0)');
      });
    });
    
    expect(usesPanel0).toBe(true);
  });
  
  test('无 JavaScript 错误', async ({ page }) => {
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto('http://localhost:8000/ch32/index.html');
    await page.waitForTimeout(5000);
    
    expect(errors.length).toBe(0);
  });
  
  test('所有 beat 可以渲染', async ({ page }) => {
    await page.goto('http://localhost:8000/ch32/index.html');
    await page.waitForTimeout(1000);
    
    const beatCount = await page.evaluate(() => window.BEATS.length);
    
    for (let i = 0; i < beatCount; i++) {
      await page.evaluate((idx) => {
        if (window.P) window.P.jump(idx);
      }, i);
      
      await page.waitForTimeout(300);
      
      // 检查是否有内容
      const hasContent = await page.evaluate(() => {
        const svg = document.querySelector('svg');
        return svg && svg.children.length > 0;
      });
      
      expect(hasContent).toBe(true);
    }
  });
});
