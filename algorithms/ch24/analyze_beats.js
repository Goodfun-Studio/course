// 分析每个 beat 的动画时长
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

// 估算每个 beat 的当前 animEnd
const analysis = {
  "intro": { animEnd: 1.6, desc: "标题0 + 5个场景(0.5+i*0.15, i=0-4) + tw_dur(0.5)" },
  "network": { animEnd: 2.3, desc: "标题0 + 网络0.5 + 5个概念(1.0+i*0.2, i=0-4) + tw_dur(0.5)" },
  "maxflow": { animEnd: 1.5, desc: "标题0 + definition(0.5) + example(1.0) + tw_dur(0.5)" },
  "residual": { animEnd: 2.0, desc: "标题0 + original(0.5) + residual(1.0) + note(1.5) + tw_dur(0.5)" },
  "augmenting": { animEnd: 2.0, desc: "标题0 + 6个概念(0.5+i*0.2, i=0-5) + tw_dur(0.5)" },
  "ford-fulkerson-demo": { animEnd: 13.5, desc: "初始1.0 + 路径1(delay=1+2s) + 路径2(+3s) + 路径3(+3s) + 路径4(+3s) + 完成(+0.5)" },
  "implementation": { animEnd: 3.2, desc: "标题0 + 代码(0.3+24*0.1=2.7) + note(2.5) + tw_dur(0.5)" },
  "complexity": { animEnd: 2.2, desc: "标题0 + 4个分析(0.5+3*0.3=1.4) + note(1.7) + tw_dur(0.5)" },
  "mincut": { animEnd: 2.0, desc: "标题0 + theorem(0.5) + example(1.0) + note(1.5) + tw_dur(0.5)" },
  "applications": { animEnd: 1.8, desc: "标题0 + 5个应用(0.5+4*0.2=1.3) + tw_dur(0.5)" },
  "variants": { animEnd: 2.0, desc: "标题0 + variant1(0.5) + variant2(1.0) + note(1.5) + tw_dur(0.5)" },
  "summary": { animEnd: 2.0, desc: "标题0 + 6个总结(0.5+5*0.2=1.5) + tw_dur(0.5)" }
};

console.log("Beat Analysis:");
console.log("=".repeat(80));
for (const [beat, dur] of Object.entries(timings)) {
  const { animEnd, desc } = analysis[beat];
  const factor = (dur * 0.9) / animEnd;
  const targetEnd = dur * 0.9;
  console.log(`${beat}:`);
  console.log(`  dur: ${dur}s, target: ${targetEnd.toFixed(2)}s (90%)`);
  console.log(`  current animEnd: ${animEnd}s`);
  console.log(`  factor: ${factor.toFixed(3)}`);
  console.log(`  desc: ${desc}`);
  console.log();
}
