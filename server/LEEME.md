# Servidor de la web (Arcane)

`server/roleplay-server.js` solo sirve la web del juego (`web-dist/`, que monta `npm run web`).
Ya no hace de puente con ninguna IA y no necesita claves.

La única IA del juego es **KoboldCpp**, que corre en el ordenador de cada jugador
(`http://localhost:5001`). El juego y la demo le hablan directamente: ver [`GUIA-KOBOLDCPP.md`](../GUIA-KOBOLDCPP.md).

## Ponerlo en marcha

- En tu PC: `npm run web` y después `npm run serve:web` (puerto 8787).
- En Render: `render.yaml` ya lo configura (build `node scripts/build-web.js`, start `node server/roleplay-server.js`, plan Free).
  No hay que poner variables secretas.
- `GET /api/health` responde `{ "ok": true }` para comprobar que está vivo.
