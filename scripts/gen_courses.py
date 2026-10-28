#!/usr/bin/env python3
"""Regenerate the course list in index.html between the courses markers.

Reads the repo's top-level folders; each one is a course. Per-course text comes from,
in order of preference:
  1. <dir>/course.json  -> {"title": "...", "desc": "...", "order": 1}
  2. <dir>/index.html   -> <title> and <meta name="description">
  3. the folder name
Run from the repo root. Writes nothing if the result is unchanged.
"""
import json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INDEX = os.path.join(ROOT, "index.html")
SKIP = {"scripts", "assets", "img", "lib", "node_modules", "tests", "docs"}

def read_meta(d):
    p = os.path.join(ROOT, d, "index.html")
    title = desc = ""
    if os.path.exists(p):
        s = open(p, encoding="utf-8").read()
        m = re.search(r"<title[^>]*>([^<]*)</title>", s, re.I)
        if m:
            title = m.group(1).strip()
        m = re.search(r'<meta\s+name=["\']description["\']\s+content=["\']([^"\']*)', s, re.I)
        if m:
            desc = m.group(1).strip()
    return title, desc

def course_entry(d):
    title = desc = ""; order = None
    cfg = os.path.join(ROOT, d, "course.json")
    if os.path.exists(cfg):
        try:
            j = json.load(open(cfg, encoding="utf-8"))
            title = (j.get("title") or "").strip()
            desc = (j.get("desc") or "").strip()
            order = j.get("order")
        except Exception as e:
            print(f"! {d}/course.json 解析失败，忽略：{e}", file=sys.stderr)
    t, de = read_meta(d)
    title = title or t or d
    desc = desc or de or "打开这门课"
    return d, title, desc, (order if isinstance(order, int) else 999)

def main():
    dirs = [d for d in sorted(os.listdir(ROOT))
            if os.path.isdir(os.path.join(ROOT, d))
            and not d.startswith(".") and d not in SKIP
            and os.path.exists(os.path.join(ROOT, d, "index.html"))]
    items = sorted((course_entry(d) for d in dirs), key=lambda x: (x[3], x[0]))
    block = ['  <div class="list">']
    if not items:
        block.append('    <p class="empty">课程正在准备中。</p>')
    for d, title, desc, _ in items:
        block += [
            f'    <a class="item" href="{d}/">',
            '      <div>',
            f'        <h2>{title}</h2>',
            f'        <p>{desc}</p>',
            '      </div>',
            '      <span class="go">开始学习 →</span>',
            '    </a>',
        ]
    block.append('  </div>')
    new_block = "\n".join(block)

    html = open(INDEX, encoding="utf-8").read()
    pat = re.compile(r"(<!--\s*courses:start\s*-->)(.*?)(<!--\s*courses:end\s*-->)", re.S)
    if not pat.search(html):
        print("! index.html 里找不到 courses:start/end 标记", file=sys.stderr); sys.exit(1)
    out = pat.sub(lambda m: f"{m.group(1)}\n{new_block}\n  {m.group(3)}", html)
    if out == html:
        print(f"无变化（{len(items)} 门课）")
    else:
        open(INDEX, "w", encoding="utf-8").write(out)
        print(f"已更新：{len(items)} 门课 -> " + ", ".join(d for d, *_ in items))

if __name__ == "__main__":
    main()
