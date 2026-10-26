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
  ];
})();
