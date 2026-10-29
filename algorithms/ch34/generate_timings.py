#!/usr/bin/env python3
"""
Generate timings.js for chapter 34: AC Automaton
"""
import json
import subprocess
from pathlib import Path

def get_audio_duration(audio_file):
    """Get duration of audio file in seconds using ffprobe"""
    try:
        cmd = [
            'ffprobe',
            '-v', 'error',
            '-show_entries', 'format=duration',
            '-of', 'default=noprint_wrappers=1:nokey=1',
            str(audio_file)
        ]
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        return float(result.stdout.strip())
    except:
        # Default fallback duration
        return 15.0

def generate_timings():
    """Generate timings.js from audio files"""
    
    audio_dir = Path('audio/zh')
    
    # Load narration to get beat order
    with open('narration.zh.json', 'r', encoding='utf-8') as f:
        narration = json.load(f)
    
    print("Generating timings.js for Chapter 34: AC Automaton")
    print("=" * 60)
    
    marks = {}
    
    for beat_id in narration.keys():
        audio_file = audio_dir / f"{beat_id}.mp3"
        
        if audio_file.exists():
            duration = get_audio_duration(audio_file)
            print(f"{beat_id}: {duration:.2f}s")
        else:
            duration = 15.0
            print(f"{beat_id}: {duration:.2f}s (estimated, file not found)")
        
        marks[beat_id] = {
            'audio': beat_id
        }
    
    # Write timings.js
    output_file = audio_dir / 'timings.js'
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("// Auto-generated timings for Chapter 34: AC Automaton\n")
        f.write("const MARKS = ")
        f.write(json.dumps(marks, ensure_ascii=False, indent=2))
        f.write(";\n")
    
    print("\n" + "=" * 60)
    print(f"Timings saved to: {output_file}")

if __name__ == '__main__':
    generate_timings()
