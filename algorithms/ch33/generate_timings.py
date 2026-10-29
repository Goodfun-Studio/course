#!/usr/bin/env python3
"""生成第33章 timings.js 文件"""
import json
import subprocess
from pathlib import Path

def get_audio_duration(audio_file):
    """使用 ffprobe 获取音频时长"""
    cmd = [
        'ffprobe',
        '-v', 'error',
        '-show_entries', 'format=duration',
        '-of', 'default=noprint_wrappers=1:nokey=1',
        str(audio_file)
    ]
    
    result = subprocess.run(cmd, capture_output=True, text=True)
    return float(result.stdout.strip())

def generate_timings():
    """生成 timings.js"""
    script_dir = Path(__file__).parent
    audio_dir = script_dir / "audio" / "zh"
    narration_file = script_dir / "narration.zh.json"
    output_file = audio_dir / "timings.js"
    
    with open(narration_file, 'r', encoding='utf-8') as f:
        narrations = json.load(f)
    
    marks = {}
    
    for beat_id in narrations.keys():
        audio_file = audio_dir / f"{beat_id}.mp3"
        
        if not audio_file.exists():
            print(f"警告: 音频文件不存在 {audio_file}")
            continue
        
        try:
            duration = get_audio_duration(audio_file)
            marks[beat_id] = {"audio": beat_id}
            print(f"✓ {beat_id}: {duration:.2f}s")
        except Exception as e:
            print(f"✗ 处理失败 {beat_id}: {e}")
    
    # 生成 timings.js
    js_content = f"const marks = {json.dumps(marks, indent=2, ensure_ascii=False)};\n"
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(js_content)
    
    print(f"\n✓ timings.js 已生成: {output_file}")

if __name__ == "__main__":
    generate_timings()
