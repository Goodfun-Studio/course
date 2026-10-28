const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('第六章 快速排序', () => {
  test('页面加载无错误', async ({ page }) => {
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    const filePath = path.join(__dirname, '../algorithms/ch06/index.html');
    await page.goto(`file://${filePath}`);
    
    // 等待页面完全加载
    await page.waitForTimeout(2000);
    
    // 检查没有控制台错误
    expect(errors).toHaveLength(0);
  });
  
  test('包含12个beat', async ({ page }) => {
    const filePath = path.join(__dirname, '../algorithms/ch06/index.html');
    await page.goto(`file://${filePath}`);
    
    // 等待页面完全加载和脚本执行
    await page.waitForTimeout(1000);
    
    // 执行JavaScript获取BEATS数组长度
    const beatsLength = await page.evaluate(() => {
      return typeof BEATS !== 'undefined' ? BEATS.length : 0;
    });
    
    expect(beatsLength).toBe(12);
  });
  
  test('音频文件存在', async () => {
    const fs = require('fs');
    const audioDir = path.join(__dirname, '../algorithms/ch06/audio/zh');
    
    const expectedFiles = [
      'intro.mp3',
      'divide_conquer.mp3',
      'partition.mp3',
      'partition_demo.mp3',
      'pivot_choice.mp3',
      'recursion.mp3',
      'best_case.mp3',
      'worst_case.mp3',
      'average_case.mp3',
      'in_place.mp3',
      'stability.mp3',
      'summary.mp3'
    ];
    
    for (const file of expectedFiles) {
      const filePath = path.join(audioDir, file);
      expect(fs.existsSync(filePath)).toBeTruthy();
      
      // 检查文件大小 > 0
      const stats = fs.statSync(filePath);
      expect(stats.size).toBeGreaterThan(1000);
    }
  });
  
  test('timings.js 存在且格式正确', async () => {
    const fs = require('fs');
    const timingsPath = path.join(__dirname, '../algorithms/ch06/audio/zh/timings.js');
    
    expect(fs.existsSync(timingsPath)).toBeTruthy();
    
    const content = fs.readFileSync(timingsPath, 'utf-8');
    expect(content).toContain('window.TIMINGS');
    expect(content).toContain('intro');
    expect(content).toContain('summary');
  });
  
  test('页面标题正确', async ({ page }) => {
    const filePath = path.join(__dirname, '../algorithms/ch06/index.html');
    await page.goto(`file://${filePath}`);
    
    const title = await page.title();
    expect(title).toContain('快速排序');
  });
  
  test('包含必要的SVG元素', async ({ page }) => {
    const filePath = path.join(__dirname, '../algorithms/ch06/index.html');
    await page.goto(`file://${filePath}`);
    
    // 等待SVG容器加载
    await page.waitForTimeout(1000);
    
    // 检查是否有SVG元素
    const svgCount = await page.locator('svg').count();
    expect(svgCount).toBeGreaterThan(0);
  });
  
  test('BEATS归一化和boot()调用存在', async ({ page }) => {
    const fs = require('fs');
    const filePath = path.join(__dirname, '../algorithms/ch06/index.html');
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // 检查BEATS归一化
    expect(content).toContain('window.BEATS = BEATS.map');
    expect(content).toContain('TIMINGS[b.id]');
    
    // 检查boot()调用
    expect(content).toContain('boot()');
  });
  
  test('没有使用setTimeout', async ({ page }) => {
    const fs = require('fs');
    const filePath = path.join(__dirname, '../algorithms/ch06/index.html');
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // 检查没有setTimeout（允许在注释中）
    const lines = content.split('\n');
    const codeLines = lines.filter(line => !line.trim().startsWith('//'));
    const hasSetTimeout = codeLines.some(line => line.includes('setTimeout'));
    
    expect(hasSetTimeout).toBe(false);
  });
});
