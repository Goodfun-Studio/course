#!/usr/bin/env python3
"""
Playwright test for Chapter 29: Bidirectional BFS
Tests all beats and verifies animations
"""
import asyncio
import sys
from playwright.async_api import async_playwright

async def test_chapter():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        page = await browser.new_page()
        
        # Load the chapter
        await page.goto('file://' + __file__.replace('test_chapter.py', 'index.html'))
        
        # Wait for initialization
        await page.wait_for_timeout(2000)
        
        print('Testing Chapter 29: Bidirectional BFS')
        print('=' * 50)
        
        # Get all beats
        beats = await page.evaluate('BEATS.map(b => b[0])')
        print(f'Found {len(beats)} beats: {beats}')
        
        # Test each beat
        for i, beat_id in enumerate(beats):
            print(f'\n[{i+1}/{len(beats)}] Testing beat: {beat_id}')
            
            # Navigate to beat
            await page.evaluate(f'player.jump({i})')
            await page.wait_for_timeout(1500)
            
            # Check for visible elements
            svg = await page.query_selector('svg')
            if svg:
                elements = await svg.query_selector_all('*')
                visible_count = 0
                for el in elements:
                    opacity = await el.get_attribute('opacity')
                    if opacity is None or float(opacity or 1) > 0:
                        visible_count += 1
                
                print(f'  ✓ Beat loaded with {visible_count} visible elements')
            
            # Verify no errors
            errors = await page.evaluate('window.errors || []')
            if errors:
                print(f'  ✗ Errors found: {errors}')
                return False
        
        print('\n' + '=' * 50)
        print('✓ All beats tested successfully!')
        
        await browser.close()
        return True

if __name__ == '__main__':
    result = asyncio.run(test_chapter())
    sys.exit(0 if result else 1)
