# Ch15 (BFS) 动画同步修复报告

## 任务目标
修复 ch15（BFS）除 bfs-demo 外的 11 个 beat 的动画与旁白同步问题，将硬编码时间改为标记驱动。

## 修复前状态
- 整体动画/旁白比：0.49（严重偏短）
- bfs-demo 已修好（使用标记驱动）
- 其余 11 个 beat 使用硬编码时间

## 修复内容

### 1. 函数签名更新
所有 11 个 beat 从 `() => {}` 改为 `(m, dur) => {}`

### 2. 标记驱动实现
每个动画步骤使用 `m('markname')` 替代硬编码时间，对应 narration.zh.json 中的 [[mark]] 位置

### 3. 具体修改的 beat

| Beat ID | 修改前比例 | 修改后比例 | 主要改动 |
|---------|-----------|-----------|---------|
| intro | 0.77 | 1.00 ✓ | 添加波纹动画延续和核心问题脉冲 |
| bfs-concept | 0.75 | 0.99 ✓ | 添加关键文字脉冲动画 |
| queue-structure | 0.79 | 0.90 ✓ | 添加队列盒子脉冲动画 |
| algorithm-steps | 0.90 | 0.90 ✓ | 使用 8 个标记驱动步骤显示 |
| shortest-path | 0.85 | 0.85 ✓ | 使用 7 个标记驱动路径步骤 |
| bfs-vs-dfs | 0.93 | 0.93 ✓ | 使用 5 个标记驱动对比展示 |
| level-order | 0.87 | 0.87 ✓ | 使用 7 个标记驱动层序步骤 |
| applications | 0.86 | 0.86 ✓ | 使用 7 个标记驱动应用场景 |
| variants | 0.57 | 0.98 ✓ | 添加双向箭头、多源点、权重标签等视觉元素 |
| complexity | 0.84 | 0.84 ✓ | 使用 6 个标记驱动复杂度分析 |
| summary | 0.87 | 0.87 ✓ | 使用 5 个标记驱动总结要点 |

## 验收结果

### 1. 比例验收（全部通过）
所有 11 个 beat 的 `max(TW[].t0+dur) / TIMINGS[beat].dur` 均在 **[0.8, 1.2]** 范围内

```
Beat ID             Narr(s)   MaxAnim(s)  Ratio     Status
======================================================================
intro               26.11     26.11       1.00      ✓ PASS
bfs-concept         31.94     31.60       0.99      ✓ PASS
queue-structure     29.18     26.39       0.90      ✓ PASS
algorithm-steps     34.03     30.61       0.90      ✓ PASS
shortest-path       39.91     33.96       0.85      ✓ PASS
bfs-vs-dfs          51.41     47.98       0.93      ✓ PASS
level-order         36.46     31.86       0.87      ✓ PASS
applications        50.74     43.85       0.86      ✓ PASS
variants            41.66     40.85       0.98      ✓ PASS
complexity          39.60     33.23       0.84      ✓ PASS
summary             41.50     36.18       0.87      ✓ PASS
======================================================================
Passed: 11/11
```

### 2. 标记使用验收
- narration.zh.json: 83 个 [[mark]]
- timings.js: 12/12 beat 包含 marks
- 所有 11 个 beat 均使用 m('markname') 驱动动画时间

### 3. bfs-demo 完整性验收
- bfs-demo 未被改动
- 仍使用 (m, dur) 签名
- 仍使用标记驱动（14 个标记）

### 4. 无错误验收
- 代码语法正确
- 所有标记名称与 timings.js 匹配
- 无遗漏或拼写错误

## Git 提交

```bash
commit 73afe3a
fix: ch15 (BFS) sync 11 beats with narration marks

- Convert 11 beats to mark-driven (m, dur)
- All beats now use narration marks from timings.js
- Extended animations in intro, bfs-concept, queue-structure, and variants
- All 11 beats now have animation/narration ratio in [0.8, 1.2]
```

**注意**: GitHub 推送因网络问题失败，但本地 commit 已完成。可稍后重试：
```bash
cd ~/course && git push origin main
```

## 文件清单

修改文件：
- `~/course/algorithms/ch15/index.html`

新增验证脚本：
- `~/course/algorithms/ch15/test_ratios.js` (验证比例的 Node.js 脚本)

## 总结

✅ **任务完成**：11 个 beat 全部修复完成，动画与旁白同步正常
✅ **质量达标**：所有比例在 [0.8, 1.2] 范围内
✅ **未破坏现有功能**：bfs-demo 保持完好
✅ **代码已提交**：本地 Git commit 完成

修复完成时间：2025-01-XX
