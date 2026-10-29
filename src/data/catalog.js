/**
 * Fuente única de datos de LectorLab 2.0.
 * La usan el generador de páginas (Node, scripts/generate-pages.mjs) y el
 * navegador (filtros de la tienda). Sin dependencias: solo datos y helpers puros.
 *
 * ⚠️ Antes de publicar:
 *  - Rellenar AMAZON_TAG con el tag real de Amazon Afiliados (amazon.es).
 *  - Conectar checkout solo cuando producto, condiciones y entrega estén listos.
 *  - Verificar cada libro (título, edición en español, autor) antes de recomendarlo.
 */

/** Tag de Amazon Afiliados. Vacío = enlaces normales, sin comisión ni aviso de afiliado. */
export const AMAZON_TAG = "";

export const SITE = {
  name: "LectorLab",
  url: "https://lectorlab.com", // TODO: dominio definitivo
  claim: "Lee. Aprende. Hazlo posible.",
  promise:
    "Te ayudamos a elegir qué leer, a leer mejor y a convertir lo leído en una habilidad.",
};

/* ------------------------------------------------------------------ */
/* Habilidades                                                         */
/* ------------------------------------------------------------------ */

export const skills = [
  {
    slug: "leer-mejor",
    num: "00",
    name: "Leer mejor",
    tag: "LA LLAVE MAESTRA",
    color: "lime",
    icon: "eye",
    hook: "La habilidad que acelera todas las demás.",
    short: "Lee con objetivo, entiende más rápido y recuerda lo que importa.",
    intro:
      "Antes de aprender a vender, hablar o negociar con libros, conviene aprender a leerlos. Leer con un propósito, saber qué saltar y recordar lo esencial convierte cada libro en una herramienta.",
    why: [
      "Elegir qué leer según lo que quieres aprender, no según la moda.",
      "Previsualizar un libro en minutos para decidir si merece tu tiempo.",
      "Recuperar lo leído sin mirar: la forma más útil de fijarlo.",
    ],
    exercise:
      "Antes de abrir tu próximo libro, escribe en una línea qué quieres sacar de él. Al terminar el capítulo, ciérralo y explica la idea principal sin mirar.",
    peter: "Yo antes subrayaba todo. Ahora primero me pregunto para qué leo.",
    books: ["como-leer-un-libro", "aprender-a-aprender", "enfocate"],
    gadgets: ["guia-lectura", "e-reader", "lampara"],
  },
  {
    slug: "hablar-en-publico",
    num: "01",
    name: "Hablar en público",
    tag: "VOZ Y PRESENCIA",
    color: "red",
    icon: "mic",
    hook: "Del miedo escénico a una idea que se recuerda.",
    short: "Estructura una charla, cuenta historias y controla los nervios.",
    intro:
      "Los mejores oradores no nacieron sabiendo. Aprendieron estructuras, ensayaron y estudiaron a otros. Gran parte de ese oficio está escrito y se puede practicar desde mañana.",
    why: [
      "Construir una charla alrededor de una sola idea clara.",
      "Usar historias y ejemplos que la audiencia pueda ver.",
      "Ensayar con método para que los nervios jueguen a tu favor.",
    ],
    exercise:
      "Elige un tema que domines y resúmelo en 15 palabras. Grábate explicándolo durante un minuto y escucha qué sobra.",
    peter: "Mi primera charla duró 4 minutos. Tres fueron «eeeh».",
    books: ["charlas-ted", "hable-como-en-ted"],
    gadgets: ["temporizador", "notas-transparentes"],
  },
  {
    slug: "vender",
    num: "02",
    name: "Vender y persuadir",
    tag: "INFLUENCIA ÉTICA",
    color: "lime",
    icon: "chart",
    hook: "Vender es ayudar a alguien a decidir.",
    short: "Entiende por qué decimos que sí y comunica el valor de lo que ofreces.",
    intro:
      "Todos vendemos: una idea en una reunión, un proyecto a un cliente o a nosotros mismos en una entrevista. La psicología de la persuasión lleva décadas estudiándose y está al alcance de cualquier lector.",
    why: [
      "Reconocer los principios que hacen que alguien diga que sí.",
      "Escuchar antes de ofrecer: entender el problema del otro.",
      "Persuadir sin manipular: la diferencia está en la intención.",
    ],
    exercise:
      "Piensa en la última vez que alguien te convenció de algo. Anota qué hizo exactamente. ¿Qué principio reconoces?",
    peter: "Intenté venderle una idea a mi jefe. Ahora entiendo por qué no funcionó.",
    books: ["influencia", "vender-es-humano"],
    gadgets: ["notas-transparentes", "temporizador"],
  },
  {
    slug: "comunicar",
    num: "03",
    name: "Comunicar y negociar",
    tag: "CONVERSACIONES",
    color: "paper",
    icon: "chat",
    hook: "Lo que dices importa. Cómo lo dices, más.",
    short: "Conversaciones difíciles, escucha activa y acuerdos que funcionan.",
    intro:
      "Pedir un aumento, poner un límite o cerrar un acuerdo. Las conversaciones que más nos cuestan son las que más cambian nuestra vida, y hay libros enteros dedicados a hacerlas mejor.",
    why: [
      "Escuchar de verdad y hacer preguntas que abren la conversación.",
      "Mantener la calma cuando hay mucho en juego.",
      "Negociar buscando acuerdos, no ganadores.",
    ],
    exercise:
      "En tu próxima conversación importante, antes de responder, resume lo que te han dicho: «Entonces, lo que te preocupa es…».",
    peter: "Descubrí que callarme dos segundos más cambia toda la conversación.",
    books: ["rompe-la-barrera-del-no", "conversaciones-cruciales", "como-ganar-amigos"],
    gadgets: ["notas-transparentes"],
  },
  {
    slug: "dinero",
    num: "04",
    name: "Dinero con criterio",
    tag: "DECISIONES",
    color: "paper",
    icon: "coin",
    hook: "Tu relación con el dinero también se aprende.",
    short: "Piensa mejor tus decisiones de consumo, ahorro e inversión.",
    intro:
      "El dinero tiene más de psicología que de matemáticas. Leer sobre cómo decidimos te ayuda a entender tus impulsos y a construir un criterio propio. Contenido general, no asesoramiento financiero.",
    why: [
      "Separar lo que quieres de lo que quieres que vean.",
      "Entender el poder del tiempo y la paciencia.",
      "Construir reglas propias para decidir con calma.",
    ],
    exercise:
      "Piensa en una compra reciente. Si nadie pudiera enterarse de que la tienes, ¿la seguirías queriendo?",
    peter: "Compré unas zapatillas carísimas. Las uso para ir a por pan.",
    books: ["psicologia-del-dinero", "hombre-mas-rico-de-babilonia"],
    gadgets: ["notas-transparentes"],
  },
  {
    slug: "foco-y-habitos",
    num: "05",
    name: "Foco y hábitos",
    tag: "CONSTANCIA",
    color: "lime",
    icon: "bolt",
    hook: "Pequeños cambios, repetidos, cambian el juego.",
    short: "Diseña tu entorno, protege tu atención y construye constancia.",
    intro:
      "Ninguna habilidad se construye sin práctica, y la práctica depende de tus hábitos y tu atención. Estos libros explican cómo funcionan y cómo diseñar un entorno que te ayude.",
    why: [
      "Reducir el comienzo de un hábito a menos de dos minutos.",
      "Proteger bloques de concentración profunda.",
      "Entender el ciclo señal, rutina y recompensa.",
    ],
    exercise:
      "¿Dónde podrías dejar el libro esta noche para que empezar a leer mañana sea un poco más fácil?",
    peter: "Mi regla: una página. Si me apetece, sigo. Casi siempre sigo.",
    books: ["habitos-atomicos", "el-poder-de-tu-alter-ego", "enfocate", "el-poder-de-los-habitos"],
    gadgets: ["temporizador", "lampara", "atril"],
  },
  {
    slug: "pensar-como-cientifico",
    num: "06",
    name: "Pensar como un científico",
    tag: "HASTA LA LUNA",
    color: "red",
    icon: "rocket",
    hook: "Alguien escribió cómo llegar a la Luna. Puedes leerlo.",
    short: "Curiosidad, método y pensamiento crítico para resolver problemas grandes.",
    intro:
      "Cada cohete que ha despegado empezó en libros: física, matemáticas, errores documentados. Pensar como un científico es hacer buenas preguntas, ponerlas a prueba y cambiar de opinión cuando los datos lo piden.",
    why: [
      "Hacer preguntas que se puedan comprobar.",
      "Detectar afirmaciones sin pruebas, incluidas las propias.",
      "Aprender de los errores sin tomárselos como algo personal.",
    ],
    exercise:
      "Escribe algo que crees firmemente. Ahora anota qué tendría que pasar para que cambiaras de opinión.",
    peter: "Quería construir un cohete. Empecé por entender por qué vuelan.",
    books: ["el-mundo-y-sus-demonios", "feynman", "cosmos"],
    gadgets: ["atril", "lampara"],
  },
];

/* ------------------------------------------------------------------ */
/* Productos                                                           */
/* ------------------------------------------------------------------ */

/** Producto propio. Precio previsto; checkout vacío = venta no abierta. */
export const course = {
  id: "curso-lectura-rapida",
  type: "course",
  slug: "curso-lectura-rapida",
  title: "Lectura estratégica",
  kicker: "CURSO LECTORLAB · 01",
  skills: ["leer-mejor"],
  short:
    "Curso audiovisual en preparación: seis módulos para comprender, recordar y poner a prueba lo que lees.",
  price: "49 €",
  priceNote: "Precio previsto de lanzamiento · pago único",
  status: "Producción audiovisual",
  checkoutUrl: "", // URL de Hotmart / Lemon Squeezy / Stripe
  peterNote: "No se trata de leer a toda velocidad. Se trata de saber dónde frenar.",
  modules: [
    ["Lee con un objetivo", "Define qué quieres sacar de un libro antes de abrirlo."],
    ["Previsualiza en 10 minutos", "Índice, introducción y conclusiones para decidir dónde invertir tu tiempo."],
    ["Lee, recuerda y contrasta", "Explica una idea sin mirar y vuelve al texto para corregirla."],
    ["Planifica con margen", "Estima sesiones con tu texto real y reserva tiempo para comprender."],
    ["Recordar lo leído", "Práctica de recuperación: cierra el libro y explícalo con tus palabras."],
    ["Tu sistema de lectura", "Notas, repaso y cómo convertir un libro en una habilidad aplicada."],
  ],
  promises: [
    "Elegir una profundidad de lectura acorde con tu pregunta",
    "Decidir en minutos si un libro merece tu tiempo",
    "Practicar el recuerdo y diseñar una prueba pequeña",
  ],
  limits:
    "Leer más rápido suele tener un coste en comprensión. Este curso no promete cifras de palabras por minuto: enseña a ajustar la velocidad a tu objetivo.",
};

/** Libros recomendados (afiliado). Portadas: interpretación gráfica, no la editorial. */
export const notebooks = {
  id: "cuadernos-lectorlab", type: "notebook", slug: "cuadernos-lectorlab",
  title: "Lee y hazlo tuyo", subtitle: "El pack de cuadernos LectorLab",
  price: "19 €", priceNote: "Precio del pack · pago único", checkoutUrl: "",
  status: "Contenido preparado", skills: ["leer-mejor", "foco-y-habitos"],
  short: "Dos cuadernos y un espacio interactivo para comprender, probar y volver a tus ideas.",
  includes: [
    ["Lee y hazlo tuyo", "19 páginas · preguntas, recuerdo, contraste y pruebas. A5 imprimible y A4 rellenable."],
    ["Vuelve al libro", "14 páginas · señales, entorno y regreso a la lectura. A5 imprimible y A4 rellenable."],
    ["Mi laboratorio", "Versión local del laboratorio gratuito: tablero, revisiones y exportaciones. También puedes usar la herramienta web sin comprar el pack."],
    ["Empieza y vuelve", "Guía de inicio en diez minutos y plantillas Markdown para importar en Notion o abrir en Obsidian."]
  ],
};

export const books = [
  { id: "el-poder-de-tu-alter-ego", image: "/assets/products/alter-ego.webp", title: "El poder de tu alter ego", author: "Todd Herman", isbn: "9791387662356", sourceUrl: "https://www.edicionesurano.com/el-poder-de-tu-alter-ego", buyUrl: "https://www.casadellibro.com/libro-el-poder-de-tu-alter-ego/9791387662356/17958450", retailer: "Casa del Libro", note: "Una lectura para explorar cómo te preparas ante un reto. El libro elegido para nuestro piloto de lectura aplicada." },
  { id: "como-leer-un-libro", title: "Cómo leer un libro", author: "Mortimer J. Adler y Charles Van Doren", note: "El manual clásico para leer con método, de la lectura de inspección a la analítica." },
  { id: "aprender-a-aprender", title: "Aprender a aprender", author: "Barbara Oakley y Terrence Sejnowski", note: "Cómo funciona el cerebro cuando aprende y técnicas sencillas para estudiar mejor." },
  { id: "enfocate", title: "Enfócate", author: "Cal Newport", note: "Por qué la concentración profunda es una ventaja y cómo entrenarla." },
  { id: "charlas-ted", title: "Charlas TED", author: "Chris Anderson", note: "La guía oficial de TED: cómo construir una charla alrededor de una idea." },
  { id: "hable-como-en-ted", title: "Hable como en TED", author: "Carmine Gallo", note: "Análisis de cientos de charlas para entender qué las hace memorables." },
  { id: "influencia", title: "Influencia", author: "Robert B. Cialdini", note: "Los principios de la persuasión explicados con experimentos y ejemplos reales." },
  { id: "vender-es-humano", title: "Vender es humano", author: "Daniel H. Pink", note: "Por qué todos vendemos algo y cómo hacerlo con honestidad." },
  { id: "rompe-la-barrera-del-no", title: "Rompe la barrera del no", author: "Chris Voss", note: "Técnicas de negociación de un exnegociador del FBI, aplicables al día a día." },
  { id: "conversaciones-cruciales", title: "Conversaciones cruciales", author: "Kerry Patterson y otros", note: "Herramientas para hablar cuando hay mucho en juego y las emociones suben." },
  { id: "como-ganar-amigos", image: "/assets/products/como-ganar-amigos.webp", isbn: "9788411723985", buyUrl: "https://www.casadellibro.com/libro-como-ganar-amigos-e-influir-sobre-las-personas/9788411723985/17972184", retailer: "Casa del Libro", title: "Cómo ganar amigos e influir sobre las personas", author: "Dale Carnegie", note: "Un clásico sobre trato humano que sigue vigente casi un siglo después." },
  { id: "psicologia-del-dinero", title: "La psicología del dinero", author: "Morgan Housel", note: "Historias cortas sobre cómo el comportamiento pesa más que el conocimiento financiero." },
  { id: "hombre-mas-rico-de-babilonia", title: "El hombre más rico de Babilonia", author: "George S. Clason", note: "Parábolas sencillas sobre ahorro y paciencia. Ideal para empezar." },
  { id: "habitos-atomicos", image: "/assets/products/habitos-atomicos.webp", isbn: "9788418118036", sourceUrl: "https://www.planetadelibros.com/libro-habitos-atomicos/310441", buyUrl: "https://www.planetadelibros.com/libro-habitos-atomicos/310441", retailer: "la editorial", title: "Hábitos atómicos", author: "James Clear", note: "Cambios pequeños, sistema claro: cómo se construyen y se rompen los hábitos." },
  { id: "el-poder-de-los-habitos", title: "El poder de los hábitos", author: "Charles Duhigg", note: "El ciclo señal, rutina y recompensa, contado con casos de personas y empresas." },
  { id: "el-mundo-y-sus-demonios", title: "El mundo y sus demonios", author: "Carl Sagan", note: "La ciencia como una vela en la oscuridad: pensamiento crítico para todos." },
  { id: "feynman", title: "¿Está usted de broma, Sr. Feynman?", author: "Richard P. Feynman", note: "Las aventuras de un Nobel de Física curioso por todo. Contagia ganas de entender." },
  { id: "cosmos", title: "Cosmos", author: "Carl Sagan", note: "Un viaje por la historia de la ciencia y nuestro lugar en el universo." },
].map((b) => ({ ...b, type: "book" }));

/** Gadgets de lectura (afiliado). `query` = búsqueda en Amazon. */
export const gadgets = [
  { id: "e-reader", title: "Kindle Paperwhite", query: "kindle paperwhite", illustration: true, image: "/assets/products/e-reader.webp", note: "Pantalla de tinta electrónica, sin reflejos y con cientos de libros en el bolsillo." },
  { id: "lampara", title: "Glocusent Original · luz de lectura", query: "Glocusent Original luz lectura cuello", buyUrl: "https://glocusent.com/es/collections/glocusent-top-sellers/products/glocusent-eyecaring-led-neck-reading-light-gray", retailer: "Glocusent", illustration: true, image: "/assets/products/lampara.webp", note: "Luz cálida donde la necesitas, sin molestar a quien duerme al lado." },
  { id: "atril", title: "Atril para libros", query: "atril para libros madera", image: "/assets/products/atril.webp", note: "Mantiene el libro abierto y la espalda recta. Manos libres para tomar notas." },
  { id: "temporizador", title: "Temporizador de enfoque", query: "temporizador cubo pomodoro", image: "/assets/products/temporizador.webp", note: "Bloques de lectura de 25 minutos sin tocar el móvil." },
  { id: "notas-transparentes", title: "Notas adhesivas transparentes", query: "notas adhesivas transparentes", image: "/assets/products/notas.webp", note: "Anota sobre la página sin escribir en el libro. Perfectas para libros prestados." },
  { id: "guia-lectura", title: "Regla guía de lectura", query: "regla guia de lectura", image: "/assets/products/guia.webp", note: "Una guía visual para no perder la línea. Útil para practicar ritmo de lectura." },
].map((g) => ({ ...g, type: "gadget" }));

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

export const isAffiliate = () => AMAZON_TAG.trim().length > 0;

export function amazonUrl(query) {
  const url = new URL("https://www.amazon.es/s");
  url.searchParams.set("k", query);
  if (isAffiliate()) url.searchParams.set("tag", AMAZON_TAG.trim());
  return url.toString();
}

export function productUrl(item) {
  if (["course", "notebook"].includes(item.type)) return `/tienda/${item.slug}/`;
  if (item.buyUrl) return item.buyUrl;
  if (item.type === "book") return amazonUrl(`${item.title} ${item.author.split(" y ")[0]}`);
  return amazonUrl(item.query);
}

const byId = new Map([...books, ...gadgets, course, notebooks].map((p) => [p.id, p]));
export const getProduct = (id) => byId.get(id);
export const getSkill = (slug) => skills.find((s) => s.slug === slug);

/** Habilidades a las que pertenece un producto (derivado de las listas de cada habilidad). */
export function skillsOf(id) {
  if (id === course.id) return course.skills;
  if (id === notebooks.id) return notebooks.skills;
  return skills.filter((s) => s.books.includes(id) || s.gadgets.includes(id)).map((s) => s.slug);
}
