// Chalk sketches for the unit headers on the contents page, one per unit, drawn in the unit's colour.
'use strict';
(() => {
  let k = 0;
  const P = (d, cls = '', extra = '') => `<path class="d ${cls}" pathLength="1" style="--k:${k++}" d="${d}" ${extra}/>`;
  const Tx = (x, y, s, size = 24, cls = '', anchor = 'start') => `<text class="t ${cls}" style="--k:${k++}" x="${x}" y="${y}" font-size="${size}" text-anchor="${anchor}">${s}</text>`;
  const C = (cx, cy, r, cls = '') => `<circle class="d ${cls}" pathLength="1" style="--k:${k++}" cx="${cx}" cy="${cy}" r="${r}"/>`;
  const reset = s => { k = 0; return s; };

  window.UNIT_ART = [
    // 1 Recursion: three pegs with disks stacking up
    reset(
      // three pegs
      P('M240 130h15v-90h-15z', 'a') + P('M360 130h15v-90h-15z', 'a') + P('M480 130h15v-90h-15z', 'a') +
      // disks on left peg (4 disks, getting smaller)
      P('M210 130h60', '') + P('M220 118h40', '') + P('M230 106h20', '') + P('M240 94h10', '') +
      // arrow suggesting movement
      P('M290 90Q325 70 360 90', 'a') +
      Tx(250, 60, '递归', 26) + C(530, 70, 24, 'a')),
    
    // 2 Dynamic Programming: DP table with filling arrows
    reset(
      // table grid (3x4 cells)
      P('M200 50h350M200 90h350M200 130h350', '') + P('M200 50v80M290 50v80M380 50v80M470 50v80M550 50v80', '') +
      // values in cells
      Tx(245, 75, '0', 20, '', 'middle') + Tx(335, 75, '1', 20, '', 'middle') + Tx(425, 75, '2', 20, '', 'middle') + Tx(510, 75, '3', 20, '', 'middle') +
      Tx(245, 115, '1', 20, '', 'middle') + Tx(335, 115, '1', 20, '', 'middle') + Tx(425, 115, '2', 20, '', 'middle') +
      // diagonal arrow
      P('M290 90L380 50', 'a') +
      Tx(220, 35, 'DP', 26) + C(530, 70, 24, 'a')),
  ];
})();
