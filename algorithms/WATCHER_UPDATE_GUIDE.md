# Line-Watcher 核验能力升级指引

## 问题

之前 line-watcher 核验第七章时，`boruvka-demo` 和 `prim-demo` 两个 beat 只有静态图+文字，没有真正的动画演示，但 watcher 判定为合格。

**根因**：watcher 只检查了：
- ✅ 文件存在性
- ✅ JavaScript 语法错误
- ✅ 音频文件完整性
- ❌ **未检查动画质量**

## 解决方案

### 1. 新增工具

已创建 `scripts/check-animation-quality.js`，可检测：
- tw() 调用次数（至少 6 次）
- 颜色种类（至少 2 种）
- 动画时间跨度（至少 3 秒）
- 是否只有淡入淡出

### 2. 集成到 line-watcher

在 `line-watcher` 核验流程中，对包含 demo/演示 的 beat 增加检查：

```javascript
// 在 verify.js 或核验脚本中添加

const { execSync } = require('child_process');

function checkAnimationQuality(htmlFile) {
  try {
    // 调用动画质量检测脚本
    execSync(`node scripts/check-animation-quality.js ${htmlFile}`, {
      cwd: process.cwd(),
      stdio: 'pipe'
    });
    return { pass: true };
  } catch (error) {
    // 脚本退出码 1 = 检测失败
    const output = error.stdout?.toString() || error.message;
    return { 
      pass: false, 
      reason: '动画质量检测未通过',
      details: output 
    };
  }
}

// 在核验章节时调用
const animationCheck = checkAnimationQuality('algorithms/ch07/index.html');
if (!animationCheck.pass) {
  report.push({
    criterion: '动画演示 beat 质量',
    pass: false,
    evidence: animationCheck.details
  });
}
```

### 3. 更新验收标准

各章节验收标准增加一条：

```
对于包含 "demo"/"演示"/"动画" 的 beat：
- 通过 scripts/check-animation-quality.js 静态检测
- 至少 6 次 tw() 调用修改视觉属性
- 至少 2 种不同颜色表示状态变化
- 动画时间跨度 ≥ 3 秒
```

### 4. 示例：第七章验收标准（更新后）

```javascript
const acceptance = [
  "ch07/index.html 存在，包含至少 12 个 beat 标记",
  "ch07/audio/zh/ 目录下有 12 个 .mp3 文件且 timings.js 存在",
  "所有文本元素无视觉重叠（y 坐标间距 > 50px）",
  "Playwright 测试文件 tests/ch07.spec.js 存在且通过",
  "algorithms/index.html 包含第七章条目",
  "封面区域包含图算法/MST 相关元素",
  "浏览器打开 ch07/index.html 无 JS 错误",
  "已推送到 GitHub",
  // 新增 ↓
  "包含 demo 的 beat 通过动画质量检测（check-animation-quality.js）"
];
```

### 5. 后续增强（可选）

**阶段1**（已完成）：静态代码分析
- ✅ tw() 调用统计
- ✅ 颜色种类检查
- ✅ 时间跨度估算

**阶段2**（待实现）：运行时检测
- Playwright 截图对比
- SVG 属性变化追踪
- 像素差异检测

示例代码（Playwright）：
```javascript
// 在 beat 的 0%, 50%, 100% 时刻截图
const snapshots = [];
for (const progress of [0, 0.5, 1.0]) {
  await seek(beatStart + beatDuration * progress);
  await page.waitForTimeout(500);
  const screenshot = await page.screenshot();
  snapshots.push(screenshot);
}

// 计算像素差异
const diff1 = await compareImages(snapshots[0], snapshots[1]);
const diff2 = await compareImages(snapshots[1], snapshots[2]);

if (diff1 < 0.05 && diff2 < 0.05) {
  return {
    pass: false,
    reason: '视觉变化不足 (<5% 像素差异)，疑似静态图'
  };
}
```

## 测试验证

```bash
# 测试现有章节
node scripts/check-animation-quality.js algorithms/ch05/index.html
node scripts/check-animation-quality.js algorithms/ch06/index.html
node scripts/check-animation-quality.js algorithms/ch07/index.html

# 预期：ch07 全部通过，ch05/ch06 根据实际情况
```

## 回归测试

为避免未来再次遗漏，建议：

1. **Master 派活时明确要求**：
   ```
   prompt: "... 至少 1 个动画演示 beat，必须通过 scripts/check-animation-quality.js 检测"
   ```

2. **Watcher 核验前先自检**：
   ```bash
   # 在提交报告前运行
   node scripts/check-animation-quality.js algorithms/ch0X/index.html
   ```

3. **CI 集成**（可选）：
   ```yaml
   # .github/workflows/quality-check.yml
   - name: Check animation quality
     run: |
       for chapter in algorithms/ch*/index.html; do
         node scripts/check-animation-quality.js $chapter || exit 1
       done
   ```

## 参考文档

- `algorithms/ANIMATION_STANDARDS.md` - 完整标准定义
- `scripts/check-animation-quality.js` - 检测工具源码
