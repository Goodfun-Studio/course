const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('ch19 - Union-Find Animation Tests', () => {
  test.beforeEach(async ({ page }) => {
    const filePath = path.resolve(__dirname, '../algorithms/ch19/index.html');
    await page.goto(`file://${filePath}`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
  });

  test('验收标准1：所有 beat 的动画时长与旁白时长比值在 [0.8, 1.2]', async ({ page }) => {
    const results = await page.evaluate(() => {
      const beats = window.BEATS;
      const timings = window.TIMINGS;
      const results = [];

      beats.forEach(beat => {
        const beatId = beat.id;
        const timing = timings[beatId];
        if (!timing) {
          results.push({ beatId, error: 'No timing found' });
          return;
        }

        const narrationDur = timing.dur;
        
        // 模拟执行 beat 来收集所有 tw 调用
        const mockTweens = [];
        const originalTw = window.tw;
        window.tw = function(element, props, t0, dur) {
          const duration = dur || 0.5; // 默认补间时长
          mockTweens.push({ t0, endTime: t0 + duration });
          return { element, props };
        };

        try {
          const m = (markName) => timing.marks[markName] || 0;
          beat.run(m, narrationDur);
        } catch (e) {
          results.push({ beatId, error: e.message });
          window.tw = originalTw;
          return;
        }

        window.tw = originalTw;

        // 计算最大结束时间
        let maxEndTime = 0;
        mockTweens.forEach(tween => {
          if (tween.endTime > maxEndTime) {
            maxEndTime = tween.endTime;
          }
        });

        const ratio = maxEndTime / narrationDur;
        const pass = ratio >= 0.8 && ratio <= 1.2;

        results.push({
          beatId,
          narrationDur,
          maxEndTime,
          ratio: ratio.toFixed(2),
          pass,
          tweenCount: mockTweens.length
        });
      });

      return results;
    });

    console.log('\n验收标准1结果：');
    results.forEach(r => {
      if (r.error) {
        console.log(`  ${r.beatId}: ERROR - ${r.error}`);
      } else {
        const status = r.pass ? '✓' : '✗';
        console.log(`  ${status} ${r.beatId}: ratio=${r.ratio} (max=${r.maxEndTime.toFixed(2)}s / dur=${r.narrationDur.toFixed(2)}s, tweens=${r.tweenCount})`);
      }
    });

    const allPass = results.every(r => !r.error && r.pass);
    expect(allPass).toBeTruthy();
  });

  test('验收标准2：关键文字/图形变化时刻与标记时刻差 < 1s（采样验证）', async ({ page }) => {
    const sampleResults = await page.evaluate(() => {
      const beats = window.BEATS;
      const timings = window.TIMINGS;
      const results = [];

      // 采样几个关键 beat 进行验证
      const sampleBeatIds = ['intro', 'path-compression', 'union-by-rank', 'finish'];

      sampleBeatIds.forEach(beatId => {
        const beat = beats.find(b => b.id === beatId);
        const timing = timings[beatId];
        
        if (!beat || !timing) return;

        const narrationDur = timing.dur;
        const marks = timing.marks;
        
        // 收集所有使用 mark 的 tw 调用
        const mockTweens = [];
        const originalTw = window.tw;
        window.tw = function(element, props, t0, dur) {
          mockTweens.push({ t0, markName: t0 }); // t0 在这里是 mark 时间
          return { element, props };
        };

        try {
          const m = (markName) => marks[markName] || 0;
          beat.run(m, narrationDur);
        } catch (e) {
          results.push({ beatId, error: e.message });
          window.tw = originalTw;
          return;
        }

        window.tw = originalTw;

        // 验证：所有动画时间点都应该对应某个 mark
        const markValues = Object.values(marks);
        let maxDiff = 0;
        let validCount = 0;

        mockTweens.forEach(tween => {
          const t0 = tween.t0;
          // 找到最近的 mark
          let minDiff = Infinity;
          markValues.forEach(markTime => {
            const diff = Math.abs(t0 - markTime);
            if (diff < minDiff) minDiff = diff;
          });
          
          if (minDiff < 1.0) validCount++;
          if (minDiff > maxDiff) maxDiff = minDiff;
        });

        const pass = maxDiff < 1.0;
        results.push({
          beatId,
          maxDiff: maxDiff.toFixed(3),
          validCount,
          totalTweens: mockTweens.length,
          pass
        });
      });

      return results;
    });

    console.log('\n验收标准2结果（采样）：');
    sampleResults.forEach(r => {
      if (r.error) {
        console.log(`  ${r.beatId}: ERROR - ${r.error}`);
      } else {
        const status = r.pass ? '✓' : '✗';
        console.log(`  ${status} ${r.beatId}: maxDiff=${r.maxDiff}s (${r.validCount}/${r.totalTweens} valid)`);
      }
    });

    const allPass = sampleResults.every(r => !r.error && r.pass);
    expect(allPass).toBeTruthy();
  });

  test('验收标准3：无 JS 错误', async ({ page }) => {
    const errors = [];
    page.on('pageerror', error => {
      errors.push(error.message);
    });

    await page.waitForTimeout(2000);

    console.log('\n验收标准3结果：');
    if (errors.length === 0) {
      console.log('  ✓ 无 JS 错误');
    } else {
      console.log('  ✗ 发现 JS 错误：');
      errors.forEach(err => console.log(`    - ${err}`));
    }

    expect(errors.length).toBe(0);
  });
});
