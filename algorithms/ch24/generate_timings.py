#!/usr/bin/env python3
import json
import subprocess
from pathlib import Path

def get_audio_duration(audio_file):
    """Get audio duration in seconds using afinfo"""
    try:
        result = subprocess.run(
            ['afinfo', str(audio_file)],
            capture_output=True,
            text=True,
            check=True
        )
        for line in result.stdout.split('\n'):
            if 'estimated duration' in line.lower():
                duration_str = line.split(':')[1].strip().split()[0]
                return float(duration_str)
    except Exception as e:
        print(f"Error getting duration for {audio_file}: {e}")
        return 0
    return 0

def generate_timings():
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
            marks.append(f"  {{ audio: '{beat_id}' }}")
        else:
            print(f"Warning: {audio_file} not found")
    
    # 手动构建字符串，避免f-string转义问题
    js_content = "const marks = [\n"
    js_content += ",\n".join(marks)
    js_content += "\n];\n"
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(js_content)
    
    print(f'Generated {output_file}')

if __name__ == '__main__':
    generate_timings()
