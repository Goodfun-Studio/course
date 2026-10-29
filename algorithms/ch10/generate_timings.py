#!/usr/bin/env python3
"""
提取音频时长，生成 timings.js
"""
import json
from pathlib import Path
from mutagen.mp3 import MP3

AUDIO_DIR = Path(__file__).parent / "audio" / "zh"
OUTPUT_FILE = AUDIO_DIR / "timings.js"

def get_audio_duration(mp3_file: Path) -> float:
    """获取 MP3 文件时长（秒）"""
    audio = MP3(str(mp3_file))
    return audio.info.length

def main():
    timings = {}
    
    # 遍历所有 MP3 文件
    for mp3_file in sorted(AUDIO_DIR.glob("*.mp3")):
        beat_id = mp3_file.stem
        duration = get_audio_duration(mp3_file)
        
        # 使用正确的格式：对象而非单个数字
        timings[beat_id] = {
            "dur": round(duration, 2),
            "marks": {},
            "cues": []
        }
        
        print(f"{beat_id}: {duration:.2f}s")
    
    # 生成 timings.js
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write("window.TIMINGS = ")
        f.write(json.dumps(timings, indent=2, ensure_ascii=False))
        f.write(";\n")
    
    total_duration = sum(t["dur"] for t in timings.values())
    print(f"\n✅ 生成 timings.js")
    print(f"总时长: {total_duration / 60:.1f} 分钟")

if __name__ == "__main__":
    main()
