#!/usr/bin/env python3
"""Test Chapter 14 with Playwright"""
import asyncio
from pathlib import Path
from playwright.async_api import async_playwright

CHAPTER_DIR = Path(__file__).parent
SCREENSHOTS_DIR = CHAPTER_DIR / "screenshots"

async def test_chapter():
    """Test all beats in the chapter"""
    SCREENSHOTS_DIR.mkdir(exist_ok=True)
    
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await p.new_page(viewport={'width': 1600, 'height': 800})
        
        # Load the chapter
        html_file = CHAPTER_DIR / "index.html"
        await page.goto(f"file://{html_file.absolute()}")
        
        # Wait for engine to load
        await page.wait_for_selector('#bar', timeout=5000)
        
        # Get all beats
        beats = await page.evaluate('() => window.BEATS.map(b => b.id)')
        print(f"Found {len(beats)} beats")
        
        # Test each beat
        for i, beat_id in enumerate(beats):
            print(f"Testing beat {i+1}/{len(beats)}: {beat_id}")
            
            # Navigate to beat
            await page.evaluate(f'() => window.player.jumpTo({i})')
            await asyncio.sleep(0.5)
            
            # Take screenshot
            screenshot_path = SCREENSHOTS_DIR / f"{i+1:02d}-{beat_id}.png"
            await page.screenshot(path=str(screenshot_path))
            print(f"  ✓ Screenshot saved: {screenshot_path.name}")
        
        await browser.close()
        print(f"\n✓ All {len(beats)} beats tested successfully")

if __name__ == "__main__":
    asyncio.run(test_chapter())
