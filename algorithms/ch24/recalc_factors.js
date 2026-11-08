// 重新计算每个 beat 的正确 animEnd（包含 tw dur）
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

// 正确的 animEnd 计算（包括最后一个 tw 的 dur）
const analysis = {
  "intro": { 
    lastT0: 0.5 + 4 * 0.15,  // 最后一个场景
    twDur: 0.5,
    animEnd: 0.5 + 4 * 0.15 + 0.5  // = 1.6
  },
  "network": { 
    lastT0: 0.5 + 1.0 + 4 * 0.2,  // 最后一个概念
    twDur: 0.5,
    animEnd: 0.5 + 1.0 + 4 * 0.2 + 0.5  // = 2.8
  },
  "maxflow": { 
    lastT0: 1.0,  // example
    twDur: 0.5,
    animEnd: 1.0 + 0.5  // = 1.5
  },
  "residual": { 
    lastT0: 1.5,  // note
    twDur: 0.5,
    animEnd: 1.5 + 0.5  // = 2.0
  },
  "augmenting": { 
    lastT0: 0.5 + 5 * 0.2,  // 最后一个概念
    twDur: 0.5,
    animEnd: 0.5 + 5 * 0.2 + 0.5  // = 2.0
  },
  "ford-fulkerson-demo": { 
    lastT0: 1 + 3 + 3 + 3 + 3,  // delay 累加
    twDur: 0.5,
    animEnd: 13.5  // 特殊计算
  },
  "implementation": { 
    lastT0: 2.5,  // note
    twDur: 0.5,
    animEnd: 2.5 + 0.5  // = 3.0
  },
  "complexity": { 
    lastT0: 1.7,  // note
    twDur: 0.5,
    animEnd: 1.7 + 0.5  // = 2.2
  },
  "mincut": { 
    lastT0: 1.5,  // note
    twDur: 0.5,
    animEnd: 1.5 + 0.5  // = 2.0
  },
  "applications": { 
    lastT0: 0.5 + 4 * 0.2,  // 最后一个应用
    twDur: 0.5,
    animEnd: 0.5 + 4 * 0.2 + 0.5  // = 1.8
  },
  "variants": { 
    lastT0: 1.5,  // note
    twDur: 0.5,
    animEnd: 1.5 + 0.5  // = 2.0
  },
  "summary": { 
    lastT0: 0.5 + 5 * 0.2,  // 最后一个总结
    twDur: 0.5,
    animEnd: 0.5 + 5 * 0.2 + 0.5  // = 2.0
  }
};

console.log("Corrected Factor Calculation:");
console.log("=".repeat(80));
for (const [beat, dur] of Object.entries(timings)) {
  const { animEnd } = analysis[beat];
  const target = dur * 0.9;
  const factor = target / animEnd;
  console.log(`${beat}:`);
  console.log(`  dur: ${dur}s, target: ${target.toFixed(2)}s (90%)`);
  console.log(`  animEnd: ${animEnd.toFixed(2)}s`);
  console.log(`  factor: ${factor.toFixed(3)}`);
  console.log();
}
