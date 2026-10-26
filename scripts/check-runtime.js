// Comprueba recursos locales y módulos de exploración antes de generar un EXE.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const src = path.join(root, 'src');
const html = fs.readFileSync(path.join(src, 'index.html'), 'utf8');
const errors = [];
/** Registra un error verificable sin interrumpir las demás comprobaciones. */
function ensure(ok, message) { if (!ok) errors.push(message); }
/** Verifica que todos los scripts locales declarados en la ventana existan y sean JavaScript válido. */
for (const m of html.matchAll(/<script\s+src="([^"]+)"\s*><\/script>/g)) {
  const url = m[1];
  if (/^https?:/.test(url)) continue;
  const file = path.resolve(src, url);
  ensure(file.startsWith(src + path.sep) && fs.existsSync(file), 'Falta el módulo: ' + url);
  if (fs.existsSync(file) && file.endsWith('.js')) {
    try { new vm.Script(fs.readFileSync(file, 'utf8'), { filename: url }); }
    catch (e) { errors.push('Error de sintaxis en ' + url + ': ' + e.message); }
  }
}
/** Cada lugar de los dos mapas debe tener su escenario 2D, con una imagen que exista. */
const ctx = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(src, 'js', 'scenes2d.js'), 'utf8'), ctx);
const scenes = ctx.window.Scenes2D;
ensure(!!scenes, 'Scenes2D no se exporta');
const world = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(src, 'data', 'world.js'), 'utf8'), world);
let total = 0;
for (const mapId of ['zaun', 'piltover']) {
  for (const loc of world.window.WORLD.maps[mapId].locations) {
    total++;
    const p = scenes?.PLACES[loc.id];
    ensure(Boolean(p), 'Scenes2D no tiene escenario para ' + loc.id);
    if (p) {
      ensure(p[0] === mapId, loc.id + ' está en ' + mapId + ', no en ' + p[0]);
      ensure(fs.existsSync(path.join(src, p[1])), 'Falta la imagen de ' + loc.id + ': ' + p[1]);
    }
  }
}
if (errors.length) {
  console.error('Errores de recursos:\n' + errors.map(x => ' - ' + x).join('\n'));
  process.exitCode = 1;
} else console.log('OK: scripts locales válidos y ' + total + ' lugares con escenario 2D.');


/** El mapa 3D debe cargar una escena de ciudad modelada, nunca generar la arquitectura por código. */
const world3dFile = path.join(src, 'js', 'world3d.js');
const worldFile = path.join(src, 'js', 'world.js');
const world3dSource = fs.readFileSync(world3dFile, 'utf8');
const worldSource = fs.readFileSync(worldFile, 'utf8');
ensure(
  world3dSource.includes('models/maps/${id}.glb') && world3dSource.includes('GLTFLoader'),
  'World3D debe cargar una escena GLB completa desde models/maps'
);
ensure(
  !['function buildings(', 'function landmarks(', 'function ground(', 'function piltoverWorld(', 'function zaunWorld(', 'function water(']
    .some((signature) => world3dSource.includes(signature)),
  'World3D no debe recrear la arquitectura del mapa mediante generadores geométricos'
);
ensure(
  worldSource.includes('if (!loaded)') &&
  worldSource.includes('use3d(false)') &&
  worldSource.includes('Se mantiene el mapa ilustrado 2D'),
  'Si falta el GLB de la ciudad, el mapa debe volver a 2D'
);
ensure(
  fs.existsSync(path.join(src, 'models', 'maps', 'README.md')) &&
  fs.existsSync(path.join(root, 'tools', 'blender', 'export_arcane_map.py')),
  'Falta la guía de escenarios Blender/GLB o su validador'
);
