/**
 * Home: escena 3D de habilidades, visor del curso, cohete con scroll
 * y animaciones GSAP. Todo se desmonta si se pausa el movimiento.
 */
import { motion, lazyScene } from "./common.js";
import { skills } from "./data/catalog.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const hero = document.querySelector(".hero");
const chips = [...document.querySelectorAll(".skill-chips [data-skill]")];
/* ---------------- Escena del hero ---------------- */
const markChip = (slug) => chips.forEach((c) => c.classList.toggle("is-active", c.dataset.skill === slug));

lazyScene(document.getElementById("skills-scene"), async () => {
  const [{ createSkillsScene }] = await Promise.all([import("./skills-scene.js"), document.fonts.ready]);
  if (motion.stopped) throw new Error("motion off");
  const scene = createSkillsScene(document.getElementById("skills-scene"), gsap, {
    skills,
    onSelect: (slug) => (location.href = `/habilidades/${slug}/`),
    onHover: markChip,
  });
  if (!scene) throw new Error("no webgl");
  const trigger = ScrollTrigger.create({
    trigger: hero,
    start: "top top",
    end: "bottom top",
    onUpdate: (self) => scene.setScroll(self.progress),
  });
  const enter = (e) => scene.highlight(e.currentTarget.dataset.skill);
  const out = () => scene.highlight(null);
  chips.forEach((c) => {
    c.addEventListener("pointerenter", enter);
    c.addEventListener("focus", enter);
    c.addEventListener("pointerleave", out);
    c.addEventListener("blur", out);
  });
  const dispose = scene.dispose;
  return {
    dispose() {
      trigger.kill();
      chips.forEach((c) => {
        c.removeEventListener("pointerenter", enter);
        c.removeEventListener("focus", enter);
        c.removeEventListener("pointerleave", out);
        c.removeEventListener("blur", out);
      });
      markChip(null);
      dispose();
    },
  };
});

/* ---------------- Visor del curso ---------------- */
const courseEl = document.getElementById("course-scene");
lazyScene(courseEl, async () => {
  const [{ createCourseViewer }] = await Promise.all([import("./course-viewer.js"), document.fonts.ready]);
  if (motion.stopped) throw new Error("motion off");
  const viewer = createCourseViewer(courseEl, gsap);
  if (!viewer) throw new Error("no webgl");
  const trigger = ScrollTrigger.create({
    trigger: "#curso",
    start: "top bottom",
    end: "bottom top",
    onUpdate: (self) => viewer.setScroll(self.progress),
  });
  const dispose = viewer.dispose;
  return {
    dispose() {
      trigger.kill();
      dispose();
    },
  };
});

/* ---------------- Animaciones GSAP ---------------- */
let context;
function buildMotion(stopped) {
  context?.revert();
  context = null;
  if (stopped) return;
  context = gsap.context(() => {
    gsap.from(".hero-copy h1 > span:not(.headline-star), .hero-copy h1 em", {
      y: 24,
      opacity: 0,
      duration: 0.65,
      stagger: 0.07,
      ease: "power3.out",
      clearProps: "all",
    });
    gsap.from(".hero-lead, .hero-actions, .hero-peter-badge, .skill-chips li", {
      y: 12,
      opacity: 0,
      duration: 0.45,
      delay: 0.35,
      stagger: 0.04,
      clearProps: "all",
    });
    gsap.to(".marquee-track", {
      xPercent: -25,
      ease: "none",
      scrollTrigger: { trigger: ".marquee", start: "top bottom", end: "bottom top", scrub: 0.8 },
    });
    gsap.to(".hero-peter-badge", {
      y: 16,
      ease: "none",
      scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 0.8 },
    });

    // Cohete: sube por la trayectoria hasta la Luna con el scroll.
    gsap.set("#rocket", { opacity: 1 });
    gsap.fromTo(
      "#rocket",
      { motionPath: { path: "#rocket-path", align: "#rocket-path", alignOrigin: [0.5, 0.5], autoRotate: 90, start: 0, end: 0 } },
      {
        motionPath: { path: "#rocket-path", align: "#rocket-path", alignOrigin: [0.5, 0.5], autoRotate: 90, start: 0, end: 1 },
        ease: "none",
        scrollTrigger: { trigger: ".rocket-section", start: "top 75%", end: "bottom 45%", scrub: 0.6 },
      },
    );
    gsap.fromTo(
      ".rocket-path",
      { strokeDashoffset: 900 },
      {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: { trigger: ".rocket-section", start: "top 75%", end: "bottom 45%", scrub: 0.6 },
      },
    );
    gsap.from(".moon", {
      scale: 0.6,
      transformOrigin: "50% 50%",
      ease: "none",
      scrollTrigger: { trigger: ".rocket-section", start: "top 80%", end: "bottom 50%", scrub: 0.6 },
    });

    gsap.to(".master-sticker", {
      rotate: -10,
      y: 24,
      ease: "none",
      scrollTrigger: { trigger: "#curso", start: "top bottom", end: "bottom top", scrub: 0.8 },
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
      tl.to(".note-sheet", { rotate: 7, rotateY: 12, y: -15, ease: "none", duration: 1 });
      tl.fromTo(".method-step:nth-child(2)", { x: 12 }, { x: 0, duration: 0.5 }, 0);
      tl.fromTo(".method-step:nth-child(3)", { x: 24 }, { x: 0, duration: 0.5 }, 0.5);
    });
    return () => mm.revert();
  });
  document.fonts.ready.then(() => ScrollTrigger.refresh());
}
motion.onChange(buildMotion);
buildMotion(motion.stopped);
addEventListener("pagehide", () => context?.revert());
