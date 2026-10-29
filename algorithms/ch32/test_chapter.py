#!/usr/bin/env python3
"""Test chapter 32 with Playwright."""
import asyncio
from pathlib import Path
from playwright.async_api import async_playwright

async def test_chapter():
    script_dir = Path(__file__).parent
    index_file = script_dir / 'index.html'
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        page = await browser.new_page()
        
        # Load the chapter
        await page.goto(f'file://{index_file.absolute()}')
        print('✓ Page loaded')
        
        # Wait for engine to initialize
        await page.wait_for_selector('#bar', timeout=5000)
        print('✓ Engine initialized')
        
        # Check title
        title = await page.title()
        assert '素数筛法' in title, f'Expected "素数筛法" in title, got {title}'
        print(f'✓ Title: {title}')
        
        # Get beat count
        beat_count = await page.evaluate('BEATS.length')
        print(f'✓ Total beats: {beat_count}')
        assert beat_count == 12, f'Expected 12 beats, got {beat_count}'
        
        # Test each beat
        for i in range(beat_count):
            beat_id = await page.evaluate(f'BEATS[{i}][0]')
            beat_name = await page.evaluate(f'BEATS[{i}][1]')
            print(f'\nTesting beat {i}: {beat_id} - {beat_name}')
            
            # Navigate to beat
            await page.evaluate(f'gotoSlide({i})')
            await asyncio.sleep(0.5)
            
            # Check for panel
            panel = await page.evaluate('document.querySelector("svg[data-panel=\\"0\\"]")')
            assert panel is not None, f'Panel not found for beat {i}'
            
            # Count text elements
            text_count = await page.evaluate('document.querySelectorAll("svg[data-panel=\\"0\\"] text").length')
            print(f'  Text elements: {text_count}')
            assert text_count > 0, f'No text elements in beat {i}'
            
            # For sieve-animation beat, check for grid
            if beat_id == 'sieve-animation':
                rect_count = await page.evaluate('document.querySelectorAll("svg[data-panel=\\"0\\"] rect").length')
                print(f'  Grid cells: {rect_count}')
                assert rect_count >= 49, f'Expected at least 49 grid cells, got {rect_count}'
            
            print(f'  ✓ Beat {i} passed')
        
        print(f'\n✓ All {beat_count} beats tested successfully')
        
        # Keep browser open for manual inspection
        print('\nBrowser will stay open for 10 seconds...')
        await asyncio.sleep(10)
        
        await browser.close()

if __name__ == '__main__':
    asyncio.run(test_chapter())
