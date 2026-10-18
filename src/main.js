import "./style.css";
import "./notebook.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
const systemMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const control = document.getElementById("motion-toggle");
const hero = document.querySelector(".hero");
const openBook = document.getElementById("open-book");
let stopped = systemMotion.matches;
let context;
let scene;
let bookOpen = false;
let loadId = 0;

function buildMotion() {
  context?.revert();
  context = null;
  scene?.dispose();
  scene = null;
  loadId++;
  control.textContent = stopped ? "Activar animaciones" : "Pausar animaciones";
  control.setAttribute("aria-pressed", String(stopped));
  document.documentElement.dataset.motion = stopped ? "off" : "on";
  openBook.disabled = stopped;
  openBook.textContent = stopped ? "Vista sin movimiento" : "Abre el libro ↗";
  openBook.setAttribute("aria-pressed", "false");
  bookOpen = false;
  if (stopped) return;

  context = gsap.context(() => {
    gsap.from(".hero-copy h1 > span:not(.headline-star), .hero-copy h1 em", {
      y: 22,
      opacity: 0,
      duration: 0.65,
      stagger: 0.07,
      ease: "power3.out",
      clearProps: "all",
    });
    gsap.from(".hero-lead,.hero-actions", {
      y: 12,
      opacity: 0,
      duration: 0.45,
      delay: 0.35,
      stagger: 0.08,
      clearProps: "all",
    });
    gsap.to(".reading-progress", {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.1,
      },
    });
    gsap.to(".marquee-track", {
      xPercent: -17,
      ease: "none",
      scrollTrigger: {
        trigger: ".marquee",
        start: "top bottom",
        end: "bottom top",
        scrub: 0.8,
      },
    });
    document
      .querySelectorAll(
        ".section-heading,.route-panel,.kit-copy,.workbook,.peter-copy,.faq-items,.closing h2",
      )
      .forEach((el) => {
        gsap.from(el, {
          y: 16,
          opacity: 0,
          duration: 0.4,
          ease: "power1.out",
          scrollTrigger: { trigger: el, start: "top 91%", once: true },
          clearProps: "all",
        });
      });
    gsap.from(".route-tabs>button", {
      y: 12,
      opacity: 0,
      stagger: 0.05,
      duration: 0.35,
      clearProps: "all",
      scrollTrigger: { trigger: ".route-tabs", start: "top 88%", once: true },
    });
    gsap.to(".kit-book", {
      rotateZ: -4,
      rotateY: 8,
      y: -20,
      ease: "none",
      scrollTrigger: {
        trigger: "#kit",
        start: "top bottom",
        end: "bottom top",
        scrub: 0.8,
      },
    });
    gsap.to(".kit-sticker", {
      rotate: -8,
      y: 20,
      ease: "none",
      scrollTrigger: {
        trigger: "#kit",
        start: "top bottom",
        end: "bottom top",
        scrub: 0.8,
      },
    });
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".method-section",
          start: "top 90px",
          end: "+=65%",
          pin: ".method-frame",
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });
      tl.to(".note-sheet", {
        rotate: 7,
        rotateY: 12,
        y: -15,
        ease: "none",
        duration: 1,
      });
      tl.fromTo(
        ".method-step:nth-child(2)",
        { x: 12 },
        { x: 0, duration: 0.5 },
        0,
      );
      tl.fromTo(
        ".method-step:nth-child(3)",
        { x: 24 },
        { x: 0, duration: 0.5 },
        0.5,
      );
    });
    return () => mm.revert();
  });
  if (!navigator.connection?.saveData) {
    openBook.disabled = true;
    openBook.textContent = "Cargando libro…";
    const id = loadId;
    Promise.all([import("./scene.js"), document.fonts.ready])
      .then(([module]) => {
        if (id !== loadId || stopped) return;
        scene = module.createBookScene(
          document.getElementById("book-scene"),
          gsap,
        );
        if (!scene) {
          openBook.textContent = "Vista ilustrada";
          openBook.disabled = true;
          return;
        }
        scene.setOpen(bookOpen ? 1 : 0);
        openBook.disabled = false;
        openBook.textContent = "Abre el libro ↗";
        const trigger = ScrollTrigger.create({
          trigger: hero,
          start: "top top",
          end: "bottom top",
          onUpdate: (self) => scene?.setScroll(self.progress),
        });
        const dispose = scene.dispose;
        scene.dispose = () => {
          trigger.kill();
          dispose();
        };
      })
      .catch(() => {
        openBook.textContent = "Vista ilustrada";
        openBook.disabled = true;
      });
  } else {
    openBook.textContent = "Ahorro de datos activo";
    openBook.disabled = true;
  }
  document.fonts.ready.then(() => ScrollTrigger.refresh());
}

openBook.addEventListener("click", () => {
  if (!scene) return;
  bookOpen = !bookOpen;
  scene.setOpen(bookOpen ? 1 : 0);
  openBook.setAttribute("aria-pressed", String(bookOpen));
  openBook.textContent = bookOpen ? "Cierra el libro ↙" : "Abre el libro ↗";
});
control.addEventListener("click", () => {
  stopped = !stopped;
  buildMotion();
});
systemMotion.addEventListener("change", (event) => {
  stopped = event.matches;
  buildMotion();
});
document.querySelectorAll("[data-route]").forEach((button) =>
  button.addEventListener("click", () => {
    if (stopped) return;
    gsap.fromTo(
      ".route-copy",
      { opacity: 0.65, y: 5 },
      { opacity: 1, y: 0, duration: 0.22, overwrite: true, clearProps: "all" },
    );
    gsap.fromTo(
      ".editorial-book",
      { rotateZ: -10 },
      { rotateZ: -8, duration: 0.3, overwrite: true },
    );
  }),
);
buildMotion();
window.addEventListener("pagehide", () => {
  loadId++;
  context?.revert();
  scene?.dispose();
});
