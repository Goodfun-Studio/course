#!/usr/bin/env python3
import json
import subprocess
import os
import re

# Load narration
with open('narration.zh.json', 'r', encoding='utf-8') as f:
    narration = json.load(f)

# Extract marks and generate timings
timings = {}

for beat_id, text in narration.items():
    audio_file = f'audio/zh/{beat_id}.mp3'
    
    if not os.path.exists(audio_file):
        print(f'Warning: {audio_file} not found, skipping...')
        continue
    
    # Get audio duration using ffprobe
    result = subprocess.run([
        'ffprobe',
        '-v', 'error',
        '-show_entries', 'format=duration',
        '-of', 'default=noprint_wrappers=1:nokey=1',
        audio_file
    ], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    
    duration = float(result.stdout.strip())
    
    # Extract marks from text
    marks = re.findall(r'\[\[(.*?)\]\]', text)
    
    if marks:
        # Distribute marks evenly across the audio duration
        mark_timings = {}
        interval = duration / len(marks)
        
        for i, mark in enumerate(marks):
            mark_timings[mark] = round(i * interval, 2)
        
        timings[beat_id] = {
            'audio': beat_id,
            'marks': mark_timings
        }
    else:
        timings[beat_id] = {
            'audio': beat_id
        }

# Write timings.js
output_path = 'audio/zh/timings.js'
with open(output_path, 'w', encoding='utf-8') as f:
    f.write('const TIMINGS = ')
    json.dump(timings, f, ensure_ascii=False, indent=2)
    f.write(';\n')

print(f'Generated {output_path}')
print(f'Total beats: {len(timings)}')
