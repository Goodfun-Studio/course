#!/usr/bin/env python3
"""生成第20章音频文件"""
import json
import sys
import os

# 添加父目录到路径以导入共享模块
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from scripts.audio_generator import generate_audio_for_chapter

def main():
    chapter_dir = os.path.dirname(os.path.abspath(__file__))
    narration_file = os.path.join(chapter_dir, 'narration.zh.json')
    
    with open(narration_file, 'r', encoding='utf-8') as f:
        narration = json.load(f)
    
    generate_audio_for_chapter(
        chapter_number=20,
        chapter_dir=chapter_dir,
        narration=narration,
        language='zh'
    )

if __name__ == '__main__':
    main()
