#!/usr/bin/env python3
"""测试第27章课程 - 验证动画/旁白比值"""
import asyncio
from playwright.async_api import async_playwright
import sys
import os

async def test_chapter():
    """测试课程动画与旁白时长比值"""
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        # 加载课程页面
        file_path = os.path.join(os.path.dirname(__file__), 'index.html')
        await page.goto(f'file://{file_path}')
        
        # 等待加载完成
        await page.wait_for_function('window.BEATS && window.TIMINGS', timeout=10000)
        
        print('✅ 页面加载成功\n')
        
        # 获取所有 beats 信息
        result = await page.evaluate('''
            () => {
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
                    
                    // 运行 beat 获取动画时长
                    const panel0 = document.getElementById('panel-0');
                    if (panel0) panel0.innerHTML = '';
                    
                    const m = (mark) => timing.marks[mark] || 0;
                    const dur = timing.dur;
                    
                    try {
                        beat.run(m, dur);
                    } catch (e) {
                        results.push({
                            id: beat.id,
                            error: e.toString()
                        });
                        return;
                    }
                    
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
                });
                
                return results;
            }
        ''')
        
        # 打印结果
        print('Beat ID              | Anim (s) | Narr (s) | Ratio  | Status')
        print('-' * 70)
        
        all_pass = True
        for r in result:
            if 'error' in r:
                print(f"{r['id']:20} | ERROR: {r['error']}")
                all_pass = False
            else:
                status = '✅ PASS' if r['pass'] else '❌ FAIL'
                print(f"{r['id']:20} | {r['animDur']:8} | {r['narrationDur']:8} | {r['ratio']:6} | {status}")
                if not r['pass']:
                    all_pass = False
        
        await browser.close()
        
        print('\n' + '=' * 70)
        if all_pass:
            print('✅ 所有 beats 通过验收（比值在 [0.8, 1.2] 范围内）')
            return 0
        else:
            print('❌ 部分 beats 未通过验收')
            return 1

if __name__ == '__main__':
    exit_code = asyncio.run(test_chapter())
    sys.exit(exit_code)
