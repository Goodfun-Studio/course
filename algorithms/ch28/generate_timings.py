#!/usr/bin/env python3
import json
import subprocess
from pathlib import Path

def get_audio_duration(audio_file):
    """获取音频时长（秒）"""
    cmd = ['ffprobe', '-v', 'error', '-show_entries', 
           'format=duration', '-of', 
           'default=noprint_wrappers=1:nokey=1', str(audio_file)]
    result = subprocess.run(cmd, capture_output=True, text=True)
    return float(result.stdout.strip())

def generate_timings():
    """生成 timings.js 文件"""
    
    # 读取旁白
    with open('narration.zh.json', 'r', encoding='utf-8') as f:
        narration = json.load(f)
    
    audio_dir = Path('audio/zh')
    
    # 生成 marks
    marks = []
    cumulative_time = 0
    
    for beat_id in narration.keys():
        audio_file = audio_dir / f'{beat_id}.mp3'
        
        if audio_file.exists():
            duration = get_audio_duration(audio_file)
            marks.append({
                'audio': beat_id,
                'time': round(cumulative_time, 2)
            })
            cumulative_time += duration
        else:
            print(f'警告: {audio_file} 不存在')
    
    # 生成 JavaScript 文件
    js_content = f'''// Auto-generated timings
window.MARKS = {json.dumps(marks, indent=2, ensure_ascii=False)};
'''
    
    output_file = audio_dir / 'timings.js'
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(js_content)
    
    print(f'timings.js 已生成，总时长: {cumulative_time:.1f} 秒 ({cumulative_time/60:.1f} 分钟)')
    print(f'包含 {len(marks)} 个 beat')

if __name__ == '__main__':
    generate_timings()
