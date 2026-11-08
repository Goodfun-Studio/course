# Ch23 修复 Round 3 完成报告

## 问题诊断

Round 2 所有 beat 的**比率测试**都通过了，但新增的**内容覆盖测试**发现：
- **tarjan-demo**: 内容覆盖 = 0.60 ✗（要求 ≥ 0.7）
- 旁白 dur = 149.8s，最后一次可见内容变化在 ~90s
- 后 60s 画面无变化

## 内容覆盖测试方法

每 0.5s 采样一次，记录所有可见元素的签名（文本+opacity+fill），找到最后一次签名变化的时刻：
```
coverage = lastChangeTime / duration
```

## Round 3 修复

### 1. tarjan-demo (覆盖 0.60 → 0.98)

**添加的内容**：
- `not-root2` (48.0s): 显示 "low[2]=0 ≠ dfn[2]=2"（不是根）
- `not-root5` (90.9s): 显示 "low[5]=3 ≠ dfn[5]=5"（不是根）
- `root3` (102.7s): 高亮显示 "low[3]=3 = dfn[3]=3 → 根！"
- `pop345` (109.2s): 添加 "SCC: {3,4,5}" 标签
- `root0` (121.1s): 高亮显示 "low[0]=0 = dfn[0]=0 → 根！"
- `pop012` (127.6s): 添加 "SCC: {0,1,2}" 标签
- `scc6` (138.5s): 添加详细的 root 条件和 "SCC: {6}" 标签
- `scc7` (143.3s): 添加详细的 root 条件和 "SCC: {7}" 标签
- `done` (146.5s): "Tarjan 算法完成！"
- `result` (149.8s): 最终总结，延伸到 dur*0.95

**效果**：最后内容变化从 ~90s 延伸到 ~147s

### 2. kosaraju-demo (覆盖 0.53 → 0.92)

**添加的内容**：
- `step1` (18.0s): "步骤 1: 原图 DFS"
- `done1` (67.5s): "第一次 DFS 完成"
- `step2` (70.6s): "步骤 2: 构建反向图"
- `reverse-edges` (74.1s): "所有边反向"
- `step3` (81.0s): "步骤 3: 反向图 DFS"，重置节点颜色
- `start7` (85.7s): "从f=8开始: 节点7"
- `scc7` (90.2s): "SCC: {7}" 标签
- `scc6` (96.1s): "次高f=7: 节点6" + "SCC: {6}"
- `visit012-rev` (100.2s): "访问 0,1,2"
- `scc012` (107.5s): "SCC: {0,1,2}"
- `visit345-rev` (112.2s): "访问 3,4,5"
- `scc345` (118.2s): "SCC: {3,4,5}"
- `done` (122.3s): "Kosaraju 算法完成！"
- `result` (133.3s): 最终总结，延伸到 dur*0.95

**效果**：最后内容变化从 ~71s 延伸到 ~122.5s

## 验收结果（标准B：比率 + 内容覆盖）

```
Beat                animEnd  dur      ratio  lastChg  coverage  Status
====                =======  ===      =====  =======  ========  ======
intro               40.72s   46.37s   0.88✓  40.50s   0.87✓     ✓
definition          55.12s   58.02s   0.95✓  53.50s   0.92✓     ✓
scc-concept         53.10s   55.90s   0.95✓  51.50s   0.92✓     ✓
kosaraju-overview   54.57s   57.44s   0.95✓  50.00s   0.87✓     ✓
kosaraju-demo       133.83s  133.33s  1.00✓  122.50s  0.92✓     ✓
kosaraju-impl       69.68s   73.35s   0.95✓  67.50s   0.92✓     ✓
tarjan-overview     59.22s   58.72s   1.01✓  47.00s   0.80✓     ✓
tarjan-demo         150.29s  149.79s  1.00✓  147.00s  0.98✓     ✓
tarjan-impl         85.66s   90.64s   0.95✓  85.50s   0.94✓     ✓
comparison          60.03s   63.19s   0.95✓  58.50s   0.93✓     ✓
applications        70.74s   70.24s   1.01✓  59.50s   0.85✓     ✓
condensation        87.92s   98.90s   0.89✓  87.50s   0.88✓     ✓
```

**✅ 12/12 beats 全部通过两项测试**
- **比率** `max(TW.t0+dur)/dur` ∈ [0.8, 1.2] ✓
- **内容覆盖** `lastChangeTime/dur` ≥ 0.7 ✓

## 三轮修复对比

| 指标 | Round 1 | Round 2 | Round 3 |
|------|---------|---------|---------|
| 验收指标 | 错误（P.end/dur） | 正确（max TW） | 正确 + 内容覆盖 |
| 通过 beat | 12/12 (假通过) | 12/12 ✓ | 12/12 ✓ |
| tarjan-demo 内容覆盖 | - | 0.60 ✗ | 0.98 ✓ |
| kosaraju-demo 内容覆盖 | - | 0.53 ✗ | 0.92 ✓ |

## Git 提交

**Commit**: 258d99f
**Message**: Fix ch23 Round 3: Improve content coverage for tarjan-demo and kosaraju-demo

## 总结

✅ 使用正确的验收指标（比率 + 内容覆盖）
✅ 修复 2 个内容覆盖不达标的 beat
✅ 利用所有 marks，添加有意义的逐步说明
✅ 12/12 beats 全部通过双重验收
✅ 无 JS 错误
✅ 已提交到本地 Git

---
报告生成时间：2026-11-09
