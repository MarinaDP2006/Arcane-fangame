'use strict';

const ENDPOINT = 'http://127.0.0.1:11434/v1/chat/completions';

function netError(err) {
  if (err?.cause?.code === 'ECONNREFUSED') return 'No hay ningún servicio escuchando en Ollama (¿está abierto?)';
  if (err?.name === 'TimeoutError' || err?.name === 'AbortError') return 'Ollama ha tardado demasiado en responder';
  return String(err?.message || err).slice(0, 500);
}

async function chat({ enabled, provider, model, messages, options = {}, fetchImpl = fetch }) {
  if (enabled !== true || provider !== 'ollama') return { error: 'Activa Ollama local en los ajustes antes de usarlo' };
  if (typeof model !== 'string' || !/^[a-zA-Z0-9][a-zA-Z0-9._:-]{0,99}$/.test(model)) return { error: 'Nombre de modelo de Ollama no válido' };
  if (!Array.isArray(messages) || messages.length < 1 || messages.length > 40) return { error: 'Historial de conversación no válido' };
  let total = 0;
  const safeMessages = [];
  for (const message of messages) {
    if (!message || !['system', 'user', 'assistant'].includes(message.role) || typeof message.content !== 'string') return { error: 'Mensaje de conversación no válido' };
    total += message.content.length;
    if (message.content.length > 12000 || total > 30000) return { error: 'La conversación es demasiado larga' };
    safeMessages.push({ role: message.role, content: message.content });
  }
  const maxTokens = Math.max(1, Math.min(900, Number(options.maxTokens) || 350));
  try {
    const response = await fetchImpl(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, messages: safeMessages,
        temperature: Math.max(0, Math.min(1.5, Number(options.temperature) || 0.9)), max_tokens: maxTokens,
        ...(Array.isArray(options.stop) ? { stop: options.stop.filter((x) => typeof x === 'string').slice(0, 4) } : {}) }),
      signal: AbortSignal.timeout(90000),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) return { error: String(data?.error?.message || data?.error || `Ollama HTTP ${response.status}`).slice(0, 500) };
    const text = data?.choices?.[0]?.message?.content;
    if (typeof text !== 'string' || !text.trim()) return { error: 'Ollama no ha devuelto texto' };
    return { status: response.status, data: { choices: [{ message: { content: text.slice(0, 12000) } }] } };
  } catch (err) { return { error: netError(err) }; }
}

module.exports = { ENDPOINT, chat };
