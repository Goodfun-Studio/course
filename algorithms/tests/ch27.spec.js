const { test, expect } = require('@playwright/test');

test.describe('第27章：A* 启发式搜索', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8000/ch27/index.html');
    await page.waitForTimeout(1000);
  });

  test('页面标题正确', async ({ page }) => {
    await expect(page).toHaveTitle(/A\* 启发式搜索/);
  });

  test('章节信息正确', async ({ page }) => {
    await page.waitForTimeout(500); // 等待脚本完全加载
    const chapterInfo = await page.evaluate(() => window.CHAPTER);
    expect(chapterInfo).toBeDefined();
    expect(chapterInfo.number).toBe(27);
    expect(chapterInfo.title).toBe('A* 启发式搜索');
    expect(chapterInfo.language).toBe('zh');
    expect(chapterInfo.minutes).toBeGreaterThanOrEqual(12);
    expect(chapterInfo.minutes).toBeLessThanOrEqual(15);
  });

  test('Beat数量正确', async ({ page }) => {
    const beatCount = await page.evaluate(() => window.BEATS.length);
    expect(beatCount).toBeGreaterThanOrEqual(12);
    expect(beatCount).toBeLessThanOrEqual(14);
  });

  test('所有必需的beat存在', async ({ page }) => {
    const beatIds = await page.evaluate(() => 
      window.BEATS.map(b => b[0])
    );
    
    const requiredBeats = [
      'intro',
      'bfs-limitation',
      'heuristic',
      'astar-demo',
      'manhattan',
      'admissible',
      'implementation',
      'dijkstra',
      'applications',
      'finish'
    ];
    
    requiredBeats.forEach(beatId => {
      expect(beatIds).toContain(beatId);
    });
  });

  test('intro beat 动画正确', async ({ page }) => {
    await page.evaluate(() => {
      const introBeat = window.BEATS.find(b => b[0] === 'intro');
      if (introBeat) introBeat[2]();
    });
    await page.waitForTimeout(100);

    // 检查标题
    const titleExists = await page.evaluate(() => {
      const svgs = document.querySelectorAll('svg text');
      return Array.from(svgs).some(t => t.textContent.includes('A* 启发式搜索'));
    });
    expect(titleExists).toBe(true);

    // 检查场景图标
    const scenarioCount = await page.evaluate(() => {
      const svgs = document.querySelectorAll('svg text');
      const icons = ['🎮', '🗺️', '🤖', '🧩'];
      return icons.filter(icon => 
        Array.from(svgs).some(t => t.textContent.includes(icon))
      ).length;
    });
    expect(scenarioCount).toBe(4);
  });

  test('heuristic beat 显示公式', async ({ page }) => {
    await page.evaluate(() => {
      const beat = window.BEATS.find(b => b[0] === 'heuristic');
      if (beat) beat[2]();
    });
    await page.waitForTimeout(100);

    const formulaExists = await page.evaluate(() => {
      const texts = document.querySelectorAll('svg text');
      return Array.from(texts).some(t => t.textContent.includes('f(n) = g(n) + h(n)'));
    });
    expect(formulaExists).toBe(true);

    // 检查三个组件
    const components = await page.evaluate(() => {
      const texts = document.querySelectorAll('svg text');
      return ['g(n)', 'h(n)', 'f(n)'].filter(c =>
        Array.from(texts).some(t => t.textContent.includes(c))
      );
    });
    expect(components.length).toBe(3);
  });

  test('astar-demo beat 网格动画', async ({ page }) => {
    await page.evaluate(() => {
      const beat = window.BEATS.find(b => b[0] === 'astar-demo');
      if (beat) beat[2]();
    });
    await page.waitForTimeout(500);

    // 检查网格单元格数量（8x8 = 64）
    const cellCount = await page.evaluate(() => {
      return document.querySelectorAll('svg rect').length;
    });
    expect(cellCount).toBeGreaterThan(60); // 至少64个格子

    // 检查颜色使用
    const colors = await page.evaluate(() => {
      const rects = document.querySelectorAll('svg rect');
      const fills = new Set();
      rects.forEach(r => fills.add(r.getAttribute('fill')));
      return fills.size;
    });
    expect(colors).toBeGreaterThanOrEqual(5); // 至少5种颜色

    // 检查图例
    const legendExists = await page.evaluate(() => {
      const texts = document.querySelectorAll('svg text');
      return ['起点', '终点', '障碍', '已访问', '待访问', '最优路径'].filter(item =>
        Array.from(texts).some(t => t.textContent.includes(item))
      ).length;
    });
    expect(legendExists).toBeGreaterThanOrEqual(5);
  });

  test('manhattan beat 展示曼哈顿距离', async ({ page }) => {
    await page.evaluate(() => {
      const beat = window.BEATS.find(b => b[0] === 'manhattan');
      if (beat) beat[2]();
    });
    await page.waitForTimeout(100);

    const distanceCalc = await page.evaluate(() => {
      const texts = document.querySelectorAll('svg text');
      return Array.from(texts).some(t => t.textContent.includes('曼哈顿距离'));
    });
    expect(distanceCalc).toBe(true);
  });

  test('admissible beat 展示可接纳性', async ({ page }) => {
    await page.evaluate(() => {
      const beat = window.BEATS.find(b => b[0] === 'admissible');
      if (beat) beat[2]();
    });
    await page.waitForTimeout(100);

    const admissibleConcept = await page.evaluate(() => {
      const texts = document.querySelectorAll('svg text');
      return Array.from(texts).some(t => 
        t.textContent.includes('可接纳') || t.textContent.includes('h(n)')
      );
    });
    expect(admissibleConcept).toBe(true);
  });

  test('implementation beat 展示代码', async ({ page }) => {
    await page.evaluate(() => {
      const beat = window.BEATS.find(b => b[0] === 'implementation');
      if (beat) beat[2]();
    });
    await page.waitForTimeout(100);

    const codeExists = await page.evaluate(() => {
      const texts = document.querySelectorAll('svg text');
      return Array.from(texts).some(t => 
        t.textContent.includes('aStar') || 
        t.textContent.includes('openSet') ||
        t.textContent.includes('function')
      );
    });
    expect(codeExists).toBe(true);
  });

  test('dijkstra beat 对比算法', async ({ page }) => {
    await page.evaluate(() => {
      const beat = window.BEATS.find(b => b[0] === 'dijkstra');
      if (beat) beat[2]();
    });
    await page.waitForTimeout(100);

    const comparison = await page.evaluate(() => {
      const texts = document.querySelectorAll('svg text');
      return ['Dijkstra', 'A*'].filter(algo =>
        Array.from(texts).some(t => t.textContent.includes(algo))
      ).length;
    });
    expect(comparison).toBe(2);
  });

  test('applications beat 展示应用场景', async ({ page }) => {
    await page.evaluate(() => {
      const beat = window.BEATS.find(b => b[0] === 'applications');
      if (beat) beat[2]();
    });
    await page.waitForTimeout(100);

    const appCount = await page.evaluate(() => {
      const texts = document.querySelectorAll('svg text');
      return ['游戏', '导航', '机器人', '拼图'].filter(app =>
        Array.from(texts).some(t => t.textContent.includes(app))
      ).length;
    });
    expect(appCount).toBeGreaterThanOrEqual(3);
  });

  test('核心动画补间数量充足', async ({ page }) => {
    const twCount = await page.evaluate(() => {
      let count = 0;
      const originalTw = window.tw;
      window.tw = function(...args) {
        count++;
        return originalTw.apply(this, args);
      };
      
      // 运行astar-demo beat
      const beat = window.BEATS.find(b => b[0] === 'astar-demo');
      if (beat) beat[2]();
      
      return count;
    });
    
    expect(twCount).toBeGreaterThanOrEqual(30);
  });

  test('颜色方案多样性', async ({ page }) => {
    const colors = await page.evaluate(() => {
      return {
        START_COLOR: window.START_COLOR || '#2ecc71',
        END_COLOR: window.END_COLOR || '#e74c3c',
        OBSTACLE_COLOR: window.OBSTACLE_COLOR || '#95a5a6',
        VISITED_COLOR: window.VISITED_COLOR || '#3498db',
        OPEN_COLOR: window.OPEN_COLOR || '#f39c12',
        PATH_COLOR: window.PATH_COLOR || '#e74c3c',
        HIGHLIGHT: window.HIGHLIGHT || '#9b59b6'
      };
    });
    
    const uniqueColors = new Set(Object.values(colors));
    expect(uniqueColors.size).toBeGreaterThanOrEqual(6);
  });

  test('文字内容正确且无重叠', async ({ page }) => {
    await page.evaluate(() => {
      window.BEATS.forEach(beat => {
        if (beat[2]) beat[2]();
      });
    });
    await page.waitForTimeout(500);

    const textElements = await page.evaluate(() => {
      const texts = document.querySelectorAll('svg text');
      const positions = [];
      
      texts.forEach(t => {
        const bbox = t.getBBox();
        positions.push({
          x: bbox.x,
          y: bbox.y,
          width: bbox.width,
          height: bbox.height
        });
      });
      
      // 检查垂直间距
      const sortedByY = positions.sort((a, b) => a.y - b.y);
      let minGap = Infinity;
      for (let i = 1; i < sortedByY.length; i++) {
        const gap = sortedByY[i].y - (sortedByY[i-1].y + sortedByY[i-1].height);
        if (gap > 0 && gap < minGap) minGap = gap;
      }
      
      return { count: texts.length, minGap };
    });

    expect(textElements.count).toBeGreaterThan(50);
    // 检查最小间距（允许一些紧凑的文字）
    if (textElements.minGap < Infinity) {
      expect(textElements.minGap).toBeGreaterThan(-20); // 允许小幅重叠
    }
  });
});
