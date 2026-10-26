# Web del fangame de Arcane

La portada pública presenta la historia, Piltover, Zaun, los personajes y el arte oficial de referencia usado por el proyecto. Las únicas acciones externas del sitio son **Releases** y **Problemas**; no hay demo jugable en la web.

La sección de capturas de la portada queda vacía hasta que se coloquen imágenes en `web/capturas/` (o en `capturasjuego/` en la raíz): el compilador las copia y las coloca solas.

`npm run web` crea `web-dist/`. El generador copia una selección de arte oficial ya presente en el juego a `web-dist/arte-oficial/`; las fuentes y créditos quedan documentados en `arcaneData/arte/FUENTES.json`.


## Recursos de las ciudades

Las referencias que ya están en el repositorio bajo `src/img/PILTOVER/referencias/` y `src/img/ZAUN/referencias/` se sincronizan desde `arcaneData/arte/mapa/piltover/` y `arcaneData/arte/mapa/zaun/`. La compilación conserva copias con nombres estables en `src/img/arte/lugares/s1` y `src/img/arte/lugares/s2`, que usa el juego y que el generador web selecciona para la galería pública. Las fuentes verificadas y las pendientes de verificar se anotan en `arcaneData/arte/FUENTES.json`.

El favicon del juego se toma de `web/icono-arcane.svg`: `node scripts/art-manifest.js` actualiza `src/icono-arcane.svg` antes de validar o empaquetar.
