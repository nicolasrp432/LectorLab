import { course, notebooks, getProduct } from '../../src/data/catalog.js';
import { layout, esc, productCard, sectionIntro, ownProduct } from './ui.mjs';

export function home() {
  const routes = [
    ['01', 'Comunicar', 'comunicar', 'Que tus ideas encuentren las palabras.', 'Conversaciones, escucha y negociación.'],
    ['02', 'Crear hábitos', 'foco-y-habitos', 'Haz espacio para lo que te importa.', 'Atención, constancia y pequeños comienzos.'],
    ['03', 'Vender', 'vender', 'Explica el valor de lo que haces.', 'Persuasión, preguntas e influencia ética.'],
  ];
  const body = `
  <section class="chapter-hero section-pad" id="inicio" aria-labelledby="hero-title">
    <div class="chapter-top"><span class="eyebrow">EL CONOCIMIENTO SE CONVIERTE EN POSIBILIDADES</span><span class="edition">EST. 2026 / VOL. 03</span></div>
    <div class="chapter-grid">
      <div class="chapter-copy">
        <p class="hero-prelude"><span></span> Para mentes que no se quedan quietas.</p>
        <h1 id="hero-title"><span>Lee para</span><span>hacerlo</span><em>posible.</em></h1>
        <p class="chapter-lead">Comunicar con confianza. Dar forma a una idea. Aprender algo que hoy te parece imposible. Empieza en un libro. Hazlo tuyo al practicar.</p>
        <div class="hero-actions"><a class="btn btn-lime" href="#productos" id="hero-cta">Encuentra tu próximo paso <span aria-hidden="true">↗</span></a><a class="text-link" href="/laboratorio/">Prueba gratis</a></div>
        <p class="hero-footnote">Libros con intención. Herramientas para pasar a la acción.</p>
      </div>
      <div class="chapter-stage">
        <div class="portrait-frame" data-hero-depth><img src="/assets/peter-portrait.webp" width="410" height="512" fetchpriority="high" alt="Peter, la nutria de LectorLab, con expresión curiosa y su característico pecho crema"/><span class="portrait-label">PETER / TU COMPAÑERO DE LECTURA</span></div>
        <div class="peter-note" data-hero-note><span class="note-star" aria-hidden="true">✳</span><p>Una buena idea<br>merece <em>salir del libro.</em></p></div>
        <a class="hero-book-link" href="/tienda/cuadernos-lectorlab/" aria-label="Descubre los cuadernos Lee y hazlo tuyo"><div class="hero-book" data-hero-book><span>lectorlab / cuaderno 01</span><strong>Lee y<br>hazlo<br><em>tuyo.</em></strong><small>COMPRENDE. RECUERDA. PRUEBA.</small></div></a>
        <span class="stage-number" aria-hidden="true">01—∞</span>
      </div>
    </div>
    <div class="chapter-bottom"><span>LEE. APRENDE. HAZLO POSIBLE.</span><a href="#habilidades">Todo empieza con curiosidad <span aria-hidden="true">↓</span></a></div>
  </section>
  <section class="path-section section-pad" id="habilidades">
    ${sectionIntro('01 / ELIGE UNA DIRECCIÓN', '¿Qué te gustaría<br><em>hacer mejor?</em>', 'Una selección de libros y una pequeña práctica para empezar por algo que te importe.', '<a class="text-link" href="/habilidades/">Explora las 7 habilidades ↗</a>')}
    <div class="path-grid">${routes.map(([n,name,slug,title,desc])=>`<a class="path-card" href="/habilidades/${slug}/"><div class="path-top"><span>${n}</span><span>${name}</span><span aria-hidden="true">↗</span></div><h3>${title}</h3><p>${desc}</p></a>`).join('')}</div>
  </section>
  <section class="own-section section-pad" id="productos">
    ${sectionIntro('02 / HERRAMIENTAS LECTORLAB', 'El siguiente capítulo<br><em>lo escribes tú.</em>', 'Elige un cuaderno para acompañar tu lectura o conoce el curso que estamos preparando. Mientras tanto, puedes probar el laboratorio gratis.')}
    <div class="own-grid">${ownProduct(notebooks)}${ownProduct(course)}</div>
  </section>
  <section class="curated-section section-pad" id="estanteria">
    ${sectionIntro('03 / UNA ESTANTERÍA CON INTENCIÓN', 'Menos acumular.<br><em>Más encontrar.</em>', 'Tres puntos de partida. Cada libro tiene una razón para estar aquí y una habilidad que puedes practicar.', '<a class="text-link" href="/tienda/?tipo=book">Ver todos los libros ↗</a>')}
    <div class="product-grid curated-grid">${['habitos-atomicos','el-poder-de-tu-alter-ego','como-ganar-amigos'].map(id=>productCard(getProduct(id))).join('')}</div>
    <p class="fine shop-disclaimer">Portadas de las ediciones enlazadas. Consulta el precio y la disponibilidad en cada tienda. Estos enlaces no generan comisión.</p>
    <a class="gadget-link" href="/tienda/?tipo=gadget"><span>HAZ SITIO A LA LECTURA</span><strong>Una luz. Un libro. Tu momento.</strong><span>Explora accesorios ↗</span></a>
  </section>
  <section class="peter-story section-pad" id="peter">
    <figure class="friend-photo"><img src="/assets/peter-and-friend.webp" alt="Peter conversa con su amigo zorro en un banco, junto a un libro" width="512" height="512" loading="lazy"/><figcaption>LAS IDEAS TAMBIÉN SE APRENDEN CON OTROS.</figcaption></figure>
    <div class="story-copy"><p class="eyebrow">EL UNIVERSO DE PETER</p><h2>De las páginas<br><em>a las conversaciones.</em></h2><p>Peter también se equivoca, se distrae y tiene conversaciones difíciles. Con sus amigos descubre ideas en los libros, las pone a prueba y cuenta lo que aprende.</p><p>Detrás de LectorLab está Nicolás Rodríguez. La idea es sencilla: acercar el conocimiento a la vida cotidiana, con curiosidad y práctica.</p><div class="story-method"><span><b>01</b> Lee una idea.</span><span><b>02</b> Explícala a tu manera.</span><span><b>03</b> Prueba algo pequeño.</span></div><a class="text-link" href="/habilidades/comunicar/#ejercicio">Prueba una conversación diferente ↗</a></div>
  </section>
  <section class="lab-invitation section-pad">
    <div><p class="eyebrow">TU PRIMER PASO · GRATIS Y SIN REGISTRO</p><h2>Una idea que lees.<br><em>Algo que haces.</em></h2><p>Abre el cuaderno de siete días. Elige una pregunta, escribe lo que descubres y llévate tus notas.</p><a class="btn btn-lime" href="/laboratorio/">Abrir mi cuaderno gratis <span aria-hidden="true">↗</span></a><p class="invitation-note">Tus notas se quedan en tu navegador. Tú decides si las guardas.</p></div><div class="invitation-index" aria-hidden="true">Lee.<br>Piensa.<br><em>Prueba.</em></div>
  </section>
  <section class="home-faq section-pad"><p class="eyebrow">ANTES DE PASAR PÁGINA</p><h2>Las cosas claras.</h2><div class="faq-list">
    <details><summary>¿Ya puedo comprar el curso o los cuadernos?<span aria-hidden="true">+</span></summary><p>Todavía no. Los cuadernos están en edición de prueba y el curso, en desarrollo. Los precios previstos son ${esc(notebooks.price)} por el pack de dos cuadernos y ${esc(course.price)} por el curso, en un solo pago. El laboratorio ya está disponible gratis.</p></details>
    <details><summary>¿Los libros están incluidos?<span aria-hidden="true">+</span></summary><p>No. Los libros recomendados se consiguen por separado, en una librería o biblioteca. Los enlaces de esta versión llevan a tiendas externas y no generan comisión.</p></details>
    <details><summary>¿Necesito leer rápido para empezar?<span aria-hidden="true">+</span></summary><p>No. Queremos ayudarte a elegir qué leer, entenderlo y probar una idea. Ajusta el ritmo al texto y a tu objetivo; no prometemos una velocidad ni que un libro por sí solo cree una habilidad.</p></details>
  </div></section>`;
  return {path:'index.html',html:layout({title:'LectorLab — Lee. Aprende. Hazlo posible.',description:'Libros con intención, cuadernos de lectura y un curso en desarrollo. Convierte lo que lees en habilidades para tu vida. Empieza gratis con Peter.',path:'/',body,entry:'/src/main.js',page:'home'})};
}
