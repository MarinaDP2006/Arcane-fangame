// Creador de personaje narrativo: identidad, profesión, familia, aficiones y retrato.
(function () {
  const { $, el, tpl, pick } = U;
  const C = () => window.CREATION;

  let draft;
  let step;
  let onDone;

  function fresh() {
    return {
      origin: null, name: '', gender: 'mujer', age: 20, district: '', job: '', family: 'ninguna', parents: 'ambos', attraction: 'todos',
      hobbies: [], bio: '', photo: null,
      look: { ...Painter.DEFAULTS, skin: '#e8b394', hair: '#2a1e18', style: 'long', eyeColor: '#5a7a9a', outfit: 'chaqueta', outfitColor: '#4a3a5a', accents: [] },
    };
  }

  // Estadísticas: 1 de base + profesión + familia + aficiones.
  function computeStats(d) {
    const s = { ingenio: 1, carisma: 1, valor: 1, sigilo: 1 };
    const add = (obj) => obj && Object.entries(obj).forEach(([k, v]) => { s[k] += v; });
    const o = C().origins[d.origin];
    if (o) {
      add(o.jobs.find((j) => j.id === d.job)?.stats);
      add(o.families.find((f) => f.id === d.family)?.stats);
    }
    d.hobbies.forEach((h) => add(C().hobbies.find((x) => x.id === h)?.stats));
    return s;
  }

  const allocUsed = (d) => Object.values(d.alloc).reduce((a, b) => a + b, 0);

  function buildPlayer(d) {
    const o = C().origins[d.origin];
    const job = o.jobs.find((j) => j.id === d.job) || o.jobs[0];
    const fam = o.families.find((f) => f.id === d.family) || o.families[0];
    const hobbies = d.hobbies.map((h) => C().hobbies.find((x) => x.id === h));
    return {
      name: d.name.trim(), gender: d.gender, age: Number(d.age) || 20, origin: d.origin, parents: d.parents, attraction: d.attraction,
      district: d.district, job: job.id, jobLabel: job.label,
      family: fam.id, familyLabel: fam.label, familyName: fam.name || '', familyAff: fam.aff || {},
      hobbies: d.hobbies, hobbyLabels: hobbies.map((h) => h.label),
      bio: d.bio.trim(), photo: d.photo, look: { ...d.look },
      // Campos vacíos por compatibilidad con partidas antiguas; el creador ya no ofrece habilidades.
      cls: null, abilities: {}, keystone: null, title: '',
    };
  }

  const STEPS = ['Origen', 'Identidad', 'Retrato', 'Familia y aficiones', 'Ficha final'];

  function header() {
    return el('ol', { class: 'steps' }, STEPS.map((s, i) =>
      el('li', { class: i === step ? 'active' : i < step ? 'done' : '', onclick: () => { if (i < step) go(i); } }, el('span', {}, i + 1), s)));
  }

  function canNext() {
    if (step === 0) return Boolean(draft.origin);
    if (step === 1) return Boolean(draft.name.trim());
    if (step === 3) return draft.hobbies.length > 0;
    return true;
  }

  function nav(nextLabel = 'Siguiente →') {
    const n = el('div', { class: 'creator-nav' },
      el('button', { class: 'btn ghost', onclick: () => (step === 0 ? cancel() : go(step - 1)) }, step === 0 ? 'Cancelar' : '← Atrás'),
      el('button', { class: 'btn primary hex-btn', disabled: !canNext(), onclick: () => (step === STEPS.length - 1 ? finish() : go(step + 1)) }, nextLabel));
    return n;
  }

  function cancel() {
    window.App.go('game');
  }

  // La galería se divide en mujer y hombre: archivos «mujer-N» / «hombre-N» (también «chica-», «chico-»)
  // o las subcarpetas avatares/mujer y avatares/hombre. Con «No binario» salen todos.
  const GENDER_PREFIX = { mujer: /^(mujer|chica|female|woman)[-_ ]/i, hombre: /^(hombre|chico|male|man)[-_ ]/i };
  const avatarGender = (name) => Object.keys(GENDER_PREFIX).find((g) => GENDER_PREFIX[g].test(name)) || null;
  const allAvatars = () => Object.entries(window.CustomArt.files.avatares || {}).filter(([, f]) => !/\.(mp4|webm)$/i.test(f));
  const binary = (g) => g === 'mujer' || g === 'hombre';
  // Retratos del género elegido (o todos con «No binario»).
  const avatars = (g = draft.gender) => allAvatars().filter(([n]) => !binary(g) || avatarGender(n) === g);
  // Imágenes de tu carpeta sin «mujer-» ni «hombre-» en el nombre: se enseñan aparte.
  const unsorted = () => (binary(draft.gender) ? allAvatars().filter(([n]) => !avatarGender(n)) : []);

  // Al cambiar de género, el retrato pasa al del mismo número del otro género (o se quita).
  function setGender(g) {
    if (draft.gender === g) return;
    const prev = allAvatars().find(([, url]) => url === draft.photo);
    draft.gender = g;
    if (prev && binary(g) && avatarGender(prev[0]) && avatarGender(prev[0]) !== g) {
      const num = prev[0].match(/(\d+)$/)?.[1];
      const twin = avatars().find(([n]) => num && n.endsWith(`-${num}`));
      draft.photo = twin ? twin[1] : null;
    }
    Audio2.sfx.choice();
    rerender();
  }

  // Tarjetas grandes de Mujer / Hombre con un retrato de muestra, y No binario aparte.
  function genderPicker() {
    const sample = (g) => avatars(g).find(([n]) => avatarGender(n) === g)?.[1];
    const big = C().genders.filter((g) => binary(g.id));
    const rest = C().genders.filter((g) => !binary(g.id));
    return el('div', { class: 'gender-pick' },
      el('div', { class: 'gender-cards' }, big.map((g) => {
        const img = sample(g.id);
        return el('button', { class: `gender-card${draft.gender === g.id ? ' active' : ''}`, onclick: () => setGender(g.id) },
          img ? el('img', { src: img, alt: g.label }) : el('span', { class: 'gender-empty' }),
          el('strong', {}, g.label),
          el('small', {}, `${avatars(g.id).length} retratos`));
      })),
      el('div', { class: 'seg' }, rest.map((g) =>
        el('button', { class: draft.gender === g.id ? 'active' : '', onclick: () => setGender(g.id) }, g.label))));
  }

  function statBars(stats) {
    return el('div', { class: 'stat-bars' }, Object.entries(window.STORY.stats).map(([k, meta]) =>
      el('div', { class: 'stat' },
        el('span', {}, meta.label),
        el('div', { class: 'bar' }, el('i', { style: `width:${Math.min(100, stats[k] * 20)}%` })),
        el('b', {}, stats[k]))));
  }

  function field(label, input, hint) {
    return el('label', { class: 'field' }, el('span', {}, label), input, hint ? el('small', { class: 'muted' }, hint) : null);
  }

  // Nombres de los minijuegos en los que una clase o habilidad da ventaja.
  function gamesText(bonus = {}) {
    return Object.keys(bonus).map((k) => window.Minigames?.GAMES?.[k]?.title || k).join(', ');
  }

  // Qué cambia en la partida al elegir una familia: con quién empiezas unido y quién te aprecia.
  function familyEffects(f) {
    const links = window.RELATIONS.familyLinks[f.id] || {};
    const names = (id) => window.WIKI.personajes.find((x) => x.id === id)?.name || id;
    const out = Object.entries(links).map(([id, [, label]]) => `${names(id)}: ${tpl(label, draft)}`);
    const aff = Object.entries(f.aff || {}).filter(([id]) => !links[id]).map(([id, n]) => `${names(id)} te aprecia (+${n})`);
    if (!out.length && !aff.length) return ['Nadie te conoce: cada primer encuentro de la historia es de verdad el primero.'];
    return [...out, ...aff, out.length ? 'La historia tiene escenas y diálogos propios con tu familia. Con ellos nunca hay romance.' : 'Te abre puertas y conversaciones de su círculo.'];
  }

  // Quién puede llegar a ser tu familia elegida según los padres que tengas.
  function chosenFamily() {
    const p = draft.parents;
    const names = Object.entries(window.RELATIONS.chars).filter(([, c]) => {
      const role = c.family;
      if (!role) return false;
      if (role === 'padre') return p === 'madre' || p === 'ninguno';
      if (role === 'madre') return p === 'padre' || p === 'ninguno';
      return p !== 'ambos';
    }).map(([id]) => window.WIKI.personajes.find((x) => x.id === id)?.name || id);
    return names.length ? `Podrán ser tu familia elegida (con mucha confianza): ${names.join(', ')}.` : 'Con tus dos padres, nadie ocupará ese lugar, pero sí puedes tener mejores amigos y hermanos de corazón.';
  }

  function bonusText(stats = {}) {
    return Object.entries(stats).map(([k, v]) => `+${v} ${window.STORY.stats[k].label}`).join(', ') || 'sin bonificación';
  }

  // ---------- Estructura ----------
  // Retrato grande al estilo de la selección de campeón, con nombre, clase y título.
  function splash() {
    const cls = C().classes.find((c) => c.id === draft.cls);
    return el('div', { class: `splash${draft.photo ? '' : ' empty'}`, id: 'splash', title: '¡Haz clic!', onclick: () => quip() },
      draft.photo
        ? el('img', { src: draft.photo, alt: 'Tu retrato' })
        : el('div', { class: 'splash-empty' }, el('span', {}, ''), el('p', {}, step < 5 ? 'Tu retrato se elige en el paso «Retrato».' : 'Elige un retrato de la galería o sube tu foto.')),
      el('div', { class: 'splash-plate' },
        draft.title ? el('small', {}, tpl(draft.title, draft)) : null,
        el('strong', { id: 'stage-name' }, draft.name || 'Sin nombre'),
        el('span', {}, [cls ? tpl(cls.label, draft) : null, draft.origin ? C().origins[draft.origin].label : null].filter(Boolean).join(' · '))));
  }

  function layout() {
    const root = $('#view-creator');
    root.innerHTML = '';
    const city = draft.origin === 'piltover' ? 'piltover' : draft.origin === 'zaun' ? 'zaun' : 'puente';
    const bgImg = window.CustomArt.image('lugares', city);
    const bg = el('div', { class: `creator-bg creator-bg-${draft.origin || 'none'}`, style: bgImg ? `background-image:url("${bgImg}")` : null });
    const side = el('div', { class: 'creator-stage' },
      el('div', { id: 'stage-splash' }, splash()),
      el('div', { class: 'row gap center' },
        el('button', { class: 'btn small', onclick: randomize }, 'Aleatorio')),
      el('div', { id: 'stage-build' }, buildBar()),
      el('div', { id: 'stage-stats' }, statBars(computeStats(draft))));
    const body = el('div', { class: 'creator-body panel' });
    root.append(bg, el('div', { class: 'creator' }, header(), el('div', { class: 'creator-grid' }, body, side)));
    return body;
  }

  function rerender() {
    const body = layout();
    [stepOrigin, stepIdentity, stepPortrait, stepFamily, stepSummary][step](body);
    body.classList.add('enter');
  }

  function refreshPreview() {
    const sp = $('#stage-splash');
    if (sp) { sp.innerHTML = ''; sp.append(splash()); }
    const st = $('#stage-stats');
    if (st) { st.innerHTML = ''; st.append(statBars(computeStats(draft))); }
    const b = $('#stage-build');
    if (b) { b.innerHTML = ''; b.append(buildBar()); }
  }

  // La vista previa resume profesión y familia; no muestra habilidades sin uso real.
  function buildBar() {
    const origin = C().origins[draft.origin];
    const job = origin?.jobs.find((j) => j.id === draft.job);
    const family = origin?.families.find((f) => f.id === draft.family);
    return el('div', { class: 'build-bar' },
      el('div', { class: 'class-badge' }, job ? tpl(job.label, draft) : 'Tu historia'),
      el('div', { class: 'ability-row' }, el('span', { class: 'muted' }, family ? tpl(family.label, draft) : 'Elige tus vínculos')));
  }

  function abilityHex(a, key, small) {
    return el('div', { class: `ability-hex${a ? '' : ' empty'}${small ? ' small' : ''}`, title: a ? `${a.name}: ${tpl(a.desc, draft)}` : `${key}: sin elegir` },
      el('span', { class: 'ab-icon' }, a ? a.icon : '?'), el('kbd', {}, key));
  }

  // Gráfico de radar de las cuatro estadísticas.
  function radar(stats, size = 220) {
    const c = el('canvas', { class: 'radar', width: size, height: size });
    const ctx = c.getContext('2d');
    const keys = Object.keys(window.STORY.stats);
    const cx = size / 2;
    const cy = size / 2;
    const R = size * 0.36;
    const pt = (i, v) => { const a = -Math.PI / 2 + (i * Math.PI * 2) / keys.length; return [cx + Math.cos(a) * R * v, cy + Math.sin(a) * R * v]; };
    ctx.strokeStyle = 'rgba(227,196,90,0.25)';
    for (let r = 1; r <= 4; r++) { ctx.beginPath(); keys.forEach((_, i) => { const [x, y] = pt(i, r / 4); ctx[i ? 'lineTo' : 'moveTo'](x, y); }); ctx.closePath(); ctx.stroke(); }
    ctx.beginPath();
    keys.forEach((k, i) => { const [x, y] = pt(i, Math.min(1, stats[k] / 10)); ctx[i ? 'lineTo' : 'moveTo'](x, y); });
    ctx.closePath();
    ctx.fillStyle = 'rgba(63,169,245,0.35)'; ctx.fill();
    ctx.strokeStyle = '#7fd0ff'; ctx.lineWidth = 2.5; ctx.stroke();
    ctx.fillStyle = '#f4efe6'; ctx.font = '12px system-ui'; ctx.textAlign = 'center';
    keys.forEach((k, i) => { const [x, y] = pt(i, 1.25); ctx.fillText(`${window.STORY.stats[k].icon} ${stats[k]}`, x, y + 4); });
    return c;
  }

  function go(n) {
    step = n;
    Audio2.sfx.click();
    rerender();
  }

  // Frases al hacer clic en el retrato.
  function quip() {
    const origin = C().origins[draft.origin];
    const job = origin?.jobs.find((j) => j.id === draft.job);
    const who = draft.name || 'yo';
    const lines = [
      `¿Qué miras? Soy ${who}.`,
      job ? `${tpl(job.label, draft)} de ${draft.origin === 'piltover' ? 'Piltover' : 'Zaun'}. Y de las buenas.` : 'Aún estoy encontrando mi lugar en la ciudad.',
      '¡Eh, sin tocar!',
      'Si me vuelves a pinchar, te lanzo una bomba de pintura.',
      draft.origin === 'piltover' ? 'El progreso no espera, y yo tampoco.' : 'Aquí abajo nadie viene a salvarnos.',
    ];
    const sp = $('#splash');
    if (!sp) return;
    sp.querySelector('.splash-quote')?.remove();
    const q = el('div', { class: 'splash-quote' }, pick(lines));
    sp.append(q);
    Audio2.sfx.message();
    setTimeout(() => q.remove(), 3200);
  }

  function randomize() {
    const gallery = avatars();
    if (gallery.length) draft.photo = pick(gallery)[1];
    Audio2.sfx.choice();
    rerender();
  }

  // ----- Paso 1: Origen -----
  function stepOrigin(body) {
    body.append(el('h2', {}, '¿De qué lado del puente vienes?'),
      el('p', { class: 'muted' }, 'Tu origen decide tu ruta, los personajes que conoces primero y cómo te miran los demás.'));
    const grid = el('div', { class: 'origin-grid' });
    for (const [id, o] of Object.entries(C().origins)) {
      // Reutiliza el arte local del juego para que la selección muestre las ciudades
      // ya incluidas en el proyecto, en vez de generar una escena nueva en cada tarjeta.
      const cityArt = window.CustomArt.image('lugares', id) || `img/arte/lugares/${id}.webp`;
      const card = el('button', {
        class: `origin-card origin-${id}${draft.origin === id ? ' active' : ''}`,
        style: `--origin-art:url("${cityArt}")`,
        'aria-pressed': String(draft.origin === id),
        onclick: () => {
          if (draft.origin !== id) {
            draft.origin = id; draft.district = o.districts[0]; draft.job = o.jobs[0].id; draft.family = 'ninguna';
            draft.look.outfit = id === 'piltover' ? 'abrigo' : 'chaqueta';
            draft.look.outfitColor = id === 'piltover' ? '#c4c0b8' : '#4a3a5a';
          }
          document.body.dataset.city = id;
          document.body.dataset.ciudad = id;
          window.App?.setCity?.(id);
          Audio2.playMusic(id);
          rerender();
        },
      }, el('div', { class: 'origin-info' }, el('h3', {}, o.label), el('p', {}, o.tagline),
        el('small', {}, id === 'zaun' ? 'Química · callejones · supervivencia' : 'Hextech · poder · progreso')));
      grid.append(card);
    }
    body.append(grid, nav());
  }

  // ----- Paso 2: Identidad -----
  function stepIdentity(body) {
    const o = C().origins[draft.origin];
    const name = el('input', {
      class: 'input', maxlength: 28, value: draft.name, placeholder: 'Escribe tu nombre',
      oninput: (e) => { draft.name = e.target.value; body.querySelector('.creator-nav .primary').disabled = !canNext(); $('#stage-name').textContent = draft.name || 'Sin nombre'; },
    });
    const age = el('input', { class: 'input', type: 'number', min: 14, max: 99, value: draft.age, oninput: (e) => { draft.age = e.target.value; } });
    const district = el('select', { class: 'input', onchange: (e) => { draft.district = e.target.value; } },
      o.districts.map((d) => el('option', { value: d, selected: d === draft.district }, d)));
    const job = el('div', { class: 'option-grid' }, o.jobs.map((j) =>
      el('button', { class: `option${draft.job === j.id ? ' active' : ''}`, onclick: () => { draft.job = j.id; rerender(); } },
        el('strong', {}, tpl(j.label, draft)), el('small', {}, bonusText(j.stats)))));
    body.append(el('h2', {}, 'Quién eres'),
      el('h3', {}, '¿Hombre o mujer?'),
      el('p', { class: 'muted' }, 'Los diálogos se adaptan a tu género y en el paso «Retrato» solo verás los retratos de tu género.'),
      genderPicker(),
      el('div', { class: 'form-grid' },
        field('Nombre', name),
        field('Edad', age), field(`Barrio de ${o.label}`, district, 'Es donde empiezas en el mapa.'),
        field('Te atraen', el('div', { class: 'seg' }, C().attractions.map((g) =>
          el('button', { class: draft.attraction === g.id ? 'active' : '', onclick: () => { draft.attraction = g.id; rerender(); } }, g.label))),
        'Decide con quién puedes tener una relación de pareja (a partir de 18 años).')),
      el('h3', {}, 'A qué te dedicas'), job, nav());
    setTimeout(() => name.focus(), 0);
  }

  // ----- Paso 6: Retrato -----
  function stepPortrait(body) {
    const gallery = avatars();
    const file = el('input', { type: 'file', accept: 'image/*', class: 'hidden', onchange: (e) => loadPhoto(e.target.files[0]) });
    const choose = (url) => { draft.photo = url; Audio2.sfx.choice(); rerender(); };
    body.append(el('h2', {}, 'Tu retrato'),
      el('div', { class: 'seg portrait-gender' }, C().genders.map((g) =>
        el('button', { class: draft.gender === g.id ? 'active' : '', onclick: () => setGender(g.id) }, g.label))),
      el('p', { class: 'muted' }, binary(draft.gender)
        ? `${draft.gender === 'mujer' ? 'Retratos de mujer' : 'Retratos de hombre'}: ${gallery.length}. Cambia de género arriba y la galería cambia con él.`
        : `Todos los retratos: ${gallery.length}. Con «Mujer» u «Hombre» solo verás los de ese género.`),
      el('div', { class: 'row gap' },
        el('button', { class: 'btn primary', onclick: () => file.click() }, 'Subir mi foto'),
        window.arcane?.art ? el('button', { class: 'btn ghost', onclick: () => window.arcane.art.open('avatares') }, 'Abrir carpeta avatares') : null,
        window.arcane?.art ? el('button', { class: 'btn ghost', onclick: async () => { await window.CustomArt.load(); rerender(); } }, 'Recargar') : null,
        file));
    const card = ([name, url]) => el('button', { class: `avatar-card${draft.photo === url ? ' active' : ''}`, title: name, onclick: () => choose(url) },
      el('img', { src: url, alt: name, loading: 'lazy' }));
    if (!gallery.length) {
      body.append(el('div', { class: 'gallery-empty' },
        el('h3', {}, 'La galería está vacía'),
        el('p', {}, 'Abre la carpeta «avatares», copia tus imágenes (png, jpg o webp) con «mujer-» u «hombre-» delante del nombre y pulsa Recargar. También puedes subir tu foto.')));
    } else {
      body.append(el('div', { class: 'avatar-gallery' }, gallery.map(card)));
    }
    const extra = unsorted();
    if (extra.length) {
      body.append(el('h3', {}, 'Otras imágenes de tu carpeta'),
        el('p', { class: 'muted' }, 'No llevan «mujer-» ni «hombre-» en el nombre. Renómbralas así (o ponlas en avatares/mujer o avatares/hombre) para que salgan solo con su género.'),
        el('div', { class: 'avatar-gallery' }, extra.map(card)));
    }
    body.append(nav());
  }

  // Foto propia recortada en vertical (3:4) sin filtros.
  function loadPhoto(f) {
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const W = 600;
        const H = 800;
        const k = Math.max(W / img.width, H / img.height);
        const cv = document.createElement('canvas');
        cv.width = W;
        cv.height = H;
        cv.getContext('2d').drawImage(img, (W - img.width * k) / 2, Math.min(0, (H - img.height * k) * 0.25), img.width * k, img.height * k);
        draft.photo = cv.toDataURL('image/jpeg', 0.9);
        Audio2.sfx.unlock();
        rerender();
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(f);
  }

  // ----- Paso 4: Familia y aficiones -----
  function stepFamily(body) {
    const o = C().origins[draft.origin];
    body.append(el('h2', {}, 'Familia famosa y repercusión en la historia'),
      el('p', { class: 'muted' }, 'Tu OC forma parte de la historia, no es un primo lejano ni un extra. Elige un vínculo directo con alguien importante o «Ninguna» para descubrir el mundo sin parentescos predeterminados. Esta elección cambia quién te conoce, la afinidad inicial y los límites de las relaciones.'),
      el('p', { class: 'creator-consecuencia' }, 'Universo alternativo de rol: el parentesco puede cambiar acontecimientos del canon. Las consecuencias se desarrollan durante la partida, no solo en la ficha.'));
    body.append(el('div', { class: 'option-grid' }, o.families.map((f) =>
      el('button', { class: `option${draft.family === f.id ? ' active' : ''}`, onclick: () => { draft.family = f.id; rerender(); } },
        el('strong', {}, tpl(f.label, draft)), el('small', {}, bonusText(f.stats)),
        el('ul', { class: 'family-effects' }, familyEffects(f).map((t) => el('li', {}, t)))))));
    body.append(el('h3', {}, 'Tus padres'),
      el('p', { class: 'muted' }, 'Si te falta tu padre, tu madre o los dos, algunos personajes podrán convertirse en tu familia elegida.'),
      el('div', { class: 'chips wrap' }, C().parents.map((x) =>
        el('button', { class: `chip${draft.parents === x.id ? ' active' : ''}`, onclick: () => { draft.parents = x.id; rerender(); } }, tpl(x.label, draft)))),
      el('p', { class: 'creator-consecuencia' }, chosenFamily()));
    body.append(el('h3', {}, `Aficiones (elige hasta ${C().maxHobbies})`));
    body.append(el('div', { class: 'option-grid small' }, C().hobbies.map((h) => {
      const on = draft.hobbies.includes(h.id);
      return el('button', {
        class: `option${on ? ' active' : ''}`,
        onclick: () => {
          if (on) draft.hobbies = draft.hobbies.filter((x) => x !== h.id);
          else if (draft.hobbies.length < C().maxHobbies) draft.hobbies.push(h.id);
          else return U.toast(`Máximo ${C().maxHobbies} aficiones`, 'warn');
          rerender();
        },
      }, el('strong', {}, h.label), el('small', {}, bonusText(h.stats)));
    })));
    body.append(nav());
  }

  // ----- Paso 5: Resumen -----
  function stepSummary(body) {
    const p = buildPlayer(draft);
    body.append(el('h2', {}, 'Tu ficha'), sheetList(p));
    const bio = el('textarea', { class: 'input', rows: 4, maxlength: 600, placeholder: '¿Qué te trae a esta historia? (opcional)', oninput: (e) => { draft.bio = e.target.value; } }, draft.bio);
    body.append(field('Biografía', bio), nav('¡Comenzar la historia! ✦'));
  }

  function sheetList(p) {
    const rows = [
      ['Nombre', p.name], ['Género', C().genders.find((g) => g.id === p.gender)?.label], ['Edad', p.age],
      ['Ciudad', `${C().origins[p.origin].label} · ${p.district}`], ['Profesión', tpl(p.jobLabel, p)],
      ['Familia y vínculo', tpl(p.familyLabel, p)],
      ...(p.family !== 'ninguna' ? [['Repercusión narrativa', 'El personaje relacionado te conoce desde el inicio; se activan vínculos familiares, afinidad inicial y escenas de confianza.']] : [['Repercusión narrativa', 'Sin parentesco famoso predefinido: los vínculos se construyen jugando.']]),
      ...(p.parents ? [['Padres', tpl(C().parents.find((x) => x.id === p.parents)?.label || '', p)]] : []),
      ...(p.attraction ? [['Te atraen', C().attractions.find((x) => x.id === p.attraction)?.label || '']] : []),
      ['Aficiones', p.hobbyLabels.join(', ')],
    ];
    return el('dl', { class: 'sheet-list' }, rows.flatMap(([k, v]) => [el('dt', {}, k), el('dd', {}, String(v ?? ''))]));
  }

  function finish() {
    const player = buildPlayer(draft);
    Audio2.sfx.unlock();
    onDone(player, computeStats(draft));
  }

  function start(cb) {
    draft = fresh();
    step = 0;
    onDone = cb;
    rerender();
  }

  window.Creator = { start, sheetList };
})();
