#!/usr/bin/env node
/**
 * 动画质量检测工具
 * 检测 demo beat 是否真的包含动画，而不仅仅是静态图
 */

const fs = require('fs');
const path = require('path');

function checkAnimationQuality(htmlFile) {
  const content = fs.readFileSync(htmlFile, 'utf8');
  const results = [];
  
  // 提取所有 beat 定义
  const beatRegex = /\['([^']+)',\s*'([^']+)',\s*\(\)\s*=>\s*\{([^]*?)\}\]/g;
  let match;
  
  while ((match = beatRegex.exec(content)) !== null) {
    const [, id, title, code] = match;
    
    // 只检查包含 demo/演示/动画 的 beat
    if (!id.includes('demo') && !title.includes('演示') && !title.includes('动画')) {
      continue;
    }
    
    const result = {
      id,
      title,
      pass: true,
      issues: []
    };
    
    // 检查1：tw() 调用次数
    const twCalls = (code.match(/tw\(/g) || []).length;
    if (twCalls < 6) {
      result.pass = false;
      result.issues.push(`tw() 调用次数不足：${twCalls} < 6（期望至少6次视觉变化）`);
    }
    
    // 检查2：是否只有淡入淡出
    const onlyFadeIn = /tw\([^,]+,\s*\{\s*o:\s*1\s*\}/.test(code) && 
                       !/tw\([^,]+,\s*\{\s*(?:stroke|fill|x|y|s|r)/.test(code);
    if (onlyFadeIn) {
      result.pass = false;
      result.issues.push('只有淡入淡出动画（o: 0 → o: 1），缺少实质性视觉变化');
    }
    
    // 检查3：颜色变化
    const colorConstants = [
      'EDGE_TRYING', 'EDGE_SELECTED', 'EDGE_REJECTED',
      'NODE_FILL', 'PRIMARY', 'SORTED', 'LESS', 'GREATER'
    ];
    const usedColors = colorConstants.filter(c => code.includes(c));
    if (usedColors.length < 2) {
      result.pass = false;
      result.issues.push(`颜色种类不足：${usedColors.length} < 2（期望至少2种颜色表示状态变化）`);
    }
    
    // 检查4：时间跨度（简单估算）
    const timeMatches = code.match(/tw\([^,]+,[^,]+,\s*([\d.]+)/g) || [];
    const times = timeMatches.map(m => {
      const t = m.match(/([\d.]+)/);
      return t ? parseFloat(t[1]) : 0;
    });
    
    if (times.length > 0) {
      const minTime = Math.min(...times);
      const maxTime = Math.max(...times);
      const timeSpan = maxTime - minTime;
      
      if (timeSpan < 3) {
        result.pass = false;
        result.issues.push(`动画时间跨度不足：${timeSpan.toFixed(1)}s < 3s（期望至少3秒的动画过程）`);
      }
    }
    
    results.push(result);
  }
  
  return results;
}

// CLI 使用
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('用法: node check-animation-quality.js <chapter-html-file>');
    process.exit(1);
  }
  
  const htmlFile = args[0];
  if (!fs.existsSync(htmlFile)) {
    console.error(`文件不存在: ${htmlFile}`);
    process.exit(1);
  }
  
  const results = checkAnimationQuality(htmlFile);
  
  console.log(`\n=== 动画质量检测报告 ===\n`);
  
  let allPass = true;
  results.forEach(r => {
    const status = r.pass ? '✅' : '❌';
    console.log(`${status} [${r.id}] ${r.title}`);
    
    if (!r.pass) {
      allPass = false;
      r.issues.forEach(issue => {
        console.log(`   - ${issue}`);
      });
    }
    console.log('');
  });
  
  if (allPass) {
    console.log('✅ 所有动画 demo beat 均通过质量检测');
    process.exit(0);
  } else {
    console.log('❌ 部分动画 demo beat 未通过质量检测');
    process.exit(1);
  }
}

module.exports = { checkAnimationQuality };
