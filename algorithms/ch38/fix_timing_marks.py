import re
import json

# 读取 timings
with open('audio/zh/timings.js', 'r', encoding='utf-8') as f:
    timings_content = f.read()
    timings_json = timings_content.replace('window.TIMINGS = ', '').strip().rstrip(';')
    timings = json.loads(timings_json)

# 读取 HTML
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 为每个 beat 定义需要替换的硬编码时间
replacements = []

# Beat: intro - 已经部分修复，继续完善
# Beat: problem - 需要修复
# ... 继续处理其他 beats

# 先处理简单的数字替换模式
# 例如: tw(xxx, { o: 1 }, 0.5) -> tw(xxx, { o: 1 }, m('mark'))

print("Starting to process beats...")

# 因为我们已经改了函数签名，现在需要逐个 beat 修复时间标记
# 让我们先检查当前状态
beat_pattern = r"\['(\w+)', '([^']+)', \(m, dur\) => \{(.*?)\}\],"
matches = re.findall(beat_pattern, html, re.DOTALL)

print(f"Found {len(matches)} beats")

for beat_id, beat_title, beat_code in matches:
    if beat_id in timings:
        marks = timings[beat_id]['marks']
        print(f"Processing beat: {beat_id} with {len(marks)} marks")

# 现在让我们手动创建详细的替换规则
# 我会为每个 beat 指定具体的替换

output = html
print("Done")

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(output)

