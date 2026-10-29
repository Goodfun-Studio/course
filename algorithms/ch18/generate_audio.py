#!/usr/bin/env python3
"""
使用 edge-tts 生成音频文件
"""
import json
import os
import subprocess
import re

def clean_text(text):
    """移除标记，提取纯文本"""
    # 移除 [[mark]] 标记
    text = re.sub(r'\[\[.*?\]\]', '', text)
    return text.strip()

def generate_audio(text, output_file, voice='zh-CN-XiaoxiaoNeural'):
    """使用 edge-tts 生成音频"""
    cleaned_text = clean_text(text)
    if not cleaned_text:
        return
    
    print(f"生成: {output_file}")
    cmd = [
        'edge-tts',
        '--voice', voice,
        '--text', cleaned_text,
        '--write-media', output_file
    ]
    subprocess.run(cmd, check=True, capture_output=True)

def extract_timings(text):
    """从文本中提取时间标记"""
    marks = {}
    pattern = r'\[\[(.*?)\]\]'
    matches = re.finditer(pattern, text)
    
    # 简单估算：每个字0.3秒
    current_time = 0.0
    clean_before = ""
    
    for match in matches:
        mark_name = match.group(1)
        text_before = text[:match.start()]
        cleaned_text_before = re.sub(r'\[\[.*?\]\]', '', text_before)
        chars_added = len(cleaned_text_before) - len(clean_before)
        current_time += chars_added * 0.3
        marks[mark_name] = round(current_time, 1)
        clean_before = cleaned_text_before
    
    # 计算总时长
    full_clean = clean_text(text)
    total_dur = round(len(full_clean) * 0.3, 2)
    
    return {
        'dur': total_dur,
        'marks': marks,
        'cues': []
    }

def main():
    # 读取 narration.zh.json
    script_dir = os.path.dirname(os.path.abspath(__file__))
    narration_file = os.path.join(script_dir, 'narration.zh.json')
    audio_dir = os.path.join(script_dir, 'audio', 'zh')
    
    os.makedirs(audio_dir, exist_ok=True)
    
    with open(narration_file, 'r', encoding='utf-8') as f:
        narrations = json.load(f)
    
    timings = {}
    
    for beat_id, text in narrations.items():
        # 生成音频
        audio_file = os.path.join(audio_dir, f'{beat_id}.mp3')
        generate_audio(text, audio_file)
        
        # 提取时间标记
        timings[beat_id] = extract_timings(text)
    
    # 生成 timings.js
    timings_file = os.path.join(audio_dir, 'timings.js')
    with open(timings_file, 'w', encoding='utf-8') as f:
        f.write('window.TIMINGS = ')
        f.write(json.dumps(timings, indent=2, ensure_ascii=False))
        f.write(';\n')
    
    print(f"\n✓ 音频生成完成！")
    print(f"✓ 共生成 {len(narrations)} 个音频文件")
    print(f"✓ timings.js 已创建")

if __name__ == '__main__':
    main()
