// Prepara la versión Android/tablet: copia src/ a www/, que es lo que Capacitor mete en el APK.
// Uso: npm run android:sync (después, en android/: gradlew assembleDebug).
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const src = path.join(root, 'src');
const www = path.join(root, 'www');
fs.rmSync(www, { recursive: true, force: true });
fs.cpSync(src, www, { recursive: true });
// La música está versionada en la raíz del repo y se sirve desde www/assets/music/.
const music = path.join(root, 'assets', 'music');
if (fs.existsSync(music)) fs.cpSync(music, path.join(www, 'assets', 'music'), { recursive: true });
// Copia las referencias visuales de la autora a una ruta local dentro del APK.
const inspiration = [
  'CREACION DE PERSONAJES, MENUS Y AJUSTES INSPIRACION.png',
  'INSPIRACION PANTALLAS SEGUN CIUDAD.png',
  'INSPIRACION MODELOS 3D.png',
  'COMO SE VERIAN LOS LUGARES, PANTALLAS Y PERSONAJE EN LAS CIUDADES (CIUDADES CUADRADAS).png',
  'INTERFAZ A MEJORAR DE CREACION Y USABILIDAD.png',
];
for (const file of inspiration) {
  const from = path.join(root, file);
  if (fs.existsSync(from)) {
    const to = path.join(www, 'img', 'inspiracion', file);
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.copyFileSync(from, to);
  }
}
// La consola web de Capacitor sirve el juego desde https://localhost: la CSP de index.html ya
// lo permite con 'self'. Solo se marca la página para que el juego sepa que está en Android.
const html = path.join(www, 'index.html');
fs.writeFileSync(html, fs.readFileSync(html, 'utf8').replace('<html lang="es">', '<html lang="es" data-platform="android">'));
let files = 0, bytes = 0;
(function walk(d) { for (const f of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, f.name); if (f.isDirectory()) walk(p); else { files++; bytes += fs.statSync(p).size; } } })(www);
console.log(`www/ listo: ${files} archivos, ${(bytes / 1048576).toFixed(1)} MB`);
