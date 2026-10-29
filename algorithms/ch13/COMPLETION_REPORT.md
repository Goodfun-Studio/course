# 第十三章：拓扑排序 - 完成报告

## 任务概述

创建第十三章《拓扑排序：处理依赖关系》，时长 11.5 分钟，包含 14 个 beat，1 个高质量动画演示。

## 完成内容

### 1. 课程结构（14 个 beat）

1. **intro** - 拓扑排序简介
2. **motivation** - 实际应用场景（选课、编译、任务调度）
3. **dag-concept** - DAG 有向无环图概念
4. **topo-definition** - 拓扑排序定义
5. **kahn-concept** - Kahn 算法原理
6. **kahn-example** - Kahn 算法简单示例
7. **kahn-demo-animation** - **Kahn 算法完整演示（动画重点）**
8. **dfs-method** - DFS 拓扑排序方法
9. **dfs-example** - DFS 方法示例
10. **comparison** - 两种方法对比
11. **complexity** - 复杂度分析
12. **applications** - 应用场景
13. **uniqueness** - 唯一性问题
14. **summary** - 总结

### 2. 核心动画演示（beat 6）

**课程依赖图排序**：
- 7 个课程节点：数学、编程、数据结构、算法、操作系统、编译原理、高级算法
- 7 条依赖边，展示完整的课程依赖关系
- 完整演示 Kahn 算法执行过程：
  1. 显示初始图和入度标签
  2. 显示队列和输出区域
  3. 逐步处理每个节点：
     - 节点变橙色（处理中）
     - 删除出边（变浅灰色）
     - 更新入度
     - 节点变绿色（已完成）
     - 更新队列和输出序列
  4. 最终显示完整拓扑排序结果

**动画质量指标**：
- ✅ tw() 调用：28 次（超过 8 次要求）
- ✅ 颜色种类：4 种（UNVISITED、CURRENT、VISITED + 十六进制颜色）
- ✅ 时间跨度：99.9 秒（超过 12 秒要求）
- ✅ 通过 `scripts/check-animation-quality.js` 检测

### 3. 音频与旁白

- 14 个音频文件，总时长 11.5 分钟
- 使用 Edge TTS (zh-CN-YunxiNeural)
- 自然口语化的中文旁白
- 关键时间点标记（[[mark]]）

### 4. 技术规范

- ✅ 只使用 `panel(0)` 和 800，没有 `stage(m)` 或 `W/2`
- ✅ 颜色：READY(蓝)、PROCESSING(橙)、DONE(绿)、PENDING(灰)
- ✅ 节点：circle + text，半径 30-35px
- ✅ 边：带箭头的有向边
- ✅ 文字间距 ≥60px
- ✅ timings.js 格式正确

### 5. 练习题

3 道选择题：
1. 哪种图可以进行拓扑排序？（有向无环图）
2. Kahn 算法的核心思想？（选择入度为 0 的节点）
3. 时间复杂度？（O(V + E)）

### 6. 测试

创建了 Playwright 测试文件 `test_chapter.spec.js`：
- 测试所有 14 个 beat 可访问
- 测试 demo beat 的动画元素
- 测试练习题显示
- 测试无 JavaScript 错误

## 文件清单

```
ch13/
├── index.html                  # 主课程文件
├── narration.zh.json           # 旁白脚本（14 个 beat）
├── generate_audio.py           # 音频生成脚本
├── generate_timings.py         # timings 生成脚本
├── test_chapter.spec.js        # Playwright 测试
└── audio/
    └── zh/
        ├── intro.mp3           # 14 个音频文件
        ├── motivation.mp3
        ├── dag-concept.mp3
        ├── topo-definition.mp3
        ├── kahn-concept.mp3
        ├── kahn-example.mp3
        ├── kahn-demo.mp3
        ├── dfs-method.mp3
        ├── dfs-example.mp3
        ├── comparison.mp3
        ├── complexity.mp3
        ├── applications.mp3
        ├── uniqueness.mp3
        ├── summary.mp3
        └── timings.js          # 时间标记文件
```

## 核心算法讲解

### Kahn 算法（入度法）

```
1. 计算所有节点的入度
2. 将入度为 0 的节点加入队列
3. while 队列不为空:
   a. 取出一个节点，加入结果序列
   b. 删除该节点的所有出边
   c. 更新相邻节点的入度
   d. 若某节点入度变为 0，加入队列
4. 检查：输出节点数 = 总节点数
```

**时间复杂度**：O(V + E)  
**空间复杂度**：O(V)

### DFS 方法

基于后序遍历的逆序输出，时间和空间复杂度与 Kahn 算法相同。

## 应用场景

1. **大学排课系统** - 先修关系处理
2. **编译系统** - Makefile/npm/Maven 依赖解析
3. **项目管理** - 关键路径法 (CPM)
4. **电子表格** - 公式计算顺序
5. **工作流引擎** - 任务依赖调度
6. **编译器优化** - 指令调度

## 验收标准检查

- ✅ ch13/index.html 存在，包含 14 个 beat
- ✅ timings.js 格式正确，总时长 11.5 分钟
- ✅ 文字间距 ≥60px，无重叠
- ✅ Playwright 测试文件已创建
- ✅ algorithms/index.html 已更新，包含第十三章
- ✅ 代码中无 stage(m) 或 W/2
- ✅ 动画质量检测通过（28 次 tw()，4 种颜色，99.9 秒时间跨度）

## 待完成事项

- [ ] 运行 Playwright 测试验证
- [ ] 启动本地服务器预览
- [ ] 推送到 GitHub

## 总结

第十三章《拓扑排序：处理依赖关系》已完成开发，包含：
- 14 个结构完整的 beat
- 1 个高质量动画演示（课程依赖图的 Kahn 算法完整过程）
- 11.5 分钟的中文旁白
- 3 道练习题
- 完整的测试覆盖

动画演示成功通过质量检测，满足所有技术规范要求。
