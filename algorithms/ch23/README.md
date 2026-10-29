# 第二十三章：强连通分量（Strongly Connected Components）

## 概述
- **时长**: 12分钟
- **Beats**: 12个
- **核心算法**: Kosaraju算法、Tarjan算法

## 学习目标
1. 理解强连通的定义和强连通分量的概念
2. 掌握Kosaraju算法（两次DFS）
3. 掌握Tarjan算法（一次DFS）
4. 理解两种算法的对比和应用场景
5. 了解缩点和DAG的关系

## 核心内容
- **问题引入**: 网页链接、社交网络、循环依赖
- **强连通定义**: 等价关系的三个性质
- **Kosaraju算法**: 原图DFS + 反向图DFS
- **Tarjan算法**: DFS序号 + low值
- **应用**: 编译器优化、电路设计、社交网络分析、PageRank、垃圾回收
- **缩点**: SCC到DAG的转换

## 动画亮点
- **Kosaraju演示**: 完整展示两次DFS过程，包括完成时间记录和反向图识别
- **Tarjan演示**: 展示栈操作、low值更新和SCC根节点识别
- **缩点可视化**: 展示SCC到DAG的转换过程

## 技术特点
- 使用10种颜色区分不同的SCC和状态
- 动态展示栈操作和DFS过程
- 完整的算法代码实现展示
- 详细的复杂度分析

## 文件结构
```
ch23/
├── index.html           # 主课程文件
├── narration.zh.json    # 中文旁白脚本
├── generate_audio.py    # 音频生成脚本
├── audio/
│   └── zh/
│       └── timings.js   # 音频时间标记
└── README.md           # 本文件
```

## 使用方法
1. 在浏览器中打开 `index.html`
2. 课程会自动播放动画和旁白
3. 可以通过导航栏跳转到特定章节

## 测试
运行 Playwright 测试：
```bash
npx playwright test tests/ch23.spec.js
```

## 生成音频
```bash
cd ch23
python3 generate_audio.py
```

注意：需要配置TTS服务才能生成高质量音频。
