# Web del fangame de Arcane

La portada pública presenta la historia, Piltover, Zaun, los personajes y el arte oficial de referencia usado por el proyecto. Las únicas acciones externas del sitio son **Releases** y **Problemas**; no hay demo jugable en la web.

La sección de capturas de la portada queda vacía hasta que se coloquen imágenes en `web/capturas/` (o en `capturasjuego/` en la raíz): el compilador las copia y las coloca solas.

`npm run web` crea `web-dist/`. El generador copia una selección de arte oficial ya presente en el juego a `web-dist/arte-oficial/`; las fuentes y créditos quedan documentados en `arcaneData/arte/FUENTES.json`.
