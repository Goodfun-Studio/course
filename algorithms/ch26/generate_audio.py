#!/usr/bin/env python3
import json
import subprocess
import os

with open('narration.zh.json', 'r', encoding='utf-8') as f:
    narration = json.load(f)

os.makedirs('audio/zh', exist_ok=True)

for beat_id, text in narration.items():
    output_aiff = f'audio/zh/{beat_id}.aiff'
    output_mp3 = f'audio/zh/{beat_id}.mp3'
    
    if not os.path.exists(output_mp3):
        print(f'Generating {output_mp3}...')
        # Generate AIFF first
        subprocess.run([
            'say', '-v', 'Tingting', '-r', '200', '-o', output_aiff, text
        ])
        # Convert to MP3
        subprocess.run([
            'ffmpeg', '-i', output_aiff, '-codec:a', 'libmp3lame', '-qscale:a', '2', output_mp3, '-y'
        ], capture_output=True)
        # Remove AIFF
        os.remove(output_aiff)
    else:
        print(f'Skipping {output_mp3} (already exists)')

print('✅ Audio generation complete!')
