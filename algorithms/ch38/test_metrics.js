const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// 读取 HTML
const html = fs.readFileSync('index.html', 'utf8');

// 创建 DOM 环境
const dom = new JSDOM(html, {
    runScripts: "dangerously",
    resources: "usable",
    beforeParse(window) {
        // Mock SVG 相关功能
        window.SVGElement = class {};
        window.requestAnimationFrame = (cb) => setTimeout(cb, 16);
    }
});

const window = dom.window;
const document = window.document;

// 等待脚本执行
setTimeout(() => {
    try {
        const TIMINGS = window.TIMINGS;
        const BEATS = window.BEATS;
        
        if (!TIMINGS || !BEATS) {
            console.error('❌ TIMINGS or BEATS not loaded');
            process.exit(1);
        }
        
        console.log('📊 Verification Report\n');
        console.log(`Total beats: ${BEATS.length}\n`);
        
        // 为每个 beat 计算指标
        for (const beat of BEATS) {
            const beatId = beat.id;
            const beatTitle = beat.title;
            const timing = TIMINGS[beatId];
            
            if (!timing) {
                console.log(`❌ ${beatId}: No timing data`);
                continue;
            }
            
            const dur = timing.dur;
            
            // 模拟执行 beat 来收集 TW
            window.TW = [];
            window.P = { panels: [] };
            
            // Mock 函数
            const mockFuncs = {
                panel: (t0) => {
                    const p = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                    window.P.panels.push(p);
                    return p;
                },
                G: (parent, attrs) => {
                    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                    return g;
                },
                T: (parent, text, attrs) => {
                    const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                    return t;
                },
                mk: (type, attrs, parent) => {
                    const el = document.createElementNS('http://www.w3.org/2000/svg', type);
                    return el;
                },
                tw: (elem, props, t0, duration) => {
                    window.TW.push({ elem, props, t0, dur: duration });
                },
                drawBitArray: () => document.createElementNS('http://www.w3.org/2000/svg', 'g'),
                drawHashFunction: () => document.createElementNS('http://www.w3.org/2000/svg', 'g'),
                drawArrow: () => document.createElementNS('http://www.w3.org/2000/svg', 'g')
            };
            
            // m 函数
            const m = (mark) => {
                if (!timing.marks[mark]) {
                    console.warn(`   ⚠️  Mark '${mark}' not found in ${beatId}`);
                    return 0;
                }
                return timing.marks[mark];
            };
            
            // 执行 beat
            try {
                beat.run(m, dur);
            } catch (e) {
                console.log(`❌ ${beatId} (${beatTitle}): Execution error - ${e.message}`);
                continue;
            }
            
            // 计算指标1：比值
            let maxTime = 0;
            for (const tw of window.TW) {
                const endTime = tw.t0 + (typeof tw.dur === 'number' ? tw.dur : 0);
                if (endTime > maxTime) {
                    maxTime = endTime;
                }
            }
            const ratio = maxTime / dur;
            
            // 计算指标2：覆盖率（简化版，采样最后一个动画时间）
            const lastAnimTime = maxTime;
            const coverage = lastAnimTime / dur;
            
            const ratioOK = ratio >= 0.8 && ratio <= 1.2 ? '✅' : '❌';
            const coverageOK = coverage >= 0.7 ? '✅' : '❌';
            
            console.log(`${beatId} (${beatTitle}):`);
            console.log(`  指标1 (比值): ${ratio.toFixed(3)} ${ratioOK} [0.8-1.2]`);
            console.log(`  指标2 (覆盖): ${coverage.toFixed(3)} ${coverageOK} [≥0.7]`);
            console.log(`  dur: ${dur.toFixed(2)}s, maxTime: ${maxTime.toFixed(2)}s`);
            console.log('');
        }
        
        process.exit(0);
    } catch (e) {
        console.error('Error:', e);
        process.exit(1);
    }
}, 1000);
