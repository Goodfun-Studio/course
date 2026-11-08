const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

// 替换所有 beat 函数签名
let fixed = html.replace(/\['(\w+)', '([^']+)', \(\) => \{/g, "['$1', '$2', (m, dur) => {");

// 修复 panel 调用
fixed = fixed.replace(/const p = panel\(\d+\);/g, 'const p = panel(0);');

fs.writeFileSync('index.html', fixed);
console.log('Fixed function signatures and panel calls');
