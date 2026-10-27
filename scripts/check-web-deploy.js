// Comprueba la carpeta exacta que Render publicará. No necesita dependencias externas.
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const out = path.join(root, 'web-dist');
const required = [
  'index.html',
  'privacidad.html',
  'icono-arcane.svg',
  'assets/img/arte/portada-ia.svg',
  'menu.js',
  'css/estilos.css',
  'assets/img/ciudades/piltover/panorama-t1.webp',
  'assets/img/ciudades/piltover/academia-fachada.webp',
  'assets/img/ciudades/zaun/centro.jpg',
  'assets/img/ciudades/zaun/mercado.png',
  'assets/img/personajes/vi.webp',
  'assets/img/interfaz/icono-arcane.svg',
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

// Comprueba también los url(...) del CSS; la mayoría de fondos se resuelven desde css/estilos.css.
const cssFiles = [];
function findCss(dir) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) findCss(full);
    else if (st.isFile() && /\.css$/i.test(name)) cssFiles.push(full);
  }
}
if (fs.existsSync(out)) findCss(out);
for (const file of cssFiles) {
  const body = fs.readFileSync(file, 'utf8');
  for (const match of body.matchAll(/url\(\s*(['"]?)(.*?)\1\s*\)/gi)) {
    const raw = match[2].trim();
    if (!raw || raw.startsWith('#') || /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(raw)) continue;
    const clean = decodeURIComponent(raw.split(/[?#]/, 1)[0]);
    if (!clean) continue;
    const resolved = path.resolve(path.dirname(file), clean);
    if (resolved !== out && !resolved.startsWith(out + path.sep)) {
      fail(path.relative(out, file) + ' intenta salir de web-dist por CSS: ' + raw);
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

// La publicación es informativa: no debe desplegar una demo jugable o restos de páginas de prueba.
function scanPublic(dir) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) {
      if (/^demo(?:$|[-_.])/i.test(name)) fail('directorio de demo no autorizado en web-dist: ' + path.relative(out, full));
      scanPublic(full);
    } else if (st.isFile()) {
      if (/^demo(?:$|[-_.])/i.test(name)) fail('archivo de demo no autorizado en web-dist: ' + path.relative(out, full));
      if (/\.(?:html|css|js)$/i.test(name)) {
        const body = fs.readFileSync(full, 'utf8');
        if (/(?:href|src)\s*=\s*["'][^"']*demo(?:\.html|[-_/])/i.test(body)) {
          fail(path.relative(out, full) + ' contiene un enlace a una demo');
        }
      }
    }
  }
}
if (fs.existsSync(out)) scanPublic(out);

const index = path.join(out, 'index.html');
if (fs.existsSync(index)) {
  const html = fs.readFileSync(index, 'utf8');
  if (/<figure class="portada-personajes"/.test(html)) fail('la portada todavía muestra los retratos de Vi/Jinx en el inicio');
  if (!html.includes('rel="icon" href="icono-arcane.svg"')) fail('el favicon no usa icono-arcane.svg, el icono único del proyecto');
  if (html.includes('icono.png')) fail('index.html aún referencia el icono alternativo icono.png');
  for (const token of ['{{VERSION}}', '{{PERSONAJES}}', '{{LUGARES}}', '{{CAPTURAS}}']) {
    if (html.includes(token)) fail('quedó una plantilla sin reemplazar: ' + token);
  }
}
if (process.exitCode) process.exit(process.exitCode);
console.log('✓ check:web — web-dist está lista para Render y sus referencias locales existen.');
