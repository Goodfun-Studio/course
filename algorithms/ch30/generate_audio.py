#!/usr/bin/env python3
import json, os, asyncio, re
import edge_tts

VOICE = 'zh-CN-YunxiNeural'

async def main():
    with open('narration.zh.json', encoding='utf-8') as f:
        narration = json.load(f)
    os.makedirs('audio/zh', exist_ok=True)
    for beat_id, text in narration.items():
        clean = re.sub(r'\[\[[^\]]*\]\]', '', text).strip()
        out = f'audio/zh/{beat_id}.mp3'
        await edge_tts.Communicate(clean, VOICE).save(out)
        print(f'  ✓ {out}')

asyncio.run(main())
print('完成')
