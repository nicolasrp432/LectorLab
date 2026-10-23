import * as THREE from "three";

/**
 * Tótem 3D interactivo para las páginas de detalle de habilidad (/habilidades/[slug]/).
 * Presenta un medallón/pedestal con el símbolo 3D de la habilidad que se puede
 * arrastrar y rotar libremente con inercia, y flota suavemente al reposar.
 *
 * @param {HTMLElement} container Contenedor DOM
 * @param {typeof import("gsap").gsap} gsap
 * @param {{ icon: string, color: string, name?: string }} options
 */
export function createSkillTotemScene(container, gsap, { icon, color }) {
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
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 40);
  camera.position.set(0, 0.4, 8.5);

  // Iluminación
  scene.add(new THREE.AmbientLight(0xffffff, 2.6));
  const keyLight = new THREE.DirectionalLight(0xffffff, 4.0);
  keyLight.position.set(-3, 6, 7);
  scene.add(keyLight);

  const rimColor = color === "red" ? 0xff6b5b : color === "lime" ? 0xe1ff90 : 0xffffff;
  const rimLight = new THREE.DirectionalLight(rimColor, 1.5);
  rimLight.position.set(4, -2, -3);
  scene.add(rimLight);

  /* ---------------- Materiales ---------------- */
  const mat = {
    paper: new THREE.MeshStandardMaterial({ color: "#f5f3ea", roughness: 0.85 }),
    lime: new THREE.MeshStandardMaterial({ color: "#d7ff3f", roughness: 0.48, metalness: 0.05 }),
    red: new THREE.MeshStandardMaterial({ color: "#f04432", roughness: 0.5 }),
    ink: new THREE.MeshStandardMaterial({ color: "#121212", roughness: 0.6 }),
    lens: new THREE.MeshStandardMaterial({ color: "#d7ff3f", roughness: 0.2, transparent: true, opacity: 0.55 }),
    pedestalTop: new THREE.MeshStandardMaterial({
      color: color === "red" ? "#f04432" : color === "lime" ? "#d7ff3f" : "#f5f3ea",
      roughness: 0.6,
    }),
  };

  const mesh = (geo, m, parent, x = 0, y = 0, z = 0) => {
    const o = new THREE.Mesh(geo, m);
    o.position.set(x, y, z);
    parent.add(o);
    return o;
  };

  function extruded(points, depth, m, parent) {
    const shape = new THREE.Shape();
    points.forEach(([x, y], i) => (i ? shape.lineTo(x, y) : shape.moveTo(x, y)));
    shape.closePath();
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.03,
      bevelSegments: 2,
    });
    geo.center();
    return mesh(geo, m, parent);
  }

  /* ---------------- Geometrías de iconos 3D ---------------- */
  const toneMat = color === "red" ? mat.red : color === "lime" ? mat.lime : mat.paper;

  const builders = {
    eye(g) {
      // Gafas de lectura
      const ring = new THREE.TorusGeometry(0.38, 0.08, 14, 36);
      mesh(ring, mat.ink, g, -0.48, 0, 0);
      mesh(ring, mat.ink, g, 0.48, 0, 0);
      const lens = new THREE.CircleGeometry(0.36, 32);
      mesh(lens, mat.lens, g, -0.48, 0, 0);
      mesh(lens, mat.lens, g, 0.48, 0, 0);
      const bridge = mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.26, 12), mat.ink, g, 0, 0.08, 0);
      bridge.rotation.z = Math.PI / 2;
      const temple = new THREE.BoxGeometry(0.06, 0.06, 0.85);
      mesh(temple, mat.ink, g, -0.86, 0.08, -0.42);
      mesh(temple, mat.ink, g, 0.86, 0.08, -0.42);
    },
    mic(g, m) {
      // Micrófono dinámico retro
      mesh(new THREE.SphereGeometry(0.42, 28, 20), m, g, 0, 0.46, 0);
      const band = mesh(new THREE.TorusGeometry(0.42, 0.05, 10, 36), mat.ink, g, 0, 0.44, 0);
      band.rotation.x = Math.PI / 2;
      mesh(new THREE.CylinderGeometry(0.14, 0.18, 0.95, 20), mat.ink, g, 0, -0.25, 0);
      const base = mesh(new THREE.CylinderGeometry(0.38, 0.42, 0.12, 24), mat.ink, g, 0, -0.76, 0);
      base.rotation.y = 0;
    },
    chart(g, m) {
      // Gráfica de barras ascendente
      mesh(new THREE.BoxGeometry(1.4, 0.08, 0.5), mat.ink, g, 0, -0.55, 0);
      [0.45, 0.82, 1.25].forEach((h, i) => {
        mesh(new THREE.BoxGeometry(0.3, h, 0.3), i === 0 ? mat.ink : m, g, -0.45 + i * 0.45, -0.55 + h / 2, 0);
      });
      // Flecha ascendente
      const arrowGeo = new THREE.ConeGeometry(0.12, 0.28, 12);
      const arrow = mesh(arrowGeo, mat.lime, g, 0.55, 0.25, 0);
      arrow.rotation.z = -Math.PI / 4;
    },
    chat(g, m) {
      // Bocadillo de diálogo
      const shape = new THREE.Shape();
      const w = 1.4,
        h = 0.9,
        r = 0.2;
      shape.moveTo(-w / 2 + r, -h / 2);
      shape.lineTo(-0.2, -h / 2);
      shape.lineTo(-0.45, -h / 2 - 0.3);
      shape.lineTo(-0.4, -h / 2);
      shape.lineTo(w / 2 - r, -h / 2);
      shape.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
      shape.lineTo(w / 2, h / 2 - r);
      shape.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
      shape.lineTo(-w / 2 + r, h / 2);
      shape.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
      shape.lineTo(-w / 2, -h / 2 + r);
      shape.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
      const geo = new THREE.ExtrudeGeometry(shape, {
        depth: 0.22,
        bevelEnabled: true,
        bevelThickness: 0.04,
        bevelSize: 0.04,
        bevelSegments: 2,
      });
      geo.translate(0, 0, -0.11);
      mesh(geo, m, g);
      const dot = new THREE.SphereGeometry(0.09, 16, 12);
      [-0.34, 0, 0.34].forEach((x) => mesh(dot, mat.ink, g, x, 0.05, 0.16));
    },
    coin(g, m) {
      // Monedas apiladas
      const coinGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.15, 36);
      [0, 1].forEach((i) => {
        const c = mesh(coinGeo, i ? m : mat.lime, g, i * 0.3, i * 0.18, -i * 0.26);
        c.rotation.x = Math.PI / 2;
        const ring = mesh(new THREE.TorusGeometry(0.35, 0.04, 10, 36), mat.ink, g, i * 0.3, i * 0.18, 0.08 - i * 0.26);
        ring.rotation.set(0, 0, 0);
      });
    },
    bolt(g, m) {
      // Rayo facetado de foco
      extruded(
        [
          [0.15, 0.8],
          [-0.45, -0.06],
          [-0.04, -0.06],
          [-0.18, -0.8],
          [0.45, 0.1],
          [0.04, 0.1],
        ],
        0.24,
        m,
        g,
      );
    },
    rocket(g, m) {
      // Cohete espacial
      const body = mesh(
        new THREE.LatheGeometry(
          [
            [0, -0.6],
            [0.26, -0.56],
            [0.3, -0.1],
            [0.24, 0.35],
            [0.13, 0.65],
            [0, 0.76],
          ].map(([x, y]) => new THREE.Vector2(x, y)),
          28,
        ),
        mat.paper,
        g,
      );
      body.position.y = 0;
      const nose = mesh(new THREE.ConeGeometry(0.14, 0.25, 24), m, g, 0, 0.72, 0);
      nose.position.y = 0.7;
      const fin = new THREE.BoxGeometry(0.06, 0.38, 0.3);
      for (let i = 0; i < 3; i++) {
        const f = new THREE.Group();
        f.rotation.y = (i / 3) * Math.PI * 2;
        mesh(fin, m, f, 0, -0.42, 0.3);
        g.add(f);
      }
      mesh(new THREE.CircleGeometry(0.1, 24), mat.lens, g, 0, 0.16, 0.29);
      const winRing = mesh(new THREE.TorusGeometry(0.11, 0.024, 8, 24), mat.ink, g, 0, 0.16, 0.28);
      winRing.rotation.x = -0.12;
      const flame = mesh(new THREE.ConeGeometry(0.16, 0.42, 20), mat.lime, g, 0, -0.84, 0);
      flame.rotation.x = Math.PI;
      g.rotation.z = -0.3;
    },
  };

  /* ---------------- Montaje del tótem ---------------- */
  const totemGroup = new THREE.Group();
  scene.add(totemGroup);

  // Pedestal / Base circular
  const pedestal = new THREE.Group();
  pedestal.position.set(0, -1.2, 0);
  totemGroup.add(pedestal);

  // Disco exterior ink
  mesh(new THREE.CylinderGeometry(1.65, 1.75, 0.14, 48), mat.ink, pedestal);
  // Disco interior color
  mesh(new THREE.CylinderGeometry(1.5, 1.5, 0.16, 48), mat.pedestalTop, pedestal, 0, 0.02, 0);
  // Anillo de relieve
  const ring = mesh(new THREE.TorusGeometry(1.35, 0.03, 10, 48), mat.ink, pedestal, 0, 0.11, 0);
  ring.rotation.x = Math.PI / 2;

  // Símbolo flotante
  const symbolGroup = new THREE.Group();
  symbolGroup.position.set(0, 0.25, 0);
  symbolGroup.scale.setScalar(1.25);
  totemGroup.add(symbolGroup);

  const builder = builders[icon] || builders.coin;
  builder(symbolGroup, toneMat);

  // Anillo orbital decorativo inclinado
  const orbitRingGeo = new THREE.TorusGeometry(2.1, 0.015, 8, 64);
  const orbitRing = mesh(orbitRingGeo, mat.ink, totemGroup, 0, 0, 0);
  orbitRing.rotation.set(1.1, 0.35, 0);

  // Pequeña esfera satélite en la órbita
  const satellite = mesh(new THREE.SphereGeometry(0.1, 16, 12), toneMat, totemGroup, 1.85, 0.6, 0.7);

  /* ---------------- Estado y render ---------------- */
  let visible = true;
  let disposed = false;
  let raf = 0;

  const pose = {
    rotX: 0.2,
    rotY: -0.4,
    floatY: 0,
    time: 0,
  };

  function draw() {
    raf = 0;
    if (disposed || !visible || document.hidden) return;

    pose.time += 0.016;
    const idleBob = Math.sin(pose.time * 1.8) * 0.08;
    const idleSpin = pose.time * 0.15;

    totemGroup.rotation.x = pose.rotX + Math.cos(pose.time * 1.2) * 0.03;
    totemGroup.rotation.y = pose.rotY + idleSpin;
    totemGroup.position.y = pose.floatY + idleBob;

    satellite.position.x = Math.cos(pose.time * 0.9) * 2.1;
    satellite.position.z = Math.sin(pose.time * 0.9) * 1.6;
    satellite.position.y = Math.sin(pose.time * 1.8) * 0.4;

    renderer.render(scene, camera);
  }

  const requestDraw = () => {
    if (!raf && !disposed) raf = requestAnimationFrame(draw);
  };

  function resize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const narrow = w / h < 0.9;
    camera.position.z = narrow ? 9.6 : 8.5;
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
    { rootMargin: "60px" },
  );
  io.observe(container);

  /* ---------------- Interacción de arrastre y giro ---------------- */
  let isDragging = false;
  let lastX = 0;
  let lastY = 0;
  let velX = 0;
  let velY = 0;

  function onPointerDown(e) {
    isDragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    velX = 0;
    velY = 0;
    renderer.domElement.style.cursor = "grabbing";
    if (renderer.domElement.setPointerCapture) {
      renderer.domElement.setPointerCapture(e.pointerId);
    }
  }

  function onPointerMove(e) {
    if (!isDragging) {
      // Hover sutil si el puntero es fino
      if (matchMedia("(pointer:fine)").matches) {
        const r = container.getBoundingClientRect();
        const targetX = ((e.clientX - r.left) / r.width - 0.5) * 0.4;
        const targetY = -((e.clientY - r.top) / r.height - 0.5) * 0.3;
        gsap.to(pose, { rotY: targetX - 0.4, rotX: targetY + 0.2, duration: 0.6, overwrite: "auto", onUpdate: requestDraw });
      }
      return;
    }
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;

    velX = dx * 0.012;
    velY = dy * 0.01;

    pose.rotY += velX;
    pose.rotX = Math.max(-0.6, Math.min(0.8, pose.rotX + velY));
    requestDraw();
  }

  function onPointerUp(e) {
    if (!isDragging) return;
    isDragging = false;
    renderer.domElement.style.cursor = "grab";
    if (renderer.domElement.releasePointerCapture) {
      renderer.domElement.releasePointerCapture(e.pointerId);
    }
    // Inercia con GSAP
    gsap.to(pose, {
      rotY: pose.rotY + velX * 18,
      rotX: Math.max(-0.5, Math.min(0.7, pose.rotX + velY * 12)),
      duration: 1.2,
      ease: "power2.out",
      onUpdate: requestDraw,
    });
  }

  renderer.domElement.style.cursor = "grab";
  renderer.domElement.addEventListener("pointerdown", onPointerDown);
  window.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("pointerup", onPointerUp);

  const loop = () => {
    if (disposed) return;
    draw();
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);

  /* ---------------- Entrada ---------------- */
  resize();
  container.classList.add("ready");
  gsap.from(totemGroup.scale, {
    x: 0.4,
    y: 0.4,
    z: 0.4,
    duration: 1.1,
    ease: "back.out(1.6)",
    onUpdate: requestDraw,
  });

  return {
    dispose() {
      disposed = true;
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      io.disconnect();
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
      });
      Object.values(mat).forEach((m) => m.dispose());
      renderer.dispose();
      renderer.domElement.remove();
      container.classList.remove("ready");
    },
  };
}
