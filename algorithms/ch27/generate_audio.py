#!/usr/bin/env python3
import json
import os
import asyncio
import edge_tts

VOICE = 'zh-CN-YunxiNeural'

async def generate_audio():
    with open('narration.zh.json', 'r', encoding='utf-8') as f:
        narration = json.load(f)

    os.makedirs('audio/zh', exist_ok=True)

    for beat_id, text in narration.items():
        clean_text = text.replace('[[', '').replace(']]', ' ')
        output_file = f'audio/zh/{beat_id}.mp3'
        print(f'生成 {beat_id}.mp3...')
        communicate = edge_tts.Communicate(clean_text, VOICE)
        await communicate.save(output_file)
        print(f'  ✓ {output_file}')

if __name__ == '__main__':
    asyncio.run(generate_audio())
    print('\n所有音频文件生成完成！')
