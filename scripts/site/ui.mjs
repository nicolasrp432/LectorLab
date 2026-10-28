/**
 * Piezas compartidas del sitio: layout, cabecera, pie, iconos y componentes.
 * Las usan las plantillas de scripts/site/pages.mjs. Devuelven strings HTML.
 */
import {
  SITE,
  skills,
  course,
  notebooks,
  isAffiliate,
  productUrl,
  getSkill,
  skillsOf,
} from "../../src/data/catalog.js";

/** Escapa texto para HTML. */
export const esc = (s = "") =>
  String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

/* ------------------------------------------------------------------ */
/* Iconos (SVG de trazo, 24×24)                                         */
/* ------------------------------------------------------------------ */
const ICONS = {
  eye: '<circle cx="7" cy="14" r="3.6"/><circle cx="17" cy="14" r="3.6"/><path d="M10.6 14h2.8M3.4 14 2 9M20.6 14 22 9"/>',
  mic: '<rect x="9" y="2.5" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7"/>',
  chart: '<path d="M3 21h18"/><rect x="5" y="13" width="3" height="5"/><rect x="10.5" y="9" width="3" height="9"/><rect x="16" y="4.5" width="3" height="13.5"/>',
  chat: '<path d="M4 4.5h16v11H10l-5 4v-4H4z"/><path d="M8.5 10h.01M12 10h.01M15.5 10h.01"/>',
  coin: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/>',
  bolt: '<path d="M13.5 2.5 5 13.5h6.5l-1 8 8.5-11h-6.5z"/>',
  rocket:
    '<path d="M12 2.5c2.8 2.3 4.2 5.6 4.2 9.4V16H7.8v-4.1c0-3.8 1.4-7.1 4.2-9.4z"/><circle cx="12" cy="9.5" r="1.6"/><path d="M7.8 12.5 4.5 16v2.5h3.3M16.2 12.5l3.3 3.5v2.5h-3.3M10 19l2 2.8 2-2.8"/>',
  arrow: '<path d="M7 17 17 7M8 7h9v9"/>',
};
export const icon = (name, cls = "icon") =>
  `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ""}</svg>`;

/* ------------------------------------------------------------------ */
/* Layout                                                              */
/* ------------------------------------------------------------------ */
const NAV = [
  ["/habilidades/", "Habilidades", "skills"],
  ["/tienda/", "Tienda", "shop"],
  ["/tienda/curso-lectura-rapida/", "Curso", "course"],
  ["/laboratorio/", "Prueba gratis", "lab"],
];

function header(active) {
  const links = NAV.map(
    ([href, label, key]) =>
      `<a href="${href}"${key === active ? ' aria-current="page"' : ""}>${label}</a>`,
  ).join("");
  return `<header class="site-header">
      <a class="brand" href="/" aria-label="LectorLab, inicio">lectorlab<span class="brand-star" aria-hidden="true">✳</span></a>
      <nav class="desktop-nav" aria-label="Principal">${links}</nav>
      <a class="btn btn-small" href="/tienda/" id="header-cta">Explorar productos <span aria-hidden="true">↗</span></a>
      <details class="mobile-nav">
        <summary>Menú +</summary>
        <nav aria-label="Móvil"><a href="/">Inicio</a>${links}</nav>
      </details>
    </header>`;
}

function footer() {
  const skillLinks = skills
    .map((s) => `<li><a href="/habilidades/${s.slug}/">${esc(s.name)}</a></li>`)
    .join("");
  return `<footer class="site-footer-v2 section-pad">
      <div class="footer-brand">
        <a class="brand" href="/">lectorlab<span class="brand-star" aria-hidden="true">✳</span></a>
        <p class="footer-claim">${esc(SITE.claim)}</p>
        <p class="fine">La lectura construye habilidades. Te ayudamos a elegir qué leer, a leer mejor y a ponerlo en práctica.</p>
      </div>
      <nav class="footer-col" aria-label="Habilidades"><p class="eyebrow">HABILIDADES</p><ul>${skillLinks}</ul></nav>
      <nav class="footer-col" aria-label="Tienda"><p class="eyebrow">TIENDA</p><ul>
        <li><a href="/tienda/curso-lectura-rapida/">Curso de lectura estratégica</a></li><li><a href="/tienda/cuadernos-lectorlab/">Cuadernos LectorLab</a></li>
        <li><a href="/tienda/?tipo=book">Libros</a></li>
        <li><a href="/tienda/?tipo=gadget">Gadgets de lectura</a></li>
      </ul></nav>
      <nav class="footer-col" aria-label="LectorLab"><p class="eyebrow">LECTORLAB</p><ul>
        <li><a href="/laboratorio/">Laboratorio gratis</a></li>
        <li><a href="/#peter">Peter</a></li>
        <li><a href="/afiliados/">Enlaces y afiliados</a></li>
      </ul></nav>
      <div class="footer-bottom">
        <span>© 2026 LectorLab · Por Nicolás Rodríguez</span>
        <span class="fine">${isAffiliate() ? "Algunos enlaces son de afiliado: si compras, LectorLab puede recibir una comisión sin coste para ti." : "Los enlaces a tiendas externas no generan comisión en esta versión."}</span>
        <button id="motion-toggle" type="button" aria-pressed="false">Pausar animaciones</button>
      </div>
    </footer>`;
}

/**
 * Documento completo.
 * @param {object} o
 * @param {string} o.title       <title>
 * @param {string} o.description meta description
 * @param {string} o.path        ruta canónica, p. ej. "/tienda/"
 * @param {string} o.body        contenido de <main>
 * @param {string} o.entry       módulo JS de entrada
 * @param {string} [o.active]    clave de navegación activa
 * @param {string} [o.page]      data-page del <body>
 * @param {string} [o.extraHead] HTML adicional para <head>
 * @param {string} [o.after]     HTML tras el pie (diálogos)
 */
export function layout({ title, description, path, body, entry, active = "", page = "", extraHead = "", after = "" }) {
  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta name="theme-color" content="#121212" />
    <!-- Edición piloto privada: quitar noindex al lanzar. -->
    <meta name="robots" content="noindex,nofollow" />
    <meta name="description" content="${esc(description)}" />
    <title>${esc(title)}</title>
    <link rel="canonical" href="${SITE.url}${path}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="LectorLab" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:image" content="${SITE.url}/assets/peter-reading-cutout.webp" />
    <link rel="icon" href="/assets/mark.svg" type="image/svg+xml" />
    <link rel="preload" href="/fonts/SpaceGrotesk.ttf" as="font" type="font/ttf" crossorigin />
    ${extraHead}
    <script type="module" src="${entry}"></script>
  </head>
  <body data-page="${page}">
    <a class="skip" href="#contenido">Saltar al contenido</a>
    <div class="reading-progress" aria-hidden="true"></div>
    ${header(active)}
    <main id="contenido">
${body}
    </main>
    ${footer()}
    ${after}
  </body>
</html>
`;
}

/* ------------------------------------------------------------------ */
/* Componentes                                                         */
/* ------------------------------------------------------------------ */

const COVER_TONES = ["lime", "paper", "red", "ink"];
const hash = (s) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);

/** Portada tipográfica: interpretación gráfica, no la portada editorial. */
export function bookCover(book, size = "") {
  if (book.image) return `<div class="real-cover ${size}"><img src="${esc(book.image)}" alt="Portada de ${esc(book.title)}" width="295" height="454" loading="lazy" decoding="async" /></div>`;
  const tone = COVER_TONES[hash(book.id) % COVER_TONES.length];
  return `<div class="cover cover--${tone} ${size}" aria-hidden="true">
        <span class="cover-pub">LECTORLAB RECOMIENDA</span>
        <span class="cover-title">${esc(book.title)}</span>
        <span class="cover-line"></span>
        <span class="cover-author">${esc(book.author.toUpperCase())}</span>
        <i>LL.</i>
      </div>`;
}

/** Caja CSS 3D del curso (alternativa sin WebGL). */
export function courseBox() {
  return `<div class="course-box" aria-hidden="true">
        <div class="course-face course-front">
          <span>lectorlab / curso 01</span>
          <strong>LECTURA<br />CON<br />INTEN-<br />CIÓN.</strong>
          <small>${course.modules.length} MÓDULOS · A TU RITMO</small>
        </div>
        <div class="course-face course-spine"><span>LECTORLAB ✳ LEER MEJOR</span></div>
      </div>`;
}

function affiliateFlag(item) {
  return isAffiliate() && !item.buyUrl
    ? '<span class="aff-flag">Enlace de afiliado</span>'
    : '<span class="aff-flag aff-flag--plain">Tienda externa</span>';
}

/** Tarjeta de producto para libros, gadgets y curso. */
export function productCard(item, { heading = "h3" } = {}) {
  const itemSkills = skillsOf(item.id);
  const skillNames = itemSkills.map((s) => getSkill(s)?.name).filter(Boolean);
  const typeLabel = { book: "LIBRO", gadget: "GADGET", course: "CURSO", notebook: "CUADERNOS" }[item.type];
  const href = productUrl(item);
  const external = !["course", "notebook"].includes(item.type);
  const media =
    item.type === "book"
      ? bookCover(item)
      : item.type === "gadget"
        ? `<img src="${item.image}" alt="" width="800" height="800" loading="lazy" decoding="async" />`
        : item.type === "notebook" ? notebookBox() : courseBox();
  const cta =
    !external
      ? `<a class="btn btn-small" href="${href}">Ver ${item.type === "course" ? "el curso" : "los cuadernos"} <span aria-hidden="true">↗</span></a>`
      : `<a class="btn btn-small" href="${esc(href)}" target="_blank" rel="${isAffiliate() && !item.buyUrl ? "sponsored " : ""}noopener noreferrer">${item.buyUrl ? "Ver en " + esc(item.retailer) : "Buscar en Amazon"} <span aria-hidden="true">↗</span><span class="visually-hidden"> (se abre en una pestaña nueva)</span></a>`;
  return `<article class="product-card product-card--${item.type}" data-type="${item.type}" data-skills="${itemSkills.join(" ")}" data-tilt>
      <div class="product-media">${media}</div>
      ${item.type === "gadget" ? '<p class="media-caption">Imagen ilustrativa · comprueba el modelo en tienda</p>' : ""}
      <div class="product-body">
        <p class="eyebrow">${typeLabel}${skillNames[0] ? " · " + esc(skillNames[0].toUpperCase()) : ""}</p>
        <${heading} class="product-title">${esc(item.title)}</${heading}>
        ${item.author ? `<p class="product-author">${esc(item.author)}</p>` : ""}
        <p class="product-note">${esc(item.note || item.short || "")}</p>
        ${item.price ? `<p class="card-price">${esc(item.price)} <small>${esc(item.status)} · venta no abierta</small></p>` : ""}
        <div class="product-foot">${cta}${external ? affiliateFlag(item) : ""}</div>
      </div>
    </article>`;
}

/** Tarjeta grande de habilidad (home y hub). */
export function skillCard(s, { heading = "h3" } = {}) {
  return `<a class="skill-card skill-card--${s.color}${s.slug === "leer-mejor" ? " skill-card--master" : ""}" href="/habilidades/${s.slug}/" data-skill="${s.slug}" data-tilt>
      <span class="skill-card-top"><span class="skill-num">${s.num}</span><span class="skill-tag">${esc(s.tag)}</span></span>
      <span class="skill-icon">${icon(s.icon)}</span>
      <${heading} class="skill-name">${esc(s.name)}</${heading}>
      <span class="skill-short">${esc(s.short)}</span>
      <span class="skill-meta">${s.books.length} libros · 1 ejercicio <span aria-hidden="true">↗</span></span>
    </a>`;
}

/** Chip compacto de habilidad. */
export const skillChip = (s, attrs = "") =>
  `<a class="chip chip--${s.color}" href="/habilidades/${s.slug}/" data-skill="${s.slug}" ${attrs}>${icon(s.icon)}<span>${esc(s.name)}</span></a>`;

/** Identidad visual del pack: un único componente para inicio, tienda y ficha. */
export function notebookBox() {
  return `<div class="notebook-stack" aria-hidden="true"><div class="notebook-back"><span>lectorlab / 02</span><strong>Vuelve<br>al libro.</strong><small>UN LUGAR AL QUE VOLVER</small></div><div class="notebook-front"><span>lectorlab / 01</span><strong>Lee y<br>hazlo<br><em>tuyo.</em></strong><small>EL PODER DE ENTENDER</small></div></div>`;
}

export function sectionIntro(kicker, title, copy, link = "") {
  return `<div class="editorial-heading"><div><p class="eyebrow">${esc(kicker)}</p><h2>${title}</h2></div><div><p>${esc(copy)}</p>${link}</div></div>`;
}

export function ownProduct(item) {
  const isCourse = item.type === "course";
  return `<article class="own-product ${isCourse ? "own-course" : "own-notebook"}"><a class="own-visual" href="${productUrl(item)}" aria-label="Ver ${esc(item.title)}">${isCourse ? courseBox() : notebookBox()}</a><div class="own-copy"><p class="eyebrow">${isCourse ? "CURSO ESCRITO · EN VALIDACIÓN" : "CUADERNOS + ESPACIO INTERACTIVO"}</p><h3>${esc(item.title)}</h3><p>${esc(item.short)}</p><div class="own-price"><strong>${esc(item.price)}</strong><span>${esc(item.priceNote)}</span></div><a class="text-link" href="${productUrl(item)}">${isCourse ? "Descubre el temario" : "Qué incluyen los cuadernos"} ↗</a><p class="availability">Venta aún no abierta.</p></div></article>`;
}
