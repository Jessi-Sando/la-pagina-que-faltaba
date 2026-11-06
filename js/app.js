/* =========================================================
   LA PÁGINA QUE FALTABA — Aplicación
   Navegación por capítulos, progreso local, bitácora,
   editor de viñetas, decisiones y exportaciones.
   Sin servidor, sin registro, sin servicios externos.
   ========================================================= */
(function () {
  'use strict';
  const D = window.DATOS, A = window.ARTE, esc = A.esc;
  const CLAVE = 'lpqf-progreso-v1';
  const $ = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));
  const TOTAL_PISTAS = Object.keys(D.PISTAS).length;
  const ORDEN_VOCES = Object.keys(D.VOCES);

  /* ======================= ESTADO ======================= */
  const BASE = () => ({
    pistas: {}, objetosVistos: {}, preguntas: {}, clasif: {}, comparaciones: [],
    vinetas: [], editor: null, decision: null, finalesVistos: {}, desenlacePropio: '',
    autoeval: { criterios: [false, false, false, false, false], reflexion: '', nombre: '' },
    bitacora: []
  });
  let S = cargar();
  function cargar() {
    try { const r = JSON.parse(localStorage.getItem(CLAVE)); if (r && typeof r === 'object') return Object.assign(BASE(), r); } catch (e) { /* sin almacenamiento */ }
    return BASE();
  }
  function guardar() { try { localStorage.setItem(CLAVE, JSON.stringify(S)); } catch (e) { /* modo privado o sin espacio */ } }
  function registrar(texto) { S.bitacora.push({ t: Date.now(), texto }); if (S.bitacora.length > 300) S.bitacora.shift(); guardar(); }
  const uid = () => 'i' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const fecha = t => new Date(t).toLocaleString('es-AR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });

  function ganarPista(id, silencioso) {
    if (!D.PISTAS[id] || S.pistas[id]) return false;
    S.pistas[id] = Date.now();
    registrar('Pista registrada: ' + D.PISTAS[id].nombre);
    if (!silencioso) aviso('Nueva pista en la bitácora: «' + D.PISTAS[id].nombre + '»');
    actualizarBarra();
    const c = $('#contador-pistas'); c.classList.remove('latido'); void c.offsetWidth; c.classList.add('latido');
    return true;
  }
  const vozCompleta = v => D.PREGUNTAS.every(q => (S.preguntas[v] || []).indexOf(q.id) > -1);
  const vocesCompletas = () => ORDEN_VOCES.filter(vozCompleta);
  function verificarDesbloqueos() {
    const nuevas = [];
    D.DESBLOQUEOS.forEach(d => { if (d.requiere.every(vozCompleta) && ganarPista(d.pista, true)) nuevas.push(d.pista); });
    if (nuevas.length) aviso('Nueva interpretación: «' + D.PISTAS[nuevas[nuevas.length - 1]].nombre + '». Revisala en el Archivo.');
    return nuevas;
  }
  const pistasHalladas = () => Object.keys(D.PISTAS).filter(id => S.pistas[id]);

  function progreso() {
    const ov = Object.keys(S.objetosVistos).length;
    return {
      cap1: ov >= 3 && !!S.objetosVistos.hoja,
      cap2: vocesCompletas().length >= 3,
      cap3: S.comparaciones.length >= 1 && Object.keys(S.clasif).length >= 3,
      cap4: S.vinetas.length >= 1,
      cap5: !!S.decision,
      cierre: !!(S.autoeval.reflexion || '').trim()
    };
  }
  const CAPITULOS = [
    { ruta: 'cap1', n: '1', titulo: 'El hallazgo', meta: 'Explorá al menos 3 objetos (incluida la hoja).' },
    { ruta: 'cap2', n: '2', titulo: 'Las voces', meta: 'Escuchá completas al menos 3 voces.' },
    { ruta: 'cap3', n: '3', titulo: 'Archivo de pistas', meta: 'Clasificá 3 pistas y guardá una comparación.' },
    { ruta: 'cap4', n: '4', titulo: 'La viñeta que falta', meta: 'Creá y guardá una viñeta.' },
    { ruta: 'cap5', n: '5', titulo: 'Decisiones y desenlaces', meta: 'Decidí qué hacer con la página.' },
    { ruta: 'cierre', n: '✓', titulo: 'Autoevaluación y resumen', meta: 'Reflexioná y descargá tu recorrido.' }
  ];

  /* ======================= UTILIDADES DE INTERFAZ ======================= */
  let avisoTimer;
  function aviso(texto) {
    const a = $('#aviso'); a.textContent = texto; a.classList.add('visible');
    clearTimeout(avisoTimer); avisoTimer = setTimeout(() => a.classList.remove('visible'), 4200);
  }
  const modal = $('#modal');
  let focoPrevio = null;
  function abrirModal(html, alAbrir) {
    focoPrevio = document.activeElement;
    $('#modal-contenido').innerHTML = html;
    if (typeof modal.showModal === 'function') modal.showModal(); else modal.setAttribute('open', '');
    if (alAbrir) alAbrir($('#modal-contenido'));
    const t = $('#modal-titulo'); if (t) { t.setAttribute('tabindex', '-1'); t.focus(); }
  }
  function cerrarModal() { if (modal.open) { if (modal.close) modal.close(); else modal.removeAttribute('open'); } }
  modal.addEventListener('close', () => { if (focoPrevio && document.body.contains(focoPrevio)) focoPrevio.focus(); });
  $('#modal-cerrar').addEventListener('click', cerrarModal);
  modal.addEventListener('click', e => { if (e.target === modal) cerrarModal(); });

  function etiqueta(tipo) { return `<span class="etiqueta ${tipo}">${esc(D.TIPOS[tipo].corto)}</span>`; }
  function contador(textarea, salida, min) {
    const f = () => { const n = textarea.value.trim().length; salida.textContent = n + ' caracteres' + (min ? (n < min ? ` · mínimo ${min}` : ' ✓') : ''); };
    textarea.addEventListener('input', f); f();
  }
  function descargarBlob(blob, nombre) {
    const url = URL.createObjectURL(blob); const a = document.createElement('a');
    a.href = url; a.download = nombre; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }
  function nombreArchivo(t) { return (t || 'vineta').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'vineta'; }

  function imprimir(html) {
    const cont = $('#impresion');
    cont.innerHTML = html;
    document.body.classList.add('imprimiendo');
    const limpiar = () => { document.body.classList.remove('imprimiendo'); cont.innerHTML = ''; window.removeEventListener('afterprint', limpiar); };
    window.addEventListener('afterprint', limpiar);
    setTimeout(() => { window.print(); setTimeout(() => { if (document.body.classList.contains('imprimiendo')) limpiar(); }, 1500); }, 60);
  }

  function svgAPNG(svg, ancho, alto, nombre) {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas'); c.width = ancho * 2; c.height = alto * 2;
      const ctx = c.getContext('2d'); ctx.scale(2, 2); ctx.fillStyle = '#efe3c8'; ctx.fillRect(0, 0, ancho, alto);
      ctx.drawImage(img, 0, 0, ancho, alto);
      if (c.toBlob) c.toBlob(b => { descargarBlob(b, nombre); aviso('Imagen descargada: ' + nombre); }, 'image/png');
      else { const a = document.createElement('a'); a.href = c.toDataURL('image/png'); a.download = nombre; a.click(); }
    };
    img.onerror = () => aviso('No se pudo generar la imagen en este navegador. Probá con «Imprimir / PDF».');
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  /* ======================= BARRA Y NAVEGACIÓN ======================= */
  const main = $('#principal');
  function actualizarBarra(ruta) {
    $('#contador-num').textContent = pistasHalladas().length;
    $('#contador-total').textContent = TOTAL_PISTAS;
    $('#contador-pistas').setAttribute('aria-label', `Bitácora: ${pistasHalladas().length} de ${TOTAL_PISTAS} pistas encontradas. Ir al archivo.`);
    const p = progreso();
    const actual = ruta || (location.hash.slice(1).split('/')[0] || 'inicio');
    $$('.barra a[data-ruta]').forEach(a => {
      const r = a.dataset.ruta;
      if (r === actual) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
      if (p[r] !== undefined) { a.classList.toggle('hecho', p[r]); a.title = p[r] ? 'Completado' : ''; }
    });
    $('#boton-historia').classList.toggle('activo', ['inicio', 'cap1', 'cap2', 'cap4', 'cap5', 'cierre'].indexOf(actual) > -1);
  }
  $('#menu-boton').addEventListener('click', () => {
    const m = $('#menu'), ab = m.classList.toggle('abierto');
    $('#menu-boton').setAttribute('aria-expanded', ab ? 'true' : 'false');
  });
  /* Menús desplegables (Historia e Información) */
  function cerrarDesplegables(excepto) {
    $$('.desplegable > button[aria-controls]').forEach(b => {
      if (b === excepto) return;
      b.setAttribute('aria-expanded', 'false'); $('#' + b.getAttribute('aria-controls')).classList.remove('abierto');
    });
  }
  $$('.desplegable > button[aria-controls]').forEach(b => b.addEventListener('click', e => {
    e.stopPropagation();
    const abrir = b.getAttribute('aria-expanded') !== 'true';
    cerrarDesplegables(b);
    b.setAttribute('aria-expanded', abrir ? 'true' : 'false');
    $('#' + b.getAttribute('aria-controls')).classList.toggle('abierto', abrir);
    if (abrir && e.detail === 0) { const l = $('#' + b.getAttribute('aria-controls') + ' a'); if (l) l.focus(); }
  }));
  document.addEventListener('click', e => { if (!e.target.closest('.desplegable')) cerrarDesplegables(); });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    const abierto = $('.desplegable > button[aria-expanded="true"]');
    if (abierto) { cerrarDesplegables(); abierto.focus(); }
  });
  /* Ilustraciones: si falta el archivo definitivo, se usa la versión provisoria */
  document.addEventListener('error', e => {
    const im = e.target;
    if (im.tagName === 'IMG' && im.dataset.provisoria && im.getAttribute('src') !== im.dataset.provisoria) im.src = im.dataset.provisoria;
  }, true);
  $('.saltar').addEventListener('click', e => { e.preventDefault(); main.focus(); });

  const VISTAS = {};
  let primeraCarga = true;
  function navegar() {
    const partes = (location.hash.slice(1) || 'inicio').split('/');
    const ruta = VISTAS[partes[0]] ? partes[0] : 'inicio';
    cerrarModal();
    main.innerHTML = '';
    const c = document.createElement('div'); c.className = 'vista'; main.appendChild(c);
    VISTAS[ruta](c, partes[1]);
    actualizarBarra(ruta);
    $('#menu').classList.remove('abierto'); $('#menu-boton').setAttribute('aria-expanded', 'false'); cerrarDesplegables();
    main.classList.toggle('ancho-completo', ruta === 'inicio');
    const h1 = $('h1', main);
    document.title = (h1 && ruta !== 'inicio' ? h1.textContent + ' · ' : '') + 'La página que faltaba';
    window.scrollTo(0, 0);
    if (!primeraCarga && h1) { h1.setAttribute('tabindex', '-1'); h1.focus({ preventScroll: true }); }
    primeraCarga = false;
  }
  window.addEventListener('hashchange', navegar);

  function siguientePendiente() {
    const p = progreso();
    const c = CAPITULOS.find(c => !p[c.ruta]);
    return c ? c.ruta : 'cierre';
  }
  function navSiguiente(ant, sig, textoSig) {
    return `<nav class="siguiente" aria-label="Navegación entre capítulos">
      ${ant ? `<a class="boton secundario" href="#${ant[0]}">← ${esc(ant[1])}</a>` : '<span></span>'}
      ${sig ? `<a class="boton" href="#${sig[0]}">${esc(textoSig || sig[1])} →</a>` : ''}
    </nav>`;
  }
  function figuraNarrativa(e, extraClase) {
    const alt = e.alt + ((e.globos || []).length ? ' Diálogos: ' + e.globos.map(g => '«' + g.texto + '»').join(' ') : '');
    return `<figure class="vineta ${extraClase || ''}">${A.escena({ fondo: e.fondo, figuras: (e.figuras || []).map(f => ({ f: f.f, x: f.x, y: f.y, s: f.s, espejo: f.espejo })), globos: (e.globos || []).map(g => Object.assign({ fs: 28, max: 17 }, g)), alt })}
      ${e.cartela ? `<figcaption class="cartela">${esc(e.cartela)}</figcaption>` : ''}</figure>`;
  }

  /* ======================= PORTADA ======================= */
  /* Ilustraciones: archivo definitivo en img/ y provisorio en img/provisorias/ */
  const ilus = (nombre, alt, extra) => `<img src="img/${nombre}.webp" data-provisoria="img/provisorias/${nombre}.webp" alt="${esc(alt)}" ${extra || ''}>`;
  const CARTAS = [
    { ruta: 'cap1', n: '01', titulo: 'El hallazgo', img: 'cap1-hallazgo' },
    { ruta: 'cap2', n: '02', titulo: 'Las voces', img: 'cap2-voces' },
    { ruta: 'cap3', n: '03', titulo: 'Archivo de pistas', img: 'cap3-archivo' },
    { ruta: 'cap4', n: '04', titulo: 'La viñeta', img: 'cap4-vineta' },
    { ruta: 'cap5', n: '05', titulo: 'Decisiones', img: 'cap5-decisiones' }
  ];
  VISTAS.inicio = function (c) {
    const p = progreso();
    const empezado = pistasHalladas().length > 0 || S.vinetas.length > 0;
    c.innerHTML = `
    <section class="heroe" aria-labelledby="titulo-portada">
      ${ilus('portada-heroe', 'Ilustración: de espaldas, Elena sostiene una hoja antigua y deteriorada a la luz de un farol; por la ventana se ven las ruinas de una iglesia y la cordillera.', 'class="heroe-img" fetchpriority="high"')}
      <div class="heroe-velo" aria-hidden="true"></div>
      <div class="heroe-contenido">
        <h1 id="titulo-portada" class="heroe-titulo"><span>La página</span> <span>que faltaba</span></h1>
        <p class="heroe-cinta">Memorias de una historia olvidada</p>
        <div class="ornamento" aria-hidden="true"><svg viewBox="0 0 300 24"><path d="M4 12 H118 M182 12 H296" stroke="currentColor" stroke-width="1.4"/><path d="M118 12 q8 -9 16 0 q-8 9 -16 0 Z M182 12 q-8 -9 -16 0 q8 9 16 0 Z" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M150 2 L153 9 L160 12 L153 15 L150 22 L147 15 L140 12 L147 9 Z" fill="currentColor"/><circle cx="104" cy="12" r="2" fill="currentColor"/><circle cx="196" cy="12" r="2" fill="currentColor"/></svg></div>
        <p class="heroe-intro">Años después del terremoto de 1861, una hoja deteriorada reaparece y abre nuevas preguntas sobre la fundación de Mendoza, la revolución y las voces que casi no se escucharon. ¿Te animás a investigarlas?</p>
        <a class="boton-tinta" href="#cap1">Comenzar la investigación <svg viewBox="0 0 10 16" aria-hidden="true"><path d="M2 2 L8 8 L2 14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></a>
        ${empezado ? `<a class="heroe-continuar" href="#${siguientePendiente()}">o continuar donde lo dejaste →</a>` : ''}
        <ul class="heroe-enlaces" aria-label="Antes de empezar">
          <li><a href="#como">Cómo participar</a></li>
          <li><a href="#fuentes">Fuentes y ficción</a></li>
          <li><a href="#universo">Universo transmedia</a></li>
        </ul>
      </div>
      <svg class="borde-rasgado" viewBox="0 0 1600 80" preserveAspectRatio="none" aria-hidden="true"><path fill="#ecdfc3" d="M0 80 L0 52 L38 46 L70 58 L118 40 L160 50 L205 34 L240 47 L292 38 L330 55 L380 42 L431 49 L470 30 L520 44 L566 37 L600 52 L652 40 L700 46 L742 28 L790 45 L842 36 L880 50 L930 41 L975 55 L1020 33 L1070 46 L1110 39 L1160 52 L1205 35 L1250 48 L1300 40 L1342 56 L1390 38 L1436 47 L1480 34 L1530 50 L1570 42 L1600 48 L1600 80 Z"/></svg>
    </section>
    <nav class="cartas" aria-label="Capítulos de la historia">
      <ol>
        ${CARTAS.map(k => `<li><a class="carta" href="#${k.ruta}">
          <span class="carta-img">${ilus(k.img, '')}</span>
          <span class="carta-rotulo"><span class="carta-num" aria-hidden="true">${k.n}</span><span class="carta-titulo"><span class="solo-lector">Capítulo ${+k.n}: </span>${esc(k.titulo)}</span></span>
          ${p[k.ruta] ? '<span class="sello">Completado</span>' : ''}
        </a></li>`).join('')}
      </ol>
      <p class="cartas-pie">${p.cap5 ? '' : 'Podés seguir el orden o volver a cualquier capítulo. '}Al final: <a href="#cierre">autoevaluación y resumen de tu recorrido</a>${p.cierre ? ' ✓' : ''}.</p>
    </nav>
    <section class="banda-etiquetas" aria-labelledby="t-leer">
      <h2 id="t-leer">Cómo leer esta historia</h2>
      <ul>
        <li>${etiqueta('historica')}<br>${esc(D.TIPOS.historica.explicacion)}</li>
        <li>${etiqueta('ficcion')}<br>${esc(D.TIPOS.ficcion.explicacion)}</li>
        <li>${etiqueta('interpretacion')}<br>${esc(D.TIPOS.interpretacion.explicacion)}</li>
      </ul>
    </section>`;
  };

  /* ======================= CÓMO PARTICIPAR ======================= */
  VISTAS.como = function (c) {
    c.innerHTML = `
    <header class="cabecera"><div><p class="kicker">Guía para estudiantes</p><h1>Cómo participar</h1></div></header>
    <p class="bajada">Sos investigador o investigadora de una historia que nadie terminó de contar. No hay una única respuesta correcta: lo importante es que puedas <strong>justificar</strong> lo que pensás con pistas.</p>
    <ol class="pasos">
      <li><strong>Explorá.</strong> En el Capítulo 1, tocá los objetos marcados con 🔍 en la habitación de Elena. Cada objeto agrega pistas a tu bitácora.</li>
      <li><strong>Escuchá.</strong> En el Capítulo 2, hacé preguntas a cuatro personas. Sus recuerdos no coinciden: anotá las diferencias en el tablero de versiones.</li>
      <li><strong>Ordená.</strong> En el Capítulo 3, clasificá cada pista: ¿es una fuente histórica, un elemento de ficción o una interpretación? Compará dos testimonios y escribí por qué creés que difieren.</li>
      <li><strong>Creá.</strong> En el Capítulo 4, armá la viñeta que falta: fondo, personajes, globos y texto propio. Explicá qué inventaste y en qué fuentes te apoyaste.</li>
      <li><strong>Decidí.</strong> En el Capítulo 5, elegí qué hace Elena con la página y justificá tu decisión. Cada elección lleva a un final distinto.</li>
      <li><strong>Revisá.</strong> En el Cierre, autoevaluate y descargá o imprimí el resumen de tu recorrido para entregarlo.</li>
    </ol>
    <div class="columnas" style="margin-top:2rem">
      <div class="caja">
        <h2>Las tres etiquetas</h2>
        <p>${etiqueta('historica')} ${esc(D.TIPOS.historica.explicacion)}</p>
        <p>${etiqueta('ficcion')} ${esc(D.TIPOS.ficcion.explicacion)}</p>
        <p>${etiqueta('interpretacion')} ${esc(D.TIPOS.interpretacion.explicacion)}</p>
      </div>
      <div class="caja">
        <h2>Uso con teclado y accesibilidad</h2>
        <ul>
          <li><kbd>Tab</kbd> recorre botones y enlaces; <kbd>Enter</kbd> o <kbd>Espacio</kbd> los activa.</li>
          <li><kbd>Esc</kbd> cierra las ventanas de documentos.</li>
          <li>En el editor de viñetas, seleccioná un elemento con <kbd>Tab</kbd> y movelo con las <kbd>flechas</kbd> (con <kbd>Mayús</kbd> se mueve más rápido). <kbd>Supr</kbd> lo quita.</li>
          <li>Todas las ilustraciones tienen una descripción en texto y todos los diálogos aparecen también escritos fuera de la imagen.</li>
        </ul>
        <h2>Privacidad</h2>
        <p>No hace falta registrarse. Nada de lo que escribís sale de este dispositivo: se guarda en el navegador para que puedas continuar otro día.</p>
      </div>
    </div>
    <section class="caja" style="margin-top:1.5rem" aria-labelledby="t-prog">
      <h2 id="t-prog">Tu progreso</h2>
      <p>Si cambiás de computadora o compartís el equipo, guardá una copia de tu recorrido y cargala después.</p>
      <div class="acciones">
        <button class="boton secundario chico" id="exp-json">Guardar copia del progreso (.json)</button>
        <label class="boton secundario chico" for="imp-json" style="cursor:pointer">Cargar una copia</label>
        <input type="file" id="imp-json" accept="application/json,.json" class="solo-lector">
        <button class="boton secundario chico" id="demo">Cargar recorrido de demostración</button>
        <button class="boton secundario chico" id="reiniciar">Reiniciar todo</button>
      </div>
    </section>
    ${navSiguiente(['inicio', 'Portada'], ['cap1', 'Comenzar la investigación'])}`;
    conectarProgreso(c);
  };

  function conectarProgreso(c) {
    $('#exp-json', c).addEventListener('click', () => {
      descargarBlob(new Blob([JSON.stringify(S, null, 2)], { type: 'application/json' }), 'mi-recorrido-la-pagina-que-faltaba.json');
      aviso('Copia del progreso descargada.');
    });
    $('#imp-json', c).addEventListener('change', e => {
      const f = e.target.files[0]; if (!f) return;
      const r = new FileReader();
      r.onload = () => {
        try {
          const o = JSON.parse(r.result);
          if (!o || typeof o !== 'object' || !o.pistas) throw new Error('formato');
          S = Object.assign(BASE(), o); guardar(); aviso('Progreso cargado.'); navegar();
        } catch (err) { aviso('Ese archivo no es una copia válida del recorrido.'); }
      };
      r.readAsText(f);
    });
    $('#demo', c).addEventListener('click', () => {
      if (!confirm('Se reemplazará tu progreso actual por un recorrido de ejemplo. ¿Continuar?')) return;
      cargarDemo(); aviso('Recorrido de demostración cargado.'); location.hash = '#cierre';
    });
    $('#reiniciar', c).addEventListener('click', () => {
      if (!confirm('Se borrará todo tu recorrido en este dispositivo (pistas, viñetas y respuestas). ¿Continuar?')) return;
      S = BASE(); guardar(); aviso('Recorrido reiniciado.'); location.hash = '#inicio'; navegar();
    });
  }

  /* ======================= FUENTES Y FICCIÓN ======================= */
  VISTAS.fuentes = function (c) {
    const hist = Object.keys(D.PISTAS).filter(k => D.PISTAS[k].tipo === 'historica');
    c.innerHTML = `
    <header class="cabecera"><div><p class="kicker">Para leer con lupa</p><h1>Fuentes y ficción</h1></div></header>
    <p class="bajada">Esta historieta mezcla un contexto histórico real con personajes y sucesos inventados. Esta página separa con claridad qué es qué.</p>
    <div class="columnas">
      <section class="caja hist" aria-labelledby="t-h">
        <h2 id="t-h">${etiqueta('historica')} Contexto documentado</h2>
        <ul>${hist.map(k => `<li><strong>${esc(D.PISTAS[k].nombre)}.</strong> ${esc(D.PISTAS[k].desc)}</li>`).join('')}</ul>
        <p><strong>Dónde ampliar:</strong> manuales de Historia de Mendoza de la biblioteca escolar; el Museo del Área Fundacional (Mendoza), que conserva restos de la ciudad colonial; el Archivo General de la Provincia de Mendoza. Siempre conviene contrastar más de una fuente.</p>
      </section>
      <section class="caja fic" aria-labelledby="t-f">
        <h2 id="t-f">${etiqueta('ficcion')} Inventado para esta historia</h2>
        <ul>
          <li><strong>Personajes:</strong> Elena, la abuela Teodora, Rosario Funes, Aurelio Ponce, Tomás Videla, Elvira Sosa y la madre de Tomás. Ninguno existió.</li>
          <li><strong>Objetos:</strong> la hoja rota firmada «T.», la carta de Teodora, el almanaque y el cajón del cabildo tal como se los describe.</li>
          <li><strong>Sucesos:</strong> la búsqueda de los jóvenes del farol, la caja llevada hacia el norte y todos los testimonios.</li>
          <li><strong>Del universo original:</strong> la «revolución huarpe» del cuento escrito por estudiantes es ficticia: no forma parte del registro histórico documentado.</li>
          <li>Ningún diálogo de esta aplicación es una cita histórica.</li>
        </ul>
      </section>
    </div>
    <div class="columnas" style="margin-top:1.5rem">
      <section class="caja int" aria-labelledby="t-i">
        <h2 id="t-i">${etiqueta('interpretacion')} Lo que se puede discutir</h2>
        <p>Las interpretaciones son hipótesis: surgen al relacionar pistas y pueden cambiar si aparece nueva información. En esta experiencia se marcan siempre como tales. Un dato real dicho por un personaje ficticio sigue siendo un dato real, pero el testimonio del personaje sigue siendo ficción.</p>
      </section>
      <section class="caja" aria-labelledby="t-r">
        <h2 id="t-r">Sobre la representación de los pueblos huarpes</h2>
        <p>Para no reproducir estereotipos, esta historieta <strong>no inventa</strong> vestimentas, símbolos, rituales ni palabras huarpes. Los jóvenes del farol aparecen como siluetas: no sabemos quiénes eran, y la historia no lo decide por vos.</p>
        <p>Los pueblos huarpes no pertenecen solo al pasado: hoy existen comunidades huarpes en Cuyo. Para conocer su historia y su presente, lo mejor es buscar materiales producidos por las propias comunidades.</p>
      </section>
    </div>
    ${navSiguiente(['inicio', 'Portada'], ['cap1', 'Comenzar la investigación'])}`;
  };

  /* ======================= UNIVERSO TRANSMEDIA ======================= */
  VISTAS.universo = function (c) {
    const U = D.UNIVERSO;
    const pos = {}; U.nodos.forEach(n => { pos[n.id] = n; });
    const lineas = U.enlaces.map(([a, b]) => {
      const fut = pos[b].tipo === 'futura';
      return `<line x1="${pos[a].x}" y1="${pos[a].y}" x2="${pos[b].x}" y2="${pos[b].y}" stroke="${fut ? '#8a6844' : '#5b3a26'}" stroke-width="${fut ? 2 : 4}" ${fut ? 'stroke-dasharray="6 6"' : ''} vector-effect="non-scaling-stroke" stroke-linecap="round" opacity=".75"/>`;
    }).join('');
    c.innerHTML = `
    <header class="cabecera"><div><p class="kicker">Mapa de relaciones</p><h1>Universo transmedia</h1></div></header>
    <p class="bajada">«La página que faltaba» es una pieza más de un universo narrativo creado por estudiantes de Mendoza. Tocá cada pieza del mapa para ver cómo se conecta con las demás.</p>
    <p class="leyenda-mapa"><span><i style="background:#f0d9a0"></i>Materiales originales</span><span><i style="background:#b5543a"></i>Nueva expansión</span><span><i style="background:#f7efdc;border-style:dashed"></i>Posibles futuras expansiones</span></p>
    <div class="mapa-universo" role="group" aria-label="Mapa del universo transmedia">
      <svg class="lineas" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${lineas}</svg>
      ${U.nodos.map(n => `<button class="nodo ${n.tipo}" data-nodo="${n.id}" aria-pressed="false" style="left:${n.x}%;top:${n.y}%">${esc(n.titulo)}</button>`).join('')}
    </div>
    <div class="detalle-nodo" id="detalle-nodo" aria-live="polite"><p><em>Elegí una pieza del mapa para ver su descripción.</em></p></div>
    <section class="caja" style="margin-top:1.5rem">
      <h2>Cómo dialoga esta expansión con las piezas originales</h2>
      <ul>
        <li><strong>Con el cuento:</strong> no lo repite. Transcurre después del terremoto y pregunta quiénes conservaron —o callaron— la memoria de la búsqueda del acta.</li>
        <li><strong>Con el videojuego:</strong> comparte la idea de que quien participa actúa para avanzar; aquí la acción es investigar, comparar y decidir.</li>
        <li><strong>Con la revista histórica:</strong> retoma la propuesta de contar el pasado a través de documentos, ahora marcando con etiquetas qué es fuente y qué es ficción.</li>
        <li><strong>Hacia adelante:</strong> las viñetas y los desenlaces que crees en los capítulos 4 y 5 pueden convertirse en nuevas piezas del universo.</li>
      </ul>
      <p><small>Las descripciones de las piezas originales se limitan a lo informado en la página del proyecto en educ.ar. Proyecto original con licencia Creative Commons BY-NC-SA; esta expansión no oficial se comparte con la misma licencia.</small></p>
    </section>
    ${navSiguiente(['inicio', 'Portada'], ['cap1', 'Comenzar la investigación'])}`;
    $$('.nodo', c).forEach(b => b.addEventListener('click', () => {
      const n = pos[b.dataset.nodo];
      $$('.nodo', c).forEach(x => x.setAttribute('aria-pressed', x === b ? 'true' : 'false'));
      const tipoTxt = { original: 'Material original', nueva: 'Nueva expansión', futura: 'Posible futura expansión' }[n.tipo];
      const con = U.enlaces.filter(e => e.indexOf(n.id) > -1).map(e => pos[e[0] === n.id ? e[1] : e[0]].titulo);
      $('#detalle-nodo').innerHTML = `<p class="kicker">${tipoTxt}</p><h2>${esc(n.titulo)}</h2><p>${esc(n.texto)}</p>
        <p><strong>Se conecta con:</strong> ${con.map(esc).join(' · ')}</p>
        ${n.enlace ? `<p><a class="boton petroleo chico" href="${n.enlace}" target="_blank" rel="noopener">${esc(n.textoEnlace)} ↗</a> <small>(se abre en otra pestaña; requiere conexión)</small></p>` : ''}
        ${n.interno ? `<p><a class="boton chico" href="${n.interno}">${esc(n.textoEnlace)}</a></p>` : ''}`;
    }));
  };

  /* ======================= CAPÍTULO 1 ======================= */
  VISTAS.cap1 = function (c) {
    const vistos = S.objetosVistos;
    c.innerHTML = `
    <header class="cabecera"><div><p class="kicker">Capítulo 1</p><h1>El hallazgo</h1></div><span>${Object.keys(vistos).length} de ${D.OBJETOS.length} objetos explorados</span></header>
    <div class="tira">${D.TIRA_HALLAZGO.map(e => figuraNarrativa(e)).join('')}</div>
    <h2>Explorá la habitación de Elena</h2>
    <p class="instruccion">Hay <strong>cuatro objetos</strong> que guardan pistas. Tocá los círculos 🔍 de la imagen (o usá la lista de abajo). Para avanzar necesitás explorar <strong>al menos tres</strong>, incluida la hoja.</p>
    <div class="escena">
      <figure class="vineta">${A.escena({ fondo: 'cuarto', figuras: [{ f: 'elena', x: 150, y: 590, s: .8 }], alt: 'La habitación de Elena: un baúl abierto con una hoja encima, un estante con una cajita roja, una pared agrietada con un almanaque y una ventana que da a las ruinas.' })}</figure>
      ${D.OBJETOS.map((o, i) => `<button class="punto ${vistos[o.id] ? 'visto' : ''}" data-obj="${o.id}" style="left:${o.x}%;top:${o.y}%" aria-label="Objeto ${i + 1}: ${esc(o.etiqueta)}${vistos[o.id] ? ' (ya explorado)' : ''}"><span aria-hidden="true">🔍</span><span class="rotulo" aria-hidden="true">${esc(o.etiqueta)}</span></button>`).join('')}
    </div>
    <ul class="lista-objetos" aria-label="Objetos de la escena">
      ${D.OBJETOS.map(o => `<li><button data-obj="${o.id}" class="${vistos[o.id] ? 'visto' : ''}">${vistos[o.id] ? '✓' : '🔍'} ${esc(o.etiqueta)}</button></li>`).join('')}
    </ul>
    <div id="cap1-fin"></div>
    ${navSiguiente(['inicio', 'Portada'], ['cap2', 'Capítulo 2: Las voces'])}`;
    $$('[data-obj]', c).forEach(b => b.addEventListener('click', () => abrirObjeto(b.dataset.obj)));
    pintarFinCap1();
  };
  function pintarFinCap1() {
    const f = $('#cap1-fin'); if (!f) return;
    if (progreso().cap1) f.innerHTML = `<div class="nota-contexto"><p><strong>Elena tiene ya varias pistas, pero ninguna respuesta.</strong> La carta de la abuela menciona a Rosario, «la de la acequia». Es hora de escuchar a quienes recuerdan.</p><a class="boton" href="#cap2">Ir a Las voces →</a></div>`;
  }
  function abrirObjeto(id) {
    const o = D.OBJETOS.find(x => x.id === id);
    const nuevo = !S.objetosVistos[id];
    S.objetosVistos[id] = Date.now();
    if (nuevo) registrar('Exploró el objeto: ' + o.etiqueta);
    const ganadas = o.pistas.filter(p => ganarPista(p, true));
    guardar();
    abrirModal(`
      <p class="kicker">Objeto explorado</p>
      <h2 id="modal-titulo">${esc(o.etiqueta)}</h2>
      <div class="doc">${A.DOCS[o.visual]()}</div>
      <p>${esc(o.texto)}</p>
      <p class="nota-contexto ${D.PISTAS[o.pistas[0]].tipo === 'ficcion' && o.pistas.length === 1 ? 'fic' : ''}">${esc(o.contexto)}</p>
      <h3>${ganadas.length ? 'Pistas agregadas a tu bitácora' : 'Pistas de este objeto (ya estaban en tu bitácora)'}</h3>
      <ul class="pistas-ganadas">${o.pistas.map(p => `<li>${etiqueta(D.PISTAS[p].tipo)} <strong>${esc(D.PISTAS[p].nombre)}</strong></li>`).join('')}</ul>
      <div class="acciones"><button class="boton" id="seguir-explorando">Seguir explorando</button><a class="boton secundario" href="#cap3">Ver la bitácora</a></div>`,
    m => { $('#seguir-explorando', m).addEventListener('click', cerrarModal); });
    if (ganadas.length) aviso(ganadas.length === 1 ? 'Nueva pista registrada.' : ganadas.length + ' pistas nuevas registradas.');
    $$(`[data-obj="${id}"]`).forEach(b => { b.classList.add('visto'); if (b.classList.contains('punto')) b.setAttribute('aria-label', b.getAttribute('aria-label').replace(/ \(ya explorado\)$/, '') + ' (ya explorado)'); else b.textContent = '✓ ' + o.etiqueta; });
    const h = $('.cabecera span'); if (h) h.textContent = `${Object.keys(S.objetosVistos).length} de ${D.OBJETOS.length} objetos explorados`;
    pintarFinCap1(); actualizarBarra('cap1');
  }

  /* ======================= CAPÍTULO 2 ======================= */
  const ultimaRespuesta = {};
  VISTAS.cap2 = function (c, voz) {
    if (voz && D.VOCES[voz]) return vistaTestimonio(c, voz);
    const comp = vocesCompletas();
    c.innerHTML = `
    <header class="cabecera"><div><p class="kicker">Capítulo 2</p><h1>Las voces</h1></div><span>${comp.length} de 4 voces escuchadas completas</span></header>
    <p class="bajada">Elena sale a preguntar. Cada persona recuerda distinto: algunas hablan de una búsqueda, otras de documentos perdidos, otras prefieren callar.</p>
    <p class="instruccion">Elegí a quién escuchar, <strong>en el orden que quieras</strong>. Hacé las tres preguntas a cada persona. Nadie tiene «la» verdad: tu tarea es <strong>comparar versiones</strong>. Escuchá al menos a tres para avanzar.</p>
    <ul class="voces">
      ${ORDEN_VOCES.map(id => {
        const v = D.VOCES[id], n = (S.preguntas[id] || []).length;
        return `<li class="voz"><div class="retrato">${A.retrato(id)}</div><div class="voz-cuerpo">
          <h3>${esc(v.nombre)}</h3><p class="rol">${esc(v.rol)}</p><span class="perspectiva">${esc(v.perspectiva)}</span>
          <span class="progreso-voz">${n === 3 ? '✓ Testimonio completo' : n + ' de 3 preguntas'}</span>
          <a class="boton ${n === 3 ? 'secundario' : ''} chico" href="#cap2/${id}">${n === 0 ? 'Escuchar' : n === 3 ? 'Volver a escuchar' : 'Seguir conversando'} a ${esc(v.nombre.split(' ')[0])}</a>
        </div></li>`;
      }).join('')}
    </ul>
    ${tableroHTML()}
    ${navSiguiente(['cap1', 'Capítulo 1'], ['cap3', 'Capítulo 3: Archivo de pistas'])}`;
  };

  function tableroHTML(compacto) {
    return `<section class="tablero" aria-labelledby="t-tablero">
      <h2 id="t-tablero">Tablero de versiones</h2>
      <p class="ayuda">Cada respuesta que escuchás se clava acá. Leé en horizontal: ¿dónde coinciden las versiones? ¿Dónde se contradicen?</p>
      <div class="tablero-scroll"><table>
        <caption class="solo-lector">Comparación de lo que dice cada persona sobre cada tema</caption>
        <thead><tr><td aria-hidden="true" style="background:none;border:none;box-shadow:none"></td>${ORDEN_VOCES.map(id => `<th scope="col">${esc(D.VOCES[id].nombre)}</th>`).join('')}</tr></thead>
        <tbody>${D.PREGUNTAS.map(q => `<tr><th scope="row">${esc(q.tema)}</th>${ORDEN_VOCES.map(id => {
          const ok = (S.preguntas[id] || []).indexOf(q.id) > -1;
          return ok ? `<td>${esc(D.VOCES[id].tablero[q.id])}</td>` : `<td class="vacia">Todavía no le preguntaste.</td>`;
        }).join('')}</tr>`).join('')}</tbody>
      </table></div>
    </section>`;
  }

  function vistaTestimonio(c, id) {
    const v = D.VOCES[id];
    const hechas = S.preguntas[id] || [];
    const ult = ultimaRespuesta[id];
    const texto = ult ? v.respuestas[ult] : v.saludo;
    const preg = ult ? D.PREGUNTAS.find(q => q.id === ult).texto : null;
    const globos = [];
    if (preg) globos.push({ tipo: 'dialogo', texto: preg, x: 18, y: 18, cola: 'abajo-izq', max: 19, fs: 21 });
    globos.push({ tipo: 'dialogo', texto, x: 382, y: 18, cola: 'abajo-der', max: 30, fs: 21 });
    const completa = vozCompleta(id);
    c.innerHTML = `
    <p><a href="#cap2">← Volver a las voces</a></p>
    <header class="cabecera"><div><p class="kicker">Capítulo 2 · Testimonio</p><h1>${esc(v.nombre)}</h1></div><span class="etiqueta ficcion">Personaje ficticio</span></header>
    <p><em>${esc(v.rol)}</em></p>
    <div class="testimonio">
      <div>
        ${figuraNarrativa({ fondo: v.fondo, figuras: [{ f: 'elena', x: 150, y: 590, s: .8 }, { f: id, x: 640, y: 590, s: .8, espejo: true }], globos, alt: `Elena conversa con ${v.nombre}.` })}
      </div>
      <div>
        <h2>Preguntale</h2>
        <div class="preguntas" role="group" aria-label="Preguntas para ${esc(v.nombre)}">
          ${D.PREGUNTAS.map(q => `<button data-q="${q.id}" aria-pressed="${hechas.indexOf(q.id) > -1}">${esc(q.texto)}</button>`).join('')}
        </div>
        <h3>Lo que escuchaste</h3>
        <ol class="transcripcion" aria-live="polite">
          ${hechas.length ? hechas.map(qid => `<li><span class="q">Elena: ${esc(D.PREGUNTAS.find(q => q.id === qid).texto)}</span>${esc(v.respuestas[qid])}</li>`).join('') : `<li><span class="q">${esc(v.nombre.split(' ')[0])} dice:</span>${esc(v.saludo)}</li>`}
        </ol>
      </div>
    </div>
    ${completa ? `<div class="para-pensar"><p><strong>Perspectiva:</strong> ${esc(v.perspectiva)}.</p><p><strong>Para pensar:</strong> ${esc(v.pensar)}</p>
      <p>Pistas registradas: ${v.pistas.map(p => etiqueta(D.PISTAS[p].tipo) + ' ' + esc(D.PISTAS[p].nombre)).join(' · ')}</p></div>` : ''}
    <h2 style="margin-top:2rem">Escuchar otra voz</h2>
    <div class="otras-voces">${ORDEN_VOCES.filter(x => x !== id).map(x => `<a class="boton secundario chico" href="#cap2/${x}">${vozCompleta(x) ? '✓ ' : ''}${esc(D.VOCES[x].nombre)}</a>`).join('')}</div>
    ${tableroHTML()}
    ${navSiguiente(['cap2', 'Todas las voces'], vocesCompletas().length >= 3 ? ['cap3', 'Capítulo 3: Archivo de pistas'] : null)}`;
    $$('[data-q]', c).forEach(b => b.addEventListener('click', () => {
      const q = b.dataset.q;
      S.preguntas[id] = S.preguntas[id] || [];
      const nueva = S.preguntas[id].indexOf(q) === -1;
      if (nueva) { S.preguntas[id].push(q); registrar(`Preguntó a ${v.nombre}: ${D.PREGUNTAS.find(x => x.id === q).texto}`); }
      ultimaRespuesta[id] = q;
      let ganadas = [];
      if (vozCompleta(id)) ganadas = v.pistas.filter(p => ganarPista(p, true));
      guardar();
      const nuevasInt = verificarDesbloqueos();
      vistaTestimonio(c, id);
      actualizarBarra('cap2');
      const boton = $(`[data-q="${q}"]`, c); if (boton) boton.focus();
      if (ganadas.length && !nuevasInt.length) aviso(`Testimonio completo: ${ganadas.length} pista${ganadas.length > 1 ? 's' : ''} nueva${ganadas.length > 1 ? 's' : ''} en la bitácora.`);
    }));
  }

  /* ======================= CAPÍTULO 3 ======================= */
  let filtroArchivo = 'todas';
  VISTAS.cap3 = function (c) {
    const halladas = pistasHalladas();
    const clasificadas = Object.keys(S.clasif).filter(k => S.pistas[k]);
    const aciertos = clasificadas.filter(k => S.clasif[k] === D.PISTAS[k].tipo).length;
    const visibles = halladas.filter(k => filtroArchivo === 'todas' || (filtroArchivo === 'pendientes' ? !S.clasif[k] : !!S.clasif[k]));
    const faltan = TOTAL_PISTAS - halladas.length;
    c.innerHTML = `
    <header class="cabecera"><div><p class="kicker">Capítulo 3</p><h1>Archivo de pistas</h1></div><span>${halladas.length} de ${TOTAL_PISTAS} pistas · ${clasificadas.length} clasificadas (${aciertos} coinciden con el archivo)</span></header>
    <p class="bajada">Esta es la bitácora de Elena… y la tuya. Cada hallazgo tiene un origen y una relación con otros.</p>
    <p class="instruccion"><strong>Actividad 1:</strong> clasificá cada pista como fuente histórica, elemento ficcional o interpretación, y comprobá. Si no coincide, leé la explicación: <strong>la clasificación del archivo no cambia</strong> por lo que elijas, porque una pista ficticia nunca se vuelve un documento real.<br><strong>Actividad 2:</strong> más abajo, compará dos testimonios y explicá sus diferencias.</p>
    ${halladas.length ? `<div class="filtros" role="group" aria-label="Filtrar pistas">
      ${[['todas', 'Todas'], ['pendientes', 'Por clasificar'], ['clasificadas', 'Clasificadas']].map(([k, t]) => `<button data-filtro="${k}" aria-pressed="${filtroArchivo === k}">${t}</button>`).join('')}
    </div>` : ''}
    <ul class="fichas">
      ${halladas.length ? visibles.map(fichaHTML).join('') || '<li><p><em>No hay pistas en este filtro.</em></p></li>' : `<li class="ficha bloqueada"><h3>Tu archivo está vacío</h3><p>Empezá por el <a href="#cap1">Capítulo 1</a>: explorá la habitación de Elena.</p></li>`}
      ${faltan > 0 && filtroArchivo === 'todas' ? `<li class="ficha bloqueada" aria-label="Pistas por descubrir"><h3>${faltan} pista${faltan > 1 ? 's' : ''} por descubrir</h3><p>Algunas aparecen al explorar objetos; otras, al escuchar voces completas; las interpretaciones, al relacionar testimonios.</p></li>` : ''}
    </ul>
    ${comparadorHTML()}
    ${navSiguiente(['cap2', 'Capítulo 2'], ['cap4', 'Capítulo 4: La viñeta que falta'])}`;
    $$('[data-filtro]', c).forEach(b => b.addEventListener('click', () => { filtroArchivo = b.dataset.filtro; VISTAS.cap3(c); $(`[data-filtro="${filtroArchivo}"]`, c).focus(); }));
    $$('form.clasificar', c).forEach(f => f.addEventListener('submit', e => {
      e.preventDefault();
      const id = f.dataset.pista; const val = (new FormData(f)).get('tipo');
      if (!val) { aviso('Elegí una opción antes de comprobar.'); return; }
      S.clasif[id] = val; registrar(`Clasificó «${D.PISTAS[id].nombre}» como ${D.TIPOS[val].nombre}${val === D.PISTAS[id].tipo ? ' (coincide)' : ' (no coincide: es ' + D.TIPOS[D.PISTAS[id].tipo].nombre + ')'}`);
      guardar(); VISTAS.cap3(c); actualizarBarra('cap3');
      const r = $(`#ficha-${id} .resultado`, c); if (r) { r.setAttribute('tabindex', '-1'); r.focus(); }
    }));
    $$('[data-reclasificar]', c).forEach(b => b.addEventListener('click', () => { delete S.clasif[b.dataset.reclasificar]; guardar(); VISTAS.cap3(c); const f = $(`#ficha-${b.dataset.reclasificar} input`, c); if (f) f.focus(); }));
    $$('[data-ir]', c).forEach(b => b.addEventListener('click', () => {
      let el = $('#ficha-' + b.dataset.ir, c);
      if (!el) { filtroArchivo = 'todas'; VISTAS.cap3(c); el = $('#ficha-' + b.dataset.ir, c); }
      if (!el) return;
      el.scrollIntoView({ behavior: 'smooth', block: 'center' }); el.classList.add('resaltada');
      const h = $('h3', el); h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true });
      setTimeout(() => el.classList.remove('resaltada'), 2200);
    }));
    conectarComparador(c);
  };

  function fichaHTML(id) {
    const p = D.PISTAS[id], el = S.clasif[id];
    const rel = p.rel.map(r => S.pistas[r] ? `<button data-ir="${r}">${esc(D.PISTAS[r].nombre)}</button>` : `<span class="oculta">una pista aún no encontrada</span>`).join(' ');
    let clasifHTML;
    if (!el) {
      clasifHTML = `<form class="clasificar" data-pista="${id}"><fieldset><legend>¿Qué tipo de pista es?</legend>
        <div class="opciones-clasif">${Object.keys(D.TIPOS).map(t => `<label><input type="radio" name="tipo" value="${t}"> ${esc(D.TIPOS[t].nombre)}</label>`).join('')}</div>
        <button class="boton chico" type="submit">Comprobar</button></fieldset></form>
        <p class="meta">Clasificación del archivo: <span class="etiqueta pendiente">se revela al comprobar</span></p>`;
    } else {
      const ok = el === p.tipo;
      clasifHTML = `<p class="meta">Clasificación del archivo: ${etiqueta(p.tipo)}</p>
        <div class="resultado ${ok ? 'ok' : 'no'}"><strong>${ok ? '✓ Tu clasificación coincide.' : '✗ Elegiste «' + esc(D.TIPOS[el].nombre) + '», pero es ' + esc(D.TIPOS[p.tipo].nombre.toLowerCase()) + '.'}</strong> ${esc(p.explicacion)}</div>
        <button class="boton secundario chico" data-reclasificar="${id}">Volver a intentar</button>`;
    }
    return `<li class="ficha" id="ficha-${id}">
      <h3>${esc(p.nombre)}</h3>
      <p class="meta">Procedencia: ${esc(p.procedencia)}</p>
      <p class="desc">${esc(p.desc)}</p>
      <div class="relaciones"><span>Se relaciona con:</span> ${rel}</div>
      ${clasifHTML}
    </li>`;
  }

  function comparadorHTML() {
    const comp = vocesCompletas();
    const opts = sel => comp.map(id => `<option value="${id}" ${sel === id ? 'selected' : ''}>${esc(D.VOCES[id].nombre)}</option>`).join('');
    return `<section class="comparador" aria-labelledby="t-comp">
      <h2 id="t-comp">Actividad 2 · Comparar dos testimonios</h2>
      ${comp.length < 2 ? `<p>Necesitás escuchar completas al menos dos voces en el <a href="#cap2">Capítulo 2</a> para comparar.</p>` : `
      <div class="selectores">
        <label class="campo">Primer testimonio<select id="comp-a">${opts(comp[0])}</select></label>
        <label class="campo">Segundo testimonio<select id="comp-b">${opts(comp[1])}</select></label>
      </div>
      <div id="comp-tabla"></div>
      <label class="campo" for="comp-texto">¿En qué se diferencian estas versiones? ¿Por qué creés que recuerdan distinto?
        <small>No hace falta decidir quién tiene razón. Usá ejemplos de lo que dijo cada persona.</small></label>
      <textarea id="comp-texto" maxlength="1200"></textarea>
      <div class="contador-car" id="comp-cont"></div>
      <div class="acciones"><button class="boton" id="comp-guardar">Guardar comparación</button></div>`}
      ${S.comparaciones.length ? `<h3>Tus comparaciones guardadas</h3><ul class="lista-comparaciones">${S.comparaciones.map((k, i) => `<li><strong>${esc(D.VOCES[k.a].nombre)} ↔ ${esc(D.VOCES[k.b].nombre)}</strong> <small>(${fecha(k.t)})</small><p>${esc(k.texto)}</p><button class="boton secundario chico" data-borrar-comp="${i}">Eliminar</button></li>`).join('')}</ul>` : ''}
    </section>`;
  }
  function conectarComparador(c) {
    $$('[data-borrar-comp]', c).forEach(b => b.addEventListener('click', () => {
      if (!confirm('¿Eliminar esta comparación?')) return;
      S.comparaciones.splice(+b.dataset.borrarComp, 1); guardar(); VISTAS.cap3(c);
    }));
    const a = $('#comp-a', c); if (!a) return;
    const b = $('#comp-b', c), t = $('#comp-texto', c);
    const pintar = () => {
      const va = D.VOCES[a.value], vb = D.VOCES[b.value];
      $('#comp-tabla', c).innerHTML = a.value === b.value ? '<p class="error-lista">Elegí dos testimonios distintos.</p>' : `<table><thead><tr><th scope="col">Tema</th><th scope="col">${esc(va.nombre)}</th><th scope="col">${esc(vb.nombre)}</th></tr></thead>
        <tbody>${D.PREGUNTAS.map(q => `<tr><th scope="row">${esc(q.tema)}</th><td>${esc(va.tablero[q.id])}</td><td>${esc(vb.tablero[q.id])}</td></tr>`).join('')}
        <tr><th scope="row">Perspectiva</th><td>${esc(va.perspectiva)}</td><td>${esc(vb.perspectiva)}</td></tr></tbody></table>`;
    };
    a.addEventListener('change', pintar); b.addEventListener('change', pintar); pintar();
    contador(t, $('#comp-cont', c), 40);
    $('#comp-guardar', c).addEventListener('click', () => {
      if (a.value === b.value) { aviso('Elegí dos testimonios distintos.'); return; }
      if (t.value.trim().length < 40) { aviso('Escribí una justificación un poco más desarrollada (mínimo 40 caracteres).'); t.focus(); return; }
      S.comparaciones.push({ a: a.value, b: b.value, texto: t.value.trim(), t: Date.now() });
      registrar(`Comparó los testimonios de ${D.VOCES[a.value].nombre} y ${D.VOCES[b.value].nombre}`);
      guardar(); aviso('Comparación guardada.'); VISTAS.cap3(c); actualizarBarra('cap3');
      const h = $('#t-comp', c); h.setAttribute('tabindex', '-1'); h.focus();
    });
  }

  /* ======================= CAPÍTULO 4: EDITOR ======================= */
  const ED_FONDOS = ['ruinas', 'cuarto', 'plaza', 'archivo', 'camino', 'noche'];
  const ED_PERS = ['elena', 'rosario', 'aurelio', 'tomas', 'elvira', 'teodora', 'buscadores'];
  const TIPOS_GLOBO = { dialogo: 'Diálogo', pensamiento: 'Pensamiento', grito: 'Grito / exclamación', cartela: 'Cartela del narrador' };
  const COLAS = { 'abajo-izq': 'Abajo a la izquierda', 'abajo-der': 'Abajo a la derecha', 'arriba-izq': 'Arriba a la izquierda', 'arriba-der': 'Arriba a la derecha', ninguna: 'Sin cola' };
  function editorNuevo() {
    return { id: null, titulo: '', fondo: 'ruinas', items: [{ id: uid(), k: 'p', ref: 'elena', x: 320, y: 585, s: .95, espejo: false }], pistas: [], ficcion: '', fuentes: '', sel: null };
  }
  function contenidoVineta(v, interactivo) {
    let s = (A.FONDOS[v.fondo] || A.FONDOS.ruinas).dibujo();
    v.items.forEach(it => {
      const lab = it.k === 'p' ? 'Personaje: ' + A.PERSONAJES[it.ref].nombre : (TIPOS_GLOBO[it.tipo] || 'Globo') + ': ' + (it.texto || 'vacío');
      const inner = it.k === 'p' ? `<g transform="scale(${it.espejo ? -it.s : it.s} ${it.s})">${A.figura(it.ref)}</g>` : A.globo(it).svg;
      s += `<g class="item${interactivo && v.sel === it.id ? ' sel' : ''}" data-id="${it.id}" transform="translate(${Math.round(it.x)} ${Math.round(it.y)})"${interactivo ? ` tabindex="0" role="button" aria-label="${esc(lab)}. Flechas para mover, Suprimir para quitar."` : ''}>${inner}</g>`;
    });
    s += `<rect width="800" height="600" filter="url(#f-grano)" opacity=".6" pointer-events="none"/>`;
    return s;
  }
  function describirVineta(v) {
    const pers = v.items.filter(i => i.k === 'p').map(i => A.PERSONAJES[i.ref].nombre);
    const gl = v.items.filter(i => i.k === 'g' && i.texto).map(i => `${TIPOS_GLOBO[i.tipo]}: «${i.texto}»`);
    return `Viñeta «${v.titulo || 'sin título'}». Fondo: ${A.FONDOS[v.fondo].nombre}. Personajes: ${pers.join(', ') || 'ninguno'}. ${gl.join(' ')}`;
  }
  function svgVineta(v, interactivo) {
    return `<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" ${interactivo ? 'role="group" aria-label="Lienzo de la viñeta. Usá Tab para elegir un elemento."' : `role="img" aria-label="${esc(describirVineta(v))}"`}>${contenidoVineta(v, interactivo)}</svg>`;
  }
  function svgExportable(v) {
    const pie = A.lineas('Pistas: ' + (v.pistas.map(p => D.PISTAS[p] ? D.PISTAS[p].nombre : '').filter(Boolean).join(' · ') || '—'), 96).slice(0, 2);
    const alto = 600 + 96 + pie.length * 18;
    return { alto, svg: `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="${alto}" viewBox="0 0 800 ${alto}">${A.defs()}
      <rect width="800" height="${alto}" fill="#efe3c8"/>${contenidoVineta(v, false)}
      <rect x="4" y="4" width="792" height="592" fill="none" stroke="#2a1c12" stroke-width="8"/>
      <text x="24" y="640" font-family="Georgia,serif" font-size="26" font-weight="700" fill="#2a1c12">${esc(v.titulo || 'Sin título')}</text>
      ${pie.map((l, i) => `<text x="24" y="${668 + i * 18}" font-family="Trebuchet MS,Verdana,sans-serif" font-size="14" fill="#4a3322">${esc(l)}</text>`).join('')}
      <text x="24" y="${alto - 14}" font-family="Georgia,serif" font-style="italic" font-size="13" fill="#8a6844">La página que faltaba · Escena creada por estudiantes · Contiene elementos ficcionales</text></svg>` };
  }
  function descargarVinetaPNG(v) { const e = svgExportable(v); svgAPNG(e.svg, 800, e.alto, nombreArchivo(v.titulo) + '.png'); registrar('Descargó la viñeta como imagen: ' + (v.titulo || 'sin título')); }
  function htmlImpresionVineta(v) {
    return `<h1>${esc(v.titulo || 'Sin título')}</h1><p><em>La página que faltaba · La viñeta que falta</em></p>
      <div class="vineta-imp">${svgVineta(v, false)}</div>
      <section><h2>Pistas que fundamentan la escena</h2><ul>${v.pistas.map(p => `<li>${esc(D.PISTAS[p].nombre)} — ${esc(D.TIPOS[D.PISTAS[p].tipo].nombre)}</li>`).join('')}</ul></section>
      <section><h2>Qué parte es ficción</h2><p>${esc(v.ficcion)}</p></section>
      <section><h2>Qué parte se apoya en fuentes históricas</h2><p>${esc(v.fuentes)}</p></section>`;
  }
  function validarVineta(v) {
    const e = [];
    if (!v.titulo.trim()) e.push('Escribí un título para la escena.');
    if (!v.items.some(i => i.k === 'p')) e.push('Agregá al menos un personaje.');
    if (!v.items.some(i => i.k === 'g' && (i.texto || '').trim())) e.push('Agregá al menos un globo o cartela con texto.');
    if (!v.pistas.length) e.push('Elegí al menos una pista que fundamente la escena.');
    if (v.ficcion.trim().length < 15) e.push('Explicá qué parte de tu escena es ficción (mínimo 15 caracteres).');
    if (v.fuentes.trim().length < 15) e.push('Explicá qué parte se apoya en fuentes históricas, o por qué no hay ninguna (mínimo 15 caracteres).');
    return e;
  }

  VISTAS.cap4 = function (c) {
    if (!S.editor) S.editor = editorNuevo();
    const E = S.editor;
    const halladas = pistasHalladas();
    c.innerHTML = `
    <header class="cabecera"><div><p class="kicker">Capítulo 4</p><h1>La viñeta que falta</h1></div><span>${S.vinetas.length} viñeta${S.vinetas.length === 1 ? '' : 's'} en tu galería</span></header>
    <p class="bajada">La hoja dice: «…que alguien escriba la página que falta». Ahora te toca a vos. Imaginá una escena que nadie registró: la noche de la búsqueda, la caja llevada al norte, la abuela escribiendo la hoja… o lo que tus pistas te sugieran.</p>
    <p class="instruccion">1) Elegí un <strong>fondo</strong>. 2) Agregá <strong>personajes</strong> y <strong>globos</strong>, y arrastralos (o movelos con las flechas). 3) Completá la <strong>fundamentación</strong>: qué pistas usaste, qué es ficción y qué se apoya en fuentes. 4) <strong>Guardá</strong>, previsualizá, descargá o imprimí.</p>
    <div class="editor">
      <div class="lienzo-caja">
        <div class="lienzo" id="lienzo"></div>
        <p class="ayuda-lienzo">Arrastrá los elementos con el mouse o el dedo. Con teclado: <kbd>Tab</kbd> hasta el elemento, <kbd>flechas</kbd> para moverlo (<kbd>Mayús</kbd> = más rápido), <kbd>Supr</kbd> para quitarlo.</p>
      </div>
      <div class="panel">
        <details open><summary>1 · Fondo</summary><div class="contenido"><div class="miniaturas" role="group" aria-label="Fondos">
          ${ED_FONDOS.map(f => `<button data-fondo="${f}" aria-pressed="${E.fondo === f}" aria-label="Fondo: ${esc(A.FONDOS[f].nombre)}"><svg viewBox="0 0 800 600" aria-hidden="true">${A.FONDOS[f].dibujo()}</svg><span>${esc(A.FONDOS[f].nombre)}</span></button>`).join('')}
        </div></div></details>
        <details open><summary>2 · Personajes</summary><div class="contenido"><div class="personajes-boton">
          ${ED_PERS.map(p => `<button data-agregar-pers="${p}" aria-label="Agregar a ${esc(A.PERSONAJES[p].nombre)}">${A.retrato(p).replace('role="img"', 'aria-hidden="true"')}${esc(A.PERSONAJES[p].nombre.replace(' (siluetas)', ''))}</button>`).join('')}
        </div></div></details>
        <details open><summary>3 · Globos y textos</summary><div class="contenido">
          <div class="fila">
            <label class="campo">Tipo<select id="g-tipo">${Object.keys(TIPOS_GLOBO).map(k => `<option value="${k}">${TIPOS_GLOBO[k]}</option>`).join('')}</select></label>
            <label class="campo">Cola<select id="g-cola">${Object.keys(COLAS).map(k => `<option value="${k}">${COLAS[k]}</option>`).join('')}</select></label>
          </div>
          <label class="campo" for="g-texto">Texto <small>(máximo 140 caracteres)</small></label>
          <textarea id="g-texto" maxlength="140" style="min-height:4em" placeholder="Escribí lo que dice, piensa o narra…"></textarea>
          <button class="boton chico" id="g-agregar">Agregar globo</button>
        </div></details>
        <details open><summary>4 · Elemento seleccionado</summary><div class="contenido" id="panel-sel"></div></details>
        <details open><summary>5 · Fundamentación</summary><div class="contenido">
          <label class="campo" for="v-titulo">Título de la escena</label>
          <input type="text" id="v-titulo" maxlength="70" value="${esc(E.titulo)}" placeholder="Ej.: La noche del farol">
          <fieldset class="campo" style="border:none;padding:0;margin:0 0 .8rem"><legend>Pistas que fundamentan tu escena</legend>
            ${halladas.length ? `<div class="check-pistas">${halladas.map(p => `<label><input type="checkbox" value="${p}" data-pista-v ${E.pistas.indexOf(p) > -1 ? 'checked' : ''}> ${etiqueta(D.PISTAS[p].tipo)} ${esc(D.PISTAS[p].nombre)}</label>`).join('')}</div>` : `<p><small>Todavía no tenés pistas. Explorá los <a href="#cap1">capítulos 1</a> y <a href="#cap2">2</a>.</small></p>`}
          </fieldset>
          <label class="campo" for="v-ficcion">¿Qué parte de tu escena es ficción? <small>Personajes, diálogos o hechos que inventaste.</small></label>
          <textarea id="v-ficcion" maxlength="600">${esc(E.ficcion)}</textarea>
          <label class="campo" for="v-fuentes">¿Qué parte se apoya en fuentes históricas? <small>Fechas, lugares o hechos documentados que usaste.</small></label>
          <textarea id="v-fuentes" maxlength="600">${esc(E.fuentes)}</textarea>
        </div></details>
        <div id="v-errores" aria-live="polite"></div>
        <div class="acciones" style="margin:0">
          <button class="boton" id="v-guardar">${E.id ? 'Guardar cambios' : 'Guardar en mi galería'}</button>
          <button class="boton petroleo" id="v-previa">Vista previa</button>
          <button class="boton secundario" id="v-png">Descargar imagen (PNG)</button>
          <button class="boton secundario" id="v-imprimir">Imprimir / PDF</button>
          <button class="boton secundario chico" id="v-nueva">Empezar una viñeta nueva</button>
        </div>
      </div>
    </div>
    <section style="margin-top:2.5rem" aria-labelledby="t-gal">
      <h2 id="t-gal">Tu galería de viñetas</h2>
      <div id="galeria"></div>
    </section>
    ${navSiguiente(['cap3', 'Capítulo 3'], ['cap5', 'Capítulo 5: Decisiones'])}`;

    const lienzo = $('#lienzo', c);
    const item = id => E.items.find(i => i.id === id);
    const pintarLienzo = () => { lienzo.innerHTML = svgVineta(E, true); };
    const persistir = () => { guardar(); };

    function seleccionar(id, enfocar) {
      E.sel = id;
      $$('.item', lienzo).forEach(n => n.classList.toggle('sel', n.dataset.id === id));
      pintarSel();
      if (enfocar && id) { const n = $(`.item[data-id="${id}"]`, lienzo); if (n) n.focus({ preventScroll: true }); }
      persistir();
    }
    function mover(id, dx, dy) {
      const it = item(id); if (!it) return;
      it.x = Math.max(-150, Math.min(900, it.x + dx)); it.y = Math.max(-100, Math.min(760, it.y + dy));
      const n = $(`.item[data-id="${id}"]`, lienzo); if (n) n.setAttribute('transform', `translate(${Math.round(it.x)} ${Math.round(it.y)})`);
      persistir();
    }
    function quitar(id) {
      const i = E.items.findIndex(x => x.id === id); if (i < 0) return;
      E.items.splice(i, 1); E.sel = null; pintarLienzo(); pintarSel(); persistir(); aviso('Elemento quitado de la viñeta.');
    }
    function alFrente(id) {
      const i = E.items.findIndex(x => x.id === id); if (i < 0) return;
      E.items.push(E.items.splice(i, 1)[0]); pintarLienzo(); persistir(); const n = $(`.item[data-id="${id}"]`, lienzo); if (n) n.focus();
    }
    function pintarSel() {
      const p = $('#panel-sel', c); const it = E.sel && item(E.sel);
      if (!it) { p.innerHTML = '<p class="seleccion-vacia">Tocá un personaje o un globo en la viñeta para editarlo.</p>'; return; }
      const flechas = `<div class="flechas" role="group" aria-label="Mover elemento">
        <span class="vacio"></span><button data-mv="0,-20" aria-label="Mover arriba">↑</button><span class="vacio"></span>
        <button data-mv="-20,0" aria-label="Mover a la izquierda">←</button><button data-mv="0,20" aria-label="Mover abajo">↓</button><button data-mv="20,0" aria-label="Mover a la derecha">→</button></div>`;
      if (it.k === 'p') {
        p.innerHTML = `<p><strong>${esc(A.PERSONAJES[it.ref].nombre)}</strong></p>
          <label class="campo" for="s-tam">Tamaño</label><input type="range" id="s-tam" min="0.4" max="1.5" step="0.05" value="${it.s}">
          <div class="fila" style="margin-top:.6rem">${flechas}<div class="acciones" style="margin:0"><button class="boton secundario chico" id="s-voltear">Voltear</button><button class="boton secundario chico" id="s-frente">Traer al frente</button><button class="boton secundario chico" id="s-quitar">Quitar</button></div></div>`;
        $('#s-tam', p).addEventListener('input', e => { it.s = +e.target.value; pintarLienzo(); persistir(); });
        $('#s-voltear', p).addEventListener('click', () => { it.espejo = !it.espejo; pintarLienzo(); persistir(); });
      } else {
        p.innerHTML = `<label class="campo" for="s-texto">Texto del globo</label><textarea id="s-texto" maxlength="140" style="min-height:4em">${esc(it.texto)}</textarea>
          <div class="fila"><label class="campo">Tipo<select id="s-tipo">${Object.keys(TIPOS_GLOBO).map(k => `<option value="${k}" ${it.tipo === k ? 'selected' : ''}>${TIPOS_GLOBO[k]}</option>`).join('')}</select></label>
          <label class="campo">Cola<select id="s-cola">${Object.keys(COLAS).map(k => `<option value="${k}" ${it.cola === k ? 'selected' : ''}>${COLAS[k]}</option>`).join('')}</select></label></div>
          <div class="fila">${flechas}<div class="acciones" style="margin:0"><button class="boton secundario chico" id="s-frente">Traer al frente</button><button class="boton secundario chico" id="s-quitar">Quitar</button></div></div>`;
        $('#s-texto', p).addEventListener('input', e => { it.texto = e.target.value; pintarLienzo(); persistir(); });
        $('#s-tipo', p).addEventListener('change', e => { it.tipo = e.target.value; pintarLienzo(); persistir(); });
        $('#s-cola', p).addEventListener('change', e => { it.cola = e.target.value; pintarLienzo(); persistir(); });
      }
      $$('[data-mv]', p).forEach(b => b.addEventListener('click', () => { const [dx, dy] = b.dataset.mv.split(',').map(Number); mover(it.id, dx, dy); }));
      $('#s-frente', p).addEventListener('click', () => alFrente(it.id));
      $('#s-quitar', p).addEventListener('click', () => quitar(it.id));
    }

    // Arrastre con puntero (mouse, lápiz o dedo)
    let arrastre = null;
    const puntoSVG = e => { const svg = $('svg', lienzo); const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY; return pt.matrixTransform(svg.getScreenCTM().inverse()); };
    lienzo.addEventListener('pointerdown', e => {
      const g = e.target.closest('.item');
      if (!g) { seleccionar(null); return; }
      e.preventDefault();
      const it = item(g.dataset.id); const pt = puntoSVG(e);
      arrastre = { id: it.id, dx: pt.x - it.x, dy: pt.y - it.y, g };
      seleccionar(it.id); g.focus({ preventScroll: true });
      try { lienzo.setPointerCapture(e.pointerId); } catch (err) { /* sin captura */ }
    });
    lienzo.addEventListener('pointermove', e => {
      if (!arrastre) return;
      const it = item(arrastre.id); const pt = puntoSVG(e);
      it.x = Math.max(-150, Math.min(900, pt.x - arrastre.dx)); it.y = Math.max(-100, Math.min(760, pt.y - arrastre.dy));
      arrastre.g.setAttribute('transform', `translate(${Math.round(it.x)} ${Math.round(it.y)})`);
    });
    const soltar = () => { if (arrastre) { arrastre = null; persistir(); } };
    lienzo.addEventListener('pointerup', soltar); lienzo.addEventListener('pointercancel', soltar);
    lienzo.addEventListener('focusin', e => { const g = e.target.closest && e.target.closest('.item'); if (g && E.sel !== g.dataset.id) seleccionar(g.dataset.id); });
    lienzo.addEventListener('keydown', e => {
      const g = e.target.closest && e.target.closest('.item'); if (!g) return;
      const paso = e.shiftKey ? 40 : 10;
      const m = { ArrowUp: [0, -paso], ArrowDown: [0, paso], ArrowLeft: [-paso, 0], ArrowRight: [paso, 0] }[e.key];
      if (m) { e.preventDefault(); mover(g.dataset.id, m[0], m[1]); }
      else if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); quitar(g.dataset.id); }
    });

    // Fondo
    $$('[data-fondo]', c).forEach(b => b.addEventListener('click', () => {
      E.fondo = b.dataset.fondo; $$('[data-fondo]', c).forEach(x => x.setAttribute('aria-pressed', x === b ? 'true' : 'false'));
      pintarLienzo(); persistir();
    }));
    // Personajes
    $$('[data-agregar-pers]', c).forEach(b => b.addEventListener('click', () => {
      const n = E.items.filter(i => i.k === 'p').length;
      const it = { id: uid(), k: 'p', ref: b.dataset.agregarPers, x: 160 + (n * 150) % 520, y: 585, s: .9, espejo: n % 2 === 1 };
      E.items.push(it); pintarLienzo(); seleccionar(it.id);
      aviso(A.PERSONAJES[it.ref].nombre + ' se sumó a la viñeta. Arrastralo a su lugar.');
    }));
    // Globos
    $('#g-agregar', c).addEventListener('click', () => {
      const t = $('#g-texto', c);
      if (!t.value.trim()) { aviso('Escribí el texto del globo antes de agregarlo.'); t.focus(); return; }
      const n = E.items.filter(i => i.k === 'g').length;
      const tipo = $('#g-tipo', c).value;
      const it = { id: uid(), k: 'g', tipo, texto: t.value.trim(), cola: tipo === 'cartela' ? 'ninguna' : $('#g-cola', c).value, x: tipo === 'cartela' ? 14 : 60 + (n * 170) % 460, y: tipo === 'cartela' ? 14 : 40 + (n * 50) % 160 };
      E.items.push(it); t.value = ''; pintarLienzo(); seleccionar(it.id);
      registrar('Agregó un globo a su viñeta');
    });
    // Fundamentación
    $('#v-titulo', c).addEventListener('input', e => { E.titulo = e.target.value; persistir(); });
    $('#v-ficcion', c).addEventListener('input', e => { E.ficcion = e.target.value; persistir(); });
    $('#v-fuentes', c).addEventListener('input', e => { E.fuentes = e.target.value; persistir(); });
    $$('[data-pista-v]', c).forEach(ch => ch.addEventListener('change', () => { E.pistas = $$('[data-pista-v]', c).filter(x => x.checked).map(x => x.value); persistir(); }));

    const errores = () => {
      const e = validarVineta(E); const box = $('#v-errores', c);
      box.innerHTML = e.length ? `<div class="error-lista"><strong>Para guardar o exportar te falta:</strong><ul>${e.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>` : '';
      if (e.length) { box.setAttribute('tabindex', '-1'); box.focus(); }
      return e.length === 0;
    };
    const copiaLimpia = () => { const v = JSON.parse(JSON.stringify(E)); v.sel = null; return v; };
    $('#v-guardar', c).addEventListener('click', () => {
      if (!errores()) return;
      const v = copiaLimpia(); v.t = Date.now();
      if (!v.id) { v.id = uid(); E.id = v.id; }
      const i = S.vinetas.findIndex(x => x.id === v.id);
      if (i > -1) S.vinetas[i] = v; else S.vinetas.push(v);
      registrar(`Guardó la viñeta «${v.titulo}»`);
      guardar(); aviso('Viñeta guardada en tu galería.');
      $('#v-guardar', c).textContent = 'Guardar cambios';
      $('.cabecera span', c).textContent = `${S.vinetas.length} viñeta${S.vinetas.length === 1 ? '' : 's'} en tu galería`;
      pintarGaleria(); actualizarBarra('cap4');
    });
    $('#v-previa', c).addEventListener('click', () => {
      const v = copiaLimpia(); const e = validarVineta(v);
      abrirModal(`<p class="kicker">Vista previa</p><h2 id="modal-titulo">${esc(v.titulo || 'Sin título')}</h2>
        <div class="doc">${svgVineta(v, false)}</div>
        ${e.length ? `<div class="error-lista"><strong>Antes de guardar, completá:</strong><ul>${e.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>` : '<p class="nota-contexto">✓ Tu viñeta está lista para guardar y exportar.</p>'}
        <h3>Pistas</h3><p>${v.pistas.map(p => etiqueta(D.PISTAS[p].tipo) + ' ' + esc(D.PISTAS[p].nombre)).join(' · ') || '—'}</p>
        <h3>Ficción</h3><p>${esc(v.ficcion) || '—'}</p><h3>Fuentes</h3><p>${esc(v.fuentes) || '—'}</p>
        <div class="acciones"><button class="boton" id="cerrar-previa">Seguir editando</button></div>`, m => $('#cerrar-previa', m).addEventListener('click', cerrarModal));
    });
    $('#v-png', c).addEventListener('click', () => { if (errores()) descargarVinetaPNG(copiaLimpia()); });
    $('#v-imprimir', c).addEventListener('click', () => { if (errores()) { imprimir(htmlImpresionVineta(copiaLimpia())); registrar('Imprimió su viñeta'); } });
    $('#v-nueva', c).addEventListener('click', () => {
      if (!confirm('¿Empezar una viñeta nueva? Lo que no hayas guardado en la galería se perderá.')) return;
      S.editor = editorNuevo(); guardar(); VISTAS.cap4(c);
    });

    function pintarGaleria() {
      const g = $('#galeria', c);
      if (!S.vinetas.length) { g.innerHTML = '<p><em>Todavía no guardaste viñetas. Cuando guardes, aparecerán acá para editarlas, descargarlas o imprimirlas.</em></p>'; return; }
      g.innerHTML = `<ul class="galeria">${S.vinetas.map(v => `<li><div class="mini">${svgVineta(v, false)}</div><div class="info"><h3>${esc(v.titulo)}</h3>
        <div class="acciones" style="margin:0"><button class="boton secundario chico" data-gal-editar="${v.id}">Editar</button><button class="boton secundario chico" data-gal-png="${v.id}">PNG</button><button class="boton secundario chico" data-gal-imp="${v.id}">Imprimir</button><button class="boton secundario chico" data-gal-borrar="${v.id}">Eliminar</button></div></div></li>`).join('')}</ul>`;
      const buscar = id => S.vinetas.find(v => v.id === id);
      $$('[data-gal-editar]', g).forEach(b => b.addEventListener('click', () => { S.editor = JSON.parse(JSON.stringify(buscar(b.dataset.galEditar))); S.editor.sel = null; guardar(); VISTAS.cap4(c); $('#lienzo', c).scrollIntoView({ block: 'center' }); aviso('Editando «' + S.editor.titulo + '».'); }));
      $$('[data-gal-png]', g).forEach(b => b.addEventListener('click', () => descargarVinetaPNG(buscar(b.dataset.galPng))));
      $$('[data-gal-imp]', g).forEach(b => b.addEventListener('click', () => imprimir(htmlImpresionVineta(buscar(b.dataset.galImp)))));
      $$('[data-gal-borrar]', g).forEach(b => b.addEventListener('click', () => {
        if (!confirm('¿Eliminar esta viñeta de tu galería?')) return;
        S.vinetas = S.vinetas.filter(v => v.id !== b.dataset.galBorrar);
        if (E.id === b.dataset.galBorrar) E.id = null;
        guardar(); VISTAS.cap4(c);
      }));
    }

    pintarLienzo(); pintarSel(); pintarGaleria();
  };

  /* ======================= CAPÍTULO 5 ======================= */
  let verFinal = null;
  VISTAS.cap5 = function (c) {
    const halladas = pistasHalladas();
    if (!S.decision) {
      c.innerHTML = `
      <header class="cabecera"><div><p class="kicker">Capítulo 5</p><h1>Decisiones y desenlaces</h1></div></header>
      <div class="dilema">
        ${figuraNarrativa({ fondo: 'cuarto', figuras: [{ f: 'elena', x: 420, y: 590, s: 1.05 }], globos: [{ tipo: 'pensamiento', texto: '¿Qué hago con esta página?', x: 470, y: 60, cola: 'abajo-izq' }], cartela: 'Elena tiene la hoja, las pistas y muchas versiones. Ahora tiene que decidir.', alt: 'Elena sostiene la hoja en su habitación, pensativa.' })}
        <form id="form-decision" novalidate>
          <fieldset class="opciones-final"><legend>¿Qué debería hacer Elena con la página encontrada?</legend>
            ${Object.keys(D.FINALES).map(k => `<label class="opcion-final"><input type="radio" name="opcion" value="${k}"><div><strong>${esc(D.FINALES[k].opcion)}</strong><span>${esc(D.FINALES[k].resumen)}</span></div></label>`).join('')}
          </fieldset>
          <p><small>Ninguna opción es «la correcta»: cada una tiene ganancias y costos.</small></p>
          <label class="campo" for="d-just">¿Por qué elegís esa opción? <small>Apoyate en pistas y testimonios que exploraste.</small></label>
          <textarea id="d-just" maxlength="1000"></textarea>
          <div class="contador-car" id="d-cont"></div>
          <fieldset class="campo" style="border:none;padding:0"><legend>Pistas en las que te apoyás</legend>
            ${halladas.length ? `<div class="check-pistas">${halladas.map(p => `<label><input type="checkbox" value="${p}" data-pista-d> ${etiqueta(D.PISTAS[p].tipo)} ${esc(D.PISTAS[p].nombre)}</label>`).join('')}</div>` : '<p><small>Aún no tenés pistas: podés decidir igual, pero te conviene explorar primero los capítulos 1 y 2.</small></p>'}
          </fieldset>
          <div id="d-errores" aria-live="polite"></div>
          <button class="boton" type="submit">Tomar la decisión</button>
        </form>
      </div>
      ${navSiguiente(['cap4', 'Capítulo 4'], null)}`;
      contador($('#d-just', c), $('#d-cont', c), 60);
      $('#form-decision', c).addEventListener('submit', e => {
        e.preventDefault();
        const op = (new FormData(e.target)).get('opcion');
        const just = $('#d-just', c).value.trim();
        const pistas = $$('[data-pista-d]', c).filter(x => x.checked).map(x => x.value);
        const errs = [];
        if (!op) errs.push('Elegí una de las tres opciones.');
        if (just.length < 60) errs.push('Escribí una justificación de al menos 60 caracteres.');
        if (halladas.length && !pistas.length) errs.push('Marcá al menos una pista en la que te apoyás.');
        const box = $('#d-errores', c);
        if (errs.length) { box.innerHTML = `<div class="error-lista"><ul>${errs.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>`; box.setAttribute('tabindex', '-1'); box.focus(); return; }
        S.decision = { opcion: op, justificacion: just, pistas, t: Date.now() };
        S.finalesVistos[op] = true; verFinal = op;
        registrar('Decidió: ' + D.FINALES[op].opcion);
        guardar(); actualizarBarra('cap5'); VISTAS.cap5(c);
      });
      return;
    }
    const dec = S.decision;
    const k = verFinal && D.FINALES[verFinal] ? verFinal : dec.opcion;
    const F = D.FINALES[k];
    const esPropio = k === dec.opcion;
    c.innerHTML = `
    <header class="cabecera"><div><p class="kicker">Capítulo 5 · ${esPropio ? 'Tu desenlace' : 'Otro desenlace posible'}</p><h1>${esc(F.titulo)}</h1></div></header>
    <div class="caja"><p><strong>Tu decisión:</strong> ${esc(D.FINALES[dec.opcion].opcion)}.</p><p><strong>Tu justificación:</strong> ${esc(dec.justificacion)}</p>
      ${dec.pistas.length ? `<p><strong>Pistas:</strong> ${dec.pistas.map(p => esc(D.PISTAS[p].nombre)).join(' · ')}</p>` : ''}</div>
    ${!esPropio ? `<p class="instruccion">Estás viendo un desenlace que <strong>no</strong> elegiste. Compararlo con el tuyo también es parte de la investigación.</p>` : ''}
    <div class="final"><div class="tira">${F.escenas.map(e => figuraNarrativa(e)).join('')}</div></div>
    <div class="consecuencias"><h2>Consecuencias</h2><ul>${F.consecuencias.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
      <p class="pregunta-final">${esc(F.pregunta)}</p></div>
    <section style="margin-top:2rem" aria-labelledby="t-otros">
      <h2 id="t-otros">Explorá los otros desenlaces</h2>
      <div class="acciones">${Object.keys(D.FINALES).map(x => `<button class="boton ${x === k ? '' : 'secundario'} chico" data-final="${x}" ${x === k ? 'aria-current="true"' : ''}>${x === dec.opcion ? '★ ' : ''}${esc(D.FINALES[x].titulo)}</button>`).join('')}</div>
    </section>
    <section class="caja" style="margin-top:1.5rem" aria-labelledby="t-propio">
      <h2 id="t-propio">Escribí tu propio desenlace</h2>
      <p>¿Se te ocurre otro final? Contalo en pocas líneas. Puede ser una cuarta opción o una continuación de la que elegiste. Recordá marcar qué es inventado.</p>
      <label class="campo solo-lector" for="d-propio">Tu desenlace alternativo</label>
      <textarea id="d-propio" maxlength="1500">${esc(S.desenlacePropio)}</textarea>
      <div class="contador-car" id="d-propio-cont"></div>
      <div class="acciones"><button class="boton chico" id="d-propio-guardar">Guardar mi desenlace</button></div>
    </section>
    <div class="acciones"><button class="boton secundario chico" id="d-reconsiderar">Reconsiderar mi decisión</button></div>
    ${navSiguiente(['cap4', 'Capítulo 4'], ['cierre', 'Autoevaluación y resumen'])}`;
    $$('[data-final]', c).forEach(b => b.addEventListener('click', () => {
      verFinal = b.dataset.final; if (!S.finalesVistos[verFinal]) { S.finalesVistos[verFinal] = true; registrar('Exploró el desenlace: ' + D.FINALES[verFinal].titulo); guardar(); }
      VISTAS.cap5(c); window.scrollTo(0, 0); const h = $('h1', c); h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true });
    }));
    contador($('#d-propio', c), $('#d-propio-cont', c));
    $('#d-propio-guardar', c).addEventListener('click', () => {
      S.desenlacePropio = $('#d-propio', c).value.trim(); registrar('Escribió un desenlace propio'); guardar(); aviso('Tu desenlace quedó guardado.');
    });
    $('#d-reconsiderar', c).addEventListener('click', () => {
      if (!confirm('Vas a volver al dilema. Tu decisión anterior queda registrada en la bitácora. ¿Continuar?')) return;
      registrar('Reconsideró su decisión (antes: ' + D.FINALES[dec.opcion].opcion + ')');
      S.decision = null; verFinal = null; guardar(); actualizarBarra('cap5'); VISTAS.cap5(c);
    });
  };

  /* ======================= CIERRE ======================= */
  function evidencias() {
    const cl = Object.keys(S.clasif).filter(k => S.pistas[k]);
    const ok = cl.filter(k => S.clasif[k] === D.PISTAS[k].tipo).length;
    return [
      `Clasificaste ${cl.length} pista${cl.length === 1 ? '' : 's'}; ${ok} coinciden con el archivo.`,
      `Escuchaste ${vocesCompletas().length} de 4 voces completas y guardaste ${S.comparaciones.length} comparación${S.comparaciones.length === 1 ? '' : 'es'}.`,
      S.decision ? `Justificaste tu decisión apoyándote en ${S.decision.pistas.length} pista${S.decision.pistas.length === 1 ? '' : 's'}.` : 'Todavía no tomaste la decisión del Capítulo 5.',
      `Guardaste ${S.vinetas.length} viñeta${S.vinetas.length === 1 ? '' : 's'}${S.desenlacePropio ? ' y escribiste un desenlace propio' : ''}.`,
      `Exploraste ${Object.keys(S.finalesVistos).length} de 3 desenlaces${S.bitacora.some(b => /Reconsider/.test(b.texto)) ? ' y reconsideraste tu decisión' : ''}.`
    ];
  }
  function resumenHTML() {
    const n = (S.autoeval.nombre || '').trim();
    const halladas = pistasHalladas();
    return `<header><p class="kicker">La página que faltaba · Memorias de una historia olvidada</p><h1>Resumen de mi recorrido</h1>
      <p>${n ? 'Estudiante o grupo: <strong>' + esc(n) + '</strong> · ' : ''}Fecha: ${new Date().toLocaleDateString('es-AR')}</p></header>
      <section><h3>Pistas encontradas (${halladas.length} de ${TOTAL_PISTAS})</h3><ul>${halladas.map(p => {
        const cl = S.clasif[p];
        return `<li><strong>${esc(D.PISTAS[p].nombre)}</strong> — ${esc(D.TIPOS[D.PISTAS[p].tipo].nombre)}${cl ? (cl === D.PISTAS[p].tipo ? ' · mi clasificación coincidió' : ' · yo la clasifiqué como «' + esc(D.TIPOS[cl].nombre) + '»') : ' · sin clasificar'}</li>`;
      }).join('') || '<li>Sin pistas todavía.</li>'}</ul></section>
      <section><h3>Voces escuchadas</h3><p>${vocesCompletas().map(v => esc(D.VOCES[v].nombre)).join(', ') || 'Ninguna completa.'}</p></section>
      <section><h3>Comparaciones de testimonios</h3>${S.comparaciones.length ? S.comparaciones.map(k => `<p><strong>${esc(D.VOCES[k.a].nombre)} ↔ ${esc(D.VOCES[k.b].nombre)}:</strong> ${esc(k.texto)}</p>`).join('') : '<p>Sin comparaciones.</p>'}</section>
      <section><h3>Mis viñetas</h3>${S.vinetas.length ? S.vinetas.map(v => `<div style="margin-bottom:1rem"><p><strong>${esc(v.titulo)}</strong></p><div class="mini-vineta vineta-imp">${svgVineta(v, false)}</div>
        <p><em>Pistas:</em> ${v.pistas.map(p => esc(D.PISTAS[p].nombre)).join(' · ')}</p><p><em>Ficción:</em> ${esc(v.ficcion)}</p><p><em>Fuentes:</em> ${esc(v.fuentes)}</p></div>`).join('') : '<p>Sin viñetas guardadas.</p>'}</section>
      <section><h3>Mi decisión</h3>${S.decision ? `<p><strong>${esc(D.FINALES[S.decision.opcion].opcion)}</strong> → desenlace «${esc(D.FINALES[S.decision.opcion].titulo)}».</p><p>${esc(S.decision.justificacion)}</p>` : '<p>Sin decisión todavía.</p>'}
        ${S.desenlacePropio ? `<p><em>Mi desenlace alternativo:</em> ${esc(S.desenlacePropio)}</p>` : ''}</section>
      <section><h3>Autoevaluación</h3><ul>${D.AUTOEVAL.map((t, i) => `<li>${S.autoeval.criterios[i] ? '☑' : '☐'} ${esc(t)}</li>`).join('')}</ul>
        <p><em>Reflexión final:</em> ${esc(S.autoeval.reflexion) || '—'}</p></section>
      <section><h3>Bitácora de acciones</h3><ol class="linea-tiempo">${S.bitacora.slice(-40).map(b => `<li><time>${fecha(b.t)}</time>${esc(b.texto)}</li>`).join('')}</ol></section>
      <p><small>Los personajes, testimonios y documentos de esta historia son ficticios. Los datos marcados como fuente histórica están documentados.</small></p>`;
  }
  VISTAS.cierre = function (c) {
    const ev = evidencias();
    c.innerHTML = `
    <header class="cabecera"><div><p class="kicker">Cierre</p><h1>Autoevaluación y resumen</h1></div></header>
    <p class="bajada">Mirá tu recorrido con ojos de investigador o investigadora. Al lado de cada criterio tenés una evidencia de lo que hiciste: usala para ser honesto/a con vos.</p>
    <form id="form-auto">
      <label class="campo" for="a-nombre">Nombre o grupo <small>(opcional; solo aparece en el resumen impreso y no sale de este dispositivo)</small></label>
      <input type="text" id="a-nombre" maxlength="60" value="${esc(S.autoeval.nombre)}">
      <fieldset style="border:none;padding:0;margin:1rem 0"><legend class="campo">Marcá los criterios que creés haber cumplido</legend>
        <ul class="criterios">${D.AUTOEVAL.map((t, i) => `<li><label><input type="checkbox" data-crit="${i}" ${S.autoeval.criterios[i] ? 'checked' : ''}> <span>${esc(t)}<br><small style="font-family:var(--sans);color:var(--sepia)">Evidencia: ${esc(ev[i])}</small></span></label></li>`).join('')}</ul>
      </fieldset>
      <label class="campo" for="a-reflex">Reflexión final <small>¿Cambió tu forma de pensar sobre quién «escribe» la historia? ¿Qué harías distinto?</small></label>
      <textarea id="a-reflex" maxlength="1500">${esc(S.autoeval.reflexion)}</textarea>
      <div class="contador-car" id="a-cont"></div>
      <div class="acciones"><button class="boton" type="submit">Guardar autoevaluación</button></div>
    </form>
    <section aria-labelledby="t-res">
      <h2 id="t-res">Resumen del recorrido</h2>
      <div class="acciones">
        <button class="boton petroleo" id="r-imprimir">Imprimir / guardar como PDF</button>
        <button class="boton secundario" id="r-html">Descargar resumen (.html)</button>
      </div>
      <div class="resumen" id="resumen">${resumenHTML()}</div>
    </section>
    ${navSiguiente(['cap5', 'Capítulo 5'], ['inicio', 'Volver a la portada'])}`;
    contador($('#a-reflex', c), $('#a-cont', c), 40);
    $('#form-auto', c).addEventListener('submit', e => {
      e.preventDefault();
      S.autoeval.nombre = $('#a-nombre', c).value.trim();
      S.autoeval.criterios = $$('[data-crit]', c).map(x => x.checked);
      const r = $('#a-reflex', c).value.trim();
      if (r.length < 40) { aviso('Escribí una reflexión un poco más desarrollada (mínimo 40 caracteres).'); $('#a-reflex', c).focus(); return; }
      S.autoeval.reflexion = r; registrar('Completó la autoevaluación'); guardar();
      $('#resumen', c).innerHTML = resumenHTML(); actualizarBarra('cierre'); aviso('Autoevaluación guardada. El resumen se actualizó.');
    });
    $('#r-imprimir', c).addEventListener('click', () => imprimir(resumenHTML()));
    $('#r-html', c).addEventListener('click', () => {
      const doc = `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Mi recorrido · La página que faltaba</title>
<style>body{font-family:Georgia,serif;max-width:860px;margin:2rem auto;padding:0 1rem;color:#2a1c12;background:#f7efdc;line-height:1.55}h1{font-size:2rem}h3{border-bottom:1px solid #8a6844;margin-top:1.6rem}.kicker{font-family:Verdana,sans-serif;font-size:.75rem;letter-spacing:.15em;text-transform:uppercase;color:#8f3d27}.mini-vineta{max-width:480px;border:3px solid #2a1c12}.mini-vineta svg{display:block;width:100%;height:auto}.linea-tiempo{font-size:.9rem}time{color:#8a6844;margin-right:.4em;font-family:Verdana,sans-serif;font-size:.8em}</style></head>
<body><svg width="0" height="0" style="position:absolute" aria-hidden="true">${A.defs()}</svg>${resumenHTML()}</body></html>`;
      descargarBlob(new Blob([doc], { type: 'text/html' }), 'mi-recorrido-la-pagina-que-faltaba.html');
      registrar('Descargó el resumen del recorrido'); guardar(); aviso('Resumen descargado.');
    });
  };

  /* ======================= DOCENTES ======================= */
  VISTAS.docente = function (c) {
    c.innerHTML = `
    <header class="cabecera"><div><p class="kicker">Orientación docente</p><h1>Guía para docentes</h1></div></header>
    <p class="bajada">Material educativo transmedia para 2.º año de secundaria (13 a 15 años). Expande el universo de «La revolución huarpe olvidada» y trabaja la memoria histórica, la distinción entre fuente y ficción y la producción narrativa.</p>
    <div class="columnas">
      <section class="caja"><h2>Objetivos</h2><ul>
        <li>Distinguir hechos históricos documentados de elementos ficcionales e interpretaciones.</li>
        <li>Comparar testimonios contradictorios sin reducirlos a «verdadero/falso».</li>
        <li>Argumentar decisiones a partir de pistas y fuentes.</li>
        <li>Producir una escena gráfica que amplíe el relato y explicite su relación con las fuentes.</li>
        <li>Reflexionar sobre qué voces quedan fuera de los registros históricos.</li>
      </ul></section>
      <section class="caja"><h2>Por qué este formato</h2><ul>
        <li><strong>Historieta:</strong> la viñeta obliga a decidir qué se muestra y qué se omite, igual que quien escribe historia.</li>
        <li><strong>Archivo y bitácora:</strong> cada pista conserva su procedencia y su tipo; la clasificación no se puede «forzar», lo que modela el rigor con las fuentes.</li>
        <li><strong>Navegación interactiva:</strong> el orden de consulta de las voces es libre; cada recorrido produce comparaciones distintas.</li>
        <li><strong>Producción:</strong> viñetas y desenlaces exportables que pueden sumarse al universo transmedia del curso.</li>
      </ul></section>
    </div>
    <section class="caja" style="margin-top:1.5rem"><h2>Secuencia sugerida (4 encuentros de 80 minutos)</h2><ol>
      <li><strong>Encuentro 1:</strong> lectura o repaso del cuento original y del videojuego (ver <a href="#universo">Universo transmedia</a>). Capítulo 1 en parejas. Puesta en común: ¿qué sabemos y qué suponemos?</li>
      <li><strong>Encuentro 2:</strong> Capítulo 2. Cada pareja escucha las voces en distinto orden; luego comparan sus tableros de versiones. Capítulo 3: clasificación de pistas.</li>
      <li><strong>Encuentro 3:</strong> Capítulo 4. Producción de viñetas; exportación en PNG o PDF. Galería en el aula o en el pizarrón digital.</li>
      <li><strong>Encuentro 4:</strong> Capítulo 5 y cierre. Debate entre quienes eligieron distintos desenlaces. Autoevaluación y entrega del resumen (PDF o .html).</li>
    </ol>
    <p><strong>Modalidades:</strong> individual, en parejas con un dispositivo o proyectado para todo el curso. Funciona sin conexión una vez abierta (los enlaces al material original sí requieren internet). Para cambiar de equipo, el estudiante puede guardar y cargar su progreso desde <a href="#como">Cómo participar</a>.</p>
    <p><strong>Para probar rápido:</strong> en <a href="#como">Cómo participar</a> está el botón «Cargar recorrido de demostración», que completa un recorrido de ejemplo.</p></section>
    <section style="margin-top:1.5rem"><h2>Criterios de evaluación</h2><div class="tabla-scroll"><table class="rubrica">
      <thead><tr><th>Criterio</th><th>En proceso</th><th>Logrado</th><th>Destacado</th></tr></thead>
      <tbody>
        <tr><th>Distingue historia y ficción</th><td>Confunde testimonios ficticios con fuentes.</td><td>Clasifica correctamente la mayoría de las pistas.</td><td>Explica por qué un dato real dicho por un personaje sigue siendo ficción como testimonio.</td></tr>
        <tr><th>Compara perspectivas</th><td>Resume una sola versión.</td><td>Señala diferencias entre dos testimonios.</td><td>Propone razones para las diferencias (memoria, intereses, silencios).</td></tr>
        <tr><th>Fundamenta con pistas</th><td>Opina sin referencias.</td><td>Cita al menos una pista pertinente.</td><td>Articula varias pistas de distinto tipo y reconoce sus límites.</td></tr>
        <tr><th>Produce una escena</th><td>Viñeta incompleta o sin fundamentación.</td><td>Viñeta coherente con fundamentación básica.</td><td>Escena original que amplía el universo y explicita con precisión qué inventa.</td></tr>
        <tr><th>Revisa su interpretación</th><td>No reconsidera su postura.</td><td>Reconoce otras lecturas posibles.</td><td>Explora otros desenlaces y explica qué cambiaría en su decisión.</td></tr>
      </tbody></table></div>
    <p>El resumen descargable del Cierre reúne pistas, clasificaciones, comparaciones, viñetas, decisión, autoevaluación y bitácora: sirve como portafolio de evidencias.</p></section>
    <section class="caja" style="margin-top:1.5rem"><h2>Cuidados</h2><ul>
      <li>Todos los personajes y testimonios son ficticios y están marcados como tales. Conviene reforzar que la «revolución huarpe» del cuento original también es ficción.</li>
      <li>La aplicación evita atribuir vestimentas, símbolos o prácticas a los pueblos huarpes. Si el curso quiere profundizar, se recomienda trabajar con materiales producidos por comunidades huarpes actuales.</li>
      <li>No se recopilan datos personales ni se usan servicios externos. El progreso queda en el navegador del dispositivo.</li>
    </ul></section>
    ${navSiguiente(['inicio', 'Portada'], ['cap1', 'Recorrer la experiencia'])}`;
  };

  /* ======================= DEMOSTRACIÓN ======================= */
  function cargarDemo() {
    S = BASE();
    const t0 = Date.now() - 3600 * 1000;
    D.OBJETOS.forEach((o, i) => { S.objetosVistos[o.id] = t0 + i * 1000; S.bitacora.push({ t: t0 + i * 1000, texto: 'Exploró el objeto: ' + o.etiqueta }); });
    ORDEN_VOCES.forEach(v => { S.preguntas[v] = D.PREGUNTAS.map(q => q.id); S.bitacora.push({ t: t0 + 60000, texto: 'Escuchó completo el testimonio de ' + D.VOCES[v].nombre }); });
    Object.keys(D.PISTAS).forEach((p, i) => { S.pistas[p] = t0 + i * 2000; });
    S.clasif = { hoja: 'ficcion', fundacion: 'historica', terremoto: 'historica', 'test-rosario': 'historica', 'i-firma': 'interpretacion', lenguas: 'historica' };
    S.comparaciones = [{ a: 'rosario', b: 'aurelio', t: t0 + 900000, texto: 'Rosario dice que la búsqueda fue la misma noche y Aurelio dice que nadie buscó nada, aunque admite que el cajón apareció abierto. Quizás Aurelio no quiere aceptar algo que no está en los registros, y Rosario mezcla lo que vio con lo que le contaron después.' }];
    S.vinetas = [{ id: 'demo1', t: t0 + 1200000, titulo: 'La noche del farol', fondo: 'noche', pistas: ['terremoto', 'test-rosario', 'i-dos-noches'],
      items: [
        { id: 'd1', k: 'p', ref: 'buscadores', x: 330, y: 585, s: 1, espejo: false },
        { id: 'd2', k: 'p', ref: 'rosario', x: 650, y: 590, s: .85, espejo: true },
        { id: 'd3', k: 'g', tipo: 'cartela', texto: 'Mendoza, 20 de marzo de 1861. Minutos después del primer sacudón.', x: 14, y: 14, cola: 'ninguna' },
        { id: 'd4', k: 'g', tipo: 'grito', texto: '¡El papel viejo, que no se pierda!', x: 120, y: 150, cola: 'ninguna' },
        { id: 'd5', k: 'g', tipo: 'pensamiento', texto: '¿Quiénes son esos muchachos?', x: 470, y: 110, cola: 'abajo-der' }
      ],
      ficcion: 'Los jóvenes del farol, Rosario y lo que dicen son inventados. La búsqueda del papel es un recuerdo de Rosario que nadie más confirma.',
      fuentes: 'La fecha del terremoto (20 de marzo de 1861, de noche) y la destrucción de la ciudad están documentadas.' }];
    S.editor = JSON.parse(JSON.stringify(S.vinetas[0])); S.editor.sel = null;
    S.decision = { opcion: 'reconstruir', t: t0 + 1800000, pistas: ['test-tomas', 'i-silencio', 'lenguas'], justificacion: 'Elijo reconstruir la historia con otras personas porque Tomás y Elvira muestran que muchas voces nunca se escribieron. Si Elena la publica sola, la hoja podría tomarse como prueba aunque no sabemos quién la escribió.' };
    S.finalesVistos = { reconstruir: true, compartir: true };
    S.desenlacePropio = 'Años después, una alumna encuentra el cuaderno de las voces en la biblioteca de la escuela y agrega la versión de su propia familia, marcando con otro color lo que no pudo comprobar.';
    S.autoeval = { nombre: 'Ejemplo de demostración', criterios: [true, true, true, true, false], reflexion: 'Me di cuenta de que un dato puede ser real aunque lo diga un personaje inventado, pero eso no hace verdadero su testimonio. Me costó no elegir quién tenía razón.' };
    S.bitacora.push({ t: t0 + 1900000, texto: 'Recorrido de demostración cargado' });
    guardar();
  }

  /* ======================= INICIO ======================= */
  $('#defs-globales').innerHTML = A.defs();
  navegar();
})();
