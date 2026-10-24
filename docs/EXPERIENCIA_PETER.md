# LectorLab · Una idea que sale del libro

## Dirección vigente

Esta revisión responde a la corrección de Nicolás: recuperar la paleta anterior de la **web**, conservar la claridad del catálogo y devolver personalidad, scroll y una historia antes de vender. El documento de diseño aportado está orientado a Instagram; su paleta bosque/cobre no sustituye la elegida para la web.

- Marfil `#F5F3EA`, tinta `#121212`, lima `#D7FF3F` y coral `#F04432`. Fondos neutros, acentos concentrados en banner, ilustraciones, CTA y productos. Texto de acento coral oscuro `#B92C20` donde se necesita contraste sobre claro.
- Fuentes locales existentes: Space Grotesk e Instrument Serif.
- El hero invita a seguir la historia; el acceso directo a la tienda sigue disponible en el hero y la navegación.
- La historia ficticia de Peter muestra una pregunta, una idea y una pequeña prueba en una conversación. No es un testimonio de un cliente ni una promesa de resultados.
- El despegue amplía la idea a otras habilidades: el conocimiento necesita práctica. Después llegan tres rutas, dos productos propios, tres libros y el laboratorio gratuito.
- Se conserva el precio previsto del curso (49 €) y de los cuadernos (19 €), su estado de desarrollo y los enlaces externos contrastados. No se activan compras ni se afirman resultados comerciales.

## Implementación

`scripts/site/story.mjs` contiene tres componentes: banner, historia y nave. `home.mjs` compone el recorrido con las tarjetas compartidas existentes. `src/narrative.css` solo se carga en la portada; los tokens de la paleta siguen en `editorial.css`, incluidas las fichas interiores. Los visores 3D recuperan la misma paleta.

GSAP sincroniza el banner, las líneas de progreso y la trayectoria SVG de la nave con el scroll. La ilustración de la historia acompaña los capítulos con `position: sticky` en escritorio. No hay scroll secuestrado, pin artificial ni bucle de animación perpetuo. Motion conserva el hover de las rutas. Al pausar o pedir movimiento reducido se revierten los efectos y se muestra una escena estática; el contenido también funciona sin JavaScript. La nave retoma el SVG original del repositorio, con materiales mediante gradientes y trayectoria GSAP MotionPath.

## Ilustraciones nuevas

Generadas con la herramienta integrada **image_gen**, usando las imágenes del usuario solo como referencias de identidad. No se usó CLI/API alternativo ni se recortaron las fotografías originales. Las nuevas ilustraciones sustituyen las referencias en el hero, la historia y los acompañamientos de páginas interiores. No se ha inventado un nombre para el zorro.

Archivos de producción, WebP con canal alfa conservado:

- `public/assets/peter-reading-cutout.webp` — 850 × 1062 px.
- `public/assets/peter-friend-cutout.webp` — 1100 × 733 px.

Conversión y escalado de los PNG generados con Sharp, calidad 88 y alfa 100. No se aplana la transparencia ni se mezcla un fondo en el asset. Los círculos, la profundidad y las sombras de apoyo pertenecen a la composición CSS de la página.

### Prompts utilizados

**Peter leyendo**. Referencia: `image_7b6bc1.jpg`.

> Use case: stylized-concept. Asset type: transparent website hero character for LectorLab. The attached image is CHARACTER IDENTITY REFERENCE ONLY, not a picture to reuse or background to reproduce. Create a NEW full-body pose of the exact same Peter otter: rich dark brown furry adult river otter, cream muzzle and broad cream chest, round small ears, intelligent glossy dark eyes, recognizable sweet thoughtful face and natural proportions. Peter is sitting slightly three-quarter, holding a small OPEN ivory book in both paws at waist height, looking up from the pages toward the upper left with bright curiosity, as if a new possibility has occurred to him. Show entire body, tail, feet and all book corners, ample 8% padding, isolated single subject. Premium finely detailed soft 3D editorial character, warm gentle key light, neutral soft fill that works on ivory and near-black backgrounds. Book is cream with charcoal cover and a subtle lime #d7ff3f bookmark. GENUINE transparent background, clean alpha fur edges, no opaque background, no floor, no scenery, no frame, no text, no glow around silhouette, no additional characters. This is a new illustration inspired by the approved Peter reference, not the original photograph.

**Conversación con el zorro**. Referencias: `image(4).png` y el nuevo Peter leyendo.

> Use case: illustration-story. Asset type: seamless transparent website narrative character illustration for LectorLab. Input 1: identity reference ONLY of Peter otter and his orange fox friend in ivory knit sweater. Input 2: newly approved matching render of Peter, keep same face, fur and proportions. Generate a NEW composition, NOT the original park/bench scene: Peter on left and his fox friend on right seated close at the same level, entire bodies visible including tails and feet. Peter holds a small open ivory book with dark charcoal cover in one paw and gently gestures with other as he explains an idea; fox in same knitted ivory sweater listens attentively, holding a small cream notebook and simple pencil on lap. Warm mature expressive characters, thoughtful friendly conversation, not exaggerated cartoons. Premium detailed soft 3D fur, same recognizable Peter face and fox as reference, even warm soft studio lighting, both at three-quarter angle facing each other. A single horizontal 3:2 transparent illustration, subjects fill 85% width with generous safe padding, no crop. GENUINE alpha transparency. No bench, no floor, no scenery, no background, no badge, no frame, no text, no lettering, no outlines or glows. Natural warm internal shadows only. Works seamlessly layered over cream or black webpage.

**Refinamiento final del recorte de ambos personajes**. Referencia: la ilustración generada en el paso anterior.

> Use case: background-extraction. Keep these two exact characters, their poses, face identity, fur, book, sweater and notebook unchanged. Remove ALL background and ambient orange/brown glow, haze and floor shadow around and between them. The entire area outside the actual furry silhouettes and props must have alpha 0, including the gap between heads and above the gesturing paw. Genuine transparent cutout for seamless webpage integration, no halo, no replacement backdrop, no checkerboard painted in image. Preserve delicate whisker edges with natural alpha antialiasing. All characters and objects stay solid opaque. Do not crop or change composition.

La mención «newly approved» en el segundo prompt es una indicación interna de continuidad de imagen, no una afirmación de aprobación posterior del usuario.

## Validación

Las pruebas de navegador comprueban las 15 páginas a 1440, 768, 390 y 320 px, imágenes decodificadas, enlaces internos y accesibilidad automática de seis páginas principales. También verifican los filtros, las notas, WebGL, recorrido de la nave, progreso de capítulos, limpieza del banner al pausar, reinicio de movimiento y lectura sin JavaScript.

La petición de cambio del sistema operativo se verifica esperando el evento de media query antes de comprobar la retirada de WebGL. Las capturas cargan las imágenes diferidas antes de revisarlas. Esta comprobación no equivale a una auditoría manual exhaustiva de accesibilidad ni a verificar el despliegue público.

Resultado final: `npm run check`, `npm test`, `npm run build`, `git diff --check` y `npm run test:browser` correctos. Cero desbordamientos en las 60 combinaciones de página/ancho y cero infracciones automáticas WCAG A/AA en las seis páginas comprobadas. Capturas de hero, historia, despegue y móvil revisadas visualmente.
