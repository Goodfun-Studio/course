// 标准B验证脚本：测试所有 beat 的 ratio 和 content coverage
import { chromium } from 'playwright';

const url = `file://${process.cwd()}/index.html`;

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(url);

// 等待加载
await page.waitForFunction(() => window.BEATS && window.TIMINGS);

console.log('=== 标准B验证：Ratio + Content Coverage ===\n');

// 指标1：Ratio
console.log('【指标1：Ratio（动画结束时间 / 旁白时长）】');
const ratios = await page.evaluate(() => {
  const results = [];
  window.BEATS.forEach((b, i) => {
    P.i = i;
    runBeat(i);
    const animEnd = Math.max(0, ...TW.map(w => w.t0 + (typeof w.dur === 'number' ? w.dur : 0)));
    const ratio = (animEnd / TIMINGS[b.id].dur).toFixed(2);
    results.push({ id: b.id, ratio, animEnd, dur: TIMINGS[b.id].dur });
    console.log(b.id, 'ratio=', ratio);
  });
  return results;
});

ratios.forEach(r => {
  const status = (r.ratio >= 0.8 && r.ratio <= 1.2) ? '✓' : '✗';
  console.log(`${status} ${r.id}: ${r.ratio} (animEnd=${r.animEnd.toFixed(1)}s, dur=${r.dur}s)`);
});

// 指标2：Content Coverage
console.log('\n【指标2：Content Coverage（最后签名变化 / dur）】');
const coverages = await page.evaluate(() => {
  const results = [];
  window.BEATS.forEach((b, i) => {
    P.i = i;
    runBeat(i);
    
    const dur = TIMINGS[b.id].dur;
    const sampleInterval = 0.5;
    let lastChangeTime = 0;
    let prevSignature = null;
    
    for (let t = 0; t <= dur; t += sampleInterval) {
      // 取当前时刻所有可见元素的签名
      const svg = document.getElementById('panel0');
      if (!svg) continue;
      const elements = svg.querySelectorAll('text, rect, circle, line, path');
      const signatures = [];
      elements.forEach(el => {
        const opacity = parseFloat(el.getAttribute('opacity') || 1);
        if (opacity > 0.01) {
          let sig = '';
          if (el.tagName === 'text') {
            sig = (el.textContent || '').slice(0, 5);
          }
          sig += `_o${(opacity * 1000).toFixed(0)}`;
          const fill = el.getAttribute('fill') || el.getAttribute('stroke') || '';
          sig += `_${fill.slice(0, 7)}`;
          signatures.push(sig);
        }
      });
      
      const currentSignature = signatures.sort().join('|');
      if (currentSignature !== prevSignature) {
        lastChangeTime = t;
        prevSignature = currentSignature;
      }
    }
    
    const coverage = (lastChangeTime / dur).toFixed(2);
    results.push({ id: b.id, coverage, lastChangeTime, dur });
    console.log(b.id, 'coverage=', coverage);
  });
  return results;
});

coverages.forEach(c => {
  const status = (c.coverage >= 0.70) ? '✓' : '✗';
  console.log(`${status} ${c.id}: ${c.coverage} (lastChange=${c.lastChangeTime.toFixed(1)}s, dur=${c.dur}s)`);
});

// 汇总
console.log('\n=== 汇总 ===');
const ratioPass = ratios.filter(r => r.ratio >= 0.8 && r.ratio <= 1.2).length;
const coveragePass = coverages.filter(c => c.coverage >= 0.70).length;
console.log(`Ratio通过: ${ratioPass}/12`);
console.log(`Coverage通过: ${coveragePass}/12`);
console.log(`整体: ${(ratioPass === 12 && coveragePass === 12) ? '✓ PASS' : '✗ FAIL'}`);

await browser.close();
