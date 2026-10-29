#!/usr/bin/env python3
"""生成 timings.js 文件"""
import json
import subprocess
from pathlib import Path
import sys

def get_audio_duration(audio_file):
    """使用 ffprobe 获取音频时长"""
    cmd = [
        'ffprobe',
        '-v', 'error',
        '-show_entries', 'format=duration',
        '-of', 'default=noprint_wrappers=1:nokey=1',
        str(audio_file)
    ]
    
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        return float(result.stdout.strip())
    except Exception as e:
        print(f'警告: 无法获取 {audio_file} 的时长: {e}')
        return 0

def generate_timings(audio_dir, output_file):
    """生成 timings.js"""
    audio_dir = Path(audio_dir)
    
    if not audio_dir.exists():
        print(f'错误: 音频目录不存在: {audio_dir}')
        return False
    
    # 读取 narration.zh.json 获取 beat 顺序
    narration_file = audio_dir.parent.parent / 'narration.zh.json'
    with open(narration_file, 'r', encoding='utf-8') as f:
        narrations = json.load(f)
    
    marks = {}
    
    for beat_id in narrations.keys():
        audio_file = audio_dir / f'{beat_id}.mp3'
        
        if audio_file.exists():
            duration = get_audio_duration(audio_file)
            marks[beat_id] = {'audio': beat_id}
            print(f'{beat_id}: {duration:.2f}s')
        else:
            print(f'警告: 找不到 {audio_file}')
            marks[beat_id] = {'audio': beat_id}
    
    # 生成 timings.js
    output_file = Path(output_file)
    output_file.parent.mkdir(parents=True, exist_ok=True)
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write('const MARKS = ')
        json.dump(marks, f, ensure_ascii=False, indent=2)
        f.write(';\n')
    
    print(f'\n已生成 {output_file}')
    return True

if __name__ == '__main__':
    script_dir = Path(__file__).parent
    audio_dir = script_dir / 'audio' / 'zh'
    output_file = audio_dir / 'timings.js'
    
    success = generate_timings(audio_dir, output_file)
    sys.exit(0 if success else 1)
