#!/usr/bin/env python3
"""Generate timings.js from audio files"""
import json
from pathlib import Path
from mutagen.mp3 import MP3

AUDIO_DIR = Path(__file__).parent / "audio" / "zh"

def get_duration(mp3_path):
    """Get duration of MP3 file in seconds"""
    audio = MP3(mp3_path)
    return round(audio.info.length, 3)

def main():
    timings = {}
    
    # Get all MP3 files
    mp3_files = sorted(AUDIO_DIR.glob("*.mp3"))
    
    for mp3_file in mp3_files:
        beat_id = mp3_file.stem
        duration = get_duration(mp3_file)
        
        timings[beat_id] = {
            "dur": duration,
            "marks": {},
            "cues": [[0.1, ""]]
        }
        print(f"{beat_id}: {duration}s")
    
    # Write timings.js
    output_file = AUDIO_DIR / "timings.js"
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("window.TIMINGS = ")
        json.dump(timings, f, indent=1)
        f.write(";\n")
    
    total = sum(t["dur"] for t in timings.values())
    print(f"\n✓ Total duration: {total:.1f}s ({total/60:.1f} minutes)")
    print(f"✓ Generated {output_file}")

if __name__ == "__main__":
    main()
