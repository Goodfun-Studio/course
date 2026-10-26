// Chalk sketches for the unit headers on the contents page, one per unit, drawn in the unit's colour.
// Each entry is the inside of an SVG with viewBox 0 0 600 180; keep the left ~200 px light (the unit title sits there
// on narrow screens). Classes, styled in lib/units.css:
//   d  a stroke that draws itself in when the unit scrolls into view (--k orders the strokes)
//   t  text or a filled shape that fades in
//   a  faint chalk white instead of the unit colour;  faint  even fainter
// A sketch may add one looping motion after it is drawn: give an element a class that lib/units.css animates (swap-a,
// hop, orbit, ride, spin, tilt, breathe, ...), or add your own .seen .unit-art .NAME rule and keyframes in a <style> in index.html.
'use strict';
(() => {
  let k = 0;
  const P = (d, cls = '', extra = '') => `<path class="d ${cls}" pathLength="1" style="--k:${k++}" d="${d}" ${extra}/>`;
  const Tx = (x, y, s, size = 24, cls = '', anchor = 'start') => `<text class="t ${cls}" style="--k:${k++}" x="${x}" y="${y}" font-size="${size}" text-anchor="${anchor}">${s}</text>`;
  const C = (cx, cy, r, cls = '') => `<circle class="d ${cls}" pathLength="1" style="--k:${k++}" cx="${cx}" cy="${cy}" r="${r}"/>`;
  const Dot = (cx, cy, r = 6, cls = 't') => `<circle class="${cls}" r="${r}" cx="${cx}" cy="${cy}" fill="currentColor" stroke="none" style="--k:${k++}"/>`;
  const reset = s => { k = 0; return s; };

  window.UNIT_ART = [
    // 4 Data preparation: a scatter with its fit line and residuals, then a row of points squeezed onto a unit axis.
    reset(
      // left: fitted line through scattered points, with residual drops
      P('M232 148L420 42') +
      Dot(258, 112) + Dot(292, 92) + Dot(330, 88) + Dot(366, 56) + Dot(398, 66) +
      P('M258 112V122', 'a') + P('M292 92V84', 'a') + P('M330 88V72', 'a') + P('M366 56V44', 'a') +
      Tx(236, 40, '残差化', 26) +
      // right: raw points on a wide axis, a brace, then the same points squeezed into [0,1]
      P('M452 118H572', 'faint') + Dot(462, 106, 5) + Dot(492, 100, 5) + Dot(534, 94, 5) + Dot(566, 84, 5) +
      P('M452 132H572') + Dot(452, 146, 5) + Dot(492, 146, 5) + Dot(534, 146, 5) + Dot(572, 146, 5) +
      Tx(452, 60, '归一化', 26) + C(566, 88, 16, 'a')),
  ];
})();
