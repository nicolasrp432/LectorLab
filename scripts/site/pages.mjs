import { home } from "./home.mjs";
/**
 * Plantillas de página. Cada función devuelve { path, html }.
 * `path` es el archivo de salida relativo a la raíz del proyecto.
 */
import { skills, course, notebooks, books, gadgets, getProduct, getSkill, isAffiliate } from "../../src/data/catalog.js";
import { esc, icon, layout, bookCover, courseBox, productCard, skillCard, skillChip, notebookBox } from "./ui.mjs";

const affiliateNote = () =>
  isAffiliate()
    ? "Algunos enlaces son de afiliado: si compras, LectorLab puede recibir una comisión sin coste extra para ti. Las portadas tipográficas sin imagen son interpretaciones de LectorLab."
    : "Los enlaces llevan a tiendas externas. Las portadas tipográficas sin imagen son interpretaciones de LectorLab.";
const priceLabel = () => course.price || "Precio por anunciar";
const courseCta = (id = "course-cta") =>
  course.checkoutUrl
    ? `<a class="btn btn-lime" id="${id}" href="${esc(course.checkoutUrl)}" rel="noopener">Comprar el curso <span aria-hidden="true">↗</span></a>`
    : `<a class="btn btn-lime" id="${id}" href="/tienda/curso-lectura-rapida/#temario">Ver el temario <span aria-hidden="true">↗</span></a>`;

/* ================================================================== */
/* HABILIDADES                                                         */
/* ================================================================== */
function skillsHub() {
  const spines = skills
    .map(
      (s, i) => `<a class="spine spine--${s.color}" href="/habilidades/${s.slug}/" style="--h:${78 + ((i * 37) % 22)}%;--w:${54 + ((i * 13) % 18)}px" aria-label="${esc(s.name)}">
          <span class="spine-num">${s.num}</span><span class="spine-title">${esc(s.name)}</span>${icon(s.icon, "spine-icon")}
        </a>`,
    )
    .join("");
  const body = `
      <section class="page-hero section-pad">
        <nav class="crumbs" aria-label="Migas"><a href="/">Inicio</a><span>/</span><span aria-current="page">Habilidades</span></nav>
        <div class="page-hero-grid">
          <div>
            <p class="eyebrow">LA BIBLIOTECA DE HABILIDADES</p>
            <h1 class="page-title">Lee una idea.<br /><em>Entrena una habilidad.</em></h1>
            <p class="page-lead">Elige un lomo de la estantería. Cada habilidad incluye los libros que recomendamos, por qué leerlos y un ejercicio para empezar hoy.</p>
          </div>
          <div class="shelf" aria-label="Estantería de habilidades">
            <div class="shelf-row">${spines}</div>
            <div class="shelf-board" aria-hidden="true"></div>
            <span class="shelf-note" aria-hidden="true">Pasa el cursor.<br /><i>Saca un libro.</i></span>
          </div>
        </div>
      </section>
      <section class="skills-section section-pad">
        <div class="skill-grid">${skills.map((s) => skillCard(s, { heading: "h2" })).join("")}</div>
      </section>
      ${courseBand()}`;
  return {
    path: "habilidades/index.html",
    html: layout({
      title: "Habilidades que se aprenden leyendo — LectorLab",
      description: "Hablar en público, vender, negociar, dinero, foco o pensamiento científico: libros recomendados y ejercicios para aprender cualquier habilidad leyendo.",
      path: "/habilidades/",
      entry: "/src/site.js",
      active: "skills",
      page: "skills",
      body,
    }),
  };
}

function courseBand() {
  return `<section class="course-band section-pad">
        <div>
          <p class="eyebrow">LA LLAVE MAESTRA</p>
          <h2>¿Quieres leer estos libros<br /><em>más rápido y recordar más?</em></h2>
        </div>
        <div class="course-band-actions">
          <p>${esc(course.short)}</p>
          <a class="btn btn-lime" href="/tienda/curso-lectura-rapida/">Conoce el curso <span aria-hidden="true">↗</span></a>
        </div>
      </section>`;
}

/* ================================================================== */
/* HABILIDAD · DETALLE                                                 */
/* ================================================================== */
function skillPage(s, idx) {
  const prev = skills[(idx - 1 + skills.length) % skills.length];
  const next = skills[(idx + 1) % skills.length];
  const bookCards = s.books.map((id) => productCard(getProduct(id))).join("");
  const gadgetCards = s.gadgets.map((id) => productCard(getProduct(id))).join("");
  const body = `
      <section class="page-hero skill-hero skill-hero--${s.color} section-pad">
        <nav class="crumbs" aria-label="Migas"><a href="/">Inicio</a><span>/</span><a href="/habilidades/">Habilidades</a><span>/</span><span aria-current="page">${esc(s.name)}</span></nav>
        <div class="page-hero-grid">
          <div>
            <p class="eyebrow">HABILIDAD ${s.num} · ${esc(s.tag)}</p>
            <h1 class="page-title">${esc(s.name)}.<br /><em>${esc(s.hook)}</em></h1>
            <p class="page-lead">${esc(s.intro)}</p>
            <div class="hero-actions">
              <a class="btn" href="#libros">Ver los libros <span aria-hidden="true">↓</span></a>
              <a class="text-link" href="#ejercicio">Ejercicio de hoy ↗</a>
            </div>
          </div>
          <div class="skill-token-wrap">
            <div class="skill-scene-3d" id="skill-scene" role="group" data-skill-icon="${s.icon}" data-skill-color="${s.color}" aria-label="Tótem 3D interactivo de ${esc(s.name)}">
              <div class="skill-scene-fallback skill-token skill-token--${s.color}" data-tilt>
                <span class="skill-token-num">${s.num}</span>
                ${icon(s.icon, "skill-token-icon")}
                <span class="skill-token-name">${esc(s.name.toUpperCase())}</span>
              </div>
            </div>
            <p class="viewer-hint" aria-hidden="true">Arrastra el tótem para girarlo ↻</p>
            <figure class="peter-quote">
              <img src="/assets/peter-curious.webp" alt="Peter comenta esta habilidad" width="1254" height="1254" loading="lazy" />
              <blockquote>«${esc(s.peter)}»</blockquote>
              <figcaption>— Peter</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section class="why section-pad">
        <div class="section-top"><p class="eyebrow">POR QUÉ SE APRENDE LEYENDO</p><span class="section-index">[ LO QUE TE LLEVAS ]</span></div>
        <ol class="why-list">${s.why.map((w, i) => `<li><span>0${i + 1}</span><p>${esc(w)}</p></li>`).join("")}</ol>
      </section>

      <section class="shelf-section section-pad" id="libros">
        <div class="section-heading">
          <h2>La estantería<br /><em>de ${esc(s.name.toLowerCase())}.</em></h2>
          <p>Elegidos por lo que enseñan, no por lo que venden. Empieza por el primero.</p>
        </div>
        <div class="product-grid">${bookCards}</div>
        <p class="fine shop-disclaimer">${esc(affiliateNote())}</p>
      </section>

      <section class="exercise section-pad" id="ejercicio">
        <p class="eyebrow">PRUÉBALO HOY · 10 MINUTOS</p>
        <p class="exercise-text">${esc(s.exercise)}</p>
        <a class="text-link" href="/laboratorio/">Llévalo al laboratorio ↗</a>
      </section>

      ${
        gadgetCards
          ? `<section class="gadget-section section-pad">
        <div class="section-heading"><h2>Para leer<br /><em>con menos fricción.</em></h2><p>Herramientas sencillas que hacen más fácil sentarse a leer y practicar.</p></div>
        <div class="product-grid product-grid--gadgets">${gadgetCards}</div>
      </section>`
          : ""
      }

      ${s.slug === "leer-mejor" ? "" : courseBand()}

      <nav class="skill-pager section-pad" aria-label="Otras habilidades">
        <a href="/habilidades/${prev.slug}/" class="pager-link"><span class="eyebrow">← ANTERIOR</span><strong>${esc(prev.name)}</strong></a>
        <a href="/habilidades/" class="pager-all">Todas las habilidades</a>
        <a href="/habilidades/${next.slug}/" class="pager-link pager-next"><span class="eyebrow">SIGUIENTE →</span><strong>${esc(next.name)}</strong></a>
      </nav>`;
  return {
    path: `habilidades/${s.slug}/index.html`,
    html: layout({
      title: `${s.name}: libros y ejercicios para aprender — LectorLab`,
      description: `${s.short} Libros recomendados, por qué leerlos y un ejercicio para empezar hoy.`,
      path: `/habilidades/${s.slug}/`,
      entry: "/src/site.js",
      active: "skills",
      page: "skill",
      body,
    }),
  };
}

/* ================================================================== */
/* TIENDA                                                              */
/* ================================================================== */
function shop() {
  const items = [notebooks, ...books, ...gadgets];
  const typeFilters = [
    ["all", "Todo"],
    ["course", "Cursos"],
    ["notebook", "Cuadernos"],
    ["book", "Libros"],
    ["gadget", "Gadgets"],
  ]
    .map(([v, l], i) => `<button type="button" class="filter-btn" data-filter-type="${v}" aria-pressed="${i === 0}">${l}</button>`)
    .join("");
  const skillOptions = skills.map((s) => `<option value="${s.slug}">${esc(s.name)}</option>`).join("");
  const body = `
      <section class="page-hero shop-hero section-pad">
        <nav class="crumbs" aria-label="Migas"><a href="/">Inicio</a><span>/</span><span aria-current="page">Tienda</span></nav>
        <div class="page-hero-grid">
          <div>
            <p class="eyebrow">LA TIENDA DE LECTORLAB</p>
            <h1 class="page-title">La tienda del lector<br /><em>que aprende haciendo.</em></h1>
          </div>
          <p class="page-lead">Cuadernos para acompañar tu lectura, un curso en desarrollo, libros por habilidad y accesorios para crear tu rincón lector.</p>
        </div>
      </section>

      <section class="shop-featured section-pad" aria-labelledby="featured-title">
        <article class="featured-course" data-type="course" data-skills="leer-mejor">
          <div class="featured-media">${courseBox()}</div>
          <div class="featured-copy">
            <p class="eyebrow">${esc(course.kicker)} · PRODUCTO PROPIO</p>
            <h2 id="featured-title">${esc(course.title)}</h2>
            <p>${esc(course.short)}</p>
            <div class="price"><strong>${esc(priceLabel())}</strong><p>${course.checkoutUrl ? "Pago único." : "Precio previsto de lanzamiento. Curso en desarrollo; venta no abierta."}</p></div>
            <a class="btn" href="/tienda/curso-lectura-rapida/">Ver el curso <span aria-hidden="true">↗</span></a>
          </div>
        </article>
      </section>

      <section class="shop-catalog section-pad" aria-labelledby="catalog-title">
        <h2 id="catalog-title" class="visually-hidden">Catálogo</h2>
        <div class="filter-bar" role="search" aria-label="Filtrar productos">
          <div class="filter-group" role="group" aria-label="Tipo de producto">${typeFilters}</div>
          <label class="filter-select"><span>Habilidad</span>
            <select id="filter-skill"><option value="all">Todas</option>${skillOptions}</select>
          </label>
          <p class="filter-count" id="filter-count" role="status" aria-live="polite">${items.length + 1} productos</p>
        </div>
        <div class="product-grid" id="product-grid">${items.map((p) => productCard(p)).join("")}</div>
        <p class="filter-empty" id="filter-empty" hidden>No hay productos con esos filtros todavía. <button type="button" class="text-link" id="filter-reset">Ver todo</button></p>
        <p class="fine shop-disclaimer">${esc(affiliateNote())} <a href="/afiliados/">Más información</a>.</p>
      </section>`;
  return {
    path: "tienda/index.html",
    html: layout({
      title: "Tienda — Curso de lectura rápida, libros y gadgets | LectorLab",
      description: "Curso de lectura rápida y estratégica, libros recomendados por habilidad y gadgets de lectura. Elige qué quieres aprender y empieza.",
      path: "/tienda/",
      entry: "/src/site.js",
      active: "shop",
      page: "shop",
      body,
    }),
  };
}

/* ================================================================== */
/* CURSO                                                               */
/* ================================================================== */
function coursePage() {
  const related = getSkill("leer-mejor").books.map((id) => productCard(getProduct(id))).join("");
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.short,
    provider: { "@type": "Organization", name: "LectorLab" },
    inLanguage: "es",
  };
  const body = `
      <section class="page-hero course-hero section-pad">
        <nav class="crumbs" aria-label="Migas"><a href="/">Inicio</a><span>/</span><a href="/tienda/">Tienda</a><span>/</span><span aria-current="page">Curso</span></nav>
        <div class="page-hero-grid">
          <div>
            <p class="eyebrow">${esc(course.kicker)} · LA LLAVE MAESTRA</p>
            <h1 class="page-title">Lectura rápida<br /><em>y estratégica.</em></h1>
            <p class="page-lead">${esc(course.short)}</p>
            <ul class="check-list">${course.promises.map((p, i) => `<li><span>0${i + 1}</span> ${esc(p)}</li>`).join("")}</ul>
            <div class="price"><strong>${esc(priceLabel())}</strong><p>${course.checkoutUrl ? "Pago único. Acceso a tu ritmo." : "Precio previsto de lanzamiento. Curso en desarrollo; venta no abierta."}</p></div>
            <div class="hero-actions">${courseCta()}</div>
          </div>
          <div class="course-viewer-wrap">
            <div class="course-scene course-scene--large" id="course-scene" aria-hidden="true">${courseBox()}</div>
            <p class="viewer-hint" aria-hidden="true">Arrastra para girar · representación digital del curso</p>
          </div>
        </div>
      </section>

      <section class="syllabus section-pad" id="temario">
        <div class="section-top"><p class="eyebrow">TEMARIO PROPUESTO · EN REVISIÓN</p><span class="section-index">[ ${course.modules.length} MÓDULOS ]</span></div>
        <div class="section-heading"><h2>Lo que vas<br /><em>a entrenar.</em></h2><p>Módulos cortos y prácticos. Cada uno termina con un ejercicio sobre un libro que tú elijas.</p></div>
        <ol class="module-list">${course.modules
          .map(([t, d], i) => `<li class="module"><span class="module-num">${String(i + 1).padStart(2, "0")}</span><h3>${esc(t)}</h3><p>${esc(d)}</p></li>`)
          .join("")}</ol>
      </section>

      <section class="honesty section-pad">
        <div class="honesty-card">
          <p class="eyebrow">LO QUE NO TE PROMETEMOS</p>
          <h2>Ni 1.000 palabras por minuto<br /><em>ni magia.</em></h2>
          <p>${esc(course.limits)}</p>
        </div>
        <figure class="peter-quote peter-quote--large">
          <img src="/assets/peter-portrait.webp" alt="" width="1254" height="1254" loading="lazy" />
          <blockquote>«${esc(course.peterNote)}»</blockquote>
          <figcaption>— Peter</figcaption>
        </figure>
      </section>

      <section class="shelf-section section-pad">
        <div class="section-heading"><h2>Para practicar<br /><em>lo aprendido.</em></h2><p>Tres libros sobre cómo leer y aprender. Buenos compañeros del curso.</p></div>
        <div class="product-grid">${related}</div>
        <p class="fine shop-disclaimer">${esc(affiliateNote())}</p>
      </section>`;
  return {
    path: "tienda/curso-lectura-rapida/index.html",
    html: layout({
      title: "Curso de lectura rápida y estratégica — LectorLab",
      description: "Aprende a leer con un objetivo, avanzar más rápido por lo que ya sabes y recordar lo que importa. Curso práctico de LectorLab.",
      path: "/tienda/curso-lectura-rapida/",
      entry: "/src/site.js",
      active: "course",
      page: "course",
      extraHead: `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`,
      body,
    }),
  };
}

/* ================================================================== */
/* LABORATORIO (cuaderno gratuito, lógica en src/notebook.js)          */
/* ================================================================== */
function lab() {
  const body = `
      <section class="page-hero section-pad">
        <nav class="crumbs" aria-label="Migas"><a href="/">Inicio</a><span>/</span><span aria-current="page">Laboratorio</span></nav>
        <div class="page-hero-grid">
          <div>
            <p class="eyebrow">GRATIS · SIN REGISTRO</p>
            <h1 class="page-title">El laboratorio.<br /><em>De la idea a la acción.</em></h1>
          </div>
          <p class="page-lead">Elige una pregunta, abre una lectura y pon una idea a prueba durante siete días. Tus notas no salen de tu navegador.</p>
        </div>
      </section>
      <section class="questions section-pad" id="rutas">
        <div class="section-top"><p class="eyebrow">01 / ALGO TE ESTÁ DANDO VUELTAS</p><span class="section-index">[ ELIGE TU PREGUNTA ]</span></div>
        <div class="route-tabs" role="tablist" aria-label="Temas de lectura">
          <button role="tab" id="tab-money" aria-controls="route-panel" aria-selected="true" data-route="money"><span class="tab-num">01</span><span>¿Lo quieres o quieres<br />que lo vean?</span><span class="tab-topic">DINERO</span><span aria-hidden="true">↗</span></button><button role="tab" id="tab-relations" aria-controls="route-panel" aria-selected="false" tabindex="-1" data-route="relations"><span class="tab-num">02</span><span>¿Qué necesitas<br />poder decir?</span><span class="tab-topic">RELACIONES Y DESEO</span><span aria-hidden="true">↗</span></button><button role="tab" id="tab-attention" aria-controls="route-panel" aria-selected="false" tabindex="-1" data-route="attention"><span class="tab-num">03</span><span>¿Qué puedes hacer<br />un poco más fácil?</span><span class="tab-topic">ATENCIÓN Y HÁBITOS</span><span aria-hidden="true">↗</span></button>
        </div>
        <div class="route-panel" id="route-panel" role="tabpanel" aria-labelledby="tab-money" tabindex="0">
          <div class="book-scene">
            <div class="editorial-book" aria-hidden="true"><span class="book-publisher">UNA LECTURA PARA EXPLORAR / 01</span><span id="book-title">La psicología<br />del dinero</span><div class="book-line"></div><span id="book-author">MORGAN HOUSEL</span><i>LL.</i></div>
            <p class="cover-note">Interpretación gráfica. No es la portada editorial.</p>
          </div>
          <div class="route-copy">
            <p id="route-label" class="eyebrow">RUTA 01 · DINERO CON CRITERIO</p>
            <h2 class="route-question" id="route-question">¿Lo quieres o quieres<br />que lo vean?</h2>
            <p id="route-description">Una lectura para explorar tu relación con el dinero y las expectativas que pones en él.</p>
            <div class="try-box"><span class="eyebrow">PON LA IDEA A PRUEBA</span><p id="route-exercise">Piensa en una compra reciente. Si nadie pudiera enterarse de que la tienes, ¿la seguirías queriendo?</p></div>
            <div class="route-links"><button id="use-route" class="btn">Llévala al cuaderno <span aria-hidden="true">↗</span></button><a id="book-link" class="text-link" href="https://www.planetadelibros.com/libro-la-psicologia-del-dinero/334390?soporte=336728" target="_blank" rel="noopener noreferrer">Libro y autor ↗</a></div>
            <p class="fine" id="route-limit">Pregunta original de LectorLab; no es una cita del autor ni asesoramiento financiero. Libro no incluido.</p>
          </div>
        </div>
      </section>
      <section class="lab section-pad" id="laboratorio">
        <div class="section-top"><p class="eyebrow">02 / TU TURNO</p><span class="pill pill-outline">GRATIS · SIN REGISTRO</span></div>
        <div class="section-heading"><h2>Deja de guardarlo.<br /><em>Empieza a usarlo.</em></h2><p>Elige una pregunta. Dedícale diez minutos.<br />Escribe lo que descubras y llévatelo contigo.</p></div>
        <div class="workbook">
          <aside class="workbook-sidebar">
            <div class="peter-guide"><img src="/assets/peter-curious.webp" alt="Peter presenta el cuaderno" width="1254" height="1254" loading="lazy" /><p>Una pregunta cada vez.<br /><strong>Yo te acompaño.</strong></p></div>
            <p class="eyebrow">TU CUADERNO · MUESTRA DE 7 DÍAS</p>
            <h3>De la idea<br />a la acción.</h3>
            <label for="topic">Elige tu punto de partida</label><select id="topic"><option value="money">Dinero con criterio</option><option value="relations">Relaciones y deseo</option><option value="attention">Atención y hábitos</option></select>
            <div class="day-list" role="group" aria-label="Días de la muestra"></div>
            <div class="progress-track" role="progressbar" aria-label="Días completados" aria-valuemin="0" aria-valuemax="7" aria-valuenow="0"><span id="progress-fill"></span></div>
            <p class="fine" id="progress-label">0 de 7 días marcados</p>
          </aside>
          <div class="workbook-page">
            <div class="page-top"><span class="eyebrow" id="day-number">DÍA 01 / 07</span><span class="notebook-mark">LL /</span></div>
            <h3 id="day-title">Empieza con una pregunta.</h3>
            <p id="day-prompt">Escribe una decisión de consumo que quieras entender. Hazla concreta y bajo tu control.</p>
            <label for="note" class="eyebrow note-label">TU RESPUESTA, CON TUS PALABRAS</label><textarea id="note" rows="6" maxlength="6000" placeholder="Quiero entender por qué…"></textarea><label class="check-line"><input type="checkbox" id="complete" /> He trabajado esta pregunta</label>
            <div class="notebook-actions"><button id="prev-day" class="outline-button" disabled>← Anterior</button><button id="next-day" class="button small">Siguiente día →</button></div>
            <div id="workbook-status" class="status" role="status" aria-live="polite"></div>
          </div>
        </div>
        <div class="notebook-footer">
          <div><label class="check-line"><input type="checkbox" id="remember" /> Guardar mis notas en este navegador</label><p class="fine">Opcional. No se envían a LectorLab. Exporta una copia antes de borrar datos.</p></div>
          <div class="export-actions"><button id="export" class="text-link">Descargar mis notas ↓</button><button id="reset" class="subtle-link">Borrar cuaderno</button></div>
        </div>
      </section>`;
  const dialog = `<dialog id="reset-dialog">
      <form method="dialog">
        <p class="eyebrow">TU CUADERNO</p>
        <h3>¿Borrar todas las notas?</h3>
        <p>Se eliminarán las respuestas y el progreso de las tres rutas de este navegador. Descarga una copia si quieres conservarlas.</p>
        <div class="dialog-actions"><button class="outline-button" value="cancel">Conservar</button><button class="btn" value="erase">Borrar cuaderno</button></div>
      </form>
    </dialog>`;
  return {
    path: "laboratorio/index.html",
    html: layout({
      title: "Laboratorio gratis: de la idea a la acción — LectorLab",
      description: "Cuaderno gratuito de siete días para convertir una lectura en una acción. Sin registro; tus notas se quedan en tu navegador.",
      path: "/laboratorio/",
      entry: "/src/lab.js",
      active: "lab",
      page: "lab",
      body,
      after: dialog,
    }),
  };
}

/* ================================================================== */
/* AFILIADOS Y 404                                                     */
/* ================================================================== */
function affiliates() {
  const body = `
      <section class="page-hero section-pad">
        <nav class="crumbs" aria-label="Migas"><a href="/">Inicio</a><span>/</span><span aria-current="page">Enlaces y afiliados</span></nav>
        <p class="eyebrow">TRANSPARENCIA</p>
        <h1 class="page-title">Cómo ganamos dinero<br /><em>(y cómo no).</em></h1>
        <div class="prose">
          <p>LectorLab recomienda libros y gadgets que enlazan a tiendas externas como Amazon. ${
            isAffiliate()
              ? "Participamos en el Programa de Afiliados de Amazon EU: si compras desde nuestros enlaces, podemos recibir una comisión sin coste adicional para ti."
              : "En esta versión los enlaces no generan comisión. Si en el futuro lo hacen, lo indicaremos en cada ficha y en esta página."
          }</p>
          <p>Elegimos las recomendaciones por lo que enseñan, no por la comisión. No publicamos reseñas inventadas ni precios que no podamos mantener actualizados.</p>
          <p>Nuestros productos propios son los cuadernos de lectura (edición de prueba) y el curso de lectura rápida y estratégica (en desarrollo). La venta aún no está abierta. Los libros destacados muestran las portadas de sus ediciones enlazadas. El resto de portadas tipográficas son interpretaciones gráficas de LectorLab.</p>
          <a class="text-link" href="/tienda/">Volver a la tienda ↗</a>
        </div>
      </section>`;
  return {
    path: "afiliados/index.html",
    html: layout({
      title: "Enlaces y afiliados — LectorLab",
      description: "Cómo funcionan los enlaces de LectorLab a tiendas externas y nuestra política de recomendaciones.",
      path: "/afiliados/",
      entry: "/src/site.js",
      page: "legal",
      body,
    }),
  };
}

function notFound() {
  const body = `
      <section class="page-hero not-found section-pad">
        <p class="eyebrow">ERROR 404</p>
        <h1 class="page-title">Esta página<br /><em>no está escrita.</em></h1>
        <p class="page-lead">Todavía. Mientras tanto, elige una habilidad o vuelve al inicio.</p>
        <div class="hero-actions"><a class="btn" href="/habilidades/">Ver habilidades <span aria-hidden="true">↗</span></a><a class="text-link" href="/">Inicio ↗</a></div>
      </section>`;
  return {
    path: "404.html",
    html: layout({
      title: "Página no encontrada — LectorLab",
      description: "Esta página no existe.",
      path: "/404.html",
      entry: "/src/site.js",
      page: "404",
      body,
    }),
  };
}

export function allPages() {
  return [home(), notebooksPage(), skillsHub(), ...skills.map(skillPage), shop(), coursePage(), lab(), affiliates(), notFound()];
}

function notebooksPage() {
  const body = `<section class="page-hero notebook-hero section-pad">
    <nav class="crumbs" aria-label="Migas"><a href="/">Inicio</a><span>/</span><a href="/tienda/">Tienda</a><span>/</span><span aria-current="page">Cuadernos</span></nav>
    <div class="page-hero-grid"><div><p class="eyebrow">EL PODER DE ENTENDER · EDICIÓN DE PRUEBA</p><h1 class="page-title">Lee y<br><em>hazlo tuyo.</em></h1><p class="page-lead">${esc(notebooks.short)}</p><div class="price"><strong>${esc(notebooks.price)}</strong><p>${esc(notebooks.priceNote)}. Venta aún no abierta.</p></div><a class="btn" href="/laboratorio/">Prueba el laboratorio gratis ↗</a></div><div class="notebook-display">${notebookBox()}</div></div>
  </section><section class="section-pad notebook-includes"><div class="section-heading"><h2>Dos cuadernos.<br><em>Tu propia forma de leer.</em></h2><p>60 páginas en total, en PDF para imprimir o anotar con una aplicación compatible. No son formularios interactivos. El libro de lectura se consigue por separado.</p></div><div class="module-list">${notebooks.includes.map(([t,d],i)=>`<article class="module"><span class="module-num">0${i+1}</span><h3>${esc(t)}</h3><p>${esc(d)}</p></article>`).join('')}</div><div class="notebook-details"><h3>Qué necesitas</h3><p>Tu libro, lápiz y un poco de curiosidad. Los cuadernos están preparados para imprimir en A4, a doble cara y con giro por el borde largo. Puedes repetir o adaptar las propuestas.</p><h3>Qué puedes probar hoy</h3><p>El laboratorio web es un ejercicio gratuito de siete días para conocer nuestro enfoque. Tiene su propio recorrido: no es una reproducción de estos PDF ni exige completar el pack.</p><a class="text-link" href="/laboratorio/">Abre el laboratorio ↗</a></div></section>`;
  return {path:"tienda/cuadernos-lectorlab/index.html",html:layout({title:"Cuadernos LectorLab — Lee y hazlo tuyo",description:notebooks.short,path:"/tienda/cuadernos-lectorlab/",body,entry:"/src/site.js",page:"notebooks",active:"shop"})};
}
