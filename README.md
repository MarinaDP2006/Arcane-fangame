# Arcane-fangame · Piltover y Zaun

Fangame narrativo gratuito y no oficial ambientado en **Arcane**, temporadas 1 y 2. La versión actual combina historia escrita, decisiones, vínculos, exploración 2D por Piltover y Zaun y minijuegos 3D disponibles según la ciudad.

## Qué incluye el juego

- Creación del personaje y partidas locales.
- Capítulos, escenas y decisiones narrativas.
- Dos ciudades conectadas mediante el mapa 2D.
- Personajes, códice, relaciones y misiones secundarias.
- Catálogo de 15 minijuegos 2D por ciudad: 7 en Piltover y 8 en Zaun, accesibles desde sus localizaciones.
- Aplicación de escritorio para Windows (instalador y versión portable).

## Web pública y Render

La web pública es informativa (no contiene una demo jugable) y se publica en Render desde `main`. El juego de escritorio actual es una aplicación Electron con mapa de exploración 2D y minijuegos interactivos 2D; **no** es todavía un juego hecho en Godot ni un mundo 3D continuo de Piltover y Zaun. Los datos de Ollama están preparados en la configuración, pero la conexión está desactivada: la historia y los diálogos no dependen de un modelo local.

- URL pública: https://arcane-fangame.onrender.com/
- Configuración de Render: `render.yaml`.
- `web/index.html`: página pública.
- `scripts/build-web.js`: prepara `web-dist/` con las páginas y recursos públicos.
- `server/roleplay-server.js`: sirve `web-dist/` en el puerto que Render proporciona y expone `/api/health`.
- `npm run check:web`: construye la web y valida que los recursos locales publicados existan.

Render ejecuta `node scripts/build-web.js` durante la compilación y `node server/roleplay-server.js` al iniciar el servicio. Si cambias archivos públicos, comprueba primero `npm run check:web`.

## Recursos de la web

La web no reutiliza rutas internas del ejecutable. Sus imágenes públicas están ordenadas en `web/assets/img/ciudades/piltover/`, `web/assets/img/ciudades/zaun/`, `web/assets/img/personajes/` y `web/assets/img/interfaz/`. Las dos carpetas de ciudades contienen las referencias de `PILTOVER.zip` y `ZAUN.zip`; el generador las publica en `web-dist/assets/img/`.

El favicon canónico es `web/icono-arcane.svg`. `scripts/art-manifest.js` sincroniza el mismo icono con `src/icono-arcane.svg` antes de empaquetar el juego.

## Descargar y ejecutar en Windows

Los instaladores no se guardan como archivos fuente en el repositorio. El workflow compila Windows x64 y adjunta los ejecutables como artefactos temporales; una compilación de Actions no es automáticamente una versión publicada.

- **Versiones permanentes:** mira [Releases](https://github.com/MarinaDP2006/Arcane-fangame/releases). Si la página no muestra una versión, todavía no hay una Release publicada para descargar.
- **Compilación de prueba:** abre [Compilar Arcane · Actions](https://github.com/MarinaDP2006/Arcane-fangame/actions/workflows/compilar.yml), elige la ejecución más reciente de `main` que haya terminado correctamente y baja el artefacto `arcane-fangame-<versión>-windows-x64`. Descomprime el ZIP para encontrar el instalador `Arcane-fangame-<versión>-Setup.exe` y el portable `Arcane-fangame-<versión>-portable.exe`.

Los artefactos de Actions caducan según el periodo de retención de esa ejecución. Comprueba que la compilación terminó correctamente antes de instalarla; no uses una descarga temporal como sustituto de una Release estable.

## Desarrollo

Requisitos: Node.js 22 y npm.

```bash
npm ci
npm run check
npm run check:web
npm start
```

- `npm start`: inicia el juego de escritorio con Electron.
- `npm run check`: valida los datos y la sintaxis del juego.
- `npm run check:web`: genera y comprueba la salida para Render.
- `npm run web`: genera solo la carpeta `web-dist/`.

## Arte y créditos

- `arcaneData/arte/FUENTES.json` documenta la procedencia de los recursos.
- Conserva los originales y comprueba las referencias antes de eliminar o sustituir arte.
- El código está bajo licencia MIT; esta licencia no concede derechos sobre marcas, personajes ni arte de terceros.

Arcane, League of Legends, Piltover, Zaun, sus personajes y su arte pertenecen a sus respectivos titulares. Este es un proyecto de fans independiente, gratuito y no respaldado por Riot Games.
