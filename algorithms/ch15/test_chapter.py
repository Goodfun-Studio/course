#!/usr/bin/env python3
"""测试第15章"""
import asyncio
from playwright.async_api import async_playwright

async def test_chapter():
    """测试章节能否正常加载和运行"""
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        
        # 加载页面
        await page.goto('file://' + __file__.replace('test_chapter.py', 'index.html'))
        
        # 等待页面加载
        await page.wait_for_load_state('networkidle')
        await asyncio.sleep(2)
        
        # 检查基本元素
        title = await page.title()
        assert '广度优先搜索' in title or 'BFS' in title
        
        # 检查 BEATS 数组
        beats = await page.evaluate('window.BEATS')
        assert beats is not None
        assert len(beats) >= 11, f"Expected at least 11 beats, got {len(beats)}"
        
        # 检查 TIMINGS
        timings = await page.evaluate('window.TIMINGS')
        assert timings is not None
        
        # 检查每个 beat
        beat_ids = [beat['id'] for beat in beats]
        print(f"Found {len(beats)} beats: {beat_ids}")
        
        for beat in beats:
            beat_id = beat['id']
            assert beat_id in timings, f"Beat {beat_id} not in timings"
            
            timing = timings[beat_id]
            assert 'dur' in timing, f"Beat {beat_id} missing dur"
            assert 'marks' in timing, f"Beat {beat_id} missing marks"
            assert 'cues' in timing, f"Beat {beat_id} missing cues"
            
            print(f"✓ Beat {beat_id}: {timing['dur']:.2f}s")
        
        # 检查是否有 JavaScript 错误
        errors = []
        page.on('pageerror', lambda err: errors.append(str(err)))
        
        await asyncio.sleep(1)
        
        if errors:
            print("JavaScript errors found:")
            for err in errors:
                print(f"  - {err}")
            raise AssertionError("JavaScript errors detected")
        
        print("\n✅ All tests passed!")
        
        await browser.close()

if __name__ == '__main__':
    asyncio.run(test_chapter())
