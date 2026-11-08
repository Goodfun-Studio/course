// 在浏览器控制台运行此脚本测试 ch27
// 打开 http://localhost:8765/ch27/index.html
// 复制粘贴此脚本到控制台

(function testCh27() {
    console.log('开始测试 ch27 - 标准B验收');
    console.log('Beat ID              | Anim (s) | Narr (s) | Ratio  | 覆盖   | 状态');
    console.log('-'.repeat(80));
    
    const results = [];
    let allPass = true;
    
    window.BEATS.forEach(beat => {
        const timing = window.TIMINGS[beat.id];
        
        if (!timing) {
            console.log(`${beat.id.padEnd(20)} | ERROR: No timing found`);
            allPass = false;
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
            const ratioPass = ratio >= 0.8 && ratio <= 1.2;
            const coveragePass = coverage >= 0.7;
            const pass = ratioPass && coveragePass;
            
            const ratioMark = ratioPass ? '✓' : '✗';
            const coverageMark = coveragePass ? '✓' : '✗';
            const status = pass ? '✅ 合格' : '❌ 不合格';
            
            results.push({
                id: beat.id,
                ratio: ratio.toFixed(3),
                coverage: coverage.toFixed(2),
                pass
            });
            
            console.log(`${beat.id.padEnd(20)} | ${maxTime.toFixed(2).padStart(8)} | ${dur.toFixed(2).padStart(8)} | ${ratio.toFixed(3).padStart(6)} ${ratioMark} | ${coverage.toFixed(2).padStart(6)} ${coverageMark} | ${status}`);
            
            if (!pass) allPass = false;
        } catch (e) {
            console.log(`${beat.id.padEnd(20)} | ERROR: ${e.message}`);
            allPass = false;
        }
    });
    
    console.log('\n' + '='.repeat(80));
    if (allPass) {
        console.log('✅ 所有 beats 通过标准B验收（比值 [0.8, 1.2]，覆盖 ≥ 0.7）');
    } else {
        console.log('❌ 部分 beats 未通过验收');
    }
    
    return results;
})();
