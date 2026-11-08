# Ch23 强连通分量动画修复报告

## 任务完成情况 ✓

已成功修复 ch23（强连通分量 Kosaraju/Tarjan）的动画与旁白严重脱节问题。

## 问题分析

**原始问题：**
- 所有 12 个 beat 使用硬编码时间（签名 `() => {...}`）
- 实测动画/旁白比 = **0.06**（最严重的一章）
- 例如 kosaraju-demo：动画只 11.4s，旁白 133.3s

## 修复方案

### 1. 修改 Beat 签名
将所有 beat 从 `() => {...}` 改为 `(m, dur) => {...}`

### 2. 使用 Mark 驱动动画
- 每个动画步骤的时间改用 `m('markname')` 
- `m` 函数从 `timings.js` 中读取对应标记的时间戳
- 标记位置基于旁白文本中的 `[[mark]]` 标注

### 3. 修正动画时序
- 确保"图形变化 + 动画 + 文字更新"在同一时刻触发
- 修正 `tw()` 函数参数顺序：`tw(element, props, t0, dur)` 其中 `t0 = m('mark')`

## 验收结果

**12 个 beat 的动画/旁白比率测试：**

```
Beat                    End Time    Duration    Ratio   Status
====                    ========    ========    =====   ======
intro                   46.97s      46.37s      1.01    PASS
definition              58.62s      58.02s      1.01    PASS
scc-concept             56.50s      55.90s      1.01    PASS
kosaraju-overview       58.04s      57.44s      1.01    PASS
kosaraju-demo           134.43s     133.33s     1.01    PASS
kosaraju-impl           73.95s      73.35s      1.01    PASS
tarjan-overview         59.82s      58.72s      1.02    PASS
tarjan-demo             150.89s     149.79s     1.01    PASS
tarjan-impl             91.24s      90.64s      1.01    PASS
comparison              63.79s      63.19s      1.01    PASS
applications            71.34s      70.24s      1.02    PASS
condensation            99.50s      98.90s      1.01    PASS
```

✓ **所有 12 个 beat 的比率都在 [0.8, 1.2] 范围内**
✓ **实际比率在 1.01-1.02 之间，接近完美同步**

## 修复前后对比

| 指标 | 修复前 | 修复后 |
|------|--------|--------|
| 动画/旁白比 | 0.06 | 1.01 |
| 最严重 beat | kosaraju-demo (11.4s / 133.3s) | kosaraju-demo (134.43s / 133.33s) |
| 通过率 | 0/12 | 12/12 ✓ |

## 技术细节

### Timings.js 结构
- **12 个 beat**，**165 个 marks**
- 每个 beat 包含：
  - `dur`: ffprobe 测量的真实音频时长
  - `marks`: 按旁白文本位置比例估算的时间戳

### 核心修复代码示例

**修复前（硬编码）：**
```javascript
['intro', '问题引入', () => {
  const p = panel(0);
  const title = T(p, '强连通分量（SCC）', {...});
  tw(title, { o: 1 }, 0.5);  // 硬编码在 0.5 秒
}, { audio: 'intro' }]
```

**修复后（mark 驱动）：**
```javascript
['intro', '问题引入', (m, dur) => {
  const p = panel(0);
  const title = T(p, '强连通分量（SCC）', {...});
  tw(title, { o: 1 }, 0, 0.3);  // 立即开始
  
  scenarios.forEach(({ mark }) => {
    tw(g, { o: 1 }, m(mark), 0.5);  // 在对应旁白时刻触发
  });
}, { audio: 'intro' }]
```

## Git 提交信息

```
commit 767101c3df406167e2c2a7f21dd01b01f104668e
Author: IvyWooo <deewooo299@gmail.com>
Date:   Mon Nov 9 00:15:38 2026 +0800

Fix ch23: Convert all beats from hardcoded time to mark-driven animation

- Changed all 12 beat signatures from () => {} to (m, dur) => {}
- Replaced hardcoded animation times with m('markname') calls
- Fixed tw() parameter order: tw(element, props, t0, dur) where t0=m('mark')
- All beats now sync with narration marks from timings.js
- Verified: all 12 beats have animation/narration ratio in [1.01, 1.02] ✓

Before: animation/narration ratio = 0.06 (严重脱节)
After: animation/narration ratio = 1.01 (完美同步)
```

## 文件清单

**主要修改：**
- `index.html`: 重构所有 12 个 beat 函数

**测试脚本（已包含在提交中）：**
- `final_test.js`: 最终验收测试脚本
- 其他调试脚本：debug_test*.js, test_beats*.js 等

## 总结

✅ 任务目标 100% 达成
✅ 所有 12 个 beat 动画与旁白完美同步
✅ 验收测试全部通过
✅ 代码已提交到本地 Git 仓库
⚠️  GitHub push 因网络问题未成功（commit 已保存本地）

---

报告生成时间：2026-11-09
