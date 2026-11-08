const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  const htmlPath = 'file://' + path.join(__dirname, 'index.html');
  console.log('打开页面:', htmlPath);
  
  await page.goto(htmlPath);
  
  // 等待页面加载
  await page.waitForTimeout(2000);
  
  // 检查页面是否正常加载
  const hasBeats = await page.evaluate(() => {
    return window.BEATS && window.BEATS.length > 0;
  });
  
  console.log('BEATS 已加载:', hasBeats);
  
  if (hasBeats) {
    const beatCount = await page.evaluate(() => window.BEATS.length);
    console.log('Beat 数量:', beatCount);
    
    // 检查第一个 beat
    const firstBeat = await page.evaluate(() => {
      const beat = window.BEATS[0];
      return {
        id: beat.id,
        title: beat.title,
        hasRun: typeof beat.run === 'function'
      };
    });
    
    console.log('第一个 beat:', firstBeat);
  }
  
  console.log('\n浏览器将保持打开 10 秒，请检查页面...');
  await page.waitForTimeout(10000);
  
  await browser.close();
})();
