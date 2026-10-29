const { test, expect } = require('@playwright/test');

test.describe('Chapter 19: Union-Find', () => {
  test('页面加载和基本元素', async ({ page }) => {
    await page.goto('http://localhost:8000/ch19/index.html');
    
    // 检查标题
    await expect(page).toHaveTitle(/并查集/);
    
    // 等待引擎加载
    await page.waitForTimeout(2000);
    
    // 检查是否有 BEATS 数组
    const beatsCount = await page.evaluate(() => window.BEATS ? window.BEATS.length : 0);
    expect(beatsCount).toBeGreaterThanOrEqual(12);
    console.log(`✓ BEATS 数组包含 ${beatsCount} 个 beat`);
  });
  
  test('时间轴正常前进', async ({ page }) => {
    await page.goto('http://localhost:8000/ch19/index.html');
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
    await page.goto('http://localhost:8000/ch19/index.html');
    await page.waitForTimeout(1000);
    
    const beats = await page.evaluate(() => {
      return window.BEATS ? window.BEATS.map(b => b.id) : [];
    });
    
    const requiredBeats = ['intro', 'operations', 'naive', 'tree', 'path-compression', 
                           'union-by-rank', 'implementation', 'complexity', 'kruskal', 
                           'components', 'applications', 'variants', 'finish'];
    
    requiredBeats.forEach(beatId => {
      expect(beats).toContain(beatId);
    });
    
    console.log(`✓ 所有必需的 beat 都存在: ${beats.join(', ')}`);
  });
  
  test('path-compression beat 有足够的动画', async ({ page }) => {
    await page.goto('http://localhost:8000/ch19/index.html');
    await page.waitForTimeout(1000);
    
    const pathCompressionBeat = await page.evaluate(() => {
      if (!window.BEATS) return null;
      const beat = window.BEATS.find(b => b.id === 'path-compression');
      if (!beat || !beat.run) return null;
      
      // 执行 beat 函数并计数 tw 调用
      let twCount = 0;
      const originalTw = window.tw;
      window.tw = function() {
        twCount++;
        return originalTw.apply(this, arguments);
      };
      
      beat.run();
      
      window.tw = originalTw;
      return twCount;
    });
    
    expect(pathCompressionBeat).toBeGreaterThanOrEqual(20);
    console.log(`✓ path-compression beat 包含 ${pathCompressionBeat} 次动画调用`);
  });
  
  test('union-by-rank beat 有足够的动画', async ({ page }) => {
    await page.goto('http://localhost:8000/ch19/index.html');
    await page.waitForTimeout(1000);
    
    const unionByRankBeat = await page.evaluate(() => {
      if (!window.BEATS) return null;
      const beat = window.BEATS.find(b => b.id === 'union-by-rank');
      if (!beat || !beat.run) return null;
      
      // 执行 beat 函数并计数 tw 调用
      let twCount = 0;
      const originalTw = window.tw;
      window.tw = function() {
        twCount++;
        return originalTw.apply(this, arguments);
      };
      
      beat.run();
      
      window.tw = originalTw;
      return twCount;
    });
    
    expect(unionByRankBeat).toBeGreaterThanOrEqual(20);
    console.log(`✓ union-by-rank beat 包含 ${unionByRankBeat} 次动画调用`);
  });
  
  test('无 JavaScript 错误', async ({ page }) => {
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto('http://localhost:8000/ch19/index.html');
    await page.waitForTimeout(3000);
    
    if (errors.length > 0) {
      console.log('JavaScript 错误:', errors);
    }
    expect(errors.length).toBe(0);
    console.log('✓ 无 JavaScript 错误');
  });
  
  test('颜色方案定义正确', async ({ page }) => {
    await page.goto('http://localhost:8000/ch19/index.html');
    await page.waitForTimeout(1000);
    
    const colors = await page.evaluate(() => {
      return {
        ROOT_COLOR: window.ROOT_COLOR,
        NODE_COLOR: window.NODE_COLOR,
        HIGHLIGHT: window.HIGHLIGHT,
        SUCCESS: window.SUCCESS,
        TEXT_COLOR: window.TEXT_COLOR,
        RANK_COLOR: window.RANK_COLOR
      };
    });
    
    expect(colors.ROOT_COLOR).toBeTruthy();
    expect(colors.NODE_COLOR).toBeTruthy();
    expect(colors.HIGHLIGHT).toBeTruthy();
    expect(colors.SUCCESS).toBeTruthy();
    
    // 检查是否至少有4种不同的颜色
    const uniqueColors = new Set(Object.values(colors));
    expect(uniqueColors.size).toBeGreaterThanOrEqual(4);
    console.log(`✓ 定义了 ${uniqueColors.size} 种不同颜色`);
  });
  
  test('CHAPTER 元数据正确', async ({ page }) => {
    await page.goto('http://localhost:8000/ch19/index.html');
    await page.waitForTimeout(1000);
    
    const chapter = await page.evaluate(() => window.CHAPTER);
    
    expect(chapter.number).toBe(19);
    expect(chapter.title).toContain('并查集');
    expect(chapter.language).toBe('zh');
    expect(chapter.minutes).toBeGreaterThanOrEqual(8);
    expect(chapter.minutes).toBeLessThanOrEqual(12);
    console.log(`✓ 章节元数据: ${chapter.number}. ${chapter.title} (${chapter.minutes}分钟)`);
  });
  
  test('辅助函数定义完整', async ({ page }) => {
    await page.goto('http://localhost:8000/ch19/index.html');
    await page.waitForTimeout(1000);
    
    const functions = await page.evaluate(() => {
      return {
        drawNode: typeof window.drawNode === 'function',
        drawEdge: typeof window.drawEdge === 'function',
        drawArrow: typeof window.drawArrow === 'function',
        drawRankLabel: typeof window.drawRankLabel === 'function'
      };
    });
    
    expect(functions.drawNode).toBe(true);
    expect(functions.drawEdge).toBe(true);
    expect(functions.drawArrow).toBe(true);
    expect(functions.drawRankLabel).toBe(true);
    console.log('✓ 所有辅助函数已定义');
  });
  
  test('boot 函数执行成功', async ({ page }) => {
    await page.goto('http://localhost:8000/ch19/index.html');
    await page.waitForTimeout(1000);
    
    const bootExecuted = await page.evaluate(() => {
      return typeof window.panel === 'function' && window.P !== undefined;
    });
    
    expect(bootExecuted).toBe(true);
    console.log('✓ boot() 函数执行成功');
  });
  
  test('两个核心动画时长足够', async ({ page }) => {
    await page.goto('http://localhost:8000/ch19/index.html');
    await page.waitForTimeout(1000);
    
    const durations = await page.evaluate(() => {
      if (!window.TIMINGS) return null;
      return {
        pathCompression: window.TIMINGS['path-compression']?.dur || 0,
        unionByRank: window.TIMINGS['union-by-rank']?.dur || 0
      };
    });
    
    expect(durations.pathCompression).toBeGreaterThanOrEqual(10);
    expect(durations.unionByRank).toBeGreaterThanOrEqual(10);
    console.log(`✓ 路径压缩动画: ${durations.pathCompression}s, 按秩合并动画: ${durations.unionByRank}s`);
  });
});
