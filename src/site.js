/**
 * Páginas interiores (habilidades, tienda, curso, afiliados, 404).
 * Carga GSAP y Three.js solo donde hay un visor 3D.
 */
import { motion, lazyScene } from "./common.js";

/* ---------------- Filtros de la tienda ---------------- */
const grid = document.getElementById("product-grid");
if (grid) {
  const typeButtons = [...document.querySelectorAll("[data-filter-type]")];
  const skillSelect = document.getElementById("filter-skill");
  const count = document.getElementById("filter-count");
  const empty = document.getElementById("filter-empty");
  const featured = document.querySelector(".featured-course");
  const cards = [...grid.querySelectorAll(".product-card")];
  const TYPES = new Set(["all", "course", "notebook", "book", "gadget"]);

  const params = new URLSearchParams(location.search);
  let type = TYPES.has(params.get("tipo")) ? params.get("tipo") : "all";
  let skill = [...skillSelect.options].some((o) => o.value === params.get("habilidad")) ? params.get("habilidad") : "all";

  const matches = (el) =>
    (type === "all" || el.dataset.type === type) && (skill === "all" || el.dataset.skills.split(" ").includes(skill));

  function apply(updateUrl = true) {
    typeButtons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.filterType === type)));
    skillSelect.value = skill;
    let visible = 0;
    cards.forEach((card) => {
      const show = matches(card);
      card.hidden = !show;
      if (show) visible++;
    });
    if (featured) {
      const show = matches(featured);
      featured.closest("section").hidden = !show;
      if (show) visible++;
    }
    count.textContent = visible === 1 ? "1 producto" : `${visible} productos`;
    empty.hidden = visible > 0;
    if (updateUrl) {
      const url = new URL(location.href);
      type === "all" ? url.searchParams.delete("tipo") : url.searchParams.set("tipo", type);
      skill === "all" ? url.searchParams.delete("habilidad") : url.searchParams.set("habilidad", skill);
      history.replaceState(null, "", url);
    }
  }
  typeButtons.forEach((b) =>
    b.addEventListener("click", () => {
      type = b.dataset.filterType;
      apply();
    }),
  );
  skillSelect.addEventListener("change", () => {
    skill = skillSelect.value;
    apply();
  });
  document.getElementById("filter-reset")?.addEventListener("click", () => {
    type = "all";
    skill = "all";
    apply();
  });
  apply(false);
}

/* ---------------- Visor 3D del curso ---------------- */
const courseEl = document.getElementById("course-scene");
if (courseEl) {
  lazyScene(courseEl, async () => {
    const [{ createCourseViewer }, { gsap }] = await Promise.all([
      import("./course-viewer.js"),
      import("gsap"),
      document.fonts.ready,
    ]);
    if (motion.stopped) throw new Error("motion off");
    const viewer = createCourseViewer(courseEl, gsap);
    if (!viewer) throw new Error("no webgl");
    return viewer;
  });
}

/* ---------------- Tótem 3D de habilidad ---------------- */
const skillEl = document.getElementById("skill-scene");
if (skillEl) {
  lazyScene(skillEl, async () => {
    const [{ createSkillTotemScene }, { gsap }] = await Promise.all([
      import("./skill-scene.js"),
      import("gsap"),
      document.fonts.ready,
    ]);
    if (motion.stopped) throw new Error("motion off");
    const icon = skillEl.dataset.skillIcon || "coin";
    const color = skillEl.dataset.skillColor || "lime";
    const totem = createSkillTotemScene(skillEl, gsap, { icon, color });
    if (!totem) throw new Error("no webgl");
    return totem;
  });
}

