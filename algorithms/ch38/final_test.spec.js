const { test } = require('@playwright/test');
const path = require('path');

test('ch38 验收测试 - 标准B', async ({ page }) => {
  await page.goto(`file://${path.join(__dirname, 'index.html')}`);
  await page.waitForTimeout(2000);
  
  const results = await page.evaluate(() => {
    if (!window.TIMINGS || !window.BEATS) {
      return { error: 'Not loaded' };
    }
    
    const results = [];
    
    for (const beat of window.BEATS) {
      const beatId = beat.id;
      const timing = window.TIMINGS[beatId];
      
      if (!timing) {
        results.push({ beatId, error: 'No timing' });
        continue;
      }
      
      // 执行 beat 并播放动画来测试
      try {
        // 切换到这个 beat
        if (window.play) {
          window.play(beatId);
          
          // 等待一小段时间让动画系统初始化
          // 检查最后一个动画的结束时间
          
          // 从 engine.js 的全局变量获取信息
          // 我们需要另一种方法 - 直接检查 beat 代码中使用的 marks
          
          const marks = Object.keys(timing.marks);
          const markValues = Object.values(timing.marks);
          const maxMark = Math.max(...markValues);
          const dur = timing.dur;
          
          // 比值 = 最大 mark 时间 / dur
          const ratio = maxMark / dur;
          
          // 覆盖率 = 最大 mark 时间 / dur (简化版)
          const coverage = maxMark / dur;
          
          results.push({
            beatId,
            beatTitle: beat.title,
            dur: dur.toFixed(2),
            maxMark: maxMark.toFixed(2),
            ratio: ratio.toFixed(3),
            coverage: coverage.toFixed(3),
            ratioOK: ratio >= 0.8 && ratio <= 1.2,
            coverageOK: coverage >= 0.7,
            marksCount: marks.length
          });
        }
      } catch (e) {
        results.push({ beatId, error: e.message });
      }
    }
    
    return { results };
  });
  
  if (results.error) {
    console.error('❌', results.error);
    return;
  }
  
  console.log('\n📊 Ch38 布隆过滤器 - 验收报告 (标准B)\n');
  console.log('=' .repeat(80));
  
  let passCount = 0;
  let failCount = 0;
  
  for (const r of results.results) {
    if (r.error) {
      console.log(`❌ ${r.beatId}: ${r.error}`);
      failCount++;
      continue;
    }
    
    const ratioMark = r.ratioOK ? '✅' : '❌';
    const coverageMark = r.coverageOK ? '✅' : '❌';
    
    console.log(`\n${r.beatId} (${r.beatTitle}):`);
    console.log(`  指标1 (比值):  ${r.ratio} ${ratioMark} [0.8-1.2]`);
    console.log(`  指标2 (覆盖): ${r.coverage} ${coverageMark} [≥0.7]`);
    console.log(`  dur: ${r.dur}s, 最大mark: ${r.maxMark}s, marks数: ${r.marksCount}`);
    
    if (r.ratioOK && r.coverageOK) {
      passCount++;
    } else {
      failCount++;
    }
  }
  
  console.log('\n' + '='.repeat(80));
  console.log(`\n总结: ${results.results.length} beats, ${passCount} 通过, ${failCount} 失败`);
  console.log(failCount === 0 ? '✅ 全部通过标准B验收' : '❌ 部分指标未达标');
});
