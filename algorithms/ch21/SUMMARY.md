# 第21章：字典树（Trie）

## 课程信息
- **时长**: 10.8分钟（649.8秒）
- **Beats数量**: 14个
- **测试通过率**: 11/11 (100%)

## 核心内容

### 1. 问题引入 (intro)
- 搜索引擎自动补全
- 拼写检查与纠错
- IP 路由表查找
- 词频统计与分析

### 2. 字典树结构 (structure)
- 树形结构，每条边代表一个字符
- 节点属性：children 映射 + isEnd 标记
- 共享公共前缀，节省空间
- 演示存储 "apple" 和 "app"

### 3. 三个核心操作 (operations)
- **insert(word)**: 插入单词，标记结尾
- **search(word)**: 查找单词，检查 isEnd
- **startsWith(prefix)**: 前缀匹配

### 4. 插入操作演示 (insert-demo) ⭐
- **动画规格**: 41次tw，最长12秒
- 依次插入: apple, app, application, apply, banana
- 展示路径共享和树的生长过程
- 5种颜色标记不同分支

### 5. 搜索操作演示 (search-demo) ⭐
- **动画规格**: 46次tw，最长11秒
- 搜索 "apple" - 成功（isEnd = true）
- 搜索 "appl" - 失败（isEnd = false）
- 搜索 "orange" - 失败（路径不存在）
- 前缀搜索 "app" - 成功

### 6. 代码实现 (implementation)
- TrieNode 类：children + isEnd
- Trie 类：insert, search, startsWith
- 不到40行代码，逻辑清晰

### 7. 复杂度分析 (complexity)
- **时间复杂度**: O(m)，m为字符串长度
- **空间复杂度**: O(n × m)，实际共享前缀更优
- 所有操作都是线性时间

### 8. 空间优化 (optimization)
- 压缩字典树（Radix Tree）
- 压缩单子节点路径
- 数组 vs 哈希表存储子节点

### 9. 自动补全应用 (autocomplete)
- 找到前缀节点
- DFS 遍历子树
- 收集所有单词结尾
- 时间：O(m + k)

### 10. 拼写检查应用 (spellcheck)
- 基于编辑距离
- DFS + 剪枝优化
- 允许插入、删除、替换

### 11. 更多应用场景 (applications)
- IP 路由表：压缩Trie存储IP前缀
- 词频统计：节点记录出现次数
- 敏感词过滤：AC自动机多模式匹配
- DNA序列分析

### 12. Trie vs 哈希表 (comparison)
| 特性 | 哈希表 | 字典树 |
|------|--------|--------|
| 查找时间 | O(1) 平均 | O(m) |
| 前缀搜索 | ✗ 不支持 | ✓ O(m) |
| 有序输出 | ✗ 无序 | ✓ 字典序 |
| 空间占用 | 存完整串 | 共享前缀 |
| 哈希冲突 | 可能冲突 | 无冲突 |

### 13. 高级变体 (variants)
- **后缀树**: O(m)时间查找任意子串
- **三向字典树**: 每节点最多3个子节点，省空间
- **AC自动机**: Trie + 失败指针，多模式匹配

### 14. 总结 (finish)
- 树形结构，边代表字符，共享前缀
- 三个核心操作，时间O(m)
- 擅长前缀匹配、自动补全、拼写检查
- 多种变体适应不同场景

## 技术规范达成

✅ **panel(0) 和函数签名**: 所有 beat 使用 `() => { const p = panel(0); }`  
✅ **timings.js 格式**: `{ audio: 'beat-id', marks: {...} }`  
✅ **文字间距**: ≥60px，避免重叠  
✅ **颜色方案**: 7种颜色（蓝、红、橙、绿、紫、深灰、浅灰）  
✅ **boot() 初始化**: 背景矩形初始化  
✅ **动画标准**: 插入41次tw/12秒，搜索46次tw/11秒  

## 文件清单

```
ch21/
├── index.html (26KB)
├── narration.zh.json (9.6KB)
├── generate_audio.py
├── generate_timings.py
└── audio/zh/
    ├── timings.js
    ├── intro.mp3 (33.04s)
    ├── structure.mp3 (44.96s)
    ├── operations.mp3 (48.01s)
    ├── insert-demo.mp3 (71.13s)
    ├── search-demo.mp3 (56.08s)
    ├── implementation.mp3 (64.24s)
    ├── complexity.mp3 (43.68s)
    ├── optimization.mp3 (49.42s)
    ├── autocomplete.mp3 (38.56s)
    ├── spellcheck.mp3 (44.25s)
    ├── applications.mp3 (32.08s)
    ├── comparison.mp3 (42.42s)
    ├── variants.mp3 (37.12s)
    └── finish.mp3 (44.80s)
```

## 质量保证

- ✅ 所有 Playwright 测试通过 (11/11)
- ✅ 动画帧数和时长符合规范
- ✅ 代码结构清晰，注释完整
- ✅ 音频生成成功，时间标记准确
- ✅ Git 提交完成

## 课程亮点

1. **双核心动画**: 插入和搜索过程完整展示，超过规范要求
2. **实战应用**: 自动补全、拼写检查等真实场景
3. **对比分析**: 与哈希表对比，帮助选择合适数据结构
4. **进阶内容**: 后缀树、AC自动机等高级变体预告
5. **视觉设计**: 7种颜色区分不同状态，红色节点标记单词结尾

---

**课程状态**: ✅ 已完成并提交
**下一步**: 等待 GitHub 连接恢复后推送
