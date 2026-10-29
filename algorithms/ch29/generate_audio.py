#!/usr/bin/env python3
import json
import subprocess
import os

# Load narration
with open('narration.zh.json', 'r', encoding='utf-8') as f:
    narration = json.load(f)

# Create audio directory
os.makedirs('audio/zh', exist_ok=True)

# Generate audio for each beat
for beat_id, text in narration.items():
    # Remove timing markers [[...]]
    import re
    clean_text = re.sub(r'\[\[.*?\]\]', '', text)
    clean_text = clean_text.strip()
    
    output_file = f'audio/zh/{beat_id}.mp3'
    
    print(f'Generating {output_file}...')
    
    # Use macOS 'say' command to generate audio
    subprocess.run([
        'say',
        '-v', 'Tingting',
        '-o', output_file.replace('.mp3', '.aiff'),
        '--file-format=AIFF',
        clean_text
    ])
    
    # Convert AIFF to MP3 using ffmpeg
    subprocess.run([
        'ffmpeg',
        '-i', output_file.replace('.mp3', '.aiff'),
        '-acodec', 'libmp3lame',
        '-y',
        output_file
    ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    
    # Remove AIFF file
    os.remove(output_file.replace('.mp3', '.aiff'))

print('Done!')
