#!/usr/bin/env python3
import json
import os
import subprocess
import re

def generate_audio(narration_file, output_dir):
    with open(narration_file, 'r', encoding='utf-8') as f:
        narrations = json.load(f)
    
    os.makedirs(output_dir, exist_ok=True)
    
    for beat_id, text in narrations.items():
        # 移除标记 [[xxx]]
        clean_text = re.sub(r'\[\[.*?\]\]', '', text)
        
        output_file = os.path.join(output_dir, f'{beat_id}.mp3')
        
        # 使用 say 命令生成音频（macOS）
        subprocess.run([
            'say', '-v', 'Tingting', '-o', output_file.replace('.mp3', '.aiff'), clean_text
        ])
        
        # 转换为 mp3
        subprocess.run([
            'ffmpeg', '-i', output_file.replace('.mp3', '.aiff'), 
            '-acodec', 'libmp3lame', '-y', output_file
        ], capture_output=True)
        
        # 删除临时文件
        os.remove(output_file.replace('.mp3', '.aiff'))
        
        print(f'Generated: {beat_id}.mp3')

if __name__ == '__main__':
    generate_audio('narration.zh.json', 'audio/zh')
