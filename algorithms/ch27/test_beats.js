#!/usr/bin/env node
/**
 * 测试 Ch27 的动画/旁白比值
 */

const fs = require('fs');
const path = require('path');

// 读取 timings.js
const timingsPath = path.join(__dirname, 'audio/zh/timings.js');
const timingsCode = fs.readFileSync(timingsPath, 'utf-8');

// 执行获取 TIMINGS
let timings = {};
eval(timingsCode.replace('window.TIMINGS', 'timings'));

// 读取 index.html 并提取 beat 定义
const indexPath = path.join(__dirname, 'index.html');
const indexHtml = fs.readFileSync(indexPath, 'utf-8');

// 提取 BEATS 数组中的 beat id
const beatMatches = indexHtml.matchAll(/\['([^']+)',\s*'[^']*',\s*\(m,\s*dur\)\s*=>/g);
const beatIds = Array.from(beatMatches).map(m => m[1]);

console.log('Beat ID              | Anim (s) | Narr (s) | Ratio  | Status');
console.log('-'.repeat(70));

let allPass = true;

beatIds.forEach(beatId => {
    const timing = timings[beatId];
    
    if (!timing) {
        console.log(`${beatId.padEnd(20)} | ERROR: No timing found`);
        allPass = false;
        return;
    }
    
    // 提取该 beat 的代码块
    const beatRegex = new RegExp(`\\['${beatId}'[^\\[]*?\\(m,\\s*dur\\)\\s*=>\\s*\\{([\\s\\S]*?)^\\}\\],`, 'm');
    const match = indexHtml.match(beatRegex);
    
    if (!match) {
        console.log(`${beatId.padEnd(20)} | ERROR: Could not extract beat code`);
        allPass = false;
        return;
    }
    
    const beatCode = match[1];
    
    // 查找所有 tw(..., time) 调用
    const twMatches = beatCode.matchAll(/tw\([^,]+,\s*[^,]+,\s*([^,\)]+)(?:,\s*([^)]+))?\)/g);
    
    let maxTime = 0;
    
    for (const twMatch of twMatches) {
        const durationExpr = twMatch[1].trim();
        const delayExpr = twMatch[2] ? twMatch[2].trim() : '0';
        
        // 简单解析 - 假设是数字或 m('mark') 表达式
        let duration = 0;
        let delay = 0;
        
        if (durationExpr.match(/^[\d.]+$/)) {
            duration = parseFloat(durationExpr);
        } else {
            duration = 0.5; // 默认动画时长
        }
        
        if (delayExpr.match(/^[\d.]+$/)) {
            delay = parseFloat(delayExpr);
        } else if (delayExpr.startsWith('m(')) {
            // 提取 mark 名称
            const markMatch = delayExpr.match(/m\(['"]([^'"]+)['"]\)/);
            if (markMatch && timing.marks[markMatch[1]]) {
                delay = timing.marks[markMatch[1]];
            }
        }
        
        const endTime = delay + duration;
        if (endTime > maxTime) {
            maxTime = endTime;
        }
    }
    
    const narrationDur = timing.dur;
    const ratio = maxTime / narrationDur;
    const pass = ratio >= 0.8 && ratio <= 1.2;
    const status = pass ? '✅ PASS' : '❌ FAIL';
    
    console.log(`${beatId.padEnd(20)} | ${maxTime.toFixed(2).padStart(8)} | ${narrationDur.toFixed(2).padStart(8)} | ${ratio.toFixed(3).padStart(6)} | ${status}`);
    
    if (!pass) allPass = false;
});

console.log('\n' + '='.repeat(70));
if (allPass) {
    console.log('✅ 所有 beats 通过验收（比值在 [0.8, 1.2] 范围内）');
    process.exit(0);
} else {
    console.log('❌ 部分 beats 未通过验收');
    process.exit(1);
}
