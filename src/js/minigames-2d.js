// Motor de minijuegos 2D: cada modo tiene una mecánica jugable distinta y conserva los 15 IDs del catálogo.
(function () {
  const base = window.Minigames;
  const C = base.CATALOG, CG = base.CITY_GAMES, PG = base.PLACE_GAMES;
  const G = Object.fromEntries(Object.entries(base.GAMES).map(([id, def]) => [id, { ...def, mode3d: false }]));
  const activeCity = () => window.Game?.current?.()?.world?.map || window.App?.city || window.Game?.current?.()?.player?.origin || null;
  const cityOfPlace = (id) => Object.entries(window.WORLD?.maps || {}).find(([, m]) => (m.locations || []).some((l) => l.id === id))?.[0] || null;
  const available = (id, city = activeCity()) => Boolean(C[id] && (!city || C[id].city === city));
  const list = (ids) => (ids || Object.keys(C)).filter((id) => C[id]).map((id) => ({
    id, title: C[id].title, goal: C[id].goal, desc: C[id].goal, city: C[id].city,
    place: C[id].scene, emblem: base.GAMES[id]?.emblem || '<span class="mg3d-emblem">◆</span>', mode3d: false,
  }));

  function play(id, opts = {}) {
    const d = C[id];
    if (!d) { window.U?.toast?.('Reto no disponible.', 'warn'); return Promise.resolve(false); }
    const city = opts.city || activeCity();
    if (city && city !== d.city) {
      window.U?.toast?.('Este reto está disponible en ' + (d.city === 'piltover' ? 'Piltover' : 'Zaun') + '.', 'warn');
      return Promise.resolve(false);
    }
    return new Promise((resolve) => {
      document.getElementById('arcane-minigame-2d')?.remove();
      const host = document.createElement('section');
      host.id = 'arcane-minigame-2d';
      host.className = 'mg2d-overlay mg2d-' + d.city;
      host.setAttribute('role', 'dialog'); host.setAttribute('aria-modal', 'true'); host.setAttribute('aria-label', d.title);
      const panel = document.createElement('div'); panel.className = 'mg2d-panel';
      const head = document.createElement('header'); head.className = 'mg2d-head';
      const title = document.createElement('h2'); title.textContent = d.title;
      const close = document.createElement('button'); close.className = 'mg2d-close'; close.type = 'button'; close.textContent = '×'; close.setAttribute('aria-label', 'Cerrar reto');
      head.append(title, close);
      const desc = document.createElement('p'); desc.className = 'mg2d-desc'; desc.textContent = d.goal;
      const status = document.createElement('p'); status.className = 'mg2d-status'; status.setAttribute('aria-live', 'polite'); status.textContent = 'Completa el objetivo para obtener la recompensa.';
      const area = document.createElement('div'); area.className = 'mg2d-area';
      const actions = document.createElement('div'); actions.className = 'mg2d-actions';
      const foot = document.createElement('p'); foot.className = 'mg2d-footer'; foot.textContent = (d.city === 'piltover' ? 'PILTOVER · HEXTECH' : 'ZAUN · SUBCIUDAD') + ' · RETO 2D';
      panel.append(head, desc, status, area, actions, foot); host.append(panel); document.body.append(host);
      let done = false, score = 0, round = 0, mistakes = 0;
      const settings = window.App?.settings || {};
      const difficulty = settings.difficulty || 'normal';
      const hard = difficulty === 'dificil', easy = difficulty === 'facil';
      const quota = Math.max(3, Math.min(8, (d.quota || 4) + (hard ? 2 : easy ? -1 : 0)));
      const rand = (n) => Math.floor(Math.random() * n);
      const shuffle = (a) => a.map((v) => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map((x) => x[1]);
      const finish = (won) => { if (done) return; done = true; host.remove(); resolve(Boolean(won)); };
      const button = (label, fn, cls = '') => {
        const b = document.createElement('button'); b.type = 'button'; b.className = 'mg2d-btn ' + cls; b.textContent = label;
        b.addEventListener('click', fn); actions.append(b); return b;
      };
      const resetActions = () => actions.replaceChildren();
      const say = (text) => { status.textContent = text; };
      const win = () => {
        say(d.winText || 'Reto superado.'); area.replaceChildren(); resetActions();
        const reward = document.createElement('p'); reward.className = 'mg2d-success'; reward.textContent = 'Recompensa desbloqueada al continuar.';
        area.append(reward); button('Continuar', () => finish(true), 'primary');
      };
      const wrong = (text = 'No es correcto. Observa las pistas y vuelve a intentarlo.') => {
        mistakes++; say(text);
        if (hard && mistakes >= 3) { say('Demasiados errores. Reinicia el reto para intentarlo otra vez.'); resetActions(); button('Reintentar', () => { mistakes = 0; score = 0; round = 0; area.replaceChildren(); startMode(); }, 'primary'); }
      };
      const options = (question, answers, correct, onRight) => {
        area.replaceChildren(); const p = document.createElement('p'); p.className = 'mg2d-question'; p.textContent = question; area.append(p); resetActions();
        shuffle(answers.map((label, i) => ({ label, correct: i === correct }))).forEach((a) => button(a.label, () => {
          if (a.correct) onRight(); else wrong();
        }, 'choice'));
      };
      const progress = (label) => say(label + ' · ' + score + ' / ' + quota);
      function startMode() {
        const mode = d.mode;
        host.classList.add('mg2d-mode-' + mode);
        // Precisión: discrimina blancos activos de señuelos; no basta con pulsar cualquier objetivo.
        if (mode === 'shoot' || mode === 'precision' || mode === 'throw') {
          score = 0; area.replaceChildren(); resetActions();
          const intro = document.createElement('p'); intro.className = 'mg2d-instruction';
          intro.textContent = mode === 'throw' ? 'Activa solo los chompers marcados con una señal verde.' : 'Impacta únicamente las dianas activas; los señuelos restan intentos.';
          area.append(intro);
          const targets = document.createElement('div'); targets.className = 'mg2d-grid'; area.append(targets);
          const count = quota + (hard ? 3 : 2);
          shuffle(Array.from({ length: count }, (_, i) => i < quota)).forEach((active, i) => {
            const b = document.createElement('button'); b.type = 'button'; b.className = 'mg2d-btn mg2d-target' + (active ? ' is-active' : '');
            b.textContent = active ? (mode === 'throw' ? 'CHOMPER ' : 'DIANA ') + (i + 1) : 'SEÑUELO ' + (i + 1);
            b.onclick = () => {
              if (b.disabled) return;
              if (!active) { wrong('¡Señuelo! Elige solo objetivos activos.'); b.disabled = true; return; }
              b.disabled = true; b.classList.add('is-hit'); score++; progress('Precisión');
              if (score >= quota) win();
            }; targets.append(b);
          });
        } else if (mode === 'circuit' || mode === 'runes') {
          const length = (hard ? 6 : easy ? 3 : 4) + (id === 'calibracion-hexgate' ? 1 : 0);
          const seq = Array.from({ length }, () => 1 + rand(4));
          const p = document.createElement('p'); p.className = 'mg2d-instruction'; p.textContent = 'Memoriza la secuencia: ' + seq.join(' · ') + '. Después, repítela en orden.'; area.append(p);
          const nodes = document.createElement('div'); nodes.className = 'mg2d-grid'; area.append(nodes);
          let entered = [];
          const redraw = () => { nodes.replaceChildren(); for (let n = 1; n <= 4; n++) { const b = document.createElement('button'); b.type = 'button'; b.className = 'mg2d-btn'; b.textContent = 'NODO ' + n; b.onclick = () => {
            entered.push(n);
            if (entered[entered.length - 1] !== seq[entered.length - 1]) { entered = []; wrong('Secuencia incorrecta. Vuelve a empezar desde el primer nodo.'); }
            else { say('Secuencia: ' + entered.length + ' / ' + seq.length); if (entered.length === seq.length) win(); }
          }; nodes.append(b); } };
          redraw();
        } else if (mode === 'bargain') {
          score = 0; const next = () => {
            if (score >= 3) return win();
            const fair = rand(3); options('Trato ' + (score + 1) + ' de 3: el precio justo es el que beneficia a ambas partes.', ['Ofrecer un precio razonable', 'Imponer el precio con amenazas', 'Aceptar cualquier precio'], fair, () => { score++; progress('Tratos justos'); next(); });
          }; next();
        } else if (mode === 'assembly') {
          const steps = [
            ['¿Qué colocas primero en el núcleo?', ['La carcasa estabilizadora', 'El cristal sin fijar', 'Los cables sueltos'], 0],
            ['¿Qué haces con los reguladores?', ['Los alineas con el flujo', 'Los bloqueas al azar', 'Los retiras todos'], 0],
            ['¿Cómo compruebas el montaje?', ['Prueba de carga gradual', 'Sobrecarga inmediata', 'Desconectar la seguridad'], 0],
          ];
          const next = () => { if (round >= steps.length) return win(); const s = steps[round]; options(s[0], s[1], s[2], () => { round++; score++; progress('Piezas montadas'); next(); }); }; next();
        } else if (mode === 'arena') {
          const sides = ['izquierda', 'centro', 'derecha']; const next = () => {
            if (round >= 4) return win();
            const safe = sides[rand(3)]; options('Asalto ' + (round + 1) + '/4: el rival ataca por ' + sides[(sides.indexOf(safe) + (hard ? 2 : 1)) % 3] + '. ¿Cómo respondes?', ['Esquivar a la izquierda', 'Cubrirse en el centro', 'Esquivar a la derecha'], sides.indexOf(safe), () => { round++; score++; progress('Asaltos superados'); next(); });
          }; next();
        } else if (mode === 'runner') {
          const lanes = ['izquierda', 'centro', 'derecha']; const next = () => {
            if (round >= quota) return win();
            const safe = rand(3); const token = rand(3);
            options('Tramo ' + (round + 1) + '/' + quota + ': obstáculo en ' + lanes[(safe + (hard ? 1 : 2)) % 3] + '. Elige un carril y recoge energía si puedes.', lanes.map((l, i) => l + (i === token ? ' · carga' : '')), safe, () => { round++; score++; progress('Ruta completada'); next(); });
          }; next();
        } else if (mode === 'scrap') {
          const next = () => { if (score >= quota) return win(); const clean = rand(2) === 0; options('Pieza ' + (score + 1) + ': ' + (clean ? 'metal intacto y sin residuos' : 'metal con residuo químico verde') + '. ¿La recuperas?', ['Recuperar para reutilizar', 'Aislar como contaminada'], clean ? 0 : 1, () => { score++; progress('Piezas clasificadas'); next(); }); }; next();
        } else if (mode === 'stealth') {
          const next = () => { if (round >= quota) return win(); const gap = rand(2) === 0; options('Patrulla ' + (round + 1) + '/' + quota + ': ' + (gap ? 'los guardias se alejan y dejan un hueco' : 'la pasarela sigue vigilada') + '.', ['Cruzar ahora', 'Esperar oculto'], gap ? 0 : 1, () => { round++; score++; progress('Tramos sin alarma'); next(); }); }; next();
        } else if (mode === 'contain') {
          const next = () => { if (score >= quota) return win(); const leak = rand(3); options('Fuga ' + (score + 1) + '/' + quota + ': identifica la válvula que vibra y desprende vapor.', ['Válvula A', 'Válvula B', 'Válvula C'], leak, () => { score++; progress('Fugas contenidas'); next(); }); }; next();
        } else {
          options('Analiza la situación antes de actuar.', ['Examinar pistas y actuar con seguridad', 'Ignorar el riesgo', 'Forzar el mecanismo'], 0, win);
        }
      }
      close.onclick = () => finish(false);
      host.addEventListener('keydown', (e) => { if (e.key === 'Escape') finish(false); });
      button('Salir del reto', () => finish(false));
      startMode(); close.focus();
    });
  }
  window.Minigames = {
    ...base, GAMES: G, CATALOG: C, CITY_GAMES: CG, PLACE_GAMES: PG, play, list,
    forCity: (city) => list(CG[city] || []),
    forPlace: (id) => list((PG[id] || []).filter((key) => C[key]?.city === cityOfPlace(id))),
    isAvailable: available, activeCity, maxGames: Object.keys(C).length, renderer: '2d-html',
  };
})();
