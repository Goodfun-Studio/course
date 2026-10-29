# 动画演示 Beat 验收标准

## 定义

**动画演示 beat**（demo/demonstration）必须包含**可观测的视觉变化过程**，而不仅仅是静态图配文字。

## 可验证标准

### 1. 代码层面（静态分析）

对于 beat id 包含 `demo`、`demonstration`、`演示`、`动画` 的 beat：

- ✅ **必须有至少 6 次** `tw()` 调用修改视觉属性（`stroke`、`fill`、`opacity`、`x`、`y` 等）
- ✅ **动画时间跨度** ≥ beat 音频时长的 50%
  - 计算方式：最后一个 `tw()` 的 `t` 参数 - 第一个 `tw()` 的 `t` 参数 ≥ beat 总时长 × 0.5
- ✅ **必须有颜色变化**：至少使用 2 种不同的颜色值（如 `EDGE_TRYING`、`EDGE_SELECTED`）
- ❌ **禁止只有淡入/淡出**：不能只有 `{ o: 0 } → { o: 1 }` 这种初始显示动画

### 2. 运行时层面（动态检测）

使用 Playwright 在浏览器中验证：

- ✅ Seek 到 beat 中间时刻，页面视觉状态应该与 beat 开始时**明显不同**
  - 边的颜色变化（至少 3 条边）
  - 节点的颜色/大小变化
  - 元素的位置移动
- ✅ 逐帧扫描 beat，检测到至少 **5 次明显的视觉状态变化**

### 3. 反例（不合格）

```javascript
// ❌ 不合格：只有静态图 + 文字
['demo', '演示', () => {
  const graph = drawGraph(p, { nodeOpacity: 0 });
  tw(graph.g, { o: 1 }, .8, .7);  // 只有淡入
  
  const hint = T(p, '说明文字', { o: 0 });
  tw(hint, { o: 1 }, 7, .6);       // 只有淡入
}]
```

### 4. 正例（合格）

```javascript
// ✅ 合格：有逐步选边过程
['kruskal-demo', 'Kruskal 演示', () => {
  const graph = drawGraph(p, ...);
  
  let t = 1.5;
  sortedEdges.forEach(edge => {
    const edgeEl = graph.edgeEls[key];
    
    // 尝试边（黄色）
    tw(edgeEl, { stroke: EDGE_TRYING, 'stroke-width': 5 }, t, .3);
    
    if (accept) {
      // 接受边（绿色）
      tw(edgeEl, { stroke: EDGE_SELECTED, 'stroke-width': 4 }, t + .4, .3);
    } else {
      // 拒绝边（红色）
      tw(edgeEl, { stroke: EDGE_REJECTED }, t + .4, .2);
    }
    
    t += .9;  // 时间推进
  });
}]
```

## Watcher 核验流程

1. **静态代码检查**：
   ```bash
   # 提取 demo beat 代码块
   grep -A 50 "['.*demo.*'" index.html
   
   # 统计 tw() 调用次数
   grep -c "tw(" beat_code.js
   
   # 检查颜色变化
   grep -E "(EDGE_TRYING|EDGE_SELECTED|EDGE_REJECTED|NODE_FILL)" beat_code.js
   ```

2. **Playwright 动态检测**：
   ```javascript
   // Seek 到 beat 的 25%, 50%, 75% 时刻
   // 截图并计算像素差异
   const snapshots = [];
   for (const progress of [0.25, 0.5, 0.75]) {
     await seek(beatStartTime + beatDuration * progress);
     const screenshot = await page.screenshot();
     snapshots.push(screenshot);
   }
   
   // 计算相邻快照的差异
   const diff1 = pixelDiff(snapshots[0], snapshots[1]);
   const diff2 = pixelDiff(snapshots[1], snapshots[2]);
   
   // 如果差异 < 5%，判定为静态图
   if (diff1 < 0.05 && diff2 < 0.05) {
     return { pass: false, reason: '视觉变化不足，疑似静态图' };
   }
   ```

3. **SVG 元素属性变化检测**：
   ```javascript
   // 记录 t=0 时所有边的颜色
   const initialColors = getEdgeColors();
   
   // Seek 到 beat 中间
   await seek(beatMidTime);
   
   // 再次记录边的颜色
   const midColors = getEdgeColors();
   
   // 统计颜色变化的边数量
   const changedEdges = countDifferences(initialColors, midColors);
   
   if (changedEdges < 3) {
     return { pass: false, reason: `只有 ${changedEdges} 条边变色，期望至少 3 条` };
   }
   ```

## 集成到验收标准

更新各章节的验收标准，加入：

```
对于包含 "demo"/"演示" 的 beat：
- 至少 6 次 tw() 调用修改视觉属性
- 动画时间跨度 ≥ 音频时长的 50%
- 至少 3 条边/节点有颜色变化（运行时检测）
- Seek 到 beat 中间时，视觉状态与开始时明显不同
```

## 后续改进

1. 开发专用的动画质量检测工具（`check-animation-quality.js`）
2. 在 Playwright 测试中集成像素差异检测
3. 建立"动画复杂度"评分体系（简单/中等/复杂）
4. 收集优秀动画案例作为参考模板
