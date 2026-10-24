# Servidor de la web (Arcane)

`server/roleplay-server.js` solo sirve la web del juego (`web-dist/`, que monta `npm run web`).
Ya no hace de puente con ninguna IA y no necesita claves.

La única IA del juego es **KoboldCpp**, que corre en el ordenador de cada jugador
(`http://localhost:5001`). El juego y la demo le hablan directamente: ver [`GUIA-KOBOLDCPP.md`](../GUIA-KOBOLDCPP.md).

## Ponerlo en marcha

- En tu PC: `npm run web` y después `npm run serve:web` (puerto 8787).
- En Render: build `node scripts/build-web.js`, start `node server/roleplay-server.js`, health check `/api/health`
  (ver [`GUIA-WEB-RENDER.md`](../GUIA-WEB-RENDER.md)). No hay que poner variables secretas.
  Si el servicio arranca con `node main.js`, fuera de Electron también monta y sirve la web.
- `GET /api/health` responde `{ "ok": true }` para comprobar que está vivo.
