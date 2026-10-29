#!/usr/bin/env python3
"""生成第37章音频文件"""
import json
import os
import subprocess
from pathlib import Path

def generate_audio():
    """为每个beat生成音频文件"""
    
    # 读取旁白脚本
    with open('narration.zh.json', 'r', encoding='utf-8') as f:
        narration = json.load(f)
    
    # 确保输出目录存在
    audio_dir = Path('audio/zh')
    audio_dir.mkdir(parents=True, exist_ok=True)
    
    # 为每个beat生成音频
    for beat_id, text in narration.items():
        output_file = audio_dir / f"{beat_id}.mp3"
        
        print(f"生成音频: {beat_id}.mp3")
        
        # 使用macOS的say命令生成音频
        # 使用Ting-Ting（中文女声）
        try:
            # 先生成aiff文件
            temp_file = str(output_file).replace('.mp3', '.aiff')
            subprocess.run([
                'say',
                '-v', 'Ting-Ting',
                '-o', temp_file,
                text
            ], check=True)
            
            # 转换为mp3
            if os.path.exists(temp_file):
                subprocess.run([
                    'ffmpeg', '-i', temp_file, '-acodec', 'libmp3lame',
                    '-b:a', '128k', str(output_file), '-y'
                ], check=True, capture_output=True)
                os.remove(temp_file)
                
        except subprocess.CalledProcessError as e:
            print(f"警告: 生成 {beat_id} 音频失败: {e}")
            continue
    
    print("\n音频生成完成！")
    print(f"共生成 {len(narration)} 个音频文件")

if __name__ == '__main__':
    generate_audio()
