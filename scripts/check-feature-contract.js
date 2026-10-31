// Contrato mínimo de funciones anunciadas: evita que una compilación verde oculte recursos/rutas rotas.
// Uso: node scripts/check-feature-contract.js (incluido en npm run check).
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const errors = [];
const ensure = (ok, msg) => { if (!ok) errors.push(msg); };
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const ctx = { window: {} };
vm.createContext(ctx);
for (const file of [
  'src/data/wiki.js', 'src/data/creation.js', 'src/data/story.js',
  'src/data/story-expansion.js', 'src/data/alternate-fates.js',
  'src/data/chat.js', 'src/data/chat-expansion.js', 'src/data/chat-deep.js',
  'src/data/relations.js', 'src/data/missions.js', 'src/data/side-quests.js',
  'src/data/world.js', 'src/data/atlas.js',
]) vm.runInContext(read(file), ctx, { filename: file });
const w = ctx.window;
const srcGame = read('src/js/game.js');
const srcApp = read('src/js/app.js');
const html = read('src/index.html');
const sceneCtx = { window: {} };
vm.createContext(sceneCtx);
vm.runInContext(read('src/js/scenes2d.js'), sceneCtx, { filename: 'scenes2d.js' });
const minCtx = { window: w };
vm.createContext(minCtx);
vm.runInContext(read('src/js/minigames-3d.js'), minCtx, { filename: 'minigames-3d.js' });
const min = minCtx.window.Minigames;

// Campaign coverage: both city routes plus the second part must remain connected to existing chapters.
ensure(Boolean(w.STORY?.routes?.piltover?.length), 'Falta la ruta principal de Piltover.');
ensure(Boolean(w.STORY?.routes?.zaun?.length), 'Falta la ruta principal de Zaun.');
ensure(Boolean(w.STORY?.routes?.t2?.length), 'Falta la ruta de la segunda parte/temporada.');
ensure(w.STORY?.parts?.length >= 2, 'La historia debe conservar sus dos partes.');
const chapterIds = new Set(w.STORY.chapters.map(c => c.id));
for (const [route, ids] of Object.entries(w.STORY.routes)) {
  ensure(ids.length > 0, `La ruta ${route} está vacía.`);
  for (const id of ids) ensure(chapterIds.has(id), `La ruta ${route} apunta al capítulo inexistente ${id}.`);
}
ensure((w.STORY.endings?.length || 0) + (w.STORY.endings2?.length || 0) >= 2, 'Faltan finales narrativos.');
// Comprueba los enlaces de cada grafo narrativo: ninguna decisión debe apuntar a una escena inexistente.
for (const chapter of w.STORY.chapters) {
  const nodes = chapter.nodes || {};
  for (const [nodeId, node] of Object.entries(nodes)) {
    if (node.next) ensure(Boolean(nodes[node.next]), `El capítulo ${chapter.id}, nodo ${nodeId}, apunta al nodo inexistente ${node.next}.`);
    for (const choice of node.choices || []) {
      if (choice.next) ensure(Boolean(nodes[choice.next]), `La decisión «${choice.t}» de ${chapter.id}/${nodeId} apunta al nodo inexistente ${choice.next}.`);
      // Las decisiones pueden ser narrativas sin alterar estadísticas; solo validamos los efectos cuando existen.
    }
  }
}
for (const quest of w.SIDE_QUESTS || []) {
  const steps = quest.steps || {};
  ensure(Boolean(quest.location) && Object.values(w.WORLD?.maps || {}).some((m) => (m.locations || []).some((loc) => loc.id === quest.location)), `La historia secundaria ${quest.id} no está conectada a un lugar existente del mapa.`);
  ensure(Boolean(steps[quest.start]), `La historia secundaria ${quest.id} no tiene una escena inicial válida.`);
  for (const [stepId, step] of Object.entries(steps)) for (const choice of step.choices || []) {
    if (choice.next) ensure(Boolean(steps[choice.next]), `La decisión «${choice.label}» de ${quest.id}/${stepId} apunta a una escena inexistente ${choice.next}.`);
  }
}
ensure(srcGame.includes('function applyFx(fx = {})') && srcGame.includes('applyFx(c.fx)'), 'Las decisiones de la historia deben aplicar sus consecuencias al estado de partida.');
ensure(srcGame.includes('quest.location === loc.id') && srcGame.includes('Historia secundaria'), 'Las historias secundarias disponibles deben iniciarse desde su localización del mapa.');

// Missions, side stories, bonds, atlas and exploration need to be present and connected.
ensure(Array.isArray(w.MISSIONS) && w.MISSIONS.length >= 10, 'El catálogo de misiones persistentes está vacío o demasiado reducido.');
ensure(Array.isArray(w.SIDE_QUESTS) && w.SIDE_QUESTS.length >= 5, 'Faltan historias secundarias ramificadas.');
ensure(Object.keys(w.RELATIONS?.chars || {}).length >= 10, 'Faltan datos de relaciones de personajes.');
ensure((w.ATLAS?.places || []).length >= 15, 'El Atlas de las Dos Ciudades está incompleto.');
const cityIds = Object.keys(w.WORLD?.maps || {});
ensure(cityIds.includes('piltover') && cityIds.includes('zaun'), 'Deben existir los dos mapas: Piltover y Zaun.');
const worldPlaces = Object.values(w.WORLD?.maps || {}).flatMap(m => m.locations || []);
ensure(worldPlaces.length >= 20, 'El mundo explorable no contiene suficientes ubicaciones.');

// Every advertised 3D activity must be catalogued, assigned to exactly one city and reachable from a place.
const catalog = min?.CATALOG || {};
const ids = Object.keys(catalog);
ensure(ids.length === 15, `Se esperaban 15 minijuegos 3D; hay ${ids.length}.`);
ensure((min?.CITY_GAMES?.piltover || []).length === 7, 'Piltover debe tener 7 minijuegos 3D.');
ensure((min?.CITY_GAMES?.zaun || []).length === 8, 'Zaun debe tener 8 minijuegos 3D.');
const allAssigned = [...(min?.CITY_GAMES?.piltover || []), ...(min?.CITY_GAMES?.zaun || [])];
ensure(new Set(allAssigned).size === allAssigned.length, 'Hay minijuegos duplicados entre ciudades.');
for (const id of ids) {
  const def = catalog[id];
  ensure(allAssigned.includes(id), `El minijuego ${id} no está asignado a una ciudad.`);
  ensure(Object.values(min.PLACE_GAMES || {}).some(list => list.includes(id)), `El minijuego ${id} no se puede abrir desde ninguna ubicación.`);
  ensure(worldPlaces.some(loc => loc.id === def.scene), `El minijuego ${id} referencia el escenario inexistente ${def.scene}.`);
}

// The city-selection action must pass the selected city into the actual character-creation flow.
ensure(srcApp.includes("Game.newGame()") && srcGame.includes("window.App.go('city-select')"), 'El botón Jugar no abre el selector de ciudad.');
ensure(srcApp.includes("Game.newGame(slot, id)"), 'Elegir ciudad no pasa la ciudad elegida a Game.newGame.');
ensure(srcGame.includes('Creator.start('), 'No se encontró el paso de creación de personaje.');
ensure(srcGame.includes("window.App.go('creator')"), 'Elegir ciudad no lleva al creador de personaje.');
ensure(srcApp.includes("btn('Ajustes', () => App.go('settings'))"), 'Falta el acceso a Ajustes desde el menú.');
const miniHtml = read('src/index.html');
ensure(miniHtml.includes('js/minigames-3d.js'), 'El juego debe cargar el motor de minijuegos 3D.');
ensure(!miniHtml.includes('js/minigames-2d.js'), 'El motor 2D no debe sustituir la experiencia 3D que anuncia el catálogo.');
ensure(min.renderer === 'three-js-webgl', 'El motor 3D debe ser el renderer activo del catálogo.');
ensure(min.GAMES && Object.values(min.GAMES).every((game) => game.mode3d === true), 'Todos los minijuegos publicados deben usar definiciones 3D.');
const mini3d = read('src/js/minigames-3d.js');
ensure(mini3d.includes('new THREE.TubeGeometry(pipe') && mini3d.includes("material('#263b39'") && mini3d.includes('new THREE.CylinderGeometry(.32, .32, .12, 6)'), 'Los escenarios 3D deben conservar sus motivos ambientales diferenciados de tubería zaunita y medallón hexagonal de Piltover.');
ensure(mini3d.includes("if (zaun) {") && mini3d.includes("const marble = material('#b4b6a9'") && mini3d.includes("const brass = material('#c69b4e'"), 'Los motivos de ciudad deben distinguir Zaun de la arquitectura pétrea y de latón de Piltover.');
ensure(miniHtml.indexOf('vendor/three.min.js') < miniHtml.indexOf('js/minigames-3d.js'), 'Three.js debe cargarse antes del motor de minijuegos 3D.');
ensure(miniHtml.indexOf('js/minigames-3d.js') < miniHtml.indexOf('js/game.js'), 'El motor 3D debe estar disponible antes de iniciar el juego.');
ensure(read('web/index.html').includes('minijuegos 3D'), 'La web todavía no anuncia los minijuegos 3D.');

// Verify the canonical Season 2 mansion artwork is actually used and packaged.
const mansion = sceneCtx.window.Scenes2D?.PLACES?.['mansion-kiramman'];
ensure(Boolean(mansion), 'Falta el escenario 2D de la mansión Kiramman.');
if (mansion) {
  ensure(mansion[1].includes('lugares/s2/mansion-kiramman.webp'), 'La mansión Kiramman no usa el arte canónico de la temporada 2.');
  ensure(fs.existsSync(path.join(root, 'src', mansion[1])), `No existe el recurso de la mansión: src/${mansion[1]}.`);
}

// Local scripts and the canonical shared icon must be present for the shipped desktop app.
for (const url of html.split('<script src="').slice(1).map(part => part.split('"')[0])) {
  if (/^https?:/.test(url)) continue;
  ensure(fs.existsSync(path.join(root, 'src', url)), `Falta el script/recurso cargado por el juego: ${url}.`);
}

ensure(html.includes('href="icono-arcane.svg"'), 'El juego no enlaza el icono compartido con la web.');
ensure(fs.existsSync(path.join(root, 'src/icono-arcane.svg')), 'Falta src/icono-arcane.svg.');

if (errors.length) {
  console.error(`✗ Contrato de funciones: ${errors.length} problema(s):\\n - ${errors.join('\\n - ')}`);
  process.exit(1);
}
console.log(`✓ Contrato de funciones: ${w.STORY.chapters.length} capítulos, ${worldPlaces.length} ubicaciones, ${w.MISSIONS.length} misiones, ${w.SIDE_QUESTS.length} historias secundarias y ${ids.length} minijuegos 3D.`);
