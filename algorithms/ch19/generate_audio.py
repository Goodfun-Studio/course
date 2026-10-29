#!/usr/bin/env python3
"""Generate MP3 audio files from narration script using Edge TTS."""

import asyncio
import json
import edge_tts
from pathlib import Path

VOICE = "zh-CN-YunxiNeural"
RATE = "+0%"
PITCH = "+0Hz"

async def generate_audio():
    """Generate all audio files from narration.zh.json."""
    script_path = Path(__file__).parent / "narration.zh.json"
    output_dir = Path(__file__).parent / "audio" / "zh"
    
    with open(script_path, 'r', encoding='utf-8') as f:
        narration = json.load(f)
    
    output_dir.mkdir(parents=True, exist_ok=True)
    
    for beat_id, text in narration.items():
        output_path = output_dir / f"{beat_id}.mp3"
        print(f"Generating {beat_id}.mp3...")
        
        # Remove [[mark]] tags for TTS
        clean_text = text.replace('[[', '').replace(']]', '')
        
        communicate = edge_tts.Communicate(
            clean_text, 
            VOICE,
            rate=RATE,
            pitch=PITCH
        )
        
        await communicate.save(str(output_path))
        print(f"  → {output_path}")
    
    print("\n✓ All audio files generated!")

if __name__ == "__main__":
    asyncio.run(generate_audio())
