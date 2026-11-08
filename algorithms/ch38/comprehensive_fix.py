import re

# 读取 HTML
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 定义每个 beat 的替换规则（硬编码时间 -> mark 调用）
# 格式：(beat_id, 旧文本片段, 新文本片段)

fixes = [
    # structure beat
    ("structure", "tw(bitArray, { o: 1 }, 0.5);", "tw(bitArray, { o: 1 }, m('bit_array'));"),
    ("structure", "tw(bitNote, { o: 1 }, 1);", "tw(bitNote, { o: 1 }, m('initialization'));"),
    ("structure", "T(p, '2. k 个独立哈希函数', { x: 100, y: 300, size: 24, weight: 600, fill: PRIMARY, o: 0 });", 
     "const hashTitle = T(p, '2. k 个独立哈希函数', { x: 100, y: 300, size: 24, weight: 600, fill: PRIMARY, o: 0 });\n  tw(hashTitle, { o: 1 }, m('hash_functions'));"),
    ("structure", "tw(func, { o: 1 }, 1.5 + i * 0.3);", "tw(func, { o: 1 }, m(i === 0 ? 'hash_functions' : i === 1 ? 'mapping' : 'mapping'));"),
    ("structure", "tw(hashNote, { o: 1 }, 2.5);", "tw(hashNote, { o: 1 }, m('m_k'));"),
    ("structure", "tw(label, { o: 1 }, 3 + i * 0.3);", "tw(label, { o: 1 }, m(i === 0 ? 'm_k' : i === 1 ? 'n' : 'choice'));"),
    
    # insert_demo beat
    ("insert_demo", "tw(element, { o: 1 }, 0.5);", "tw(element, { o: 1 }, m('demo'));"),
    ("insert_demo", "tw(element, { y: 110 }, 1, 0.3);", "tw(element, { y: 110 }, m('apple'), 0.3);"),
    ("insert_demo", "tw(element, { y: 120 }, 1.3, 0.3);", "tw(element, { y: 120 }, m('hash'), 0.3);"),
    ("insert_demo", "tw(bitArray, { o: 1 }, 1);", "tw(bitArray, { o: 1 }, m('apple'));"),
    ("insert_demo", "tw(bitLabel, { o: 1 }, 1.5);", "tw(bitLabel, { o: 1 }, m('hash'));"),
    ("insert_demo", "tw(h1, { o: 1 }, 2);", "tw(h1, { o: 1 }, m('h1'));"),
    ("insert_demo", "tw(h2, { o: 1 }, 2.3);", "tw(h2, { o: 1 }, m('h2'));"),
    ("insert_demo", "tw(h3, { o: 1 }, 2.6);", "tw(h3, { o: 1 }, m('h3'));"),
]

# 应用修复
output = html
for beat_id, old_text, new_text in fixes:
    if old_text in output:
        output = output.replace(old_text, new_text)
        print(f"✓ Fixed in {beat_id}: {old_text[:50]}...")
    else:
        print(f"✗ Not found in {beat_id}: {old_text[:50]}...")

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(output)

print("\nPartial fix completed. Need manual completion for complex patterns.")
