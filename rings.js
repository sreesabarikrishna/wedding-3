/* 3D wedding rings: two polished gold bands, one leaning on the other.
   Drag sideways to turn them. Needs three.js (r128) loaded before this file. */
(function () {
  const box = document.getElementById("rings");
  if (!box) return;
  if (!window.THREE) { box.closest("section").hidden = true; return; } // offline: hide section

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 50);
  camera.position.set(0, 1.5, 6.6);
  camera.lookAt(0, -0.05, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  box.appendChild(renderer.domElement);

  /* ---------- Studio reflections (made in code, no image files) ----------
     Real gold looks real because it mirrors a bright studio. We paint a small
     studio (white softboxes and dark flags) and let the rings reflect it. */
  function studioTexture() {
    const c = document.createElement("canvas");
    c.width = 1024; c.height = 512;
    const g = c.getContext("2d");
    const sky = g.createLinearGradient(0, 0, 0, 512);
    sky.addColorStop(0, "#ffffff");
    sky.addColorStop(0.45, "#fff1d2");
    sky.addColorStop(0.5, "#d9b36a");
    sky.addColorStop(0.62, "#6b4718");
    sky.addColorStop(1, "#1e1208");
    g.fillStyle = sky; g.fillRect(0, 0, 1024, 512);
    g.fillStyle = "#ffffff";                       // bright softboxes
    [[80, 70, 160, 110], [380, 40, 120, 130], [640, 90, 190, 90], [900, 60, 100, 140]]
      .forEach((r) => g.fillRect(r[0], r[1], r[2], r[3]));
    g.fillStyle = "#24160a";                       // dark flags make the contrast bands
    [[250, 120, 40, 200], [520, 100, 50, 220], [800, 130, 36, 190]]
      .forEach((r) => g.fillRect(r[0], r[1], r[2], r[3]));
    const t = new THREE.CanvasTexture(c);
    t.mapping = THREE.EquirectangularReflectionMapping;
    t.encoding = THREE.sRGBEncoding;
    return t;
  }

  let envMap = null;
  try {
    const pmrem = new THREE.PMREMGenerator(renderer);
    const src = studioTexture();
    envMap = pmrem.fromEquirectangular(src).texture;
    src.dispose(); pmrem.dispose();
  } catch (err) { envMap = null; } // if it fails we fall back to simple lights below

  /* ---------- Gold that follows the site's gold / rose gold button ---------- */
  const goldColor = () => {
    const cs = getComputedStyle(document.body);
    const base = new THREE.Color(cs.getPropertyValue("--gold").trim() || "#c9a24b");
    const hi = new THREE.Color(cs.getPropertyValue("--gold-hi").trim() || "#f0d78c");
    return base.lerp(hi, 0.45).convertSRGBToLinear();
  };
  const mat = envMap
    ? new THREE.MeshStandardMaterial({ color: goldColor(), metalness: 1, roughness: 0.16, envMap: envMap, envMapIntensity: 1.5, side: THREE.DoubleSide })
    : new THREE.MeshPhongMaterial({ color: goldColor(), specular: 0xfff2c0, shininess: 140, side: THREE.DoubleSide });

  /* ---------- A real wedding band: wide, rounded edges, domed outside ---------- */
  function bandGeometry() {
    const ri = 0.8, ro = 1.0, hw = 0.26, rc = 0.08, n = 10, m = 14;
    const p = [];
    const arc = (cx, cy, a0, a1) => {
      for (let i = 0; i <= n; i++) {
        const a = a0 + (a1 - a0) * i / n;
        p.push([cx + rc * Math.cos(a), cy + rc * Math.sin(a)]);
      }
    };
    arc(ro - rc, -hw + rc, -Math.PI / 2, 0);                        // bottom-outer corner
    for (let i = 1; i < m; i++) p.push([ro, -hw + rc + (2 * hw - 2 * rc) * i / m]); // outer face
    arc(ro - rc, hw - rc, 0, Math.PI / 2);                          // top-outer corner
    arc(ri + rc, hw - rc, Math.PI / 2, Math.PI);                    // top-inner corner
    for (let i = 1; i < m; i++) p.push([ri, hw - rc - (2 * hw - 2 * rc) * i / m]);  // inner face
    arc(ri + rc, -hw + rc, Math.PI, 1.5 * Math.PI);                 // bottom-inner corner
    p.push(p[0].slice());                                           // close the shape
    const mid = (ri + ro) / 2;
    const pts = p.map(([r, y]) => {
      const bulge = 1 - Math.pow(y / hw, 2);
      return new THREE.Vector2(r > mid ? r + 0.045 * bulge : r - 0.02 * bulge, y); // dome out, comfort-fit in
    });
    return new THREE.LatheGeometry(pts, 160);
  }
  const geo = bandGeometry();

  // Ring A lies almost flat. Ring B stands and leans on its edge, like the photo.
  const a = new THREE.Mesh(geo, mat);
  a.position.set(-0.3, 0, 0);
  a.rotation.z = 0.06;
  const b = new THREE.Mesh(geo, mat);
  b.position.set(0.18, 1.14, 0);
  b.rotation.z = -1.13;   // leans about 65 degrees
  b.rotation.y = 0.12;

  const group = new THREE.Group();
  group.add(a, b);
  group.position.y = -0.95;
  group.rotation.y = 0.6;
  scene.add(group);

  // Lights (also give the sparkle highlights)
  scene.add(new THREE.AmbientLight(0xffffff, envMap ? 0.15 : 0.6));
  const key = new THREE.DirectionalLight(0xffffff, envMap ? 0.7 : 1);
  key.position.set(3, 5, 4);
  scene.add(key);
  const rim = new THREE.PointLight(0xffd9a0, 0.8);
  rim.position.set(-4, 1, 3);
  scene.add(rim);

  // Soft shadow under the rings so they sit on a surface
  const sc = document.createElement("canvas");
  sc.width = sc.height = 256;
  const sg = sc.getContext("2d");
  const rg = sg.createRadialGradient(128, 128, 10, 128, 128, 128);
  rg.addColorStop(0, "rgba(0,0,0,.55)");
  rg.addColorStop(1, "rgba(0,0,0,0)");
  sg.fillStyle = rg; sg.fillRect(0, 0, 256, 256);
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(3.6, 3.6),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(sc), transparent: true, depthWrite: false })
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.set(-0.1, -1.2, 0);
  scene.add(shadow);

  function size() {
    const w = box.clientWidth;
    renderer.setSize(w, w);
  }
  size();
  new ResizeObserver(size).observe(box);

  // Drag to turn
  let dragging = false, lastX = 0, vel = 0.007;
  box.addEventListener("pointerdown", (e) => { dragging = true; lastX = e.clientX; box.setPointerCapture(e.pointerId); });
  box.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    vel = (e.clientX - lastX) * 0.01;
    group.rotation.y += vel;
    lastX = e.clientX;
  });
  const end = () => { dragging = false; };
  box.addEventListener("pointerup", end);
  box.addEventListener("pointercancel", end);

  // Follow the gold / rose gold button
  new MutationObserver(() => mat.color.copy(goldColor()))
    .observe(document.body, { attributes: true, attributeFilter: ["class"] });

  // Only draw while on screen (saves battery)
  let visible = false;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(box);
  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  (function loop() {
    requestAnimationFrame(loop);
    if (!visible) return;
    if (!dragging && !still) {
      vel += (0.007 - vel) * 0.03; // ease back to a slow spin
      group.rotation.y += vel;
    }
    renderer.render(scene, camera);
  })();
})();
