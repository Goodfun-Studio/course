// tw(e, to, t0, dur = .6, ease = io)
// 默认 dur 是 0.6，不是 0.5

const timings = {
  "intro": 12.58,
  "network": 13.32,
  "maxflow": 10.34,
  "residual": 13.85,
  "augmenting": 13.73,
  "ford-fulkerson-demo": 43.82,
  "implementation": 16.51,
  "complexity": 16.87,
  "mincut": 14.69,
  "applications": 15.22,
  "variants": 16.01,
  "summary": 17.62
};

const analysis = {
  "intro": { 
    lastT0: 0.5 + 4 * 0.15,  // = 1.1
    dur: 0.6,  // tw 默认 dur
    animEnd: 1.1 + 0.6  // = 1.7
  },
  "network": { 
    lastT0: 1.0 + 4 * 0.2,  // = 1.8
    dur: 0.6,
    animEnd: 1.8 + 0.6  // = 2.4
  },
  "maxflow": { 
    lastT0: 1.0,
    dur: 0.6,
    animEnd: 1.0 + 0.6  // = 1.6
  },
  "residual": { 
    lastT0: 1.5,
    dur: 0.6,
    animEnd: 1.5 + 0.6  // = 2.1
  },
  "augmenting": { 
    lastT0: 0.5 + 5 * 0.2,  // = 1.5
    dur: 0.6,
    animEnd: 1.5 + 0.6  // = 2.1
  },
  "ford-fulkerson-demo": { 
    // 特殊：最后一个 setTimeout 是 delay * 1000，delay = 1 + 3 + 3 + 3 + 3 = 13
    // 然后 tw(done, { o: 1 }, 0.5) 的 t0 是 0.5（相对于最后的 setTimeout）
    // 所以总 animEnd ≈ 13 + 0.5 + 0.6 = 14.1（但需要考虑 setTimeout 内部的 2000ms）
    animEnd: 13 + 2 + 0.5 + 0.6  // ≈ 16.1（但这个需要特殊分析）
  },
  "implementation": { 
    lastT0: 2.5,
    dur: 0.6,
    animEnd: 2.5 + 0.6  // = 3.1
  },
  "complexity": { 
    lastT0: 1.7,
    dur: 0.6,
    animEnd: 1.7 + 0.6  // = 2.3
  },
  "mincut": { 
    lastT0: 1.5,
    dur: 0.6,
    animEnd: 1.5 + 0.6  // = 2.1
  },
  "applications": { 
    lastT0: 0.5 + 4 * 0.2,  // = 1.3
    dur: 0.6,
    animEnd: 1.3 + 0.6  // = 1.9
  },
  "variants": { 
    lastT0: 1.5,
    dur: 0.6,
    animEnd: 1.5 + 0.6  // = 2.1
  },
  "summary": { 
    lastT0: 0.5 + 5 * 0.2,  // = 1.5
    dur: 0.6,
    animEnd: 1.5 + 0.6  // = 2.1
  }
};

console.log("Final Factor Calculation (tw dur = 0.6):");
console.log("=".repeat(80));
for (const [beat, dur] of Object.entries(timings)) {
  if (beat === 'ford-fulkerson-demo') continue; // 稍后特殊处理
  const { animEnd } = analysis[beat];
  const target = dur * 0.9;
  const factor = target / animEnd;
  console.log(`${beat}:`);
  console.log(`  dur: ${dur}s, target: ${target.toFixed(2)}s (90%)`);
  console.log(`  animEnd: ${animEnd.toFixed(2)}s`);
  console.log(`  factor: ${factor.toFixed(3)}`);
  console.log();
}
