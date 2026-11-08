const { test, expect } = require('@playwright/test');

test.describe('Chapter 22 - Huffman Coding Animation Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('file://' + require('path').resolve(__dirname, '../algorithms/ch22/index.html'));
    await page.waitForLoadState('networkidle');
  });

  const BEATS = [
    'intro', 'fixed-length', 'variable-length', 'prefix-code',
    'huffman-tree-demo', 'tree-to-code', 'encode-decode-demo',
    'implementation', 'complexity', 'optimality', 'applications', 'limitations'
  ];

  // Exact acceptance check from the task: uses real engine runBeat + TW
  test('all 12 beats: max(TW[].t0+dur) / TIMINGS[beat].dur in [0.8, 1.2]', async ({ page }) => {
    const results = await page.evaluate(() => {
      const out = [];
      window.BEATS.forEach((b, i) => {
        P.i = i;
        P.end = runBeat(i);
        const a = Math.max(0, ...TW.map(w => w.t0 + w.dur));
        out.push({
          beat: b.id,
          maxEnd: a,
          dur: TIMINGS[b.id].dur,
          ratio: a / TIMINGS[b.id].dur
        });
      });
      return out;
    });

    console.log('\n=== Per-beat ratio (real engine runBeat) ===');
    results.forEach(r => {
      console.log(
        r.beat.padEnd(20),
        'maxTW=' + r.maxEnd.toFixed(2).padStart(7),
        ' dur=' + r.dur.toFixed(2).padStart(7),
        ' ratio=' + r.ratio.toFixed(2).padStart(6),
        (r.ratio >= 0.8 && r.ratio <= 1.2 ? ' ✅' : ' ❌')
      );
    });

    for (const r of results) {
      expect(r.ratio).toBeGreaterThanOrEqual(0.8);
      expect(r.ratio).toBeLessThanOrEqual(1.2);
    }
    expect(results.length).toBe(12);
  });

  // 验证没有 JS 错误
  test('no JavaScript errors on page', async ({ page }) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.evaluate(() => {
      window.BEATS.forEach((b, i) => { P.i = i; P.end = runBeat(i); });
    });

    await page.waitForTimeout(200);
    expect(errors).toEqual([]);
  });
});
