/* =========================================================
   LA PÁGINA QUE FALTABA — Globos de diálogo y tramas en SVG
   Las ilustraciones son imágenes (carpeta img/). Este archivo solo
   dibuja los globos editables del editor de viñetas.
   ========================================================= */
window.ARTE = (function () {
  const INK = '#2a1c12', CREMA = '#f7efdc', SEPIA = '#8a6844',
    MARRON = '#4a3322', PETROLEO = '#1f4e5a', PETRO2 = '#2f6b78', TERRA = '#b5543a',
    PIEL = '#e8d4ad', PIEDRA = '#c7b089';

  const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  /* ---------- Definiciones compartidas (tramas, degradados, filtros) ---------- */
  function defs() {
    return `<defs>
<pattern id="h-diag" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="8" stroke="${INK}" stroke-width="1.3" stroke-opacity=".42"/></pattern>
<pattern id="h-fino" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(-35)"><line x1="0" y1="0" x2="0" y2="5" stroke="${INK}" stroke-width=".8" stroke-opacity=".3"/></pattern>
<pattern id="h-cruz" width="7" height="7" patternUnits="userSpaceOnUse"><path d="M0 0L7 7M7 0L0 7" stroke="${INK}" stroke-width=".9" stroke-opacity=".38"/></pattern>
<pattern id="h-puntos" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r=".9" fill="${INK}" fill-opacity=".3"/></pattern>
<pattern id="h-ladrillo" width="44" height="22" patternUnits="userSpaceOnUse"><path d="M0 .5H44M0 11.5H44M22 .5V11.5M.5 11.5V22M43.5 11.5V22" stroke="${INK}" stroke-width=".9" stroke-opacity=".28" fill="none"/></pattern>
<linearGradient id="g-cielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${PETROLEO}"/><stop offset="1" stop-color="#a9bdb2"/></linearGradient>
<linearGradient id="g-noche" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0f2a33"/><stop offset="1" stop-color="#2f5560"/></linearGradient>
<linearGradient id="g-tarde" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d7b98c"/><stop offset="1" stop-color="#f1e4c8"/></linearGradient>
<linearGradient id="g-papel" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f1e5c9"/><stop offset="1" stop-color="#dcc69c"/></linearGradient>
<radialGradient id="g-luz"><stop offset="0" stop-color="#ffe9ad" stop-opacity=".95"/><stop offset="1" stop-color="#ffe9ad" stop-opacity="0"/></radialGradient>
<radialGradient id="g-vineta" cx=".5" cy=".5" r=".72"><stop offset=".62" stop-color="#3a2614" stop-opacity="0"/><stop offset="1" stop-color="#3a2614" stop-opacity=".42"/></radialGradient>
<radialGradient id="g-quemado" cx="1" cy="0" r="1"><stop offset="0" stop-color="#2a1c12" stop-opacity=".9"/><stop offset=".25" stop-color="#6b4422" stop-opacity=".55"/><stop offset=".45" stop-color="#6b4422" stop-opacity="0"/></radialGradient>
<filter id="f-grano" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="7"/><feColorMatrix type="matrix" values="0 0 0 0 .3  0 0 0 0 .2  0 0 0 0 .1  0 0 0 .2 0"/></filter>
</defs>`;
  }

  /* ---------- Globos de diálogo ---------- */
  function lineas(texto, max) {
    const pal = String(texto || '').trim().split(/\s+/).filter(Boolean);
    const out = []; let act = '';
    pal.forEach(w => {
      while (w.length > max) { if (act) { out.push(act); act = ''; } out.push(w.slice(0, max - 1) + '-'); w = w.slice(max - 1); }
      if (!act) act = w; else if ((act + ' ' + w).length <= max) act += ' ' + w; else { out.push(act); act = w; }
    });
    if (act) out.push(act);
    return out.length ? out : ['…'];
  }

  function globo(g) {
    const tipo = g.tipo || 'dialogo';
    const fs = g.fs || (tipo === 'cartela' ? 19 : 21);
    const max = g.max || (tipo === 'cartela' ? 32 : tipo === 'grito' ? 16 : 22);
    const L = lineas(g.texto, max);
    const lh = fs * 1.28;
    const largo = Math.max.apply(null, L.map(l => l.length));
    const w = Math.round(Math.max(96, largo * fs * .56 + 40));
    const h = Math.round(L.length * lh + 26);
    const cola = g.cola || 'abajo-izq';
    let forma = '';
    const fondo = tipo === 'cartela' ? '#f0d9a0' : '#fffaf0';
    if (tipo === 'dialogo') {
      const r = Math.min(22, h / 2);
      const bx = cola.indexOf('izq') > -1 ? w * .22 : w * .62;
      const tx = cola.indexOf('izq') > -1 ? w * .08 : w * .9;
      let d;
      if (cola.indexOf('abajo') === 0) d = `M${r} 0 H${w - r} Q${w} 0 ${w} ${r} V${h - r} Q${w} ${h} ${w - r} ${h} H${bx + 26} L${tx} ${h + 46} L${bx} ${h} H${r} Q0 ${h} 0 ${h - r} V${r} Q0 0 ${r} 0 Z`;
      else if (cola.indexOf('arriba') === 0) d = `M${r} 0 H${bx} L${tx} -46 L${bx + 26} 0 H${w - r} Q${w} 0 ${w} ${r} V${h - r} Q${w} ${h} ${w - r} ${h} H${r} Q0 ${h} 0 ${h - r} V${r} Q0 0 ${r} 0 Z`;
      else d = `M${r} 0 H${w - r} Q${w} 0 ${w} ${r} V${h - r} Q${w} ${h} ${w - r} ${h} H${r} Q0 ${h} 0 ${h - r} V${r} Q0 0 ${r} 0 Z`;
      forma = `<path d="${d}" fill="${fondo}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>`;
    } else if (tipo === 'pensamiento') {
      forma = `<rect x="0" y="0" width="${w}" height="${h}" rx="${Math.min(h / 2, 40)}" fill="${fondo}" stroke="${INK}" stroke-width="3" stroke-dasharray="14 5"/>`;
      if (cola !== 'ninguna') {
        const izq = cola.indexOf('izq') > -1, abajo = cola.indexOf('abajo') === 0;
        const bx = izq ? w * .22 : w * .78, sy = abajo ? 1 : -1, by = abajo ? h : 0;
        forma += `<circle cx="${bx}" cy="${by + sy * 16}" r="9" fill="${fondo}" stroke="${INK}" stroke-width="2.5"/><circle cx="${bx + (izq ? -14 : 14)}" cy="${by + sy * 36}" r="6" fill="${fondo}" stroke="${INK}" stroke-width="2.5"/><circle cx="${bx + (izq ? -24 : 24)}" cy="${by + sy * 52}" r="4" fill="${fondo}" stroke="${INK}" stroke-width="2"/>`;
      }
    } else if (tipo === 'grito') {
      const cx = w / 2, cy = h / 2, rx = w / 2 + 34, ry = h / 2 + 30, n = 22;
      const pts = [];
      for (let i = 0; i < n * 2; i++) {
        const a = Math.PI * i / n;
        const k = i % 2 === 0 ? 1 : .8;
        pts.push((cx + Math.cos(a) * rx * k).toFixed(1) + ',' + (cy + Math.sin(a) * ry * k).toFixed(1));
      }
      forma = `<polygon points="${pts.join(' ')}" fill="#fff4d6" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>`;
    } else { // cartela
      forma = `<rect x="0" y="0" width="${w}" height="${h}" fill="${fondo}" stroke="${INK}" stroke-width="2.5"/><rect x="0" y="0" width="${w}" height="${h}" fill="url(#h-puntos)" opacity=".5"/>`;
    }
    const izqTxt = tipo === 'cartela';
    const fam = izqTxt ? "Georgia,'Times New Roman',serif" : "'Trebuchet MS',Verdana,Arial,sans-serif";
    let txt = `<text font-family="${fam}" font-size="${fs}" ${izqTxt ? 'font-style="italic"' : 'font-weight="700"'} fill="${INK}" text-anchor="${izqTxt ? 'start' : 'middle'}">`;
    L.forEach((l, i) => { txt += `<tspan x="${izqTxt ? 14 : w / 2}" y="${20 + fs * .78 + i * lh - 4}">${esc(l)}</tspan>`; });
    txt += '</text>';
    return { svg: forma + txt, w, h };
  }

  return { defs, globo, esc, lineas };
})();
