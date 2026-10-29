const { test, expect } = require('@playwright/test');

test.describe('Chapter 17: KMP String Matching', () => {
  test('页面加载和基本元素', async ({ page }) => {
    await page.goto('http://localhost:8000/ch17/index.html');
    
    // 检查标题
    await expect(page).toHaveTitle(/KMP/);
    
    // 等待引擎加载
    await page.waitForTimeout(2000);
    
    // 检查是否有 BEATS 数组
    const beatsCount = await page.evaluate(() => window.BEATS ? window.BEATS.length : 0);
    expect(beatsCount).toBeGreaterThanOrEqual(12);
    console.log(`✓ BEATS 数组包含 ${beatsCount} 个 beat`);
  });
  
  test('时间轴正常前进', async ({ page }) => {
    await page.goto('http://localhost:8000/ch17/index.html');
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
    await page.goto('http://localhost:8000/ch17/index.html');
    await page.waitForTimeout(1000);
    
    const beats = await page.evaluate(() => {
      return window.BEATS ? window.BEATS.map(b => b[0]) : [];
    });
    
    const requiredBeats = ['intro', 'naive', 'kmp-idea', 'next-intro', 'next-build', 
                           'matching-intro', 'matching-demo', 'code', 'complexity', 'finish'];
    
    requiredBeats.forEach(beatId => {
      expect(beats).toContain(beatId);
    });
    
    console.log(`✓ 所有必需的 beat 都存在: ${beats.join(', ')}`);
  });
  
  test('next-build beat 有足够的动画', async ({ page }) => {
    await page.goto('http://localhost:8000/ch17/index.html');
    await page.waitForTimeout(1000);
    
    const nextBuildBeat = await page.evaluate(() => {
      if (!window.BEATS) return null;
      const beat = window.BEATS.find(b => b[0] === 'next-build');
      if (!beat || !beat[2]) return null;
      
      // 执行 beat 函数并计数 tw 调用
      let twCount = 0;
      const originalTw = window.tw;
      window.tw = function() {
        twCount++;
        return originalTw.apply(this, arguments);
      };
      
      beat[2]();
      
      window.tw = originalTw;
      return twCount;
    });
    
    expect(nextBuildBeat).toBeGreaterThanOrEqual(30);
    console.log(`✓ next-build beat 包含 ${nextBuildBeat} 次动画调用`);
  });
  
  test('matching-demo beat 有足够的动画', async ({ page }) => {
    await page.goto('http://localhost:8000/ch17/index.html');
    await page.waitForTimeout(1000);
    
    const matchingDemoBeat = await page.evaluate(() => {
      if (!window.BEATS) return null;
      const beat = window.BEATS.find(b => b[0] === 'matching-demo');
      if (!beat || !beat[2]) return null;
      
      // 执行 beat 函数并计数 tw 调用
      let twCount = 0;
      const originalTw = window.tw;
      window.tw = function() {
        twCount++;
        return originalTw.apply(this, arguments);
      };
      
      beat[2]();
      
      window.tw = originalTw;
      return twCount;
    });
    
    expect(matchingDemoBeat).toBeGreaterThanOrEqual(30);
    console.log(`✓ matching-demo beat 包含 ${matchingDemoBeat} 次动画调用`);
  });
  
  test('无 JavaScript 错误', async ({ page }) => {
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto('http://localhost:8000/ch17/index.html');
    await page.waitForTimeout(3000);
    
    if (errors.length > 0) {
      console.log('JavaScript 错误:', errors);
    }
    expect(errors.length).toBe(0);
    console.log('✓ 无 JavaScript 错误');
  });
  
  test('颜色方案定义正确', async ({ page }) => {
    await page.goto('http://localhost:8000/ch17/index.html');
    await page.waitForTimeout(1000);
    
    const colors = await page.evaluate(() => {
      return {
        MATCH_COLOR: window.MATCH_COLOR,
        MISMATCH_COLOR: window.MISMATCH_COLOR,
        CURRENT_COLOR: window.CURRENT_COLOR,
        PATTERN_COLOR: window.PATTERN_COLOR,
        TEXT_COLOR: window.TEXT_COLOR,
        NEXT_BG: window.NEXT_BG
      };
    });
    
    expect(colors.MATCH_COLOR).toBeTruthy();
    expect(colors.MISMATCH_COLOR).toBeTruthy();
    expect(colors.PATTERN_COLOR).toBeTruthy();
    expect(colors.NEXT_BG).toBeTruthy();
    
    // 检查是否至少有5种不同的颜色
    const uniqueColors = new Set(Object.values(colors));
    expect(uniqueColors.size).toBeGreaterThanOrEqual(5);
    console.log(`✓ 定义了 ${uniqueColors.size} 种不同颜色`);
  });
  
  test('CHAPTER 元数据正确', async ({ page }) => {
    await page.goto('http://localhost:8000/ch17/index.html');
    await page.waitForTimeout(1000);
    
    const chapter = await page.evaluate(() => window.CHAPTER);
    
    expect(chapter.number).toBe(17);
    expect(chapter.title).toContain('KMP');
    expect(chapter.language).toBe('zh');
    expect(chapter.minutes).toBeGreaterThanOrEqual(12);
    expect(chapter.minutes).toBeLessThanOrEqual(15);
    console.log(`✓ 章节元数据: ${chapter.number}. ${chapter.title} (${chapter.minutes}分钟)`);
  });
  
  test('辅助函数定义完整', async ({ page }) => {
    await page.goto('http://localhost:8000/ch17/index.html');
    await page.waitForTimeout(1000);
    
    const functions = await page.evaluate(() => {
      return {
        drawChar: typeof window.drawChar === 'function',
        drawPointer: typeof window.drawPointer === 'function',
        drawNextArray: typeof window.drawNextArray === 'function'
      };
    });
    
    expect(functions.drawChar).toBe(true);
    expect(functions.drawPointer).toBe(true);
    expect(functions.drawNextArray).toBe(true);
    console.log('✓ 所有辅助函数已定义');
  });
  
  test('boot 函数执行成功', async ({ page }) => {
    await page.goto('http://localhost:8000/ch17/index.html');
    await page.waitForTimeout(1000);
    
    const bootExecuted = await page.evaluate(() => {
      return typeof window.panel === 'function' && window.P !== undefined;
    });
    
    expect(bootExecuted).toBe(true);
    console.log('✓ boot() 函数执行成功');
  });
});
