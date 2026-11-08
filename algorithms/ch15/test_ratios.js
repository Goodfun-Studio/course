const fs = require('fs');
const vm = require('vm');

// Mock browser environment
global.window = global;
global.document = {
  createElement: () => ({ setAttribute: () => {}, appendChild: () => {} }),
  createElementNS: () => ({ setAttribute: () => {}, appendChild: () => {} }),
  body: { appendChild: () => {} }
};

// Load timings
const timingsContent = fs.readFileSync('audio/zh/timings.js', 'utf-8');
eval(timingsContent);
const TIMINGS = window.TIMINGS;

// Load and execute the chapter code
const html = fs.readFileSync('index.html', 'utf-8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
if (!scriptMatch) {
  console.error('Could not extract script');
  process.exit(1);
}

let scriptCode = scriptMatch[1];

// Mock the engine functions
const TW = [];
global.COL = { chalk: '#fff', dim: '#888' };
global.UNVISITED = '#95a5a6';
global.CURRENT = '#f39c12';
global.VISITED = '#2ecc71';
global.QUEUED = '#3498db';
global.PATH = '#e74c3c';

global.panel = () => ({ setAttribute: () => {} });
global.T = () => ({ setAttribute: () => {} });
global.mk = () => ({ setAttribute: () => {} });
global.hide = () => {};
global.out = undefined;

global.tw = function(el, props, t0, dur) {
  TW.push({ t0, dur: dur || 0 });
};

global.boot = () => {};

// Execute the script
try {
  eval(scriptCode);
} catch (e) {
  console.error('Error executing script:', e.message);
}

// Analyze each beat
const beatsToCheck = [
  'intro', 'bfs-concept', 'queue-structure', 'algorithm-steps',
  'shortest-path', 'bfs-vs-dfs', 'level-order', 'applications',
  'variants', 'complexity', 'summary'
];

console.log('\nAnimation/Narration Ratio Analysis:\n');
console.log('Beat ID'.padEnd(20) + 'Narr(s)'.padEnd(10) + 'MaxAnim(s)'.padEnd(12) + 'Ratio'.padEnd(10) + 'Status');
console.log('='.repeat(70));

const results = [];

beatsToCheck.forEach(beatId => {
  const timing = TIMINGS[beatId];
  if (!timing) {
    console.log(`${beatId.padEnd(20)}MISSING`);
    return;
  }
  
  const beat = BEATS.find(b => b.id === beatId);
  if (!beat) {
    console.log(`${beatId.padEnd(20)}BEAT NOT FOUND`);
    return;
  }
  
  // Reset TW array
  TW.length = 0;
  
  // Create mock m function
  const m = (markName) => {
    return timing.marks[markName] || 0;
  };
  
  // Execute the beat function
  try {
    beat.run(m, timing.dur);
  } catch (e) {
    console.log(`${beatId.padEnd(20)}ERROR: ${e.message}`);
    return;
  }
  
  // Calculate max animation time
  let maxAnimTime = 0;
  TW.forEach(({ t0, dur }) => {
    const endTime = t0 + dur;
    if (endTime > maxAnimTime) maxAnimTime = endTime;
  });
  
  const ratio = maxAnimTime / timing.dur;
  const status = (ratio >= 0.8 && ratio <= 1.2) ? '✓ PASS' : '✗ FAIL';
  
  results.push({ beatId, narr: timing.dur, anim: maxAnimTime, ratio, pass: status.includes('PASS') });
  
  console.log(
    `${beatId.padEnd(20)}${timing.dur.toFixed(2).padEnd(10)}` +
    `${maxAnimTime.toFixed(2).padEnd(12)}${ratio.toFixed(2).padEnd(10)}${status}`
  );
});

console.log('='.repeat(70));

const passCount = results.filter(r => r.pass).length;
const totalCount = results.length;

console.log(`\nPassed: ${passCount}/${totalCount}\n`);

process.exit(passCount === totalCount ? 0 : 1);
