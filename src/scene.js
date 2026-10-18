import * as THREE from "three";

/** A lightweight original book, rendered only when a scroll/pointer/tween changes it. */
export function createBookScene(container, gsap) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "low-power",
    });
  } catch {
    return null;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.35;
  renderer.domElement.setAttribute("aria-hidden", "true");
  container.append(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 40);
  camera.position.set(0, 0.1, 7.6);
  scene.add(new THREE.AmbientLight(0xffffff, 2.8));
  const key = new THREE.DirectionalLight(0xffffff, 4.3);
  key.position.set(-3, 5, 8);
  scene.add(key);
  const edge = new THREE.DirectionalLight(0xe1ff90, 1.3);
  edge.position.set(4, -1, -2);
  scene.add(edge);
  const book = new THREE.Group();
  scene.add(book);
  const width = 2.5,
    height = 3.45,
    thickness = 0.3;
  const paper = new THREE.MeshStandardMaterial({
    color: "#f5f3ea",
    roughness: 0.9,
  });
  const lime = new THREE.MeshStandardMaterial({
    color: "#d7ff3f",
    roughness: 0.55,
    metalness: 0.04,
  });
  const dark = new THREE.MeshStandardMaterial({
    color: "#121212",
    roughness: 0.8,
  });
  const resources = [];
  function box(w, h, d, mat, x = 0, y = 0, z = 0, parent = book) {
    const geo = new THREE.BoxGeometry(w, h, d);
    resources.push(geo);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    parent.add(mesh);
    return mesh;
  }
  box(width, height, 0.055, lime, 0, 0, -thickness / 2);
  box(width - 0.1, height - 0.12, thickness, paper, 0, 0, 0);
  box(0.08, height, thickness + 0.12, lime, -width / 2, 0, 0);
  for (let i = 0; i < 12; i++)
    box(
      width - 0.11,
      0.012,
      0.004,
      paper,
      0,
      -height / 2 + 0.12 + i * 0.27,
      thickness / 2 + 0.008,
    );
  const hinge = new THREE.Group();
  hinge.position.set(-width / 2, 0, thickness / 2 + 0.035);
  book.add(hinge);
  function texture(lines, background, fontSize, face = "Space") {
    const canvas = document.createElement("canvas");
    canvas.width = 768;
    canvas.height = 1056;
    const c = canvas.getContext("2d");
    c.fillStyle = background;
    c.fillRect(0, 0, 768, 1056);
    c.fillStyle = "#121212";
    c.font = "600 38px Space, sans-serif";
    c.fillText("lectorlab / 01", 65, 95);
    c.fillRect(65, 140, 638, 2);
    c.font = `600 ${fontSize}px ${face}, sans-serif`;
    lines.forEach((line, i) =>
      c.fillText(line, 62, 300 + i * (fontSize * 0.94)),
    );
    c.font = "500 22px Space, sans-serif";
    c.fillText("ABRE. CUESTIONA. PRUEBA.", 65, 978);
    c.font = "400 58px Instrument, serif";
    c.fillText("↗", 650, 980);
    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 4);
    resources.push(t);
    return t;
  }
  const coverTexture = texture(
    ["EL PODER", "DEL", "CONOCI-", "MIENTO."],
    "#d7ff3f",
    121,
  );
  const coverMat = new THREE.MeshStandardMaterial({
    map: coverTexture,
    roughness: 0.7,
  });
  box(
    width,
    height,
    0.07,
    [lime, lime, lime, lime, coverMat, lime],
    width / 2,
    0,
    0,
    hinge,
  );
  const insideTexture = texture(
    ["¿Y ESTO", "QUÉ CAMBIA", "EN MI", "VIDA?"],
    "#f5f3ea",
    102,
  );
  const insideMat = new THREE.MeshStandardMaterial({
    map: insideTexture,
    roughness: 1,
  });
  const planeGeo = new THREE.PlaneGeometry(width - 0.15, height - 0.16);
  resources.push(planeGeo);
  const page = new THREE.Mesh(planeGeo, insideMat);
  page.position.set(0.02, 0, thickness / 2 + 0.013);
  book.add(page);
  const bookmark = box(
    0.23,
    0.85,
    0.025,
    dark,
    0.72,
    -height / 2 - 0.22,
    0.015,
  );
  bookmark.rotation.z = 0.05;
  const pose = { open: 0, scroll: 0, x: 0, y: 0 };
  let visible = true,
    disposed = false,
    raf = 0;
  function draw() {
    raf = 0;
    if (disposed || !visible || document.hidden) return;
    book.rotation.set(
      -0.1 + pose.y * 0.08 + pose.scroll * 0.08,
      -0.35 + pose.x * 0.1 + pose.scroll * 0.12,
      0.16 - pose.scroll * 0.18,
    );
    const openness = Math.max(pose.open, pose.scroll * 0.85);
    book.position.set(0.05 + openness * 0.45, -0.08 + pose.scroll * 0.1, 0);
    hinge.rotation.y = -openness * 2.65;
    renderer.render(scene, camera);
  }
  function requestDraw() {
    if (!raf && !disposed) raf = requestAnimationFrame(draw);
  }
  function resize() {
    const w = container.clientWidth,
      h = container.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.position.z = w < 400 ? 8.5 : 7.6;
    camera.updateProjectionMatrix();
    requestDraw();
  }
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);
  const observer = new IntersectionObserver(
    ([e]) => {
      visible = e.isIntersecting;
      if (visible) requestDraw();
    },
    { rootMargin: "30px" },
  );
  observer.observe(container);
  const parent = container.parentElement;
  function pointer(e) {
    if (!matchMedia("(pointer:fine)").matches) return;
    const r = container.getBoundingClientRect();
    gsap.to(pose, {
      x: (e.clientX - r.left) / r.width - 0.5,
      y: (e.clientY - r.top) / r.height - 0.5,
      duration: 0.4,
      overwrite: "auto",
      onUpdate: requestDraw,
    });
  }
  function leave() {
    gsap.to(pose, {
      x: 0,
      y: 0,
      duration: 0.4,
      overwrite: "auto",
      onUpdate: requestDraw,
    });
  }
  function visibility() {
    if (!document.hidden) requestDraw();
  }
  parent.addEventListener("pointermove", pointer, { passive: true });
  parent.addEventListener("pointerleave", leave);
  document.addEventListener("visibilitychange", visibility);
  renderer.domElement.addEventListener(
    "webglcontextlost",
    () => {
      container.classList.remove("ready");
    },
    { once: true },
  );
  resize();
  container.classList.add("ready");
  return {
    setScroll(p) {
      pose.scroll = p;
      requestDraw();
    },
    setOpen(p) {
      gsap.to(pose, {
        open: p,
        duration: 0.9,
        ease: "power2.inOut",
        overwrite: "auto",
        onUpdate: requestDraw,
      });
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(raf);
      gsap.killTweensOf(pose);
      resizeObserver.disconnect();
      observer.disconnect();
      parent.removeEventListener("pointermove", pointer);
      parent.removeEventListener("pointerleave", leave);
      document.removeEventListener("visibilitychange", visibility);
      resources.forEach((r) => r.dispose());
      [paper, lime, dark, coverMat, insideMat].forEach((m) => m.dispose());
      renderer.dispose();
      renderer.domElement.remove();
      container.classList.remove("ready");
    },
  };
}
