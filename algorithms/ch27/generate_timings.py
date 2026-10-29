#!/usr/bin/env python3
import json
import os

def generate_timings():
    """生成 timings.js 文件"""
    
    # 读取旁白脚本
    with open('narration.zh.json', 'r', encoding='utf-8') as f:
        narration = json.load(f)
    
    # 提取所有标记点
    marks = {}
    
    for beat_id, text in narration.items():
        beat_marks = []
        parts = text.split('[[')
        
        for part in parts[1:]:
            if ']]' in part:
                mark_id = part.split(']]')[0]
                beat_marks.append(mark_id)
        
        if beat_marks:
            marks[beat_id] = beat_marks
    
    # 生成 timings.js
    js_content = '''/* 音频时间标记 - 自动生成 */
window.MARKS = {
'''
    
    for beat_id, beat_marks in marks.items():
        js_content += f"  '{beat_id}': {{\n"
        js_content += f"    audio: '{beat_id}',\n"
        js_content += f"    marks: {json.dumps(beat_marks)}\n"
        js_content += "  },\n"
    
    js_content += '};\n'
    
    # 写入文件
    os.makedirs('audio/zh', exist_ok=True)
    with open('audio/zh/timings.js', 'w', encoding='utf-8') as f:
        f.write(js_content)
    
    print('✓ timings.js 生成完成')
    print(f'✓ 共 {len(marks)} 个 beat')
    print(f'✓ 共 {sum(len(m) for m in marks.values())} 个时间标记')

if __name__ == '__main__':
    generate_timings()
