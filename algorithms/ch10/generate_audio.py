#!/usr/bin/env python3
"""
生成中文旁白音频（使用 Edge TTS）
"""
import asyncio
import json
import re
from pathlib import Path
import edge_tts

VOICE = "zh-CN-YunxiNeural"
OUTPUT_DIR = Path(__file__).parent / "audio" / "zh"

async def generate_audio(beat_id: str, text: str):
    """生成单个 beat 的音频"""
    # 移除 [[mark]] 标记
    clean_text = re.sub(r'\[\[.*?\]\]', '', text)
    clean_text = clean_text.strip()
    
    output_file = OUTPUT_DIR / f"{beat_id}.mp3"
    
    print(f"生成 {beat_id}.mp3 ...")
    communicate = edge_tts.Communicate(clean_text, VOICE)
    await communicate.save(str(output_file))
    print(f"✓ {beat_id}.mp3")

async def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    # 读取旁白文本
    narration_file = Path(__file__).parent / "narration.zh.json"
    with open(narration_file, 'r', encoding='utf-8') as f:
        narration = json.load(f)
    
    # 并发生成所有音频
    tasks = [generate_audio(beat_id, text) for beat_id, text in narration.items()]
    await asyncio.gather(*tasks)
    
    print(f"\n✅ 完成！共生成 {len(narration)} 个音频文件")

if __name__ == "__main__":
    asyncio.run(main())
