#!/usr/bin/env python3
import json
import asyncio
import edge_tts
import os

async def generate_audio():
    with open('narration.zh.json', 'r', encoding='utf-8') as f:
        narrations = json.load(f)
    
    os.makedirs('audio/zh', exist_ok=True)
    
    VOICE = "zh-CN-YunxiNeural"
    
    for beat_id, text in narrations.items():
        # 移除 [[mark]] 标记
        clean_text = text
        import re
        clean_text = re.sub(r'\[\[.*?\]\]', '', clean_text)
        
        output = f'audio/zh/{beat_id}.mp3'
        communicate = edge_tts.Communicate(clean_text, VOICE)
        await communicate.save(output)
        print(f'✓ {output}')

if __name__ == '__main__':
    asyncio.run(generate_audio())
