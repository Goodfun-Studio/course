#!/usr/bin/env python3
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

def test_chapter():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        
        # 加载页面
        file_path = Path(__file__).parent / 'index.html'
        page.goto(f'file://{file_path.absolute()}')
        
        # 等待加载
        page.wait_for_selector('#stage', timeout=5000)
        
        print('Testing Chapter 5: Dijkstra...')
        
        # 测试每个 beat
        beat_names = [
            'intro', 'graph_intro', 'naive', 'greedy_proof', 'relax',
            'priority_queue', 'demo_step', 'demo_middle', 'demo_end',
            'complexity', 'applications', 'summary'
        ]
        
        screenshots_dir = Path(__file__).parent / 'screenshots'
        screenshots_dir.mkdir(exist_ok=True)
        
        for i, beat_name in enumerate(beat_names):
            print(f'  Beat {i}: {beat_name}')
            
            # 跳转到该 beat
            page.evaluate(f'seek({i}, false)')
            page.wait_for_timeout(500)
            
            # 截图
            screenshot_path = screenshots_dir / f'beat_{i:02d}_{beat_name}.png'
            page.screenshot(path=str(screenshot_path))
            print(f'    ✓ Screenshot: {screenshot_path.name}')
        
        # 检查是否有 JS 错误
        errors = page.evaluate('window.__errors || []')
        if errors:
            print(f'\n✗ JavaScript errors detected:')
            for err in errors:
                print(f'  {err}')
            browser.close()
            return False
        
        browser.close()
        print('\n✓ All tests passed!')
        return True

if __name__ == '__main__':
    success = test_chapter()
    sys.exit(0 if success else 1)
