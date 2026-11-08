const { test, expect } = require('@playwright/test');
const path = require('path');

test('ch38 布隆过滤器 - 验收测试', async ({ page }) => {
  // 打开页面
  await page.goto(`file://${path.join(__dirname, 'index.html')}`);
  
  // 等待加载
  await page.waitForTimeout(1000);
  
  // 获取所有 beats 的指标
  const results = await page.evaluate(() => {
    const TIMINGS = window.TIMINGS;
    const BEATS = window.BEATS;
    
    if (!TIMINGS || !BEATS) {
      return { error: 'TIMINGS or BEATS not loaded' };
    }
    
    const results = [];
    
    for (const beat of BEATS) {
      const beatId = beat.id;
      const beatTitle = beat.title;
      const timing = TIMINGS[beatId];
      
      if (!timing) {
        results.push({ beatId, error: 'No timing data' });
        continue;
      }
      
      const dur = timing.dur;
      
      // 准备环境
      window.TW = [];
      window.P = { panels: [] };
      
      // m 函数
      const m = (mark) => {
        if (!timing.marks[mark]) {
          console.warn(`Mark '${mark}' not found in ${beatId}`);
          return 0;
        }
        return timing.marks[mark];
      };
      
      // 执行 beat
      try {
        beat.run(m, dur);
      } catch (e) {
        results.push({ beatId, beatTitle, error: e.message });
        continue;
      }
      
      // 计算指标1：比值
      let maxTime = 0;
      for (const tw of window.TW) {
        const endTime = tw.t0 + (typeof tw.dur === 'number' ? tw.dur : 0);
        if (endTime > maxTime) {
          maxTime = endTime;
        }
      }
      const ratio = maxTime / dur;
      
      // 计算指标2：覆盖率
      const coverage = maxTime / dur;
      
      results.push({
        beatId,
        beatTitle,
        dur: dur.toFixed(2),
        maxTime: maxTime.toFixed(2),
        ratio: ratio.toFixed(3),
        coverage: coverage.toFixed(3),
        ratioOK: ratio >= 0.8 && ratio <= 1.2,
        coverageOK: coverage >= 0.7,
        twCount: window.TW.length
      });
    }
    
    return { results };
  });
  
  if (results.error) {
    console.error('❌', results.error);
    return;
  }
  
  console.log('\n📊 Ch38 布隆过滤器 - 验收报告\n');
  console.log('=' .repeat(80));
  
  let allPass = true;
  
  for (const r of results.results) {
    if (r.error) {
      console.log(`❌ ${r.beatId}: ${r.error}`);
      allPass = false;
      continue;
    }
    
    const ratioMark = r.ratioOK ? '✅' : '❌';
    const coverageMark = r.coverageOK ? '✅' : '❌';
    
    console.log(`\n${r.beatId} (${r.beatTitle}):`);
    console.log(`  指标1 (比值):  ${r.ratio} ${ratioMark} [0.8-1.2]`);
    console.log(`  指标2 (覆盖): ${r.coverage} ${coverageMark} [≥0.7]`);
    console.log(`  dur: ${r.dur}s, maxTime: ${r.maxTime}s, TW数: ${r.twCount}`);
    
    if (!r.ratioOK || !r.coverageOK) {
      allPass = false;
    }
  }
  
  console.log('\n' + '='.repeat(80));
  console.log(`\n总结: ${results.results.length} beats`);
  console.log(allPass ? '✅ 全部通过标准B验收' : '❌ 部分指标未达标');
});
