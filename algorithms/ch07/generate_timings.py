#!/usr/bin/env python3
"""Extract audio durations and generate timings.js."""

import json
from pathlib import Path
from mutagen.mp3 import MP3

def generate_timings():
    """Generate timings.js from MP3 files."""
    audio_dir = Path(__file__).parent / "audio" / "zh"
    output_path = audio_dir / "timings.js"
    
    timings = {}
    
    for mp3_file in sorted(audio_dir.glob("*.mp3")):
        beat_id = mp3_file.stem
        audio = MP3(mp3_file)
        duration = audio.info.length
        
        timings[beat_id] = {
            "dur": round(duration, 3),
            "marks": {},
            "cues": [[0.1, ""]]  # Placeholder
        }
        
        print(f"{beat_id}: {duration:.3f}s")
    
    # Write timings.js
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write("window.TIMINGS = ")
        f.write(json.dumps(timings, indent=1, ensure_ascii=False))
        f.write(";\n")
    
    print(f"\n✓ Generated {output_path}")

if __name__ == "__main__":
    generate_timings()
