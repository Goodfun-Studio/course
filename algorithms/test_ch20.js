const fs = require('fs');
const path = require('path');

// 简单的语法检查
const htmlPath = path.join(__dirname, 'ch20', 'index.html');
const html = fs.readFileSync(htmlPath, 'utf-8');

console.log('✓ HTML file exists');
console.log('✓ File size:', html.length, 'bytes');

// 检查关键元素
const checks = [
    { name: 'CHAPTER definition', pattern: /const CHAPTER = \{/ },
    { name: 'BEATS array', pattern: /let BEATS = \[/ },
    { name: 'boot function', pattern: /function boot\(\)/ },
    { name: 'All 12 beats', test: () => {
        const beats = html.match(/\['[^']+',\s*'[^']+',/g);
        return beats && beats.length === 12;
    }},
    { name: 'panel(0) usage', pattern: /const p = panel\(0\);/ },
    { name: 'panel(800) usage', pattern: /const p = panel\(800\);/ },
    { name: 'tw() animations', test: () => {
        const tws = html.match(/tw\(/g);
        return tws && tws.length >= 50;
    }}
];

let passed = 0;
let failed = 0;

checks.forEach(check => {
    let result;
    if (check.pattern) {
        result = check.pattern.test(html);
    } else if (check.test) {
        result = check.test();
    }
    
    if (result) {
        console.log(`✓ ${check.name}`);
        passed++;
    } else {
        console.log(`✗ ${check.name}`);
        failed++;
    }
});

console.log('\n' + '='.repeat(50));
console.log(`Total: ${passed} passed, ${failed} failed`);

if (failed === 0) {
    console.log('✓ All checks passed!');
    process.exit(0);
} else {
    console.log('✗ Some checks failed');
    process.exit(1);
}
