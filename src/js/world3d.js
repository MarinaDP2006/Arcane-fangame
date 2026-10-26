// Escena 3D bajo el mapa interactivo (world.js pinta encima, en 2D, los medallones de los
// lugares, las caras y los rótulos). Nada de cubos sueltos ni de una imagen alrededor:
// - Piltover: meseta de piedra sobre los acantilados, con cielo dorado, sol, mar de nubes y
//   torres con cúpulas de oro y tejados de cobre.
// - Zaun: una caverna oculta bajo Piltover: bóveda de roca con estalactitas, grietas por las que
//   cae la luz de arriba, pilas de chabolas de metal con neones, tuberías y niebla química.
// Las texturas se pintan a mano en lienzos (pinceladas, ruido, ventanas), sin descargar nada.
(function () {
  if (!window.THREE) return;
  const T = window.THREE;

  // Los escenarios urbanos no se generan por código. Cada ciudad debe provenir de
  // un escenario completo modelado y preparado en Blender (o una herramienta 3D equivalente),
  // exportado como GLB a src/models/maps/{piltover,zaun}.glb.
  // Si el activo falta, World.js desactiva el modo 3D y conserva la carta 2D interactiva.
  // Estas utilidades solo dibujan el halo del jugador; no crean arquitectura ni terreno.
  function quality() {
    const q = window.App?.settings?.quality || 'alta';
    return { baja: 0.45, media: 0.75, alta: 1, ultra: 1 }[q] ?? 1;
  }
  function canvas(w, h) {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    return c;
  }
  function tex(c) {
    const t = new T.CanvasTexture(c);
    t.colorSpace = T.SRGBColorSpace;
    t.anisotropy = 4;
    return t;
  }
  function softSprite(inner, outer, size = 128) {
    const c = canvas(size, size);
    const g = c.getContext('2d');
    const gr = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gr.addColorStop(0, inner);
    gr.addColorStop(1, outer);
    g.fillStyle = gr;
    g.fillRect(0, 0, size, size);
    return tex(c);
  }
  // Puestos de guardia: los personajes son actores, no parte de la geometría de la ciudad.
  const GUARD_POSTS = { ejecutores: 3, consejo: 2, puente: 2 };

  // ---------- Renderizador ----------
  function create(container) {
    let renderer;
    try {
      renderer = new T.WebGLRenderer({ antialias: quality() > 0.6, alpha: false, powerPreference: 'high-performance' });
    } catch (err) {
      return null;
    }
    if (!renderer.getContext()) return null;
    renderer.outputColorSpace = T.SRGBColorSpace;
    renderer.setClearColor(0x070c13, 1);
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    const shadows = quality() >= 1 && window.App?.settings?.shadows !== false;
    renderer.shadowMap.enabled = shadows;
    renderer.shadowMap.type = T.PCFSoftShadowMap;
    const el = renderer.domElement;
    el.className = 'world-3d';
    container.prepend(el);
    const camera = new T.PerspectiveCamera(45, 1, 10, 40000);
    const FOV_T = Math.tan((45 * Math.PI) / 360);
    let scene = null;
    let world = null;
    let w = 1; let h = 1;
    const ray = new T.Raycaster();
    const plane = new T.Plane(new T.Vector3(0, 1, 0), 0);
    const v = new T.Vector3();
    let cam = { x: 0, y: 0, zoom: 1, yaw: 0, pitch: 0.9 };

    let mapLoadToken = 0;
    function disposeScene() {
      if (!scene) return;
      scene.traverse((o) => {
        o.geometry?.dispose();
        if (o.material) [].concat(o.material).forEach((m) => {
          m.map?.dispose();
          m.dispose();
        });
      });
      scene = null;
      world = null;
    }

    async function loadCityBuffer(id) {
      // Electron lee el GLB del paquete por el puente seguro. En la versión web se carga
      // la misma ruta relativa; jamás se descarga una ciudad de una URL de terceros.
      if (window.arcane?.models?.read) {
        const data = await window.arcane.models.read(id);
        if (data) {
          if (data instanceof ArrayBuffer) return data;
          if (ArrayBuffer.isView(data)) return data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
          if (data.data instanceof ArrayBuffer) return data.data;
          if (ArrayBuffer.isView(data.data)) return data.data.buffer.slice(data.data.byteOffset, data.data.byteOffset + data.data.byteLength);
        }
      }
      const response = await fetch(`models/maps/${id}.glb`);
      if (!response.ok) throw new Error(`Falta el escenario 3D de ${id}: models/maps/${id}.glb (HTTP ${response.status})`);
      return response.arrayBuffer();
    }

    function parseCityBuffer(buffer) {
      return new Promise((resolve, reject) => {
        new window.THREE_GLTF.GLTFLoader().parse(buffer, '', resolve, reject);
      });
    }

    async function setMap(map) {
      const token = ++mapLoadToken;
      const zaun = map.id === 'zaun';
      const bg = zaun ? 0x05080a : 0x91b5d3;
      // El fotograma transitorio solo muestra el color de fondo. No crea terreno ni edificios.
      disposeScene();
      scene = new T.Scene();
      scene.background = new T.Color(bg);
      renderer.setClearColor(bg, 1);
      world = { key: null, tick() {} };
      let gltf;
      try {
        const buffer = await loadCityBuffer(map.id);
        gltf = await parseCityBuffer(buffer);
      } catch (err) {
        console.warn(`Escenario 3D ${map.id} no disponible:`, err?.message || err);
        return false;
      }
      if (token !== mapLoadToken || !gltf?.scene) return false;
      let meshes = 0;
      gltf.scene.traverse((o) => {
        if (!o.isMesh || !o.geometry?.attributes?.position?.count) return;
        meshes++;
        o.castShadow = true;
        o.receiveShadow = true;
        for (const material of [].concat(o.material || [])) {
          if (!material) continue;
          if (material.map) material.map.colorSpace = T.SRGBColorSpace;
          if (material.emissiveMap) material.emissiveMap.colorSpace = T.SRGBColorSpace;
          material.needsUpdate = true;
        }
      });
      if (!meshes) {
        console.warn(`Escenario 3D ${map.id} no contiene mallas; se mantiene el mapa 2D.`);
        return false;
      }

      // El GLB contiene TODO el entorno arquitectónico: callejero, terreno, silueta urbana,
      // fachadas, tejados, puentes, cavernas, tuberías, luces prácticas y atrezo.
      // Convención obligatoria: mapa X/Z 3000×2200, suelo Y=0; los POI se anclan según WORLD.
      disposeScene();
      scene = new T.Scene();
      scene.background = new T.Color(bg);
      scene.fog = zaun
        ? new T.FogExp2('#0b1712', 0.0001)
        : new T.Fog('#a9c0d0', 4800, 15000);
      scene.add(gltf.scene);

      // Luz de apoyo global, sin añadir edificios, suelo, torres ni otro volumen generado.
      scene.add(new T.HemisphereLight(zaun ? '#9be8cf' : '#fff0cf', zaun ? '#0b100e' : '#6c5a45', zaun ? 0.9 : 1.15));
      const key = new T.DirectionalLight(zaun ? '#b6e8d3' : '#ffe0a3', zaun ? 1.2 : 1.65);
      key.position.set(zaun ? 900 : map.w * 0.72, zaun ? 1600 : 2100, zaun ? 600 : -500);
      key.target.position.set(map.w / 2, 0, map.h / 2);
      scene.add(key, key.target);
      world = { key, tick() {} };
      buildActors(map);
      if (shadows && world.key) {
        world.key.castShadow = true;
        const s = world.key.shadow;
        s.mapSize.set(2048, 2048);
        s.camera.left = -map.w * 0.6;
        s.camera.right = map.w * 0.6;
        s.camera.top = map.h * 0.75;
        s.camera.bottom = -map.h * 0.75;
        s.camera.near = 100;
        s.camera.far = 6000;
        s.bias = -0.0005;
      }
      return true;
    }

    // ---------- Jugador (bola de luz), personajes de Arcane y decorados ----------
    // Colores de la bola según la creación del personaje.
    const ORB = { hombre: '#4fb8ff', mujer: '#ff5aa8', nobinario: '#ffc857' };
    let actors = null;

    function makeOrb() {
      const root = new T.Group();
      const mat = new T.MeshStandardMaterial({ color: '#ffffff', emissive: '#ffffff', emissiveIntensity: 1.6, roughness: 0.25, metalness: 0.1 });
      const ball = new T.Mesh(new T.SphereGeometry(11, 28, 18), mat);
      ball.castShadow = true;
      const halo = new T.Sprite(new T.SpriteMaterial({ map: softSprite('rgba(255,255,255,0.9)', 'rgba(255,255,255,0)'), blending: T.AdditiveBlending, depthWrite: false, transparent: true }));
      halo.scale.set(70, 70, 1);
      const light = new T.PointLight('#ffffff', 3, 320, 0);
      const shadow = new T.Mesh(new T.CircleGeometry(12, 24).rotateX(-Math.PI / 2), new T.MeshBasicMaterial({ color: '#000', transparent: true, opacity: 0.35, depthWrite: false }));
      shadow.position.y = 0.6;
      const body = new T.Group();
      body.add(ball, halo, light);
      root.add(body, shadow);
      return { root, body, ball, halo, light, shadow, mat, ph: 0, color: '' };
    }

    function buildActors(map) {
      actors = { group: new T.Group(), orb: makeOrb(), playerAvatar: null, lastPlayer: null, npcs: new Map(), guards: [], featured: [], map };
      scene.add(actors.group);
      actors.group.add(actors.orb.root);
      const A = window.Avatars3D;
      if (!A) return;
      const mine = actors;
      // El atrezo arquitectónico pertenece al GLB de la ciudad; aquí solo se añaden actores.
      // Guardias de Piltover en sus puestos (mirando hacia la calle hasta que te acercas).
      if (map.id !== 'zaun') {
        for (const l of map.def.locations) {
          const n = GUARD_POSTS[l.id] || 0;
          for (let i = 0; i < n; i++) {
            const a = (i / n) * Math.PI * 2 + 0.6;
            const av = A.create({ id: 'guardia-piltover' });
            const g = { av, x: l.x + Math.cos(a) * 120, y: l.y + Math.sin(a) * 120 };
            g.home = Math.atan2(g.x - l.x, g.y - l.y);
            av.holder.position.set(g.x, 0, g.y);
            mine.group.add(av.holder);
            mine.guards.push(g);
          }
        }
      }
      // Personajes reconocibles en sus barrios, incluso antes de desbloquear su contacto.
      // Cuando la historia activa al personaje se utiliza el actor narrativo y se oculta este
      // marcador para no duplicarlo. Los personajes caídos/ausentes también se ocultan.
      const featuredIds = map.id === 'zaun'
        ? ['jinx', 'vi', 'ekko', 'sevika', 'silco', 'vander', 'isha']
        : ['caitlyn', 'jayce', 'viktor', 'heimerdinger', 'mel', 'cassandra', 'ambessa', 'maddie', 'kino'];
      const homes = window.WORLD?.homes || {};
      const perHome = new Map();
      for (const id of featuredIds) {
        const homeId = homes[id];
        const loc = map.def.locations.find((v) => v.id === homeId);
        if (!loc) continue;
        const n = perHome.get(homeId) || 0;
        perHome.set(homeId, n + 1);
        const angle = n * 2.399963 + 0.75;
        const radius = 148 + (n % 3) * 18;
        const x = loc.x + Math.cos(angle) * radius;
        const y = loc.y + Math.sin(angle) * radius;
        const av = A.create({ id });
        av.holder.position.set(x, 0, y);
        mine.group.add(av.holder);
        mine.featured.push({ id, av, x, y, home: Math.atan2(loc.x - x, loc.y - y) });
      }
    }

    // Distancia a la que un personaje se gira para mirarte.
    const NOTICE = 240;
    function turnTo(av, x, y, home, p, dt, t) {
      const near = p && Math.hypot(p.x - x, p.y - y) < NOTICE;
      const yaw = near ? Math.atan2(p.x - x, p.y - y) : home;
      window.Avatars3D.update(av, dt, 0, yaw, t, true);
    }

    /**
     * Coloca a los actores del fotograma: player = { x, y, gender, moving, speed },
     * npcs = [{ id, x, y, home }]. Los personajes no se animan: solo se giran hacia ti.
     */
    function updateActors(st, t, dt) {
      if (!actors || !st) return;
      const { orb } = actors;
      const p = st.player;
      if (p) {
        // Crear el avatar al disponer de la ficha real del jugador (aspecto y ropa incluidos).
        const APlayer = window.Avatars3D;
        if (APlayer && !actors.playerAvatar) {
          actors.playerAvatar = APlayer.create({ player: p });
          actors.group.add(actors.playerAvatar.holder);
          orb.ball.visible = false;
        }
        orb.root.visible = true;
        const color = ORB[p.gender] || ORB.nobinario;
        if (orb.color !== color) {
          orb.color = color;
          orb.mat.color.set(color);
          orb.mat.emissive.set(color);
          orb.halo.material.color.set(color);
          orb.light.color.set(color);
        }
        orb.root.position.set(p.x, 0, p.y);
        // El avatar 3D sigue al marcador en el mismo fotograma, sin desfase ni tamaño excesivo.
        // La altura objetivo de Avatars3D es de 22 unidades frente a calles de 60–96 unidades.
        const av = actors.playerAvatar;
        if (av) {
          av.holder.position.set(p.x, 0, p.y);
          let yaw = av.yaw || 0;
          const last = actors.lastPlayer;
          if (last) {
            const dx = p.x - last.x;
            const dy = p.y - last.y;
            if (Math.hypot(dx, dy) > 0.15) yaw = Math.atan2(dx, dy);
          }
          actors.lastPlayer = { x: p.x, y: p.y };
          window.Avatars3D.update(av, dt, p.moving ? (p.speed || 230) : 0, yaw, t, false);
          // El halo sigue identificando al jugador, pero no tapa las piernas del modelo.
          orb.body.position.y = 2;
          orb.halo.material.opacity = 0.48 + Math.sin(t * 3) * 0.08;
        } else {
          // Fallback seguro si no hay módulo de avatares.
          if (p.moving) orb.ph += dt * Math.max(7, (p.speed || 230) / 26);
          const hop = p.moving ? Math.abs(Math.sin(orb.ph)) : 0;
          const idle = p.moving ? 0 : Math.sin(t * 2.2) * 2;
          orb.body.position.y = 13 + hop * 26 + idle;
          const squash = p.moving ? 1 - (1 - hop) * 0.22 : 1;
          orb.ball.visible = true;
          orb.ball.scale.set(1 / Math.sqrt(squash), squash, 1 / Math.sqrt(squash));
        }
        const s = p.moving ? 0.9 : 1;
        orb.shadow.scale.set(s, s, s);
        orb.shadow.material.opacity = 0.35 * s;
        orb.halo.material.opacity = 0.75 + Math.sin(t * 3) * 0.15;
      } else orb.root.visible = false;
      // Personajes de Arcane: se crean al aparecer y se quitan al irse.
      const A = window.Avatars3D;
      if (!A) return;
      const seen = new Set();
      for (const n of st.npcs || []) {
        seen.add(n.id);
        let e = actors.npcs.get(n.id);
        if (!e) {
          e = { av: A.create({ id: n.id, ambient: Boolean(n.ambient) }) };
          actors.npcs.set(n.id, e);
          actors.group.add(e.av.holder);
        }
        e.av.holder.position.set(n.x, 0, n.y);
        if (n.ambient) A.update(e.av, dt, n.moving ? (n.speed || 45) : 0, n.home ?? 0, t, false);
        else turnTo(e.av, n.x, n.y, n.home ?? 0, p, dt, t);
      }
      for (const [id, e] of actors.npcs) if (!seen.has(id)) { A.dispose(e.av); actors.npcs.delete(id); }
      for (const g of actors.guards) turnTo(g.av, g.x, g.y, g.home, p, dt, t);
      for (const e of actors.featured || []) {
        const fallen = (st.fallen || []).includes(e.id);
        const absent = (window.WORLD?.absent?.[e.id] || []).includes(st.progress?.chapterId);
        e.av.holder.visible = !fallen && !absent && !seen.has(e.id);
        if (e.av.holder.visible) turnTo(e.av, e.x, e.y, e.home, p, dt, t);
      }
    }

    /** Distancia de la cámara para que el zoom (px por unidad en el centro) se respete. */
    function place(c) {
      cam = c;
      const d = (h / 2) / (c.zoom * FOV_T);
      const sp = Math.sin(c.pitch);
      camera.position.set(c.x + d * sp * Math.sin(c.yaw), d * Math.cos(c.pitch), c.y + d * sp * Math.cos(c.yaw));
      camera.lookAt(c.x, 0, c.y);
      camera.updateMatrixWorld();
    }

    return {
      el,
      setMap,
      resize(cw, ch, dpr) {
        w = cw; h = ch;
        renderer.setPixelRatio(Math.min(dpr, quality() < 0.6 ? 1 : 2));
        renderer.setSize(cw, ch, false);
        el.style.width = cw + 'px'; el.style.height = ch + 'px';
        camera.aspect = cw / ch;
        camera.updateProjectionMatrix();
      },
      render(c, t, dt, st) {
        place(c);
        updateActors(st, t, dt);
        world?.tick?.(t, dt);
        renderer.render(scene, camera);
      },
      place,
      /** Mundo (x, altura, y) → pantalla. depth > 1 o < -1 = detrás de la cámara. */
      project(x, y, hgt = 0) {
        v.set(x, hgt, y).project(camera);
        return { x: (v.x + 1) * w / 2, y: (1 - v.y) * h / 2, depth: v.z, behind: v.z > 1 };
      },
      /** Pantalla → punto del suelo. */
      pick(sx, sy) {
        ray.setFromCamera({ x: (sx / w) * 2 - 1, y: -(sy / h) * 2 + 1 }, camera);
        const hit = ray.ray.intersectPlane(plane, v);
        return hit ? { x: hit.x, y: hit.z } : null;
      },
      /** Escala (px por unidad) en un punto del suelo, para el tamaño de los medallones. */
      scaleAt(x, y) {
        const dist = camera.position.distanceTo(v.set(x, 0, y));
        return (h / 2) / (dist * FOV_T);
      },
      dispose() {
        mapLoadToken++;
        disposeScene();
        renderer.dispose();
        el.remove();
      },
    };
  }

  window.World3D = { create };
})();
