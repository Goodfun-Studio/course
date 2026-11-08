#!/usr/bin/env node
/**
 * Test ch09 beat animation/narration ratios
 */
'use strict';

const fs = require('fs');
const path = require('path');

// Load timings
const timingsCode = fs.readFileSync(path.join(__dirname, 'audio/zh/timings.js'), 'utf-8');
let TIMINGS = {};
// Use indirect eval to avoid const issue
(function() { eval(timingsCode.replace('window.TIMINGS =', 'TIMINGS =')); }).call({ TIMINGS });
// Fallback: parse manually
if (Object.keys(TIMINGS).length === 0) {
  const match = timingsCode.match(/window\.TIMINGS\s*=\s*(\{[\s\S]+\})\s*;/);
  if (match) TIMINGS = JSON.parse(match[1]);
}

// Read HTML and extract script
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
const scriptStart = html.indexOf('<script>') + 8;
const scriptEnd = html.lastIndexOf('</script>');
const script = html.slice(scriptStart, scriptEnd);

// Replace window.TIMINGS ref and remove engine.js dependency
const patchedScript = script
  .replace(/window\.BEATS\s*=\s*BEATS;?/g, '')
  .replace(/boot\(\);?\n?/g, '')
  .replace(/^'use strict';\n/, '');

// We need to capture TW per-beat, so we'll use a global array that we reset each beat
// All of this runs in one eval scope to preserve closures

const wrapperCode = `
(function() {
  // === Engine mocks ===
  const COL = { chalk: '#fff', dim: '#aaa', body: '#111' };
  const out = null, io = null;
  
  // TW is a global that we'll swap for each beat test
  let _activeTW = [];
  
  const G = (parent, attrs) => {
    const g = { dataset: {}, style: {}, _cells: {}, _nodeElements: {}, _edgeElements: {} };
    g.setAttribute = () => {};
    return g;
  };
  const mk = (tag, attrs, parent) => {
    const el = { dataset: {}, style: {}, textContent: '' };
    el.setAttribute = () => {};
    return el;
  };
  const T = (parent, text, opts) => ({ textContent: text, setAttribute: () => {} });
  const tw = (el, props, t0, dur, ease) => { _activeTW.push({ t0: +(t0||0), dur: +(dur||0.5) }); };
  const prog = (fn, t0, dur) => { _activeTW.push({ t0: +(t0||0), dur: 0.01 }); };
  const panel = (n) => G();
  const boot = () => {};
  const leadIn = () => {};
  const P = { i: 0 };
  const SND = { len: {} };
  const HOLD = 0.6;
  
  ${patchedScript}
  
  return { BEATS, _activeTW: () => _activeTW, _resetTW: () => { _activeTW = []; } };
})()
`;

let exports_obj;
try {
  exports_obj = eval(wrapperCode);
} catch(e) {
  console.error('Wrapper eval error:', e.message);
  // Try to identify the line
  const lines = wrapperCode.split('\n');
  console.error('Around error...');
  process.exit(1);
}

const { BEATS, _activeTW, _resetTW } = exports_obj;

if (!BEATS || !Array.isArray(BEATS)) {
  console.error('Could not load BEATS');
  process.exit(1);
}

// Parse TIMINGS properly from the file
const timingsMatch = timingsCode.match(/window\.TIMINGS\s*=\s*(\{[\s\S]*\})\s*;?\s*$/);
if (timingsMatch) {
  try {
    TIMINGS = eval('(' + timingsMatch[1] + ')');
  } catch(e) { /* use existing */ }
}

console.log(`Loaded ${BEATS.length} beats`);
console.log('');
console.log('Beat ID              | AnimEnd(s)| Narr(s) | Ratio  | Status');
console.log('-'.repeat(68));

let allPass = true;

BEATS.forEach(beat => {
  const timing = TIMINGS[beat.id];
  if (!timing) {
    console.log(`${beat.id.padEnd(20)} | MISSING TIMING`);
    allPass = false;
    return;
  }

  _resetTW();

  const m_fn = (k, off) => {
    off = off || 0;
    if (!(k in timing.marks)) throw new Error(`${beat.id}: missing mark "${k}"`);
    return timing.marks[k] + off;
  };

  try {
    beat.run(m_fn, timing.dur);
  } catch(e) {
    console.log(`${beat.id.padEnd(20)} | ERROR: ${e.message}`);
    allPass = false;
    return;
  }

  const captured = _activeTW();
  if (captured.length === 0) {
    console.log(`${beat.id.padEnd(20)} | No tweens`);
    return;
  }

  const maxAnimEnd = Math.max(...captured.map(w => w.t0 + w.dur));
  const narrDur = timing.dur;
  const ratio = maxAnimEnd / narrDur;
  const status = (ratio >= 0.8 && ratio <= 1.2) ? '✅' : '❌';
  if (ratio < 0.8 || ratio > 1.2) allPass = false;

  console.log(`${beat.id.padEnd(20)} | ${maxAnimEnd.toFixed(2).padStart(9)} | ${narrDur.toFixed(2).padStart(7)} | ${ratio.toFixed(3)} | ${status}`);
});

console.log('');
console.log(allPass ? '✅ All beats PASS [0.8, 1.2]' : '❌ Some beats outside [0.8, 1.2]');
process.exit(allPass ? 0 : 1);
