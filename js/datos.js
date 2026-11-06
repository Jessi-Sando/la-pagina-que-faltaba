/* =========================================================
   LA PÁGINA QUE FALTABA — Datos narrativos y pedagógicos
   Todo lo marcado como "ficcion" o "interpretacion" es
   invención narrativa de esta expansión.
   ========================================================= */
window.DATOS = (function () {

  /* Tipos de pista. La clasificación oficial es fija:
     el estudiante puede proponer otra, pero no cambiarla. */
  const TIPOS = {
    historica: { nombre: 'Fuente histórica', corto: 'Histórica', explicacion: 'Hecho documentado que se puede verificar en fuentes externas a esta historia (archivos, museos, investigaciones).' },
    ficcion: { nombre: 'Elemento ficcional', corto: 'Ficción', explicacion: 'Personaje, objeto, diálogo o suceso inventado para esta historia. Puede ser verosímil, pero no es un documento real.' },
    interpretacion: { nombre: 'Interpretación', corto: 'Interpretación', explicacion: 'Hipótesis que surge de relacionar pistas. No es un hecho: es una lectura posible que puede discutirse.' }
  };

  const PISTAS = {
    /* --- Capítulo 1 --- */
    hoja: {
      nombre: 'La hoja rota', tipo: 'ficcion', capitulo: 1,
      desc: 'Hoja de papel grueso, quemada en un borde. Se leen frases sueltas: «…en el acta de fundación de la ciudad…», «…aquella noche de marzo…», «…los que buscaban no eran ladrones…», «…sus nombres no figuran en ningún…». Está firmada con una sola letra: «T.».',
      procedencia: 'Capítulo 1 · Baúl de la abuela Teodora',
      explicacion: 'La hoja es un objeto inventado para esta historia. Abre preguntas, pero no es un documento histórico: no existe en ningún archivo. Aunque mencione el acta de fundación (que sí existió), eso no la convierte en fuente.',
      rel: ['carta', 'fundacion', 'i-firma']
    },
    fundacion: {
      nombre: 'La fundación de Mendoza (1561)', tipo: 'historica', capitulo: 1,
      desc: 'La ciudad de Mendoza fue fundada el 2 de marzo de 1561 por Pedro del Castillo, al frente de una expedición enviada desde Chile. El acto quedó registrado en un acta de fundación.',
      procedencia: 'Capítulo 1 · Nota de contexto al leer la hoja',
      explicacion: 'Es un dato documentado. Podés ampliarlo en manuales de historia de Mendoza y en el Museo del Área Fundacional de la ciudad.',
      rel: ['hoja', 'test-elvira']
    },
    carta: {
      nombre: 'La carta de la abuela Teodora', tipo: 'ficcion', capitulo: 1,
      desc: 'Una carta breve guardada en una cajita: «Elena: lo que no está en los papeles, está en la gente. Si alguna vez encontrás la hoja, preguntale a Rosario, la de la acequia. Y no le creas todo a nadie… ni a mí».',
      procedencia: 'Capítulo 1 · Cajita de recuerdos familiares',
      explicacion: 'Teodora y su carta son personajes y objetos ficticios. La carta funciona como una invitación a escuchar distintas voces, no como prueba de nada.',
      rel: ['hoja', 'test-rosario', 'i-firma']
    },
    terremoto: {
      nombre: 'El terremoto del 20 de marzo de 1861', tipo: 'historica', capitulo: 1,
      desc: 'La noche del 20 de marzo de 1861 un terremoto destruyó la ciudad de Mendoza. Murieron varios miles de personas; las cifras exactas varían según las fuentes consultadas.',
      procedencia: 'Capítulo 1 · El almanaque junto a la grieta',
      explicacion: 'La fecha y la destrucción de la ciudad están documentadas. Lo que cada personaje dice recordar de esa noche, en cambio, es ficción.',
      rel: ['ciudadnueva', 'test-rosario', 'test-aurelio', 'i-dos-noches']
    },
    ciudadnueva: {
      nombre: 'La ciudad que cambió de lugar', tipo: 'historica', capitulo: 1,
      desc: 'Después del terremoto, Mendoza se reconstruyó en una nueva traza, al suroeste del antiguo centro. Restos de la ciudad colonial, como las Ruinas de San Francisco, se conservan hoy en el Área Fundacional.',
      procedencia: 'Capítulo 1 · La ventana hacia las ruinas',
      explicacion: 'La reconstrucción en otro sitio y la conservación de las ruinas están documentadas. Podés visitarlas o investigarlas en el Museo del Área Fundacional.',
      rel: ['terremoto', 'test-aurelio']
    },

    /* --- Capítulo 2: testimonios (todos ficticios) --- */
    'test-rosario': {
      nombre: 'Testimonio de Rosario', tipo: 'ficcion', capitulo: 2,
      desc: 'Rosario asegura que, esa misma noche, vio a un grupo de jóvenes con un farol buscando «un papel viejo» entre los escombros del cabildo.',
      procedencia: 'Capítulo 2 · Conversación con Rosario Funes',
      explicacion: 'Rosario es un personaje inventado. Su testimonio es un recurso narrativo: muestra cómo alguien puede recordar con mucha seguridad algo que nadie más confirma.',
      rel: ['carta', 'test-aurelio', 'i-dos-noches']
    },
    'test-aurelio': {
      nombre: 'Testimonio de Aurelio', tipo: 'ficcion', capitulo: 2,
      desc: 'Aurelio afirma que nadie buscó nada esa noche. Reconoce que el cajón de documentos apareció abierto una semana después y que faltaban papeles, pero lo atribuye al derrumbe.',
      procedencia: 'Capítulo 2 · Conversación con Aurelio Ponce',
      explicacion: 'Aurelio es un personaje inventado. Representa a quien solo confía en lo escrito, aunque su propio relato tenga huecos.',
      rel: ['test-rosario', 'ciudadnueva', 'i-dos-noches']
    },
    'test-tomas': {
      nombre: 'Testimonio de Tomás', tipo: 'ficcion', capitulo: 2,
      desc: 'Tomás vio, días después del terremoto, a alguien llevarse una caja por el camino del norte, pero no quiere decir nombres. Cuenta que su madre, que venía de las Lagunas de Guanacache, nunca fue escuchada.',
      procedencia: 'Capítulo 2 · Conversación con Tomás Videla',
      explicacion: 'Tomás y su madre son personajes inventados. Su silencio es parte del relato: no todo lo que se sabe se cuenta.',
      rel: ['guanacache', 'test-aurelio', 'i-silencio', 'i-firma']
    },
    'test-elvira': {
      nombre: 'Testimonio de Elvira', tipo: 'ficcion', capitulo: 2,
      desc: 'Elvira cree que la búsqueda es una leyenda que creció con los años. Señala que los libros registran fechas y fundadores, pero casi nunca las voces de quienes vivían aquí antes.',
      procedencia: 'Capítulo 2 · Conversación con la maestra Elvira Sosa',
      explicacion: 'Elvira es un personaje inventado. Que mencione datos reales no convierte su testimonio en fuente histórica.',
      rel: ['fundacion', 'lenguas', 'i-silencio']
    },
    lenguas: {
      nombre: 'Allentiac y millcayac', tipo: 'historica', capitulo: 2,
      desc: 'El sacerdote jesuita Luis de Valdivia publicó en 1607 obras sobre dos lenguas huarpes: el allentiac y el millcayac. Son de los pocos registros escritos de esas lenguas, y fueron hechos por alguien ajeno a esos pueblos.',
      procedencia: 'Capítulo 2 · Lo menciona la maestra Elvira (dato contrastado)',
      explicacion: 'Que Elvira lo diga es ficción; el dato en sí está documentado. Una fuente histórica se reconoce por su respaldo verificable, no por quién la menciona dentro del relato.',
      rel: ['test-elvira', 'guanacache']
    },
    guanacache: {
      nombre: 'Las Lagunas de Guanacache', tipo: 'historica', capitulo: 2,
      desc: 'Las Lagunas de Guanacache, en el límite entre Mendoza, San Juan y San Luis, fueron territorio de pueblos huarpes. Hoy existen comunidades huarpes que sostienen y reivindican esa identidad.',
      procedencia: 'Capítulo 2 · Lo menciona Tomás (dato contrastado)',
      explicacion: 'La madre de Tomás es ficticia; la relación histórica de los huarpes con las Lagunas de Guanacache y la existencia de comunidades actuales están documentadas.',
      rel: ['test-tomas', 'lenguas']
    },

    /* --- Interpretaciones (se desbloquean al comparar) --- */
    'i-dos-noches': {
      nombre: 'Dos tiempos para una misma búsqueda', tipo: 'interpretacion', capitulo: 2,
      desc: 'Rosario ubica la búsqueda la misma noche del terremoto; Aurelio dice que el cajón apareció abierto una semana después. ¿Hablan de hechos distintos, o la memoria los acomodó de otra manera?',
      procedencia: 'Surge al escuchar a Rosario y a Aurelio',
      explicacion: 'Es una hipótesis de Elena (y tuya). No resuelve la contradicción: la deja planteada para investigar.',
      rel: ['test-rosario', 'test-aurelio', 'terremoto']
    },
    'i-silencio': {
      nombre: 'Las voces que no se escribieron', tipo: 'interpretacion', capitulo: 2,
      desc: 'Tomás y Elvira, desde lugares muy distintos, coinciden en algo: hubo personas cuya versión nunca quedó registrada.',
      procedencia: 'Surge al escuchar a Tomás y a Elvira',
      explicacion: 'Es una lectura que relaciona dos testimonios ficticios con un problema real de la historia: quién queda fuera de los registros.',
      rel: ['test-tomas', 'test-elvira', 'lenguas']
    },
    'i-firma': {
      nombre: '¿Quién es «T.»?', tipo: 'interpretacion', capitulo: 2,
      desc: 'La firma de la hoja podría ser de la abuela Teodora… o de Tomás. Ningún testimonio lo confirma. También podría ser de otra persona.',
      procedencia: 'Surge al escuchar las cuatro voces',
      explicacion: 'Es una hipótesis abierta. Tomarla como un hecho sería confundir una sospecha con una prueba.',
      rel: ['hoja', 'carta', 'test-tomas']
    }
  };

  /* Objetos explorables del Capítulo 1 (posición en % de la escena 800x600) */
  const OBJETOS = [
    {
      id: 'hoja', etiqueta: 'La hoja deteriorada', x: 46, y: 64, pistas: ['hoja', 'fundacion'], visual: 'hoja',
      texto: 'Entre telas y cartas atadas con hilo, Elena encuentra una hoja quemada en un borde. Algunas palabras se leen bien; otras se perdieron.',
      contexto: 'Nota de contexto (dato histórico): Mendoza fue fundada el 2 de marzo de 1561 por Pedro del Castillo, y ese acto quedó registrado en un acta de fundación. La hoja que encontró Elena, en cambio, es ficticia.'
    },
    {
      id: 'cajita', etiqueta: 'La cajita de recuerdos', x: 15.5, y: 30, pistas: ['carta'], visual: 'carta',
      texto: 'En el estante hay una cajita pintada de rojo. Adentro, un botón de nácar, una cinta y una carta doblada en cuatro con la letra de la abuela Teodora.',
      contexto: 'Teodora y su carta son ficticias: representan la memoria familiar, que muchas veces guarda lo que no quedó en los archivos.'
    },
    {
      id: 'almanaque', etiqueta: 'El almanaque y la grieta', x: 72.5, y: 37, pistas: ['terremoto'], visual: 'almanaque',
      texto: 'Una grieta cruza la pared de arriba abajo. Al lado, alguien dejó clavado un almanaque viejo, abierto en marzo de 1861, con un día marcado.',
      contexto: 'Dato histórico: el 20 de marzo de 1861, por la noche, un terremoto destruyó la ciudad de Mendoza. El almanaque es un objeto de la historia, pero la fecha es real.'
    },
    {
      id: 'ventana', etiqueta: 'La ventana hacia las ruinas', x: 87, y: 24, pistas: ['ciudadnueva'], visual: 'ventana',
      texto: 'Desde la ventana se ven arcos rotos de la ciudad vieja. Los vecinos dicen que la nueva ciudad se levantó lejos de allí, como si quisiera empezar de cero.',
      contexto: 'Dato histórico: tras el terremoto, la ciudad se reconstruyó en una nueva traza, al suroeste del antiguo centro. Las Ruinas de San Francisco se conservan hoy en el Área Fundacional.'
    }
  ];

  /* Personajes del Capítulo 2 */
  const PREGUNTAS = [
    { id: 'noche', texto: '¿Qué recuerda de la noche del terremoto?', tema: 'La noche del terremoto' },
    { id: 'papel', texto: '¿Sabe algo de un papel o del acta de fundación?', tema: 'El papel / el acta' },
    { id: 'quienes', texto: '¿Quiénes buscaban? ¿Por qué nadie habla de ellos?', tema: 'Quiénes buscaban' }
  ];

  const VOCES = {
    rosario: {
      nombre: 'Rosario Funes', rol: 'Lavandera. Vivía junto a la acequia de la ciudad vieja.',
      perspectiva: 'Recuerda una búsqueda', fondo: 'plaza', saludo: 'Así que sos la nieta de Teodora… Sentate, m’hija. Preguntá nomás.',
      respuestas: {
        noche: 'Estaba lavando en la acequia cuando la tierra rugió. Ya era de noche. Después del primer sacudón todo fue polvo y gritos. Yo me abracé a un álamo y no me solté.',
        papel: 'Vi un farol que iba y venía entre los escombros del cabildo. Unos muchachos buscaban algo. Uno gritaba: «¡El papel viejo, que no se pierda!». Esa misma noche, te lo juro.',
        quienes: 'Eran jóvenes. No los conocía bien, pero eran valientes. Después nadie los nombró. A la gente como nosotros no nos vienen a preguntar, m’hija.'
      },
      tablero: {
        noche: 'De noche, en la acequia. Polvo y gritos.',
        papel: 'Unos jóvenes buscaban «un papel viejo» esa misma noche.',
        quienes: 'Jóvenes valientes que nadie nombró.'
      },
      pensar: '¿Coincide el momento en que Rosario ubica la búsqueda con lo que cuentan otras personas? ¿Por qué alguien recordaría algo con tanta seguridad?',
      pistas: ['test-rosario']
    },
    aurelio: {
      nombre: 'Aurelio Ponce', rol: 'Antiguo escribiente. Confía solo en lo que está escrito.',
      perspectiva: 'Habla de documentos perdidos', fondo: 'ruinas', saludo: 'Señorita, tengo poco tiempo. Si viene por las habladurías del barrio, le aviso que no creo en cuentos.',
      respuestas: {
        noche: 'Yo trabajaba de escribiente. Esa noche estaba en mi casa, gracias a Dios. Al día siguiente fui a ver el cabildo: no quedaba nada en pie.',
        papel: 'Los documentos se guardaban en un cajón de madera. Una semana después lo encontramos abierto entre los escombros. Faltaban papeles, sí. Pero se perdieron por el derrumbe, no por ladrones.',
        quienes: '¿Buscadores? Nadie buscó nada esa noche. Eso son cuentos de gente asustada. Lo que no está escrito en los registros, no pasó.'
      },
      tablero: {
        noche: 'En su casa. Al día siguiente vio el cabildo destruido.',
        papel: 'El cajón apareció abierto una semana después; faltaban papeles.',
        quienes: 'Niega que haya existido una búsqueda.'
      },
      pensar: 'Aurelio dice que «lo que no está escrito, no pasó», pero admite que faltaban papeles. ¿Qué problema tiene confiar solo en lo escrito?',
      pistas: ['test-aurelio']
    },
    tomas: {
      nombre: 'Tomás Videla', rol: 'Arriero. Conoce los caminos que salen de la ciudad.',
      perspectiva: 'Prefiere el silencio', fondo: 'camino', saludo: 'Hay cosas que se cuentan solo a quien sabe escuchar. Vamos a ver si vos sabés.',
      respuestas: {
        noche: 'Venía con las mulas por el camino del norte. Vi la ciudad hundirse en una nube de polvo. Hay cosas que no se olvidan, pero tampoco se cuentan a cualquiera.',
        papel: 'Unos días después vi a alguien caminar hacia el norte con una caja apretada contra el pecho. No te voy a decir quién. Hay nombres que se cuidan callando.',
        quienes: 'Mi madre venía de las Lagunas de Guanacache. Sabía muchas historias, y nadie se las preguntó nunca para ponerlas en un papel. Por eso desconfío de los papeles.'
      },
      tablero: {
        noche: 'Desde el camino del norte vio la nube de polvo.',
        papel: 'Días después, alguien se llevó una caja hacia el norte.',
        quienes: 'Calla los nombres. Su madre nunca fue escuchada.'
      },
      pensar: 'Tomás sabe algo, pero decide no decirlo. ¿Callar puede ser una forma de cuidar la memoria? ¿Qué se pierde cuando alguien calla?',
      pistas: ['test-tomas', 'guanacache']
    },
    elvira: {
      nombre: 'Elvira Sosa', rol: 'Maestra de la escuela de la Ciudad Nueva.',
      perspectiva: 'Confía en la historia escrita, pero ve sus vacíos', fondo: 'archivo', saludo: 'Me alegra que una alumna haga preguntas. Pero acordate: preguntar también es dudar de las respuestas.',
      respuestas: {
        noche: 'Yo era una niña. Recuerdo más lo que me contaron después que lo que vi. Por eso hay que tener cuidado: la memoria mezcla lo vivido con lo escuchado.',
        papel: 'El acta de fundación de 1561 existió, eso está documentado. Pero la historia de los jóvenes que la buscaron esa noche… la escuché tantas veces y de tantas formas que me parece una leyenda.',
        quienes: 'Los libros dicen quién fundó la ciudad, pero casi nada de quienes vivían aquí antes. De las lenguas huarpes quedan pocos registros, como los que publicó el padre Valdivia en 1607. Esos silencios también son historia.'
      },
      tablero: {
        noche: 'Era niña; recuerda más lo que le contaron.',
        papel: 'El acta existió; la búsqueda le parece una leyenda.',
        quienes: 'Señala los silencios de los libros sobre los huarpes.'
      },
      pensar: 'Elvira distingue entre lo documentado y lo que «se cuenta». ¿Eso significa que la versión de Rosario es falsa? ¿O que no se puede comprobar?',
      pistas: ['test-elvira', 'lenguas']
    }
  };

  /* Interpretaciones que se desbloquean al completar voces */
  const DESBLOQUEOS = [
    { pista: 'i-dos-noches', requiere: ['rosario', 'aurelio'] },
    { pista: 'i-silencio', requiere: ['tomas', 'elvira'] },
    { pista: 'i-firma', requiere: ['rosario', 'aurelio', 'tomas', 'elvira'] }
  ];

  /* Capítulo 1: viñetas narrativas */
  const TIRA_HALLAZGO = [
    { fondo: 'camino', figuras: [{ f: 'elena', x: 470, y: 560, s: .9 }, { f: 'teodora', x: 300, y: 565, s: .85, espejo: false }], cartela: 'Mendoza, 1874. Trece años después del terremoto, Elena y su familia se mudan a la Ciudad Nueva.', alt: 'Elena y su abuela en un camino, con la cordillera de fondo.' },
    { fondo: 'cuarto', figuras: [{ f: 'elena', x: 210, y: 575, s: .95 }], cartela: 'La abuela Teodora ya no está. Su baúl llega último, lleno de polvo.', globos: [{ tipo: 'pensamiento', texto: '¿Qué guardabas acá, abuela?', x: 40, y: 40, cola: 'abajo-der' }], alt: 'Elena frente al baúl de su abuela, en una habitación con una grieta en la pared.' },
    { fondo: 'hojagrande', figuras: [], cartela: 'Entre cartas y telas, algo cruje. Una hoja rota que nadie debía encontrar…', alt: 'Primer plano de una hoja rota y quemada en un borde.' }
  ];

  /* Capítulo 5: desenlaces */
  const FINALES = {
    compartir: {
      opcion: 'Compartirla públicamente', resumen: 'Leer la hoja en la plaza para que toda la ciudad la conozca.',
      titulo: 'La página en la plaza',
      escenas: [
        { fondo: 'plaza', figuras: [{ f: 'elena', x: 400, y: 570, s: .95 }, { f: 'rosario', x: 160, y: 575, s: .85 }, { f: 'aurelio', x: 650, y: 575, s: .9, espejo: true }], globos: [{ tipo: 'dialogo', texto: '«…los que buscaban no eran ladrones…»', x: 250, y: 40, cola: 'abajo-der' }], cartela: 'Elena lee la hoja en voz alta en la plaza. En pocos días, toda la Ciudad Nueva habla de «la página que faltaba».', alt: 'Elena lee la hoja en la plaza; Rosario y Aurelio escuchan.' },
        { fondo: 'plaza', figuras: [{ f: 'rosario', x: 230, y: 575, s: .95 }, { f: 'aurelio', x: 590, y: 575, s: .95, espejo: true }], globos: [{ tipo: 'grito', texto: '¡Yo los vi! ¡Por fin me creen!', x: 40, y: 50, cola: 'ninguna' }, { tipo: 'dialogo', texto: 'Una hoja sin sello no prueba nada.', x: 470, y: 60, cola: 'abajo-der' }], cartela: 'Algunas personas se animan a contar lo que vivieron. Otras acusan a Elena de inventar.', alt: 'Rosario y Aurelio discuten en la plaza.' },
        { fondo: 'cuarto', figuras: [{ f: 'elena', x: 400, y: 575, s: 1 }], globos: [{ tipo: 'pensamiento', texto: 'Ya cuentan cosas que la hoja ni siquiera dice…', x: 70, y: 40, cola: 'abajo-der' }], cartela: 'Pronto circulan versiones nuevas. La historia se difunde rápido… y cambia en cada boca.', alt: 'Elena sola en su cuarto, pensativa.' }
      ],
      consecuencias: ['Más voces se animan a hablar en público.', 'La hoja empieza a tratarse como «prueba», aunque nadie sabe quién la escribió.', 'Aparecen versiones nuevas que nadie puede verificar.'],
      pregunta: '¿Cómo se puede compartir una historia sin que se confunda con un hecho comprobado?'
    },
    investigar: {
      opcion: 'Seguir investigando antes de divulgarla', resumen: 'Comparar la hoja con otros documentos antes de mostrarla.',
      titulo: 'El archivo y la espera',
      escenas: [
        { fondo: 'archivo', figuras: [{ f: 'elena', x: 280, y: 575, s: .95 }, { f: 'elvira', x: 540, y: 575, s: .95, espejo: true }], globos: [{ tipo: 'dialogo', texto: 'Comparemos la letra con estas cartas viejas.', x: 420, y: 40, cola: 'abajo-der' }], cartela: 'Elena decide no mostrar la hoja todavía. Con la maestra Elvira revisa cartas y registros.', alt: 'Elena y Elvira revisan papeles en un archivo.' },
        { fondo: 'archivo', figuras: [{ f: 'elena', x: 250, y: 575, s: .95 }, { f: 'aurelio', x: 560, y: 575, s: .95, espejo: true }], globos: [{ tipo: 'dialogo', texto: 'Esta letra no es de ningún escribiente del cabildo.', x: 400, y: 40, cola: 'abajo-der' }], cartela: 'Hasta Aurelio colabora. Conclusión: la hoja no salió de un archivo oficial. Alguien la escribió por su cuenta.', alt: 'Aurelio examina la hoja junto a Elena.' },
        { fondo: 'camino', figuras: [{ f: 'elena', x: 330, y: 575, s: .95 }], globos: [{ tipo: 'pensamiento', texto: 'Llegué tarde. Tomás ya se fue al norte.', x: 420, y: 60, cola: 'abajo-izq' }], cartela: 'Pero investigar lleva tiempo. Cuando Elena vuelve a buscar a Tomás, ya partió con sus mulas. Su testimonio queda incompleto.', alt: 'Elena mira un camino vacío hacia la cordillera.' }
      ],
      consecuencias: ['La hoja se analiza con más cuidado.', 'Se descarta que sea un documento oficial.', 'Algunas voces se pierden mientras se espera.'],
      pregunta: '¿Cuánto tiempo se puede esperar antes de que una memoria se pierda?'
    },
    reconstruir: {
      opcion: 'Conservarla y reconstruir su historia con otras personas', resumen: 'Reunir a quienes recuerdan y escribir juntos.',
      titulo: 'El cuaderno de las voces',
      escenas: [
        { fondo: 'archivo', figuras: [{ f: 'rosario', x: 150, y: 575, s: .85 }, { f: 'elena', x: 330, y: 575, s: .9 }, { f: 'tomas', x: 500, y: 575, s: .9, espejo: true }, { f: 'elvira', x: 670, y: 575, s: .9, espejo: true }], cartela: 'Elena reúne en la escuela a quienes recuerdan. Pone la hoja en el centro de la mesa.', alt: 'Elena, Rosario, Tomás y Elvira reunidos.' },
        { fondo: 'archivo', figuras: [{ f: 'tomas', x: 260, y: 575, s: .95 }, { f: 'rosario', x: 560, y: 575, s: .9, espejo: true }], globos: [{ tipo: 'dialogo', texto: 'Mi madre lo contaba de otra manera…', x: 60, y: 40, cola: 'abajo-der' }, { tipo: 'dialogo', texto: 'Anotalo igual. Las dos versiones.', x: 450, y: 70, cola: 'abajo-izq' }], cartela: 'Cada persona dicta su versión en un cuaderno compartido. Las diferencias no se borran: se anotan.', alt: 'Tomás y Rosario conversan mientras se escribe un cuaderno.' },
        { fondo: 'plaza', figuras: [{ f: 'aurelio', x: 560, y: 575, s: .95, espejo: true }, { f: 'elena', x: 260, y: 575, s: .9 }], globos: [{ tipo: 'dialogo', texto: 'Yo no firmo eso. No es historia oficial.', x: 430, y: 50, cola: 'abajo-der' }], cartela: 'Aurelio no quiere participar. Pero el cuaderno queda en la escuela, abierto para quien quiera sumar su página.', alt: 'Aurelio se niega a firmar el cuaderno.' }
      ],
      consecuencias: ['Las versiones distintas conviven, marcadas como recuerdos.', 'Se distingue lo que se recuerda de lo que está documentado.', 'El proceso es lento y no todas las personas participan.'],
      pregunta: '¿Quién decide qué memorias entran en la historia de una comunidad?'
    }
  };

  const AUTOEVAL = [
    'Diferencié los hechos históricos de los elementos ficcionales.',
    'Comparé diferentes perspectivas.',
    'Fundamenté mis decisiones con pistas o fuentes.',
    'Participé en la creación de una nueva escena.',
    'Revisé críticamente mi propia interpretación.'
  ];

  /* Universo transmedia: solo enlaces verificados */
  const UNIVERSO = {
    nodos: [
      { id: 'proyecto', tipo: 'original', titulo: 'Proyecto transmedia en educ.ar', x: 50, y: 12,
        texto: 'Proyecto «La revolución huarpe olvidada», realizado por estudiantes de 2.º año de la Escuela «General Gregorio Las Heras» (General Las Heras, Mendoza) junto al Centro ConectarLab Mendoza, durante el ciclo lectivo 2022. Publicado en educ.ar con licencia Creative Commons BY-NC-SA.',
        enlace: 'https://www.educ.ar/recursos/159024/proyecto-transmedia-la-revolucion-huarpe-olvidada', textoEnlace: 'Ver el proyecto en educ.ar' },
      { id: 'cuento', tipo: 'original', titulo: 'El cuento de ficción', x: 15, y: 38,
        texto: 'Historia fundacional del universo. Según la presentación del proyecto, el cuento refiere una revolución huarpe —ficticia— interrumpida por el terremoto de 1861 y ocultada, en la que un grupo de huarpes busca el acta fundacional de la ciudad.',
        enlace: 'https://www.educ.ar/file/%247cdac129274493bb903dec38627e956335932f97a27fa952d383269fe57b1e93', textoEnlace: 'Abrir el cuento (educ.ar)' },
      { id: 'juego', tipo: 'original', titulo: 'Videojuego «La venganza huarpe»', x: 50, y: 38,
        texto: 'Videojuego creado con Scratch (gráficos hechos con Piskel) como expansión del cuento. Se juega con las flechas del teclado.',
        enlace: 'https://scratch.mit.edu/projects/905823491', textoEnlace: 'Jugar en Scratch' },
      { id: 'revista', tipo: 'original', titulo: '«Noticias del día» – Revista histórica', x: 85, y: 38,
        texto: 'Revista histórica producida por el curso en formato impreso y digital (la versión impresa remitía a la digital mediante códigos QR).',
        enlace: 'https://www.educ.ar/file/%24619dc46f6a438ee793dbe18e7fb0e15d6fb563f52125214e56715cdc26008f3c', textoEnlace: 'Abrir la revista (educ.ar)' },
      { id: 'expansion', tipo: 'nueva', titulo: 'La página que faltaba', x: 50, y: 63,
        texto: 'Esta expansión. Transcurre en 1874, años después del terremoto, y no repite los hechos del cuento: pregunta quiénes conservan la memoria de lo sucedido y qué voces quedan fuera. Retoma la idea de contar el pasado a través de documentos, testimonios y viñetas.',
        interno: '#inicio', textoEnlace: 'Ir a la portada' },
      { id: 'f-audio', tipo: 'futura', titulo: 'Archivo sonoro de testimonios', x: 15, y: 87,
        texto: 'Propuesta de futura expansión: el curso graba (con permiso) relatos de familias y vecinos sobre la memoria del barrio, distinguiendo recuerdo y dato.' },
      { id: 'f-mapa', tipo: 'futura', titulo: 'Mapa de memorias del Área Fundacional', x: 50, y: 87,
        texto: 'Propuesta de futura expansión: un mapa colaborativo que ubique lugares reales de la ciudad vieja y las ficciones que el curso imagina en ellos, con cada capa identificada.' },
      { id: 'f-galeria', tipo: 'futura', titulo: 'Galería de viñetas del curso', x: 85, y: 87,
        texto: 'Propuesta de futura expansión: reunir las viñetas exportadas en el Capítulo 4 en una historieta colectiva impresa o digital.' }
    ],
    enlaces: [
      ['proyecto', 'cuento'], ['proyecto', 'juego'], ['proyecto', 'revista'],
      ['cuento', 'juego'], ['cuento', 'expansion'], ['revista', 'expansion'], ['juego', 'expansion'],
      ['expansion', 'f-audio'], ['expansion', 'f-mapa'], ['expansion', 'f-galeria']
    ]
  };

  return { TIPOS, PISTAS, OBJETOS, PREGUNTAS, VOCES, DESBLOQUEOS, TIRA_HALLAZGO, FINALES, AUTOEVAL, UNIVERSO };
})();
