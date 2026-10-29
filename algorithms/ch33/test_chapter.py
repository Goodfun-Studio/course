#!/usr/bin/env python3
"""测试第33章课程"""
import sys
import asyncio
from pathlib import Path
from playwright.async_api import async_playwright

async def test_chapter():
    """使用 Playwright 测试课程"""
    script_dir = Path(__file__).parent
    html_file = script_dir / "index.html"
    
    if not html_file.exists():
        print(f"✗ HTML 文件不存在: {html_file}")
        return False
    
    print("启动浏览器测试...")
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        # 监听控制台错误
        errors = []
        page.on("console", lambda msg: errors.append(msg.text) if msg.type == "error" else None)
        
        # 加载页面
        file_url = html_file.as_uri()
        print(f"加载: {file_url}")
        
        try:
            await page.goto(file_url, wait_until="networkidle", timeout=30000)
            await asyncio.sleep(2)
            
            # 检查 CHAPTER 对象
            chapter = await page.evaluate("() => window.CHAPTER")
            if chapter:
                print(f"✓ CHAPTER: {chapter}")
            else:
                print("✗ CHAPTER 对象未定义")
                return False
            
            # 检查 BEATS 数组
            beats_count = await page.evaluate("() => window.BEATS ? window.BEATS.length : 0")
            if beats_count > 0:
                print(f"✓ BEATS: {beats_count} 个场景")
            else:
                print("✗ BEATS 数组为空")
                return False
            
            # 检查每个 beat
            print("\n检查各个 beat:")
            for i in range(beats_count):
                beat = await page.evaluate(f"() => window.BEATS[{i}]")
                beat_id = beat.get('id', f'beat-{i}')
                beat_title = beat.get('title', '未命名')
                print(f"  [{i}] {beat_id}: {beat_title}")
            
            # 检查控制台错误
            if errors:
                print("\n✗ 控制台错误:")
                for error in errors:
                    print(f"  - {error}")
                return False
            
            print("\n✓ 所有测试通过！")
            return True
            
        except Exception as e:
            print(f"✗ 测试失败: {e}")
            return False
        finally:
            await browser.close()

if __name__ == "__main__":
    success = asyncio.run(test_chapter())
    sys.exit(0 if success else 1)
