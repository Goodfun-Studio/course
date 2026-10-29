#!/usr/bin/env python3
import json
import subprocess
import os

# 读取旁白脚本
with open('narration.zh.json', 'r', encoding='utf-8') as f:
    narration = json.load(f)

# 创建音频目录
os.makedirs('audio/zh', exist_ok=True)

# 为每个beat生成音频
for beat_id, text in narration.items():
    # 移除标记
    clean_text = text.replace('[[', '').replace(']]', '')
    
    output_file = f'audio/zh/{beat_id}.mp3'
    
    # 使用macOS的say命令生成音频
    # 使用Ting-Ting (中文女声)
    subprocess.run([
        'say',
        '-v', 'Ting-Ting',
        '-o', output_file.replace('.mp3', '.aiff'),
        '--data-format=LEF32@22050',
        clean_text
    ])
    
    # 转换为mp3
    subprocess.run([
        'ffmpeg', '-i', output_file.replace('.mp3', '.aiff'),
        '-acodec', 'libmp3lame', '-ab', '128k',
        output_file, '-y'
    ], capture_output=True)
    
    # 删除临时aiff文件
    os.remove(output_file.replace('.mp3', '.aiff'))
    
    print(f'Generated: {output_file}')

print('Audio generation complete!')
