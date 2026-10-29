#!/usr/bin/env python3
import json
import os
import subprocess

def generate_audio():
    with open('narration.zh.json', 'r', encoding='utf-8') as f:
        narration = json.load(f)
    
    os.makedirs('audio/zh', exist_ok=True)
    
    for beat_id, text in narration.items():
        # 移除标记
        clean_text = text
        while '[[' in clean_text and ']]' in clean_text:
            start = clean_text.find('[[')
            end = clean_text.find(']]', start)
            if start != -1 and end != -1:
                clean_text = clean_text[:start] + clean_text[end+2:]
        
        output_file = f'audio/zh/{beat_id}.mp3'
        
        # 使用 macOS say 命令生成音频
        subprocess.run([
            'say', '-v', 'Tingting', '-o', output_file.replace('.mp3', '.aiff'),
            '--data-format=LEF32@22050', clean_text
        ])
        
        # 转换为 mp3
        subprocess.run([
            'ffmpeg', '-i', output_file.replace('.mp3', '.aiff'),
            '-acodec', 'libmp3lame', '-ab', '128k', output_file, '-y'
        ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        
        # 删除中间文件
        os.remove(output_file.replace('.mp3', '.aiff'))
        
        print(f'Generated: {output_file}')

if __name__ == '__main__':
    generate_audio()
