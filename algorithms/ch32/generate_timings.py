#!/usr/bin/env python3
"""Generate timings.js from audio files."""
import json
import subprocess
from pathlib import Path

def get_audio_duration(audio_file):
    """Get duration of audio file in seconds using ffprobe."""
    result = subprocess.run([
        'ffprobe',
        '-v', 'error',
        '-show_entries', 'format=duration',
        '-of', 'default=noprint_wrappers=1:nokey=1',
        str(audio_file)
    ], capture_output=True, text=True, check=True)
    return float(result.stdout.strip())

def main():
    script_dir = Path(__file__).parent
    audio_dir = script_dir / 'audio' / 'zh'
    narration_file = script_dir / 'narration.zh.json'
    output_file = audio_dir / 'timings.js'
    
    with open(narration_file, 'r', encoding='utf-8') as f:
        narration = json.load(f)
    
    marks = []
    for beat_id in narration.keys():
        audio_file = audio_dir / f'{beat_id}.mp3'
        if audio_file.exists():
            duration = get_audio_duration(audio_file)
            marks.append({
                'audio': beat_id
            })
            print(f'{beat_id}: {duration:.2f}s')
        else:
            print(f'Warning: {audio_file.name} not found')
    
    # Generate timings.js
    js_content = f"marks = {json.dumps(marks, indent=2, ensure_ascii=False)};\n"
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(js_content)
    
    print(f'\n✓ Generated {output_file}')
    print(f'✓ Total beats: {len(marks)}')

if __name__ == '__main__':
    main()
