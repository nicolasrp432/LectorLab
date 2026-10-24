/**
 * Comportamiento común a todas las páginas:
 * estilos, preferencia de movimiento, menú móvil, tarjetas con inclinación 3D
 * y apariciones al hacer scroll. Sin animaciones continuas: todo responde
 * al scroll o al puntero.
 */
import "./style.css";
import "./store.css";
import "./editorial.css";

const STORAGE_KEY = "lectorlab-motion";
const media = window.matchMedia("(prefers-reduced-motion: reduce)");
const listeners = new Set();
let stopped = media.matches || readPref() === "off";

function readPref() {
  try {
    return sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}
function writePref(value) {
  try {
    sessionStorage.setItem(STORAGE_KEY, value);
  } catch {
    /* Preferencia opcional. */
  }
}

/** Estado de movimiento compartido. `onChange` avisa al pausar/reanudar. */
export const motion = {
  get stopped() {
    return stopped;
  },
  onChange(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};

const toggle = document.getElementById("motion-toggle");
function applyMotion() {
  document.documentElement.dataset.motion = stopped ? "off" : "on";
  if (toggle) {
    toggle.textContent = stopped ? "Activar animaciones" : "Pausar animaciones";
    toggle.setAttribute("aria-pressed", String(stopped));
  }
  listeners.forEach((fn) => fn(stopped));
}
toggle?.addEventListener("click", () => {
  stopped = !stopped;
  writePref(stopped ? "off" : "on");
  applyMotion();
});
media.addEventListener("change", (e) => {
  stopped = e.matches || readPref() === "off";
  applyMotion();
});
applyMotion();

/* Menú móvil: se cierra al navegar a un ancla. */
const mobileNav = document.querySelector(".mobile-nav");
mobileNav?.querySelectorAll("nav a").forEach((a) =>
  a.addEventListener("click", () => {
    mobileNav.open = false;
  }),
);

mobileNav?.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    mobileNav.open = false;
    mobileNav.querySelector("summary")?.focus();
  }
});

/* Barra de progreso de lectura (CSS custom property, sin librerías). */
const progress = document.querySelector(".reading-progress");
if (progress) {
  let ticking = false;
  const update = () => {
    ticking = false;
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`;
  };
  addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true },
  );
  update();
}

/* Inclinación 3D al pasar el puntero ([data-tilt]). */
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
document.querySelectorAll("[data-tilt]").forEach((el) => {
  el.addEventListener("pointermove", (e) => {
    if (stopped || !finePointer.matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--ry", `${(x * 10).toFixed(2)}deg`);
    el.style.setProperty("--rx", `${(-y * 8).toFixed(2)}deg`);
    el.style.setProperty("--mx", `${((x + 0.5) * 100).toFixed(1)}%`);
    el.style.setProperty("--my", `${((y + 0.5) * 100).toFixed(1)}%`);
  });
  el.addEventListener("pointerleave", () => {
    el.style.removeProperty("--ry");
    el.style.removeProperty("--rx");
  });
});

/* Apariciones al entrar en pantalla. Sin JS o sin movimiento, todo visible. */
const revealTargets = document.querySelectorAll(
  ".section-heading, .skill-card, .product-card, .why-list li, .module, .exercise, .honesty-card, .featured-course, .course-band, .faq-items, .lab-teaser-copy, .master-copy, .peter-copy",
);
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      }),
    { rootMargin: "0px 0px -8% 0px" },
  );
  revealTargets.forEach((el, i) => {
    el.classList.add("reveal");
    el.style.setProperty("--d", `${(i % 4) * 60}ms`);
    io.observe(el);
  });
}

/**
 * Carga diferida de una escena WebGL cuando el contenedor se acerca a la vista.
 * Respeta movimiento reducido y ahorro de datos (se queda la versión CSS).
 */
export function lazyScene(container, loader) {
  if (!container || navigator.connection?.saveData || !("IntersectionObserver" in window)) return;
  let scene = null;
  let loading = false;
  let disposed = false;
  let generation = 0;
  const start = () => {
    if (scene || loading || stopped || disposed) return;
    loading = true;
    const token = generation;
    loader().then(s => {
      if (stopped || disposed || token !== generation) s?.dispose();
      else scene = s;
    }).catch(() => {}).finally(() => {
      loading = false;
      if (token !== generation && !stopped && !disposed) {
        const r = container.getBoundingClientRect();
        if (r.top < innerHeight + 200 && r.bottom > -200) start();
      }
    });
  };
  const io = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) start();
  }, {rootMargin: "200px"});
  io.observe(container);
  const unsubscribe = motion.onChange(isStopped => {
    generation++;
    if (isStopped) { scene?.dispose(); scene = null; }
    else { const r = container.getBoundingClientRect(); if (r.top < innerHeight + 200 && r.bottom > -200) start(); }
  });
  addEventListener("pagehide", (event) => {
    disposed = true;
    generation++;
    io.disconnect();
    if (!event.persisted) unsubscribe();
    scene?.dispose();
    scene = null;
  });
  addEventListener("pageshow", (event) => {
    if (!event.persisted) return;
    disposed = false;
    io.observe(container);
    const r = container.getBoundingClientRect();
    if (r.top < innerHeight + 200 && r.bottom > -200) start();
  });
}
