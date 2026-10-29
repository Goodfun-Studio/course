#!/usr/bin/env python3
"""生成中文旁白音频"""
import json
import asyncio
import edge_tts
import os

async def generate_audio():
    """生成所有 beat 的音频"""
    with open('narration.zh.json', 'r', encoding='utf-8') as f:
        narrations = json.load(f)
    
    os.makedirs('audio/zh', exist_ok=True)
    
    voice = "zh-CN-YunxiNeural"  # 男声
    
    for beat_id, text in narrations.items():
        # 移除 [[mark]] 标记
        clean_text = text
        import re
        clean_text = re.sub(r'\[\[.*?\]\]', '', clean_text)
        clean_text = clean_text.strip()
        
        output_path = f'audio/zh/{beat_id}.mp3'
        print(f'生成 {beat_id}.mp3...')
        
        communicate = edge_tts.Communicate(clean_text, voice)
        await communicate.save(output_path)
    
    print('✅ 所有音频生成完成')

if __name__ == '__main__':
    asyncio.run(generate_audio())
