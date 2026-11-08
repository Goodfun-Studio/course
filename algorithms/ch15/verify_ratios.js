const fs = require('fs');

// Load the HTML file
const html = fs.readFileSync('index.html', 'utf-8');

// Load timings
const timingsContent = fs.readFileSync('audio/zh/timings.js', 'utf-8');
const timingsMatch = timingsContent.match(/window\.TIMINGS = (\{[\s\S]*?\});/);
const TIMINGS = JSON.parse(timingsMatch[1].replace(/\n/g, ''));

// Parse beats to extract animation timings
const beatsToCheck = [
  'intro', 'bfs-concept', 'queue-structure', 'algorithm-steps',
  'shortest-path', 'bfs-vs-dfs', 'level-order', 'applications',
  'variants', 'complexity', 'summary'
];

console.log('\nBeat Animation/Narration Ratio Check:\n');
console.log('Beat ID'.padEnd(20) + 'Narration(s)'.padEnd(15) + 'Marks'.padEnd(10) + 'Status');
console.log('='.repeat(65));

let allPass = true;

beatsToCheck.forEach(beatId => {
  const timing = TIMINGS[beatId];
  if (!timing) {
    console.log(`${beatId.padEnd(20)}MISSING`.padEnd(15) + 'FAIL');
    allPass = false;
    return;
  }
  
  const narrationDur = timing.dur;
  const markCount = Object.keys(timing.marks || {}).length;
  
  // Check if the beat uses (m, dur) signature
  const beatPattern = new RegExp(`\\['${beatId}'[^\\]]*?\\]\\s*,\\s*'[^']*'\\s*,\\s*\\((m, dur)\\) => \\{`, 'm');
  const usesMarkSignature = beatPattern.test(html);
  
  // Check if the beat actually calls m() function
  const beatCodeMatch = html.match(new RegExp(`\\['${beatId}'[^\\]]*?\\]\\s*,\\s*'[^']*'\\s*,\\s*\\([^)]*\\) => \\{[\\s\\S]*?(?=\\n\\['|\\n\\];)`, 'm'));
  const usesMarks = beatCodeMatch && beatCodeMatch[0].includes('m(\'') || beatCodeMatch && beatCodeMatch[0].includes('m("');
  
  const status = (usesMarkSignature && usesMarks) ? '✓ OK' : '✗ FAIL';
  if (!usesMarkSignature || !usesMarks) allPass = false;
  
  console.log(`${beatId.padEnd(20)}${narrationDur.toFixed(2).padEnd(15)}${markCount.toString().padEnd(10)}${status}`);
});

console.log('='.repeat(65));
console.log(allPass ? '\n✓ All 11 beats updated to use marks\n' : '\n✗ Some beats still need fixing\n');

process.exit(allPass ? 0 : 1);
