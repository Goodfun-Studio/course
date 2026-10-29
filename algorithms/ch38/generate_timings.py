#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
生成 timings.js 文件
"""
import json

def main():
    # 读取旁白脚本
    with open('narration.zh.json', 'r', encoding='utf-8') as f:
        narration = json.load(f)
    
    # 生成 timings 数据
    timings = {}
    
    for beat_id, text in narration.items():
        # 移除标记获取纯文本
        clean_text = text
        for marker in ['[[', ']]']:
            clean_text = clean_text.replace(marker, '')
        
        # 估算时长（约5字/秒）
        duration = len(clean_text) / 5.0
        
        timings[beat_id] = {
            'audio': beat_id,
            'duration': round(duration, 1)
        }
    
    # 生成 JavaScript 文件
    js_content = f"""// Auto-generated timings for chapter 38
window.TIMINGS = {{
"""
    
    for beat_id, timing in timings.items():
        js_content += f"  '{beat_id}': {{ audio: '{timing['audio']}' }},\n"
    
    js_content += "};\n"
    
    # 写入文件
    with open('audio/zh/timings.js', 'w', encoding='utf-8') as f:
        f.write(js_content)
    
    print(f"✓ 生成 timings.js 完成")
    print(f"  总共 {len(timings)} 个 beat")
    
    total_duration = sum(t['duration'] for t in timings.values())
    print(f"  预计总时长: {total_duration:.1f} 秒 ({total_duration/60:.1f} 分钟)")

if __name__ == '__main__':
    main()
