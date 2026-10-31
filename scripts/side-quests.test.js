const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'src/data/side-quests.js'), 'utf8'), ctx);
const quest = ctx.window.SIDE_QUESTS.find((item) => item.id === 'puente-dos-ciudades-historia');
function play(pathChoices) {
  const save = { status: 'active', step: quest.start, history: [], flags: {}, aff: {}, rep: {}, stats: {}, outcome: null };
  for (const id of pathChoices) {
    const step = quest.steps[save.step];
    const choice = step.choices.find((item) => item.id === id);
    assert.ok(choice, `${id} must exist at ${save.step}`);
    save.history.push({ step: save.step, choice: choice.id });
    for (const key of ['aff', 'rep', 'stats']) for (const [name, n] of Object.entries(choice.fx?.[key] || {})) save[key][name] = (save[key][name] || 0) + n;
    for (const flag of choice.fx?.flags || []) save.flags[flag] = true;
    save.outcome = choice.label;
    if (choice.complete) {
      for (const key of ['aff', 'rep', 'stats']) for (const [name, n] of Object.entries(quest.reward?.[key] || {})) save[key][name] = (save[key][name] || 0) + n;
      for (const flag of quest.reward?.flags || []) save.flags[flag] = true;
      save.status = 'completed'; save.flags[quest.completionFlag] = true;
    } else save.step = choice.next;
  }
  return save;
}
test('evacuation-first and negotiation-first create different scenes and durable outcomes', () => {
  const negotiated = play(['observadores', 'registro-publico', 'negociacion-comite']);
  const evacuated = play(['prioridad-civiles', 'acompanar-grupos', 'evacuacion-revision']);
  assert.deepEqual(negotiated.history.map((x) => x.step), ['bloqueo', 'negociacion', 'acuerdo-negociado']);
  assert.deepEqual(evacuated.history.map((x) => x.step), ['bloqueo', 'evacuacion', 'acuerdo-evacuacion']);
  assert.equal(negotiated.status, 'completed'); assert.equal(evacuated.status, 'completed');
  assert.equal(negotiated.flags.sidequest_puente_negociacion, true);
  assert.equal(evacuated.flags.sidequest_puente_evacuacion, true);
  assert.equal(negotiated.flags.sidequest_puente_comite, true);
  assert.equal(evacuated.flags.sidequest_puente_pacto, true);
  assert.equal(negotiated.flags[quest.completionFlag], true);
  assert.equal(evacuated.flags[quest.completionFlag], true);
  assert.notEqual(negotiated.outcome, evacuated.outcome);
  assert.equal(negotiated.rep.piltover, 3);
  assert.equal(evacuated.aff.caitlyn, 2);
});
