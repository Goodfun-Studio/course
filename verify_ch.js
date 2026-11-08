const { chromium } = require('playwright');

const ch = process.argv[2];
const root = '/Users/ivywu/course/algorithms';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(`file://${root}/${ch}/index.html?t=` + Date.now());
  await page.waitForTimeout(1000);
  await page.click('#coverGo').catch(()=>{});
  await page.waitForTimeout(500);

  // 暂停播放器：页面的 requestAnimationFrame 循环也在调 evalTo(P.t)，
  // 会与我们的采样互相干扰，导致结果不确定。
  await page.evaluate(() => {
    try { P.playing = false; if (P.audio) P.audio.pause(); } catch (e) {}
  });

  const beats = await page.evaluate(() => (window.BEATS||[]).map((b,i)=>({i,id:b.id,dur:TIMINGS[b.id]?.dur||0,ask:!!b.ask})));
  if (!beats.length) { console.log(`${ch}: ❌ window.BEATS 为空`); await browser.close(); return; }

  console.log(`${ch} (标准B)  ${beats.length} beats`);
  console.log('beat                       | ratio | 覆盖  | 判定');
  let badR=0, badC=0;

  for (const b of beats) {
    await page.evaluate((i)=>{ P.playing = false; P.i=i; P.t=0; runBeat(i); }, b.i);
    const animEnd = await page.evaluate(() => Math.max(0, ...TW.map(w=>w.t0+(typeof w.dur==='number'?w.dur:0))));
    const r = b.dur ? animEnd / b.dur : NaN;

    let lastChange = 0, prev = '';
    for (let t = 0; t <= b.dur; t += Math.max(0.5, b.dur/40)) {
      const sig = await page.evaluate((time) => {
        P.t = time; evalTo(time);
        const parts = [];
        document.querySelectorAll('text, rect, circle, line').forEach(el => {
          let op = 1, e = el;
          while (e) { if (e.style?.display==='none'){op=0;break;} const o=e.getAttribute&&e.getAttribute('opacity'); if(o!=null) op*=parseFloat(o); e=e.parentElement; }
          // 与实际渲染无关的占位元素不算可见内容（防止用空元素刷覆盖指标）：
          //  - <text> 内容为空 → 什么都不显示
          //  - <g> 没有任何子元素 → 空组，什么都不显示
          const tag = el.tagName.toLowerCase();
          if (tag === 'text' && !(el.textContent || '').trim()) return;
          if (tag === 'g' && el.querySelector('text,rect,circle,line,path,polygon,ellipse') === null) return;
          if (op > 0.4) {
            const tr = el.getAttribute('transform') || '';
            const sm = tr.match(/scale\(([\d.]+)\)/);
            const sc = sm ? Math.round(parseFloat(sm[1])*20)/20 : 1;
            parts.push((el.textContent||'')+Math.round(op*3)+(el.getAttribute('fill')||'')+'s'+sc);
          }
        });
        return parts.join('|');
      }, t);
      if (sig !== prev) { lastChange = t; prev = sig; }
    }
    const cov = b.dur ? lastChange / b.dur : 0;
    const okR = r>=0.8 && r<=1.2, okC = cov>=0.7;
    if (b.ask) {
      console.log(`  ${b.id.padEnd(25)} |  —    |  —    | 随堂题(不适用, 引擎渲染)`);
      continue;
    }
    if (!okR) badR++;
    if (!okC) badC++;
    console.log(`  ${b.id.padEnd(25)} | ${r.toFixed(2)} ${okR?'✓':'✗'} | ${cov.toFixed(2)} ${okC?'✓':'✗'} | ${okR&&okC?'合格':'不合格'}`);
  }
  console.log(`→ 比值不达标 ${badR}, 覆盖不达标 ${badC} | JS错误: ${errors[0]||'无'}`);
  await browser.close();
})();
