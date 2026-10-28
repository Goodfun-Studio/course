#!/usr/bin/env python3
import json
import subprocess
import re
import time
from pathlib import Path

# 读取旁白脚本
with open('narration.zh.json', 'r', encoding='utf-8') as f:
    scripts = json.load(f)

audio_dir = Path('audio/zh')
audio_dir.mkdir(parents=True, exist_ok=True)

voice = 'zh-CN-YunxiNeural'
MAX_RETRY = 8

for beat_name, text in scripts.items():
    clean_text = re.sub(r'\[\[.*?\]\]', '', text).strip()
    output_file = audio_dir / f'{beat_name}.mp3'

    # 已生成且非空则跳过
    if output_file.exists() and output_file.stat().st_size > 1024:
        print(f'Skip {beat_name}.mp3 (exists)')
        continue

    ok = False
    for attempt in range(1, MAX_RETRY + 1):
        print(f'Generating {beat_name}.mp3 (attempt {attempt}/{MAX_RETRY})...')
        cmd = [
            'edge-tts',
            '--voice', voice,
            '--text', clean_text,
            '--write-media', str(output_file),
        ]
        r = subprocess.run(cmd, capture_output=True, text=True)
        if r.returncode == 0 and output_file.exists() and output_file.stat().st_size > 1024:
            print(f'  ✓ {output_file} ({output_file.stat().st_size} bytes)')
            ok = True
            break
        # 清掉半成品
        if output_file.exists():
            output_file.unlink()
        wait = min(3 * attempt, 15)
        print(f'  ✗ failed, retry in {wait}s')
        time.sleep(wait)

    if not ok:
        raise SystemExit(f'FATAL: cannot generate {beat_name}.mp3')

print('\n✓ All audio files generated!')
