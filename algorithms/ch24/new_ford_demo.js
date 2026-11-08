// 新的 ford-fulkerson-demo 实现
// 使用渐进式动画，不依赖 setTimeout

const factor = 1.895;
let t = 0.5;

const steps = [
  // 1-2: 开场 + 初始状态
  { t: t, action: "标题淡入", desc: "来看完整的演示" },
  { t: t += 1.0, action: "网络出现", desc: "初始流量全部为零" },
  
  // 3-7: 第一次增广
  { t: t += 1.0, action: "提示：第一次增广", desc: "第一次增广" },
  { t: t += 1.0, action: "高亮路径 S→A→D→T", desc: "找到路径S到A到D到T" },
  { t: t += 1.0, action: "显示瓶颈=3", desc: "瓶颈容量是三" },
  { t: t += 1.0, action: "更新流量标签", desc: "沿路径增加流量三" },
  { t: t += 1.0, action: "显示残余网络提示", desc: "更新残余网络" },
  
  // 8-11: 第二次增广
  { t: t += 1.0, action: "提示：第二次增广", desc: "第二次增广" },
  { t: t += 1.0, action: "高亮路径 S→B→D→T", desc: "找到路径S到B到D到T" },
  { t: t += 1.0, action: "显示瓶颈=2", desc: "瓶颈容量是二" },
  { t: t += 1.0, action: "更新流量标签", desc: "增加流量二" },
  
  // 12-15: 第三次增广
  { t: t += 1.0, action: "提示：第三次增广", desc: "第三次增广" },
  { t: t += 1.0, action: "高亮路径 S→A→C→T", desc: "找到路径S到A到C到T" },
  { t: t += 1.0, action: "显示瓶颈=4", desc: "瓶颈是四" },
  { t: t += 1.0, action: "更新流量标签", desc: "增加流量四" },
  
  // 16-19: 第四次增广
  { t: t += 1.0, action: "提示：第四次增广", desc: "第四次增广" },
  { t: t += 1.0, action: "高亮路径 S→B→C→T", desc: "找到路径S到B到C到T" },
  { t: t += 1.0, action: "显示瓶颈=1", desc: "瓶颈是一" },
  { t: t += 1.0, action: "更新流量标签", desc: "增加流量一" },
  
  // 20-22: 结束
  { t: t += 1.0, action: "显示：无增广路径", desc: "现在找不到增广路径了" },
  { t: t += 1.0, action: "显示：算法结束", desc: "算法结束" },
  { t: t += 1.0, action: "显示总流量", desc: "总流量是十" }
];

console.log("动画步骤：");
steps.forEach((step, i) => {
  console.log(`${i+1}. t=${(step.t * factor).toFixed(2)}s: ${step.action} (${step.desc})`);
});

console.log("\nfactor:", factor);
console.log("lastT0:", t);
console.log("animEnd:", (t * factor + 0.6).toFixed(2));
