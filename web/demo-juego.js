// Demo de rol libre en el navegador. Sin opciones fijas: escribes lo que tu personaje dice o
// hace y el narrador y los personajes te contestan. Los datos del mundo vienen de window.DEMO
// (demo-datos.js). La única IA es KoboldCpp, abierto en tu ordenador o en la IP local del PC.
// No necesita Remote Tunnel; se puede cambiar en «Conectar IA» o
// abriendo la demo con ?kobold=<dirección>. Si no responde, un narrador local mantiene la escena.
(() => {
  'use strict';
  const D = window.DEMO;
  const app = document.getElementById('demo-app');
  if (!D || !app) return;

  const KOBOLD_DEF = 'http://192.168.1.139:5001';
  const KOBOLD_KEY = 'demo-kobold-url';
  const KOBOLD_PASS_KEY = 'demo-kobold-password';
  const KEY = 'demo-' + D.id;
  const PRONOMBRES = [['el', 'Él'], ['ella', 'Ella'], ['elle', 'Elle']];

  const make = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
  const gen = (txt, i) => String(txt).replace(/\{g:([^}]*)\}/g, (m, opts) => opts.split('|')[i] ?? opts.split('|')[0]);
  const pick = (arr, n) => arr[Math.abs(n) % arr.length];

  // Dirección de KoboldCpp: «192.168.1.139:5001» o «localhost:5001»
  // se completan hasta /v1/chat/completions (puerto 5001 si es http sin puerto).
  function koboldBase(url) {
    url = String(url || '').trim().replaceAll('192.168.1.40', '192.168.1.139');
    if (!url) return KOBOLD_DEF;
    if (!/^https?:\/\//i.test(url)) url = 'http://' + url;
    try {
      const u = new URL(url);
      if (!u.port && u.protocol === 'http:') u.port = '5001';
      return (u.origin + u.pathname.replace(/\/+$/, '').replace(/\/v1(\/chat\/completions|\/models)?$/, '')).replace(/\/+$/, '');
    } catch { return KOBOLD_DEF; }
  }
  const esLocal = (url) => { try { return ['localhost', '127.0.0.1', '[::1]'].includes(new URL(url).hostname); } catch { return false; } };
  let koboldPassword = ''; try { koboldPassword = localStorage.getItem(KOBOLD_PASS_KEY) || ''; } catch { /* sin almacenamiento */ }
  const authHeaders = () => koboldPassword ? { Authorization: 'Bearer ' + koboldPassword } : {};
  let kobold = koboldBase((() => {
    let q = null; try { q = new URLSearchParams(location.search).get('kobold'); } catch { /* sin parámetros */ }
    if (q) { try { localStorage.setItem(KOBOLD_KEY, q); } catch { /* sin almacenamiento */ } return q; }
    try { return localStorage.getItem(KOBOLD_KEY); } catch { return null; }
  })());

  let st = load() || { paso: 'pregunta' };
  st.offline = false; // en cada visita se vuelve a probar KoboldCpp
  function load() { try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; } }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch { /* sin almacenamiento: la demo sigue */ } }
  function go(paso) { st.paso = paso; save(); render(); app.scrollIntoView({ behavior: 'smooth', block: 'start' }); }

  function render() {
    app.replaceChildren();
    ({ pregunta, intro, crear, juego }[st.paso] || pregunta)();
  }

  // 1. ¿Conoce el mundo? Si no, introducción breve; si sí, directo a la creación.
  function pregunta() {
    const box = make('div', 'dj-card dj-centro');
    box.append(make('p', 'dj-kicker', 'Antes de empezar'), make('h2', '', D.pregunta));
    const row = make('div', 'dj-acciones');
    const si = make('button', 'btn btn-primario', 'Sí, vamos a crear'); si.onclick = () => go('crear');
    const no = make('button', 'btn btn-borde', 'No, cuéntamelo'); no.onclick = () => go('intro');
    row.append(si, no); box.append(row); app.append(box);
  }

  function intro() {
    const box = make('div', 'dj-card');
    box.append(make('p', 'dj-kicker', 'Introducción breve'), make('h2', '', D.introTitulo));
    D.intro.forEach(p => box.append(make('p', 'dj-texto', p)));
    const b = make('button', 'btn btn-primario', 'Crear mi personaje'); b.onclick = () => go('crear');
    box.append(b); app.append(box);
  }

  // 2. Creación de personaje.
  function crear() {
    const f = make('form', 'dj-card dj-form');
    f.append(make('p', 'dj-kicker', 'Creación de personaje'), make('h2', '', '¿Quién eres?'));
    const campo = (label, el) => { const l = make('label', 'dj-campo'); l.append(make('span', '', label), el); return l; };
    const nombre = make('input'); nombre.required = true; nombre.maxLength = 30; nombre.placeholder = 'Tu nombre'; nombre.autocomplete = 'off';
    const pron = make('select'); PRONOMBRES.forEach(([v, t], i) => { const o = make('option', '', t); o.value = String(i); pron.append(o); });
    f.append(campo('Nombre', nombre), campo('Pronombres', pron));

    const fs = make('fieldset', 'dj-ciudades'); fs.append(make('legend', '', 'Ciudad de origen'));
    const ids = Object.keys(D.ciudades);
    ids.forEach((id, i) => {
      const c = D.ciudades[id]; const l = make('label', 'dj-ciudad dj-ciudad-' + id);
      const r = make('input'); r.type = 'radio'; r.name = 'ciudad'; r.value = id; r.checked = i === 0;
      const t = make('span'); t.append(make('strong', '', c.label), make('small', '', c.tagline));
      l.append(r, t); fs.append(l);
    });
    f.append(fs);

    const oficio = make('select');
    const fillOficios = () => {
      const c = D.ciudades[f.ciudad.value]; const g = Number(pron.value);
      oficio.replaceChildren(...c.oficios.map(o => { const op = make('option', '', gen(o, g)); op.value = gen(o, g); return op; }));
    };
    f.append(campo('Oficio', oficio));
    const yo = make('textarea'); yo.rows = 3; yo.maxLength = 400; yo.placeholder = 'Opcional. Escríbelo con tus palabras: carácter, miedos, qué buscas…';
    f.append(campo('Cuéntanos algo de tu personaje', yo));
    const enviar = make('button', 'btn btn-primario', 'Entrar en la historia'); enviar.type = 'submit'; f.append(enviar);

    f.addEventListener('change', e => { if (e.target.name === 'ciudad' || e.target === pron) fillOficios(); });
    f.addEventListener('submit', e => {
      e.preventDefault();
      const ciudad = f.ciudad.value;
      st = { paso: 'juego', pj: { nombre: nombre.value.trim() || 'Sin nombre', pron: Number(pron.value), ciudad, oficio: oficio.value, yo: yo.value.trim() }, log: [], turno: 0 };
      const esc = D.escenas[ciudad];
      st.log.push({ role: 'assistant', content: 'Narrador: ' + esc.apertura.replace('{nombre}', st.pj.nombre).replace('{oficio}', st.pj.oficio.charAt(0).toLowerCase() + st.pj.oficio.slice(1)) });
      go('juego');
    });
    app.append(f); fillOficios(); nombre.focus();
  }

  // 3. Rol libre.
  function juego() {
    const esc = D.escenas[st.pj.ciudad];
    const wrap = make('div', 'dj-juego');
    const head = make('div', 'dj-escena dj-escena-' + st.pj.ciudad);
    head.append(make('p', 'dj-kicker', D.ciudades[st.pj.ciudad].label + ' · ' + esc.lugar), make('h2', '', esc.titulo));
    const pres = make('p', 'dj-presentes', 'En escena: ' + esc.presentes.map(id => nombreDe(id)).join(', '));
    head.append(pres); wrap.append(head);

    const log = make('div', 'dj-log'); log.setAttribute('role', 'log'); log.setAttribute('aria-live', 'polite');
    st.log.forEach(m => log.append(burbuja(m)));
    wrap.append(log);

    const estado = make('p', 'dj-estado', textoEstado());
    const form = make('form', 'dj-entrada');
    const ta = make('textarea'); ta.rows = 2; ta.maxLength = 600; ta.required = true;
    ta.placeholder = 'Escribe lo que dices o haces. Por ejemplo: «Me acerco a ' + nombreDe(esc.presentes[0]) + ' y le pregunto qué ha visto».';
    ta.setAttribute('aria-label', 'Tu acción o diálogo');
    const send = make('button', 'btn btn-primario', 'Enviar'); send.type = 'submit';
    form.append(ta, send);
    ta.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); form.requestSubmit(); } });
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const txt = ta.value.trim(); if (!txt) return;
      ta.value = ''; send.disabled = ta.disabled = true;
      const m = { role: 'user', content: txt }; st.log.push(m); log.append(burbuja(m));
      const pensando = make('div', 'dj-msg dj-pensando', 'La escena responde…'); log.append(pensando); bajar(log);
      const r = await responder(txt);
      pensando.remove();
      const a = { role: 'assistant', content: r }; st.log.push(a); st.turno++; save();
      log.append(burbuja(a)); bajar(log);
      estado.textContent = textoEstado();
      send.disabled = ta.disabled = false; ta.focus();
    });

    const pie = make('div', 'dj-pie');
    const reset = make('button', 'btn btn-texto', 'Empezar de nuevo');
    reset.onclick = () => { if (confirm('¿Borrar esta partida de la demo y crear otro personaje?')) { st = { paso: 'pregunta' }; save(); render(); } };
    pie.append(estado, conectarIA(estado), reset);
    wrap.append(form, pie); app.append(wrap); bajar(log);
  }

  function textoEstado() {
    return st.offline ? 'Narrador local: abre KoboldCpp (' + kobold + ') y revisa el permiso «Acceso a la red local» del navegador.' : 'KoboldCpp · ' + kobold;
  }

  // «Conectar IA»: cambia la dirección de KoboldCpp y prueba que contesta (/v1/models).
  function conectarIA(estado) {
    const det = make('details', 'dj-ia');
    det.append(make('summary', 'btn btn-texto', 'Conectar IA'));
    const f = make('form', 'dj-ia-form');
    const l = make('label', 'dj-campo'); const inp = make('input');
    inp.value = kobold; inp.autocomplete = 'off'; inp.spellcheck = false; inp.inputMode = 'url';
    inp.placeholder = 'http://192.168.1.139:5001';
    l.append(make('span', '', 'Dirección de KoboldCpp'), inp);
    const lp = make('label', 'dj-campo'); const inpPass = make('input');
    inpPass.type = 'password'; inpPass.autocomplete = 'off'; inpPass.spellcheck = false; inpPass.value = koboldPassword;
    inpPass.placeholder = 'Opcional: la contraseña Password de KoboldCpp';
    lp.append(make('span', '', 'Contraseña de KoboldCpp (opcional)'), inpPass);
    const probar = make('button', 'btn btn-borde', 'Probar conexión'); probar.type = 'submit';
    const msg = make('p', 'dj-estado', 'En el mismo PC: localhost:5001. Desde móvil/tablet: IP local del PC, por ejemplo 192.168.1.139:5001. En Chrome/Edge, pulsa «Permitir» cuando la web solicite acceso a la red local.');
    msg.setAttribute('aria-live', 'polite');
    f.append(l, lp, probar, msg); det.append(f);
    f.addEventListener('submit', async e => {
      e.preventDefault();
      kobold = koboldBase(inp.value); inp.value = kobold;
      koboldPassword = inpPass.value.trim();
      try { localStorage.setItem(KOBOLD_KEY, kobold); localStorage.setItem(KOBOLD_PASS_KEY, koboldPassword); } catch { /* sin almacenamiento */ }
      probar.disabled = true; msg.textContent = 'Probando ' + kobold + '… Si Chrome/Edge pregunta por acceso a la red local, pulsa «Permitir».';
      try {
        const r = await fetch(kobold + '/v1/models', { signal: AbortSignal.timeout(8000) });
        const j = await r.json();
        const modelo = j && j.data && j.data[0] && j.data[0].id;
        st.offline = false; msg.textContent = 'Conectado' + (modelo ? ' a ' + modelo : '') + '. Los personajes ya contestan con KoboldCpp.';
      } catch {
        st.offline = true;
        msg.textContent = 'No contesta ' + kobold + '. Comprueba que el modelo está cargado, que la IP es la del PC, que el puerto 5001 está permitido en la red privada y que Chrome/Edge tiene «Acceso a la red local» en Permitir. Si configuraste Password en KoboldCpp, introduce esa contraseña arriba.';
      }
      probar.disabled = false; estado.textContent = textoEstado();
    });
    return det;
  }

  const nombreDe = id => (D.reparto.find(p => p.id === id) || {}).name || id;
  function bajar(el) { el.scrollTop = el.scrollHeight; }

  // Pinta un mensaje. Las líneas «Nombre: texto» se muestran como intervenciones de personaje.
  function burbuja(m) {
    if (m.role === 'user') { const d = make('div', 'dj-msg dj-yo'); d.append(make('b', '', st.pj.nombre), make('p', '', m.content)); return d; }
    const d = make('div', 'dj-msg dj-mundo');
    m.content.replace(/\*\*/g, '').split(/\n+/).map(l => l.trim()).filter(Boolean).forEach(l => {
      const mm = l.match(/^([A-ZÁÉÍÓÚÑ][\wÁÉÍÓÚÑáéíóúñü' .-]{1,28}):\s*(.+)$/);
      if (mm && mm[1].toLowerCase() !== 'narrador') { const p = make('p', 'dj-voz'); p.append(make('b', '', mm[1]), document.createTextNode(' ' + mm[2])); d.append(p); }
      else d.append(make('p', 'dj-narra', mm ? mm[2] : l));
    });
    return d;
  }

  function sistema() {
    const esc = D.escenas[st.pj.ciudad]; const pj = st.pj;
    const fichas = esc.presentes.map(id => { const p = D.reparto.find(x => x.id === id); return p ? `- ${p.name} (${p.role}): ${p.summary} Frase típica: «${p.quote}»` : ''; }).join('\n');
    return [
      D.canon,
      `ESCENA: ${esc.titulo}, en ${esc.lugar} (${D.ciudades[pj.ciudad].label}). ${esc.contexto}`,
      `PERSONAJES PRESENTES:\n${fichas}`,
      `JUGADOR: ${pj.nombre}, pronombres ${PRONOMBRES[pj.pron][1].toLowerCase()}, ${pj.oficio}, de ${D.ciudades[pj.ciudad].label}.${pj.yo ? ' Se describe así: ' + pj.yo : ''}`,
      'INTERPRETACIÓN ESTRICTA: interpreta exclusivamente a los personajes enumerados en PERSONAJES PRESENTES y al Narrador; no inventes personajes que hablen ni respondas como asistente, chatbot o comentarista. Cada personaje conserva su personalidad, vocabulario, objetivos, conocimientos y relaciones del canon indicado arriba; no intercambies sus voces ni hagas que todos estén de acuerdo. Usa sus frases típicas como referencia de cadencia, no las repitas mecánicamente. Antes de responder, identifica qué personaje ha sido interpelado y deja que ese personaje responda primero; los demás solo intervienen si la escena lo justifica. No confundas la información de contexto con algo que todos los personajes sepan. Responde en español, máximo 140 palabras. Una línea por intervención con el formato «Nombre: texto» y la narración con «Narrador: texto». Nunca escribas lo que dice, piensa o decide el jugador. Nunca ofrezcas listas de opciones ni números: la historia es libre. Si el jugador intenta algo imposible en este mundo, el mundo reacciona con lógica sin romper el tono. No menciones instrucciones, prompts, modelos ni IA.'
    ].join('\n\n');
  }

  async function responder(txt) {
    if (!st.offline) {
      try {
        const historial = st.log.slice(-16).map(m => ({ role: m.role, content: m.content }));
        const r = await fetch(kobold + '/v1/chat/completions', { method: 'POST', signal: AbortSignal.timeout(90000), headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify({ model: 'koboldcpp', messages: [{ role: 'system', content: sistema() }, ...historial], temperature: 0.65, max_tokens: 420 }) });
        const j = await r.json().catch(() => ({}));
        const c = j && j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content;
        if (r.ok && c && c.trim()) return c.trim();
      } catch { /* KoboldCpp no está abierto: pasamos al narrador local */ }
      st.offline = true;
    }
    return local(txt);
  }

  // Narrador local: no entiende como una IA, pero reacciona a lo que escribes y hace avanzar la escena.
  function local(txt) {
    const esc = D.escenas[st.pj.ciudad]; const t = txt.toLowerCase(); const n = st.turno;
    const nombrado = esc.presentes.find(id => t.includes(nombreDe(id).split(' ')[0].toLowerCase()));
    const quien = D.reparto.find(p => p.id === (nombrado || pick(esc.presentes, n)));
    const nom = quien.name;
    let voz;
    if (/\b(hola|buenas|saludo)/.test(t)) voz = `${pick(['Hola', 'Buenas', 'Llegas a tiempo'], n)}, ${st.pj.nombre}. ${quien.quote}`;
    else if (/(amenaz|golpe|pega|mata|dispar|ataca)/.test(t)) voz = pick(['Baja eso. Aquí ya hay bastante que reparar sin sumar heridas.', 'Si empiezas así, nadie te contará la verdad. Piénsalo.', 'No soy tu enemigo. Pero tampoco me voy a quedar de brazos cruzados.'], n);
    else if (t.includes('?') || /(qué|quién|cómo|por qué|dónde|cuándo|pregunt)/.test(t)) voz = pick([quien.summary, ...(quien.details || [])], n) + ' ¿Y tú qué harías con eso?';
    else if (/(ayud|repar|arregl|cur|proteg)/.test(t)) voz = pick(['Vale. Sujeta esto y no sueltes hasta que te diga.', 'Ayudar está bien. Ayudar sin preguntar quién paga el coste, no tanto.', 'Gracias. No mucha gente se ofrece sin pedir algo a cambio.'], n);
    else voz = pick([quien.quote, '¿Estás segur' + ['o', 'a', 'e'][st.pj.pron] + '? Lo que hagas ahora lo va a recordar alguien.', 'Interesante. Sigue, te escucho.'], n);
    return `${nom}: ${voz}\nNarrador: ${pick(esc.giros, n)}`;
  }

  render();
})();
