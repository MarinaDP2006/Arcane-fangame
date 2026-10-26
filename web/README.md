# Web del fangame de Arcane

> **En pocas palabras:** Esta guía trata la parte web del proyecto. Distingue los archivos fuente de la web del resultado generado para publicar; los cambios deben probarse en navegador y no solo en el editor. Si la portada está en reconstrucción, no la presentes como una web terminada hasta comprobar enlaces, imágenes, navegación y diseño adaptable.

La portada pública presenta la historia, Piltover, Zaun, los personajes y el arte oficial de referencia usado por el proyecto. Las únicas acciones externas del sitio son **Releases** y **Problemas**; no hay demo jugable en la web.

- `index.html`: portada, historia, misiones, relaciones, ciudades, personajes, guía y sección de capturas.
- `capturas/`: capturas de pantalla del juego; la galería de la portada queda vacía hasta que se añaden imágenes (el compilador las coloca solas).
- `arte-oficial/`: carpeta generada al compilar la web con imágenes de lugares y retratos procedentes de `src/img/arte/`.
- `arte-propio/`: recursos gráficos propios de la interfaz web.
- `estilos.css`, `menu.js`, `privacidad.html`.

`npm run web` crea `web-dist/`. El generador copia una selección de arte oficial ya presente en el juego a `web-dist/arte-oficial/`; las fuentes y créditos quedan documentados en `arcaneData/arte/FUENTES.json`.

Arcane © Riot Games / Fortiche Production. Proyecto de fans no oficial; las imágenes son material de referencia de sus respectivos propietarios.
