import * as THREE from "three";

/**
 * Escena del hero: el libro de LectorLab se abre y de sus páginas salen
 * los iconos de cada habilidad, que orbitan a su alrededor.
 * - Se renderiza solo cuando algo cambia (scroll, puntero, tween): sin bucle continuo.
 * - Los iconos son clicables (raycasting) y la lista HTML de chips es el equivalente accesible.
 *
 * @param {HTMLElement} container
 * @param {typeof import("gsap").gsap} gsap
 * @param {{ skills: Array<{slug:string,icon:string,color:string}>, onSelect?: (slug:string)=>void, onHover?: (slug:string|null)=>void }} options
 */
export function createSkillsScene(container, gsap, { skills, onSelect, onHover }) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
  } catch {
    return null;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.3;
  renderer.domElement.setAttribute("aria-hidden", "true");
  container.append(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 50);
  camera.position.set(0, 0.35, 9.6);
  scene.add(new THREE.AmbientLight(0xffffff, 2.5));
  const key = new THREE.DirectionalLight(0xffffff, 4);
  key.position.set(-3, 5, 8);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xe1ff90, 1.4);
  rim.position.set(4, -1, -3);
  scene.add(rim);

  /* ---------------- Materiales ---------------- */
  const mat = {
    paper: new THREE.MeshStandardMaterial({ color: "#f5f3ea", roughness: 0.85 }),
    lime: new THREE.MeshStandardMaterial({ color: "#d7ff3f", roughness: 0.5, metalness: 0.04 }),
    red: new THREE.MeshStandardMaterial({ color: "#f04432", roughness: 0.5 }),
    ink: new THREE.MeshStandardMaterial({ color: "#121212", roughness: 0.6 }),
    lens: new THREE.MeshStandardMaterial({ color: "#d7ff3f", roughness: 0.2, transparent: true, opacity: 0.55 }),
  };
  const mesh = (geo, m, parent, x = 0, y = 0, z = 0) => {
    const o = new THREE.Mesh(geo, m);
    o.position.set(x, y, z);
    parent.add(o);
    return o;
  };

  /* ---------------- Libro ---------------- */
  const book = new THREE.Group();
  scene.add(book);
  book.scale.setScalar(0.72);
  const W = 2.5,
    H = 3.45,
    T = 0.3;
  mesh(new THREE.BoxGeometry(W, H, 0.055), mat.lime, book, 0, 0, -T / 2);
  mesh(new THREE.BoxGeometry(W - 0.1, H - 0.12, T), mat.paper, book);
  mesh(new THREE.BoxGeometry(0.08, H, T + 0.12), mat.lime, book, -W / 2, 0, 0);
  const lineGeo = new THREE.BoxGeometry(W - 0.11, 0.012, 0.004);
  for (let i = 0; i < 12; i++) mesh(lineGeo, mat.paper, book, 0, -H / 2 + 0.12 + i * 0.27, T / 2 + 0.008);

  function texture(lines, background, fontSize, footer) {
    const canvas = document.createElement("canvas");
    canvas.width = 768;
    canvas.height = 1056;
    const c = canvas.getContext("2d");
    c.fillStyle = background;
    c.fillRect(0, 0, 768, 1056);
    c.fillStyle = "#121212";
    c.font = "600 38px Space, sans-serif";
    c.fillText("lectorlab / 02", 65, 95);
    c.fillRect(65, 140, 638, 2);
    c.font = `600 ${fontSize}px Space, sans-serif`;
    lines.forEach((line, i) => c.fillText(line, 62, 300 + i * fontSize * 0.94));
    c.font = "500 22px Space, sans-serif";
    c.fillText(footer, 65, 978);
    c.font = "400 58px Instrument, serif";
    c.fillText("↗", 650, 980);
    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 4);
    return t;
  }
  const coverMat = new THREE.MeshStandardMaterial({
    map: texture(["CUALQUIER", "HABILIDAD", "ESTÁ", "ESCRITA."], "#d7ff3f", 116, "ELIGE. LEE. PRACTICA."),
    roughness: 0.7,
  });
  const insideMat = new THREE.MeshStandardMaterial({
    map: texture(["¿QUÉ", "QUIERES", "APRENDER", "HOY?"], "#f5f3ea", 112, "LA LECTURA CONSTRUYE HABILIDADES"),
    roughness: 1,
  });
  const hinge = new THREE.Group();
  hinge.position.set(-W / 2, 0, T / 2 + 0.035);
  book.add(hinge);
  mesh(new THREE.BoxGeometry(W, H, 0.07), [mat.lime, mat.lime, mat.lime, mat.lime, coverMat, mat.lime], hinge, W / 2, 0, 0);
  mesh(new THREE.PlaneGeometry(W - 0.15, H - 0.16), insideMat, book, 0.02, 0, T / 2 + 0.013);
  const bookmark = mesh(new THREE.BoxGeometry(0.23, 0.85, 0.025), mat.ink, book, 0.72, -H / 2 - 0.22, 0.015);
  bookmark.rotation.z = 0.05;

  /* ---------------- Iconos de habilidades ---------------- */
  const tone = (color) => (color === "red" ? mat.red : color === "lime" ? mat.lime : mat.paper);
  function extruded(points, depth, m, parent) {
    const shape = new THREE.Shape();
    points.forEach(([x, y], i) => (i ? shape.lineTo(x, y) : shape.moveTo(x, y)));
    shape.closePath();
    const geo = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelThickness: 0.025, bevelSize: 0.025, bevelSegments: 2 });
    geo.center();
    return mesh(geo, m, parent);
  }
  const builders = {
    eye(g) {
      // Gafas de lectura
      const ring = new THREE.TorusGeometry(0.2, 0.045, 12, 32);
      mesh(ring, mat.ink, g, -0.25, 0, 0);
      mesh(ring, mat.ink, g, 0.25, 0, 0);
      const lens = new THREE.CircleGeometry(0.19, 32);
      mesh(lens, mat.lens, g, -0.25, 0, 0);
      mesh(lens, mat.lens, g, 0.25, 0, 0);
      const bridge = mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.14, 8), mat.ink, g, 0, 0.05, 0);
      bridge.rotation.z = Math.PI / 2;
      const temple = new THREE.BoxGeometry(0.04, 0.04, 0.42);
      mesh(temple, mat.ink, g, -0.45, 0.05, -0.2);
      mesh(temple, mat.ink, g, 0.45, 0.05, -0.2);
    },
    mic(g, m) {
      mesh(new THREE.SphereGeometry(0.2, 24, 16), m, g, 0, 0.24, 0);
      const band = mesh(new THREE.TorusGeometry(0.2, 0.028, 8, 32), mat.ink, g, 0, 0.22, 0);
      band.rotation.x = Math.PI / 2;
      mesh(new THREE.CylinderGeometry(0.075, 0.095, 0.5, 16), mat.ink, g, 0, -0.14, 0);
    },
    chart(g, m) {
      mesh(new THREE.BoxGeometry(0.75, 0.05, 0.28), mat.ink, g, 0, -0.32, 0);
      [0.26, 0.44, 0.64].forEach((h, i) =>
        mesh(new THREE.BoxGeometry(0.17, h, 0.17), i === 0 ? mat.ink : m, g, -0.23 + i * 0.23, -0.3 + h / 2, 0),
      );
    },
    chat(g, m) {
      const shape = new THREE.Shape();
      const w = 0.8,
        h = 0.5,
        r = 0.12;
      shape.moveTo(-w / 2 + r, -h / 2);
      shape.lineTo(-0.12, -h / 2);
      shape.lineTo(-0.26, -h / 2 - 0.17);
      shape.lineTo(-0.24, -h / 2);
      shape.lineTo(w / 2 - r, -h / 2);
      shape.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
      shape.lineTo(w / 2, h / 2 - r);
      shape.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
      shape.lineTo(-w / 2 + r, h / 2);
      shape.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
      shape.lineTo(-w / 2, -h / 2 + r);
      shape.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
      const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.12, bevelEnabled: true, bevelThickness: 0.025, bevelSize: 0.025, bevelSegments: 2 });
      geo.translate(0, 0, -0.06);
      mesh(geo, m, g);
      const dot = new THREE.SphereGeometry(0.05, 12, 8);
      [-0.2, 0, 0.2].forEach((x) => mesh(dot, mat.ink, g, x, 0.02, 0.1));
    },
    coin(g, m) {
      const coin = new THREE.CylinderGeometry(0.28, 0.28, 0.08, 36);
      [0, 1].forEach((i) => {
        const c = mesh(coin, i ? m : mat.lime, g, i * 0.16, i * 0.1, -i * 0.14);
        c.rotation.x = Math.PI / 2;
        const ring = mesh(new THREE.TorusGeometry(0.17, 0.022, 8, 32), mat.ink, g, i * 0.16, i * 0.1, 0.045 - i * 0.14);
        ring.rotation.set(0, 0, 0);
      });
    },
    bolt(g, m) {
      extruded(
        [[0.08, 0.42], [-0.24, -0.04], [-0.02, -0.04], [-0.1, -0.42], [0.24, 0.06], [0.02, 0.06]],
        0.12,
        m,
        g,
      );
    },
    rocket(g, m) {
      const body = mesh(
        new THREE.LatheGeometry(
          [[0, -0.32], [0.14, -0.3], [0.16, -0.05], [0.13, 0.18], [0.07, 0.34], [0, 0.4]].map(([x, y]) => new THREE.Vector2(x, y)),
          24,
        ),
        mat.paper,
        g,
      );
      body.position.y = 0;
      const nose = mesh(new THREE.ConeGeometry(0.075, 0.12, 20), m, g, 0, 0.38, 0);
      nose.position.y = 0.37;
      const fin = new THREE.BoxGeometry(0.035, 0.2, 0.16);
      for (let i = 0; i < 3; i++) {
        const f = new THREE.Group();
        f.rotation.y = (i / 3) * Math.PI * 2;
        mesh(fin, m, f, 0, -0.22, 0.16);
        g.add(f);
      }
      mesh(new THREE.CircleGeometry(0.055, 20), mat.lens, g, 0, 0.08, 0.157);
      const windowRing = mesh(new THREE.TorusGeometry(0.058, 0.014, 8, 24), mat.ink, g, 0, 0.08, 0.152);
      windowRing.rotation.x = -0.12;
      const flame = mesh(new THREE.ConeGeometry(0.09, 0.22, 16), mat.lime, g, 0, -0.44, 0);
      flame.rotation.x = Math.PI;
      g.rotation.z = -0.5;
    },
  };

  const icons = skills.map((s, i) => {
    const wrap = new THREE.Group();
    const inner = new THREE.Group();
    (builders[s.icon] || builders.coin)(inner, tone(s.color));
    inner.scale.setScalar(1.05);
    wrap.add(inner);
    wrap.userData.slug = s.slug;
    scene.add(wrap);
    return { wrap, inner, slug: s.slug, base: (i / skills.length) * Math.PI * 2, scale: { v: 1 } };
  });

  /* ---------------- Estado y dibujo ---------------- */
  const pose = { open: 0, emerge: 0, orbit: -1.6, scroll: 0, x: 0, y: 0 };
  let visible = true,
    disposed = false,
    raf = 0,
    radiusX = 3.15,
    radiusZ = 1.7;

  function draw() {
    raf = 0;
    if (disposed || !visible || document.hidden) return;
    book.rotation.set(
      -0.12 + pose.y * 0.08 + pose.scroll * 0.1,
      -0.38 + pose.x * 0.14 + pose.scroll * 0.25,
      0.12 - pose.scroll * 0.12,
    );
    const openness = pose.open;
    hinge.rotation.y = -openness * 2.55;
    book.position.set(openness * 0.32, -0.12 + pose.scroll * 0.2, 0);

    const offset = pose.orbit + pose.scroll * Math.PI * 0.9 + pose.x * 0.25;
    const e = pose.emerge;
    icons.forEach((icon, i) => {
      const a = icon.base + offset;
      icon.wrap.position.set(
        Math.cos(a) * radiusX * e,
        0.1 + Math.sin(a) * -0.55 * e + Math.cos(a * 2 + i) * 0.22 * e + pose.y * -0.15,
        Math.sin(a) * radiusZ * e,
      );
      icon.inner.rotation.set(0.15 + pose.y * 0.2, a * 0.6 + i + pose.x * 0.4, 0);
      icon.wrap.scale.setScalar(icon.scale.v * (0.15 + 0.85 * e));
    });
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
    // En pantallas estrechas, órbita más compacta y cámara más lejos.
    const narrow = w / h < 0.9;
    radiusX = narrow ? 2.3 : 3.15;
    radiusZ = narrow ? 1.3 : 1.7;
    camera.position.z = narrow ? 10.6 : 9.6;
    camera.updateProjectionMatrix();
    requestDraw();
  }
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);
  const io = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      if (visible) requestDraw();
    },
    { rootMargin: "40px" },
  );
  io.observe(container);

  /* ---------------- Interacción ---------------- */
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  let hovered = null;
  function pick(e) {
    const r = renderer.domElement.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    const hit = raycaster.intersectObjects(icons.map((i) => i.wrap), true)[0];
    let o = hit?.object;
    while (o && !o.userData.slug) o = o.parent;
    return o?.userData.slug || null;
  }
  function highlight(slug) {
    icons.forEach((icon) =>
      gsap.to(icon.scale, {
        v: slug ? (icon.slug === slug ? 1.45 : 0.8) : 1,
        duration: 0.35,
        ease: "power2.out",
        overwrite: true,
        onUpdate: requestDraw,
      }),
    );
  }
  function pointer(e) {
    const r = container.getBoundingClientRect();
    if (matchMedia("(pointer:fine)").matches) {
      gsap.to(pose, {
        x: (e.clientX - r.left) / r.width - 0.5,
        y: (e.clientY - r.top) / r.height - 0.5,
        duration: 0.5,
        overwrite: "auto",
        onUpdate: requestDraw,
      });
    }
    const slug = pick(e);
    if (slug !== hovered) {
      hovered = slug;
      renderer.domElement.style.cursor = slug ? "pointer" : "";
      highlight(slug);
      onHover?.(slug);
    }
  }
  function leave() {
    gsap.to(pose, { x: 0, y: 0, duration: 0.5, overwrite: "auto", onUpdate: requestDraw });
    if (hovered) {
      hovered = null;
      highlight(null);
      onHover?.(null);
    }
  }
  function click(e) {
    const slug = pick(e);
    if (slug) onSelect?.(slug);
  }
  const visibility = () => !document.hidden && requestDraw();
  renderer.domElement.addEventListener("pointermove", pointer, { passive: true });
  renderer.domElement.addEventListener("pointerleave", leave);
  renderer.domElement.addEventListener("click", click);
  document.addEventListener("visibilitychange", visibility);

  /* ---------------- Entrada (una sola vez) ---------------- */
  resize();
  container.classList.add("ready");
  const intro = gsap.timeline({ onUpdate: requestDraw });
  intro
    .to(pose, { open: 0.72, duration: 1.1, ease: "power2.inOut" })
    .to(pose, { emerge: 1, duration: 1.2, ease: "back.out(1.4)" }, 0.45)
    .to(pose, { orbit: 0, duration: 1.8, ease: "power3.out" }, 0.45);

  return {
    setScroll(p) {
      pose.scroll = p;
      requestDraw();
    },
    highlight,
    dispose() {
      disposed = true;
      cancelAnimationFrame(raf);
      intro.kill();
      gsap.killTweensOf(pose);
      icons.forEach((i) => gsap.killTweensOf(i.scale));
      resizeObserver.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", visibility);
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
      });
      [...Object.values(mat), coverMat, insideMat].forEach((m) => {
        m.map?.dispose();
        m.dispose();
      });
      renderer.dispose();
      renderer.domElement.remove();
      container.classList.remove("ready");
    },
  };
}
