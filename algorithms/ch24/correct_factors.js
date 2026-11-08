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

const TW_DUR = 0.6; // tw 默认 dur

const analysis = {
  "intro": { lastT0: 0.5 + 4 * 0.15 },  // = 1.1
  "network": { lastT0: 1.0 + 4 * 0.2 },  // = 1.8
  "maxflow": { lastT0: 1.0 },
  "residual": { lastT0: 1.5 },
  "augmenting": { lastT0: 0.5 + 5 * 0.2 },  // = 1.5
  "ford-fulkerson-demo": { lastT0: 13.5 }, // 特殊
  "implementation": { lastT0: 2.5 },
  "complexity": { lastT0: 1.7 },
  "mincut": { lastT0: 1.5 },
  "applications": { lastT0: 0.5 + 4 * 0.2 },  // = 1.3
  "variants": { lastT0: 1.5 },
  "summary": { lastT0: 0.5 + 5 * 0.2 }  // = 1.5
};

console.log("Correct Factor Calculation:");
console.log("formula: factor = (dur * 0.9 - TW_DUR) / lastT0");
console.log("=".repeat(80));

for (const [beat, dur] of Object.entries(timings)) {
  const { lastT0 } = analysis[beat];
  const target = dur * 0.9;
  const factor = (target - TW_DUR) / lastT0;
  const predictedEnd = lastT0 * factor + TW_DUR;
  const predictedRatio = predictedEnd / dur;
  
  console.log(`${beat}:`);
  console.log(`  dur: ${dur}s, target: ${target.toFixed(2)}s (90%)`);
  console.log(`  lastT0: ${lastT0.toFixed(2)}s`);
  console.log(`  factor: ${factor.toFixed(3)}`);
  console.log(`  predicted animEnd: ${predictedEnd.toFixed(2)}s`);
  console.log(`  predicted ratio: ${predictedRatio.toFixed(3)}`);
  console.log();
}
