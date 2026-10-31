// Validación matemática del lanzamiento: sin Electron, GPU ni WebGL.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const context = { window: {} };
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(__dirname, '../src/js/minigames-3d.js'), 'utf8'), context);
const position = context.window.Minigames.motion.projectilePosition;
const from = { x: 0, y: 1.4, z: 4 };
const to = { x: 4, y: 2.6, z: -7 };
const nearly = (a, b) => assert.ok(Math.abs(a - b) < 1e-9, `${a} no es aproximadamente ${b}`);

test('el proyectil parte del origen y llega al blanco fijado', () => {
  for (const axis of ['x', 'y', 'z']) {
    nearly(position(from, to, 0)[axis], from[axis]);
    nearly(position(from, to, 1)[axis], to[axis]);
    nearly(position(from, to, -1)[axis], from[axis]);
    nearly(position(from, to, 2)[axis], to[axis]);
  }
});

test('el arco tiene una altura limitada y vuelve a caer', () => {
  const mid = position(from, to, .5);
  nearly(mid.y, (from.y + to.y) / 2 + .6);
  for (let i = 0; i <= 100; i++) {
    const t = i / 100;
    const baseline = from.y + (to.y - from.y) * t;
    const offset = position(from, to, t).y - baseline;
    assert.ok(offset >= -1e-9 && offset <= .6 + 1e-9);
  }
});

test('la posición a igual tiempo es igual con 30, 60 y 120 fotogramas por segundo', () => {
  const simulations = [30, 60, 120].map((fps) => {
    let t = 0;
    for (let frame = 0; frame < fps; frame++) t += (1 / fps) * .5;
    return position(from, to, t);
  });
  for (const p of simulations.slice(1)) for (const axis of ['x', 'y', 'z']) nearly(p[axis], simulations[0][axis]);
});
