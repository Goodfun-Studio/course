#!/usr/bin/env python3
"""
Test chapter 34: AC Automaton using Playwright
"""
import asyncio
from playwright.async_api import async_playwright
from pathlib import Path

async def test_chapter():
    """Test all beats in the chapter"""
    
    chapter_file = Path(__file__).parent / 'index.html'
    
    print("Testing Chapter 34: AC Automaton")
    print("=" * 60)
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        # Load the chapter
        await page.goto(f'file://{chapter_file.absolute()}')
        
        # Wait for engine to load
        await page.wait_for_selector('#bar', timeout=10000)
        
        print("✓ Chapter loaded successfully")
        
        # Get all beats
        beats = await page.evaluate('BEATS.map(b => b[0])')
        print(f"✓ Found {len(beats)} beats: {', '.join(beats)}")
        
        # Test each beat
        for i, beat_id in enumerate(beats):
            print(f"\nTesting beat {i+1}/{len(beats)}: {beat_id}")
            
            # Navigate to beat
            await page.evaluate(f'window.location.hash = "#{beat_id}"')
            await asyncio.sleep(0.5)
            
            # Check if beat is rendered
            svg_count = await page.evaluate('document.querySelectorAll("svg").length')
            if svg_count > 0:
                print(f"  ✓ SVG elements rendered: {svg_count}")
            else:
                print(f"  ⚠ No SVG elements found")
            
            # Take screenshot
            screenshot_dir = Path('screenshots')
            screenshot_dir.mkdir(exist_ok=True)
            screenshot_file = screenshot_dir / f"{beat_id}.png"
            await page.screenshot(path=str(screenshot_file), full_page=True)
            print(f"  ✓ Screenshot saved: {screenshot_file}")
        
        await browser.close()
    
    print("\n" + "=" * 60)
    print("All tests completed!")

if __name__ == '__main__':
    asyncio.run(test_chapter())
