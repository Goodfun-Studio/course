const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('第二十九章 双向BFS', () => {
  test('页面加载无错误', async ({ page }) => {
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    const filePath = path.join(__dirname, '../algorithms/ch29/index.html');
    await page.goto(`file://${filePath}`);
    
    // 等待页面完全加载
    await page.waitForTimeout(2000);
    
    // 检查没有控制台错误
    expect(errors).toHaveLength(0);
  });
  
  test('包含12个场景', async ({ page }) => {
    const filePath = path.join(__dirname, '../algorithms/ch29/index.html');
    await page.goto(`file://${filePath}`);
    
    await page.waitForTimeout(1000);
    
    const beatsLength = await page.evaluate(() => {
      return typeof BEATS !== 'undefined' ? BEATS.length : 0;
    });
    
    expect(beatsLength).toBe(12);
  });
  
  test('timings.js 存在且格式正确', async () => {
    const fs = require('fs');
    const timingsPath = path.join(__dirname, '../algorithms/ch29/audio/zh/timings.js');
    
    expect(fs.existsSync(timingsPath)).toBeTruthy();
    
    const content = fs.readFileSync(timingsPath, 'utf-8');
    expect(content).toContain('TIMINGS');
    expect(content).toContain('intro');
    expect(content).toContain('summary');
  });
  
  test('页面标题正确', async ({ page }) => {
    const filePath = path.join(__dirname, '../algorithms/ch29/index.html');
    await page.goto(`file://${filePath}`);
    
    const title = await page.title();
    expect(title).toContain('双向BFS');
  });
  
  test('BEATS使用标记函数签名', async ({ page }) => {
    const filePath = path.join(__dirname, '../algorithms/ch29/index.html');
    const fs = require('fs');
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // 检查beat函数签名是否使用 (m, dur)
    const beatFunctions = content.match(/\['[^']+',\s*'[^']+',\s*\(m,\s*dur\)\s*=>/g);
    expect(beatFunctions).not.toBeNull();
    expect(beatFunctions.length).toBeGreaterThanOrEqual(10);
  });
  
  test('动画时间使用标记而非硬编码', async ({ page }) => {
    const filePath = path.join(__dirname, '../algorithms/ch29/index.html');
    const fs = require('fs');
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // 检查是否使用了 m('标记名')
    const markUsages = content.match(/m\(['"][a-z-]+['"]\)/g);
    expect(markUsages).not.toBeNull();
    expect(markUsages.length).toBeGreaterThanOrEqual(50);
  });
});
