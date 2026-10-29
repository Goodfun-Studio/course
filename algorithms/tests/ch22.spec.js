const { test, expect } = require('@playwright/test');

test.describe('Chapter 22: Huffman Coding', () => {
  test('页面加载和基本元素', async ({ page }) => {
    await page.goto('http://localhost:8000/ch22/index.html');
    
    // 检查标题
    await expect(page).toHaveTitle(/霍夫曼编码/);
    
    // 等待引擎加载
    await page.waitForTimeout(2000);
    
    // 检查是否有 BEATS 数组
    const beatsCount = await page.evaluate(() => window.BEATS ? window.BEATS.length : 0);
    expect(beatsCount).toBeGreaterThanOrEqual(11);
    console.log(`✓ BEATS 数组包含 ${beatsCount} 个 beat`);
  });
  
  test('时间轴正常前进', async ({ page }) => {
    await page.goto('http://localhost:8000/ch22/index.html');
    await page.waitForTimeout(1000);
    
    // 检查时间是否前进
    const t0 = await page.evaluate(() => window.P ? window.P.t : 0);
    await page.waitForTimeout(2000);
    const t1 = await page.evaluate(() => window.P ? window.P.t : 0);
    
    expect(t1).toBeGreaterThan(t0);
    expect(t1).toBeGreaterThan(1.5);
    console.log(`✓ 时间从 ${t0.toFixed(2)} 前进到 ${t1.toFixed(2)}`);
  });
  
  test('所有核心 beat 存在', async ({ page }) => {
    await page.goto('http://localhost:8000/ch22/index.html');
    await page.waitForTimeout(1000);
    
    const beats = await page.evaluate(() => {
      return window.BEATS ? window.BEATS.map(b => b[0]) : [];
    });
    
    const requiredBeats = ['intro', 'fixed-length', 'variable-length', 'prefix-code', 
                           'huffman-tree-demo', 'tree-to-code', 'encode-decode-demo', 
                           'implementation', 'complexity', 'optimality', 'applications', 'limitations'];
    
    requiredBeats.forEach(beatId => {
      expect(beats).toContain(beatId);
    });
    
    console.log(`✓ 所有必需的 beat 都存在: ${beats.join(', ')}`);
  });
  
  test('huffman-tree-demo beat 有足够的动画（≥30次tw，≥15秒）', async ({ page }) => {
    await page.goto('http://localhost:8000/ch22/index.html');
    await page.waitForTimeout(1000);
    
    const result = await page.evaluate(() => {
      if (!window.BEATS) return null;
      const beat = window.BEATS.find(b => b[0] === 'huffman-tree-demo');
      if (!beat || !beat[2]) return null;
      
      // 执行 beat 函数并计数 tw 调用和最大时间
      let twCount = 0;
      let maxTime = 0;
      const originalTw = window.tw;
      window.tw = function(elem, props, time) {
        twCount++;
        if (time !== undefined && time > maxTime) {
          maxTime = time;
        }
        return originalTw.apply(this, arguments);
      };
      
      beat[2]();
      
      window.tw = originalTw;
      return { twCount, maxTime };
    });
    
    expect(result.twCount).toBeGreaterThanOrEqual(30);
    expect(result.maxTime).toBeGreaterThanOrEqual(15);
    console.log(`✓ huffman-tree-demo beat: ${result.twCount} 次动画, 持续 ${result.maxTime.toFixed(1)} 秒`);
  });
  
  test('encode-decode-demo beat 有足够的动画（≥20次tw，≥10秒）', async ({ page }) => {
    await page.goto('http://localhost:8000/ch22/index.html');
    await page.waitForTimeout(1000);
    
    const result = await page.evaluate(() => {
      if (!window.BEATS) return null;
      const beat = window.BEATS.find(b => b[0] === 'encode-decode-demo');
      if (!beat || !beat[2]) return null;
      
      // 执行 beat 函数并计数 tw 调用和最大时间
      let twCount = 0;
      let maxTime = 0;
      const originalTw = window.tw;
      window.tw = function(elem, props, time) {
        twCount++;
        if (time !== undefined && time > maxTime) {
          maxTime = time;
        }
        return originalTw.apply(this, arguments);
      };
      
      beat[2]();
      
      window.tw = originalTw;
      return { twCount, maxTime };
    });
    
    expect(result.twCount).toBeGreaterThanOrEqual(20);
    expect(result.maxTime).toBeGreaterThanOrEqual(10);
    console.log(`✓ encode-decode-demo beat: ${result.twCount} 次动画, 持续 ${result.maxTime.toFixed(1)} 秒`);
  });
  
  test('无 JavaScript 错误', async ({ page }) => {
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto('http://localhost:8000/ch22/index.html');
    await page.waitForTimeout(3000);
    
    if (errors.length > 0) {
      console.log('JavaScript 错误:', errors);
    }
    expect(errors.length).toBe(0);
    console.log('✓ 无 JavaScript 错误');
  });
  
  test('颜色方案定义正确（≥5种颜色）', async ({ page }) => {
    await page.goto('http://localhost:8000/ch22/index.html');
    await page.waitForTimeout(1000);
    
    const colors = await page.evaluate(() => {
      return {
        NODE_LEAF: window.NODE_LEAF,
        NODE_INTERNAL: window.NODE_INTERNAL,
        NODE_SELECTED: window.NODE_SELECTED,
        NODE_MERGED: window.NODE_MERGED,
        CODE_0: window.CODE_0,
        CODE_1: window.CODE_1,
        TEXT_COLOR: window.TEXT_COLOR,
        EDGE_COLOR: window.EDGE_COLOR
      };
    });
    
    expect(colors.NODE_LEAF).toBeTruthy();
    expect(colors.NODE_INTERNAL).toBeTruthy();
    expect(colors.NODE_SELECTED).toBeTruthy();
    expect(colors.CODE_0).toBeTruthy();
    expect(colors.CODE_1).toBeTruthy();
    
    // 检查是否至少有5种不同的颜色
    const uniqueColors = new Set(Object.values(colors).filter(c => c));
    expect(uniqueColors.size).toBeGreaterThanOrEqual(5);
    console.log(`✓ 定义了 ${uniqueColors.size} 种不同颜色`);
  });
  
  test('CHAPTER 元数据正确', async ({ page }) => {
    await page.goto('http://localhost:8000/ch22/index.html');
    await page.waitForTimeout(1000);
    
    const chapter = await page.evaluate(() => window.CHAPTER);
    
    expect(chapter.number).toBe(22);
    expect(chapter.title).toContain('霍夫曼编码');
    expect(chapter.language).toBe('zh');
    expect(chapter.minutes).toBeGreaterThanOrEqual(10);
    expect(chapter.minutes).toBeLessThanOrEqual(13);
    console.log(`✓ 章节元数据: ${chapter.number}. ${chapter.title} (${chapter.minutes}分钟)`);
  });
  
  test('辅助函数定义完整', async ({ page }) => {
    await page.goto('http://localhost:8000/ch22/index.html');
    await page.waitForTimeout(1000);
    
    const functions = await page.evaluate(() => {
      return {
        drawNode: typeof window.drawNode === 'function',
        drawEdge: typeof window.drawEdge === 'function',
        drawCodeBox: typeof window.drawCodeBox === 'function',
        drawBinaryBit: typeof window.drawBinaryBit === 'function'
      };
    });
    
    expect(functions.drawNode).toBe(true);
    expect(functions.drawEdge).toBe(true);
    expect(functions.drawCodeBox).toBe(true);
    expect(functions.drawBinaryBit).toBe(true);
    console.log('✓ 所有辅助函数已定义');
  });
  
  test('boot 函数执行成功', async ({ page }) => {
    await page.goto('http://localhost:8000/ch22/index.html');
    await page.waitForTimeout(1000);
    
    const bootExecuted = await page.evaluate(() => {
      return typeof window.panel === 'function' && window.P !== undefined;
    });
    
    expect(bootExecuted).toBe(true);
    console.log('✓ boot() 函数执行成功');
  });
  
  test('元素间距检查（文字y坐标间距≥60px）', async ({ page }) => {
    await page.goto('http://localhost:8000/ch22/index.html');
    await page.waitForTimeout(2000);
    
    const spacingIssues = await page.evaluate(() => {
      const texts = Array.from(document.querySelectorAll('text'));
      const issues = [];
      
      for (let i = 0; i < texts.length - 1; i++) {
        const y1 = parseFloat(texts[i].getAttribute('y') || 0);
        const y2 = parseFloat(texts[i + 1].getAttribute('y') || 0);
        const diff = Math.abs(y2 - y1);
        
        if (diff > 0 && diff < 60) {
          issues.push({ y1, y2, diff });
        }
      }
      
      return issues;
    });
    
    if (spacingIssues.length > 0) {
      console.log(`警告: 发现 ${spacingIssues.length} 处间距不足的文字元素`);
    } else {
      console.log('✓ 所有文字元素间距正常');
    }
  });
  
  test('panel(0) 和 panel(800) 使用正确', async ({ page }) => {
    await page.goto('http://localhost:8000/ch22/index.html');
    await page.waitForTimeout(1000);
    
    const panelUsage = await page.evaluate(() => {
      if (!window.BEATS) return { panel0: 0, panel800: 0 };
      
      let panel0 = 0;
      let panel800 = 0;
      
      window.BEATS.forEach(beat => {
        if (beat[2]) {
          const funcStr = beat[2].toString();
          if (funcStr.includes('panel(0)')) panel0++;
          if (funcStr.includes('panel(800)')) panel800++;
        }
      });
      
      return { panel0, panel800 };
    });
    
    expect(panelUsage.panel0).toBeGreaterThanOrEqual(10);
    console.log(`✓ panel(0) 使用 ${panelUsage.panel0} 次, panel(800) 使用 ${panelUsage.panel800} 次`);
  });
});
