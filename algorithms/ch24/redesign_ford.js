// 重新设计 ford-fulkerson-demo
// 旁白 22 句，dur = 43.82s
// 需要覆盖到 dur * 0.7 = 30.67s

// 旁白结构：
// 1-2: 开场 + 初始状态
// 3-7: 第一次增广（5句）
// 8-11: 第二次增广（4句）
// 12-15: 第三次增广（4句）
// 16-19: 第四次增广（4句）
// 20-22: 结束（3句）

// 动画时间分配（均匀分布到 22 个关键帧）
const dur = 43.82;
const target = dur * 0.9; // 39.44
const numFrames = 22;

// 简化方案：每句话对应一个动画元素的出现/变化
// lastT0 应该在第 20 句左右（覆盖 > 0.7）
// 设计：0.5, 1.0, 1.5, 2.0, ... 21.5 (22个时间点)
const timeStep = 1.0; // 基础步长
const lastT0 = 0.5 + 20 * timeStep; // 20.5

const factor = (target - 0.6) / lastT0;

console.log("重新设计 ford-fulkerson-demo:");
console.log("dur:", dur);
console.log("target (90%):", target);
console.log("numFrames:", numFrames);
console.log("lastT0:", lastT0);
console.log("factor:", factor.toFixed(3));
console.log("predicted animEnd:", (lastT0 * factor + 0.6).toFixed(2));
console.log("predicted ratio:", ((lastT0 * factor + 0.6) / dur).toFixed(3));
console.log("predicted coverage (sentence 20):", ((0.5 + 19 * timeStep) * factor / dur).toFixed(3));
