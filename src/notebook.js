"use strict";
const routes = {
  money: {
    name: "Dinero con criterio",
    label: "RUTA 01 · DINERO CON CRITERIO",
    title: "La psicología<br>del dinero",
    author: "MORGAN HOUSEL",
    question: "¿Lo quieres o quieres<br>que lo vean?",
    description:
      "Una lectura para explorar tu relación con el dinero y las expectativas que pones en él.",
    exercise:
      "Piensa en una compra reciente. Si nadie pudiera enterarse de que la tienes, ¿la seguirías queriendo?",
    link: "https://www.planetadelibros.com/libro-la-psicologia-del-dinero/334390?soporte=336728",
    limit:
      "Pregunta original de LectorLab; no es una cita del autor ni asesoramiento financiero. Libro no incluido.",
    color: "#f5f3ea",
  },
  relations: {
    name: "Relaciones y deseo",
    label: "RUTA 02 · RELACIONES Y DESEO ADULTO",
    title: "Tal como<br>eres",
    author: "EMILY NAGOSKI",
    question: "¿Qué necesitas<br>poder decir?",
    description:
      "Una lectura para explorar el deseo y encontrar palabras con las que abrir una conversación adulta.",
    exercise:
      "¿Qué te ayudaría a sentirte cómodo hablando sobre deseo, sin presión y desde el consentimiento?",
    link: "https://www.grupogaia.es/libros/tal-como-eres/9788415887577/",
    limit:
      "Pregunta original de LectorLab. Recomendación de lectura para adultos; no sustituye atención profesional. Libro no incluido.",
    color: "#f04432",
  },
  attention: {
    name: "Atención y hábitos",
    label: "RUTA 03 · ATENCIÓN Y HÁBITOS",
    title: "Hábitos<br>atómicos",
    author: "JAMES CLEAR",
    question: "¿Qué puedes<br>hacer más fácil?",
    description:
      "Una lectura para pensar cómo tu entorno y tus pequeñas decisiones se relacionan con tus hábitos.",
    exercise:
      "¿Dónde podrías dejar el libro esta noche para que empezar a leer mañana sea un poco más fácil?",
    link: "https://www.planetadelibros.com.mx/libro-habitos-atomicos/284207",
    limit:
      "Experimento original de LectorLab; no es una cita del autor ni una garantía de cambio de hábitos. Libro no incluido.",
    color: "#d7ff3f",
  },
};
const days = [
  [
    "Empieza con una pregunta.",
    "Escribe una pregunta concreta sobre {topic} que quieras explorar. Elige algo bajo tu control.",
  ],
  [
    "Mira tu punto de partida.",
    "Describe qué ocurre hoy y qué te gustaría entender mejor. No necesitas escribir datos íntimos ni cifras personales.",
  ],
  [
    "Encuentra tu lectura.",
    "Elige un libro que puedas obtener en biblioteca o un canal autorizado. Anota título, autor y qué sección responde a tu pregunta.",
  ],
  [
    "Haz tuya una idea.",
    "Lee durante diez minutos. Escribe una idea con tus palabras y anota el capítulo. Distingue lo que dice el autor de lo que interpretas.",
  ],
  [
    "Dale espacio a la duda.",
    "¿Es una opinión, un relato o una afirmación que necesita pruebas? Escribe una objeción o una situación en la que la idea podría no servir.",
  ],
  [
    "Prueba algo pequeño.",
    "Diseña una observación o una acción reversible para un día. Escribe qué cambiarás, qué observarás y qué no pondrás en riesgo.",
  ],
  [
    "Quédate con lo que aprendiste.",
    "¿Qué ocurrió? ¿Qué no puedes concluir a partir de un solo caso? Elige qué conservar, qué descartar y tu siguiente pregunta.",
  ],
];
const key = "lectorlab-notebook-v1";
let state = {
  route: "money",
  day: 0,
  notes: {},
  completed: {},
  remember: false,
};
let currentRoute = "money";
const $ = (id) => document.getElementById(id);
function validState(v) {
  return (
    v &&
    typeof v === "object" &&
    routes[v.route] &&
    Number.isInteger(v.day) &&
    v.day >= 0 &&
    v.day < 7 &&
    v.notes &&
    typeof v.notes === "object" &&
    !Array.isArray(v.notes) &&
    v.completed &&
    typeof v.completed === "object" &&
    !Array.isArray(v.completed) &&
    v.remember === true
  );
}
try {
  const saved = localStorage.getItem(key);
  if (saved) {
    const parsed = JSON.parse(saved);
    if (validState(parsed)) state = parsed;
  }
} catch (e) {
  /* Storage is optional; the notebook works in memory. */
}
const cell = () => state.route + "-" + state.day;
function status(text) {
  $("workbook-status").textContent = text;
}
function persist() {
  if (!state.remember) return;
  try {
    localStorage.setItem(key, JSON.stringify(state));
  } catch (e) {
    state.remember = false;
    $("remember").checked = false;
    status(
      "No se ha podido guardar. Puedes descargar tus notas para conservarlas.",
    );
  }
}
function saveCurrent() {
  state.notes[cell()] = $("note").value;
  state.completed[cell()] = $("complete").checked;
  persist();
}
function selectRoute(id) {
  if (!routes[id]) return;
  currentRoute = id;
  const r = routes[id];
  document.querySelectorAll("[data-route]").forEach((b) => {
    const yes = b.dataset.route === id;
    b.setAttribute("aria-selected", yes);
    b.tabIndex = yes ? 0 : -1;
  });
  $("route-panel").setAttribute("aria-labelledby", "tab-" + id);
  $("route-label").textContent = r.label;
  $("book-title").innerHTML = r.title;
  $("book-author").textContent = r.author;
  $("route-question").innerHTML = r.question;
  $("route-description").textContent = r.description;
  $("route-exercise").textContent = r.exercise;
  $("book-link").href = r.link;
  $("route-limit").textContent = r.limit;
  document.querySelector(".editorial-book").style.background = r.color;
}
function renderDay() {
  const r = routes[state.route];
  $("topic").value = state.route;
  $("day-number").textContent =
    "DÍA " + String(state.day + 1).padStart(2, "0") + " / 07";
  $("day-title").textContent = days[state.day][0];
  $("day-prompt").textContent = days[state.day][1].replace(
    "{topic}",
    r.name.toLowerCase(),
  );
  $("note").value =
    typeof state.notes[cell()] === "string"
      ? state.notes[cell()].slice(0, 6000)
      : "";
  $("complete").checked = state.completed[cell()] === true;
  $("prev-day").disabled = state.day === 0;
  $("next-day").textContent =
    state.day === 6 ? "Revisar mi recorrido ✓" : "Siguiente día →";
  $("remember").checked = state.remember;
  const list = document.querySelector(".day-list");
  list.replaceChildren();
  for (let i = 0; i < 7; i++) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = i === state.day ? "active" : "";
    if (i === state.day) b.setAttribute("aria-current", "step");
    b.setAttribute("aria-label", "Día " + (i + 1) + ": " + days[i][0]);
    const n = document.createElement("span");
    n.textContent = String(i + 1).padStart(2, "0");
    const label = document.createElement("span");
    label.className = "day-label";
    label.textContent = days[i][0].replace(".", "");
    b.append(n, label);
    if (state.completed[state.route + "-" + i]) {
      const check = document.createElement("span");
      check.textContent = "✓";
      b.append(check);
    }
    b.addEventListener("click", () => {
      saveCurrent();
      state.day = i;
      renderDay();
      persist();
      status("Día " + (i + 1) + " abierto.");
    });
    list.append(b);
  }
  let count = 0;
  for (let i = 0; i < 7; i++)
    if (state.completed[state.route + "-" + i] === true) count++;
  $("progress-fill").style.width = (count / 7) * 100 + "%";
  $("progress-fill").parentElement.setAttribute("aria-valuenow", count);
  $("progress-label").textContent = count + " de 7 días marcados";
}
document.querySelectorAll("[data-route]").forEach((b, i, all) => {
  b.addEventListener("click", () => selectRoute(b.dataset.route));
  b.addEventListener("keydown", (e) => {
    let j = i;
    if (e.key === "ArrowRight") j = (i + 1) % all.length;
    else if (e.key === "ArrowLeft") j = (i - 1 + all.length) % all.length;
    else if (e.key === "Home") j = 0;
    else if (e.key === "End") j = all.length - 1;
    else return;
    e.preventDefault();
    all[j].focus();
    selectRoute(all[j].dataset.route);
  });
});
$("use-route").addEventListener("click", () => {
  saveCurrent();
  state.route = currentRoute;
  state.day = 0;
  renderDay();
  persist();
  $("laboratorio").scrollIntoView({
    behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth",
  });
  status("Ruta " + routes[state.route].name + " abierta.");
});
$("topic").addEventListener("change", () => {
  const id = $("topic").value;
  saveCurrent();
  state.route = id;
  state.day = 0;
  renderDay();
  persist();
  status(
    "Ruta cambiada. Cada ruta conserva sus propias notas durante la sesión.",
  );
});
$("note").addEventListener("input", () => {
  saveCurrent();
  status(
    state.remember
      ? "Notas guardadas en este navegador."
      : "Notas en esta sesión. Descárgalas para conservarlas.",
  );
});
$("complete").addEventListener("change", () => {
  saveCurrent();
  renderDay();
  status(
    $("complete").checked
      ? "Día marcado como trabajado."
      : "Marca del día retirada.",
  );
});
$("prev-day").addEventListener("click", () => {
  saveCurrent();
  state.day = Math.max(0, state.day - 1);
  renderDay();
  persist();
  status("Día " + (state.day + 1) + " abierto.");
});
$("next-day").addEventListener("click", () => {
  saveCurrent();
  if (state.day < 6) {
    state.day++;
    renderDay();
    persist();
    status("Día " + (state.day + 1) + " abierto.");
  } else {
    let count = 0;
    for (let i = 0; i < 7; i++)
      if (state.completed[state.route + "-" + i] === true) count++;
    status(
      "Has marcado " +
        count +
        " de 7 días. Puedes revisar cualquier día y descargar tus notas. No necesitas completarlos de una vez.",
    );
  }
});
$("remember").addEventListener("change", () => {
  state.remember = $("remember").checked;
  if (state.remember) {
    persist();
    if (state.remember)
      status("Guardado local activado. Las notas no se envían a LectorLab.");
  } else {
    try {
      localStorage.removeItem(key);
      status("Guardado local desactivado. Tus notas siguen en esta sesión.");
    } catch (e) {
      status(
        "No se ha podido borrar el guardado anterior. Puedes borrarlo desde los ajustes del navegador.",
      );
    }
  }
});
$("export").addEventListener("click", () => {
  saveCurrent();
  let text =
    "LECTORLAB · DE LA IDEA A LA ACCIÓN\nMuestra gratuita · Mis notas\nEjercicios originales de LectorLab\n\n";
  for (const [id, r] of Object.entries(routes)) {
    const has = Array.from(
      { length: 7 },
      (_, i) => state.notes[id + "-" + i] || state.completed[id + "-" + i],
    ).some(Boolean);
    if (id !== state.route && !has) continue;
    text +=
      "RUTA: " +
      r.name +
      "\nLectura temática: " +
      r.title.replace(/<br>/g, " ") +
      " · " +
      r.author +
      "\n\n";
    days.forEach((d, i) => {
      text +=
        "DÍA " +
        (i + 1) +
        " · " +
        d[0] +
        "\n" +
        d[1].replace("{topic}", r.name.toLowerCase()) +
        "\n" +
        (state.notes[id + "-" + i] || "(Sin respuesta)") +
        "\nEstado: " +
        (state.completed[id + "-" + i] ? "Trabajado" : "Pendiente") +
        "\n\n";
    });
  }
  text +=
    "Estas notas son personales. Una lectura o una experiencia no garantiza resultados ni sustituye ayuda profesional.\n";
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "LectorLab-mis-notas.txt";
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  status("Se ha preparado la descarga de tus notas.");
});
$("reset").addEventListener("click", () => {
  $("reset-dialog").returnValue = "cancel";
  $("reset-dialog").showModal();
});
$("reset-dialog").addEventListener("close", () => {
  if ($("reset-dialog").returnValue !== "erase") return;
  state = { route: "money", day: 0, notes: {}, completed: {}, remember: false };
  let removed = true;
  try {
    localStorage.removeItem(key);
  } catch (e) {
    removed = false;
  }
  renderDay();
  status(
    removed
      ? "Cuaderno borrado. Puedes empezar con otra pregunta."
      : "Sesión borrada. No se ha podido eliminar el guardado anterior: bórralo desde los ajustes del navegador.",
  );
});
document
  .querySelectorAll(".mobile-nav nav a")
  .forEach((a) =>
    a.addEventListener(
      "click",
      () => (document.querySelector(".mobile-nav").open = false),
    ),
  );
selectRoute("money");
renderDay();
