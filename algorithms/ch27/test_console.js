// 在浏览器控制台中运行此脚本来测试动画时长
// 复制粘贴到 http://localhost:8000/ch27/index.html 的控制台

(function testBeats() {
    console.log('Beat ID              | Anim (s) | Narr (s) | Ratio  | Status');
    console.log('-'.repeat(70));
    
    let allPass = true;
    const results = [];
    
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
            
            // 计算最大动画时间
            let maxTime = 0;
            if (window.TW && window.TW.length > 0) {
                window.TW.forEach(tw => {
                    const endTime = (tw.delay || 0) + (tw.duration || 0);
                    if (endTime > maxTime) maxTime = endTime;
                });
            }
            
            const ratio = maxTime / dur;
            const pass = ratio >= 0.8 && ratio <= 1.2;
            const status = pass ? '✅ PASS' : '❌ FAIL';
            
            const result = {
                id: beat.id,
                animDur: maxTime.toFixed(2),
                narrationDur: dur.toFixed(2),
                ratio: ratio.toFixed(3),
                pass
            };
            
            results.push(result);
            
            console.log(`${beat.id.padEnd(20)} | ${result.animDur.padStart(8)} | ${result.narrationDur.padStart(8)} | ${result.ratio.padStart(6)} | ${status}`);
            
            if (!pass) allPass = false;
        } catch (e) {
            console.log(`${beat.id.padEnd(20)} | ERROR: ${e.message}`);
            allPass = false;
        }
    });
    
    console.log('\n' + '='.repeat(70));
    if (allPass) {
        console.log('✅ 所有 beats 通过验收（比值在 [0.8, 1.2] 范围内）');
    } else {
        console.log('❌ 部分 beats 未通过验收');
    }
    
    return results;
})();
