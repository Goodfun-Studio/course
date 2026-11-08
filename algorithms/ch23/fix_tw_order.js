const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf-8');

// Fix pattern: tw(element, {...}, duration, time) -> tw(element, {...}, time, duration)
// We need to swap the last two parameters when they match this pattern

// This is complex because we need to handle nested parentheses
// Let's use a more specific approach: find tw(..., m('...')) patterns

content = content.replace(/tw\(([^,]+),\s*({[^}]+}),\s*([\d.]+),\s*(m\([^)]+\))\)/g, 
  'tw($1, $2, $4, $3)');

fs.writeFileSync('index.html', content);
console.log('Fixed tw parameter order');
