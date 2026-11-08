#!/usr/bin/env node
/**
 * 测试 Ch27 的动画/旁白比值和覆盖率
 * 标准B：比值 [0.8, 1.2]，覆盖率 >= 0.7
 */

import puppeteer from 'puppeteer';

async function testBeats() {
    const browser = await puppeteer.launch({ 
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    // 加载页面
    await page.goto('http://localhost:8765/ch27/index.html', { 
        waitUntil: 'networkidle2',
        timeout: 30000
    });
    
    // 等待 BEATS 和 TIMINGS 加载
    await page.waitForFunction(() => window.BEATS && window.TIMINGS, { timeout: 10000 });
    
    // 执行测试
    const results = await page.evaluate(() => {
        const results = [];
        
        window.BEATS.forEach(beat => {
            const timing = window.TIMINGS[beat.id];
            
            if (!timing) {
                results.push({
                    id: beat.id,
                    error: 'No timing found'
                });
                return;
            }
            
            // 清空面板
            const panel = document.getElementById('panel-0');
            if (panel) panel.innerHTML = '';
            
            // 重置 TW
            window.TW = [];
            
            const m = (mark) => timing.marks[mark] || 0;
            const dur = timing.dur;
            
            try {
                beat.run(m, dur);
                
                // 计算比值：max(TW.map(w => w.t0 + (typeof w.dur === 'number' ? w.dur : 0))) / dur
                let maxTime = 0;
                if (window.TW && window.TW.length > 0) {
                    window.TW.forEach(tw => {
                        const t0 = tw.t0 || tw.delay || 0;
                        const duration = typeof tw.dur === 'number' ? tw.dur : 0;
                        const endTime = t0 + duration;
                        if (endTime > maxTime) maxTime = endTime;
                    });
                }
                
                const ratio = maxTime / dur;
                
                // 计算覆盖率：每0.5s采样，最后一次变化时刻 / dur
                let lastChangeTime = 0;
                const sampleInterval = 0.5;
                const samples = Math.ceil(dur / sampleInterval);
                let prevSignature = '';
                
                for (let i = 0; i <= samples; i++) {
                    const t = i * sampleInterval;
                    if (t > dur) break;
                    
                    // 获取当前时刻的可见元素签名
                    const elements = panel.querySelectorAll('text, rect, circle, line');
                    const signatures = [];
                    
                    elements.forEach(el => {
                        const opacity = parseFloat(el.getAttribute('opacity') || '1');
                        if (opacity > 0.01) {
                            let sig = '';
                            if (el.tagName === 'text') {
                                sig = (el.textContent || '').slice(0, 5);
                            }
                            sig += '|' + Math.round(opacity * 1000);
                            sig += '|' + (el.getAttribute('fill') || '');
                            signatures.push(sig);
                        }
                    });
                    
                    const currentSignature = signatures.sort().join(';');
                    if (currentSignature !== prevSignature && currentSignature !== '') {
                        lastChangeTime = t;
                        prevSignature = currentSignature;
                    }
                }
                
                const coverage = lastChangeTime / dur;
                
                results.push({
                    id: beat.id,
                    animDur: maxTime.toFixed(2),
                    narrationDur: dur.toFixed(2),
                    ratio: ratio.toFixed(3),
                    coverage: coverage.toFixed(2),
                    ratioPass: ratio >= 0.8 && ratio <= 1.2,
                    coveragePass: coverage >= 0.7,
                    pass: (ratio >= 0.8 && ratio <= 1.2) && (coverage >= 0.7)
                });
            } catch (e) {
                results.push({
                    id: beat.id,
                    error: e.message
                });
            }
        });
        
        return results;
    });
    
    // 打印结果
    console.log('Beat ID              | Anim (s) | Narr (s) | Ratio  | 覆盖   | 状态');
    console.log('-'.repeat(80));
    
    let allPass = true;
    results.forEach(r => {
        if (r.error) {
            console.log(`${r.id.padEnd(20)} | ERROR: ${r.error}`);
            allPass = false;
        } else {
            const ratioMark = r.ratioPass ? '✓' : '✗';
            const coverageMark = r.coveragePass ? '✓' : '✗';
            const status = r.pass ? '✅ 合格' : '❌ 不合格';
            console.log(`${r.id.padEnd(20)} | ${r.animDur.padStart(8)} | ${r.narrationDur.padStart(8)} | ${r.ratio.padStart(6)} ${ratioMark} | ${r.coverage.padStart(6)} ${coverageMark} | ${status}`);
            if (!r.pass) allPass = false;
        }
    });
    
    console.log('\n' + '='.repeat(80));
    if (allPass) {
        console.log('✅ 所有 beats 通过验收');
    } else {
        console.log('❌ 部分 beats 未通过验收');
    }
    
    await browser.close();
    return allPass ? 0 : 1;
}

testBeats()
    .then(code => process.exit(code))
    .catch(err => {
        console.error('Test failed:', err);
        process.exit(1);
    });
