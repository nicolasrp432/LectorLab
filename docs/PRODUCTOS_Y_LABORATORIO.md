# Laboratorio y productos, edición 1.0

El laboratorio público ofrece tres escenas originales (comunicación, hábito de lectura y foco). El recorrido corto separa lectura, recuerdo/contraste, prueba y exportación. La persistencia es optativa y local. La copia JSON se importa en el espacio del pack; no se envían respuestas a un servidor.

El cuaderno anterior sigue dentro de una sección opcional y conserva su clave `lectorlab-notebook-v1`; no se migran ni borran sus datos. La prueba nueva usa `lectorlab-quick-v1`.

## Componentes

- `src/learning-core.js`: esquema v1, validación de importaciones, Markdown, Anki TSV, calendario ICS con escape y plegado UTF-8, adaptador de almacenamiento con fallo explícito.
- `src/quick-lab.js` y `quick-lab.css`: experiencia breve, estados y estilos propios.
- `scripts/site/pages.mjs`: contenido accesible inicial; con JavaScript desactivado las escenas no se ejecutan y el cuaderno mantiene contenido estático.
- `src/data/catalog.js`: precio confirmado del pack (19 €), curso previsto (49 €) y descripción real del contenido.

## Producto y entrega

Pack: dos cuadernos de 19 y 14 páginas, cada uno en A5 imprimible y A4 con formularios; espacio HTML local con tablero y exportaciones; plantillas Markdown. Curso: seis módulos escritos, manual de 16 páginas, prácticas, planificador y temporizador. Los archivos comerciales y sus fuentes se entregan por separado y no se publican en este repositorio.

No hay checkout conectado, área de compradores autenticada, entrega por correo ni sincronización. La interfaz dice expresamente que la venta aún no está abierta. Para habilitarla se requiere proveedor real, verificación del pago en servidor y prueba de descarga/recuperación. Un código en la URL o una marca en localStorage no son controles de acceso.

## Verificación

`npm test` cubre integridad del catálogo, cuaderno anterior y formato de exportación/importación. `npm run test:browser` recorre las 16 páginas a cuatro anchos y comprueba accesibilidad, navegación, datos locales y animaciones.

`tests/products-browser.mjs` es una prueba adicional con los entregables privados presentes. Configurar `LECTORLAB_PRODUCTS_DIR` (ruta absoluta al directorio output del paquete de fuentes), y ejecutar con Playwright/Chromium. Comprueba transferencia del laboratorio al kit, persistencia file://, controles de estado, importación inválida sin pérdida, texto no interpretado como HTML, exportación, almacenamiento bloqueado y herramientas del curso.

Los HTML locales dependen del soporte del navegador/gestor de archivos, especialmente en móvil. Los PDF son la alternativa. Las copias JSON son necesarias para recuperación y cambio de dispositivo. No se afirma uso sin conexión de la web pública: los entregables descargados sí contienen sus recursos dentro del HTML.

## Plataforma gratuita y curso audiovisual

La herramienta completa vive en `/laboratorio/mesa/`: ideas propias, tres pasos de trabajo (comprender, probar, revisar), tablero, revisiones con fecha, biblioteca por objetivo y exportaciones JSON/Markdown/Anki/ICS. Usa `lectorlab-platform-v1`, separado del ejercicio breve y del cuaderno anterior. No requiere comprar el pack; este conserva sus cuadernos y la versión local como parte de la entrega.

`lab-platform.mjs` genera la página, `lab-workspace.js` implementa el comportamiento y `learning-core.js` mantiene el formato común. Las pruebas de navegador cubren esta ruta y sus cambios de estado, persistencia, exportación y rechazo de copias inválidas.

El curso cambia de dirección a audiovisual: seis lecciones y 24 escenas con guion original preparados por separado. La animática es una vista de producción con tiempos estimados. No hay todavía narración generada, subtítulos sincronizados ni MP4 finales; la web indica producción audiovisual y conserva 49 € como precio previsto. No publicar el material de producción como curso terminado.
