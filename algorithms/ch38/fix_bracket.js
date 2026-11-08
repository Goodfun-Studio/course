const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 修复多余的括号
html = html.replace(/\}\]\},\]/g, '}],');

fs.writeFileSync('index.html', html);
console.log('✅ Fixed bracket');
