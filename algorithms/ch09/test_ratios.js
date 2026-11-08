// Load the HTML file to test beat ratios
const fs = require('fs');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync('index.html', 'utf-8');
const dom = new JSDOM(html, { runScripts: 'dangerously', resources: 'usable' });

// Wait for scripts to load
setTimeout(() => {
  const window = dom.window;
  
  if (!window.BEATS || !window.TIMINGS) {
    console.error('BEATS or TIMINGS not loaded');
    process.exit(1);
  }
  
  console.log('Beat\t\t\tRatio');
  console.log('====\t\t\t=====');
  
  window.BEATS.forEach((beat, i) => {
    const beatId = beat.id;
    const timing = window.TIMINGS[beatId];
    
    if (!timing) {
      console.log(`${beatId}\t\t\tMISSING TIMING`);
      return;
    }
    
    // Simulate running the beat
    window.P = { i };
    window.TW = [];
    
    try {
      beat.run((mark) => timing.marks[mark] || 0, timing.dur);
      
      const maxTime = Math.max(0, ...window.TW.map(w => w.t0 + w.dur));
      const ratio = (maxTime / timing.dur).toFixed(2);
      
      console.log(`${beatId}\t\t${ratio}`);
    } catch (e) {
      console.log(`${beatId}\t\tERROR: ${e.message}`);
    }
  });
  
  process.exit(0);
}, 1000);
