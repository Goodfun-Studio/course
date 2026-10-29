#!/usr/bin/env python3
import json
import subprocess
import os
import re

def get_audio_duration(filepath):
    """Get audio duration using afinfo"""
    try:
        result = subprocess.run(
            ['afinfo', filepath],
            capture_output=True,
            text=True,
            check=True
        )
        for line in result.stdout.split('\n'):
            if 'estimated duration' in line.lower():
                match = re.search(r'(\d+\.?\d*)\s*sec', line)
                if match:
                    return float(match.group(1))
    except Exception as e:
        print(f"Error getting duration for {filepath}: {e}")
    return 0.0

audio_dir = 'audio/zh'
timings = {}
cumulative_time = 0.0

with open('narration.zh.json', 'r', encoding='utf-8') as f:
    narration = json.load(f)

for beat_id in narration.keys():
    audio_file = os.path.join(audio_dir, f'{beat_id}.mp3')
    if os.path.exists(audio_file):
        duration = get_audio_duration(audio_file)
        timings[beat_id] = {
            'start': round(cumulative_time, 2),
            'duration': round(duration, 2)
        }
        cumulative_time += duration
        print(f'{beat_id}: {duration:.2f}s (start: {timings[beat_id]["start"]:.2f}s)')
    else:
        print(f'Warning: {audio_file} not found')

output_js = 'audio/zh/timings.js'
with open(output_js, 'w', encoding='utf-8') as f:
    f.write('window.TIMINGS = ')
    json.dump(timings, f, indent=2, ensure_ascii=False)
    f.write(';\n')

print(f'\n✅ Timings generated: {output_js}')
print(f'Total duration: {cumulative_time:.2f}s ({cumulative_time/60:.1f} minutes)')
