#!/usr/bin/env python3
import re

# 读取原文件
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 读取修复后的partition_demo
with open('/tmp/partition_demo_fixed.js', 'r', encoding='utf-8') as f:
    fixed_beat = f.read()

# 找到partition_demo的开始和结束
pattern = r"(\['partition_demo'.*?\n\}\],\n)"
match = re.search(pattern, content, re.DOTALL)

if match:
    old_beat = match.group(1)
    print(f"Found old beat: {len(old_beat)} chars")
    print(f"Fixed beat: {len(fixed_beat)} chars")
    
    # 替换
    new_content = content.replace(old_beat, fixed_beat)
    
    # 写回
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print("✓ Replaced partition_demo beat")
else:
    print("✗ Pattern not found")
