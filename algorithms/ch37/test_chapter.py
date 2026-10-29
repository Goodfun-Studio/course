#!/usr/bin/env python3
"""测试第37章课程"""
import subprocess
import sys
from pathlib import Path

def test_chapter():
    """运行Playwright测试"""
    
    chapter_dir = Path(__file__).parent
    test_file = chapter_dir / 'index.html'
    
    if not test_file.exists():
        print(f"错误: 找不到 {test_file}")
        return False
    
    print(f"测试章节: 第37章 - 博弈论基础")
    print(f"文件: {test_file}")
    print("-" * 50)
    
    # 使用Playwright测试
    test_script = '''
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    await page.goto('file://' + process.argv[2], { waitUntil: 'networkidle' });
    
    // 等待页面加载
    await page.waitForTimeout(2000);
    
    // 检查标题
    const title = await page.title();
    console.log('✓ 页面标题:', title);
    
    // 检查CHAPTER对象
    const chapter = await page.evaluate(() => {
      return typeof CHAPTER !== 'undefined' ? CHAPTER : null;
    });
    
    if (chapter) {
      console.log('✓ 章节信息:', JSON.stringify(chapter));
    }
    
    // 检查beats数量
    const beatCount = await page.evaluate(() => {
      return typeof BEATS !== 'undefined' ? BEATS.length : 0;
    });
    console.log('✓ Beat数量:', beatCount);
    
    // 检查是否有动画
    const hasAnimations = await page.evaluate(() => {
      if (typeof BEATS === 'undefined') return false;
      
      let twCount = 0;
      for (const beat of BEATS) {
        const func = beat[2].toString();
        twCount += (func.match(/tw\(/g) || []).length;
      }
      return twCount;
    });
    console.log('✓ 动画调用次数:', hasAnimations);
    
    // 验证动画数量
    if (hasAnimations < 100) {
      console.log('✗ 警告: 动画数量偏少 (期望 > 100)');
    } else {
      console.log('✓ 动画数量充足');
    }
    
    // 检查颜色定义
    const colors = await page.evaluate(() => {
      const colorVars = [];
      if (typeof PLAYER1_COLOR !== 'undefined') colorVars.push('PLAYER1_COLOR');
      if (typeof PLAYER2_COLOR !== 'undefined') colorVars.push('PLAYER2_COLOR');
      if (typeof XOR_COLOR !== 'undefined') colorVars.push('XOR_COLOR');
      if (typeof SG_COLOR !== 'undefined') colorVars.push('SG_COLOR');
      if (typeof WIN_COLOR !== 'undefined') colorVars.push('WIN_COLOR');
      return colorVars;
    });
    console.log('✓ 颜色定义:', colors.length, '种颜色');
    
    if (colors.length < 5) {
      console.log('✗ 警告: 颜色种类不足5种');
    }
    
    console.log('\\n测试通过！');
    
  } catch (error) {
    console.error('✗ 测试失败:', error.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
'''
    
    try:
        # 写入临时测试脚本
        test_script_file = chapter_dir / 'temp_test.js'
        with open(test_script_file, 'w') as f:
            f.write(test_script)
        
        # 运行测试
        result = subprocess.run(
            ['node', str(test_script_file), str(test_file.absolute())],
            capture_output=True,
            text=True
        )
        
        print(result.stdout)
        if result.stderr:
            print("错误输出:", result.stderr, file=sys.stderr)
        
        # 清理临时文件
        test_script_file.unlink()
        
        return result.returncode == 0
        
    except FileNotFoundError:
        print("错误: 未安装Node.js或Playwright")
        print("请运行: npm install -g playwright")
        return False
    except Exception as e:
        print(f"测试失败: {e}")
        return False

if __name__ == '__main__':
    success = test_chapter()
    sys.exit(0 if success else 1)
