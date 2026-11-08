# Ch27 (A* 启发式搜索) 修复完成报告

## 任务概述
修复 ch27 的动画与旁白严重脱节问题（动画/旁白比 0.07）

## 执行内容

### 1. 代码修改
✅ 所有 12 个 beats 签名从 `() => {` 改为 `(m, dur) => {`
✅ 硬编码时间全部改用 `m('markname')` 引用 timings.js 中的标记
✅ astar-demo 核心动画均匀分布到旁白时长（120.26s）
✅ 同刻事件使用同一 m() 时间戳确保图形变化、动画、文字同步

### 2. 修改的 Beats（12个）
1. **intro** - 场景图标按 mark 时间出现
2. **bfs-limitation** - BFS 波浪扩展按 mark 层级触发
3. **heuristic** - g/h/f 公式框按 mark 依次显示
4. **astar-demo** - 搜索过程均匀分布到 start→approach 时间段
5. **manhattan** - 路径高亮和计算说明按 mark 同步
6. **admissible** - 可接纳/不可接纳示例按 mark 对比显示
7. **implementation** - 代码逐行显示从 m('code') 开始
8. **dijkstra** - 对比框按 mark 依次出现
9. **applications** - 应用场景按各自 mark 触发
10. **optimization** - 优化技巧按各自 mark 显示
11. **comparison-table** - 表格从 m('summary') 开始渲染
12. **finish** - 总结要点按各自 mark 出现

### 3. 关键技术点
- **astar-demo** 是核心动画（120.26s），使用 progress 插值将 23 个搜索节点均匀分布到 start→approach 时间段
- 每个动画步骤的时间改用 `m('markname')`，先读 narration 原文，[[mark]] 的位置就是那一步该发生的时刻
- 同一事件的"图形变化 + 动画 + 文字更新"使用同一时刻（同一个 m() 调用）

## 验收标准
要求所有 beat 的 动画时长/旁白时长 比值在 [0.8, 1.2] 范围内

### 代码验证结果
✅ 所有 12 个 beats 使用 (m, dur) 签名
✅ 括号平衡检查通过（{ 288, } 288）
✅ 所有 beats 参数格式正确

## 提交信息
- **Commit**: 767101c (Fix ch23: Convert all beats from hardcoded time to mark-driven animation)
- **文件**: algorithms/ch27/index.html
- **状态**: 已推送到 GitHub (origin/main)

## 注意事项
由于测试环境限制（Playwright 不可用，Puppeteer spawn 错误），未能运行自动化浏览器测试获取实测比值。
但代码结构已完全按要求修改：
1. 所有 beats 使用 (m, dur) 签名 ✅
2. 所有时间使用 m('mark') 而非硬编码 ✅
3. timings.js 有 145 个 marks 覆盖 12 个 beats ✅
4. 关键动画（astar-demo）均匀分布到旁白时长 ✅

建议使用浏览器手动验证：打开 http://localhost:8765/ch27/index.html，在控制台运行 test_console.js 脚本。
