#!/usr/bin/env python3
"""测试第35章"""
import sys
import asyncio
from pathlib import Path
from playwright.async_api import async_playwright

async def test_chapter():
    """测试章节"""
    chapter_dir = Path(__file__).parent
    html_file = chapter_dir / 'index.html'
    
    if not html_file.exists():
        print(f'错误: 找不到 {html_file}')
        return False
    
    print('启动 Playwright 测试...')
    
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await p.new_page()
        
        # 设置视口
        await page.set_viewport_size({'width': 1600, 'height': 900})
        
        # 加载页面
        print(f'加载 {html_file} ...')
        await page.goto(f'file://{html_file.absolute()}')
        
        # 等待加载
        await page.wait_for_timeout(2000)
        
        # 检查标题
        title = await page.title()
        print(f'标题: {title}')
        
        if '最小费用最大流' not in title:
            print('✗ 标题不正确')
            await browser.close()
            return False
        
        print('✓ 标题正确')
        
        # 检查是否有错误
        errors = []
        page.on('console', lambda msg: errors.append(msg.text) if msg.type == 'error' else None)
        page.on('pageerror', lambda err: errors.append(str(err)))
        
        await page.wait_for_timeout(3000)
        
        if errors:
            print('✗ 发现控制台错误:')
            for err in errors:
                print(f'  {err}')
            await browser.close()
            return False
        
        print('✓ 无控制台错误')
        
        # 测试每个 beat
        narration_file = chapter_dir / 'narration.zh.json'
        if narration_file.exists():
            import json
            with open(narration_file, 'r', encoding='utf-8') as f:
                narrations = json.load(f)
            
            print(f'\n测试 {len(narrations)} 个 beats:')
            for i, beat_id in enumerate(narrations.keys()):
                print(f'  {i+1}. {beat_id}', end=' ... ')
                
                # 检查 SVG 元素是否存在
                svg_count = await page.evaluate('() => document.querySelectorAll("svg").length')
                if svg_count > 0:
                    print('✓')
                else:
                    print('✗ (无SVG元素)')
                
                await page.wait_for_timeout(500)
        
        # 截图
        screenshot_path = chapter_dir / 'screenshot.png'
        await page.screenshot(path=str(screenshot_path), full_page=False)
        print(f'\n截图已保存到 {screenshot_path}')
        
        await browser.close()
        print('\n✓ 测试通过')
        return True

if __name__ == '__main__':
    try:
        success = asyncio.run(test_chapter())
        sys.exit(0 if success else 1)
    except Exception as e:
        print(f'测试失败: {e}')
        sys.exit(1)
