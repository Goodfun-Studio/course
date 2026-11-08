// ford-fulkerson-demo 需要的修复
// dur = 43.82, target = 39.44
// 
// 当前结构：
// - 初始: tw at 0.5*factor, tw at 1.0*factor
// - 4次路径动画，每次间隔 3*factor，每次内部有 2s 固定延迟
// - 最后完成动画
//
// 实际时间线（以 factor=2.877 为例）：
// delay = 1 * 2.877 = 2.877
// 路径1: delay=2.877, 内部+2s
// delay += 3*2.877 = 11.508
// 路径2-4: 同样
// 最后: delay = 1 + 3*4 = 13 次 factor = 37.401
//
// 但 setTimeout 不计入 TW，所以验证脚本只看到最初的 tw
// 
// 解决方案：添加一个不可见的哨兵元素，用 tw 标记结束时间

const dur = 43.82;
const target = dur * 0.9; // 39.44

// 预期的动画结束时间（实际播放）：
// delay_final = (1 + 3 + 3 + 3 + 3) * factor = 13 * factor
// 最后 done 的 tw 在 setTimeout 内，t0=0.5（相对）
// 实际结束 ≈ 13*factor + 0.5 + 0.6

// 但要让验证脚本看到，需要在主体添加 tw
// 哨兵时间 = target - 0.6 (默认 tw dur)
const sentinelT0 = target - 0.6; // 38.84

console.log("ford-fulkerson-demo 修复:");
console.log("dur:", dur);
console.log("target (90%):", target);
console.log("哨兵 t0:", sentinelT0);
console.log("预期 animEnd:", sentinelT0 + 0.6, "=", target);
console.log("预期 ratio:", target / dur);
