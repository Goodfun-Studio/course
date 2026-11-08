const { chromium } = require('playwright');
const path = require('path');

async function testBeat(page, beatId, dur) {
  // 等待 beat 加载
  await page.evaluate((id) => {
    const beat = window.BEATS.find(b => b.id === id);
    if (!beat) throw new Error(`Beat ${id} not found`);
    
    // 清空并执行 beat
    const svg = document.querySelector('svg');
    svg.innerHTML = '';
    
    // 创建 m 和 dur 函数
    const timings = window.TIMINGS[id];
    const m = (mark) => timings.marks[mark] || 0;
    beat.run(m, timings.dur);
  }, beatId);

  // 等待动画稳定
  await page.waitForTimeout(100);

  // 收集所有动画的最大结束时间
  const result = await page.evaluate((id) => {
    const timings = window.TIMINGS[id];
    const dur = timings.dur;
    
    // 收集所有 TW (tween) 的时间
    const tweens = window.TW || [];
    let maxTime = 0;
    
    tweens.forEach(tw => {
      const endTime = tw.t0 + (typeof tw.dur === 'number' ? tw.dur : 0);
      if (endTime > maxTime) maxTime = endTime;
    });
    
    const ratio = maxTime / dur;
    
    // 采样检查可见元素覆盖率
    const sampleInterval = 0.5; // 每0.5秒采样一次
    const samples = Math.ceil(dur / sampleInterval);
    let lastChangeTime = 0;
    
    // 简化：检查最后一个元素的出现时间
    const elements = document.querySelectorAll('svg text, svg rect, svg circle, svg line');
    elements.forEach(el => {
      const opacity = parseFloat(getComputedStyle(el).opacity) || 0;
      if (opacity > 0) {
        // 这个元素是可见的，检查它的动画时间
        tweens.forEach(tw => {
          if (tw.elem === el) {
            const changeTime = tw.t0;
            if (changeTime > lastChangeTime) {
              lastChangeTime = changeTime;
            }
          }
        });
      }
    });
    
    const coverage = lastChangeTime / dur;
    
    return {
      beatId: id,
      dur,
      maxTime,
      ratio,
      coverage,
      tweenCount: tweens.length,
      elementCount: elements.length
    };
  }, beatId);

  return result;
}

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const htmlPath = 'file://' + path.resolve(__dirname, 'index.html');
  await page.goto(htmlPath);
  
  // 等待页面加载
  await page.waitForFunction(() => window.BEATS && window.TIMINGS);
  
  // 获取所有 beat IDs
  const beatIds = await page.evaluate(() => window.BEATS.map(b => b.id));
  
  console.log('Beat 测试报告\n');
  console.log('Beat ID          | 时长(s) | 动画最大时间 | 比值   | 覆盖率 | 状态');
  console.log('-----------------|---------|-------------|--------|--------|--------');
  
  let passCount = 0;
  let failCount = 0;
  
  for (const beatId of beatIds) {
    const timing = await page.evaluate((id) => window.TIMINGS[id], beatId);
    const result = await testBeat(page, beatId, timing.dur);
    
    const ratioOk = result.ratio >= 0.8 && result.ratio <= 1.2;
    const coverageOk = result.coverage >= 0.7;
    const status = ratioOk && coverageOk ? '✓ 通过' : '✗ 失败';
    
    if (ratioOk && coverageOk) passCount++;
    else failCount++;
    
    console.log(
      `${beatId.padEnd(16)} | ` +
      `${timing.dur.toFixed(2).padStart(7)} | ` +
      `${result.maxTime.toFixed(2).padStart(11)} | ` +
      `${result.ratio.toFixed(2).padStart(6)} | ` +
      `${result.coverage.toFixed(2).padStart(6)} | ` +
      status
    );
  }
  
  console.log('\n总结：');
  console.log(`通过：${passCount} / ${beatIds.length}`);
  console.log(`失败：${failCount} / ${beatIds.length}`);
  console.log('\n验收标准：');
  console.log('- 比值范围：[0.8, 1.2]');
  console.log('- 覆盖率：≥ 0.7');
  
  await browser.close();
}

main().catch(console.error);
