'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { ENDPOINT, chat } = require('../ollama');

test('Ollama integration is opt-in before any network request', async () => {
  let called = false;
  const result = await chat({ enabled: false, provider: 'off', model: 'qwen3:4b', messages: [{ role: 'user', content: 'hi' }], fetchImpl: async () => { called = true; } });
  assert.match(result.error, /Activa Ollama/);
  assert.equal(called, false);
});

test('request is pinned to loopback, excludes caller URL/headers, and returns text only', async () => {
  let request;
  const result = await chat({ enabled: true, provider: 'ollama', model: 'qwen3:4b', messages: [{ role: 'user', content: 'hola' }], options: { maxTokens: 5000, temperature: 8, stop: ['a', 'b', 'c', 'd', 'e'] }, fetchImpl: async (url, opts) => {
    request = { url, opts };
    return { ok: true, status: 200, json: async () => ({ choices: [{ message: { content: 'Hola.' }, extra: 'ignored' }] }) };
  } });
  assert.equal(request.url, ENDPOINT);
  assert.equal(new URL(request.url).hostname, '127.0.0.1');
  const body = JSON.parse(request.opts.body);
  assert.equal(body.max_tokens, 900);
  assert.equal(body.temperature, 1.5);
  assert.equal(body.stop.length, 4);
  assert.deepEqual(result.data, { choices: [{ message: { content: 'Hola.' } }] });
});

test('rejects invalid roles, oversized histories, and model injection', async () => {
  const opts = { enabled: true, provider: 'ollama', model: 'qwen3:4b', messages: [{ role: 'developer', content: 'x' }], fetchImpl: async () => { throw Error('must not call'); } };
  assert.match((await chat(opts)).error, /Mensaje/);
  assert.match((await chat({ ...opts, model: '../remote' })).error, /modelo/);
  assert.match((await chat({ ...opts, messages: [{ role: 'user', content: 'x'.repeat(30001) }] })).error, /larga/);
});

test('bounds network timeout and maps provider failures to safe errors', async () => {
  let signal;
  const timeout = await chat({ enabled: true, provider: 'ollama', model: 'qwen3:4b', messages: [{ role: 'user', content: 'hi' }], fetchImpl: async (_u, opts) => { signal = opts.signal; const e = Error('timeout'); e.name = 'TimeoutError'; throw e; } });
  assert(signal);
  assert.match(timeout.error, /demasiado/);
  const http = await chat({ enabled: true, provider: 'ollama', model: 'qwen3:4b', messages: [{ role: 'user', content: 'hi' }], fetchImpl: async () => ({ ok: false, status: 500, json: async () => ({ error: 'nope' }) }) });
  assert.match(http.error, /nope/);
});
