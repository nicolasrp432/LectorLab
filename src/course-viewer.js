import * as THREE from "three";

/**
 * Visor 3D del curso «Lectura rápida y estratégica»: una caja-libro que se gira
 * arrastrando y que se inclina ligeramente con el puntero. Render bajo demanda.
 *
 * @param {HTMLElement} container
 * @param {typeof import("gsap").gsap} gsap
 */
export function createCourseViewer(container, gsap) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
  } catch {
    return null;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;
  renderer.domElement.setAttribute("aria-hidden", "true");
  container.append(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 40);
  camera.position.set(0, 0.2, 9);
  scene.add(new THREE.AmbientLight(0xffffff, 2.4));
  const key = new THREE.DirectionalLight(0xffffff, 4.2);
  key.position.set(-4, 5, 7);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xf04432, 1.1);
  rim.position.set(5, -2, -4);
  scene.add(rim);

  const textures = [];
  function canvasTexture(w, h, paint) {
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    paint(canvas.getContext("2d"), w, h);
    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 4);
    textures.push(t);
    return t;
  }

  const front = canvasTexture(768, 1036, (c, w, h) => {
    c.fillStyle = "#d7ff3f";
    c.fillRect(0, 0, w, h);
    c.fillStyle = "#121212";
    c.font = "600 34px Space, sans-serif";
    c.fillText("lectorlab / curso 01", 60, 90);
    c.fillRect(60, 125, w - 120, 2);
    c.font = "700 118px Space, sans-serif";
    ["LECTURA", "RÁPIDA", "Y ESTRA-", "TÉGICA."].forEach((l, i) => c.fillText(l, 54, 290 + i * 112));
    c.font = "italic 400 64px Instrument, serif";
    c.fillText("Lee mejor. Aprende todo.", 60, 820);
    c.font = "600 24px Space, sans-serif";
    c.fillText("6 MÓDULOS · A TU RITMO", 60, 960);
    c.font = "400 70px Instrument, serif";
    c.fillText("↗", w - 120, 965);
  });
  const back = canvasTexture(768, 1036, (c, w, h) => {
    c.fillStyle = "#f5f3ea";
    c.fillRect(0, 0, w, h);
    c.fillStyle = "#121212";
    c.font = "600 30px Space, sans-serif";
    c.fillText("LO QUE VAS A ENTRENAR", 60, 110);
    c.fillRect(60, 140, w - 120, 2);
    c.font = "500 40px Space, sans-serif";
    ["01  Lee con un objetivo", "02  Previsualiza", "03  Menos relecturas", "04  Lectura selectiva", "05  Recordar lo leído", "06  Tu sistema"].forEach(
      (l, i) => c.fillText(l, 60, 240 + i * 92),
    );
    c.fillStyle = "#f04432";
    c.beginPath();
    c.arc(w - 150, h - 160, 80, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = "#121212";
    c.font = "400 110px Instrument, serif";
    c.fillText("✳", w - 190, h - 125);
  });
  const spine = canvasTexture(256, 1036, (c, w, h) => {
    c.fillStyle = "#121212";
    c.fillRect(0, 0, w, h);
    c.save();
    c.translate(w / 2 + 16, h - 60);
    c.rotate(-Math.PI / 2);
    c.fillStyle = "#d7ff3f";
    c.font = "700 54px Space, sans-serif";
    c.fillText("LECTORLAB ✳ LEER MEJOR", 0, 0);
    c.restore();
  });
  const pages = canvasTexture(256, 1036, (c, w, h) => {
    c.fillStyle = "#f5f3ea";
    c.fillRect(0, 0, w, h);
    c.fillStyle = "#c3c3b9";
    for (let x = 6; x < w; x += 9) c.fillRect(x, 0, 2, h);
  });
  const pagesTop = canvasTexture(256, 256, (c, w, h) => {
    c.fillStyle = "#f5f3ea";
    c.fillRect(0, 0, w, h);
    c.fillStyle = "#c3c3b9";
    for (let y = 6; y < h; y += 9) c.fillRect(0, y, w, 2);
  });

  const m = (map, roughness = 0.75) => new THREE.MeshStandardMaterial({ map, roughness });
  const materials = [m(pages, 1), m(spine, 0.6), m(pagesTop, 1), m(pagesTop, 1), m(front, 0.55), m(back, 0.8)];
  const geo = new THREE.BoxGeometry(2.3, 3.1, 0.62);
  const box = new THREE.Mesh(geo, materials);
  const group = new THREE.Group();
  group.add(box);
  scene.add(group);

  // Anillo orbital decorativo y «luna» lima.
  const ringGeo = new THREE.TorusGeometry(2.45, 0.012, 8, 120);
  const ringMat = new THREE.MeshBasicMaterial({ color: "#121212" });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.set(1.2, 0.25, 0);
  scene.add(ring);
  const moonGeo = new THREE.SphereGeometry(0.16, 24, 16);
  const moonMat = new THREE.MeshStandardMaterial({ color: "#f04432", roughness: 0.45 });
  const moon = new THREE.Mesh(moonGeo, moonMat);
  scene.add(moon);

  const REST = 0.45; // ángulo de reposo: portada con el lomo visible a la izquierda
  const pose = { ry: REST - 3.1, rx: 0.05, tiltX: 0, tiltY: 0, moon: 0 };
  let raf = 0,
    disposed = false,
    visible = true;

  function draw() {
    raf = 0;
    if (disposed || !visible || document.hidden) return;
    group.rotation.set(pose.rx + pose.tiltY * 0.15, pose.ry + pose.tiltX * 0.25, -0.06);
    const a = pose.moon + pose.ry * 0.35;
    moon.position.set(Math.cos(a) * 2.45, Math.sin(a) * 2.45 * Math.cos(1.2) * 0.4, Math.sin(a) * 2.45 * Math.sin(1.2) * 0.4);
    moon.position.applyEuler(new THREE.Euler(0, 0.25, 0));
    renderer.render(scene, camera);
  }
  const requestDraw = () => {
    if (!raf && !disposed) raf = requestAnimationFrame(draw);
  };

  function resize() {
    const w = container.clientWidth,
      h = container.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.position.z = w / h < 0.85 ? 10.8 : 9;
    camera.updateProjectionMatrix();
    requestDraw();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(container);
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible) requestDraw();
  });
  io.observe(container);

  /* Arrastrar para girar; inclinación suave con el puntero. */
  const canvas = renderer.domElement;
  canvas.style.touchAction = "pan-y";
  canvas.style.cursor = "grab";
  let drag = null;
  function down(e) {
    drag = { x: e.clientX, ry: pose.ry };
    canvas.setPointerCapture(e.pointerId);
    canvas.style.cursor = "grabbing";
    gsap.killTweensOf(pose, "ry");
  }
  function move(e) {
    const r = container.getBoundingClientRect();
    if (drag) {
      pose.ry = drag.ry + ((e.clientX - drag.x) / r.width) * Math.PI * 1.6;
      requestDraw();
      return;
    }
    if (!matchMedia("(pointer:fine)").matches) return;
    gsap.to(pose, {
      tiltX: (e.clientX - r.left) / r.width - 0.5,
      tiltY: (e.clientY - r.top) / r.height - 0.5,
      duration: 0.5,
      overwrite: "auto",
      onUpdate: requestDraw,
    });
  }
  function up(e) {
    if (!drag) return;
    drag = null;
    canvas.style.cursor = "grab";
    if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
    // Vuelve suavemente a la cara más cercana (portada o contraportada).
    const target = Math.round((pose.ry - REST) / Math.PI) * Math.PI + REST;
    gsap.to(pose, { ry: target, duration: 0.8, ease: "power3.out", onUpdate: requestDraw });
  }
  function leave() {
    gsap.to(pose, { tiltX: 0, tiltY: 0, duration: 0.6, overwrite: "auto", onUpdate: requestDraw });
  }
  const visibility = () => !document.hidden && requestDraw();
  canvas.addEventListener("pointerdown", down);
  canvas.addEventListener("pointermove", move, { passive: true });
  canvas.addEventListener("pointerup", up);
  canvas.addEventListener("pointercancel", up);
  canvas.addEventListener("pointerleave", leave);
  document.addEventListener("visibilitychange", visibility);

  resize();
  container.classList.add("ready");
  const intro = gsap.to(pose, { ry: REST, moon: 1.4, duration: 1.6, ease: "power3.out", onUpdate: requestDraw });

  return {
    /** Giro adicional vinculado al scroll (0–1). */
    setScroll(p) {
      if (drag || intro.isActive()) return;
      pose.rx = 0.05 + (p - 0.5) * 0.25;
      requestDraw();
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(raf);
      intro.kill();
      gsap.killTweensOf(pose);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", visibility);
      [geo, ringGeo, moonGeo].forEach((g) => g.dispose());
      [...materials, ringMat, moonMat].forEach((mm) => mm.dispose());
      textures.forEach((t) => t.dispose());
      renderer.dispose();
      canvas.remove();
      container.classList.remove("ready");
    },
  };
}
