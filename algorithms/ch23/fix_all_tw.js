const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf-8');

// Pattern 1: tw(..., number, m(...)) -> tw(..., m(...), number)
content = content.replace(/tw\(([^,]+),\s*({[^}]+}),\s*([\d.]+),\s*(m\([^)]+\))\)/g, 
  'tw($1, $2, $4, $3)');

// Pattern 2: tw(..., number, 0) -> tw(..., 0, number) 
content = content.replace(/tw\(([^,]+),\s*({[^}]+}),\s*([\d.]+),\s*0\)/g, 
  'tw($1, $2, 0, $3)');

fs.writeFileSync('index.html', content);
console.log('Fixed all tw parameter orders');
