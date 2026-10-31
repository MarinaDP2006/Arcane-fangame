// Pruebas de trayectorias analíticas para lanzamientos y blancos móviles.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const context = { window: {} };
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(__dirname, '../src/js/minigames-3d.js'), 'utf8'), context);
const motion = context.window.Minigames.motion;
const position = motion.projectilePosition;
const target = motion.targetPosition;
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
test('el arco del proyectil está limitado y vuelve a caer', () => {
  const mid = position(from, to, .5);
  nearly(mid.y, (from.y + to.y) / 2 + .6);
  for (let i = 0; i <= 100; i++) {
    const t = i / 100, base = from.y + (to.y - from.y) * t;
    const offset = position(from, to, t).y - base;
    assert.ok(offset >= -1e-9 && offset <= .6 + 1e-9);
  }
});
test('el blanco móvil oscila alrededor de su centro sin salirse de la escena', () => {
  const base = { x: 4.2, y: 3.6, z: -5 }, phase = 1.2;
  for (const precision of [false, true]) for (let ms = 0; ms <= 60000; ms += 17) {
    const p = target(base, ms / 1000, phase, precision);
    assert.ok(p.x >= -4.55 && p.x <= 4.55);
    assert.ok(p.y >= 1.05 && p.y <= 3.95);
    assert.equal(p.z, base.z);
  }
  for (const t of [0, 1, 5, 20]) {
    const p = target(base, t, phase, false), same = target(base, t, phase, false);
    nearly(p.x, same.x); nearly(p.y, same.y);
  }
});
test('la posición a igual tiempo es igual con 30, 60 y 120 FPS', () => {
  for (const fps of [30, 60, 120]) {
    let time = 0; for (let i = 0; i < fps; i++) time += 1 / fps;
    const p = target(from, time, .7, true), expected = target(from, 1, .7, true);
    nearly(p.x, expected.x); nearly(p.y, expected.y);
  }
  for (const fps of [30, 60, 120]) {
    let t = 0; for (let frame = 0; frame < fps; frame++) t += (1 / fps) * .5;
    const p = position(from, to, t), expected = position(from, to, .5);
    for (const axis of ['x', 'y', 'z']) nearly(p[axis], expected[axis]);
  }
});
