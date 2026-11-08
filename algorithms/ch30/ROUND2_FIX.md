# Ch30 Round 2 修复报告

## 问题
第一轮修复后，11/12 beat 通过，唯独 `cross_calculation` beat：
- **比值 0.74** ✗ (要求 ≥ 0.8)
- 覆盖 0.75 ✓ 已达标

原因：最后一个元素在 `m('left')` = 33.03s 结束，而 dur = 45.22s，还有 12s 未使用。

## 修复方案

利用 cross_calculation beat 的 3 个未使用 marks：
- `keep`: 37.95s
- `discard`: 42.27s  
- `efficient`: 45.22s

在底部添加 3 个应用说明文字：
```javascript
// 应用说明（使用剩余 marks）
const keepNote = T(p, '左转保留点', { 
  x: 100, y: 450, size: 22, weight: 600, fill: HULL_COLOR, o: 0 
});
tw(keepNote, { o: 1 }, m('keep'));

const discardNote = T(p, '右转弹出栈', { 
  x: 300, y: 450, size: 22, weight: 600, fill: START_COLOR, o: 0 
});
tw(discardNote, { o: 1 }, m('discard'));

const efficientNote = T(p, '高效判断转向', { 
  x: 500, y: 450, size: 22, weight: 600, fill: PURPLE, o: 0 
});
tw(efficientNote, { o: 1 }, m('efficient'));
```

## 验证结果

### 修复前
```
cross_calculation | 0.74 ✗ | 0.75 ✓ | 不合格
```

### 修复后
```
cross_calculation | 1.01 ✓ | 0.95 ✓ | 合格
```

### 全章验证
```
ch30 (标准B)  12 beats
beat                       | ratio | 覆盖  | 判定
  intro                     | 1.02 ✓ | 0.73 ✓ | 合格
  definition                | 1.02 ✓ | 0.90 ✓ | 合格
  algorithm                 | 1.01 ✓ | 0.95 ✓ | 合格
  cross_product             | 1.01 ✓ | 0.90 ✓ | 合格
  polar_sort                | 1.01 ✓ | 0.92 ✓ | 合格
  build_hull                | 1.01 ✓ | 0.85 ✓ | 合格
  implementation            | 1.01 ✓ | 0.95 ✓ | 合格
  cross_calculation         | 1.01 ✓ | 0.95 ✓ | 合格
  complexity                | 0.83 ✓ | 0.90 ✓ | 合格
  applications              | 0.84 ✓ | 0.85 ✓ | 合格
  variants                  | 1.01 ✓ | 0.95 ✓ | 合格
  summary                   | 1.02 ✓ | 0.93 ✓ | 合格
→ 比值不达标 0, 覆盖不达标 0 | JS错误: 无
```

✅ **12/12 beat 全部通过标准B验收**

## Git 提交

```
commit 320f4e9
fix: ch30 cross_calculation beat 添加尾部元素提升比值至 1.01
```

已推送到 GitHub main 分支。

## 总结

- **问题定位准确**：最后元素过早结束
- **修复方案简洁**：使用剩余 marks 添加 3 个说明文字
- **效果显著**：比值从 0.74 提升至 1.01，覆盖从 0.75 提升至 0.95
- **全章通过**：12 beat 双指标全部达标，无 JS 错误

---

**修复时间**：< 5 分钟
**验收标准**：标准B（比值 + 覆盖）
**状态**：✅ 全部通过
