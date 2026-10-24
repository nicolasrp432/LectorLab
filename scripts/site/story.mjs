/** Narrative components: meaningful in HTML, progressively animated with GSAP. */
export function storyBanner() {
  return `<div class="story-banner-wrap" aria-hidden="true"><div class="marquee story-banner"><div class="marquee-track">${Array.from({length: 4}, () => '<span>UNA PÁGINA.</span><i>✳</i><span>OTRA POSIBILIDAD.</span><i>↗</i>').join('')}</div></div></div>`;
}

export function peterJourney() {
  const steps = [
    ['01', 'Una pregunta', '«Quiero explicarme<br>sin enredarme.»', 'Peter termina un libro lleno de subrayados. Le gustó. Pero mañana tiene una conversación importante y no sabe por dónde empezar.', 'Reconocer lo que quieres aprender.'],
    ['02', 'Una idea', 'Escuchar también<br>es <em>comunicar.</em>', 'Vuelve a una sola idea: antes de responder, intenta entender. La explica con sus palabras y elige una pregunta para su amigo.', 'Entender algo que puedas usar.'],
    ['03', 'Una pequeña prueba', '«¿Te entendí bien?»', 'En la siguiente conversación, Peter pregunta antes de dar su opinión. Escucha la respuesta. No ha aprendido todo: ya tiene algo que practicar.', 'Llevar la lectura a tu vida.'],
  ];
  return `<section class="reading-story section-pad" id="historia" aria-labelledby="story-title">
    <div class="story-intro"><p class="eyebrow">01 / MÁS ALLÁ DEL SUBRAYADO</p><h2 id="story-title">Cierras el libro.<br><em>¿Y ahora qué?</em></h2><p>Las ideas nos entusiasman.<br>El reto es encontrar qué hacer con ellas.</p></div>
    <div class="story-layout">
      <figure class="story-companions" id="peter"><div class="companion-art"><span class="conversation-orbit" aria-hidden="true"></span><img src="/assets/peter-friend-cutout.webp" alt="Peter explica una idea de su libro a su amigo zorro, que escucha con un cuaderno" width="1100" height="733" loading="lazy" decoding="async"/></div><figcaption>UNA HISTORIA DE PETER · PODRÍA SER LA TUYA.</figcaption><div class="story-dots" aria-hidden="true"><span></span><span></span><span></span></div></figure>
      <div class="story-chapters">${steps.map(([n,kicker,title,body,outcome]) => `<article class="story-step" data-story-step><span class="story-step-number">${n}</span><div><p class="eyebrow">${kicker}</p><h3>${title}</h3><p>${body}</p><span class="story-takeaway">↗ ${outcome}</span></div></article>`).join('')}</div>
    </div>
    <p class="story-resolution">Ese es el puente que construimos en LectorLab.<br><strong>Del «qué interesante» al <em>«voy a probarlo».</em></strong></p>
  </section>`;
}

export function rocketJourney() {
  return `<section class="rocket-section section-pad" id="cohete" aria-labelledby="rocket-title">
    <div class="rocket-copy"><p class="eyebrow">02 / DALE ESPACIO A LO POSIBLE</p><h2 id="rocket-title">Una conversación.<br>Un proyecto.<br><em>Hasta la Luna.</em></h2><p>Detrás de un despegue hay conocimiento, pruebas y errores. Detrás de lo que quieres aprender, también.</p><p>No necesitas saberlo todo para empezar.<br>Necesitas una dirección y un primer paso.</p><a class="text-link text-link--light" href="#habilidades">Encuentra tu dirección <span aria-hidden="true">↓</span></a></div>
    <div class="rocket-stage" aria-hidden="true">
      <span class="flight-label">DE LA CURIOSIDAD A LA PRÁCTICA</span>
      <svg class="rocket-svg" viewBox="0 0 600 600">
        <defs><radialGradient id="moon-light" cx="30%" cy="25%"><stop stop-color="#eaff9c"/><stop offset="1" stop-color="#b6d831"/></radialGradient><linearGradient id="rocket-metal" x1="0" x2="1"><stop stop-color="#bcbdb4"/><stop offset=".4" stop-color="#f5f3ea"/><stop offset="1" stop-color="#c9c9c0"/></linearGradient></defs>
        <circle class="orbit-track" cx="300" cy="300" r="245"/>
        <circle class="moon" cx="500" cy="100" r="62"/>
        <circle class="moon-crater" cx="480" cy="85" r="10"/><circle class="moon-crater" cx="520" cy="118" r="7"/>
        <path id="rocket-path" class="rocket-path" d="M60 540 C 120 380, 300 420, 330 280 S 430 120, 470 140"/>
        <g class="stars"><circle cx="90" cy="90" r="2"/><circle cx="220" cy="60" r="1.5"/><circle cx="330" cy="140" r="2"/><circle cx="560" cy="260" r="1.5"/><circle cx="160" cy="250" r="1.5"/><circle cx="420" cy="330" r="2"/><circle cx="540" cy="470" r="1.5"/></g>
        <g id="rocket" class="rocket"><path class="rocket-flame" d="M-9 22 Q-8 40 0 56 Q8 40 9 22 Z"/><path class="rocket-body" d="M0 -38 C14 -26 16 -6 14 22 L-14 22 C-16 -6 -14 -26 0 -38 Z"/><circle class="rocket-window" cx="0" cy="-8" r="6"/><path class="rocket-fin" d="M-14 8 L-26 26 L-14 22 Z M14 8 L26 26 L14 22 Z"/></g>
        <text x="25" y="585" class="launch-caption">EMPIEZA AQUÍ</text>
      </svg>
      <span class="flight-note">Un pequeño paso también cuenta.</span>
    </div>
  </section>`;
}
