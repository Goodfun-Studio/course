#!/usr/bin/env python3
"""
Generate audio files for chapter 34: AC Automaton
"""
import json
import os
import subprocess
from pathlib import Path

def generate_audio():
    """Generate audio files from narration script"""
    
    # Load narration
    with open('narration.zh.json', 'r', encoding='utf-8') as f:
        narration = json.load(f)
    
    # Create audio directory
    audio_dir = Path('audio/zh')
    audio_dir.mkdir(parents=True, exist_ok=True)
    
    print("Generating audio files for Chapter 34: AC Automaton")
    print("=" * 60)
    
    # Generate audio for each beat
    for beat_id, sentences in narration.items():
        output_file = audio_dir / f"{beat_id}.mp3"
        
        # Combine sentences
        text = "。".join(sentences) + "。"
        
        print(f"\n{beat_id}:")
        print(f"  Text: {text[:50]}...")
        print(f"  Output: {output_file}")
        
        # Use say command (macOS) or edge-tts (cross-platform)
        try:
            # Try edge-tts first (better quality)
            cmd = [
                'edge-tts',
                '--voice', 'zh-CN-YunxiNeural',
                '--text', text,
                '--write-media', str(output_file)
            ]
            subprocess.run(cmd, check=True, capture_output=True)
            print(f"  ✓ Generated with edge-tts")
        except (subprocess.CalledProcessError, FileNotFoundError):
            # Fallback to macOS say command
            try:
                cmd = ['say', '-v', 'Tingting', '-o', str(output_file.with_suffix('.aiff')), text]
                subprocess.run(cmd, check=True)
                
                # Convert to mp3
                cmd = ['ffmpeg', '-i', str(output_file.with_suffix('.aiff')), 
                       '-acodec', 'libmp3lame', '-ab', '128k', str(output_file), '-y']
                subprocess.run(cmd, check=True, capture_output=True)
                
                # Remove aiff
                output_file.with_suffix('.aiff').unlink()
                print(f"  ✓ Generated with say")
            except (subprocess.CalledProcessError, FileNotFoundError) as e:
                print(f"  ✗ Failed: {e}")
                # Create silent placeholder
                cmd = ['ffmpeg', '-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=mono',
                       '-t', '3', '-acodec', 'libmp3lame', str(output_file), '-y']
                try:
                    subprocess.run(cmd, check=True, capture_output=True)
                    print(f"  ⚠ Created silent placeholder")
                except:
                    print(f"  ✗ Could not create placeholder")
    
    print("\n" + "=" * 60)
    print("Audio generation complete!")
    print(f"Files saved to: {audio_dir}")

if __name__ == '__main__':
    generate_audio()
