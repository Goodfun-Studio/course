#!/usr/bin/env python3
import json
import subprocess
import re
import os

def get_audio_duration(audio_file):
    """获取音频文件时长（秒）"""
    result = subprocess.run(
        ['ffprobe', '-v', 'error', '-show_entries', 'format=duration',
         '-of', 'default=noprint_wrappers=1:nokey=1', audio_file],
        capture_output=True, text=True
    )
    return float(result.stdout.strip())

def parse_marks(text):
    """解析文本中的标记 [[mark]]，返回标记列表"""
    return re.findall(r'\[\[([^\]]+)\]\]', text)

def generate_timings(narration_file, audio_dir, output_file):
    with open(narration_file, 'r', encoding='utf-8') as f:
        narrations = json.load(f)
    
    timings = {}
    
    for beat_id, text in narrations.items():
        audio_file = os.path.join(audio_dir, f'{beat_id}.mp3')
        
        if not os.path.exists(audio_file):
            print(f'Warning: {audio_file} not found, skipping')
            continue
        
        duration = get_audio_duration(audio_file)
        marks = parse_marks(text)
        
        if not marks:
            timings[beat_id] = {
                'audio': beat_id,
                'marks': {}
            }
            continue
        
        # 均匀分配时间点
        mark_timings = {}
        for i, mark in enumerate(marks):
            time_point = (i + 1) * duration / (len(marks) + 1)
            mark_timings[mark] = round(time_point, 2)
        
        timings[beat_id] = {
            'audio': beat_id,
            'marks': mark_timings
        }
        
        print(f'Processed: {beat_id} ({duration:.2f}s, {len(marks)} marks)')
    
    # 生成 JavaScript 文件
    js_content = f'const TIMINGS = {json.dumps(timings, indent=2, ensure_ascii=False)};\n'
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(js_content)
    
    print(f'\nGenerated: {output_file}')

if __name__ == '__main__':
    generate_timings('narration.zh.json', 'audio/zh', 'audio/zh/timings.js')
