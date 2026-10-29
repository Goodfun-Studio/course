#!/usr/bin/env node
/**
 * 动画质量检测工具
 * 检查 demo beat 是否满足动画演示标准
 */

const fs = require('fs');
const path = require('path');

function checkAnimationQuality(htmlPath) {
  if (!fs.existsSync(htmlPath)) {
    console.error(`❌ 文件不存在: ${htmlPath}`);
    process.exit(1);
  }
  
  const content = fs.readFileSync(htmlPath, 'utf-8');
  
  // 提取 BEATS 数组 - 更宽松的匹配
  const beatsMatch = content.match(/let\s+BEATS\s*=\s*\[([\s\S]*?)\n\];/);
  if (!beatsMatch) {
    console.error('❌ 未找到 BEATS 数组');
    process.exit(1);
  }
  
  const beatsCode = beatsMatch[1];
  
  // 按 ],\n\n[ 或 ],\n[ 分割各个 beat
  const beatBlocks = beatsCode.split(/\],\s*\n+(?=\[)/);
  
  let totalBeats = 0;
  let demoBeats = 0;
  let passedBeats = 0;
  const issues = [];
  
  beatBlocks.forEach(block => {
    // 提取 beat id 和 title
    const headerMatch = block.match(/\[['"]([^'"]+)['"],\s*['"]([^'"]+)['"]/);
    if (!headerMatch) return;
    
    const [, id, title] = headerMatch;
    totalBeats++;
    
    // 检查是否是 demo beat
    const isDemoBeat = id.includes('demo') || id.includes('演示') || 
                       title.includes('demo') || title.includes('演示') ||
                       title.includes('Demo');
    
    if (!isDemoBeat) return;
    
    demoBeats++;
    const beatIssues = [];
    
    // 1. 检查 tw() 调用次数（修改视觉属性的）
    const twMatches = block.match(/tw\([^,]+,\s*\{[^}]*(?:fill|stroke|opacity|x|y|s|r)[^}]*\}/g) || [];
    const twCount = twMatches.length;
    
    if (twCount < 8) {
      beatIssues.push(`只有 ${twCount} 次 tw() 调用修改视觉属性，期望至少 8 次`);
    }
    
    // 2. 检查颜色变化
    const colorPatterns = [
      'PRIMARY', 'SECONDARY', 'VISITED', 'UNVISITED', 'CURRENT',
      'EDGE_TRYING', 'EDGE_SELECTED', 'EDGE_REJECTED', 'EDGE_NEGATIVE',
      'INF_COLOR', 'CELL_CHECKING', 'CELL_UPDATED', 'CELL_FINAL',
      '#[0-9a-fA-F]{3,6}'
    ];
    
    const colorsUsed = new Set();
    colorPatterns.forEach(pattern => {
      const regex = new RegExp(pattern, 'g');
      const matches = block.match(regex);
      if (matches) {
        colorsUsed.add(pattern);
      }
    });
    
    if (colorsUsed.size < 3) {
      beatIssues.push(`只使用了 ${colorsUsed.size} 种颜色，期望至少 3 种`);
    }
    
    // 3. 检查动画时间跨度
    const timeMatches = block.match(/tw\([^,]+,[^,]+,\s*([\d.]+)/g) || [];
    const times = timeMatches.map(m => {
      const match = m.match(/([\d.]+)$/);
      return match ? parseFloat(match[1]) : 0;
    }).filter(t => t > 0);
    
    if (times.length > 0) {
      const minTime = Math.min(...times);
      const maxTime = Math.max(...times);
      const timeSpan = maxTime - minTime;
      
      if (timeSpan < 5) {
        beatIssues.push(`动画时间跨度只有 ${timeSpan.toFixed(1)}s，期望至少 5s`);
      }
    } else {
      beatIssues.push('未检测到时间参数');
    }
    
    // 4. 检查是否只有淡入淡出
    const hasRealAnimation = block.match(/\{\s*(fill|stroke|x|y|s|r)\s*:/);
    if (!hasRealAnimation && twCount < 3) {
      beatIssues.push('疑似只有淡入淡出动画，缺少实质性视觉变化');
    }
    
    // 汇总结果
    if (beatIssues.length === 0) {
      console.log(`✅ Beat "${id}" (${title}) 通过检测`);
      console.log(`   - tw() 调用: ${twCount} 次`);
      console.log(`   - 颜色种类: ${colorsUsed.size} 种`);
      if (times.length > 0) {
        console.log(`   - 时间跨度: ${(Math.max(...times) - Math.min(...times)).toFixed(1)}s`);
      }
      passedBeats++;
    } else {
      console.log(`❌ Beat "${id}" (${title}) 未通过检测:`);
      beatIssues.forEach(issue => console.log(`   - ${issue}`));
      issues.push({ id, title, issues: beatIssues });
    }
  });
  
  // 总结
  console.log('\n' + '='.repeat(60));
  console.log(`总计: ${totalBeats} 个 beat, ${demoBeats} 个 demo beat`);
  console.log(`通过: ${passedBeats}/${demoBeats}`);
  
  if (issues.length === 0) {
    console.log('\n✅ 所有动画演示 beat 均通过质量检测');
    process.exit(0);
  } else {
    console.log(`\n❌ ${issues.length} 个 beat 未通过检测`);
    process.exit(1);
  }
}

// 命令行入口
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('用法: node check-animation-quality.js <html文件路径>');
    process.exit(1);
  }
  
  checkAnimationQuality(args[0]);
}

module.exports = { checkAnimationQuality };
