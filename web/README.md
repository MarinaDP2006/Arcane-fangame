# Web del fangame de Arcane

La web pública presenta la historia, Piltover, Zaun, los personajes y el arte de referencia usado por el proyecto. Es una web informativa: **no incluye demo jugable**. Las acciones externas son Releases y Problemas.

## Recursos públicos

- `index.html` enlaza el favicon `icono-arcane.svg` desde esta misma carpeta.
- `assets/img/ciudades/piltover/` contiene imágenes de referencia tomadas de `PILTOVER.zip`.
- `assets/img/ciudades/zaun/` contiene imágenes de referencia tomadas de `ZAUN.zip`.
- `assets/img/personajes/` contiene retratos WebP sincronizados desde `src/img/arte/caras/`.
- `assets/img/interfaz/` contiene el favicon canónico y el icono rasterizado.
- `css/` y `menu.js` contienen el diseño y la navegación responsiva.

Los nombres de imagen de las dos ciudades están estabilizados en minúsculas para que las rutas funcionen igual en Windows y en el Linux de Render. Los originales de referencia se conservan además en `src/img/PILTOVER/referencias/` y `src/img/ZAUN/referencias/`, y las copias que usa el motor del juego están en `src/img/arte/lugares/`.

## Compilar y validar

```bash
npm run check:web
```

Este comando genera `web-dist/` y verifica que existan todos los recursos enlazados. El generador solo publica las páginas autorizadas, el favicon, CSS, navegación y recursos gráficos; no copia notas internas ni páginas de demostración.

## Render

`render.yaml` define el servicio Node:

- Build: `node scripts/build-web.js`
- Start: `node server/roleplay-server.js`
- Health check: `/api/health`

Render debe estar conectado a la rama `main` para desplegar automáticamente al fusionar cambios. Tras el deploy, comprueba `/api/health` y la portada pública en el panel de Render; la configuración del repositorio por sí sola no puede demostrar el estado actual de un servicio alojado.

## Arte y créditos

Los recursos oficiales pertenecen a Riot Games / Fortiche Production y se usan como referencias en este proyecto de fans no oficial. Consulta `arcaneData/arte/FUENTES.json` para las fuentes documentadas. No borres los originales ni cambies las rutas sin ejecutar `npm run check:web`.
