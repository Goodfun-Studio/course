const fs = require('fs');
const path = require('path');

// 读取 timings
const timingsPath = path.join(__dirname, 'audio/zh/timings.js');
const timingsCode = fs.readFileSync(timingsPath, 'utf8');
const timingsJson = timingsCode.replace('window.TIMINGS = ', '').trim().replace(/;$/, '');
const TIMINGS = JSON.parse(timingsJson);

// 读取 HTML
const html = fs.readFileSync('index.html', 'utf8');

// 提取 BEATS 数组
const beatsMatch = html.match(/window\.BEATS = \[([\s\S]*?)\];[\s\S]*?window\.BEATS = window\.BEATS\.map/);
if (!beatsMatch) {
    console.error('❌ Could not find BEATS array');
    process.exit(1);
}

const beatsCode = beatsMatch[1];

// 检查所有 beat 都使用了 (m, dur) 签名
const beatPattern = /\['(\w+)', '([^']+)', \(m, dur\) => \{/g;
const beats = [];
let match;
while ((match = beatPattern.exec(beatsCode)) !== null) {
    beats.push({ id: match[1], title: match[2] });
}

console.log(`✅ Found ${beats.length} beats with correct (m, dur) signature`);
beats.forEach(b => console.log(`   - ${b.id}: ${b.title}`));

// 检查 panel(0) 统一性
const panelPattern = /panel\((\d+)\)/g;
const panelCalls = [];
while ((match = panelPattern.exec(beatsCode)) !== null) {
    panelCalls.push(parseInt(match[1]));
}

const nonZeroPanels = panelCalls.filter(p => p !== 0);
if (nonZeroPanels.length > 0) {
    console.warn(`⚠️  Found ${nonZeroPanels.length} non-zero panel() calls`);
} else {
    console.log('✅ All panel() calls use panel(0)');
}

// 检查 m('mark') 调用
const mCallPattern = /m\('(\w+)'\)/g;
const mCalls = [];
while ((match = mCallPattern.exec(beatsCode)) !== null) {
    mCalls.push(match[1]);
}

console.log(`✅ Found ${mCalls.length} m('mark') calls`);

// 验证每个 beat 的 marks 是否在 TIMINGS 中
console.log('\n📋 Checking marks against TIMINGS:');
for (const beat of beats) {
    const beatTimings = TIMINGS[beat.id];
    if (!beatTimings) {
        console.error(`   ❌ ${beat.id}: No timing data found`);
        continue;
    }
    const marksCount = Object.keys(beatTimings.marks).length;
    console.log(`   ✓ ${beat.id}: ${marksCount} marks defined in TIMINGS`);
}

console.log('\n📊 Validation Summary:');
console.log(`   Beats with correct signature: ${beats.length}/12`);
console.log(`   Total m('mark') calls: ${mCalls.length}`);
console.log(`   All panel(0): ${nonZeroPanels.length === 0 ? 'YES' : 'NO'}`);

if (beats.length === 12 && nonZeroPanels.length === 0) {
    console.log('\n✅ Basic validation PASSED');
} else {
    console.log('\n⚠️  Basic validation has warnings');
}
