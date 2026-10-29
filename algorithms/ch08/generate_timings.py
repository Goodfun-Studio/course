#!/usr/bin/env python3
from mutagen.mp3 import MP3
from pathlib import Path
import json

audio_dir = Path('audio/zh')
timings = {}

# 读取旁白脚本获取顺序
with open('narration.zh.json', 'r', encoding='utf-8') as f:
    scripts = json.load(f)

for beat_name in scripts.keys():
    mp3_file = audio_dir / f'{beat_name}.mp3'
    if mp3_file.exists():
        audio = MP3(mp3_file)
        duration = audio.info.length
        timings[beat_name] = round(duration, 2)
        print(f'{beat_name}: {duration:.2f}s')
    else:
        print(f'Warning: {mp3_file} not found')

# 生成 timings.js
output = "const TIMINGS = " + json.dumps(timings, indent=2, ensure_ascii=False) + ";\n"

with open('audio/zh/timings.js', 'w', encoding='utf-8') as f:
    f.write(output)

print(f'\n✓ timings.js generated with {len(timings)} beats')
