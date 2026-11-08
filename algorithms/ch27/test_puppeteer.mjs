import puppeteer from 'puppeteer';

async function testBeats() {
    const browser = await puppeteer.launch({ headless: true });
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
                
                // 计算最大动画时间
                let maxTime = 0;
                if (window.TW && window.TW.length > 0) {
                    window.TW.forEach(tw => {
                        const endTime = (tw.delay || 0) + (tw.duration || 0);
                        if (endTime > maxTime) maxTime = endTime;
                    });
                }
                
                const ratio = maxTime / dur;
                
                results.push({
                    id: beat.id,
                    animDur: maxTime.toFixed(2),
                    narrationDur: dur.toFixed(2),
                    ratio: ratio.toFixed(3),
                    pass: ratio >= 0.8 && ratio <= 1.2
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
    console.log('Beat ID              | Anim (s) | Narr (s) | Ratio  | Status');
    console.log('-'.repeat(70));
    
    let allPass = true;
    results.forEach(r => {
        if (r.error) {
            console.log(`${r.id.padEnd(20)} | ERROR: ${r.error}`);
            allPass = false;
        } else {
            const status = r.pass ? '✅ PASS' : '❌ FAIL';
            console.log(`${r.id.padEnd(20)} | ${r.animDur.padStart(8)} | ${r.narrationDur.padStart(8)} | ${r.ratio.padStart(6)} | ${status}`);
            if (!r.pass) allPass = false;
        }
    });
    
    console.log('\n' + '='.repeat(70));
    if (allPass) {
        console.log('✅ 所有 beats 通过验收（比值在 [0.8, 1.2] 范围内）');
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
