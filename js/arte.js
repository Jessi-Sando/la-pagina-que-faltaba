/* =========================================================
   LA PÁGINA QUE FALTABA — Ilustraciones en SVG
   Todo el arte se genera en código: no hay imágenes externas.
   Escenas en un lienzo de 800 x 600.
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

  /* ---------- Fondos ---------- */
  function sueloLineas(y0, color) {
    let s = '';
    [0, 28, 62, 104, 152].forEach(d => { s += `<line x1="0" y1="${y0 + d}" x2="800" y2="${y0 + d}" stroke="${color}" stroke-width="1.4" stroke-opacity=".55"/>`; });
    for (let i = -6; i <= 14; i++) s += `<line x1="${400 + i * 22}" y1="${y0}" x2="${400 + i * 90}" y2="600" stroke="${color}" stroke-opacity=".28"/>`;
    return s;
  }
  function montanas(y, color, op) {
    return `<path d="M0 ${y} L60 ${y - 70} L110 ${y - 40} L190 ${y - 150} L250 ${y - 90} L320 ${y - 190} L380 ${y - 110} L450 ${y - 170} L520 ${y - 80} L600 ${y - 200} L680 ${y - 100} L740 ${y - 140} L800 ${y - 60} L800 ${y} Z" fill="${color}" fill-opacity="${op}"/>
<path d="M190 ${y - 150} L172 ${y - 122} L196 ${y - 128} L208 ${y - 116} L222 ${y - 128} Z M320 ${y - 190} L300 ${y - 158} L322 ${y - 166} L340 ${y - 152} Z M600 ${y - 200} L578 ${y - 164} L602 ${y - 172} L622 ${y - 160} Z M450 ${y - 170} L436 ${y - 146} L456 ${y - 150} L468 ${y - 140} Z" fill="${CREMA}" fill-opacity=".85"/>`;
  }
  function alamo(x, y, h, c) {
    return `<path d="M${x} ${y} L${x} ${y - h * .25}" stroke="${INK}" stroke-width="4"/><path d="M${x} ${y - h} C${x + 22} ${y - h * .7} ${x + 20} ${y - h * .3} ${x} ${y - h * .2} C${x - 20} ${y - h * .3} ${x - 22} ${y - h * .7} ${x} ${y - h} Z" fill="${c}" stroke="${INK}" stroke-width="2"/><path d="M${x} ${y - h} C${x + 22} ${y - h * .7} ${x + 20} ${y - h * .3} ${x} ${y - h * .2} Z" fill="url(#h-diag)"/>`;
  }
  function arcosRuina(x, y, esc2, color) {
    // Muro con arcos rotos (inspirado genéricamente en ruinas coloniales)
    const s = esc2;
    return `<g transform="translate(${x} ${y}) scale(${s})">
<path d="M0 0 L0 -210 L30 -232 L52 -205 L80 -240 L120 -214 L150 -250 L190 -226 L230 -244 L262 -210 L290 -228 L320 -196 L320 0 Z" fill="${color}" stroke="${INK}" stroke-width="3"/>
<path d="M0 0 L0 -210 L30 -232 L52 -205 L80 -240 L120 -214 L150 -250 L190 -226 L230 -244 L262 -210 L290 -228 L320 -196 L320 0 Z" fill="url(#h-ladrillo)"/>
<path d="M30 0 V-110 A50 50 0 0 1 130 -110 V0 Z" fill="#4b3a2a" stroke="${INK}" stroke-width="3"/>
<path d="M190 0 V-110 A50 50 0 0 1 290 -110 V0 Z" fill="#4b3a2a" stroke="${INK}" stroke-width="3"/>
<path d="M30 0 V-110 A50 50 0 0 1 130 -110 V0 Z M190 0 V-110 A50 50 0 0 1 290 -110 V0 Z" fill="url(#h-cruz)"/>
<path d="M150 -250 L160 -190 L148 -150 L162 -100" stroke="${INK}" stroke-width="2.5" fill="none"/>
</g>`;
  }
  function escombros(y) {
    return `<path d="M0 ${y} L40 ${y - 22} L70 ${y - 8} L110 ${y - 30} L150 ${y - 6} L210 ${y - 18} L260 ${y} Z" fill="${PIEDRA}" stroke="${INK}" stroke-width="2.5"/>
<path d="M520 ${y} L560 ${y - 26} L600 ${y - 10} L650 ${y - 34} L700 ${y - 12} L760 ${y - 28} L800 ${y - 8} L800 ${y} Z" fill="${PIEDRA}" stroke="${INK}" stroke-width="2.5"/>
<path d="M0 ${y} L40 ${y - 22} L70 ${y - 8} L110 ${y - 30} L150 ${y - 6} L210 ${y - 18} L260 ${y} Z M520 ${y} L560 ${y - 26} L600 ${y - 10} L650 ${y - 34} L700 ${y - 12} L760 ${y - 28} L800 ${y - 8} L800 ${y} Z" fill="url(#h-diag)"/>`;
  }

  const FONDOS = {
    cuarto: { nombre: 'Habitación con el baúl', dibujo: () => `
<rect width="800" height="600" fill="#d9c49c"/>
<rect width="800" height="440" fill="url(#h-fino)"/>
<polygon points="600,110 800,60 800,600 560,600" fill="#fff1c9" fill-opacity=".22"/>
<rect x="0" y="430" width="800" height="170" fill="#9c774f"/>
${sueloLineas(430, INK)}
<line x1="0" y1="430" x2="800" y2="430" stroke="${INK}" stroke-width="3"/>
<rect x="0" y="410" width="800" height="20" fill="#7b5b3d" stroke="${INK}" stroke-width="2"/>
<!-- ventana -->
<rect x="612" y="102" width="166" height="236" fill="${MARRON}" stroke="${INK}" stroke-width="3"/>
<rect x="626" y="116" width="138" height="208" fill="url(#g-cielo)"/>
<g opacity=".9">${arcosRuina(632, 324, .42, '#7f8d86')}</g>
<rect x="626" y="116" width="138" height="208" fill="url(#h-fino)"/>
<line x1="695" y1="116" x2="695" y2="324" stroke="${MARRON}" stroke-width="7"/>
<line x1="626" y1="214" x2="764" y2="214" stroke="${MARRON}" stroke-width="7"/>
<rect x="600" y="336" width="190" height="14" fill="#6d4e33" stroke="${INK}" stroke-width="2.5"/>
<!-- estante y cajita -->
<rect x="36" y="200" width="196" height="12" fill="${MARRON}" stroke="${INK}" stroke-width="2.5"/>
<path d="M60 212 L60 236 L84 212 M190 212 L190 236 L214 212" stroke="${INK}" stroke-width="3" fill="none"/>
<rect x="44" y="150" width="16" height="50" fill="${PETRO2}" stroke="${INK}" stroke-width="2"/>
<rect x="60" y="158" width="14" height="42" fill="${SEPIA}" stroke="${INK}" stroke-width="2"/>
<rect x="96" y="168" width="64" height="32" rx="3" fill="${TERRA}" stroke="${INK}" stroke-width="2.5"/>
<path d="M92 168 L164 168 L160 158 L96 158 Z" fill="#963f2a" stroke="${INK}" stroke-width="2.5"/>
<rect x="96" y="168" width="64" height="32" fill="url(#h-diag)"/>
<circle cx="128" cy="184" r="4" fill="#e3c47a" stroke="${INK}"/>
<rect x="180" y="176" width="34" height="24" fill="${CREMA}" stroke="${INK}" stroke-width="2"/>
<!-- grieta y almanaque -->
<path d="M520 40 L532 92 L516 130 L540 176 L528 230 L552 280 L538 330 L556 400" stroke="${INK}" stroke-width="3.5" fill="none"/>
<path d="M532 92 L556 104 M540 176 L512 196 M552 280 L578 292" stroke="${INK}" stroke-width="2" fill="none"/>
<rect x="556" y="178" width="64" height="86" fill="${CREMA}" stroke="${INK}" stroke-width="2.5" transform="rotate(4 588 220)"/>
<g transform="rotate(4 588 220)"><rect x="556" y="178" width="64" height="18" fill="${TERRA}"/><text x="588" y="192" font-family="Georgia,serif" font-size="12" fill="${CREMA}" text-anchor="middle">MARZO</text><text x="588" y="222" font-family="Georgia,serif" font-size="20" fill="${INK}" text-anchor="middle" font-weight="700">1861</text><path d="M564 236h48M564 246h48M564 256h48" stroke="${INK}" stroke-opacity=".5"/><circle cx="596" cy="246" r="6" fill="none" stroke="${TERRA}" stroke-width="2"/></g>
<circle cx="588" cy="176" r="3" fill="${INK}"/>
<!-- baúl -->
<path d="M250 402 Q362 300 478 402 Z" fill="#5c3f28" stroke="${INK}" stroke-width="3"/>
<path d="M262 395 Q362 318 466 395" fill="none" stroke="#c9a15e" stroke-width="4"/>
<rect x="246" y="400" width="236" height="134" rx="8" fill="#6d4a2e" stroke="${INK}" stroke-width="3"/>
<rect x="246" y="400" width="236" height="134" rx="8" fill="url(#h-diag)"/>
<rect x="246" y="420" width="236" height="10" fill="#c9a15e" stroke="${INK}" stroke-width="1.5"/>
<rect x="246" y="500" width="236" height="10" fill="#c9a15e" stroke="${INK}" stroke-width="1.5"/>
<rect x="350" y="440" width="28" height="34" rx="3" fill="#c9a15e" stroke="${INK}" stroke-width="2"/>
<circle cx="364" cy="456" r="4" fill="${INK}"/>
<!-- telas y hoja -->
<path d="M262 402 Q300 380 340 398 Q380 376 430 396 L470 402 Z" fill="${PETRO2}" stroke="${INK}" stroke-width="2"/>
<path d="M330 392 L392 380 L404 404 L398 408 L340 414 L334 406 L338 400 Z" fill="${CREMA}" stroke="${INK}" stroke-width="2"/>
<path d="M340 396 L384 388 M342 403 L390 396" stroke="${INK}" stroke-opacity=".5"/>
<rect width="800" height="600" fill="url(#g-vineta)"/>` },

    ruinas: { nombre: 'Ruinas de la ciudad vieja', dibujo: () => `
<rect width="800" height="600" fill="url(#g-cielo)"/>
${montanas(330, '#5d7f80', .7)}
<rect y="420" width="800" height="180" fill="#bfa478"/>
<rect y="420" width="800" height="180" fill="url(#h-puntos)"/>
${arcosRuina(60, 470, 1.1, PIEDRA)}
${arcosRuina(470, 450, .8, '#b59d77')}
${escombros(600)}
<path d="M0 470 Q400 440 800 465" stroke="${INK}" stroke-width="2" fill="none" stroke-opacity=".6"/>
<rect width="800" height="600" fill="url(#g-vineta)"/>` },

    plaza: { nombre: 'Plaza de la Ciudad Nueva', dibujo: () => `
<rect width="800" height="600" fill="url(#g-tarde)"/>
${montanas(300, '#8b9a8e', .55)}
<rect x="0" y="250" width="800" height="120" fill="#cdb48a" stroke="${INK}" stroke-width="2"/>
${[0, 1, 2, 3, 4, 5, 6].map(i => `<rect x="${20 + i * 112}" y="${266 + (i % 2) * 8}" width="90" height="${96 - (i % 2) * 8}" fill="${i % 3 === 0 ? '#d9c7a2' : '#c9b08a'}" stroke="${INK}" stroke-width="2"/><rect x="${55 + i * 112}" y="314" width="20" height="48" fill="${MARRON}" stroke="${INK}" stroke-width="1.5"/><rect x="${30 + i * 112}" y="290" width="16" height="18" fill="${PETROLEO}" stroke="${INK}" stroke-width="1.5"/>`).join('')}
<rect x="0" y="250" width="800" height="120" fill="url(#h-fino)"/>
${[40, 150, 260, 540, 650, 760].map(x => alamo(x, 400, 210, PETRO2)).join('')}
<rect y="390" width="800" height="210" fill="#d8c294"/>
<rect y="390" width="800" height="210" fill="url(#h-puntos)"/>
<path d="M0 440 Q400 420 800 444 L800 458 Q400 436 0 454 Z" fill="${PETRO2}" stroke="${INK}" stroke-width="2"/>
<path d="M120 444 q10 -3 20 0 M420 432 q10 -3 20 0 M640 446 q10 -3 20 0" stroke="${CREMA}" stroke-width="1.5" fill="none"/>
<rect x="330" y="500" width="140" height="10" fill="${MARRON}" stroke="${INK}" stroke-width="2"/><path d="M340 510v24M460 510v24" stroke="${INK}" stroke-width="4"/>
<rect width="800" height="600" fill="url(#g-vineta)"/>` },

    archivo: { nombre: 'Archivo y escuela', dibujo: () => {
      let est = '';
      for (let f = 0; f < 4; f++) {
        est += `<rect x="20" y="${70 + f * 92}" width="760" height="10" fill="${MARRON}" stroke="${INK}" stroke-width="2"/>`;
        let x = 30;
        let k = f * 7;
        while (x < 760) {
          const w = 18 + ((k * 37) % 26), h = 50 + ((k * 13) % 26);
          const c = [SEPIA, '#a07a52', TERRA, PETRO2, '#c9b08a', '#6d4a2e'][k % 6];
          est += `<rect x="${x}" y="${70 + f * 92 - h}" width="${w}" height="${h}" fill="${c}" stroke="${INK}" stroke-width="1.5"/>`;
          if (k % 4 === 0) est += `<rect x="${x + 3}" y="${70 + f * 92 - h + 10}" width="${w - 6}" height="8" fill="${CREMA}" stroke="${INK}" stroke-width=".8"/>`;
          x += w + 3; k++;
        }
      }
      return `
<rect width="800" height="600" fill="#5b4330"/>
${est}
<rect width="800" height="420" fill="url(#h-diag)" opacity=".7"/>
<circle cx="610" cy="420" r="220" fill="url(#g-luz)" opacity=".55"/>
<rect y="440" width="800" height="160" fill="#7b5b3d"/>
<path d="M60 452 L740 452 L780 600 L20 600 Z" fill="#8f6a45" stroke="${INK}" stroke-width="3"/>
<path d="M60 452 L740 452 L780 600 L20 600 Z" fill="url(#h-fino)"/>
<path d="M180 470 L300 462 L310 500 L190 508 Z" fill="${CREMA}" stroke="${INK}" stroke-width="2"/>
<path d="M330 476 L430 470 L436 504 L336 510 Z" fill="#efe1c0" stroke="${INK}" stroke-width="2"/>
<path d="M600 470 v-40 h20 v40" fill="${MARRON}" stroke="${INK}" stroke-width="2"/>
<ellipse cx="610" cy="420" rx="22" ry="28" fill="#ffe7a2" stroke="${INK}" stroke-width="2"/>
<rect width="800" height="600" fill="url(#g-vineta)"/>`;
    } },

    camino: { nombre: 'Camino hacia la cordillera', dibujo: () => `
<rect width="800" height="600" fill="url(#g-cielo)"/>
${montanas(380, '#3e6670', .85)}
<rect y="370" width="800" height="230" fill="#c2a676"/>
<rect y="370" width="800" height="230" fill="url(#h-puntos)"/>
<path d="M360 370 L440 370 L700 600 L120 600 Z" fill="#d9c49a" stroke="${INK}" stroke-width="2"/>
<path d="M400 380 L400 400 M402 430 L404 460 M406 500 L410 550" stroke="${INK}" stroke-width="3" stroke-dasharray="1 0" stroke-opacity=".5"/>
${[60, 130, 200, 600, 670, 740].map((x, i) => alamo(x, 400 + (i % 3) * 6, 170 - (i % 3) * 20, '#3e6b5c')).join('')}
<g transform="translate(560 470)"><rect x="-50" y="-36" width="100" height="30" fill="${MARRON}" stroke="${INK}" stroke-width="2.5"/><circle cx="-30" cy="0" r="22" fill="none" stroke="${INK}" stroke-width="4"/><circle cx="30" cy="0" r="22" fill="none" stroke="${INK}" stroke-width="4"/><path d="M-30 -22v44M-52 0h44M30 -22v44M8 0h44" stroke="${INK}" stroke-width="2"/></g>
<rect width="800" height="600" fill="url(#g-vineta)"/>` },

    noche: { nombre: 'Noche entre los escombros', dibujo: () => `
<rect width="800" height="600" fill="url(#g-noche)"/>
${[[60, 50], [140, 90], [260, 40], [380, 70], [520, 30], [610, 90], [720, 50], [770, 120], [330, 130]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.8" fill="${CREMA}"/>`).join('')}
${montanas(330, '#0b1f26', .95)}
<rect y="420" width="800" height="180" fill="#3d3a33"/>
${arcosRuina(80, 480, 1.05, '#4b5550')}
${arcosRuina(480, 460, .78, '#45504c')}
<circle cx="400" cy="470" r="150" fill="url(#g-luz)" opacity=".7"/>
${escombros(600)}
<rect width="800" height="600" fill="url(#g-vineta)"/>` },

    hojagrande: { nombre: 'La hoja en primer plano', soloNarrativo: true, dibujo: () => `
<rect width="800" height="600" fill="#6d4a2e"/>
<rect width="800" height="600" fill="url(#h-diag)"/>
<g transform="rotate(-4 400 300)">${hojaDibujo(150, 90, 500, 420, true)}</g>
<rect width="800" height="600" fill="url(#g-vineta)"/>` }
  };

  /* La hoja rota (usada en viñeta y en el primer plano del documento) */
  function hojaDibujo(x, y, w, h, conTexto) {
    const r = (a, b) => a + b;
    const borde = `M${x} ${y + 10} L${x + w * .3} ${y} L${x + w * .55} ${y + 8} L${x + w * .8} ${y - 2} L${x + w} ${y + 12} L${r(x + w, -8)} ${y + h * .3} L${x + w + 4} ${y + h * .55} L${x + w - 12} ${y + h * .62} L${x + w - 2} ${y + h * .8} L${x + w - 30} ${y + h} L${x + w * .6} ${y + h - 10} L${x + w * .45} ${y + h + 4} L${x + w * .2} ${y + h - 8} L${x} ${y + h - 2} L${x + 8} ${y + h * .5} Z`;
    let t = '';
    if (conTexto) {
      const L = ['…en el acta de fundación de la ciudad', '[ ilegible ] aquella noche de marzo, cuando', 'los que buscaban no eran ladrones', '[ roto ] sus nombres no figuran en ningún', '…que alguien escriba la página que', 'falta.'];
      L.forEach((l, i) => { t += `<text x="${x + 34}" y="${y + 70 + i * 50}" font-family="Georgia,'Times New Roman',serif" font-style="italic" font-size="22" fill="#3b2a1d">${esc(l)}</text>`; });
      t += `<text x="${x + w - 90}" y="${y + h - 46}" font-family="Georgia,serif" font-style="italic" font-size="30" fill="#3b2a1d">— T.</text>`;
      t += `<rect x="${x + 160}" y="${y + 110}" width="70" height="22" fill="#6d4a2e" opacity=".55"/>`;
    }
    return `<path d="${borde}" fill="url(#g-papel)" stroke="${INK}" stroke-width="3"/>
<ellipse cx="${x + w * .7}" cy="${y + h * .7}" rx="70" ry="44" fill="#a07a52" opacity=".22"/>
<ellipse cx="${x + w * .25}" cy="${y + h * .3}" rx="40" ry="26" fill="#a07a52" opacity=".16"/>
${t}
<path d="${borde}" fill="url(#g-quemado)"/>`;
  }

  /* ---------- Personajes ---------- */
  const PERSONAJES = {
    elena: { nombre: 'Elena', h: .9, arriba: PETROLEO, abajo: PETROLEO, falda: true, pelo: '#3b2a1d', peinado: 'trenza', delantal: true },
    rosario: { nombre: 'Rosario', h: .86, arriba: MARRON, abajo: '#6b4a33', falda: true, pelo: '#a29b8f', peinado: 'rodete', chal: TERRA, encorvada: true },
    aurelio: { nombre: 'Aurelio', h: 1, arriba: '#2e3b3f', abajo: '#2e3b3f', falda: false, pelo: '#77736c', peinado: 'corto', sombrero: 'galera', lentes: true, objeto: 'papeles' },
    tomas: { nombre: 'Tomás', h: 1, arriba: '#7a5a3a', abajo: '#4a3322', falda: false, pelo: '#2a1c12', peinado: 'corto', sombrero: 'ala', panuelo: true },
    elvira: { nombre: 'Elvira', h: .95, arriba: SEPIA, abajo: '#5b4330', falda: true, pelo: '#4a3322', peinado: 'rodete', cuello: true, objeto: 'libro' },
    teodora: { nombre: 'Abuela Teodora', h: .84, arriba: '#5b4330', abajo: '#3e2a1c', falda: true, pelo: '#d3ccbf', peinado: 'rodete', chal: PETRO2, objeto: 'baston', encorvada: true },
    buscadores: { nombre: 'Jóvenes del farol (siluetas)', grupo: true }
  };

  function cuerpo(p, sil) {
    const C = c => sil ? INK : c;
    const piel = sil ? INK : PIEL;
    const sw = 3;
    let s = '';
    // Piernas / falda
    if (p.falda) {
      s += `<ellipse cx="-20" cy="-2" rx="14" ry="6" fill="${INK}"/><ellipse cx="22" cy="-2" rx="14" ry="6" fill="${INK}"/>`;
      s += `<path d="M-36 -150 Q-48 -70 -62 -6 L62 -6 Q48 -70 36 -150 Z" fill="${C(p.abajo)}" stroke="${INK}" stroke-width="${sw}"/>`;
      if (!sil) s += `<path d="M0 -150 L36 -150 Q48 -70 62 -6 L10 -6 Z" fill="url(#h-diag)"/><path d="M-20 -120 Q-26 -60 -32 -10 M14 -120 Q20 -60 26 -10" stroke="${INK}" stroke-opacity=".5" fill="none"/>`;
    } else {
      s += `<path d="M-30 -152 L-32 -10 L-8 -10 L0 -112 L8 -10 L32 -10 L30 -152 Z" fill="${C(p.abajo)}" stroke="${INK}" stroke-width="${sw}"/>`;
      if (!sil) s += `<path d="M2 -112 L8 -10 L32 -10 L30 -152 L4 -152 Z" fill="url(#h-diag)"/>`;
      s += `<path d="M-38 0 L-6 0 L-6 -14 L-32 -14 Z M6 0 L40 0 L36 -14 L8 -14 Z" fill="${INK}"/>`;
    }
    // Torso (con inclinación opcional)
    let sup = '';
    sup += `<path d="M-34 -232 Q-44 -200 -38 -150 L38 -150 Q44 -200 34 -232 Q0 -244 -34 -232 Z" fill="${C(p.arriba)}" stroke="${INK}" stroke-width="${sw}"/>`;
    if (!sil) sup += `<path d="M6 -238 Q34 -236 34 -232 Q44 -200 38 -150 L8 -150 Z" fill="url(#h-fino)"/>`;
    if (p.delantal && !sil) sup += `<path d="M-24 -176 L24 -176 L28 -150 L-28 -150 Z" fill="${CREMA}" stroke="${INK}" stroke-width="2"/>`;
    // brazos
    const brazo = (d) => `<path d="${d}" stroke="${INK}" stroke-width="20" fill="none" stroke-linecap="round"/><path d="${d}" stroke="${C(p.arriba)}" stroke-width="13" fill="none" stroke-linecap="round"/>`;
    sup += brazo('M-30 -224 Q-52 -190 -50 -142');
    sup += `<circle cx="-50" cy="-136" r="8" fill="${piel}" stroke="${INK}" stroke-width="2"/>`;
    const sostiene = p.objeto && p.objeto !== 'baston';
    if (sostiene) {
      sup += brazo('M30 -224 Q54 -196 42 -170');
      sup += `<circle cx="42" cy="-168" r="8" fill="${piel}" stroke="${INK}" stroke-width="2"/>`;
    } else {
      sup += brazo('M30 -224 Q52 -190 50 -142');
      sup += `<circle cx="50" cy="-136" r="8" fill="${piel}" stroke="${INK}" stroke-width="2"/>`;
    }
    if (p.chal) {
      sup += `<path d="M-42 -230 Q0 -250 42 -230 L34 -172 Q0 -150 -34 -172 Z" fill="${C(p.chal)}" stroke="${INK}" stroke-width="2.5"/>`;
      if (!sil) sup += `<path d="M-42 -230 Q0 -250 42 -230 L34 -172 Q0 -150 -34 -172 Z" fill="url(#h-diag)"/><path d="M-30 -168 l-3 10 M-18 -160 l-2 10 M-6 -156 l0 10 M6 -156 l0 10 M18 -160 l2 10 M30 -168 l3 10" stroke="${INK}" stroke-width="1.5"/>`;
    }
    // cuello y cabeza
    sup += `<rect x="-8" y="-252" width="16" height="22" fill="${piel}" stroke="${INK}" stroke-width="2"/>`;
    if (p.cuello && !sil) sup += `<rect x="-13" y="-246" width="26" height="14" rx="3" fill="${CREMA}" stroke="${INK}" stroke-width="2"/>`;
    if (p.panuelo && !sil) sup += `<path d="M-14 -238 L14 -238 L2 -214 Z" fill="${TERRA}" stroke="${INK}" stroke-width="2"/>`;
    sup += `<ellipse cx="0" cy="-270" rx="22" ry="26" fill="${piel}" stroke="${INK}" stroke-width="${sw}"/>`;
    if (!sil) {
      sup += `<ellipse cx="3" cy="-272" rx="2.4" ry="3" fill="${INK}"/><ellipse cx="14" cy="-272" rx="2.4" ry="3" fill="${INK}"/>`;
      sup += `<path d="M-2 -280 L7 -281 M11 -281 L19 -279" stroke="${INK}" stroke-width="2"/>`;
      sup += `<path d="M20 -270 L25 -259 L19 -257" stroke="${INK}" stroke-width="2" fill="none"/>`;
      sup += `<path d="M8 -251 Q13 -249 17 -252" stroke="${INK}" stroke-width="2" fill="none"/>`;
      sup += `<path d="M-10 -262 Q-4 -250 6 -246" stroke="${INK}" stroke-opacity=".35" fill="none"/>`;
      if (p.lentes) sup += `<circle cx="3" cy="-272" r="6" fill="none" stroke="${INK}" stroke-width="1.6"/><circle cx="15" cy="-272" r="6" fill="none" stroke="${INK}" stroke-width="1.6"/><path d="M9 -273 h0" stroke="${INK}"/>`;
    }
    // pelo
    sup += `<path d="M-23 -264 Q-28 -300 0 -297 Q24 -297 22 -280 Q8 -290 -4 -284 Q-14 -278 -16 -262 Z" fill="${C(p.pelo)}" stroke="${INK}" stroke-width="2"/>`;
    if (p.peinado === 'trenza') [[-22, -254], [-26, -238], [-28, -222], [-29, -206]].forEach(([cx, cy]) => { sup += `<circle cx="${cx}" cy="${cy}" r="7" fill="${C(p.pelo)}" stroke="${INK}" stroke-width="1.6"/>`; });
    if (p.peinado === 'trenza') sup += `<rect x="-34" y="-198" width="10" height="5" fill="${TERRA}" stroke="${INK}"/>`;
    if (p.peinado === 'rodete') sup += `<circle cx="-18" cy="-292" r="11" fill="${C(p.pelo)}" stroke="${INK}" stroke-width="2"/>`;
    // sombreros
    if (p.sombrero === 'galera') sup += `<rect x="-19" y="-338" width="38" height="42" fill="${INK}"/><rect x="-30" y="-300" width="60" height="7" rx="3" fill="${INK}"/><rect x="-19" y="-308" width="38" height="5" fill="${TERRA}"/>`;
    if (p.sombrero === 'ala') sup += `<path d="M-20 -294 Q-20 -322 0 -322 Q20 -322 20 -294 Z" fill="#3e2a1c" stroke="${INK}" stroke-width="2"/><ellipse cx="0" cy="-294" rx="46" ry="8" fill="#3e2a1c" stroke="${INK}" stroke-width="2"/><rect x="-20" y="-302" width="40" height="5" fill="${SEPIA}"/>`;
    // objetos en la mano
    if (p.objeto === 'libro') sup += `<rect x="34" y="-192" width="26" height="34" fill="${C(TERRA)}" stroke="${INK}" stroke-width="2"/><path d="M38 -186 h18" stroke="${CREMA}"/>`;
    if (p.objeto === 'papeles') sup += `<rect x="32" y="-196" width="28" height="36" fill="${sil ? INK : CREMA}" stroke="${INK}" stroke-width="2" transform="rotate(-8 46 -178)"/><path d="M37 -186h18M37 -178h18M37 -170h14" stroke="${INK}" stroke-opacity=".5" transform="rotate(-8 46 -178)"/>`;
    if (p.objeto === 'farol') sup += `<circle cx="46" cy="-150" r="70" fill="url(#g-luz)" opacity=".8"/><path d="M42 -168 v8" stroke="${INK}" stroke-width="2"/><rect x="34" y="-160" width="24" height="30" fill="#ffe08a" stroke="${INK}" stroke-width="2.5"/><path d="M34 -160 h24 l-4 -6 h-16 Z" fill="${INK}"/>`;
    if (p.objeto === 'baston') s += `<path d="M54 -140 L62 0" stroke="${MARRON}" stroke-width="6" stroke-linecap="round"/><path d="M54 -140 L62 0" stroke="${INK}" stroke-width="1.5" fill="none" opacity=".6"/>`;

    s += p.encorvada ? `<g transform="rotate(7 0 -150)">${sup}</g>` : sup;
    return s;
  }

  function figura(id) {
    const p = PERSONAJES[id];
    if (!p) return '';
    if (p.grupo) {
      const a = Object.assign({}, PERSONAJES.elena, { peinado: 'corto', delantal: false });
      const b = Object.assign({}, PERSONAJES.tomas, { objeto: 'farol', sombrero: null, panuelo: false });
      const c = Object.assign({}, PERSONAJES.elvira, { objeto: null, cuello: false, peinado: 'corto' });
      return `<g transform="translate(-80 0) scale(.86)">${cuerpo(a, true)}</g><g transform="translate(80 0) scale(.9) scale(-1 1)">${cuerpo(c, true)}</g><g transform="scale(.95)">${cuerpo(b, true)}</g>`;
    }
    return `<g transform="scale(${p.h})">${cuerpo(p, false)}</g>`;
  }

  function retrato(id) {
    return `<svg viewBox="-80 -340 160 190" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Retrato ilustrado de ${esc(PERSONAJES[id].nombre)}" class="retrato-svg">
<rect x="-80" y="-340" width="160" height="190" fill="#d9c49c"/><rect x="-80" y="-340" width="160" height="190" fill="url(#h-fino)"/>
<g transform="translate(0 ${id === 'aurelio' || id === 'tomas' ? 22 : id === 'buscadores' ? 40 : -10}) scale(${1 / (PERSONAJES[id].h || 1)})">${figura(id)}</g>
<rect x="-80" y="-340" width="160" height="190" fill="url(#g-vineta)"/></svg>`;
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

  /* ---------- Composición de una escena completa ---------- */
  function escena(cfg) {
    // cfg: { fondo, figuras:[{f,x,y,s,espejo}], globos:[{tipo,texto,x,y,cola}], alt, clase }
    const f = FONDOS[cfg.fondo] || FONDOS.cuarto;
    let s = `<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(cfg.alt || f.nombre)}" class="${cfg.clase || 'vineta-svg'}" preserveAspectRatio="xMidYMid slice">`;
    s += f.dibujo();
    (cfg.figuras || []).forEach(fg => {
      const sc = fg.s || 1;
      s += `<g transform="translate(${fg.x} ${fg.y}) scale(${fg.espejo ? -sc : sc} ${sc})">${figura(fg.f)}</g>`;
    });
    (cfg.globos || []).forEach(g => { s += `<g transform="translate(${g.x} ${g.y})">${globo(g).svg}</g>`; });
    s += `<rect width="800" height="600" filter="url(#f-grano)" opacity=".7"/>`;
    s += '</svg>';
    return s;
  }

  /* ---------- Documentos en primer plano (Capítulo 1) ---------- */
  const DOCS = {
    hoja: () => `<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="La hoja rota. Frases legibles: en el acta de fundación de la ciudad; aquella noche de marzo; los que buscaban no eran ladrones; sus nombres no figuran en ningún; que alguien escriba la página que falta. Firma: T." class="doc-svg">${FONDOS.hojagrande.dibujo()}</svg>`,
    carta: () => `<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Carta manuscrita de la abuela Teodora, junto a una cajita roja abierta." class="doc-svg">
<rect width="800" height="600" fill="#5b4330"/><rect width="800" height="600" fill="url(#h-diag)"/>
<g transform="translate(70 360) rotate(-6)"><rect width="200" height="110" rx="6" fill="${TERRA}" stroke="${INK}" stroke-width="3"/><rect width="200" height="110" fill="url(#h-diag)"/><circle cx="60" cy="60" r="12" fill="#efe6d6" stroke="${INK}" stroke-width="2"/><path d="M110 50 q30 -20 60 10 q-30 30 -60 0" fill="${PETRO2}" stroke="${INK}" stroke-width="2"/></g>
<g transform="rotate(3 470 290)"><rect x="300" y="70" width="380" height="450" fill="url(#g-papel)" stroke="${INK}" stroke-width="3"/>
<path d="M300 295 h380" stroke="${INK}" stroke-opacity=".25"/>
${['Elena:', 'lo que no está en los papeles,', 'está en la gente.', 'Si alguna vez encontrás la hoja,', 'preguntale a Rosario,', 'la de la acequia.', 'Y no le creas todo a nadie…', '…ni a mí.', '                     Teodora'].map((l, i) => `<text x="330" y="${130 + i * 44}" font-family="Georgia,serif" font-style="italic" font-size="23" fill="#3b2a1d">${esc(l)}</text>`).join('')}
</g></svg>`,
    almanaque: () => `<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Almanaque de marzo de 1861 con el día 20 marcado en rojo; una grieta atraviesa la pared." class="doc-svg">
<rect width="800" height="600" fill="#d9c49c"/><rect width="800" height="600" fill="url(#h-fino)"/>
<path d="M120 0 L160 120 L110 230 L180 350 L140 480 L190 600" stroke="${INK}" stroke-width="7" fill="none"/>
<g transform="rotate(3 460 300)"><rect x="260" y="60" width="400" height="480" fill="${CREMA}" stroke="${INK}" stroke-width="3"/>
<rect x="260" y="60" width="400" height="70" fill="${TERRA}"/><text x="460" y="108" text-anchor="middle" font-family="Georgia,serif" font-size="36" fill="${CREMA}" letter-spacing="6">MARZO · 1861</text>
${['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => `<text x="${300 + i * 54}" y="165" text-anchor="middle" font-family="Georgia,serif" font-size="18" fill="${SEPIA}">${d}</text>`).join('')}
${Array.from({ length: 31 }, (_, i) => { const pos = i + 4; const c = pos % 7, r = Math.floor(pos / 7); return `<text x="${300 + c * 54}" y="${210 + r * 62}" text-anchor="middle" font-family="Georgia,serif" font-size="24" fill="${INK}">${i + 1}</text>`; }).join('')}
<ellipse cx="${300 + ((19 + 4) % 7) * 54}" cy="${202 + Math.floor((19 + 4) / 7) * 62}" rx="26" ry="22" fill="none" stroke="${TERRA}" stroke-width="4"/>
</g><rect width="800" height="600" fill="url(#g-vineta)"/></svg>`,
    ventana: () => escena({ fondo: 'ruinas', alt: 'Vista de los arcos rotos de la ciudad vieja con la cordillera al fondo.', clase: 'doc-svg' })
  };

  /* Portada */
  function portada() {
    return `<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Ilustración de portada: Elena sostiene una hoja rota frente a las ruinas de la ciudad vieja, de noche, iluminada por un farol." class="portada-svg" preserveAspectRatio="xMidYMid slice">
${FONDOS.noche.dibujo()}
<g transform="translate(250 585) scale(1.25)">${figura('buscadores')}</g>
<g transform="translate(560 590) scale(1.45 1.45)">${figura('elena')}</g>
<g transform="translate(470 300) rotate(-10)"><path d="M0 0 L60 -8 L70 20 L64 50 L4 56 L8 30 Z" fill="url(#g-papel)" stroke="${INK}" stroke-width="2.5"/><path d="M0 0 L60 -8 L70 20 L64 50 L4 56 L8 30 Z" fill="url(#g-quemado)"/></g>
<rect width="800" height="600" filter="url(#f-grano)" opacity=".7"/></svg>`;
  }

  return { defs, FONDOS, PERSONAJES, figura, retrato, globo, escena, DOCS, portada, esc, lineas };
})();
