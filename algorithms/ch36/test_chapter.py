#!/usr/bin/env python3
"""测试第36章课程"""
import asyncio
from playwright.async_api import async_playwright
import sys

async def test_chapter():
    """测试课程动画"""
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        page = await browser.new_page()
        
        # 加载课程页面
        await page.goto(f'file://{sys.path[0]}/index.html')
        
        # 等待加载完成
        await page.wait_for_selector('#bar', state='visible', timeout=10000)
        
        print('✅ 页面加载成功')
        
        # 测试每个 beat
        beats = [
            'intro',
            'problem-def',
            'cross-product',
            'segment-intersection-demo',
            'special-cases',
            'quick-reject',
            'multi-segments',
            'sweep-line-demo',
            'sweep-events',
            'complexity',
            'applications',
            'advanced',
            'summary'
        ]
        
        for beat in beats:
            print(f'\n测试 {beat}...')
            
            # 点击播放该 beat
            await page.evaluate(f'window.jumpToBeat("{beat}")')
            await asyncio.sleep(1)
            
            # 检查动画元素数量
            svg_count = await page.evaluate('document.querySelectorAll("svg text, svg rect, svg circle, svg line, svg polygon").length')
            print(f'  - SVG 元素数量: {svg_count}')
            
            # 检查补间动画数量
            tw_count = await page.evaluate('window.TW ? window.TW.length : 0')
            print(f'  - 补间动画数量: {tw_count}')
            
            if beat in ['segment-intersection-demo', 'sweep-line-demo']:
                if tw_count < 20:
                    print(f'  ⚠️  警告：核心动画 {beat} 的补间数量 ({tw_count}) 少于要求的 20')
                else:
                    print(f'  ✅ 核心动画补间数量符合要求')
            
            await asyncio.sleep(2)
        
        print('\n✅ 所有 beat 测试完成')
        
        # 保持浏览器打开以便人工检查
        print('\n浏览器将保持打开状态，按 Ctrl+C 退出...')
        try:
            await asyncio.sleep(3600)
        except KeyboardInterrupt:
            print('\n测试结束')
        
        await browser.close()

if __name__ == '__main__':
    asyncio.run(test_chapter())
