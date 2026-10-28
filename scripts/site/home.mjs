import { course, notebooks, getProduct } from '../../src/data/catalog.js';
import { storyBanner, peterJourney, rocketJourney } from './story.mjs';
import { layout, esc, productCard, sectionIntro, ownProduct } from './ui.mjs';

export function home() {
  const routes = [
    ['01', 'Comunicar', 'comunicar', 'Que tus ideas encuentren las palabras.', 'Conversaciones, escucha y negociación.'],
    ['02', 'Crear hábitos', 'foco-y-habitos', 'Haz espacio para lo que te importa.', 'Atención, constancia y pequeños comienzos.'],
    ['03', 'Vender', 'vender', 'Explica el valor de lo que haces.', 'Persuasión, preguntas e influencia ética.'],
  ];
  const body = `
  <section class="chapter-hero section-pad" id="inicio" aria-labelledby="hero-title">
    <div class="chapter-top"><span class="eyebrow">PARA QUIENES SIEMPRE QUIEREN SABER UN POCO MÁS</span><span class="edition">LEE. APRENDE. HAZLO POSIBLE.</span></div>
    <div class="chapter-grid">
      <div class="chapter-copy">
        <p class="hero-prelude"><span></span> Una historia para mentes inquietas.</p>
        <h1 id="hero-title"><span>¿Y si esa idea</span><span>saliera</span><em>del libro?</em></h1>
        <p class="chapter-lead">Hay páginas que te hacen pensar: «yo también podría». Acompaña a Peter a descubrir qué pasa cuando una de esas ideas sale al mundo.</p>
        <div class="hero-actions"><a class="btn btn-lime" href="#historia" id="hero-cta">Sigue la historia <span aria-hidden="true">↗</span></a><a class="text-link" href="/tienda/">Explorar la tienda ↗</a></div>
        <p class="hero-footnote">Desliza. La curiosidad pone el resto.</p>
      </div>
      <div class="chapter-stage">
        <div class="possibility-orbit" aria-hidden="true"><span>✳</span></div>
        <div class="peter-cutout" data-hero-depth><img src="/assets/peter-reading-cutout.webp" width="850" height="1062" fetchpriority="high" alt="Peter levanta la mirada de su libro, imaginando una nueva posibilidad"/></div>
        <div class="peter-note" data-hero-note><span class="note-star" aria-hidden="true">↗</span><p>Todo empieza con<br><em>una pregunta.</em></p></div>
        <span class="peter-signature">Peter, siempre aprendiendo.</span>
        <svg class="curiosity-line" viewBox="0 0 200 150" aria-hidden="true"><path d="M12 12 C155 -10 190 45 128 65 S105 140 180 126 M163 113 L181 126 L165 139"/></svg>

      </div>
    </div>
    <div class="chapter-bottom"><span>LEE. APRENDE. HAZLO POSIBLE.</span><a href="#historia">Abre el primer capítulo <span aria-hidden="true">↓</span></a></div>
  </section>
  ${storyBanner()}
  ${peterJourney()}
  ${rocketJourney()}
  <section class="path-section section-pad" id="habilidades">
    ${sectionIntro('03 / AHORA, TU HISTORIA', '¿Qué te gustaría<br><em>hacer mejor?</em>', 'Una selección de libros y una pequeña práctica para empezar por algo que te importe.', '<a class="text-link" href="/habilidades/">Explora las 7 habilidades ↗</a>')}
    <div class="path-grid">${routes.map(([n,name,slug,title,desc])=>`<a class="path-card" href="/habilidades/${slug}/"><div class="path-top"><span>${n}</span><span>${name}</span><span aria-hidden="true">↗</span></div><h3>${title}</h3><p>${desc}</p></a>`).join('')}</div>
  </section>
  <section class="own-section section-pad" id="productos">
    ${sectionIntro('04 / UN POCO DE AYUDA PARA EL CAMINO', 'El siguiente capítulo<br><em>lo escribes tú.</em>', 'Elige un cuaderno para acompañar tu lectura o conoce el curso que estamos preparando. Mientras tanto, puedes probar el laboratorio gratis.')}
    <div class="own-grid">${ownProduct(notebooks)}${ownProduct(course)}</div>
  </section>
  <section class="curated-section section-pad" id="estanteria">
    ${sectionIntro('05 / UNA ESTANTERÍA CON INTENCIÓN', 'Menos acumular.<br><em>Más encontrar.</em>', 'Tres puntos de partida. Cada libro tiene una razón para estar aquí y una habilidad que puedes practicar.', '<a class="text-link" href="/tienda/?tipo=book">Ver todos los libros ↗</a>')}
    <div class="product-grid curated-grid">${['habitos-atomicos','el-poder-de-tu-alter-ego','como-ganar-amigos'].map(id=>productCard(getProduct(id))).join('')}</div>
    <p class="fine shop-disclaimer">Portadas de las ediciones enlazadas. Consulta el precio y la disponibilidad en cada tienda. Estos enlaces no generan comisión.</p>
    <a class="gadget-link" href="/tienda/?tipo=gadget"><span>HAZ SITIO A LA LECTURA</span><strong>Una luz. Un libro. Tu momento.</strong><span>Explora accesorios ↗</span></a>
  </section>
  <section class="lab-invitation section-pad">
    <div><p class="eyebrow">TU PRIMER PASO · GRATIS Y SIN REGISTRO</p><h2>Una idea que lees.<br><em>Algo que haces.</em></h2><p>Abre el cuaderno de siete días. Elige una pregunta, escribe lo que descubres y llévate tus notas.</p><a class="btn btn-lime" href="/laboratorio/">Abrir mi cuaderno gratis <span aria-hidden="true">↗</span></a><p class="invitation-note">Un proyecto de Nicolás Rodríguez. Tus notas se quedan en tu navegador.</p></div><div class="invitation-index" aria-hidden="true">Lee.<br>Piensa.<br><em>Prueba.</em></div>
  </section>
  <section class="home-faq section-pad"><p class="eyebrow">ANTES DE PASAR PÁGINA</p><h2>Las cosas claras.</h2><div class="faq-list">
    <details><summary>¿Ya puedo comprar el curso o los cuadernos?<span aria-hidden="true">+</span></summary><p>Todavía no. El pack tiene contenido preparado y cuesta ${esc(notebooks.price)} en un solo pago. Falta habilitar y comprobar el cobro y la entrega. El curso escrito está en validación, con ${esc(course.price)} previstos. El laboratorio ya está disponible gratis.</p></details>
    <details><summary>¿Los libros están incluidos?<span aria-hidden="true">+</span></summary><p>No. Los libros recomendados se consiguen por separado, en una librería o biblioteca. Los enlaces de esta versión llevan a tiendas externas y no generan comisión.</p></details>
    <details><summary>¿Necesito leer rápido para empezar?<span aria-hidden="true">+</span></summary><p>No. Queremos ayudarte a elegir qué leer, entenderlo y probar una idea. Ajusta el ritmo al texto y a tu objetivo; no prometemos una velocidad ni que un libro por sí solo cree una habilidad.</p></details>
  </div></section>`;
  return {path:'index.html',html:layout({title:'LectorLab — Lee. Aprende. Hazlo posible.',description:'Libros con intención, cuadernos de lectura y un curso en desarrollo. Convierte lo que lees en habilidades para tu vida. Empieza gratis con Peter.',path:'/',body,entry:'/src/main.js',page:'home'})};
}
