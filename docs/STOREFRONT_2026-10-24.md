# LectorLab · Portada editorial y catálogo

> Registro de la primera iteración. La paleta, el hero y el recorrido visual fueron sustituidos por la [experiencia narrativa de Peter](EXPERIENCIA_PETER.md) a petición de Nicolás. Las decisiones de producto y los límites comerciales continúan vigentes.

## Resultado

La portada pasa de repetir las siete habilidades en órbitas, chips, tarjetas y bloques de manifiesto a un recorrido único: propuesta de valor → tres rutas → productos propios → tres libros seleccionados → Peter y su amigo → práctica gratuita → preguntas frecuentes. Las siete rutas siguen disponibles en su hub y conservan sus URLs.

El hero utiliza el Peter aportado por Nicolás, con marco editorial, libro CSS 3D y entrada/paralaje GSAP. Motion aporta respuesta de resorte a las tarjetas de ruta. No hay desplazamiento secuestrado ni animaciones infinitas en la portada. Three.js se carga solo en las fichas que usan su visor; la portada no descarga Three.js. Las preferencias de movimiento reducido y el control de pausa se respetan. Todo el catálogo se genera en HTML y sigue siendo accesible sin JavaScript.

La base visual usa bosque #0E1A16, crema #F4F1ED, cobre #E98A5B y salvia #A7B7A3, tomando como referencia el sistema de marca adjunto. Se conservan las fuentes locales con licencia del repositorio (Space Grotesk e Instrument Serif) para evitar peticiones externas y mantener continuidad tipográfica.

## Producto y contexto contrastado

- Enfoque vigente: el conocimiento ayuda a desarrollar habilidades cuando se practica. La lectura por sí sola no garantiza resultados.
- Curso «Lectura rápida y estratégica»: 49 € como **precio previsto de lanzamiento**, pago único. Se conserva el temario propuesto de seis módulos; sigue en desarrollo y sin checkout.
- Pack «Lee y hazlo tuyo»: **19 € como nueva propuesta para los dos cuadernos**, pago único. No es un precio anterior ni un descuento.
- Cuaderno 01 «Lee y hazlo tuyo»: 34 páginas, antes/durante/después, edición de prueba 1.0.
- Cuaderno 02 «Vuelve al libro»: 26 páginas, 28 propuestas flexibles, edición de prueba 1.0.
- Se verificaron las páginas iniciales de ambos PDF actuales. Son cuadernos para imprimir/anotar, no formularios interactivos. No se han incorporado sus archivos íntegros a este repositorio público ni se ha fingido una entrega pagada.
- El anterior precio de 19 € en `PRODUCTO_Y_VALIDACION.md` pertenece al kit **Dinero con criterio**, no al pack nuevo. Ese documento es histórico y el PDF piloto existente se conserva; no se presenta como parte del nuevo pack.
- El laboratorio de siete días es una experiencia gratuita con recorrido propio; no se afirma que sea un extracto de los dos PDF.
- Peter es el personaje de los archivos aportados. El zorro aparece en la imagen aprobada; no se le ha inventado nombre ni historia adicional.

49 € sitúa el curso como una compra inicial de aprendizaje y lo diferencia del acompañamiento escrito de 19 €. Es una decisión de posicionamiento para validar con compras futuras, no una conclusión de demanda ni un estudio de disposición a pagar. No se publican escasez, reseñas, descuentos o resultados inventados.

## Productos externos y referencias

Los tres libros destacados ahora tienen enlaces a fichas concretas, con ISBN, en lugar de búsquedas genéricas:

- [Hábitos atómicos · James Clear · editorial](https://www.planetadelibros.com/libro-habitos-atomicos/310441), ISBN 9788418118036.
- [El poder de tu alter ego · Todd Herman · edición española](https://www.casadellibro.com/libro-el-poder-de-tu-alter-ego/9791387662356/17958450), ISBN 9791387662356. [Referencia editorial](https://www.edicionesurano.com/el-poder-de-tu-alter-ego).
- [Cómo ganar amigos e influir sobre las personas · Dale Carnegie](https://www.casadellibro.com/libro-como-ganar-amigos-e-influir-sobre-las-personas/9788411723985/17972184), ISBN 9788411723985.
- [Glocusent Original · fabricante](https://glocusent.com/es/collections/glocusent-top-sellers/products/glocusent-eyecaring-led-neck-reading-light-gray).

Los tres libros destacados incluyen portadas de sus fichas oficiales/comerciales enlazadas, guardadas localmente en WebP. El resto de portadas tipográficas son interpretaciones gráficas, no fotografías editoriales. Las imágenes de accesorios preexistentes se identifican como ilustrativas. El resto de productos mantiene búsquedas por título/autor o categoría, etiquetadas «Buscar en Amazon». No se inventan ASIN ni se fijan precios de comercios externos. El tag de afiliación permanece vacío.

## Referencias de experiencia y componentes

- [Readwise Reader](https://docs.readwise.io/reader/docs): referencia de lectura centrada en el contenido y anotación. Se toma la claridad del recorrido, no su interfaz ni sus métricas.
- [GSAP matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/): variantes responsive y reversión de animaciones.
- [Motion quick start](https://motion.dev/docs/quick-start) y [animate](https://motion.dev/docs/animate): la versión JavaScript encaja con Vite/HTML existente; no se añade React solo para animar.

## Arquitectura

- `src/data/catalog.js`: datos, precios, estado, rutas y enlaces; fuente única.
- `scripts/site/ui.mjs`: layout, navegación, pie, tarjetas, maquetas de producto y encabezados reutilizables.
- `scripts/site/home.mjs`: composición de la nueva portada.
- `scripts/site/pages.mjs`: páginas interiores, incluida la ficha de cuadernos.
- `src/editorial.css`: tokens y componentes editoriales compartidos.
- `src/main.js`: GSAP y Motion de la portada.
- `src/common.js`: pausa, preferencias y carga diferida de 3D; descarta cargas que terminen después de pausar.
- `tests/browser.mjs`: pruebas sobre el build, en Chromium, con servidor estático local propio.

## Pendientes comerciales reales

Antes de abrir ventas: terminar y validar el curso, cerrar la versión comercial de los cuadernos, configurar cobro/entrega, añadir la identidad y condiciones del vendedor y confirmar el dominio definitivo. Se conserva `noindex` y el dominio provisional existente; el merge a main no constituye una verificación de despliegue ni de checkout. No se ha creado una falsa lista de espera ni se han recopilado datos personales.

### Procedencia de imágenes de libros (24/10/2026)

- `public/assets/products/habitos-atomicos.webp`: portada obtenida de la ficha de Planeta de Libros; asset `proassetspdlcom.cdnstatics2.com/usuaris/libros/thumbs/71b825a3-36b0-442b-8327-22f5a47a3d66/d_295_510/portada_habitos-atomicos_james-clear_202002111200.webp`.
- `public/assets/products/alter-ego.webp`: portada de Casa del Libro, ISBN 9791387662356; asset `imagessl6.casadellibro.com/a/l/t5/56/9791387662356.jpg`.
- `public/assets/products/como-ganar-amigos.webp`: portada de Casa del Libro, ISBN 9788411723985; asset `imagessl5.casadellibro.com/a/l/t5/85/9788411723985.jpg`.

Se conservan los diseños editoriales y sus marcas. No se presentan como diseños originales de LectorLab.

## Validación completada

- `npm run check`, `npm test` y `npm run build`: correctos.
- `npm run test:browser`: correcto sobre el build de producción, usando Chromium headless.
- 15 páginas × 4 anchos (320, 390, 768 y 1440 px): sin desbordamiento horizontal; imágenes y destinos internos comprobados.
- Axe WCAG 2 A/AA y 2.1 AA: cero infracciones automáticas en inicio, tienda, curso, cuadernos, laboratorio y habilidad de comunicación. No constituye una certificación exhaustiva ni sustituye pruebas con tecnologías de asistencia.
- Filtros, estado vacío, restablecimiento y URL; notas, persistencia tras recarga, cambio de ruta, exportación y cancelación de borrado; carga/pausa/reanudación de WebGL; movimiento reducido, pausa de Motion, menú móvil y contenido sin JavaScript: correctos.
- Revisión visual en escritorio y móvil. Se corrigieron desbordamientos de la estantería y el mockup a 320 px, contrastes heredados y limpieza del estado de hover al pausar.
- El build avisa del tamaño del módulo Three.js (~526 kB sin comprimir). Es una carga diferida de las fichas 3D; no se descarga en la portada. No se han medido Core Web Vitals en producción ni probado Safari/Firefox.
