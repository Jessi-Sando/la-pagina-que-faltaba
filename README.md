# La página que faltaba · Memorias de una historia olvidada

Historieta digital interactiva y material educativo transmedia para 2.º año de secundaria (13–15 años).
Expansión no oficial del proyecto **«La revolución huarpe olvidada»** (Escuela «General Gregorio Las Heras», Mendoza, con ConectarLab; CC BY-NC-SA):

- Proyecto en educ.ar: https://www.educ.ar/recursos/159024/proyecto-transmedia-la-revolucion-huarpe-olvidada
- Videojuego «La venganza huarpe» (Scratch): https://scratch.mit.edu/projects/905823491

Mendoza, 1874: trece años después del terremoto, Elena encuentra una hoja rota que menciona el acta de fundación. Quien participa explora objetos, escucha testimonios que no coinciden, clasifica pistas, crea la viñeta que falta y decide qué hacer con la página.

---

## 1. Cómo ejecutarla

**Opción A, sin instalar nada:** abrir `index.html` con doble clic (Chrome, Edge o Firefox). Funciona sin conexión; solo los enlaces al material original necesitan internet.

**Opción B, con servidor local** (recomendada para probar exportaciones):

```bash
python -m http.server 5180 --directory la-pagina-que-faltaba
```

y abrir `http://localhost:5180`.

## 2. Cómo publicarla

Es un sitio estático: no hay que compilar nada ni configurar un servidor.

- **GitHub Pages:** subir el contenido de esta carpeta a un repositorio y activar *Settings → Pages* sobre la rama correspondiente.
- **Netlify / Vercel:** arrastrar la carpeta al panel de *deploy* manual.
- **Aula sin conexión:** copiar la carpeta en un pendrive o en las computadoras del aula y abrir `index.html`.

## 3. Estructura

```
la-pagina-que-faltaba/
├── index.html        Estructura base: barra, menú, ventana modal, zona de impresión
├── css/estilos.css   Identidad visual (papel envejecido, viñetas, corcho, impresión, responsive)
└── js/
    ├── datos.js      Contenido: pistas y su clasificación fija, objetos, voces, desenlaces, mapa transmedia
    ├── arte.js       Ilustraciones en SVG generadas por código: fondos, personajes, globos, documentos
    └── app.js        Navegación por capítulos, progreso local, bitácora, editor, decisiones, exportaciones
```

**Tecnología:** HTML, CSS y JavaScript sin dependencias. Se eligió en lugar de React/TypeScript para que funcione abriendo el archivo directamente, sin compilación, sin conexión y en equipos escolares modestos. No hay imágenes externas: todo el arte es SVG propio.

**Datos:** el progreso se guarda en el navegador (`localStorage`, clave `lpqf-progreso-v1`). No hay registro, servidor ni servicios externos.

## 4. Funcionalidades implementadas

| Sección | Qué hace |
|---|---|
| Portada | Ilustración, introducción, «Comenzar la investigación», «Continuar donde lo dejé», accesos a Cómo participar, Fuentes y ficción y Universo transmedia, mapa de progreso por capítulo |
| Cap. 1 · El hallazgo | Tira de 3 viñetas + habitación explorable con 4 objetos (hoja, cajita con carta, almanaque/grieta del terremoto, ventana a las ruinas). Cada objeto abre un documento ilustrado, una nota de contexto y registra pistas |
| Cap. 2 · Las voces | 4 personajes ficticios con retrato, rol y perspectiva. Se consultan en cualquier orden con 3 preguntas cada uno; diálogo en viñeta + transcripción. Tablero de versiones (corcho) que compara las respuestas. Al completar voces se desbloquean 3 interpretaciones |
| Cap. 3 · Archivo | Fichas con nombre, descripción, procedencia, relaciones navegables y clasificación. El estudiante propone una clasificación y recibe devolución; **la clasificación oficial no cambia**. Filtros. Comparador de dos testimonios con justificación escrita y lista de comparaciones |
| Cap. 4 · La viñeta que falta | Editor real: 6 fondos, 7 personajes (incluye siluetas), 4 tipos de globo, cola configurable, arrastre con mouse/dedo, movimiento con teclado, tamaño, voltear, traer al frente, quitar. Fundamentación obligatoria (título, pistas, qué es ficción, qué se apoya en fuentes). Vista previa, galería, edición posterior, **descarga PNG** e **impresión / PDF** |
| Cap. 5 · Decisiones | Dilema con 3 opciones, justificación mínima y pistas de apoyo. 3 desenlaces distintos (3 viñetas + consecuencias + pregunta abierta). Se pueden explorar los otros finales, escribir un desenlace propio y reconsiderar la decisión |
| Universo transmedia | Mapa interactivo que diferencia materiales originales, nueva expansión y futuras expansiones, con enlaces reales verificados |
| Cierre | Autoevaluación con los 5 criterios, evidencias automáticas de lo hecho, reflexión final, resumen completo (pistas, clasificaciones, comparaciones, viñetas, decisión, bitácora) imprimible o descargable en `.html` |
| Docentes | Objetivos, secuencia de 4 encuentros, modalidades, rúbrica, justificación del formato, cuidados |
| Progreso | Guardado automático; exportar/importar copia `.json`; recorrido de demostración; reinicio |
| Accesibilidad | Navegación completa por teclado, foco visible, enlace «saltar al contenido», textos alternativos en todas las ilustraciones, diálogos también en texto, avisos con `aria-live`, contraste alto, respeta «reducir movimiento» |

## 5. Comprobación realizada

Probado en Chromium (escritorio y vista móvil 375 px) con el servidor local:

- Las 13 rutas cargan sin errores de consola; una ruta inexistente vuelve a la portada.
- Cap. 1: los 4 objetos abren su documento, registran pistas (contador de la barra) y marcan el capítulo como completado.
- Cap. 2: las 12 preguntas actualizan diálogo, transcripción y tablero; se desbloquean las 3 interpretaciones (14 pistas en total).
- Cap. 3: una clasificación incorrecta muestra la explicación y mantiene la etiqueta oficial; el comparador guarda y elimina.
- Cap. 4: agregar personajes y globos, arrastrar (puntero) y mover con flechas; la validación bloquea el guardado incompleto; guardar en galería; PNG generado (`image/png`); impresión prepara la viñeta con su fundamentación.
- Cap. 5: la validación exige opción, justificación y pista; cada opción muestra su desenlace; se navega entre finales.
- Cierre: autoevaluación guardada, resumen actualizado y descarga `.html` generada.
- Recorrido de demostración: completa los 6 hitos.
- No quedan botones sin texto o sin etiqueta accesible.

## 6. Rigor histórico

- Los personajes, testimonios, documentos y la búsqueda del farol son **ficción** y se marcan así en toda la experiencia.
- Los datos marcados como **fuente histórica** son: fundación de Mendoza (2/3/1561, Pedro del Castillo), terremoto del 20/3/1861, reconstrucción de la ciudad en una nueva traza y Ruinas de San Francisco (Área Fundacional), registros de las lenguas allentiac y millcayac (Luis de Valdivia, 1607) y las Lagunas de Guanacache como territorio huarpe con comunidades actuales.
- No se inventan citas históricas ni vestimentas, símbolos o prácticas huarpes.
- Las descripciones de las piezas originales se limitan a lo que informa la página de educ.ar.
