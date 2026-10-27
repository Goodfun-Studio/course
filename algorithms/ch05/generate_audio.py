#!/usr/bin/env python3
import json
import subprocess
import re
from pathlib import Path

# 读取旁白脚本
with open('narration.zh.json', 'r', encoding='utf-8') as f:
    scripts = json.load(f)

audio_dir = Path('audio/zh')
audio_dir.mkdir(parents=True, exist_ok=True)

# 使用 Edge TTS 生成音频
voice = 'zh-CN-YunxiNeural'

for beat_name, text in scripts.items():
    # 移除 [[mark]] 标记
    clean_text = re.sub(r'\[\[.*?\]\]', '', text).strip()
    
    output_file = audio_dir / f'{beat_name}.mp3'
    
    print(f'Generating {beat_name}.mp3...')
    
    cmd = [
        'edge-tts',
        '--voice', voice,
        '--text', clean_text,
        '--write-media', str(output_file)
    ]
    
    subprocess.run(cmd, check=True)
    print(f'  ✓ {output_file}')

print('\n✓ All audio files generated!')
