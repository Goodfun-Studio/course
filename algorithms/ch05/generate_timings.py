#!/usr/bin/env python3
import json
from pathlib import Path
from mutagen.mp3 import MP3

audio_dir = Path('audio/zh')
timings = {}

beat_names = [
    'intro', 'graph_intro', 'naive', 'greedy_proof', 'relax',
    'priority_queue', 'demo_step', 'demo_middle', 'demo_end',
    'complexity', 'applications', 'summary'
]

for beat_name in beat_names:
    mp3_file = audio_dir / f'{beat_name}.mp3'
    
    if not mp3_file.exists():
        print(f'Warning: {mp3_file} not found')
        continue
    
    audio = MP3(mp3_file)
    duration = audio.info.length
    
    timings[beat_name] = {
        'dur': round(duration, 3),
        'marks': {},
        'cues': []
    }
    
    print(f'{beat_name}: {duration:.2f}s')

# 写入 timings.js
output_file = audio_dir / 'timings.js'
with open(output_file, 'w', encoding='utf-8') as f:
    f.write('window.TIMINGS = ')
    json.dump(timings, f, indent=1, ensure_ascii=False)
    f.write(';\n')

print(f'\n✓ Timings written to {output_file}')
total_duration = sum(t['dur'] for t in timings.values())
print(f'Total duration: {total_duration:.1f}s ({total_duration/60:.1f} min)')
