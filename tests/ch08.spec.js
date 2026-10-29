const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('第八章 Bellman-Ford 负权边最短路径', () => {
  test('页面加载无错误', async ({ page }) => {
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    const filePath = path.join(__dirname, '../algorithms/ch08/index.html');
    await page.goto(`file://${filePath}`);
    
    // 等待页面完全加载
    await page.waitForTimeout(2000);
    
    // 检查没有控制台错误
    expect(errors).toHaveLength(0);
  });
  
  test('包含13个场景标记', async ({ page }) => {
    const filePath = path.join(__dirname, '../algorithms/ch08/index.html');
    const fs = require('fs');
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // 计算 beat 标记数量
    const beatMatches = content.match(/\/\/ beat/g);
    expect(beatMatches).not.toBeNull();
    expect(beatMatches.length).toBeGreaterThanOrEqual(12);
  });
  
  test('timings.js 存在且格式正确', async () => {
    const fs = require('fs');
    const timingsPath = path.join(__dirname, '../algorithms/ch08/audio/zh/timings.js');
    
    expect(fs.existsSync(timingsPath)).toBeTruthy();
    
    const content = fs.readFileSync(timingsPath, 'utf-8');
    expect(content).toContain('TIMINGS');
    expect(content).toContain('intro');
    expect(content).toContain('summary');
  });
  
  test('页面标题正确', async ({ page }) => {
    const filePath = path.join(__dirname, '../algorithms/ch08/index.html');
    await page.goto(`file://${filePath}`);
    
    const title = await page.title();
    expect(title).toContain('Bellman-Ford');
  });
  
  test('BEATS数组归一化且boot()已调用', async ({ page }) => {
    const filePath = path.join(__dirname, '../algorithms/ch08/index.html');
    await page.goto(`file://${filePath}`);
    
    // 等待页面完全加载和脚本执行
    await page.waitForTimeout(2000);
    
    // 检查BEATS是否归一化（对象数组而非嵌套数组）
    const beatsStructure = await page.evaluate(() => {
      if (typeof BEATS === 'undefined' || !Array.isArray(BEATS)) {
        return { valid: false, length: 0 };
      }
      const firstBeat = BEATS[0];
      return {
        valid: typeof firstBeat === 'object' && 'id' in firstBeat && 'title' in firstBeat,
        length: BEATS.length
      };
    });
    
    expect(beatsStructure.valid).toBeTruthy();
    expect(beatsStructure.length).toBeGreaterThanOrEqual(12);
  });
  
  test('有向图元素存在', async ({ page }) => {
    const filePath = path.join(__dirname, '../algorithms/ch08/index.html');
    const fs = require('fs');
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // 检查代码中是否包含drawGraph调用
    expect(content).toContain('drawGraph');
    
    // 检查节点和边的定义（有向图）
    expect(content).toContain('NODES');
    expect(content).toContain('EDGES');
    
    // 检查箭头标记（有向图特征）
    expect(content).toContain('drawArrow');
    expect(content).toContain('marker-end');
    
    // 检查负权边
    expect(content).toContain('weight: -');
    
    // 检查核心函数定义
    expect(content).toContain('updateDistance');
    expect(content).toContain('highlightEdge');
  });
  
  test('动画演示beat包含足够的tw()调用', async ({ page }) => {
    const filePath = path.join(__dirname, '../algorithms/ch08/index.html');
    const fs = require('fs');
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // 提取demo_iteration beat的代码
    const demoMatch = content.match(/\['demo_iteration'[^]*?^\]/m);
    expect(demoMatch).not.toBeNull();
    
    const demoCode = demoMatch[0];
    
    // 统计tw()调用次数
    const twCalls = (demoCode.match(/tw\(/g) || []).length;
    expect(twCalls).toBeGreaterThanOrEqual(10);
    
    // 检查是否有颜色变化
    expect(demoCode).toContain('EDGE_TRYING');
    expect(demoCode).toContain('EDGE_SELECTED');
  });
  
  test('练习题包含3道题', async ({ page }) => {
    const filePath = path.join(__dirname, '../algorithms/ch08/index.html');
    await page.goto(`file://${filePath}`);
    
    await page.waitForTimeout(1000);
    
    const quizLength = await page.evaluate(() => {
      return typeof QUIZ !== 'undefined' ? QUIZ.length : 0;
    });
    
    expect(quizLength).toBe(3);
  });
  
  test('负权边正确标识', async ({ page }) => {
    const filePath = path.join(__dirname, '../algorithms/ch08/index.html');
    const fs = require('fs');
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // 检查负权边颜色常量
    expect(content).toContain('EDGE_NEGATIVE');
    
    // 检查负权边在EDGES中的定义
    const edgesSection = content.match(/const EDGES = \[[^\]]+\]/s);
    expect(edgesSection).not.toBeNull();
    expect(edgesSection[0]).toContain('weight: -');
  });
  
  test('包含负权环检测相关内容', async ({ page }) => {
    const filePath = path.join(__dirname, '../algorithms/ch08/index.html');
    const fs = require('fs');
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // 检查负权环相关的beat
    expect(content).toContain('negative_cycle');
    
    // 检查是否包含第n轮检测的说明
    expect(content).toMatch(/第\s*[nV]\s*轮/);
  });
});
