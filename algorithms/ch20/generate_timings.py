#!/usr/bin/env python3
"""生成第20章时间轴文件"""
import json
import sys
import os

# 添加父目录到路径
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from scripts.timing_generator import generate_timings_for_chapter

def main():
    chapter_dir = os.path.dirname(os.path.abspath(__file__))
    audio_dir = os.path.join(chapter_dir, 'audio', 'zh')
    
    # Beat ID列表（与index.html中的BEATS顺序一致）
    beat_ids = [
        'intro',
        'definition',
        'dp-idea',
        'dp-demo',
        'dp-code',
        'greedy-idea',
        'binary-demo',
        'binary-code',
        'path',
        'applications',
        'variants',
        'finish'
    ]
    
    generate_timings_for_chapter(
        chapter_number=20,
        audio_dir=audio_dir,
        beat_ids=beat_ids,
        language='zh'
    )

if __name__ == '__main__':
    main()
