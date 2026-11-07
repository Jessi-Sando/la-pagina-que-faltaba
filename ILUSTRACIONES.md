# Ilustraciones a generar · Fase 1: Portada

Guardá cada imagen en la carpeta `img/` con el **nombre exacto** que figura abajo. La web la usa sola: mientras falte un archivo, muestra la versión provisoria de `img/provisorias/`, que es un recorte de la imagen de referencia.

**Formato:** WebP (calidad 80–85). Si tu generador solo exporta PNG, guardalo así y avisame: lo convierto.
**Sin texto dentro de las imágenes:** nada de títulos, letras legibles, firmas, logos ni marcas de agua. Los títulos y rótulos los pone la web, para que sean accesibles y se puedan traducir o corregir.

---

## 0. Antes de empezar: hoja de personajes (no va a la web)

Para que los personajes se vean iguales en todos los capítulos, generá primero una **hoja de personajes** y usala como imagen de referencia en cada pedido siguiente. En Midjourney eso es `--cref`; en otros generadores, la opción para subir una imagen de referencia.

- **Archivo:** `personajes-referencia.png` · 2048 × 1152
- **Contenido:** los seis personajes de pie, de cuerpo entero, sobre fondo de papel liso, con vista de frente y de tres cuartos.

| Personaje | Cómo es (siempre igual) |
|---|---|
| **Elena** (protagonista, 15 años) | Pelo castaño oscuro ondulado, recogido en un rodete bajo y desprolijo con mechones sueltos. Blusa de lino crema gastada, falda larga marrón, chal de lana **terracota**. Mirada seria y curiosa. |
| **Rosario Funes** (lavandera, ~65) | Pelo canoso en rodete, piel curtida, chal terracota oscuro, delantal, manos de trabajo. Expresión cálida y firme. |
| **Aurelio Ponce** (ex escribiente, ~60) | Delgado, levita oscura gastada, galera, anteojos redondos, cuello alto. Expresión desconfiada. Suele llevar papeles. |
| **Tomás Videla** (herrero, 40–45) | Robusto, bigote oscuro, gorra marrón, camisa clara arremangada, chaleco y delantal de herrero. Expresión reservada. **Referencia definitiva: la escena de su entrevista en el taller.** |
| **Elvira Sosa** (maestra, ~35) | Vestido sepia de cuello alto, pelo recogido, un libro bajo el brazo. Expresión reflexiva. |
| **Abuela Teodora** (en recuerdos, ~75) | Pelo blanco en rodete, chal azul petróleo, bastón. |

> **Cuidado de representación:** no agregues vestimentas, símbolos, pinturas ni objetos «indígenas» inventados a ningún personaje. La historia no atribuye identidades huarpes a personas concretas: así se evitan estereotipos.

---

## Estilo común (pegalo al inicio de cada pedido)

**En inglés (los generadores suelen responder mejor):**

```
Historical graphic novel illustration, European bande dessinée style, detailed ink linework with cross-hatching and watercolor wash, muted palette of petrol blue (#1f4e5a), warm browns, terracotta red (#b5543a) and aged cream paper tones, subtle paper grain, cinematic lighting, expressive but realistic faces, Mendoza Argentina 1874, colonial ruins after the 1861 earthquake, Andes mountains, poplar trees. No text, no letters, no logos, no watermark.
```

**En castellano:**

```
Ilustración de novela gráfica histórica, estilo historieta europea, entintado detallado con tramado y aguadas de acuarela, paleta apagada de azul petróleo, marrones cálidos, rojo terracota y tonos de papel crema envejecido, grano de papel sutil, iluminación cinematográfica, rostros expresivos y realistas, Mendoza (Argentina) en 1874, ruinas coloniales después del terremoto de 1861, cordillera de los Andes, álamos. Sin texto, sin letras, sin logos, sin marca de agua.
```

---

## 1. Ilustración principal de la portada

- **Archivo:** `img/portada-heroe.webp`
- **Medidas:** 2400 × 1350 px (16:9). Mínimo aceptable: 1920 × 1080.
- **Pantalla:** portada, imagen de fondo a pantalla completa.

**Composición (importante para que el título se lea):**

```
┌──────────────────────────────┬─────────────────────┐
│                              │                     │
│   ELENA de espaldas,         │   Zona OSCURA y     │
│   sobre el hombro, lee       │   tranquila (pared  │
│   la hoja. Farol a la        │   en sombra azul    │
│   izquierda. Ventana con     │   petróleo). Aquí   │
│   ruinas y cordillera.       │   va el TÍTULO.     │
│        (55 % izquierdo)      │   (45 % derecho)    │
├──────────────────────────────┴─────────────────────┤
│  15 % inferior: penumbra, sin detalles importantes │
│  (ahí se apoyan las tarjetas de los capítulos)     │
└────────────────────────────────────────────────────┘
```

**Pedido (agregar después del estilo común):**

```
Over-the-shoulder view of Elena, a 15-year-old girl with dark brown wavy hair in a loose low bun and a terracotta wool shawl over a worn cream linen blouse, holding a torn, burnt-edged, yellowed old document with illegible faded handwriting. Warm light from an old oil lantern on the left among bookshelves. Through a large window: ruins of a colonial church bell tower and the Andes. The subject occupies the left 55% of the frame; the right 45% is a calm, dark petrol-blue shadowed wall with very little detail, suitable for overlaying a title. The bottom 15% falls into soft darkness. Mysterious, quiet, cinematic atmosphere. 16:9.
```

> **Rigor histórico:** el acta de fundación de Mendoza es de **1561**. Si el documento tiene algo legible, que no diga «1861 · Acta de fundación» como la imagen de referencia. Lo mejor es que la letra sea ilegible.

---

## 2 a 6. Tarjetas de los capítulos

- **Medidas:** 1200 × 750 px (16:10) cada una.
- **Pantalla:** portada, las cinco tarjetas de abajo.
- **Composición:** sujeto principal **centrado y en los dos tercios superiores**. La esquina inferior izquierda queda tapada por el número del capítulo, y los bordes se recortan con esquinas redondeadas.

| Archivo | Pedido (agregar después del estilo común) |
|---|---|
| `img/cap1-hallazgo.webp` | Ruins of colonial Mendoza after the 1861 earthquake: a partially collapsed church bell tower, broken adobe and brick walls, rubble, the Andes in the background, pale daylight sky. Wide establishing shot, no people. |
| `img/cap2-voces.webp` | Half-body group portrait of four 19th-century witnesses, side by side, looking in different directions: an elderly washerwoman with grey bun and dark terracotta shawl; a thin old clerk with top hat and round spectacles; a muleteer around 50 with wide-brim hat and greying beard; a woman teacher around 35 with high-collared sepia dress. Serious, distrustful expressions. Plain aged-paper background. |
| `img/cap3-archivo.webp` | Top-down view of an investigator's desk: yellowed letters, a hand-drawn old city map, pinned notes connected by red thread, a brass magnifying glass, an inkwell. All handwriting illegible. |
| `img/cap4-vineta.webp` | A hand holding a dip pen, inking a comic page of small panels showing colonial ruins and poplars, on aged paper, ink pot nearby. Panels with no lettering. |
| `img/cap5-decisiones.webp` | A weathered wooden signpost with three blank arrows pointing in different directions, on a dirt road among poplar trees, the Andes behind, dramatic sky. No writing on the arrows. |

---

## Cómo me las pasás

1. Guardalas en `la-pagina-que-faltaba/img/` con esos nombres, o pegalas en el chat y yo las ubico.
2. Recargá la portada: las provisorias se reemplazan solas.
3. Si alguna no encaja bien (por ejemplo, el título tapa a Elena), lo ajusto con el encuadre en el código, sin volver a generarla.

Cuando la portada esté aprobada, sigue la **Fase 2: El hallazgo**, con su propia lista de viñetas.
