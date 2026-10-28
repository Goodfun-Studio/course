const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('第五章 Dijkstra 最短路径算法', () => {
  test('页面加载无错误', async ({ page }) => {
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    const filePath = path.join(__dirname, '../algorithms/ch05/index.html');
    await page.goto(`file://${filePath}`);
    
    // 等待页面完全加载
    await page.waitForTimeout(2000);
    
    // 检查没有控制台错误
    expect(errors).toHaveLength(0);
  });
  
  test('包含12个场景标记', async ({ page }) => {
    const filePath = path.join(__dirname, '../algorithms/ch05/index.html');
    const fs = require('fs');
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // 计算 beat 标记数量
    const beatMatches = content.match(/\/\/ beat/g);
    expect(beatMatches).not.toBeNull();
    expect(beatMatches.length).toBe(12);
  });
  
  test('音频文件存在', async () => {
    const fs = require('fs');
    const audioDir = path.join(__dirname, '../algorithms/ch05/audio/zh');
    
    const expectedFiles = [
      'intro.mp3',
      'graph_intro.mp3',
      'naive.mp3',
      'greedy_proof.mp3',
      'relax.mp3',
      'priority_queue.mp3',
      'demo_step.mp3',
      'demo_middle.mp3',
      'demo_end.mp3',
      'complexity.mp3',
      'applications.mp3',
      'summary.mp3'
    ];
    
    for (const file of expectedFiles) {
      const filePath = path.join(audioDir, file);
      expect(fs.existsSync(filePath)).toBeTruthy();
      
      // 检查文件大小 > 0
      const stats = fs.statSync(filePath);
      expect(stats.size).toBeGreaterThan(0);
    }
  });
  
  test('timings.js 存在且格式正确', async () => {
    const fs = require('fs');
    const timingsPath = path.join(__dirname, '../algorithms/ch05/audio/zh/timings.js');
    
    expect(fs.existsSync(timingsPath)).toBeTruthy();
    
    const content = fs.readFileSync(timingsPath, 'utf-8');
    expect(content).toContain('window.TIMINGS');
    expect(content).toContain('intro');
    expect(content).toContain('summary');
  });
  
  test('页面标题正确', async ({ page }) => {
    const filePath = path.join(__dirname, '../algorithms/ch05/index.html');
    await page.goto(`file://${filePath}`);
    
    const title = await page.title();
    expect(title).toContain('Dijkstra');
  });
  
  test('BEATS数组归一化且boot()已调用', async ({ page }) => {
    const filePath = path.join(__dirname, '../algorithms/ch05/index.html');
    await page.goto(`file://${filePath}`);
    
    // 等待页面完全加载和脚本执行
    await page.waitForTimeout(2000);
    
    // 检查BEATS是否归一化（对象数组而非嵌套数组）
    const beatsStructure = await page.evaluate(() => {
      if (typeof BEATS === 'undefined' || !Array.isArray(BEATS)) {
        return { valid: false, length: 0 };
      }
      // 检查第一个元素是否有id属性（归一化后的标志）
      const firstBeat = BEATS[0];
      return {
        valid: typeof firstBeat === 'object' && 'id' in firstBeat && 'title' in firstBeat,
        length: BEATS.length
      };
    });
    
    expect(beatsStructure.valid).toBeTruthy();
    expect(beatsStructure.length).toBe(12);
    
    // 检查#scene是否有子元素（boot()调用的证据）
    const sceneChildren = await page.locator('#scene').count();
    expect(sceneChildren).toBeGreaterThan(0);
  });
  
  test('图形元素存在', async ({ page }) => {
    const filePath = path.join(__dirname, '../algorithms/ch05/index.html');
    const fs = require('fs');
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // 检查代码中是否包含drawGraph调用
    expect(content).toContain('drawGraph');
    
    // 检查节点和边的定义
    expect(content).toContain('NODES');
    expect(content).toContain('EDGES');
    
    // 检查核心函数定义
    expect(content).toContain('updateNodeColor');
    expect(content).toContain('updateDistance');
    expect(content).toContain('highlightEdge');
  });
  
  test('练习题包含3道题', async ({ page }) => {
    const filePath = path.join(__dirname, '../algorithms/ch05/index.html');
    await page.goto(`file://${filePath}`);
    
    // 等待页面完全加载
    await page.waitForTimeout(1000);
    
    const quizLength = await page.evaluate(() => {
      return typeof QUIZ !== 'undefined' ? QUIZ.length : 0;
    });
    
    expect(quizLength).toBe(3);
  });
});
