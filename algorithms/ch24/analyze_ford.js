// ford-fulkerson-demo 的时间结构
// 初始：tw(network.g, ..., 0.5 * factor) + tw(flowText, ..., 1.0 * factor)
// delay = 1 * factor
// 路径1: setTimeout(delay * 1000) -> 内部 setTimeout(2000) -> 操作
// delay += 3 * factor
// 路径2-4: 同样模式
// 最后: setTimeout(delay * 1000) -> tw(done, ..., 0.5)

// 当前 factor = 2.877
const factor = 2.877;
let delay = 1 * factor;
console.log("初始动画: 0.5 * factor =", 0.5 * factor, ", 1.0 * factor =", 1.0 * factor);
console.log("初始 delay =", delay);

// 路径1
console.log("\n路径1:");
console.log("  setTimeout at", delay, "s");
console.log("  内部 setTimeout 2s 后操作");
console.log("  实际动画时间: delay + 2 + 一些 tw 时间 ≈", delay + 2);
delay += 3 * factor;

// 路径2
console.log("\n路径2:");
console.log("  setTimeout at", delay, "s");
delay += 3 * factor;

// 路径3
console.log("\n路径3:");
console.log("  setTimeout at", delay, "s");
delay += 3 * factor;

// 路径4
console.log("\n路径4:");
console.log("  setTimeout at", delay, "s");
delay += 3 * factor;

// 完成
console.log("\n完成:");
console.log("  setTimeout at", delay, "s");
console.log("  tw(done, ..., 0.5) inside");
console.log("  实际 animEnd ≈", delay + 0.5, "+ 0.6 =", delay + 0.5 + 0.6);

console.log("\n但 setTimeout 是异步的，不在 TW 数组里！");
console.log("TW 只包含同步的 tw 调用，所以只看到:");
console.log("  - tw(network.g, ..., 0.5 * factor) =", 0.5 * factor);
console.log("  - tw(flowText, ..., 1.0 * factor) =", 1.0 * factor);
console.log("  - 其他都在 setTimeout 里，不计入");
console.log("\nmax TW t0 ≈", 1.0 * factor, "+ 0.6 =", 1.0 * factor + 0.6);
console.log("ratio =", (1.0 * factor + 0.6) / 43.82);

// 目标: dur = 43.82, target = 39.44
console.log("\n\n要修复，需要在 setTimeout 外添加 tw 调用来标记时间!");
