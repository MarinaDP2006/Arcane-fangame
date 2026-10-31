const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(__dirname, '../src/js/world-motion.js'), 'utf8'), ctx);
const pose = ctx.window.WorldMotion.markerPose;

test('el marcador quieto no tiene bamboleo', () => {
  for (const t of [0, 40, 100, 500, 1000]) { const p = pose(t, false, 24); assert.equal(p.bob, 0); assert.equal(p.shadowScale, 1); }
});
test('el balanceo está acotado y no altera la posición lógica del jugador', () => {
  const amplitude = Math.min(2, 24 * .07);
  for (let t = 0; t <= 10000; t += 16) {
    const p = pose(t, true, 24);
    assert.ok(Math.abs(p.bob) <= amplitude + 1e-9);
    assert.ok(p.shadowScale >= .84 && p.shadowScale <= 1);
  }
});
test('el movimiento depende del tiempo y no de los pasos de fotograma', () => {
  const periodMs = 2 * Math.PI / .012;
  for (const t of [0, 75, 250, 500]) {
    assert.ok(Math.abs(pose(t, true, 24).bob - pose(t + periodMs, true, 24).bob) < 1e-9);
  }
  function afterOneSecond(fps) { let time = 0; for (let i = 0; i < fps; i++) time += 1000 / fps; return pose(time, true, 24); }
  for (const fps of [30, 60, 120]) assert.ok(Math.abs(afterOneSecond(fps).bob - pose(1000, true, 24).bob) < 1e-9);
});
