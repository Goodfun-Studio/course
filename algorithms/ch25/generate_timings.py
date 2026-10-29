#!/usr/bin/env python3
import json
import subprocess
import os

# 读取旁白脚本
with open('narration.zh.json', 'r', encoding='utf-8') as f:
    narration = json.load(f)

# 生成timings
timings = {}

for beat_id in narration.keys():
    audio_file = f'audio/zh/{beat_id}.mp3'
    
    if os.path.exists(audio_file):
        # 获取音频时长
        result = subprocess.run([
            'ffprobe', '-v', 'error',
            '-show_entries', 'format=duration',
            '-of', 'default=noprint_wrappers=1:nokey=1',
            audio_file
        ], capture_output=True, text=True)
        
        duration = float(result.stdout.strip())
        
        # 解析标记点
        text = narration[beat_id]
        marks = {}
        
        import re
        pattern = r'\[\[([^\]]+)\]\]'
        matches = list(re.finditer(pattern, text))
        
        if matches:
            for i, match in enumerate(matches):
                mark_name = match.group(1)
                # 均匀分布标记点
                time_offset = (duration / len(matches)) * i
                marks[mark_name] = round(time_offset, 2)
        
        timings[beat_id] = {
            'duration': round(duration, 2),
            'marks': marks
        }
    else:
        print(f'Warning: {audio_file} not found')
        timings[beat_id] = {
            'duration': 10.0,
            'marks': {}
        }

# 生成JavaScript文件
js_content = f"const timings = {json.dumps(timings, indent=2, ensure_ascii=False)};\n"

with open('audio/zh/timings.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print('Timings generated!')
print(f'Total beats: {len(timings)}')
