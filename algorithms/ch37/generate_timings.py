#!/usr/bin/env python3
"""生成第37章时间标记"""
import json
import subprocess
from pathlib import Path

def get_audio_duration(audio_file):
    """获取音频文件时长（秒）"""
    try:
        result = subprocess.run([
            'ffprobe', '-v', 'error',
            '-show_entries', 'format=duration',
            '-of', 'default=noprint_wrappers=1:nokey=1',
            str(audio_file)
        ], capture_output=True, text=True, check=True)
        return float(result.stdout.strip())
    except:
        return 0.0

def generate_timings():
    """生成timings.js文件"""
    
    # 读取旁白脚本获取beat顺序
    with open('narration.zh.json', 'r', encoding='utf-8') as f:
        narration = json.load(f)
    
    audio_dir = Path('audio/zh')
    
    # 生成marks数组
    marks = []
    
    for beat_id in narration.keys():
        audio_file = audio_dir / f"{beat_id}.mp3"
        
        if audio_file.exists():
            duration = get_audio_duration(audio_file)
            mark = {
                'audio': beat_id
            }
            marks.append(mark)
            print(f"{beat_id}: {duration:.2f}秒")
        else:
            print(f"警告: 未找到音频文件 {audio_file}")
    
    # 生成JavaScript文件
    js_content = f"""/* 第37章：博弈论基础 - 音频时间标记 */
const marks_zh = {json.dumps(marks, indent=2, ensure_ascii=False)};
"""
    
    output_file = audio_dir / 'timings.js'
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(js_content)
    
    print(f"\n生成完成: {output_file}")
    print(f"共 {len(marks)} 个beat")

if __name__ == '__main__':
    generate_timings()
