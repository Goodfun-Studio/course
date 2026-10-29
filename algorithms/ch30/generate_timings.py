#!/usr/bin/env python3
import json
import subprocess
import re

def get_audio_duration(filepath):
    """使用 ffprobe 获取音频时长（秒）"""
    result = subprocess.run([
        'ffprobe', '-v', 'error', '-show_entries', 
        'format=duration', '-of', 
        'default=noprint_wrappers=1:nokey=1', filepath
    ], capture_output=True, text=True)
    return float(result.stdout.strip())

def extract_marks(text):
    """提取文本中的 [[mark]] 标记"""
    marks = []
    pattern = r'\[\[([^\]]+)\]\]'
    for match in re.finditer(pattern, text):
        marks.append(match.group(1))
    return marks

def generate_timings():
    with open('narration.zh.json', 'r', encoding='utf-8') as f:
        narration = json.load(f)
    
    timings = {}
    
    for beat_id, text in narration.items():
        audio_file = f'audio/zh/{beat_id}.mp3'
        
        try:
            duration = get_audio_duration(audio_file)
            marks = extract_marks(text)
            
            if not marks:
                timings[beat_id] = {'audio': beat_id}
            else:
                # 均匀分布标记点
                mark_timings = {}
                interval = duration / (len(marks) + 1)
                for i, mark in enumerate(marks):
                    mark_timings[mark] = round((i + 1) * interval, 2)
                
                timings[beat_id] = {
                    'audio': beat_id,
                    'marks': mark_timings
                }
            
            print(f'{beat_id}: {duration:.2f}s, {len(marks)} marks')
        
        except Exception as e:
            print(f'Error processing {beat_id}: {e}')
            timings[beat_id] = {'audio': beat_id}
    
    # 生成 timings.js
    with open('audio/zh/timings.js', 'w', encoding='utf-8') as f:
        f.write('window.TIMINGS = ')
        f.write(json.dumps(timings, indent=2, ensure_ascii=False))
        f.write(';\n')
    
    print('\nGenerated audio/zh/timings.js')

if __name__ == '__main__':
    generate_timings()
