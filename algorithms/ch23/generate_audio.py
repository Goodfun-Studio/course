#!/usr/bin/env python3
import json
import os
import sys
import subprocess

def generate_audio():
    """生成章节音频文件"""
    script_dir = os.path.dirname(os.path.abspath(__file__))
    narration_file = os.path.join(script_dir, 'narration.zh.json')
    audio_dir = os.path.join(script_dir, 'audio', 'zh')
    
    # 确保音频目录存在
    os.makedirs(audio_dir, exist_ok=True)
    
    # 读取旁白文本
    with open(narration_file, 'r', encoding='utf-8') as f:
        narration = json.load(f)
    
    print(f"生成 {len(narration)} 个音频文件...")
    
    # 为每个beat生成音频
    for beat_id, text in narration.items():
        # 移除标记
        clean_text = text.replace('[[', '').replace(']]', '')
        
        output_file = os.path.join(audio_dir, f'{beat_id}.mp3')
        
        # 使用 say 命令生成音频（macOS）
        # 如果需要使用其他TTS引擎，修改这里
        try:
            # macOS say命令：使用中文语音
            subprocess.run([
                'say',
                '-v', 'Ting-Ting',  # 中文语音
                '-o', output_file.replace('.mp3', '.aiff'),
                clean_text
            ], check=True)
            
            # 转换为mp3
            subprocess.run([
                'ffmpeg',
                '-i', output_file.replace('.mp3', '.aiff'),
                '-y',
                output_file
            ], check=True, capture_output=True)
            
            # 删除临时aiff文件
            os.remove(output_file.replace('.mp3', '.aiff'))
            
            print(f"✓ {beat_id}.mp3")
        except Exception as e:
            print(f"✗ {beat_id}: {e}")
    
    print("\n音频生成完成！")
    print("注意：请使用专业TTS服务生成高质量音频")

if __name__ == '__main__':
    generate_audio()
