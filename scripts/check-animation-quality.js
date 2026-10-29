#!/usr/bin/env node
/**
 * Animation quality checker for algorithm courses
 * Checks that animation demos meet minimum quality standards
 */

const fs = require('fs');
const path = require('path');

function checkAnimationQuality(htmlPath) {
  const content = fs.readFileSync(htmlPath, 'utf-8');
  
  const issues = [];
  const warnings = [];
  let twCount = 0;
  let colorSet = new Set();
  
  // Count tw() calls
  const twMatches = content.match(/\btw\(/g);
  if (twMatches) {
    twCount = twMatches.length;
  }
  
  // Extract color definitions
  const colorDefMatches = content.match(/const\s+\w+\s*=\s*'#[0-9a-fA-F]{6}'/g);
  if (colorDefMatches) {
    colorDefMatches.forEach(match => {
      const color = match.match(/#[0-9a-fA-F]{6}/)[0];
      colorSet.add(color.toLowerCase());
    });
  }
  
  // Find demo beats (usually contain 'demo' in ID)
  const demoBeatMatches = content.match(/\['[\w-]*demo[\w-]*',\s*'[^']*',\s*\(\)\s*=>\s*\{/gi);
  const hasDemoBeat = demoBeatMatches && demoBeatMatches.length > 0;
  
  // Check for animation duration (look for time variables incremented)
  const timeIncrements = content.match(/time\s*\+=\s*[\d.]+/g) || [];
  const maxTime = timeIncrements.reduce((acc, match) => {
    const val = parseFloat(match.match(/[\d.]+/)[0]);
    return acc + val;
  }, 0);
  
  // Quality checks
  if (twCount < 30) {
    issues.push(`❌ Insufficient animations: ${twCount} tw() calls (minimum: 30)`);
  } else {
    console.log(`✓ Animation count: ${twCount} tw() calls`);
  }
  
  if (colorSet.size < 4) {
    issues.push(`❌ Insufficient color variety: ${colorSet.size} colors (minimum: 4)`);
  } else {
    console.log(`✓ Color variety: ${colorSet.size} distinct colors`);
  }
  
  if (!hasDemoBeat) {
    warnings.push(`⚠ No demo beat found (ID should contain 'demo')`);
  } else {
    console.log(`✓ Demo beat detected`);
  }
  
  if (maxTime < 15) {
    warnings.push(`⚠ Animation duration may be too short: ~${maxTime.toFixed(1)}s (recommended: ≥15s)`);
  } else {
    console.log(`✓ Animation time span: ~${maxTime.toFixed(1)}s`);
  }
  
  // Check for forbidden patterns
  if (content.includes('stage(')) {
    issues.push(`❌ Uses stage() instead of panel(0)`);
  }
  
  if (content.match(/\bW\s*\/\s*2\b/)) {
    issues.push(`❌ Uses W/2 for positioning`);
  }
  
  // Check for proper initialization
  if (!content.includes('boot()')) {
    issues.push(`❌ Missing boot() call`);
  }
  
  if (content.includes('initEngine()')) {
    issues.push(`❌ Uses deprecated initEngine() instead of boot()`);
  }
  
  if (content.includes("window.addEventListener('load'")) {
    issues.push(`❌ Uses window.addEventListener('load') instead of boot()`);
  }
  
  // Report results
  console.log('\n' + '='.repeat(60));
  console.log(`Animation Quality Check: ${path.basename(htmlPath)}`);
  console.log('='.repeat(60));
  
  if (issues.length === 0 && warnings.length === 0) {
    console.log('\n✅ All checks passed!');
    return 0;
  }
  
  if (issues.length > 0) {
    console.log('\n🚫 ISSUES (must fix):');
    issues.forEach(issue => console.log(issue));
  }
  
  if (warnings.length > 0) {
    console.log('\n⚠️  WARNINGS (review recommended):');
    warnings.forEach(warning => console.log(warning));
  }
  
  console.log('\n' + '='.repeat(60));
  
  return issues.length > 0 ? 1 : 0;
}

// Main
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('Usage: node check-animation-quality.js <html-file>');
    process.exit(1);
  }
  
  const htmlPath = args[0];
  if (!fs.existsSync(htmlPath)) {
    console.error(`Error: File not found: ${htmlPath}`);
    process.exit(1);
  }
  
  const exitCode = checkAnimationQuality(htmlPath);
  process.exit(exitCode);
}

module.exports = { checkAnimationQuality };
