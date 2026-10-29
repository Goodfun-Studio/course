#!/usr/bin/env python3
import json
import os
import subprocess
import sys

def generate_audio():
    """从 narration.zh.json 生成音频文件"""
    
    # 读取旁白脚本
    with open('narration.zh.json', 'r', encoding='utf-8') as f:
        narration = json.load(f)
    
    # 创建音频目录
    os.makedirs('audio/zh', exist_ok=True)
    
    # 为每个 beat 生成音频
    for beat_id, text in narration.items():
        # 移除标记
        clean_text = text.replace('[[', '').replace(']]', ' ')
        
        output_file = f'audio/zh/{beat_id}.mp3'
        
        print(f'生成 {beat_id}.mp3...')
        
        # 使用 say 命令生成音频（macOS）
        # 或者使用其他 TTS 工具
        try:
            subprocess.run([
                'say', '-v', 'Ting-Ting', '-o', output_file,
                '--data-format=LEF32@22050', clean_text
            ], check=True)
            
            print(f'✓ {beat_id}.mp3 生成完成')
        except subprocess.CalledProcessError as e:
            print(f'✗ {beat_id}.mp3 生成失败: {e}')
            continue
    
    print('\n所有音频文件生成完成！')

if __name__ == '__main__':
    generate_audio()
