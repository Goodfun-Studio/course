const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  console.log('加载课程页面...');
  await page.goto('file://' + process.cwd() + '/ch28/index.html');
  
  // 等待页面加载
  await page.waitForTimeout(2000);
  
  // 检查标题
  const title = await page.title();
  console.log('页面标题:', title);
  
  // 检查章节信息
  const chapterInfo = await page.evaluate(() => {
    return window.CHAPTER;
  });
  console.log('章节信息:', chapterInfo);
  
  // 检查beats数量
  const beatsCount = await page.evaluate(() => {
    return window.BEATS ? window.BEATS.length : 0;
  });
  console.log('Beats数量:', beatsCount);
  
  // 检查每个beat
  const beats = await page.evaluate(() => {
    if (!window.BEATS) return [];
    return window.BEATS.map(beat => ({
      id: beat[0],
      title: beat[1]
    }));
  });
  
  console.log('\nBeats列表:');
  beats.forEach((beat, i) => {
    console.log(`  ${i+1}. ${beat.id} - ${beat.title}`);
  });
  
  // 检查音频文件
  console.log('\n检查音频文件:');
  const marks = await page.evaluate(() => {
    return window.MARKS || [];
  });
  console.log('音频标记数量:', marks.length);
  
  // 检查动画数量
  const animationCount = await page.evaluate(() => {
    let count = 0;
    const script = document.body.innerHTML;
    const twMatches = script.match(/tw\(/g);
    return twMatches ? twMatches.length : 0;
  });
  console.log('\n动画调用次数:', animationCount);
  
  // 检查是否符合标准（≥25次tw，≥12秒）
  if (animationCount >= 25) {
    console.log('✓ 动画数量符合标准 (≥25)');
  } else {
    console.log('✗ 动画数量不足 (<25)');
  }
  
  // 检查fill-demo beat的动画
  const fillDemoAnimations = await page.evaluate(() => {
    const script = document.body.innerHTML;
    const fillDemoMatch = script.match(/\['fill-demo'[^\]]+\(\) => \{([^}]+(?:\{[^}]*\}[^}]*)*)\}\]/s);
    if (fillDemoMatch) {
      const twMatches = fillDemoMatch[1].match(/tw\(/g);
      return twMatches ? twMatches.length : 0;
    }
    return 0;
  });
  console.log('fill-demo beat 动画数量:', fillDemoAnimations);
  
  if (fillDemoAnimations >= 25) {
    console.log('✓ fill-demo 动画数量符合标准 (≥25)');
  } else {
    console.log('✗ fill-demo 动画数量不足 (<25)');
  }
  
  console.log('\n测试完成！');
  
  await browser.close();
})();
