// Minijuegos 3D de Arcane-fangame. Motor reutilizable en Three.js, sin sprites retro.
// El mundo principal continúa siendo 2D; solo estas actividades usan escenarios WebGL.
(function () {
  const GAMES = {};
  const CATALOG = {
    tiro: { title: 'Galería de precisión', city: 'piltover', mode: 'shoot', goal: 'Impacta 6 dianas antes de que termine el tiempo.', quota: 6, secs: 28, scene: 'ejecutores', difficulty: 1, winText: 'La galería reconoce tu precisión.' },
    circuito: { title: 'Circuito hextech', city: 'piltover', mode: 'circuit', goal: 'Activa los nodos en el orden que marca el núcleo.', quota: 4, secs: 35, scene: 'taller-jayce', difficulty: 1, winText: 'El flujo hextech vuelve a estabilizarse.' },
    runas: { title: 'Archivo de runas', city: 'piltover', mode: 'runes', goal: 'Memoriza la secuencia y repítela sin errores.', quota: 3, secs: 32, scene: 'academia', difficulty: 1, winText: 'Heimerdinger aprobaría el resultado.' },
    francotiradora: { title: 'Prueba de tiradora', city: 'piltover', mode: 'precision', goal: 'Acerta 5 blancos móviles de tamaño reducido.', quota: 5, secs: 24, scene: 'mansion-kiramman', difficulty: 2, winText: 'Cada disparo ha sido calculado.' },
    regateo: { title: 'Mercado de Piltover', city: 'piltover', mode: 'bargain', goal: 'Cierra 3 tratos justos sin agotar la paciencia del mercader.', quota: 3, secs: 36, scene: 'plaza', difficulty: 1, winText: 'Has conseguido un acuerdo que beneficia a ambas partes.' },
    'calibracion-hexgate': { title: 'Calibración de las Hexpuertas', city: 'piltover', mode: 'circuit', quota: 5, secs: 34, goal: 'Enciende los cinco reguladores siguiendo la ruta de energía.', scene: 'hexpuertas', difficulty: 2, winText: 'Las Hexpuertas quedan calibradas.' },
    'montaje-hextech': { title: 'Montaje hextech', city: 'piltover', mode: 'assembly', quota: 3, secs: 32, goal: 'Monta el núcleo colocando las piezas en el orden correcto.', scene: 'taller-jayce', difficulty: 1, winText: 'El prototipo funciona sin sobrecargarse.' },
    foso: { title: 'Duelo del Foso', city: 'zaun', mode: 'arena', quota: 4, secs: 32, goal: 'Sobrevive a cuatro ataques: esquiva hacia el lado seguro o cúbrete.', scene: 'foso', difficulty: 1, winText: 'El público del Foso ruge al ver tu victoria.' },
    tejados: { title: 'Carrera por los tejados', city: 'zaun', mode: 'runner', variant: 'parkour', quota: 5, secs: 35, goal: 'Cruza los tejados, evita obstáculos y recoge cinco fragmentos.', scene: 'tejados', difficulty: 1, winText: 'Has cruzado los tejados sin perder el ritmo.' },
    aerotabla: { title: 'Ruta de aerotabla', city: 'zaun', mode: 'runner', variant: 'hover', quota: 7, secs: 32, goal: 'Surca las tuberías y recoge siete cargas hextech.', scene: 'puente-zaun', difficulty: 1, winText: 'Tu aerotabla deja una estela de luz en la niebla.' },
    persecucion: { title: 'Persecución por la Lanes', city: 'zaun', mode: 'runner', variant: 'chase', quota: 6, secs: 30, goal: 'Alcanza el punto de salida esquivando barreras y recogiendo energía.', scene: 'callejones', difficulty: 2, winText: 'Has escapado de la persecución por los callejones.' },
    chatarra: { title: 'Despiece de chatarra', city: 'zaun', mode: 'scrap', quota: 6, secs: 28, goal: 'Recupera seis piezas útiles y evita los fragmentos contaminados.', scene: 'tienda-benzo', difficulty: 1, winText: 'No queda una pieza aprovechable sin clasificar.' },
    chompers: { title: 'Campo de chompers', city: 'zaun', mode: 'throw', quota: 4, secs: 27, goal: 'Activa cuatro blancos con lanzamientos precisos.', scene: 'escondite-jinx', difficulty: 2, winText: '¡Cuatro blancos y ni una explosión fuera de sitio!' },
    'sigilo-luciernagas': { title: 'Ruta de las Luciérnagas', city: 'zaun', mode: 'stealth', quota: 4, secs: 34, goal: 'Cruza las barreras de vigilancia sin activar las alarmas.', scene: 'arbol', difficulty: 1, winText: 'Has aprendido una ruta que casi nadie conoce.' },
    'contencion-brillo': { title: 'Contención de Brillo', city: 'zaun', mode: 'contain', quota: 5, secs: 30, goal: 'Cierra cinco fugas químicas. No manipules los reguladores estables.', scene: 'fabrica', difficulty: 2, winText: 'La fuga está contenida antes de que alcance el barrio.' },
  };
  const CITY_GAMES = {
    piltover: ['tiro', 'circuito', 'runas', 'francotiradora', 'regateo', 'calibracion-hexgate', 'montaje-hextech'],
    zaun: ['foso', 'tejados', 'aerotabla', 'persecucion', 'chatarra', 'chompers', 'sigilo-luciernagas', 'contencion-brillo'],
  };
  const PLACE_GAMES = {
    academia: ['runas'], 'taller-jayce': ['circuito', 'montaje-hextech'], consejo: ['runas'], ejecutores: ['tiro', 'francotiradora'],
    'mansion-kiramman': ['francotiradora'], plaza: ['regateo'], artesanos: ['montaje-hextech'], hexpuertas: ['calibracion-hexgate'],
    puente: ['tiro'], 'puente-zaun': ['aerotabla', 'persecucion'], fabrica: ['contencion-brillo'], foso: ['foso'],
    tejados: ['tejados'], 'ultima-gota': ['foso'], callejones: ['persecucion', 'sigilo-luciernagas'],
    'tienda-benzo': ['chatarra'], mercado: ['chompers'], sumidero: ['contencion-brillo'], 'escondite-jinx': ['chompers'],
    invernadero: ['sigilo-luciernagas'], arbol: ['sigilo-luciernagas'],
  };
  for (const [id, def] of Object.entries(CATALOG)) {
    GAMES[id] = { ...(GAMES[id] || {}), ...def, city: def.city, mode3d: true, winText: def.winText, loseText: 'El reto terminó antes de alcanzar el objetivo. Puedes volver a intentarlo.' };
  }
  // Metadatos para los IDs antiguos que aparecen en capítulos o guardados.
  function cityOfPlace(id) {
    for (const [city, map] of Object.entries(window.WORLD?.maps || {})) if ((map.locations || []).some((l) => l.id === id)) return city;
    return null;
  }
  function activeCity() {
    const state = window.Game?.current?.();
    return state?.world?.map || window.App?.city || state?.player?.origin || null;
  }
  function isAvailable(id, city = activeCity()) {
    const def = CATALOG[id];
    return Boolean(def && (!city || def.city === city));
  }
  function emblem(id) {
    const shapes = {
      tiro: '◎', circuito: 'ϟ', runas: 'ᚱ', francotiradora: '⊕', regateo: '◇', 'calibracion-hexgate': '⌘',
      'montaje-hextech': '✣', foso: '⚔', tejados: '↗', aerotabla: '⌁', persecucion: '➤', chatarra: '⚙',
      chompers: '✹', 'sigilo-luciernagas': '✧', 'contencion-brillo': '◉',
    };
    return `<span class="mg3d-emblem" aria-hidden="true">${shapes[id] || '◆'}</span>`;
  }
  function list(ids) {
    return (ids || Object.keys(CATALOG)).filter((id) => CATALOG[id]).map((id) => ({
      id, title: CATALOG[id].title, goal: CATALOG[id].goal, desc: CATALOG[id].goal,
      city: CATALOG[id].city, place: CATALOG[id].scene, emblem: emblem(id), mode3d: true,
    }));
  }
  function forCity(city) { return list(CITY_GAMES[city] || []); }
  function forPlace(placeId) {
    const city = cityOfPlace(placeId);
    return list((PLACE_GAMES[placeId] || []).filter((id) => CATALOG[id]?.city === city));
  }

  // Trayectoria absoluta: la altura no se acumula por fotograma y depende solo
  // del tiempo transcurrido. El destino queda fijado al seleccionar el blanco.
  function projectilePosition(from, to, progress, arcHeight = .6) {
    const t = Math.max(0, Math.min(1, progress));
    return {
      x: from.x + (to.x - from.x) * t,
      y: from.y + (to.y - from.y) * t + 4 * arcHeight * t * (1 - t),
      z: from.z + (to.z - from.z) * t,
    };
  }

  function play(id, opts = {}) {
    const def = CATALOG[id];
    if (!def) {
      window.U?.toast?.('Este desafío ya no está disponible en el catálogo 3D.', 'warn');
      return Promise.resolve(false);
    }
    const city = activeCity();
    if (city && city !== def.city) {
      window.U?.toast?.(`«${def.title}» solo está disponible en ${def.city === 'piltover' ? 'Piltover' : 'Zaun'}. Viaja a esa ciudad para jugarlo.`, 'warn');
      return Promise.resolve(false);
    }
    if (!window.THREE?.WebGLRenderer) {
      window.U?.toast?.('Tu dispositivo no ha podido iniciar la vista 3D de este minijuego.', 'warn');
      return Promise.resolve(false);
    }
    return new Promise((resolve) => {
      const THREE = window.THREE;
      const box = document.createElement('div');
      box.className = `mg3d mg3d-${def.city} mg3d-${id}`;
      box.setAttribute('role', 'dialog');
      box.setAttribute('aria-modal', 'true');
      box.setAttribute('aria-label', def.title);
      const head = document.createElement('header');
      head.className = 'mg3d-head';
      const brand = document.createElement('div');
      brand.className = 'mg3d-brand';
      brand.innerHTML = `<span class="mg3d-eyebrow">${def.city === 'piltover' ? 'PILTOVER · HEXTECH' : 'ZAUN · SUBCIUDAD'} · EXPERIENCIA 3D</span><h2>${def.title}</h2><p>${def.goal}</p>`;
      const close = document.createElement('button');
      close.className = 'mg3d-close';
      close.type = 'button';
      close.textContent = '×';
      close.setAttribute('aria-label', 'Salir del minijuego');
      head.append(brand, close);
      const stage = document.createElement('div');
      stage.className = 'mg3d-stage';
      const hud = document.createElement('div');
      hud.className = 'mg3d-hud';
      const scoreEl = document.createElement('div');
      scoreEl.className = 'mg3d-stat';
      const timeEl = document.createElement('div');
      timeEl.className = 'mg3d-stat';
      const progressEl = document.createElement('div');
      progressEl.className = 'mg3d-stat mg3d-progress';
      const message = document.createElement('div');
      message.className = 'mg3d-message';
      hud.append(scoreEl, progressEl, timeEl);
      const canvasWrap = document.createElement('div');
      canvasWrap.className = 'mg3d-canvas-wrap';
      stage.append(canvasWrap, hud, message);
      const controls = document.createElement('div');
      controls.className = 'mg3d-controls';
      const footer = document.createElement('footer');
      footer.className = 'mg3d-footer';
      footer.innerHTML = `<span>${def.city === 'piltover' ? 'Ciudad alta · Tecnología hextech' : 'Ciudad subterránea · Tecnología improvisada'}</span><span>ESC · Pausa y salida</span>`;
      box.append(head, stage, controls, footer);
      document.body.append(box);
      let renderer, scene, camera, raf = 0, running = true, done = false, disposed = false, resultShown = false, elapsed = 0, last = 0, spawnT = 0;
      let score = 0, mistakes = 0, rounds = 0, seqIndex = 0;
      let objectCount = 0, worldSpeed = 0, currentRound = 0, actionUsed = false;
      let attack = 'izquierda', attackWait = 2.2, runnerLane = 0, jump = 0, jumpV = 0, progress = 0;
      let currentNeed = 0, bargainRounds = 0, bargainDeals = 0;
      let stealthLane = 0, stealthSpawn = 0;
      const interactive = [], moving = [], projectiles = [];
      const disposables = new Set();
      const keys = new Set();
      let scoreMax = def.quota;
      const rand = (a, b) => a + Math.random() * (b - a);
      const choose = (a) => a[Math.floor(Math.random() * a.length)];
      const hex = (value) => new THREE.Color(value);
      const material = (color, emissive = color, extra = {}) => new THREE.MeshStandardMaterial({ color, emissive, emissiveIntensity: emissive ? 0.6 : 0, metalness: def.city === 'piltover' ? 0.72 : 0.35, roughness: 0.32, ...extra });
      const mesh = (geo, mat, pos = [0, 0, 0]) => {
        const m = new THREE.Mesh(geo, mat);
        m.position.set(...pos);
        scene.add(m); disposables.add(m);
        return m;
      };
      const cube = (w, h, d, color, pos, emissive = color) => mesh(new THREE.BoxGeometry(w, h, d), material(color, emissive), pos);
      const torus = (r, tube, color, pos, rx = Math.PI / 2) => {
        const m = mesh(new THREE.TorusGeometry(r, tube, 8, 48), material(color, color), pos); m.rotation.x = rx; return m;
      };
      const sphere = (r, color, pos, emissive = color, geo = null) => mesh(geo || new THREE.IcosahedronGeometry(r, 2), material(color, emissive), pos);
      const labelMessage = (text, kind = '') => { message.textContent = text; message.className = `mg3d-message ${kind}`; };
      const addInteractive = (obj, data) => { obj.userData = { ...(obj.userData || {}), ...data }; interactive.push(obj); return obj; };
      const updateHud = () => {
        scoreEl.innerHTML = `<small>MARCADOR</small><strong>${score}<i> / ${scoreMax}</i></strong>`;
        timeEl.innerHTML = `<small>TIEMPO</small><strong>${Math.max(0, Math.ceil(def.secs - elapsed))}<i>s</i></strong>`;
        progressEl.innerHTML = `<small>ESTADO</small><strong>${def.mode === 'bargain' ? `${bargainDeals}/3 tratos` : def.mode === 'arena' ? `${rounds}/4 asaltos` : def.mode === 'runner' ? `${Math.floor(progress)}% de ruta` : def.mode === 'runes' ? `${Math.min(score, scoreMax)}/${scoreMax} símbolos` : `${Math.min(score, scoreMax)}/${scoreMax} objetivos`}</strong>`;
      };
      const disposeScene = () => {
        disposed = true;
        if (raf) cancelAnimationFrame(raf);
        running = false;
        window.removeEventListener('keydown', onKey, true);
        window.removeEventListener('keyup', onKeyUp, true);
        window.removeEventListener('blur', onBlur);
        window.removeEventListener('resize', resize);
        if (renderer) {
          renderer.dispose();
          renderer.forceContextLoss?.();
          renderer.domElement.remove();
          renderer = null;
        }
        if (scene) {
          scene.traverse((obj) => {
            obj.geometry?.dispose?.();
            const materials = Array.isArray(obj.material) ? obj.material : obj.material ? [obj.material] : [];
            materials.forEach((m) => { m.map?.dispose?.(); m.dispose?.(); });
          });
          scene.clear();
        }
      };
      const closeResult = (win) => {
        if (done) return;
        done = true;
        disposeScene();
        window.U?.toast?.(win ? 'Reto 3D superado.' : 'Reto 3D terminado.', win ? 'good' : 'warn');
        box.classList.add('mg3d-exit');
        window.setTimeout(() => box.remove(), 160);
        resolve(Boolean(win));
      };
      const showResult = (win) => {
        if (resultShown || done) return;
        resultShown = true;
        running = false;
        if (raf) cancelAnimationFrame(raf);
        controls.innerHTML = '';
        const result = document.createElement('div');
        result.className = `mg3d-result ${win ? 'win' : 'lose'}`;
        const eyebrow = document.createElement('small'); eyebrow.textContent = win ? 'RETO COMPLETADO' : 'RETO INCONCLUSO';
        const title = document.createElement('h2'); title.textContent = win ? 'Objetivo conseguido' : 'La ciudad no espera';
        const copy = document.createElement('p'); copy.textContent = win ? def.winText : `Has logrado ${score} de ${scoreMax} objetivos. ${def.loseText}`;
        const actions = document.createElement('div'); actions.className = 'row gap wrap';
        if (!win) {
          const retry = document.createElement('button'); retry.className = 'btn primary'; retry.textContent = 'Reintentar';
          retry.onclick = () => { disposeScene(); box.remove(); play(id, opts).then(resolve); };
          actions.append(retry);
        }
        const leave = document.createElement('button'); leave.className = win ? 'btn primary' : 'btn ghost'; leave.textContent = win ? 'Continuar' : 'Salir';
        leave.onclick = () => closeResult(win);
        actions.append(leave);
        result.append(eyebrow, title, copy, actions);
        box.append(result);
        if (win) window.Audio2?.sfx?.unlock?.(); else window.Audio2?.sfx?.locked?.();
      };
      close.onclick = () => showResult(false);

      function setupScene() {
        scene = new THREE.Scene();
        const zaun = def.city === 'zaun';
        scene.background = hex(zaun ? '#071716' : '#111925');
        scene.fog = new THREE.Fog(zaun ? '#071716' : '#111925', 13, 46);
        camera = new THREE.PerspectiveCamera(52, 1, 0.1, 90);
        camera.position.set(0, def.mode === 'runner' ? 5.6 : 5.2, def.mode === 'runner' ? 11.8 : 12.6);
        camera.lookAt(0, 1, -3);
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
        renderer.setSize(stage.clientWidth || window.innerWidth, stage.clientHeight || Math.round(window.innerHeight * 0.65));
        renderer.outputColorSpace = THREE.SRGBColorSpace || renderer.outputColorSpace;
        if ('ACESFilmicToneMapping' in THREE) renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.08;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.domElement.className = 'mg3d-webgl';
        canvasWrap.append(renderer.domElement);
        scene.add(new THREE.HemisphereLight(zaun ? '#b8ffec' : '#fff1c9', '#11131d', 1.6));
        const key = new THREE.DirectionalLight(zaun ? '#75e9cf' : '#ffe3a1', 3.3);
        key.position.set(-6, 10, 6); key.castShadow = true; scene.add(key);
        const rim = new THREE.PointLight(zaun ? '#42ffc1' : '#5dbfff', 14, 40);
        rim.position.set(4, 4, -5); scene.add(rim);
        const floorMat = material(zaun ? '#132d2a' : '#2a2c31', zaun ? '#0a4b3c' : '#5a471f', { metalness: .6, roughness: .65 });
        const floor = new THREE.Mesh(new THREE.PlaneGeometry(90, 90), floorMat);
        floor.rotation.x = -Math.PI / 2; floor.position.y = -0.16; floor.receiveShadow = true; scene.add(floor);
        // Fondo de localización de Arcane a modo de telón 3D: el escenario conserva profundidad,
        // luces y colisiones propias, pero deja de parecer un prototipo abstracto sin ciudad.
        const season = window.CustomArt?.season?.() || 's1';
        const artUrl = window.CustomArt?.image?.('lugares', def.scene)
          || window.ART_BUNDLED?.[`lugares/${season}`]?.[def.scene]
          || window.ART_BUNDLED?.['lugares/s1']?.[zaun ? 'zaun' : 'piltover'];
        if (artUrl && THREE.TextureLoader) {
          new THREE.TextureLoader().load(artUrl, (texture) => {
            if (done || disposed || !scene) { texture.dispose?.(); return; }
            if (THREE.SRGBColorSpace) texture.colorSpace = THREE.SRGBColorSpace;
            const backdrop = new THREE.Mesh(
              new THREE.PlaneGeometry(64, 38),
              new THREE.MeshBasicMaterial({ map: texture, color: 0x849397, transparent: true, opacity: .64, side: THREE.DoubleSide, depthWrite: false })
            );
            backdrop.position.set(0, -1.5, -38);
            backdrop.renderOrder = -10;
            scene.add(backdrop);
          }, undefined, () => { /* el escenario geométrico sigue disponible si falla el recurso */ });
        }
        // Plataformas geométricas y arquitectura estilizada, siempre con volumen 3D real.
        for (let i = 0; i < 7; i++) {
          const x = (i % 2 ? -1 : 1) * rand(6, 11);
          const z = -i * 5 - 2;
          const h = rand(2.4, 7.5);
          const col = zaun ? choose(['#163c38', '#174c43', '#302b3a']) : choose(['#746342', '#514b40', '#6e7d7e']);
          const b = cube(rand(1.4, 3.1), h, rand(1.4, 3), col, [x, h / 2 - .15, z], zaun ? '#0c5e4d' : '#6f572b');
          b.rotation.y = rand(-.3, .3);
          if (i % 2 === 0) {
            cube(.12, h * .8, .12, zaun ? '#42d6b5' : '#68c9ff', [x, h / 2, z + 1.55], zaun ? '#42d6b5' : '#68c9ff');
          }
        }
        // Siluetas de ciudad, no bloques intercambiables: Piltover se reconoce por
        // piedra clara y herrajes de latón; Zaun por conducciones de hierro remendadas.
        if (zaun) {
          const iron = material('#263b39', '#172b28', { metalness: .82, roughness: .48 });
          const verdigris = material('#58796c', '#245648', { metalness: .7, roughness: .4 });
          for (const side of [-1, 1]) {
            const x = side * 4.8;
            const pipe = new THREE.CatmullRomCurve3([
              new THREE.Vector3(x, 4.8, 3), new THREE.Vector3(x, 4.8, -1),
              new THREE.Vector3(x + side * .8, 3.7, -4), new THREE.Vector3(x + side * .8, 3.7, -12),
            ]);
            mesh(new THREE.TubeGeometry(pipe, 20, .16, 8, false), iron);
            for (const z of [-1, -6, -11]) {
              const joint = mesh(new THREE.CylinderGeometry(.27, .27, .16, 10), verdigris, [x + (z < -2 ? side * .8 : 0), z < -2 ? 3.7 : 4.8, z]);
              joint.rotation.x = Math.PI / 2;
            }
          }
        } else {
          const marble = material('#b4b6a9', '#615b45', { metalness: .22, roughness: .7 });
          const brass = material('#c69b4e', '#9a7130', { metalness: .78, roughness: .28 });
          for (const x of [-5.1, 5.1]) {
            for (const z of [-7, -16]) {
              const column = mesh(new THREE.CylinderGeometry(.48, .62, 6.4, 12), marble, [x, 3.05, z]);
              column.castShadow = true;
              for (const y of [.28, 5.72]) {
                const capital = mesh(new THREE.CylinderGeometry(.72, .72, .22, 12), brass, [x, y, z]);
                capital.castShadow = true;
              }
              // Medallón hexagonal: alusión sobria a la arquitectura hextech de la ciudad alta.
              const medallion = mesh(new THREE.CylinderGeometry(.32, .32, .12, 6), brass, [x, 3.4, z + .56]);
              medallion.rotation.x = Math.PI / 2;
            }
          }
        }
        for (let i = 0; i < 45; i++) {
                const p = sphere(rand(.025, .09), zaun ? '#60eac5' : '#e8c56f', [rand(-12, 12), rand(.4, 6), rand(-30, 7)], zaun ? '#30ddad' : '#ffcc65');
          p.userData.floating = true; p.userData.phase = rand(0, Math.PI * 2); p.userData.baseY = p.position.y;
        }
        torus(2.3, .08, zaun ? '#2bd4ab' : '#e5c06d', [0, .02, -2], 0);
      }

      function playerMesh() {
        const group = new THREE.Group(); scene.add(group); group.position.set(0, .7, 4);
        const body = new THREE.Mesh(new THREE.CylinderGeometry(.3, .38, .82, 12, 1), material(def.city === 'zaun' ? '#42d6b5' : '#e8c56f', def.city === 'zaun' ? '#2dd7ab' : '#b99242'));
        body.position.y = .5; body.castShadow = true; group.add(body);
        const head = new THREE.Mesh(new THREE.SphereGeometry(.25, 16, 12), material('#d6b7a0', '#58443b'));
        head.position.y = 1.15; group.add(head);
        const board = new THREE.Mesh(new THREE.BoxGeometry(.85, .12, 1.15), material(def.city === 'zaun' ? '#65cfc2' : '#bed9e2', '#3ea7cc'));
        board.position.y = -.13; group.add(board);
        return group;
      }
      function targetMesh(i, opts = {}) {
        const group = new THREE.Group();
        group.position.set(opts.x ?? rand(-4.2, 4.2), opts.y ?? rand(1.2, 3.7), opts.z ?? rand(-9, -4));
        const color = opts.color || (def.city === 'zaun' ? '#e04b83' : '#68ccff');
        const core = new THREE.Mesh(new THREE.IcosahedronGeometry(opts.size || .42, 1), material(color, color, { emissiveIntensity: 1.5 }));
        core.castShadow = true; group.add(core);
        const ring = new THREE.Mesh(new THREE.TorusGeometry((opts.size || .42) * 1.6, .035, 8, 28), material(opts.ring || '#f1d990', opts.ring || '#f1d990'));
        group.add(ring);
        scene.add(group); group.userData.targetIndex = i; group.userData.phase = rand(0, 8);
        moving.push(group); return group;
      }
      function makeNode(i, x, z, color = '#68ccff', glyph = '') {
        const group = new THREE.Group(); group.position.set(x, 1.15, z); scene.add(group);
        const base = new THREE.Mesh(new THREE.CylinderGeometry(.48, .58, .22, 6), material(def.city === 'zaun' ? '#214640' : '#655b42', '#9a834e'));
        base.castShadow = true; group.add(base);
        const core = new THREE.Mesh(new THREE.OctahedronGeometry(.31, 1), material(color, color, { emissiveIntensity: 1.6 }));
        core.position.y = .25; group.add(core);
        const halo = new THREE.Mesh(new THREE.TorusGeometry(.58, .035, 8, 32), material(color, color));
        halo.position.y = .22; halo.rotation.x = Math.PI / 2; group.add(halo);
        group.userData.glyph = glyph; return group;
      }
      let player = null;
      function addMobileControls() {
        if (['runner', 'arena', 'stealth'].includes(def.mode)) {
          const keys = def.mode === 'runner'
            ? [['ArrowLeft', '←'], ['ArrowUp', 'SALTAR'], ['ArrowRight', '→']]
            : def.mode === 'stealth'
              ? [['ArrowLeft', '←'], ['ArrowUp', 'AGACHAR'], ['ArrowRight', '→']]
              : [['ArrowLeft', 'ESQUIVAR ←'], ['Space', 'CUBRIR'], ['ArrowRight', 'ESQUIVAR →']];
          for (const [key, label] of keys) {
            const b = document.createElement('button'); b.type = 'button'; b.className = 'mg3d-control'; b.textContent = label;
            const down = (e) => { e.preventDefault(); pressAction(key); b.classList.add('is-on'); };
            const up = () => b.classList.remove('is-on');
            b.addEventListener('pointerdown', down); b.addEventListener('pointerup', up); b.addEventListener('pointercancel', up); b.addEventListener('pointerleave', up);
            controls.append(b);
          }
        }
      }
      function pressAction(key) {
        const k = String(key).toLowerCase();
        if (def.mode === 'runner') {
          if (k.includes('left')) runnerLane = Math.max(-1, runnerLane - 1);
          if (k.includes('right')) runnerLane = Math.min(1, runnerLane + 1);
          if (k.includes('up') || k === 'space') jumpV = 5.6;
        } else if (def.mode === 'arena' || def.mode === 'stealth') {
          if (def.mode === 'arena') {
            const safe = attack === 'izquierda' ? 'arrowright' : 'arrowleft';
            const success = k === safe || k === 'space';
            if (success) { score++; labelMessage('¡Buen movimiento! Has leído el ataque.', 'good'); }
            else { mistakes++; labelMessage('Te han alcanzado. Observa de qué lado viene el siguiente golpe.', 'bad'); }
            rounds++; attack = choose(['izquierda', 'derecha']); actionUsed = true; attackWait = 2.0;
            if (rounds >= 4) finish(score >= 3);
          } else {
            const move = k.includes('left') ? -1 : k.includes('right') ? 1 : 0;
            runnerLane = Math.max(-1, Math.min(1, runnerLane + move));
            if (k.includes('up')) {
              jump = jump ? 0 : 1; // En sigilo, ↑ alterna entre ir erguido y agacharse.
              if (player) player.scale.y = jump ? .62 : 1;
              labelMessage(jump ? 'Agachada: el haz alto no te alcanza.' : 'Te has levantado. Observa el próximo barrido.', 'hint');
            } else if (move) {
              labelMessage(`Te has desplazado al carril ${runnerLane + 2}. Vigila el haz rojo.`, 'hint');
            }
          }
        }
      }
      function addActionButtons(labels) {
        controls.innerHTML = '';
        for (const item of labels) {
          const b = document.createElement('button'); b.type = 'button'; b.className = 'mg3d-control';
          b.textContent = item.label;
          b.onclick = item.run;
          controls.append(b);
        }
      }
      function initChallenge() {
        const mode = def.mode;
        if (['shoot', 'precision', 'throw'].includes(mode)) {
          for (let i = 0; i < Math.max(def.quota, 5); i++) {
            const t = targetMesh(i, { size: mode === 'precision' ? .25 : mode === 'throw' ? .34 : .43, color: mode === 'throw' ? '#f05e8b' : undefined });
            addInteractive(t.children[0], { kind: 'target', parent: t, index: i });
          }
          labelMessage(mode === 'throw' ? 'Toca un blanco para lanzar un chomper.' : 'Apunta con el cursor o el dedo y selecciona las dianas luminosas.');
        } else if (['circuit', 'runes', 'assembly'].includes(mode)) {
          const count = def.quota;
          for (let i = 0; i < count; i++) {
            const node = makeNode(i, (i - (count - 1) / 2) * (count > 4 ? 2 : 2.5), -3 - (i % 2) * 1.25, ['#66d7ff', '#eac76e', '#d87cbf', '#70dfb2', '#ff9169'][i % 5]);
            node.userData.index = i;
            addInteractive(node.children[1], { kind: mode === 'runes' ? 'rune' : mode === 'assembly' ? 'part' : 'node', parent: node, index: i });
            if (mode === 'assembly') node.userData.index = [2, 0, 1, 3, 4][i];
          }
          if (mode === 'runes') labelMessage('Memoriza la secuencia de colores: rosa → azul → oro.', 'hint');
          else if (mode === 'assembly') labelMessage('Monta el núcleo en orden: rosa → azul → oro.');
          else labelMessage(`Ruta de energía: activa los nodos del 1 al ${count}.`);
        } else if (mode === 'bargain') {
          bargainRounds = 0; bargainDeals = 0; currentNeed = Math.floor(rand(38, 58));
          cube(5.5, .8, 1.2, '#6b583b', [0, .45, -3.6], '#a88a50');
          for (let i = 0; i < 5; i++) {
            const coin = mesh(new THREE.CylinderGeometry(.24, .24, .05, 24), material('#e6c46e', '#e6c46e'), [-1.8 + i * .9, .95, -3.5]);
            coin.rotation.x = Math.PI / 2; coin.rotation.z = rand(-.3,.3);
          }
          showBargainOptions();
        } else if (mode === 'arena') {
          player = playerMesh();
          const foe = new THREE.Group(); scene.add(foe); foe.position.set(0,0,-4);
          const body = new THREE.Mesh(new THREE.CylinderGeometry(.36,.48,1.45,12), material('#9d354d','#e74663'));
          body.position.y = .95; foe.add(body);
          const head = new THREE.Mesh(new THREE.SphereGeometry(.32,16,12), material('#dbb59c','#66433d'));
          head.position.y = 1.9; foe.add(head);
          const fist = new THREE.Mesh(new THREE.BoxGeometry(.32,.3,.45), material('#d4b17b','#d4b17b'));
          fist.position.set(.7,1.2,.1); foe.add(fist);
          foe.userData.enemy = true;
          labelMessage('¡Golpe por la izquierda! Esquiva hacia la derecha o cúbrete.', 'hint');
          addActionButtons([
            { label: '← Esquivar', run: () => pressAction('ArrowLeft') },
            { label: 'Cubrirte · Espacio', run: () => pressAction('Space') },
            { label: 'Esquivar →', run: () => pressAction('ArrowRight') },
          ]);
        } else if (mode === 'stealth') {
          player = playerMesh();
          worldSpeed = 7;
          stealthSpawn = 1.0;
          spawnStealthBeam();
          labelMessage('Cruza sin que el haz rojo te detecte: cambia de carril o agáchate antes del barrido.', 'hint');
          addActionButtons([
            { label: '← Cambiar carril', run: () => pressAction('ArrowLeft') },
            { label: 'Agacharse · ↑', run: () => pressAction('ArrowUp') },
            { label: 'Cambiar carril →', run: () => pressAction('ArrowRight') },
          ]);
        } else if (mode === 'runner') {
          player = playerMesh();
          worldSpeed = def.variant === 'chase' ? 13.5 : def.variant === 'hover' ? 10.5 : 8.5;
          spawnObstacle();
          labelMessage(def.variant === 'hover' ? 'Muévete de carril y recoge las cargas azules.' : 'Muévete a izquierda o derecha; salta para evitar barreras.');
          addActionButtons([
            { label: '←', run: () => pressAction('ArrowLeft') },
            { label: def.variant === 'hover' ? 'Impulso ↑' : 'Saltar ↑', run: () => pressAction('ArrowUp') },
            { label: '→', run: () => pressAction('ArrowRight') },
          ]);
        } else if (mode === 'scrap') {
          for (let i = 0; i < 12; i++) {
            const good = i % 3 !== 0;
            const col = good ? choose(['#72d7bf', '#e6c36d', '#7fc8f3']) : '#e05c70';
            const part = sphere(rand(.2, .42), col, [rand(-4.3, 4.3), rand(.4, 2.7), rand(-7, -2)], col);
            part.userData.phase = rand(0, 8);
            addInteractive(part, { kind: 'scrap', good, part });
          }
          labelMessage('Recoge seis piezas verdes, doradas o azules; las piezas rojas están contaminadas.');
        } else if (mode === 'contain') {
          // Cinco fugas rojas reales, intercaladas con cinco reguladores verdes seguros.
          for (let i = 0; i < 10; i++) {
            const leak = i % 2 === 0;
            const node = makeNode(i, (i % 5 - 2) * 1.85, -3 - Math.floor(i / 5) * 2.2, leak ? '#f05d77' : '#4fcfb7');
            addInteractive(node.children[1], { kind: leak ? 'leak' : 'safe', parent: node, index: i });
          }
          labelMessage('Cierra las cinco fugas rojas. No toques los reguladores verdes estables.');
        }
        addMobileControls();
      }
      function showBargainOptions() {
        controls.innerHTML = '';
        message.textContent = `Oferta ${bargainRounds + 1}/4 · El mercader pide ${currentNeed} monedas.`;
        for (const offer of [Math.max(10, currentNeed - 22), currentNeed - 5, currentNeed + 12]) {
          const b = document.createElement('button'); b.className = 'mg3d-control'; b.textContent = `Ofrecer ${offer}`;
          b.onclick = () => {
            bargainRounds++;
            if (offer >= currentNeed - 8 && offer <= currentNeed + 5) bargainDeals++;
            currentNeed = Math.floor(rand(38, 58));
            if (bargainRounds >= 4) { score = bargainDeals; finish(score >= def.quota); }
            else showBargainOptions();
            updateHud();
          };
          controls.append(b);
        }
      }
      function spawnStealthBeam() {
        stealthLane = Math.floor(rand(-1, 2));
        const beam = cube(1.95, .07, .1, '#e74b68', [stealthLane * 2.5, 1.55, -20], '#ff4267');
        beam.userData.kind = 'scan';
        beam.userData.lane = stealthLane;
        beam.userData.judged = false;
        moving.push(beam);
      }
      function spawnObstacle() {
        const lane = Math.floor(rand(-1, 2));
        const isCharge = Math.random() > .56;
        const o = isCharge
          ? sphere(.23, '#4ccff3', [lane * 2.5, 1.2, -26], '#4ccff3')
          : cube(1.25, rand(.65, 2.2), .7, '#e05668', [lane * 2.5, .7, -26], '#dc3f54');
        o.userData.kind = isCharge ? 'charge' : 'obstacle';
        o.userData.lane = lane; o.userData.scored = false;
        moving.push(o);
      }
      function onPointer(e) {
        if (!running || done || ['runner', 'arena', 'stealth'].includes(def.mode)) return;
        e.preventDefault();
        const rect = renderer.domElement.getBoundingClientRect();
        const pointer = new THREE.Vector2(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
        const ray = new THREE.Raycaster(); ray.setFromCamera(pointer, camera);
        const hits = ray.intersectObjects(interactive, true);
        if (!hits.length) return;
        let obj = hits[0].object;
        while (obj && !obj.userData.kind) obj = obj.parent;
        if (!obj) return;
        const data = obj.userData;
        if (data.kind === 'target') {
          if (def.mode === 'throw') {
            const projectile = sphere(.16, '#ef6c9b', [0, 1.4, 4], '#ff9dbf');
            projectile.userData.flight = { from: projectile.position.clone(), to: data.parent.position.clone(), t: 0 };
            projectiles.push(projectile);
          }
          score++;
          labelMessage(def.mode === 'throw' ? '¡Chomper al blanco!' : 'Impacto confirmado.', 'good');
          const root = data.parent; root.position.set(rand(-4.4, 4.4), rand(1.2, 3.9), rand(-10, -4));
          root.children[0].material.color.set(def.city === 'zaun' ? '#f06498' : '#70d8ff');
          if (score >= def.quota) finish(true);
        } else if (data.kind === 'node' || data.kind === 'rune' || data.kind === 'part') {
          const expectedIndex = data.kind === 'part' ? [2, 0, 1, 3, 4][seqIndex] : def.mode === 'runes' ? [2, 0, 1][seqIndex] : seqIndex % def.quota;
          const correct = data.index === expectedIndex;
          if (correct) {
            score++; seqIndex++;
            const parent = data.parent; parent.userData.completed = true;
            parent.children.forEach((child) => { if (child.material?.emissive) child.material.emissive.set('#61e6bf'); });
            labelMessage(data.kind === 'rune' ? 'Memoria correcta. La secuencia continúa.' : 'Conexión establecida.', 'good');
            if (score >= def.quota) finish(true);
          } else {
            mistakes++; score = Math.max(0, score - 1); seqIndex = 0;
            interactive.forEach((o) => { const p = o.parent; if (p?.userData) p.userData.completed = false; });
            labelMessage('Secuencia incorrecta. Vuelve al primer nodo.', 'bad');
            if (mistakes >= 4) finish(false);
          }
        } else if (data.kind === 'scrap') {
          if (data.good) { score++; labelMessage('Pieza recuperada y clasificada.', 'good'); }
          else { mistakes++; labelMessage('Esa pieza está contaminada. Déjala aparte.', 'bad'); }
          if (data.part) data.part.visible = false;
          if (score >= def.quota) finish(true);
          if (mistakes >= 3) finish(false);
        } else if (data.kind === 'leak' || data.kind === 'safe') {
          if (data.kind === 'leak') { score++; labelMessage('Fuga cerrada.', 'good'); }
          else { mistakes++; labelMessage('Regulador estable: no lo manipules.', 'bad'); }
          const parent = data.parent; if (parent) parent.visible = false;
          if (score >= def.quota) finish(true);
          if (mistakes >= 3) finish(false);
        }
        updateHud();
      }
      function onKey(e) {
        if (e.type === 'keydown') {
          const k = e.key.toLowerCase();
          if (k === 'escape') { e.preventDefault(); showResult(false); return; }
          if (['arrowleft', 'arrowright', 'arrowup', ' ', 'a', 'd', 'w'].includes(k)) e.preventDefault();
          if (!keys.has(k)) pressAction(k === 'a' ? 'ArrowLeft' : k === 'd' ? 'ArrowRight' : k === 'w' ? 'ArrowUp' : k === ' ' ? 'Space' : e.key);
          keys.add(k);
        }
      }
      function onKeyUp(e) { keys.delete(e.key.toLowerCase()); }
      function onBlur() { keys.clear(); }
      function finish(win) { if (done || !running) return; showResult(Boolean(win)); }
      function resize() {
        if (!renderer || !camera) return;
        const w = Math.max(1, canvasWrap.clientWidth), h = Math.max(1, canvasWrap.clientHeight);
        camera.aspect = w / h; camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
      function animate(dt) {
        scene.traverse((o) => {
          if (o.userData?.floating) { o.position.y = o.userData.baseY + Math.sin(elapsed * 1.4 + o.userData.phase) * .15; o.rotation.y += dt * .4; }
        });
        for (const o of moving) {
          if (o.userData?.phase != null) o.rotation.y += dt * 1.25;
          if (o.userData?.kind === 'scan' && def.mode === 'stealth') {
            o.position.z += worldSpeed * dt;
            if (!o.userData.judged && o.position.z >= 2.5) {
              o.userData.judged = true;
              if (runnerLane === o.userData.lane && !jump) {
                mistakes++;
                labelMessage('¡Te ha detectado la cámara! Cambia de carril o agáchate antes del próximo barrido.', 'bad');
                if (mistakes >= 3) finish(false);
              } else {
                score++;
                labelMessage('Barrido superado: has evitado la vigilancia.', 'good');
                if (score >= def.quota) finish(true);
              }
            }
            if (o.position.z > 5) o.visible = false;
          }
          if (o.userData?.kind === 'obstacle' || o.userData?.kind === 'charge') {
            o.position.z += worldSpeed * dt;
            if (!o.userData.scored && o.position.z > 3.3) {
              o.userData.scored = true;
              if (o.userData.lane === runnerLane && (o.userData.kind === 'obstacle' ? jump < .55 : true)) {
                if (o.userData.kind === 'charge') { score++; labelMessage('Carga hextech recogida.', 'good'); }
                else { mistakes++; labelMessage('Choque. Cambia de carril o salta la próxima barrera.', 'bad'); }
                if (mistakes >= 3) finish(false);
                if (score >= def.quota) finish(true);
              }
            }
            if (o.position.z > 7) { o.visible = false; if (o.userData.kind === 'obstacle') objectCount++; }
          }
        }
        for (const p of projectiles) {
          const f = p.userData.flight;
          f.t = Math.min(1, f.t + dt * 2.5);
          const position = projectilePosition(f.from, f.to, f.t);
          p.position.set(position.x, position.y, position.z);
        }
        for (let i = projectiles.length - 1; i >= 0; i--) if (projectiles[i].userData.flight.t >= 1) { const p = projectiles.splice(i, 1)[0]; p.parent?.remove(p); p.geometry?.dispose(); p.material?.dispose(); }
        player?.position && (player.position.x += (runnerLane * 2.5 - player.position.x) * Math.min(1, dt * 7));
        if (player && def.mode === 'runner') {
          if (jumpV > 0 || jump > 0) {
            jumpV -= 12 * dt;
            jump = Math.max(0, jump + jumpV * dt);
            if (jump === 0) jumpV = 0;
          }
          player.position.y = .7 + jump;
          progress += dt * (def.variant === 'chase' ? 4 : 3.1);
          spawnT += dt;
          if (spawnT > (def.variant === 'chase' ? .95 : 1.3)) { spawnT = 0; spawnObstacle(); }
          if (progress >= 100) finish(score >= def.quota);
        }
        if (def.mode === 'arena') {
          attackWait -= dt;
          if (attackWait <= .7 && !actionUsed) labelMessage(`¡Golpe por la ${attack}! Esquiva al lado contrario o cúbrete.`, 'hint');
          if (attackWait <= 0) {
            if (!actionUsed) { mistakes++; rounds++; labelMessage('No has reaccionado a tiempo.', 'bad'); }
            actionUsed = false;
            if (mistakes >= 2) finish(false);
            attack = choose(['izquierda', 'derecha']); attackWait = 2.0;
            if (rounds >= 4) finish(score >= 3);
          }
        }
        if (def.mode === 'stealth') {
          progress += dt * 4.5;
          stealthSpawn += dt;
          if (stealthSpawn > 2.15) { stealthSpawn = 0; spawnStealthBeam(); }
          if (progress >= 100) finish(score >= def.quota);
        }
        if (elapsed > def.secs) finish(score >= def.quota);
      }
      function loop(now) {
        if (!running || done || !renderer) return;
        const dt = Math.min(.04, Math.max(0, (now - (last || now)) / 1000)); last = now; elapsed += dt;
        if (def.mode === 'runes' && elapsed > 2.8 && seqIndex === 0 && message.textContent.includes('Memoriza')) labelMessage('La secuencia se ha ocultado. Repítela con los nodos luminosos.', 'hint');
        if (def.mode === 'shoot' || def.mode === 'precision' || def.mode === 'throw') {
          moving.forEach((o) => { o.position.x += Math.sin(elapsed * 1.4 + o.userData.phase) * dt * (def.mode === 'precision' ? 1.25 : .45); o.position.y += Math.cos(elapsed * 1.7 + o.userData.phase) * dt * .35; });
        }
        animate(dt);
        if (renderer && scene) renderer.render(scene, camera);
        updateHud();
        if (running && !done) raf = requestAnimationFrame(loop);
      }
      function start() {
        try {
          setupScene();
          initChallenge();
          renderer.domElement.addEventListener('pointerdown', onPointer, { passive: false });
          window.addEventListener('keydown', onKey, true);
          window.addEventListener('keyup', onKeyUp, true);
          window.addEventListener('blur', onBlur);
          window.addEventListener('resize', resize);
          score = 0; elapsed = 0; mistakes = 0; rounds = 0; seqIndex = 0; progress = 0;
          updateHud(); resize(); raf = requestAnimationFrame(loop);
        } catch (err) {
          console.error('No se pudo iniciar el minijuego 3D:', err);
          disposeScene();
          box.remove();
          window.U?.toast?.('No se ha podido abrir el escenario 3D de este reto.', 'warn');
          resolve(false);
        }
      }
      // Acepta origen/teclado y mantiene el foco dentro de la partida.
      start();
    });
  }

  window.Minigames = {
    GAMES,
    CATALOG,
    CITY_GAMES,
    PLACE_GAMES,
    play,
    list: (ids) => list(ids),
    forCity,
    forPlace,
    isAvailable,
    activeCity,
    emblem,
    maxGames: Object.keys(CATALOG).length,
    motion: { projectilePosition },
    renderer: 'three-js-webgl',
  };
})();
