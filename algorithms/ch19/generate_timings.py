#!/usr/bin/env python3
"""生成 timings.js 文件"""
import json
import os
from mutagen.mp3 import MP3

def generate_timings():
    """从音频文件和旁白脚本生成 timings.js"""
    with open('narration.zh.json', 'r', encoding='utf-8') as f:
        narrations = json.load(f)
    
    timings = {}
    
    for beat_id, text in narrations.items():
        audio_path = f'audio/zh/{beat_id}.mp3'
        
        if not os.path.exists(audio_path):
            print(f'⚠️  音频文件不存在: {audio_path}')
            continue
        
        # 获取音频时长
        audio = MP3(audio_path)
        duration = audio.info.length
        
        # 提取标记点
        marks = {}
        import re
        mark_pattern = r'\[\[(\w+-?\w*)\]\]'
        matches = re.finditer(mark_pattern, text)
        
        # 简单估算：按字符位置比例分配时间
        text_clean = re.sub(mark_pattern, '', text)
        total_chars = len(text_clean)
        
        for match in re.finditer(mark_pattern, text):
            mark_name = match.group(1)
            position = match.start()
            # 计算在去掉标记后的位置
            chars_before = len(re.sub(mark_pattern, '', text[:position]))
            if total_chars > 0:
                mark_time = (chars_before / total_chars) * duration
                marks[mark_name] = round(mark_time, 2)
        
        timings[beat_id] = {
            'dur': round(duration, 2),
            'marks': marks,
            'cues': []
        }
        
        print(f'✅ {beat_id}: {duration:.2f}s, {len(marks)} marks')
    
    # 生成 timings.js
    output_path = 'audio/zh/timings.js'
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write('window.TIMINGS = ')
        json.dump(timings, f, indent=2, ensure_ascii=False)
        f.write(';\n')
    
    print(f'\n✅ timings.js 已生成: {output_path}')

if __name__ == '__main__':
    generate_timings()
