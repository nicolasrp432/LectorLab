# LectorLab

Web y tienda de LectorLab: **la lectura construye habilidades de éxito**. Cualquier habilidad se puede adquirir con la lectura —desde hablar en público, vender o comunicar hasta lanzar un cohete a la Luna—.

## Enfoque (v0.3.0)

- **Habilidades como eje**: hub de habilidades (`/habilidades/`) con páginas específicas por habilidad, libros recomendados y ejercicios de 10 minutos para practicar de inmediato.
- **Tienda integrada** (`/tienda/`): catálogo filtrable por tipo (Cursos, Libros, Gadgets) y habilidad.
- **La llave maestra**: producto propio **«Lectura rápida y estratégica»** (`/tienda/curso-lectura-rapida/`) con temario estructurado y visor 3D interactivo.
- **Elementos 3D en Three.js**: libro de portada con iconos de habilidades en órbita interactiva y visor de producto 3D giratorio. Carga diferida (`lazyScene`), alternativas completas en CSS y compatibilidad total con `prefers-reduced-motion` y ahorro de datos.
- **Laboratorio gratuito** (`/laboratorio/`): cuaderno de ejercicios interactivo de 7 días con persistencia local opcional y exportación de notas.
- **Personaje**: Peter como compañero de aprendizaje honesto y curioso.

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
```

`npm run build` genera `dist/`, configurado para despliegue estático en Cloudflare Pages / Workers (`wrangler.jsonc` con `404-page`).

## Estructura

- `src/data/catalog.js`: catálogo centralizado de habilidades, libros, gadgets y cursos.
- `scripts/site/`: plantillas HTML y componentes compartidos de la web.
- `scripts/generate-pages.mjs`: generador de las páginas estáticas multipágina.
- `src/skills-scene.js`: escena 3D interactiva del hero (Three.js).
- `src/course-viewer.js`: visor 3D interactivo del curso de lectura rápida.
- `src/common.js`: gestión de movimiento reducido, barra de lectura, tilt 3D y apariciones.
- `src/main.js`: lógica de la página de inicio (scroll GSAP, cohete orbital, escenas 3D).
- `src/site.js`: lógica de páginas interiores y filtrado dinámico de la tienda.
- `src/notebook.js`: lógica del cuaderno de ejercicios del laboratorio.
- `src/store.css`: estilos del nuevo sistema de tienda, habilidades, cohete y componentes responsive.
- `src/style.css`: sistema base de diseño editorial (tinta, papel, lima, rojo).
- `public/assets/products/`: fotografías editoriales de gadgets optimizadas en WebP.
- `tests/`: pruebas automatizadas de persistencia del cuaderno y relaciones del catálogo.
