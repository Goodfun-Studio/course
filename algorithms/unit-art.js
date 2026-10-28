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

    // 3 Graph: nodes connected with edges, Dijkstra style
    reset(
      // edges
      P('M230 90L340 60', '') + P('M230 90L340 120', '') + P('M340 60L450 90', 'a') + P('M340 120L450 90', '') + P('M450 90L550 60', 'a') + P('M450 90L550 120', '') +
      // nodes
      C(230, 90, 22, 'a') + C(340, 60, 20, '') + C(340, 120, 20, '') + C(450, 90, 20, '') + C(550, 60, 22, 'a') + C(550, 120, 20, '') +
      // labels
      Tx(222, 95, 'A', 18, '', 'middle') + Tx(542, 65, 'Z', 18, '', 'middle') +
      // weights on edges
      Tx(280, 65, '2', 16, '') + Tx(280, 115, '4', 16, '') +
      Tx(395, 68, '✓', 18, 'a', 'middle')),

    // 4 Sorting: a bar chart with a pivot highlighted
    reset(
      // baseline
      P('M200 130h350', '') +
      // bars of different heights
      P('M215 130v-30h30v30z', '') +
      P('M265 130v-55h30v55z', '') +
      P('M315 130v-42h30v42z', '') +
      P('M365 130v-75h30v75z', 'a') +
      P('M415 130v-50h30v50z', '') +
      P('M465 130v-62h30v62z', '') +
      // pivot marker on the tall bar
      P('M380 45l-8 12h16z', 'a') +
      // divider showing the partition
      P('M350 45v85', 'a') +
      Tx(200, 35, '快排', 26) + C(530, 70, 24, 'a')),
  ];
})();
