# 第30章：凸包算法（Graham Scan）

## 课程信息
- **章节编号**：30
- **标题**：凸包算法（Graham Scan）
- **时长**：12 分钟
- **Beat 数量**：12

## 课程概述
本章介绍计算几何中的经典算法——凸包算法（Graham Scan）。通过生动的可视化动画，展示如何用极角排序和栈操作在 O(n log n) 时间内求出平面点集的凸包。

## 核心内容

### 1. 问题引入 (intro)
- 围栏问题：最小围栏包含所有钉子
- 碰撞检测：简化形状边界
- 模式识别：提取轮廓特征
- GIS系统：计算覆盖范围
- 机器人路径：避障区域划分

### 2. 凸包定义 (definition)
- 包含所有点的最小凸多边形
- 凸多边形：无凹陷
- 橡皮筋类比
- 凸包顶点来自原始点集

### 3. Graham扫描算法 (algorithm)
三个核心步骤：
1. 找到最低点（y最小，y相同取x最小）
2. 按极角排序所有其他点
3. 用栈维护凸包顶点（左转保留，右转弹栈）

### 4. 叉积判断转向 (cross_product)
- 向量叉积：判断三点转向
- 叉积 > 0：逆时针（左转）
- 叉积 < 0：顺时针（右转）
- 叉积 = 0：共线
- 公式：(p₁ - p₀) × (p₂ - p₀) = (x₁-x₀)(y₂-y₀) - (y₁-y₀)(x₂-x₀)

### 5. 极角排序动画 (polar_sort) ⭐
**重点动画场景（≥20次补间，≥10秒）**
- 12个随机散点
- 找到最低点（红色标记）
- 计算每个点相对起点的极角
- 按极角排序并标注序号 1-11
- 射线可视化：显示从起点到各点的射线

动画细节：
- 点逐个显示（0.1秒间隔）
- 起点高亮放大
- 射线逐条绘制（分批显示）
- 序号逐个标注

### 6. 凸包构建动画 (build_hull) ⭐⭐
**核心动画场景（≥30次补间，≥15秒）**
- 栈可视化：左侧显示当前栈内容
- 逐点处理排序后的点
- 检查转向：叉积计算
- 右转时弹出栈顶（线条淡出）
- 左转时压入新点（线条显示）
- 最终闭合凸包

动画细节：
- 当前处理点高亮（橙色圆环）
- 栈内容实时更新
- 弹栈操作：标记 ✗ 并淡出
- 凸包边界逐条形成（绿色粗线）
- 处理完成后闭合多边形

### 7. 代码实现 (implementation)
完整的 Graham Scan 实现：
```javascript
function grahamScan(points) {
  // 1. 找最低点
  let p0 = points[0];
  for (let p of points) {
    if (p.y > p0.y || (p.y === p0.y && p.x < p0.x))
      p0 = p;
  }
  
  // 2. 极角排序
  const sorted = points
    .filter(p => p !== p0)
    .sort((a, b) => {
      const angle1 = Math.atan2(a.y - p0.y, a.x - p0.x);
      const angle2 = Math.atan2(b.y - p0.y, b.x - p0.x);
      return angle1 - angle2;
    });
  
  // 3. 栈维护凸包
  const stack = [p0, sorted[0]];
  for (let i = 1; i < sorted.length; i++) {
    while (stack.length >= 2) {
      const top = stack[stack.length - 1];
      const second = stack[stack.length - 2];
      if (crossProduct(second, top, sorted[i]) <= 0)
        stack.pop();
      else break;
    }
    stack.push(sorted[i]);
  }
  return stack;
}
```

### 8. 叉积的几何意义 (cross_calculation)
- 两个向量构成的平行四边形的有向面积
- 正值：v2 在 v1 的逆时针方向
- 负值：v2 在 v1 的顺时针方向
- 在凸包中用于判断点的位置关系

### 9. 复杂度分析 (complexity)
时间复杂度：
- 找最低点：O(n)
- 极角排序：O(n log n) ⭐ 主导
- 构建凸包：O(n)（每个点最多入栈、出栈各一次）
- **总体：O(n log n)**

空间复杂度：O(n)

### 10. 实际应用 (applications)
- 计算几何基础：旋转卡壳、最远点对
- 碰撞检测：简化复杂形状
- 模式识别：轮廓特征提取
- GIS系统：覆盖范围计算
- 机器人路径规划：避障区域划分

### 11. 其他凸包算法 (variants)
- **Jarvis March**（礼品包装）：O(n × h)，h 小时更优
- **QuickHull**：O(n log n) 平均，O(n²) 最坏
- **Chan's Algorithm**：O(n log h)，结合前两者优点
- **增量法**：用于三维凸包

### 12. 总结 (summary)
- 凸包：最小凸多边形
- Graham 扫描：极角排序 + 栈维护
- 叉积判断：左转保留，右转弹栈
- O(n log n) 由排序决定
- 计算几何的基石算法

## 技术实现

### 颜色方案
```javascript
POINT_COLOR = '#3498db'      // 蓝色（普通点）
START_COLOR = '#e74c3c'      // 红色（起点）
HULL_COLOR = '#2ecc71'       // 绿色（凸包点）
HIGHLIGHT = '#f39c12'        // 橙色（高亮）
PURPLE = '#9b59b6'           // 紫色
CYAN = '#1abc9c'             // 青色
STACK_COLOR = '#e67e22'      // 棕橙色（栈）
```

### 关键函数
- `drawPoint()`: 绘制点和标签
- `drawLine()`: 绘制线段
- `drawArrow()`: 绘制箭头
- `crossProduct()`: 计算叉积

### 动画规范
- 使用 `panel(0)` 和 `panel(800)` 管理面板
- 函数签名：`() => { const p = panel(0); }`
- marks 格式：`{ audio: 'beat-id', marks: {...} }`
- 文字间距 ≥60px
- 5+ 种颜色区分不同元素
- `boot()` 初始化

## 动画亮点
1. **极角排序可视化**：从起点到各点的射线，清晰展示极角概念
2. **栈操作动画**：左侧栈可视化，右侧凸包构建，双重展示
3. **叉积几何意义**：平行四边形面积，直观理解数学原理
4. **完整构建过程**：从空栈到闭合凸包，每一步都清晰可见

## 测试要点
- 极角排序动画流畅度（≥20次补间）
- 凸包构建动画完整性（≥30次补间）
- 栈操作可视化准确性
- 颜色区分清晰度
- 文字不重叠
- 最终凸包闭合正确

## 文件结构
```
ch30/
├── index.html              # 主课程文件
├── narration.zh.json       # 中文旁白脚本
├── generate_audio.py       # 音频生成脚本
├── generate_timings.py     # 时间标记生成脚本
├── SUMMARY.md             # 本文档
└── audio/
    └── zh/
        ├── timings.js     # 时间标记数据
        └── *.mp3          # 音频文件
```

## 课程特色
- 算法可视化：极角排序和栈操作双重展示
- 数学原理：叉积的几何意义直观呈现
- 实用性强：多个实际应用场景
- 代码完整：提供可运行的实现
- 对比分析：介绍其他凸包算法

## 适用对象
- 学习计算几何的学生
- 图形学开发者
- 算法竞赛选手
- 机器人工程师
- 对算法可视化感兴趣的开发者
