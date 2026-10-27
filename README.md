# Arcane-fangame · Piltover y Zaun

Fangame narrativo gratuito y no oficial ambientado en **Arcane**, temporadas 1 y 2. La versión actual combina historia escrita, decisiones, vínculos, exploración 2D por Piltover y Zaun y minijuegos 3D disponibles según la ciudad.

## Qué incluye el juego

- Creación del personaje y partidas locales.
- Capítulos, escenas y decisiones narrativas.
- Dos ciudades conectadas mediante el mapa 2D.
- Personajes, códice, relaciones y misiones secundarias.
- Catálogo de 15 minijuegos 3D por ciudad: 7 en Piltover y 8 en Zaun, accesibles desde sus localizaciones.
- Aplicación de escritorio para Windows (instalador y versión portable).

## Web pública y Render

La web pública es informativa (no contiene una demo jugable) y se publica en Render desde `main`. El juego completo se distribuye como aplicación de escritorio para Windows. El mapa de exploración sigue siendo 2D; los escenarios 3D se usan en los minijuegos.

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

Los instaladores no se guardan en el repositorio como archivos fuente. GitHub Actions compila dos paquetes de Windows x64 (instalador y portable) y los publica como artefactos temporales del workflow. Para obtener la versión más reciente:

1. Abre [Actions · Compilar Arcane](https://github.com/MarinaDP2006/Arcane-fangame/actions/workflows/compilar.yml).
2. Entra en la ejecución más reciente de la rama `main` que haya terminado correctamente.
3. En la sección **Artifacts**, descarga el paquete `arcane-fangame-1.30.3-windows-x64` (el nombre cambia al actualizar la versión).
4. Descomprime el artefacto ZIP y ejecuta el archivo `Arcane-fangame-1.30.3-Setup.exe` para instalar, o `Arcane-fangame-1.30.3-portable.exe` para usarlo sin instalación.

Los artefactos se conservan durante un periodo limitado. Las versiones publicadas de forma permanente se enlazan en [Releases](https://github.com/MarinaDP2006/Arcane-fangame/releases). Si no aparece ningún artefacto en una ejecución, la compilación aún no ha terminado o ha fallado.

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
