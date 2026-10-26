// Monta la página web del juego (carpeta web/) en web-dist/, lista para Render.
// Rellena la plantilla con los datos reales del juego (versión, capítulos, finales, personajes
// y lugares de src/data) y copia solo las imágenes que usa la web, así la página nunca se
// queda atrasada respecto al juego. Uso: npm run web  (luego abre web-dist/index.html).
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const out = path.join(root, 'web-dist');

// Carga los módulos de datos del juego en un contexto aislado y devuelve window.
function loadData() {
  const ctx = { window: {} };
  vm.createContext(ctx);
  for (const f of ['wiki.js', 'creation.js', 'story.js', 'story-expansion.js', 'alternate-fates.js', 'chat.js', 'chat-expansion.js', 'chat-deep.js', 'atlas.js']) {
    vm.runInContext(fs.readFileSync(path.join(root, 'src', 'data', f), 'utf8'), ctx, { filename: f });
  }
  return ctx.window;
}

// Escapa texto para meterlo en HTML.
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// Copia un archivo creando las carpetas que falten.
function copy(from, to) {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
}

function buildCapturas() {
  const carpeta = path.join(root, 'web', 'capturas');
  const permitidas = [
    ['inicio', 'Pantalla de inicio'],
    ['creacion', 'Creación de personaje'],
    ['comunicador', 'Comunicador (sin conversaciones)'],
    ['mapa', 'Mapa del juego'],
    ['codice', 'Códice'],
  ];
  const tarjetas = [];
  for (const [nombre, titulo] of permitidas) {
    const archivo = ['webp', 'png', 'jpg', 'jpeg'].map(ext => nombre + '.' + ext).find(f => fs.existsSync(path.join(carpeta, f)));
    if (!archivo) continue;
    copy(path.join(carpeta, archivo), path.join(out, 'capturas', archivo));
    tarjetas.push('<figure class="captura"><a href="capturas/' + archivo + '" target="_blank" rel="noopener"><img src="capturas/' + archivo + '" alt="' + esc(titulo) + '" loading="lazy"></a><figcaption>' + esc(titulo) + '</figcaption></figure>');
  }
  // Capturas históricas aportadas por la autora, ordenadas por nombre de archivo.
  // Formato recomendado: 01-inicio.webp, 02-menu.png, etc.
  const historia = path.join(root, 'capturasjuego');
  if (fs.existsSync(historia)) {
    const files = fs.readdirSync(historia).filter(name => /^(?!\.)(?!README\.md$)[a-zA-Z0-9][a-zA-Z0-9._-]*\.(webp|png|jpe?g)$/i.test(name)).sort((a,b)=>a.localeCompare(b,'es',{numeric:true}));
    for (const file of files) {
      copy(path.join(historia, file), path.join(out, 'capturasjuego', file));
      const label = file.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ');
      tarjetas.push('<figure class="captura"><a href="capturasjuego/' + encodeURIComponent(file) + '" target="_blank" rel="noopener noreferrer"><img src="capturasjuego/' + encodeURIComponent(file) + '" alt="Captura histórica: ' + esc(label) + '" loading="lazy"></a><figcaption>' + esc(label) + '</figcaption></figure>');
    }
  }
  return tarjetas.join('') || '<p class="galeria-vacia">Las capturas oficiales estarán disponibles próximamente.</p>';
}

// Copia los recursos de estilo y navegación que necesita la portada pública.
function copyWebAssets() {
  const cssDir = path.join(root, 'web', 'css');
  if (!fs.existsSync(cssDir)) throw new Error('Falta web/css/: no se puede construir la web pública.');
  for (const file of fs.readdirSync(cssDir)) {
    const source = path.join(cssDir, file);
    if (fs.statSync(source).isFile()) copy(source, path.join(out, 'css', file));
  }
  const menu = path.join(root, 'web', 'menu.js');
  if (!fs.existsSync(menu)) throw new Error('Falta web/menu.js, requerido por la navegación móvil.');
  copy(menu, path.join(out, 'menu.js'));
}

// Copia una selección del arte oficial de Arcane que ya está documentado en arcaneData/arte/FUENTES.json.
// Se conserva separado del arte propio de la interfaz; el pie de la web informa de los derechos.
function copyOfficialArt() {
  const faceDir = path.join(root, 'src', 'img', 'arte', 'caras');
  if (fs.existsSync(faceDir)) {
    for (const file of fs.readdirSync(faceDir).filter((name) => /\.webp$/i.test(name))) {
      copy(path.join(faceDir, file), path.join(out, 'arte-oficial', 'personajes', file));
    }
  }
  const places = [
    // Vistas y lugares de Piltover.
    ['s1/piltover.webp', 'piltover-s1.webp'],
    ['s2/piltover.webp', 'piltover-s2.webp'],
    ['s1/plaza.webp', 'plaza-piltover-s1.webp'],
    ['s1/hexpuertas.webp', 'hexpuertas-piltover-s1.webp'],
    ['s1/puente.webp', 'puente-piltover-s1.webp'],
    ['s1/taller-jayce.webp', 'taller-piltover-s1.webp'],
    ['s1/artesanos.webp', 'artesanos-piltover-s1.webp'],
    ['s2/consejo.webp', 'consejo-piltover-s2.webp'],
    ['s2/mansion-kiramman.webp', 'mansion-kiramman-piltover-s2.webp'],
    ['s1/stillwater.webp', 'stillwater-piltover-s1.webp'],
    // Vistas y lugares de Zaun.
    ['s1/zaun.webp', 'zaun-s1.webp'],
    ['s2/zaun.webp', 'zaun-s2.webp'],
    ['s1/mercado.webp', 'mercado-zaun-s1.webp'],
    ['s1/arbol.webp', 'firelights-zaun-s1.webp'],
    ['s1/ultima-gota.webp', 'ultima-gota-zaun-s1.webp'],
    ['s1/fabrica.webp', 'fabrica-zaun-s1.webp'],
    ['s1/sumidero.webp', 'sumidero-zaun-s1.webp'],
    ['s1/tejados.webp', 'tejados-zaun-s1.webp'],
    ['s2/callejones.webp', 'callejones-zaun-s2.webp'],
    ['s2/invernadero.webp', 'invernadero-zaun-s2.webp'],
    ['s2/escondite-jinx.webp', 'escondite-jinx-s2.webp'],
    ['s1/puente-zaun.webp', 'puente-zaun-s1.webp'],
  ];
  const placesDir = path.join(root, 'src', 'img', 'arte', 'lugares');
  for (const [src, dest] of places) {
    const full = path.join(placesDir, src);
    if (fs.existsSync(full)) copy(full, path.join(out, 'arte-oficial', 'lugares', dest));
  }
  // Imágenes sueltas en la raíz de lugares (versiones de referencia de la web y del Códice).
  const sueltas = [
    ['academia.webp', 'academia-piltover.webp'],
    ['consejo.webp', 'consejo-piltover.webp'],
    ['mansion-kiramman.png', 'mansion-kiramman-piltover.png'],
  ];
  for (const [src, dest] of sueltas) {
    const full = path.join(placesDir, src);
    if (fs.existsSync(full)) copy(full, path.join(out, 'arte-oficial', 'lugares', dest));
  }
  // Mapa ilustrado de las Dos Ciudades usado por el Códice del juego.
  const mapa = path.join(root, 'src', 'img', 'arte', 'codice', 'mapa-piltover-zaun.webp');
  if (fs.existsSync(mapa)) copy(mapa, path.join(out, 'arte-oficial', 'mapa', 'mapa-piltover-zaun.webp'));
}

// Tarjetas de personajes con los retratos oficiales que existen para su ID (sin spoilers: solo el resumen).
const CIUDADES = { zaun: 'Zaun', piltover: 'Piltover', noxus: 'Noxus' };
function repartoHtml(personajes) {
  return personajes.map((p) => {
    const portrait = path.join(root, 'src', 'img', 'arte', 'caras', p.id + '.webp');
    const hasPortrait = fs.existsSync(portrait);
    const art = hasPortrait ? '<img class="ficha-retrato" src="arte-oficial/personajes/' + esc(p.id) + '.webp" alt="Retrato de referencia de ' + esc(p.name) + '" loading="lazy">' : '';
    return '<article class="ficha ficha-' + esc(p.origin) + (hasPortrait ? ' ficha-con-retrato' : '') + '">' + art +
      '<p class="ficha-ciudad">' + esc(CIUDADES[p.origin] || p.origin) + '</p><h3>' + esc(p.name) + '</h3>' +
      '<p class="ficha-alias">' + esc(p.role) + '</p><p>' + esc(p.summary) + '</p></article>';
  }).join('');
}

function build() {
  const extra = loadData();
  const { WIKI, STORY, CHAT, ATLAS } = extra;
  const pkg = require(path.join(root, 'package.json'));
  fs.rmSync(out, { recursive: true, force: true });
  fs.mkdirSync(out, { recursive: true });

  // La web combina estilos propios con el arte de referencia seleccionado y documentado.
  copyWebAssets();
  copyOfficialArt();
  const personajes = WIKI.personajes;
  copy(path.join(root, 'build', 'icon.png'), path.join(out, 'icono.png'));
  const lugares = ATLAS.places.map((l) => `<li class="lugar-${esc(l.city)}">${esc(l.name)}</li>`).join('');
  const dialogos = Object.values(CHAT).reduce((n, c) => n + Object.keys(c.nodes || {}).length, 0);

  const datos = {
    VERSION: pkg.version,
    CAPITULOS: STORY.chapters.length,
    FINALES: STORY.endings.length + (STORY.endings2 || []).length,
    PERSONAJES: personajes.length,
    LUGARES: ATLAS.places.length,
    TEMAS: dialogos,
    CAPTURAS: buildCapturas(),
    LISTA_LUGARES: lugares,
    REPARTO: repartoHtml(personajes),
    ANIO: new Date().getFullYear(),
  };
  // Publica solo las páginas y el icono que forman parte del sitio. No se copian
  // README, páginas de desarrollo ni archivos añadidos a web/ por accidente.
  const publicFiles = new Set(['index.html', 'privacidad.html', 'icono-arcane.svg']);
  for (const f of publicFiles) {
    const src = path.join(root, 'web', f);
    if (!fs.existsSync(src) || !fs.statSync(src).isFile()) throw new Error(`Falta el archivo público obligatorio web/${f}`);
    if (/\.html$/i.test(f)) {
      const txt = fs.readFileSync(src, 'utf8').replace(/\{\{(\w+)\}\}/g, (m, k) => (k in datos ? datos[k] : m));
      fs.writeFileSync(path.join(out, f), txt);
    } else copy(src, path.join(out, f));
  }
  // Publicar los mapas mentales originales del diario de desarrollo.
  const notas = path.join(root, 'web', 'notas-desarrollo');
  if (fs.existsSync(notas)) {
    for (const file of fs.readdirSync(notas).filter(f => /^etapa-[1-7]\.svg$/.test(f))) {
      copy(path.join(notas, file), path.join(out, 'notas-desarrollo', file));
    }
  }
  fs.writeFileSync(path.join(out, '.nojekyll'), '');
  console.log(`✓ Web lista en web-dist/ (v${pkg.version}, ${personajes.length} personajes, ${ATLAS.places.length} lugares)`);
}

build();
