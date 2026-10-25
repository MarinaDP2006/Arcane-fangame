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

  // ---------- Utilidades de pintura ----------
  function rng(seed) {
    let a = seed >>> 0;
    return () => {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function canvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
  function tex(c, repeat) {
    const t = new T.CanvasTexture(c);
    t.colorSpace = T.SRGBColorSpace;
    t.anisotropy = 4;
    if (repeat) { t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(repeat[0], repeat[1]); }
    return t;
  }
  /** Pinceladas: manchas alargadas semitransparentes, para que nada parezca plano. */
  function brush(g, w, h, colors, n, r, size = 1) {
    for (let i = 0; i < n; i++) {
      g.save();
      g.translate(r() * w, r() * h);
      g.rotate((r() - 0.5) * 0.6);
      g.globalAlpha = 0.05 + r() * 0.12;
      g.fillStyle = colors[Math.floor(r() * colors.length)];
      g.beginPath();
      g.ellipse(0, 0, (8 + r() * 30) * size, (2 + r() * 6) * size, 0, 0, Math.PI * 2);
      g.fill();
      g.restore();
    }
    g.globalAlpha = 1;
  }

  // Fachadas (lienzos de 256x512 que se repiten en altura)
  function facadePiltover(seed) {
    const r = rng(seed);
    const c = canvas(256, 512);
    const g = c.getContext('2d');
    const base = ['#e2d3ad', '#d8c39a', '#ead9b6', '#cdb68a'][Math.floor(r() * 4)];
    g.fillStyle = base; g.fillRect(0, 0, 256, 512);
    brush(g, 256, 512, ['#f4e7c8', '#b99e70', '#c9b083', '#fff3d6'], 260, r);
    // Cornisas doradas
    for (let y = 0; y < 512; y += 128) {
      g.fillStyle = 'rgba(160,120,50,0.75)'; g.fillRect(0, y, 256, 7);
      g.fillStyle = 'rgba(255,230,160,0.6)'; g.fillRect(0, y + 7, 256, 2);
    }
    // Ventanales altos con arco
    for (let y = 22; y < 512; y += 128) {
      for (let x = 18; x < 256; x += 60) {
        g.fillStyle = 'rgba(70,60,40,0.55)';
        g.fillRect(x - 2, y - 2, 34, 84);
        const lit = r() < 0.35;
        const gr = g.createLinearGradient(0, y, 0, y + 80);
        gr.addColorStop(0, lit ? '#ffe9a8' : '#7fa7c0');
        gr.addColorStop(1, lit ? '#d9a54a' : '#3d5b72');
        g.fillStyle = gr;
        g.beginPath();
        g.moveTo(x, y + 80); g.lineTo(x, y + 15); g.arc(x + 15, y + 15, 15, Math.PI, 0); g.lineTo(x + 30, y + 80);
        g.closePath(); g.fill();
        g.strokeStyle = 'rgba(120,90,40,0.8)'; g.lineWidth = 2; g.stroke();
        g.beginPath(); g.moveTo(x + 15, y); g.lineTo(x + 15, y + 80); g.moveTo(x, y + 45); g.lineTo(x + 30, y + 45); g.stroke();
      }
    }
    return tex(c);
  }
  function facadeZaun(seed) {
    const r = rng(seed);
    const c = canvas(256, 512);
    const g = c.getContext('2d');
    const base = ['#2c2a33', '#33302b', '#26302c', '#3a2c30'][Math.floor(r() * 4)];
    g.fillStyle = base; g.fillRect(0, 0, 256, 512);
    brush(g, 256, 512, ['#4a3a2a', '#1a1a20', '#5a4630', '#2a3a34', '#6a4a2a'], 320, r);
    // Planchas remachadas y óxido
    g.strokeStyle = 'rgba(0,0,0,0.45)'; g.lineWidth = 2;
    for (let y = 0; y < 512; y += 64) { g.beginPath(); g.moveTo(0, y + r() * 6); g.lineTo(256, y + r() * 6); g.stroke(); }
    for (let x = 0; x < 256; x += 85) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x + r() * 8, 512); g.stroke(); }
    for (let i = 0; i < 40; i++) {
      g.fillStyle = `rgba(${120 + r() * 60},${60 + r() * 30},20,${0.15 + r() * 0.2})`;
      g.fillRect(r() * 256, r() * 512, 2 + r() * 6, 10 + r() * 40);
    }
    // Ventanucos con luz cálida o química
    for (let y = 18; y < 512; y += 64) {
      for (let x = 14; x < 256; x += 42 + Math.floor(r() * 20)) {
        if (r() < 0.35) continue;
        const col = r() < 0.7 ? `rgba(255,${170 + r() * 50},90,${0.6 + r() * 0.4})` : `rgba(120,255,${170 + r() * 60},${0.5 + r() * 0.4})`;
        g.fillStyle = col;
        g.fillRect(x, y, 16 + r() * 10, 18 + r() * 8);
        g.fillStyle = 'rgba(0,0,0,0.5)';
        g.fillRect(x + 8, y, 2, 24);
      }
    }
    return tex(c);
  }
  function rockTexture(seed, tint, repeat) {
    const r = rng(seed);
    const c = canvas(512, 512);
    const g = c.getContext('2d');
    g.fillStyle = tint[0]; g.fillRect(0, 0, 512, 512);
    brush(g, 512, 512, tint, 900, r, 1.6);
    for (let i = 0; i < 26; i++) {
      g.strokeStyle = `rgba(0,0,0,${0.08 + r() * 0.14})`;
      g.lineWidth = 1 + r() * 2;
      g.beginPath();
      let x = r() * 512; let y = r() * 512;
      g.moveTo(x, y);
      for (let k = 0; k < 5; k++) { x += (r() - 0.5) * 60; y += r() * 40; g.lineTo(x, y); }
      g.stroke();
    }
    return tex(c, repeat);
  }
  function softSprite(inner, outer, size = 128) {
    const c = canvas(size, size);
    const g = c.getContext('2d');
    const gr = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gr.addColorStop(0, inner); gr.addColorStop(1, outer);
    g.fillStyle = gr; g.fillRect(0, 0, size, size);
    return tex(c);
  }
  function cloudSprite(seed) {
    const r = rng(seed);
    const c = canvas(256, 128);
    const g = c.getContext('2d');
    for (let i = 0; i < 26; i++) {
      const x = 40 + r() * 176; const y = 50 + r() * 40; const rad = 18 + r() * 36;
      const gr = g.createRadialGradient(x, y, 0, x, y, rad);
      gr.addColorStop(0, 'rgba(255,248,232,0.55)');
      gr.addColorStop(0.6, 'rgba(255,226,180,0.25)');
      gr.addColorStop(1, 'rgba(255,220,170,0)');
      g.fillStyle = gr; g.fillRect(0, 0, 256, 128);
    }
    return tex(c);
  }
  function skyTexture() {
    const c = canvas(16, 512);
    const g = c.getContext('2d');
    const gr = g.createLinearGradient(0, 0, 0, 512);
    gr.addColorStop(0, '#2b4f7a');
    gr.addColorStop(0.32, '#6f97b8');
    gr.addColorStop(0.47, '#f2d39a');
    gr.addColorStop(0.53, '#f6c27a');
    gr.addColorStop(0.62, '#c99a6a');
    gr.addColorStop(1, '#6a5a52');
    g.fillStyle = gr; g.fillRect(0, 0, 16, 512);
    return tex(c);
  }

  // Ruido sencillo para deformar la roca
  function noise3(x, y, z) {
    const s = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453;
    return s - Math.floor(s);
  }
  function smoothNoise(x, y, z) {
    let v = 0; let a = 1; let f = 1; let n = 0;
    for (let o = 0; o < 4; o++) {
      const xi = Math.floor(x * f); const yi = Math.floor(y * f); const zi = Math.floor(z * f);
      const xf = x * f - xi; const yf = y * f - yi; const zf = z * f - zi;
      const l = (a1, b1, t) => a1 + (b1 - a1) * (t * t * (3 - 2 * t));
      const c = (dx, dy, dz) => noise3(xi + dx, yi + dy, zi + dz);
      const x00 = l(c(0, 0, 0), c(1, 0, 0), xf); const x10 = l(c(0, 1, 0), c(1, 1, 0), xf);
      const x01 = l(c(0, 0, 1), c(1, 0, 1), xf); const x11 = l(c(0, 1, 1), c(1, 1, 1), xf);
      v += l(l(x00, x10, yf), l(x01, x11, yf), zf) * a;
      n += a; a *= 0.5; f *= 2;
    }
    return v / n;
  }

  // ---------- Construcción de cada ciudad ----------
  function quality() {
    const q = window.App?.settings?.quality || 'alta';
    return { baja: 0.45, media: 0.75, alta: 1, ultra: 1 }[q] ?? 1;
  }

  /** Edificios instanciados: un cuerpo por fachada y remates (tejados, cúpulas, agujas). */
  // Lugares con su propio modelo 3D (src/models): se ven desde arriba en el mapa, en lugar
  // de los bloques genéricos. size = ancho que ocupan en unidades del mapa.
  const PLACE_MODELS = { 'taller-jayce': { model: 'taller-viktor-jayce', size: 180 } };
  // Guardias de Piltover (modelo guardia-piltover) de pie junto a estos lugares.
  const GUARD_POSTS = { ejecutores: 3, consejo: 2, puente: 2 };


  // Hitos 3D específicos en lugares clave. Son recreaciones procedurales inspiradas
  // en la serie, no modelos oficiales ni copias fotograma a fotograma.
  const LANDMARK_CLEARANCES = {
    piltover: { academia:185, consejo:190, 'mansion-kiramman':165, plaza:130, hexpuertas:200, 'muelle-stillwater':150, puente:170, 'taller-jayce':180, ejecutores:145, artesanos:100 },
    zaun: { fabrica:190, 'ultima-gota':130, callejones:100, 'tienda-benzo':105, mercado:130, sumidero:155, 'escondite-jinx':120, invernadero:130, arbol:190, 'puente-zaun':175, foso:120, tejados:115 },
  };

  function buildings(group, map, zaun) {
    const r = rng(map.def.seed * 7 + 3);
    const q = quality();
    const clearances = LANDMARK_CLEARANCES[zaun ? 'zaun' : 'piltover'];
    const cleared = map.def.locations.map((l) => ({ x: l.x, y: l.y, r: Math.max(PLACE_MODELS[l.id]?.size * 0.8 || 0, clearances[l.id] || 0) })).filter((l) => l.r > 0);
    const list = map.buildings.filter((b) => r() < q && !cleared.some((c) => Math.hypot(b.x + b.w / 2 - c.x, b.y + b.h / 2 - c.y) < c.r));
    const nFac = 4;
    const bodies = Array.from({ length: nFac }, () => []);
    const roofs = [];
    const domes = [];
    const spires = [];
    const neons = [];
    const towers = [];
    const cornices = [];
    const locs = map.def.locations;
    for (const b of list) {
      const cx = b.x + b.w / 2;
      const cz = b.y + b.h / 2;
      // Más altos cerca de los lugares importantes (Consejo, Academia, la Fábrica)
      const near = Math.min(...locs.map((l) => Math.hypot(l.x - cx, l.y - cz)));
      const boost = Math.max(0, 1 - near / 700);
      let h;
      if (zaun) h = 70 + r() * 160 + boost * 120 + (b.tall > 0.85 ? 160 : 0);
      else h = 60 + r() * 120 + boost * 160 + (b.tall > 0.9 ? 220 : 0);
      const shrink = zaun ? 0.92 : 0.86;
      const w = b.w * shrink; const d = b.h * shrink;
      // Piltover: algunas torres redondas con cúpula, el resto edificios escalonados con cornisas.
      if (!zaun && r() < 0.22) {
        const rad = Math.min(w, d) * 0.42;
        towers.push({ x: cx, y: h / 2, z: cz, r: rad, h });
        cornices.push({ x: cx, y: h * 0.62, z: cz, sx: rad * 2.25, sy: 7, sz: rad * 2.25 });
        domes.push({ x: cx, y: h, z: cz, s: rad * 1.02 });
        spires.push({ x: cx, y: h + rad, z: cz });
        continue;
      }
      const tiers = zaun ? 1 + Math.floor(r() * 3) : h > 240 ? 3 : h > 130 ? 2 : 1;
      let y0 = 0; let tw = w; let td = d;
      for (let t = 0; t < tiers; t++) {
        const th = h / tiers;
        const ox = zaun ? (r() - 0.5) * w * 0.25 : 0;
        const oz = zaun ? (r() - 0.5) * d * 0.25 : 0;
        bodies[Math.floor(r() * nFac)].push({ x: cx + ox, y: y0 + th / 2, z: cz + oz, sx: tw, sy: th, sz: td, ry: zaun ? (r() - 0.5) * 0.2 : 0 });
        if (zaun && r() < 0.55) neons.push({ x: cx + ox, y: y0 + th * (0.3 + r() * 0.6), z: cz + oz + td / 2 + 1, sx: tw * (0.3 + r() * 0.5), c: Math.floor(r() * 4) });
        y0 += th;
        if (!zaun) cornices.push({ x: cx, y: y0, z: cz, sx: tw * 1.08, sy: 6, sz: td * 1.08 });
        tw *= zaun ? 0.8 + r() * 0.25 : 0.72;
        td *= zaun ? 0.8 + r() * 0.25 : 0.72;
      }
      if (!zaun) {
        // Remate sobre el último piso (tw/td ya están reducidos para el siguiente)
        const lw = tw / 0.72; const ld = td / 0.72;
        if (h > 200 && r() < 0.55) { domes.push({ x: cx, y: y0, z: cz, s: Math.min(lw, ld) * 0.45 }); spires.push({ x: cx, y: y0 + Math.min(lw, ld) * 0.42, z: cz }); } else roofs.push({ x: cx, y: y0, z: cz, sx: lw * 0.98, sy: 14 + Math.min(lw, ld) * 0.35, sz: ld * 0.98 });
      } else if (r() < 0.4) roofs.push({ x: cx, y: y0, z: cz, sx: tw * 1.1, sy: 10 + r() * 20, sz: td * 1.1 });
    }
    const dummy = new T.Object3D();
    const inst = (geo, mat, arr, set) => {
      if (!arr.length) return;
      const m = new T.InstancedMesh(geo, mat, arr.length);
      arr.forEach((o, i) => { dummy.position.set(0, 0, 0); dummy.rotation.set(0, 0, 0); dummy.scale.set(1, 1, 1); set(o); dummy.updateMatrix(); m.setMatrixAt(i, dummy.matrix); });
      m.castShadow = true; m.receiveShadow = true;
      group.add(m);
      return m;
    };
    const box = new T.BoxGeometry(1, 1, 1);
    bodies.forEach((arr, i) => {
      const mat = new T.MeshStandardMaterial({ map: zaun ? facadeZaun(map.def.seed + i) : facadePiltover(map.def.seed + i), roughness: zaun ? 0.85 : 0.7, metalness: zaun ? 0.25 : 0.05 });
      if (zaun) { mat.emissive = new T.Color('#ffb070'); mat.emissiveMap = mat.map; mat.emissiveIntensity = 0.28; }
      inst(box, mat, arr, (o) => { dummy.position.set(o.x, o.y, o.z); dummy.rotation.y = o.ry; dummy.scale.set(o.sx, o.sy, o.sz); });
    });
    // Torres redondas y cornisas doradas
    if (!zaun) {
      inst(new T.CylinderGeometry(1, 1.06, 1, 16, 1), new T.MeshStandardMaterial({ map: facadePiltover(map.def.seed + 9), roughness: 0.7 }), towers,
        (o) => { dummy.position.set(o.x, o.y, o.z); dummy.scale.set(o.r, o.h, o.r); });
      inst(box, new T.MeshStandardMaterial({ color: '#c9a04a', roughness: 0.45, metalness: 0.7 }), cornices,
        (o) => { dummy.position.set(o.x, o.y, o.z); dummy.scale.set(o.sx, o.sy, o.sz); });
    }
    // Tejados a cuatro aguas de cobre verdoso (Piltover) o chapa (Zaun)
    const pyr = new T.ConeGeometry(0.71, 1, 4, 1);
    pyr.rotateY(Math.PI / 4);
    pyr.translate(0, 0.5, 0);
    inst(pyr, new T.MeshStandardMaterial({ color: zaun ? '#3a3430' : '#4f9a8c', roughness: 0.6, metalness: zaun ? 0.4 : 0.35, flatShading: true }), roofs,
      (o) => { dummy.position.set(o.x, o.y, o.z); dummy.scale.set(o.sx, o.sy, o.sz); });
    // Cúpulas doradas y agujas
    const dome = new T.SphereGeometry(1, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2);
    inst(dome, new T.MeshStandardMaterial({ color: '#d9a640', roughness: 0.3, metalness: 0.85, emissive: '#5a3a08', emissiveIntensity: 0.3 }), domes,
      (o) => { dummy.position.set(o.x, o.y, o.z); dummy.scale.set(o.s, o.s * 1.1, o.s); });
    const spire = new T.ConeGeometry(4, 70, 8);
    spire.translate(0, 35, 0);
    inst(spire, new T.MeshStandardMaterial({ color: '#e8c060', roughness: 0.3, metalness: 0.9 }), spires, (o) => { dummy.position.set(o.x, o.y, o.z); });
    // Neones de Zaun
    if (zaun && neons.length) {
      const cols = ['#ff3fa0', '#3fffd0', '#b6ff3f', '#c86bff'];
      cols.forEach((c, ci) => {
        inst(new T.BoxGeometry(1, 5, 2), new T.MeshBasicMaterial({ color: c, toneMapped: false }), neons.filter((n) => n.c === ci),
          (o) => { dummy.position.set(o.x, o.y, o.z); dummy.scale.set(o.sx, 1, 1); });
      });
    }
  }


  /** Hitos reconocibles desde la vista 3D del mapa. */
  function landmarks(group, map, zaun) {
    const M=(color,metalness=0.12,emissive=null)=>new T.MeshStandardMaterial({color,roughness:0.72,metalness,...(emissive?{emissive,emissiveIntensity:0.4}:{})});
    const stone=M(zaun?'#373630':'#d8c69d'), trim=M(zaun?'#806044':'#bd9848',0.55), roof=M(zaun?'#202927':'#397d78',0.3), dark=M('#151b19',0.35), glow=M(zaun?'#47efb2':'#6bdcff',0.25,zaun?'#159a67':'#2386c3');
    const root=new T.Group(), defs=map.def.locations;
    const add=(p,geo,mat,x,y,z,sx=1,sy=1,sz=1,ry=0)=>{const o=new T.Mesh(geo,mat);o.position.set(x,y,z);o.scale.set(sx,sy,sz);o.rotation.y=ry;o.castShadow=true;o.receiveShadow=true;p.add(o);return o;};
    const B=(p,x,y,z,sx,sy,sz,m=stone,ry=0)=>add(p,new T.BoxGeometry(1,1,1),m,x,y,z,sx,sy,sz,ry);
    const C=(p,x,y,z,rt,rb,h,m=stone,n=12)=>add(p,new T.CylinderGeometry(rt,rb,h,n),m,x,y,z);
    const ring=(p,x,y,z,r,t,m=trim,rx=0)=>{const o=add(p,new T.TorusGeometry(r,t,8,32),m,x,y,z);o.rotation.x=rx;return o;};
    const place=(id,fn)=>{const l=defs.find(v=>v.id===id);if(!l)return;const p=new T.Group();p.position.set(l.x,0,l.y);fn(p);root.add(p);};
    if(!zaun){
      // Academia: alas simétricas, columnata y cúpula verde.
      place('academia',p=>{B(p,0,12,0,230,24,180,trim);B(p,0,66,0,172,84,125);B(p,-75,55,0,52,62,142);B(p,75,55,0,52,62,142);for(let x=-68;x<=68;x+=34){C(p,x,65,66,5,5,64,trim);B(p,x,100,66,8,5,8,trim);}B(p,0,111,-3,90,12,82,trim);C(p,0,137,-3,43,46,35,roof,16);C(p,0,166,-3,8,8,26,trim);B(p,0,38,70,40,48,6,dark);B(p,0,53,74,25,25,2,glow);});
      // Consejo: rotonda, columnata radial y cúpula ceremonial.
      place('consejo',p=>{C(p,0,10,0,112,122,20,trim,32);C(p,0,30,0,100,100,22,stone,32);C(p,0,70,0,84,94,60,stone,24);C(p,0,103,0,90,90,8,trim,24);for(let i=0;i<16;i++){const a=i*Math.PI/8;C(p,Math.cos(a)*78,62,Math.sin(a)*78,4,4,54,trim,8);}add(p,new T.SphereGeometry(1,24,16),roof,0,118,0,67,40,67);C(p,0,157,0,9,12,22,trim);});
      // Mansión Kiramman: alas y tejados verdes.
      place('mansion-kiramman',p=>{B(p,0,12,0,180,24,145,trim);B(p,0,45,0,145,48,112);B(p,-65,38,8,48,42,102);B(p,65,38,8,48,42,102);B(p,0,76,-8,92,16,85,roof);B(p,-65,60,8,58,12,112,roof);B(p,65,60,8,58,12,112,roof);B(p,0,28,64,42,38,8,trim);B(p,0,28,69,24,30,2,dark);for(let x=-48;x<=48;x+=32)B(p,x,46,58,8,23,3,glow);});
      // Plaza del Progreso: fuente y obelisco hextech.
      place('plaza',p=>{C(p,0,5,0,68,76,10,trim,12);C(p,0,12,0,52,60,8,stone,12);C(p,0,30,0,22,28,28,trim);C(p,0,54,0,11,13,24,glow,8);add(p,new T.OctahedronGeometry(1),glow,0,73,0,17,25,17);});
      // Hexpuertas: anillo monumental entre torres gemelas.
      place('hexpuertas',p=>{B(p,0,10,0,260,20,150,trim);for(const x of [-94,94]){B(p,x,84,0,28,148,34);B(p,x,162,0,42,10,48,trim);C(p,x,181,0,6,7,25,trim);}ring(p,0,98,0,73,9,trim);ring(p,0,98,1,61,3,glow);});
      // Stillwater: fortaleza amurallada con torres de vigilancia.
      place('muelle-stillwater',p=>{B(p,0,28,0,190,56,125);B(p,0,58,-8,150,10,100,trim);for(const x of [-78,78])for(const z of [-48,48]){B(p,x,83,z,28,105,28);C(p,x,140,z,15,18,18,roof,8);}for(let x=-65;x<=65;x+=26){B(p,x,75,-62,14,20,14);B(p,x,75,62,14,20,14);}});
      // Puente del Progreso: calzada, pilonos y cables tensados.
      place('puente',p=>{B(p,0,9,0,440,14,92,trim);B(p,0,17,0,420,4,70);for(const x of [-170,-85,0,85,170]){B(p,x,34,0,10,36,12,trim);B(p,x,53,0,16,5,18);}for(const side of [-1,1]){const pts=[];for(let i=0;i<=20;i++){const x=-205+i*410/20;pts.push(new T.Vector3(x,44+Math.sin(i/20*Math.PI)*48,side*36));}add(p,new T.TubeGeometry(new T.CatmullRomCurve3(pts),40,2.2,6,false),trim,0,0,0);}});
    } else {
      // Fábrica de Brillo: nave, calderas y chimeneas.
      place('fabrica',p=>{B(p,0,12,0,205,24,160,dark);B(p,0,45,0,150,46,118);B(p,-45,73,-15,72,14,92,trim);for(const [x,z,h] of [[-70,-48,95],[-25,-48,135],[48,-45,115],[78,38,82]]){C(p,x,24+h/2,z,13,17,h,trim);C(p,x,24+h+5,z,18,18,9,dark);C(p,x,24+h+11,z,9,9,4,glow);}});
      // La Última Gota: taberna, marquesina y cartel luminoso.
      place('ultima-gota',p=>{B(p,0,12,0,150,24,100,dark);B(p,0,40,0,125,40,78);B(p,0,63,0,145,8,92,trim);B(p,0,35,41,24,32,4,dark);B(p,-42,42,41,22,22,4,glow);B(p,42,42,41,22,22,4,glow);B(p,0,78,2,65,13,12,dark);B(p,0,78,9,52,4,3,glow);});
      // Callejones y tejados: bloques superpuestos y pasarelas.
      place('callejones',p=>{for(let i=0;i<5;i++){const x=(i-2)*34;B(p,x,36+(i%2)*18,0,42,72+(i%2)*36,48,i%2?stone:dark);}B(p,0,38,34,190,8,18,trim);for(let x=-75;x<=75;x+=25)B(p,x,45,34,3,12,3,glow);});
      place('tejados',p=>{for(let i=0;i<5;i++){const x=(i-2)*35;B(p,x,24+(i%2)*12,0,38,48+(i%2)*24,42,dark);B(p,x,51+(i%2)*12,0,42,7,46,trim);}});
      // Tienda de Benzo: chatarra, mostrador y cubierta.
      place('tienda-benzo',p=>{B(p,0,10,0,95,20,72,dark);B(p,0,34,0,82,28,60);B(p,0,53,0,105,8,78,trim);for(let i=0;i<7;i++)C(p,-36+(i%4)*24,25+(i%3)*7,-20+Math.floor(i/4)*28,8,9,14,trim,8);B(p,0,28,34,26,24,4,glow);});
      // Mercado: puestos, toldos y luces.
      place('mercado',p=>{for(let i=0;i<5;i++){const x=(i-2)*38;B(p,x,15,0,30,30,30);B(p,x,35,0,38,5,38,i%2?trim:roof);}for(let x=-76;x<=76;x+=38){C(p,x,55,-5,3,3,32,trim);B(p,x,72,-5,30,4,32,glow);}});
      // Laboratorio del Sumidero: reactores y tubos quimtec.
      place('sumidero',p=>{B(p,0,10,0,160,20,118,dark);B(p,0,30,0,130,22,90);for(const [x,z,h] of [[-48,-24,65],[0,-24,90],[48,-24,72]]){C(p,x,24+h/2,z,12,12,h,glow,16);C(p,x,24+h,z,16,16,8,trim);}for(let x=-60;x<=60;x+=30)B(p,x,48,30,4,4,40,trim);});
      // Escondite de Jinx: taller improvisado y símbolo luminoso.
      place('escondite-jinx',p=>{B(p,0,12,0,105,24,90,dark);B(p,0,36,0,78,28,64);for(let i=0;i<9;i++)B(p,-42+(i%5)*21,24+(i%3)*13,-25+Math.floor(i/5)*35,12,18+(i%3)*10,12,i%2?trim:roof);ring(p,0,60,34,18,4,glow);B(p,0,60,35,4,32,3,glow);});
      // Invernadero: bastidor de cristal y cultivos quimtec.
      place('invernadero',p=>{B(p,0,8,0,132,16,100,dark);for(let x=-54;x<=54;x+=27){B(p,x,36,0,3,54,90,trim);B(p,x,62,0,28,3,90,glow);}for(let z=-38;z<=38;z+=25)B(p,0,36,z,120,3,3,trim);for(let x=-36;x<=36;x+=24)for(let z=-22;z<=22;z+=22)C(p,x,20,z,4,4,22,glow,8);});
      // Árbol de las Luciérnagas: tronco, ramas y copa luminosa.
      place('arbol',p=>{C(p,0,72,0,24,34,140,M('#4b3b2d'),12);for(let i=0;i<8;i++){const a=i*Math.PI/4;const pts=[new T.Vector3(0,30,0),new T.Vector3(Math.cos(a)*48,55,Math.sin(a)*42),new T.Vector3(Math.cos(a)*95,100+Math.sin(i)*18,Math.sin(a)*85)];add(p,new T.TubeGeometry(new T.CatmullRomCurve3(pts),16,5,6,false),M('#514333'));}for(let i=0;i<18;i++){const a=i*2.399;add(p,new T.IcosahedronGeometry(1,1),M('#345a40',0.05,'#143b21'),Math.cos(a)*(25+(i%5)*14),125+(i%4)*18,Math.sin(a)*(22+(i%5)*14),24+(i%3)*7,18+(i%4)*8,22+(i%3)*7);}for(let i=0;i<20;i++){const a=i*2.399;add(p,new T.SphereGeometry(1,8,6),glow,Math.cos(a)*(35+(i%4)*15),75+(i%6)*15,Math.sin(a)*(32+(i%4)*15),3,3,3);}});
      // Puente de Zaun: calzada industrial, pilonos y cables de neón.
      place('puente-zaun',p=>{B(p,0,10,0,420,16,100,dark);B(p,0,19,0,400,4,82,trim);for(const x of [-170,-85,0,85,170]){B(p,x,40,0,12,48,14,trim);B(p,x,65,0,18,5,20,dark);}for(const side of [-1,1]){const pts=[];for(let i=0;i<=20;i++){const x=-195+i*390/20;pts.push(new T.Vector3(x,50+Math.sin(i/20*Math.PI)*32,side*38));}add(p,new T.TubeGeometry(new T.CatmullRomCurve3(pts),40,3,6,false),glow,0,0,0);}});
      // Foso: anillo de combate y postes.
      place('foso',p=>{C(p,0,5,0,82,95,10,trim,24);C(p,0,8,0,48,55,8,dark,20);for(let i=0;i<12;i++){const a=i*Math.PI/6;B(p,Math.cos(a)*90,12,Math.sin(a)*90,8,24,8,trim,a);}});
    }
    group.add(root);
  }

  /** Suelo: la carta pintada de la ciudad (calles, barrios, agua) como textura. */
  function ground(group, map, groundCanvas, zaun) {
    const t = tex(groundCanvas);
    const geo = new T.PlaneGeometry(map.w, map.h, 1, 1);
    geo.rotateX(-Math.PI / 2);
    geo.translate(map.w / 2, 0, map.h / 2);
    const m = new T.Mesh(geo, new T.MeshStandardMaterial({ map: t, roughness: 0.95, metalness: 0 }));
    m.receiveShadow = true;
    group.add(m);
    // Bordes de la meseta: acantilado de piedra (Piltover) o roca húmeda (Zaun)
    const rock = rockTexture(zaun ? 21 : 9, zaun ? ['#23261f', '#34362c', '#1a1d18', '#3b3a2c'] : ['#8a7a64', '#6e604e', '#a8957a', '#5a4e40', '#c2ae8a'], [8, 1]);
    const depth = zaun ? 260 : 900;
    const sides = [
      [map.w, map.w / 2, -depth / 2, 0, 0], [map.w, map.w / 2, -depth / 2, map.h, Math.PI],
      [map.h, 0, -depth / 2, map.h / 2, -Math.PI / 2], [map.h, map.w, -depth / 2, map.h / 2, Math.PI / 2],
    ];
    for (const [len, x, y, z, ry] of sides) {
      const g2 = new T.PlaneGeometry(len, depth, 40, 8);
      const pos = g2.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const px = pos.getX(i); const py = pos.getY(i);
        const k = (py + depth / 2) / depth; // 0 abajo, 1 arriba
        pos.setZ(i, (smoothNoise(px * 0.004, py * 0.006, ry) - 0.5) * 160 * (1 - k * 0.7) - (1 - k) * 120);
      }
      g2.computeVertexNormals();
      const s = new T.Mesh(g2, new T.MeshStandardMaterial({ map: rock, roughness: 1, side: T.DoubleSide }));
      s.position.set(x, y, z);
      s.rotation.y = ry;
      group.add(s);
    }
  }

  function piltoverWorld(scene, map) {
    const r = rng(77);
    scene.background = null;
    // Cielo: gran esfera con degradado dorado; el sol y un mar de nubes por debajo de la meseta.
    const sky = new T.Mesh(new T.SphereGeometry(16000, 32, 16), new T.MeshBasicMaterial({ map: skyTexture(), side: T.BackSide, fog: false, depthWrite: false }));
    sky.position.set(map.w / 2, 0, map.h / 2);
    scene.add(sky);
    const sun = new T.Sprite(new T.SpriteMaterial({ map: softSprite('rgba(255,244,210,1)', 'rgba(255,200,120,0)'), blending: T.AdditiveBlending, fog: false, depthWrite: false }));
    sun.scale.set(5200, 5200, 1);
    sun.position.set(map.w / 2 + 9000, 1200, map.h / 2 - 9000);
    scene.add(sun);
    const cloudTex = [cloudSprite(1), cloudSprite(2), cloudSprite(3)];
    const clouds = new T.Group();
    for (let i = 0; i < 70; i++) {
      const a = r() * Math.PI * 2;
      const dist = 2600 + r() * 7000;
      const s = new T.Sprite(new T.SpriteMaterial({ map: cloudTex[i % 3], transparent: true, depthWrite: false, opacity: 0.55 + r() * 0.35, fog: false }));
      const w = 1600 + r() * 2600;
      s.scale.set(w, w * 0.45, 1);
      s.position.set(map.w / 2 + Math.cos(a) * dist, -900 + r() * 700 + (dist > 6000 ? r() * 1500 : 0), map.h / 2 + Math.sin(a) * dist);
      s.userData.v = 8 + r() * 14;
      clouds.add(s);
    }
    // Mar de nubes pegado al pie del acantilado: la meseta flota sobre él.
    for (let i = 0; i < 46; i++) {
      const side = i % 4;
      const u = r();
      const x = side < 2 ? u * map.w : side === 2 ? -150 : map.w + 150;
      const z = side === 0 ? -150 : side === 1 ? map.h + 150 : u * map.h;
      const s = new T.Sprite(new T.SpriteMaterial({ map: cloudTex[i % 3], transparent: true, depthWrite: false, opacity: 0.9, fog: false }));
      const w = 1300 + r() * 1300;
      s.scale.set(w, w * 0.5, 1);
      s.position.set(x, -380 - r() * 380, z);
      s.userData.v = 0;
      clouds.add(s);
    }
    // Algunas nubes altas sobre la ciudad
    for (let i = 0; i < 10; i++) {
      const s = new T.Sprite(new T.SpriteMaterial({ map: cloudTex[i % 3], transparent: true, depthWrite: false, opacity: 0.35, fog: false }));
      s.scale.set(1400, 600, 1);
      s.position.set(r() * map.w, 1700 + r() * 600, r() * map.h);
      s.userData.v = 18;
      clouds.add(s);
    }
    scene.add(clouds);

    // Globos aerostáticos de las Hexpuertas: cúpula textil, cesta y cuerdas, con rutas
    // de vuelo suaves y repetibles. Son geometría local, no sprites ni recursos externos.
    const balloons = new T.Group();
    const balloonColors = ['#c64e47', '#e0b85d', '#3e8b8a', '#6b5b9e', '#d7d0b9'];
    const ropeMat = new T.MeshStandardMaterial({ color: '#6a5137', roughness: 0.9 });
    const basketMat = new T.MeshStandardMaterial({ color: '#6b4930', roughness: 0.95 });
    for (let i = 0; i < 5; i++) {
      const craft = new T.Group();
      const color = balloonColors[i % balloonColors.length];
      const envelopeMat = new T.MeshStandardMaterial({ color, roughness: 0.72, metalness: 0.02 });
      const seamMat = new T.MeshStandardMaterial({ color: i % 2 ? '#f1d99a' : '#f0d7c5', roughness: 0.8 });
      const envelope = new T.Mesh(new T.SphereGeometry(1, 20, 16), envelopeMat);
      envelope.scale.set(29, 41, 26);
      envelope.position.y = 36;
      envelope.castShadow = true;
      craft.add(envelope);
      for (const y of [23, 42, 58]) {
        const band = new T.Mesh(new T.TorusGeometry(26 * Math.sqrt(Math.max(0.35, 1 - ((y - 36) / 42) ** 2)), 1.6, 6, 24), seamMat);
        band.position.y = y;
        band.rotation.x = Math.PI / 2;
        craft.add(band);
      }
      const basket = new T.Mesh(new T.BoxGeometry(20, 15, 20), basketMat);
      basket.position.y = -22;
      basket.castShadow = true;
      craft.add(basket);
      for (const x of [-8, 8]) for (const z of [-8, 8]) {
        const rope = new T.Mesh(new T.CylinderGeometry(0.8, 0.8, 22, 5), ropeMat);
        rope.position.set(x, -8, z);
        craft.add(rope);
      }
      const baseY = 270 + (i % 3) * 85;
      craft.position.set(map.w * (0.08 + i * 0.19), baseY, map.h * (0.78 + (i % 2) * 0.055));
      craft.userData = { speed: 22 + i * 4, baseY, phase: i * 1.7, drift: 55 + (i % 3) * 18 };
      balloons.add(craft);
    }
    scene.add(balloons);

    scene.fog = new T.Fog('#e9d3a6', 3500, 14000);
    scene.add(new T.HemisphereLight('#fff1d0', '#6a5a42', 1.2));
    const key = new T.DirectionalLight('#ffd89a', 2.2);
    key.position.set(map.w / 2 + 1800, 2600, map.h / 2 - 1600);
    key.target.position.set(map.w / 2, 0, map.h / 2);
    scene.add(key, key.target);
    return { key, tick(t, dt) {
      clouds.children.forEach((c) => { c.position.x += c.userData.v * dt; if (c.position.x > map.w / 2 + 9500) c.position.x -= 19000; });
      balloons.children.forEach((b) => {
        const d = b.userData;
        b.position.x += d.speed * dt;
        if (b.position.x > map.w + 140) b.position.x = -140;
        b.position.y = d.baseY + Math.sin(t * 0.55 + d.phase) * 13;
        b.position.z += Math.sin(t * 0.18 + d.phase) * dt * 10;
        if (b.position.z < map.h * 0.68) b.position.z = map.h * 0.68;
        if (b.position.z > map.h * 0.91) b.position.z = map.h * 0.91;
        b.rotation.z = Math.sin(t * 0.45 + d.phase) * 0.035;
        b.rotation.y = Math.sin(t * 0.22 + d.phase) * 0.12;
      });
    } };
  }

  function zaunWorld(scene, map) {
    const r = rng(31);
    scene.background = new T.Color('#05080a');
    // Caverna: un elipsoide de roca visto desde dentro, deformado con ruido, con estalactitas.
    const geo = new T.SphereGeometry(1, 96, 48);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i); const y = pos.getY(i); const z = pos.getZ(i);
      const n = smoothNoise(x * 3 + 5, y * 3, z * 3);
      const k = 1 + (n - 0.5) * 0.35;
      pos.setXYZ(i, x * k, y * k, z * k);
    }
    geo.computeVertexNormals();
    const caveMat = new T.MeshStandardMaterial({ map: rockTexture(5, ['#1d2420', '#2a312a', '#141a16', '#36392c', '#20302a'], [10, 6]), roughness: 1, side: T.BackSide });
    const cave = new T.Mesh(geo, caveMat);
    cave.scale.set(3300, 1500, 2700);
    cave.position.set(map.w / 2, 150, map.h / 2);
    scene.add(cave);
    // Estalactitas colgando de la bóveda
    const stal = new T.ConeGeometry(1, 1, 7, 1);
    stal.rotateX(Math.PI);
    stal.translate(0, -0.5, 0);
    const n = Math.round(160 * quality());
    const im = new T.InstancedMesh(stal, new T.MeshStandardMaterial({ color: '#2a2f28', roughness: 1, flatShading: true }), n);
    const dmy = new T.Object3D();
    for (let i = 0; i < n; i++) {
      const x = r() * map.w; const z = r() * map.h;
      const nx = (x - map.w / 2) / 3300; const nz = (z - map.h / 2) / 2700;
      const top = 150 + 1500 * Math.sqrt(Math.max(0, 1 - nx * nx - nz * nz)) * 0.9;
      const len = 120 + r() * 420;
      dmy.position.set(x, top, z);
      dmy.scale.set(18 + r() * 40, len, 18 + r() * 40);
      dmy.updateMatrix();
      im.setMatrixAt(i, dmy.matrix);
    }
    scene.add(im);
    // Grietas por las que se cuela la luz de Piltover
    const shafts = new T.Group();
    const shaftMat = new T.MeshBasicMaterial({ color: '#ffe0a0', transparent: true, opacity: 0.08, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide, fog: false });
    for (let i = 0; i < 6; i++) {
      const c = new T.Mesh(new T.CylinderGeometry(40 + r() * 40, 260 + r() * 200, 1700, 16, 1, true), shaftMat);
      c.position.set(300 + r() * (map.w - 600), 850, 300 + r() * (map.h - 600));
      c.rotation.z = (r() - 0.5) * 0.25;
      shafts.add(c);
    }
    scene.add(shafts);
    // Tuberías gruesas cruzando la ciudad a distintas alturas
    const pipeMat = new T.MeshStandardMaterial({ color: '#8a6a44', roughness: 0.45, metalness: 0.7, emissive: '#2a1a08', emissiveIntensity: 0.4 });
    const greenPipe = new T.MeshStandardMaterial({ color: '#3d5a2a', roughness: 0.4, metalness: 0.6, emissive: '#3fff7a', emissiveIntensity: 0.12 });
    for (let i = 0; i < 7; i++) {
      const y0 = 300 + r() * 500;
      const pts = [];
      const zStart = r() * map.h;
      for (let k = 0; k <= 6; k++) pts.push(new T.Vector3((map.w / 6) * k, y0 + Math.sin(k + i) * 60, zStart + Math.sin(k * 1.3 + i) * 260));
      const curve = new T.CatmullRomCurve3(pts);
      const tube = new T.Mesh(new T.TubeGeometry(curve, 60, 5 + r() * 6, 8, false), i % 3 === 0 ? greenPipe : pipeMat);
      tube.castShadow = true;
      scene.add(tube);
    }
    // Luz: ambiente químico, la luz fría que cae de arriba y faroles de neón
    scene.fog = new T.FogExp2('#0d1a14', 0.00022);
    scene.add(new T.HemisphereLight('#7fd8c0', '#1a120a', 0.9));
    const key = new T.DirectionalLight('#ffe7b0', 1.0);
    key.position.set(map.w / 2 - 400, 2400, map.h / 2 - 800);
    key.target.position.set(map.w / 2, 0, map.h / 2);
    scene.add(key, key.target);
    const lamps = [];
    const lampCols = ['#3fffd0', '#ff3fa0', '#b6ff3f', '#ffb060'];
    for (let i = 0; i < 6; i++) {
      const l = new T.PointLight(lampCols[i % 4], 2.5, 1300, 1.4);
      l.position.set(300 + r() * (map.w - 600), 140 + r() * 120, 300 + r() * (map.h - 600));
      scene.add(l);
      lamps.push(l);
    }
    // Esporas y gotas brillantes
    const spores = new T.Points(new T.BufferGeometry(), new T.PointsMaterial({ color: '#9fffb0', size: 10, transparent: true, opacity: 0.6, blending: T.AdditiveBlending, depthWrite: false, map: softSprite('rgba(255,255,255,1)', 'rgba(255,255,255,0)', 32) }));
    const P = new Float32Array(600 * 3);
    for (let i = 0; i < 600; i++) { P[i * 3] = r() * map.w; P[i * 3 + 1] = r() * 900; P[i * 3 + 2] = r() * map.h; }
    spores.geometry.setAttribute('position', new T.BufferAttribute(P, 3));
    scene.add(spores);
    return {
      key,
      tick(t, dt) {
        lamps.forEach((l, i) => { l.intensity = 2.2 + Math.sin(t * 3 + i * 1.7) * 0.4 + (Math.sin(t * 23 + i) > 0.97 ? -1.2 : 0); });
        const a = spores.geometry.attributes.position;
        for (let i = 0; i < a.count; i++) { let y = a.getY(i) + dt * 12; if (y > 900) y = 0; a.setY(i, y); }
        a.needsUpdate = true;
        shafts.children.forEach((s, i) => { s.material.opacity = 0.07 + Math.sin(t * 0.4 + i) * 0.02; });
      },
    };
  }

  /** Canal químico del Sumidero / mar bajo Piltover: agua animada. */
  function water(group, map, zaun) {
    if (zaun) {
      const pts = [[-50, 1780], [700, 1640], [1300, 1980], [1900, 1800], [2400, 1640], [2700, 1960], [3050, 1760]].map(([x, z]) => new T.Vector3(x, 3, z));
      const curve = new T.CatmullRomCurve3(pts);
      const shape = new T.Mesh(new T.TubeGeometry(curve, 80, 55, 6, false), new T.MeshBasicMaterial({ color: '#7dff5a', transparent: true, opacity: 0.35, toneMapped: false }));
      shape.scale.y = 0.05;
      group.add(shape);
      return null;
    }
    const m = new T.Mesh(new T.PlaneGeometry(40000, 40000), new T.MeshStandardMaterial({ color: '#4d7a96', roughness: 0.25, metalness: 0.4, transparent: true, opacity: 0.9 }));
    m.rotation.x = -Math.PI / 2;
    m.position.set(map.w / 2, -950, map.h / 2);
    group.add(m);
    return m;
  }

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

    function setMap(map, groundCanvas) {
      if (scene) scene.traverse((o) => { o.geometry?.dispose(); if (o.material) [].concat(o.material).forEach((m) => { m.map?.dispose(); m.dispose(); }); });
      scene = new T.Scene();
      const zaun = map.id === 'zaun';
      const group = new T.Group();
      ground(group, map, groundCanvas, zaun);
      buildings(group, map, zaun);
      landmarks(group, map, zaun);
      water(group, map, zaun);
      scene.add(group);
      world = zaun ? zaunWorld(scene, map) : piltoverWorld(scene, map);
      buildActors(map);
      if (shadows && world.key) {
        world.key.castShadow = true;
        const s = world.key.shadow;
        s.mapSize.set(2048, 2048);
        s.camera.left = -map.w * 0.6; s.camera.right = map.w * 0.6; s.camera.top = map.h * 0.75; s.camera.bottom = -map.h * 0.75;
        s.camera.near = 100; s.camera.far = 6000;
        s.bias = -0.0005;
      }
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
      actors = { group: new T.Group(), orb: makeOrb(), playerAvatar: null, lastPlayer: null, npcs: new Map(), guards: [], map };
      scene.add(actors.group);
      actors.group.add(actors.orb.root);
      const A = window.Avatars3D;
      if (!A) return;
      const mine = actors;
      // Decorados con modelo propio.
      for (const l of map.def.locations) {
        const pm = PLACE_MODELS[l.id];
        if (!pm) continue;
        A.prop(pm.model).then((m) => {
          if (!m || actors !== mine) return;
          const box = new T.Box3().setFromObject(m);
          const size = box.getSize(new T.Vector3());
          const k = pm.size / Math.max(size.x, size.z, 1e-6);
          m.scale.setScalar(k);
          m.position.set(l.x - ((box.min.x + box.max.x) / 2) * k, -box.min.y * k, l.y - ((box.min.z + box.max.z) / 2) * k);
          mine.group.add(m);
        }).catch(() => {});
      }
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
        // La escala base de Avatars3D es de 20 unidades frente a calles de 60–96 unidades.
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
          e = { av: A.create({ id: n.id }) };
          actors.npcs.set(n.id, e);
          actors.group.add(e.av.holder);
        }
        e.av.holder.position.set(n.x, 0, n.y);
        turnTo(e.av, n.x, n.y, n.home ?? 0, p, dt, t);
      }
      for (const [id, e] of actors.npcs) if (!seen.has(id)) { A.dispose(e.av); actors.npcs.delete(id); }
      for (const g of actors.guards) turnTo(g.av, g.x, g.y, g.home, p, dt, t);
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
        if (scene) scene.traverse((o) => { o.geometry?.dispose(); if (o.material) [].concat(o.material).forEach((m) => { m.map?.dispose(); m.dispose(); }); });
        renderer.dispose();
        el.remove();
      },
    };
  }

  window.World3D = { create };
})();
