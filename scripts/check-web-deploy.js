// Comprueba la carpeta exacta que Render publicará. No necesita dependencias externas.
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const out = path.join(root, 'web-dist');
const required = [
  'index.html',
  'privacidad.html',
  'icono-arcane.svg',
  'icono.png',
  'menu.js',
  'css/estilos.css',
];

function fail(message) {
  console.error('✗ check:web — ' + message);
  process.exitCode = 1;
}

for (const rel of required) {
  const file = path.join(out, rel);
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) fail('falta el archivo obligatorio ' + rel);
}

const htmlFiles = ['index.html', 'privacidad.html'].map((rel) => path.join(out, rel)).filter((f) => fs.existsSync(f));
const localRefs = new Set();
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  if (/demo(?:\.html|[-_])/i.test(html)) fail(path.relative(out, file) + ' aún contiene una referencia explícita a la demo');
  for (const match of html.matchAll(/\b(?:src|href)\s*=\s*["']([^"']+)["']/gi)) {
    const raw = match[1].trim();
    if (!raw || raw.startsWith('#') || /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(raw)) continue;
    const clean = decodeURIComponent(raw.split(/[?#]/, 1)[0]);
    if (!clean) continue;
    const resolved = clean.startsWith('/') ? path.resolve(out, '.' + clean) : path.resolve(path.dirname(file), clean);
    if (resolved !== out && !resolved.startsWith(out + path.sep)) {
      fail(path.relative(out, file) + ' intenta salir de web-dist: ' + raw);
      continue;
    }
    localRefs.add({ file: resolved, from: path.relative(out, file), raw });
  }
}

// Set con objetos no elimina duplicados por valor, por lo que verificamos cada referencia.
for (const ref of localRefs) {
  if (!fs.existsSync(ref.file) || !fs.statSync(ref.file).isFile()) {
    fail(ref.from + ' enlaza un recurso local que no existe: ' + ref.raw);
  }
}

const index = path.join(out, 'index.html');
if (fs.existsSync(index)) {
  const html = fs.readFileSync(index, 'utf8');
  for (const token of ['{{VERSION}}', '{{PERSONAJES}}', '{{LUGARES}}', '{{CAPTURAS}}']) {
    if (html.includes(token)) fail('quedó una plantilla sin reemplazar: ' + token);
  }
}
if (process.exitCode) process.exit(process.exitCode);
console.log('✓ check:web — web-dist está lista para Render y sus referencias locales existen.');
