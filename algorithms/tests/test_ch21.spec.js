const { test, expect } = require('@playwright/test');

test.describe('第21章：字典树（Trie）', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8000/ch21/');
    await page.waitForLoadState('networkidle');
  });

  test('应该加载页面并显示标题', async ({ page }) => {
    const title = await page.title();
    expect(title).toContain('第二十一章 字典树（Trie）');
  });

  test('应该包含所有必需的 beats', async ({ page }) => {
    const beatsCount = await page.evaluate(() => window.BEATS ? window.BEATS.length : 0);
    expect(beatsCount).toBeGreaterThanOrEqual(11);
    expect(beatsCount).toBeLessThanOrEqual(14);
  });

  test('intro - 问题引入', async ({ page }) => {
    await page.evaluate(() => {
      const beat = window.BEATS.find(b => b[0] === 'intro');
      if (beat) beat[2]();
    });
    await page.waitForTimeout(500);
    
    const titleExists = await page.evaluate(() => {
      const texts = Array.from(document.querySelectorAll('text'));
      return texts.some(t => t.textContent.includes('字典树'));
    });
    expect(titleExists).toBeTruthy();
  });

  test('structure - 字典树结构', async ({ page }) => {
    await page.evaluate(() => {
      const beat = window.BEATS.find(b => b[0] === 'structure');
      if (beat) beat[2]();
    });
    await page.waitForTimeout(1000);
    
    const hasNodes = await page.evaluate(() => {
      return document.querySelectorAll('circle').length > 0;
    });
    expect(hasNodes).toBeTruthy();
  });

  test('insert-demo - 插入动画（≥25次tw，≥12秒）', async ({ page }) => {
    const twCalls = [];
    await page.exposeFunction('trackTw', (delay) => {
      twCalls.push(delay);
    });
    
    await page.evaluate(() => {
      const originalTw = window.tw;
      window.tw = function(...args) {
        const result = originalTw.apply(this, args);
        const delay = args[2] || 0;
        window.trackTw(delay);
        return result;
      };
      
      const beat = window.BEATS.find(b => b[0] === 'insert-demo');
      if (beat) beat[2]();
    });
    
    await page.waitForTimeout(2000);
    
    expect(twCalls.length).toBeGreaterThanOrEqual(25);
    const maxDelay = Math.max(...twCalls);
    expect(maxDelay).toBeGreaterThanOrEqual(12);
  });

  test('search-demo - 搜索动画（≥20次tw，≥10秒）', async ({ page }) => {
    const twCalls = [];
    await page.exposeFunction('trackTw', (delay) => {
      twCalls.push(delay);
    });
    
    await page.evaluate(() => {
      const originalTw = window.tw;
      window.tw = function(...args) {
        const result = originalTw.apply(this, args);
        const delay = args[2] || 0;
        window.trackTw(delay);
        return result;
      };
      
      const beat = window.BEATS.find(b => b[0] === 'search-demo');
      if (beat) beat[2]();
    });
    
    await page.waitForTimeout(2000);
    
    expect(twCalls.length).toBeGreaterThanOrEqual(20);
    const maxDelay = Math.max(...twCalls);
    expect(maxDelay).toBeGreaterThanOrEqual(10);
  });

  test('implementation - 代码实现', async ({ page }) => {
    await page.evaluate(() => {
      const beat = window.BEATS.find(b => b[0] === 'implementation');
      if (beat) beat[2]();
    });
    await page.waitForTimeout(1000);
    
    const hasCode = await page.evaluate(() => {
      const texts = Array.from(document.querySelectorAll('text'));
      return texts.some(t => t.textContent.includes('class Trie'));
    });
    expect(hasCode).toBeTruthy();
  });

  test('应该使用5种以上颜色', async ({ page }) => {
    await page.evaluate(() => {
      if (window.BEATS && window.BEATS[0]) {
        window.BEATS[0][2]();
      }
    });
    await page.waitForTimeout(500);
    
    const colors = await page.evaluate(() => {
      const colorSet = new Set();
      document.querySelectorAll('[fill]').forEach(el => {
        const fill = el.getAttribute('fill');
        if (fill && fill !== 'none' && fill !== '#fff' && fill !== '#ffffff') {
          colorSet.add(fill.toLowerCase());
        }
      });
      document.querySelectorAll('[stroke]').forEach(el => {
        const stroke = el.getAttribute('stroke');
        if (stroke && stroke !== 'none') {
          colorSet.add(stroke.toLowerCase());
        }
      });
      return Array.from(colorSet);
    });
    
    expect(colors.length).toBeGreaterThanOrEqual(5);
  });

  test('文字元素应该有合理的间距（≥60px）', async ({ page }) => {
    await page.evaluate(() => {
      const beat = window.BEATS.find(b => b[0] === 'operations');
      if (beat) beat[2]();
    });
    await page.waitForTimeout(500);
    
    const hasGoodSpacing = await page.evaluate(() => {
      const texts = Array.from(document.querySelectorAll('text'));
      if (texts.length < 2) return true;
      
      const positions = texts.map(t => ({
        y: parseFloat(t.getAttribute('y') || 0)
      }));
      
      for (let i = 0; i < positions.length - 1; i++) {
        for (let j = i + 1; j < positions.length; j++) {
          const dist = Math.abs(positions[i].y - positions[j].y);
          if (dist > 0 && dist < 60) {
            return false;
          }
        }
      }
      return true;
    });
    
    expect(hasGoodSpacing).toBeTruthy();
  });

  test('应该有 boot() 初始化函数', async ({ page }) => {
    const hasBoot = await page.evaluate(() => {
      return typeof window.boot === 'function';
    });
    expect(hasBoot).toBeTruthy();
  });

  test('应该使用 panel(0) 和正确的函数签名', async ({ page }) => {
    const usesCorrectPattern = await page.evaluate(() => {
      return window.BEATS.every(beat => {
        const funcStr = beat[2].toString();
        return funcStr.includes('panel(0)');
      });
    });
    expect(usesCorrectPattern).toBeTruthy();
  });
});
