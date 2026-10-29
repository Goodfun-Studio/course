#!/usr/bin/env python3
"""生成第35章的音频文件"""
import json
import subprocess
import sys
from pathlib import Path

def generate_audio(narration_file, output_dir):
    """使用 edge-tts 生成音频"""
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)
    
    with open(narration_file, 'r', encoding='utf-8') as f:
        narrations = json.load(f)
    
    voice = 'zh-CN-YunxiNeural'  # 男声
    
    for beat_id, text in narrations.items():
        output_file = output_dir / f'{beat_id}.mp3'
        print(f'生成 {beat_id}.mp3 ...')
        
        cmd = [
            'edge-tts',
            '--voice', voice,
            '--text', text,
            '--write-media', str(output_file)
        ]
        
        try:
            subprocess.run(cmd, check=True, capture_output=True)
            print(f'  ✓ 完成')
        except subprocess.CalledProcessError as e:
            print(f'  ✗ 失败: {e}')
            return False
    
    print(f'\n所有音频已生成到 {output_dir}')
    return True

if __name__ == '__main__':
    script_dir = Path(__file__).parent
    narration_file = script_dir / 'narration.zh.json'
    output_dir = script_dir / 'audio' / 'zh'
    
    if not narration_file.exists():
        print(f'错误: 找不到 {narration_file}')
        sys.exit(1)
    
    success = generate_audio(narration_file, output_dir)
    sys.exit(0 if success else 1)
