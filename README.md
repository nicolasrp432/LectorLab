# LectorLab

Web y tienda de LectorLab: **la lectura construye habilidades de éxito**. El conocimiento de los libros se convierte en habilidades al practicar: comunicar, vender, pensar y crear.

## Enfoque editorial (octubre de 2026)

- **Habilidades como eje**: hub de habilidades (`/habilidades/`) con páginas específicas por habilidad, libros recomendados y ejercicios de 10 minutos para practicar de inmediato.
- **Tienda integrada** (`/tienda/`): catálogo filtrable por tipo (Cursos, Libros, Gadgets) y habilidad.
- **La llave maestra**: producto propio **«Lectura rápida y estratégica»** (`/tienda/curso-lectura-rapida/`) con temario estructurado y visor 3D interactivo.
- **Hero con Peter real**: imagen de referencia aportada, libro CSS 3D, GSAP para entrada/profundidad y Motion para respuesta a hover. Sin órbitas ni marquesinas repetidas. Three.js solo se descarga en las fichas que lo requieren.
- **Cuadernos de lectura** (`/tienda/cuadernos-lectorlab/`): pack de dos PDF en edición de prueba, 19 € previstos. Curso: 49 € previstos de lanzamiento. Venta no abierta hasta configurar contenido, cobro y entrega.
- **Laboratorio gratuito** (`/laboratorio/`): cuaderno de ejercicios interactivo de 7 días con persistencia local opcional y exportación de notas.
- **Personaje**: Peter como compañero de aprendizaje honesto y curioso.

Decisiones, referencias y límites comerciales: [STOREFRONT_2026-10-24.md](docs/STOREFRONT_2026-10-24.md).

## Desarrollo

Requiere Node.js 22.12 o superior.

```bash
npm ci
npm run dev
```

La página se sirve en `http://localhost:4173`.

```bash
npm run check    # Comprobación de sintaxis de scripts y módulos
npm test         # Pruebas del cuaderno y validación del catálogo
npm run build    # Generación de páginas estáticas y bundle de producción en dist/
npm run preview  # Previsualización del build estático
npx playwright install chromium # Una vez, para las pruebas de navegador
npm run test:browser # Build ya generado: responsive, WCAG, filtros, cuaderno y movimiento
```

`npm run build` genera `dist/`, configurado para despliegue estático en Cloudflare Pages / Workers (`wrangler.jsonc` con `404-page`).

## Estructura

- `src/data/catalog.js`: catálogo centralizado de habilidades, libros, gadgets y cursos.
- `scripts/site/`: plantillas HTML y componentes compartidos de la web.
- `scripts/generate-pages.mjs`: generador de las páginas estáticas multipágina.
- `scripts/site/home.mjs`: portada editorial con componentes reutilizables.
- `src/editorial.css`: paleta y componentes de la experiencia actual.
- `src/course-viewer.js`: visor 3D interactivo del curso de lectura rápida.
- `src/common.js`: gestión de movimiento reducido, barra de lectura, tilt 3D y apariciones.
- `src/main.js`: entrada y profundidad GSAP, respuesta Motion, limpieza al pausar.
- `src/site.js`: lógica de páginas interiores y filtrado dinámico de la tienda.
- `src/notebook.js`: lógica del cuaderno de ejercicios del laboratorio.
- `src/store.css`: estilos del nuevo sistema de tienda, habilidades, cohete y componentes responsive.
- `src/style.css`: base heredada y estilos del cuaderno. Los tokens actuales se definen en `editorial.css`.
- `public/assets/products/`: imágenes ilustrativas de gadgets en WebP; el modelo se comprueba en la tienda externa.
- `tests/`: pruebas automatizadas de persistencia del cuaderno y relaciones del catálogo.
