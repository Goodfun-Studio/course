#!/usr/bin/env python3
"""Generate audio files from narration.zh.json using Edge TTS"""
import json
import asyncio
import edge_tts
from pathlib import Path

VOICE = "zh-CN-YunxiNeural"
OUTPUT_DIR = Path(__file__).parent / "audio" / "zh"

async def generate_audio(text: str, output_path: Path):
    """Generate audio file from text"""
    communicate = edge_tts.Communicate(text, VOICE)
    await communicate.save(str(output_path))
    print(f"✓ {output_path.name}")

async def main():
    # Load narration
    narration_file = Path(__file__).parent / "narration.zh.json"
    with open(narration_file, 'r', encoding='utf-8') as f:
        narrations = json.load(f)
    
    # Create output directory
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    # Generate all audio files
    tasks = []
    for beat_id, text in narrations.items():
        # Remove [[mark]] tags for TTS
        clean_text = text.replace('[[', '').replace(']]', '')
        output_path = OUTPUT_DIR / f"{beat_id}.mp3"
        tasks.append(generate_audio(clean_text, output_path))
    
    await asyncio.gather(*tasks)
    print(f"\n✓ Generated {len(tasks)} audio files")

if __name__ == "__main__":
    asyncio.run(main())
