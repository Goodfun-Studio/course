#!/usr/bin/env python3
"""Generate audio files from narration.zh.json using TTS."""
import json
import subprocess
from pathlib import Path

def main():
    script_dir = Path(__file__).parent
    narration_file = script_dir / 'narration.zh.json'
    audio_dir = script_dir / 'audio' / 'zh'
    audio_dir.mkdir(parents=True, exist_ok=True)
    
    with open(narration_file, 'r', encoding='utf-8') as f:
        narration = json.load(f)
    
    for beat_id, text in narration.items():
        output_file = audio_dir / f'{beat_id}.mp3'
        print(f'Generating {output_file.name}...')
        
        # Use macOS say command with Chinese voice
        subprocess.run([
            'say',
            '-v', 'Tingting',
            '-o', str(output_file.with_suffix('.aiff')),
            text
        ], check=True)
        
        # Convert to mp3 using ffmpeg
        subprocess.run([
            'ffmpeg',
            '-i', str(output_file.with_suffix('.aiff')),
            '-acodec', 'libmp3lame',
            '-ab', '128k',
            '-y',
            str(output_file)
        ], check=True, capture_output=True)
        
        # Remove temporary aiff file
        output_file.with_suffix('.aiff').unlink()
        print(f'  ✓ {output_file.name}')
    
    print(f'\n✓ Generated {len(narration)} audio files')

if __name__ == '__main__':
    main()
