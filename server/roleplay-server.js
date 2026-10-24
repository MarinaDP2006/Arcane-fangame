// Servidor de la web del juego (rama de Arcane). Solo sirve la página (web-dist/, que monta
// «npm run web») en Render o en tu ordenador.
//
// Ya no hace de puente con ninguna IA: la única IA del juego es KoboldCpp, que corre en el
// ordenador de cada jugador (http://localhost:5001) y a la que el juego habla directamente.
//
// Sin dependencias: basta con Node 18 o superior.
//   node server/roleplay-server.js
// Variables opcionales:
//   PORT        puerto (Render lo pone solo)
//   STATIC_DIR  carpeta de la web que se sirve (web-dist)
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT) || 8787;
const STATIC = path.resolve(process.env.STATIC_DIR || path.join(__dirname, '..', 'web-dist'));
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif', '.ico': 'image/x-icon', '.woff2': 'font/woff2',
  '.woff': 'font/woff', '.ttf': 'font/ttf', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.glb': 'model/gltf-binary', '.txt': 'text/plain; charset=utf-8',
};

// Archivos de la web, sin salir nunca de STATIC.
function serveStatic(req, res, pathname) {
  let rel;
  try { rel = decodeURIComponent(pathname); } catch { return false; }
  let file = path.resolve(STATIC, `.${rel}`);
  if (file !== STATIC && !file.startsWith(STATIC + path.sep)) return false;
  try {
    if (fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    const st = fs.statSync(file);
    res.writeHead(200, {
      'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream',
      'Content-Length': st.size,
      'Cache-Control': /\.html$/.test(file) ? 'no-cache' : 'public, max-age=3600',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'X-Frame-Options': 'DENY',
    });
    if (req.method === 'HEAD') res.end();
    else fs.createReadStream(file).pipe(res);
    return true;
  } catch {
    return false;
  }
}

function send(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
  res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  if (req.method === 'GET' && url.pathname === '/api/health') return send(res, 200, { ok: true, service: 'rifts-arcane-web', ai: 'koboldcpp-local' });
  if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, { error: 'Solo se sirve la web' });
  if (serveStatic(req, res, url.pathname)) return;
  if (url.pathname === '/') return send(res, 200, { ok: true, service: 'rifts-arcane-web' });
  return send(res, 404, { error: 'No encontrado' });
});

// Escucha en todas las interfaces: Render solo da por vivo el servicio si encuentra el puerto abierto.
function start() {
  if (!fs.existsSync(path.join(STATIC, 'index.html'))) console.warn(`Aviso: falta ${STATIC}/index.html. Ejecuta antes «npm run web».`);
  server.listen(PORT, '0.0.0.0', () => console.log(`Web de Arcane escuchando en :${PORT} (${STATIC})`));
  return server;
}

if (require.main === module) start();

module.exports = { server, start };
