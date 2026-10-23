/**
 * Plantillas de página. Cada función devuelve { path, html }.
 * `path` es el archivo de salida relativo a la raíz del proyecto.
 */
import { skills, course, books, gadgets, getProduct, getSkill, isAffiliate } from "../../src/data/catalog.js";
import { esc, icon, layout, bookCover, courseBox, productCard, skillCard, skillChip } from "./ui.mjs";

const featuredBooks = ["habitos-atomicos", "influencia", "charlas-ted", "el-mundo-y-sus-demonios"];
const affiliateNote = () =>
  isAffiliate()
    ? "Algunos enlaces son de afiliado: si compras, LectorLab puede recibir una comisión sin coste extra para ti. Portadas: interpretación gráfica, no la portada editorial."
    : "Los enlaces llevan a tiendas externas. Portadas: interpretación gráfica, no la portada editorial.";
const priceLabel = () => course.price || "Precio por anunciar";
const courseCta = (id = "course-cta") =>
  course.checkoutUrl
    ? `<a class="btn btn-lime" id="${id}" href="${esc(course.checkoutUrl)}" rel="noopener">Comprar el curso <span aria-hidden="true">↗</span></a>`
    : `<a class="btn btn-lime" id="${id}" href="/tienda/curso-lectura-rapida/#temario">Ver el temario <span aria-hidden="true">↗</span></a>`;

/* ================================================================== */
/* HOME                                                                */
/* ================================================================== */
function home() {
  const badges = skills
    .map((s, i) => `<span class="orbit-badge orbit-badge--${s.color}" style="--i:${i};--n:${skills.length}">${icon(s.icon)}</span>`)
    .join("");
  const chips = skills.map((s) => `<li>${skillChip(s)}</li>`).join("");
  const cards = skills.map((s) => skillCard(s)).join("");
  const shopItems = [...featuredBooks.map(getProduct), getProduct("e-reader"), getProduct("lampara"), getProduct("temporizador")]
    .map((p) => productCard(p))
    .join("");

  const body = `
      <section class="hero hero-v2 section-pad" id="inicio">
        <div class="hero-top">
          <p class="eyebrow"><span class="status-dot"></span> LA LECTURA CONSTRUYE HABILIDADES</p>
          <span class="eyebrow hero-edition">VOL. 02 / APRENDE LO QUE QUIERAS</span>
        </div>
        <div class="hero-layout">
          <div class="hero-copy">
            <h1><span>Cualquier</span><br /><span>habilidad</span><br /><span>empieza en</span><br /><em>una página.</em><span class="headline-star" aria-hidden="true">✳</span></h1>
            <p class="hero-lead">Hablar en público. Vender. Negociar. Hasta lanzar un cohete a la Luna. Todo lo que quieres aprender ya lo escribió alguien: te ayudamos a encontrarlo, leerlo mejor y ponerlo en práctica.</p>
            <div class="hero-actions">
              <a href="#habilidades" class="btn btn-lime" id="hero-cta">Elige tu habilidad <span aria-hidden="true">↗</span></a>
              <a href="/tienda/" class="text-link" id="hero-shop">Ver la tienda ↗</a>
            </div>
            <div class="hero-peter-badge">
              <div class="peter-badge-avatar">
                <img src="/assets/peter-reading-v2.webp" alt="Peter, la nutria de LectorLab" width="80" height="80" fetchpriority="high" />
              </div>
              <div class="peter-badge-content">
                <p class="peter-badge-quote">«Elige una habilidad. Yo te enseño el libro para empezar hoy.»</p>
                <span class="peter-badge-author">— Peter · aprendiz de LectorLab</span>
              </div>
            </div>
          </div>
          <div class="skills-visual" id="skills-visual">
            <div class="skills-scene" id="skills-scene" aria-label="Escena 3D interactiva del libro de habilidades">
              <div class="skills-fallback">
                <div class="fallback-book">
                  <div class="fallback-cover"><span>lectorlab / 02</span><strong>CUALQUIER<br />HABILIDAD<br />ESTÁ<br />ESCRITA.</strong><small>ELIGE. LEE. PRACTICA.</small></div>
                  <div class="fallback-pages"></div>
                </div>
                <div class="orbit-badges">${badges}</div>
              </div>
            </div>
            <div class="scene-hint" aria-hidden="true">
              <span class="scene-hint-badge">3D INTERACTIVO</span>
              <span>Gira el libro · Toca los iconos para explorar</span>
            </div>
          </div>
        </div>
        <div class="hero-skills-strip" aria-label="Explora por habilidad">
          <div class="strip-header">
            <span class="eyebrow"><span class="mini-star" aria-hidden="true">✳</span> EXPLORA POR HABILIDAD</span>
            <span class="strip-count">[ ${skills.length} ÁREAS ]</span>
          </div>
          <ul class="skill-chips">${chips}</ul>
        </div>
        <div class="hero-bottom">
          <span><span class="mini-star" aria-hidden="true">✳</span> Para curiosos que quieren aprender haciendo.</span>
          <a href="#habilidades">TIRA DEL HILO <span aria-hidden="true">↓</span></a>
          <span>LA LECTURA CONSTRUYE HABILIDADES / LECTORLAB</span>
        </div>
      </section>

      <div class="marquee" aria-hidden="true">
        <div class="marquee-track">
          <span>LEE. APRENDE. HAZLO.</span><i>✳</i><span>CUALQUIER HABILIDAD ESTÁ ESCRITA.</span><i>✳</i><span>LEE. APRENDE. HAZLO.</span><i>✳</i><span>CUALQUIER HABILIDAD ESTÁ ESCRITA.</span><i>✳</i>
        </div>
      </div>

      <section class="skills-section section-pad" id="habilidades">
        <div class="section-top">
          <p class="eyebrow">01 / ¿QUÉ QUIERES APRENDER?</p>
          <span class="section-index">[ ${skills.length} HABILIDADES · Y CONTANDO ]</span>
        </div>
        <div class="section-heading">
          <h2>Elige una habilidad.<br /><em>Te damos el libro.</em></h2>
          <p>Cada habilidad tiene su estantería, un ejercicio para empezar hoy y las herramientas que hacen más fácil leer.</p>
        </div>
        <div class="skill-grid">${cards}</div>
      </section>

      <section class="rocket-section section-pad" id="cohete" aria-labelledby="rocket-title">
        <div class="rocket-copy">
          <p class="eyebrow">02 / EL PODER DEL CONOCIMIENTO</p>
          <h2 id="rocket-title">…hasta lanzar<br />un cohete<br /><em>a la Luna.</em></h2>
          <p>Ningún cohete despegó sin libros. Física, matemáticas, errores documentados: cada logro humano quedó escrito para que alguien lo continuara. Lo que otros aprendieron en décadas, tú puedes leerlo en semanas.</p>
          <a class="text-link text-link--light" href="/habilidades/pensar-como-cientifico/">Pensar como un científico ↗</a>
        </div>
        <div class="rocket-stage" aria-hidden="true">
          <svg class="rocket-svg" viewBox="0 0 600 600">
            <circle class="moon" cx="500" cy="100" r="62" />
            <circle class="moon-crater" cx="480" cy="85" r="10" />
            <circle class="moon-crater" cx="520" cy="118" r="7" />
            <path id="rocket-path" class="rocket-path" d="M60 560 C 120 380, 300 420, 330 280 S 430 120, 470 140" />
            <g class="stars"><circle cx="90" cy="90" r="2"/><circle cx="220" cy="60" r="1.5"/><circle cx="330" cy="140" r="2"/><circle cx="560" cy="260" r="1.5"/><circle cx="160" cy="250" r="1.5"/><circle cx="420" cy="330" r="2"/><circle cx="540" cy="470" r="1.5"/></g>
            <g id="rocket" class="rocket">
              <path class="rocket-flame" d="M-9 22 L0 46 L9 22 Z" />
              <path class="rocket-body" d="M0 -38 C 14 -26, 16 -6, 14 22 L -14 22 C -16 -6, -14 -26, 0 -38 Z" />
              <circle class="rocket-window" cx="0" cy="-8" r="6" />
              <path class="rocket-fin" d="M-14 8 L -26 26 L -14 22 Z M14 8 L 26 26 L 14 22 Z" />
            </g>
          </svg>
        </div>
      </section>

      <section class="method-section" id="metodo">
        <div class="method-frame section-pad">
          <div class="section-top">
            <p class="eyebrow">03 / DEL LIBRO A LA HABILIDAD</p>
            <span class="section-index">[ LEER NO BASTA ]</span>
          </div>
          <div class="method-layout">
            <div class="method-left">
              <h2>Leer no basta.<br /><em>Hay que entrenar.</em></h2>
              <div class="method-object" aria-hidden="true">
                <div class="note-sheet"><span>MI PRÓXIMA HABILIDAD / LL.</span><strong>¿Qué sabré<br />hacer <i>después<br />de leer?</i></strong><span class="note-arrow">↗</span></div>
                <span class="method-scribble">Practícalo hoy.</span>
              </div>
            </div>
            <div class="method-right">
              <article class="method-step"><span>01 /</span><h3>Elige una habilidad.</h3><p>Algo concreto que quieras saber hacer: presentar un proyecto, negociar un precio, entender un tema desde cero.</p><blockquote>«Quiero hablar en público sin bloquearme.»</blockquote></article>
              <article class="method-step"><span>02 /</span><h3>Lee con un objetivo.</h3><p>Elige el libro adecuado, ve a los capítulos que responden a tu objetivo y explica la idea con tus palabras.</p><blockquote>«¿Qué técnica puedo probar esta semana?»</blockquote></article>
              <article class="method-step"><span>03 /</span><h3>Practica algo pequeño.</h3><p>Una acción reversible, un minuto grabado, una conversación. Observa qué pasa y ajusta.</p><blockquote>«¿Qué hago distinto ahora?»</blockquote></article>
            </div>
          </div>
        </div>
      </section>

      <section class="master-section section-pad" id="curso">
        <div class="master-visual">
          <div class="course-scene" id="course-scene" aria-hidden="true">${courseBox()}</div>
          <span class="master-sticker" aria-hidden="true">LA HABILIDAD<br />QUE DESBLOQUEA<br />TODAS.</span>
        </div>
        <div class="master-copy">
          <p class="eyebrow">04 / LA LLAVE MAESTRA</p>
          <h2>Lee mejor.<br /><em>Aprende todo lo demás más rápido.</em></h2>
          <p>${esc(course.short)} Es nuestro curso propio y el punto de partida de cualquier habilidad.</p>
          <ul class="check-list">${course.promises.map((p, i) => `<li><span>0${i + 1}</span> ${esc(p)}</li>`).join("")}</ul>
          <div class="price"><strong>${esc(priceLabel())}</strong><p>${course.checkoutUrl ? "Pago único. Acceso a tu ritmo." : "La compra se abrirá cuando el curso esté listo."}</p></div>
          <div class="master-actions">
            <a class="btn btn-lime" href="/tienda/curso-lectura-rapida/" id="master-cta">Conoce el curso <span aria-hidden="true">↗</span></a>
          </div>
          <p class="fine">${esc(course.limits)}</p>
        </div>
      </section>

      <section class="shop-teaser section-pad" id="tienda">
        <div class="section-top">
          <p class="eyebrow">05 / LA TIENDA</p>
          <a class="section-index text-link" href="/tienda/">VER TODO ↗</a>
        </div>
        <div class="section-heading">
          <h2>Libros y gadgets<br /><em>que sí vas a usar.</em></h2>
          <p>Cada recomendación tiene un porqué: a quién sirve, qué habilidad entrena y qué puedes hacer con ella.</p>
        </div>
        <div class="product-rail">${shopItems}</div>
        <p class="fine shop-disclaimer">${esc(affiliateNote())}</p>
      </section>

      <section class="lab-teaser section-pad" id="laboratorio-teaser">
        <div class="lab-teaser-peter"><img src="/assets/peter-explaining-v1.webp" alt="Peter explica el laboratorio con una pata levantada" width="1254" height="1254" loading="lazy" /></div>
        <div class="lab-teaser-copy">
          <p class="eyebrow">06 / GRATIS · SIN REGISTRO</p>
          <h2>Prueba el método<br /><em>en diez minutos.</em></h2>
          <p>Un cuaderno de siete días para pasar de una lectura a una acción. Tus notas se quedan en tu navegador.</p>
          <a class="btn btn-lime" href="/laboratorio/" id="lab-cta">Abre el laboratorio <span aria-hidden="true">↗</span></a>
        </div>
      </section>

      <section class="peter section-pad" id="peter">
        <div class="peter-portrait"><img src="/assets/peter-explaining-v1.webp" alt="Peter, el personaje de LectorLab, sostiene su libro y levanta una pata para explicar una idea" width="1254" height="1254" loading="lazy" /></div>
        <div class="peter-copy">
          <p class="eyebrow">LECTORLAB ES LA MARCA. PETER, TU COMPAÑERO.</p>
          <h2>Peter también<br /><em>está aprendiendo.</em></h2>
          <p>Curioso, un poco escéptico y sin respuestas mágicas. Peter prueba lo que lee: a veces sale bien y a veces no, y siempre cuenta qué aprendió.</p>
          <p>Detrás de LectorLab está Nicolás, su creador. Peter pone la curiosidad. Las habilidades las construimos leyendo y practicando.</p>
          <a href="#habilidades" class="text-link">Vuelve a las habilidades <span aria-hidden="true">↗</span></a>
        </div>
        <span class="peter-stamp" aria-hidden="true">SIEMPRE<br />EN MODO<br />APRENDIZ.</span>
      </section>

      <section class="faq section-pad" id="faq">
        <div><p class="eyebrow">SIN LETRA PEQUEÑA</p><h2>Eso que<br /><em>te preguntas.</em></h2></div>
        <div class="faq-items">
          <details><summary>¿De verdad se puede aprender cualquier habilidad leyendo?</summary><p>Leer te da el mapa: lo que otros descubrieron, sus errores y sus métodos. La práctica te lleva por el camino. Por eso cada habilidad incluye un ejercicio para empezar hoy.</p></details>
          <details><summary>¿LectorLab vende libros?</summary><p>Recomendamos libros y gadgets que se compran en tiendas externas. ${isAffiliate() ? "Algunos enlaces son de afiliado y pueden generarnos una comisión sin coste para ti." : ""} Nuestro producto propio es el curso de lectura rápida y estratégica.</p></details>
          <details><summary>¿La lectura rápida funciona?</summary><p>Leer más rápido suele tener un coste en comprensión. Por eso no prometemos cifras de palabras por minuto: enseñamos a ajustar la velocidad a tu objetivo, a saltar lo que ya sabes y a frenar donde está lo importante.</p></details>
          <details><summary>¿Cuándo puedo comprar el curso?</summary><p>${course.checkoutUrl ? "Ya está disponible desde su página." : "Estamos terminando el curso. El temario propuesto ya está publicado y la compra se abrirá cuando esté listo."}</p></details>
          <details><summary>¿Los libros tienen todas las respuestas?</summary><p>No. Contienen perspectivas valiosas y también errores o límites. Leer no sustituye la ayuda profesional cuando una situación la requiere.</p></details>
        </div>
      </section>

      <section class="closing section-pad">
        <p class="eyebrow">LA PRÓXIMA HABILIDAD NO SE VA A LEER SOLA.</p>
        <h2>Abre un libro.<br /><em>Aprende algo.</em><span aria-hidden="true">↗</span></h2>
        <a class="btn" href="#habilidades" id="closing-cta">Elige tu habilidad <span aria-hidden="true">↗</span></a><span class="closing-note">LEE. APRENDE. HAZLO.</span>
      </section>`;

  return {
    path: "index.html",
    html: layout({
      title: "LectorLab — La lectura construye habilidades",
      description:
        "Aprende a hablar en público, vender, negociar o pensar como un científico leyendo. Libros recomendados por habilidad, gadgets de lectura y un curso de lectura rápida y estratégica.",
      path: "/",
      entry: "/src/main.js",
      page: "home",
      body,
    }),
  };
}

/* ================================================================== */
/* HABILIDADES · HUB                                                   */
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
            <h1 class="page-title">Todo se puede<br /><em>aprender leyendo.</em></h1>
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
            <div class="skill-scene-3d" id="skill-scene" data-skill-icon="${s.icon}" data-skill-color="${s.color}" aria-label="Tótem 3D interactivo de ${esc(s.name)}">
              <div class="skill-scene-fallback skill-token skill-token--${s.color}" data-tilt>
                <span class="skill-token-num">${s.num}</span>
                ${icon(s.icon, "skill-token-icon")}
                <span class="skill-token-name">${esc(s.name.toUpperCase())}</span>
              </div>
            </div>
            <p class="viewer-hint" aria-hidden="true">Arrastra el tótem para girarlo ↻</p>
            <figure class="peter-quote">
              <img src="/assets/peter-explaining-v1.webp" alt="Peter comenta esta habilidad" width="1254" height="1254" loading="lazy" />
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
  const items = [...books, ...gadgets];
  const typeFilters = [
    ["all", "Todo"],
    ["course", "Cursos"],
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
          <p class="page-lead">Un curso propio para leer mejor, libros elegidos por habilidad y gadgets que hacen más fácil leer cada día.</p>
        </div>
      </section>

      <section class="shop-featured section-pad" aria-labelledby="featured-title">
        <article class="featured-course" data-type="course" data-skills="leer-mejor">
          <div class="featured-media">${courseBox()}</div>
          <div class="featured-copy">
            <p class="eyebrow">${esc(course.kicker)} · PRODUCTO PROPIO</p>
            <h2 id="featured-title">${esc(course.title)}</h2>
            <p>${esc(course.short)}</p>
            <div class="price"><strong>${esc(priceLabel())}</strong><p>${course.checkoutUrl ? "Pago único." : "Compra próximamente."}</p></div>
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
          <p class="filter-count" id="filter-count" role="status" aria-live="polite">${items.length} productos</p>
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
            <div class="price"><strong>${esc(priceLabel())}</strong><p>${course.checkoutUrl ? "Pago único. Acceso a tu ritmo." : "La compra se abrirá cuando el curso esté listo."}</p></div>
            <div class="hero-actions">${courseCta()}</div>
          </div>
          <div class="course-viewer-wrap">
            <div class="course-scene course-scene--large" id="course-scene" aria-hidden="true">${courseBox()}</div>
            <p class="viewer-hint" aria-hidden="true">Arrastra para girar ↻</p>
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
          <img src="/assets/peter-reading-v2.webp" alt="" width="1254" height="1254" loading="lazy" />
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
            <div class="peter-guide"><img src="/assets/peter-explaining-v1.webp" alt="Peter presenta el cuaderno" width="1254" height="1254" loading="lazy" /><p>Una pregunta cada vez.<br /><strong>Yo te acompaño.</strong></p></div>
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
          <p>Nuestro producto propio es el curso de lectura rápida y estratégica. Las portadas de libros son interpretaciones gráficas de LectorLab, no las portadas editoriales.</p>
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
  return [home(), skillsHub(), ...skills.map(skillPage), shop(), coursePage(), lab(), affiliates(), notFound()];
}
