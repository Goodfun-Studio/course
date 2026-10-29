#!/usr/bin/env python3
"""生成第33章音频文件"""
import json
import subprocess
from pathlib import Path

def generate_audio():
    """使用 edge-tts 生成音频"""
    script_dir = Path(__file__).parent
    narration_file = script_dir / "narration.zh.json"
    audio_dir = script_dir / "audio" / "zh"
    audio_dir.mkdir(parents=True, exist_ok=True)
    
    with open(narration_file, 'r', encoding='utf-8') as f:
        narrations = json.load(f)
    
    voice = "zh-CN-YunxiNeural"  # 使用云希（男声）
    
    for beat_id, text in narrations.items():
        output_file = audio_dir / f"{beat_id}.mp3"
        
        if output_file.exists():
            print(f"跳过已存在: {output_file.name}")
            continue
        
        print(f"生成音频: {beat_id}")
        
        cmd = [
            "edge-tts",
            "--voice", voice,
            "--text", text,
            "--write-media", str(output_file)
        ]
        
        try:
            subprocess.run(cmd, check=True, capture_output=True, text=True)
            print(f"✓ 生成成功: {output_file.name}")
        except subprocess.CalledProcessError as e:
            print(f"✗ 生成失败: {beat_id}")
            print(f"错误: {e.stderr}")
            return False
    
    print("\n所有音频生成完成！")
    return True

if __name__ == "__main__":
    generate_audio()
