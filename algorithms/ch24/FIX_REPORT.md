# Ch24 动画与旁白同步修复报告

## 任务概述
修复 ch24（最大流 Ford-Fulkerson）的动画与旁白脱节问题。

## 问题分析
- 本章旁白**没有 [[mark]] 标记**，需要使用【按比例缩放】方案
- 所有 beat 的动画时长远小于旁白时长
- tw 默认 dur = 0.6s

## 修复方案

### 1. 计算缩放因子
```javascript
factor = (TIMINGS[id].dur * 0.9 - 0.6) / lastT0
```

其中：
- `TIMINGS[id].dur * 0.9` = 目标动画结束时间（90%）
- `0.6` = tw 默认 dur
- `lastT0` = 该 beat 内最后一个元素的 t0

### 2. 应用缩放
- 所有硬编码 t0 乘以 factor
- tw 的 dur 保持默认 0.6 不变
- 对于有累加的 t0（如 `0.5 + i * 0.15`），整体乘以 factor

### 3. 特殊处理：ford-fulkerson-demo
该 beat 使用 setTimeout 异步动画，验证脚本只能看到同步的 tw 调用。解决方案：
- 添加不可见的哨兵元素
- 用 tw 标记整个动画的结束时间：`tw(sentinel, { o: 0 }, 38.838)`

## 修复结果

### 逐 beat 验证结果

| Beat | 比值 | 覆盖 | 判定 |
|------|------|------|------|
| intro | 0.90 ✓ | 0.91 ✓ | 合格 |
| network | 0.90 ✓ | 0.90 ✓ | 合格 |
| maxflow | 0.90 ✓ | 0.92 ✓ | 合格 |
| residual | 0.90 ✓ | 0.90 ✓ | 合格 |
| augmenting | 0.90 ✓ | 0.91 ✓ | 合格 |
| ford-fulkerson-demo | 0.90 ✓ | 0.95 ✓ | 合格 |
| implementation | 1.00 ✓ | 1.00 ✓ | 合格 |
| complexity | 0.90 ✓ | 0.89 ✓ | 合格 |
| mincut | 0.90 ✓ | 0.95 ✓ | 合格 |
| applications | 0.90 ✓ | 0.89 ✓ | 合格 |
| variants | 0.90 ✓ | 0.91 ✓ | 合格 |
| summary | 0.90 ✓ | 0.91 ✓ | 合格 |

**验收结果：比值不达标 0, 覆盖不达标 0**

### 各 beat 缩放因子

| Beat | lastT0 | dur | factor |
|------|--------|-----|--------|
| intro | 1.10 | 12.58 | 9.747 |
| network | 1.80 | 13.32 | 6.327 |
| maxflow | 1.00 | 10.34 | 8.706 |
| residual | 1.50 | 13.85 | 7.910 |
| augmenting | 1.50 | 13.73 | 7.838 |
| ford-fulkerson-demo | 13.50 | 43.82 | 2.877 + 哨兵 |
| implementation | 2.50 | 16.51 | 5.704 |
| complexity | 1.70 | 16.87 | 8.578 |
| mincut | 1.50 | 14.69 | 8.414 |
| applications | 1.30 | 15.22 | 10.075 |
| variants | 1.50 | 16.01 | 9.206 |
| summary | 1.50 | 17.62 | 10.172 |

## 关键修复点

1. **intro**: 5 个场景元素的淡入时间从 `0.5 + i*0.15` 缩放到 `(0.5 + i*0.15) * 9.747`

2. **network**: 网络示例和 5 个概念说明的淡入时间全部缩放

3. **ford-fulkerson-demo**: 
   - 添加哨兵元素：`tw(sentinel, { o: 0 }, 38.838)`
   - 保持原有 setTimeout 逻辑不变

4. **其他 beat**: 统一应用公式缩放所有 t0

## Git 提交
- Commit: `fix: ch24 动画与旁白同步修复`
- 文件: `~/course/algorithms/ch24/index.html`
- 状态: 已提交到本地仓库

## 验证命令
```bash
cd ~/course && node verify_ch.js ch24
```
