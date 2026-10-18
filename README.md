# LectorLab

Landing de una página para LectorLab: preguntas de la vida real, ideas de libros y un cuaderno interactivo para aplicarlas.

## Desarrollo

Requiere Node.js 22.12 o superior.

```bash
npm ci
npm run dev
```

La página se sirve en `http://localhost:4173`.

```bash
npm run check
npm test
npm run build
npm run preview
```

`npm run build` genera `dist/`, que puede alojarse en cualquier servicio de archivos estáticos. El código no requiere claves ni servicios externos para funcionar.

## Código

- `index.html`: contenido y estructura de la landing.
- `src/style.css`: diseño responsive y sistema de color.
- `src/main.js`: GSAP y ScrollTrigger, pausa de movimiento y carga de la escena.
- `src/scene.js`: libro original Three.js, apertura con scroll/botón y respuesta al puntero.
- `src/notebook.js`: rutas, siete días de ejercicios, notas, progreso, guardado opcional y exportación.
- `public/assets/`: ilustración de Peter y favicon.
- `public/fonts/`: fuentes locales y sus licencias OFL.
- `tests/`: comprobaciones de la lógica del cuaderno mediante simulación DOM.
- `docs/`: dirección de diseño, alcance y estado de validación.

## Diseño

Combinación de las direcciones Knowledge Playground y Señal roja: tinta `#121212`, papel `#F5F3EA`, lima `#D7FF3F` y rojo `#F04432`. Tipografía Space Grotesk con Instrument Serif como acento editorial.

La escena 3D se carga por separado. Sin WebGL, con ahorro de datos o con movimiento reducido hay una portada alternativa hecha en CSS. El movimiento se puede pausar. No hay animaciones continuas de reproducción automática: los efectos responden al scroll o a una acción.

## Datos y producto

Las notas no se envían a ningún servidor. Se guardan en memoria y, solo si la persona activa la opción, en `localStorage`. Se pueden descargar y borrar. No hay analítica, cobros, newsletter, CRM ni WhatsApp conectados.

La oferta de 21 días y su precio de 19 € son una propuesta piloto. El sitio no permite comprar. Los libros no están incluidos; los enlaces apuntan a sus editoriales. Las preguntas son originales de LectorLab y no se presentan como citas literales de los autores.

## Referencias

Se consultó [UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) para jerarquía, contraste, interacción táctil, movimiento reducido y rendimiento. Las decisiones finales de color y composición responden al encargo de LectorLab.

Documentación de [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) y [Three.js](https://threejs.org/docs/).
