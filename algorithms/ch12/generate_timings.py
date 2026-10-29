#!/usr/bin/env python3
import json
import os
import re
from mutagen.mp3 import MP3

def generate_timings():
    with open('narration.zh.json', 'r', encoding='utf-8') as f:
        narrations = json.load(f)
    
    timings = {}
    
    for beat_id, text in narrations.items():
        audio_path = f'audio/zh/{beat_id}.mp3'
        
        if not os.path.exists(audio_path):
            print(f'⚠️  音频文件不存在: {audio_path}')
            continue
        
        audio = MP3(audio_path)
        duration = audio.info.length
        
        # 提取 [[mark]] 标记
        marks = {}
        pattern = r'\[\[(\w+)\]\]'
        matches = re.finditer(pattern, text)
        
        mark_positions = []
        for match in matches:
            mark_name = match.group(1)
            # 计算标记在文本中的相对位置
            pos_ratio = match.start() / len(text)
            mark_time = pos_ratio * duration
            marks[mark_name] = round(mark_time, 2)
            mark_positions.append((mark_name, mark_time))
        
        timings[beat_id] = {
            'dur': round(duration, 2),
            'marks': marks,
            'cues': []
        }
        
        print(f'✓ {beat_id}: {duration:.2f}s, {len(marks)} marks')
    
    # 生成 timings.js
    output = 'audio/zh/timings.js'
    with open(output, 'w', encoding='utf-8') as f:
        f.write('window.TIMINGS = ')
        f.write(json.dumps(timings, indent=2, ensure_ascii=False))
        f.write(';\n')
    
    print(f'\n✓ 已生成 {output}')
    
    # 计算总时长
    total_dur = sum(t['dur'] for t in timings.values())
    print(f'✓ 总时长: {total_dur / 60:.1f} 分钟')

if __name__ == '__main__':
    generate_timings()
