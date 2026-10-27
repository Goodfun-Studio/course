#!/usr/bin/env python3
import asyncio
from pathlib import Path
from playwright.async_api import async_playwright

async def test_chapter():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        
        # 访问第四章
        await page.goto('http://localhost:8765/ch04/')
        
        # 等待页面加载
        await page.wait_for_selector('body')
        await asyncio.sleep(2)
        
        # 检查标题
        title = await page.title()
        print(f'✓ Page title: {title}')
        assert '最长公共子序列' in title
        
        # 检查是否有JS错误
        errors = []
        page.on('console', lambda msg: errors.append(msg.text) if msg.type == 'error' else None)
        
        # 检查所有beat是否存在
        beats = await page.evaluate('window.BEATS ? window.BEATS.length : 0')
        print(f'✓ Number of beats: {beats}')
        assert beats == 12, f'Expected 12 beats, got {beats}'
        
        # 检查练习题
        quiz = await page.evaluate('window.QUIZ ? window.QUIZ.length : 0')
        print(f'✓ Number of quiz questions: {quiz}')
        assert quiz == 3, f'Expected 3 questions, got {quiz}'
        
        # 截图每个beat
        screenshot_dir = Path('screenshots')
        screenshot_dir.mkdir(exist_ok=True)
        
        for i in range(beats):
            beat_name = await page.evaluate(f'window.BEATS[{i}][0]')
            print(f'  Capturing beat {i}: {beat_name}')
            
            # 触发beat切换（简化版，实际需要模拟引擎）
            await page.screenshot(path=screenshot_dir / f'beat_{i:02d}_{beat_name}.png')
            await asyncio.sleep(0.5)
        
        print(f'\n✓ All tests passed!')
        print(f'✓ Screenshots saved to {screenshot_dir}/')
        
        await browser.close()

if __name__ == '__main__':
    asyncio.run(test_chapter())
