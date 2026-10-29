#!/usr/bin/env python3
import json
import subprocess
import sys
from pathlib import Path

def generate_audio():
    """为每个 beat 生成音频文件"""
    
    # 读取旁白
    with open('narration.zh.json', 'r', encoding='utf-8') as f:
        narration = json.load(f)
    
    output_dir = Path('audio/zh')
    output_dir.mkdir(parents=True, exist_ok=True)
    
    for beat_id, text in narration.items():
        output_file = output_dir / f'{beat_id}.mp3'
        
        # 使用 edge-tts 生成音频
        cmd = [
            'edge-tts',
            '--voice', 'zh-CN-YunxiNeural',
            '--text', text,
            '--write-media', str(output_file)
        ]
        
        print(f'生成 {beat_id}.mp3...')
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode != 0:
            print(f'错误: {result.stderr}', file=sys.stderr)
            return False
    
    print('所有音频文件生成完成！')
    return True

if __name__ == '__main__':
    success = generate_audio()
    sys.exit(0 if success else 1)
